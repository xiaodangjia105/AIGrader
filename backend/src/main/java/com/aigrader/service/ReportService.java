package com.aigrader.service;

import com.aigrader.dto.StudentReportDTO;
import com.aigrader.entity.Question;
import com.aigrader.entity.Submission;
import com.aigrader.entity.SubmissionAnswer;
import com.aigrader.entity.User;
import com.aigrader.repository.SubmissionAnswerRepository;
import com.aigrader.repository.SubmissionRepository;
import com.aigrader.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
public class ReportService {

    private final AiConfigService aiConfigService;
    private final SubmissionRepository submissionRepository;
    private final SubmissionAnswerRepository submissionAnswerRepository;
    private final UserRepository userRepository;
    private final QuestionService questionService;

    public ReportService(AiConfigService aiConfigService,
                         SubmissionRepository submissionRepository,
                         SubmissionAnswerRepository submissionAnswerRepository,
                         UserRepository userRepository,
                         QuestionService questionService) {
        this.aiConfigService = aiConfigService;
        this.submissionRepository = submissionRepository;
        this.submissionAnswerRepository = submissionAnswerRepository;
        this.userRepository = userRepository;
        this.questionService = questionService;
    }

    public StudentReportDTO generateReport(Long studentId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found: " + studentId));

        List<Submission> submissions = submissionRepository.findByStudentId(studentId);
        List<SubmissionAnswer> allAnswers = submissions.stream()
                .flatMap(s -> submissionAnswerRepository.findBySubmissionId(s.getId()).stream())
                .collect(Collectors.toList());

        int totalAnswers = allAnswers.size();
        long correctCount = allAnswers.stream().filter(a -> Boolean.TRUE.equals(a.getIsCorrect())).count();
        BigDecimal overallAccuracy = totalAnswers > 0
                ? BigDecimal.valueOf(correctCount).divide(BigDecimal.valueOf(totalAnswers), 4, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        Map<String, List<SubmissionAnswer>> bySubject = new LinkedHashMap<>();
        for (SubmissionAnswer ans : allAnswers) {
            Question q = questionService.getById(ans.getQuestionId());
            bySubject.computeIfAbsent(q.getSubject(), k -> new ArrayList<>()).add(ans);
        }

        List<StudentReportDTO.SubjectAccuracy> subjectAccuracies = new ArrayList<>();
        for (var entry : bySubject.entrySet()) {
            long correct = entry.getValue().stream().filter(a -> Boolean.TRUE.equals(a.getIsCorrect())).count();
            int total = entry.getValue().size();
            BigDecimal acc = BigDecimal.valueOf(correct).divide(BigDecimal.valueOf(total), 4, RoundingMode.HALF_UP);
            subjectAccuracies.add(StudentReportDTO.SubjectAccuracy.builder()
                    .subject(entry.getKey())
                    .accuracy(acc)
                    .totalCount(total)
                    .correctCount((int) correct)
                    .build());
        }

        Map<String, List<SubmissionAnswer>> bySubjectType = new LinkedHashMap<>();
        for (SubmissionAnswer ans : allAnswers) {
            Question q = questionService.getById(ans.getQuestionId());
            String key = q.getSubject() + "|" + q.getType();
            bySubjectType.computeIfAbsent(key, k -> new ArrayList<>()).add(ans);
        }

        List<StudentReportDTO.WeakPoint> weakPoints = new ArrayList<>();
        for (var entry : bySubjectType.entrySet()) {
            long correct = entry.getValue().stream().filter(a -> Boolean.TRUE.equals(a.getIsCorrect())).count();
            int total = entry.getValue().size();
            BigDecimal acc = BigDecimal.valueOf(correct).divide(BigDecimal.valueOf(total), 4, RoundingMode.HALF_UP);
            String[] parts = entry.getKey().split("\\|");
            weakPoints.add(StudentReportDTO.WeakPoint.builder()
                    .subject(parts[0])
                    .questionType(parts[1])
                    .accuracy(acc)
                    .totalCount(total)
                    .correctCount((int) correct)
                    .build());
        }

        weakPoints.sort(Comparator.comparing(StudentReportDTO.WeakPoint::getAccuracy));
        List<StudentReportDTO.WeakPoint> bottom3 = weakPoints.stream().limit(3).collect(Collectors.toList());

        String aiSuggestions = generateAISuggestions(student.getNickname(), subjectAccuracies, bottom3);

        return StudentReportDTO.builder()
                .studentId(studentId)
                .studentName(student.getNickname())
                .totalSubmissions(submissions.size())
                .totalAnswers(totalAnswers)
                .overallAccuracy(overallAccuracy)
                .subjectAccuracies(subjectAccuracies)
                .weakPoints(bottom3)
                .aiSuggestions(aiSuggestions)
                .build();
    }

    private String generateAISuggestions(String studentName,
                                          List<StudentReportDTO.SubjectAccuracy> subjectAccuracies,
                                          List<StudentReportDTO.WeakPoint> weakPoints) {
        StringBuilder sb = new StringBuilder();
        sb.append("学生: ").append(studentName).append("\n");
        sb.append("各学科正确率:\n");
        for (var sa : subjectAccuracies) {
            sb.append(String.format("- %s: %.0f%% (%d/%d)%n",
                    sa.getSubject(), sa.getAccuracy().multiply(BigDecimal.valueOf(100)).doubleValue(),
                    sa.getCorrectCount(), sa.getTotalCount()));
        }
        sb.append("\n薄弱知识点:\n");
        for (var wp : weakPoints) {
            sb.append(String.format("- %s-%s: %.0f%% (%d/%d)%n",
                    wp.getSubject(), wp.getQuestionType(),
                    wp.getAccuracy().multiply(BigDecimal.valueOf(100)).doubleValue(),
                    wp.getCorrectCount(), wp.getTotalCount()));
        }

        String prompt = String.format("""
                你是一位学习顾问，需要为一名学生生成学习建议。

                %s

                请用 150-250 字的篇幅，生成学习建议，包括:
                1. 整体评估（用一句话概括学生的学习状况）
                2. 优势科目分析（指出表现较好的领域，给予鼓励）
                3. 薄弱环节建议（针对弱项提供具体可操作的学习计划和方法）

                请用温暖鼓励的语气，直接返回建议文本，不要使用 markdown 格式。
                """, sb.toString());

        try {
            ChatClient client = aiConfigService.getChatClient();
            if (client == null) {
                return "请先配置AI服务后生成学习建议。";
            }
            String result = client.prompt().user(prompt).call().content();
            return result != null ? result.trim() : "请继续努力学习，保持好习惯。";
        } catch (Exception e) {
            log.error("Failed to generate AI suggestions: {}", e.getMessage());
            return "建议针对薄弱知识点，每天安排30分钟专项训练，配合错题本整理和定期自测。";
        }
    }
}
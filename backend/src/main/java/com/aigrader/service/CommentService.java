package com.aigrader.service;

import com.aigrader.entity.Correction;
import com.aigrader.entity.Question;
import com.aigrader.entity.Submission;
import com.aigrader.entity.SubmissionAnswer;
import com.aigrader.repository.CorrectionRepository;
import com.aigrader.repository.SubmissionAnswerRepository;
import com.aigrader.repository.SubmissionRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class CommentService {

    private final AiConfigService aiConfigService;
    private final SubmissionRepository submissionRepository;
    private final SubmissionAnswerRepository submissionAnswerRepository;
    private final CorrectionRepository correctionRepository;
    private final QuestionService questionService;

    public CommentService(AiConfigService aiConfigService,
                          SubmissionRepository submissionRepository,
                          SubmissionAnswerRepository submissionAnswerRepository,
                          CorrectionRepository correctionRepository,
                          QuestionService questionService) {
        this.aiConfigService = aiConfigService;
        this.submissionRepository = submissionRepository;
        this.submissionAnswerRepository = submissionAnswerRepository;
        this.correctionRepository = correctionRepository;
        this.questionService = questionService;
    }

    @Transactional
    public String generatePersonalizedComment(Long submissionId) {
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new RuntimeException("Submission not found: " + submissionId));

        List<Submission> allSubmissions = submissionRepository.findByStudentId(submission.getStudentId());
        List<SubmissionAnswer> allAnswers = allSubmissions.stream()
                .flatMap(s -> submissionAnswerRepository.findBySubmissionId(s.getId()).stream())
                .collect(Collectors.toList());

        StringBuilder history = new StringBuilder();
        for (SubmissionAnswer ans : allAnswers) {
            Question q = questionService.getById(ans.getQuestionId());
            List<Correction> corrections = correctionRepository.findBySubmissionAnswerId(ans.getId());

            history.append(String.format("- %s | %s | %s | AI评分: %s | AI反馈: %s | 正确答案: %s | 学生答案: %s%n",
                    q.getSubject(), q.getType(), q.getDifficulty(),
                    ans.getAiScore(), ans.getAiFeedback(),
                    q.getAnswer(), ans.getStudentAnswer()));

            for (Correction c : corrections) {
                history.append(String.format("  订正: %s%n", c.getNewAnswer()));
            }
        }

        List<SubmissionAnswer> currentAnswers = submissionAnswerRepository.findBySubmissionId(submissionId);
        StringBuilder currentSummary = new StringBuilder();
        for (SubmissionAnswer ans : currentAnswers) {
            Question q = questionService.getById(ans.getQuestionId());
            currentSummary.append(String.format("- %s | %s | 得分: %s | 反馈: %s%n",
                    q.getContent(), q.getType(), ans.getAiScore(), ans.getAiFeedback()));
        }

        String prompt = String.format("""
                你是一位有经验的教师，需要为一名学生生成本次作业的个性化评语。

                本次作业答题情况:
                %s

                该学生历史答题记录:
                %s

                请基于以上信息，用温暖的鼓励性语言生成一段 150-300 字的个性化评语，需要包含以下四个部分:
                1. 鼓励肯定（肯定学生的努力和已有进步）
                2. 具体进步点（与历史答题相比在哪些方面有所提升）
                3. 待改进方向（本次暴露的薄弱环节）
                4. 学习建议（具体可行的改进方法）

                请直接返回评语文本，不要使用 markdown 格式。
                """, currentSummary.toString(), history.length() > 2000 ? history.substring(0, 2000) : history.toString());

        try {
            ChatClient client = aiConfigService.getChatClient();
            if (client == null) {
                String fallback = "该生本次作业整体表现良好，部分知识点需要加强巩固。请继续保持努力！";
                submission.setTeacherPersonalComment(fallback);
                submissionRepository.save(submission);
                return fallback;
            }
            String comment = client.prompt().user(prompt).call().content();
            comment = comment != null ? comment.trim() : "";
            submission.setTeacherPersonalComment(comment);
            submissionRepository.save(submission);
            log.info("Generated personalized comment for submission {}", submissionId);
            return comment;
        } catch (Exception e) {
            log.error("Failed to generate comment for submission {}: {}", submissionId, e.getMessage());
            String fallback = "该生本次作业整体表现良好，部分知识点需要加强巩固。请继续保持努力！";
            submission.setTeacherPersonalComment(fallback);
            submissionRepository.save(submission);
            return fallback;
        }
    }

    public String getComment(Long submissionId) {
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new RuntimeException("Submission not found: " + submissionId));
        return submission.getTeacherPersonalComment();
    }
}
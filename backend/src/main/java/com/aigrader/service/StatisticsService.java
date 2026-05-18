package com.aigrader.service;

import com.aigrader.dto.AiAccuracyDetailDTO;
import com.aigrader.dto.AiAccuracyTrendDTO;
import com.aigrader.entity.Assignment;
import com.aigrader.entity.Question;
import com.aigrader.entity.Submission;
import com.aigrader.entity.SubmissionAnswer;
import com.aigrader.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StatisticsService {

    private final SubmissionRepository submissionRepository;
    private final SubmissionAnswerRepository submissionAnswerRepository;
    private final AssignmentRepository assignmentRepository;
    private final ClassGroupRepository classGroupRepository;
    private final UserRepository userRepository;
    private final QuestionRepository questionRepository;

    public Map<String, Object> getClassStats(Long classId) {
        var classGroup = classGroupRepository.findById(classId)
                .orElseThrow(() -> new RuntimeException("Class not found"));
        var students = userRepository.findByClassId(classId);
        List<Assignment> assignments = assignmentRepository.findByClassId(classId);

        long totalSubmissions = 0;
        BigDecimal totalScore = BigDecimal.ZERO;
        long scoredCount = 0;

        for (Assignment assignment : assignments) {
            List<Submission> subs = submissionRepository.findByAssignmentId(assignment.getId());
            totalSubmissions += subs.size();
            for (Submission sub : subs) {
                List<SubmissionAnswer> answers = submissionAnswerRepository.findBySubmissionId(sub.getId());
                for (SubmissionAnswer ans : answers) {
                    BigDecimal score = ans.getFinalScore() != null ? ans.getFinalScore() : ans.getAiScore();
                    if (score != null) {
                        totalScore = totalScore.add(score);
                        scoredCount++;
                    }
                }
            }
        }

        Map<String, Object> stats = new HashMap<>();
        stats.put("className", classGroup.getName());
        stats.put("totalStudents", students.size());
        stats.put("totalAssignments", assignments.size());
        stats.put("totalSubmissions", totalSubmissions);
        stats.put("averageScore", scoredCount > 0
                ? totalScore.divide(BigDecimal.valueOf(scoredCount), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO);
        stats.put("completionRate", (students.size() > 0 && assignments.size() > 0)
                ? (double) totalSubmissions / (students.size() * assignments.size())
                : 0.0);
        return stats;
    }

    public Map<String, Object> getStudentStats(Long studentId) {
        List<Submission> submissions = submissionRepository.findByStudentId(studentId);
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalSubmissions", submissions.size());
        stats.put("studentId", studentId);
        return stats;
    }

    public Map<String, Object> getAiAccuracy() {
        List<SubmissionAnswer> reviewed = submissionAnswerRepository.findReviewedAnswers();

        Set<Long> submissionIds = reviewed.stream()
                .map(SubmissionAnswer::getSubmissionId)
                .collect(Collectors.toSet());
        List<Submission> submissions = submissionRepository.findAllById(submissionIds);
        Map<Long, LocalDate> submissionDateMap = submissions.stream()
                .collect(Collectors.toMap(Submission::getId, s -> s.getSubmittedAt().toLocalDate()));

        Map<String, List<BigDecimal>> deviationsByDate = new LinkedHashMap<>();
        BigDecimal totalDeviation = BigDecimal.ZERO;
        int misjudgedCount = 0;

        for (SubmissionAnswer ans : reviewed) {
            BigDecimal deviation = ans.getAiScore().subtract(ans.getFinalScore()).abs();
            totalDeviation = totalDeviation.add(deviation);
            if (deviation.compareTo(BigDecimal.valueOf(2)) >= 0) {
                misjudgedCount++;
            }

            LocalDate date = submissionDateMap.get(ans.getSubmissionId());
            if (date == null) continue;
            String dateKey = date.format(DateTimeFormatter.ISO_LOCAL_DATE);
            deviationsByDate.computeIfAbsent(dateKey, k -> new ArrayList<>()).add(deviation);
        }

        long totalQuestions = questionRepository.count();
        long totalGraded = submissionAnswerRepository.count();
        long totalReviewed = reviewed.size();
        double reviewRate = totalGraded > 0 ? (double) totalReviewed / totalGraded : 0.0;
        BigDecimal avgDeviation = totalReviewed > 0
                ? totalDeviation.divide(BigDecimal.valueOf(totalReviewed), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;
        double overallMisjudgmentRate = totalReviewed > 0 ? (double) misjudgedCount / totalReviewed : 0.0;

        List<AiAccuracyTrendDTO> trend = deviationsByDate.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(entry -> {
                    List<BigDecimal> devs = entry.getValue();
                    BigDecimal sum = devs.stream().reduce(BigDecimal.ZERO, BigDecimal::add);
                    BigDecimal avg = sum.divide(BigDecimal.valueOf(devs.size()), 2, RoundingMode.HALF_UP);
                    long misjudged = devs.stream().filter(d -> d.compareTo(BigDecimal.valueOf(2)) >= 0).count();
                    return AiAccuracyTrendDTO.builder()
                            .date(entry.getKey())
                            .totalReviewed(devs.size())
                            .misjudgmentRate(devs.size() > 0 ? (double) misjudged / devs.size() : 0.0)
                            .avgDeviation(avg)
                            .build();
                })
                .collect(Collectors.toList());

        Map<String, Object> result = new HashMap<>();
        result.put("totalQuestions", totalQuestions);
        result.put("totalGraded", totalGraded);
        result.put("totalReviewed", totalReviewed);
        result.put("reviewRate", reviewRate);
        result.put("misjudgmentRate", overallMisjudgmentRate);
        result.put("avgDeviation", avgDeviation);
        result.put("trend", trend);
        return result;
    }

    public List<AiAccuracyDetailDTO> getAiAccuracyDetail() {
        List<SubmissionAnswer> reviewed = submissionAnswerRepository.findReviewedAnswers();

        Set<Long> submissionIds = new HashSet<>();
        Set<Long> questionIds = new HashSet<>();
        for (SubmissionAnswer ans : reviewed) {
            BigDecimal deviation = ans.getAiScore().subtract(ans.getFinalScore()).abs();
            if (deviation.compareTo(BigDecimal.valueOf(2)) >= 0) {
                submissionIds.add(ans.getSubmissionId());
                questionIds.add(ans.getQuestionId());
            }
        }

        Map<Long, Submission> submissionMap = submissionRepository.findAllById(submissionIds).stream()
                .collect(Collectors.toMap(Submission::getId, s -> s));
        Map<Long, Question> questionMap = questionRepository.findAllById(questionIds).stream()
                .collect(Collectors.toMap(Question::getId, q -> q));

        return reviewed.stream()
                .filter(ans -> {
                    BigDecimal deviation = ans.getAiScore().subtract(ans.getFinalScore()).abs();
                    return deviation.compareTo(BigDecimal.valueOf(2)) >= 0;
                })
                .map(ans -> {
                    BigDecimal deviation = ans.getAiScore().subtract(ans.getFinalScore()).abs();
                    Submission sub = submissionMap.get(ans.getSubmissionId());
                    Question q = questionMap.get(ans.getQuestionId());
                    return AiAccuracyDetailDTO.builder()
                            .answerId(ans.getId())
                            .submissionId(ans.getSubmissionId())
                            .questionId(ans.getQuestionId())
                            .questionContent(q != null ? q.getContent() : "δ֪��Ŀ")
                            .aiScore(ans.getAiScore())
                            .finalScore(ans.getFinalScore())
                            .deviation(deviation)
                            .date(sub != null ? sub.getSubmittedAt().toLocalDate().format(DateTimeFormatter.ISO_LOCAL_DATE) : "")
                            .build();
                })
                .sorted((a, b) -> b.getDeviation().compareTo(a.getDeviation()))
                .collect(Collectors.toList());
    }
}
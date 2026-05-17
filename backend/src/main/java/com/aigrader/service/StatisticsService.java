package com.aigrader.service;

import com.aigrader.entity.Assignment;
import com.aigrader.entity.Submission;
import com.aigrader.entity.SubmissionAnswer;
import com.aigrader.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class StatisticsService {

    private final SubmissionRepository submissionRepository;
    private final SubmissionAnswerRepository submissionAnswerRepository;
    private final AssignmentRepository assignmentRepository;
    private final ClassGroupRepository classGroupRepository;
    private final UserRepository userRepository;

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
}

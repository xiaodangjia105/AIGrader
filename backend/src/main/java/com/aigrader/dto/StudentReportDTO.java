package com.aigrader.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data @Builder
@NoArgsConstructor @AllArgsConstructor
public class StudentReportDTO {
    private Long studentId;
    private String studentName;
    private int totalSubmissions;
    private int totalAnswers;
    private BigDecimal overallAccuracy;
    private List<SubjectAccuracy> subjectAccuracies;
    private List<WeakPoint> weakPoints;
    private String aiSuggestions;

    @Data @Builder
    @NoArgsConstructor @AllArgsConstructor
    public static class SubjectAccuracy {
        private String subject;
        private BigDecimal accuracy;
        private int totalCount;
        private int correctCount;
    }

    @Data @Builder
    @NoArgsConstructor @AllArgsConstructor
    public static class WeakPoint {
        private String subject;
        private String questionType;
        private BigDecimal accuracy;
        private int totalCount;
        private int correctCount;
    }
}
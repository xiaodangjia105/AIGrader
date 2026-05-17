package com.aigrader.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data @Builder
@NoArgsConstructor @AllArgsConstructor
public class ReviewDTO {
    private BigDecimal finalScore;
    private String teacherComment;
}

@Data @Builder
@NoArgsConstructor @AllArgsConstructor
class CorrectionDTO {
    private Long submissionAnswerId;
    private String newAnswer;
}

@Data @Builder
@NoArgsConstructor @AllArgsConstructor
class StatisticsDTO {
    private Long totalStudents;
    private Long submittedCount;
    private BigDecimal averageScore;
    private BigDecimal completionRate;
}

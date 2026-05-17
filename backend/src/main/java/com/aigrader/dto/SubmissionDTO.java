package com.aigrader.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data @Builder
@NoArgsConstructor @AllArgsConstructor
public class SubmissionDTO {
    private Long id;
    private Long assignmentId;
    private Long studentId;
    private String status;
    private LocalDateTime submittedAt;
    private LocalDateTime aiGradedAt;
    private List<AnswerDTO> answers;
    private BigDecimal totalScore;
    private BigDecimal totalPossibleScore;
}

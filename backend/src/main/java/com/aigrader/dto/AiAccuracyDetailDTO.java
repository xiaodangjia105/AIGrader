package com.aigrader.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data @Builder
@NoArgsConstructor @AllArgsConstructor
public class AiAccuracyDetailDTO {
    private Long answerId;
    private Long submissionId;
    private Long questionId;
    private String questionContent;
    private BigDecimal aiScore;
    private BigDecimal finalScore;
    private BigDecimal deviation;
    private String date;
}
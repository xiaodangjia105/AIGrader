package com.aigrader.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data @Builder
@NoArgsConstructor @AllArgsConstructor
public class AnswerDTO {
    private Long questionId;
    private String studentAnswer;
    private BigDecimal score;
    private BigDecimal contentScore;
    private BigDecimal logicScore;
    private BigDecimal expressionScore;
    private String aiFeedback;
    private Boolean isCorrect;
}

@Data @Builder
@NoArgsConstructor @AllArgsConstructor
class GradingResultDTO {
    private Long answerId;
    private Long questionId;
    private String studentAnswer;
    private BigDecimal aiScore;
    private String aiFeedback;
    private BigDecimal aiConfidence;
    private Boolean isCorrect;
    private Boolean needsReview;
    private BigDecimal contentScore;
    private BigDecimal logicScore;
    private BigDecimal expressionScore;
}

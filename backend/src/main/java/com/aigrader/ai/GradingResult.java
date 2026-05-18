package com.aigrader.ai;

import java.math.BigDecimal;
import java.util.Map;

public record GradingResult(
        BigDecimal score,
        String feedback,
        BigDecimal confidence,
        boolean isCorrect,
        boolean needsReview,
        Map<String, BigDecimal> dimensionScores
) {
    public GradingResult(BigDecimal score, String feedback, BigDecimal confidence, boolean isCorrect, boolean needsReview) {
        this(score, feedback, confidence, isCorrect, needsReview, null);
    }

    public static GradingResult withDimensions(
            BigDecimal score,
            String feedback,
            BigDecimal confidence,
            boolean isCorrect,
            boolean needsReview,
            BigDecimal contentScore,
            BigDecimal logicScore,
            BigDecimal expressionScore) {
        Map<String, BigDecimal> dims = Map.of(
                "contentScore", contentScore,
                "logicScore", logicScore,
                "expressionScore", expressionScore);
        return new GradingResult(score, feedback, confidence, isCorrect, needsReview, dims);
    }
}

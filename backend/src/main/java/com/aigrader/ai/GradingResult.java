package com.aigrader.ai;

import java.math.BigDecimal;

public record GradingResult(
        BigDecimal score,
        String feedback,
        BigDecimal confidence,
        boolean isCorrect,
        boolean needsReview
) {}

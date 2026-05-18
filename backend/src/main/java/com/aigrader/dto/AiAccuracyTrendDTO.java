package com.aigrader.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data @Builder
@NoArgsConstructor @AllArgsConstructor
public class AiAccuracyTrendDTO {
    private String date;
    private int totalReviewed;
    private double misjudgmentRate;
    private BigDecimal avgDeviation;
}
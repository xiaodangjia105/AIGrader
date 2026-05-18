package com.aigrader.dto;

public record AiConfigDTO(
        String apiKey,
        String baseUrl,
        String model,
        Double temperature
) {}

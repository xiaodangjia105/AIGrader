package com.aigrader.controller;

import com.aigrader.common.ApiResponse;
import com.aigrader.entity.AiConfig;
import com.aigrader.repository.AiConfigRepository;
import com.aigrader.service.AiConfigService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/ai-config")
@RequiredArgsConstructor
public class AdminAiConfigController {

    private final AiConfigService aiConfigService;
    private final AiConfigRepository aiConfigRepository;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Map<String, String>> getConfig() {
        return ApiResponse.success(aiConfigService.getConfigForDisplay());
    }

    @PutMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Map<String, String>> updateConfig(@RequestBody Map<String, String> body) {
        String apiKey = body.get("apiKey");
        String model = body.getOrDefault("model", "deepseek-chat");
        String baseUrl = body.getOrDefault("baseUrl", "https://api.deepseek.com");

        if (apiKey == null || apiKey.isBlank()) {
            return ApiResponse.error(400, "API Key is required");
        }

        AiConfig config = AiConfig.builder()
                .apiKey(apiKey)
                .model(model)
                .baseUrl(baseUrl)
                .isActive(true)
                .createdAt(LocalDateTime.now())
                .build();

        aiConfigService.updateConfig(config);
        return ApiResponse.success(Map.of(
                "message", "AI configuration updated successfully",
                "model", model));
    }
}

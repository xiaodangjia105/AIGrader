package com.aigrader.service;

import com.aigrader.entity.AiConfig;
import com.aigrader.repository.AiConfigRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.ai.openai.OpenAiChatOptions;
import org.springframework.ai.openai.api.OpenAiApi;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AiConfigService {

    private final AiConfigRepository aiConfigRepository;
    private volatile ChatClient activeChatClient;

    @PostConstruct
    public void init() {
        aiConfigRepository.findByIsActiveTrue().ifPresentOrElse(
                this::applyConfig,
                () -> log.info("No active AiConfig found, using default ChatClient from application.yml"));
    }

    public Optional<AiConfig> getActiveConfig() {
        return aiConfigRepository.findByIsActiveTrue();
    }

    public AiConfig updateConfig(AiConfig newConfig) {
        aiConfigRepository.findByIsActiveTrue().ifPresent(existing -> {
            existing.setIsActive(false);
            aiConfigRepository.save(existing);
        });

        newConfig.setIsActive(true);
        AiConfig saved = aiConfigRepository.save(newConfig);
        applyConfig(saved);
        log.info("Switched AI config to model: {}", saved.getModel());
        return saved;
    }

    public ChatClient getChatClient() {
        ChatClient client = activeChatClient;
        if (client != null) {
            return client;
        }
        throw new IllegalStateException("No active AI config. Configure via /api/admin/ai-config first.");
    }

    private void applyConfig(AiConfig config) {
        OpenAiApi openAiApi = OpenAiApi.builder()
                .baseUrl(config.getBaseUrl())
                .apiKey(config.getApiKey())
                .build();

        OpenAiChatOptions options = OpenAiChatOptions.builder()
                .model(config.getModel())
                .temperature(0.3)
                .build();

        OpenAiChatModel chatModel = OpenAiChatModel.builder()
                .openAiApi(openAiApi)
                .defaultOptions(options)
                .build();

        this.activeChatClient = ChatClient.builder(chatModel).build();
        log.info("ChatClient rebuilt with model: {}, baseUrl: {}", config.getModel(), config.getBaseUrl());
    }

    public Map<String, String> getConfigForDisplay() {
        return aiConfigRepository.findByIsActiveTrue()
                .map(c -> {
                    String maskedKey = maskApiKey(c.getApiKey());
                    return Map.of(
                            "model", c.getModel(),
                            "baseUrl", c.getBaseUrl() != null ? c.getBaseUrl() : "",
                            "apiKey", maskedKey);
                })
                .orElse(Map.of("model", "deepseek-chat (default)", "baseUrl", "https://api.deepseek.com", "apiKey", ""));
    }

    private String maskApiKey(String key) {
        if (key == null || key.length() <= 8) return "****";
        return key.substring(0, 4) + "****" + key.substring(key.length() - 4);
    }
}

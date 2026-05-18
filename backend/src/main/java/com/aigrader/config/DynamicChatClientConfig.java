package com.aigrader.config;

import com.aigrader.service.AiConfigService;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.ai.openai.OpenAiChatOptions;
import org.springframework.ai.openai.api.OpenAiApi;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Scope;

@Configuration
public class DynamicChatClientConfig {

    @Value("${spring.ai.openai.api-key:}")
    private String defaultApiKey;

    @Value("${spring.ai.openai.base-url:https://api.deepseek.com}")
    private String defaultBaseUrl;

    @Value("${spring.ai.openai.chat.options.model:deepseek-chat}")
    private String defaultModel;

    private final AiConfigService aiConfigService;

    public DynamicChatClientConfig(AiConfigService aiConfigService) {
        this.aiConfigService = aiConfigService;
    }

    @Bean
    @Scope("prototype")
    public ChatClient dynamicChatClient() {
        try {
            return aiConfigService.getChatClient();
        } catch (Exception e) {
            if (defaultApiKey != null && !defaultApiKey.isBlank()) {
                OpenAiApi api = OpenAiApi.builder()
                        .baseUrl(defaultBaseUrl)
                        .apiKey(defaultApiKey)
                        .build();
                OpenAiChatOptions options = OpenAiChatOptions.builder()
                        .model(defaultModel)
                        .temperature(0.3)
                        .build();
                return ChatClient.builder(new OpenAiChatModel(api, options)).build();
            }
            throw e;
        }
    }
}

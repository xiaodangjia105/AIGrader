package com.aigrader.ai;

import com.aigrader.common.QuestionType;
import com.aigrader.entity.Question;
import com.aigrader.service.AiConfigService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.Map;

@Component
@Order(3)
public class SubjectiveGradingStrategy implements GradingStrategy {

    private final AiConfigService aiConfigService;
    private final PromptTemplateService promptTemplateService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public SubjectiveGradingStrategy(AiConfigService aiConfigService, PromptTemplateService promptTemplateService) {
        this.aiConfigService = aiConfigService;
        this.promptTemplateService = promptTemplateService;
    }

    @Override
    public GradingResult grade(Question question, String studentAnswer) {
        if (studentAnswer == null || studentAnswer.isBlank()) {
            return new GradingResult(BigDecimal.ZERO, "No answer provided.", BigDecimal.ZERO, false, false, null);
        }

        String rubric = question.getRubric() != null ? question.getRubric() : "";
        String prompt = promptTemplateService.getPrompt(
                question.getSubject(),
                question.getContent(),
                question.getAnswer(),
                rubric,
                studentAnswer);

        return parseAIResponse(callAI(prompt));
    }

    protected String callAI(String prompt) {
        var client = aiConfigService.getChatClient();
        if (client == null) {
            throw new RuntimeException("AI service not configured. Please set API Key in Settings.");
        }
        return client.prompt().user(prompt).call().content();
    }

    protected GradingResult parseAIResponse(String response) {
        try {
            String json = response.replaceAll("`json|`", "").trim();
            JsonNode node = objectMapper.readTree(json);

            double contentScore = node.has("contentScore") ? node.get("contentScore").asDouble() : 0;
            double logicScore = node.has("logicScore") ? node.get("logicScore").asDouble() : 0;
            double expressionScore = node.has("expressionScore") ? node.get("expressionScore").asDouble() : 0;

            BigDecimal totalScore;
            if (node.has("totalScore")) {
                totalScore = BigDecimal.valueOf(node.get("totalScore").asDouble());
            } else {
                totalScore = BigDecimal.valueOf(contentScore * 0.4 + logicScore * 0.3 + expressionScore * 0.3)
                        .setScale(1, RoundingMode.HALF_UP);
            }

            String feedback = node.get("feedback").asText();
            boolean correct = node.get("isCorrect").asBoolean();
            double confidence = node.has("confidence") ? node.get("confidence").asDouble() : 0.85;
            boolean needsReview = confidence < 0.7 || totalScore.compareTo(BigDecimal.valueOf(6)) < 0;

            Map<String, BigDecimal> dimensions = new HashMap<>();
            dimensions.put("contentScore", BigDecimal.valueOf(contentScore).setScale(1, RoundingMode.HALF_UP));
            dimensions.put("logicScore", BigDecimal.valueOf(logicScore).setScale(1, RoundingMode.HALF_UP));
            dimensions.put("expressionScore", BigDecimal.valueOf(expressionScore).setScale(1, RoundingMode.HALF_UP));
            dimensions.put("totalScore", totalScore);

            return new GradingResult(totalScore, feedback, BigDecimal.valueOf(confidence), correct, needsReview, dimensions);
        } catch (Exception e) {
            return new GradingResult(BigDecimal.valueOf(5), response, new BigDecimal("0.50"), false, true, null);
        }
    }

    @Override
    public boolean supports(Question question) {
        return question.getType() == QuestionType.SHORT_ANSWER || question.getType() == QuestionType.ESSAY;
    }
}

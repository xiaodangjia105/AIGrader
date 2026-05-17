package com.aigrader.ai;

import com.aigrader.common.QuestionType;
import com.aigrader.entity.Question;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@Order(2)
public class FillBlankGradingStrategy implements GradingStrategy {

    private final ChatClient chatClient;

    public FillBlankGradingStrategy(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder.build();
    }

    @Override
    public GradingResult grade(Question question, String studentAnswer) {
        if (studentAnswer == null || studentAnswer.isBlank()) {
            return new GradingResult(BigDecimal.ZERO, "No answer provided.", new BigDecimal("0.99"), false, false);
        }

        String reference = question.getAnswer();
        if (reference != null && reference.trim().equalsIgnoreCase(studentAnswer.trim())) {
            return new GradingResult(BigDecimal.TEN, "Correct!", new BigDecimal("0.99"), true, false);
        }

        String prompt = String.format("""
                Grade this fill-in-the-blank answer.
                Question: %s
                Reference answer: %s
                Student answer: %s
                Return ONLY a JSON object: {"score": <0-10>, "feedback": "<brief feedback>", "isCorrect": <true/false>}
                """, question.getContent(), reference, studentAnswer);

        return parseAIResponse(callAI(prompt));
    }

    protected String callAI(String prompt) {
        return chatClient.prompt().user(prompt).call().content();
    }

    protected GradingResult parseAIResponse(String response) {
        try {
            String json = response.replaceAll("```json|```", "").trim();
            var node = new com.fasterxml.jackson.databind.ObjectMapper().readTree(json);
            BigDecimal score = BigDecimal.valueOf(node.get("score").asDouble());
            String feedback = node.get("feedback").asText();
            boolean correct = node.get("isCorrect").asBoolean();
            return new GradingResult(score, feedback, new BigDecimal("0.90"), correct, score.compareTo(BigDecimal.valueOf(6)) < 0);
        } catch (Exception e) {
            return new GradingResult(BigDecimal.valueOf(5), response, new BigDecimal("0.50"), false, true);
        }
    }

    @Override
    public boolean supports(Question question) {
        return question.getType() == QuestionType.FILL_BLANK;
    }
}

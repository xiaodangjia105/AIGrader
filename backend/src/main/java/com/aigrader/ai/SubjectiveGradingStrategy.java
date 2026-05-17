package com.aigrader.ai;

import com.aigrader.common.QuestionType;
import com.aigrader.entity.Question;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@Order(3)
public class SubjectiveGradingStrategy implements GradingStrategy {

    private final ChatClient chatClient;

    public SubjectiveGradingStrategy(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder.build();
    }

    @Override
    public GradingResult grade(Question question, String studentAnswer) {
        if (studentAnswer == null || studentAnswer.isBlank()) {
            return new GradingResult(BigDecimal.ZERO, "No answer provided.", new BigDecimal("0.99"), false, false);
        }

        String rubric = question.getRubric() != null ? question.getRubric() : "Evaluate for content accuracy, clarity, and completeness.";

        String prompt = String.format("""
                You are a teacher grading a student answer. Grade on a 0-10 scale.

                Question: %s
                Reference answer: %s
                Grading rubric: %s
                Student answer: %s

                Return ONLY a JSON object (no markdown code fences):
                {"score": <0-10>, "feedback": "<2-3 sentence personalized feedback with encouragement and specific suggestions>", "isCorrect": <true if score>=6 else false>, "confidence": <0.0-1.0>}
                """, question.getContent(), question.getAnswer(), rubric, studentAnswer);

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
            double confidence = node.has("confidence") ? node.get("confidence").asDouble() : 0.85;
            boolean needsReview = confidence < 0.7 || score.compareTo(BigDecimal.valueOf(6)) < 0;
            return new GradingResult(score, feedback, BigDecimal.valueOf(confidence), correct, needsReview);
        } catch (Exception e) {
            return new GradingResult(BigDecimal.valueOf(5), response, new BigDecimal("0.50"), false, true);
        }
    }

    @Override
    public boolean supports(Question question) {
        return question.getType() == QuestionType.SHORT_ANSWER || question.getType() == QuestionType.ESSAY;
    }
}

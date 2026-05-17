package com.aigrader.ai;

import com.aigrader.common.QuestionType;
import com.aigrader.entity.Question;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@Order(1)
public class ChoiceGradingStrategy implements GradingStrategy {

    @Override
    public GradingResult grade(Question question, String studentAnswer) {
        boolean correct = question.getAnswer() != null
                && question.getAnswer().trim().equalsIgnoreCase(studentAnswer.trim());
        return new GradingResult(
                correct ? BigDecimal.TEN : BigDecimal.ZERO,
                correct ? "Correct!" : "Incorrect. The correct answer is: " + question.getAnswer(),
                new BigDecimal("0.99"),
                correct,
                false
        );
    }

    @Override
    public boolean supports(Question question) {
        return question.getType() == QuestionType.CHOICE || question.getType() == QuestionType.TRUE_FALSE;
    }
}

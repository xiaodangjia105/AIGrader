package com.aigrader.ai;

import com.aigrader.entity.Question;

public interface GradingStrategy {
    GradingResult grade(Question question, String studentAnswer);
    boolean supports(Question question);
}

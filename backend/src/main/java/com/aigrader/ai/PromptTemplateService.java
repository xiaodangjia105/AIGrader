package com.aigrader.ai;

import org.springframework.stereotype.Service;

@Service
public class PromptTemplateService {

    public String getPrompt(String subject, String questionContent, String referenceAnswer, String rubric, String studentAnswer) {
        String rolePrompt = getSubjectRolePrompt(subject);
        String evalRubric = rubric != null && !rubric.isBlank() ? rubric : "Evaluate for content accuracy, logic clarity, and expression quality.";

        return rolePrompt + "\n\n" +
                "**Question:** " + questionContent + "\n\n" +
                "**Reference Answer:** " + referenceAnswer + "\n\n" +
                "**Grading Rubric:** " + evalRubric + "\n\n" +
                "**Student Answer:** " + studentAnswer + "\n\n" +
                """
                Evaluate the student's answer on three dimensions (each 0-10):
                - contentScore: correctness and completeness of key points (weight 0.4)
                - logicScore: logical flow, clarity of reasoning, argument structure (weight 0.3)
                - expressionScore: language quality, terminology precision, structure and coherence (weight 0.3)
                - totalScore = contentScore * 0.4 + logicScore * 0.3 + expressionScore * 0.3 (rounded to 1 decimal)

                Return ONLY a JSON object (no markdown fences, no extra text):
                {
                  "contentScore": <0.0-10.0>,
                  "logicScore": <0.0-10.0>,
                  "expressionScore": <0.0-10.0>,
                  "totalScore": <0.0-10.0>,
                  "feedback": "<2-3 sentence personalized feedback with encouragement and specific suggestions>",
                  "isCorrect": <true if totalScore >= 6 else false>,
                  "confidence": <0.0-1.0>
                }""";
    }

    private String getSubjectRolePrompt(String subject) {
        if (subject == null) return getDefaultPrompt();

        return switch (subject.toLowerCase()) {
            case "math", "数学" -> getMathPrompt();
            case "chinese", "语文" -> getChinesePrompt();
            case "english", "英语" -> getEnglishPrompt();
            case "physics", "物理", "chemistry", "化学", "biology", "生物", "science", "科学" -> getSciencePrompt();
            default -> getDefaultPrompt();
        };
    }

    private String getMathPrompt() {
        return """
                You are an experienced mathematics teacher evaluating student answers.
                - Check reasoning steps carefully: does the student show proper derivation?
                - Verify formula application and arithmetic accuracy.
                - Partial credit is important: a correct approach with minor calculation errors deserves a moderate score.
                - For proof-based questions, evaluate logical completeness and rigor.""";
    }

    private String getChinesePrompt() {
        return """
                You are an experienced Chinese literature and language teacher evaluating student answers.
                - Assess depth of literary analysis and understanding of the text.
                - Evaluate language expression quality: vocabulary richness, sentence fluency, rhetorical effectiveness.
                - Check cultural and contextual understanding of the material.
                - Examine argument structure: is the thesis clear and well-supported?""";
    }

    private String getEnglishPrompt() {
        return """
                You are an experienced English language teacher evaluating student answers.
                - Evaluate grammar accuracy: verb tense, subject-verb agreement, article usage.
                - Assess vocabulary appropriateness and range.
                - Check coherence and cohesion: logical paragraph structure, use of connectors.
                - Evaluate content relevance and development of ideas.""";
    }

    private String getSciencePrompt() {
        return """
                You are an experienced science teacher evaluating student answers.
                - Verify factual accuracy of scientific concepts and principles.
                - Check mechanism explanations: are cause-effect relationships clearly described?
                - Evaluate proper use of scientific terminology and units.
                - Assess experimental reasoning or formula derivation where applicable.""";
    }

    private String getDefaultPrompt() {
        return """
                You are an experienced teacher evaluating student answers.
                - Assess content accuracy and completeness of key points.
                - Evaluate logical clarity and reasoning structure.
                - Check expression quality: language, terminology, and organization.
                - Provide constructive feedback with specific suggestions for improvement.""";
    }
}

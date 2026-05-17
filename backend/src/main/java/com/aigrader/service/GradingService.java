package com.aigrader.service;

import com.aigrader.ai.GradingResult;
import com.aigrader.ai.GradingStrategy;
import com.aigrader.entity.Question;
import com.aigrader.entity.Submission;
import com.aigrader.entity.SubmissionAnswer;
import com.aigrader.repository.SubmissionAnswerRepository;
import com.aigrader.repository.SubmissionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class GradingService {

    private final List<GradingStrategy> strategies;
    private final SubmissionRepository submissionRepository;
    private final SubmissionAnswerRepository submissionAnswerRepository;
    private final QuestionService questionService;

    @Async
    @Transactional
    public void gradeSubmissionAsync(Long submissionId) {
        log.info("Starting AI grading for submission: {}", submissionId);
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new RuntimeException("Submission not found: " + submissionId));

        List<SubmissionAnswer> answers = submissionAnswerRepository.findBySubmissionId(submissionId);

        for (SubmissionAnswer answer : answers) {
            try {
                gradeAnswer(answer);
            } catch (Exception e) {
                log.error("Error grading answer {}: {}", answer.getId(), e.getMessage());
                answer.setAiScore(java.math.BigDecimal.ZERO);
                answer.setAiFeedback("Grading error: " + e.getMessage());
                answer.setAiConfidence(java.math.BigDecimal.ZERO);
                answer.setIsCorrect(false);
            }
            submissionAnswerRepository.save(answer);
        }

        submission.setStatus("GRADED");
        submission.setAiGradedAt(LocalDateTime.now());
        submissionRepository.save(submission);
        log.info("Completed AI grading for submission: {}", submissionId);
    }

    private void gradeAnswer(SubmissionAnswer answer) {
        if (answer.getStudentAnswer() == null || answer.getStudentAnswer().isBlank()) {
            answer.setAiScore(java.math.BigDecimal.ZERO);
            answer.setAiFeedback("No answer submitted.");
            answer.setAiConfidence(new java.math.BigDecimal("1.0"));
            answer.setIsCorrect(false);
            return;
        }

        Question question = questionService.getById(answer.getQuestionId());
        GradingStrategy strategy = strategies.stream()
                .filter(s -> s.supports(question))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No grading strategy for question type: " + question.getType()));

        GradingResult result = strategy.grade(question, answer.getStudentAnswer());
        answer.setAiScore(result.score());
        answer.setAiFeedback(result.feedback());
        answer.setAiConfidence(result.confidence());
        answer.setIsCorrect(result.isCorrect());
    }

    @Cacheable(value = "grading_results", key = "#questionId + ':' + #studentAnswer")
    public GradingResult getCachedResult(Long questionId, String studentAnswer) {
        return null;
    }

    @Transactional
    public SubmissionAnswer reviewAnswer(Long answerId, java.math.BigDecimal finalScore, String comment) {
        SubmissionAnswer answer = submissionAnswerRepository.findById(answerId)
                .orElseThrow(() -> new RuntimeException("Answer not found: " + answerId));
        answer.setFinalScore(finalScore);
        answer.setTeacherComment(comment);
        answer.setReviewedByTeacher(true);
        return submissionAnswerRepository.save(answer);
    }
}

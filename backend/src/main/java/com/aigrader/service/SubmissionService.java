package com.aigrader.service;

import com.aigrader.dto.AnswerDTO;
import com.aigrader.dto.SubmissionDTO;
import com.aigrader.entity.Submission;
import com.aigrader.entity.SubmissionAnswer;
import com.aigrader.repository.SubmissionAnswerRepository;
import com.aigrader.repository.SubmissionRepository;
import lombok.extern.slf4j.Slf4j;
import lombok.RequiredArgsConstructor;
import com.aigrader.common.BusinessException;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import java.math.BigDecimal;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final SubmissionAnswerRepository submissionAnswerRepository;
    private final ApplicationContext applicationContext;

    public Submission getById(Long id) {
        return submissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Submission not found: " + id));
    }

    public List<Submission> listByAssignment(Long assignmentId) {
        return submissionRepository.findByAssignmentId(assignmentId);
    }

    public List<Submission> listByStudent(Long studentId) {
        return submissionRepository.findByStudentId(studentId);
    }

    @Transactional
    public SubmissionDTO submit(Long assignmentId, Long studentId, List<AnswerDTO> answers) {
        var existing = submissionRepository.findByAssignmentIdAndStudentId(assignmentId, studentId);
        if (existing.isPresent()) {
            throw new BusinessException(409, "你已经提交过该作业，无需重复提交");
        }

        Submission submission = Submission.builder()
                .assignmentId(assignmentId)
                .studentId(studentId)
                .status("SUBMITTED")
                .build();
        submission = submissionRepository.save(submission);

        for (AnswerDTO answer : answers) {
            SubmissionAnswer sa = SubmissionAnswer.builder()
                    .submissionId(submission.getId())
                    .questionId(answer.getQuestionId())
                    .studentAnswer(answer.getStudentAnswer())
                    .build();
            submissionAnswerRepository.save(sa);
        }

        Long submissionId = submission.getId();
        if (TransactionSynchronizationManager.isSynchronizationActive()) {
            TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
                @Override
                public void afterCommit() {
                    applicationContext.getBean(GradingService.class).gradeSubmissionAsync(submissionId);
                }
            });
        } else {
            log.warn("Transaction synchronization not active, skipping async grading trigger");
        }

        return toDTO(submission);
    }

    public List<SubmissionAnswer> getAnswers(Long submissionId) {
        return submissionAnswerRepository.findBySubmissionId(submissionId);
    }

    public SubmissionDTO toDTO(Submission submission) {
        List<SubmissionAnswer> answers = getAnswers(submission.getId());
        List<AnswerDTO> answerDTOs = answers.stream()
                .map(a -> AnswerDTO.builder()
                        .questionId(a.getQuestionId())
                        .studentAnswer(a.getStudentAnswer())
                        .score(a.getFinalScore() != null ? a.getFinalScore() : a.getAiScore())
                        .contentScore(a.getContentScore())
                        .logicScore(a.getLogicScore())
                        .expressionScore(a.getExpressionScore())
                        .aiFeedback(a.getAiFeedback())
                        .isCorrect(a.getIsCorrect())
                        .build())
                .toList();

        BigDecimal totalScore = answers.stream()
                .map(a -> a.getFinalScore() != null ? a.getFinalScore() : a.getAiScore())
                .filter(s -> s != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return SubmissionDTO.builder()
                .id(submission.getId())
                .assignmentId(submission.getAssignmentId())
                .studentId(submission.getStudentId())
                .status(submission.getStatus())
                .submittedAt(submission.getSubmittedAt())
                .aiGradedAt(submission.getAiGradedAt())
                .answers(answerDTOs)
                .totalScore(totalScore)
                .build();
    }
}

package com.aigrader.repository;

import com.aigrader.entity.SubmissionAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface SubmissionAnswerRepository extends JpaRepository<SubmissionAnswer, Long> {
    List<SubmissionAnswer> findBySubmissionId(Long submissionId);
    List<SubmissionAnswer> findBySubmissionIdAndQuestionId(Long submissionId, Long questionId);

    @Query("SELECT sa FROM SubmissionAnswer sa WHERE sa.reviewedByTeacher = true AND sa.aiScore IS NOT NULL AND sa.finalScore IS NOT NULL")
    List<SubmissionAnswer> findReviewedAnswers();
}
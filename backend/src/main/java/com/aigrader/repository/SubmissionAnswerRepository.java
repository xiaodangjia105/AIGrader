package com.aigrader.repository;

import com.aigrader.entity.SubmissionAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SubmissionAnswerRepository extends JpaRepository<SubmissionAnswer, Long> {
    List<SubmissionAnswer> findBySubmissionId(Long submissionId);
    List<SubmissionAnswer> findBySubmissionIdAndQuestionId(Long submissionId, Long questionId);
}

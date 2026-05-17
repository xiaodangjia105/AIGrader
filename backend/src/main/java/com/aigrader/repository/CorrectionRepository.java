package com.aigrader.repository;

import com.aigrader.entity.Correction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CorrectionRepository extends JpaRepository<Correction, Long> {
    List<Correction> findBySubmissionAnswerId(Long submissionAnswerId);
}

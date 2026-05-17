package com.aigrader.repository;

import com.aigrader.entity.AssignmentQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AssignmentQuestionRepository extends JpaRepository<AssignmentQuestion, Long> {
    List<AssignmentQuestion> findByAssignmentIdOrderBySortOrderAsc(Long assignmentId);
}

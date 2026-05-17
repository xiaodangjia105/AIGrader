package com.aigrader.service;

import com.aigrader.dto.AssignmentDTO;
import com.aigrader.entity.Assignment;
import com.aigrader.entity.AssignmentQuestion;
import com.aigrader.repository.AssignmentQuestionRepository;
import com.aigrader.repository.AssignmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final AssignmentQuestionRepository assignmentQuestionRepository;
    private final QuestionService questionService;

    public Assignment getById(Long id) {
        return assignmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Assignment not found: " + id));
    }

    public List<Assignment> listByTeacher(Long teacherId) {
        return assignmentRepository.findByTeacherId(teacherId);
    }

    public List<Assignment> listByClass(Long classId) {
        return assignmentRepository.findByClassId(classId);
    }

    @Transactional
    public Assignment create(AssignmentDTO dto) {
        Assignment assignment = Assignment.builder()
                .title(dto.getTitle())
                .teacherId(dto.getTeacherId())
                .classId(dto.getClassId())
                .dueDate(dto.getDueDate())
                .status("ACTIVE")
                .build();
        assignment = assignmentRepository.save(assignment);

        if (dto.getQuestionIds() != null && !dto.getQuestionIds().isEmpty()) {
            BigDecimal defaultScore = BigDecimal.valueOf(10);
            for (int i = 0; i < dto.getQuestionIds().size(); i++) {
                AssignmentQuestion aq = AssignmentQuestion.builder()
                        .assignmentId(assignment.getId())
                        .questionId(dto.getQuestionIds().get(i))
                        .sortOrder(i + 1)
                        .score(defaultScore)
                        .build();
                assignmentQuestionRepository.save(aq);
            }
        }
        return assignment;
    }

    public List<AssignmentQuestion> getQuestions(Long assignmentId) {
        return assignmentQuestionRepository.findByAssignmentIdOrderBySortOrderAsc(assignmentId);
    }
}

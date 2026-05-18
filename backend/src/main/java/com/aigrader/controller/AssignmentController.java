package com.aigrader.controller;

import com.aigrader.common.ApiResponse;
import com.aigrader.common.SecurityUtil;
import com.aigrader.dto.AssignmentDTO;
import com.aigrader.entity.Assignment;
import com.aigrader.entity.AssignmentQuestion;
import com.aigrader.service.AssignmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assignments")
@RequiredArgsConstructor
public class AssignmentController {

    private final AssignmentService assignmentService;

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN', 'STUDENT')")
    public ApiResponse<Assignment> get(@PathVariable Long id) {
        return ApiResponse.success(assignmentService.getById(id));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('TEACHER')")
    public ApiResponse<List<Assignment>> listMy() {
        return ApiResponse.success(assignmentService.listByTeacher(SecurityUtil.getCurrentUserId()));
    }

    @GetMapping("/class/{classId}")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN', 'STUDENT')")
    public ApiResponse<List<Assignment>> listByClass(@PathVariable Long classId) {
        return ApiResponse.success(assignmentService.listByClass(classId));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ApiResponse<Assignment> create(@RequestBody AssignmentDTO dto) {
        return ApiResponse.success(assignmentService.create(dto));
    }

    @GetMapping("/{id}/questions")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN', 'STUDENT')")
    public ApiResponse<List<AssignmentQuestion>> getQuestions(@PathVariable Long id) {
        return ApiResponse.success(assignmentService.getQuestions(id));
    }
}

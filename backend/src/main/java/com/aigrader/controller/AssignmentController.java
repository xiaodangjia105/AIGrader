package com.aigrader.controller;

import com.aigrader.common.ApiResponse;
import com.aigrader.dto.AssignmentDTO;
import com.aigrader.entity.Assignment;
import com.aigrader.entity.AssignmentQuestion;
import com.aigrader.service.AssignmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assignments")
@RequiredArgsConstructor
public class AssignmentController {

    private final AssignmentService assignmentService;

    @GetMapping("/{id}")
    public ApiResponse<Assignment> get(@PathVariable Long id) {
        return ApiResponse.success(assignmentService.getById(id));
    }

    @GetMapping("/teacher/{teacherId}")
    public ApiResponse<List<Assignment>> listByTeacher(@PathVariable Long teacherId) {
        return ApiResponse.success(assignmentService.listByTeacher(teacherId));
    }

    @GetMapping("/class/{classId}")
    public ApiResponse<List<Assignment>> listByClass(@PathVariable Long classId) {
        return ApiResponse.success(assignmentService.listByClass(classId));
    }

    @PostMapping
    public ApiResponse<Assignment> create(@RequestBody AssignmentDTO dto) {
        return ApiResponse.success(assignmentService.create(dto));
    }

    @GetMapping("/{id}/questions")
    public ApiResponse<List<AssignmentQuestion>> getQuestions(@PathVariable Long id) {
        return ApiResponse.success(assignmentService.getQuestions(id));
    }
}

package com.aigrader.controller;

import com.aigrader.common.ApiResponse;
import com.aigrader.dto.AnswerDTO;
import com.aigrader.dto.SubmissionDTO;
import com.aigrader.entity.Submission;
import com.aigrader.service.GradingService;
import com.aigrader.service.SubmissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/submissions")
@RequiredArgsConstructor
public class SubmissionController {

    private final SubmissionService submissionService;
    private final GradingService gradingService;

    @GetMapping("/{id}")
    public ApiResponse<SubmissionDTO> get(@PathVariable Long id) {
        return ApiResponse.success(submissionService.toDTO(submissionService.getById(id)));
    }

    @GetMapping("/assignment/{assignmentId}")
    public ApiResponse<List<Submission>> listByAssignment(@PathVariable Long assignmentId) {
        return ApiResponse.success(submissionService.listByAssignment(assignmentId));
    }

    @GetMapping("/student/{studentId}")
    public ApiResponse<List<Submission>> listByStudent(@PathVariable Long studentId) {
        return ApiResponse.success(submissionService.listByStudent(studentId));
    }

    @PostMapping
    public ApiResponse<SubmissionDTO> submit(
            @RequestParam Long assignmentId,
            @RequestParam Long studentId,
            @RequestBody List<AnswerDTO> answers) {
        return ApiResponse.success(submissionService.submit(assignmentId, studentId, answers));
    }

    @PostMapping("/{id}/grade")
    public ApiResponse<String> triggerGrading(@PathVariable Long id) {
        gradingService.gradeSubmissionAsync(id);
        return ApiResponse.success("Grading started for submission " + id);
    }

    @GetMapping("/{id}/results")
    public ApiResponse<SubmissionDTO> getResults(@PathVariable Long id) {
        return ApiResponse.success(submissionService.toDTO(submissionService.getById(id)));
    }
}

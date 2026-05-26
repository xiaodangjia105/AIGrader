package com.aigrader.controller;

import com.aigrader.common.ApiResponse;
import com.aigrader.common.SecurityUtil;
import com.aigrader.dto.AnswerDTO;
import com.aigrader.dto.SubmissionDTO;
import com.aigrader.entity.Submission;
import com.aigrader.service.GradingService;
import com.aigrader.service.SubmissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/submissions")
@RequiredArgsConstructor
public class SubmissionController {

    private final SubmissionService submissionService;
    private final GradingService gradingService;

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN', 'STUDENT')")
    public ApiResponse<SubmissionDTO> get(@PathVariable Long id) {
        return ApiResponse.success(submissionService.toDTO(submissionService.getById(id)));
    }

    @GetMapping("/assignment/{assignmentId}")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ApiResponse<List<Submission>> listByAssignment(@PathVariable Long assignmentId) {
        return ApiResponse.success(submissionService.listByAssignment(assignmentId));
    }

    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN', 'STUDENT')")
    public ApiResponse<List<Submission>> listMy() {
        return ApiResponse.success(submissionService.listByStudent(SecurityUtil.getCurrentUserId()));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN', 'STUDENT')")
    public ApiResponse<SubmissionDTO> submit(
            @RequestParam Long assignmentId,
            @RequestBody List<AnswerDTO> answers) {
        SubmissionDTO submission = submissionService.submit(assignmentId, SecurityUtil.getCurrentUserId(), answers);
        return ApiResponse.success(submission);
    }

    @PostMapping("/{id}/grade")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ApiResponse<String> triggerGrading(@PathVariable Long id) {
        gradingService.gradeSubmissionAsync(id);
        return ApiResponse.success("Grading started for submission " + id);
    }

    @GetMapping("/{id}/results")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN', 'STUDENT')")
    public ApiResponse<SubmissionDTO> getResults(@PathVariable Long id) {
        return ApiResponse.success(submissionService.toDTO(submissionService.getById(id)));
    }
}

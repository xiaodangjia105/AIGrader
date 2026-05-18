package com.aigrader.controller;

import com.aigrader.common.ApiResponse;
import com.aigrader.dto.BatchImportResultDTO;
import com.aigrader.dto.QuestionDTO;
import com.aigrader.entity.Question;
import com.aigrader.service.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;

    @GetMapping
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN', 'STUDENT')")
    public ApiResponse<List<Question>> list() {
        return ApiResponse.success(questionService.listAll());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN', 'STUDENT')")
    public ApiResponse<Question> get(@PathVariable Long id) {
        return ApiResponse.success(questionService.getById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ApiResponse<Question> create(@RequestBody QuestionDTO dto) {
        return ApiResponse.success(questionService.create(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ApiResponse<Question> update(@PathVariable Long id, @RequestBody QuestionDTO dto) {
        return ApiResponse.success(questionService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        questionService.delete(id);
        return ApiResponse.success(null);
    }

    @PostMapping("/batch-import")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ApiResponse<BatchImportResultDTO> batchImportJson(@RequestBody List<QuestionDTO> questions) {
        return ApiResponse.success(questionService.batchImport(questions));
    }

    @PostMapping(value = "/batch-import/csv", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ApiResponse<BatchImportResultDTO> batchImportCsv(@RequestParam("file") MultipartFile file) throws IOException {
        return ApiResponse.success(questionService.batchImportCsv(file));
    }
}
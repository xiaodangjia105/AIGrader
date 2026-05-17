package com.aigrader.controller;

import com.aigrader.common.ApiResponse;
import com.aigrader.dto.QuestionDTO;
import com.aigrader.entity.Question;
import com.aigrader.service.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;

    @GetMapping
    public ApiResponse<List<Question>> list() {
        return ApiResponse.success(questionService.listAll());
    }

    @GetMapping("/{id}")
    public ApiResponse<Question> get(@PathVariable Long id) {
        return ApiResponse.success(questionService.getById(id));
    }

    @PostMapping
    public ApiResponse<Question> create(@RequestBody QuestionDTO dto) {
        return ApiResponse.success(questionService.create(dto));
    }

    @PutMapping("/{id}")
    public ApiResponse<Question> update(@PathVariable Long id, @RequestBody QuestionDTO dto) {
        return ApiResponse.success(questionService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        questionService.delete(id);
        return ApiResponse.success(null);
    }
}

package com.aigrader.controller;

import com.aigrader.common.ApiResponse;
import com.aigrader.entity.ClassGroup;
import com.aigrader.repository.ClassGroupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/classes")
@RequiredArgsConstructor
public class ClassController {

    private final ClassGroupRepository classGroupRepository;

    @GetMapping
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ApiResponse<List<ClassGroup>> list() {
        return ApiResponse.success(classGroupRepository.findAll());
    }
}

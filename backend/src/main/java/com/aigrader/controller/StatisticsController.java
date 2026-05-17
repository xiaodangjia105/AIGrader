package com.aigrader.controller;

import com.aigrader.common.ApiResponse;
import com.aigrader.entity.User;
import com.aigrader.repository.UserRepository;
import com.aigrader.service.StatisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class StatisticsController {

    private final StatisticsService statisticsService;
    private final UserRepository userRepository;

    @GetMapping("/statistics/class/{classId}")
    public ApiResponse<Map<String, Object>> classStats(@PathVariable Long classId) {
        return ApiResponse.success(statisticsService.getClassStats(classId));
    }

    @GetMapping("/statistics/student/{studentId}")
    public ApiResponse<Map<String, Object>> studentStats(@PathVariable Long studentId) {
        return ApiResponse.success(statisticsService.getStudentStats(studentId));
    }

    @GetMapping("/users")
    public ApiResponse<List<User>> listUsers() {
        return ApiResponse.success(userRepository.findAll());
    }

    @GetMapping("/users/{id}")
    public ApiResponse<User> getUser(@PathVariable Long id) {
        return ApiResponse.success(userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found")));
    }
}

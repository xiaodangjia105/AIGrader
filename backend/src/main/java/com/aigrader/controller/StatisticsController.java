package com.aigrader.controller;

import com.aigrader.common.ApiResponse;
import com.aigrader.dto.AiAccuracyDetailDTO;
import com.aigrader.dto.StudentReportDTO;
import com.aigrader.entity.User;
import com.aigrader.repository.UserRepository;
import com.aigrader.service.ReportService;
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
    private final ReportService reportService;
    private final UserRepository userRepository;

    @GetMapping("/statistics/class/{classId}")
    public ApiResponse<Map<String, Object>> classStats(@PathVariable Long classId) {
        return ApiResponse.success(statisticsService.getClassStats(classId));
    }

    @GetMapping("/statistics/student/{studentId}")
    public ApiResponse<Map<String, Object>> studentStats(@PathVariable Long studentId) {
        return ApiResponse.success(statisticsService.getStudentStats(studentId));
    }

    @GetMapping("/statistics/student/{studentId}/report")
    public ApiResponse<StudentReportDTO> studentReport(@PathVariable Long studentId) {
        return ApiResponse.success(reportService.generateReport(studentId));
    }

    @GetMapping("/statistics/ai-accuracy")
    public ApiResponse<Map<String, Object>> aiAccuracy() {
        return ApiResponse.success(statisticsService.getAiAccuracy());
    }

    @GetMapping("/statistics/ai-accuracy/detail")
    public ApiResponse<List<AiAccuracyDetailDTO>> aiAccuracyDetail() {
        return ApiResponse.success(statisticsService.getAiAccuracyDetail());
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

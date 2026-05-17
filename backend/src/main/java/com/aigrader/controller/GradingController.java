package com.aigrader.controller;

import com.aigrader.common.ApiResponse;
import com.aigrader.dto.ReviewDTO;
import com.aigrader.entity.Correction;
import com.aigrader.entity.SubmissionAnswer;
import com.aigrader.repository.CorrectionRepository;
import com.aigrader.repository.SubmissionAnswerRepository;
import com.aigrader.service.GradingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class GradingController {

    private final GradingService gradingService;
    private final SubmissionAnswerRepository submissionAnswerRepository;
    private final CorrectionRepository correctionRepository;

    @PutMapping("/grading/{answerId}/review")
    public ApiResponse<SubmissionAnswer> review(
            @PathVariable Long answerId,
            @RequestBody ReviewDTO dto) {
        return ApiResponse.success(gradingService.reviewAnswer(answerId, dto.getFinalScore(), dto.getTeacherComment()));
    }

    @GetMapping("/grading/answers/{submissionId}")
    public ApiResponse<List<SubmissionAnswer>> getAnswers(@PathVariable Long submissionId) {
        return ApiResponse.success(submissionAnswerRepository.findBySubmissionId(submissionId));
    }

    @PostMapping("/corrections")
    public ApiResponse<Map<String, Object>> submitCorrection(@RequestBody Map<String, Object> body) {
        Long submissionAnswerId = Long.valueOf(body.get("submissionAnswerId").toString());
        String newAnswer = (String) body.get("newAnswer");
        Correction correction = Correction.builder()
                .submissionAnswerId(submissionAnswerId)
                .newAnswer(newAnswer)
                .build();
        correction = correctionRepository.save(correction);
        return ApiResponse.success(Map.of("id", correction.getId(), "message", "Correction submitted"));
    }

    @GetMapping("/corrections/{answerId}")
    public ApiResponse<List<Correction>> getCorrections(@PathVariable Long answerId) {
        return ApiResponse.success(correctionRepository.findBySubmissionAnswerId(answerId));
    }
}

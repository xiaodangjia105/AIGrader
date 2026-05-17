package com.aigrader.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data @Builder
@NoArgsConstructor @AllArgsConstructor
public class AssignmentDTO {
    private Long id;
    private String title;
    private Long teacherId;
    private Long classId;
    private LocalDateTime dueDate;
    private String status;
    private LocalDateTime createdAt;
    private List<Long> questionIds;
}

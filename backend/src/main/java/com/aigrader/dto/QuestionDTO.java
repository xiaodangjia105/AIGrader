package com.aigrader.dto;

import com.aigrader.common.QuestionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @Builder
@NoArgsConstructor @AllArgsConstructor
public class QuestionDTO {
    private Long id;
    private QuestionType type;
    private String subject;
    private String difficulty;
    private String content;
    private String answer;
    private String rubric;
    private String options;
}

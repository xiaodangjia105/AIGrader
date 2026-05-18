package com.aigrader.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "submission_answers")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class SubmissionAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "submission_id", nullable = false)
    private Long submissionId;

    @Column(name = "question_id", nullable = false)
    private Long questionId;

    @Column(name = "student_answer", columnDefinition = "TEXT")
    private String studentAnswer;

    @Column(name = "ai_score", precision = 5, scale = 1)
    private BigDecimal aiScore;

    @Column(name = "ai_feedback", columnDefinition = "TEXT")
    private String aiFeedback;

    @Column(name = "ai_confidence", precision = 5, scale = 2)
    private BigDecimal aiConfidence;

    @Column(name = "is_correct")
    private Boolean isCorrect;

    @Column(name = "content_score", precision = 5, scale = 1)
    private BigDecimal contentScore;

    @Column(name = "logic_score", precision = 5, scale = 1)
    private BigDecimal logicScore;

    @Column(name = "expression_score", precision = 5, scale = 1)
    private BigDecimal expressionScore;

    @Column(name = "dimension_scores", columnDefinition = "JSONB")
    private String dimensionScores;

    @Column(name = "reviewed_by_teacher")
    @Builder.Default
    private Boolean reviewedByTeacher = false;

    @Column(name = "final_score", precision = 5, scale = 1)
    private BigDecimal finalScore;

    @Column(name = "teacher_comment", columnDefinition = "TEXT")
    private String teacherComment;
}

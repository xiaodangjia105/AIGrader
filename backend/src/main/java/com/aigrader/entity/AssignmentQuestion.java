package com.aigrader.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "assignment_questions")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class AssignmentQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "assignment_id", nullable = false)
    private Long assignmentId;

    @Column(name = "question_id", nullable = false)
    private Long questionId;

    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder;

    @Column(nullable = false, precision = 5, scale = 1)
    private BigDecimal score;
}

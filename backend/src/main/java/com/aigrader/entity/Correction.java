package com.aigrader.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "corrections")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Correction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "submission_answer_id", nullable = false)
    private Long submissionAnswerId;

    @Column(name = "new_answer", columnDefinition = "TEXT")
    private String newAnswer;

    @Column(nullable = false)
    private LocalDateTime correctedAt;

    @PrePersist
    protected void onCreate() {
        correctedAt = LocalDateTime.now();
    }
}

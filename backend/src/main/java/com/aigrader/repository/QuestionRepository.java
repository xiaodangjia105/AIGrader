package com.aigrader.repository;

import com.aigrader.entity.Question;
import com.aigrader.common.QuestionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByType(QuestionType type);
    List<Question> findBySubject(String subject);

    @Query(value = "SELECT * FROM questions WHERE embedding IS NOT NULL ORDER BY embedding <=> CAST(:embedding AS vector) LIMIT :limit", nativeQuery = true)
    List<Question> findSimilarByEmbedding(String embedding, int limit);
}

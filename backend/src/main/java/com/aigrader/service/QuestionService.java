package com.aigrader.service;

import com.aigrader.dto.QuestionDTO;
import com.aigrader.entity.Question;
import com.aigrader.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class QuestionService {

    private final QuestionRepository questionRepository;

    @Cacheable(value = "questions", key = "#id")
    public Question getById(Long id) {
        return questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found: " + id));
    }

    public List<Question> listAll() {
        return questionRepository.findAll();
    }

    @Transactional
    @CacheEvict(value = "questions", allEntries = true)
    public Question create(QuestionDTO dto) {
        Question question = Question.builder()
                .type(dto.getType())
                .subject(dto.getSubject())
                .difficulty(dto.getDifficulty())
                .content(dto.getContent())
                .answer(dto.getAnswer())
                .rubric(dto.getRubric())
                .options(dto.getOptions())
                .build();
        return questionRepository.save(question);
    }

    @Transactional
    @CacheEvict(value = "questions", key = "#id")
    public Question update(Long id, QuestionDTO dto) {
        Question question = getById(id);
        question.setType(dto.getType());
        question.setSubject(dto.getSubject());
        question.setDifficulty(dto.getDifficulty());
        question.setContent(dto.getContent());
        question.setAnswer(dto.getAnswer());
        question.setRubric(dto.getRubric());
        question.setOptions(dto.getOptions());
        return questionRepository.save(question);
    }

    @Transactional
    @CacheEvict(value = "questions", allEntries = true)
    public void delete(Long id) {
        questionRepository.deleteById(id);
    }
}

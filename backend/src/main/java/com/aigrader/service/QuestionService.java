package com.aigrader.service;

import com.aigrader.common.QuestionType;
import com.aigrader.dto.BatchImportResultDTO;
import com.aigrader.dto.QuestionDTO;
import com.aigrader.entity.Question;
import com.aigrader.repository.QuestionRepository;
import com.opencsv.CSVReader;
import com.opencsv.CSVReaderBuilder;
import com.opencsv.exceptions.CsvException;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
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
        Question question = toEntity(dto);
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

    @Transactional
    @CacheEvict(value = "questions", allEntries = true)
    public BatchImportResultDTO batchImport(List<QuestionDTO> dtos) {
        List<String> errors = new ArrayList<>();
        int successCount = 0;

        for (int i = 0; i < dtos.size(); i++) {
            try {
                QuestionDTO dto = dtos.get(i);
                if (dto.getType() == null || dto.getContent() == null || dto.getContent().isBlank()) {
                    errors.add("第" + (i + 1) + "行: 题目类型或题目内容不能为空");
                    continue;
                }
                Question question = toEntity(dto);
                questionRepository.save(question);
                successCount++;
            } catch (Exception e) {
                errors.add("��" + (i + 1) + "��: " + e.getMessage());
            }
        }

        return BatchImportResultDTO.builder()
                .successCount(successCount)
                .failCount(errors.size())
                .errors(errors)
                .build();
    }

    public BatchImportResultDTO batchImportCsv(MultipartFile file) throws IOException {
        List<QuestionDTO> dtos = new ArrayList<>();
        try (CSVReader reader = new CSVReaderBuilder(new InputStreamReader(file.getInputStream())).build()) {
            List<String[]> rows = reader.readAll();
            if (rows.isEmpty()) {
                return BatchImportResultDTO.builder().successCount(0).failCount(0).errors(List.of()).build();
            }
            String[] header = rows.get(0);
            for (int i = 1; i < rows.size(); i++) {
                String[] row = rows.get(i);
                try {
                    QuestionDTO dto = parseCsvRow(header, row);
                    dtos.add(dto);
                } catch (Exception e) {
                    dtos.add(null);
                }
            }
        } catch (CsvException e) {
            throw new IOException("CSV����ʧ��: " + e.getMessage(), e);
        }
        return batchImport(dtos);
    }

    private QuestionDTO parseCsvRow(String[] header, String[] row) {
        QuestionDTO dto = new QuestionDTO();
        for (int i = 0; i < header.length && i < row.length; i++) {
            String key = header[i].trim();
            String val = row[i].trim();
            switch (key) {
                case "type" -> dto.setType(QuestionType.valueOf(val));
                case "subject" -> dto.setSubject(val);
                case "difficulty" -> dto.setDifficulty(val);
                case "content" -> dto.setContent(val);
                case "answer" -> dto.setAnswer(val);
                case "rubric" -> dto.setRubric(val);
                case "options" -> dto.setOptions(val);
            }
        }
        return dto;
    }

    private Question toEntity(QuestionDTO dto) {
        return Question.builder()
                .type(dto.getType())
                .subject(dto.getSubject())
                .difficulty(dto.getDifficulty())
                .content(dto.getContent())
                .answer(dto.getAnswer())
                .rubric(dto.getRubric())
                .options(dto.getOptions())
                .build();
    }
}

package com.aigrader.repository;

import com.aigrader.entity.ClassGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ClassGroupRepository extends JpaRepository<ClassGroup, Long> {
    List<ClassGroup> findByTeacherId(Long teacherId);
}

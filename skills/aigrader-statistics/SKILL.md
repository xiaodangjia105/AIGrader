---
name: aigrader-statistics
description: AIGrader 统计与报表 Skill。用于处理班级统计、学生个人报告、AI 准确率趋势和质量监控数据；当需求涉及 /api/statistics/**、StatisticsController、StatisticsService 或 ReportService 时使用。
---

# aigrader-statistics

## 使用顺序

- 先看 references/object-dictionary.md，确认统计指标的数据源。
- 再看 references/class-stats.md，确认班级统计的计算逻辑。
- 再看 references/student-report.md，确认学生报告的生成流程。
- 再看 references/ai-accuracy.md，确认 AI 准确率监控指标。

## 关键入口

- backend/src/main/java/com/aigrader/controller/StatisticsController.java
- backend/src/main/java/com/aigrader/service/StatisticsService.java
- backend/src/main/java/com/aigrader/service/ReportService.java
- backend/src/main/java/com/aigrader/dto/StudentReportDTO.java
- backend/src/main/java/com/aigrader/dto/AiAccuracyDetailDTO.java
- backend/src/main/java/com/aigrader/dto/AiAccuracyTrendDTO.java
- frontend/src/pages/teacher/TeacherStatistics.tsx
- frontend/src/pages/student/StudentReport.tsx

## 必守约束

- 班级统计包含：完成率、平均分、各分数段分布。
- 学生报告包含：总成绩、各题得分、薄弱知识点、AI 评语。
- AI 准确率监控：对比 AI 评分与教师最终评分，计算偏离度。
- 统计数据都是实时计算的，不缓存（当前实现）。

## 参考资料

- references/object-dictionary.md
- references/class-stats.md
- references/student-report.md
- references/ai-accuracy.md

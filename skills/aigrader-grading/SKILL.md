---
name: aigrader-grading
description: AIGrader AI 批改引擎 Skill。用于处理提交作答、AI 批改（三种策略）、教师复核、学生订正和评语生成；当需求涉及 /api/submissions/**、/api/grading/**、GradingService、三种 GradingStrategy 或 Correction 实体时使用。
---

# aigrader-grading

这是 AIGrader 最核心的业务域。

## 使用顺序

- 先看 references/object-dictionary.md，确认提交和批改的对象模型。
- 再看 references/grading-pipeline.md，确认批改流水线的完整链路。
- 再看 references/three-strategies.md，确认三种评分策略的差异。
- 再看 references/review-and-correction.md，确认复核和订正流程。
- 再看 references/gotchas.md，确认最易出错的几个点。

## 关键入口

- backend/src/main/java/com/aigrader/controller/SubmissionController.java
- backend/src/main/java/com/aigrader/controller/GradingController.java
- backend/src/main/java/com/aigrader/service/GradingService.java
- backend/src/main/java/com/aigrader/service/SubmissionService.java
- backend/src/main/java/com/aigrader/service/CommentService.java
- backend/src/main/java/com/aigrader/ai/GradingStrategy.java
- backend/src/main/java/com/aigrader/ai/ChoiceGradingStrategy.java
- backend/src/main/java/com/aigrader/ai/FillBlankGradingStrategy.java
- backend/src/main/java/com/aigrader/ai/SubjectiveGradingStrategy.java
- frontend/src/pages/teacher/TeacherGradingReview.tsx
- frontend/src/pages/student/StudentAnswer.tsx
- frontend/src/pages/student/StudentCorrection.tsx

## 必守约束

- 批改流程：提交 -> 异步 AI 批改 -> 结果展示 -> 教师复核（可选） -> 学生订正（可选）。
- Submission 状态：SUBMITTED -> GRADING -> GRADED -> REVIEWED。
- 三种策略通过 GradingStrategy 接口统一调用，策略选择基于 Question.questionType。
- 客观题（选择/判断）置信度 >= 95%，主观题置信度较低需人工复核。
- Correction 记录学生的订正历史，每次订正产生一条新记录。

## 参考资料

- references/object-dictionary.md
- references/grading-pipeline.md
- references/three-strategies.md
- references/review-and-correction.md
- references/gotchas.md

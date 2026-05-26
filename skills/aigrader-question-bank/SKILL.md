---
name: aigrader-question-bank
description: AIGrader 题库管理 Skill。用于处理题目 CRUD、题型管理、批量导入（JSON/CSV）和题目筛选；当需求涉及 /api/questions/**、QuestionController、QuestionService、Question 实体或 QuestionDTO 时使用。
---

# aigrader-question-bank

## 使用顺序

- 先看 references/object-dictionary.md，确认题目实体和 DTO 字段语义。
- 再看 references/question-types.md，确认四种题型的差异和处理方式。
- 再看 references/batch-import.md，确认批量导入的格式和校验规则。
- 涉及前后端题型枚举时看 references/question-frontend.md。

## 关键入口

- backend/src/main/java/com/aigrader/controller/QuestionController.java
- backend/src/main/java/com/aigrader/service/QuestionService.java
- backend/src/main/java/com/aigrader/entity/Question.java
- backend/src/main/java/com/aigrader/dto/QuestionDTO.java
- backend/src/main/java/com/aigrader/dto/BatchImportResultDTO.java
- backend/src/main/java/com/aigrader/common/QuestionType.java
- frontend/src/pages/teacher/TeacherQuestions.tsx
- frontend/src/pages/admin/AdminQuestions.tsx

## 必守约束

- 题型枚举 QuestionType 定义了四种：CHOICE（选择）、TRUE_FALSE（判断）、FILL_BLANK（填空）、SUBJECTIVE（主观）。
- Question 实体的 correctAnswer 字段语义取决于题型：选择/判断存选项字母、填空存精确答案、主观存参考答案。
- 删除题目仅 ADMIN 角色允许，教师不能删除题目。
- batchImport 需要返回 BatchImportResultDTO（成功数、失败数、错误详情）。
- TeacherQuestions.tsx 与 AdminQuestions.tsx 代码高度重复（约 95%），改动时需同步两端。

## 参考资料

- references/object-dictionary.md
- references/question-types.md
- references/batch-import.md
- references/question-frontend.md

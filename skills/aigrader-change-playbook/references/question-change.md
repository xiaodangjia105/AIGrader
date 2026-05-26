# 题库变更检查

改题目相关代码时：

- 是否影响 QuestionDTO 字段？
- 是否影响 QuestionType 枚举？
- 是否影响前端 TeacherQuestions + AdminQuestions（两份重复代码）？
- 是否影响批改策略的 correctAnswer 解析？
- 是否影响批量导入的 CSV 列定义？

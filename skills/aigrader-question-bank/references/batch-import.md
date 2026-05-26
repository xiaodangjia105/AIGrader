# 批量导入

## JSON 导入

- POST /api/questions/batch-import
- 请求体为 List<QuestionDTO> JSON 数组
- 返回 BatchImportResultDTO

## CSV 导入

- POST /api/questions/batch-import/csv
- Content-Type: multipart/form-data
- 参数名: file
- CSV 列：questionType, content, options, correctAnswer, score, difficulty, subject
- 返回 BatchImportResultDTO

## 校验规则

- 题型必须是有效枚举值
- 选择题必须有 options 和 correctAnswer
- 分值为正整数
- 难度必须是有效枚举值
- 导入失败的行会记录在 errors 中

# 题库域对象词典

## 题目实体

| 字段 | 类型 | 语义 | 各题型差异 |
| --- | --- | --- | --- |
| id | Long | 自增主键 | 通用 |
| questionType | QuestionType | 题型枚举 | CHOICE/TRUE_FALSE/FILL_BLANK/SUBJECTIVE |
| content | String | 题目文本 | 通用 |
| options | String | 选项 JSON | 仅选择题有（如 ["A.xxx","B.xxx"]） |
| correctAnswer | String | 正确答案 | 选填存字母、填空存精确文本、主观存参考答案 |
| score | Integer | 分值 | 默认 10 |
| difficulty | String | 难度 | EASY/MEDIUM/HARD |
| subject | String | 学科 | 如 MATH/CHINESE/ENGLISH |

## DTO

| 对象 | 作用 | 与实体差异 |
| --- | --- | --- |
| QuestionDTO | 创建/更新入参 | 无 id，含所有业务字段 |
| BatchImportResultDTO | 批量导入结果 | successCount, failCount, errors |

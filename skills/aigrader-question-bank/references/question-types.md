# 题型语义

## 四种题型

| 题型 | 枚举值 | correctAnswer 格式 | 批改策略 |
| --- | --- | --- | --- |
| 选择题 | CHOICE | 单个字母（如 "A"） | ChoiceGradingStrategy - 精确匹配 |
| 判断题 | TRUE_FALSE | "T" 或 "F" | ChoiceGradingStrategy - 精确匹配 |
| 填空题 | FILL_BLANK | 期望的精确文本 | FillBlankGradingStrategy - LLM 语义判断 |
| 主观题 | SUBJECTIVE | 参考答案/评分要点 | SubjectiveGradingStrategy - 多维度评分 |

## 选项格式

- 选择题 options 字段为 JSON 数组字符串：["A. 选项A", "B. 选项B", "C. 选项C", "D. 选项D"]
- 非选择题 options 为 null

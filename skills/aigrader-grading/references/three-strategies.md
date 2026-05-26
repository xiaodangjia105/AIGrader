# 三种评分策略

## ChoiceGradingStrategy（选择/判断题）

- 精确匹配：studentAnswer == correctAnswer
- 正确得满分，错误得 0 分
- 置信度固定 99%
- 不调用 AI API

## FillBlankGradingStrategy（填空题）

- 使用 LLM 语义判断
- 将学生答案和标准答案一起发送给 DeepSeek
- 返回 0-满分之间的小数值
- 置信度约 85-95%

## SubjectiveGradingStrategy（主观题）

- 多维度评分：内容正确性、表述完整性、逻辑清晰度
- 通过 PromptTemplateService 构建评分 prompt
- 返回 0-满分之间的分数 + 详细反馈
- 置信度约 70-85%，需教师复核

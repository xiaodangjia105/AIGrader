# 统计域对象词典

## 统计指标

| 指标 | 来源 | 计算方式 |
| --- | --- | --- |
| completionRate | Submission 表 | 已提交数 / 班级总人数 |
| averageScore | SubmissionAnswer 表 | SUM(finalScore) / 提交人数 |
| scoreDistribution | SubmissionAnswer 表 | 按分数段分组统计 |
| aiAccuracy | SubmissionAnswer 表 | 1 - |aiScore - finalScore| / maxScore |
| weakPoints | 聚合分析 | 按题目统计错误率最高的知识点 |

## DTO

| 对象 | 作用 |
| --- | --- |
| StudentReportDTO | 学生个人报告 |
| AiAccuracyDetailDTO | AI 准确率明细（按题目/题型） |
| AiAccuracyTrendDTO | AI 准确率趋势 |

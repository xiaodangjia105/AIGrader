# 学生报告

## 接口

GET /api/statistics/student/{studentId}/report

## 返回内容 StudentReportDTO

- 总成绩和各题得分
- 各题 AI 反馈摘要
- 薄弱知识点列表
- 教师评语（如有）

## 生成流程

ReportService.generateReport(studentId)：
1. 查询学生的所有 Submission
2. 按题目聚合得分和反馈
3. 识别错误率 > 50% 的知识点作为薄弱知识点
4. 合并教师评语

# 批改域对象词典

## 提交实体

| 对象 | 含义 | 真值源 | 关键字段 |
| --- | --- | --- | --- |
| Submission | 提交记录 | MySQL submissions 表 | id, assignmentId, studentId, status, totalScore, submittedAt |
| SubmissionAnswer | 每道题的答案 | MySQL submission_answers 表 | id, submissionId, questionId, studentAnswer, aiScore, aiFeedback, confidence, finalScore, teacherComment |
| Correction | 学生订正记录 | MySQL corrections 表 | id, submissionAnswerId, newAnswer, createdAt |

## 批改结果

| 对象 | 含义 | 来源 |
| --- | --- | --- |
| GradingResult | 批改结果接口 | ai/GradingResult.java |
| SubmissionDTO | 提交详情 DTO | dto/SubmissionDTO.java |
| AnswerDTO | 作答入参 DTO | dto/AnswerDTO.java |
| ReviewDTO | 复核入参 DTO | dto/ReviewDTO.java |

## 状态流转

| 状态 | 含义 | 触发条件 |
| --- | --- | --- |
| SUBMITTED | 已提交，等待批改 | 学生提交作答 |
| GRADING | 批改中 | 异步任务开始 |
| GRADED | 批改完成 | AI 批改结束 |
| REVIEWED | 已复核 | 教师确认/修正 |

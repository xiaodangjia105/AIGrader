# 批改流水线

## 完整链路

1. 学生提交：POST /api/submissions { assignmentId, answers[] }
2. SubmissionService.submit() 创建 Submission 和 SubmissionAnswer 记录
3. 触发异步批改：GradingService.gradeSubmissionAsync(submissionId)
4. 逐题批改：遍历 SubmissionAnswer，根据 questionType 选择策略
5. 策略执行：调用 DeepSeek API（主观/填空）或本地匹配（选择/判断）
6. 结果写回：更新 aiScore、aiFeedback、confidence、totalScore
7. 状态更新：SUBMITTED -> GRADING -> GRADED

## 异步处理

- GradingService.gradeSubmissionAsync() 使用 @Async 注解
- 批改过程中 submission.status = GRADING
- 前端通过轮询 /api/submissions/{id}/results 获取结果

# 复核与订正

## 教师复核

- PUT /api/grading/{answerId}/review { finalScore, teacherComment }
- 教师可修正 AI 评分和补充评语
- 修正后 submission 状态变为 REVIEWED
- 可选功能：POST /api/grading/{submissionId}/generate-comment（AI 生成个性化评语）

## 学生订正

- POST /api/corrections { submissionAnswerId, newAnswer }
- 每次订正产生一条新的 Correction 记录
- 可通过 GET /api/corrections/{answerId} 查看订正历史

# 批改域易错点

## 最容易混淆的几件事

- 不要混用 Submission.status 和 SubmissionAnswer.finalScore 作为同一件事。
- 不要假设所有题型都走 AI；选择/判断是本地精确匹配。
- 不要忽略异步批改的延迟；提交后结果不是立即可用的。
- 不要用 studentId 直接查 Submission，应同时校验归属。

## 现象到检查点

| 现象 | 第一检查点 | 常见原因 |
| --- | --- | --- |
| 批改结果一直不返回 | GradingService.gradeSubmissionAsync | 异步任务未触发、AI API 超时 |
| 评分字段缺失 | SubmissionAnswer | 策略未正确匹配题型 |
| 选择题分数不对 | ChoiceGradingStrategy | correctAnswer 格式与 studentAnswer 不一致 |
| 复核后状态未更新 | GradingController.review | 未正确设置 REVIEWED 状态 |

## 一个实用判断

- 如果问题描述里有"批改、评分、反馈"，优先看批改域，不要先去看题目管理。
- 如果问题描述里有"提交后没反应"，优先看异步批改和状态轮询，不要只看 controller。
- 如果问题描述里有"结果不对"，优先看策略匹配和 correctAnswer 格式。

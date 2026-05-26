# 业务对象词典

## 这份词典解决什么问题

同一个仓库里，最容易出错的不是代码本身，而是名词没有统一。

这份词典的目标只有一个：把仓库里的核心名词统一成可执行的业务语言。

## 对象层级

| 层级 | 作用 | 典型对象 |
| --- | --- | --- |
| 主记录 | 最终业务事实 | User, Assignment, Submission, Question, AiConfig |
| 运行态 | 当前处理中的状态 | Submission.status (SUBMITTED/GRADING/GRADED/REVIEWED) |
| DTO | 接口边界 | AssignmentDTO, QuestionDTO, SubmissionDTO, AnswerDTO, ReviewDTO |
| 关联表 | 多对多关系 | AssignmentQuestion |

## 真值源层级

| 层级 | 适合什么 | 不适合什么 |
| --- | --- | --- |
| MySQL | 最终记录、用户、题目、作业、配置 | 高频游标、临时状态 |
| Redis | 缓存、AI 调用去重 | 长期主记录 |
| 环境变量 | 密钥、连接串 | 业务数据 |

## 同词不同义

| 名词 | 在不同域里的含义 |
| --- | --- |
| status | Assignment.status（进行中/已截止）、Submission.status（已提交/批改中/已完成/已复核） |
| id | 各实体自增主键，不能跨实体默认相等 |
| score | Question.score（满分分值）、SubmissionAnswer.aiScore（AI评分）、SubmissionAnswer.finalScore（最终评分） |
| confidence | 仅出现在 SubmissionAnswer，表示 AI 评分置信度（0-100） |

## 最重要的判断

> 先问：这个对象的真值源在哪里？
>
> 再问：它是主记录、运行态、DTO 还是关联表？
>
> 最后问：它能不能作为别人依赖的唯一真值？

只要这三个问题没答清，就不要直接改代码。

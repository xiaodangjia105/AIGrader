---
name: aigrader-business-dictionary
description: AIGrader 业务词典 Skill。用于统一跨域名词、真值源、对象层级、生命周期和不可变量；当需求涉及 submissionId、answerId、confidence、status 等高频名词，或者在改接口、配置、实体前需要先搞清对象真实语义时使用。
---

# aigrader-business-dictionary

这个 Skill 不负责直接改某个具体业务域，它负责先把"你到底在改什么对象"说清楚。

## 使用顺序

- 先看 references/object-dictionary.md，统一对象层级和真值源。
- 再判断当前对象属于鉴权域、题库域、作业域、批改域还是统计域。
- 如果对象语义已经清楚，再切到对应领域 Skill 做具体修改。

## 这层主要解决什么

- submissionId 在不同域里是不是同一个东西？
- status 在 Assignment、Submission、SubmissionAnswer 里代表不同含义。
- confidence 是展示字段，还是运行时写入能力的正式语义？
- 某个对象到底是主记录、运行态、DTO 还是视图对象？

## 必守约束

- 先判定真值源，再改实现。
- 不要把运行时缓存当成最终业务事实。
- 不要把 DTO 或视图对象误当成主记录。
- 不要让同一个名词在不同域里被默认当成同一个对象。

## 不要用我做什么

- 不要用我直接改批改策略；那属于 aigrader-grading。
- 不要用我直接改题目管理；那属于 aigrader-question-bank。
- 不要用我直接改认证流程；那属于 aigrader-auth。

## 参考资料

- references/object-dictionary.md

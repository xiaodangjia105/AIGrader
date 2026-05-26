---
name: aigrader-change-playbook
description: AIGrader 变更剧本 Skill。用于处理跨接口、实体、DTO、前端页面的改动；当需求不是单文件微调，而是需要考虑影响面、校验顺序、回滚策略和跨层一致性时使用。
---

# aigrader-change-playbook

## 使用顺序

- 先看 references/cross-domain-checklist.md，判断改动覆盖哪些层。
- 改题目时看 references/question-change.md。
- 改作业时看 references/assignment-change.md。
- 改批改时看 references/grading-change.md。
- 改认证时看 references/auth-change.md。

## 核心原则

- 先定对象，再定契约，再定实现。
- 主记录、DTO、缓存、前端组件的改法不一样。
- 改动只要跨两层以上，就必须显式检查影响面和回滚点。

## 参考资料

- references/cross-domain-checklist.md
- references/question-change.md
- references/assignment-change.md
- references/grading-change.md
- references/auth-change.md

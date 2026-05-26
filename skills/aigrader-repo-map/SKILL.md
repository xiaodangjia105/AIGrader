---
name: aigrader-repo-map
description: AIGrader 仓库导航 Skill。用于快速判断需求应该落到哪个业务域、哪个控制器、哪个服务；当需求入口不清晰、需要先找模块边界、接口总览、运行入口或改动影响面时使用。
---

# aigrader-repo-map

先用这层做路由，再切到对应业务 Skill。

## 使用顺序

- 先看 references/request-to-module-map.md，把需求归到一个主域。
- 再看 references/common-entrypoints.md，找到最先该打开的控制器或服务文件。
- 再看 references/api-map.md，按接口前缀和认证方式快速定位实现。
- 如果需求涉及改接口、改配置、改工作流或跨多个域，立刻切到对应领域 Skill，不要长期停留在总路由层。

## 路由原则

- 先判断对象是什么，再判断它属于哪个域。
- 题库、题目、题型、批量导入，都归 aigrader-question-bank。
- 作业创建、选题组卷、作业列表、截止时间，都归 aigrader-assignment。
- 提交作答、AI 批改、评分策略、教师复核、学生订正，都归 aigrader-grading。
- 班级统计、学生报告、AI 准确率，都归 aigrader-statistics。
- 登录、JWT、角色权限、SecurityUtil，都归 aigrader-auth。
- AI 配置、用户管理、质量监控，都归 aigrader-admin。
- 需求同时改接口、DTO、配置、实体时，先用 aigrader-change-playbook。
- 现象不清楚、怀疑卡死、评分不对、字段缺失时，先用 aigrader-business-dictionary 确认对象语义。

## 什么时候继续下钻

- 需求已经明确落到某个 controller、service 时，不要继续停在 repo-map。
- 需要确认对象模型、实体字段、DTO 结构时，优先打开对应领域的 references。
- 如果你已经知道要改哪一层，就直接切换 Skill，不要再做二次路由。

## 参考资料

- references/module-routing.md
- references/common-entrypoints.md
- references/request-to-module-map.md
- references/api-map.md

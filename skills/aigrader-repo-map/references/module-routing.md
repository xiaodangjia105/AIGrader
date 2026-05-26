# 模块路由

## 模块职责

- `auth`：登录态、JWT、角色权限、SecurityUtil、JwtAuthenticationFilter。
- `question`：题目 CRUD、题型管理、批量导入（JSON/CSV）。
- `assignment`：作业创建、选题组卷、班级关联、截止时间。
- `grading`：提交批改、三种评分策略、教师复核、学生订正、评语生成。
- `statistics`：班级统计、学生报告、AI 准确率趋势。
- `admin`：AI 配置管理、用户管理、质量监控看板。

## 典型切法

- 看到 `/api/auth/**`，先去 `aigrader-auth`。
- 看到 `/api/questions/**`，先去 `aigrader-question-bank`。
- 看到 `/api/assignments/**`，先去 `aigrader-assignment`。
- 看到 `/api/submissions/**`，先去 `aigrader-grading`。
- 看到 `/api/grading/**`，先去 `aigrader-grading`。
- 看到 `/api/statistics/**`，先去 `aigrader-statistics`。
- 看到 `/api/admin/**`，先去 `aigrader-admin`。

## 边界判断

- 批改域改动常常会连到作业域的状态变更和题目域的答案校验，但主域仍是 grading。
- 只要改动的核心目标是"评分策略、复核流程、订正逻辑"，就不要把它当成普通作业管理。
- 只要改动的核心目标是"题目增删改查、题型枚举"，就不要把它当成批改或作业。

## 交接信号

- 需求同时涉及一个域的 API 和另一个域的实体，说明已经越过总路由层，应该切到对应领域 Skill。
- 需求同时涉及实体字段、DTO 结构、缓存键和权限校验，说明应该切到 `aigrader-change-playbook`。

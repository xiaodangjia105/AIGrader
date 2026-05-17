# AIGrader 开发辅助 Skill

此 skill 为 AIGrader 项目提供开发辅助。

## 项目上下文

AIGrader 是 AI 作业批改平台。详细需求见项目根目录的 `PRD.md` 和 `DEVELOPMENT_PLAN.md`。

## 开发规范

- 后端代码位于 `backend/`，前端代码位于 `frontend/`
- 遵循 PRD.md 第四节中的系统架构设计
- 每次改动聚焦一个文件/一个类
- 敏感配置通过环境变量注入，不提交到仓库
- 禁止批量删除文件
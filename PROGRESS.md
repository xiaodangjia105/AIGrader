# AIGrader 开发进度

> 最后更新：2026-05-18

---

## 项目状态总览

| 阶段 | 状态 | Agent |
|---|---|---|
| M1-M6 MVP 基础 | ? 已完成 | — |
| 种子数据修复（密码） | ? 已完成 | — |
| 前端 JWT 登录对接 | ?? 待开发 | Agent-F |
| AI Prompt 多维度+模型切换 | ?? 待开发 | Agent-A |
| 个性化评语+学习报告 | ?? 待开发 | Agent-B |
| 批量导入+AI准确率追踪 | ?? 待开发 | Agent-C |

---

## Agent 任务分配

### Agent-F：基础设施 — 前端 JWT 对接
- **分支：** `codex/jwt-frontend`
- **状态：** ? 待开始
- **文件：** LoginPage.tsx / useAuthStore.ts / api.ts / types/index.ts
- **依赖：** 无
- **阻塞：** Agent-A / Agent-B / Agent-C（需要等 Agent-F 完成后再开始前端部分）

### Agent-A：AI 增强 — Prompt 多维度 + 模型切换
- **分支：** `codex/ai-prompt`
- **状态：** ? 待开始
- **后端文件：** SubjectiveGradingStrategy / GradingResult / PromptTemplateService / GradingService / SubmissionAnswer / AiConfig + repo + service + controller / DynamicChatClientConfig / DTO
- **前端文件：** AdminAIConfig.tsx / api.ts / types / router / MainLayout
- **依赖：** 后端无依赖；前端依赖 Agent-F 完成

### Agent-B：业务增强 — 个性化评语 + 学习报告
- **分支：** `codex/comment-report`
- **状态：** ? 待开始
- **后端文件：** CommentService / ReportService / Submission / GradingController / StatisticsController / DTO
- **前端文件：** StudentReport.tsx / TeacherGradingReview.tsx / StudentResults.tsx / api.ts / types / router / MainLayout
- **依赖：** 后端无依赖；前端依赖 Agent-F 完成

### Agent-C：管理增强 — 批量导入 + AI 准确率
- **分支：** `codex/admin-advanced`
- **状态：** ? 待开始
- **后端文件：** QuestionService / QuestionController / BatchImportResultDTO / StatisticsService / StatisticsController / AiAccuracyDTO
- **前端文件：** AdminQuestions.tsx / AdminMonitor.tsx / api.ts / types
- **依赖：** 后端无依赖；前端依赖 Agent-F 完成

---

## 执行顺序

```
第一步：Agent-F（前端 JWT）
    │
    ├──→ 第二步（并行）：
    │       Agent-A（AI 增强）
    │       Agent-B（业务增强）
    │       Agent-C（管理增强）
    │
    └──→ 第三步：审查 + 合并
```

---

## 功能完成清单

### 已完成 ?
- [x] Spring Security + JWT（后端）
- [x] 题库 CRUD（后端+前端）
- [x] 作业创建/管理（后端+前端）
- [x] 学生作答/提交（后端+前端）
- [x] AI 批改引擎（3 策略）
- [x] 教师复核（后端+前端）
- [x] 学生订正（后端+前端）
- [x] 班级基础统计（后端+前端）
- [x] 种子数据修复（bcrypt 密码）

### 待开发 ?
- [ ] 前端 JWT 登录对接
- [ ] AI Prompt 多维度评分
- [ ] AI Prompt 分学科模板
- [ ] 模型切换管理界面
- [ ] 教师个性化评语
- [ ] 学生薄弱知识点报告
- [ ] 批量导入题目
- [ ] AI 准确率趋势追踪
# AIGrader — 开发计划

> 版本：v1.0 | 更新：2026-05-17

---

## M1 — 项目初始化 ✅

- [x] 创建项目目录结构
- [x] 编写 AGENTS.md 协作规范
- [x] 编写 PRD.md 需求文档
- [x] 编写 DEVELOPMENT_PLAN.md 开发计划
- [x] 初始化 Spring Boot 项目（pom.xml、基础配置、主类）
- [x] 初始化 React 项目（Vite + pnpm + Ant Design）
- [x] 配置数据库连接（PG + pgvector + Redis）
- [x] 编写 README.md + .gitignore
- [x] 初始化 Git 仓库 + 推送 GitHub

## M2 — 基础 CRUD + 数据模型 ✅

- [x] 8 个 Entity 实体类（User / ClassGroup / Question / Assignment / AssignmentQuestion / Submission / SubmissionAnswer / Correction）
- [x] 8 个 JPA Repository 接口
- [x] 5 个 DTO 类
- [x] 题库管理 CRUD API（QuestionController）
- [x] 前端题库管理页面（AdminQuestions）
- [x] 种子数据 SQL（10 道题目 + 6 个用户 + 2 个班级）
- [x] 后端编译通过（42 个 Java 文件 0 错误）

## M3 — AI 批改引擎 ✅

- [x] Spring AI + DeepSeek 集成（spring-ai-openai）
- [x] 选择题/判断题策略（ChoiceGradingStrategy — 精确匹配）
- [x] 填空题策略（FillBlankGradingStrategy — LLM 语义判断）
- [x] 主观题策略（SubjectiveGradingStrategy — 多维度评分）
- [x] GradingService 异步批改调度
- [x] Redis 缓存配置（CacheConfig）

## M4 — 核心闭环 ✅

- [x] 教师端：作业列表 + 创建作业 + 选题组卷
- [x] 学生端：作业列表 + 作答界面 + 提交作业
- [x] 批改流程：提交 → 异步 AI 批改 → 结果展示
- [x] 教师复核：查看 AI 结果 + 修正评分 + 添加评语
- [x] 学生订正：查看解析 + 二次作答

## M5 — 统计 + 管理后台 ✅

- [x] 班级统计（完成率、平均分、提交数）
- [x] 管理后台：题库管理（CRUD）
- [x] 管理后台：用户管理（列表查看）
- [x] 管理后台：质量监控（基础统计）

## M6 — 联调 + 发布 ✅

- [x] 前后端分别编译通过
- [x] TypeScript 零错误 + Vite 构建成功
- [x] Maven 编译成功（42 个 Java 文件）
- [x] .gitignore 脱敏配置
- [x] README 文档 + 启动说明
- [x] GitHub 推送

---

## 待办事项

### 高优先级
- [ ] 创建数据库 + 运行种子数据脚本
- [ ] 配置 DEEPSEEK_API_KEY 环境变量并启动后端测试
- [ ] 启动前端联调验证完整流程

### 中优先级
- [ ] 添加 JUnit 单元测试（AI 引擎 + Service 层）
- [ ] 添加前端组件测试（Vitest）
- [ ] pgvector 语义检索功能实现

### 低优先级
- [ ] Spring Security + JWT 认证
- [ ] E2E 测试（Playwright）
- [ ] MinIO 图片上传
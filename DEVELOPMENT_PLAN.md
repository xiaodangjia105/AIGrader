# AIGrader — 开发计划

> 版本：v1.0 | 更新：2026-05-17

---

## M1 — 项目初始化 ✅

- [x] 创建项目目录结构
- [x] 编写 AGENTS.md 协作规范
- [x] 编写 PRD.md 需求文档
- [x] 编写 DEVELOPMENT_PLAN.md + ENV_INFO.md
- [x] 初始化 Spring Boot 项目（pom.xml、基础配置、主类）
- [x] 初始化 React 项目（Vite + pnpm + Ant Design）
- [x] 配置数据库连接（PG + pgvector + Redis DB2）
- [x] 编写 README.md + .gitignore
- [x] 初始化 Git 仓库 + 推送 GitHub

## M2 — 基础 CRUD + 数据模型 ✅

- [x] 8 个 Entity 实体类
- [x] 8 个 JPA Repository 接口
- [x] 5 个 DTO 类
- [x] 题库管理 CRUD API
- [x] 前端题库管理页面
- [x] 种子数据 SQL
- [x] 后端编译通过（42 个 Java 文件）

## M3 — AI 批改引擎 ✅

- [x] Spring AI + DeepSeek 集成
- [x] 选择题/判断题策略（精确匹配）
- [x] 填空题策略（LLM 语义判断）
- [x] 主观题策略（多维度评分）
- [x] GradingService 异步批改调度
- [x] Redis 缓存配置

## M4 — 核心闭环 ✅

- [x] 教师端：作业列表 + 创建作业
- [x] 学生端：作答界面 + 提交作业
- [x] 批改流程：提交 → AI 批改 → 结果展示
- [x] 教师复核：修正评分 + 评语
- [x] 学生订正：二次作答

## M5 — 统计 + 管理后台 ✅

- [x] 班级统计（完成率、平均分）
- [x] 管理后台题库管理
- [x] 管理后台用户管理
- [x] 管理后台质量监控

## M6 — 联调 + 发布 ✅

- [x] 前后端分别编译通过
- [x] TypeScript 零错误 + Vite 构建成功
- [x] Maven 编译成功
- [x] .gitignore 脱敏配置
- [x] README + 文档中文化
- [x] GitHub 推送

---

## 待办事项

### 高优先级
- [ ] 创建 ai_grader 数据库 + 运行种子数据
- [ ] 配置 DEEPSEEK_API_KEY 并启动测试

### 中优先级
- [ ] JUnit 单元测试
- [ ] 前端组件测试（Vitest）
- [ ] pgvector 语义检索

### 低优先级
- [x] Spring Security + JWT 认证（已实现：JwtUtil、SecurityConfig、AuthController、JwtAuthenticationFilter、CustomUserDetailsService）
- [ ] E2E 测试（Playwright）
- [ ] MinIO 图片上传

---

## 当前问题清单（2026-05-20 检测）

### 已修复
- [x] TypeScript 编译错误：getTeacherAssignments() 缺参数 → 改用 getMyAssignments()
- [x] TypeScript 编译错误：pi.getClasses() 不存在 → 已添加到 API 服务
- [x] 前后端 API 不一致：/assignments/teacher/{id} → 统一为 /assignments/my
- [x] 前后端 API 不一致：/submissions/student/{id} → 统一为 /submissions/my

### 待改进
- [ ] 班级统计页面仅有基础数据，缺少 PRD 中的「分数分布柱状图」「高频错题 Top 5」
- [ ] 学生订正页面未展示原题和原始答案上下文
- [ ] TeacherGradingReview 路由参数名为 :submissionId 但实际传的是 ssignmentId，命名误导
- [ ] TeacherQuestions.tsx 与 AdminQuestions.tsx 代码高度重复（~95%）
- [ ] 种子数据 SQL 文件未确认存在且可运行
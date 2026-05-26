# AIGrader — 开发计划

> 版本：v1.0 | 更新：2026-05-26

---

## 一、项目概述

| 项目 | 详情 |
|---|---|
| 项目名称 | AIGrader — AI 作业批改平台 |
| 核心闭环 | 教师布置 → AI 批改 → 学生订正 → 教师复核 |
| 技术栈 | Spring Boot 3.4.5 + Java 21 / React 18 + Vite + TypeScript + Ant Design 5 |
| AI 引擎 | Spring AI 1.0.0-M6 + DeepSeek（deepseek-chat），支持运行时切换模型 |
| 数据库 | PostgreSQL 16 + pgvector 扩展 |
| 缓存 | Redis 7（DB=2） |
| 认证 | Spring Security + JWT（无状态 Token），三种角色（TEACHER / STUDENT / ADMIN） |
| 代码规模 | 后端 63 个 Java 文件，前端 22 个 TSX/TS 文件 |
| 文档体系 | PRD.md + DEVELOPMENT_PLAN.md + ENV_INFO.md + AGENTS.md + skills/*/（9 个 Skill） |

---

## 二、里程碑总览

| 里程碑 | 内容 | 状态 |
|---|---|---|
| M1 | 项目初始化（目录结构、pom.xml、Vite 脚手架、数据库连接、Git 仓库） | ✅ 已完成 |
| M2 | 基础 CRUD + 数据模型（8 个 Entity、8 个 Repository、5 个 DTO、题库管理） | ✅ 已完成 |
| M3 | AI 批改引擎（Spring AI 集成、三种策略、异步调度、Redis 缓存） | ✅ 已完成 |
| M4 | 核心闭环（教师布置作业、学生作答提交、AI 批改、教师复核、学生订正） | ✅ 已完成 |
| M5 | 统计 + 管理后台（班级统计、题库管理、用户管理、AI 配置、质量监控） | ✅ 已完成 |
| M6 | 联调 + 发布（前后端编译通过、TypeScript 零错误、GitHub 推送） | ✅ 已完成 |
| M7 | 认证 + 异常处理 + Skill 文档体系 | ✅ 已完成 |

---

## 三、后端架构

### 3.1 分层清单（63 个 Java 文件）

```
controller/ (8 个)
├── AuthController.java              POST /api/auth/login
├── AssignmentController.java        CRUD /api/assignments
├── SubmissionController.java        CRUD /api/submissions
├── GradingController.java           复核 /api/grading  + 订正 /api/corrections
├── QuestionController.java          CRUD /api/questions + 批量导入
├── StatisticsController.java        统计 /api/statistics + 用户 /api/users
├── AdminAiConfigController.java     AI 配置 /api/admin/ai-config
└── ClassController.java             班级列表 /api/classes

service/ (10 个)
├── GradingService.java              批改调度（@Async）+ 复核
├── SubmissionService.java           提交管理 + 归属校验
├── AssignmentService.java           作业创建 + 选题组卷
├── QuestionService.java             题库 CRUD + 批量导入
├── StatisticsService.java           班级/学生统计 + AI 准确率
├── ReportService.java               学生个人学习报告
├── CommentService.java              AI 个性化评语生成
├── AiConfigService.java             AI 配置动态切换（运行时换模型）
├── CustomUserDetailsService.java    Spring Security 用户加载
└── PromptTemplateService.java       分学科 Prompt 模板

ai/ (6 个)
├── GradingStrategy.java             批改策略接口
├── ChoiceGradingStrategy.java       选择/判断题：精确匹配（<10ms）
├── FillBlankGradingStrategy.java    填空题：精确优先 → LLM 语义判断
├── SubjectiveGradingStrategy.java   主观题：LLM 多维度评分
├── GradingResult.java               批改结果模型
└── PromptTemplateService.java       分学科 Prompt 模板

entity/ (8 个)
├── User.java                        id, username, password(BCrypt), nickname, role, classId
├── ClassGroup.java                  id, name
├── Question.java                    id, questionType, content, options, correctAnswer, score, difficulty, subject
├── Assignment.java                  id, title, teacherId, classId, deadline, status
├── AssignmentQuestion.java          id, assignmentId, questionId, sortOrder
├── Submission.java                  id, assignmentId, studentId, status, totalScore, submittedAt
├── SubmissionAnswer.java            id, submissionId, questionId, studentAnswer, aiScore, aiFeedback, confidence, finalScore, teacherComment
├── Correction.java                  id, submissionAnswerId, newAnswer, createdAt
└── AiConfig.java                    id, apiKey, model, baseUrl, isActive, createdAt

repository/ (8 个) — 对应上述 8 个实体
dto/       (12 个) — 请求/响应对象
config/    (6 个) — SecurityConfig, JwtUtil, JwtAuthenticationFilter, CacheConfig, DynamicChatClientConfig, WebConfig
common/    (6 个) — ApiResponse, BusinessException, GlobalExceptionHandler, QuestionType, UserRole, SecurityUtil
```

### 3.2 数据库表（JPA ddl-auto: update 自动建表）

| 表名 | 说明 | 关键字段 |
|---|---|---|
| users | 用户 | id, username, password(BCrypt), nickname, role, class_id |
| class_groups | 班级 | id, name |
| questions | 题库 | id, question_type, content, options(JSONB), correct_answer, score, difficulty, subject |
| assignments | 作业 | id, title, teacher_id, class_id, deadline, status |
| assignment_questions | 作业-题目关联 | id, assignment_id, question_id, sort_order |
| submissions | 提交 | id, assignment_id, student_id, status, total_score, submitted_at |
| submission_answers | 答题明细 | id, submission_id, question_id, student_answer, ai_score, ai_feedback, confidence, final_score, teacher_comment |
| corrections | 订正记录 | id, submission_answer_id, new_answer, created_at |
| ai_config | AI 配置 | id, api_key, model, base_url, is_active, created_at |

---

## 四、前端架构

### 4.1 组件清单（22 个 TSX/TS 文件）

```
pages/
├── LoginPage.tsx                      登录页（用户名+密码 → JWT）
├── teacher/
│   ├── TeacherAssignments.tsx         教师作业列表
│   ├── TeacherCreateAssignment.tsx    创建作业（选题组卷）
│   ├── TeacherGradingReview.tsx       批改复核（逐题查看/修正评分）
│   ├── TeacherQuestions.tsx           教师端题库管理
│   └── TeacherStatistics.tsx          班级统计
├── student/
│   ├── StudentAssignments.tsx         学生作业列表
│   ├── StudentAnswer.tsx              在线作答（5 种题型）
│   ├── StudentResults.tsx             批改结果查看
│   ├── StudentCorrection.tsx          错题订正
│   └── StudentReport.tsx              个人学习报告
└── admin/
    ├── AdminQuestions.tsx             题库管理（CRUD + 批量导入）
    ├── AdminUsers.tsx                 用户管理
    ├── AdminAIConfig.tsx              AI 配置（动态切换模型）
    └── AdminMonitor.tsx               质量监控看板

components/
└── MainLayout.tsx                     主布局（侧边栏 + 顶栏 + 角色路由）

router/
└── index.tsx                          React Router 配置（角色权限守卫）

services/
└── api.ts                             Axios 封装（JWT 拦截器 + 统一错误处理）

store/
└── useAuthStore.ts                    Zustand 认证状态

types/
└── index.ts                           TypeScript 类型定义
```

### 4.2 页面路由

| 路由 | 页面 | 角色 | 说明 |
|---|---|---|---|
| `/login` | LoginPage | 公开 | JWT 登录 |
| `/teacher/assignments` | TeacherAssignments | TEACHER | 我的作业列表 |
| `/teacher/assignments/new` | TeacherCreateAssignment | TEACHER | 创建作业 |
| `/teacher/questions` | TeacherQuestions | TEACHER | 题库管理 |
| `/teacher/grading/:id` | TeacherGradingReview | TEACHER | 批改复核 |
| `/teacher/statistics` | TeacherStatistics | TEACHER | 班级统计 |
| `/student/assignments` | StudentAssignments | STUDENT | 本班作业 |
| `/student/answer/:id` | StudentAnswer | STUDENT | 在线作答 |
| `/student/results/:id` | StudentResults | STUDENT | 批改结果 |
| `/student/correction/:id` | StudentCorrection | STUDENT | 错题订正 |
| `/student/report` | StudentReport | STUDENT | 学习报告 |
| `/admin/questions` | AdminQuestions | ADMIN | 题库管理 |
| `/admin/users` | AdminUsers | ADMIN | 用户管理 |
| `/admin/ai-config` | AdminAIConfig | ADMIN | AI 配置 |
| `/admin/monitor` | AdminMonitor | ADMIN | 质量监控 |

---

## 五、功能完成度

### 5.1 教师端 — 完成度 90%

| 功能 | 状态 | 说明 |
|---|---|---|
| 作业列表 | ✅ | 按状态筛选（进行中/已截止），显示提交进度 |
| 创建作业 | ✅ | 标题 + 班级 + 截止时间 + 题库选题 |
| 选题组卷 | ✅ | 按学科/题型/难度筛选，多选批量添加 |
| AI 批改结果查看 | ✅ | 逐题展示 AI 评分、反馈、置信度 |
| 修正评分 | ✅ | 教师覆盖 AI 评分 + 补充评语 |
| AI 自动评语 | ✅ | 一键生成个性化综合评语 |
| 班级统计 | ✅ | 完成率、平均分、提交数 |
| 分数分布图 | ❌ | 待添加柱状图和分数段分布 |
| 高频错题 Top 5 | ❌ | 待实现 |

### 5.2 学生端 — 完成度 85%

| 功能 | 状态 | 说明 |
|---|---|---|
| 作业列表 | ✅ | 本班作业 + 截止时间 + 状态标签 |
| 在线作答 | ✅ | 选择/判断/填空/简答/作文 5 种题型 |
| 提交作业 | ✅ | 一次性提交，触发异步 AI 批改 |
| 批改结果 | ✅ | 逐题展示答案/AI 评分/反馈/正确与否 |
| 错题订正 | ✅ | 错题旁订正按钮，重新作答 |
| 订正历史 | ✅ | corrections 表记录所有订正 |
| 学习报告 | ✅ | 总成绩 + 各题得分 + 薄弱知识点 |
| 原题上下文 | ❌ | 订正页未展示原题和原始答案 |

### 5.3 管理后台 — 完成度 85%

| 功能 | 状态 | 说明 |
|---|---|---|
| 题库管理 | ✅ | CRUD + JSON/CSV 批量导入 API |
| 用户管理 | ✅ | 用户列表 + 按角色筛选 |
| AI 配置 | ✅ | 运行时动态切换 API Key/模型/Base URL |
| 质量监控 | ✅ | 用户总数、题目总数、平均分、完成率 |
| 批量导入页面 | ❌ | 前端仅后端 API 完成，缺管理端导入界面 |
| AI 准确率趋势 | ❌ | 待实现分题型准确率趋势图 |

### 5.4 AI 批改引擎 — 完成度 80%

| 策略 | 状态 | 准确率 | 延迟 | 说明 |
|---|---|---|---|---|
| 选择/判断 | ✅ | ≥99% | <10ms | 精确字符串匹配，不调用 LLM |
| 填空 | ✅ | ~90% | <3s | 精确优先 → LLM 语义判断降级 |
| 主观题 | ✅ | ~80% | <5s | LLM 多维度评分 + 个性化反馈 |
| 异步调度 | ✅ | — | — | @Async 后台批改，不阻塞提交 |
| Prompt 调优 | ❌ | — | — | 基础 Prompt，未经过教学场景优化 |
| 向量检索 | ❌ | — | — | pgvector 扩展已装，embedding 字段未填充 |

### 5.5 认证安全 — 完成度 100%

| 功能 | 状态 | 说明 |
|---|---|---|
| JWT 生成/验证 | ✅ | HMAC-SHA256，含 userId/username/role |
| 角色权限 | ✅ | @PreAuthorize 注解，三种角色 |
| 前后端对接 | ✅ | Axios 拦截器自动附加 Bearer token |
| 路由守卫 | ✅ | 按角色限制页面访问 |
| API Key 脱敏 | ✅ | 后端 maskApiKey() + 前端 maskKey() |
| 全局异常处理 | ✅ | GlobalExceptionHandler 统一响应格式 |

---

## 六、已知问题 & 技术债

### 6.1 代码质量

| 问题 | 严重度 | 影响 | 建议 |
|---|---|---|---|
| TeacherQuestions.tsx ≈ AdminQuestions.tsx（~95% 重复） | 🟡 中 | 改题库需同步两份代码 | 抽取共享组件 QuestionManager |
| TeacherGradingReview 路由参数命名 | 🟡 低 | `:submissionId` 实际接收 `assignmentId` | 重命名为 `:assignmentId` |
| CORS allowedOriginPatterns("*") | 🟡 中 | 允许任意来源跨域 | 限制为前端域名 |
| spring.jpa.open-in-view 警告 | 🟢 低 | 视图渲染时持有 DB 连接 | 生产环境建议关闭 |

### 6.2 功能缺失

| 问题 | 严重度 | 影响 |
|---|---|---|
| application.yml 含明文数据库密码（默认值） | 🔴 高 | 生产环境需通过环境变量注入 |
| DeepSeek API Key 未配置 | 🔴 高 | 主观题/填空题 LLM 批改不工作 |
| 无 API 限流 | 🟡 中 | 可能被滥用 |
| 无单元测试 | 🟡 中 | 重构风险高 |
| 前端大 chunk 1.2MB | 🟡 低 | 首屏加载偏慢（Ant Design 全量引入） |
| 移动端未适配 | 🟢 低 | MVP 仅桌面端 |

---

## 七、环境变量

| 变量名 | 默认值 | 说明 |
|---|---|---|
| `DEEPSEEK_API_KEY` | （空，必填） | DeepSeek API Key |
| `DB_HOST` | `10.237.255.9` | PostgreSQL 主机 |
| `DB_PORT` | `5432` | PostgreSQL 端口 |
| `DB_NAME` | `ai_grader` | 数据库名 |
| `DB_USER` | `ai_grader` | 数据库用户 |
| `DB_PASSWORD` | `ai_grader123` | 数据库密码 |
| `REDIS_HOST` | `10.237.255.9` | Redis 主机 |
| `REDIS_PORT` | `6379` | Redis 端口 |
| `SERVER_PORT` | `8080` | 后端端口 |
| `JWT_SECRET` | `aigrader-default-secret-key-for-development-only` | JWT 签名密钥 |
| `JWT_EXPIRATION` | `86400000` | Token 过期（毫秒，默认 24h） |

---

## 八、快速启动

```bash
# 1. 设置环境变量（Windows）
set DEEPSEEK_API_KEY=sk-your-key-here

# 2. 启动后端（端口 8080）
cd backend
mvn spring-boot:run

# 3. 启动前端（端口 5173）
cd frontend
pnpm install
pnpm dev

# 4. 测试登录
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"admin\",\"password\":\"admin123\"}"
```

### Demo 账户

| 用户名 | 密码 | 角色 |
|---|---|---|
| `admin` | `admin123` | 管理员 |
| `teacher_zhang` | `teacher123` | 教师 |
| `teacher_li` | `teacher123` | 教师 |
| `student_xiao` | `student123` | 学生 |
| `student_hong` | `student123` | 学生 |
| `student_gang` | `student123` | 学生 |

---

## 九、版本路线

| 版本 | 内容 | 状态 | 预计 |
|---|---|---|---|
| v1.0 | MVP：三端闭环 + AI 引擎 + JWT 认证 + Skill 文档 | ✅ 已完成 | 2026-05 |
| v1.1 | AI Prompt 调优 + 分数分布图 + 高频错题 + 批量导入页面 | 🔜 计划中 | 2026-06 |
| v1.2 | 单元测试 + pgvector 语义检索 + 相似题推荐 | 📋 远期 | 2026-07 |
| v2.0 | MinIO 图片上传 + 拍照批改 + E2E 测试 | 📋 远期 | TBD |

---

## 十、文档索引

| 文档 | 路径 | 说明 |
|---|---|---|
| 产品需求 | `PRD.md` | 功能需求、用户画像、API 设计 |
| 开发计划 | `DEVELOPMENT_PLAN.md` | 本文件 |
| 环境速查 | `ENV_INFO.md` | 端口、数据库、启动命令 |
| AI 协作 | `AGENTS.md` | 编码规范 + Skill 索引 |
| Skill 文档 | `skills/*/` | 9 个领域知识库（52 个文件） |

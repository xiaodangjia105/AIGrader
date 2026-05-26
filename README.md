# AIGrader — AI 作业批改平台

> 基于 AI 的中小学作业批改平台，覆盖 **教师布置 → AI 秒级批改 → 学生即时查看与订正 → 教师复核** 的完整闭环。

---

## 技术栈

| 层级 | 技术 |
|---|---|
| 后端框架 | Spring Boot 3.4.5 + Java 21 + Maven |
| AI 引擎 | Spring AI 1.0.0-M6 + DeepSeek（支持动态切换模型） |
| 安全认证 | Spring Security + JWT（无状态 Token） |
| 数据库 | PostgreSQL 16 + pgvector 扩展 |
| 缓存 | Redis 7（DB=2） |
| 前端框架 | React 18 + Vite + TypeScript |
| UI 组件 | Ant Design 5 |
| 图表 | Recharts 2.15 |
| 状态管理 | Zustand |

---

## 项目结构

```
AIGrader/
├── README.md                    ← 本文件
├── PRD.md                       ← 产品需求文档
├── DEVELOPMENT_PLAN.md          ← 开发计划 + 功能状态
├── ENV_INFO.md                  ← 环境速查
├── AGENTS.md                    ← AI 协作约束
│
├── backend/                     ← Spring Boot 后端
│   ├── pom.xml
│   └── src/main/java/com/aigrader/
│       ├── AIGraderApplication.java
│       ├── ai/                  ← AI 批改引擎（策略模式）
│       │   ├── GradingStrategy.java
│       │   ├── ChoiceGradingStrategy.java
│       │   ├── FillBlankGradingStrategy.java
│       │   ├── SubjectiveGradingStrategy.java
│       │   ├── GradingResult.java
│       │   └── PromptTemplateService.java   ← 分学科 Prompt
│       ├── controller/          ← REST 控制器（8 个）
│       │   ├── AuthController.java
│       │   ├── AssignmentController.java
│       │   ├── SubmissionController.java
│       │   ├── GradingController.java
│       │   ├── QuestionController.java
│       │   ├── StatisticsController.java
│       │   └── AdminAiConfigController.java
│       ├── service/             ← 业务服务（10 个）
│       │   ├── GradingService.java
│       │   ├── CommentService.java          ← 个性化评语
│       │   ├── ReportService.java           ← 学习报告
│       │   ├── StatisticsService.java
│       │   ├── AiConfigService.java         ← 模型切换
│       │   └── ...
│       ├── entity/              ← JPA 实体（9 个）
│       ├── repository/          ← JPA 仓库（9 个）
│       ├── dto/                 ← 数据传输对象（12 个）
│       ├── config/              ← Spring 配置
│       └── common/              ← 工具/枚举
│
├── skills/                      ← Skill 文档管理体系（9 个域）
│   ├── aigrader-repo-map/       ← 仓库导航
│   ├── aigrader-auth/           ← 认证鉴权
│   ├── aigrader-question-bank/  ← 题库管理
│   ├── aigrader-assignment/     ← 作业管理
│   ├── aigrader-grading/        ← AI 批改引擎
│   ├── aigrader-statistics/     ← 统计报表
│   ├── aigrader-admin/          ← 管理后台
│   ├── aigrader-business-dictionary/ ← 业务词典
│   └── aigrader-change-playbook/ ← 变更剧本
├── frontend/                    ← React 前端
│   ├── package.json
│   └── src/
│       ├── pages/
│       │   ├── LoginPage.tsx
│       │   ├── teacher/        ← 教师端（5 页）
│       │   ├── student/        ← 学生端（5 页，含学习报告）
│       │   └── admin/          ← 管理后台（4 页，含 AI 配置）
│       ├── components/          ← 共享组件
│       ├── services/api.ts      ← API 调用 + JWT 拦截
│       ├── store/               ← Zustand 状态管理
│       ├── router/              ← 路由配置
│       └── types/               ← TypeScript 类型
│
└── skills/                      ← Codex skills
```

---

## 功能清单

### 教师端
| 功能 | 状态 |
|---|---|
| 作业管理（创建/查看/选题组卷） | ✅ |
| AI 批改结果查看 | ✅ |
| 批改复核（修正评分/评语） | ✅ |
| **个性化评语生成（AI）** | ✅ |
| 班级统计（完成率/平均分） | ✅ |

### 学生端
| 功能 | 状态 |
|---|---|
| 查看作业列表 | ✅ |
| 在线答题（选择/判断/填空/简答/作文） | ✅ |
| 查看 AI 批改结果 | ✅ |
| 错题订正 | ✅ |
| **学习报告（薄弱知识点分析 + AI 建议）** | ✅ |

### 管理后台
| 功能 | 状态 |
|---|---|
| 题库管理（CRUD） | ✅ |
| **批量导入题目（JSON/CSV）** | ✅ |
| 用户管理 | ✅ |
| **AI 准确率趋势追踪（折线图）** | ✅ |
| **AI 模型切换配置** | ✅ |

### AI 引擎
| 功能 | 状态 |
|---|---|
| 选择题/判断题精确匹配 | ✅ |
| 填空题语义判断（LLM） | ✅ |
| 主观题多维度评分（内容/逻辑/表达） | ✅ |
| 分学科 Prompt（数学/语文/科学/英语） | ✅ |
| 动态模型切换（运行时热切换） | ✅ |

---

## 环境信息

| 项目 | 值 |
|---|---|
| 前端开发地址 | http://localhost:5173 |
| 后端 API 地址 | http://localhost:8080 |
| PostgreSQL | `ai_grader` @ 10.237.255.9:5432 |
| Redis | 10.237.255.9:6379（DB=2） |
| DeepSeek API | https://api.deepseek.com |

### 环境变量

| 变量名 | 说明 | 默认值 |
|---|---|---|
| `DEEPSEEK_API_KEY` | DeepSeek API Key | （必填） |
| `DB_HOST` | PostgreSQL 主机 | `10.237.255.9` |
| `DB_PORT` | PostgreSQL 端口 | `5432` |
| `DB_NAME` | 数据库名 | `ai_grader` |
| `DB_USER` | 数据库用户 | `ai_grader` |
| `DB_PASSWORD` | 数据库密码 | `ai_grader123` |
| `REDIS_HOST` | Redis 主机 | `10.237.255.9` |
| `REDIS_PORT` | Redis 端口 | `6379` |
| `SERVER_PORT` | 服务端口 | `8080` |
| `JWT_SECRET` | JWT 签名密钥 | `aigrader-default-secret-key-for-development-only` |

---

## Demo 账户

所有用户密码统一为 `123456`。

| 用户名 | 角色 | 昵称 |
|---|---|---|
| `admin` | 管理员 | 管理员 |
| `teacher_zhang` | 教师 | 张老师（数学） |
| `teacher_li` | 教师 | 李老师（语文） |
| `student_xiao` | 学生 | 小明 |
| `student_hong` | 学生 | 小红 |
| `student_gang` | 学生 | 小刚 |

---

## 快速开始

### 环境要求
- Java 21+ / Node.js 18+ / pnpm / Maven 3.9+
- PostgreSQL 16（需启用 pgvector 扩展）
- Redis 7

### 1. 初始化数据库

```bash
# 创建数据库
psql -h 10.237.255.9 -U nvc -d nvc_practice -c "CREATE DATABASE ai_grader;"

# 导入种子数据
psql -h 10.237.255.9 -U ai_grader -d ai_grader -f backend/src/main/resources/data.sql
```

### 2. 启动后端

```bash
cd backend
set DEEPSEEK_API_KEY=sk-your-key
mvn spring-boot:run
```

### 3. 启动前端

```bash
cd frontend
pnpm install
pnpm dev
```

### 4. 访问

打开 http://localhost:5173 → 用 `admin` / `123456` 登录。

> 也可以在管理后台 → AI 配置中动态切换 API Key 和模型，无需重启。

---

## 验证

```bash
# 后端编译
cd backend && mvn clean compile

# 前端类型检查
cd frontend && pnpm tsc --noEmit

# API 测试（登录获取 Token）
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"123456"}'

# 获取题目列表
curl http://localhost:8080/api/questions \
  -H "Authorization: Bearer <token>"
```

---

## Agent 协作开发模式

本项目支持多个 AI Agent 并行开发，以下是完整协作流程。

### 架构设计原则

- **文件级隔离**：每个 Agent 只修改互不重叠的文件集合
- **分支隔离**：每个 Agent 使用独立 Git 分支
- **依赖前置**：基础设施（如 API 层、类型定义）先完成并合并，功能 Agent 再并行
- **编译即验**：Agent 完成后执行编译/类型检查进行验证

### 开发流程

```
1. 开发者分配任务 → 为每个 Agent 编写精确提示词（包含文件范围、禁止事项）
2. 每个 Agent 从 master 创建分支：codex/<feature-name>
3. 基础设施 Agent 先跑，完成后合并到 master
4. 功能 Agent 基于新 master 并行开发
5. 全部完成后审查 → 合并 → 清理分支
```

### Agent 提示词模板

发给 Agent 的提示词需包含以下要素：

```
## 项目上下文
- 项目描述 + 技术栈
- 先读：DEVELOPER_GUIDE.md（在项目根目录）
- 你的分支：codex/<feature-name>

## 任务
- 具体功能点（列表形式，按实现顺序）

## 文件范围
【后端】
- 可改文件 1
- 可改文件 2

【前端】
- 可改文件 1

【禁止修改】
- 不修改 XXX
- 不修改 pom.xml / package.json（除非任务明确要求）
- 完成后不 commit

## 工作流程
1. git checkout -b codex/<feature-name>
2. 后端开发 → mvn compile 验证
3. 前端开发 → pnpm tsc --noEmit 验证
4. 汇报：修改文件清单 + 编译结果

## 验证方法
- 具体测试步骤
```

### 开发规范（Agent 必读）

详见 `DEVELOPER_GUIDE.md`，核心要点：

| 规范 | 说明 |
|---|---|
| 分支命名 | `codex/<feature-name>` |
| 文件操作 | 禁止批量删除，一次只删一个文件 |
| 代码风格 | 后端 Lombok + Builder，前端 Hooks + TypeScript |
| API 规范 | 返回 `ApiResponse<T>`，加 `@PreAuthorize` 注解 |
| 实体修改 | 只加字段不改已有字段类型，JPA 自动建表 |
| 提交策略 | Agent 不 commit，只汇报修改内容 |

### 冲突避免策略

| 冲突风险 | 对策 |
|---|---|
| `api.ts` / `types/index.ts` 多人修改 | 基础设施 Agent 先完成合并，其他 Agent 基于新版本追加 |
| `router/index.tsx` / `MainLayout.tsx` | 不同 Agent 追加到不同路由组/菜单组 |
| 同一 Controller/Service | 追加不同方法通常不冲突 |
| 编码问题 | 使用 UTF-8 无 BOM，避免 GBK 编码导致乱码 |

### 实际案例

本项目 v1.1 的 4 个 Agent 并行开发：

| Agent | 分支 | 后端文件 | 前端文件 | 耗时 |
|---|---|---|---|---|
| Agent-F 基础设施 | `codex/jwt-frontend` | 0 个 | 4 个 | 先跑 |
| Agent-A AI 增强 | `codex/ai-prompt` | 12 个 | 5 个 | 并行 |
| Agent-B 业务增强 | `codex/comment-report` | 5 个 | 7 个 | 并行 |
| Agent-C 管理增强 | `codex/admin-advanced` | 6 个 | 4 个 | 并行 |

结果：4 个 Agent 共修改 50+ 文件，零编译错误，通过审查后合并。

---

## 文档索引

| 文档 | 用途 |
|---|---|
| `PRD.md` | 产品需求文档 |
| `DEVELOPMENT_PLAN.md` | 开发计划（里程碑） |
| `DEVELOPER_GUIDE.md` | Agent 开发规范（架构、启动、测试、规范） |
| `PROGRESS.md` | 功能进度追踪 |
| `ENV_INFO.md` | 环境变量与端口快速参考 |
| `AGENTS.md` | AI 协作约束（项目级行为规范） |
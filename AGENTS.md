# AIGrader — AI 协作规范

> 本文件为 Codex / AI 编码助手提供项目级行为约束与上下文锚点。
> 每次新对话开始时，应首先发送本文件内容作为上下文。

---

## 项目概述

AI 作业批改平台，覆盖 **教师布置 → AI 批改 → 学生订正 → 教师复核** 的完整闭环。

- **后端：** Spring Boot 3.4 + Maven + Java 21
- **前端：** React 18 + Vite + TypeScript + Ant Design 5
- **AI：** Spring AI + DeepSeek (`deepseek-chat`)
- **数据库：** PostgreSQL 16 + pgvector 扩展
- **缓存/队列：** Redis 7（DB=2）

## 项目结构

```
AIGrader/
├── AGENTS.md               ← 本文件
├── PRD.md                  ← 需求文档（锚点）
├── DEVELOPMENT_PLAN.md     ← 开发计划（锚点）
├── ENV_INFO.md             ← 环境速查
├── README.md
├── backend/                ← Spring Boot 后端
│   ├── pom.xml
│   └── src/main/java/com/aigrader/
│       ├── AIGraderApplication.java
│       ├── controller/     ← REST 控制器（5 个）
│       ├── service/        ← 业务服务（5 个）
│       ├── ai/             ← AI 批改引擎（3 种策略）
│       ├── repository/     ← JPA Repository（8 个）
│       ├── entity/         ← 实体类（8 个）
│       ├── dto/            ← DTO（5 个）
│       ├── config/         ← 配置类（2 个）
│       └── common/         ← 工具/异常/枚举（3 个）
├── frontend/               ← React 前端
│   ├── src/
│   │   ├── pages/          ← teacher/ student/ admin/
│   │   ├── components/     ← 共享组件
│   │   ├── hooks/          ← 自定义 Hooks
│   │   ├── services/       ← API 调用
│   │   ├── store/          ← Zustand 状态管理
│   │   ├── router/         ← 路由配置
│   │   └── types/          ← TypeScript 类型定义
│   └── package.json
└── skills/                 ← 基于 Skill 的文档管理体系
    ├── aigrader-repo-map/          ← 仓库导航（需求路由）
    ├── aigrader-auth/              ← 认证鉴权
    ├── aigrader-question-bank/     ← 题库管理
    ├── aigrader-assignment/        ← 作业管理
    ├── aigrader-grading/           ← AI 批改引擎
    ├── aigrader-statistics/        ← 统计报表
    ├── aigrader-admin/             ← 管理后台
    ├── aigrader-business-dictionary/ ← 业务词典
    └── aigrader-change-playbook/   ← 变更剧本
```
## Skill 管理体系

项目参照 AI-Meeting 的 Skill-based 文档管理模式，将业务知识按域拆分为独立的 Skill。
每个 Skill 包含三层：SKILL.md（入口）→ agents/（Agent 配置）→ references/（领域知识文档）。

### 使用原则

- **路由优先：** 新需求先用 igrader-repo-map 定位领域，再切入对应 Skill。
- **先查后改：** 改动前先阅读对应 Skill 的 references/，确认对象语义和约束。
- **跨域先停：** 改动涉及多个域或有歧义时，先用 igrader-business-dictionary 确认名词含义。
- **影响面评估：** 跨层改动时，用 igrader-change-playbook 做影响面分析。

### Skill 索引

| Skill | 覆盖范围 | 触发条件 |
|---|---|---|
| aigrader-repo-map | 需求路由、模块定位 | 需求入口不清晰 |
| aigrader-auth | 登录、JWT、角色权限 | /api/auth/**、SecurityUtil |
| aigrader-question-bank | 题库 CRUD、批量导入 | /api/questions/** |
| aigrader-assignment | 作业创建、选题组卷 | /api/assignments/** |
| aigrader-grading | AI 批改、复核、订正 | /api/submissions/**、/api/grading/** |
| aigrader-statistics | 班级统计、学生报告 | /api/statistics/** |
| aigrader-admin | AI 配置、用户管理 | /api/admin/** |
| aigrader-business-dictionary | 跨域名词统一 | 对象语义不清晰 |
| aigrader-change-playbook | 跨域改动影响面 | 改接口+实体+DTO 一起 |

## 核心约束

### 文件操作
- **禁止** 批量删除文件或目录（`del /s`、`rd /s`、`rm -rf`、`Remove-Item -Recurse`）
- 删除文件时，一次只能删除一个明确路径的文件
- 需要批量删除时，停止操作并请求用户手动处理

### 每次对话范围
- 每次对话只聚焦一个文件 / 一个类
- 对话开始前，发送 `PRD.md` 和 `DEVELOPMENT_PLAN.md` 作为上下文锚点
- 任务完成后关闭对话，新开对话处理下一个任务

### 代码规范
- **Java：** 标准 Spring Boot 分层架构（Controller → Service → Repository）
- **React：** 函数组件 + Hooks，TypeScript 严格模式
- 代码应自解释，禁止添加不必要的注释
- 禁止添加版权/license 声明

### 配置安全
- API Key、数据库密码等敏感信息使用环境变量
- 配置模板文件使用 `.example` 后缀
- `.env` 和 `application-local.yml` 已加入 `.gitignore`

### AI 职责边界
- **AI 负责：** 代码实现 + 测试编写 + 文档维护
- **开发者负责：** 最终决策 + 代码审查 + 合并

## 环境变量

| 变量名 | 说明 | 示例 |
|---|---|---|
| `DEEPSEEK_API_KEY` | DeepSeek API Key | `sk-xxx` |
| `DB_HOST` | PostgreSQL 主机 | `10.237.255.9` |
| `DB_PORT` | PostgreSQL 端口 | `5432` |
| `DB_NAME` | 数据库名 | `ai_grader` |
| `DB_USER` | 数据库用户 | `ai_grader` |
| `DB_PASSWORD` | 数据库密码 | `ai_grader123` |
| `REDIS_HOST` | Redis 主机 | `10.237.255.9` |
| `REDIS_PORT` | Redis 端口 | `6379` |
| `SERVER_PORT` | 服务端口 | `8080` |

## 关键参考

- 需求文档：`PRD.md`
- 开发计划：`DEVELOPMENT_PLAN.md`
- 环境速查：`ENV_INFO.md`
- DeepSeek API 文档：https://api-docs.deepseek.com/
- Spring AI 文档：https://docs.spring.io/spring-ai/reference/

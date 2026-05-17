# AIGrader — AI 协作规范

> 本文件为 Codex / AI 编码助手提供项目级行为约束与上下文锚点。
> 每次新对话开始时，应首先发送本文件内容作为上下文。

---

## 项目概述

AI 作业批改平台：覆盖 **教师布置 → AI 批改 → 学生订正 → 教师复核** 的完整闭环。

- **后端：** Spring Boot 3.4 + Maven + Java 21
- **前端：** React 18 + Vite + TypeScript + Ant Design 5
- **AI：** Spring AI + DeepSeek (`deepseek-chat`)
- **数据库：** PostgreSQL 16 + pgvector 扩展
- **缓存/队列：** Redis 7
- **对象存储：** MinIO

## 项目结构

```
AIGrader/
├── AGENTS.md               ← 本文件
├── PRD.md                  ← 需求文档（锚点）
├── DEVELOPMENT_PLAN.md     ← 开发计划（锚点）
├── README.md               ← 项目说明
├── backend/                ← Spring Boot 后端
│   ├── pom.xml
│   └── src/main/java/com/aigrader/
│       ├── AIGraderApplication.java
│       ├── controller/     ← REST 控制器
│       ├── service/        ← 业务服务
│       ├── ai/             ← AI 批改引擎
│       ├── repository/     ← JPA Repository
│       ├── entity/         ← 实体类
│       ├── dto/            ← DTO
│       ├── config/         ← 配置类
│       └── common/         ← 工具/异常/常量
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
└── skills/                 ← Codex skills
```

## 核心约束

### 文件操作
- **禁止** 批量删除文件或目录（`del /s`、`rd /s`、`rmdir /s`、`rm -rf`、`Remove-Item -Recurse`）
- 删除文件时，一次只能删除一个明确路径的文件
- 需要批量删除时，停止操作并请求用户手动处理

### 每次对话范围
- 每次对话只聚焦 **一个文件 / 一个类**
- 对话开始前，发送 `PRD.md` 和 `DEVELOPMENT_PLAN.md` 作为上下文锚点
- 任务完成后关闭对话，新开对话处理下一个任务

### 代码规范
- **Java：** 标准 Spring Boot 分层架构（Controller → Service → Repository）
- **React：** 函数组件 + Hooks，TypeScript 严格模式
- 代码应自解释，禁止添加不必要的注释
- 禁止添加版权/license 声明

### 配置安全
- API Key、数据库密码等敏感信息使用环境变量
- 配置模板文件使用 `.example` 后缀（如 `application-local.yml.example`）
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
| `DB_NAME` | 数据库名 | `aigrader` |
| `DB_USER` | 数据库用户 | `aigrader` |
| `DB_PASSWORD` | 数据库密码 | `aigrader123` |
| `REDIS_HOST` | Redis 主机 | `10.237.255.9` |
| `REDIS_PORT` | Redis 端口 | `6379` |
| `SERVER_PORT` | 服务端口 | `8080` |

## 关键参考

- 需求文档：`PRD.md`
- 开发计划：`DEVELOPMENT_PLAN.md`
- DeepSeek API 文档：https://api-docs.deepseek.com/
- Spring AI 文档：https://docs.spring.io/spring-ai/reference/
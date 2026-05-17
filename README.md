# AIGrader — AI 作业批改平台

基于 AI 的中小学作业批改平台，覆盖 **教师布置 → AI 秒级批改 → 学生即时订正 → 教师复核** 的完整闭环。

## 技术栈

| 层级 | 技术 |
|---|---|
| 后端框架 | Spring Boot 3.4 + Java 21 + Maven |
| AI 引擎 | Spring AI + DeepSeek (`deepseek-chat`) |
| 数据库 | PostgreSQL 16 + pgvector 扩展 |
| 缓存/队列 | Redis 7 |
| 对象存储 | MinIO（后续扩展） |
| 前端框架 | React 18 + Vite + TypeScript |
| UI 组件 | Ant Design 5 |
| 状态管理 | Zustand |

## 快速开始

### 环境要求

- Java 21+
- Node.js 24+ & pnpm
- Maven 3.9+
- PostgreSQL 16（需启用 pgvector 扩展）
- Redis 7

### 1. 创建数据库

```bash
psql -h 10.237.255.9 -U nvc -d nvc_practice -c "CREATE DATABASE aigrader;"
psql -h 10.237.255.9 -U nvc -d aigrader -c "CREATE USER aigrader WITH PASSWORD 'aigrader123'; GRANT ALL ON DATABASE aigrader TO aigrader;"
```

### 2. 启动后端

```bash
cd backend

# 设置 DeepSeek API Key（必须）
set DEEPSEEK_API_KEY=sk-your-key-here

# 编译并启动（首次启动会自动建表）
mvn spring-boot:run
```

后端启动后访问：http://localhost:8080

### 3. 导入种子数据

```bash
psql -h 10.237.255.9 -U aigrader -d aigrader -f backend/src/main/resources/data.sql
```

种子数据包含：
- 6 个 Demo 用户（2 教师 + 3 学生 + 1 管理员）
- 2 个班级
- 10 道题目（选择/判断/填空/简答/作文）

### 4. 启动前端

```bash
cd frontend
pnpm install
pnpm dev
```

访问：http://localhost:5173

## Demo 账户

| 用户名 | 角色 | 昵称 |
|---|---|---|
| `teacher_zhang` | 教师 | 张老师（数学） |
| `teacher_li` | 教师 | 李老师（语文） |
| `student_xiao` | 学生 | 小明 |
| `student_hong` | 学生 | 小红 |
| `student_gang` | 学生 | 小刚 |
| `admin` | 管理员 | 管理员 |

## 项目结构

```
AIGrader/
├── AGENTS.md              # AI 协作规范
├── PRD.md                 # 产品需求文档
├── DEVELOPMENT_PLAN.md    # 开发计划
├── README.md              # 本文件
├── backend/               # Spring Boot 后端（42 个 Java 文件）
│   ├── pom.xml
│   └── src/main/java/com/aigrader/
│       ├── AIGraderApplication.java
│       ├── ai/             # AI 批改引擎（3 种策略）
│       ├── controller/     # REST 控制器（5 个）
│       ├── service/        # 业务服务（5 个）
│       ├── repository/     # JPA 接口（8 个）
│       ├── entity/         # 实体类（8 个）
│       ├── dto/            # DTO（5 个）
│       ├── config/         # 配置（2 个）
│       └── common/         # 枚举/工具（3 个）
├── frontend/              # React 前端（16 个 TSX 文件）
│   └── src/
│       ├── pages/          # 12 个页面组件
│       ├── components/     # 共享组件
│       ├── services/       # API 调用封装
│       ├── store/          # Zustand 状态
│       └── router/         # 路由配置
└── skills/                # Codex skills
```

## 环境变量

| 变量名 | 说明 | 默认值 |
|---|---|---|
| `DEEPSEEK_API_KEY` | DeepSeek API Key | （必填） |
| `DB_HOST` | 数据库主机 | `10.237.255.9` |
| `DB_PORT` | 数据库端口 | `5432` |
| `DB_NAME` | 数据库名 | `aigrader` |
| `DB_USER` | 数据库用户 | `aigrader` |
| `DB_PASSWORD` | 数据库密码 | `aigrader123` |
| `REDIS_HOST` | Redis 主机 | `10.237.255.9` |
| `REDIS_PORT` | Redis 端口 | `6379` |
| `SERVER_PORT` | 服务端口 | `8080` |
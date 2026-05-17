# AIGrader — AI 作业批改平台

基于 AI 的中小学作业批改平台，覆盖 **教师布置 → AI 秒级批改 → 学生即时订正 → 教师复核** 的完整闭环。

## 技术栈

| 层级 | 技术 |
|---|---|
| 后端框架 | Spring Boot 3.4 + Java 21 + Maven |
| AI 引擎 | Spring AI + DeepSeek (`deepseek-chat`) |
| 数据库 | PostgreSQL 16 + pgvector 扩展 |
| 缓存/队列 | Redis 7（DB 2） |
| 对象存储 | MinIO（后续扩展） |
| 前端框架 | React 18 + Vite + TypeScript |
| UI 组件 | Ant Design 5 |
| 状态管理 | Zustand |

## 环境信息速查

| 项目 | 值 |
|---|---|
| 前端地址 | http://localhost:5173 |
| 后端地址 | http://localhost:8080 |
| 数据库 | `ai_grader` @ 10.237.255.9:5432 |
| Redis | 10.237.255.9:6379 DB=2 |

## Demo 账户

| 用户名 | 角色 | 昵称 |
|---|---|---|
| `teacher_zhang` | 教师 | 张老师（数学） |
| `teacher_li` | 教师 | 李老师（语文） |
| `student_xiao` | 学生 | 小明 |
| `student_hong` | 学生 | 小红 |
| `student_gang` | 学生 | 小刚 |
| `admin` | 管理员 | 管理员 |

## 快速开始

### 环境要求
- Java 21+ / Node.js 24+ / pnpm / Maven 3.9+
- PostgreSQL 16（需启用 pgvector 扩展）
- Redis 7

### 启动后端

```bash
cd backend
set DEEPSEEK_API_KEY=sk-your-key
mvn spring-boot:run
```

### 启动前端

```bash
cd frontend
pnpm install
pnpm dev
```

### 导入种子数据

```bash
psql -h 10.237.255.9 -U ai_grader -d ai_grader -f backend/src/main/resources/data.sql
```

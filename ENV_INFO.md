# AIGrader — 环境速查

> 更新：2026-05-17

---

## 端口与地址

| 服务 | 地址 | 说明 |
|---|---|---|
| 前端（开发） | http://localhost:5173 | Vite 开发服务器 |
| 后端 API | http://localhost:8080 | Spring Boot REST API |
| PostgreSQL | 10.237.255.9:5432 | 数据库 |
| Redis | 10.237.255.9:6379 | 缓存/队列（DB=2） |
| DeepSeek API | https://api.deepseek.com | LLM |

## 数据库

| 项目 | 值 |
|---|---|
| 数据库名 | `ai_grader` |
| 用户名 | `ai_grader` |
| 密码 | `ai_grader123` |
| JDBC URL | `jdbc:postgresql://10.237.255.9:5432/ai_grader` |

```bash
# 创建数据库（在已有的 nvc_practice 服务器上）
psql -h 10.237.255.9 -U nvc -d nvc_practice -c "CREATE DATABASE ai_grader;"
psql -h 10.237.255.9 -U nvc -d ai_grader -c "CREATE USER ai_grader WITH PASSWORD 'ai_grader123';"
psql -h 10.237.255.9 -U nvc -d ai_grader -c "GRANT ALL ON DATABASE ai_grader TO ai_grader;"

# 导入种子数据
psql -h 10.237.255.9 -U ai_grader -d ai_grader -f backend/src/main/resources/data.sql
```

## Redis

| 项目 | 值 |
|---|---|
| 主机 | 10.237.255.9 |
| 端口 | 6379 |
| DB 编号 | **2**（避免与 NVC 等项目冲突） |
| 密码 | 无 |

## DeepSeek API

| 项目 | 值 |
|---|---|
| Base URL | https://api.deepseek.com |
| Model | deepseek-chat |
| 环境变量 | `DEEPSEEK_API_KEY` |

```bash
# Windows
set DEEPSEEK_API_KEY=sk-your-key-here

# Linux/Mac
export DEEPSEEK_API_KEY=sk-your-key-here
```

## Demo 账户

| 用户名 | 密码 | 角色 | 昵称 | 班级 |
|---|---|---|---|---|
| `teacher_zhang` | （无需） | 教师 | 张老师（数学） | — |
| `teacher_li` | （无需） | 教师 | 李老师（语文） | — |
| `student_xiao` | （无需） | 学生 | 小明 | 3-A 班 |
| `student_hong` | （无需） | 学生 | 小红 | 3-A 班 |
| `student_gang` | （无需） | 学生 | 小刚 | 3-A 班 |
| `admin` | （无需） | 管理员 | 管理员 | — |

> MVP 阶段无需密码，在登录页选择账户即可登录。

## 种子数据

| 数据 | 数量 |
|---|---|
| 用户 | 6 个（2 教师 + 3 学生 + 1 管理员） |
| 班级 | 2 个 |
| 题目 | 10 道（选择/判断/填空/简答/作文各类型） |

## 环境变量完整列表

| 变量名 | 默认值 | 说明 |
|---|---|---|
| `DEEPSEEK_API_KEY` | （空，必填） | DeepSeek API Key |
| `DB_HOST` | `10.237.255.9` | 数据库主机 |
| `DB_PORT` | `5432` | 数据库端口 |
| `DB_NAME` | `ai_grader` | 数据库名 |
| `DB_USER` | `ai_grader` | 数据库用户 |
| `DB_PASSWORD` | `ai_grader123` | 数据库密码 |
| `REDIS_HOST` | `10.237.255.9` | Redis 主机 |
| `REDIS_PORT` | `6379` | Redis 端口 |
| `SERVER_PORT` | `8080` | 后端端口 |

## 启动步骤

```bash
# 1. 设置 API Key
set DEEPSEEK_API_KEY=sk-xxx

# 2. 启动后端
cd backend
mvn spring-boot:run

# 3. 启动前端（新终端）
cd frontend
pnpm install
pnpm dev

# 4. 打开浏览器
# 前端：http://localhost:5173
# API 测试：http://localhost:8080/api/questions
```

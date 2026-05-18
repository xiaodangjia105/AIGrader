# AIGrader Agent 开发规范

> 所有 Agent 在开始开发前必须阅读本文档。

---

## 项目信息

- **项目名称：** AIGrader — AI 作业批改平台
- **后端：** Spring Boot 3.4.5 + Java 21 + Maven
- **前端：** React 18 + Vite + TypeScript + Ant Design 5
- **AI：** Spring AI 1.0.0-M6 + DeepSeek
- **数据库：** PostgreSQL 16 + Redis 7 (DB=2)
- **安全：** Spring Security + JWT（已实现）

## 环境变量

后端 `application.yml` 使用以下环境变量，本地运行时需设置：

| 变量名 | 默认值 |
|---|---|
| `DEEPSEEK_API_KEY` | （必填） |
| `DB_HOST` | `10.237.255.9` |
| `DB_PORT` | `5432` |
| `DB_NAME` | `ai_grader` |
| `DB_USER` | `ai_grader` |
| `DB_PASSWORD` | `ai_grader123` |
| `REDIS_HOST` | `10.237.255.9` |
| `REDIS_PORT` | `6379` |
| `SERVER_PORT` | `8080` |
| `JWT_SECRET` | `aigrader-default-secret-key-for-development-only` |

## 启动项目

```bash
# 后端（从 backend/ 目录）
cd backend
mvn spring-boot:run

# 前端（从 frontend/ 目录）
cd frontend
pnpm dev
```

## 代码架构

```
后端分层：
controller/ → REST 接口（@PreAuthorize 控制权限）
service/    → 业务逻辑
repository/ → JPA 数据访问
entity/     → 数据库实体（ddl-auto: update 自动建表/加列）
dto/        → 请求/响应对象
ai/         → AI 批改策略
config/     → Spring 配置
common/     → 工具/枚举

前端分层：
pages/      → 页面组件
components/ → 共享组件
services/   → API 调用（api.ts）
store/      → Zustand 状态
router/     → 路由配置
types/      → TypeScript 类型
```

## 开发规范

### 分支命名

```
codex/<feature-name>
```

示例：`codex/ai-prompt`, `codex/comment-report`

### 文件操作约束

- **禁止**批量删除文件或目录
- 删除文件时一次只删一个
- 不要 `git commit`，只汇报修改了哪些文件

### 代码规范

- 代码应自解释，不加注释（除非必要）
- 不加版权/license 声明
- 遵循现有代码风格
- 后端：Lombok + Builder 模式
- 前端：函数组件 + Hooks + TypeScript

### API 规范

- 所有 API 返回 `ApiResponse<T>` 格式：`{code, message, data, timestamp}`
- 需要权限的接口加 `@PreAuthorize("hasRole('XXX')")` 或 `hasAnyRole(...)`
- 获取当前用户 ID：`SecurityUtil.getCurrentUserId()`

### 前端 API 调用

```typescript
// 在 api.ts 中加方法，遵循现有模式
export const api = {
  // 新增 API...
  newMethod: (params) => request<ReturnType>('/path', options),
};
```

所有请求自动带 `Content-Type: application/json`，需要认证的请求带 `Authorization: Bearer <token>`（已在 api.ts 中处理）。

### 实体类修改

- 加字段后 JPA `ddl-auto: update` 会自动给数据库加列
- 字段用 `@Column` 指定列名和类型
- 已有字段不要改类型，只加新字段

### 路由和菜单

- 新页面路由在 `frontend/src/router/index.tsx` 中添加
- 侧边栏菜单在 `frontend/src/components/MainLayout.tsx` 中添加

---

## 测试验证

### 后端测试

```bash
cd backend

# 编译
mvn compile

# 启动
mvn spring-boot:run

# 测试 API（用 curl 或 Postman）
# 1. 先登录获取 token
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# 2. 用 token 调接口
curl http://localhost:8080/api/questions \
  -H "Authorization: Bearer <token>"
```

### 前端测试

```bash
cd frontend

# 类型检查
pnpm tsc --noEmit

# 构建
pnpm build

# 开发模式
pnpm dev
```

---

## 任务完成标准

每个 Agent 完成后需汇报：

1. 修改了哪些文件（完整路径列表）
2. 后端是否 `mvn compile` 通过
3. 前端是否 `pnpm tsc --noEmit` 通过
4. 哪些 API 需要手动测试
5. 是否新增了依赖（pom.xml / package.json）

---

## 当前项目状态

### 已完成
- ? JWT 认证（后端完整，前端未对接）
- ? 题库 CRUD
- ? 作业创建/管理
- ? 学生作答/提交
- ? AI 批改引擎（3 种策略）
- ? 教师复核
- ? 学生订正
- ? 基础统计

### 待开发
- ? 前端 JWT 登录对接
- ? AI Prompt 调优（多维度 + 分学科）
- ? 模型切换管理界面
- ? 个性化评语生成
- ? 学生薄弱知识点报告
- ? 批量导入题目
- ? AI 准确率趋势追踪

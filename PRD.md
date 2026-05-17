# AIGrader — 产品需求文档 (PRD)

> 版本：v1.0 | 更新：2026-05-17 | 作者：AIGrader 团队

---

## 一、产品概述

### 1.1 产品定位

**AIGrader** 是一款面向中小学教育场景的 AI 辅助作业批改平台。产品核心解决的问题是：教师批改负担过重（日均 100+ 份）、学生反馈滞后（1–2 天）、以及缺乏个性化学习指导。

平台打通 **教师布置 → AI 秒级批改 → 学生即时查看与订正 → 教师复核确认** 的完整闭环，在保证批改质量的前提下，大幅缩短反馈周期。

### 1.2 核心指标

| 指标 | 当前状态（模拟数据） | 目标值 |
|---|---|---|
| 单份作业平均批改耗时 | 20 分钟 | ≤ 5 分钟 |
| 学生有效互动率（查看解析/二次订正） | 15% | ≥ 40% |
| 客观题 AI 批改准确率 | 99% | 维持 ≥ 99% |
| 主观题综合误判率 | 15% | ≤ 10% |
| 教师对 AI 辅助批改接受度（主观题） | 35% | ≥ 60% |

### 1.3 背景数据

以下为模拟脱敏数据，用于指导产品设计决策：

**用户行为数据：**
- 一个典型班级 50 人，教师每晚需批改 3 个班级的作业（共约 150 份）
- 80% 的教师反馈"重复性基础批改（口算、填空）耗费了 70% 的批改时间"
- 学生对"对/错"结果的关注度为 100%，但对"为什么错"的解析点击率仅 15%

**批改效率与质量：**
- AI 对客观题（选择、判断）的批改准确率为 99%
- AI 对填空/简答/主观大题的综合误判率为 15%
- 当 AI 判错时，20% 的教师倾向于"全盘否定 AI 结果"

**教师使用习惯：**
- 教师日均批改时间集中在 20:00–23:00（占 65%）
- 约 40% 的教师仍习惯纸质批改后拍照上传
- 教师对 AI 辅助批改接受度：客观题 90%、主观题仅 35%

---

## 二、用户画像

### 2.1 教师

| 维度 | 描述 |
|---|---|
| **身份** | 中小学各科教师，30–50 岁为主 |
| **核心场景** | 每日 20:00–23:00 集中批改 3 个班级约 150 份作业 |
| **痛点** | 重复性基础批改耗时过长；缺乏个性化评语生成能力；AI 误判时信任崩塌 |
| **期望** | 客观题自动秒批、主观题 AI 辅助初判 + 人工复核、一键生成班级统计报告 |

### 2.2 学生

| 维度 | 描述 |
|---|---|
| **身份** | 中小学生，8–18 岁 |
| **核心场景** | 课后完成作业并提交，查看批改结果，订正错题 |
| **痛点** | 反馈滞后 1–2 天导致错题无法及时订正；只关注得分不关注错因解析 |
| **期望** | 提交即批改、秒级看到结果、获得易懂的错因解析、追踪自己的薄弱知识点 |

### 2.3 管理员

| 维度 | 描述 |
|---|---|
| **身份** | 学校教务/年级组长 |
| **核心场景** | 管理题库资源、查看全校批改质量数据、评估教师工作量 |
| **痛点** | 题库分散缺乏统一管理；无法量化 AI 批改质量 |
| **期望** | 题库统一 CRUD 管理、AI 准确率趋势监控、教师批改效率看板 |

---

## 三、功能需求

### 3.1 教师端

#### 3.1.1 作业管理（P0）

| 功能点 | 详细描述 |
|---|---|
| 创建作业 | 填写作业标题、选择班级、设置截止时间 |
| 选题组卷 | 从题库按学科/难度/题型筛选题目，支持多选批量添加 |
| 作业列表 | 展示我创建的作业，支持按状态（进行中/已截止）筛选 |
| 查看详情 | 查看作业的题目列表、已提交/未提交学生名单 |

**交互流程：**
1. 教师点击"新建作业" → 填写标题、选择班级、截止日期
2. 从题库勾选题目（支持按学科/题型/难度筛选）
3. 点击"创建" → 作业发布，学生端可见
4. 在作业列表可查看提交情况和批改进度

#### 3.1.2 批改复核（P0）

| 功能点 | 详细描述 |
|---|---|
| 查看 AI 批改结果 | 按学生查看每道题的 AI 评分、反馈、置信度 |
| 修正误判 | 教师可修改分数、补充评语，修正后自动标记为"已复核" |
| 一键确认 | 对于高置信度（≥90%）的批改结果，支持一键批量确认 |
| 低置信度提醒 | AI 置信度 < 70% 的结果标红高亮，提示教师重点关注 |

**交互流程：**
1. 教师进入批改复核页面 → 看到学生提交列表
2. 点击某个学生的提交 → 展开每道题的 AI 批改详情
3. AI 评分旁显示置信度百分比，低置信度标红
4. 教师可修改分数、添加评语 → 保存
5. 全部复核完成后标记为"已完成"

#### 3.1.3 班级统计（P1）

| 功能点 | 详细描述 |
|---|---|
| 完成率统计 | 班级作业提交人数/总人数，百分比展示 |
| 平均分 | 班级本次作业平均分 |
| 分数分布 | 各分数段人数分布（柱状图） |
| 高频错题 | 错误率最高的题目 Top 5 |

#### 3.1.4 个性化评语（P1）

- AI 根据学生答题情况自动生成个性化评语
- 教师可对 AI 生成的评语进行微调
- 评语包含鼓励性语言 + 具体改进建议

### 3.2 学生端

#### 3.2.1 作业作答（P0）

| 功能点 | 详细描述 |
|---|---|
| 查看作业列表 | 展示本班所有作业，标注截止时间和状态 |
| 在线答题 | 选择题（单选）、判断题（True/False）、填空题、简答题、作文题 |
| 提交作业 | 一次性提交所有题目答案 |

**交互流程：**
1. 学生登录 → 看到"我的作业"列表
2. 点击"开始作答" → 逐题展示题目内容和答题区域
3. 选择题：点击选项；判断题：选择 True/False；其他题：文本框输入
4. 点击"提交" → 系统自动触发 AI 批改
5. 跳转到批改结果页面

#### 3.2.2 批改结果（P0）

| 功能点 | 详细描述 |
|---|---|
| 即时反馈 | 提交后秒级展示 AI 批改结果 |
| 逐题展示 | 每道题显示：你的答案、AI 评分、AI 反馈、是否正确 |
| 总分 | 所有题目得分汇总 |
| 置信度提示 | 显示 AI 对每道题评分的置信度 |

#### 3.2.3 错题订正（P1）

| 功能点 | 详细描述 |
|---|---|
| 订正入口 | 批改结果页中，每道错题旁有"订正"按钮 |
| 二次作答 | 学生重新作答并提交 |
| 订正历史 | 记录该题的所有订正记录，可追溯 |

#### 3.2.4 学习报告（P2）

- 展示学生个人薄弱知识点分析
- 按学科展示正确率趋势

### 3.3 管理后台

#### 3.3.1 题库管理（P0）

| 功能点 | 详细描述 |
|---|---|
| 题目列表 | 分页表格展示所有题目，支持按学科/题型/难度筛选 |
| 新增题目 | 表单填写：题型、学科、难度、题干、答案、评分标准、选项（选择题） |
| 编辑题目 | 修改已有题目的信息 |
| 删除题目 | 单个删除（含二次确认） |

#### 3.3.2 用户管理（P1）

- 展示所有用户列表（教师/学生/管理员）
- 支持按角色筛选

#### 3.3.3 质量监控（P2）

- AI 批改准确率趋势统计
- 各题型误判率追踪
- 教师复核覆盖率统计

---

## 四、系统架构

```
┌────────────────── React SPA (Vite + TypeScript) ──────────────────┐
│                                                                    │
│   🧑‍🏫 教师端                             🧑‍🎓 学生端                    │
│   · 作业管理 / 批改复核                · 作业作答 / 查看结果         │
│   · 班级统计 / 个性化评语              · 错题订正 / 学习报告         │
│                                                                    │
│   ⚙️ 管理后台                                                    │
│   · 题库管理 / 用户管理 / 质量监控                                  │
│                                                                    │
└──────────────────────── REST API (JSON) ───────────────────────────┘
                                  │
┌────────────────── Spring Boot 3.4 (Java 21) ──────────────────────┐
│                                                                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │Controller│→│ Service  │→│  AI Engine   │  │   Repository  │  │
│  │ 参数校验  │  │ 业务逻辑  │  │ Spring AI    │  │ Spring Data   │  │
│  │ 路由分发  │  │ 事务管理  │  │ + DeepSeek   │  │ JPA + pgvector│  │
│  └──────────┘  └──────────┘  └──────────────┘  └───────────────┘  │
│                                                                    │
│  ┌──────────────┐  ┌──────────────────────────────────────────┐   │
│  │ Redis Cache  │  │ Redis Queue (异步批改任务)                 │   │
│  │ AI 结果缓存   │  │ 限流 / Session 管理                        │   │
│  └──────────────┘  └──────────────────────────────────────────┘   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
                                  │
┌────────────────── 基础设施 ───────────────────────────────────────┐
│                                                                    │
│  ┌─────────────────┐  ┌─────────────┐  ┌──────────────────────┐   │
│  │ PostgreSQL 16    │  │ Redis 7     │  │ DeepSeek API         │   │
│  │ + pgvector 扩展  │  │             │  │ (deepseek-chat)      │   │
│  └─────────────────┘  └─────────────┘  └──────────────────────┘   │
│                                                                    │
│  ┌─────────────────┐                                              │
│  │ MinIO            │  ← 作业图片/文件存储（后续扩展）               │
│  └─────────────────┘                                              │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### 4.1 技术选型说明

| 组件 | 选型 | 理由 |
|---|---|---|
| 后端框架 | Spring Boot 3.4 | 成熟稳定，生态丰富 |
| AI 框架 | Spring AI 1.0.0-M6 | 统一抽象多模型，原生集成 Spring |
| LLM | DeepSeek (`deepseek-chat`) | 中文能力强，性价比高，已有 API Key |
| 数据库 | PostgreSQL 16 | 支持 JSONB 和 pgvector 扩展 |
| 向量扩展 | pgvector | 零额外部署，与业务表一体查询 |
| 缓存 | Redis 7 | 复用已有基础设施 |
| 前端框架 | React 18 + TypeScript | 类型安全，生态丰富 |
| UI 组件库 | Ant Design 5 | 中文生态好，表格/表单组件强大 |
| 构建工具 | Vite 6 | 极速 HMR，开发体验好 |
| 包管理 | pnpm | 用户已安装，节省磁盘空间 |
| 状态管理 | Zustand | 轻量，适合中等复杂度项目 |

---

## 五、数据库设计

### 5.1 ER 图（文字描述）

```
 users ──┬── assignments ──┬── assignment_questions ── questions
         │                 │
         │                 └── submissions ── submission_answers ── corrections
         │
         └── class_groups
```

### 5.2 表结构

#### users（用户表）

| 字段 | 类型 | 说明 |
|---|---|---|
| id | BIGSERIAL PK | 主键 |
| username | VARCHAR(50) UNIQUE NOT NULL | 用户名 |
| nickname | VARCHAR(50) NOT NULL | 昵称/显示名 |
| role | VARCHAR(20) NOT NULL | TEACHER / STUDENT / ADMIN |
| class_id | BIGINT | 所属班级 ID（仅学生） |
| created_at | TIMESTAMP NOT NULL | 创建时间 |

#### class_groups（班级表）

| 字段 | 类型 | 说明 |
|---|---|---|
| id | BIGSERIAL PK | 主键 |
| name | VARCHAR(100) NOT NULL | 班级名称 |
| teacher_id | BIGINT NOT NULL | 班主任 ID |
| created_at | TIMESTAMP NOT NULL | 创建时间 |

#### questions（题库表）

| 字段 | 类型 | 说明 |
|---|---|---|
| id | BIGSERIAL PK | 主键 |
| type | VARCHAR(30) NOT NULL | 题型：CHOICE / TRUE_FALSE / FILL_BLANK / SHORT_ANSWER / ESSAY |
| subject | VARCHAR(50) NOT NULL | 学科：Math / Chinese / Science / English |
| difficulty | VARCHAR(20) NOT NULL | 难度：EASY / MEDIUM / HARD |
| content | TEXT NOT NULL | 题干内容 |
| answer | TEXT | 标准答案 |
| rubric | TEXT | 评分标准（主观题专用） |
| options | JSONB | 选项（选择题专用，如 {"A":"...","B":"..."}） |
| embedding | vector(1536) | 题目语义向量（pgvector，后续启用） |
| created_at | TIMESTAMP NOT NULL | 创建时间 |

#### assignments（作业表）

| 字段 | 类型 | 说明 |
|---|---|---|
| id | BIGSERIAL PK | 主键 |
| title | VARCHAR(200) NOT NULL | 作业标题 |
| teacher_id | BIGINT NOT NULL | 布置教师 ID |
| class_id | BIGINT NOT NULL | 目标班级 ID |
| due_date | TIMESTAMP NOT NULL | 截止日期 |
| status | VARCHAR(20) NOT NULL | ACTIVE / CLOSED |
| created_at | TIMESTAMP NOT NULL | 创建时间 |

#### assignment_questions（作业-题目关联表）

| 字段 | 类型 | 说明 |
|---|---|---|
| id | BIGSERIAL PK | 主键 |
| assignment_id | BIGINT NOT NULL | 作业 ID |
| question_id | BIGINT NOT NULL | 题目 ID |
| sort_order | INT NOT NULL | 题目排序 |
| score | DECIMAL(5,1) NOT NULL | 该题分值 |

#### submissions（提交表）

| 字段 | 类型 | 说明 |
|---|---|---|
| id | BIGSERIAL PK | 主键 |
| assignment_id | BIGINT NOT NULL | 作业 ID |
| student_id | BIGINT NOT NULL | 学生 ID |
| status | VARCHAR(20) NOT NULL | SUBMITTED / GRADED / REVIEWED |
| submitted_at | TIMESTAMP NOT NULL | 提交时间 |
| ai_graded_at | TIMESTAMP | AI 批改完成时间 |

#### submission_answers（作答明细表）

| 字段 | 类型 | 说明 |
|---|---|---|
| id | BIGSERIAL PK | 主键 |
| submission_id | BIGINT NOT NULL | 提交 ID |
| question_id | BIGINT NOT NULL | 题目 ID |
| student_answer | TEXT | 学生答案 |
| ai_score | DECIMAL(5,1) | AI 评分（0–10） |
| ai_feedback | TEXT | AI 反馈/评语 |
| ai_confidence | DECIMAL(5,2) | AI 置信度（0.00–1.00） |
| is_correct | BOOLEAN | AI 判断是否正确 |
| reviewed_by_teacher | BOOLEAN DEFAULT FALSE | 教师是否已复核 |
| final_score | DECIMAL(5,1) | 教师修正后的最终分数 |
| teacher_comment | TEXT | 教师评语 |

#### corrections（订正记录表）

| 字段 | 类型 | 说明 |
|---|---|---|
| id | BIGSERIAL PK | 主键 |
| submission_answer_id | BIGINT NOT NULL | 对应的作答明细 ID |
| new_answer | TEXT | 订正后的答案 |
| corrected_at | TIMESTAMP NOT NULL | 订正时间 |

### 5.3 索引设计

```sql
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_class_id ON users(class_id);
CREATE INDEX idx_assignments_teacher ON assignments(teacher_id);
CREATE INDEX idx_assignments_class ON assignments(class_id);
CREATE INDEX idx_submissions_assignment ON submissions(assignment_id);
CREATE INDEX idx_submissions_student ON submissions(student_id);
CREATE INDEX idx_submission_answers_submission ON submission_answers(submission_id);
CREATE UNIQUE INDEX idx_submissions_unique ON submissions(assignment_id, student_id);
```

---

## 六、AI 批改策略

### 6.1 分级策略

| 题型 | 批改方法 | 预估准确率 | 预估耗时 |
|---|---|---|---|
| **选择题** | 答案字符串精确匹配（忽略大小写和首尾空格） | 99.5% | < 10ms |
| **判断题** | 答案字符串精确匹配 | 99.5% | < 10ms |
| **填空题** | 精确匹配优先 → 不匹配时调用 LLM 语义判断 | 95% | < 500ms |
| **简答题** | LLM 语义对比 + 关键词命中检测 | 90% | < 2s |
| **主观题（作文/证明）** | LLM 多维度评分（内容/结构/语言）+ 个性化反馈 | 85% | < 5s |

### 6.2 Prompt 设计

**主观题批改 Prompt 模板：**

```
你是一位经验丰富的{subject}教师，正在批改学生的{subject}{question_type}作业。

题目：{content}
参考答案：{answer}
评分标准：{rubric}

学生答案：{student_answer}

请按以下 JSON 格式返回批改结果（不要包含 markdown 代码块标记）：
{
  "score": <0-10 的分数>,
  "feedback": "<2-3 句个性化反馈，包含鼓励和改进建议>",
  "isCorrect": <score>=6 则为 true，否则为 false>,
  "confidence": <你的置信度 0.0-1.0>
}
```

### 6.3 容错机制

| 机制 | 说明 |
|---|---|
| 置信度阈值 | ai_confidence < 0.70 的结果标红，提示教师重点复核 |
| 缓存去重 | 相同题目+相同答案的批改结果使用 Redis 缓存，key = hash(question_id + answer) |
| 超时降级 | LLM 调用超过 10 秒则降级为规则匹配 |
| 异步批改 | 学生提交后立即返回"批改中"状态，后台异步执行 AI 批改 |
| 教师修正反馈 | 教师修正评分后，记录修正数据用于后续 prompt 优化 |

### 6.4 批改流程时序

```
学生提交 → 创建 Submission → 返回 "SUBMITTED" 状态
    ↓ (异步)
获取所有 SubmissionAnswers → 逐题调用 GradingStrategy
    ↓
客观题：本地精确匹配（< 10ms）
主观题：调用 DeepSeek API（< 5s）
    ↓
保存 AI 评分/反馈/置信度 → 更新 Submission 状态为 "GRADED"
    ↓
学生刷新结果页 → 查看逐题批改详情
    ↓
教师复核 → 修正评分 → reviewed_by_teacher = true
```

---

## 七、API 设计

### 7.1 通用约定

- Base URL: `/api`
- 请求/响应格式: JSON
- 成功响应: `{"code": 200, "message": "success", "data": {...}, "timestamp": "..."}`
- 错误响应: `{"code": 4xx/5xx, "message": "错误描述", "data": null, "timestamp": "..."}`
- CORS: 已全局开启，允许前端跨域访问

### 7.2 接口列表

#### 题库管理

| 方法 | 路径 | 说明 |
|---|---|---|
| `GET` | `/api/questions` | 获取全部题目列表 |
| `GET` | `/api/questions/{id}` | 获取单个题目详情 |
| `POST` | `/api/questions` | 新增题目 |
| `PUT` | `/api/questions/{id}` | 修改题目 |
| `DELETE` | `/api/questions/{id}` | 删除题目 |

#### 作业管理

| 方法 | 路径 | 说明 |
|---|---|---|
| `GET` | `/api/assignments/{id}` | 获取作业详情 |
| `GET` | `/api/assignments/teacher/{teacherId}` | 教师作业列表 |
| `GET` | `/api/assignments/class/{classId}` | 班级作业列表 |
| `POST` | `/api/assignments` | 创建作业（含选题） |
| `GET` | `/api/assignments/{id}/questions` | 获取作业包含的题目 |

#### 提交与批改

| 方法 | 路径 | 说明 |
|---|---|---|
| `GET` | `/api/submissions/{id}` | 获取提交详情 |
| `GET` | `/api/submissions/assignment/{assignmentId}` | 按作业查看提交列表 |
| `GET` | `/api/submissions/student/{studentId}` | 按学生查看提交列表 |
| `POST` | `/api/submissions` | 学生提交作业 |
| `POST` | `/api/submissions/{id}/grade` | 触发 AI 批改 |
| `GET` | `/api/submissions/{id}/results` | 获取批改结果 |

#### 复核与订正

| 方法 | 路径 | 说明 |
|---|---|---|
| `GET` | `/api/grading/answers/{submissionId}` | 获取某次提交的所有答题明细 |
| `PUT` | `/api/grading/{answerId}/review` | 教师修正评分 |
| `POST` | `/api/corrections` | 学生提交订正 |
| `GET` | `/api/corrections/{answerId}` | 获取某题的订正记录 |

#### 统计与用户

| 方法 | 路径 | 说明 |
|---|---|---|
| `GET` | `/api/statistics/class/{classId}` | 班级统计 |
| `GET` | `/api/statistics/student/{studentId}` | 学生统计 |
| `GET` | `/api/users` | 用户列表 |
| `GET` | `/api/users/{id}` | 用户详情 |

---

## 八、前端设计

### 8.1 页面路由

| 路由 | 页面 | 所属端 |
|---|---|---|
| `/login` | 登录页（选择 Demo 用户） | 公共 |
| `/teacher/assignments` | 作业列表 | 教师端 |
| `/teacher/assignments/new` | 布置作业 | 教师端 |
| `/teacher/grading/:submissionId` | 批改复核 | 教师端 |
| `/teacher/statistics` | 班级统计 | 教师端 |
| `/student/assignments` | 我的作业 | 学生端 |
| `/student/assignments/:id/answer` | 作答页面 | 学生端 |
| `/student/results/:submissionId` | 批改结果 | 学生端 |
| `/student/correction/:answerId` | 错题订正 | 学生端 |
| `/admin/questions` | 题库管理 | 管理后台 |
| `/admin/users` | 用户管理 | 管理后台 |
| `/admin/monitor` | 质量监控 | 管理后台 |

### 8.2 组件树

```
App
├── LoginPage (公开)
├── MainLayout (带侧边栏布局)
│   ├── TeacherAssignments (作业列表 + 新建按钮)
│   ├── TeacherCreateAssignment (选题表单)
│   ├── TeacherGradingReview (提交列表 + AI 结果 + 复核弹窗)
│   ├── TeacherStatistics (统计卡片)
│   ├── StudentAssignments (作业卡片列表)
│   ├── StudentAnswer (逐题作答)
│   ├── StudentResults (得分汇总 + 逐题反馈)
│   ├── StudentCorrection (订正输入框)
│   ├── AdminQuestions (表格 + CRUD 弹窗)
│   ├── AdminUsers (用户表格)
│   └── AdminMonitor (系统统计卡片)
```

### 8.3 交互规范

- 所有表格数据均分页展示，默认每页 10 条
- 删除操作需要二次确认（Popconfirm）
- AI 评分置信度 < 70% 时显示橙色警告标签
- 批改状态用颜色标签区分：蓝色=提交、绿色=已批改、橙色=待复核
- 移动端暂不做适配（MVP 阶段）

---

## 九、非功能性需求

### 9.1 性能

| 指标 | 目标 |
|---|---|
| 客观题批改响应 | < 10ms（本地计算） |
| 主观题批改响应 | < 5s（含 LLM 网络延迟） |
| 页面首次加载 | < 2s |
| 并发批改支持 | 50 QPS |

### 9.2 安全

- MVP 阶段不做认证，使用 Demo 用户选择登录
- API Key 通过环境变量注入，不写入配置文件
- CORS 配置仅允许前端域访问
- 敏感配置文件已加入 `.gitignore`

### 9.3 可维护性

- 后端：标准 Spring Boot 分层架构（Controller → Service → Repository）
- 前端：函数组件 + TypeScript 严格模式
- 数据库：使用 JPA `ddl-auto: update` 自动建表（仅开发环境）
- 文档：PRD.md + DEVELOPMENT_PLAN.md + AGENTS.md 三文档锚点

---

## 十、风险与缓解

| 风险 | 影响 | 缓解措施 |
|---|---|---|
| DeepSeek API 不稳定 | 主观题批改失败 | Redis 缓存 + 超时降级为规则匹配 + 重试机制 |
| 主观题 AI 评分不准确 | 教师信任度降低 | 置信度机制 + 教师复核入口 + 持续优化 prompt |
| pgvector 启用后性能不足 | 向量检索慢 | 建立 IVFFlat 索引 + Redis 缓存热点向量 |
| 大批量批改时数据库压力 | 响应变慢 | Redis 结果缓存 + 异步批改队列削峰 |
| 前端大 chunk 加载慢 | 首屏慢 | 后续使用 dynamic import 代码分割 |

---

## 十一、版本规划

| 版本 | 内容 | 状态 |
|---|---|---|
| v1.0 MVP | 三端基础功能 + AI 批改引擎 + 种子数据 | ✅ 已完成 |
| v1.1 | 用户认证（Spring Security + JWT） | 🔜 计划中 |
| v1.2 | pgvector 语义检索 + 相似题推荐 | 🔜 计划中 |
| v2.0 | 图片上传（MinIO）+ 拍照批改 | 📋 远期 |

---

## 附录 A：Demo 用户

| 用户名 | 角色 | 昵称 |
|---|---|---|
| teacher_zhang | TEACHER | 张老师（数学） |
| teacher_li | TEACHER | 李老师（语文） |
| student_xiao | STUDENT | 小明 |
| student_hong | STUDENT | 小红 |
| student_gang | STUDENT | 小刚 |
| admin | ADMIN | 管理员 |

## 附录 B：环境变量

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
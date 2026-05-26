# 跨域改动检查清单

## 第一步：先判定你改的是哪类对象

| 对象类型 | 典型对象 | 改动时最容易漏什么 |
| --- | --- | --- |
| 主记录 | Assignment, Submission, Question, User | 创建、归属、关联表、历史查询 |
| 运行态 | Submission.status | 状态机流转、前端轮询 |
| DTO | AssignmentDTO, SubmissionDTO, ReviewDTO | 前后端一致性、解析器 |
| 关联表 | AssignmentQuestion | 创建时写入、查询时 JOIN |

## 第二步：再判断改动覆盖哪几层

- 接口层：controller、DTO、返回结构。
- 业务层：service、repository。
- AI 层：GradingStrategy、PromptTemplate。
- 前端层：页面组件、API 调用、类型定义。
- 鉴权层：角色权限、归属校验。

## 改动类型 -> 必看清单

| 改动类型 | 先看什么 | 一定要联动什么 |
| --- | --- | --- |
| 新增接口 | controller、DTO、权限注解 | service、归属校验、前端 API |
| 改实体字段 | Entity 类 | DTO、数据库迁移、前端类型、Repository 查询 |
| 改批改策略 | GradingStrategy 实现 | 题型枚举、PromptTemplate、前端展示 |
| 改权限 | SecurityConfig、@PreAuthorize | 前端路由守卫、菜单显示 |

## 一套推荐顺序

1. 先定位主域。
2. 再确认对象类型和真值源。
3. 先改实体/契约，再改实现。
4. 再改前端类型和 API。
5. 最后检查归属校验和权限。

## 每次都要问

- 改动会不会影响前端接口契约？
- 改动会不会影响数据库查询或关联？
- 改动会不会让一个非真值源对象被误当成真值源？

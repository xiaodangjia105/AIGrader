# 鉴权域对象词典

## 用户与身份

| 对象 | 含义 | 真值源 | 关键字段 | 能做归属判断 |
| --- | --- | --- | --- | --- |
| User | 用户持久化实体 | MySQL users 表 | id, username, password, nickname, role, classId | 可以 |
| SecurityContext | 当前请求的安全上下文 | Spring Security | Authentication, Principal | 可以 |
| LoginRequest | 登录入参 DTO | HTTP 请求体 | username, password | 不可以 |
| LoginResponse | 登录返回 DTO | HTTP 响应体 | token, userId, username, nickname, role, classId | 可以 |

## 角色定义

| 角色 | 枚举值 | 说明 |
| --- | --- | --- |
| TEACHER | UserRole.TEACHER | 教师，可创建作业、批改复核 |
| STUDENT | UserRole.STUDENT | 学生，可作答、订正 |
| ADMIN | UserRole.ADMIN | 管理员，可管理题库、用户、AI 配置 |

## 真相源判定规则

- 要判断"当前登录用户"，只看 SecurityUtil.getCurrentUserId() -> SecurityContext。
- 要判断"用户身份是否匹配"，比较 userId（不是 username）。
- LoginResponse 是一次性的登录返回，不存储会话状态。
- token 是无状态的 JWT，服务端不存储。

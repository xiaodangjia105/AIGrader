---
name: aigrader-auth
description: AIGrader 鉴权与用户上下文 Skill。用于处理登录态、JWT token、Spring Security 角色权限、SecurityUtil 当前用户获取和前端认证流程；当需求涉及 /api/auth/**、JwtUtil、SecurityConfig、JwtAuthenticationFilter 或 CustomUserDetailsService 时使用。
---

# aigrader-auth

## 使用顺序

- 先看 references/object-dictionary.md，确认用户实体和服务对象。
- 再看 references/login-flow.md，确认登录流程和 token 生成逻辑。
- 再看 references/role-permission.md，确认角色定义和权限校验规则。
- 涉及 Spring Security 配置时看 references/security-config.md。
- 涉及前端认证流程时看 references/frontend-auth.md。

## 关键入口

- backend/src/main/java/com/aigrader/controller/AuthController.java
- backend/src/main/java/com/aigrader/config/JwtUtil.java
- backend/src/main/java/com/aigrader/config/JwtAuthenticationFilter.java
- backend/src/main/java/com/aigrader/config/SecurityConfig.java
- backend/src/main/java/com/aigrader/service/CustomUserDetailsService.java
- backend/src/main/java/com/aigrader/common/SecurityUtil.java
- frontend/src/services/api.ts (认证头注入)
- frontend/src/pages/LoginPage.tsx
- frontend/src/store/ (认证状态管理)

## 必守约束

- JWT token 通过 Authorization: Bearer 头传递，不使用 Cookie。
- SecurityUtil.getCurrentUserId() 从 SecurityContext 获取，不从前端传参替代。
- 角色只有 TEACHER、STUDENT、ADMIN 三种，使用 @PreAuthorize 注解。
- 登录接口是公开的 (/api/auth/login)，其他接口默认需要认证。
- token 过期时间和密钥通过环境变量配置，不硬编码。

## 参考资料

- references/object-dictionary.md
- references/login-flow.md
- references/role-permission.md
- references/security-config.md
- references/frontend-auth.md

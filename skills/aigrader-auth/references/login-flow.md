# 登录流程

## 后端流程

1. POST /api/auth/login 接收 LoginRequest { username, password }
2. AuthenticationManager.authenticate() 调用 CustomUserDetailsService.loadUserByUsername()
3. 校验成功后，JwtUtil.generateToken(userId, username, role) 生成 JWT
4. 返回 LoginResponse { token, userId, username, nickname, role, classId }

## JWT 结构

- 签发者：JwtUtil 使用 HMAC-SHA256
- 包含 Claim：userId, username, role
- 过期时间：通过 JWT_EXPIRATION 环境变量配置（默认 24h）
- 密钥：通过 JWT_SECRET 环境变量配置

## 认证过滤器

- JwtAuthenticationFilter 继承 OncePerRequestFilter
- 从 Authorization 头提取 Bearer token
- 校验 token 有效性后设置 SecurityContext
- 放行 /api/auth/login

## 前端流程

- 登录成功后 token 存入 localStorage
- api.ts 中的 axios 拦截器自动附加 Authorization: Bearer {token}
- 401 响应时自动跳转登录页
- store 中维护当前用户状态

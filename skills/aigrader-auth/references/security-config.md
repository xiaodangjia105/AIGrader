# Spring Security 配置

## SecurityConfig 要点

- 禁用 CSRF（前后端分离使用 JWT）
- 配置 CORS 允许前端跨域访问
- SessionCreationPolicy.STATELESS（无状态）
- 放行 /api/auth/login

## JwtAuthenticationFilter

- 从 Authorization 头提取 Bearer token
- 解析 JWT 获取 userId, username, role
- 构建 UsernamePasswordAuthenticationToken 设置 SecurityContext
- 解析失败返回 401

## JwtUtil

- generateToken(userId, username, role)：生成 JWT
- validateToken(token)：校验 token 有效性
- getUserIdFromToken(token)：提取 userId
- 密钥和过期时间通过 @Value 注入

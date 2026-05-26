# 认证变更检查

改认证相关代码时：

- 是否影响 JWT 的 Claim 结构？
- 是否影响 SecurityUtil 的调用方？
- 是否影响前端的 token 存储和拦截器？
- 是否影响 @PreAuthorize 注解的权限表达式？
- 是否影响路由守卫的角色判断？

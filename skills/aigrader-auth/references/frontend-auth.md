# 前端认证流程

## api.ts 拦截器

- 请求拦截器：从 localStorage 读取 token，附加 Authorization: Bearer {token}
- 响应拦截器：401 时清除 token 并跳转登录页

## store 状态管理

- authStore 维护 currentUser, isLoggedIn, token
- 登录成功后更新 store
- 登出时清除 store 和 localStorage

## 路由守卫

- 未登录用户重定向到登录页
- 根据 role 限制页面访问（教师端/学生端/管理端）

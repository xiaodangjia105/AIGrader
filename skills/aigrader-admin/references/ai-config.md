# AI 配置管理

## 接口

- GET /api/admin/ai-config：获取当前配置（API Key 脱敏）
- PUT /api/admin/ai-config { apiKey, model, baseUrl }：更新配置

## 动态配置

- DynamicChatClientConfig 在配置变更时重新创建 ChatClient bean
- 支持运行时切换模型而不重启服务

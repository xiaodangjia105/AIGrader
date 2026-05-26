---
name: aigrader-admin
description: AIGrader 管理后台 Skill。用于处理 AI 配置管理、用户管理、质量监控看板和管理员专属功能；当需求涉及 /api/admin/**、AdminAiConfigController、AiConfigService 或管理员权限操作时使用。
---

# aigrader-admin

## 使用顺序

- 先看 references/object-dictionary.md，确认管理后台的配置实体。
- 再看 references/ai-config.md，确认 AI 配置的读写和安全规则。
- 再看 references/user-management.md，确认用户管理操作。

## 关键入口

- backend/src/main/java/com/aigrader/controller/AdminAiConfigController.java
- backend/src/main/java/com/aigrader/service/AiConfigService.java
- backend/src/main/java/com/aigrader/entity/AiConfig.java
- backend/src/main/java/com/aigrader/config/DynamicChatClientConfig.java
- frontend/src/pages/admin/AdminAIConfig.tsx
- frontend/src/pages/admin/AdminUsers.tsx
- frontend/src/pages/admin/AdminMonitor.tsx

## 必守约束

- 所有 /api/admin/** 接口需要 ADMIN 角色。
- AI 配置（API Key、模型、Base URL）通过数据库动态管理。
- API Key 在展示时需脱敏处理（仅显示前几位）。
- AiConfig 的 isActive 标记决定当前使用的配置。

## 参考资料

- references/object-dictionary.md
- references/ai-config.md
- references/user-management.md

# 管理后台对象词典

## 配置实体

| 对象 | 含义 | 真值源 | 关键字段 |
| --- | --- | --- | --- |
| AiConfig | AI 配置 | MySQL ai_config 表 | id, apiKey, model, baseUrl, isActive, createdAt |

## 重要约束

- apiKey 存储原文（生产环境建议加密）
- 展示时脱敏
- isActive = true 的记录唯一（更新时先取消旧的）

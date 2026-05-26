# 常见入口文件

## 先看这些入口

- backend/src/main/java/com/aigrader/controller/AuthController.java
- backend/src/main/java/com/aigrader/controller/QuestionController.java
- backend/src/main/java/com/aigrader/controller/AssignmentController.java
- backend/src/main/java/com/aigrader/controller/SubmissionController.java
- backend/src/main/java/com/aigrader/controller/GradingController.java
- backend/src/main/java/com/aigrader/controller/StatisticsController.java
- backend/src/main/java/com/aigrader/controller/AdminAiConfigController.java
- backend/src/main/java/com/aigrader/controller/ClassController.java
- backend/src/main/java/com/aigrader/config/SecurityConfig.java
- backend/src/main/java/com/aigrader/config/JwtUtil.java
- backend/src/main/java/com/aigrader/config/JwtAuthenticationFilter.java
- backend/src/main/java/com/aigrader/service/GradingService.java
- frontend/src/services/api.ts
- frontend/src/router/ (路由配置)

## 入口对应的事情

- 登录，优先看 AuthController 和 JwtUtil。
- 题库 CRUD，优先看 QuestionController 和 QuestionService。
- 作业创建/列表，优先看 AssignmentController 和 AssignmentService。
- 提交批改，优先看 SubmissionController 和 GradingService。
- 复核/订正，优先看 GradingController。
- 统计报告，优先看 StatisticsController 和 StatisticsService / ReportService。
- AI 配置，优先看 AdminAiConfigController 和 AiConfigService。

## 先后顺序

- 先找 controller，再找 service，再找 repository。
- 如果 controller 只是透传，继续下钻到真正持有业务约束的类。
- 如果入口触发了 AI 调用、异步任务或缓存回写，先看 GradingService 和对应的策略类。

---
name: aigrader-assignment
description: AIGrader 作业管理 Skill。用于处理作业创建、选题组卷、作业列表、班级关联和截止时间管理；当需求涉及 /api/assignments/**、AssignmentController、AssignmentService 或 Assignment 实体时使用。
---

# aigrader-assignment

## 使用顺序

- 先看 references/object-dictionary.md，确认作业实体和关联关系。
- 再看 references/create-flow.md，确认创建作业的完整流程。
- 再看 references/class-binding.md，确认班级关联和权限校验。

## 关键入口

- backend/src/main/java/com/aigrader/controller/AssignmentController.java
- backend/src/main/java/com/aigrader/service/AssignmentService.java
- backend/src/main/java/com/aigrader/entity/Assignment.java
- backend/src/main/java/com/aigrader/entity/AssignmentQuestion.java
- backend/src/main/java/com/aigrader/dto/AssignmentDTO.java
- backend/src/main/java/com/aigrader/controller/ClassController.java
- frontend/src/pages/teacher/TeacherAssignments.tsx
- frontend/src/pages/teacher/TeacherCreateAssignment.tsx
- frontend/src/pages/student/StudentAssignments.tsx

## 必守约束

- 创建作业需要：标题、班级 ID、问题 ID 列表、截止时间。
- Assignment 和 Question 之间通过 AssignmentQuestion 多对多关联。
- 教师只能查看自己创建的作业（/api/assignments/my）。
- 作业截止后学生不能提交新答案。
- 班级信息通过 ClassGroup 实体管理，班级 ID 是归属校验关键。

## 参考资料

- references/object-dictionary.md
- references/create-flow.md
- references/class-binding.md

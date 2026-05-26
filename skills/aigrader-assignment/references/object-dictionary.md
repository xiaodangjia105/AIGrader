# 作业域对象词典

## 核心实体

| 对象 | 含义 | 真值源 | 关键字段 |
| --- | --- | --- | --- |
| Assignment | 作业 | MySQL assignments 表 | id, title, teacherId, classId, deadline, status, createdAt |
| AssignmentQuestion | 作业-题目关联 | MySQL assignment_questions 表 | id, assignmentId, questionId, sortOrder |
| ClassGroup | 班级 | MySQL class_groups 表 | id, name |
| AssignmentDTO | 创建作业入参 | HTTP 请求体 | title, classId, questionIds, deadline |

## 状态枚举

| 状态 | 说明 |
| --- | --- |
| IN_PROGRESS | 进行中（未到截止时间） |
| CLOSED | 已截止 |

## 归属关系

- Assignment.teacherId -> User.id（创建者）
- Assignment.classId -> ClassGroup.id（班级）
- AssignmentQuestion 连接作业和题目

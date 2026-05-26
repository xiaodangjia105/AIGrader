# API 总览

## 认证相关

| 方法 | 路径 | 权限 | 所属域 |
| --- | --- | --- | --- |
| POST | /api/auth/login | 公开 | auth |

## 题库相关

| 方法 | 路径 | 权限 | 所属域 |
| --- | --- | --- | --- |
| GET | /api/questions | TEACHER/ADMIN/STUDENT | question-bank |
| GET | /api/questions/{id} | TEACHER/ADMIN/STUDENT | question-bank |
| POST | /api/questions | TEACHER/ADMIN | question-bank |
| PUT | /api/questions/{id} | TEACHER/ADMIN | question-bank |
| DELETE | /api/questions/{id} | ADMIN | question-bank |
| POST | /api/questions/batch-import | TEACHER/ADMIN | question-bank |
| POST | /api/questions/batch-import/csv | TEACHER/ADMIN | question-bank |

## 作业相关

| 方法 | 路径 | 权限 | 所属域 |
| --- | --- | --- | --- |
| GET | /api/assignments/{id} | TEACHER/ADMIN/STUDENT | assignment |
| GET | /api/assignments/my | TEACHER | assignment |
| GET | /api/assignments/class/{classId} | TEACHER/ADMIN/STUDENT | assignment |
| POST | /api/assignments | TEACHER/ADMIN | assignment |
| GET | /api/assignments/{id}/questions | TEACHER/ADMIN/STUDENT | assignment |

## 提交与批改相关

| 方法 | 路径 | 权限 | 所属域 |
| --- | --- | --- | --- |
| GET | /api/submissions/{id} | TEACHER/ADMIN/STUDENT | grading |
| GET | /api/submissions/assignment/{assignmentId} | TEACHER/ADMIN | grading |
| GET | /api/submissions/my | TEACHER/ADMIN/STUDENT | grading |
| POST | /api/submissions | TEACHER/ADMIN/STUDENT | grading |
| POST | /api/submissions/{id}/grade | TEACHER/ADMIN | grading |
| GET | /api/submissions/{id}/results | TEACHER/ADMIN/STUDENT | grading |
| PUT | /api/grading/{answerId}/review | TEACHER/ADMIN | grading |
| GET | /api/grading/answers/{submissionId} | TEACHER/ADMIN/STUDENT | grading |
| POST | /api/grading/{submissionId}/generate-comment | TEACHER/ADMIN | grading |
| GET | /api/grading/{submissionId}/comment | TEACHER/ADMIN/STUDENT | grading |
| POST | /api/corrections | STUDENT | grading |
| GET | /api/corrections/{answerId} | TEACHER/ADMIN/STUDENT | grading |

## 统计相关

| 方法 | 路径 | 权限 | 所属域 |
| --- | --- | --- | --- |
| GET | /api/statistics/class/{classId} | 公开 | statistics |
| GET | /api/statistics/student/{studentId} | 公开 | statistics |
| GET | /api/statistics/student/{studentId}/report | 公开 | statistics |
| GET | /api/statistics/ai-accuracy | 公开 | statistics |
| GET | /api/statistics/ai-accuracy/detail | 公开 | statistics |

## 管理后台相关

| 方法 | 路径 | 权限 | 所属域 |
| --- | --- | --- | --- |
| GET | /api/admin/ai-config | ADMIN | admin |
| PUT | /api/admin/ai-config | ADMIN | admin |
| GET | /api/users | 公开 | admin |
| GET | /api/users/{id} | 公开 | admin |

## 班级相关

| 方法 | 路径 | 权限 | 所属域 |
| --- | --- | --- | --- |
| GET | /api/classes | TEACHER/ADMIN | assignment |

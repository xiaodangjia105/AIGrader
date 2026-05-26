# 角色权限

## 角色映射

| 角色 | 枚举 | 权限范围 |
| --- | --- | --- |
| TEACHER | hasRole('TEACHER') | 创建作业、批改复核、查看统计、管理题库(部分) |
| STUDENT | hasRole('STUDENT') | 作答提交、查看结果、订正 |
| ADMIN | hasRole('ADMIN') | 全部权限（题目删除、用户管理、AI配置） |

## 鉴权模式

- 接口层使用 @PreAuthorize 注解
- hasAnyRole('TEACHER', 'ADMIN', 'STUDENT') 表示所有角色可访问
- hasRole('ADMIN') 表示仅管理员可访问
- 服务层通过 SecurityUtil.getCurrentUserId() 获取当前用户

## 归属校验

- 学生只能查看自己的提交和结果
- 教师只能查看自己班级的作业
- 管理员可查看全部数据

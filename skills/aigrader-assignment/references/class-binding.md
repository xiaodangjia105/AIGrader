# 班级关联

## ClassGroup

- 简单实体：id, name
- 通过 ClassController (/api/classes) 获取班级列表
- 学生通过 User.classId 关联到班级

## 归属校验

- 教师通过 /api/assignments/my 获取自己的作业（按 teacherId 过滤）
- 学生通过 /api/assignments/class/{classId} 获取班级作业
- 管理员可查看全部作业

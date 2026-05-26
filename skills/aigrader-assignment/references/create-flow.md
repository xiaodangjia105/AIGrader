# 创建作业流程

## 后端流程

1. POST /api/assignments 接收 AssignmentDTO { title, classId, questionIds, deadline }
2. teacherId 从 SecurityUtil.getCurrentUserId() 获取
3. 创建 Assignment 实体并保存
4. 遍历 questionIds，创建 AssignmentQuestion 关联记录
5. 返回完整 Assignment 对象

## 前端流程

1. 教师在 TeacherCreateAssignment 页面填写标题、选择班级、截止时间
2. 从题库筛选题目并多选添加
3. 提交创建请求
4. 成功后跳转到作业列表

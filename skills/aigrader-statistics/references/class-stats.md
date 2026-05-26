# 班级统计

## 接口

GET /api/statistics/class/{classId}

## 返回字段

- completionRate：完成率（百分比）
- averageScore：平均分
- totalStudents：班级总人数
- submittedCount：已提交人数
- scoreDistribution：分数段分布（0-59, 60-69, 70-79, 80-89, 90-100）

## 计算逻辑

- 从 Assignment 表获取该班级的所有作业
- 从 Submission 表获取提交记录
- 聚合计算统计指标

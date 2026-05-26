# AI 准确率监控

## 接口

- GET /api/statistics/ai-accuracy：总体准确率
- GET /api/statistics/ai-accuracy/detail：按题型/题目明细

## 计算方式

- 准确率 = 1 - |aiScore - finalScore| / maxScore
- 仅计算已复核的（finalScore 不为 null）题目
- 按题型分组统计各类型题目的准确率

## 趋势数据

- AiAccuracyTrendDTO 包含时间序列数据
- 用于管理后台的质量监控看板

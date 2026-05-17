import { useEffect, useState } from 'react';
import { Card, Statistic, Row, Col, Spin } from 'antd';
import { api } from '../../services/api';

export default function TeacherStatistics() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getClassStats(1)
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;
  if (!stats) return <p>暂无数据</p>;

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>班级统计 — {stats.className}</h2>
      <Row gutter={16}>
        <Col span={6}><Card><Statistic title="学生总数" value={stats.totalStudents} /></Card></Col>
        <Col span={6}><Card><Statistic title="作业总数" value={stats.totalAssignments} /></Card></Col>
        <Col span={6}><Card><Statistic title="提交数" value={stats.totalSubmissions} /></Card></Col>
        <Col span={6}><Card><Statistic title="平均分" value={stats.averageScore} precision={1} /></Card></Col>
      </Row>
      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={6}><Card><Statistic title="完成率" value={(stats.completionRate * 100).toFixed(1)} suffix="%" /></Card></Col>
      </Row>
    </div>
  );
}

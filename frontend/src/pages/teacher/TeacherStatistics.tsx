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
  if (!stats) return <p>No data</p>;

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>Class Statistics — {stats.className}</h2>
      <Row gutter={16}>
        <Col span={6}><Card><Statistic title="Total Students" value={stats.totalStudents} /></Card></Col>
        <Col span={6}><Card><Statistic title="Total Assignments" value={stats.totalAssignments} /></Card></Col>
        <Col span={6}><Card><Statistic title="Submissions" value={stats.totalSubmissions} /></Card></Col>
        <Col span={6}><Card><Statistic title="Avg Score" value={stats.averageScore} precision={1} /></Card></Col>
      </Row>
      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={6}><Card><Statistic title="Completion Rate" value={(stats.completionRate * 100).toFixed(1)} suffix="%" /></Card></Col>
      </Row>
    </div>
  );
}

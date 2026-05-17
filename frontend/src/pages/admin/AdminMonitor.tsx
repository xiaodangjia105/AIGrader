import { useEffect, useState } from 'react';
import { Card, Statistic, Row, Col, Spin } from 'antd';
import { api } from '../../services/api';

export default function AdminMonitor() {
  const [stats, setStats] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getClassStats(1),
      api.getQuestions(),
      api.getUsers(),
    ]).then(([s, q, u]) => {
      setStats(s);
      setQuestions(q);
      setUsers(u);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>System Monitor</h2>
      <Row gutter={16}>
        <Col span={6}><Card><Statistic title="Total Users" value={users.length} /></Card></Col>
        <Col span={6}><Card><Statistic title="Total Questions" value={questions.length} /></Card></Col>
        <Col span={6}><Card><Statistic title="Avg Score" value={stats?.averageScore || 0} precision={1} /></Card></Col>
        <Col span={6}><Card><Statistic title="Completion Rate" value={stats ? (stats.completionRate * 100).toFixed(1) : 0} suffix="%" /></Card></Col>
      </Row>
    </div>
  );
}

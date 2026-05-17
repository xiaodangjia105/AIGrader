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
      <h2 style={{ marginBottom: 16 }}>系统监控</h2>
      <Row gutter={16}>
        <Col span={6}><Card><Statistic title="用户总数" value={users.length} /></Card></Col>
        <Col span={6}><Card><Statistic title="题目总数" value={questions.length} /></Card></Col>
        <Col span={6}><Card><Statistic title="平均分" value={stats?.averageScore || 0} precision={1} /></Card></Col>
        <Col span={6}><Card><Statistic title="完成率" value={stats ? (stats.completionRate * 100).toFixed(1) : 0} suffix="%" /></Card></Col>
      </Row>
    </div>
  );
}

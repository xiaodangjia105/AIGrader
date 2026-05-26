import { useEffect, useState } from 'react';
import { Card, Descriptions, Spin } from 'antd';
import { useAuthStore } from '../../store/useAuthStore';
import { api } from '../../services/api';

export default function TeacherStatistics() {
  const user = useAuthStore((s) => s.user);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.classId) return;
    api.getClassStats(user.classId)
      .then(setStats)
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;
  if (!stats) return <p>暂无统计数据</p>;

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>班级统计</h2>
      <Card>
        <Descriptions column={2} size="small">
          <Descriptions.Item label="总提交数">{stats.totalSubmissions}</Descriptions.Item>
          <Descriptions.Item label="已批改数">{stats.gradedSubmissions}</Descriptions.Item>
          <Descriptions.Item label="平均分">{stats.averageScore?.toFixed(1)}</Descriptions.Item>
          <Descriptions.Item label="及格率">{((stats.passRate || 0) * 100).toFixed(1)}%</Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
}

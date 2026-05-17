import { useEffect, useState } from 'react';
import { Card, Button, Tag, List, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { api } from '../../services/api';
import type { Assignment } from '../../types';

export default function StudentAssignments() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.classId) return;
    api.getClassAssignments(user.classId)
      .then(setAssignments)
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>我的作业</h2>
      <List
        dataSource={assignments}
        locale={{ emptyText: '暂无作业' }}
        renderItem={(a) => (
          <Card style={{ marginBottom: 12 }} size="small">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>{a.title}</strong>
                <Tag style={{ marginLeft: 8 }} color={a.status === 'ACTIVE' ? 'blue' : 'green'}>{a.status === 'ACTIVE' ? '进行中' : '已截止'}</Tag>
                <span style={{ color: '#888', marginLeft: 12 }}>截止：{a.dueDate?.split('T')[0]}</span>
              </div>
              <Button type="primary" size="small" onClick={() => navigate(`/student/assignments/${a.id}/answer`)}>
                开始作答
              </Button>
            </div>
          </Card>
        )}
      />
    </div>
  );
}

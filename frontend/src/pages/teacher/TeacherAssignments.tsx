import { useEffect, useState } from 'react';
import { Table, Button, Tag, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { api } from '../../services/api';
import type { Assignment, Submission } from '../../types';

export default function TeacherAssignments() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await api.getTeacherAssignments(user.id);
      setAssignments(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [user]);

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={s === 'ACTIVE' ? 'blue' : 'green'}>{s}</Tag> },
    { title: 'Due Date', dataIndex: 'dueDate', key: 'dueDate', render: (d: string) => d?.split('T')[0] },
    {
      title: 'Actions', key: 'actions',
      render: (_: any, record: Assignment) => (
        <Space>
          <Button size="small" onClick={() => navigate(`/teacher/grading/${record.id}`)}>View Submissions</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>My Assignments</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/teacher/assignments/new')}>
          New Assignment
        </Button>
      </div>
      <Table dataSource={assignments} columns={columns} rowKey="id" loading={loading} />
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Table, Button, Tag, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { api } from '../../services/api';
import type { Assignment } from '../../types';

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
    { title: '编号', dataIndex: 'id', key: 'id', width: 60 },
    { title: '作业标题', dataIndex: 'title', key: 'title' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={s === 'ACTIVE' ? 'blue' : 'green'}>{s === 'ACTIVE' ? '进行中' : '已截止'}</Tag> },
    { title: '截止日期', dataIndex: 'dueDate', key: 'dueDate', render: (d: string) => d?.split('T')[0] },
    {
      title: '操作', key: 'actions',
      render: (_: any, record: Assignment) => (
        <Space>
          <Button size="small" onClick={() => navigate(`/teacher/grading/${record.id}`)}>查看提交</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>我的作业</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/teacher/assignments/new')}>
          新建作业
        </Button>
      </div>
      <Table dataSource={assignments} columns={columns} rowKey="id" loading={loading} locale={{ emptyText: '暂无作业' }} />
    </div>
  );
}

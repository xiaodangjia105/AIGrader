import { useEffect, useState } from 'react';
import { Table, Tag } from 'antd';
import { api } from '../../services/api';

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      setUsers(await api.getUsers());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: '用户名', dataIndex: 'username', key: 'username' },
    { title: '昵称', dataIndex: 'nickname', key: 'nickname' },
    { title: '角色', dataIndex: 'role', key: 'role', render: (r: string) => <Tag color={r === 'ADMIN' ? 'red' : r === 'TEACHER' ? 'blue' : 'green'}>{r === 'ADMIN' ? '管理员' : r === 'TEACHER' ? '教师' : '学生'}</Tag> },
    { title: '班级ID', dataIndex: 'classId', key: 'classId' },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>用户管理</h2>
      <Table dataSource={users} columns={columns} rowKey="id" loading={loading} locale={{ emptyText: '暂无用户' }} />
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Table, Tag } from 'antd';
import { api } from '../../services/api';
import type { User } from '../../types';

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getUsers().then(setUsers).finally(() => setLoading(false));
  }, []);

  const roleNames: Record<string, string> = { TEACHER: '教师', STUDENT: '学生', ADMIN: '管理员' };

  const columns = [
    { title: '编号', dataIndex: 'id', key: 'id', width: 60 },
    { title: '用户名', dataIndex: 'username', key: 'username' },
    { title: '昵称', dataIndex: 'nickname', key: 'nickname' },
    { title: '角色', dataIndex: 'role', key: 'role', render: (r: string) => <Tag>{roleNames[r] || r}</Tag> },
    { title: '班级', dataIndex: 'classId', key: 'classId' },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>用户管理</h2>
      <Table dataSource={users} columns={columns} rowKey="id" loading={loading} locale={{ emptyText: '暂无用户' }} />
    </div>
  );
}

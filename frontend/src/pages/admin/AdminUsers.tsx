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

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: 'Username', dataIndex: 'username', key: 'username' },
    { title: 'Nickname', dataIndex: 'nickname', key: 'nickname' },
    { title: 'Role', dataIndex: 'role', key: 'role', render: (r: string) => <Tag>{r}</Tag> },
    { title: 'Class', dataIndex: 'classId', key: 'classId' },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>User Management</h2>
      <Table dataSource={users} columns={columns} rowKey="id" loading={loading} />
    </div>
  );
}

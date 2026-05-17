import { useState } from 'react';
import { Card, Button, Select, Space, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { UserRole } from '../types';

const { Title } = Typography;

const DEMO_USERS = [
  { id: 1, username: 'teacher_zhang', nickname: 'Zhang (Math Teacher)', role: UserRole.TEACHER, classId: null },
  { id: 2, username: 'teacher_li', nickname: 'Li (Chinese Teacher)', role: UserRole.TEACHER, classId: null },
  { id: 3, username: 'student_xiao', nickname: 'Xiao Ming', role: UserRole.STUDENT, classId: 1 },
  { id: 4, username: 'student_hong', nickname: 'Xiao Hong', role: UserRole.STUDENT, classId: 1 },
  { id: 5, username: 'student_gang', nickname: 'Xiao Gang', role: UserRole.STUDENT, classId: 1 },
  { id: 6, username: 'admin', nickname: 'Admin', role: UserRole.ADMIN, classId: null },
];

const ROLE_PATH: Record<string, string> = {
  TEACHER: '/teacher',
  STUDENT: '/student',
  ADMIN: '/admin',
};

export default function LoginPage() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();

  const handleLogin = () => {
    const user = DEMO_USERS.find((u) => u.id === selectedId);
    if (user) {
      setUser(user);
      navigate(ROLE_PATH[user.role]);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5' }}>
      <Card style={{ width: 420, textAlign: 'center' }}>
        <Title level={2}>AIGrader</Title>
        <p style={{ color: '#888', marginBottom: 24 }}>AI Homework Grading Platform</p>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Select
            placeholder="Select a demo account"
            style={{ width: '100%' }}
            value={selectedId}
            onChange={setSelectedId}
            options={DEMO_USERS.map((u) => ({
              value: u.id,
              label: `${u.nickname} (${u.role})`,
            }))}
          />
          <Button type="primary" size="large" block onClick={handleLogin} disabled={!selectedId}>
            Login
          </Button>
        </Space>
      </Card>
    </div>
  );
}

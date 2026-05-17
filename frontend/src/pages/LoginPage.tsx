import { useState } from 'react';
import { Card, Button, Select, Space, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { UserRole } from '../types';

const { Title } = Typography;

const DEMO_USERS = [
  { id: 1, username: 'teacher_zhang', nickname: '张老师（数学）', role: UserRole.TEACHER, classId: null },
  { id: 2, username: 'teacher_li', nickname: '李老师（语文）', role: UserRole.TEACHER, classId: null },
  { id: 3, username: 'student_xiao', nickname: '小明', role: UserRole.STUDENT, classId: 1 },
  { id: 4, username: 'student_hong', nickname: '小红', role: UserRole.STUDENT, classId: 1 },
  { id: 5, username: 'student_gang', nickname: '小刚', role: UserRole.STUDENT, classId: 1 },
  { id: 6, username: 'admin', nickname: '管理员', role: UserRole.ADMIN, classId: null },
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

  const roleLabel = (r: string) => r === 'TEACHER' ? '教师' : r === 'STUDENT' ? '学生' : '管理员';

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5' }}>
      <Card style={{ width: 420, textAlign: 'center' }}>
        <Title level={2}>AI 作业批改</Title>
        <p style={{ color: '#888', marginBottom: 24 }}>AI 驱动的中小学作业批改平台</p>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Select
            placeholder="选择 Demo 账户"
            style={{ width: '100%' }}
            value={selectedId}
            onChange={setSelectedId}
            options={DEMO_USERS.map((u) => ({
              value: u.id,
              label: `${u.nickname}（${roleLabel(u.role)}）`,
            }))}
          />
          <Button type="primary" size="large" block onClick={handleLogin} disabled={!selectedId}>
            登录
          </Button>
        </Space>
      </Card>
    </div>
  );
}

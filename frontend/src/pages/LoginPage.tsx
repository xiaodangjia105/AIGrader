import { useState } from 'react';
import { Card, Button, Input, Space, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { api } from '../services/api';
import type { UserRole } from '../types';

const { Title } = Typography;

const ROLE_PATH: Record<string, string> = {
  TEACHER: '/teacher',
  STUDENT: '/student',
  ADMIN: '/admin',
};

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) return;
    setLoading(true);
    try {
      const res = await api.login(username.trim(), password);
      setAuth(
        { id: res.userId, username: res.username, nickname: res.nickname, role: res.role as UserRole },
        res.token,
      );
      message.success('登录成功');
      navigate(ROLE_PATH[res.role] || '/');
    } catch (e: any) {
      message.error(e.message || '登录失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5' }}>
      <Card style={{ width: 420, textAlign: 'center' }}>
        <Title level={2}>AI 作业批改</Title>
        <p style={{ color: '#888', marginBottom: 24 }}>AI 驱动的中小学作业批改平台</p>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Input
            prefix={<UserOutlined />}
            placeholder="用户名"
            size="large"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onPressEnter={handleLogin}
          />
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="密码"
            size="large"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onPressEnter={handleLogin}
          />
          <Button
            type="primary"
            size="large"
            block
            onClick={handleLogin}
            loading={loading}
            disabled={!username.trim() || !password.trim()}
          >
            登录
          </Button>
        </Space>
      </Card>
    </div>
  );
}
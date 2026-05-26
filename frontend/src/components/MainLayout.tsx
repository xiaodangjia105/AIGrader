import { Layout, Menu, Button } from 'antd';
import {
  FileTextOutlined, BarChartOutlined, CheckCircleOutlined,
  FormOutlined, EditOutlined, UserOutlined, SettingOutlined,
  MonitorOutlined, LogoutOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const { Header, Sider, Content } = Layout;

const teacherMenu = [
  { key: '/teacher/assignments', icon: <FileTextOutlined />, label: '作业管理' },
  { key: '/teacher/questions', icon: <EditOutlined />, label: '题库管理' },
  { key: '/teacher/statistics', icon: <BarChartOutlined />, label: '班级统计' },
];

const studentMenu = [
  { key: '/student/assignments', icon: <FormOutlined />, label: '我的作业' },
  { key: '/student/report', icon: <BarChartOutlined />, label: '学习报告' },
];

const adminMenu = [
  { key: '/admin/questions', icon: <EditOutlined />, label: '题库管理' },
  { key: '/admin/users', icon: <UserOutlined />, label: '用户管理' },
  { key: '/admin/monitor', icon: <MonitorOutlined />, label: '质量监控' },
  { key: '/admin/ai-config', icon: <SettingOutlined />, label: 'AI配置' },
];

export default function MainLayout({ role }: { role: string }) {
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useAuthStore((s) => s.logout);

  const menuMap: Record<string, typeof teacherMenu> = {
    TEACHER: teacherMenu,
    STUDENT: studentMenu,
    ADMIN: adminMenu,
  };

  const menuItems = menuMap[role] || [];
  const selectedKey = '/' + location.pathname.split('/').slice(0, 3).join('/');

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={220} theme="dark">
        <div style={{ color: '#fff', padding: '20px 16px', fontSize: 18, fontWeight: 700 }}>
          AI 作业批改
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: '0 24px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <Button icon={<LogoutOutlined />} onClick={() => { logout(); navigate('/login'); }}>
            退出登录
          </Button>
        </Header>
        <Content style={{ margin: 16, padding: 24, background: '#fff', borderRadius: 8 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

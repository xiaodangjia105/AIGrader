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
  { key: '/teacher/assignments', icon: <FileTextOutlined />, label: 'Assignments' },
  { key: '/teacher/statistics', icon: <BarChartOutlined />, label: 'Statistics' },
];

const studentMenu = [
  { key: '/student/assignments', icon: <FormOutlined />, label: 'My Assignments' },
];

const adminMenu = [
  { key: '/admin/questions', icon: <EditOutlined />, label: 'Question Bank' },
  { key: '/admin/users', icon: <UserOutlined />, label: 'Users' },
  { key: '/admin/monitor', icon: <MonitorOutlined />, label: 'Monitor' },
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
          AIGrader
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
            Logout
          </Button>
        </Header>
        <Content style={{ margin: 16, padding: 24, background: '#fff', borderRadius: 8 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

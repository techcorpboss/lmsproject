import React, { useState, useEffect } from 'react';
import {
  Layout, Menu, Typography, Space, Button, Dropdown, Avatar, Tag, Card, Divider, message
} from 'antd';
import {
  BookOutlined, EditOutlined, DatabaseOutlined, ThunderboltOutlined,
  VideoCameraOutlined, UserOutlined, GlobalOutlined, LogoutOutlined,
  DashboardOutlined, TeamOutlined, SafetyCertificateOutlined, SwapOutlined
} from '@ant-design/icons';
import LoginPage from './components/LoginPage';
import StudentWorkspace from './components/StudentWorkspace';
import TeacherWorkspace from './components/TeacherWorkspace';
import AdminWorkspace from './components/AdminWorkspace';
import './App.css';

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  // Khôi phục phiên đăng nhập hoặc nhận SSO từ URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ssoToken = params.get('sso_token');
    const roleParam = params.get('role');

    if (ssoToken) {
      localStorage.setItem('lms_token', ssoToken);
      const ssoUser = {
        id: 3,
        username: 'sso_student',
        full_name: 'Học viên ĐH (SSO TCU COMPASS)',
        role: roleParam || 'student'
      };
      setCurrentUser(ssoUser);
      localStorage.setItem('lms_user', JSON.stringify(ssoUser));
      message.success('Đăng nhập thành công qua liên thông TCU COMPASS ERP (SSO)!');
    } else {
      const savedUser = localStorage.getItem('lms_user');
      if (savedUser) {
        try {
          setCurrentUser(JSON.parse(savedUser));
        } catch (e) {
          localStorage.removeItem('lms_user');
        }
      }
    }
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    localStorage.setItem('lms_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    localStorage.removeItem('lms_token');
    localStorage.removeItem('lms_user');
    setCurrentUser(null);
    message.info('Đã đăng xuất khỏi hệ thống.');
  };

  const handleChangeRole = (role) => {
    let updated = null;
    if (role === 'student') {
      updated = { id: 3, username: 'student', full_name: 'Trần Văn Nam (Sinh viên K66)', role: 'student' };
    } else if (role === 'teacher') {
      updated = { id: 2, username: 'teacher', full_name: 'TS. Nguyễn Văn An (Giảng viên)', role: 'teacher' };
    } else {
      updated = { id: 1, username: 'admin', full_name: 'Quản trị viên Hệ thống (Admin)', role: 'admin' };
    }
    setCurrentUser(updated);
    localStorage.setItem('lms_user', JSON.stringify(updated));
    message.success(`Đã chuyển sang không gian làm việc: ${updated.full_name}`);
  };

  // NẾU CHƯA ĐĂNG NHẬP -> HIỂN THỊ CỔNG ĐĂNG NHẬP CHUẨN QUỐC TẾ
  if (!currentUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // MENU TÙY CHỌN PROFILE & ĐỔI VAI TRÒ
  const userMenu = {
    items: [
      {
        key: 'header_role',
        label: (
          <div style={{ padding: '4px 0' }}>
            <Text type="secondary" style={{ fontSize: 11, display: 'block' }}>VAI TRÒ HIỆN TẠI</Text>
            <b>{currentUser.role === 'student' ? 'Học viên / Sinh viên' : currentUser.role === 'teacher' ? 'Cán bộ Giảng viên' : 'Quản trị viên (Super Admin)'}</b>
          </div>
        ),
        disabled: true
      },
      { type: 'divider' },
      {
        key: 'switch_student',
        icon: <SwapOutlined />,
        label: 'Chuyển sang: Sinh viên (Student)',
        onClick: () => handleChangeRole('student')
      },
      {
        key: 'switch_teacher',
        icon: <SwapOutlined />,
        label: 'Chuyển sang: Giảng viên (Teacher)',
        onClick: () => handleChangeRole('teacher')
      },
      {
        key: 'switch_admin',
        icon: <SwapOutlined />,
        label: 'Chuyển sang: Quản trị viên (Admin)',
        onClick: () => handleChangeRole('admin')
      },
      { type: 'divider' },
      {
        key: 'logout',
        icon: <LogoutOutlined style={{ color: '#ff4d4f' }} />,
        label: <span style={{ color: '#ff4d4f' }}>Đăng xuất</span>,
        onClick: handleLogout
      }
    ]
  };

  const getRoleTag = (role) => {
    if (role === 'student') return <Tag color="blue" style={{ borderRadius: 12 }}>🎓 SINH VIÊN</Tag>;
    if (role === 'teacher') return <Tag color="green" style={{ borderRadius: 12 }}>👨‍🏫 GIẢNG VIÊN</Tag>;
    return <Tag color="gold" style={{ borderRadius: 12 }}>⚡ QUẢN TRỊ VIÊN</Tag>;
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f7fa' }}>
      {/* HEADER HIỆN ĐẠI CHUẨN QUỐC TẾ */}
      {/* HEADER HIỆN ĐẠI CHUẨN QUỐC TẾ */}
      <Header
        style={{
          background: '#07162c',
          padding: '0 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          height: 'auto',
          minHeight: 74,
          lineHeight: 'normal',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '8px 0' }}>
          {/* Logo TechCorp chủ đạo cho toàn ứng dụng */}
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 12,
              background: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 4,
              boxShadow: '0 3px 12px rgba(0,0,0,0.25)',
              overflow: 'hidden',
              flexShrink: 0
            }}
          >
            <img
              src="/logo-techcorp.png"
              alt="TechCorp Logo"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span
                style={{
                  color: '#ffffff',
                  fontSize: 18,
                  fontWeight: 800,
                  letterSpacing: '0.5px',
                  lineHeight: 1.3
                }}
              >
                TECHCORP LMS & E-TESTING
              </span>
              <span
                style={{
                  background: 'linear-gradient(135deg, #fa8c16 0%, #d46b08 100%)',
                  color: '#ffffff',
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 10,
                  textTransform: 'uppercase',
                  letterSpacing: '0.4px',
                  boxShadow: '0 2px 6px rgba(250, 140, 22, 0.35)'
                }}
              >
                PRO EDITION
              </span>
            </div>
            <div style={{ color: '#94a3b8', fontSize: 12, marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
              <GlobalOutlined style={{ color: '#38bdf8' }} />
              <span style={{ color: '#bae0ff', fontWeight: 500 }}>lms.techcorp.info.vn</span>
              <span style={{ color: '#475569' }}>•</span>
              <span>Chuẩn Bộ GD&ĐT (TT 08/2021) & Quốc Tế (ISO 21001 / AUN-QA)</span>
            </div>
          </div>
        </div>

        <Space size="middle" align="middle">
          {getRoleTag(currentUser.role)}

          <Dropdown menu={userMenu} placement="bottomRight" arrow>
            <Button
              type="text"
              style={{
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                background: 'rgba(255,255,255,0.08)',
                borderRadius: 24,
                padding: '6px 16px',
                height: 42,
                border: '1px solid rgba(255,255,255,0.12)'
              }}
            >
              <Avatar
                size={30}
                style={{
                  backgroundColor: currentUser.role === 'admin' ? '#faad14' : currentUser.role === 'teacher' ? '#52c41a' : '#1677ff',
                  fontWeight: 700
                }}
                icon={<UserOutlined />}
              />
              <span style={{ fontWeight: 600, fontSize: 13 }}>{currentUser.full_name}</span>
            </Button>
          </Dropdown>
        </Space>
      </Header>

      {/* CONTENT: KHÔNG GIAN LÀM VIỆC THEO TỪNG VAI TRÒ */}
      <Content style={{ padding: '24px 32px' }}>
        {currentUser.role === 'student' && <StudentWorkspace currentUser={currentUser} />}
        {currentUser.role === 'teacher' && <TeacherWorkspace currentUser={currentUser} />}
        {currentUser.role === 'admin' && <AdminWorkspace currentUser={currentUser} />}
      </Content>

      {/* FOOTER */}
      <Footer style={{ textAlign: 'center', color: '#64748b', fontSize: 13, padding: '24px 0', background: '#f1f5f9', borderTop: '1px solid #e2e8f0' }}>
        <Space direction="vertical" size={4}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <img src="/logo-techcorp.png" alt="TechCorp Logo" style={{ height: 24, objectFit: 'contain' }} />
            <Text strong style={{ color: '#1e293b' }}>TechCorp Technology & Higher Education Platform</Text>
          </div>
          <div>© 2026 TechCorp. Nền tảng Đào tạo E-Learning & Khảo thí Trực tuyến chuẩn Quốc tế (ISO 21001 / AUN-QA).</div>
        </Space>
      </Footer>
    </Layout>
  );
}

export default App;
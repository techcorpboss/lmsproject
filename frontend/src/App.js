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
      <Header
        style={{
          background: '#001529',
          padding: '0 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          boxShadow: '0 2px 10px rgba(0,0,0,0.15)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #1677ff 0%, #0958d9 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 800,
              fontSize: 18,
              boxShadow: '0 2px 6px rgba(22,119,255,0.4)'
            }}
          >
            T
          </div>
          <div>
            <Text strong style={{ color: '#fff', fontSize: 16, display: 'block', lineHeight: 1.2 }}>
              TECHCORP LMS & E-TESTING
            </Text>
            <Text style={{ color: '#8c8c8c', fontSize: 11 }}>
              <GlobalOutlined /> lms.techcorp.info.vn • Chuẩn ISO 21001 & AUN-QA 4.0
            </Text>
          </div>
        </div>

        <Space size="middle">
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
                borderRadius: 20,
                padding: '4px 14px',
                height: 38
              }}
            >
              <Avatar
                style={{
                  backgroundColor: currentUser.role === 'admin' ? '#faad14' : currentUser.role === 'teacher' ? '#52c41a' : '#1677ff'
                }}
                icon={<UserOutlined />}
              />
              <span style={{ fontWeight: 500 }}>{currentUser.full_name}</span>
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
      <Footer style={{ textAlign: 'center', color: '#8c8c8c', fontSize: 13, padding: '20px 0' }}>
        © 2026 TechCorp Higher Education Platform. Nền tảng Đào tạo E-Learning & Khảo thí Trực tuyến chuẩn Quốc tế.
      </Footer>
    </Layout>
  );
}

export default App;
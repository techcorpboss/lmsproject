import React, { useState, useEffect } from 'react';
import {
  Layout, Menu, Typography, Space, Button, Dropdown, Avatar, Tag, Card, Divider
} from 'antd';
import {
  BookOutlined, EditOutlined, DatabaseOutlined, ThunderboltOutlined,
  VideoCameraOutlined, UserOutlined, GlobalOutlined, LogoutOutlined
} from '@ant-design/icons';
import ElearningCatalog from './components/ElearningCatalog';
import OnlineExamRoom from './components/OnlineExamRoom';
import QuestionBankView from './components/QuestionBankView';
import ExamGeneratorView from './components/ExamGeneratorView';
import LiveProctoringView from './components/LiveProctoringView';
import './App.css';

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

function App() {
  const [activeTab, setActiveTab] = useState('elearning');
  const [currentUser, setCurrentUser] = useState({
    id: 1,
    username: 'admin',
    full_name: 'Quản trị viên Hệ thống (TechCorp)',
    role: 'admin'
  });

  // Kiểm tra SSO Token nếu người dùng chuyển từ ERP sang qua query param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ssoToken = params.get('sso_token');
    if (ssoToken) {
      localStorage.setItem('lms_token', ssoToken);
      console.log('Detected SSO Token from ERP!');
    }
  }, []);

  const menuItems = [
    { key: 'elearning', icon: <BookOutlined />, label: 'Khóa Học E-Learning' },
    { key: 'exam', icon: <EditOutlined />, label: 'Phòng Thi Trực Tuyến' },
    { key: 'qbank', icon: <DatabaseOutlined />, label: 'Ngân Hàng Câu Hỏi' },
    { key: 'generator', icon: <ThunderboltOutlined />, label: 'Động Cơ Sinh Đề (Bloom)' },
    { key: 'proctoring', icon: <VideoCameraOutlined />, label: 'Giám Thị AI (Live)' },
  ];

  const userRoleMenu = {
    items: [
      {
        key: 'admin',
        label: 'Đổi vai trò: Quản trị viên (Admin)',
        onClick: () => setCurrentUser({ id: 1, username: 'admin', full_name: 'Quản trị viên Hệ thống', role: 'admin' })
      },
      {
        key: 'teacher',
        label: 'Đổi vai trò: Giảng viên (Teacher)',
        onClick: () => setCurrentUser({ id: 2, username: 'teacher', full_name: 'TS. Nguyễn Văn A (Giảng viên)', role: 'teacher' })
      },
      {
        key: 'student',
        label: 'Đổi vai trò: Sinh viên (Student)',
        onClick: () => setCurrentUser({ id: 3, username: 'student', full_name: 'Trần Văn Nam (K66-CNTT)', role: 'student' })
      }
    ]
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f7fa' }}>
      {/* HEADER ĐỈNH CAO */}
      <Header style={{ background: '#001529', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 1000, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: '#1677ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: 18 }}>
            T
          </div>
          <div>
            <Text strong style={{ color: '#fff', fontSize: 16, display: 'block', lineHeight: 1.2 }}>
              TECHCORP E-LEARNING & KHẢO THÍ TRỰC TUYẾN
            </Text>
            <Text style={{ color: '#8c8c8c', fontSize: 11 }}>
              <GlobalOutlined /> lms.techcorp.info.vn — Nền tảng Đào tạo số & Đánh giá chuẩn quốc tế
            </Text>
          </div>
        </div>

        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[activeTab]}
          items={menuItems}
          onClick={({ key }) => setActiveTab(key)}
          style={{ flex: 1, minWidth: 0, justifyContent: 'center', background: 'transparent', borderBottom: 'none' }}
        />

        <Space>
          <Tag color="cyan">ERP SSO Liên thông</Tag>
          <Dropdown menu={userRoleMenu} placement="bottomRight">
            <Button type="text" style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Avatar style={{ backgroundColor: '#1677ff' }} icon={<UserOutlined />} />
              <span>{currentUser.full_name}</span>
            </Button>
          </Dropdown>
        </Space>
      </Header>

      {/* CONTENT CHÍNH */}
      <Content style={{ padding: '24px 32px' }}>
        {activeTab === 'elearning' && <ElearningCatalog currentUser={currentUser} />}
        {activeTab === 'exam' && <OnlineExamRoom currentUser={currentUser} />}
        {activeTab === 'qbank' && <QuestionBankView />}
        {activeTab === 'generator' && <ExamGeneratorView />}
        {activeTab === 'proctoring' && <LiveProctoringView />}
      </Content>

      {/* FOOTER */}
      <Footer style={{ textAlign: 'center', color: '#8c8c8c', fontSize: 13 }}>
        © 2026 TechCorp Higher Education Platform. Bản quyền phân hệ Đào tạo E-Learning & Khảo thí Trực tuyến chuẩn ISO 21001 & AUN-QA 4.0.
      </Footer>
    </Layout>
  );
}

export default App;
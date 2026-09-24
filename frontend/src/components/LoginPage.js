import React, { useState } from 'react';
import {
  Card, Form, Input, Button, Typography, Space, Divider, Alert, Row, Col, Tag, Tabs, message
} from 'antd';
import {
  UserOutlined, LockOutlined, GlobalOutlined, SafetyCertificateOutlined,
  BookOutlined, ThunderboltOutlined, TeamOutlined, LoginOutlined, CheckCircleOutlined
} from '@ant-design/icons';
import apiClient from '../services/apiClient';

const { Title, Text, Paragraph } = Typography;

export default function LoginPage({ onLoginSuccess }) {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleLocalLogin = async (values) => {
    setLoading(true);
    try {
      const res = await apiClient.post('/auth/login', values);
      if (res.success && res.user) {
        localStorage.setItem('lms_token', res.token);
        message.success(`Đăng nhập thành công! Chào mừng ${res.user.full_name}`);
        onLoginSuccess(res.user);
      }
    } catch (err) {
      message.error(err.message || 'Tài khoản hoặc mật khẩu không chính xác.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLoginAs = (role) => {
    let mockUser = {
      id: 3,
      username: 'student',
      full_name: 'Trần Văn Nam (Sinh viên K66-CNTT)',
      role: 'student',
      email: 'sinhvien@techcorp.info.vn'
    };

    if (role === 'teacher') {
      mockUser = {
        id: 2,
        username: 'teacher',
        full_name: 'TS. Nguyễn Văn An (Giảng viên)',
        role: 'teacher',
        email: 'giangvien@techcorp.info.vn'
      };
    } else if (role === 'admin') {
      mockUser = {
        id: 1,
        username: 'admin',
        full_name: 'Quản trị viên Hệ thống (Admin)',
        role: 'admin',
        email: 'admin@techcorp.info.vn'
      };
    }

    localStorage.setItem('lms_token', 'mock-valid-token-2026');
    message.success(`Đăng nhập trải nghiệm vai trò: ${mockUser.full_name}`);
    onLoginSuccess(mockUser);
  };

  const handleSsoLogin = () => {
    message.loading('Đang chuyển hướng tới cổng đăng nhập tập trung TCU COMPASS ERP...', 1.5);
    setTimeout(() => {
      // Giả lập SSO thành công từ qldt.techcorp.info.vn
      handleQuickLoginAs('student');
    }, 1500);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #001529 0%, #003a8c 50%, #0958d9 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}
    >
      <div style={{ maxWidth: 1100, width: '100%' }}>
        <Row gutter={[32, 32]} align="middle">
          {/* CỘT TRÁI: GIỚI THIỆU HỆ THỐNG ĐẲNG CẤP QUỐC TẾ */}
          <Col xs={24} md={13}>
            <div style={{ color: '#fff', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                <div
                  style={{
                    background: '#ffffff',
                    borderRadius: 14,
                    padding: '6px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    boxShadow: '0 4px 16px rgba(0,0,0,0.25)'
                  }}
                >
                  <img
                    src="/logo-techcorp.png"
                    alt="TechCorp Logo"
                    style={{ width: 44, height: 44, objectFit: 'contain' }}
                  />
                  <div>
                    <div style={{ color: '#002b66', fontSize: 16, fontWeight: 900, lineHeight: 1.1 }}>TECHCORP</div>
                    <div style={{ color: '#fa8c16', fontSize: 10, fontWeight: 700, letterSpacing: 0.5 }}>EDUCATION & TECH</div>
                  </div>
                </div>
              </div>

              <Space direction="horizontal" style={{ marginBottom: 16 }}>
                <Tag color="#1677ff" style={{ fontSize: 13, padding: '4px 12px', borderRadius: 20 }}>
                  CHUẨN QUỐC TẾ ISO 21001 & AUN-QA 4.0
                </Tag>
                <Tag color="#52c41a" style={{ fontSize: 13, padding: '4px 12px', borderRadius: 20 }}>
                  IMS QTI & AI PROCTORING READY
                </Tag>
              </Space>

              <Title level={1} style={{ color: '#fff', fontSize: 36, fontWeight: 800, lineHeight: 1.2, margin: '8px 0 16px' }}>
                Hệ Thống Đào Tạo E-Learning & Khảo Thí Trực Tuyến
              </Title>

              <Paragraph style={{ color: '#d9e8ff', fontSize: 16, lineHeight: 1.8, marginBottom: 28 }}>
                Nền tảng giáo dục số hóa hiện đại dành cho Trường Đại học. Tích hợp không gian học tập Classroom Studio, ngân hàng câu hỏi phân tầng theo chuẩn nhận thức Bloom, động cơ sinh đề thi ma trận tự động và trung tâm giám sát thi trực tuyến thời gian thực.
              </Paragraph>

              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Card style={{ background: 'rgba(255, 255, 255, 0.08)', borderColor: 'rgba(255,255,255,0.15)', borderRadius: 12 }}>
                    <BookOutlined style={{ fontSize: 28, color: '#4096ff', marginBottom: 8 }} />
                    <Title level={4} style={{ color: '#fff', margin: '4px 0' }}>Classroom Studio</Title>
                    <Text style={{ color: '#bae0ff', fontSize: 13 }}>Học liệu số, Video HD & Chứng chỉ điện tử tự động</Text>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card style={{ background: 'rgba(255, 255, 255, 0.08)', borderColor: 'rgba(255,255,255,0.15)', borderRadius: 12 }}>
                    <SafetyCertificateOutlined style={{ fontSize: 28, color: '#ff7875', marginBottom: 8 }} />
                    <Title level={4} style={{ color: '#fff', margin: '4px 0' }}>AI Proctoring</Title>
                    <Text style={{ color: '#bae0ff', fontSize: 13 }}>Giám sát thi webcam, chống gian lận & khóa trình duyệt</Text>
                  </Card>
                </Col>
              </Row>
            </div>
          </Col>

          {/* CỘT PHẢI: KHUNG ĐĂNG NHẬP CHUYÊN NGHIỆP */}
          <Col xs={24} md={11}>
            <Card
              style={{
                borderRadius: 16,
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                border: 'none',
                background: '#ffffff'
              }}
              styles={{ body: { padding: '36px 32px' } }}
            >
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <img
                  src="/logo-techcorp.png"
                  alt="TechCorp Logo"
                  style={{
                    width: 76,
                    height: 76,
                    objectFit: 'contain',
                    marginBottom: 10,
                    filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.12))'
                  }}
                />
                <Title level={3} style={{ margin: 0, fontWeight: 700 }}>Đăng Nhập Cổng Đào Tạo</Title>
                <Text type="secondary" style={{ fontSize: 13 }}>lms.techcorp.info.vn — Hệ thống xác thực tập trung</Text>
              </div>

              <Tabs
                defaultActiveKey="sso"
                centered
                items={[
                  {
                    key: 'sso',
                    label: <span><TeamOutlined /> Đăng Nhập SSO (Khuyên dùng)</span>,
                    children: (
                      <div style={{ paddingTop: 8, textAlign: 'center' }}>
                        <Alert
                          message="Liên thông một cửa (Single Sign-On)"
                          description="Sử dụng trực tiếp tài khoản sinh viên/cán bộ giảng viên từ hệ thống quản lý đào tạo trường (qldt.techcorp.info.vn) mà không cần mật khẩu mới."
                          type="info"
                          showIcon
                          style={{ marginBottom: 20, textAlign: 'left' }}
                        />

                        <Button
                          type="primary"
                          size="large"
                          block
                          icon={<LoginOutlined />}
                          onClick={handleSsoLogin}
                          style={{
                            height: 48,
                            fontSize: 15,
                            fontWeight: 600,
                            borderRadius: 8,
                            background: 'linear-gradient(135deg, #1677ff 0%, #0958d9 100%)'
                          }}
                        >
                          Đăng Nhập Qua Cổng TCU COMPASS ERP
                        </Button>

                        <Divider style={{ margin: '20px 0 16px', fontSize: 12, color: '#8c8c8c' }}>
                          HOẶC CHỌN VAI TRÒ ĐỂ TRẢI NGHIỆM NHANH (DEMO)
                        </Divider>

                        <Space direction="vertical" style={{ width: '100%' }}>
                          <Button block onClick={() => handleQuickLoginAs('student')} style={{ borderRadius: 6 }}>
                            🎓 Vào với vai trò: <b>Sinh Viên (Student)</b>
                          </Button>
                          <Button block onClick={() => handleQuickLoginAs('teacher')} style={{ borderRadius: 6 }}>
                            👨‍🏫 Vào với vai trò: <b>Giảng Viên (Teacher)</b>
                          </Button>
                          <Button block onClick={() => handleQuickLoginAs('admin')} style={{ borderRadius: 6 }}>
                            ⚡ Vào với vai trò: <b>Quản Trị Viên (Admin)</b>
                          </Button>
                        </Space>
                      </div>
                    )
                  },
                  {
                    key: 'local',
                    label: <span><UserOutlined /> Tài Khoản LMS</span>,
                    children: (
                      <Form form={form} layout="vertical" onFinish={handleLocalLogin} style={{ paddingTop: 8 }}>
                        <Form.Item
                          name="username"
                          label="Tên đăng nhập / Email"
                          rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập' }]}
                          initialValue="admin"
                        >
                          <Input prefix={<UserOutlined style={{ color: '#bfbfbf' }} />} placeholder="admin / teacher / student" size="large" />
                        </Form.Item>

                        <Form.Item
                          name="password"
                          label="Mật khẩu"
                          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
                          initialValue="root123@"
                        >
                          <Input.Password prefix={<LockOutlined style={{ color: '#bfbfbf' }} />} placeholder="Mật khẩu" size="large" />
                        </Form.Item>

                        <Button
                          type="primary"
                          htmlType="submit"
                          size="large"
                          block
                          loading={loading}
                          style={{ height: 48, fontSize: 15, fontWeight: 600, borderRadius: 8, marginTop: 8 }}
                        >
                          Đăng Nhập
                        </Button>

                        <div style={{ textAlign: 'center', marginTop: 16 }}>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            Mật khẩu mặc định hệ thống: <code>root123@</code>
                          </Text>
                        </div>
                      </Form>
                    )
                  }
                ]}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}

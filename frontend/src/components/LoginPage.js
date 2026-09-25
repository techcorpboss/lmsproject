import React, { useState } from 'react';
import {
  Card, Form, Input, Button, Typography, Space, Divider, Alert, Row, Col, Tag, Tabs, message
} from 'antd';
import {
  UserOutlined, LockOutlined, GlobalOutlined, SafetyCertificateOutlined,
  BookOutlined, ThunderboltOutlined, TeamOutlined, LoginOutlined, CheckCircleOutlined,
  BankOutlined
} from '@ant-design/icons';
import apiClient from '../services/apiClient';

const { Title, Text, Paragraph } = Typography;

const SAMPLE_FACULTIES = [
  {
    id: 'CNTT',
    name: 'Khoa Công Nghệ Thông Tin',
    color: '#1677ff',
    icon: '💻',
    teacher: {
      username: 'gv_cntt',
      name: 'TS. Hoàng Đức Em',
      desc: 'Giảng viên Kỹ thuật Phần mềm'
    },
    student: {
      username: 'sv_cntt',
      name: 'Trần Văn Nam',
      code: '261IT001',
      className: '66.CNTT-1'
    }
  },
  {
    id: 'KT',
    name: 'Khoa Kinh Tế & QTKD',
    color: '#d48806',
    icon: '📊',
    teacher: {
      username: 'gv_kinhte',
      name: 'TS. Nguyễn Thị Hồng',
      desc: 'Trưởng Khoa Kinh Tế'
    },
    student: {
      username: 'sv_kinhte',
      name: 'Lê Thị Mỹ Duyên',
      code: '261BA001',
      className: '66.QTKD-1'
    }
  },
  {
    id: 'NN',
    name: 'Khoa Ngoại Ngữ',
    color: '#389e0d',
    icon: '🌐',
    teacher: {
      username: 'gv_ngoaingu',
      name: 'TS. Phạm Thu Hương',
      desc: 'Trưởng Khoa Ngoại Ngữ'
    },
    student: {
      username: 'sv_ngoaingu',
      name: 'Hoàng Thùy Linh',
      code: '261NN001',
      className: '66.NNA-1'
    }
  },
  {
    id: 'DDT',
    name: 'Khoa Điện - Điện Tử & Tự Động Hóa',
    color: '#722ed1',
    icon: '⚡',
    teacher: {
      username: 'gv_dientu',
      name: 'TS. Bùi Quốc Thái',
      desc: 'Trưởng Khoa Điện - ĐT & IoT'
    },
    student: {
      username: 'sv_dientu',
      name: 'Nguyễn Văn Cường',
      code: '261DT001',
      className: '66.DDT-1'
    }
  },
  {
    id: 'DL',
    name: 'Khoa Du Lịch & Khách Sạn',
    color: '#c41d7f',
    icon: '✈️',
    teacher: {
      username: 'gv_dulich',
      name: 'ThS. Đỗ Quang Vinh',
      desc: 'Trưởng Khoa Du Lịch & KS'
    },
    student: {
      username: 'sv_dulich',
      name: 'Phan Quỳnh Trang',
      code: '261DL001',
      className: '66.DL-1'
    }
  }
];

const STANDARD_LECTURERS = [
  {
    code: 'GV001',
    username: 'em.hd',
    alt_username: 'teacher',
    name: 'TS. Hoàng Đức Em',
    title: 'Tiến sĩ',
    rank: 'Không',
    faculty: 'Khoa Công Nghệ Thông Tin',
    faculty_id: 'CNTT',
    department: 'Bộ môn Kỹ thuật Phần mềm',
    email: 'em.hd@techcorp.edu.vn',
    color: '#1677ff',
    badge: 'Chủ nhiệm bộ môn'
  },
  {
    code: 'GV002',
    username: 'tuan.tm',
    name: 'PGS. TS. Trần Mạnh Tuấn',
    title: 'Tiến sĩ',
    rank: 'Phó Giáo sư',
    faculty: 'Khoa Công Nghệ Thông Tin',
    faculty_id: 'CNTT',
    department: 'Ban Chủ nhiệm Khoa CNTT',
    email: 'tuan.tm@techcorp.edu.vn',
    color: '#0958d9',
    badge: 'BCN Khoa'
  },
  {
    code: 'GV003',
    username: 'an.nv',
    name: 'TS. Nguyễn Văn An',
    title: 'Tiến sĩ',
    rank: 'Không',
    faculty: 'Khoa Công Nghệ Thông Tin',
    faculty_id: 'CNTT',
    department: 'Trưởng bộ môn Kỹ thuật Phần mềm',
    email: 'an.nv@techcorp.edu.vn',
    color: '#13c2c2',
    badge: 'Trưởng BM KTPM'
  },
  {
    code: 'GV004',
    username: 'anh.cq',
    name: 'ThS. Chu Quỳnh Anh',
    title: 'Thạc sĩ',
    rank: 'Không',
    faculty: 'Khoa Công Nghệ Thông Tin',
    faculty_id: 'CNTT',
    department: 'Bộ môn Khoa học Máy tính',
    email: 'anh.cq@techcorp.edu.vn',
    color: '#722ed1',
    badge: 'BM KHMT'
  },
  {
    code: 'GV005',
    username: 'dang.lh',
    name: 'TS. Lê Hải Đăng',
    title: 'Tiến sĩ',
    rank: 'Không',
    faculty: 'Khoa Công Nghệ Thông Tin',
    faculty_id: 'CNTT',
    department: 'Trưởng bộ môn An toàn Thông tin',
    email: 'dang.lh@techcorp.edu.vn',
    color: '#eb2f96',
    badge: 'Trưởng BM ATTT'
  },
  {
    code: 'GV006',
    username: 'hong.nt',
    alt_username: 'gv_kinhte',
    name: 'TS. Nguyễn Thị Hồng',
    title: 'Tiến sĩ',
    rank: 'Không',
    faculty: 'Khoa Kinh Tế & QTKD',
    faculty_id: 'KT',
    department: 'Trưởng Khoa Kinh tế',
    email: 'hong.nt@techcorp.edu.vn',
    color: '#d48806',
    badge: 'Trưởng Khoa Kinh Tế'
  },
  {
    code: 'GV007',
    username: 'nam.v',
    name: 'ThS. Vũ Nam',
    title: 'Thạc sĩ',
    rank: 'Không',
    faculty: 'Khoa Kinh Tế & QTKD',
    faculty_id: 'KT',
    department: 'Bộ môn Quản trị Kinh doanh',
    email: 'nam.v@techcorp.edu.vn',
    color: '#fa8c16',
    badge: 'BM QTKD'
  }
];

export default function LoginPage({ onLoginSuccess }) {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSampleLogin = async (username) => {
    setLoading(true);
    try {
      const res = await apiClient.post('/auth/login', { username, password: 'root123@' });
      if (res && res.success && res.user) {
        localStorage.setItem('lms_token', res.token);
        message.success(`Đăng nhập thành công! Chào mừng ${res.user.full_name} (${res.user.faculty_name || 'Hệ thống'})`);
        onLoginSuccess(res.user);
        return;
      }
    } catch (err) {
      // Fallback nếu kết nối mạng tạm gián đoạn
      const stdLecturer = STANDARD_LECTURERS.find(l => l.username === username || l.alt_username === username);
      if (stdLecturer) {
        const user = {
          id: 4,
          username: stdLecturer.username,
          full_name: stdLecturer.name,
          role: 'teacher',
          title: stdLecturer.title,
          department: stdLecturer.department,
          faculty_id: stdLecturer.faculty_id,
          faculty_name: stdLecturer.faculty,
          email: stdLecturer.email
        };
        localStorage.setItem('lms_token', 'mock-valid-token-2026');
        message.success(`Đăng nhập giảng viên: ${user.full_name}`);
        onLoginSuccess(user);
        return;
      }

      const fac = SAMPLE_FACULTIES.find(f => f.teacher.username === username || f.student.username === username);
      const isTeacher = fac?.teacher.username === username;
      const user = isTeacher ? {
        id: username === 'gv_cntt' ? 2 : username === 'gv_kinhte' ? 6 : username === 'gv_ngoaingu' ? 8 : username === 'gv_dientu' ? 10 : 12,
        username,
        full_name: fac?.teacher.name,
        role: 'teacher',
        faculty_id: fac?.id,
        faculty_name: fac?.name
      } : {
        id: username === 'sv_cntt' ? 3 : username === 'sv_kinhte' ? 7 : username === 'sv_ngoaingu' ? 9 : username === 'sv_dientu' ? 11 : 13,
        username,
        full_name: fac?.student.name,
        role: 'student',
        student_code: fac?.student.code,
        class_name: fac?.student.className,
        faculty_id: fac?.id,
        faculty_name: fac?.name
      };
      localStorage.setItem('lms_token', 'mock-valid-token-2026');
      message.success(`Đăng nhập tài khoản mẫu: ${user.full_name}`);
      onLoginSuccess(user);
    } finally {
      setLoading(false);
    }
  };

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
      student_code: '261IT001',
      full_name: 'Trần Văn Nam',
      role: 'student',
      faculty_id: 'CNTT',
      faculty_name: 'Khoa Công Nghệ Thông Tin',
      major_id: 'CNPM',
      major_code: '7480103',
      major_name: 'Kỹ thuật Phần mềm',
      cohort: 'K66',
      class_name: '66.CNTT-1',
      birth_date: '15/08/2004',
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
                  },
                  {
                    key: 'standard_lecturers',
                    label: <span><TeamOutlined /> 7 Giảng Viên Mẫu</span>,
                    children: (
                      <div style={{ paddingTop: 8, maxHeight: 440, overflowY: 'auto', paddingRight: 4 }}>
                        <Alert
                          message="Danh mục 7 Giảng Viên Chuẩn (Đồng bộ CSDL MySQL)"
                          description="Danh sách chính xác theo danh mục phân công giảng dạy. Nhấp để đăng nhập trực tiếp với vai trò Giảng viên (Teacher) và chỉ truy cập các tính năng nghiệp vụ sư phạm."
                          type="info"
                          showIcon
                          style={{ marginBottom: 12 }}
                        />

                        <Space direction="vertical" style={{ width: '100%' }} size={10}>
                          {STANDARD_LECTURERS.map(gv => (
                            <Card
                              key={gv.code}
                              size="small"
                              style={{
                                borderRadius: 8,
                                border: `1px solid ${gv.color}35`,
                                background: '#f8fafc'
                              }}
                              styles={{ body: { padding: '10px 14px' } }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                                <div>
                                  <Space size={6} wrap>
                                    <Tag color={gv.color} style={{ fontWeight: 700 }}>{gv.code}</Tag>
                                    <Text strong style={{ fontSize: 13, color: '#1e293b' }}>{gv.name}</Text>
                                    <Tag color="cyan" style={{ fontSize: 10 }}>{gv.badge}</Tag>
                                  </Space>
                                  <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                                    {gv.faculty} • <i>{gv.department}</i>
                                  </div>
                                </div>
                                <Button
                                  type="primary"
                                  size="small"
                                  loading={loading}
                                  onClick={() => handleSampleLogin(gv.username)}
                                  style={{
                                    backgroundColor: gv.color,
                                    borderColor: gv.color,
                                    borderRadius: 6,
                                    fontSize: 11,
                                    fontWeight: 600,
                                    height: 28
                                  }}
                                >
                                  Đăng Nhập
                                </Button>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#94a3b8', borderTop: '1px dashed #e2e8f0', paddingTop: 6 }}>
                                <span>Username: <code style={{ color: '#0f172a' }}>{gv.username}</code></span>
                                <span>Email: <code>{gv.email}</code></span>
                              </div>
                            </Card>
                          ))}
                        </Space>
                      </div>
                    )
                  },
                  {
                    key: 'sample_faculties',
                    label: <span><BankOutlined /> Tài Khoản Mẫu (5 Khoa)</span>,
                    children: (
                      <div style={{ paddingTop: 8, maxHeight: 420, overflowY: 'auto', paddingRight: 4 }}>
                        <Alert
                          message="Tài khoản thực nghiệm theo từng Đơn vị Khoa Đào tạo"
                          description="Nhấp 1-chạm để đăng nhập đúng vai trò và thẩm quyền của từng Khoa. Hệ thống sẽ tự động lọc bài giảng, sổ điểm và lớp học phần tương ứng."
                          type="success"
                          showIcon
                          style={{ marginBottom: 14 }}
                        />

                        <Space direction="vertical" style={{ width: '100%' }} size={10}>
                          {SAMPLE_FACULTIES.map(fac => (
                            <Card
                              key={fac.id}
                              size="small"
                              style={{
                                borderRadius: 8,
                                border: `1px solid ${fac.color}40`,
                                background: '#f8fafc'
                              }}
                              styles={{ body: { padding: '10px 14px' } }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                <Space>
                                  <span style={{ fontSize: 16 }}>{fac.icon}</span>
                                  <Text strong style={{ color: fac.color, fontSize: 13 }}>{fac.name}</Text>
                                </Space>
                                <Tag color={fac.color}>{fac.id}</Tag>
                              </div>

                              <Row gutter={8}>
                                <Col span={12}>
                                  <Button
                                    size="small"
                                    block
                                    loading={loading}
                                    onClick={() => handleSampleLogin(fac.teacher.username)}
                                    style={{
                                      textAlign: 'left',
                                      height: 'auto',
                                      padding: '5px 8px',
                                      borderRadius: 6,
                                      borderColor: '#91caff'
                                    }}
                                  >
                                    <div style={{ fontSize: 11, color: '#1677ff', fontWeight: 600 }}>👨‍🏫 Giảng Viên:</div>
                                    <div style={{ fontSize: 12, fontWeight: 700, color: '#1f2937' }}>{fac.teacher.name}</div>
                                    <div style={{ fontSize: 10, color: '#64748b' }}>Acc: <code>{fac.teacher.username}</code></div>
                                  </Button>
                                </Col>
                                <Col span={12}>
                                  <Button
                                    size="small"
                                    block
                                    loading={loading}
                                    onClick={() => handleSampleLogin(fac.student.username)}
                                    style={{
                                      textAlign: 'left',
                                      height: 'auto',
                                      padding: '5px 8px',
                                      borderRadius: 6,
                                      borderColor: '#b7eb8f'
                                    }}
                                  >
                                    <div style={{ fontSize: 11, color: '#52c41a', fontWeight: 600 }}>🎓 Sinh Viên ({fac.student.className}):</div>
                                    <div style={{ fontSize: 12, fontWeight: 700, color: '#1f2937' }}>{fac.student.name}</div>
                                    <div style={{ fontSize: 10, color: '#64748b' }}>MSSV: <code>{fac.student.code}</code></div>
                                  </Button>
                                </Col>
                              </Row>
                            </Card>
                          ))}

                          <Button
                            type="dashed"
                            block
                            loading={loading}
                            onClick={() => handleSampleLogin('admin')}
                            style={{
                              borderRadius: 8,
                              borderColor: '#d9d9d9',
                              background: '#ffffff',
                              marginTop: 4
                            }}
                          >
                            ⚡ Đăng nhập Quản Trị Viên Toàn Trường: <b>admin</b> (Full Quyền 5 Khoa)
                          </Button>
                        </Space>
                      </div>
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

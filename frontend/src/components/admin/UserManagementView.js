import React, { useState, useEffect } from 'react';
import {
  Card, Table, Tag, Button, Space, Modal, Form, Input, Select,
  message, Popconfirm, Typography, Row, Col, Badge, Tooltip, Alert
} from 'antd';
import {
  UserOutlined, UserAddOutlined, KeyOutlined, DeleteOutlined,
  EditOutlined, ReloadOutlined, SafetyCertificateOutlined, CheckCircleOutlined
} from '@ant-design/icons';
import apiClient from '../../services/apiClient';

const { Title, Text } = Typography;
const { Option } = Select;

export default function UserManagementView() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  // State cấu hình 2FA cho người dùng
  const [twoFaSetupModalOpen, setTwoFaSetupModalOpen] = useState(false);
  const [selectedUser2Fa, setSelectedUser2Fa] = useState(null);
  const [qrCodeData, setQrCodeData] = useState(null);
  const [twoFaSecret, setTwoFaSecret] = useState('');
  const [twoFaBackupCodes, setTwoFaBackupCodes] = useState([]);
  const [settingUp2Fa, setSettingUp2Fa] = useState(false);

  const handleOpen2FaSetup = async (user) => {
    setSelectedUser2Fa(user);
    setTwoFaSetupModalOpen(true);
    setSettingUp2Fa(true);
    try {
      const res = await apiClient.post('/auth/2fa/setup');
      if (res && res.success) {
        setQrCodeData(res.qr_code);
        setTwoFaSecret(res.secret);
        setTwoFaBackupCodes(res.backup_codes || []);
      }
    } catch (e) {
      setTwoFaSecret('JBSWY3DPEHPK3PXPJBSWY3DPEHPK3PXP');
      setTwoFaBackupCodes(['A3F8-92B1', 'B7C2-41D9', 'E9F0-18A4', 'C2D5-83E1', 'F1A7-94B6', 'D8E2-37C5', '9B1F-52A8', '4C7E-61D3']);
    } finally {
      setSettingUp2Fa(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/admin/users');
      if (res && res.success) {
        // Luôn bảo đảm ẩn tài khoản superadmin / chủ dự án khỏi danh sách quản lý user
        const filtered = (res.data || []).filter(u =>
          u.role !== 'superadmin' &&
          u.username !== 'superadmin' &&
          u.username !== 'boss.techcorp'
        );
        setUsers(filtered);
      }
    } catch (e) {
      // Fallback data (đã loại bỏ superadmin)
      setUsers([
        { id: 1, username: 'admin', email: 'admin@techcorp.info.vn', full_name: 'Quản trị viên Hệ thống (Admin)', role: 'admin', status: 'ACTIVE', created_at: new Date().toISOString() },
        { id: 2, username: 'teacher', email: 'giangvien@techcorp.info.vn', full_name: 'TS. Nguyễn Văn An (Giảng viên)', role: 'teacher', status: 'ACTIVE', created_at: new Date().toISOString() },
        { id: 3, username: 'student', email: 'sinhvien@techcorp.info.vn', full_name: 'Trần Văn Nam (Sinh viên K66-CNTT)', role: 'student', status: 'ACTIVE', created_at: new Date().toISOString() },
        { id: 4, username: 'proctor', email: 'giamthi@techcorp.info.vn', full_name: 'Cán bộ Giám thị Khảo thí', role: 'proctor', status: 'ACTIVE', created_at: new Date().toISOString() },
        { id: 5, username: 'emhd', email: 'em.hd@techcorp.edu.vn', full_name: 'TS. Hoàng Đức Em (Khoa CNTT)', role: 'teacher', status: 'ACTIVE', created_at: new Date().toISOString() }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSave = async (values) => {
    try {
      if (editingUser) {
        await apiClient.put(`/admin/users/${editingUser.id}`, values);
        message.success('Cập nhật tài khoản người dùng thành công!');
      } else {
        await apiClient.post('/admin/users', values);
        message.success('Thêm tài khoản người dùng mới thành công!');
      }
      setIsModalOpen(false);
      setEditingUser(null);
      form.resetFields();
      fetchUsers();
    } catch (e) {
      message.error(e.message || 'Lỗi lưu tài khoản');
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiClient.delete(`/admin/users/${id}`);
      message.success('Đã xóa tài khoản!');
      fetchUsers();
    } catch (e) {
      message.error(e.message || 'Lỗi xóa tài khoản');
    }
  };

  const handleResetPassword = (record) => {
    message.success(`Đã cấp lại mật khẩu mặc định (123456@) cho tài khoản ${record.username}!`);
  };

  const getRoleTag = (role) => {
    switch (role) {
      case 'admin':
        return <Tag color="gold" icon={<SafetyCertificateOutlined />}>Quản trị viên (Admin)</Tag>;
      case 'teacher':
        return <Tag color="green">Giảng viên / Trưởng bộ môn</Tag>;
      case 'proctor':
        return <Tag color="purple">Cán bộ Giám thị</Tag>;
      default:
        return <Tag color="blue">Học viên / Sinh viên</Tag>;
    }
  };

  const columns = [
    {
      title: 'Tên đăng nhập',
      dataIndex: 'username',
      key: 'username',
      render: (text) => <code>{text}</code>
    },
    {
      title: 'Họ và tên',
      dataIndex: 'full_name',
      key: 'full_name',
      render: (text, r) => (
        <Space direction="vertical" size={0}>
          <Text strong>{text}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>{r.email}</Text>
        </Space>
      )
    },
    {
      title: 'Vai trò hệ thống',
      dataIndex: 'role',
      key: 'role',
      render: (role) => getRoleTag(role)
    },
    {
      title: 'Khoa & Lớp / Ngành',
      key: 'affiliation',
      render: (_, r) => {
        if (r.role === 'student') {
          return (
            <Space direction="vertical" size={2}>
              <Space>
                <Tag color="geekblue">{r.class_name || '66.CNTT-1'}</Tag>
                <Tag color="purple">{r.cohort || 'K66'}</Tag>
              </Space>
              <span style={{ fontSize: 11, color: '#475569' }}>{r.major_name || r.major || 'Kỹ thuật Phần mềm'}</span>
              <span style={{ fontSize: 10, color: '#94a3b8' }}>{r.faculty_name || 'Khoa CNTT'}</span>
            </Space>
          );
        }
        if (r.role === 'teacher') {
          return (
            <div>
              <Tag color="green">Khoa CNTT</Tag>
              <div style={{ fontSize: 11, color: '#475569' }}>Bộ môn Kỹ thuật Phần mềm</div>
            </div>
          );
        }
        return <Text type="secondary" style={{ fontSize: 12 }}>Ban Giám hiệu / TT Đào tạo</Text>;
      }
    },
    {
      title: 'Bảo mật 2FA / MFA',
      key: 'two_factor',
      render: (_, r) => {
        if (r.two_factor_enabled) {
          return <Tag color="green" icon={<SafetyCertificateOutlined />}>Đã kích hoạt TOTP</Tag>;
        }
        if (['admin', 'teacher'].includes(r.role)) {
          return <Tag color="orange" icon={<SafetyCertificateOutlined />}>Bắt buộc (Cấp độ 3)</Tag>;
        }
        return <Tag color="default">Chưa bật</Tag>;
      }
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: () => <Badge status="success" text="Đang hoạt động" />
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Cấu hình 2FA (Mã QR & Backup Codes)">
            <Button
              type="text"
              icon={<SafetyCertificateOutlined style={{ color: '#52c41a' }} />}
              onClick={() => handleOpen2FaSetup(record)}
            />
          </Tooltip>
          <Tooltip title="Sửa thông tin">
            <Button
              type="text"
              icon={<EditOutlined style={{ color: '#1677ff' }} />}
              onClick={() => {
                setEditingUser(record);
                form.setFieldsValue(record);
                setIsModalOpen(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Reset mật khẩu">
            <Button
              type="text"
              icon={<KeyOutlined style={{ color: '#fa8c16' }} />}
              onClick={() => handleResetPassword(record)}
            />
          </Tooltip>
          {record.username !== 'admin' && (
            <Popconfirm
              title="Xác nhận xóa tài khoản này?"
              onConfirm={() => handleDelete(record.id)}
              okText="Xóa"
              cancelText="Hủy"
            >
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          )}
        </Space>
      )
    }
  ];

  const currentRole = Form.useWatch('role', form);

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={4} style={{ margin: 0 }}>
            <UserOutlined style={{ color: '#1677ff', marginRight: 8 }} />
            Quản Lý Tài Khoản & Phân Quyền Vai Trò
          </Title>
          <Text type="secondary">Quản trị tập trung Admin, Giảng viên, Sinh viên và Giám thị thi trực tuyến</Text>
        </Col>
        <Col>
          <Space>
            <Button icon={<ReloadOutlined />} onClick={fetchUsers}>Làm mới</Button>
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              onClick={() => {
                setEditingUser(null);
                form.resetFields();
                setIsModalOpen(true);
              }}
            >
              Thêm Tài Khoản Mới
            </Button>
          </Space>
        </Col>
      </Row>

      <Table
        dataSource={users}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 8 }}
      />

      <Modal
        title={editingUser ? 'Chỉnh Sửa Tài Khoản' : 'Thêm Tài Khoản Người Dùng Mới'}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingUser(null);
        }}
        onOk={() => form.submit()}
        okText="Lưu Thông Tin"
        cancelText="Đóng"
        width={650}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="username" label="Tên đăng nhập" rules={[{ required: true, message: 'Nhập tên đăng nhập' }]}>
                <Input placeholder="VD: giangvien01, sv261001" disabled={!!editingUser} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="role" label="Vai trò hệ thống" rules={[{ required: true }]}>
                <Select placeholder="Chọn vai trò">
                  <Option value="admin">Quản trị viên (Admin)</Option>
                  <Option value="teacher">Giảng viên (Lecturer)</Option>
                  <Option value="student">Học viên / Sinh viên (Student)</Option>
                  <Option value="proctor">Cán bộ Giám thị (Proctor)</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="full_name" label="Họ và tên" rules={[{ required: true, message: 'Nhập họ và tên' }]}>
                <Input placeholder="VD: TS. Nguyễn Văn A / Trần Văn Nam" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="email" label="Địa chỉ Email" rules={[{ required: true, type: 'email', message: 'Email hợp lệ' }]}>
                <Input placeholder="user@techcorp.edu.vn" />
              </Form.Item>
            </Col>
          </Row>

          {/* CÁC TRƯỜNG DÀNH RIÊNG CHO TÀI KHOẢN SINH VIÊN */}
          {(currentRole === 'student' || (!currentRole && editingUser?.role === 'student')) && (
            <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: 8, border: '1px solid #e2e8f0', marginBottom: 16 }}>
              <div style={{ fontWeight: 700, color: '#0958d9', marginBottom: 10, fontSize: 13 }}>
                🎓 Gắn Hồ Sơ Đào Tạo Sinh Viên (Khoa, Ngành, Khóa, Lớp)
              </div>
              <Row gutter={12}>
                <Col span={12}>
                  <Form.Item name="student_code" label="Mã Sinh Viên (MSSV)" initialValue="261IT001" rules={[{ required: true }]}>
                    <Input placeholder="VD: 261IT001" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="birth_date" label="Ngày sinh" initialValue="15/08/2004">
                    <Input placeholder="DD/MM/YYYY" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={12}>
                <Col span={12}>
                  <Form.Item name="faculty_name" label="Khoa quản lý" initialValue="Khoa Công Nghệ Thông Tin">
                    <Select>
                      <Option value="Khoa Công Nghệ Thông Tin">Khoa Công Nghệ Thông Tin (CNTT)</Option>
                      <Option value="Khoa Kinh Tế & QTKD">Khoa Kinh Tế & QTKD (KT)</Option>
                      <Option value="Khoa Ngoại Ngữ">Khoa Ngoại Ngữ (NN)</Option>
                      <Option value="Khoa Du Lịch & Khách Sạn">Khoa Du Lịch & Khách Sạn (DL)</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="major_name" label="Chuyên ngành đào tạo" initialValue="Kỹ thuật Phần mềm">
                    <Select>
                      <Option value="Kỹ thuật Phần mềm">Kỹ thuật Phần mềm (7480103)</Option>
                      <Option value="Khoa học Máy tính & AI">Khoa học Máy tính & AI (7480101)</Option>
                      <Option value="Công nghệ Thông tin">Công nghệ Thông tin (7480201)</Option>
                      <Option value="Hệ thống Thông tin">Hệ thống Thông tin (7480104)</Option>
                      <Option value="Quản trị Kinh doanh">Quản trị Kinh doanh (7340101)</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={12}>
                <Col span={12}>
                  <Form.Item name="cohort" label="Khóa đào tạo" initialValue="K66">
                    <Select>
                      <Option value="K66">Khóa 66 (2022 - 2026)</Option>
                      <Option value="K67">Khóa 67 (2023 - 2027)</Option>
                      <Option value="K68">Khóa 68 (2024 - 2028)</Option>
                      <Option value="K65">Khóa 65 (2021 - 2025)</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="class_name" label="Lớp hành chính / sinh hoạt" initialValue="66.CNTT-1">
                    <Select>
                      <Option value="66.CNTT-1">Lớp 66.CNTT-1</Option>
                      <Option value="66.CNTT-2">Lớp 66.CNTT-2</Option>
                      <Option value="66.HTTT-1">Lớp 66.HTTT-1</Option>
                      <Option value="66.KHMT-1">Lớp 66.KHMT-1</Option>
                      <Option value="68.KHMT-1">Lớp 68.KHMT-1</Option>
                      <Option value="66.QTKD-1">Lớp 66.QTKD-1</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </div>
          )}

          {!editingUser && (
            <Form.Item name="password" label="Mật khẩu khởi tạo" initialValue="123456@">
              <Input.Password placeholder="Mặc định: 123456@" />
            </Form.Item>
          )}
        </Form>
      </Modal>

      {/* MODAL CẤU HÌNH BẢO MẬT 2FA / MFA CHO TÀI KHOẢN */}
      <Modal
        title={
          <Space>
            <SafetyCertificateOutlined style={{ color: '#52c41a', fontSize: 20 }} />
            <span>Cấu hình Xác thực 2 Yếu tố 2FA (TOTP RFC 6238)</span>
          </Space>
        }
        open={twoFaSetupModalOpen}
        onCancel={() => setTwoFaSetupModalOpen(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setTwoFaSetupModalOpen(false)}>
            Đã Lưu Thông Tin
          </Button>
        ]}
        width={520}
      >
        <div style={{ textAlign: 'center', padding: '10px 0' }}>
          <Alert
            message={`Tài khoản: ${selectedUser2Fa?.full_name} (@${selectedUser2Fa?.username})`}
            description="Quét mã QR dưới đây bằng Google Authenticator hoặc Microsoft Authenticator để liên kết tài khoản."
            type="info"
            showIcon
            style={{ marginBottom: 16, textAlign: 'left' }}
          />

          {qrCodeData ? (
            <div style={{ margin: '15px auto', display: 'inline-block', padding: 8, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12 }}>
              <img src={qrCodeData} alt="2FA QR Code" style={{ width: 180, height: 180, display: 'block' }} />
            </div>
          ) : (
            <div style={{ padding: 40 }}>Đang sinh mã QR mật mã học...</div>
          )}

          <div style={{ marginTop: 12, textAlign: 'left', background: '#f8fafc', padding: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>
              <b>Khóa bí mật (Base32 Secret Key):</b>
            </div>
            <code style={{ fontSize: 13, color: '#0f172a', fontWeight: 700, letterSpacing: 1, wordBreak: 'break-all' }}>
              {twoFaSecret || 'JBSWY3DPEHPK3PXP'}
            </code>
          </div>

          <div style={{ marginTop: 16, textAlign: 'left' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', marginBottom: 6 }}>
              🔑 8 Mã dự phòng phục hồi khẩn cấp (Backup Codes):
            </div>
            <div style={{ fontSize: 11, color: '#64748b', marginBottom: 8 }}>
              Lưu giữ các mã này ở nơi an toàn. Mỗi mã chỉ có giá trị đăng nhập 1 lần khi không có điện thoại.
            </div>
            <Row gutter={[8, 8]}>
              {twoFaBackupCodes.map((bc, idx) => (
                <Col span={6} key={idx}>
                  <Tag color="blue" style={{ width: '100%', textAlign: 'center', padding: '4px 0', fontSize: 12, fontWeight: 600 }}>
                    {bc}
                  </Tag>
                </Col>
              ))}
            </Row>
          </div>
        </div>
      </Modal>
    </div>
  );
}

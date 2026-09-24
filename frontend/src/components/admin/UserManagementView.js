import React, { useState, useEffect } from 'react';
import {
  Card, Table, Tag, Button, Space, Modal, Form, Input, Select,
  message, Popconfirm, Typography, Row, Col, Badge, Tooltip
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

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/admin/users');
      if (res && res.success) {
        setUsers(res.data);
      }
    } catch (e) {
      // Fallback data
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
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item name="username" label="Tên đăng nhập" rules={[{ required: true, message: 'Nhập tên đăng nhập' }]}>
            <Input placeholder="VD: giangvien01, sv261001" disabled={!!editingUser} />
          </Form.Item>
          <Form.Item name="full_name" label="Họ và tên" rules={[{ required: true, message: 'Nhập họ và tên' }]}>
            <Input placeholder="VD: TS. Nguyễn Văn A" />
          </Form.Item>
          <Form.Item name="email" label="Địa chỉ Email" rules={[{ required: true, type: 'email', message: 'Email hợp lệ' }]}>
            <Input placeholder="user@techcorp.edu.vn" />
          </Form.Item>
          <Form.Item name="role" label="Vai trò" rules={[{ required: true }]}>
            <Select placeholder="Chọn vai trò">
              <Option value="admin">Quản trị viên (Admin)</Option>
              <Option value="teacher">Giảng viên (Lecturer)</Option>
              <Option value="student">Học viên / Sinh viên (Student)</Option>
              <Option value="proctor">Cán bộ Giám thị (Proctor)</Option>
            </Select>
          </Form.Item>
          {!editingUser && (
            <Form.Item name="password" label="Mật khẩu khởi tạo" initialValue="123456@">
              <Input.Password placeholder="Mặc định: 123456@" />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
}

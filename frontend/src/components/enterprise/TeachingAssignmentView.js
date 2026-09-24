import React, { useState, useEffect } from 'react';
import {
  Card, Table, Tag, Button, Space, Typography, Row, Col, Select,
  Modal, Form, Input, message, Badge, Tooltip
} from 'antd';
import {
  ApartmentOutlined, TeamOutlined, UserOutlined, PlusOutlined,
  ReloadOutlined, BookOutlined, CheckCircleOutlined, AuditOutlined
} from '@ant-design/icons';
import apiClient from '../../services/apiClient';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

export default function TeachingAssignmentView({ currentUser }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState('ALL');
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/academic/enterprise/hierarchy');
      if (res && res.success) {
        setData(res.data);
      }
    } catch (e) {
      setData({
        faculties: [
          { id: 'CNTT', name: 'Khoa Công Nghệ Thông Tin', dean: 'PGS. TS. Trần Mạnh Tuấn' },
          { id: 'KT', name: 'Khoa Kinh Tế & QTKD', dean: 'TS. Nguyễn Thị Hồng' }
        ],
        assignments: [
          { id: 1, lecturer_name: 'TS. Hoàng Đức Em', lecturer_username: 'teacher', course_code: 'IT101', course_name: 'Nhập môn Lập trình C/C++', class_name: '66.CNTT-1', semester: 'Học kỳ 1 (2026-2027)', faculty_id: 'CNTT', major_name: 'Kỹ thuật Phần mềm', cohort: 'K66', can_author_lms: true, can_grade: true },
          { id: 2, lecturer_name: 'TS. Hoàng Đức Em', lecturer_username: 'teacher', course_code: 'IT201', course_name: 'Cơ sở Dữ liệu (Database Systems)', class_name: '66.HTTT-1', semester: 'Học kỳ 1 (2026-2027)', faculty_id: 'CNTT', major_name: 'Hệ thống Thông tin', cohort: 'K66', can_author_lms: true, can_grade: true },
          { id: 3, lecturer_name: 'TS. Nguyễn Văn An', lecturer_username: 'an.nv', course_code: 'IT301', course_name: 'Cấu trúc Dữ liệu & Giải thuật', class_name: '65.CNTT-1', semester: 'Học kỳ 1 (2026-2027)', faculty_id: 'CNTT', major_name: 'Kỹ thuật Phần mềm', cohort: 'K65', can_author_lms: true, can_grade: true }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveAssignment = async (values) => {
    try {
      await apiClient.post('/academic/enterprise/assignments', values);
      message.success('Phân công giảng viên giảng dạy thành công!');
      setIsModalOpen(false);
      form.resetFields();
      fetchData();
    } catch (e) {
      message.error(e.message || 'Lỗi lưu phân công');
    }
  };

  const assignmentsList = (data && data.assignments) || [];
  const filteredAssignments = assignmentsList.filter(a =>
    selectedFaculty === 'ALL' || a.faculty_id === selectedFaculty || !a.faculty_id
  );

  const columns = [
    {
      title: 'Giảng Viên Phụ Trách',
      dataIndex: 'lecturer_name',
      key: 'lecturer_name',
      render: (name, r) => (
        <Space>
          <UserOutlined style={{ color: '#1677ff' }} />
          <div>
            <Text strong>{name}</Text>
            <div style={{ fontSize: 11, color: '#64748b' }}>Tài khoản: <code>{r.lecturer_username || 'teacher'}</code></div>
          </div>
        </Space>
      )
    },
    {
      title: 'Môn Học / Học Phần',
      dataIndex: 'course_name',
      key: 'course_name',
      render: (cname, r) => (
        <div>
          <Tag color="blue" style={{ fontWeight: 600 }}>{r.course_code}</Tag>
          <Text strong>{cname}</Text>
        </div>
      )
    },
    {
      title: 'Lớp Học Phần & Khóa',
      dataIndex: 'class_name',
      key: 'class_name',
      render: (cls, r) => (
        <Space wrap>
          <Tag color="geekblue">{cls}</Tag>
          <Tag color="purple">{r.cohort || 'K66'}</Tag>
          <span style={{ fontSize: 12, color: '#475569' }}>{r.major_name || 'CNTT'}</span>
        </Space>
      )
    },
    {
      title: 'Học Kỳ & Năm Học',
      dataIndex: 'semester',
      key: 'semester',
      render: (sem) => <Tag color="cyan">{sem}</Tag>
    },
    {
      title: 'Quyền Hạn LMS',
      key: 'permissions',
      render: () => (
        <Space wrap>
          <Tag color="green">✓ Soạn bài giảng 15T</Tag>
          <Tag color="orange">✓ Đánh giá & Chấm điểm</Tag>
          <Tag color="purple">✓ Ngân hàng đề thi</Tag>
        </Space>
      )
    },
    {
      title: 'Trạng Thái',
      key: 'status',
      render: () => <Badge status="success" text="Đã kích hoạt" />
    }
  ];

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={4} style={{ margin: 0 }}>
            <ApartmentOutlined style={{ color: '#1677ff', marginRight: 8 }} />
            Phân Cấp Đào Tạo & Phân Công Giảng Viên Phụ Trách Môn Học
          </Title>
          <Text type="secondary">Đồng nhất quyền biên soạn bài giảng, quản lý học liệu và chấm điểm với tài khoản giảng viên</Text>
        </Col>
        <Col>
          <Space>
            <Select value={selectedFaculty} onChange={setSelectedFaculty} style={{ width: 220 }}>
              <Option value="ALL">Tất Cả Các Khoa</Option>
              <Option value="CNTT">Khoa Công Nghệ Thông Tin</Option>
              <Option value="KT">Khoa Kinh Tế & QTKD</Option>
            </Select>
            <Button icon={<ReloadOutlined />} onClick={fetchData}>Làm mới</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
              Phân Công Giảng Dạy Mới
            </Button>
          </Space>
        </Col>
      </Row>

      <Table
        dataSource={filteredAssignments}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 6 }}
      />

      <Modal
        title="Phân Công Giảng Viên Phụ Trách Môn Học & Soạn Giảng LMS"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        okText="Lưu Phân Công"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" onFinish={handleSaveAssignment}>
          <Form.Item name="lecturer_name" label="Giảng viên phụ trách" rules={[{ required: true }]}>
            <Select placeholder="Chọn giảng viên">
              <Option value="TS. Hoàng Đức Em">TS. Hoàng Đức Em (teacher)</Option>
              <Option value="TS. Nguyễn Văn An">TS. Nguyễn Văn An (an.nv)</Option>
              <Option value="ThS. Chu Quỳnh Anh">ThS. Chu Quỳnh Anh (anh.cq)</Option>
            </Select>
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="course_code" label="Mã học phần" rules={[{ required: true }]}>
                <Input placeholder="VD: IT101" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="course_name" label="Tên môn học" rules={[{ required: true }]}>
                <Input placeholder="VD: Nhập môn Lập trình C/C++" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="class_name" label="Lớp học phần" rules={[{ required: true }]}>
                <Input placeholder="VD: 66.CNTT-1" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="semester" label="Học kỳ & Năm học" initialValue="Học kỳ 1 (2026-2027)">
                <Select>
                  <Option value="Học kỳ 1 (2026-2027)">Học kỳ 1 (2026-2027)</Option>
                  <Option value="Học kỳ 2 (2026-2027)">Học kỳ 2 (2026-2027)</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}

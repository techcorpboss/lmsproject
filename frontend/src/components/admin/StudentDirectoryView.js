import React, { useState, useEffect } from 'react';
import {
  Table, Tag, Button, Space, Typography, Row, Col, Input, Select,
  Progress, Modal, Form, message, Tooltip
} from 'antd';
import {
  TeamOutlined, UserAddOutlined, ReloadOutlined, DownloadOutlined,
  SearchOutlined, CheckCircleOutlined, ExclamationCircleOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons';
import apiClient from '../../services/apiClient';

const { Title, Text } = Typography;
const { Option } = Select;

export default function StudentDirectoryView() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedCohort, setSelectedCohort] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/admin/students');
      if (res && res.success) {
        setStudents(res.data);
      }
    } catch (e) {
      setStudents([
        { id: 1, student_code: '261IT001', full_name: 'Trần Văn Nam', class_name: '66.CNTT-1', major: 'Kỹ thuật Phần mềm', cohort: 'K66', gpa: 3.65, credits_accumulated: 38, lms_progress_pct: 88, status: 'ACTIVE', email: 'nam.tv@techcorp.edu.vn' },
        { id: 2, student_code: '261IT002', full_name: 'Nguyễn Thị Mai', class_name: '66.CNTT-1', major: 'Kỹ thuật Phần mềm', cohort: 'K66', gpa: 3.82, credits_accumulated: 42, lms_progress_pct: 95, status: 'ACTIVE', email: 'mai.nt@techcorp.edu.vn' },
        { id: 3, student_code: '261IT003', full_name: 'Lê Hoàng Long', class_name: '66.CNTT-1', major: 'Kỹ thuật Phần mềm', cohort: 'K66', gpa: 3.20, credits_accumulated: 35, lms_progress_pct: 82, status: 'ACTIVE', email: 'long.lh@techcorp.edu.vn' },
        { id: 4, student_code: '261IT004', full_name: 'Phạm Minh Tuấn', class_name: '66.CNTT-2', major: 'Hệ thống Thông tin', cohort: 'K66', gpa: 2.85, credits_accumulated: 32, lms_progress_pct: 74, status: 'ACTIVE', email: 'tuan.pm@techcorp.edu.vn' },
        { id: 5, student_code: '261IT005', full_name: 'Vũ Hải Đăng', class_name: '66.CNTT-2', major: 'Hệ thống Thông tin', cohort: 'K66', gpa: 1.95, credits_accumulated: 22, lms_progress_pct: 45, status: 'ACADEMIC_WARNING_1', email: 'dang.vh@techcorp.edu.vn' },
        { id: 6, student_code: '251IT010', full_name: 'Đỗ Thùy Linh', class_name: '65.CNTT-1', major: 'Khoa học Máy tính', cohort: 'K65', gpa: 3.55, credits_accumulated: 78, lms_progress_pct: 91, status: 'ACTIVE', email: 'linh.dt@techcorp.edu.vn' },
        { id: 7, student_code: '251IT012', full_name: 'Ngô Quốc Bảo', class_name: '65.CNTT-1', major: 'Khoa học Máy tính', cohort: 'K65', gpa: 3.40, credits_accumulated: 75, lms_progress_pct: 86, status: 'ACTIVE', email: 'bao.nq@techcorp.edu.vn' },
        { id: 8, student_code: '241IT008', full_name: 'Hoàng Kim Ngân', class_name: '64.CNTT-1', major: 'An toàn Thông tin', cohort: 'K64', gpa: 3.70, credits_accumulated: 112, lms_progress_pct: 96, status: 'ACTIVE', email: 'ngan.hk@techcorp.edu.vn' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSaveStudent = async (values) => {
    try {
      await apiClient.post('/admin/students', values);
      message.success('Thêm hồ sơ sinh viên thành công!');
      setIsModalOpen(false);
      form.resetFields();
      fetchStudents();
    } catch (e) {
      message.error(e.message || 'Lỗi lưu sinh viên');
    }
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8,"
      + "MSSV,Họ và tên,Lớp,Ngành,Khóa,GPA,Tín chỉ tích lũy,Tiến độ LMS %,Trạng thái\n"
      + students.map(s => `"${s.student_code}","${s.full_name}","${s.class_name}","${s.major}","${s.cohort}","${s.gpa}","${s.credits_accumulated}","${s.lms_progress_pct}%","${s.status}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `danh_sach_sinh_vien_lms_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    message.success('Đã xuất danh sách sinh viên!');
  };

  const filteredStudents = students.filter(s => {
    const matchSearch =
      s.full_name.toLowerCase().includes(searchText.toLowerCase()) ||
      s.student_code.toLowerCase().includes(searchText.toLowerCase()) ||
      s.class_name.toLowerCase().includes(searchText.toLowerCase());
    const matchCohort = selectedCohort === 'ALL' || s.cohort === selectedCohort;
    return matchSearch && matchCohort;
  });

  const columns = [
    {
      title: 'Mã SV',
      dataIndex: 'student_code',
      key: 'student_code',
      width: 120,
      render: (code) => <Text strong style={{ color: '#1677ff' }}>{code}</Text>
    },
    {
      title: 'Họ và Tên',
      dataIndex: 'full_name',
      key: 'full_name',
      render: (name, r) => (
        <Space direction="vertical" size={0}>
          <Text strong>{name}</Text>
          <Text type="secondary" style={{ fontSize: 11 }}>{r.email}</Text>
        </Space>
      )
    },
    {
      title: 'Lớp & Ngành Đào Tạo',
      dataIndex: 'class_name',
      key: 'class_name',
      render: (c, r) => (
        <div>
          <Tag color="geekblue">{c}</Tag>
          <span style={{ fontSize: 12, color: '#475569' }}>{r.major}</span>
        </div>
      )
    },
    {
      title: 'Khóa',
      dataIndex: 'cohort',
      key: 'cohort',
      width: 80,
      render: (ch) => <Tag color="purple">{ch}</Tag>
    },
    {
      title: 'Điểm GPA / Tín chỉ',
      key: 'academic',
      width: 140,
      render: (_, r) => (
        <div>
          <Text strong style={{ color: r.gpa >= 3.2 ? '#52c41a' : r.gpa < 2.0 ? '#ff4d4f' : '#fa8c16' }}>
            GPA: {r.gpa}
          </Text>
          <div style={{ fontSize: 11, color: '#64748b' }}>Đã tích lũy: {r.credits_accumulated} TC</div>
        </div>
      )
    },
    {
      title: 'Tiến Độ Học LMS',
      dataIndex: 'lms_progress_pct',
      key: 'lms_progress_pct',
      width: 170,
      render: (pct) => (
        <Space wrap>
          <Progress percent={pct} size="small" style={{ width: 90 }} strokeColor={pct >= 80 ? '#52c41a' : '#faad14'} />
          {pct >= 80 && <Tag color="success" style={{ fontSize: 10 }}>Đủ điều kiện thi</Tag>}
        </Space>
      )
    },
    {
      title: 'Trạng Thái Học Vụ',
      dataIndex: 'status',
      key: 'status',
      width: 140,
      render: (st) => (
        st === 'ACTIVE' ? (
          <Tag color="success">Bình thường</Tag>
        ) : (
          <Tag color="error">Cảnh báo học vụ (TT 08)</Tag>
        )
      )
    }
  ];

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={4} style={{ margin: 0 }}>
            <TeamOutlined style={{ color: '#1677ff', marginRight: 8 }} />
            Quản Lý Danh Sách Học Viên & Tiến Độ Học Tập Tích Lũy
          </Title>
          <Text type="secondary">Theo dõi tiến độ hoàn thành bài giảng 15 tuần, tỷ lệ đạt điều kiện thi theo TT 08/2021</Text>
        </Col>
        <Col>
          <Space>
            <Select value={selectedCohort} onChange={setSelectedCohort} style={{ width: 140 }}>
              <Option value="ALL">Tất cả Khóa</Option>
              <Option value="K66">Khóa K66</Option>
              <Option value="K65">Khóa K65</Option>
              <Option value="K64">Khóa K64</Option>
            </Select>
            <Input
              placeholder="Tìm theo MSSV, Họ tên, Lớp..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              style={{ width: 220 }}
              allowClear
            />
            <Button icon={<ReloadOutlined />} onClick={fetchStudents}>Làm mới</Button>
            <Button type="primary" icon={<UserAddOutlined />} onClick={() => setIsModalOpen(true)}>Thêm Sinh Viên</Button>
            <Button icon={<DownloadOutlined />} onClick={handleExport}>Xuất File</Button>
          </Space>
        </Col>
      </Row>

      <Table
        dataSource={filteredStudents}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 8 }}
      />

      <Modal
        title="Thêm Hồ Sơ Sinh Viên Mới Vào LMS"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        okText="Lưu Hồ Sơ"
        cancelText="Hủy"
        width={620}
      >
        <Form form={form} layout="vertical" onFinish={handleSaveStudent}>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="student_code" label="Mã số sinh viên (MSSV)" rules={[{ required: true }]}>
                <Input placeholder="VD: 261IT099" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="full_name" label="Họ và tên sinh viên" rules={[{ required: true }]}>
                <Input placeholder="VD: Lê Thị Ánh Tuyết" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="email" label="Địa chỉ Email" rules={[{ required: true, type: 'email' }]}>
                <Input placeholder="tuyet.lta@techcorp.edu.vn" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="birth_date" label="Ngày sinh" initialValue="20/05/2004">
                <Input placeholder="DD/MM/YYYY" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="faculty_name" label="Khoa đào tạo" initialValue="Khoa Công Nghệ Thông Tin">
                <Select>
                  <Option value="Khoa Công Nghệ Thông Tin">Khoa Công Nghệ Thông Tin (CNTT)</Option>
                  <Option value="Khoa Kinh Tế & QTKD">Khoa Kinh Tế & QTKD (KT)</Option>
                  <Option value="Khoa Ngoại Ngữ">Khoa Ngoại Ngữ (NN)</Option>
                  <Option value="Khoa Du Lịch & Khách Sạn">Khoa Du Lịch & Khách Sạn (DL)</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="major" label="Chuyên ngành đào tạo" initialValue="Kỹ thuật Phần mềm">
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
              <Form.Item name="class_name" label="Lớp hành chính / sinh hoạt" initialValue="66.CNTT-1" rules={[{ required: true }]}>
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
        </Form>
      </Modal>
    </div>
  );
}

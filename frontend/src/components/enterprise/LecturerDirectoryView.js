import React, { useState, useEffect } from 'react';
import {
  Card, Table, Tag, Button, Space, Typography, Row, Col,
  Modal, Form, Input, InputNumber, Select, message,
  Popconfirm, Tooltip, Upload, Drawer, Avatar, Divider
} from 'antd';
import {
  SolutionOutlined, PlusOutlined, EditOutlined, DeleteOutlined,
  FileExcelOutlined, DownloadOutlined, UploadOutlined,
  SearchOutlined, UserOutlined, MailOutlined, PhoneOutlined,
  BookOutlined, EyeOutlined, ReloadOutlined, ApartmentOutlined,
  CheckCircleOutlined, StarOutlined
} from '@ant-design/icons';
import apiClient from '../../services/apiClient';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

export default function LecturerDirectoryView() {
  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFacultyFilter, setSelectedFacultyFilter] = useState('ALL');
  const [selectedTitleFilter, setSelectedTitleFilter] = useState('ALL');

  // Modal / Drawer state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [editingLecturer, setEditingLecturer] = useState(null);
  const [viewingLecturer, setViewingLecturer] = useState(null);

  const [form] = Form.useForm();

  // Tải danh sách giảng viên
  const fetchLecturers = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/academic/enterprise/lecturers');
      if (res && res.success && res.data) {
        setLecturers(res.data);
      }
    } catch (e) {
      console.error('Lỗi tải danh mục giảng viên:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLecturers();
  }, []);

  // Xử lý lưu giảng viên (Thêm mới hoặc Sửa)
  const handleSaveLecturer = async (values) => {
    try {
      if (editingLecturer) {
        await apiClient.put(`/academic/enterprise/lecturers/${editingLecturer.id}`, values);
        message.success('Cập nhật hồ sơ giảng viên thành công!');
      } else {
        await apiClient.post('/academic/enterprise/lecturers', values);
        message.success('Thêm mới giảng viên thành công!');
      }
      setIsModalOpen(false);
      form.resetFields();
      setEditingLecturer(null);
      fetchLecturers();
    } catch (e) {
      message.error(e.message || 'Lỗi lưu hồ sơ giảng viên');
    }
  };

  // Xóa giảng viên
  const handleDeleteLecturer = async (id) => {
    try {
      await apiClient.delete(`/academic/enterprise/lecturers/${id}`);
      message.success('Đã xóa giảng viên khỏi danh mục!');
      fetchLecturers();
    } catch (e) {
      message.error(e.message || 'Lỗi xóa giảng viên');
    }
  };

  // Xuất file Excel / CSV chuẩn
  const handleExportExcel = () => {
    if (!lecturers || lecturers.length === 0) {
      message.warning('Không có dữ liệu giảng viên để xuất!');
      return;
    }

    const headers = [
      'Mã GV', 'Họ Và Tên', 'Giới Tính', 'Ngày Sinh', 'Học Hàm',
      'Học Vị', 'Khoa/Viện', 'Bộ Môn', 'Email', 'Điện Thoại',
      'Chuyên Môn Đào Tạo', 'Số Năm Kinh Nghiệm', 'Học Phần Phụ Trách',
      'Hướng Nghiên Cứu', 'Tình Trạng Công Tác'
    ];

    const rows = filteredLecturers.map(l => [
      `"${l.code || ''}"`,
      `"${l.full_name || ''}"`,
      `"${l.gender || 'Nam'}"`,
      `"${l.birth_date || ''}"`,
      `"${l.academic_rank || 'Không'}"`,
      `"${l.title || ''}"`,
      `"${l.faculty_name || ''}"`,
      `"${l.department || ''}"`,
      `"${l.email || ''}"`,
      `"${l.phone || ''}"`,
      `"${l.specialization || ''}"`,
      `"${l.experience_years || 0}"`,
      `"${(l.assigned_courses || []).join('; ')}"`,
      `"${l.research_interests || ''}"`,
      `"${l.status || 'Đang công tác'}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Danh_Sach_Giang_Vien_TCU_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    message.success('Đã xuất thành công danh sách hồ sơ giảng viên ra file Excel / CSV!');
  };

  // Lọc giảng viên
  const filteredLecturers = lecturers.filter(l => {
    // Lọc theo Khoa
    if (selectedFacultyFilter !== 'ALL' && l.faculty_id !== selectedFacultyFilter) return false;
    // Lọc theo Học vị
    if (selectedTitleFilter !== 'ALL') {
      if (selectedTitleFilter === 'PGS' && l.academic_rank !== 'Phó Giáo sư') return false;
      if (selectedTitleFilter === 'TS' && !l.title?.includes('Tiến sĩ')) return false;
      if (selectedTitleFilter === 'ThS' && !l.title?.includes('Thạc sĩ')) return false;
    }
    // Lọc theo từ khóa tìm kiếm
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchName = l.full_name?.toLowerCase().includes(term);
      const matchCode = l.code?.toLowerCase().includes(term);
      const matchEmail = l.email?.toLowerCase().includes(term);
      const matchSpec = l.specialization?.toLowerCase().includes(term);
      return matchName || matchCode || matchEmail || matchSpec;
    }
    return true;
  });

  // Thống kê nhanh
  const totalLecturers = lecturers.length;
  const pgsCount = lecturers.filter(l => l.academic_rank?.includes('Phó Giáo sư') || l.academic_rank?.includes('Giáo sư')).length;
  const phdCount = lecturers.filter(l => l.title?.includes('Tiến sĩ')).length;
  const masterCount = lecturers.filter(l => l.title?.includes('Thạc sĩ') && !l.title?.includes('Tiến sĩ')).length;

  const columns = [
    {
      title: 'Mã GV',
      dataIndex: 'code',
      key: 'code',
      width: 100,
      render: (code) => <Tag color="blue" style={{ fontWeight: 700 }}>{code}</Tag>
    },
    {
      title: 'Thông Tin Giảng Viên',
      key: 'name_info',
      render: (_, r) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar
            style={{
              backgroundColor: r.academic_rank?.includes('Giáo sư') ? '#fa8c16' : r.title?.includes('Tiến sĩ') ? '#722ed1' : '#1677ff',
              fontWeight: 700
            }}
          >
            {r.full_name?.split(' ').pop()?.charAt(0) || 'G'}
          </Avatar>
          <div>
            <div style={{ fontWeight: 700, color: '#1e293b', fontSize: 13 }}>
              {r.full_name}
            </div>
            <div style={{ fontSize: 11, color: '#64748b' }}>
              {r.gender} • Sinh ngày: {r.birth_date}
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Học Hàm / Học Vị',
      key: 'academic_degree',
      width: 160,
      render: (_, r) => (
        <div>
          {r.academic_rank && r.academic_rank !== 'Không' && (
            <Tag color="orange" style={{ fontWeight: 700, marginBottom: 2 }}>{r.academic_rank}</Tag>
          )}
          <div><Tag color="purple">{r.title}</Tag></div>
        </div>
      )
    },
    {
      title: 'Khoa & Bộ Môn',
      key: 'faculty_dept',
      render: (_, r) => (
        <div>
          <div style={{ fontWeight: 600, color: '#0958d9', fontSize: 12 }}>{r.faculty_name}</div>
          <div style={{ fontSize: 11, color: '#64748b' }}>{r.department}</div>
        </div>
      )
    },
    {
      title: 'Chuyên Môn & Thâm Niên',
      key: 'specialization',
      render: (_, r) => (
        <div>
          <div style={{ fontWeight: 600, color: '#334155', fontSize: 12 }}>{r.specialization}</div>
          <div style={{ fontSize: 11, color: '#16a34a' }}>
            <StarOutlined /> {r.experience_years} năm giảng dạy
          </div>
        </div>
      )
    },
    {
      title: 'Liên Hệ',
      key: 'contact',
      width: 180,
      render: (_, r) => (
        <div style={{ fontSize: 11, color: '#475569' }}>
          <div><MailOutlined /> {r.email}</div>
          <div><PhoneOutlined /> {r.phone}</div>
        </div>
      )
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      align: 'center',
      render: (st) => (
        <Tag color="success" style={{ borderRadius: 10, padding: '1px 8px' }}>
          {st || 'Đang công tác'}
        </Tag>
      )
    },
    {
      title: 'Thao Tác',
      key: 'actions',
      width: 120,
      align: 'center',
      render: (_, r) => (
        <Space size={4}>
          <Tooltip title="Xem chi tiết hồ sơ chuyên môn">
            <Button
              type="text"
              icon={<EyeOutlined style={{ color: '#08979c' }} />}
              onClick={() => { setViewingLecturer(r); setIsDetailDrawerOpen(true); }}
            />
          </Tooltip>
          <Tooltip title="Sửa thông tin">
            <Button
              type="text"
              icon={<EditOutlined style={{ color: '#1677ff' }} />}
              onClick={() => {
                setEditingLecturer(r);
                form.setFieldsValue({
                  ...r,
                  assigned_courses: r.assigned_courses || []
                });
                setIsModalOpen(true);
              }}
            />
          </Tooltip>
          <Popconfirm
            title="Xác nhận xóa giảng viên?"
            description={`Bạn có chắc muốn xóa giảng viên "${r.full_name}"?`}
            onConfirm={() => handleDeleteLecturer(r.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div style={{ background: '#f8fafc', minHeight: '100%', padding: '0 0 20px' }}>
      {/* HEADER SECTION */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, padding: '16px 20px', marginBottom: 16 }}>
        <Row justify="space-between" align="middle" gutter={[12, 12]}>
          <Col xs={24} md={14}>
            <Title level={4} style={{ margin: 0, color: '#0958d9', display: 'flex', alignItems: 'center', gap: 8 }}>
              <SolutionOutlined /> Quản Lý Danh Sách Giảng Viên (Faculty & Lecturers)
            </Title>
            <Text type="secondary">
              Quản lý toàn diện thông tin lý lịch cá nhân và năng lực chuyên môn của đội ngũ giảng viên TCU chuẩn Bộ GD&ĐT
            </Text>
          </Col>
          <Col xs={24} md={10} style={{ textAlign: 'right' }}>
            <Space wrap>
              <Button icon={<ReloadOutlined />} onClick={fetchLecturers} loading={loading}>
                Làm mới
              </Button>
              <Button
                type="primary"
                icon={<FileExcelOutlined />}
                style={{ background: '#52c41a', borderColor: '#52c41a', fontWeight: 600 }}
                onClick={handleExportExcel}
              >
                Xuất Excel Danh Sách
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                style={{ background: '#1677ff', borderColor: '#1677ff', fontWeight: 600 }}
                onClick={() => {
                  setEditingLecturer(null);
                  form.resetFields();
                  setIsModalOpen(true);
                }}
              >
                Thêm Giảng Viên Mới
              </Button>
            </Space>
          </Col>
        </Row>

        {/* THỐNG KÊ NHANH */}
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col xs={12} sm={6}>
            <div style={{ background: '#e6f4ff', padding: '10px 14px', borderRadius: 8, border: '1px solid #91caff' }}>
              <Text type="secondary" style={{ fontSize: 11 }}>Tổng Giảng Viên Cơ Hữu</Text>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#0958d9' }}>{totalLecturers} Giảng viên</div>
            </div>
          </Col>
          <Col xs={12} sm={6}>
            <div style={{ background: '#fffbe6', padding: '10px 14px', borderRadius: 8, border: '1px solid #ffe58f' }}>
              <Text type="secondary" style={{ fontSize: 11 }}>Giáo Sư / Phó Giáo Sư</Text>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#d48806' }}>{pgsCount} GS/PGS</div>
            </div>
          </Col>
          <Col xs={12} sm={6}>
            <div style={{ background: '#f9f0ff', padding: '10px 14px', borderRadius: 8, border: '1px solid #d3adf7' }}>
              <Text type="secondary" style={{ fontSize: 11 }}>Trình Độ Tiến Sĩ</Text>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#722ed1' }}>{phdCount} Tiến sĩ</div>
            </div>
          </Col>
          <Col xs={12} sm={6}>
            <div style={{ background: '#f6ffed', padding: '10px 14px', borderRadius: 8, border: '1px solid #b7eb8f' }}>
              <Text type="secondary" style={{ fontSize: 11 }}>Trình Độ Thạc Sĩ</Text>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#389e0d' }}>{masterCount} Thạc sĩ</div>
            </div>
          </Col>
        </Row>
      </div>

      {/* MAIN TABLE CARD */}
      <Card bodyStyle={{ padding: 16 }} style={{ borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        {/* THANH LỌC & TÌM KIẾM */}
        <Row justify="space-between" align="middle" gutter={[12, 12]} style={{ marginBottom: 16 }}>
          <Col xs={24} md={14}>
            <Space wrap>
              <Input
                prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
                placeholder="Tìm tên, mã, email, chuyên môn..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ width: 260, borderRadius: 6 }}
                allowClear
              />
              <Select
                value={selectedFacultyFilter}
                onChange={setSelectedFacultyFilter}
                style={{ width: 220 }}
              >
                <Option value="ALL">Tất cả Khoa / Viện</Option>
                <Option value="CNTT">Khoa Công Nghệ Thông Tin</Option>
                <Option value="KT">Khoa Kinh Tế & QTKD</Option>
                <Option value="NN">Khoa Ngoại Ngữ</Option>
              </Select>
              <Select
                value={selectedTitleFilter}
                onChange={setSelectedTitleFilter}
                style={{ width: 160 }}
              >
                <Option value="ALL">Mọi học vị</Option>
                <Option value="PGS">Phó Giáo sư</Option>
                <Option value="TS">Tiến sĩ</Option>
                <Option value="ThS">Thạc sĩ</Option>
              </Select>
            </Space>
          </Col>
          <Col xs={24} md={10} style={{ textAlign: 'right' }}>
            <Tag color="blue" style={{ fontSize: 12, padding: '4px 10px', borderRadius: 4 }}>
              Hiển thị: <b>{filteredLecturers.length}</b> / {totalLecturers} giảng viên
            </Tag>
          </Col>
        </Row>

        {/* BẢNG DỮ LIỆU */}
        <Table
          dataSource={filteredLecturers}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 8, showTotal: (total) => `Tổng cộng ${total} giảng viên` }}
          size="middle"
          loading={loading}
        />
      </Card>

      {/* ===================== MODAL THÊM / SỬA GIẢNG VIÊN ===================== */}
      <Modal
        title={
          <span>
            <SolutionOutlined style={{ color: '#1677ff' }} />
            {editingLecturer ? ' Cập Nhật Hồ Sơ Giảng Viên' : ' Thêm Mới Giảng Viên Vào Hệ Thống'}
          </span>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        okText="Lưu Hồ Sơ"
        cancelText="Hủy"
        width={750}
      >
        <Form form={form} layout="vertical" onFinish={handleSaveLecturer}>
          <Divider orientation="left" style={{ margin: '8px 0 16px', fontSize: 13, color: '#0958d9' }}>
            1. THÔNG TIN CƠ BẢN (PERSONAL INFORMATION)
          </Divider>
          <Row gutter={12}>
            <Col span={8}>
              <Form.Item name="code" label="Mã Giảng Viên" rules={[{ required: true, message: 'Nhập mã GV' }]}>
                <Input placeholder="VD: GV008" />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item name="full_name" label="Họ và Tên" rules={[{ required: true, message: 'Nhập họ tên' }]}>
                <Input placeholder="VD: TS. Nguyễn Hoàng Giang" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="gender" label="Giới tính" initialValue="Nam">
                <Select>
                  <Option value="Nam">Nam</Option>
                  <Option value="Nữ">Nữ</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={12}>
            <Col span={8}>
              <Form.Item name="birth_date" label="Ngày sinh" initialValue="15/06/1985">
                <Input placeholder="DD/MM/YYYY" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true }]}>
                <Input placeholder="0912.xxx.xxx" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="email" label="Email công vụ" rules={[{ required: true, type: 'email' }]}>
                <Input placeholder="giangvien@techcorp.edu.vn" />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left" style={{ margin: '8px 0 16px', fontSize: 13, color: '#722ed1' }}>
            2. THÔNG TIN CHUYÊN MÔN & ĐƠN VỊ CÔNG TÁC
          </Divider>
          <Row gutter={12}>
            <Col span={8}>
              <Form.Item name="title" label="Học vị" initialValue="Tiến sĩ" rules={[{ required: true }]}>
                <Select>
                  <Option value="Tiến sĩ">Tiến sĩ</Option>
                  <Option value="Thạc sĩ">Thạc sĩ</Option>
                  <Option value="Kỹ sư">Kỹ sư</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="academic_rank" label="Học hàm" initialValue="Không">
                <Select>
                  <Option value="Không">Không</Option>
                  <Option value="Phó Giáo sư">Phó Giáo sư</Option>
                  <Option value="Giáo sư">Giáo sư</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="experience_years" label="Số năm kinh nghiệm" initialValue={8}>
                <InputNumber min={1} max={50} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="faculty_name" label="Khoa / Viện Đào Tạo" initialValue="Khoa Công Nghệ Thông Tin">
                <Select>
                  <Option value="Khoa Công Nghệ Thông Tin">Khoa Công Nghệ Thông Tin</Option>
                  <Option value="Khoa Kinh Tế & QTKD">Khoa Kinh Tế & QTKD</Option>
                  <Option value="Khoa Ngoại Ngữ">Khoa Ngoại Ngữ</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="department" label="Bộ Môn Trực Thuộc" initialValue="Bộ môn Kỹ thuật Phần mềm">
                <Input placeholder="VD: Bộ môn Kỹ thuật Phần mềm" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="specialization" label="Chuyên ngành chuyên môn" rules={[{ required: true }]}>
            <Input placeholder="VD: Trí tuệ Nhân tạo & Xử lý Dữ liệu lớn" />
          </Form.Item>

          <Form.Item name="research_interests" label="Hướng nghiên cứu khoa học">
            <TextArea rows={2} placeholder="VD: Multi-Agent Systems, Machine Learning, Computer Vision..." />
          </Form.Item>
        </Form>
      </Modal>

      {/* ===================== DRAWER CHI TIẾT HỒ SƠ GIẢNG VIÊN ===================== */}
      <Drawer
        title={<span><SolutionOutlined style={{ color: '#0958d9' }} /> Hồ Sơ Chuyên Môn Cán Bộ Giảng Viên</span>}
        placement="right"
        width={550}
        onClose={() => setIsDetailDrawerOpen(false)}
        open={isDetailDrawerOpen}
      >
        {viewingLecturer && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <Avatar size={72} style={{ backgroundColor: '#722ed1', fontSize: 28, fontWeight: 700 }}>
                {viewingLecturer.full_name?.split(' ').pop()?.charAt(0) || 'G'}
              </Avatar>
              <Title level={4} style={{ margin: '12px 0 4px', color: '#1e293b' }}>
                {viewingLecturer.full_name}
              </Title>
              <Space>
                {viewingLecturer.academic_rank && viewingLecturer.academic_rank !== 'Không' && (
                  <Tag color="orange" style={{ fontWeight: 700 }}>{viewingLecturer.academic_rank}</Tag>
                )}
                <Tag color="purple">{viewingLecturer.title}</Tag>
                <Tag color="success">{viewingLecturer.status || 'Đang công tác'}</Tag>
              </Space>
            </div>

            <Divider orientation="left" style={{ fontSize: 13, color: '#0958d9' }}>1. Thông Tin Cá Nhân</Divider>
            <div style={{ lineHeight: 2, fontSize: 13 }}>
              <div>• <b>Mã giảng viên:</b> <Tag color="blue">{viewingLecturer.code}</Tag></div>
              <div>• <b>Giới tính:</b> {viewingLecturer.gender || 'Nam'}</div>
              <div>• <b>Ngày sinh:</b> {viewingLecturer.birth_date}</div>
              <div>• <b>Email công vụ:</b> {viewingLecturer.email}</div>
              <div>• <b>Số điện thoại:</b> {viewingLecturer.phone}</div>
            </div>

            <Divider orientation="left" style={{ fontSize: 13, color: '#722ed1' }}>2. Năng Lực Chuyên Môn & Giảng Dạy</Divider>
            <div style={{ lineHeight: 2, fontSize: 13 }}>
              <div>• <b>Khoa trực thuộc:</b> {viewingLecturer.faculty_name}</div>
              <div>• <b>Bộ môn:</b> {viewingLecturer.department}</div>
              <div>• <b>Chuyên môn chính:</b> <b>{viewingLecturer.specialization}</b></div>
              <div>• <b>Thâm niên giảng dạy:</b> {viewingLecturer.experience_years} năm kinh nghiệm</div>
              <div>• <b>Hướng nghiên cứu:</b> {viewingLecturer.research_interests || 'Đang cập nhật'}</div>
            </div>

            <Divider orientation="left" style={{ fontSize: 13, color: '#16a34a' }}>3. Các Môn Học Đang Phụ Trách</Divider>
            <div>
              {(viewingLecturer.assigned_courses || ['Nhập môn Lập trình C/C++', 'Cơ sở Dữ liệu']).map((c, idx) => (
                <Tag key={idx} color="green" style={{ marginBottom: 6, padding: '4px 10px', fontSize: 12 }}>
                  <BookOutlined /> {c}
                </Tag>
              ))}
            </div>

            <div style={{ marginTop: 30, textAlign: 'center' }}>
              <Button type="primary" block onClick={() => setIsDetailDrawerOpen(false)}>
                Đóng Hồ Sơ
              </Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import {
  Card, Table, Tag, Button, Space, Typography, Row, Col,
  Modal, Form, Input, InputNumber, Select, message, Tabs,
  Popconfirm, Tooltip, Upload, Badge
} from 'antd';
import {
  BankOutlined, PlusOutlined, EditOutlined, DeleteOutlined,
  FileExcelOutlined, DownloadOutlined, UploadOutlined,
  SearchOutlined, ApartmentOutlined, FolderOutlined,
  CalendarOutlined, TeamOutlined, ReloadOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import apiClient from '../../services/apiClient';

const { Title, Text } = Typography;
const { Option } = Select;

export default function InstitutionalCatalogView() {
  const [activeTab, setActiveTab] = useState('FACULTIES');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Data state
  const [faculties, setFaculties] = useState([]);
  const [majors, setMajors] = useState([]);
  const [cohorts, setCohorts] = useState([]);
  const [classes, setClasses] = useState([]);

  // Modals state
  const [isFacultyModalOpen, setIsFacultyModalOpen] = useState(false);
  const [isMajorModalOpen, setIsMajorModalOpen] = useState(false);
  const [isCohortModalOpen, setIsCohortModalOpen] = useState(false);
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [facultyForm] = Form.useForm();
  const [majorForm] = Form.useForm();
  const [cohortForm] = Form.useForm();
  const [classForm] = Form.useForm();

  // Load catalogs data
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/academic/enterprise/catalogs/all');
      if (res && res.success && res.data) {
        setFaculties(res.data.faculties || []);
        setMajors(res.data.majors || []);
        setCohorts(res.data.cohorts || []);
        setClasses(res.data.classes || []);
      }
    } catch (e) {
      console.error('Lỗi tải danh mục:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Export Excel / CSV Helper
  const exportToExcel = (data, filename, headers) => {
    if (!data || data.length === 0) {
      message.warning('Không có dữ liệu để xuất file!');
      return;
    }
    const headerRow = headers.map(h => `"${h.title}"`).join(',');
    const rows = data.map(item =>
      headers.map(h => {
        const val = item[h.key] !== undefined && item[h.key] !== null ? String(item[h.key]).replace(/"/g, '""') : '';
        return `"${val}"`;
      }).join(',')
    );
    const csvContent = '\uFEFF' + [headerRow, ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    message.success(`Đã xuất dữ liệu ra file Excel / CSV: ${filename}.csv`);
  };

  // --- 1. CRUD KHOA / VIỆN ---
  const handleSaveFaculty = async (values) => {
    try {
      const payload = { ...values, id: editingItem?.id };
      await apiClient.post('/academic/enterprise/catalogs/faculties', payload);
      message.success(editingItem ? 'Cập nhật Khoa/Viện thành công!' : 'Thêm mới Khoa/Viện thành công!');
      setIsFacultyModalOpen(false);
      facultyForm.resetFields();
      setEditingItem(null);
      fetchData();
    } catch (e) {
      message.error(e.message || 'Lỗi lưu thông tin Khoa');
    }
  };

  const handleDeleteFaculty = async (id) => {
    try {
      await apiClient.delete(`/academic/enterprise/catalogs/faculties/${id}`);
      message.success('Đã xóa Khoa/Viện khỏi hệ thống!');
      fetchData();
    } catch (e) {
      message.error(e.message || 'Lỗi xóa Khoa');
    }
  };

  // --- 2. CRUD NGÀNH ĐÀO TẠO ---
  const handleSaveMajor = async (values) => {
    try {
      const selectedFac = faculties.find(f => f.code === values.faculty_id);
      const payload = {
        ...values,
        id: editingItem?.id,
        faculty_name: selectedFac ? selectedFac.name : 'Khoa Công Nghệ Thông Tin'
      };
      await apiClient.post('/academic/enterprise/catalogs/majors', payload);
      message.success(editingItem ? 'Cập nhật Ngành đào tạo thành công!' : 'Thêm mới Ngành đào tạo thành công!');
      setIsMajorModalOpen(false);
      majorForm.resetFields();
      setEditingItem(null);
      fetchData();
    } catch (e) {
      message.error(e.message || 'Lỗi lưu Ngành');
    }
  };

  const handleDeleteMajor = async (id) => {
    try {
      await apiClient.delete(`/academic/enterprise/catalogs/majors/${id}`);
      message.success('Đã xóa Ngành đào tạo khỏi hệ thống!');
      fetchData();
    } catch (e) {
      message.error(e.message || 'Lỗi xóa Ngành');
    }
  };

  // --- 3. CRUD KHÓA HỌC ---
  const handleSaveCohort = async (values) => {
    try {
      const payload = { ...values, id: editingItem?.id };
      await apiClient.post('/academic/enterprise/catalogs/cohorts', payload);
      message.success(editingItem ? 'Cập nhật Khóa học thành công!' : 'Thêm mới Khóa học thành công!');
      setIsCohortModalOpen(false);
      cohortForm.resetFields();
      setEditingItem(null);
      fetchData();
    } catch (e) {
      message.error(e.message || 'Lỗi lưu Khóa học');
    }
  };

  const handleDeleteCohort = async (id) => {
    try {
      await apiClient.delete(`/academic/enterprise/catalogs/cohorts/${id}`);
      message.success('Đã xóa Khóa học!');
      fetchData();
    } catch (e) {
      message.error(e.message || 'Lỗi xóa Khóa');
    }
  };

  // --- 4. CRUD LỚP HỌC ---
  const handleSaveClass = async (values) => {
    try {
      const selectedFac = faculties.find(f => f.code === values.faculty_id);
      const selectedMaj = majors.find(m => m.id === values.major_id || m.code === values.major_id);
      const payload = {
        ...values,
        id: editingItem?.id,
        faculty_name: selectedFac ? selectedFac.name : 'Khoa Công Nghệ Thông Tin',
        major_name: selectedMaj ? selectedMaj.name : 'Kỹ thuật Phần mềm'
      };
      await apiClient.post('/academic/enterprise/catalogs/classes', payload);
      message.success(editingItem ? 'Cập nhật Lớp học thành công!' : 'Thêm mới Lớp học thành công!');
      setIsClassModalOpen(false);
      classForm.resetFields();
      setEditingItem(null);
      fetchData();
    } catch (e) {
      message.error(e.message || 'Lỗi lưu Lớp học');
    }
  };

  const handleDeleteClass = async (id) => {
    try {
      await apiClient.delete(`/academic/enterprise/catalogs/classes/${id}`);
      message.success('Đã xóa Lớp học!');
      fetchData();
    } catch (e) {
      message.error(e.message || 'Lỗi xóa Lớp');
    }
  };

  // ===================== COLUMNS DEFINITIONS =====================
  // 1. Khoa
  const facultyColumns = [
    { title: 'Mã Khoa', dataIndex: 'code', key: 'code', width: 110, render: (c) => <Tag color="blue" style={{ fontWeight: 700 }}>{c}</Tag> },
    { title: 'Tên Khoa / Viện', dataIndex: 'name', key: 'name', render: (n) => <Text strong style={{ color: '#0958d9' }}>{n}</Text> },
    { title: 'Trưởng Khoa / Viện Trưởng', dataIndex: 'dean', key: 'dean', render: (d) => <b>{d}</b> },
    { title: 'Năm Thành Lập', dataIndex: 'established_year', key: 'established_year', width: 130, align: 'center' },
    { title: 'Điện Thoại', dataIndex: 'phone', key: 'phone', width: 140 },
    { title: 'Email Liên Hệ', dataIndex: 'email', key: 'email', width: 180 },
    { title: 'Số Ngành', dataIndex: 'majors_count', key: 'majors_count', width: 100, align: 'center', render: (cnt) => <Tag color="cyan">{cnt} Ngành</Tag> },
    { title: 'Trạng Thái', dataIndex: 'status', key: 'status', width: 120, align: 'center', render: (s) => <Tag color="success">{s}</Tag> },
    {
      title: 'Thao Tác', key: 'action', width: 110, align: 'center',
      render: (_, r) => (
        <Space size={4}>
          <Button type="text" icon={<EditOutlined style={{ color: '#1677ff' }} />} onClick={() => { setEditingItem(r); facultyForm.setFieldsValue(r); setIsFacultyModalOpen(true); }} />
          <Popconfirm title="Xóa Khoa/Viện?" description="Bạn có chắc muốn xóa?" onConfirm={() => handleDeleteFaculty(r.id)} okText="Xóa" cancelText="Hủy" okButtonProps={{ danger: true }}>
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  // 2. Ngành
  const majorColumns = [
    { title: 'Mã Ngành', dataIndex: 'code', key: 'code', width: 110, render: (c) => <Tag color="purple" style={{ fontWeight: 700 }}>{c}</Tag> },
    { title: 'Tên Ngành / Chuyên Ngành', dataIndex: 'name', key: 'name', render: (n) => <Text strong>{n}</Text> },
    { title: 'Khoa Trực Thuộc', dataIndex: 'faculty_name', key: 'faculty_name', render: (fn) => <Tag color="blue">{fn}</Tag> },
    { title: 'Bậc Đào Tạo', dataIndex: 'degree_level', key: 'degree_level', width: 150, align: 'center', render: (d) => <Tag color="geekblue">{d}</Tag> },
    { title: 'Thời Gian', dataIndex: 'duration_years', key: 'duration_years', width: 110, align: 'center' },
    { title: 'Tín Chỉ Chuẩn', dataIndex: 'required_credits', key: 'required_credits', width: 120, align: 'center', render: (cr) => <b>{cr} TC</b> },
    { title: 'Trạng Thái', dataIndex: 'status', key: 'status', width: 130, align: 'center', render: (s) => <Tag color="green">{s}</Tag> },
    {
      title: 'Thao Tác', key: 'action', width: 110, align: 'center',
      render: (_, r) => (
        <Space size={4}>
          <Button type="text" icon={<EditOutlined style={{ color: '#1677ff' }} />} onClick={() => { setEditingItem(r); majorForm.setFieldsValue(r); setIsMajorModalOpen(true); }} />
          <Popconfirm title="Xóa Ngành?" description="Bạn có chắc muốn xóa?" onConfirm={() => handleDeleteMajor(r.id)} okText="Xóa" cancelText="Hủy" okButtonProps={{ danger: true }}>
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  // 3. Khóa học
  const cohortColumns = [
    { title: 'Mã Khóa', dataIndex: 'cohort_code', key: 'cohort_code', width: 110, align: 'center', render: (c) => <Tag color="gold" style={{ fontWeight: 700, fontSize: 13 }}>{c}</Tag> },
    { title: 'Tên Khóa Đào Tạo', dataIndex: 'cohort_name', key: 'cohort_name', render: (n) => <Text strong>{n}</Text> },
    { title: 'Niên Khóa', key: 'years', width: 140, align: 'center', render: (_, r) => <span>{r.start_year} - {r.end_year}</span> },
    { title: 'Hệ Đào Tạo', dataIndex: 'training_system', key: 'training_system', width: 160, align: 'center', render: (s) => <Tag color="cyan">{s}</Tag> },
    { title: 'Sĩ Số Toàn Khóa', dataIndex: 'total_students', key: 'total_students', width: 140, align: 'center', render: (st) => <b>{st} Sinh viên</b> },
    { title: 'Tình Trạng', dataIndex: 'status', key: 'status', width: 180, align: 'center', render: (st) => <Tag color="blue">{st}</Tag> },
    {
      title: 'Thao Tác', key: 'action', width: 110, align: 'center',
      render: (_, r) => (
        <Space size={4}>
          <Button type="text" icon={<EditOutlined style={{ color: '#1677ff' }} />} onClick={() => { setEditingItem(r); cohortForm.setFieldsValue(r); setIsCohortModalOpen(true); }} />
          <Popconfirm title="Xóa Khóa?" description="Bạn có chắc muốn xóa?" onConfirm={() => handleDeleteCohort(r.id)} okText="Xóa" cancelText="Hủy" okButtonProps={{ danger: true }}>
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  // 4. Lớp học
  const classColumns = [
    { title: 'Mã Lớp', dataIndex: 'class_code', key: 'class_code', width: 120, render: (c) => <Tag color="orange" style={{ fontWeight: 700 }}>{c}</Tag> },
    { title: 'Tên Lớp Học Phần / Sinh Hoạt', dataIndex: 'class_name', key: 'class_name', render: (n) => <Text strong>{n}</Text> },
    { title: 'Khóa', dataIndex: 'cohort', key: 'cohort', width: 90, align: 'center', render: (c) => <Tag color="gold">{c}</Tag> },
    { title: 'Ngành Đào Tạo', dataIndex: 'major_name', key: 'major_name' },
    { title: 'Khoa Quản Lý', dataIndex: 'faculty_name', key: 'faculty_name' },
    { title: 'Sĩ Số', dataIndex: 'total_students', key: 'total_students', width: 100, align: 'center', render: (st) => <b>{st} SV</b> },
    { title: 'Cố Vấn Học Tập / GVCN', dataIndex: 'advisor', key: 'advisor', render: (a) => <span style={{ color: '#0958d9', fontWeight: 600 }}>{a}</span> },
    { title: 'Phòng Sinh Hoạt', dataIndex: 'room', key: 'room', width: 120, align: 'center' },
    {
      title: 'Thao Tác', key: 'action', width: 110, align: 'center',
      render: (_, r) => (
        <Space size={4}>
          <Button type="text" icon={<EditOutlined style={{ color: '#1677ff' }} />} onClick={() => { setEditingItem(r); classForm.setFieldsValue(r); setIsClassModalOpen(true); }} />
          <Popconfirm title="Xóa Lớp?" description="Bạn có chắc muốn xóa?" onConfirm={() => handleDeleteClass(r.id)} okText="Xóa" cancelText="Hủy" okButtonProps={{ danger: true }}>
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  // Filter items based on search term
  const filterList = (list, keys) => {
    if (!searchTerm) return list;
    const term = searchTerm.toLowerCase();
    return list.filter(item => keys.some(k => item[k] && String(item[k]).toLowerCase().includes(term)));
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100%', padding: '0 0 20px' }}>
      {/* HEADER SECTION */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, padding: '16px 20px', marginBottom: 16 }}>
        <Row justify="space-between" align="middle" gutter={[12, 12]}>
          <Col xs={24} md={14}>
            <Title level={4} style={{ margin: 0, color: '#0958d9', display: 'flex', alignItems: 'center', gap: 8 }}>
              <ApartmentOutlined /> Quản Lý Cơ Cấu Đào Tạo (Khoa, Ngành, Khóa, Lớp)
            </Title>
            <Text type="secondary">
              Quản trị toàn diện danh mục đơn vị cơ sở chuẩn quốc gia: Khoa/Viện • Ngành/Nghề đào tạo • Khóa sinh viên • Lớp học
            </Text>
          </Col>
          <Col xs={24} md={10} style={{ textAlign: 'right' }}>
            <Space wrap>
              <Button icon={<ReloadOutlined />} onClick={fetchData} loading={loading}>
                Làm mới
              </Button>
              <Button
                type="primary"
                icon={<FileExcelOutlined />}
                style={{ background: '#52c41a', borderColor: '#52c41a', fontWeight: 600 }}
                onClick={() => {
                  if (activeTab === 'FACULTIES') exportToExcel(faculties, 'Danh_Muc_Khoa_Vien', [{ key: 'code', title: 'Mã Khoa' }, { key: 'name', title: 'Tên Khoa' }, { key: 'dean', title: 'Trưởng Khoa' }, { key: 'phone', title: 'Điện Thoại' }, { key: 'email', title: 'Email' }]);
                  else if (activeTab === 'MAJORS') exportToExcel(majors, 'Danh_Muc_Nganh_Dao_Tao', [{ key: 'code', title: 'Mã Ngành' }, { key: 'name', title: 'Tên Ngành' }, { key: 'faculty_name', title: 'Khoa' }, { key: 'degree_level', title: 'Bậc' }, { key: 'required_credits', title: 'Tín Chỉ' }]);
                  else if (activeTab === 'COHORTS') exportToExcel(cohorts, 'Danh_Muc_Khoa_Hoc', [{ key: 'cohort_code', title: 'Mã Khóa' }, { key: 'cohort_name', title: 'Tên Khóa' }, { key: 'start_year', title: 'Năm Bắt Đầu' }, { key: 'end_year', title: 'Năm Tốt Nghiệp' }, { key: 'total_students', title: 'Sĩ Số' }]);
                  else exportToExcel(classes, 'Danh_Muc_Lop_Hoc', [{ key: 'class_code', title: 'Mã Lớp' }, { key: 'class_name', title: 'Tên Lớp' }, { key: 'cohort', title: 'Khóa' }, { key: 'major_name', title: 'Ngành' }, { key: 'advisor', title: 'Cố Vấn' }]);
                }}
              >
                Xuất Excel Chuẩn
              </Button>
            </Space>
          </Col>
        </Row>

        {/* THỐNG KÊ NHANH */}
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col xs={12} sm={6}>
            <div style={{ background: '#e6f4ff', padding: '10px 14px', borderRadius: 8, border: '1px solid #91caff' }}>
              <Text type="secondary" style={{ fontSize: 11 }}>Tổng Số Khoa/Viện</Text>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#0958d9' }}>{faculties.length} Khoa</div>
            </div>
          </Col>
          <Col xs={12} sm={6}>
            <div style={{ background: '#f9f0ff', padding: '10px 14px', borderRadius: 8, border: '1px solid #d3adf7' }}>
              <Text type="secondary" style={{ fontSize: 11 }}>Ngành & Nghề Đào Tạo</Text>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#722ed1' }}>{majors.length} Ngành</div>
            </div>
          </Col>
          <Col xs={12} sm={6}>
            <div style={{ background: '#fffbe6', padding: '10px 14px', borderRadius: 8, border: '1px solid #ffe58f' }}>
              <Text type="secondary" style={{ fontSize: 11 }}>Khóa Học Đang Quản Lý</Text>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#d48806' }}>{cohorts.length} Khóa</div>
            </div>
          </Col>
          <Col xs={12} sm={6}>
            <div style={{ background: '#f6ffed', padding: '10px 14px', borderRadius: 8, border: '1px solid #b7eb8f' }}>
              <Text type="secondary" style={{ fontSize: 11 }}>Lớp Sinh Hoạt / Chuyên Ngành</Text>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#389e0d' }}>{classes.length} Lớp</div>
            </div>
          </Col>
        </Row>
      </div>

      {/* MAIN CARD WITH TABS */}
      <Card bodyStyle={{ padding: 16 }} style={{ borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12}>
            <Input
              prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
              placeholder="Tìm kiếm mã, tên khoa, ngành, lớp, khóa..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ maxWidth: 320, borderRadius: 6 }}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} style={{ textAlign: 'right', marginTop: 8 }}>
            <Space wrap>
              {activeTab === 'FACULTIES' && (
                <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingItem(null); facultyForm.resetFields(); setIsFacultyModalOpen(true); }} style={{ fontWeight: 600 }}>
                  Thêm Khoa / Viện Mới
                </Button>
              )}
              {activeTab === 'MAJORS' && (
                <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingItem(null); majorForm.resetFields(); setIsMajorModalOpen(true); }} style={{ fontWeight: 600 }}>
                  Thêm Ngành Đào Tạo Mới
                </Button>
              )}
              {activeTab === 'COHORTS' && (
                <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingItem(null); cohortForm.resetFields(); setIsCohortModalOpen(true); }} style={{ fontWeight: 600 }}>
                  Thêm Khóa Học Mới
                </Button>
              )}
              {activeTab === 'CLASSES' && (
                <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingItem(null); classForm.resetFields(); setIsClassModalOpen(true); }} style={{ fontWeight: 600 }}>
                  Thêm Lớp Học Mới
                </Button>
              )}
            </Space>
          </Col>
        </Row>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          type="card"
          items={[
            {
              key: 'FACULTIES',
              label: <span><BankOutlined /> Danh Mục Khoa / Viện ({faculties.length})</span>,
              children: (
                <Table
                  dataSource={filterList(faculties, ['code', 'name', 'dean'])}
                  columns={facultyColumns}
                  rowKey="id"
                  pagination={{ pageSize: 8 }}
                  size="middle"
                  loading={loading}
                />
              )
            },
            {
              key: 'MAJORS',
              label: <span><FolderOutlined /> Danh Mục Ngành / Nghề ({majors.length})</span>,
              children: (
                <Table
                  dataSource={filterList(majors, ['code', 'name', 'faculty_name'])}
                  columns={majorColumns}
                  rowKey="id"
                  pagination={{ pageSize: 8 }}
                  size="middle"
                  loading={loading}
                />
              )
            },
            {
              key: 'COHORTS',
              label: <span><CalendarOutlined /> Danh Mục Khóa Học ({cohorts.length})</span>,
              children: (
                <Table
                  dataSource={filterList(cohorts, ['cohort_code', 'cohort_name'])}
                  columns={cohortColumns}
                  rowKey="id"
                  pagination={{ pageSize: 8 }}
                  size="middle"
                  loading={loading}
                />
              )
            },
            {
              key: 'CLASSES',
              label: <span><TeamOutlined /> Danh Mục Lớp Học ({classes.length})</span>,
              children: (
                <Table
                  dataSource={filterList(classes, ['class_code', 'class_name', 'major_name', 'advisor'])}
                  columns={classColumns}
                  rowKey="id"
                  pagination={{ pageSize: 8 }}
                  size="middle"
                  loading={loading}
                />
              )
            }
          ]}
        />
      </Card>

      {/* ===================== MODAL FORMS ===================== */}

      {/* MODAL 1: KHOA / VIỆN */}
      <Modal
        title={<span><BankOutlined style={{ color: '#1677ff' }} /> {editingItem ? 'Sửa Khoa / Viện' : 'Thêm Khoa / Viện Mới'}</span>}
        open={isFacultyModalOpen}
        onCancel={() => setIsFacultyModalOpen(false)}
        onOk={() => facultyForm.submit()}
        okText="Lưu Dữ Liệu"
        cancelText="Hủy"
      >
        <Form form={facultyForm} layout="vertical" onFinish={handleSaveFaculty}>
          <Row gutter={12}>
            <Col span={8}>
              <Form.Item name="code" label="Mã Khoa" rules={[{ required: true, message: 'Nhập mã khoa' }]}>
                <Input placeholder="VD: CNTT" />
              </Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item name="name" label="Tên Khoa / Viện" rules={[{ required: true, message: 'Nhập tên khoa' }]}>
                <Input placeholder="VD: Khoa Công Nghệ Thông Tin" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="dean" label="Trưởng Khoa / Viện Trưởng" rules={[{ required: true }]}>
            <Input placeholder="VD: PGS. TS. Trần Mạnh Tuấn" />
          </Form.Item>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="phone" label="Số điện thoại liên hệ">
                <Input placeholder="(024) 3754.xxxx" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="email" label="Email công vụ">
                <Input placeholder="khoa@techcorp.edu.vn" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="established_year" label="Năm thành lập" initialValue={2010}>
                <InputNumber min={1950} max={2030} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="status" label="Trạng thái" initialValue="Hoạt động">
                <Select>
                  <Option value="Hoạt động">Hoạt động</Option>
                  <Option value="Tạm dừng">Tạm dừng</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* MODAL 2: NGÀNH ĐÀO TẠO */}
      <Modal
        title={<span><FolderOutlined style={{ color: '#722ed1' }} /> {editingItem ? 'Sửa Ngành Đào Tạo' : 'Thêm Ngành Đào Tạo Mới'}</span>}
        open={isMajorModalOpen}
        onCancel={() => setIsMajorModalOpen(false)}
        onOk={() => majorForm.submit()}
        okText="Lưu Dữ Liệu"
        cancelText="Hủy"
      >
        <Form form={majorForm} layout="vertical" onFinish={handleSaveMajor}>
          <Form.Item name="faculty_id" label="Khoa Trực Thuộc" rules={[{ required: true }]}>
            <Select placeholder="Chọn Khoa">
              {faculties.map(f => (
                <Option key={f.code} value={f.code}>{f.name} ({f.code})</Option>
              ))}
            </Select>
          </Form.Item>
          <Row gutter={12}>
            <Col span={10}>
              <Form.Item name="code" label="Mã Ngành (Bộ GD&ĐT)" rules={[{ required: true }]}>
                <Input placeholder="VD: 7480103" />
              </Form.Item>
            </Col>
            <Col span={14}>
              <Form.Item name="name" label="Tên Ngành / Nghề Đào Tạo" rules={[{ required: true }]}>
                <Input placeholder="VD: Kỹ thuật Phần mềm" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={8}>
              <Form.Item name="degree_level" label="Bậc đào tạo" initialValue="Đại học Chính quy">
                <Select>
                  <Option value="Đại học Chính quy">Đại học Chính quy</Option>
                  <Option value="Đại học Kỹ sư">Đại học Kỹ sư</Option>
                  <Option value="Thạc sĩ">Thạc sĩ</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="duration_years" label="Thời gian" initialValue="4.0 Năm">
                <Select>
                  <Option value="4.0 Năm">4.0 Năm</Option>
                  <Option value="4.5 Năm">4.5 Năm</Option>
                  <Option value="5.0 Năm">5.0 Năm</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="required_credits" label="Số tín chỉ" initialValue={135} rules={[{ required: true }]}>
                <InputNumber min={60} max={250} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* MODAL 3: KHÓA HỌC */}
      <Modal
        title={<span><CalendarOutlined style={{ color: '#d48806' }} /> {editingItem ? 'Sửa Khóa Học' : 'Thêm Khóa Học Mới'}</span>}
        open={isCohortModalOpen}
        onCancel={() => setIsCohortModalOpen(false)}
        onOk={() => cohortForm.submit()}
        okText="Lưu Dữ Liệu"
        cancelText="Hủy"
      >
        <Form form={cohortForm} layout="vertical" onFinish={handleSaveCohort}>
          <Row gutter={12}>
            <Col span={8}>
              <Form.Item name="cohort_code" label="Mã Khóa" rules={[{ required: true }]}>
                <Input placeholder="VD: K68" />
              </Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item name="cohort_name" label="Tên Khóa Học" rules={[{ required: true }]}>
                <Input placeholder="VD: Khóa 68 (2024 - 2028)" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={8}>
              <Form.Item name="start_year" label="Năm bắt đầu" initialValue={2024} rules={[{ required: true }]}>
                <InputNumber min={2000} max={2035} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="end_year" label="Năm tốt nghiệp" initialValue={2028} rules={[{ required: true }]}>
                <InputNumber min={2000} max={2035} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="total_students" label="Sĩ số toàn khóa" initialValue={800}>
                <InputNumber min={1} max={5000} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="training_system" label="Quy chế đào tạo" initialValue="Hệ Tín chỉ (TT 08)">
            <Select>
              <Option value="Hệ Tín chỉ (TT 08)">Hệ Tín chỉ (TT 08)</Option>
              <Option value="Hệ Niên chế">Hệ Niên chế</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* MODAL 4: LỚP HỌC */}
      <Modal
        title={<span><TeamOutlined style={{ color: '#fa8c16' }} /> {editingItem ? 'Sửa Lớp Học' : 'Thêm Lớp Học Mới'}</span>}
        open={isClassModalOpen}
        onCancel={() => setIsClassModalOpen(false)}
        onOk={() => classForm.submit()}
        okText="Lưu Dữ Liệu"
        cancelText="Hủy"
      >
        <Form form={classForm} layout="vertical" onFinish={handleSaveClass}>
          <Row gutter={12}>
            <Col span={10}>
              <Form.Item name="class_code" label="Mã Lớp" rules={[{ required: true }]}>
                <Input placeholder="VD: 68.KHMT-1" />
              </Form.Item>
            </Col>
            <Col span={14}>
              <Form.Item name="class_name" label="Tên Lớp Học Phần / Sinh Hoạt" rules={[{ required: true }]}>
                <Input placeholder="VD: Lớp 68.KHMT-1" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="faculty_id" label="Khoa Quản Lý" rules={[{ required: true }]}>
                <Select placeholder="Chọn Khoa">
                  {faculties.map(f => (
                    <Option key={f.code} value={f.code}>{f.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="cohort" label="Khóa Học" rules={[{ required: true }]}>
                <Select placeholder="Chọn Khóa">
                  {cohorts.map(c => (
                    <Option key={c.cohort_code} value={c.cohort_code}>{c.cohort_code} ({c.cohort_name})</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={14}>
              <Form.Item name="advisor" label="Cố Vấn Học Tập / GVCN">
                <Input placeholder="VD: TS. Hoàng Đức Em" />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item name="total_students" label="Sĩ số lớp" initialValue={40}>
                <InputNumber min={1} max={120} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}

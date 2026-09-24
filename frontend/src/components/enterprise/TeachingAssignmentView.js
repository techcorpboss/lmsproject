import React, { useState, useEffect } from 'react';
import {
  Card, Table, Tag, Button, Space, Typography, Row, Col, Select,
  Modal, Form, Input, message, Badge, Tooltip, Tabs, Alert, Divider
} from 'antd';
import {
  ApartmentOutlined, TeamOutlined, UserOutlined, PlusOutlined,
  ReloadOutlined, BookOutlined, CheckCircleOutlined, AuditOutlined,
  CalendarOutlined, SolutionOutlined, ReadOutlined
} from '@ant-design/icons';
import apiClient from '../../services/apiClient';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

export default function TeachingAssignmentView({ currentUser }) {
  const [activeTab, setActiveTab] = useState('assignments');
  const [assignments, setAssignments] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [coursesCatalog, setCoursesCatalog] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State cho Form phân công liên hoàn
  const [selectedFaculty, setSelectedFaculty] = useState('CNTT');
  const [selectedMajor, setSelectedMajor] = useState('CNPM');
  const [selectedSemester, setSelectedSemester] = useState(1);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Phân công hiện hành
      const resHierarchy = await apiClient.get('/academic/enterprise/hierarchy');
      if (resHierarchy?.success) setAssignments(resHierarchy.data.assignments || []);

      // 2. Danh mục Giảng viên
      const resLecturers = await apiClient.get('/academic/enterprise/lecturers');
      if (resLecturers?.success) setLecturers(resLecturers.data || []);

      // 3. Danh mục Lớp học
      const resClasses = await apiClient.get('/academic/enterprise/classes');
      if (resClasses?.success) setClasses(resClasses.data || []);

      // 4. Danh mục Môn học theo Khoa/Ngành/Kỳ
      const resCourses = await apiClient.get('/academic/enterprise/courses-catalog');
      if (resCourses?.success) setCoursesCatalog(resCourses.data || []);
    } catch (e) {
      console.warn('Fallback data for teaching assignment');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Lọc môn học theo Khoa, Ngành và Học kỳ đang chọn
  const availableCourses = coursesCatalog.filter(
    c => c.faculty_id === selectedFaculty && c.major_id === selectedMajor && Number(c.semester) === Number(selectedSemester)
  );

  // Lọc lớp học theo Ngành
  const availableClasses = classes.filter(
    cl => cl.faculty_id === selectedFaculty && cl.major_id === selectedMajor
  );

  // Lọc giảng viên theo Khoa
  const availableLecturers = lecturers.filter(
    l => l.faculty_id === selectedFaculty || selectedFaculty === 'ALL'
  );

  // Khi người dùng click chọn môn học từ danh mục môn học
  const handleSelectCourse = (courseCode) => {
    const found = availableCourses.find(c => c.code === courseCode);
    if (found) {
      setSelectedCourse(found);
      form.setFieldsValue({
        course_code: found.code,
        course_name: found.name,
        credits: found.credits,
        knowledge_block: found.knowledge_block,
        prerequisites: found.prerequisites
      });
    }
  };

  const handleSaveAssignment = async (values) => {
    try {
      const res = await apiClient.post('/academic/enterprise/assignments', values);
      if (res?.success) {
        message.success(res.message || 'Phân công giảng viên thành công!');
        setIsModalOpen(false);
        form.resetFields();
        setSelectedCourse(null);
        fetchData();
      }
    } catch (e) {
      message.error(e.message || 'Lỗi khi lưu phân công giảng dạy');
    }
  };

  // CỘT BẢNG PHÂN CÔNG GIẢNG DẠY
  const assignmentColumns = [
    {
      title: 'Giảng Viên Phụ Trách',
      dataIndex: 'lecturer_name',
      key: 'lecturer_name',
      render: (name, r) => (
        <Space>
          <UserOutlined style={{ color: '#1677ff', fontSize: 16 }} />
          <div>
            <Text strong style={{ fontSize: 13 }}>{name}</Text>
            <div style={{ fontSize: 11, color: '#64748b' }}>Tài khoản LMS: <code>{r.lecturer_username}</code></div>
          </div>
        </Space>
      )
    },
    {
      title: 'Môn Học & Mã HP',
      dataIndex: 'course_name',
      key: 'course_name',
      render: (cname, r) => (
        <div>
          <Tag color="blue" style={{ fontWeight: 600 }}>{r.course_code}</Tag>
          <Text strong>{cname}</Text>
          <div style={{ fontSize: 11, color: '#64748b' }}>Ngành: {r.major_name || 'Kỹ thuật Phần mềm'}</div>
        </div>
      )
    },
    {
      title: 'Lớp Học Phần & Khóa',
      dataIndex: 'class_name',
      key: 'class_name',
      render: (cls, r) => (
        <Space wrap>
          <Tag color="geekblue" style={{ fontWeight: 600 }}>{cls}</Tag>
          <Tag color="purple">{r.cohort || 'K66'}</Tag>
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
      title: 'Quyền Hạn LMS Của Giảng Viên',
      key: 'permissions',
      render: () => (
        <Space wrap>
          <Tag color="green">✓ Soạn 15 Tuần</Tag>
          <Tag color="orange">✓ Quản lý Sổ Điểm</Tag>
          <Tag color="purple">✓ Ngân Hàng Đề Thi</Tag>
        </Space>
      )
    },
    {
      title: 'Trạng Thái',
      key: 'status',
      render: () => <Badge status="success" text="Đang Phụ Trách" />
    }
  ];

  // CỘT BẢNG DANH MỤC GIẢNG VIÊN
  const lecturerColumns = [
    { title: 'MSGV', dataIndex: 'code', key: 'code', width: 90, render: (c) => <Text strong>{c}</Text> },
    {
      title: 'Họ và Tên Giảng Viên',
      dataIndex: 'full_name',
      key: 'full_name',
      render: (name, r) => (
        <div>
          <Text strong>{r.title} {name}</Text>
          <div style={{ fontSize: 11, color: '#64748b' }}>Email: {r.email} • ĐT: {r.phone}</div>
        </div>
      )
    },
    { title: 'Khoa Đào Tạo', dataIndex: 'faculty_name', key: 'faculty_name' },
    { title: 'Bộ Môn Trực Thuộc', dataIndex: 'department', key: 'department' },
    {
      title: 'Tài Khoản Đăng Nhập',
      dataIndex: 'username',
      key: 'username',
      render: (u) => <code>{u}</code>
    },
    {
      title: 'Số Môn Phụ Trách',
      dataIndex: 'active_courses_count',
      key: 'active_courses_count',
      render: (cnt) => <Tag color="blue">{cnt} Lớp HP</Tag>
    }
  ];

  // CỘT BẢNG DANH MỤC LỚP HỌC
  const classColumns = [
    { title: 'Mã Lớp', dataIndex: 'class_code', key: 'class_code', width: 120, render: (c) => <Tag color="geekblue">{c}</Tag> },
    { title: 'Tên Lớp Hành Chính', dataIndex: 'class_name', key: 'class_name', render: (n) => <Text strong>{n}</Text> },
    { title: 'Khóa Đào Tạo', dataIndex: 'cohort', key: 'cohort', width: 90, render: (ch) => <Tag color="purple">{ch}</Tag> },
    { title: 'Chuyên Ngành', dataIndex: 'major_name', key: 'major_name' },
    { title: 'Sĩ Số Sinh Viên', dataIndex: 'total_students', key: 'total_students', width: 130, render: (s) => <b>{s} Học viên</b> },
    { title: 'Cố Vấn Học Tập / GVCN', dataIndex: 'advisor', key: 'advisor', render: (a) => <Text style={{ color: '#1677ff' }}>{a}</Text> }
  ];

  // CỘT BẢNG DANH MỤC MÔN HỌC THEO HỌC KỲ
  const courseCatalogColumns = [
    { title: 'Mã HP', dataIndex: 'code', key: 'code', width: 110, render: (c) => <Tag color="blue" style={{ fontWeight: 600 }}>{c}</Tag> },
    { title: 'Tên Môn Học', dataIndex: 'name', key: 'name', render: (n) => <Text strong>{n}</Text> },
    { title: 'Số Tín Chỉ', dataIndex: 'credits', key: 'credits', width: 110, render: (cr, r) => <span><b>{cr} TC</b> ({r.theory_hours}LT/{r.practice_hours}TH)</span> },
    { title: 'Học Kỳ', dataIndex: 'semester', key: 'semester', width: 90, render: (s) => <Tag color="cyan">Kỳ {s}</Tag> },
    { title: 'Khối Kiến Thức', dataIndex: 'knowledge_block', key: 'knowledge_block', width: 140 },
    { title: 'Học Phần Tiên Quyết', dataIndex: 'prerequisites', key: 'prerequisites', width: 140, render: (p) => p === 'Không' ? <Text type="secondary">Không có</Text> : <Tag color="volcano">{p}</Tag> }
  ];

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={4} style={{ margin: 0 }}>
            <ApartmentOutlined style={{ color: '#1677ff', marginRight: 8 }} />
            Quản Lý Phân Công Giảng Dạy & Danh Mục Cơ Sở Đào Tạo Đại Học
          </Title>
          <Text type="secondary">
            Phân bổ môn học theo Khoa &rarr; Ngành nghề &rarr; Khóa &rarr; Học kỳ &rarr; Lớp học phần &rarr; Giảng viên phụ trách
          </Text>
        </Col>
        <Col>
          <Space>
            <Button icon={<ReloadOutlined />} onClick={fetchData}>Làm mới</Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                form.resetFields();
                setSelectedCourse(null);
                setIsModalOpen(true);
              }}
              style={{ background: '#1677ff' }}
            >
              Phân Công Giảng Dạy Mới
            </Button>
          </Space>
        </Col>
      </Row>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        type="card"
        items={[
          {
            key: 'assignments',
            label: (
              <Space>
                <SolutionOutlined style={{ color: '#1677ff' }} />
                <span>Bảng Phân Công Giảng Dạy Hiện Hành ({assignments.length})</span>
              </Space>
            ),
            children: (
              <Table
                dataSource={assignments}
                columns={assignmentColumns}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 6 }}
              />
            )
          },
          {
            key: 'lecturers',
            label: (
              <Space>
                <UserOutlined style={{ color: '#52c41a' }} />
                <span>Danh Mục Giảng Viên ({lecturers.length})</span>
              </Space>
            ),
            children: (
              <Table
                dataSource={lecturers}
                columns={lecturerColumns}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 6 }}
              />
            )
          },
          {
            key: 'classes',
            label: (
              <Space>
                <TeamOutlined style={{ color: '#fa8c16' }} />
                <span>Danh Mục Lớp Học Phần ({classes.length})</span>
              </Space>
            ),
            children: (
              <Table
                dataSource={classes}
                columns={classColumns}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 6 }}
              />
            )
          },
          {
            key: 'courses',
            label: (
              <Space>
                <ReadOutlined style={{ color: '#722ed1' }} />
                <span>Danh Mục Môn Học Theo Học Kỳ ({coursesCatalog.length})</span>
              </Space>
            ),
            children: (
              <Table
                dataSource={coursesCatalog}
                columns={courseCatalogColumns}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 8 }}
              />
            )
          }
        ]}
      />

      {/* MODAL PHÂN CÔNG GIẢNG DẠY THÔNG MINH LIÊN HOÀN */}
      <Modal
        title={
          <Space>
            <ApartmentOutlined style={{ color: '#1677ff' }} />
            <span style={{ fontWeight: 700 }}>Phân Công Giảng Viên Phụ Trách Môn Học & Soạn Giảng LMS</span>
          </Space>
        }
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setSelectedCourse(null);
        }}
        onOk={() => form.submit()}
        okText="Lưu Phân Công"
        cancelText="Đóng"
        width={720}
      >
        <Alert
          message="Hướng dẫn chọn liên hoàn theo chương trình đào tạo"
          description="Chọn Khoa, Ngành và Học kỳ. Hệ thống sẽ tự động lọc danh sách môn học và lớp tương ứng. Khi chọn môn, toàn bộ thông tin mã môn, tên môn và số tín chỉ sẽ được tự động điền."
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />

        <Form form={form} layout="vertical" onFinish={handleSaveAssignment}>
          {/* HÀNG 1: BỘ LỌC KHOA, NGÀNH & HỌC KỲ */}
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="1. Khoa Đào tạo" required>
                <Select value={selectedFaculty} onChange={(val) => { setSelectedFaculty(val); setSelectedCourse(null); }}>
                  <Option value="CNTT">Khoa Công Nghệ Thông Tin</Option>
                  <Option value="KT">Khoa Kinh Tế & QTKD</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="2. Ngành nghề đào tạo" required>
                <Select value={selectedMajor} onChange={(val) => { setSelectedMajor(val); setSelectedCourse(null); }}>
                  {selectedFaculty === 'CNTT' ? (
                    <>
                      <Option value="CNPM">Kỹ thuật Phần mềm (CNPM)</Option>
                      <Option value="HTTT">Hệ thống Thông tin (HTTT)</Option>
                      <Option value="KHMT">Khoa học Máy tính (KHMT)</Option>
                    </>
                  ) : (
                    <Option value="QTKD">Quản trị Kinh doanh (QTKD)</Option>
                  )}
                </Select>
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="3. Học kỳ đào tạo" required>
                <Select value={selectedSemester} onChange={(val) => { setSelectedSemester(val); setSelectedCourse(null); }}>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                    <Option key={s} value={s}>Học kỳ {s}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Divider style={{ margin: '8px 0 16px' }} />

          {/* HÀNG 2: CHỌN MÔN HỌC TỪ DANH MỤC ĐÃ LỌC */}
          <Form.Item
            name="course_code"
            label="4. Chọn Môn Học (Tải từ Danh Mục Môn của Ngành & Học Kỳ đã chọn)"
            rules={[{ required: true, message: 'Vui lòng chọn môn học' }]}
          >
            <Select
              placeholder="-- Bấm vào đây để chọn môn học từ danh mục --"
              onChange={handleSelectCourse}
              style={{ width: '100%' }}
            >
              {availableCourses.map(c => (
                <Option key={c.code} value={c.code}>
                  <b>[{c.code}]</b> {c.name} — <b>{c.credits} Tín chỉ</b> ({c.theory_hours}LT/{c.practice_hours}TH)
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* THẺ HIỂN THỊ TỰ ĐỘNG THÔNG TIN MÔN HỌC ĐÃ CHỌN */}
          {selectedCourse && (
            <div style={{ background: '#f0fdf4', padding: '10px 14px', borderRadius: 8, border: '1px solid #bbf7d0', marginBottom: 16 }}>
              <Row gutter={16}>
                <Col span={14}>
                  <Text strong style={{ color: '#166534' }}>✓ Đã chọn môn: {selectedCourse.name} ({selectedCourse.code})</Text>
                  <div style={{ fontSize: 12, color: '#15803d' }}>
                    Khối kiến thức: <b>{selectedCourse.knowledge_block}</b> • Tiên quyết: <b>{selectedCourse.prerequisites}</b>
                  </div>
                </Col>
                <Col span={10} style={{ textAlign: 'right' }}>
                  <Tag color="green" style={{ fontSize: 13, padding: '2px 8px' }}>{selectedCourse.credits} Tín Chỉ</Tag>
                  <Tag color="cyan">{selectedCourse.theory_hours} tiết LT</Tag>
                  <Tag color="purple">{selectedCourse.practice_hours} tiết TH</Tag>
                </Col>
              </Row>
            </div>
          )}

          {/* HÀNG 3: CHỌN LỚP HỌC PHẦN & GIẢNG VIÊN PHỤ TRÁCH */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="class_name"
                label="5. Chọn Lớp Học Phần (Tải từ Danh Mục Lớp)"
                rules={[{ required: true, message: 'Vui lòng chọn lớp học phần' }]}
              >
                <Select placeholder="Chọn lớp học phần">
                  {availableClasses.map(cl => (
                    <Option key={cl.class_name} value={cl.class_name}>
                      <b>{cl.class_name}</b> ({cl.cohort} - Sĩ số: {cl.total_students} SV)
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="lecturer_id"
                label="6. Giảng Viên Phụ Trách (Tải từ Danh Mục Giảng Viên)"
                rules={[{ required: true, message: 'Vui lòng chọn giảng viên phụ trách' }]}
              >
                <Select placeholder="Chọn giảng viên bộ môn">
                  {availableLecturers.map(l => (
                    <Option key={l.id} value={l.id}>
                      <b>{l.title} {l.full_name}</b> ({l.department})
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="semester" label="Năm học & Học kỳ chính thức" initialValue="Học kỳ 1 (2026-2027)">
                <Select>
                  <Option value="Học kỳ 1 (2026-2027)">Học kỳ 1 (2026-2027)</Option>
                  <Option value="Học kỳ 2 (2026-2027)">Học kỳ 2 (2026-2027)</Option>
                  <Option value="Học kỳ Hè (2026-2027)">Học kỳ Hè (2026-2027)</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Quyền hạn trên LMS">
                <Tag color="green">✓ Soạn 15 Tuần</Tag>
                <Tag color="blue">✓ Chấm điểm sổ gốc</Tag>
                <Tag color="purple">✓ Ngân hàng đề thi</Tag>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}

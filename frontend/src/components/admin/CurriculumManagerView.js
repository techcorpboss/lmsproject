import React, { useState, useEffect } from 'react';
import {
  Card, Table, Tag, Button, Space, Typography, Row, Col, Collapse,
  Modal, Form, Input, InputNumber, Select, message, Tooltip, Badge
} from 'antd';
import {
  BookOutlined, PlusOutlined, EditOutlined, ReloadOutlined,
  BranchesOutlined, CheckCircleOutlined, ApartmentOutlined
} from '@ant-design/icons';
import apiClient from '../../services/apiClient';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;
const { Option } = Select;

export default function CurriculumManagerView() {
  const [curriculum, setCurriculum] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBlockId, setSelectedBlockId] = useState('CSN');
  const [form] = Form.useForm();

  const fetchCurriculum = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/admin/curriculum');
      if (res && res.success) {
        setCurriculum(res.data);
      }
    } catch (e) {
      setCurriculum([
        {
          block_id: 'GDDC',
          block_name: 'I. Khối Kiến Thức Giáo Dục Đại Cương (32 Tín chỉ)',
          courses: [
            { id: 101, code: 'MATH101', name: 'Toán Cao Cấp 1 (Giải tích)', credits: 3, theory_hours: 30, practice_hours: 30, semester: 1, prerequisites: 'Không', is_compulsory: true },
            { id: 102, code: 'MATH102', name: 'Đại Số Tuyến Tính & Hình Học Giải Tích', credits: 3, theory_hours: 30, practice_hours: 30, semester: 1, prerequisites: 'Không', is_compulsory: true },
            { id: 103, code: 'ENG101', name: 'Tiếng Anh Học Thuật 1 (General English B1)', credits: 4, theory_hours: 40, practice_hours: 40, semester: 1, prerequisites: 'Không', is_compulsory: true },
            { id: 104, code: 'PHYS101', name: 'Vật Lý Đại Cương & Thí Nghiệm', credits: 3, theory_hours: 30, practice_hours: 30, semester: 2, prerequisites: 'MATH101', is_compulsory: true }
          ]
        },
        {
          block_id: 'CSN',
          block_name: 'II. Khối Kiến Thức Cơ Sở Ngành (45 Tín chỉ)',
          courses: [
            { id: 201, code: 'IT101', name: 'Nhập Môn Lập Trình C/C++', credits: 4, theory_hours: 30, practice_hours: 60, semester: 1, prerequisites: 'Không', is_compulsory: true },
            { id: 202, code: 'IT201', name: 'Cơ Sở Dữ Liệu (Database Systems)', credits: 3, theory_hours: 30, practice_hours: 30, semester: 2, prerequisites: 'IT101', is_compulsory: true },
            { id: 203, code: 'IT301', name: 'Cấu Trúc Dữ Liệu & Giải Thuật (Data Structures)', credits: 3, theory_hours: 30, practice_hours: 30, semester: 2, prerequisites: 'IT101', is_compulsory: true },
            { id: 204, code: 'IT302', name: 'Kiến Trúc Máy Tính & Hợp Ngữ', credits: 3, theory_hours: 30, practice_hours: 30, semester: 3, prerequisites: 'IT101', is_compulsory: true },
            { id: 205, code: 'IT401', name: 'Mạng Máy Tính & Truyền Số Liệu', credits: 3, theory_hours: 30, practice_hours: 30, semester: 3, prerequisites: 'Không', is_compulsory: true }
          ]
        },
        {
          block_id: 'CN',
          block_name: 'III. Khối Kiến Thức Chuyên Ngành & Tốt Nghiệp (55 Tín chỉ)',
          courses: [
            { id: 301, code: 'SE301', name: 'Công Nghệ Phần Mềm (Software Engineering)', credits: 3, theory_hours: 30, practice_hours: 30, semester: 4, prerequisites: 'IT301', is_compulsory: true },
            { id: 302, code: 'SE302', name: 'Lập Trình Hướng Đối Tượng Nâng Cao (OOP Java/C#)', credits: 4, theory_hours: 30, practice_hours: 60, semester: 4, prerequisites: 'IT101', is_compulsory: true },
            { id: 303, code: 'SE401', name: 'Phát Triển Ứng Dụng Web Fullstack (MERN/NestJS)', credits: 4, theory_hours: 30, practice_hours: 60, semester: 5, prerequisites: 'IT201', is_compulsory: true },
            { id: 304, code: 'SE405', name: 'Kiến Trúc & Bảo Mật Hệ Thống Đám Mây (Cloud & DevOps)', credits: 3, theory_hours: 30, practice_hours: 30, semester: 6, prerequisites: 'IT401', is_compulsory: true },
            { id: 305, code: 'GRAD501', name: 'Đồ Án Tốt Nghiệp / Khóa Luận Cử Nhân', credits: 10, theory_hours: 0, practice_hours: 300, semester: 8, prerequisites: 'Đạt >= 120 Tín chỉ', is_compulsory: true }
          ]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurriculum();
  }, []);

  const handleSaveCourse = async (values) => {
    try {
      await apiClient.post('/admin/curriculum/course', {
        block_id: selectedBlockId,
        course: values
      });
      message.success('Cập nhật học phần trong khung chương trình thành công!');
      setIsModalOpen(false);
      form.resetFields();
      fetchCurriculum();
    } catch (e) {
      message.error(e.message || 'Lỗi lưu học phần');
    }
  };

  const courseColumns = [
    {
      title: 'Mã HP',
      dataIndex: 'code',
      key: 'code',
      width: 110,
      render: (c) => <Tag color="blue" style={{ fontWeight: 600 }}>{c}</Tag>
    },
    {
      title: 'Tên Học Phần Đào Tạo',
      dataIndex: 'name',
      key: 'name',
      render: (name) => <Text strong>{name}</Text>
    },
    {
      title: 'Số Tín Chỉ',
      dataIndex: 'credits',
      key: 'credits',
      width: 100,
      render: (cr, r) => (
        <span>
          <b>{cr} TC</b> <span style={{ fontSize: 11, color: '#64748b' }}>({r.theory_hours}LT/{r.practice_hours}TH)</span>
        </span>
      )
    },
    {
      title: 'Học Kỳ Dự Kiến',
      dataIndex: 'semester',
      key: 'semester',
      width: 130,
      render: (sem) => <Tag color="cyan">Học kỳ {sem}</Tag>
    },
    {
      title: 'Học Phần Tiên Quyết',
      dataIndex: 'prerequisites',
      key: 'prerequisites',
      width: 160,
      render: (pr) => pr === 'Không' ? <Text type="secondary">Không có</Text> : <Tag color="volcano">{pr}</Tag>
    },
    {
      title: 'Tính Chất',
      dataIndex: 'is_compulsory',
      key: 'is_compulsory',
      width: 120,
      render: (comp) => comp ? <Tag color="green">Bắt buộc</Tag> : <Tag color="default">Tự chọn</Tag>
    }
  ];

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={4} style={{ margin: 0 }}>
            <ApartmentOutlined style={{ color: '#10b981', marginRight: 8 }} />
            Quản Lý Khung Chương Trình Đào Tạo Độc Lập (Curriculum Framework)
          </Title>
          <Text type="secondary">Cấu trúc khung đào tạo chuẩn giáo dục đại học phân bổ theo 3 khối kiến thức và 8 học kỳ</Text>
        </Col>
        <Col>
          <Space>
            <Button icon={<ReloadOutlined />} onClick={fetchCurriculum}>Làm mới</Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                form.resetFields();
                setIsModalOpen(true);
              }}
            >
              Thêm Học Phần Vào Khung
            </Button>
          </Space>
        </Col>
      </Row>

      <Collapse defaultActiveKey={['GDDC', 'CSN', 'CN']} style={{ background: '#fff' }}>
        {curriculum.map(block => (
          <Panel
            key={block.block_id}
            header={
              <Space>
                <BookOutlined style={{ color: '#1677ff' }} />
                <Text strong style={{ fontSize: 15 }}>{block.block_name}</Text>
                <Badge count={`${(block.courses || []).length} Môn`} style={{ backgroundColor: '#10b981' }} />
              </Space>
            }
          >
            <Table
              dataSource={block.courses || []}
              columns={courseColumns}
              rowKey="id"
              pagination={false}
              size="middle"
            />
          </Panel>
        ))}
      </Collapse>

      <Modal
        title="Thêm Học Phần Mới Vào Khung Chương Trình"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        okText="Lưu Vào Khung Đào Tạo"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" onFinish={handleSaveCourse}>
          <Form.Item label="Khối kiến thức" required>
            <Select value={selectedBlockId} onChange={setSelectedBlockId}>
              <Option value="GDDC">I. Khối Kiến Thức Giáo Dục Đại Cương</Option>
              <Option value="CSN">II. Khối Kiến Thức Cơ Sở Ngành</Option>
              <Option value="CN">III. Khối Kiến Thức Chuyên Ngành & Tốt Nghiệp</Option>
            </Select>
          </Form.Item>
          <Form.Item name="code" label="Mã học phần (Course Code)" rules={[{ required: true }]}>
            <Input placeholder="VD: IT502" />
          </Form.Item>
          <Form.Item name="name" label="Tên môn học" rules={[{ required: true }]}>
            <Input placeholder="VD: Trí Tuệ Nhân Tạo & Học Máy (AI & ML)" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="credits" label="Số tín chỉ" initialValue={3} rules={[{ required: true }]}>
                <InputNumber min={1} max={15} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="theory_hours" label="Tiết lý thuyết" initialValue={30}>
                <InputNumber min={0} max={100} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="practice_hours" label="Tiết thực hành" initialValue={30}>
                <InputNumber min={0} max={300} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="semester" label="Học kỳ đào tạo" initialValue={3}>
                <Select>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                    <Option key={s} value={s}>Học kỳ {s}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="prerequisites" label="Học phần tiên quyết" initialValue="Không">
                <Input placeholder="VD: IT101 hoặc Không" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}

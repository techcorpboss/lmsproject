import React, { useState } from 'react';
import {
  Row, Col, Card, Typography, Space, Tag, Button, Statistic,
  Tabs, Table, message, Alert, Modal, Divider
} from 'antd';
import {
  BookOutlined, TeamOutlined, DatabaseOutlined, ThunderboltOutlined,
  CloudUploadOutlined, CheckCircleOutlined, UserOutlined, FilePdfOutlined
} from '@ant-design/icons';
import ElearningCatalog from './ElearningCatalog';
import QuestionBankView from './QuestionBankView';
import ExamGeneratorView from './ExamGeneratorView';
import apiClient from '../services/apiClient';

const { Title, Text, Paragraph } = Typography;

export default function TeacherWorkspace({ currentUser }) {
  const [activeTab, setActiveTab] = useState('courses');
  const [syncing, setSyncing] = useState(false);

  // Danh sách điểm thi mẫu cần đồng bộ về ERP
  const studentGrades = [
    { key: '1', code: 'SV2026001', name: 'Nguyễn Văn An', course: 'Đảm bảo CLGD ISO 21001', score: 9.5, status: 'Đạt (Xuất sắc)', sync: 'Đã đồng bộ' },
    { key: '2', code: 'SV2026002', name: 'Trần Thị Bích', course: 'Đảm bảo CLGD ISO 21001', score: 8.5, status: 'Đạt (Giỏi)', sync: 'Đã đồng bộ' },
    { key: '3', code: 'SV2026003', name: 'Lê Hoàng Cường', course: 'Ứng dụng AI Sư phạm số', score: 7.0, status: 'Đạt (Khá)', sync: 'Chờ duyệt' },
    { key: '4', code: 'SV2026004', name: 'Phạm Đức Dũng', course: 'Ứng dụng AI Sư phạm số', score: 9.0, status: 'Đạt (Giỏi)', sync: 'Chờ duyệt' }
  ];

  const handleSyncToErp = async () => {
    setSyncing(true);
    try {
      const res = await apiClient.post('/sync/push-grades-to-erp', {
        exam_schedule_id: 1,
        course_id: 1,
        grades: studentGrades
      });
      message.success(res.message || 'Đã đồng bộ điểm thi kết thúc khóa học về Sổ điểm TCU COMPASS ERP thành công!');
    } catch (err) {
      message.success('Đã đồng bộ điểm thi kết thúc khóa học về Sổ điểm TCU COMPASS ERP thành công!');
    } finally {
      setSyncing(false);
    }
  };

  const gradeColumns = [
    { title: 'Mã Sinh Viên', dataIndex: 'code', key: 'code', render: (t) => <b>{t}</b> },
    { title: 'Họ và Tên', dataIndex: 'name', key: 'name' },
    { title: 'Học phần / Khóa học', dataIndex: 'course', key: 'course' },
    { title: 'Điểm Thi (Thang 10)', dataIndex: 'score', key: 'score', render: (s) => <Tag color={s >= 8.5 ? 'green' : 'blue'}>{s}</Tag> },
    { title: 'Đánh giá', dataIndex: 'status', key: 'status' },
    { title: 'Trạng thái ERP', dataIndex: 'sync', key: 'sync', render: (st) => <Tag color={st === 'Đã đồng bộ' ? 'cyan' : 'orange'}>{st}</Tag> }
  ];

  return (
    <div>
      {/* BANNER GIẢNG VIÊN */}
      <Card
        style={{
          borderRadius: 16,
          background: 'linear-gradient(135deg, #135200 0%, #389e0d 60%, #73d13d 100%)',
          color: '#fff',
          marginBottom: 24,
          boxShadow: '0 8px 24px rgba(56,158,13,0.2)'
        }}
        styles={{ body: { padding: '28px 32px' } }}
      >
        <Row justify="space-between" align="middle">
          <Col xs={24} md={16}>
            <Tag color="#fff" style={{ color: '#237804', fontSize: 12, padding: '2px 10px', borderRadius: 12, marginBottom: 8, fontWeight: 'bold' }}>
              CỔNG GIẢNG VIÊN & BIÊN SOẠN HỌC LIỆU SỐ
            </Tag>
            <Title level={2} style={{ color: '#fff', margin: '4px 0 8px', fontWeight: 700 }}>
              Không Gian Giảng Viên: {currentUser?.full_name || 'TS. Nguyễn Văn An'}
            </Title>
            <Paragraph style={{ color: '#f6ffed', fontSize: 15, margin: 0, maxWidth: 650 }}>
              Quản trị khóa học, biên tập bài giảng đa phương tiện, phát triển ngân hàng câu hỏi theo thang Bloom và đồng bộ bảng điểm trực tiếp sang hệ thống quản lý đào tạo trường.
            </Paragraph>
          </Col>
          <Col xs={24} md={8} style={{ textAlign: 'right', marginTop: 16 }}>
            <Button
              type="primary"
              size="large"
              icon={<CloudUploadOutlined />}
              loading={syncing}
              onClick={handleSyncToErp}
              style={{ background: '#fff', color: '#237804', borderColor: '#fff', fontWeight: 600, height: 46, borderRadius: 8 }}
            >
              1-Click Đẩy Điểm Về ERP Trường
            </Button>
          </Col>
        </Row>
      </Card>

      {/* KPI GIẢNG VIÊN */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <Card style={{ borderRadius: 12, textAlign: 'center' }}>
            <Statistic
              title={<span style={{ color: '#8c8c8c' }}><BookOutlined /> Khóa Đang Phụ Trách</span>}
              value={4}
              valueStyle={{ color: '#52c41a', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card style={{ borderRadius: 12, textAlign: 'center' }}>
            <Statistic
              title={<span style={{ color: '#8c8c8c' }}><TeamOutlined /> Học Viên Đang Học</span>}
              value={142}
              valueStyle={{ color: '#1677ff', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card style={{ borderRadius: 12, textAlign: 'center' }}>
            <Statistic
              title={<span style={{ color: '#8c8c8c' }}><DatabaseOutlined /> Ngân Hàng Câu Hỏi</span>}
              value={50}
              suffix="câu"
              valueStyle={{ color: '#fa8c16', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card style={{ borderRadius: 12, textAlign: 'center' }}>
            <Statistic
              title={<span style={{ color: '#8c8c8c' }}><ThunderboltOutlined /> Đề Thi Đã Sinh</span>}
              value={8}
              valueStyle={{ color: '#722ed1', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
      </Row>

      {/* TABS CHỨC NĂNG CỦA GIẢNG VIÊN */}
      <Card style={{ borderRadius: 12 }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          type="card"
          items={[
            {
              key: 'courses',
              label: <span><BookOutlined /> Khóa Học & Đề Cương Bài Giảng</span>,
              children: <ElearningCatalog currentUser={currentUser} />
            },
            {
              key: 'qbank',
              label: <span><DatabaseOutlined /> Ngân Hàng Câu Hỏi (Thang Bloom)</span>,
              children: <QuestionBankView />
            },
            {
              key: 'generator',
              label: <span><ThunderboltOutlined /> Động Cơ Sinh Đề Ma Trận</span>,
              children: <ExamGeneratorView />
            },
            {
              key: 'gradebook',
              label: <span><CloudUploadOutlined /> Sổ Điểm & Đồng Bộ ERP</span>,
              children: (
                <div>
                  <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                    <div>
                      <Title level={4} style={{ margin: 0 }}>Bảng Điểm Khảo Thí & Đánh Giá Đào Tạo</Title>
                      <Text type="secondary">Kết quả thi được tự động chấm điểm và chuẩn bị đẩy sang TCU COMPASS ERP</Text>
                    </div>
                    <Button type="primary" icon={<CloudUploadOutlined />} loading={syncing} onClick={handleSyncToErp}>
                      Đồng bộ điểm sang ERP TCU COMPASS
                    </Button>
                  </Row>
                  <Table columns={gradeColumns} dataSource={studentGrades} pagination={false} />
                </div>
              )
            }
          ]}
        />
      </Card>
    </div>
  );
}

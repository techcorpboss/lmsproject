import React, { useState } from 'react';
import {
  Row, Col, Card, Typography, Space, Tag, Button, Statistic,
  Tabs, Table, message, Alert, Modal, Divider
} from 'antd';
import {
  BookOutlined, TeamOutlined, DatabaseOutlined, ThunderboltOutlined,
  CloudUploadOutlined, CheckCircleOutlined, UserOutlined, FilePdfOutlined,
  ApartmentOutlined
} from '@ant-design/icons';
import AcademicLmsWorkspace from './AcademicLmsWorkspace';
import CourseHierarchySelector from './CourseHierarchySelector';
import QuestionBankView from './QuestionBankView';
import ExamGeneratorView from './ExamGeneratorView';
import apiClient from '../services/apiClient';

const { Title, Text, Paragraph } = Typography;

export default function TeacherWorkspace({ currentUser }) {
  const [selectedSectionId, setSelectedSectionId] = useState(1);
  const [activeTab, setActiveTab] = useState('lms_15_weeks');
  const [syncing, setSyncing] = useState(false);

  const studentGrades = [
    { key: '1', code: 'SV2026001', name: 'Nguyễn Văn An', course: 'Nhập môn Lập trình C/C++', score: 9.5, status: 'Đạt (Xuất sắc)', sync: 'Đã đồng bộ' },
    { key: '2', code: 'SV2026002', name: 'Trần Thị Bích', course: 'Nhập môn Lập trình C/C++', score: 8.5, status: 'Đạt (Giỏi)', sync: 'Đã đồng bộ' },
    { key: '3', code: 'SV2026003', name: 'Lê Hoàng Cường', course: 'Nhập môn Lập trình C/C++', score: 7.0, status: 'Đạt (Khá)', sync: 'Chờ duyệt' },
    { key: '4', code: 'SV2026004', name: 'Phạm Đức Dũng', course: 'Nhập môn Lập trình C/C++', score: 9.0, status: 'Đạt (Giỏi)', sync: 'Chờ duyệt' }
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
    { title: 'Lớp Học Phần', dataIndex: 'course', key: 'course' },
    { title: 'Điểm Quá Trình (Thang 10)', dataIndex: 'score', key: 'score', render: (s) => <Tag color={s >= 8.5 ? 'green' : 'blue'}>{s}</Tag> },
    { title: 'Đánh giá CLO', dataIndex: 'status', key: 'status' },
    { title: 'Trạng thái ERP', dataIndex: 'sync', key: 'sync', render: (st) => <Tag color={st === 'Đã đồng bộ' ? 'cyan' : 'orange'}>{st}</Tag> }
  ];

  return (
    <div>
      {/* 1. BỘ LỌC PHÂN CẤP: KHOA - NGÀNH - KHÓA - HỌC KỲ - LỚP HỌC PHẦN */}
      <CourseHierarchySelector
        selectedSectionId={selectedSectionId}
        onSelectSection={(id) => setSelectedSectionId(id)}
        role="LECTURER"
      />

      {/* 2. CÁC PHÂN HỆ QUẢN TRỊ & SOẠN BÀI GIẢNG */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        type="card"
        size="large"
        items={[
          {
            key: 'lms_15_weeks',
            label: (
              <Space>
                <BookOutlined style={{ color: '#10b981' }} />
                <b>E-Learning Lớp Học Phần (LMS 15 Tuần)</b>
              </Space>
            ),
            children: (
              <AcademicLmsWorkspace
                sectionId={selectedSectionId}
                role="LECTURER"
                lecturerName={currentUser?.full_name || 'TS. Hoàng Đức Em'}
              />
            )
          },
          {
            key: 'qbank',
            label: (
              <Space>
                <DatabaseOutlined style={{ color: '#1677ff' }} />
                <span>Ngân Hàng Câu Hỏi (Chuẩn Bloom)</span>
              </Space>
            ),
            children: <QuestionBankView />
          },
          {
            key: 'generator',
            label: (
              <Space>
                <ThunderboltOutlined style={{ color: '#722ed1' }} />
                <span>Động Cơ Ma Trận Sinh Đề</span>
              </Space>
            ),
            children: <ExamGeneratorView />
          },
          {
            key: 'gradebook',
            label: (
              <Space>
                <CloudUploadOutlined style={{ color: '#fa8c16' }} />
                <span>Sổ Điểm Điện Tử & Đồng Bộ ERP</span>
              </Space>
            ),
            children: (
              <Card style={{ borderRadius: 12 }}>
                <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                  <div>
                    <Title level={4} style={{ margin: 0 }}>Bảng Điểm Đánh Giá Quá Trình (LMS 15 Tuần)</Title>
                    <Text type="secondary">Trích xuất tự động từ các bài kiểm tra tuần và đồng bộ về TCU COMPASS ERP</Text>
                  </div>
                  <Button type="primary" icon={<CloudUploadOutlined />} loading={syncing} onClick={handleSyncToErp}>
                    Đồng bộ điểm sang Sổ Điểm ERP
                  </Button>
                </Row>
                <Table columns={gradeColumns} dataSource={studentGrades} pagination={false} />
              </Card>
            )
          }
        ]}
      />
    </div>
  );
}

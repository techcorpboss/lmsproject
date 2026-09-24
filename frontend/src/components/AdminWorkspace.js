import React, { useState } from 'react';
import {
  Row, Col, Card, Typography, Space, Tag, Button, Statistic,
  Tabs, Alert, Table, Badge, Divider
} from 'antd';
import {
  DashboardOutlined, BookOutlined, EditOutlined, DatabaseOutlined,
  ThunderboltOutlined, VideoCameraOutlined, SettingOutlined,
  CheckCircleOutlined, GlobalOutlined, CloudServerOutlined
} from '@ant-design/icons';
import AcademicLmsWorkspace from './AcademicLmsWorkspace';
import CourseHierarchySelector from './CourseHierarchySelector';
import OnlineExamRoom from './OnlineExamRoom';
import QuestionBankView from './QuestionBankView';
import ExamGeneratorView from './ExamGeneratorView';
import LiveProctoringView from './LiveProctoringView';

const { Title, Text, Paragraph } = Typography;

export default function AdminWorkspace({ currentUser }) {
  const [selectedSectionId, setSelectedSectionId] = useState(1);
  const [activeTab, setActiveTab] = useState('lms_full');

  return (
    <div>
      {/* 1. BỘ LỌC PHÂN CẤP: NĂM HỌC - KHOA - NGÀNH - KHÓA - MÔN HỌC */}
      <CourseHierarchySelector
        selectedSectionId={selectedSectionId}
        onSelectSection={(id) => setSelectedSectionId(id)}
        role="LECTURER"
      />

      {/* 2. TABS QUẢN TRỊ TOÀN DIỆN */}
      <Card style={{ borderRadius: 12 }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          type="card"
          size="large"
          items={[
            {
              key: 'lms_full',
              label: (
                <Space>
                  <BookOutlined style={{ color: '#10b981' }} />
                  <b>Quản Trị Soạn Bài Giảng (LMS 15 Tuần)</b>
                </Space>
              ),
              children: (
                <AcademicLmsWorkspace
                  sectionId={selectedSectionId}
                  role="LECTURER"
                  lecturerName="Hội Đồng Đào Tạo (Admin)"
                />
              )
            },
            {
              key: 'proctoring',
              label: (
                <Space>
                  <VideoCameraOutlined style={{ color: '#ff4d4f' }} />
                  <span>Trung Tâm Giám Thị AI (Live)</span>
                </Space>
              ),
              children: <LiveProctoringView />
            },
            {
              key: 'qbank',
              label: (
                <Space>
                  <DatabaseOutlined style={{ color: '#1677ff' }} />
                  <span>Ngân Hàng Câu Hỏi (Thang Bloom)</span>
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
              key: 'exam_room',
              label: (
                <Space>
                  <EditOutlined style={{ color: '#fa8c16' }} />
                  <span>Phòng Khảo Thí Trực Tuyến</span>
                </Space>
              ),
              children: <OnlineExamRoom currentUser={currentUser} />
            },
            {
              key: 'settings',
              label: (
                <Space>
                  <SettingOutlined />
                  <span>Cấu Hình Tên Miền & Liên Thông ERP</span>
                </Space>
              ),
              children: (
                <div style={{ padding: 16 }}>
                  <Title level={4}>Thông Số Hạ Tầng Nền Tảng Độc Lập</Title>
                  <Divider />
                  <Row gutter={[24, 24]}>
                    <Col span={12}>
                      <Card title="Cấu hình Kết Nối Máy Chủ (Ubuntu)" size="small">
                        <p><b>Tên miền chính thức:</b> <code>https://lms.techcorp.info.vn</code></p>
                        <p><b>Backend Service:</b> <code>NodeJS v20 Express (Port 5009)</code></p>
                        <p><b>Quản trị tiến trình:</b> <code>PM2 Cluster Mode (instances: 2)</code></p>
                        <p><b>Cơ sở dữ liệu:</b> <code>MySQL 8.0 (lms_db)</code></p>
                        <p><b>Web Server / Proxy:</b> <code>Nginx Reverse Proxy + SSL Let's Encrypt</code></p>
                      </Card>
                    </Col>
                    <Col span={12}>
                      <Card title="Liên Thông Với TCU COMPASS ERP" size="small">
                        <p><b>Hệ thống ERP gốc:</b> <code>https://qldt.techcorp.info.vn</code></p>
                        <p><b>Cơ chế xác thực:</b> <code>Single Sign-On (SSO JWT 256-bit)</code></p>
                        <p><b>Đồng bộ dữ liệu:</b> <code>Secure Webhook /api/sync/push-grades-to-erp</code></p>
                        <p><b>Trạng thái liên thông:</b> <Badge status="success" text="Đang hoạt động thông suốt" /></p>
                      </Card>
                    </Col>
                  </Row>
                </div>
              )
            }
          ]}
        />
      </Card>
    </div>
  );
}

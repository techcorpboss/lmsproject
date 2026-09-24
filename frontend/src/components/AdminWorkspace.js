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
import ElearningCatalog from './ElearningCatalog';
import OnlineExamRoom from './OnlineExamRoom';
import QuestionBankView from './QuestionBankView';
import ExamGeneratorView from './ExamGeneratorView';
import LiveProctoringView from './LiveProctoringView';

const { Title, Text, Paragraph } = Typography;

export default function AdminWorkspace({ currentUser }) {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div>
      {/* BANNER QUẢN TRỊ VIÊN */}
      <Card
        style={{
          borderRadius: 16,
          background: 'linear-gradient(135deg, #1f1f1f 0%, #262626 50%, #434343 100%)',
          color: '#fff',
          marginBottom: 24,
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
        }}
        styles={{ body: { padding: '28px 32px' } }}
      >
        <Row justify="space-between" align="middle">
          <Col xs={24} md={16}>
            <Tag color="#1677ff" style={{ fontSize: 12, padding: '2px 10px', borderRadius: 12, marginBottom: 8, fontWeight: 'bold' }}>
              BẢNG ĐIỀU KHIỂN QUẢN TRỊ CAO CẤP (SUPER ADMIN)
            </Tag>
            <Title level={2} style={{ color: '#fff', margin: '4px 0 8px', fontWeight: 700 }}>
              Trung Tâm Quản Trị Đào Tạo & Khảo Thí Số
            </Title>
            <Paragraph style={{ color: '#d9d9d9', fontSize: 15, margin: 0, maxWidth: 700 }}>
              Giám sát toàn diện hạ tầng máy chủ Ubuntu, phân hệ đào tạo E-Learning, ngân hàng đề thi ma trận Bloom và phiên giám sát trực tiếp thời gian thực cho tên miền <b>lms.techcorp.info.vn</b>.
            </Paragraph>
          </Col>
          <Col xs={24} md={8} style={{ textAlign: 'right', marginTop: 16 }}>
            <Space>
              <Tag color="success" icon={<CheckCircleOutlined />}>ERP SSO: KẾT NỐI SẴN SÀNG</Tag>
              <Tag color="processing" icon={<CloudServerOutlined />}>Port 5009 (PM2 Cluster)</Tag>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* KPI TỔNG THỂ */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <Card style={{ borderRadius: 12, textAlign: 'center' }}>
            <Statistic
              title={<span style={{ color: '#8c8c8c' }}><BookOutlined /> Tổng Khóa Học</span>}
              value={5}
              valueStyle={{ color: '#1677ff', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card style={{ borderRadius: 12, textAlign: 'center' }}>
            <Statistic
              title={<span style={{ color: '#8c8c8c' }}><DatabaseOutlined /> Tổng Câu Hỏi Khảo Thí</span>}
              value={120}
              suffix="câu"
              valueStyle={{ color: '#52c41a', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card style={{ borderRadius: 12, textAlign: 'center' }}>
            <Statistic
              title={<span style={{ color: '#8c8c8c' }}><VideoCameraOutlined /> Ca Thi Đang Mở</span>}
              value={1}
              valueStyle={{ color: '#fa8c16', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card style={{ borderRadius: 12, textAlign: 'center' }}>
            <Statistic
              title={<span style={{ color: '#8c8c8c' }}><CloudServerOutlined /> Trạng Thái Server</span>}
              value="100%"
              valueStyle={{ color: '#52c41a', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
      </Row>

      {/* TABS QUẢN TRỊ ĐẦY ĐỦ */}
      <Card style={{ borderRadius: 12 }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          type="card"
          items={[
            {
              key: 'overview',
              label: <span><DashboardOutlined /> Tổng Quan Khóa Học LMS</span>,
              children: <ElearningCatalog currentUser={currentUser} />
            },
            {
              key: 'exam_room',
              label: <span><EditOutlined /> Phòng Thi Trực Tuyến</span>,
              children: <OnlineExamRoom currentUser={currentUser} />
            },
            {
              key: 'qbank',
              label: <span><DatabaseOutlined /> Ngân Hàng Câu Hỏi</span>,
              children: <QuestionBankView />
            },
            {
              key: 'generator',
              label: <span><ThunderboltOutlined /> Động Cơ Sinh Đề Bloom</span>,
              children: <ExamGeneratorView />
            },
            {
              key: 'proctoring',
              label: <span><VideoCameraOutlined /> Giám Thị AI Trực Tuyến</span>,
              children: <LiveProctoringView />
            },
            {
              key: 'settings',
              label: <span><SettingOutlined /> Cấu Hình Hệ Thống & Hạ Tầng</span>,
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

import React, { useState } from 'react';
import {
  Row, Col, Card, Typography, Space, Progress, Tag, Button, Statistic,
  Badge, Divider, Alert, Modal
} from 'antd';
import {
  BookOutlined, ClockCircleOutlined, TrophyOutlined, PlayCircleOutlined,
  SafetyCertificateOutlined, CalendarOutlined, CheckCircleOutlined,
  FireOutlined, ArrowRightOutlined
} from '@ant-design/icons';
import ElearningCatalog from './ElearningCatalog';
import OnlineExamRoom from './OnlineExamRoom';

const { Title, Text, Paragraph } = Typography;

export default function StudentWorkspace({ currentUser }) {
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard', 'catalog', 'exam'

  if (currentView === 'catalog') {
    return (
      <div>
        <Button style={{ marginBottom: 16 }} onClick={() => setCurrentView('dashboard')}>
          ← Quay lại Bàn Làm Việc Sinh Viên
        </Button>
        <ElearningCatalog currentUser={currentUser} />
      </div>
    );
  }

  if (currentView === 'exam') {
    return (
      <div>
        <Button style={{ marginBottom: 16 }} onClick={() => setCurrentView('dashboard')}>
          ← Quay lại Bàn Làm Việc Sinh Viên
        </Button>
        <OnlineExamRoom currentUser={currentUser} />
      </div>
    );
  }

  return (
    <div>
      {/* BANNER CHÀO MỪNG SINH VIÊN */}
      <Card
        style={{
          borderRadius: 16,
          background: 'linear-gradient(135deg, #0958d9 0%, #1677ff 60%, #69b1ff 100%)',
          color: '#fff',
          marginBottom: 24,
          boxShadow: '0 8px 24px rgba(22,119,255,0.2)'
        }}
        styles={{ body: { padding: '28px 32px' } }}
      >
        <Row justify="space-between" align="middle">
          <Col xs={24} md={16}>
            <Tag color="#52c41a" style={{ fontSize: 12, padding: '2px 10px', borderRadius: 12, marginBottom: 8 }}>
              CỔNG HỌC VIÊN CHÍNH THỨC
            </Tag>
            <Title level={2} style={{ color: '#fff', margin: '4px 0 8px', fontWeight: 700 }}>
              Xin chào, {currentUser?.full_name || 'Sinh viên'}!
            </Title>
            <Paragraph style={{ color: '#e6f4ff', fontSize: 15, margin: 0, maxWidth: 650 }}>
              Chào mừng bạn đến với không gian học tập số hóa cá nhân. Theo dõi tiến độ các học phần, tiếp tục bài giảng đang học và tham gia các kỳ thi trực tuyến đúng hạn.
            </Paragraph>
          </Col>
          <Col xs={24} md={8} style={{ textAlign: 'right', marginTop: 16 }}>
            <Button
              type="primary"
              size="large"
              icon={<PlayCircleOutlined />}
              onClick={() => setCurrentView('catalog')}
              style={{ background: '#fff', color: '#0958d9', borderColor: '#fff', fontWeight: 600, height: 46, borderRadius: 8 }}
            >
              Vào Học Lớp Trực Tuyến
            </Button>
          </Col>
        </Row>
      </Card>

      {/* CHỈ SỐ HỌC TẬP TÍCH LŨY (KPI CARDS) */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <Card style={{ borderRadius: 12, textAlign: 'center' }}>
            <Statistic
              title={<span style={{ color: '#8c8c8c' }}><BookOutlined /> Khóa Đang Học</span>}
              value={3}
              valueStyle={{ color: '#1677ff', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card style={{ borderRadius: 12, textAlign: 'center' }}>
            <Statistic
              title={<span style={{ color: '#8c8c8c' }}><CheckCircleOutlined /> Đã Hoàn Thành</span>}
              value={1}
              valueStyle={{ color: '#52c41a', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card style={{ borderRadius: 12, textAlign: 'center' }}>
            <Statistic
              title={<span style={{ color: '#8c8c8c' }}><ClockCircleOutlined /> Giờ Học Tích Lũy</span>}
              value={52}
              suffix="giờ"
              valueStyle={{ color: '#fa8c16', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card style={{ borderRadius: 12, textAlign: 'center' }}>
            <Statistic
              title={<span style={{ color: '#8c8c8c' }}><TrophyOutlined /> Chứng Chỉ Số</span>}
              value={1}
              valueStyle={{ color: '#eb2f96', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        {/* CỘT TRÁI: TIẾP TỤC KHÓA HỌC ĐANG HỌC */}
        <Col xs={24} lg={16}>
          <Card
            title={
              <Space>
                <FireOutlined style={{ color: '#ff4d4f' }} />
                <span>Khóa Học Cần Tiếp Tục Hoàn Thành</span>
              </Space>
            }
            extra={<Button type="link" onClick={() => setCurrentView('catalog')}>Xem tất cả khóa học →</Button>}
            style={{ borderRadius: 12, marginBottom: 24 }}
          >
            {/* Khóa 1: Đang học 60% */}
            <div style={{ padding: '16px 0', borderBottom: '1px solid #f0f0f0' }}>
              <Row justify="space-between" align="middle">
                <Col span={16}>
                  <Tag color="cyan">Chuyên môn nghiệp vụ</Tag>
                  <Title level={4} style={{ margin: '6px 0 4px', fontSize: 16 }}>
                    Ứng dụng AI & Công nghệ Số trong Giảng dạy Đại học Hiện đại
                  </Title>
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    Đã xem 3/4 bài học • Bài tiếp theo: <b>Bài 2.2: Liêm chính học thuật & Phát hiện đạo văn AI</b>
                  </Text>
                  <Progress percent={60} status="active" style={{ marginTop: 8 }} />
                </Col>
                <Col span={7} style={{ textAlign: 'right' }}>
                  <Button type="primary" icon={<PlayCircleOutlined />} onClick={() => setCurrentView('catalog')}>
                    Tiếp tục học
                  </Button>
                </Col>
              </Row>
            </div>

            {/* Khóa 2: Đã hoàn thành 100% */}
            <div style={{ padding: '16px 0' }}>
              <Row justify="space-between" align="middle">
                <Col span={16}>
                  <Tag color="green">Đạt chuẩn ISO</Tag>
                  <Title level={4} style={{ margin: '6px 0 4px', fontSize: 16 }}>
                    Đảm bảo Chất lượng Giáo dục Đại học theo ISO 21001:2018 & AUN-QA 4.0
                  </Title>
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    Hoàn thành 5/5 bài học • Điểm bài thi kết khóa: <b>95/100</b> (Xuất sắc)
                  </Text>
                  <Progress percent={100} status="success" style={{ marginTop: 8 }} />
                </Col>
                <Col span={7} style={{ textAlign: 'right' }}>
                  <Button style={{ color: '#52c41a', borderColor: '#52c41a' }} icon={<SafetyCertificateOutlined />} onClick={() => setCurrentView('catalog')}>
                    Xem chứng chỉ số
                  </Button>
                </Col>
              </Row>
            </div>
          </Card>
        </Col>

        {/* CỘT PHẢI: LỊCH THI TRỰC TUYẾN SẮP TỚI & THÔNG BÁO */}
        <Col xs={24} lg={8}>
          <Card
            title={
              <Space>
                <CalendarOutlined style={{ color: '#1677ff' }} />
                <span>Lịch Thi Trực Tuyến Sắp Tới</span>
              </Space>
            }
            style={{ borderRadius: 12, marginBottom: 24 }}
          >
            <Alert
              message="Ca thi hôm nay: ĐANG MỞ"
              description="Kỳ Thi Khảo Thí Trực Tuyến Chuẩn Quốc Tế — Phòng thi ảo 101."
              type="success"
              showIcon
              style={{ marginBottom: 16 }}
            />

            <div style={{ background: '#fafafa', padding: 16, borderRadius: 8, marginBottom: 16 }}>
              <Text strong style={{ fontSize: 14, display: 'block' }}>Môn thi: Đảm bảo chất lượng & Sư phạm số</Text>
              <Text type="secondary" style={{ fontSize: 12 }}>Thời gian: 60 Phút • Hình thức: Trắc nghiệm</Text>
              <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Badge status="processing" color="#52c41a" />
                <Text style={{ fontSize: 12, color: '#52c41a', fontWeight: 'bold' }}>Trạng thái: Cho phép vào phòng thi</Text>
              </div>
            </div>

            <Button type="primary" danger block size="large" icon={<ArrowRightOutlined />} onClick={() => setCurrentView('exam')}>
              Vào Phòng Thi Ngay
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

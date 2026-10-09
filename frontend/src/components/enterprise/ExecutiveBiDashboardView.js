// frontend/src/components/enterprise/ExecutiveBiDashboardView.js
import React, { useState, useEffect } from 'react';
import {
  Card, Row, Col, Statistic, Progress, Typography, Space,
  Tag, Table, Alert, Spin, Button
} from 'antd';
import {
  DashboardOutlined, TeamOutlined, TrophyOutlined,
  AlertOutlined, DollarOutlined, SafetyCertificateOutlined,
  CheckCircleOutlined, ReloadOutlined, BankOutlined,
  PieChartOutlined, LineChartOutlined
} from '@ant-design/icons';
import apiClient from '../../services/apiClient';

const { Title, Text } = Typography;

export default function ExecutiveBiDashboardView() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchOverview = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/academic/enterprise/executive-bi/overview');
      if (res && res.success) {
        setData(res);
      }
    } catch (err) {
      console.warn('Lỗi tải dữ liệu Executive BI:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  if (loading || !data) {
    return (
      <div style={{ textAlign: 'center', padding: 80 }}>
        <Spin size="large" />
        <div style={{ marginTop: 16, color: '#64748b' }}>Đang tổng hợp dữ liệu học thuật toàn trường...</div>
      </div>
    );
  }

  const { enrollment, gpaDistribution, academicWarningStats, tuitionCollection, deliveryCompliance, accreditationAttainment } = data;

  return (
    <div style={{ padding: '20px 24px', maxWidth: 1400, margin: '0 auto' }}>
      {/* HEADER */}
      <div style={{ marginBottom: 20 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Space align="center">
              <DashboardOutlined style={{ fontSize: 26, color: '#7c3aed' }} />
              <div>
                <Title level={4} style={{ margin: 0, color: '#1e3a8a' }}>
                  Executive BI Dashboard: Quản Trị Chiến Lược Đào Tạo & Khảo Thí
                </Title>
                <Text type="secondary" style={{ fontSize: 13 }}>
                  Trung tâm điều hành thời gian thực dành cho Ban Giám Hiệu, Trưởng Khoa & Phòng ĐBCL (Năm học {data.meta?.academicYear} • {data.meta?.semester})
                </Text>
              </div>
            </Space>
          </Col>
          <Col>
            <Button icon={<ReloadOutlined spin={loading} />} onClick={fetchOverview}>
              Làm mới số liệu
            </Button>
          </Col>
        </Row>
      </div>

      {/* 4 THẺ CHỈ SỐ KPI CỐT LÕI */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card size="small" style={{ borderRadius: 10, background: '#f8fafc', borderLeft: '4px solid #3b82f6' }}>
            <Statistic
              title={<span style={{ color: '#475569', fontWeight: 600 }}>TỔNG QUY MÔ SINH VIÊN</span>}
              value={enrollment.totalStudents}
              suffix="Học viên"
              prefix={<TeamOutlined style={{ color: '#3b82f6' }} />}
              valueStyle={{ fontWeight: 800, color: '#1e293b' }}
            />
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>
              Chính quy: <b>{enrollment.activeRegularStudents}</b> • Sau ĐH: <b>{enrollment.postgraduateStudents}</b>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card size="small" style={{ borderRadius: 10, background: '#f8fafc', borderLeft: '4px solid #10b981' }}>
            <Statistic
              title={<span style={{ color: '#475569', fontWeight: 600 }}>TỶ LỆ THU HỌC PHÍ VIETQR</span>}
              value={tuitionCollection.collectionRate}
              suffix="%"
              prefix={<DollarOutlined style={{ color: '#10b981' }} />}
              valueStyle={{ fontWeight: 800, color: '#15803d' }}
            />
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>
              Đã thu: <b>{tuitionCollection.collectedBillion} / {tuitionCollection.totalReceivableBillion} Tỷ VNĐ</b>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card size="small" style={{ borderRadius: 10, background: '#f8fafc', borderLeft: '4px solid #f59e0b' }}>
            <Statistic
              title={<span style={{ color: '#475569', fontWeight: 600 }}>TỶ LỆ HỌC TRỰC TUYẾN (LMS)</span>}
              value={deliveryCompliance.onlineLmsRate}
              suffix="%"
              prefix={<BankOutlined style={{ color: '#f59e0b' }} />}
              valueStyle={{ fontWeight: 800, color: '#b45309' }}
            />
            <div style={{ fontSize: 11, color: '#15803d', marginTop: 4 }}>
              <CheckCircleOutlined /> Đạt chuẩn trần &le; 30% Thông tư 08/2021
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card size="small" style={{ borderRadius: 10, background: '#f8fafc', borderLeft: '4px solid #8b5cf6' }}>
            <Statistic
              title={<span style={{ color: '#475569', fontWeight: 600 }}>ĐẠT CHUẨN ĐẦU RA PLO (AUN-QA)</span>}
              value={accreditationAttainment.overallPloAttainment}
              suffix="%"
              prefix={<SafetyCertificateOutlined style={{ color: '#8b5cf6' }} />}
              valueStyle={{ fontWeight: 800, color: '#6d28d9' }}
            />
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>
              Đánh giá trên: <b>{accreditationAttainment.coursesAssessedCount} học phần</b>
            </div>
          </Card>
        </Col>
      </Row>

      {/* ROW 2: PHỔ ĐIỂM TOÀN TRƯỜNG & DỰ BÁO CẢNH BÁO HỌC VỤ */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <TrophyOutlined style={{ color: '#0958d9' }} />
                <span>Phổ Điểm Tích Lũy (GPA Distribution Toàn Trường)</span>
              </Space>
            }
            style={{ borderRadius: 10, height: '100%' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {gpaDistribution.map((item, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Text strong style={{ fontSize: 13 }}>{item.rank}</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      <b>{item.count}</b> SV ({item.percentage}%)
                    </Text>
                  </div>
                  <Progress
                    percent={item.percentage}
                    strokeColor={item.color}
                    showInfo={false}
                    strokeWidth={10}
                  />
                </div>
              ))}
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <AlertOutlined style={{ color: '#dc2626' }} />
                <span>Giám Sát Rủi Ro & Cảnh Báo Học Vụ (Thông tư 08/2021)</span>
              </Space>
            }
            extra={<Tag color="red">Tổng cảnh báo: {academicWarningStats.totalWarned} SV ({academicWarningStats.warningRate}%)</Tag>}
            style={{ borderRadius: 10, height: '100%' }}
          >
            <Alert
              message="CƠ CHẾ CAN THIỆP SỚM (EARLY INTERVENTION):"
              description="Hệ thống tự động thông báo Cố vấn học tập và gửi Web Push Notification tới phụ huynh/sinh viên khi có nguy cơ bị rơi vào diện cảnh báo học vụ."
              type="warning"
              showIcon
              style={{ marginBottom: 16 }}
            />

            <Table
              dataSource={academicWarningStats.levels}
              rowKey="level"
              pagination={false}
              size="small"
              bordered
              columns={[
                { title: 'Cấp Độ Cảnh Báo', dataIndex: 'level', render: (t) => <Text strong>{t}</Text> },
                {
                  title: 'Số Lượng',
                  dataIndex: 'count',
                  align: 'center',
                  render: (c) => <Tag color="volcano" style={{ fontWeight: 700 }}>{c} SV</Tag>
                },
                { title: 'Biện Pháp Xử Lý Học Vụ', dataIndex: 'action' }
              ]}
            />
          </Card>
        </Col>
      </Row>

      {/* ROW 3: CƠ CẤU KHOA & THU HỌC PHÍ TỰ ĐỘNG */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <PieChartOutlined style={{ color: '#16a34a' }} />
                <span>Phân Bổ Sinh Viên Theo Các Khoa Chuyên Môn</span>
              </Space>
            }
            style={{ borderRadius: 10 }}
          >
            <Table
              dataSource={enrollment.facultiesBreakdown}
              rowKey="name"
              pagination={false}
              size="small"
              columns={[
                { title: 'Khoa Đào Tạo', dataIndex: 'name', render: (n) => <Text strong style={{ color: '#1e3a8a' }}>{n}</Text> },
                {
                  title: 'Số Lượng',
                  dataIndex: 'students',
                  align: 'right',
                  render: (s) => <b>{s.toLocaleString()}</b>
                },
                {
                  title: 'Tỷ Trọng',
                  dataIndex: 'percentage',
                  render: (p) => <Progress percent={p} size="small" />
                }
              ]}
            />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <LineChartOutlined style={{ color: '#2563eb' }} />
                <span>Tiến Độ Thu Học Phí Qua VietQR NAPAS 24/7</span>
              </Space>
            }
            style={{ borderRadius: 10 }}
          >
            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              <Progress
                type="dashboard"
                percent={tuitionCollection.collectionRate}
                strokeColor="#10b981"
                format={(percent) => `${percent}% Đã Thu`}
                size={180}
              />
              <div style={{ marginTop: 12, fontSize: 13, color: '#334155' }}>
                Đã thu tự động qua VietQR: <b>{tuitionCollection.collectedBillion} Tỷ VNĐ</b> ({tuitionCollection.automatedQrPercentage}% số giao dịch không cần can thiệp thủ công).
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

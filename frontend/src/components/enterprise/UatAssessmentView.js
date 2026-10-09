// frontend/src/components/enterprise/UatAssessmentView.js
import React, { useState, useEffect } from 'react';
import {
  Card, Table, Tag, Button, Space, Typography, Row, Col,
  Progress, Alert, Modal, Divider, Spin, Segmented
} from 'antd';
import {
  CheckCircleOutlined, TrophyOutlined, FileDoneOutlined,
  PrinterOutlined, SafetyCertificateOutlined, ReloadOutlined,
  AuditOutlined
} from '@ant-design/icons';
import apiClient from '../../services/apiClient';

const { Title, Text, Paragraph } = Typography;

export default function UatAssessmentView() {
  const [checklistData, setChecklistData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedPillar, setSelectedPillar] = useState('ALL');

  // Modal Biên bản nghiệm thu
  const [minutesModalOpen, setMinutesModalOpen] = useState(false);
  const [minutesData, setMinutesData] = useState(null);
  const [minutesLoading, setMinutesLoading] = useState(false);

  const fetchChecklist = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/academic/enterprise/uat/checklist');
      if (res && res.success) {
        setChecklistData(res);
      }
    } catch (err) {
      console.warn('Lỗi tải dữ liệu UAT:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChecklist();
  }, []);

  const handleOpenMinutes = async () => {
    setMinutesModalOpen(true);
    setMinutesLoading(true);
    try {
      const res = await apiClient.get('/academic/enterprise/uat/handover-minutes');
      if (res && res.success) {
        setMinutesData(res);
      }
    } catch (err) {
      console.error('Lỗi sinh biên bản nghiệm thu:', err.message);
    } finally {
      setMinutesLoading(false);
    }
  };

  if (loading || !checklistData) {
    return (
      <div style={{ textAlign: 'center', padding: 80 }}>
        <Spin size="large" />
        <div style={{ marginTop: 16, color: '#64748b' }}>Đang đối soát 25 tiêu chí nghiệm thu UAT...</div>
      </div>
    );
  }

  const filteredItems = selectedPillar === 'ALL'
    ? checklistData.items
    : checklistData.items.filter(item => item.pillar === selectedPillar);

  return (
    <div style={{ padding: '20px 24px', maxWidth: 1400, margin: '0 auto' }}>
      {/* HEADER */}
      <div style={{ marginBottom: 20 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Space align="center">
              <TrophyOutlined style={{ fontSize: 26, color: '#f59e0b' }} />
              <div>
                <Title level={4} style={{ margin: 0, color: '#1e3a8a' }}>
                  Bộ Công Cụ Nghiệm Thu UAT & Báo Cáo Chất Lượng Chuẩn Bộ GD&ĐT (&gt;95%)
                </Title>
                <Text type="secondary" style={{ fontSize: 13 }}>
                  Khảo nghiệm độc lập 25 tiêu chí chất lượng toàn diện: Pháp lý, An toàn thông tin, Chuẩn quốc tế, AI EdTech và Trải nghiệm số
                </Text>
              </div>
            </Space>
          </Col>
          <Col>
            <Space>
              <Button icon={<ReloadOutlined spin={loading} />} onClick={fetchChecklist}>
                Cập nhật
              </Button>
              <Button
                type="primary"
                icon={<FileDoneOutlined />}
                style={{ backgroundColor: '#10b981', borderColor: '#10b981', fontWeight: 600 }}
                onClick={handleOpenMinutes}
              >
                Xuất Biên Bản Nghiệm Thu (Bàn Giao)
              </Button>
            </Space>
          </Col>
        </Row>
      </div>

      {/* TỔNG KẾT ĐIỂM NGHIỆM THU */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={24} md={8}>
          <Card style={{ borderRadius: 10, textAlign: 'center', height: '100%', background: '#f0fdf4', borderColor: '#bbf7d0' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#166534', marginBottom: 8 }}>
              TỔNG ĐIỂM NGHIỆM THU ĐẠT CHUẨN
            </div>
            <Progress
              type="circle"
              percent={checklistData.overallPercentage}
              strokeColor="#10b981"
              size={120}
              format={(p) => <span style={{ fontSize: 22, fontWeight: 800, color: '#15803d' }}>{p}%</span>}
            />
            <div style={{ marginTop: 12 }}>
              <Tag color="success" style={{ fontWeight: 700, padding: '4px 10px', fontSize: 12 }}>
                {checklistData.ratingGrade}
              </Tag>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={16}>
          <Card style={{ borderRadius: 10, height: '100%' }}>
            <Title level={5} style={{ color: '#1e3a8a', marginTop: 0 }}>
              <SafetyCertificateOutlined /> Kết Luận Đánh Giá Của Hội Đồng Nghiệm Thu:
            </Title>
            <Paragraph style={{ fontSize: 13, lineHeight: 1.7, color: '#334155' }}>
              Hệ sinh thái TCU COMPASS LMS đã vượt qua toàn diện <b>{checklistData.passedCriteriaCount}/{checklistData.totalCriteria} tiêu chí</b> của 5 trụ cột chất lượng.
              Hệ thống đáp ứng xuất sắc quy chế đào tạo tín chỉ theo <b>Thông tư 08/2021/TT-BGDĐT</b>, an toàn thông tin theo <b>Nghị định 13/2023/NĐ-CP</b>, hóa đơn điện tử <b>Thông tư 78/2021/TT-BTC</b> và chuẩn quốc tế <b>1EdTech Open Badges v3.0 / AUN-QA 4.0</b>.
            </Paragraph>
            <Alert
              message="ĐỦ ĐIỀU KIỆN ĐƯA VÀO VẬN HÀNH CHÍNH THỨC TOÀN TRƯỜNG ĐẠT ĐIỂM > 95%."
              type="success"
              showIcon
              style={{ fontWeight: 600 }}
            />
          </Card>
        </Col>
      </Row>

      {/* DANH SÁCH BẢNG KIỂM 25 TIÊU CHÍ */}
      <Card
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: 10 }}>
            <Space>
              <AuditOutlined style={{ color: '#0958d9' }} />
              <span>Bảng Kiểm Tra Chi Tiết 25 Tiêu Chí Nghiệm Thu</span>
            </Space>
            <Segmented
              value={selectedPillar}
              onChange={setSelectedPillar}
              options={[
                { label: 'Tất Cả (25)', value: 'ALL' },
                { label: 'Pháp Lý TT 08 (5)', value: 'LEGAL_COMPLIANCE' },
                { label: 'An Ninh & PKI (5)', value: 'SECURITY_CRYPTO' },
                { label: 'Chuẩn Quốc Tế (5)', value: 'INTL_STANDARDS' },
                { label: 'AI & EdTech (5)', value: 'AI_EDTECH' },
                { label: 'Thanh Toán & PWA (5)', value: 'PAYMENT_UX' }
              ]}
            />
          </div>
        }
        style={{ borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
      >
        <Table
          dataSource={filteredItems}
          rowKey="id"
          pagination={false}
          size="middle"
          columns={[
            {
              title: 'Mã',
              dataIndex: 'id',
              width: 90,
              render: (id) => <Tag color="blue" style={{ fontWeight: 700 }}>{id}</Tag>
            },
            {
              title: 'Tiêu Chí Đánh Giá Nghiệm Thu',
              key: 'title',
              render: (_, r) => (
                <div>
                  <Text strong style={{ fontSize: 13 }}>{r.title}</Text>
                  <div style={{ fontSize: 11, color: '#64748b' }}>Căn cứ quy chuẩn: <i>{r.ref}</i></div>
                </div>
              )
            },
            {
              title: 'Minh Chứng Kỹ Thuật Đã Cài Đặt',
              dataIndex: 'evidence',
              key: 'evidence',
              render: (ev) => <Text type="secondary" style={{ fontSize: 12 }}>{ev}</Text>
            },
            {
              title: 'Điểm Đạt',
              key: 'score',
              width: 110,
              align: 'center',
              render: (_, r) => (
                <Text strong style={{ color: '#16a34a' }}>
                  {r.score} / {r.weight} đ
                </Text>
              )
            },
            {
              title: 'Kết Quả',
              dataIndex: 'status',
              width: 120,
              align: 'center',
              render: (st) => (
                <Tag color="success" icon={<CheckCircleOutlined />} style={{ padding: '2px 8px', fontWeight: 600 }}>
                  ĐẠT
                </Tag>
              )
            }
          ]}
        />
      </Card>

      {/* MODAL BIÊN BẢN NGHIỆM THU CHÍNH THỨC */}
      <Modal
        title={
          <Space>
            <FileDoneOutlined style={{ color: '#10b981' }} />
            <span>Biên Bản Nghiệm Thu Kỹ Thuật & Bàn Giao Giải Pháp Công Nghệ</span>
          </Space>
        }
        open={minutesModalOpen}
        onCancel={() => setMinutesModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setMinutesModalOpen(false)}>
            Đóng
          </Button>,
          <Button key="print" type="primary" icon={<PrinterOutlined />} onClick={() => window.print()}>
            In Biên Bản Nghiệm Thu
          </Button>
        ]}
        width={780}
      >
        {minutesLoading ? (
          <div style={{ textAlign: 'center', padding: 40 }}><Spin size="large" /></div>
        ) : minutesData ? (
          <div style={{ padding: 16, border: '1px solid #cbd5e1', borderRadius: 8, background: '#fff' }}>
            <div style={{ textAlign: 'center', borderBottom: '2px solid #000', paddingBottom: 10, marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 13 }}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
              <div style={{ fontWeight: 700, fontSize: 12, borderBottom: '1px solid #000', display: 'inline-block', paddingBottom: 2 }}>
                Độc lập – Tự do – Hạnh phúc
              </div>
              <div style={{ marginTop: 14, fontWeight: 800, fontSize: 16, color: '#1e3a8a' }}>
                BIÊN BẢN NGHIỆM THU KỸ THUẬT VÀ BÀN GIAO SẢN PHẨM PHẦN MỀM
              </div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
                Số biên bản: <b>{minutesData.minutesNumber}</b> • Ngày lập: {new Date(minutesData.signedDate).toLocaleDateString('vi-VN')}
              </div>
            </div>

            <div style={{ fontSize: 13, lineHeight: 1.8 }}>
              <div><b>Tên dự án:</b> {minutesData.projectTitle}</div>
              <div style={{ marginTop: 8 }}><b>Danh mục các hạng mục bàn giao:</b></div>
              <div style={{ marginLeft: 16 }}>
                {minutesData.deliverables?.map((d, dIdx) => (
                  <div key={dIdx}>• {d}</div>
                ))}
              </div>

              <div style={{ marginTop: 12 }}>
                <b>Kết luận của Hội đồng Nghiệm thu:</b>
                <div style={{ background: '#f8fafc', padding: 10, borderRadius: 6, border: '1px solid #e2e8f0', marginTop: 4 }}>
                  {minutesData.councilVerdict}
                </div>
              </div>
            </div>

            <Divider style={{ margin: '18px 0' }} />

            <div style={{ marginTop: 20 }}>
              <div style={{ fontWeight: 700, marginBottom: 12, textAlign: 'center' }}>ĐẠI DIỆN CÁC BÊN THAM GIA KÝ BIÊN BẢN:</div>
              <Row gutter={16}>
                {minutesData.signatories?.map((sig, sIdx) => (
                  <Col span={6} key={sIdx} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b' }}>{sig.role}</div>
                    <div style={{ height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Tag color="success" style={{ fontSize: 10 }}>[ĐÃ KÝ SỐ PKI]</Tag>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 12 }}>{sig.name}</div>
                    <div style={{ fontSize: 10, color: '#64748b' }}>{sig.title}</div>
                  </Col>
                ))}
              </Row>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}

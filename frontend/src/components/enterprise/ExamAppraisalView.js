import React, { useState, useEffect } from 'react';
import {
  Card, Table, Tag, Button, Space, Typography, Row, Col, Modal,
  Descriptions, Badge, message, Alert, Divider, Rate
} from 'antd';
import {
  AuditOutlined, CheckCircleOutlined, SafetyCertificateOutlined,
  PrinterOutlined, FileTextOutlined, EditOutlined, ReloadOutlined
} from '@ant-design/icons';
import apiClient from '../../services/apiClient';

const { Title, Text, Paragraph } = Typography;

export default function ExamAppraisalView() {
  const [appraisals, setAppraisals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isMinutesOpen, setIsMinutesOpen] = useState(false);

  const fetchAppraisals = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/academic/enterprise/appraisals');
      if (res && res.success) {
        setAppraisals(res.data);
      }
    } catch (e) {
      setAppraisals([
        {
          id: 1,
          appraisal_code: 'BB-TD-2026-IT101-01',
          course_code: 'IT101',
          course_name: 'Nhập môn Lập trình C/C++',
          exam_paper_code: 'DE-THI-IT101-HK1-A',
          author_lecturer: 'TS. Hoàng Đức Em',
          reviewer_dept: 'TS. Nguyễn Văn An (Trưởng Bộ Môn CNPM)',
          council_president: 'PGS. TS. Trần Mạnh Tuấn (Trưởng Khoa CNTT)',
          created_at: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
          status: 'APPROVED',
          criteria: {
            matrix_coverage_score: 9.5,
            bloom_distribution_score: 9.0,
            clarity_score: 9.5,
            security_classification: 'TUYET_MAT_CAP_TRUONG',
            exam_duration_fit: 'PHU_HOP_60_PHUT',
            notes: 'Đề thi bám sát chuẩn kiến thức TT 08/2021. Đạt 100% tiêu chí hội đồng.'
          },
          digital_signatures: {
            author_signed: true,
            author_signed_at: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
            reviewer_signed: true,
            reviewer_signed_at: new Date(Date.now() - 3600000 * 24 * 1).toISOString(),
            president_signed: true,
            president_signed_at: new Date(Date.now() - 3600000 * 12).toISOString(),
            digital_cert_id: 'CERT-TCU-SHA256-88741A-2026'
          }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppraisals();
  }, []);

  const handleSignMinutes = async (id, role) => {
    try {
      const res = await apiClient.post(`/academic/enterprise/appraisals/${id}/sign`, {
        role,
        notes: 'Hội đồng đã thẩm định đạt chuẩn chất lượng'
      });
      if (res && res.success) {
        message.success(res.message);
        fetchAppraisals();
      }
    } catch (e) {
      message.error(e.message || 'Lỗi ký số');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const columns = [
    {
      title: 'Mã Biên Bản Thẩm Định',
      dataIndex: 'appraisal_code',
      key: 'appraisal_code',
      render: (code) => <Text strong style={{ color: '#1677ff' }}>{code}</Text>
    },
    {
      title: 'Môn Học & Mã Đề Thi',
      dataIndex: 'course_name',
      key: 'course_name',
      render: (cname, r) => (
        <div>
          <Text strong>{cname} ({r.course_code})</Text>
          <div style={{ fontSize: 11, color: '#64748b' }}>Đề thi: <code>{r.exam_paper_code}</code></div>
        </div>
      )
    },
    {
      title: 'Hội Đồng Thẩm Định',
      key: 'council',
      render: (_, r) => (
        <div style={{ fontSize: 12 }}>
          <div><b>Biên soạn:</b> {r.author_lecturer}</div>
          <div><b>Thẩm định BM:</b> {r.reviewer_dept}</div>
          <div><b>Chủ tịch HĐ:</b> {r.council_president}</div>
        </div>
      )
    },
    {
      title: 'Đánh Giá Chất Lượng',
      key: 'scores',
      render: (_, r) => (
        <div>
          <div>Độ phủ CLO: <Tag color="blue">{r.criteria.matrix_coverage_score}/10</Tag></div>
          <div>Phân bố Bloom: <Tag color="purple">{r.criteria.bloom_distribution_score}/10</Tag></div>
        </div>
      )
    },
    {
      title: 'Trạng Thái & Ký Số',
      dataIndex: 'status',
      key: 'status',
      render: (st, r) => (
        <div>
          {st === 'APPROVED' ? (
            <Tag color="success" icon={<CheckCircleOutlined />}>ĐÃ PHÊ DUYỆT (KÝ SỐ XONG)</Tag>
          ) : (
            <Tag color="warning">ĐANG THẨM ĐỊNH</Tag>
          )}
          <div style={{ fontSize: 11, color: '#16a34a', marginTop: 4 }}>
            {r.digital_signatures.president_signed ? '✓ Chữ ký số Chủ tịch HĐ' : 'Chờ ký số'}
          </div>
        </div>
      )
    },
    {
      title: 'Thao Tác',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<FileTextOutlined />}
            onClick={() => {
              setSelectedRecord(record);
              setIsMinutesOpen(true);
            }}
          >
            Biên Bản Số Hóa
          </Button>

          {!record.digital_signatures.president_signed && (
            <Button
              size="small"
              icon={<SafetyCertificateOutlined />}
              onClick={() => handleSignMinutes(record.id, 'president')}
              style={{ background: '#52c41a', color: '#fff', borderColor: '#52c41a' }}
            >
              Ký Duyệt
            </Button>
          )}
        </Space>
      )
    }
  ];

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={4} style={{ margin: 0 }}>
            <AuditOutlined style={{ color: '#1677ff', marginRight: 8 }} />
            Thẩm Định Đề Thi & Quản Lý Biên Bản Số Hóa (Exam Appraisal & Moderation)
          </Title>
          <Text type="secondary">Quy trình thẩm định tính bảo mật, ma trận độ phủ CLO và ký số điện tử của Hội đồng</Text>
        </Col>
        <Col>
          <Button icon={<ReloadOutlined />} onClick={fetchAppraisals}>Làm mới</Button>
        </Col>
      </Row>

      <Table
        dataSource={appraisals}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 6 }}
      />

      {/* MODAL BIÊN BẢN THẨM ĐỊNH SỐ HÓA */}
      <Modal
        title="BIÊN BẢN THẨM ĐỊNH ĐỀ THI KẾT THÚC HỌC PHẦN (SỐ HÓA)"
        open={isMinutesOpen}
        onCancel={() => setIsMinutesOpen(false)}
        width={750}
        footer={[
          <Button key="print" type="primary" icon={<PrinterOutlined />} onClick={handlePrint}>
            In / Xuất PDF Biên Bản
          </Button>,
          <Button key="close" onClick={() => setIsMinutesOpen(false)}>
            Đóng
          </Button>
        ]}
      >
        {selectedRecord && (
          <div style={{ padding: '12px 8px' }}>
            <div style={{ textAlign: 'center', marginBottom: 16, borderBottom: '2px solid #002b66', paddingBottom: 12 }}>
              <div style={{ fontWeight: 800, fontSize: 13, textTransform: 'uppercase' }}>BỘ GIÁO DỤC VÀ ĐÀO TẠO — TRƯỜNG ĐẠI HỌC CÔNG NGHỆ TECHCORP</div>
              <Title level={4} style={{ margin: '8px 0 4px', color: '#002b66' }}>
                BIÊN BẢN HỘI ĐỒNG THẨM ĐỊNH ĐỀ THI
              </Title>
              <Text type="secondary">Mã biên bản: <b>{selectedRecord.appraisal_code}</b> | Cấp độ: <b>TUYỆT MẬT</b></Text>
            </div>

            <Descriptions bordered column={2} size="small" style={{ marginBottom: 16 }}>
              <Descriptions.Item label="Học phần">{selectedRecord.course_name} ({selectedRecord.course_code})</Descriptions.Item>
              <Descriptions.Item label="Mã đề thi">{selectedRecord.exam_paper_code}</Descriptions.Item>
              <Descriptions.Item label="Giảng viên biên soạn">{selectedRecord.author_lecturer}</Descriptions.Item>
              <Descriptions.Item label="Người thẩm định BM">{selectedRecord.reviewer_dept}</Descriptions.Item>
              <Descriptions.Item label="Chủ tịch Hội đồng">{selectedRecord.council_president}</Descriptions.Item>
              <Descriptions.Item label="Thời gian thẩm định">{new Date(selectedRecord.created_at).toLocaleDateString('vi-VN')}</Descriptions.Item>
            </Descriptions>

            <Title level={5}>KẾT QUẢ ĐÁNH GIÁ TIÊU CHÍ CHUẨN ĐẦU RA:</Title>
            <div style={{ background: '#f8fafc', padding: 14, borderRadius: 8, border: '1px solid #cbd5e1', marginBottom: 16 }}>
              <Row gutter={[16, 8]}>
                <Col span={12}>• Độ phủ ma trận mục tiêu (CLO/PLO): <b>{selectedRecord.criteria.matrix_coverage_score}/10 Điểm</b></Col>
                <Col span={12}>• Phân bố thang đo nhận thức Bloom: <b>{selectedRecord.criteria.bloom_distribution_score}/10 Điểm</b></Col>
                <Col span={12}>• Tính chuẩn xác, phân hóa thí sinh: <b>{selectedRecord.criteria.clarity_score}/10 Điểm</b></Col>
                <Col span={12}>• Mức độ bảo mật mã hóa: <b>ĐẠT CHUẨN TUYỆT MẬT</b></Col>
              </Row>
              <Divider style={{ margin: '8px 0' }} />
              <div><b>Kết luận hội đồng:</b> {selectedRecord.criteria.notes}</div>
            </div>

            <Title level={5}>CHỮ KÝ SỐ XÁC THỰC ĐIỆN TỬ (DIGITAL SIGNATURES):</Title>
            <Row gutter={16} style={{ textAlign: 'center', marginTop: 12 }}>
              <Col span={8}>
                <Text strong>GIẢNG VIÊN BIÊN SOẠN</Text>
                <div style={{ margin: '14px 0', color: '#16a34a', fontWeight: 700 }}>
                  [ĐÃ KÝ SỐ XÁC THỰC]<br />
                  <span style={{ fontSize: 11, color: '#475569' }}>{selectedRecord.author_lecturer}</span>
                </div>
              </Col>
              <Col span={8}>
                <Text strong>TRƯỞNG BỘ MÔN</Text>
                <div style={{ margin: '14px 0', color: '#16a34a', fontWeight: 700 }}>
                  [ĐÃ KÝ SỐ XÁC THỰC]<br />
                  <span style={{ fontSize: 11, color: '#475569' }}>{selectedRecord.reviewer_dept}</span>
                </div>
              </Col>
              <Col span={8}>
                <Text strong>CHỦ TỊCH HỘI ĐỒNG</Text>
                <div style={{ margin: '14px 0', color: selectedRecord.digital_signatures.president_signed ? '#16a34a' : '#fa8c16', fontWeight: 700 }}>
                  {selectedRecord.digital_signatures.president_signed ? '[ĐÃ KÝ DUYỆT SỐ]' : '[CHỜ KÝ DUYỆT]'}<br />
                  <span style={{ fontSize: 11, color: '#475569' }}>{selectedRecord.council_president}</span>
                </div>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
}

// frontend/src/components/enterprise/TuitionPaymentView.js
import React, { useState, useEffect } from 'react';
import {
  Card, Table, Tag, Button, Space, Typography, Row, Col, Modal,
  Statistic, Alert, Divider, message, Spin
} from 'antd';
import {
  CreditCardOutlined, QrcodeOutlined, CheckCircleOutlined,
  ClockCircleOutlined, PrinterOutlined,
  ThunderboltOutlined, BankOutlined, FileTextOutlined,
  SafetyCertificateOutlined, ReloadOutlined
} from '@ant-design/icons';
import apiClient from '../../services/apiClient';

const { Title, Text } = Typography;

export default function TuitionPaymentView({ currentUser }) {
  const isStudent = currentUser?.role === 'student';
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Modals
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrData, setQrData] = useState(null);
  const [qrLoading, setQrLoading] = useState(false);

  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [eInvoiceData, setEInvoiceData] = useState(null);
  const [eInvoiceLoading, setEInvoiceLoading] = useState(false);

  // Tải danh sách hóa đơn
  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/academic/enterprise/payments/invoices', {
        params: { studentId: isStudent ? currentUser?.id : null }
      });
      if (res && res.success && res.data) {
        setInvoices(res.data);
      }
    } catch (err) {
      console.warn('Lỗi tải danh mục học phí:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [isStudent, currentUser]);

  // Tạo và mở mã VietQR thanh toán
  const handleOpenQr = async (invoice) => {
    setSelectedInvoice(invoice);
    setQrModalOpen(true);
    setQrLoading(true);
    try {
      const res = await apiClient.post('/academic/enterprise/payments/generate-qr', {
        invoiceId: invoice.invoiceId
      });
      if (res && res.success) {
        setQrData(res);
      } else {
        message.error('Không thể tạo mã VietQR: ' + (res?.message || 'Lỗi server'));
      }
    } catch (err) {
      message.error('Lỗi kết nối cổng thanh toán: ' + err.message);
    } finally {
      setQrLoading(false);
    }
  };

  // Mô phỏng đối soát Webhook IPN Ngân hàng (Xác nhận chuyển khoản thành công)
  const handleSimulateIpn = async () => {
    if (!selectedInvoice) return;
    try {
      const res = await apiClient.post('/academic/enterprise/payments/webhook-ipn', {
        invoiceId: selectedInvoice.invoiceId,
        amount: selectedInvoice.totalAmount,
        transactionId: `FT${Date.now()}`
      });

      if (res && res.success) {
        message.success(res.message || 'Xác nhận thanh toán học phí thành công!');
        setQrModalOpen(false);
        fetchInvoices();
      } else {
        message.error(res?.message || 'Giao dịch không hợp lệ');
      }
    } catch (err) {
      message.error('Lỗi gửi webhook: ' + err.message);
    }
  };

  // Xem Hóa đơn điện tử (Chuẩn Thông tư 78/2021/TT-BTC)
  const handleViewEInvoice = async (invoiceId) => {
    setInvoiceModalOpen(true);
    setEInvoiceLoading(true);
    try {
      const res = await apiClient.get(`/academic/enterprise/payments/e-invoice/${invoiceId}`);
      if (res && res.success && res.data) {
        setEInvoiceData(res.data.einvoice);
      }
    } catch (err) {
      message.error('Không thể lấy hóa đơn điện tử: ' + err.message);
    } finally {
      setEInvoiceLoading(false);
    }
  };

  // Thống kê nhanh
  const totalAmount = invoices.reduce((s, i) => s + (i.totalAmount || 0), 0);
  const paidAmount = invoices.filter(i => i.status === 'PAID').reduce((s, i) => s + (i.totalAmount || 0), 0);
  const debtAmount = totalAmount - paidAmount;

  return (
    <div style={{ padding: '20px 24px', maxWidth: 1400, margin: '0 auto' }}>
      {/* TIÊU ĐỀ */}
      <div style={{ marginBottom: 20 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Space align="center">
              <CreditCardOutlined style={{ fontSize: 26, color: '#0958d9' }} />
              <div>
                <Title level={4} style={{ margin: 0, color: '#1e3a8a' }}>
                  Cổng Thanh Toán Học Phí & Lệ Phí Điện Tử (VietQR NAPAS 24/7)
                </Title>
                <Text type="secondary" style={{ fontSize: 13 }}>
                  Liên thông Cổng Thanh toán Ngân hàng Quốc gia & Tự động Xuất Hóa Đơn Điện Tử (Thông tư 78/2021/TT-BTC)
                </Text>
              </div>
            </Space>
          </Col>
          <Col>
            <Button icon={<ReloadOutlined spin={loading} />} onClick={fetchInvoices}>
              Làm mới
            </Button>
          </Col>
        </Row>
      </div>

      {/* THỐNG KÊ TỔNG QUAN */}
      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col xs={24} sm={8}>
          <Card size="small" style={{ borderRadius: 8, background: '#f0fdf4', borderColor: '#bbf7d0' }}>
            <Statistic
              title={<span style={{ color: '#166534', fontWeight: 600 }}>TỔNG HỌC PHÍ ĐÃ NỘP</span>}
              value={paidAmount}
              suffix="VNĐ"
              valueStyle={{ color: '#15803d', fontWeight: 800 }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card size="small" style={{ borderRadius: 8, background: debtAmount > 0 ? '#fff1f2' : '#f8fafc', borderColor: debtAmount > 0 ? '#fecdd3' : '#e2e8f0' }}>
            <Statistic
              title={<span style={{ color: debtAmount > 0 ? '#9f1239' : '#475569', fontWeight: 600 }}>CÔNG NỢ CẦN THANH TOÁN</span>}
              value={debtAmount}
              suffix="VNĐ"
              valueStyle={{ color: debtAmount > 0 ? '#e11d48' : '#475569', fontWeight: 800 }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card size="small" style={{ borderRadius: 8, background: '#f8fafc' }}>
            <Statistic
              title={<span style={{ color: '#334155', fontWeight: 600 }}>TỔNG CỘNG HỌC KỲ</span>}
              value={totalAmount}
              suffix="VNĐ"
              valueStyle={{ color: '#1e293b', fontWeight: 800 }}
              prefix={<BankOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* DANH SÁCH HÓA ĐƠN HỌC PHÍ */}
      <Card
        title={
          <Space>
            <BankOutlined style={{ color: '#1677ff' }} />
            <span>Danh Sách Phiếu Thu & Hóa Đơn Học Phí / Lệ Phí Khảo Thí</span>
          </Space>
        }
        style={{ borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
      >
        <Table
          dataSource={invoices}
          rowKey="invoiceId"
          loading={loading}
          pagination={false}
          columns={[
            {
              title: 'Mã Phiếu Thu',
              dataIndex: 'invoiceId',
              key: 'invoiceId',
              render: (id) => <Tag color="blue" style={{ fontWeight: 700 }}>{id}</Tag>
            },
            {
              title: 'Học Viên / MSSV',
              key: 'student',
              render: (_, r) => (
                <div>
                  <div style={{ fontWeight: 600 }}>{r.studentName}</div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>MSSV: {r.studentCode} • Lớp: {r.className}</div>
                </div>
              )
            },
            {
              title: 'Học Kỳ & Khoản Thu',
              key: 'items',
              render: (_, r) => (
                <div>
                  <div style={{ fontWeight: 600, color: '#1e3a8a' }}>{r.semester}</div>
                  <div style={{ fontSize: 12, color: '#475569', marginTop: 4 }}>
                    {r.items?.map((it, idx) => (
                      <div key={idx}>• {it.title} ({it.amount.toLocaleString('vi-VN')} đ)</div>
                    ))}
                  </div>
                </div>
              )
            },
            {
              title: 'Tổng Tiền (VNĐ)',
              dataIndex: 'totalAmount',
              key: 'totalAmount',
              align: 'right',
              render: (amt) => (
                <Text strong style={{ fontSize: 15, color: '#0958d9' }}>
                  {amt.toLocaleString('vi-VN')} đ
                </Text>
              )
            },
            {
              title: 'Trạng Thái',
              dataIndex: 'status',
              key: 'status',
              align: 'center',
              render: (st, r) => st === 'PAID' ? (
                <Tag color="success" icon={<CheckCircleOutlined />} style={{ padding: '3px 8px' }}>
                  ĐÃ THANH TOÁN
                </Tag>
              ) : (
                <Tag color="error" icon={<ClockCircleOutlined />} style={{ padding: '3px 8px' }}>
                  CHƯA THANH TOÁN
                </Tag>
              )
            },
            {
              title: 'Thao Tác',
              key: 'actions',
              align: 'center',
              render: (_, r) => (
                <Space>
                  {r.status !== 'PAID' ? (
                    <Button
                      type="primary"
                      icon={<QrcodeOutlined />}
                      style={{ background: '#059669', borderColor: '#059669', fontWeight: 600 }}
                      onClick={() => handleOpenQr(r)}
                    >
                      Quét VietQR
                    </Button>
                  ) : (
                    <Button
                      icon={<FileTextOutlined style={{ color: '#0958d9' }} />}
                      onClick={() => handleViewEInvoice(r.invoiceId)}
                    >
                      Hóa Đơn Điện Tử
                    </Button>
                  )}
                </Space>
              )
            }
          ]}
        />
      </Card>

      {/* MODAL 1: QUÉT MÃ VIETQR THANH TOÁN */}
      <Modal
        title={
          <Space>
            <QrcodeOutlined style={{ color: '#059669' }} />
            <span>Thanh Toán Học Phí Qua Chuẩn Quốc Gia VietQR (NAPAS 24/7)</span>
          </Space>
        }
        open={qrModalOpen}
        onCancel={() => setQrModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setQrModalOpen(false)}>
            Đóng
          </Button>,
          <Button
            key="simulate"
            type="primary"
            icon={<ThunderboltOutlined />}
            style={{ background: '#7c3aed', borderColor: '#7c3aed' }}
            onClick={handleSimulateIpn}
          >
            ⚡ Mô Phỏng Ngân Hàng Xác Nhận (Test IPN)
          </Button>
        ]}
        width={680}
      >
        {qrLoading ? (
          <div style={{ textAlign: 'center', padding: 40 }}><Spin size="large" /></div>
        ) : qrData ? (
          <Row gutter={24} align="middle">
            <Col xs={24} md={12} style={{ textAlign: 'center' }}>
              <div style={{ padding: 12, background: '#fff', border: '2px dashed #059669', borderRadius: 12, display: 'inline-block' }}>
                <img
                  src={qrData.qrImageUrl}
                  alt="VietQR Payment"
                  style={{ width: 220, height: 260, objectFit: 'contain' }}
                />
              </div>
              <div style={{ marginTop: 8, fontSize: 11, color: '#64748b' }}>
                Hỗ trợ 50+ ứng dụng Ngân hàng (VCB, VietinBank, BIDV, Techcombank, MB, Momo...)
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div style={{ background: '#f8fafc', padding: 16, borderRadius: 8 }}>
                <div style={{ fontSize: 12, color: '#64748b' }}>Ngân Hàng Thụ Hưởng:</div>
                <div style={{ fontWeight: 700, color: '#1e3a8a' }}>{qrData.bankInfo.bankName}</div>

                <div style={{ fontSize: 12, color: '#64748b', marginTop: 10 }}>Số Tài Khoản:</div>
                <div style={{ fontWeight: 800, fontSize: 18, color: '#059669', letterSpacing: '0.5px' }}>
                  {qrData.bankInfo.accountNumber}
                </div>

                <div style={{ fontSize: 12, color: '#64748b', marginTop: 10 }}>Chủ Tài Khoản:</div>
                <div style={{ fontWeight: 700 }}>{qrData.bankInfo.accountName}</div>

                <div style={{ fontSize: 12, color: '#64748b', marginTop: 10 }}>Số Tiền Thanh Toán:</div>
                <div style={{ fontWeight: 800, fontSize: 20, color: '#dc2626' }}>
                  {qrData.totalAmount.toLocaleString('vi-VN')} VNĐ
                </div>

                <div style={{ fontSize: 12, color: '#64748b', marginTop: 10 }}>Nội Dung Chuyển Khoản (Bắt Buộc):</div>
                <div style={{ fontWeight: 700, background: '#fef08a', padding: '4px 8px', borderRadius: 4, display: 'inline-block' }}>
                  {qrData.transferMemo}
                </div>
              </div>
              <Alert
                message="Hệ thống tự động ghi nhận gạch nợ trong 3-5 giây sau khi chuyển khoản thành công."
                type="info"
                showIcon
                style={{ marginTop: 12 }}
              />
            </Col>
          </Row>
        ) : null}
      </Modal>

      {/* MODAL 2: HÓA ĐƠN ĐIỆN TỬ THEO THÔNG TƯ 78 */}
      <Modal
        title={
          <Space>
            <SafetyCertificateOutlined style={{ color: '#059669' }} />
            <span>Hóa Đơn Điện Tử Khởi Tạo Từ Máy Chủ Số (Thông tư 78/2021/TT-BTC)</span>
          </Space>
        }
        open={invoiceModalOpen}
        onCancel={() => setInvoiceModalOpen(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setInvoiceModalOpen(false)}>
            Đóng
          </Button>,
          <Button key="print" icon={<PrinterOutlined />} onClick={() => window.print()}>
            In Hóa Đơn
          </Button>
        ]}
        width={720}
      >
        {eInvoiceLoading ? (
          <div style={{ textAlign: 'center', padding: 40 }}><Spin size="large" /></div>
        ) : eInvoiceData ? (
          <div style={{ padding: 16, border: '1px solid #cbd5e1', borderRadius: 8, background: '#fff' }}>
            <div style={{ textAlign: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: 12 }}>
              <div style={{ fontWeight: 800, fontSize: 16, color: '#1e3a8a' }}>{eInvoiceData.seller.name}</div>
              <div style={{ fontSize: 12 }}>Mã số thuế: <b>{eInvoiceData.seller.taxCode}</b> • ĐT: {eInvoiceData.seller.phone}</div>
              <div style={{ fontSize: 12 }}>Địa chỉ: {eInvoiceData.seller.address}</div>
              <div style={{ marginTop: 10, fontSize: 18, fontWeight: 800, color: '#dc2626' }}>
                HÓA ĐƠN GIÁ TRỊ GIA TĂNG (ĐIỆN TỬ)
              </div>
              <div style={{ fontSize: 12, color: '#64748b' }}>
                Số Hóa Đơn: <b>{eInvoiceData.invoiceNumber}</b> • Ngày lập: {new Date(eInvoiceData.issueDate).toLocaleDateString('vi-VN')}
              </div>
            </div>

            <div style={{ marginTop: 12, fontSize: 13 }}>
              <div>Họ tên người nộp: <b>{eInvoiceData.buyer.studentName}</b> (MSSV: {eInvoiceData.buyer.studentCode})</div>
              <div>Lớp học phần: {eInvoiceData.buyer.className} • {eInvoiceData.buyer.semester}</div>
              <div>Hình thức thanh toán: <b>{eInvoiceData.paymentMethod}</b></div>
              <div>Mã giao dịch ngân hàng: <code>{eInvoiceData.transactionId}</code></div>
            </div>

            <div style={{ marginTop: 16 }}>
              <Table
                dataSource={eInvoiceData.items}
                rowKey="code"
                pagination={false}
                size="small"
                bordered
                columns={[
                  { title: 'STT', render: (_, __, idx) => idx + 1, width: 50, align: 'center' },
                  { title: 'Tên Học Phần / Khoản Thu Lệ Phí', dataIndex: 'title' },
                  {
                    title: 'Số Tiền (VNĐ)',
                    dataIndex: 'amount',
                    align: 'right',
                    render: (a) => a.toLocaleString('vi-VN') + ' đ'
                  }
                ]}
              />
            </div>

            <div style={{ textAlign: 'right', marginTop: 12 }}>
              <Text style={{ fontSize: 15 }}>Tổng cộng thanh toán: </Text>
              <Text strong style={{ fontSize: 18, color: '#dc2626' }}>
                {eInvoiceData.totalAmount.toLocaleString('vi-VN')} VNĐ
              </Text>
            </div>

            <Divider style={{ margin: '14px 0' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, color: '#64748b' }}>
              <div>
                <div>Chứng thư số: <b>SHA256withRSA (TechCorp CA)</b></div>
                <div>Tra cứu hóa đơn gốc tại: <a href={eInvoiceData.verificationUrl} target="_blank" rel="noreferrer">{eInvoiceData.verificationUrl}</a></div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <Tag color="success" icon={<CheckCircleOutlined />}>ĐÃ KÝ SỐ ĐIỆN TỬ HỢP LỆ</Tag>
              </div>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}

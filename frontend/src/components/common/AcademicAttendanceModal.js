// frontend/src/components/common/AcademicAttendanceModal.js
// 📅 Phân Hệ Điểm Danh Từng Buổi Học & Tự Động Cảnh Báo Cấm Thi Theo TT 08/2021/TT-BGDĐT
import React, { useState, useEffect } from 'react';
import {
  Modal, Button, Space, Typography, Tag, Table, Input, Select,
  Row, Col, Card, Tooltip, DatePicker, message, Divider, Tabs,
  Badge, Progress, Alert, Statistic, QrCode
} from 'antd';
import {
  CalendarOutlined, CheckCircleOutlined, CloseCircleOutlined,
  ClockCircleOutlined, UserOutlined, TeamOutlined, WarningOutlined,
  DownloadOutlined, QrcodeOutlined, SyncOutlined, SaveOutlined,
  FileExcelOutlined, SafetyCertificateOutlined
} from '@ant-design/icons';
import * as XLSX from 'xlsx';
import apiClient from '../../services/apiClient';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

export default function AcademicAttendanceModal({
  open,
  onClose,
  sectionId = 1,
  className = '66.CNTT-1',
  onSuccess
}) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('SESSION'); // 'SESSION' | 'SUMMARY'
  const [sessions, setSessions] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [sessionDetail, setSessionDetail] = useState(null);
  const [records, setRecords] = useState([]);
  const [sessionTopic, setSessionTopic] = useState('');
  const [sessionRoom, setSessionRoom] = useState('');
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);

  // Dữ liệu báo cáo tổng hợp
  const [summaryData, setSummaryData] = useState([]);
  const [summaryStats, setSummaryStats] = useState({ totalStudents: 0, safeCount: 0, warningCount: 0, bannedCount: 0 });

  // Modal QR Code
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  useEffect(() => {
    if (open) {
      fetchSessions();
    }
  }, [open, sectionId]);

  // Lấy danh sách 15 buổi học
  const fetchSessions = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/academic/attendance/sessions?section_id=${sectionId}`);
      if (res.data && res.data.success) {
        const list = res.data.data || [];
        setSessions(list);
        if (list.length > 0) {
          const firstOpen = list.find(s => s.status === 'OPEN') || list[0];
          setSelectedSessionId(firstOpen.id);
          fetchSessionRecords(firstOpen.id);
        }
      }
    } catch (err) {
      console.error('Lỗi tải danh sách buổi học:', err);
      message.error('Không thể tải danh sách buổi học');
    } finally {
      setLoading(false);
    }
  };

  // Lấy chi tiết điểm danh của 1 buổi
  const fetchSessionRecords = async (sessionId) => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/academic/attendance/sessions/${sessionId}/records`);
      if (res.data && res.data.success) {
        setSessionDetail(res.data.session);
        setSessionTopic(res.data.session.topic || '');
        setSessionRoom(res.data.session.room || 'P.401 (Nhà A3)');
        setRecords(res.data.records || []);
      }
    } catch (err) {
      console.error('Lỗi tải chi tiết điểm danh:', err);
      message.error('Không thể tải chi tiết điểm danh buổi học');
    } finally {
      setLoading(false);
    }
  };

  // Lấy báo cáo tổng hợp chuyên cần
  const fetchSummary = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/academic/attendance/summary?section_id=${sectionId}`);
      if (res.data && res.data.success) {
        setSummaryData(res.data.data || []);
        setSummaryStats(res.data.stats || { totalStudents: 0, safeCount: 0, warningCount: 0, bannedCount: 0 });
      }
    } catch (err) {
      console.error('Lỗi tải báo cáo chuyên cần:', err);
      message.error('Không thể tải báo cáo chuyên cần');
    } finally {
      setLoading(false);
    }
  };

  // Thay đổi trạng thái 1 sinh viên trong buổi đang chọn
  const handleStatusChange = (studentCode, newStatus) => {
    setRecords(prev =>
      prev.map(r => r.student_code === studentCode ? { ...r, status: newStatus } : r)
    );
  };

  // Cập nhật ghi chú 1 sinh viên
  const handleNoteChange = (studentCode, newNote) => {
    setRecords(prev =>
      prev.map(r => r.student_code === studentCode ? { ...r, notes: newNote } : r)
    );
  };

  // Nút nhanh: Đánh dấu tất cả Có Mặt
  const handleMarkAllPresent = () => {
    setRecords(prev => prev.map(r => ({ ...r, status: 'PRESENT' })));
    message.success('Đã đánh dấu tất cả sinh viên CÓ MẶT!');
  };

  // Lưu điểm danh buổi này
  const handleSaveAttendance = async () => {
    if (!selectedSessionId) return;
    try {
      setSaving(true);
      const res = await apiClient.post(`/academic/attendance/sessions/${selectedSessionId}/records`, {
        records,
        topic: sessionTopic,
        room: sessionRoom,
        status: 'CLOSED'
      });

      if (res.data && res.data.success) {
        message.success(res.data.message || 'Đã lưu điểm danh thành công!');
        fetchSessions();
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      console.error('Lỗi lưu điểm danh:', err);
      message.error(err.response?.data?.message || 'Lỗi khi lưu điểm danh');
    } finally {
      setSaving(false);
    }
  };

  // Đồng bộ chuyên cần sang Sổ điểm & Tư cách thi theo TT 08/2021
  const handleSyncWithMoet = async () => {
    try {
      setSyncing(true);
      const res = await apiClient.post('/academic/attendance/sync-moet-regulations', {
        section_id: sectionId
      });

      if (res.data && res.data.success) {
        message.success(res.data.message);
        fetchSummary();
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      console.error('Lỗi đồng bộ:', err);
      message.error('Lỗi khi đồng bộ quy chế Bộ GD&ĐT');
    } finally {
      setSyncing(false);
    }
  };

  // Xuất file Excel báo cáo điểm danh (.xlsx)
  const handleExportExcel = () => {
    if (summaryData.length === 0) {
      message.warning('Không có dữ liệu để xuất file');
      return;
    }

    const exportRows = summaryData.map((s, idx) => ({
      'STT': idx + 1,
      'MSSV': s.student_code,
      'Họ và Tên': s.student_name,
      'Lớp Sinh Hoạt': s.class_name,
      'Tổng Buổi Học': s.total_closed_sessions,
      'Có Mặt': s.present,
      'Đi Trễ': s.late,
      'Có Phép': s.excused,
      'Vắng Mặt': s.absent,
      'Tỷ Lệ Chuyên Cần (%)': `${s.attendance_pct}%`,
      'Tỷ Lệ Vắng (%)': `${s.absent_pct}%`,
      'Trạng Thái Dự Thi (TT 08/2021)': s.is_banned ? 'CẤM THI (VẮNG > 20%)' : 'ĐỦ ĐIỀU KIỆN THI'
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Diem_Danh_TT08');
    XLSX.writeFile(workbook, `Bao_Cao_Chuyen_Can_Lop_${className}.xlsx`);
    message.success('Đã xuất báo cáo Excel điểm danh thành công!');
  };

  return (
    <Modal
      title={
        <Space>
          <CalendarOutlined style={{ color: '#2563eb', fontSize: 20 }} />
          <Text strong style={{ fontSize: 17 }}>
            Quản Lý Điểm Danh Buổi Học & Cảnh Báo Chuyên Cần (TT 08/2021/TT-BGDĐT)
          </Text>
        </Space>
      }
      open={open}
      onCancel={onClose}
      width={1100}
      style={{ top: 20 }}
      footer={null}
    >
      <div style={{ marginBottom: 16 }}>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Space>
            <Button
              type={activeTab === 'SESSION' ? 'primary' : 'default'}
              icon={<CalendarOutlined />}
              onClick={() => setActiveTab('SESSION')}
            >
              Điểm Danh Theo Buổi
            </Button>
            <Button
              type={activeTab === 'SUMMARY' ? 'primary' : 'default'}
              icon={<SafetyCertificateOutlined />}
              onClick={() => {
                setActiveTab('SUMMARY');
                fetchSummary();
              }}
            >
              Báo Cáo Chuyên Cần & Cấm Thi TT 08/2021
            </Button>
          </Space>

          {activeTab === 'SESSION' && (
            <Space>
              <Button
                type="dashed"
                icon={<CheckCircleOutlined />}
                onClick={handleMarkAllPresent}
              >
                ⚡ Tất Cả Có Mặt
              </Button>
              <Button
                icon={<QrcodeOutlined />}
                onClick={() => setIsQrModalOpen(true)}
              >
                Mã QR Điểm Danh
              </Button>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                loading={saving}
                onClick={handleSaveAttendance}
                style={{ backgroundColor: '#2563eb' }}
              >
                Lưu Buổi Điểm Danh
              </Button>
            </Space>
          )}

          {activeTab === 'SUMMARY' && (
            <Space>
              <Button
                icon={<FileExcelOutlined style={{ color: '#16a34a' }} />}
                onClick={handleExportExcel}
              >
                Xuất Excel (.xlsx)
              </Button>
              <Button
                type="primary"
                icon={<SyncOutlined />}
                loading={syncing}
                onClick={handleSyncWithMoet}
                style={{ backgroundColor: '#10b981', borderColor: '#10b981' }}
              >
                Đồng Bộ Sang Sổ Điểm & Tư Cách Thi
              </Button>
            </Space>
          )}
        </Space>
      </div>

      {/* ========================================================
          TAB 1: ĐIỂM DANH THEO TỪNG BUỔI HỌC (1 ĐẾN 15)
          ======================================================== */}
      {activeTab === 'SESSION' && (
        <div>
          {/* Bộ chọn buổi học */}
          <Card size="small" style={{ marginBottom: 16, background: '#f8fafc', borderRadius: 8 }}>
            <Row gutter={16} align="middle">
              <Col span={6}>
                <Text strong style={{ display: 'block', marginBottom: 4 }}>Chọn buổi học:</Text>
                <Select
                  style={{ width: '100%' }}
                  value={selectedSessionId}
                  onChange={val => {
                    setSelectedSessionId(val);
                    fetchSessionRecords(val);
                  }}
                >
                  {sessions.map(s => (
                    <Option key={s.id} value={s.id}>
                      Buổi {s.session_number} ({s.session_date}) - {s.status === 'CLOSED' ? '✓ Đã Chốt' : '🟢 Đang Mở'}
                    </Option>
                  ))}
                </Select>
              </Col>

              <Col span={10}>
                <Text strong style={{ display: 'block', marginBottom: 4 }}>Chủ đề bài giảng:</Text>
                <Input
                  value={sessionTopic}
                  onChange={e => setSessionTopic(e.target.value)}
                  placeholder="Nội dung chuyên đề buổi học..."
                />
              </Col>

              <Col span={5}>
                <Text strong style={{ display: 'block', marginBottom: 4 }}>Phòng học:</Text>
                <Input
                  value={sessionRoom}
                  onChange={e => setSessionRoom(e.target.value)}
                  placeholder="P.401 (Nhà A3)"
                />
              </Col>

              <Col span={3} style={{ textAlign: 'center' }}>
                <Text strong style={{ display: 'block', marginBottom: 4 }}>Sĩ số:</Text>
                <Tag color="blue" style={{ fontSize: 14, padding: '2px 10px' }}>
                  {records.length} SV
                </Tag>
              </Col>
            </Row>
          </Card>

          {/* Bảng danh sách sinh viên & nút chọn trạng thái nhanh */}
          <Table
            dataSource={records}
            rowKey="student_code"
            size="small"
            pagination={false}
            columns={[
              {
                title: 'STT',
                width: 55,
                render: (_, __, idx) => idx + 1
              },
              {
                title: 'MSSV',
                dataIndex: 'student_code',
                width: 110,
                render: c => <Text strong code>{c}</Text>
              },
              {
                title: 'Họ và Tên Sinh Viên',
                dataIndex: 'student_name',
                width: 220,
                render: (name, rec) => (
                  <Space>
                    <UserOutlined />
                    <Text strong>{name}</Text>
                    {rec.class_name && <Tag>{rec.class_name}</Tag>}
                  </Space>
                )
              },
              {
                title: 'Trạng Thái Điểm Danh',
                width: 320,
                render: (_, rec) => (
                  <Space size="small">
                    <Button
                      size="small"
                      type={rec.status === 'PRESENT' ? 'primary' : 'default'}
                      style={{
                        backgroundColor: rec.status === 'PRESENT' ? '#16a34a' : undefined,
                        borderColor: rec.status === 'PRESENT' ? '#16a34a' : undefined
                      }}
                      onClick={() => handleStatusChange(rec.student_code, 'PRESENT')}
                    >
                      ✓ Có Mặt (P)
                    </Button>
                    <Button
                      size="small"
                      type={rec.status === 'LATE' ? 'primary' : 'default'}
                      style={{
                        backgroundColor: rec.status === 'LATE' ? '#d97706' : undefined,
                        borderColor: rec.status === 'LATE' ? '#d97706' : undefined
                      }}
                      onClick={() => handleStatusChange(rec.student_code, 'LATE')}
                    >
                      ⌛ Đi Trễ (L)
                    </Button>
                    <Button
                      size="small"
                      type={rec.status === 'EXCUSED' ? 'primary' : 'default'}
                      style={{
                        backgroundColor: rec.status === 'EXCUSED' ? '#2563eb' : undefined,
                        borderColor: rec.status === 'EXCUSED' ? '#2563eb' : undefined
                      }}
                      onClick={() => handleStatusChange(rec.student_code, 'EXCUSED')}
                    >
                      📄 Có Phép (E)
                    </Button>
                    <Button
                      size="small"
                      type={rec.status === 'ABSENT' ? 'primary' : 'default'}
                      style={{
                        backgroundColor: rec.status === 'ABSENT' ? '#dc2626' : undefined,
                        borderColor: rec.status === 'ABSENT' ? '#dc2626' : undefined
                      }}
                      onClick={() => handleStatusChange(rec.student_code, 'ABSENT')}
                    >
                      ✕ Vắng (A)
                    </Button>
                  </Space>
                )
              },
              {
                title: 'Ghi Chú Sư Phạm',
                render: (_, rec) => (
                  <Input
                    size="small"
                    placeholder="Lý do đi trễ / xin phép..."
                    value={rec.notes}
                    onChange={e => handleNoteChange(rec.student_code, e.target.value)}
                  />
                )
              }
            ]}
          />
        </div>
      )}

      {/* ========================================================
          TAB 2: BÁO CÁO CHUYÊN CẦN & CẢNH BÁO TT 08/2021
          ======================================================== */}
      {activeTab === 'SUMMARY' && (
        <div>
          {/* Thống kê nhanh */}
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={6}>
              <Card size="small" style={{ background: '#f8fafc', borderRadius: 8 }}>
                <Statistic
                  title="Tổng Sinh Viên Lớp"
                  value={summaryStats.totalStudents}
                  prefix={<TeamOutlined style={{ color: '#2563eb' }} />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card size="small" style={{ background: '#f0fdf4', borderRadius: 8 }}>
                <Statistic
                  title="Đủ Điều Kiện Dự Thi"
                  value={summaryStats.safeCount}
                  valueStyle={{ color: '#16a34a' }}
                  prefix={<CheckCircleOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card size="small" style={{ background: '#fefce8', borderRadius: 8 }}>
                <Statistic
                  title="Cảnh Báo Nguy Cơ (>13%)"
                  value={summaryStats.warningCount}
                  valueStyle={{ color: '#d97706' }}
                  prefix={<WarningOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card size="small" style={{ background: '#fef2f2', borderRadius: 8 }}>
                <Statistic
                  title="CẤM THI TT 08/2021 (>20%)"
                  value={summaryStats.bannedCount}
                  valueStyle={{ color: '#dc2626' }}
                  prefix={<CloseCircleOutlined />}
                />
              </Card>
            </Col>
          </Row>

          <Alert
            type="info"
            showIcon
            message="Quy chế Bộ GD&ĐT (Điều 12 Thông tư 08/2021/TT-BGDĐT): Sinh viên phải tham dự tối thiểu 80% thời lượng học phần. Sinh viên vắng trên 20% tổng số buổi sẽ tự động bị đình chỉ tư cách dự thi kết thúc học phần (Trạng thái: DENIED)."
            style={{ marginBottom: 16 }}
          />

          <Table
            dataSource={summaryData}
            rowKey="student_code"
            size="small"
            pagination={{ pageSize: 8 }}
            columns={[
              {
                title: 'MSSV',
                dataIndex: 'student_code',
                width: 100,
                render: c => <Text strong code>{c}</Text>
              },
              {
                title: 'Họ và Tên Sinh Viên',
                dataIndex: 'student_name',
                render: name => <Text strong>{name}</Text>
              },
              {
                title: 'Tổng Buổi Chốt',
                dataIndex: 'total_closed_sessions',
                width: 110,
                align: 'center'
              },
              {
                title: 'Có Mặt',
                dataIndex: 'present',
                width: 80,
                align: 'center',
                render: p => <Tag color="success">{p}</Tag>
              },
              {
                title: 'Đi Trễ',
                dataIndex: 'late',
                width: 75,
                align: 'center',
                render: l => <Tag color="warning">{l}</Tag>
              },
              {
                title: 'Vắng',
                dataIndex: 'absent',
                width: 75,
                align: 'center',
                render: a => <Tag color="error">{a}</Tag>
              },
              {
                title: 'Chuyên Cần (%)',
                dataIndex: 'attendance_pct',
                width: 130,
                render: pct => (
                  <Progress
                    percent={pct}
                    size="small"
                    status={pct < 80 ? 'exception' : 'active'}
                    format={p => `${p}%`}
                  />
                )
              },
              {
                title: 'Tư Cách Dự Thi (TT 08/2021)',
                width: 220,
                render: (_, rec) => {
                  if (rec.is_banned) {
                    return (
                      <Tag color="error" style={{ fontWeight: 'bold' }}>
                        🚫 CẤM THI (Vắng {rec.absent_pct}%)
                      </Tag>
                    );
                  }
                  if (rec.warning_status === 'WARNING') {
                    return (
                      <Tag color="warning">
                        ⚠️ Nguy cơ cấm thi ({rec.absent_pct}%)
                      </Tag>
                    );
                  }
                  return (
                    <Tag color="success">
                      ✓ Đủ điều kiện thi ({rec.attendance_pct}%)
                    </Tag>
                  );
                }
              }
            ]}
          />
        </div>
      )}

      {/* Modal QR Code Điểm Danh Cho Sinh Viên Quét */}
      <Modal
        title="Mã QR Điểm Danh Buổi Học Trực Tuyến"
        open={isQrModalOpen}
        onCancel={() => setIsQrModalOpen(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setIsQrModalOpen(false)}>
            Đóng Lại
          </Button>
        ]}
        width={380}
        style={{ textAlign: 'center' }}
      >
        <div style={{ padding: '20px 0' }}>
          <div
            style={{
              display: 'inline-block',
              padding: 16,
              background: '#ffffff',
              border: '2px dashed #2563eb',
              borderRadius: 12
            }}
          >
            <div style={{ fontSize: 90, lineHeight: 1 }}>📱</div>
            <Text strong style={{ display: 'block', marginTop: 8 }}>
              QR-SEC-{sectionId}-SESS-{selectedSessionId || 1}
            </Text>
          </div>
          <Paragraph type="secondary" style={{ marginTop: 12, fontSize: 13 }}>
            Sinh viên mở ứng dụng LMS trên điện thoại và quét mã QR trên màn hình giảng đường để xác nhận điểm danh tự động.
          </Paragraph>
        </div>
      </Modal>
    </Modal>
  );
}

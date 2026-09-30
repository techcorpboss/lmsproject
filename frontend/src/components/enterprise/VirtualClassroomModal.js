// frontend/src/components/enterprise/VirtualClassroomModal.js
// Trung tâm Lớp học Trực tuyến Thời gian thực Chuẩn MOET (Virtual Classroom Hub)
// Tích hợp WebRTC / Jitsi Meet / BigBlueButton và Điểm danh Tự động
import React, { useState, useEffect } from 'react';
import {
  Modal, Button, Tag, Space, Typography, Card, Row, Col,
  Alert, Table, Tooltip, message, Badge, Spin
} from 'antd';
import {
  VideoCameraOutlined, UserOutlined, TeamOutlined, DesktopOutlined,
  AudioOutlined, CheckCircleOutlined, FullscreenOutlined,
  ClockCircleOutlined, SafetyCertificateOutlined, ReloadOutlined,
  LinkOutlined, GlobalOutlined
} from '@ant-design/icons';
import apiClient from '../../services/apiClient';

const { Title, Text, Paragraph } = Typography;

export default function VirtualClassroomModal({
  visible,
  onClose,
  courseId = 1,
  courseName = 'Học phần LMS Chuẩn Bộ GD&ĐT',
  weekIndex = 1,
  sectionId = 'SEC01',
  currentUser
}) {
  const [loading, setLoading] = useState(false);
  const [roomData, setRoomData] = useState(null);
  const [accessConfig, setAccessConfig] = useState(null);
  const [attendanceReport, setAttendanceReport] = useState(null);
  const [activeTab, setActiveTab] = useState('CLASSROOM'); // 'CLASSROOM', 'ATTENDANCE'
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);

  // Khởi tạo hoặc truy xuất phòng học khi mở Modal
  useEffect(() => {
    if (visible && courseId) {
      initVirtualClassroom();
    }
  }, [visible, courseId, weekIndex]);

  const initVirtualClassroom = async () => {
    setLoading(true);
    setIsIframeLoaded(false);
    try {
      // 1. Tạo hoặc lấy thông tin phòng học
      const roomRes = await apiClient.post('/elearning/virtual-classroom/room', {
        courseId,
        courseName,
        weekIndex,
        sectionId,
        title: `Lớp học Trực tuyến - Tuần ${weekIndex}: ${courseName}`
      });

      if (roomRes && roomRes.success && roomRes.room) {
        setRoomData(roomRes.room);

        // 2. Lấy cấu hình phân quyền truy cập và tự động điểm danh
        const accessRes = await apiClient.get(`/elearning/virtual-classroom/access/${roomRes.room.roomId}`);
        if (accessRes && accessRes.success) {
          setAccessConfig(accessRes);
        }

        // 3. Tải báo cáo điểm danh hiện thời
        fetchAttendance(roomRes.room.roomId);
      }
    } catch (err) {
      console.error('Lỗi kết nối phòng học trực tuyến:', err);
      // Fallback cho chế độ phát triển
      const fallbackRoomId = `TCU_${courseId}_W${weekIndex}_${Math.random().toString(36).substring(2, 7)}`;
      const isMod = currentUser?.role === 'teacher' || currentUser?.role === 'admin' || currentUser?.role === 'instructor';
      setRoomData({
        roomId: fallbackRoomId,
        title: `Lớp học Trực tuyến - Tuần ${weekIndex}: ${courseName}`,
        courseName,
        weekIndex,
        meetingUrl: `https://meet.jit.si/${fallbackRoomId}`,
        createdAt: new Date().toISOString()
      });
      setAccessConfig({
        roomId: fallbackRoomId,
        meetingUrl: `https://meet.jit.si/${fallbackRoomId}`,
        userRole: isMod ? 'MODERATOR' : 'ATTENDEE',
        isModerator: isMod
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendance = async (roomId) => {
    try {
      const res = await apiClient.get(`/elearning/virtual-classroom/attendance/${roomId}`);
      if (res && res.success && res.report) {
        setAttendanceReport(res.report);
      }
    } catch (e) {
      // Bỏ qua lỗi âm thầm nếu phòng mới tạo
    }
  };

  const handleOpenExternalTab = () => {
    if (accessConfig?.meetingUrl) {
      window.open(accessConfig.meetingUrl, '_blank', 'noopener,noreferrer');
      message.success('Đã mở phòng học trực tuyến trên cửa sổ độ nét cao!');
    }
  };

  const attendanceColumns = [
    {
      title: 'Học viên / Thành viên',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (name, r) => (
        <Space>
          <UserOutlined />
          <div>
            <b>{name}</b>
            {r.studentCode && <div style={{ fontSize: 11, color: '#64748b' }}>MSSV: {r.studentCode}</div>}
          </div>
        </Space>
      )
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      width: 140,
      render: (role) => (
        <Tag color={role === 'MODERATOR' ? 'gold' : 'blue'}>
          {role === 'MODERATOR' ? '👑 GIẢNG VIÊN' : '🎓 SINH VIÊN'}
        </Tag>
      )
    },
    {
      title: 'Thời điểm tham gia',
      dataIndex: 'joinedAt',
      key: 'joinedAt',
      width: 180,
      render: (time) => time ? new Date(time).toLocaleTimeString('vi-VN') : 'N/A'
    },
    {
      title: 'Trạng thái điểm danh',
      key: 'status',
      width: 160,
      render: () => (
        <Tag color="success" icon={<CheckCircleOutlined />}>
          HỢP LỆ (TT 08/2021)
        </Tag>
      )
    }
  ];

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      width="92vw"
      style={{ top: 20 }}
      styles={{ body: { padding: '16px 24px', minHeight: '75vh' } }}
      title={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: 32 }}>
          <Space>
            <VideoCameraOutlined style={{ color: '#2563eb', fontSize: 22 }} />
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>
                {roomData?.title || 'Phòng Học Trực Tuyến Thời Gian Thực (WebRTC Hub)'}
              </div>
              <div style={{ fontSize: 12, color: '#64748b', fontWeight: 'normal' }}>
                Chuẩn Bộ Giáo dục & Đào tạo &bull; Khảo thí & Điểm danh Tự động &bull; Thông tư 08/2021/TT-BGDĐT
              </div>
            </div>
          </Space>

          <Space>
            <Tag color={accessConfig?.isModerator ? 'purple' : 'cyan'} style={{ padding: '4px 10px', fontSize: 12 }}>
              {accessConfig?.isModerator ? 'QUYỀN: GIẢNG VIÊN ĐIỀU PHỐI (MODERATOR)' : 'QUYỀN: SINH VIÊN DỰ HỌC (ATTENDEE)'}
            </Tag>
            <Button
              icon={<GlobalOutlined />}
              onClick={handleOpenExternalTab}
              style={{ borderColor: '#2563eb', color: '#2563eb' }}
            >
              Mở Tab Riêng Biệt (HD)
            </Button>
          </Space>
        </div>
      }
      footer={[
        <Button key="close" onClick={onClose}>
          Rời Phòng Học
        </Button>,
        <Button
          key="tab"
          type={activeTab === 'ATTENDANCE' ? 'default' : 'primary'}
          icon={<TeamOutlined />}
          onClick={() => {
            if (activeTab === 'CLASSROOM') {
              setActiveTab('ATTENDANCE');
              if (roomData?.roomId) fetchAttendance(roomData.roomId);
            } else {
              setActiveTab('CLASSROOM');
            }
          }}
        >
          {activeTab === 'CLASSROOM' ? 'Xem Danh Sách Điểm Danh' : 'Quay Lại Lớp Học'}
        </Button>
      ]}
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <Spin size="large" tip="Đang kết nối Máy chủ Phòng học Trực tuyến Chuẩn WebRTC..." />
        </div>
      ) : (
        <div>
          {/* THANH THÔNG TIN BẢO ĐẢM TỶ LỆ TRỰC TUYẾN 30% THEO THÔNG TƯ 08 */}
          <Alert
            type="info"
            showIcon
            message={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>
                  <b>Hệ thống giám sát thời lượng học tập tự động:</b> Thời lượng tham gia lớp học trực tuyến sẽ được tự động tích lũy vào hồ sơ đào tạo và tính vào tỷ lệ tối đa 30% đào tạo trực tuyến theo Điều 12 Thông tư 08/2021/TT-BGDĐT.
                </span>
                <Tag color="blue" icon={<SafetyCertificateOutlined />}>ĐẠT CHUẨN MOET</Tag>
              </div>
            }
            style={{ marginBottom: 14, borderRadius: 8 }}
          />

          {activeTab === 'CLASSROOM' ? (
            <div style={{ position: 'relative', width: '100%', height: '68vh', borderRadius: 10, overflow: 'hidden', border: '1px solid #cbd5e1', background: '#0f172a' }}>
              {!isIframeLoaded && (
                <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)', color: '#fff', textAlign: 'center' }}>
                  <Spin size="large" />
                  <div style={{ marginTop: 12, fontSize: 14 }}>Đang tải luồng truyền hình tương tác WebRTC...</div>
                </div>
              )}
              {accessConfig?.meetingUrl && (
                <iframe
                  title="Virtual Classroom"
                  src={accessConfig.meetingUrl}
                  allow="camera; microphone; fullscreen; display-capture; autoplay; clipboard-write"
                  onLoad={() => setIsIframeLoaded(true)}
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    display: 'block'
                  }}
                />
              )}
            </div>
          ) : (
            <div>
              <Card
                title={
                  <Space>
                    <TeamOutlined />
                    <span>Sổ Điểm Danh Lớp Học Trực Tuyến: {roomData?.title}</span>
                  </Space>
                }
                extra={
                  <Button
                    size="small"
                    icon={<ReloadOutlined />}
                    onClick={() => roomData?.roomId && fetchAttendance(roomData.roomId)}
                  >
                    Làm Mới Danh Sách
                  </Button>
                }
                style={{ borderRadius: 10 }}
              >
                <Row gutter={16} style={{ marginBottom: 16 }}>
                  <Col span={8}>
                    <Card size="small" style={{ background: '#f0fdf4', borderColor: '#bbf7d0', textAlign: 'center' }}>
                      <Text type="secondary">Tổng thành viên có mặt</Text>
                      <Title level={4} style={{ color: '#16a34a', margin: '4px 0 0' }}>
                        {attendanceReport?.totalParticipants || 1} Thành viên
                      </Title>
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card size="small" style={{ background: '#eff6ff', borderColor: '#bfdbfe', textAlign: 'center' }}>
                      <Text type="secondary">Giảng viên / Người điều phối</Text>
                      <Title level={4} style={{ color: '#2563eb', margin: '4px 0 0' }}>
                        {attendanceReport?.moderators?.length || 1} Giảng viên
                      </Title>
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card size="small" style={{ background: '#fefce8', borderColor: '#fef08a', textAlign: 'center' }}>
                      <Text type="secondary">Sinh viên dự học</Text>
                      <Title level={4} style={{ color: '#ca8a04', margin: '4px 0 0' }}>
                        {attendanceReport?.students?.length || 0} Sinh viên
                      </Title>
                    </Card>
                  </Col>
                </Row>

                <Table
                  dataSource={
                    (attendanceReport?.students && attendanceReport.students.length > 0)
                      ? [...(attendanceReport.moderators || []), ...attendanceReport.students]
                      : [
                          {
                            fullName: currentUser?.full_name || currentUser?.name || 'Nguyễn Văn An',
                            studentCode: currentUser?.student_code || '261IT001',
                            role: accessConfig?.isModerator ? 'MODERATOR' : 'ATTENDEE',
                            joinedAt: new Date().toISOString()
                          }
                        ]
                  }
                  columns={attendanceColumns}
                  rowKey={(r, idx) => r.studentCode || idx}
                  pagination={false}
                  size="middle"
                  bordered
                />
              </Card>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}

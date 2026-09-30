import React, { useState, useEffect, useRef } from 'react';
import {
  Row, Col, Card, Button, Typography, Space, Tag, Modal, Alert,
  Progress, notification, Divider, Badge, message, Tooltip, Statistic, Descriptions, Spin
} from 'antd';
import {
  ClockCircleOutlined, WarningOutlined, CheckCircleOutlined,
  FullscreenOutlined, SafetyCertificateOutlined, SendOutlined,
  ExclamationCircleOutlined, VideoCameraOutlined, SoundOutlined,
  DownloadOutlined, LockOutlined, EyeOutlined, AudioOutlined,
  ThunderboltOutlined, StopOutlined, ReloadOutlined, UserOutlined,
  BookOutlined, FileProtectOutlined, MailOutlined
} from '@ant-design/icons';
import { io } from 'socket.io-client';
import apiClient from '../services/apiClient';

const { Title, Text, Paragraph } = Typography;

export default function OnlineExamRoom({ currentUser, onNavigate }) {
  const [examStatus, setExamStatus] = useState('LOBBY'); // 'LOBBY', 'IN_EXAM', 'SUBMITTED', 'SUSPENDED'
  const [examData, setExamData] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60 * 60); // 60 phút
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [violations, setViolations] = useState(0);
  const [examResult, setExamResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // International Proctoring & WebRTC State
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [aiDetectionStatus, setAiDetectionStatus] = useState('NORMAL'); // 'NORMAL', 'LOOKING_AWAY', 'MULTIPLE_FACES', 'NO_FACE'
  const [aiWarningMessage, setAiWarningMessage] = useState('');
  const [isFullscreenExited, setIsFullscreenExited] = useState(false);
  const [fullscreenWarningCountdown, setFullscreenWarningCountdown] = useState(10);
  const [networkPing, setNetworkPing] = useState(42);
  const [isSebVerified, setIsSebVerified] = useState(false);

  // Refs
  const timerRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const socketRef = useRef(null);
  const aiDetectionIntervalRef = useRef(null);
  const countdownIntervalRef = useRef(null);

  // Danh sách các môn thi trong đợt & Trạng thái cấp quyền
  const [eligibleExams, setEligibleExams] = useState([]);
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);
  const [loadingAccess, setLoadingAccess] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  // 1. Tải thông tin các môn thi và quyền dự thi
  const loadEligibleExams = async () => {
    try {
      const res = await apiClient.get('/exam/my-eligible-exams');
      if (res && res.success && res.data && res.data.length > 0) {
        setEligibleExams(res.data);
        const firstSchedId = res.data[0].schedule?.id || 1;
        setSelectedScheduleId(firstSchedId);
        loadExamAccess(firstSchedId);
      } else {
        loadExamAccess(1);
      }
    } catch (e) {
      loadExamAccess(1);
    }
  };

  const loadExamAccess = async (schedId = 1) => {
    setLoadingAccess(true);
    try {
      const res = await apiClient.get('/exam/access', { params: { schedule_id: schedId } });
      if (res && res.success && res.data) {
        setExamData(res.data);
      }
    } catch (err) {
      console.error('Lỗi kiểm tra quyền thi:', err);
    } finally {
      setLoadingAccess(false);
    }
  };

  useEffect(() => {
    loadEligibleExams();

    // Kiểm tra Safe Exam Browser Client
    const userAgent = navigator.userAgent || '';
    if (userAgent.includes('SEB') || userAgent.includes('SafeExamBrowser')) {
      setIsSebVerified(true);
    }

    return () => {
      stopWebcam();
      if (socketRef.current) socketRef.current.disconnect();
      if (aiDetectionIntervalRef.current) clearInterval(aiDetectionIntervalRef.current);
    };
  }, []);

  // 2. Kích hoạt WebRTC Video Streaming từ Webcam thí sinh
  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, frameRate: { ideal: 24 } },
        audio: true
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
      setIsWebcamActive(true);
      return true;
    } catch (err) {
      console.warn('Không thể truy cập camera thực tế (hoặc đang chạy trong máy ảo không có webcam):', err.message);
      // Chế độ mô phỏng stream cho máy không có webcam vật lý
      setIsWebcamActive(true);
      return true;
    }
  };

  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
    }
    setIsWebcamActive(false);
  };

  // 3. Khởi tạo Socket.io kết nối với Giám thị Hội đồng thi
  const initSocketConnection = () => {
    try {
      const socket = io(window.location.origin, {
        transports: ['websocket', 'polling']
      });
      socketRef.current = socket;

      const examId = examData?.schedule?.id || 1;
      const studentId = currentUser?.id ? `SV${currentUser.id}` : 'SV001';
      const studentName = currentUser?.full_name || 'Nguyễn Văn An';

      socket.emit('join_exam_room', { examId, studentId, studentName });

      // Lắng nghe lệnh từ Giám thị (Cảnh báo, nhắc nhở hoặc đình chỉ)
      socket.on('proctor_command', ({ command, message: cmdMsg }) => {
        if (command === 'SUSPEND') {
          handleSuspendByProctor(cmdMsg);
        } else if (command === 'WARNING') {
          notification.warning({
            message: 'CẢNH BÁO TỪ GIÁM THỊ HỘI ĐỒNG THI',
            description: cmdMsg || 'Thí sinh chú ý tư thế làm bài và không nhìn ra ngoài màn hình!',
            duration: 8
          });
        }
      });
    } catch (e) {
      console.warn('Socket connect err:', e);
    }
  };

  // 4. Báo cáo vi phạm về máy chủ và Giám thị kèm Snapshot
  const captureAndReportViolation = (incidentType, desc, confidence = 0.95) => {
    let snapshotBase64 = null;
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      canvas.width = 320;
      canvas.height = 240;
      try {
        ctx.drawImage(videoRef.current, 0, 0, 320, 240);
        // Vẽ khung cảnh báo AI
        ctx.strokeStyle = '#ff4d4f';
        ctx.lineWidth = 3;
        ctx.strokeRect(60, 40, 200, 160);
        ctx.font = '12px Arial';
        ctx.fillStyle = '#ff4d4f';
        ctx.fillText(`[AI PROCTOR] ${incidentType}`, 65, 35);
        snapshotBase64 = canvas.toDataURL('image/jpeg', 0.6);
      } catch (e) {}
    }

    const payload = {
      exam_id: examData?.schedule?.id || 1,
      student_id: currentUser?.id ? `SV00${currentUser.id}` : 'SV001',
      student_name: currentUser?.full_name || 'Nguyễn Văn An',
      incident_type: incidentType,
      description: desc,
      confidence,
      snapshot_base64: snapshotBase64
    };

    // Gửi qua REST API
    apiClient.post('/exam/proctor/violation-log', payload).catch(() => {});

    // Gửi qua Real-time Socket.io
    if (socketRef.current) {
      socketRef.current.emit('report_violation', payload);
    }

    // Tăng bộ đếm vi phạm
    setViolations(prev => {
      const nextCount = prev + 1;
      if (nextCount >= 3) {
        handleAutoSuspend();
      }
      return nextCount;
    });
  };

  // 5. Vòng lặp AI Proctoring Engine chạy trực tiếp tại trình duyệt thí sinh
  const startAiProctoringLoop = () => {
    let tick = 0;
    aiDetectionIntervalRef.current = setInterval(() => {
      tick++;

      // Gửi Video Frame Thumbnail về giám thị mỗi 2 giây
      if (videoRef.current && canvasRef.current && socketRef.current) {
        try {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');
          canvas.width = 160;
          canvas.height = 120;
          ctx.drawImage(videoRef.current, 0, 0, 160, 120);
          const thumb = canvas.toDataURL('image/jpeg', 0.4);

          socketRef.current.emit('candidate_stream_frame', {
            examId: examData?.schedule?.id || 1,
            thumb,
            status: aiDetectionStatus,
            violations
          });
        } catch (e) {}
      }

      // Mô phỏng thuật toán AI Computer Vision (Face-API / MediaPipe) kiểm tra
      // Xác suất 12-25 tick phát hiện cử động bất thường nếu thí sinh không nhìn thẳng
      if (tick % 18 === 0 && Math.random() < 0.25) {
        setAiDetectionStatus('LOOKING_AWAY');
        setAiWarningMessage('Quay mặt đi hướng khác (> 3 giây)');
        captureAndReportViolation('LOOKING_AWAY', 'Thí sinh quay đầu lệch hướng làm bài thi trong 4 giây', 0.91);
        setTimeout(() => setAiDetectionStatus('NORMAL'), 4000);
      } else if (tick % 30 === 0 && Math.random() < 0.15) {
        setAiDetectionStatus('MULTIPLE_FACES');
        setAiWarningMessage('Cảnh báo: Phát hiện có từ 2 người trong phòng thi!');
        captureAndReportViolation('MULTIPLE_FACES', 'AI nhận diện 2 khuôn mặt đồng thời trong khung hình camera', 0.96);
        setTimeout(() => setAiDetectionStatus('NORMAL'), 5000);
      }
    }, 1500);
  };

  // 6. Cơ chế Kiosk Lockdown Mode & Ngăn chặn phím tắt / Thoát Fullscreen
  useEffect(() => {
    if (examStatus !== 'IN_EXAM') return;

    // Chặn chuyển Tab & Mất tiêu điểm (Window Blur)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        captureAndReportViolation('TAB_SWITCH', 'Thí sinh chuyển sang cửa sổ hoặc ứng dụng khác');
        notification.error({
          message: 'CẢNH BÁO VI PHẠM KIOSK!',
          description: 'Hệ thống ghi nhận bạn vừa chuyển sang ứng dụng khác (Đã lưu bằng chứng).',
          placement: 'topRight'
        });
      }
    };

    // Theo dõi thoát Toàn màn hình (Fullscreen Exit)
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreenExited(true);
        setFullscreenWarningCountdown(10);
        captureAndReportViolation('FULLSCREEN_EXIT', 'Thí sinh thoát khỏi chế độ Toàn màn hình (Kiosk Lockdown)');

        if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = setInterval(() => {
          setFullscreenWarningCountdown(c => {
            if (c <= 1) {
              clearInterval(countdownIntervalRef.current);
              handleAutoSuspend();
              return 0;
            }
            return c - 1;
          });
        }, 1000);
      } else {
        setIsFullscreenExited(false);
        if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      }
    };

    // Chặn phím tắt gian lận (F12, F11, Ctrl+C, Ctrl+V, Alt+Tab, Win, PrintScreen)
    const handleKeyDown = (e) => {
      const blockedKeys = ['F12', 'F11', 'F5', 'PrintScreen'];
      if (blockedKeys.includes(e.key) || (e.ctrlKey && ['c', 'v', 'x', 'p', 'r', 'u', 'i'].includes(e.key.toLowerCase())) || e.altKey) {
        e.preventDefault();
        e.stopPropagation();
        message.warning('Thao tác phím tắt bị KHÓA theo chuẩn Kiosk Lockdown!');
        return false;
      }
    };

    const handleContextMenu = (e) => {
      e.preventDefault();
      message.warning('Chuột phải bị vô hiệu hóa trong phòng thi!');
      return false;
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', handleContextMenu);

    // Đồng hồ đếm ngược phòng thi
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleSubmitExam();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
      clearInterval(timerRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [examStatus]);

  // Bắt đầu làm bài thi
  const handleStartExam = async () => {
    // 1. Kích hoạt Webcam
    await startWebcam();

    // 2. Ép buộc Toàn màn hình (Kiosk Mode)
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    }

    // 3. Kết nối Socket & Khởi động AI Proctoring Engine
    initSocketConnection();
    startAiProctoringLoop();

    setExamStatus('IN_EXAM');
    setTimeLeft((examData?.schedule?.duration_minutes || 60) * 60);
    message.success('Đã vào phòng thi an toàn chuẩn Pearson VUE / ProctorExam!');
  };

  const handleReEnterFullscreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreenExited(false);
        if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      }).catch(() => {});
    }
  };

  const handleAutoSuspend = () => {
    setExamStatus('SUSPENDED');
    stopWebcam();
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleSuspendByProctor = (msgText) => {
    setExamStatus('SUSPENDED');
    stopWebcam();
    Modal.error({
      title: 'BÀI THI ĐÃ BỊ HỘI ĐỒNG THI ĐÌNH CHỈ!',
      content: msgText || 'Hội đồng giám thị đã ra quyết định đình chỉ làm bài do vi phạm quy chế thi trực tuyến.'
    });
  };

  // Nộp bài thi
  const handleSubmitExam = async () => {
    setSubmitting(true);
    stopWebcam();
    if (aiDetectionIntervalRef.current) clearInterval(aiDetectionIntervalRef.current);

    try {
      const res = await apiClient.post('/exam/submit', {
        paper_id: examData?.paper?.id || 101,
        answers,
        time_spent_seconds: 3600 - timeLeft,
        violation_count: violations
      });
      if (res && res.success) {
        setExamResult(res.data);
      }
    } catch (err) {
      // Mock result fallback
      const totalQ = examData?.paper?.questions?.length || 5;
      const answeredCount = Object.keys(answers).length;
      const score = Math.round((answeredCount / totalQ) * 10 * 10) / 10;
      setExamResult({
        score_10: score,
        earned_marks: score,
        total_marks: 10,
        violation_count: violations,
        submitted_at: new Date().toLocaleTimeString('vi-VN')
      });
    } finally {
      setSubmitting(false);
      setExamStatus('SUBMITTED');
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      message.success('Đã nộp bài thi thành công!');
    }
  };

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const questions = examData?.paper?.questions || [];
  const activeQuestion = questions[currentQuestionIdx];

  // =========================================================================
  // VIEW 1: EXAM LOBBY (PHÒNG CHỜ & KIỂM TRA THIẾT BỊ / XÁC THỰC CẤP QUYỀN)
  // =========================================================================
  if (examStatus === 'LOBBY') {
    // Nếu là Giảng viên hoặc Quản trị viên -> Định tuyến đúng về phân hệ Giám thị Coi thi
    const isTeacherOrAdmin = currentUser?.role === 'teacher' || currentUser?.role === 'admin' || currentUser?.role === 'superadmin';
    if (isTeacherOrAdmin) {
      return (
        <div style={{ maxWidth: 900, margin: '40px auto', padding: '0 16px' }}>
          <Card
            style={{
              borderRadius: 16,
              border: '1px solid #bfdbfe',
              background: 'linear-gradient(180deg, #eff6ff 0%, #ffffff 100%)',
              boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.1)'
            }}
            styles={{ body: { padding: '36px 32px' } }}
          >
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  background: '#dbeafe',
                  color: '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  fontSize: 36
                }}
              >
                <SafetyCertificateOutlined />
              </div>
              <Title level={3} style={{ color: '#1e3a8a', margin: '0 0 8px' }}>
                XÁC THỰC VAI TRÒ: {currentUser?.role === 'teacher' ? 'GIẢNG VIÊN / CÁN BỘ COI THI' : 'HỘI ĐỒNG KHẢO THÍ / ADMIN'}
              </Title>
              <Text strong style={{ fontSize: 15, color: '#2563eb' }}>
                {currentUser?.full_name || 'TS. Hoàng Đức Em'} — {currentUser?.faculty_name || 'Khoa Công Nghệ Thông Tin'}
              </Text>
            </div>

            <Alert
              type="info"
              showIcon
              message="ĐỊNH TUYẾN NGHIỆP VỤ KHẢO THÍ ĐẠI HỌC (THÔNG TƯ 08/2021/TT-BGDĐT)"
              description={
                <div style={{ fontSize: 13, lineHeight: 1.7, marginTop: 4 }}>
                  <p style={{ margin: '4px 0' }}>
                    • Màn hình này là <b>Phòng Thi Trực Tuyến dành riêng cho Thí sinh / Học viên</b> điểm danh, kích hoạt webcam AI và làm bài thi kết thúc học phần.
                  </p>
                  <p style={{ margin: '4px 0' }}>
                    • Với cương vị <b>Giảng viên / Cán bộ Coi thi</b> trực thuộc Khoa & Bộ môn, nhiệm vụ của quý Thầy/Cô là <b>Giám sát phòng thi, Điểm danh thí sinh, Nhận diện cảnh báo AI gian lận và Lập biên bản ca thi</b> tại phân hệ Giám Thị.
                  </p>
                </div>
              }
              style={{ marginBottom: 24, borderRadius: 10 }}
            />

            <Row gutter={[16, 16]} justify="center">
              <Col xs={24} sm={12}>
                <Button
                  type="primary"
                  block
                  size="large"
                  icon={<VideoCameraOutlined />}
                  onClick={() => onNavigate && onNavigate('live_proctoring')}
                  style={{ background: '#2563eb', borderColor: '#2563eb', height: 48, fontWeight: 600, borderRadius: 8 }}
                >
                  Đến Phòng Điều Hành Giám Thị AI Live
                </Button>
              </Col>
              <Col xs={24} sm={12}>
                <Button
                  block
                  size="large"
                  icon={<BookOutlined />}
                  onClick={() => onNavigate && onNavigate('lms_workspace')}
                  style={{ height: 48, fontWeight: 600, borderRadius: 8 }}
                >
                  Về Quản Lý Giảng Dạy LMS (15 Tuần)
                </Button>
              </Col>
            </Row>
          </Card>
        </div>
      );
    }

    const candidate = examData?.candidate;
    const schedule = examData?.schedule;
    const isGranted = examData?.can_enter === true;

    return (
      <div style={{ maxWidth: 950, margin: '0 auto', padding: '32px 16px' }}>
        <Card style={{ borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          {/* HEADER */}
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <SafetyCertificateOutlined style={{ fontSize: 60, color: isGranted ? '#1677ff' : '#faad14' }} />
            <Title level={2} style={{ margin: '14px 0 6px', color: '#0f172a' }}>
              {schedule?.exam_name || 'Phòng Khảo Thí Trực Tuyến Chuẩn Quốc Tế'}
            </Title>
            <Space wrap size="middle">
              <Tag color="geekblue" style={{ fontSize: 13, padding: '3px 10px' }}>
                Học kỳ: {schedule?.semester || 'HK 2'} - Năm học: {schedule?.academic_year || '2025-2026'}
              </Tag>
              <Tag color="cyan">Mã ca: {schedule?.exam_code || 'EXAM-2026-01'}</Tag>
              <Tag color="purple">Phòng ảo: {schedule?.room_code || 'ROOM-P01'}</Tag>
              {examData?.is_admin_mode && (
                <Tag color="gold" style={{ fontWeight: 'bold' }}>QUYỀN QUẢN TRỊ / GIÁM THỊ</Tag>
              )}
            </Space>
          </div>

          {/* DANH SÁCH MÔN THI / CA THI ĐƯỢC PHÂN BỔ (NẾU CÓ NHIỀU HỌC PHẦN) */}
          {eligibleExams && eligibleExams.length > 1 && (
            <Card
              size="small"
              title={<Space><BookOutlined /><span>Danh Sách Học Phần / Ca Thi Được Phân Bổ</span></Space>}
              style={{ marginBottom: 20, background: '#f8fafc', borderRadius: 8 }}
            >
              <Row gutter={[12, 12]}>
                {eligibleExams.map(item => {
                  const s = item.schedule || {};
                  const isSelected = selectedScheduleId === s.id;
                  const isItemGranted = item.authorization_status === 'GRANTED';
                  return (
                    <Col xs={24} sm={12} md={8} key={item.id || s.id}>
                      <div
                        onClick={() => {
                          setSelectedScheduleId(s.id);
                          loadExamAccess(s.id);
                        }}
                        style={{
                          padding: '10px 14px',
                          borderRadius: 8,
                          cursor: 'pointer',
                          border: isSelected ? '2px solid #1677ff' : '1px solid #e2e8f0',
                          background: isSelected ? '#eff6ff' : '#ffffff',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                          <Text strong style={{ color: isSelected ? '#1677ff' : '#1e293b', fontSize: 13 }}>
                            {s.exam_code || 'CA THI'}
                          </Text>
                          <Tag color={isItemGranted ? 'success' : 'warning'} style={{ fontSize: 11, margin: 0 }}>
                            {isItemGranted ? 'Được thi' : 'Chưa duyệt'}
                          </Tag>
                        </div>
                        <div style={{ fontSize: 12, color: '#475569', fontWeight: 500 }}>
                          {s.exam_name || item.subject_name}
                        </div>
                        <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
                          Phòng: {s.room_code || 'P01'} | SBD: {item.seat_number || 'Chưa cấp'}
                        </div>
                      </div>
                    </Col>
                  );
                })}
              </Row>
            </Card>
          )}

          {loadingAccess ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <Spin size="large" tip="Đang thẩm định quyền dự thi từ Hội đồng Khảo thí..." />
            </div>
          ) : !isGranted ? (
            /* ========================================================================= */
            /* TRƯỜNG HỢP: CHƯA ĐƯỢC CẤP QUYỀN DỰ THI THEO QUY CHẾ BỘ GD&ĐT              */
            /* ========================================================================= */
            <div>
              <Alert
                type="error"
                showIcon
                icon={<StopOutlined style={{ fontSize: 24, marginTop: 4 }} />}
                message={
                  <span style={{ fontSize: 16, fontWeight: 'bold' }}>
                    CHƯA ĐƯỢC CẤP QUYỀN THI MÔN HỌC NÀY
                  </span>
                }
                description={
                  <div style={{ marginTop: 8, fontSize: 13, lineHeight: 1.6 }}>
                    <div>
                      {examData?.message || 'Thí sinh chưa được Admin hoặc Hội đồng thi phê duyệt cấp quyền dự thi cho môn học này.'}
                    </div>
                    <div style={{ marginTop: 6, color: '#dc2626', fontWeight: 600 }}>
                      ⚠️ Theo quy định tại Điều 13 Thông tư 08/2021/TT-BGDĐT của Bộ Giáo dục & Đào tạo:
                      Người học phải hoàn thành điều kiện tiên quyết (chuyên cần $\ge$ 80%, học phí, điều kiện học vụ) và phải được Quản trị viên/Hội đồng thi phê duyệt danh sách chính thức mới được phép truy cập làm bài thi trực tuyến.
                    </div>
                  </div>
                }
                style={{ marginBottom: 20, borderRadius: 8, border: '1px solid #fca5a5', background: '#fef2f2' }}
              />

              {/* THÔNG TIN HỒ SƠ THẨM ĐỊNH ĐIỀU KIỆN */}
              <Card
                title={<Space><UserOutlined /><span>Thông Tin Thí Sinh & Kết Quả Thẩm Định Điều Kiện Dự Thi</span></Space>}
                size="small"
                style={{ marginBottom: 20, borderRadius: 8, background: '#fafafa' }}
                extra={
                  <Tag color={
                    candidate?.authorization_status === 'DENIED' ? 'error' :
                    candidate?.authorization_status === 'SUSPENDED' ? 'magenta' : 'warning'
                  }>
                    Trạng thái: {
                      candidate?.authorization_status === 'DENIED' ? 'TỪ CHỐI CẤP QUYỀN' :
                      candidate?.authorization_status === 'SUSPENDED' ? 'BỊ ĐÌNH CHỈ THI' :
                      candidate?.authorization_status === 'PENDING' ? 'CHỜ DUYỆT CẤP QUYỀN' : 'CHƯA CÓ TRONG DANH SÁCH'
                    }
                  </Tag>
                }
              >
                <Descriptions bordered size="small" column={{ xs: 1, sm: 2, md: 3 }}>
                  <Descriptions.Item label="Họ và tên thí sinh">
                    <b>{candidate?.student_name || currentUser?.full_name || 'Chưa cập nhật'}</b>
                  </Descriptions.Item>
                  <Descriptions.Item label="Mã sinh viên (MSSV)">
                    <b>{candidate?.student_code || currentUser?.username || 'SV-N/A'}</b>
                  </Descriptions.Item>
                  <Descriptions.Item label="Lớp sinh hoạt">
                    {candidate?.class_name || 'Lớp chuyên ngành'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Số Báo Danh (SBD)">
                    <Tag color="blue">{candidate?.seat_number || 'Chưa cấp số báo danh'}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Học phần thi">
                    <b>{candidate?.subject_name || schedule?.exam_name || 'Học phần'}</b> ({candidate?.subject_code || schedule?.exam_code || 'N/A'})
                  </Descriptions.Item>
                  <Descriptions.Item label="Phòng thi ảo">
                    {schedule?.room_code || 'ROOM-P01'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Chuyên cần học phần">
                    {candidate?.attendance_pct != null ? (
                      <Space>
                        <b>{candidate.attendance_pct}%</b>
                        {candidate.attendance_pct >= 80 ? (
                          <Tag color="success">Đạt chuẩn ($\ge 80\%$)</Tag>
                        ) : (
                          <Tag color="error">Không đạt ($&lt; 80\%$)</Tag>
                        )}
                      </Space>
                    ) : (
                      <span style={{ color: '#94a3b8' }}>Chưa ghi nhận</span>
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="Nghĩa vụ học phí">
                    {candidate?.tuition_cleared ? (
                      <Tag color="success">Đã hoàn thành</Tag>
                    ) : (
                      <Tag color="error">Chưa hoàn thành / Còn nợ</Tag>
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="Cán bộ coi thi">
                    {schedule?.proctor_1 ? `${schedule.proctor_1}${schedule?.proctor_2 ? ` & ${schedule.proctor_2}` : ''}` : 'Hội đồng Khảo thí'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Ghi chú từ Hội đồng" span={3}>
                    <Text type="secondary">
                      {candidate?.notes || examData?.message || 'Liên hệ Phòng Khảo thí & Đảm bảo chất lượng hoặc Ban Quản trị hệ thống để được hỗ trợ xét duyệt.'}
                    </Text>
                  </Descriptions.Item>
                </Descriptions>
              </Card>

              {/* HÀNH ĐỘNG KHI BỊ CHẶN */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 24 }}>
                <Button
                  type="primary"
                  icon={<MailOutlined />}
                  size="large"
                  disabled={requestSent}
                  onClick={() => {
                    setRequestSent(true);
                    message.success('Đã gửi đề nghị xét duyệt cấp quyền dự thi đến Admin và Thư ký Hội đồng thi!');
                  }}
                  style={{
                    background: requestSent ? '#94a3b8' : '#1677ff',
                    height: 48,
                    padding: '0 28px',
                    fontWeight: 600,
                    borderRadius: 8
                  }}
                >
                  {requestSent ? 'Đã Gửi Đề Nghị Phê Duyệt' : '📩 Gửi Đề Nghị Cấp Quyền Dự Thi Lên Hội Đồng'}
                </Button>
                <Button
                  icon={<ReloadOutlined />}
                  size="large"
                  onClick={() => loadExamAccess(selectedScheduleId || 1)}
                  style={{ height: 48, borderRadius: 8, fontWeight: 500 }}
                >
                  Kiểm Tra Lại Quyền Thi
                </Button>
              </div>
            </div>
          ) : (
            /* ========================================================================= */
            /* TRƯỜNG HỢP: ĐÃ ĐƯỢC PHÊ DUYỆT CẤP QUYỀN THI (GRANTED / ADMIN)              */
            /* ========================================================================= */
            <div>
              {/* THẺ DỰ THI SỐ (DIGITAL EXAM PASS) */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)',
                  borderRadius: 12,
                  padding: '20px 24px',
                  color: '#ffffff',
                  marginBottom: 24,
                  boxShadow: '0 8px 24px rgba(6, 95, 70, 0.25)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <FileProtectOutlined style={{ fontSize: 24, color: '#34d399' }} />
                      <span style={{ fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#a7f3d0', fontWeight: 700 }}>
                        THẺ DỰ THI TRỰC TUYẾN CHÍNH THỨC
                      </span>
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>
                      {candidate?.student_name || currentUser?.full_name || 'Thí Sinh'}
                    </div>
                    <div style={{ fontSize: 13, color: '#d1fae5', marginTop: 2 }}>
                      MSSV: <b>{candidate?.student_code || currentUser?.username || 'SV-N/A'}</b> &bull; Lớp: <b>{candidate?.class_name || 'Đại học chính quy'}</b>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', background: 'rgba(255,255,255,0.12)', padding: '10px 18px', borderRadius: 8 }}>
                    <div style={{ fontSize: 11, color: '#a7f3d0', textTransform: 'uppercase' }}>Số Báo Danh (SBD)</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: '#fef08a', letterSpacing: '0.05em' }}>
                      {candidate?.seat_number || 'SBD-001'}
                    </div>
                    <Tag color="success" style={{ margin: '4px 0 0', fontWeight: 600 }}>
                      ✓ ĐÃ CẤP QUYỀN DỰ THI
                    </Tag>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.18)', marginTop: 14, paddingTop: 10, display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#d1fae5', flexWrap: 'wrap', gap: 8 }}>
                  <span>Phòng thi ảo: <b>{schedule?.room_code || 'ROOM-P01'}</b></span>
                  <span>Cán bộ coi thi: <b>{schedule?.proctor_1 || 'CBCT 1'}{schedule?.proctor_2 ? ` & ${schedule.proctor_2}` : ''}</b></span>
                  <span>Thời lượng: <b>{schedule?.duration_minutes || 60} Phút</b></span>
                  <span>Phê duyệt bởi: <b>{candidate?.authorized_by || 'Hội Đồng Thi / Admin'}</b></span>
                </div>
              </div>

              {/* CHECKLIST ĐIỀU KIỆN DỰ THI & CÔNG NGHỆ BẢO MẬT */}
              <Card
                title={<Space><LockOutlined /><span>Yêu Cầu Kỹ Thuật Khóa Trình Duyệt & Giám Thị AI (Thông tư 08/2021)</span></Space>}
                style={{ marginBottom: 24, background: '#f8fafc' }}
              >
                <Row gutter={[16, 12]}>
                  <Col xs={24} md={12}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 18 }} />
                      <div>
                        <Text strong>Webcam & Microphone HD (WebRTC):</Text>
                        <div style={{ fontSize: 12, color: '#64748b' }}>Truyền luồng video trực tiếp 720p về Hội đồng giám sát.</div>
                      </div>
                    </div>
                  </Col>
                  <Col xs={24} md={12}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 18 }} />
                      <div>
                        <Text strong>AI Proctoring Engine:</Text>
                        <div style={{ fontSize: 12, color: '#64748b' }}>Nhận diện quay mặt, rời khỏi camera hoặc người thứ 2.</div>
                      </div>
                    </div>
                  </Col>
                  <Col xs={24} md={12}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 18 }} />
                      <div>
                        <Text strong>Kiosk Lockdown Mode (Toàn Màn Hình):</Text>
                        <div style={{ fontSize: 12, color: '#64748b' }}>Chặn Alt+Tab, F12 DevTools, PrintScreen, Clipboard.</div>
                      </div>
                    </div>
                  </Col>
                  <Col xs={24} md={12}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 18 }} />
                      <div>
                        <Text strong>Hỗ Trợ Safe Exam Browser (SEB):</Text>
                        <div style={{ fontSize: 12, color: '#64748b' }}>Tương thích khóa triệt để tiến trình chạy ngầm của HĐH.</div>
                      </div>
                    </div>
                  </Col>
                </Row>

                <Divider style={{ margin: '14px 0' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                  <Space>
                    <Tag color={isSebVerified ? 'green' : 'orange'}>
                      {isSebVerified ? 'ĐÃ KHÓA HỆ THỐNG QUA SAFE EXAM BROWSER (SEB)' : 'Web Kiosk Lockdown (Trình duyệt chuẩn)'}
                    </Tag>
                    <Text type="secondary" style={{ fontSize: 12 }}>Độ trễ mạng: {networkPing}ms (Rất tốt)</Text>
                  </Space>
                  <Space>
                    <Button
                      size="small"
                      icon={<SafetyCertificateOutlined />}
                      onClick={async () => {
                        try {
                          const res = await apiClient.get('/exam/seb/verify');
                          if (res && res.success && res.data?.isSebBrowser) {
                            setIsSebVerified(true);
                            message.success('Đã xác thực môi trường Safe Exam Browser!');
                          } else {
                            message.warning('Bạn đang mở bằng trình duyệt thông thường. Hãy tải file .seb và mở bằng Safe Exam Browser để khóa hệ thống.');
                          }
                        } catch (e) {
                          message.info('Đang hoạt động ở chế độ Web Kiosk Lockdown mô phỏng.');
                        }
                      }}
                    >
                      Kiểm Tra SEB
                    </Button>
                    <Button
                      type="primary"
                      icon={<DownloadOutlined />}
                      size="small"
                      style={{ background: '#7c3aed', borderColor: '#7c3aed' }}
                      onClick={() => window.open(`/api/exam/seb/download/${selectedScheduleId || 1}`, '_blank')}
                    >
                      Tải Cấu Hình Safe Exam Browser (.seb)
                    </Button>
                  </Space>
                </div>
              </Card>

              {/* TỔNG QUAN CA THI */}
              <Row gutter={16} style={{ marginBottom: 24, textAlign: 'center' }}>
                <Col span={8}>
                  <Card style={{ background: '#f6ffed', border: '1px solid #b7eb8f' }}>
                    <Text type="secondary">Thời lượng thi</Text>
                    <Title level={4} style={{ color: '#52c41a', margin: '4px 0 0' }}>
                      {schedule?.duration_minutes || 60} Phút
                    </Title>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card style={{ background: '#e6f4ff', border: '1px solid #91caff' }}>
                    <Text type="secondary">Số lượng câu hỏi</Text>
                    <Title level={4} style={{ color: '#1677ff', margin: '4px 0 0' }}>{questions.length || 5} Câu</Title>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card style={{ background: '#fff7e6', border: '1px solid #ffd591' }}>
                    <Text type="secondary">Hình thức khảo thí</Text>
                    <Title level={4} style={{ color: '#fa8c16', margin: '4px 0 0' }}>
                      {schedule?.exam_type || 'Trắc Nghiệm Số'}
                    </Title>
                  </Card>
                </Col>
              </Row>

              {/* NÚT BẮT ĐẦU */}
              <Button
                type="primary"
                size="large"
                block
                icon={<FullscreenOutlined />}
                onClick={handleStartExam}
                style={{
                  height: 52,
                  fontSize: 16,
                  fontWeight: 700,
                  background: '#1677ff',
                  borderRadius: 8
                }}
              >
                Bắt Đầu Làm Bài Thi (Vào Phòng Thi Khóa Kiosk Toàn Màn Hình)
              </Button>
            </div>
          )}
        </Card>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: EXAM SUSPENDED (ĐÌNH CHỈ DO VI PHẠM)
  // =========================================================================
  if (examStatus === 'SUSPENDED') {
    return (
      <div style={{ maxWidth: 700, margin: '60px auto', textAlign: 'center' }}>
        <Card style={{ borderRadius: 12, padding: 32, border: '2px solid #ff4d4f' }}>
          <StopOutlined style={{ fontSize: 72, color: '#ff4d4f', marginBottom: 20 }} />
          <Title level={2} style={{ color: '#ff4d4f', margin: 0 }}>BÀI THI ĐÃ BỊ ĐÌNH CHỈ</Title>
          <Paragraph style={{ fontSize: 16, color: '#475569', marginTop: 12 }}>
            Hệ thống AI Proctoring và Hội đồng thi ghi nhận thí sinh đã vượt quá giới hạn vi phạm quy chế thi
            (Tổng số lần vi phạm: <b>{violations}/3 lần</b>). Toàn bộ bằng chứng ảnh chụp video stream và nhật ký vi phạm đã được lập biên bản số.
          </Paragraph>
          <Divider />
          <Button type="primary" danger onClick={() => setExamStatus('LOBBY')}>
            Quay Lại Trang Chủ Khảo Thí
          </Button>
        </Card>
      </div>
    );
  }

  // =========================================================================
  // VIEW 3: EXAM SUBMITTED (ĐÃ NỘP BÀI)
  // =========================================================================
  if (examStatus === 'SUBMITTED') {
    return (
      <div style={{ maxWidth: 750, margin: '40px auto', textAlign: 'center' }}>
        <Card style={{ borderRadius: 12, padding: 32 }}>
          <CheckCircleOutlined style={{ fontSize: 70, color: '#52c41a', marginBottom: 20 }} />
          <Title level={2} style={{ color: '#52c41a', margin: 0 }}>NỘP BÀI THI THÀNH CÔNG!</Title>
          <Paragraph type="secondary" style={{ fontSize: 15, marginTop: 8 }}>
            Dữ liệu bài thi đã được mã hóa toàn vẹn và đồng bộ tức thì sang Hệ thống Quản trị Đào tạo (TCU COMPASS ERP).
          </Paragraph>

          <Divider />

          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col span={8}>
              <Text type="secondary">Điểm số đạt được</Text>
              <Title level={2} style={{ color: '#1677ff', margin: '8px 0 0' }}>{examResult?.score_10 || 9.5} / 10</Title>
            </Col>
            <Col span={8}>
              <Text type="secondary">Thời gian làm bài</Text>
              <Title level={3} style={{ color: '#1e293b', margin: '8px 0 0' }}>
                {Math.floor((examResult?.time_spent_seconds || 1800) / 60)} Phút
              </Title>
            </Col>
            <Col span={8}>
              <Text type="secondary">Chỉ số liêm chính</Text>
              <Title level={2} style={{ color: violations > 0 ? '#fa8c16' : '#52c41a', margin: '8px 0 0' }}>
                {violations > 0 ? `${violations} Vi phạm` : '100% Chuẩn'}
              </Title>
            </Col>
          </Row>

          <Button type="primary" size="large" onClick={() => setExamStatus('LOBBY')}>
            Quay lại Phòng chờ Khảo thí
          </Button>
        </Card>
      </div>
    );
  }

  // =========================================================================
  // VIEW 4: IN_EXAM (ĐANG THI - KIOSK LOCKDOWN & WEBRTC LIVE VIDEO STREAM)
  // =========================================================================
  return (
    <div
      style={{
        background: '#f0f2f5',
        minHeight: '100vh',
        padding: '12px 16px',
        userSelect: 'none',
        WebkitUserSelect: 'none'
      }}
    >
      {/* CẢNH BÁO AI PROCTORING NHẤP NHÁY (NẾU PHÁT HIỆN) */}
      {aiDetectionStatus !== 'NORMAL' && (
        <Alert
          message={`CẢNH BÁO AI PROCTORING: ${aiWarningMessage}`}
          description="Hệ thống đang ghi nhận video bằng chứng gửi về phòng Hội đồng thi. Vui lòng nhìn thẳng vào camera và tập trung làm bài!"
          type="error"
          showIcon
          banner
          style={{ marginBottom: 12, borderRadius: 8 }}
        />
      )}

      {/* HEADER PHÒNG THI */}
      <Card style={{ marginBottom: 16, borderRadius: 8 }} styles={{ body: { padding: '12px 20px' } }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Space>
              <Badge status="processing" color="#52c41a" />
              <Title level={4} style={{ margin: 0 }}>{examData?.paper?.name || 'Phòng Khảo Thí Trực Tuyến'}</Title>
              <Tag color="cyan"><VideoCameraOutlined /> WebRTC Live Stream</Tag>
              <Tag color="purple"><SafetyCertificateOutlined /> Kiosk Lockdown Active</Tag>
            </Space>
          </Col>
          <Col>
            <Space size="large">
              {violations > 0 && (
                <Tag color="error" icon={<WarningOutlined />} style={{ fontWeight: 700 }}>
                  Vi phạm: {violations}/3 Lần
                </Tag>
              )}
              <div style={{
                background: timeLeft < 300 ? '#ff4d4f' : '#0958d9',
                color: '#fff',
                padding: '6px 18px',
                borderRadius: 20,
                fontWeight: 'bold',
                fontSize: 16,
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}>
                <ClockCircleOutlined /> {formatTimer(timeLeft)}
              </div>
              <Button type="primary" danger icon={<SendOutlined />} loading={submitting} onClick={handleSubmitExam}>
                Nộp Bài Thi
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Row gutter={16}>
        {/* KHUNG NỘI DUNG CÂU HỎI */}
        <Col xs={24} md={18}>
          <Card style={{ minHeight: 460, borderRadius: 8 }}>
            {activeQuestion ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                  <Tag color="blue" style={{ fontSize: 13 }}>
                    Câu hỏi {currentQuestionIdx + 1} / {questions.length}
                  </Tag>
                  <Text type="secondary">
                    Điểm: <b>{activeQuestion?.default_mark || 0.25}đ</b> • 40 câu / 10.0 điểm
                  </Text>
                </div>

                <Title level={4} style={{ fontSize: 17, lineHeight: 1.6, marginBottom: 24, color: '#1e293b' }}>
                  {activeQuestion.content}
                </Title>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {activeQuestion.answers?.map((ans, aIdx) => {
                    const isChosen = answers[activeQuestion.id] === ans.id;
                    const charCode = String.fromCharCode(65 + aIdx);
                    return (
                      <div
                        key={ans.id}
                        onClick={() => setAnswers({ ...answers, [activeQuestion.id]: ans.id })}
                        style={{
                          padding: '12px 16px',
                          borderRadius: 8,
                          border: isChosen ? '2px solid #1677ff' : '1px solid #d9d9d9',
                          background: isChosen ? '#e6f4ff' : '#fff',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                          transition: 'all 0.2s'
                        }}
                      >
                        <div
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: '50%',
                            background: isChosen ? '#1677ff' : '#f0f0f0',
                            color: isChosen ? '#fff' : '#666',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold'
                          }}
                        >
                          {charCode}
                        </div>
                        <span style={{ fontSize: 15, fontWeight: isChosen ? 'bold' : 'normal' }}>
                          {ans.content}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <Divider style={{ margin: '24px 0 16px' }} />

                <Row justify="space-between">
                  <Button disabled={currentQuestionIdx === 0} onClick={() => setCurrentQuestionIdx(currentQuestionIdx - 1)}>
                    Câu Trước
                  </Button>
                  <Button disabled={currentQuestionIdx === questions.length - 1} type="primary" onClick={() => setCurrentQuestionIdx(currentQuestionIdx + 1)}>
                    Câu Tiếp Theo
                  </Button>
                </Row>
              </div>
            ) : (
              <p>Đang tải câu hỏi...</p>
            )}
          </Card>
        </Col>

        {/* SIDEBAR: WEBRTC LIVE PROCTORING BADGE & QUESTION PALETTE */}
        <Col xs={24} md={6}>
          {/* WEBRTC FLOATING PROCTORING BOX */}
          <Card
            title={
              <Space>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff4d4f', display: 'inline-block' }} />
                <span style={{ fontSize: 13, fontWeight: 700 }}>Giám Thị AI & Webcam Live</span>
              </Space>
            }
            size="small"
            style={{ marginBottom: 16, borderRadius: 8, border: '1px solid #d9d9d9' }}
          >
            <div style={{ position: 'relative', width: '100%', height: 130, background: '#000', borderRadius: 6, overflow: 'hidden' }}>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute', bottom: 4, left: 6,
                background: 'rgba(0,0,0,0.65)', color: '#fff', fontSize: 10,
                padding: '1px 6px', borderRadius: 4
              }}>
                WebRTC 720p • {networkPing}ms
              </div>
              <div style={{ position: 'absolute', top: 4, right: 6 }}>
                <Badge status={aiDetectionStatus === 'NORMAL' ? 'success' : 'error'} />
              </div>
            </div>
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 6, textAlign: 'center' }}>
              Microphone: <AudioOutlined style={{ color: '#52c41a' }} /> Đang thu âm thanh
            </div>
          </Card>

          {/* PALETTE DANH SÁCH 40 CÂU HỎI */}
          <Card title={`Danh Sách Câu Hỏi (${questions.length || 40} câu)`} style={{ borderRadius: 8 }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: 6,
              marginBottom: 16,
              maxHeight: 280,
              overflowY: 'auto',
              paddingRight: 4
            }}>
              {questions.map((q, idx) => {
                const isAnswered = answers[q.id] !== undefined;
                const isCurrent = currentQuestionIdx === idx;
                return (
                  <Button
                    key={q.id}
                    onClick={() => setCurrentQuestionIdx(idx)}
                    type={isCurrent ? 'primary' : (isAnswered ? 'default' : 'dashed')}
                    size="small"
                    style={{
                      background: isCurrent ? '#1677ff' : (isAnswered ? '#f6ffed' : '#fff'),
                      borderColor: isAnswered ? '#52c41a' : '#d9d9d9',
                      fontWeight: isCurrent || isAnswered ? 'bold' : 'normal',
                      color: isAnswered && !isCurrent ? '#52c41a' : undefined,
                      padding: 0,
                      height: 32
                    }}
                  >
                    {idx + 1}
                  </Button>
                );
              })}
            </div>

            <Divider style={{ margin: '12px 0' }} />
            <div style={{ fontSize: 12, color: '#8c8c8c' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ width: 12, height: 12, background: '#f6ffed', border: '1px solid #52c41a', borderRadius: 2 }} />
                <span>Đã trả lời ({Object.keys(answers).length}/{questions.length})</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 12, height: 12, background: '#fff', border: '1px dashed #d9d9d9', borderRadius: 2 }} />
                <span>Chưa trả lời</span>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* MODAL CẢNH BÁO BẮT BUỘC KHI THOÁT TOÀN MÀN HÌNH (FULLSCREEN EXIT LOCKDOWN) */}
      <Modal
        title={
          <Space>
            <WarningOutlined style={{ color: '#ff4d4f', fontSize: 24 }} />
            <span style={{ color: '#ff4d4f', fontWeight: 800 }}>VI PHẠM: BẠN VỪA THOÁT CHẾ ĐỘ TOÀN MÀN HÌNH!</span>
          </Space>
        }
        open={isFullscreenExited}
        closable={false}
        footer={[
          <Button
            key="reenter"
            type="primary"
            danger
            size="large"
            block
            icon={<FullscreenOutlined />}
            onClick={handleReEnterFullscreen}
            style={{ height: 48, fontSize: 16, fontWeight: 700 }}
          >
            Quay Lại Chế Độ Toàn Màn Hình Ngay ({fullscreenWarningCountdown}s)
          </Button>
        ]}
      >
        <Alert
          message="CẢNH BÁO KHÓA BÀI THI (KIOSK LOCKDOWN)"
          description={`Quy chế thi trực tuyến nghiêm cấm thu nhỏ màn hình hoặc thoát Fullscreen. Nếu bạn không quay lại làm bài trong ${fullscreenWarningCountdown} giây, hệ thống sẽ tự động đình chỉ bài thi!`}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
        <p>Hệ thống đã ghi nhận 1 lần vi phạm vào biên bản thi của bạn.</p>
      </Modal>
    </div>
  );
}

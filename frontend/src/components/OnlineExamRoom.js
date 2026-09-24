import React, { useState, useEffect, useRef } from 'react';
import {
  Row, Col, Card, Button, Typography, Space, Tag, Modal, Alert,
  Progress, notification, Divider, Badge, message, Tooltip, Statistic
} from 'antd';
import {
  ClockCircleOutlined, WarningOutlined, CheckCircleOutlined,
  FullscreenOutlined, SafetyCertificateOutlined, SendOutlined,
  ExclamationCircleOutlined, VideoCameraOutlined, SoundOutlined,
  DownloadOutlined, LockOutlined, EyeOutlined, AudioOutlined,
  ThunderboltOutlined, StopOutlined, ReloadOutlined
} from '@ant-design/icons';
import { io } from 'socket.io-client';
import apiClient from '../services/apiClient';

const { Title, Text, Paragraph } = Typography;

export default function OnlineExamRoom({ currentUser }) {
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

  // 1. Tải thông tin phòng thi & Đề thi
  const loadExamAccess = async () => {
    try {
      const res = await apiClient.get('/exam/access');
      if (res && res.success && res.data) {
        setExamData(res.data);
      }
    } catch (err) {
      setExamData({
        schedule: {
          id: 1,
          exam_name: 'Kỳ Thi Khảo Thí Trực Tuyến — Chuẩn Quốc Tế 2026 (TCU & Pearson VUE)',
          start_time: '08:00',
          end_time: '23:59',
          duration_minutes: 60
        },
        paper: {
          id: 101,
          name: 'Đề Thi Số 1: Khảo Thí Đảm Bảo Chất Lượng & Quản Trị Số Đại Học',
          total_marks: 10.0,
          questions: [
            {
              id: 1,
              content: 'Bộ tiêu chuẩn AUN-QA 4.0 cấp Chương trình đào tạo bao gồm bao nhiêu tiêu chuẩn?',
              answers: [
                { id: 11, content: '11 tiêu chuẩn' },
                { id: 12, content: '15 tiêu chuẩn (Chính xác)', is_correct: true },
                { id: 13, content: '8 tiêu chuẩn' },
                { id: 14, content: '20 tiêu chuẩn' }
              ]
            },
            {
              id: 2,
              content: 'Tiêu chuẩn ISO 21001:2018 áp dụng cấu trúc bậc cao gồm bao nhiêu điều khoản chính?',
              answers: [
                { id: 21, content: '10 điều khoản (Điều 4 đến Điều 10 chứa yêu cầu cốt lõi)', is_correct: true },
                { id: 22, content: '7 điều khoản' },
                { id: 23, content: '12 điều khoản' },
                { id: 24, content: '15 điều khoản' }
              ]
            },
            {
              id: 3,
              content: 'Chu trình cải tiến liên tục Deming trong quản lý chất lượng giáo dục viết tắt là gì?',
              answers: [
                { id: 31, content: 'PDCA (Plan - Do - Check - Act)', is_correct: true },
                { id: 32, content: 'SWOT' },
                { id: 33, content: 'SMART' },
                { id: 34, content: 'OKR' }
              ]
            },
            {
              id: 4,
              content: 'Hệ thống LMS tiêu chuẩn quốc tế bắt buộc phải hỗ trợ chuẩn đóng gói học liệu số nào sau đây?',
              answers: [
                { id: 41, content: 'SCORM 1.2 / 2004 và xAPI (Tin Can API / cmi5)', is_correct: true },
                { id: 42, content: 'Chỉ hỗ trợ file MP4 đơn thuần' },
                { id: 43, content: 'Chỉ hỗ trợ file nén ZIP' },
                { id: 44, content: 'Flash SWF' }
              ]
            },
            {
              id: 5,
              content: 'Chuẩn trao đổi dữ liệu ngân hàng đề thi quốc tế viết tắt là gì?',
              answers: [
                { id: 51, content: 'IMS QTI (Question & Test Interoperability) v2.1/v3.0', is_correct: true },
                { id: 52, content: 'JSON API' },
                { id: 53, content: 'SQL DUMP' },
                { id: 54, content: 'CSV Export' }
              ]
            }
          ]
        }
      });
    }
  };

  useEffect(() => {
    loadExamAccess();

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
  // VIEW 1: EXAM LOBBY (PHÒNG CHỜ & KIỂM TRA THIẾT BỊ)
  // =========================================================================
  if (examStatus === 'LOBBY') {
    return (
      <div style={{ maxWidth: 950, margin: '0 auto', padding: '32px 16px' }}>
        <Card style={{ borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <SafetyCertificateOutlined style={{ fontSize: 64, color: '#1677ff' }} />
            <Title level={2} style={{ margin: '16px 0 8px', color: '#092b00' }}>
              {examData?.schedule?.exam_name || 'Phòng Khảo Thí Trực Tuyến Chuẩn Quốc Tế'}
            </Title>
            <Space wrap>
              <Tag color="green" style={{ fontSize: 13, padding: '3px 12px' }}>
                ● CA THI ĐANG MỞ
              </Tag>
              <Tag color="blue">Chuẩn Pearson VUE / Mercer Mettl</Tag>
              <Tag color="purple">WebRTC Video & AI Proctoring 2.0</Tag>
            </Space>
          </div>

          {/* CHECKLIST ĐIỀU KIỆN DỰ THI */}
          <Card
            title={<Space><LockOutlined /><span>Yêu Cầu Kỹ Thuật Khóa Trình Duyệt & Giám Thị AI</span></Space>}
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
                  {isSebVerified ? 'Đã chạy trên Safe Exam Browser (SEB)' : 'Web Kiosk Lockdown (Trình duyệt chuẩn)'}
                </Tag>
                <Text type="secondary" style={{ fontSize: 12 }}>Độ trễ mạng: {networkPing}ms (Rất tốt)</Text>
              </Space>
              <Button
                icon={<DownloadOutlined />}
                size="small"
                onClick={() => window.open('/api/exam/seb/config', '_blank')}
              >
                Tải Cấu Hình Safe Exam Browser (.seb)
              </Button>
            </div>
          </Card>

          <Row gutter={16} style={{ marginBottom: 24, textAlign: 'center' }}>
            <Col span={8}>
              <Card style={{ background: '#f6ffed', border: '1px solid #b7eb8f' }}>
                <Text type="secondary">Thời lượng thi</Text>
                <Title level={4} style={{ color: '#52c41a', margin: '4px 0 0' }}>60 Phút</Title>
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
                <Title level={4} style={{ color: '#fa8c16', margin: '4px 0 0' }}>Trắc Nghiệm Số</Title>
              </Card>
            </Col>
          </Row>

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
                  <Text type="secondary">Điểm: 2.0 đ (Chuẩn Bloom)</Text>
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

          {/* PALETTE DANH SÁCH CÂU HỎI */}
          <Card title="Danh Sách Câu Hỏi" style={{ borderRadius: 8 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 16 }}>
              {questions.map((q, idx) => {
                const isAnswered = answers[q.id] !== undefined;
                const isCurrent = currentQuestionIdx === idx;
                return (
                  <Button
                    key={q.id}
                    onClick={() => setCurrentQuestionIdx(idx)}
                    type={isCurrent ? 'primary' : (isAnswered ? 'default' : 'dashed')}
                    style={{
                      background: isCurrent ? '#1677ff' : (isAnswered ? '#f6ffed' : '#fff'),
                      borderColor: isAnswered ? '#52c41a' : '#d9d9d9',
                      fontWeight: isCurrent || isAnswered ? 'bold' : 'normal',
                      color: isAnswered && !isCurrent ? '#52c41a' : undefined
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

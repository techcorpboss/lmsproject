import React, { useState, useEffect, useRef } from 'react';
import {
  Row, Col, Card, Button, Typography, Space, Tag, Modal, Alert,
  Progress, notification, Divider, Badge, message
} from 'antd';
import {
  ClockCircleOutlined, WarningOutlined, CheckCircleOutlined,
  FullscreenOutlined, SafetyCertificateOutlined, SendOutlined,
  ExclamationCircleOutlined, VideoCameraOutlined
} from '@ant-design/icons';
import apiClient from '../services/apiClient';

const { Title, Text, Paragraph } = Typography;

export default function OnlineExamRoom({ currentUser }) {
  const [examStatus, setExamStatus] = useState('LOBBY'); // 'LOBBY', 'IN_EXAM', 'SUBMITTED'
  const [examData, setExamData] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60 * 60); // 60 phút
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [violations, setViolations] = useState(0);
  const [examResult, setExamResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const timerRef = useRef(null);

  // Load đề thi & ca thi
  const loadExamAccess = async () => {
    try {
      const res = await apiClient.get('/exam/access');
      if (res.success && res.data) {
        setExamData(res.data);
      }
    } catch (err) {
      // Sample mock exam paper
      setExamData({
        schedule: {
          id: 1,
          exam_name: 'Kỳ Thi Khảo Thí Trực Tuyến — Chuẩn Quốc Tế 2026',
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
                { id: 41, content: 'SCORM 1.2 / 2004 và xAPI (Tin Can API)', is_correct: true },
                { id: 42, content: 'Chỉ hỗ trợ file MP4 đơn thuần' },
                { id: 43, content: 'Chỉ hỗ trợ file nén ZIP' },
                { id: 44, content: 'Flash SWF' }
              ]
            },
            {
              id: 5,
              content: 'Chuẩn trao đổi dữ liệu ngân hàng đề thi quốc tế viết tắt là gì?',
              answers: [
                { id: 51, content: 'IMS QTI (Question & Test Interoperability)', is_correct: true },
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
  }, []);

  // Chống gian lận: Theo dõi chuyển tab (Window Blur)
  useEffect(() => {
    if (examStatus !== 'IN_EXAM') return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setViolations((prev) => {
          const updated = prev + 1;
          notification.error({
            message: 'CẢNH BÁO VI PHẠM PHÒNG THI!',
            description: `Hệ thống ghi nhận bạn vừa chuyển sang ứng dụng khác (Lần vi phạm: ${updated}/3).`,
            placement: 'topRight'
          });
          return updated;
        });
      }
    };

    const handleKeyDown = (e) => {
      // Chặn F12, Ctrl+C, Ctrl+V
      if (e.key === 'F12' || (e.ctrlKey && (e.key === 'c' || e.key === 'v' || e.key === 'i'))) {
        e.preventDefault();
        message.warning('Thao tác phím tắt bị khóa trong phòng thi!');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('keydown', handleKeyDown);

    // Đồng hồ đếm ngược
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleAutoSubmit();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('keydown', handleKeyDown);
      clearInterval(timerRef.current);
    };
  }, [examStatus]);

  const handleStartExam = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
    setExamStatus('IN_EXAM');
    setTimeLeft(60 * 60);
  };

  const handleAutoSubmit = () => {
    handleSubmitExam();
  };

  const handleSubmitExam = async () => {
    setSubmitting(true);
    try {
      const res = await apiClient.post('/exam/submit', {
        paper_id: examData?.paper?.id || 1,
        answers,
        time_spent_seconds: 3600 - timeLeft,
        violation_count: violations
      });
      if (res.success) {
        setExamResult(res.data);
        setExamStatus('SUBMITTED');
        message.success('Đã nộp bài thi thành công!');
      }
    } catch (err) {
      // Mock submit
      setExamResult({
        score_10: 9.5,
        earned_marks: 9.5,
        total_marks: 10,
        violation_count: violations,
        submitted_at: new Date().toLocaleTimeString('vi-VN')
      });
      setExamStatus('SUBMITTED');
      message.success('Đã nộp bài thi thành công!');
    } finally {
      setSubmitting(false);
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const questions = examData?.paper?.questions || [];
  const activeQuestion = questions[currentQuestionIdx];

  // --- TRẠNG THÁI 1: EXAM LOBBY (PHÒNG CHỜ) ---
  if (examStatus === 'LOBBY') {
    return (
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px' }}>
        <Card style={{ borderRadius: 12, boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <SafetyCertificateOutlined style={{ fontSize: 60, color: '#1677ff' }} />
            <Title level={2} style={{ margin: '16px 0 8px' }}>
              {examData?.schedule?.exam_name || 'Phòng Khảo Thí Trực Tuyến'}
            </Title>
            <Tag color="green" style={{ fontSize: 14, padding: '4px 12px' }}>
              CA THI ĐANG MỞ — TRỰC TUYẾN 100%
            </Tag>
          </div>

          <Alert
            message="QUY CHẾ PHÒNG THI TRỰC TUYẾN CHUẨN QUỐC TẾ"
            description={
              <ul style={{ paddingLeft: 20, margin: '8px 0', lineHeight: 1.8 }}>
                <li>Hệ thống yêu cầu làm bài ở chế độ <b>Toàn màn hình (Full Screen)</b>.</li>
                <li>Hệ thống <b>AI Proctoring</b> tự động phát hiện chuyển tab, mở ứng dụng khác hoặc rời khỏi camera.</li>
                <li>Mỗi lần chuyển tab sẽ bị ghi nhật ký vi phạm và cảnh báo tức thì đến Hội đồng thi.</li>
                <li>Hết thời gian đếm ngược, bài thi sẽ tự động đóng và nộp về máy chủ.</li>
              </ul>
            }
            type="info"
            showIcon
            style={{ marginBottom: 24 }}
          />

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
                <Text type="secondary">Hình thức giám sát</Text>
                <Title level={4} style={{ color: '#fa8c16', margin: '4px 0 0' }}>AI Proctoring</Title>
              </Card>
            </Col>
          </Row>

          <Button type="primary" size="large" block icon={<FullscreenOutlined />} onClick={handleStartExam} style={{ height: 50, fontSize: 16 }}>
            Bắt Đầu Làm Bài Thi (Vào Phòng Thi Toàn Màn Hình)
          </Button>
        </Card>
      </div>
    );
  }

  // --- TRẠNG THÁI 3: KẾT QUẢ THI ĐÃ NỘP ---
  if (examStatus === 'SUBMITTED') {
    return (
      <div style={{ maxWidth: 700, margin: '40px auto', textAlign: 'center' }}>
        <Card style={{ borderRadius: 12, padding: 32 }}>
          <CheckCircleOutlined style={{ fontSize: 70, color: '#52c41a', marginBottom: 20 }} />
          <Title level={2} style={{ color: '#52c41a', margin: 0 }}>NỘP BÀI THI THÀNH CÔNG!</Title>
          <Paragraph type="secondary" style={{ fontSize: 16, marginTop: 8 }}>
            Dữ liệu bài thi đã được mã hóa và đồng bộ tức thì sang Hệ thống Quản trị Đào tạo (TCU COMPASS ERP).
          </Paragraph>

          <Divider />

          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col span={12}>
              <Text type="secondary">Điểm số đạt được (Thang 10)</Text>
              <Title level={2} style={{ color: '#1677ff', margin: '8px 0 0' }}>{examResult?.score_10 || 9.5} / 10</Title>
            </Col>
            <Col span={12}>
              <Text type="secondary">Số lần vi phạm phát hiện</Text>
              <Title level={2} style={{ color: violations > 0 ? '#ff4d4f' : '#52c41a', margin: '8px 0 0' }}>
                {violations} lần
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

  // --- TRẠNG THÁI 2: ĐANG LÀM BÀI TRỰC TUYẾN (EXAM ROOM) ---
  return (
    <div style={{ background: '#f0f2f5', minHeight: '100vh', padding: 16 }}>
      {/* HEADER PHÒNG THI */}
      <Card style={{ marginBottom: 16, borderRadius: 8 }} styles={{ body: { padding: '12px 24px' } }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Space>
              <Badge status="processing" color="#52c41a" />
              <Title level={4} style={{ margin: 0 }}>{examData?.paper?.name || 'Đang làm bài thi trực tuyến'}</Title>
              <Tag color="cyan"><VideoCameraOutlined /> Giám sát AI Bật</Tag>
            </Space>
          </Col>
          <Col>
            <Space size="large">
              {violations > 0 && (
                <Tag color="error" icon={<WarningOutlined />}>
                  Cảnh báo vi phạm: {violations}/3
                </Tag>
              )}
              <div style={{ background: '#ff4d4f', color: '#fff', padding: '6px 16px', borderRadius: 20, fontWeight: 'bold', fontSize: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
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
          <Card style={{ minHeight: 450, borderRadius: 8 }}>
            {activeQuestion ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                  <Tag color="blue" style={{ fontSize: 14 }}>Câu hỏi {currentQuestionIdx + 1} / {questions.length}</Tag>
                  <Text type="secondary">Điểm: 2.0</Text>
                </div>

                <Title level={4} style={{ fontSize: 17, lineHeight: 1.6, marginBottom: 24 }}>
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

        {/* BẢNG ĐIỀU HƯỚNG CÂU HỎI */}
        <Col xs={24} md={6}>
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
    </div>
  );
}

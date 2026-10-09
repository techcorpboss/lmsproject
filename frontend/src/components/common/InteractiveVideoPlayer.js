import React, { useState, useEffect, useRef } from 'react';
import {
  Card, Modal, Button, Space, Typography, Tag, Radio, Alert,
  Progress, Form, Input, InputNumber, Row, Col, message, Tooltip, Divider
} from 'antd';
import {
  PlayCircleOutlined, PauseCircleOutlined, CheckCircleOutlined,
  CloseCircleOutlined, PlusOutlined, DeleteOutlined, TrophyOutlined,
  QuestionCircleOutlined, RedoOutlined, SettingOutlined, EyeOutlined
} from '@ant-design/icons';
import apiClient from '../../services/apiClient';

const { Title, Text, Paragraph } = Typography;

export default function InteractiveVideoPlayer({
  lessonId,
  mediaUrl,
  lessonTitle,
  isTeacher = false,
  currentUser,
  onProgressUpdate
}) {
  const [checkpoints, setCheckpoints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(120); // Mặc định 120s nếu chưa load metadata
  const [isPlaying, setIsPlaying] = useState(false);

  // Trạng thái modal câu hỏi dừng video
  const [activeCheckpoint, setActiveCheckpoint] = useState(null);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [answeredIds, setAnsweredIds] = useState(new Set());
  const [totalPointsEarned, setTotalPointsEarned] = useState(0);

  // Trạng thái cho Giảng viên thêm mốc kiểm tra mới
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addForm] = Form.useForm();

  const videoRef = useRef(null);
  const timerRef = useRef(null);

  // Tải danh sách checkpoints từ Backend
  const fetchCheckpoints = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/elearning/lessons/${lessonId || 1}/checkpoints`);
      if (res && res.success) {
        setCheckpoints(res.data || []);
      }
    } catch (e) {
      console.warn('Lỗi tải checkpoints:', e.message);
    } finally {
      setLoading(false);
    }
  };

  // Tải tiến độ sinh viên
  const fetchStudentProgress = async () => {
    if (isTeacher) return;
    try {
      const res = await apiClient.get(`/elearning/lessons/${lessonId || 1}/interactive-progress`);
      if (res && res.success && res.data) {
        setAnsweredIds(new Set(res.data.answeredIds || []));
        setTotalPointsEarned(res.data.totalPointsEarned || 0);
      }
    } catch (e) {
      console.warn('Lỗi tải tiến độ video:', e.message);
    }
  };

  useEffect(() => {
    fetchCheckpoints();
    fetchStudentProgress();
  }, [lessonId]);

  // Bộ đếm giả lập thời gian nếu dùng iframe nhúng (như YouTube) hoặc đồng bộ video thật
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentTime(prev => {
          const nextTime = prev + 1;
          // Kiểm tra xem giây hiện tại có trùng với checkpoint nào chưa trả lời không
          const cp = checkpoints.find(c => Math.abs(c.timestamp_seconds - nextTime) < 1);
          if (cp && !answeredIds.has(cp.id) && !activeCheckpoint) {
            handleTriggerCheckpoint(cp);
          }
          if (nextTime >= duration) {
            setIsPlaying(false);
            return duration;
          }
          return nextTime;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, checkpoints, answeredIds, activeCheckpoint, duration]);

  // Kích hoạt điểm dừng
  const handleTriggerCheckpoint = (cp) => {
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setActiveCheckpoint(cp);
    setSelectedOption(null);
    setAnswerSubmitted(false);
    setSubmissionResult(null);
    setIsQuestionModalOpen(true);
  };

  // Nộp câu trả lời tại checkpoint
  const handleSubmitAnswer = async () => {
    if (!selectedOption) {
      message.warning('Vui lòng chọn một phương án trả lời!');
      return;
    }

    try {
      const res = await apiClient.post(`/elearning/lessons/${lessonId || 1}/checkpoint-submit`, {
        checkpointId: activeCheckpoint.id,
        selectedAnswer: selectedOption
      });

      if (res && res.success) {
        setSubmissionResult(res);
        setAnswerSubmitted(true);
        setAnsweredIds(prev => new Set([...prev, activeCheckpoint.id]));
        setTotalPointsEarned(res.totalPointsEarned || 0);

        if (res.isCorrect) {
          message.success(`Chính xác! Bạn được cộng +${res.pointsEarned} điểm tương tác.`);
        } else {
          message.error('Câu trả lời chưa chính xác. Hãy xem giải thích!');
        }

        if (onProgressUpdate) {
          onProgressUpdate({
            totalPoints: res.totalPointsEarned,
            completedCount: res.completedCheckpointsCount,
            totalCount: res.totalCheckpoints
          });
        }
      }
    } catch (e) {
      message.error('Lỗi nộp bài: ' + e.message);
    }
  };

  // Đóng modal câu hỏi và tiếp tục phát video
  const handleContinueVideo = () => {
    setIsQuestionModalOpen(false);
    setActiveCheckpoint(null);
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  // Giảng viên thêm checkpoint mới
  const handleAddCheckpoint = async (values) => {
    try {
      const optionsArray = [
        { key: 'A', text: values.optA },
        { key: 'B', text: values.optB },
        { key: 'C', text: values.optC },
        { key: 'D', text: values.optD }
      ];

      const res = await apiClient.post(`/elearning/lessons/${lessonId || 1}/checkpoints`, {
        timestamp_seconds: values.timestamp_seconds,
        title: values.title,
        question: values.question,
        options: optionsArray,
        correct_answer: values.correct_answer,
        points: values.points || 10,
        explanation: values.explanation
      });

      if (res && res.success) {
        message.success('Đã thêm điểm dừng tương tác thành công!');
        setCheckpoints(res.data);
        setIsAddModalOpen(false);
        addForm.resetFields();
      }
    } catch (e) {
      message.error('Lỗi thêm điểm dừng: ' + e.message);
    }
  };

  // Giảng viên xóa checkpoint
  const handleDeleteCheckpoint = async (cpId) => {
    try {
      const res = await apiClient.delete(`/elearning/lessons/${lessonId || 1}/checkpoints/${cpId}`);
      if (res && res.success) {
        message.success('Đã xóa điểm dừng!');
        setCheckpoints(res.data);
      }
    } catch (e) {
      message.error('Lỗi xóa điểm dừng: ' + e.message);
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = Math.min(100, Math.round((currentTime / duration) * 100));

  return (
    <Card
      styles={{ body: { padding: 16 } }}
      style={{
        borderRadius: 12,
        boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
        border: '1px solid #e2e8f0',
        marginBottom: 20
      }}
    >
      {/* HEADER: TIÊU ĐỀ & THÔNG SỐ ĐIỂM TƯƠNG TÁC */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 12 }}>
        <Col>
          <Space>
            <Tag color="#7c3aed" style={{ fontWeight: 600, padding: '2px 8px' }}>
              ⚡ H5P INTERACTIVE VIDEO
            </Tag>
            <Text strong style={{ fontSize: 16 }}>{lessonTitle || 'Bài giảng Video Tương tác'}</Text>
          </Space>
        </Col>
        <Col>
          <Space orientation="horizontal" size="middle">
            <Tag icon={<TrophyOutlined />} color="gold" style={{ fontSize: 13, padding: '4px 10px', borderRadius: 16 }}>
              Điểm tương tác tích lũy: <b>{totalPointsEarned} đ</b>
            </Tag>
            {isTeacher && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                size="small"
                style={{ background: '#7c3aed', borderColor: '#7c3aed' }}
                onClick={() => {
                  addForm.setFieldsValue({ timestamp_seconds: Math.floor(currentTime), points: 10, correct_answer: 'A' });
                  setIsAddModalOpen(true);
                }}
              >
                Chèn Checkpoint tại {formatTime(currentTime)}
              </Button>
            )}
          </Space>
        </Col>
      </Row>

      {/* KHUNG VIDEO HIỂN THỊ */}
      <div style={{ position: 'relative', width: '100%', background: '#000', borderRadius: 8, overflow: 'hidden' }}>
        {mediaUrl && (mediaUrl.endsWith('.mp4') || mediaUrl.endsWith('.webm')) ? (
          <video
            ref={videoRef}
            src={mediaUrl}
            style={{ width: '100%', height: 'auto', display: 'block', maxHeight: 420 }}
            onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
            onLoadedMetadata={(e) => setDuration(e.target.duration || 120)}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
        ) : (
          <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
            <iframe
              title={lessonTitle || 'Interactive Video'}
              src={mediaUrl?.includes('youtube.com') || mediaUrl?.includes('youtu.be') ? mediaUrl : 'https://www.youtube.com/embed/dQw4w9WgXcQ?enablejsapi=1'}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        {/* OVERLAY NÚT PHÁT CHO TRÌNH GIẢ LẬP ĐIỀU KHIỂN */}
        <div style={{
          position: 'absolute',
          bottom: 12,
          left: 12,
          right: 12,
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(8px)',
          borderRadius: 8,
          padding: '8px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          color: '#fff',
          zIndex: 10
        }}>
          <Button
            type="text"
            icon={isPlaying ? <PauseCircleOutlined style={{ fontSize: 24, color: '#38bdf8' }} /> : <PlayCircleOutlined style={{ fontSize: 24, color: '#38bdf8' }} />}
            onClick={() => setIsPlaying(!isPlaying)}
            style={{ color: '#fff', padding: 0 }}
          />
          <Text style={{ color: '#fff', fontSize: 13, minWidth: 85 }}>
            {formatTime(currentTime)} / {formatTime(duration)}
          </Text>

          {/* THANH TIẾN TRÌNH CÓ ĐÁNH DẤU CHECKPOINTS */}
          <div style={{ flex: 1, position: 'relative', margin: '0 8px' }}>
            <Progress
              percent={progressPercent}
              showInfo={false}
              strokeColor="#38bdf8"
              trailColor="rgba(255,255,255,0.2)"
              size="small"
            />
            {/* Các điểm đánh dấu câu hỏi trên thanh tua */}
            {checkpoints.map(cp => {
              const posPercent = Math.min(100, Math.max(0, (cp.timestamp_seconds / duration) * 100));
              const isAnswered = answeredIds.has(cp.id);
              return (
                <Tooltip key={cp.id} title={`${cp.title} (${cp.timestamp_display}) - ${isAnswered ? 'Đã hoàn thành' : 'Chưa làm'}`}>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentTime(cp.timestamp_seconds);
                      handleTriggerCheckpoint(cp);
                    }}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: `${posPercent}%`,
                      transform: 'translate(-50%, -50%)',
                      width: 14,
                      height: 14,
                      borderRadius: '50%',
                      background: isAnswered ? '#22c55e' : '#f59e0b',
                      border: '2px solid #fff',
                      cursor: 'pointer',
                      boxShadow: '0 0 6px rgba(0,0,0,0.5)',
                      zIndex: 15
                    }}
                  />
                </Tooltip>
              );
            })}
          </div>

          <Tag color="cyan" style={{ margin: 0 }}>
            {checkpoints.length} Câu hỏi kiểm tra
          </Tag>
        </div>
      </div>

      {/* DANH SÁCH CHECKPOINTS CHI TIẾT DƯỚI VIDEO */}
      <Divider style={{ margin: '14px 0 10px 0' }} />
      <div>
        <Text strong style={{ fontSize: 13, color: '#475569' }}>
          📌 Mốc câu hỏi kiểm tra trong bài giảng (Nhấp để nhảy tới mốc):
        </Text>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
          {checkpoints.map((cp, idx) => {
            const isAnswered = answeredIds.has(cp.id);
            return (
              <Tag
                key={cp.id}
                color={isAnswered ? 'success' : 'warning'}
                style={{
                  cursor: 'pointer',
                  padding: '4px 10px',
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
                onClick={() => {
                  setCurrentTime(cp.timestamp_seconds);
                  handleTriggerCheckpoint(cp);
                }}
              >
                {isAnswered ? <CheckCircleOutlined /> : <QuestionCircleOutlined />}
                <b>{cp.timestamp_display}</b> - {cp.title} (+{cp.points}đ)
                {isTeacher && (
                  <DeleteOutlined
                    style={{ color: '#ef4444', marginLeft: 4 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCheckpoint(cp.id);
                    }}
                  />
                )}
              </Tag>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: CÂU HỎI TƯƠNG TÁC TẠM DỪNG VIDEO (STUDENT INTERACTIVE QUIZ)      */}
      {/* ========================================================================= */}
      <Modal
        title={
          <Space>
            <Tag color="#7c3aed">MỐC KIỂM TRA TẠI {activeCheckpoint?.timestamp_display}</Tag>
            <span>{activeCheckpoint?.title}</span>
          </Space>
        }
        open={isQuestionModalOpen}
        closable={false}
        maskClosable={false}
        width={680}
        footer={
          answerSubmitted ? (
            <Button
              type="primary"
              size="large"
              style={{ background: '#2563eb' }}
              icon={<PlayCircleOutlined />}
              onClick={handleContinueVideo}
            >
              Tiếp Tục Xem Video Bài Giảng
            </Button>
          ) : (
            <Space>
              <Button onClick={() => { setIsQuestionModalOpen(false); setIsPlaying(false); }}>
                Đóng tạm
              </Button>
              <Button
                type="primary"
                size="large"
                style={{ background: '#7c3aed', borderColor: '#7c3aed' }}
                onClick={handleSubmitAnswer}
              >
                Xác Nhận Câu Trả Lời
              </Button>
            </Space>
          )
        }
      >
        {activeCheckpoint && (
          <div style={{ padding: '8px 0' }}>
            <Alert
              message="Video đã tạm dừng tự động"
              description="Vui lòng trả lời chính xác câu hỏi kiểm tra kiến thức dưới đây để mở khóa tiếp tục bài học."
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />

            <Paragraph style={{ fontSize: 16, fontWeight: 600, color: '#1e293b', lineHeight: 1.6 }}>
              {activeCheckpoint.question}
            </Paragraph>

            <Radio.Group
              value={selectedOption}
              onChange={(e) => !answerSubmitted && setSelectedOption(e.target.value)}
              style={{ width: '100%', marginBottom: 16 }}
              disabled={answerSubmitted}
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                {activeCheckpoint.options?.map(opt => {
                  let radioStyle = {
                    display: 'flex',
                    alignItems: 'center',
                    padding: '10px 14px',
                    borderRadius: 8,
                    border: '1px solid #e2e8f0',
                    background: '#f8fafc',
                    width: '100%',
                    marginBottom: 8
                  };

                  if (answerSubmitted) {
                    if (opt.key === submissionResult?.correctAnswer) {
                      radioStyle.background = '#f0fdf4';
                      radioStyle.border = '1px solid #22c55e';
                    } else if (opt.key === selectedOption && !submissionResult?.isCorrect) {
                      radioStyle.background = '#fef2f2';
                      radioStyle.border = '1px solid #ef4444';
                    }
                  }

                  return (
                    <Radio key={opt.key} value={opt.key} style={radioStyle}>
                      <Space>
                        <b style={{ color: '#2563eb' }}>{opt.key}.</b>
                        <span style={{ fontSize: 14 }}>{opt.text}</span>
                      </Space>
                    </Radio>
                  );
                })}
              </Space>
            </Radio.Group>

            {answerSubmitted && (
              <Alert
                message={submissionResult?.isCorrect ? "CHÍNH XÁC! XUẤT SẮC!" : "CHƯA ĐÚNG! HÃY ÔN LẠI KIẾN THỨC NÀY"}
                description={
                  <div>
                    <p style={{ margin: '4px 0' }}>{submissionResult?.explanation}</p>
                    <Text type="secondary">
                      Đáp án đúng là: <b style={{ color: '#16a34a' }}>{submissionResult?.correctAnswer}</b>
                    </Text>
                  </div>
                }
                type={submissionResult?.isCorrect ? "success" : "error"}
                showIcon
                icon={submissionResult?.isCorrect ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
              />
            )}
          </div>
        )}
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL 2: GIẢNG VIÊN THÊM MỐC CÂU HỎI DỪNG CHECKPOINT (TEACHER AUTHORING)  */}
      {/* ========================================================================= */}
      <Modal
        title={
          <Space>
            <SettingOutlined style={{ color: '#7c3aed' }} />
            <span>Thêm Điểm Dừng Câu Hỏi Video Tương Tác</span>
          </Space>
        }
        open={isAddModalOpen}
        onCancel={() => setIsAddModalOpen(false)}
        onOk={() => addForm.submit()}
        okText="Lưu Điểm Dừng"
        cancelText="Hủy"
        width={650}
      >
        <Form form={addForm} layout="vertical" onFinish={handleAddCheckpoint}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="timestamp_seconds"
                label="Mốc thời gian dừng (Giây)"
                rules={[{ required: true, message: 'Nhập số giây' }]}
              >
                <InputNumber min={1} max={duration} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="points" label="Điểm thưởng đạt được" initialValue={10}>
                <InputNumber min={1} max={50} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="title"
            label="Tiêu đề gợi nhớ"
            rules={[{ required: true, message: 'Nhập tiêu đề câu hỏi' }]}
          >
            <Input placeholder="Ví dụ: Kiểm tra nhanh khái niệm con trỏ" />
          </Form.Item>

          <Form.Item
            name="question"
            label="Nội dung câu hỏi trắc nghiệm"
            rules={[{ required: true, message: 'Nhập nội dung câu hỏi' }]}
          >
            <Input.TextArea orientation="horizontal" rows={3} placeholder="Ví dụ: Toán tử nào sau đây dùng để lấy địa chỉ biến?" />
          </Form.Item>

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="optA" label="Phương án A" rules={[{ required: true }]}>
                <Input placeholder="Nội dung đáp án A" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="optB" label="Phương án B" rules={[{ required: true }]}>
                <Input placeholder="Nội dung đáp án B" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="optC" label="Phương án C" rules={[{ required: true }]}>
                <Input placeholder="Nội dung đáp án C" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="optD" label="Phương án D" rules={[{ required: true }]}>
                <Input placeholder="Nội dung đáp án D" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="correct_answer"
                label="Đáp án đúng"
                rules={[{ required: true }]}
                initialValue="A"
              >
                <Radio.Group buttonStyle="solid">
                  <Radio.Button value="A">A</Radio.Button>
                  <Radio.Button value="B">B</Radio.Button>
                  <Radio.Button value="C">C</Radio.Button>
                  <Radio.Button value="D">D</Radio.Button>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item name="explanation" label="Giải thích chi tiết đáp án">
                <Input placeholder="Giải thích lý do phương án này đúng..." />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </Card>
  );
}

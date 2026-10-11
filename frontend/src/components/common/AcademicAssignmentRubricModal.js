// frontend/src/components/common/AcademicAssignmentRubricModal.js
// 📋 Phân Hệ Quản Lý Bài Tập Tự Luận & Chấm Điểm Theo Rubrics Sư Phạm
import React, { useState, useEffect } from 'react';
import {
  Modal, Button, Space, Typography, Tag, Table, Input, Select,
  Row, Col, Card, Tooltip, DatePicker, message, Divider, Tabs,
  Badge, Progress, Form, Upload, Alert
} from 'antd';
import {
  FileTextOutlined, CheckCircleOutlined, ClockCircleOutlined,
  UploadOutlined, DownloadOutlined, EditOutlined, EyeOutlined,
  SaveOutlined, WarningOutlined, UserOutlined, TeamOutlined,
  AuditOutlined, TrophyOutlined, CheckOutlined, CloseCircleOutlined
} from '@ant-design/icons';
import apiClient from '../../services/apiClient';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export default function AcademicAssignmentRubricModal({
  open,
  onClose,
  sectionId = 1,
  moduleId = 1001,
  isStudent = false,
  studentCode = '261IT001',
  studentName = 'Trần Văn Nam',
  onSuccess
}) {
  const [loading, setLoading] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [activeTab, setActiveTab] = useState('LIST'); // 'LIST' | 'GRADING' | 'CREATE' | 'STUDENT_SUBMIT'
  
  // State phục vụ Giảng viên chấm bài Split-Screen
  const [submissionsList, setSubmissionsList] = useState([]);
  const [activeSubmission, setActiveSubmission] = useState(null);
  const [selectedRubricScores, setSelectedRubricScores] = useState({});
  const [gradingScore, setGradingScore] = useState(0);
  const [gradingFeedback, setGradingFeedback] = useState('');
  const [gradingSaving, setGradingSaving] = useState(false);

  // State phục vụ Sinh viên nộp bài
  const [submissionText, setSubmissionText] = useState('');
  const [attachmentName, setAttachmentName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // State tạo bài tập mới
  const [createTitle, setCreateTitle] = useState('');
  const [createDesc, setCreateDesc] = useState('');
  const [createDueDate, setCreateDueDate] = useState('');
  const [createMaxScore, setCreateMaxScore] = useState(10.0);

  // Tải danh sách bài tập khi mở Modal
  useEffect(() => {
    if (open) {
      fetchAssignments();
    }
  }, [open, sectionId]);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/academic/assignments?section_id=${sectionId}&student_code=${studentCode}`);
      if (res.data && res.data.success) {
        setAssignments(res.data.data || []);
        if (res.data.data.length > 0 && !selectedAssignment) {
          setSelectedAssignment(res.data.data[0]);
        }
      }
    } catch (err) {
      console.error('Lỗi tải bài tập:', err);
      message.error('Không thể tải danh sách bài tập');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async (assignmentId) => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/academic/assignments/${assignmentId}/submissions`);
      if (res.data && res.data.success) {
        setSubmissionsList(res.data.fullClassList || []);
        if (res.data.submissions && res.data.submissions.length > 0) {
          openGradingView(res.data.submissions[0], res.data.assignment);
        } else {
          setActiveSubmission(null);
        }
      }
    } catch (err) {
      console.error('Lỗi tải danh sách bài nộp:', err);
      message.error('Không thể tải bài nộp');
    } finally {
      setLoading(false);
    }
  };

  // Mở giao diện chấm bài của 1 sinh viên
  const openGradingView = (sub, assign) => {
    setActiveSubmission(sub);
    const rubrics = assign?.rubric_criteria || selectedAssignment?.rubric_criteria || [];
    
    // Nạp điểm rubric cũ nếu có
    const initialRubric = sub.rubric_scores || {};
    setSelectedRubricScores(initialRubric);
    setGradingScore(sub.score || 0);
    setGradingFeedback(sub.feedback || '');
    setActiveTab('GRADING');
  };

  // Khi giảng viên click chọn 1 mức điểm trong Rubric
  const handleSelectRubricLevel = (critId, points) => {
    const updated = { ...selectedRubricScores, [critId]: points };
    setSelectedRubricScores(updated);

    // Tính tổng điểm tức thì
    const total = Object.values(updated).reduce((sum, p) => sum + parseFloat(p || 0), 0);
    setGradingScore(parseFloat(total.toFixed(2)));
  };

  // Lưu điểm chấm bài
  const handleSaveGrading = async () => {
    if (!activeSubmission) return;
    try {
      setGradingSaving(true);
      const res = await apiClient.post(`/academic/assignments/submissions/${activeSubmission.id}/grade`, {
        score: gradingScore,
        rubric_scores: selectedRubricScores,
        feedback: gradingFeedback,
        graded_by: 'TS. Hoàng Đức Em'
      });

      if (res.data && res.data.success) {
        message.success(res.data.message || 'Đã lưu điểm và cập nhật sổ điểm học phần!');
        // Cập nhật lại danh sách
        if (selectedAssignment) {
          fetchSubmissions(selectedAssignment.id);
        }
        fetchAssignments();
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      console.error('Lỗi lưu điểm:', err);
      message.error(err.response?.data?.message || 'Lỗi khi lưu điểm');
    } finally {
      setGradingSaving(false);
    }
  };

  // Sinh viên nộp bài
  const handleSubmitAssignment = async () => {
    if (!selectedAssignment) return;
    if (!submissionText && !attachmentName) {
      message.warning('Vui lòng nhập văn bản bài làm hoặc đính kèm tệp');
      return;
    }

    try {
      setSubmitting(true);
      const res = await apiClient.post(`/academic/assignments/${selectedAssignment.id}/submit`, {
        student_code: studentCode,
        student_name: studentName,
        class_name: '66.CNTT-1',
        submission_text: submissionText,
        attachment_url: attachmentName ? `/uploads/assignments/${attachmentName}` : '',
        attachment_name: attachmentName,
        attachment_size: 15400000
      });

      if (res.data && res.data.success) {
        message.success(res.data.message || 'Đã nộp bài tập thành công!');
        fetchAssignments();
        setActiveTab('LIST');
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      console.error('Lỗi nộp bài:', err);
      message.error(err.response?.data?.message || 'Lỗi khi nộp bài');
    } finally {
      setSubmitting(false);
    }
  };

  // Tạo mới bài tập
  const handleCreateAssignment = async () => {
    if (!createTitle.trim()) {
      message.warning('Vui lòng nhập tiêu đề bài tập');
      return;
    }
    try {
      setLoading(true);
      const res = await apiClient.post('/academic/assignments', {
        section_id: sectionId,
        module_id: moduleId,
        title: createTitle,
        description: createDesc,
        due_date: createDueDate || new Date(Date.now() + 14 * 24 * 3600 * 1000),
        max_score: createMaxScore,
        status: 'PUBLISHED'
      });

      if (res.data && res.data.success) {
        message.success('Đã tạo mới bài tập kèm Rubric chuẩn!');
        setCreateTitle('');
        setCreateDesc('');
        fetchAssignments();
        setActiveTab('LIST');
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      console.error('Lỗi tạo bài tập:', err);
      message.error('Không thể tạo bài tập');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={
        <Space>
          <FileTextOutlined style={{ color: '#2563eb', fontSize: 20 }} />
          <Text strong style={{ fontSize: 17 }}>
            {isStudent
              ? 'Phân Hệ Bài Tập Tự Luận & Báo Cáo Học Phần'
              : 'Trung Tâm Quản Lý Bài Tập & Chấm Điểm Rubrics Sư Phạm'}
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
        <Space orientation="horizontal" style={{ width: '100%', justifyContent: 'space-between' }}>
          <Space>
            <Button
              type={activeTab === 'LIST' ? 'primary' : 'default'}
              icon={<FileTextOutlined />}
              onClick={() => setActiveTab('LIST')}
            >
              Danh Sách Bài Tập ({assignments.length})
            </Button>
            {!isStudent && (
              <Button
                type={activeTab === 'CREATE' ? 'primary' : 'default'}
                icon={<EditOutlined />}
                onClick={() => setActiveTab('CREATE')}
              >
                + Giao Bài Tập Mới (Kèm Rubrics)
              </Button>
            )}
          </Space>
          {selectedAssignment && (
            <Tag color="blue" style={{ fontSize: 13, padding: '4px 10px' }}>
              Bài đang chọn: <b>{selectedAssignment.title}</b>
            </Tag>
          )}
        </Space>
      </div>

      {/* ========================================================
          TAB 1: DANH SÁCH BÀI TẬP & DANH SÁCH BÀI NỘP CỦA LỚP
          ======================================================== */}
      {activeTab === 'LIST' && (
        <div>
          {assignments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <Paragraph type="secondary">Chưa có bài tập tự luận nào được tạo trong học phần này.</Paragraph>
              {!isStudent && (
                <Button type="primary" onClick={() => setActiveTab('CREATE')}>
                  Tạo Bài Tập Đầu Tiên
                </Button>
              )}
            </div>
          ) : (
            <Row gutter={[16, 16]}>
              {assignments.map(assign => {
                const isMySub = assign.mySubmission;
                return (
                  <Col span={24} key={assign.id}>
                    <Card
                      style={{
                        borderRadius: 8,
                        border: selectedAssignment?.id === assign.id ? '2px solid #2563eb' : '1px solid #e2e8f0'
                      }}
                      bodyStyle={{ padding: 16 }}
                    >
                      <Row justify="space-between" align="middle">
                        <Col span={14}>
                          <Space orientation="vertical" size={2}>
                            <Space>
                              <Text strong style={{ fontSize: 16, color: '#1e293b' }}>
                                {assign.title}
                              </Text>
                              <Tag color="purple">Max {assign.max_score} điểm</Tag>
                              <Tag color={assign.status === 'PUBLISHED' ? 'success' : 'warning'}>
                                {assign.status === 'PUBLISHED' ? 'Đã Xuất Bản' : 'Bản Nháp'}
                              </Tag>
                            </Space>
                            <Paragraph
                              ellipsis={{ rows: 2 }}
                              style={{ margin: 0, color: '#64748b', fontSize: 13 }}
                            >
                              {assign.description || 'Không có mô tả chi tiết.'}
                            </Paragraph>
                            <Space size="large" style={{ marginTop: 4 }}>
                              <Text type="secondary" style={{ fontSize: 12 }}>
                                <ClockCircleOutlined /> Hạn nộp: <b>{assign.due_date ? new Date(assign.due_date).toLocaleString('vi-VN') : 'Không giới hạn'}</b>
                              </Text>
                              <Text type="secondary" style={{ fontSize: 12 }}>
                                📁 Cho phép: <code>{assign.allowed_file_types || '.pdf,.zip'}</code>
                              </Text>
                            </Space>
                          </Space>
                        </Col>

                        <Col span={10} style={{ textAlign: 'right' }}>
                          {isStudent ? (
                            // Góc nhìn Sinh viên
                            <Space orientation="vertical" align="end">
                              {isMySub ? (
                                <Space>
                                  <Tag color={isMySub.status === 'GRADED' ? 'success' : 'processing'} style={{ fontSize: 13, padding: '4px 8px' }}>
                                    {isMySub.status === 'GRADED'
                                      ? `✓ ĐÃ CHẤM: ${isMySub.score} / 10 Điểm`
                                      : '⌛ ĐÃ NỘP (CHỜ CHẤM)'}
                                  </Tag>
                                  <Button
                                    size="small"
                                    type="primary"
                                    onClick={() => {
                                      setSelectedAssignment(assign);
                                      setSubmissionText(isMySub.submission_text || '');
                                      setAttachmentName(isMySub.attachment_name || '');
                                      setActiveTab('STUDENT_SUBMIT');
                                    }}
                                  >
                                    Xem Lại / Nộp Bổ Sung
                                  </Button>
                                </Space>
                              ) : (
                                <Button
                                  type="primary"
                                  style={{ backgroundColor: '#10b981', borderColor: '#10b981' }}
                                  icon={<UploadOutlined />}
                                  onClick={() => {
                                    setSelectedAssignment(assign);
                                    setActiveTab('STUDENT_SUBMIT');
                                  }}
                                >
                                  Nộp Bài Tập Ngay
                                </Button>
                              )}
                            </Space>
                          ) : (
                            // Góc nhìn Giảng viên
                            <Space>
                              <div style={{ textAlign: 'center', marginRight: 12 }}>
                                <Text strong style={{ fontSize: 18, color: '#2563eb' }}>
                                  {assign.stats?.totalSubmissions || 0}
                                </Text>
                                <div style={{ fontSize: 11, color: '#64748b' }}>Đã Nộp</div>
                              </div>
                              <div style={{ textAlign: 'center', marginRight: 16 }}>
                                <Text strong style={{ fontSize: 18, color: '#10b981' }}>
                                  {assign.stats?.gradedSubmissions || 0}
                                </Text>
                                <div style={{ fontSize: 11, color: '#64748b' }}>Đã Chấm</div>
                              </div>
                              <Button
                                type="primary"
                                icon={<AuditOutlined />}
                                onClick={() => {
                                  setSelectedAssignment(assign);
                                  fetchSubmissions(assign.id);
                                }}
                              >
                                Chấm Bài Lớp (Rubrics)
                              </Button>
                            </Space>
                          )}
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          )}

          {/* Nếu Giảng viên đã chọn xem bài nộp của 1 bài tập */}
          {!isStudent && selectedAssignment && submissionsList.length > 0 && (
            <div style={{ marginTop: 24 }}>
              <Divider orientation="left">
                <Space>
                  <TeamOutlined style={{ color: '#2563eb' }} />
                  <Text strong>Danh Sách Sinh Viên Lớp 66.CNTT-1 & Trạng Thái Nộp Bài</Text>
                </Space>
              </Divider>

              <Table
                dataSource={submissionsList}
                rowKey="student_code"
                size="small"
                pagination={{ pageSize: 8 }}
                columns={[
                  {
                    title: 'MSSV',
                    dataIndex: 'student_code',
                    width: 110,
                    render: c => <Text strong code>{c}</Text>
                  },
                  {
                    title: 'Họ và Tên Sinh Viên',
                    dataIndex: 'student_name',
                    render: (name, rec) => (
                      <Space>
                        <UserOutlined />
                        <span>{name}</span>
                        {rec.class_name && <Tag>{rec.class_name}</Tag>}
                      </Space>
                    )
                  },
                  {
                    title: 'Trạng Thái Nộp',
                    dataIndex: 'status',
                    width: 140,
                    render: (st, rec) => {
                      if (!rec.is_submitted) return <Tag color="default">Chưa nộp</Tag>;
                      if (rec.submission?.status === 'GRADED') return <Tag color="success">✓ Đã chấm</Tag>;
                      if (rec.submission?.status === 'LATE') return <Tag color="error">Nộp trễ</Tag>;
                      return <Tag color="processing">Đã nộp bài</Tag>;
                    }
                  },
                  {
                    title: 'Điểm Số',
                    width: 100,
                    render: (_, rec) => (
                      rec.submission?.score !== null && rec.submission?.score !== undefined ? (
                        <Text strong style={{ color: '#2563eb', fontSize: 14 }}>
                          {rec.submission.score} / 10
                        </Text>
                      ) : (
                        <Text type="secondary">—</Text>
                      )
                    )
                  },
                  {
                    title: 'Thời Gian Nộp',
                    width: 160,
                    render: (_, rec) => (
                      rec.submission?.submitted_at ? (
                        <Text style={{ fontSize: 12 }}>
                          {new Date(rec.submission.submitted_at).toLocaleString('vi-VN')}
                        </Text>
                      ) : <Text type="secondary">—</Text>
                    )
                  },
                  {
                    title: 'Thao Tác',
                    width: 130,
                    render: (_, rec) => (
                      rec.is_submitted ? (
                        <Button
                          size="small"
                          type={rec.submission?.status === 'GRADED' ? 'default' : 'primary'}
                          icon={<AuditOutlined />}
                          onClick={() => openGradingView(rec.submission, selectedAssignment)}
                        >
                          {rec.submission?.status === 'GRADED' ? 'Xem / Sửa Điểm' : 'Chấm Bài'}
                        </Button>
                      ) : (
                        <Text type="secondary" style={{ fontSize: 12 }}>Chờ nộp bài</Text>
                      )
                    )
                  }
                ]}
              />
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          TAB 2: GIAO DIỆN CHẤM BÀI SPLIT-SCREEN (GIẢNG VIÊN)
          ======================================================== */}
      {activeTab === 'GRADING' && activeSubmission && selectedAssignment && (
        <div>
          <Alert
            type="info"
            showIcon
            message={
              <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                <span>
                  Chấm bài cho sinh viên: <b>{activeSubmission.student_name}</b> ({activeSubmission.student_code}) — Lớp <b>{activeSubmission.class_name || '66.CNTT-1'}</b>
                </span>
                <Button size="small" onClick={() => setActiveTab('LIST')}>
                  ← Quay lại danh sách lớp
                </Button>
              </Space>
            }
            style={{ marginBottom: 16 }}
          />

          <Row gutter={16}>
            {/* CỘT TRÁI (50%): BÀI LÀM CỦA SINH VIÊN */}
            <Col span={12}>
              <Card
                title={
                  <Space>
                    <FileTextOutlined style={{ color: '#2563eb' }} />
                    <Text strong>Bài Làm & Tệp Đính Kèm Của Sinh Viên</Text>
                  </Space>
                }
                size="small"
                style={{ height: '100%', borderRadius: 8 }}
                bodyStyle={{ maxHeight: 520, overflowY: 'auto' }}
              >
                <div style={{ marginBottom: 12 }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>Thời gian nộp:</Text>{' '}
                  <b>{new Date(activeSubmission.submitted_at).toLocaleString('vi-VN')}</b>{' '}
                  <Tag color={activeSubmission.status === 'LATE' ? 'error' : 'success'}>
                    {activeSubmission.status === 'LATE' ? 'NỘP TRỄ' : 'ĐÚNG HẠN'}
                  </Tag>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <Text strong style={{ display: 'block', marginBottom: 4, color: '#475569' }}>
                    📝 Nội dung thuyết minh / Báo cáo giải trình:
                  </Text>
                  <div
                    style={{
                      padding: 12,
                      background: '#f8fafc',
                      borderRadius: 6,
                      border: '1px solid #e2e8f0',
                      minHeight: 120,
                      whiteSpace: 'pre-wrap',
                      fontSize: 13,
                      lineHeight: 1.6
                    }}
                  >
                    {activeSubmission.submission_text || 'Sinh viên không nhập văn bản giải trình.'}
                  </div>
                </div>

                {activeSubmission.attachment_name && (
                  <div>
                    <Text strong style={{ display: 'block', marginBottom: 4, color: '#475569' }}>
                      📁 Tệp mã nguồn / Tài liệu đính kèm:
                    </Text>
                    <Card size="small" style={{ background: '#f0fdf4', borderColor: '#bbf7d0' }}>
                      <Row justify="space-between" align="middle">
                        <Space>
                          <DownloadOutlined style={{ color: '#16a34a', fontSize: 18 }} />
                          <div>
                            <Text strong style={{ color: '#15803d' }}>{activeSubmission.attachment_name}</Text>
                            <div style={{ fontSize: 11, color: '#65a30d' }}>Dung lượng: ~15 MB • Định dạng chuẩn</div>
                          </div>
                        </Space>
                        <Button
                          size="small"
                          type="primary"
                          ghost
                          icon={<DownloadOutlined />}
                          onClick={() => message.info(`Đang tải file bài làm: ${activeSubmission.attachment_name}`)}
                        >
                          Tải Về Máy
                        </Button>
                      </Row>
                    </Card>
                  </div>
                )}
              </Card>
            </Col>

            {/* CỘT PHẢI (50%): BẢNG TIÊU CHÍ RUBRICS & LỜI PHÊ */}
            <Col span={12}>
              <Card
                title={
                  <Row justify="space-between" align="middle" style={{ width: '100%' }}>
                    <Space>
                      <TrophyOutlined style={{ color: '#f59e0b' }} />
                      <Text strong>Khung Tiêu Chí Đánh Giá (Rubrics)</Text>
                    </Space>
                    <Space>
                      <Text type="secondary" style={{ fontSize: 13 }}>Tổng Điểm:</Text>
                      <Tag color="blue" style={{ fontSize: 16, fontWeight: 'bold', padding: '2px 10px' }}>
                        {gradingScore} / 10.0
                      </Tag>
                    </Space>
                  </Row>
                }
                size="small"
                style={{ height: '100%', borderRadius: 8 }}
                bodyStyle={{ maxHeight: 520, overflowY: 'auto' }}
              >
                {/* Danh sách tiêu chí Rubric */}
                {(selectedAssignment.rubric_criteria || []).map((crit, idx) => {
                  const currentPoint = selectedRubricScores[crit.id];
                  return (
                    <div key={crit.id} style={{ marginBottom: 16, borderBottom: '1px dashed #e2e8f0', paddingBottom: 12 }}>
                      <Row justify="space-between" align="middle" style={{ marginBottom: 6 }}>
                        <Text strong style={{ color: '#1e293b', fontSize: 13 }}>
                          {idx + 1}. {crit.name} ({crit.weight_pct}%)
                        </Text>
                        <Tag color={currentPoint !== undefined ? 'green' : 'default'}>
                          {currentPoint !== undefined ? `${currentPoint} / ${crit.max_points} đ` : `Tối đa ${crit.max_points} đ`}
                        </Tag>
                      </Row>

                      {/* Các mức điểm của tiêu chí */}
                      <Row gutter={[6, 6]}>
                        {(crit.levels || []).map(lvl => {
                          const isSelected = selectedRubricScores[crit.id] === lvl.points;
                          return (
                            <Col span={12} key={lvl.level}>
                              <div
                                onClick={() => handleSelectRubricLevel(crit.id, lvl.points)}
                                style={{
                                  padding: '8px 10px',
                                  borderRadius: 6,
                                  cursor: 'pointer',
                                  border: isSelected ? '2px solid #2563eb' : '1px solid #cbd5e1',
                                  background: isSelected ? '#eff6ff' : '#ffffff',
                                  transition: 'all 0.2s'
                                }}
                              >
                                <Row justify="space-between">
                                  <Text strong style={{ fontSize: 12, color: isSelected ? '#1d4ed8' : '#334155' }}>
                                    {lvl.level}
                                  </Text>
                                  <Text strong style={{ fontSize: 12, color: '#2563eb' }}>
                                    {lvl.points} đ
                                  </Text>
                                </Row>
                                <div style={{ fontSize: 11, color: '#64748b', marginTop: 2, lineHeight: 1.3 }}>
                                  {lvl.description}
                                </div>
                              </div>
                            </Col>
                          );
                        })}
                      </Row>
                    </div>
                  );
                })}

                {/* Lời phê sư phạm & Nhận xét của giảng viên */}
                <div style={{ marginTop: 12 }}>
                  <Text strong style={{ display: 'block', marginBottom: 4, color: '#334155' }}>
                    ✍️ Lời phê sư phạm & Hướng dẫn cải tiến:
                  </Text>
                  <TextArea
                    rows={3}
                    placeholder="Nhập nhận xét chi tiết, khen ngợi ưu điểm và chỉ rõ các điểm cần khắc phục..."
                    value={gradingFeedback}
                    onChange={e => setGradingFeedback(e.target.value)}
                  />
                </div>

                <div style={{ marginTop: 16, textAlign: 'right' }}>
                  <Space>
                    <Button onClick={() => setActiveTab('LIST')}>Hủy Bỏ</Button>
                    <Button
                      type="primary"
                      icon={<SaveOutlined />}
                      loading={gradingSaving}
                      onClick={handleSaveGrading}
                      style={{ backgroundColor: '#2563eb' }}
                    >
                      💾 Lưu Điểm & Cập Nhật Sổ Điểm Học Phần
                    </Button>
                  </Space>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      )}

      {/* ========================================================
          TAB 3: SINH VIÊN NỘP BÀI TẬP
          ======================================================== */}
      {activeTab === 'STUDENT_SUBMIT' && selectedAssignment && (
        <Card
          title={
            <Space>
              <UploadOutlined style={{ color: '#10b981' }} />
              <Text strong>Nộp Bài Tập: {selectedAssignment.title}</Text>
            </Space>
          }
          style={{ borderRadius: 8 }}
        >
          <div style={{ marginBottom: 16 }}>
            <Alert
              type="warning"
              showIcon
              message={
                <span>
                  Hạn chót nộp bài: <b>{selectedAssignment.due_date ? new Date(selectedAssignment.due_date).toLocaleString('vi-VN') : 'Không giới hạn'}</b>. Vui lòng nộp trước thời hạn để không bị trừ điểm nộp trễ.
                </span>
              }
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <Text strong style={{ display: 'block', marginBottom: 4 }}>
              1. Văn bản bài làm / Báo cáo giải trình:
            </Text>
            <TextArea
              rows={4}
              placeholder="Nhập phần trả lời, thuyết minh kiến trúc thuật toán hoặc đường dẫn GitHub repository..."
              value={submissionText}
              onChange={e => setSubmissionText(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <Text strong style={{ display: 'block', marginBottom: 4 }}>
              2. Đính kèm tệp bài làm ({selectedAssignment.allowed_file_types}):
            </Text>
            <Space>
              <Input
                style={{ width: 360 }}
                placeholder="Tên tệp đính kèm (VD: 261IT001_BaoCao_BTL1.zip)"
                value={attachmentName}
                onChange={e => setAttachmentName(e.target.value)}
              />
              <Button
                icon={<UploadOutlined />}
                onClick={() => {
                  setAttachmentName(`${studentCode}_BaiTap_${selectedAssignment.id}.zip`);
                  message.success('Đã gắn tệp mẫu thành công!');
                }}
              >
                Gắn Tệp Mẫu Nén (.zip)
              </Button>
            </Space>
          </div>

          {/* Bảng Rubric tham khảo để sinh viên biết tiêu chuẩn chấm */}
          <Divider orientation="left">
            <Text strong style={{ fontSize: 13, color: '#64748b' }}>
              Bảng Tiêu Chí Đánh Giá (Rubric) Tham Khảo
            </Text>
          </Divider>
          <Row gutter={[12, 12]} style={{ marginBottom: 20 }}>
            {(selectedAssignment.rubric_criteria || []).map((c, i) => (
              <Col span={12} key={c.id}>
                <Card size="small" style={{ background: '#f8fafc' }}>
                  <Text strong>{i + 1}. {c.name} ({c.weight_pct}%)</Text>
                  <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>
                    Tối đa {c.max_points} điểm • Gồm {c.levels?.length || 4} mức xếp loại
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          <div style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setActiveTab('LIST')}>Quay Lại</Button>
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                loading={submitting}
                onClick={handleSubmitAssignment}
                style={{ backgroundColor: '#10b981', borderColor: '#10b981' }}
              >
                Xác Nhận Nộp Bài Tập
              </Button>
            </Space>
          </div>
        </Card>
      )}

      {/* ========================================================
          TAB 4: GIẢNG VIÊN TẠO MỚI BÀI TẬP KÈM RUBRICS
          ======================================================== */}
      {activeTab === 'CREATE' && (
        <Card
          title={
            <Space>
              <EditOutlined style={{ color: '#2563eb' }} />
              <Text strong>Khởi Tạo Bài Tập Tự Luận Mới (Kèm Rubrics Sư Phạm)</Text>
            </Space>
          }
          style={{ borderRadius: 8 }}
        >
          <div style={{ marginBottom: 14 }}>
            <Text strong>Tiêu đề bài tập / Đề tài:</Text>
            <Input
              style={{ marginTop: 4 }}
              placeholder="VD: Bài tập lớn 2: Cài đặt thuật toán Dijkstra và Tối ưu hóa đường đi"
              value={createTitle}
              onChange={e => setCreateTitle(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: 14 }}>
            <Text strong>Yêu cầu chi tiết & Hướng dẫn sinh viên:</Text>
            <TextArea
              style={{ marginTop: 4 }}
              rows={3}
              placeholder="Mô tả đề bài, các ca kiểm thử test cases bắt buộc, quy cách nộp mã nguồn..."
              value={createDesc}
              onChange={e => setCreateDesc(e.target.value)}
            />
          </div>

          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={12}>
              <Text strong>Điểm tối đa:</Text>
              <Input
                style={{ marginTop: 4 }}
                type="number"
                value={createMaxScore}
                onChange={e => setCreateMaxScore(parseFloat(e.target.value) || 10.0)}
              />
            </Col>
            <Col span={12}>
              <Text strong>Hạn chót nộp bài (Sau ngày này tính trễ hạn):</Text>
              <Input
                style={{ marginTop: 4 }}
                type="datetime-local"
                value={createDueDate}
                onChange={e => setCreateDueDate(e.target.value)}
              />
            </Col>
          </Row>

          <Alert
            type="success"
            showIcon
            message="Bộ tiêu chí Rubrics sư phạm chuẩn (4 tiêu chí: Tính đúng đắn 40%, Kiến trúc & Tối ưu 30%, Quy chuẩn 20%, Sáng tạo 10%) sẽ được tự động liên kết với bài tập này."
            style={{ marginBottom: 16 }}
          />

          <div style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setActiveTab('LIST')}>Hủy Bỏ</Button>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                loading={loading}
                onClick={handleCreateAssignment}
              >
                Xuất Bản Bài Tập & Kích Hoạt Rubrics
              </Button>
            </Space>
          </div>
        </Card>
      )}
    </Modal>
  );
}

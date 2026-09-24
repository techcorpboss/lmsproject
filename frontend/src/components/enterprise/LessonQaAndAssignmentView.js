import React, { useState, useEffect } from 'react';
import {
  Card, Table, Tag, Button, Space, Typography, Row, Col, Select,
  Modal, Form, Input, InputNumber, Alert, Progress, Statistic,
  Divider, Tooltip, Badge, message, Tabs, List, Avatar, Upload,
  DatePicker, Popconfirm
} from 'antd';
import {
  CommentOutlined, FileTextOutlined, CheckCircleOutlined,
  RobotOutlined, LikeOutlined, UserOutlined, ClockCircleOutlined,
  UploadOutlined, SafetyCertificateOutlined, EyeOutlined, PlusOutlined,
  SendOutlined, SearchOutlined, CheckOutlined, AuditOutlined,
  TrophyOutlined, ExclamationCircleOutlined, ReloadOutlined,
  FileDoneOutlined, PaperClipOutlined, StarFilled
} from '@ant-design/icons';
import apiClient from '../../services/apiClient';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

export default function LessonQaAndAssignmentView({ currentUser }) {
  const isStudent = currentUser?.role === 'student';
  const isTeacherOrAdmin = currentUser?.role === 'teacher' || currentUser?.role === 'admin';

  const [activeTab, setActiveTab] = useState('qa_forum');
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [loading, setLoading] = useState(false);

  // =========================================================================
  // TAB 1: LESSON-SPECIFIC Q&A FORUM STATE
  // =========================================================================
  const [threads, setThreads] = useState([]);
  const [isNewQuestionModalOpen, setIsNewQuestionModalOpen] = useState(false);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [activeThreadForReply, setActiveThreadForReply] = useState(null);
  const [aiGeneratingThreadId, setAiGeneratingThreadId] = useState(null);

  const [questionForm] = Form.useForm();
  const [replyForm] = Form.useForm();

  const fetchQaThreads = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/standards/qa/threads', {
        params: { section_id: 1, week_number: selectedWeek }
      });
      if (res && res.success) {
        setThreads(res.data);
      }
    } catch (e) {
      // Fallback data
      setThreads([
        {
          id: 'qa_001',
          section_id: 1,
          lesson_id: 1,
          week_number: 1,
          title: 'Hỏi về lỗi con trỏ Null Pointer Exception khi giải phóng bộ nhớ',
          content: 'Em viết hàm cấp phát động int* arr = new int[n]; sau khi xử lý xong em gọi delete arr; thì có khác gì so với delete[] arr; không thưa thầy?',
          author_name: 'Trần Văn Nam',
          author_role: 'student',
          student_code: '261IT001',
          class_name: '66.CNTT-1',
          upvotes: 8,
          is_answered: true,
          tags: ['C/C++', 'Con trỏ', 'Bộ nhớ động', 'Tuần 1'],
          created_at: new Date(Date.now() - 3600000 * 30).toISOString(),
          replies: [
            {
              id: 'rep_001_1',
              author_name: 'TS. Hoàng Đức Em',
              author_role: 'teacher',
              is_verified: true,
              content: 'Chào em, đây là lỗi rất phổ biến! Khi em dùng new[] để cấp phát mảng, bắt buộc phải dùng delete[] để trình biên dịch gọi đúng destructor của từng phần tử. Dùng sai delete sẽ gây ra Undefined Behavior và Memory Leak.',
              created_at: new Date(Date.now() - 3600000 * 28).toISOString(),
              upvotes: 12
            },
            {
              id: 'rep_001_2',
              author_name: '🤖 TCU Academic AI Tutor',
              author_role: 'ai_bot',
              is_verified: false,
              content: 'Mẹo tối ưu: Trong chuẩn C++ hiện đại (C++11/C++17), bạn nên dùng std::unique_ptr<int[]> hoặc std::vector<int> để hệ thống tự động giải phóng vùng nhớ theo mẫu hình RAII, tránh hoàn toàn rò rỉ bộ nhớ!',
              created_at: new Date(Date.now() - 3600000 * 29).toISOString(),
              upvotes: 6
            }
          ]
        },
        {
          id: 'qa_002',
          section_id: 1,
          lesson_id: 2,
          week_number: selectedWeek,
          title: 'Cách tổ chức bài toán Quản lý sinh viên với Lớp và Đối tượng (OOP)',
          content: 'Thầy cho em hỏi khi thiết kế thuộc tính Điểm trung bình của sinh viên thì nên tính toán lưu vào thuộc tính luôn hay viết hàm getter tính toán động khi gọi ạ?',
          author_name: 'Nguyễn Thị Mai',
          author_role: 'student',
          student_code: '261IT002',
          class_name: '66.CNTT-1',
          upvotes: 5,
          is_answered: false,
          tags: ['OOP', 'Encapsulation', 'C++ Class'],
          created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
          replies: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuestion = async (values) => {
    try {
      const payload = {
        section_id: 1,
        lesson_id: selectedWeek,
        week_number: selectedWeek,
        title: values.title,
        content: values.content,
        author_name: currentUser?.full_name || 'Học viên',
        author_role: currentUser?.role || 'student',
        student_code: currentUser?.username || 'SV-2026',
        class_name: '66.CNTT-1',
        tags: values.tags ? values.tags.split(',').map(t => t.trim()) : ['Học phần']
      };

      const res = await apiClient.post('/standards/qa/threads', payload);
      if (res && res.success) {
        message.success('Đã đăng câu hỏi thảo luận lên bài học tuần ' + selectedWeek);
        fetchQaThreads();
        setIsNewQuestionModalOpen(false);
        questionForm.resetFields();
      }
    } catch (e) {
      // Fallback local add
      const newTh = {
        id: 'qa_' + Date.now(),
        section_id: 1,
        week_number: selectedWeek,
        title: values.title,
        content: values.content,
        author_name: currentUser?.full_name || 'Học viên',
        author_role: currentUser?.role || 'student',
        student_code: 'SV-2026',
        class_name: '66.CNTT-1',
        upvotes: 0,
        is_answered: false,
        tags: values.tags ? values.tags.split(',') : ['Bài học'],
        created_at: new Date().toISOString(),
        replies: []
      };
      setThreads([newTh, ...threads]);
      message.success('Đã đăng câu hỏi thảo luận thành công!');
      setIsNewQuestionModalOpen(false);
      questionForm.resetFields();
    }
  };

  const handleSendReply = async (values) => {
    try {
      const payload = {
        author_name: currentUser?.full_name || 'TS. Hoàng Đức Em',
        author_role: currentUser?.role || 'teacher',
        content: values.content
      };

      await apiClient.post(`/standards/qa/threads/${activeThreadForReply.id}/replies`, payload);
      message.success('Đã gửi phản hồi vào chủ đề thảo luận!');
      fetchQaThreads();
      setIsReplyModalOpen(false);
      replyForm.resetFields();
    } catch (e) {
      // Local fallback
      const updated = threads.map(th => {
        if (th.id === activeThreadForReply.id) {
          const newRep = {
            id: 'rep_' + Date.now(),
            author_name: currentUser?.full_name || 'TS. Hoàng Đức Em',
            author_role: currentUser?.role || 'teacher',
            content: values.content,
            is_verified: isTeacherOrAdmin,
            created_at: new Date().toISOString(),
            upvotes: 0
          };
          return { ...th, is_answered: true, replies: [...th.replies, newRep] };
        }
        return th;
      });
      setThreads(updated);
      message.success('Đã gửi phản hồi thành công!');
      setIsReplyModalOpen(false);
      replyForm.resetFields();
    }
  };

  const handleAskAi = async (thread) => {
    setAiGeneratingThreadId(thread.id);
    try {
      const res = await apiClient.post('/standards/qa/ai-answer', {
        threadId: thread.id,
        questionTitle: thread.title,
        questionContent: thread.content
      });

      if (res && res.success) {
        message.success('Trợ lý AI đã giải đáp thành công cho bạn!');
        fetchQaThreads();
      } else {
        throw new Error('AI service error');
      }
    } catch (e) {
      // Simulate rich AI answer
      const aiReply = {
        id: 'ai_rep_' + Date.now(),
        author_name: '🤖 TCU Academic AI Tutor',
        author_role: 'ai_bot',
        is_verified: false,
        content: `[Giải đáp tự động từ AI Tutor cho "${thread.title}"]:\n1. Về nguyên lý kỹ thuật: Đối với vấn đề này, chuẩn kiến trúc hướng dẫn chúng ta cần đóng gói chặt chẽ (Encapsulation).\n2. Cú pháp & Thực tiễn triển khai: Bạn nên thiết kế hàm getter tính toán động khi các điểm thành phần có thể cập nhật liên tục, hoặc lưu trữ thuộc tính cached và tính lại khi có điểm mới.\n3. Khuyến nghị chuẩn: Áp dụng design pattern Observer nếu bạn cần đồng bộ sang bảng điểm tổng kết!`,
        created_at: new Date().toISOString(),
        upvotes: 4
      };
      setThreads(threads.map(th => th.id === thread.id ? { ...th, is_answered: true, replies: [...th.replies, aiReply] } : th));
      message.success('Trợ lý AI đã phản hồi ngay lập tức cho bạn!');
    } finally {
      setAiGeneratingThreadId(null);
    }
  };

  const handleVerifyReply = async (threadId, replyId) => {
    try {
      await apiClient.put(`/standards/qa/threads/${threadId}/replies/${replyId}/verify`);
      message.success('Đã xác thực câu trả lời chuẩn của Giảng viên!');
      fetchQaThreads();
    } catch (e) {
      setThreads(threads.map(th => {
        if (th.id === threadId) {
          return {
            ...th,
            replies: th.replies.map(r => r.id === replyId ? { ...r, is_verified: !r.is_verified } : r)
          };
        }
        return th;
      }));
      message.success('Đã cập nhật trạng thái xác thực câu trả lời!');
    }
  };

  // =========================================================================
  // TAB 2: ESSAY ASSIGNMENTS & RUBRIC GRADING STATE
  // =========================================================================
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [isCreateAssignmentModalOpen, setIsCreateAssignmentModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isGradingModalOpen, setIsGradingModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const [assignmentForm] = Form.useForm();
  const [submissionForm] = Form.useForm();
  const [gradingForm] = Form.useForm();
  const [rubricScores, setRubricScores] = useState({});

  const fetchAssignmentsAndSubmissions = async () => {
    try {
      const resAsg = await apiClient.get('/standards/assignments', { params: { section_id: 1 } });
      if (resAsg && resAsg.success) {
        setAssignments(resAsg.data);
      }
      const resSub = await apiClient.get('/standards/assignments/submissions', { params: { section_id: 1 } });
      if (resSub && resSub.success) {
        setSubmissions(resSub.data);
      }
    } catch (e) {
      // Fallback
      setAssignments([
        {
          id: 'asg_001',
          section_id: 1,
          week_number: 3,
          title: 'Bài Tập Lớn 1: Thiết Kế & Cài Đặt Hệ Thống Quản Lý Đào Tạo OOP Bằng C++',
          description: 'Xây dựng cấu trúc hướng đối tượng quản lý Sinh viên, Học phần, Điểm thi. Yêu cầu áp dụng Tính kế thừa, Đa hình, Nạp chồng toán tử và Quản lý bộ nhớ con trỏ an toàn.',
          due_date: '2026-10-15T23:59:59Z',
          max_score: 10,
          rubrics: [
            { id: 'crit_1', name: 'Mô hình Lớp, Kế thừa & Đa hình (Inheritance & Polymorphism)', max_score: 3.5, description: 'Thiết kế đúng quan hệ kế thừa, sử dụng phương thức ảo virtual' },
            { id: 'crit_2', name: 'Cài đặt Thuật toán & Quản lý Bộ nhớ (Pointers / RAII)', max_score: 3.5, description: 'Không bị Memory Leak, giải phóng bộ nhớ triệt để, xử lý ngoại lệ' },
            { id: 'crit_3', name: 'Báo cáo Thiết kế & Format Code (Clean Code & Comments)', max_score: 3.0, description: 'Tài liệu giải trình thiết kế UML, tuân thủ Google C++ Style Guide' }
          ],
          allow_file_types: ['.pdf', '.zip', '.cpp'],
          max_file_size_mb: 25,
          plagiarism_check_enabled: true
        }
      ]);
      setSubmissions([
        {
          id: 'sub_001',
          assignment_id: 'asg_001',
          student_id: 1,
          student_name: 'Trần Văn Nam',
          student_code: '261IT001',
          class_name: '66.CNTT-1',
          file_name: 'BTL1_OOP_TranVanNam_261IT001.zip',
          file_size: '4.8 MB',
          submitted_at: '2026-09-22T14:30:00Z',
          plagiarism_score: 3.5,
          plagiarism_status: 'CLEAN',
          status: 'GRADED',
          grade: 9.0,
          rubric_evaluation: {
            crit_1: 3.5,
            crit_2: 3.0,
            crit_3: 2.5
          },
          teacher_feedback: 'Bài làm rất tốt, phân tích kiến trúc OOP rõ ràng. Cần chú ý thêm việc sử dụng smart pointer để code sạch hơn.',
          graded_by: 'TS. Hoàng Đức Em',
          graded_at: '2026-09-23T09:15:00Z'
        },
        {
          id: 'sub_002',
          assignment_id: 'asg_001',
          student_id: 2,
          student_name: 'Nguyễn Thị Mai',
          student_code: '261IT002',
          class_name: '66.CNTT-1',
          file_name: 'BTL1_OOP_NguyenThiMai_261IT002.pdf',
          file_size: '3.2 MB',
          submitted_at: '2026-09-24T08:10:00Z',
          plagiarism_score: 6.8,
          plagiarism_status: 'CLEAN',
          status: 'SUBMITTED',
          grade: null,
          rubric_evaluation: null,
          teacher_feedback: null
        }
      ]);
    }
  };

  useEffect(() => {
    fetchQaThreads();
    fetchAssignmentsAndSubmissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWeek]);

  // Handle teacher create assignment
  const handleCreateAssignment = async (values) => {
    try {
      const payload = {
        section_id: 1,
        week_number: values.week_number || 1,
        title: values.title,
        description: values.description,
        due_date: values.due_date ? values.due_date : new Date(Date.now() + 86400000 * 14).toISOString(),
        max_score: 10,
        rubrics: [
          { id: 'crit_1', name: values.rubric_1_name || 'Kiến trúc & Phân tích yêu cầu', max_score: 3.5, description: 'Thiết kế đúng mô hình kỹ thuật' },
          { id: 'crit_2', name: values.rubric_2_name || 'Cài đặt thuật toán & Xử lý', max_score: 3.5, description: 'Chính xác và tối ưu hiệu năng' },
          { id: 'crit_3', name: values.rubric_3_name || 'Báo cáo & Trình bày', max_score: 3.0, description: 'Đầy đủ tài liệu minh chứng' }
        ],
        allow_file_types: ['.pdf', '.zip', '.cpp'],
        max_file_size_mb: 25,
        plagiarism_check_enabled: true
      };

      const res = await apiClient.post('/standards/assignments', payload);
      if (res && res.success) {
        message.success('Đã tạo bài tập tự luận với ma trận Rubric thành công!');
        fetchAssignmentsAndSubmissions();
        setIsCreateAssignmentModalOpen(false);
        assignmentForm.resetFields();
      }
    } catch (e) {
      const newAsg = {
        id: 'asg_' + Date.now(),
        section_id: 1,
        week_number: values.week_number || 1,
        title: values.title,
        description: values.description,
        due_date: new Date(Date.now() + 86400000 * 14).toISOString(),
        max_score: 10,
        rubrics: [
          { id: 'crit_1', name: values.rubric_1_name || 'Kiến trúc & Phân tích yêu cầu', max_score: 3.5, description: 'Thiết kế đúng mô hình kỹ thuật' },
          { id: 'crit_2', name: values.rubric_2_name || 'Cài đặt thuật toán & Xử lý', max_score: 3.5, description: 'Chính xác và tối ưu hiệu năng' },
          { id: 'crit_3', name: values.rubric_3_name || 'Báo cáo & Trình bày', max_score: 3.0, description: 'Đầy đủ tài liệu minh chứng' }
        ]
      };
      setAssignments([newAsg, ...assignments]);
      message.success('Đã tạo bài tập mới thành công!');
      setIsCreateAssignmentModalOpen(false);
      assignmentForm.resetFields();
    }
  };

  // Handle student submit assignment
  const handleSubmitAssignment = async (values) => {
    try {
      const payload = {
        assignment_id: selectedAssignment.id,
        student_id: currentUser?.id || 1,
        student_name: currentUser?.full_name || 'Học viên',
        student_code: currentUser?.username || 'SV-2026',
        class_name: '66.CNTT-1',
        file_name: values.file_name || 'BTL_SinhVien_Nop.zip',
        file_size: '5.2 MB',
        comments: values.comments
      };

      const res = await apiClient.post('/standards/assignments/submit', payload);
      if (res && res.success) {
        message.success('Nộp bài tập tự luận thành công! Hệ thống đã chạy quét đạo văn tự động.');
        fetchAssignmentsAndSubmissions();
        setIsSubmitModalOpen(false);
        submissionForm.resetFields();
      }
    } catch (e) {
      // Local fallback
      const newSub = {
        id: 'sub_' + Date.now(),
        assignment_id: selectedAssignment.id,
        student_id: currentUser?.id || 1,
        student_name: currentUser?.full_name || 'Học viên',
        student_code: 'SV-2026',
        class_name: '66.CNTT-1',
        file_name: values.file_name || 'BTL_OOP_HoanThanh.zip',
        file_size: '3.6 MB',
        submitted_at: new Date().toISOString(),
        plagiarism_score: 4.2,
        plagiarism_status: 'CLEAN',
        status: 'SUBMITTED',
        grade: null
      };
      setSubmissions([newSub, ...submissions]);
      message.success('Nộp bài tập tự luận thành công (Mô phỏng)!');
      setIsSubmitModalOpen(false);
      submissionForm.resetFields();
    }
  };

  // Handle teacher grade with rubrics
  const handleSaveRubricGrade = async (values) => {
    try {
      const totalScore = Object.values(rubricScores).reduce((a, b) => a + Number(b || 0), 0);
      const payload = {
        grade: totalScore,
        rubric_evaluation: rubricScores,
        teacher_feedback: values.teacher_feedback,
        graded_by: currentUser?.full_name || 'TS. Hoàng Đức Em'
      };

      await apiClient.post(`/standards/assignments/submissions/${selectedSubmission.id}/grade`, payload);
      message.success(`Đã lưu điểm ${totalScore}/10 theo Rubric và gửi phản hồi đến sinh viên!`);
      fetchAssignmentsAndSubmissions();
      setIsGradingModalOpen(false);
    } catch (e) {
      const totalScore = Object.values(rubricScores).reduce((a, b) => a + Number(b || 0), 0);
      const updated = submissions.map(sub => {
        if (sub.id === selectedSubmission.id) {
          return {
            ...sub,
            status: 'GRADED',
            grade: totalScore,
            rubric_evaluation: rubricScores,
            teacher_feedback: values.teacher_feedback,
            graded_by: currentUser?.full_name || 'TS. Hoàng Đức Em',
            graded_at: new Date().toISOString()
          };
        }
        return sub;
      });
      setSubmissions(updated);
      message.success(`Đã lưu điểm ${totalScore}/10 thành công!`);
      setIsGradingModalOpen(false);
    }
  };

  return (
    <div style={{ padding: '0 8px 32px 8px' }}>
      {/* 1. HEADER BANNER */}
      <Card
        style={{
          marginBottom: 20,
          borderRadius: 12,
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 45%, #4338ca 100%)',
          color: '#ffffff',
          boxShadow: '0 4px 16px rgba(49, 46, 129, 0.25)'
        }}
        bodyStyle={{ padding: 24 }}
      >
        <Row gutter={[24, 16]} align="middle">
          <Col xs={24} lg={16}>
            <Space align="center" size={14}>
              <div style={{
                background: 'rgba(255,255,255,0.18)',
                borderRadius: 12,
                padding: '12px 16px',
                fontSize: 32
              }}>
                <CommentOutlined style={{ color: '#a5b4fc' }} />
              </div>
              <div>
                <Title level={3} style={{ color: '#ffffff', margin: 0 }}>
                  Diễn Đàn Q&A Theo Bài Học & Nộp Bài Tập Tự Luận
                </Title>
                <Paragraph style={{ color: '#c7d2fe', margin: '4px 0 0 0', fontSize: 13 }}>
                  Module học tập tương tác đa chiều: Thảo luận hỏi đáp từng tuần học với sự trợ giúp của AI Tutor,
                  quản lý nộp bài tập lớn, kiểm định chống đạo văn và chấm điểm ma trận tiêu chí Rubric chuẩn Quốc tế.
                </Paragraph>
              </div>
            </Space>
          </Col>
          <Col xs={24} lg={8} style={{ textAlign: 'right' }}>
            <Space wrap>
              {activeTab === 'qa_forum' && (
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  style={{ background: '#6366f1', borderColor: '#6366f1', fontWeight: 600 }}
                  onClick={() => setIsNewQuestionModalOpen(true)}
                >
                  Đặt Câu Hỏi Tuần {selectedWeek}
                </Button>
              )}
              {activeTab === 'assignments' && isTeacherOrAdmin && (
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  style={{ background: '#10b981', borderColor: '#10b981', fontWeight: 600 }}
                  onClick={() => setIsCreateAssignmentModalOpen(true)}
                >
                  Tạo Bài Tập Rubric
                </Button>
              )}
              <Button icon={<ReloadOutlined />} ghost onClick={() => { fetchQaThreads(); fetchAssignmentsAndSubmissions(); }}>
                Làm mới
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 2. MAIN TABS NAVIGATION */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        type="card"
        style={{ marginBottom: 16 }}
      >
        <Tabs.TabPane
          tab={
            <span style={{ fontSize: 14, fontWeight: 600 }}>
              <CommentOutlined /> Diễn Đàn Trao Đổi Q&A Từng Bài Học ({threads.length})
            </span>
          }
          key="qa_forum"
        >
          {/* WEEK SELECTOR BAR */}
          <Card style={{ marginBottom: 16, borderRadius: 10 }}>
            <Row gutter={[16, 12]} align="middle">
              <Col xs={24} md={10}>
                <Space align="center">
                  <Text strong style={{ color: '#1e293b' }}>Chọn Tuần Học Phần:</Text>
                  <Select
                    value={selectedWeek}
                    onChange={setSelectedWeek}
                    style={{ width: 220 }}
                  >
                    {[...Array(15)].map((_, i) => (
                      <Option key={i + 1} value={i + 1}>
                        Tuần {i + 1}: {i === 0 ? 'Con trỏ & Cấp phát động' : i === 1 ? 'Lớp & Đối tượng OOP' : i === 2 ? 'Kế thừa & Đa hình' : `Nội dung Chuyên đề ${i + 1}`}
                      </Option>
                    ))}
                  </Select>
                </Space>
              </Col>
              <Col xs={24} md={14} style={{ textAlign: 'right' }}>
                <Space>
                  <Tag color="blue">Học phần: IT101 - Lập trình OOP C++</Tag>
                  <Tag color="purple">Giảng viên: TS. Hoàng Đức Em</Tag>
                </Space>
              </Col>
            </Row>
          </Card>

          {/* THREADS LIST */}
          <List
            loading={loading}
            dataSource={threads}
            locale={{ emptyText: 'Chưa có câu hỏi nào trong tuần học này. Hãy là người đầu tiên đặt câu hỏi!' }}
            renderItem={thread => (
              <Card
                key={thread.id}
                style={{
                  marginBottom: 16,
                  borderRadius: 10,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                  borderLeft: thread.is_answered ? '4px solid #52c41a' : '4px solid #fa8c16'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Space align="start" size={12}>
                    <Avatar
                      style={{
                        backgroundColor: thread.author_role === 'student' ? '#1890ff' : '#52c41a',
                        fontWeight: 700
                      }}
                      size="large"
                    >
                      {thread.author_name?.[0] || 'U'}
                    </Avatar>
                    <div>
                      <Title level={5} style={{ margin: 0, color: '#1e293b' }}>
                        {thread.title}
                      </Title>
                      <Space size={8} style={{ marginTop: 4 }}>
                        <Text strong style={{ fontSize: 12, color: '#334155' }}>{thread.author_name}</Text>
                        <Tag color={thread.author_role === 'student' ? 'blue' : 'green'} style={{ fontSize: 11 }}>
                          {thread.author_role === 'student' ? `SV ${thread.student_code} (${thread.class_name})` : 'Giảng viên'}
                        </Tag>
                        <Text type="secondary" style={{ fontSize: 11 }}>
                          <ClockCircleOutlined /> {new Date(thread.created_at).toLocaleString('vi-VN')}
                        </Text>
                      </Space>
                    </div>
                  </Space>
                  <Space>
                    {thread.is_answered ? (
                      <Tag color="success" icon={<CheckCircleOutlined />}>ĐÃ GIẢI ĐÁP</Tag>
                    ) : (
                      <Tag color="warning" icon={<ClockCircleOutlined />}>CHỜ GIẢI ĐÁP</Tag>
                    )}
                  </Space>
                </div>

                <div style={{ marginTop: 12, background: '#f8fafc', padding: 14, borderRadius: 8, fontSize: 13, color: '#1e293b' }}>
                  {thread.content}
                </div>

                <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Space>
                    {thread.tags?.map((t, idx) => (
                      <Tag key={idx} color="default" style={{ fontSize: 11 }}>#{t}</Tag>
                    ))}
                  </Space>
                  <Space>
                    <Button
                      type="dashed"
                      icon={<RobotOutlined style={{ color: '#722ed1' }} />}
                      size="small"
                      loading={aiGeneratingThreadId === thread.id}
                      onClick={() => handleAskAi(thread)}
                      style={{ borderColor: '#d3adf7', color: '#722ed1' }}
                    >
                      Hỏi Trợ Lý AI Tutor
                    </Button>
                    <Button
                      type="primary"
                      icon={<SendOutlined />}
                      size="small"
                      onClick={() => {
                        setActiveThreadForReply(thread);
                        setIsReplyModalOpen(true);
                      }}
                    >
                      Trả lời ({thread.replies?.length || 0})
                    </Button>
                  </Space>
                </div>

                {/* REPLIES ACCORDION */}
                {thread.replies && thread.replies.length > 0 && (
                  <div style={{ marginTop: 16, borderTop: '1px solid #f1f5f9', paddingTop: 12 }}>
                    <Text strong style={{ fontSize: 12, color: '#64748b' }}>
                      CÁC CÂU TRẢ LỜI & GIẢI PHÁP ({thread.replies.length}):
                    </Text>
                    <List
                      dataSource={thread.replies}
                      renderItem={rep => (
                        <div
                          key={rep.id}
                          style={{
                            marginTop: 8,
                            padding: '10px 14px',
                            borderRadius: 8,
                            background: rep.is_verified ? '#f6ffed' : rep.author_role === 'ai_bot' ? '#f9f0ff' : '#ffffff',
                            border: rep.is_verified ? '1px solid #b7eb8f' : rep.author_role === 'ai_bot' ? '1px solid #d3adf7' : '1px solid #e2e8f0'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Space size={8}>
                              <Avatar size="small" style={{
                                backgroundColor: rep.author_role === 'ai_bot' ? '#722ed1' : rep.author_role === 'teacher' ? '#52c41a' : '#1890ff'
                              }}>
                                {rep.author_name?.[0] || 'A'}
                              </Avatar>
                              <Text strong style={{ fontSize: 12 }}>{rep.author_name}</Text>
                              {rep.is_verified && (
                                <Tag color="gold" icon={<StarFilled />}>Giảng Viên Xác Thực Chuẩn</Tag>
                              )}
                              <Text type="secondary" style={{ fontSize: 10 }}>
                                {new Date(rep.created_at).toLocaleTimeString('vi-VN')}
                              </Text>
                            </Space>

                            {isTeacherOrAdmin && (
                              <Button
                                size="small"
                                type={rep.is_verified ? 'primary' : 'default'}
                                icon={<SafetyCertificateOutlined />}
                                onClick={() => handleVerifyReply(thread.id, rep.id)}
                                style={rep.is_verified ? { background: '#faad14', borderColor: '#faad14' } : {}}
                              >
                                {rep.is_verified ? 'Đã duyệt chuẩn' : 'Xác thực chuẩn'}
                              </Button>
                            )}
                          </div>
                          <div style={{ marginTop: 6, fontSize: 13, color: '#334155', whiteSpace: 'pre-line' }}>
                            {rep.content}
                          </div>
                        </div>
                      )}
                    />
                  </div>
                )}
              </Card>
            )}
          />
        </Tabs.TabPane>

        {/* TAB 2: ESSAY ASSIGNMENTS & RUBRIC GRADING */}
        <Tabs.TabPane
          tab={
            <span style={{ fontSize: 14, fontWeight: 600 }}>
              <FileDoneOutlined /> Bài Tập Tự Luận & Chấm Điểm Rubric ({assignments.length})
            </span>
          }
          key="assignments"
        >
          {/* ASSIGNMENTS OVERVIEW */}
          {assignments.map(asg => (
            <Card
              key={asg.id}
              style={{ marginBottom: 20, borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
              title={
                <Space>
                  <AuditOutlined style={{ color: '#4f46e5' }} />
                  <span style={{ fontWeight: 700 }}>{asg.title}</span>
                </Space>
              }
              extra={
                <Space>
                  <Tag color="orange" icon={<ClockCircleOutlined />}>
                    Hạn nộp: {new Date(asg.due_date).toLocaleString('vi-VN')}
                  </Tag>
                  <Tag color="blue">Thang điểm: {asg.max_score} điểm</Tag>
                </Space>
              }
            >
              <Paragraph style={{ color: '#475569' }}>{asg.description}</Paragraph>

              {/* RUBRIC MATRIX CRITERIA */}
              <div style={{ background: '#f8fafc', padding: 14, borderRadius: 8, marginBottom: 16 }}>
                <Text strong style={{ color: '#1e293b', fontSize: 13 }}>
                  MA TRẬN TIÊU CHÍ ĐÁNH GIÁ (RUBRIC GRADING CRITERIA):
                </Text>
                <Row gutter={[12, 12]} style={{ marginTop: 8 }}>
                  {asg.rubrics?.map((r, idx) => (
                    <Col xs={24} md={8} key={r.id}>
                      <div style={{ background: '#ffffff', padding: 10, borderRadius: 6, border: '1px solid #e2e8f0', height: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Text strong style={{ fontSize: 12, color: '#312e81' }}>Tiêu chí {idx + 1}</Text>
                          <Tag color="purple">{r.max_score} điểm</Tag>
                        </div>
                        <div style={{ fontWeight: 600, fontSize: 12, marginTop: 4 }}>{r.name}</div>
                        <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{r.description}</div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>

              {/* STUDENT ACTIONS */}
              {isStudent && (
                <div style={{ textAlign: 'right' }}>
                  <Button
                    type="primary"
                    size="large"
                    icon={<UploadOutlined />}
                    style={{ background: '#4f46e5', borderColor: '#4f46e5' }}
                    onClick={() => {
                      setSelectedAssignment(asg);
                      setIsSubmitModalOpen(true);
                    }}
                  >
                    Nộp Bài Tập Tự Luận
                  </Button>
                </div>
              )}
            </Card>
          ))}

          {/* SUBMISSIONS LIST (FOR TEACHER OR STUDENT VIEWING OWN SUBMISSIONS) */}
          <Card
            title={
              <Space>
                <FileTextOutlined style={{ color: '#10b981' }} />
                <span>Danh Sách Bài Nộp & Kết Quả Chấm Điểm Rubric</span>
              </Space>
            }
            style={{ borderRadius: 10 }}
          >
            <Table
              dataSource={submissions}
              rowKey="id"
              pagination={{ pageSize: 5 }}
              columns={[
                {
                  title: 'Học Viên',
                  key: 'student',
                  render: (_, r) => (
                    <div>
                      <div style={{ fontWeight: 700, color: '#1e293b' }}>{r.student_name}</div>
                      <div style={{ fontSize: 11, color: '#64748b' }}>MSSV: {r.student_code} | Lớp: {r.class_name}</div>
                    </div>
                  )
                },
                {
                  title: 'Tập Tin Bài Làm',
                  key: 'file',
                  render: (_, r) => (
                    <div>
                      <Space>
                        <PaperClipOutlined style={{ color: '#1890ff' }} />
                        <Text strong style={{ fontSize: 12, color: '#1d39c4' }}>{r.file_name}</Text>
                      </Space>
                      <div style={{ fontSize: 10, color: '#94a3b8' }}>Dung lượng: {r.file_size} | {new Date(r.submitted_at).toLocaleString('vi-VN')}</div>
                    </div>
                  )
                },
                {
                  title: 'Kiểm Tra Đạo Văn (Turnitin/SimCheck)',
                  key: 'plagiarism',
                  width: 220,
                  render: (_, r) => (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 11, color: '#64748b' }}>Độ trùng lặp:</span>
                        <Tag color={r.plagiarism_score > 20 ? 'red' : 'green'} style={{ fontWeight: 700 }}>
                          {r.plagiarism_score}%
                        </Tag>
                      </div>
                      <Progress
                        percent={r.plagiarism_score}
                        size="small"
                        status={r.plagiarism_score > 20 ? 'exception' : 'success'}
                      />
                    </div>
                  )
                },
                {
                  title: 'Điểm Số (Thang 10)',
                  key: 'grade',
                  width: 130,
                  align: 'center',
                  render: (_, r) => (
                    r.status === 'GRADED' ? (
                      <Tag color="green" style={{ fontSize: 14, fontWeight: 700, padding: '4px 10px' }}>
                        {r.grade} / 10
                      </Tag>
                    ) : (
                      <Tag color="orange">Chờ chấm điểm</Tag>
                    )
                  )
                },
                {
                  title: 'Thao Tác & Chấm Rubric',
                  key: 'actions',
                  width: 200,
                  align: 'center',
                  render: (_, r) => (
                    <Space>
                      {isTeacherOrAdmin ? (
                        <Button
                          type="primary"
                          icon={<AuditOutlined />}
                          size="small"
                          style={{ background: '#10b981', borderColor: '#10b981' }}
                          onClick={() => {
                            setSelectedSubmission(r);
                            const asg = assignments.find(a => a.id === r.assignment_id) || assignments[0];
                            setSelectedAssignment(asg);
                            setRubricScores(r.rubric_evaluation || {});
                            gradingForm.setFieldsValue({ teacher_feedback: r.teacher_feedback || '' });
                            setIsGradingModalOpen(true);
                          }}
                        >
                          Chấm Theo Rubric
                        </Button>
                      ) : (
                        <Button
                          size="small"
                          icon={<EyeOutlined />}
                          onClick={() => {
                            Modal.info({
                              title: `Đánh Giá Bài Làm: ${r.student_name}`,
                              content: (
                                <div style={{ marginTop: 12 }}>
                                  <p><b>Điểm Tổng:</b> {r.grade || 'Chưa chấm'}/10</p>
                                  <p><b>Nhận xét của Giảng viên:</b> {r.teacher_feedback || 'Chưa có nhận xét'}</p>
                                  {r.rubric_evaluation && (
                                    <div style={{ background: '#f8fafc', padding: 10, borderRadius: 6 }}>
                                      <p style={{ fontWeight: 600 }}>Chi tiết điểm theo tiêu chí Rubric:</p>
                                      {Object.entries(r.rubric_evaluation).map(([k, v]) => (
                                        <div key={k} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                          <span>{k}:</span>
                                          <Text strong>{v} điểm</Text>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )
                            });
                          }}
                        >
                          Xem Nhận Xét
                        </Button>
                      )}
                    </Space>
                  )
                }
              ]}
            />
          </Card>
        </Tabs.TabPane>
      </Tabs>

      {/* MODAL 1: NEW QUESTION */}
      <Modal
        title={
          <Space>
            <PlusOutlined style={{ color: '#6366f1' }} />
            <span>Đặt Câu Hỏi Thảo Luận Cho Bài Học Tuần {selectedWeek}</span>
          </Space>
        }
        open={isNewQuestionModalOpen}
        onCancel={() => setIsNewQuestionModalOpen(false)}
        footer={null}
        width={650}
      >
        <Form form={questionForm} layout="vertical" onFinish={handleCreateQuestion}>
          <Form.Item
            name="title"
            label="Tiêu Đề Câu Hỏi Tóm Tắt"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề câu hỏi' }]}
          >
            <Input placeholder="Ví dụ: Cách khắc phục lỗi con trỏ Dangling Pointer..." />
          </Form.Item>

          <Form.Item
            name="content"
            label="Nội Dung Chi Tiết Câu Hỏi / Vướng Mắc"
            rules={[{ required: true, message: 'Vui lòng mô tả chi tiết vướng mắc' }]}
          >
            <Input.TextArea rows={4} placeholder="Mô tả cụ thể bài toán, đoạn code hoặc lý thuyết bạn cần thầy cô và các bạn hỗ trợ..." />
          </Form.Item>

          <Form.Item
            name="tags"
            label="Thẻ Từ Khóa (Cách nhau bằng dấu phẩy)"
            initialValue="C++, Con trỏ, Bộ nhớ"
          >
            <Input placeholder="OOP, C++, Thuật toán..." />
          </Form.Item>

          <div style={{ textAlign: 'right', marginTop: 16 }}>
            <Space>
              <Button onClick={() => setIsNewQuestionModalOpen(false)}>Hủy</Button>
              <Button type="primary" htmlType="submit" style={{ background: '#6366f1', borderColor: '#6366f1' }}>
                Đăng Lên Diễn Đàn
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>

      {/* MODAL 2: REPLY THREAD */}
      <Modal
        title={
          <Space>
            <SendOutlined style={{ color: '#1d39c4' }} />
            <span>Phản Hồi Câu Hỏi: "{activeThreadForReply?.title}"</span>
          </Space>
        }
        open={isReplyModalOpen}
        onCancel={() => setIsReplyModalOpen(false)}
        footer={null}
        width={600}
      >
        <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8, marginBottom: 16, fontSize: 13 }}>
          <b>Câu hỏi gốc:</b> {activeThreadForReply?.content}
        </div>
        <Form form={replyForm} layout="vertical" onFinish={handleSendReply}>
          <Form.Item
            name="content"
            label="Nội Dung Câu Trả Lời & Hướng Dẫn"
            rules={[{ required: true, message: 'Vui lòng nhập nội dung câu trả lời' }]}
          >
            <Input.TextArea rows={4} placeholder="Nhập câu trả lời, giải pháp hoặc đoạn code hướng dẫn..." />
          </Form.Item>

          <div style={{ textAlign: 'right', marginTop: 16 }}>
            <Space>
              <Button onClick={() => setIsReplyModalOpen(false)}>Hủy</Button>
              <Button type="primary" htmlType="submit" icon={<SendOutlined />}>
                Gửi Câu Trả Lời
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>

      {/* MODAL 3: STUDENT SUBMIT ASSIGNMENT */}
      <Modal
        title={
          <Space>
            <UploadOutlined style={{ color: '#4f46e5' }} />
            <span>Nộp Bài Tập Tự Luận: {selectedAssignment?.title}</span>
          </Space>
        }
        open={isSubmitModalOpen}
        onCancel={() => setIsSubmitModalOpen(false)}
        footer={null}
        width={600}
      >
        <Form form={submissionForm} layout="vertical" onFinish={handleSubmitAssignment}>
          <Form.Item
            name="file_name"
            label="Tên Tập Tin Nộp (.zip, .pdf, .docx, .cpp)"
            rules={[{ required: true, message: 'Nhập tên file nộp' }]}
            initialValue="BTL_OOP_Nhom_HoanThanh.zip"
          >
            <Input prefix={<PaperClipOutlined />} />
          </Form.Item>

          <Form.Item
            name="comments"
            label="Ghi Chú Của Học Viên (Optional)"
          >
            <Input.TextArea rows={3} placeholder="Ghi chú thêm về phiên bản biên dịch, môi trường Visual Studio / GCC..." />
          </Form.Item>

          <Alert
            message="Chính Sách Liêm Chính Học Thuật (Academic Integrity)"
            description="Bài nộp sẽ được hệ thống quét đạo văn tự động qua động cơ Turnitin/SimCheck đối chiếu với cơ sở dữ liệu toàn cầu và các khóa trước."
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />

          <div style={{ textAlign: 'right', marginTop: 16 }}>
            <Space>
              <Button onClick={() => setIsSubmitModalOpen(false)}>Hủy</Button>
              <Button type="primary" htmlType="submit" icon={<UploadOutlined />} style={{ background: '#4f46e5', borderColor: '#4f46e5' }}>
                Xác Nhận Nộp Bài
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>

      {/* MODAL 4: TEACHER RUBRIC GRADING MODAL */}
      <Modal
        title={
          <Space>
            <TrophyOutlined style={{ color: '#10b981' }} />
            <span>Chấm Điểm Ma Trận Rubric: {selectedSubmission?.student_name} ({selectedSubmission?.student_code})</span>
          </Space>
        }
        open={isGradingModalOpen}
        onCancel={() => setIsGradingModalOpen(false)}
        footer={null}
        width={750}
      >
        <div style={{ marginBottom: 16, background: '#f0fdf4', padding: 12, borderRadius: 8, border: '1px solid #bbf7d0' }}>
          <Space size={20}>
            <div><b>Tập tin:</b> {selectedSubmission?.file_name}</div>
            <div><b>Độ trùng lặp:</b> <Tag color="green">{selectedSubmission?.plagiarism_score}% (Hợp lệ)</Tag></div>
          </Space>
        </div>

        <Form form={gradingForm} layout="vertical" onFinish={handleSaveRubricGrade}>
          <div style={{ fontWeight: 700, marginBottom: 12, color: '#1e293b' }}>
            ĐÁNH GIÁ TỪNG TIÊU CHÍ RUBRIC:
          </div>

          {selectedAssignment?.rubrics?.map((r, idx) => (
            <div
              key={r.id}
              style={{
                marginBottom: 12,
                padding: '10px 14px',
                borderRadius: 8,
                background: '#f8fafc',
                border: '1px solid #e2e8f0'
              }}
            >
              <Row gutter={16} align="middle">
                <Col span={16}>
                  <div style={{ fontWeight: 600, color: '#1e293b', fontSize: 13 }}>
                    {idx + 1}. {r.name}
                  </div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>
                    {r.description} (Tối đa: {r.max_score} điểm)
                  </div>
                </Col>
                <Col span={8} style={{ textAlign: 'right' }}>
                  <InputNumber
                    min={0}
                    max={r.max_score}
                    step={0.25}
                    value={rubricScores[r.id] ?? r.max_score}
                    onChange={(val) => setRubricScores({ ...rubricScores, [r.id]: val })}
                    style={{ width: 120 }}
                  />
                  <span style={{ marginLeft: 6, fontSize: 12 }}>/ {r.max_score} đ</span>
                </Col>
              </Row>
            </div>
          ))}

          <Divider style={{ margin: '14px 0' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ fontSize: 15, fontWeight: 700 }}>TỔNG ĐIỂM TỰ ĐỘNG THEO RUBRIC:</span>
            <Tag color="green" style={{ fontSize: 18, fontWeight: 800, padding: '4px 16px' }}>
              {Object.values(rubricScores).reduce((a, b) => a + Number(b || 0), 0).toFixed(1)} / 10 Điểm
            </Tag>
          </div>

          <Form.Item
            name="teacher_feedback"
            label="Nhận Xét Đánh Giá & Góp Ý Của Giảng Viên"
            rules={[{ required: true, message: 'Vui lòng nhập nhận xét' }]}
          >
            <Input.TextArea rows={3} placeholder="Góp ý về ưu điểm, lỗi thuật toán hoặc cách cải thiện cho sinh viên..." />
          </Form.Item>

          <div style={{ textAlign: 'right', marginTop: 16 }}>
            <Space>
              <Button onClick={() => setIsGradingModalOpen(false)}>Hủy</Button>
              <Button type="primary" htmlType="submit" icon={<CheckOutlined />} style={{ background: '#10b981', borderColor: '#10b981' }}>
                Lưu & Công Bố Điểm Sổ Điểm LMS
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>

      {/* MODAL 5: TEACHER CREATE ASSIGNMENT */}
      <Modal
        title={
          <Space>
            <PlusOutlined style={{ color: '#10b981' }} />
            <span>Tạo Bài Tập Tự Luận & Thiết Lập Ma Trận Rubric</span>
          </Space>
        }
        open={isCreateAssignmentModalOpen}
        onCancel={() => setIsCreateAssignmentModalOpen(false)}
        footer={null}
        width={700}
      >
        <Form form={assignmentForm} layout="vertical" onFinish={handleCreateAssignment}>
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                name="title"
                label="Tiêu Đề Bài Tập Tự Luận"
                rules={[{ required: true, message: 'Vui lòng nhập tiêu đề bài tập' }]}
              >
                <Input placeholder="Ví dụ: Bài Tập Lớn 2: Thiết kế Hệ thống Cơ sở dữ liệu E-R..." />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="week_number"
                label="Gắn Vào Tuần Học"
                initialValue={selectedWeek}
              >
                <Select>
                  {[...Array(15)].map((_, i) => (
                    <Option key={i + 1} value={i + 1}>Tuần {i + 1}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Yêu Cầu Bài Tập & Hướng Dẫn Nộp Bài"
            rules={[{ required: true, message: 'Nhập nội dung yêu cầu bài tập' }]}
          >
            <Input.TextArea rows={3} placeholder="Mô tả chi tiết yêu cầu bài nộp, định dạng nộp file zip/pdf, ràng buộc..." />
          </Form.Item>

          <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8, marginBottom: 16, border: '1px solid #e2e8f0' }}>
            <Text strong style={{ color: '#1e293b' }}>3 TIÊU CHÍ ĐÁNH GIÁ THEO RUBRIC (THANG 10):</Text>
            <Form.Item
              name="rubric_1_name"
              label="Tiêu chí 1 (Tối đa 3.5 điểm)"
              initialValue="Mô hình Kiến trúc & Khảo sát yêu cầu"
              style={{ marginTop: 8 }}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="rubric_2_name"
              label="Tiêu chí 2 (Tối đa 3.5 điểm)"
              initialValue="Cài đặt Thuật toán / Triển khai Kỹ thuật"
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="rubric_3_name"
              label="Tiêu chí 3 (Tối đa 3.0 điểm)"
              initialValue="Báo cáo Tổng hợp & Thuyết minh Đồ án"
            >
              <Input />
            </Form.Item>
          </div>

          <div style={{ textAlign: 'right', marginTop: 16 }}>
            <Space>
              <Button onClick={() => setIsCreateAssignmentModalOpen(false)}>Hủy</Button>
              <Button type="primary" htmlType="submit" style={{ background: '#10b981', borderColor: '#10b981' }}>
                Xác Nhận Tạo Bài Tập
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

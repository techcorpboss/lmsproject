// frontend/src/features/academic/components/AcademicLmsWorkspace.js
// 📚 Không Gian E-Learning Học Phần Tín Chỉ (Academic LMS - ĐH, Thạc Sĩ, Tiến Sĩ)
// Chuẩn hóa theo Thông tư 08/2021/TT-BGDĐT & Thông tư 23/2021/TT-BGDĐT
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  Card, Row, Col, Typography, Button, Space, Tag, Table, Select,
  Modal, Form, Input, Alert, Tabs, Popconfirm, Badge,
  Progress, Statistic, Divider, Tooltip, Radio, InputNumber,
  Collapse, List, Avatar, Empty, Spin, DatePicker, Switch, message
} from 'antd';
import {
  BookOutlined, VideoCameraOutlined, FileTextOutlined, CheckCircleOutlined,
  QuestionCircleOutlined, MessageOutlined, PlusOutlined, DeleteOutlined,
  ClockCircleOutlined, ThunderboltOutlined, PlayCircleOutlined, CheckOutlined,
  EyeOutlined, SendOutlined, TrophyOutlined, GlobalOutlined,
  ReloadOutlined, LikeOutlined, TeamOutlined, BarChartOutlined,
  DownloadOutlined, PrinterOutlined, WarningOutlined, LinkOutlined,
  CodeOutlined, SolutionOutlined, ReadOutlined, EditOutlined,
  FormOutlined, PlusCircleOutlined, FullscreenOutlined, FullscreenExitOutlined,
  ZoomInOutlined, ZoomOutOutlined, CopyOutlined, FileWordOutlined,
  FilePdfOutlined, DesktopOutlined, LeftOutlined, RightOutlined,
  FilePptOutlined, SoundOutlined, ForwardOutlined, LockOutlined,
  UnlockOutlined, UploadOutlined
} from '@ant-design/icons';
import academicTrainingApi from '../services/academicTrainingApi';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;
function AcademicLmsWorkspace({
  sectionId = 1,
  role = 'LECTURER', // 'LECTURER' or 'STUDENT'
  studentId = null,
  studentName = 'Sinh viên',
  lecturerName = 'Giảng viên phụ trách'
}) {
  const [loading, setLoading] = useState(true);
  const [lmsData, setLmsData] = useState({ section: null, course: null, modules: [] });
  const [selectedWeek, setSelectedWeek] = useState('ALL');
  
  // Diễn đàn thảo luận
  const [discussions, setDiscussions] = useState([]);
  const [loadingDiscussions, setLoadingDiscussions] = useState(false);
  const [discussionFilter, setDiscussionFilter] = useState('ALL');
  const [discussionContent, setDiscussionContent] = useState('');
  const [discussionTitle, setDiscussionTitle] = useState('');
  const [discussionType, setDiscussionType] = useState('CLASS_GENERAL');
  const [groupName, setGroupName] = useState('');
  const [submittingDiscussion, setSubmittingDiscussion] = useState(false);

  // Thống kê & Phân tích chuyên sâu (Learning Analytics)
  const [analytics, setAnalytics] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  const isStaff = (role === 'LECTURER' || role === 'ADMIN' || role === 'admin' || role === 'teacher');
  const isStudent = (role === 'STUDENT' || role === 'student');

  // Modals for Lecturer & Admin
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [moduleForm] = Form.useForm();
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [selectedModuleIdForMaterial, setSelectedModuleIdForMaterial] = useState(null);
  const [materialForm] = Form.useForm();
  const [videoUploadPreviewUrl, setVideoUploadPreviewUrl] = useState('');
  const [materialTypeSelected, setMaterialTypeSelected] = useState('DOCUMENT');
  const [strictProgression, setStrictProgression] = useState(true);
  
  // Real File Upload States (Tải tệp tin Video, Slide, PDF, Docs, Code từ thiết bị)
  const [materialSourceMode, setMaterialSourceMode] = useState('UPLOAD'); // 'UPLOAD' or 'LINK'
  const [uploadingProgress, setUploadingProgress] = useState(0);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [uploadedFileInfo, setUploadedFileInfo] = useState(null);
  const fileInputRef = useRef(null);

  // Modals & State for Lecturer Quiz Editing (Soạn bài Quiz)
  const [isQuizEditorOpen, setIsQuizEditorOpen] = useState(false);
  const [quizEditorForm] = Form.useForm();
  const [selectedModuleIdForQuiz, setSelectedModuleIdForQuiz] = useState(null);
  const [editingQuizId, setEditingQuizId] = useState(null);
  const [quizQuestionsList, setQuizQuestionsList] = useState([]);
  const [savingQuiz, setSavingQuiz] = useState(false);

  // AI Quiz Generator States (Trợ lý AI sinh đề thi trắc nghiệm chuẩn)
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiTopicInput, setAiTopicInput] = useState('');
  const [aiSummaryInput, setAiSummaryInput] = useState('');
  const [aiQuestionCount, setAiQuestionCount] = useState(5);
  const [aiBloomLevel, setAiBloomLevel] = useState('BLOOM_STANDARD');

  // Modals & State for Student Quiz Taking
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizTimeLeft, setQuizTimeLeft] = useState(600);
  const [quizSubmitting, setQuizSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [tabSwitches, setTabSwitches] = useState(0);

  // Universal Multimedia Learning Content Viewer (Video, Slide, PDF, Word, Code)
  const [activeViewerMaterial, setActiveViewerMaterial] = useState(null);
  const [activeVideoUrl, setActiveVideoUrl] = useState(null);
  const [isContentViewerOpen, setIsContentViewerOpen] = useState(false);
  const [currentSlidePage, setCurrentSlidePage] = useState(1);
  const [pdfZoomLevel, setPdfZoomLevel] = useState(100);
  const [readingTheme, setReadingTheme] = useState('LIGHT'); // 'LIGHT', 'SEPIA', 'DARK'
  const [videoPlaybackSpeed, setVideoPlaybackSpeed] = useState(1.0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [videoProgressPercent, setVideoProgressPercent] = useState(30);
  const [isViewerFullscreen, setIsViewerFullscreen] = useState(false);
  const [fontSizeOffset, setFontSizeOffset] = useState(0);

  // Mở Trình Chiếu / Đọc Học Liệu Đa Phương Tiện
  const handleOpenContentViewer = (material) => {
    setActiveViewerMaterial(material);
    setCurrentSlidePage(1);
    setPdfZoomLevel(100);
    setIsVideoPlaying(true);
    setVideoProgressPercent(35);
    setFontSizeOffset(0);
    setIsContentViewerOpen(true);
  };

  // 1. Tải dữ liệu Modules & Quizzes
  const loadLmsData = useCallback(async () => {
    if (!sectionId) return;
    try {
      setLoading(true);
      const res = await academicTrainingApi.getLmsModules(sectionId, studentId);
      if (res.success) {
        setLmsData(res.data);
      }
    } catch (err) {
      message.error('Lỗi nạp bài giảng E-Learning: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [sectionId, studentId]);

  // 2. Tải Diễn đàn thảo luận
  const loadDiscussions = useCallback(async () => {
    if (!sectionId) return;
    try {
      setLoadingDiscussions(true);
      const res = await academicTrainingApi.getLmsDiscussions(sectionId);
      if (res.success) {
        setDiscussions(res.data || []);
      }
    } catch (err) {
      console.warn('Lỗi nạp diễn đàn:', err);
    } finally {
      setLoadingDiscussions(false);
    }
  }, [sectionId]);

  // 3. Tải Báo cáo Thống kê & Phân tích chuyên sâu (Analytics)
  const loadAnalytics = useCallback(async () => {
    if (!sectionId) return;
    try {
      setLoadingAnalytics(true);
      const res = await academicTrainingApi.getSectionLmsAnalytics(sectionId);
      if (res.success) {
        setAnalytics(res.data);
      }
    } catch (err) {
      console.warn('Lỗi nạp thống kê LMS:', err);
    } finally {
      setLoadingAnalytics(false);
    }
  }, [sectionId]);

  // Phát tín hiệu đồng bộ cho Cổng Sinh viên / các tab khác
  const notifyLmsUpdated = useCallback(() => {
    try {
      window.dispatchEvent(new CustomEvent('LMS_CONTENT_UPDATED', { detail: { sectionId, timestamp: Date.now() } }));
      localStorage.setItem('LMS_SYNC_TIMESTAMP', String(Date.now()));
      localStorage.setItem('LMS_SYNC_SECTION_ID', String(sectionId));
    } catch (e) {
      console.warn('LMS notify error:', e);
    }
  }, [sectionId]);

  useEffect(() => {
    loadLmsData();
    loadDiscussions();
    loadAnalytics();
  }, [loadLmsData, loadDiscussions, loadAnalytics]);

  // Lắng nghe sự kiện đồng bộ thời gian thực khi Giảng viên cập nhật ở tab khác hoặc cùng trình duyệt
  useEffect(() => {
    const handleSyncEvent = (e) => {
      const targetSec = e?.detail?.sectionId;
      if (!targetSec || String(targetSec) === String(sectionId)) {
        if (role === 'STUDENT') {
          message.info('🔔 Giảng viên vừa cập nhật thêm nội dung bài giảng / bài quiz mới! Đang đồng bộ...');
        }
        loadLmsData();
        loadDiscussions();
        loadAnalytics();
      }
    };

    const handleStorageEvent = (e) => {
      if (e.key === 'LMS_SYNC_TIMESTAMP') {
        const targetSec = localStorage.getItem('LMS_SYNC_SECTION_ID');
        if (!targetSec || String(targetSec) === String(sectionId)) {
          if (role === 'STUDENT') {
            message.info('🔔 Đã nhận dữ liệu mới từ Cổng Giảng viên! Đang cập nhật...');
          }
          loadLmsData();
          loadDiscussions();
          loadAnalytics();
        }
      }
    };

    window.addEventListener('LMS_CONTENT_UPDATED', handleSyncEvent);
    window.addEventListener('storage', handleStorageEvent);
    return () => {
      window.removeEventListener('LMS_CONTENT_UPDATED', handleSyncEvent);
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, [sectionId, role, loadLmsData, loadDiscussions, loadAnalytics]);

  // Bộ lọc tuần học
  const filteredModules = useMemo(() => {
    const mods = lmsData.modules || [];
    if (selectedWeek === 'ALL') return mods;
    return mods.filter(m => String(m.week_number) === String(selectedWeek));
  }, [lmsData.modules, selectedWeek]);

  // Tính tỷ lệ hoàn thành chi tiết & thanh tiến độ đa chiều (dành cho sinh viên)
  const completionStats = useMemo(() => {
    const mods = lmsData.modules || [];
    let totalMaterials = 0;
    let completedMaterials = 0;
    let totalVideos = 0;
    let completedVideos = 0;
    let totalQuizzes = 0;
    let passedQuizzes = 0;

    mods.forEach(m => {
      (m.materials || []).forEach(mat => {
        totalMaterials++;
        if (mat.is_completed) completedMaterials++;

        const isVid = mat.material_type === 'VIDEO' || (mat.file_url || '').toLowerCase().includes('youtube') || (mat.file_url || '').toLowerCase().includes('.mp4') || (mat.title || '').toLowerCase().includes('video');
        if (isVid) {
          totalVideos++;
          if (mat.is_completed) completedVideos++;
        }
      });

      (m.quizzes || []).forEach(q => {
        totalQuizzes++;
        if (q.best_submission && (q.best_submission.is_passed || Number(q.best_submission.score) >= Number(q.passing_score || 5.0))) {
          passedQuizzes++;
        }
      });
    });

    const totalTrackedItems = totalMaterials + totalQuizzes;
    const completedTrackedItems = completedMaterials + passedQuizzes;
    const percent = totalTrackedItems > 0 ? Math.round((completedTrackedItems / totalTrackedItems) * 100) : 0;

    return {
      totalMaterials,
      completedMaterials,
      totalVideos,
      completedVideos,
      totalQuizzes,
      passedQuizzes,
      percent,
      isQualifiedForExam: percent >= 80
    };
  }, [lmsData.modules]);

  // Kiểm tra điều kiện khóa bài học tuần tự (Sequential Progression Lock theo TT 08/2021)
  // Bắt buộc sinh viên phải hoàn thành và ĐẠT bài Quiz của tuần trước mới được mở khóa tuần tiếp theo
  const moduleLockStatus = useMemo(() => {
    const statusMap = {};
    const sortedModules = [...(lmsData.modules || [])].sort((a, b) => Number(a.week_number) - Number(b.week_number));

    for (let i = 0; i < sortedModules.length; i++) {
      const currentMod = sortedModules[i];
      if (i === 0) {
        // Tuần đầu tiên luôn mở
        statusMap[currentMod.id] = { isLocked: false };
        continue;
      }

      // Kiểm tra tuần trước đó (hoặc bất kỳ tuần nào trước đó chưa đạt)
      let isCurrentLocked = false;
      let lockingReason = '';
      let requiredQuiz = null;
      let prevWeekNumber = null;

      const prevMod = sortedModules[i - 1];
      const prevQuizzes = prevMod.quizzes || [];

      if (prevQuizzes.length > 0) {
        // Kiểm tra xem sinh viên đã làm và ĐẠT bài quiz của tuần trước chưa
        const anyUnpassed = prevQuizzes.some(q => {
          const sub = q.best_submission;
          return !sub || (!sub.is_passed && Number(sub.score) < Number(q.passing_score || 5.0));
        });

        if (anyUnpassed) {
          const unpassedQuiz = prevQuizzes.find(q => {
            const sub = q.best_submission;
            return !sub || (!sub.is_passed && Number(sub.score) < Number(q.passing_score || 5.0));
          });
          isCurrentLocked = true;
          prevWeekNumber = prevMod.week_number;
          requiredQuiz = unpassedQuiz;
          lockingReason = `Bạn cần hoàn thành và đạt bài kiểm tra Quiz của Tuần ${prevMod.week_number} ("${unpassedQuiz?.title || 'Bài kiểm tra quá trình'}") trước khi mở khóa bài học này.`;
        }
      } else {
        // Nếu tuần trước không có quiz, kiểm tra xem đã học hết tài liệu của tuần trước chưa
        const prevMats = prevMod.materials || [];
        const anyIncompleteMat = prevMats.some(mat => !mat.is_completed);
        if (anyIncompleteMat && prevMats.length > 0) {
          isCurrentLocked = true;
          prevWeekNumber = prevMod.week_number;
          lockingReason = `Bạn cần hoàn thành việc nghiên cứu các bài học và tài liệu của Tuần ${prevMod.week_number} trước khi mở khóa bài học này.`;
        }
      }

      statusMap[currentMod.id] = {
        isLocked: isCurrentLocked,
        reason: lockingReason,
        requiredQuiz,
        prevWeekNumber
      };
    }

    return statusMap;
  }, [lmsData.modules]);

  // Giám sát gian lận khi làm bài Quiz (Chống chuyển Tab / Cửa sổ theo TT 08/2021)
  const handleSubmitQuizRef = useRef();
  
  // Nộp bài Quiz
  const handleSubmitQuiz = useCallback(async () => {
    if (!activeQuiz) return;
    try {
      setQuizSubmitting(true);
      const res = await academicTrainingApi.submitLmsQuiz(activeQuiz.id, {
        studentId: studentId || 1,
        sectionId,
        answers: quizAnswers
      });
      if (res.success) {
        setQuizResult(res.data);
        message.success(`Đã nộp bài thành công! Điểm số: ${res.data.finalScore10}/10.0`);
        loadLmsData();
        loadAnalytics();
      }
    } catch (err) {
      message.error('Lỗi nộp bài: ' + err.message);
    } finally {
      setQuizSubmitting(false);
    }
  }, [activeQuiz, studentId, sectionId, quizAnswers, loadLmsData, loadAnalytics]);

  handleSubmitQuizRef.current = handleSubmitQuiz;

  // Countdown timer cho bài kiểm tra
  useEffect(() => {
    let timer;
    if (isQuizModalOpen && !quizResult && quizTimeLeft > 0) {
      timer = setInterval(() => {
        setQuizTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            message.warning('Hết thời gian làm bài! Hệ thống tự động thu nộp bài làm.');
            handleSubmitQuizRef.current?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isQuizModalOpen, quizResult, quizTimeLeft]);

  // Bắt sự kiện chuyển tab trình duyệt để cảnh báo gian lận
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (isQuizModalOpen && !quizResult && document.visibilityState === 'hidden') {
        setTabSwitches(prev => {
          const nextCount = prev + 1;
          const maxAllowed = activeQuiz?.max_tab_switches || 3;
          message.error(`CẢNH BÁO GIAN LẬN: Bạn đã rời khỏi màn hình thi (${nextCount}/${maxAllowed} lần)!`);
          if (nextCount >= maxAllowed) {
            message.error('Bạn đã vi phạm quy chế chuyển tab quá số lần quy định. Hệ thống tự động khóa và nộp bài.');
            handleSubmitQuizRef.current?.();
          }
          return nextCount;
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isQuizModalOpen, quizResult, activeQuiz]);

  // Thêm/Sửa Tuần học (Giảng viên)
  const handleSaveModule = async (values) => {
    try {
      const payload = {
        ...values,
        course_id: lmsData.course?.id || 1,
        section_id: sectionId
      };
      const res = await academicTrainingApi.saveLmsModule(payload);
      if (res.success) {
        message.success('Đã lưu tuần học thành công!');
        setIsModuleModalOpen(false);
        moduleForm.resetFields();
        loadLmsData();
        notifyLmsUpdated();
      }
    } catch (err) {
      message.error('Lỗi: ' + err.message);
    }
  };

  // Thêm Tài liệu (Giảng viên & Admin)
  const handleSaveMaterial = async (values) => {
    try {
      const payload = {
        ...values,
        module_id: selectedModuleIdForMaterial
      };
      const res = await academicTrainingApi.saveLmsMaterial(payload);
      if (res && res.success) {
        message.success('Đã lưu học liệu vào đề cương tuần thành công!');
        setIsMaterialModalOpen(false);
        materialForm.resetFields();
        setUploadedFileInfo(null);
        setVideoUploadPreviewUrl('');
        loadLmsData();
        notifyLmsUpdated();
      } else {
        message.error(res?.message || 'Không thể lưu học liệu');
      }
    } catch (err) {
      message.error('Lỗi: ' + err.message);
    }
  };

  // Xử lý chọn tệp từ thiết bị và tải lên máy chủ thật
  const handleFileSelected = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setIsUploadingFile(true);
    setUploadingProgress(20);

    try {
      const res = await academicTrainingApi.uploadLmsFile(formData, (pct) => {
        setUploadingProgress(Math.max(25, pct));
      });

      if (res && res.success && res.data) {
        const { url, filename, original_name, size_mb, material_type } = res.data;
        setUploadedFileInfo(res.data);
        setUploadingProgress(100);

        const currentTitle = materialForm.getFieldValue('title');
        const cleanTitle = currentTitle || original_name.replace(/\.[^/.]+$/, '').replace(/[_\\-]/g, ' ');

        materialForm.setFieldsValue({
          title: cleanTitle,
          file_url: url,
          file_size_mb: size_mb,
          material_type: material_type || materialTypeSelected,
          external_source: 'Tệp nội bộ máy chủ (Local Storage)'
        });

        if (material_type) setMaterialTypeSelected(material_type);
        setVideoUploadPreviewUrl(url);

        message.success(`Đã tải lên tệp "${original_name}" (${size_mb} MB) thành công!`);
      } else {
        message.error(res?.message || 'Không thể tải tệp lên');
      }
    } catch (err) {
      console.error('[Upload error]', err);
      message.error('Lỗi khi tải tệp: ' + (err.message || 'Vui lòng kiểm tra lại'));
    } finally {
      setIsUploadingFile(false);
    }
  };

  // Xóa Tuần / Tài liệu
  const handleDeleteModule = async (id) => {
    try {
      const res = await academicTrainingApi.deleteLmsModule(id);
      if (res.success) {
        message.success('Đã xóa tuần học!');
        loadLmsData();
        notifyLmsUpdated();
      }
    } catch (err) { message.error('Lỗi: ' + err.message); }
  };

  const handleDeleteMaterial = async (id) => {
    try {
      const res = await academicTrainingApi.deleteLmsMaterial(id);
      if (res.success) {
        message.success('Đã xóa tài liệu!');
        loadLmsData();
        notifyLmsUpdated();
      }
    } catch (err) { message.error('Lỗi: ' + err.message); }
  };

  // ═══ QUẢN TRỊ BÀI KIỂM TRA QUIZ DÀNH CHO GIẢNG VIÊN & ADMIN ═══
  const totalQuizQuestionsScore = useMemo(() => {
    return quizQuestionsList.reduce((sum, q) => sum + (Number(q.score) || 0), 0);
  }, [quizQuestionsList]);

  // AI Quiz Generator: Gọi AI sinh bộ câu hỏi trắc nghiệm tự động
  const handleAiGenerateQuestions = async () => {
    if (!aiTopicInput.trim()) {
      message.warning('Vui lòng nhập chủ đề hoặc tiêu đề bài học để AI sinh câu hỏi!');
      return;
    }

    setIsAiGenerating(true);
    try {
      const curMod = lmsData.modules?.find(m => m.id === selectedModuleIdForQuiz);
      const res = await academicTrainingApi.aiGenerateQuizQuestions({
        title: aiTopicInput.trim(),
        chapter_or_week: curMod?.title || 'Tuần học hiện tại',
        summary_content: aiSummaryInput.trim(),
        question_count: aiQuestionCount,
        difficulty_mix: aiBloomLevel
      });

      if (res && res.success && res.data && res.data.questions) {
        const generated = res.data.questions;
        setQuizQuestionsList(generated);
        message.success(`🎉 AI đã sinh thành công bộ ${generated.length} câu hỏi trắc nghiệm chuẩn sư phạm!`);
      } else {
        message.error(res?.message || 'Không thể sinh câu hỏi bằng AI');
      }
    } catch (err) {
      console.error('[AI Quiz Gen error]', err);
      message.error('Lỗi khi gọi AI: ' + (err.message || 'Vui lòng thử lại'));
    } finally {
      setIsAiGenerating(false);
    }
  };

  // Mở modal tạo mới Quiz cho tuần học
  const handleOpenCreateQuiz = (moduleId) => {
    setSelectedModuleIdForQuiz(moduleId);
    setEditingQuizId(null);
    const curMod = lmsData.modules?.find(m => m.id === moduleId);
    const weekNum = curMod?.week_number || 1;
    
    quizEditorForm.resetFields();
    quizEditorForm.setFieldsValue({
      title: `Quiz Đánh Giá Quá Trình (Tuần ${weekNum}): ${curMod?.title ? curMod.title.replace(/^Tuần \d+:\s*/, '') : 'Kiến thức cốt lõi'}`,
      time_limit_minutes: 15,
      passing_score: 5.0,
      grade_weight: 10,
      max_attempts: 3,
      scoring_policy: 'HIGHEST',
      max_tab_switches: 3,
      shuffle_questions: true,
      shuffle_options: true
    });

    // Điền sẵn thông tin chủ đề cho AI
    setAiTopicInput(curMod?.title ? curMod.title.replace(/^Tuần \d+:\s*/, '') : 'Kiến thức trọng tâm bài học');
    setAiSummaryInput(curMod?.description || 'Khái niệm lý thuyết, cú pháp ngôn ngữ, bài tập thực hành và xử lý tình huống.');
    setAiQuestionCount(5);
    setAiBloomLevel('BLOOM_STANDARD');

    // Khởi tạo 2 câu hỏi mặc định
    setQuizQuestionsList([
      {
        question_text: `Mục tiêu chuẩn đầu ra trọng tâm của nội dung Tuần ${weekNum} là gì?`,
        score: 5.0,
        options: [
          'Nắm vững kiến thức nền tảng và vận dụng giải bài tập thực tế',
          'Chỉ học thuộc lý thuyết mà không cần thực hành',
          'Bỏ qua các bước kiểm thử ca biên',
          'Không cần biên dịch thử mã nguồn'
        ],
        correct_answer: 'A',
        explanation: 'Chuẩn đầu ra yêu cầu kết hợp giữa lý thuyết nền tảng và kỹ năng giải quyết bài toán thực tế.',
        bloom_level: 'Thông hiểu'
      },
      {
        question_text: 'Theo Thông tư 08/2021/TT-BGDĐT, sinh viên cần hoàn thành tối thiểu bao nhiêu % để đủ điều kiện thi?',
        score: 5.0,
        options: [
          'Tối thiểu 80% tiến độ bài giảng và bài tập LMS',
          'Tối thiểu 50%',
          'Không quy định tiến độ',
          'Tối thiểu 30%'
        ],
        correct_answer: 'A',
        explanation: 'Quy chế đào tạo tín chỉ đại học quy định sinh viên phải hoàn thành tối thiểu 80% thời lượng.',
        bloom_level: 'Nhận biết'
      }
    ]);
    setIsQuizEditorOpen(true);
  };

  // Mở modal sửa Quiz
  const handleOpenEditQuiz = async (quiz) => {
    setSelectedModuleIdForQuiz(quiz.module_id);
    setEditingQuizId(quiz.id);
    const curMod = lmsData.modules?.find(m => m.id === quiz.module_id);

    quizEditorForm.resetFields();
    quizEditorForm.setFieldsValue({
      title: quiz.title,
      description: quiz.description,
      time_limit_minutes: quiz.time_limit_minutes || 15,
      passing_score: quiz.passing_score || 5.0,
      grade_weight: quiz.weight || quiz.grade_weight || 10,
      max_attempts: quiz.max_attempts || 3,
      scoring_policy: quiz.scoring_policy || 'HIGHEST',
      max_tab_switches: quiz.max_tab_switches || 3,
      shuffle_questions: quiz.shuffle_questions !== false,
      shuffle_options: quiz.shuffle_options !== false
    });

    setAiTopicInput(quiz.title ? quiz.title.replace(/^(Quiz Đánh Giá Quá Trình|Bài Kiểm Tra)[^:]*:\s*/i, '') : (curMod?.title || 'Kiến thức cốt lõi'));
    setAiSummaryInput(curMod?.description || '');
    setAiQuestionCount(quiz.questions?.length || 5);

    try {
      const res = await academicTrainingApi.getLmsQuizDetail(quiz.id);
      const rawQuestions = (res.success && res.data?.questions?.length > 0) ? res.data.questions : (quiz.questions || []);
      if (rawQuestions && rawQuestions.length > 0) {
        const qs = rawQuestions.map(q => {
          let opts = [];
          if (Array.isArray(q.options) && q.options.length > 0) {
            opts = q.options.map(o => typeof o === 'string' ? o : (o.content || o.text || ''));
          } else if (Array.isArray(q.answers) && q.answers.length > 0) {
            opts = q.answers.map(a => typeof a === 'string' ? a : (a.content || a.text || ''));
          } else {
            try {
              opts = typeof q.options_json === 'string' ? JSON.parse(q.options_json) : (q.options_json || []);
            } catch (e) { opts = []; }
          }
          while (opts.length < 4) opts.push('');
          return {
            id: q.id,
            question_text: q.question_text || q.content || '',
            score: Number(q.score) || 2.5,
            options: opts,
            correct_answer: (q.correct_answer || 'A').toUpperCase(),
            explanation: q.explanation || '',
            bloom_level: q.bloom_level || 'Thông hiểu'
          };
        });
        setQuizQuestionsList(qs);
      } else {
        setQuizQuestionsList([
          { question_text: '', score: 5.0, options: ['', '', '', ''], correct_answer: 'A' },
          { question_text: '', score: 5.0, options: ['', '', '', ''], correct_answer: 'B' }
        ]);
      }
    } catch (e) {
      console.warn(e);
    }
    setIsQuizEditorOpen(true);
  };

  // Thêm câu hỏi mới vào danh sách
  const handleAddQuestion = () => {
    setQuizQuestionsList(prev => [
      ...prev,
      {
        question_text: '',
        score: 2.5,
        options: ['', '', '', ''],
        correct_answer: 'A'
      }
    ]);
  };

  // Xóa câu hỏi khỏi danh sách
  const handleRemoveQuestion = (idx) => {
    if (quizQuestionsList.length <= 1) {
      message.warning('Bài kiểm tra cần có ít nhất 1 câu hỏi!');
      return;
    }
    setQuizQuestionsList(prev => prev.filter((_, i) => i !== idx));
  };

  // Cập nhật nội dung hoặc điểm hoặc đáp án đúng
  const handleQuestionChange = (idx, field, val) => {
    setQuizQuestionsList(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: val };
      return next;
    });
  };

  // Cập nhật từng phương án A, B, C, D
  const handleOptionChange = (qIdx, optIdx, val) => {
    setQuizQuestionsList(prev => {
      const next = [...prev];
      const opts = [...next[qIdx].options];
      opts[optIdx] = val;
      next[qIdx] = { ...next[qIdx], options: opts };
      return next;
    });
  };

  // Tự động chia đều điểm cho tròn 10.0 điểm
  const handleAutoDistributeScores = () => {
    if (quizQuestionsList.length === 0) return;
    const eachScore = Number((10 / quizQuestionsList.length).toFixed(2));
    setQuizQuestionsList(prev => prev.map((q, idx) => {
      if (idx === prev.length - 1) {
        const prevSum = eachScore * (prev.length - 1);
        const lastScore = Number((10 - prevSum).toFixed(2));
        return { ...q, score: lastScore > 0 ? lastScore : eachScore };
      }
      return { ...q, score: eachScore };
    }));
    message.success(`Đã tự động chia đều điểm (${eachScore}đ/câu)!`);
  };

  // Nạp bộ câu hỏi trắc nghiệm mẫu
  const handleLoadSampleQuestions = () => {
    const courseName = lmsData.course?.name || 'Môn học';
    const samples = [
      {
        question_text: `Khái niệm cơ bản và mục tiêu trọng tâm của học phần ${courseName} là gì?`,
        score: 2.5,
        options: [
          'Trang bị hệ thống kiến thức nền tảng và kỹ năng vận dụng thực tiễn chuẩn đầu ra',
          'Chỉ cung cấp lý thuyết trừu tượng không có tính ứng dụng thực tế',
          'Không yêu cầu làm bài tập và thực hành',
          'Tất cả các phương án trên đều sai'
        ],
        correct_answer: 'A'
      },
      {
        question_text: 'Theo quy chế đào tạo đại học, sinh viên cần đạt chuẩn nào để đủ điều kiện dự thi kết thúc học phần?',
        score: 2.5,
        options: [
          'Chỉ cần đăng ký môn mà không cần tham gia bài giảng',
          'Hoàn thành tối thiểu 80% tiến độ học tập và đạt điểm quá trình từ 4.0 trở lên',
          'Chỉ cần làm bài thi cuối kỳ mà không cần điểm chuyên cần',
          'Tùy thuộc vào nguyện vọng cá nhân của sinh viên'
        ],
        correct_answer: 'B'
      },
      {
        question_text: 'Phương pháp nào sau đây giúp tối ưu hóa kết quả học tập và nghiên cứu học liệu số?',
        score: 2.5,
        options: [
          'Đọc trước giáo trình, tài liệu tham khảo và thảo luận tích cực trên diễn đàn',
          'Chỉ mở tài liệu trước ngày thi 1 ngày',
          'Không đọc đề cương chi tiết Syllabus',
          'Bỏ qua các bài kiểm tra đánh giá quá trình'
        ],
        correct_answer: 'A'
      },
      {
        question_text: 'Chuẩn đánh giá quá trình (Formative Assessment) có vai trò gì trong hệ thống tín chỉ?',
        score: 2.5,
        options: [
          'Chỉ mang tính chất hình thức không tính điểm',
          'Đo lường mức độ tiếp thu liên tục từng tuần và kịp thời hỗ trợ sinh viên',
          'Không liên quan đến điểm tổng kết môn học',
          'Không cần ghi nhận vào sổ điểm'
        ],
        correct_answer: 'B'
      }
    ];
    setQuizQuestionsList(samples);
    message.success('Đã nạp 4 câu hỏi mẫu học phần thành công!');
  };

  // Lưu Quiz và danh sách câu hỏi
  const handleSaveQuiz = async (values) => {
    if (quizQuestionsList.length === 0) {
      message.error('Vui lòng thêm ít nhất 1 câu hỏi cho bài kiểm tra!');
      return;
    }

    for (let i = 0; i < quizQuestionsList.length; i++) {
      const q = quizQuestionsList[i];
      if (!q.question_text || !q.question_text.trim()) {
        message.error(`Vui lòng nhập nội dung cho Câu ${i + 1}!`);
        return;
      }
      const emptyOpt = q.options.some(opt => !opt || !opt.trim());
      if (emptyOpt) {
        message.error(`Câu ${i + 1} chưa điền đủ 4 phương án trả lời!`);
        return;
      }
    }

    try {
      setSavingQuiz(true);
      const payload = {
        ...values,
        id: editingQuizId || undefined,
        module_id: selectedModuleIdForQuiz,
        section_id: sectionId,
        questions: quizQuestionsList.map(q => ({
          id: q.id,
          question_text: q.question_text,
          score: Number(q.score) || 2.5,
          options_json: q.options,
          options: q.options,
          correct_answer: (q.correct_answer || 'A').toUpperCase(),
          explanation: q.explanation || '',
          bloom_level: q.bloom_level || 'Thông hiểu'
        }))
      };

      const res = await academicTrainingApi.saveLmsQuiz(payload);
      if (res.success) {
        message.success(editingQuizId ? 'Cập nhật bài Quiz thành công!' : 'Tạo bài kiểm tra Quiz thành công!');
        setIsQuizEditorOpen(false);
        loadLmsData();
        loadAnalytics();
        notifyLmsUpdated();
      }
    } catch (err) {
      message.error('Lỗi lưu bài quiz: ' + err.message);
    } finally {
      setSavingQuiz(false);
    }
  };

  // Xóa Quiz
  const handleDeleteQuiz = async (quizId) => {
    try {
      const res = await academicTrainingApi.deleteLmsQuiz(quizId);
      if (res.success) {
        message.success('Đã xóa bài kiểm tra Quiz!');
        loadLmsData();
        loadAnalytics();
        notifyLmsUpdated();
      }
    } catch (err) {
      message.error('Lỗi xóa bài quiz: ' + err.message);
    }
  };

  // Đánh dấu hoàn thành bài học (Sinh viên)
  const handleToggleProgress = async (materialId, currentStatus) => {
    if (role !== 'STUDENT' || !studentId) return;
    try {
      await academicTrainingApi.markLmsProgress({
        studentId,
        materialId,
        isCompleted: !currentStatus,
        timeSpent: 900
      });
      loadLmsData();
      loadAnalytics();
    } catch (err) {
      console.warn(err);
    }
  };

  // Mở bài Quiz để làm (Sinh viên)
  const handleStartQuiz = async (quiz) => {
    try {
      // Kiểm tra khung thời gian làm bài
      const now = new Date();
      if (quiz.available_from && new Date(quiz.available_from) > now) {
        message.warning(`Bài kiểm tra chưa mở! Thời gian mở dự kiến: ${new Date(quiz.available_from).toLocaleString('vi-VN')}`);
        return;
      }
      if (quiz.available_until && new Date(quiz.available_until) < now) {
        message.error(`Bài kiểm tra đã đóng vào lúc: ${new Date(quiz.available_until).toLocaleString('vi-VN')}`);
        return;
      }

      setActiveQuiz(quiz);
      setQuizAnswers({});
      setQuizResult(null);
      setTabSwitches(0);
      setQuizTimeLeft((quiz.time_limit_minutes || 10) * 60);

      const res = await academicTrainingApi.getLmsQuizDetail(quiz.id);
      if (res.success) {
        let qs = res.data.questions || [];
        // Nếu có cờ shuffle questions thì xáo trộn
        if (quiz.shuffle_questions) {
          qs = [...qs].sort(() => Math.random() - 0.5);
        }
        setQuizQuestions(qs);
        setIsQuizModalOpen(true);
      }
    } catch (err) {
      message.error('Lỗi mở bài quiz: ' + err.message);
    }
  };

  // Đồng bộ điểm Quiz sang Sổ điểm chính (Giảng viên)
  const handleSyncGrades = async (targetType) => {
    try {
      const res = await academicTrainingApi.syncLmsQuizGrades(sectionId, {
        targetScoreType: targetType
      });
      if (res.success) {
        message.success(res.message);
        loadAnalytics();
      }
    } catch (err) {
      message.error('Lỗi đồng bộ điểm: ' + err.message);
    }
  };

  // Đăng thảo luận Diễn đàn
  const handlePostDiscussion = async () => {
    if (!discussionContent.trim()) {
      message.warning('Vui lòng nhập nội dung trao đổi!');
      return;
    }
    try {
      setSubmittingDiscussion(true);
      const authorName = role === 'LECTURER' ? lecturerName : studentName;
      const res = await academicTrainingApi.postLmsDiscussion({
        section_id: sectionId,
        author_id: role === 'LECTURER' ? 1 : (studentId || 1),
        author_type: role,
        author_name: authorName,
        title: discussionTitle || 'Thảo luận học phần',
        content: discussionContent,
        discussion_type: discussionType,
        group_name: discussionType === 'GROUP_DISCUSSION' ? (groupName || 'Nhóm chung') : null
      });
      if (res.success) {
        message.success('Đã gửi nội dung lên diễn đàn thành công!');
        setDiscussionTitle('');
        setDiscussionContent('');
        setGroupName('');
        loadDiscussions();
      }
    } catch (err) {
      message.error('Lỗi: ' + err.message);
    } finally {
      setSubmittingDiscussion(false);
    }
  };

  // Thả tim / Upvote thảo luận
  const handleUpvote = async (id) => {
    try {
      const res = await academicTrainingApi.upvoteLmsDiscussion(id);
      if (res.success) {
        message.success('Đã đồng tình / thích ý kiến này (+1)');
        loadDiscussions();
      }
    } catch (err) {
      message.error(err.message);
    }
  };

  // Đánh dấu đã giải đáp (GV hoặc SV)
  const handleToggleAnswered = async (id) => {
    try {
      const res = await academicTrainingApi.toggleLmsDiscussionAnswered(id);
      if (res.success) {
        message.success('Đã cập nhật trạng thái giải đáp');
        loadDiscussions();
      }
    } catch (err) {
      message.error(err.message);
    }
  };

  // Lọc bài thảo luận
  const filteredDiscussions = useMemo(() => {
    if (discussionFilter === 'ALL') return discussions;
    if (discussionFilter === 'QA_LECTURER') return discussions.filter(d => d.discussion_type === 'QA_LECTURER');
    if (discussionFilter === 'GROUP_DISCUSSION') return discussions.filter(d => d.discussion_type === 'GROUP_DISCUSSION');
    if (discussionFilter === 'ANSWERED') return discussions.filter(d => d.is_answered);
    return discussions;
  }, [discussions, discussionFilter]);

  // Render Category Tag cho Tài liệu
  const renderCategoryTag = (category) => {
    switch (category) {
      case 'MAIN_TEXTBOOK':
        return <Tag color="magenta">📘 Giáo trình chính bắt buộc</Tag>;
      case 'REQUIRED_REF':
        return <Tag color="geekblue">📑 Tài liệu tham khảo bắt buộc</Tag>;
      case 'SUPPLEMENTAL':
        return <Tag color="cyan">🌐 Đọc thêm (Scopus/IEEE/Digital Lib)</Tag>;
      case 'SOURCE_CODE':
        return <Tag color="volcano">💻 Mã nguồn / GitHub Repo</Tag>;
      case 'LECTURE_SLIDE':
        return <Tag color="orange">📊 Slide bài giảng</Tag>;
      default:
        return <Tag color="blue">📄 Tài liệu học tập</Tag>;
    }
  };

  // Render Scoring Policy Tag
  const renderPolicyTag = (policy) => {
    switch (policy) {
      case 'HIGHEST': return <Tag color="green">Lấy điểm cao nhất</Tag>;
      case 'AVERAGE': return <Tag color="blue">Lấy điểm trung bình</Tag>;
      case 'LATEST': return <Tag color="orange">Lấy điểm lần cuối</Tag>;
      default: return <Tag color="default">Mặc định</Tag>;
    }
  };

  // Helper render icon cho Universal Content Viewer
  const renderViewerIcon = () => {
    const m = activeViewerMaterial || {};
    const titleLower = (m.title || '').toLowerCase();
    const urlLower = (m.file_url || '').toLowerCase();
    const isVideo = m.material_type === 'VIDEO' || urlLower.includes('youtube') || urlLower.includes('.mp4') || titleLower.includes('video') || !!activeVideoUrl;
    const isSlide = m.material_type === 'SLIDE' || m.category === 'LECTURE_SLIDE' || urlLower.includes('.ppt') || titleLower.includes('slide');
    const isWord = m.material_type === 'WORD' || urlLower.includes('.doc') || titleLower.includes('word') || titleLower.includes('đề cương') || titleLower.includes('kế hoạch');
    const isPdf = m.material_type === 'PDF' || (m.material_type === 'DOCUMENT' && !isWord) || urlLower.includes('.pdf');
    const isCode = m.material_type === 'CODE' || m.category === 'SOURCE_CODE' || urlLower.includes('.cpp') || urlLower.includes('.java') || urlLower.includes('.py') || urlLower.includes('github') || titleLower.includes('code');

    if (isVideo) return <VideoCameraOutlined style={{ fontSize: 22, color: '#ef4444' }} />;
    if (isSlide) return <FilePptOutlined style={{ fontSize: 22, color: '#d97706' }} />;
    if (isWord) return <FileWordOutlined style={{ fontSize: 22, color: '#1d4ed8' }} />;
    if (isPdf) return <FilePdfOutlined style={{ fontSize: 22, color: '#b91c1c' }} />;
    if (isCode) return <CodeOutlined style={{ fontSize: 22, color: '#ea580c' }} />;
    return <BookOutlined style={{ fontSize: 22, color: '#2563eb' }} />;
  };

  // Helper render xem trước video trong Modal 5 của Giảng viên
  const renderVideoUploadPreview = () => {
    const previewUrl = videoUploadPreviewUrl || materialForm.getFieldValue('file_url') || '';
    const urlLower = previewUrl.toLowerCase();
    const isYouTube = urlLower.includes('youtube') || urlLower.includes('youtu.be');

    if (isYouTube) {
      let ytEmbed = 'https://www.youtube.com/embed/dQw4w9WgXcQ';
      if (previewUrl.includes('watch?v=')) {
        ytEmbed = `https://www.youtube.com/embed/${previewUrl.split('watch?v=')[1]?.split('&')[0]}`;
      } else if (previewUrl.includes('youtu.be/')) {
        ytEmbed = `https://www.youtube.com/embed/${previewUrl.split('youtu.be/')[1]?.split('?')[0]}`;
      }
      return (
        <div style={{ background: '#000', borderRadius: 8, overflow: 'hidden', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
          <iframe
            width="100%"
            height="230"
            src={ytEmbed}
            title="Xem trước video bài giảng"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ display: 'block' }}
          />
        </div>
      );
    }

    if (previewUrl) {
      return (
        <div style={{ background: '#0f172a', borderRadius: 8, padding: 16, textAlign: 'center', color: '#fff' }}>
          <video
            src={previewUrl}
            controls
            style={{ width: '100%', maxHeight: 230, borderRadius: 6, background: '#000' }}
          >
            Trình duyệt không hỗ trợ thẻ video HTML5.
          </video>
          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 6 }}>
            Đang xem trước từ nguồn: <strong>{previewUrl}</strong>
          </div>
        </div>
      );
    }

    return (
      <div
        style={{
          height: 140,
          background: '#1e293b',
          borderRadius: 8,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#94a3b8',
          border: '1px dashed #475569'
        }}
      >
        <VideoCameraOutlined style={{ fontSize: 32, color: '#ef4444', marginBottom: 8 }} />
        <Text style={{ color: '#cbd5e1', fontSize: 13 }}>
          🎬 Chưa có video. Dán liên kết YouTube hoặc bấm nút chèn video ở trên để xem trước tại đây.
        </Text>
        <Text style={{ color: '#64748b', fontSize: 11, marginTop: 4 }}>
          Hỗ trợ định dạng: YouTube, MP4, WebM, HLS Stream
        </Text>
      </div>
    );
  };

  const renderContentViewerBody = () => {
          const m = activeViewerMaterial || { title: 'Bài Giảng Đa Phương Tiện', file_url: activeVideoUrl };
          const titleLower = (m.title || '').toLowerCase();
          const urlLower = (m.file_url || '').toLowerCase();
          const isVideo = m.material_type === 'VIDEO' || urlLower.includes('youtube') || urlLower.includes('.mp4') || titleLower.includes('video') || !!activeVideoUrl;
          const isSlide = m.material_type === 'SLIDE' || m.category === 'LECTURE_SLIDE' || urlLower.includes('.ppt') || titleLower.includes('slide');
          const isWord = m.material_type === 'WORD' || urlLower.includes('.doc') || titleLower.includes('word') || titleLower.includes('đề cương') || titleLower.includes('kế hoạch');
          const isCode = m.material_type === 'CODE' || m.category === 'SOURCE_CODE' || urlLower.includes('.cpp') || urlLower.includes('.java') || urlLower.includes('.py') || urlLower.includes('github') || titleLower.includes('code');
          // Mặc định là PDF nếu không rơi vào các trường hợp trên
          const isPdf = !isVideo && !isSlide && !isWord && !isCode;

          // ==================== 1. CHẾ ĐỘ VIDEO BÀI GIẢNG ====================
          if (isVideo) {
            const isYouTube = urlLower.includes('youtube') || urlLower.includes('youtu.be');
            let ytEmbedUrl = 'https://www.youtube.com/embed/dQw4w9WgXcQ';
            if (isYouTube && m.file_url) {
              if (m.file_url.includes('watch?v=')) {
                ytEmbedUrl = `https://www.youtube.com/embed/${m.file_url.split('watch?v=')[1]?.split('&')[0]}`;
              } else if (m.file_url.includes('youtu.be/')) {
                ytEmbedUrl = `https://www.youtube.com/embed/${m.file_url.split('youtu.be/')[1]?.split('?')[0]}`;
              } else if (m.file_url.includes('/embed/')) {
                ytEmbedUrl = m.file_url;
              }
            }

            return (
              <div>
                {isYouTube ? (
                  <div style={{ background: '#000', borderRadius: 8, overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
                    <iframe
                      width="100%"
                      height={isViewerFullscreen ? 580 : 440}
                      src={`${ytEmbedUrl}?autoplay=1&rel=0`}
                      title={m.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ display: 'block' }}
                    />
                    {/* THANH TIẾN ĐỘ THEO DÕI VIDEO BÀI GIẢNG CHO SINH VIÊN */}
                    <div style={{ padding: '12px 18px', background: '#0b1120', borderTop: '1px solid #1e293b' }}>
                      <Row justify="space-between" align="middle">
                        <Col span={14}>
                          <Space direction="vertical" size={2} style={{ width: '100%' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                              <span style={{ color: '#cbd5e1' }}>⏱️ Tiến độ theo dõi bài giảng: <strong>{videoProgressPercent}%</strong></span>
                              <span style={{ color: videoProgressPercent >= 80 ? '#4ade80' : '#f59e0b' }}>
                                {videoProgressPercent >= 80 ? '✓ Đạt chuẩn chuyên cần video (≥80%)' : 'Yêu cầu tối thiểu: 80%'}
                              </span>
                            </div>
                            <Progress
                              percent={videoProgressPercent}
                              size="small"
                              strokeColor={videoProgressPercent >= 80 ? '#22c55e' : '#ef4444'}
                            />
                          </Space>
                        </Col>
                        <Col span={9} style={{ textAlign: 'right' }}>
                          <Space>
                            <Button
                              size="small"
                              type="text"
                              style={{ color: '#cbd5e1' }}
                              onClick={() => {
                                const nextPct = Math.min(100, videoProgressPercent + 20);
                                setVideoProgressPercent(nextPct);
                                if (nextPct >= 80 && role === 'STUDENT' && m.id && !m.is_completed) {
                                  handleToggleProgress(m.id, false);
                                  message.success('🎉 Bạn đã theo dõi đạt 80% bài giảng! Điểm chuyên cần đã tự động cập nhật.');
                                }
                              }}
                            >
                              +20% Đã Xem
                            </Button>
                            <Button
                              size="small"
                              type="primary"
                              style={{ background: '#16a34a', borderColor: '#16a34a' }}
                              onClick={() => {
                                setVideoProgressPercent(100);
                                if (role === 'STUDENT' && m.id && !m.is_completed) {
                                  handleToggleProgress(m.id, false);
                                  message.success('🎉 Bạn đã hoàn thành 100% video bài giảng! Điểm chuyên cần đã ghi nhận.');
                                }
                              }}
                            >
                              ✓ Xem Hết (100%)
                            </Button>
                          </Space>
                        </Col>
                      </Row>
                    </div>
                  </div>
                ) : (
                  // TCU University Lecture Theater Video Player
                  <div style={{ background: '#090d16', borderRadius: 12, overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.3)', border: '1px solid #1e293b' }}>
                    {/* Màn hình phát video */}
                    <div style={{ position: 'relative', height: isViewerFullscreen ? 540 : 380, background: 'linear-gradient(135deg, #020617 0%, #0f172a 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#fff' }}>
                      <div style={{ position: 'absolute', top: 16, left: 20, zIndex: 2 }}>
                        <Tag color="error">🔴 TCU E-LEARNING LECTURE THEATER</Tag>
                        <Tag color="blue">{lmsData.course?.name || 'Môn học'}</Tag>
                      </div>
                      <div style={{ position: 'absolute', top: 16, right: 20, zIndex: 2, color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>
                        Chất lượng: <strong>1080p FHD 60fps</strong> • Âm thanh: <strong>Stereo Dolby</strong>
                      </div>

                      {/* Nút Play trung tâm */}
                      <div
                        style={{
                          width: 80,
                          height: 80,
                          borderRadius: '50%',
                          background: isVideoPlaying ? 'rgba(239, 68, 68, 0.9)' : 'rgba(255, 255, 255, 0.25)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          boxShadow: '0 0 30px rgba(239, 68, 68, 0.6)'
                        }}
                        onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                      >
                        {isVideoPlaying ? (
                          <span style={{ fontSize: 32, color: '#fff' }}>❚❚</span>
                        ) : (
                          <PlayCircleOutlined style={{ fontSize: 44, color: '#fff', marginLeft: 4 }} />
                        )}
                      </div>
                      <div style={{ marginTop: 20, textAlign: 'center' }}>
                        <Title level={4} style={{ color: '#fff', margin: 0 }}>{m.title}</Title>
                        <Text style={{ color: '#94a3b8', fontSize: 13 }}>
                          Giảng viên phụ trách: {lecturerName} • Thời lượng: {m.duration_mins || 45} phút
                        </Text>
                      </div>

                      {/* Ghi chú đang phát */}
                      <div style={{ position: 'absolute', bottom: 16, left: 20, right: 20, display: 'flex', justifyContent: 'space-between', color: '#cbd5e1', fontSize: 12 }}>
                        <span>⏱️ Đang phát: {Math.round(((m.duration_mins || 45) * 60 * videoProgressPercent) / 100 / 60)}:00 / {m.duration_mins || 45}:00</span>
                        <span>Tiến độ: <strong>{videoProgressPercent}%</strong> {videoProgressPercent >= 80 && '(Đạt chuyên cần)'}</span>
                      </div>
                    </div>

                    {/* Thanh Seek Bar */}
                    <div
                      style={{ background: '#1e293b', height: 8, cursor: 'pointer', position: 'relative' }}
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const clickX = e.clientX - rect.left;
                        const pct = Math.max(0, Math.min(100, Math.round((clickX / rect.width) * 100)));
                        setVideoProgressPercent(pct);
                        if (pct >= 80 && role === 'STUDENT' && m.id && !m.is_completed) {
                          handleToggleProgress(m.id, false);
                          message.success('🎉 Bạn đã xem đạt 80% bài giảng! Điểm chuyên cần đã tự động cập nhật.');
                        }
                      }}
                    >
                      <div style={{ background: videoProgressPercent >= 80 ? '#22c55e' : '#ef4444', height: '100%', width: `${videoProgressPercent}%`, transition: 'width 0.2s' }} />
                    </div>

                    {/* Thanh điều khiển video */}
                    <div style={{ padding: '12px 20px', background: '#0b1120', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Space size="middle">
                        <Button
                          type="text"
                          style={{ color: '#fff' }}
                          icon={isVideoPlaying ? <span style={{ fontSize: 16 }}>❚❚</span> : <PlayCircleOutlined style={{ fontSize: 18 }} />}
                          onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                        />
                        <Button
                          type="text"
                          style={{ color: '#cbd5e1' }}
                          icon={<ForwardOutlined />}
                          onClick={() => {
                            const nextPct = Math.min(100, videoProgressPercent + 10);
                            setVideoProgressPercent(nextPct);
                            if (nextPct >= 80 && role === 'STUDENT' && m.id && !m.is_completed) {
                              handleToggleProgress(m.id, false);
                              message.success('🎉 Bạn đã xem đạt 80% bài giảng! Điểm chuyên cần đã tự động cập nhật.');
                            }
                          }}
                        >
                          +10s
                        </Button>
                        <Button
                          type="text"
                          style={{ color: '#cbd5e1' }}
                          icon={<SoundOutlined />}
                          onClick={() => message.info('Âm lượng: 100%')}
                        />
                        <Text style={{ color: '#94a3b8', fontSize: 12 }}>
                          {Math.round(((m.duration_mins || 45) * 60 * videoProgressPercent) / 100 / 60)} phút / {m.duration_mins || 45} phút ({videoProgressPercent}%)
                        </Text>
                      </Space>

                      <Space>
                        <Text style={{ color: '#cbd5e1', fontSize: 12 }}>Tốc độ:</Text>
                        <Select
                          size="small"
                          value={videoPlaybackSpeed}
                          onChange={v => setVideoPlaybackSpeed(v)}
                          style={{ width: 85 }}
                          dropdownStyle={{ zIndex: 2000 }}
                        >
                          <Option value={0.75}>0.75x</Option>
                          <Option value={1.0}>1.0x Chuẩn</Option>
                          <Option value={1.25}>1.25x</Option>
                          <Option value={1.5}>1.5x Nhanh</Option>
                          <Option value={2.0}>2.0x Siêu tốc</Option>
                        </Select>
                      </Space>
                    </div>
                  </div>
                )}

                {/* Tabs thông tin bổ trợ video bài giảng */}
                <div style={{ marginTop: 16, background: '#fff', padding: 16, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                  <Tabs defaultActiveKey="notes">
                    <Tabs.TabPane tab="📝 Đề Cương & Ghi Chú Bài Giảng" key="notes">
                      <Paragraph>
                        <strong>Nội dung trọng tâm buổi học:</strong>
                        <br />
                        {m.content_text || 'Học viên cần theo dõi kỹ từ phút 10:00 đến 35:00 để nắm vững phương pháp triển khai thực tế và chuẩn bị cho bài kiểm tra đánh giá quá trình.'}
                      </Paragraph>
                      <Divider style={{ margin: '12px 0' }} />
                      <Row gutter={16}>
                        <Col span={8}>
                          <Card size="small" style={{ background: '#f8fafc', borderRadius: 6 }}>
                            <Text strong style={{ color: '#ef4444' }}>00:00 - 08:30</Text>
                            <div>Giới thiệu bối cảnh & Mục tiêu bài học</div>
                          </Card>
                        </Col>
                        <Col span={8}>
                          <Card size="small" style={{ background: '#f8fafc', borderRadius: 6 }}>
                            <Text strong style={{ color: '#2563eb' }}>08:31 - 28:45</Text>
                            <div>Phân tích lý thuyết chuyên sâu & Case Study</div>
                          </Card>
                        </Col>
                        <Col span={8}>
                          <Card size="small" style={{ background: '#f8fafc', borderRadius: 6 }}>
                            <Text strong style={{ color: '#16a34a' }}>28:46 - Kết thúc</Text>
                            <div>Thực hành ứng dụng & Giao nhiệm vụ tự học</div>
                          </Card>
                        </Col>
                      </Row>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="❓ Câu Hỏi Ôn Tập Nhanh" key="quick_qa">
                      <Alert
                        type="info"
                        showIcon
                        message="Câu hỏi tương tác theo dõi video"
                        description="Sau khi xem xong video, hãy truy cập mục 'Bài Kiểm Tra Đánh Giá Quá Trình (Quiz)' để thực hiện bài trắc nghiệm tính điểm tích lũy học phần."
                      />
                    </Tabs.TabPane>
                  </Tabs>
                </div>
              </div>
            );
          }

          // ==================== 2. CHẾ ĐỘ SLIDE TRÌNH CHIẾU ====================
          if (isSlide) {
            const totalSlides = 8;
            const slideContents = [
              {
                slideNum: 1,
                title: m.title,
                sub: `Học phần: ${lmsData.course?.name || 'Môn học'} • Mã lớp: ${lmsData.section?.section_code || ''}`,
                bullets: [
                  `Giảng viên biên soạn & giảng dạy: ${lecturerName}`,
                  'Hệ thống E-Learning chuẩn Thông tư 08/2021/TT-BGDĐT',
                  'Khoa Công nghệ Thông tin - Trường Đại học TCU',
                  'Mục tiêu học phần: Nắm vững kiến thức nền tảng và năng lực vận dụng thực tiễn'
                ],
                footerTag: 'BÀI GIẢNG ĐIỆN TỬ CHÍNH THỨC'
              },
              {
                slideNum: 2,
                title: 'Mục Tiêu & Chuẩn Đầu Ra Học Phần (CLO / PLO)',
                sub: 'Định vị năng lực người học sau khi hoàn thành bài học',
                bullets: [
                  'CLO1: Hiểu và giải thích được các khái niệm, kiến trúc và nguyên lý vận hành cốt lõi.',
                  'CLO2: Vận dụng các công cụ, phương pháp và mô hình thực hành vào bài toán cụ thể.',
                  'CLO3: Phát triển kỹ năng tư duy phản biện, làm việc nhóm và giải quyết vấn đề kỹ thuật.',
                  'Đánh giá kết quả thông qua bài tập quá trình (Quiz) và đồ án thực tế.'
                ],
                footerTag: 'CHUẨN ĐẦU RA AUN-QA'
              },
              {
                slideNum: 3,
                title: 'Nền Tảng Lý Thuyết Cốt Lõi',
                sub: 'Hệ thống hóa kiến thức trọng tâm',
                bullets: [
                  'Bản chất và định nghĩa khoa học của các thành phần trong hệ thống.',
                  'Mối liên hệ giữa mô hình lý thuyết và kiến trúc hệ thống hiện đại.',
                  'Các tiêu chuẩn kỹ thuật quốc tế (IEEE / ISO / W3C) liên quan.',
                  'Phân tích ưu điểm và hạn chế của từng phương pháp tiếp cận.'
                ],
                footerTag: 'KIẾN THỨC NỀN TẢNG'
              },
              {
                slideNum: 4,
                title: 'Kiến Trúc & Quy Trình Vận Hành',
                sub: 'Sơ đồ khối và luồng xử lý dữ liệu chi tiết',
                bullets: [
                  'Bước 1: Tiếp nhận yêu cầu nghiệp vụ và cấu trúc dữ liệu đầu vào.',
                  'Bước 2: Xử lý logic nghiệp vụ, tính toán và chuyển đổi trạng thái.',
                  'Bước 3: Tối ưu hóa hiệu năng, lưu trữ an toàn và quản lý phiên làm việc.',
                  'Bước 4: Trả về kết quả xác thực và đồng bộ dữ liệu thời gian thực.'
                ],
                footerTag: 'QUY TRÌNH HỆ THỐNG'
              },
              {
                slideNum: 5,
                title: 'Nghiên Cứu Tình Huống Thực Tế (Case Study)',
                sub: 'Áp dụng vào hệ thống quản lý tại các doanh nghiệp và trường học lớn',
                bullets: [
                  'Bài toán thực tế: Xử lý tải cao đồng thời và đảm bảo tính toàn vẹn dữ liệu.',
                  'Giải pháp thiết kế: Kiến trúc mô-đun hóa, bộ nhớ đệm và phân quyền nhiều lớp.',
                  'Kết quả đạt được: Độ trễ phản hồi giảm 60%, độ tin cậy đạt chuẩn 99.9%.',
                  'Bài học kinh nghiệm: Tầm quan trọng của việc chuẩn hóa dữ liệu từ ban đầu.'
                ],
                footerTag: 'VÍ DỤ THỰC TIỄN'
              },
              {
                slideNum: 6,
                title: 'Lỗi Thường Gặp & Phương Pháp Gỡ Lỗi (Troubleshooting)',
                sub: 'Hướng dẫn tự khắc phục sự cố trong quá trình học và làm bài tập',
                bullets: [
                  'Lỗi xung đột kiểu dữ liệu và sai lệch tham số đầu vào.',
                  'Lỗi không đồng bộ trạng thái khi thực hiện nhiều giao dịch song song.',
                  'Quy trình debug chuẩn: Kiểm tra log hệ thống, cô lập nguyên nhân và chạy test case.',
                  'Khuyến nghị: Luôn viết tài liệu chú thích code và kiểm thử trước khi nộp.'
                ],
                footerTag: 'KỸ NĂNG DEBUG'
              },
              {
                slideNum: 7,
                title: 'Bài Tập Vận Dụng & Yêu Cầu Thực Hành',
                sub: 'Nhiệm vụ bắt buộc học viên cần hoàn thành trong tuần',
                bullets: [
                  'Nhiệm vụ 1: Đọc lại các phần tài liệu tham khảo được chỉ định trong đề cương.',
                  'Nhiệm vụ 2: Hoàn thành bài trắc nghiệm đánh giá quá trình (Quiz 10 điểm).',
                  'Nhiệm vụ 3: Tham gia thảo luận trên diễn đàn lớp học với ít nhất 1 câu hỏi/ý kiến.',
                  'Thời hạn nộp bài: Trước buổi học trực tiếp của tuần kế tiếp.'
                ],
                footerTag: 'NHIỆM VỤ HỌC TẬP'
              },
              {
                slideNum: 8,
                title: 'Tổng Kết Học Phần & Tài Liệu Nghiên Cứu Tiếp Theo',
                sub: 'Khép lại bài giảng và chuẩn bị cho chủ đề tuần sau',
                bullets: [
                  'Tóm tắt 3 thông điệp quan trọng nhất của bài học hôm nay.',
                  'Xem trước giáo trình chương tiếp theo tại mục Tài liệu E-Learning.',
                  'Liên hệ giải đáp: Đặt câu hỏi tại Diễn đàn hoặc qua email giảng viên.',
                  'Chúc các bạn học viên học tập hiệu quả và đạt kết quả xuất sắc!'
                ],
                footerTag: 'KẾT THÚC BÀI HỌC'
              }
            ];

            const curSlide = slideContents[currentSlidePage - 1] || slideContents[0];

            return (
              <div>
                {/* Khung chiếu Slide 16:9 */}
                <div
                  style={{
                    width: '100%',
                    aspectRatio: '16 / 9',
                    background: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)',
                    borderRadius: 12,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                    color: '#fff',
                    padding: isViewerFullscreen ? '48px 64px' : '32px 40px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    border: '1px solid #312e81'
                  }}
                >
                  {/* Header Slide */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: 12 }}>
                    <Space>
                      <Tag color="cyan" style={{ fontSize: 13, padding: '2px 10px' }}>TCU UNIVERSITY</Tag>
                      <span style={{ fontSize: 13, color: '#93c5fd' }}>{lmsData.course?.name || 'Môn học'}</span>
                    </Space>
                    <Tag color="gold">{curSlide.footerTag}</Tag>
                  </div>

                  {/* Body Slide */}
                  <div style={{ margin: 'auto 0' }}>
                    <Title level={isViewerFullscreen ? 1 : 2} style={{ color: '#f8fafc', margin: '0 0 8px 0' }}>
                      {curSlide.title}
                    </Title>
                    <Text style={{ color: '#94a3b8', fontSize: isViewerFullscreen ? 18 : 14, display: 'block', marginBottom: 24 }}>
                      {curSlide.sub}
                    </Text>

                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: isViewerFullscreen ? '24px 32px' : '16px 24px', borderRadius: 8, borderLeft: '4px solid #38bdf8' }}>
                      {curSlide.bullets.map((b, idx) => (
                        <div key={idx} style={{ fontSize: isViewerFullscreen ? 16 : 14, marginBottom: 10, display: 'flex', alignItems: 'flex-start' }}>
                          <span style={{ color: '#38bdf8', marginRight: 10, fontSize: 18 }}>•</span>
                          <span style={{ color: '#e2e8f0', lineHeight: 1.6 }}>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer Slide */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: 10, fontSize: 12, color: '#64748b' }}>
                    <span>Giảng viên: {lecturerName} • ĐHQG / TCU E-Learning LMS</span>
                    <span style={{ fontWeight: 'bold', color: '#93c5fd' }}>Trang {currentSlidePage} / {totalSlides}</span>
                  </div>
                </div>

                {/* Thanh điều khiển Slide */}
                <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '10px 20px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                  <Space>
                    <Button
                      icon={<LeftOutlined />}
                      disabled={currentSlidePage <= 1}
                      onClick={() => setCurrentSlidePage(p => Math.max(1, p - 1))}
                    >
                      Trang Trước
                    </Button>
                    <Button
                      type="primary"
                      icon={<RightOutlined />}
                      disabled={currentSlidePage >= totalSlides}
                      onClick={() => setCurrentSlidePage(p => Math.min(totalSlides, p + 1))}
                    >
                      Trang Sau
                    </Button>
                    <span style={{ marginLeft: 10, fontWeight: 600 }}>
                      Trang {currentSlidePage} / {totalSlides}
                    </span>
                  </Space>

                  {/* Nhảy nhanh trang */}
                  <Space>
                    <Text type="secondary" style={{ fontSize: 12 }}>Nhảy trang:</Text>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(p => (
                      <Button
                        key={p}
                        size="small"
                        type={currentSlidePage === p ? 'primary' : 'default'}
                        onClick={() => setCurrentSlidePage(p)}
                        style={{ minWidth: 28 }}
                      >
                        {p}
                      </Button>
                    ))}
                  </Space>
                </div>

                {/* Dải Thumbnail bên dưới */}
                <div style={{ marginTop: 12, display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 6 }}>
                  {slideContents.map((sc, idx) => (
                    <div
                      key={idx}
                      onClick={() => setCurrentSlidePage(idx + 1)}
                      style={{
                        minWidth: 110,
                        height: 65,
                        background: currentSlidePage === idx + 1 ? '#1e1b4b' : '#334155',
                        borderRadius: 6,
                        cursor: 'pointer',
                        padding: 6,
                        border: currentSlidePage === idx + 1 ? '2px solid #38bdf8' : '1px solid #475569',
                        color: '#fff',
                        fontSize: 10,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 600 }}>
                        {sc.title}
                      </div>
                      <div style={{ textAlign: 'right', color: '#94a3b8' }}>#{idx + 1}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          // ==================== 3. CHẾ ĐỘ VĂN BẢN WORD (.DOCX) ====================
          if (isWord) {
            return (
              <div>
                {/* Toolbar Word */}
                <div style={{ marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '10px 18px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                  <Space>
                    <FileWordOutlined style={{ fontSize: 20, color: '#1d4ed8' }} />
                    <span style={{ fontWeight: 600, color: '#1e3a8a' }}>TRÌNH ĐỌC VĂN BẢN WORD CHUẨN NGHỊ ĐỊNH 30/2020/NĐ-CP</span>
                    <Tag color="blue">Khổ A4 Căn Chuẩn</Tag>
                  </Space>
                  <Space>
                    <Text type="secondary" style={{ fontSize: 12 }}>Cỡ chữ:</Text>
                    <Button size="small" onClick={() => setFontSizeOffset(o => Math.max(-3, o - 1))}>A-</Button>
                    <Button size="small" onClick={() => setFontSizeOffset(0)}>Mặc định</Button>
                    <Button size="small" onClick={() => setFontSizeOffset(o => Math.min(6, o + 1))}>A+</Button>
                    <Button size="small" icon={<PrinterOutlined />} onClick={() => window.print()}>In văn bản</Button>
                  </Space>
                </div>

                {/* Khổ giấy A4 Word */}
                <div
                  style={{
                    background: '#ffffff',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    borderRadius: 4,
                    padding: '48px 60px',
                    fontFamily: '"Times New Roman", Times, serif',
                    fontSize: 14 + fontSizeOffset,
                    lineHeight: 1.6,
                    color: '#111827',
                    maxWidth: 820,
                    margin: '0 auto',
                    border: '1px solid #e5e7eb'
                  }}
                >
                  {/* Quốc hiệu & Tiêu ngữ */}
                  <Row justify="space-between" align="top" style={{ marginBottom: 28 }}>
                    <Col span={11} style={{ textAlign: 'center' }}>
                      <div style={{ fontWeight: 'bold', fontSize: 13 + fontSizeOffset }}>TRƯỜNG ĐẠI HỌC CÔNG NGHỆ TCU</div>
                      <div style={{ fontWeight: 'bold', fontSize: 13 + fontSizeOffset }}>KHOA CÔNG NGHỆ THÔNG TIN</div>
                      <div style={{ width: 80, height: 1, background: '#000', margin: '4px auto' }} />
                      <div style={{ fontSize: 12 + fontSizeOffset, fontStyle: 'italic', marginTop: 4 }}>
                        Số: 2026/ĐC-{lmsData.section?.section_code || 'HP'}
                      </div>
                    </Col>
                    <Col span={13} style={{ textAlign: 'center' }}>
                      <div style={{ fontWeight: 'bold', fontSize: 13 + fontSizeOffset }}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                      <div style={{ fontWeight: 'bold', fontSize: 13 + fontSizeOffset }}>Độc lập - Tự do - Hạnh phúc</div>
                      <div style={{ width: 140, height: 1, background: '#000', margin: '4px auto' }} />
                      <div style={{ fontSize: 12 + fontSizeOffset, fontStyle: 'italic', marginTop: 4 }}>
                        Hà Nội, ngày 15 tháng 01 năm 2026
                      </div>
                    </Col>
                  </Row>

                  {/* Tiêu đề văn bản */}
                  <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <div style={{ fontWeight: 'bold', fontSize: 18 + fontSizeOffset, textTransform: 'uppercase', color: '#1e3a8a' }}>
                      {m.title}
                    </div>
                    <div style={{ fontStyle: 'italic', fontSize: 13 + fontSizeOffset, color: '#4b5563', marginTop: 4 }}>
                      (Ban hành kèm theo Quyết định chuẩn chương trình đào tạo tín chỉ trình độ Đại học)
                    </div>
                  </div>

                  {/* Nội dung chi tiết */}
                  <div style={{ textAlign: 'justify' }}>
                    <div style={{ fontWeight: 'bold', fontSize: 15 + fontSizeOffset, marginBottom: 8, color: '#1e40af' }}>
                      I. THÔNG TIN CHUNG HỌC PHẦN
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 16 }}>
                      <tbody>
                        <tr>
                          <td style={{ border: '1px solid #cbd5e1', padding: '6px 12px', width: '30%', fontWeight: 'bold' }}>Tên học phần:</td>
                          <td style={{ border: '1px solid #cbd5e1', padding: '6px 12px' }}>{lmsData.course?.name || 'Học phần chuyên ngành'}</td>
                        </tr>
                        <tr>
                          <td style={{ border: '1px solid #cbd5e1', padding: '6px 12px', fontWeight: 'bold' }}>Mã lớp học phần:</td>
                          <td style={{ border: '1px solid #cbd5e1', padding: '6px 12px' }}>{lmsData.section?.section_code || 'IT65-01'}</td>
                        </tr>
                        <tr>
                          <td style={{ border: '1px solid #cbd5e1', padding: '6px 12px', fontWeight: 'bold' }}>Giảng viên phụ trách:</td>
                          <td style={{ border: '1px solid #cbd5e1', padding: '6px 12px' }}>{lecturerName}</td>
                        </tr>
                        <tr>
                          <td style={{ border: '1px solid #cbd5e1', padding: '6px 12px', fontWeight: 'bold' }}>Số tín chỉ:</td>
                          <td style={{ border: '1px solid #cbd5e1', padding: '6px 12px' }}>{lmsData.course?.credits || 3} Tín chỉ (Lý thuyết + Thực hành)</td>
                        </tr>
                      </tbody>
                    </table>

                    <div style={{ fontWeight: 'bold', fontSize: 15 + fontSizeOffset, marginBottom: 8, color: '#1e40af' }}>
                      II. MỤC TIÊU VÀ NỘI DUNG CHI TIẾT
                    </div>
                    <p style={{ textIndent: 28, marginBottom: 12 }}>
                      {m.content_text || 'Học phần trang bị cho sinh viên khối kiến thức toàn diện về nguyên lý, thuật toán, mô hình dữ liệu và các công cụ thực hành chuyên sâu. Sinh viên sau khi hoàn thành khóa học có khả năng độc lập nghiên cứu, phân tích thiết kế hệ thống và làm việc nhóm hiệu quả theo quy định chuẩn kiểm định chất lượng đào tạo đại học.'}
                    </p>

                    <div style={{ fontWeight: 'bold', fontSize: 15 + fontSizeOffset, marginBottom: 8, color: '#1e40af' }}>
                      III. QUY CHẾ ĐÁNH GIÁ KẾT QUẢ HỌC TẬP (TT 08/2021/TT-BGDĐT)
                    </div>
                    <p style={{ textIndent: 28, marginBottom: 8 }}>
                      1. Điểm chuyên cần và tự học trên hệ thống E-Learning: chiếm <strong>10%</strong> tổng điểm học phần.
                    </p>
                    <p style={{ textIndent: 28, marginBottom: 8 }}>
                      2. Điểm kiểm tra đánh giá quá trình (các bài trắc nghiệm Quiz từng tuần): chiếm <strong>30%</strong> tổng điểm học phần.
                    </p>
                    <p style={{ textIndent: 28, marginBottom: 16 }}>
                      3. Điểm thi kết thúc học phần: chiếm <strong>60%</strong> tổng điểm học phần.
                    </p>

                    {/* Chữ ký phê duyệt */}
                    <Row justify="space-between" style={{ marginTop: 40 }}>
                      <Col span={10} style={{ textAlign: 'center' }}>
                        <div style={{ fontWeight: 'bold' }}>TRƯỞNG BỘ MÔN</div>
                        <div style={{ fontStyle: 'italic', fontSize: 12 + fontSizeOffset }}>(Ký và ghi rõ họ tên)</div>
                        <div style={{ height: 60 }} />
                        <div style={{ fontWeight: 'bold' }}>PGS. TS. Nguyễn Văn A</div>
                      </Col>
                      <Col span={10} style={{ textAlign: 'center' }}>
                        <div style={{ fontWeight: 'bold' }}>GIẢNG VIÊN PHỤ TRÁCH</div>
                        <div style={{ fontStyle: 'italic', fontSize: 12 + fontSizeOffset }}>(Ký và ghi rõ họ tên)</div>
                        <div style={{ height: 60 }} />
                        <div style={{ fontWeight: 'bold' }}>{lecturerName}</div>
                      </Col>
                    </Row>
                  </div>
                </div>
              </div>
            );
          }

          // ==================== 4. CHẾ ĐỘ MÃ NGUỒN THỰC HÀNH (CODE) ====================
          if (isCode) {
            const sampleCode = `#include <iostream>
#include <vector>
#include <string>
#include <algorithm>

// ============================================================================
// HỌC PHẦN: ${lmsData.course?.name || 'LẬP TRÌNH NÂNG CAO'}
// LỚP HỌC PHẦN: ${lmsData.section?.section_code || 'IT65'} - GIẢNG VIÊN: ${lecturerName}
// BÀI THỰC HÀNH: ${m.title}
// ============================================================================

struct StudentRecord {
    int id;
    std::string fullName;
    double progressScore; // Điểm đánh giá quá trình
    double finalScore;    // Điểm thi kết thúc học phần
    
    double calculateGPA() const {
        return progressScore * 0.4 + finalScore * 0.6;
    }
};

int main() {
    std::cout << "=== HỆ THỐNG QUẢN LÝ E-LEARNING TCU COMPASS ===" << std::endl;
    
    std::vector<StudentRecord> students = {
        {101, "Nguyễn Văn An", 8.5, 9.0},
        {102, "Trần Thị Bình", 9.0, 8.5},
        {103, "Lê Hoàng Cường", 7.5, 8.0}
    };
    
    for (const auto& s : students) {
        std::cout << "SV: " << s.fullName 
                  << " | GPA Tổng Kết: " << s.calculateGPA() << std::endl;
    }
    
    std::cout << "Hoàn thành biên dịch và thực thi thuật toán." << std::endl;
    return 0;
}`;

            return (
              <div style={{ background: '#0d1117', borderRadius: 8, overflow: 'hidden', border: '1px solid #30363d' }}>
                {/* Header IDE */}
                <div style={{ padding: '10px 16px', background: '#161b22', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #30363d' }}>
                  <Space>
                    <CodeOutlined style={{ color: '#58a6ff' }} />
                    <span style={{ color: '#c9d1d9', fontWeight: 600, fontFamily: 'monospace' }}>
                      solution_exercise_{m.id || 1}.cpp
                    </span>
                    <Tag color="cyan">C++ 20 / STL</Tag>
                  </Space>
                  <Button
                    size="small"
                    type="primary"
                    icon={<CopyOutlined />}
                    onClick={() => {
                      navigator.clipboard?.writeText(sampleCode);
                      message.success('Đã sao chép toàn bộ mã nguồn vào Clipboard!');
                    }}
                  >
                    Sao Chép Mã Nguồn
                  </Button>
                </div>

                {/* Khung Code nền tối */}
                <pre
                  style={{
                    margin: 0,
                    padding: 20,
                    color: '#e6edf3',
                    fontFamily: '"Fira Code", Consolas, Monaco, monospace',
                    fontSize: 13,
                    lineHeight: 1.6,
                    overflowX: 'auto',
                    background: '#0d1117'
                  }}
                >
                  {sampleCode}
                </pre>
              </div>
            );
          }

          // ==================== 5. CHẾ ĐỘ TÀI LIỆU PDF CHUẨN HỌC THUẬT ====================
          return (
            <div>
              {/* Toolbar PDF Reader */}
              <div style={{ marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '10px 18px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <Space>
                  <FilePdfOutlined style={{ fontSize: 20, color: '#dc2626' }} />
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>TRÌNH ĐỌC TÀI LIỆU PDF HỌC THUẬT E-LEARNING</span>
                  <Tag color="volcano">Bản Chuẩn PDF</Tag>
                </Space>
                <Space>
                  <Tooltip title="Thu nhỏ">
                    <Button size="small" icon={<ZoomOutOutlined />} onClick={() => setPdfZoomLevel(z => Math.max(60, z - 15))} />
                  </Tooltip>
                  <span style={{ fontSize: 12, fontWeight: 600 }}>{pdfZoomLevel}%</span>
                  <Tooltip title="Phóng to">
                    <Button size="small" icon={<ZoomInOutlined />} onClick={() => setPdfZoomLevel(z => Math.min(160, z + 15))} />
                  </Tooltip>

                  <Divider type="vertical" />
                  <Text type="secondary" style={{ fontSize: 12 }}>Chế độ màu:</Text>
                  <Button
                    size="small"
                    type={readingTheme === 'LIGHT' ? 'primary' : 'default'}
                    onClick={() => setReadingTheme('LIGHT')}
                  >
                    Sáng
                  </Button>
                  <Button
                    size="small"
                    type={readingTheme === 'SEPIA' ? 'primary' : 'default'}
                    style={readingTheme === 'SEPIA' ? { background: '#d97706', borderColor: '#d97706' } : {}}
                    onClick={() => setReadingTheme('SEPIA')}
                  >
                    Vàng Dịu (Sepia)
                  </Button>
                  <Button
                    size="small"
                    type={readingTheme === 'DARK' ? 'primary' : 'default'}
                    onClick={() => setReadingTheme('DARK')}
                  >
                    Tối
                  </Button>
                </Space>
              </div>

              {/* Trang PDF */}
              <div
                style={{
                  transform: `scale(${pdfZoomLevel / 100})`,
                  transformOrigin: 'top center',
                  transition: 'transform 0.2s',
                  background: readingTheme === 'DARK' ? '#1e293b' : readingTheme === 'SEPIA' ? '#fffaf0' : '#ffffff',
                  color: readingTheme === 'DARK' ? '#f1f5f9' : '#1e293b',
                  borderRadius: 6,
                  boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                  padding: '48px 56px',
                  maxWidth: 820,
                  margin: '0 auto',
                  border: readingTheme === 'DARK' ? '1px solid #334155' : '1px solid #e2e8f0',
                  minHeight: 650
                }}
              >
                {/* Header PDF */}
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #ef4444', paddingBottom: 10, marginBottom: 24 }}>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: 13, textTransform: 'uppercase', color: '#ef4444' }}>
                      TRƯỜNG ĐẠI HỌC CÔNG NGHỆ TCU - THƯ VIỆN HỌC LIỆU SỐ
                    </div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>
                      Chuyên ngành: Khoa học Máy tính & Hệ thống Thông tin
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: 11, color: '#64748b' }}>
                    <div>Lưu hành nội bộ - Đào tạo tín chỉ</div>
                    <div>Năm học 2025 - 2026</div>
                  </div>
                </div>

                {/* Tiêu đề tài liệu */}
                <div style={{ textAlign: 'center', marginBottom: 28 }}>
                  <Title level={3} style={{ color: readingTheme === 'DARK' ? '#f8fafc' : '#0f172a', margin: '0 0 8px 0' }}>
                    {m.title}
                  </Title>
                  <Text style={{ fontSize: 13, color: readingTheme === 'DARK' ? '#94a3b8' : '#64748b' }}>
                    Tác giả / Giảng viên hướng dẫn: <strong>{lecturerName}</strong> • Học phần: <strong>{lmsData.course?.name || 'Môn học'}</strong>
                  </Text>
                </div>

                {/* Tóm tắt nội dung */}
                <div style={{ background: readingTheme === 'DARK' ? '#0f172a' : '#f8fafc', padding: '14px 20px', borderRadius: 8, marginBottom: 20, borderLeft: '4px solid #ef4444' }}>
                  <Text strong style={{ display: 'block', marginBottom: 4, color: '#ef4444' }}>
                    TÓM TẮT TÀI LIỆU (ABSTRACT):
                  </Text>
                  <div style={{ fontSize: 13, lineHeight: 1.6 }}>
                    {m.content_text || 'Tài liệu cung cấp hệ thống lý thuyết, công thức toán học và các hướng dẫn thực nghiệm phục vụ việc tự học và ôn tập học phần. Yêu cầu sinh viên đọc kỹ và trả lời các câu hỏi kiểm tra cuối bài để tích lũy điểm chuyên cần theo quy chế.'}
                  </div>
                </div>

                {/* Các phần chính */}
                <div style={{ lineHeight: 1.8, fontSize: 14 }}>
                  <div style={{ fontWeight: 'bold', fontSize: 15, marginTop: 16, marginBottom: 6, color: '#2563eb' }}>
                    1. TỔNG QUAN VÀ ĐẶT VẤN ĐỀ
                  </div>
                  <p style={{ textIndent: 24, margin: '0 0 12px 0' }}>
                    Trong bối cảnh chuyển đổi số giáo dục đại học, việc tiếp cận học liệu đa phương tiện đóng vai trò quyết định đến năng lực tự học của sinh viên. Học phần {lmsData.course?.name || ''} được thiết kế kết hợp hài hòa giữa lý thuyết nền tảng và năng lực giải quyết các tình huống thực tiễn.
                  </p>

                  <div style={{ fontWeight: 'bold', fontSize: 15, marginTop: 16, marginBottom: 6, color: '#2563eb' }}>
                    2. CÁC NGUYÊN TẮC VÀ MÔ HÌNH TOÁN HỌC
                  </div>
                  <p style={{ textIndent: 24, margin: '0 0 12px 0' }}>
                    Các mô hình tính toán được chuẩn hóa nhằm tối ưu hóa chi phí xử lý và đảm bảo tính chính xác cao nhất. Sinh viên cần chú ý các điều kiện ràng buộc biên và các trường hợp ngoại lệ trong quá trình thiết kế giải thuật.
                  </p>

                  <div style={{ fontWeight: 'bold', fontSize: 15, marginTop: 16, marginBottom: 6, color: '#2563eb' }}>
                    3. KẾT LUẬN VÀ HƯỚNG DẪN ÔN TẬP
                  </div>
                  <p style={{ textIndent: 24, margin: '0 0 12px 0' }}>
                    Sau khi hoàn thành nghiên cứu tài liệu này, sinh viên bấm nút <strong>"Xác Nhận Đã Hoàn Thành Bài Học"</strong> ở thanh chân trang để hệ thống tự động ghi nhận thời gian tự học và cộng điểm chuyên cần học phần.
                  </p>
                </div>

                {/* Footer PDF */}
                <div style={{ borderTop: '1px solid #e2e8f0', marginTop: 40, paddingTop: 12, display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#94a3b8' }}>
                  <span>TCU Digital Library • Hệ thống Quản trị Đại học Toàn diện</span>
                  <span>Trang 1 / 1</span>
                </div>
              </div>
            </div>
          );
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 60 }}>
        <Spin size="large" />
        <div style={{ marginTop: 12, color: '#64748b' }}>Đang nạp không gian E-Learning...</div>
      </div>
    );
  }

  return (
    <div>
      {/* 1. BANNER HỌC PHẦN E-LEARNING CHUẨN BỘ GD&ĐT */}
      <Card
        style={{
          borderRadius: 12,
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #172554 100%)',
          border: 'none',
          color: '#ffffff',
          marginBottom: 20,
          boxShadow: '0 6px 18px rgba(0,0,0,0.2)'
        }}
      >
        <Row gutter={[20, 16]} align="middle" justify="space-between">
          <Col xs={24} lg={15}>
            <Space direction="vertical" size={6}>
              <Space wrap>
                <Tag color="purple" style={{ fontSize: 13, padding: '3px 10px', fontWeight: 'bold' }}>
                  🎓 BẬC ĐÀO TẠO: {lmsData.course?.degree_level || 'ĐẠI HỌC / THẠC SĨ / TIẾN SĨ'}
                </Tag>
                <Tag color="cyan" style={{ fontSize: 13, padding: '3px 8px' }}>
                  Mã Lớp HP: <strong>{lmsData.section?.code}</strong>
                </Tag>
                <Tag color="gold" style={{ fontSize: 13, padding: '3px 8px' }}>
                  {lmsData.course?.credits || 3} Tín chỉ ({lmsData.course?.theory_credits || 2}LT + {lmsData.course?.practice_credits || 1}TH)
                </Tag>
                <Tag color="green" style={{ fontSize: 12 }}>
                  Quy chế TT 08/2021 & TT 23/2021 Bộ GD&ĐT
                </Tag>
              </Space>

              <Title level={3} style={{ color: '#ffffff', margin: '6px 0 2px 0' }}>
                <BookOutlined style={{ color: '#38bdf8', marginRight: 10 }} />
                {lmsData.course?.name || 'Học Phần Đào Tạo'} ({lmsData.course?.code})
              </Title>

              <Paragraph style={{ color: '#94a3b8', margin: 0, fontSize: 13 }}>
                Đề cương chi tiết Syllabus 15 tuần học • Giảng viên: <strong>{lmsData.section?.lecturer_name || lecturerName}</strong> • Phòng học: <strong>{lmsData.section?.room_name || 'Phòng thực hành CSDL P.302'}</strong>
              </Paragraph>
            </Space>
          </Col>

          <Col xs={24} lg={9} style={{ textAlign: 'right' }}>
            {role === 'STUDENT' ? (
              <div style={{ background: 'rgba(255,255,255,0.08)', padding: '14px 20px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.15)', display: 'inline-block', textAlign: 'left', minWidth: 320 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text style={{ color: '#cbd5e1', fontSize: 13, fontWeight: 600 }}>Tiến Độ Tích Lũy Học Phần Số:</Text>
                  <Text strong style={{ color: completionStats.percent >= 80 ? '#4ade80' : '#38bdf8', fontSize: 16 }}>{completionStats.percent}%</Text>
                </div>
                <Progress
                  percent={completionStats.percent}
                  size="small"
                  strokeColor={completionStats.percent >= 80 ? '#22c55e' : { '0%': '#38bdf8', '100%': '#818cf8' }}
                />
                <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <Tag color="error" style={{ fontSize: 11 }}>🎥 Video: {completionStats.completedVideos}/{completionStats.totalVideos}</Tag>
                  <Tag color="blue" style={{ fontSize: 11 }}>📖 Tài liệu: {completionStats.completedMaterials}/{completionStats.totalMaterials}</Tag>
                  <Tag color="purple" style={{ fontSize: 11 }}>📝 Quiz đạt: {completionStats.passedQuizzes}/{completionStats.totalQuizzes}</Tag>
                </div>
                <div style={{ marginTop: 6, fontSize: 11, color: completionStats.isQualifiedForExam ? '#4ade80' : '#fcd34d' }}>
                  {completionStats.isQualifiedForExam ? '✓ Đã đạt chuẩn chuyên cần dự thi kết thúc học phần (≥80%)' : `⚠️ Cần hoàn thành tối thiểu 80% để đủ điều kiện thi (TT 08/2021)`}
                </div>
              </div>
            ) : (
              <Space direction="vertical" align="end" size={8}>
                <Space wrap>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    style={{ background: '#10b981', borderColor: '#10b981' }}
                    onClick={() => {
                      moduleForm.resetFields();
                      moduleForm.setFieldsValue({ week_number: (lmsData.modules?.length || 0) + 1, is_published: true });
                      setIsModuleModalOpen(true);
                    }}
                  >
                    Thêm Tuần Học Mới
                  </Button>
                  <Button
                    type="primary"
                    icon={<ThunderboltOutlined />}
                    onClick={() => handleSyncGrades('attendance')}
                  >
                    Đồng Bộ Điểm LMS Vào Sổ Điểm
                  </Button>
                </Space>
                <Text style={{ color: '#94a3b8', fontSize: 11 }}>
                  * Tự động trích xuất điểm Quiz quá trình vào Điểm chuyên cần / Kiểm tra định kỳ
                </Text>
              </Space>
            )}
          </Col>
        </Row>
      </Card>

      {/* 2. THANH CÔNG CỤ, BỘ LỌC & CẤU HÌNH LỘ TRÌNH HỌC TUẦN TỰ */}
      <Card style={{ borderRadius: 10, marginBottom: 16 }}>
        <Row justify="space-between" align="middle" gutter={[16, 16]}>
          <Col xs={24} sm={14}>
            <Space wrap>
              <Text strong>Lọc Theo Tuần Đề Cương:</Text>
              <Select value={selectedWeek} onChange={setSelectedWeek} style={{ width: 240 }}>
                <Option value="ALL">🌟 Toàn Bộ 15 Tuần Học Đề Cương</Option>
                {(lmsData.modules || []).map(m => (
                  <Option key={m.id} value={m.week_number}>
                    Tuần {m.week_number}: {((m.title || m.name || `Tuần ${m.week_number}`) + '').slice(0, 32)}...
                  </Option>
                ))}
              </Select>
            </Space>
          </Col>
          <Col xs={24} sm={10} style={{ textAlign: 'right' }}>
            <Space wrap>
              {isStaff && (
                <Tooltip title="Khi bật, sinh viên bắt buộc phải hoàn thành và đạt bài Quiz của tuần trước thì tuần tiếp theo mới được mở khóa (Quy chế đào tạo TT 08/2021)">
                  <Space>
                    <span style={{ fontSize: 12, color: '#475569' }}>Học tuần tự:</span>
                    <Switch
                      checkedChildren="🔒 Khóa tuần sau khi chưa đạt Quiz"
                      unCheckedChildren="🔓 Tự do"
                      checked={strictProgression}
                      onChange={setStrictProgression}
                    />
                  </Space>
                </Tooltip>
              )}
              <Button icon={<ReloadOutlined />} onClick={() => { loadLmsData(); loadDiscussions(); loadAnalytics(); }}>
                Làm Mới Dữ Liệu
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 3. TABS CHUYÊN SÂU THEO CHUẨN E-LEARNING & BỘ GD&ĐT */}
      <Tabs
        type="card"
        defaultActiveKey="modules"
        items={[
          // TAB 1: BÀI GIẢNG & TÀI LIỆU 15 TUẦN HỌC
          {
            key: 'modules',
            label: (
              <Space>
                <BookOutlined />
                <span>Giáo Trình & Bài Giảng 15 Tuần ({filteredModules.length})</span>
              </Space>
            ),
            children: (
              <div>
                {filteredModules.length === 0 ? (
                  <Empty description="Chưa có bài học nào được tạo trong tuần này." />
                ) : (
                  <Collapse
                    defaultActiveKey={filteredModules.map(m => String(m.id))}
                    style={{ background: 'transparent', border: 'none' }}
                    items={filteredModules.map(m => {
                      const lockInfo = moduleLockStatus[m.id];
                      const isModuleLocked = role === 'STUDENT' && strictProgression && lockInfo?.isLocked;

                      // Tính tiến độ riêng của tuần học
                      const weekMats = m.materials || [];
                      const weekQuizzes = m.quizzes || [];
                      const completedMats = weekMats.filter(mat => mat.is_completed).length;
                      const passedQuizzes = weekQuizzes.filter(q => q.best_submission && (q.best_submission.is_passed || Number(q.best_submission.score) >= Number(q.passing_score || 5.0))).length;
                      const totalItems = weekMats.length + weekQuizzes.length;
                      const completedItems = completedMats + passedQuizzes;
                      const weekPercent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

                      return {
                        key: String(m.id),
                        style: {
                          marginBottom: 16,
                          background: isModuleLocked ? '#f8fafc' : '#ffffff',
                          borderRadius: 10,
                          border: isModuleLocked ? '1px dashed #cbd5e1' : '1px solid #e2e8f0',
                          overflow: 'hidden'
                        },
                        label: (
                            <Row justify="space-between" align="middle" style={{ width: '100%' }}>
                              <Col>
                                <Space wrap>
                                  <Tag color={isModuleLocked ? 'error' : 'blue'} style={{ fontSize: 13, padding: '3px 8px', fontWeight: 'bold' }}>
                                    {isModuleLocked ? '🔒 KHÓA' : `TUẦN ${m.week_number}`}
                                  </Tag>
                                  <Text strong style={{ fontSize: 15, color: isModuleLocked ? '#64748b' : '#0f172a' }}>
                                    {m.title || m.name}
                                  </Text>
                                  {isModuleLocked && (
                                    <Tag color="warning" icon={<LockOutlined />}>
                                      Cần đạt Quiz Tuần {lockInfo.prevWeekNumber} để mở
                                    </Tag>
                                  )}
                                </Space>
                              </Col>
                              <Col>
                                <Space>
                                  {role === 'STUDENT' && !isModuleLocked && (
                                    <Space size="small" style={{ marginRight: 8 }}>
                                      <Progress percent={weekPercent} size="small" style={{ width: 85 }} strokeColor={weekPercent === 100 ? '#16a34a' : '#38bdf8'} />
                                      {weekPercent === 100 && <Tag color="success">✓ Xong</Tag>}
                                    </Space>
                                  )}
                                  <Badge count={`${(m.materials || []).length} Tài liệu`} style={{ backgroundColor: '#e2e8f0', color: '#334155' }} />
                                  <Badge count={`${(m.quizzes || []).length} Bài kiểm tra`} style={{ backgroundColor: '#fef3c7', color: '#b45309' }} />
                                  {isStaff && (
                                    <Space onClick={e => e.stopPropagation()}>
                                      <Button
                                        size="small"
                                        icon={<VideoCameraOutlined />}
                                        style={{ color: '#ef4444', borderColor: '#fca5a5' }}
                                        onClick={() => {
                                          setSelectedModuleIdForMaterial(m.id);
                                          materialForm.resetFields();
                                          materialForm.setFieldsValue({
                                            material_type: 'VIDEO',
                                            category: 'MAIN_TEXTBOOK',
                                            duration_mins: 45
                                          });
                                          setMaterialTypeSelected('VIDEO');
                                          setMaterialSourceMode('UPLOAD');
                                          setUploadedFileInfo(null);
                                          setVideoUploadPreviewUrl('');
                                          setIsMaterialModalOpen(true);
                                        }}
                                      >
                                        + Thêm Video
                                      </Button>
                                      <Button
                                        size="small"
                                        type="dashed"
                                        icon={<PlusOutlined />}
                                        onClick={() => {
                                          setSelectedModuleIdForMaterial(m.id);
                                          materialForm.resetFields();
                                          materialForm.setFieldsValue({
                                            material_type: 'DOCUMENT',
                                            category: 'MAIN_TEXTBOOK',
                                            duration_mins: 45
                                          });
                                          setMaterialTypeSelected('DOCUMENT');
                                          setMaterialSourceMode('UPLOAD');
                                          setUploadedFileInfo(null);
                                          setVideoUploadPreviewUrl('');
                                          setIsMaterialModalOpen(true);
                                        }}
                                      >
                                        Thêm Tài Liệu
                                      </Button>
                                      <Button
                                        size="small"
                                        type="primary"
                                        style={{ background: '#7e22ce', borderColor: '#7e22ce' }}
                                        icon={<FormOutlined />}
                                        onClick={() => handleOpenCreateQuiz(m.id)}
                                      >
                                        + Thêm Bài Quiz
                                      </Button>
                                      <Popconfirm title="Xóa tuần học này cùng tài liệu?" onConfirm={() => handleDeleteModule(m.id)}>
                                        <Button size="small" danger icon={<DeleteOutlined />} />
                                      </Popconfirm>
                                    </Space>
                                  )}
                                </Space>
                              </Col>
                            </Row>
                        ),
                        children: isModuleLocked ? (
                            <div style={{ padding: '24px 16px', textAlign: 'center' }}>
                              <Alert
                                type="warning"
                                showIcon
                                icon={<LockOutlined style={{ fontSize: 32, color: '#d97706' }} />}
                                message={
                                  <Text strong style={{ fontSize: 16, color: '#92400e' }}>
                                    BÀI HỌC TUẦN {m.week_number} ĐANG BỊ TẠM KHÓA THEO LỘ TRÌNH ĐÀO TẠO
                                  </Text>
                                }
                                description={
                                  <div style={{ marginTop: 8 }}>
                                    <Paragraph style={{ color: '#78350f', fontSize: 13, maxWidth: 640, margin: '0 auto 16px auto' }}>
                                      {lockInfo?.reason || `Bạn cần hoàn thành và đạt bài kiểm tra Quiz của tuần trước để mở khóa bài học này.`}
                                    </Paragraph>
                                    {lockInfo?.requiredQuiz && (
                                      <Button
                                        type="primary"
                                        size="large"
                                        icon={<QuestionCircleOutlined />}
                                        style={{ background: '#7e22ce', borderColor: '#7e22ce', borderRadius: 6 }}
                                        onClick={() => handleStartQuiz(lockInfo.requiredQuiz)}
                                      >
                                        📝 Làm Bài Quiz Tuần {lockInfo.prevWeekNumber} Ngay Để Mở Khóa Tuần Này
                                      </Button>
                                    )}
                                  </div>
                                }
                                style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8 }}
                              />
                            </div>
                          ) : (
                            <>
                              {m.description && (
                                <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: 8, marginBottom: 14, fontSize: 13, color: '#475569' }}>
                                  <strong>🎯 Mục tiêu chuẩn đầu ra CLO:</strong> {m.description}
                                </div>
                              )}

                        {/* DANH SÁCH TÀI LIỆU CỦA TUẦN ĐA ĐỊNH DẠNG */}
                        <div style={{ marginBottom: 16 }}>
                          <Text strong style={{ fontSize: 13, color: '#0f172a', display: 'block', marginBottom: 8 }}>
                            📖 Tài Liệu Tham Khảo & Đa Phương Tiện (Giáo trình, Slide, Link Scopus/IEEE, GitHub):
                          </Text>
                          {(m.materials || []).length === 0 ? (
                            <Text type="secondary" style={{ fontStyle: 'italic', fontSize: 12 }}>Chưa có tài liệu tải lên cho tuần này.</Text>
                          ) : (
                            <List
                              size="small"
                              bordered
                              dataSource={m.materials}
                              renderItem={mat => {
                                const titleLower = (mat.title || '').toLowerCase();
                                const urlLower = (mat.file_url || '').toLowerCase();
                                const isVideo = mat.material_type === 'VIDEO' || urlLower.includes('youtube') || urlLower.includes('.mp4') || titleLower.includes('video');
                                const isSlide = mat.material_type === 'SLIDE' || mat.category === 'LECTURE_SLIDE' || urlLower.includes('.ppt') || titleLower.includes('slide');
                                const isWord = mat.material_type === 'WORD' || urlLower.includes('.doc') || titleLower.includes('word') || titleLower.includes('đề cương') || titleLower.includes('kế hoạch');
                                const isPdf = mat.material_type === 'PDF' || (mat.material_type === 'DOCUMENT' && !isWord) || urlLower.includes('.pdf');
                                const isCode = mat.material_type === 'CODE' || mat.category === 'SOURCE_CODE' || urlLower.includes('.cpp') || urlLower.includes('.java') || urlLower.includes('.py') || urlLower.includes('github') || titleLower.includes('code') || titleLower.includes('mã nguồn');

                                let avatarIcon = <BookOutlined style={{ fontSize: 24, color: '#2563eb' }} />;
                                let actionBtn = (
                                  <Button
                                    size="small"
                                    type="primary"
                                    icon={<EyeOutlined />}
                                    style={{ background: '#2563eb', borderColor: '#2563eb' }}
                                    onClick={() => handleOpenContentViewer(mat)}
                                  >
                                    Xem Tài Liệu
                                  </Button>
                                );

                                if (isVideo) {
                                  avatarIcon = <VideoCameraOutlined style={{ fontSize: 24, color: '#ef4444' }} />;
                                  actionBtn = (
                                    <Button
                                      size="small"
                                      type="primary"
                                      icon={<PlayCircleOutlined />}
                                      style={{ background: '#ef4444', borderColor: '#ef4444' }}
                                      onClick={() => handleOpenContentViewer(mat)}
                                    >
                                      Xem Video Bài Giảng
                                    </Button>
                                  );
                                } else if (isSlide) {
                                  avatarIcon = <FilePptOutlined style={{ fontSize: 24, color: '#d97706' }} />;
                                  actionBtn = (
                                    <Button
                                      size="small"
                                      type="primary"
                                      icon={<DesktopOutlined />}
                                      style={{ background: '#d97706', borderColor: '#d97706' }}
                                      onClick={() => handleOpenContentViewer(mat)}
                                    >
                                      Trình Chiếu Slide
                                    </Button>
                                  );
                                } else if (isWord) {
                                  avatarIcon = <FileWordOutlined style={{ fontSize: 24, color: '#1d4ed8' }} />;
                                  actionBtn = (
                                    <Button
                                      size="small"
                                      type="primary"
                                      icon={<FileWordOutlined />}
                                      style={{ background: '#1d4ed8', borderColor: '#1d4ed8' }}
                                      onClick={() => handleOpenContentViewer(mat)}
                                    >
                                      Xem Văn Bản Word
                                    </Button>
                                  );
                                } else if (isPdf) {
                                  avatarIcon = <FilePdfOutlined style={{ fontSize: 24, color: '#b91c1c' }} />;
                                  actionBtn = (
                                    <Button
                                      size="small"
                                      type="primary"
                                      icon={<FilePdfOutlined />}
                                      style={{ background: '#b91c1c', borderColor: '#b91c1c' }}
                                      onClick={() => handleOpenContentViewer(mat)}
                                    >
                                      Đọc Tài Liệu PDF
                                    </Button>
                                  );
                                } else if (isCode) {
                                  avatarIcon = <CodeOutlined style={{ fontSize: 24, color: '#ea580c' }} />;
                                  actionBtn = (
                                    <Button
                                      size="small"
                                      type="primary"
                                      icon={<CodeOutlined />}
                                      style={{ background: '#ea580c', borderColor: '#ea580c' }}
                                      onClick={() => handleOpenContentViewer(mat)}
                                    >
                                      Thực Hành Code
                                    </Button>
                                  );
                                }

                                return (
                                  <List.Item
                                    actions={[
                                      actionBtn,
                                      mat.file_url && (
                                        <Button
                                          size="small"
                                          type="link"
                                          icon={mat.external_source ? <LinkOutlined /> : <DownloadOutlined />}
                                          onClick={() => window.open(mat.file_url, '_blank')}
                                        >
                                          {mat.external_source ? `Mở ${mat.external_source}` : 'Tải Về / Link Ngoài'}
                                        </Button>
                                      ),
                                      role === 'STUDENT' ? (
                                        <Button
                                          size="small"
                                          type={mat.is_completed ? 'primary' : 'default'}
                                          icon={mat.is_completed ? <CheckOutlined /> : null}
                                          style={mat.is_completed ? { background: '#16a34a', borderColor: '#16a34a' } : {}}
                                          onClick={() => handleToggleProgress(mat.id, mat.is_completed)}
                                        >
                                          {mat.is_completed ? 'Đã Học Xong' : 'Đánh Dấu Đã Đọc'}
                                        </Button>
                                      ) : (
                                        <Popconfirm title="Xóa tài liệu này?" onConfirm={() => handleDeleteMaterial(mat.id)}>
                                          <Button size="small" danger icon={<DeleteOutlined />} />
                                        </Popconfirm>
                                      )
                                    ]}
                                  >
                                    <List.Item.Meta
                                      avatar={avatarIcon}
                                      title={
                                        <Space wrap>
                                          <Text strong style={{ cursor: 'pointer', color: '#1e40af' }} onClick={() => handleOpenContentViewer(mat)}>
                                            {mat.title}
                                          </Text>
                                          {renderCategoryTag(mat.category)}
                                          {isVideo && <Tag color="error">🎥 Video Bài Giảng</Tag>}
                                          {isSlide && <Tag color="warning">📊 Slide Trình Chiếu</Tag>}
                                          {isWord && <Tag color="blue">📝 Văn Bản Word</Tag>}
                                          {isPdf && <Tag color="volcano">📑 Tài Liệu PDF</Tag>}
                                          {isCode && <Tag color="orange">💻 Mã Nguồn Thực Hành</Tag>}
                                          {mat.file_size_mb && <Tag color="default">{mat.file_size_mb} MB</Tag>}
                                          {mat.external_source && <Tag color="cyan">🌐 {mat.external_source}</Tag>}
                                          {mat.is_completed && <Tag color="success">✓ Đã Hoàn Thành</Tag>}
                                        </Space>
                                      }
                                      description={mat.content_text || `Thời lượng nghiên cứu khuyến nghị: ${mat.duration_mins || 45} phút`}
                                    />
                                  </List.Item>
                                );
                              }}
                            />
                          )}
                        </div>

                        {/* BÀI KIỂM TRA ĐÁNH GIÁ QUÁ TRÌNH (QUIZ) */}
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                            <Text strong style={{ fontSize: 13, color: '#0f172a' }}>
                              📝 Bài Kiểm Tra Đánh Giá Quá Trình (Quy Định Chuẩn Bộ GD&ĐT):
                            </Text>
                            {role === 'LECTURER' && (
                              <Button
                                size="small"
                                type="dashed"
                                icon={<PlusOutlined />}
                                style={{ color: '#7e22ce', borderColor: '#d8b4fe' }}
                                onClick={() => handleOpenCreateQuiz(m.id)}
                              >
                                + Thêm Bài Quiz Tuần Này
                              </Button>
                            )}
                          </div>

                          {(m.quizzes || []).length === 0 ? (
                            <div style={{ background: '#faf5ff', padding: '16px 20px', borderRadius: 8, border: '1px dashed #d8b4fe', textAlign: 'center' }}>
                              <Text type="secondary" style={{ fontStyle: 'italic', fontSize: 13, display: 'block', marginBottom: 8 }}>
                                Chưa có bài kiểm tra đánh giá quá trình cho tuần học này.
                              </Text>
                              {role === 'LECTURER' && (
                                <Button
                                  type="primary"
                                  style={{ background: '#7e22ce', borderColor: '#7e22ce' }}
                                  icon={<PlusCircleOutlined />}
                                  onClick={() => handleOpenCreateQuiz(m.id)}
                                >
                                  Soạn & Bổ Sung Bài Kiểm Tra Quiz Cho Tuần Này
                                </Button>
                              )}
                            </div>
                          ) : (
                            <Row gutter={[16, 16]}>
                              {m.quizzes.map(q => (
                                <Col xs={24} md={12} key={q.id}>
                                  <Card
                                    size="small"
                                    style={{
                                      borderRadius: 8,
                                      background: '#faf5ff',
                                      border: '1px solid #d8b4fe'
                                    }}
                                  >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                      <div style={{ flex: 1 }}>
                                        <Text strong style={{ fontSize: 14, color: '#6b21a8' }}>
                                          <QuestionCircleOutlined style={{ marginRight: 6 }} />
                                          {q.title}
                                        </Text>
                                        <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
                                          ⏱️ Giới hạn: <strong>{q.time_limit_minutes} phút</strong> | Tối đa: <strong>{q.max_attempts} lần</strong> | Trọng số: <strong>{q.grade_weight}%</strong>
                                        </div>
                                        <div style={{ fontSize: 11, color: '#475569', marginTop: 4 }}>
                                          Chính sách điểm: {renderPolicyTag(q.scoring_policy)} | Chống gian lận: <strong>{q.max_tab_switches || 3} lần chuyển tab</strong>
                                        </div>
                                        {q.available_from && (
                                          <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>
                                            Khung mở: {new Date(q.available_from).toLocaleDateString('vi-VN')} - {q.available_until ? new Date(q.available_until).toLocaleDateString('vi-VN') : 'Mở liên tục'}
                                          </div>
                                        )}
                                        {q.best_submission && (
                                          <div style={{ marginTop: 6 }}>
                                            <Tag color={q.best_submission.is_passed ? 'success' : 'error'}>
                                              Điểm chính thức: <strong>{q.best_submission.score} / 10.0</strong> ({q.best_submission.is_passed ? 'ĐẠT' : 'CHƯA ĐẠT'})
                                            </Tag>
                                          </div>
                                        )}
                                      </div>

                                      <div style={{ marginLeft: 12 }}>
                                        {role === 'STUDENT' ? (
                                          <Button
                                            type="primary"
                                            size="middle"
                                            style={{ background: '#7e22ce', borderColor: '#7e22ce' }}
                                            onClick={() => handleStartQuiz(q)}
                                          >
                                            {q.best_submission ? 'Làm Lại Quiz' : 'Làm Bài Thi'}
                                          </Button>
                                        ) : (
                                          <Space direction="vertical" align="end" size={4}>
                                            <Space>
                                              <Button
                                                size="small"
                                                icon={<EditOutlined />}
                                                style={{ color: '#7e22ce', borderColor: '#d8b4fe' }}
                                                onClick={() => handleOpenEditQuiz(q)}
                                              >
                                                Sửa Đề & Đáp Án
                                              </Button>
                                              <Popconfirm title="Bạn có chắc chắn muốn xóa bài kiểm tra này?" onConfirm={() => handleDeleteQuiz(q.id)}>
                                                <Button size="small" danger icon={<DeleteOutlined />} />
                                              </Popconfirm>
                                            </Space>
                                            <Tag color="purple">Sẵn sàng kiểm tra</Tag>
                                          </Space>
                                        )}
                                      </div>
                                    </div>
                                  </Card>
                                </Col>
                              ))}
                            </Row>
                          )}
                        </div>
                      </>
                    )
                  };
                })}
              />
                )}
              </div>
            )
          },

          // TAB 2: DIỄN ĐÀN THẢO LUẬN NHÓM & HỎI ĐÁP GIẢNG VIÊN
          {
            key: 'discussions',
            label: (
              <Space>
                <MessageOutlined />
                <span>Diễn Đàn & Thảo Luận Nhóm ({discussions.length})</span>
              </Space>
            ),
            children: (
              <Card style={{ borderRadius: 10 }}>
                {/* Bộ lọc loại thảo luận */}
                <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                  <Radio.Group value={discussionFilter} onChange={e => setDiscussionFilter(e.target.value)} buttonStyle="solid">
                    <Radio.Button value="ALL">Toàn bộ thảo luận ({discussions.length})</Radio.Button>
                    <Radio.Button value="QA_LECTURER">❓ Hỏi đáp Giảng viên</Radio.Button>
                    <Radio.Button value="GROUP_DISCUSSION">👥 Thảo luận Nhóm SV</Radio.Button>
                    <Radio.Button value="ANSWERED">✅ Đã giải đáp</Radio.Button>
                  </Radio.Group>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Trao đổi học thuật theo phương pháp Blended Learning
                  </Text>
                </div>

                {/* Form tạo câu hỏi / chủ đề thảo luận */}
                <div style={{ background: '#f8fafc', padding: 16, borderRadius: 8, border: '1px solid #e2e8f0', marginBottom: 20 }}>
                  <Text strong style={{ fontSize: 14, display: 'block', marginBottom: 8 }}>
                    💬 Đặt Câu Hỏi Mới Hoặc Mở Phiên Thảo Luận Nhóm:
                  </Text>
                  <Row gutter={12} style={{ marginBottom: 8 }}>
                    <Col xs={24} md={10}>
                      <Input
                        placeholder="Tiêu đề câu hỏi / chủ đề thảo luận..."
                        value={discussionTitle}
                        onChange={e => setDiscussionTitle(e.target.value)}
                      />
                    </Col>
                    <Col xs={24} md={7}>
                      <Select
                        value={discussionType}
                        onChange={setDiscussionType}
                        style={{ width: '100%' }}
                      >
                        <Option value="CLASS_GENERAL">Toàn thể lớp học</Option>
                        <Option value="QA_LECTURER">❓ Hỏi đáp trực tiếp Giảng viên</Option>
                        <Option value="GROUP_DISCUSSION">👥 Thảo luận Nhóm đề tài</Option>
                      </Select>
                    </Col>
                    <Col xs={24} md={7}>
                      {discussionType === 'GROUP_DISCUSSION' && (
                        <Input
                          placeholder="Tên nhóm (ví dụ: Nhóm 1, Nhóm 2)..."
                          value={groupName}
                          onChange={e => setGroupName(e.target.value)}
                        />
                      )}
                    </Col>
                  </Row>
                  <TextArea
                    rows={3}
                    placeholder="Nhập nội dung chi tiết bài học cần Giảng viên giải đáp hoặc trao đổi cùng các bạn trong nhóm/lớp..."
                    value={discussionContent}
                    onChange={e => setDiscussionContent(e.target.value)}
                    style={{ marginBottom: 10 }}
                  />
                  <Button
                    type="primary"
                    icon={<SendOutlined />}
                    loading={submittingDiscussion}
                    onClick={handlePostDiscussion}
                  >
                    Đăng Thảo Luận Lên Diễn Đàn
                  </Button>
                </div>

                {/* Danh sách bài thảo luận */}
                {loadingDiscussions ? (
                  <div style={{ textAlign: 'center', padding: 30 }}>
                    <Spin />
                    <div style={{ marginTop: 8, color: '#64748b' }}>Đang tải trao đổi...</div>
                  </div>
                ) : filteredDiscussions.length === 0 ? (
                  <Empty description="Không có chủ đề thảo luận nào trong danh mục này." />
                ) : (
                  <List
                    itemLayout="vertical"
                    dataSource={filteredDiscussions}
                    renderItem={d => (
                      <List.Item
                        key={d.id}
                        style={{
                          background: d.is_pinned ? '#eff6ff' : d.is_answered ? '#f0fdf4' : '#ffffff',
                          padding: '14px 16px',
                          borderRadius: 8,
                          marginBottom: 12,
                          border: d.is_pinned ? '1px solid #93c5fd' : d.is_answered ? '1px solid #86efac' : '1px solid #e2e8f0'
                        }}
                        actions={[
                          <Button
                            key="upvote"
                            size="small"
                            type="text"
                            icon={<LikeOutlined />}
                            onClick={() => handleUpvote(d.id)}
                          >
                            Đồng tình ({d.upvotes || 0})
                          </Button>,
                          (role === 'LECTURER' || d.author_type === 'LECTURER') && (
                            <Button
                              key="answered"
                              size="small"
                              type={d.is_answered ? 'primary' : 'dashed'}
                              icon={<CheckCircleOutlined />}
                              style={d.is_answered ? { background: '#16a34a', borderColor: '#16a34a' } : {}}
                              onClick={() => handleToggleAnswered(d.id)}
                            >
                              {d.is_answered ? 'Đã Giải Đáp ✓' : 'Đánh Dấu Đã Giải Đáp'}
                            </Button>
                          )
                        ]}
                      >
                        <List.Item.Meta
                          avatar={
                            <Avatar
                              style={{
                                backgroundColor: d.author_type === 'LECTURER' ? '#722ed1' : '#1677ff'
                              }}
                            >
                              {d.author_type === 'LECTURER' ? 'GV' : 'SV'}
                            </Avatar>
                          }
                          title={
                            <Space wrap>
                              <Text strong style={{ fontSize: 15 }}>{d.title || 'Trao đổi bài học'}</Text>
                              {d.discussion_type === 'QA_LECTURER' && <Tag color="purple">❓ Hỏi Giảng Viên</Tag>}
                              {d.discussion_type === 'GROUP_DISCUSSION' && <Tag color="geekblue">👥 {d.group_name || 'Nhóm SV'}</Tag>}
                              {d.is_answered && <Tag color="success">✓ Đã Giải Đáp</Tag>}
                              {d.is_pinned && <Tag color="blue">📌 Ghim</Tag>}
                              <Tag color={d.author_type === 'LECTURER' ? 'purple' : 'default'}>{d.author_name}</Tag>
                            </Space>
                          }
                          description={
                            <div style={{ color: '#334155', marginTop: 6, fontSize: 13, whiteSpace: 'pre-wrap' }}>
                              {d.content}
                            </div>
                          }
                        />
                      </List.Item>
                    )}
                  />
                )}
              </Card>
            )
          },

          // TAB 3: BÁO CÁO THỐNG KÊ & PHÂN TÍCH CHUYÊN SÂU (LEARNING ANALYTICS & AUDIT TT 08/2021)
          {
            key: 'analytics',
            label: (
              <Space>
                <BarChartOutlined />
                <span>Thống Kê & Thẩm Định Điều Kiện Thi (TT 08/2021)</span>
              </Space>
            ),
            children: (
              <div>
                {loadingAnalytics ? (
                  <div style={{ textAlign: 'center', padding: 40 }}>
                    <Spin />
                    <div style={{ marginTop: 8, color: '#64748b' }}>Đang trích xuất báo cáo học vụ...</div>
                  </div>
                ) : !analytics ? (
                  <Empty description="Chưa có dữ liệu thống kê cho lớp học phần này." />
                ) : (
                  <Space direction="vertical" style={{ width: '100%' }} size={16}>
                    {/* 1. THẺ KPI TỔNG QUAN HỌC VỤ SỐ */}
                    <Row gutter={[16, 16]}>
                      <Col xs={12} sm={6}>
                        <Card size="small" style={{ borderRadius: 8, background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                          <Statistic
                            title={<Text strong style={{ color: '#166534' }}>Tỷ Lệ Đủ ĐK Dự Thi</Text>}
                            value={analytics.total_enrolled > 0 ? Math.round((analytics.eligible_count / analytics.total_enrolled) * 100) : 0}
                            suffix="%"
                            valueStyle={{ color: '#15803d', fontWeight: 'bold' }}
                            prefix={<CheckCircleOutlined />}
                          />
                          <Text style={{ fontSize: 11, color: '#16a34a' }}>
                            {analytics.eligible_count || 0}/{analytics.total_enrolled || 0} sinh viên đủ điều kiện
                          </Text>
                        </Card>
                      </Col>
                      <Col xs={12} sm={6}>
                        <Card size="small" style={{ borderRadius: 8, background: '#eff6ff', border: '1px solid #bfdbfe' }}>
                          <Statistic
                            title={<Text strong style={{ color: '#1e40af' }}>Tiến Độ Học Tập TB</Text>}
                            value={analytics.avg_completion_rate || 0}
                            suffix="%"
                            valueStyle={{ color: '#1d4ed8', fontWeight: 'bold' }}
                            prefix={<BookOutlined />}
                          />
                          <Text style={{ fontSize: 11, color: '#2563eb' }}>
                            Dựa trên số bài giảng đã học
                          </Text>
                        </Card>
                      </Col>
                      <Col xs={12} sm={6}>
                        <Card size="small" style={{ borderRadius: 8, background: '#faf5ff', border: '1px solid #e9d5ff' }}>
                          <Statistic
                            title={<Text strong style={{ color: '#6b21a8' }}>Điểm Quiz Quá Trình TB</Text>}
                            value={analytics.avg_quiz_score || 0}
                            precision={1}
                            suffix="/ 10"
                            valueStyle={{ color: '#7e22ce', fontWeight: 'bold' }}
                            prefix={<TrophyOutlined />}
                          />
                          <Text style={{ fontSize: 11, color: '#9333ea' }}>
                            Thang điểm 10 quy đổi
                          </Text>
                        </Card>
                      </Col>
                      <Col xs={12} sm={6}>
                        <Card size="small" style={{ borderRadius: 8, background: '#fff1f2', border: '1px solid #fecdd3' }}>
                          <Statistic
                            title={<Text strong style={{ color: '#9f1239' }}>Cảnh Báo Cấm Thi</Text>}
                            value={analytics.barred_count || 0}
                            valueStyle={{ color: '#e11d48', fontWeight: 'bold' }}
                            prefix={<WarningOutlined />}
                          />
                          <Text style={{ fontSize: 11, color: '#e11d48' }}>
                            Tiến độ &lt; 80% hoặc vắng học
                          </Text>
                        </Card>
                      </Col>
                    </Row>

                    {/* 2. PHỔ ĐIỂM ĐÁNH GIÁ QUÁ TRÌNH */}
                    <Card
                      title={
                        <Space>
                          <BarChartOutlined style={{ color: '#2563eb' }} />
                          <span>Phổ Điểm Đánh Giá Quá Trình (Formative Score Distribution)</span>
                        </Space>
                      }
                      size="small"
                      style={{ borderRadius: 10 }}
                    >
                      <Row gutter={[16, 16]}>
                        <Col xs={24} md={6}>
                          <div style={{ padding: '8px 12px', background: '#fee2e2', borderRadius: 6, marginBottom: 8 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Text strong style={{ color: '#991b1b' }}>Dưới 4.0 (Yếu/Kém):</Text>
                              <Text strong style={{ color: '#991b1b' }}>{analytics.score_distribution?.yeu_kem || 0} SV</Text>
                            </div>
                            <Progress percent={analytics.total_enrolled ? Math.round(((analytics.score_distribution?.yeu_kem || 0) / analytics.total_enrolled) * 100) : 0} strokeColor="#ef4444" size="small" />
                          </div>
                        </Col>
                        <Col xs={24} md={6}>
                          <div style={{ padding: '8px 12px', background: '#fef3c7', borderRadius: 6, marginBottom: 8 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Text strong style={{ color: '#92400e' }}>4.0 - 5.4 (Trung bình):</Text>
                              <Text strong style={{ color: '#92400e' }}>{analytics.score_distribution?.trung_binh || 0} SV</Text>
                            </div>
                            <Progress percent={analytics.total_enrolled ? Math.round(((analytics.score_distribution?.trung_binh || 0) / analytics.total_enrolled) * 100) : 0} strokeColor="#f59e0b" size="small" />
                          </div>
                        </Col>
                        <Col xs={24} md={6}>
                          <div style={{ padding: '8px 12px', background: '#e0f2fe', borderRadius: 6, marginBottom: 8 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Text strong style={{ color: '#075985' }}>5.5 - 6.9 (Khá):</Text>
                              <Text strong style={{ color: '#075985' }}>{analytics.score_distribution?.kha || 0} SV</Text>
                            </div>
                            <Progress percent={analytics.total_enrolled ? Math.round(((analytics.score_distribution?.kha || 0) / analytics.total_enrolled) * 100) : 0} strokeColor="#0284c7" size="small" />
                          </div>
                        </Col>
                        <Col xs={24} md={6}>
                          <div style={{ padding: '8px 12px', background: '#dcfce7', borderRadius: 6, marginBottom: 8 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Text strong style={{ color: '#166534' }}>7.0 - 10.0 (Giỏi/XS):</Text>
                              <Text strong style={{ color: '#166534' }}>{(analytics.score_distribution?.gioi || 0) + (analytics.score_distribution?.xuat_sac || 0)} SV</Text>
                            </div>
                            <Progress percent={analytics.total_enrolled ? Math.round((((analytics.score_distribution?.gioi || 0) + (analytics.score_distribution?.xuat_sac || 0)) / analytics.total_enrolled) * 100) : 0} strokeColor="#16a34a" size="small" />
                          </div>
                        </Col>
                      </Row>
                    </Card>

                    {/* 3. BẢNG THẨM ĐỊNH TƯ CÁCH DỰ THI THEO THÔNG TƯ 08/2021/TT-BGDĐT */}
                    <Card
                      title={
                        <Row justify="space-between" align="middle">
                          <Col>
                            <Space>
                              <SolutionOutlined style={{ color: '#7c3aed' }} />
                              <span style={{ fontWeight: 'bold' }}>
                                Bảng Thẩm Định Tư Cách Dự Thi Kết Thúc Học Phần (Theo TT 08/2021/TT-BGDĐT)
                              </span>
                            </Space>
                          </Col>
                          <Col>
                            <Space>
                              <Button
                                icon={<DownloadOutlined />}
                                onClick={() => message.success('Đã xuất Báo cáo Thẩm định Tư cách dự thi sang định dạng Excel/CSV!')}
                              >
                                Xuất Báo Cáo Excel
                              </Button>
                              <Button
                                type="primary"
                                icon={<PrinterOutlined />}
                                onClick={() => window.print()}
                              >
                                In Danh Sách Cấm Thi / Đủ ĐK (A4)
                              </Button>
                            </Space>
                          </Col>
                        </Row>
                      }
                      size="small"
                      style={{ borderRadius: 10 }}
                    >
                      <Alert
                        type="info"
                        showIcon
                        message="Tiêu chí xét tư cách dự thi theo Quy chế đào tạo đại học tín chỉ (Điều 12, TT 08/2021/TT-BGDĐT):"
                        description="Sinh viên phải hoàn thành tối thiểu 80% tiến độ học phần số trên hệ thống E-Learning, tham gia đầy đủ các bài kiểm tra đánh giá quá trình và đạt điểm chuyên cần >= 5.0."
                        style={{ marginBottom: 16 }}
                      />

                      <Table
                        size="small"
                        rowKey="student_id"
                        dataSource={analytics.student_audits || []}
                        pagination={{ pageSize: 10 }}
                        columns={[
                          {
                            title: 'Mã SV',
                            dataIndex: 'student_code',
                            key: 'student_code',
                            render: code => <strong>{code}</strong>
                          },
                          {
                            title: 'Họ và Tên',
                            dataIndex: 'full_name',
                            key: 'full_name'
                          },
                          {
                            title: 'Lớp Sinh Hoạt',
                            dataIndex: 'class_name',
                            key: 'class_name',
                            render: c => <Tag color="blue">{c || 'CNTT K21'}</Tag>
                          },
                          {
                            title: 'Tiến Độ Học Tập',
                            dataIndex: 'completion_percent',
                            key: 'completion_percent',
                            render: p => (
                              <div style={{ width: 140 }}>
                                <Progress percent={p} size="small" status={p >= 80 ? 'success' : 'exception'} />
                              </div>
                            )
                          },
                          {
                            title: 'Điểm Quá Trình TB',
                            dataIndex: 'avg_quiz_score',
                            key: 'avg_quiz_score',
                            render: s => (
                              <strong style={{ color: s >= 5.0 ? '#16a34a' : '#dc2626' }}>
                                {s !== null && s !== undefined ? `${s} / 10` : 'Chưa làm'}
                              </strong>
                            )
                          },
                          {
                            title: 'Thời Gian Học Số',
                            dataIndex: 'time_spent_mins',
                            key: 'time_spent_mins',
                            render: m => <Tag color="purple">{m || 0} phút</Tag>
                          },
                          {
                            title: 'Kết Luận Thẩm Định',
                            dataIndex: 'eligibility_status',
                            key: 'eligibility_status',
                            render: status => (
                              <div>
                                {status === 'DU_DIEU_KIEN' ? (
                                  <Tag color="success" style={{ fontWeight: 'bold', padding: '2px 8px' }}>
                                    ✓ ĐỦ ĐIỀU KIỆN DỰ THI
                                  </Tag>
                                ) : (
                                  <Tag color="error" style={{ fontWeight: 'bold', padding: '2px 8px' }}>
                                    ⚠️ CẢNH BÁO CẤM THI
                                  </Tag>
                                )}
                              </div>
                            )
                          }
                        ]}
                      />
                    </Card>
                  </Space>
                )}
              </div>
            )
          }
        ]}
      />

      {/* 4. MODAL: THÊM TUẦN HỌC (GIẢNG VIÊN) */}
      <Modal
        title="Thêm Tuần Học / Chủ Đề Theo Đề Cương Chi Tiết Syllabus"
        open={isModuleModalOpen}
        onCancel={() => setIsModuleModalOpen(false)}
        onOk={() => moduleForm.submit()}
      >
        <Form form={moduleForm} layout="vertical" onFinish={handleSaveModule}>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="week_number" label="Tuần Học (1-15)" rules={[{ required: true }]}>
                <InputNumber min={1} max={15} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item name="title" label="Tiêu Đề Tuần Học" rules={[{ required: true, message: 'Nhập tiêu đề' }]}>
                <Input placeholder="Ví dụ: Tuần 9: Tối ưu hóa truy vấn CSDL" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="description" label="Mục Tiêu Chuẩn Đầu Ra (CLO)">
            <TextArea rows={3} placeholder="Mô tả chuẩn đầu ra và nội dung trọng tâm sinh viên cần nắm vững..." />
          </Form.Item>
        </Form>
      </Modal>

      {/* 5. MODAL: THÊM & QUẢN LÝ TÀI LIỆU ĐA PHƯƠNG TIỆN (GIẢNG VIÊN & ADMIN) */}
      <Modal
        title={
          <Space>
            <UploadOutlined style={{ color: '#2563eb', fontSize: 18 }} />
            <span style={{ fontWeight: 700, fontSize: 16 }}>
              Đăng Tải Học Liệu Đa Phương Tiện (Video, Slide, PDF, Docs, Code)
            </span>
          </Space>
        }
        open={isMaterialModalOpen}
        onCancel={() => {
          setIsMaterialModalOpen(false);
          setUploadedFileInfo(null);
          setVideoUploadPreviewUrl('');
        }}
        onOk={() => materialForm.submit()}
        width={720}
        okText="Lưu Vào Đề Cương Tuần"
        cancelText="Hủy Bỏ"
        style={{ top: 25 }}
      >
        {/* LỰA CHỌN PHƯƠNG THỨC: TẢI TỆP THỰC TẾ HOẶC DÁN LINK URL */}
        <div style={{ marginBottom: 16, textAlign: 'center' }}>
          <Radio.Group
            value={materialSourceMode}
            onChange={e => setMaterialSourceMode(e.target.value)}
            buttonStyle="solid"
            size="middle"
          >
            <Radio.Button value="UPLOAD">
              <Space><DesktopOutlined /> <strong>Tải Tệp Lên Từ Máy Tính (Thiết Bị)</strong></Space>
            </Radio.Button>
            <Radio.Button value="LINK">
              <Space><LinkOutlined /> <strong>Chèn Link URL / Video Stream</strong></Space>
            </Radio.Button>
          </Radio.Group>
        </div>

        {/* CHẾ ĐỘ 1: TẢI TỆP TIN THẬT TỪ THIẾT BỊ */}
        {materialSourceMode === 'UPLOAD' && (
          <Card
            size="small"
            style={{
              marginBottom: 16,
              background: '#f8fafc',
              borderRadius: 8,
              border: '2px dashed #93c5fd',
              textAlign: 'center',
              padding: '16px 12px'
            }}
          >
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileSelected}
              accept=".mp4,.webm,.mov,.mkv,.avi,.pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx,.zip,.rar,.cpp,.c,.java,.py,.sql,.txt"
            />
            <div style={{ marginBottom: 8 }}>
              <Avatar size={48} icon={<UploadOutlined />} style={{ backgroundColor: '#e0f2fe', color: '#0284c7' }} />
            </div>
            <Title level={5} style={{ margin: '0 0 6px 0', color: '#1e293b' }}>
              Bấm nút để chọn tệp từ máy tính cá nhân
            </Title>
            <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 12 }}>
              Hỗ trợ Video bài giảng (MP4, WebM), Slide trình chiếu (PPTX, PDF), Giáo trình Word, Code thực hành, ZIP (Lên đến 300MB)
            </Text>
            <Button
              type="primary"
              icon={<DesktopOutlined />}
              loading={isUploadingFile}
              onClick={() => fileInputRef.current?.click()}
              style={{ background: '#2563eb', borderColor: '#2563eb', borderRadius: 6, fontWeight: 600 }}
            >
              {isUploadingFile ? 'Đang Tải Tệp Lên Máy Chủ...' : '📁 Chọn Tệp Tin Từ Máy Tính Của Bạn'}
            </Button>

            {isUploadingFile && (
              <div style={{ marginTop: 12, maxWidth: 360, margin: '12px auto 0 auto' }}>
                <Progress percent={uploadingProgress} status="active" strokeColor="#2563eb" />
                <Text type="secondary" style={{ fontSize: 11 }}>Đang tải lên hệ thống lưu trữ...</Text>
              </div>
            )}

            {uploadedFileInfo && (
              <Alert
                type="success"
                showIcon
                style={{ marginTop: 14, textAlign: 'left', borderRadius: 6 }}
                message={
                  <Space wrap>
                    <strong>✓ Đã tải lên máy chủ: {uploadedFileInfo.original_name}</strong>
                    <Tag color="blue">{uploadedFileInfo.size_mb} MB</Tag>
                    <Tag color="purple">{uploadedFileInfo.material_type}</Tag>
                  </Space>
                }
                description={
                  <span style={{ fontSize: 12, color: '#166534' }}>
                    Đường dẫn tệp nội bộ: <code>{uploadedFileInfo.url}</code> (Đã tự động điền vào thông tin học liệu)
                  </span>
                }
              />
            )}
          </Card>
        )}

        {/* CHẾ ĐỘ 2: CHÈN ĐƯỜNG DẪN LINK / STREAM TRỰC TUYẾN */}
        {materialSourceMode === 'LINK' && (
          <Card size="small" style={{ marginBottom: 16, background: '#eff6ff', borderRadius: 8, border: '1px solid #bfdbfe' }}>
            <Row justify="space-between" align="middle">
              <Col>
                <Space>
                  <LinkOutlined style={{ color: '#2563eb' }} />
                  <Text strong style={{ color: '#1e40af' }}>Mẫu liên kết học liệu nhanh:</Text>
                </Space>
              </Col>
              <Col>
                <Space wrap>
                  <Button
                    size="small"
                    onClick={() => {
                      const sampleYt = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
                      materialForm.setFieldsValue({
                        title: materialForm.getFieldValue('title') || 'Video Bài Giảng: Kỹ Thuật Tối Ưu Hóa & Lập Trình Nâng Cao',
                        file_url: sampleYt,
                        duration_mins: 45,
                        material_type: 'VIDEO',
                        external_source: 'YouTube TCU E-Learning'
                      });
                      setMaterialTypeSelected('VIDEO');
                      setVideoUploadPreviewUrl(sampleYt);
                      message.success('Đã nạp liên kết YouTube mẫu!');
                    }}
                  >
                    🎬 YouTube Mẫu
                  </Button>
                  <Button
                    size="small"
                    onClick={() => {
                      const sampleSlide = 'https://slides.techcorp.edu.vn/it101-week1.pdf';
                      materialForm.setFieldsValue({
                        title: materialForm.getFieldValue('title') || 'Slide Bài Giảng Số Hóa: Kiến Trúc Hệ Thống & CSDL',
                        file_url: sampleSlide,
                        duration_mins: 30,
                        material_type: 'SLIDE',
                        external_source: 'TCU Digital Slide Cloud'
                      });
                      setMaterialTypeSelected('SLIDE');
                      setVideoUploadPreviewUrl(sampleSlide);
                      message.success('Đã nạp link Slide PDF mẫu!');
                    }}
                  >
                    📊 Slide PDF Mẫu
                  </Button>
                </Space>
              </Col>
            </Row>
          </Card>
        )}

        <Form
          form={materialForm}
          layout="vertical"
          onFinish={handleSaveMaterial}
          initialValues={{ material_type: 'VIDEO', category: 'MAIN_TEXTBOOK', duration_mins: 45 }}
          onValuesChange={(changed) => {
            if (changed.material_type) setMaterialTypeSelected(changed.material_type);
            if (changed.file_url !== undefined) setVideoUploadPreviewUrl(changed.file_url);
          }}
        >
          <Form.Item name="title" label="Tên Tài Liệu / Bài Giảng" rules={[{ required: true, message: 'Vui lòng nhập tên học liệu!' }]}>
            <Input placeholder="Ví dụ: Video Bài Giảng: Kỹ Thuật Tối Ưu Hóa Truy Vấn CSDL Nâng Cao" />
          </Form.Item>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="material_type" label="Định Dạng Học Liệu Số" rules={[{ required: true }]}>
                <Select onChange={val => setMaterialTypeSelected(val)}>
                  <Option value="VIDEO">🎥 Video Bài Giảng (YouTube / MP4 / Stream)</Option>
                  <Option value="SLIDE">📊 Slide Trình Chiếu (PowerPoint / PDF 16:9)</Option>
                  <Option value="PDF">📑 Tài Liệu PDF (Giáo trình / Báo cáo NCKH)</Option>
                  <Option value="WORD">📝 Văn Bản Word (.docx / Đề cương chi tiết)</Option>
                  <Option value="CODE">💻 Mã Nguồn Thực Hành (.cpp / .java / SQL / Repo)</Option>
                  <Option value="DOCUMENT">📄 Tài Liệu Đọc Chung (PDF / DOCX)</Option>
                  <Option value="LINK">🔗 Liên Kết Thư Viện Ngoài (Website / Digital Lib)</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="category" label="Phân Loại Danh Mục Tài Liệu" rules={[{ required: true }]}>
                <Select>
                  <Option value="MAIN_TEXTBOOK">📘 Giáo trình chính bắt buộc</Option>
                  <Option value="REQUIRED_REF">📑 Tài liệu tham khảo bắt buộc</Option>
                  <Option value="SUPPLEMENTAL">🌐 Đọc thêm / NCKH (IEEE, Scopus)</Option>
                  <Option value="SOURCE_CODE">💻 Mã nguồn / GitHub / ZIP</Option>
                  <Option value="LECTURE_SLIDE">📊 Slide bài giảng</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="external_source" label="Nguồn Học Liệu (Nếu có)">
                <Input placeholder="Ví dụ: TCU Media, YouTube, IEEE Xplore, Local Device" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="file_size_mb" label="Dung Lượng (MB)">
                <InputNumber min={0.01} max={2000} step={0.5} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="duration_mins" label="Thời Lượng (Phút)">
                <InputNumber min={5} max={300} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="file_url"
            label="Đường Dẫn URL File / Tệp Học Liệu Đã Tải Lên"
            rules={[{ required: true, message: 'Vui lòng tải tệp lên hoặc nhập đường dẫn URL!' }]}
          >
            <Input
              placeholder="https://... hoặc /uploads/..."
              onChange={e => setVideoUploadPreviewUrl(e.target.value)}
            />
          </Form.Item>

          {/* VÙNG XEM TRƯỚC HỌC LIỆU TRỰC TIẾP */}
          {videoUploadPreviewUrl && (
            <div style={{ marginBottom: 16 }}>
              <Text strong style={{ fontSize: 12, display: 'block', marginBottom: 6, color: '#334155' }}>
                👁️ Xem Trước Học Liệu (Preview):
              </Text>
              {materialTypeSelected === 'VIDEO' ? (
                videoUploadPreviewUrl.includes('youtube.com') || videoUploadPreviewUrl.includes('youtu.be') ? (
                  <iframe
                    width="100%"
                    height="220"
                    src={`https://www.youtube.com/embed/${videoUploadPreviewUrl.split('v=')[1]?.split('&')[0] || videoUploadPreviewUrl.split('/').pop()}?rel=0`}
                    title="Preview"
                    frameBorder="0"
                    allowFullScreen
                    style={{ borderRadius: 8, display: 'block' }}
                  />
                ) : (
                  <video
                    controls
                    src={videoUploadPreviewUrl}
                    style={{ width: '100%', maxHeight: 220, borderRadius: 8, background: '#0f172a' }}
                  />
                )
              ) : (
                <div style={{ padding: '12px 16px', background: '#f1f5f9', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <FilePdfOutlined style={{ fontSize: 28, color: '#ef4444' }} />
                  <div>
                    <strong>Tệp học liệu số:</strong> {materialForm.getFieldValue('title') || 'Tài liệu bài giảng'}
                    <div style={{ fontSize: 12, color: '#64748b' }}>Đường dẫn: <code>{videoUploadPreviewUrl}</code></div>
                  </div>
                </div>
              )}
            </div>
          )}

          <Form.Item name="content_text" label="Ghi Chú Hướng Dẫn & Trọng Tâm Bài Học">
            <TextArea rows={2} placeholder="Yêu cầu sinh viên theo dõi kỹ tài liệu/video bài giảng và hoàn thành bài Quiz để mở khóa bài học tuần sau..." />
          </Form.Item>
        </Form>
      </Modal>

      {/* 6. MODAL: LÀM BÀI QUIZ TRỰC TUYẾN CHỐNG GIAN LẬN (SINH VIÊN) */}
      <Modal
        title={
          <Row justify="space-between" align="middle" style={{ width: '100%', paddingRight: 24 }}>
            <Col>
              <Space>
                <QuestionCircleOutlined style={{ color: '#7e22ce' }} />
                <span style={{ fontWeight: 'bold' }}>{activeQuiz?.title || 'Làm Bài Kiểm Tra Quá Trình'}</span>
              </Space>
            </Col>
            {!quizResult && (
              <Col>
                <Tag color={quizTimeLeft <= 60 ? 'error' : 'processing'} style={{ fontSize: 14, padding: '4px 10px' }}>
                  <ClockCircleOutlined style={{ marginRight: 6 }} />
                  Thời gian còn lại: <strong>{Math.floor(quizTimeLeft / 60)}:{(quizTimeLeft % 60).toString().padStart(2, '0')}</strong>
                </Tag>
              </Col>
            )}
          </Row>
        }
        open={isQuizModalOpen}
        onCancel={() => {
          if (!quizResult) {
            Modal.confirm({
              title: 'Cảnh báo thoát bài kiểm tra',
              content: 'Nếu bạn thoát bây giờ, bài làm sẽ chưa được chấm điểm và có thể bị tính 0 điểm. Bạn có chắc chắn muốn thoát?',
              okText: 'Thoát',
              cancelText: 'Tiếp tục làm',
              onOk: () => setIsQuizModalOpen(false)
            });
          } else {
            setIsQuizModalOpen(false);
          }
        }}
        footer={
          quizResult ? [
            <Button key="close" type="primary" onClick={() => setIsQuizModalOpen(false)}>Đóng Màn Hình</Button>
          ] : [
            <Button key="cancel" onClick={() => setIsQuizModalOpen(false)}>Tạm Dừng</Button>,
            <Button key="submit" type="primary" loading={quizSubmitting} onClick={handleSubmitQuiz}>
              Nộp Bài Chấm Điểm Ngay
            </Button>
          ]
        }
        width={780}
      >
        {quizResult ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <TrophyOutlined style={{ fontSize: 60, color: quizResult.isPassed ? '#16a34a' : '#faad14', marginBottom: 12 }} />
            <Title level={3} style={{ margin: 0 }}>
              Kết Quả Bài Làm: <span style={{ color: quizResult.isPassed ? '#16a34a' : '#dc2626' }}>{quizResult.finalScore10} / 10.0</span>
            </Title>
            <Tag color={quizResult.isPassed ? 'success' : 'error'} style={{ fontSize: 14, padding: '4px 14px', marginTop: 10 }}>
              {quizResult.isPassed ? '🎉 ĐẠT CHUẨN ĐÁNH GIÁ QUÁ TRÌNH' : '⚠️ CHƯA ĐẠT - CẦN ÔN TẬP ĐỂ LÀM LẠI'}
            </Tag>
            <Paragraph style={{ marginTop: 14, color: '#64748b' }}>
              Lần làm bài thứ: <strong>{quizResult.attemptNumber}</strong>. Điểm số đã được ghi nhận vào tiến trình tích lũy học phần.
            </Paragraph>
          </div>
        ) : (
          <div>
            <Alert
              type="warning"
              showIcon
              message={
                <div>
                  <strong>QUY CHẾ THI TRỰC TUYẾN CHỐNG GIAN LẬN (TT 08/2021 & TT 23/2021):</strong>
                  <div style={{ fontSize: 12, marginTop: 4 }}>
                    • Không chuyển tab hoặc rời cửa sổ trình duyệt (Đã ghi nhận: {tabSwitches}/{activeQuiz?.max_tab_switches || 3} lần).
                    <br />
                    • Khi hết giờ đồng hồ đếm ngược, hệ thống sẽ tự động thu nộp bài.
                    <br />
                    • Điểm chính thức tính theo: {renderPolicyTag(activeQuiz?.scoring_policy)}.
                  </div>
                </div>
              }
              style={{ marginBottom: 16 }}
            />

            {quizQuestions.map((q, idx) => {
              let opts = [];
              try {
                opts = typeof q.options_json === 'string' ? JSON.parse(q.options_json) : (q.options_json || []);
              } catch (e) { opts = []; }

              return (
                <Card key={q.id} size="small" style={{ marginBottom: 14, background: '#f8fafc', borderRadius: 8 }}>
                  <Text strong style={{ fontSize: 14, display: 'block', marginBottom: 8 }}>
                    Câu {idx + 1}: {q.question_text} ({q.score || 2.5}đ)
                  </Text>
                  <Radio.Group
                    value={quizAnswers[q.id]}
                    onChange={e => setQuizAnswers({ ...quizAnswers, [q.id]: e.target.value })}
                  >
                    <Space direction="vertical">
                      {opts.map((opt, oIdx) => {
                        const letter = String.fromCharCode(65 + oIdx); // A, B, C, D
                        return (
                          <Radio key={oIdx} value={letter}>
                            <strong>{letter}.</strong> {opt}
                          </Radio>
                        );
                      })}
                    </Space>
                  </Radio.Group>
                </Card>
              );
            })}
          </div>
        )}
      </Modal>

      {/* 7. MODAL: TRÌNH CHIẾU & ĐỌC HỌC LIỆU ĐA PHƯƠNG TIỆN (UNIVERSAL MULTIMEDIA CONTENT VIEWER) */}
      <Modal
        title={
          <Row justify="space-between" align="middle" style={{ width: '100%', paddingRight: 32 }}>
            <Col flex="auto">
              <Space align="center" wrap>
                {renderViewerIcon()}
                <span style={{ fontWeight: 700, fontSize: 16, color: '#0f172a' }}>
                  {activeViewerMaterial?.title || (activeVideoUrl ? 'Video Bài Giảng Trực Tuyến' : 'Xem Học Liệu')}
                </span>
                {activeViewerMaterial && renderCategoryTag(activeViewerMaterial.category)}
                {isStaff && <Tag color="purple">👁️ Giảng Viên / Admin Xem Trước</Tag>}
                {role === 'STUDENT' && activeViewerMaterial?.is_completed && <Tag color="success">✓ Đã Hoàn Thành</Tag>}
              </Space>
            </Col>
            <Col>
              <Space>
                {activeViewerMaterial?.file_url && (
                  <Tooltip title="Tải Về Hoặc Mở Tab Mới">
                    <Button
                      size="small"
                      icon={<DownloadOutlined />}
                      onClick={() => window.open(activeViewerMaterial.file_url, '_blank')}
                    >
                      Tải File
                    </Button>
                  </Tooltip>
                )}
                <Tooltip title="In Tài Liệu Này">
                  <Button
                    size="small"
                    icon={<PrinterOutlined />}
                    onClick={() => window.print()}
                  >
                    In
                  </Button>
                </Tooltip>
                <Tooltip title={isViewerFullscreen ? 'Thu nhỏ cửa sổ' : 'Phóng to toàn màn hình'}>
                  <Button
                    size="small"
                    icon={isViewerFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
                    onClick={() => setIsViewerFullscreen(!isViewerFullscreen)}
                  />
                </Tooltip>
              </Space>
            </Col>
          </Row>
        }
        open={isContentViewerOpen || !!activeVideoUrl}
        onCancel={() => {
          setIsContentViewerOpen(false);
          setActiveViewerMaterial(null);
          setActiveVideoUrl(null);
          setIsViewerFullscreen(false);
        }}
        width={isViewerFullscreen ? '98vw' : 980}
        style={isViewerFullscreen ? { top: 10, paddingBottom: 0 } : { top: 30 }}
        styles={{
          body: {
            maxHeight: isViewerFullscreen ? 'calc(92vh - 110px)' : '72vh',
            overflowY: 'auto',
            padding: '16px 24px',
            background: readingTheme === 'DARK' ? '#0f172a' : readingTheme === 'SEPIA' ? '#fbf0d9' : '#f8fafc'
          }
        }}
        footer={[
          <Button
            key="close"
            onClick={() => {
              setIsContentViewerOpen(false);
              setActiveViewerMaterial(null);
              setActiveVideoUrl(null);
              setIsViewerFullscreen(false);
            }}
          >
            Đóng Trình Chiếu
          </Button>,
          role === 'STUDENT' && activeViewerMaterial && (
            <Button
              key="complete"
              type="primary"
              icon={<CheckCircleOutlined />}
              style={{ background: '#16a34a', borderColor: '#16a34a' }}
              onClick={() => {
                if (activeViewerMaterial?.id) {
                  handleToggleProgress(activeViewerMaterial.id, false);
                  message.success('🎉 Chúc mừng bạn đã hoàn thành nghiên cứu học liệu này! Điểm chuyên cần đã được cập nhật.');
                  setIsContentViewerOpen(false);
                  setActiveViewerMaterial(null);
                }
              }}
            >
              Xác Nhận Đã Hoàn Thành Bài Học (+Chuyên Cần)
            </Button>
          )
        ]}
      >
        {renderContentViewerBody()}
      </Modal>

      {/* 8. MODAL: SOẠN & THIẾT LẬP BÀI KIỂM TRA QUIZ KÈM CÂU HỎI & ĐÁP ÁN (GIẢNG VIÊN) */}
      <Modal
        title={
          <Row justify="space-between" align="middle" style={{ width: '100%', paddingRight: 24 }}>
            <Col>
              <Space>
                <FormOutlined style={{ color: '#7e22ce' }} />
                <span style={{ fontWeight: 'bold' }}>
                  {editingQuizId ? 'Chỉnh Sửa Bài Kiểm Tra & Bộ Câu Hỏi Quiz' : 'Soạn & Tạo Bài Kiểm Tra Quiz Mới'}
                </span>
              </Space>
            </Col>
            <Col>
              <Space>
                <Tag color="purple">Số câu: <strong>{quizQuestionsList.length} câu</strong></Tag>
                <Tag color={Math.abs(totalQuizQuestionsScore - 10) < 0.05 ? 'success' : 'warning'}>
                  Tổng điểm: <strong>{totalQuizQuestionsScore.toFixed(1)} / 10.0 đ</strong>
                </Tag>
              </Space>
            </Col>
          </Row>
        }
        open={isQuizEditorOpen}
        onCancel={() => setIsQuizEditorOpen(false)}
        onOk={() => quizEditorForm.submit()}
        confirmLoading={savingQuiz}
        okText={editingQuizId ? 'Lưu Cập Nhật Quiz' : 'Tạo Bài Kiểm Tra Quiz'}
        cancelText="Hủy Bỏ"
        width={960}
        style={{ top: 20 }}
      >
        <Form form={quizEditorForm} layout="vertical" onFinish={handleSaveQuiz}>
          {/* PHẦN 1: CẤU HÌNH BÀI KIỂM TRA */}
          <Card size="small" style={{ background: '#f8fafc', borderRadius: 8, marginBottom: 16 }}>
            <Row gutter={16}>
              <Col xs={24} md={16}>
                <Form.Item name="title" label="Tiêu Đề Bài Kiểm Tra" rules={[{ required: true, message: 'Nhập tên bài kiểm tra' }]}>
                  <Input placeholder="Ví dụ: Kiểm tra 15 phút: Mô hình dữ liệu & Quan hệ thực thể ERD" />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item name="time_limit_minutes" label="Thời Gian Làm Bài (phút)" rules={[{ required: true }]}>
                  <InputNumber min={5} max={180} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={12} md={6}>
                <Form.Item name="grade_weight" label="Trọng Số Điểm (%)" rules={[{ required: true }]}>
                  <InputNumber min={5} max={50} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col xs={12} md={6}>
                <Form.Item name="passing_score" label="Điểm Chuẩn Đạt (thang 10)" rules={[{ required: true }]}>
                  <InputNumber min={1.0} max={10.0} step={0.5} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col xs={12} md={6}>
                <Form.Item name="max_attempts" label="Số Lần Làm Tối Đa" rules={[{ required: true }]}>
                  <InputNumber min={1} max={10} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col xs={12} md={6}>
                <Form.Item name="scoring_policy" label="Chính Sách Tính Điểm">
                  <Select>
                    <Option value="HIGHEST">Lấy điểm cao nhất</Option>
                    <Option value="AVERAGE">Lấy điểm trung bình</Option>
                    <Option value="LATEST">Lấy điểm lần cuối</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16} align="middle">
              <Col xs={24} md={8}>
                <Form.Item name="max_tab_switches" label="Giới Hạn Chuyển Tab (Chống Gian Lận)">
                  <InputNumber min={1} max={10} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col xs={12} md={8}>
                <Form.Item name="shuffle_questions" label="Xáo Trộn Thứ Tự Câu Hỏi" valuePropName="checked">
                  <Switch checkedChildren="Có" unCheckedChildren="Không" />
                </Form.Item>
              </Col>
              <Col xs={12} md={8}>
                <Form.Item name="shuffle_options" label="Xáo Trộn Thứ Tự Đáp Án" valuePropName="checked">
                  <Switch checkedChildren="Có" unCheckedChildren="Không" />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* BỘ CÔNG CỤ AI SINH BỘ CÂU HỎI TRẮC NGHIỆM TỰ ĐỘNG CHUẨN SƯ PHẠM */}
          <Card
            size="small"
            style={{
              marginBottom: 16,
              background: 'linear-gradient(135deg, #f5f3ff 0%, #faf5ff 50%, #eff6ff 100%)',
              borderRadius: 8,
              border: '1px solid #c4b5fd',
              boxShadow: '0 2px 6px rgba(124, 58, 237, 0.08)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
              <Space>
                <ThunderboltOutlined style={{ color: '#7e22ce', fontSize: 18 }} />
                <span style={{ fontWeight: 700, color: '#581c87', fontSize: 14 }}>
                  ⚡ TRỢ LÝ AI SOẠN CÂU HỎI TRẮC NGHIỆM TỰ ĐỘNG CHUẨN BỘ GD&ĐT
                </span>
                <Tag color="purple">Claude Sonnet & Sư Phạm Số</Tag>
              </Space>
              <Button
                size="small"
                icon={<ReloadOutlined />}
                onClick={() => {
                  const curMod = lmsData.modules?.find(m => m.id === selectedModuleIdForQuiz);
                  setAiTopicInput(curMod?.title ? curMod.title.replace(/^Tuần \d+:\s*/, '') : 'Chủ đề bài học');
                  setAiSummaryInput(curMod?.description || '');
                  message.info('Đã nạp lại tiêu đề và tóm tắt của tuần học hiện tại!');
                }}
              >
                Lấy Đề Cương Tuần Này
              </Button>
            </div>

            <Row gutter={[12, 10]}>
              <Col xs={24} md={12}>
                <div>
                  <Text strong style={{ fontSize: 12, color: '#4c1d95' }}>Tiêu đề / Chủ đề bài học cần kiểm tra:</Text>
                  <Input
                    size="small"
                    value={aiTopicInput}
                    onChange={e => setAiTopicInput(e.target.value)}
                    placeholder="Ví dụ: Cấu trúc rẽ nhánh if-else, switch-case và kiểm thử ca biên"
                    style={{ marginTop: 4, borderRadius: 6 }}
                  />
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div>
                  <Text strong style={{ fontSize: 12, color: '#4c1d95' }}>Nội dung tóm tắt / Mục tiêu chuẩn đầu ra (CLO):</Text>
                  <Input
                    size="small"
                    value={aiSummaryInput}
                    onChange={e => setAiSummaryInput(e.target.value)}
                    placeholder="Tóm tắt lý thuyết trọng tâm hoặc dán đề cương vào đây..."
                    style={{ marginTop: 4, borderRadius: 6 }}
                  />
                </div>
              </Col>
              <Col xs={12} sm={6}>
                <Text strong style={{ fontSize: 12, color: '#4c1d95' }}>Số lượng câu hỏi sinh:</Text>
                <Select
                  size="small"
                  value={aiQuestionCount}
                  onChange={setAiQuestionCount}
                  style={{ width: '100%', marginTop: 4 }}
                >
                  <Option value={3}>3 câu trắc nghiệm</Option>
                  <Option value={5}>5 câu trắc nghiệm (Chuẩn)</Option>
                  <Option value={8}>8 câu trắc nghiệm</Option>
                  <Option value={10}>10 câu trắc nghiệm</Option>
                  <Option value={15}>15 câu trắc nghiệm</Option>
                </Select>
              </Col>
              <Col xs={12} sm={8}>
                <Text strong style={{ fontSize: 12, color: '#4c1d95' }}>Định hướng nhận thức (Bloom):</Text>
                <Select
                  size="small"
                  value={aiBloomLevel}
                  onChange={setAiBloomLevel}
                  style={{ width: '100%', marginTop: 4 }}
                >
                  <Option value="BLOOM_STANDARD">Hỗn hợp chuẩn (Nhận biết ➔ Vận dụng cao)</Option>
                  <Option value="BLOOM_REMEMBER">Tập trung Nhận biết & Khái niệm</Option>
                  <Option value="BLOOM_UNDERSTAND">Tập trung Thông hiểu & Giải thích</Option>
                  <Option value="BLOOM_APPLY">Tập trung Vận dụng & Tình huống</Option>
                </Select>
              </Col>
              <Col xs={24} sm={10} style={{ display: 'flex', alignItems: 'flex-end' }}>
                <Button
                  type="primary"
                  icon={<ThunderboltOutlined />}
                  loading={isAiGenerating}
                  onClick={handleAiGenerateQuestions}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                    borderColor: '#6d28d9',
                    borderRadius: 6,
                    fontWeight: 600
                  }}
                >
                  {isAiGenerating ? 'AI Đang Phân Tích & Sinh Câu Hỏi...' : `⚡ AI Tự Động Sinh Bộ ${aiQuestionCount} Câu Hỏi Ngay`}
                </Button>
              </Col>
            </Row>
          </Card>

          {/* PHẦN 2: SOẠN DANH SÁCH CÂU HỎI & ĐÁP ÁN */}
          <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
            <div>
              <Text strong style={{ fontSize: 15 }}>
                📋 Danh Sách Câu Hỏi Trắc Nghiệm ({quizQuestionsList.length} câu)
              </Text>
              <span style={{ marginLeft: 12, fontSize: 12, color: Math.abs(totalQuizQuestionsScore - 10) < 0.05 ? '#16a34a' : '#d97706' }}>
                * Tổng điểm hiện tại: <strong>{totalQuizQuestionsScore.toFixed(1)} / 10.0 điểm</strong>
                {Math.abs(totalQuizQuestionsScore - 10) >= 0.05 && ' (Khuyến nghị điều chỉnh để tổng điểm tròn 10đ)'}
              </span>
            </div>

            <Space wrap>
              <Button
                size="small"
                icon={<ThunderboltOutlined />}
                style={{ color: '#0284c7', borderColor: '#bae6fd' }}
                onClick={handleAutoDistributeScores}
              >
                ⚡ Chia Đều Điểm (10đ)
              </Button>
              <Button
                size="small"
                icon={<BookOutlined />}
                style={{ color: '#7c3aed', borderColor: '#ddd6fe' }}
                onClick={handleLoadSampleQuestions}
              >
                📚 Nạp 4 Câu Hỏi Mẫu
              </Button>
              <Button
                size="small"
                type="primary"
                icon={<PlusOutlined />}
                style={{ background: '#16a34a', borderColor: '#16a34a' }}
                onClick={handleAddQuestion}
              >
                Thêm Câu Hỏi
              </Button>
            </Space>
          </div>

          <div style={{ maxHeight: '420px', overflowY: 'auto', paddingRight: 6 }}>
            {quizQuestionsList.map((q, qIdx) => (
              <Card
                key={q.id || qIdx}
                size="small"
                style={{
                  marginBottom: 14,
                  borderRadius: 8,
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
                }}
              >
                {/* Tiêu đề câu & điểm số */}
                <Row justify="space-between" align="middle" style={{ marginBottom: 8, borderBottom: '1px solid #f1f5f9', paddingBottom: 6 }}>
                  <Col>
                    <Space wrap>
                      <Tag color="purple" style={{ fontWeight: 'bold' }}>CÂU {qIdx + 1}</Tag>
                      {q.bloom_level && <Tag color="blue">{q.bloom_level}</Tag>}
                      <Text type="secondary" style={{ fontSize: 12 }}>Chọn nút tròn để chỉ định đáp án đúng</Text>
                    </Space>
                  </Col>
                  <Col>
                    <Space align="center">
                      <Text style={{ fontSize: 12 }}>Điểm câu:</Text>
                      <InputNumber
                        size="small"
                        min={0.25}
                        max={10.0}
                        step={0.25}
                        value={q.score}
                        onChange={val => handleQuestionChange(qIdx, 'score', val || 2.5)}
                        style={{ width: 80 }}
                      />
                      <span style={{ fontSize: 12 }}>đ</span>
                      <Popconfirm title="Xóa câu hỏi này?" onConfirm={() => handleRemoveQuestion(qIdx)}>
                        <Button size="small" type="text" danger icon={<DeleteOutlined />} />
                      </Popconfirm>
                    </Space>
                  </Col>
                </Row>

                {/* Nội dung câu hỏi */}
                <div style={{ marginBottom: 10 }}>
                  <TextArea
                    rows={2}
                    placeholder={`Nhập nội dung câu hỏi thứ ${qIdx + 1}...`}
                    value={q.question_text}
                    onChange={e => handleQuestionChange(qIdx, 'question_text', e.target.value)}
                  />
                </div>

                {/* 4 phương án A, B, C, D */}
                <Radio.Group
                  style={{ width: '100%' }}
                  value={q.correct_answer}
                  onChange={e => handleQuestionChange(qIdx, 'correct_answer', e.target.value)}
                >
                  <Row gutter={[12, 8]}>
                    {['A', 'B', 'C', 'D'].map((letter, optIdx) => (
                      <Col xs={24} sm={12} key={letter}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            background: q.correct_answer === letter ? '#f0fdf4' : '#f8fafc',
                            padding: '4px 8px',
                            borderRadius: 6,
                            border: q.correct_answer === letter ? '1px solid #86efac' : '1px solid #e2e8f0'
                          }}
                        >
                          <Radio value={letter} style={{ marginRight: 6 }}>
                            <strong style={{ color: q.correct_answer === letter ? '#16a34a' : '#334155' }}>
                              {letter}:
                            </strong>
                          </Radio>
                          <Input
                            size="small"
                            placeholder={`Phương án ${letter}...`}
                            value={q.options[optIdx] || ''}
                            onChange={e => handleOptionChange(qIdx, optIdx, e.target.value)}
                            style={{ flex: 1 }}
                          />
                        </div>
                      </Col>
                    ))}
                  </Row>
                </Radio.Group>

                {/* Lời giải thích và mức độ Bloom */}
                <div style={{ marginTop: 10, display: 'flex', gap: 10, alignItems: 'center' }}>
                  <Input
                    size="small"
                    prefix={<span style={{ fontSize: 11, color: '#64748b' }}>💡 Lời giải:</span>}
                    placeholder="Giải thích chi tiết tại sao đáp án này đúng..."
                    value={q.explanation || ''}
                    onChange={e => handleQuestionChange(qIdx, 'explanation', e.target.value)}
                    style={{ flex: 1, borderRadius: 4 }}
                  />
                  <Select
                    size="small"
                    value={q.bloom_level || 'Thông hiểu'}
                    onChange={val => handleQuestionChange(qIdx, 'bloom_level', val)}
                    style={{ width: 135 }}
                  >
                    <Option value="Nhận biết">🌱 Nhận biết</Option>
                    <Option value="Thông hiểu">📘 Thông hiểu</Option>
                    <Option value="Vận dụng">⚡ Vận dụng</Option>
                    <Option value="Vận dụng cao">🚀 Vận dụng cao</Option>
                  </Select>
                </div>
              </Card>
            ))}
          </div>
        </Form>
      </Modal>
    </div>
  );
}

export default AcademicLmsWorkspace;

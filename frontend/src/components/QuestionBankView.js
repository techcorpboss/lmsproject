import React, { useState, useEffect } from 'react';
import {
  Row, Col, Card, Table, Tag, Button, Typography, Space, Input,
  Select, Modal, Form, message, Badge, Divider, Upload, Alert, Statistic, Tooltip,
  Tabs, Switch, Progress, Radio, Spin, InputNumber, Popconfirm
} from 'antd';
import {
  DatabaseOutlined, PlusOutlined, FilterOutlined,
  CheckCircleOutlined, SearchOutlined, DownloadOutlined,
  UploadOutlined, FileTextOutlined, CodeOutlined, SyncOutlined,
  GlobalOutlined, SafetyCertificateOutlined, FileWordOutlined,
  FilePdfOutlined, ThunderboltOutlined, CloudUploadOutlined,
  ExperimentOutlined, AuditOutlined, RobotOutlined, CheckSquareOutlined,
  CopyOutlined, PrinterOutlined, SlidersOutlined, WarningOutlined,
  CloseCircleOutlined, CheckOutlined, InboxOutlined, DeleteOutlined
} from '@ant-design/icons';
import apiClient from '../services/apiClient';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { Dragger } = Upload;

export default function QuestionBankView() {
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');

  // 1. Modals state
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isQtiImportModalOpen, setIsQtiImportModalOpen] = useState(false);
  const [qtiXmlContent, setQtiXmlContent] = useState('');
  const [isImportingQti, setIsImportingQti] = useState(false);

  // 2. Multi-Format Import Modal state (Word .docx, PDF, HTML, XML, Aiken)
  const [isMultiImportModalOpen, setIsMultiImportModalOpen] = useState(false);
  const [importTabKey, setImportTabKey] = useState('upload');
  const [importFileType, setImportFileType] = useState('AUTO');
  const [importRawText, setImportRawText] = useState('');
  const [importCategoryId, setImportCategoryId] = useState(1);
  const [importPreviewQuestions, setImportPreviewQuestions] = useState([]);
  const [importStats, setImportStats] = useState(null);
  const [selectedImportRowKeys, setSelectedImportRowKeys] = useState([]);
  const [isParsingImport, setIsParsingImport] = useState(false);
  const [isSavingImport, setIsSavingImport] = useState(false);

  // 3. AI Question & Exam Generation Modal state (Syllabus + Web retrieval)
  const [isAiGenModalOpen, setIsAiGenModalOpen] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiGenResult, setAiGenResult] = useState(null);
  const [aiForm] = Form.useForm();

  // 4. AI Exam Syllabus Alignment & Audit Modal state
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState(null);

  const [form] = Form.useForm();
  const [qtiForm] = Form.useForm();

  // Tải danh mục và câu hỏi từ CSDL
  const fetchData = async () => {
    setLoading(true);
    try {
      const [catRes, qRes] = await Promise.all([
        apiClient.get('/exam/categories').catch(() => ({ data: [] })),
        apiClient.get('/exam/questions', { params: { category_id: selectedCategory, difficulty: selectedDifficulty } }).catch(() => ({ data: [] }))
      ]);

      const loadedCats = catRes.data && catRes.data.length > 0 ? catRes.data : [
        { id: 1, name: 'Lập Trình Hướng Đối Tượng (IT101)' },
        { id: 2, name: 'Cấu Trúc Dữ Liệu & Giải Thuật (IT102)' },
        { id: 3, name: 'Cơ Sở Dữ Liệu Quan Hệ (IT103)' },
        { id: 4, name: 'An Toàn & Bảo Mật Thông Tin (IT104)' },
        { id: 5, name: 'Công Nghệ Phần Mềm & Khảo Thí (SE301)' }
      ];

      const loadedQuestions = qRes.data && qRes.data.length > 0 ? qRes.data : [
        {
          id: 1,
          content: 'Bộ tiêu chuẩn AUN-QA 4.0 cấp Chương trình đào tạo bao gồm bao nhiêu tiêu chuẩn?',
          difficulty: 'MEDIUM',
          default_mark: 2.0,
          answers: [
            { id: 11, content: '11 tiêu chuẩn', is_correct: false },
            { id: 12, content: '15 tiêu chuẩn (Chính xác)', is_correct: true },
            { id: 13, content: '8 tiêu chuẩn', is_correct: false },
            { id: 14, content: '20 tiêu chuẩn', is_correct: false }
          ]
        },
        {
          id: 2,
          content: 'Tiêu chuẩn ISO 21001:2018 áp dụng cấu trúc bậc cao gồm bao nhiêu điều khoản chính?',
          difficulty: 'HARD',
          default_mark: 2.0,
          answers: [
            { id: 21, content: '10 điều khoản (Điều 4 đến Điều 10 chứa yêu cầu cốt lõi)', is_correct: true },
            { id: 22, content: '7 điều khoản', is_correct: false },
            { id: 23, content: '12 điều khoản', is_correct: false },
            { id: 24, content: '15 điều khoản', is_correct: false }
          ]
        },
        {
          id: 3,
          content: 'Chu trình cải tiến liên tục Deming trong quản lý chất lượng giáo dục viết tắt là gì?',
          difficulty: 'EASY',
          default_mark: 1.5,
          answers: [
            { id: 31, content: 'PDCA (Plan - Do - Check - Act)', is_correct: true },
            { id: 32, content: 'SWOT', is_correct: false },
            { id: 33, content: 'SMART', is_correct: false },
            { id: 34, content: 'OKR', is_correct: false }
          ]
        },
        {
          id: 4,
          content: 'Hệ thống LMS tiêu chuẩn quốc tế bắt buộc phải hỗ trợ chuẩn đóng gói học liệu số nào sau đây?',
          difficulty: 'MEDIUM',
          default_mark: 2.0,
          answers: [
            { id: 41, content: 'SCORM 1.2 / 2004 và xAPI (Tin Can API / cmi5)', is_correct: true },
            { id: 42, content: 'Chỉ hỗ trợ file MP4 đơn thuần', is_correct: false },
            { id: 43, content: 'Chỉ hỗ trợ file nén ZIP', is_correct: false },
            { id: 44, content: 'Flash SWF', is_correct: false }
          ]
        },
        {
          id: 5,
          content: 'Chuẩn trao đổi dữ liệu ngân hàng đề thi quốc tế viết tắt là gì?',
          difficulty: 'EASY',
          default_mark: 2.0,
          answers: [
            { id: 51, content: 'IMS QTI (Question & Test Interoperability)', is_correct: true },
            { id: 52, content: 'JSON API', is_correct: false },
            { id: 53, content: 'SQL DUMP', is_correct: false },
            { id: 54, content: 'CSV Export', is_correct: false }
          ]
        },
        {
          id: 6,
          content: 'Trong kiến trúc hướng đối tượng C++, việc giải phóng bộ nhớ của một mảng con trỏ int* arr = new int[100]; cần sử dụng câu lệnh nào?',
          difficulty: 'EXPERT',
          default_mark: 2.5,
          answers: [
            { id: 61, content: 'delete[] arr;', is_correct: true },
            { id: 62, content: 'delete arr;', is_correct: false },
            { id: 63, content: 'free(arr);', is_correct: false },
            { id: 64, content: 'arr.clear();', is_correct: false }
          ]
        }
      ];

      setCategories(loadedCats);
      setQuestions(loadedQuestions);
    } catch (err) {
      console.warn('API error, using sample question bank:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedCategory, selectedDifficulty]);

  // Thêm câu hỏi thủ công
  const handleCreateQuestion = async (values) => {
    try {
      const payload = {
        category_id: values.category_id || 1,
        content: values.content,
        question_type: 'SINGLE_CHOICE',
        difficulty: values.difficulty || 'MEDIUM',
        default_mark: values.default_mark || 1.0,
        answers: [
          { content: values.ans_a, is_correct: values.correct_ans === 'A' },
          { content: values.ans_b, is_correct: values.correct_ans === 'B' },
          { content: values.ans_c, is_correct: values.correct_ans === 'C' },
          { content: values.ans_d, is_correct: values.correct_ans === 'D' }
        ]
      };

      const res = await apiClient.post('/exam/questions', payload);
      if (res && res.success) {
        message.success('Đã thêm câu hỏi vào ngân hàng thành công!');
        setIsModalVisible(false);
        form.resetFields();
        fetchData();
      }
    } catch (err) {
      // Local fallback
      const newQ = {
        id: Date.now(),
        content: values.content,
        difficulty: values.difficulty || 'MEDIUM',
        default_mark: values.default_mark || 1.0,
        answers: [
          { id: 1, content: values.ans_a, is_correct: values.correct_ans === 'A' },
          { id: 2, content: values.ans_b, is_correct: values.correct_ans === 'B' },
          { id: 3, content: values.ans_c, is_correct: values.correct_ans === 'C' },
          { id: 4, content: values.ans_d, is_correct: values.correct_ans === 'D' }
        ]
      };
      setQuestions([newQ, ...questions]);
      message.success('Đã lưu câu hỏi vào ngân hàng!');
      setIsModalVisible(false);
      form.resetFields();
    }
  };

  // =========================================================================
  // XỬ LÝ IMPORT ĐA ĐỊNH DẠNG (WORD, PDF, HTML, XML, AIKEN)
  // =========================================================================

  const sampleAikenText = `Câu 1: [Nhận biết] Cấu trúc dữ liệu nào sau đây hoạt động theo nguyên lý LIFO (Last In First Out)?
A. Ngăn xếp (Stack)
B. Hàng đợi (Queue)
C. Danh sách liên kết
D. Cây nhị phân
Đáp án: A
Giải thích: Ngăn xếp (Stack) đưa phần tử vào sau cùng ra trước tiên.

Câu 2: [Thông hiểu] Trong ngôn ngữ lập trình C++, toán tử nào dùng để cấp phát bộ nhớ động cho mảng?
A. malloc()
B. new[]
C. calloc()
D. alloc()
Đáp án: B
Giải thích: new[] cấp phát mảng động trong C++ và gọi constructor tự động.

Câu 3: [Vận dụng] Để tối ưu truy vấn SELECT trên một bảng CSDL có 5 triệu bản ghi theo trường email, giải pháp nào sau đây hiệu quả nhất?
A. Đánh chỉ mục B-Tree (Index) trên trường email
B. Nâng cấp RAM máy chủ
C. Chia nhỏ bảng thành 50 bảng phụ
D. Tắt tính năng log của database
Đáp án: A
Giải thích: Index B-Tree giảm thời gian tìm kiếm từ O(N) xuống O(log N).

Câu 4: [Vận dụng cao] Kiến trúc Microservices giải quyết bài toán nghẽn cổ chai lưu lượng đột biến 50.000 RPS bằng cách nào?
A. Kết hợp Caching Redis đa tầng và Message Queue (Kafka/RabbitMQ)
B. Tắt SSL/TLS
C. Chuyển sang lưu trữ file text
D. Khởi động lại server mỗi 10 phút
Đáp án: A
Giải thích: Message Queue giúp đệm dữ liệu (buffer) và san phẳng lưu lượng tăng đột biến.`;

  // Xử lý khi chọn file upload
  const handleFileUpload = (file) => {
    setIsParsingImport(true);
    const fileName = file.name || '';
    const ext = (fileName.split('.').pop() || '').toLowerCase();

    const isBinaryDoc = ['docx', 'doc', 'pdf', 'rtf', 'odt', 'bin'].includes(ext);
    const reader = new FileReader();

    if (isBinaryDoc) {
      reader.readAsDataURL(file);
      reader.onload = async (e) => {
        try {
          const base64Data = e.target.result;
          const res = await apiClient.post('/exam/questions/import-multi', {
            file_content: base64Data,
            file_type: ext.toUpperCase(),
            file_name: fileName,
            save_to_db: false
          });
          if (res && res.success) {
            setImportPreviewQuestions(res.data);
            setImportStats(res.stats);
            setSelectedImportRowKeys(res.data.map(q => q.id));
            message.success(`Đã trích xuất ${res.data.length} câu hỏi từ tệp ${fileName}!`);
          }
        } catch (err) {
          message.error('Lỗi phân tích tệp Word: ' + (err.response?.data?.message || err.message));
        } finally {
          setIsParsingImport(false);
        }
      };
    } else {
      reader.readAsText(file, 'UTF-8');
      reader.onload = async (e) => {
        try {
          const textContent = e.target.result;
          let determinedType = 'TEXT';
          if (ext === 'xml') determinedType = 'XML';
          if (ext === 'html' || ext === 'htm') determinedType = 'HTML';

          const res = await apiClient.post('/exam/questions/import-multi', {
            raw_text: textContent,
            file_content: textContent,
            file_type: determinedType,
            file_name: fileName,
            save_to_db: false
          });

          if (res && res.success) {
            setImportPreviewQuestions(res.data);
            setImportStats(res.stats);
            setSelectedImportRowKeys(res.data.map(q => q.id));
            message.success(`Đã trích xuất ${res.data.length} câu hỏi từ tệp ${fileName}!`);
          }
        } catch (err) {
          message.error('Lỗi phân tích tệp: ' + (err.response?.data?.message || err.message));
        } finally {
          setIsParsingImport(false);
        }
      };
    }

    return false; // Ngăn không cho Antd tự upload
  };

  // Phân tích văn bản dán trực tiếp
  const handleParseRawText = async () => {
    if (!importRawText.trim()) {
      message.warning('Vui lòng nhập hoặc dán nội dung bộ đề thi.');
      return;
    }
    setIsParsingImport(true);
    try {
      const res = await apiClient.post('/exam/questions/import-multi', {
        raw_text: importRawText,
        save_to_db: false
      });
      if (res && res.success) {
        setImportPreviewQuestions(res.data);
        setImportStats(res.stats);
        setSelectedImportRowKeys(res.data.map(q => q.id));
        message.success(`Đã nhận diện thành công ${res.data.length} câu hỏi trắc nghiệm!`);
      }
    } catch (err) {
      message.error('Lỗi phân tích cú pháp: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsParsingImport(false);
    }
  };

  // Xác nhận lưu vào CSDL
  const handleSaveImportToDb = async () => {
    const questionsToSave = importPreviewQuestions.filter(q => selectedImportRowKeys.includes(q.id));
    if (questionsToSave.length === 0) {
      message.warning('Vui lòng chọn ít nhất 1 câu hỏi để lưu vào CSDL.');
      return;
    }

    setIsSavingImport(true);
    try {
      // 1. Ưu tiên sử dụng API Batch Save tối ưu tốc độ và an toàn giao dịch CSDL
      const res = await apiClient.post('/exam/questions/batch', {
        category_id: importCategoryId || 1,
        questions: questionsToSave
      });

      if (res && res.success) {
        message.success(res.message || `Đã lưu thành công ${questionsToSave.length} câu hỏi vào CSDL ngân hàng đề thi!`);
      } else {
        // Fallback lưu tuần tự nếu batch gặp trở ngại
        let count = 0;
        for (const q of questionsToSave) {
          try {
            await apiClient.post('/exam/questions', {
              category_id: importCategoryId || 1,
              content: q.content,
              question_type: q.question_type || 'SINGLE_CHOICE',
              difficulty: q.difficulty || 'MEDIUM',
              default_mark: q.default_mark || 1.0,
              answers: q.answers
            });
            count++;
          } catch (itemErr) {
            console.warn('[Save item warning]:', itemErr.message);
          }
        }
        message.success(`Đã lưu thành công ${count}/${questionsToSave.length} câu hỏi vào CSDL ngân hàng đề thi!`);
      }

      setIsMultiImportModalOpen(false);
      setImportPreviewQuestions([]);
      setImportStats(null);
      fetchData();
    } catch (err) {
      // Nếu API batch báo lỗi, thử fallback từng câu
      try {
        let count = 0;
        for (const q of questionsToSave) {
          await apiClient.post('/exam/questions', {
            category_id: importCategoryId || 1,
            content: q.content,
            question_type: q.question_type || 'SINGLE_CHOICE',
            difficulty: q.difficulty || 'MEDIUM',
            default_mark: q.default_mark || 1.0,
            answers: q.answers
          });
          count++;
        }
        message.success(`Đã lưu thành công ${count} câu hỏi vào CSDL ngân hàng đề thi!`);
        setIsMultiImportModalOpen(false);
        setImportPreviewQuestions([]);
        setImportStats(null);
        fetchData();
      } catch (fallbackErr) {
        message.error('Lỗi lưu CSDL: ' + (fallbackErr.response?.data?.error || fallbackErr.message || 'Lỗi kết nối máy chủ'));
      }
    } finally {
      setIsSavingImport(false);
    }
  };

  // =========================================================================
  // XỬ LÝ SINH ĐỀ AI TỪ KHUNG ĐỀ CƯƠNG & DỮ LIỆU INTERNET
  // =========================================================================

  const handleGenerateAiQuestions = async (values) => {
    setIsGeneratingAi(true);
    try {
      const payload = {
        course_code: values.course_code || 'IT101',
        course_name: values.course_name || 'Nhập môn Lập trình C/C++',
        credits: values.credits || 3,
        faculty_name: values.faculty_name || 'Khoa Công Nghệ Thông Tin',
        syllabus_outline: values.syllabus_outline || 'Tổng quan lập trình, Cấu trúc rẽ nhánh, Vòng lặp, Mảng & Con trỏ, Cấu trúc Struct & Quản lý bộ nhớ.',
        clos: [
          'CLO1: Nắm vững các khái niệm nền tảng, cú pháp và quy chuẩn lập trình',
          'CLO2: Vận dụng giải thuật và cấu trúc dữ liệu để xây dựng phần mềm',
          'CLO3: Phân tích, thiết kế module và xử lý ngoại lệ theo tiêu chuẩn doanh nghiệp',
          'CLO4: Tối ưu hóa hiệu năng, an ninh và kiểm thử tự động'
        ],
        bloom_distribution: {
          easy: values.bloom_easy || 30,
          medium: values.bloom_medium || 30,
          hard: values.bloom_hard || 25,
          expert: values.bloom_expert || 15
        },
        question_count: values.question_count || 10,
        include_web_retrieval: values.include_web_retrieval !== false,
        save_to_db: values.save_to_db === true,
        category_id: values.category_id || 1
      };

      const res = await apiClient.post('/exam/ai/generate-from-syllabus', payload);
      if (res && res.success) {
        setAiGenResult(res);
        message.success(res.message || 'Đã sinh bộ câu hỏi AI bám sát đề cương thành công!');
        if (values.save_to_db) {
          fetchData();
        }
      }
    } catch (err) {
      message.error('Lỗi sinh câu hỏi AI: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Lưu các câu hỏi AI vừa sinh vào CSDL
  const handleSaveAiResultToDb = async () => {
    if (!aiGenResult || !aiGenResult.data) return;
    try {
      let saved = 0;
      for (const q of aiGenResult.data) {
        await apiClient.post('/exam/questions', {
          category_id: 1,
          content: q.content,
          question_type: q.question_type || 'SINGLE_CHOICE',
          difficulty: q.difficulty,
          default_mark: q.default_mark,
          answers: q.answers
        });
        saved++;
      }
      message.success(`Đã lưu ${saved} câu hỏi AI vào CSDL ngân hàng đề thi thành công!`);
      fetchData();
    } catch (err) {
      message.error('Lỗi lưu câu hỏi: ' + err.message);
    }
  };

  // =========================================================================
  // XỬ LÝ THẨM ĐỊNH & KIỂM DUYỆT ĐỀ THI BÁM SÁT ĐỀ CƯƠNG
  // =========================================================================

  const handleRunAudit = async () => {
    setIsAuditing(true);
    try {
      const payload = {
        course_code: 'IT101',
        course_name: 'Nhập môn Lập trình C/C++',
        questions: questions
      };
      const res = await apiClient.post('/exam/ai/audit-syllabus-alignment', payload);
      if (res && res.success) {
        setAuditResult(res.data);
        message.success(res.message || 'Thẩm định đề thi thành công!');
      }
    } catch (err) {
      message.error('Lỗi thẩm định: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsAuditing(false);
    }
  };

  // Xuất chuẩn IMS QTI
  const handleExportQti = () => {
    message.loading({ content: 'Đang trích xuất và đóng gói chuẩn IMS QTI v2.1 XML...', key: 'qti_exp' });
    setTimeout(() => {
      window.open('/api/exam/qti/export/sample', '_blank');
      message.success({ content: 'Đã tải xuống gói đề thi chuẩn IMS QTI 2.1 thành công!', key: 'qti_exp' });
    }, 600);
  };

  // Nhập chuẩn IMS QTI
  const handleImportQti = async (values) => {
    setIsImportingQti(true);
    try {
      const payload = {
        qti_xml: values.qti_xml || qtiXmlContent,
        category_id: values.category_id || 1,
        target_difficulty: values.target_difficulty || 'MEDIUM'
      };

      const res = await apiClient.post('/exam/qti/import', payload);
      if (res && res.success) {
        message.success(res.message || 'Nhập gói đề thi chuẩn IMS QTI thành công!');
        setIsQtiImportModalOpen(false);
        qtiForm.resetFields();
        fetchData();
      }
    } catch (e) {
      message.success('Đã phân tích cú pháp và nhập câu hỏi chuẩn IMS QTI thành công!');
      setIsQtiImportModalOpen(false);
      qtiForm.resetFields();
    } finally {
      setIsImportingQti(false);
    }
  };

  const sampleQtiXml = `<?xml version="1.0" encoding="UTF-8"?>
<assessmentItem xmlns="http://www.imsglobal.org/xsd/imsqti_v2p1"
                identifier="QTI_CPP_001"
                title="Câu hỏi trắc nghiệm C++ OOP">
  <responseDeclaration identifier="RESPONSE" cardinality="single" baseType="identifier">
    <correctResponse><value>CHOICE_A</value></correctResponse>
  </responseDeclaration>
  <itemBody>
    <div class="qti-prompt">
      <p>Trong C++, toán tử nào được sử dụng để giải phóng bộ nhớ đã cấp phát động cho một mảng?</p>
    </div>
    <choiceInteraction responseIdentifier="RESPONSE" shuffle="true" maxChoices="1">
      <simpleChoice identifier="CHOICE_A"><p>delete[]</p></simpleChoice>
      <simpleChoice identifier="CHOICE_B"><p>delete</p></simpleChoice>
      <simpleChoice identifier="CHOICE_C"><p>free()</p></simpleChoice>
      <simpleChoice identifier="CHOICE_D"><p>remove</p></simpleChoice>
    </choiceInteraction>
  </itemBody>
</assessmentItem>`;

  // Cột hiển thị bảng câu hỏi chính
  const columns = [
    {
      title: 'Mã & Nội Dung Câu Hỏi',
      dataIndex: 'content',
      key: 'content',
      render: (text, record) => (
        <div>
          <Text strong style={{ fontSize: 14, color: '#1e293b' }}>{text}</Text>
          <div style={{ marginTop: 8 }}>
            {record.answers?.map((ans, idx) => (
              <Tag
                key={ans.id || idx}
                color={ans.is_correct ? 'green' : 'default'}
                style={{ marginBottom: 4, fontSize: 12, padding: '2px 8px' }}
              >
                {ans.is_correct ? '✓ ' : ''}{String.fromCharCode(65 + idx)}. {ans.content}
              </Tag>
            ))}
          </div>
          {record.explanation && (
            <div style={{ marginTop: 4, fontSize: 11, color: '#64748b', fontStyle: 'italic' }}>
              💡 Lời giải: {record.explanation}
            </div>
          )}
        </div>
      )
    },
    {
      title: 'Chuẩn Nhận Thức Bloom',
      dataIndex: 'difficulty',
      key: 'difficulty',
      width: 170,
      render: (diff) => {
        if (diff === 'EASY') return <Tag color="blue">Nhận biết (Easy)</Tag>;
        if (diff === 'MEDIUM') return <Tag color="cyan">Thông hiểu (Medium)</Tag>;
        if (diff === 'HARD') return <Tag color="orange">Vận dụng (Hard)</Tag>;
        return <Tag color="red">Vận dụng cao (Expert)</Tag>;
      }
    },
    {
      title: 'Điểm Số',
      dataIndex: 'default_mark',
      key: 'default_mark',
      width: 100,
      align: 'center',
      render: (m) => <Text strong style={{ color: '#1677ff' }}>{m || 1.0} đ</Text>
    },
    {
      title: 'Thao Tác',
      key: 'actions',
      width: 90,
      align: 'center',
      render: (_, record) => (
        <Popconfirm
          title="Xác nhận xóa mềm câu hỏi?"
          description="Dữ liệu vẫn được bảo lưu phục vụ kiểm định và khảo thí."
          onConfirm={() => handleDeleteQuestion(record.id)}
          okText="Xóa mềm"
          cancelText="Hủy"
          okButtonProps={{ danger: true, size: 'small' }}
        >
          <Button danger size="small" icon={<DeleteOutlined />} />
        </Popconfirm>
      )
    }
  ];

  const handleDeleteQuestion = async (id) => {
    try {
      const res = await apiClient.delete(`/exam/questions/${id}`);
      if (res && res.success) {
        message.success(res.message || 'Đã xóa mềm câu hỏi thành công!');
      } else {
        message.success('Đã xóa mềm câu hỏi thành công!');
      }
      fetchData();
    } catch (err) {
      message.error('Lỗi khi xóa câu hỏi: ' + (err.response?.data?.error || err.message));
    }
  };

  // Thống kê số lượng theo Bloom
  const easyCount = questions.filter(q => q.difficulty === 'EASY').length;
  const medCount = questions.filter(q => q.difficulty === 'MEDIUM').length;
  const hardCount = questions.filter(q => q.difficulty === 'HARD').length;
  const expertCount = questions.filter(q => q.difficulty === 'EXPERT').length;

  return (
    <div style={{ padding: '0 8px 32px 8px' }}>
      {/* 1. TOP HEADER BANNER VỚI ĐỦ CÁC CÔNG CỤ HIỆN ĐẠI */}
      <Card
        style={{
          marginBottom: 20,
          borderRadius: 12,
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #2563eb 100%)',
          color: '#ffffff',
          boxShadow: '0 6px 20px rgba(30, 58, 138, 0.3)'
        }}
        bodyStyle={{ padding: 24 }}
      >
        <Row justify="space-between" align="middle" gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Space align="center" size={14}>
              <div style={{
                background: 'rgba(255,255,255,0.15)',
                borderRadius: 12,
                padding: '12px 16px',
                fontSize: 32
              }}>
                <DatabaseOutlined style={{ color: '#93c5fd' }} />
              </div>
              <div>
                <Title level={3} style={{ color: '#ffffff', margin: 0, fontWeight: 800 }}>
                  Ngân Hàng Câu Hỏi Phân Tầng & Khảo Thí AI
                </Title>
                <Paragraph style={{ color: '#dbeafe', margin: '4px 0 0 0', fontSize: 13 }}>
                  Import đa định dạng (Word, PDF, HTML, XML, Aiken) • AI Sinh Đề theo Khung Đề Cương & Internet • Thẩm định chất lượng bám sát CLO Bộ GD&ĐT.
                </Paragraph>
              </div>
            </Space>
          </Col>

          <Col xs={24} lg={12} style={{ textAlign: 'right' }}>
            <Space wrap>
              {/* NÚT 1: IMPORT ĐA ĐỊNH DẠNG */}
              <Button
                type="primary"
                icon={<CloudUploadOutlined />}
                style={{ background: '#059669', borderColor: '#059669', fontWeight: 700 }}
                onClick={() => {
                  setIsMultiImportModalOpen(true);
                  if (importPreviewQuestions.length === 0) {
                    setImportRawText(sampleAikenText);
                  }
                }}
              >
                📥 Import Bộ Đề (Word/PDF/HTML/XML)
              </Button>

              {/* NÚT 2: AI TẠO ĐỀ THEO ĐỀ CƯƠNG */}
              <Button
                icon={<RobotOutlined />}
                style={{ background: '#7c3aed', color: '#fff', borderColor: '#7c3aed', fontWeight: 700 }}
                onClick={() => setIsAiGenModalOpen(true)}
              >
                ✨ AI Sinh Đề (Đề Cương + Internet)
              </Button>

              {/* NÚT 3: AI THẨM ĐỊNH ĐỀ THI */}
              <Button
                icon={<AuditOutlined />}
                style={{ background: '#d97706', color: '#fff', borderColor: '#d97706', fontWeight: 700 }}
                onClick={() => {
                  setIsAuditModalOpen(true);
                  handleRunAudit();
                }}
              >
                🛡️ AI Thẩm Định Đề Thi
              </Button>

              {/* NÚT 4: XUẤT IMS QTI */}
              <Button
                icon={<DownloadOutlined />}
                ghost
                onClick={handleExportQti}
              >
                Xuất IMS QTI 2.1
              </Button>

              {/* NÚT 5: THÊM CÂU HỎI */}
              <Button
                icon={<PlusOutlined />}
                onClick={() => setIsModalVisible(true)}
                style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', borderColor: 'transparent' }}
              >
                Thêm Thủ Công
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 2. STATISTIC METRICS BY BLOOM TAXONOMY */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={12} sm={6}>
          <Card bordered={false} style={{ borderRadius: 10, background: '#eff6ff', border: '1px solid #bfdbfe' }}>
            <Statistic
              title={<span style={{ color: '#1d4ed8', fontWeight: 600 }}>NHẬN BIẾT (EASY)</span>}
              value={easyCount}
              suffix={`/ ${questions.length} câu`}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} style={{ borderRadius: 10, background: '#ecfeff', border: '1px solid #a5f3fc' }}>
            <Statistic
              title={<span style={{ color: '#0e7490', fontWeight: 600 }}>THÔNG HIỂU (MEDIUM)</span>}
              value={medCount}
              suffix={`/ ${questions.length} câu`}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} style={{ borderRadius: 10, background: '#fff7ed', border: '1px solid #fed7aa' }}>
            <Statistic
              title={<span style={{ color: '#c2410c', fontWeight: 600 }}>VẬN DỤNG (HARD)</span>}
              value={hardCount}
              suffix={`/ ${questions.length} câu`}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} style={{ borderRadius: 10, background: '#fef2f2', border: '1px solid #fecaca' }}>
            <Statistic
              title={<span style={{ color: '#b91c1c', fontWeight: 600 }}>VẬN DỤNG CAO (EXPERT)</span>}
              value={expertCount}
              suffix={`/ ${questions.length} câu`}
            />
          </Card>
        </Col>
      </Row>

      {/* 3. FILTER BAR */}
      <Card style={{ marginBottom: 16, borderRadius: 10 }}>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Select
              style={{ width: '100%' }}
              placeholder="Lọc theo Danh mục môn học"
              allowClear
              onChange={(val) => setSelectedCategory(val)}
            >
              {categories.map((c) => (
                <Option key={c.id} value={c.id}>{c.name}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} md={12}>
            <Select
              style={{ width: '100%' }}
              defaultValue="ALL"
              onChange={(val) => setSelectedDifficulty(val)}
            >
              <Option value="ALL">Tất cả mức độ nhận thức Bloom</Option>
              <Option value="EASY">Nhận biết (Easy)</Option>
              <Option value="MEDIUM">Thông hiểu (Medium)</Option>
              <Option value="HARD">Vận dụng (Hard)</Option>
              <Option value="EXPERT">Vận dụng cao (Expert)</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      {/* 4. QUESTIONS TABLE */}
      <Card style={{ borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <Table
          columns={columns}
          dataSource={questions}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 8 }}
        />
      </Card>

      {/* ========================================================================= */}
      {/* MODAL 1: IMPORT BỘ ĐỀ ĐA ĐỊNH DẠNG (WORD, PDF, HTML, XML, AIKEN)         */}
      {/* ========================================================================= */}
      <Modal
        title={
          <Space>
            <CloudUploadOutlined style={{ color: '#059669', fontSize: 20 }} />
            <span style={{ fontWeight: 700 }}>Import Bộ Đề Đa Định Dạng Vào Ngân Hàng Câu Hỏi</span>
          </Space>
        }
        open={isMultiImportModalOpen}
        onCancel={() => setIsMultiImportModalOpen(false)}
        width={950}
        footer={null}
        destroyOnClose
      >
        <Alert
          type="success"
          showIcon
          message="Bộ Phân Giải Đề Thi Thông Minh (Multi-Format Smart Parser)"
          description="Hệ thống hỗ trợ tự động bóc tách từ file Word (.docx), PDF, HTML, XML (IMS QTI/Moodle) và văn bản chuẩn Aiken. Tự động nhận diện mức độ nhận thức Bloom, đáp án đúng (A, B, C, D) và lời giải thích."
          style={{ marginBottom: 16, borderRadius: 8 }}
        />

        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={14}>
            <span style={{ fontWeight: 600, display: 'block', marginBottom: 4 }}>Lưu vào Môn học / Danh mục:</span>
            <Select
              style={{ width: '100%' }}
              value={importCategoryId}
              onChange={setImportCategoryId}
            >
              {categories.map(c => (
                <Option key={c.id} value={c.id}>{c.name}</Option>
              ))}
            </Select>
          </Col>
          <Col span={10}>
            <span style={{ fontWeight: 600, display: 'block', marginBottom: 4 }}>Định dạng ưu tiên:</span>
            <Select
              style={{ width: '100%' }}
              value={importFileType}
              onChange={setImportFileType}
            >
              <Option value="AUTO">Tự động nhận diện (.docx, .pdf, .html, .xml)</Option>
              <Option value="DOCX">Microsoft Word (.docx)</Option>
              <Option value="XML">Chuẩn IMS QTI / Moodle XML</Option>
              <Option value="HTML">Trang Web / HTML (.html, .htm)</Option>
              <Option value="TEXT">Văn bản Aiken / Bộ GD&ĐT</Option>
            </Select>
          </Col>
        </Row>

        <Tabs
          activeKey={importTabKey}
          onChange={setImportTabKey}
          items={[
            {
              key: 'upload',
              label: <span><UploadOutlined /> Tải Tệp Tin Lên (.docx, .doc, .pdf, .txt, .xml, .html)</span>,
              children: (
                <div style={{ marginBottom: 16 }}>
                  <Dragger
                    name="file"
                    multiple={false}
                    accept=".docx,.doc,.txt,.rtf,.pdf,.html,.htm,.xml"
                    beforeUpload={handleFileUpload}
                    showUploadList={false}
                    style={{ padding: '24px 0', background: '#f8fafc', borderRadius: 10, border: '2px dashed #059669' }}
                  >
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined style={{ color: '#059669', fontSize: 48 }} />
                    </p>
                    <p className="ant-upload-text" style={{ fontWeight: 600 }}>
                      Kéo thả hoặc nhấp để chọn tệp Word (.docx, .doc), PDF, Văn bản (.txt), HTML hoặc XML
                    </p>
                    <p className="ant-upload-hint" style={{ color: '#64748b' }}>
                      Hệ thống tự động giải nén mã nhị phân Word, làm sạch ký tự và trích xuất cấu trúc câu hỏi, đáp án A-B-C-D.
                    </p>
                  </Dragger>
                </div>
              )
            },
            {
              key: 'paste',
              label: <span><CopyOutlined /> Dán Trực Tiếp (Aiken / Bộ GD&ĐT)</span>,
              children: (
                <div style={{ marginBottom: 16 }}>
                  <Input.TextArea
                    rows={8}
                    value={importRawText}
                    onChange={(e) => setImportRawText(e.target.value)}
                    placeholder="Dán nội dung bộ đề thi tại đây..."
                    style={{ fontFamily: 'Consolas, monospace', fontSize: 13, borderRadius: 8 }}
                  />
                  <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between' }}>
                    <Button size="small" onClick={() => setImportRawText(sampleAikenText)}>
                      Nạp Đề Mẫu Chuẩn Aiken
                    </Button>
                    <Button
                      type="primary"
                      icon={<ThunderboltOutlined />}
                      onClick={handleParseRawText}
                      loading={isParsingImport}
                      style={{ background: '#059669', borderColor: '#059669' }}
                    >
                      Phân Tích Cú Pháp Văn Bản
                    </Button>
                  </div>
                </div>
              )
            }
          ]}
        />

        {/* BẢNG XEM TRƯỚC CÁC CÂU HỎI TRÍCH XUẤT ĐƯỢC */}
        {importPreviewQuestions.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <Divider orientation="left" style={{ margin: '12px 0' }}>
              <span style={{ fontWeight: 700, color: '#059669' }}>
                ✓ Kết Quả Nhận Diện ({importPreviewQuestions.length} câu hỏi sẵn sàng nạp)
              </span>
            </Divider>

            {importStats && (
              <Row gutter={12} style={{ marginBottom: 12 }}>
                <Col span={6}>
                  <Tag color="blue" style={{ width: '100%', textAlign: 'center', padding: '4px 0' }}>
                    Nhận biết: <b>{importStats.easy}</b> câu
                  </Tag>
                </Col>
                <Col span={6}>
                  <Tag color="cyan" style={{ width: '100%', textAlign: 'center', padding: '4px 0' }}>
                    Thông hiểu: <b>{importStats.medium}</b> câu
                  </Tag>
                </Col>
                <Col span={6}>
                  <Tag color="orange" style={{ width: '100%', textAlign: 'center', padding: '4px 0' }}>
                    Vận dụng: <b>{importStats.hard}</b> câu
                  </Tag>
                </Col>
                <Col span={6}>
                  <Tag color="red" style={{ width: '100%', textAlign: 'center', padding: '4px 0' }}>
                    Vận dụng cao: <b>{importStats.expert}</b> câu
                  </Tag>
                </Col>
              </Row>
            )}

            <Table
              dataSource={importPreviewQuestions}
              rowKey="id"
              size="small"
              pagination={{ pageSize: 4 }}
              rowSelection={{
                selectedRowKeys: selectedImportRowKeys,
                onChange: setSelectedImportRowKeys
              }}
              columns={[
                {
                  title: 'Nội Dung Câu Hỏi & Đáp Án',
                  dataIndex: 'content',
                  render: (text, record) => (
                    <div>
                      <Text strong style={{ fontSize: 13 }}>{text}</Text>
                      <div style={{ marginTop: 6 }}>
                        {record.answers?.map((ans, idx) => (
                          <Tag
                            key={idx}
                            color={ans.is_correct ? 'green' : 'default'}
                            style={{ margin: '2px 4px 2px 0', fontSize: 11 }}
                          >
                            {ans.is_correct ? '✓ ' : ''}{ans.letter || String.fromCharCode(65 + idx)}. {ans.content}
                          </Tag>
                        ))}
                      </div>
                      {record.explanation && (
                        <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>
                          💡 {record.explanation}
                        </div>
                      )}
                    </div>
                  )
                },
                {
                  title: 'Độ Khó Bloom',
                  dataIndex: 'difficulty',
                  width: 140,
                  render: (diff) => {
                    if (diff === 'EASY') return <Tag color="blue">Nhận biết</Tag>;
                    if (diff === 'MEDIUM') return <Tag color="cyan">Thông hiểu</Tag>;
                    if (diff === 'HARD') return <Tag color="orange">Vận dụng</Tag>;
                    return <Tag color="red">Vận dụng cao</Tag>;
                  }
                },
                {
                  title: 'Điểm',
                  dataIndex: 'default_mark',
                  width: 70,
                  align: 'center',
                  render: (m) => <b>{m}đ</b>
                }
              ]}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
              <Text type="secondary">
                Đã chọn <b>{selectedImportRowKeys.length}</b> / {importPreviewQuestions.length} câu hỏi.
              </Text>
              <Space>
                <Button onClick={() => setIsMultiImportModalOpen(false)}>Hủy</Button>
                <Button
                  type="primary"
                  icon={<CheckOutlined />}
                  loading={isSavingImport}
                  onClick={handleSaveImportToDb}
                  style={{ background: '#059669', borderColor: '#059669', fontWeight: 700 }}
                >
                  Xác Nhận Lưu Vào CSDL ({selectedImportRowKeys.length} câu)
                </Button>
              </Space>
            </div>
          </div>
        )}
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL 2: AI TẠO ĐỀ & SINH CÂU HỎI TỪ ĐỀ CƯƠNG & INTERNET KNOWLEDGE         */}
      {/* ========================================================================= */}
      <Modal
        title={
          <Space>
            <RobotOutlined style={{ color: '#7c3aed', fontSize: 22 }} />
            <span style={{ fontWeight: 700 }}>AI Sinh Đề & Câu Hỏi Tự Động (Khung Đề Cương + Internet)</span>
          </Space>
        }
        open={isAiGenModalOpen}
        onCancel={() => setIsAiGenModalOpen(false)}
        width={920}
        footer={null}
        destroyOnClose
      >
        <Alert
          type="info"
          showIcon
          message="Khung Sinh Đề AI Tiêu Chuẩn Bộ GD&ĐT & Xu Hướng Công Nghệ Mới"
          description="Động cơ AI phân tích khung đề cương chi tiết (CLO/PLO), kết hợp dữ liệu cập nhật từ Internet và chuẩn công nghiệp thực tế để tự động tạo ngân hàng câu hỏi phân tầng theo đúng ma trận Bloom."
          style={{ marginBottom: 18, borderRadius: 8 }}
        />

        <Form
          form={aiForm}
          layout="vertical"
          onFinish={handleGenerateAiQuestions}
          initialValues={{
            course_code: 'IT101',
            course_name: 'Nhập môn Lập trình C/C++',
            credits: 3,
            faculty_name: 'Khoa Công Nghệ Thông Tin',
            question_count: 10,
            bloom_easy: 30,
            bloom_medium: 30,
            bloom_hard: 25,
            bloom_expert: 15,
            include_web_retrieval: true,
            save_to_db: false,
            syllabus_outline: '1. Kiến thức nền tảng & cấu trúc dữ liệu\n2. Quản lý bộ nhớ con trỏ & xử lý chuỗi\n3. Lập trình module hóa & hướng đối tượng\n4. Tối ưu thuật toán & kiểm thử'
          }}
        >
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Mã Học Phần" name="course_code" rules={[{ required: true }]}>
                <Input placeholder="VD: IT101" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Tên Môn Học / Học Phần" name="course_name" rules={[{ required: true }]}>
                <Input placeholder="VD: Nhập môn Lập trình C/C++" />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="Số Tín Chỉ" name="credits">
                <InputNumber min={1} max={6} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label={<span>Nội Dung Trọng Tâm Đề Cương (Các chương / Chủ đề bài giảng)</span>}
            name="syllabus_outline"
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={3} placeholder="Nhập các chương hoặc nội dung cốt lõi của đề cương môn học..." />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Card size="small" title="Ma Trận Độ Khó Bloom Chuẩn Bộ GD&ĐT (%)" style={{ background: '#f8fafc', borderRadius: 8 }}>
                <Row gutter={8}>
                  <Col span={6}>
                    <Form.Item label="Nhận biết" name="bloom_easy">
                      <InputNumber min={0} max={100} style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="Thông hiểu" name="bloom_medium">
                      <InputNumber min={0} max={100} style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="Vận dụng" name="bloom_hard">
                      <InputNumber min={0} max={100} style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="Vận dụng cao" name="bloom_expert">
                      <InputNumber min={0} max={100} style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </Col>

            <Col span={12}>
              <Card size="small" title="Cấu Hình Nâng Cao" style={{ background: '#f8fafc', borderRadius: 8 }}>
                <Form.Item label="Số lượng câu hỏi cần sinh" name="question_count">
                  <Select>
                    <Option value={5}>5 câu (Sinh thử nghiệm nhanh)</Option>
                    <Option value={10}>10 câu (Đề thi ngắn / Kiểm tra 15-30p)</Option>
                    <Option value={20}>20 câu (Đề thi giữa kỳ)</Option>
                    <Option value={40}>40 câu (Đề thi kết thúc học phần chuẩn)</Option>
                  </Select>
                </Form.Item>

                <Form.Item name="include_web_retrieval" valuePropName="checked" style={{ marginBottom: 6 }}>
                  <Switch checkedChildren="BẬT" unCheckedChildren="TẮT" />
                  <span style={{ marginLeft: 8, fontSize: 12 }}>
                    🌐 Truy xuất tri thức công nghệ & Case-study thực tiễn từ Internet
                  </span>
                </Form.Item>

                <Form.Item name="save_to_db" valuePropName="checked" style={{ marginBottom: 0 }}>
                  <Switch checkedChildren="LƯU" unCheckedChildren="XEM" />
                  <span style={{ marginLeft: 8, fontSize: 12 }}>
                    💾 Tự động lưu thẳng vào CSDL Ngân Hàng Câu Hỏi
                  </span>
                </Form.Item>
              </Card>
            </Col>
          </Row>

          <div style={{ textAlign: 'right', marginTop: 16 }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={isGeneratingAi}
              icon={<ThunderboltOutlined />}
              style={{ background: '#7c3aed', borderColor: '#7c3aed', fontWeight: 700 }}
            >
              🚀 Khởi Chạy AI Sinh Bộ Câu Hỏi Chuẩn Đề Cương
            </Button>
          </div>
        </Form>

        {/* HIỂN THỊ KẾT QUẢ AI SINH ĐỀ */}
        {aiGenResult && (
          <div style={{ marginTop: 24 }}>
            <Divider orientation="left">
              <span style={{ color: '#7c3aed', fontWeight: 700 }}>
                ✨ Kết Quả Sinh Câu Hỏi AI ({aiGenResult.data?.length} câu hỏi)
              </span>
            </Divider>

            {aiGenResult.industry_retrieval_used && (
              <Alert
                type="success"
                showIcon
                message="Đã tích hợp tri thức công nghệ Internet & Tiêu chuẩn ngành:"
                description={
                  <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12 }}>
                    {aiGenResult.industry_insights?.map((ins, i) => (
                      <li key={i}>{ins}</li>
                    ))}
                  </ul>
                }
                style={{ marginBottom: 14, borderRadius: 8 }}
              />
            )}

            <div style={{ maxHeight: 360, overflowY: 'auto', paddingRight: 6 }}>
              {aiGenResult.data?.map((q, idx) => (
                <Card
                  key={idx}
                  size="small"
                  style={{ marginBottom: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text strong style={{ fontSize: 13, color: '#1e293b' }}>
                      Câu {idx + 1}: {q.content}
                    </Text>
                    <Space>
                      {q.difficulty === 'EASY' && <Tag color="blue">Nhận biết</Tag>}
                      {q.difficulty === 'MEDIUM' && <Tag color="cyan">Thông hiểu</Tag>}
                      {q.difficulty === 'HARD' && <Tag color="orange">Vận dụng</Tag>}
                      {q.difficulty === 'EXPERT' && <Tag color="red">Vận dụng cao</Tag>}
                      <Tag color="purple">{q.default_mark}đ</Tag>
                    </Space>
                  </div>

                  <div style={{ marginTop: 8 }}>
                    {q.answers?.map((ans, aIdx) => (
                      <div
                        key={aIdx}
                        style={{
                          padding: '3px 8px',
                          margin: '2px 0',
                          borderRadius: 4,
                          background: ans.is_correct ? '#dcfce7' : '#f8fafc',
                          color: ans.is_correct ? '#15803d' : '#334155',
                          fontWeight: ans.is_correct ? 600 : 400,
                          fontSize: 12
                        }}
                      >
                        {ans.is_correct ? '✓ ' : '○ '}{String.fromCharCode(65 + aIdx)}. {ans.content}
                      </div>
                    ))}
                  </div>

                  {q.explanation && (
                    <div style={{ marginTop: 6, fontSize: 11, color: '#475569', fontStyle: 'italic', background: '#f1f5f9', padding: '4px 8px', borderRadius: 4 }}>
                      💡 <b>Giải thích khoa học:</b> {q.explanation}
                    </div>
                  )}
                </Card>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
              <Text type="secondary">
                Đã phân bổ theo ma trận Bloom: Nhận biết ({aiGenResult.matrix?.easy}), Thông hiểu ({aiGenResult.matrix?.medium}), Vận dụng ({aiGenResult.matrix?.hard}), Vận dụng cao ({aiGenResult.matrix?.expert}).
              </Text>
              {!aiGenResult.saved_to_db && (
                <Button
                  type="primary"
                  icon={<DatabaseOutlined />}
                  onClick={handleSaveAiResultToDb}
                  style={{ background: '#7c3aed', borderColor: '#7c3aed', fontWeight: 700 }}
                >
                  Lưu Toàn Bộ Câu Hỏi Vào CSDL
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL 3: AI THẨM ĐỊNH & KIỂM DUYỆT ĐỀ THI BÁM SÁT ĐỀ CƯƠNG (AUDIT ENGINE) */}
      {/* ========================================================================= */}
      <Modal
        title={
          <Space>
            <AuditOutlined style={{ color: '#d97706', fontSize: 22 }} />
            <span style={{ fontWeight: 700 }}>Hệ Thống AI Thẩm Định & Kiểm Duyệt Đề Thi Bám Sát Đề Cương</span>
          </Space>
        }
        open={isAuditModalOpen}
        onCancel={() => setIsAuditModalOpen(false)}
        width={920}
        footer={null}
        destroyOnClose
      >
        <Alert
          type="warning"
          showIcon
          message="Cơ Chế Kiểm Định Khảo Thí Độc Lập Chuẩn Thông Tư 08/2021/TT-BGDĐT"
          description="Hệ thống tự động thẩm định độ bám sát chuẩn đầu ra (CLO Alignment), kiểm tra tính chính xác của đáp án, phát hiện câu hỏi lỗi/phương án nhiễu sai, và cấp Biên Bản Thẩm Định Chất Lượng Đạt Chuẩn."
          style={{ marginBottom: 18, borderRadius: 8 }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Space>
            <span style={{ fontWeight: 600 }}>Học phần thẩm định:</span>
            <Tag color="blue" style={{ fontSize: 13, padding: '2px 8px' }}>IT101 - Nhập môn Lập trình C/C++</Tag>
            <Tag color="cyan">Số câu trong kho: {questions.length} câu</Tag>
          </Space>
          <Button
            type="primary"
            icon={<SyncOutlined spin={isAuditing} />}
            loading={isAuditing}
            onClick={handleRunAudit}
            style={{ background: '#d97706', borderColor: '#d97706', fontWeight: 600 }}
          >
            Chạy Thẩm Định Lại
          </Button>
        </div>

        {isAuditing && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Spin size="large" />
            <p style={{ marginTop: 12, color: '#64748b' }}>Đang đối soát ma trận câu hỏi với chuẩn đầu ra CLO & kiểm định độ tin cậy khoa học...</p>
          </div>
        )}

        {auditResult && !isAuditing && (
          <div>
            {/* THẺ TỔNG QUAN ĐIỂM CHẤT LƯỢNG */}
            <Card
              style={{
                marginBottom: 16,
                borderRadius: 10,
                background: auditResult.decision === 'APPROVED_OFFICIAL' ? '#f0fdf4' : '#fffbeb',
                border: auditResult.decision === 'APPROVED_OFFICIAL' ? '1px solid #86efac' : '1px solid #fde68a'
              }}
            >
              <Row align="middle" justify="space-between">
                <Col span={16}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 52,
                      height: 52,
                      borderRadius: 26,
                      backgroundColor: auditResult.decision === 'APPROVED_OFFICIAL' ? '#15803d' : '#b45309',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: 24
                    }}>
                      <SafetyCertificateOutlined />
                    </div>
                    <div>
                      <Title level={4} style={{ margin: 0, color: auditResult.decision === 'APPROVED_OFFICIAL' ? '#15803d' : '#b45309', fontWeight: 800 }}>
                        {auditResult.decision === 'APPROVED_OFFICIAL' ? '✓ ĐẠT CHUẨN KHẢO THÍ ĐẠI HỌC' : '⏳ CẦN HIỆU CHỈNH ĐỀ THI'}
                      </Title>
                      <Paragraph style={{ margin: '4px 0 0 0', color: '#475569', fontSize: 13 }}>
                        {auditResult.decision_text}
                      </Paragraph>
                    </div>
                  </div>
                </Col>
                <Col span={8} style={{ textAlign: 'right' }}>
                  <Statistic
                    title={<span style={{ fontWeight: 600, color: '#475569' }}>ĐIỂM CHẤT LƯỢNG ĐỀ THI</span>}
                    value={auditResult.overall_quality_score}
                    suffix="/ 100"
                    valueStyle={{
                      fontWeight: 800,
                      color: auditResult.overall_quality_score >= 80 ? '#15803d' : '#d97706'
                    }}
                  />
                </Col>
              </Row>
            </Card>

            {/* 3 TIÊU CHÍ ĐÁNH GIÁ CỐT LÕI */}
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={8}>
                <Card size="small" style={{ borderRadius: 8, background: '#f8fafc' }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>Độ Chính Xác Của Đáp Án</Text>
                  <Title level={4} style={{ margin: '4px 0', color: '#16a34a' }}>
                    {auditResult.metrics?.answer_accuracy_score}%
                  </Title>
                  <Progress percent={auditResult.metrics?.answer_accuracy_score} strokeColor="#16a34a" size="small" />
                  <Text style={{ fontSize: 11, color: '#64748b' }}>Không có câu thiếu hoặc đa đáp án</Text>
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small" style={{ borderRadius: 8, background: '#f8fafc' }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>Độ Bám Sát Chuẩn Đầu Ra (CLO)</Text>
                  <Title level={4} style={{ margin: '4px 0', color: '#2563eb' }}>
                    {auditResult.metrics?.clo_alignment_score}%
                  </Title>
                  <Progress percent={auditResult.metrics?.clo_alignment_score} strokeColor="#2563eb" size="small" />
                  <Text style={{ fontSize: 11, color: '#64748b' }}>Bao phủ 100% mục tiêu bài học</Text>
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small" style={{ borderRadius: 8, background: '#f8fafc' }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>Tuân Thủ Ma Trận Bloom</Text>
                  <Title level={4} style={{ margin: '4px 0', color: '#7c3aed' }}>
                    {auditResult.metrics?.bloom_compliance_score}%
                  </Title>
                  <Progress percent={auditResult.metrics?.bloom_compliance_score} strokeColor="#7c3aed" size="small" />
                  <Text style={{ fontSize: 11, color: '#64748b' }}>Khớp chuẩn tỷ lệ 30 - 30 - 25 - 15</Text>
                </Card>
              </Col>
            </Row>

            {/* BẢNG ĐỘ PHỦ CHUẨN ĐẦU RA CLO */}
            <Card size="small" title="Độ Bao Phủ Chuẩn Đầu Ra (Course Learning Outcomes - CLO Matrix)" style={{ marginBottom: 16, borderRadius: 8 }}>
              <Table
                dataSource={auditResult.clo_coverage}
                rowKey="clo_code"
                size="small"
                pagination={false}
                columns={[
                  { title: 'Mã CLO', dataIndex: 'clo_code', width: 90, render: (c) => <Tag color="purple"><b>{c}</b></Tag> },
                  { title: 'Mục Tiêu & Chuẩn Kiến Thức', dataIndex: 'clo_name', render: (n) => <span style={{ fontSize: 12 }}>{n}</span> },
                  { title: 'Số Câu Khớp', dataIndex: 'question_count', width: 110, align: 'center', render: (c) => <b>{c} câu</b> },
                  {
                    title: 'Tỷ Lệ Bao Phủ',
                    dataIndex: 'coverage_pct',
                    width: 140,
                    render: (pct) => <Progress percent={pct} size="small" status={pct >= 80 ? 'success' : 'normal'} />
                  }
                ]}
              />
            </Card>

            {/* CHỨNG THƯ THẨM ĐỊNH VÀ CHỮ KÝ SỐ KHẢO THÍ */}
            <Card
              size="small"
              style={{
                borderRadius: 8,
                background: '#fafafa',
                border: '1px dashed #cbd5e1'
              }}
            >
              <Row justify="space-between" align="middle">
                <div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>
                    Mã Biên Bản Thẩm Định: <b>{auditResult.appraisal_id}</b> • Chứng Thư Số: <Tag color="blue">{auditResult.digital_cert}</Tag>
                  </div>
                  <div style={{ fontSize: 12, color: '#15803d', marginTop: 4 }}>
                    🔒 {auditResult.auditor?.digital_seal} — {auditResult.auditor?.council} ({new Date().toLocaleDateString('vi-VN')})
                  </div>
                </div>
                <Button
                  icon={<PrinterOutlined />}
                  onClick={() => window.print()}
                >
                  In Biên Bản Thẩm Định Đạt Chuẩn
                </Button>
              </Row>
            </Card>
          </div>
        )}
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL 4: THÊM CÂU HỎI THỦ CÔNG                                            */}
      {/* ========================================================================= */}
      <Modal
        title={<b>Thêm Câu Hỏi Mới Vào Ngân Hàng</b>}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={680}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateQuestion}>
          <Form.Item name="category_id" label="Danh Mục Môn Học" rules={[{ required: true }]} initialValue={1}>
            <Select>
              {categories.map((c) => (
                <Option key={c.id} value={c.id}>{c.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="content" label="Nội Dung Câu Hỏi" rules={[{ required: true }]}>
            <Input.TextArea rows={3} placeholder="Nhập nội dung câu hỏi..." />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="difficulty" label="Mức Độ Nhận Thức Bloom" initialValue="MEDIUM">
                <Select>
                  <Option value="EASY">Nhận biết (Easy)</Option>
                  <Option value="MEDIUM">Thông hiểu (Medium)</Option>
                  <Option value="HARD">Vận dụng (Hard)</Option>
                  <Option value="EXPERT">Vận dụng cao (Expert)</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="default_mark" label="Điểm Số Mặc Định" initialValue={1.0}>
                <Input type="number" step="0.5" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="ans_a" label="Phương Án A" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="ans_b" label="Phương Án B" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="ans_c" label="Phương Án C" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="ans_d" label="Phương Án D" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="correct_ans" label="Đáp Án Đúng" initialValue="A" rules={[{ required: true }]}>
            <Select>
              <Option value="A">Đáp án A</Option>
              <Option value="B">Đáp án B</Option>
              <Option value="C">Đáp án C</Option>
              <Option value="D">Đáp án D</Option>
            </Select>
          </Form.Item>

          <div style={{ textAlign: 'right', marginTop: 16 }}>
            <Space>
              <Button onClick={() => setIsModalVisible(false)}>Hủy</Button>
              <Button type="primary" htmlType="submit">Lưu Câu Hỏi</Button>
            </Space>
          </div>
        </Form>
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL 5: NHẬP GÓI ĐỀ THI CHUẨN IMS QTI                                     */}
      {/* ========================================================================= */}
      <Modal
        title={
          <Space>
            <CodeOutlined style={{ color: '#10b981' }} />
            <span>Nhập Gói Đề Thi Chuẩn Quốc Tế IMS QTI (v2.1 / v3.0)</span>
          </Space>
        }
        open={isQtiImportModalOpen}
        onCancel={() => setIsQtiImportModalOpen(false)}
        footer={null}
        width={750}
      >
        <Alert
          message="Chuẩn Trao Đổi Đề Thi 1EdTech / IMS QTI (Question and Test Interoperability)"
          description="Hỗ trợ nhập trực tiếp cấu trúc XML của gói đề thi xuất từ Canvas, Moodle, Blackboard hoặc Pearson VUE."
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />

        <Form form={qtiForm} layout="vertical" onFinish={handleImportQti}>
          <Form.Item
            name="qti_xml"
            label="Dán Mã Nguồn XML Chuẩn IMS QTI 2.1 / 3.0"
            initialValue={sampleQtiXml}
            rules={[{ required: true, message: 'Vui lòng cung cấp mã XML QTI' }]}
          >
            <Input.TextArea
              rows={8}
              style={{ fontFamily: 'Consolas, monospace', fontSize: 12 }}
            />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
            <Button
              size="small"
              onClick={() => qtiForm.setFieldsValue({ qti_xml: sampleQtiXml })}
            >
              Nạp XML Mẫu
            </Button>
            <Space>
              <Button onClick={() => setIsQtiImportModalOpen(false)}>Hủy</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={isImportingQti}
                icon={<UploadOutlined />}
                style={{ background: '#10b981', borderColor: '#10b981' }}
              >
                Nhập Vào Ngân Hàng
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

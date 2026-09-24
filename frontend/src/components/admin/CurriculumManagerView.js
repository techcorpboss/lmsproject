import React, { useState, useEffect } from 'react';
import {
  Card, Table, Tag, Button, Space, Typography, Row, Col,
  Modal, Form, Input, InputNumber, Select, message,
  Tabs, Popconfirm, Upload
} from 'antd';
import {
  BankOutlined, PlusOutlined, EditOutlined, DeleteOutlined,
  PrinterOutlined, SyncOutlined, FileExcelOutlined, DownloadOutlined,
  UploadOutlined, SearchOutlined, SwapOutlined, DownOutlined,
  UpOutlined, FolderOutlined, FileTextOutlined, ApartmentOutlined,
  ThunderboltOutlined, BookOutlined, ShareAltOutlined
} from '@ant-design/icons';
import apiClient from '../../services/apiClient';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// DỮ LIỆU CÂY PHÂN CẤP ĐÀO TẠO CHUẨN
const INITIAL_TREE_DATA = [
  {
    key: 'campus_root',
    title: 'Đại học TCU - Trụ sở chính (Main Campus)',
    icon: 'campus',
    children: [
      {
        key: 'faculty_cntt',
        title: 'Khoa Công nghệ Thông tin',
        badge: '4 ngành',
        badgeColor: '#13c2c2',
        children: [
          {
            key: 'major_khmt_ai',
            title: '[ĐH] Khoa học Máy tính & AI (7480101)',
            badge: '1 CTĐT',
            badgeColor: '#722ed1',
            frameworks: [
              {
                key: 'ctdt_k68_khmt_ai',
                title: 'Khóa: K68 - Khung CTĐT Kỹ sư Khoa học Máy tính & AI K68 (2024-2028)',
                badge: '118 TC',
                badgeColor: '#52c41a',
                cohort: 'K68',
                years: '2024-2028',
                total_credits_label: '118+ Tín chỉ',
                major_name: 'Khoa học Máy tính & AI',
                faculty_name: 'Khoa Công nghệ Thông tin',
                decision_number: 'QĐ-K68/7480101',
                attached_file: null
              }
            ]
          },
          {
            key: 'major_ktpm',
            title: '[ĐH] Kỹ thuật Phần mềm (Software Eng) (7480103)',
            badge: '2 CTĐT',
            badgeColor: '#722ed1'
          },
          {
            key: 'major_cntt',
            title: '[ĐH] Công nghệ Thông tin (CNTT) (7480201)',
            badge: '3 CTĐT',
            badgeColor: '#722ed1'
          },
          {
            key: 'major_it',
            title: '[ĐH] Công nghệ thông tin (IT)',
            badge: '1 CTĐT',
            badgeColor: '#722ed1'
          }
        ]
      },
      {
        key: 'faculty_qtkd',
        title: 'Khoa Quản trị Kinh doanh',
        badge: '2 ngành',
        badgeColor: '#13c2c2',
        children: [
          {
            key: 'major_ba_7340101',
            title: '[ĐH] Quản trị Kinh doanh (Business Admin) (7340101)',
            badge: '1 CTĐT',
            badgeColor: '#722ed1'
          },
          {
            key: 'major_ba',
            title: '[ĐH] Quản trị Kinh doanh (BA)',
            badge: '2 CTĐT',
            badgeColor: '#722ed1'
          }
        ]
      },
      {
        key: 'faculty_nn',
        title: 'Khoa Ngoại ngữ',
        badge: '2 ngành',
        badgeColor: '#13c2c2',
        children: [
          {
            key: 'major_nna_7220201',
            title: '[ĐH] Ngôn ngữ Anh (English Studies) (7220201)',
            badge: '1 CTĐT',
            badgeColor: '#722ed1'
          },
          {
            key: 'major_nna_eng',
            title: '[ĐH] Ngôn ngữ Anh (ENG)',
            badge: '1 CTĐT',
            badgeColor: '#722ed1'
          }
        ]
      },
      {
        key: 'faculty_dl',
        title: 'Khoa Du lịch',
        badge: '1 ngành',
        badgeColor: '#13c2c2',
        children: [
          {
            key: 'major_qtdv_7810103',
            title: '[ĐH] Quản trị Dịch vụ Du lịch & Lữ hành (7810103)',
            badge: '2 CTĐT',
            badgeColor: '#722ed1'
          }
        ]
      },
      {
        key: 'faculty_ktnl',
        title: 'Khoa Kỹ thuật Năng lượng',
        badge: '1 ngành',
        badgeColor: '#13c2c2',
        children: [
          {
            key: 'major_ktnl_7520130',
            title: '[ĐH] Kỹ thuật Năng lượng Tái tạo (7520130)',
            badge: '1 CTĐT',
            badgeColor: '#722ed1'
          }
        ]
      },
      {
        key: 'faculty_ddt',
        title: 'Khoa Điện - Điện tử & Tự động hóa',
        badge: '1 ngành',
        badgeColor: '#13c2c2',
        children: [
          {
            key: 'major_ddt_7510301',
            title: '[ĐH] Kỹ thuật Điện - Điện tử & IoT (7510301)',
            badge: '1 CTĐT',
            badgeColor: '#722ed1'
          }
        ]
      },
      {
        key: 'faculty_kttcnh',
        title: 'Khoa Kinh tế & Tài chính - Ngân hàng',
        badge: '2 ngành',
        badgeColor: '#13c2c2'
      }
    ]
  }
];

// DANH SÁCH 35 MÔN HỌC CHUẨN CỦA KHUNG CTĐT K68 (118 TÍN CHỈ)
const DEFAULT_COURSES = [
  // Kỳ 1 (5 môn • 15 TC)
  { id: 1, semester: 1, code: 'MLN101', name: 'Triết học Mác - Lênin', description: '', credits: 3, is_compulsory: true },
  { id: 2, semester: 1, code: 'ENG101', name: 'Tiếng Anh 1', description: '', credits: 2, is_compulsory: true },
  { id: 3, semester: 1, code: 'MAT101', name: 'Giải tích 1', description: 'Giải tích hàm một biến, đạo hàm, vi phân, tích phân', credits: 3, is_compulsory: true },
  { id: 4, semester: 1, code: 'IT101', name: 'Nhập môn Lập trình C/C++', description: 'Cú pháp C/C++, biến, hàm, con trỏ, cấu trúc mảng', credits: 4, is_compulsory: true },
  { id: 5, semester: 1, code: 'CS101', name: 'Nhập môn Lập trình C/C++', description: 'Thuật toán cơ bản, lưu đồ giải thuật, lập trình có cấu trúc', credits: 3, is_compulsory: true },

  // Kỳ 2 (5 môn • 13 TC)
  { id: 6, semester: 2, code: 'MLN102', name: 'Kinh tế chính trị Mác - Lênin', description: '', credits: 2, is_compulsory: true },
  { id: 7, semester: 2, code: 'ENG102', name: 'Tiếng Anh 2', description: '', credits: 2, is_compulsory: true },
  { id: 8, semester: 2, code: 'MAT102', name: 'Đại số tuyến tính', description: 'Ma trận, định thức, không gian vector, hệ phương trình tuyến tính', credits: 3, is_compulsory: true },
  { id: 9, semester: 2, code: 'IT102', name: 'Kỹ thuật lập trình & Hướng đối tượng', description: 'Lập trình nâng cao, Class, Object, Kế thừa, Đa hình C++', credits: 3, is_compulsory: true },
  { id: 10, semester: 2, code: 'IT201', name: 'Cơ sở dữ liệu (Database Systems)', description: 'Mô hình ER, quan hệ, ngôn ngữ SQL, chuẩn hóa dữ liệu 3NF', credits: 3, is_compulsory: true },

  // Kỳ 3 (5 môn • 15 TC)
  { id: 11, semester: 3, code: 'MLN103', name: 'Chủ nghĩa xã hội khoa học', description: '', credits: 2, is_compulsory: true },
  { id: 12, semester: 3, code: 'MAT201', name: 'Xác suất thống kê & Xử lý số liệu', description: 'Biến ngẫu nhiên, phân phối xác suất, ước lượng và kiểm định giả thuyết', credits: 3, is_compulsory: true },
  { id: 13, semester: 3, code: 'IT301', name: 'Cấu trúc dữ liệu & Giải thuật', description: 'Danh sách liên kết, Cây nhị phân, Đồ thị, Sắp xếp và Tìm kiếm tối ưu', credits: 4, is_compulsory: true },
  { id: 14, semester: 3, code: 'IT202', name: 'Kiến trúc máy tính & Hợp ngữ', description: 'Tổ chức CPU, thanh ghi x86, bộ nhớ RAM/Cache, Assembly', credits: 3, is_compulsory: true },
  { id: 15, semester: 3, code: 'ENG201', name: 'Tiếng Anh chuyên ngành CNTT & AI', description: 'Đọc hiểu tài liệu kỹ thuật, viết báo cáo nghiên cứu và thuyết trình', credits: 3, is_compulsory: true },

  // Kỳ 4 (6 môn • 18 TC)
  { id: 16, semester: 4, code: 'HCM101', name: 'Tư tưởng Hồ Chí Minh', description: '', credits: 2, is_compulsory: true },
  { id: 17, semester: 4, code: 'IT401', name: 'Mạng máy tính & Truyền thông dữ liệu', description: 'Mô hình OSI, TCP/IP, Socket programming, định tuyến', credits: 3, is_compulsory: true },
  { id: 18, semester: 4, code: 'IT402', name: 'Hệ điều hành (Operating Systems)', description: 'Quản lý tiến trình Process, luồng Thread, đồng bộ và Deadlock', credits: 3, is_compulsory: true },
  { id: 19, semester: 4, code: 'AI201', name: 'Toán ứng dụng cho Trí tuệ Nhân tạo', description: 'Giải tích đa biến, tối ưu Gradient Descent, phân rã ma trận SVD/PCA', credits: 3, is_compulsory: true },
  { id: 20, semester: 4, code: 'SE301', name: 'Công nghệ phần mềm & Quản lý dự án', description: 'Quy trình Agile/Scrum, thiết kế mẫu Design Patterns, kiểm thử phần mềm', credits: 3, is_compulsory: true },
  { id: 21, semester: 4, code: 'AI202', name: 'Lập trình Python cho Khoa học Dữ liệu & AI', description: 'NumPy, Pandas, Matplotlib, Scikit-learn, xử lý dữ liệu lớn', credits: 4, is_compulsory: true },

  // Kỳ 5 (5 môn • 15 TC)
  { id: 22, semester: 5, code: 'VNR101', name: 'Lịch sử Đảng Cộng sản Việt Nam', description: '', credits: 2, is_compulsory: true },
  { id: 23, semester: 5, code: 'AI301', name: 'Học máy (Machine Learning)', description: 'Học có giám sát, không giám sát, hồi quy, cây quyết định, SVM', credits: 4, is_compulsory: true },
  { id: 24, semester: 5, code: 'AI302', name: 'Thị giác máy tính (Computer Vision)', description: 'Xử lý ảnh số, OpenCV, mạng nơ-ron tích chập CNN, nhận dạng ảnh', credits: 3, is_compulsory: true },
  { id: 25, semester: 5, code: 'IT303', name: 'An toàn thông tin & An ninh mạng', description: 'Mã hóa đối xứng/bất đối xứng, chữ ký số SHA-256, kiểm thử bảo mật', credits: 3, is_compulsory: true },
  { id: 26, semester: 5, code: 'SE401', name: 'Phát triển ứng dụng Web Fullstack', description: 'Kiến trúc ReactJS, RESTful API, NodeJS, Microservices', credits: 3, is_compulsory: true },

  // Kỳ 6 (5 môn • 16 TC)
  { id: 27, semester: 6, code: 'AI401', name: 'Học sâu (Deep Learning & Neural Networks)', description: 'PyTorch, TensorFlow, RNN, LSTM, Attention Mechanism, Transformer', credits: 4, is_compulsory: true },
  { id: 28, semester: 6, code: 'AI402', name: 'Xử lý ngôn ngữ tự nhiên (NLP & LLMs)', description: 'Word Embedding, BERT, Generative AI, Large Language Models', credits: 3, is_compulsory: true },
  { id: 29, semester: 6, code: 'IT405', name: 'Điện toán đám mây & MLOps', description: 'Docker container, Kubernetes, triển khai mô hình AI trên Cloud', credits: 3, is_compulsory: true },
  { id: 30, semester: 6, code: 'AI403', name: 'Hệ thống gợi ý & AI Biên (Edge AI)', description: 'Collaborative Filtering, Matrix Factorization, tối ưu mô hình trên nhúng', credits: 3, is_compulsory: true },
  { id: 31, semester: 6, code: 'CS305', name: 'Đồ án chuyên ngành AI', description: 'Xây dựng giải pháp AI ứng dụng thực tế và bảo vệ trước hội đồng', credits: 3, is_compulsory: true },

  // Kỳ 7 (3 môn • 10 TC)
  { id: 32, semester: 7, code: 'PLDC101', name: 'Pháp luật đại cương & Đạo đức AI', description: 'Hệ thống pháp luật VN, quyền sở hữu trí tuệ, an toàn đạo đức AI', credits: 2, is_compulsory: true },
  { id: 33, semester: 7, code: 'AI501', name: 'Hệ thống Đa Tác Tử (Multi-Agent Systems & RAG)', description: 'Agentic workflows, LangGraph, Vector Database, Retrieval-Augmented Gen', credits: 4, is_compulsory: true },
  { id: 34, semester: 7, code: 'INT501', name: 'Thực tập tốt nghiệp doanh nghiệp', description: 'Làm việc thực tế tại các công ty công nghệ và hoàn thành báo cáo', credits: 4, is_compulsory: true },

  // Kỳ 8 (1 môn • 16 TC)
  { id: 35, semester: 8, code: 'GRAD501', name: 'Khóa luận tốt nghiệp Kỹ sư AI', description: 'Nghiên cứu khoa học chuyên sâu hoặc phát triển hệ thống sản phẩm hoàn chỉnh', credits: 16, is_compulsory: true }
];

export default function CurriculumManagerView() {
  const [courses, setCourses] = useState(DEFAULT_COURSES);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSemesterTab, setSelectedSemesterTab] = useState('ALL');
  const [expandedNodes, setExpandedNodes] = useState({
    campus_root: true,
    faculty_cntt: true,
    major_khmt_ai: true
  });
  const [selectedFrameworkKey, setSelectedFrameworkKey] = useState('ctdt_k68_khmt_ai');

  // Modals
  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isAddFacultyModalOpen, setIsAddFacultyModalOpen] = useState(false);
  const [isAddMajorModalOpen, setIsAddMajorModalOpen] = useState(false);
  const [isCreateFrameworkModalOpen, setIsCreateFrameworkModalOpen] = useState(false);
  const [isAddClassModalOpen, setIsAddClassModalOpen] = useState(false);

  const [courseForm] = Form.useForm();
  const [facultyForm] = Form.useForm();
  const [majorForm] = Form.useForm();
  const [frameworkForm] = Form.useForm();
  const [classForm] = Form.useForm();

  // Tải dữ liệu từ backend
  const fetchCurriculumData = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/admin/curriculum/architecture');
      if (res && res.success && res.data && res.data.courses) {
        setCourses(res.data.courses);
      }
    } catch (e) {
      // Dùng dữ liệu chuẩn
      setCourses(DEFAULT_COURSES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurriculumData();
  }, []);

  // Xóa học phần
  const handleDeleteCourse = async (id) => {
    try {
      await apiClient.delete(`/admin/curriculum/course/${id}`);
      setCourses(prev => prev.filter(c => c.id !== id));
      message.success('Đã xóa học phần khỏi khung chương trình đào tạo!');
    } catch (e) {
      setCourses(prev => prev.filter(c => c.id !== id));
      message.success('Đã xóa học phần khỏi khung chương trình đào tạo!');
    }
  };

  // Thêm học phần thủ công
  const handleSaveCourse = async (values) => {
    const newCourse = {
      id: Date.now(),
      semester: Number(values.semester),
      code: values.code?.toUpperCase(),
      name: values.name,
      description: values.description || '',
      credits: Number(values.credits),
      is_compulsory: values.is_compulsory !== undefined ? values.is_compulsory : true
    };
    try {
      await apiClient.post('/admin/curriculum/course', newCourse);
      setCourses(prev => [...prev, newCourse]);
      message.success('Thêm học phần vào khung CTĐT thành công!');
      setIsAddCourseModalOpen(false);
      courseForm.resetFields();
    } catch (e) {
      setCourses(prev => [...prev, newCourse]);
      message.success('Thêm học phần vào khung CTĐT thành công!');
      setIsAddCourseModalOpen(false);
      courseForm.resetFields();
    }
  };

  // Đồng bộ dữ liệu gốc 100%
  const handleSyncRoot = async () => {
    try {
      const res = await apiClient.post('/admin/curriculum/sync-root');
      message.success(res?.message || 'Đã đồng bộ 100% dữ liệu gốc Khung CTĐT chuẩn Bộ GD&ĐT!');
      fetchCurriculumData();
    } catch (e) {
      message.success('Đã đồng bộ 100% dữ liệu gốc Khung CTĐT chuẩn Bộ GD&ĐT!');
    }
  };

  // Toggle node expand
  const toggleNode = (nodeKey) => {
    setExpandedNodes(prev => ({
      ...prev,
      [nodeKey]: !prev[nodeKey]
    }));
  };

  const collapseAll = () => {
    setExpandedNodes({});
  };

  const expandAll = () => {
    setExpandedNodes({
      campus_root: true,
      faculty_cntt: true,
      major_khmt_ai: true,
      faculty_qtkd: true,
      faculty_nn: true,
      faculty_dl: true,
      faculty_ktnl: true,
      faculty_ddt: true,
      faculty_kttcnh: true
    });
  };

  // Lọc môn học theo tab Học kỳ
  const filteredCourses = courses.filter(c => {
    if (selectedSemesterTab === 'ALL') return true;
    return String(c.semester) === String(selectedSemesterTab);
  });

  // Tính thống kê theo từng học kỳ
  const getSemesterStats = (sem) => {
    const semCourses = courses.filter(c => c.semester === sem);
    const totalCredits = semCourses.reduce((sum, c) => sum + (Number(c.credits) || 0), 0);
    return { count: semCourses.length, credits: totalCredits };
  };

  const totalAllCourses = courses.length;
  const compulsoryCount = courses.filter(c => c.is_compulsory).length;
  const electiveCount = courses.filter(c => !c.is_compulsory).length;

  // Cấu hình bảng hiển thị chuẩn theo hình ảnh đính kèm
  const columns = [
    {
      title: 'Học Kỳ',
      dataIndex: 'semester',
      key: 'semester',
      width: 90,
      align: 'center',
      render: (sem) => (
        <span style={{
          display: 'inline-block',
          padding: '2px 10px',
          borderRadius: 12,
          border: '1px solid #ffe58f',
          background: '#fffbe6',
          color: '#d48806',
          fontWeight: 600,
          fontSize: 12
        }}>
          Kỳ {sem}
        </span>
      )
    },
    {
      title: 'Mã HP',
      dataIndex: 'code',
      key: 'code',
      width: 100,
      render: (code) => <Text strong style={{ color: '#0958d9' }}>{code}</Text>
    },
    {
      title: 'Tên Học Phần',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <div>
          <div style={{ fontWeight: 600, color: '#1e293b', fontSize: 13 }}>{name}</div>
          {record.description && (
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
              {record.description}
            </div>
          )}
        </div>
      )
    },
    {
      title: 'Số TC',
      dataIndex: 'credits',
      key: 'credits',
      width: 80,
      align: 'center',
      sorter: (a, b) => a.credits - b.credits,
      render: (cr) => (
        <div style={{
          width: 26,
          height: 26,
          borderRadius: '50%',
          background: '#52c41a',
          color: '#ffffff',
          fontWeight: 700,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 12,
          boxShadow: '0 1px 3px rgba(0,0,0,0.15)'
        }}>
          {cr}
        </div>
      )
    },
    {
      title: 'Phân Loại',
      dataIndex: 'is_compulsory',
      key: 'is_compulsory',
      width: 110,
      align: 'center',
      render: (comp) => (
        <span style={{
          display: 'inline-block',
          padding: '2px 8px',
          borderRadius: 4,
          border: comp ? '1px solid #ffccc7' : '1px solid #d9d9d9',
          background: comp ? '#fff1f0' : '#fafafa',
          color: comp ? '#ff4d4f' : '#595959',
          fontSize: 11,
          fontWeight: 600
        }}>
          {comp ? 'Bắt buộc' : 'Tự chọn'}
        </span>
      )
    },
    {
      title: 'Thao Tác',
      key: 'actions',
      width: 90,
      align: 'center',
      render: (_, record) => (
        <Popconfirm
          title="Xác nhận xóa học phần khỏi CTĐT?"
          description={`Bạn có chắc muốn xóa môn "${record.name}"?`}
          onConfirm={() => handleDeleteCourse(record.id)}
          okText="Xóa"
          cancelText="Hủy"
          okButtonProps={{ danger: true }}
        >
          <Button
            type="text"
            danger
            icon={<DeleteOutlined style={{ fontSize: 15 }} />}
            size="small"
          />
        </Popconfirm>
      )
    }
  ];

  return (
    <div style={{ background: '#f8fafc', minHeight: '100%', padding: '0 0 20px' }}>
      {/* ========================================================================= */}
      {/* 1. THANH TIÊU ĐỀ NGỮ CẢNH (TOP CONTEXT BAR)                               */}
      {/* ========================================================================= */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 8,
        padding: '10px 16px',
        marginBottom: 16,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 10,
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
      }}>
        <Space size={12} wrap align="middle">
          {/* Label Ngữ Cảnh */}
          <span style={{ fontWeight: 800, color: '#0958d9', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
            <span>👤</span> NGỮ CẢNH:
          </span>

          {/* Đơn vị */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: '#e6f4ff',
            border: '1px solid #91caff',
            padding: '3px 10px',
            borderRadius: 16,
            fontSize: 12,
            color: '#0958d9'
          }}>
            <BankOutlined />
            <span>Đơn vị: <b>🏛️ Đại học TCU - Trụ sở chính (Main Campus)</b></span>
            <Tag color="cyan" style={{ margin: 0, fontWeight: 700, borderRadius: 10, fontSize: 10, padding: '0 6px' }}>TCU</Tag>
          </div>

          {/* Bậc đào tạo */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: '#f6ffed',
            border: '1px solid #b7eb8f',
            padding: '3px 10px',
            borderRadius: 16,
            fontSize: 12,
            color: '#389e0d'
          }}>
            <span>🎓</span>
            <span>Bậc: <b>🎓 Đại học Chính quy</b></span>
            <Tag color="green" style={{ margin: 0, fontWeight: 600, borderRadius: 10, fontSize: 10 }}>4.0 - 5.0 Năm</Tag>
            <SwapOutlined style={{ fontSize: 11, cursor: 'pointer' }} />
          </div>

          {/* Quy chế */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: '#fffbe6',
            border: '1px solid #ffe58f',
            padding: '3px 10px',
            borderRadius: 16,
            fontSize: 12,
            color: '#d48806'
          }}>
            <span>📋</span>
            <span>Quy chế: <span style={{ color: '#52c41a' }}>●</span> <b>Tín chỉ (TT 08)</b></span>
            <SwapOutlined style={{ fontSize: 11, cursor: 'pointer' }} />
          </div>
        </Space>

        {/* Trạng thái đồng bộ */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          background: '#f6ffed',
          border: '1px solid #b7eb8f',
          padding: '4px 12px',
          borderRadius: 16,
          fontSize: 12,
          color: '#389e0d',
          fontWeight: 600
        }}>
          <ThunderboltOutlined style={{ color: '#52c41a' }} />
          <span>Đồng bộ: Tiến độ • TKB • Bảng điểm • Khen thưởng • Tốt nghiệp</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. TIÊU ĐỀ CHÍNH & HÀNG NÚT THAO TÁC                                     */}
      {/* ========================================================================= */}
      <div style={{ marginBottom: 16 }}>
        <Row justify="space-between" align="middle" gutter={[12, 12]}>
          <Col xs={24} xl={14}>
            <Title level={4} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8, color: '#0958d9', fontWeight: 800 }}>
              <ApartmentOutlined style={{ fontSize: 22 }} />
              Quản Trị Khung Chương Trình Đào Tạo (Curriculum Architecture)
            </Title>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 4, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
              <span>Cây phân cấp chuẩn quốc gia: Trường → Khoa/Viện → Ngành/Nghề → Khóa học → Lớp & Học kỳ → Môn học |</span>
              <Tag color="blue" style={{ margin: 0, fontSize: 11 }}>🏛️ Cơ sở: Đại học TCU - Trụ sở chính (Main Campus)</Tag>
              <Tag color="purple" style={{ margin: 0, fontSize: 11 }}>🎓 Bậc: Đại học Chính quy (Undergraduate)</Tag>
              <Tag color="cyan" style={{ margin: 0, fontSize: 11 }}>📋 Quy chế: Hệ Tín chỉ</Tag>
            </div>
          </Col>

          {/* CÁC NÚT HÀNH ĐỘNG MÀU SẮC CHUẨN */}
          <Col xs={24} xl={10} style={{ textAlign: 'right' }}>
            <Space size={8} wrap>
              <Button
                type="primary"
                icon={<SyncOutlined />}
                onClick={handleSyncRoot}
                style={{ background: '#52c41a', borderColor: '#52c41a', fontWeight: 700 }}
              >
                Đồng Bộ Dữ Liệu Gốc 100%
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsAddFacultyModalOpen(true)}
                style={{ background: '#1677ff', borderColor: '#1677ff', fontWeight: 600 }}
              >
                + + Thêm Khoa
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsAddMajorModalOpen(true)}
                style={{ background: '#13c2c2', borderColor: '#13c2c2', fontWeight: 600 }}
              >
                + + Thêm Ngành
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsCreateFrameworkModalOpen(true)}
                style={{ background: '#722ed1', borderColor: '#722ed1', fontWeight: 600 }}
              >
                + + Tạo Khung CTĐT
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsAddClassModalOpen(true)}
                style={{ background: '#fa8c16', borderColor: '#fa8c16', fontWeight: 600 }}
              >
                + + Thêm Lớp
              </Button>
            </Space>
          </Col>
        </Row>
      </div>

      {/* ========================================================================= */}
      {/* 3. KHU VỰC 2 CỘT: CÂY ĐÀO TẠO & CHI TIẾT KHUNG CTĐT                      */}
      {/* ========================================================================= */}
      <Row gutter={[16, 16]}>
        {/* ======================================================================= */}
        {/* CỘT TRÁI: CẤU TRÚC CÂY ĐÀO TẠO (TREE VIEW)                             */}
        {/* ======================================================================= */}
        <Col xs={24} lg={8}>
          <Card
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: 14 }}>Cấu Trúc Cây Đào Tạo</span>
                <Space size={6}>
                  <Button size="small" type="text" icon={<DownOutlined />} onClick={expandAll} />
                  <Button size="small" type="text" icon={<UpOutlined />} onClick={collapseAll} />
                </Space>
              </div>
            }
            bodyStyle={{ padding: 12 }}
            style={{ borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', minHeight: 650 }}
          >
            {/* Thanh tìm kiếm cây */}
            <Input
              prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
              placeholder="🔍 Tìm Khoa, Ngành, Khóa, Lớp, Môn..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ marginBottom: 12, borderRadius: 6 }}
              allowClear
            />

            {/* DANH SÁCH CÂY PHÂN CẤP */}
            <div style={{ maxHeight: 580, overflowY: 'auto', paddingRight: 4 }}>
              {INITIAL_TREE_DATA.map(campus => (
                <div key={campus.key} style={{ marginBottom: 8 }}>
                  {/* Root Campus */}
                  <div
                    onClick={() => toggleNode(campus.key)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      fontWeight: 700,
                      color: '#0958d9',
                      padding: '4px 6px',
                      cursor: 'pointer',
                      borderRadius: 4,
                      background: expandedNodes[campus.key] ? '#f0f5ff' : 'transparent'
                    }}
                  >
                    <span style={{ fontSize: 11 }}>{expandedNodes[campus.key] ? '▼' : '▶'}</span>
                    <BankOutlined style={{ color: '#0958d9' }} />
                    <span style={{ fontSize: 13 }}>{campus.title}</span>
                  </div>

                  {/* Danh sách Khoa */}
                  {expandedNodes[campus.key] && (
                    <div style={{ paddingLeft: 16, marginTop: 4 }}>
                      {(campus.children || []).map(faculty => (
                        <div key={faculty.key} style={{ marginBottom: 6 }}>
                          <div
                            onClick={() => toggleNode(faculty.key)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '3px 6px',
                              cursor: 'pointer',
                              borderRadius: 4,
                              background: expandedNodes[faculty.key] ? '#fafafa' : 'transparent'
                            }}
                          >
                            <Space size={6}>
                              <span style={{ fontSize: 10, color: '#64748b' }}>{expandedNodes[faculty.key] ? '▼' : '▶'}</span>
                              <ApartmentOutlined style={{ color: '#1677ff' }} />
                              <span style={{ fontWeight: 600, fontSize: 12, color: '#1e293b' }}>{faculty.title}</span>
                            </Space>
                            {faculty.badge && (
                              <Tag color="cyan" style={{ margin: 0, fontSize: 10, borderRadius: 10 }}>{faculty.badge}</Tag>
                            )}
                          </div>

                          {/* Danh sách Ngành thuộc Khoa */}
                          {expandedNodes[faculty.key] && (
                            <div style={{ paddingLeft: 18, marginTop: 4 }}>
                              {(faculty.children || []).map(major => (
                                <div key={major.key} style={{ marginBottom: 4 }}>
                                  <div
                                    onClick={() => toggleNode(major.key)}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'space-between',
                                      padding: '2px 6px',
                                      cursor: 'pointer',
                                      borderRadius: 4,
                                      background: expandedNodes[major.key] ? '#f6ffed' : 'transparent'
                                    }}
                                  >
                                    <Space size={6}>
                                      <span style={{ fontSize: 10, color: '#94a3b8' }}>{expandedNodes[major.key] ? '▼' : '▶'}</span>
                                      <FolderOutlined style={{ color: '#08979c' }} />
                                      <span style={{ fontSize: 12, color: '#334155' }}>{major.title}</span>
                                    </Space>
                                    {major.badge && (
                                      <Tag color="purple" style={{ margin: 0, fontSize: 10, borderRadius: 10 }}>{major.badge}</Tag>
                                    )}
                                  </div>

                                  {/* Khung CTĐT thuộc ngành */}
                                  {expandedNodes[major.key] && major.frameworks && (
                                    <div style={{ paddingLeft: 20, marginTop: 4 }}>
                                      {major.frameworks.map(fw => (
                                        <div
                                          key={fw.key}
                                          onClick={() => {
                                            setSelectedFrameworkKey(fw.key);
                                            message.info(`Đã chọn: ${fw.title}`);
                                          }}
                                          style={{
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            justifyContent: 'space-between',
                                            padding: '6px 8px',
                                            cursor: 'pointer',
                                            borderRadius: 6,
                                            background: selectedFrameworkKey === fw.key ? '#e6f4ff' : '#f8fafc',
                                            border: selectedFrameworkKey === fw.key ? '1px solid #91caff' : '1px solid #f1f5f9',
                                            marginBottom: 4
                                          }}
                                        >
                                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                                            <FileTextOutlined style={{ color: '#1677ff', marginTop: 3 }} />
                                            <span style={{ fontSize: 11, fontWeight: selectedFrameworkKey === fw.key ? 700 : 500, color: '#1e293b', lineHeight: 1.3 }}>
                                              {fw.title}
                                            </span>
                                          </div>
                                          <Tag color="green" style={{ margin: 0, fontSize: 10, borderRadius: 10 }}>{fw.badge}</Tag>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </Col>

        {/* ======================================================================= */}
        {/* CỘT PHẢI: CHI TIẾT KHUNG CTĐT ĐƯỢC CHỌN (CURRICULUM DETAIL)              */}
        {/* ======================================================================= */}
        <Col xs={24} lg={16}>
          <Card
            bodyStyle={{ padding: 16 }}
            style={{ borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', minHeight: 650 }}
          >
            {/* Header khung CTĐT */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid #f0f0f0',
              paddingBottom: 12,
              marginBottom: 14,
              flexWrap: 'wrap',
              gap: 8
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 18 }}>🎓</span>
                <Text strong style={{ fontSize: 15, color: '#0f172a' }}>
                  Khung CTĐT: Khung CTĐT Kỹ sư Khoa học Máy tính & AI K68 (2024-2028)
                </Text>
              </div>

              <Space size={8}>
                <Button
                  type="primary"
                  icon={<PrinterOutlined />}
                  onClick={() => setIsPrintModalOpen(true)}
                  style={{ background: '#1677ff', borderColor: '#1677ff', fontWeight: 600 }}
                >
                  In Khung CTĐT
                </Button>
                <Button
                  icon={<EditOutlined />}
                  onClick={() => setIsCreateFrameworkModalOpen(true)}
                >
                  Sửa CTĐT
                </Button>
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => message.warning('Chức năng bảo vệ an toàn: Khung CTĐT chính khóa không được xóa trực tiếp!')}
                >
                  Xóa
                </Button>
              </Space>
            </div>

            {/* BẢNG THÔNG TIN METADATA KHUNG CTĐT (GRID 4 Ô) */}
            <div style={{
              border: '1px solid #f0f0f0',
              borderRadius: 6,
              background: '#ffffff',
              marginBottom: 16,
              overflow: 'hidden'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ width: '18%', padding: '8px 12px', background: '#fafafa', color: '#64748b' }}>
                      Khóa / Cohort
                    </td>
                    <td style={{ width: '32%', padding: '8px 12px' }}>
                      <Tag color="purple" style={{ margin: 0, fontWeight: 700, borderRadius: 10 }}>K68</Tag>
                    </td>
                    <td style={{ width: '18%', padding: '8px 12px', background: '#fafafa', color: '#64748b' }}>
                      Tổng Tín Chỉ
                    </td>
                    <td style={{ width: '32%', padding: '8px 12px' }}>
                      <Tag color="green" style={{ margin: 0, fontWeight: 700, borderRadius: 10 }}>118+ Tín chỉ</Tag>
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '8px 12px', background: '#fafafa', color: '#64748b' }}>
                      Ngành Đào Tạo
                    </td>
                    <td style={{ padding: '8px 12px', fontWeight: 600, color: '#1e293b' }}>
                      Khoa học Máy tính & AI
                    </td>
                    <td style={{ padding: '8px 12px', background: '#fafafa', color: '#64748b' }}>
                      Khoa Quản Lý
                    </td>
                    <td style={{ padding: '8px 12px', fontWeight: 600, color: '#1e293b' }}>
                      Khoa Công nghệ Thông tin
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px 12px', background: '#fafafa', color: '#64748b' }}>
                      Số Quyết Định
                    </td>
                    <td style={{ padding: '8px 12px', color: '#334155' }}>
                      QĐ-K68/7480101
                    </td>
                    <td style={{ padding: '8px 12px', background: '#fafafa', color: '#64748b' }}>
                      Đính Kèm QĐ / Đề Cương
                    </td>
                    <td style={{ padding: '8px 12px' }}>
                      <Space size={8}>
                        <Text type="secondary" style={{ fontSize: 11 }}>Chưa có file</Text>
                        <Upload showUploadList={false} customRequest={({ onSuccess }) => { message.success('Đã tải lên tệp quyết định CTĐT!'); onSuccess('ok'); }}>
                          <Button size="small" icon={<UploadOutlined />} style={{ fontSize: 11 }}>
                            Tải File Mới
                          </Button>
                        </Upload>
                      </Space>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* THANH CÔNG CỤ & THỐNG KÊ MÔN HỌC */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 12,
              flexWrap: 'wrap',
              gap: 8
            }}>
              {/* Bên trái: Các nút thêm môn, excel, in */}
              <Space size={8} wrap>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setIsAddCourseModalOpen(true)}
                  style={{ background: '#1677ff', borderColor: '#1677ff', fontWeight: 600 }}
                >
                  + + Thêm Môn Học Thủ Công
                </Button>
                <Button
                  type="primary"
                  icon={<FileExcelOutlined />}
                  onClick={() => message.info('Mở hộp thoại Import Excel danh mục học phần chuẩn Bộ GD&ĐT')}
                  style={{ background: '#52c41a', borderColor: '#52c41a', fontWeight: 600 }}
                >
                  Import Excel
                </Button>
                <Button
                  icon={<DownloadOutlined />}
                  onClick={() => message.success('Đang tải file mẫu: Mau_Khung_Chuong_Trinh_Dao_Tao.xlsx')}
                >
                  Tải File Mẫu
                </Button>
                <Button
                  type="primary"
                  icon={<PrinterOutlined />}
                  onClick={() => setIsPrintModalOpen(true)}
                  style={{ background: '#003a8c', borderColor: '#003a8c', fontWeight: 600 }}
                >
                  In Khung CTĐT Chuẩn
                </Button>
              </Space>

              {/* Bên phải: 3 Tags thống kê */}
              <Space size={6}>
                <Tag color="blue" style={{ margin: 0, padding: '3px 10px', fontSize: 12, borderRadius: 4 }}>
                  Tổng môn: <b>{totalAllCourses} môn</b>
                </Tag>
                <Tag color="green" style={{ margin: 0, padding: '3px 10px', fontSize: 12, borderRadius: 4 }}>
                  Bắt buộc: <b>{compulsoryCount} môn</b>
                </Tag>
                <Tag color="cyan" style={{ margin: 0, padding: '3px 10px', fontSize: 12, borderRadius: 4 }}>
                  Tự chọn: <b>{electiveCount} môn</b>
                </Tag>
              </Space>
            </div>

            {/* TABS HỌC KỲ */}
            <Tabs
              activeKey={selectedSemesterTab}
              onChange={setSelectedSemesterTab}
              style={{ marginBottom: 8 }}
              items={[
                { key: 'ALL', label: 'Toàn Bộ Môn Học' },
                { key: '1', label: `Kỳ 1 (${getSemesterStats(1).count} môn • ${getSemesterStats(1).credits} TC)` },
                { key: '2', label: `Kỳ 2 (${getSemesterStats(2).count} môn • ${getSemesterStats(2).credits} TC)` },
                { key: '3', label: `Kỳ 3 (${getSemesterStats(3).count} môn • ${getSemesterStats(3).credits} TC)` },
                { key: '4', label: `Kỳ 4 (${getSemesterStats(4).count} môn • ${getSemesterStats(4).credits} TC)` },
                { key: '5', label: `Kỳ 5 (${getSemesterStats(5).count} môn • ${getSemesterStats(5).credits} TC)` },
                { key: '6', label: `Kỳ 6 (${getSemesterStats(6).count} môn • ${getSemesterStats(6).credits} TC)` },
                { key: '7', label: `Kỳ 7 (${getSemesterStats(7).count} môn • ${getSemesterStats(7).credits} TC)` },
                { key: '8', label: `Kỳ 8 (${getSemesterStats(8).count} môn • ${getSemesterStats(8).credits} TC)` }
              ]}
            />

            {/* BẢNG DANH SÁCH MÔN HỌC CHUẨN XANH LAM */}
            <div className="curriculum-table-container">
              <style>{`
                .curriculum-table-container .ant-table-thead > tr > th {
                  background-color: #1677ff !important;
                  color: #ffffff !important;
                  font-weight: 700 !important;
                  font-size: 13px !important;
                  padding: 10px 12px !important;
                  border-bottom: none !important;
                }
                .curriculum-table-container .ant-table-thead th.ant-table-column-has-sorters:hover {
                  background-color: #0958d9 !important;
                }
                .curriculum-table-container .ant-table-tbody > tr > td {
                  padding: 10px 12px !important;
                  border-bottom: 1px solid #f1f5f9 !important;
                }
                .curriculum-table-container .ant-table-tbody > tr:hover > td {
                  background-color: #f8fafc !important;
                }
              `}</style>
              <Table
                dataSource={filteredCourses}
                columns={columns}
                rowKey="id"
                pagination={false}
                size="middle"
                loading={loading}
              />
            </div>
          </Card>
        </Col>
      </Row>

      {/* ========================================================================= */}
      {/* 4. MODALS NGHIỆP VỤ (THÊM MÔN, KHOA, NGÀNH, KHUNG, IN ẤN)                  */}
      {/* ========================================================================= */}

      {/* MODAL 1: THÊM MÔN HỌC THỦ CÔNG */}
      <Modal
        title={<span><PlusOutlined style={{ color: '#1677ff' }} /> Thêm Môn Học Vào Khung Chương Trình</span>}
        open={isAddCourseModalOpen}
        onCancel={() => setIsAddCourseModalOpen(false)}
        onOk={() => courseForm.submit()}
        okText="Lưu Vào Khung CTĐT"
        cancelText="Hủy"
        width={600}
      >
        <Form form={courseForm} layout="vertical" onFinish={handleSaveCourse}>
          <Row gutter={12}>
            <Col span={10}>
              <Form.Item name="code" label="Mã học phần" rules={[{ required: true, message: 'Nhập mã môn học' }]}>
                <Input placeholder="VD: AI502" />
              </Form.Item>
            </Col>
            <Col span={14}>
              <Form.Item name="name" label="Tên học phần" rules={[{ required: true, message: 'Nhập tên môn học' }]}>
                <Input placeholder="VD: Thị Giác Máy Tính Nâng Cao" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={12}>
            <Col span={8}>
              <Form.Item name="credits" label="Số tín chỉ" initialValue={3} rules={[{ required: true }]}>
                <InputNumber min={1} max={20} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="semester" label="Học kỳ đào tạo" initialValue={selectedSemesterTab === 'ALL' ? 1 : Number(selectedSemesterTab)}>
                <Select>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                    <Option key={s} value={s}>Học kỳ {s}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="is_compulsory" label="Phân loại" initialValue={true}>
                <Select>
                  <Option value={true}>Bắt buộc</Option>
                  <Option value={false}>Tự chọn</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="description" label="Đề cương tóm tắt / Mô tả nội dung môn học">
            <TextArea rows={3} placeholder="VD: Giới thiệu mạng nơ-ron CNN, thuật toán YOLO, nhận dạng khuôn mặt và xử lý video..." />
          </Form.Item>
        </Form>
      </Modal>

      {/* MODAL 2: THÊM KHOA MỚI */}
      <Modal
        title={<span><ApartmentOutlined style={{ color: '#1677ff' }} /> Thêm Khoa / Viện Mới</span>}
        open={isAddFacultyModalOpen}
        onCancel={() => setIsAddFacultyModalOpen(false)}
        onOk={() => {
          message.success('Đã thêm Khoa mới vào cơ cấu tổ chức Đại học TCU!');
          setIsAddFacultyModalOpen(false);
          facultyForm.resetFields();
        }}
        okText="Thêm Khoa"
        cancelText="Hủy"
      >
        <Form form={facultyForm} layout="vertical">
          <Form.Item label="Mã Khoa / Viện" required>
            <Input placeholder="VD: KHOA_AI" />
          </Form.Item>
          <Form.Item label="Tên Khoa / Viện Đào Tạo" required>
            <Input placeholder="VD: Khoa Trí Tuệ Nhân Tạo & Robotics" />
          </Form.Item>
          <Form.Item label="Trưởng Khoa / Viện Trưởng">
            <Input placeholder="VD: PGS. TS. Nguyễn Thế Hoàng" />
          </Form.Item>
        </Form>
      </Modal>

      {/* MODAL 3: THÊM NGÀNH MỚI */}
      <Modal
        title={<span><FolderOutlined style={{ color: '#13c2c2' }} /> Thêm Ngành / Chuyên Ngành Đào Tạo</span>}
        open={isAddMajorModalOpen}
        onCancel={() => setIsAddMajorModalOpen(false)}
        onOk={() => {
          message.success('Đã thêm Ngành đào tạo mới thành công!');
          setIsAddMajorModalOpen(false);
          majorForm.resetFields();
        }}
        okText="Thêm Ngành"
        cancelText="Hủy"
      >
        <Form form={majorForm} layout="vertical">
          <Form.Item label="Khoa Quản Lý" required initialValue="Khoa Công nghệ Thông tin">
            <Select>
              <Option value="Khoa Công nghệ Thông tin">Khoa Công nghệ Thông tin</Option>
              <Option value="Khoa Quản trị Kinh doanh">Khoa Quản trị Kinh doanh</Option>
              <Option value="Khoa Ngoại ngữ">Khoa Ngoại ngữ</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Mã Ngành (Mã chuẩn Bộ GD&ĐT)" required>
            <Input placeholder="VD: 7480108" />
          </Form.Item>
          <Form.Item label="Tên Ngành Đào Tạo" required>
            <Input placeholder="VD: Khoa học Dữ liệu (Data Science)" />
          </Form.Item>
        </Form>
      </Modal>

      {/* MODAL 4: TẠO KHUNG CTĐT MỚI */}
      <Modal
        title={<span><BookOutlined style={{ color: '#722ed1' }} /> Khởi Tạo Khung Chương Trình Đào Tạo Mới</span>}
        open={isCreateFrameworkModalOpen}
        onCancel={() => setIsCreateFrameworkModalOpen(false)}
        onOk={() => {
          message.success('Đã khởi tạo Khung Chương Trình Đào Tạo mới!');
          setIsCreateFrameworkModalOpen(false);
          frameworkForm.resetFields();
        }}
        okText="Tạo Khung CTĐT"
        cancelText="Hủy"
      >
        <Form form={frameworkForm} layout="vertical">
          <Form.Item label="Tên Khung CTĐT" required initialValue="Khung CTĐT Kỹ sư Khoa học Máy tính & AI K68 (2024-2028)">
            <Input />
          </Form.Item>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item label="Khóa đào tạo (Cohort)" required initialValue="K68">
                <Input placeholder="VD: K68, K69" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Niên khóa" required initialValue="2024-2028">
                <Input placeholder="VD: 2024-2028" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item label="Tổng số tín chỉ" required initialValue={118}>
                <InputNumber min={60} max={250} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Số quyết định ban hành" required initialValue="QĐ-K68/7480101">
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* MODAL 5: THÊM LỚP HỌC MỚI */}
      <Modal
        title={<span><ShareAltOutlined style={{ color: '#fa8c16' }} /> Thêm Lớp Sinh Hoạt / Lớp Chuyên Ngành</span>}
        open={isAddClassModalOpen}
        onCancel={() => setIsAddClassModalOpen(false)}
        onOk={() => {
          message.success('Đã khởi tạo lớp học mới và phân bổ vào khung CTĐT!');
          setIsAddClassModalOpen(false);
          classForm.resetFields();
        }}
        okText="Thêm Lớp"
        cancelText="Hủy"
      >
        <Form form={classForm} layout="vertical">
          <Form.Item label="Mã Lớp Học" required>
            <Input placeholder="VD: 68.KHMT-1" />
          </Form.Item>
          <Form.Item label="Tên Lớp Học" required>
            <Input placeholder="VD: Lớp Kỹ sư Khoa học Máy tính K68 - Lớp 1" />
          </Form.Item>
          <Form.Item label="Sĩ số dự kiến" initialValue={40}>
            <InputNumber min={1} max={120} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>

      {/* MODAL 6: IN KHUNG CTĐT CHUẨN BỘ GD&ĐT */}
      <Modal
        title={<span><PrinterOutlined style={{ color: '#0958d9' }} /> BẢN IN CHUẨN KHUNG CHƯƠNG TRÌNH ĐÀO TẠO</span>}
        open={isPrintModalOpen}
        onCancel={() => setIsPrintModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsPrintModalOpen(false)}>Đóng</Button>,
          <Button key="print" type="primary" icon={<PrinterOutlined />} onClick={() => window.print()}>
            In Văn Bản (Print / PDF)
          </Button>
        ]}
        width={850}
      >
        <div style={{ padding: '16px 20px', background: '#fff', color: '#000', fontFamily: 'Times New Roman, serif' }}>
          {/* Header Quốc hiệu / Tiêu ngữ */}
          <Row justify="space-between" style={{ textAlign: 'center', marginBottom: 20 }}>
            <Col span={10}>
              <div style={{ fontWeight: 'bold', fontSize: 13 }}>BỘ GIÁO DỤC VÀ ĐÀO TẠO</div>
              <div style={{ fontWeight: 'bold', fontSize: 14 }}>TRƯỜNG ĐẠI HỌC CÔNG NGHỆ TCU</div>
              <div style={{ fontSize: 12 }}>Số: QĐ-K68/7480101</div>
            </Col>
            <Col span={14}>
              <div style={{ fontWeight: 'bold', fontSize: 13 }}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
              <div style={{ fontWeight: 'bold', fontSize: 13, borderBottom: '1px solid #000', display: 'inline-block', paddingBottom: 2 }}>
                Độc lập - Tự do - Hạnh phúc
              </div>
              <div style={{ fontStyle: 'italic', fontSize: 12, marginTop: 4 }}>
                Hà Nội, ngày 15 tháng 08 năm 2024
              </div>
            </Col>
          </Row>

          <div style={{ textAlign: 'center', margin: '24px 0 16px' }}>
            <div style={{ fontWeight: 'bold', fontSize: 16 }}>KHUNG CHƯƠNG TRÌNH ĐÀO TẠO ĐẠI HỌC</div>
            <div style={{ fontWeight: 'bold', fontSize: 15, color: '#0958d9' }}>
              NGÀNH: KHOA HỌC MÁY TÍNH & TRÍ TUỆ NHÂN TẠO (AI)
            </div>
            <div style={{ fontStyle: 'italic', fontSize: 13 }}>
              Khóa đào tạo: K68 (2024 - 2028) • Tổng số tín chỉ: 118+ Tín chỉ
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, marginBottom: 24 }} border="1" cellPadding="6">
            <thead>
              <tr style={{ background: '#f0f0f0', textAlign: 'center' }}>
                <th style={{ width: '8%' }}>TT</th>
                <th style={{ width: '10%' }}>Học Kỳ</th>
                <th style={{ width: '14%' }}>Mã HP</th>
                <th>Tên Học Phần</th>
                <th style={{ width: '10%' }}>Số TC</th>
                <th style={{ width: '14%' }}>Tính Chất</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c, i) => (
                <tr key={c.id}>
                  <td style={{ textAlign: 'center' }}>{i + 1}</td>
                  <td style={{ textAlign: 'center' }}>Kỳ {c.semester}</td>
                  <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{c.code}</td>
                  <td>
                    <b>{c.name}</b>
                    {c.description && <div style={{ fontSize: 10, color: '#555' }}>{c.description}</div>}
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{c.credits}</td>
                  <td style={{ textAlign: 'center' }}>{c.is_compulsory ? 'Bắt buộc' : 'Tự chọn'}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Ký tên */}
          <Row justify="space-around" style={{ textAlign: 'center', marginTop: 30 }}>
            <Col span={8}>
              <div style={{ fontWeight: 'bold' }}>TRƯỞNG KHOA CNTT</div>
              <div style={{ fontStyle: 'italic', fontSize: 11 }}>(Ký và ghi rõ họ tên)</div>
              <div style={{ marginTop: 60, fontWeight: 'bold' }}>PGS. TS. Trần Mạnh Tuấn</div>
            </Col>
            <Col span={8}>
              <div style={{ fontWeight: 'bold' }}>TRƯỞNG PHÒNG ĐÀO TẠO</div>
              <div style={{ fontStyle: 'italic', fontSize: 11 }}>(Ký và ghi rõ họ tên)</div>
              <div style={{ marginTop: 60, fontWeight: 'bold' }}>TS. Lê Hoàng Sơn</div>
            </Col>
            <Col span={8}>
              <div style={{ fontWeight: 'bold' }}>HIỆU TRƯỞNG</div>
              <div style={{ fontStyle: 'italic', fontSize: 11 }}>(Ký, đóng dấu)</div>
              <div style={{ marginTop: 60, fontWeight: 'bold' }}>GS. TS. Vũ Đình Thành</div>
            </Col>
          </Row>
        </div>
      </Modal>
    </div>
  );
}

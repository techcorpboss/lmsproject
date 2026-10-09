import React, { useState, useEffect } from 'react';
import {
  Layout, Menu, Typography, Space, Button, Dropdown, Avatar, Tag, Badge,
  Tooltip, message, Card, Divider
} from 'antd';
import {
  BookOutlined, EditOutlined, DatabaseOutlined, ThunderboltOutlined,
  VideoCameraOutlined, UserOutlined, GlobalOutlined, LogoutOutlined,
  DashboardOutlined, TeamOutlined, SafetyCertificateOutlined, SwapOutlined,
  MenuFoldOutlined, MenuUnfoldOutlined, BellOutlined, ApartmentOutlined,
  RobotOutlined, AuditOutlined, FileTextOutlined, CloudSyncOutlined,
  HistoryOutlined, CheckCircleOutlined, ExclamationCircleOutlined,
  BankOutlined, SolutionOutlined, SettingOutlined, CrownOutlined,
  CommentOutlined, RocketOutlined, PlaySquareOutlined, LinkOutlined,
  TrophyOutlined, CreditCardOutlined
} from '@ant-design/icons';
import apiClient from './services/apiClient';
import LoginPage from './components/LoginPage';
import AcademicLmsWorkspace from './components/AcademicLmsWorkspace';
import CourseHierarchySelector from './components/CourseHierarchySelector';
import QuestionBankView from './components/QuestionBankView';
import ExamGeneratorView from './components/ExamGeneratorView';
import LiveProctoringView from './components/LiveProctoringView';
import OnlineExamRoom from './components/OnlineExamRoom';
import NotificationCenter from './components/NotificationCenter';

// Enterprise Components
import TeachingAssignmentView from './components/enterprise/TeachingAssignmentView';
import AiAuthoringStudio from './components/enterprise/AiAuthoringStudio';
import ExamAppraisalView from './components/enterprise/ExamAppraisalView';
import MoetGradebookView from './components/enterprise/MoetGradebookView';
import InstitutionalCatalogView from './components/enterprise/InstitutionalCatalogView';
import LecturerDirectoryView from './components/enterprise/LecturerDirectoryView';
import ScormXapiCenterView from './components/enterprise/ScormXapiCenterView';
import LtiToolsHubView from './components/enterprise/LtiToolsHubView';
import LessonQaAndAssignmentView from './components/enterprise/LessonQaAndAssignmentView';
import ExamAdministrationView from './components/enterprise/ExamAdministrationView';
import OpenBadgesShowcase from './components/enterprise/OpenBadgesShowcase';
import GraduationThesisView from './components/enterprise/GraduationThesisView';
import CloPloAssessmentView from './components/enterprise/CloPloAssessmentView';
import TuitionPaymentView from './components/enterprise/TuitionPaymentView';
import AiTutorDrawer from './components/enterprise/AiTutorDrawer';


// Admin Views
import UserManagementView from './components/admin/UserManagementView';
import StudentDirectoryView from './components/admin/StudentDirectoryView';
import CurriculumManagerView from './components/admin/CurriculumManagerView';
import ErpSyncHubView from './components/admin/ErpSyncHubView';
import BackupRestoreView from './components/admin/BackupRestoreView';
import SystemMonitorView from './components/admin/SystemMonitorView';
import AuditLogView from './components/admin/AuditLogView';
import AccessibilityToolbar from './components/common/AccessibilityToolbar';
import PwaInstallPrompt from './components/common/PwaInstallPrompt';

import './App.css';


const { Header, Content, Footer, Sider } = Layout;
const { Title, Text } = Typography;

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [activeMenuKey, setActiveMenuKey] = useState('lms_workspace');
  const [selectedSectionId, setSelectedSectionId] = useState(1);
  const [isAiTutorOpen, setIsAiTutorOpen] = useState(false);
  const [openKeys, setOpenKeys] = useState([
    'sub_superadmin',
    'sub_academic',
    'sub_catalogs',
    'sub_ai_testing',
    'sub_admin_sys'
  ]);

  const normalizeUserData = (user) => {
    if (!user) return null;
    let role = (user.role || '').toLowerCase();
    const isSuperAdminAccount =
      user.username === 'superadmin' ||
      user.username === 'boss.techcorp' ||
      user.full_name?.toLowerCase().includes('superadmin') ||
      user.email?.toLowerCase().includes('superadmin');

    if (isSuperAdminAccount) {
      role = 'superadmin';
    }
    return { ...user, role };
  };

  const userRole = ((currentUser?.username === 'superadmin' || currentUser?.username === 'boss.techcorp' || currentUser?.email?.toLowerCase().includes('superadmin') || currentUser?.full_name?.toLowerCase().includes('superadmin')) ? 'superadmin' : (currentUser?.role || '')).toLowerCase();
  const isSuperAdmin = userRole === 'superadmin';
  const isAdmin = userRole === 'admin' || isSuperAdmin;
  const isTeacher = userRole === 'teacher';
  const isTeacherOrAdmin = isTeacher || isAdmin;

  // Tự động chuyển đổi nếu Giảng viên đang ở URL phòng thi của thí sinh
  useEffect(() => {
    if (isTeacher && activeMenuKey === 'exam_room') {
      setActiveMenuKey('lms_workspace');
    }
  }, [isTeacher, activeMenuKey]);

  // Khôi phục phiên đăng nhập hoặc nhận SSO từ URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ssoToken = params.get('sso_token');
    const roleParam = params.get('role');

    if (ssoToken) {
      localStorage.setItem('lms_token', ssoToken);
      const ssoUser = normalizeUserData({
        id: 3,
        username: 'sso_student',
        full_name: 'Học viên ĐH (SSO TCU COMPASS)',
        role: roleParam || 'student'
      });
      setCurrentUser(ssoUser);
      localStorage.setItem('lms_user', JSON.stringify(ssoUser));
      message.success('Đăng nhập thành công qua liên thông TCU COMPASS ERP (SSO)!');
    } else {
      const savedUser = localStorage.getItem('lms_user');
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          const normalized = normalizeUserData(parsed);
          setCurrentUser(normalized);
          localStorage.setItem('lms_user', JSON.stringify(normalized));
        } catch (e) {
          localStorage.removeItem('lms_user');
        }
      }
    }
  }, []);

  const handleLoginSuccess = (user) => {
    const normalized = normalizeUserData(user);
    setCurrentUser(normalized);
    localStorage.setItem('lms_user', JSON.stringify(normalized));
  };

  const handleLogout = () => {
    localStorage.removeItem('lms_token');
    localStorage.removeItem('lms_user');
    setCurrentUser(null);
    message.info('Đã đăng xuất khỏi hệ thống.');
  };

  // CHUYỂN ĐỔI TÀI KHOẢN XÁC THỰC THỰC TẾ QUA CSDL MYSQL
  const handleSwitchAccount = async (targetUsername) => {
    try {
      const res = await apiClient.post('/auth/login', {
        username: targetUsername,
        password: 'root123@'
      });
      if (res && res.success && res.user) {
        const normalized = normalizeUserData(res.user);
        localStorage.setItem('lms_token', res.token);
        localStorage.setItem('lms_user', JSON.stringify(normalized));
        setCurrentUser(normalized);
        setActiveMenuKey('lms_workspace');
        message.success(`Đã chuyển sang tài khoản CSDL: ${normalized.full_name} (${normalized.role.toUpperCase()})`);
      }
    } catch (err) {
      message.error('Không thể chuyển đổi tài khoản: ' + (err.message || 'Lỗi'));
    }
  };

  // NẾU CHƯA ĐĂNG NHẬP -> HIỂN THỊ CỔNG ĐĂNG NHẬP CHUẨN QUỐC TẾ
  if (!currentUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // MENU PROFILE
  const userMenu = {
    items: [
      {
        key: 'header_role',
        label: (
          <div style={{ padding: '4px 0' }}>
            <Text type="secondary" style={{ fontSize: 11, display: 'block' }}>VAI TRÒ & ĐƠN VỊ CSDL</Text>
            <b>
              {currentUser.role === 'superadmin' ? '👑 SuperAdmin' :
               currentUser.role === 'admin' ? '⚡ Quản trị viên (Admin)' :
               currentUser.role === 'teacher' ? '👨‍🏫 Giảng Viên' : '🎓 Sinh Viên'}
            </b>
            <div style={{ fontSize: 12, color: '#0958d9' }}>{currentUser.faculty_name}</div>
            {currentUser.student_code && (
              <div style={{ fontSize: 11, color: '#64748b' }}>MSSV: {currentUser.student_code} • {currentUser.class_name}</div>
            )}
          </div>
        ),
        disabled: true
      },
      { type: 'divider' },
      {
        key: 'switch_superadmin',
        icon: <CrownOutlined style={{ color: '#7c3aed' }} />,
        label: '👑 Chuyển sang Chủ dự án (SuperAdmin)',
        onClick: () => handleSwitchAccount('superadmin')
      },
      {
        key: 'switch_admin',
        icon: <SwapOutlined style={{ color: '#d97706' }} />,
        label: '⚡ Chuyển sang Quản trị viên (Admin)',
        onClick: () => handleSwitchAccount('admin')
      },
      {
        key: 'switch_gv_cntt',
        icon: <SwapOutlined style={{ color: '#16a34a' }} />,
        label: '👨‍🏫 Chuyển sang Giảng viên (TS. Hoàng Đức Em)',
        onClick: () => handleSwitchAccount('em.hd')
      },
      {
        key: 'switch_sv_cntt',
        icon: <SwapOutlined style={{ color: '#2563eb' }} />,
        label: '🎓 Chuyển sang Sinh viên (Trần Văn Nam)',
        onClick: () => handleSwitchAccount('sv_cntt')
      },
      { type: 'divider' },
      {
        key: 'logout',
        icon: <LogoutOutlined style={{ color: '#ff4d4f' }} />,
        label: <span style={{ color: '#ff4d4f' }}>Đăng xuất khỏi hệ thống</span>,
        onClick: handleLogout
      }
    ]
  };

  const getRoleTag = (role) => {
    const r = (role || '').toLowerCase();
    const isSuper = r === 'superadmin' || currentUser?.username === 'superadmin' || currentUser?.username === 'boss.techcorp';
    if (isSuper) return <Tag color="purple" style={{ borderRadius: 12, padding: '2px 10px', fontWeight: 700, border: '1px solid #7c3aed' }}>👑 CHỦ DỰ ÁN (SUPERADMIN)</Tag>;
    if (r === 'student') return <Tag color="blue" style={{ borderRadius: 12, padding: '2px 10px', fontWeight: 600 }}>🎓 SINH VIÊN</Tag>;
    if (r === 'teacher') return <Tag color="green" style={{ borderRadius: 12, padding: '2px 10px', fontWeight: 600 }}>👨‍🏫 GIẢNG VIÊN BỘ MÔN</Tag>;
    return <Tag color="gold" style={{ borderRadius: 12, padding: '2px 10px', fontWeight: 600 }}>⚡ QUẢN TRỊ VIÊN</Tag>;
  };

  // CẤU TRÚC MENU SIDEBAR ĐA TẦNG CHO TỪNG VAI TRÒ
  const getSidebarMenuItems = () => {
    const userRole = ((currentUser?.username === 'superadmin' || currentUser?.username === 'boss.techcorp' || currentUser?.email?.toLowerCase().includes('superadmin') || currentUser?.full_name?.toLowerCase().includes('superadmin')) ? 'superadmin' : (currentUser?.role || '')).toLowerCase();
    const isSuperAdmin = userRole === 'superadmin';
    const isAdmin = userRole === 'admin' || isSuperAdmin;
    const isTeacherOrAdmin = userRole === 'teacher' || isAdmin;

    const items = [
      ...(isSuperAdmin ? [
        {
          key: 'sub_superadmin',
          icon: <CrownOutlined style={{ color: '#c084fc', fontSize: 16 }} />,
          label: <span style={{ fontWeight: 700, color: '#e9d5ff' }}>👑 Đặc Quyền SuperAdmin</span>,
          children: [
            {
              key: 'user_management',
              icon: <UserOutlined style={{ color: '#c084fc' }} />,
              label: 'Toàn Quyền Quản Trị User'
            },
            {
              key: 'erp_sync',
              icon: <CloudSyncOutlined style={{ color: '#38bdf8' }} />,
              label: 'Liên Thông Cổng HEMIS & ERP'
            },
            {
              key: 'system_monitor',
              icon: <DashboardOutlined style={{ color: '#facc15' }} />,
              label: 'Giám Sát Server & Máy Chủ Live'
            },
            {
              key: 'backup_restore',
              icon: <DatabaseOutlined style={{ color: '#f43f5e' }} />,
              label: 'Sao Lưu & Phục Hồi CSDL'
            },
            {
              key: 'audit_logs',
              icon: <HistoryOutlined style={{ color: '#4ade80' }} />,
              label: 'Nhật Ký An Ninh & Audit Logs'
            },
            {
              key: 'exam_administration',
              icon: <SolutionOutlined style={{ color: '#c084fc' }} />,
              label: 'Quản Lý Tổ Chức Thi & Cấp Quyền'
            }
          ]
        }
      ] : []),
      {
        key: 'sub_academic',
        icon: <BookOutlined style={{ color: '#1677ff' }} />,
        label: isTeacher ? 'Giảng Dạy & Lớp Học Phần' : (isAdmin ? 'Phân Hệ Đào Tạo & LMS' : 'Học Tập & Lớp Học Phần'),
        children: [
          {
            key: 'lms_workspace',
            icon: <BookOutlined />,
            label: isTeacher ? 'Soạn Bài Giảng 15 Tuần (LMS)' : (isAdmin ? 'Soạn & Quản Lý 15 Tuần' : 'Lớp Học Phần (15 Tuần)')
          },
          {
            key: 'lesson_qa_assignments',
            icon: <CommentOutlined style={{ color: '#6366f1' }} />,
            label: isTeacher ? 'Diễn Đàn Q&A & Đánh Giá Bài Tập' : 'Diễn Đàn Q&A & Bài Tập'
          },
          {
            key: 'scorm_xapi_center',
            icon: <RocketOutlined style={{ color: '#fa541c' }} />,
            label: 'Học Liệu SCORM & xAPI'
          },
          ...(isAdmin ? [
            {
              key: 'lti_tools_hub',
              icon: <ApartmentOutlined style={{ color: '#52c41a' }} />,
              label: 'Công Cụ LTI 1.3 (3rd Party)'
            },
            {
              key: 'hierarchy_assignment',
              icon: <ApartmentOutlined />,
              label: 'Phân Công Giảng Dạy'
            }
          ] : []),
          {
            key: 'moet_gradebook',
            icon: <FileTextOutlined />,
            label: isTeacher ? 'Sổ Điểm Học Phần & Bảng Điểm In' : (isAdmin ? 'Sổ Điểm & Bảng Điểm In' : 'Bảng Điểm Cá Nhân')
          },
          {
            key: 'open_badges',
            icon: <TrophyOutlined style={{ color: '#eab308' }} />,
            label: 'Huy Hiệu & Chứng Chỉ Số (Open Badges)'
          },
          {
            key: 'graduation_thesis',
            icon: <SolutionOutlined style={{ color: '#10b981' }} />,
            label: '🎓 Đồ Án & Khóa Luận Tốt Nghiệp'
          },
          {
            key: 'clo_plo_assessment',
            icon: <SafetyCertificateOutlined style={{ color: '#8b5cf6' }} />,
            label: '📊 Đo Lường Chuẩn Đầu Ra (CLO/PLO)'
          },
          {
            key: 'tuition_payment',
            icon: <CreditCardOutlined style={{ color: '#059669' }} />,
            label: '💳 Học Phí & Lệ Phí Điện Tử (VietQR)'
          },
          ...(isAdmin ? [
            {
              key: 'curriculum_framework',
              icon: <AuditOutlined />,
              label: 'Khung Chương trình Đào Tạo'
            }
          ] : [])
        ]

      },
      ...(isAdmin ? [
        {
          key: 'sub_catalogs',
          icon: <BankOutlined style={{ color: '#13c2c2' }} />,
          label: 'Danh Mục & Cơ Cấu Trường',
          children: [
            {
              key: 'institutional_catalogs',
              icon: <ApartmentOutlined style={{ color: '#13c2c2' }} />,
              label: 'Khoa, Ngành & Khóa, Lớp'
            },
            {
              key: 'lecturer_directory',
              icon: <SolutionOutlined style={{ color: '#52c41a' }} />,
              label: 'Danh Sách Giảng Viên'
            }
          ]
        }
      ] : []),
      {
        key: 'sub_ai_testing',
        icon: <RobotOutlined style={{ color: '#722ed1' }} />,
        label: isTeacher ? 'Chuyên Môn Bộ Môn & Khảo Thí' : 'AI & Khảo Thí Điện Tử',
        children: [
          ...(isTeacherOrAdmin ? [
            {
              key: 'ai_studio',
              icon: <RobotOutlined style={{ color: '#722ed1' }} />,
              label: 'AI Teaching & Exam Studio'
            },
            {
              key: 'question_bank',
              icon: <DatabaseOutlined />,
              label: isTeacher ? 'Ngân Hàng Câu Hỏi Bộ Môn' : 'Ngân Hàng Câu Hỏi'
            },
            {
              key: 'exam_generator',
              icon: <ThunderboltOutlined />,
              label: isTeacher ? 'Động Cơ Ma Trận & Sinh Đề' : 'Động Cơ Ma Trận Sinh Đề'
            },
            {
              key: 'exam_appraisal',
              icon: <SafetyCertificateOutlined style={{ color: '#10b981' }} />,
              label: 'Thẩm Định Đề & Biên Bản'
            },
            ...(isAdmin ? [
              {
                key: 'exam_administration',
                icon: <SolutionOutlined style={{ color: '#10b981' }} />,
                label: 'Quản Lý Tổ Chức Thi'
              }
            ] : []),
            {
              key: 'live_proctoring',
              icon: <VideoCameraOutlined style={{ color: '#ff4d4f' }} />,
              label: isTeacher ? 'Phòng Điều Hành Coi Thi & Giám Thị AI' : 'Giám Thị AI Webcam Live'
            },
            ...(isSuperAdmin ? [
              {
                key: 'exam_room',
                icon: <EditOutlined style={{ color: '#fa8c16' }} />,
                label: 'Phòng Thi Trực Tuyến (Trải Nghiệm SV)'
              }
            ] : [])
          ] : [
            {
              key: 'exam_room',
              icon: <EditOutlined style={{ color: '#fa8c16' }} />,
              label: 'Phòng Thi Trực Tuyến (Làm Bài Thi)'
            }
          ])
        ]
      }
    ];

    if (isAdmin) {
      items.push({
        key: 'sub_admin_sys',
        icon: <SettingOutlined style={{ color: '#fa8c16' }} />,
        label: 'Quản Trị Hệ Thống',
        children: [
          {
            key: 'user_management',
            icon: <UserOutlined />,
            label: 'Quản Lý Tài Khoản'
          },
          {
            key: 'student_directory',
            icon: <TeamOutlined />,
            label: 'Danh Sách Học Viên'
          },
          {
            key: 'erp_sync',
            icon: <CloudSyncOutlined style={{ color: '#fa8c16' }} />,
            label: 'Cổng Liên Thông ERP'
          },
          {
            key: 'backup_restore',
            icon: <DatabaseOutlined style={{ color: '#eb2f96' }} />,
            label: 'Sao Lưu & Backup CSDL'
          },
          {
            key: 'system_monitor',
            icon: <DashboardOutlined style={{ color: '#faad14' }} />,
            label: 'Giám Sát Hệ Thống'
          },
          {
            key: 'audit_logs',
            icon: <HistoryOutlined style={{ color: '#52c41a' }} />,
            label: 'Nhật Ký Audit Logs'
          }
        ]
      });
    }

    return items;
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* 1. SIDEBAR PHÓNG TO / THU GỌN CHUYÊN NGHIỆP */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={260}
        collapsedWidth={80}
        theme="dark"
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'sticky',
          top: 0,
          left: 0,
          background: '#07162c',
          boxShadow: '2px 0 10px rgba(0,0,0,0.25)',
          zIndex: 100
        }}
        trigger={null}
      >
        {/* LOGO NHẬN DIỆN THƯƠNG HIỆU */}
        <div
          style={{
            padding: collapsed ? '16px 8px' : '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(0,0,0,0.15)',
            justifyContent: collapsed ? 'center' : 'flex-start'
          }}
        >
          <div
            style={{
              width: collapsed ? 40 : 44,
              height: collapsed ? 40 : 44,
              borderRadius: 10,
              background: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 3,
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              flexShrink: 0
            }}
          >
            <img
              src="/logo-techcorp.png"
              alt="TechCorp Logo"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>

          {!collapsed && (
            <div style={{ overflow: 'hidden' }}>
              <div style={{ color: '#ffffff', fontWeight: 800, fontSize: 15, letterSpacing: '0.5px', lineHeight: 1.2 }}>
                TECHCORP LMS
              </div>
              <div style={{ color: '#fa8c16', fontSize: 10, fontWeight: 700, letterSpacing: '0.4px', marginTop: 2 }}>
                E-TESTING PRO
              </div>
            </div>
          )}
        </div>

        {/* DANH MỤC ĐIỀU HƯỚNG */}
        <Menu
          theme="dark"
          mode="inline"
          openKeys={openKeys}
          onOpenChange={(keys) => setOpenKeys(keys)}
          selectedKeys={[activeMenuKey]}
          onClick={({ key }) => setActiveMenuKey(key)}
          style={{ background: 'transparent', borderRight: 0, marginTop: 12 }}
          items={getSidebarMenuItems()}
        />
      </Sider>

      {/* 2. MAIN LAYOUT (HEADER + CONTENT + FOOTER) */}
      <Layout>
        {/* TOP HEADER */}
        <Header
          style={{
            background: '#ffffff',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 99,
            height: 64,
            boxShadow: '0 1px 4px rgba(0,21,41,0.08)',
            borderBottom: '1px solid #e2e8f0'
          }}
        >
          {/* NÚT THU GỌN SIDEBAR & THÔNG TIN LỚP HỌC PHẦN */}
          <Space size="middle" align="middle">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: 16, width: 40, height: 40 }}
            />

            <Space wrap>
              <Tag color="geekblue" icon={<ApartmentOutlined />} style={{ borderRadius: 6, padding: '3px 8px' }}>
                Học kỳ 1 • 2026-2027
              </Tag>
              {isTeacher ? (
                <>
                  <Tag color="cyan" style={{ borderRadius: 6, padding: '3px 10px', fontWeight: 600 }}>
                    🏛️ {currentUser?.faculty_name || 'Khoa Công Nghệ Thông Tin'}
                  </Tag>
                  <Tag color="purple" style={{ borderRadius: 6, padding: '3px 10px', fontWeight: 600 }}>
                    🏢 {currentUser?.department_name || currentUser?.major_name || 'Bộ Môn Kỹ Thuật Phần Mềm'}
                  </Tag>
                </>
              ) : (
                <Tag color="cyan" style={{ borderRadius: 6, padding: '3px 8px' }}>
                  {currentUser?.faculty_name || 'Toàn trường'} {currentUser?.class_name ? `• ${currentUser.class_name}` : ''}
                </Tag>
              )}
            </Space>
          </Space>

          {/* CHUÔNG THÔNG BÁO & USER AVATAR */}
          <Space size="middle" align="middle">
            {/* Realtime Academic Notification & Alert Center */}
            <NotificationCenter
              currentUser={currentUser}
              onNavigate={(menuKey) => setActiveMenuKey(menuKey)}
            />

            <Divider type="vertical" />

            {getRoleTag(currentUser.role)}

            <Dropdown menu={userMenu} placement="bottomRight" arrow>
              <Button
                type="text"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '4px 12px',
                  borderRadius: 20,
                  height: 38
                }}
              >
                <Avatar
                  size={30}
                  style={{
                    backgroundColor: currentUser.role === 'superadmin' ? '#7c3aed' : currentUser.role === 'admin' ? '#faad14' : currentUser.role === 'teacher' ? '#52c41a' : '#1677ff',
                    fontWeight: 700
                  }}
                  icon={<UserOutlined />}
                />
                <span style={{ fontWeight: 600, color: '#1e293b', fontSize: 13 }}>{currentUser.full_name}</span>
              </Button>
            </Dropdown>
          </Space>
        </Header>

        {/* NỘI DUNG CHÍNH (CONTENT AREA) */}
        <Content style={{ padding: '20px 24px', minHeight: 'calc(100vh - 130px)' }}>
          {/* Màn hình 1: Quản lý bài giảng 15 tuần */}
          {activeMenuKey === 'lms_workspace' && (
            <div>
              <CourseHierarchySelector
                selectedSectionId={selectedSectionId}
                onSelectSection={(id) => setSelectedSectionId(id)}
                currentUser={currentUser}
              />
              <AcademicLmsWorkspace
                sectionId={selectedSectionId}
                role={currentUser.role === 'student' ? 'STUDENT' : 'LECTURER'}
                studentId={currentUser.role === 'student' ? currentUser.id : null}
                lecturerName={currentUser.role === 'teacher' ? currentUser.full_name : 'TS. Hoàng Đức Em'}
              />
            </div>
          )}

          {/* Màn hình 1.1: Diễn đàn Q&A Từng Bài Học & Bài Tập Tự Luận */}
          {activeMenuKey === 'lesson_qa_assignments' && (
            <LessonQaAndAssignmentView currentUser={currentUser} />
          )}

          {/* Màn hình 1.2: Học liệu Chuẩn SCORM 1.2 / 2004 & xAPI (Tin Can / cmi5) */}
          {activeMenuKey === 'scorm_xapi_center' && (
            <ScormXapiCenterView currentUser={currentUser} />
          )}

          {/* Màn hình 1.3: Cổng tích hợp công cụ giáo dục bên thứ ba LTI 1.3 / LTI Advantage */}
          {activeMenuKey === 'lti_tools_hub' && (
            <LtiToolsHubView currentUser={currentUser} />
          )}

          {/* Màn hình 2: Phân công giảng dạy */}
          {activeMenuKey === 'hierarchy_assignment' && (
            <TeachingAssignmentView currentUser={currentUser} />
          )}

          {/* Màn hình 2.1: Khoa, Ngành & Khóa, Lớp */}
          {activeMenuKey === 'institutional_catalogs' && (
            <InstitutionalCatalogView />
          )}

          {/* Màn hình 2.2: Danh sách Giảng viên */}
          {activeMenuKey === 'lecturer_directory' && (
            <LecturerDirectoryView />
          )}

          {/* Màn hình 3: AI Teaching Studio */}
          {activeMenuKey === 'ai_studio' && (
            <AiAuthoringStudio />
          )}

          {/* Màn hình 4: Thẩm định đề thi & Biên bản số */}
          {activeMenuKey === 'exam_appraisal' && (
            <ExamAppraisalView />
          )}

          {/* Màn hình Quản trị Tổ chức thi & Cấp quyền dự thi */}
          {activeMenuKey === 'exam_administration' && (
            <ExamAdministrationView currentUser={currentUser} />
          )}

          {/* Màn hình 5: Sổ điểm & Mẫu in chuẩn Bộ GD&ĐT */}
          {activeMenuKey === 'moet_gradebook' && (
            <MoetGradebookView currentUser={currentUser} selectedSectionId={selectedSectionId} />
          )}

          {/* Màn hình 5.1: Huy hiệu & Chứng chỉ số Open Badges v3.0 */}
          {activeMenuKey === 'open_badges' && (
            <OpenBadgesShowcase currentUser={currentUser} />
          )}

          {/* Màn hình 5.2: Quản lý Khóa Luận & Đồ Án Tốt Nghiệp */}
          {activeMenuKey === 'graduation_thesis' && (
            <GraduationThesisView currentUser={currentUser} />
          )}

          {/* Màn hình 5.3: Đo lường Chuẩn Đầu Ra CLO / PLO (AUN-QA / ABET) */}
          {activeMenuKey === 'clo_plo_assessment' && (
            <CloPloAssessmentView currentUser={currentUser} />
          )}

          {/* Màn hình 5.4: Học phí & Lệ phí điện tử VietQR NAPAS 24/7 */}
          {activeMenuKey === 'tuition_payment' && (
            <TuitionPaymentView currentUser={currentUser} />
          )}


          {/* Màn hình 6: Khung đào tạo độc lập */}
          {activeMenuKey === 'curriculum_framework' && (
            <CurriculumManagerView currentUser={currentUser} />
          )}

          {/* Màn hình 7: Ngân hàng câu hỏi */}
          {activeMenuKey === 'question_bank' && (
            <QuestionBankView />
          )}

          {/* Màn hình 8: Động cơ sinh đề thi */}
          {activeMenuKey === 'exam_generator' && (
            <ExamGeneratorView />
          )}

          {/* Màn hình 9: Giám thị AI Live */}
          {activeMenuKey === 'live_proctoring' && (
            <LiveProctoringView />
          )}

          {/* Màn hình 10: Phòng thi trực tuyến */}
          {activeMenuKey === 'exam_room' && (
            <OnlineExamRoom currentUser={currentUser} onNavigate={(key) => setActiveMenuKey(key)} />
          )}

          {/* Màn hình 11: Quản lý tài khoản (Admin) */}
          {activeMenuKey === 'user_management' && (
            <UserManagementView />
          )}

          {/* Màn hình 12: Danh sách học viên (Admin) */}
          {activeMenuKey === 'student_directory' && (
            <StudentDirectoryView />
          )}

          {/* Màn hình 13: Cổng liên thông ERP (Admin) */}
          {activeMenuKey === 'erp_sync' && (
            <ErpSyncHubView />
          )}

          {/* Màn hình 14: Sao lưu & Phục hồi CSDL (Admin) */}
          {activeMenuKey === 'backup_restore' && (
            <BackupRestoreView />
          )}

          {/* Màn hình 15: Giám sát hệ thống (Admin) */}
          {activeMenuKey === 'system_monitor' && (
            <SystemMonitorView />
          )}

          {/* Màn hình 16: Nhật ký Audit Logs (Admin) */}
          {activeMenuKey === 'audit_logs' && (
            <AuditLogView />
          )}
        </Content>

        {/* CHÂN TRANG FOOTER */}
        <Footer style={{ textAlign: 'center', color: '#64748b', fontSize: 12, padding: '16px 0', background: '#f1f5f9', borderTop: '1px solid #e2e8f0' }}>
          <Space direction="vertical" size={2}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <img src="/logo-techcorp.png" alt="TechCorp Logo" style={{ height: 20, objectFit: 'contain' }} />
              <Text strong style={{ color: '#1e293b' }}>TechCorp Technology & Higher Education Platform</Text>
            </div>
            <div>© 2026 TechCorp. Chuẩn Quy chế Bộ GD&ĐT (TT 08/2021) & Chuẩn Kiểm định Quốc tế (ISO 21001 / AUN-QA 4.0).</div>
          </Space>
        </Footer>
      </Layout>

      {/* BỘ CÔNG CỤ TRỢ NĂNG TOÀN CẦU W3C WCAG 2.1 LEVEL AA */}
      <AccessibilityToolbar />

      {/* BANNER THÔNG MINH CÀI ĐẶT PWA & BẬT THÔNG BÁO ĐẨY */}
      <PwaInstallPrompt currentUser={currentUser} />

      {/* NÚT NỔI GIA SƯ AI HỌC THUẬT 24/7 */}
      <div style={{ position: 'fixed', bottom: 28, right: 28, zIndex: 999 }}>
        <Button
          type="primary"
          shape="round"
          size="large"
          icon={<RobotOutlined style={{ fontSize: 18 }} />}
          onClick={() => setIsAiTutorOpen(true)}
          style={{
            backgroundColor: '#7c3aed',
            borderColor: '#7c3aed',
            height: 48,
            padding: '0 20px',
            fontSize: 14,
            fontWeight: 700,
            boxShadow: '0 4px 16px rgba(124, 58, 237, 0.45)',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}
        >
          Gia Sư AI 24/7
        </Button>
      </div>

      {/* NGĂN KÉO GIA SƯ AI */}
      <AiTutorDrawer
        open={isAiTutorOpen}
        onClose={() => setIsAiTutorOpen(false)}
        currentUser={currentUser}
      />
    </Layout>
  );
}

export default App;
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
  BankOutlined, SolutionOutlined, SettingOutlined
} from '@ant-design/icons';
import LoginPage from './components/LoginPage';
import AcademicLmsWorkspace from './components/AcademicLmsWorkspace';
import CourseHierarchySelector from './components/CourseHierarchySelector';
import QuestionBankView from './components/QuestionBankView';
import ExamGeneratorView from './components/ExamGeneratorView';
import LiveProctoringView from './components/LiveProctoringView';
import OnlineExamRoom from './components/OnlineExamRoom';

// Enterprise Components
import TeachingAssignmentView from './components/enterprise/TeachingAssignmentView';
import AiAuthoringStudio from './components/enterprise/AiAuthoringStudio';
import ExamAppraisalView from './components/enterprise/ExamAppraisalView';
import MoetGradebookView from './components/enterprise/MoetGradebookView';
import InstitutionalCatalogView from './components/enterprise/InstitutionalCatalogView';
import LecturerDirectoryView from './components/enterprise/LecturerDirectoryView';

// Admin Views
import UserManagementView from './components/admin/UserManagementView';
import StudentDirectoryView from './components/admin/StudentDirectoryView';
import CurriculumManagerView from './components/admin/CurriculumManagerView';
import ErpSyncHubView from './components/admin/ErpSyncHubView';
import BackupRestoreView from './components/admin/BackupRestoreView';
import SystemMonitorView from './components/admin/SystemMonitorView';
import AuditLogView from './components/admin/AuditLogView';

import './App.css';

const { Header, Content, Footer, Sider } = Layout;
const { Title, Text } = Typography;

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [activeMenuKey, setActiveMenuKey] = useState('lms_workspace');
  const [selectedSectionId, setSelectedSectionId] = useState(1);

  // Khôi phục phiên đăng nhập hoặc nhận SSO từ URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ssoToken = params.get('sso_token');
    const roleParam = params.get('role');

    if (ssoToken) {
      localStorage.setItem('lms_token', ssoToken);
      const ssoUser = {
        id: 3,
        username: 'sso_student',
        full_name: 'Học viên ĐH (SSO TCU COMPASS)',
        role: roleParam || 'student'
      };
      setCurrentUser(ssoUser);
      localStorage.setItem('lms_user', JSON.stringify(ssoUser));
      message.success('Đăng nhập thành công qua liên thông TCU COMPASS ERP (SSO)!');
    } else {
      const savedUser = localStorage.getItem('lms_user');
      if (savedUser) {
        try {
          setCurrentUser(JSON.parse(savedUser));
        } catch (e) {
          localStorage.removeItem('lms_user');
        }
      }
    }
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    localStorage.setItem('lms_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    localStorage.removeItem('lms_token');
    localStorage.removeItem('lms_user');
    setCurrentUser(null);
    message.info('Đã đăng xuất khỏi hệ thống.');
  };

  const handleChangeRole = (role) => {
    let updated = null;
    if (role === 'student') {
      updated = {
        id: 3,
        username: 'student',
        student_code: '261IT001',
        full_name: 'Trần Văn Nam',
        role: 'student',
        faculty_id: 'CNTT',
        faculty_name: 'Khoa Công Nghệ Thông Tin',
        major_id: 'CNPM',
        major_code: '7480103',
        major_name: 'Kỹ thuật Phần mềm',
        cohort: 'K66',
        class_name: '66.CNTT-1',
        birth_date: '15/08/2004',
        email: 'sinhvien@techcorp.info.vn'
      };
      setActiveMenuKey('lms_workspace');
    } else if (role === 'teacher') {
      updated = { id: 2, username: 'teacher', full_name: 'TS. Hoàng Đức Em (Giảng viên)', role: 'teacher' };
      setActiveMenuKey('lms_workspace');
    } else {
      updated = { id: 1, username: 'admin', full_name: 'Quản trị viên Hệ thống (Admin)', role: 'admin' };
      setActiveMenuKey('lms_workspace');
    }
    setCurrentUser(updated);
    localStorage.setItem('lms_user', JSON.stringify(updated));
    message.success(`Đã chuyển sang không gian làm việc: ${updated.full_name}`);
  };

  // NẾU CHƯA ĐĂNG NHẬP -> HIỂN THỊ CỔNG ĐĂNG NHẬP CHUẨN QUỐC TẾ
  if (!currentUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // DANH SÁCH THÔNG BÁO VÀ CẢNH BÁO THỜI GIAN THỰC
  const notificationItems = {
    items: [
      {
        key: 'notif_header',
        label: <div style={{ fontWeight: 700, padding: '4px 0', color: '#002b66' }}>TRUNG TÂM THÔNG BÁO & CẢNH BÁO (3)</div>,
        disabled: true
      },
      { type: 'divider' },
      {
        key: 'notif_1',
        icon: <CheckCircleOutlined style={{ color: '#16a34a' }} />,
        label: (
          <div style={{ maxWidth: 280 }}>
            <div style={{ fontWeight: 600 }}>Thẩm định Đề thi IT101 hoàn tất</div>
            <div style={{ fontSize: 11, color: '#64748b' }}>Chủ tịch Hội đồng đã ký số phê duyệt đề thi HK1</div>
          </div>
        )
      },
      {
        key: 'notif_2',
        icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />,
        label: (
          <div style={{ maxWidth: 280 }}>
            <div style={{ fontWeight: 600, color: '#dc2626' }}>Cảnh báo học vụ (TT 08/2021)</div>
            <div style={{ fontSize: 11, color: '#64748b' }}>Học viên Vũ Hải Đăng có tiến độ LMS dưới 50%</div>
          </div>
        )
      },
      {
        key: 'notif_3',
        icon: <CloudSyncOutlined style={{ color: '#0284c7' }} />,
        label: (
          <div style={{ maxWidth: 280 }}>
            <div style={{ fontWeight: 600 }}>Liên thông ERP đồng bộ</div>
            <div style={{ fontSize: 11, color: '#64748b' }}>348 hồ sơ sinh viên đã cập nhật từ qldt.techcorp.info.vn</div>
          </div>
        )
      }
    ]
  };

  // MENU PROFILE
  const userMenu = {
    items: [
      {
        key: 'header_role',
        label: (
          <div style={{ padding: '4px 0' }}>
            <Text type="secondary" style={{ fontSize: 11, display: 'block' }}>VAI TRÒ HIỆN TẠI</Text>
            <b>{currentUser.role === 'student' ? 'Học viên / Sinh viên' : currentUser.role === 'teacher' ? 'Cán bộ Giảng viên' : 'Quản trị viên (Super Admin)'}</b>
          </div>
        ),
        disabled: true
      },
      { type: 'divider' },
      {
        key: 'switch_student',
        icon: <SwapOutlined />,
        label: 'Chuyển sang: Sinh viên (Student)',
        onClick: () => handleChangeRole('student')
      },
      {
        key: 'switch_teacher',
        icon: <SwapOutlined />,
        label: 'Chuyển sang: Giảng viên (Teacher)',
        onClick: () => handleChangeRole('teacher')
      },
      {
        key: 'switch_admin',
        icon: <SwapOutlined />,
        label: 'Chuyển sang: Quản trị viên (Admin)',
        onClick: () => handleChangeRole('admin')
      },
      { type: 'divider' },
      {
        key: 'logout',
        icon: <LogoutOutlined style={{ color: '#ff4d4f' }} />,
        label: <span style={{ color: '#ff4d4f' }}>Đăng xuất</span>,
        onClick: handleLogout
      }
    ]
  };

  const getRoleTag = (role) => {
    if (role === 'student') return <Tag color="blue" style={{ borderRadius: 12, padding: '2px 10px' }}>🎓 SINH VIÊN</Tag>;
    if (role === 'teacher') return <Tag color="green" style={{ borderRadius: 12, padding: '2px 10px' }}>👨‍🏫 GIẢNG VIÊN</Tag>;
    return <Tag color="gold" style={{ borderRadius: 12, padding: '2px 10px' }}>⚡ QUẢN TRỊ VIÊN</Tag>;
  };

  // CẤU TRÚC MENU SIDEBAR ĐA TẦNG CHO TỪNG VAI TRÒ
  const getSidebarMenuItems = () => {
    const isTeacherOrAdmin = currentUser.role === 'teacher' || currentUser.role === 'admin';
    const isAdmin = currentUser.role === 'admin';

    const items = [
      {
        key: 'sub_academic',
        icon: <BookOutlined style={{ color: '#1677ff' }} />,
        label: 'Phân Hệ Đào Tạo & LMS',
        children: [
          {
            key: 'lms_workspace',
            icon: <BookOutlined />,
            label: isTeacherOrAdmin ? 'Soạn & Quản Lý 15 Tuần' : 'Lớp Học Phần (15 Tuần)'
          },
          ...(isTeacherOrAdmin ? [
            {
              key: 'hierarchy_assignment',
              icon: <ApartmentOutlined />,
              label: 'Phân Công Giảng Dạy'
            }
          ] : []),
          {
            key: 'moet_gradebook',
            icon: <FileTextOutlined />,
            label: isTeacherOrAdmin ? 'Sổ Điểm & Bảng Điểm In' : 'Bảng Điểm Cá Nhân'
          },
          {
            key: 'curriculum_framework',
            icon: <AuditOutlined />,
            label: isTeacherOrAdmin ? 'Khung Đào Tạo Độc Lập' : 'Chương Trình Đào Tạo Của Tôi'
          }
        ]
      },
      ...(isTeacherOrAdmin ? [
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
        label: 'AI & Khảo Thí Điện Tử',
        children: [
          ...(isTeacherOrAdmin ? [
            {
              key: 'ai_studio',
              icon: <RobotOutlined style={{ color: '#722ed1' }} />,
              label: 'AI Teaching Studio'
            },
            {
              key: 'exam_appraisal',
              icon: <SafetyCertificateOutlined style={{ color: '#10b981' }} />,
              label: 'Thẩm Định Đề & Biên Bản'
            },
            {
              key: 'question_bank',
              icon: <DatabaseOutlined />,
              label: 'Ngân Hàng Câu Hỏi'
            },
            {
              key: 'exam_generator',
              icon: <ThunderboltOutlined />,
              label: 'Động Cơ Ma Trận Sinh Đề'
            },
            {
              key: 'live_proctoring',
              icon: <VideoCameraOutlined style={{ color: '#ff4d4f' }} />,
              label: 'Giám Thị AI Webcam Live'
            }
          ] : []),
          {
            key: 'exam_room',
            icon: <EditOutlined style={{ color: '#fa8c16' }} />,
            label: 'Phòng Thi Trực Tuyến'
          }
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
          zIndex: 1001
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
          defaultOpenKeys={['sub_academic', 'sub_catalogs']}
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
            zIndex: 1000,
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
              <Tag color="cyan" style={{ borderRadius: 6, padding: '3px 8px' }}>
                Khoa CNTT — Lớp 66.CNTT-1 (IT101)
              </Tag>
            </Space>
          </Space>

          {/* CHUÔNG THÔNG BÁO & USER AVATAR */}
          <Space size="middle" align="middle">
            {/* Notification Center */}
            <Dropdown menu={notificationItems} placement="bottomRight" arrow>
              <Badge count={3} offset={[-4, 4]}>
                <Button
                  type="text"
                  shape="circle"
                  icon={<BellOutlined style={{ fontSize: 18, color: '#475569' }} />}
                  style={{ width: 40, height: 40 }}
                />
              </Badge>
            </Dropdown>

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
                    backgroundColor: currentUser.role === 'admin' ? '#faad14' : currentUser.role === 'teacher' ? '#52c41a' : '#1677ff',
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
                role={currentUser.role === 'student' ? 'STUDENT' : 'LECTURER'}
              />
              <AcademicLmsWorkspace
                sectionId={selectedSectionId}
                role={currentUser.role === 'student' ? 'STUDENT' : 'LECTURER'}
                studentId={currentUser.role === 'student' ? currentUser.id : null}
                lecturerName={currentUser.role === 'teacher' ? currentUser.full_name : 'TS. Hoàng Đức Em'}
              />
            </div>
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

          {/* Màn hình 5: Sổ điểm & Mẫu in chuẩn Bộ GD&ĐT */}
          {activeMenuKey === 'moet_gradebook' && (
            <MoetGradebookView currentUser={currentUser} />
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
            <OnlineExamRoom currentUser={currentUser} />
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
    </Layout>
  );
}

export default App;
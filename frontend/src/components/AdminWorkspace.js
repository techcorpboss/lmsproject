import React, { useState } from 'react';
import { Card, Tabs, Space } from 'antd';
import {
  BookOutlined, UserOutlined, TeamOutlined, ApartmentOutlined,
  CloudSyncOutlined, DatabaseOutlined, DashboardOutlined, HistoryOutlined,
  VideoCameraOutlined, ThunderboltOutlined, EditOutlined
} from '@ant-design/icons';
import AcademicLmsWorkspace from './AcademicLmsWorkspace';
import CourseHierarchySelector from './CourseHierarchySelector';
import OnlineExamRoom from './OnlineExamRoom';
import QuestionBankView from './QuestionBankView';
import ExamGeneratorView from './ExamGeneratorView';
import LiveProctoringView from './LiveProctoringView';

// Enterprise Admin Components
import UserManagementView from './admin/UserManagementView';
import StudentDirectoryView from './admin/StudentDirectoryView';
import CurriculumManagerView from './admin/CurriculumManagerView';
import ErpSyncHubView from './admin/ErpSyncHubView';
import BackupRestoreView from './admin/BackupRestoreView';
import SystemMonitorView from './admin/SystemMonitorView';
import AuditLogView from './admin/AuditLogView';

export default function AdminWorkspace({ currentUser }) {
  const [selectedSectionId, setSelectedSectionId] = useState(1);
  const [activeTab, setActiveTab] = useState('lms_full');

  return (
    <div>
      {/* 1. BỘ LỌC PHÂN CẤP: NĂM HỌC - KHOA - NGÀNH - KHÓA - MÔN HỌC */}
      <CourseHierarchySelector
        selectedSectionId={selectedSectionId}
        onSelectSection={(id) => setSelectedSectionId(id)}
        role="LECTURER"
      />

      {/* 2. TABS QUẢN TRỊ TOÀN DIỆN CHO ADMIN */}
      <Card style={{ borderRadius: 12 }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          type="card"
          size="middle"
          items={[
            {
              key: 'lms_full',
              label: (
                <Space>
                  <BookOutlined style={{ color: '#10b981' }} />
                  <b>Soạn & Quản Lý Bài Giảng 15 Tuần</b>
                </Space>
              ),
              children: (
                <AcademicLmsWorkspace
                  sectionId={selectedSectionId}
                  role="LECTURER"
                  lecturerName="Hội Đồng Đào Tạo (Admin)"
                />
              )
            },
            {
              key: 'users',
              label: (
                <Space>
                  <UserOutlined style={{ color: '#1677ff' }} />
                  <span>Quản Lý Tài Khoản</span>
                </Space>
              ),
              children: <UserManagementView />
            },
            {
              key: 'students',
              label: (
                <Space>
                  <TeamOutlined style={{ color: '#13c2c2' }} />
                  <span>Danh Sách Học Viên</span>
                </Space>
              ),
              children: <StudentDirectoryView />
            },
            {
              key: 'curriculum',
              label: (
                <Space>
                  <ApartmentOutlined style={{ color: '#722ed1' }} />
                  <span>Khung Chương Trình Đào Tạo</span>
                </Space>
              ),
              children: <CurriculumManagerView />
            },
            {
              key: 'erp_sync',
              label: (
                <Space>
                  <CloudSyncOutlined style={{ color: '#fa8c16' }} />
                  <b>Liên Thông ERP (qldt.techcorp.info.vn)</b>
                </Space>
              ),
              children: <ErpSyncHubView />
            },
            {
              key: 'backup',
              label: (
                <Space>
                  <DatabaseOutlined style={{ color: '#eb2f96' }} />
                  <span>Sao Lưu & Backup Dữ Liệu</span>
                </Space>
              ),
              children: <BackupRestoreView />
            },
            {
              key: 'monitoring',
              label: (
                <Space>
                  <DashboardOutlined style={{ color: '#faad14' }} />
                  <span>Giám Sát Hệ Thống</span>
                </Space>
              ),
              children: <SystemMonitorView />
            },
            {
              key: 'audit_logs',
              label: (
                <Space>
                  <HistoryOutlined style={{ color: '#52c41a' }} />
                  <span>Nhật Ký Audit Log</span>
                </Space>
              ),
              children: <AuditLogView />
            },
            {
              key: 'proctoring',
              label: (
                <Space>
                  <VideoCameraOutlined style={{ color: '#ff4d4f' }} />
                  <span>Giám Thị AI (Live)</span>
                </Space>
              ),
              children: <LiveProctoringView />
            },
            {
              key: 'qbank',
              label: (
                <Space>
                  <DatabaseOutlined style={{ color: '#1677ff' }} />
                  <span>Ngân Hàng Câu Hỏi</span>
                </Space>
              ),
              children: <QuestionBankView />
            },
            {
              key: 'generator',
              label: (
                <Space>
                  <ThunderboltOutlined style={{ color: '#722ed1' }} />
                  <span>Sinh Đề Tự Động</span>
                </Space>
              ),
              children: <ExamGeneratorView />
            },
            {
              key: 'exam_room',
              label: (
                <Space>
                  <EditOutlined style={{ color: '#fa8c16' }} />
                  <span>Phòng Khảo Thí Trực Tuyến</span>
                </Space>
              ),
              children: <OnlineExamRoom currentUser={currentUser} />
            }
          ]}
        />
      </Card>
    </div>
  );
}

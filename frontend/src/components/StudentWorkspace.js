import React, { useState } from 'react';
import {
  Row, Col, Card, Typography, Space, Progress, Tag, Button, Statistic,
  Tabs, Badge, Alert
} from 'antd';
import {
  BookOutlined, ClockCircleOutlined, TrophyOutlined, PlayCircleOutlined,
  SafetyCertificateOutlined, CalendarOutlined, CheckCircleOutlined,
  EditOutlined, ReadOutlined
} from '@ant-design/icons';
import AcademicLmsWorkspace from './AcademicLmsWorkspace';
import CourseHierarchySelector from './CourseHierarchySelector';
import OnlineExamRoom from './OnlineExamRoom';
import ElearningCatalog from './ElearningCatalog';

const { Title, Text } = Typography;

export default function StudentWorkspace({ currentUser }) {
  const [selectedSectionId, setSelectedSectionId] = useState(2); // Mặc định môn Cơ sở dữ liệu (IT201) như Hình 2
  const [activeTab, setActiveTab] = useState('academic_lms');

  return (
    <div>
      {/* 1. BỘ LỌC PHÂN CẤP: NĂM HỌC - KHOA - NGÀNH - KHÓA - HỌC PHẦN ĐANG HỌC */}
      <CourseHierarchySelector
        selectedSectionId={selectedSectionId}
        onSelectSection={(id) => setSelectedSectionId(id)}
        role="STUDENT"
      />

      {/* 2. CÁC PHÂN HỆ DÀNH CHO HỌC VIÊN */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        type="card"
        size="large"
        items={[
          {
            key: 'academic_lms',
            label: (
              <Space>
                <BookOutlined style={{ color: '#0ea5e9' }} />
                <b>Không Gian E-Learning Học Phần</b>
              </Space>
            ),
            children: (
              <AcademicLmsWorkspace
                sectionId={selectedSectionId}
                role="STUDENT"
                studentId={currentUser?.id || 3}
                studentName={currentUser?.full_name || 'Trần Văn Nam'}
              />
            )
          },
          {
            key: 'exam_room',
            label: (
              <Space>
                <EditOutlined style={{ color: '#ff4d4f' }} />
                <span>Phòng Khảo Thí Trực Tuyến</span>
              </Space>
            ),
            children: <OnlineExamRoom currentUser={currentUser} />
          },
          {
            key: 'catalog',
            label: (
              <Space>
                <ReadOutlined style={{ color: '#8b5cf6' }} />
                <span>Khóa Bồi Dưỡng Chuyên Đề & Chứng Chỉ Số</span>
              </Space>
            ),
            children: <ElearningCatalog currentUser={currentUser} />
          }
        ]}
      />
    </div>
  );
}

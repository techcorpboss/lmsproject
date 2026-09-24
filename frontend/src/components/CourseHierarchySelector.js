import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Select, Typography, Space, Tag, Button } from 'antd';
import {
  ApartmentOutlined, BookOutlined, FilterOutlined,
  CalendarOutlined, TeamOutlined, SyncOutlined
} from '@ant-design/icons';

const { Text } = Typography;
const { Option } = Select;

// Dữ liệu phân cấp mẫu chuẩn Đại học
const HIERARCHY_DATA = {
  years: ['2026-2027', '2025-2026'],
  semesters: [
    { id: 1, name: 'Học kỳ 1 (Chính khóa)' },
    { id: 2, name: 'Học kỳ 2 (Chính khóa)' },
    { id: 3, name: 'Học kỳ hè / Phụ' }
  ],
  faculties: [
    {
      id: 'CNTT',
      name: 'Khoa Công Nghệ Thông Tin',
      majors: [
        { id: 'CNPM', name: 'Kỹ thuật Phần mềm (Software Engineering)' },
        { id: 'KHMT', name: 'Khoa học Máy tính (Computer Science)' },
        { id: 'HTTT', name: 'Hệ thống Thông tin (Information Systems)' },
        { id: 'ATTT', name: 'An toàn Thông tin & Mạng (Cybersecurity)' }
      ]
    },
    {
      id: 'KT',
      name: 'Khoa Kinh Tế & Quản Trị Kinh Doanh',
      majors: [
        { id: 'QTKD', name: 'Quản trị Kinh doanh' },
        { id: 'KTTC', name: 'Tài chính - Ngân hàng' }
      ]
    },
    {
      id: 'NN',
      name: 'Khoa Ngoại Ngữ',
      majors: [
        { id: 'NNA', name: 'Ngôn ngữ Anh' }
      ]
    }
  ],
  cohorts: ['K66 (2026-2030)', 'K65 (2025-2029)', 'K64 (2024-2028)'],
  sections: [
    {
      id: 1,
      code: 'IT101_66.CNTT-1_HK1',
      name: 'Nhập môn Lập trình C/C++',
      course_code: 'IT101',
      credits: 4,
      faculty_id: 'CNTT',
      major_id: 'CNPM',
      cohort: 'K66 (2026-2030)',
      semester_id: 1,
      class_name: '66.CNTT-1',
      enrolled: 14,
      lecturer: 'TS. Hoàng Đức Em',
      room: 'P.401 (Nhà A3)'
    },
    {
      id: 2,
      code: '261.IT201.01',
      name: 'Cơ sở Dữ liệu (Database Systems)',
      course_code: 'IT201',
      credits: 3,
      faculty_id: 'CNTT',
      major_id: 'HTTT',
      cohort: 'K66 (2026-2030)',
      semester_id: 1,
      class_name: '66.CNTT-2',
      enrolled: 42,
      lecturer: 'TS. Hoàng Đức Em',
      room: 'P.03-301'
    },
    {
      id: 3,
      code: '261.IT301.01',
      name: 'Cấu trúc Dữ liệu & Giải thuật (Data Structures)',
      course_code: 'IT301',
      credits: 3,
      faculty_id: 'CNTT',
      major_id: 'KHMT',
      cohort: 'K65 (2025-2029)',
      semester_id: 1,
      class_name: '65.CNTT-1',
      enrolled: 38,
      lecturer: 'ThS. Chu Quỳnh Anh',
      room: 'Lab PM 02'
    },
    {
      id: 4,
      code: '261.IT401.01',
      name: 'Mạng Máy Tính & An Toàn Thông Tin',
      course_code: 'IT401',
      credits: 3,
      faculty_id: 'CNTT',
      major_id: 'ATTT',
      cohort: 'K65 (2025-2029)',
      semester_id: 1,
      class_name: '65.ATTT-1',
      enrolled: 35,
      lecturer: 'TS. Bùi Tuấn Anh',
      room: 'Lab CISCO'
    }
  ]
};

export default function CourseHierarchySelector({
  selectedSectionId,
  onSelectSection,
  role = 'LECTURER'
}) {
  const [selectedYear, setSelectedYear] = useState('2026-2027');
  const [selectedSemester, setSelectedSemester] = useState(1);
  const [selectedFaculty, setSelectedFaculty] = useState('CNTT');
  const [selectedMajor, setSelectedMajor] = useState('CNPM');
  const [selectedCohort, setSelectedCohort] = useState('K66 (2026-2030)');

  // Danh sách ngành theo khoa
  const currentFaculty = HIERARCHY_DATA.faculties.find(f => f.id === selectedFaculty) || HIERARCHY_DATA.faculties[0];
  const availableMajors = currentFaculty?.majors || [];

  // Lọc danh sách lớp học phần phù hợp
  const filteredSections = HIERARCHY_DATA.sections.filter(s => {
    if (selectedFaculty && s.faculty_id !== selectedFaculty) return false;
    if (selectedSemester && s.semester_id !== selectedSemester) return false;
    return true;
  });

  const activeSection = HIERARCHY_DATA.sections.find(s => s.id === selectedSectionId) || filteredSections[0] || HIERARCHY_DATA.sections[0];

  return (
    <Card
      style={{
        borderRadius: 12,
        marginBottom: 16,
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
      }}
      styles={{ body: { padding: '16px 20px' } }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
        <Space>
          <ApartmentOutlined style={{ color: '#1677ff', fontSize: 18 }} />
          <Text strong style={{ fontSize: 15, color: '#1e293b' }}>
            {role === 'LECTURER' ? 'PHÂN BỐ HỌC PHẦN GIẢNG DẠY' : 'PHÂN BỐ HỌC PHẦN THEO CHƯƠNG TRÌNH ĐÀO TẠO'}
          </Text>
          <Tag color="blue">Khung Đề Cương 15 Tuần</Tag>
        </Space>
        <Space>
          <Tag color="cyan">Năm học: {selectedYear}</Tag>
          <Tag color="purple">Học kỳ {selectedSemester}</Tag>
        </Space>
      </div>

      <Row gutter={[12, 12]} align="middle">
        {/* 1. Năm học & Học kỳ */}
        <Col xs={12} sm={6} md={4}>
          <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>Năm học & Học kỳ:</Text>
          <Select
            value={selectedSemester}
            onChange={val => setSelectedSemester(val)}
            style={{ width: '100%' }}
          >
            {HIERARCHY_DATA.semesters.map(s => (
              <Option key={s.id} value={s.id}>{s.name}</Option>
            ))}
          </Select>
        </Col>

        {/* 2. Khoa / Viện */}
        <Col xs={12} sm={6} md={5}>
          <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>Khoa / Viện Đào tạo:</Text>
          <Select
            value={selectedFaculty}
            onChange={val => {
              setSelectedFaculty(val);
              const fac = HIERARCHY_DATA.faculties.find(f => f.id === val);
              if (fac && fac.majors[0]) setSelectedMajor(fac.majors[0].id);
            }}
            style={{ width: '100%' }}
          >
            {HIERARCHY_DATA.faculties.map(f => (
              <Option key={f.id} value={f.id}>{f.name}</Option>
            ))}
          </Select>
        </Col>

        {/* 3. Ngành / Chuyên ngành */}
        <Col xs={12} sm={6} md={5}>
          <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>Ngành / Chuyên ngành:</Text>
          <Select
            value={selectedMajor}
            onChange={val => setSelectedMajor(val)}
            style={{ width: '100%' }}
          >
            {availableMajors.map(m => (
              <Option key={m.id} value={m.id}>{m.name}</Option>
            ))}
          </Select>
        </Col>

        {/* 4. Khóa đào tạo */}
        <Col xs={12} sm={6} md={4}>
          <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>Khóa học:</Text>
          <Select
            value={selectedCohort}
            onChange={val => setSelectedCohort(val)}
            style={{ width: '100%' }}
          >
            {HIERARCHY_DATA.cohorts.map(c => (
              <Option key={c} value={c}>{c}</Option>
            ))}
          </Select>
        </Col>

        {/* 5. Lớp học phần chọn trực tiếp */}
        <Col xs={24} md={6}>
          <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
            <b>{role === 'LECTURER' ? 'Chọn Lớp Học Phần Quản Trị:' : 'Chọn Học Phần Đang Học:'}</b>
          </Text>
          <Select
            value={activeSection.id}
            onChange={val => onSelectSection(val)}
            style={{ width: '100%' }}
          >
            {filteredSections.map(s => (
              <Option key={s.id} value={s.id}>
                [{s.code}] {s.name} ({s.class_name})
              </Option>
            ))}
          </Select>
        </Col>
      </Row>
    </Card>
  );
}

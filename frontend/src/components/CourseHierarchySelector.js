import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Select, Typography, Space, Tag, Alert } from 'antd';
import {
  ApartmentOutlined, BookOutlined, FilterOutlined,
  CalendarOutlined, TeamOutlined, UserOutlined, LockOutlined
} from '@ant-design/icons';

const { Text } = Typography;
const { Option } = Select;

// Dữ liệu phân cấp chuẩn 5 Khoa Đào tạo TCU COMPASS LMS
export const HIERARCHY_DATA = {
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
      dean: 'PGS. TS. Trần Mạnh Tuấn',
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
      dean: 'TS. Nguyễn Thị Hồng',
      majors: [
        { id: 'QTKD', name: 'Quản trị Kinh doanh (Business Admin)' }
      ]
    },
    {
      id: 'NN',
      name: 'Khoa Ngoại Ngữ',
      dean: 'TS. Phạm Thu Hương',
      majors: [
        { id: 'NNA', name: 'Ngôn ngữ Anh (English Studies)' }
      ]
    },
    {
      id: 'DDT',
      name: 'Khoa Điện - Điện Tử & Tự Động Hóa',
      dean: 'TS. Bùi Quốc Thái',
      majors: [
        { id: 'DDT', name: 'Kỹ thuật Điện - Điện tử & IoT' }
      ]
    },
    {
      id: 'DL',
      name: 'Khoa Du Lịch & Khách Sạn',
      dean: 'ThS. Đỗ Quang Vinh',
      majors: [
        { id: 'DL', name: 'Quản trị Dịch vụ Du lịch & Lữ hành' }
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
      enrolled: 42,
      lecturer: 'TS. Hoàng Đức Em',
      lecturer_username: 'teacher',
      room: 'P.401 (Nhà A3)'
    },
    {
      id: 2,
      code: 'IT201_66.CNTT-2_HK1',
      name: 'Cơ sở Dữ liệu (Database Systems)',
      course_code: 'IT201',
      credits: 3,
      faculty_id: 'CNTT',
      major_id: 'CNPM',
      cohort: 'K66 (2026-2030)',
      semester_id: 1,
      class_name: '66.CNTT-2',
      enrolled: 40,
      lecturer: 'TS. Hoàng Đức Em',
      lecturer_username: 'teacher',
      room: 'P.402 (Nhà A3)'
    },
    {
      id: 3,
      code: 'IT301_65.CNTT-1_HK1',
      name: 'Cấu trúc Dữ liệu & Giải thuật',
      course_code: 'IT301',
      credits: 3,
      faculty_id: 'CNTT',
      major_id: 'KHMT',
      cohort: 'K65 (2025-2029)',
      semester_id: 1,
      class_name: '65.CNTT-1',
      enrolled: 38,
      lecturer: 'TS. Nguyễn Văn An',
      lecturer_username: 'an.nv',
      room: 'Lab PM 02'
    },
    {
      id: 4,
      code: 'BA101_66.QTKD-1_HK1',
      name: 'Kinh Tế Vi Mô (Microeconomics)',
      course_code: 'BA101',
      credits: 3,
      faculty_id: 'KT',
      major_id: 'QTKD',
      cohort: 'K66 (2026-2030)',
      semester_id: 1,
      class_name: '66.QTKD-1',
      enrolled: 50,
      lecturer: 'TS. Nguyễn Thị Hồng',
      lecturer_username: 'hong.nt',
      room: 'P.201 (Nhà B1)'
    },
    {
      id: 5,
      code: 'BA102_66.QTKD-1_HK1',
      name: 'Quản Trị Học Đại Cương',
      course_code: 'BA102',
      credits: 3,
      faculty_id: 'KT',
      major_id: 'QTKD',
      cohort: 'K66 (2026-2030)',
      semester_id: 1,
      class_name: '66.QTKD-1',
      enrolled: 50,
      lecturer: 'ThS. Vũ Nam',
      lecturer_username: 'nam.v',
      room: 'P.202 (Nhà B1)'
    },
    {
      id: 6,
      code: 'ENG101_66.NNA-1_HK1',
      name: 'Tiếng Anh Học Thuật 1 (General English B1)',
      course_code: 'ENG101',
      credits: 4,
      faculty_id: 'NN',
      major_id: 'NNA',
      cohort: 'K66 (2026-2030)',
      semester_id: 1,
      class_name: '66.NNA-1',
      enrolled: 35,
      lecturer: 'TS. Phạm Thu Hương',
      lecturer_username: 'huong.pt',
      room: 'P.301 (Nhà C)'
    },
    {
      id: 7,
      code: 'EE101_66.DDT-1_HK1',
      name: 'Kỹ Thuật Mạch Điện Tử & IoT',
      course_code: 'EE101',
      credits: 3,
      faculty_id: 'DDT',
      major_id: 'DDT',
      cohort: 'K66 (2026-2030)',
      semester_id: 1,
      class_name: '66.DDT-1',
      enrolled: 36,
      lecturer: 'TS. Bùi Quốc Thái',
      lecturer_username: 'thai.bq',
      room: 'Lab Vi Mạch (Nhà E)'
    },
    {
      id: 8,
      code: 'TOU101_66.DL-1_HK1',
      name: 'Tổng Quan Du Lịch & Dịch Vụ Lữ Hành',
      course_code: 'TOU101',
      credits: 3,
      faculty_id: 'DL',
      major_id: 'DL',
      cohort: 'K66 (2026-2030)',
      semester_id: 1,
      class_name: '66.DL-1',
      enrolled: 38,
      lecturer: 'ThS. Đỗ Quang Vinh',
      lecturer_username: 'vinh.dq',
      room: 'P.202 (Nhà D)'
    }
  ]
};

export default function CourseHierarchySelector({
  selectedSectionId,
  onSelectSection,
  currentUser
}) {
  const isStudent = currentUser?.role === 'student';
  const isTeacher = currentUser?.role === 'teacher';
  const isAdmin = currentUser?.role === 'admin' || (!isStudent && !isTeacher);

  // Xác định khoa mặc định theo user
  const userFaculty = currentUser?.faculty_id && currentUser.faculty_id !== 'ALL'
    ? currentUser.faculty_id
    : 'CNTT';

  const [selectedYear, setSelectedYear] = useState('2026-2027');
  const [selectedSemester, setSelectedSemester] = useState(1);
  const [selectedFaculty, setSelectedFaculty] = useState(userFaculty);
  const [selectedMajor, setSelectedMajor] = useState(currentUser?.major_id || 'CNPM');
  const [selectedCohort, setSelectedCohort] = useState('K66 (2026-2030)');

  // Khi currentUser thay đổi (ví dụ: chuyển vai trò hoặc đăng nhập tài khoản khác), cập nhật lại
  useEffect(() => {
    if (currentUser?.faculty_id && currentUser.faculty_id !== 'ALL') {
      setSelectedFaculty(currentUser.faculty_id);
    }
    if (currentUser?.major_id) {
      setSelectedMajor(currentUser.major_id);
    }
  }, [currentUser]);

  // Bộ lọc danh sách các lớp học phần được phép hiển thị cho user này:
  const allowedSections = HIERARCHY_DATA.sections.filter(s => {
    if (isStudent) {
      // Sinh viên: CHỈ thấy lớp học phần thuộc lớp sinh hoạt hoặc chuyên ngành của mình
      if (currentUser?.class_name && s.class_name === currentUser.class_name) return true;
      if (currentUser?.faculty_id && s.faculty_id === currentUser.faculty_id) return true;
      return false;
    }
    if (isTeacher) {
      // Giảng viên: CHỈ thấy các lớp học phần được phân công
      const username = currentUser?.username;
      if (username === 'gv_cntt' || username === 'teacher') {
        return s.faculty_id === 'CNTT' && (s.course_code === 'IT101' || s.course_code === 'IT201');
      }
      if (username === 'gv_kinhte' || username === 'hong.nt') {
        return s.faculty_id === 'KT';
      }
      if (username === 'gv_ngoaingu' || username === 'huong.pt') {
        return s.faculty_id === 'NN';
      }
      if (username === 'gv_dientu' || username === 'thai.bq') {
        return s.faculty_id === 'DDT';
      }
      if (username === 'gv_dulich' || username === 'vinh.dq') {
        return s.faculty_id === 'DL';
      }
      // Khớp theo tên giảng viên hoặc faculty
      if (s.lecturer_username === username || (currentUser?.faculty_id && s.faculty_id === currentUser.faculty_id)) {
        return true;
      }
      return false;
    }
    // Admin: Xem được toàn trường
    return true;
  });

  // Tinh chỉnh danh sách sections theo bộ lọc giao diện (nếu là Admin)
  const displaySections = allowedSections.filter(s => {
    if (isAdmin) {
      if (selectedFaculty && s.faculty_id !== selectedFaculty) return false;
    }
    return true;
  });

  // Tự động đồng bộ section ID hợp lệ
  useEffect(() => {
    const isCurrentValid = allowedSections.some(s => s.id === selectedSectionId);
    if (!isCurrentValid && allowedSections.length > 0) {
      onSelectSection(allowedSections[0].id);
    }
  }, [currentUser, allowedSections, selectedSectionId, onSelectSection]);

  const activeSection = allowedSections.find(s => s.id === selectedSectionId) || allowedSections[0] || HIERARCHY_DATA.sections[0];
  const currentFaculty = HIERARCHY_DATA.faculties.find(f => f.id === selectedFaculty) || HIERARCHY_DATA.faculties[0];
  const availableMajors = currentFaculty?.majors || [];

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
            {isStudent
              ? `HỌC PHẦN THEO LỚP: ${currentUser?.class_name || '66.CNTT-1'} — ${currentUser?.faculty_name || 'Khoa CNTT'}`
              : isTeacher
                ? `HỌC PHẦN ĐƯỢC PHÂN CÔNG GIẢNG DẠY — ${currentUser?.full_name}`
                : 'ĐIỀU PHỐI ĐÀO TẠO & GIÁO TRÌNH 15 TUẦN TOÀN TRƯỜNG (ADMIN)'}
          </Text>
          {isStudent && (
            <Tag color="green" icon={<LockOutlined />}>Đã khóa theo lớp sinh viên</Tag>
          )}
          {isTeacher && (
            <Tag color="blue" icon={<LockOutlined />}>Đã lọc theo phân công giảng viên</Tag>
          )}
          {isAdmin && (
            <Tag color="purple">Phân cấp Toàn trường (5 Khoa)</Tag>
          )}
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
            disabled={!isAdmin && !isTeacher}
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
            value={isAdmin ? selectedFaculty : (currentUser?.faculty_id || selectedFaculty)}
            onChange={val => {
              setSelectedFaculty(val);
              const fac = HIERARCHY_DATA.faculties.find(f => f.id === val);
              if (fac && fac.majors[0]) setSelectedMajor(fac.majors[0].id);
            }}
            style={{ width: '100%' }}
            disabled={!isAdmin}
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
            value={isAdmin ? selectedMajor : (currentUser?.major_id || selectedMajor)}
            onChange={val => setSelectedMajor(val)}
            style={{ width: '100%' }}
            disabled={!isAdmin}
          >
            {availableMajors.map(m => (
              <Option key={m.id} value={m.id}>{m.name}</Option>
            ))}
          </Select>
        </Col>

        {/* 4. Khóa đào tạo */}
        <Col xs={12} sm={6} md={4}>
          <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>Khóa học / Lớp:</Text>
          <Select
            value={isStudent ? (currentUser?.class_name || '66.CNTT-1') : selectedCohort}
            onChange={val => setSelectedCohort(val)}
            style={{ width: '100%' }}
            disabled={isStudent}
          >
            {isStudent ? (
              <Option value={currentUser?.class_name || '66.CNTT-1'}>{currentUser?.class_name || '66.CNTT-1'}</Option>
            ) : (
              HIERARCHY_DATA.cohorts.map(c => (
                <Option key={c} value={c}>{c}</Option>
              ))
            )}
          </Select>
        </Col>

        {/* 5. Lớp học phần chọn trực tiếp */}
        <Col xs={24} md={6}>
          <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
            <b>{isStudent ? 'Chọn Môn Học Đang Diễn Ra:' : isTeacher ? 'Chọn Lớp Học Phần Phụ Trách:' : 'Chọn Lớp Học Phần Quản Trị:'}</b>
          </Text>
          <Select
            value={activeSection?.id}
            onChange={val => onSelectSection(val)}
            style={{ width: '100%' }}
          >
            {displaySections.map(s => (
              <Option key={s.id} value={s.id}>
                [{s.course_code}] {s.name} ({s.class_name})
              </Option>
            ))}
          </Select>
        </Col>
      </Row>
    </Card>
  );
}

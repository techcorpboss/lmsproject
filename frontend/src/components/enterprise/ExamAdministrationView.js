// frontend/src/components/enterprise/ExamAdministrationView.js
// Quản lý Tổ chức Thi Trực Tuyến & Cấp Quyền Dự Thi Chuẩn Bộ GD&ĐT (Thông tư 08/2021/TT-BGDĐT)
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Card, Table, Tag, Button, Space, Modal, Form, Input, Select,
  Row, Col, Statistic, Tabs, message, Tooltip, Badge, Popconfirm,
  Progress, Typography, Divider, Alert, DatePicker, TimePicker, InputNumber
} from 'antd';
import {
  ScheduleOutlined, CheckCircleOutlined, CloseCircleOutlined,
  StopOutlined, UserAddOutlined, ThunderboltOutlined,
  FileDoneOutlined, PrinterOutlined, ReloadOutlined,
  SearchOutlined, TeamOutlined, SafetyCertificateOutlined,
  ExclamationCircleOutlined, EyeOutlined, EditOutlined, DeleteOutlined,
  BankOutlined, BookOutlined, ApartmentOutlined, SolutionOutlined
} from '@ant-design/icons';
import apiClient from '../../services/apiClient';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

export default function ExamAdministrationView({ currentUser }) {
  const [activeTab, setActiveTab] = useState('schedules');
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);

  // Thí sinh state
  const [candidates, setCandidates] = useState([]);
  const [candidatesLoading, setCandidatesLoading] = useState(false);
  const [searchCandidate, setSearchCandidate] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Modals
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [addStudentModalOpen, setAddStudentModalOpen] = useState(false);
  const [minutesModalOpen, setMinutesModalOpen] = useState(false);
  const [examMinutesData, setExamMinutesData] = useState(null);
  const [minutesLoading, setMinutesLoading] = useState(false);

  const [scheduleForm] = Form.useForm();
  const [studentForm] = Form.useForm();

  // Danh mục học thuật (Khoa, Ngành/Nghề, Học phần, CBCT) từ CSDL
  const [academicOptions, setAcademicOptions] = useState({
    faculties: [],
    majors: [],
    courses: [],
    lecturers: []
  });
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [selectedMajor, setSelectedMajor] = useState(null);

  const fetchAcademicOptions = useCallback(async () => {
    try {
      const res = await apiClient.get('/exam/admin/academic-options');
      if (res && res.success && res.data) {
        setAcademicOptions(res.data);
      }
    } catch (err) {
      console.warn('Lỗi tải danh mục học thuật:', err);
    }
  }, []);

  useEffect(() => {
    fetchAcademicOptions();
  }, [fetchAcademicOptions]);

  const handleFacultyChange = (facultyId) => {
    setSelectedFaculty(facultyId);
    setSelectedMajor(null);
    scheduleForm.setFieldsValue({
      major_id: undefined,
      course_code: undefined,
      course_name: undefined
    });
  };

  const handleMajorChange = (majorId) => {
    setSelectedMajor(majorId);
    scheduleForm.setFieldsValue({
      course_code: undefined,
      course_name: undefined
    });
    if (majorId && !selectedFaculty) {
      const m = academicOptions.majors.find(item => item.id === majorId);
      if (m && m.faculty_id) {
        setSelectedFaculty(m.faculty_id);
        scheduleForm.setFieldsValue({ faculty_id: m.faculty_id });
      }
    }
  };

  const handleCourseCodeChange = (courseCode) => {
    const selectedCourse = academicOptions.courses.find(c => c.code === courseCode);
    if (selectedCourse) {
      const autoExamName = `Khảo Thí Học Phần: ${selectedCourse.name} (${selectedCourse.code})`;
      const autoRoomCode = `PHONG-${selectedCourse.code}-ONLINE`;

      const updates = {
        course_name: selectedCourse.name,
        exam_name: autoExamName,
        room_code: autoRoomCode
      };

      if (!selectedFaculty && selectedCourse.faculty_id) {
        setSelectedFaculty(selectedCourse.faculty_id);
        updates.faculty_id = selectedCourse.faculty_id;
      }
      if (!selectedMajor && selectedCourse.major_id) {
        setSelectedMajor(selectedCourse.major_id);
        updates.major_id = selectedCourse.major_id;
      }

      scheduleForm.setFieldsValue(updates);
    }
  };

  const filteredMajors = useMemo(() => {
    if (!selectedFaculty) return academicOptions.majors;
    return academicOptions.majors.filter(m => m.faculty_id === selectedFaculty);
  }, [academicOptions.majors, selectedFaculty]);

  const filteredCourses = useMemo(() => {
    let list = academicOptions.courses;
    if (selectedFaculty) {
      list = list.filter(c => c.faculty_id === selectedFaculty);
    }
    if (selectedMajor) {
      list = list.filter(c => c.major_id === selectedMajor);
    }
    return list;
  }, [academicOptions.courses, selectedFaculty, selectedMajor]);

  // 1. Tải danh sách ca thi
  const fetchSchedules = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/exam/admin/schedules');
      if (res && res.success) {
        setSchedules(res.data || []);
        if (!selectedScheduleId && res.data && res.data.length > 0) {
          setSelectedScheduleId(res.data[0].id);
        }
      }
    } catch (err) {
      message.error('Lỗi tải danh mục ca thi: ' + (err.message || 'Lỗi kết nối'));
    } finally {
      setLoading(false);
    }
  }, [selectedScheduleId]);

  // 2. Tải danh sách thí sinh của ca thi đang chọn
  const fetchCandidates = useCallback(async (schedId) => {
    if (!schedId) return;
    setCandidatesLoading(true);
    try {
      const res = await apiClient.get('/exam/admin/candidates', {
        params: { schedule_id: schedId }
      });
      if (res && res.success) {
        setCandidates(res.data || []);
      }
    } catch (err) {
      message.error('Lỗi tải danh sách thí sinh: ' + (err.message || 'Lỗi server'));
    } finally {
      setCandidatesLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  useEffect(() => {
    if (selectedScheduleId) {
      fetchCandidates(selectedScheduleId);
    }
  }, [selectedScheduleId, fetchCandidates]);

  // 3. Xử lý Cấp quyền / Thu hồi quyền từng thí sinh
  const handleAuthorizeCandidate = async (candidateId, newStatus, studentName) => {
    try {
      const res = await apiClient.post('/exam/admin/candidates/authorize', {
        candidate_id: candidateId,
        status: newStatus
      });
      if (res && res.success) {
        message.success(`Đã cập nhật quyền dự thi cho: ${studentName}`);
        fetchCandidates(selectedScheduleId);
        fetchSchedules();
      }
    } catch (err) {
      message.error('Không thể cập nhật quyền: ' + (err.message || 'Lỗi server'));
    }
  };

  // 4. Xử lý Cấp quyền hàng loạt sinh viên đủ điều kiện (Chuyên cần >= 80% & Học phí)
  const handleBulkAuthorize = async () => {
    try {
      const res = await apiClient.post('/exam/admin/candidates/bulk-authorize', {
        schedule_id: selectedScheduleId
      });
      if (res && res.success) {
        message.success(res.message || 'Đã cấp quyền hàng loạt thành công!');
        fetchCandidates(selectedScheduleId);
        fetchSchedules();
      }
    } catch (err) {
      message.error('Lỗi cấp quyền đồng loạt: ' + (err.message || 'Lỗi server'));
    }
  };

  // 5. Thêm ca thi mới
  const handleCreateSchedule = async (values) => {
    try {
      const facultyObj = academicOptions.faculties.find(f => f.id === values.faculty_id);
      const majorObj = academicOptions.majors.find(m => m.id === values.major_id);

      let formattedStartTime = '08:00';
      if (values.time_range && values.time_range[0]) {
        formattedStartTime = values.time_range[0].format ? values.time_range[0].format('HH:mm') : values.time_range[0];
      } else if (values.start_time) {
        formattedStartTime = values.start_time.format ? values.start_time.format('HH:mm') : values.start_time;
      }

      let formattedEndTime = '09:30';
      if (values.time_range && values.time_range[1]) {
        formattedEndTime = values.time_range[1].format ? values.time_range[1].format('HH:mm') : values.time_range[1];
      } else if (values.end_time) {
        formattedEndTime = values.end_time.format ? values.end_time.format('HH:mm') : values.end_time;
      }

      const payload = {
        ...values,
        faculty_name: facultyObj ? facultyObj.name : undefined,
        major_name: majorObj ? majorObj.name : undefined,
        exam_date: values.exam_date ? (values.exam_date.format ? values.exam_date.format('YYYY-MM-DD') : values.exam_date) : new Date().toISOString().split('T')[0],
        start_time: formattedStartTime,
        end_time: formattedEndTime
      };
      const res = await apiClient.post('/exam/admin/schedules', payload);
      if (res && res.success) {
        message.success(res.message || 'Đã khởi tạo ca thi trực tuyến mới thành công!');
        setScheduleModalOpen(false);
        scheduleForm.resetFields();
        setSelectedFaculty(null);
        setSelectedMajor(null);
        fetchSchedules();
      } else {
        message.error(res?.message || 'Không thể tạo ca thi');
      }
    } catch (err) {
      message.error('Lỗi tạo ca thi: ' + (err.response?.data?.message || err.message || 'Lỗi server'));
    }
  };

  // 6. Thêm thí sinh vào ca thi
  const handleAddStudentSubmit = async (values) => {
    try {
      const payload = {
        ...values,
        schedule_id: selectedScheduleId
      };
      const res = await apiClient.post('/exam/admin/candidates/add', payload);
      if (res && res.success) {
        message.success('Đã thêm thí sinh vào ca thi thành công!');
        setAddStudentModalOpen(false);
        studentForm.resetFields();
        fetchCandidates(selectedScheduleId);
        fetchSchedules();
      }
    } catch (err) {
      message.error('Lỗi thêm thí sinh: ' + (err.message || 'Lỗi'));
    }
  };

  // 7. Mở xem Biên bản coi thi số
  const handleOpenMinutes = async (schedId) => {
    setMinutesLoading(true);
    setMinutesModalOpen(true);
    try {
      const res = await apiClient.get(`/exam/admin/minutes/${schedId}`);
      if (res && res.success) {
        setExamMinutesData(res.data);
      }
    } catch (err) {
      message.error('Lỗi tải biên bản thi: ' + (err.message || 'Lỗi'));
    } finally {
      setMinutesLoading(false);
    }
  };

  // Ca thi đang chọn
  const currentSchedule = useMemo(() => {
    return schedules.find(s => s.id === selectedScheduleId) || schedules[0] || null;
  }, [schedules, selectedScheduleId]);

  // Lọc thí sinh theo tìm kiếm & trạng thái
  const filteredCandidates = useMemo(() => {
    return candidates.filter(c => {
      if (filterStatus !== 'ALL' && c.authorization_status !== filterStatus) {
        return false;
      }
      if (searchCandidate.trim()) {
        const q = searchCandidate.toLowerCase();
        const inName = (c.student_name || '').toLowerCase().includes(q);
        const inCode = (c.student_code || '').toLowerCase().includes(q);
        const inSbd = (c.seat_number || '').toLowerCase().includes(q);
        const inClass = (c.class_name || '').toLowerCase().includes(q);
        if (!inName && !inCode && !inSbd && !inClass) return false;
      }
      return true;
    });
  }, [candidates, filterStatus, searchCandidate]);

  // Thống kê nhanh toàn trường
  const overallStats = useMemo(() => {
    const totalSchedules = schedules.length;
    const totalCandidates = schedules.reduce((acc, s) => acc + (s.stats?.total || 0), 0);
    const totalGranted = schedules.reduce((acc, s) => acc + (s.stats?.granted || 0), 0);
    const totalPending = schedules.reduce((acc, s) => acc + (s.stats?.pending || 0), 0);
    return { totalSchedules, totalCandidates, totalGranted, totalPending };
  }, [schedules]);

  // Cột bảng Ca thi
  const scheduleColumns = [
    {
      title: 'Mã Ca Thi',
      dataIndex: 'exam_code',
      key: 'exam_code',
      render: (code) => <Text strong style={{ color: '#0958d9' }}>{code || 'EXAM-ONLINE'}</Text>
    },
    {
      title: 'Học Phần & Kỳ Thi',
      key: 'exam_name',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 600, color: '#0f172a' }}>{record.exam_name}</div>
          <div style={{ fontSize: 12, color: '#64748b' }}>
            Môn: <Tag color="blue">{record.course_code || 'IT101'}</Tag> {record.course_name}
          </div>
          <div style={{ fontSize: 11, color: '#94a3b8' }}>
            Phòng: <b>{record.room_code || 'PHÒNG-01'}</b> • {record.semester} ({record.academic_year})
          </div>
        </div>
      )
    },
    {
      title: 'Thời Gian & Thời Lượng',
      key: 'time',
      render: (_, record) => (
        <div>
          <div><ScheduleOutlined style={{ marginRight: 4, color: '#1677ff' }} />{record.exam_date}</div>
          <div style={{ fontSize: 12, color: '#64748b' }}>{record.start_time} - {record.end_time} ({record.duration_minutes || 60} phút)</div>
        </div>
      )
    },
    {
      title: 'Cán Bộ Coi Thi',
      key: 'proctors',
      render: (_, record) => (
        <div style={{ fontSize: 12 }}>
          <div><b>CBCT 1:</b> {record.proctor_1 || 'TS. Hoàng Đức Em'}</div>
          <div><b>CBCT 2:</b> {record.proctor_2 || 'ThS. Nguyễn Văn Quản'}</div>
        </div>
      )
    },
    {
      title: 'Tiến Độ Cấp Quyền',
      key: 'authorization',
      render: (_, record) => {
        const stats = record.stats || { total: 0, granted: 0, authorization_rate: 0 };
        return (
          <div style={{ minWidth: 140 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 2 }}>
              <span>Đã duyệt: <b>{stats.granted}/{stats.total}</b></span>
              <span style={{ fontWeight: 700, color: stats.authorization_rate >= 80 ? '#10b981' : '#f59e0b' }}>
                {stats.authorization_rate}%
              </span>
            </div>
            <Progress
              percent={stats.authorization_rate}
              size="small"
              strokeColor={stats.authorization_rate >= 80 ? '#10b981' : '#f59e0b'}
              showInfo={false}
            />
          </div>
        );
      }
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        if (status === 'ACTIVE') return <Tag color="processing">🟢 ĐANG DIỄN RA</Tag>;
        if (status === 'COMPLETED') return <Tag color="default">ĐÃ KẾT THÚC</Tag>;
        return <Tag color="gold">SẮP DIỄN RA</Tag>;
      }
    },
    {
      title: 'Thao Tác',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<TeamOutlined />}
            onClick={() => {
              setSelectedScheduleId(record.id);
              setActiveTab('candidates');
            }}
          >
            Duyệt quyền ({record.stats?.total || 0})
          </Button>
          <Tooltip title="Xem Biên bản coi thi số">
            <Button
              size="small"
              icon={<FileDoneOutlined />}
              onClick={() => handleOpenMinutes(record.id)}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  // Cột bảng Thí sinh & Cấp quyền
  const candidateColumns = [
    {
      title: 'SBD',
      dataIndex: 'seat_number',
      key: 'seat_number',
      render: (sbd) => <Tag color="purple" style={{ fontWeight: 700, fontSize: 13, borderRadius: 4 }}>{sbd || 'SBD-000'}</Tag>
    },
    {
      title: 'MSSV',
      dataIndex: 'student_code',
      key: 'student_code',
      render: (code) => <Text strong style={{ color: '#1677ff' }}>{code}</Text>
    },
    {
      title: 'Họ và Tên Thí Sinh',
      dataIndex: 'student_name',
      key: 'student_name',
      render: (name, record) => (
        <div>
          <div style={{ fontWeight: 600, color: '#0f172a' }}>{name}</div>
          <div style={{ fontSize: 11, color: '#64748b' }}>Lớp: {record.class_name || '23DTH01'}</div>
        </div>
      )
    },
    {
      title: 'Điều Kiện Dự Thi (Bộ GD&ĐT)',
      key: 'conditions',
      render: (_, record) => {
        const attPass = record.attendance_pct >= 80;
        const tuitionPass = record.tuition_cleared;
        return (
          <Space direction="vertical" size={2}>
            <div>
              <Text type="secondary" style={{ fontSize: 11 }}>Chuyên cần: </Text>
              <Tag color={attPass ? 'green' : 'red'} style={{ margin: 0, fontSize: 11 }}>
                {record.attendance_pct || 90}% {attPass ? '✓ Đạt' : '✗ Không đạt'}
              </Tag>
            </div>
            <div>
              <Text type="secondary" style={{ fontSize: 11 }}>Học phí: </Text>
              <Tag color={tuitionPass ? 'blue' : 'warning'} style={{ margin: 0, fontSize: 11 }}>
                {tuitionPass ? '✓ Đã nộp' : '⏳ Chưa hoàn tất'}
              </Tag>
            </div>
          </Space>
        );
      }
    },
    {
      title: 'Trạng Thái Cấp Quyền',
      dataIndex: 'authorization_status',
      key: 'authorization_status',
      render: (status, record) => {
        if (status === 'GRANTED') {
          return (
            <div>
              <Tag color="success" style={{ fontWeight: 700, borderRadius: 10, padding: '2px 8px' }}>
                <CheckCircleOutlined style={{ marginRight: 4 }} /> ĐÃ CẤP QUYỀN
              </Tag>
              {record.authorized_by && (
                <div style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>Duyệt bởi: {record.authorized_by}</div>
              )}
            </div>
          );
        }
        if (status === 'DENIED') {
          return (
            <div>
              <Tag color="error" style={{ fontWeight: 700, borderRadius: 10, padding: '2px 8px' }}>
                <CloseCircleOutlined style={{ marginRight: 4 }} /> TỪ CHỐI
              </Tag>
              <div style={{ fontSize: 10, color: '#ef4444', marginTop: 2 }}>Không đủ điều kiện</div>
            </div>
          );
        }
        if (status === 'SUSPENDED') {
          return (
            <div>
              <Tag color="default" style={{ fontWeight: 700, borderRadius: 10, padding: '2px 8px', color: '#dc2626' }}>
                <StopOutlined style={{ marginRight: 4 }} /> ĐÌNH CHỈ THI
              </Tag>
              <div style={{ fontSize: 10, color: '#dc2626', marginTop: 2 }}>Vi phạm kỷ luật</div>
            </div>
          );
        }
        if (status === 'SUBMITTED') {
          return (
            <Tag color="blue" style={{ fontWeight: 700, borderRadius: 10, padding: '2px 8px' }}>
              ✓ ĐÃ NỘP BÀI
            </Tag>
          );
        }
        return (
          <Tag color="warning" style={{ fontWeight: 600, borderRadius: 10, padding: '2px 8px' }}>
            ⏳ CHỜ ADMIN DUYỆT
          </Tag>
        );
      }
    },
    {
      title: 'Ghi Chú Phê Duyệt',
      dataIndex: 'notes',
      key: 'notes',
      render: (notes) => (
        <span style={{ fontSize: 12, color: '#64748b', maxWidth: 220, display: 'inline-block' }}>
          {notes || 'Chưa có ghi chú'}
        </span>
      )
    },
    {
      title: 'Xét Quyền',
      key: 'action',
      render: (_, record) => {
        const isGranted = record.authorization_status === 'GRANTED';
        const isSuspended = record.authorization_status === 'SUSPENDED';

        return (
          <Space size="small">
            {!isGranted ? (
              <Button
                type="primary"
                size="small"
                style={{ backgroundColor: '#10b981', borderColor: '#10b981' }}
                onClick={() => handleAuthorizeCandidate(record.id, 'GRANTED', record.student_name)}
              >
                Cấp quyền
              </Button>
            ) : (
              <Button
                danger
                size="small"
                onClick={() => handleAuthorizeCandidate(record.id, 'DENIED', record.student_name)}
              >
                Thu hồi
              </Button>
            )}

            {!isSuspended && (
              <Popconfirm
                title="Đình chỉ thi thí sinh này?"
                description="Thí sinh sẽ bị khóa ngay lập tức và lập biên bản vi phạm kỷ luật."
                onConfirm={() => handleAuthorizeCandidate(record.id, 'SUSPENDED', record.student_name)}
                okText="Đình chỉ"
                cancelText="Hủy"
                okButtonProps={{ danger: true, size: 'small' }}
              >
                <Button size="small" type="text" danger icon={<StopOutlined />} />
              </Popconfirm>
            )}
          </Space>
        );
      }
    }
  ];

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      {/* HEADER BANNER QUẢN TRỊ TỔ CHỨC THI */}
      <Card
        style={{
          marginBottom: 16,
          borderRadius: 12,
          background: 'linear-gradient(135deg, #07162c 0%, #1e3a8a 100%)',
          color: '#ffffff',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}
      >
        <Row align="middle" justify="space-between" gutter={[16, 16]}>
          <Col xs={24} md={14}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                backgroundColor: 'rgba(255,255,255,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24,
                color: '#60a5fa'
              }}>
                <SafetyCertificateOutlined />
              </div>
              <div>
                <Title level={3} style={{ color: '#ffffff', margin: 0, fontWeight: 800 }}>
                  Quản Lý Tổ Chức Thi & Cấp Quyền Dự Thi
                </Title>
                <Text style={{ color: '#93c5fd', fontSize: 13 }}>
                  Chuẩn Quy chế Đào tạo & Khảo thí Đại học của Bộ GD&ĐT (Thông tư 08/2021/TT-BGDĐT)
                </Text>
              </div>
            </div>
          </Col>

          <Col xs={24} md={10} style={{ textAlign: 'right' }}>
            <Space>
              <Button
                icon={<ReloadOutlined spin={loading} />}
                onClick={() => {
                  fetchSchedules();
                  if (selectedScheduleId) fetchCandidates(selectedScheduleId);
                }}
                style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none' }}
              >
                Làm mới
              </Button>
              <Button
                type="primary"
                icon={<ScheduleOutlined />}
                style={{ backgroundColor: '#10b981', borderColor: '#10b981', fontWeight: 600 }}
                onClick={() => setScheduleModalOpen(true)}
              >
                Lập Ca Thi Mới
              </Button>
            </Space>
          </Col>
        </Row>

        {/* THỐNG KÊ NHANH */}
        <Row gutter={16} style={{ marginTop: 20 }}>
          <Col xs={12} sm={6}>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '10px 14px', borderRadius: 8 }}>
              <div style={{ color: '#93c5fd', fontSize: 11, fontWeight: 600 }}>TỔNG SỐ CA THI</div>
              <div style={{ color: '#ffffff', fontSize: 22, fontWeight: 800 }}>{overallStats.totalSchedules}</div>
            </div>
          </Col>
          <Col xs={12} sm={6}>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '10px 14px', borderRadius: 8 }}>
              <div style={{ color: '#93c5fd', fontSize: 11, fontWeight: 600 }}>TỔNG THÍ SINH ĐĂNG KÝ</div>
              <div style={{ color: '#ffffff', fontSize: 22, fontWeight: 800 }}>{overallStats.totalCandidates}</div>
            </div>
          </Col>
          <Col xs={12} sm={6}>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '10px 14px', borderRadius: 8 }}>
              <div style={{ color: '#93c5fd', fontSize: 11, fontWeight: 600 }}>ĐÃ CẤP QUYỀN THI</div>
              <div style={{ color: '#4ade80', fontSize: 22, fontWeight: 800 }}>{overallStats.totalGranted}</div>
            </div>
          </Col>
          <Col xs={12} sm={6}>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '10px 14px', borderRadius: 8 }}>
              <div style={{ color: '#93c5fd', fontSize: 11, fontWeight: 600 }}>CHỜ ADMIN DUYỆT</div>
              <div style={{ color: '#facc15', fontSize: 22, fontWeight: 800 }}>{overallStats.totalPending}</div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* TABS CHỨC NĂNG */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        type="card"
        style={{ marginBottom: 16 }}
        items={[
          {
            key: 'schedules',
            label: (
              <span>
                <ScheduleOutlined style={{ marginRight: 6 }} />
                Danh Sách Ca Thi & Phòng Thi ({schedules.length})
              </span>
            ),
            children: (
              <Card style={{ borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <Table
                  dataSource={schedules}
                  columns={scheduleColumns}
                  rowKey="id"
                  loading={loading}
                  pagination={{ pageSize: 6 }}
                />
              </Card>
            )
          },
          {
            key: 'candidates',
            label: (
              <span>
                <TeamOutlined style={{ marginRight: 6 }} />
                Cấp Quyền & Thí Sinh Dự Thi ({candidates.length})
              </span>
            ),
            children: (
              <Card style={{ borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                {/* THANH ĐIỀU KHIỂN CHỌN CA THI & BỘ LỌC */}
                <Row gutter={[16, 16]} align="middle" justify="space-between" style={{ marginBottom: 16 }}>
                  <Col xs={24} md={10}>
                    <Space>
                      <span style={{ fontWeight: 600 }}>Chọn ca thi:</span>
                      <Select
                        style={{ width: 340 }}
                        value={selectedScheduleId}
                        onChange={(val) => setSelectedScheduleId(val)}
                      >
                        {schedules.map(s => (
                          <Option key={s.id} value={s.id}>
                            [{s.course_code || 'IT101'}] {s.exam_name} ({s.exam_date})
                          </Option>
                        ))}
                      </Select>
                    </Space>
                  </Col>

                  <Col xs={24} md={14} style={{ textAlign: 'right' }}>
                    <Space wrap>
                      <Input
                        prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
                        placeholder="Tìm SBD, MSSV, Họ tên, Lớp..."
                        value={searchCandidate}
                        onChange={(e) => setSearchCandidate(e.target.value)}
                        style={{ width: 220 }}
                        allowClear
                      />

                      <Select
                        value={filterStatus}
                        onChange={setFilterStatus}
                        style={{ width: 150 }}
                      >
                        <Option value="ALL">Tất cả trạng thái</Option>
                        <Option value="GRANTED">Đã cấp quyền</Option>
                        <Option value="PENDING">Chờ duyệt</Option>
                        <Option value="DENIED">Từ chối</Option>
                        <Option value="SUSPENDED">Đình chỉ thi</Option>
                      </Select>

                      <Button
                        type="primary"
                        icon={<ThunderboltOutlined />}
                        style={{ backgroundColor: '#10b981', borderColor: '#10b981', fontWeight: 600 }}
                        onClick={handleBulkAuthorize}
                      >
                        ⚡ Cấp quyền hàng loạt
                      </Button>

                      <Button
                        icon={<UserAddOutlined />}
                        onClick={() => setAddStudentModalOpen(true)}
                      >
                        Thêm thí sinh
                      </Button>

                      <Button
                        icon={<FileDoneOutlined />}
                        onClick={() => handleOpenMinutes(selectedScheduleId)}
                      >
                        Biên bản coi thi
                      </Button>
                    </Space>
                  </Col>
                </Row>

                {/* THÔNG TIN CA THI ĐANG CHỌN */}
                {currentSchedule && (
                  <Alert
                    style={{ marginBottom: 16, borderRadius: 6 }}
                    type="info"
                    showIcon
                    message={
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <b>Ca thi: {currentSchedule.exam_name}</b> ({currentSchedule.course_code} - {currentSchedule.course_name}) •{' '}
                          Phòng thi: <Tag color="blue">{currentSchedule.room_code}</Tag> • Ngày: <b>{currentSchedule.exam_date}</b> ({currentSchedule.start_time} - {currentSchedule.end_time})
                        </div>
                        <div>
                          CBCT 1: <b>{currentSchedule.proctor_1}</b> • CBCT 2: <b>{currentSchedule.proctor_2}</b>
                        </div>
                      </div>
                    }
                  />
                )}

                {/* BẢNG DANH SÁCH THÍ SINH */}
                <Table
                  dataSource={filteredCandidates}
                  columns={candidateColumns}
                  rowKey="id"
                  loading={candidatesLoading}
                  pagination={{ pageSize: 8 }}
                />
              </Card>
            )
          }
        ]}
      />

      {/* 1. MODAL LẬP CA THI MỚI (CHUẨN BỘ GD&ĐT VỚI LỌC KHOA, NGHỀ, HỌC PHẦN TỪ CSDL) */}
      <Modal
        title={<b><ScheduleOutlined style={{ color: '#1677ff', marginRight: 8 }} /> Lập Ca Thi Trực Tuyến Mới (Chuẩn Bộ GD&ĐT)</b>}
        open={scheduleModalOpen}
        onCancel={() => {
          setScheduleModalOpen(false);
          setSelectedFaculty(null);
          setSelectedMajor(null);
        }}
        footer={null}
        width={780}
        destroyOnClose
      >
        <Alert
          type="info"
          showIcon
          message="Hệ Thống Dữ Liệu Học Thuật Tích Hợp CSDL"
          description="Chọn Khoa và Nghề/Ngành đào tạo để thu hẹp phạm vi học phần. Khi chọn Mã học phần, hệ thống tự động hiển thị Tên học phần đầy đủ và đề xuất Tên ca thi chuẩn hóa."
          style={{ marginBottom: 18, borderRadius: 8 }}
        />

        <Form
          form={scheduleForm}
          layout="vertical"
          onFinish={handleCreateSchedule}
          initialValues={{
            semester: 'Học kỳ 1',
            academic_year: '2026-2027',
            duration_minutes: 60,
            exam_type: 'Trắc nghiệm khách quan trực tuyến',
            security_level: 'AI_PROCTORING_WEBCAM',
            proctor_1: 'TS. Hoàng Đức Em (Khoa CNTT)',
            proctor_2: 'ThS. Nguyễn Văn Quản (Phòng Khảo thí)',
            room_code: `PHONG-THI-${Date.now().toString().slice(-2)}-ONLINE`
          }}
        >
          {/* HÀNG 1: KHOA & NGHỀ / NGÀNH ĐÀO TẠO TỪ CSDL */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={<Space><BankOutlined style={{ color: '#1677ff' }} /><span>Khoa Đào Tạo (Từ CSDL)</span></Space>}
                name="faculty_id"
                rules={[{ required: true, message: 'Vui lòng chọn Khoa quản lý đào tạo' }]}
              >
                <Select
                  placeholder="-- Chọn Khoa đào tạo từ CSDL --"
                  allowClear
                  onChange={handleFacultyChange}
                  showSearch
                  optionFilterProp="children"
                >
                  {academicOptions.faculties.map(f => (
                    <Option key={f.id} value={f.id}>
                      <b>{f.code}</b> - {f.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<Space><ApartmentOutlined style={{ color: '#10b981' }} /><span>Nghề / Ngành Đào Tạo (Từ CSDL)</span></Space>}
                name="major_id"
                rules={[{ required: true, message: 'Vui lòng chọn Nghề / Ngành đào tạo' }]}
              >
                <Select
                  placeholder={selectedFaculty ? "-- Chọn Nghề/Ngành thuộc Khoa --" : "-- Chọn Nghề/Ngành đào tạo --"}
                  allowClear
                  onChange={handleMajorChange}
                  showSearch
                  optionFilterProp="children"
                >
                  {filteredMajors.map(m => (
                    <Option key={m.id} value={m.id}>
                      <b>{m.code}</b> - {m.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* HÀNG 2: MÃ HỌC PHẦN & TÊN HỌC PHẦN (TỰ ĐỘNG HIỂN THỊ) */}
          <Row gutter={16}>
            <Col span={10}>
              <Form.Item
                label={<Space><BookOutlined style={{ color: '#7c3aed' }} /><span>Mã Học Phần (Lấy từ CSDL)</span></Space>}
                name="course_code"
                rules={[{ required: true, message: 'Vui lòng chọn Mã học phần' }]}
              >
                <Select
                  showSearch
                  placeholder="-- Chọn Mã học phần từ CSDL --"
                  optionFilterProp="label"
                  onChange={handleCourseCodeChange}
                >
                  {filteredCourses.map(c => (
                    <Option key={c.id} value={c.code} label={`${c.code} ${c.name}`}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span><b>{c.code}</b> - {c.name}</span>
                        <Tag color="cyan" style={{ fontSize: 11, margin: 0 }}>{c.credits || 3} TC</Tag>
                      </div>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={14}>
              <Form.Item
                label={<span>Tên Học Phần Đầy Đủ (<b style={{ color: '#16a34a' }}>Tự động hiển thị từ CSDL</b>)</span>}
                name="course_name"
                rules={[{ required: true, message: 'Tên học phần không được để trống' }]}
              >
                <Input
                  placeholder="Tự động nhận diện và hiển thị khi chọn Mã học phần..."
                  readOnly
                  style={{
                    backgroundColor: '#f0fdf4',
                    color: '#15803d',
                    fontWeight: 600,
                    border: '1px solid #86efac'
                  }}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* HÀNG 3: TÊN KỲ THI / CA THI & MÃ PHÒNG THI */}
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                label="Tên Kỳ Thi / Ca Thi (Tự động đề xuất theo học phần)"
                name="exam_name"
                rules={[{ required: true, message: 'Vui lòng nhập tên ca thi' }]}
              >
                <Input placeholder="VD: Khảo Thí Học Phần: Lập Trình Web Nâng Cao" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Mã Phòng Thi Trực Tuyến" name="room_code">
                <Input placeholder="VD: PHONG-THI-01-ONLINE" />
              </Form.Item>
            </Col>
          </Row>

          {/* HÀNG 4: LỊCH THI - NGÀY THI & KHUNG GIỜ THI */}
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label={<Space><ScheduleOutlined style={{ color: '#1677ff' }} /><span>Ngày Thi (YYYY-MM-DD)</span></Space>}
                name="exam_date"
              >
                <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" placeholder="Chọn ngày thi" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Giờ Bắt Đầu" name="start_time">
                <TimePicker format="HH:mm" style={{ width: '100%' }} placeholder="08:00" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Giờ Kết Thúc" name="end_time">
                <TimePicker format="HH:mm" style={{ width: '100%' }} placeholder="09:30" />
              </Form.Item>
            </Col>
          </Row>

          {/* HÀNG 5: HỌC KỲ, NĂM HỌC, THỜI LƯỢNG */}
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Học Kỳ" name="semester">
                <Select>
                  <Option value="Học kỳ 1">Học kỳ 1</Option>
                  <Option value="Học kỳ 2">Học kỳ 2</Option>
                  <Option value="Học kỳ Hè">Học kỳ Hè</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Năm Học" name="academic_year">
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Thời Lượng (Phút)" name="duration_minutes" rules={[{ required: true }]}>
                <InputNumber min={15} max={180} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          {/* HÀNG 5: CÁN BỘ COI THI 1 & 2 (CHỌN TỪ GIẢNG VIÊN CSDL) */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={<Space><SolutionOutlined style={{ color: '#1677ff' }} /><span>Cán Bộ Coi Thi 1 (CBCT 1 - Từ CSDL)</span></Space>}
                name="proctor_1"
                rules={[{ required: true, message: 'Vui lòng chọn hoặc nhập CBCT 1' }]}
              >
                <Select
                  showSearch
                  placeholder="-- Chọn CBCT 1 từ danh sách Giảng viên --"
                  optionFilterProp="children"
                >
                  {academicOptions.lecturers.map(l => (
                    <Option key={`cbct1_${l.id}`} value={l.name}>
                      {l.name} {l.faculty_name ? `(${l.faculty_name})` : ''}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<Space><SolutionOutlined style={{ color: '#10b981' }} /><span>Cán Bộ Coi Thi 2 (CBCT 2 - Từ CSDL)</span></Space>}
                name="proctor_2"
                rules={[{ required: true, message: 'Vui lòng chọn hoặc nhập CBCT 2' }]}
              >
                <Select
                  showSearch
                  placeholder="-- Chọn CBCT 2 từ danh sách Giảng viên --"
                  optionFilterProp="children"
                >
                  {academicOptions.lecturers.map(l => (
                    <Option key={`cbct2_${l.id}`} value={l.name}>
                      {l.name} {l.faculty_name ? `(${l.faculty_name})` : ''}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* HÀNG 6: HÌNH THỨC THI & CHẾ ĐỘ AN NINH */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Hình Thức Thi" name="exam_type">
                <Select>
                  <Option value="Trắc nghiệm khách quan trực tuyến">Trắc nghiệm khách quan trực tuyến</Option>
                  <Option value="Tự luận số">Tự luận số</Option>
                  <Option value="Trắc nghiệm kết hợp Tự luận">Trắc nghiệm kết hợp Tự luận</Option>
                  <Option value="Vấn đáp trực tuyến">Vấn đáp trực tuyến</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Chế Độ An Ninh Phòng Thi" name="security_level">
                <Select>
                  <Option value="AI_PROCTORING_WEBCAM">Giám thị AI Webcam + Khóa toàn màn hình</Option>
                  <Option value="STRICT_SEB">Khóa trình duyệt Safe Exam Browser (SEB)</Option>
                  <Option value="STANDARD">Giám sát tiêu chuẩn</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Ghi Chú Ca Thi" name="notes">
            <Input.TextArea rows={2} placeholder="Quy định bổ sung cho thí sinh..." />
          </Form.Item>

          <div style={{ textAlign: 'right', marginTop: 16 }}>
            <Space>
              <Button onClick={() => {
                setScheduleModalOpen(false);
                setSelectedFaculty(null);
                setSelectedMajor(null);
              }}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" style={{ backgroundColor: '#10b981', borderColor: '#10b981', height: 38, fontWeight: 600, padding: '0 24px' }}>
                Khởi tạo ca thi
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>

      {/* 2. MODAL THÊM THÍ SINH VÀO CA THI */}
      <Modal
        title={<b><UserAddOutlined style={{ color: '#1677ff', marginRight: 8 }} /> Thêm Thí Sinh Vào Ca Thi</b>}
        open={addStudentModalOpen}
        onCancel={() => setAddStudentModalOpen(false)}
        footer={null}
        width={500}
        destroyOnClose
      >
        <Form
          form={studentForm}
          layout="vertical"
          onFinish={handleAddStudentSubmit}
          initialValues={{
            attendance_pct: 90,
            tuition_cleared: true
          }}
        >
          <Form.Item label="Mã Số Sinh Viên (MSSV)" name="student_code" rules={[{ required: true, message: 'Nhập MSSV' }]}>
            <Input placeholder="VD: 23DTH0199" />
          </Form.Item>

          <Form.Item label="Họ và Tên Sinh Viên" name="student_name" rules={[{ required: true, message: 'Nhập họ tên' }]}>
            <Input placeholder="VD: Nguyễn Thành Đạt" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Lớp Sinh Hoạt" name="class_name">
                <Input placeholder="VD: 23DTH01" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Số Báo Danh (SBD)" name="seat_number">
                <Input placeholder="VD: SBD-099" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Điểm Chuyên Cần (%)" name="attendance_pct">
                <InputNumber min={0} max={100} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Tình Trạng Học Phí" name="tuition_cleared">
                <Select>
                  <Option value={true}>✓ Đã hoàn thành</Option>
                  <Option value={false}>⏳ Chưa nộp</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Ghi Chú Xét Quyền" name="notes">
            <Input placeholder="Lý do bổ sung thí sinh..." />
          </Form.Item>

          <div style={{ textAlign: 'right', marginTop: 16 }}>
            <Space>
              <Button onClick={() => setAddStudentModalOpen(false)}>Hủy</Button>
              <Button type="primary" htmlType="submit">
                Thêm thí sinh
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>

      {/* 3. MODAL BIÊN BẢN COI THI SỐ (THÔNG TƯ 08/2021/TT-BGDĐT) */}
      <Modal
        title={<b><FileDoneOutlined style={{ color: '#1677ff', marginRight: 8 }} /> Biên Bản Coi Thi Trực Tuyến (Chuẩn Thông tư 08/2021/TT-BGDĐT)</b>}
        open={minutesModalOpen}
        onCancel={() => setMinutesModalOpen(false)}
        width={720}
        footer={[
          <Button key="close" onClick={() => setMinutesModalOpen(false)}>
            Đóng
          </Button>,
          <Button key="print" type="primary" icon={<PrinterOutlined />} onClick={() => window.print()}>
            In Biên Bản Coi Thi
          </Button>
        ]}
      >
        {minutesLoading || !examMinutesData ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>Đang nạp dữ liệu biên bản thi...</div>
        ) : (
          <div style={{ fontSize: 13, lineHeight: 1.6 }}>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
              <div style={{ fontStyle: 'italic', fontSize: 12 }}>Độc lập - Tự do - Hạnh phúc</div>
              <Divider style={{ margin: '8px 0 16px 0' }} />
              <div style={{ fontWeight: 800, fontSize: 16, color: '#0f172a' }}>
                BIÊN BẢN COI THI KẾT THÚC HỌC PHẦN TRỰC TUYẾN
              </div>
              <div style={{ color: '#64748b' }}>Học kỳ 1 — Năm học 2026-2027</div>
            </div>

            <table style={{ width: '100%', marginBottom: 16, borderCollapse: 'collapse' }}>
              <tbody>
                <tr>
                  <td style={{ padding: '4px 0', width: '50%' }}><b>Học phần:</b> {examMinutesData.course_name} ({examMinutesData.course_code})</td>
                  <td style={{ padding: '4px 0', width: '50%' }}><b>Hình thức thi:</b> {examMinutesData.exam_type}</td>
                </tr>
                <tr>
                  <td style={{ padding: '4px 0' }}><b>Ngày thi:</b> {examMinutesData.exam_date}</td>
                  <td style={{ padding: '4px 0' }}><b>Thời gian:</b> {examMinutesData.start_time} - {examMinutesData.end_time} ({examMinutesData.duration_minutes} phút)</td>
                </tr>
                <tr>
                  <td style={{ padding: '4px 0' }}><b>Phòng thi trực tuyến:</b> {examMinutesData.room_code}</td>
                  <td style={{ padding: '4px 0' }}><b>An ninh:</b> {examMinutesData.security_level}</td>
                </tr>
                <tr>
                  <td style={{ padding: '4px 0' }}><b>Cán bộ coi thi 1:</b> {examMinutesData.proctor_1}</td>
                  <td style={{ padding: '4px 0' }}><b>Cán bộ coi thi 2:</b> {examMinutesData.proctor_2}</td>
                </tr>
              </tbody>
            </table>

            <Card size="small" style={{ backgroundColor: '#f8fafc', marginBottom: 16, borderRadius: 8 }}>
              <div style={{ fontWeight: 700, marginBottom: 8, color: '#0958d9' }}>THỐNG KÊ SỐ LƯỢNG THÍ SINH</div>
              <Row gutter={16}>
                <Col span={6}>
                  <Statistic title="Đăng ký dự thi" value={examMinutesData.statistics?.total_registered || 0} />
                </Col>
                <Col span={6}>
                  <Statistic title="Được cấp quyền" value={examMinutesData.statistics?.total_eligible_granted || 0} valueStyle={{ color: '#16a34a' }} />
                </Col>
                <Col span={6}>
                  <Statistic title="Đã nộp bài" value={examMinutesData.statistics?.total_submitted || 0} valueStyle={{ color: '#2563eb' }} />
                </Col>
                <Col span={6}>
                  <Statistic title="Vi phạm / Đình chỉ" value={examMinutesData.statistics?.total_suspended_violations || 0} valueStyle={{ color: '#dc2626' }} />
                </Col>
              </Row>
            </Card>

            <div style={{ marginBottom: 16 }}>
              <b>Tình hình phòng thi & Kỷ luật:</b>
              <div style={{ padding: '8px 12px', background: '#f1f5f9', borderRadius: 6, marginTop: 4 }}>
                <div>• {examMinutesData.evaluation?.exam_room_status}</div>
                <div>• {examMinutesData.evaluation?.discipline_status}</div>
                <div>• {examMinutesData.evaluation?.sealed_status}</div>
              </div>
            </div>

            <Row gutter={16} style={{ textAlign: 'center', marginTop: 30 }}>
              <Col span={12}>
                <div style={{ fontWeight: 600 }}>CÁN BỘ COI THI 1</div>
                <div style={{ fontStyle: 'italic', fontSize: 11, color: '#64748b' }}>(Ký và ghi rõ họ tên)</div>
                <div style={{ marginTop: 20, fontWeight: 700, color: '#10b981' }}>✓ Đã ký số xác thực</div>
                <div>{examMinutesData.signatures?.proctor_1?.name}</div>
              </Col>
              <Col span={12}>
                <div style={{ fontWeight: 600 }}>CÁN BỘ COI THI 2</div>
                <div style={{ fontStyle: 'italic', fontSize: 11, color: '#64748b' }}>(Ký và ghi rõ họ tên)</div>
                <div style={{ marginTop: 20, fontWeight: 700, color: '#10b981' }}>✓ Đã ký số xác thực</div>
                <div>{examMinutesData.signatures?.proctor_2?.name}</div>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
}

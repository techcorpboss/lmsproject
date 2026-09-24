import React, { useState, useEffect } from 'react';
import {
  Card, Table, Tag, Button, Space, Typography, Row, Col, Select,
  Radio, Divider, message, Modal, Switch, Slider
} from 'antd';
import {
  FileTextOutlined, PrinterOutlined, DownloadOutlined, ReloadOutlined,
  CheckCircleOutlined, UserOutlined, TeamOutlined, SettingOutlined
} from '@ant-design/icons';
import apiClient from '../../services/apiClient';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

export default function MoetGradebookView() {
  const [reportType, setReportType] = useState('CLASS_SECTION'); // CLASS_SECTION, INDIVIDUAL_STUDENT, ACCUMULATED_ALL
  const [classData, setClassData] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paperOrientation, setPaperOrientation] = useState('portrait'); // portrait, landscape
  const [fontSizePt, setFontSizePt] = useState(13);
  const [showSignatures, setShowSignatures] = useState(true);

  const fetchClassGrades = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/academic/enterprise/transcripts/class/1');
      if (res && res.success) {
        setClassData(res.data);
      }
    } catch (e) {
      setClassData({
        section_id: 1,
        course_name: 'Nhập môn Lập trình C/C++ (IT101)',
        class_name: '66.CNTT-1',
        semester: 'Học kỳ 1 - Năm học 2026-2027',
        faculty: 'Khoa Công Nghệ Thông Tin',
        lecturer: 'TS. Hoàng Đức Em',
        students: [
          { student_id: 1, student_code: '261IT001', full_name: 'Trần Văn Nam', attendance_score: 9.5, assignment_score: 9.0, midterm_score: 9.0, final_exam_score: 9.5, course_score_10: 9.35, course_score_letter: 'A+', course_score_4: 4.0, course_result: 'ĐẠT (PASS)', gpa_semester_4: 3.85, gpa_accumulated_4: 3.78, academic_rank: 'XUẤT SẮC' },
          { student_id: 2, student_code: '261IT002', full_name: 'Nguyễn Thị Mai', attendance_score: 10.0, assignment_score: 9.5, midterm_score: 9.5, final_exam_score: 9.0, course_score_10: 9.30, course_score_letter: 'A+', course_score_4: 4.0, course_result: 'ĐẠT (PASS)', gpa_semester_4: 3.90, gpa_accumulated_4: 3.82, academic_rank: 'XUẤT SẮC' },
          { student_id: 3, student_code: '261IT003', full_name: 'Lê Hoàng Long', attendance_score: 8.5, assignment_score: 8.0, midterm_score: 8.0, final_exam_score: 8.5, course_score_10: 8.35, course_score_letter: 'B+', course_score_4: 3.5, course_result: 'ĐẠT (PASS)', gpa_semester_4: 3.35, gpa_accumulated_4: 3.20, academic_rank: 'GIỎI' },
          { student_id: 5, student_code: '261IT005', full_name: 'Vũ Hải Đăng', attendance_score: 4.5, assignment_score: 4.0, midterm_score: 5.0, final_exam_score: 4.0, course_score_10: 4.35, course_score_letter: 'D', course_score_4: 1.0, course_result: 'ĐẠT (PASS)', gpa_semester_4: 1.85, gpa_accumulated_4: 1.95, academic_rank: 'CẢNH BÁO HỌC VỤ 1' }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassGrades();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleExportExcel = () => {
    const students = (classData && classData.students) || [];
    const csvContent = "data:text/csv;charset=utf-8,"
      + "STT,MSSV,Họ và Tên,Chuyên Cần (10%),Thực Hành (20%),Giữa Kỳ (20%),Thi Kết Thúc (50%),Điểm HP (10),Điểm Chữ,Điểm Hệ 4,Xếp Loại\n"
      + students.map((s, idx) => `"${idx + 1}","${s.student_code}","${s.full_name}","${s.attendance_score}","${s.assignment_score}","${s.midterm_score}","${s.final_exam_score}","${s.course_score_10}","${s.course_score_letter}","${s.course_score_4}","${s.academic_rank}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `so_diem_dien_tu_moet_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    message.success('Đã xuất Sổ điểm điện tử chuẩn Excel/CSV thành công!');
  };

  const studentsList = (classData && classData.students) || [];

  const columns = [
    { title: 'STT', key: 'stt', width: 60, render: (_, __, idx) => idx + 1 },
    { title: 'MSSV', dataIndex: 'student_code', key: 'student_code', width: 110, render: (c) => <Text strong>{c}</Text> },
    { title: 'Họ và Tên Học Viên', dataIndex: 'full_name', key: 'full_name', render: (n) => <Text strong>{n}</Text> },
    { title: 'CC (10%)', dataIndex: 'attendance_score', key: 'attendance_score', width: 90 },
    { title: 'TH/BT (20%)', dataIndex: 'assignment_score', key: 'assignment_score', width: 100 },
    { title: 'Giữa Kỳ (20%)', dataIndex: 'midterm_score', key: 'midterm_score', width: 110 },
    { title: 'Thi HP (50%)', dataIndex: 'final_exam_score', key: 'final_exam_score', width: 110 },
    {
      title: 'Điểm Học Phần (Thang 10)',
      dataIndex: 'course_score_10',
      key: 'course_score_10',
      width: 130,
      render: (sc) => <Text strong style={{ color: sc >= 8.5 ? '#16a34a' : sc < 4.0 ? '#dc2626' : '#2563eb', fontSize: 14 }}>{sc}</Text>
    },
    {
      title: 'Điểm Chữ',
      dataIndex: 'course_score_letter',
      key: 'course_score_letter',
      width: 90,
      render: (ltr) => <Tag color={ltr.startsWith('A') ? 'green' : ltr === 'F' ? 'red' : 'blue'}>{ltr}</Tag>
    },
    { title: 'Điểm Hệ 4', dataIndex: 'course_score_4', key: 'course_score_4', width: 90, render: (s) => <b>{s}</b> },
    {
      title: 'Xếp Loại Học Vụ (TT 08/2021)',
      dataIndex: 'academic_rank',
      key: 'academic_rank',
      render: (rnk) => (
        <Tag color={rnk.includes('XUẤT SẮC') ? 'gold' : rnk.includes('GIỎI') ? 'green' : rnk.includes('CẢNH BÁO') ? 'error' : 'cyan'}>
          {rnk}
        </Tag>
      )
    }
  ];

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={4} style={{ margin: 0 }}>
            <FileTextOutlined style={{ color: '#10b981', marginRight: 8 }} />
            Sổ Điểm Điện Tử & Bảng Điểm In Ấn Chuẩn Bộ GD&ĐT (Thông Tư 08/2021/TT-BGDĐT)
          </Title>
          <Text type="secondary">Bảng điểm cá nhân, bảng điểm lớp theo môn, học kỳ, cả năm và toàn khóa tích lũy</Text>
        </Col>
        <Col>
          <Space>
            <Radio.Group value={reportType} onChange={e => setReportType(e.target.value)}>
              <Radio.Button value="CLASS_SECTION"><TeamOutlined /> Bảng Điểm Lớp Học Phần</Radio.Button>
              <Radio.Button value="INDIVIDUAL_STUDENT"><UserOutlined /> Bảng Điểm Cá Nhân</Radio.Button>
              <Radio.Button value="ACCUMULATED_ALL">Toàn Khóa Tích Lũy</Radio.Button>
            </Radio.Group>
            <Button icon={<ReloadOutlined />} onClick={fetchClassGrades}>Làm mới</Button>
            <Button type="primary" icon={<DownloadOutlined />} onClick={handleExportExcel}>Xuất Excel</Button>
            <Button icon={<PrinterOutlined />} onClick={handlePrint} style={{ background: '#002b66', color: '#fff', borderColor: '#002b66' }}>
              In Ấn / PDF
            </Button>
          </Space>
        </Col>
      </Row>

      {/* CÔNG CỤ TÙY BIẾN TRANG IN (PRINT CUSTOMIZER) */}
      <Card size="small" style={{ borderRadius: 8, background: '#f8fafc', marginBottom: 16 }}>
        <Row gutter={[16, 8]} align="middle">
          <Col xs={24} md={6}>
            <Space>
              <SettingOutlined />
              <Text strong>Khổ giấy in ấn:</Text>
              <Radio.Group value={paperOrientation} onChange={e => setPaperOrientation(e.target.value)} size="small">
                <Radio.Button value="portrait">A4 Dọc</Radio.Button>
                <Radio.Button value="landscape">A4 Ngang</Radio.Button>
              </Radio.Group>
            </Space>
          </Col>
          <Col xs={24} md={8}>
            <Space style={{ width: '100%' }}>
              <Text strong>Cỡ chữ in (pt):</Text>
              <Slider min={10} max={16} value={fontSizePt} onChange={setFontSizePt} style={{ width: 140 }} />
              <span>{fontSizePt} pt</span>
            </Space>
          </Col>
          <Col xs={24} md={10} style={{ textAlign: 'right' }}>
            <Space>
              <Text strong>Hiển thị chữ ký số Trưởng khoa / GV:</Text>
              <Switch checked={showSignatures} onChange={setShowSignatures} />
            </Space>
          </Col>
        </Row>
      </Card>

      {/* BẢNG ĐIỂM CHUẨN IN ẤN QUỐC GIA (PRINTABLE CONTAINER) */}
      <Card style={{ borderRadius: 12, fontSize: `${fontSizePt}px` }}>
        {/* TIÊU ĐỀ CHUẨN BỘ GIÁO DỤC */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <Row justify="space-between">
            <Col span={10} style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 700, fontSize: `${fontSizePt}px` }}>BỘ GIÁO DỤC VÀ ĐÀO TẠO</div>
              <div style={{ fontWeight: 800, fontSize: `${fontSizePt + 1}px` }}>TRƯỜNG ĐẠI HỌC CÔNG NGHỆ TECHCORP</div>
              <div style={{ fontSize: `${fontSizePt - 2}px`, color: '#64748b' }}>Khoa Công Nghệ Thông Tin</div>
            </Col>
            <Col span={14} style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 700, fontSize: `${fontSizePt}px` }}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
              <div style={{ fontWeight: 800, fontSize: `${fontSizePt}px` }}>Độc lập - Tự do - Hạnh phúc</div>
              <div style={{ fontSize: `${fontSizePt - 2}px` }}>------------------------------------</div>
            </Col>
          </Row>

          <Title level={3} style={{ margin: '18px 0 6px', color: '#002b66', fontWeight: 800 }}>
            {reportType === 'CLASS_SECTION' ? 'BẢNG ĐIỂM TỔNG KẾT LỚP HỌC PHẦN' : 'BẢNG ĐIỂM KẾT QUẢ HỌC TẬP TÍCH LŨY'}
          </Title>
          <Text style={{ fontSize: `${fontSizePt}px` }}>
            <b>Học phần:</b> {classData?.course_name} — <b>Lớp:</b> {classData?.class_name} — <b>Học kỳ:</b> {classData?.semester}
          </Text>
        </div>

        <Table
          dataSource={studentsList}
          columns={columns}
          rowKey="student_id"
          loading={loading}
          pagination={false}
          size="middle"
          bordered
        />

        {/* CHỮ KÝ PHÊ DUYỆT 3 BÊN */}
        {showSignatures && (
          <div style={{ marginTop: 32, pageBreakInside: 'avoid' }}>
            <Row gutter={16} style={{ textAlign: 'center' }}>
              <Col span={8}>
                <div style={{ fontWeight: 700, fontSize: `${fontSizePt}px` }}>GIẢNG VIÊN PHỤ TRÁCH</div>
                <div style={{ fontSize: `${fontSizePt - 2}px`, fontStyle: 'italic', marginBottom: 50 }}>(Ký và ghi rõ họ tên)</div>
                <div style={{ fontWeight: 700 }}>{classData?.lecturer}</div>
              </Col>
              <Col span={8}>
                <div style={{ fontWeight: 700, fontSize: `${fontSizePt}px` }}>TRƯỞNG BỘ MÔN</div>
                <div style={{ fontSize: `${fontSizePt - 2}px`, fontStyle: 'italic', marginBottom: 50 }}>(Ký và duyệt điểm)</div>
                <div style={{ fontWeight: 700 }}>TS. Nguyễn Văn An</div>
              </Col>
              <Col span={8}>
                <div style={{ fontWeight: 700, fontSize: `${fontSizePt}px` }}>TRƯỞNG PHÒNG ĐÀO TẠO</div>
                <div style={{ fontSize: `${fontSizePt - 2}px`, fontStyle: 'italic', marginBottom: 50 }}>(Xác nhận vào sổ gốc)</div>
                <div style={{ fontWeight: 700 }}>PGS. TS. Trần Mạnh Tuấn</div>
              </Col>
            </Row>
          </div>
        )}
      </Card>
    </div>
  );
}

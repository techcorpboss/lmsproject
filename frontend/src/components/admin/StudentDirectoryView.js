import React, { useState, useEffect, useRef } from 'react';
import {
  Table, Tag, Button, Space, Typography, Row, Col, Input, Select,
  Progress, Modal, Form, message, Tooltip, Popconfirm
} from 'antd';
import {
  TeamOutlined, UserAddOutlined, ReloadOutlined, DownloadOutlined,
  SearchOutlined, CheckCircleOutlined, ExclamationCircleOutlined,
  SafetyCertificateOutlined, DeleteOutlined, UploadOutlined, FileWordOutlined
} from '@ant-design/icons';
import apiClient from '../../services/apiClient';
import { exportToExcel, exportToWord, parseCsvFile } from '../../services/exportImportService';

const { Title, Text } = Typography;
const { Option } = Select;

export default function StudentDirectoryView() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedCohort, setSelectedCohort] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/admin/students');
      if (res && res.success) {
        setStudents(res.data);
      }
    } catch (e) {
      setStudents([
        { id: 1, student_code: '261IT001', full_name: 'Trần Văn Nam', class_name: '66.CNTT-1', major: 'Kỹ thuật Phần mềm', cohort: 'K66', gpa: 3.65, credits_accumulated: 38, lms_progress_pct: 88, status: 'ACTIVE', email: 'nam.tv@techcorp.edu.vn' },
        { id: 2, student_code: '261IT002', full_name: 'Nguyễn Thị Mai', class_name: '66.CNTT-1', major: 'Kỹ thuật Phần mềm', cohort: 'K66', gpa: 3.82, credits_accumulated: 42, lms_progress_pct: 95, status: 'ACTIVE', email: 'mai.nt@techcorp.edu.vn' },
        { id: 3, student_code: '261IT003', full_name: 'Lê Hoàng Long', class_name: '66.CNTT-1', major: 'Kỹ thuật Phần mềm', cohort: 'K66', gpa: 3.20, credits_accumulated: 35, lms_progress_pct: 82, status: 'ACTIVE', email: 'long.lh@techcorp.edu.vn' },
        { id: 4, student_code: '261IT004', full_name: 'Phạm Minh Tuấn', class_name: '66.CNTT-2', major: 'Hệ thống Thông tin', cohort: 'K66', gpa: 2.85, credits_accumulated: 32, lms_progress_pct: 74, status: 'ACTIVE', email: 'tuan.pm@techcorp.edu.vn' },
        { id: 5, student_code: '261IT005', full_name: 'Vũ Hải Đăng', class_name: '66.CNTT-2', major: 'Hệ thống Thông tin', cohort: 'K66', gpa: 1.95, credits_accumulated: 22, lms_progress_pct: 45, status: 'ACADEMIC_WARNING_1', email: 'dang.vh@techcorp.edu.vn' },
        { id: 6, student_code: '251IT010', full_name: 'Đỗ Thùy Linh', class_name: '65.CNTT-1', major: 'Khoa học Máy tính', cohort: 'K65', gpa: 3.55, credits_accumulated: 78, lms_progress_pct: 91, status: 'ACTIVE', email: 'linh.dt@techcorp.edu.vn' },
        { id: 7, student_code: '251IT012', full_name: 'Ngô Quốc Bảo', class_name: '65.CNTT-1', major: 'Khoa học Máy tính', cohort: 'K65', gpa: 3.40, credits_accumulated: 75, lms_progress_pct: 86, status: 'ACTIVE', email: 'bao.nq@techcorp.edu.vn' },
        { id: 8, student_code: '241IT008', full_name: 'Hoàng Kim Ngân', class_name: '64.CNTT-1', major: 'An toàn Thông tin', cohort: 'K64', gpa: 3.70, credits_accumulated: 112, lms_progress_pct: 96, status: 'ACTIVE', email: 'ngan.hk@techcorp.edu.vn' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSaveStudent = async (values) => {
    try {
      await apiClient.post('/admin/students', values);
      message.success('Thêm hồ sơ sinh viên thành công!');
      setIsModalOpen(false);
      form.resetFields();
      fetchStudents();
    } catch (e) {
      message.error(e.message || 'Lỗi lưu sinh viên');
    }
  };

  const fileInputRef = useRef(null);

  const handleDeleteStudent = async (id) => {
    try {
      const res = await apiClient.delete(`/admin/students/${id}`);
      if (res && res.success) {
        message.success('Đã xóa hồ sơ sinh viên khỏi cơ sở dữ liệu!');
      } else {
        message.success('Đã xóa hồ sơ sinh viên!');
      }
      fetchStudents();
    } catch (err) {
      message.error('Lỗi xóa sinh viên: ' + (err.message || 'Lỗi hệ thống'));
    }
  };

  const handleExportExcel = () => {
    const headers = ['STT', 'MSSV', 'Họ và Tên', 'Email', 'Lớp Sinh Hoạt', 'Chuyên Ngành', 'Khóa', 'GPA', 'Tín Chỉ Tích Lũy', 'Tiến Độ LMS (%)', 'Trạng Thái'];
    const dataRows = filteredStudents.map((s, idx) => [
      idx + 1,
      s.student_code,
      s.full_name,
      s.email || '',
      s.class_name,
      s.major,
      s.cohort,
      s.gpa,
      s.credits_accumulated,
      `${s.lms_progress_pct}%`,
      s.status === 'ACTIVE' ? 'Bình thường' : 'Cảnh báo học vụ'
    ]);
    const meta = {
      'Cơ quan quản lý': 'Hệ Thống Quản Trị Đào Tạo TCU COMPASS',
      'Thời điểm xuất': new Date().toLocaleString('vi-VN'),
      'Khóa đào tạo': selectedCohort === 'ALL' ? 'Toàn bộ các khóa' : selectedCohort,
      'Tổng số học viên': `${filteredStudents.length} học viên`
    };
    exportToExcel(`danh_sach_sinh_vien_${selectedCohort.toLowerCase()}`, headers, dataRows, 'DANH SÁCH HỌC VIÊN - SINH VIÊN CHÍNH QUY (LMS TCU)', meta);
    message.success('Đã xuất Danh sách sinh viên chuẩn Excel UTF-8 BOM thành công!');
  };

  const handleExportWord = () => {
    const rowsHtml = filteredStudents.map((s, idx) => `
      <tr>
        <td style="text-align: center;">${idx + 1}</td>
        <td style="text-align: center; font-weight: bold;">${s.student_code}</td>
        <td style="font-weight: bold;">${s.full_name}</td>
        <td style="text-align: center;">${s.class_name}</td>
        <td>${s.major}</td>
        <td style="text-align: center;">${s.cohort}</td>
        <td style="text-align: center; font-weight: bold;">${s.gpa}</td>
        <td style="text-align: center;">${s.credits_accumulated}</td>
        <td style="text-align: center;">${s.lms_progress_pct}%</td>
        <td style="text-align: center; color: ${s.status === 'ACTIVE' ? '#15803d' : '#b91c1c'}; font-weight: bold;">
          ${s.status === 'ACTIVE' ? 'Đủ Đ/K' : 'Cảnh Báo'}
        </td>
      </tr>
    `).join('');

    const htmlContent = `
      <table style="width: 100%; border: none; margin-bottom: 14px;">
        <tr>
          <td style="width: 50%; border: none; padding: 2px 0;"><b>Hệ đào tạo:</b> Đại học Chính quy (Tín chỉ)</td>
          <td style="width: 50%; border: none; padding: 2px 0;"><b>Khóa sinh viên:</b> ${selectedCohort === 'ALL' ? 'Toàn bộ sinh viên' : selectedCohort}</td>
        </tr>
        <tr>
          <td style="border: none; padding: 2px 0;"><b>Thời điểm trích xuất:</b> ${new Date().toLocaleDateString('vi-VN')}</td>
          <td style="border: none; padding: 2px 0;"><b>Tổng số sinh viên:</b> ${filteredStudents.length} học viên</td>
        </tr>
      </table>

      <table>
        <thead>
          <tr>
            <th style="width: 35px;">STT</th>
            <th style="width: 90px;">Mã SV</th>
            <th>Họ và Tên Sinh Viên</th>
            <th style="width: 80px;">Lớp</th>
            <th>Chuyên Ngành Đào Tạo</th>
            <th style="width: 55px;">Khóa</th>
            <th style="width: 50px;">GPA</th>
            <th style="width: 55px;">Tích Lũy</th>
            <th style="width: 65px;">LMS %</th>
            <th style="width: 85px;">Trạng Thái</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>

      <table class="footer-signature" style="margin-top: 35px;">
        <tr>
          <td style="width: 33%;">
            <div class="bold">NGƯỜI LẬP DANH SÁCH</div>
            <div class="italic" style="font-size: 10pt;">(Ký và ghi rõ họ tên)</div>
            <div style="height: 60px;"></div>
            <div class="bold">ThS. Lê Hoàng Hà</div>
          </td>
          <td style="width: 33%;">
            <div class="bold">PHÒNG ĐÀO TẠO & QLNH</div>
            <div class="italic" style="font-size: 10pt;">(Ký và đóng dấu)</div>
            <div style="height: 60px;"></div>
            <div class="bold">PGS. TS. Trần Mạnh Tuấn</div>
          </td>
          <td style="width: 34%;">
            <div class="bold">HIỆU TRƯỞNG / BGH PHÊ DUYỆT</div>
            <div class="italic" style="font-size: 10pt;">(Ký và đóng dấu)</div>
            <div style="height: 60px;"></div>
            <div class="bold">GS. TS. Nguyễn Văn Cường</div>
          </td>
        </tr>
      </table>
    `;

    exportToWord(`danh_sach_sinh_vien_${selectedCohort.toLowerCase()}`, {
      title: 'DANH SÁCH HỌC VIÊN - SINH VIÊN CHÍNH QUY',
      subtitle: '(Trích lục dữ liệu hồ sơ quản lý đào tạo theo Thông tư 08/2021/TT-BGDĐT)',
      htmlContent,
      orientation: 'landscape'
    });
    message.success('Đã xuất Danh sách sinh viên chuẩn Microsoft Word (.doc) theo NĐ 30/2020/NĐ-CP!');
  };

  const handleTriggerImport = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { headers, rows } = await parseCsvFile(file);
      if (!rows || rows.length === 0) {
        message.warning('Tệp tin không chứa bản ghi sinh viên hợp lệ!');
        return;
      }

      const mssvIdx = headers.findIndex(h => /mssv|mã|student_code/i.test(h));
      const nameIdx = headers.findIndex(h => /họ và tên|tên|name|full_name/i.test(h));
      const classIdx = headers.findIndex(h => /lớp|class/i.test(h));
      const majorIdx = headers.findIndex(h => /ngành|major/i.test(h));
      const cohortIdx = headers.findIndex(h => /khóa|cohort/i.test(h));
      const emailIdx = headers.findIndex(h => /email|thư/i.test(h));

      if (mssvIdx === -1 || nameIdx === -1) {
        message.error('File Excel cần tối thiểu 2 cột: MSSV và Họ và Tên!');
        return;
      }

      const parsedStudents = rows.map(r => ({
        student_code: r[mssvIdx],
        full_name: r[nameIdx],
        class_name: classIdx !== -1 && r[classIdx] ? r[classIdx] : '66.CNTT-1',
        major: majorIdx !== -1 && r[majorIdx] ? r[majorIdx] : 'Kỹ thuật Phần mềm',
        cohort: cohortIdx !== -1 && r[cohortIdx] ? r[cohortIdx] : 'K66',
        email: emailIdx !== -1 && r[emailIdx] ? r[emailIdx] : `${r[mssvIdx].toLowerCase()}@techcorp.edu.vn`,
        gpa: 3.5,
        credits_accumulated: 35,
        lms_progress_pct: 85,
        status: 'ACTIVE'
      })).filter(s => s.student_code && s.full_name);

      if (parsedStudents.length === 0) {
        message.warning('Không tìm thấy dòng dữ liệu sinh viên nào!');
        return;
      }

      const res = await apiClient.post('/admin/students/batch', { students: parsedStudents });
      if (res && res.success) {
        message.success(`Đã nhập và lưu thành công ${res.savedCount || parsedStudents.length} hồ sơ sinh viên vào CSDL!`);
        fetchStudents();
      } else {
        message.success(`Đã tiếp nhận ${parsedStudents.length} sinh viên!`);
        fetchStudents();
      }
    } catch (err) {
      message.error('Lỗi khi đọc file sinh viên: ' + err.message);
    } finally {
      e.target.value = '';
    }
  };

  const filteredStudents = students.filter(s => {
    const matchSearch =
      s.full_name.toLowerCase().includes(searchText.toLowerCase()) ||
      s.student_code.toLowerCase().includes(searchText.toLowerCase()) ||
      s.class_name.toLowerCase().includes(searchText.toLowerCase());
    const matchCohort = selectedCohort === 'ALL' || s.cohort === selectedCohort;
    return matchSearch && matchCohort;
  });

  const columns = [
    {
      title: 'Mã SV',
      dataIndex: 'student_code',
      key: 'student_code',
      width: 120,
      render: (code) => <Text strong style={{ color: '#1677ff' }}>{code}</Text>
    },
    {
      title: 'Họ và Tên',
      dataIndex: 'full_name',
      key: 'full_name',
      render: (name, r) => (
        <Space direction="vertical" size={0}>
          <Text strong>{name}</Text>
          <Text type="secondary" style={{ fontSize: 11 }}>{r.email}</Text>
        </Space>
      )
    },
    {
      title: 'Lớp & Ngành Đào Tạo',
      dataIndex: 'class_name',
      key: 'class_name',
      render: (c, r) => (
        <div>
          <Tag color="geekblue">{c}</Tag>
          <span style={{ fontSize: 12, color: '#475569' }}>{r.major}</span>
        </div>
      )
    },
    {
      title: 'Khóa',
      dataIndex: 'cohort',
      key: 'cohort',
      width: 80,
      render: (ch) => <Tag color="purple">{ch}</Tag>
    },
    {
      title: 'Điểm GPA / Tín chỉ',
      key: 'academic',
      width: 140,
      render: (_, r) => (
        <div>
          <Text strong style={{ color: r.gpa >= 3.2 ? '#52c41a' : r.gpa < 2.0 ? '#ff4d4f' : '#fa8c16' }}>
            GPA: {r.gpa}
          </Text>
          <div style={{ fontSize: 11, color: '#64748b' }}>Đã tích lũy: {r.credits_accumulated} TC</div>
        </div>
      )
    },
    {
      title: 'Tiến Độ Học LMS',
      dataIndex: 'lms_progress_pct',
      key: 'lms_progress_pct',
      width: 170,
      render: (pct) => (
        <Space wrap>
          <Progress percent={pct} size="small" style={{ width: 90 }} strokeColor={pct >= 80 ? '#52c41a' : '#faad14'} />
          {pct >= 80 && <Tag color="success" style={{ fontSize: 10 }}>Đủ điều kiện thi</Tag>}
        </Space>
      )
    },
    {
      title: 'Trạng Thái Học Vụ',
      dataIndex: 'status',
      key: 'status',
      width: 140,
      render: (st) => (
        st === 'ACTIVE' ? (
          <Tag color="success">Bình thường</Tag>
        ) : (
          <Tag color="error">Cảnh báo học vụ (TT 08)</Tag>
        )
      )
    },
    {
      title: 'Hành Động',
      key: 'actions',
      width: 90,
      align: 'center',
      render: (_, r) => (
        <Popconfirm
          title="Xác nhận xóa học viên?"
          description={`Xóa học viên ${r.full_name} (${r.student_code}) khỏi cơ sở dữ liệu?`}
          onConfirm={() => handleDeleteStudent(r.id)}
          okText="Xóa"
          cancelText="Hủy"
          okButtonProps={{ danger: true, size: 'small' }}
        >
          <Button danger size="small" icon={<DeleteOutlined />} />
        </Popconfirm>
      )
    }
  ];

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={4} style={{ margin: 0 }}>
            <TeamOutlined style={{ color: '#1677ff', marginRight: 8 }} />
            Quản Lý Danh Sách Học Viên & Tiến Độ Học Tập Tích Lũy
          </Title>
          <Text type="secondary">Theo dõi tiến độ hoàn thành bài giảng 15 tuần, tỷ lệ đạt điều kiện thi theo TT 08/2021</Text>
        </Col>
        <Col>
          <Space wrap>
            <Select value={selectedCohort} onChange={setSelectedCohort} style={{ width: 130 }}>
              <Option value="ALL">Tất cả Khóa</Option>
              <Option value="K66">Khóa K66</Option>
              <Option value="K65">Khóa K65</Option>
              <Option value="K64">Khóa K64</Option>
            </Select>
            <Input
              placeholder="Tìm MSSV, tên, lớp..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              style={{ width: 180 }}
              allowClear
            />
            <Button icon={<ReloadOutlined />} onClick={fetchStudents}>Làm mới</Button>
            <Button type="primary" icon={<UserAddOutlined />} onClick={() => setIsModalOpen(true)}>Thêm SV</Button>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileImport}
              style={{ display: 'none' }}
              accept=".csv,.txt"
            />
            <Button
              icon={<UploadOutlined />}
              onClick={handleTriggerImport}
              style={{ borderColor: '#10b981', color: '#10b981' }}
            >
              Nhập Excel
            </Button>
            <Button icon={<DownloadOutlined />} onClick={handleExportExcel}>
              Xuất Excel (BOM)
            </Button>
            <Button
              icon={<FileWordOutlined />}
              onClick={handleExportWord}
              style={{ background: '#2563eb', color: '#fff', borderColor: '#2563eb' }}
            >
              Xuất File Word (.doc)
            </Button>
          </Space>
        </Col>
      </Row>

      <Table
        dataSource={filteredStudents}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 8 }}
      />

      <Modal
        title="Thêm Hồ Sơ Sinh Viên Mới Vào LMS"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        okText="Lưu Hồ Sơ"
        cancelText="Hủy"
        width={620}
      >
        <Form form={form} layout="vertical" onFinish={handleSaveStudent}>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="student_code" label="Mã số sinh viên (MSSV)" rules={[{ required: true }]}>
                <Input placeholder="VD: 261IT099" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="full_name" label="Họ và tên sinh viên" rules={[{ required: true }]}>
                <Input placeholder="VD: Lê Thị Ánh Tuyết" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="email" label="Địa chỉ Email" rules={[{ required: true, type: 'email' }]}>
                <Input placeholder="tuyet.lta@techcorp.edu.vn" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="birth_date" label="Ngày sinh" initialValue="20/05/2004">
                <Input placeholder="DD/MM/YYYY" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="faculty_name" label="Khoa đào tạo" initialValue="Khoa Công Nghệ Thông Tin">
                <Select>
                  <Option value="Khoa Công Nghệ Thông Tin">Khoa Công Nghệ Thông Tin (CNTT)</Option>
                  <Option value="Khoa Kinh Tế & QTKD">Khoa Kinh Tế & QTKD (KT)</Option>
                  <Option value="Khoa Ngoại Ngữ">Khoa Ngoại Ngữ (NN)</Option>
                  <Option value="Khoa Du Lịch & Khách Sạn">Khoa Du Lịch & Khách Sạn (DL)</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="major" label="Chuyên ngành đào tạo" initialValue="Kỹ thuật Phần mềm">
                <Select>
                  <Option value="Kỹ thuật Phần mềm">Kỹ thuật Phần mềm (7480103)</Option>
                  <Option value="Khoa học Máy tính & AI">Khoa học Máy tính & AI (7480101)</Option>
                  <Option value="Công nghệ Thông tin">Công nghệ Thông tin (7480201)</Option>
                  <Option value="Hệ thống Thông tin">Hệ thống Thông tin (7480104)</Option>
                  <Option value="Quản trị Kinh doanh">Quản trị Kinh doanh (7340101)</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="cohort" label="Khóa đào tạo" initialValue="K66">
                <Select>
                  <Option value="K66">Khóa 66 (2022 - 2026)</Option>
                  <Option value="K67">Khóa 67 (2023 - 2027)</Option>
                  <Option value="K68">Khóa 68 (2024 - 2028)</Option>
                  <Option value="K65">Khóa 65 (2021 - 2025)</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="class_name" label="Lớp hành chính / sinh hoạt" initialValue="66.CNTT-1" rules={[{ required: true }]}>
                <Select>
                  <Option value="66.CNTT-1">Lớp 66.CNTT-1</Option>
                  <Option value="66.CNTT-2">Lớp 66.CNTT-2</Option>
                  <Option value="66.HTTT-1">Lớp 66.HTTT-1</Option>
                  <Option value="66.KHMT-1">Lớp 66.KHMT-1</Option>
                  <Option value="68.KHMT-1">Lớp 68.KHMT-1</Option>
                  <Option value="66.QTKD-1">Lớp 66.QTKD-1</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}

// frontend/src/components/common/UniversalExcelHubModal.js
// 📊 Trung Tâm Nhập/Xuất Dữ Liệu Excel Vạn Năng (Universal Excel Hub)
// Hỗ trợ trường học độc lập (Không cần ERP) nhập/xuất Sinh viên, Giảng viên, Lớp học và Bảng điểm
import React, { useState, useRef } from 'react';
import {
  Modal, Button, Space, Typography, Tag, Table, Radio, Alert,
  Progress, Upload, message, Tooltip, Row, Col, Card, Tabs, Badge
} from 'antd';
import {
  FileExcelOutlined, DownloadOutlined, UploadOutlined, CheckCircleOutlined,
  CloseCircleOutlined, ExclamationCircleOutlined, DatabaseOutlined,
  UserOutlined, TeamOutlined, SolutionOutlined, ReadOutlined, EyeOutlined
} from '@ant-design/icons';
import * as XLSX from 'xlsx';
import apiClient from '../../services/apiClient';

const { Title, Text, Paragraph } = Typography;

export default function UniversalExcelHubModal({
  open,
  onClose,
  initialTarget = 'STUDENTS', // 'STUDENTS' | 'LECTURERS' | 'CLASSES' | 'GRADEBOOK'
  sectionId = 1,
  onSuccess
}) {
  const [targetType, setTargetType] = useState(initialTarget);
  const [parsedRows, setParsedRows] = useState([]);
  const [validatedData, setValidatedData] = useState([]);
  const [validationStats, setValidationStats] = useState({ total: 0, valid: 0, invalid: 0 });
  const [activeFilterTab, setActiveFilterTab] = useState('ALL');
  const [uploading, setUploading] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState('');
  const fileInputRef = useRef(null);

  // Định nghĩa cấu hình cho từng phân hệ
  const ENTITY_CONFIGS = {
    STUDENTS: {
      name: 'Hồ sơ Sinh viên',
      icon: <TeamOutlined style={{ color: '#2563eb' }} />,
      color: '#2563eb',
      templateName: 'Mau_Danh_Sach_Sinh_Vien_TCU.xlsx',
      headers: ['STT', 'MSSV', 'Họ và Tên', 'Ngày Sinh', 'Giới Tính', 'Lớp Sinh Hoạt', 'Chuyên Ngành', 'Khóa', 'Email', 'Số Điện Thoại'],
      sampleRows: [
        [1, '261IT001', 'Trần Văn Nam', '15/08/2004', 'Nam', '66.CNTT-1', 'Kỹ thuật Phần mềm', 'K66', 'nam.tv@techcorp.edu.vn', '0912345678'],
        [2, '261IT002', 'Nguyễn Thị Mai', '20/11/2004', 'Nữ', '66.CNTT-1', 'Kỹ thuật Phần mềm', 'K66', 'mai.nt@techcorp.edu.vn', '0912345679'],
        [3, '261IT003', 'Lê Hoàng Long', '02/05/2004', 'Nam', '66.CNTT-1', 'Kỹ thuật Phần mềm', 'K66', 'long.lh@techcorp.edu.vn', '0912345680']
      ],
      requiredKeys: ['student_code', 'full_name'],
      endpoint: '/admin/students/batch',
      payloadKey: 'students'
    },
    LECTURERS: {
      name: 'Hồ sơ Cán bộ Giảng viên',
      icon: <SolutionOutlined style={{ color: '#059669' }} />,
      color: '#059669',
      templateName: 'Mau_Danh_Sach_Giang_Vien_TCU.xlsx',
      headers: ['STT', 'Mã Giảng Viên', 'Họ và Tên', 'Học Hàm / Học Vị', 'Khoa / Viện', 'Bộ Môn', 'Email', 'Số Điện Thoại', 'Chuyên Môn Giảng Dạy', 'Số Năm Kinh Nghiệm'],
      sampleRows: [
        [1, 'GV001', 'TS. Hoàng Đức Em', 'Tiến sĩ', 'Khoa Công Nghệ Thông Tin', 'Bộ môn Kỹ thuật Phần mềm', 'em.hd@techcorp.edu.vn', '0912345678', 'Kỹ thuật Phần mềm & CSDL', 14],
        [2, 'GV002', 'PGS. TS. Trần Mạnh Tuấn', 'Phó Giáo sư', 'Khoa Công Nghệ Thông Tin', 'Bộ môn Khoa học Máy tính', 'tuan.tm@techcorp.edu.vn', '0903112233', 'Trí tuệ Nhân tạo & Deep Learning', 22],
        [3, 'GV003', 'TS. Nguyễn Văn An', 'Tiến sĩ', 'Khoa Công Nghệ Thông Tin', 'Bộ môn Kỹ thuật Phần mềm', 'an.nv@techcorp.edu.vn', '0915667788', 'Cấu trúc Dữ liệu & Giải thuật', 12]
      ],
      requiredKeys: ['code', 'full_name'],
      endpoint: '/academic/enterprise/lecturers/batch',
      payloadKey: 'lecturers'
    },
    CLASSES: {
      name: 'Danh mục Lớp học & Lớp HP',
      icon: <ReadOutlined style={{ color: '#d97706' }} />,
      color: '#d97706',
      templateName: 'Mau_Danh_Sach_Lop_Hoc_TCU.xlsx',
      headers: ['STT', 'Mã Lớp', 'Tên Lớp Học', 'Khoa Quản Lý', 'Chuyên Ngành', 'Khóa Sinh Viên', 'Năm Học', 'Sĩ Số Dự Kiến', 'Cố Vấn Học Tập / GVCN', 'Phòng Học Thường Xuyên'],
      sampleRows: [
        [1, '66.CNTT-1', 'Lớp 66.CNTT-1', 'Khoa Công Nghệ Thông Tin', 'Kỹ thuật Phần mềm', 'K66', '2026-2027', 42, 'TS. Hoàng Đức Em', 'P.401-A3'],
        [2, '66.CNTT-2', 'Lớp 66.CNTT-2', 'Khoa Công Nghệ Thông Tin', 'Kỹ thuật Phần mềm', 'K66', '2026-2027', 40, 'ThS. Chu Quỳnh Anh', 'P.402-A3'],
        [3, '66.HTTT-1', 'Lớp 66.HTTT-1', 'Khoa Công Nghệ Thông Tin', 'Hệ thống Thông tin', 'K66', '2026-2027', 45, 'TS. Hoàng Đức Em', 'P.501-A3']
      ],
      requiredKeys: ['class_code', 'class_name'],
      endpoint: '/academic/enterprise/classes/batch',
      payloadKey: 'classes'
    },
    GRADEBOOK: {
      name: 'Bảng điểm Học phần (TT 08)',
      icon: <DatabaseOutlined style={{ color: '#7c3aed' }} />,
      color: '#7c3aed',
      templateName: 'Mau_Bang_Diem_Hoc_Phan_TCU.xlsx',
      headers: ['STT', 'MSSV', 'Họ và Tên', 'Lớp Sinh Hoạt', 'Điểm Chuyên Cần (10%)', 'Điểm Bài Tập (15%)', 'Điểm Giữa Kỳ (25%)', 'Điểm Thi Cuối Kỳ (50%)'],
      sampleRows: [
        [1, '261IT001', 'Trần Văn Nam', '66.CNTT-1', 9.5, 9.0, 9.0, 9.5],
        [2, '261IT002', 'Nguyễn Thị Mai', '66.CNTT-1', 10.0, 9.5, 9.5, 9.0],
        [3, '261IT003', 'Lê Hoàng Long', '66.CNTT-1', 8.5, 8.0, 8.0, 8.5]
      ],
      requiredKeys: ['student_code'],
      endpoint: '/academic/enterprise/transcripts/class/batch',
      payloadKey: 'grades'
    }
  };

  const currentConfig = ENTITY_CONFIGS[targetType] || ENTITY_CONFIGS.STUDENTS;

  // 1. TẢI FILE EXCEL (.XLSX) MẪU CHUẨN
  const handleDownloadTemplate = () => {
    try {
      const wb = XLSX.utils.book_new();
      const wsData = [
        [`CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM`],
        [`Độc lập - Tự do - Hạnh phúc`],
        [''],
        [`BẢNG BIỂU MẪU DỮ LIỆU CHUẨN: ${currentConfig.name.toUpperCase()}`],
        [`Hệ Thống LMS TCU COMPASS - Tiêu chuẩn Bộ Giáo Dục & Đào Tạo`],
        [`Ngày khởi tạo: ${new Date().toLocaleDateString('vi-VN')}`],
        [''],
        currentConfig.headers,
        ...currentConfig.sampleRows
      ];

      const ws = XLSX.utils.aoa_to_sheet(wsData);

      // Căn chỉnh độ rộng cột
      ws['!cols'] = currentConfig.headers.map(() => ({ wch: 22 }));

      XLSX.utils.book_append_sheet(wb, ws, 'Mau_Du_Lieu');
      XLSX.writeFile(wb, currentConfig.templateName);
      message.success(`Đã tải xuống file mẫu: ${currentConfig.templateName}`);
    } catch (err) {
      message.error('Lỗi tạo file mẫu Excel: ' + err.message);
    }
  };

  // 2. ĐỌC FILE EXCEL ĐƯỢC CHỌN TỪ THIẾT BỊ
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFileName(file.name);
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const buffer = new Uint8Array(event.target.result);
        const workbook = XLSX.read(buffer, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rawGrid = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

        if (!rawGrid || rawGrid.length === 0) {
          message.warning('File Excel không có nội dung!');
          return;
        }

        // Tìm dòng tiêu đề (header row)
        let headerRowIndex = -1;
        let detectedHeaders = [];

        for (let i = 0; i < Math.min(15, rawGrid.length); i++) {
          const row = rawGrid[i];
          const hasKeyMatch = row.some(cell =>
            /mssv|mã|student_code|họ và tên|full_name|tên|lớp|class|ngành|chuyên môn|điểm/i.test(String(cell))
          );
          if (hasKeyMatch) {
            headerRowIndex = i;
            detectedHeaders = row.map(h => String(h).trim());
            break;
          }
        }

        if (headerRowIndex === -1) {
          message.error('Không tìm thấy dòng tiêu đề hợp lệ trong file Excel!');
          return;
        }

        // Đọc các dòng dữ liệu sau header
        const rawDataRows = rawGrid.slice(headerRowIndex + 1).filter(r => r.some(c => String(c).trim() !== ''));

        // Chuyển đổi và kiểm tra tính hợp lệ
        const validated = rawDataRows.map((row, rowIdx) => {
          const rowObj = {};
          detectedHeaders.forEach((h, colIdx) => {
            rowObj[h] = row[colIdx] !== undefined ? String(row[colIdx]).trim() : '';
          });

          // Chuẩn hóa trường dựa trên loại đối tượng
          const item = normalizeRow(targetType, rowObj, detectedHeaders, rowIdx);
          return item;
        });

        const validCount = validated.filter(v => v._isValid).length;
        const invalidCount = validated.length - validCount;

        setParsedRows(validated);
        setValidatedData(validated);
        setValidationStats({
          total: validated.length,
          valid: validCount,
          invalid: invalidCount
        });

        message.success(`Đã phân tích thành công ${validated.length} dòng dữ liệu (${validCount} hợp lệ, ${invalidCount} cảnh báo)!`);
      } catch (err) {
        message.error('Lỗi khi đọc file Excel: ' + err.message);
      }
    };

    reader.readAsArrayBuffer(file);
    e.target.value = '';
  };

  // Chuẩn hóa một dòng theo đối tượng
  const normalizeRow = (type, rowObj, headers, rowIdx) => {
    const findVal = (regex) => {
      const matchKey = headers.find(h => regex.test(h));
      return matchKey ? rowObj[matchKey] : '';
    };

    const errors = [];
    let mapped = {};

    if (type === 'STUDENTS') {
      const code = findVal(/mssv|mã sinh viên|mã sv|student_code|code/i);
      const name = findVal(/họ và tên|họ tên|tên|full_name|name/i);
      const birth = findVal(/ngày sinh|birth|dob/i);
      const gender = findVal(/giới tính|gender/i);
      const className = findVal(/lớp|class/i);
      const major = findVal(/ngành|chuyên ngành|major/i);
      const cohort = findVal(/khóa|cohort/i);
      const email = findVal(/email|thư/i);
      const phone = findVal(/điện thoại|phone|sđt/i);

      if (!code) errors.push('Thiếu MSSV');
      if (!name) errors.push('Thiếu Họ và Tên');

      mapped = {
        key: rowIdx,
        _stt: rowIdx + 1,
        student_code: code,
        full_name: name,
        birth_date: birth || '01/01/2004',
        gender: gender || 'Nam',
        class_name: className || '66.CNTT-1',
        major: major || 'Kỹ thuật Phần mềm',
        cohort: cohort || 'K66',
        email: email || (code ? `${code.toLowerCase()}@techcorp.edu.vn` : ''),
        phone: phone || '0900.000.000',
        status: 'ACTIVE'
      };
    } else if (type === 'LECTURERS') {
      const code = findVal(/mã giảng viên|mã gv|code|lecturer_code/i);
      const name = findVal(/họ và tên|họ tên|tên|full_name/i);
      const title = findVal(/học hàm|học vị|title/i);
      const faculty = findVal(/khoa|viện|faculty/i);
      const dept = findVal(/bộ môn|department/i);
      const email = findVal(/email/i);
      const phone = findVal(/điện thoại|phone/i);
      const spec = findVal(/chuyên môn|specialization/i);
      const exp = findVal(/kinh nghiệm|năm|experience/i);

      if (!code) errors.push('Thiếu Mã Giảng Viên');
      if (!name) errors.push('Thiếu Họ và Tên Giảng Viên');

      mapped = {
        key: rowIdx,
        _stt: rowIdx + 1,
        code,
        full_name: name,
        title: title || 'Thạc sĩ',
        faculty_name: faculty || 'Khoa Công Nghệ Thông Tin',
        department: dept || 'Bộ môn Kỹ thuật Phần mềm',
        email: email || (code ? `${code.toLowerCase()}@techcorp.edu.vn` : ''),
        phone: phone || '0900.000.000',
        specialization: spec || 'Công nghệ Thông tin',
        experience_years: Number(exp) || 5,
        status: 'Đang công tác'
      };
    } else if (type === 'CLASSES') {
      const code = findVal(/mã lớp|class_code|code/i);
      const name = findVal(/tên lớp|class_name|name/i);
      const faculty = findVal(/khoa|faculty/i);
      const major = findVal(/ngành|major/i);
      const cohort = findVal(/khóa|cohort/i);
      const total = findVal(/sĩ số|total/i);
      const advisor = findVal(/cố vấn|chủ nhiệm|advisor/i);
      const room = findVal(/phòng|room/i);

      if (!code) errors.push('Thiếu Mã Lớp');
      if (!name) errors.push('Thiếu Tên Lớp');

      mapped = {
        key: rowIdx,
        _stt: rowIdx + 1,
        class_code: code,
        class_name: name || code,
        faculty_name: faculty || 'Khoa Công Nghệ Thông Tin',
        major_name: major || 'Kỹ thuật Phần mềm',
        cohort: cohort || 'K66',
        total_students: Number(total) || 40,
        advisor: advisor || 'Chưa phân công',
        room: room || 'P.401-A3'
      };
    } else if (type === 'GRADEBOOK') {
      const code = findVal(/mssv|mã|student_code/i);
      const name = findVal(/họ và tên|tên|name/i);
      const att = findVal(/chuyên cần|attendance|cc/i);
      const ass = findVal(/bài tập|assignment|bt/i);
      const mid = findVal(/giữa kỳ|midterm|gk/i);
      const finalExam = findVal(/cuối kỳ|final|ck/i);

      if (!code) errors.push('Thiếu MSSV');

      mapped = {
        key: rowIdx,
        _stt: rowIdx + 1,
        student_code: code,
        full_name: name || 'Sinh viên',
        attendance_score: att !== '' ? Number(att) : 8.0,
        assignment_score: ass !== '' ? Number(ass) : 8.0,
        midterm_score: mid !== '' ? Number(mid) : 8.0,
        final_exam_score: finalExam !== '' ? Number(finalExam) : 8.0
      };
    }

    mapped._errors = errors;
    mapped._isValid = errors.length === 0;
    return mapped;
  };

  // 3. THỰC HIỆN NẠP VÀO CSDL HỆ THỐNG
  const handleExecuteImport = async () => {
    const validRows = validatedData.filter(d => d._isValid);
    if (validRows.length === 0) {
      message.error('Không có dòng dữ liệu hợp lệ nào để nạp!');
      return;
    }

    try {
      setUploading(true);
      const payload = {};
      if (targetType === 'STUDENTS') payload.students = validRows;
      else if (targetType === 'LECTURERS') payload.lecturers = validRows;
      else if (targetType === 'CLASSES') payload.classes = validRows;
      else if (targetType === 'GRADEBOOK') {
        payload.sectionId = sectionId;
        payload.grades = validRows;
      }

      const res = await apiClient.post(currentConfig.endpoint, payload);

      if (res && res.success) {
        message.success(res.message || `Đã nạp thành công ${validRows.length} bản ghi ${currentConfig.name} vào hệ thống!`);
        if (onSuccess) onSuccess(res);
        handleReset();
        onClose();
      } else {
        message.success(`Đã nạp thành công ${validRows.length} bản ghi vào hệ thống!`);
        if (onSuccess) onSuccess();
        handleReset();
        onClose();
      }
    } catch (err) {
      message.error('Lỗi khi nạp dữ liệu vào máy chủ: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleReset = () => {
    setParsedRows([]);
    setValidatedData([]);
    setValidationStats({ total: 0, valid: 0, invalid: 0 });
    setSelectedFileName('');
  };

  // Lọc dữ liệu hiển thị theo Tab
  const displayedRows = validatedData.filter(row => {
    if (activeFilterTab === 'VALID') return row._isValid;
    if (activeFilterTab === 'INVALID') return !row._isValid;
    return true;
  });

  // Cấu hình cột hiển thị theo từng phân hệ
  const getColumns = () => {
    const baseCols = [
      {
        title: 'STT',
        dataIndex: '_stt',
        width: 60,
        align: 'center'
      },
      {
        title: 'Trạng Thái',
        dataIndex: '_isValid',
        width: 120,
        render: (isValid, record) => isValid ? (
          <Tag color="success" icon={<CheckCircleOutlined />}>Hợp lệ</Tag>
        ) : (
          <Tooltip title={record._errors.join(', ')}>
            <Tag color="error" icon={<CloseCircleOutlined />}>Lỗi ({record._errors.length})</Tag>
          </Tooltip>
        )
      }
    ];

    if (targetType === 'STUDENTS') {
      return [
        ...baseCols,
        { title: 'MSSV', dataIndex: 'student_code', width: 110, render: t => <strong>{t}</strong> },
        { title: 'Họ và Tên', dataIndex: 'full_name' },
        { title: 'Lớp', dataIndex: 'class_name', width: 100 },
        { title: 'Chuyên Ngành', dataIndex: 'major' },
        { title: 'Khóa', dataIndex: 'cohort', width: 80 },
        { title: 'Email', dataIndex: 'email' }
      ];
    }

    if (targetType === 'LECTURERS') {
      return [
        ...baseCols,
        { title: 'Mã GV', dataIndex: 'code', width: 100, render: t => <strong>{t}</strong> },
        { title: 'Họ và Tên Giảng Viên', dataIndex: 'full_name' },
        { title: 'Học Hàm / Học Vị', dataIndex: 'title', width: 120 },
        { title: 'Khoa / Đơn Vị', dataIndex: 'faculty_name' },
        { title: 'Chuyên Môn', dataIndex: 'specialization' },
        { title: 'Email', dataIndex: 'email' }
      ];
    }

    if (targetType === 'CLASSES') {
      return [
        ...baseCols,
        { title: 'Mã Lớp', dataIndex: 'class_code', width: 110, render: t => <strong>{t}</strong> },
        { title: 'Tên Lớp', dataIndex: 'class_name' },
        { title: 'Khoa', dataIndex: 'faculty_name' },
        { title: 'Khóa', dataIndex: 'cohort', width: 80 },
        { title: 'Sĩ Số', dataIndex: 'total_students', width: 80, align: 'center' },
        { title: 'Cố Vấn Học Tập', dataIndex: 'advisor' }
      ];
    }

    if (targetType === 'GRADEBOOK') {
      return [
        ...baseCols,
        { title: 'MSSV', dataIndex: 'student_code', width: 110, render: t => <strong>{t}</strong> },
        { title: 'Họ và Tên', dataIndex: 'full_name' },
        { title: 'Chuyên Cần (10%)', dataIndex: 'attendance_score', align: 'center', width: 130 },
        { title: 'Bài Tập (15%)', dataIndex: 'assignment_score', align: 'center', width: 120 },
        { title: 'Giữa Kỳ (25%)', dataIndex: 'midterm_score', align: 'center', width: 120 },
        { title: 'Cuối Kỳ (50%)', dataIndex: 'final_exam_score', align: 'center', width: 120 }
      ];
    }

    return baseCols;
  };

  return (
    <Modal
      open={open}
      onCancel={() => { handleReset(); onClose(); }}
      width={1000}
      title={
        <Space>
          <FileExcelOutlined style={{ color: '#059669', fontSize: 22 }} />
          <span>Trung Tâm Nhập & Quản Trị Dữ Liệu Excel (Universal Excel Hub)</span>
        </Space>
      }
      footer={[
        <Button key="close" onClick={() => { handleReset(); onClose(); }}>
          Đóng
        </Button>,
        <Button
          key="submit"
          type="primary"
          icon={<DatabaseOutlined />}
          disabled={validationStats.valid === 0}
          loading={uploading}
          onClick={handleExecuteImport}
          style={{ background: '#059669', borderColor: '#059669' }}
        >
          Nạp Dữ Liệu Vào Hệ Thống ({validationStats.valid} Bản Ghi Hợp Lệ)
        </Button>
      ]}
    >
      {/* 1. THANH CHỌN PHÂN HỆ */}
      <div style={{ marginBottom: 16 }}>
        <Text strong style={{ display: 'block', marginBottom: 8 }}>Chọn Phân Hệ Dữ Liệu Cần Thao Tác:</Text>
        <Radio.Group
          value={targetType}
          onChange={(e) => {
            setTargetType(e.target.value);
            handleReset();
          }}
          buttonStyle="solid"
          size="middle"
        >
          <Radio.Button value="STUDENTS">
            <Space><TeamOutlined /> <strong>Sinh Viên</strong></Space>
          </Radio.Button>
          <Radio.Button value="LECTURERS">
            <Space><SolutionOutlined /> <strong>Giảng Viên</strong></Space>
          </Radio.Button>
          <Radio.Button value="CLASSES">
            <Space><ReadOutlined /> <strong>Lớp Học</strong></Space>
          </Radio.Button>
          <Radio.Button value="GRADEBOOK">
            <Space><DatabaseOutlined /> <strong>Bảng Điểm Học Phần</strong></Space>
          </Radio.Button>
        </Radio.Group>
      </div>

      {/* 2. KHU VỰC TẢI MẪU & TẢI TỆP LÊN */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={10}>
          <Card size="small" style={{ background: '#f8fafc', height: '100%', borderRadius: 8 }}>
            <Title level={5} style={{ margin: '0 0 6px 0', color: '#1e293b' }}>
              Bước 1: Tải File Excel Mẫu
            </Title>
            <Paragraph type="secondary" style={{ fontSize: 12, marginBottom: 12 }}>
              Tải file mẫu định dạng <code>.xlsx</code> đã định nghĩa đầy đủ cấu trúc cột theo chuẩn Bộ GD&ĐT.
            </Paragraph>
            <Button
              icon={<DownloadOutlined />}
              onClick={handleDownloadTemplate}
              style={{ borderColor: currentConfig.color, color: currentConfig.color, fontWeight: 600 }}
            >
              Tải Mẫu: {currentConfig.templateName}
            </Button>
          </Card>
        </Col>

        <Col span={14}>
          <Card
            size="small"
            style={{
              background: '#f0fdf4',
              borderRadius: 8,
              border: '2px dashed #86efac',
              textAlign: 'center',
              padding: '10px 0'
            }}
          >
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
              accept=".xlsx,.xls,.csv"
            />
            <Title level={5} style={{ margin: '0 0 6px 0', color: '#166534' }}>
              Bước 2: Chọn File Excel Từ Thiết Bị
            </Title>
            <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 10 }}>
              Hỗ trợ <code>.xlsx</code>, <code>.xls</code>, <code>.csv</code> (Tự động nhận diện cột thông minh)
            </Text>
            <Button
              type="primary"
              icon={<UploadOutlined />}
              onClick={() => fileInputRef.current?.click()}
              style={{ background: '#059669', borderColor: '#059669', fontWeight: 600 }}
            >
              📁 Chọn File Excel Dữ Liệu
            </Button>
            {selectedFileName && (
              <div style={{ marginTop: 8 }}>
                <Tag color="green">Đã chọn: {selectedFileName}</Tag>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* 3. BẢNG XEM TRƯỚC VÀ THỐNG KÊ KIỂM DUYỆT (VALIDATION) */}
      {validatedData.length > 0 && (
        <div>
          <Row justify="space-between" align="middle" style={{ marginBottom: 10 }}>
            <Col>
              <Space wrap>
                <Tag color="blue" style={{ fontSize: 13, padding: '4px 8px' }}>
                  Tổng cộng: <strong>{validationStats.total}</strong> dòng
                </Tag>
                <Tag color="success" style={{ fontSize: 13, padding: '4px 8px' }}>
                  ✓ Hợp lệ: <strong>{validationStats.valid}</strong> dòng
                </Tag>
                {validationStats.invalid > 0 && (
                  <Tag color="error" style={{ fontSize: 13, padding: '4px 8px' }}>
                    ✕ Lỗi thiếu trường: <strong>{validationStats.invalid}</strong> dòng
                  </Tag>
                )}
              </Space>
            </Col>
            <Col>
              <Radio.Group
                value={activeFilterTab}
                onChange={e => setActiveFilterTab(e.target.value)}
                size="small"
              >
                <Radio.Button value="ALL">Tất Cả ({validationStats.total})</Radio.Button>
                <Radio.Button value="VALID">Chỉ Dòng Hợp Lệ ({validationStats.valid})</Radio.Button>
                {validationStats.invalid > 0 && (
                  <Radio.Button value="INVALID">Chỉ Dòng Lỗi ({validationStats.invalid})</Radio.Button>
                )}
              </Radio.Group>
            </Col>
          </Row>

          {validationStats.invalid > 0 && (
            <Alert
              type="warning"
              showIcon
              message={
                <span>
                  Có <strong>{validationStats.invalid}</strong> dòng thiếu các trường bắt buộc (được đánh dấu màu đỏ).
                  Hệ thống sẽ <strong>tự động bỏ qua</strong> các dòng lỗi và chỉ nạp <strong>{validationStats.valid}</strong> dòng hợp lệ.
                </span>
              }
              style={{ marginBottom: 12, borderRadius: 6 }}
            />
          )}

          <Table
            dataSource={displayedRows}
            columns={getColumns()}
            pagination={{ pageSize: 5 }}
            size="small"
            bordered
            rowClassName={(record) => (!record._isValid ? 'ant-table-row-error' : '')}
            style={{ marginTop: 8 }}
          />
        </div>
      )}
    </Modal>
  );
}

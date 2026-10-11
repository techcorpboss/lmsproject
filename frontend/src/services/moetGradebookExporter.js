// frontend/src/services/moetGradebookExporter.js
// 📊 Bộ Xuất Bảng Điểm Học Phần Chuẩn Bộ Giáo Dục & Đào Tạo (TT 08/2021/TT-BGDĐT)
import * as XLSX from 'xlsx';

/**
 * Tách họ tên Việt Nam thành: Họ đệm & Tên
 */
function splitVietnameseName(fullName) {
  if (!fullName) return { hoDem: '', ten: '' };
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return { hoDem: '', ten: parts[0] };
  const ten = parts.pop();
  const hoDem = parts.join(' ');
  return { hoDem, ten };
}

/**
 * Xuất file Excel Bảng Điểm Tổng Hợp Học Phần chuẩn Bộ GD&ĐT
 */
export function exportMoetGradebookExcel({
  courseCode = 'IT101',
  courseName = 'Nhập môn Lập trình C/C++',
  credits = 4,
  className = '66.CNTT-1',
  lecturerName = 'TS. Hoàng Đức Em',
  semester = 'Học kỳ 1',
  academicYear = '2026-2027',
  facultyName = 'Khoa Công Nghệ Thông Tin',
  grades = []
}) {
  // Dòng tiêu đề hành chính chuẩn Bộ GD&ĐT
  const sheetData = [
    ['BỘ GIÁO DỤC VÀ ĐÀO TẠO', '', '', '', 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM'],
    ['TRƯỜNG ĐẠI HỌC CÔNG NGHỆ TECHCORP', '', '', '', 'Độc lập - Tự do - Hạnh phúc'],
    ['', '', '', '', '----------------o0o----------------'],
    [''],
    ['BẢNG ĐIỂM ĐÁNH GIÁ KẾT THÚC HỌC PHẦN (THEO HỆ TÍN CHỈ)'],
    [`Quy chế Đào tạo Trình độ Đại học theo Thông tư 08/2021/TT-BGDĐT`],
    [''],
    [`Tên Học Phần: ${courseName}`, '', `Mã Học Phần: ${courseCode}`, '', `Số Tín Chỉ: ${credits}`],
    [`Khoa Quản Lý: ${facultyName}`, '', `Lớp Sinh Hoạt: ${className}`, '', `Năm Học: ${academicYear} (${semester})`],
    [`Giảng Viên Giảng Dạy: ${lecturerName}`, '', `Hình Thức Đào Tạo: Đại học Chính quy`, '', `Ngày Xuất: ${new Date().toLocaleDateString('vi-VN')}`],
    [''],
    // Hàng tiêu đề các cột
    [
      'STT',
      'Mã Sinh Viên',
      'Họ và Tên Đệm',
      'Tên',
      'Điểm Chuyên Cần (10%)',
      'Điểm Bài Tập Lớn (20%)',
      'Điểm Giữa Kỳ (20%)',
      'Điểm Cuối Kỳ (50%)',
      'Điểm Học Phần (Hệ 10)',
      'Điểm Chữ',
      'Điểm Hệ 4',
      'Xếp Loại Học Lực',
      'Kết Quả',
      'Ghi Chú'
    ]
  ];

  // Thống kê phân loại
  let countA = 0, countBplus = 0, countB = 0, countCplus = 0, countC = 0, countDplus = 0, countD = 0, countF = 0;
  let countPass = 0, countFail = 0;

  // Điền danh sách sinh viên
  grades.forEach((g, idx) => {
    const { hoDem, ten } = splitVietnameseName(g.full_name || g.student_name);
    const score10 = parseFloat(g.course_score_10 || g.final_score || 0);
    const letter = g.course_score_letter || 'B';
    const scale4 = parseFloat(g.course_score_4 || 3.0);
    const result = (score10 >= 4.0 && letter !== 'F') ? 'ĐẠT (PASS)' : 'KHÔNG ĐẠT (FAIL)';

    if (result.includes('ĐẠT')) countPass++;
    else countFail++;

    if (letter === 'A') countA++;
    else if (letter === 'B+') countBplus++;
    else if (letter === 'B') countB++;
    else if (letter === 'C+') countCplus++;
    else if (letter === 'C') countC++;
    else if (letter === 'D+') countDplus++;
    else if (letter === 'D') countD++;
    else if (letter === 'F') countF++;

    sheetData.push([
      idx + 1,
      g.student_code || `261IT00${idx + 1}`,
      hoDem,
      ten,
      parseFloat(g.attendance_score || 10.0),
      parseFloat(g.assignment_score || 8.5),
      parseFloat(g.midterm_score || 8.0),
      parseFloat(g.final_exam_score || 8.5),
      score10,
      letter,
      scale4,
      g.academic_rank || 'GIỎI',
      result,
      g.notes || ''
    ]);
  });

  // Khối thống kê kết quả học tập
  const total = grades.length || 1;
  sheetData.push(['']);
  sheetData.push(['THỐNG KÊ PHỔ ĐIỂM & ĐÁNH GIÁ CHUẨN ĐẦU RA HỌC PHẦN (CLO):']);
  sheetData.push([`Tổng số sinh viên: ${grades.length} SV`, `Tỷ lệ Đạt (Pass): ${countPass} (${((countPass / total) * 100).toFixed(1)}%)`, `Tỷ lệ Không Đạt (Fail): ${countFail} (${((countFail / total) * 100).toFixed(1)}%)`]);
  sheetData.push([`Xuất sắc (A): ${countA} SV`, `Giỏi (B+): ${countBplus} SV`, `Khá (B): ${countB} SV`, `TB Khá (C+): ${countCplus} SV`, `Trung bình (C): ${countC} SV`, `Yếu (D/D+): ${countD + countDplus} SV`, `Kém (F): ${countF} SV`]);
  
  // Khối 4 Chữ ký phê duyệt hành chính
  sheetData.push(['']);
  sheetData.push(['', '', 'Hà Nội, ngày ..... tháng ..... năm 2026']);
  sheetData.push([
    'GIẢNG VIÊN GIẢNG DẠY',
    '',
    'CÁN BỘ CHẤM THI 2',
    '',
    'TRƯỞNG BỘ MÔN',
    '',
    'TRƯỞNG KHOA / PHÒNG ĐÀO TẠO'
  ]);
  sheetData.push([
    '(Ký và ghi rõ họ tên)',
    '',
    '(Ký và ghi rõ họ tên)',
    '',
    '(Ký và ghi rõ họ tên)',
    '',
    '(Ký và đóng dấu)'
  ]);
  sheetData.push(['']);
  sheetData.push(['']);
  sheetData.push([
    lecturerName,
    '',
    'ThS. Nguyễn Văn Quản',
    '',
    'TS. Vũ Nam',
    '',
    'PGS.TS. Trần Đình Quân'
  ]);

  // Tạo Worksheet và Workbook
  const ws = XLSX.utils.aoa_to_sheet(sheetData);

  // Thiết lập độ rộng cột (Column Widths)
  ws['!cols'] = [
    { wch: 6 },  // STT
    { wch: 14 }, // MSSV
    { wch: 22 }, // Họ đệm
    { wch: 12 }, // Tên
    { wch: 14 }, // CC
    { wch: 14 }, // BTL
    { wch: 14 }, // GK
    { wch: 14 }, // CK
    { wch: 14 }, // Tổng 10
    { wch: 10 }, // Chữ
    { wch: 10 }, // Hệ 4
    { wch: 16 }, // Xếp loại
    { wch: 18 }, // Kết quả
    { wch: 20 }  // Ghi chú
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Bang_Diem_MOET');

  const fileName = `Bang_Diem_Hoc_Phan_${courseCode}_Lop_${className}.xlsx`;
  XLSX.writeFile(wb, fileName);
  return fileName;
}

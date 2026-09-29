// frontend/src/services/exportImportService.js
// Tiện ích xuất/nhập tệp tin đa định dạng tiêu chuẩn (Excel .xlsx với SheetJS, Word .doc chuẩn NĐ 30/2020/NĐ-CP, PDF & In ấn chuẩn Bộ GD&ĐT)
import * as XLSX from 'xlsx';

/**
 * 1. XUẤT FILE MICROSOFT EXCEL (.XLSX) CHUẨN ĐỊNH DẠNG & ĐẦY ĐỦ SHEET
 * Hỗ trợ tạo file .xlsx thực thụ với tiêu đề lớn, metadata hành chính, tiêu đề in đậm và tự động co giãn độ rộng cột
 */
export function exportToExcel(filename, headers, dataRows, title = '', metaInfo = {}) {
  try {
    const wb = XLSX.utils.book_new();
    const sheetData = [];

    // 1. Dòng Tiêu đề chính của biểu mẫu (In hoa, chiếm dòng đầu)
    if (title) {
      sheetData.push([title.toUpperCase()]);
      sheetData.push([]); // Dòng trống
    }

    // 2. Thông tin Metadata hành chính (Trường, Khoa, Lớp, Học phần, Học kỳ...)
    if (metaInfo && Object.keys(metaInfo).length > 0) {
      for (const [key, val] of Object.entries(metaInfo)) {
        sheetData.push([`${key}:`, String(val)]);
      }
      sheetData.push([]); // Dòng trống ngăn cách
    }

    // Ghi nhận vị trí dòng tiêu đề cột
    const headerRowIndex = sheetData.length;
    sheetData.push(headers);

    // 3. Dữ liệu các dòng
    for (const row of dataRows) {
      const sanitizedRow = row.map(cell => (cell === null || cell === undefined ? '' : cell));
      sheetData.push(sanitizedRow);
    }

    // Chuyển mảng thành Worksheet
    const ws = XLSX.utils.aoa_to_sheet(sheetData);

    // 4. Định dạng merge cell cho tiêu đề chính
    if (title && headers.length > 1) {
      if (!ws['!merges']) ws['!merges'] = [];
      ws['!merges'].push({ s: { r: 0, c: 0 }, e: { r: 0, c: Math.max(headers.length - 1, 1) } });
    }

    // 5. Tự động tính toán độ rộng tối ưu cho từng cột (Auto column widths)
    const colWidths = headers.map((header, colIdx) => {
      let maxLen = String(header).length;
      for (const row of dataRows) {
        const cellValue = row[colIdx];
        if (cellValue !== undefined && cellValue !== null) {
          const len = String(cellValue).length;
          if (len > maxLen) maxLen = len;
        }
      }
      return { wch: Math.min(Math.max(maxLen + 4, 10), 45) };
    });
    ws['!cols'] = colWidths;

    // Thêm sheet vào workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Du_Lieu');

    // Tạo file buffer và kích hoạt tải về .xlsx
    const cleanFileName = filename.replace(/\.(xlsx|csv|xls)$/i, '');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${cleanFileName}.xlsx`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  } catch (err) {
    console.warn('[Export Excel .xlsx Warning, fallback to UTF-8 BOM CSV]:', err);
    // Fallback sang CSV UTF-8 BOM nếu môi trường trình duyệt hạn chế
    return exportToCsvFallback(filename, headers, dataRows, title, metaInfo);
  }
}

/**
 * Fallback xuất file CSV Unicode UTF-8 BOM
 */
function exportToCsvFallback(filename, headers, dataRows, title, metaInfo) {
  try {
    let csv = '\uFEFF';
    if (title) csv += `"${title.replace(/"/g, '""')}"\n\n`;
    if (metaInfo && Object.keys(metaInfo).length > 0) {
      for (const [key, val] of Object.entries(metaInfo)) {
        csv += `"${key}: ${String(val).replace(/"/g, '""')}"\n`;
      }
      csv += '\n';
    }
    csv += headers.map(h => `"${String(h).replace(/"/g, '""')}"`).join(',') + '\n';
    for (const row of dataRows) {
      csv += row.map(c => `"${String(c ?? '').replace(/"/g, '""')}"`).join(',') + '\n';
    }
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${filename.replace(/\.csv$/i, '')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  } catch (e) {
    console.error('[Fallback CSV Export Error]:', e);
    return false;
  }
}

/**
 * 2. XUẤT FILE MICROSOFT WORD (.DOC) CHUẨN VĂN THƯ NGHỊ ĐỊNH 30/2020/NĐ-CP
 * Định dạng HTML/XML với namespace Microsoft Word: Giữ nguyên bảng biểu, phông chữ Times New Roman và căn lề A4
 */
export function exportToWord(filename, { title, subtitle, organization = 'BỘ GIÁO DỤC VÀ ĐÀO TẠO\nTRƯỜNG ĐẠI HỌC CÔNG NGHỆ TECHCORP', htmlContent, orientation = 'portrait' }) {
  try {
    const isLandscape = orientation === 'landscape';
    const pageWidth = isLandscape ? '297mm' : '210mm';
    const pageHeight = isLandscape ? '210mm' : '297mm';

    const wordDocContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office"
            xmlns:w="urn:schemas-microsoft-com:office:word"
            xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <title>${title || 'Van_Ban'}</title>
        <!--[if gte mso 9]>
        <xml>
          <w:WordDocument>
            <w:View>Print</w:View>
            <w:Zoom>100</w:Zoom>
            <w:DoNotOptimizeForBrowser/>
          </w:WordDocument>
        </xml>
        <![endif]-->
        <style>
          @page {
            size: ${pageWidth} ${pageHeight};
            margin: 20mm 15mm 20mm 30mm; /* Chuẩn Nghị định 30: Trái 30mm, Phải 15mm, Trên/Dưới 20mm */
            mso-page-orientation: ${orientation};
          }
          body {
            font-family: 'Times New Roman', Times, serif;
            font-size: 13pt;
            line-height: 1.35;
            color: #000;
          }
          table {
            border-collapse: collapse;
            width: 100%;
            margin: 14px 0;
            font-size: 12pt;
          }
          th, td {
            border: 1px solid #000;
            padding: 6px 8px;
            text-align: left;
            vertical-align: middle;
          }
          th {
            background-color: #f2f2f2;
            font-weight: bold;
            text-align: center;
          }
          .header-table {
            width: 100%;
            border: none;
            margin-bottom: 20px;
          }
          .header-table td {
            border: none;
            padding: 2px 4px;
            vertical-align: top;
          }
          .text-center { text-align: center; }
          .text-right { text-align: right; }
          .bold { font-weight: bold; }
          .italic { font-style: italic; }
          .uppercase { text-transform: uppercase; }
          .footer-signature {
            margin-top: 30px;
            width: 100%;
            border: none;
          }
          .footer-signature td {
            border: none;
            text-align: center;
            vertical-align: top;
          }
        </style>
      </head>
      <body>
        <!-- TIÊU NGỮ & CƠ QUAN BAN HÀNH CHUẨN NGHỊ ĐỊNH 30/2020/NĐ-CP -->
        <table class="header-table">
          <tr>
            <td style="width: 45%; text-align: center;">
              <div style="font-size: 11pt; text-transform: uppercase;">${organization.replace(/\n/g, '<br/>')}</div>
              <div style="font-weight: bold; font-size: 12pt; margin-top: 3px;">HỘI ĐỒNG KHẢO THÍ & ĐÀO TẠO</div>
              <div style="width: 120px; border-bottom: 1px solid #000; margin: 4px auto;"></div>
            </td>
            <td style="width: 55%; text-align: center;">
              <div class="bold" style="font-size: 12pt; text-transform: uppercase;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
              <div class="bold" style="font-size: 13pt;">Độc lập - Tự do - Hạnh phúc</div>
              <div style="width: 160px; border-bottom: 1px solid #000; margin: 4px auto;"></div>
              <div class="italic" style="font-size: 11pt; margin-top: 5px;">Hà Nội, ngày ${new Date().getDate()} tháng ${new Date().getMonth() + 1} năm ${new Date().getFullYear()}</div>
            </td>
          </tr>
        </table>

        <!-- TIÊU ĐỀ CHÍNH CỦA VĂN BẢN -->
        <div class="text-center" style="margin: 15px 0 25px 0;">
          <h2 class="bold uppercase" style="font-size: 16pt; margin: 0 0 6px 0;">${title}</h2>
          ${subtitle ? `<div class="italic" style="font-size: 12pt;">${subtitle}</div>` : ''}
        </div>

        <!-- NỘI DUNG VĂN BẢN -->
        <div class="doc-body">
          ${htmlContent}
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([wordDocContent], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename.endsWith('.doc') ? filename : `${filename}.doc`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  } catch (err) {
    console.error('[Export Word Error]:', err);
    return false;
  }
}

/**
 * 3. ĐỌC FILE EXCEL (.XLSX, .XLS) HOẶC CSV TẢI LÊN (UNIVERSAL PARSER)
 * Tự động xử lý cả tệp nhị phân Excel .xlsx, .xls và tệp .csv (có hoặc không có UTF-8 BOM)
 */
export function parseExcelFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const buffer = e.target.result;
        // Đọc workbook bằng SheetJS
        const workbook = XLSX.read(buffer, { type: 'array' });
        if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
          return resolve({ headers: [], rows: [] });
        }

        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        // Chuyển sheet thành ma trận mảng
        const rawGrid = XLSX.utils.sheet_to_json(firstSheet, { header: 1, defval: '' });

        if (!rawGrid || rawGrid.length === 0) {
          return resolve({ headers: [], rows: [] });
        }

        // Tìm dòng tiêu đề (Header row): là dòng đầu tiên có ít nhất 2 cột có chữ
        let headerRowIndex = 0;
        for (let i = 0; i < Math.min(rawGrid.length, 10); i++) {
          const row = rawGrid[i];
          if (Array.isArray(row)) {
            const textCols = row.filter(cell => cell !== '' && cell !== null && cell !== undefined);
            const hasCommonKeywords = row.some(cell => /mssv|mã|tên|họ|stt|student|điểm/i.test(String(cell)));
            if (hasCommonKeywords || textCols.length >= 2) {
              headerRowIndex = i;
              break;
            }
          }
        }

        const headers = (rawGrid[headerRowIndex] || []).map(h => String(h || '').trim());
        const rows = [];

        for (let i = headerRowIndex + 1; i < rawGrid.length; i++) {
          const row = rawGrid[i];
          if (Array.isArray(row) && row.some(cell => cell !== '' && cell !== null && cell !== undefined)) {
            // Định dạng lại các cell thành string/number sạch
            const cleanRow = headers.map((_, colIdx) => {
              const val = row[colIdx];
              return val !== undefined && val !== null ? String(val).trim() : '';
            });
            rows.push(cleanRow);
          }
        }

        resolve({ headers, rows });
      } catch (err) {
        console.error('[Parse Excel Error]:', err);
        // Fallback đọc văn bản nếu SheetJS gặp sự cố định dạng
        parseCsvTextFallback(file).then(resolve).catch(reject);
      }
    };

    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
}

// Giữ lại alias parseCsvFile để tương thích ngược 100% với các component cũ
export const parseCsvFile = parseExcelFile;

/**
 * Fallback đọc text CSV thuần túy
 */
function parseCsvTextFallback(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        let text = e.target.result;
        if (text.charCodeAt(0) === 0xFEFF) {
          text = text.slice(1);
        }
        const lines = text.split(/\r\n|\n/).filter(l => l.trim().length > 0);
        if (lines.length < 2) return resolve({ headers: [], rows: [] });

        const parseLine = (line) => {
          const result = [];
          let insideQuotes = false;
          let current = '';
          for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"' && (i === 0 || line[i - 1] !== '\\')) {
              insideQuotes = !insideQuotes;
            } else if (char === ',' && !insideQuotes) {
              result.push(current.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
              current = '';
            } else {
              current += char;
            }
          }
          result.push(current.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
          return result;
        };

        const headers = parseLine(lines[0]);
        const rows = lines.slice(1).map(l => parseLine(l)).filter(r => r.some(c => c.length > 0));
        resolve({ headers, rows });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file, 'UTF-8');
  });
}

// frontend/src/services/exportImportService.js
// Tiện ích xuất/nhập tệp tin đa định dạng (Excel UTF-8 BOM, Word chuẩn XML, PDF & In ấn chuẩn Bộ GD&ĐT)

/**
 * 1. XUẤT FILE EXCEL / CSV CHUẨN UNICODE UTF-8 BOM
 * Đảm bảo 100% tiếng Việt hiển thị sắc nét, không bao giờ bị lỗi font trên Microsoft Excel và Google Sheets
 */
export function exportToExcel(filename, headers, dataRows, title = '', metaInfo = {}) {
  try {
    let csv = '\uFEFF'; // Ký tự UTF-8 BOM bắt buộc cho Excel

    // Tiêu đề văn bản hành chính nếu có
    if (title) {
      csv += `"${title.replace(/"/g, '""')}"\n`;
    }

    // Thông tin metadata (Khoa, Lớp, Học kỳ...)
    if (metaInfo && Object.keys(metaInfo).length > 0) {
      for (const [key, val] of Object.entries(metaInfo)) {
        csv += `"${key}: ${String(val).replace(/"/g, '""')}"\n`;
      }
      csv += '\n';
    }

    // Tiêu đề các cột
    const headerLine = headers.map(h => `"${String(h).replace(/"/g, '""')}"`).join(',');
    csv += headerLine + '\n';

    // Dữ liệu từng dòng
    for (const row of dataRows) {
      const line = row.map(cell => {
        if (cell === null || cell === undefined) return '""';
        return `"${String(cell).replace(/"/g, '""')}"`;
      }).join(',');
      csv += line + '\n';
    }

    // Tạo blob và tải về
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  } catch (err) {
    console.error('[Export Excel Error]:', err);
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
 * 3. ĐỌC FILE CSV / EXCEL TẢI LÊN (IMPORT PARSER)
 */
export function parseCsvFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        let text = e.target.result;
        if (text.charCodeAt(0) === 0xFEFF) {
          text = text.slice(1); // Cắt bỏ UTF-8 BOM
        }
        const lines = text.split(/\r\n|\n/).filter(l => l.trim().length > 0);
        if (lines.length < 2) {
          return resolve({ headers: [], rows: [] });
        }

        // Tách tiêu đề
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
        const rows = [];
        for (let i = 1; i < lines.length; i++) {
          const cells = parseLine(lines[i]);
          if (cells.some(c => c.length > 0)) {
            rows.push(cells);
          }
        }
        resolve({ headers, rows });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file, 'UTF-8');
  });
}

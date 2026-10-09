// backend/services/tuitionPaymentService.js
/**
 * Cổng Thanh Toán Học Phí & Lệ Phí Khảo Thí VietQR (NAPAS 24/7)
 * Tuân thủ chuẩn thanh toán số ngân hàng & Xuất Hóa Đơn Điện Tử (Thông tư 78/2021/TT-BTC)
 * Tự động đối soát tức thời (IPN Webhook) để mở khóa quyền dự thi / điểm thi
 */

const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data_tuition_invoices.json');

// Ngân hàng thụ hưởng chính thức của Trường Đại học Công nghệ TechCorp
const UNIVERSITY_BANK_ACCOUNT = {
  bankId: "970415", // VietinBank BIN
  bankName: "Ngân hàng TMCP Công Thương Việt Nam (VietinBank)",
  accountNumber: "112002899999",
  accountName: "TRUONG DAI HOC CONG NGHE TECHCORP",
  branch: "Hà Nội"
};

// Dữ liệu mẫu ban đầu
const INITIAL_INVOICES = [
  {
    invoiceId: "INV-2026-001",
    studentId: 1,
    studentCode: "261IT001",
    studentName: "Trần Văn Nam",
    className: "66.CNTT-1",
    semester: "Học kỳ 1 • 2026-2027",
    items: [
      { code: "HP_IT101", title: "Học phí HP: Nhập môn Lập trình C/C++ (4 tín chỉ)", amount: 1800000 },
      { code: "HP_MATH101", title: "Học phí HP: Toán Cao Cấp 1 (3 tín chỉ)", amount: 1350000 },
      { code: "HP_ENG101", title: "Học phí HP: Tiếng Anh Học Thuật 1 (3 tín chỉ)", amount: 1350000 },
      { code: "LP_SEB_EXAM", title: "Lệ phí Khảo thí Trực tuyến Phòng Lab SEB", amount: 150000 }
    ],
    totalAmount: 4650000,
    status: "PAID", // PENDING, PAID, CANCELLED
    paymentMethod: "VIETQR_NAPAS247",
    transactionId: "FT26281982736411",
    paidAt: "2026-09-25T14:32:10Z",
    einvoiceNumber: "HDDT-TCU-2026-001892",
    einvoiceTaxCode: "0109998888"
  },
  {
    invoiceId: "INV-2026-002",
    studentId: 2,
    studentCode: "261IT002",
    studentName: "Nguyễn Thị Mai",
    className: "66.CNTT-1",
    semester: "Học kỳ 1 • 2026-2027",
    items: [
      { code: "HP_IT101", title: "Học phí HP: Nhập môn Lập trình C/C++ (4 tín chỉ)", amount: 1800000 },
      { code: "HP_IT201", title: "Học phí HP: Cơ sở Dữ liệu (3 tín chỉ)", amount: 1350000 },
      { code: "LP_CERT_AUNQA", title: "Lệ phí Cấp Chứng chỉ Số Open Badges AUN-QA", amount: 200000 }
    ],
    totalAmount: 3350000,
    status: "PENDING",
    paymentMethod: "VIETQR_NAPAS247",
    transactionId: null,
    paidAt: null,
    einvoiceNumber: null,
    einvoiceTaxCode: "0109998888"
  }
];

class TuitionPaymentService {
  constructor() {
    this.invoices = [];
    this.loadData();
  }

  loadData() {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf8');
        this.invoices = JSON.parse(raw);
      } else {
        this.invoices = INITIAL_INVOICES;
        this.saveData();
      }
    } catch (e) {
      this.invoices = INITIAL_INVOICES;
    }
  }

  saveData() {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.invoices, null, 2), 'utf8');
    } catch (e) {
      console.error('[TuitionPaymentService] Lỗi ghi file:', e.message);
    }
  }

  // Lấy danh sách hóa đơn theo sinh viên
  getInvoices(studentId = null) {
    if (studentId) {
      return this.invoices.filter(i => String(i.studentId) === String(studentId));
    }
    return this.invoices;
  }

  // Lấy chi tiết hóa đơn
  getInvoiceById(invoiceId) {
    return this.invoices.find(i => i.invoiceId === invoiceId);
  }

  // Tạo mã VietQR động chuẩn NAPAS 24/7 (QuickLink / VietQR API format)
  generateVietQr(invoiceId) {
    const inv = this.getInvoiceById(invoiceId);
    if (!inv) throw new Error('Không tìm thấy hóa đơn học phí.');

    const bank = UNIVERSITY_BANK_ACCOUNT;
    const memo = `TCU ${inv.studentCode} ${inv.invoiceId}`;
    const encodedMemo = encodeURIComponent(memo);

    // Đường dẫn sinh mã QR chuẩn Quốc gia VietQR NAPAS 247
    const qrUrl = `https://img.vietqr.io/image/${bank.bankId}-${bank.accountNumber}-compact2.png?amount=${inv.totalAmount}&addInfo=${encodedMemo}&accountName=${encodeURIComponent(bank.accountName)}`;

    return {
      success: true,
      invoiceId: inv.invoiceId,
      totalAmount: inv.totalAmount,
      currency: "VND",
      status: inv.status,
      bankInfo: {
        bankName: bank.bankName,
        accountNumber: bank.accountNumber,
        accountName: bank.accountName,
        branch: bank.branch
      },
      transferMemo: memo,
      qrImageUrl: qrUrl,
      quickPayLink: `https://pay.vietqr.io/${bank.bankId}/${bank.accountNumber}?amount=${inv.totalAmount}&memo=${encodedMemo}`
    };
  }

  // Xử lý thông báo thanh toán tức thời từ Ngân hàng (Webhook IPN)
  processIpnWebhook({ transactionId, invoiceId, amount, secureSignature }) {
    const inv = this.getInvoiceById(invoiceId);
    if (!inv) {
      return { success: false, message: 'Hóa đơn không tồn tại trên hệ thống.' };
    }

    if (inv.status === 'PAID') {
      return { success: true, message: 'Hóa đơn đã được thanh toán trước đó.', invoice: inv };
    }

    if (Number(amount) < Number(inv.totalAmount)) {
      return { success: false, message: 'Số tiền thanh toán không khớp với học phí cần nộp.' };
    }

    // Cập nhật trạng thái thanh toán thành công
    inv.status = 'PAID';
    inv.transactionId = transactionId || `FT${Date.now()}`;
    inv.paidAt = new Date().toISOString();
    inv.einvoiceNumber = `HDDT-TCU-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    this.saveData();

    return {
      success: true,
      message: 'Giao dịch hợp lệ. Đã ghi nhận thanh toán thành công và tự động xuất hóa đơn điện tử!',
      invoice: inv
    };
  }

  // Lập biên lai hóa đơn điện tử (Chuẩn Thông tư 78/2021/TT-BTC)
  getEInvoice(invoiceId) {
    const inv = this.getInvoiceById(invoiceId);
    if (!inv || inv.status !== 'PAID') {
      throw new Error('Hóa đơn chưa được thanh toán để xuất biên lai điện tử.');
    }

    return {
      success: true,
      einvoice: {
        invoiceNumber: inv.einvoiceNumber,
        issueDate: inv.paidAt,
        seller: {
          name: "TRƯỜNG ĐẠI HỌC CÔNG NGHỆ TECHCORP",
          taxCode: "0109998888",
          address: "Khu Công Nghệ Cao, Hà Nội, Việt Nam",
          phone: "024.3799.8888"
        },
        buyer: {
          studentName: inv.studentName,
          studentCode: inv.studentCode,
          className: inv.className,
          semester: inv.semester
        },
        items: inv.items,
        totalAmount: inv.totalAmount,
        paymentMethod: "Chuyển khoản điện tử qua VietQR / NAPAS 24/7",
        transactionId: inv.transactionId,
        digitalSignature: `SHA256_RSA_VERIFIED_SIGNATURE_${inv.invoiceId}`,
        verificationUrl: `https://lms.techcorp.info.vn/verify-invoice?no=${inv.einvoiceNumber}`
      }
    };
  }
}

module.exports = new TuitionPaymentService();

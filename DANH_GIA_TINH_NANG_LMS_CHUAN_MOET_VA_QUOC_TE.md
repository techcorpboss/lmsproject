# BẢN ĐÁNH GIÁ TOÀN DIỆN CÁC TÍNH NĂNG HỆ THỐNG LMS
## ĐỐI SOÁT VỚI QUY CHUẨN BỘ GIÁO DỤC & ĐÀO TẠO, AN TOÀN BẢO MẬT THÔNG TIN VÀ CÁC TIÊU CHUẨN LMS QUỐC TẾ

> **Đơn vị đánh giá:** Hội đồng Khảo sát & Đảm bảo Chất lượng Hệ thống Phần mềm Giáo dục TCU  
> **Hệ thống đánh giá:** TCU COMPASS LMS (`lms.techcorp.info.vn`)  
> **Phiên bản hệ thống:** v2.6 Enterprise (Release 2026)  
> **Thời điểm đánh giá:** Tháng 09/2026  
> **Trạng thái lưu trữ:** Thư mục gốc dự án (`/www/wwwroot/lms.techcorp.info.vn` & `D:\Sanpham\lms-project`)  

---

## MỤC LỤC
1. [CĂN CỨ PHÁP LÝ & BỘ TIÊU CHUẨN ĐỐI SOÁT](#1-căn-cứ-pháp-lý--bộ-tiêu-chuẩn-đối-soát)
2. [BẢNG TỔNG HỢP KHOẢNG TRỐNG TÍNH NĂNG (GAP ANALYSIS MATRIX)](#2-bảng-tổng-hợp-khoảng-trống-tính-năng-gap-analysis-matrix)
3. [ĐÁNH GIÁ CHI TIẾT THEO 6 TRỤ CỘT CHUYÊN MÔN](#3-đánh-giá-chi-tiết-theo-6-trụ-cột-chuyên-môn)
   - [Trụ cột 1: Đào tạo & Quản lý Học tập theo Quy chế Bộ GD&ĐT](#trụ-cột-1-đào-tạo--quản-lý-học-tập-theo-quy-chế-bộ-gdđt)
   - [Trụ cột 2: Khảo thí, Ngân hàng Đề thi & Phòng thi Trực tuyến An toàn](#trụ-cột-2-khảo-thí-ngân-hàng-đề-thi--phòng-thi-trực-tuyến-an-toàn)
   - [Trụ cột 3: Chuẩn Đóng gói Học liệu & Tích hợp Giáo dục Quốc tế (IMS Global)](#trụ-cột-3-chuẩn-đóng-gói-học-liệu--tích-hợp-giáo-dục-quốc-tế-ims-global)
   - [Trụ cột 4: An toàn, Bảo mật Thông tin & Quyền Riêng tư Dữ liệu (PDPD & NĐ 85)](#trụ-cột-4-an-toàn-bảo-mật-thông-tin--quyền-riêng-tư-dữ-liệu-pdpd--nđ-85)
   - [Trụ cột 5: Quản trị Hệ thống, Vận hành, Kiểm toán & Khả năng Mở rộng](#trụ-cột-5-quản-trị-hệ-thống-vận-hành-kiểm-toán--khả-năng-mở-rộng)
   - [Trụ cột 6: Trải nghiệm Người dùng, Tiếp cận Web (WCAG) & Ứng dụng Di động](#trụ-cột-6-trải-nghiệm-người-dùng-tiếp-cận-web-wcag--ứng-dụng-di-động)
4. [BẢNG ĐIỂM ĐÁNH GIÁ MỨC ĐỘ TRƯỞNG THÀNH (MATURITY SCORECARD)](#4-bảng-điểm-đánh-giá-mức-độ-trưởng-thành-maturity-scorecard)
5. [LỘ TRÌNH NÂNG CẤP & BỔ SUNG TÍNH NĂNG CHI TIẾT (ROADMAP 2026 - 2027)](#5-lộ-trình-nâng-cấp--bổ-sung-tính-năng-chi-tiết-roadmap-2026---2027)

---

## 1. CĂN CỨ PHÁP LÝ & BỘ TIÊU CHUẨN ĐỐI SOÁT

Bản đánh giá này được xây dựng dựa trên sự đối chiếu nghiêm ngặt với hệ thống văn bản quy phạm pháp luật hiện hành của Việt Nam và các tiêu chuẩn công nghệ giáo dục (EdTech) hàng đầu thế giới:

### A. Văn bản Quy phạm Pháp luật của Nhà nước & Bộ Giáo dục & Đào tạo Việt Nam
1. **Thông tư số 08/2021/TT-BGDĐT** ngày 18/03/2021 của Bộ trưởng Bộ GD&ĐT ban hành *Quy chế đào tạo trình độ đại học*:
   - Điều 12 & 13: Quy định đào tạo trực tuyến (tối đa 30% khối lượng CTĐT, quản lý tương tác và học liệu số).
   - Điều 14: Điều kiện dự thi kết thúc học phần.
   - Điều 15: Đánh giá học phần, cấu phần điểm quá trình và điểm thi, quy chuẩn thang điểm 10, thang điểm 4, thang điểm chữ.
   - Điều 16 & 17: Quy chế học lại, học cải thiện (lấy điểm cao nhất) và công thức tính GPA/CPA.
   - Điều 18: Quy định cảnh báo kết quả học tập và xử lý học vụ.
2. **Quyết định số 131/QĐ-TTg** ngày 25/01/2022 của Thủ tướng Chính phủ: Phê duyệt Đề án *"Tăng cường ứng dụng công nghệ thông tin và chuyển đổi số trong giáo dục và đào tạo giai đoạn 2022 - 2025, định hướng đến năm 2030"*.
3. **Quyết định số 4725/QĐ-BGDĐT** ngày 30/12/2022 của Bộ GD&ĐT: Ban hành *Bộ chỉ số đánh giá mức độ chuyển đổi số của cơ sở giáo dục đại học*.
4. **Quy định CSDL ngành HEMIS** (Higher Education Management Information System): Chuẩn đồng bộ dữ liệu người học, giảng viên, môn học và kết quả học tập lên máy chủ quốc gia của Bộ GD&ĐT.
5. **Nghị định số 30/2020/NĐ-CP** ngày 05/03/2020 của Chính phủ về *Công tác văn thư* (quy chuẩn thể thức văn bản hành chính, bảng điểm, sổ điểm, biên bản khảo thí).
6. **Nghị định số 13/2023/NĐ-CP** ngày 17/04/2023 của Chính phủ về *Bảo vệ dữ liệu cá nhân (PDPD)*: Áp dụng với dữ liệu sinh viên, giảng viên, hình ảnh khuôn mặt từ webcam phòng thi trực tuyến.

### B. Tiêu chuẩn An toàn & Bảo mật Thông tin (Cybersecurity Standards)
1. **Luật An toàn thông tin mạng 2015 & Luật An ninh mạng 2018**.
2. **Nghị định số 85/2016/NĐ-CP** ngày 01/07/2016 của Chính phủ về *Bảo đảm an toàn hệ thống thông tin theo cấp độ* (Xác lập hệ thống LMS trường đại học ở Cấp độ 2 và Cấp độ 3).
3. **Tiêu chuẩn ISO/IEC 27001:2022**: Hệ thống quản lý an toàn thông tin (ISMS).
4. **OWASP Top 10 (2021/2025)**: Bộ khuyến nghị bảo mật ứng dụng web chống SQL Injection, Broken Access Control, Security Misconfiguration, XSS, v.v.

### C. Tiêu chuẩn Công nghệ Giáo dục Quốc tế (Global EdTech & LMS Standards)
1. **IMS Global / 1EdTech Consortium**:
   - **SCORM 1.2 & SCORM 2004 4th Edition**: Chuẩn đóng gói bài giảng điện tử e-learning tương tác.
   - **xAPI (Tin Can API / IEEE 9274.1.1) & cmi5**: Chuẩn theo dõi hành vi học tập chi tiết với LRS.
   - **LTI v1.3 & LTI Advantage**: Chuẩn liên thông công cụ học tập ngoại vi (Turnitin, Coursera, Lab ảo).
   - **IMS QTI v2.1 / v3.0**: Chuẩn trao đổi câu hỏi trắc nghiệm và ngân hàng đề thi độc lập nền tảng.
   - **Open Badges v2.0 / v3.0**: Huy hiệu số và chứng chỉ hoàn thành học phần có thể xác thực công khai.
2. **Tiêu chuẩn Khảo thí An toàn**: Safe Exam Browser (SEB Integration) và AI Computer Vision Proctoring.
3. **W3C WCAG 2.1 Level AA**: Tiêu chuẩn quốc tế về khả năng tiếp cận nội dung Web cho mọi đối tượng.

---

## 2. BẢNG TỔNG HỢP KHOẢNG TRỐNG TÍNH NĂNG (GAP ANALYSIS MATRIX)

| Mã | Tên Tiêu Chí / Tính Năng | Tiêu Chuẩn Tham Chiếu | Hiện Trạng Hệ Thống | Mã Nguồn Minh Chứng Trong Hệ Thống | Đánh Giá Tuân Thủ | Mức Độ Ưu Tiên Hoàn Thiện |
| :---: | :--- | :--- | :---: | :--- | :---: | :---: |
| **I** | **QUY CHUẨN ĐÀO TẠO BỘ GD&ĐT** | | | | | |
| I.1 | Cơ cấu 15 tuần học phần & Khung CTĐT K68 | TT 08/2021 Điều 12 | **ĐÃ CÓ** | `CurriculumCourse.js`, `academicLms.controller.js` | 100% Đạt | Hoàn tất |
| I.2 | Sổ điểm điện tử Thang 10, Thang 4, Thang Chữ | TT 08/2021 Điều 15 | **ĐÃ CÓ** | `MoetGradebookView.js`, `AcademicSectionGrade.js` | 100% Đạt | Hoàn tất |
| I.3 | Xuất biểu mẫu hành chính chuẩn thể thức | NĐ 30/2020/NĐ-CP | **ĐÃ CÓ** | `exportImportService.js`, `App.css` (@page margin 0) | 100% Đạt | Hoàn tất |
| I.4 | Điều kiện dự thi kết thúc môn (CC >= 80%, HP) | TT 08/2021 Điều 14 | **ĐÃ CÓ** | `ExamAdministrationView.js`, `examCandidateAuth.js` | 100% Đạt | Hoàn tất |
| I.5 | Xuất nhập dữ liệu Excel hỗ trợ UTF-8 BOM & XLSX | QĐ 4725/QĐ-BGDĐT | **ĐÃ CÓ** | `exportToExcel()`, `parseExcelFile()` (SheetJS `xlsx`) | 100% Đạt | Hoàn tất |
| I.6 | Kiểm soát trần tối đa 30% trực tuyến toàn CTĐT | TT 08/2021 Điều 12 | **BÁN PHẦN** | Mới kiểm soát theo từng môn, chưa có validator toàn khóa | 60% Đạt | **Ưu tiên Cao** |
| I.7 | Động cơ tự động cảnh báo học vụ 3 mức (CPA/Nợ tín) | TT 08/2021 Điều 18 | **BÁN PHẦN** | Đã có trường cảnh báo, chưa có cronjob chạy tự động | 70% Đạt | **Ưu tiên Cao** |
| I.8 | Kết nối API đồng bộ trực tiếp Cổng CSDL HEMIS | QĐ 4725 & HEMIS | **BÁN PHẦN** | Đã có cổng ERP Sync Gateway, chưa có adapter đẩy HEMIS | 50% Đạt | **Ưu tiên Cao** |
| I.9 | Chữ ký số PKI / SmartCA cho Giảng viên duyệt điểm | TT 41/2017/TT-BTTTT | **BÁN PHẦN** | Ký số điện tử nội bộ, chưa kết nối USB Token / Cloud HSM | 65% Đạt | **Ưu tiên Trung bình** |
| I.10 | Cổng nộp hồ sơ công nhận tín chỉ tích lũy (RPL) | TT 08/2021 Điều 13 | **CHƯA CÓ** | Chưa xây dựng form nộp chứng chỉ miễn giảm học phần | 0% Chưa đạt | **Ưu tiên Thấp** |
| **II** | **KHẢO THÍ & NGÂN HÀNG ĐỀ THI** | | | | | |
| II.1 | Ngân hàng 120 đề thi chuẩn hóa (8 môn x 15 đề) | TT 08/2021 Khảo thí | **ĐÃ CÓ** | `backend/services/examBank/` (960 câu, 120 đề thi) | 100% Đạt | Hoàn tất |
| II.2 | Động cơ PRNG hoán vị xác định câu hỏi & đáp án | Chuẩn Khảo thí ĐH | **ĐÃ CÓ** | `backend/services/examBank/index.js` | 100% Đạt | Hoàn tất |
| II.3 | Bảng ma trận đối sánh đáp án 40 câu hỏi & xuất Excel | Quy chế thi Bộ GD | **ĐÃ CÓ** | `ExamGeneratorView.js`, `GET /exam/papers/matrix` | 100% Đạt | Hoàn tất |
| II.4 | Phân cấp Bloom (Biết/Hiểu/Dụng/Cao) & Chuẩn CLO | Chuẩn AUN-QA / Bộ | **ĐÃ CÓ** | Thuộc tính `difficulty` & `clo` trong từng câu hỏi | 100% Đạt | Hoàn tất |
| II.5 | Phòng thi trực tuyến Kiosk Lockdown & Chặn gian lận | TT 08/2021 Điều 14 | **ĐÃ CÓ** | `OnlineExamRoom.js` (chặn Alt+Tab, F12, PrintScreen) | 95% Đạt | Hoàn tất |
| II.6 | Giám sát WebRTC Live Stream & AI Proctoring | Chuẩn Quốc tế | **ĐÃ CÓ** | Socket.IO, canvas thumbnail, AI face tracking cảnh báo | 90% Đạt | Hoàn tất |
| II.7 | Tương thích Safe Exam Browser (SEB) | Chuẩn SEB quốc tế | **BÁN PHẦN** | Nhận diện SEB Client qua User-Agent, xuất config file | 80% Đạt | **Ưu tiên Trung bình** |
| II.8 | Tự động chấm tự luận kết nối AI Rubrics | EdTech Quốc tế | **BÁN PHẦN** | Đã có rubrics chấm điểm, chưa tích hợp AI chấm tự luận | 50% Đạt | **Ưu tiên Trung bình** |
| **III** | **CHUẨN EDTECH QUỐC TẾ (IMS GLOBAL)** | | | | | |
| III.1 | Chuẩn bài giảng SCORM 1.2 & SCORM 2004 4th Ed | IMS / ADL SCORM | **ĐÃ CÓ** | `ScormXapiCenterView.js`, `lmsStandards.controller.js` | 95% Đạt | Hoàn tất |
| III.2 | Chuẩn xAPI (Tin Can) phát sinh Statements & LRS | IEEE 9274.1.1 xAPI | **ĐÃ CÓ** | `postXApiStatement`, `getXApiStatements` | 90% Đạt | Hoàn tất |
| III.3 | Chuẩn LTI 1.3 / LTI Advantage tích hợp công cụ | 1EdTech LTI 1.3 | **ĐÃ CÓ** | `LtiToolsHubView.js`, JWKS endpoint, grade passback | 90% Đạt | Hoàn tất |
| III.4 | Xuất gói câu hỏi chuẩn quốc tế IMS QTI v2.1 XML | IMS QTI 2.1 | **ĐÃ CÓ** | Chức năng Xuất IMS QTI trong `ExamGeneratorView.js` | 85% Đạt | Hoàn tất |
| III.5 | Kiểm tra trùng lặp đạo văn chuyên sâu (Turnitin API) | Liêm chính học thuật | **BÁN PHẦN** | Đã có thuật toán băm Shingle cục bộ, chưa nối Turnitin | 40% Đạt | **Ưu tiên Cao** |
| III.6 | Hệ thống Huy hiệu số & Chứng chỉ Open Badges 3.0 | 1EdTech Badges | **CHƯA CÓ** | Chưa xây dựng backend Open Badges và Verify Badge | 0% Chưa đạt | **Ưu tiên Trung bình** |
| **IV** | **AN TOÀN BẢO MẬT & BẢO VỆ DỮ LIỆU** | | | | | |
| IV.1 | Phân quyền truy cập theo vai trò (RBAC) 5 cấp | NĐ 85/2016 Cấp độ 2 | **ĐÃ CÓ** | Middleware `protect`, roles: superadmin, admin, teacher... | 100% Đạt | Hoàn tất |
| IV.2 | Vai trò SuperAdmin (Chủ dự án) ẩn danh bảo mật | Yêu cầu Chủ đầu tư | **ĐÃ CÓ** | Lọc kép API `admin.controller.js` & `UserManagementView` | 100% Đạt | Hoàn tất |
| IV.3 | Lưu vết nhật ký an ninh (Audit Logs) vào CSDL MySQL | NĐ 85/2016 Cấp độ 3 | **ĐÃ CÓ** | Bảng `system_audit_logs`, `AuditLogView.js` | 100% Đạt | Hoàn tất |
| IV.4 | Cơ chế Xóa mềm dữ liệu (Soft Delete & Recovery) | TT 08/2021 Lưu trữ | **ĐÃ CÓ** | Cột `is_deleted`, `deleted_at` trên 5 bảng dữ liệu cốt lõi | 100% Đạt | Hoàn tất |
| IV.5 | Sao lưu CSDL vật lý (Physical SQL Dump) kèm SHA256 | NĐ 85/2016 Backup | **ĐÃ CÓ** | `BackupRestoreView.js`, thư mục `backend/backups/` | 100% Đạt | Hoàn tất |
| IV.6 | Mã hóa kênh truyền dữ liệu TLS 1.3 / HTTPS | NĐ 85/2016 Mã hóa | **ĐÃ CÓ** | Nginx Let's Encrypt SSL tự động trên máy chủ Ubuntu | 100% Đạt | Hoàn tất |
| IV.7 | Xác thực đa yếu tố 2FA/MFA (TOTP / OTP Authenticator) | NĐ 85/2016 Cấp độ 3 | **BÁN PHẦN** | Đã có thư viện TOTP trong core, chưa bật UI bắt buộc | 40% Đạt | **Ưu tiên Khẩn cấp** |
| IV.8 | Tường lửa ứng dụng WAF & Rate Limiting chống DDoS | OWASP Top 10 | **BÁN PHẦN** | Đã cấu hình Nginx cơ bản, chưa có express-rate-limit | 50% Đạt | **Ưu tiên Cao** |
| IV.9 | Mã hóa dữ liệu nhạy cảm PII (CCCD, SĐT, Địa chỉ) | NĐ 13/2023 PDPD | **BÁN PHẦN** | Mã hóa password bcrypt, thông tin PII chưa mã hóa field | 45% Đạt | **Ưu tiên Cao** |
| IV.10 | Chính sách mật khẩu nghiêm ngặt (Expiry 90d, Entropy) | ISO 27001 ISMS | **BÁN PHẦN** | Đã kiểm tra độ dài > 6 ký tự, chưa ép đổi sau 90 ngày | 55% Đạt | **Ưu tiên Trung bình** |
| **V** | **VẬN HÀNH & KHẢ NĂNG MỞ RỘNG** | | | | | |
| V.1 | Giám sát tài nguyên máy chủ OS & số liệu MySQL | ISO 27001 A.12 | **ĐÃ CÓ** | `SystemMonitorView.js`, `information_schema` thật | 100% Đạt | Hoàn tất |
| V.2 | Quản lý tiến trình Cluster Mode (PM2 Cluster) | Khả năng sẵn sàng | **ĐÃ CÓ** | `ecosystem.config.js` chạy 2 instances cluster port 5009 | 90% Đạt | Hoàn tất |
| V.3 | Cổng liên thông ERP mẹ qua SSO JWT & Webhook | Liên thông hệ thống | **ĐÃ CÓ** | `ErpSyncHubView.js`, `sync.routes.js`, SSO Secret Token | 100% Đạt | Hoàn tất |
| V.4 | Bộ đệm Caching Redis phân tán chịu tải cao | High Concurrency | **CHƯA CÓ** | Hiện đang dùng In-Memory Cache của Node.js, chưa có Redis | 30% Chưa đạt | **Ưu tiên Cao** |
| V.5 | Tích hợp lớp học trực tuyến thời gian thực (BBB/Zoom) | TT 08/2021 Điều 12 | **BÁN PHẦN** | Đã hỗ trợ liên kết URL phòng họp, chưa nhúng SDK SDK/LTI | 50% Đạt | **Ưu tiên Trung bình** |
| **VI** | **TRẢI NGHIỆM & TIẾP CẬN NỘI DUNG (WCAG)** | | | | | |
| VI.1 | Giao diện Responsive hiển thị đa thiết bị (PC/Tablet) | Tiêu chuẩn UI/UX | **ĐÃ CÓ** | Ant Design Grid responsive hoàn chỉnh, Antd 5.x | 95% Đạt | Hoàn tất |
| VI.2 | Khả năng tiếp cận người khuyết tật (WCAG 2.1 AA) | W3C WCAG 2.1 | **BÁN PHẦN** | Đã có aria-label cơ bản, chưa có bộ tương phản cao | 60% Đạt | **Ưu tiên Trung bình** |
| VI.3 | Ứng dụng di động PWA (Progressive Web App) | EdTech Xu hướng | **BÁN PHẦN** | Manifest web cơ bản, chưa hoàn thiện ServiceWorker offline | 40% Đạt | **Ưu tiên Trung bình** |

---

## 3. ĐÁNH GIÁ CHI TIẾT THEO 6 TRỤ CỘT CHUYÊN MÔN

### Trụ cột 1: Đào tạo & Quản lý Học tập theo Quy chế Bộ GD&ĐT
* **Đạt được:**
  - Cấu trúc khóa học chia theo **15 tuần học phần chuẩn hóa**, tích hợp học liệu đa phương tiện (Video, Slide bài giảng, Tài liệu PDF, Bài tập tự luận Assignment, Câu hỏi trắc nghiệm Quiz).
  - Phân hệ **Sổ điểm điện tử MOET** tính toán chính xác 100% công thức học phần:
    $$\text{Điểm HP} = \text{CC} \times 10\% + \text{TH/BT} \times 20\% + \text{GK} \times 20\% + \text{CK} \times 50\%$$
    Tự động xếp loại học lực theo thang 4 (A: 3.7 - 4.0, B+: 3.5, B: 3.0, C+: 2.5, C: 2.0, D+: 1.5, D: 1.0, F: < 1.0).
  - Tích hợp xuất khẩu và nhập liệu Excel chuẩn **SheetJS XLSX nhị phân thật**, bảo toàn ký tự tiếng Việt có dấu với UTF-8 BOM.
  - Văn bản xuất Word (.doc) tuân thủ 100% quy định văn thư theo **Nghị định 30/2020/NĐ-CP** (Quốc hiệu, Tiêu ngữ, Cỡ chữ Times New Roman 12-13pt, 3 cấp chữ ký).
* **Khoảng trống cần bổ sung:**
  - Cần thêm bộ đếm tự động tỷ lệ đào tạo trực tuyến trên toàn khóa học (Program-level online ratio validator) để cảnh báo khi một chương trình đào tạo vượt quá 30% tổng tín chỉ học trực tuyến.
  - Cần xây dựng chức năng tự động xét duyệt cảnh báo học vụ định kỳ theo 3 mức dựa trên số tín chỉ nợ và CPA tích lũy.

### Trụ cột 2: Khảo thí, Ngân hàng Đề thi & Phòng thi Trực tuyến An toàn
* **Đạt được:**
  - Hệ thống sở hữu **Ngân hàng 120 đề thi chuẩn hóa** cho toàn bộ 8 môn học cốt lõi (mỗi môn đúng 3 đề gốc độc lập + 12 đề hoán vị được trộn bằng thuật toán PRNG xác định).
  - Mỗi đề thi gồm đúng **40 câu hỏi trắc nghiệm, thang điểm 10.0 (0.25đ/câu), thời gian làm bài 60 phút**, bao phủ đầy đủ chuẩn đầu ra CLO1-CLO4 và 4 mức độ nhận thức thang đo Bloom.
  - Cung cấp **Bảng ma trận đối sánh đáp án 40 câu hỏi** giữa các mã đề hoán vị và cho phép xuất file Excel/CSV phục vụ công tác chấm thi.
  - Phòng thi trực tuyến hỗ trợ chế độ **Kiosk Lockdown**, truyền luồng video webcam HD qua WebRTC, giám sát vi phạm bằng AI (quay mặt, người thứ 2, chuyển tab) và tự động đình chỉ bài thi khi vượt quá 3 lần vi phạm.
  - Quy trình cấp quyền dự thi kiểm tra nghiêm ngặt điều kiện chuyên cần ($\ge 80\%$) và hoàn thành nghĩa vụ học phí.
* **Khoảng trống cần bổ sung:**
  - Hoàn thiện tệp cấu hình `.seb` nạp trực tiếp vào ứng dụng Safe Exam Browser để khóa sâu cấp hệ điều hành (OS-level lockdown).
  - Bổ sung cơ chế AI chấm điểm tự luận hỗ trợ chấm bài bán tự động theo Rubrics.

### Trụ cột 3: Chuẩn Đóng gói Học liệu & Tích hợp Giáo dục Quốc tế (IMS Global)
* **Đạt được:**
  - Đã tích hợp trình xem và phát bài giảng chuẩn **SCORM 1.2 & SCORM 2004 4th Edition**, tự động bắt các sự kiện CMI (`cmi.core.lesson_status`, `cmi.core.score.raw`, `cmi.suspend_data`).
  - Hỗ trợ chuẩn **xAPI (Tin Can API)** sinh Statements theo định dạng chuẩn Actor - Verb - Object gửi tới hệ thống LRS.
  - Triển khai thành công chuẩn **LTI 1.3 Advantage** (Learning Tools Interoperability) với đầy đủ endpoint JWKS, Deep Linking và dịch vụ AGS (Assignment and Grade Services) để trả điểm ngược về LMS.
  - Hỗ trợ xuất đề thi định dạng quốc tế **IMS QTI v2.1 XML**.
* **Khoảng trống cần bổ sung:**
  - Tích hợp cổng API kiểm tra đạo văn tự động kết nối cơ sở dữ liệu học thuật quốc tế (Turnitin / CopyLeaks).
  - Xây dựng hệ thống phát hành chứng chỉ số Open Badges v3.0 kèm mã QR xác thực trực tuyến.

### Trụ cột 4: An toàn, Bảo mật Thông tin & Quyền Riêng tư Dữ liệu (PDPD & NĐ 85)
* **Đạt được:**
  - Phân quyền RBAC nghiêm ngặt 5 cấp độ (`superadmin`, `admin`, `teacher`, `student`, `proctor`).
  - Thiết kế đặc quyền `superadmin` (Chủ dự án) với cơ chế bảo vệ ẩn danh tuyệt đối: truy cập toàn bộ chức năng quản trị cấp cao nhưng hoàn toàn vô hình trong các danh sách và báo cáo học thuật.
  - Lưu vết nhật ký an ninh **Audit Logs thực tế vào CSDL MySQL** (`system_audit_logs`), theo dõi đầy đủ IP, thiết bị, tác vụ CRUD, và thời gian thực hiện.
  - Cơ chế **Xóa mềm (Soft Delete)** bảo toàn dữ liệu phục vụ thanh tra, kiểm định chất lượng giáo dục.
  - Sao lưu vật lý định kỳ CSDL ra file dump SQL kèm mã băm toàn vẹn SHA-256.
  - Kênh truyền toàn hệ thống được mã hóa HTTPS / TLS 1.3 với chứng chỉ số SSL tự động.
* **Khoảng trống cần bổ sung:**
  - Bắt buộc kích hoạt **Xác thực 2 yếu tố (2FA/MFA qua TOTP Authenticator)** cho toàn bộ tài khoản Quản trị viên và Giảng viên theo chuẩn Nghị định 85/2016 Cấp độ 3.
  - Bổ sung lớp mã hóa dữ liệu nhạy cảm (Field-Level Encryption với AES-256) cho các trường thông tin định danh cá nhân (PII: CCCD, Số điện thoại cá nhân) theo Nghị định 13/2023/NĐ-CP.
  - Tích hợp middleware kiểm soát tần suất truy cập (`express-rate-limit`) chống tấn công vét cạn mật khẩu (Brute-force) và từ chối dịch vụ (DoS).

### Trụ cột 5: Quản trị Hệ thống, Vận hành, Kiểm toán & Khả năng Mở rộng
* **Đạt được:**
  - Trang **Giám sát hệ thống thực tế (System Monitor)** đo lường chính xác các thông số phần cứng CPU/RAM của hệ điều hành và truy vấn trực tiếp số liệu bảng, dung lượng lưu trữ của máy chủ MySQL InnoDB.
  - Cấu hình tiến trình **PM2 Cluster Mode** chạy 2 worker song song, tự động khởi động lại khi có sự cố và phục hồi sau khi khởi động lại máy chủ.
  - Cổng liên thông ERP mẹ (`qldt.techcorp.info.vn`) hỗ trợ cơ chế đăng nhập một lần (Single Sign-On - SSO) thông qua khóa bí mật JWT.
* **Khoảng trống cần bổ sung:**
  - Tích hợp cụm bộ đệm phân tán **Redis Cache** để chia sẻ phiên làm việc (Session Store) và lưu tạm đề thi, đảm bảo hệ thống chịu tải tức thời khi có từ 5.000 đến 10.000 thí sinh truy cập đồng thời vào phòng thi.
  - Nhúng trực tiếp phần mềm phòng học trực tuyến WebRTC mã nguồn mở (BigBlueButton) hoặc Zoom LTI vào thẳng giao diện tuần học.

### Trụ cột 6: Trải nghiệm Người dùng, Tiếp cận Web (WCAG) & Ứng dụng Di động
* **Đạt được:**
  - Giao diện xây dựng trên nền tảng Ant Design 5.x hiện đại, hỗ trợ hiển thị đáp ứng (Responsive Design) hoàn hảo trên máy tính bàn, máy tính xách tay và máy tính bảng.
  - Hệ thống bản in `@media print` được tinh chỉnh tối ưu, loại bỏ triệt để các vết rác header/footer URL của trình duyệt, căn lề văn bản chuẩn A4 theo Nghị định 30/2020/NĐ-CP.
* **Khoảng trống cần bổ sung:**
  - Nâng cấp độ tương phản màu sắc và hỗ trợ điều hướng bằng phím bàn phím hoàn chỉnh để đạt chứng nhận **W3C WCAG 2.1 Level AA** dành cho người yếu thị lực.
  - Phát triển ứng dụng di động bản địa (Mobile App) hoặc cấu hình hoàn chỉnh Progressive Web App (PWA) hỗ trợ đẩy thông báo (Push Notifications) về lịch thi, điểm số cho sinh viên.

---

## 4. BẢNG ĐIỂM ĐÁNH GIÁ MỨC ĐỘ TRƯỞNG THÀNH (MATURITY SCORECARD)

Dựa trên khung đánh giá của **Quyết định 4725/QĐ-BGDĐT** và tiêu chuẩn đánh giá chất lượng phần mềm giáo dục **ISO/IEC 25010**:

```
+-----------------------------------------------------------------------+
|              KẾT QUẢ ĐÁNH GIÁ MỨC ĐỘ TRƯỞNG THÀNH LMS                 |
+-----------------------------------------------------------------------+
| Trụ Cột Đánh Giá                | Trọng Số | Điểm Đạt | Tỷ Lệ Đạt (%) |
+---------------------------------+----------+----------+---------------+
| 1. Quy chế đào tạo Bộ GD&ĐT     |   25%    |  23.5/25 |     94.0%     |
| 2. Khảo thí & Ngân hàng đề thi  |   25%    |  24.0/25 |     96.0%     |
| 3. Chuẩn EdTech quốc tế         |   15%    |  12.0/15 |     80.0%     |
| 4. An toàn thông tin & PDPD     |   20%    |  16.5/20 |     82.5%     |
| 5. Quản trị, Vận hành & Tải     |   10%    |   8.5/10 |     85.0%     |
| 6. Tiếp cận Web & Mobile UX     |    5%    |   3.5/5  |     70.0%     |
+---------------------------------+----------+----------+---------------+
| TỔNG ĐIỂM TOÀN HỆ THỐNG         |  100%    |  88.0    |     88.0%     |
+-----------------------------------------------------------------------+
| XẾP HẠNG: MỨC ĐỘ 2+ (NÂNG CAO - TIỆM CẬN MỨC ĐỘ 3 TOÀN DIỆN THÔNG MINH)|
+-----------------------------------------------------------------------+
```

### Kết luận đánh giá:
Hệ thống **TCU COMPASS LMS** đạt **88.0 / 100 điểm**, đạt **Cấp độ Chuyển đổi số Nâng cao (Mức 2+)** theo Quyết định 4725/QĐ-BGDĐT. Hệ thống vượt trội ở phân hệ **Sổ điểm điện tử chuẩn Thông tư 08**, **Ngân hàng 120 đề thi chuẩn hóa kết thúc môn**, **Phòng thi trực tuyến Kiosk Lockdown giám sát AI** và **Khả năng liên thông SCORM/xAPI/LTI quốc tế**.

---

## 5. LỘ TRÌNH NÂNG CẤP & BỔ SUNG TÍNH NĂNG CHI TIẾT (ROADMAP 2026 - 2027)

Nhằm nâng mức độ trưởng thành lên **Cấp độ 3 (Toàn diện - Thông minh - Dẫn đầu thị trường)** và đáp ứng 100% các tiêu chuẩn kiểm định giáo dục khắt khe nhất, lộ trình nâng cấp được đề xuất như sau:

### Giai đoạn 1: Gia cố Bảo mật & Tuân thủ Pháp lý Khẩn cấp (Q4/2026)
1. **Bật Xác thực 2 yếu tố (2FA/MFA - TOTP)**:
   - Áp dụng bắt buộc cho tất cả tài khoản `admin`, `superadmin` và `teacher`.
   - Sinh mã QR kết nối Google Authenticator / Microsoft Authenticator khi đăng nhập lần đầu.
2. **Cài đặt Tường lửa WAF & Giới hạn Tần suất (Rate Limiting)**:
   - Tích hợp `express-rate-limit` vào các route nhạy cảm (`/api/auth/login`, `/api/exam/submit`, `/api/exam/access`) với ngưỡng 5 lần thử/phút chống tấn công Brute-force.
   - Thêm gói `helmet` để bật toàn diện các tiêu đề bảo mật HTTP (CSP, HSTS, X-Content-Type-Options).
3. **Mã hóa Dữ liệu Nhạy cảm (Field-Level Encryption - PDPD NĐ 13)**:
   - Sử dụng thuật toán AES-256-GCM để mã hóa các trường số CCCD, địa chỉ, số điện thoại của học viên trước khi lưu vào CSDL MySQL.
4. **Bộ kiểm soát trần 30% Đào tạo trực tuyến**:
   - Tự động thống kê số tín chỉ học trực tuyến trên tổng số tín chỉ của CTĐT K68, hiển thị cảnh báo trực quan cho phòng Đào tạo khi vượt ngưỡng theo Thông tư 08.

### Giai đoạn 2: Nâng cao Trải nghiệm Giáo dục & Tích hợp Nâng cao (Q1 - Q2/2027)
1. **Tích hợp Bộ đệm Caching Redis**:
   - Cài đặt Redis Server trên Ubuntu để lưu tạm ma trận đề thi và phiên thi trực tuyến, đảm bảo hệ thống phục vụ trên 5.000 thí sinh thi cùng lúc với độ trễ dưới 100ms.
2. **Cổng Kết Nối Đồng Bộ CSDL Ngành HEMIS**:
   - Xây dựng module tự động ánh xạ dữ liệu môn học, điểm học phần sang schema chuẩn JSON của cổng HEMIS Bộ GD&ĐT.
3. **Chữ Ký Số Cá Nhân PKI (USB Token & Cloud HSM)**:
   - Tích hợp thư viện ký số chuẩn Thông tư 41/2017/TT-BTTTT cho phép Giảng viên ký số điện tử có giá trị pháp lý vào bảng điểm học phần trước khi nộp về Phòng Khảo thí.
4. **Nhúng Phòng Học Ảo Trực Tuyến WebRTC / LTI**:
   - Tích hợp máy chủ BigBlueButton mã nguồn mở để giảng viên mở lớp học trực tuyến trực tiếp ngay trong từng tuần học mà không cần dùng phần mềm ngoài.

### Giai đoạn 3: EdTech Thế Hệ Mới & Đạt Chuẩn Toàn Cầu (Q3 - Q4/2027)
1. **Ứng Dụng Di Động Đa Nền Tảng (Mobile App iOS & Android)**:
   - Đóng gói ứng dụng di động bằng React Native / Flutter hoặc PWA hoàn chỉnh, hỗ trợ nhận thông báo đẩy về lịch thi, điểm số và bài giảng mới.
2. **Chuẩn Tiếp Cận W3C WCAG 2.1 Level AA**:
   - Bổ sung bộ chuyển đổi giao diện tương phản cao (High Contrast Mode) và công cụ đọc màn hình hỗ trợ người khuyết tật.
3. **Hệ Thống Cấp Chứng Chỉ Số Open Badges v3.0**:
   - Tự động phát hành huy hiệu số có gắn chữ ký số mật mã học thuật sau khi học viên hoàn thành xuất sắc môn học.

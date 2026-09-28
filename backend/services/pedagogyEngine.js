// backend/services/pedagogyEngine.js
// Động Cơ Soạn Giảng & Khảo Thí Đại Học Chuẩn Quy Chế Bộ GD&ĐT (Thông tư 08/2021/TT-BGDĐT)
// Tích hợp Chuẩn Kiểm Định AUN-QA, Thang đo Bloom C1-C6, và Chu trình Sư phạm Tích cực (5E / Gagne 9 Biến Cố)

/**
 * Danh mục chuẩn 15 tuần học phần cho các khối ngành công nghệ & kinh tế
 */
const COURSE_CURRICULA = {
  IT201: {
    code: 'IT201',
    name: 'Cơ sở Dữ liệu & SQL',
    credits: 3,
    faculty: 'Khoa Công Nghệ Thông Tin',
    language: 'sql',
    textbook: 'Abraham Silberschatz, Henry F. Korth, S. Sudarshan (2020), Database System Concepts, 7th Edition, McGraw-Hill.',
    weeks: {
      1: {
        topic: 'Tổng quan Hệ Cơ Sở Dữ Liệu & Kiến Trúc 3 Tầng ANSI-SPARC',
        theory: `1. Khái niệm Hệ quản trị cơ sở dữ liệu (DBMS vs File Systems):
- Sự cần thiết của CSDL: Khắc phục dư thừa dữ liệu (Data Redundancy), tính không nhất quán (Inconsistency), khó khăn trong truy xuất và kiểm soát tranh chấp đồng thời (Concurrency control).
- Kiến trúc 3 tầng ANSI-SPARC: Tầng ngoài (External/View Level), Tầng quan niệm (Conceptual/Logical Level), Tầng trong (Internal/Physical Level). Tính độc lập dữ liệu vật lý và logic (Data Independence).
2. Mô hình dữ liệu quan hệ (Relational Model của E.F. Codd):
- Quan hệ (Relation/Table), Bộ (Tuple/Row), Thuộc tính (Attribute/Column), Miền giá trị (Domain).
- Các loại khóa: Khóa chính (Primary Key - PK), Khóa ngoại (Foreign Key - FK), Khóa ứng viên (Candidate Key), Siêu khóa (Super Key).
- Ràng buộc toàn vẹn thực thể (Entity Integrity: PK không được NULL) và Ràng buộc toàn vẹn tham chiếu (Referential Integrity: FK phải tồn tại trong bảng cha hoặc mang giá trị NULL).`,
        code_sample: `-- Tạo bảng phòng ban và nhân viên minh họa ràng buộc toàn vẹn
CREATE TABLE PhongBan (
    MaPB VARCHAR(10) PRIMARY KEY,
    TenPB NVARCHAR(100) NOT NULL,
    DiaDiem NVARCHAR(200)
);

CREATE TABLE NhanVien (
    MaNV VARCHAR(10) PRIMARY KEY,
    HoTen NVARCHAR(100) NOT NULL,
    NgaySinh DATE,
    Luong DECIMAL(12,2) CHECK (Luong >= 0),
    MaPB VARCHAR(10),
    CONSTRAINT FK_NhanVien_PhongBan FOREIGN KEY (MaPB) 
        REFERENCES PhongBan(MaPB) ON DELETE SET NULL ON UPDATE CASCADE
);`,
        pitfalls: 'Quên khai báo ON DELETE CASCADE/SET NULL khiến thao tác xóa bản ghi cha bị lỗi Foreign Key Constraint Violation. Đặt khóa chính với kiểu dữ liệu không tối ưu (ví dụ TEXT thay vì INT/VARCHAR ngắn).',
        lab_1: 'Cài đặt môi trường MySQL/PostgreSQL và tạo CSDL Quản lý Thư viện trường học.',
        lab_2: 'Đặc tả 4 bảng dữ liệu (DocGia, Sach, MuonTra, ChiTietMuon) có đầy đủ khóa chính, khóa ngoại và ràng buộc CHECK.',
        lab_3: 'Thử nghiệm vi phạm ràng buộc toàn vẹn tham chiếu (thêm sách có Mã tác giả không tồn tại) và phân tích thông điệp lỗi của hệ quản trị.',
        quiz: [
          {
            bloom: 'Nhận biết (C1)',
            question: 'Trong kiến trúc 3 tầng ANSI-SPARC của hệ CSDL, tầng nào mô tả toàn bộ cấu trúc logic của cơ sở dữ liệu mà không phụ thuộc vào cách lưu trữ vật lý?',
            options: [
              { key: 'A', text: 'Tầng quan niệm (Conceptual/Logical Level)', is_correct: true },
              { key: 'B', text: 'Tầng ngoài (External Level)', is_correct: false },
              { key: 'C', text: 'Tầng trong (Internal Level)', is_correct: false },
              { key: 'D', text: 'Tầng giao diện người dùng', is_correct: false }
            ],
            explanation: 'Tầng quan niệm (Conceptual Level) mô tả toàn bộ thực thể, thuộc tính và mối quan hệ giữa chúng cho toàn bộ người dùng mà độc lập với cấu trúc đĩa cứng vật lý.'
          },
          {
            bloom: 'Thông hiểu (C2)',
            question: 'Ràng buộc toàn vẹn tham chiếu (Referential Integrity) quy định điều gì đối với giá trị của một Khóa ngoại (Foreign Key)?',
            options: [
              { key: 'A', text: 'Phải khớp với một giá trị khóa chính đang tồn tại trong bảng được tham chiếu hoặc phải mang giá trị NULL (nếu cho phép)', is_correct: true },
              { key: 'B', text: 'Bắt buộc luôn luôn khác NULL trong mọi trường hợp', is_correct: false },
              { key: 'C', text: 'Phải có giá trị lớn hơn khóa chính của bảng cha', is_correct: false },
              { key: 'D', text: 'Chỉ được phép tham chiếu tới các trường kiểu chuỗi ký tự', is_correct: false }
            ],
            explanation: 'Khóa ngoại trỏ đến khóa chính bảng cha; nếu giá trị khóa ngoại không tồn tại bên bảng cha thì mối liên kết bị phá vỡ (dangling reference), trừ trường hợp thuộc tính đó được định nghĩa cho phép mang giá trị NULL.'
          },
          {
            bloom: 'Vận dụng (C3)',
            question: 'Khi định nghĩa bảng Hóa đơn có khóa ngoại MaKH tham chiếu đến bảng Khách hàng, tùy chọn nào giúp tự động xóa tất cả hóa đơn khi khách hàng tương ứng bị xóa?',
            options: [
              { key: 'A', text: 'ON DELETE CASCADE', is_correct: true },
              { key: 'B', text: 'ON DELETE SET NULL', is_correct: false },
              { key: 'C', text: 'ON DELETE RESTRICT', is_correct: false },
              { key: 'D', text: 'ON DELETE NO ACTION', is_correct: false }
            ],
            explanation: 'Tùy chọn ON DELETE CASCADE ra lệnh cho DBMS tự động xóa liên hoàn các bản ghi con phụ thuộc khi bản ghi cha bị xóa.'
          },
          {
            bloom: 'Vận dụng cao (C4)',
            question: 'Hệ thống ngân hàng yêu cầu khi xóa một Tài khoản cha thì số dư giao dịch liên quan KHÔNG ĐƯỢC PHÉP mất đi mà phải chặn thao tác xóa để đảm bảo an toàn kế toán. Ràng buộc nào sau đây là chuẩn mực nhất?',
            options: [
              { key: 'A', text: 'ON DELETE RESTRICT (hoặc NO ACTION)', is_correct: true },
              { key: 'B', text: 'ON DELETE CASCADE', is_correct: false },
              { key: 'C', text: 'ON DELETE SET DEFAULT', is_correct: false },
              { key: 'D', text: 'Tắt toàn bộ kiểm tra khóa ngoại', is_correct: false }
            ],
            explanation: 'ON DELETE RESTRICT ngăn chặn (chặn đứng) thao tác xóa bản ghi cha nếu còn tồn tại bản ghi con tham chiếu tới, đảm bảo không mất dấu vết giao dịch tài chính.'
          }
        ]
      },
      2: {
        topic: 'Mô Hình Thực Thể - Liên Kết (ERD) & Kỹ Thuật Chuyển Đổi Sang Lược Đồ Quan Hệ',
        theory: `1. Các thành phần của mô hình ER (Entity-Relationship Model):
- Tập thực thể (Entity Sets), Thuộc tính (Đơn, tổng hợp, đa trị, suy diễn, khóa).
- Mối kết hợp (Relationship Types) và Bản số (Cardinality Ratio): 1:1, 1:N, N:M.
- Thực thể yếu (Weak Entity) và Mối kết hợp định danh (Identifying Relationship).
2. Quy tắc chuyển đổi ERD sang Lược đồ quan hệ chuẩn (Mapping Algorithm):
- Thực thể mạnh -> Bảng riêng với PK là thuộc tính khóa.
- Mối kết hợp 1:N -> Đưa PK của bên 1 sang bên N làm Khóa ngoại (FK).
- Mối kết hợp N:M -> Tạo một bảng nối trung gian (Junction Table) chứa 2 FK tham chiếu về 2 bảng cha, khóa chính tổng hợp từ cả 2 FK.
- Thuộc tính đa trị -> Tách thành bảng riêng gồm thuộc tính đó và PK của thực thể cha.`,
        code_sample: `-- Chuyển đổi mối quan hệ N:M SinhVien - MonHoc thành bảng nối KetQua
CREATE TABLE SinhVien (
    MaSV VARCHAR(12) PRIMARY KEY,
    HoTen NVARCHAR(100) NOT NULL
);

CREATE TABLE MonHoc (
    MaMH VARCHAR(10) PRIMARY KEY,
    TenMH NVARCHAR(100) NOT NULL,
    SoTinChi INT CHECK (SoTinChi > 0)
);

CREATE TABLE KetQuaHocTap (
    MaSV VARCHAR(12),
    MaMH VARCHAR(10),
    DiemQuaTrinh DECIMAL(4,2),
    DiemCuoiKy DECIMAL(4,2),
    PRIMARY KEY (MaSV, MaMH),
    FOREIGN KEY (MaSV) REFERENCES SinhVien(MaSV) ON DELETE CASCADE,
    FOREIGN KEY (MaMH) REFERENCES MonHoc(MaMH) ON DELETE CASCADE
);`,
        pitfalls: 'Quên tạo bảng trung gian cho mối kết hợp N:M dẫn đến lưu trữ chuỗi ID ngăn cách bằng dấu phẩy trong 1 cột, vi phạm chuẩn 1NF.',
        lab_1: 'Sử dụng công cụ Draw.io / MySQL Workbench để vẽ lược đồ ERD cho hệ thống bán hàng trực tuyến E-commerce.',
        lab_2: 'Áp dụng quy tắc ánh xạ 7 bước để chuyển đổi ERD thành cấu trúc DDL SQL hoàn chỉnh.',
        lab_3: 'Kiểm tra tính đúng đắn của bản số 1:N và N:M sau khi tạo bảng trên RDBMS.',
        quiz: [
          {
            bloom: 'Nhận biết (C1)',
            question: 'Trong mô hình ERD, mối kết hợp nhiều - nhiều (N:M) giữa hai thực thể SinhVien và MonHoc được chuyển đổi thành lược đồ quan hệ như thế nào?',
            options: [
              { key: 'A', text: 'Tạo một bảng liên kết trung gian chứa khóa ngoại của cả hai thực thể', is_correct: true },
              { key: 'B', text: 'Đưa khóa chính của MonHoc vào làm khóa ngoại trong SinhVien', is_correct: false },
              { key: 'C', text: 'Đưa khóa chính của SinhVien vào làm khóa ngoại trong MonHoc', is_correct: false },
              { key: 'D', text: 'Gộp chung hai thực thể vào một bảng duy nhất', is_correct: false }
            ],
            explanation: 'Mối kết hợp N:M bắt buộc phải tách thành một bảng nối trung gian (Junction Table) để đảm bảo tính nguyên tử của dữ liệu.'
          },
          {
            bloom: 'Thông hiểu (C2)',
            question: 'Thuộc tính đa trị (Multivalued Attribute) như "Danh sách số điện thoại" của một khách hàng được xử lý như thế nào khi chuyển đổi sang mô hình quan hệ?',
            options: [
              { key: 'A', text: 'Tách thành một bảng riêng gồm số điện thoại và mã khách hàng làm khóa ngoại', is_correct: true },
              { key: 'B', text: 'Lưu toàn bộ số điện thoại ngăn cách bằng dấu phẩy trong một cột VARCHAR', is_correct: false },
              { key: 'C', text: 'Bỏ qua không lưu trữ các số điện thoại phụ', is_correct: false },
              { key: 'D', text: 'Tạo 50 cột điện thoại dự phòng trong bảng Khách hàng', is_correct: false }
            ],
            explanation: 'Chuẩn 1NF cấm thuộc tính đa trị; do đó phải tách thành bảng riêng (MaKH, SoDienThoai).'
          },
          {
            bloom: 'Vận dụng (C3)',
            question: 'Cho thực thể Khoa và GiangVien có mối quan hệ 1:N (Một Khoa có nhiều Giảng viên, mỗi Giảng viên thuộc 1 Khoa). Khóa ngoại được đặt ở đâu?',
            options: [
              { key: 'A', text: 'Đặt MaKhoa làm khóa ngoại trong bảng GiangVien', is_correct: true },
              { key: 'B', text: 'Đặt MaGV làm khóa ngoại trong bảng Khoa', is_correct: false },
              { key: 'C', text: 'Bắt buộc tạo bảng trung gian Khoa_GiangVien', is_correct: false },
              { key: 'D', text: 'Không cần đặt khóa ngoại', is_correct: false }
            ],
            explanation: 'Quy tắc ánh xạ 1:N đưa khóa chính của bên 1 (Khoa) sang làm khóa ngoại ở bên N (GiangVien).'
          },
          {
            bloom: 'Vận dụng cao (C4)',
            question: 'Khi thiết kế quan hệ 1:1 giữa CanCuocCongDan và NguoiDan, phương án thiết kế nào vừa đảm bảo tính duy nhất, vừa tối ưu hiệu năng truy vấn?',
            options: [
              { key: 'A', text: 'Đặt SoCCCD làm khóa ngoại trong NguoiDan kèm ràng buộc UNIQUE NOT NULL', is_correct: true },
              { key: 'B', text: 'Tạo bảng trung gian N:M', is_correct: false },
              { key: 'C', text: 'Để SoCCCD trùng lặp tự do', is_correct: false },
              { key: 'D', text: 'Gộp thành bảng phi cấu trúc NoSQL', is_correct: false }
            ],
            explanation: 'Quan hệ 1:1 được cài đặt bằng khóa ngoại có ràng buộc UNIQUE để đảm bảo mỗi bản ghi chỉ tương ứng duy nhất 1-1.'
          }
        ]
      },
      3: {
        topic: 'Lý Thuyết Chuẩn Hóa Cơ Sở Dữ Liệu (1NF, 2NF, 3NF, BCNF) & Khử Dư Thừa Dữ Liệu',
        theory: `1. Động lực của chuẩn hóa:
- Tránh các bất thường (Anomalies): Bất thường khi thêm (Insertion Anomaly), khi xóa (Deletion Anomaly), khi sửa (Update Anomaly).
- Phụ thuộc hàm (Functional Dependency - FD): X -> Y nghĩa là giá trị của X xác định duy nhất giá trị của Y.
2. Các dạng chuẩn cơ bản:
- Dạng chuẩn 1 (1NF): Mọi giá trị thuộc tính phải là giá trị nguyên tử (Atomic values), không chứa tập hợp hay mảng giá trị lặp.
- Dạng chuẩn 2 (2NF): Đạt 1NF và mọi thuộc tính không khóa phải phụ thuộc hàm đầy đủ (Full functional dependency) vào toàn bộ khóa chính, không phụ thuộc vào một phần khóa chính (Partial dependency).
- Dạng chuẩn 3 (3NF): Đạt 2NF và không có thuộc tính không khóa nào phụ thuộc bắc cầu (Transitive dependency) vào khóa chính.
- Dạng chuẩn Boyce-Codd (BCNF): Với mọi phụ thuộc hàm X -> Y không tầm thường, X phải là siêu khóa (Superkey).`,
        code_sample: `-- Minh họa phân rã bảng chưa chuẩn hóa về 3NF
-- Phân rã thành 2 bảng đạt 3NF: KhachHang và DonHang
CREATE TABLE KhachHang (
    MaKH VARCHAR(10) PRIMARY KEY,
    TenKH NVARCHAR(100) NOT NULL,
    DiaChi NVARCHAR(200)
);

CREATE TABLE DonHang (
    MaDH VARCHAR(15) PRIMARY KEY,
    NgayDat DATETIME DEFAULT CURRENT_TIMESTAMP,
    MaKH VARCHAR(10) NOT NULL,
    TongTien DECIMAL(14,2) DEFAULT 0,
    FOREIGN KEY (MaKH) REFERENCES KhachHang(MaKH)
);`,
        pitfalls: 'Chuẩn hóa quá mức có thể làm chậm truy vấn do JOIN quá nhiều bảng; tuy nhiên trong hệ thống giao dịch OLTP, chuẩn 3NF là tiêu chuẩn bắt buộc.',
        lab_1: 'Xác định tập phụ thuộc hàm (F) và tìm tất cả các khóa ứng viên của lược đồ quan hệ.',
        lab_2: 'Phân tích bảng dữ liệu bán hàng đang bị dư thừa và phân rã bảo toàn thông tin về dạng chuẩn 3NF.',
        lab_3: 'Viết báo cáo đánh giá hiện tượng dị thường cập nhật (Update Anomaly) trước và sau khi chuẩn hóa.',
        quiz: [
          {
            bloom: 'Nhận biết (C1)',
            question: 'Một quan hệ được coi là đạt Dạng chuẩn 1 (1NF) khi và chỉ khi thỏa mãn điều kiện nào sau đây?',
            options: [
              { key: 'A', text: 'Tất cả các thuộc tính đều chứa các giá trị nguyên tử (Atomic values), không chứa danh sách lặp', is_correct: true },
              { key: 'B', text: 'Quan hệ có ít nhất 3 khóa ngoại', is_correct: false },
              { key: 'C', text: 'Không có phụ thuộc hàm bắc cầu', is_correct: false },
              { key: 'D', text: 'Được lưu trữ trên ổ đĩa SSD', is_correct: false }
            ],
            explanation: 'Chuẩn 1NF yêu cầu miền giá trị của mọi thuộc tính chỉ chứa các giá trị đơn nguyên tử.'
          },
          {
            bloom: 'Thông hiểu (C2)',
            question: 'Hiện tượng phụ thuộc hàm bắc cầu (Transitive Dependency) vi phạm dạng chuẩn nào sau đây?',
            options: [
              { key: 'A', text: 'Dạng chuẩn 3 (3NF)', is_correct: true },
              { key: 'B', text: 'Dạng chuẩn 1 (1NF)', is_correct: false },
              { key: 'C', text: 'Dạng chuẩn 2 (2NF)', is_correct: false },
              { key: 'D', text: 'Không vi phạm chuẩn nào', is_correct: false }
            ],
            explanation: 'Quan hệ đạt 2NF nhưng còn chứa phụ thuộc bắc cầu thì chưa đạt 3NF.'
          },
          {
            bloom: 'Vận dụng (C3)',
            question: 'Cho bảng SinhVien_Lop(MaSV, MaLop, TenLop, GVCN) với khóa chính là MaSV. Biết MaLop -> TenLop, GVCN. Bảng này đạt dạng chuẩn nào cao nhất?',
            options: [
              { key: 'A', text: 'Đạt 2NF nhưng chưa đạt 3NF vì có phụ thuộc bắc cầu MaSV -> MaLop -> TenLop', is_correct: true },
              { key: 'B', text: 'Đạt 3NF', is_correct: false },
              { key: 'C', text: 'Chưa đạt 1NF', is_correct: false },
              { key: 'D', text: 'Đạt BCNF', is_correct: false }
            ],
            explanation: 'Khóa chính chỉ có 1 thuộc tính nên tự động đạt 2NF, nhưng có phụ thuộc bắc cầu nên vi phạm 3NF.'
          },
          {
            bloom: 'Vận dụng cao (C4)',
            question: 'Để chuẩn hóa bảng SinhVien_Lop(MaSV, MaLop, TenLop, GVCN) về 3NF, giải pháp phân rã nào sau đây bảo toàn thông tin và bảo toàn phụ thuộc hàm?',
            options: [
              { key: 'A', text: 'SinhVien(MaSV, MaLop) và LopHoc(MaLop, TenLop, GVCN)', is_correct: true },
              { key: 'B', text: 'SinhVien(MaSV, TenLop) và LopHoc(MaLop, GVCN)', is_correct: false },
              { key: 'C', text: 'Giữ nguyên bảng cũ và thêm cột ghi chú', is_correct: false },
              { key: 'D', text: 'Xóa cột MaLop', is_correct: false }
            ],
            explanation: 'Phân rã thành SinhVien(MaSV, MaLop) và LopHoc(MaLop, TenLop, GVCN) loại bỏ hoàn toàn phụ thuộc bắc cầu.'
          }
        ]
      },
      4: {
        topic: 'Ngôn Ngữ Định Nghĩa Dữ Liệu SQL DDL & Các Ràng Buộc Toàn Vẹn Nâng Cao',
        theory: `1. Các câu lệnh SQL DDL chính: CREATE TABLE, ALTER TABLE, DROP TABLE, TRUNCATE TABLE.
2. Các ràng buộc toàn vẹn chuẩn ANSI SQL:
- PRIMARY KEY, FOREIGN KEY, UNIQUE, NOT NULL, CHECK, DEFAULT.
- Kỹ thuật đặt tên ràng buộc (Constraint Naming Convention): PK_Bang, FK_BangCon_BangCha, CK_Bang_Cot.
3. Cơ chế CASCADE: ON DELETE CASCADE, ON DELETE SET NULL, ON UPDATE CASCADE.`,
        code_sample: `ALTER TABLE DonHang
ADD CONSTRAINT CK_DonHang_TongTien CHECK (TongTien >= 0);

ALTER TABLE NhanVien
ADD CONSTRAINT UQ_NhanVien_Email UNIQUE (Email);`,
        pitfalls: 'Dùng lệnh DROP TABLE bảng cha khi bảng con đang tham chiếu sẽ báo lỗi Foreign Key Violation; phải xóa ràng buộc trước hoặc xóa bảng con trước.',
        lab_1: 'Viết kịch bản SQL DDL hoàn chỉnh khởi tạo 6 bảng trong hệ thống quản lý học vụ.',
        lab_2: 'Sử dụng ALTER TABLE để bổ sung các ràng buộc CHECK điểm số từ 0.0 đến 10.0.',
        lab_3: 'Thử nghiệm xóa bảng có khóa ngoại trỏ tới và phân tích cách khắc phục bằng DROP CONSTRAINT.',
        quiz: []
      },
      5: {
        topic: 'Ngôn Ngữ Thao Tác Dữ Liệu SQL DML & Quản Lý Dữ Liệu Giao Dịch',
        theory: `1. Các câu lệnh SQL DML cốt lõi: INSERT INTO, UPDATE, DELETE.
2. Xử lý dữ liệu hàng loạt (Bulk Insert / Insert Into Select).
3. Phân biệt DELETE (ghi log từng dòng, kích hoạt trigger) vs TRUNCATE (giải phóng trang dữ liệu, không ghi log chi tiết, reset IDENTITY).`,
        code_sample: `INSERT INTO KhachHang (MaKH, TenKH, DiaChi)
VALUES ('KH01', N'Nguyễn Văn An', N'Hà Nội');

UPDATE SanPham
SET GiaBan = GiaBan * 1.05
WHERE DanhMuc = N'Điện tử';`,
        pitfalls: 'Chạy UPDATE hoặc DELETE thiếu mệnh đề WHERE sẽ làm thay đổi hoặc xóa sạch toàn bộ dữ liệu bảng.',
        lab_1: 'Thực hiện chèn 100 bản ghi mẫu vào cơ sở dữ liệu bán hàng.',
        lab_2: 'Viết câu lệnh UPDATE có điều kiện kết nối nhiều bảng (UPDATE JOIN).',
        lab_3: 'So sánh tốc độ thực thi giữa DELETE và TRUNCATE trên bảng 500,000 dòng.',
        quiz: []
      },
      6: {
        topic: 'Truy Vấn Dữ Liệu Gom Nhóm (GROUP BY, HAVING) & Hàm Tổng Hợp (Aggregates)',
        theory: `1. Các hàm tổng hợp: COUNT(), SUM(), AVG(), MIN(), MAX().
2. Xử lý giá trị NULL trong hàm tổng hợp (COUNT(*) đếm dòng, COUNT(cot) bỏ qua NULL).
3. Mệnh đề GROUP BY và quy tắc SELECT chỉ chứa các cột trong GROUP BY hoặc trong hàm tổng hợp.
4. Phân biệt WHERE (lọc từng dòng trước khi nhóm) vs HAVING (lọc trên kết quả tổng hợp sau khi nhóm).`,
        code_sample: `SELECT MaPB, COUNT(MaNV) AS SoLuongNV, AVG(Luong) AS LuongTB
FROM NhanVien
WHERE TrangThai = N'Đang làm việc'
GROUP BY MaPB
HAVING AVG(Luong) >= 15000000;`,
        pitfalls: 'Dùng điều kiện lọc hàm tổng hợp trong mệnh đề WHERE (ví dụ WHERE SUM(Luong) > 1000) sẽ bị lỗi biên dịch cú pháp SQL.',
        lab_1: 'Tính tổng doanh thu và số lượng đơn hàng theo từng tháng trong năm 2026.',
        lab_2: 'Tìm top 3 phòng ban có mức lương trung bình cao nhất công ty.',
        lab_3: 'Truy vấn các sinh viên có điểm trung bình tích lũy GPA >= 3.2 và không có môn nào thi lại.',
        quiz: []
      },
      7: {
        topic: 'Kỹ Thuật Ghép Bảng Nâng Cao: INNER JOIN, OUTER JOIN, CROSS & SELF JOIN',
        theory: `1. Phép tích Descartes và Phép kết nối điều kiện (Theta Join).
2. INNER JOIN: Chỉ lấy các cặp bản ghi thỏa mãn điều kiện kết nối ở cả 2 bảng.
3. LEFT/RIGHT OUTER JOIN: Giữ lại toàn bộ các dòng của bảng bên trái/phải, điền NULL cho bảng thiếu.
4. FULL OUTER JOIN: Hợp nhất toàn bộ dữ liệu của cả 2 bảng.
5. SELF JOIN: Ghép một bảng với chính nó để biểu diễn cây phân cấp (Cây nhân viên - quản lý).`,
        code_sample: `SELECT E.HoTen AS NhanVien, M.HoTen AS QuanLy
FROM NhanVien E
LEFT JOIN NhanVien M ON E.MaQuanLy = M.MaNV;`,
        pitfalls: 'Quên điều kiện ON trong JOIN sẽ biến câu truy vấn thành tích Descartes (Cartesian Product) làm bùng nổ hàng triệu dòng, treo hệ thống.',
        lab_1: 'Viết truy vấn INNER JOIN lấy đầy đủ thông tin Sinh viên, Lớp học và Khoa quản lý.',
        lab_2: 'Sử dụng LEFT JOIN để tìm danh sách những môn học chưa từng có sinh viên nào đăng ký thi.',
        lab_3: 'Sử dụng SELF JOIN để truy vấn toàn bộ cây sơ đồ tổ chức phòng ban doanh nghiệp.',
        quiz: []
      },
      8: {
        topic: 'Truy Vấn Con (Subqueries), Mệnh Đề EXISTS, IN & Biểu Thức Bảng Thường (CTE)',
        theory: `1. Phân loại Subquery: Subquery vô hướng (Scalar), Subquery tập hợp (Multi-row), Subquery tương quan (Correlated Subquery).
2. Các toán tử so sánh tập hợp: IN, NOT IN, EXISTS, NOT EXISTS, ALL, ANY.
3. Common Table Expressions (CTE) với từ khóa WITH và CTE đệ quy (Recursive CTE).`,
        code_sample: `WITH DoanhThuNhanVien AS (
    SELECT MaNV, SUM(TongTien) AS TongDoanhThu
    FROM DonHang
    GROUP BY MaNV
)
SELECT E.HoTen, D.TongDoanhThu
FROM DoanhThuNhanVien D
JOIN NhanVien E ON D.MaNV = E.MaNV
WHERE D.TongDoanhThu > 100000000;`,
        pitfalls: 'Sử dụng NOT IN với một subquery có chứa giá trị NULL sẽ làm toàn bộ truy vấn trả về tập rỗng (empty set) do logic 3 giá trị của SQL.',
        lab_1: 'Tìm những sinh viên có điểm thi môn CSDL cao hơn điểm trung bình của toàn khóa.',
        lab_2: 'Viết truy vấn dùng EXISTS thay thế cho IN để tối ưu hóa hiệu năng trên bảng lớn.',
        lab_3: 'Sử dụng Recursive CTE để duyệt toàn bộ cây phân cấp danh mục hàng hóa đa cấp.',
        quiz: []
      },
      9: {
        topic: 'Khung Nhìn (Views), Bảng Ảo & Bảo Mật Dữ Liệu Tầng Khung Nhìn',
        theory: `1. Định nghĩa Khung nhìn (View): Bảng ảo không chiếm không gian lưu trữ vật lý (trừ Indexed View/Materialized View).
2. Lợi ích của View: Đơn giản hóa các truy vấn phức tạp, bảo mật dữ liệu bằng cách ẩn các cột nhạy cảm (như mật khẩu, số CCCD, tiền lương).
3. Khung nhìn có thể cập nhật (Updatable Views) và tùy chọn WITH CHECK OPTION.`,
        code_sample: `CREATE VIEW vw_SinhVienKhoaCNTT AS
SELECT MaSV, HoTen, Email, TenLop
FROM SinhVien SV
JOIN LopHoc LH ON SV.MaLop = LH.MaLop
WHERE LH.MaKhoa = 'CNTT'
WITH CHECK OPTION;`,
        pitfalls: 'Chèn dữ liệu qua View phức hợp có nhiều bảng JOIN mà không có Trigger INSTEAD OF sẽ báo lỗi View cannot be modified.',
        lab_1: 'Tạo View ẩn thông tin tiền lương và tài khoản ngân hàng của nhân viên.',
        lab_2: 'Thử nghiệm tính năng WITH CHECK OPTION khi chèn dữ liệu không thỏa mãn điều kiện lọc của View.',
        lab_3: 'Phân tích ưu nhược điểm về hiệu năng giữa View thông thường và Indexed View.',
        quiz: []
      },
      10: {
        topic: 'Lập Trình Cơ Sở Dữ Liệu T-SQL/PL-SQL: Biến, Rẽ Nhánh & Con Trỏ (Cursors)',
        theory: `1. Mở rộng ngôn ngữ thủ tục cho SQL: Khai báo biến (DECLARE), gán giá trị (SET/SELECT).
2. Cấu trúc điều khiển: IF...ELSE, CASE WHEN, WHILE loop.
3. Con trỏ (Cursor): Khai báo, Mở (OPEN), Đọc dòng (FETCH NEXT), Vòng lặp @@FETCH_STATUS, Đóng (CLOSE) và Giải phóng (DEALLOCATE).
4. Nguyên tắc: Hạn chế dùng Cursor trong môi trường sản xuất; ưu tiên xử lý tập hợp (Set-based operations).`,
        code_sample: `DECLARE @MaSV VARCHAR(12), @GPA DECIMAL(4,2);
DECLARE cur_SV CURSOR FOR
    SELECT MaSV, DiemGPA FROM SinhVien;
OPEN cur_SV;
FETCH NEXT FROM cur_SV INTO @MaSV, @GPA;
WHILE @@FETCH_STATUS = 0
BEGIN
    PRINT 'Xu ly sinh vien: ' + @MaSV;
    FETCH NEXT FROM cur_SV INTO @MaSV, @GPA;
END
CLOSE cur_SV;
DEALLOCATE cur_SV;`,
        pitfalls: 'Quên DEALLOCATE Cursor làm chiếm dụng bộ nhớ RAM máy chủ cơ sở dữ liệu và giữ khóa tài nguyên.',
        lab_1: 'Viết khối lệnh T-SQL tính học bổng cho sinh viên xuất sắc bằng vòng lặp và điều kiện IF.',
        lab_2: 'Cài đặt Cursor quét qua danh sách hóa đơn quá hạn để gửi thông báo nhắc nợ.',
        lab_3: 'Viết lại logic của Cursor bằng một câu lệnh UPDATE Set-based duy nhất và đo lường thời gian thực thi.',
        quiz: []
      },
      11: {
        topic: 'Thủ Tục Lưu Trữ (Stored Procedures) & Hàm Người Dùng Định Nghĩa (UDF)',
        theory: `1. Khái niệm Stored Procedure (SP): Khối mã lệnh biên dịch sẵn, lưu trữ trực tiếp trên máy chủ cơ sở dữ liệu.
2. Tham số đầu vào (IN), Tham số đầu ra (OUT/OUTPUT).
3. Hàm người dùng định nghĩa (User Defined Functions - UDF): Hàm trả về giá trị vô hướng (Scalar Function), Hàm trả về bảng (Table-Valued Function).
4. So sánh SP vs UDF: SP có thể thay đổi dữ liệu (INSERT/UPDATE/DELETE), UDF chỉ dùng để tính toán và trả về kết quả trong SELECT.`,
        code_sample: `CREATE PROCEDURE sp_TinhTienLuongThang
    @MaNV VARCHAR(10),
    @Thang INT,
    @Nam INT,
    @TongLuong DECIMAL(14,2) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT @TongLuong = LuongCoBan + PhuCap - KhauTru
    FROM BangLuong
    WHERE MaNV = @MaNV AND Thang = @Thang AND Nam = @Nam;
END;`,
        pitfalls: 'Lạm dụng Scalar UDF trong mệnh đề WHERE của truy vấn triệu dòng sẽ khiến RDBMS gọi hàm từng dòng (Row-by-row / RBAR) làm truy vấn chậm gấp hàng chục lần.',
        lab_1: 'Viết Stored Procedure xử lý đăng ký môn học cho sinh viên có kiểm tra sĩ số tối đa của lớp.',
        lab_2: 'Xây dựng Inline Table-Valued Function trả về bảng điểm chi tiết của sinh viên.',
        lab_3: 'Viết kiểm thử tự động gọi Stored Procedure với các tham số hợp lệ và tham số biên.',
        quiz: []
      },
      12: {
        topic: 'Bộ Kích Hoạt Tự Động (Triggers) & Kiểm Toán Nhật Ký Dữ Liệu (Audit Logging)',
        theory: `1. Khái niệm Trigger: Thủ tục tự động thực thi khi xảy ra sự kiện DML (INSERT, UPDATE, DELETE).
2. Các loại Trigger: AFTER Trigger (chạy sau khi ghi dữ liệu), INSTEAD OF Trigger (chạy thay thế cho câu lệnh gốc).
3. Bảng ảo inserted và deleted: Cơ chế lưu trữ dữ liệu trước và sau khi biến động.
4. Ứng dụng thực tế: Ghi vết nhật ký kiểm toán (Audit Trail), kiểm tra ràng buộc nghiệp vụ phức tạp, đồng bộ dữ liệu đa bảng.`,
        code_sample: `CREATE TRIGGER trg_AuditNhanVienLuong
ON NhanVien
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    IF UPDATE(Luong)
    BEGIN
        INSERT INTO NhanVien_Log(MaNV, LuongCu, LuongMoi, NgayDoi, NguoiDoi)
        SELECT D.MaNV, D.Luong, I.Luong, GETDATE(), SUSER_SNAME()
        FROM deleted D
        JOIN inserted I ON D.MaNV = I.MaNV;
    END
END;`,
        pitfalls: 'Viết Trigger giả định chỉ có 1 dòng được chèn (dùng biến gán từ SELECT inserted) sẽ gây lỗi sai lệch khi người dùng thực hiện Bulk Insert nhiều dòng cùng lúc.',
        lab_1: 'Xây dựng Trigger tự động cập nhật số lượng tồn kho của sản phẩm khi có đơn hàng mới.',
        lab_2: 'Viết INSTEAD OF Trigger để cho phép cập nhật dữ liệu thông qua một View phức tạp gồm 3 bảng.',
        lab_3: 'Kiểm tra cơ chế hoạt động của Trigger khi thực hiện thao tác hoàn tác (ROLLBACK TRANSACTION).',
        quiz: []
      },
      13: {
        topic: 'Cấu Trúc Chỉ Mục (Indexes: B-Tree, Hash) & Tối Ưu Hóa Truy Vấn (Execution Plan)',
        theory: `1. Bản chất của Index: Cấu trúc dữ liệu phụ trợ giúp tăng tốc độ tìm kiếm từ O(N) về O(log N).
2. Phân loại Index:
- Clustered Index: Xác định thứ tự vật lý lưu trữ dữ liệu trên đĩa (mỗi bảng chỉ có 1 Clustered Index).
- Non-Clustered Index: Lưu trữ con trỏ trỏ về bản ghi thực tế, tách biệt với bảng dữ liệu.
- Composite Index (Chỉ mục kết hợp) và quy tắc tiền tố bên trái (Leftmost Prefix Rule).
3. Đọc và phân tích Kế hoạch Thực thi (Execution Plan): Table Scan, Index Scan, Index Seek, Key Lookup.`,
        code_sample: `-- Tạo Clustered Index trên cột khóa chính và Non-Clustered Index hỗ trợ tìm kiếm
CREATE NONCLUSTERED INDEX IX_DonHang_NgayDat_MaKH
ON DonHang (NgayDat DESC, MaKH)
INCLUDE (TongTien);`,
        pitfalls: 'Đánh quá nhiều Index trên bảng thường xuyên INSERT/UPDATE sẽ làm chậm thao tác ghi do DBMS phải cập nhật lại cây Index mỗi lần chèn.',
        lab_1: 'Tạo bảng 1 triệu dòng dữ liệu và so sánh thời gian SELECT trước và sau khi đánh Non-Clustered Index.',
        lab_2: 'Sử dụng lệnh EXPLAIN / Display Estimated Execution Plan để phân tích sự khác nhau giữa Index Scan và Index Seek.',
        lab_3: 'Tối ưu hóa một truy vấn bị nghẽn (Key Lookup) bằng kỹ thuật Covering Index (INCLUDE).',
        quiz: []
      },
      14: {
        topic: 'Quản Lý Giao Dịch (Transactions), 4 Tính Chất ACID & Mức Độ Cô Lập (Isolation)',
        theory: `1. Khái niệm Giao dịch (Transaction): Một đơn vị công việc logic gồm nhiều thao tác được thực hiện trọn vẹn hoặc không thao tác nào được thực hiện.
2. 4 Tính chất ACID: Atomicity (Nguyên tử), Consistency (Nhất quán), Isolation (Cô lập), Durability (Bền vững).
3. Các hiện tượng xung đột dữ liệu đồng thời: Dirty Read (Đọc bẩn), Non-repeatable Read (Đọc không lặp lại), Phantom Read (Đọc bóng ma).
4. 4 Mức độ cô lập chuẩn ANSI SQL: READ UNCOMMITTED, READ COMMITTED, REPEATABLE READ, SERIALIZABLE.`,
        code_sample: `BEGIN TRANSACTION;
BEGIN TRY
    UPDATE TaiKhoan SET SoDu = SoDu - 5000000 WHERE SoTK = 'TK_A';
    UPDATE TaiKhoan SET SoDu = SoDu + 5000000 WHERE SoTK = 'TK_B';
    COMMIT TRANSACTION;
    PRINT 'Chuyen khoan thanh cong!';
END TRY
BEGIN CATCH
    ROLLBACK TRANSACTION;
    PRINT 'Giao dich that bai, da hoan tac!';
END CATCH;`,
        pitfalls: 'Để Transaction mở quá lâu (giữ khóa) trong khi chờ người dùng nhập liệu sẽ gây khóa toàn bộ các truy vấn khác truy cập cùng bảng.',
        lab_1: 'Cài đặt kịch bản chuyển tiền ngân hàng an toàn sử dụng BEGIN TRANSACTION và CATCH ROLLBACK.',
        lab_2: 'Mở 2 cửa sổ kết nối RDBMS để mô phỏng và tái hiện hiện tượng Đọc bẩn (Dirty Read) ở mức READ UNCOMMITTED.',
        lab_3: 'Kiểm tra cơ chế chống đọc bóng ma bằng mức cô lập SERIALIZABLE.',
        quiz: []
      },
      15: {
        topic: 'Khóa Đồng Thời (Concurrency Locking), Deadlock & Sao Lưu/Phục Hồi CSDL',
        theory: `1. Cơ chế khóa: Khóa chia sẻ (Shared Lock - S), Khóa độc quyền (Exclusive Lock - X).
2. Hiện tượng Tắc nghẽn chết (Deadlock): Hai giao dịch cùng chờ khóa của nhau dẫn đến bế tắc vĩnh viễn. Cơ chế Deadlock Detection và Deadlock Victim.
3. Chiến lược Sao lưu & Phục hồi CSDL (Backup & Disaster Recovery):
- Full Backup: Sao lưu toàn bộ cơ sở dữ liệu.
- Differential Backup: Sao lưu các thay đổi kể từ lần Full Backup gần nhất.
- Transaction Log Backup: Sao lưu các bản ghi nhật ký giao dịch phục vụ khôi phục điểm thời gian (Point-in-Time Recovery).`,
        code_sample: `-- Lệnh sao lưu CSDL chuẩn doanh nghiệp
BACKUP DATABASE TechCorpLMS
TO DISK = 'D:\\Backups\\TechCorpLMS_Full.bak'
WITH FORMAT, MEDIANAME = 'TechCorpBackup', NAME = 'Full Backup of TechCorpLMS';`,
        pitfalls: 'Chỉ thực hiện sao lưu mà không bao giờ diễn tập khôi phục (Restore Drill) dẫn đến khi thảm họa xảy ra tệp backup bị hỏng không phục hồi được.',
        lab_1: 'Viết kịch bản T-SQL mô phỏng tình huống Deadlock giữa 2 giao dịch trên 2 bảng khác nhau.',
        lab_2: 'Thực hiện quy trình Full Backup và Differential Backup trên hệ quản trị SQL Server/MySQL.',
        lab_3: 'Mô phỏng sự cố mất dữ liệu và thực hiện khôi phục Point-in-time recovery về trạng thái trước thời điểm xảy ra sự cố.',
        quiz: []
      }
    }
  },
  IT101: {
    code: 'IT101',
    name: 'Nhập môn Lập trình C/C++',
    credits: 4,
    faculty: 'Khoa Công Nghệ Thông Tin',
    language: 'cpp',
    textbook: 'Bjarne Stroustrup (2023), The C++ Programming Language, 4th Edition, Addison-Wesley.',
    weeks: {
      1: {
        topic: 'Cấu Trúc Chương Trình C/C++, Kiểu Dữ Liệu, Biến & Nhập Xuất Chuẩn',
        theory: `1. Tổng quan ngôn ngữ C/C++ và chu trình biên dịch: Mã nguồn (.cpp) -> Tiền xử lý -> Trình biên dịch -> Mã máy -> Trình liên kết -> Tệp thực thi (.exe).
2. Hệ thống kiểu dữ liệu cơ sở: int, float, double, char, bool. Kích thước bộ nhớ sizeof() và giới hạn tràn số.
3. Luồng nhập xuất chuẩn (I/O Streams): std::cout, std::cin, toán tử chèn luồng <<, trích luồng >>, std::endl, thư viện <iomanip>.`,
        code_sample: `#include <iostream>
#include <iomanip>
#include <string>
using namespace std;

int main() {
    string hoTen;
    int tuoi;
    double gpa;
    cout << "Nhap ho ten: ";
    getline(cin, hoTen);
    cout << "Nhap tuoi va GPA: ";
    cin >> tuoi >> gpa;
    cout << fixed << setprecision(2);
    cout << "Sinh vien: " << hoTen << " - " << tuoi << " tuoi - GPA: " << gpa << endl;
    return 0;
}`,
        pitfalls: 'Hiện tượng trôi lệnh khi dùng getline() sau cin >> do ký tự xuống dòng tồn đọng trong bộ đệm (dùng cin.ignore() để khắc phục).',
        lab_1: 'Viết chương trình tính chu vi và diện tích hình tam giác bằng công thức Heron.',
        lab_2: 'Xây dựng ứng dụng chuyển đổi đổi đơn vị tiền tệ và tính thuế thu nhập cá nhân.',
        lab_3: 'Kiểm thử hiện tượng tràn số nguyên khi tính giai thừa của n > 20.',
        quiz: []
      },
      2: { topic: 'Toán Tử, Biểu Thức Logic & Cấu Trúc Điều Khiển Rẽ Nhánh (if-else, switch-case)', theory: 'Toán tử số học, toán tử quan hệ, toán tử logic (&&, ||, !), bảng chân trị và toán tử 3 ngôi. Cú pháp if-else lồng nhau và cấu trúc switch-case.', code_sample: 'switch (diemChu) { case \'A\': cout << "Xuat sac"; break; default: cout << "Trung binh"; }', pitfalls: 'Quên lệnh break trong switch-case gây hiện tượng fall-through.', lab_1: 'Giải phương trình bậc hai ax^2 + bx + c = 0 xét đầy đủ các trường hợp.', lab_2: 'Viết chương trình xếp loại học lực theo quy chế tín chỉ đại học.', lab_3: 'Xây dựng máy tính bỏ túi mini hỗ trợ các phép tính cơ bản.', quiz: [] },
      3: { topic: 'Cấu Trúc Vòng Lặp (for, while, do-while) & Kỹ Thuật Kiểm Soát Lặp', theory: 'Vòng lặp xác định for, vòng lặp không xác định while và do-while. Các câu lệnh điều khiển break, continue, return. Kỹ thuật lặp vô hạn và cách thoát an toàn.', code_sample: 'for (int i = 1; i <= n; ++i) { sum += i; }', pitfalls: 'Quên bước nhảy tăng/giảm biến đếm trong vòng lặp while dẫn đến vòng lặp vô hạn.', lab_1: 'Viết chương trình kiểm tra một số nguyên n có phải số nguyên tố hay không.', lab_2: 'Tìm ước chung lớn nhất (UCLN) và BCNN của hai số bằng thuật toán Euclid.', lab_3: 'In ra màn hình các tam giác sao (Asterisk patterns) vuông và cân.', quiz: [] },
      4: { topic: 'Hàm (Functions), Phạm Vi Biến, Cơ Chế Truyền Tham Trị vs Tham Chiếu', theory: 'Định nghĩa hàm, nguyên mẫu hàm (Prototype), tham số hình thức và tham số thực tế. Phân biệt truyền tham trị (Pass-by-Value) và truyền tham chiếu (Pass-by-Reference &). Phạm vi biến cục bộ (Local), biến toàn cục (Global) và biến tĩnh (static).', code_sample: 'void swapValues(int &a, int &b) { int tmp = a; a = b; b = tmp; }', pitfalls: 'Truyền tham số bằng tham trị khi muốn thay đổi giá trị của biến gốc bên ngoài hàm.', lab_1: 'Xây dựng thư viện các hàm toán học: tính lũy thừa, kiểm tra số chính phương, số hoàn hảo.', lab_2: 'Viết hàm hoán vị 2 số thực sử dụng tham chiếu &.', lab_3: 'Phân tích vòng đời của biến static trong các lần gọi hàm liên tiếp.', quiz: [] },
      5: { topic: 'Kỹ Thuật Đệ Quy (Recursion) & Phân Tích Cây Đệ Quy', theory: 'Nguyên lý đệ quy: Điểm dừng (Base case) và Bước đệ quy (Recursive step). Cơ chế hoạt động của Call Stack bộ nhớ. Hiện tượng tràn ngăn xếp (Stack Overflow). Đệ quy đuôi (Tail Recursion) và kỹ thuật đệ quy có nhớ (Memoization).', code_sample: 'long long fibonacci(int n) { if (n <= 1) return n; return fibonacci(n - 1) + fibonacci(n - 2); }', pitfalls: 'Thiếu điểm dừng đệ quy hoặc điều kiện điểm dừng không bao giờ đạt được gây tràn ngăn xếp (Stack Overflow).', lab_1: 'Cài đặt hàm tính giai thừa n! bằng cả đệ quy và vòng lặp.', lab_2: 'Giải bài toán Tháp Hà Nội (Tower of Hanoi) với n đĩa.', lab_3: 'Cài đặt thuật toán tìm kiếm nhị phân bằng kỹ thuật đệ quy.', quiz: [] },
      6: { topic: 'Mảng Một Chiều (1D Array) & Thuật Toán Tìm Kiếm Cơ Bản', theory: 'Khai báo, khởi tạo và quản lý mảng tĩnh trong bộ nhớ liên tục. Truy xuất phần tử qua chỉ số (Index 0 đến N-1). Thuật toán tìm kiếm tuần tự (Linear Search O(N)) và tìm kiếm nhị phân (Binary Search O(log N)).', code_sample: 'int binarySearch(int arr[], int n, int target) { int left = 0, right = n - 1; while (left <= right) { int mid = left + (right - left) / 2; if (arr[mid] == target) return mid; if (arr[mid] < target) left = mid + 1; else right = mid - 1; } return -1; }', pitfalls: 'Truy cập phần tử vượt quá kích thước mảng (Array Index Out of Bounds) gây lỗi Segmentation Fault hoặc ghi đè bộ nhớ.', lab_1: 'Nhập mảng số nguyên, tìm phần tử lớn nhất, nhỏ nhất và tính giá trị trung bình.', lab_2: 'Cài đặt thuật toán tìm kiếm nhị phân trên mảng đã sắp xếp.', lab_3: 'Xóa phần tử trùng lặp trong mảng và dồn các phần tử còn lại.', quiz: [] },
      7: { topic: 'Thuật Toán Sắp Xếp Cơ Bản: Bubble Sort, Selection Sort, Insertion Sort', theory: 'Khái niệm bài toán sắp xếp và độ phức tạp tính toán O(N^2). Nguyên lý hoạt động của Sắp xếp nổi bọt (Bubble Sort), Sắp xếp chọn (Selection Sort) và Sắp xếp chèn (Insertion Sort). Tính ổn định (Stability) của thuật toán.', code_sample: 'void bubbleSort(int a[], int n) { for (int i = 0; i < n - 1; i++) for (int j = 0; j < n - i - 1; j++) if (a[j] > a[j + 1]) swap(a[j], a[j + 1]); }', pitfalls: 'Không tối ưu thuật toán Bubble Sort bằng cờ hiệu (flag swapped) khi mảng đã sắp xếp xong sớm.', lab_1: 'Cài đặt cả 3 thuật toán sắp xếp và in trạng thái mảng sau mỗi bước hoán đổi.', lab_2: 'Đo lường thời gian thực thi của 3 thuật toán trên bộ dữ liệu 10,000 số ngẫu nhiên.', lab_3: 'Sắp xếp danh sách điểm sinh viên giảm dần bằng Insertion Sort.', quiz: [] },
      8: { topic: 'Chuỗi Ký Tự (C-String & std::string) & Kỹ Thuật Xử Lý Văn Bản', theory: 'Mảng ký tự kiểu C kết thúc bằng ký tự null \'\\0\'. Lớp chuỗi hiện đại std::string trong thư viện chuẩn C++. Các phương thức phổ biến: length(), substr(), find(), replace(), push_back().', code_sample: 'string s = "TechCorp University"; string sub = s.substr(0, 8);', pitfalls: 'Dùng toán tử == để so sánh hai chuỗi char* C-String (so sánh địa chỉ con trỏ thay vì nội dung chuỗi; phải dùng strcmp).', lab_1: 'Viết chương trình kiểm tra chuỗi đối xứng (Palindrome).', lab_2: 'Chuẩn hóa họ tên: Xóa khoảng trắng thừa và viết hoa chữ cái đầu mỗi từ.', lab_3: 'Đếm số lần xuất hiện của từng từ trong một đoạn văn bản.', quiz: [] },
      9: { topic: 'Con Trỏ (Pointers) và Cấp Phát Bộ Nhớ Động Trên Heap (new / delete)', theory: 'Khái niệm địa chỉ ô nhớ RAM, toán tử lấy địa chỉ &, toán tử giải tham chiếu *. Con trỏ void*, con trỏ NULL và nullptr. Phân vùng bộ nhớ Stack vs Heap. Toán tử cấp phát động new, new[] và thu hồi delete, delete[]. Lỗi rò rỉ bộ nhớ (Memory Leak) và con trỏ lơ lửng (Dangling Pointer).', code_sample: 'int* arr = new int[100]; // Cap phat tren Heap\nfor (int i = 0; i < 100; i++) arr[i] = i * 2;\ndelete[] arr; // Thu hoi bat buoc\narr = nullptr;', pitfalls: 'Quên giải phóng bộ nhớ bằng delete[] hoặc giải phóng 2 lần (Double Free) gây crash chương trình.', lab_1: 'Viết hàm hoán đổi 2 số sử dụng con trỏ.', lab_2: 'Cấp phát mảng động theo kích thước người dùng nhập vào và tìm giá trị lớn nhất.', lab_3: 'Sử dụng công cụ kiểm tra bộ nhớ để phát hiện và sửa lỗi Memory Leak.', quiz: [] },
      10: { topic: 'Mảng Hai Chiều (2D Array), Ma Trận & Con Trỏ Đa Cấp', theory: 'Khái niệm mảng 2 chiều, cách tổ chức lưu trữ Row-Major trong bộ nhớ. Cấp phát mảng động 2 chiều bằng con trỏ cấp hai (int**). Các phép toán ma trận: Cộng ma trận, nhân ma trận, tìm ma trận chuyển vị.', code_sample: 'int** matrix = new int*[rows];\nfor (int i = 0; i < rows; ++i) matrix[i] = new int[cols];', pitfalls: 'Thu hồi mảng 2 chiều động quên thu hồi từng dòng bên trong trước khi thu hồi mảng con trỏ ngoài cùng.', lab_1: 'Nhập xuất ma trận số thực kích thước M x N.', lab_2: 'Thực hiện phép nhân hai ma trận A(m x k) và B(k x n).', lab_3: 'Kiểm tra xem ma trận vuông có phải ma trận đối xứng hay không.', quiz: [] },
      11: { topic: 'Kiểu Dữ Liệu Cấu Trúc (struct) & Tổ Chức Dữ Liệu Bản Ghi', theory: 'Khái niệm struct trong C++, gom nhóm nhiều thuộc tính có kiểu dữ liệu khác nhau. Khai báo biến struct, truy xuất thuộc tính qua toán tử chấm . hoặc toán tử mũi tên ->. Mảng các cấu trúc và truyền struct vào hàm.', code_sample: 'struct SinhVien {\n    string maSV;\n    string hoTen;\n    double diemTB;\n};\nSinhVien sv = {"SV01", "Tran Nam", 8.5};', pitfalls: 'Sao chép nông (Shallow Copy) struct chứa con trỏ cấp phát động dẫn đến lỗi Double Free khi hủy.', lab_1: 'Định nghĩa struct SinhVien và viết các hàm nhập, xuất danh sách sinh viên.', lab_2: 'Sắp xếp danh sách sinh viên giảm dần theo điểm trung bình.', lab_3: 'Tìm kiếm sinh viên theo mã số sinh viên trong danh sách.', quiz: [] },
      12: { topic: 'Quản Lý Tệp Tin (File I/O): Đọc/Ghi Tệp Văn Bản và Tệp Nhị Phân', theory: 'Thư viện <fstream>, luồng đọc ifstream, luồng ghi ofstream. Chế độ mở tệp: ios::in, ios::out, ios::app, ios::binary. Đọc ghi tệp văn bản tuần tự và đọc ghi khối dữ liệu nhị phân với read() / write().', code_sample: 'ofstream outFile("data.txt");\noutFile << "TechCorp LMS" << endl;\noutFile.close();', pitfalls: 'Quên kiểm tra tệp tin có mở thành công hay không (if (!file.is_open())) trước khi đọc ghi.', lab_1: 'Viết chương trình đọc danh sách điểm thi từ tệp CSV và tính điểm trung bình môn.', lab_2: 'Lưu trữ toàn bộ danh bạ điện thoại xuống tệp tin nhị phân và đọc lại khi khởi động.', lab_3: 'Xây dựng chương trình sao chép tệp tin nhị phân (File Copy Utility).', quiz: [] },
      13: { topic: 'Thư Viện Chuẩn C++ (Standard Template Library - STL): Vector, Pair & Algorithm', theory: 'Tổng quan kiến trúc STL: Containers, Iterators, Algorithms. Mảng động std::vector: push_back(), pop_back(), size(), clear(). Kiểu ghép đôi std::pair. Các thuật toán trong <algorithm>: std::sort, std::find, std::reverse, std::binary_search.', code_sample: '#include <vector>\n#include <algorithm>\nvector<int> v = {5, 2, 8, 1};\nsort(v.begin(), v.end());', pitfalls: 'Sử dụng iterator đã bị mất hiệu lực (Iterator Invalidation) sau khi thực hiện thao tác chèn/xóa phần tử trong vector.', lab_1: 'Thay thế mảng tĩnh bằng std::vector trong chương trình quản lý điểm học sinh.', lab_2: 'Sử dụng std::sort kết hợp biểu thức Lambda để sắp xếp danh sách theo nhiều tiêu chí.', lab_3: 'Đếm tần suất xuất hiện của các phần tử bằng STL vector và pair.', quiz: [] },
      14: { topic: 'Giới Thiệu Lập Trình Hướng Đối Tượng (OOP): Lớp (Class), Đóng Gói & Phương Thức', theory: 'Sự khác biệt giữa lập trình thủ tục và lập trình hướng đối tượng. Khái niệm Lớp (Class) và Đối tượng (Object). Tính đóng gói (Encapsulation) và phạm vi truy cập: private, public, protected. Hàm khởi tạo (Constructor) và hàm hủy (Destructor).', code_sample: 'class HinhChuNhat {\nprivate:\n    double dai, rong;\npublic:\n    HinhChuNhat(double d, double r) : dai(d), rong(r) {}\n    double tinhDienTich() const { return dai * rong; }\n};', pitfalls: 'Để tất cả thuộc tính ở phạm vi public vi phạm nguyên lý đóng gói dữ liệu của OOP.', lab_1: 'Xây dựng lớp PhanSo gồm tử số, mẫu số và các phương thức cộng, trừ, nhân, chia, rút gọn.', lab_2: 'Thiết kế lớp TaiKhoanNganHang có các phương thức nạp tiền, rút tiền và kiểm tra số dư an toàn.', lab_3: 'Cài đặt hàm khởi tạo có tham số và hàm hủy tự động giải phóng tài nguyên.', quiz: [] },
      15: { topic: 'Đóng Gói Dự Án Cuối Kỳ: Clean Code, Debugging & Kiểm Thử Phòng Rò Rỉ RAM', theory: 'Các nguyên tắc viết mã sạch (Clean Code Conventions). Kỹ thuật gỡ lỗi (Debugging): Đặt Breakpoint, theo dõi biến (Watch), Step Over / Step Into. Phát hiện và xử lý lỗi bộ nhớ với Valgrind hoặc AddressSanitizer. Chuẩn bị hồ sơ nghiệm thu bài tập lớn chuẩn AUN-QA.', code_sample: '// Chuẩn Clean Code C++\nint calculateTotalScore(const vector<int>& scores) {\n    int total = 0;\n    for (int score : scores) total += score;\n    return total;\n}', pitfalls: 'Bỏ qua việc kiểm thử các trường hợp dữ liệu rỗng hoặc số âm ở đầu vào.', lab_1: 'Refactor toàn bộ dự án bài tập lớn tuân thủ quy chuẩn đặt tên và chia tách file header (.h) / source (.cpp).', lab_2: 'Thực hiện Debug từng bước để xác định lỗi crash trong một chương trình mẫu.', lab_3: 'Chạy kiểm thử Valgrind để chứng minh dự án đạt 0 byte rò rỉ bộ nhớ (Zero Memory Leaks).', quiz: [] }
    }
  },
  IT301: {
    code: 'IT301',
    name: 'Cấu trúc Dữ liệu & Giải thuật',
    credits: 4,
    faculty: 'Khoa Công Nghệ Thông Tin',
    language: 'cpp',
    textbook: 'Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein (2022), Introduction to Algorithms, 4th Edition, MIT Press.',
    weeks: {
      1: { topic: 'Đánh Giá Độ Phức Tạp Giải Thuật: Ký Hiệu Big-O, Big-Omega, Big-Theta', theory: 'Khái niệm tài nguyên tính toán (Thời gian và Bộ nhớ). Phân tích tiệm cận (Asymptotic Analysis): Ký hiệu Big-O (cận trên), Big-Omega (cận dưới), Big-Theta (cận chặt). Các cấp độ phức tạp phổ biến: O(1), O(log N), O(N), O(N log N), O(N^2), O(2^N).', code_sample: '// Thuat toan O(log N)\nint binarySearch(int arr[], int n, int x) {}', pitfalls: 'Nhầm lẫn giữa độ phức tạp thời gian trường hợp xấu nhất (Worst-case) và trường hợp trung bình (Average-case).', lab_1: 'Phân tích độ phức tạp thời gian của 5 đoạn mã nguồn mẫu.', lab_2: 'Đo lường thời gian thực thi thực tế bằng thư viện <chrono> và vẽ biểu đồ so sánh.', lab_3: 'Tối ưu hóa một thuật toán O(N^2) về O(N log N).', quiz: [] },
      2: { topic: 'Danh Sách Đặc (Array-based List) & Danh Sách Liên Kết Đơn (Singly Linked List)', theory: 'Khái niệm Node, con trỏ next, con trỏ Head. Thao tác chèn/xóa ở đầu, cuối và vị trí bất kỳ. So sánh chi phí thời gian giữa Mảng và Danh sách liên kết.', code_sample: 'struct Node {\n    int data;\n    Node* next;\n    Node(int val) : data(val), next(nullptr) {}\n};', pitfalls: 'Quên cập nhật con trỏ Head khi xóa phần tử đầu danh sách làm mất toàn bộ liên kết.', lab_1: 'Cài đặt cấu trúc Singly Linked List hoàn chỉnh từ đầu.', lab_2: 'Viết hàm đảo ngược danh sách liên kết đơn (Reverse Linked List) trong O(N).', lab_3: 'Tìm phần tử chính giữa (Middle Node) của danh sách liên kết bằng kỹ thuật 2 con trỏ.', quiz: [] },
      3: { topic: 'Danh Sách Liên Kết Đôi (Doubly Linked List) & Danh Sách Vòng (Circular List)', theory: 'Cấu trúc Node hai chiều (con trỏ prev và next), con trỏ Head và Tail. Danh sách liên kết vòng (Circular Linked List) và bài toán Josephus Problem.', code_sample: 'struct DNode {\n    int data;\n    DNode* prev;\n    DNode* next;\n};', pitfalls: 'Quên cập nhật con trỏ prev khi chèn hoặc xóa Node giữa danh sách đôi.', lab_1: 'Cài đặt Doubly Linked List hỗ trợ duyệt xuôi và duyệt ngược.', lab_2: 'Giải bài toán đếm vòng tròn Josephus bằng Circular Linked List.', lab_3: 'Xây dựng cấu trúc danh sách liên kết đôi ứng dụng cho bộ đệm phát nhạc Playlist.', quiz: [] },
      4: { topic: 'Ngăn Xếp (Stack): Cài Đặt, Nguyên Lý LIFO & Ứng Dụng Đổi Dấu Ngoặc / Biểu Thức Ba Lan', theory: 'Nguyên lý LIFO (Last In First Out). Các thao tác push(), pop(), top(), empty(). Cài đặt Stack bằng mảng và danh sách liên kết. Ứng dụng kiểm tra tính hợp lệ của dấu ngoặc và chuyển đổi biểu thức Trung tố sang Hậu tố (Infix to Postfix).', code_sample: 'stack<char> st;\nst.push(\'(\');\nst.pop();', pitfalls: 'Gọi lệnh pop() hoặc top() khi Stack đang rỗng gây lỗi Segmentation Fault.', lab_1: 'Cài đặt Stack bằng mảng động và kiểm tra tràn mảng.', lab_2: 'Viết chương trình kiểm tra ngoặc hợp lệ trong biểu thức toán học.', lab_3: 'Cài đặt thuật toán Shunting-Yard tính giá trị biểu thức Hậu tố (Postfix Evaluation).', quiz: [] },
      5: { topic: 'Hàng Đợi (Queue) & Hàng Đợi Hai Đầu (Deque): Nguyên Lý FIFO & Bộ Đệm Dữ Liệu', theory: 'Nguyên lý FIFO (First In First Out). Các thao tác enqueue(), dequeue(), front(), rear(). Cài đặt Hàng đợi vòng (Circular Queue) để khắc phục lãng phí bộ nhớ. Giới thiệu Deque (Double-ended Queue).', code_sample: 'queue<int> q;\nq.push(10);\nq.pop();', pitfalls: 'Hiện tượng tràn giả trong Queue mảng tuyến tính khi front và rear cùng trôi về cuối mảng.', lab_1: 'Cài đặt Circular Queue bằng mảng với dung lượng cố định.', lab_2: 'Mô phỏng hệ thống hàng đợi phục vụ khách hàng tại quầy giao dịch ngân hàng.', lab_3: 'Sử dụng Deque để giải bài toán tìm giá trị lớn nhất trong cửa sổ trượt (Sliding Window Maximum).', quiz: [] },
      6: { topic: 'Thuật Toán Sắp Xếp Nâng Cao: Merge Sort, Quick Sort & Phân Tích Chia Để Trị', theory: 'Kỹ thuật Chia để trị (Divide and Conquer). Sắp xếp trộn (Merge Sort): Đệ quy phân rã và thao tác trộn 2 mảng O(N log N) đảm bảo ổn định. Sắp xếp nhanh (Quick Sort): Chọn chốt (Pivot), phân hoạch Lomuto/Hoare, phân tích trường hợp tốt nhất và xấu nhất.', code_sample: 'void mergeSort(int a[], int l, int r) {}', pitfalls: 'Chọn Pivot trong Quick Sort rơi vào phần tử nhỏ nhất/lớn nhất trên mảng đã sắp xếp khiến độ phức tạp thoái hóa thành O(N^2).', lab_1: 'Cài đặt thuật toán Merge Sort không dùng đệ quy.', lab_2: 'Cài đặt Quick Sort với kỹ thuật chọn Pivot ngẫu nhiên (Randomized Pivot).', lab_3: 'So sánh tốc độ sắp xếp giữa Merge Sort, Quick Sort và std::sort trên 1 triệu phần tử.', quiz: [] },
      7: { topic: 'Cây Nhị Phân (Binary Tree) & Các Phép Duyệt Cây (Preorder, Inorder, Postorder)', theory: 'Định nghĩa cây, gốc (Root), nút lá (Leaf), độ sâu, chiều cao. Cây nhị phân và cây nhị phân đầy đủ. 3 phép duyệt theo chiều sâu DFS: Tiền thứ tự (NLR), Trung thứ tự (LNR), Hậu thứ tự (LRN). Duyệt theo tầng BFS (Level-order).', code_sample: 'struct TreeNode {\n    int val;\n    TreeNode* left;\n    TreeNode* right;\n};', pitfalls: 'Không kiểm tra điều kiện nút NULL trước khi truy xuất con trỏ left hoặc right.', lab_1: 'Cài đặt cây nhị phân và thực hiện 3 phép duyệt cây bằng đệ quy.', lab_2: 'Cài đặt phép duyệt cây theo tầng sử dụng Hàng đợi Queue.', lab_3: 'Tính chiều cao và đếm số lượng nút lá của cây nhị phân.', quiz: [] },
      8: { topic: 'Cây Tìm Kiếm Nhị Phân (Binary Search Tree - BST): Thêm, Xóa, Tìm Kiếm O(log N)', theory: 'Tính chất BST: Mọi nút con bên trái < nút gốc < mọi nút con bên phải. Thuật toán tìm kiếm O(h), thêm nút mới. Thuật toán xóa nút trong BST (xử lý 3 trường hợp: nút lá, nút có 1 con, nút có 2 con bằng nút thế mạng Inorder Successor).', code_sample: 'TreeNode* insertBST(TreeNode* root, int val) {}', pitfalls: 'Khi chèn các phần tử theo thứ tự tăng dần vào BST làm cây bị lệch hoàn toàn thành danh sách liên kết, tốc độ thoái hóa về O(N).', lab_1: 'Cài đặt đầy đủ các thao tác Search, Insert, Delete trên cây BST.', lab_2: 'Tìm nút có giá trị nhỏ nhất và lớn nhất trong cây BST.', lab_3: 'Kiểm tra xem một cây nhị phân cho trước có thỏa mãn tính chất BST hay không.', quiz: [] },
      9: { topic: 'Cây Tự Cân Bằng: Cây AVL (Phép Quay Đơn, Quay Kép) & Cây Đỏ - Đen (Red-Black Tree)', theory: 'Hệ số cân bằng (Balance Factor = Height(L) - Height(R)). 4 trường hợp mất cân bằng và kỹ thuật quay cây: Quay trái (LL), Quay phải (RR), Quay trái-phải (LR), Quay phải-trái (RL). Giới thiệu Cây Đỏ - Đen và ứng dụng trong std::map / std::set của C++ STL.', code_sample: 'Node* rotateRight(Node* y) {}', pitfalls: 'Tính toán sai chiều cao sau khi quay cây dẫn đến hệ số cân bằng bị tính lệch.', lab_1: 'Cài đặt thao tác chèn và tự cân bằng trên cây AVL.', lab_2: 'Vẽ cây AVL sau từng bước chèn các giá trị từ 1 đến 10.', lab_3: 'So sánh số phép quay cây giữa cây AVL và cây Đỏ - Đen khi chèn lượng lớn dữ liệu.', quiz: [] },
      10: { topic: 'Hàng Đợi Ưu Tiên (Priority Queue) & Cấu Trúc Heap (Min-Heap, Max-Heap, HeapSort)', theory: 'Định nghĩa cây nhị phân gần hoàn chỉnh (Complete Binary Tree) và biểu diễn bằng mảng. Tính chất Max-Heap và Min-Heap. Các thao tác Heapify, Push (Sift-up), Pop (Sift-down). Thuật toán HeapSort O(N log N) không dùng bộ nhớ phụ.', code_sample: 'priority_queue<int> pq; // Max-heap STL', pitfalls: 'Nhầm lẫn công thức chỉ số cha con trên mảng (Gốc ở chỉ số 0: Con trái = 2*i + 1, Con phải = 2*i + 2).', lab_1: 'Cài đặt cấu trúc Min-Heap bằng mảng động từ đầu.', lab_2: 'Cài đặt thuật toán sắp xếp HeapSort.', lab_3: 'Sử dụng Priority Queue để giải bài toán tìm K phần tử lớn nhất trong luồng dữ liệu.', quiz: [] },
      11: { topic: 'Bảng Băm (Hash Table), Hàm Băm & Kỹ Thuật Xử Lý Đụng Độ (Collision Resolution)', theory: 'Nguyên lý Bảng băm: Ánh xạ khóa thành chỉ số mảng bằng hàm băm (Hash Function). Hiện tượng đụng độ băm (Collision). Hai kỹ thuật giải quyết đụng độ chính: Nối kết riêng (Separate Chaining) và Địa chỉ mở (Open Addressing: Linear Probing, Quadratic Probing, Double Hashing). Hệ số tải (Load Factor).', code_sample: 'unordered_map<string, int> hashMap;', pitfalls: 'Hàm băm phân bổ không đều dẫn đến tất cả phần tử rơi vào cùng một khe (Bucket), độ phức tạp thoái hóa từ O(1) về O(N).', lab_1: 'Xây dựng Bảng băm xử lý đụng độ bằng phương pháp Separate Chaining.', lab_2: 'Cài đặt phương pháp Linear Probing và cơ chế tái tạo bảng băm (Rehashing) khi hệ số tải vượt quá 0.7.', lab_3: 'Ứng dụng Bảng băm để đếm số lần xuất hiện của các từ trong một cuốn sách.', quiz: [] },
      12: { topic: 'Biểu Diễn Đồ Thị (Ma Trận Kề, Danh Sách Kề) & Thuật Toán Duyệt (BFS, DFS)', theory: 'Khái niệm đồ thị có hướng, vô hướng, có trọng số. Biểu diễn đồ thị bằng Ma trận kề (Adjacency Matrix) và Danh sách kề (Adjacency List). Thuật toán duyệt theo chiều rộng (BFS - dùng Queue) và duyệt theo chiều sâu (DFS - dùng Stack / đệ quy). Kiểm tra tính liên thông.', code_sample: 'vector<vector<int>> adjList;\nvoid bfs(int startNode) {}', pitfalls: 'Quên mảng đánh dấu nút đã thăm (visited[]) dẫn đến duyệt lặp vô hạn khi đồ thị có chu trình.', lab_1: 'Cài đặt chuyển đổi qua lại giữa Ma trận kề và Danh sách kề.', lab_2: 'Cài đặt thuật toán BFS tìm đường đi ngắn nhất không trọng số giữa 2 đỉnh.', lab_3: 'Sử dụng DFS để đếm số thành phần liên thông trong đồ thị.', quiz: [] },
      13: { topic: 'Đường Đi Ngắn Nhất Trên Đồ Thị: Thuật Toán Dijkstra & Bellman-Ford', theory: 'Bài toán tìm đường đi ngắn nhất từ một nguồn (Single-Source Shortest Path). Thuật toán tham lam Dijkstra trên đồ thị trọng số không âm kết hợp Min-Heap O((V + E) log V). Thuật toán Bellman-Ford xử lý trọng số âm và phát hiện chu trình âm.', code_sample: 'void dijkstra(int start, vector<vector<pair<int,int>>>& adj) {}', pitfalls: 'Áp dụng thuật toán Dijkstra trên đồ thị có cạnh mang trọng số âm dẫn đến kết quả sai lệch.', lab_1: 'Cài đặt thuật toán Dijkstra tìm đường đi ngắn nhất trên bản đồ giao thông.', lab_2: 'Cài đặt thuật toán Bellman-Ford và phát hiện chu trình âm.', lab_3: 'Ứng dụng thuật toán tìm đường đi ngắn nhất trong trò chơi điều hướng mê cung.', quiz: [] },
      14: { topic: 'Cây Khung Nhỏ Nhất (Minimum Spanning Tree): Thuật Toán Kruskal & Prim', theory: 'Định nghĩa cây khung của đồ thị vô hướng liên thông. Cây khung có tổng trọng số cạnh nhỏ nhất (MST). Thuật toán Kruskal sắp xếp cạnh và dùng cấu trúc tập hợp rời rạc Disjoint Set Union (DSU / Union-Find). Thuật toán Prim phát triển cây từ một đỉnh ban đầu.', code_sample: 'struct Edge { int u, v, weight; };', pitfalls: 'Cài đặt DSU không áp dụng nén đường đi (Path Compression) và gộp theo hạng (Union by Rank) làm DSU chạy chậm.', lab_1: 'Cài đặt cấu trúc dữ liệu DSU có nén đường đi hoàn chỉnh.', lab_2: 'Cài đặt thuật toán Kruskal tìm cây khung nhỏ nhất.', lab_3: 'Giải bài toán thiết kế mạng lưới đường ống cấp nước đô thị với chi phí thấp nhất bằng MST.', quiz: [] },
      15: { topic: 'Quy Hoạch Động (Dynamic Programming) & Bài Toán Tối Ưu Tổ Hợp (Knapsack, LCS)', theory: 'Bản chất Quy hoạch động (DP): Bài toán con gối nhau (Overlapping Subproblems) và Cấu trúc con tối ưu (Optimal Substructure). Tiếp cận Top-down (Memoization) vs Bottom-up (Tabulation). Các bài toán kinh điển: Balo 0/1 (0/1 Knapsack), Dãy con chung dài nhất (LCS), Dãy con tăng dài nhất (LIS).', code_sample: 'int dp[1005][1005]; // Bang quy hoach dong', pitfalls: 'Xác định sai trạng thái DP hoặc không khởi tạo đúng giá trị cơ sở ban đầu.', lab_1: 'Giải bài toán Cái Ba Lô 0/1 bằng bảng phương án Quy hoạch động.', lab_2: 'Tìm chuỗi con chung dài nhất (LCS) giữa 2 đoạn mã DNA.', lab_3: 'Tối ưu không gian lưu trữ của bảng DP từ 2 chiều về 1 chiều.', quiz: [] }
    }
  },
  IT401: {
    code: 'IT401',
    name: 'Công nghệ Phần mềm & Agile',
    credits: 3,
    faculty: 'Khoa Công Nghệ Thông Tin',
    language: 'markdown',
    textbook: 'Roger S. Pressman, Bruce R. Maxim (2020), Software Engineering: A Practitioner\'s Approach, 9th Edition, McGraw-Hill.',
    weeks: {
      1: { topic: 'Tổng Quan Kỹ Nghệ Phần Mềm, Vòng Đời Phần Mềm (SDLC) & Mô Hình Waterfall vs Agile', theory: 'Khái niệm Kỹ nghệ phần mềm, chất lượng phần mềm theo ISO 25010. Các giai đoạn trong SDLC: Khảo sát yêu cầu, Phân tích, Thiết kế, Cài đặt, Kiểm thử, Triển khai và Bảo trì. So sánh mô hình Thác nước (Waterfall) và Triết lý Phát triển Linh hoạt (Agile Manifesto).', code_sample: '# Agile Manifesto: Cá nhân và tương tác > Quy trình và công cụ', pitfalls: 'Áp dụng mô hình Waterfall cho các dự án khởi nghiệp có yêu cầu thay đổi liên tục dẫn đến sản phẩm lỗi thời khi ra mắt.', lab_1: 'Phân tích tình huống dự án phần mềm thất bại và xác định nguyên nhân do sai lệch quy trình.', lab_2: 'Lập ma trận so sánh ưu nhược điểm giữa Waterfall, Spiral và Agile Scrum.', lab_3: 'Trình bày 12 nguyên tắc cốt lõi của Tuyên ngôn Agile.', quiz: [] },
      2: { topic: 'Khung Làm Việc Scrum: Vai Trò, Sự Kiện & Các Tạo Tác (Scrum Framework)', theory: '3 Vai trò cốt lõi trong Scrum: Product Owner (PO), Scrum Master (SM), Development Team. 5 Sự kiện Scrum: Sprint, Sprint Planning, Daily Scrum (15 phút), Sprint Review, Sprint Retrospective. 3 Tạo tác: Product Backlog, Sprint Backlog, Khái niệm Hoàn thành (Definition of Done - DoD).', code_sample: '// Scrum Sprint Cycle: 2 - 4 Weeks', pitfalls: 'Daily Scrum biến thành buổi báo cáo công việc cho quản lý thay vì cuộc thảo luận tháo gỡ trở ngại giữa các thành viên.', lab_1: 'Thiết lập bảng quản lý công việc Jira/Trello cho một Sprint 2 tuần.', lab_2: 'Đóng vai PO, Scrum Master và Dev Team thực hiện một buổi Sprint Planning mẫu.', lab_3: 'Biên soạn tài liệu Định nghĩa Hoàn thành (DoD) cho dự án phần mềm Web.', quiz: [] },
      3: { topic: 'Thu Thập & Quản Lý Yêu Cầu Phần Mềm: User Story & Acceptance Criteria', theory: 'Phân biệt Yêu cầu chức năng (Functional Requirements) và Yêu cầu phi chức năng (Non-Functional Requirements). Cấu trúc chuẩn của một User Story: As a [User], I want [Action], So that [Value]. Tiêu chí chấp nhận chuẩn Given-When-Then (Acceptance Criteria). Quy tắc INVEST để đánh giá User Story tốt.', code_sample: 'Scenario: Đăng nhập thành công\nGiven Người dùng ở trang đăng nhập\nWhen Nhập đúng email và mật khẩu\nThen Chuyển hướng về Dashboard', pitfalls: 'Viết User Story quá lớn (Epic) mà không phân rã nhỏ khiến không thể hoàn thành trong 1 Sprint.', lab_1: 'Viết 10 User Story kèm Acceptance Criteria cho hệ thống Quản lý học tập LMS.', lab_2: 'Áp dụng bộ tiêu chí INVEST để đánh giá và chỉnh sửa các User Story bị lỗi.', lab_3: 'Tổ chức phiên Product Backlog Refinement để làm mịn và ước lượng độ ưu tiên yêu cầu.', quiz: [] },
      4: { topic: 'Phân Tích Yêu Cầu: Biểu Đồ Use Case & Đặc Tả Kịch Bản Chuẩn Cockburn', theory: 'Ngôn ngữ mô hình hóa thống nhất UML. Biểu đồ Use Case: Tác nhân (Actor), Ca sử dụng (Use Case), Quan hệ <<include>>, <<extend>>, Generalization. Mẫu đặc tả Use Case chi tiết chuẩn Alistair Cockburn: Luồng sự kiện chính (Main Flow), Luồng sự kiện rẽ nhánh (Alternative Flow), Ngoại lệ (Exception Flow).', code_sample: 'usecase UC_DangKyThi as "Đăng Ký Ca Thi"\nActor SinhVien\nSinhVien --> UC_DangKyThi', pitfalls: 'Lạm dụng quan hệ <<extend>> và <<include>> biến biểu đồ Use Case thành lưu đồ thuật toán phân rã chức năng.', lab_1: 'Vẽ biểu đồ Use Case tổng thể cho hệ thống Đăng ký học tín chỉ trực tuyến.', lab_2: 'Viết văn bản đặc tả chi tiết cho Use Case "Nộp bài thi trắc nghiệm trực tuyến".', lab_3: 'Kiểm tra tính nhất quán giữa biểu đồ Use Case và danh sách User Story.', quiz: [] },
      5: { topic: 'Thiết Kế Kiến Trúc Phần Mềm: Kiến Trúc N-Tier, Microservices & Event-Driven', theory: 'Vai trò của kiến trúc phần mềm trong việc đảm bảo khả năng mở rộng (Scalability) và bảo trì (Maintainability). Kiến trúc 3 tầng (Presentation, Business Logic, Data Access). Kiến trúc vi dịch vụ (Microservices Architecture), API Gateway, Service Discovery. Kiến trúc hướng sự kiện (Event-Driven Architecture) với Kafka / RabbitMQ.', code_sample: '// Microservices Architecture Pattern\nClient -> API Gateway -> Auth / Course / Exam Services', pitfalls: 'Áp dụng Microservices quá sớm cho hệ thống nhỏ làm tăng độ phức tạp vận hành mạng mà không mang lại lợi ích.', lab_1: 'Vẽ sơ đồ kiến trúc hệ thống 3-Tier cho ứng dụng Web LMS TechCorp.', lab_2: 'So sánh ưu nhược điểm giữa Kiến trúc Đơn khối (Monolith) và Kiến trúc Vi dịch vụ (Microservices).', lab_3: 'Thiết kế giải pháp giao tiếp bất đồng bộ giữa dịch vụ Nộp bài thi và dịch vụ Chấm điểm.', quiz: [] },
      6: { topic: 'Thiết Kế Hướng Đối Tượng Với UML: Biểu Đồ Lớp (Class) & Biểu Đồ Tuần Tự (Sequence)', theory: 'Biểu đồ Lớp (Class Diagram): Thuộc tính, phương thức, quan hệ Association, Aggregation, Composition, Inheritance, Dependency. Biểu đồ Tuần tự (Sequence Diagram): Lifeline, Message đồng bộ/bất đồng bộ, Activation Bar, cấu trúc alt/loop.', code_sample: 'class Diagram: Course "1" *-- "many" Lesson', pitfalls: 'Nhầm lẫn giữa quan hệ Hợp thành (Composition - xóa cha xóa con) và Thu nạp (Aggregation - cha con tồn tại độc lập).', lab_1: 'Thiết kế Class Diagram cho module Quản lý bài thi và câu hỏi.', lab_2: 'Vẽ Sequence Diagram mô tả chi tiết quy trình xử lý thanh toán học phí qua cổng ngân hàng.', lab_3: 'Tạo mã nguồn khung (Skeleton Code) từ Class Diagram đã thiết kế.', quiz: [] },
      7: { topic: 'Nguyên Lý Thiết Kế Phần Mềm Hướng Đối Tượng SOLID & GRASP', theory: '5 Nguyên lý SOLID: Single Responsibility (S), Open/Closed (O), Liskov Substitution (L), Interface Segregation (I), Dependency Inversion (D). Các nguyên lý phân bổ trách nhiệm GRASP (Controller, Creator, Information Expert, Low Coupling, High Cohesion).', code_sample: '// Dependency Inversion: Phu thuoc vao Abstraction\ninterface IExamRepository { save(exam); }\nclass ExamService { constructor(private repo: IExamRepository) {} }', pitfalls: 'Vi phạm Single Responsibility Principle bằng cách tạo các "God Class" ôm đồm xử lý từ giao diện, tính toán đến ghi CSDL.', lab_1: 'Phát hiện các điểm vi phạm nguyên lý SOLID trong một đoạn mã nguồn cho trước.', lab_2: 'Refactor mã nguồn áp dụng Dependency Inversion Principle và kỹ thuật Dependency Injection.', lab_3: 'Giải thích tại sao áp dụng Open/Closed Principle giúp thêm tính năng mới mà không sợ làm hỏng mã nguồn cũ.', quiz: [] },
      8: { topic: 'Các Mẫu Thiết Kế Hướng Đối Tượng (Design Patterns): Creational & Structural', theory: 'Khái niệm Design Pattern của Gang of Four (GoF). Nhóm Creational: Singleton (khởi tạo duy nhất), Factory Method, Abstract Factory, Builder. Nhóm Structural: Adapter (chuyển đổi giao diện), Decorator (bổ sung tính năng động), Facade (giao diện đơn giản hóa).', code_sample: 'class DatabaseConnection {\n    private static instance;\n    static getInstance() { if (!instance) instance = new DatabaseConnection(); return instance; }\n}', pitfalls: 'Lạm dụng mẫu Singleton dẫn đến tạo ra trạng thái toàn cục ẩn (Hidden Global State), gây khó khăn cho việc viết Unit Test.', lab_1: 'Cài đặt mẫu thiết kế Singleton thread-safe để quản lý kết nối CSDL.', lab_2: 'Áp dụng mẫu Factory Method để tạo các định dạng xuất báo cáo (PDF, Excel, Word).', lab_3: 'Sử dụng Decorator Pattern để thêm tính năng mã hóa và nén dữ liệu cho luồng truyền tải.', quiz: [] },
      9: { topic: 'Các Mẫu Thiết Kế Hành Vi (Behavioral Patterns): Observer, Strategy & State', theory: 'Nhóm Behavioral: Observer (mô hình phát hành - đăng ký Publisher/Subscriber), Strategy (đóng gói các thuật toán hoán đổi linh hoạt), State (thay đổi hành vi theo trạng thái đối tượng), Command.', code_sample: 'interface PaymentStrategy { pay(amount: number): boolean; }\nclass MomoPayment implements PaymentStrategy {}', pitfalls: 'Không quản lý hủy đăng ký (Unsubscribe) trong Observer Pattern dẫn đến rò rỉ bộ nhớ (Lapsed Listener Problem).', lab_1: 'Cài đặt mẫu Strategy để xử lý các thuật toán chấm điểm thi khác nhau.', lab_2: 'Áp dụng Observer Pattern để gửi thông báo tự động cho sinh viên khi có điểm thi mới.', lab_3: 'Mô phỏng máy trạng thái (State Pattern) quản lý vòng đời của đề thi (Soạn thảo -> Thẩm định -> Ban hành).', quiz: [] },
      10: { topic: 'Chiến Lược Kiểm Thử Phần Mềm: Unit Test, Integration Test & Kiểm Thử Hộp Đen / Hộp Trắng', theory: 'Tháp kiểm thử (Testing Pyramid). Các cấp độ kiểm thử: Unit Test (Kiểm thử đơn vị), Integration Test (Kiểm thử tích hợp), System Test (Kiểm thử hệ thống), Acceptance Test (UAT). Kỹ thuật Hộp đen: Phân vùng tương đương (Equivalence Partitioning), Phân tích giá trị biên (Boundary Value Analysis). Kỹ thuật Hộp trắng: Độ bao phủ dòng lệnh (Statement Coverage), Bao phủ nhánh (Branch Coverage).', code_sample: 'test("Tinh diem trung binh chuan TT 08", () => {\n    expect(calculateGPA(8.5, 9.0)).toBe(8.75);\n});', pitfalls: 'Chỉ kiểm thử các trường hợp dữ liệu đúng (Happy Path) mà bỏ quên kiểm thử giá trị biên và các dữ liệu độc hại.', lab_1: 'Áp dụng kỹ thuật Phân tích giá trị biên để lập bảng ca kiểm thử cho chức năng Nhập điểm.', lab_2: 'Viết bộ Unit Test tự động cho module tính toán học bổng sinh viên.', lab_3: 'Đo lường độ bao phủ mã nguồn (Code Coverage) đạt ngưỡng tối thiểu 80%.', quiz: [] },
      11: { topic: 'Phát Triển Phần Mềm Hướng Kiểm Thử (Test-Driven Development - TDD)', theory: 'Quy trình TDD Red - Green - Refactor: 1. Viết Test thất bại (Red); 2. Viết mã tối thiểu để Test thành công (Green); 3. Tối ưu hóa mã nguồn giữ Test luôn xanh (Refactor). Khái niệm Test Doubles: Mock, Stub, Fake. Lợi ích của TDD trong việc nâng cao độ tự tin khi thay đổi mã nguồn.', code_sample: '// 1. RED: expect(add(2,3)).toBe(5);\n// 2. GREEN: function add(a,b) { return a+b; }\n// 3. REFACTOR: clean syntax', pitfalls: 'Viết Unit Test gắn quá chặt vào chi tiết cài đặt bên trong thay vì kiểm tra hành vi đầu ra khiến việc refactor liên tục làm gãy test.', lab_1: 'Thực hành chu trình TDD Red-Green-Refactor để phát triển một lớp Xếp loại học lực.', lab_2: 'Sử dụng Mock Object để cô lập tầng giao dịch CSDL khi kiểm thử dịch vụ đăng ký môn học.', lab_3: 'Viết báo cáo phân tích sự khác nhau giữa phát triển thông thường và phát triển theo TDD.', quiz: [] },
      12: { topic: 'Quản Lý Phiên Bản Mã Nguồn (Git Flow) & Tích Hợp / Triển Khai Liên Tục (CI/CD Pipeline)', theory: 'Hệ thống quản lý phiên bản phân tán Git. Quy trình rẽ nhánh chuẩn Git Flow: main, develop, feature/*, release/*, hotfix/*. Nguyên lý Tích hợp liên tục (CI) và Triển khai liên tục (CD). Tự động hóa kiểm thử và đóng gói Docker container trên GitHub Actions / GitLab CI.', code_sample: '# GitHub Actions CI Workflow\non: [push, pull_request]\njobs:\n  build-and-test:\n    runs-on: ubuntu-latest\n    steps: [uses: actions/checkout@v3, run: npm test]', pitfalls: 'Commit trực tiếp mã nguồn chưa kiểm thử lên nhánh main gây gãy môi trường production.', lab_1: 'Thực hành quy trình Git Flow: Tạo nhánh feature, mở Pull Request (PR) và giải quyết xung đột Merge Conflict.', lab_2: 'Cấu hình file pipeline CI/CD tự động chạy Unit Test mỗi khi có mã mới được đẩy lên repository.', lab_3: 'Đóng gói ứng dụng web vào Docker container sẵn sàng triển khai.', quiz: [] },
      13: { topic: 'Đảm Bảo Chất Lượng Phần Mềm (QA), Đánh Giá Mã Nguồn (Code Review) & Nợ Kỹ Thuật', theory: 'Khái niệm Đảm bảo chất lượng phần mềm (Software Quality Assurance). Quy trình Code Review chuyên nghiệp: Mục đích, thái độ phản hồi tích cực và các tiêu chí rà soát (Bảo mật, hiệu năng, chuẩn đặt tên). Khái niệm Nợ kỹ thuật (Technical Debt) và công cụ phân tích tĩnh mã nguồn SonarQube.', code_sample: '// Code Review Checklist: Security, Performance, Readability, Tests', pitfalls: 'Bỏ qua việc rà soát Code Review để kịp tiến độ làm tích tụ nợ kỹ thuật nghiêm trọng trong tương lai.', lab_1: 'Biên soạn bản Checklist tiêu chuẩn Code Review cho đội ngũ kỹ sư phần mềm.', lab_2: 'Thực hiện phản biện và để lại nhận xét đóng góp trên một Pull Request của đồng nghiệp.', lab_3: 'Sử dụng công cụ Linting và Static Analysis để phát hiện các lỗ hổng bảo mật và điểm bốc mùi mã nguồn (Code Smells).', quiz: [] },
      14: { topic: 'Quản Lý Rủi Ro Dự Án, Ước Lượng Chi Phí (Planning Poker) & Bảo Mật Phần Mềm (DevSecOps)', theory: 'Quản lý rủi ro dự án: Nhận diện rủi ro, đánh giá xác suất và mức độ ảnh hưởng, lập kế hoạch giảm thiểu rủi ro. Kỹ thuật ước lượng kích thước công việc bằng Story Points và trò chơi Planning Poker. Tích hợp bảo mật vào quy trình phát triển (DevSecOps), kiểm soát 10 lỗ hổng bảo mật hàng đầu theo OWASP Top 10.', code_sample: '// Planning Poker Sequence: 1, 2, 3, 5, 8, 13, 21, ?', pitfalls: 'Ước lượng thời gian tuyệt đối (Hours) thay vì độ phức tạp tương đối (Story Points) dẫn đến sai lệch lớn giữa các thành viên có trình độ khác nhau.', lab_1: 'Lập ma trận phân tích rủi ro (Risk Matrix) cho dự án phần mềm thi trực tuyến.', lab_2: 'Tổ chức phiên Planning Poker ước lượng độ phức tạp cho 10 User Story của dự án.', lab_3: 'Rà soát mã nguồn kiểm tra các lỗ hổng OWASP phổ biến: SQL Injection, XSS, CSRF.', quiz: [] },
      15: { topic: 'Bảo Trì Phần Mềm, Tái Cấu Trúc (Refactoring) & Hồ Sơ Nghiệm Thu Chuẩn AUN-QA', theory: '4 loại hình bảo trì phần mềm: Sửa sai (Corrective), Thích nghi (Adaptive), Hoàn thiện (Perfective), Phòng ngừa (Preventive). Kỹ thuật Tái cấu trúc mã nguồn (Refactoring) theo Martin Fowler: Extract Method, Rename, Replace Magic Number. Chuẩn bị hồ sơ nghiệm thu kỹ thuật dự án phần mềm đáp ứng tiêu chuẩn kiểm định chất lượng AUN-QA.', code_sample: '// Refactoring: Thay the Magic Number bang Constant\nconst double MIN_PASSING_GRADE = 5.0;', pitfalls: 'Thực hiện tái cấu trúc mã nguồn lớn khi chưa có hệ thống Unit Test bao phủ sẽ gây rủi ro phát sinh lỗi tiềm ẩn.', lab_1: 'Áp dụng các kỹ thuật Refactoring để làm sạch một đoạn mã nguồn cũ.', lab_2: 'Lập kế hoạch bảo trì và nâng cấp phiên bản cho hệ thống phần mềm sau 1 năm vận hành.', lab_3: 'Hoàn thiện hồ sơ báo cáo kỹ thuật dự án phần mềm cuối kỳ theo khung đánh giá AUN-QA.', quiz: [] }
    }
  },
  BA101: {
    code: 'BA101',
    name: 'Quản trị Học đại cương',
    credits: 3,
    faculty: 'Khoa Kinh Tế & QTKD',
    language: 'markdown',
    textbook: 'Stephen P. Robbins, Mary Coulter (2021), Management, 15th Edition, Pearson.',
    weeks: {
      1: { topic: 'Bản Chất Của Quản Trị, Vai Trò & Kỹ Năng Của Nhà Quản Trị Hiện Đại', theory: 'Khái niệm Quản trị: Quá trình làm việc với và thông qua con người để đạt được mục tiêu tổ chức với hiệu quả (Efficiency - làm đúng cách) và hiệu suất (Effectiveness - làm đúng việc). 4 Chức năng quản trị cốt lõi: Hoạch định (Planning), Tổ chức (Organizing), Lãnh đạo (Leading), Kiểm soát (Controlling). 3 Cấp bậc nhà quản trị và 3 kỹ năng cốt lõi theo Robert Katz: Kỹ năng chuyên môn, Kỹ năng nhân sự, Kỹ năng tư duy.', code_sample: '# 4 Chức Năng Quản Trị Cốt Lõi: P - O - L - C', pitfalls: 'Nhà quản trị cấp cao can thiệp quá sâu vào kỹ thuật chi tiết vi mô (Micromanagement) mà bỏ quên tư duy chiến lược.', lab_1: 'Phân tích cơ cấu quản trị và vai trò của Tổng Giám đốc (CEO) tại một tập đoàn công nghệ lớn.', lab_2: 'Đánh giá mức độ phân bổ 3 kỹ năng của Robert Katz đối với Trưởng bộ môn trong trường đại học.', lab_3: 'Thảo luận tình huống phân biệt giữa khái niệm "Hiệu quả" và "Hiệu suất" trong vận hành doanh nghiệp.', quiz: [] },
      2: { topic: 'Sự Tiến Hóa Của Các Tư Tưởng Quản Trị: Cổ Điển, Tâm Lý Xã Hội & Hiện Đại', theory: 'Trường phái quản trị cổ điển: Quản trị khoa học của F.W. Taylor (định mức lao động, chuyên môn hóa), Quản trị hành chính của Henri Fayol (14 nguyên tắc quản trị). Trường phái tâm lý - xã hội: Thí nghiệm Hawthorne của Elton Mayo (yếu tố con người và nhóm không chính thức). Trường phái quản trị định lượng và trường phái tích hợp hiện đại (Tiếp cận hệ thống và tiếp cận tình huống).', code_sample: '# 14 Nguyên tắc Fayol: Phân công lao động, Quyền hạn & Trách nhiệm, Kỷ luật...', pitfalls: 'Áp dụng máy móc mô hình Taylor coi người lao động như một bộ phận cơ học làm suy giảm tính sáng tạo trong kỷ nguyên kinh tế số.', lab_1: 'Phân tích bài học từ Thí nghiệm Hawthorne và ứng dụng vào việc nâng cao tinh thần làm việc của nhân viên.', lab_2: 'So sánh cách tiếp cận quản lý của Henri Fayol và Max Weber (Mô hình thư lại - Bureaucracy).', lab_3: 'Thảo luận tình huống quản trị theo cách tiếp cận ngẫu nhiên (Contingency Approach) khi doanh nghiệp gặp khủng hoảng.', quiz: [] },
      3: { topic: 'Môi Trường Quản Trị Doanh Nghiệp: Môi Trường Vĩ Mô & Mô Hình 5 Lực Lượng Porter', theory: 'Môi trường vĩ mô (PESTEL): Chính trị (P), Kinh tế (E), Xã hội (S), Công nghệ (T), Môi trường (E), Pháp lý (L). Môi trường vi mô (Ngành) theo Mô hình 5 lực lượng cạnh tranh của Michael Porter: Đối thủ cạnh tranh hiện tại, Mối đe dọa từ đối thủ mới, Quyền lực thương lượng của khách hàng, Quyền lực thương lượng của nhà cung cấp, Nguy cơ từ sản phẩm thay thế.', code_sample: '# Mô hình PESTEL & 5 Lực Lượng Cạnh Tranh Michael Porter', pitfalls: 'Chỉ tập trung vào đối thủ cạnh tranh trực tiếp mà xem nhẹ nguy cơ từ các sản phẩm công nghệ thay thế đột phá (Disruptive Technology).', lab_1: 'Sử dụng khung PESTEL để phân tích môi trường kinh doanh dịch vụ đào tạo đại học trực tuyến tại Việt Nam.', lab_2: 'Áp dụng Mô hình 5 lực lượng của Porter để đánh giá sức hấp dẫn của ngành thương mại điện tử.', lab_3: 'Xác định các giải pháp giúp doanh nghiệp chuyển đổi từ vị thế bị động sang chủ động trước biến động môi trường.', quiz: [] },
      4: { topic: 'Đạo Đức Kinh Doanh & Trách Nhiệm Xã Hội Của Doanh Nghiệp (CSR / ESG)', theory: 'Khái niệm đạo đức kinh doanh và các quan điểm đạo đức: Quan điểm vị lợi (Utilitarian), Quan điểm quyền lợi, Quan điểm công bằng. Trách nhiệm xã hội của doanh nghiệp (CSR) theo Tháp Carroll: Trách nhiệm kinh tế, Trách nhiệm pháp lý, Trách nhiệm đạo đức, Trách nhiệm từ thiện. Xu hướng phát triển bền vững theo bộ tiêu chuẩn ESG (Môi trường - Xã hội - Quản trị).', code_sample: '# Tháp CSR Carroll: Kinh tế -> Pháp lý -> Đạo đức -> Từ thiện', pitfalls: 'Xem CSR như một chiến dịch PR quảng cáo hình thức (Greenwashing) thay vì tích hợp thực chất vào chiến lược kinh doanh cốt lõi.', lab_1: 'Phân tích một vụ bê bối vi phạm đạo đức kinh doanh thực tế và các bài học rút ra.', lab_2: 'Xây dựng kế hoạch thực thi trách nhiệm xã hội CSR cho một công ty công nghệ phần mềm.', lab_3: 'Đánh giá tác động của việc áp dụng các tiêu chuẩn ESG đến giá trị cổ phiếu và niềm tin của nhà đầu tư.', quiz: [] },
      5: { topic: 'Chức Năng Hoạch Định: Tầm Nhìn, Sứ Mệnh, Mục Tiêu SMART & Phân Tích SWOT', theory: 'Bản chất của hoạch định. Tuyên bố Tầm nhìn (Vision) và Sứ mệnh (Mission). Nguyên tắc thiết lập mục tiêu thông minh SMART: Cụ thể (Specific), Đo lường được (Measurable), Khả thi (Achievable), Liên quan (Relevant), Có thời hạn (Time-bound). Kỹ thuật phân tích ma trận điểm mạnh - điểm yếu - cơ hội - thách thức (SWOT Matrix) và các chiến lược kết hợp (SO, WO, ST, WT).', code_sample: '# Ma trận SWOT: Strengths, Weaknesses, Opportunities, Threats', pitfalls: 'Liệt kê các yếu tố trong SWOT một cách rời rạc mà không xây dựng các chiến lược hành động kết hợp SO/ST/WO/WT.', lab_1: 'Xây dựng mục tiêu SMART cho một chiến dịch tuyển sinh đại học.', lab_2: 'Lập ma trận SWOT hoàn chỉnh cho một công ty khởi nghiệp công nghệ EdTech.', lab_3: 'Đề xuất 3 chiến lược hành động đột phá dựa trên ma trận kết hợp SO và ST.', quiz: [] },
      6: { topic: 'Ra Quyết Định Quản Trị: Quy Trình 8 Bước & Các Bẫy Tâm Lý Trong Ra Quyết Định', theory: 'Quy trình 8 bước ra quyết định quản trị chuẩn mực: 1. Nhận diện vấn đề; 2. Xác định tiêu chí; 3. Phân bổ trọng số; 4. Phát triển phương án; 5. Phân tích phương án; 6. Lựa chọn phương án; 7. Thực hiện; 8. Đánh giá hiệu quả. Các mô hình ra quyết định: Duy lý (Rational), Duy lý giới hạn (Bounded Rationality), Trực giác. Các bẫy tâm lý phổ biến: Bẫy mỏ neo, Bẫy xác nhận, Bẫy chi phí chìm (Sunk Cost Fallacy).', code_sample: '# Quy trình 8 bước ra quyết định quản trị', pitfalls: 'Rơi vào bẫy chi phí chìm: Tiếp tục đổ vốn vào dự án thất bại chỉ vì tiếc số tiền và công sức đã đầu tư trước đó.', lab_1: 'Áp dụng quy trình 8 bước để ra quyết định lựa chọn đối tác cung cấp dịch vụ điện toán đám mây cho trường học.', lab_2: 'Phân tích các bẫy tâm lý thường gặp của các nhà quản trị trong các tình huống khủng hoảng.', lab_3: 'Thực hành kỹ thuật Brainstorming và kỹ thuật Nhóm danh nghĩa (Nominal Group Technique) trong ra quyết định tập thể.', quiz: [] },
      7: { topic: 'Chức Năng Tổ Chức: Cơ Cấu Tổ Chức, Tầm Hạn Quản Trị & Phân Quyền', theory: 'Bản chất của chức năng tổ chức. 6 Yếu tố cấu thành cơ cấu tổ chức: Chuyên môn hóa công việc, Phân chia bộ phận (Theo chức năng, sản phẩm, địa lý, khách hàng), Tuyến chỉ huy, Tầm hạn quản trị (Span of Control - Rộng vs Hẹp), Tập quyền và Phân quyền (Centralization vs Decentralization), Chính thức hóa. Các mô hình cơ cấu tổ chức hiện đại: Cơ cấu Ma trận (Matrix Structure), Cơ cấu theo Dự án, Cơ cấu Mạng lưới.', code_sample: '# Cơ cấu tổ chức: Chức năng, Ma trận, Phân quyền', pitfalls: 'Áp dụng cơ cấu Ma trận mà không giải quyết tốt xung đột "Một người hai sếp" (Dual Reporting) dẫn đến nhân viên lúng túng trong ưu tiên công việc.', lab_1: 'Vẽ sơ đồ cơ cấu tổ chức của một trường đại học công lập và phân tích tầm hạn quản trị của các Trưởng khoa.', lab_2: 'So sánh ưu nhược điểm giữa cơ cấu tổ chức dạng Chức năng và dạng Ma trận.', lab_3: 'Thiết kế quy chế phân quyền ra quyết định chi tiêu tài chính cho các cấp quản lý trong công ty.', quiz: [] },
      8: { topic: 'Quản Trị Nguồn Nhân Lực: Tuyển Dụng, Đào Tạo & Đánh Giá Hiệu Quả (KPI / OKR)', theory: 'Quy trình quản trị nguồn nhân lực (HRM): Hoạch định nhân lực, Phân tích công việc (Bản mô tả công việc JD và Bản tiêu chuẩn công việc JS), Tuyển mộ và Tuyển chọn. Đào tạo và phát triển năng lực nhân sự. Đánh giá hiệu quả công việc: Phương pháp Chỉ số đo lường hiệu quả (KPI - Key Performance Indicators) và Phương pháp Mục tiêu và Kết quả then chốt (OKR - Objectives and Key Results).', code_sample: '# Hệ thống đánh giá hiệu quả: KPI vs OKR', pitfalls: 'Thiết lập KPI quá tập trung vào số lượng ngắn hạn làm triệt tiêu động lực cải tiến dài hạn và tinh thần hợp tác đồng đội.', lab_1: 'Biên soạn Bản mô tả công việc (JD) và Bản tiêu chuẩn (JS) cho vị trí Giảng viên CNTT.', lab_2: 'Thiết kế bộ chỉ số KPI đo lường hiệu quả công việc cho đội ngũ hỗ trợ học vụ sinh viên.', lab_3: 'Xây dựng mục tiêu OKR quý cho bộ phận phát triển phần mềm đào tạo.', quiz: [] },
      9: { topic: 'Chức Năng Lãnh Đạo: Các Phong Cách Lãnh Đạo & Trí Tuệ Cảm Xúc (EQ)', theory: 'Phân biệt Lãnh đạo (Leadership - Định hướng, truyền cảm hứng) và Quản lý (Management - Duy trì trật tự, quy trình). Các phong cách lãnh đạo kinh điển: Độc đoán (Autocratic), Dân chủ (Democratic), Tự do (Laissez-faire). Mô hình Lãnh đạo theo tình huống của Hersey-Blanchard. Khái niệm Trí tuệ cảm xúc (EQ) của Daniel Goleman và vai trò trong việc gắn kết nhân viên.', code_sample: '# 4 Phong cách lãnh đạo tình huống: Chỉ đạo, Hướng dẫn, Hỗ trợ, Ủy quyền', pitfalls: 'Áp dụng phong cách lãnh đạo độc đoán đối với đội ngũ chuyên gia công nghệ có trình độ cao và nhu cầu tự chủ lớn.', lab_1: 'Tự đánh giá phong cách lãnh đạo cá nhân theo bảng câu hỏi trắc nghiệm của Hersey-Blanchard.', lab_2: 'Phân tích phong cách lãnh đạo truyền cảm hứng của các nhà sáng lập công nghệ tiêu biểu.', lab_3: 'Thực hành giải quyết tình huống nhân viên bất mãn bằng kỹ thuật lắng nghe tích cực và thấu cảm (EQ).', quiz: [] },
      10: { topic: 'Tạo Động Lực Làm Việc: Thuyết Nhu Cầu Maslow, Thuyết Hai Yếu Tố Herzberg & Thuyết Kỳ Vọng', theory: 'Bản chất của động lực làm việc. Tháp nhu cầu của Abraham Maslow: Sinh học -> An toàn -> Xã hội -> Được tôn trọng -> Tự thể hiện. Thuyết hai yếu tố của Frederick Herzberg: Yếu tố duy trì (Hygiene Factors) và Yếu tố tạo động lực (Motivators). Thuyết kỳ vọng của Victor Vroom: Nỗ lực -> Kết quả -> Phần thưởng -> Mục tiêu cá nhân.', code_sample: '# Tháp nhu cầu Maslow: 5 Cấp độ nhu cầu con người', pitfalls: 'Chỉ tăng lương thưởng (yếu tố duy trì) mà không tạo cơ hội thăng tiến và công nhận thành tích (yếu tố động lực), khiến nhân viên vẫn thiếu nhiệt huyết cống hiến.', lab_1: 'Áp dụng Tháp Maslow để thiết kế chính sách đãi ngộ nhân tài cho doanh nghiệp.', lab_2: 'Sử dụng Thuyết hai yếu tố Herzberg để phân tích nguyên nhân tỷ lệ nghỉ việc cao tại một công ty công nghệ.', lab_3: 'Đề xuất các biện pháp tạo động lực phi tài chính hiệu quả cho nhân viên thế hệ Gen Z.', quiz: [] },
      11: { topic: 'Truyền Thông Hiệu Quả & Quản Lý Xung Đột Trong Tổ Chức Doanh Nghiệp', theory: 'Quy trình truyền thông: Người gửi -> Mã hóa -> Kênh truyền -> Giải mã -> Người nhận -> Phản hồi và Nhiễu (Noise). Các rào cản truyền thông hiệu quả. Bản chất của xung đột trong tổ chức: Xung đột chức năng (tích cực) và Xung đột phi chức năng (tiêu cực). 5 Phong cách giải quyết xung đột theo Mô hình Thomas-Kilmann: Cạnh tranh, Hợp tác, Thỏa hiệp, Tránh né, Nhượng bộ.', code_sample: '# Mô hình Thomas-Kilmann: 5 Phong cách giải quyết xung đột', pitfalls: 'Chọn cách né tránh xung đột kéo dài khiến mâu thuẫn âm ỉ bùng nổ thành khủng hoảng nội bộ nghiêm trọng.', lab_1: 'Nhận diện các nguồn gây nhiễu truyền thông trong các buổi họp trực tuyến và đề xuất giải pháp khắc phục.', lab_2: 'Đóng vai xử lý một tình huống xung đột quyền lợi giữa phòng Kinh doanh và phòng Kỹ thuật.', lab_3: 'Áp dụng phong cách Hợp tác (Collaborating) để đạt giải pháp đôi bên cùng có lợi (Win-Win).', quiz: [] },
      12: { topic: 'Chức Năng Kiểm Soát: Quy Trình Kiểm Soát 4 Bước & Bảng Điểm Cân Bằng (BSC)', theory: 'Bản chất và tầm quan trọng của kiểm soát. Quy trình kiểm soát 4 bước: 1. Thiết lập tiêu chuẩn; 2. Đo lường hiệu quả thực tế; 3. So sánh thực tế với tiêu chuẩn; 4. Thực hiện hành động điều chỉnh. 3 Loại hình kiểm soát: Kiểm soát trước (Feedforward), Kiểm soát đồng thời (Concurrent), Kiểm soát phản hồi (Feedback). Công cụ quản trị chiến lược Bảng điểm cân bằng (Balanced Scorecard - BSC) trên 4 khía cạnh: Tài chính, Khách hàng, Quy trình nội bộ, Học hỏi & Phát triển.', code_sample: '# Quy trình kiểm soát 4 bước & Bảng điểm cân bằng BSC', pitfalls: 'Kiểm soát quá chặt chẽ cứng nhắc làm thui chột tinh thần đổi mới sáng tạo và tạo tâm lý đối phó của nhân viên.', lab_1: 'Xây dựng quy trình kiểm soát chất lượng đào tạo cho một khóa học đại học tín chỉ.', lab_2: 'Thiết kế Bảng điểm cân bằng BSC cho một trường đại học trên cả 4 khía cạnh.', lab_3: 'Phân tích tình huống xử lý khi chỉ tiêu doanh thu thực tế bị hụt 30% so với kế hoạch đã duyệt.', quiz: [] },
      13: { topic: 'Quản Trị Sự Thay Đổi & Đổi Mới Sáng Tạo Trong Tổ Chức Doanh Nghiệp Số', theory: 'Các động lực thúc đẩy sự thay đổi: Công nghệ số, biến động thị trường, thay đổi chính sách. Mô hình thay đổi 3 giai đoạn của Kurt Lewin: Rã đông (Unfreeze) -> Thay đổi (Change) -> Tái đông (Refreeze). Nguyên nhân người lao động phản đối sự thay đổi và các kỹ thuật vượt qua sự phản đối: Giáo dục, tham gia, hỗ trợ, đàm phán. Xây dựng văn hóa đổi mới sáng tạo trong doanh nghiệp số.', code_sample: '# Mô hình thay đổi Kurt Lewin: Rã đông -> Thay đổi -> Đóng băng mới', pitfalls: 'Thực hiện thay đổi vội vã từ trên áp xuống mà không truyền thông rõ ràng lý do cần thay đổi khiến đội ngũ hoang mang và chống đối ngầm.', lab_1: 'Lập kế hoạch quản trị sự thay đổi khi nhà trường chuyển đổi từ đào tạo truyền thống sang hệ thống số hóa LMS.', lab_2: 'Phân tích các rào cản tâm lý khi nhân viên phải học tập công cụ trí tuệ nhân tạo (AI) mới.', lab_3: 'Đề xuất các chính sách khuyến khích sáng kiến đổi mới sáng tạo trong tổ chức.', quiz: [] },
      14: { topic: 'Quản Trị Vận Hành Doanh Nghiệp & Quản Lý Chất Lượng Toàn Diện (TQM / Six Sigma)', theory: 'Bản chất của quản trị vận hành: Biến đổi đầu vào (Input) thành sản phẩm/dịch vụ đầu ra (Output). Triết lý Quản lý chất lượng toàn diện (Total Quality Management - TQM) và chu trình cải tiến liên tục PDCA (Plan - Do - Check - Act). Phương pháp luận Tinh gọn (Lean Management) và Six Sigma: Giảm thiểu 8 loại lãng phí (Muda) và kiểm soát sai lỗi dưới 3.4 lỗi trên 1 triệu cơ hội (DPMO).', code_sample: '# Chu trình cải tiến chất lượng liên tục: P - D - C - A', pitfalls: 'Triển khai TQM chỉ như phong trào bề nổi mà thiếu sự cam kết lâu dài của ban lãnh đạo cấp cao nhất.', lab_1: 'Vẽ sơ đồ chuỗi giá trị vận hành cung cấp dịch vụ thi cử tại một trung tâm khảo thí.', lab_2: 'Áp dụng chu trình PDCA để giải quyết triệt để vấn đề sinh viên đăng ký môn học bị quá tải nghẽn mạng.', lab_3: 'Nhận diện các loại lãng phí trong quy trình xử lý thủ tục hành chính giấy tờ và đề xuất tinh gọn số hóa.', quiz: [] },
      15: { topic: 'Toàn Cầu Hóa & Quản Trị Doanh Nghiệp Đa Quốc Gia (MNCs)', theory: 'Khái niệm toàn cầu hóa và các giai đoạn quốc tế hóa của doanh nghiệp: Xuất khẩu -> Nhượng quyền (Franchising) / Cấp phép (Licensing) -> Liên doanh (Joint Venture) -> Chi nhánh sở hữu toàn bộ (Wholly Owned Subsidiary). Thách thức về sự khác biệt văn hóa theo Mô hình kích thước văn hóa của Geert Hofstede: Khoảng cách quyền lực, Chủ nghĩa cá nhân vs tập thể, Né tránh bất định. Đào tạo năng lực văn hóa cho nhà quản trị toàn cầu.', code_sample: '# 6 Kích thước văn hóa Geert Hofstede: Power Distance, Individualism...', pitfalls: 'Áp dụng nguyên si chiến lược kinh doanh và phong cách quản lý bản địa vào thị trường quốc tế có văn hóa hoàn toàn khác biệt (Chủ nghĩa vị chủng - Ethnocentrism).', lab_1: 'Sử dụng mô hình Geert Hofstede để so sánh văn hóa doanh nghiệp giữa Việt Nam, Nhật Bản và Hoa Kỳ.', lab_2: 'Phân tích chiến lược thích ứng địa phương hóa của các tập đoàn đa quốc gia khi thâm nhập thị trường Việt Nam.', lab_3: 'Xây dựng kế hoạch phát triển kỹ năng làm việc trong môi trường đa văn hóa cho sinh viên tốt nghiệp đại học.', quiz: [] }
    }
  }
};

/**
 * Trợ lý trích xuất & hợp nhất dữ liệu tuần học phần chuẩn xác
 */
function resolveCurriculumWeekData(courseCode, courseName, weekNum, customTopic, syllabusText) {
  const cInfo = COURSE_CURRICULA[courseCode] || {
    code: courseCode || 'IT101',
    name: courseName || 'Học Phần Đại Học',
    credits: 3,
    faculty: 'Khoa Đào Tạo Đại Học',
    language: 'sql',
    textbook: 'Giáo trình đào tạo đại học chính quy, Nhà xuất bản Giáo dục.'
  };

  const weekNumSafe = Math.max(1, Math.min(15, Number(weekNum) || 1));
  const defaultWeekData = (cInfo.weeks && cInfo.weeks[weekNumSafe]) || {};

  const activeTopic = customTopic || defaultWeekData.topic || `Chuyên đề Tuần ${weekNumSafe}: ${cInfo.name}`;
  const activeTheory = defaultWeekData.theory || `Phân tích chuyên sâu nền tảng lý thuyết, kiến trúc vận hành và các tiêu chuẩn kỹ thuật chuyên ngành liên quan đến chuyên đề ${activeTopic}. Đối chiếu các yêu cầu trọng tâm trong đề cương: ${syllabusText ? syllabusText.substring(0, 300) : 'Tuân thủ khung đào tạo đại học tín chỉ theo Thông tư 08/2021/TT-BGDĐT.'}`;
  const activeCode = defaultWeekData.code_sample || `// Kịch bản thực hành chuyên đề Tuần ${weekNumSafe}\n// Học phần: ${cInfo.name} (${cInfo.code})\nvoid executeCoreProcedure() {\n    // Thực thi các nguyên tắc kỹ thuật chuẩn\n}`;
  const activePitfalls = defaultWeekData.pitfalls || 'Các lỗi phổ biến về logic xử lý, bẫy vi phạm quy tắc hệ thống và các ca biên (edge-cases) nguy hiểm cần phòng tránh.';
  const activeLab1 = defaultWeekData.lab_1 || `Cài đặt và thực thi các bài tập cơ bản củng cố kiến thức chuyên đề ${activeTopic}.`;
  const activeLab2 = defaultWeekData.lab_2 || `Xây dựng giải pháp kỹ thuật giải quyết bài toán nghiệp vụ quy mô vừa với đầy đủ ràng buộc thực tế.`;
  const activeLab3 = defaultWeekData.lab_3 || `Phân tích hiệu năng, xử lý các trường hợp ngoại lệ và tối ưu hóa giải pháp theo chuẩn công nghiệp.`;

  return {
    course: cInfo,
    weekNum: weekNumSafe,
    topic: activeTopic,
    theory: activeTheory,
    code_sample: activeCode,
    pitfalls: activePitfalls,
    lab_1: activeLab1,
    lab_2: activeLab2,
    lab_3: activeLab3,
    language: cInfo.language || 'sql',
    textbook: cInfo.textbook || 'Giáo trình đào tạo chính quy Bộ GD&ĐT',
    custom_quiz: defaultWeekData.quiz || []
  };
}

/**
 * 1. Hàm sinh Kế hoạch bài dạy chuẩn Bộ GD&ĐT (Lesson Plan Giáo Trình Đại Học)
 */
function generateHigherEducationLessonPlan(courseCode, courseName, weekNum, topicName, syllabusText, pedagogyModel, depthLevel) {
  const data = resolveCurriculumWeekData(courseCode, courseName, weekNum, topicName, syllabusText);
  const cInfo = data.course;
  const currentTopic = data.topic;
  const model = pedagogyModel || 'MOET_STANDARD';
  const depth = depthLevel || 'ADVANCED';

  // Xác định chuẩn đầu ra theo độ sâu nhận thức Bloom
  let depthBadge = 'Chuẩn C1 - C5 (Phân tích, Đánh giá chuyên sâu)';
  if (depth === 'STANDARD') depthBadge = 'Chuẩn C1 - C3 (Nhận biết, Thông hiểu & Vận dụng nền tảng)';
  if (depth === 'ENTERPRISE') depthBadge = 'Chuẩn C1 - C6 (Thực chiến Doanh nghiệp, Đánh giá Kiến trúc & Sáng tạo giải pháp)';

  // Xây dựng tiến trình sư phạm theo mô hình được chọn
  let pedagogicalProcessContent = '';

  if (model === 'GAGNE_9') {
    pedagogicalProcessContent = `### ÁP DỤNG MÔ HÌNH 9 BIẾN CỐ HỌC TẬP CỦA ROBERT GAGNÉ (GAGNÉ'S 9 EVENTS OF INSTRUCTION):

1. **Biến cố 1: Thu hút sự chú ý (Gain Attention — 10 phút):** Giảng viên trình chiếu tình huống thực tế hoặc sự cố kỹ thuật điển hình liên quan đến ${currentTopic} trong các hệ thống doanh nghiệp lớn.
2. **Biến cố 2: Thông báo mục tiêu học tập (Inform Objectives — 5 phút):** Nêu rõ các chuẩn đầu ra LLO1 - LLO3 sinh viên bắt buộc phải làm chủ sau 150 phút.
3. **Biến cố 3: Kích hoạt kiến thức sẵn có (Stimulate Recall — 15 phút):** Đặt câu hỏi truy hồi kiến thức của các tuần học trước để làm bệ phóng cho chuyên đề mới.
4. **Biến cố 4: Trình bày nội dung bài học mới (Present Content — 45 phút):**
${data.theory}
5. **Biến cố 5: Cung cấp hướng dẫn học tập (Provide Guidance — 15 phút):**
\`\`\`${data.language}
${data.code_sample}
\`\`\`
> **[CẢNH BÁO SƯ PHẠM VỀ BẪY LỖI]:** ${data.pitfalls}
6. **Biến cố 6: Khuyến khích thực hành làm mẫu (Elicit Performance — 30 phút):** Sinh viên trực tiếp giải quyết Bài tập thực hành số 1 và số 2 trên máy tính cá nhân/phòng Lab.
7. **Biến cố 7: Cung cấp phản hồi sư phạm (Provide Feedback — 10 phút):** Giảng viên trực tiếp sửa bài mẫu trên màn hình máy chiếu, chỉ ra các sai lầm phổ biến.
8. **Biến cố 8: Đánh giá kết quả tiếp thu (Assess Performance — 10 phút):** Sinh viên thực hiện Mini-Quiz 4 câu trắc nghiệm trên TechCorp LMS ghi nhận điểm chuyên cần quá trình.
9. **Biến cố 9: Tăng cường ghi nhớ và chuyển giao tri thức (Retention & Transfer — 10 phút):** Giao đề tài mở rộng tự học 6 giờ/tuần và dặn dò đọc trước tài liệu tuần kế tiếp.`;
  } else {
    // Mặc định MOET_STANDARD kết hợp chu trình tích cực 5E
    pedagogicalProcessContent = `### ÁP DỤNG CHU TRÌNH SƯ PHẠM TÍCH CỰC 5E (ENGAGE - EXPLORE - EXPLAIN - ELABORATE - EVALUATE):

### 1. HOẠT ĐỘNG 1: KHỞI ĐỘNG & TẠO NHU CẦU NHẬN THỨC (ENGAGE — 15 PHÚT)
- **Mục tiêu:** Kích hoạt tri thức nền tảng, tạo nhu cầu nhận thức và khơi dậy động lực học tập.
- **Nội dung:** Giảng viên nêu tình huống sự cố thực tế trong doanh nghiệp: *"Tại sao khi hệ thống quy mô lớn xử lý ${currentTopic} lại xảy ra sự cố nghẽn mạng/mất dữ liệu nếu không áp dụng đúng chuẩn kiến trúc?"*.
- **Hoạt động sinh viên:** Thảo luận nhanh theo cặp và nêu các giả định ban đầu.

### 2. HOẠT ĐỘNG 2: KHÁM PHÁ & CHIẾM LĨNH TRI THỨC MỚI (EXPLORE & EXPLAIN — 50 PHÚT)
- **Mục tiêu:** Đạt trọn vẹn chuẩn đầu ra LLO1.1 và LLO1.2.
- **Nội dung lý thuyết chuyên sâu:**
${data.theory}
- **Hoạt động Giảng viên:** Kết hợp bảng tương tác số hóa, vẽ luồng dữ liệu, trình diễn live coding / live query trực tiếp trên màn hình trạm.
- **Hoạt động Sinh viên:** Lắng nghe, ghi chép bản đồ tư duy, đặt câu hỏi phản biện các khái niệm trừu tượng.

### 3. HOẠT ĐỘNG 3: LUYỆN TẬP THỰC CHIẾN TẠI LỚP (ELABORATE — 45 PHÚT)
- **Mục tiêu:** Đạt chuẩn đầu ra LLO2.1 và LLO2.2.
- **Mã nguồn / Kịch bản mẫu chuẩn mực:**
\`\`\`${data.language}
${data.code_sample}
\`\`\`
- **Phân tích bẫy lỗi và ca biên nguy hiểm (Edge-Cases):**
> **[CẢNH BÁO SƯ PHẠM]:** ${data.pitfalls}
- **Nhiệm vụ sinh viên:** Tự tay cài đặt, chạy thử nghiệm trên môi trường IDE/RDBMS và ghi nhận thông điệp phản hồi từ hệ thống.

### 4. HOẠT ĐỘNG 4: ĐÁNH GIÁ QUÁ TRÌNH (EVALUATE — 20 PHÚT)
- **Mục tiêu:** Đạt chuẩn đầu ra LLO3.1; kiểm tra tức thì mức độ hiểu bài của 100% người học.
- **Phương thức:** Sinh viên quét mã QR hoặc truy cập ứng dụng LMS TechCorp làm bài Mini-Quiz 4 câu trắc nghiệm phân tầng Bloom C1 - C4 trong 5 phút.
- **Phản hồi sư phạm:** Giảng viên chiếu phổ điểm trực tiếp, giải thích tường tận nguyên nhân đúng/sai và chốt lại nguyên lý cốt lõi.

### 5. HOẠT ĐỘNG 5: HƯỚNG DẪN TỰ HỌC & MỞ RỘNG (EXTEND — 20 PHÚT)
- **Mục tiêu:** Đảm bảo thời lượng tự học 6 giờ/tuần theo đúng Quy chế đào tạo tín chỉ đại học (Thông tư 08/2021/TT-BGDĐT).
- **Nhiệm vụ cụ thể:**
  1. Hoàn thành 3 bài tập Lab thực hành trong Mục IV và nộp báo cáo mã nguồn lên LMS trước 23:59 Chủ nhật.
  2. Đọc trước giáo trình bài giảng Tuần ${data.weekNum + 1} và chuẩn bị câu hỏi phản biện.`;
  }

  return `# BỘ GIÁO DỤC VÀ ĐÀO TẠO
## TRƯỜNG ĐẠI HỌC CÔNG NGHỆ & QUẢN TRỊ TECHCORP
### KHOA ĐÀO TẠO: ${cInfo.faculty.toUpperCase()}

---

# KẾ HOẠCH BÀI DẠY HỌC PHẦN (LESSON PLAN ĐẠI HỌC)
*(Ban hành theo Quy chế đào tạo trình độ đại học - Thông tư 08/2021/TT-BGDĐT & Tiêu chuẩn AUN-QA)*

**Tên bài học:** BÀI GIẢNG TUẦN ${data.weekNum}: ${currentTopic.toUpperCase()}
**Học phần:** ${cInfo.name} | **Mã học phần:** ${cInfo.code}
**Khối lượng học tập:** ${cInfo.credits} tín chỉ chuẩn (Lý thuyết: 2 TC, Thực hành/Thảo luận: 1 TC, Tự học nghiên cứu: 6 giờ/tuần)
**Thời lượng thực hiện trên lớp:** 150 phút (3 tiết tín chỉ tiêu chuẩn)
**Mức độ chuyên sâu nhận thức:** ${depthBadge}
**Khung sư phạm triển khai:** ${model === 'GAGNE_9' ? 'Mô hình 9 Biến Cố Hướng Dẫn Robert Gagné' : 'Mô hình Chu trình 5E kết hợp Chuẩn Bộ GD&ĐT'}

---

## I. MỤC TIÊU VÀ CHUẨN ĐẦU RA BÀI HỌC (LESSON LEARNING OUTCOMES - LLO)
Sau khi hoàn thành bài học Tuần ${data.weekNum}, người học đạt được các năng lực theo thang đo nhận thức Bloom:

### 1. Về Kiến thức (Knowledge - C1, C2):
- **LLO1.1 (Nhận biết - Bloom C1):** Trình bày chính xác các định nghĩa quy chuẩn, thuật ngữ chuyên ngành, cú pháp chuẩn và kiến trúc nền tảng của ${currentTopic}.
- **LLO1.2 (Thông hiểu - Bloom C2):** Giải thích cặn kẽ bản chất cơ chế vận hành bên dưới hệ thống, luồng luân chuyển dữ liệu và phân tích được lý do lựa chọn kỹ thuật tối ưu.

### 2. Về Kỹ năng (Skills - C3, C4):
- **LLO2.1 (Vận dụng - Bloom C3):** Áp dụng thành thạo các quy tắc kỹ thuật và mã nguồn chuẩn mực để giải quyết bài toán nghiệp vụ thực tế không phát sinh lỗi cú pháp.
- **LLO2.2 (Phân tích - Bloom C4):** Phân tích được các ca biên phức tạp, nhận diện và xử lý triệt để các bẫy lỗi thường gặp (pitfalls), tối ưu hóa hiệu năng tính toán và dung lượng tài nguyên.

### 3. Mức Tự Chủ và Trách Nhiệm (Autonomy & Responsibility - C5, C6):
- **LLO3.1 (Đánh giá - Bloom C5):** Đánh giá được tính an toàn, bảo mật, tính toàn vẹn và khả năng mở rộng của giải pháp triển khai trong môi trường sản xuất.
- **LLO3.2 (Thái độ & Trách nhiệm nghề nghiệp):** Rèn luyện tác phong làm việc chuyên nghiệp, tuân thủ nguyên tắc lập trình sạch (Clean Code), viết tài liệu kỹ thuật rõ ràng và tuân thủ đạo đức nghề nghiệp.

### Ma trận đối chiếu Chuẩn đầu ra bài học với Chuẩn đầu ra học phần (Mapping LLO -> CLO -> PLO):
| Chuẩn đầu ra bài học (LLO) | Cấp độ Bloom | Ánh xạ CLO Học phần | Ánh xạ PLO Chương trình đào tạo (AUN-QA) |
|:---|:---:|:---:|:---:|
| LLO1.1 - Nắm vững khái niệm | C1 | CLO1 (Kiến thức nền tảng) | PLO1 (Tri thức cốt lõi ngành) |
| LLO1.2 - Hiểu bản chất cơ chế | C2 | CLO1 (Nguyên lý hệ thống) | PLO2 (Tư duy phân tích kỹ thuật) |
| LLO2.1 - Cài đặt bài toán | C3 | CLO2 (Kỹ năng thực thi) | PLO3 (Phát triển giải pháp công nghệ) |
| LLO2.2 - Phân tích & Tối ưu | C4 | CLO3 (Gỡ lỗi & Tối ưu) | PLO4 (Giải quyết vấn đề phức hợp) |
| LLO3.1 - Đánh giá an toàn | C5 | CLO4 (Đảm bảo chất lượng) | PLO7 (Trách nhiệm nghề nghiệp & Đạo đức) |

---

## II. THIẾT BỊ VÀ HỌC LIỆU DẠY HỌC
1. **Thiết bị phục vụ giảng dạy:** Máy tính trạm giảng viên, máy chiếu Full HD, bảng tương tác thông minh, hạ tầng mạng LAN kết nối máy chủ dữ liệu trường học.
2. **Môi trường phần mềm thực hành:** Nền tảng LMS TechCorp trực tuyến, IDE VSCode / CLion / DBMS Workbench / Terminal chuyên dụng.
3. **Học liệu số bắt buộc:**
   - Bộ Slide bài giảng số hóa 12 slides chuẩn 16:9 HD.
   - Kho mã nguồn mẫu và bộ dữ liệu thử nghiệm chuẩn (Test Dataset).
   - Kịch bản Video Studio số hóa 15 phút bổ trợ tự học có điểm dừng tương tác.
   - Ngân hàng câu hỏi trắc nghiệm đánh giá quá trình 4 cấp độ Bloom.

---

## III. TIẾN TRÌNH TỔ CHỨC CÁC HOẠT ĐỘNG DẠY VÀ HỌC (150 PHÚT)
${pedagogicalProcessContent}

---

## IV. HỆ THỐNG BÀI TẬP THỰC HÀNH & TỰ HỌC (LAB EXERCISES)
- **Bài 1 (Mức độ Nhận biết & Thông hiểu - 3.0 điểm):** ${data.lab_1}
- **Bài 2 (Mức độ Vận dụng kỹ thuật - 4.0 điểm):** ${data.lab_2}
- **Bài 3 (Mức độ Vận dụng cao & Tối ưu - 3.0 điểm):** ${data.lab_3}

### Rubrics Tiêu Chí Đánh Giá Cho Điểm Thực Hành (Thang Điểm 10 Chuẩn TT 08):
| Tiêu chí đánh giá | Trọng số | Mức Chưa Đạt (< 5.0) | Mức Đạt (5.0 - 6.9) | Mức Khá (7.0 - 8.4) | Mức Giỏi / Xuất Sắc (8.5 - 10) |
|:---|:---:|:---|:---|:---|:---|
| Tính đúng đắn kỹ thuật | 30% | Mã nguồn lỗi biên dịch | Hoàn thành bài 1 | Hoàn thành tốt bài 1 và 2 | Hoàn thành xuất sắc cả 3 bài |
| Xử lý ca biên & Ngoại lệ | 30% | Crash khi gặp dữ liệu lạ | Bắt được 1 lỗi cơ bản | Xử lý được 80% ngoại lệ | Bắt trọn vẹn mọi ca biên và log lỗi an toàn |
| Chuẩn viết code & Tối ưu | 20% | Trình bày lộn xộn | Trình bày tạm ổn | Đặt tên biến và tách hàm chuẩn | Clean code, tối ưu Big-O và RAM |
| Kỷ luật nộp bài LMS | 20% | Nộp muộn quá 24h | Nộp muộn < 12h | Nộp đúng hạn quy định | Nộp sớm và có mở rộng nghiên cứu |

---

## V. TÀI LIỆU HỌC TẬP VÀ THAM KHẢO
1. **Giáo trình chính:** ${data.textbook}
2. **Tài liệu tham khảo chuyên ngành quốc tế:**
   - Tiêu chuẩn ISO/IEC/IEEE 29119 về Quy trình Thử nghiệm & Đảm bảo Chất lượng.
   - Tài liệu kỹ thuật chính thức từ nhà cung cấp công nghệ (Official Documentation).

---

### HỘI ĐỒNG KHOA DUYỆT & KÝ TÊN

**TRƯỞNG KHOA ĐÀO TẠO**  
*(Ký và ghi rõ họ tên)*  
**PGS. TS. Trần Mạnh Tuấn**

**TRƯỞNG BỘ MÔN CHUYÊN MÔN**  
*(Ký và ghi rõ họ tên)*  
**TS. Nguyễn Văn An**

**GIẢNG VIÊN BIÊN SOẠN**  
*(Ký và ghi rõ họ tên)*  
**TS. Hoàng Đức Em**`;
}

/**
 * 2. Hàm sinh Slide Thuyết Trình chuẩn 12 slides chuyên sâu kèm đầy đủ ghi chú
 */
function generatePresentationDeck(courseCode, courseName, weekNum, topicName) {
  const data = resolveCurriculumWeekData(courseCode, courseName, weekNum, topicName);
  const cInfo = data.course;
  const currentTopic = data.topic;

  return [
    {
      slide: 1,
      title: `BÀI GIẢNG TUẦN ${data.weekNum}: ${currentTopic.toUpperCase()}`,
      subtitle: `Học phần: ${cInfo.name} (${cInfo.code}) • Trường ĐH TechCorp • Chuẩn Bộ GD&ĐT (TT 08)`,
      notes: `Giảng viên chào lớp, giới thiệu tầm quan trọng của Tuần học số ${data.weekNum} trong tổng thể 15 tuần học phần và thông báo thời hạn làm bài kiểm tra quá trình.`
    },
    {
      slide: 2,
      title: 'Mục Tiêu Học Tập & Chuẩn Đầu Ra (CLO Matrix)',
      subtitle: 'Thang đo nhận thức Bloom C1 - C5 đáp ứng tiêu chuẩn AUN-QA',
      notes: 'Nhấn mạnh 3 mục tiêu cốt lõi: Nắm chắc nguyên lý bản chất (C1-C2), Cài đặt mã nguồn chuẩn mực (C3-C4), và Đảm bảo tính an toàn, tối ưu hiệu năng (C5).'
    },
    {
      slide: 3,
      title: 'Tình Huống Thực Tế Doanh Nghiệp (Industry Case Study)',
      subtitle: 'Tại sao các hệ thống quy mô lớn bắt buộc phải làm chủ chuyên đề này?',
      notes: 'Trình chiếu tình huống sự cố thực tế khi hệ thống chưa áp dụng đúng kỹ thuật chuẩn, kích thích người học cùng suy nghĩ giải pháp tiếp cận.'
    },
    {
      slide: 4,
      title: 'Khái Niệm Cốt Lõi & Kiến Trúc Nền Tảng',
      subtitle: 'Sơ đồ luồng dữ liệu và cấu trúc giải thuật vận hành bên dưới',
      notes: 'Giải thích chi tiết các thuật ngữ chuyên môn, chỉ ra sự khác biệt giữa cách làm thủ công và cách tiếp cận quy chuẩn của hệ thống hiện đại.'
    },
    {
      slide: 5,
      title: 'Cơ Chế Hoạt Động & Quy Tắc Kỹ Thuật Chuyên Sâu',
      subtitle: 'Phân tích bản chất bên dưới hệ thống (Under the Hood Architecture)',
      notes: 'Đi sâu vào cơ chế cấp phát tài nguyên, giải thích tại sao hệ điều hành / DBMS xử lý dữ liệu theo cách này để đạt tính toàn vẹn cao nhất.'
    },
    {
      slide: 6,
      title: 'Cú Pháp Quy Chuẩn & Mã Nguồn Mẫu Minh Họa',
      subtitle: 'Phân tích từng dòng lệnh (Line-by-Line Breakdown)',
      notes: 'Chiếu code snippet/SQL mẫu, chú thích từng từ khóa quan trọng và phân tích điều kiện kiểm tra dữ liệu đầu vào an toàn.'
    },
    {
      slide: 7,
      title: 'Các Bẫy Lỗi Thường Gặp & Biện Pháp Khắc Phục (Pitfalls)',
      subtitle: 'Common Pitfalls & Best Practices được đúc kết từ thực tế',
      notes: 'Chỉ rõ 3 sai lầm phổ biến nhất mà sinh viên và kỹ sư mới thường mắc phải, hướng dẫn cách bắt ngoại lệ (Exception Handling).'
    },
    {
      slide: 8,
      title: 'Bài Toán Thực Hành Trực Tiếp Tại Lớp (Hands-on Lab)',
      subtitle: 'Áp dụng kiến thức giải quyết bài toán nghiệp vụ cụ thể',
      notes: 'Mời sinh viên mở môi trường thực hành, giao bài tập 15 phút tại lớp và quan sát hỗ trợ sinh viên gặp sự cố.'
    },
    {
      slide: 9,
      title: 'Hướng Dẫn Lời Giải & Đánh Giá Tối Ưu',
      subtitle: 'So sánh các phương án giải pháp khác nhau về độ phức tạp và RAM',
      notes: 'Tổng kết lời giải chuẩn, phân tích tại sao giải pháp này tối ưu hơn về thời gian thực thi O(log N) hoặc tối ưu dung lượng RAM.'
    },
    {
      slide: 10,
      title: 'Đánh Giá Nhanh: 5 Phút Mini-Quiz Trên LMS',
      subtitle: 'Quét mã QR hoặc truy cập lms.techcorp.info.vn',
      notes: 'Yêu cầu sinh viên thực hiện bài trắc nghiệm nhanh 4 câu củng cố kiến thức để ghi nhận điểm tham gia bài học tích cực.'
    },
    {
      slide: 11,
      title: 'Tổng Kết Nội Dung Bài Học & Đối Chiếu Chuẩn Đầu Ra',
      subtitle: 'Những kiến thức cốt lõi bắt buộc phải ghi nhớ sau buổi học',
      notes: 'Điểm lại 3 ý chính của buổi học và kiểm tra xem sinh viên đã tự tin hoàn thành các chuẩn LLO đã cam kết ban đầu chưa.'
    },
    {
      slide: 12,
      title: 'Nhiệm Vụ Tự Học 6 Giờ/Tuần & Chuẩn Bị Cho Buổi Sau',
      subtitle: 'Quy định tự học theo hệ thống tín chỉ Bộ GD&ĐT (TT 08/2021)',
      notes: 'Dặn dò thời hạn nộp bài tập lớn trên hệ thống LMS trước 23:59 Chủ nhật và tài liệu đọc trước cho tuần học tiếp theo.'
    }
  ];
}

/**
 * 3. Hàm sinh Kịch bản Video Studio số hóa 15 phút chuẩn Teleprompter kèm điểm dừng tương tác
 */
function generateStudioVideoScript(courseCode, courseName, weekNum, topicName) {
  const data = resolveCurriculumWeekData(courseCode, courseName, weekNum, topicName);
  const cInfo = data.course;
  const currentTopic = data.topic;

  return {
    title: `Kịch Bản Video Bài Giảng Studio Số Hóa: Tuần ${data.weekNum} — ${currentTopic}`,
    duration_minutes: 15,
    scenes: [
      {
        time: '00:00 - 02:30',
        visual: '[Camera 1: Trung cảnh giảng viên đứng trước phông Studio số hóa; Đồ họa tiêu đề bài giảng và logo trường hiện góc trên bên phải]',
        audio: `Chào mừng toàn thể các bạn sinh viên đã quay trở lại với học phần ${cInfo.name}. Trong tuần học số ${data.weekNum} ngày hôm nay, chúng ta sẽ cùng nhau nghiên cứu một chuyên đề có tính ứng dụng sống còn trong các dự án công nghệ, đó chính là: ${currentTopic}. Sau bài giảng 15 phút này, các bạn sẽ hiểu tường tận bản chất nguyên lý và tự tay xây dựng được chương trình chuẩn mực đáp ứng yêu cầu thực tế. Hãy chuẩn bị sẵn sàng môi trường thực hành và chúng ta cùng bắt đầu ngay bây giờ!`,
        cue: 'Chèn nhạc nền dạo đầu năng động; Fade out khi giảng viên cất lời.'
      },
      {
        time: '02:30 - 07:00',
        visual: '[Camera 2: Cận cảnh màn hình bài giảng điện tử; Giảng viên dùng bút điện tử highlight các từ khóa quan trọng và sơ đồ kiến trúc]',
        audio: `Nội dung cốt lõi của ${currentTopic} được xây dựng dựa trên nguyên lý: ${data.theory.substring(0, 280)}... Các bạn cần đặc biệt lưu ý sự khác biệt giữa cách tiếp cận thủ công và cách tiếp cận chuẩn hóa. Khi chúng ta kiểm soát tốt luồng dữ liệu, hệ thống sẽ vận hành mượt mà và triệt tiêu được các nguy cơ phát sinh lỗi tiềm ẩn.`,
        cue: 'Hiệu ứng zoom-in vào sơ đồ khối luân chuyển dữ liệu.'
      },
      {
        time: '07:00 - 08:00',
        visual: '[ĐIỂM DỪNG TƯƠNG TÁC SỐ HÓA — CHECKPOINT INTERACTIVE QUIZ]: Video tự động dừng lại, xuất hiện Pop-up câu hỏi kiểm tra khả năng tiếp thu của người học',
        audio: `Trước khi bước vào phần thực hành live demo, hệ thống có một câu hỏi trắc nghiệm nhanh 60 giây xuất hiện trên màn hình. Các bạn hãy chọn phương án chính xác nhất để mở khóa phần tiếp theo của bài học nhé!`,
        cue: 'Đếm ngược 60 giây; Phát âm thanh chúc mừng khi sinh viên chọn đúng.'
      },
      {
        time: '08:00 - 12:30',
        visual: '[Quay màn hình IDE / RDBMS trạm làm việc; Giảng viên live code từng dòng lệnh và chạy thử nghiệm ca biên]',
        audio: `Bây giờ chúng ta sẽ cùng quan sát màn hình IDE. Hãy nhìn vào đoạn mã lệnh mẫu: ${data.code_sample.substring(0, 150)}... Một sai lầm rất nguy hiểm mà nhiều bạn thường mắc phải đó là: ${data.pitfalls.substring(0, 180)}. Nếu không bắt ngoại lệ ở đây, ứng dụng sẽ bị crash ngay lập tức!`,
        cue: 'Hiệu ứng viền đỏ cảnh báo khi giảng viên giải thích bẫy lỗi.'
      },
      {
        time: '12:30 - 15:00',
        visual: '[Camera 1: Toàn cảnh Studio; Slide tóm tắt 3 kết luận chính và link nộp bài tập trên hệ thống LMS]',
        audio: `Như vậy trong 15 phút vừa qua, chúng ta đã chinh phục trọn vẹn chuyên đề: ${currentTopic}. Nhiệm vụ của các bạn tuần này là hoàn thành 3 bài tập Lab thực hành và nộp mã nguồn lên hệ thống TechCorp LMS trước 23:59 Chủ nhật. Đừng quên ôn tập cho kỳ thi kết thúc học phần sắp tới. Chúc các bạn học tập thật tốt và hẹn gặp lại trong bài giảng Tuần ${data.weekNum + 1}!`,
        cue: 'Hiển thị mã QR liên kết trực tiếp tới module Tuần ' + data.weekNum + ' trên LMS; Fade out kết thúc.'
      }
    ]
  };
}

/**
 * 4. Hàm sinh Bộ câu hỏi trắc nghiệm đánh giá quá trình 4 cấp độ Bloom chuẩn TT 08
 */
function generateBloomFormativeQuiz(courseCode, courseName, weekNum, topicName) {
  const data = resolveCurriculumWeekData(courseCode, courseName, weekNum, topicName);
  const cInfo = data.course;
  const currentTopic = data.topic;

  // Nếu trong kho học phần đã có sẵn bộ câu hỏi thiết kế riêng cho tuần thì ưu tiên sử dụng
  if (data.custom_quiz && data.custom_quiz.length >= 4) {
    return data.custom_quiz.map((q, idx) => ({ id: idx + 1, ...q }));
  }

  // Tự động sinh bộ câu hỏi phân tầng 4 cấp độ Bloom bám sát môn học
  return [
    {
      id: 1,
      bloom: 'Nhận biết (C1)',
      question: `Theo quy chuẩn học phần ${cInfo.name}, khái niệm cốt lõi nào sau đây mô tả chính xác nhất nội dung chuyên đề ${currentTopic}?`,
      options: [
        { key: 'A', text: `Khái niệm và định nghĩa quy chuẩn theo tài liệu giảng dạy chính thức của học phần ${cInfo.code}`, is_correct: true },
        { key: 'B', text: 'Khái niệm chỉ áp dụng riêng cho các dự án quy mô nhỏ không đạt chuẩn', is_correct: false },
        { key: 'C', text: 'Kỹ thuật đã lỗi thời bị thay thế hoàn toàn trong thực tế', is_correct: false },
        { key: 'D', text: 'Thuật toán không có tính ứng dụng trong các hệ thống hiện đại', is_correct: false }
      ],
      explanation: `Phương án A là định nghĩa chuẩn mực được quy định trong đề cương chi tiết học phần ${cInfo.code} theo Thông tư 08/2021/TT-BGDĐT.`
    },
    {
      id: 2,
      bloom: 'Thông hiểu (C2)',
      question: `Ý nghĩa quan trọng nhất của việc kiểm soát luồng dữ liệu và bắt ngoại lệ trong ${currentTopic} là gì?`,
      options: [
        { key: 'A', text: 'Bảo đảm tính toàn vẹn dữ liệu, ngăn ngừa crash ứng dụng và duy trì tính ổn định của hệ thống', is_correct: true },
        { key: 'B', text: 'Làm tăng dung lượng tệp tin mã nguồn lên gấp đôi', is_correct: false },
        { key: 'C', text: 'Chỉ phục vụ mục đích kiểm tra lý thuyết không có tác dụng thực tế', is_correct: false },
        { key: 'D', text: 'Không mang lại lợi ích trong môi trường sản xuất của doanh nghiệp', is_correct: false }
      ],
      explanation: 'Bắt ngoại lệ và kiểm soát biên giúp hệ thống xử lý ổn định ngay cả khi gặp dữ liệu bất thường hoặc bị tấn công khai thác lỗi.'
    },
    {
      id: 3,
      bloom: 'Vận dụng (C3)',
      question: `Khi triển khai bài toán thực tế thuộc chuyên đề ${currentTopic}, giải pháp kỹ thuật nào sau đây mang lại hiệu quả cao nhất?`,
      options: [
        { key: 'A', text: 'Sử dụng cấu trúc dữ liệu tối ưu, phân rã module chuẩn và giải phóng tài nguyên kịp thời', is_correct: true },
        { key: 'B', text: 'Dùng vòng lặp lồng nhau vô hạn để kiểm tra liên tục', is_correct: false },
        { key: 'C', text: 'Lưu trữ toàn bộ dữ liệu trên biến toàn cục không kiểm soát phạm vi', is_correct: false },
        { key: 'D', text: 'Bỏ qua việc phân quyền và bỏ qua các ràng buộc bảo mật dữ liệu', is_correct: false }
      ],
      explanation: 'Tối ưu hóa cấu trúc dữ liệu và giải phóng tài nguyên là nguyên tắc cốt lõi giúp hệ thống đạt chuẩn kỹ thuật và sẵn sàng mở rộng.'
    },
    {
      id: 4,
      bloom: 'Vận dụng cao (C4)',
      question: `Trong tình huống hệ thống gặp sự cố nghẽn cổ chai hoặc xung đột dữ liệu liên quan đến ${currentTopic}, kỹ sư cần tiến hành quy trình xử lý nào?`,
      options: [
        { key: 'A', text: 'Khoanh vùng điểm nghẽn, kiểm tra nhật ký lỗi (Audit Log), tối ưu hóa thuật toán và thiết lập cơ chế khóa an toàn', is_correct: true },
        { key: 'B', text: 'Xóa toàn bộ CSDL và mã nguồn cũ để viết lại từ đầu', is_correct: false },
        { key: 'C', text: 'Khởi động lại máy chủ liên tục mỗi 5 phút', is_correct: false },
        { key: 'D', text: 'Tắt toàn bộ các ràng buộc toàn vẹn dữ liệu để tăng tốc độ ghi', is_correct: false }
      ],
      explanation: 'Quy trình chuẩn mực là phân tích nhật ký kiểm toán, cô lập khối xử lý gây nghẽn và tối ưu hóa giải thuật mà không làm mất tính toàn vẹn dữ liệu.'
    }
  ];
}

module.exports = {
  COURSE_CURRICULA,
  resolveCurriculumWeekData,
  generateHigherEducationLessonPlan,
  generatePresentationDeck,
  generateStudioVideoScript,
  generateBloomFormativeQuiz
};

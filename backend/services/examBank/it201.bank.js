// backend/services/examBank/it201.bank.js
// Ngân hàng câu hỏi chuẩn hóa: IT201 — Cơ Sở Dữ Liệu
// Tổng cộng: 120 câu hỏi (3 Đề gốc x 40 câu hỏi)
'use strict';

function q(id, content, difficulty, answers, correctIdx, clo = 'CLO1') {
  return {
    id,
    course_code: 'IT201',
    content,
    difficulty,
    default_mark: 0.25,
    clo,
    answers: answers.map((text, idx) => ({
      id: `${id}_A${idx + 1}`,
      letter: ['A', 'B', 'C', 'D'][idx],
      content: text,
      is_correct: idx === correctIdx,
      fraction: idx === correctIdx ? 1.0 : 0.0
    }))
  };
}

// ĐỀ GỐC 1 (40 câu): Mô hình ER/EER, Ràng buộc toàn vẹn, Đại số quan hệ
const root1 = [
  // Nhận biết (10 câu)
  q('IT201_Q001', 'Trong mô hình quan hệ (Relational Model), một dòng trong bảng biểu diễn cho khái niệm nào?', 'EASY', ['Thuộc tính (Attribute)', 'Bộ (Tuple) hoặc bản ghi', 'Lược đồ quan hệ (Schema)', 'Miền giá trị (Domain)'], 1, 'CLO1'),
  q('IT201_Q002', 'Khóa chính (Primary Key) của một quan hệ bắt buộc phải thỏa mãn tính chất nào sau đây?', 'EASY', ['Chỉ chứa các giá trị dương', 'Duy nhất (Unique) và không được phép chứa giá trị NULL', 'Tự động tăng dần', 'Có ít nhất hai thuộc tính'], 1, 'CLO1'),
  q('IT201_Q003', 'Trong mô hình thực thể liên kết (ER Diagram), thực thể thường được biểu diễn bằng hình gì?', 'EASY', ['Hình chữ nhật', 'Hình thoi', 'Hình elip', 'Hình tam giác'], 0, 'CLO1'),
  q('IT201_Q004', 'Trong mô hình ER, mối kết hợp (Relationship) giữa các thực thể được ký hiệu bằng hình gì?', 'EASY', ['Hình tròn', 'Hình thoi', 'Hình chữ nhật', 'Đường đứt nét'], 1, 'CLO1'),
  q('IT201_Q005', 'Thuộc tính đa trị (Multivalued Attribute) trong sơ đồ ER được biểu diễn bằng ký hiệu nào?', 'EASY', ['Hình elip nét kép', 'Hình chữ nhật nét kép', 'Hình thoi nét đứt', 'Gạch chân thuộc tính'], 0, 'CLO1'),
  q('IT201_Q006', 'Phép toán nào trong đại số quan hệ dùng để trích chọn các dòng (bộ) thỏa mãn điều kiện chỉ định?', 'EASY', ['Phép chiếu (Project - π)', 'Phép chọn (Select - σ)', 'Phép kết nối (Join - ⨝)', 'Phép tích Descartes (×)'], 1, 'CLO1'),
  q('IT201_Q007', 'Phép toán nào trong đại số quan hệ dùng để trích chọn một số cột thuộc tính từ một quan hệ?', 'EASY', ['Phép chọn (σ)', 'Phép chiếu (π)', 'Phép hợp (∪)', 'Phép chia (÷)'], 1, 'CLO1'),
  q('IT201_Q008', 'Ràng buộc toàn vẹn thực thể (Entity Integrity Constraint) quy định điều gì?', 'EASY', ['Khóa ngoại không được rỗng', 'Không có thuộc tính nào thuộc khóa chính mang giá trị NULL', 'Tất cả các trường phải là kiểu số', 'Dữ liệu không được trùng lặp ở mọi cột'], 1, 'CLO1'),
  q('IT201_Q009', 'Ràng buộc toàn vẹn tham chiếu (Referential Integrity Constraint) liên quan đến khái niệm nào?', 'EASY', ['Khóa chính', 'Khóa ngoại (Foreign Key)', 'Chỉ mục (Index)', 'Khóa ứng viên'], 1, 'CLO1'),
  q('IT201_Q010', 'Hệ quản trị cơ sở dữ liệu (DBMS) phổ biến nào sau đây thuộc mô hình quan hệ phân hệ SQL?', 'EASY', ['MongoDB', 'Redis', 'MySQL / PostgreSQL', 'Neo4j'], 2, 'CLO1'),

  // Thông hiểu (15 câu)
  q('IT201_Q011', 'Khi một bảng có nhiều khóa ứng viên (Candidate Keys), người thiết kế sẽ chọn một khóa làm:', 'MEDIUM', ['Khóa thay thế (Surrogate Key)', 'Khóa chính (Primary Key)', 'Khóa ngoại (Foreign Key)', 'Chỉ mục thứ cấp'], 1, 'CLO2'),
  q('IT201_Q012', 'Mối quan hệ 1 - N (Một - Nhiều) giữa Khoa và Sinh viên được chuyển đổi sang mô hình quan hệ như thế nào?', 'MEDIUM', ['Thêm mã Sinh viên vào bảng Khoa', 'Thêm mã Khoa làm khóa ngoại (Foreign Key) trong bảng Sinh viên', 'Tạo một bảng liên kết trung gian bắt buộc', 'Không cần ràng buộc'], 1, 'CLO2'),
  q('IT201_Q013', 'Mối quan hệ N - M (Nhiều - Nhiều) giữa Sinh viên và Môn học được biểu diễn trong mô hình quan hệ bằng cách nào?', 'MEDIUM', ['Thêm mã Môn học vào bảng Sinh viên', 'Thêm mã Sinh viên vào bảng Môn học', 'Tạo một quan hệ trung gian (Junction Table) chứa khóa ngoại trỏ tới 2 bảng và tạo thành khóa chính phức hợp', 'Gộp 2 bảng thành 1'], 2, 'CLO2'),
  q('IT201_Q014', 'Cho quan hệ R có 5 bộ và quan hệ S có 4 bộ. Kết quả của phép tích Descartes R × S sẽ có bao nhiêu bộ?', 'MEDIUM', ['9 bộ', '20 bộ', '1 bộ', 'Không xác định'], 1, 'CLO2'),
  q('IT201_Q015', 'Điều kiện để hai quan hệ R và S có thể thực hiện được phép Hợp (Union: R ∪ S) là gì?', 'MEDIUM', ['Chúng phải có cùng số dòng', 'Chúng phải khả hợp (Union-compatible: cùng bậc và các miền giá trị thuộc tính tương ứng tương thích)', 'Chúng phải có cùng khóa chính', 'Tên các thuộc tính phải hoàn toàn trùng nhau'], 1, 'CLO2'),
  q('IT201_Q016', 'Phép kết nối tự nhiên (Natural Join: R ⨝ S) thực hiện kết nối dựa trên cơ chế nào?', 'MEDIUM', ['Kết nối trên mọi thuộc tính có cùng tên giữa hai quan hệ với phép so sánh bằng', 'Kết nối dựa trên khóa chính của bảng đầu tiên', 'Tích Descartes rồi nhân đôi thuộc tính', 'Kết nối ngẫu nhiên các dòng'], 0, 'CLO2'),
  q('IT201_Q017', 'Khóa ngoại (Foreign Key) có thể chứa giá trị NULL trong trường hợp nào?', 'MEDIUM', ['Không bao giờ được phép chứa NULL', 'Được phép chứa NULL nếu mối quan hệ giữa hai thực thể là tùy chọn (Optional) và không thuộc khóa chính', 'Chỉ được chứa NULL khi bảng rỗng', 'Chỉ khi khóa ngoại là kiểu chuỗi'], 1, 'CLO2'),
  q('IT201_Q018', 'Tùy chọn `ON DELETE CASCADE` trên khóa ngoại có ý nghĩa gì khi một bản ghi ở bảng cha bị xóa?', 'MEDIUM', ['Báo lỗi và từ chối thao tác xóa', 'Tự động xóa tất cả các bản ghi con tương ứng ở bảng tham chiếu', 'Đặt giá trị khóa ngoại ở bảng con thành NULL', 'Không có hành động gì'], 1, 'CLO2'),
  q('IT201_Q019', 'Tùy chọn `ON DELETE SET NULL` trên khóa ngoại yêu cầu điều kiện gì đối với cột khóa ngoại ở bảng con?', 'MEDIUM', ['Cột khóa ngoại phải là kiểu số', 'Cột khóa ngoại phải cho phép giá trị NULL (không có ràng buộc NOT NULL)', 'Cột khóa ngoại phải là khóa chính', 'Bảng con phải rỗng'], 1, 'CLO2'),
  q('IT201_Q020', 'Biểu thức đại số quan hệ `π_HoTen, Diem (σ_Diem >= 8 (KET_QUA))` có ý nghĩa gì?', 'MEDIUM', ['Tìm họ tên và điểm của tất cả sinh viên', 'Lọc ra các sinh viên có điểm >= 8 rồi chỉ chiếu hiển thị hai cột Họ tên và Điểm', 'Tính điểm trung bình của sinh viên đạt trên 8 điểm', 'Sắp xếp danh sách theo điểm giảm dần'], 1, 'CLO2'),
  q('IT201_Q021', 'Thực thể yếu (Weak Entity) trong mô hình ER là thực thể có đặc điểm gì?', 'MEDIUM', ['Không có thuộc tính nào', 'Không có đủ thuộc tính để tạo thành khóa chính của riêng nó, sự tồn tại phụ thuộc vào thực thể chủ (Owner Entity)', 'Chỉ chứa dữ liệu tạm thời', 'Luôn có quan hệ 1 - 1'], 1, 'CLO2'),
  q('IT201_Q022', 'Khóa phân biệt (Partial Key / Discriminator) của thực thể yếu được gạch chân như thế nào trong sơ đồ ER?', 'MEDIUM', ['Gạch chân nét liền', 'Gạch chân nét đứt đoạn', 'Không gạch chân', 'Gạch đôi'], 1, 'CLO2'),
  q('IT201_Q023', 'Mức độ trừu tượng nào trong kiến trúc 3 mức của ANSI-SPARC mô tả cấu trúc vật lý thực tế của dữ liệu trên đĩa từ?', 'MEDIUM', ['Mức ngoài (External Level)', 'Mức quan niệm (Conceptual Level)', 'Mức trong (Internal / Physical Level)', 'Mức logic'], 2, 'CLO2'),
  q('IT201_Q024', 'Tính độc lập dữ liệu logic (Logical Data Independence) bảo đảm điều gì?', 'MEDIUM', ['Thay đổi cấu trúc lưu trữ vật lý không ảnh hưởng tới chương trình ứng dụng', 'Thay đổi lược đồ quan niệm (như thêm cột, thêm bảng) không làm ảnh hưởng tới các khung nhìn ngoài và ứng dụng hiện hữu', 'Dữ liệu không bao giờ bị mất', 'Tốc độ truy vấn luôn không đổi'], 1, 'CLO2'),
  q('IT201_Q025', 'Phép trừ quan hệ `R - S` trả về kết quả gì?', 'MEDIUM', ['Các bộ thuộc cả R và S', 'Tất cả các bộ thuộc R nhưng không xuất hiện trong S', 'Các bộ thuộc S nhưng không có trong R', 'Tập rỗng'], 1, 'CLO2'),

  // Vận dụng (10 câu)
  q('IT201_Q026', 'Cho lược đồ R(A, B, C, D) với khóa chính là (A, B). Phụ thuộc hàm `A -> C` vi phạm dạng chuẩn nào sau đây?', 'HARD', ['1NF', '2NF (do tồn tại phụ thuộc hàm bộ phận vào một phần khóa chính)', '3NF', 'Không vi phạm'], 1, 'CLO3'),
  q('IT201_Q027', 'Phép chia đại số quan hệ `R ÷ S` thường được áp dụng trong các bài toán truy vấn có dạng điều kiện nào?', 'HARD', ['Tìm kiếm gần đúng', 'Truy vấn dạng "với tất cả" (for all / universal quantification)', 'Tính giá trị trung bình', 'Sắp xếp danh sách'], 1, 'CLO3'),
  q('IT201_Q028', 'Cho quan hệ R(A, B, C) và S(B, C, D). Khi thực hiện phép kết nối tự nhiên R ⨝ S, lược đồ kết quả có các thuộc tính nào?', 'HARD', ['(A, B, C, B, C, D)', '(A, B, C, D)', '(B, C)', '(A, D)'], 1, 'CLO3'),
  q('IT201_Q029', 'Nếu quan hệ R có n bộ và quan hệ S có m bộ. Phép kết nối ngoài trái (Left Outer Join) giữa R và S sẽ có số bộ tối thiểu là bao nhiêu?', 'HARD', ['0 bộ', 'n bộ', 'm bộ', 'n + m bộ'], 1, 'CLO3'),
  q('IT201_Q030', 'Trong mô hình ER mở rộng (EER), quan hệ Chuyên biệt hóa (Specialization / Is-A) thể hiện quan hệ nào trong hướng đối tượng?', 'HARD', ['Kế thừa (Inheritance)', 'Bao đóng (Encapsulation)', 'Đa hình (Polymorphism)', 'Trừu tượng hóa'], 0, 'CLO3'),
  q('IT201_Q031', 'Điều kiện Disjoint (Dời nhau) trong chuyên biệt hóa quy định điều gì?', 'HARD', ['Một thực thể lớp cha có thể thuộc nhiều lớp con cùng lúc', 'Một thực thể lớp cha chỉ có thể thuộc tối đa một lớp thực thể con duy nhất', 'Mọi thực thể bắt buộc phải thuộc lớp con', 'Lớp con không kế thừa thuộc tính'], 1, 'CLO3'),
  q('IT201_Q032', 'Một lược đồ quan hệ ở dạng 3NF nhưng chưa đạt BCNF khi nào?', 'HARD', ['Khi tồn tại phụ thuộc hàm bắc cầu', 'Khi có phụ thuộc hàm X -> A trong đó X không phải siêu khóa nhưng A là thuộc tính khóa (thuộc tính nguyên tố)', 'Khi có thuộc tính đa trị', 'Khi khóa chính là số thực'], 1, 'CLO3'),
  q('IT201_Q033', 'Thuộc tính dẫn xuất (Derived Attribute) trong mô hình ER nên được xử lý thế nào khi thiết kế cơ sở dữ liệu quan hệ?', 'HARD', ['Bắt buộc phải lưu trữ thành một cột vật lý', 'Thường không cần lưu trữ vật lý mà được tính toán động qua câu truy vấn (View/Computed Column) để tránh dư thừa và mâu thuẫn', 'Phải biến thành bảng trung gian', 'Xóa bỏ hoàn toàn khỏi hệ thống'], 1, 'CLO3'),
  q('IT201_Q034', 'Biểu thức `σ_A=5(R ⨝ S)` có thể được tối ưu hóa theo quy tắc đại số quan hệ thành biểu thức nào?', 'HARD', ['(σ_A=5(R)) ⨝ S (Đẩy phép chọn xuống trước phép kết nối nếu A thuộc R)', 'σ_A=5(R) × S', 'π_A(R) ⨝ S', 'R ⨝ (σ_A=5(S))'], 0, 'CLO3'),
  q('IT201_Q035', 'Khi chuyển đổi thuộc tính đa trị của một thực thể sang mô hình quan hệ, giải pháp chuẩn hóa là gì?', 'HARD', ['Gộp các giá trị thành chuỗi cách nhau bằng dấu phẩy', 'Tạo bảng riêng chứa khóa chính của thực thể gốc và thuộc tính đa trị đó, cặp này tạo thành khóa chính của bảng mới', 'Tạo ra 10 cột phụ trong bảng gốc', 'Bỏ qua không lưu'], 1, 'CLO3'),

  // Vận dụng cao (5 câu)
  q('IT201_Q036', 'Khái niệm "Lossless Join Decomposition" (Phân rã kết nối không mất mát thông tin) được đảm bảo khi nào?', 'EXPERT', ['Khi hai bảng con có cùng số lượng cột', 'Giao của hai tập thuộc tính phân rã (R1 ∩ R2) phải là siêu khóa của ít nhất một trong hai quan hệ R1 hoặc R2', 'Khi không dùng khóa ngoại', 'Khi dữ liệu trong bảng không có giá trị 0'], 1, 'CLO4'),
  q('IT201_Q037', 'Tại sao trong thực tế, các hệ thống cơ sở dữ liệu giao dịch thương mại điện tử lớn lại chấp nhận phi chuẩn hóa (Denormalization)?', 'EXPERT', ['Vì lập trình viên không biết chuẩn hóa', 'Để giảm thiểu số phép JOIN tốn kém tài nguyên, tăng tốc độ đọc dữ liệu phục vụ báo cáo với dung lượng lớn', 'Để tiết kiệm dung lượng ổ đĩa', 'Để loại bỏ hoàn toàn khóa chính'], 1, 'CLO4'),
  q('IT201_Q038', 'Hệ tiên đề Armstrong gồm 3 luật cơ bản nào sau đây?', 'EXPERT', ['Luật giao hoán, kết hợp, phân phối', 'Luật phản xạ (Reflexivity), tăng trưởng (Augmentation), bắc cầu (Transitivity)', 'Luật hợp, luật trừ, luật nhân', 'Luật chọn, chiếu, kết nối'], 1, 'CLO4'),
  q('IT201_Q039', 'Định lý Codd khẳng định điều gì về sức mạnh biểu diễn của Ngôn ngữ hỏi quan hệ?', 'EXPERT', ['Ngôn ngữ SQL luôn chạy nhanh hơn NoSQL', 'Mọi câu truy vấn biểu diễn được bằng Đại số quan hệ đều có thể biểu diễn tương đương bằng Phép tính quan hệ (Relational Calculus)', 'Mọi cơ sở dữ liệu đều có thể lưu trữ trong RAM', 'Mô hình phân cấp tốt hơn mô hình quan hệ'], 1, 'CLO4'),
  q('IT201_Q040', 'Trong tối ưu hóa truy vấn bằng cây cú pháp đại số quan hệ (Query Tree), thao tác nào sau đây mang lại hiệu quả giảm chi phí I/O lớn nhất?', 'EXPERT', ['Thực hiện phép tích Descartes trước', 'Đẩy phép chọn (Selection) và phép chiếu (Projection) xuống các nút lá càng sâu càng tốt trước khi thực hiện các phép kết nối (Join)', 'Chuyển toàn bộ phép Join thành Outer Join', 'Thực hiện sắp xếp Sort ở nút lá'], 1, 'CLO4')
];

// ĐỀ GỐC 2 (40 câu): Lý thuyết phụ thuộc hàm, Thuật toán bao đóng, Dạng chuẩn hóa dữ liệu
const root2 = [
  // Nhận biết (10 câu)
  q('IT201_Q041', 'Phụ thuộc hàm (Functional Dependency) ký hiệu `X -> Y` phát biểu rằng:', 'EASY', ['X và Y luôn có giá trị bằng nhau', 'Nếu hai bộ có cùng giá trị trên tập thuộc tính X thì chúng bắt buộc phải có cùng giá trị trên tập thuộc tính Y', 'X là tập con của Y', 'Y là khóa chính'], 1, 'CLO1'),
  q('IT201_Q042', 'Dạng chuẩn 1NF (First Normal Form) đòi hỏi điều kiện gì?', 'EASY', ['Mỗi bảng phải có ít nhất 3 cột', 'Tất cả các thuộc tính phải mang giá trị nguyên tố (Atomic values), không chứa thuộc tính đa trị hay thuộc tính phức hợp', 'Không có khóa ngoại', 'Dữ liệu được sắp xếp tăng dần'], 1, 'CLO1'),
  q('IT201_Q043', 'Dạng chuẩn 2NF (Second Normal Form) đòi hỏi quan hệ phải đạt 1NF và thỏa mãn điều kiện gì?', 'EASY', ['Không có giá trị NULL', 'Mọi thuộc tính không khóa phải phụ thuộc hàm đầy đủ vào khóa chính (không phụ thuộc bộ phận vào một phần của khóa)', 'Mọi thuộc tính đều là số', 'Không có bảng phụ'], 1, 'CLO1'),
  q('IT201_Q044', 'Dạng chuẩn 3NF (Third Normal Form) loại bỏ loại phụ thuộc hàm nào khỏi quan hệ?', 'EASY', ['Phụ thuộc hàm đầy đủ', 'Phụ thuộc hàm bắc cầu (Transitive dependency) của thuộc tính không khóa vào khóa chính', 'Phụ thuộc hàm tầm thường', 'Phụ thuộc hàm đa trị'], 1, 'CLO1'),
  q('IT201_Q045', 'Dạng chuẩn Boyce-Codd (BCNF) nghiêm ngặt hơn 3NF ở điểm nào?', 'EASY', ['Với mọi phụ thuộc hàm không tầm thường X -> Y, X bắt buộc phải là một Siêu khóa (Superkey)', 'Không cho phép khóa chính có quá 1 thuộc tính', 'Chỉ áp dụng cho cơ sở dữ liệu NoSQL', 'Bắt buộc các cột phải là kiểu chuỗi'], 0, 'CLO1'),
  q('IT201_Q046', 'Thuộc tính nguyên tố (Prime Attribute) trong một lược đồ quan hệ là thuộc tính:', 'EASY', ['Là số nguyên tố', 'Xuất hiện trong ít nhất một khóa ứng viên bất kỳ của quan hệ', 'Không thuộc bất kỳ khóa nào', 'Luôn mang giá trị duy nhất'], 1, 'CLO1'),
  q('IT201_Q047', 'Ký hiệu `X^+` (Closure of X) đại diện cho khái niệm gì trong lý thuyết cơ sở dữ liệu?', 'EASY', ['Số lượng thuộc tính của X', 'Bao đóng của tập thuộc tính X dưới một tập phụ thuộc hàm F', 'Khóa ngoại của X', 'Phần bù của X'], 1, 'CLO1'),
  q('IT201_Q048', 'Một phụ thuộc hàm `X -> Y` được gọi là tầm thường (Trivial) khi nào?', 'EASY', ['Khi X và Y đều rỗng', 'Khi Y là tập con của X (Y ⊆ X)', 'Khi X là khóa chính', 'Khi X và Y không có điểm chung'], 1, 'CLO1'),
  q('IT201_Q049', 'Hiện tượng dị thường khi xóa (Deletion Anomaly) xảy ra khi nào?', 'EASY', ['Xóa dữ liệu khiến RAM bị tràn', 'Xóa một thông tin nào đó vô tình làm mất luôn thông tin quan trọng khác không liên quan do thiết kế bảng chưa chuẩn hóa', 'Không thể xóa dữ liệu vì tệp bị khóa', 'Tự động xóa toàn bộ bảng'], 1, 'CLO1'),
  q('IT201_Q050', 'Hiện tượng dị thường khi cập nhật (Update Anomaly) xảy ra do nguyên nhân cốt lõi nào?', 'EASY', ['Do máy chủ mất điện', 'Do dữ liệu bị dư thừa (Redundancy), cùng một thông tin xuất hiện ở nhiều nơi dẫn tới mâu thuẫn khi chỉ cập nhật một chỗ', 'Do mạng Internet chậm', 'Do không tạo chỉ mục'], 1, 'CLO1'),

  // Thông hiểu (15 câu)
  q('IT201_Q051', 'Cho quan hệ R(A, B, C, D) với F = {A -> B, B -> C, C -> D}. Bao đóng của thuộc tính A là `A^+` bằng:', 'MEDIUM', ['{A}', '{A, B}', '{A, B, C, D}', '{B, C, D}'], 2, 'CLO2'),
  q('IT201_Q052', 'Một tập thuộc tính K là khóa (Key) của quan hệ R nếu nó thỏa mãn hai điều kiện nào?', 'MEDIUM', ['K^+ = R và K là tập cực tiểu (không có tập con thực sự nào của K có bao đóng bằng R)', 'K chỉ có 1 thuộc tính và không chứa NULL', 'K là khóa ngoại trỏ tới bảng khác', 'K được đánh chỉ mục B-Tree'], 0, 'CLO2'),
  q('IT201_Q053', 'Nếu một quan hệ có khóa chính chỉ gồm duy nhất 1 thuộc tính đơn lẻ và đã đạt 1NF, quan hệ đó có chắc chắn đạt 2NF không?', 'MEDIUM', ['Chưa chắc chắn đạt 2NF', 'Chắc chắn đạt 2NF vì không thể tồn tại phụ thuộc bộ phận vào một phần của khóa', 'Chỉ đạt 2NF khi không có giá trị NULL', 'Tự động đạt BCNF'], 1, 'CLO2'),
  q('IT201_Q054', 'Bao đóng của tập phụ thuộc hàm F (ký hiệu F^+) là:', 'MEDIUM', ['Tập hợp tất cả các phụ thuộc hàm có thể suy dẫn logic từ F nhờ hệ tiên đề Armstrong', 'Tập hợp các khóa của quan hệ', 'Tập hợp các bảng trong CSDL', 'Phủ tối thiểu của F'], 0, 'CLO2'),
  q('IT201_Q055', 'Một phủ cực tiểu (Minimal Cover / Canonical Cover) của tập phụ thuộc hàm F thỏa mãn tính chất nào?', 'MEDIUM', ['Vế phải của mỗi phụ thuộc hàm chỉ có đúng một thuộc tính đơn lẻ', 'Không chứa phụ thuộc hàm dư thừa và không chứa thuộc tính dư thừa ở vế trái', 'Tương đương logic với tập F ban đầu', 'Tất cả các điều trên đều đúng'], 3, 'CLO2'),
  q('IT201_Q056', 'Cho quan hệ SV(MaSV, HoTen, MaLop, TenLop). Khóa chính là MaSV. Tồn tại phụ thuộc hàm `MaLop -> TenLop`. Quan hệ này vi phạm dạng chuẩn nào?', 'MEDIUM', ['1NF', '2NF', '3NF (do TenLop phụ thuộc bắc cầu vào MaSV qua MaLop)', 'BCNF'], 2, 'CLO2'),
  q('IT201_Q057', 'Giải pháp chuẩn hóa quan hệ SV(MaSV, HoTen, MaLop, TenLop) về 3NF là tách thành 2 quan hệ nào?', 'MEDIUM', ['SV(MaSV, HoTen) và LOP(TenLop)', 'SINHVIEN(MaSV, HoTen, MaLop) và LOP(MaLop, TenLop)', 'SINHVIEN(MaSV, TenLop) và LOP(MaLop, HoTen)', 'Giữ nguyên bảng không tách'], 1, 'CLO2'),
  q('IT201_Q058', 'Quy tắc suy diễn nào cho phép từ `X -> Y` và `X -> Z` suy ra `X -> YZ`?', 'MEDIUM', ['Quy tắc bắc cầu', 'Quy tắc tựa bắc cầu', 'Quy tắc hợp (Union rule)', 'Quy tắc phân rã'], 2, 'CLO2'),
  q('IT201_Q059', 'Quy tắc suy diễn nào cho phép từ `X -> YZ` suy ra `X -> Y` và `X -> Z`?', 'MEDIUM', ['Quy tắc phân rã (Decomposition rule)', 'Quy tắc phản xạ', 'Quy tắc tăng trưởng', 'Quy tắc hợp'], 0, 'CLO2'),
  q('IT201_Q060', 'Cho quan hệ R(A, B, C) với F = {A -> B, B -> C, C -> A}. Số lượng khóa ứng viên của quan hệ này là:', 'MEDIUM', ['1 khóa (A)', '2 khóa (A, B)', '3 khóa ứng viên riêng biệt: {A}, {B}, {C}', 'Không có khóa nào'], 2, 'CLO2'),
  q('IT201_Q061', 'Tính chất bảo toàn phụ thuộc hàm (Dependency Preservation) khi phân rã một lược đồ R thành R1 và R2 nghĩa là:', 'MEDIUM', ['Các bảng con có cùng dung lượng', 'Hợp của các tập phụ thuộc hàm trên các bảng con có thể suy dẫn lại toàn bộ tập phụ thuộc hàm ban đầu (F1 ∪ F2)^+ = F^+', 'Không được phép thêm thuộc tính mới', 'Khóa chính không thay đổi'], 1, 'CLO2'),
  q('IT201_Q062', 'Khi phân rã một lược đồ quan hệ để đạt dạng chuẩn BCNF, điều gì có thể bị đánh đổi?', 'MEDIUM', ['Mất dữ liệu vĩnh viễn', 'Có thể không bảo toàn được tất cả các phụ thuộc hàm ban đầu', 'Tăng số lượng thuộc tính', 'Bảng bị khóa'], 1, 'CLO2'),
  q('IT201_Q063', 'Phụ thuộc đa trị (Multivalued Dependency - MVD: X ->-> Y) là cơ sở lý thuyết để định nghĩa dạng chuẩn nào?', 'MEDIUM', ['2NF', '3NF', '4NF (Dạng chuẩn 4)', 'BCNF'], 2, 'CLO2'),
  q('IT201_Q064', 'Dạng chuẩn 5NF (Fifth Normal Form / Project-Join Normal Form) liên quan tới việc loại bỏ hiện tượng nào?', 'MEDIUM', ['Phụ thuộc hàm bắc cầu', 'Phụ thuộc kết nối (Join Dependency) không tầm thường', 'Giá trị NULL', 'Khóa phức tạp'], 1, 'CLO2'),
  q('IT201_Q065', 'Thuật toán tìm một khóa của quan hệ bắt đầu từ tập thuộc tính nào?', 'MEDIUM', ['Tập rỗng', 'Tập tất cả các thuộc tính của quan hệ (X = R), sau đó lần lượt loại bỏ từng thuộc tính mà bao đóng vẫn chứa đủ R', 'Chỉ lấy thuộc tính đầu tiên', 'Lấy thuộc tính kiểu số'], 1, 'CLO2'),

  // Vận dụng (10 câu)
  q('IT201_Q066', 'Cho R(A, B, C, D, E) với F = {A -> BC, CD -> E, B -> D, E -> A}. Bao đóng của tập thuộc tính {B} là:', 'HARD', ['{B}', '{B, D}', '{B, D, E}', '{A, B, C, D, E}'], 1, 'CLO3'),
  q('IT201_Q067', 'Cho R(A, B, C, D) với F = {AB -> C, C -> D, D -> A}. Khóa của quan hệ R là những tập nào?', 'HARD', ['Chỉ có {AB}', '{AB}, {BC}, {CD}, {BD}', '{AB}, {BC}, {BD}', '{A, B, C, D}'], 1, 'CLO3'),
  q('IT201_Q068', 'Trong thuật toán tìm phủ tối thiểu, thao tác kiểm tra thuộc tính dư thừa ở vế trái của `XA -> Y` được thực hiện bằng cách:', 'HARD', ['Tính bao đóng của X theo F, nếu Y ⊆ X^+ thì A là thuộc tính dư thừa có thể loại bỏ', 'Tính bao đóng của Y', 'Xóa ngay A mà không cần kiểm tra', 'Đổi chỗ X và Y'], 0, 'CLO3'),
  q('IT201_Q069', 'Lược đồ quan hệ R(A, B, C) với F = {AB -> C, C -> A}. Lược đồ này đạt dạng chuẩn cao nhất là gì?', 'HARD', ['1NF', '2NF', '3NF (vì C -> A có A là thuộc tính nguyên tố thuộc khóa AB)', 'BCNF'], 2, 'CLO3'),
  q('IT201_Q070', 'Lược đồ R(A, B, C) với F = {AB -> C, C -> A} không đạt BCNF vì phụ thuộc hàm nào?', 'HARD', ['AB -> C', 'C -> A (do C không phải là một siêu khóa của R)', 'A -> B', 'B -> C'], 1, 'CLO3'),
  q('IT201_Q071', 'Khi phân rã R(A, B, C) với F = {AB -> C, C -> A} về BCNF, hai quan hệ con thu được là:', 'HARD', ['R1(A, B) và R2(B, C)', 'R1(C, A) và R2(B, C)', 'R1(A, C) và R2(A, B)', 'Không thể phân rã'], 1, 'CLO3'),
  q('IT201_Q072', 'Cho quan hệ R(MaNV, MaDA, SoGio, TenNV, TenDA, DiaDiem). Khóa chính là (MaNV, MaDA). Phụ thuộc hàm `MaNV -> TenNV` là dạng phụ thuộc gì?', 'HARD', ['Phụ thuộc hàm đầy đủ', 'Phụ thuộc hàm bộ phận (Partial dependency) vào một phần của khóa chính', 'Phụ thuộc hàm bắc cầu', 'Phụ thuộc hàm đa trị'], 1, 'CLO3'),
  q('IT201_Q073', 'Trong R(MaNV, MaDA, SoGio, TenNV, TenDA, DiaDiem), để đưa về 2NF cần tách quan hệ thành mấy bảng?', 'HARD', ['2 bảng', '3 bảng: NHANVIEN(MaNV, TenNV), DUAN(MaDA, TenDA, DiaDiem), PHANCONG(MaNV, MaDA, SoGio)', '4 bảng', '5 bảng'], 1, 'CLO3'),
  q('IT201_Q074', 'Cho R(A, B, C, D) với F = {A -> B, B -> C}. Phân rã R thành R1(A, B) và R2(B, C, D). Phân rã này có bảo toàn thông tin (Lossless Join) không?', 'HARD', ['Không bảo toàn', 'Có bảo toàn vì R1 ∩ R2 = {B}, và B -> BC (B là khóa của R2)', 'Chỉ bảo toàn khi có 4 dòng', 'Gây mất dữ liệu cột D'], 1, 'CLO3'),
  q('IT201_Q075', 'Một bảng chứa danh sách đơn hàng có trường `TongTien` được tính bằng `SUM(SoLuong * DonGia)`. Việc lưu trữ cột này là ví dụ của:', 'HARD', ['Vi phạm nghiêm trọng 1NF', 'Kỹ thuật phi chuẩn hóa (Denormalization) có kiểm soát nhằm tối ưu tốc độ đọc báo cáo tài chính', 'Dị thường khi xóa', 'Phụ thuộc hàm đa trị'], 1, 'CLO3'),

  // Vận dụng cao (5 câu)
  q('IT201_Q076', 'Thuật toán Bernstein (3NF Synthesis Algorithm) đảm bảo phân rã lược đồ quan hệ đạt được đồng thời hai tính chất quan trọng nào?', 'EXPERT', ['Không tốn RAM và không cần khóa chính', 'Bảo toàn kết nối không mất mát thông tin (Lossless Join) VÀ bảo toàn toàn bộ các phụ thuộc hàm ban đầu (Dependency Preservation)', 'Loại bỏ hoàn toàn chỉ mục', 'Chạy trong thời gian O(1)'], 1, 'CLO4'),
  q('IT201_Q077', 'Bài toán xác định xem một tập thuộc tính có phải là khóa ứng viên hay không trong trường hợp tổng quát thuộc lớp độ phức tạp nào?', 'EXPERT', ['Độ phức tạp tuyến tính O(n)', 'Bài toán thuộc lớp NP-Complete / Co-NP', 'O(log n)', 'Luôn tính được trong 1 giây'], 1, 'CLO4'),
  q('IT201_Q078', 'Thuật toán kiểm tra tính kết nối không mất mát (Tableau Algorithm / Chase Algorithm) sử dụng cấu trúc ma trận như thế nào?', 'EXPERT', ['Sử dụng các ký hiệu `a_j` cho thuộc tính ban đầu và `b_ij` cho biến tạm, liên tục áp dụng các phụ thuộc hàm cho đến khi xuất hiện một dòng toàn ký hiệu `a`', 'Nhân hai ma trận số thực', 'Duyệt đồ thị cây', 'Biến đổi Fourier'], 0, 'CLO4'),
  q('IT201_Q079', 'Trong thiết kế kho dữ liệu (Data Warehouse / OLAP), tại sao mô hình hình sao (Star Schema) lại cố tình vi phạm các dạng chuẩn 3NF/BCNF ở các bảng chiều (Dimension Tables)?', 'EXPERT', ['Vì kiến trúc sư không hiểu về dạng chuẩn', 'Để tối ưu hóa hiệu năng thực thi các phép tổng hợp dữ liệu OLAP phức tạp bằng cách hạn chế tối đa các phép JOIN nhiều cấp', 'Vì cơ sở dữ liệu OLAP không hỗ trợ khóa chính', 'Để giảm kích thước bộ nhớ RAM'], 1, 'CLO4'),
  q('IT201_Q080', 'Định lý Fagin liên quan tới điều kiện cần và đủ của phép phân rã kết nối không mất mát thông tin qua phụ thuộc hàm nào?', 'EXPERT', ['Phụ thuộc hàm bắc cầu', 'Phụ thuộc hàm đa trị (MVD): R phân rã thành R1(X, Y) và R2(X, Z) không mất mát khi và chỉ khi X ->-> Y hoặc X ->-> Z', 'Phụ thuộc hàm tầm thường', 'Phép kết nối ngoài'], 1, 'CLO4')
];

// ĐỀ GỐC 3 (40 câu): Ngôn ngữ SQL nâng cao, Quản lý giao dịch ACID, Chỉ mục Indexing, An toàn CSDL
const root3 = [
  // Nhận biết (10 câu)
  q('IT201_Q081', 'Lệnh SQL nào thuộc nhóm ngôn ngữ định nghĩa dữ liệu (DDL - Data Definition Language)?', 'EASY', ['SELECT', 'INSERT', 'CREATE TABLE', 'UPDATE'], 2, 'CLO1'),
  q('IT201_Q082', 'Lệnh SQL nào thuộc nhóm thao tác dữ liệu (DML - Data Manipulation Language)?', 'EASY', ['ALTER TABLE', 'DROP TABLE', 'INSERT INTO', 'TRUNCATE'], 2, 'CLO1'),
  q('IT201_Q083', 'Mệnh đề nào trong câu lệnh `SELECT` dùng để lọc các nhóm sau khi thực hiện gom nhóm bằng `GROUP BY`?', 'EASY', ['WHERE', 'HAVING', 'ORDER BY', 'LIMIT'], 1, 'CLO1'),
  q('IT201_Q084', 'Hàm tổng hợp nào trong SQL dùng để đếm số lượng bản ghi thỏa mãn điều kiện?', 'EASY', ['SUM()', 'COUNT()', 'AVG()', 'MAX()'], 1, 'CLO1'),
  q('IT201_Q085', 'Loại chỉ mục (Index) nào quyết định thứ tự lưu trữ vật lý thực tế của các bản ghi trên đĩa?', 'EASY', ['Clustered Index (Chỉ mục cụm)', 'Non-clustered Index (Chỉ mục không cụm)', 'Bitmap Index', 'Hash Index'], 0, 'CLO1'),
  q('IT201_Q086', 'Trong hệ quản trị cơ sở dữ liệu, một bảng vật lý có thể có tối đa bao nhiêu Clustered Index?', 'EASY', ['Vô số', 'Chỉ duy nhất 1 Clustered Index', 'Tối đa 16', 'Bằng số lượng cột'], 1, 'CLO1'),
  q('IT201_Q087', 'Thuộc tính ACID nào đảm bảo một giao dịch hoặc thực hiện thành công toàn bộ hoặc bị hủy bỏ hoàn toàn?', 'EASY', ['Atomicity (Tính nguyên tử)', 'Consistency (Tính nhất quán)', 'Isolation (Tính cô lập)', 'Durability (Tính bền vững)'], 0, 'CLO1'),
  q('IT201_Q088', 'Thuộc tính ACID nào bảo đảm dữ liệu của một giao dịch đã COMMIT sẽ không bao giờ bị mất kể cả khi sập nguồn điện?', 'EASY', ['Atomicity', 'Consistency', 'Isolation', 'Durability (Tính bền vững)'], 3, 'CLO1'),
  q('IT201_Q089', 'Lệnh SQL nào dùng để hủy bỏ tất cả các thay đổi của giao dịch hiện tại và quay về trạng thái trước đó?', 'EASY', ['COMMIT', 'ROLLBACK', 'SAVEPOINT', 'CHECKPOINT'], 1, 'CLO1'),
  q('IT201_Q090', 'Đối tượng View trong cơ sở dữ liệu quan hệ thực chất là gì?', 'EASY', ['Một bảng vật lý lưu trữ dữ liệu trùng lặp', 'Một bảng ảo dựa trên kết quả của một câu truy vấn SELECT định trước', 'Một file sao lưu', 'Một chương trình viết bằng C++'], 1, 'CLO1'),

  // Thông hiểu (15 câu)
  q('IT201_Q091', 'Sự khác biệt cốt lõi giữa mệnh đề `WHERE` và `HAVING` trong SQL là gì?', 'MEDIUM', ['WHERE dùng cho số, HAVING dùng cho chuỗi', 'WHERE lọc từng dòng đơn lẻ trước khi gom nhóm, còn HAVING lọc các nhóm sau khi đã thực hiện GROUP BY', 'HAVING chạy nhanh hơn WHERE', 'WHERE bắt buộc phải có GROUP BY'], 1, 'CLO2'),
  q('IT201_Q092', 'Lệnh `TRUNCATE TABLE SinhVien;` khác với `DELETE FROM SinhVien;` ở điểm nào?', 'MEDIUM', ['TRUNCATE xóa cấu trúc bảng', 'TRUNCATE xóa toàn bộ dữ liệu nhanh hơn bằng cách giải phóng trang dữ liệu, không ghi log từng dòng và thiết lập lại khóa tự tăng', 'DELETE không thể phục hồi bằng ROLLBACK', 'TRUNCATE chỉ xóa các dòng có giá trị NULL'], 1, 'CLO2'),
  q('IT201_Q093', 'Phép `INNER JOIN` giữa hai bảng trả về các bản ghi nào?', 'MEDIUM', ['Tất cả bản ghi của bảng bên trái', 'Tất cả bản ghi của cả hai bảng', 'Chỉ các bản ghi có giá trị khớp nối ở cả hai bảng', 'Các bản ghi không khớp'], 2, 'CLO2'),
  q('IT201_Q094', 'Phép `LEFT JOIN` (hoặc LEFT OUTER JOIN) trả về kết quả gì nếu bảng bên phải không có bản ghi khớp?', 'MEDIUM', ['Bỏ qua bản ghi của bảng bên trái', 'Giữ nguyên bản ghi bảng trái và điền giá trị NULL cho tất cả các cột của bảng bên phải', 'Báo lỗi truy vấn', 'Tự động tạo bản ghi mặc định số 0'], 1, 'CLO2'),
  q('IT201_Q095', 'Câu lệnh `SELECT DISTINCT DepartmentID FROM Employees;` có tác dụng gì?', 'MEDIUM', ['Đếm số phòng ban', 'Loại bỏ các giá trị trùng lặp của cột DepartmentID trong kết quả trả về', 'Sắp xếp phòng ban theo bảng chữ cái', 'Tạo khóa chính cho DepartmentID'], 1, 'CLO2'),
  q('IT201_Q096', 'Từ khóa `LIKE \'_a%\'` trong SQL lọc các chuỗi ký tự thỏa mãn quy tắc nào?', 'MEDIUM', ['Bắt đầu bằng ký tự a', 'Có ký tự thứ hai là chữ "a" và phía sau có thể là chuỗi ký tự bất kỳ', 'Kết thúc bằng chữ a', 'Chứa đúng 2 chữ a'], 1, 'CLO2'),
  q('IT201_Q097', 'Hiện tượng "Dirty Read" (Đọc dữ liệu bẩn) trong xử lý đồng thời giao dịch là gì?', 'MEDIUM', ['Đọc phải dữ liệu chứa virus', 'Giao dịch T1 đọc dữ liệu vừa được sửa đổi bởi giao dịch T2 nhưng T2 chưa hề COMMIT và sau đó có thể bị ROLLBACK', 'Đọc dữ liệu quá chậm', 'Đọc nhầm cột khác'], 1, 'CLO2'),
  q('IT201_Q098', 'Hiện tượng "Non-repeatable Read" (Đọc không lặp lại) xảy ra khi nào?', 'MEDIUM', ['Không thể đọc lại dữ liệu vì mất mạng', 'Giao dịch T1 đọc cùng một bản ghi 2 lần nhưng nhận 2 giá trị khác nhau vì giữa hai lần đọc có giao dịch T2 sửa đổi và COMMIT', 'Bảng bị khóa vĩnh viễn', 'Dữ liệu tự động biến đổi'], 1, 'CLO2'),
  q('IT201_Q099', 'Hiện tượng "Phantom Read" (Đọc dữ liệu bóng ma) xảy ra khi nào?', 'MEDIUM', ['Bản ghi bị xóa hoàn toàn', 'Giao dịch T1 thực hiện truy vấn theo điều kiện, giao dịch T2 chèn thêm dòng mới thỏa mãn điều kiện đó, T1 truy vấn lại thấy xuất hiện thêm dòng mới', 'Màn hình hiển thị chập chờn', 'Giao dịch bị quay lui tự động'], 1, 'CLO2'),
  q('IT201_Q100', 'Mức cô lập giao dịch cao nhất trong chuẩn SQL là gì?', 'MEDIUM', ['Read Uncommitted', 'Read Committed', 'Repeatable Read', 'Serializable (Tuần tự hóa)'], 3, 'CLO2'),
  q('IT201_Q101', 'Cấu trúc cây chỉ mục phổ biến nhất được sử dụng trong các hệ quản trị CSDL quan hệ (MySQL InnoDB, SQL Server, Oracle) là:', 'MEDIUM', ['Cây nhị phân tìm kiếm thông thường', 'Cây B+ Tree (B-Plus Tree)', 'Cây đỏ đen (Red-Black Tree)', 'Đồ thị vô hướng'], 1, 'CLO2'),
  q('IT201_Q102', 'Ưu điểm cốt lõi của cấu trúc B+ Tree so với B-Tree truyền thống khi dùng làm chỉ mục cơ sở dữ liệu là:', 'MEDIUM', ['Tất cả dữ liệu thực tế và con trỏ đều nằm ở các nút lá, các nút lá liên kết với nhau thành danh sách liên kết giúp tăng tốc vượt trội truy vấn theo khoảng (Range Queries)', 'B+ Tree tốn ít RAM hơn', 'B+ Tree không cần cân bằng', 'Chỉ dùng cho số nguyên'], 0, 'CLO2'),
  q('IT201_Q103', 'Trigger trong cơ sở dữ liệu là gì?', 'MEDIUM', ['Một kiểu dữ liệu đặc biệt', 'Một thủ tục lưu trữ đặc biệt tự động được kích hoạt thực thi khi xảy ra sự kiện INSERT, UPDATE hoặc DELETE trên một bảng', 'Một phần mềm giám sát tường lửa', 'Một chỉ mục tự động'], 1, 'CLO2'),
  q('IT201_Q104', 'Lệnh SQL nào dùng để phân quyền truy cập (Permission) cho một người dùng trong CSDL?', 'MEDIUM', ['GRANT', 'REVOKE', 'ALLOW', 'PERMIT'], 0, 'CLO2'),
  q('IT201_Q105', 'Stored Procedure (Thủ tục lưu trữ) mang lại lợi ích nổi bật nào so với gửi câu lệnh SQL thô từ ứng dụng?', 'MEDIUM', ['Được biên dịch trước và lưu kế hoạch thực thi (Execution Plan) trên server, giảm tải băng thông mạng và phòng chống tấn công SQL Injection', 'Giúp máy chủ không bao giờ bị lỗi', 'Tự động tạo bảng', 'Loại bỏ hoàn toàn chỉ mục'], 0, 'CLO2'),

  // Vận dụng (10 câu)
  q('IT201_Q106', 'Cho câu truy vấn `SELECT DeptID, AVG(Salary) FROM Emps WHERE Salary > 1000 GROUP BY DeptID HAVING AVG(Salary) > 3000;`. Thứ tự thực thi logic là:', 'HARD', ['FROM -> WHERE -> GROUP BY -> HAVING -> SELECT', 'SELECT -> FROM -> WHERE -> GROUP BY -> HAVING', 'FROM -> SELECT -> WHERE -> HAVING -> GROUP BY', 'WHERE -> FROM -> GROUP BY -> HAVING -> SELECT'], 0, 'CLO3'),
  q('IT201_Q107', 'Một truy vấn con tương quan (Correlated Subquery) có đặc điểm thực thi như thế nào?', 'HARD', ['Chỉ chạy 1 lần duy nhất trước câu lệnh ngoài', 'Được thực thi lặp lại một lần cho mỗi bản ghi (dòng) mà câu truy vấn ngoài duyệt qua', 'Chạy song song trên luồng riêng biệt', 'Không trả về kết quả'], 1, 'CLO3'),
  q('IT201_Q108', 'Để kiểm tra sự tồn tại của dữ liệu từ bảng con mà tối ưu hiệu năng nhất, từ khóa nào được khuyến nghị thay cho `IN`?', 'HARD', ['EXISTS', 'JOIN ALL', 'LIKE', 'BETWEEN'], 0, 'CLO3'),
  q('IT201_Q109', 'Lỗ hổng bảo mật SQL Injection xảy ra do nguyên nhân kỹ thuật cốt lõi nào?', 'HARD', ['Không cập nhật hệ điều hành', 'Ứng dụng ghép chuỗi dữ liệu đầu vào người dùng trực tiếp vào câu lệnh SQL mà không sử dụng cơ chế tham số hóa (Parameterized Queries / Prepared Statements)', 'Mật khẩu cơ sở dữ liệu quá ngắn', 'Dùng cổng mạng mặc định 3306'], 1, 'CLO3'),
  q('IT201_Q110', 'Tình trạng Deadlock (Bế tắc) giữa hai giao dịch T1 và T2 xảy ra khi nào?', 'HARD', ['Khi CPU quá nóng', 'T1 đang giữ khóa tài nguyên A và chờ tài nguyên B, trong khi T2 đang giữ khóa tài nguyên B và chờ tài nguyên A tạo thành chu trình chờ đợi lẫn nhau', 'Khi mạng bị ngắt', 'Khi bảng bị xóa'], 1, 'CLO3'),
  q('IT201_Q111', 'Giao thức khóa hai pha (Two-Phase Locking - 2PL) đảm bảo tính chất nào cho lịch trình thực thi đồng thời?', 'HARD', ['Đảm bảo không bao giờ bị Deadlock', 'Đảm bảo tính khả tuần tự (Serializability)', 'Tăng tốc độ gấp 2 lần', 'Không cần dùng RAM'], 1, 'CLO3'),
  q('IT201_Q112', 'Việc tạo quá nhiều chỉ mục (Index) trên một bảng dữ liệu có tần suất thao tác ghi cao (INSERT/UPDATE/DELETE) sẽ gây ra tác hại gì?', 'HARD', ['Làm sập cơ sở dữ liệu', 'Làm chậm đáng kể hiệu năng của các thao tác ghi do DBMS phải cập nhật lại tất cả cây chỉ mục sau mỗi thay đổi', 'Gây mất dữ liệu ngẫu nhiên', 'Làm hỏng khóa chính'], 1, 'CLO3'),
  q('IT201_Q113', 'Trong MySQL InnoDB, nhật ký Write-Ahead Logging (WAL) sử dụng file Redo Log nhằm mục đích gì?', 'HARD', ['Lưu lịch sử truy cập web', 'Đảm bảo tính bền vững (Durability): Ghi nhận thay đổi tuần tự vào log trước khi ghi các trang dữ liệu bẩn xuống đĩa để có thể khôi phục dữ liệu sau sự cố sập nguồn (Crash Recovery)', 'Chống tấn công DDoS', 'Nén dung lượng ảnh'], 1, 'CLO3'),
  q('IT201_Q114', 'Khái niệm "Covering Index" (Chỉ mục bao trùm) trong tối ưu hóa SQL có nghĩa là gì?', 'HARD', ['Chỉ mục chứa tất cả các bảng trong CSDL', 'Chỉ mục chứa đầy đủ tất cả các cột được yêu cầu bởi câu truy vấn SELECT, cho phép DBMS lấy kết quả trực tiếp từ cây chỉ mục mà không cần truy xuất vào bảng dữ liệu gốc (Index Seek only)', 'Chỉ mục được mã hóa', 'Chỉ mục tự động nhân đôi'], 1, 'CLO3'),
  q('IT201_Q115', 'Lệnh `EXPLAIN` (hoặc EXPLAIN ANALYZE) đặt trước câu lệnh SELECT trong MySQL / PostgreSQL dùng để làm gì?', 'HARD', ['Thực hiện câu lệnh trong chế độ im lặng', 'Hiển thị kế hoạch thực thi truy vấn (Execution Plan), cho biết các chỉ mục được sử dụng, số dòng ước lượng quét và chi phí thuật toán của Optimizer', 'Đo dung lượng RAM của bảng', 'Sao chép dữ liệu sang bảng nháp'], 1, 'CLO3'),

  // Vận dụng cao (5 câu)
  q('IT201_Q116', 'Cơ chế đa phiên bản đồng thời (MVCC - Multi-Version Concurrency Control) trong PostgreSQL và MySQL InnoDB mang lại ưu điểm vượt trội gì?', 'EXPERT', ['Không cần dùng CPU', 'Đọc không chặn Ghi và Ghi không chặn Đọc (Readers do not block Writers, and Writers do not block Readers) bằng cách tạo bản sao ảnh chụp thời điểm của dữ liệu', 'Tự động sửa lỗi cú pháp SQL', 'Xóa hoàn toàn hiện tượng Deadlock'], 1, 'CLO4'),
  q('IT201_Q117', 'Thuật toán ARIES (Algorithm for Recovery and Isolation Exploiting Semantics) trong phục hồi hệ thống sau sự cố gồm 3 pha theo thứ tự nào?', 'EXPERT', ['Pha Backup, Restore, Verify', 'Pha Phân tích (Analysis), Pha Làm lại (Redo) và Pha Quay lui (Undo)', 'Pha Khóa, Đọc, Ghi', 'Pha Kiểm tra, Sửa lỗi, Khởi động'], 1, 'CLO4'),
  q('IT201_Q118', 'Định lý CAP trong hệ thống dữ liệu phân tán khẳng định rằng một hệ thống chỉ có thể đồng thời thỏa mãn tối đa 2 trong 3 tính chất nào?', 'EXPERT', ['Speed, Cost, Security', 'Consistency (Tính nhất quán), Availability (Tính sẵn sàng), Partition Tolerance (Khả năng chịu lỗi phân vùng mạng)', 'Atomicity, Isolation, Durability', 'Read, Write, Delete'], 1, 'CLO4'),
  q('IT201_Q119', 'Kỹ thuật Phân mảnh cơ sở dữ liệu (Database Sharding) theo chiều ngang giải quyết bài toán gì của hệ thống?', 'EXPERT', ['Tăng kích thước ổ đĩa của 1 máy chủ', 'Mở rộng quy mô theo chiều ngang (Horizontal Scaling), chia nhỏ dữ liệu của một bảng khổng lồ ra nhiều máy chủ độc lập dựa trên Shard Key để phân tải vượt ngưỡng giới hạn vật lý', 'Mã hóa dữ liệu 2 lớp', 'Chống mã độc tống tiền'], 1, 'CLO4'),
  q('IT201_Q120', 'Trong kiến trúc Replication Master - Slave (Chính - Phụ), hiện tượng "Replication Lag" có thể gây ra vấn đề gì cho người dùng cuối?', 'EXPERT', ['Máy chủ Slave bị tắt', 'Người dùng vừa cập nhật thông tin trên Master nhưng ngay sau đó đọc từ Slave lại thấy dữ liệu cũ chưa kịp đồng bộ (Read-Your-Own-Writes Inconsistency)', 'Mất toàn bộ mật khẩu tài khoản', 'Dữ liệu bị nhân đôi trên Master'], 1, 'CLO4')
];

module.exports = {
  course: {
    code: 'IT201',
    name: 'Cơ Sở Dữ Liệu',
    faculty: 'Khoa Công Nghệ Thông Tin',
    category_code: 'CAT-IT201',
    credits: 3
  },
  root_1: root1,
  root_2: root2,
  root_3: root3,
  getAllQuestions: () => [...root1, ...root2, ...root3]
};

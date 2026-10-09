// backend/services/examBank/mat101.bank.js
// Ngân hàng câu hỏi chuẩn hóa: MAT101 — Giải Tích 1 (Toán Cao Cấp 1)
// Tổng cộng: 120 câu hỏi (3 Đề gốc x 40 câu hỏi)
'use strict';

function q(id, content, difficulty, answers, correctIdx, clo = 'CLO1') {
  return {
    id,
    course_code: 'MAT101',
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

// ═════════════════════════════════════════════════════════════════════════
// ĐỀ GỐC 1 (40 câu): Dãy số, Giới hạn hàm số, Tính liên tục, Đạo hàm & Vi phân
// ═════════════════════════════════════════════════════════════════════════
const root1 = [
  // Nhận biết (10 câu)
  q('MAT101_Q001', 'Giới hạn lim (x -> 0) của [sin(x) / x] bằng bao nhiêu?', 'EASY', ['0', '1', 'Vô cùng', 'Không tồn tại'], 1, 'CLO1'),
  q('MAT101_Q002', 'Đạo hàm của hàm số y = ln(x) với x > 0 là:', 'EASY', ['1/x', 'e^x', 'x', '-1/x^2'], 0, 'CLO1'),
  q('MAT101_Q003', 'Hàm số f(x) được gọi là liên tục tại điểm x0 nếu thỏa mãn điều kiện nào sau đây?', 'EASY', ['lim (x -> x0) f(x) = f(x0)', 'f(x0) = 0', 'f\'(x0) > 0', 'f(x) có đạo hàm tại mọi điểm'], 0, 'CLO1'),
  q('MAT101_Q004', 'Đạo hàm của hàm số y = e^(3x) là:', 'EASY', ['e^(3x)', '3*e^(3x)', '(1/3)*e^(3x)', '3x*e^(3x-1)'], 1, 'CLO1'),
  q('MAT101_Q005', 'Giới hạn lim (x -> vô cùng) của [(2x^2 + 5x) / (3x^2 - 1)] bằng:', 'EASY', ['2/3', '5/3', '0', 'Vô cùng'], 0, 'CLO1'),
  q('MAT101_Q006', 'Đạo hàm của hàm số lượng giác y = tan(x) là:', 'EASY', ['1 / cos^2(x)', '-1 / sin^2(x)', 'cot(x)', 'sec(x)'], 0, 'CLO1'),
  q('MAT101_Q007', 'Quy tắc L\'Hôpital được áp dụng trực tiếp cho các dạng vô định nào sau đây?', 'EASY', ['0/0 và vô cùng/vô cùng', '0 * vô cùng', '1^vô cùng', 'vô cùng - vô cùng'], 0, 'CLO1'),
  q('MAT101_Q008', 'Vi phân dy của hàm số y = x^4 là:', 'EASY', ['4x^3', '4x^3 dx', 'x^5 / 5', '12x^2 dx'], 1, 'CLO1'),
  q('MAT101_Q009', 'Đạo hàm cấp hai y\'\' của hàm số y = sin(x) là:', 'EASY', ['cos(x)', '-sin(x)', '-cos(x)', 'sin(x)'], 1, 'CLO1'),
  q('MAT101_Q010', 'Hàm số y = |x| tại điểm x = 0 có tính chất nào sau đây?', 'EASY', ['Có đạo hàm bằng 0', 'Liên tục nhưng không có đạo hàm', 'Gián đoạn', 'Có đạo hàm bằng 1'], 1, 'CLO1'),

  // Thông hiểu (15 câu)
  q('MAT101_Q011', 'Tính giới hạn lim (x -> 0) của [(1 - cos(x)) / x^2]:', 'MEDIUM', ['1', '1/2', '0', '2'], 1, 'CLO2'),
  q('MAT101_Q012', 'Tính giới hạn lim (x -> vô cùng) của (1 + 1/x)^x:', 'MEDIUM', ['1', 'e', '0', 'Vô cùng'], 1, 'CLO2'),
  q('MAT101_Q013', 'Hệ số góc của tiếp tuyến của đồ thị hàm số y = x^3 - 3x + 2 tại điểm có hoành độ x = 2 là:', 'MEDIUM', ['9', '12', '6', '3'], 0, 'CLO2'),
  q('MAT101_Q014', 'Tìm giá trị tham số m để hàm số f(x) = { x^2 + 1 khi x >= 1; mx khi x < 1 } liên tục tại x = 1:', 'MEDIUM', ['m = 1', 'm = 2', 'm = 0', 'm = -1'], 1, 'CLO2'),
  q('MAT101_Q015', 'Đạo hàm của hàm hợp y = sin(x^2 + 1) là:', 'MEDIUM', ['2x*cos(x^2 + 1)', 'cos(x^2 + 1)', '-2x*cos(x^2 + 1)', '2x*sin(x^2 + 1)'], 0, 'CLO2'),
  q('MAT101_Q016', 'Tính giới hạn lim (x -> 0) của [e^(2x) - 1] / x:', 'MEDIUM', ['1', '2', '0', '1/2'], 1, 'CLO2'),
  q('MAT101_Q017', 'Điểm uốn của đồ thị hàm số y = x^3 - 3x^2 + 1 có hoành độ là:', 'MEDIUM', ['x = 0', 'x = 1', 'x = 2', 'x = -1'], 1, 'CLO2'),
  q('MAT101_Q018', 'Khai triển Maclaurin của hàm số e^x đến lũy thừa bậc 2 của x là:', 'MEDIUM', ['1 + x + x^2/2', '1 + x + x^2', 'x + x^2/2', '1 - x + x^2/2'], 0, 'CLO2'),
  q('MAT101_Q019', 'Đạo hàm của hàm số ẩn y theo x xác định bởi phương trình x^2 + y^2 = 25 là:', 'MEDIUM', ['y\' = -x/y', 'y\' = x/y', 'y\' = -y/x', 'y\' = 2x + 2y'], 0, 'CLO2'),
  q('MAT101_Q020', 'Giá trị lớn nhất của hàm số y = -x^2 + 4x + 5 trên đoạn [0, 3] là:', 'MEDIUM', ['5', '8', '9', '7'], 2, 'CLO2'),
  q('MAT101_Q021', 'Theo định lý Rolle, nếu f(x) liên tục trên [a, b], khả vi trên (a, b) và f(a) = f(b) thì tồn tại c thuộc (a, b) sao cho:', 'MEDIUM', ['f(c) = 0', 'f\'(c) = 0', 'f\'\'(c) = 0', 'f(c) = (a+b)/2'], 1, 'CLO2'),
  q('MAT101_Q022', 'Giới hạn lim (x -> 0) của [ln(1 + 3x) / x] bằng:', 'MEDIUM', ['1', '3', '1/3', '0'], 1, 'CLO2'),
  q('MAT101_Q023', 'Đạo hàm của hàm số y = x^x với x > 0 là:', 'MEDIUM', ['x*x^(x-1)', 'x^x * (ln(x) + 1)', 'x^x * ln(x)', 'x^x'], 1, 'CLO2'),
  q('MAT101_Q024', 'Khoảng đồng biến của hàm số y = x^3 - 3x là:', 'MEDIUM', ['(-vô cùng, -1) và (1, +vô cùng)', '(-1, 1)', '(0, +vô cùng)', 'R'], 0, 'CLO2'),
  q('MAT101_Q025', 'Phương trình tiếp tuyến của đường cong y = 1/x tại điểm (1, 1) là:', 'MEDIUM', ['y = -x + 2', 'y = x', 'y = -x', 'y = 2x - 1'], 0, 'CLO2'),

  // Vận dụng (10 câu)
  q('MAT101_Q026', 'Tính giới hạn L = lim (x -> 0) [tan(x) - x] / x^3:', 'HARD', ['1/3', '1/2', '0', '1/6'], 0, 'CLO3'),
  q('MAT101_Q027', 'Tìm tiệm cận xiên của đồ thị hàm số y = (2x^2 + 3x + 1) / (x - 1):', 'HARD', ['y = 2x + 5', 'y = 2x + 1', 'y = 2x + 3', 'y = x + 5'], 0, 'CLO3'),
  q('MAT101_Q028', 'Dùng vi phân để tính xấp xỉ giá trị căn bậc hai của 4.08:', 'HARD', ['2.02', '2.04', '2.01', '2.08'], 0, 'CLO3'),
  q('MAT101_Q029', 'Tìm bán kính của hình trụ có thể tích V = 54*pi sao cho diện tích toàn phần nhỏ nhất:', 'HARD', ['r = 3', 'r = 2', 'r = 4', 'r = 6'], 0, 'CLO3'),
  q('MAT101_Q030', 'Khai triển Taylor bậc 2 của f(x) = sqrt(x) lân cận điểm x0 = 1:', 'HARD', ['1 + 0.5(x-1) - 0.125(x-1)^2', '1 + (x-1) - (x-1)^2', '1 + 0.5(x-1) + 0.25(x-1)^2', '0.5(x-1) - 0.125(x-1)^2'], 0, 'CLO3'),
  q('MAT101_Q031', 'Tính giới hạn lim (x -> 0+) của x^x:', 'HARD', ['1', '0', 'e', 'Không tồn tại'], 0, 'CLO3'),
  q('MAT101_Q032', 'Tính đạo hàm cấp 10 của hàm số y = e^(2x) tại x = 0:', 'HARD', ['1024', '512', '2048', '256'], 0, 'CLO3'),
  q('MAT101_Q033', 'Một vật chuyển động theo quy luật s(t) = t^3 - 6t^2 + 9t. Gia tốc của vật tại thời điểm vận tốc v = 0 lần thứ hai là:', 'HARD', ['6 m/s^2', '12 m/s^2', '-6 m/s^2', '0 m/s^2'], 0, 'CLO3'),
  q('MAT101_Q034', 'Tính đạo hàm cấp n của hàm số y = 1 / (x - 2):', 'HARD', ['(-1)^n * n! / (x - 2)^(n+1)', 'n! / (x - 2)^n', '(-1)^n / (x - 2)^n', '(-1)^(n+1) * n! / (x - 2)^n'], 0, 'CLO3'),
  q('MAT101_Q035', 'Tính giới hạn lim (x -> vô cùng) của [x * (sqrt(x^2 + 1) - x)]:', 'HARD', ['1/2', '1', '0', 'Vô cùng'], 0, 'CLO3'),

  // Vận dụng cao (5 câu)
  q('MAT101_Q036', 'Tìm tất cả các giá trị của tham số a để hàm số f(x) = x^3 - 3ax^2 + 12x đạt cực trị tại hai điểm x1, x2 thỏa mãn x1^2 + x2^2 = 8:', 'EXPERT', ['a = 2 hoặc a = -2', 'a = sqrt(6) hoặc a = -sqrt(6)', 'a = 1', 'Không tồn tại a'], 0, 'CLO4'),
  q('MAT101_Q037', 'Tính giới hạn I = lim (x -> 0) [cos(x)^(1 / x^2)]:', 'EXPERT', ['e^(-1/2)', 'e^(-1)', '1', 'e^(1/2)'], 0, 'CLO4'),
  q('MAT101_Q038', 'Cho hàm số f(x) khả vi liên tục trên [0, 1] thỏa mãn f(0) = 0, f(1) = 1. Chứng minh tồn tại c thuộc (0, 1) sao cho f\'(c) = 2c:', 'EXPERT', ['Áp dụng định lý Cauchy hoặc định lý Rolle cho g(x) = f(x) - x^2', 'Áp dụng định lý Lagrange', 'Áp dụng định lý giá trị trung bình tích phân', 'Không thể xác định'], 0, 'CLO4'),
  q('MAT101_Q039', 'Tìm giới hạn lim (n -> vô cùng) của tổng S_n = sum_{k=1}^n [n / (n^2 + k^2)]:', 'EXPERT', ['pi / 4', 'pi / 2', 'ln(2)', '1'], 0, 'CLO4'),
  q('MAT101_Q040', 'Độ cong K của đường cong y = ln(cos(x)) tại điểm x = 0 là:', 'EXPERT', ['1', '0', '2', '1/2'], 0, 'CLO4')
];

// ═════════════════════════════════════════════════════════════════════════
// ĐỀ GỐC 2 (40 câu): Tích phân bất định, Tích phân xác định & Ứng dụng hình học
// ═════════════════════════════════════════════════════════════════════════
const root2 = [
  // Nhận biết (10 câu)
  q('MAT101_Q041', 'Nguyên hàm của hàm số f(x) = x^3 là:', 'EASY', ['x^4 / 4 + C', '3x^2 + C', 'x^4 + C', '4x^3 + C'], 0, 'CLO1'),
  q('MAT101_Q042', 'Nguyên hàm của hàm số f(x) = cos(x) là:', 'EASY', ['sin(x) + C', '-sin(x) + C', 'tan(x) + C', '-cos(x) + C'], 0, 'CLO1'),
  q('MAT101_Q043', 'Công thức tích phân từng phần đối với hai hàm số u(x) và v(x) là:', 'EASY', ['int(u dv) = u*v - int(v du)', 'int(u dv) = u*v + int(v du)', 'int(u dv) = u\'*v - u*v\'', 'int(u dv) = u*v / 2'], 0, 'CLO1'),
  q('MAT101_Q044', 'Tích phân xác định từ 0 đến 1 của hàm số f(x) = 2x dx bằng:', 'EASY', ['1', '2', '0', '1/2'], 0, 'CLO1'),
  q('MAT101_Q045', 'Nguyên hàm của f(x) = 1 / (1 + x^2) là:', 'EASY', ['arctan(x) + C', 'ln(1 + x^2) + C', 'arcsin(x) + C', '1/x + C'], 0, 'CLO1'),
  q('MAT101_Q046', 'Nguyên hàm của hàm số e^(5x) là:', 'EASY', ['(1/5)*e^(5x) + C', '5*e^(5x) + C', 'e^(5x) + C', 'e^(5x) / x + C'], 0, 'CLO1'),
  q('MAT101_Q047', 'Diện tích hình phẳng giới hạn bởi đồ thị y = f(x) >= 0, trục hoành và hai đường thẳng x = a, x = b (a < b) là:', 'EASY', ['int_a^b f(x) dx', 'int_a^b f\'(x) dx', 'pi * int_a^b f^2(x) dx', 'f(b) - f(a)'], 0, 'CLO1'),
  q('MAT101_Q048', 'Nguyên hàm của f(x) = 1/x (với x khác 0) là:', 'EASY', ['ln|x| + C', '-1/x^2 + C', 'e^x + C', 'x + C'], 0, 'CLO1'),
  q('MAT101_Q049', 'Tích phân xác định từ 0 đến pi của sin(x) dx bằng:', 'EASY', ['2', '0', '1', '-2'], 0, 'CLO1'),
  q('MAT101_Q050', 'Công thức thể tích khối tròn xoay khi quay hình phẳng giới hạn bởi y = f(x), y = 0, x = a, x = b quanh trục Ox là:', 'EASY', ['V = pi * int_a^b f^2(x) dx', 'V = int_a^b f^2(x) dx', 'V = 2*pi * int_a^b f(x) dx', 'V = pi^2 * int_a^b f(x) dx'], 0, 'CLO1'),

  // Thông hiểu (15 câu)
  q('MAT101_Q051', 'Tính tích phân I = int_0^1 x * e^x dx bằng phương pháp tích phân từng phần:', 'MEDIUM', ['1', 'e - 1', 'e - 2', '2'], 0, 'CLO2'),
  q('MAT101_Q052', 'Tính tích phân I = int_0^(pi/2) sin^2(x) * cos(x) dx bằng phương pháp đổi biến đặt t = sin(x):', 'MEDIUM', ['1/3', '1/2', '1', '2/3'], 0, 'CLO2'),
  q('MAT101_Q053', 'Nguyên hàm int [2x / (x^2 + 1)] dx bằng:', 'MEDIUM', ['ln(x^2 + 1) + C', 'arctan(x) + C', '1 / (x^2 + 1)^2 + C', '2*ln(x) + C'], 0, 'CLO2'),
  q('MAT101_Q054', 'Diện tích hình phẳng giới hạn bởi parabol y = x^2 và đường thẳng y = x là:', 'MEDIUM', ['1/6', '1/3', '1/2', '1'], 0, 'CLO2'),
  q('MAT101_Q055', 'Tính tích phân suy rộng I = int_1^(+vô cùng) (1 / x^2) dx:', 'MEDIUM', ['1', 'Vô cùng (phân kỳ)', '0', '2'], 0, 'CLO2'),
  q('MAT101_Q056', 'Tính tích phân I = int_0^1 dx / sqrt(1 - x^2):', 'MEDIUM', ['pi / 2', 'pi', '1', 'pi / 4'], 0, 'CLO2'),
  q('MAT101_Q057', 'Nguyên hàm int ln(x) dx bằng:', 'MEDIUM', ['x*ln(x) - x + C', '1/x + C', 'x*ln(x) + x + C', 'ln^2(x)/2 + C'], 0, 'CLO2'),
  q('MAT101_Q058', 'Thể tích khối tròn xoay sinh ra khi quay hình phẳng giới hạn bởi y = sqrt(x), y = 0, x = 4 quanh trục Ox là:', 'MEDIUM', ['8*pi', '4*pi', '16*pi', '2*pi'], 0, 'CLO2'),
  q('MAT101_Q059', 'Tính tích phân I = int_(-1)^1 (x^3 + x*cos(x)) dx:', 'MEDIUM', ['0 (do hàm số lẻ)', '2', '1', 'pi/2'], 0, 'CLO2'),
  q('MAT101_Q060', 'Độ dài cung của đường cong y = f(x) trên đoạn [a, b] được tính bởi công thức nào?', 'MEDIUM', ['L = int_a^b sqrt(1 + [f\'(x)]^2) dx', 'L = int_a^b (1 + f\'(x)) dx', 'L = int_a^b sqrt(f(x)) dx', 'L = int_a^b f\'(x) dx'], 0, 'CLO2'),
  q('MAT101_Q061', 'Tính tích phân suy rộng I = int_0^1 (1 / sqrt(x)) dx:', 'MEDIUM', ['2', '1', 'Phân kỳ', '1/2'], 0, 'CLO2'),
  q('MAT101_Q062', 'Tính tích phân I = int_0^1 (2x + 1) / (x + 1) dx:', 'MEDIUM', ['2 - ln(2)', '1 + ln(2)', 'ln(2)', '2 + ln(2)'], 0, 'CLO2'),
  q('MAT101_Q063', 'Nguyên hàm int tan(x) dx bằng:', 'MEDIUM', ['-ln|cos(x)| + C', 'ln|sin(x)| + C', 'sec^2(x) + C', '-cot(x) + C'], 0, 'CLO2'),
  q('MAT101_Q064', 'Tính tích phân I = int_0^(pi/4) (1 / cos^2(x)) dx:', 'MEDIUM', ['1', '0', 'sqrt(2)', 'pi/4'], 0, 'CLO2'),
  q('MAT101_Q065', 'Tính giá trị trung bình của hàm số f(x) = 3x^2 trên đoạn [0, 2]:', 'MEDIUM', ['4', '8', '2', '6'], 0, 'CLO2'),

  // Vận dụng (10 câu)
  q('MAT101_Q066', 'Tính tích phân I = int_0^1 x^2 * sqrt(1 - x^3) dx:', 'HARD', ['2/9', '1/9', '2/3', '1/3'], 0, 'CLO3'),
  q('MAT101_Q067', 'Tính diện tích hình phẳng giới hạn bởi hai đường cong y = x^2 - 2x và y = -x^2 + 4x:', 'HARD', ['9', '6', '12', '18'], 0, 'CLO3'),
  q('MAT101_Q068', 'Tính tích phân suy rộng loại 1 I = int_0^(+vô cùng) x * e^(-x) dx:', 'HARD', ['1', '0', 'e', 'Phân kỳ'], 0, 'CLO3'),
  q('MAT101_Q069', 'Thể tích khối tròn xoay khi quay miền giới hạn bởi y = e^x, y = 0, x = 0, x = 1 quanh trục Ox là:', 'HARD', ['(pi/2) * (e^2 - 1)', 'pi * (e^2 - 1)', '(pi/2) * e^2', 'pi * e'], 0, 'CLO3'),
  q('MAT101_Q070', 'Tính tích phân I = int_1^e (ln(x) / x) dx:', 'HARD', ['1/2', '1', '2', 'e/2'], 0, 'CLO3'),
  q('MAT101_Q071', 'Tính độ dài cung đường cong y = (2/3) * x^(3/2) từ x = 0 đến x = 3:', 'HARD', ['14/3', '7/3', '8', '16/3'], 0, 'CLO3'),
  q('MAT101_Q072', 'Tính tích phân I = int_0^1 dx / (x^2 + 3x + 2):', 'HARD', ['ln(4/3)', 'ln(3/2)', 'ln(2)', 'ln(5/4)'], 0, 'CLO3'),
  q('MAT101_Q073', 'Khảo sát sự hội tụ của tích phân suy rộng I = int_1^(+vô cùng) dx / (x^p):', 'HARD', ['Hội tụ khi p > 1, phân kỳ khi p <= 1', 'Hội tụ khi p >= 1', 'Hội tụ với mọi p > 0', 'Phân kỳ với mọi p'], 0, 'CLO3'),
  q('MAT101_Q074', 'Tính tích phân I = int_0^(pi/2) cos^3(x) dx:', 'HARD', ['2/3', '1/3', '4/3', '1'], 0, 'CLO3'),
  q('MAT101_Q075', 'Diện tích mặt tròn xoay khi quay cung tròn y = sqrt(4 - x^2) (-1 <= x <= 1) quanh trục Ox là:', 'HARD', ['8*pi', '4*pi', '16*pi', '2*pi'], 0, 'CLO3'),

  // Vận dụng cao (5 câu)
  q('MAT101_Q076', 'Tính tích phân I = int_0^1 [arctan(x) / (1 + x^2)] dx:', 'EXPERT', ['pi^2 / 32', 'pi^2 / 16', 'pi / 8', 'pi^2 / 64'], 0, 'CLO4'),
  q('MAT101_Q077', 'Tính tích phân I = int_0^(pi/2) [sqrt(sin(x)) / (sqrt(sin(x)) + sqrt(cos(x)))] dx:', 'EXPERT', ['pi / 4', 'pi / 2', '1', 'pi / 8'], 0, 'CLO4'),
  q('MAT101_Q078', 'Tính tích phân suy rộng I = int_0^(+vô cùng) dx / (1 + x^4):', 'EXPERT', ['pi / (2*sqrt(2))', 'pi / 2', 'pi / 4', 'pi / sqrt(2)'], 0, 'CLO4'),
  q('MAT101_Q079', 'Tìm đạo hàm F\'(x) của hàm số F(x) = int_0^(x^2) e^(-t^2) dt:', 'EXPERT', ['2x * e^(-x^4)', 'e^(-x^4)', '2x * e^(-x^2)', 'x * e^(-x^4)'], 0, 'CLO4'),
  q('MAT101_Q080', 'Tính diện tích hình phẳng giới hạn bởi đường hình tim (Cardioid) r = a * (1 + cos(phi)) trong tọa độ cực:', 'EXPERT', ['(3/2) * pi * a^2', '3 * pi * a^2', 'pi * a^2', '2 * pi * a^2'], 0, 'CLO4')
];

// ═════════════════════════════════════════════════════════════════════════
// ĐỀ GỐC 3 (40 câu): Chuỗi số, Chuỗi lũy thừa, Phương trình vi phân cấp 1 & cấp 2
// ═════════════════════════════════════════════════════════════════════════
const root3 = [
  // Nhận biết (10 câu)
  q('MAT101_Q081', 'Điều kiện cần để chuỗi số sum_{n=1}^inf u_n hội tụ là:', 'EASY', ['lim (n -> inf) u_n = 0', 'lim (n -> inf) u_n = 1', 'u_n > 0', 'u_n đơn điệu tăng'], 0, 'CLO1'),
  q('MAT101_Q082', 'Chuỗi cấp số nhân sum_{n=1}^inf q^n hội tụ khi và chỉ khi:', 'EASY', ['|q| < 1', '|q| <= 1', 'q > 0', 'q < 1'], 0, 'CLO1'),
  q('MAT101_Q083', 'Phương trình vi phân cấp 1 có dạng y\' + p(x)*y = q(x) được gọi là phương trình gì?', 'EASY', ['Phương trình vi phân tuyến tính cấp 1', 'Phương trình tách biến', 'Phương trình Bernoulli', 'Phương trình thuần nhất'], 0, 'CLO1'),
  q('MAT101_Q084', 'Chuỗi điều hòa sum_{n=1}^inf (1 / n) có tính chất nào sau đây?', 'EASY', ['Phân kỳ', 'Hội tụ về 1', 'Hội tụ về 0', 'Hội tụ về e'], 0, 'CLO1'),
  q('MAT101_Q085', 'Nghiệm tổng quát của phương trình vi phân y\' = 2x là:', 'EASY', ['y = x^2 + C', 'y = 2x^2 + C', 'y = x + C', 'y = 2 + C'], 0, 'CLO1'),
  q('MAT101_Q086', 'Phương trình đặc trưng của phương trình vi phân tuyến tính cấp 2 thuần nhất y\'\' - 5y\' + 6y = 0 là:', 'EASY', ['k^2 - 5k + 6 = 0', 'k^2 + 5k + 6 = 0', 'k^2 - 6k + 5 = 0', 'k^2 + 6 = 0'], 0, 'CLO1'),
  q('MAT101_Q087', 'Chuỗi đan dấu sum_{n=1}^inf (-1)^(n-1) * a_n (a_n > 0) hội tụ theo tiêu chuẩn Leibniz nếu:', 'EASY', ['a_n giảm dần và lim a_n = 0', 'a_n tăng dần', 'a_n bị chặn trên', 'lim a_n = 1'], 0, 'CLO1'),
  q('MAT101_Q088', 'Bán kính hội tụ R của chuỗi lũy thừa sum a_n * x^n có thể tính bằng công thức Cauchy - Hadamard:', 'EASY', ['1 / R = lim sup căn bậc n của |a_n|', 'R = lim |a_n|', 'R = a_n / a_{n+1}', 'R = n!'], 0, 'CLO1'),
  q('MAT101_Q089', 'Phương trình vi phân tách biến có dạng tổng quát là:', 'EASY', ['f(x) dx + g(y) dy = 0', 'y\' + P(x)y = Q(x)', 'y\'\' + ay = 0', 'M(x,y)dx + N(x,y)dy = 0'], 0, 'CLO1'),
  q('MAT101_Q090', 'Tổng của chuỗi cấp số nhân lùi vô hạn S = 1 + 1/2 + 1/4 + 1/8 + ... bằng:', 'EASY', ['2', '1', '3/2', 'Vô cùng'], 0, 'CLO1'),

  // Thông hiểu (15 câu)
  q('MAT101_Q091', 'Xét sự hội tụ của chuỗi số sum_{n=1}^inf [1 / (n^2 + 1)]:', 'MEDIUM', ['Hội tụ (so sánh với 1/n^2)', 'Phân kỳ', 'Dao động', 'Không xác định'], 0, 'CLO2'),
  q('MAT101_Q092', 'Dùng tiêu chuẩn D\'Alembert xét chuỗi sum_{n=1}^inf [2^n / n!]:', 'MEDIUM', ['Hội tụ vì lim (u_{n+1}/u_n) = 0 < 1', 'Phân kỳ', 'Bằng 1 không kết luận được', 'Hội tụ về 2'], 0, 'CLO2'),
  q('MAT101_Q093', 'Tìm nghiệm của phương trình vi phân y\' = y với điều kiện ban đầu y(0) = 3:', 'MEDIUM', ['y = 3*e^x', 'y = e^(3x)', 'y = 3x', 'y = e^x + 2'], 0, 'CLO2'),
  q('MAT101_Q094', 'Bán kính hội tụ của chuỗi lũy thừa sum_{n=1}^inf (x^n / n) là:', 'MEDIUM', ['R = 1', 'R = inf', 'R = 0', 'R = 2'], 0, 'CLO2'),
  q('MAT101_Q095', 'Phương trình đặc trưng k^2 - 4k + 4 = 0 có nghiệm kép k = 2. Nghiệm tổng quát của y\'\' - 4y\' + 4y = 0 là:', 'MEDIUM', ['y = (C1 + C2*x) * e^(2x)', 'y = C1*e^(2x) + C2*e^(-2x)', 'y = C1*cos(2x) + C2*sin(2x)', 'y = C1*e^(2x)'], 0, 'CLO2'),
  q('MAT101_Q096', 'Chuỗi p-series sum_{n=1}^inf (1 / n^p) hội tụ khi nào?', 'MEDIUM', ['p > 1', 'p >= 1', 'p < 1', 'p <= 0'], 0, 'CLO2'),
  q('MAT101_Q097', 'Tìm thừa số tích phân mu(x) cho phương trình vi phân tuyến tính y\' + 2y = 4x:', 'MEDIUM', ['mu(x) = e^(2x)', 'mu(x) = e^(-2x)', 'mu(x) = 2x', 'mu(x) = x^2'], 0, 'CLO2'),
  q('MAT101_Q098', 'Phương trình đặc trưng k^2 + 9 = 0 có nghiệm k = +- 3i. Nghiệm tổng quát của y\'\' + 9y = 0 là:', 'MEDIUM', ['y = C1*cos(3x) + C2*sin(3x)', 'y = C1*e^(3x) + C2*e^(-3x)', 'y = (C1 + C2*x)*e^(3x)', 'y = C1*cos(9x)'], 0, 'CLO2'),
  q('MAT101_Q099', 'Khoảng hội tụ của chuỗi lũy thừa sum_{n=1}^inf [(x - 1)^n / 2^n] là:', 'MEDIUM', ['(-1, 3)', '(0, 2)', '(-2, 2)', '(-1, 1)'], 0, 'CLO2'),
  q('MAT101_Q100', 'Xét chuỗi số sum_{n=1}^inf [(-1)^n / n]:', 'MEDIUM', ['Hội tụ có điều kiện', 'Hội tụ tuyệt đối', 'Phân kỳ', 'Dao động'], 0, 'CLO2'),
  q('MAT101_Q101', 'Giải phương trình vi phân tách biến dy / dx = x / y:', 'MEDIUM', ['y^2 - x^2 = C', 'y = x + C', 'y^2 + x^2 = C', 'y = C*x'], 0, 'CLO2'),
  q('MAT101_Q102', 'Nghiệm riêng của phương trình y\'\' - 3y\' + 2y = 4 có dạng hằng số Y_p là:', 'MEDIUM', ['Y_p = 2', 'Y_p = 4', 'Y_p = 1', 'Y_p = -2'], 0, 'CLO2'),
  q('MAT101_Q103', 'Tiêu chuẩn tích phân Cauchy - Maclaurin áp dụng cho chuỗi sum f(n) khi hàm số f(x) thỏa mãn:', 'MEDIUM', ['Liên tục, dương và giảm trên [1, +inf)', 'Liên tục và tăng', 'Khả vi vô hạn', 'Có đạo hàm dương'], 0, 'CLO2'),
  q('MAT101_Q104', 'Khai triển chuỗi lũy thừa của hàm f(x) = 1 / (1 - x) với |x| < 1 là:', 'MEDIUM', ['1 + x + x^2 + x^3 + ...', '1 - x + x^2 - x^3 + ...', 'x + x^2 + x^3 + ...', '1 + 2x + 3x^2 + ...'], 0, 'CLO2'),
  q('MAT101_Q105', 'Nghiệm tổng quát của phương trình vi phân y\' + y/x = 0 (x > 0) là:', 'MEDIUM', ['y = C / x', 'y = C * x', 'y = C * ln(x)', 'y = e^(-x) + C'], 0, 'CLO2'),

  // Vận dụng (10 câu)
  q('MAT101_Q106', 'Tìm nghiệm của phương trình vi phân tuyến tính y\' - y/x = x với y(1) = 2:', 'HARD', ['y = x^2 + x', 'y = x^2 + 1', 'y = 2x^2', 'y = x^2 - x + 2'], 0, 'CLO3'),
  q('MAT101_Q107', 'Tìm miền hội tụ của chuỗi lũy thừa sum_{n=1}^inf [(x + 2)^n / (n * 3^n)]:', 'HARD', ['[-5, 1)', '(-5, 1]', '(-5, 1)', '[-5, 1]'], 0, 'CLO3'),
  q('MAT101_Q108', 'Giải phương trình vi phân cấp 2 y\'\' - 2y\' + y = e^x:', 'HARD', ['y = (C1 + C2*x)*e^x + (1/2)*x^2*e^x', 'y = C1*e^x + C2*e^(-x) + e^x', 'y = (C1 + C2*x)*e^x + x*e^x', 'y = C1*e^x + (1/2)*x^2*e^x'], 0, 'CLO3'),
  q('MAT101_Q109', 'Tính tổng của chuỗi số S = sum_{n=1}^inf [1 / (n * (n + 1))]:', 'HARD', ['1', '1/2', '2', 'ln(2)'], 0, 'CLO3'),
  q('MAT101_Q110', 'Dùng chuỗi Taylor giải gần đúng phương trình y\' = x + y với y(0) = 1. Hệ số của x^2 trong chuỗi nghiệm y(x) là:', 'HARD', ['1', '1/2', '2', '3/2'], 0, 'CLO3'),
  q('MAT101_Q111', 'Xét sự hội tụ của chuỗi sum_{n=1}^inf [n! / n^n]:', 'HARD', ['Hội tụ (theo tiêu chuẩn D\'Alembert giới hạn bằng 1/e < 1)', 'Phân kỳ', 'Bằng 1', 'Hội tụ về 0'], 0, 'CLO3'),
  q('MAT101_Q112', 'Giải phương trình vi phân thuần nhất dy/dx = (x + y) / x:', 'HARD', ['y = x*ln|x| + C*x', 'y = x*ln|x| + C', 'y = x^2 + C*x', 'y = ln|x| + C'], 0, 'CLO3'),
  q('MAT101_Q113', 'Tìm bán kính hội tụ của chuỗi lũy thừa sum_{n=1}^inf [n! * x^n]:', 'HARD', ['R = 0', 'R = 1', 'R = inf', 'R = e'], 0, 'CLO3'),
  q('MAT101_Q114', 'Giải bài toán Cauchy cho dao động điều hòa y\'\' + 4y = 0 với y(0) = 1, y\'(0) = 2:', 'HARD', ['y = cos(2x) + sin(2x)', 'y = cos(2x) + 2*sin(2x)', 'y = e^(2x) + e^(-2x)', 'y = 2*cos(2x)'], 0, 'CLO3'),
  q('MAT101_Q115', 'Tính tổng của chuỗi hàm S(x) = sum_{n=1}^inf n * x^n với |x| < 1:', 'HARD', ['x / (1 - x)^2', '1 / (1 - x)^2', 'x / (1 - x)', 'x^2 / (1 - x)^2'], 0, 'CLO3'),

  // Vận dụng cao (5 câu)
  q('MAT101_Q116', 'Giải phương trình vi phân Bernoulli y\' + y/x = y^2 * ln(x):', 'EXPERT', ['1/y = ln(x) + 1 + C*x', 'y = 1 / (x*ln(x) + C)', '1/y = -ln(x) + C*x', 'y^2 = x*ln(x) + C'], 0, 'CLO4'),
  q('MAT101_Q117', 'Tính tổng chuỗi số S = sum_{n=1}^inf [(-1)^(n-1) / n]:', 'EXPERT', ['ln(2)', '1', 'e - 1', 'pi / 4'], 0, 'CLO4'),
  q('MAT101_Q118', 'Một bể chứa 1000 lít nước muối với 10 kg muối hòa tan. Nước muối nồng độ 0.05 kg/lít được bơm vào bể với tốc độ 20 lít/phút và dung dịch được khuấy đều rồi chảy ra với cùng tốc độ. Lượng muối y(t) trong bể sau t phút là:', 'EXPERT', ['y(t) = 50 - 40 * e^(-t / 50)', 'y(t) = 50 + 40 * e^(-t / 50)', 'y(t) = 10 * e^(-t / 50)', 'y(t) = 50 * (1 - e^(-t / 50))'], 0, 'CLO4'),
  q('MAT101_Q119', 'Nghiệm tổng quát của phương trình vi phân Euler x^2 * y\'\' - 2x * y\' + 2y = 0 với x > 0 là:', 'EXPERT', ['y = C1 * x + C2 * x^2', 'y = C1 * x^2 + C2 * x^3', 'y = (C1 + C2 * ln(x)) * x', 'y = C1 * cos(ln(x)) + C2 * sin(ln(x))'], 0, 'CLO4'),
  q('MAT101_Q120', 'Tính tổng chuỗi số S = sum_{n=0}^inf [1 / (2n + 1)!]:', 'EXPERT', ['(e - 1/e) / 2 = sinh(1)', '(e + 1/e) / 2 = cosh(1)', 'e - 1', 'sinh(2)'], 0, 'CLO4')
];

module.exports = {
  course: {
    code: 'MAT101',
    name: 'Giải Tích 1 (Toán Cao Cấp 1)',
    faculty: 'Khoa Công Nghệ Thông Tin & Cơ Bản',
    faculty_name: 'Khoa Công Nghệ Thông Tin & Cơ Bản',
    category_code: 'CAT-MAT101',
    credits: 3
  },
  root_1: root1,
  root_2: root2,
  root_3: root3,
  getAllQuestions: () => [...root1, ...root2, ...root3]
};

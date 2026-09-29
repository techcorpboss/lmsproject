// backend/services/examBank/ee101.bank.js
// Ngân hàng câu hỏi chuẩn hóa: EE101 — Kỹ Thuật Mạch Điện Tử & IoT
// Tổng cộng: 120 câu hỏi (3 Đề gốc x 40 câu hỏi)
'use strict';

function q(id, content, difficulty, answers, correctIdx, clo = 'CLO1') {
  return {
    id,
    course_code: 'EE101',
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

// ĐỀ GỐC 1 (40 câu): Định luật cơ bản mạch điện, Ohm, Kirchhoff, Mạch RC/RL, Dòng điện xoay chiều AC
const root1 = [
  // Nhận biết (10 câu)
  q('EE101_Q001', 'Định luật Ohm cho đoạn mạch thuần điện trở biểu diễn mối quan hệ giữa điện áp (V), dòng điện (I) và điện trở (R) theo công thức nào?', 'EASY', ['V = I / R', 'V = I * R', 'I = V * R', 'R = V * I'], 1, 'CLO1'),
  q('EE101_Q002', 'Đơn vị đo điện dung của tụ điện trong hệ đo lường quốc tế SI là gì?', 'EASY', ['Ohm (Ω)', 'Henry (H)', 'Farad (F)', 'Volt (V)'], 2, 'CLO1'),
  q('EE101_Q003', 'Định luật Kirchhoff về dòng điện (KCL) phát biểu rằng:', 'EASY', ['Tổng điện áp trong một vòng kín bằng 0', 'Tổng đại số các dòng điện đi vào một nút bằng tổng đại số các dòng điện đi ra khỏi nút đó (Σ I = 0)', 'Dòng điện luôn chạy theo chiều kim đồng hồ', 'Điện trở của nút luôn bằng 0'], 1, 'CLO1'),
  q('EE101_Q004', 'Định luật Kirchhoff về điện áp (KVL) phát biểu rằng:', 'EASY', ['Tổng đại số các sụt áp dọc theo một vòng kín (mắt mạng) bất kỳ trong mạch điện luôn bằng 0 (Σ V = 0)', 'Điện áp tại mọi điểm luôn bằng nhau', 'Dòng điện qua mạch kín bằng 0', 'Công suất tiêu thụ luôn bằng 0'], 0, 'CLO1'),
  q('EE101_Q005', 'Công thức tính công suất tiêu thụ điện năng P trên một điện trở R có dòng điện I chạy qua là:', 'EASY', ['P = V / I', 'P = I^2 * R = V * I', 'P = R / I', 'P = V / R^2'], 1, 'CLO1'),
  q('EE101_Q006', 'Hai điện trở R1 = 100Ω và R2 = 100Ω mắc song song với nhau thì điện trở tương đương R_td bằng:', 'EASY', ['200 Ω', '50 Ω', '100 Ω', '25 Ω'], 1, 'CLO1'),
  q('EE101_Q007', 'Hai tụ điện C1 và C2 mắc song song với nhau có điện dung tương đương tính theo công thức nào?', 'EASY', ['C_td = C1 + C2', 'C_td = (C1 * C2) / (C1 + C2)', 'C_td = C1 / C2', 'C_td = C1 - C2'], 0, 'CLO1'),
  q('EE101_Q008', 'Tần số f của lưới điện dân dụng xoay chiều tại Việt Nam là bao nhiêu?', 'EASY', ['60 Hz', '50 Hz', '100 Hz', '120 Hz'], 1, 'CLO1'),
  q('EE101_Q009', 'Giá trị hiệu dụng (RMS) của một điện áp xoay chiều hình sin có biên độ cực đại V_max được tính bằng:', 'EASY', ['V_rms = V_max * 2', 'V_rms = V_max / √2 ≈ 0.707 * V_max', 'V_rms = V_max / 2', 'V_rms = V_max * √2'], 1, 'CLO1'),
  q('EE101_Q010', 'Dụng cụ đo nào được dùng để quan sát dạng sóng tín hiệu điện áp biến thiên theo thời gian?', 'EASY', ['Ampe kế kẹp', 'Dao động ký (Oscilloscope)', 'Đồng hồ VOM vạn năng', 'Cầu Wheatstone'], 1, 'CLO1'),

  // Thông hiểu (15 câu)
  q('EE101_Q011', 'Trong mạch phân áp gồm 2 điện trở R1 và R2 mắc nối tiếp với nguồn V_in, điện áp ra V_out trên điện trở R2 được tính bằng:', 'MEDIUM', ['V_out = V_in * (R1 / (R1 + R2))', 'V_out = V_in * (R2 / (R1 + R2))', 'V_out = V_in * (R1 + R2) / R2', 'V_out = V_in * R1 * R2'], 1, 'CLO2'),
  q('EE101_Q012', 'Hằng số thời gian τ (Tau) của mạch nạp/xả RC nối tiếp được tính bằng công thức:', 'MEDIUM', ['τ = R / C', 'τ = R * C', 'τ = 1 / (R * C)', 'τ = R^2 * C'], 1, 'CLO2'),
  q('EE101_Q013', 'Sau một khoảng thời gian bằng 1 hằng số thời gian (t = 1τ), tụ điện trong mạch nạp RC sẽ nạp được khoảng bao nhiêu phần trăm điện áp nguồn?', 'MEDIUM', ['50%', '63.2%', '86.5%', '99%'], 1, 'CLO2'),
  q('EE101_Q014', 'Cuộn cảm thuần L có đặc tính cản trở dòng điện xoay chiều, đại lượng cảm kháng ZL được tính bằng:', 'MEDIUM', ['ZL = 1 / (2πfL)', 'ZL = 2π * f * L = ω * L', 'ZL = 2π / (f * L)', 'ZL = L / R'], 1, 'CLO2'),
  q('EE101_Q015', 'Tụ điện C có dung kháng ZC cản trở dòng điện xoay chiều phụ thuộc vào tần số f theo công thức:', 'MEDIUM', ['ZC = 2πfC', 'ZC = 1 / (2π * f * C) = 1 / (ω * C)', 'ZC = f / C', 'ZC = 2π / C'], 1, 'CLO2'),
  q('EE101_Q016', 'Tụ điện có tác dụng gì đối với dòng điện một chiều (DC) ở trạng thái ổn định (Steady State)?', 'MEDIUM', ['Dẫn điện như dây dẫn', 'Ngăn chặn hoàn toàn dòng điện một chiều (coi như hở mạch - Open Circuit)', 'Khuếch đại dòng điện', 'Làm đảo pha dòng điện'], 1, 'CLO2'),
  q('EE101_Q017', 'Định lý Thevenin khẳng định một mạng điện tuyến tính 2 đầu ra bất kỳ có thể được thay thế tương đương bằng:', 'MEDIUM', ['Một nguồn dòng song song với một điện trở', 'Một nguồn điện áp độc lập V_th nối tiếp với một điện trở tương đương R_th', 'Một tụ điện đơn lẻ', 'Một biến áp xoay chiều'], 1, 'CLO2'),
  q('EE101_Q018', 'Định lý Norton khẳng định mạng 2 đầu ra tuyến tính có thể thay thế tương đương bằng:', 'MEDIUM', ['Một nguồn điện áp nối tiếp điện trở', 'Một nguồn dòng điện độc lập I_N mắc song song với một điện trở tương đương R_N', 'Một cuộn dây nối tiếp', 'Một diode lý tưởng'], 1, 'CLO2'),
  q('EE101_Q019', 'Điều kiện để tải R_L nhận được công suất cực đại từ nguồn (Phối hợp trở kháng - Maximum Power Transfer) là:', 'MEDIUM', ['R_L = 0', 'R_L = R_th (Điện trở tải bằng đúng nội trở Thevenin của nguồn)', 'R_L tiến tới vô cùng', 'R_L = 2 * R_th'], 1, 'CLO2'),
  q('EE101_Q020', 'Hệ số công suất (Power Factor: cos φ) trong mạch điện xoay chiều biểu diễn tỷ số giữa:', 'MEDIUM', ['Công suất phản kháng Q trên công suất biểu kiến S', 'Công suất tác dụng P (Watt) trên công suất biểu kiến S (VA)', 'Điện áp cực đại trên điện áp hiệu dụng', 'Dòng điện trên điện áp'], 1, 'CLO2'),
  q('EE101_Q021', 'Tại sao các nhà máy công nghiệp cần lắp đặt tụ bù để nâng cao hệ số công suất (cos φ > 0.9)?', 'MEDIUM', ['Để máy móc chạy nhanh hơn', 'Để giảm lượng công suất phản kháng truyền tải trên đường dây, giảm tổn thất điện năng và tránh bị phạt tiền điện lực', 'Để tăng điện áp lên 380V', 'Để bảo vệ máy biến áp không bị sét đánh'], 1, 'CLO2'),
  q('EE101_Q022', 'Hiện tượng cộng hưởng nối tiếp (Series Resonance) trong mạch RLC xảy ra khi:', 'MEDIUM', ['R = 0', 'Cảm kháng bằng dung kháng (ZL = ZC, tức ωL = 1/ωC), khi đó tổng trở Z đạt giá trị cực tiểu và dòng điện đạt cực đại', 'Tần số bằng 0', 'Điện áp nguồn bằng 0'], 1, 'CLO2'),
  q('EE101_Q023', 'Tần số cộng hưởng f_0 của mạch RLC nối tiếp được tính bằng:', 'MEDIUM', ['f_0 = 1 / (2π * √(L * C))', 'f_0 = 2π * √(L * C)', 'f_0 = L / C', 'f_0 = 1 / (L * C)'], 0, 'CLO2'),
  q('EE101_Q024', 'Bộ lọc thông thấp RC (Low-Pass Filter) cho phép các tín hiệu có tần số nào đi qua với độ suy hao nhỏ nhất?', 'MEDIUM', ['Tất cả các tần số cực cao', 'Các tín hiệu có tần số thấp hơn tần số cắt f_c (f < f_c = 1 / (2πRC))', 'Chỉ duy nhất tần số 1000 Hz', 'Không cho bất kỳ tín hiệu nào đi qua'], 1, 'CLO2'),
  q('EE101_Q025', 'Bộ chia áp dùng biến trở Potentiometer thường được ứng dụng trong các thiết bị điện tử làm:', 'MEDIUM', ['Cầu chì bảo vệ', 'Núm xoay điều chỉnh âm lượng (Volume control) hoặc cảm biến đo góc quay', 'Bộ tích lũy điện năng', 'Đèn báo nguồn'], 1, 'CLO2'),

  // Vận dụng (10 câu)
  q('EE101_Q026', 'Cho mạch phân áp nguồn V_in = 12V gồm R1 = 10kΩ và R2 = 20kΩ. Điện áp V_out lấy trên R2 là bao nhiêu?', 'HARD', ['4V', '8V (V_out = 12 * 20 / (10 + 20) = 8V)', '6V', '10V'], 1, 'CLO3'),
  q('EE101_Q027', 'Một bóng đèn LED đỏ có điện áp rơi 2.0V và dòng làm việc định mức 15mA được nuôi từ nguồn 5V. Giá trị điện trở hạn dòng R cần chọn là:', 'HARD', ['100 Ω', '200 Ω (R = (5V - 2V) / 0.015A = 200Ω)', '330 Ω', '1k Ω'], 1, 'CLO3'),
  q('EE101_Q028', 'Mạch RC có R = 100kΩ và C = 10µF. Thời gian để tụ điện được coi là nạp đầy hoàn toàn (khoảng 5τ) là:', 'HARD', ['1 giây', '5 giây (τ = 100.000 * 10^-5 = 1s; 5τ = 5s)', '10 giây', '0.5 giây'], 1, 'CLO3'),
  q('EE101_Q029', 'Một nguồn điện thực tế đo hở mạch được V_oc = 24V, khi ngắn mạch đo được I_sc = 6A. Trở kháng Thevenin R_th của nguồn là:', 'HARD', ['144 Ω', '4 Ω (R_th = V_oc / I_sc = 24 / 6 = 4Ω)', '0.25 Ω', '18 Ω'], 1, 'CLO3'),
  q('EE101_Q030', 'Với nguồn có V_th = 24V và R_th = 4Ω, công suất cực đại mà nguồn có thể truyền cho tải R_L là:', 'HARD', ['144 W', '36 W (P_max = V_th^2 / (4 * R_th) = 576 / 16 = 36W)', '72 W', '18 W'], 1, 'CLO3'),
  q('EE101_Q031', 'Trong mạch xoay chiều RLC nối tiếp có R = 30Ω, ZL = 80Ω, ZC = 40Ω. Tổng trở Z của toàn mạch là:', 'HARD', ['150 Ω', '50 Ω (Z = √(R^2 + (ZL - ZC)^2) = √(30^2 + 40^2) = 50Ω)', '70 Ω', '40 Ω'], 1, 'CLO3'),
  q('EE101_Q032', 'Một tải tiêu thụ điện xoay chiều có công suất P = 800W và cos φ = 0.8 ở điện áp U = 200V. Dòng điện hiệu dụng I chạy qua tải là:', 'HARD', ['4A', '5A (I = P / (U * cos φ) = 800 / (200 * 0.8) = 5A)', '6.25A', '10A'], 1, 'CLO3'),
  q('EE101_Q033', 'Để thiết kế bộ lọc thông thấp RC có tần số cắt f_c = 1 kHz với tụ C = 100nF, giá trị điện trở R cần chọn xấp xỉ:', 'HARD', ['1.59 kΩ (R = 1 / (2π * 1000 * 100*10^-9) ≈ 1591Ω)', '10 kΩ', '330 Ω', '4.7 kΩ'], 0, 'CLO3'),
  q('EE101_Q034', 'Ba điện trở giống nhau R = 60Ω đấu hình TAM GIÁC (Delta). Khi chuyển đổi tương đương sang hình SAO (Star / Wye), giá trị mỗi điện trở nhánh là:', 'HARD', ['180 Ω', '20 Ω (R_Y = R_Delta / 3 = 60 / 3 = 20Ω)', '60 Ω', '30 Ω'], 1, 'CLO3'),
  q('EE101_Q035', 'Khi đo kiểm tra một cuộn cảm bằng đồng hồ vạn năng ở thang đo thông mạch / điện trở nhỏ, giá trị đọc được là vài Ohm. Kết luận sơ bộ là:', 'HARD', ['Cuộn cảm bị đứt hoàn toàn', 'Cuộn cảm còn tốt về mặt thông mạch một chiều (điện trở thuần của dây đồng)', 'Cuộn cảm bị chập lõi từ', 'Cuộn cảm biến thành tụ điện'], 1, 'CLO3'),

  // Vận dụng cao (5 câu)
  q('EE101_Q036', 'Phương pháp Phân tích Điện thế Nút (Nodal Analysis) thiết lập hệ phương trình đại số dựa trên định luật nào tại các nút độc lập?', 'EXPERT', ['Định luật KVL', 'Định luật KCL kết hợp với định luật Ohm biểu diễn qua điện dẫn G = 1/R', 'Định lý Thevenin', 'Quy tắc bàn tay phải'], 1, 'CLO4'),
  q('EE101_Q037', 'Hiện tượng quá áp (Resonant Overvoltage) nguy hiểm trong hệ thống điện công nghiệp khi xảy ra cộng hưởng sắt từ (Ferroresonance) do:', 'EXPERT', ['Đứt cầu chì', 'Sự tương tác phi tuyến giữa độ tự cảm của lõi sắt máy biến áp bị bão hòa từ với điện dung phân tán của đường cáp ngầm', 'Sét đánh trực tiếp', 'Ngắn mạch ba pha'], 1, 'CLO4'),
  q('EE101_Q038', 'Trong kỹ thuật xử lý tín hiệu analog, định lý Bode về độ dốc đáp ứng biên độ của bộ lọc thông thấp thụ động bậc 1 (Single-pole RC filter) sau tần số cắt là:', 'EXPERT', ['-6 dB / octave (tương đương -20 dB / decade)', '-12 dB / octave', '-40 dB / decade', '0 dB'], 0, 'CLO4'),
  q('EE101_Q039', 'Phương pháp xếp chồng (Superposition Theorem) chỉ có thể áp dụng cho các mạch điện thỏa mãn tính chất nào?', 'EXPERT', ['Mạch có diode và transistor', 'Mạch điện tuyến tính (Linear circuits) chứa các phần tử tuyến tính tuân theo nguyên lý tỷ lệ và cộng tính', 'Mạch có nguồn phi tuyến', 'Mạch công suất cực lớn'], 1, 'CLO4'),
  q('EE101_Q040', 'Trong mạch xoay chiều 3 pha đối xứng nối sao không có dây trung tính, nếu phụ tải 3 pha hoàn toàn đối xứng thì dòng điện chạy qua điểm trung tính bằng:', 'EXPERT', ['Bằng dòng điện dây', 'Bằng chính xác 0 (do tổng vectơ 3 dòng điện lệch pha 120 độ triệt tiêu nhau)', 'Bằng 3 lần dòng pha', 'Bằng vô cùng'], 1, 'CLO4')
];

// ĐỀ GỐC 2 (40 câu): Diode, Transistor BJT, Transistor MOSFET, Mạch khuếch đại thuật toán Op-Amp
const root2 = [
  // Nhận biết (10 câu)
  q('EE101_Q041', 'Chất bán dẫn thuần (Intrinsic Semiconductor) phổ biến nhất được dùng để chế tạo linh kiện điện tử là:', 'EASY', ['Đồng (Cu)', 'Silicon (Si) và Géc-ma-ni (Ge)', 'Vàng (Au)', 'Nhôm (Al)'], 1, 'CLO1'),
  q('EE101_Q042', 'Điện áp rơi chuyển tiếp (Forward Voltage Drop) thông thường của một Diode Silicon khi phân cực thuận là khoảng:', 'EASY', ['0.2V', '0.7V', '2.0V', '5.0V'], 1, 'CLO1'),
  q('EE101_Q043', 'Diode Zener hoạt động dựa trên cơ chế đặc biệt nào để giữ điện áp ổn định?', 'EASY', ['Cháy đứt khi phân cực ngược', 'Hoạt động ở vùng đánh thủng ngược (Reverse Breakdown Region) có kiểm soát', 'Khuếch đại tín hiệu', 'Phát ra ánh sáng'], 1, 'CLO1'),
  q('EE101_Q044', 'Transistor lưỡng cực (BJT) có 3 cực được ký hiệu là:', 'EASY', ['G (Gate), D (Drain), S (Source)', 'E (Emitter - Phát), B (Base - Gốc), C (Collector - Thu)', 'Anode, Cathode, Gate', 'VCC, GND, OUT'], 1, 'CLO1'),
  q('EE101_Q045', 'Transistor hiệu ứng trường kim loại - oxit - bán dẫn (MOSFET) là linh kiện điều khiển bằng:', 'EASY', ['Dòng điện cực Base', 'Điện áp đặt vào cực Cổng (Gate Voltage - V_GS)', 'Nhiệt độ môi trường', 'Ánh sáng'], 1, 'CLO1'),
  q('EE101_Q046', 'Mạch cầu chỉnh lưu 4 diode (Bridge Rectifier) có nhiệm vụ chuyển đổi:', 'EASY', ['Dòng điện một chiều DC thành xoay chiều AC', 'Dòng điện xoay chiều AC thành dòng điện một chiều DC nhấp nháy toàn sóng', 'Tăng tần số lưới điện', 'Biến đổi tín hiệu analog sang digital'], 1, 'CLO1'),
  q('EE101_Q047', 'Khuếch đại thuật toán (Op-Amp) lý tưởng có trở kháng đầu vào (Input Impedance: Z_in) bằng:', 'EASY', ['0 Ω', 'Vô cùng lớn (Z_in = ∞)', '50 Ω', '1 kΩ'], 1, 'CLO1'),
  q('EE101_Q048', 'Op-Amp lý tưởng có trở kháng đầu ra (Output Impedance: Z_out) bằng:', 'EASY', ['0 Ω', 'Vô cùng lớn', '100 Ω', '1 MΩ'], 0, 'CLO1'),
  q('EE101_Q049', 'Nguyên lý "Ngắn mạch ảo" (Virtual Short) ở 2 đầu vào của Op-Amp khi có hồi tiếp âm (Negative Feedback) phát biểu rằng:', 'EASY', ['Hai đầu vào bị chập cháy vật lý', 'Điện thế tại đầu vào đảo (V-) xấp xỉ bằng điện thế tại đầu vào không đảo (V+), tức V- ≈ V+', 'Điện áp đầu ra luôn bằng 0', 'Dòng điện chạy vào hai đầu vào rất lớn'], 1, 'CLO1'),
  q('EE101_Q050', 'Transistor BJT được dùng phổ biến trong mạch điện tử số với vai trò là:', 'EASY', ['Điện trở biến đổi', 'Khóa đóng ngắt điện tử (Electronic Switch: Chế độ Ngắt - Cutoff và Bão hòa - Saturation)', 'Pin dự phòng', 'Cảm biến nhiệt độ'], 1, 'CLO1'),

  // Thông hiểu (15 câu)
  q('EE101_Q051', 'Hệ số khuếch đại dòng điện β (hoặc h_FE) của BJT loại NPN trong mạch khuếch đại cực phát chung (CE) là tỷ số giữa:', 'MEDIUM', ['I_B / I_C', 'I_C / I_B (Dòng thu Collector chia cho dòng gốc Base)', 'I_E / I_B', 'V_CE / V_BE'], 1, 'CLO2'),
  q('EE101_Q052', 'Để Transistor NPN hoạt động trong chế độ khuếch đại tuyến tính (Active Mode), các tiếp giáp P-N cần được phân cực như thế nào?', 'MEDIUM', ['Cả 2 tiếp giáp phân cực nghịch', 'Tiếp giáp B-E phân cực thuận (Forward), tiếp giáp B-C phân cực nghịch (Reverse)', 'Cả 2 tiếp giáp phân cực thuận', 'Tiếp giáp B-E phân cực nghịch'], 1, 'CLO2'),
  q('EE101_Q053', 'Khi BJT chuyển sang chế độ Bão hòa (Saturation Mode), điện áp sụt V_CE(sat) giữa cực C và cực E xấp xỉ bằng bao nhiêu?', 'MEDIUM', ['Bằng nguồn VCC', 'Khoảng 0.1V - 0.2V (hoạt động như một công tắc cơ học đóng kín)', '0.7V', '5V'], 1, 'CLO2'),
  q('EE101_Q054', 'Điện áp ngưỡng V_th (Threshold Voltage) của MOSFET kênh N là mức điện áp V_GS tối thiểu để:', 'MEDIUM', ['MOSFET bị đánh thủng hỏng', 'Tạo ra kênh dẫn điện giữa cực máng D (Drain) và cực nguồn S (Source), cho phép dòng I_D bắt đầu chạy', 'Cực Gate tiêu thụ dòng điện lớn', 'Đảo cực tính nguồn'], 1, 'CLO2'),
  q('EE101_Q055', 'Trong mạch khuếch đại đảo sử dụng Op-Amp với điện trở vào R_in và điện trở hồi tiếp R_f, hệ số khuếch đại điện áp A_v được tính bằng:', 'MEDIUM', ['A_v = 1 + R_f / R_in', 'A_v = - (R_f / R_in)', 'A_v = R_in / R_f', 'A_v = - (R_in + R_f)'], 1, 'CLO2'),
  q('EE101_Q056', 'Trong mạch khuếch đại không đảo (Non-inverting Amplifier) sử dụng Op-Amp, hệ số khuếch đại điện áp A_v là:', 'MEDIUM', ['A_v = 1 + (R_f / R1)', 'A_v = - (R_f / R1)', 'A_v = R_f / R1', 'A_v = 1 - (R_f / R1)'], 0, 'CLO2'),
  q('EE101_Q057', 'Mạch đệm điện áp (Voltage Follower / Unity-Gain Buffer) sử dụng Op-Amp có đặc tính gì?', 'MEDIUM', ['Hệ số khuếch đại bằng 100', 'Hệ số khuếch đại A_v = 1, trở kháng vào vô cùng lớn và trở kháng ra bằng 0, dùng để phối hợp trở kháng tránh sụt áp tín hiệu', 'Đảo pha tín hiệu 180 độ', 'Lọc nhiễu cao tần'], 1, 'CLO2'),
  q('EE101_Q058', 'Mạch so sánh điện áp (Comparator) sử dụng Op-Amp hoạt động ở chế độ nào?', 'MEDIUM', ['Chế độ có hồi tiếp âm sâu', 'Chế độ vòng hở (Open Loop) không hồi tiếp hoặc hồi tiếp dương, điện áp ra luôn bão hòa ở mức nguồn dương (+Vsat) hoặc nguồn âm (-Vsat)', 'Chế độ tuyến tính', 'Chế độ nạp xả'], 1, 'CLO2'),
  q('EE101_Q059', 'Diode dập xung ngược (Flyback Diode / Freewheeling Diode) mắc song song ngược cực với cuộn hút rơ-le (Relay) nhằm mục đích gì?', 'MEDIUM', ['Làm đèn báo hiệu', 'Triệt tiêu xung điện áp tự cảm cảm ứng ngược cực cao sinh ra khi ngắt dòng qua cuộn cảm, bảo vệ transistor điều khiển không bị đánh thủng', 'Tăng tốc độ đóng rơ-le', 'Giảm dòng tiêu thụ'], 1, 'CLO2'),
  q('EE101_Q060', 'Tụ điện lọc nguồn (Filter Capacitor) mắc ở đầu ra của bộ chỉnh lưu cầu có vai trò gì?', 'MEDIUM', ['Tăng tần số sóng', 'San phẳng độ nhấp nhô (Ripple) của điện áp DC một chiều, nạp khi điện áp tăng và phóng điện cấp cho tải khi điện áp nguồn giảm', 'Đổi cực tính điện áp', 'Chống ngắn mạch'], 1, 'CLO2'),
  q('EE101_Q061', 'IC ổn áp tuyến tính kinh điển họ LM7805 cho điện áp đầu ra cố định là bao nhiêu Volt?', 'MEDIUM', ['12V', '5V (với dòng tải tối đa khoảng 1A - 1.5A)', '3.3V', '9V'], 1, 'CLO2'),
  q('EE101_Q062', 'Nhược điểm lớn nhất của các bộ ổn áp tuyến tính như LM7805 khi điện áp vào cao hơn nhiều điện áp ra là:', 'MEDIUM', ['Kích thước quá lớn', 'Hiệu suất năng lượng thấp, phần công suất dư thừa (V_in - V_out) * I_load bị tiêu tán hoàn toàn dưới dạng nhiệt năng gây nóng IC', 'Không ổn định được điện áp', 'Dễ bị nhiễu cao tần'], 1, 'CLO2'),
  q('EE101_Q063', 'Bộ nguồn xung giảm áp (Buck Converter / DC-DC Step-down) ưu việt hơn bộ ổn áp tuyến tính ở điểm cốt lõi nào?', 'MEDIUM', ['Rẻ hơn nhiều', 'Hiệu suất năng lượng rất cao (thường đạt 85% - 95%), ít tỏa nhiệt nhờ cơ chế đóng ngắt PWM tần số cao kết hợp cuộn cảm và diode', 'Cấu tạo đơn giản hơn', 'Không cần dùng tụ'], 1, 'CLO2'),
  q('EE101_Q064', 'Hiện tượng trôi nhiệt (Thermal Runaway) trong Transistor BJT xảy ra do nguyên nhân nào?', 'MEDIUM', ['Thời tiết quá lạnh', 'Khi nhiệt độ tăng làm dòng rò I_CBO tăng, kéo theo dòng I_C tăng làm tăng công suất tỏa nhiệt, nhiệt độ lại tăng tiếp tạo thành vòng luẩn quẩn phá hủy mối nối bán dẫn', 'Điện áp lưới giảm', 'Tụ điện bị rò'], 1, 'CLO2'),
  q('EE101_Q065', 'Linh kiện Optocoupler (Bộ cách ly quang, ví dụ: PC817) được ứng dụng trong mạch điện tử để:', 'MEDIUM', ['Phát sáng trang trí', 'Cách ly hoàn toàn về mặt điện học (Galvanic Isolation) giữa khối điều khiển điện áp thấp (như vi điều khiển) và khối công suất điện áp cao bằng tín hiệu ánh sáng', 'Biến đổi tần số', 'Đo cường độ ánh sáng'], 1, 'CLO2'),

  // Vận dụng (10 câu)
  q('EE101_Q066', 'Mạch khuếch đại đảo dùng Op-Amp có R_in = 10kΩ và R_f = 100kΩ. Nếu đưa tín hiệu vào V_in = 0.5V thì điện áp ra V_out bằng bao nhiêu (nguồn nuôi ±15V)?', 'HARD', ['5V', '-5V (A_v = -100/10 = -10; V_out = -10 * 0.5V = -5V)', '-0.5V', '10V'], 1, 'CLO3'),
  q('EE101_Q067', 'Một transistor NPN có dòng Base I_B = 50µA và hệ số β = 120. Dòng Collector I_C ở chế độ khuếch đại tuyến tính là:', 'HARD', ['60 mA', '6 mA (I_C = β * I_B = 120 * 0.05 mA = 6 mA)', '1.2 mA', '600 µA'], 1, 'CLO3'),
  q('EE101_Q068', 'Cần điều khiển một dải LED 12V ăn dòng 2A bằng chân GPIO 3.3V của ESP32. Linh kiện đóng cắt phù hợp và hiệu quả nhất là:', 'HARD', ['Transistor BJT công suất nhỏ 2N3904', 'N-channel Power MOSFET mức Logic (Logic-level Gate N-MOSFET như IRLZ44N)', 'Diode 1N4007', 'Điện trở 10kΩ'], 1, 'CLO3'),
  q('EE101_Q069', 'Mạch cộng đảo (Inverting Summing Amplifier) có 2 ngõ vào V1 = 1V (qua R1 = 10kΩ) và V2 = 2V (qua R2 = 10kΩ), điện trở hồi tiếp R_f = 20kΩ. Điện áp ra V_out là:', 'HARD', ['-3V', '-6V (V_out = - (20/10 * 1 + 20/10 * 2) = - (2 + 4) = -6V)', '6V', '-2V'], 1, 'CLO3'),
  q('EE101_Q070', 'Một diode Zener 5.1V mắc nối tiếp với điện trở R = 1kΩ vào nguồn V_in = 12V. Dòng điện I_Z chạy qua diode Zener là bao nhiêu (bỏ qua dòng tải)?', 'HARD', ['12 mA', '6.9 mA (I_Z = (12V - 5.1V) / 1000Ω = 6.9 mA)', '5.1 mA', '1.8 mA'], 1, 'CLO3'),
  q('EE101_Q071', 'Khi kiểm tra transistor NPN bằng thang đo Diode của VOM, que Đỏ đặt ở chân Base, que Đen lần lượt đặt vào Collector và Emitter đều chỉ giá trị khoảng 0.65V. Kết luận là:', 'HARD', ['Transistor bị chập', 'Transistor còn tốt về mặt 2 tiếp giáp P-N (B-C và B-E)', 'Transistor bị đứt', 'Chân Base bị đảo cực'], 1, 'CLO3'),
  q('EE101_Q072', 'Mạch so sánh có trễ (Schmitt Trigger) sử dụng hồi tiếp dương có ưu điểm nổi bật gì so với mạch so sánh Op-Amp thông thường?', 'HARD', ['Chạy nhanh hơn', 'Khử hiện tượng dao động rung lập lòe (Chattering) ở đầu ra khi tín hiệu analog đầu vào có nhiễu dao động quanh ngưỡng so sánh', 'Tiết kiệm điện năng', 'Không cần nguồn nuôi'], 1, 'CLO3'),
  q('EE101_Q073', 'Một mạch chỉnh lưu bán kỳ (nửa chu kỳ) sử dụng 1 diode mắc vào nguồn xoay chiều 12V_rms. Tần số nhấp nhô của điện áp DC sau chỉnh lưu là:', 'HARD', ['25 Hz', '50 Hz (bằng đúng tần số lưới)', '100 Hz', '0 Hz'], 1, 'CLO3'),
  q('EE101_Q074', 'Một mạch chỉnh lưu toàn kỳ dùng cầu 4 diode mắc vào nguồn xoay chiều 50 Hz. Tần số nhấp nhô của điện áp sau chỉnh lưu là:', 'HARD', ['50 Hz', '100 Hz (gấp đôi tần số nguồn xoay chiều)', '200 Hz', '25 Hz'], 1, 'CLO3'),
  q('EE101_Q075', 'Trong mạch khuếch đại vi sai (Differential Amplifier), tỷ số nén tín hiệu đồng pha (CMRR - Common-Mode Rejection Ratio) càng cao thì có ý nghĩa gì?', 'HARD', ['Mạch tiêu thụ nhiều dòng hơn', 'Mạch có khả năng khử nhiễu đồng pha (như nhiễu điện từ môi trường cảm ứng vào cả 2 dây tín hiệu) càng tốt', 'Khuếch đại kém hơn', 'Dễ bị méo dạng'], 1, 'CLO3'),

  // Vận dụng cao (5 câu)
  q('EE101_Q076', 'Tốc độ biến thiên điện áp cực đại ở đầu ra của Op-Amp (Slew Rate: SR tính bằng V/µs) giới hạn điều gì của mạch khuếch đại?', 'EXPERT', ['Giới hạn nhiệt độ', 'Giới hạn tần số hoạt động cực đại đối với tín hiệu biên độ lớn mà không bị méo dạng từ sóng sin thành sóng tam giác', 'Giới hạn dòng cấp', 'Giới hạn kích thước linh kiện'], 1, 'CLO4'),
  q('EE101_Q077', 'Hiện tượng Miller trong mạch khuếch đại BJT/MOSFET gây ra tác động tiêu cực nào ở dải tần số cao?', 'EXPERT', ['Làm nóng transistor', 'Điện dung ký sinh giữa cực vào và cực ra (như C_gd của MOSFET) được nhân lên theo hệ số khuếch đại, làm tăng điện dung đầu vào tương đương và làm hẹp dải thông (Bandwidth) của mạch', 'Tăng hệ số khuếch đại', 'Giảm dòng rò'], 1, 'CLO4'),
  q('EE101_Q078', 'Cấu trúc tầng đẩy kéo (Push-Pull Output Stage) Class AB sử dụng 2 diode phân cực nhằm khắc phục hiện tượng méo dạng nào của Class B?', 'EXPERT', ['Méo hài bậc 3', 'Hiện tượng méo xuyên tâm (Crossover Distortion) tại vùng điện áp gần 0V do ngưỡng dẫn 0.7V của hai transistor NPN và PNP', 'Méo pha cao tần', 'Méo nhiệt'], 1, 'CLO4'),
  q('EE101_Q079', 'Trong các bộ nguồn biến đổi năng lượng hiệu suất cao (Inverter xe điện, trạm sạc nhanh), bán dẫn dải khe năng lượng rộng (Wide-Bandgap - WBG) như GaN (Gali Nitrua) và SiC (Silic Cacbua) vượt trội so với Silicon truyền thống ở điểm nào?', 'EXPERT', ['Giá thành rẻ hơn gỗ', 'Chịu được điện áp đánh thủng cao hơn, nhiệt độ hoạt động cao hơn và tốc độ đóng cắt tần số hàng trăm kHz với tổn hao đóng cắt cực nhỏ', 'Dẫn điện kém hơn', 'Chỉ dùng ở nhiệt độ âm'], 1, 'CLO4'),
  q('EE101_Q080', 'Bộ khuếch đại đo lường (Instrumentation Amplifier) 3 Op-Amp chuyên dụng trong y tế và công nghiệp (như AD620) có ưu thế tuyệt đối nào?', 'EXPERT', ['Trở kháng vào cực lớn ở cả 2 ngõ vào vi sai, hệ số CMRR cực cao (> 100 dB) và có thể điều chỉnh hệ số khuếch đại chính xác chỉ bằng 1 điện trở duy nhất R_G', 'Không cần cấp nguồn', 'Tự động tạo ra sóng mang', 'Giá dưới 100 đồng'], 0, 'CLO4')
];

// ĐỀ GỐC 3 (40 câu): Hệ thống số, Vi điều khiển (ESP32/Arduino), Giao tiếp phần cứng, Cảm biến & Giao thức IoT
const root3 = [
  // Nhận biết (10 câu)
  q('EE101_Q081', 'Bảng chân lý của cổng logic AND cho đầu ra Y = 1 khi nào?', 'EASY', ['Khi ít nhất một đầu vào bằng 1', 'Khi TẤT CẢ các đầu vào đều bằng 1', 'Khi tất cả đầu vào bằng 0', 'Khi hai đầu vào khác nhau'], 1, 'CLO1'),
  q('EE101_Q082', 'Cổng logic XOR (Exclusive OR) cho đầu ra Y = 1 khi:', 'EASY', ['Cả 2 đầu vào đều bằng 1', 'Hai đầu vào có giá trị logic khác nhau (0-1 hoặc 1-0)', 'Cả 2 đầu vào bằng 0', 'Bất kỳ lúc nào'], 1, 'CLO1'),
  q('EE101_Q083', 'Số nhị phân `1010` tương ứng với giá trị bao nhiêu trong hệ thập phân (Decimal)?', 'EASY', ['8', '10', '12', '14'], 1, 'CLO1'),
  q('EE101_Q084', 'Vi điều khiển (Microcontroller - MCU) khác với Vi xử lý (Microprocessor - MPU) ở điểm cốt lõi nào?', 'EASY', ['Chạy chậm hơn', 'Tích hợp sẵn CPU, bộ nhớ RAM, Flash ROM và các ngoại vi I/O (GPIO, Timers, ADC, UART) trên cùng một vi mạch đơn chip', 'Không có bộ nhớ', 'Chỉ xử lý số thực'], 1, 'CLO1'),
  q('EE101_Q085', 'Vi điều khiển SoC ESP32 nổi tiếng trong thế giới IoT được tích hợp sẵn hai công nghệ kết nối không dây nào?', 'EASY', ['NFC và 5G', 'Wi-Fi (802.11 b/g/n) và Bluetooth / Bluetooth Low Energy (BLE)', 'Zigbee và LoRa', 'Hồng ngoại và Sóng ngắn'], 1, 'CLO1'),
  q('EE101_Q086', 'Chức năng GPIO trên vi điều khiển là viết tắt của cụm từ nào?', 'EASY', ['General Purpose Input Output (Chân vào/ra đa dụng)', 'Global Power Internet Online', 'Graphic Processing Interface Object', 'Gateway Port Internal Operation'], 0, 'CLO1'),
  q('EE101_Q087', 'Bộ chuyển đổi ADC (Analog-to-Digital Converter) trên vi điều khiển có nhiệm vụ gì?', 'EASY', ['Biến tín hiệu số thành tín hiệu tương tự', 'Chuyển đổi tín hiệu điện áp liên tục (Analog) thành các giá trị số nhị phân rời rạc (Digital) để CPU xử lý', 'Khuếch đại âm thanh', 'Phát xung PWM'], 1, 'CLO1'),
  q('EE101_Q088', 'Phương pháp điều chế độ rộng xung (PWM - Pulse Width Modulation) thường được dùng để làm gì trong vi điều khiển?', 'EASY', ['Tăng tần số CPU', 'Điều khiển độ sáng bóng đèn LED, tốc độ quay của động cơ DC hoặc góc quay của Servo', 'Nạp chương trình', 'Đo dung lượng pin'], 1, 'CLO1'),
  q('EE101_Q089', 'Chuẩn giao tiếp UART (Asynchronous Serial) sử dụng 2 đường truyền tín hiệu chính nào?', 'EASY', ['SDA và SCL', 'TX (Transmit - Truyền) và RX (Receive - Nhận)', 'MOSI và MISO', 'CLK và DATA'], 1, 'CLO1'),
  q('EE101_Q090', 'Giao thức mạng IoT MQTT (Message Queuing Telemetry Transport) hoạt động theo mô hình kiến trúc nào?', 'EASY', ['Peer-to-Peer (Ngang hàng)', 'Publish / Subscribe (Xuất bản / Đăng ký nhận tin) thông qua một máy chủ trung tâm gọi là MQTT Broker', 'Client - Server đồng bộ', 'Master - Slave phần cứng'], 1, 'CLO1'),

  // Thông hiểu (15 câu)
  q('EE101_Q091', 'Độ phân giải của bộ ADC 10-bit (như trên Arduino Uno) cho ra bao nhiêu mức giá trị số?', 'MEDIUM', ['256 mức (0 - 255)', '1024 mức (từ 0 đến 1023)', '4096 mức', '100 mức'], 1, 'CLO2'),
  q('EE101_Q092', 'Nếu ADC 10-bit có điện áp tham chiếu V_ref = 5.0V, độ nhạy / bước điện áp nhỏ nhất (Resolution LSB) đo được là xấp xỉ:', 'MEDIUM', ['1 mV', '4.88 mV (5.0V / 1024 ≈ 0.00488V)', '10 mV', '50 mV'], 1, 'CLO2'),
  q('EE101_Q093', 'Chu kỳ nhiệm vụ (Duty Cycle) của tín hiệu PWM biểu thị tỷ lệ nào?', 'MEDIUM', ['Thời gian tín hiệu ở mức CAO (T_on) so với tổng chu kỳ của xung (T_period): Duty = (T_on / T_period) * 100%', 'Tần số chia cho điện áp', 'Số xung trong một giây', 'Thời gian nghỉ'], 0, 'CLO2'),
  q('EE101_Q094', 'Chuẩn giao tiếp I2C (Inter-Integrated Circuit) sử dụng bao nhiêu đường dây tín hiệu và gồm những đường nào?', 'MEDIUM', ['1 dây duy nhất', '2 đường dây: SDA (Dữ liệu nối tiếp) và SCL (Xung nhịp đồng hồ nối tiếp)', '4 dây: MOSI, MISO, SCK, SS', '3 dây: TX, RX, GND'], 1, 'CLO2'),
  q('EE101_Q095', 'Tại sao trên hai đường bus SDA và SCL của giao tiếp I2C bắt buộc phải có các điện trở kéo lên nguồn (Pull-up Resistors)?', 'MEDIUM', ['Để hạn dòng chống chập', 'Vì các chân I2C được thiết kế theo cấu trúc cực máng hở (Open-Drain), cần điện trở kéo lên để xác lập mức logic CAO (1) khi bus ở trạng thái rỗi', 'Để tăng tốc độ bus', 'Để lọc nhiễu tần số thấp'], 1, 'CLO2'),
  q('EE101_Q096', 'Chuẩn giao tiếp SPI (Serial Peripheral Interface) sử dụng 4 đường dây gồm:', 'MEDIUM', ['TX, RX, CTS, RTS', 'MOSI (Master Out Slave In), MISO (Master In Slave Out), SCK (Serial Clock), SS / CS (Slave Select / Chip Select)', 'SDA, SCL, INT, RST', 'CAN_H, CAN_L, VCC, GND'], 1, 'CLO2'),
  q('EE101_Q097', 'So sánh giữa giao tiếp I2C và SPI, ưu điểm nổi bật nhất của giao tiếp SPI là gì?', 'MEDIUM', ['Tiết kiệm chân vi điều khiển hơn', 'Tốc độ truyền dữ liệu rất cao (có thể đạt hàng chục MHz), hoạt động song công toàn phần (Full-duplex)', 'Có địa chỉ thiết bị tích hợp trong giao thức', 'Truyền được xa hàng trăm mét'], 1, 'CLO2'),
  q('EE101_Q098', 'Cảm biến DHT22 thường được dùng trong các dự án IoT để đo hai thông số môi trường nào?', 'MEDIUM', ['Ánh sáng và nồng độ bụi', 'Nhiệt độ và độ ẩm không khí', 'Khoảng cách và chuyển động', 'Nồng độ khí CO2 và áp suất'], 1, 'CLO2'),
  q('EE101_Q099', 'Cảm biến siêu âm HC-SR04 đo khoảng cách tới vật cản dựa trên nguyên lý nào?', 'MEDIUM', ['Đo cường độ ánh sáng phản xạ', 'Đo thời gian bay (Time-of-Flight: ToF) từ khi phát sóng siêu âm 40 kHz đến khi nhận lại sóng phản xạ: d = (t * v_âm_thanh) / 2', 'Đo điện dung môi trường', 'Dùng tia laser'], 1, 'CLO2'),
  q('EE101_Q100', 'Quang trở (LDR - Light Dependent Resistor) có đặc tính điện trở biến đổi như thế nào theo ánh sáng?', 'MEDIUM', ['Cường độ ánh sáng chiếu vào càng mạnh thì giá trị điện trở càng tăng', 'Cường độ ánh sáng chiếu vào càng mạnh thì giá trị điện trở của quang trở càng giảm xuống', 'Điện trở không đổi', 'Trở thành pin mặt trời'], 1, 'CLO2'),
  q('EE101_Q101', 'Trong giao thức MQTT, ba mức đảm bảo chất lượng dịch vụ (QoS - Quality of Service) là:', 'MEDIUM', ['QoS Low, Mid, High', 'QoS 0 (At most once - Gửi tối đa 1 lần), QoS 1 (At least once - Gửi ít nhất 1 lần có ACK), QoS 2 (Exactly once - Gửi chính xác 1 lần)', 'QoS Fast, Normal, Secure', 'QoS 1, 2, 3'], 1, 'CLO2'),
  q('EE101_Q102', 'Cấu trúc "Topic" trong MQTT (ví dụ: `home/livingroom/temperature`) có đặc tính gì?', 'MEDIUM', ['Là một chuỗi văn bản phân cấp theo dấu gạch chéo `/`, cho phép các Client lọc dữ liệu đăng ký nhận tin linh hoạt bằng các ký tự đại diện wildcard (`+` hoặc `#`)', 'Là một địa chỉ IP cố định', 'Là mã nhị phân 16-bit', 'Là mật khẩu máy chủ'], 0, 'CLO2'),
  q('EE101_Q103', 'Chế độ ngủ sâu (Deep Sleep Mode) trên ESP32 giúp ích gì cho các thiết bị cảm biến IoT chạy pin?', 'MEDIUM', ['Tăng tốc độ xử lý AI', 'Tắt hầu hết các module (CPU, Wi-Fi, Bluetooth), giảm dòng tiêu thụ xuống chỉ còn vài micro-Ampe (µA), kéo dài tuổi thọ pin lên hàng tháng/năm', 'Sạc pin nhanh gấp 10 lần', 'Bảo vệ mã nguồn'], 1, 'CLO2'),
  q('EE101_Q104', 'Cơ chế ngắt ngoài (External Interrupt) trên chân GPIO của vi điều khiển ưu việt hơn kỹ thuật thăm dò (Polling) liên tục ở điểm nào?', 'MEDIUM', ['Tốn ít bộ nhớ flash', 'CPU chỉ phải xử lý hàm phục vụ ngắt (ISR) ngay tức thì khi có sự kiện thay đổi mức logic ở chân ngoại vi, thời gian còn lại rảnh rỗi để làm việc khác hoặc ngủ tiết kiệm năng lượng', 'Chạy đa luồng', 'Không cần viết mã lệnh'], 1, 'CLO2'),
  q('EE101_Q105', 'Công nghệ mạng diện rộng công suất thấp LoRa (Long Range) trong IoT phù hợp nhất với kịch bản ứng dụng nào?', 'MEDIUM', ['Truyền video camera giám sát độ phân giải 4K', 'Truyền các gói dữ liệu cảm biến kích thước nhỏ qua cự ly rất xa (vài km đến hàng chục km) tại các nông trại, rừng núi với mức tiêu thụ điện năng cực thấp', 'Chơi game trực tuyến', 'Truyền file âm thanh chất lượng cao'], 1, 'CLO2'),

  // Vận dụng (10 câu)
  q('EE101_Q106', 'Khi đọc tín hiệu từ một chân cảm biến có giá trị điện áp V_in = 2.5V bằng ADC 12-bit của ESP32 (V_ref = 3.3V), giá trị số nguyên đọc được là xấp xỉ:', 'HARD', ['2048', '3103 (Giá trị = (2.5 / 3.3) * 4095 ≈ 3102.27)', '1024', '4095'], 1, 'CLO3'),
  q('EE101_Q107', 'Một xung PWM 8-bit trên Arduino có dải giá trị từ 0 đến 255. Để tạo ra điện áp trung bình xấp xỉ 2.5V từ chân cấp nguồn 5V, giá trị `analogWrite(pin, val)` cần thiết lập là:', 'HARD', ['64', '127 hoặc 128 (Duty cycle 50% = 255 * 0.5 ≈ 128)', '192', '255'], 1, 'CLO3'),
  q('EE101_Q108', 'Cảm biến siêu âm HC-SR04 đo được thời gian phản xạ xung Echo là 580 µs. Biết vận tốc âm thanh trong không khí là 340 m/s (khoảng 29 µs cho mỗi cm đi và về). Khoảng cách tới vật cản là:', 'HARD', ['5 cm', '10 cm (Khoảng cách = 580 / (29 * 2) = 10 cm)', '20 cm', '58 cm'], 1, 'CLO3'),
  q('EE101_Q109', 'Khi nhấn nút bấm cơ học kết nối với vi điều khiển, hiện tượng dội phím (Button Bouncing) tạo ra chuỗi xung nhiễu giả kéo dài khoảng vài mili-giây. Giải pháp phần mềm chuẩn để chống dội (Debounce) là:', 'HARD', ['Bỏ qua nút bấm', 'Sử dụng biến lưu thời gian bằng hàm `millis()`, chỉ chấp nhận trạng thái nút bấm nếu tín hiệu ổn định vượt quá khoảng thời gian trễ debounce (thường là 20ms - 50ms)', 'Tăng tần số vi điều khiển', 'Dùng vòng lặp vô tận'], 1, 'CLO3'),
  q('EE101_Q110', 'Để điều khiển một tải công suất xoay chiều 220V (như quạt trần, bóng đèn sợi đốt) từ chân vi điều khiển 5V an toàn, giải pháp phần cứng chuẩn mực là sử dụng:', 'HARD', ['Nối trực tiếp vào chân GPIO', 'Mạch Rơ-le (Relay) có cách ly quang Opto hoặc Mạch Triac kết hợp Opto-Triac (như MOC3021 / MOC3041) có mạch phát hiện điểm 0 (Zero-Crossing)', 'Một biến trở', 'Một tụ điện gốm'], 1, 'CLO3'),
  q('EE101_Q111', 'Khi kết nối 5 cảm biến I2C cùng loại lên cùng 1 bus SDA/SCL, nếu tất cả các cảm biến này đều có cùng địa chỉ phần cứng I2C mặc định (ví dụ: 0x68) thì xảy ra sự cố gì?', 'HARD', ['Các cảm biến chạy nhanh hơn', 'Xung đột địa chỉ I2C bus dẫn tới không thể giao tiếp được với từng cảm biến riêng lẻ; cần đổi chân chọn địa chỉ AD0 hoặc dùng IC chuyển mạch I2C Multiplexer (như TCA9548A)', 'Cháy vi điều khiển', 'Điện áp bus giảm về 0'], 1, 'CLO3'),
  q('EE101_Q112', 'Trong lập trình hàm phục vụ ngắt ngoài (ISR) trên vi điều khiển, nguyên tắc vàng bắt buộc phải tuân thủ để tránh treo hệ thống là:', 'HARD', ['Thực hiện các tác vụ tính toán thật nặng', 'Hàm ISR phải thật ngắn gọn, thực thi nhanh nhất có thể (chỉ đổi cờ hiệu flag hoặc tăng biến đếm), tuyệt đối không dùng các hàm trễ như `delay()` hoặc in chuỗi Serial dài', 'Gọi hàm quét Wi-Fi', 'Lặp lại 1000 lần'], 1, 'CLO3'),
  q('EE101_Q113', 'Để lưu trữ cấu hình mạng Wi-Fi (SSID, Mật khẩu) trên ESP32 sao cho thông tin không bị mất đi khi tắt nguồn hoặc khởi động lại, ta sử dụng vùng nhớ nào?', 'HARD', ['Bộ nhớ RAM tĩnh (SRAM)', 'Bộ nhớ Flash không bay hơi thông qua thư viện NVS (Non-Volatile Storage) hoặc LittleFS / SPIFFS', 'Thanh ghi CPU', 'Bộ nhớ đệm Cache'], 1, 'CLO3'),
  q('EE101_Q114', 'Một trạm quan trắc IoT gửi dữ liệu khí tượng lên máy chủ MQTT bằng bản tin JSON: `{"temp": 28.5, "hum": 75}`. Trong trường hợp đường truyền mạng di động 4G chập chờn, để đảm bảo bản tin báo động cháy rừng chắc chắn tới được Broker ít nhất một lần, nên chọn mức QoS nào?', 'HARD', ['QoS 0', 'QoS 1 (hoặc QoS 2)', 'Không cần QoS', 'Tắt Wi-Fi'], 1, 'CLO3'),
  q('EE101_Q115', 'Khi kết nối một cảm biến chuẩn 5V (như Arduino) với chân nhận RX của module chuẩn 3.3V (như ESP32), nếu không dùng mạch chuyển mức logic (Logic Level Shifter), nguy cơ gì có thể xảy ra?', 'HARD', ['Module 3.3V không nhận được dữ liệu', 'Điện áp 5V vượt quá giới hạn an toàn tối đa của chân GPIO 3.3V, có thể làm cháy hỏng cổng vào vi điều khiển ESP32', 'Module tự động tăng lên 5V', 'Cháy dây dẫn'], 1, 'CLO3'),

  // Vận dụng cao (5 câu)
  q('EE101_Q116', 'Hệ điều hành thời gian thực FreeRTOS tích hợp sẵn trên ESP32 hỗ trợ cơ chế đồng bộ và giao tiếp giữa các Task thông qua cấu trúc nào?', 'EXPERT', ['Biến toàn cục thông thường', 'Hàng đợi thông điệp (Queues), Cờ hiệu nhị phân (Binary Semaphores) và Khóa loại trừ lẫn nhau (Mutexes)', 'Tệp tin văn bản', 'Mảng một chiều'], 1, 'CLO4'),
  q('EE101_Q117', 'Kỹ thuật Cập nhật chương trình cơ sở qua mạng không dây (OTA - Over-The-Air Firmware Update) trên thiết bị IoT hoạt động dựa trên cơ chế phân vùng nhớ Flash nào?', 'EXPERT', ['Ghi đè trực tiếp lên phân vùng boot đang chạy', 'Cơ chế 2 phân vùng ứng dụng luân phiên (ota_0 và ota_1) kết hợp với bootloader: Bản firmware mới được nạp vào phân vùng thứ 2, kiểm tra tính toàn vẹn (checksum/chữ ký số) thành công mới chuyển cờ boot', 'Dùng thẻ nhớ SD ngoài bắt buộc', 'Nạp qua bluetooth'], 1, 'CLO4'),
  q('EE101_Q118', 'Giao thức bảo mật MQTTS sử dụng lớp mã hóa nào để bảo vệ dữ liệu cảm biến IoT chống nghe lén và giả mạo trên đường truyền Internet công cộng?', 'EXPERT', ['Mã hóa đối xứng DES cũ', 'Lớp bảo mật TLS/SSL (Transport Layer Security) kết hợp xác thực chứng chỉ số X.509 giữa Client và Broker trên cổng tiêu chuẩn 8883', 'Mã hóa Base64', 'Chỉ dùng mật khẩu văn bản thô'], 1, 'CLO4'),
  q('EE101_Q119', 'Mạng cảm biến không dây Mesh Network (như ESP-NOW, Zigbee Mesh, Thread) mang lại ưu thế vượt trội gì cho hệ thống nhà thông minh diện rộng?', 'EXPERT', ['Tốc độ tải video nhanh hơn Wi-Fi 6', 'Khả năng tự định tuyến và tự phục hồi (Self-healing): Các nút thiết bị có thể đóng vai trò trạm chuyển tiếp (Router) tiếp sóng cho nhau, mở rộng phạm vi phủ sóng vượt xa giới hạn của một Access Point trung tâm', 'Không tốn pin', 'Không cần chip vi điều khiển'], 1, 'CLO4'),
  q('EE101_Q120', 'Trong thiết kế mạch in PCB cho thiết bị IoT cao tần (Wi-Fi 2.4 GHz), nguyên tắc quan trọng nhất đối với đường dẫn tín hiệu từ chân chip RF tới ăng-ten là:', 'EXPERT', ['Vẽ đường mạch zíc zắc càng dài càng tốt', 'Thiết kế đường truyền vi dải (Microstrip Trace) có trở kháng đặc tính phối hợp chuẩn xác 50 Ohm, bọc xung quanh bằng lớp mặt đất (Ground Plane) liên tục và bố trí các lỗ via tản cao tần', 'Đặt gần các linh kiện cuộn cảm nguồn xung', 'Không cần phủ đồng'], 1, 'CLO4')
];

module.exports = {
  course: {
    code: 'EE101',
    name: 'Kỹ Thuật Mạch Điện Tử & IoT',
    faculty: 'Khoa Điện - Điện Tử & Tự Động Hóa',
    category_code: 'CAT-EE101',
    credits: 3
  },
  root_1: root1,
  root_2: root2,
  root_3: root3,
  getAllQuestions: () => [...root1, ...root2, ...root3]
};

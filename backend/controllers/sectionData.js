// backend/controllers/sectionData.js
// Định nghĩa metadata các lớp học phần và giáo trình 15 tuần chuẩn hoá theo Khoa & Ngành

const SECTION_METADATA = {
  1: {
    id: 1,
    code: 'IT101_66.CNTT-1_HK1',
    course_code: 'IT101',
    course_name: 'Nhập môn Lập trình C/C++',
    name: 'Nhập môn Lập trình C/C++ (IT101)',
    faculty_id: 'CNTT',
    faculty_name: 'Khoa Công Nghệ Thông Tin',
    major_id: 'CNPM',
    major_name: 'Kỹ thuật Phần mềm',
    class_name: '66.CNTT-1',
    cohort: 'K66',
    credits: 4,
    current_enrolled: 42,
    room_name: 'P.401 (Nhà A3)',
    lecturer_name: 'TS. Hoàng Đức Em',
    degree_level: 'ĐẠI HỌC CHÍNH QUY'
  },
  2: {
    id: 2,
    code: 'IT201_66.CNTT-2_HK1',
    course_code: 'IT201',
    course_name: 'Cơ sở Dữ liệu',
    name: 'Cơ sở Dữ liệu (IT201)',
    faculty_id: 'CNTT',
    faculty_name: 'Khoa Công Nghệ Thông Tin',
    major_id: 'CNPM',
    major_name: 'Kỹ thuật Phần mềm',
    class_name: '66.CNTT-2',
    cohort: 'K66',
    credits: 3,
    current_enrolled: 40,
    room_name: 'P.402 (Nhà A3)',
    lecturer_name: 'TS. Hoàng Đức Em',
    degree_level: 'ĐẠI HỌC CHÍNH QUY'
  },
  3: {
    id: 3,
    code: 'IT301_65.CNTT-1_HK1',
    course_code: 'IT301',
    course_name: 'Cấu trúc Dữ liệu & Giải thuật',
    name: 'Cấu trúc Dữ liệu & Giải thuật (IT301)',
    faculty_id: 'CNTT',
    faculty_name: 'Khoa Công Nghệ Thông Tin',
    major_id: 'KHMT',
    major_name: 'Khoa học Máy tính',
    class_name: '65.CNTT-1',
    cohort: 'K65',
    credits: 3,
    current_enrolled: 38,
    room_name: 'Lab PM 02',
    lecturer_name: 'TS. Nguyễn Văn An',
    degree_level: 'ĐẠI HỌC CHÍNH QUY'
  },
  4: {
    id: 4,
    code: 'BA101_66.QTKD-1_HK1',
    course_code: 'BA101',
    course_name: 'Kinh Tế Vi Mô (Microeconomics)',
    name: 'Kinh Tế Vi Mô (BA101)',
    faculty_id: 'KT',
    faculty_name: 'Khoa Kinh Tế & QTKD',
    major_id: 'QTKD',
    major_name: 'Quản trị Kinh doanh',
    class_name: '66.QTKD-1',
    cohort: 'K66',
    credits: 3,
    current_enrolled: 50,
    room_name: 'P.201 (Nhà B1)',
    lecturer_name: 'TS. Nguyễn Thị Hồng',
    degree_level: 'ĐẠI HỌC CHÍNH QUY'
  },
  5: {
    id: 5,
    code: 'BA102_66.QTKD-1_HK1',
    course_code: 'BA102',
    course_name: 'Quản Trị Học Đại Cương',
    name: 'Quản Trị Học Đại Cương (BA102)',
    faculty_id: 'KT',
    faculty_name: 'Khoa Kinh Tế & QTKD',
    major_id: 'QTKD',
    major_name: 'Quản trị Kinh doanh',
    class_name: '66.QTKD-1',
    cohort: 'K66',
    credits: 3,
    current_enrolled: 50,
    room_name: 'P.202 (Nhà B1)',
    lecturer_name: 'ThS. Vũ Nam',
    degree_level: 'ĐẠI HỌC CHÍNH QUY'
  },
  6: {
    id: 6,
    code: 'ENG101_66.NNA-1_HK1',
    course_code: 'ENG101',
    course_name: 'Tiếng Anh Học Thuật 1 (General English B1)',
    name: 'Tiếng Anh Học Thuật 1 (ENG101)',
    faculty_id: 'NN',
    faculty_name: 'Khoa Ngoại Ngữ',
    major_id: 'NNA',
    major_name: 'Ngôn ngữ Anh',
    class_name: '66.NNA-1',
    cohort: 'K66',
    credits: 4,
    current_enrolled: 35,
    room_name: 'P.301 (Nhà C)',
    lecturer_name: 'TS. Phạm Thu Hương',
    degree_level: 'ĐẠI HỌC CHÍNH QUY'
  },
  7: {
    id: 7,
    code: 'EE101_66.DDT-1_HK1',
    course_code: 'EE101',
    course_name: 'Kỹ Thuật Mạch Điện Tử & IoT',
    name: 'Kỹ Thuật Mạch Điện Tử & IoT (EE101)',
    faculty_id: 'DDT',
    faculty_name: 'Khoa Điện - Điện Tử & Tự Động Hóa',
    major_id: 'DDT',
    major_name: 'Kỹ thuật Điện - Điện tử & IoT',
    class_name: '66.DDT-1',
    cohort: 'K66',
    credits: 3,
    current_enrolled: 36,
    room_name: 'Lab Vi Mạch (Nhà E)',
    lecturer_name: 'TS. Bùi Quốc Thái',
    degree_level: 'ĐẠI HỌC KỸ SƯ'
  },
  8: {
    id: 8,
    code: 'TOU101_66.DL-1_HK1',
    course_code: 'TOU101',
    course_name: 'Tổng Quan Du Lịch & Dịch Vụ Lữ Hành',
    name: 'Tổng Quan Du Lịch & Dịch Vụ Lữ Hành (TOU101)',
    faculty_id: 'DL',
    faculty_name: 'Khoa Du Lịch & Khách Sạn',
    major_id: 'DL',
    major_name: 'Quản trị Dịch vụ Du lịch & Lữ hành',
    class_name: '66.DL-1',
    cohort: 'K66',
    credits: 3,
    current_enrolled: 40,
    room_name: 'P.105 (Nhà D)',
    lecturer_name: 'ThS. Đỗ Quang Vinh',
    degree_level: 'ĐẠI HỌC CHÍNH QUY'
  }
};

const generateStandard15Weeks = (courseCode = 'IT101', sectionId = 1) => {
  let weekTitles = [];

  if (courseCode === 'BA101') {
    weekTitles = [
      { title: 'Tổng quan về Kinh tế học Vi mô, Thị trường & Quy luật Cung Cầu', desc: 'Đường cung, đường cầu, điểm cân bằng thị trường và sự can thiệp của chính phủ.' },
      { title: 'Hệ số Co Giãn của Cầu và Cung (Elasticity Analysis)', desc: 'Co giãn theo giá, co giãn theo thu nhập, co giãn chéo và ứng dụng định giá doanh nghiệp.' },
      { title: 'Lý thuyết Lựa chọn & Hành vi Người Tiêu Dùng (Consumer Theory)', desc: 'Lợi ích cận biên (MU), đường bàng quan và điểm tối đa hóa mức thỏa dụng.' },
      { title: 'Lý thuyết Sản xuất và Năng suất Cận biên (Production Function)', desc: 'Hàm sản xuất ngắn hạn, dài hạn, quy luật năng suất cận biên giảm dần.' },
      { title: 'Chi phí Sản xuất trong Doanh nghiệp (Cost Structures)', desc: 'Chi phí cố định (FC), chi phí biến đổi (VC), chi phí bình quân (ATC) và chi phí cận biên (MC).' },
      { title: 'Thị trường Cạnh Tranh Hoàn Hảo (Perfect Competition)', desc: 'Điều kiện cân bằng lợi nhuận tối đa, điểm hòa vốn và điểm đóng cửa sản xuất.' },
      { title: 'Thị trường Độc Quyền Thuần Túy (Pure Monopoly)', desc: 'Nguyên nhân độc quyền, tối đa hóa lợi nhuận và chính sách phân biệt giá.' },
      { title: 'Kiểm tra Đánh giá Quá trình Giữa Kỳ (Midterm Exam)', desc: 'Thi trắc nghiệm và bài tập tình huống phân tích chi phí thị trường.' },
      { title: 'Cạnh Tranh Độc Quyền & Thị trường Độc Quyền Nhóm (Oligopoly)', desc: 'Mô hình Cournot, đường cầu gãy khúc và cân bằng Nash trong lý thuyết trò chơi.' },
      { title: 'Thị trường Các Yếu Tố Sản Xuất (Thị trường Lao Động & Tiền Lương)', desc: 'Cầu lao động cận biên (MRP_L), tiền lương và phân phối thu nhập quốc dân.' },
      { title: 'Thất Bại của Thị Trường & Tác Động Ngoại Ứng (Externalities)', desc: 'Ngoại ứng tích cực, tiêu cực, thuế Pigou và định lý Coase.' },
      { title: 'Hàng Hóa Công Cộng & Bất Đối Xứng Thông Tin (Public Goods)', desc: 'Đặc tính phi cạnh tranh, phi loại trừ, rủi ro đạo đức và lựa chọn nghịch.' },
      { title: 'Chiến Lược Định Giá & Tối Ưu Doanh Thu Doanh Nghiệp', desc: 'Định giá theo bậc, định giá trọn gói và ứng dụng kinh tế số.' },
      { title: 'Phân Tích Cân Bằng Tổng Thể & Hiệu Quả Kinh Tế Pareto', desc: 'Hộp Edgeworth, biên sản xuất và phân bổ nguồn lực tối ưu xã hội.' },
      { title: 'Tổng kết Học phần & Hướng Dẫn Ôn Thi Cuối Kỳ', desc: 'Hệ thống hóa kiến thức 14 tuần và giải đáp bài tập thảo luận.' }
    ];
  } else if (courseCode === 'ENG101') {
    weekTitles = [
      { title: 'Introduction to Academic English & Study Skills (CEFR B1-B2)', desc: 'Overview of academic vocabulary, dictionary skills, and critical thinking.' },
      { title: 'Effective Reading Strategies: Skimming, Scanning & Note-Taking', desc: 'Techniques for processing academic texts and identifying topic sentences.' },
      { title: 'Paragraph Structure: Topic Sentences, Supporting Details & Unity', desc: 'Writing coherent academic paragraphs with logical transitions.' },
      { title: 'Academic Vocabulary: Collocations, Prefixes & Suffixes', desc: 'Expanding formal academic word list (AWL) and avoiding informal jargon.' },
      { title: 'Listening Comprehension: Academic Lectures & Seminar Discussions', desc: 'Predicting lecture content, identifying signpost expressions, and summarizing.' },
      { title: 'Writing Cause & Effect Essays: Cause-Effect Connectors', desc: 'Structuring analytical essays with empirical reasoning and cause-effect chains.' },
      { title: 'Oral Presentation Skills: Structuring an Academic Presentation', desc: 'Effective slide design, body language, tone, and Q&A management.' },
      { title: 'Midterm Assessment: Academic Reading & Listening Test', desc: 'Formal computerized assessment on reading comprehension and listening accuracy.' },
      { title: 'Writing Problem-Solution Essays & Critical Arguments', desc: 'Evaluating multiple perspectives and synthesizing opposing viewpoints.' },
      { title: 'Research & Referencing: Paraphrasing, Summarizing & Avoiding Plagiarism', desc: 'APA / Harvard referencing styles, in-text citations, and source credibility.' },
      { title: 'Data Commentary: Describing Graphs, Charts & Statistical Trends', desc: 'Language of trends, fluctuations, percentages, and comparative analysis.' },
      { title: 'Academic Debate & Group Discussion Workshop', desc: 'Techniques for agreeing, disagreeing diplomatically, and rebutting counterarguments.' },
      { title: 'Writing Formal Abstract & Literature Summary', desc: 'Drafting concise research abstracts and introductory literature overviews.' },
      { title: 'Mock Final Examination & Peer Review Workshop', desc: 'Simulated timed academic writing and peer feedback session.' },
      { title: 'Course Review, Feedback & Final Exam Preparation', desc: 'Comprehensive consolidation of linguistic competencies and exam guidelines.' }
    ];
  } else if (courseCode === 'EE101') {
    weekTitles = [
      { title: 'Tổng quan về Lý thuyết Mạch Điện & Các Định luật Kirchhoff', desc: 'Định luật Ohm, KCL, KVL, các thông số nguồn dòng, nguồn áp độc lập và phụ thuộc.' },
      { title: 'Phương pháp Phân tích Mạch Điện (Điện thế Nút & Dòng Mắt Lưới)', desc: 'Thiết lập hệ phương trình mạch, giải bằng ma trận và mô phỏng trên Proteus.' },
      { title: 'Các Định lý Mạng Điện (Thévenin, Norton & Xếp Chồng)', desc: 'Quy đổi mạch tương đương Thévenin/Norton và tối ưu hóa phối hợp trở kháng.' },
      { title: 'Linh kiện Bán dẫn: Diode và Mạch Chỉnh Lưu Nguồn', desc: 'Nguyên lý P-N, Diode Zener ổn áp, mạch chỉnh lưu nửa chu kỳ, toàn chu kỳ và lọc tụ.' },
      { title: 'Transistor BJT: Chế độ Khuếch đại và Khóa Điện tử', desc: 'Cấu tạo, đặc tuyến V-I, phân cực BJT, chế độ bão hòa và ứng dụng đóng cắt relay.' },
      { title: 'Transistor Hiệu Ứng Trường (MOSFET): Mạch Công Suất & Driver', desc: 'Cấu tạo N-Channel/P-Channel, điện áp ngưỡng Vth, đóng cắt PWM công suất cao.' },
      { title: 'Khuếch đại Thuật toán (Op-Amp): Mạch Tỷ lệ, Cộng, Trừ, Tích phân', desc: 'Khái niệm đất ảo, Op-Amp hồi tiếp âm, hồi tiếp dương, mạch so sánh Schmitt Trigger.' },
      { title: 'Kiểm tra Đánh giá Quá trình Giữa Kỳ (Midterm Hands-on Exam)', desc: 'Thi thực hành đo kiểm trên Kit thí nghiệm và bài kiểm tra trắc nghiệm lý thuyết.' },
      { title: 'Mạch Lọc Tích Cực (Active Filters) & Xử lý Tín hiệu Tương tự', desc: 'Bộ lọc thông thấp (LPF), thông cao (HPF), thông dải (BPF) bậc 1 và bậc 2.' },
      { title: 'Cảm biến Điện tử trong Hệ thống IoT (Sensors & Signal Conditioning)', desc: 'Cảm biến nhiệt độ, độ ẩm, ánh sáng, cảm biến khí và mạch phối ghép tín hiệu ADC.' },
      { title: 'Vi điều khiển Nhúng ESP32 / STM32: Giao thức SPI, I2C, UART', desc: 'Cấu trúc phần cứng vi điều khiển, cấu hình GPIO, ngắt ngoài, Timer và PWM.' },
      { title: 'Giao thức Truyền thông Không dây IoT (Wi-Fi, Bluetooth BLE, MQTT)', desc: 'Kết nối mạng không dây, gửi nhận bản tin JSON lên MQTT Broker và Cloud Server.' },
      { title: 'Thiết kế Mạch In PCB bằng Altium Designer / EasyEDA', desc: 'Nguyên lý vẽ Schematic, gán Footprint, bố trí linh kiện, đi dây (Routing) 2 lớp.' },
      { title: 'Chế tạo Mạch Mẫu Thực Nghiệm & Kiểm thử Chống Nhiễu EMI', desc: 'Hàn lắp linh kiện SMD, đo kiểm oscilloscope, đánh giá độ ổn định nhiệt và nguồn.' },
      { title: 'Bảo vệ Đồ án Môn học Mạch Điện tử & Hướng Dẫn Ôn Thi', desc: 'Báo cáo sản phẩm phần cứng IoT thực tế và tổng kết đánh giá chuẩn đầu ra.' }
    ];
  } else if (courseCode === 'TOU101') {
    weekTitles = [
      { title: 'Tổng quan về Ngành Du Lịch và Bản chất Kinh tế Du lịch', desc: 'Khái niệm, các nhân tố hình thành du lịch, động cơ đi du lịch và tác động kinh tế.' },
      { title: 'Hệ thống Tài nguyên Du lịch Việt Nam (Tự nhiên & Văn hóa)', desc: 'Địa hình, khí hậu, di sản thế giới UNESCO, lễ hội và ẩm thực truyền thống.' },
      { title: 'Thị trường Khách Du lịch & Phân đoạn Thị trường Mục tiêu', desc: 'Khách du lịch quốc tế, nội địa, xu hướng du lịch sinh thái, MICE, du lịch mạo hiểm.' },
      { title: 'Các Loại hình Doanh nghiệp Lữ hành & Dịch vụ Du lịch', desc: 'Đại lý du lịch (Travel Agency), công ty lữ hành (Tour Operator), mô hình OTA số.' },
      { title: 'Quy trình Thiết kế và Xây dựng Chương trình Du lịch (Tour Packaging)', desc: 'Khảo sát điểm đến, xây dựng tuyến điểm, lập dự toán chi phí và định giá tour.' },
      { title: 'Nghiệp vụ Hướng Dẫn Du Lịch & Kỹ năng Hoạt náo', desc: 'Phẩm chất hướng dẫn viên, thuyết minh tuyến điểm, xử lý tình huống khẩn cấp.' },
      { title: 'Tổng quan Ngành Khách sạn & Cơ sở Lưu trú Du lịch', desc: 'Phân loại khách sạn, tiêu chuẩn sao, các bộ phận Front Office, Housekeeping, F&B.' },
      { title: 'Kiểm tra Đánh giá Quá trình Giữa Kỳ (Midterm Exam)', desc: 'Đánh giá kiến thức tổng quan và bài tập xây dựng tour du lịch nội địa.' },
      { title: 'Vận chuyển Du lịch: Hàng không, Đường sắt, Đường bộ, Đường biển', desc: 'Hệ thống phân phối vé máy bay GDS, thuê xe du lịch và vận tải hành khách an toàn.' },
      { title: 'Marketing và Xúc tiến Thương hiệu Điểm đến Du lịch', desc: 'Chiến dịch truyền thông số, xúc tiến hội chợ du lịch ITE/VITM, tiếp thị du lịch AI.' },
      { title: 'Chính sách Quản lý Nhà nước và Pháp luật trong Hoạt động Du lịch', desc: 'Luật Du lịch Việt Nam 2017, cấp giấy phép kinh doanh lữ hành, quy chế bảo hiểm du lịch.' },
      { title: 'Du Lịch Bền Vững & Bảo Tồn Di Sản Văn Hóa, Môi Trường', desc: 'Sức chứa du lịch (Carrying capacity), du lịch cộng đồng (CBT) và giảm thiểu rác thải nhựa.' },
      { title: 'Chuyển Đổi Số trong Ngành Du Lịch (Smart Tourism 2026)', desc: 'Bản đồ du lịch số, thực tế ảo VR/AR tại bảo tàng, ứng dụng quản lý đặt tour thông minh.' },
      { title: 'Báo cáo Chuyên đề Tour Tuyến Thực tế & Thực hành Nghiệp vụ', desc: 'Thuyết trình kế hoạch khai thác sản phẩm du lịch mới cho một địa phương.' },
      { title: 'Tổng kết Học phần & Hướng Dẫn Ôn Tập Thi Kết Thúc Học Phần', desc: 'Hệ thống hóa toàn bộ kiến thức nghiệp vụ và giải đáp thắc mắc chuyên môn.' }
    ];
  } else {
    weekTitles = [
      { title: 'Giới thiệu Tổng quan về Ngôn ngữ C/C++ & Môi trường Lập trình', desc: 'Cài đặt IDE (VSCode, GCC), cấu trúc chương trình C++, biên dịch và chạy file mã nguồn.' },
      { title: 'Kiểu dữ liệu, Biến, Hằng số & Các Toán tử Cơ bản', desc: 'Toán tử số học, logic, quan hệ, thứ tự ưu tiên và ép kiểu dữ liệu an toàn.' },
      { title: 'Cấu trúc Điều khiển Rẽ nhánh (if-else, switch-case)', desc: 'Xây dựng thuật toán phân nhánh điều kiện và kiểm thử ca kiểm thử biên.' },
      { title: 'Cấu trúc Lặp & Vòng lặp nâng cao (for, while, do-while)', desc: 'Vòng lặp xác định và không xác định, lệnh break, continue và phòng ngừa lặp vô hạn.' },
      { title: 'Hàm và Kỹ thuật Truyền tham số (Value, Reference, Pointer)', desc: 'Tổ chức module hóa chương trình, phạm vi biến (scope), tái sử dụng mã nguồn.' },
      { title: 'Mảng Một Chiều & Thuật toán Cơ bản (Tìm kiếm, Sắp xếp)', desc: 'Khai báo, duyệt mảng, tìm max/min, Linear Search, Binary Search, Bubble Sort.' },
      { title: 'Mảng Hai Chiều & Xử lý Ma trận Số học', desc: 'Cấu trúc ma trận, cộng/nhân ma trận, ma trận tam giác và ứng dụng đồ họa game.' },
      { title: 'Kiểm tra Đánh giá Quá trình Giữa Kỳ & Ôn tập Thuật toán', desc: 'Thi trực tuyến trắc nghiệm & thực hành giải thuật tính điểm thành phần 1.' },
      { title: 'Chuỗi Ký tự (C-Strings & std::string)', desc: 'Thư viện cstring, xử lý chuỗi động std::string, chuẩn hóa họ tên và tách từ.' },
      { title: 'Con trỏ (Pointers) & Quản lý Bộ nhớ Động (new / delete)', desc: 'Địa chỉ ô nhớ, toán tử & và *, cấp phát động mảng 1D/2D, chống thất thoát RAM.' },
      { title: 'Kiểu Dữ Liệu Có Cấu Trúc (struct, union, enum)', desc: 'Định nghĩa kiểu dữ liệu mới, quản lý danh sách sinh viên bằng mảng cấu trúc.' },
      { title: 'Thao tác Tệp tin & Dòng dữ liệu (File I/O Streams)', desc: 'Thao tác ifstream, ofstream, đọc/ghi tệp nhị phân (.dat) và tệp văn bản (.txt).' },
      { title: 'Nhập môn Lập trình Hướng đối tượng OOP (Class & Object)', desc: 'Khái niệm đóng gói (Encapsulation), thuộc tính (Attributes), phương thức (Methods), constructor/destructor.' },
      { title: 'Thư viện Chuẩn STL (vector, map, set, algorithms)', desc: 'Sử dụng các container chuẩn của C++, tối ưu hóa hiệu năng và giải thuật thực tế.' },
      { title: 'Tổng kết Học phần, Báo cáo Đồ án & Hướng dẫn Ôn thi Cuối kỳ', desc: 'Đánh giá tiến độ hoàn thành LMS, giải đáp thắc mắc và công bố danh sách đủ điều kiện dự thi.' }
    ];
  }

  return weekTitles.map((w, idx) => {
    const weekNum = idx + 1;
    const fullTitle = `Tuần ${weekNum}: ${w.title}`;
    return {
      id: Number(sectionId) * 1000 + weekNum,
      section_id: Number(sectionId),
      week_number: weekNum,
      title: fullTitle,
      name: fullTitle,
      description: w.desc,
      order_index: weekNum,
      materials: [
        {
          id: Number(sectionId) * 10000 + weekNum * 2 - 1,
          module_id: Number(sectionId) * 1000 + weekNum,
          section_id: Number(sectionId),
          title: `Slide Giáo Trình Bài Giảng ${fullTitle}`,
          material_type: 'SLIDE',
          file_url: 'https://slides.techcorp.edu.vn/' + courseCode.toLowerCase() + '-week' + weekNum + '.pdf',
          category: 'MAIN_TEXTBOOK',
          external_source: 'TCU Academic Press',
          file_size_mb: 4.5,
          suggested_time_minutes: 45,
          duration_mins: 45,
          is_completed: false
        },
        {
          id: Number(sectionId) * 10000 + weekNum * 2,
          module_id: Number(sectionId) * 1000 + weekNum,
          section_id: Number(sectionId),
          title: `Video Giảng Dạy & Hướng Dẫn: ${fullTitle}`,
          material_type: 'VIDEO',
          file_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          category: 'VIDEO_LECTURE',
          external_source: 'TCU Media Hub',
          file_size_mb: 85.0,
          suggested_time_minutes: 45,
          duration_mins: 45,
          is_completed: false
        }
      ],
      quizzes: [
        {
          id: Number(sectionId) * 5000 + weekNum,
          module_id: Number(sectionId) * 1000 + weekNum,
          section_id: Number(sectionId),
          title: `Quiz Đánh Giá Quá Trình (Tuần ${weekNum}): ${w.title}`,
          time_limit_minutes: 15,
          max_attempts: 3,
          weight: 10,
          passing_score: 5.0,
          passing_score_pct: 70,
          questions: [
            {
              id: Number(sectionId) * 100000 + weekNum * 10 + 1,
              content: `Mục tiêu cốt lõi của nội dung bài học Tuần ${weekNum} (${w.title}) là gì?`,
              question_text: `Mục tiêu cốt lõi của nội dung bài học Tuần ${weekNum} (${w.title}) là gì?`,
              score: 5.0,
              correct_answer: 'A',
              explanation: 'Nắm vững kiến thức nền tảng và vận dụng giải bài tập thực tế theo chuẩn đầu ra (CLO).',
              bloom_level: 'Thông hiểu',
              answers: [
                { id: 1, letter: 'A', content: 'Nắm vững kiến thức nền tảng và vận dụng giải bài tập thực tế', is_correct: true },
                { id: 2, letter: 'B', content: 'Chỉ ghi nhớ khái niệm lý thuyết', is_correct: false },
                { id: 3, letter: 'C', content: 'Bỏ qua phần bài tập thực hành', is_correct: false },
                { id: 4, letter: 'D', content: 'Không cần làm bài tập củng cố', is_correct: false }
              ],
              options: [
                'Nắm vững kiến thức nền tảng và vận dụng giải bài tập thực tế',
                'Chỉ ghi nhớ khái niệm lý thuyết',
                'Bỏ qua phần bài tập thực hành',
                'Không cần làm bài tập củng cố'
              ]
            },
            {
              id: Number(sectionId) * 100000 + weekNum * 10 + 2,
              content: 'Chuẩn đánh giá theo Thông tư 08/2021/TT-BGDĐT yêu cầu tỷ lệ hoàn thành tối thiểu bao nhiêu để đủ điều kiện thi?',
              question_text: 'Chuẩn đánh giá theo Thông tư 08/2021/TT-BGDĐT yêu cầu tỷ lệ hoàn thành tối thiểu bao nhiêu để đủ điều kiện thi?',
              score: 5.0,
              correct_answer: 'A',
              explanation: 'Theo Điều 12 TT 08/2021/TT-BGDĐT, sinh viên cần hoàn thành tối thiểu 80% thời lượng và bài tập LMS.',
              bloom_level: 'Nhận biết',
              answers: [
                { id: 5, letter: 'A', content: 'Tối thiểu 80% thời lượng và bài tập LMS', is_correct: true },
                { id: 6, letter: 'B', content: 'Tối thiểu 50%', is_correct: false },
                { id: 7, letter: 'C', content: 'Không quy định', is_correct: false },
                { id: 8, letter: 'D', content: 'Tối thiểu 30%', is_correct: false }
              ],
              options: [
                'Tối thiểu 80% thời lượng và bài tập LMS',
                'Tối thiểu 50%',
                'Không quy định',
                'Tối thiểu 30%'
              ]
            }
          ]
        }
      ]
    };
  });
};

module.exports = {
  SECTION_METADATA,
  generateStandard15Weeks
};

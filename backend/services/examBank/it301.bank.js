// backend/services/examBank/it301.bank.js
// Ngân hàng câu hỏi chuẩn hóa: IT301 — Cấu Trúc Dữ Liệu & Giải Thuật
// Tổng cộng: 120 câu hỏi (3 Đề gốc x 40 câu hỏi)
'use strict';

function q(id, content, difficulty, answers, correctIdx, clo = 'CLO1') {
  return {
    id,
    course_code: 'IT301',
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

// ĐỀ GỐC 1 (40 câu): Độ phức tạp giải thuật, Danh sách liên kết, Ngăn xếp (Stack), Hàng đợi (Queue)
const root1 = [
  // Nhận biết (10 câu)
  q('IT301_Q001', 'Ký hiệu Big-O (O-notation) trong phân tích giải thuật dùng để biểu diễn điều gì?', 'EASY', ['Cận dưới của thời gian thực thi', 'Cận trên (Upper bound) tiệm cận của độ phức tạp thời gian hoặc không gian trong trường hợp xấu nhất', 'Thời gian thực thi trung bình tuyệt đối tính bằng giây', 'Tần số xung nhịp vi xử lý'], 1, 'CLO1'),
  q('IT301_Q002', 'Cấu trúc dữ liệu Ngăn xếp (Stack) hoạt động theo nguyên lý cơ bản nào?', 'EASY', ['FIFO (First In First Out)', 'LIFO (Last In First Out - Vào sau ra trước)', 'Ngẫu nhiên (Random Access)', 'Ưu tiên giá trị lớn nhất'], 1, 'CLO1'),
  q('IT301_Q003', 'Cấu trúc dữ liệu Hàng đợi (Queue) hoạt động theo nguyên lý cơ bản nào?', 'EASY', ['LIFO (Last In First Out)', 'FIFO (First In First Out - Vào trước ra trước)', 'LILO (Last In Last Out)', 'Ưu tiên khóa nhỏ nhất'], 1, 'CLO1'),
  q('IT301_Q004', 'Thao tác thêm một phần tử mới vào đỉnh ngăn xếp thường được gọi là gì?', 'EASY', ['Pop', 'Push', 'Peek', 'Enqueue'], 1, 'CLO1'),
  q('IT301_Q005', 'Thao tác lấy và xóa phần tử ở đỉnh ngăn xếp được gọi là gì?', 'EASY', ['Push', 'Pop', 'Top', 'Dequeue'], 1, 'CLO1'),
  q('IT301_Q006', 'Trong danh sách liên kết đơn (Singly Linked List), mỗi nút (Node) thường chứa ít nhất hai thành phần nào?', 'EASY', ['Khóa chính và Khóa ngoại', 'Dữ liệu (Data) và Con trỏ trỏ tới nút kế tiếp (Next pointer)', 'Dữ liệu và Con trỏ trỏ về nút trước', 'Địa chỉ bộ nhớ và Dung lượng RAM'], 1, 'CLO1'),
  q('IT301_Q007', 'Trong danh sách liên kết kép (Doubly Linked List), mỗi nút có bao nhiêu con trỏ liên kết?', 'EASY', ['1 con trỏ', '2 con trỏ (Next và Prev)', '3 con trỏ', 'Không có con trỏ nào'], 1, 'CLO1'),
  q('IT301_Q008', 'Thao tác truy xuất phần tử theo chỉ số ngẫu nhiên `arr[k]` trên mảng một chiều có độ phức tạp thời gian là:', 'EASY', ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], 0, 'CLO1'),
  q('IT301_Q009', 'Thao tác tìm kiếm một phần tử theo giá trị trong một danh sách liên kết đơn gồm n nút chưa sắp xếp có độ phức tạp thời gian là:', 'EASY', ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], 2, 'CLO1'),
  q('IT301_Q010', 'Hàng đợi hai đầu (Deque - Double-ended Queue) cho phép thực hiện thao tác thêm và xóa ở những vị trí nào?', 'EASY', ['Chỉ ở đầu hàng đợi', 'Chỉ ở cuối hàng đợi', 'Ở cả hai đầu (cả đầu Front và cuối Rear)', 'Chỉ ở chính giữa'], 2, 'CLO1'),

  // Thông hiểu (15 câu)
  q('IT301_Q011', 'Ưu điểm nổi bật của Danh sách liên kết so với Mảng tĩnh (Static Array) là gì?', 'MEDIUM', ['Tốc độ truy xuất phần tử nhanh hơn', 'Kích thước có thể co giãn linh hoạt trong thời gian chạy mà không cần cấp phát trước khối nhớ liên tục cố định', 'Tiết kiệm bộ nhớ hơn vì không cần con trỏ', 'Có thể áp dụng ngay tìm kiếm nhị phân'], 1, 'CLO2'),
  q('IT301_Q012', 'Nhược điểm lớn nhất của Danh sách liên kết đơn so với Mảng là:', 'MEDIUM', ['Không chứa được số thực', 'Không hỗ trợ truy xuất ngẫu nhiên O(1) và tốn thêm bộ nhớ lưu các trường con trỏ liên kết', 'Dễ bị tràn ngăn xếp', 'Không thể duyệt từ đầu đến cuối'], 1, 'CLO2'),
  q('IT301_Q013', 'Ứng dụng kinh điển nào sau đây sử dụng cấu trúc dữ liệu Ngăn xếp (Stack)?', 'MEDIUM', ['Hàng đợi in ấn tài liệu trong máy in văn phòng', 'Kiểm tra tính hợp lệ của các cặp dấu ngoặc lồng nhau trong trình biên dịch và chức năng Undo trong soạn thảo văn bản', 'Lập lịch tiến trình CPU theo vòng tròn Round-Robin', 'Thuật toán tìm đường đi ngắn nhất Dijkstra'], 1, 'CLO2'),
  q('IT301_Q014', 'Ứng dụng nào sau đây sử dụng cấu trúc dữ liệu Hàng đợi (Queue)?', 'MEDIUM', ['Chức năng quay lại trang trước (Back) của trình duyệt web', 'Hệ thống đệm xử lý gói tin mạng và hàng đợi tin nhắn bất đồng bộ (Message Queue: RabbitMQ, Kafka)', 'Đảo ngược một chuỗi ký tự', 'Chuyển đổi biểu thức trung tố sang hậu tố'], 1, 'CLO2'),
  q('IT301_Q015', 'Cho một Stack rỗng. Lần lượt thực hiện các thao tác: `push(3)`, `push(7)`, `pop()`, `push(9)`, `push(5)`, `pop()`. Giá trị của phần tử nằm ở đỉnh Stack hiện tại là:', 'MEDIUM', ['3', '7', '9', '5'], 2, 'CLO2'),
  q('IT301_Q016', 'Cho một Queue rỗng. Lần lượt thực hiện các thao tác: `enqueue(10)`, `enqueue(20)`, `dequeue()`, `enqueue(30)`. Phần tử đứng đầu để lấy ra tiếp theo là:', 'MEDIUM', ['10', '20', '30', 'Rỗng'], 1, 'CLO2'),
  q('IT301_Q017', 'Để tránh hiện tượng "Tràn ảo" (False Overflow) khi cài đặt Hàng đợi bằng mảng tuyến tính một chiều, giải pháp tối ưu là:', 'MEDIUM', ['Dùng mảng 2 chiều', 'Cài đặt Hàng đợi vòng (Circular Queue) với chỉ số xoay vòng theo phép toán lấy dư `% MAX_SIZE`', 'Giải phóng toàn bộ mảng', 'Tăng kích thước mảng lên 100 lần'], 1, 'CLO2'),
  q('IT301_Q018', 'Độ phức tạp thời gian của thuật toán thêm một nút mới vào đầu danh sách liên kết đơn (Insert at Head) là:', 'MEDIUM', ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], 0, 'CLO2'),
  q('IT301_Q019', 'Nếu chỉ giữ con trỏ trỏ tới nút đầu tiên `head` của danh sách liên kết đơn, thao tác chèn vào cuối danh sách mất thời gian là bao nhiêu?', 'MEDIUM', ['O(1)', 'O(n) vì phải duyệt tuần tự từ đầu tới nút cuối cùng', 'O(log n)', 'O(1) nếu mảng có thứ tự'], 1, 'CLO2'),
  q('IT301_Q020', 'Để thao tác chèn vào cuối danh sách liên kết đạt độ phức tạp O(1), cấu trúc dữ liệu cần duy trì thêm con trỏ nào?', 'MEDIUM', ['Con trỏ Prev', 'Con trỏ `tail` trỏ trực tiếp tới nút cuối cùng của danh sách', 'Con trỏ NULL', 'Con trỏ giữa mid'], 1, 'CLO2'),
  q('IT301_Q021', 'Biểu thức trung tố (Infix) `A + B * C` khi chuyển đổi sang biểu thức hậu tố (Postfix / RPN) là gì?', 'MEDIUM', ['+ A * B C', 'A B C * +', 'A B + C *', 'A B * C +'], 1, 'CLO2'),
  q('IT301_Q022', 'Tính giá trị của biểu thức hậu tố `5 3 2 * +` bằng cách dùng Stack:', 'MEDIUM', ['16', '11 (tính 3*2 = 6, sau đó 5 + 6 = 11)', '25', '13'], 1, 'CLO2'),
  q('IT301_Q023', 'Trong Hàng đợi ưu tiên (Priority Queue), mỗi phần tử khi thêm vào được sắp đặt dựa trên yếu tố nào?', 'MEDIUM', ['Thời điểm thêm vào sớm hay muộn', 'Độ ưu tiên (Priority) gán kèm với phần tử đó, phần tử có độ ưu tiên cao nhất luôn được phục vụ trước', 'Kích thước bộ nhớ', 'Vị trí ngẫu nhiên'], 1, 'CLO2'),
  q('IT301_Q024', 'Khi cài đặt Hàng đợi vòng bằng mảng kích thước N với hai con trỏ `front` và `rear`, điều kiện để hàng đợi ĐẦY (Full) là:', 'MEDIUM', ['front == rear', '(rear + 1) % N == front', 'rear == N - 1', 'front == 0'], 1, 'CLO2'),
  q('IT301_Q025', 'Danh sách liên kết vòng (Circular Linked List) khác danh sách liên kết đơn thông thường ở điểm nào?', 'MEDIUM', ['Có 2 con trỏ ở mỗi nút', 'Con trỏ `next` của nút cuối cùng trỏ quay trở lại nút đầu tiên `head` thay vì trỏ tới `NULL`', 'Chỉ lưu số nguyên', 'Không có điểm bắt đầu'], 1, 'CLO2'),

  // Vận dụng (10 câu)
  q('IT301_Q026', 'Cho đoạn mã: `for (int i = 1; i <= n; i *= 2) { count++; }`. Độ phức tạp thời gian của đoạn mã trên là:', 'HARD', ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], 1, 'CLO3'),
  q('IT301_Q027', 'Cho đoạn mã hai vòng lặp lồng nhau: `for (int i = 0; i < n; i++) for (int j = 0; j < i; j++) sum++;`. Độ phức tạp thời gian là:', 'HARD', ['O(n)', 'O(n log n)', 'O(n^2)', 'O(2^n)'], 2, 'CLO3'),
  q('IT301_Q028', 'Để đảo ngược một danh sách liên kết đơn bằng cách thay đổi các liên kết con trỏ với O(n) thời gian và O(1) không gian, cần sử dụng bao nhiêu con trỏ tạm?', 'HARD', ['1 con trỏ', '2 con trỏ', '3 con trỏ (prev, current, next)', 'Không cần con trỏ nào'], 2, 'CLO3'),
  q('IT301_Q029', 'Thuật toán tìm phần tử ở giữa (Middle Element) của danh sách liên kết đơn trong một lượt duyệt duy nhất sử dụng kỹ thuật gì?', 'HARD', ['Đệ quy', 'Kỹ thuật hai con trỏ rùa và thỏ (Slow pointer nhảy 1 bước, Fast pointer nhảy 2 bước)', 'Chuyển sang mảng phụ', 'Duyệt ngược từ đuôi'], 1, 'CLO3'),
  q('IT301_Q030', 'Thuật toán Floyd (Tortoise and Hare) dùng để phát hiện chu trình (Cycle) trong danh sách liên kết dựa trên nguyên lý nào?', 'HARD', ['Nếu có chu trình, con trỏ chạy nhanh (fast) chắc chắn sẽ đuổi kịp và trùng vị trí với con trỏ chạy chậm (slow)', 'Đếm số lượng nút vượt quá n', 'Kiểm tra nút có giá trị âm', 'Xóa dần từng nút'], 0, 'CLO3'),
  q('IT301_Q031', 'Cài đặt một Hàng đợi (Queue) bằng cách sử dụng hai Ngăn xếp (Two Stacks `s1` và `s2`) đạt được chi phí thời gian khấu hao (Amortized Complexity) cho mỗi thao tác là:', 'HARD', ['O(n) cho mọi thao tác', 'O(1) khấu hao cho cả Enqueue và Dequeue', 'O(log n)', 'O(n^2)'], 1, 'CLO3'),
  q('IT301_Q032', 'Giải bài toán "Cặp dấu ngoặc hợp lệ" với chuỗi gồm các ký tự `()[]{}`. Khi gặp một dấu ngoặc đóng, thao tác chuẩn trên Stack là:', 'HARD', ['Push dấu ngoặc đóng vào Stack', 'Kiểm tra Stack, nếu rỗng hoặc đỉnh Stack không phải dấu mở ngoặc tương ứng thì chuỗi không hợp lệ, ngược lại Pop đỉnh Stack', 'Xóa toàn bộ Stack', 'Bỏ qua không kiểm tra'], 1, 'CLO3'),
  q('IT301_Q033', 'Khi đánh giá độ phức tạp không gian (Space Complexity) của thuật toán đệ quy, yếu tố nào đóng góp trực tiếp vào bộ nhớ sử dụng?', 'HARD', ['Thời gian chạy của CPU', 'Độ sâu tối đa của cây gọi đệ quy tương ứng với số khung ngăn xếp (Stack Frames) được lưu trữ trên Call Stack', 'Kích thước tệp mã nguồn', 'Số lượng lệnh printf'], 1, 'CLO3'),
  q('IT301_Q034', 'Thuật toán Min-Stack cho phép thực hiện `getMin()` trong thời gian O(1) bằng cách nào?', 'HARD', ['Duyệt tìm giá trị nhỏ nhất mỗi lần gọi', 'Sử dụng thêm một Stack phụ lưu trữ các giá trị nhỏ nhất tương ứng tại mỗi thời điểm push', 'Sắp xếp lại Stack sau mỗi lần push', 'Dùng cây nhị phân'], 1, 'CLO3'),
  q('IT301_Q035', 'Khi xóa một nút ở giữa danh sách liên kết kép, số lượng liên kết con trỏ cần cập nhật lại là bao nhiêu?', 'HARD', ['1 liên kết', '2 liên kết (`prev->next = next` và `next->prev = prev`)', '4 liên kết', 'Không cần cập nhật'], 1, 'CLO3'),

  // Vận dụng cao (5 câu)
  q('IT301_Q036', 'Phương pháp phân tích chi phí khấu hao (Amortized Analysis) bằng kỹ thuật Thế năng (Potential Method) phát biểu rằng:', 'EXPERT', ['Chi phí khấu hao bằng chi phí thực tế cộng với độ biến thiên thế năng của cấu trúc dữ liệu', 'Chi phí khấu hao luôn bằng 0', 'Chỉ áp dụng cho giải thuật đệ quy', 'Độ phức tạp trường hợp xấu nhất luôn bằng O(1)'], 0, 'CLO4'),
  q('IT301_Q037', 'Cấu trúc Danh sách nhảy (Skip List) đạt được tốc độ tìm kiếm O(log n) trên danh sách liên kết bằng cách sử dụng cơ chế nào?', 'EXPERT', ['Sắp xếp lại mảng liên tục', 'Xây dựng nhiều tầng liên kết ngẫu nhiên hóa (Probabilistic multi-level pointers) cho phép bỏ qua các đoạn phần tử', 'Dùng cây đỏ đen', 'Dùng bảng băm'], 1, 'CLO4'),
  q('IT301_Q038', 'Thuật toán LRU Cache (Least Recently Used) đạt hiệu năng O(1) cho cả hai thao tác `get` và `put` bằng cách kết hợp 2 cấu trúc nào?', 'EXPERT', ['Mảng và Ngăn xếp', 'Bảng băm (Hash Map) kết hợp với Danh sách liên kết kép (Doubly Linked List)', 'Cây nhị phân và Hàng đợi', 'Hai mảng một chiều'], 1, 'CLO4'),
  q('IT301_Q039', 'Bài toán Maximum Sliding Window (Tìm giá trị lớn nhất trong cửa sổ trượt kích thước k trên mảng n phần tử) được giải quyết tối ưu trong O(n) thời gian bằng cấu trúc nào?', 'EXPERT', ['Priority Queue thông thường', 'Hàng đợi hai đầu đơn điệu (Monotonic Deque)', 'Sắp xếp QuickSort từng cửa sổ', 'Cây phân đoạn Segment Tree'], 1, 'CLO4'),
  q('IT301_Q040', 'Định lý Thợ (Master Theorem) áp dụng cho hệ thức truy hồi `T(n) = a*T(n/b) + f(n)`. Trường hợp `f(n) = O(n^(log_b(a) - ε))` với ε > 0 cho độ phức tạp là:', 'EXPERT', ['O(n)', 'O(n^(log_b a))', 'O(n log n)', 'O(log n)'], 1, 'CLO4')
];

// ĐỀ GỐC 2 (40 câu): Cấu trúc Cây (Tree), BST, Cây AVL, Heap, Bảng băm (Hash Table)
const root2 = [
  // Nhận biết (10 câu)
  q('IT301_Q041', 'Một Cây nhị phân (Binary Tree) là cây có đặc điểm mỗi nút có tối đa bao nhiêu nút con?', 'EASY', ['1 nút con', '2 nút con (Con trái và Con phải)', '3 nút con', 'Không giới hạn số con'], 1, 'CLO1'),
  q('IT301_Q042', 'Nút không có bất kỳ nút con nào trong cây được gọi là:', 'EASY', ['Nút gốc (Root)', 'Nút lá (Leaf node)', 'Nút trong (Internal node)', 'Nút cha'], 1, 'CLO1'),
  q('IT301_Q043', 'Nút duy nhất trên cây không có nút cha được gọi là:', 'EASY', ['Nút lá', 'Nút gốc (Root)', 'Nút trung gian', 'Nút nhánh'], 1, 'CLO1'),
  q('IT301_Q044', 'Thứ tự duyệt cây Tiền thứ tự (Preorder Traversal) là:', 'EASY', ['Gốc -> Trái -> Phải (NLR)', 'Trái -> Gốc -> Phải (LNR)', 'Trái -> Phải -> Gốc (LRN)', 'Phải -> Gốc -> Trái'], 0, 'CLO1'),
  q('IT301_Q045', 'Thứ tự duyệt cây Trung thứ tự (Inorder Traversal) là:', 'EASY', ['NLR', 'Trái -> Gốc -> Phải (LNR)', 'LRN', 'NRL'], 1, 'CLO1'),
  q('IT301_Q046', 'Thứ tự duyệt cây Hậu thứ tự (Postorder Traversal) là:', 'EASY', ['NLR', 'LNR', 'Trái -> Phải -> Gốc (LRN)', 'RNL'], 2, 'CLO1'),
  q('IT301_Q047', 'Đặc tính của Cây tìm kiếm nhị phân (BST - Binary Search Tree) là gì?', 'EASY', ['Các nút được xếp ngẫu nhiên', 'Mọi nút ở cây con trái có giá trị nhỏ hơn nút gốc, và mọi nút ở cây con phải có giá trị lớn hơn nút gốc', 'Các nút lá có cùng độ sâu', 'Cây luôn cân bằng hoàn hảo'], 1, 'CLO1'),
  q('IT301_Q048', 'Hàm băm (Hash Function) trong Bảng băm có nhiệm vụ cốt lõi là gì?', 'EASY', ['Mã hóa dữ liệu chống xem trộm', 'Ánh xạ một khóa (Key) có kích thước tùy ý thành một chỉ số số nguyên trong phạm vi kích thước của bảng băm', 'Sắp xếp dữ liệu theo thứ tự', 'Tăng dung lượng lưu trữ'], 1, 'CLO1'),
  q('IT301_Q049', 'Hiện tượng hai khóa khác nhau cùng được ánh xạ về một chỉ số trong bảng băm được gọi là:', 'EASY', ['Tràn bộ nhớ', 'Đụng độ (Collision / Xung đột băm)', 'Lỗi phân trang', 'Phân mảnh băm'], 1, 'CLO1'),
  q('IT301_Q050', 'Cây nhị phân đống cực tiểu (Min-Heap) có tính chất đặc trưng nào?', 'EASY', ['Nút gốc luôn có giá trị lớn nhất', 'Giá trị tại mỗi nút cha luôn nhỏ hơn hoặc bằng giá trị của tất cả các nút con của nó', 'Cây con trái luôn lớn hơn cây con phải', 'Cây có độ cao không giới hạn'], 1, 'CLO1'),

  // Thông hiểu (15 câu)
  q('IT301_Q051', 'Khi duyệt Cây tìm kiếm nhị phân (BST) theo thứ tự Trung thứ tự (Inorder), dãy khóa thu được có tính chất gì?', 'MEDIUM', ['Ngẫu nhiên', 'Được sắp xếp theo thứ tự tăng dần', 'Được sắp xếp theo thứ tự giảm dần', 'Dãy số đảo ngược'], 1, 'CLO2'),
  q('IT301_Q052', 'Độ phức tạp thời gian tìm kiếm một phần tử trên Cây tìm kiếm nhị phân cân bằng gồm n nút là:', 'MEDIUM', ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], 1, 'CLO2'),
  q('IT301_Q053', 'Trong trường hợp xấu nhất (Cây bị suy biến thành đường thẳng), độ phức tạp tìm kiếm trên BST là:', 'MEDIUM', ['O(log n)', 'O(n)', 'O(1)', 'O(n^2)'], 1, 'CLO2'),
  q('IT301_Q054', 'Cây cân bằng AVL (Adelson-Velsky and Landis) duy trì điều kiện cân bằng tại mỗi nút như thế nào?', 'MEDIUM', ['Số lượng nút cây con trái bằng cây con phải', 'Chênh lệch chiều cao giữa cây con trái và cây con phải (Hệ số cân bằng Balance Factor) không vượt quá 1 (chỉ nhận giá trị -1, 0, 1)', 'Tất cả các nút lá nằm ở cùng tầng', 'Các nút có giá trị chẵn'], 1, 'CLO2'),
  q('IT301_Q055', 'Khi chèn một phần tử làm mất cân bằng cây AVL ở trường hợp Lệch Trái - Trái (Left-Left), phép quay nào được áp dụng để cân bằng lại cây?', 'MEDIUM', ['Quay trái đơn (Left Rotation)', 'Quay phải đơn (Right Rotation)', 'Quay kép Trái - Phải', 'Quay kép Phải - Trái'], 1, 'CLO2'),
  q('IT301_Q056', 'Phương pháp giải quyết đụng độ băm bằng Kỹ thuật nối kết (Separate Chaining) hoạt động như thế nào?', 'MEDIUM', ['Bỏ qua phần tử bị đụng độ', 'Mỗi ô trong bảng băm trỏ tới một danh sách liên kết chứa tất cả các phần tử có cùng giá trị băm', 'Ghi đè phần tử cũ', 'Tăng kích thước mảng lên gấp đôi ngay'], 1, 'CLO2'),
  q('IT301_Q057', 'Phương pháp Dò tuyến tính (Linear Probing) trong địa chỉ mở (Open Addressing) tìm ô trống tiếp theo bằng công thức nào?', 'MEDIUM', ['(hash(k) + i) % TableSize', '(hash(k) + i^2) % TableSize', 'hash2(k) % TableSize', 'hash(k) * i'], 0, 'CLO2'),
  q('IT301_Q058', 'Hệ số tải (Load Factor: α = n / m) trong Bảng băm thể hiện điều gì?', 'MEDIUM', ['Tốc độ CPU khi băm', 'Tỷ lệ giữa số lượng phần tử đã lưu trữ (n) trên tổng dung lượng các ô của bảng băm (m)', 'Số lần đụng độ tối đa', 'Độ dài chuỗi khóa'], 1, 'CLO2'),
  q('IT301_Q059', 'Khi hệ số tải của bảng băm vượt quá một ngưỡng nhất định (thường là 0.7 - 0.75), thao tác nào cần được thực hiện?', 'MEDIUM', ['Xóa nửa số phần tử', 'Tái băm (Rehashing): Tăng kích thước bảng băm (thường gấp đôi và chọn số nguyên tố) và băm lại tất cả các phần tử', 'Dừng chương trình', 'Chuyển sang cây nhị phân'], 1, 'CLO2'),
  q('IT301_Q060', 'Cấu trúc Max-Heap có thể được biểu diễn gọn gàng trong bộ nhớ bằng mảng một chiều. Với nút tại chỉ số `i` (gốc là 0), chỉ số con trái và con phải lần lượt là:', 'MEDIUM', ['2*i và 2*i + 1', '2*i + 1 và 2*i + 2', 'i - 1 và i + 1', 'i / 2 và i / 2 + 1'], 1, 'CLO2'),
  q('IT301_Q061', 'Thao tác chèn (Insert) một phần tử vào Heap gồm n phần tử có độ phức tạp thời gian là:', 'MEDIUM', ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], 1, 'CLO2'),
  q('IT301_Q062', 'Thao tác xóa phần tử gốc (Extract-Min hoặc Extract-Max) trong Heap mất thời gian bao lâu?', 'MEDIUM', ['O(1)', 'O(log n) do cần thực hiện thao tác vun đống (Heapify / Sift-Down)', 'O(n)', 'O(n^2)'], 1, 'CLO2'),
  q('IT301_Q063', 'Cây nhị phân hoàn chỉnh (Complete Binary Tree) gồm n nút có độ cao (Height) là:', 'MEDIUM', ['n', 'floor(log2 n)', 'n / 2', '2^n'], 1, 'CLO2'),
  q('IT301_Q064', 'Một cây nhị phân đầy đủ (Full Binary Tree) có đặc điểm gì?', 'MEDIUM', ['Tất cả các nút đều có giá trị dương', 'Mỗi nút đều có đúng 0 hoặc 2 nút con (không có nút nào có duy nhất 1 con)', 'Mọi lá đều ở độ sâu 3', 'Số nút là số chẵn'], 1, 'CLO2'),
  q('IT301_Q065', 'Để xóa một nút có ĐỦ CẢ HAI CON trong Cây tìm kiếm nhị phân (BST), phương pháp chuẩn là gì?', 'MEDIUM', ['Xóa luôn cả hai cây con', 'Thay thế giá trị của nút cần xóa bằng phần tử nhỏ nhất của cây con phải (Inorder Successor) hoặc lớn nhất của cây con trái (Inorder Predecessor), sau đó xóa nút thế mạng đó', 'Đưa giá trị nút về 0', 'Biến nút thành con trỏ NULL'], 1, 'CLO2'),

  // Vận dụng (10 câu)
  q('IT301_Q066', 'Cho dãy khóa: `{40, 20, 60, 10, 30, 50, 70}` chèn lần lượt vào BST rỗng. Duyệt cây theo Postorder thu được dãy nào?', 'HARD', ['10, 20, 30, 40, 50, 60, 70', '10, 30, 20, 50, 70, 60, 40', '40, 20, 10, 30, 60, 50, 70', '70, 60, 50, 40, 30, 20, 10'], 1, 'CLO3'),
  q('IT301_Q067', 'Khi một nút trong cây AVL bị mất cân bằng dạng Lệch Phải - Trái (Right-Left), các bước quay cần thực hiện là:', 'HARD', ['Quay phải đơn', 'Quay phải tại cây con phải, sau đó quay trái tại nút mất cân bằng', 'Quay trái tại cây con trái, sau đó quay phải', 'Quay trái đơn'], 1, 'CLO3'),
  q('IT301_Q068', 'Cây Đỏ - Đen (Red-Black Tree) đảm bảo rằng đường đi dài nhất từ gốc tới một lá không vượt quá bao nhiêu lần đường đi ngắn nhất?', 'HARD', ['Không vượt quá 1.5 lần', 'Không vượt quá 2 lần (đảm bảo độ phức tạp tìm kiếm luôn xấp xỉ O(log n))', 'Bằng nhau chính xác 100%', 'Gấp 3 lần'], 1, 'CLO3'),
  q('IT301_Q069', 'Thuật toán xây dựng một Max-Heap từ mảng n phần tử bất kỳ (Build-Heap) từ dưới lên mất thời gian là:', 'HARD', ['O(n log n)', 'O(n)', 'O(n^2)', 'O(log n)'], 1, 'CLO3'),
  q('IT301_Q070', 'Hiện tượng Cụm sơ cấp (Primary Clustering) trong giải quyết đụng độ bảng băm bằng Dò tuyến tính dẫn tới hậu quả gì?', 'HARD', ['Làm sập bảng băm', 'Các ô bị chiếm đóng liên tiếp tạo thành các dải dài, khiến các lần băm rơi vào khu vực này phải dò tìm rất nhiều bước làm giảm hiệu năng', 'Gây rò rỉ bộ nhớ', 'Khóa bị trùng lặp'], 1, 'CLO3'),
  q('IT301_Q071', 'Kỹ thuật Băm kép (Double Hashing) giải quyết đụng độ bằng công thức tính bước nhảy như thế nào?', 'HARD', ['Nhảy cố định 1 đơn vị', 'Sử dụng hàm băm thứ hai `h2(k)` độc lập để tính bước nhảy: `(h1(k) + i * h2(k)) % M`', 'Nhảy theo số mũ i^2', 'Nhảy ngẫu nhiên'], 1, 'CLO3'),
  q('IT301_Q072', 'Cho cây nhị phân có phép duyệt Inorder là: `D, B, E, A, F, C` và Preorder là: `A, B, D, E, C, F`. Nút gốc của cây là nút nào?', 'HARD', ['Nút D', 'Nút A (vì Preorder luôn bắt đầu bằng nút gốc)', 'Nút C', 'Nút F'], 1, 'CLO3'),
  q('IT301_Q073', 'Thuật toán duyệt cây theo mức (Level-order Traversal / Breadth-first) sử dụng cấu trúc dữ liệu bổ trợ nào?', 'HARD', ['Ngăn xếp (Stack)', 'Hàng đợi (Queue)', 'Mảng 2 chiều', 'Cây nhị phân con'], 1, 'CLO3'),
  q('IT301_Q074', 'Cấu trúc cây Trie (Prefix Tree) đặc biệt tối ưu cho bài toán nào sau đây?', 'HARD', ['Tính toán số học', 'Tìm kiếm chuỗi theo tiền tố (Autocomplete / Gợi ý từ trong từ điển) với độ phức tạp chỉ phụ thuộc vào độ dài chuỗi O(L)', 'Sắp xếp số thực', 'Tìm đường đi ngắn nhất'], 1, 'CLO3'),
  q('IT301_Q075', 'Số cây nhị phân khác nhau có thể tạo thành từ n nút phân biệt được tính bằng công thức toán học nào?', 'HARD', ['Giai thừa n!', 'Số Catalan thứ n: C_n = (2n)! / ((n+1)! * n!)', '2^n', 'n^2'], 1, 'CLO3'),

  // Vận dụng cao (5 câu)
  q('IT301_Q076', 'Cây B-Tree bậc m (B-Tree of order m) được ứng dụng rộng rãi trong hệ thống quản lý tập tin và cơ sở dữ liệu nhờ ưu điểm vượt trội nào?', 'EXPERT', ['Chỉ lưu trên RAM', 'Mỗi nút có thể chứa nhiều khóa và có nhiều con, kích thước mỗi nút khớp với kích thước một trang đĩa (Disk Block/Page), giúp giảm thiểu số lần truy xuất I/O đĩa cơ bản', 'Cây không bao giờ cần cân bằng', 'Chỉ dùng cho kiểu số nguyên'], 1, 'CLO4'),
  q('IT301_Q077', 'Bộ lọc Bloom (Bloom Filter) sử dụng mảng bit và k hàm băm độc lập có đặc tính xác suất nào?', 'EXPERT', ['Không bao giờ sai', 'Có thể xảy ra dương tính giả (False Positive: báo có nhưng thực tế không có), nhưng KHÔNG BAO GIỜ xảy ra âm tính giả (False Negative: báo không có là chắc chắn không có)', 'Luôn xảy ra âm tính giả', 'Chỉ lưu trữ được 100 phần tử'], 1, 'CLO4'),
  q('IT301_Q078', 'Cấu trúc dữ liệu Cây phân đoạn (Segment Tree) hỗ trợ truy vấn tổng/min trên đoạn `[L, R]` và cập nhật một phần tử với độ phức tạp thời gian là:', 'EXPERT', ['O(1) cho cả hai', 'O(log n) cho cả thao tác truy vấn và thao tác cập nhật', 'O(n) cho truy vấn', 'O(n log n)'], 1, 'CLO4'),
  q('IT301_Q079', 'Cấu trúc Fenwick Tree (Binary Indexed Tree - BIT) tính tổng tiền tố (Prefix Sum) có ưu thế gì so với Segment Tree?', 'EXPERT', ['Cài đặt cực kỳ ngắn gọn bằng các phép toán thao tác bit `i & (-i)` và chỉ tốn đúng O(n) bộ nhớ mảng', 'Tính được giá trị chuỗi ký tự', 'Chạy đa luồng tự động', 'Không cần dùng vòng lặp'], 0, 'CLO4'),
  q('IT301_Q080', 'Cây Splay (Splay Tree) duy trì hiệu năng khấu hao O(log n) cho các thao tác dựa trên nguyên lý hoạt động nào?', 'EXPERT', ['Không bao giờ thay đổi cấu trúc', 'Mỗi khi một nút được truy cập, nó sẽ được đẩy lên làm nút gốc thông qua một chuỗi các phép quay (Splaying), tận dụng tính cục bộ truy cập (Locality of Reference)', 'Tự động băm lại dữ liệu', 'Xóa các nút lá định kỳ'], 1, 'CLO4')
];

// ĐỀ GỐC 3 (40 câu): Cấu trúc Đồ thị (Graph), Thuật toán BFS/DFS, Cây khung nhỏ nhất, Đường đi ngắn nhất, Sắp xếp nâng cao
const root3 = [
  // Nhận biết (10 câu)
  q('IT301_Q081', 'Một đồ thị vô hướng G = (V, E) gồm hai tập hợp nào?', 'EASY', ['Tập các hàm và biến', 'Tập các đỉnh (Vertices - V) và tập các cạnh (Edges - E)', 'Tập khóa và giá trị', 'Tập hàng và cột'], 1, 'CLO1'),
  q('IT301_Q082', 'Ma trận kề (Adjacency Matrix) biểu diễn đồ thị có n đỉnh là ma trận vuông kích thước bao nhiêu?', 'EASY', ['n x 2', 'n x n', '2n x 2n', 'n x (n - 1)'], 1, 'CLO1'),
  q('IT301_Q083', 'Thuật toán Duyệt theo chiều rộng (BFS - Breadth-First Search) trên đồ thị sử dụng cấu trúc dữ liệu nào?', 'EASY', ['Ngăn xếp (Stack)', 'Hàng đợi (Queue)', 'Cây nhị phân', 'Bảng băm'], 1, 'CLO1'),
  q('IT301_Q084', 'Thuật toán Duyệt theo chiều sâu (DFS - Depth-First Search) trên đồ thị sử dụng cấu trúc dữ liệu nào?', 'EASY', ['Hàng đợi (Queue)', 'Ngăn xếp (Stack hoặc đệ quy gọi hàm)', 'Hàng đợi ưu tiên', 'Mảng 2 chiều'], 1, 'CLO1'),
  q('IT301_Q085', 'Cây khung (Spanning Tree) của một đồ thị liên thông có V đỉnh chứa chính xác bao nhiêu cạnh?', 'EASY', ['V cạnh', 'V - 1 cạnh', 'V + 1 cạnh', '2*V cạnh'], 1, 'CLO1'),
  q('IT301_Q086', 'Thuật toán Dijkstra được dùng để giải quyết bài toán nào trên đồ thị có trọng số không âm?', 'EASY', ['Tìm chu trình Euler', 'Tìm đường đi ngắn nhất từ một đỉnh nguồn tới tất cả các đỉnh còn lại', 'Tìm luồng cực đại', 'Tô màu đồ thị'], 1, 'CLO1'),
  q('IT301_Q087', 'Thuật toán Kruskal và thuật toán Prim dùng để giải quyết bài toán nào?', 'EASY', ['Tìm đường đi ngắn nhất', 'Tìm cây khung nhỏ nhất (Minimum Spanning Tree - MST)', 'Tìm thành phần liên thông mạnh', 'Sắp xếp topo'], 1, 'CLO1'),
  q('IT301_Q088', 'Độ phức tạp thời gian trung bình của thuật toán Sắp xếp nhanh (QuickSort) là:', 'EASY', ['O(n)', 'O(n log n)', 'O(n^2)', 'O(log n)'], 1, 'CLO1'),
  q('IT301_Q089', 'Độ phức tạp thời gian trong mọi trường hợp (xấu nhất, tốt nhất, trung bình) của thuật toán Sắp xếp trộn (MergeSort) là:', 'EASY', ['O(n log n)', 'O(n^2)', 'O(n)', 'O(2^n)'], 0, 'CLO1'),
  q('IT301_Q090', 'Độ phức tạp thời gian của thuật toán Sắp xếp vun đống (HeapSort) trên mảng n phần tử là:', 'EASY', ['O(n^2)', 'O(n log n)', 'O(n)', 'O(log n)'], 1, 'CLO1'),

  // Thông hiểu (15 câu)
  q('IT301_Q091', 'So sánh giữa biểu diễn đồ thị bằng Ma trận kề và Danh sách kề (Adjacency List), Danh sách kề tối ưu hơn khi nào?', 'MEDIUM', ['Khi đồ thị là đồ thị dày đặc (Dense Graph: số cạnh xấp xỉ V^2)', 'Khi đồ thị là đồ thị thưa (Sparse Graph: số cạnh nhỏ hơn nhiều so với V^2), giúp tiết kiệm đáng kể bộ nhớ O(V + E)', 'Khi số đỉnh vượt quá 1 triệu', 'Khi đồ thị có trọng số âm'], 1, 'CLO2'),
  q('IT301_Q092', 'Độ phức tạp thời gian của thuật toán BFS và DFS khi biểu diễn đồ thị bằng Danh sách kề là:', 'MEDIUM', ['O(V^2)', 'O(V + E)', 'O(V * E)', 'O(log(V + E))'], 1, 'CLO2'),
  q('IT301_Q093', 'Thuật toán BFS trên đồ thị không có trọng số tìm được đường đi có đặc tính gì giữa 2 đỉnh?', 'MEDIUM', ['Đường đi dài nhất', 'Đường đi ngắn nhất tính theo số lượng cạnh', 'Đường đi có tổng trọng số lớn nhất', 'Đường đi ngẫu nhiên'], 1, 'CLO2'),
  q('IT301_Q094', 'Tại sao thuật toán Dijkstra không áp dụng được cho đồ thị có cạnh mang trọng số âm?', 'MEDIUM', ['Vì thuật toán bị chia cho 0', 'Vì thuật toán hoạt động theo nguyên lý tham lam (Greedy), giả định rằng khi một đỉnh được chốt nhãn thì khoảng cách tới nó là tối ưu; sự xuất hiện của cạnh âm có thể làm giảm tiếp khoảng cách dẫn đến kết quả sai hoặc chu trình âm', 'Vì cấu trúc Heap không lưu được số âm', 'Do giới hạn của RAM'], 1, 'CLO2'),
  q('IT301_Q095', 'Thuật toán nào sau đây tìm được đường đi ngắn nhất từ một nguồn trên đồ thị CÓ cạnh mang trọng số âm (không có chu trình âm)?', 'MEDIUM', ['Thuật toán Dijkstra', 'Thuật toán Bellman - Ford', 'Thuật toán Prim', 'Thuật toán Kruskal'], 1, 'CLO2'),
  q('IT301_Q096', 'Thuật toán Bellman-Ford có độ phức tạp thời gian là bao nhiêu trên đồ thị có V đỉnh và E cạnh?', 'MEDIUM', ['O(V + E)', 'O(V * E)', 'O(V^3)', 'O(E log V)'], 1, 'CLO2'),
  q('IT301_Q097', 'Nguyên lý hoạt động cơ bản của thuật toán Kruskal tìm cây khung nhỏ nhất là gì?', 'MEDIUM', ['Bắt đầu từ 1 đỉnh và phát triển dần cây', 'Sắp xếp tất cả các cạnh theo thứ tự trọng số tăng dần, sau đó lần lượt chọn từng cạnh nhỏ nhất nếu cạnh đó không tạo thành chu trình với các cạnh đã chọn trước đó', 'Duyệt đồ thị bằng BFS', 'Dùng bảng băm'], 1, 'CLO2'),
  q('IT301_Q098', 'Cấu trúc dữ liệu nào được sử dụng trong thuật toán Kruskal để kiểm tra và hợp nhất hai đỉnh có tạo thành chu trình hay không trong thời gian gần như O(1)?', 'MEDIUM', ['Stack', 'Disjoint Set Union (DSU / Union-Find)', 'Priority Queue', 'AVL Tree'], 1, 'CLO2'),
  q('IT301_Q099', 'Nguyên lý hoạt động của thuật toán Prim tìm cây khung nhỏ nhất là gì?', 'MEDIUM', ['Sắp xếp tất cả các cạnh', 'Bắt đầu từ một đỉnh tùy ý, liên tục chọn cạnh có trọng số nhỏ nhất nối một đỉnh đã thuộc cây với một đỉnh chưa thuộc cây để kết nạp vào cây', 'Duyệt theo chiều sâu DFS', 'Dùng thuật toán QuickSort'], 1, 'CLO2'),
  q('IT301_Q100', 'Sắp xếp Tô pô (Topological Sort) chỉ có thể áp dụng trên loại đồ thị nào?', 'MEDIUM', ['Đồ thị vô hướng liên thông', 'Đồ thị có hướng không có chu trình (DAG - Directed Acyclic Graph)', 'Đồ thị đầy đủ', 'Đồ thị có chu trình âm'], 1, 'CLO2'),
  q('IT301_Q101', 'Thuật toán Floyd-Warshall dùng để làm gì trên đồ thị?', 'MEDIUM', ['Tìm cây khung nhỏ nhất', 'Tìm đường đi ngắn nhất giữa tất cả các cặp đỉnh (All-Pairs Shortest Path) với độ phức tạp O(V^3)', 'Tìm chu trình Euler', 'Sắp xếp danh sách kề'], 1, 'CLO2'),
  q('IT301_Q102', 'Trong thuật toán QuickSort, thao tác Phân hoạch (Partitioning) có nhiệm vụ chính là:', 'MEDIUM', ['Chia đôi mảng bằng nhau', 'Chọn một phần tử chốt (Pivot), sắp xếp sao cho các phần tử nhỏ hơn pivot nằm bên trái và các phần tử lớn hơn pivot nằm bên phải, trả về vị trí chính xác của pivot', 'Sắp xếp toàn bộ mảng', 'Xóa các phần tử trùng lặp'], 1, 'CLO2'),
  q('IT301_Q103', 'Thuật toán Sắp xếp theo cơ số (Radix Sort) và Sắp xếp đếm (Counting Sort) có ưu điểm nổi bật gì so với các thuật toán sắp xếp so sánh?', 'MEDIUM', ['Không tốn bộ nhớ', 'Có thể đạt độ phức tạp thời gian tuyến tính O(n) vì không dựa trên các phép so sánh trực tiếp giữa các cặp phần tử', 'Luôn chạy đa luồng', 'Áp dụng được cho mọi kiểu dữ liệu phức tạp'], 1, 'CLO2'),
  q('IT301_Q104', 'Định lý giới hạn dưới (Lower Bound) của các thuật toán sắp xếp dựa trên so sánh (Comparison Sort) khẳng định độ phức tạp tối thiểu là:', 'MEDIUM', ['Ω(n)', 'Ω(n log n)', 'Ω(n^2)', 'Ω(log n)'], 1, 'CLO2'),
  q('IT301_Q105', 'Thuật toán MergeSort cần thêm bao nhiêu bộ nhớ phụ (Auxiliary Space) để thực hiện thao tác trộn (Merge) hai mảng con?', 'MEDIUM', ['O(1)', 'O(n) để tạo mảng tạm chứa các phần tử được trộn', 'O(log n)', 'O(n^2)'], 1, 'CLO2'),

  // Vận dụng (10 câu)
  q('IT301_Q106', 'Để phát hiện chu trình trên đồ thị có hướng bằng DFS, ta sử dụng kỹ thuật tô 3 màu (White, Gray, Black). Chu trình tồn tại khi gặp cạnh nối tới đỉnh có màu gì?', 'HARD', ['Màu Trắng (chưa thăm)', 'Màu Xám (đang được duyệt trong ngăn xếp đệ quy hiện tại - Cạnh ngược Back Edge)', 'Màu Đen (đã hoàn thành duyệt)', 'Không phụ thuộc màu'], 1, 'CLO3'),
  q('IT301_Q107', 'Thuật toán Kahn để tìm thứ tự sắp xếp Tô pô hoạt động dựa trên thông số nào của các đỉnh?', 'HARD', ['Bậc ra (Out-degree)', 'Bậc vào (In-degree): liên tục lấy các đỉnh có bán bậc vào bằng 0 cho vào hàng đợi và giảm bán bậc vào của các đỉnh kề', 'Trọng số cạnh', 'Màu của đỉnh'], 1, 'CLO3'),
  q('IT301_Q108', 'Cài đặt thuật toán Dijkstra sử dụng Hàng đợi ưu tiên (Min-Heap / `std::priority_queue`) có độ phức tạp thời gian là:', 'HARD', ['O(V^2)', 'O((V + E) log V)', 'O(V * E)', 'O(V^3)'], 1, 'CLO3'),
  q('IT301_Q109', 'Trong cấu trúc DSU (Disjoint Set Union), hai kỹ thuật tối ưu kinh điển nào giúp đưa độ phức tạp của mỗi thao tác `find` và `union` về gần như O(1) (hàm Ackermann nghịch đảo α(n))?', 'HARD', ['Sắp xếp mảng và tìm kiếm nhị phân', 'Nén đường đi (Path Compression) và Hợp nhất theo hạng/kích thước (Union by Rank / Size)', 'Dùng bảng băm và đệ quy', 'Dùng cây AVL'], 1, 'CLO3'),
  q('IT301_Q110', 'Thuật toán Kosaraju để tìm các thành phần liên thông mạnh (Strongly Connected Components - SCC) trong đồ thị có hướng thực hiện qua mấy lượt duyệt DFS?', 'HARD', ['1 lượt', '2 lượt DFS (Lượt 1 xác định thứ tự hoàn thành trên đồ thị gốc, Lượt 2 duyệt trên đồ thị chuyển vị - Transpose Graph)', '3 lượt', 'V lượt'], 1, 'CLO3'),
  q('IT301_Q111', 'Thuật toán Tarjan tìm thành phần liên thông mạnh (SCC) có ưu điểm gì so với thuật toán Kosaraju?', 'HARD', ['Chạy nhanh gấp 10 lần', 'Chỉ cần một lượt duyệt DFS duy nhất kết hợp với Stack và hai chỉ số `discovery_time` và `low_link`', 'Không tốn bộ nhớ', 'Áp dụng cho đồ thị vô hướng'], 1, 'CLO3'),
  q('IT301_Q112', 'Trong thuật toán QuickSort, kỹ thuật chọn Median-of-Three (Trung vị của 3 phần tử: đầu, giữa, cuối) làm Pivot nhằm mục đích gì?', 'HARD', ['Để tăng tốc độ CPU', 'Hạn chế tối đa nguy cơ chọn phải phần tử nhỏ nhất hoặc lớn nhất làm chốt, ngăn chặn hiện tượng suy biến thuật toán thành O(n^2)', 'Để thuật toán thành ổn định', 'Để tiết kiệm bộ nhớ'], 1, 'CLO3'),
  q('IT301_Q113', 'Thuật toán TimSort (được dùng mặc định trong Python `sort()` và Java `Arrays.sort()`) là sự kết hợp thông minh giữa 2 thuật toán nào?', 'HARD', ['QuickSort và HeapSort', 'MergeSort và InsertionSort (chia mảng thành các run tự nhiên và sắp xếp các đoạn nhỏ bằng InsertionSort trước khi trộn)', 'BubbleSort và SelectionSort', 'RadixSort và CountingSort'], 1, 'CLO3'),
  q('IT301_Q114', 'Khái niệm "Cầu" (Bridge) trong đồ thị vô hướng liên thông là gì?', 'HARD', ['Cạnh có trọng số lớn nhất', 'Một cạnh mà nếu xóa nó đi thì số thành phần liên thông của đồ thị sẽ tăng lên', 'Cạnh nối giữa hai nút lá', 'Cạnh tạo thành chu trình'], 1, 'CLO3'),
  q('IT301_Q115', 'Khái niệm "Khớp" (Articulation Point / Cut Vertex) trong đồ thị vô hướng là gì?', 'HARD', ['Đỉnh có bậc lớn nhất', 'Một đỉnh mà nếu xóa nó (cùng các cạnh nối với nó) thì đồ thị sẽ bị phân rã thành nhiều thành phần liên thông hơn', 'Đỉnh gốc của cây', 'Đỉnh cô lập'], 1, 'CLO3'),

  // Vận dụng cao (5 câu)
  q('IT301_Q116', 'Thuật toán A* (A-Star) tìm đường đi ngắn nhất cải tiến thuật toán Dijkstra bằng cách bổ sung thành phần nào vào hàm đánh giá?', 'EXPERT', ['Trọng số ngẫu nhiên', 'Hàm Heuristic h(n) ước lượng chi phí từ nút hiện tại tới đích (f(n) = g(n) + h(n)), giúp định hướng không gian tìm kiếm tập trung về phía đích', 'Tăng tốc độ xung nhịp', 'Bỏ qua các nút đã thăm'], 1, 'CLO4'),
  q('IT301_Q117', 'Điều kiện để hàm Heuristic `h(n)` trong thuật toán A* đảm bảo luôn tìm được đường đi tối ưu tuyệt đối (Admissible Heuristic) là:', 'EXPERT', ['h(n) phải lớn hơn chi phí thực tế', 'h(n) không bao giờ được ước lượng vượt quá chi phí thực tế nhỏ nhất từ n đến đích (h(n) <= h*(n))', 'h(n) phải bằng 0 ở mọi nút', 'h(n) là số nguyên âm'], 1, 'CLO4'),
  q('IT301_Q118', 'Thuật toán Edmonds-Karp giải bài toán Luồng cực đại trên mạng (Max Flow) là biến thể của thuật toán Ford-Fulkerson sử dụng phương pháp nào để tìm đường tăng luồng?', 'EXPERT', ['Tìm theo DFS', 'Tìm đường tăng luồng ngắn nhất theo số lượng cạnh bằng thuật toán BFS', 'Dùng thuật toán Kruskal', 'Dùng quy hoạch động'], 1, 'CLO4'),
  q('IT301_Q119', 'Định lý Luồng cực đại - Lát cắt hẹp nhất (Max-Flow Min-Cut Theorem) khẳng định giá trị luồng cực đại trong một mạng bằng giá trị nào?', 'EXPERT', ['Tổng dung lượng của tất cả các cạnh', 'Dung lượng của lát cắt hẹp nhất (Minimum Cut) ngăn cách giữa đỉnh phát (Source) và đỉnh thu (Sink)', 'Số lượng đỉnh của đồ thị', 'Trọng số cạnh nhỏ nhất'], 1, 'CLO4'),
  q('IT301_Q120', 'Thuật toán Dinic giải bài toán Luồng cực đại có độ phức tạp thời gian O(V^2 * E) nhờ việc kết hợp hai khái niệm kỹ thuật nào?', 'EXPERT', ['Cây khung và Ngăn xếp', 'Đồ thị phân tầng (Level Graph) xây dựng bằng BFS và Luồng chặn (Blocking Flow) tìm bằng DFS', 'DSU và Bảng băm', 'Cây đỏ đen và Heap'], 1, 'CLO4')
];

module.exports = {
  course: {
    code: 'IT301',
    name: 'Cấu Trúc Dữ Liệu & Giải Thuật',
    faculty: 'Khoa Công Nghệ Thông Tin',
    category_code: 'CAT-IT301',
    credits: 3
  },
  root_1: root1,
  root_2: root2,
  root_3: root3,
  getAllQuestions: () => [...root1, ...root2, ...root3]
};

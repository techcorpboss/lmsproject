// backend/services/examBank/it101.bank.js
// Ngân hàng câu hỏi chuẩn hóa: IT101 — Nhập Môn Lập Trình C/C++
// Tổng cộng: 120 câu hỏi (3 Đề gốc x 40 câu hỏi)
'use strict';

function q(id, content, difficulty, answers, correctIdx, clo = 'CLO1') {
  return {
    id,
    course_code: 'IT101',
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

// ĐỀ GỐC 1 (40 câu): Cú pháp C/C++, Kiểu dữ liệu, Biến, Cấu trúc rẽ nhánh, Vòng lặp, Mảng 1 chiều, Hàm
const root1 = [
  // Nhận biết (10 câu)
  q('IT101_Q001', 'Kiểu dữ liệu nào trong ngôn ngữ C chuẩn chiếm kích thước 1 byte trong bộ nhớ RAM?', 'EASY', ['int', 'float', 'char', 'double'], 2, 'CLO1'),
  q('IT101_Q002', 'Toán tử nào được dùng để lấy địa chỉ của một biến trong C/C++?', 'EASY', ['Toán tử con trỏ *', 'Toán tử địa chỉ &', 'Toán tử truy xuất ->', 'Toán tử chia dư %'], 1, 'CLO1'),
  q('IT101_Q003', 'Trong C/C++, cấu trúc rẽ nhánh nào tối ưu nhất khi so sánh một biến số nguyên với nhiều giá trị hằng số?', 'EASY', ['if - else lồng nhau', 'switch - case', 'while', 'for'], 1, 'CLO1'),
  q('IT101_Q004', 'Kết quả của biểu thức số học (17 % 5) trong ngôn ngữ C là bao nhiêu?', 'EASY', ['2', '3.4', '3', '0'], 0, 'CLO1'),
  q('IT101_Q005', 'Cấu trúc vòng lặp nào đảm bảo khối lệnh thân vòng lặp luôn được thực hiện ít nhất 1 lần?', 'EASY', ['Vòng lặp for', 'Vòng lặp while', 'Vòng lặp do - while', 'Vòng lặp vô tận'], 2, 'CLO1'),
  q('IT101_Q006', 'Từ khóa nào trong chuẩn C dùng để khai báo một biến có giá trị không đổi trong suốt thời gian thực thi?', 'EASY', ['static', 'const', 'volatile', 'register'], 1, 'CLO1'),
  q('IT101_Q007', 'Mảng số nguyên khai báo `int a[10];` có dải chỉ số hợp lệ là:', 'EASY', ['Từ 1 đến 10', 'Từ 0 đến 9', 'Từ 0 đến 10', 'Từ 1 đến 9'], 1, 'CLO1'),
  q('IT101_Q008', 'Cặp hàm nhập/xuất cơ bản `printf` và `scanf` nằm trong thư viện chuẩn nào?', 'EASY', ['<stdlib.h>', '<math.h>', '<stdio.h>', '<string.h>'], 2, 'CLO1'),
  q('IT101_Q009', 'Ký tự nào được dùng để đánh dấu điểm kết thúc của một chuỗi ký tự (C-string)?', 'EASY', ['Ký tự xuống dòng \\n', 'Ký tự null \\0', 'Ký tự tab \\t', 'Ký hiệu kết thúc tệp EOF'], 1, 'CLO1'),
  q('IT101_Q010', 'Lệnh nào được dùng để trả về giá trị cho hàm gọi và lập tức thoát khỏi hàm?', 'EASY', ['break;', 'exit();', 'return;', 'continue;'], 2, 'CLO1'),

  // Thông hiểu (15 câu)
  q('IT101_Q011', 'Cho đoạn mã `int x = 5; int y = ++x;`. Giá trị của x và y sau lệnh này là:', 'MEDIUM', ['x = 5, y = 6', 'x = 6, y = 6', 'x = 6, y = 5', 'x = 5, y = 5'], 1, 'CLO2'),
  q('IT101_Q012', 'Cho đoạn mã `int x = 5; int y = x++;`. Giá trị của x và y sau lệnh này là:', 'MEDIUM', ['x = 6, y = 5', 'x = 6, y = 6', 'x = 5, y = 6', 'x = 5, y = 5'], 0, 'CLO2'),
  q('IT101_Q013', 'Hàm `strlen("TechCorp\\0LMS")` trả về độ dài bằng bao nhiêu?', 'MEDIUM', ['8', '12', '13', '4'], 0, 'CLO2'),
  q('IT101_Q014', 'Khi truyền đối số vào hàm theo cơ chế truyền tham trị (pass-by-value), điều gì xảy ra với biến gốc bên ngoài?', 'MEDIUM', ['Biến gốc bị thay đổi theo hàm', 'Biến gốc hoàn toàn không bị ảnh hưởng', 'Biến gốc bị giải phóng bộ nhớ', 'Bị lỗi biên dịch'], 1, 'CLO2'),
  q('IT101_Q015', 'Để so sánh bằng nhau giữa hai chuỗi C-style `str1` và `str2`, hàm `strcmp(str1, str2)` trả về giá trị nào?', 'MEDIUM', ['1', '0', '-1', 'true'], 1, 'CLO2'),
  q('IT101_Q016', 'Biểu thức logic `(7 > 4 && 3 < 2 || !0)` có giá trị chân lý là gì?', 'MEDIUM', ['0 (false)', '1 (true)', '-1', 'Không xác định'], 1, 'CLO2'),
  q('IT101_Q017', 'Cho mảng `int arr[] = {10, 20, 30, 40, 50};`. Biểu thức `*(arr + 3)` trả về giá trị nào?', 'MEDIUM', ['20', '30', '40', '50'], 2, 'CLO2'),
  q('IT101_Q018', 'Cú pháp nào trong C++ dùng để khai báo tham số hình thức theo cơ chế tham chiếu (reference)?', 'MEDIUM', ['void update(int *val)', 'void update(int &val)', 'void update(ref int val)', 'void update(int val)'], 1, 'CLO2'),
  q('IT101_Q019', 'Lệnh `break;` đặt trong vòng lặp `for` có tác dụng gì?', 'MEDIUM', ['Bỏ qua lần lặp hiện tại và chuyển sang lần kế tiếp', 'Thoát ra khỏi vòng lặp for ngay lập tức', 'Dừng toàn bộ chương trình', 'Khởi tạo lại biến lặp'], 1, 'CLO2'),
  q('IT101_Q020', 'Lệnh `continue;` trong vòng lặp có tác dụng gì?', 'MEDIUM', ['Thoát hẳn khỏi vòng lặp', 'Bỏ qua phần còn lại của thân vòng lặp hiện tại và bắt đầu bước lặp kế tiếp', 'In thông báo ra màn hình', 'Treo vòng lặp'], 1, 'CLO2'),
  q('IT101_Q021', 'Cho `int a = 9, b = 2; float c = a / b;`. Giá trị của biến `c` sau phép gán là:', 'MEDIUM', ['4.5', '4.0', '4', '5.0'], 1, 'CLO2'),
  q('IT101_Q022', 'Để biểu thức `a / b` với `int a = 9, b = 2;` cho ra kết quả số thực `4.5`, cú pháp ép kiểu đúng là:', 'MEDIUM', ['(float)(a / b)', '(float)a / b', 'float(a / b)', 'a / (int)b'], 1, 'CLO2'),
  q('IT101_Q023', 'Một biến cục bộ được khai báo với từ khóa `static` bên trong một hàm có đặc tính nào?', 'MEDIUM', ['Biến bị hủy khi hàm kết thúc', 'Giá trị của biến được bảo lưu giữa các lần gọi hàm liên tiếp trong suốt quá trình chạy chương trình', 'Biến truy cập được từ mọi file', 'Biến là hằng số'], 1, 'CLO2'),
  q('IT101_Q024', 'Kích thước `sizeof(double)` trên hầu hết các hệ thống biên dịch C/C++ hiện nay là bao nhiêu?', 'MEDIUM', ['4 byte', '8 byte', '16 byte', '2 byte'], 1, 'CLO2'),
  q('IT101_Q025', 'Vòng lặp `for (int i = 0; i < 5; i += 2)` sẽ lặp lại bao nhiêu lần?', 'MEDIUM', ['2 lần', '3 lần (i = 0, 2, 4)', '5 lần', '4 lần'], 1, 'CLO2'),

  // Vận dụng (10 câu)
  q('IT101_Q026', 'Cho mảng `int a[5] = {2, 4, 6, 8, 10}; int *p = a + 4;`. Giá trị của phép trừ `p - a` là:', 'HARD', ['4', '16 byte', '10', 'Địa chỉ bộ nhớ'], 0, 'CLO3'),
  q('IT101_Q027', 'Hàm đệ quy gọi liên tục mà không đạt được điều kiện dừng sẽ gây ra lỗi nghiêm trọng nào?', 'HARD', ['Heap Corruption', 'Stack Overflow (Tràn ngăn xếp gọi hàm)', 'Lỗi phân trang đĩa', 'Lỗi rò rỉ RAM'], 1, 'CLO3'),
  q('IT101_Q028', 'Hàm tính lũy thừa `long power(int base, int exp)` đệ quy có công thức `exp == 0 ? 1 : base * power(base, exp - 1)`. Độ phức tạp thời gian là:', 'HARD', ['O(1)', 'O(log exp)', 'O(exp)', 'O(exp^2)'], 2, 'CLO3'),
  q('IT101_Q029', 'Khi khai báo `char s[15] = "LMS Platform";`, giá trị của `sizeof(s)` và `strlen(s)` lần lượt là:', 'HARD', ['15 và 12', '12 và 15', '13 và 12', '15 và 13'], 0, 'CLO3'),
  q('IT101_Q030', 'Đoạn mã `int v = 5; { int v = 15; printf("%d ", v); } printf("%d", v);` in ra kết quả gì?', 'HARD', ['15 15', '15 5', '5 15', '5 5'], 1, 'CLO3'),
  q('IT101_Q031', 'Toán tử dịch bit trái `8 << 3` cho kết quả bằng bao nhiêu trong hệ thập phân?', 'HARD', ['24', '64', '32', '16'], 1, 'CLO3'),
  q('IT101_Q032', 'Kết quả của phép toán bitwise AND `(14 & 7)` trong C là bao nhiêu?', 'HARD', ['6', '7', '15', '0'], 0, 'CLO3'),
  q('IT101_Q033', 'Để tính tổng các phần tử trên đường chéo chính của ma trận vuông cấp N, điều kiện kiểm tra chỉ số hàng `i` và cột `j` là:', 'HARD', ['i + j == N - 1', 'i == j', 'i > j', 'i < j'], 1, 'CLO3'),
  q('IT101_Q034', 'Đặc điểm tối ưu nổi trội của thuật toán đệ quy đuôi (Tail Recursion) khi được biên dịch với cờ tối ưu hóa (-O2) là:', 'HARD', ['Không cần tham số', 'Trình biên dịch tự động chuyển đổi thành vòng lặp, tối ưu không gian bộ nhớ ngăn xếp về O(1)', 'Chạy nhanh gấp 10 lần', 'Tự động chạy đa luồng'], 1, 'CLO3'),
  q('IT101_Q035', 'Nguyên mẫu hàm hoán đổi 2 số nguyên `void swap(int *a, int *b);`. Cách gọi nào đúng với 2 biến `int m = 1, n = 2;`?', 'HARD', ['swap(m, n);', 'swap(&m, &n);', 'swap(*m, *n);', 'swap(&m, n);'], 1, 'CLO3'),

  // Vận dụng cao (5 câu)
  q('IT101_Q036', 'Khái niệm Undefined Behavior (Hành vi không xác định) trong tiêu chuẩn ISO/IEC C có ý nghĩa là:', 'EXPERT', ['Trình biên dịch không chịu bất kỳ ràng buộc nào, có thể sinh ra mã bất kỳ dẫn đến lỗi sập chương trình hoặc sai lệch dữ liệu ngầm', 'Lỗi cú pháp bắt buộc dừng biên dịch', 'Chương trình luôn trả về 0', 'Bộ nhớ tự động giải phóng'], 0, 'CLO4'),
  q('IT101_Q037', 'Biểu thức `int res = (i++) + (++i);` trong C được coi là gì theo tiêu chuẩn?', 'EXPERT', ['Biểu thức hợp lệ có giá trị xác định', 'Hành vi không xác định (Undefined Behavior) do sửa đổi cùng một biến nhiều lần giữa hai Sequence Points', 'Luôn bằng 2*i + 1', 'Lỗi cú pháp không thể biên dịch'], 1, 'CLO4'),
  q('IT101_Q038', 'Vùng nhớ Call Stack trong kiến trúc tiến trình máy tính chịu trách nhiệm chính về việc gì?', 'EXPERT', ['Chứa mã máy thực thi (Text segment)', 'Lưu trữ các biến toàn cục', 'Lưu trữ stack frame của các hàm, bao gồm biến cục bộ, tham số và địa chỉ trở về khi gọi hàm', 'Chứa dữ liệu cấp phát động bằng malloc'], 2, 'CLO4'),
  q('IT101_Q039', 'Cho hàm `int* getLocalArray() { int arr[3] = {1, 2, 3}; return arr; }`. Việc gọi hàm này tiềm ẩn rủi ro gì?', 'EXPERT', ['Rò rỉ bộ nhớ Heap', 'Truy cập vùng nhớ không hợp lệ qua con trỏ treo (Dangling Pointer) vì mảng cục bộ bị giải phóng khi hàm kết thúc', 'Gây deadlock CPU', 'Lỗi chia cho 0'], 1, 'CLO4'),
  q('IT101_Q040', 'Để khai báo một con trỏ hàm trỏ tới hàm nhận 2 số nguyên và trả về số thực: `float compute(int a, int b)`, cú pháp đúng là:', 'EXPERT', ['float *fPtr(int, int);', 'float (*fPtr)(int, int);', 'float ptr*(int, int);', 'function<float(int, int)> fPtr;'], 1, 'CLO4')
];

// ĐỀ GỐC 2 (40 câu): Con trỏ, Cấp phát động, Mảng 2 chiều, Kiểu struct, Quản lý bộ nhớ
const root2 = [
  // Nhận biết (10 câu)
  q('IT101_Q041', 'Cú pháp khai báo biến con trỏ số nguyên `p` trong C là:', 'EASY', ['int p;', 'int *p;', 'pointer int p;', 'int &p;'], 1, 'CLO1'),
  q('IT101_Q042', 'Hàm nào trong thư viện `<stdlib.h>` dùng để cấp phát bộ nhớ động mà không khởi tạo giá trị ban đầu?', 'EASY', ['malloc()', 'calloc()', 'realloc()', 'free()'], 0, 'CLO1'),
  q('IT101_Q043', 'Hàm nào dùng để giải phóng vùng nhớ đã cấp phát động trong ngôn ngữ C?', 'EASY', ['delete()', 'destroy()', 'free()', 'clean()'], 2, 'CLO1'),
  q('IT101_Q044', 'Toán tử nào trong C++ dùng để cấp phát động cho một mảng các đối tượng?', 'EASY', ['malloc', 'new', 'new[]', 'alloc'], 2, 'CLO1'),
  q('IT101_Q045', 'Toán tử nào trong C++ dùng để giải phóng bộ nhớ của một mảng cấp phát động?', 'EASY', ['free', 'delete', 'delete[]', 'drop'], 2, 'CLO1'),
  q('IT101_Q046', 'Từ khóa nào trong ngôn ngữ C dùng để định nghĩa kiểu dữ liệu có cấu trúc gom nhóm nhiều trường?', 'EASY', ['class', 'union', 'struct', 'record'], 2, 'CLO1'),
  q('IT101_Q047', 'Để truy xuất trường `gpa` từ biến cấu trúc `SinhVien sv;`, toán tử nào được sử dụng?', 'EASY', ['sv->gpa', 'sv.gpa', 'sv::gpa', 'sv[gpa]'], 1, 'CLO1'),
  q('IT101_Q048', 'Để truy xuất trường `gpa` thông qua con trỏ cấu trúc `SinhVien *ptr;`, toán tử nào được sử dụng?', 'EASY', ['ptr.gpa', 'ptr->gpa', 'ptr::gpa', '*ptr.gpa'], 1, 'CLO1'),
  q('IT101_Q049', 'Giá trị hằng con trỏ `NULL` trong C được định nghĩa tương đương với giá trị nào?', 'EASY', ['Địa chỉ RAM đầu tiên', 'Địa chỉ 0 (không trỏ tới vùng nhớ hợp lệ nào)', 'Giá trị -1', 'Chuỗi rỗng'], 1, 'CLO1'),
  q('IT101_Q050', 'Khi hàm `malloc()` không thể tìm đủ vùng nhớ trống trên Heap, hàm sẽ trả về giá trị gì?', 'EASY', ['0', '-1', 'NULL', 'Ném ra Exception'], 2, 'CLO1'),

  // Thông hiểu (15 câu)
  q('IT101_Q051', 'Sự khác biệt cốt lõi giữa `calloc(n, size)` và `malloc(n * size)` là gì?', 'MEDIUM', ['calloc chạy nhanh hơn malloc', 'calloc tự động khởi tạo toàn bộ các byte được cấp phát về giá trị 0, trong khi malloc để nguyên dữ liệu rác', 'calloc dùng cho kiểu struct còn malloc cho kiểu cơ bản', 'calloc không thể giải phóng bằng free'], 1, 'CLO2'),
  q('IT101_Q052', 'Từ khóa `typedef` trong khai báo `typedef struct { int x, y; } Point;` mang lại lợi ích gì?', 'MEDIUM', ['Tạo một biến toàn cục Point', 'Cho phép dùng `Point` trực tiếp như một kiểu dữ liệu mà không cần tiền tố `struct`', 'Ép kiểu con trỏ', 'Giải phóng bộ nhớ'], 1, 'CLO2'),
  q('IT101_Q053', 'Cho đoạn mã `int a = 10; int *p = &a; *p = 50;`. Giá trị của biến `a` sau lệnh trên là:', 'MEDIUM', ['10', '50', 'Địa chỉ của a', 'Lỗi bộ nhớ'], 1, 'CLO2'),
  q('IT101_Q054', 'Trong ma trận 2 chiều `int mat[4][5];`, tổng số phần tử nguyên chứa trong ma trận là bao nhiêu?', 'MEDIUM', ['9', '20', '25', '45'], 1, 'CLO2'),
  q('IT101_Q055', 'Trong mảng 2 chiều lưu trữ theo hàng (Row-Major), vị trí phần tử `mat[i][j]` cách phần tử đầu tiên bao nhiêu ô nhớ?', 'MEDIUM', ['i * COLS + j', 'j * ROWS + i', 'i + j', 'i * j'], 0, 'CLO2'),
  q('IT101_Q056', 'Cho `int arr[5] = {11, 22, 33, 44, 55}; int *p = arr;`. Biểu thức `*(p + 2)` cho kết quả là:', 'MEDIUM', ['11', '22', '33', '44'], 2, 'CLO2'),
  q('IT101_Q057', 'Hậu quả của việc cấp phát bộ nhớ động bằng `malloc` liên tục mà không gọi `free()` là gì?', 'MEDIUM', ['Lỗi cú pháp', 'Hiện tượng Rò rỉ bộ nhớ (Memory Leak), làm cạn kiệt tài nguyên RAM của hệ thống', 'Làm hỏng ổ cứng SSD', 'Tràn ngăn xếp Call Stack'], 1, 'CLO2'),
  q('IT101_Q058', 'Kiểu dữ liệu `union` trong C khác `struct` ở đặc tính cốt lõi nào?', 'MEDIUM', ['union chứa được hàm', 'Tất cả các thành viên trong union dùng chung một vùng nhớ, kích thước union bằng kích thước thành viên lớn nhất', 'struct không cho phép lồng nhau', 'union chỉ chứa kiểu ký tự'], 1, 'CLO2'),
  q('IT101_Q059', 'Hàm `realloc(ptr, new_size)` có chức năng chính là gì?', 'MEDIUM', ['Xóa con trỏ', 'Thay đổi kích thước của khối nhớ đã được cấp phát động trước đó', 'Sao chép vùng nhớ sang tệp tin', 'Khởi tạo mảng số nguyên'], 1, 'CLO2'),
  q('IT101_Q060', 'Con trỏ void `void *ptr;` trong C có đặc điểm gì nổi bật?', 'MEDIUM', ['Không thể trỏ tới bất kỳ biến nào', 'Là con trỏ tổng quát (generic pointer), có thể trỏ tới bất kỳ kiểu dữ liệu nào nhưng phải ép kiểu khi giải tham chiếu (*)', 'Chỉ trỏ được tới hàm', 'Kích thước bằng 0 byte'], 1, 'CLO2'),
  q('IT101_Q061', 'Cho `char msg[] = "TCU University"; char *p = msg;`. Lệnh `printf("%c", *(p + 4));` in ra ký tự nào?', 'MEDIUM', ['T', 'U', ' ', 'n'], 1, 'CLO2'),
  q('IT101_Q062', 'Khi truyền mảng `int arr[]` vào hàm `void process(int arr[], int n)`, bản chất tham số `arr` trong hàm là:', 'MEDIUM', ['Một bản sao đầy đủ các phần tử của mảng', 'Một biến con trỏ `int *arr` trỏ tới phần tử đầu tiên của mảng gốc', 'Một hằng số', 'Một mảng mới'], 1, 'CLO2'),
  q('IT101_Q063', 'Con trỏ cấp 2 `int **pp;` (con trỏ trỏ tới con trỏ) thường được dùng trong tình huống nào?', 'MEDIUM', ['Khi muốn thay đổi địa chỉ của con trỏ cấp 1 từ bên trong hàm hoặc quản lý mảng 2 chiều động', 'Chỉ dùng cho đồ họa', 'Khi mảng lớn hơn 1000 phần tử', 'Chỉ dùng trong lập trình mạng'], 0, 'CLO2'),
  q('IT101_Q064', 'Trong C++, việc gọi `delete ptr;` trên con trỏ có giá trị `nullptr` (hoặc `NULL`) sẽ dẫn đến kết quả gì?', 'MEDIUM', ['Bị sập chương trình Segmentation Fault', 'Hoàn toàn an toàn, không có hành động nào xảy ra', 'Bị rò rỉ bộ nhớ', 'Báo lỗi lúc biên dịch'], 1, 'CLO2'),
  q('IT101_Q065', 'Kích thước của một biến con trỏ trên hệ điều hành 64-bit là:', 'MEDIUM', ['4 byte', '8 byte', '16 byte', '2 byte'], 1, 'CLO2'),

  // Vận dụng (10 câu)
  q('IT101_Q066', 'Cho `int x = 20; const int *ptr = &x;`. Lệnh nào sau đây sẽ gây lỗi biên dịch?', 'HARD', ['ptr = NULL;', 'int y = 30; ptr = &y;', '*ptr = 50;', 'printf("%d", *ptr);'], 2, 'CLO3'),
  q('IT101_Q067', 'Cho `int x = 20; int * const ptr = &x;`. Lệnh nào sau đây sẽ gây lỗi biên dịch?', 'HARD', ['*ptr = 50;', 'int y = 30; ptr = &y;', 'printf("%d", *ptr);', 'x = 100;'], 1, 'CLO3'),
  q('IT101_Q068', 'Hiện tượng Dangling Pointer (Con trỏ treo) xảy ra khi nào?', 'HARD', ['Con trỏ trỏ tới NULL', 'Con trỏ vẫn giữ địa chỉ của một vùng nhớ đã bị giải phóng bằng free() hoặc delete', 'Con trỏ chưa được khai báo kiểu dữ liệu', 'Hai con trỏ trỏ cùng một biến'], 1, 'CLO3'),
  q('IT101_Q069', 'Cú pháp cấp phát động bộ nhớ cho một nút danh sách liên kết `struct Node { int val; struct Node *next; };` là:', 'HARD', ['struct Node *n = malloc(sizeof(int));', 'struct Node *n = (struct Node*)malloc(sizeof(struct Node));', 'struct Node *n = new int;', 'struct Node *n = alloc(Node);'], 1, 'CLO3'),
  q('IT101_Q070', 'Nguyên nhân chính khiến hàm `gets()` bị loại bỏ hoàn toàn khỏi chuẩn C11 là gì?', 'HARD', ['Không hỗ trợ tiếng Việt', 'Không kiểm tra độ dài chuỗi nhập so với kích thước bộ đệm, gây lỗ hổng Tràn bộ đệm (Buffer Overflow)', 'Chạy quá chậm', 'Chỉ đọc được số'], 1, 'CLO3'),
  q('IT101_Q071', 'Để đọc một dòng văn bản an toàn từ bàn phím thay thế cho `gets()`, hàm chuẩn nào được khuyến nghị?', 'HARD', ['scanf("%s", s)', 'fgets(s, sizeof(s), stdin)', 'getchar()', 'getch()'], 1, 'CLO3'),
  q('IT101_Q072', 'Cho mảng chuỗi `char *langs[] = {"C", "C++", "Java", "Python"};`. Biểu thức `*(langs[1] + 1)` cho ký tự nào?', 'HARD', ['C', '+', 'J', 'P'], 1, 'CLO3'),
  q('IT101_Q073', 'Cấp phát động ma trận 2 chiều kích thước R x C bằng con trỏ kép `int **matrix` cần thực hiện bao nhiêu lần gọi `malloc`?', 'HARD', ['1 lần', '1 lần cho mảng con trỏ hàng `int*` và R lần cho từng hàng dữ liệu', 'C lần', 'R * C lần'], 1, 'CLO3'),
  q('IT101_Q074', 'Thứ tự giải phóng bộ nhớ đúng cho ma trận cấp phát động `int **matrix` kích thước R x C là:', 'HARD', ['free(matrix) trước, sau đó free từng hàng', 'free từng hàng matrix[i] trước (i = 0..R-1), sau đó mới free(matrix)', 'Chỉ cần free(matrix)', 'free ô matrix[0][0]'], 1, 'CLO3'),
  q('IT101_Q075', 'Hiện tượng phân mảnh bộ nhớ ngoài (External Fragmentation) trong Heap xảy ra do:', 'HARD', ['RAM bị lỗi phần cứng', 'Việc cấp phát và giải phóng liên tục các khối nhớ kích thước không đồng đều để lại các khoảng trống nhỏ phân tán không đủ cho yêu cầu cấp phát mới', 'Dùng quá nhiều con trỏ void', 'Tốc độ CPU quá nhanh'], 1, 'CLO3'),

  // Vận dụng cao (5 câu)
  q('IT101_Q076', 'Khái niệm Căn chỉnh bộ nhớ (Data Structure Alignment & Padding) có tác dụng gì?', 'EXPERT', ['Giúp giảm kích thước file nhị phân', 'Tối ưu hóa số chu kỳ đọc của vi xử lý bằng cách căn địa chỉ biến thành bội số của kích thước từ máy (word size)', 'Xóa tự động con trỏ treo', 'Ngăn chặn tràn ngăn xếp'], 1, 'CLO4'),
  q('IT101_Q077', 'Cho cấu trúc `struct Sample { char a; int b; short c; };` trên hệ 32/64-bit với căn chỉnh 4-byte. `sizeof(struct Sample)` là bao nhiêu?', 'EXPERT', ['7 byte', '8 byte', '12 byte', '16 byte'], 2, 'CLO4'),
  q('IT101_Q078', 'Cú pháp định nghĩa con trỏ hàm tổng quát `Comparator` nhận 2 con trỏ `const void*` và trả về `int` là:', 'EXPERT', ['int *Comparator(const void*, const void*);', 'int (*Comparator)(const void*, const void*);', 'void Comparator(int*, int*);', 'int (const void*, const void*) *Comparator;'], 1, 'CLO4'),
  q('IT101_Q079', 'Hàm hoán đổi tổng quát `generic_swap(void *a, void *b, size_t size)` trong C cần thao tác như thế nào?', 'EXPERT', ['Ép kiểu sang int* rồi đổi chỗ', 'Sử dụng con trỏ kiểu `char*` hoặc `unsigned char*` để sao chép từng byte qua vùng nhớ đệm tạm', 'Dùng toán tử template', 'Gọi hàm qsort'], 1, 'CLO4'),
  q('IT101_Q080', 'Lỗi "Unaligned memory access" trên các kiến trúc vi xử lý nhúng nghiêm ngặt (như ARM Cortex-M0) có thể dẫn tới sự cố gì?', 'EXPERT', ['Hardware Fault Exception (HardFault) làm treo vi xử lý ngay lập tức', 'Dữ liệu tự động làm tròn', 'Chương trình chạy chậm đi một nửa', 'Bộ nhớ Flash tự xóa'], 0, 'CLO4')
];

// ĐỀ GỐC 3 (40 câu): Xử lý File I/O, Thuật toán sắp xếp/tìm kiếm, Khử đệ quy, Tối ưu hóa
const root3 = [
  // Nhận biết (10 câu)
  q('IT101_Q081', 'Con trỏ luồng tệp tin trong thư viện chuẩn `<stdio.h>` có kiểu dữ liệu là gì?', 'EASY', ['FILE*', 'FSTREAM*', 'FILE_HANDLE', 'DIR*'], 0, 'CLO1'),
  q('IT101_Q082', 'Chế độ mở tệp nào trong hàm `fopen("output.txt", mode)` sẽ tạo mới hoặc ghi đè từ đầu tệp?', 'EASY', ['"r"', '"w"', '"a"', '"r+"'], 1, 'CLO1'),
  q('IT101_Q083', 'Chế độ mở tệp `"a"` (append) trong `fopen` có tác dụng gì?', 'EASY', ['Chỉ đọc', 'Ghi nối tiếp vào cuối tệp mà không làm mất nội dung cũ', 'Tạo tệp nhị phân', 'Đọc và ghi ngẫu nhiên'], 1, 'CLO1'),
  q('IT101_Q084', 'Hàm nào dùng để đóng luồng tệp và đồng bộ dữ liệu đệm xuống đĩa?', 'EASY', ['close()', 'file_close()', 'fclose()', 'flush()'], 2, 'CLO1'),
  q('IT101_Q085', 'Hàm `feof(fp)` trả về giá trị khác 0 khi nào?', 'EASY', ['Khi tệp vừa mở thành công', 'Khi con trỏ tệp đã chạm mốc kết thúc tệp (End-Of-File)', 'Khi tệp bị khóa', 'Khi tệp có dung lượng 0 byte'], 1, 'CLO1'),
  q('IT101_Q086', 'Độ phức tạp thời gian trong trường hợp xấu nhất của thuật toán Tìm kiếm tuyến tính (Linear Search) là:', 'EASY', ['O(1)', 'O(log n)', 'O(n)', 'O(n^2)'], 2, 'CLO1'),
  q('IT101_Q087', 'Điều kiện tiên quyết bắt buộc để áp dụng thuật toán Tìm kiếm nhị phân (Binary Search) là:', 'EASY', ['Mảng chứa toàn số nguyên dương', 'Mảng phải được sắp xếp theo thứ tự (tăng hoặc giảm)', 'Kích thước mảng là lũy thừa của 2', 'Mảng phải được lưu trong danh sách liên kết'], 1, 'CLO1'),
  q('IT101_Q088', 'Độ phức tạp thời gian của thuật toán Tìm kiếm nhị phân trên mảng n phần tử là:', 'EASY', ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], 1, 'CLO1'),
  q('IT101_Q089', 'Nguyên lý cơ bản của thuật toán Sắp xếp nổi bọt (Bubble Sort) là gì?', 'EASY', ['Chia mảng làm hai nửa', 'Liên tục so sánh và hoán đổi 2 phần tử liền kề nếu chúng sai thứ tự cho đến khi mảng có thứ tự', 'Chọn phần tử nhỏ nhất đưa về đầu', 'Sử dụng bảng băm'], 1, 'CLO1'),
  q('IT101_Q090', 'Hàm `fgetc(fp)` dùng để đọc cái gì từ tệp tin?', 'EASY', ['Một dòng văn bản', 'Một ký tự đơn lẻ', 'Một số thực 4 byte', 'Toàn bộ nội dung tệp'], 1, 'CLO1'),

  // Thông hiểu (15 câu)
  q('IT101_Q091', 'Sự khác biệt giữa `fscanf(fp, ...)` và `scanf(...)` là gì?', 'MEDIUM', ['fscanf đọc dữ liệu từ luồng tệp tin chỉ định `fp`, còn scanf đọc từ thiết bị nhập chuẩn `stdin`', 'fscanf chỉ đọc được số', 'scanf chạy nhanh hơn', 'fscanf tự động đóng tệp'], 0, 'CLO2'),
  q('IT101_Q092', 'Hàm nào dùng để đọc và ghi các khối dữ liệu nhị phân (Binary) có cấu trúc trong C?', 'MEDIUM', ['read() và write()', 'fread() và fwrite()', 'bget() và bput()', 'load() và save()'], 1, 'CLO2'),
  q('IT101_Q093', 'Lệnh `fseek(fp, 0, SEEK_END);` có tác dụng gì?', 'MEDIUM', ['Đưa con trỏ tệp về đầu tệp', 'Di chuyển con trỏ tệp tới vị trí cuối cùng của tệp', 'Xóa nội dung tệp', 'Khóa tệp'], 1, 'CLO2'),
  q('IT101_Q094', 'Để xác định dung lượng (tính theo byte) của một tệp tin, ta kết hợp cặp hàm nào?', 'MEDIUM', ['fopen và fclose', 'fseek(fp, 0, SEEK_END) và ftell(fp)', 'sizeof(fp)', 'feof() và fgetc()'], 1, 'CLO2'),
  q('IT101_Q095', 'Độ phức tạp thời gian trung bình của thuật toán Sắp xếp chọn (Selection Sort) là:', 'MEDIUM', ['O(n)', 'O(n log n)', 'O(n^2)', 'O(log n)'], 2, 'CLO2'),
  q('IT101_Q096', 'Độ phức tạp thời gian trung bình của thuật toán Sắp xếp chèn (Insertion Sort) là:', 'MEDIUM', ['O(n log n)', 'O(n^2)', 'O(n)', 'O(1)'], 1, 'CLO2'),
  q('IT101_Q097', 'Thuật toán sắp xếp nào sau đây có tính chất ổn định (Stable Sort)?', 'MEDIUM', ['Selection Sort', 'Bubble Sort', 'Quick Sort kinh điển', 'Heap Sort'], 1, 'CLO2'),
  q('IT101_Q098', 'Tính chất ổn định (Stability) của một thuật toán sắp xếp có ý nghĩa gì?', 'MEDIUM', ['Thuật toán không bị crash khi tràn RAM', 'Bảo toàn thứ tự ban đầu của các phần tử có giá trị khóa bằng nhau', 'Thời gian chạy luôn là O(n)', 'Không dùng thêm bộ nhớ phụ'], 1, 'CLO2'),
  q('IT101_Q099', 'Cho dãy số `{7, 2, 5, 1, 9}`. Sau bước lặp đầu tiên của Bubble Sort (tăng dần), dãy số là:', 'MEDIUM', ['{2, 7, 5, 1, 9}', '{2, 5, 1, 7, 9}', '{1, 2, 5, 7, 9}', '{2, 1, 5, 7, 9}'], 1, 'CLO2'),
  q('IT101_Q100', 'Hàm đệ quy tính số Fibonacci `F(n) = F(n-1) + F(n-2)` không dùng bộ nhớ đệm có độ phức tạp thời gian là:', 'MEDIUM', ['O(n)', 'O(n^2)', 'O(2^n)', 'O(log n)'], 2, 'CLO2'),
  q('IT101_Q101', 'Kỹ thuật khử đệ quy cho bài toán tính `n!` hiệu quả nhất là gì?', 'MEDIUM', ['Sử dụng vòng lặp `for` với biến tích lũy với độ phức tạp không gian O(1)', 'Dùng mảng 2 chiều', 'Dùng đệ quy lồng', 'Dùng ngắt hệ thống'], 0, 'CLO2'),
  q('IT101_Q102', 'Lệnh `rewind(fp);` tương đương với lời gọi hàm nào sau đây?', 'MEDIUM', ['fseek(fp, 0, SEEK_CUR);', 'fseek(fp, 0, SEEK_SET);', 'fseek(fp, 0, SEEK_END);', 'ftell(fp);'], 1, 'CLO2'),
  q('IT101_Q103', 'Khi làm việc với tệp nhị phân trên Windows, cờ mở tệp cần thêm ký tự gì để tránh biến đổi ký tự xuống dòng?', 'MEDIUM', ['"b" (chẳng hạn: "rb", "wb")', '"t"', '"bin"', '"x"'], 0, 'CLO2'),
  q('IT101_Q104', 'Số bước di chuyển tối thiểu để hoàn thành bài toán Tháp Hà Nội với N đĩa là:', 'MEDIUM', ['2N', 'N^2', '2^N - 1', 'N!'], 2, 'CLO2'),
  q('IT101_Q105', 'Hàm `fprintf(fp, ...)` ghi dữ liệu xuất ra thiết bị nào?', 'MEDIUM', ['Màn hình console', 'Luồng tệp do con trỏ `fp` quản lý', 'Máy in', 'Thanh ghi CPU'], 1, 'CLO2'),

  // Vận dụng (10 câu)
  q('IT101_Q106', 'Thuật toán QuickSort suy biến thành độ phức tạp O(n^2) trong trường hợp nào?', 'HARD', ['Khi mảng ngẫu nhiên', 'Khi mảng đã sắp xếp và thuật toán luôn chọn phần tử đầu hoặc cuối làm Pivot', 'Khi mảng có kích thước chẵn', 'Khi mảng có số âm'], 1, 'CLO3'),
  q('IT101_Q107', 'Độ phức tạp không gian phụ (Auxiliary Space) của thuật toán Sắp xếp trộn (Merge Sort) trên mảng là:', 'HARD', ['O(1)', 'O(log n)', 'O(n)', 'O(n^2)'], 2, 'CLO3'),
  q('IT101_Q108', 'Cơ chế Stream Buffering trong thư viện `<stdio.h>` mang lại ưu thế gì cho hệ thống?', 'HARD', ['Tự nén dữ liệu', 'Gom nhiều thao tác đọc/ghi byte nhỏ thành khối đệm lớn nhằm giảm thiểu số lần gọi ngắt hệ thống (System Call) truy xuất đĩa cứng', 'Chống hack dữ liệu', 'Khôi phục file bị xóa'], 1, 'CLO3'),
  q('IT101_Q109', 'Hàm `fflush(stdout);` có tác dụng kỹ thuật gì?', 'HARD', ['Đóng màn hình', 'Ép toàn bộ dữ liệu đang nằm trong bộ đệm xuất ra màn hình console ngay lập tức mà không cần chờ ký tự \\n', 'Xóa bộ nhớ RAM', 'Tắt chương trình'], 1, 'CLO3'),
  q('IT101_Q110', 'Trong Tìm kiếm nhị phân, để tránh tràn số nguyên khi `left + right` vượt quá giới hạn INT_MAX, công thức tính `mid` tối ưu là:', 'HARD', ['left + (right - left) / 2', '(left + right) >> 2', 'right - left / 2', 'sqrt(left * right)'], 0, 'CLO3'),
  q('IT101_Q111', 'Khi ghi một struct chứa con trỏ `struct Book { char *title; int pages; };` xuống tệp nhị phân bằng `fwrite`, lỗi nghiêm trọng xảy ra là:', 'HARD', ['Không biên dịch được', 'Chỉ có giá trị địa chỉ con trỏ được ghi xuống tệp chứ không phải nội dung chuỗi tiêu đề, khi đọc lại con trỏ sẽ là địa chỉ rác', 'File quá nặng', 'File bị mã hóa'], 1, 'CLO3'),
  q('IT101_Q112', 'Kỹ thuật quy hoạch động Memoization giúp tối ưu hàm Fibonacci đệ quy như thế nào?', 'HARD', ['Lưu lại kết quả các bài toán con đã giải để tái sử dụng, giảm độ phức tạp từ O(2^n) xuống O(n)', 'Khử hoàn toàn trường hợp cơ sở', 'Biến hàm thành đa luồng', 'Xóa bộ nhớ tự động'], 0, 'CLO3'),
  q('IT101_Q113', 'Thuật toán sắp xếp nào sau đây hoạt động theo tư tưởng "Chia để trị" (Divide and Conquer)?', 'HARD', ['Bubble Sort', 'Insertion Sort', 'Merge Sort', 'Selection Sort'], 2, 'CLO3'),
  q('IT101_Q114', 'Để dừng sớm thuật toán Bubble Sort khi mảng đã có thứ tự trước khi duyệt hết N-1 vòng lặp, cải tiến là gì?', 'HARD', ['Dùng lệnh exit', 'Sử dụng cờ hiệu `swapped`, nếu trong một vòng lặp không có bất kỳ phép đổi chỗ nào thì dừng thuật toán ngay', 'Kiểm tra phần tử đầu và cuối', 'Dùng lệnh continue'], 1, 'CLO3'),
  q('IT101_Q115', 'Để đọc một dòng văn bản độ dài bất kỳ một cách an toàn tự động cấp phát bộ nhớ trong chuẩn POSIX C, hàm nào được dùng?', 'HARD', ['fgets()', 'getline(&line, &len, fp)', 'gets()', 'scanf("%s")'], 1, 'CLO3'),

  // Vận dụng cao (5 câu)
  q('IT101_Q116', 'Thuật toán Introsort (kết hợp Quicksort, Heapsort và Insertionsort) được thiết kế nhằm mục tiêu cốt lõi gì?', 'EXPERT', ['Để chạy đơn luồng', 'Đảm bảo độ phức tạp tồi nhất luôn là O(n log n) bằng cách chuyển sang Heapsort khi độ sâu đệ quy vượt ngưỡng 2*log(n)', 'Để thuật toán luôn ổn định', 'Tiết kiệm bộ nhớ RAM tuyệt đối'], 1, 'CLO4'),
  q('IT101_Q117', 'Ảnh hưởng của Cache Locality (Tính cục bộ bộ nhớ đệm CPU) khi duyệt mảng 2 chiều là gì?', 'EXPERT', ['Không ảnh hưởng', 'Duyệt theo thứ tự hàng (Row-major) tận dụng liên tục Cache Line của CPU, cho tốc độ vượt trội so với duyệt theo cột (Column-major)', 'Duyệt theo cột luôn nhanh hơn', 'Làm tràn Call Stack'], 1, 'CLO4'),
  q('IT101_Q118', 'Khi xử lý tệp dữ liệu kích thước cực lớn (hàng chục GB), kỹ thuật nào tối ưu vượt trội so với gọi `fread()` tuần tự?', 'EXPERT', ['Đệ quy', 'Ánh xạ tệp vào không gian bộ nhớ ảo (Memory-Mapped Files - mmap)', 'Tăng mảng tĩnh', 'Chuyển sang tệp văn bản'], 1, 'CLO4'),
  q('IT101_Q119', 'Để tránh lỗi Stack Overflow khi phải giải quyết bài toán đệ quy sâu hàng triệu bước, giải pháp kiến trúc phần mềm chuẩn là gì?', 'EXPERT', ['Tăng xung nhịp CPU', 'Tự quản lý một cấu trúc Ngăn xếp (Explicit Stack) trên Heap và chuyển toàn bộ giải thuật sang dạng lặp', 'Ép kiểu con trỏ sang long long', 'Bỏ qua biến cục bộ'], 1, 'CLO4'),
  q('IT101_Q120', 'Hàm `qsort(base, num, size, compar)` trong `<stdlib.h>` yêu cầu hàm `compar(a, b)` trả về giá trị gì nếu `a < b` để sắp xếp tăng dần?', 'EXPERT', ['Số dương (> 0)', 'Số âm (< 0)', 'Số 0', 'NULL'], 1, 'CLO4')
];

module.exports = {
  course: {
    code: 'IT101',
    name: 'Nhập Môn Lập Trình C/C++',
    faculty: 'Khoa Công Nghệ Thông Tin',
    category_code: 'CAT-IT101',
    credits: 4
  },
  root_1: root1,
  root_2: root2,
  root_3: root3,
  getAllQuestions: () => [...root1, ...root2, ...root3]
};

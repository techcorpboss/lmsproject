// backend/scripts/generateAllQuestions.js
// Generates 960 authentic academic questions for 8 courses (120 per course = 3 root papers x 40 questions)
'use strict';

const fs = require('fs');
const path = require('path');

// Helper to build a question object
function q(id, content, difficulty, answers, correctIdx) {
  return {
    id,
    content,
    difficulty,
    default_mark: 0.25,
    answers: answers.map((text, idx) => ({
      content: text,
      is_correct: idx === correctIdx,
      fraction: idx === correctIdx ? 1.0 : 0.0
    }))
  };
}

// 1. IT101: Nhập Môn Lập Trình C/C++ (120 questions)
function generateIT101() {
  const list = [];
  const prefix = 'IT101_Q';
  
  // ROOT 1 (Q001 - Q040): Cú pháp, Kiểu dữ liệu, Biến, Rẽ nhánh, Vòng lặp, Mảng 1 chiều, Hàm
  const r1 = [
    // 1-10: EASY
    ['Kiểu dữ liệu nào trong ngôn ngữ C chiếm kích thước 1 byte trong bộ nhớ?', 'EASY', ['int', 'float', 'char', 'double'], 2],
    ['Toán tử nào được dùng để lấy địa chỉ của một biến trong C/C++?', 'EASY', ['*', '&', '->', '%'], 1],
    ['Trong C/C++, cấu trúc rẽ nhánh nào phù hợp nhất khi kiểm tra một biến với nhiều giá trị hằng số nguyên?', 'EASY', ['if-else', 'switch-case', 'while', 'for'], 1],
    ['Kết quả của biểu thức (15 % 4) trong C/C++ là bao nhiêu?', 'EASY', ['3', '3.75', '0', '4'], 0],
    ['Vòng lặp nào luôn thực hiện khối lệnh ít nhất một lần trước khi kiểm tra điều kiện lặp?', 'EASY', ['for', 'while', 'do - while', 'nested loop'], 2],
    ['Trong chuẩn C99, để khai báo hằng số không thể thay đổi giá trị trong suốt chương trình, từ khóa nào được sử dụng?', 'EASY', ['static', 'const', 'volatile', 'register'], 1],
    ['Mảng số nguyên `int a[10];` có chỉ số hợp lệ bắt đầu từ đâu và kết thúc ở đâu?', 'EASY', ['Từ 1 đến 10', 'Từ 0 đến 9', 'Từ 0 đến 10', 'Từ 1 đến 9'], 1],
    ['Hàm `printf` và `scanf` thuộc thư viện chuẩn nào của ngôn ngữ C?', 'EASY', ['<stdlib.h>', '<math.h>', '<stdio.h>', '<string.h>'], 2],
    ['Ký tự đặc biệt nào đánh dấu sự kết thúc của một chuỗi ký tự (string) trong ngôn ngữ C?', 'EASY', ['\\n', '\\0', '\\t', 'EOF'], 1],
    ['Từ khóa `return` trong thân hàm có tác dụng gì?', 'EASY', ['Tạm dừng chương trình', 'Trả về giá trị cho hàm gọi và kết thúc hàm ngay lập tức', 'Nhảy đến nhãn được chỉ định', 'Giải phóng bộ nhớ biến cục bộ'], 1],

    // 11-25: MEDIUM
    ['Cho đoạn mã `int x = 5; int y = ++x;`. Sau khi thực thi, giá trị của x và y lần lượt là gì?', 'MEDIUM', ['x = 5, y = 6', 'x = 6, y = 6', 'x = 6, y = 5', 'x = 5, y = 5'], 1],
    ['Cho đoạn mã `int x = 5; int y = x++;`. Sau khi thực thi, giá trị của x và y lần lượt là gì?', 'MEDIUM', ['x = 6, y = 5', 'x = 6, y = 6', 'x = 5, y = 6', 'x = 5, y = 5'], 0],
    ['Hàm `strlen("LMS\\0TechCorp")` trong thư viện `<string.h>` sẽ trả về giá trị bao nhiêu?', 'MEDIUM', ['3', '11', '12', '4'], 0],
    ['Khi truyền tham số vào hàm theo cơ chế truyền tham trị (pass-by-value), thay đổi giá trị của tham số trong hàm có ảnh hưởng tới đối số ban đầu không?', 'MEDIUM', ['Có ảnh hưởng trực tiếp', 'Không làm thay đổi giá trị đối số ban đầu', 'Chỉ ảnh hưởng nếu biến là số nguyên', 'Gây lỗi biên dịch'], 1],
    ['Để so sánh hai chuỗi ký tự `s1` và `s2` trong C theo thứ tự từ điển, ta sử dụng hàm nào?', 'MEDIUM', ['strcmp(s1, s2)', 'strcpy(s1, s2)', 'strcat(s1, s2)', 'strchr(s1, s2)'], 0],
    ['Biểu thức logic `(5 > 3 && 2 < 1 || !0)` trong C/C++ cho kết quả là gì?', 'MEDIUM', ['0 (false)', '1 (true)', '-1', 'Lỗi cú pháp'], 1],
    ['Cho mảng `int arr[] = {2, 4, 6, 8, 10};`. Giá trị của `*(arr + 3)` là bao nhiêu?', 'MEDIUM', ['4', '6', '8', '10'], 2],
    ['Trong C++, cú pháp nào được dùng để truyền một biến theo tham chiếu (pass-by-reference)?', 'MEDIUM', ['void func(int *x)', 'void func(int &x)', 'void func(ref int x)', 'void func(int %x)'], 1],
    ['Lệnh `break` trong cấu trúc vòng lặp có chức năng gì?', 'MEDIUM', ['Bỏ qua lần lặp hiện tại và chuyển sang lần lặp kế tiếp', 'Thoát hẳn khỏi vòng lặp chứa nó ngay lập tức', 'Kết thúc toàn bộ chương trình', 'Khởi tạo lại biến đếm của vòng lặp'], 1],
    ['Lệnh `continue` trong cấu trúc vòng lặp có chức năng gì?', 'MEDIUM', ['Thoát khỏi vòng lặp', 'Bỏ qua các lệnh còn lại trong thân vòng lặp của lượt hiện tại và chuyển sang bước lặp tiếp theo', 'Dừng chương trình chờ người dùng bấm phím', 'Xóa bộ nhớ đệm bàn phím'], 1],
    ['Cho đoạn mã `int a = 7, b = 2; float c = a / b;`. Giá trị của biến `c` sau phép gán là gì?', 'MEDIUM', ['3.5', '3.0', '3', '4.0'], 1],
    ['Để biến `c` nhận giá trị chính xác là `3.5` từ `int a = 7, b = 2;`, cần viết biểu thức như thế nào?', 'MEDIUM', ['float c = (float)(a / b);', 'float c = (float)a / b;', 'float c = float(a / b);', 'float c = a / (int)b;'], 1],
    ['Một biến được khai báo với từ khóa `static` bên trong một hàm sẽ có đặc điểm gì?', 'MEDIUM', ['Tự hủy khi hàm kết thúc', 'Giá trị được bảo lưu qua các lần gọi hàm khác nhau trong suốt thời gian chạy', 'Chỉ có thể truy cập từ ngoài file', 'Luôn có giá trị mặc định là null'], 1],
    ['Kích thước của toán tử `sizeof(double)` trên hầu hết các trình biên dịch hiện đại (GCC/Clang) là bao nhiêu byte?', 'MEDIUM', ['4 byte', '8 byte', '16 byte', '2 byte'], 1],
    ['Đoạn mã sau in ra kết quả gì: `int i = 0; while(i < 3) { printf("%d ", i); i++; }`?', 'MEDIUM', ['0 1 2', '0 1 2 3', '1 2 3', '0 1'], 0],

    // 26-35: HARD
    ['Cho mảng `int a[5] = {1, 2, 3, 4, 5}; int *p = a + 4;`. Biểu thức `p - a` cho kết quả là gì?', 'HARD', ['4', '16 byte', '5', 'Địa chỉ bộ nhớ ô a[4]'], 0],
    ['Trong C, nếu gọi hàm đệ quy không có trường hợp cơ sở (base case) hoặc điều kiện dừng không bao giờ đạt được, hiện tượng gì sẽ xảy ra?', 'HARD', ['Tràn bộ nhớ Heap', 'Tràn ngăn xếp gọi hàm (Stack Overflow)', 'Lỗi phân trang Disk Thrashing', 'Chương trình tự động quay lui'], 1],
    ['Cho hàm đệ quy: `int f(int n) { if (n <= 1) return 1; return n * f(n - 1); }`. Độ phức tạp thời gian của hàm `f(n)` là gì?', 'HARD', ['O(1)', 'O(log n)', 'O(n)', 'O(n^2)'], 2],
    ['Khi khai báo `char str[10] = "Hello";`, giá trị của `sizeof(str)` và `strlen(str)` lần lượt là gì?', 'HARD', ['10 và 5', '5 và 10', '6 và 5', '10 và 6'], 0],
    ['Cho đoạn mã: `int x = 10; { int x = 20; printf("%d ", x); } printf("%d", x);`. Kết quả in ra màn hình là gì?', 'HARD', ['20 20', '20 10', '10 20', '10 10'], 1],
    ['Toán tử dịch bit `10 << 2` trong C cho kết quả là giá trị số nguyên nào?', 'HARD', ['2', '20', '40', '5'], 2],
    ['Phép toán bitwise AND `(12 & 10)` có giá trị bằng bao nhiêu trong hệ thập phân?', 'HARD', ['8', '10', '14', '2'], 0],
    ['Để duyệt qua từng phần tử của mảng 2 chiều kích thước `M x N` theo thứ tự hàng rồi cột, cần sử dụng cấu trúc nào?', 'HARD', ['Một vòng lặp đơn với bước nhảy M', 'Hai vòng lặp lồng nhau (vòng ngoài duyệt hàng 0..M-1, vòng trong duyệt cột 0..N-1)', 'Đệ quy nhị phân', 'Cấu trúc rẽ nhánh switch lồng nhau'], 1],
    ['Một hàm đệ quy đuôi (Tail Recursion) có ưu điểm nổi bật nào khi được trình biên dịch hiện đại tối ưu hóa?', 'HARD', ['Không cần dùng điều kiện dừng', 'Có thể chuyển đổi thành vòng lặp giúp tiết kiệm không gian ngăn xếp O(1)', 'Luôn chạy nhanh hơn hàm thông thường gấp 10 lần', 'Tự động chạy đa luồng'], 1],
    ['Cho nguyên mẫu hàm `void swap(int *a, int *b)`. Lệnh gọi hàm nào sau đây là đúng với hai biến `int x = 3, y = 5;`?', 'HARD', ['swap(x, y);', 'swap(&x, &y);', 'swap(*x, *y);', 'swap(&x, y);'], 1],

    // 36-40: EXPERT
    ['Hành vi Undefined Behavior (UB) trong C/C++ là gì?', 'EXPERT', ['Hành vi mà chuẩn ngôn ngữ không áp đặt bất kỳ yêu cầu nào, trình biên dịch có thể sinh mã bất kỳ dẫn tới lỗi nghiêm trọng', 'Lỗi cú pháp bắt buộc trình biên dịch phải báo dừng', 'Chương trình luôn kết thúc với mã trả về -1', 'Hiện tượng bộ nhớ tự giải phóng'], 0],
    ['Cho đoạn mã `int a = 1; int b = (a++) + (++a);`. Theo tiêu chuẩn C/C++, biểu thức này được đánh giá như thế nào?', 'EXPERT', ['Luôn bằng 4', 'Luôn bằng 5', 'Gây ra hành vi không xác định (Undefined Behavior) do vi phạm điểm đồng bộ Sequence Point', 'Trình biên dịch bắt buộc ép kiểu sang float'], 2],
    ['Cơ chế bộ nhớ nào quản lý các biến cục bộ và địa chỉ trở về khi một hàm được gọi thực thi?', 'EXPERT', ['Data Segment', 'BSS Segment', 'Call Stack (Vùng nhớ ngăn xếp)', 'Heap Segment (Vùng nhớ cấp phát động)'], 2],
    ['Cho hàm `int* createArray() { int arr[5] = {1,2,3,4,5}; return arr; }`. Việc gọi hàm này và sử dụng mảng trả về gặp lỗi gì?', 'EXPERT', ['Bộ nhớ bị rò rỉ (Memory leak)', 'Truy cập con trỏ treo (Dangling pointer) vì mảng cục bộ bị thu hồi khi thoát hàm', 'Tràn bộ nhớ đệm (Buffer overflow)', 'Lỗi chia cho 0'], 1],
    ['Để truyền một con trỏ hàm có dạng `int (*operation)(int, int)` làm tham số cho hàm khác, cú pháp khai báo hàm nhận là gì?', 'EXPERT', ['void compute(int operation(int, int))', 'void compute(int (*op)(int, int))', 'void compute(int *op(int, int))', 'void compute(function<int(int,int)> op)'], 1]
  ];

  // ROOT 2 (Q041 - Q080): Con trỏ, Cấp phát động, Mảng 2 chiều, Kiểu struct, Quản lý bộ nhớ
  const r2 = [
    // 41-50: EASY
    ['Cú pháp khai báo biến con trỏ `ptr` trỏ tới số nguyên trong C là gì?', 'EASY', ['int ptr;', 'int *ptr;', 'ptr int;', 'pointer int ptr;'], 1],
    ['Hàm nào trong thư viện `<stdlib.h>` dùng để cấp phát động vùng nhớ chưa được khởi tạo giá trị?', 'EASY', ['malloc()', 'calloc()', 'realloc()', 'free()'], 0],
    ['Hàm nào dùng để giải phóng vùng nhớ đã được cấp phát động bằng `malloc` hoặc `calloc`?', 'EASY', ['delete()', 'destroy()', 'free()', 'release()'], 2],
    ['Toán tử nào trong C++ dùng để cấp phát bộ nhớ động cho một đối tượng đơn lẻ?', 'EASY', ['malloc', 'new', 'alloc', 'create'], 1],
    ['Toán tử nào trong C++ dùng để giải phóng bộ nhớ động của một mảng đối tượng?', 'EASY', ['free', 'delete', 'delete[]', 'drop'], 2],
    ['Từ khóa nào trong C dùng để định nghĩa một kiểu dữ liệu mới gom nhóm nhiều trường dữ liệu có kiểu khác nhau?', 'EASY', ['class', 'union', 'struct', 'typedef struct'], 2],
    ['Để truy cập vào trường `age` của biến cấu trúc `Student s;`, ta dùng cú pháp nào?', 'EASY', ['s->age', 's.age', 's::age', 's[age]'], 1],
    ['Để truy cập vào trường `age` thông qua con trỏ cấu trúc `Student *ptr;`, ta dùng cú pháp nào?', 'EASY', ['ptr.age', 'ptr->age', 'ptr::age', '*ptr.age'], 1],
    ['Giá trị `NULL` trong C biểu diễn điều gì đối với biến con trỏ?', 'EASY', ['Con trỏ trỏ vào ô nhớ đầu tiên của RAM', 'Con trỏ không trỏ tới bất kỳ địa chỉ bộ nhớ hợp lệ nào', 'Con trỏ có giá trị là 1', 'Con trỏ trỏ tới hàm main'], 1],
    ['Khi dùng `malloc(sizeof(int) * 5)`, nếu hệ thống hết bộ nhớ thì hàm trả về giá trị gì?', 'EASY', ['0', '-1', 'NULL', 'Ném ra ngoại lệ std::bad_alloc'], 2],

    // 51-65: MEDIUM
    ['Sự khác biệt cốt lõi giữa `malloc()` và `calloc()` trong C là gì?', 'MEDIUM', ['malloc cấp phát nhanh hơn calloc', 'calloc tự động khởi tạo tất cả các byte trong vùng nhớ được cấp phát về giá trị 0, còn malloc để nguyên rác bộ nhớ', 'malloc dùng cho số thực còn calloc cho số nguyên', 'calloc không cần tham số kích thước'], 1],
    ['Khi khai báo `typedef struct { char name[50]; float gpa; } SinhVien;`, từ khóa `typedef` có vai trò gì?', 'MEDIUM', ['Tạo biến toàn cục SinhVien', 'Định nghĩa bí danh (alias) để có thể dùng `SinhVien` như một kiểu dữ liệu mà không cần viết `struct SinhVien`', 'Ép kiểu con trỏ', 'Khởi tạo cấu trúc rỗng'], 1],
    ['Cho đoạn mã `int a = 10; int *p = &a; *p = 20;`. Giá trị của biến `a` sau đoạn mã này là gì?', 'MEDIUM', ['10', '20', 'Địa chỉ của p', 'Lỗi bộ nhớ'], 1],
    ['Trong mảng 2 chiều `int matrix[3][4];`, tổng số phần tử của mảng là bao nhiêu?', 'MEDIUM', ['7', '12', '14', '34'], 1],
    ['Địa chỉ của phần tử `matrix[i][j]` trong mảng 2 chiều lưu trữ theo thứ tự hàng (Row-Major Order) được tính theo công thức nào?', 'MEDIUM', ['base + (i * COLS + j) * sizeof(type)', 'base + (j * ROWS + i) * sizeof(type)', 'base + (i + j) * sizeof(type)', 'base + (i * j) * sizeof(type)'], 0],
    ['Cho `int arr[5] = {10, 20, 30, 40, 50}; int *p = arr;`. Giá trị của `*(p + 2)` là bao nhiêu?', 'MEDIUM', ['10', '20', '30', '40'], 2],
    ['Khi cấp phát động một mảng bằng `int *a = (int*)malloc(10 * sizeof(int));`, sau khi sử dụng xong không gọi `free(a)`, hiện tượng gì xảy ra?', 'MEDIUM', ['Segmentation Fault', 'Rò rỉ bộ nhớ (Memory Leak)', 'Tràn ngăn xếp (Stack Overflow)', 'Treo vi xử lý'], 1],
    ['Kiểu dữ liệu `union` khác với `struct` ở điểm cốt lõi nào?', 'MEDIUM', ['union không thể chứa con trỏ', 'Các trường trong union chia sẻ cùng một vùng nhớ, kích thước union bằng kích thước trường lớn nhất', 'struct chia sẻ chung vùng nhớ', 'union chỉ chứa được số nguyên'], 1],
    ['Hàm `realloc(ptr, new_size)` dùng để làm gì?', 'MEDIUM', ['Giải phóng con trỏ ptr', 'Thay đổi kích thước vùng nhớ đã cấp phát động trước đó cho ptr', 'Sao chép vùng nhớ sang ổ đĩa', 'Khởi tạo lại mảng về 0'], 1],
    ['Con trỏ void `void *ptr;` trong C có đặc điểm gì?', 'MEDIUM', ['Chỉ trỏ được tới hàm void', 'Là con trỏ tổng quát (generic pointer), có thể trỏ tới bất kỳ kiểu dữ liệu nào nhưng cần ép kiểu khi giải tham chiếu', 'Không bao giờ gán được giá trị', 'Có kích thước bằng 0 byte'], 1],
    ['Cho `char a[] = "Hello"; char *p = a;`. Lệnh `printf("%c", *(p+1));` sẽ in ra ký tự gì?', 'MEDIUM', ['H', 'e', 'l', 'o'], 1],
    ['Khi truyền một mảng `int arr[]` vào hàm `void process(int arr[], int n)`, thực chất tham số `arr` trong hàm là gì?', 'MEDIUM', ['Một bản sao nguyên vẹn của mảng arr', 'Một con trỏ `int *arr` trỏ tới phần tử đầu tiên của mảng gốc', 'Một tham chiếu hằng', 'Một cấu trúc struct'], 1],
    ['Con trỏ trỏ tới con trỏ (Double Pointer) `int **pp;` thường được sử dụng trong trường hợp nào?', 'MEDIUM', ['Khi muốn thay đổi địa chỉ mà con trỏ cấp 1 đang trỏ tới từ bên trong một hàm', 'Chỉ dùng trong đồ họa 3D', 'Khi mảng có nhiều hơn 1000 phần tử', 'Để tăng tốc độ tính toán CPU'], 0],
    ['Trong C++, nếu gọi `delete ptr;` trên một con trỏ `ptr` có giá trị `NULL` thì điều gì xảy ra?', 'MEDIUM', ['Chương trình bị crash do Segmentation Fault', 'Không có hành động nào xảy ra, an toàn tuyệt đối', 'Gây tràn bộ nhớ Heap', 'Báo lỗi lúc biên dịch'], 1],
    ['Kích thước của một biến con trỏ trên hệ điều hành 64-bit là bao nhiêu byte?', 'MEDIUM', ['4 byte', '8 byte', '16 byte', '2 byte'], 1],

    // 66-75: HARD
    ['Cho đoạn mã `int x = 100; const int *ptr = &x;`. Phát biểu nào sau đây đúng?', 'HARD', ['*ptr = 200; là hợp lệ', 'ptr không thể trỏ sang biến khác', 'Không thể thay đổi giá trị của x thông qua *ptr vì đây là con trỏ trỏ tới hằng số', 'x bắt buộc phải khai báo là const'], 2],
    ['Cho đoạn mã `int x = 100; int * const ptr = &x;`. Phát biểu nào sau đây đúng?', 'HARD', ['Không thể thay đổi giá trị *ptr', 'ptr là một hằng con trỏ, không thể thay đổi địa chỉ mà ptr đang trỏ tới sau khi khởi tạo', 'ptr có thể trỏ tới biến y khác bất kỳ lúc nào', 'x không thể thay đổi giá trị'], 1],
    ['Hiện tượng "Dangling Pointer" (Con trỏ treo) xảy ra khi nào?', 'HARD', ['Con trỏ trỏ tới NULL', 'Con trỏ trỏ tới vùng nhớ đã bị giải phóng bằng free() hoặc delete nhưng chưa được gán về NULL', 'Con trỏ chưa được khai báo kiểu dữ liệu', 'Hai con trỏ trỏ tới cùng một biến'], 1],
    ['Cho `struct Node { int data; struct Node *next; };`. Biểu thức nào sau đây cấp phát động đúng cho một nút mới?', 'HARD', ['struct Node *n = malloc(sizeof(int));', 'struct Node *n = (struct Node*)malloc(sizeof(struct Node));', 'struct Node *n = new int;', 'struct Node *n = alloc(struct Node);'], 1],
    ['Bộ nhớ đệm bị tràn (Buffer Overflow) khi nhập chuỗi bằng hàm `gets()` là do nguyên nhân nào?', 'HARD', ['gets() không kiểm tra kích thước bộ đệm đích so với độ dài chuỗi nhập vào từ bàn phím', 'gets() chỉ đọc được ký tự số', 'gets() bắt buộc chuỗi phải có ít hơn 10 ký tự', 'gets() tự động thêm ký tự rác vào đầu chuỗi'], 0],
    ['Để đọc chuỗi an toàn chống tràn bộ đệm thay thế cho `gets()`, chuẩn C khuyên dùng hàm nào?', 'HARD', ['scanf("%s", str)', 'fgets(str, sizeof(str), stdin)', 'getch()', 'getchar()'], 1],
    ['Cho mảng con trỏ `char *fruits[] = {"Apple", "Banana", "Orange"};`. Giá trị của `*(fruits[1] + 2)` là ký tự nào?', 'HARD', ['a', 'n', 'B', 'r'], 1],
    ['Cấp phát động ma trận 2 chiều kích thước `rows x cols` trong C bằng con trỏ cấp 2 `int **arr` cần bao nhiêu bước gọi `malloc`?', 'HARD', ['1 lần duy nhất', '1 lần cho mảng con trỏ hàng `int*` và `rows` lần cho từng hàng', 'cols lần', 'rows * cols lần'], 1],
    ['Khi giải phóng ma trận 2 chiều được cấp phát bằng con trỏ cấp 2 `int **arr`, thứ tự gọi hàm `free()` đúng là gì?', 'HARD', ['free(arr) trước, sau đó free từng hàng', 'free từng hàng arr[i] trước (với i từ 0 đến rows-1), sau đó mới free(arr)', 'Chỉ cần free(arr) là toàn bộ ma trận tự giải phóng', 'free phần tử arr[0][0] trước'], 1],
    ['Hiện tượng phân mảnh bộ nhớ (Memory Fragmentation) trong cấp phát động xảy ra khi nào?', 'HARD', ['Khi RAM bị hỏng một phần cứng', 'Khi liên tục cấp phát và giải phóng các khối nhớ kích thước khác nhau tạo ra các lỗ trống nhỏ không đủ cho lần cấp phát mới', 'Khi chương trình dùng quá nhiều biến static', 'Khi tốc độ bus RAM chậm hơn CPU'], 1],

    // 76-80: EXPERT
    ['Khái niệm Memory Alignment (Căn chỉnh bộ nhớ) trong struct của ngôn ngữ C dẫn đến hiện tượng gì?', 'EXPERT', ['Kích thước của struct luôn bằng tổng kích thước các trường thành viên', 'Trình biên dịch tự động chèn thêm các byte đệm (Padding Bytes) để các trường nằm ở địa chỉ là bội số của kích thước kiểu', 'Dữ liệu trong struct bị đảo ngược', 'Giảm hiệu năng truy cập CPU'], 1],
    ['Cho `struct A { char a; int b; char c; };` trên hệ 64-bit với căn chỉnh 4-byte. `sizeof(struct A)` là bao nhiêu byte?', 'EXPERT', ['6 byte', '8 byte', '12 byte', '16 byte'], 2],
    ['Con trỏ hàm (Function Pointer) trong C được định nghĩa cú pháp tổng quát như thế nào để trỏ tới hàm `float compute(int, float)`?', 'EXPERT', ['float *ptr(int, float);', 'float (*ptr)(int, float);', 'ptr<float(int, float)>;', 'float ptr*(int, float);'], 1],
    ['Để viết hàm tổng quát hoán đổi giá trị 2 biến bất kỳ theo kích thước byte (Generic Swap), hàm cần nhận tham số gì?', 'EXPERT', ['Hai con trỏ int*', 'Hai con trỏ void* kèm theo tham số kích thước `size_t size`', 'Hai con trỏ float*', 'Sử dụng toán tử template trong C thuần'], 1],
    ['Trong C, nếu ta ép kiểu ép địa chỉ một mảng byte sang con trỏ struct rồi truy cập dữ liệu, lỗi vi phạm nào có thể xảy ra trên kiến trúc ARM?', 'EXPERT', ['Segmentation Fault do unaligned memory access', 'Lỗi Stack Underflow', 'Lỗi chia cho 0', 'Lỗi rò rỉ bộ nhớ flash'], 0]
  ];

  // ROOT 3 (Q081 - Q120): File I/O, Đệ quy, Thuật toán cơ bản, Tối ưu hóa
  const r3 = [
    // 81-90: EASY
    ['Kiểu dữ liệu con trỏ nào được dùng để đại diện cho một luồng tệp tin trong thư viện `<stdio.h>`?', 'EASY', ['FILE*', 'FSTREAM*', 'FILE_PTR', 'DIR*'], 0],
    ['Chế độ mở tệp nào trong hàm `fopen("data.txt", mode)` dùng để ghi đè tệp văn bản từ đầu?', 'EASY', ['"r"', '"w"', '"a"', '"r+"'], 1],
    ['Chế độ mở tệp `"a"` trong hàm `fopen()` có ý nghĩa gì?', 'EASY', ['Chỉ đọc (Read only)', 'Ghi nối tiếp vào cuối tệp (Append), không xóa nội dung cũ', 'Tạo tệp nhị phân rỗng', 'Đọc và ghi ngẫu nhiên'], 1],
    ['Hàm nào dùng để đóng luồng tệp tin và đẩy toàn bộ dữ liệu đệm xuống đĩa?', 'EASY', ['close()', 'file_close()', 'fclose()', 'flush()'], 2],
    ['Hàm `feof(file_ptr)` trả về giá trị khác 0 (true) khi nào?', 'EASY', ['Khi tệp vừa được mở thành công', 'Khi con trỏ tệp đã chạm tới điểm kết thúc tệp (End-Of-File)', 'Khi tệp bị lỗi phần cứng', 'Khi tệp có dung lượng lớn hơn 1MB'], 1],
    ['Thuật toán tìm kiếm tuần tự (Linear Search) có độ phức tạp thời gian trong trường hợp xấu nhất là gì?', 'EASY', ['O(1)', 'O(log n)', 'O(n)', 'O(n^2)'], 2],
    ['Điều kiện tiên quyết bắt buộc để có thể áp dụng thuật toán Tìm kiếm nhị phân (Binary Search) là gì?', 'EASY', ['Mảng phải chứa toàn số dương', 'Mảng phải được sắp xếp theo thứ tự tăng dần hoặc giảm dần', 'Kích thước mảng phải là lũy thừa của 2', 'Mảng phải được lưu trữ trong danh sách liên kết'], 1],
    ['Độ phức tạp thời gian của thuật toán Tìm kiếm nhị phân trên mảng đã sắp xếp gồm n phần tử là gì?', 'EASY', ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], 1],
    ['Thuật toán sắp xếp nổi bọt (Bubble Sort) hoạt động dựa trên nguyên lý cơ bản nào?', 'EASY', ['Chia mảng thành hai nửa bằng nhau rồi trộn lại', 'Liên tục so sánh và đổi chỗ hai phần tử liền kề nếu chúng sai thứ tự', 'Chọn phần tử nhỏ nhất đưa về đầu mảng', 'Xây dựng cây nhị phân đống'], 1],
    ['Hàm `fgetc(fp)` đọc từ tệp tin cái gì?', 'EASY', ['Một dòng văn bản', 'Một ký tự đơn lẻ', 'Một số nguyên 4 byte', 'Toàn bộ nội dung tệp'], 1],

    // 91-105: MEDIUM
    ['Hàm `fscanf(fp, "%d", &num)` khác gì so với `scanf("%d", &num)`?', 'MEDIUM', ['fscanf đọc dữ liệu từ luồng tệp chỉ định, còn scanf đọc từ luồng nhập chuẩn stdin (bàn phím)', 'fscanf chỉ đọc được số thực', 'scanf chạy nhanh hơn fscanf 10 lần', 'fscanf tự động đóng tệp sau khi đọc'], 0],
    ['Hàm `fprintf(fp, ...)` ghi dữ liệu ra đâu?', 'MEDIUM', ['Màn hình console', 'Luồng tệp do con trỏ `fp` trỏ tới', 'Bộ nhớ clipboard', 'Cổng mạng socket'], 1],
    ['Để đọc và ghi các khối dữ liệu nhị phân (Binary File) có cấu trúc `struct` trong C, cặp hàm nào được sử dụng?', 'MEDIUM', ['read() và write()', 'fread() và fwrite()', 'bget() và bput()', 'load() và save()'], 1],
    ['Hàm `fseek(fp, 0, SEEK_END)` trong C có tác dụng gì?', 'MEDIUM', ['Di chuyển con trỏ tệp về đầu tệp', 'Di chuyển con trỏ tệp đến vị trí cuối cùng của tệp', 'Xóa toàn bộ nội dung tệp', 'Đóng tệp tin'], 1],
    ['Để lấy kích thước (byte) của một tệp tin, ta kết hợp cặp hàm nào?', 'MEDIUM', ['fopen và fclose', 'fseek(fp, 0, SEEK_END) kết hợp với ftell(fp)', 'sizeof(fp)', 'fread() kết hợp feof()'], 1],
    ['Độ phức tạp thời gian trung bình của thuật toán Sắp xếp chọn (Selection Sort) là gì?', 'MEDIUM', ['O(n)', 'O(n log n)', 'O(n^2)', 'O(log n)'], 2],
    ['Độ phức tạp thời gian trung bình của thuật toán Sắp xếp chèn (Insertion Sort) là gì?', 'MEDIUM', ['O(n log n)', 'O(n^2)', 'O(n)', 'O(1)'], 1],
    ['Thuật toán sắp xếp nào sau đây có tính chất ổn định (Stable Sort)?', 'MEDIUM', ['Selection Sort', 'Bubble Sort', 'Quick Sort không cải tiến', 'Heap Sort'], 1],
    ['Tính chất ổn định (Stable) của một thuật toán sắp xếp có nghĩa là gì?', 'MEDIUM', ['Thuật toán không bao giờ bị crash', 'Bảo toàn thứ tự tương đối ban đầu của các phần tử có khóa bằng nhau', 'Thời gian chạy luôn là O(n)', 'Không sử dụng thêm bộ nhớ phụ'], 1],
    ['Cho dãy số `{5, 1, 4, 2, 8}`. Sau bước lặp đầu tiên của Bubble Sort (sắp xếp tăng dần), dãy số trở thành gì?', 'MEDIUM', ['{1, 5, 4, 2, 8}', '{1, 4, 2, 5, 8}', '{1, 2, 4, 5, 8}', '{5, 4, 2, 1, 8}'], 1],
    ['Đệ quy nhị phân (Binary Recursion) trong bài toán tính dãy số Fibonacci `F(n) = F(n-1) + F(n-2)` có độ phức tạp thời gian là gì?', 'MEDIUM', ['O(n)', 'O(n^2)', 'O(2^n)', 'O(log n)'], 2],
    ['Để khử đệ quy cho bài toán tính giai thừa `n!`, giải pháp tối ưu về bộ nhớ là gì?', 'MEDIUM', ['Sử dụng vòng lặp `for` với biến tích lũy với độ phức tạp không gian O(1)', 'Sử dụng mảng 2 chiều', 'Gọi hàm system()', 'Dùng đệ quy lồng'], 0],
    ['Hàm `rewind(fp)` tương đương với lệnh nào sau đây?', 'MEDIUM', ['fseek(fp, 0, SEEK_CUR)', 'fseek(fp, 0, SEEK_SET)', 'fseek(fp, 0, SEEK_END)', 'ftell(fp)'], 1],
    ['Khi mở tệp tin nhị phân trên hệ điều hành Windows, chuỗi chế độ mở cần thêm ký tự gì để tránh biến đổi ký tự xuống dòng?', 'MEDIUM', ['"b" (ví dụ: "rb", "wb")', '"t"', '"bin"', '"x"'], 0],
    ['Trong bài toán Tháp Hà Nội (Tower of Hanoi) với n đĩa, số bước di chuyển tối thiểu để giải bài toán là bao nhiêu?', 'MEDIUM', ['2n', 'n^2', '2^n - 1', 'n!'], 2],

    // 106-115: HARD
    ['Thuật toán QuickSort chọn phần tử chốt (Pivot) xấu nhất khi nào dẫn tới độ phức tạp suy biến thành O(n^2)?', 'HARD', ['Khi mảng chứa các phần tử ngẫu nhiên', 'Khi mảng đã được sắp xếp tăng dần và luôn chọn phần tử đầu hoặc cuối làm pivot', 'Khi kích thước mảng là số chẵn', 'Khi mảng có nhiều phần tử âm'], 1],
    ['Độ phức tạp không gian phụ (Auxiliary Space Complexity) của thuật toán Sắp xếp trộn (Merge Sort) trên mảng là bao nhiêu?', 'HARD', ['O(1)', 'O(log n)', 'O(n)', 'O(n^2)'], 2],
    ['Cơ chế bộ đệm (Buffering) của luồng I/O trong C giúp cải thiện hiệu năng hệ thống như thế nào?', 'HARD', ['Tự động nén dữ liệu', 'Gom nhiều thao tác đọc/ghi nhỏ thành một khối lớn để giảm số lần gọi ngắt hệ thống (System Call) truy xuất phần cứng đĩa', 'Mã hóa dữ liệu chống tấn công mạng', 'Giúp tệp tin không bị xóa nhầm'], 1],
    ['Hàm `fflush(stdout)` có tác dụng gì?', 'HARD', ['Đóng màn hình console', 'Đẩy ngay lập tức toàn bộ dữ liệu đang chờ trong bộ đệm ra thiết bị xuất chuẩn mà không cần chờ gặp ký tự xuống dòng \\n', 'Xóa bộ nhớ RAM', 'Khởi động lại tiến trình'], 1],
    ['Trong thuật toán Tìm kiếm nhị phân, để tránh lỗi tràn số nguyên khi tính chỉ số giữa `mid`, cách viết nào tối ưu hơn `(left + right) / 2`?', 'HARD', ['left + (right - left) / 2', '(left + right) >> 2', 'right - left / 2', 'sqrt(left * right)'], 0],
    ['Khi ghi một cấu trúc chứa con trỏ `struct Student { char *name; int age; };` xuống tệp nhị phân bằng `fwrite`, rủi ro gì xảy ra?', 'HARD', ['Chương trình không biên dịch được', 'Chỉ có địa chỉ con trỏ được ghi xuống tệp thay vì chuỗi dữ liệu thực tế, khi đọc lại con trỏ đó sẽ là con trỏ rác', 'Kích thước tệp quá lớn', 'Tệp bị mã hóa tự động'], 1],
    ['Kỹ thuật đệ quy có nhớ (Memoization) giúp giải quyết nhược điểm gì của hàm Fibonacci đệ quy thuần túy?', 'HARD', ['Tránh việc tính toán lặp lại các bài toán con trùng lặp, giảm độ phức tạp từ O(2^n) xuống O(n)', 'Tự động giải phóng con trỏ', 'Loại bỏ hoàn toàn trường hợp cơ sở', 'Biến thuật toán thành chạy song song'], 0],
    ['Thuật toán sắp xếp nào sau đây hoạt động theo nguyên lý "Chia để trị" (Divide and Conquer)?', 'HARD', ['Bubble Sort', 'Insertion Sort', 'Merge Sort', 'Selection Sort'], 2],
    ['Trong thuật toán sắp xếp nổi bọt cải tiến, làm thế nào để dừng thuật toán sớm khi mảng đã có thứ tự trước khi hết n-1 vòng lặp?', 'HARD', ['Dùng hàm exit()', 'Sử dụng cờ hiệu `swapped`, nếu trong một lượt duyệt không có phép đổi chỗ nào thì dừng ngay', 'Kiểm tra phần tử đầu và cuối', 'Dùng lệnh continue'], 1],
    ['Để đọc từng dòng văn bản có độ dài bất kỳ an toàn từ tệp trong chuẩn POSIX/GNU C, hàm nào tự động cấp phát bộ nhớ động?', 'HARD', ['fgets()', 'getline(&line, &len, fp)', 'gets()', 'fscanf()'], 1],

    // 116-120: EXPERT
    ['Thuật toán Introsort (kết hợp Quicksort, Heapsort và Insertionsort) được dùng trong hàm `std::sort` của C++ nhằm mục tiêu gì?', 'EXPERT', ['Để chạy đơn luồng', 'Đảm bảo thời gian chạy tồi nhất luôn là O(n log n) bằng cách chuyển sang Heapsort khi độ sâu đệ quy vượt ngưỡng', 'Để thuật toán luôn có tính ổn định Stable', 'Chỉ nhằm mục đích tiết kiệm RAM'], 1],
    ['Khái niệm Cache Locality (Tính cục bộ bộ nhớ đệm CPU) ảnh hưởng như thế nào đến việc duyệt mảng 2 chiều?', 'EXPERT', ['Không ảnh hưởng', 'Duyệt theo thứ tự hàng (Row-major) tận dụng tốt đường truyền cache line của CPU, chạy nhanh hơn đáng kể so với duyệt theo cột (Column-major)', 'Duyệt theo cột luôn nhanh hơn duyệt theo hàng', 'Làm tràn ngăn xếp'], 1],
    ['Khi làm việc với tệp dung lượng cực lớn (vài GB), kỹ thuật nào thay thế việc đọc tuần tự bằng `fread` để tối ưu tốc độ I/O?', 'EXPERT', ['Sử dụng đệ quy', 'Sử dụng ánh xạ tệp vào không gian bộ nhớ ảo (Memory-Mapped Files - hàm mmap trên Linux / CreateFileMapping trên Windows)', 'Tăng kích thước mảng tĩnh', 'Chuyển sang tệp text'], 1],
    ['Trong giải thuật đệ quy, nếu một hàm gọi đệ quy sâu tới 1.000.000 tầng, giải pháp nào trong thiết kế phần mềm hệ thống giúp tránh lỗi Stack Overflow?', 'EXPERT', ['Tăng điện áp CPU', 'Tự quản lý một cấu trúc Ngăn xếp (Stack) thủ công trên vùng nhớ Heap và chuyển sang giải thuật lặp', 'Ép kiểu con trỏ sang long long', 'Bỏ qua các phép gán biến'], 1],
    ['Hàm `qsort()` trong thư viện chuẩn `<stdlib.h>` nhận con trỏ hàm so sánh có nguyên mẫu `int (*compar)(const void*, const void*)`. Nếu phần tử thứ nhất nhỏ hơn phần tử thứ hai, hàm so sánh phải trả về giá trị gì để sắp xếp tăng dần?', 'EXPERT', ['Giá trị dương (> 0)', 'Giá trị âm (< 0)', 'Giá trị 0', 'Giá trị NULL'], 1]
  ];

  [...r1, ...r2, ...r3].forEach((item, idx) => {
    const qId = `${prefix}${String(idx + 1).padStart(3, '0')}`;
    list.push(q(qId, item[0], item[1], item[2], item[3]));
  });

  return list;
}

console.log('Building all question banks for 8 courses...');

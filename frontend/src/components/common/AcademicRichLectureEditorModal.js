// frontend/src/components/common/AcademicRichLectureEditorModal.js
// ✍️ Trình Biên Soạn Bài Giảng Học Thuật Chuyên Sâu (Academic Rich Lecture Editor)
// Dành cho Giảng viên: Hỗ trợ Công thức Toán KaTeX, Khối Code Đa Ngôn Ngữ, Callout Sư Phạm, Draft/Published & Nhả bài Drip
import React, { useState, useEffect, useRef } from 'react';
import {
  Modal, Button, Space, Typography, Tag, Input, Select,
  Row, Col, Card, Tooltip, Switch, DatePicker, message, Divider, Tabs, Radio
} from 'antd';
import {
  EditOutlined, EyeOutlined, SaveOutlined, CodeOutlined,
  FunctionOutlined, BoldOutlined, ItalicOutlined, UnorderedListOutlined,
  OrderedListOutlined, TableOutlined, AlertOutlined, CheckCircleOutlined,
  ClockCircleOutlined, LockOutlined, UnlockOutlined, FileTextOutlined,
  BulbOutlined, WarningOutlined, InfoCircleOutlined, SplitCellsOutlined
} from '@ant-design/icons';
import AcademicContentRenderer from './AcademicContentRenderer';
import apiClient from '../../services/apiClient';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export default function AcademicRichLectureEditorModal({
  open,
  onClose,
  moduleId,
  sectionId = 1,
  existingMaterial = null,
  onSaveSuccess
}) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('MAIN_TEXTBOOK');
  const [durationMins, setDurationMins] = useState(45);
  const [isPublished, setIsPublished] = useState(true);
  const [releaseDate, setReleaseDate] = useState(null);
  const [antiSkipping, setAntiSkipping] = useState(true);
  const [minCompletionPct, setMinCompletionPct] = useState(80);
  const [richContent, setRichContent] = useState('');
  const [viewMode, setViewMode] = useState('SPLIT'); // 'SPLIT' | 'EDIT' | 'PREVIEW'
  const [saving, setSaving] = useState(false);

  const textAreaRef = useRef(null);

  // Mẫu bài giảng sư phạm có sẵn khi tạo mới
  const DEFAULT_LECTURE_TEMPLATE = `# 📘 BÀI GIẢNG: THIẾT KẾ & TỐI ƯU HÓA HỆ THỐNG
## Mục tiêu học tập (Course Learning Outcomes - CLO)
1. Nắm vững bản chất thuật toán và mô hình toán học tương ứng.
2. Vận dụng cấu trúc dữ liệu tối ưu vào bài toán thực tế.
3. Phân tích độ phức tạp thời gian $O(n)$ và không gian bộ nhớ.

---

### 1. Cơ sở Lý thuyết & Mô hình Toán học
Xét bài toán tìm kiếm và cân bằng trạng thái với hàm chi phí cực tiểu:
$$f(x) = \\sum_{i=1}^{n} (w_i \\cdot x_i^2) + \\lambda \\int_{0}^{t} e^{-\\alpha \\tau} d\\tau$$

Trong đó:
- $w_i$: Trọng số tối ưu hóa của biến thành phần thứ $i$.
- $\\alpha, \\beta, \\lambda$: Các hệ số suy biến và ràng buộc vật lý.
- Điều kiện dừng: $\\Delta E < 10^{-6}$ và gradient hội tụ $\\nabla f(x) \\approx 0$.

> [!IMPORTANT]
> **Quy tắc an toàn bộ nhớ:** Trong môi trường sản xuất, mọi con trỏ sau khi cấp phát động phải được giải phóng hoặc quản lý thông qua Smart Pointers (\`std::unique_ptr\`, \`std::shared_ptr\`) để ngăn chặn triệt để Memory Leak!

---

### 2. Cài đặt Thuật toán Mẫu (Implementation)
Dưới đây là đoạn mã nguồn giải thuật cài đặt mẫu bằng C++:

\`\`\`cpp
#include <iostream>
#include <vector>
#include <numeric>

// Thuật toán tính tổng tối ưu với độ phức tạp O(N)
long long calculateOptimizedSum(const std::vector<int>& data) {
    long long total = 0;
    for (const auto& item : data) {
        if (item > 0) {
            total += static_cast<long long>(item) * item;
        }
    }
    return total;
}

int main() {
    std::vector<int> numbers = {1, 2, 3, 4, 5, 10, 20};
    long long result = calculateOptimizedSum(numbers);
    std::cout << "Ket qua toi uu hoa: " << result << std::endl;
    return 0;
}
\`\`\`

---

### 3. Hướng dẫn Tự học & Nhiệm vụ Sinh viên
- [x] Đọc kỹ phần chứng minh toán học và tự chạy thử đoạn mã mẫu trên IDE.
- [ ] Hoàn thành bài Quiz trắc nghiệm đánh giá quá trình cuối tuần (Tối thiểu 7.0/10).
- [ ] Đặt câu hỏi tại Diễn đàn Lớp học phần nếu có bất kỳ thắc mắc nào.
`;

  useEffect(() => {
    if (open) {
      if (existingMaterial) {
        setTitle(existingMaterial.title || '');
        setCategory(existingMaterial.category || 'MAIN_TEXTBOOK');
        setDurationMins(existingMaterial.duration_mins || existingMaterial.suggested_time_minutes || 45);
        setIsPublished(existingMaterial.is_published !== false);
        setReleaseDate(existingMaterial.release_date || null);
        setAntiSkipping(existingMaterial.anti_skipping !== false);
        setMinCompletionPct(existingMaterial.min_completion_pct || 80);
        setRichContent(existingMaterial.content_text || existingMaterial.rich_content || '');
      } else {
        setTitle('');
        setCategory('MAIN_TEXTBOOK');
        setDurationMins(45);
        setIsPublished(true);
        setReleaseDate(null);
        setAntiSkipping(true);
        setMinCompletionPct(80);
        setRichContent(DEFAULT_LECTURE_TEMPLATE);
      }
    }
  }, [open, existingMaterial]);

  // Tiện ích chèn văn bản tại vị trí con trỏ
  const insertTextAtCursor = (prefix, suffix = '', defaultPlaceholder = '') => {
    const el = textAreaRef.current?.resizableTextArea?.textArea;
    if (!el) {
      setRichContent(prev => prev + prefix + defaultPlaceholder + suffix);
      return;
    }

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const currentVal = el.value;
    const selected = currentVal.substring(start, end) || defaultPlaceholder;
    const nextVal = currentVal.substring(0, start) + prefix + selected + suffix + currentVal.substring(end);

    setRichContent(nextVal);

    setTimeout(() => {
      el.focus();
      const newPos = start + prefix.length + selected.length + suffix.length;
      el.setSelectionRange(newPos, newPos);
    }, 50);
  };

  // Lưu bài giảng vào Backend
  const handleSave = async () => {
    if (!title.trim()) {
      message.warning('Vui lòng nhập tên tiêu đề bài giảng!');
      return;
    }
    if (!richContent.trim()) {
      message.warning('Vui lòng nhập nội dung bài giảng!');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        id: existingMaterial ? existingMaterial.id : undefined,
        module_id: moduleId,
        section_id: sectionId,
        title: title.trim(),
        material_type: 'RICH_TEXT',
        category,
        duration_mins: Number(durationMins) || 45,
        suggested_time_minutes: Number(durationMins) || 45,
        content_text: richContent,
        rich_content: richContent,
        is_published: isPublished,
        release_date: releaseDate,
        anti_skipping: antiSkipping,
        min_completion_pct: Number(minCompletionPct) || 80,
        file_url: 'INTERNAL_RICH_TEXT'
      };

      const res = await apiClient.post('/academic/lms/materials', payload);
      if (res && res.success) {
        message.success(existingMaterial ? 'Đã cập nhật bài giảng học thuật thành công!' : 'Đã xuất bản bài giảng học thuật mới thành công!');
        if (onSaveSuccess) onSaveSuccess(res.data);
        onClose();
      } else {
        message.success('Đã lưu bài giảng vào đề cương tuần!');
        if (onSaveSuccess) onSaveSuccess(payload);
        onClose();
      }
    } catch (err) {
      message.error('Lỗi khi lưu bài giảng: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      width={1200}
      style={{ top: 20 }}
      title={
        <Row justify="space-between" align="middle" style={{ paddingRight: 24 }}>
          <Col>
            <Space>
              <EditOutlined style={{ color: '#2563eb', fontSize: 20 }} />
              <span style={{ fontSize: 16, fontWeight: 700, color: '#1e293b' }}>
                {existingMaterial ? 'Chỉnh Sửa Bài Giảng Học Thuật' : 'Biên Soạn Bài Giảng Học Thuật Trực Tiếp (KaTeX & Code)'}
              </span>
              <Tag color={isPublished ? 'success' : 'warning'}>
                {isPublished ? '✓ ĐÃ XUẤT BẢN' : '✎ BẢN NHÁP (DRAFT)'}
              </Tag>
            </Space>
          </Col>
          <Col>
            <Space>
              <Radio.Group
                value={viewMode}
                onChange={e => setViewMode(e.target.value)}
                size="small"
                buttonStyle="solid"
              >
                <Radio.Button value="EDIT"><EditOutlined /> Chỉ Soạn Thảo</Radio.Button>
                <Radio.Button value="SPLIT"><SplitCellsOutlined /> Chia Đôi Màn Hình</Radio.Button>
                <Radio.Button value="PREVIEW"><EyeOutlined /> Xem Trước Sinh Viên</Radio.Button>
              </Radio.Group>
            </Space>
          </Col>
        </Row>
      }
      footer={[
        <Button key="close" onClick={onClose}>
          Đóng Lại
        </Button>,
        <Button
          key="saveDraft"
          onClick={() => {
            setIsPublished(false);
            setTimeout(() => handleSave(), 100);
          }}
          loading={saving}
        >
          Lưu Dưới Dạng Bản Nháp
        </Button>,
        <Button
          key="submit"
          type="primary"
          icon={<SaveOutlined />}
          onClick={() => {
            setIsPublished(true);
            setTimeout(() => handleSave(), 100);
          }}
          loading={saving}
          style={{ background: '#2563eb', borderColor: '#2563eb', fontWeight: 600 }}
        >
          Xuất Bản Bài Giảng
        </Button>
      ]}
    >
      {/* 1. KHỐI CẤU HÌNH BÀI GIẢNG */}
      <Card size="small" style={{ background: '#f8fafc', marginBottom: 12, borderRadius: 8 }}>
        <Row gutter={16} align="middle">
          <Col xs={24} md={12}>
            <Text strong style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
              Tiêu Đề Bài Giảng Học Thuật: <span style={{ color: '#ef4444' }}>*</span>
            </Text>
            <Input
              placeholder="Ví dụ: Bài 3: Giải thuật Tối ưu Hóa Truy Vấn và Chỉ Mục CSDL"
              value={title}
              onChange={e => setTitle(e.target.value)}
              style={{ fontWeight: 600 }}
            />
          </Col>

          <Col xs={12} md={4}>
            <Text strong style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>Phân Loại:</Text>
            <Select value={category} onChange={val => setCategory(val)} style={{ width: '100%' }}>
              <Option value="MAIN_TEXTBOOK">📘 Giáo trình chính</Option>
              <Option value="REQUIRED_REF">📑 Tài liệu bắt buộc</Option>
              <Option value="SUPPLEMENTAL">🌐 Đọc thêm mở rộng</Option>
              <Option value="SOURCE_CODE">💻 Mã nguồn thực hành</Option>
              <Option value="LECTURE_SLIDE">📊 Tóm tắt bài học</Option>
            </Select>
          </Col>

          <Col xs={12} md={3}>
            <Text strong style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>Thời Lượng (Phút):</Text>
            <Input
              type="number"
              min={10}
              max={300}
              value={durationMins}
              onChange={e => setDurationMins(e.target.value)}
            />
          </Col>

          <Col xs={24} md={5}>
            <Text strong style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>Trạng Thái & Chống Tua:</Text>
            <Space wrap>
              <Switch
                checkedChildren="Xuất bản"
                unCheckedChildren="Bản nháp"
                checked={isPublished}
                onChange={checked => setIsPublished(checked)}
              />
              <Tooltip title="Yêu cầu sinh viên học tối thiểu 80% thời gian">
                <Switch
                  checkedChildren="Chống tua: BẬT"
                  unCheckedChildren="Chống tua: TẮT"
                  checked={antiSkipping}
                  onChange={checked => setAntiSkipping(checked)}
                  style={{ background: antiSkipping ? '#059669' : undefined }}
                />
              </Tooltip>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 2. THANH CÔNG CỤ SOẠN THẢO NHANH (RICH FORMATTING TOOLBAR) */}
      {(viewMode === 'EDIT' || viewMode === 'SPLIT') && (
        <div
          style={{
            background: '#eff6ff',
            padding: '8px 12px',
            borderRadius: '8px 8px 0 0',
            border: '1px solid #bfdbfe',
            borderBottom: 'none'
          }}
        >
          <Space wrap size={4}>
            {/* Văn bản thường */}
            <Tooltip title="In đậm (Bold)"><Button size="small" icon={<BoldOutlined />} onClick={() => insertTextAtCursor('**', '**', 'văn bản in đậm')} /></Tooltip>
            <Tooltip title="In nghiêng (Italic)"><Button size="small" icon={<ItalicOutlined />} onClick={() => insertTextAtCursor('*', '*', 'văn bản in nghiêng')} /></Tooltip>
            <Tooltip title="Tiêu đề H1"><Button size="small" onClick={() => insertTextAtCursor('\n# ', '\n', 'Tiêu đề lớn')}>H1</Button></Tooltip>
            <Tooltip title="Tiêu đề H2"><Button size="small" onClick={() => insertTextAtCursor('\n## ', '\n', 'Tiêu đề vừa')}>H2</Button></Tooltip>
            <Tooltip title="Tiêu đề H3"><Button size="small" onClick={() => insertTextAtCursor('\n### ', '\n', 'Tiêu đề nhỏ')}>H3</Button></Tooltip>
            <Tooltip title="Danh sách gạch đầu dòng"><Button size="small" icon={<UnorderedListOutlined />} onClick={() => insertTextAtCursor('\n- ', '\n', 'Mục danh sách')} /></Tooltip>
            <Tooltip title="Danh sách đánh số"><Button size="small" icon={<OrderedListOutlined />} onClick={() => insertTextAtCursor('\n1. ', '\n', 'Mục thứ tự')} /></Tooltip>
            <Tooltip title="Chèn Bảng mẫu"><Button size="small" icon={<TableOutlined />} onClick={() => insertTextAtCursor('\n| Cột 1 | Cột 2 | Cột 3 |\n| :--- | :--- | :--- |\n| Giá trị A | Giá trị B | Giá trị C |\n')} /></Tooltip>

            <Divider type="vertical" style={{ margin: '0 4px', height: 20 }} />

            {/* Công thức Toán KaTeX */}
            <Tooltip title="Chèn công thức Toán Inline ($...$)">
              <Button size="small" icon={<FunctionOutlined />} style={{ color: '#7c3aed', borderColor: '#c4b5fd' }} onClick={() => insertTextAtCursor('$', '$', 'f(x) = x^2')}>
                Toán $...$
              </Button>
            </Tooltip>
            <Tooltip title="Chèn Khối công thức Toán lớn ($$...$$)">
              <Button size="small" icon={<FunctionOutlined />} style={{ color: '#7c3aed', borderColor: '#c4b5fd' }} onClick={() => insertTextAtCursor('\n$$\n\\int_{a}^{b} f(x) dx = F(b) - F(a)\n$$\n')}>
                Khối Toán $$
              </Button>
            </Tooltip>
            {/* Ký hiệu toán học nhanh */}
            <Button size="small" onClick={() => insertTextAtCursor('\\alpha')}>$\alpha$</Button>
            <Button size="small" onClick={() => insertTextAtCursor('\\beta')}>$\beta$</Button>
            <Button size="small" onClick={() => insertTextAtCursor('\\pi')}>$\pi$</Button>
            <Button size="small" onClick={() => insertTextAtCursor('\\sqrt{', '}', 'x')}>{"$\\sqrt{x}$"}</Button>
            <Button size="small" onClick={() => insertTextAtCursor('\\frac{', '}{b}', 'a')}>{"$\\frac{a}{b}$"}</Button>
            <Button size="small" onClick={() => insertTextAtCursor('\\sum_{i=1}^{n}')}>$\sum$</Button>
            <Button size="small" onClick={() => insertTextAtCursor('\\le')}>$\le$</Button>
            <Button size="small" onClick={() => insertTextAtCursor('\\ge')}>$\ge$</Button>
            <Button size="small" onClick={() => insertTextAtCursor('\\ne')}>$\ne$</Button>
            <Button size="small" onClick={() => insertTextAtCursor('\\infty')}>$\infty$</Button>

            <Divider type="vertical" style={{ margin: '0 4px', height: 20 }} />

            {/* Khối Mã Nguồn (Code Blocks) */}
            <Tooltip title="Chèn khối mã nguồn C++">
              <Button size="small" icon={<CodeOutlined />} style={{ color: '#0958d9', borderColor: '#91caff' }} onClick={() => insertTextAtCursor('\n```cpp\n// Đoạn mã C++ minh họa\nint main() {\n    return 0;\n}\n```\n')}>
                C++
              </Button>
            </Tooltip>
            <Tooltip title="Chèn khối mã nguồn Python">
              <Button size="small" icon={<CodeOutlined />} style={{ color: '#0958d9', borderColor: '#91caff' }} onClick={() => insertTextAtCursor('\n```python\n# Đoạn mã Python minh họa\ndef main():\n    print("Hello LMS")\n```\n')}>
                Python
              </Button>
            </Tooltip>
            <Tooltip title="Chèn khối truy vấn SQL">
              <Button size="small" icon={<CodeOutlined />} style={{ color: '#0958d9', borderColor: '#91caff' }} onClick={() => insertTextAtCursor('\n```sql\nSELECT student_code, full_name, gpa\nFROM academic_students\nWHERE status = \'ACTIVE\';\n```\n')}>
                SQL
              </Button>
            </Tooltip>

            <Divider type="vertical" style={{ margin: '0 4px', height: 20 }} />

            {/* Khối Callout Sư Phạm */}
            <Tooltip title="Khối Lưu ý Quan trọng">
              <Button size="small" icon={<AlertOutlined />} style={{ color: '#b91c1c' }} onClick={() => insertTextAtCursor('\n> [!IMPORTANT]\n> **Lưu ý quan trọng:** ')}>
                Important
              </Button>
            </Tooltip>
            <Tooltip title="Khối Ghi chú học phần">
              <Button size="small" icon={<InfoCircleOutlined />} style={{ color: '#1d4ed8' }} onClick={() => insertTextAtCursor('\n> [!NOTE]\n> **Ghi chú lý thuyết:** ')}>
                Note
              </Button>
            </Tooltip>
            <Tooltip title="Khối Mẹo làm bài">
              <Button size="small" icon={<BulbOutlined />} style={{ color: '#b45309' }} onClick={() => insertTextAtCursor('\n> [!TIP]\n> **Mẹo giải quyết bài toán:** ')}>
                Tip
              </Button>
            </Tooltip>
          </Space>
        </div>
      )}

      {/* 3. KHU VỰC CHIA ĐÔI SOẠN THẢO & XEM TRƯỚC (SPLIT-SCREEN) */}
      <Row gutter={12}>
        {/* VÙNG SOẠN THẢO */}
        {(viewMode === 'EDIT' || viewMode === 'SPLIT') && (
          <Col span={viewMode === 'SPLIT' ? 12 : 24}>
            <TextArea
              ref={textAreaRef}
              value={richContent}
              onChange={e => setRichContent(e.target.value)}
              placeholder="Nhập nội dung bài giảng tại đây (hỗ trợ Markdown, công thức Toán LaTeX và Khối Code)..."
              rows={18}
              style={{
                fontFamily: 'Consolas, "Fira Code", monospace',
                fontSize: 13,
                lineHeight: 1.6,
                borderRadius: '0 0 8px 8px',
                border: '1px solid #bfdbfe'
              }}
            />
          </Col>
        )}

        {/* VÙNG XEM TRƯỚC TỨC THỜI (LIVE PREVIEW) */}
        {(viewMode === 'PREVIEW' || viewMode === 'SPLIT') && (
          <Col span={viewMode === 'SPLIT' ? 12 : 24}>
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 8,
                padding: '16px 20px',
                height: 440,
                overflowY: 'auto'
              }}
            >
              <div style={{ marginBottom: 12, borderBottom: '1px solid #e2e8f0', paddingBottom: 8 }}>
                <Space>
                  <EyeOutlined style={{ color: '#059669' }} />
                  <strong style={{ color: '#0f172a' }}>👁️ Xem Trước Hiển Thị Của Sinh Viên:</strong>
                  {title && <Tag color="blue">{title}</Tag>}
                </Space>
              </div>

              <AcademicContentRenderer content={richContent} />
            </div>
          </Col>
        )}
      </Row>
    </Modal>
  );
}

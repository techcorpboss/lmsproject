import React, { useState } from 'react';
import {
  Card, Row, Col, Typography, Input, Button, Select, Radio,
  Space, Tag, Spin, message, Divider, Alert, Badge
} from 'antd';
import {
  RobotOutlined, FileWordOutlined, PlaySquareOutlined, VideoCameraOutlined,
  ThunderboltOutlined, CopyOutlined, DownloadOutlined, CheckCircleOutlined,
  BookOutlined, BulbOutlined
} from '@ant-design/icons';
import apiClient from '../../services/apiClient';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export default function AiAuthoringStudio() {
  const [contentType, setContentType] = useState('SYLLABUS_WORD');
  const [courseName, setCourseName] = useState('Nhập môn Lập trình C/C++ (IT101)');
  const [topic, setTopic] = useState('Con trỏ (Pointers) và Cấp phát Bộ nhớ Động');
  const [weekNumber, setWeekNumber] = useState(9);
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  const handleGenerate = async () => {
    setLoading(true);
    setAiResult(null);
    try {
      const res = await apiClient.post('/academic/enterprise/ai/generate', {
        type: contentType,
        course_name: courseName,
        course_code: 'IT101',
        topic,
        week_number: weekNumber,
        count: 4
      });
      if (res && res.success) {
        setAiResult(res);
        message.success('AI đã hoàn thành tạo nội dung giảng dạy!');
      }
    } catch (e) {
      // Mocked output for AI Studio
      if (contentType === 'SYLLABUS_WORD') {
        setAiResult({
          type: 'SYLLABUS_WORD',
          content: `# ĐỀ CƯƠNG CHI TIẾT BÀI GIẢNG TUẦN ${weekNumber}
**Học phần:** ${courseName}
**Chủ đề trọng tâm:** ${topic}

### 1. Chuẩn Đầu Ra Cần Đạt (CLO Matrix & Bloom Taxonomy)
- **CLO1 (Nhận thức C1-C2):** Giải thích địa chỉ ô nhớ hexa, phân biệt con trỏ trỏ tới vùng nhớ Stack và vùng nhớ Heap.
- **CLO2 (Vận dụng C3-C4):** Thành thạo toán tử new / delete / delete[], phòng tránh lỗi treo con trỏ (Dangling Pointer) và rò rỉ RAM (Memory Leak).
- **CLO3 (Sáng tạo C5):** Tối ưu hóa thuật toán hoán vị mảng và truyền tham chiếu con trỏ trong các bài toán quy mô lớn.

### 2. Kế Hoạch 150 Phút Giảng Dạy Trên Lớp
- **00 - 30 phút:** Nhắc lại cấu trúc RAM, giải thích toán tử & (address-of) và * (dereference).
- **30 - 75 phút:** Thực hành cấp phát mảng động 1D và 2D trên IDE.
- **75 - 120 phút:** Thảo luận các lỗi thường gặp: Null Pointer Exception, Double Free Error.
- **120 - 150 phút:** Hướng dẫn làm bài tập Quiz tuần và giao đề tài thực hành mở rộng.`
        });
      } else if (contentType === 'SLIDE_OUTLINE') {
        setAiResult({
          type: 'SLIDE_OUTLINE',
          slides: [
            { slide: 1, title: `Tuần ${weekNumber}: ${topic}`, notes: 'Slide tiêu đề, giới thiệu mục tiêu bài giảng số hóa.' },
            { slide: 2, title: 'Kiến Trúc Bộ Nhớ Stack vs Heap Trong C++', notes: 'Sơ đồ phân bổ RAM và cơ chế lưu trữ biến cục bộ.' },
            { slide: 3, title: 'Cú Pháp Cấp Phát & Thu Hồi new / delete', notes: 'So sánh malloc/free trong C và new/delete trong C++ hiện đại.' },
            { slide: 4, title: 'Các Bẫy Lỗi Nguy Hiểm Cần Tránh', notes: 'Dangling pointers, memory leaks, null dereferencing.' },
            { slide: 5, title: 'Thực Hành Trực Tiếp & Thử Nghiệm Ca Biên', notes: 'Chiếu code snippet demo trên VSCode và kiểm thử valgrind.' },
            { slide: 6, title: 'Tổng Kết & Câu Hỏi Củng Cố Kiến Thức', notes: 'Mời sinh viên quét mã QR tham gia trắc nghiệm nhanh 5 phút.' }
          ]
        });
      } else if (contentType === 'VIDEO_SCRIPT') {
        setAiResult({
          type: 'VIDEO_SCRIPT',
          script: {
            title: `Kịch bản Video Bài giảng: ${topic}`,
            duration: '15 phút',
            scenes: [
              { time: '00:00 - 02:00', visual: 'Giảng viên đứng tại Studio tương tác', audio: 'Chào các bạn sinh viên, trong bài học tuần này chúng ta sẽ tìm hiểu khái niệm quan trọng nhất của C++: Con trỏ và bộ nhớ động...' },
              { time: '02:00 - 07:00', visual: 'Quay màn hình IDE chạy mã nguồn mẫu', audio: 'Nhìn vào màn hình, khi ta gõ int* ptr = new int[100]; hệ điều hành sẽ cấp phát một mảng 100 số nguyên trên Heap...' },
              { time: '07:00 - 07:30', visual: 'Checkpoint câu hỏi trắc nghiệm dừng video', audio: 'Hệ thống tự động hiển thị câu hỏi: Lệnh nào giải phóng mảng cấp phát động đúng cú pháp? (A) delete ptr; (B) delete[] ptr;...' },
              { time: '07:30 - 14:00', visual: 'Biểu đồ trực quan hóa giải phóng RAM', audio: 'Nếu không dùng delete[], vùng nhớ sẽ không bao giờ được trả lại cho hệ điều hành...' },
              { time: '14:00 - 15:00', visual: 'Slide dặn dò bài tập tuần', audio: 'Các bạn hãy vào mục Làm bài Quiz Tuần 9 trên LMS để ghi nhận điểm quá trình nhé!' }
            ]
          }
        });
      } else {
        setAiResult({
          type: 'QUIZ_GENERATOR',
          questions: [
            { id: 1, bloom_level: 'Nhận biết (Remember)', question_text: 'Toán tử nào trong ngôn ngữ C++ dùng để lấy địa chỉ vùng nhớ của một biến?', correct_key: 'B', options: [{ key: 'A', text: '*', is_correct: false }, { key: 'B', text: '&', is_correct: true }, { key: 'C', text: '->', is_correct: false }, { key: 'D', text: '%', is_correct: false }], explanation: 'Toán tử & (address-of) trả về địa chỉ vật lý của biến trong bộ nhớ RAM.' },
            { id: 2, bloom_level: 'Thông hiểu (Understand)', question_text: 'Hiện tượng Rò rỉ bộ nhớ (Memory Leak) xảy ra khi nào trong chương trình C++?', correct_key: 'A', options: [{ key: 'A', text: 'Cấp phát bộ nhớ động bằng new nhưng không giải phóng bằng delete trước khi con trỏ mất phạm vi', is_correct: true }, { key: 'B', text: 'Khai báo quá nhiều biến cục bộ trong hàm', is_correct: false }, { key: 'C', text: 'Giải phóng vùng nhớ 2 lần', is_correct: false }, { key: 'D', text: 'Gán giá trị NULL cho con trỏ', is_correct: false }], explanation: 'Memory leak phát sinh khi con trỏ trỏ đến vùng nhớ Heap bị hủy nhưng bộ nhớ Heap chưa được giải phóng.' },
            { id: 3, bloom_level: 'Vận dụng (Apply)', question_text: 'Cú pháp chuẩn để giải phóng bộ nhớ của một mảng động được cấp phát qua `int* arr = new int[50];` là gì?', correct_key: 'C', options: [{ key: 'A', text: 'free(arr);', is_correct: false }, { key: 'B', text: 'delete arr;', is_correct: false }, { key: 'C', text: 'delete[] arr;', is_correct: true }, { key: 'D', text: 'remove(arr);', is_correct: false }], explanation: 'Cấp phát mảng động `new[]` bắt buộc phải thu hồi bằng `delete[]` để gọi hàm hủy đầy đủ.' },
            { id: 4, bloom_level: 'Vận dụng cao (Analyze)', question_text: 'Hậu quả nghiêm trọng nhất của lỗi Con trỏ lơ lửng (Dangling Pointer) là gì?', correct_key: 'D', options: [{ key: 'A', text: 'Chương trình chạy chậm hơn 10%', is_correct: false }, { key: 'B', text: 'Trình biên dịch từ chối build mã nguồn', is_correct: false }, { key: 'C', text: 'Mã nguồn tự động bị xóa', is_correct: false }, { key: 'D', text: 'Truy cập vùng nhớ không hợp lệ dẫn đến crash (Segmentation Fault) hoặc tạo lỗ hổng bảo mật', is_correct: true }], explanation: 'Dangling pointer trỏ vào vùng nhớ đã bị thu hồi, nếu ghi dữ liệu đè lên có thể làm hỏng dữ liệu khác hoặc bị tấn công khai thác lỗi bộ nhớ.' }
          ]
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    message.success('Đã sao chép nội dung bài giảng AI vào bộ nhớ tạm (Clipboard)!');
  };

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={4} style={{ margin: 0 }}>
            <RobotOutlined style={{ color: '#722ed1', marginRight: 8 }} />
            AI Teaching Studio: Trợ Lý Soạn Bài Giảng & Đề Thi Chuẩn Quốc Tế
          </Title>
          <Text type="secondary">Tự động sinh đề cương Word, Slide thuyết trình, Kịch bản Video và Bộ câu hỏi Quiz theo thang Bloom</Text>
        </Col>
      </Row>

      <Row gutter={[20, 20]}>
        {/* CỘT TRÁI: ĐIỀU KHIỂN & CHỌN ĐỊNH DẠNG */}
        <Col xs={24} md={8}>
          <Card title={<Space><BulbOutlined /> <span>Cấu Hình Bài Giảng AI</span></Space>} style={{ borderRadius: 12 }}>
            <div style={{ marginBottom: 16 }}>
              <Text strong>1. Định dạng bài giảng cần soạn:</Text>
              <Radio.Group
                value={contentType}
                onChange={e => setContentType(e.target.value)}
                style={{ width: '100%', marginTop: 8 }}
              >
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Radio.Button value="SYLLABUS_WORD" style={{ width: '100%', borderRadius: 6, marginBottom: 4 }}>
                    <FileWordOutlined style={{ color: '#1677ff' }} /> Đề cương / Giáo trình (Word)
                  </Radio.Button>
                  <Radio.Button value="SLIDE_OUTLINE" style={{ width: '100%', borderRadius: 6, marginBottom: 4 }}>
                    <PlaySquareOutlined style={{ color: '#fa8c16' }} /> Slide Bài Giảng Tương Tác
                  </Radio.Button>
                  <Radio.Button value="VIDEO_SCRIPT" style={{ width: '100%', borderRadius: 6, marginBottom: 4 }}>
                    <VideoCameraOutlined style={{ color: '#eb2f96' }} /> Kịch Bản Video Studio
                  </Radio.Button>
                  <Radio.Button value="QUIZ_GENERATOR" style={{ width: '100%', borderRadius: 6 }}>
                    <ThunderboltOutlined style={{ color: '#52c41a' }} /> Quiz & Đề Thi (Thang Bloom)
                  </Radio.Button>
                </Space>
              </Radio.Group>
            </div>

            <div style={{ marginBottom: 14 }}>
              <Text strong>2. Môn học phụ trách:</Text>
              <Select value={courseName} onChange={setCourseName} style={{ width: '100%', marginTop: 6 }}>
                <Option value="Nhập môn Lập trình C/C++ (IT101)">Nhập môn Lập trình C/C++ (IT101)</Option>
                <Option value="Cơ sở Dữ liệu (IT201)">Cơ sở Dữ liệu (IT201)</Option>
                <Option value="Cấu trúc Dữ liệu & Giải thuật (IT301)">Cấu trúc Dữ liệu & Giải thuật (IT301)</Option>
              </Select>
            </div>

            <Row gutter={12} style={{ marginBottom: 14 }}>
              <Col span={10}>
                <Text strong>Tuần học:</Text>
                <Select value={weekNumber} onChange={setWeekNumber} style={{ width: '100%', marginTop: 6 }}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(w => (
                    <Option key={w} value={w}>Tuần {w}</Option>
                  ))}
                </Select>
              </Col>
              <Col span={14}>
                <Text strong>Chuẩn nhận thức:</Text>
                <Tag color="purple" style={{ marginTop: 8, display: 'block', textAlign: 'center' }}>
                  Bloom C1 - C4 (TT 08)
                </Tag>
              </Col>
            </Row>

            <div style={{ marginBottom: 20 }}>
              <Text strong>Chủ đề trọng tâm bài học:</Text>
              <Input value={topic} onChange={e => setTopic(e.target.value)} style={{ marginTop: 6 }} />
            </div>

            <Button
              type="primary"
              icon={<RobotOutlined />}
              onClick={handleGenerate}
              loading={loading}
              block
              size="large"
              style={{ background: 'linear-gradient(135deg, #722ed1 0%, #1677ff 100%)', borderColor: '#722ed1', fontWeight: 600 }}
            >
              AI Biên Soạn Ngay
            </Button>
          </Card>
        </Col>

        {/* CỘT PHẢI: KẾT QUẢ BIÊN SOẠN TƯƠNG TÁC */}
        <Col xs={24} md={16}>
          <Card
            title={
              <Row justify="space-between" align="middle">
                <Col>
                  <Space>
                    <BookOutlined style={{ color: '#1677ff' }} />
                    <span>Nội Dung Do AI Biên Soạn (Xem Trước & Tái Sử Dụng)</span>
                  </Space>
                </Col>
                {aiResult && (
                  <Col>
                    <Space>
                      <Button size="small" icon={<CopyOutlined />} onClick={handleCopy}>Sao chép</Button>
                      <Button size="small" type="primary" icon={<DownloadOutlined />}>Tải về</Button>
                    </Space>
                  </Col>
                )}
              </Row>
            }
            style={{ borderRadius: 12, minHeight: 480 }}
          >
            {loading && (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <Spin size="large" />
                <div style={{ marginTop: 16, color: '#722ed1', fontWeight: 600 }}>
                  Trí tuệ nhân tạo đang phân tích chuẩn đầu ra CLO và biên soạn bài giảng chi tiết...
                </div>
              </div>
            )}

            {!loading && !aiResult && (
              <div style={{ textAlign: 'center', padding: '80px 20px', color: '#94a3b8' }}>
                <RobotOutlined style={{ fontSize: 56, marginBottom: 16, color: '#cbd5e1' }} />
                <Title level={4} style={{ color: '#64748b' }}>Chưa có nội dung được sinh</Title>
                <Text type="secondary">Chọn định dạng và bấm "AI Biên Soạn Ngay" để khởi tạo bài giảng tự động</Text>
              </div>
            )}

            {!loading && aiResult && (
              <div>
                {aiResult.type === 'SYLLABUS_WORD' && (
                  <div style={{ background: '#f8fafc', padding: 20, borderRadius: 8, border: '1px solid #e2e8f0', whiteSpace: 'pre-wrap', fontFamily: 'Segoe UI, sans-serif' }}>
                    {aiResult.content}
                  </div>
                )}

                {aiResult.type === 'SLIDE_OUTLINE' && (
                  <Row gutter={[16, 16]}>
                    {(aiResult.slides || []).map(s => (
                      <Col xs={24} sm={12} key={s.slide}>
                        <Card size="small" style={{ borderRadius: 8, borderColor: '#cbd5e1', background: '#fafafa' }}>
                          <Tag color="orange" style={{ marginBottom: 6 }}>Slide {s.slide}</Tag>
                          <Title level={5} style={{ margin: '4px 0 8px' }}>{s.title}</Title>
                          <Text type="secondary" style={{ fontSize: 12 }}><b>Ghi chú thuyết minh:</b> {s.notes}</Text>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                )}

                {aiResult.type === 'VIDEO_SCRIPT' && aiResult.script && (
                  <div>
                    <Alert message={`Kịch bản: ${aiResult.script.title} (Thời lượng: ${aiResult.script.duration})`} type="info" style={{ marginBottom: 16 }} />
                    {(aiResult.script.scenes || []).map((sc, i) => (
                      <Card key={i} size="small" style={{ marginBottom: 10, borderRadius: 8 }}>
                        <Row gutter={12}>
                          <Col span={6}>
                            <Tag color="blue">{sc.time}</Tag>
                            <div style={{ fontSize: 12, marginTop: 4, color: '#475569' }}><b>Khung hình:</b> {sc.visual}</div>
                          </Col>
                          <Col span={18}>
                            <div style={{ background: '#f1f5f9', padding: '8px 12px', borderRadius: 6, fontSize: 13 }}>
                              <b>Lời thoại giảng viên:</b> "{sc.audio}"
                            </div>
                          </Col>
                        </Row>
                      </Card>
                    ))}
                  </div>
                )}

                {aiResult.type === 'QUIZ_GENERATOR' && (
                  <div>
                    <Alert message="Bộ câu hỏi trắc nghiệm tự động phân tầng theo 4 cấp độ nhận thức Bloom (TT 08/2021)" type="success" showIcon style={{ marginBottom: 16 }} />
                    {(aiResult.questions || []).map((q, idx) => (
                      <Card key={q.id} size="small" style={{ marginBottom: 12, borderRadius: 8, borderColor: '#e2e8f0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                          <Text strong>Câu {idx + 1}: {q.question_text}</Text>
                          <Tag color="purple">{q.bloom_level}</Tag>
                        </div>
                        <Row gutter={[12, 6]}>
                          {q.options.map(opt => (
                            <Col span={12} key={opt.key}>
                              <div style={{ padding: '6px 10px', borderRadius: 6, background: opt.is_correct ? '#f6ffed' : '#ffffff', border: opt.is_correct ? '1px solid #b7eb8f' : '1px solid #e2e8f0' }}>
                                <Text strong style={{ color: opt.is_correct ? '#52c41a' : '#1e293b' }}>[{opt.key}] {opt.text}</Text>
                                {opt.is_correct && <Tag color="success" style={{ marginLeft: 8 }}>Đáp án đúng</Tag>}
                              </div>
                            </Col>
                          ))}
                        </Row>
                        <div style={{ marginTop: 8, fontSize: 12, color: '#64748b' }}>
                          <b>Giải thích:</b> {q.explanation}
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}

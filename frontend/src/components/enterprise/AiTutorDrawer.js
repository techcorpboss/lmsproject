// frontend/src/components/enterprise/AiTutorDrawer.js
import React, { useState, useEffect, useRef } from 'react';
import {
  Drawer, Button, Input, Space, Typography, Card, Avatar,
  Select, Spin, message, Tag
} from 'antd';
import {
  RobotOutlined, SendOutlined, UserOutlined,
  ClearOutlined
} from '@ant-design/icons';
import apiClient from '../../services/apiClient';
import AcademicContentRenderer from '../common/AcademicContentRenderer';

const { Text } = Typography;
const { Option } = Select;

export default function AiTutorDrawer({ open, onClose, currentUser, currentCourseCode = 'IT101', currentWeek = 1 }) {
  const [selectedCourse, setSelectedCourse] = useState(currentCourseCode);
  const [selectedWeek, setSelectedWeek] = useState(currentWeek);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `Xin chào ${currentUser?.full_name || 'bạn'}! Tôi là **Gia Sư AI Học Thuật 24/7** bám sát chương trình đào tạo của Trường ĐH Công nghệ TechCorp. Tôi có thể hỗ trợ bạn giải đáp thắc mắc về giáo trình 15 tuần, giải thích thuật toán, phân tích lỗi mã nguồn hoặc viết công thức toán học.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestedPrompts, setSuggestedPrompts] = useState([]);
  const messagesEndRef = useRef(null);

  // Cuộn xuống tin nhắn mới nhất
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Tải danh mục câu hỏi gợi ý theo môn và tuần
  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const res = await apiClient.get('/academic/enterprise/ai-tutor/prompts', {
          params: { courseCode: selectedCourse, week: selectedWeek }
        });
        if (res && res.success && res.data) {
          setSuggestedPrompts(res.data.suggestedQuestions || []);
        }
      } catch (e) {
        setSuggestedPrompts([
          "Tóm tắt kiến thức trọng tâm của tuần học này?",
          "Cho ví dụ code minh họa về chủ đề tuần này?",
          "Các lỗi thường gặp và cách khắc phục?"
        ]);
      }
    };
    fetchPrompts();
  }, [selectedCourse, selectedWeek]);

  // Gửi câu hỏi cho Gia sư AI
  const handleSendMessage = async (textToSend) => {
    const question = (textToSend || inputText).trim();
    if (!question) return;

    const userMsg = {
      sender: 'user',
      text: question,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const res = await apiClient.post('/academic/enterprise/ai-tutor/ask', {
        courseCode: selectedCourse,
        week: selectedWeek,
        question,
        studentId: currentUser?.id || 1,
        studentName: currentUser?.full_name || 'Sinh viên'
      });

      if (res && res.success && res.data) {
        const aiResponse = res.data;
        let responseContent = aiResponse.answer;

        if (aiResponse.mathLatex) {
          responseContent += `\n\n$$\n${aiResponse.mathLatex}\n$$`;
        }

        if (aiResponse.codeSnippet) {
          responseContent += `\n\n\`\`\`cpp\n${aiResponse.codeSnippet}\n\`\`\``;
        }

        if (aiResponse.referenceBook) {
          responseContent += `\n\n> 📖 *Trích dẫn:* ${aiResponse.referenceBook}`;
        }

        const aiMsg = {
          sender: 'ai',
          text: responseContent,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, aiMsg]);
      } else {
        message.error(res?.message || 'Không thể kết nối với Gia sư AI.');
      }
    } catch (err) {
      const errorMsg = {
        sender: 'ai',
        text: '⚠️ Xin lỗi bạn, hiện tại đường truyền tới máy chủ AI đang bận. Vui lòng thử lại sau giây lát!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        sender: 'ai',
        text: `Đã làm mới phiên hỏi đáp. Bạn có thể chọn môn học và tuần học để đặt câu hỏi mới cho Gia Sư AI.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <Drawer
      title={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <Space>
            <Avatar icon={<RobotOutlined />} style={{ backgroundColor: '#7c3aed' }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>Gia Sư AI Học Thuật 24/7 (RAG Tutor)</div>
              <div style={{ fontSize: 11, color: '#10b981', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
                Trực tuyến • Bám sát Đề cương 15 Tuần
              </div>
            </div>
          </Space>
          <Button size="small" icon={<ClearOutlined />} onClick={clearChat}>
            Xóa đoạn chat
          </Button>
        </div>
      }
      placement="right"
      width={window.innerWidth > 768 ? 560 : '100%'}
      onClose={onClose}
      open={open}
      styles={{ body: { padding: '12px 16px', display: 'flex', flexDirection: 'column', height: '100%', background: '#f8fafc' } }}
    >
      {/* THANH CHỌN HỌC PHẦN & TUẦN HỌC */}
      <Card size="small" style={{ marginBottom: 12, borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <Space wrap style={{ width: '100%', justifyContent: 'space-between' }}>
          <div>
            <Text type="secondary" style={{ fontSize: 11, display: 'block' }}>Học Phần Đang Học:</Text>
            <Select
              value={selectedCourse}
              onChange={setSelectedCourse}
              style={{ width: 220 }}
              size="small"
            >
              <Option value="IT101">IT101 - Lập trình C/C++</Option>
              <Option value="IT201">IT201 - Cơ sở Dữ liệu</Option>
              <Option value="MATH101">MATH101 - Toán Cao Cấp 1</Option>
            </Select>
          </div>
          <div>
            <Text type="secondary" style={{ fontSize: 11, display: 'block' }}>Tuần Giáo Trình:</Text>
            <Select
              value={selectedWeek}
              onChange={setSelectedWeek}
              style={{ width: 140 }}
              size="small"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(w => (
                <Option key={w} value={w}>Tuần {w}</Option>
              ))}
            </Select>
          </div>
        </Space>
      </Card>

      {/* VÙNG HIỂN THỊ TIN NHẮN */}
      <div style={{ flex: 1, overflowY: 'auto', paddingRight: 4, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.map((m, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              flexDirection: m.sender === 'user' ? 'row-reverse' : 'row',
              gap: 8,
              alignItems: 'flex-start'
            }}
          >
            <Avatar
              size="small"
              icon={m.sender === 'user' ? <UserOutlined /> : <RobotOutlined />}
              style={{
                backgroundColor: m.sender === 'user' ? '#1677ff' : '#7c3aed',
                marginTop: 4,
                flexShrink: 0
              }}
            />
            <div
              style={{
                maxWidth: '85%',
                padding: '10px 14px',
                borderRadius: 12,
                background: m.sender === 'user' ? '#1677ff' : '#ffffff',
                color: m.sender === 'user' ? '#ffffff' : '#1e293b',
                boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
                border: m.sender === 'user' ? 'none' : '1px solid #e2e8f0',
                wordBreak: 'break-word'
              }}
            >
              {m.sender === 'user' ? (
                <div style={{ whiteSpace: 'pre-wrap', fontSize: 13 }}>{m.text}</div>
              ) : (
                <div style={{ fontSize: 13 }}>
                  <AcademicContentRenderer content={m.text} />
                </div>
              )}
              <div
                style={{
                  fontSize: 10,
                  marginTop: 4,
                  textAlign: m.sender === 'user' ? 'right' : 'left',
                  color: m.sender === 'user' ? 'rgba(255,255,255,0.7)' : '#94a3b8'
                }}
              >
                {m.timestamp}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Avatar size="small" icon={<RobotOutlined />} style={{ backgroundColor: '#7c3aed' }} />
            <div style={{ padding: '8px 12px', background: '#fff', borderRadius: 8, border: '1px solid #e2e8f0' }}>
              <Spin size="small" /> <Text type="secondary" style={{ fontSize: 12, marginLeft: 8 }}>Gia sư AI đang tra cứu giáo trình và soạn câu trả lời...</Text>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* CÂU HỎI GỢI Ý NHANH (PROMPTS) */}
      {suggestedPrompts.length > 0 && (
        <div style={{ marginTop: 10, marginBottom: 8 }}>
          <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4, fontWeight: 600 }}>
            💡 Gợi ý câu hỏi tuần {selectedWeek}:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {suggestedPrompts.map((q, qIdx) => (
              <Tag
                key={qIdx}
                color="geekblue"
                style={{ cursor: 'pointer', borderRadius: 6, margin: 0, padding: '2px 8px', fontSize: 11 }}
                onClick={() => handleSendMessage(q)}
              >
                {q}
              </Tag>
            ))}
          </div>
        </div>
      )}

      {/* THANH NHẬP LIỆU */}
      <div style={{ marginTop: 8, background: '#fff', padding: 8, borderRadius: 8, border: '1px solid #e2e8f0' }}>
        <Input.TextArea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Đặt câu hỏi về bài giảng, thuật toán, công thức toán hoặc mã nguồn..."
          autoSize={{ minRows: 2, maxRows: 4 }}
          onPressEnter={(e) => {
            if (!e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          disabled={loading}
          style={{ border: 'none', boxShadow: 'none', resize: 'none' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6, paddingTop: 6, borderTop: '1px solid #f1f5f9' }}>
          <Text type="secondary" style={{ fontSize: 11 }}>Nhấn <b>Enter</b> để gửi, <b>Shift+Enter</b> xuống dòng</Text>
          <Button
            type="primary"
            icon={<SendOutlined />}
            size="small"
            style={{ backgroundColor: '#7c3aed', borderColor: '#7c3aed' }}
            onClick={() => handleSendMessage()}
            loading={loading}
          >
            Gửi câu hỏi
          </Button>
        </div>
      </div>
    </Drawer>
  );
}

// frontend/src/components/common/AccessibilityToolbar.js
// Bộ Công Cụ Trợ Năng Tiếp Cận Toàn Cầu Chuẩn Quốc Tế W3C WCAG 2.1 Level AA
// Hỗ trợ Người yếu thị lực, Người khiếm thị, Người khó đọc (Dyslexia) & Người khuyết tật vận động
import React, { useState, useEffect } from 'react';
import {
  Drawer, Button, Slider, Radio, Switch, Space, Typography,
  Divider, Tooltip, message, Card, Row, Col, Tag
} from 'antd';
import {
  EyeOutlined, SoundOutlined, FontSizeOutlined, BgColorsOutlined,
  ReloadOutlined, CloseOutlined, PlayCircleOutlined, PauseCircleOutlined,
  StopOutlined, CheckCircleOutlined, InfoCircleOutlined, KeyOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

export default function AccessibilityToolbar() {
  const [isOpen, setIsOpen] = useState(false);

  // Trạng thái Trợ năng (A11y State)
  const [contrastMode, setContrastMode] = useState('DEFAULT'); // 'DEFAULT', 'YELLOW_BLACK', 'WHITE_BLACK', 'GRAYSCALE'
  const [fontSizeScale, setFontSizeScale] = useState(100); // 100% -> 175%
  const [lineSpacing, setLineSpacing] = useState(false); // standard vs expanded
  const [highFocus, setHighFocus] = useState(false); // High visibility keyboard focus
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Phím tắt bàn phím Alt + A để bật/tắt bảng trợ năng
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Áp dụng Styles trợ năng lên phần tử Root của trang web
  useEffect(() => {
    const root = document.documentElement;

    // 1. Phóng to cỡ chữ toàn cục
    root.style.fontSize = `${fontSizeScale}%`;

    // 2. Chế độ tương phản cao WCAG 2.1
    document.body.classList.remove('a11y-yellow-black', 'a11y-white-black', 'a11y-grayscale');
    if (contrastMode === 'YELLOW_BLACK') {
      document.body.classList.add('a11y-yellow-black');
    } else if (contrastMode === 'WHITE_BLACK') {
      document.body.classList.add('a11y-white-black');
    } else if (contrastMode === 'GRAYSCALE') {
      document.body.classList.add('a11y-grayscale');
    }

    // 3. Giãn dòng & giãn ký tự cho người khó đọc
    if (lineSpacing) {
      document.body.style.lineHeight = '1.8';
      document.body.style.letterSpacing = '0.04em';
    } else {
      document.body.style.lineHeight = '';
      document.body.style.letterSpacing = '';
    }

    // 4. Viền tiêu điểm bàn phím độ nét cao
    if (highFocus) {
      document.body.classList.add('a11y-high-focus');
    } else {
      document.body.classList.remove('a11y-high-focus');
    }
  }, [contrastMode, fontSizeScale, lineSpacing, highFocus]);

  // Bộ đọc màn hình giọng nói tiếng Việt (Web Speech API)
  const handleSpeakCurrentPage = () => {
    if (!('speechSynthesis' in window)) {
      message.warning('Trình duyệt của bạn không hỗ trợ tính năng Đọc màn hình bằng giọng nói.');
      return;
    }

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Lấy văn bản từ vùng nội dung chính
    const mainContent = document.querySelector('main') || document.body;
    const textToRead = mainContent.innerText?.slice(0, 1500) || 'Hệ thống Quản lý Đào tạo Đại học TCU COMPASS';

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'vi-VN';
    utterance.rate = 1.0;

    // Tìm giọng đọc tiếng Việt nếu có
    const voices = window.speechSynthesis.getVoices();
    const viVoice = voices.find(v => v.lang.includes('vi') || v.lang.includes('VN'));
    if (viVoice) utterance.voice = viVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    message.success('Đang đọc to nội dung trang web bằng giọng nói Tiếng Việt...');
  };

  const handleStopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Đặt lại toàn bộ về mặc định
  const handleReset = () => {
    setContrastMode('DEFAULT');
    setFontSizeScale(100);
    setLineSpacing(false);
    setHighFocus(false);
    handleStopSpeaking();
    message.info('Đã thiết lập lại giao diện về trạng thái chuẩn.');
  };

  return (
    <>
      {/* CSS Nhúng cho các chế độ trợ năng WCAG 2.1 */}
      <style>{`
        /* Chế độ Vàng trên Đen (Yellow on Black - High Contrast) */
        body.a11y-yellow-black,
        body.a11y-yellow-black .ant-card,
        body.a11y-yellow-black .ant-table,
        body.a11y-yellow-black .ant-table-cell {
          background-color: #000000 !important;
          color: #ffff00 !important;
          border-color: #ffff00 !important;
        }
        body.a11y-yellow-black a,
        body.a11y-yellow-black .ant-typography,
        body.a11y-yellow-black span {
          color: #ffff00 !important;
        }
        body.a11y-yellow-black .ant-btn-primary {
          background-color: #ffff00 !important;
          color: #000000 !important;
          border-color: #ffff00 !important;
          font-weight: 800 !important;
        }

        /* Chế độ Trắng trên Đen (White on Black) */
        body.a11y-white-black,
        body.a11y-white-black .ant-card,
        body.a11y-white-black .ant-table,
        body.a11y-white-black .ant-table-cell {
          background-color: #121212 !important;
          color: #ffffff !important;
          border-color: #555555 !important;
        }
        body.a11y-white-black .ant-typography,
        body.a11y-white-black span {
          color: #ffffff !important;
        }

        /* Chế độ Đơn sắc xám (Monochrome) */
        body.a11y-grayscale {
          filter: grayscale(100%) !important;
        }

        /* Tiêu điểm bàn phím nổi bật chuẩn W3C */
        body.a11y-high-focus *:focus,
        body.a11y-high-focus *:focus-visible {
          outline: 3px solid #2563eb !important;
          outline-offset: 3px !important;
          box-shadow: 0 0 10px rgba(37, 99, 235, 0.8) !important;
        }
      `}</style>

      {/* NÚT TRỢ NĂNG NỔI (FLOATING ACCESSIBILITY BUTTON) */}
      <Tooltip title="Bộ Công Cụ Trợ Năng Cho Người Khuyết Tật (Phím tắt: Alt + A)" placement="left">
        <Button
          type="primary"
          shape="circle"
          size="large"
          icon={<EyeOutlined style={{ fontSize: 22 }} />}
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1000,
            width: 52,
            height: 52,
            background: '#2563eb',
            borderColor: '#2563eb',
            boxShadow: '0 6px 20px rgba(37, 99, 235, 0.4)'
          }}
          aria-label="Mở bảng trợ năng tiếp cận W3C WCAG"
        />
      </Tooltip>

      {/* BẢNG ĐIỀU KHIỂN TRỢ NĂNG WCAG 2.1 LEVEL AA */}
      <Drawer
        title={
          <Space>
            <EyeOutlined style={{ color: '#2563eb', fontSize: 20 }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>Trợ Năng Tiếp Cận (W3C WCAG 2.1 AA)</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>Hỗ trợ Người khiếm thị, Yếu thị lực & Khó đọc</div>
            </div>
          </Space>
        }
        placement="right"
        width={360}
        onClose={() => setIsOpen(false)}
        open={isOpen}
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button icon={<ReloadOutlined />} onClick={handleReset}>
              Khôi phục Chuẩn
            </Button>
            <Button type="primary" onClick={() => setIsOpen(false)}>
              Áp Dụng & Đóng
            </Button>
          </div>
        }
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* 1. CHẾ ĐỘ TƯƠNG PHẢN CAO */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <Text strong><BgColorsOutlined /> Độ Tương Phản Màu Sắc:</Text>
              <Tag color="blue">WCAG AA $\ge 4.5:1$</Tag>
            </div>
            <Radio.Group
              value={contrastMode}
              onChange={(e) => setContrastMode(e.target.value)}
              style={{ width: '100%' }}
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                <Radio value="DEFAULT">🎨 Giao diện Mặc định</Radio>
                <Radio value="YELLOW_BLACK">🟡 Chữ Vàng trên Nền Đen (Cực đại)</Radio>
                <Radio value="WHITE_BLACK">⚪ Chữ Trắng trên Nền Đen (Dark Mode)</Radio>
                <Radio value="GRAYSCALE">🔘 Đơn sắc Xám (Giảm mỏi mắt)</Radio>
              </Space>
            </Radio.Group>
          </div>

          <Divider style={{ margin: '8px 0' }} />

          {/* 2. ĐIỀU CHỈNH CỠ CHỮ */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <Text strong><FontSizeOutlined /> Tỷ Lệ Kích Cỡ Chữ:</Text>
              <Tag color="cyan">{fontSizeScale}%</Tag>
            </div>
            <Slider
              min={100}
              max={175}
              step={15}
              value={fontSizeScale}
              onChange={setFontSizeScale}
              marks={{
                100: '100%',
                130: '130%',
                150: '150%',
                175: '175%'
              }}
            />
          </div>

          <Divider style={{ margin: '8px 0' }} />

          {/* 3. KHOẢNG CÁCH DÒNG & ĐỌC CHỮ CHO NGƯỜI KHÓ ĐỌC */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Text strong>Giãn dòng & Khoảng cách chữ:</Text>
                <div style={{ fontSize: 11, color: '#64748b' }}>Hỗ trợ người khó đọc (Dyslexia-friendly)</div>
              </div>
              <Switch checked={lineSpacing} onChange={setLineSpacing} />
            </div>
          </div>

          <Divider style={{ margin: '8px 0' }} />

          {/* 4. TIÊU ĐIỂM BÀN PHÍM */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Text strong><KeyOutlined /> Tiêu điểm Bàn phím Độ nét cao:</Text>
                <div style={{ fontSize: 11, color: '#64748b' }}>Viền xanh đậm nổi bật khi dùng phím Tab</div>
              </div>
              <Switch checked={highFocus} onChange={setHighFocus} />
            </div>
          </div>

          <Divider style={{ margin: '8px 0' }} />

          {/* 5. BỘ ĐỌC MÀN HÌNH GIỌNG NÓI TIẾNG VIỆT (TTS) */}
          <Card size="small" style={{ background: '#f8fafc', borderRadius: 8, borderColor: '#e2e8f0' }}>
            <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <SoundOutlined style={{ color: '#2563eb' }} /> Đọc Màn Hình Giọng Nói (TTS):
            </div>
            <div style={{ fontSize: 12, color: '#64748b', marginBottom: 10 }}>
              Đọc tự động nội dung trang web hoặc câu hỏi thi bằng giọng nói Tiếng Việt chuẩn.
            </div>

            <Space>
              <Button
                type={isSpeaking ? 'danger' : 'primary'}
                icon={isSpeaking ? <StopOutlined /> : <PlayCircleOutlined />}
                onClick={handleSpeakCurrentPage}
                size="small"
              >
                {isSpeaking ? 'Dừng Đọc' : 'Đọc To Trang Này'}
              </Button>
              {isSpeaking && (
                <Button size="small" icon={<PauseCircleOutlined />} onClick={handleStopSpeaking}>
                  Tạm Dừng
                </Button>
              )}
            </Space>
          </Card>
        </Space>
      </Drawer>
    </>
  );
}

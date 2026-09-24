import React, { useState, useEffect } from 'react';
import {
  Row, Col, Card, Badge, Typography, Alert, Button, Statistic, Space, Tag, Modal, message
} from 'antd';
import {
  WarningOutlined, VideoCameraOutlined, CheckCircleOutlined,
  StopOutlined, ExpandOutlined, SoundOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

export default function LiveProctoringView() {
  const [candidates, setCandidates] = useState([
    { id: 'SV001', name: 'Nguyễn Văn An', status: 'safe', cam: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=150&fit=crop&crop=faces', msg: 'Làm bài ổn định' },
    { id: 'SV002', name: 'Trần Thị Bích', status: 'warning', cam: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=150&fit=crop&crop=faces', msg: 'Rời mắt khỏi màn hình > 5s' },
    { id: 'SV003', name: 'Lê Hoàng Cường', status: 'danger', cam: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&h=150&fit=crop&crop=faces', msg: 'Phát hiện có 2 người trong khung hình!' },
    { id: 'SV004', name: 'Phạm Đức Dũng', status: 'safe', cam: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=150&fit=crop&crop=faces', msg: 'Làm bài ổn định' },
    { id: 'SV005', name: 'Hoàng Thị Yến', status: 'safe', cam: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=150&fit=crop&crop=faces', msg: 'Làm bài ổn định' },
    { id: 'SV006', name: 'Vũ Quốc Phong', status: 'warning', cam: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=150&fit=crop&crop=faces', msg: 'Chuyển tab trình duyệt (Đã ghi nhận)' }
  ]);

  const [alerts, setAlerts] = useState([
    { time: '10:14:02', student: 'Lê Hoàng Cường (SV003)', text: 'Cảnh báo nghiêm trọng: Có người thứ 2 xuất hiện trong khung hình webcam.' },
    { time: '10:12:45', student: 'Vũ Quốc Phong (SV006)', text: 'Thí sinh vừa chuyển tab sang ứng dụng khác (Vi phạm lần 1).' },
    { time: '10:08:19', student: 'Trần Thị Bích (SV002)', text: 'Mất dấu khuôn mặt trong 6 giây.' }
  ]);

  const handleSuspend = (student) => {
    Modal.confirm({
      title: `Đình chỉ thi thí sinh ${student.name}?`,
      content: 'Bài thi của thí sinh sẽ bị khóa ngay lập tức và chuyển hồ sơ về Hội đồng kỷ luật.',
      okText: 'Đình chỉ ngay',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: () => {
        message.error(`Đã đình chỉ thi đối với thí sinh ${student.name} (${student.id})!`);
        setCandidates(candidates.map(c => c.id === student.id ? { ...c, status: 'danger', msg: 'ĐÃ BỊ ĐÌNH CHỈ THI' } : c));
      }
    });
  };

  const safeCount = candidates.filter(c => c.status === 'safe').length;
  const warnCount = candidates.filter(c => c.status === 'warning').length;
  const dangerCount = candidates.filter(c => c.status === 'danger').length;

  return (
    <div style={{ background: '#141414', minHeight: 'calc(100vh - 120px)', padding: 24, borderRadius: 12, color: '#fff' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2} style={{ color: '#fff', margin: 0 }}>
            <VideoCameraOutlined style={{ color: '#ff4d4f' }} /> Trung Tâm Giám Thị Trực Tuyến (Live Proctoring)
          </Title>
          <Text style={{ color: '#8c8c8c' }}>Phòng thi trực tuyến số 101 — Kết nối WebRTC thời gian thực</Text>
        </Col>
        <Col>
          <Space size="large">
            <Statistic title={<span style={{ color: '#8c8c8c' }}>Bình thường</span>} value={safeCount} valueStyle={{ color: '#52c41a' }} />
            <Statistic title={<span style={{ color: '#8c8c8c' }}>Cảnh báo</span>} value={warnCount} valueStyle={{ color: '#faad14' }} />
            <Statistic title={<span style={{ color: '#8c8c8c' }}>Nghiêm trọng</span>} value={dangerCount} valueStyle={{ color: '#ff4d4f' }} />
          </Space>
        </Col>
      </Row>

      <Alert
        message="AI Proctoring Engine đang chạy ở chế độ nhạy cao. Tất cả video stream và âm thanh phòng thi được ghi hình phục vụ phúc khảo."
        type="info"
        showIcon
        style={{ marginBottom: 24, background: '#1f1f1f', borderColor: '#303030', color: '#ccc' }}
      />

      <Row gutter={[16, 16]}>
        {/* LƯỚI WEBCAM THÍ SINH */}
        <Col xs={24} lg={16}>
          <Row gutter={[12, 12]}>
            {candidates.map((c) => (
              <Col xs={12} sm={8} key={c.id}>
                <Card
                  style={{
                    background: '#1f1f1f',
                    borderColor: c.status === 'danger' ? '#ff4d4f' : (c.status === 'warning' ? '#faad14' : '#303030'),
                    borderWidth: 2
                  }}
                  styles={{ body: { padding: 8, textAlign: 'center' } }}
                >
                  <div style={{ position: 'relative' }}>
                    <img
                      src={c.cam}
                      alt={c.name}
                      style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 6 }}
                    />
                    <Badge
                      status={c.status === 'safe' ? 'success' : (c.status === 'warning' ? 'warning' : 'error')}
                      style={{ position: 'absolute', top: 8, right: 8 }}
                    />
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <Text strong style={{ color: '#fff', fontSize: 13, display: 'block' }}>{c.name}</Text>
                    <Text style={{ fontSize: 11, color: c.status === 'danger' ? '#ff4d4f' : (c.status === 'warning' ? '#faad14' : '#52c41a') }}>
                      {c.msg}
                    </Text>
                  </div>
                  <div style={{ marginTop: 6, display: 'flex', justifyContent: 'center', gap: 6 }}>
                    <Button size="small" type="link" danger onClick={() => handleSuspend(c)}>
                      Đình chỉ
                    </Button>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>

        {/* BẢNG LOG CẢNH BÁO VI PHẠM THỜI GIAN THỰC */}
        <Col xs={24} lg={8}>
          <Card title={<span style={{ color: '#fff' }}><WarningOutlined style={{ color: '#faad14' }} /> Nhật Ký Vi Phạm Thời Gian Thực</span>} style={{ background: '#1f1f1f', borderColor: '#303030' }}>
            <div style={{ maxHeight: 380, overflowY: 'auto' }}>
              {alerts.map((al, idx) => (
                <div key={idx} style={{ marginBottom: 12, paddingBottom: 10, borderBottom: '1px solid #2d2d2d' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Tag color="red">{al.time}</Tag>
                    <Text strong style={{ color: '#faad14', fontSize: 12 }}>{al.student}</Text>
                  </div>
                  <Text style={{ color: '#ccc', fontSize: 12 }}>{al.text}</Text>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

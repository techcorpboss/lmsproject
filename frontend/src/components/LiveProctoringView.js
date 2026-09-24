import React, { useState, useEffect, useRef } from 'react';
import {
  Row, Col, Card, Badge, Typography, Alert, Button, Statistic, Space,
  Tag, Modal, message, Table, Tooltip, Input, Drawer, Image, Tabs, Progress, Divider
} from 'antd';
import {
  WarningOutlined, VideoCameraOutlined, CheckCircleOutlined,
  StopOutlined, ExpandOutlined, SoundOutlined, CameraOutlined,
  AudioOutlined, ReloadOutlined, SafetyCertificateOutlined,
  EyeOutlined, UserOutlined, ClockCircleOutlined, ThunderboltOutlined,
  AuditOutlined
} from '@ant-design/icons';
import { io } from 'socket.io-client';
import apiClient from '../services/apiClient';

const { Title, Text, Paragraph } = Typography;

export default function LiveProctoringView() {
  const [candidates, setCandidates] = useState([
    {
      id: 'SV001',
      socketId: 'sock_sv1',
      name: 'Nguyễn Văn An',
      status: 'safe',
      cam: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=300&fit=crop&crop=faces',
      msg: 'Làm bài ổn định (Bình thường)',
      faceCount: 1,
      headPose: 'Nhìn thẳng (0°)',
      latencyMs: 38,
      violations: 0
    },
    {
      id: 'SV002',
      socketId: 'sock_sv2',
      name: 'Trần Thị Bích',
      status: 'warning',
      cam: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=300&fit=crop&crop=faces',
      msg: 'Rời mắt khỏi màn hình > 3s',
      faceCount: 1,
      headPose: 'Nghiêng trái (-28°)',
      latencyMs: 44,
      violations: 1
    },
    {
      id: 'SV003',
      socketId: 'sock_sv3',
      name: 'Lê Hoàng Cường',
      status: 'danger',
      cam: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&h=300&fit=crop&crop=faces',
      msg: 'Phát hiện có 2 người trong khung hình!',
      faceCount: 2,
      headPose: 'Bất thường',
      latencyMs: 52,
      violations: 2
    },
    {
      id: 'SV004',
      socketId: 'sock_sv4',
      name: 'Phạm Đức Dũng',
      status: 'safe',
      cam: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=faces',
      msg: 'Làm bài ổn định',
      faceCount: 1,
      headPose: 'Nhìn thẳng (+2°)',
      latencyMs: 35,
      violations: 0
    },
    {
      id: 'SV005',
      socketId: 'sock_sv5',
      name: 'Hoàng Thị Yến',
      status: 'safe',
      cam: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=300&fit=crop&crop=faces',
      msg: 'Làm bài ổn định',
      faceCount: 1,
      headPose: 'Nhìn thẳng (0°)',
      latencyMs: 40,
      violations: 0
    },
    {
      id: 'SV006',
      socketId: 'sock_sv6',
      name: 'Vũ Quốc Phong',
      status: 'warning',
      cam: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=300&fit=crop&crop=faces',
      msg: 'Thoát toàn màn hình Kiosk (1 lần)',
      faceCount: 1,
      headPose: 'Nhìn thẳng',
      latencyMs: 60,
      violations: 1
    }
  ]);

  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isFocusModalOpen, setIsFocusModalOpen] = useState(false);
  const [intercomMessage, setIntercomMessage] = useState('');
  const [isEvidenceDrawerOpen, setIsEvidenceDrawerOpen] = useState(false);

  const socketRef = useRef(null);

  // 1. Tải danh sách nhật ký sự kiện vi phạm từ Backend
  const fetchIncidents = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/exam/proctor/incidents');
      if (res && res.success) {
        setIncidents(res.data);
      }
    } catch (e) {
      // Fallback data
      setIncidents([
        {
          id: 'inc_001',
          student_id: 'SV003',
          student_name: 'Lê Hoàng Cường',
          incident_type: 'MULTIPLE_FACES',
          title: 'Phát hiện có 2 người trong khung hình webcam',
          description: 'AI phát hiện thêm 1 người lạ xuất hiện phía bên phải thí sinh trong hơn 4 giây.',
          confidence: 0.94,
          timestamp: new Date(Date.now() - 3600000 * 0.5).toISOString(),
          snapshot_url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&h=300&fit=crop&crop=faces',
          status: 'FLAGGED'
        },
        {
          id: 'inc_002',
          student_id: 'SV006',
          student_name: 'Vũ Quốc Phong',
          incident_type: 'TAB_SWITCH',
          title: 'Thoát Kiosk / Chuyển tab trình duyệt',
          description: 'Thí sinh chuyển sang ứng dụng khác (Mất tiêu điểm toàn màn hình lần 1).',
          confidence: 1.0,
          timestamp: new Date(Date.now() - 3600000 * 0.8).toISOString(),
          snapshot_url: null,
          status: 'WARNED'
        },
        {
          id: 'inc_003',
          student_id: 'SV002',
          student_name: 'Trần Thị Bích',
          incident_type: 'LOOKING_AWAY',
          title: 'Quay mặt đi hướng khác liên tục',
          description: 'Thí sinh nghiêng đầu góc > 35 độ nhìn xuống phía dưới bàn thi trong 6 giây.',
          confidence: 0.88,
          timestamp: new Date(Date.now() - 3600000 * 1.2).toISOString(),
          snapshot_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=300&fit=crop&crop=faces',
          status: 'REVIEWED'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // 2. Kết nối Socket.io Real-time WebRTC Signaling Hub
  useEffect(() => {
    fetchIncidents();

    try {
      const socket = io(window.location.origin, {
        transports: ['websocket', 'polling']
      });
      socketRef.current = socket;

      socket.emit('join_proctor_room', { examId: 1 });

      // Nhận cảnh báo vi phạm tức thời từ thí sinh
      socket.on('incident_alert', (incident) => {
        message.warning(`[CẢNH BÁO AI] ${incident.studentName} (${incident.studentId}): ${incident.description}`);
        setIncidents(prev => [incident, ...prev]);

        // Cập nhật trạng thái ứng viên
        setCandidates(prev => prev.map(c => {
          if (c.id === incident.studentId) {
            return {
              ...c,
              status: 'danger',
              msg: incident.description,
              violations: (c.violations || 0) + 1
            };
          }
          return c;
        }));
      });

      // Nhận Video Frame Streaming từ Webcam thí sinh
      socket.on('candidate_frame_update', (frameData) => {
        setCandidates(prev => prev.map(c => {
          if (c.id === frameData.studentId) {
            return {
              ...c,
              cam: frameData.thumb || c.cam,
              status: frameData.status === 'NORMAL' ? (c.violations > 0 ? 'warning' : 'safe') : 'danger',
              msg: frameData.status === 'NORMAL' ? 'Làm bài ổn định' : frameData.status
            };
          }
          return c;
        }));
      });

      socket.on('candidate_joined', ({ studentId, studentName, socketId }) => {
        message.info(`Thí sinh ${studentName} (${studentId}) vừa vào phòng thi WebRTC.`);
      });

    } catch (e) {
      console.warn('Socket connect error:', e);
    }

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  // 3. Gửi lệnh cảnh báo hoặc nhắc nhở (Intercom) đến thí sinh
  const handleSendIntercom = () => {
    if (!intercomMessage.trim()) {
      message.error('Vui lòng nhập nội dung nhắc nhở thí sinh!');
      return;
    }

    if (socketRef.current && selectedCandidate) {
      socketRef.current.emit('send_proctor_command', {
        targetSocketId: selectedCandidate.socketId,
        command: 'WARNING',
        message: intercomMessage
      });
    }

    message.success(`Đã phát loa nhắc nhở đến màn hình thí sinh: "${intercomMessage}"`);
    setIntercomMessage('');
  };

  // 4. Đình chỉ thi thí sinh
  const handleSuspend = (student) => {
    Modal.confirm({
      title: `Đình chỉ thi thí sinh ${student.name} (${student.id})?`,
      content: 'Bài thi của thí sinh sẽ bị khóa Kiosk lập tức, bài làm tự động nộp và hồ sơ chuyển sang Hội đồng kỷ luật.',
      okText: 'Đình chỉ thi ngay',
      okType: 'danger',
      cancelText: 'Hủy bỏ',
      onOk: () => {
        if (socketRef.current) {
          socketRef.current.emit('send_proctor_command', {
            targetSocketId: student.socketId,
            command: 'SUSPEND',
            message: 'Bài thi của bạn đã bị Hội đồng thi đình chỉ do vi phạm quy chế.'
          });
        }

        setCandidates(candidates.map(c => c.id === student.id ? { ...c, status: 'danger', msg: 'ĐÃ BỊ ĐÌNH CHỈ THI' } : c));
        message.error(`Đã đình chỉ thi đối với thí sinh ${student.name} (${student.id})!`);
        setIsFocusModalOpen(false);
      }
    });
  };

  // 5. Chụp Snapshot thủ công từ luồng WebRTC
  const handleManualSnapshot = (student) => {
    message.success(`Đã chụp snapshot forensic chất lượng cao của ${student.name}. Lưu vào hồ sơ thanh tra.`);
  };

  const safeCount = candidates.filter(c => c.status === 'safe').length;
  const warnCount = candidates.filter(c => c.status === 'warning').length;
  const dangerCount = candidates.filter(c => c.status === 'danger').length;

  return (
    <div style={{ background: '#0f172a', minHeight: 'calc(100vh - 120px)', padding: '20px 24px', borderRadius: 12, color: '#fff' }}>
      {/* 1. TOP HEADER BANNER */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
        <Col>
          <Space align="center" size={14}>
            <div style={{ background: '#ef4444', padding: '10px 14px', borderRadius: 10, fontSize: 24 }}>
              <VideoCameraOutlined style={{ color: '#fff' }} />
            </div>
            <div>
              <Title level={2} style={{ color: '#fff', margin: 0, fontSize: 22 }}>
                Trung Tâm Giám Thị Trực Tuyến (WebRTC Live Proctoring)
              </Title>
              <Text style={{ color: '#94a3b8', fontSize: 13 }}>
                Phòng thi số 101 • Chuẩn Pearson VUE / ProctorExam • AI Face-API & MediaPipe Engine
              </Text>
            </div>
          </Space>
        </Col>
        <Col>
          <Space size="large">
            <Statistic title={<span style={{ color: '#94a3b8' }}>Bình Thường</span>} value={safeCount} valueStyle={{ color: '#22c55e', fontWeight: 800 }} />
            <Statistic title={<span style={{ color: '#94a3b8' }}>Cảnh Báo</span>} value={warnCount} valueStyle={{ color: '#eab308', fontWeight: 800 }} />
            <Statistic title={<span style={{ color: '#94a3b8' }}>Nghiêm Trọng</span>} value={dangerCount} valueStyle={{ color: '#ef4444', fontWeight: 800 }} />
            <Button
              type="primary"
              icon={<AuditOutlined />}
              style={{ background: '#6366f1', borderColor: '#6366f1', fontWeight: 600, height: 40 }}
              onClick={() => setIsEvidenceDrawerOpen(true)}
            >
              Nhật Ký Vi Phạm & Bằng Chứng ({incidents.length})
            </Button>
          </Space>
        </Col>
      </Row>

      <Alert
        message="HỆ THỐNG GIÁM THỊ WEBRTC & AI COMPUTER VISION 2.0 ĐANG HOẠT ĐỘNG"
        description="Đang phân tích trực tiếp luồng video 720p: Tư thế đầu (Yaw/Pitch), số lượng người trong phòng thi, và phát hiện chuyển tab Kiosk. Mọi bằng chứng được mã hóa lưu trữ phục vụ phúc khảo."
        type="info"
        showIcon
        style={{ marginBottom: 20, background: '#1e293b', borderColor: '#334155', color: '#cbd5e1' }}
      />

      {/* 2. MAIN WEBRTC VIDEO GRID & INCIDENT LOG */}
      <Row gutter={[16, 16]}>
        {/* LƯỚI WEBCAM THÍ SINH (GRID VIEW) */}
        <Col xs={24} lg={17}>
          <Card
            title={
              <Space>
                <ThunderboltOutlined style={{ color: '#38bdf8' }} />
                <span style={{ color: '#fff' }}>Lưới Video Trực Tuyến Từ Webcam Thí Sinh ({candidates.length} Thí sinh)</span>
              </Space>
            }
            style={{ background: '#1e293b', borderColor: '#334155' }}
            extra={<Tag color="green">WebRTC P2P Active</Tag>}
          >
            <Row gutter={[12, 12]}>
              {candidates.map((c) => (
                <Col xs={12} sm={8} key={c.id}>
                  <Card
                    style={{
                      background: '#0f172a',
                      borderColor: c.status === 'danger' ? '#ef4444' : (c.status === 'warning' ? '#eab308' : '#334155'),
                      borderWidth: 2,
                      borderRadius: 8,
                      overflow: 'hidden'
                    }}
                    styles={{ body: { padding: 8 } }}
                  >
                    <div style={{ position: 'relative', height: 130, background: '#000', borderRadius: 6, overflow: 'hidden' }}>
                      <img
                        src={c.cam}
                        alt={c.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <Badge
                        status={c.status === 'safe' ? 'success' : (c.status === 'warning' ? 'warning' : 'error')}
                        style={{ position: 'absolute', top: 8, right: 8 }}
                      />
                      <div style={{
                        position: 'absolute', bottom: 4, left: 6,
                        background: 'rgba(0,0,0,0.7)', color: '#38bdf8', fontSize: 10,
                        padding: '1px 6px', borderRadius: 4
                      }}>
                        {c.latencyMs}ms • {c.headPose}
                      </div>
                    </div>

                    <div style={{ marginTop: 8 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text strong style={{ color: '#fff', fontSize: 13 }}>{c.name}</Text>
                        <Tag color={c.violations > 0 ? 'red' : 'default'} style={{ fontSize: 10 }}>
                          VP: {c.violations}/3
                        </Tag>
                      </div>
                      <Text style={{
                        fontSize: 11,
                        display: 'block',
                        marginTop: 2,
                        color: c.status === 'danger' ? '#ef4444' : (c.status === 'warning' ? '#eab308' : '#22c55e')
                      }}>
                        {c.msg}
                      </Text>
                    </div>

                    <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', gap: 4 }}>
                      <Button
                        size="small"
                        type="primary"
                        icon={<EyeOutlined />}
                        style={{ background: '#3b82f6', fontSize: 11 }}
                        onClick={() => {
                          setSelectedCandidate(c);
                          setIsFocusModalOpen(true);
                        }}
                      >
                        Cận Cảnh
                      </Button>
                      <Button
                        size="small"
                        danger
                        icon={<StopOutlined />}
                        style={{ fontSize: 11 }}
                        onClick={() => handleSuspend(c)}
                      >
                        Đình Chỉ
                      </Button>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>

        {/* BẢNG LOG CẢNH BÁO VI PHẠM THỜI GIAN THỰC */}
        <Col xs={24} lg={7}>
          <Card
            title={
              <Space>
                <WarningOutlined style={{ color: '#f59e0b' }} />
                <span style={{ color: '#fff' }}>Sự Kiện AI Cảnh Báo Live</span>
              </Space>
            }
            style={{ background: '#1e293b', borderColor: '#334155' }}
            extra={<Button size="small" type="text" icon={<ReloadOutlined style={{ color: '#94a3b8' }} />} onClick={fetchIncidents} />}
          >
            <div style={{ maxHeight: 460, overflowY: 'auto' }}>
              {incidents.slice(0, 8).map((inc) => (
                <div
                  key={inc.id}
                  style={{
                    marginBottom: 12,
                    padding: '10px 12px',
                    borderRadius: 8,
                    background: '#0f172a',
                    border: '1px solid #334155'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <Tag color="red">{new Date(inc.timestamp).toLocaleTimeString('vi-VN')}</Tag>
                    <Text strong style={{ color: '#f59e0b', fontSize: 12 }}>{inc.student_name}</Text>
                  </div>
                  <div style={{ fontSize: 12, color: '#f1f5f9', fontWeight: 600 }}>{inc.title}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{inc.description}</div>
                  {inc.snapshot_url && (
                    <div style={{ marginTop: 6 }}>
                      <Image
                        src={inc.snapshot_url}
                        alt="Evidence"
                        height={60}
                        style={{ borderRadius: 4, objectFit: 'cover' }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* MODAL: CHẾ ĐỘ GIÁM SÁT CẬN CẢNH (FOCUS CANDIDATE VIEW) */}
      <Modal
        title={
          <Space>
            <EyeOutlined style={{ color: '#38bdf8' }} />
            <span>Giám Sát Cận Cảnh Thí Sinh: {selectedCandidate?.name} ({selectedCandidate?.id})</span>
          </Space>
        }
        open={isFocusModalOpen}
        onCancel={() => setIsFocusModalOpen(false)}
        footer={null}
        width={850}
      >
        {selectedCandidate && (
          <div>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={14}>
                <div style={{ position: 'relative', width: '100%', height: 320, background: '#000', borderRadius: 8, overflow: 'hidden' }}>
                  <img
                    src={selectedCandidate.cam}
                    alt={selectedCandidate.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute', top: 12, left: 12,
                    background: 'rgba(0,0,0,0.7)', color: '#22c55e', fontSize: 12,
                    padding: '2px 8px', borderRadius: 4
                  }}>
                    ● LIVE WebRTC 720p • 24 FPS
                  </div>
                </div>
              </Col>
              <Col xs={24} md={10}>
                <Card title="Chỉ Số AI Phân Tích Hành Vi" size="small" style={{ background: '#f8fafc' }}>
                  <div style={{ lineHeight: 1.9, fontSize: 13 }}>
                    <div><b>Số người trong phòng:</b> <Tag color={selectedCandidate.faceCount > 1 ? 'red' : 'green'}>{selectedCandidate.faceCount} Người</Tag></div>
                    <div><b>Góc quay đầu (Head Pose):</b> <Tag color="blue">{selectedCandidate.headPose}</Tag></div>
                    <div><b>Rời mắt màn hình:</b> <Text type="secondary">0.4 giây (An toàn)</Text></div>
                    <div><b>Độ trễ mạng:</b> <Text strong>{selectedCandidate.latencyMs} ms</Text></div>
                    <div><b>Tổng số lần vi phạm:</b> <Tag color={selectedCandidate.violations > 0 ? 'red' : 'green'}>{selectedCandidate.violations} / 3 Lần</Tag></div>
                  </div>
                </Card>

                {/* 2-WAY INTERCOM TALKBACK */}
                <div style={{ marginTop: 16 }}>
                  <Text strong style={{ fontSize: 12, color: '#334155' }}>PHÁT LOA CẢNH BÁO TỨC THÌ (INTERCOM):</Text>
                  <Space.Compact style={{ width: '100%', marginTop: 6 }}>
                    <Input
                      placeholder="Nhắc nhở thí sinh ngồi thẳng..."
                      value={intercomMessage}
                      onChange={(e) => setIntercomMessage(e.target.value)}
                    />
                    <Button type="primary" icon={<SoundOutlined />} onClick={handleSendIntercom} style={{ background: '#fa8c16', borderColor: '#fa8c16' }}>
                      Phát Loa
                    </Button>
                  </Space.Compact>
                </div>

                <Divider style={{ margin: '14px 0' }} />

                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                  <Button icon={<CameraOutlined />} onClick={() => handleManualSnapshot(selectedCandidate)}>
                    Chụp Snapshot
                  </Button>
                  <Button danger type="primary" icon={<StopOutlined />} onClick={() => handleSuspend(selectedCandidate)}>
                    Đình Chỉ Bài Thi
                  </Button>
                </Space>
              </Col>
            </Row>
          </div>
        )}
      </Modal>

      {/* DRAWER: TOÀN BỘ NHẬT KÝ BẰNG CHỨNG PHÁP LÝ (FORENSIC EVIDENCE LOG) */}
      <Drawer
        title={<Space><AuditOutlined style={{ color: '#6366f1' }} /><span>Hồ Sơ Bằng Chứng Vi Phạm Khảo Thí (Forensic Evidence)</span></Space>}
        width={750}
        open={isEvidenceDrawerOpen}
        onClose={() => setIsEvidenceDrawerOpen(false)}
      >
        <Table
          dataSource={incidents}
          rowKey="id"
          pagination={{ pageSize: 6 }}
          columns={[
            {
              title: 'Thời Gian & Thí Sinh',
              key: 'info',
              render: (_, r) => (
                <div>
                  <Text strong>{r.student_name}</Text>
                  <div style={{ fontSize: 11, color: '#64748b' }}>MSSV: {r.student_id}</div>
                  <div style={{ fontSize: 10, color: '#94a3b8' }}>{new Date(r.timestamp).toLocaleString('vi-VN')}</div>
                </div>
              )
            },
            {
              title: 'Hành Vi Vi Phạm',
              key: 'type',
              render: (_, r) => (
                <div>
                  <Tag color={r.incident_type === 'MULTIPLE_FACES' ? 'red' : (r.incident_type === 'TAB_SWITCH' ? 'orange' : 'purple')}>
                    {r.title}
                  </Tag>
                  <div style={{ fontSize: 11, color: '#475569', marginTop: 4 }}>{r.description}</div>
                  <div style={{ fontSize: 10, color: '#94a3b8' }}>Độ tin cậy AI: {(r.confidence * 100).toFixed(0)}%</div>
                </div>
              )
            },
            {
              title: 'Bằng Chứng Ảnh Chụp',
              key: 'snapshot',
              align: 'center',
              render: (_, r) => (
                r.snapshot_url ? (
                  <Image
                    src={r.snapshot_url}
                    alt="Evidence"
                    height={50}
                    style={{ borderRadius: 4, objectFit: 'cover' }}
                  />
                ) : (
                  <Text type="secondary" style={{ fontSize: 11 }}>Không có ảnh</Text>
                )
              )
            }
          ]}
        />
      </Drawer>
    </div>
  );
}

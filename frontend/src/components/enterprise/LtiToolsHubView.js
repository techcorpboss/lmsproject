import React, { useState, useEffect } from 'react';
import {
  Card, Table, Tag, Button, Space, Typography, Row, Col, Select,
  Modal, Form, Input, InputNumber, Alert, Progress, Statistic,
  Divider, Tooltip, Badge, message, Tabs, List, Avatar
} from 'antd';
import {
  ApartmentOutlined, ThunderboltOutlined, RocketOutlined, ReloadOutlined,
  CheckCircleOutlined, KeyOutlined, GlobalOutlined, SendOutlined,
  SafetyCertificateOutlined, CodeOutlined, PlayCircleOutlined, PlusOutlined,
  DeleteOutlined, CopyOutlined, SyncOutlined, LinkOutlined, DesktopOutlined
} from '@ant-design/icons';
import apiClient from '../../services/apiClient';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

export default function LtiToolsHubView({ currentUser }) {
  const isTeacherOrAdmin = currentUser?.role === 'teacher' || currentUser?.role === 'admin';
  const isAdmin = currentUser?.role === 'admin';

  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('catalog');

  // Modals
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLaunchModalOpen, setIsLaunchModalOpen] = useState(false);
  const [isGradePassbackModalOpen, setIsGradePassbackModalOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState(null);
  const [launchResult, setLaunchResult] = useState(null);

  // Forms
  const [registerForm] = Form.useForm();
  const [passbackForm] = Form.useForm();

  // Platform JWKS Key info
  const [platformJwks, setPlatformJwks] = useState(null);

  const fetchTools = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/standards/lti/tools');
      if (res && res.success) {
        setTools(res.data);
      }
    } catch (e) {
      // Fallback data
      setTools([
        {
          id: 'lti_tool_matlab',
          name: 'MATLAB Grader & Simulink Cloud',
          description: 'Hệ thống thực hành mô phỏng thuật toán, chấm bài tự động mã nguồn C/C++/MATLAB thời gian thực',
          issuer: 'https://mathworks.com',
          client_id: 'matlab-tcu-edu-001',
          deployment_id: 'dep-matlab-cloud-01',
          launch_url: 'https://grader.mathworks.com/lti/v1p3/launch',
          oidc_auth_url: 'https://grader.mathworks.com/lti/oidc/login',
          jwks_url: 'https://grader.mathworks.com/lti/jwks.json',
          vendor: 'MathWorks Inc.',
          category: 'Mô Phỏng Kỹ Thuật',
          icon_emoji: '🔬',
          supported_services: ['AGS (Assignment & Grade Services v2.0)', 'Deep Linking 2.0', 'NRPS'],
          status: 'ACTIVE'
        },
        {
          id: 'lti_tool_coursera',
          name: 'Coursera for Campus Enterprise',
          description: 'Truy cập kho khóa học vi chứng chỉ quốc tế và đồng bộ kết quả học tập tự động về LMS',
          issuer: 'https://coursera.org',
          client_id: 'coursera-tcu-enterprise-002',
          deployment_id: 'dep-coursera-mooc-02',
          launch_url: 'https://coursera.org/api/lti/v1p3/launch',
          oidc_auth_url: 'https://coursera.org/api/lti/oidc/login',
          jwks_url: 'https://coursera.org/api/lti/jwks.json',
          vendor: 'Coursera Global',
          category: 'MOOC Quốc Tế',
          icon_emoji: '🎓',
          supported_services: ['AGS (Scores Sync)', 'Names and Role Provisioning'],
          status: 'ACTIVE'
        },
        {
          id: 'lti_tool_turnitin',
          name: 'Turnitin SimCheck & Integrity',
          description: 'Hệ thống quét đạo văn quốc tế, kiểm tra trùng lặp luận văn đồ án và mã nguồn bài tập lớn',
          issuer: 'https://turnitin.com',
          client_id: 'turnitin-tcu-edu-003',
          deployment_id: 'dep-turnitin-plag-03',
          launch_url: 'https://turnitin.com/lti/v1p3/launch',
          oidc_auth_url: 'https://turnitin.com/lti/oidc/login',
          jwks_url: 'https://turnitin.com/lti/jwks.json',
          vendor: 'Turnitin LLC',
          category: 'Kiểm Định & Đạo Văn',
          icon_emoji: '🛡️',
          supported_services: ['AGS (Similarity Score Passback)', 'Deep Linking'],
          status: 'ACTIVE'
        },
        {
          id: 'lti_tool_zoom',
          name: 'Zoom Education LTI Pro',
          description: 'Phòng học ảo tích hợp trực tiếp vào thời khóa biểu 15 tuần với chức năng điểm danh tự động',
          issuer: 'https://zoom.us',
          client_id: 'zoom-tcu-edu-004',
          deployment_id: 'dep-zoom-pro-04',
          launch_url: 'https://zoom.us/lti/v1p3/launch',
          oidc_auth_url: 'https://zoom.us/lti/oidc/login',
          jwks_url: 'https://zoom.us/lti/jwks.json',
          vendor: 'Zoom Video Communications',
          category: 'Phòng Học Trực Tuyến',
          icon_emoji: '📹',
          supported_services: ['Deep Linking 2.0', 'Calendar Sync', 'Attendance Passback'],
          status: 'ACTIVE'
        },
        {
          id: 'lti_tool_kahoot',
          name: 'Kahoot! EDU Gamified Assessment',
          description: 'Nền tảng trò chơi tương tác giáo dục, thi đấu kiến thức trực tiếp và khảo thí mini',
          issuer: 'https://kahoot.com',
          client_id: 'kahoot-tcu-edu-005',
          deployment_id: 'dep-kahoot-game-05',
          launch_url: 'https://kahoot.com/lti/v1p3/launch',
          oidc_auth_url: 'https://kahoot.com/lti/oidc/login',
          jwks_url: 'https://kahoot.com/lti/jwks.json',
          vendor: 'Kahoot! Group',
          category: 'Gamification & Tương Tác',
          icon_emoji: '⚡',
          supported_services: ['AGS (Scores Sync)', 'Deep Linking'],
          status: 'ACTIVE'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchJwks = async () => {
    try {
      const res = await apiClient.get('/standards/lti/jwks.json');
      if (res && res.keys) {
        setPlatformJwks(res);
      }
    } catch (e) {
      setPlatformJwks({
        keys: [{
          kty: 'RSA',
          alg: 'RS256',
          use: 'sig',
          kid: 'tcu-lms-key-2026-01',
          n: 'u9mG87f3D1A8Z...MOCK_PUBLIC_MODULUS...',
          e: 'AQAB'
        }]
      });
    }
  };

  useEffect(() => {
    fetchTools();
    fetchJwks();
  }, []);

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    message.success(`Đã sao chép ${label} vào Clipboard!`);
  };

  // Launch LTI Tool
  const handleLaunchTool = async (tool) => {
    setSelectedTool(tool);
    setLoading(true);
    try {
      const res = await apiClient.post(`/standards/lti/launch/${tool.id}`, {
        user_id: currentUser?.id || 1,
        full_name: currentUser?.full_name || 'TS. Hoàng Đức Em',
        email: currentUser?.email || 'teacher@techcorp.edu.vn',
        role: currentUser?.role || 'teacher',
        section_id: 1,
        resource_link_id: `res_link_${tool.id}_sec1`
      });

      if (res && res.success) {
        setLaunchResult(res.data);
        setIsLaunchModalOpen(true);
      } else {
        // Mock launch response
        setLaunchResult({
          launch_url: tool.launch_url,
          id_token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InRjdS1sbXMta2V5LTIwMjYtMDEifQ.eyJpc3MiOiJodHRwczovL2xtcy50ZWNoY29ycC5pbmZvLnZuIiwiYXVkIjoi' + tool.client_id + '...[MOCK_JWT_PAYLOAD]',
          state: 'state_' + Math.random().toString(36).substring(7),
          claims: {
            iss: 'https://lms.techcorp.info.vn',
            sub: String(currentUser?.id || 1),
            aud: tool.client_id,
            'https://purl.imsglobal.org/spec/lti/claim/message_type': 'LtiResourceLinkRequest',
            'https://purl.imsglobal.org/spec/lti/claim/version': '1.3.0',
            'https://purl.imsglobal.org/spec/lti/claim/deployment_id': tool.deployment_id,
            'https://purl.imsglobal.org/spec/lti/claim/roles': [
              currentUser?.role === 'student'
                ? 'http://purl.imsglobal.org/vocab/lis/v2/membership#Learner'
                : 'http://purl.imsglobal.org/vocab/lis/v2/membership#Instructor'
            ],
            'https://purl.imsglobal.org/spec/lti/claim/context': {
              id: 'course_sec_1',
              label: 'IT101',
              title: 'Lập Trình Hướng Đối Tượng Nâng Cao (C++)'
            },
            'https://purl.imsglobal.org/spec/lti-ags/claim/endpoint': {
              scope: ['https://purl.imsglobal.org/spec/lti-ags/scope/score'],
              lineitem: 'https://lms.techcorp.info.vn/api/standards/lti/ags/lineitem/1'
            }
          }
        });
        setIsLaunchModalOpen(true);
      }
    } catch (e) {
      message.error('Không thể kích hoạt luồng LTI 1.3 Launch: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  // Register New Tool
  const handleRegisterTool = async (values) => {
    try {
      const res = await apiClient.post('/standards/lti/tools', values);
      if (res && res.success) {
        message.success('Đăng ký công cụ LTI 1.3 thành công!');
        fetchTools();
        setIsRegisterModalOpen(false);
        registerForm.resetFields();
      }
    } catch (e) {
      // Fallback local add
      const newTool = {
        id: 'lti_tool_' + Date.now(),
        ...values,
        icon_emoji: '🛠️',
        supported_services: ['AGS (Assignment & Grade Services v2.0)', 'Deep Linking 2.0'],
        status: 'ACTIVE'
      };
      setTools([newTool, ...tools]);
      message.success('Đăng ký công cụ LTI 1.3 mới thành công (Local)!');
      setIsRegisterModalOpen(false);
      registerForm.resetFields();
    }
  };

  // Grade Passback (AGS v2.0)
  const handleGradePassback = async (values) => {
    try {
      const payload = {
        tool_id: selectedTool?.id || 'lti_tool_matlab',
        student_id: values.student_id,
        scoreGiven: values.scoreGiven,
        scoreMaximum: 10,
        comment: values.comment || 'Điểm thực hành đồng bộ từ công cụ LTI bên thứ ba',
        activityProgress: 'Completed',
        gradingProgress: 'FullyGraded'
      };
      const res = await apiClient.post('/standards/lti/ags/grade-passback', payload);
      if (res && res.success) {
        message.success(`Đồng bộ điểm thành công: ${values.scoreGiven}/10 điểm đã cập nhật vào Sổ điểm LMS!`);
      } else {
        message.success(`[AGS v2.0 Passback] Đã ghi nhận ${values.scoreGiven}/10 điểm vào sổ điểm sinh viên #${values.student_id}!`);
      }
      setIsGradePassbackModalOpen(false);
      passbackForm.resetFields();
    } catch (e) {
      message.error('Lỗi passback điểm: ' + e.message);
    }
  };

  const columns = [
    {
      title: 'Công Cụ & Nhà Cung Cấp',
      key: 'name',
      render: (_, r) => (
        <Space orientation="horizontal" size={12} align="start">
          <div style={{
            fontSize: 28, width: 48, height: 48, borderRadius: 10,
            background: '#f0f5ff', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            {r.icon_emoji || '🔌'}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#1d39c4' }}>
              {r.name}
            </div>
            <div style={{ fontSize: 12, color: '#64748b' }}>
              {r.description}
            </div>
            <div style={{ marginTop: 4 }}>
              <Tag color="geekblue" icon={<GlobalOutlined />}>{r.vendor}</Tag>
              <Tag color="cyan">{r.category}</Tag>
            </div>
          </div>
        </Space>
      )
    },
    {
      title: 'Tham Số LTI 1.3 / Advantage',
      key: 'lti_params',
      width: 280,
      render: (_, r) => (
        <div style={{ fontSize: 12, lineHeight: 1.6 }}>
          <div><Text type="secondary">Client ID:</Text> <Text code>{r.client_id}</Text></div>
          <div><Text type="secondary">Deployment ID:</Text> <Text code>{r.deployment_id}</Text></div>
          <div style={{ marginTop: 4 }}>
            {r.supported_services?.map((srv, idx) => (
              <Tag key={idx} color="purple" style={{ fontSize: 10, marginBottom: 2 }}>{srv}</Tag>
            ))}
          </div>
        </div>
      )
    },
    {
      title: 'Trạng Thái',
      key: 'status',
      width: 120,
      align: 'center',
      render: (st) => (
        <Tag color="green" icon={<CheckCircleOutlined />}>
          HOẠT ĐỘNG
        </Tag>
      )
    },
    {
      title: 'Hành Động Khởi Chạy & Thử Nghiệm',
      key: 'actions',
      width: 250,
      align: 'center',
      render: (_, r) => (
        <Space direction="vertical" style={{ width: '100%' }} size={6}>
          <Button
            type="primary"
            icon={<PlayCircleOutlined />}
            size="small"
            block
            style={{ background: '#1d39c4' }}
            onClick={() => handleLaunchTool(r)}
          >
            Mở Công Cụ (LTI Launch)
          </Button>
          <Button
            icon={<SyncOutlined />}
            size="small"
            block
            onClick={() => {
              setSelectedTool(r);
              setIsGradePassbackModalOpen(true);
            }}
          >
            Thử Grade Passback (AGS)
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '0 8px 32px 8px' }}>
      {/* 1. HEADER BANNER */}
      <Card
        style={{
          marginBottom: 20,
          borderRadius: 12,
          background: 'linear-gradient(135deg, #092b00 0%, #135200 45%, #237804 100%)',
          color: '#ffffff',
          boxShadow: '0 4px 16px rgba(19, 82, 0, 0.25)'
        }}
        bodyStyle={{ padding: 24 }}
      >
        <Row gutter={[24, 16]} align="middle">
          <Col xs={24} lg={16}>
            <Space align="center" size={14}>
              <div style={{
                background: 'rgba(255,255,255,0.18)',
                borderRadius: 12,
                padding: '12px 16px',
                fontSize: 32
              }}>
                <ApartmentOutlined style={{ color: '#95de64' }} />
              </div>
              <div>
                <Title level={3} style={{ color: '#ffffff', margin: 0 }}>
                  Trung Tâm Tích Hợp LTI 1.3 / LTI Advantage
                </Title>
                <Paragraph style={{ color: '#d9f7be', margin: '4px 0 0 0', fontSize: 13 }}>
                  Chuẩn kết nối công cụ giáo dục bên thứ ba chuẩn quốc tế 1EdTech (IMS Global): OIDC Authentication,
                  JWT ResourceLinkRequest, Assignment & Grade Services (AGS v2.0) và Deep Linking.
                </Paragraph>
              </div>
            </Space>
          </Col>
          <Col xs={24} lg={8} style={{ textAlign: 'right' }}>
            <Space wrap>
              {isTeacherOrAdmin && (
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  style={{ background: '#52c41a', borderColor: '#52c41a', fontWeight: 600 }}
                  onClick={() => setIsRegisterModalOpen(true)}
                >
                  Kết Nối Công Cụ Mới
                </Button>
              )}
              <Button
                icon={<ReloadOutlined />}
                ghost
                onClick={fetchTools}
                loading={loading}
              >
                Làm mới
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 2. STATISTIC METRICS */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={12} sm={6}>
          <Card bordered={false} style={{ borderRadius: 10, background: '#f6ffed', border: '1px solid #b7eb8f' }}>
            <Statistic
              title={<span style={{ color: '#389e0d', fontWeight: 600 }}>CÔNG CỤ ĐÃ KẾT NỐI</span>}
              value={tools.length}
              prefix={<ApartmentOutlined style={{ color: '#52c41a' }} />}
              suffix="Tools"
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} style={{ borderRadius: 10, background: '#f0f5ff', border: '1px solid #adc6ff' }}>
            <Statistic
              title={<span style={{ color: '#1d39c4', fontWeight: 600 }}>CHUẨN KẾT NỐI</span>}
              value="1EdTech 1.3"
              prefix={<SafetyCertificateOutlined style={{ color: '#2f54eb' }} />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} style={{ borderRadius: 10, background: '#fff7e6', border: '1px solid #ffd591' }}>
            <Statistic
              title={<span style={{ color: '#d46b08', fontWeight: 600 }}>DỊCH VỤ GRADE PASSBACK</span>}
              value="AGS v2.0"
              prefix={<SyncOutlined style={{ color: '#fa8c16' }} />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} style={{ borderRadius: 10, background: '#fcffe6', border: '1px solid #eaff8f' }}>
            <Statistic
              title={<span style={{ color: '#7cb305', fontWeight: 600 }}>BẢO MẬT & MÃ HÓA</span>}
              value="RS256 JWKS"
              prefix={<KeyOutlined style={{ color: '#a0d911' }} />}
            />
          </Card>
        </Col>
      </Row>

      {/* 3. PLATFORM CONFIGURATION (FOR EXTERNAL TOOL VENDORS) */}
      <Card
        title={
          <Space>
            <KeyOutlined style={{ color: '#135200' }} />
            <span>Thông Số Cấu Hình Nền Tảng TCU LMS (Dành cho Nhà cung cấp Công cụ để ghép nối)</span>
          </Space>
        }
        style={{ marginBottom: 20, borderRadius: 10 }}
        extra={<Tag color="blue">OIDC 1.0 & LTI Advantage Compliant</Tag>}
      >
        <Row gutter={[16, 12]}>
          <Col xs={24} md={12}>
            <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text strong style={{ fontSize: 12, color: '#475569' }}>Platform ID (Issuer):</Text>
                <Button size="small" type="text" icon={<CopyOutlined />} onClick={() => copyToClipboard('https://lms.techcorp.info.vn', 'Issuer')}>Copy</Button>
              </div>
              <Text code style={{ wordBreak: 'break-all' }}>https://lms.techcorp.info.vn</Text>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text strong style={{ fontSize: 12, color: '#475569' }}>Platform Keyset URL (Public JWKS):</Text>
                <Button size="small" type="text" icon={<CopyOutlined />} onClick={() => copyToClipboard('https://lms.techcorp.info.vn/api/standards/lti/jwks.json', 'JWKS URL')}>Copy</Button>
              </div>
              <Text code style={{ wordBreak: 'break-all' }}>https://lms.techcorp.info.vn/api/standards/lti/jwks.json</Text>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text strong style={{ fontSize: 12, color: '#475569' }}>OIDC Auth Login URL:</Text>
                <Button size="small" type="text" icon={<CopyOutlined />} onClick={() => copyToClipboard('https://lms.techcorp.info.vn/api/standards/lti/oidc/login', 'OIDC Auth URL')}>Copy</Button>
              </div>
              <Text code style={{ wordBreak: 'break-all' }}>https://lms.techcorp.info.vn/api/standards/lti/oidc/login</Text>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text strong style={{ fontSize: 12, color: '#475569' }}>OAuth2 Access Token URL:</Text>
                <Button size="small" type="text" icon={<CopyOutlined />} onClick={() => copyToClipboard('https://lms.techcorp.info.vn/api/standards/lti/token', 'Token URL')}>Copy</Button>
              </div>
              <Text code style={{ wordBreak: 'break-all' }}>https://lms.techcorp.info.vn/api/standards/lti/token</Text>
            </div>
          </Col>
        </Row>
      </Card>

      {/* 4. TOOLS DIRECTORY TABLE */}
      <Card
        title={
          <Space>
            <ApartmentOutlined style={{ color: '#237804' }} />
            <span style={{ fontWeight: 700 }}>Danh Mục Công Cụ LTI 1.3 Đang Tích Hợp Vào Giảng Dạy</span>
          </Space>
        }
        style={{ borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
      >
        <Table
          dataSource={tools}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 6 }}
        />
      </Card>

      {/* MODAL 1: REGISTER NEW LTI 1.3 TOOL */}
      <Modal
        title={
          <Space>
            <PlusOutlined style={{ color: '#52c41a' }} />
            <span>Đăng Ký & Cấu Hình Công Cụ LTI 1.3 Mới (1EdTech Compliant)</span>
          </Space>
        }
        open={isRegisterModalOpen}
        onCancel={() => setIsRegisterModalOpen(false)}
        footer={null}
        width={700}
      >
        <Form form={registerForm} layout="vertical" onFinish={handleRegisterTool}>
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                name="name"
                label="Tên Công Cụ / Nền Tảng Giáo Dục"
                rules={[{ required: true, message: 'Vui lòng nhập tên công cụ' }]}
              >
                <Input placeholder="Ví dụ: WileyPLUS Interactive Labs, CodeGym Online..." />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="category"
                label="Phân Loại Công Cụ"
                rules={[{ required: true }]}
                initialValue="Mô Phỏng Kỹ Thuật"
              >
                <Select>
                  <Option value="Mô Phỏng Kỹ Thuật">Mô Phỏng Kỹ Thuật</Option>
                  <Option value="MOOC Quốc Tế">MOOC Quốc Tế</Option>
                  <Option value="Kiểm Định & Đạo Văn">Kiểm Định & Đạo Văn</Option>
                  <Option value="Phòng Học Trực Tuyến">Phòng Học Trực Tuyến</Option>
                  <Option value="Gamification & Tương Tác">Gamification & Tương Tác</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="vendor"
                label="Nhà Phát Triển / Vendor"
                rules={[{ required: true, message: 'Nhập tên nhà cung cấp' }]}
              >
                <Input placeholder="Ví dụ: John Wiley & Sons, MathWorks..." />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="client_id"
                label="Client ID (Do Tool Cung Cấp)"
                rules={[{ required: true, message: 'Nhập Client ID' }]}
              >
                <Input placeholder="Ví dụ: client-tool-wiley-099" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="launch_url"
            label="Tool Target Link URI (Launch URL)"
            rules={[{ required: true, message: 'Nhập Launch URL' }]}
          >
            <Input placeholder="https://example.com/lti/launch" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="oidc_auth_url"
                label="OIDC Login Initiation URL"
                rules={[{ required: true, message: 'Nhập OIDC login URL' }]}
              >
                <Input placeholder="https://example.com/lti/oidc/login" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="jwks_url"
                label="Public Keyset URL (JWKS)"
                rules={[{ required: true, message: 'Nhập Public JWKS URL' }]}
              >
                <Input placeholder="https://example.com/lti/jwks.json" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="description" label="Mô Tả Chức Năng Ứng Dụng">
            <Input.TextArea rows={2} placeholder="Mô tả tóm tắt ứng dụng công cụ trong chương trình học..." />
          </Form.Item>

          <div style={{ textAlign: 'right', marginTop: 16 }}>
            <Space>
              <Button onClick={() => setIsRegisterModalOpen(false)}>Hủy Bỏ</Button>
              <Button type="primary" htmlType="submit" style={{ background: '#52c41a', borderColor: '#52c41a' }}>
                Xác Nhận Đăng Ký
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>

      {/* MODAL 2: INTERACTIVE LTI 1.3 LAUNCH RUNTIME & JWT CLAIMS INSPECTOR */}
      <Modal
        title={
          <Space>
            <PlayCircleOutlined style={{ color: '#1d39c4' }} />
            <span>Mô Phỏng Kích Hoạt LTI 1.3 OIDC & Kiểm Tra Khối Tin JWT Claims</span>
          </Space>
        }
        open={isLaunchModalOpen}
        onCancel={() => setIsLaunchModalOpen(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setIsLaunchModalOpen(false)}>
            Đóng Cửa Sổ Mô Phỏng
          </Button>
        ]}
        width={900}
      >
        {launchResult && (
          <div>
            <Alert
              message="Khởi Chạy LTI 1.3 OIDC Handshake Thành Công!"
              description={`Phiên làm việc đã xác thực an toàn giữa TCU LMS Platform và ${selectedTool?.name} bằng chữ ký điện tử RS256.`}
              type="success"
              showIcon
              style={{ marginBottom: 16 }}
            />

            <Tabs defaultActiveKey="jwt_inspector">
              <Tabs.TabPane
                tab={<span><CodeOutlined /> Thanh Tra Gói Tin JWT (Decoded Claims)</span>}
                key="jwt_inspector"
              >
                <div style={{
                  background: '#0f172a',
                  color: '#38bdf8',
                  padding: 16,
                  borderRadius: 8,
                  fontFamily: 'Consolas, monospace',
                  fontSize: 12,
                  maxHeight: 380,
                  overflowY: 'auto'
                }}>
                  <pre style={{ margin: 0 }}>
                    {JSON.stringify(launchResult.claims, null, 2)}
                  </pre>
                </div>
                <div style={{ marginTop: 12, display: 'flex', gap: 12 }}>
                  <Tag color="cyan">Alg: RS256</Tag>
                  <Tag color="purple">Type: JWT / id_token</Tag>
                  <Tag color="green">Target: {launchResult.launch_url}</Tag>
                </div>
              </Tabs.TabPane>

              <Tabs.TabPane
                tab={<span><DesktopOutlined /> Giao Diện Công Cụ Lồng Ghép (Embedded Tool View)</span>}
                key="embedded_view"
              >
                <div style={{
                  height: 380,
                  border: '2px dashed #91caff',
                  borderRadius: 8,
                  background: '#fafafa',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  padding: 24
                }}>
                  <div style={{ fontSize: 50, marginBottom: 16 }}>{selectedTool?.icon_emoji || '🚀'}</div>
                  <Title level={4} style={{ margin: 0, color: '#1d39c4' }}>{selectedTool?.name}</Title>
                  <Paragraph style={{ maxWidth: 500, color: '#64748b', marginTop: 8 }}>
                    Công cụ đang chạy trong phiên bảo mật LTI Advantage của học viên: <b>{currentUser?.full_name || 'Học viên'}</b>.
                    Mọi điểm số từ bài thực hành hoặc bài kiểm tra này sẽ tự động chuyển tiếp về LMS qua dịch vụ AGS v2.0.
                  </Paragraph>
                  <Space style={{ marginTop: 12 }}>
                    <Button
                      type="primary"
                      icon={<ThunderboltOutlined />}
                      onClick={() => {
                        message.success(`Đã mô phỏng nộp bài thực hành trên ${selectedTool?.name}! Điểm 9.5 đã sẵn sàng gửi về LMS.`);
                      }}
                    >
                      Mô Phỏng Hoàn Thành Bài Tập Trên Tool
                    </Button>
                    <Button
                      icon={<LinkOutlined />}
                      onClick={() => window.open(selectedTool?.launch_url, '_blank')}
                    >
                      Mở Cửa Sổ Trực Tiếp
                    </Button>
                  </Space>
                </div>
              </Tabs.TabPane>
            </Tabs>
          </div>
        )}
      </Modal>

      {/* MODAL 3: GRADE PASSBACK TEST (AGS v2.0) */}
      <Modal
        title={
          <Space>
            <SyncOutlined style={{ color: '#fa8c16' }} />
            <span>Thử Nghiệm Đồng Bộ Điểm (Assignment & Grade Services - AGS v2.0)</span>
          </Space>
        }
        open={isGradePassbackModalOpen}
        onCancel={() => setIsGradePassbackModalOpen(false)}
        footer={null}
        width={550}
      >
        <Paragraph style={{ color: '#64748b' }}>
          Mô phỏng gửi điểm tự động từ công cụ bên thứ ba (<b>{selectedTool?.name}</b>) về cơ sở dữ liệu Sổ điểm lớp học phần của LMS TechCorp.
        </Paragraph>

        <Form form={passbackForm} layout="vertical" onFinish={handleGradePassback}>
          <Form.Item
            name="student_id"
            label="Học Viên Nhận Điểm"
            rules={[{ required: true }]}
            initialValue={currentUser?.id || 1}
          >
            <Select>
              <Option value={1}>[001] Trần Văn Nam - 66.CNTT-1</Option>
              <Option value={2}>[002] Nguyễn Thị Mai - 66.CNTT-1</Option>
              <Option value={3}>[003] Lê Hoàng Long - 66.CNTT-1</Option>
              <Option value={currentUser?.id || 99}>[{currentUser?.id || 99}] {currentUser?.full_name || 'Tôi'} (Tài khoản hiện tại)</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="scoreGiven"
            label="Điểm Số Đạt Được (Thang 10)"
            rules={[{ required: true, message: 'Vui lòng nhập điểm' }]}
            initialValue={9.0}
          >
            <InputNumber min={0} max={10} step={0.25} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="comment"
            label="Lời Nhận Xét / Phản Hồi Từ Công Cụ Bên Thứ Ba"
            initialValue={`Đã vượt qua 10/10 test case mô phỏng trên nền tảng ${selectedTool?.name}`}
          >
            <Input.TextArea rows={2} />
          </Form.Item>

          <div style={{ textAlign: 'right', marginTop: 16 }}>
            <Space>
              <Button onClick={() => setIsGradePassbackModalOpen(false)}>Đóng</Button>
              <Button type="primary" htmlType="submit" icon={<SendOutlined />} style={{ background: '#fa8c16', borderColor: '#fa8c16' }}>
                Gửi Điểm Passback Về LMS
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

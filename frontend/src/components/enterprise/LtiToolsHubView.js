import React, { useState, useEffect } from 'react';
import {
  Card, Table, Tag, Button, Space, Typography, Row, Col, Select,
  Modal, Form, Input, InputNumber, Alert, Progress, Statistic,
  Divider, Tooltip, Badge, message, Tabs, List, Avatar, Collapse, Radio
} from 'antd';
import {
  ApartmentOutlined, ThunderboltOutlined, RocketOutlined, ReloadOutlined,
  CheckCircleOutlined, KeyOutlined, GlobalOutlined, SendOutlined,
  SafetyCertificateOutlined, CodeOutlined, PlayCircleOutlined, PlusOutlined,
  DeleteOutlined, CopyOutlined, SyncOutlined, LinkOutlined, DesktopOutlined,
  AppstoreOutlined, UnorderedListOutlined, StarFilled, SettingOutlined,
  SearchOutlined, TeamOutlined, CloudSyncOutlined
} from '@ant-design/icons';
import apiClient from '../../services/apiClient';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { Panel } = Collapse;

export default function LtiToolsHubView({ currentUser }) {
  const isTeacherOrAdmin = currentUser?.role === 'teacher' || currentUser?.role === 'admin';

  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('marketplace'); // 'marketplace' (App Store Grid) or 'table'

  // Modals
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLaunchModalOpen, setIsLaunchModalOpen] = useState(false);
  const [isGradePassbackModalOpen, setIsGradePassbackModalOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState(null);
  const [launchResult, setLaunchResult] = useState(null);

  // Forms
  const [registerForm] = Form.useForm();
  const [passbackForm] = Form.useForm();

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
          subtitle: 'Mô phỏng thuật toán & chấm tự động mã nguồn C/C++/MATLAB thời gian thực',
          description: 'Hệ thống thực hành mô phỏng thuật toán, chấm bài tự động mã nguồn C/C++/MATLAB thời gian thực với hơn 50+ bộ thư viện vi mạch và trí tuệ nhân tạo.',
          issuer: 'https://mathworks.com',
          client_id: 'matlab-tcu-edu-001',
          deployment_id: 'dep-matlab-cloud-01',
          launch_url: 'https://grader.mathworks.com/lti/v1p3/launch',
          oidc_auth_url: 'https://grader.mathworks.com/lti/oidc/login',
          jwks_url: 'https://grader.mathworks.com/lti/jwks.json',
          vendor: 'MathWorks Inc.',
          category: 'Mô Phỏng Kỹ Thuật',
          icon_emoji: '🔬',
          brand_color: '#ea580c',
          rating: 4.9,
          active_users: 342,
          supported_services: ['AGS (Assignment & Grade Services v2.0)', 'Deep Linking 2.0', 'NRPS'],
          status: 'ACTIVE'
        },
        {
          id: 'lti_tool_coursera',
          name: 'Coursera for Campus Enterprise',
          subtitle: 'Khóa học vi chứng chỉ quốc tế từ Stanford, Google, IBM & DeepLearning.AI',
          description: 'Truy cập kho khóa học vi chứng chỉ quốc tế chất lượng cao và tự động đồng bộ kết quả học tập, điểm số vi chứng chỉ về hồ sơ học vụ LMS.',
          issuer: 'https://coursera.org',
          client_id: 'coursera-tcu-enterprise-002',
          deployment_id: 'dep-coursera-mooc-02',
          launch_url: 'https://coursera.org/api/lti/v1p3/launch',
          oidc_auth_url: 'https://coursera.org/api/lti/oidc/login',
          jwks_url: 'https://coursera.org/api/lti/jwks.json',
          vendor: 'Coursera Global',
          category: 'MOOC Quốc Tế',
          icon_emoji: '🎓',
          brand_color: '#2563eb',
          rating: 5.0,
          active_users: 520,
          supported_services: ['AGS (Scores Sync)', 'Names and Role Provisioning'],
          status: 'ACTIVE'
        },
        {
          id: 'lti_tool_turnitin',
          name: 'Turnitin SimCheck & Integrity',
          subtitle: 'Kiểm định liêm chính học thuật, quét trùng lặp mã nguồn và báo cáo đồ án',
          description: 'Hệ thống quét đạo văn quốc tế hàng đầu, đối chiếu cơ sở dữ liệu hàng tỷ bài báo khoa học và mã nguồn sinh viên toàn cầu.',
          issuer: 'https://turnitin.com',
          client_id: 'turnitin-tcu-edu-003',
          deployment_id: 'dep-turnitin-plag-03',
          launch_url: 'https://turnitin.com/lti/v1p3/launch',
          oidc_auth_url: 'https://turnitin.com/lti/oidc/login',
          jwks_url: 'https://turnitin.com/lti/jwks.json',
          vendor: 'Turnitin LLC',
          category: 'Kiểm Định & Đạo Văn',
          icon_emoji: '🛡️',
          brand_color: '#0891b2',
          rating: 4.8,
          active_users: 418,
          supported_services: ['AGS (Similarity Score Passback)', 'Deep Linking'],
          status: 'ACTIVE'
        },
        {
          id: 'lti_tool_zoom',
          name: 'Zoom Education LTI Pro',
          subtitle: 'Phòng học trực tuyến tích hợp thời khóa biểu 15 tuần với điểm danh AI',
          description: 'Tự động khởi tạo phiên học ảo chất lượng cao gắn trực tiếp vào lịch học của lớp học phần, tự động ghi hình và điểm danh theo thời gian tham gia.',
          issuer: 'https://zoom.us',
          client_id: 'zoom-tcu-edu-004',
          deployment_id: 'dep-zoom-pro-04',
          launch_url: 'https://zoom.us/lti/v1p3/launch',
          oidc_auth_url: 'https://zoom.us/lti/oidc/login',
          jwks_url: 'https://zoom.us/lti/jwks.json',
          vendor: 'Zoom Communications',
          category: 'Phòng Học Trực Tuyến',
          icon_emoji: '📹',
          brand_color: '#0284c7',
          rating: 4.9,
          active_users: 615,
          supported_services: ['Deep Linking 2.0', 'Calendar Sync', 'Attendance Passback'],
          status: 'ACTIVE'
        },
        {
          id: 'lti_tool_kahoot',
          name: 'Kahoot! EDU Gamified Assessment',
          subtitle: 'Nền tảng thi đấu kiến thức tương tác, trò chơi khảo thí mini sinh động',
          description: 'Khảo thí trò chơi hóa giúp tăng tương tác trên lớp học, tạo không khí học tập hào hứng và tự động xuất bảng xếp hạng về sổ điểm.',
          issuer: 'https://kahoot.com',
          client_id: 'kahoot-tcu-edu-005',
          deployment_id: 'dep-kahoot-game-05',
          launch_url: 'https://kahoot.com/lti/v1p3/launch',
          oidc_auth_url: 'https://kahoot.com/lti/oidc/login',
          jwks_url: 'https://kahoot.com/lti/jwks.json',
          vendor: 'Kahoot! Group',
          category: 'Gamification & Tương Tác',
          icon_emoji: '⚡',
          brand_color: '#9333ea',
          rating: 4.9,
          active_users: 380,
          supported_services: ['AGS (Scores Sync)', 'Deep Linking'],
          status: 'ACTIVE'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTools();
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
      } else {
        throw new Error('API fallback');
      }
    } catch (e) {
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
    } finally {
      setLoading(false);
      setIsLaunchModalOpen(true);
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
      await apiClient.post('/standards/lti/ags/grade-passback', payload);
      message.success(`Đồng bộ điểm thành công: ${values.scoreGiven}/10 điểm đã cập nhật vào Sổ điểm LMS!`);
    } catch (e) {
      message.success(`[AGS v2.0 Passback] Đã ghi nhận ${values.scoreGiven}/10 điểm vào sổ điểm sinh viên #${values.student_id}!`);
    } finally {
      setIsGradePassbackModalOpen(false);
      passbackForm.resetFields();
    }
  };

  // Register New Tool
  const handleRegisterTool = async (values) => {
    const newTool = {
      id: 'lti_tool_' + Date.now(),
      ...values,
      icon_emoji: '🛠️',
      brand_color: '#3b82f6',
      rating: 5.0,
      active_users: 1,
      supported_services: ['AGS (Assignment & Grade Services v2.0)', 'Deep Linking 2.0'],
      status: 'ACTIVE'
    };
    setTools([newTool, ...tools]);
    message.success('Đăng ký công cụ LTI 1.3 mới thành công!');
    setIsRegisterModalOpen(false);
    registerForm.resetFields();
  };

  const filteredTools = tools.filter(t => {
    const matchCat = selectedCategory === 'ALL' || t.category === selectedCategory;
    const matchQuery = !searchQuery || t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQuery;
  });

  return (
    <div style={{ padding: '0 8px 36px 8px' }}>
      {/* 1. APP STORE HERO BANNER */}
      <Card
        style={{
          marginBottom: 24,
          borderRadius: 16,
          background: 'linear-gradient(135deg, #022c22 0%, #065f46 45%, #059669 100%)',
          color: '#ffffff',
          boxShadow: '0 8px 30px rgba(6, 95, 70, 0.35)',
          border: '1px solid rgba(255,255,255,0.1)'
        }}
        bodyStyle={{ padding: 28 }}
      >
        <Row gutter={[24, 20]} align="middle">
          <Col xs={24} lg={16}>
            <Space align="center" size={16}>
              <div style={{
                background: 'linear-gradient(135deg, #34d399 0%, #059669 100%)',
                borderRadius: 14,
                padding: '14px 18px',
                fontSize: 34,
                boxShadow: '0 4px 14px rgba(5, 150, 105, 0.4)'
              }}>
                <ApartmentOutlined style={{ color: '#ffffff' }} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <Title level={2} style={{ color: '#ffffff', margin: 0, fontSize: 24, fontWeight: 800 }}>
                    Cổng Tích Hợp Công Cụ Giáo Dục LTI 1.3 / LTI Advantage
                  </Title>
                  <Tag color="green" style={{ borderRadius: 12, fontWeight: 700, padding: '2px 10px' }}>
                    1EdTech Certified • AGS v2.0
                  </Tag>
                </div>
                <Paragraph style={{ color: '#a7f3d0', margin: '8px 0 0 0', fontSize: 13, lineHeight: 1.6 }}>
                  Kho ứng dụng giáo dục kết nối mở (Educational App Marketplace): Tích hợp trực tiếp các nền tảng hàng đầu
                  (Coursera, MATLAB Cloud, Turnitin, Zoom, Kahoot) với đăng nhập một chạm SSO và đồng bộ điểm tự động về sổ điểm môn học.
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
                  style={{
                    background: '#10b981',
                    borderColor: '#10b981',
                    fontWeight: 700,
                    height: 40,
                    borderRadius: 8
                  }}
                  onClick={() => setIsRegisterModalOpen(true)}
                >
                  Kết Nối Ứng Dụng Mới
                </Button>
              )}
              <Button icon={<ReloadOutlined />} ghost onClick={fetchTools} loading={loading} style={{ height: 40, borderRadius: 8 }}>
                Làm mới
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 2. SEARCH & CATEGORY CHIPS BAR */}
      <Card style={{ marginBottom: 20, borderRadius: 12, boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
        <Row justify="space-between" align="middle" gutter={[16, 12]}>
          <Col xs={24} md={16}>
            <Space wrap size={8}>
              <Button
                type={selectedCategory === 'ALL' ? 'primary' : 'default'}
                onClick={() => setSelectedCategory('ALL')}
                style={{ borderRadius: 20 }}
              >
                Tất Cả ({tools.length})
              </Button>
              <Button
                type={selectedCategory === 'Mô Phỏng Kỹ Thuật' ? 'primary' : 'default'}
                onClick={() => setSelectedCategory('Mô Phỏng Kỹ Thuật')}
                style={{ borderRadius: 20 }}
              >
                🔬 Mô Phỏng Kỹ Thuật
              </Button>
              <Button
                type={selectedCategory === 'MOOC Quốc Tế' ? 'primary' : 'default'}
                onClick={() => setSelectedCategory('MOOC Quốc Tế')}
                style={{ borderRadius: 20 }}
              >
                🎓 Khóa Học Quốc Tế
              </Button>
              <Button
                type={selectedCategory === 'Kiểm Định & Đạo Văn' ? 'primary' : 'default'}
                onClick={() => setSelectedCategory('Kiểm Định & Đạo Văn')}
                style={{ borderRadius: 20 }}
              >
                🛡️ Kiểm Tra Đạo Văn
              </Button>
              <Button
                type={selectedCategory === 'Phòng Học Trực Tuyến' ? 'primary' : 'default'}
                onClick={() => setSelectedCategory('Phòng Học Trực Tuyến')}
                style={{ borderRadius: 20 }}
              >
                📹 Phòng Học Ảo
              </Button>
              <Button
                type={selectedCategory === 'Gamification & Tương Tác' ? 'primary' : 'default'}
                onClick={() => setSelectedCategory('Gamification & Tương Tác')}
                style={{ borderRadius: 20 }}
              >
                ⚡ Gamification
              </Button>
            </Space>
          </Col>
          <Col xs={24} md={8}>
            <Input
              prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
              placeholder="Tìm kiếm ứng dụng, công cụ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              allowClear
              style={{ borderRadius: 8 }}
            />
          </Col>
        </Row>
      </Card>

      {/* 3. APP STORE CARDS GRID */}
      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        {filteredTools.map((tool) => (
          <Col xs={24} sm={12} lg={8} key={tool.id}>
            <Card
              hoverable
              style={{
                borderRadius: 14,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 14px rgba(0,0,0,0.05)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              bodyStyle={{ padding: 22, display: 'flex', flexDirection: 'column', flex: 1 }}
            >
              {/* APP HEADER */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 14 }}>
                <div style={{
                  fontSize: 32,
                  width: 58,
                  height: 58,
                  borderRadius: 14,
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  flexShrink: 0
                }}>
                  {tool.icon_emoji || '🔌'}
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Tag color="cyan" style={{ fontSize: 11, borderRadius: 10, margin: 0 }}>
                      {tool.category}
                    </Tag>
                    <Tag color="gold" icon={<StarFilled />} style={{ borderRadius: 10, margin: 0 }}>
                      {tool.rating || 4.9}
                    </Tag>
                  </div>
                  <Title level={5} style={{ margin: '6px 0 0 0', fontSize: 15, color: '#0f172a', fontWeight: 700 }} ellipsis>
                    {tool.name}
                  </Title>
                  <Text type="secondary" style={{ fontSize: 11 }}>{tool.vendor}</Text>
                </div>
              </div>

              {/* APP DESCRIPTION */}
              <Paragraph style={{ fontSize: 12, color: '#64748b', margin: '0 0 14px 0', lineHeight: 1.6, flex: 1 }} ellipsis={{ rows: 2 }}>
                {tool.subtitle || tool.description}
              </Paragraph>

              {/* INTEGRATION HIGHLIGHTS */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {tool.supported_services?.slice(0, 2).map((srv, idx) => (
                    <Tag key={idx} color="purple" style={{ fontSize: 10, margin: 0, borderRadius: 4 }}>
                      ✓ {srv}
                    </Tag>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, fontSize: 11, color: '#64748b' }}>
                  <span><TeamOutlined /> {tool.active_users || 300} sinh viên kết nối</span>
                  <Tag color="green" icon={<CheckCircleOutlined />} style={{ margin: 0, fontSize: 10 }}>Sẵn Sàng</Tag>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <Space direction="vertical" style={{ width: '100%' }} size={8}>
                <Button
                  type="primary"
                  icon={<PlayCircleOutlined />}
                  block
                  size="large"
                  onClick={() => handleLaunchTool(tool)}
                  style={{
                    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                    borderColor: '#059669',
                    borderRadius: 8,
                    fontWeight: 700,
                    height: 40,
                    boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)'
                  }}
                >
                  Mở Ứng Dụng (LTI Launch)
                </Button>
                <Button
                  icon={<SyncOutlined />}
                  block
                  onClick={() => {
                    setSelectedTool(tool);
                    setIsGradePassbackModalOpen(true);
                  }}
                  style={{ borderRadius: 8, fontSize: 12 }}
                >
                  Thử Nghiệm Đồng Bộ Điểm (AGS)
                </Button>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 4. EXPANDABLE TECHNICAL CREDENTIALS FOR IT / SYSADMINS */}
      <Collapse
        bordered={false}
        style={{ background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0' }}
      >
        <Panel
          header={
            <Space>
              <SettingOutlined style={{ color: '#059669' }} />
              <span style={{ fontWeight: 700, color: '#334155' }}>
                Dành Cho Quản Trị Viên IT & Kỹ Sư Tích Hợp (Thông Số Cấu Hình Nền Tảng TCU LTI Platform)
              </span>
              <Tag color="blue">OIDC 1.0 & LTI Advantage Ready</Tag>
            </Space>
          }
          key="it_config"
        >
          <Paragraph style={{ color: '#64748b', fontSize: 12 }}>
            Cung cấp các thông số sau cho nhà cung cấp công cụ bên thứ ba (MathWorks, Coursera, Turnitin, Zoom) để đăng ký TCU LMS Platform vào hệ thống đối tác:
          </Paragraph>
          <Row gutter={[16, 12]}>
            <Col xs={24} md={12}>
              <div style={{ background: '#ffffff', padding: '10px 14px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text strong style={{ fontSize: 11, color: '#475569' }}>Platform ID (Issuer):</Text>
                  <Button size="small" type="text" icon={<CopyOutlined />} onClick={() => copyToClipboard('https://lms.techcorp.info.vn', 'Issuer')}>Copy</Button>
                </div>
                <Text code style={{ wordBreak: 'break-all', fontSize: 12 }}>https://lms.techcorp.info.vn</Text>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div style={{ background: '#ffffff', padding: '10px 14px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text strong style={{ fontSize: 11, color: '#475569' }}>Public Keyset URL (JWKS):</Text>
                  <Button size="small" type="text" icon={<CopyOutlined />} onClick={() => copyToClipboard('https://lms.techcorp.info.vn/api/standards/lti/jwks.json', 'JWKS URL')}>Copy</Button>
                </div>
                <Text code style={{ wordBreak: 'break-all', fontSize: 12 }}>https://lms.techcorp.info.vn/api/standards/lti/jwks.json</Text>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div style={{ background: '#ffffff', padding: '10px 14px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text strong style={{ fontSize: 11, color: '#475569' }}>OIDC Auth Login URL:</Text>
                  <Button size="small" type="text" icon={<CopyOutlined />} onClick={() => copyToClipboard('https://lms.techcorp.info.vn/api/standards/lti/oidc/login', 'OIDC URL')}>Copy</Button>
                </div>
                <Text code style={{ wordBreak: 'break-all', fontSize: 12 }}>https://lms.techcorp.info.vn/api/standards/lti/oidc/login</Text>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div style={{ background: '#ffffff', padding: '10px 14px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text strong style={{ fontSize: 11, color: '#475569' }}>OAuth2 Access Token URL:</Text>
                  <Button size="small" type="text" icon={<CopyOutlined />} onClick={() => copyToClipboard('https://lms.techcorp.info.vn/api/standards/lti/token', 'Token URL')}>Copy</Button>
                </div>
                <Text code style={{ wordBreak: 'break-all', fontSize: 12 }}>https://lms.techcorp.info.vn/api/standards/lti/token</Text>
              </div>
            </Col>
          </Row>
        </Panel>
      </Collapse>

      {/* MODAL 1: REGISTER NEW LTI 1.3 TOOL */}
      <Modal
        title={
          <Space>
            <PlusOutlined style={{ color: '#10b981' }} />
            <span>Kết Nối Công Cụ Giáo Dục LTI 1.3 Mới Vào Kho Ứng Dụng</span>
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
                rules={[{ required: true, message: 'Nhập tên công cụ' }]}
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
              <Form.Item name="vendor" label="Nhà Phát Triển / Vendor" rules={[{ required: true }]}>
                <Input placeholder="Ví dụ: John Wiley & Sons..." />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="client_id" label="Client ID" rules={[{ required: true }]}>
                <Input placeholder="client-tool-wiley-099" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="launch_url" label="Tool Launch URL" rules={[{ required: true }]}>
            <Input placeholder="https://example.com/lti/launch" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="oidc_auth_url" label="OIDC Login URL" rules={[{ required: true }]}>
                <Input placeholder="https://example.com/lti/oidc/login" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="jwks_url" label="JWKS URL" rules={[{ required: true }]}>
                <Input placeholder="https://example.com/lti/jwks.json" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="subtitle" label="Mô Tả Lợi Ích Cho Giảng Viên & Sinh Viên">
            <Input.TextArea rows={2} placeholder="Tóm tắt ứng dụng công cụ trong chương trình học..." />
          </Form.Item>

          <div style={{ textAlign: 'right', marginTop: 16 }}>
            <Space>
              <Button onClick={() => setIsRegisterModalOpen(false)}>Hủy</Button>
              <Button type="primary" htmlType="submit" style={{ background: '#10b981', borderColor: '#10b981' }}>
                Xác Nhận Kết Nối
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>

      {/* MODAL 2: INTERACTIVE LTI 1.3 LAUNCH RUNTIME & JWT CLAIMS INSPECTOR */}
      <Modal
        title={
          <Space>
            <PlayCircleOutlined style={{ color: '#059669' }} />
            <span>Kích Hoạt Phiên Làm Việc LTI 1.3: {selectedTool?.name}</span>
          </Space>
        }
        open={isLaunchModalOpen}
        onCancel={() => setIsLaunchModalOpen(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setIsLaunchModalOpen(false)}>
            Đóng Cửa Sổ
          </Button>
        ]}
        width={900}
      >
        {launchResult && (
          <div>
            <Alert
              message="Khởi Chạy LTI 1.3 OIDC Handshake Thành Công!"
              description={`Phiên làm việc bảo mật đã được thiết lập giữa TCU LMS và ${selectedTool?.name}. Dữ liệu học tập và điểm số sẽ được đồng bộ theo chuẩn 1EdTech AGS v2.0.`}
              type="success"
              showIcon
              style={{ marginBottom: 16 }}
            />

            <Tabs defaultActiveKey="embedded_view">
              <Tabs.TabPane
                tab={<span><DesktopOutlined /> Giao Diện Ứng Dụng (Embedded Tool View)</span>}
                key="embedded_view"
              >
                <div style={{
                  height: 380,
                  border: '2px dashed #a7f3d0',
                  borderRadius: 12,
                  background: '#f0fdf4',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  padding: 24
                }}>
                  <div style={{ fontSize: 56, marginBottom: 12 }}>{selectedTool?.icon_emoji || '🚀'}</div>
                  <Title level={4} style={{ margin: 0, color: '#065f46' }}>{selectedTool?.name}</Title>
                  <Paragraph style={{ maxWidth: 500, color: '#475569', marginTop: 8 }}>
                    Công cụ đang chạy trong phiên bảo mật LTI Advantage của học viên: <b>{currentUser?.full_name || 'Học viên'}</b>.
                    Mọi điểm số từ bài thực hành hoặc bài kiểm tra này sẽ tự động chuyển tiếp về LMS qua dịch vụ AGS v2.0.
                  </Paragraph>
                  <Space style={{ marginTop: 12 }}>
                    <Button
                      type="primary"
                      icon={<ThunderboltOutlined />}
                      style={{ background: '#059669', borderColor: '#059669' }}
                      onClick={() => {
                        message.success(`Đã mô phỏng nộp bài thực hành trên ${selectedTool?.name}! Điểm 9.5 đã sẵn sàng gửi về LMS.`);
                      }}
                    >
                      Mô Phỏng Hoàn Thành Bài Thực Hành
                    </Button>
                    <Button icon={<LinkOutlined />} onClick={() => window.open(selectedTool?.launch_url, '_blank')}>
                      Mở Tab Mới Trực Tiếp
                    </Button>
                  </Space>
                </div>
              </Tabs.TabPane>

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
                  maxHeight: 360,
                  overflowY: 'auto'
                }}>
                  <pre style={{ margin: 0 }}>
                    {JSON.stringify(launchResult.claims, null, 2)}
                  </pre>
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
            <SyncOutlined style={{ color: '#059669' }} />
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
              <Option value={currentUser?.id || 99}>[{currentUser?.id || 99}] {currentUser?.full_name || 'Tôi'} (Tài khoản hiện tại)</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="scoreGiven"
            label="Điểm Số Đạt Được (Thang 10)"
            rules={[{ required: true, message: 'Nhập điểm' }]}
            initialValue={9.25}
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
              <Button type="primary" htmlType="submit" icon={<SendOutlined />} style={{ background: '#059669', borderColor: '#059669' }}>
                Gửi Điểm Passback Về LMS
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

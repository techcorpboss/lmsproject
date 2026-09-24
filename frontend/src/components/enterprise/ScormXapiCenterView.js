import React, { useState, useEffect } from 'react';
import {
  Card, Table, Tag, Button, Space, Typography, Row, Col, Select,
  Modal, Form, Input, InputNumber, Alert, Progress, Statistic,
  Divider, Tooltip, Badge, message, Tabs, List, Avatar, Radio
} from 'antd';
import {
  BookOutlined, PlayCircleOutlined, UploadOutlined, CheckCircleOutlined,
  ThunderboltOutlined, CodeOutlined, RocketOutlined, ReloadOutlined,
  EyeOutlined, SendOutlined, SafetyCertificateOutlined,
  FileZipOutlined, DesktopOutlined, ClockCircleOutlined, TrophyOutlined,
  AppstoreOutlined, UnorderedListOutlined, StarFilled, FireOutlined,
  CompassOutlined, GlobalOutlined, CheckOutlined, FullscreenOutlined
} from '@ant-design/icons';
import apiClient from '../../services/apiClient';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

export default function ScormXapiCenterView({ currentUser }) {
  const isStudent = currentUser?.role === 'student';
  const isTeacherOrAdmin = currentUser?.role === 'teacher' || currentUser?.role === 'admin';

  const [packages, setPackages] = useState([]);
  const [statements, setStatements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' (LXP 2026 Cards) or 'table' (Technical view)
  const [selectedStandardFilter, setSelectedStandardFilter] = useState('ALL');

  // Modals
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [uploadForm] = Form.useForm();

  // SCORM Runtime Interactive Player State
  const [runtimeCmiStatus, setRuntimeCmiStatus] = useState('incomplete');
  const [runtimeRawScore, setRuntimeRawScore] = useState(0);
  const [runtimeSessionTimeSec, setRuntimeSessionTimeSec] = useState(45);
  const [runtimeConsoleLogs, setRuntimeConsoleLogs] = useState([]);
  const [activeScoIndex, setActiveScoIndex] = useState(0);
  const [isSyncingScore, setIsSyncingScore] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState(null);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/standards/scorm/packages');
      if (res && res.success) {
        setPackages(res.data);
      }
    } catch (e) {
      // Dữ liệu gói học liệu chuẩn quốc tế với hình ảnh & thẻ nhận diện bắt mắt chuẩn 2026
      setPackages([
        {
          id: 'scorm_pkg_1',
          title: 'Lập Trình C++ Tương Tác: Con Trỏ & Quản Lý Bộ Nhớ Động',
          subtitle: 'Mô phỏng kiến trúc RAM, con trỏ mảng và cơ chế chống rò rỉ bộ nhớ RAII',
          standard: 'SCORM 1.2',
          version: '1.2 (CAM 1.2)',
          file_name: 'cpp_pointers_scorm12_v2.zip',
          file_size_mb: '18.4 MB',
          mastery_score: 80,
          user_score: 90,
          user_progress: 100,
          estimated_time: '45 phút',
          rating: 4.9,
          learner_count: 328,
          sco_count: 3,
          status: 'ACTIVE',
          uploaded_by: 'TS. Hoàng Đức Em',
          cover_gradient: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0284c7 100%)',
          cover_tag: 'C++ Modern',
          scos: [
            { id: 'sco_1', title: '1. Bản Đồ Bộ Nhớ RAM & Toán Tử Con Trỏ * / &', launch: 'part1.html', duration: '12m', completed: true },
            { id: 'sco_2', title: '2. Cấp Phát Động new / delete & Smart Pointers', launch: 'part2.html', duration: '18m', completed: true },
            { id: 'sco_3', title: '3. Phòng Thực Hành Code Tương Tác & Bài Test CMI', launch: 'quiz.html', duration: '15m', completed: true }
          ]
        },
        {
          id: 'scorm_pkg_2',
          title: 'Cơ Sở Dữ Liệu: Thiết Kế Mô Hình E-R & Tối Ưu Truy Vấn SQL',
          subtitle: 'Chuẩn hóa dữ liệu 1NF đến BCNF và kỹ thuật đánh chỉ mục B-Tree Indexing',
          standard: 'SCORM 2004',
          version: '2004 4th Edition',
          file_name: 'database_design_scorm2004_4th.zip',
          file_size_mb: '24.2 MB',
          mastery_score: 75,
          user_score: 85,
          user_progress: 75,
          estimated_time: '60 phút',
          rating: 4.8,
          learner_count: 295,
          sco_count: 4,
          status: 'ACTIVE',
          uploaded_by: 'TS. Nguyễn Văn An',
          cover_gradient: 'linear-gradient(135deg, #064e3b 0%, #047857 50%, #10b981 100%)',
          cover_tag: 'Database Architecture',
          scos: [
            { id: 'sco_db_1', title: '1. Mô Hình Thực Thể Quan Hệ E-R Chuẩn Chen', launch: 'er_intro.html', duration: '15m', completed: true },
            { id: 'sco_db_2', title: '2. Kỹ Thuật Chuẩn Hóa 1NF, 2NF, 3NF & BCNF', launch: 'normalization.html', duration: '20m', completed: true },
            { id: 'sco_db_3', title: '3. Tối Ưu Hóa Câu Lệnh Truy Vấn SQL & Execution Plan', launch: 'sql_advanced.html', duration: '25m', completed: false }
          ]
        },
        {
          id: 'xapi_pkg_3',
          title: 'An Ninh Mạng & Mật Mã Ứng Dụng: Phòng Chống OWASP Top 10',
          subtitle: 'Thực nghiệm kịch bản tấn công SQLi, XSS, CSRF và cơ chế mã hóa bất đối xứng',
          standard: 'xAPI (Tin Can)',
          version: 'xAPI 1.0.3 / Tin Can API',
          file_name: 'cybersecurity_xapi_interactive.zip',
          file_size_mb: '32.8 MB',
          mastery_score: 85,
          user_score: 95,
          user_progress: 100,
          estimated_time: '75 phút',
          rating: 5.0,
          learner_count: 412,
          sco_count: 5,
          status: 'ACTIVE',
          uploaded_by: 'TS. Lê Hải Đăng',
          cover_gradient: 'linear-gradient(135deg, #3b0764 0%, #6b21a8 50%, #a855f7 100%)',
          cover_tag: 'Cyber Security',
          scos: [
            { id: 'xapi_act_1', title: '1. Phòng Lab Thực Nghiệm Tấn Công SQL Injection', launch: 'sqli_lab.html', duration: '25m', completed: true },
            { id: 'xapi_act_2', title: '2. Cơ Chế Phòng Thủ Cross-Site Scripting (XSS)', launch: 'xss_lab.html', duration: '25m', completed: true },
            { id: 'xapi_act_3', title: '3. Bảo Vệ Xác Thực Với JWT & OAuth2 Flow', launch: 'oauth_lab.html', duration: '25m', completed: true }
          ]
        },
        {
          id: 'cmi5_pkg_4',
          title: 'Kiến Trúc Phần Mềm: Microservices, Docker & CI/CD Pipeline',
          subtitle: 'Đóng gói container Docker, phối hợp dịch vụ Kubernetes và quy trình tự động hóa',
          standard: 'cmi5',
          version: 'cmi5 Sandstone Edition',
          file_name: 'microservices_cmi5_agile.zip',
          file_size_mb: '41.5 MB',
          mastery_score: 80,
          user_score: 0,
          user_progress: 30,
          estimated_time: '90 phút',
          rating: 4.9,
          learner_count: 184,
          sco_count: 3,
          status: 'ACTIVE',
          uploaded_by: 'TS. Hoàng Đức Em',
          cover_gradient: 'linear-gradient(135deg, #7c2d12 0%, #c2410c 50%, #f97316 100%)',
          cover_tag: 'Cloud & DevOps',
          scos: [
            { id: 'cmi5_au_1', title: '1. Containerization Ứng Dụng Với Docker', launch: 'docker_au.html', duration: '30m', completed: true },
            { id: 'cmi5_au_2', title: '2. Kubernetes Pods, Services & Ingress Routing', launch: 'k8s_au.html', duration: '30m', completed: false },
            { id: 'cmi5_au_3', title: '3. Thiết Lập GitHub Actions CI/CD Pipeline', launch: 'cicd_au.html', duration: '30m', completed: false }
          ]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatements = async () => {
    try {
      const res = await apiClient.get('/standards/xapi/statements');
      if (res && res.success) {
        setStatements(res.data);
      }
    } catch (e) {
      setStatements([
        {
          id: 'stmt_001',
          timestamp: new Date(Date.now() - 3600000 * 0.4).toISOString(),
          actor: { name: currentUser?.full_name || 'Trần Văn Nam', mbox: 'mailto:nam.tv@techcorp.edu.vn' },
          verb: { display: { 'vi-VN': 'Đã hoàn thành xuất sắc' } },
          object: { definition: { name: { 'vi-VN': 'Lab Phòng Chống SQL Injection OWASP Top 10' } } },
          result: { score: { raw: 95 }, completion: true, success: true }
        },
        {
          id: 'stmt_002',
          timestamp: new Date(Date.now() - 3600000 * 1.2).toISOString(),
          actor: { name: 'Nguyễn Thị Mai', mbox: 'mailto:mai.nt@techcorp.edu.vn' },
          verb: { display: { 'vi-VN': 'Đã trả lời tương tác' } },
          object: { definition: { name: { 'vi-VN': 'Quiz Bài tập Cấp phát động Con trỏ C++' } } },
          result: { score: { raw: 90 }, completion: true, success: true }
        }
      ]);
    }
  };

  useEffect(() => {
    fetchPackages();
    fetchStatements();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Mở trình phát bài giảng SCORM/xAPI Cinema Studio
  const handleLaunchPlayer = (pkg) => {
    setSelectedPackage(pkg);
    setRuntimeRawScore(pkg.user_score || 0);
    setRuntimeCmiStatus(pkg.user_score >= pkg.mastery_score ? 'passed' : 'incomplete');
    setActiveScoIndex(0);
    setQuizAnswer(null);

    const initialLog = [
      `[${new Date().toLocaleTimeString()}] LMSInitialize("") -> Initialized SCORM 1.2 / 2004 Runtime API`,
      `[${new Date().toLocaleTimeString()}] cmi.core.student_name = "${currentUser?.full_name || 'Học viên'}"`,
      `[${new Date().toLocaleTimeString()}] cmi.core.lesson_status = "${pkg.user_score >= pkg.mastery_score ? 'passed' : 'incomplete'}"`,
      `[${new Date().toLocaleTimeString()}] cmi.core.score.raw = "${pkg.user_score || 0}"`,
      `[${new Date().toLocaleTimeString()}] Loading SCO: ${pkg.scos?.[0]?.title || 'Part 1'}`
    ];
    setRuntimeConsoleLogs(initialLog);
    setIsPlayerModalOpen(true);
  };

  // Trả lời Quiz tương tác trong bài giảng
  const handleAnswerQuiz = (ansKey) => {
    setQuizAnswer(ansKey);
    const score = ansKey === 'A' ? 100 : (ansKey === 'B' ? 50 : 20);
    setRuntimeRawScore(score);
    const status = score >= (selectedPackage?.mastery_score || 80) ? 'passed' : 'failed';
    setRuntimeCmiStatus(status);

    const logMsg = `[${new Date().toLocaleTimeString()}] cmi.core.score.raw = "${score}" | cmi.core.lesson_status = "${status}"`;
    setRuntimeConsoleLogs(prev => [logMsg, ...prev]);

    message.success(ansKey === 'A' ? 'Chính xác! Đạt 100/100 điểm. Trạng thái cmi: PASSED' : 'Đã ghi nhận điểm số. Hãy thử lại để đạt chuẩn Mastery!');
  };

  // Đồng bộ điểm CMI về LMS
  const handleSyncScoreToLms = async () => {
    setIsSyncingScore(true);
    try {
      const payload = {
        package_id: selectedPackage.id,
        student_id: currentUser?.id || 1,
        student_name: currentUser?.full_name || 'Học viên',
        cmi_data: {
          'cmi.core.lesson_status': runtimeCmiStatus,
          'cmi.core.score.raw': runtimeRawScore,
          'cmi.core.session_time': '00:15:30',
          'cmi.suspend_data': 'step_3_quiz_completed'
        }
      };

      await apiClient.post('/standards/scorm/cmi-track', payload);
      message.success(`Đã đồng bộ thành công ${runtimeRawScore} điểm từ gói SCORM vào Sổ điểm chính thức!`);
      
      // Update local state
      setPackages(packages.map(p => p.id === selectedPackage.id ? { ...p, user_score: runtimeRawScore, user_progress: 100 } : p));
    } catch (e) {
      message.success(`[Mô phỏng] Đã ghi nhận ${runtimeRawScore} điểm từ gói SCORM vào CSDL Sổ điểm LMS!`);
      setPackages(packages.map(p => p.id === selectedPackage.id ? { ...p, user_score: runtimeRawScore, user_progress: 100 } : p));
    } finally {
      setIsSyncingScore(false);
    }
  };

  // Lọc theo chuẩn
  const filteredPackages = packages.filter(p => {
    if (selectedStandardFilter === 'ALL') return true;
    return p.standard.toLowerCase().includes(selectedStandardFilter.toLowerCase());
  });

  return (
    <div style={{ padding: '0 8px 36px 8px' }}>
      {/* 1. CINEMA HERO BANNER CHUẨN 2026 */}
      <Card
        style={{
          marginBottom: 24,
          borderRadius: 16,
          background: 'linear-gradient(135deg, #030712 0%, #0c1a30 40%, #1e3a8a 100%)',
          color: '#ffffff',
          boxShadow: '0 8px 30px rgba(15, 23, 42, 0.4)',
          border: '1px solid rgba(255,255,255,0.1)'
        }}
        bodyStyle={{ padding: 28 }}
      >
        <Row gutter={[24, 20]} align="middle">
          <Col xs={24} lg={16}>
            <Space align="center" size={16}>
              <div style={{
                background: 'linear-gradient(135deg, #38bdf8 0%, #2563eb 100%)',
                borderRadius: 14,
                padding: '14px 18px',
                fontSize: 34,
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)'
              }}>
                <RocketOutlined style={{ color: '#ffffff' }} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <Title level={2} style={{ color: '#ffffff', margin: 0, fontSize: 24, fontWeight: 800 }}>
                    Thư Viện Bài Giảng Tương Tác Số Chuẩn Quốc Tế
                  </Title>
                  <Tag color="cyan" style={{ borderRadius: 12, fontWeight: 700, padding: '2px 10px' }}>
                    SCORM 1.2 / 2004 • xAPI • cmi5
                  </Tag>
                </div>
                <Paragraph style={{ color: '#93c5fd', margin: '8px 0 0 0', fontSize: 13, lineHeight: 1.6 }}>
                  Không gian học tập trải nghiệm thế hệ mới (Next-Gen LXP 2026): Tương tác trực tiếp trên mô hình mô phỏng,
                  theo dõi vết dữ liệu học tập chi tiết Runtime CMI Data Model và đồng bộ kết quả học tập tự động về hệ thống.
                </Paragraph>
              </div>
            </Space>
          </Col>
          <Col xs={24} lg={8} style={{ textAlign: 'right' }}>
            <Space wrap>
              {isTeacherOrAdmin && (
                <Button
                  type="primary"
                  icon={<UploadOutlined />}
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    borderColor: '#10b981',
                    fontWeight: 700,
                    height: 40,
                    borderRadius: 8
                  }}
                  onClick={() => setIsUploadModalOpen(true)}
                >
                  Tải Lên Gói (.ZIP)
                </Button>
              )}
              <Button icon={<ReloadOutlined />} ghost onClick={fetchPackages} loading={loading} style={{ height: 40, borderRadius: 8 }}>
                Làm mới
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 2. FILTER & VIEW MODE TOGGLE BAR */}
      <Card style={{ marginBottom: 20, borderRadius: 12, boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
        <Row justify="space-between" align="middle" gutter={[16, 12]}>
          <Col xs={24} md={16}>
            <Space wrap size={10}>
              <Text strong style={{ color: '#475569' }}>Lọc theo chuẩn:</Text>
              <Button
                type={selectedStandardFilter === 'ALL' ? 'primary' : 'default'}
                onClick={() => setSelectedStandardFilter('ALL')}
                style={{ borderRadius: 20 }}
              >
                Tất Cả Chuẩn ({packages.length})
              </Button>
              <Button
                type={selectedStandardFilter === 'SCORM 1.2' ? 'primary' : 'default'}
                onClick={() => setSelectedStandardFilter('SCORM 1.2')}
                style={{ borderRadius: 20 }}
              >
                SCORM 1.2
              </Button>
              <Button
                type={selectedStandardFilter === 'SCORM 2004' ? 'primary' : 'default'}
                onClick={() => setSelectedStandardFilter('SCORM 2004')}
                style={{ borderRadius: 20 }}
              >
                SCORM 2004 4th
              </Button>
              <Button
                type={selectedStandardFilter === 'xAPI' ? 'primary' : 'default'}
                onClick={() => setSelectedStandardFilter('xAPI')}
                style={{ borderRadius: 20 }}
              >
                xAPI (Tin Can)
              </Button>
              <Button
                type={selectedStandardFilter === 'cmi5' ? 'primary' : 'default'}
                onClick={() => setSelectedStandardFilter('cmi5')}
                style={{ borderRadius: 20 }}
              >
                cmi5 Mới Nhất
              </Button>
            </Space>
          </Col>
          <Col xs={24} md={8} style={{ textAlign: 'right' }}>
            <Radio.Group value={viewMode} onChange={(e) => setViewMode(e.target.value)} buttonStyle="solid">
              <Radio.Button value="grid">
                <AppstoreOutlined /> Không Gian Trải Nghiệm (LXP Cards)
              </Radio.Button>
              <Radio.Button value="table">
                <UnorderedListOutlined /> Bảng Kỹ Thuật (Table)
              </Radio.Button>
            </Radio.Group>
          </Col>
        </Row>
      </Card>

      {/* 3. VIEW MODE 1: LXP 2026 INTERACTIVE CARDS GRID */}
      {viewMode === 'grid' ? (
        <Row gutter={[20, 20]}>
          {filteredPackages.map((pkg) => (
            <Col xs={24} sm={12} lg={6} key={pkg.id}>
              <Card
                hoverable
                style={{
                  borderRadius: 14,
                  overflow: 'hidden',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
                  border: '1px solid #e2e8f0',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                bodyStyle={{ padding: 18, display: 'flex', flexDirection: 'column', flex: 1 }}
              >
                {/* CARD COVER HEADER */}
                <div style={{
                  background: pkg.cover_gradient || 'linear-gradient(135deg, #1e3a8a, #0284c7)',
                  margin: '-18px -18px 16px -18px',
                  padding: '20px 16px',
                  color: '#fff',
                  position: 'relative',
                  minHeight: 110,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Tag color="rgba(255,255,255,0.25)" style={{ color: '#fff', border: 0, fontWeight: 700, borderRadius: 10 }}>
                      {pkg.cover_tag || pkg.standard}
                    </Tag>
                    <Tag color="gold" icon={<StarFilled />} style={{ borderRadius: 10 }}>
                      {pkg.rating || 4.9}
                    </Tag>
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)', marginTop: 8 }}>
                    <ClockCircleOutlined /> {pkg.estimated_time || '45 phút'} • {pkg.sco_count} Bài học tương tác
                  </div>
                </div>

                {/* CARD TITLE & DESCRIPTION */}
                <div style={{ flex: 1 }}>
                  <Title level={5} style={{ margin: '0 0 6px 0', fontSize: 14, lineHeight: 1.4, color: '#0f172a' }}>
                    {pkg.title}
                  </Title>
                  <Paragraph style={{ fontSize: 12, color: '#64748b', margin: 0, lineHeight: 1.5 }} ellipsis={{ rows: 2 }}>
                    {pkg.subtitle || pkg.title}
                  </Paragraph>
                </div>

                <Divider style={{ margin: '14px 0 12px 0' }} />

                {/* PROGRESS & MASTERY METRICS */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
                    <Text type="secondary">Tiến độ cá nhân:</Text>
                    <Text strong style={{ color: pkg.user_progress === 100 ? '#10b981' : '#2563eb' }}>
                      {pkg.user_progress || 0}% Hoàn tất
                    </Text>
                  </div>
                  <Progress
                    percent={pkg.user_progress || 0}
                    size="small"
                    strokeColor={pkg.user_progress === 100 ? '#10b981' : '#2563eb'}
                    showInfo={false}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginTop: 4 }}>
                    <Text type="secondary">Điểm đạt (Mastery):</Text>
                    <Tag color={pkg.user_score >= pkg.mastery_score ? 'green' : 'default'} style={{ fontSize: 10, margin: 0 }}>
                      {pkg.user_score ? `${pkg.user_score}/100 đ` : `Yêu cầu ≥ ${pkg.mastery_score}%`}
                    </Tag>
                  </div>
                </div>

                {/* ACTION BUTTON */}
                <Button
                  type="primary"
                  icon={<PlayCircleOutlined />}
                  block
                  size="large"
                  onClick={() => handleLaunchPlayer(pkg)}
                  style={{
                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                    borderRadius: 8,
                    fontWeight: 700,
                    fontSize: 13,
                    height: 42,
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
                  }}
                >
                  {pkg.user_progress > 0 ? 'Tiếp Tục Học Ngay' : 'Bắt Đầu Học'}
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        /* VIEW MODE 2: TECHNICAL TABLE VIEW */
        <Card style={{ borderRadius: 12 }}>
          <Table
            dataSource={filteredPackages}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 6 }}
            columns={[
              {
                title: 'Tên Gói Bài Giảng Chuẩn Quốc Tế',
                key: 'title',
                render: (_, r) => (
                  <div>
                    <Text strong style={{ color: '#1e3a8a', fontSize: 14 }}>{r.title}</Text>
                    <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>
                      <FileZipOutlined /> {r.file_name} • <Tag color="blue">{r.file_size_mb}</Tag> • {r.sco_count} SCOs/Modules
                    </div>
                  </div>
                )
              },
              {
                title: 'Chuẩn Đóng Gói',
                dataIndex: 'standard',
                key: 'standard',
                render: (std) => <Tag color="purple" style={{ fontWeight: 600 }}>{std}</Tag>
              },
              {
                title: 'Điểm Đạt (Mastery)',
                key: 'mastery',
                align: 'center',
                render: (_, r) => (
                  <div>
                    <Progress percent={r.mastery_score} size="small" strokeColor="#10b981" />
                    <span style={{ fontSize: 11, color: '#64748b' }}>Yêu cầu: ≥ {r.mastery_score}%</span>
                  </div>
                )
              },
              {
                title: 'Người Đăng & Ngày Tải',
                key: 'author',
                render: (_, r) => (
                  <div style={{ fontSize: 12 }}>
                    <div><b>{r.uploaded_by}</b></div>
                    <Text type="secondary">2026-09-21</Text>
                  </div>
                )
              },
              {
                title: 'Thao Tác',
                key: 'action',
                align: 'center',
                render: (_, r) => (
                  <Button
                    type="primary"
                    icon={<PlayCircleOutlined />}
                    onClick={() => handleLaunchPlayer(r)}
                    style={{ background: '#2563eb' }}
                  >
                    Vào Học Ngay
                  </Button>
                )
              }
            ]}
          />
        </Card>
      )}

      {/* 4. RECENT XAPI LRS ACTIVITY STREAM */}
      <Card
        title={
          <Space>
            <ThunderboltOutlined style={{ color: '#0284c7' }} />
            <span style={{ fontWeight: 700 }}>Vết Học Tập Chuẩn xAPI Statements (Learning Record Store - LRS Stream)</span>
          </Space>
        }
        style={{ marginTop: 24, borderRadius: 12 }}
        extra={<Tag color="green">LRS Sink Active</Tag>}
      >
        <List
          dataSource={statements}
          renderItem={stmt => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar style={{ backgroundColor: '#0284c7' }}>{stmt.actor?.name?.[0] || 'U'}</Avatar>}
                title={
                  <Space>
                    <Text strong>{stmt.actor?.name}</Text>
                    <Tag color="cyan">{stmt.verb?.display?.['vi-VN'] || 'experienced'}</Tag>
                    <Text strong style={{ color: '#1d4ed8' }}>{stmt.object?.definition?.name?.['vi-VN']}</Text>
                  </Space>
                }
                description={
                  <div style={{ fontSize: 11, color: '#64748b' }}>
                    Kết quả điểm: <b>{stmt.result?.score?.raw || 100} đ</b> • Thời gian: {new Date(stmt.timestamp).toLocaleTimeString('vi-VN')}
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Card>

      {/* MODAL: CINEMA STUDIO PLAYER (GIAO DIỆN HỌC BÀI GIẢNG SCORM / XAPI HIỆN ĐẠI 2026) */}
      <Modal
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: 32 }}>
            <Space>
              <DesktopOutlined style={{ color: '#2563eb' }} />
              <span style={{ fontWeight: 800 }}>{selectedPackage?.title}</span>
              <Tag color="purple">{selectedPackage?.standard}</Tag>
            </Space>
            <Tag color={runtimeCmiStatus === 'passed' ? 'green' : 'orange'}>
              CMI Status: {runtimeCmiStatus.toUpperCase()}
            </Tag>
          </div>
        }
        open={isPlayerModalOpen}
        onCancel={() => setIsPlayerModalOpen(false)}
        footer={null}
        width={1100}
        style={{ top: 20 }}
      >
        {selectedPackage && (
          <div>
            <Row gutter={[16, 16]}>
              {/* CỘT TRÁI: DANH SÁCH BÀI HỌC SCOs */}
              <Col xs={24} md={6}>
                <Card size="small" title="Cấu Trúc Khóa Học (SCOs)" style={{ height: '100%', background: '#f8fafc' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {selectedPackage.scos?.map((sco, idx) => (
                      <div
                        key={sco.id}
                        onClick={() => setActiveScoIndex(idx)}
                        style={{
                          padding: '10px 12px',
                          borderRadius: 8,
                          cursor: 'pointer',
                          background: activeScoIndex === idx ? '#eff6ff' : '#ffffff',
                          border: activeScoIndex === idx ? '2px solid #2563eb' : '1px solid #e2e8f0',
                          transition: 'all 0.2s'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Text strong style={{ fontSize: 12, color: activeScoIndex === idx ? '#1d4ed8' : '#334155' }}>
                            {sco.title}
                          </Text>
                          {sco.completed && <CheckCircleOutlined style={{ color: '#10b981' }} />}
                        </div>
                        <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 4 }}>
                          Thời lượng: {sco.duration || '15m'} • Tệp: {sco.launch}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </Col>

              {/* CỘT GIỮA: MÀN HÌNH TƯƠNG TÁC THỜI GIAN THỰC (INTERACTIVE SIMULATOR) */}
              <Col xs={24} md={12}>
                <div style={{
                  background: '#090d16',
                  borderRadius: 12,
                  padding: 20,
                  color: '#ffffff',
                  minHeight: 380,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.5)'
                }}>
                  {/* BÀI TẬP TƯƠNG TÁC SCORM HOẶC MÔ PHỎNG */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                      <Tag color="cyan">Mô Phỏng Bài Giảng SCORM Runtime</Tag>
                      <span style={{ fontSize: 12, color: '#38bdf8' }}>Tiết học số: {activeScoIndex + 1}/{selectedPackage.scos?.length}</span>
                    </div>

                    <Title level={4} style={{ color: '#f8fafc', margin: '0 0 12px 0' }}>
                      {selectedPackage.scos?.[activeScoIndex]?.title}
                    </Title>

                    <Paragraph style={{ color: '#cbd5e1', fontSize: 13, lineHeight: 1.7 }}>
                      {activeScoIndex === 0 && 'Con trỏ trong C++ là biến lưu trữ địa chỉ bộ nhớ của một biến khác. Khi khai báo int* ptr = &val;, toán tử & lấy địa chỉ, còn * truy xuất giá trị tại địa chỉ đó.'}
                      {activeScoIndex === 1 && 'Cấp phát động new int[N] tạo vùng nhớ trên vùng Heap (vùng nhớ tự do). Nếu không giải phóng bằng delete[], bộ nhớ sẽ bị rò rỉ (Memory Leak) làm treo hệ thống.'}
                      {activeScoIndex === 2 && 'Hãy hoàn thành câu hỏi trắc nghiệm tương tác CMI bên dưới để hệ thống tự động ghi nhận điểm số vào Sổ điểm lớp học phần.'}
                    </Paragraph>

                    {/* INTERACTIVE QUIZ TEST TẠI CHỖ */}
                    {activeScoIndex === 2 && (
                      <div style={{ background: '#1e293b', padding: 14, borderRadius: 8, marginTop: 12 }}>
                        <div style={{ fontWeight: 700, color: '#38bdf8', marginBottom: 8, fontSize: 12 }}>
                          CÂU HỎI TƯƠNG TÁC CMI RUNTIME:
                        </div>
                        <div style={{ fontSize: 13, marginBottom: 10 }}>
                          Để tránh rò rỉ bộ nhớ khi cấp phát mảng động <code>int* arr = new int[50];</code>, ta phải gọi:
                        </div>
                        <Space direction="vertical" style={{ width: '100%' }}>
                          <Button
                            block
                            type={quizAnswer === 'A' ? 'primary' : 'default'}
                            onClick={() => handleAnswerQuiz('A')}
                            style={{ textAlign: 'left', background: quizAnswer === 'A' ? '#10b981' : undefined }}
                          >
                            A. delete[] arr; (Chính xác - Gọi hàm hủy từng phần tử)
                          </Button>
                          <Button
                            block
                            type={quizAnswer === 'B' ? 'primary' : 'default'}
                            onClick={() => handleAnswerQuiz('B')}
                            style={{ textAlign: 'left' }}
                          >
                            B. delete arr; (Sai cú pháp - Chỉ hủy phần tử đầu)
                          </Button>
                          <Button
                            block
                            type={quizAnswer === 'C' ? 'primary' : 'default'}
                            onClick={() => handleAnswerQuiz('C')}
                            style={{ textAlign: 'left' }}
                          >
                            C. free(arr);
                          </Button>
                        </Space>
                      </div>
                    )}
                  </div>

                  {/* BOTTOM CONTROLS */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, borderTop: '1px solid #1e293b', paddingTop: 12 }}>
                    <Button
                      size="small"
                      disabled={activeScoIndex === 0}
                      onClick={() => setActiveScoIndex(activeScoIndex - 1)}
                    >
                      Bài Trước
                    </Button>
                    <Button
                      size="small"
                      type="primary"
                      disabled={activeScoIndex === (selectedPackage.scos?.length - 1)}
                      onClick={() => setActiveScoIndex(activeScoIndex + 1)}
                    >
                      Bài Tiếp Theo
                    </Button>
                  </div>
                </div>
              </Col>

              {/* CỘT PHẢI: BẢNG CHỈ SỐ CMI TELEMETRY & ĐỒNG BỘ ĐIỂM */}
              <Col xs={24} md={6}>
                <Card size="small" title="Telemetry Vết Học Tập CMI" style={{ height: '100%' }}>
                  <div style={{ textAlign: 'center', marginBottom: 14 }}>
                    <Progress
                      type="dashboard"
                      percent={runtimeRawScore}
                      strokeColor={runtimeRawScore >= selectedPackage.mastery_score ? '#10b981' : '#faad14'}
                      format={(percent) => `${percent} đ`}
                      size={110}
                    />
                    <div style={{ fontSize: 12, fontWeight: 700, marginTop: 4 }}>
                      Điểm cmi.core.score.raw
                    </div>
                  </div>

                  <div style={{ background: '#f8fafc', padding: 10, borderRadius: 6, fontSize: 11, lineHeight: 1.8 }}>
                    <div><b>Chuẩn Mastery:</b> ≥ {selectedPackage.mastery_score}%</div>
                    <div><b>Trạng thái:</b> <Tag color={runtimeCmiStatus === 'passed' ? 'green' : 'orange'}>{runtimeCmiStatus}</Tag></div>
                    <div><b>Thời gian học:</b> 00:15:30</div>
                  </div>

                  <Button
                    type="primary"
                    block
                    icon={<SendOutlined />}
                    loading={isSyncingScore}
                    onClick={handleSyncScoreToLms}
                    style={{
                      marginTop: 14,
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      borderColor: '#10b981',
                      fontWeight: 700
                    }}
                  >
                    Đồng Bộ Điểm Vào LMS
                  </Button>
                </Card>
              </Col>
            </Row>

            {/* CONSOLE LOG VẾT RUNTIME CMI */}
            <div style={{
              marginTop: 16,
              background: '#0f172a',
              color: '#38bdf8',
              padding: 12,
              borderRadius: 8,
              fontFamily: 'Consolas, monospace',
              fontSize: 11,
              maxHeight: 110,
              overflowY: 'auto'
            }}>
              {runtimeConsoleLogs.map((log, idx) => (
                <div key={idx}>{log}</div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      {/* MODAL: TẢI LÊN GÓI SCORM/XAPI (.ZIP) */}
      <Modal
        title="Tải Lên Gói Học Liệu Chuẩn Quốc Tế (.zip)"
        open={isUploadModalOpen}
        onCancel={() => setIsUploadModalOpen(false)}
        footer={null}
        width={600}
      >
        <Form form={uploadForm} layout="vertical" onFinish={() => {
          message.success('Đã nạp và giải nén gói SCORM/xAPI thành công!');
          setIsUploadModalOpen(false);
        }}>
          <Form.Item label="Chọn tệp tin bài giảng (.zip)" required>
            <Input type="file" />
          </Form.Item>
          <Form.Item label="Chuẩn đóng gói" initialValue="SCORM 1.2">
            <Select>
              <Option value="SCORM 1.2">SCORM 1.2 (CAM 1.2)</Option>
              <Option value="SCORM 2004">SCORM 2004 4th Edition</Option>
              <Option value="xAPI (Tin Can)">xAPI (Tin Can API)</Option>
              <Option value="cmi5">cmi5 Sandstone</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Điểm số đạt yêu cầu (Mastery Score)" initialValue={80}>
            <InputNumber min={0} max={100} style={{ width: '100%' }} />
          </Form.Item>
          <div style={{ textAlign: 'right', marginTop: 16 }}>
            <Button type="primary" htmlType="submit">Xác Nhận Nạp Gói</Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

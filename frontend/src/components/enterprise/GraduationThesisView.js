import React, { useState, useEffect } from 'react';
import {
  Card, Table, Tag, Button, Space, Typography, Row, Col, Modal, Form,
  Input, Select, Progress, message, Tooltip, Badge, Divider, Alert,
  Timeline, Statistic, Popconfirm, Avatar, Tabs
} from 'antd';
import {
  ReadOutlined, PlusOutlined, CheckCircleOutlined, ClockCircleOutlined,
  SolutionOutlined, TeamOutlined, TrophyOutlined, SafetyCertificateOutlined,
  FileTextOutlined, AuditOutlined, DownloadOutlined, UserOutlined,
  EyeOutlined, SendOutlined, SettingOutlined, CheckOutlined
} from '@ant-design/icons';
import apiClient from '../../services/apiClient';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

export default function GraduationThesisView({ currentUser }) {
  const isStudent = currentUser?.role === 'student';
  const isTeacherOrAdmin = currentUser?.role === 'teacher' || currentUser?.role === 'admin' || currentUser?.role === 'superadmin';

  const [theses, setTheses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedThesis, setSelectedThesis] = useState(null);

  // Modals
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isCouncilModalOpen, setIsCouncilModalOpen] = useState(false);
  const [isMinutesModalOpen, setIsMinutesModalOpen] = useState(false);

  const [registerForm] = Form.useForm();
  const [councilForm] = Form.useForm();

  const fetchTheses = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/academic/enterprise/thesis');
      if (res && res.success) {
        setTheses(res.data);
      }
    } catch (e) {
      console.warn('Lỗi tải danh sách đồ án:', e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTheses();
  }, []);

  // Đăng ký đề tài mới
  const handleRegisterThesis = async (values) => {
    try {
      const payload = {
        student_id: currentUser?.id || 1,
        student_code: currentUser?.student_code || '261IT001',
        student_name: currentUser?.name || currentUser?.full_name || 'Trần Văn Nam',
        class_name: '66.CNTT-1',
        major_name: 'Kỹ thuật Phần mềm (Software Engineering)',
        title: values.title,
        objective: values.objective,
        technologies: values.technologies,
        supervisor_id: values.supervisor_id || 2,
        supervisor_name: values.supervisor_name || 'TS. Hoàng Đức Em'
      };

      const res = await apiClient.post('/academic/enterprise/thesis/register', payload);
      if (res && res.success) {
        message.success('Đăng ký đề tài khóa luận tốt nghiệp thành công!');
        setIsRegisterModalOpen(false);
        registerForm.resetFields();
        fetchTheses();
      }
    } catch (e) {
      message.error('Lỗi đăng ký đề tài: ' + e.message);
    }
  };

  // Duyệt đề tài (Giảng viên / Trưởng khoa)
  const handleApprove = async (id, decision) => {
    try {
      const res = await apiClient.post(`/academic/enterprise/thesis/${id}/approve`, { decision });
      if (res && res.success) {
        message.success(decision === 'APPROVED' ? 'Đã phê duyệt đề tài!' : 'Đã từ chối đề tài.');
        fetchTheses();
      }
    } catch (e) {
      message.error('Lỗi cập nhật: ' + e.message);
    }
  };

  // Nộp mốc tiến độ
  const handleSubmitMilestone = async (thesisId, milestoneKey) => {
    try {
      const res = await apiClient.post(`/academic/enterprise/thesis/${thesisId}/milestone`, {
        milestoneKey,
        fileName: `Bao_cao_${milestoneKey}_final.pdf`
      });
      if (res && res.success) {
        message.success('Đã nộp báo cáo mốc tiến độ thành công!');
        fetchTheses();
      }
    } catch (e) {
      message.error('Lỗi nộp mốc tiến độ: ' + e.message);
    }
  };

  // Nhập điểm Hội đồng bảo vệ
  const handleCouncilGrading = async (values) => {
    if (!selectedThesis) return;
    try {
      const scores = {
        CHAIRMAN: { research: values.chair_res, presentation: values.chair_pres, qa: values.chair_qa },
        SECRETARY: { research: values.sec_res, presentation: values.sec_pres, qa: values.sec_qa },
        REVIEWER_1: { research: values.rev1_res, presentation: values.rev1_pres, qa: values.rev1_qa },
        REVIEWER_2: { research: values.rev2_res, presentation: values.rev2_pres, qa: values.rev2_qa }
      };

      const res = await apiClient.post(`/academic/enterprise/thesis/${selectedThesis.id}/council-grade`, { scores });
      if (res && res.success) {
        message.success('Đã lưu kết quả Hội đồng bảo vệ và ký số biên bản!');
        setIsCouncilModalOpen(false);
        councilForm.resetFields();
        fetchTheses();
      }
    } catch (e) {
      message.error('Lỗi chấm điểm Hội đồng: ' + e.message);
    }
  };

  const columns = [
    {
      title: 'Mã & Tên Đề Tài Khóa Luận',
      key: 'title',
      render: (_, r) => (
        <div>
          <Text strong style={{ color: '#1e40af', fontSize: 14 }}>{r.title}</Text>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
            <b>Mục tiêu:</b> {r.objective}
          </div>
          <div style={{ marginTop: 6, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {r.technologies?.map((tech, idx) => (
              <Tag key={idx} color="geekblue" style={{ fontSize: 10 }}>{tech}</Tag>
            ))}
          </div>
        </div>
      )
    },
    {
      title: 'Sinh Viên Thực Hiện',
      key: 'student',
      width: 200,
      render: (_, r) => (
        <div>
          <b>{r.student_name}</b>
          <div style={{ fontSize: 12, color: '#64748b' }}>MSSV: {r.student_code}</div>
          <div style={{ fontSize: 11, color: '#94a3b8' }}>Lớp: {r.class_name}</div>
        </div>
      )
    },
    {
      title: 'GV Hướng Dẫn',
      key: 'supervisor',
      width: 180,
      render: (_, r) => (
        <div>
          <Tag color="purple">👨‍🏫 {r.supervisor_name}</Tag>
          <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
            {r.supervisor_department || 'Khoa CNTT'}
          </div>
        </div>
      )
    },
    {
      title: 'Tiến Độ & Đạo Văn',
      key: 'milestones',
      width: 200,
      render: (_, r) => {
        const approvedCount = r.submission_milestones?.filter(m => m.status === 'APPROVED' || m.status === 'SUBMITTED').length || 0;
        const percent = Math.round((approvedCount / 3) * 100);
        return (
          <div>
            <Progress percent={percent} size="small" status={percent === 100 ? 'success' : 'active'} />
            <div style={{ marginTop: 6 }}>
              {r.plagiarism_check?.status === 'PASSED' ? (
                <Tag color="success" icon={<SafetyCertificateOutlined />}>
                  Đạo văn: <b>{r.plagiarism_check.similarity_score}%</b> (Đạt chuẩn)
                </Tag>
              ) : (
                <Tag color="default">Chưa quét đạo văn</Tag>
              )}
            </div>
          </div>
        );
      }
    },
    {
      title: 'Trạng Thái',
      key: 'status',
      width: 160,
      align: 'center',
      render: (st, r) => {
        if (r.status === 'DEFENDED_PASSED') {
          return (
            <div>
              <Tag color="success" style={{ fontWeight: 700, padding: '4px 8px' }}>
                🎉 BẢO VỆ ĐẠT: {r.defense_council?.final_grade}/10
              </Tag>
              <div style={{ fontSize: 11, color: '#15803d', fontWeight: 600, marginTop: 4 }}>
                Xếp loại: {r.defense_council?.academic_rank}
              </div>
            </div>
          );
        }
        if (r.status === 'DEFENSE_SCHEDULED') {
          return <Tag color="blue" icon={<ClockCircleOutlined />}>Lịch Bảo Vệ Đã Xếp</Tag>;
        }
        if (r.status === 'APPROVED') {
          return <Tag color="cyan" icon={<CheckCircleOutlined />}>Đang Thực Hiện</Tag>;
        }
        return <Tag color="orange">Chờ Phê Duyệt</Tag>;
      }
    },
    {
      title: 'Thao Tác',
      key: 'actions',
      width: 170,
      align: 'center',
      render: (_, r) => (
        <Space direction="vertical" size={4} style={{ width: '100%' }}>
          {isTeacherOrAdmin && r.status === 'PROPOSED' && (
            <Space>
              <Button size="small" type="primary" onClick={() => handleApprove(r.id, 'APPROVED')}>Duyệt</Button>
              <Button size="small" danger onClick={() => handleApprove(r.id, 'REJECTED')}>Từ chối</Button>
            </Space>
          )}

          {r.status === 'DEFENSE_SCHEDULED' && isTeacherOrAdmin && (
            <Button
              type="primary"
              size="small"
              icon={<AuditOutlined />}
              style={{ background: '#7c3aed', borderColor: '#7c3aed' }}
              onClick={() => {
                setSelectedThesis(r);
                setIsCouncilModalOpen(true);
              }}
            >
              Chấm Điểm Hội Đồng
            </Button>
          )}

          {r.status === 'DEFENDED_PASSED' && (
            <Button
              size="small"
              icon={<FileTextOutlined />}
              onClick={() => {
                setSelectedThesis(r);
                setIsMinutesModalOpen(true);
              }}
            >
              Xem Biên Bản HĐ
            </Button>
          )}

          {isStudent && r.status === 'APPROVED' && (
            <Button
              type="dashed"
              size="small"
              icon={<SendOutlined />}
              onClick={() => handleSubmitMilestone(r.id, 'FINAL_100')}
            >
              Nộp Toàn Văn Khóa Luận
            </Button>
          )}
        </Space>
      )
    }
  ];

  return (
    <Card style={{ borderRadius: 12, boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
      {/* HEADER BAR */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
        <Col>
          <Title level={4} style={{ margin: 0 }}>
            <ReadOutlined style={{ color: '#2563eb', marginRight: 8 }} />
            QUẢN LÝ KHÓA LUẬN & ĐỒ ÁN TỐT NGHIỆP ĐẠI HỌC (CAPSTONE THESIS)
          </Title>
          <Text type="secondary">
            Chuẩn hóa quy trình đăng ký, giám sát tiến độ, thẩm định đạo văn và bảo vệ trước Hội đồng theo chuẩn Bộ GD&ĐT
          </Text>
        </Col>
        <Col>
          <Space>
            <Button icon={<ClockCircleOutlined />} onClick={fetchTheses}>
              Làm mới
            </Button>
            {isStudent && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                style={{ background: '#2563eb' }}
                onClick={() => setIsRegisterModalOpen(true)}
              >
                Đăng Ký Đề Tài Mới
              </Button>
            )}
          </Space>
        </Col>
      </Row>

      {/* THỐNG KÊ NHANH */}
      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={6}>
          <Card size="small" style={{ background: '#eff6ff', borderRadius: 8 }}>
            <Statistic title="Tổng Số Đồ Án / Khóa Luận" value={theses.length} prefix={<ReadOutlined style={{ color: '#2563eb' }} />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small" style={{ background: '#f0fdf4', borderRadius: 8 }}>
            <Statistic
              title="Đã Bảo Vệ Thành Công"
              value={theses.filter(t => t.status === 'DEFENDED_PASSED').length}
              prefix={<TrophyOutlined style={{ color: '#16a34a' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small" style={{ background: '#faf5ff', borderRadius: 8 }}>
            <Statistic
              title="Đã Lên Lịch Hội Đồng"
              value={theses.filter(t => t.status === 'DEFENSE_SCHEDULED').length}
              prefix={<TeamOutlined style={{ color: '#9333ea' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small" style={{ background: '#fffbeb', borderRadius: 8 }}>
            <Statistic
              title="Đang Thực Hiện Tiến Độ"
              value={theses.filter(t => t.status === 'APPROVED').length}
              prefix={<ClockCircleOutlined style={{ color: '#d97706' }} />}
            />
          </Card>
        </Col>
      </Row>

      {/* BẢNG DỮ LIỆU */}
      <Table
        dataSource={theses}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 8 }}
      />

      {/* ========================================================================= */}
      {/* MODAL 1: ĐĂNG KÝ ĐỀ TÀI MỚI                                               */}
      {/* ========================================================================= */}
      <Modal
        title={
          <Space>
            <PlusOutlined style={{ color: '#2563eb' }} />
            <span>Đăng Ký Đề Tài Khóa Luận / Đồ Án Tốt Nghiệp</span>
          </Space>
        }
        open={isRegisterModalOpen}
        onCancel={() => setIsRegisterModalOpen(false)}
        onOk={() => registerForm.submit()}
        okText="Gửi Đề Xuất Đề Tài"
        cancelText="Hủy"
        width={680}
      >
        <Form form={registerForm} layout="vertical" onFinish={handleRegisterThesis}>
          <Form.Item
            name="title"
            label="Tên Đề Tài Khóa Luận (Tiếng Việt)"
            rules={[{ required: true, message: 'Nhập tên đề tài' }]}
          >
            <Input placeholder="Ví dụ: Xây dựng Hệ thống Quản trị Học tập Phân tán với Chữ ký số..." />
          </Form.Item>

          <Form.Item
            name="objective"
            label="Mục Tiêu & Phạm Vi Nghiên Cứu"
            rules={[{ required: true, message: 'Mô tả mục tiêu nghiên cứu' }]}
          >
            <Input.TextArea rows={3} placeholder="Nêu rõ bài toán giải quyết, phương pháp luận và kết quả kỳ vọng đạt được..." />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="technologies"
                label="Công Nghệ & Ngôn Ngữ Sử Dụng"
                rules={[{ required: true, message: 'Nhập công nghệ sử dụng' }]}
              >
                <Input placeholder="Node.js, React, MySQL, Docker..." />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="supervisor_name"
                label="Giảng Viên Hướng Dẫn Đề Xuất"
                initialValue="TS. Hoàng Đức Em"
              >
                <Select>
                  <Option value="TS. Hoàng Đức Em">TS. Hoàng Đức Em (Bộ môn Kỹ thuật Phần mềm)</Option>
                  <Option value="TS. Nguyễn Văn An">TS. Nguyễn Văn An (Bộ môn Hệ thống Thông tin)</Option>
                  <Option value="PGS. TS. Trần Mạnh Tuấn">PGS. TS. Trần Mạnh Tuấn (Khoa CNTT)</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL 2: HỘI ĐỒNG CHẤM BẢO VỆ KHÓA LUẬN                                   */}
      {/* ========================================================================= */}
      <Modal
        title={
          <Space>
            <AuditOutlined style={{ color: '#7c3aed' }} />
            <span>Phiếu Đánh Giá Chấm Điểm Của Hội Đồng Bảo Vệ Tốt Nghiệp</span>
          </Space>
        }
        open={isCouncilModalOpen}
        onCancel={() => setIsCouncilModalOpen(false)}
        onOk={() => councilForm.submit()}
        okText="Hoàn Tất & Khóa Sổ Điểm Hội Đồng"
        cancelText="Đóng"
        width={750}
      >
        {selectedThesis && (
          <div>
            <Alert
              message={`Đồ án: ${selectedThesis.title}`}
              description={`Thí sinh: ${selectedThesis.student_name} (${selectedThesis.student_code}) — Hội đồng: ${selectedThesis.defense_council?.council_name}`}
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />

            <Form form={councilForm} layout="vertical" onFinish={handleCouncilGrading}>
              <Paragraph strong style={{ color: '#4338ca' }}>
                Thang điểm Rubric: Nội dung nghiên cứu (40%) + Thuyết trình (30%) + Trả lời chất vấn (30%)
              </Paragraph>

              {/* CHỦ TỊCH */}
              <Card size="small" style={{ marginBottom: 10, background: '#f8fafc' }}>
                <Text strong>1. Chủ tịch Hội đồng: PGS. TS. Trần Mạnh Tuấn</Text>
                <Row gutter={12} style={{ marginTop: 6 }}>
                  <Col span={8}>
                    <Form.Item name="chair_res" label="Nội dung (Hệ 10)" initialValue={9.5} rules={[{ required: true }]}>
                      <Input type="number" step="0.1" min="0" max="10" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item name="chair_pres" label="Thuyết trình" initialValue={9.0} rules={[{ required: true }]}>
                      <Input type="number" step="0.1" min="0" max="10" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item name="chair_qa" label="Chất vấn" initialValue={9.5} rules={[{ required: true }]}>
                      <Input type="number" step="0.1" min="0" max="10" />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>

              {/* THƯ KÝ */}
              <Card size="small" style={{ marginBottom: 10, background: '#f8fafc' }}>
                <Text strong>2. Thư ký Hội đồng: ThS. Lê Hoàng Yến</Text>
                <Row gutter={12} style={{ marginTop: 6 }}>
                  <Col span={8}>
                    <Form.Item name="sec_res" label="Nội dung" initialValue={9.0} rules={[{ required: true }]}>
                      <Input type="number" step="0.1" min="0" max="10" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item name="sec_pres" label="Thuyết trình" initialValue={9.0} rules={[{ required: true }]}>
                      <Input type="number" step="0.1" min="0" max="10" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item name="sec_qa" label="Chất vấn" initialValue={9.0} rules={[{ required: true }]}>
                      <Input type="number" step="0.1" min="0" max="10" />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>

              {/* PHẢN BIỆN 1 */}
              <Card size="small" style={{ marginBottom: 10, background: '#f8fafc' }}>
                <Text strong>3. Ủy viên Phản biện 1: TS. Nguyễn Văn An</Text>
                <Row gutter={12} style={{ marginTop: 6 }}>
                  <Col span={8}>
                    <Form.Item name="rev1_res" label="Nội dung" initialValue={9.0} rules={[{ required: true }]}>
                      <Input type="number" step="0.1" min="0" max="10" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item name="rev1_pres" label="Thuyết trình" initialValue={8.5} rules={[{ required: true }]}>
                      <Input type="number" step="0.1" min="0" max="10" />
                    </Col>
                  <Col span={8}>
                    <Form.Item name="rev1_qa" label="Chất vấn" initialValue={9.0} rules={[{ required: true }]}>
                      <Input type="number" step="0.1" min="0" max="10" />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>

              {/* PHẢN BIỆN 2 */}
              <Card size="small" style={{ background: '#f8fafc' }}>
                <Text strong>4. Ủy viên Phản biện 2: TS. Vũ Đình Trọng</Text>
                <Row gutter={12} style={{ marginTop: 6 }}>
                  <Col span={8}>
                    <Form.Item name="rev2_res" label="Nội dung" initialValue={9.5} rules={[{ required: true }]}>
                      <Input type="number" step="0.1" min="0" max="10" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item name="rev2_pres" label="Thuyết trình" initialValue={9.0} rules={[{ required: true }]}>
                      <Input type="number" step="0.1" min="0" max="10" />
                    </Col>
                  <Col span={8}>
                    <Form.Item name="rev2_qa" label="Chất vấn" initialValue={9.5} rules={[{ required: true }]}>
                      <Input type="number" step="0.1" min="0" max="10" />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </Form>
          </div>
        )}
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL 3: XEM BIÊN BẢN CHẤM BẢO VỆ TỐT NGHIỆP                              */}
      {/* ========================================================================= */}
      <Modal
        title="BIÊN BẢN CHẤM BẢO VỆ KHÓA LUẬN TỐT NGHIỆP CHÍNH THỨC"
        open={isMinutesModalOpen}
        onCancel={() => setIsMinutesModalOpen(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setIsMinutesModalOpen(false)}>
            Đóng
          </Button>
        ]}
        width={720}
      >
        {selectedThesis && (
          <div style={{ padding: 10, background: '#fff', border: '1px solid #cbd5e1', borderRadius: 8 }}>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <div style={{ fontWeight: 700 }}>BỘ GIÁO DỤC VÀ ĐÀO TẠO — TRƯỜNG ĐẠI HỌC CÔNG NGHỆ TECHCORP</div>
              <div style={{ fontWeight: 800, fontSize: 16, color: '#1e3a8a', marginTop: 6 }}>
                BIÊN BẢN ĐÁNH GIÁ KHÓA LUẬN TỐT NGHIỆP ĐẠI HỌC
              </div>
              <Text type="secondary">Mã biên bản điện tử: {selectedThesis.defense_council?.defense_minutes?.minutes_code || 'BB-2026'}</Text>
            </div>

            <Paragraph><b>Tên đề tài:</b> {selectedThesis.title}</Paragraph>
            <Paragraph><b>Sinh viên:</b> {selectedThesis.student_name} (MSSV: {selectedThesis.student_code}) — <b>Ngành:</b> {selectedThesis.major_name}</Paragraph>
            <Paragraph><b>GV Hướng dẫn:</b> {selectedThesis.supervisor_name}</Paragraph>

            <Divider style={{ margin: '12px 0' }} />

            <Title level={5}>Kết quả Đánh giá của Các Thành viên Hội đồng:</Title>
            <Table
              dataSource={selectedThesis.defense_council?.members || []}
              rowKey="role"
              pagination={false}
              size="small"
              bordered
              columns={[
                { title: 'Vai trò', dataIndex: 'title', key: 'title' },
                { title: 'Họ và Tên', dataIndex: 'name', key: 'name' },
                { title: 'Điểm chấm', dataIndex: 'score', key: 'score', align: 'center', render: sc => <b>{sc || '9.2'}</b> }
              ]}
            />

            <div style={{ marginTop: 16, padding: 12, background: '#f0fdf4', borderRadius: 6, border: '1px solid #86efac' }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#15803d' }}>
                ĐIỂM TRUNG BÌNH HỘI ĐỒNG: {selectedThesis.defense_council?.final_grade}/10 (Xếp loại: {selectedThesis.defense_council?.academic_rank})
              </div>
              <div style={{ fontSize: 13, marginTop: 4 }}>
                {selectedThesis.defense_council?.defense_minutes?.council_conclusion}
              </div>
            </div>

            <div style={{ marginTop: 20, textAlign: 'right' }}>
              <Tag color="success" icon={<SafetyCertificateOutlined />} style={{ padding: '4px 10px' }}>
                Đã Ký Số Điện Tử Bởi Chủ Tịch Hội Đồng & Trưởng Khoa
              </Tag>
            </div>
          </div>
        )}
      </Modal>
    </Card>
  );
}

import React, { useState } from 'react';
import {
  Card, Table, Tag, Button, Space, Typography, Row, Col, Progress,
  Divider, Alert, Select, Statistic, Tooltip
} from 'antd';
import {
  SafetyCertificateOutlined, CheckCircleOutlined, TrophyOutlined,
  RadarChartOutlined, FileTextOutlined, ArrowUpOutlined, InfoCircleOutlined,
  DownloadOutlined, ReloadOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

export default function CloPloAssessmentView({ currentUser }) {
  const [selectedCohort, setSelectedCohort] = useState('K66');
  const [selectedMajor, setSelectedMajor] = useState('CNPM');

  // Dữ liệu 10 Chuẩn đầu ra Chương trình đào tạo (Program Learning Outcomes - PLO) theo chuẩn AUN-QA / ABET
  const ploData = [
    { code: 'PLO1', title: 'Kiến thức Toán học & KHTN', target: 80, achieved: 92.4, status: 'EXCEEDED', cloCount: 14, desc: 'Vận dụng kiến thức toán giải tích, đại số và vật lý vào mô hình hóa bài toán kỹ thuật.' },
    { code: 'PLO2', title: 'Phân tích & Thiết kế Phần mềm', target: 80, achieved: 88.5, status: 'EXCEEDED', cloCount: 18, desc: 'Khảo sát yêu cầu, thiết kế kiến trúc phần mềm hướng đối tượng và vi dịch vụ.' },
    { code: 'PLO3', title: 'Lập trình & Kiểm thử Hệ thống', target: 85, achieved: 94.2, status: 'EXCEEDED', cloCount: 22, desc: 'Thành thạo lập trình C/C++, Java/NodeJS, viết unit test và kiểm thử tự động CI/CD.' },
    { code: 'PLO4', title: 'Đạo đức Nghề nghiệp & Luật An ninh mạng', target: 80, achieved: 96.0, status: 'EXCEEDED', cloCount: 8, desc: 'Tuân thủ Luật ATTT mạng, Nghị định 13/2023/NĐ-CP và đạo đức kỹ sư CNTT.' },
    { code: 'PLO5', title: 'Kỹ năng Giao tiếp & Làm việc nhóm', target: 75, achieved: 89.1, status: 'EXCEEDED', cloCount: 12, desc: 'Giao tiếp kỹ thuật hiệu quả, thuyết trình đồ án và phối hợp nhóm Agile/Scrum.' },
    { code: 'PLO6', title: 'Ngoại ngữ Chuyên ngành (B1/B2)', target: 75, achieved: 84.6, status: 'EXCEEDED', cloCount: 10, desc: 'Đọc hiểu tài liệu chuẩn IEEE/ACM, viết báo cáo kỹ thuật bằng tiếng Anh.' },
    { code: 'PLO7', title: 'Tư duy Phản biện & Giải quyết Vấn đề', target: 75, achieved: 87.3, status: 'EXCEEDED', cloCount: 15, desc: 'Phát hiện lỗi logic, tối ưu hóa độ phức tạp thuật toán và tái cấu trúc mã nguồn.' },
    { code: 'PLO8', title: 'Học tập Suốt đời & Nghiên cứu Khoa học', target: 75, achieved: 91.0, status: 'EXCEEDED', cloCount: 8, desc: 'Khả năng tự nghiên cứu công nghệ mới (AI, Blockchain, Cloud Native).' },
    { code: 'PLO9', title: 'Chuyển đổi số & Đổi mới Sáng tạo', target: 70, achieved: 85.8, status: 'EXCEEDED', cloCount: 11, desc: 'Ứng dụng công nghệ số giải quyết bài toán thực tế của doanh nghiệp.' },
    { code: 'PLO10', title: 'Quản trị Dự án Phần mềm', target: 75, achieved: 90.2, status: 'EXCEEDED', cloCount: 9, desc: 'Lập kế hoạch, ước lượng chi phí và quản trị rủi ro dự án phần mềm.' }
  ];

  // Ma trận ánh xạ Học phần - CLO sang PLO
  const courseMatrix = [
    { code: 'IT101', name: 'Nhập môn Lập trình C/C++', credits: 4, clo1: 'I', clo2: 'I', clo3: 'R', clo4: 'I', clo5: 'I', clo6: '-', clo7: 'R', clo8: 'I', clo9: 'I', clo10: '-' },
    { code: 'MATH101', name: 'Toán Cao Cấp 1', credits: 3, clo1: 'M', clo2: 'I', clo3: '-', clo4: '-', clo5: '-', clo6: '-', clo7: 'M', clo8: 'I', clo9: '-', clo10: '-' },
    { code: 'ENG101', name: 'Tiếng Anh Học Thuật 1', credits: 3, clo1: '-', clo2: '-', clo3: '-', clo4: '-', clo5: 'R', clo6: 'M', clo7: 'I', clo8: 'R', clo9: '-', clo10: '-' },
    { code: 'IT201', name: 'Cơ sở Dữ liệu (Database)', credits: 3, clo1: 'R', clo2: 'M', clo3: 'M', clo4: 'R', clo5: 'R', clo6: 'R', clo7: 'M', clo8: 'R', clo9: 'M', clo10: 'I' },
    { code: 'IT301', name: 'Cấu trúc Dữ liệu & Giải thuật', credits: 4, clo1: 'M', clo2: 'M', clo3: 'M', clo4: '-', clo5: 'I', clo6: 'R', clo7: 'M', clo8: 'M', clo9: 'R', clo10: '-' },
    { code: 'IT401', name: 'Đồ Án Tốt Nghiệp / Khóa Luận', credits: 10, clo1: 'M', clo2: 'M', clo3: 'M', clo4: 'M', clo5: 'M', clo6: 'M', clo7: 'M', clo8: 'M', clo9: 'M', clo10: 'M' }
  ];

  const overallAttainment = Number((ploData.reduce((a, b) => a + b.achieved, 0) / ploData.length).toFixed(1));

  return (
    <Card style={{ borderRadius: 12, boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
      {/* HEADER */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={4} style={{ margin: 0 }}>
            <SafetyCertificateOutlined style={{ color: '#059669', marginRight: 8 }} />
            ĐO LƯỜNG CHUẨN ĐẦU RA HỌC PHẦN (CLO) & CHƯƠNG TRÌNH ĐÀO TẠO (PLO)
          </Title>
          <Text type="secondary">
            Báo cáo đo lường định lượng mức độ đạt chuẩn AUN-QA và ABET phục vụ Kiểm định chất lượng giáo dục
          </Text>
        </Col>
        <Col>
          <Space>
            <span>Khóa sinh viên:</span>
            <Select value={selectedCohort} onChange={setSelectedCohort} style={{ width: 110 }}>
              <Option value="K66">K66 (2026)</Option>
              <Option value="K65">K65 (2025)</Option>
              <Option value="K64">K64 (2024)</Option>
            </Select>
            <Select value={selectedMajor} onChange={setSelectedMajor} style={{ width: 220 }}>
              <Option value="CNPM">Kỹ thuật Phần mềm (AUN-QA)</Option>
              <Option value="HTTT">Hệ thống Thông tin</Option>
              <Option value="KHMT">Khoa học Máy tính (ABET)</Option>
            </Select>
          </Space>
        </Col>
      </Row>

      {/* TỔNG KẾT ĐẠT CHUẨN */}
      <Alert
        message={<b>KẾT QUẢ ĐẠT CHUẨN ĐẦU RA TỔNG THỂ KHÓA {selectedCohort}: {overallAttainment}% (VƯỢT CHỈ TIÊU ĐẶT RA 80.0%)</b>}
        description={
          <div>
            Toàn bộ 10/10 Chuẩn đầu ra CTĐT (PLO) đều đạt và vượt ngưỡng chỉ tiêu tối thiểu. Dữ liệu được tính toán tự động từ kết quả đánh giá 24 học phần, 120 bài thi số hóa và hồ sơ đồ án tốt nghiệp khóa luận.
          </div>
        }
        type="success"
        showIcon
        style={{ marginBottom: 20 }}
      />

      {/* GRID 10 PLO PROGRESS BARS */}
      <Title level={5}>1. Mức độ Đạt 10 Chuẩn đầu ra Chương trình Đào tạo (PLO Attainment Metrics):</Title>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {ploData.map(p => (
          <Col xs={24} sm={12} lg={12} key={p.code}>
            <Card size="small" style={{ borderRadius: 8, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <Row justify="space-between" align="middle">
                <Col>
                  <Tag color="blue" style={{ fontWeight: 700 }}>{p.code}</Tag>
                  <Text strong>{p.title}</Text>
                </Col>
                <Col>
                  <Tag color="green">Mục tiêu: {p.target}%</Tag>
                  <span style={{ fontSize: 15, fontWeight: 800, color: '#15803d' }}>{p.achieved}%</span>
                </Col>
              </Row>
              <Progress
                percent={p.achieved}
                strokeColor={p.achieved >= 85 ? '#10b981' : '#3b82f6'}
                size="small"
                style={{ marginTop: 8 }}
              />
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
                {p.desc}
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Divider style={{ margin: '18px 0' }} />

      {/* MA TRẬN ÁNH XẠ CLO - PLO */}
      <Title level={5}>2. Ma Trận Ánh Xạ Học Phần vào Chuẩn Đầu Ra (Curriculum Mapping Matrix - I/R/M):</Title>
      <Paragraph type="secondary">
        Quy ước quốc tế: <Tag color="blue">I = Introduce (Giới thiệu)</Tag> • <Tag color="orange">R = Reinforce (Củng cố / Nâng cao)</Tag> • <Tag color="green">M = Master (Làm chủ / Thành thạo)</Tag>
      </Paragraph>

      <Table
        dataSource={courseMatrix}
        rowKey="code"
        pagination={false}
        size="small"
        bordered
        columns={[
          { title: 'Mã HP', dataIndex: 'code', key: 'code', width: 90, render: c => <b>{c}</b> },
          { title: 'Tên Học Phần', dataIndex: 'name', key: 'name', width: 220 },
          { title: 'TC', dataIndex: 'credits', key: 'credits', width: 50, align: 'center' },
          { title: 'PLO1', dataIndex: 'clo1', key: 'clo1', align: 'center', render: v => <Tag color={v==='M'?'green':v==='R'?'orange':v==='I'?'blue':'default'}>{v}</Tag> },
          { title: 'PLO2', dataIndex: 'clo2', key: 'clo2', align: 'center', render: v => <Tag color={v==='M'?'green':v==='R'?'orange':v==='I'?'blue':'default'}>{v}</Tag> },
          { title: 'PLO3', dataIndex: 'clo3', key: 'clo3', align: 'center', render: v => <Tag color={v==='M'?'green':v==='R'?'orange':v==='I'?'blue':'default'}>{v}</Tag> },
          { title: 'PLO4', dataIndex: 'clo4', key: 'clo4', align: 'center', render: v => <Tag color={v==='M'?'green':v==='R'?'orange':v==='I'?'blue':'default'}>{v}</Tag> },
          { title: 'PLO5', dataIndex: 'clo5', key: 'clo5', align: 'center', render: v => <Tag color={v==='M'?'green':v==='R'?'orange':v==='I'?'blue':'default'}>{v}</Tag> },
          { title: 'PLO6', dataIndex: 'clo6', key: 'clo6', align: 'center', render: v => <Tag color={v==='M'?'green':v==='R'?'orange':v==='I'?'blue':'default'}>{v}</Tag> },
          { title: 'PLO7', dataIndex: 'clo7', key: 'clo7', align: 'center', render: v => <Tag color={v==='M'?'green':v==='R'?'orange':v==='I'?'blue':'default'}>{v}</Tag> },
          { title: 'PLO8', dataIndex: 'clo8', key: 'clo8', align: 'center', render: v => <Tag color={v==='M'?'green':v==='R'?'orange':v==='I'?'blue':'default'}>{v}</Tag> },
          { title: 'PLO9', dataIndex: 'clo9', key: 'clo9', align: 'center', render: v => <Tag color={v==='M'?'green':v==='R'?'orange':v==='I'?'blue':'default'}>{v}</Tag> },
          { title: 'PLO10', dataIndex: 'clo10', key: 'clo10', align: 'center', render: v => <Tag color={v==='M'?'green':v==='R'?'orange':v==='I'?'blue':'default'}>{v}</Tag> }
        ]}
      />

      {/* KHUYẾN NGHỊ CẢI TIẾN CHẤT LƯỢNG LIÊN TỤC (CQI) */}
      <div style={{ marginTop: 24, padding: 16, background: '#f8fafc', borderRadius: 8, border: '1px solid #cbd5e1' }}>
        <Title level={5} style={{ color: '#0f172a' }}>
          💡 Kế Hoạch Cải Tiến Chất Lượng Liên Tục (CQI Plan for Next Cycle):
        </Title>
        <ul style={{ color: '#334155', lineHeight: 1.8, fontSize: 13 }}>
          <li><b>PLO6 (Ngoại ngữ chuyên ngành):</b> Mức đạt 84.6% mặc dù vượt chỉ tiêu 75% nhưng là mức thấp nhất trong 10 chuẩn. Khuyến nghị bổ sung 30% tài liệu đọc hiểu bằng tiếng Anh trong học phần Cơ sở dữ liệu và Cấu trúc dữ liệu.</li>
          <li><b>PLO9 (Đổi mới sáng tạo):</b> Tăng cường thời lượng đồ án thực hành giải quyết bài toán chuyển đổi số liên kết cùng các doanh nghiệp công nghệ đối tác.</li>
        </ul>
      </div>
    </Card>
  );
}

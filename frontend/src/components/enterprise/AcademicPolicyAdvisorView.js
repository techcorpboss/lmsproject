// frontend/src/components/enterprise/AcademicPolicyAdvisorView.js
import React, { useState, useEffect } from 'react';
import {
  Card, Input, Space, Typography, Tag, Row, Col,
  Collapse, Alert, Spin, Divider, Empty
} from 'antd';
import {
  BookOutlined, SearchOutlined, QuestionCircleOutlined,
  CheckCircleOutlined,
  SafetyCertificateOutlined, ReadOutlined
} from '@ant-design/icons';
import apiClient from '../../services/apiClient';

const { Title, Text } = Typography;

export default function AcademicPolicyAdvisorView() {
  const [policies, setPolicies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // Hỏi đáp thông minh
  const [advisoryQuestion, setAdvisoryQuestion] = useState('');
  const [advisoryResult, setAdvisoryResult] = useState(null);
  const [advising, setAdvising] = useState(false);

  const fetchPolicies = async (q = '') => {
    setLoading(true);
    try {
      const endpoint = q ? '/academic/enterprise/academic-policy/search' : '/academic/enterprise/academic-policy/all';
      const res = await apiClient.get(endpoint, { params: { q } });
      if (res && res.success && res.data) {
        setPolicies(res.data);
      }
    } catch (e) {
      console.warn('Lỗi tải danh mục quy chế:', e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  const handleSearch = () => {
    fetchPolicies(searchQuery);
  };

  const handleAskAdvisor = async (qText) => {
    const question = qText || advisoryQuestion;
    if (!question || question.trim().length === 0) return;

    setAdvising(true);
    try {
      const res = await apiClient.post('/academic/enterprise/academic-policy/advise', { question });
      if (res && res.success) {
        setAdvisoryResult(res);
      }
    } catch (err) {
      console.error('Lỗi hỏi đáp quy chế:', err.message);
    } finally {
      setAdvising(false);
    }
  };

  return (
    <div style={{ padding: '20px 24px', maxWidth: 1400, margin: '0 auto' }}>
      {/* HEADER */}
      <div style={{ marginBottom: 20 }}>
        <Space align="center">
          <BookOutlined style={{ fontSize: 26, color: '#1677ff' }} />
          <div>
            <Title level={4} style={{ margin: 0, color: '#1e3a8a' }}>
              Trợ Lý Tra Cứu Quy Chế Học Vụ & Đào Tạo Tín Chỉ (RAG Academic Policy)
            </Title>
            <Text type="secondary" style={{ fontSize: 13 }}>
              Hệ thống Tri thức Pháp lý: Thông tư 08/2021/TT-BGDĐT, Thông tư 10/2016/TT-BGDĐT, Nghị định 81/2021 & QĐ 4725 HEMIS
            </Text>
          </div>
        </Space>
      </div>

      {/* HỘP HỎI ĐÁP QUY CHẾ THÔNG MINH */}
      <Card
        style={{
          borderRadius: 12,
          background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)',
          borderColor: '#bfdbfe',
          marginBottom: 20,
          boxShadow: '0 2px 10px rgba(59, 130, 246, 0.08)'
        }}
      >
        <Row orientation="horizontal" gutter={[16, 16]}>
          <Col xs={24} md={16}>
            <Title level={5} style={{ color: '#1e40af', marginTop: 0 }}>
              <QuestionCircleOutlined /> Đặt Câu Hỏi Pháp Lý & Xử Lý Nghiệp Vụ Học Vụ:
            </Title>
            <Input.Search
              value={advisoryQuestion}
              onChange={(e) => setAdvisoryQuestion(e.target.value)}
              placeholder="Ví dụ: Sinh viên bị cảnh báo học vụ mấy lần thì bị buộc thôi học? Hoặc: Học lại lấy điểm nào?"
              enterButton="Hỏi Chuyên Gia AI"
              size="large"
              loading={advising}
              onSearch={() => handleAskAdvisor()}
            />
            <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              <Text type="secondary" style={{ fontSize: 11, alignSelf: 'center' }}>Câu hỏi phổ biến:</Text>
              {[
                "Kỳ chính được đăng ký tối đa bao nhiêu tín chỉ?",
                "Điểm CPA tối thiểu để được cấp bằng tốt nghiệp?",
                "Học lại có được lấy điểm cao nhất không?",
                "Điều kiện xét học bổng khuyến khích loại Xuất sắc?"
              ].map((sample, idx) => (
                <Tag
                  key={idx}
                  color="blue"
                  style={{ cursor: 'pointer', borderRadius: 4, margin: 0, fontSize: 11 }}
                  onClick={() => {
                    setAdvisoryQuestion(sample);
                    handleAskAdvisor(sample);
                  }}
                >
                  {sample}
                </Tag>
              ))}
            </div>
          </Col>

          <Col xs={24} md={8}>
            <div style={{ background: '#fff', padding: 14, borderRadius: 8, border: '1px solid #e2e8f0', height: '100%' }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#0f172a', marginBottom: 4 }}>
                <SafetyCertificateOutlined style={{ color: '#16a34a' }} /> Cam Kết Tính Chính Xác Pháp Lý:
              </div>
              <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>
                Mọi trích dẫn và hướng dẫn đều bám sát từng Điều, Khoản quy phạm pháp luật hiện hành của Bộ Giáo dục & Đào tạo, bảo vệ tuyệt đối quyền lợi học tập của người học.
              </div>
            </div>
          </Col>
        </Row>

        {/* KẾT QUẢ TƯ VẤN QUY CHẾ */}
        {advisoryResult && (
          <div style={{ marginTop: 16, padding: 14, background: '#fff', borderRadius: 8, border: '1px solid #93c5fd' }}>
            <Alert
              message={
                <Space>
                  <CheckCircleOutlined style={{ color: '#16a34a' }} />
                  <span style={{ fontWeight: 700 }}>{advisoryResult.officialCitation}</span>
                </Space>
              }
              type="success"
              showIcon={false}
              style={{ marginBottom: 12 }}
            />
            <div style={{ whiteSpace: 'pre-wrap', fontSize: 13, lineHeight: 1.7, color: '#1e293b' }}>
              {advisoryResult.advice}
            </div>

            {advisoryResult.relatedExamples && advisoryResult.relatedExamples.length > 0 && (
              <div style={{ marginTop: 10, background: '#f8fafc', padding: 10, borderRadius: 6, fontSize: 12 }}>
                <Text strong style={{ color: '#475569' }}>💡 Tình huống học vụ mẫu:</Text>
                {advisoryResult.relatedExamples.map((ex, exIdx) => (
                  <div key={exIdx} style={{ marginTop: 4, color: '#334155' }}>• {ex}</div>
                ))}
              </div>
            )}
          </div>
        )}
      </Card>

      {/* DANH MỤC ĐIỀU KHOẢN QUY PHẠM PHÁP LUẬT */}
      <Card
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Space>
              <ReadOutlined style={{ color: '#0958d9' }} />
              <span>Kho Văn Bản Quy Chế Đào Tạo Đại Học Hệ Tín Chỉ</span>
            </Space>
            <Input
              prefix={<SearchOutlined />}
              placeholder="Lọc điều khoản..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onPressEnter={handleSearch}
              style={{ width: 260 }}
              size="small"
              allowClear
            />
          </div>
        }
        style={{ borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
      >
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40 }}><Spin size="large" /></div>
        ) : policies.length === 0 ? (
          <Empty description="Không tìm thấy điều khoản phù hợp." />
        ) : (
          <Collapse
            defaultActiveKey={['TT08_DIEU_09', 'TT08_DIEU_10']}
            items={policies.map(p => ({
              key: p.id,
              label: (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', paddingRight: 10 }}>
                  <Space>
                    <Tag color="geekblue" style={{ fontWeight: 700 }}>{p.document} • {p.article}</Tag>
                    <Text strong style={{ fontSize: 14 }}>{p.title}</Text>
                  </Space>
                  <div style={{ fontSize: 12, color: '#64748b' }}>{p.summary}</div>
                </div>
              ),
              children: (
                <div style={{ padding: '4px 8px' }}>
                  <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8, fontSize: 13, color: '#1e293b' }}>
                    {p.content}
                  </div>
                  <Divider style={{ margin: '12px 0' }} />
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
                    <Text type="secondary" style={{ fontSize: 11 }}>Từ khóa học vụ:</Text>
                    {p.tags?.map((t, tidx) => (
                      <Tag key={tidx} style={{ fontSize: 11 }}>#{t}</Tag>
                    ))}
                  </div>
                </div>
              )
            }))}
          />
        )}
      </Card>
    </div>
  );
}

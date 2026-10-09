import React, { useState, useEffect } from 'react';
import {
  Modal, Form, Rate, Input, Button, Typography, Space, Alert,
  Divider, Card, Tag, message, Spin, Row, Col
} from 'antd';
import {
  SafetyCertificateOutlined, CheckCircleOutlined, StarFilled,
  LockOutlined, UnlockOutlined, InfoCircleOutlined, SendOutlined
} from '@ant-design/icons';
import apiClient from '../../services/apiClient';

const { Title, Text, Paragraph } = Typography;

export default function StudentEvaluationModal({
  open,
  onClose,
  course,
  studentId,
  studentName,
  onSuccess
}) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [surveyData, setSurveyData] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  useEffect(() => {
    if (open && course) {
      setSubmittedSuccess(false);
      form.resetFields();
      fetchSurveyForm();
    }
  }, [open, course]);

  const fetchSurveyForm = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/academic/enterprise/evaluations/form', {
        params: {
          courseCode: course.course_code,
          lecturerName: course.lecturer_name || 'TS. Hoàng Đức Em'
        }
      });
      if (res && res.success) {
        setSurveyData(res.data);
      }
    } catch (e) {
      console.warn('Lỗi tải mẫu khảo sát:', e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      setSubmitting(true);
      const ratings = {
        pedagogical_clarity: values.dim_pedagogical_clarity || 5,
        professionalism_punctuality: values.dim_professionalism_punctuality || 5,
        materials_usefulness: values.dim_materials_usefulness || 5,
        fairness_transparency: values.dim_fairness_transparency || 5,
        inspiration_motivation: values.dim_inspiration_motivation || 5
      };

      const payload = {
        studentId: studentId || '12',
        courseCode: course.course_code,
        courseName: course.course_name,
        lecturerId: course.lecturer_id || 'GV001',
        lecturerName: course.lecturer_name || 'TS. Hoàng Đức Em',
        ratings,
        generalFeedback: values.generalFeedback || ''
      };

      const res = await apiClient.post('/academic/enterprise/evaluations/submit', payload);

      if (res && res.success) {
        setSubmittedSuccess(true);
        message.success(res.message || 'Khảo sát thành công! Điểm thi đã mở khóa.');
        if (onSuccess) {
          onSuccess(course.course_code);
        }
      }
    } catch (e) {
      message.error('Lỗi gửi khảo sát: ' + e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title={
        <Space>
          <SafetyCertificateOutlined style={{ color: '#2563eb', fontSize: 20 }} />
          <span style={{ fontSize: 16, fontWeight: 700 }}>
            PHIẾU KHẢO SÁT Ý KIẾN NGƯỜI HỌC VỀ HOẠT ĐỘNG GIẢNG DẠY (SET)
          </span>
        </Space>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={780}
      maskClosable={false}
      style={{ top: 20 }}
    >
      {submittedSuccess ? (
        <div style={{ textAlign: 'center', padding: '30px 20px' }}>
          <CheckCircleOutlined style={{ fontSize: 64, color: '#16a34a', marginBottom: 16 }} />
          <Title level={3} style={{ color: '#16a34a', marginBottom: 8 }}>
            KHẢO SÁT THÀNH CÔNG — ĐIỂM THI ĐÃ ĐƯỢC MỞ KHÓA!
          </Title>
          <Paragraph style={{ fontSize: 15, color: '#475569', maxWidth: 540, margin: '0 auto 20px auto' }}>
            Hệ thống TCU COMPASS LMS đã ghi nhận ý kiến đóng góp hoàn toàn ẩn danh của bạn nhằm nâng cao chất lượng đào tạo theo quy định của Bộ GD&ĐT. Điểm thi kết thúc học phần <b>{course?.course_name} ({course?.course_code})</b> đã hiển thị chính thức.
          </Paragraph>
          <Button
            type="primary"
            size="large"
            icon={<UnlockOutlined />}
            style={{ background: '#2563eb' }}
            onClick={onClose}
          >
            Xem Bảng Điểm Chi Tiết Ngay
          </Button>
        </div>
      ) : (
        <Spin spinning={loading}>
          <Alert
            message="QUY ĐỊNH BẢO MẬT & ĐẢM BẢO CHẤT LƯỢNG NỘI BỘ"
            description={
              <div>
                <p style={{ margin: '4px 0' }}>
                  Theo <b>Thông tư 08/2021/TT-BGDĐT</b> và quy định khảo thí đại học, sinh viên cần hoàn thành khảo sát chất lượng giảng dạy trước khi xem điểm thi chính thức.
                </p>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  🛡️ <b>Cam kết Bảo mật:</b> Phiếu khảo sát được ẩn danh 100%. Giảng viên và Khoa chỉ nhận được kết quả thống kê tổng hợp, tuyệt đối không truy xuất được danh tính sinh viên.
                </Text>
              </div>
            }
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />

          {course && (
            <Card size="small" style={{ background: '#f8fafc', marginBottom: 16, border: '1px solid #e2e8f0' }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Text type="secondary">Học phần khảo sát:</Text> <br />
                  <b style={{ color: '#1e293b', fontSize: 14 }}>{course.course_name} ({course.course_code})</b>
                </Col>
                <Col span={12}>
                  <Text type="secondary">Giảng viên giảng dạy:</Text> <br />
                  <Tag color="blue" style={{ fontSize: 13, marginTop: 2 }}>
                    👨‍🏫 {course.lecturer_name || 'TS. Hoàng Đức Em'}
                  </Tag>
                </Col>
              </Row>
            </Card>
          )}

          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Title level={5} style={{ marginBottom: 8, color: '#334155' }}>
              Đánh giá theo 5 tiêu chuẩn chất lượng (Thang đo 1 - 5 Sao):
            </Title>

            {surveyData?.dimensions?.map((dim, idx) => (
              <Card
                key={dim.id}
                size="small"
                style={{
                  marginBottom: 12,
                  borderRadius: 8,
                  border: '1px solid #f1f5f9',
                  background: idx % 2 === 0 ? '#fff' : '#fafafa'
                }}
              >
                <Row align="middle" justify="space-between">
                  <Col xs={24} sm={16}>
                    <Text strong style={{ color: '#1e40af', fontSize: 14 }}>{dim.title}</Text>
                    <Paragraph style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: 13 }}>
                      {dim.question}
                    </Paragraph>
                  </Col>
                  <Col xs={24} sm={8} style={{ textAlign: 'right' }}>
                    <Form.Item
                      name={`dim_${dim.key}`}
                      rules={[{ required: true, message: 'Vui lòng cho điểm' }]}
                      initialValue={5}
                      style={{ marginBottom: 0 }}
                    >
                      <Rate character={<StarFilled />} style={{ fontSize: 22, color: '#f59e0b' }} />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            ))}

            <Divider style={{ margin: '14px 0' }} />

            <Form.Item
              name="generalFeedback"
              label={<b>Ý kiến đóng góp, đề xuất cải tiến cho Giảng viên & Học phần (Không bắt buộc):</b>}
            >
              <Input.TextArea
                rows={3}
                placeholder="Ví dụ: Giảng viên truyền đạt rất nhiệt tình; em mong muốn có thêm các buổi chữa bài tập lớn và chia sẻ case-study thực tế..."
              />
            </Form.Item>

            <div style={{ textAlign: 'right', marginTop: 16 }}>
              <Space>
                <Button onClick={onClose}>Đóng tạm</Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={submitting}
                  icon={<SendOutlined />}
                  style={{ background: '#2563eb' }}
                >
                  Gửi Khảo Sát & Mở Khóa Điểm Thi
                </Button>
              </Space>
            </div>
          </Form>
        </Spin>
      )}
    </Modal>
  );
}

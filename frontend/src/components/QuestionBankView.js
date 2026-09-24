import React, { useState, useEffect } from 'react';
import {
  Row, Col, Card, Table, Tag, Button, Typography, Space, Input,
  Select, Modal, Form, message, Badge, Divider
} from 'antd';
import {
  DatabaseOutlined, PlusOutlined, FilterOutlined,
  CheckCircleOutlined, SearchOutlined
} from '@ant-design/icons';
import apiClient from '../services/apiClient';

const { Title, Text } = Typography;
const { Option } = Select;

export default function QuestionBankView() {
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [catRes, qRes] = await Promise.all([
        apiClient.get('/exam/categories').catch(() => ({ data: [] })),
        apiClient.get('/exam/questions', { params: { category_id: selectedCategory, difficulty: selectedDifficulty } }).catch(() => ({ data: [] }))
      ]);

      setCategories(catRes.data || []);
      setQuestions(qRes.data || []);
    } catch (err) {
      console.warn('API error, using sample question bank:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedCategory, selectedDifficulty]);

  const handleCreateQuestion = async (values) => {
    try {
      const payload = {
        category_id: values.category_id || 1,
        content: values.content,
        question_type: 'SINGLE_CHOICE',
        difficulty: values.difficulty || 'MEDIUM',
        default_mark: values.default_mark || 1.0,
        answers: [
          { content: values.ans_a, is_correct: values.correct_ans === 'A' },
          { content: values.ans_b, is_correct: values.correct_ans === 'B' },
          { content: values.ans_c, is_correct: values.correct_ans === 'C' },
          { content: values.ans_d, is_correct: values.correct_ans === 'D' }
        ]
      };

      const res = await apiClient.post('/exam/questions', payload);
      if (res.success) {
        message.success('Đã thêm câu hỏi vào ngân hàng thành công!');
        setIsModalVisible(false);
        form.resetFields();
        fetchData();
      }
    } catch (err) {
      message.error(err.message || 'Lỗi khi lưu câu hỏi');
    }
  };

  const columns = [
    {
      title: 'Mã & Nội Dung Câu Hỏi',
      dataIndex: 'content',
      key: 'content',
      render: (text, record) => (
        <div>
          <Text strong style={{ fontSize: 14 }}>{text}</Text>
          <div style={{ marginTop: 6 }}>
            {record.answers?.map((ans, idx) => (
              <Tag key={ans.id || idx} color={ans.is_correct ? 'green' : 'default'} style={{ marginBottom: 4 }}>
                {String.fromCharCode(65 + idx)}. {ans.content}
              </Tag>
            ))}
          </div>
        </div>
      )
    },
    {
      title: 'Chuẩn Bloom / Độ Khó',
      dataIndex: 'difficulty',
      key: 'difficulty',
      width: 150,
      render: (diff) => {
        if (diff === 'EASY') return <Tag color="blue">Nhận biết (Easy)</Tag>;
        if (diff === 'MEDIUM') return <Tag color="cyan">Thông hiểu (Medium)</Tag>;
        if (diff === 'HARD') return <Tag color="orange">Vận dụng (Hard)</Tag>;
        return <Tag color="red">Vận dụng cao (Expert)</Tag>;
      }
    },
    {
      title: 'Điểm Số',
      dataIndex: 'default_mark',
      key: 'default_mark',
      width: 100,
      render: (m) => <b>{m || 1.0} đ</b>
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (s) => <Badge status="success" text="Đã duyệt" />
    }
  ];

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
        <Col>
          <Title level={2} style={{ margin: 0 }}>🗃️ Ngân Hàng Câu Hỏi Khảo Thí (IMS QTI Ready)</Title>
          <Text type="secondary">Phân loại nhận thức theo thang đo Bloom & Ma trận khảo thí đại học</Text>
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
            Thêm Câu Hỏi Mới
          </Button>
        </Col>
      </Row>

      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={8}>
            <Select
              style={{ width: '100%' }}
              placeholder="Chọn danh mục môn học"
              allowClear
              onChange={(val) => setSelectedCategory(val)}
            >
              {categories.map((c) => (
                <Option key={c.id} value={c.id}>{c.name}</Option>
              ))}
            </Select>
          </Col>
          <Col span={8}>
            <Select
              style={{ width: '100%' }}
              defaultValue="ALL"
              onChange={(val) => setSelectedDifficulty(val)}
            >
              <Option value="ALL">Tất cả mức độ nhận thức Bloom</Option>
              <Option value="EASY">Nhận biết (Easy)</Option>
              <Option value="MEDIUM">Thông hiểu (Medium)</Option>
              <Option value="HARD">Vận dụng (Hard)</Option>
              <Option value="EXPERT">Vận dụng cao (Expert)</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      <Table
        columns={columns}
        dataSource={questions}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 8 }}
      />

      <Modal
        title="Thêm Câu Hỏi Trắc Nghiệm Mới"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateQuestion}>
          <Form.Item name="category_id" label="Danh mục môn học" rules={[{ required: true }]}>
            <Select placeholder="Chọn danh mục">
              {categories.map((c) => (
                <Option key={c.id} value={c.id}>{c.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="content" label="Nội dung câu hỏi" rules={[{ required: true }]}>
            <Input.TextArea rows={3} placeholder="Nhập câu hỏi trắc nghiệm..." />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="difficulty" label="Mức độ nhận thức (Thang Bloom)" initialValue="MEDIUM">
                <Select>
                  <Option value="EASY">Nhận biết (Easy)</Option>
                  <Option value="MEDIUM">Thông hiểu (Medium)</Option>
                  <Option value="HARD">Vận dụng (Hard)</Option>
                  <Option value="EXPERT">Vận dụng cao (Expert)</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="default_mark" label="Điểm số câu" initialValue={1.0}>
                <Input type="number" step="0.5" />
              </Form.Item>
            </Col>
          </Row>

          <Divider style={{ margin: '12px 0' }}>4 Lựa Chọn Đáp Án</Divider>

          <Form.Item name="ans_a" label="Đáp án A" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="ans_b" label="Đáp án B" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="ans_c" label="Đáp án C" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="ans_d" label="Đáp án D" rules={[{ required: true }]}><Input /></Form.Item>

          <Form.Item name="correct_ans" label="Đáp án Đúng" initialValue="A" rules={[{ required: true }]}>
            <Select>
              <Option value="A">Đáp án A</Option>
              <Option value="B">Đáp án B</Option>
              <Option value="C">Đáp án C</Option>
              <Option value="D">Đáp án D</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

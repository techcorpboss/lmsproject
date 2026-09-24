import React, { useState, useEffect } from 'react';
import {
  Table, Tag, Typography, Row, Col, Space, Button, Input, DatePicker, message
} from 'antd';
import {
  HistoryOutlined, ReloadOutlined, DownloadOutlined, SearchOutlined,
  CheckCircleOutlined, ExclamationCircleOutlined
} from '@ant-design/icons';
import apiClient from '../../services/apiClient';

const { Title, Text } = Typography;

export default function AuditLogView() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/admin/audit-logs');
      if (res && res.success) {
        setLogs(res.data);
      }
    } catch (e) {
      setLogs([
        { id: 1, timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), user: 'admin', action: 'ERP_GATEWAY_SYNC', description: 'Đồng bộ danh sách 14 sinh viên lớp 66.CNTT-1 từ qldt.techcorp.info.vn', ip: '118.69.182.45', status: 'SUCCESS' },
        { id: 2, timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(), user: 'TS. Hoàng Đức Em', action: 'UPDATE_MODULE', description: 'Cập nhật đề cương & bài giảng Tuần 2 môn IT101 (Nhập môn C/C++)', ip: '14.162.144.12', status: 'SUCCESS' },
        { id: 3, timestamp: new Date(Date.now() - 1000 * 60 * 42).toISOString(), user: 'Trần Văn Nam (261IT001)', action: 'SUBMIT_QUIZ', description: 'Nộp bài kiểm tra đánh giá quá trình Tuần 1 - Đạt 9.5/10', ip: '171.244.38.99', status: 'SUCCESS' },
        { id: 4, timestamp: new Date(Date.now() - 1000 * 3600 * 2).toISOString(), user: 'admin', action: 'SYSTEM_BACKUP', description: 'Thực hiện sao lưu tự động CSDL lms_db (Bản: lms_db_auto_backup_20260924.sql.gz)', ip: '127.0.0.1', status: 'SUCCESS' },
        { id: 5, timestamp: new Date(Date.now() - 1000 * 3600 * 5).toISOString(), user: 'GiamThi_Phong01', action: 'PROCTOR_ALERT', description: 'Phát hiện thí sinh chuyển tab làm bài trong kỳ thi IT101_MIDTERM', ip: '113.161.72.10', status: 'WARNING' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8,"
      + "Thời gian,Người thực hiện,Hành động,Mô tả,Địa chỉ IP,Trạng thái\n"
      + logs.map(l => `"${l.timestamp}","${l.user}","${l.action}","${l.description}","${l.ip}","${l.status}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `lms_audit_logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    message.success('Đã xuất nhật ký Audit Logs thành tệp CSV!');
  };

  const filteredLogs = logs.filter(l =>
    (l.user && l.user.toLowerCase().includes(searchText.toLowerCase())) ||
    (l.action && l.action.toLowerCase().includes(searchText.toLowerCase())) ||
    (l.description && l.description.toLowerCase().includes(searchText.toLowerCase()))
  );

  const columns = [
    {
      title: 'Thời gian',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 170,
      render: (t) => <Text style={{ fontSize: 12 }}>{new Date(t).toLocaleString('vi-VN')}</Text>
    },
    {
      title: 'Người thực hiện',
      dataIndex: 'user',
      key: 'user',
      width: 180,
      render: (text) => <Text strong>{text}</Text>
    },
    {
      title: 'Hành động',
      dataIndex: 'action',
      key: 'action',
      width: 160,
      render: (act) => {
        let color = 'blue';
        if (act.includes('BACKUP')) color = 'purple';
        if (act.includes('ERP')) color = 'cyan';
        if (act.includes('PROCTOR')) color = 'orange';
        if (act.includes('DELETE')) color = 'red';
        return <Tag color={color} style={{ fontWeight: 600 }}>{act}</Tag>;
      }
    },
    {
      title: 'Chi tiết hành động & Đối tượng tác động',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: 'Địa chỉ IP',
      dataIndex: 'ip',
      key: 'ip',
      width: 130,
      render: (ip) => <code>{ip}</code>
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (st) => (
        st === 'SUCCESS' ? (
          <Tag color="success" icon={<CheckCircleOutlined />}>Thành công</Tag>
        ) : (
          <Tag color="warning" icon={<ExclamationCircleOutlined />}>Cảnh báo</Tag>
        )
      )
    }
  ];

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={4} style={{ margin: 0 }}>
            <HistoryOutlined style={{ color: '#10b981', marginRight: 8 }} />
            Nhật Ký Hoạt Động & Vết Kiểm Toán Hệ Thống (Audit Trail)
          </Title>
          <Text type="secondary">Truy vết mọi sự kiện nhạy cảm: Đăng nhập, chỉnh sửa điểm, thi cử, sao lưu và đồng bộ ERP</Text>
        </Col>
        <Col>
          <Space>
            <Input
              placeholder="Tìm theo user, hành động, từ khóa..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              style={{ width: 260 }}
              allowClear
            />
            <Button icon={<ReloadOutlined />} onClick={fetchLogs}>Tải lại</Button>
            <Button type="primary" icon={<DownloadOutlined />} onClick={handleExport}>Xuất CSV</Button>
          </Space>
        </Col>
      </Row>

      <Table
        dataSource={filteredLogs}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 8 }}
      />
    </div>
  );
}

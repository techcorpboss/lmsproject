// frontend/src/components/common/AcademicNotificationBell.js
// 🔔 Trung Tâm Thông Báo Đẩy Thời Gian Thực (Real-time Notification Bell Hub)
import React, { useState, useEffect } from 'react';
import { Badge, Popover, List, Typography, Space, Button, Tag, message } from 'antd';
import {
  BellOutlined, FileTextOutlined, TrophyOutlined,
  WarningOutlined, BookOutlined, CheckCircleOutlined,
  ClockCircleOutlined, InfoCircleOutlined
} from '@ant-design/icons';
import apiClient from '../../services/apiClient';

const { Text, Paragraph } = Typography;

export default function AcademicNotificationBell({
  studentCode = '261IT001',
  className = '66.CNTT-1',
  onNotificationClick
}) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);

  // Tải danh sách thông báo
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/academic/notifications?student_code=${studentCode}&class_name=${className}`);
      if (res.data && res.data.success) {
        setNotifications(res.data.data || []);
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch (err) {
      console.error('Lỗi nạp thông báo:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Polling nhẹ mỗi 30 giây để cập nhật thông báo mới
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [studentCode, className]);

  // Đánh dấu 1 thông báo là đã đọc
  const handleMarkAsRead = async (notif) => {
    if (!notif.is_read) {
      try {
        await apiClient.post(`/academic/notifications/${notif.id}/read`);
        setNotifications(prev =>
          prev.map(n => n.id === notif.id ? { ...n, is_read: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (err) {
        console.error('Lỗi mark read:', err);
      }
    }
    if (onNotificationClick) {
      onNotificationClick(notif);
    }
  };

  // Đánh dấu tất cả là đã đọc
  const handleMarkAllRead = async () => {
    try {
      await apiClient.post('/academic/notifications/mark-all-read', {
        student_code: studentCode,
        class_name: className
      });
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
      message.success('Đã đánh dấu tất cả thông báo là đã đọc');
    } catch (err) {
      console.error('Lỗi mark all read:', err);
    }
  };

  // Render icon theo loại thông báo
  const renderIcon = (type) => {
    switch (type) {
      case 'ASSIGNMENT':
        return <FileTextOutlined style={{ color: '#2563eb', fontSize: 16 }} />;
      case 'GRADE':
        return <TrophyOutlined style={{ color: '#16a34a', fontSize: 16 }} />;
      case 'ATTENDANCE':
        return <WarningOutlined style={{ color: '#dc2626', fontSize: 16 }} />;
      case 'COURSE':
        return <BookOutlined style={{ color: '#7c3aed', fontSize: 16 }} />;
      default:
        return <InfoCircleOutlined style={{ color: '#0284c7', fontSize: 16 }} />;
    }
  };

  const popoverContent = (
    <div style={{ width: 360, maxHeight: 420, overflowY: 'auto' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: 8,
          borderBottom: '1px solid #e2e8f0',
          marginBottom: 8
        }}
      >
        <Text strong style={{ fontSize: 14 }}>
          🔔 Thông Báo Học Vụ & LMS ({unreadCount} mới)
        </Text>
        {unreadCount > 0 && (
          <Button type="link" size="small" onClick={handleMarkAllRead} style={{ padding: 0 }}>
            Đọc tất cả
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '24px 0', color: '#94a3b8' }}>
          Không có thông báo mới.
        </div>
      ) : (
        <List
          size="small"
          loading={loading}
          dataSource={notifications}
          renderItem={item => (
            <List.Item
              onClick={() => handleMarkAsRead(item)}
              style={{
                cursor: 'pointer',
                padding: '8px 10px',
                borderRadius: 6,
                marginBottom: 4,
                background: item.is_read ? '#ffffff' : '#f0f9ff',
                border: item.is_read ? '1px solid #f1f5f9' : '1px solid #bae6fd',
                transition: 'background 0.2s'
              }}
            >
              <Space align="start" style={{ width: '100%' }}>
                <div style={{ marginTop: 2 }}>{renderIcon(item.type)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text strong style={{ fontSize: 13, color: item.is_read ? '#475569' : '#0f172a' }}>
                      {item.title}
                    </Text>
                    {!item.is_read && (
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: '#2563eb',
                          display: 'inline-block'
                        }}
                      />
                    )}
                  </div>
                  <Paragraph
                    ellipsis={{ rows: 2 }}
                    style={{ margin: '2px 0 4px 0', fontSize: 12, color: '#64748b' }}
                  >
                    {item.message}
                  </Paragraph>
                  <Text type="secondary" style={{ fontSize: 10 }}>
                    <ClockCircleOutlined /> {new Date(item.created_at).toLocaleString('vi-VN')}
                  </Text>
                </div>
              </Space>
            </List.Item>
          )}
        />
      )}
    </div>
  );

  return (
    <Popover
      content={popoverContent}
      trigger="click"
      open={popoverOpen}
      onOpenChange={setPopoverOpen}
      placement="bottomRight"
    >
      <Badge count={unreadCount} overflowCount={99} size="small" offset={[-2, 4]}>
        <Button
          type="text"
          shape="circle"
          icon={<BellOutlined style={{ fontSize: 18, color: unreadCount > 0 ? '#2563eb' : '#64748b' }} />}
          style={{ background: 'rgba(0,0,0,0.03)' }}
        />
      </Badge>
    </Popover>
  );
}

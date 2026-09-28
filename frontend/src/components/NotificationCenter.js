// frontend/src/components/NotificationCenter.js
// Modern, Compact & Feature-Complete Academic Notification & Alert Hub
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Badge,
  Button,
  Popover,
  Tabs,
  Typography,
  Tag,
  Space,
  Empty,
  Spin,
  Modal,
  Form,
  Input,
  Select,
  Radio,
  message,
  Popconfirm,
  Divider,
  Alert,
  Tooltip
} from 'antd';
import {
  BellOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
  WarningFilled,
  NotificationOutlined,
  FieldTimeOutlined,
  ReadOutlined,
  SendOutlined,
  CheckOutlined,
  ReloadOutlined,
  PlusOutlined,
  DeleteOutlined,
  ArrowRightOutlined,
  FilterOutlined,
  AlertOutlined,
  SearchOutlined
} from '@ant-design/icons';
import notificationApi from '../services/notificationApi';

const { Text, Title, Paragraph } = Typography;
const { TextArea } = Input;

// Helper: Format thời gian tương đối tiếng Việt
function formatRelativeTime(dateString) {
  if (!dateString) return '';
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 45) return 'Vừa xong';
  if (diffMin < 60) return `${diffMin} phút trước`;
  if (diffHour < 24) return `${diffHour} giờ trước`;
  if (diffDay === 1) return 'Hôm qua';
  if (diffDay < 7) return `${diffDay} ngày trước`;
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
}

export default function NotificationCenter({ currentUser, onNavigate }) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState({ total: 0, unread: 0, academic_alerts: 0, critical_alerts: 0 });
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchText, setSearchText] = useState('');

  // Modals
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedNotif, setSelectedNotif] = useState(null);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [form] = Form.useForm();

  // Danh mục menu điều hướng trong LMS
  const NAVIGATION_OPTIONS = [
    { value: 'lms_workspace', label: '📖 Lớp Học Phần & Soạn Giảng (15 Tuần)' },
    { value: 'lesson_qa_assignments', label: '💬 Diễn Đàn Q&A & Bài Tập Tự Luận' },
    { value: 'moet_gradebook', label: '📊 Sổ Điểm Học Phần & Bảng Điểm Cá Nhân' },
    { value: 'exam_room', label: '📝 Phòng Thi Trực Tuyến & Lịch Thi' },
    { value: 'exam_appraisal', label: '🛡️ Thẩm Định Đề Thi & Biên Bản' },
    { value: 'student_directory', label: '👥 Danh Sách Học Viên & Cảnh Báo' },
    { value: 'erp_sync', label: '🔄 Cổng Liên Thông ERP & HEMIS' },
    { value: 'system_monitor', label: '⚡ Giám Sát Hệ Thống & Máy Chủ' }
  ];

  // Tải danh sách thông báo từ Backend API
  const fetchNotifications = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const params = {
        role: currentUser?.role || 'ALL',
        user_id: currentUser?.id,
        username: currentUser?.username,
        faculty_id: currentUser?.faculty_id || 'ALL'
      };
      const res = await notificationApi.getNotifications(params);
      if (res && res.success) {
        setNotifications(res.data || []);
        setStats(res.stats || { total: 0, unread: 0, academic_alerts: 0, critical_alerts: 0 });
      }
    } catch (err) {
      console.error('Lỗi khi tải thông báo:', err);
    } finally {
      if (!silent) setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchNotifications();
    // Tự động làm mới mỗi 45 giây
    const interval = setInterval(() => {
      fetchNotifications(true);
    }, 45000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Đánh dấu 1 thông báo là đã đọc
  const handleMarkAsRead = async (item) => {
    if (!item) return;
    // Cập nhật state cục bộ ngay lập tức (optimistic)
    if (!item.is_read) {
      setNotifications(prev => prev.map(n => n.id === item.id ? { ...n, is_read: true } : n));
      setStats(prev => ({ ...prev, unread: Math.max(0, prev.unread - 1) }));
    }
    try {
      await notificationApi.markAsRead(item.id, {
        user_id: currentUser?.id,
        username: currentUser?.username,
        role: currentUser?.role || 'superadmin'
      });
    } catch (err) {
      console.error('Lỗi đánh dấu đã đọc:', err);
    }
  };

  // Đánh dấu TẤT CẢ thông báo là đã đọc
  const handleMarkAllAsRead = async () => {
    // Cập nhật state cục bộ ngay lập tức
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    setStats(prev => ({ ...prev, unread: 0 }));
    message.success('Đã đánh dấu tất cả thông báo là đã đọc');

    try {
      await notificationApi.markAllAsRead({
        user_id: currentUser?.id,
        username: currentUser?.username,
        role: currentUser?.role || 'superadmin',
        faculty_id: currentUser?.faculty_id
      });
    } catch (err) {
      console.error('Lỗi khi lưu trạng thái đã đọc tất cả:', err);
    }
  };

  // Xem chi tiết thông báo
  const handleOpenDetail = (item) => {
    setSelectedNotif(item);
    setDetailModalVisible(true);
    handleMarkAsRead(item);
  };

  // Điều hướng nhanh đến phân hệ LMS tương ứng
  const handleActionClick = (item) => {
    if (item.action_menu_key && onNavigate) {
      onNavigate(item.action_menu_key);
      setPopoverOpen(false);
      setDetailModalVisible(false);
      message.info(`Đang chuyển đến: ${item.action_label || 'Phân hệ liên kết'}`);
    }
  };

  // Xóa thông báo
  const handleDeleteNotification = async (id) => {
    try {
      await notificationApi.deleteNotification(id);
      message.success('Đã xóa thông báo');
      setNotifications(prev => prev.filter(n => n.id !== id));
      if (selectedNotif?.id === id) {
        setDetailModalVisible(false);
      }
      fetchNotifications(true);
    } catch (err) {
      message.error('Lỗi khi xóa: ' + (err.message || 'Lỗi server'));
    }
  };

  // Gửi phát thông báo mới (Admin & Giảng viên)
  const handleCreateSubmit = async (values) => {
    setCreateLoading(true);
    try {
      const payload = {
        ...values,
        sender_name: currentUser?.full_name || (currentUser?.role === 'admin' ? 'Quản trị viên Hệ thống' : 'Giảng viên'),
        sender_role: currentUser?.role || 'admin'
      };
      const res = await notificationApi.createNotification(payload);
      if (res && res.success) {
        message.success('Đã phát thông báo thành công đến toàn hệ thống!');
        setCreateModalVisible(false);
        form.resetFields();
        fetchNotifications(true);
      }
    } catch (err) {
      message.error('Lỗi khi phát thông báo: ' + (err.message || 'Lỗi kết nối'));
    } finally {
      setCreateLoading(false);
    }
  };

  // Lọc danh sách theo tab và tìm kiếm
  const filteredNotifications = useMemo(() => {
    return notifications.filter(item => {
      // Lọc theo Tab
      if (activeTab === 'UNREAD' && item.is_read) return false;
      if (activeTab === 'ACADEMIC_ALERT' && item.category !== 'ACADEMIC_ALERT') return false;
      if (activeTab === 'SYSTEM' && item.category !== 'SYSTEM' && item.target_role !== 'ALL') return false;
      
      // Lọc theo Từ khóa
      if (searchText.trim()) {
        const q = searchText.toLowerCase();
        const inTitle = (item.title || '').toLowerCase().includes(q);
        const inContent = (item.content || '').toLowerCase().includes(q);
        const inSender = (item.sender_name || '').toLowerCase().includes(q);
        if (!inTitle && !inContent && !inSender) return false;
      }
      return true;
    });
  }, [notifications, activeTab, searchText]);

  // Cảnh báo học vụ khẩn cấp nhất chưa đọc (hiển thị alert nhỏ gọn ở đỉnh popover nếu có)
  const criticalWarning = useMemo(() => {
    return notifications.find(n => !n.is_read && n.priority === 'CRITICAL');
  }, [notifications]);

  // Helper render Priority Icon & Tag
  const renderPriorityBadge = (priority) => {
    switch (priority) {
      case 'CRITICAL':
        return <Tag color="error" style={{ fontSize: 10, borderRadius: 4, fontWeight: 700, margin: 0 }}>KHẨN CẤP</Tag>;
      case 'WARNING':
        return <Tag color="warning" style={{ fontSize: 10, borderRadius: 4, fontWeight: 600, margin: 0 }}>CẢNH BÁO</Tag>;
      case 'SUCCESS':
        return <Tag color="success" style={{ fontSize: 10, borderRadius: 4, margin: 0 }}>THÀNH CÔNG</Tag>;
      case 'INFO':
      default:
        return <Tag color="processing" style={{ fontSize: 10, borderRadius: 4, margin: 0 }}>THÔNG TIN</Tag>;
    }
  };

  const renderCategoryIcon = (category, priority) => {
    let icon = <NotificationOutlined style={{ fontSize: 14 }} />;
    let bg = '#e0f2fe';
    let color = '#0284c7';

    if (category === 'ACADEMIC_ALERT' || priority === 'CRITICAL') {
      icon = <WarningFilled style={{ fontSize: 14 }} />;
      bg = '#fee2e2';
      color = '#ef4444';
    } else if (category === 'EXAM_DEADLINE' || priority === 'WARNING') {
      icon = <FieldTimeOutlined style={{ fontSize: 14 }} />;
      bg = '#fef3c7';
      color = '#d97706';
    } else if (category === 'TEACHING') {
      icon = <ReadOutlined style={{ fontSize: 14 }} />;
      bg = '#ede9fe';
      color = '#6366f1';
    } else if (priority === 'SUCCESS') {
      icon = <CheckCircleOutlined style={{ fontSize: 14 }} />;
      bg = '#dcfce7';
      color = '#16a34a';
    }

    return (
      <div style={{
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: bg,
        color: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        {icon}
      </div>
    );
  };

  const canBroadcast = currentUser?.role === 'admin' || currentUser?.role === 'teacher';

  // NỘI DUNG POPOVER THÔNG BÁO NHỎ GỌN & HIỆN ĐẠI
  const popoverContent = (
    <div style={{ width: 410, maxWidth: '92vw', margin: -12, display: 'flex', flexDirection: 'column' }}>
      {/* HEADER POPOVER */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid #f1f5f9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#ffffff'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <BellOutlined style={{ color: '#1677ff', fontSize: 17 }} />
          <span style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>Trung Tâm Thông Báo</span>
          {stats.unread > 0 && (
            <span style={{
              background: '#ef4444',
              color: '#fff',
              fontSize: 11,
              fontWeight: 700,
              padding: '1px 7px',
              borderRadius: 10
            }}>
              {stats.unread} mới
            </span>
          )}
        </div>

        <Space size={4}>
          {canBroadcast && (
            <Tooltip title="Tạo thông báo mới">
              <Button
                type="text"
                size="small"
                icon={<PlusOutlined />}
                style={{ color: '#1677ff', fontWeight: 600, fontSize: 12 }}
                onClick={() => {
                  setPopoverOpen(false);
                  setCreateModalVisible(true);
                }}
              >
                Phát tin
              </Button>
            </Tooltip>
          )}

          <Tooltip title="Đánh dấu tất cả đã đọc">
            <Button
              type="text"
              size="small"
              icon={<CheckOutlined />}
              disabled={stats.unread === 0}
              onClick={handleMarkAllAsRead}
              style={{ color: stats.unread > 0 ? '#10b981' : '#94a3b8', fontSize: 12 }}
            />
          </Tooltip>

          <Tooltip title="Làm mới">
            <Button
              type="text"
              size="small"
              icon={<ReloadOutlined spin={loading} />}
              onClick={() => fetchNotifications(false)}
              style={{ color: '#64748b', fontSize: 12 }}
            />
          </Tooltip>
        </Space>
      </div>

      {/* THANH THAO TÁC 1-CHẠM: ĐÁNH DẤU TẤT CẢ ĐÃ ĐỌC */}
      {stats.unread > 0 && (
        <div style={{
          padding: '8px 14px',
          background: '#f0fdf4',
          borderBottom: '1px solid #bbf7d0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8
        }}>
          <span style={{ fontSize: 12, color: '#166534', fontWeight: 600 }}>
            🔔 Có {stats.unread} thông báo mới chưa xem
          </span>
          <Button
            type="primary"
            size="small"
            icon={<CheckOutlined />}
            style={{
              backgroundColor: '#16a34a',
              borderColor: '#16a34a',
              fontSize: 11,
              height: 24,
              borderRadius: 4,
              fontWeight: 600
            }}
            onClick={handleMarkAllAsRead}
          >
            Đã đọc tất cả
          </Button>
        </div>
      )}

      {/* CẢNH BÁO KHẨN CẤP NHỎ GỌN (BANNER NẾU CÓ) */}
      {criticalWarning && (
        <div style={{
          padding: '8px 12px',
          background: '#fff1f2',
          borderBottom: '1px solid #fecdd3',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontSize: 12
        }}>
          <WarningFilled style={{ color: '#e11d48', fontSize: 15 }} />
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <span style={{ fontWeight: 700, color: '#9f1239' }}>Cảnh báo khẩn cấp: </span>
            <span style={{ color: '#be123c' }}>{criticalWarning.title}</span>
          </div>
          <Button
            size="small"
            type="primary"
            danger
            style={{ fontSize: 11, height: 22, padding: '0 8px', borderRadius: 4 }}
            onClick={() => handleOpenDetail(criticalWarning)}
          >
            Xem
          </Button>
        </div>
      )}

      {/* THANH TÌM KIẾM NHỎ GỌN */}
      <div style={{ padding: '8px 12px 4px 12px', background: '#fafafa' }}>
        <Input
          prefix={<SearchOutlined style={{ color: '#94a3b8', fontSize: 12 }} />}
          placeholder="Tìm tiêu đề, nội dung, người gửi..."
          size="small"
          allowClear
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ borderRadius: 6, fontSize: 12 }}
        />
      </div>

      {/* TABS PHÂN LOẠI */}
      <div style={{ padding: '0 12px', background: '#fafafa', borderBottom: '1px solid #f1f5f9' }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          size="small"
          tabBarStyle={{ marginBottom: 0 }}
          items={[
            {
              key: 'ALL',
              label: (
                <span style={{ fontSize: 12 }}>
                  Tất cả ({notifications.length})
                </span>
              )
            },
            {
              key: 'ACADEMIC_ALERT',
              label: (
                <span style={{ fontSize: 12 }}>
                  Học vụ ⚠️ ({stats.academic_alerts || 0})
                </span>
              )
            },
            {
              key: 'UNREAD',
              label: (
                <span style={{ fontSize: 12 }}>
                  Chưa đọc ({stats.unread})
                </span>
              )
            },
            {
              key: 'SYSTEM',
              label: (
                <span style={{ fontSize: 12 }}>
                  Hệ thống 📢
                </span>
              )
            }
          ]}
        />
      </div>

      {/* DANH SÁCH THÔNG BÁO CUỘN MƯỢT */}
      <div style={{
        maxHeight: 380,
        overflowY: 'auto',
        background: '#ffffff'
      }}>
        {loading ? (
          <div style={{ padding: '40px 0', textAlign: 'center' }}>
            <Spin tip="Đang tải dữ liệu thông báo..." size="small" />
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div style={{ padding: '36px 16px', textAlign: 'center' }}>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <span style={{ color: '#94a3b8', fontSize: 12 }}>
                  {searchText ? 'Không tìm thấy thông báo phù hợp' : 'Không có thông báo nào trong mục này'}
                </span>
              }
            />
          </div>
        ) : (
          filteredNotifications.map((item) => {
            const isUnread = !item.is_read;
            const isCritical = item.priority === 'CRITICAL';
            
            return (
              <div
                key={item.id}
                onClick={() => handleOpenDetail(item)}
                style={{
                  padding: '10px 14px',
                  display: 'flex',
                  gap: 12,
                  alignItems: 'flex-start',
                  cursor: 'pointer',
                  borderBottom: '1px solid #f8fafc',
                  backgroundColor: isUnread ? '#f8faff' : '#ffffff',
                  borderLeft: isCritical
                    ? '3px solid #ef4444'
                    : isUnread
                    ? '3px solid #3b82f6'
                    : '3px solid transparent',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = isUnread ? '#f8faff' : '#ffffff')}
              >
                {/* ICON DANH MỤC */}
                {renderCategoryIcon(item.category, item.priority)}

                {/* NỘI DUNG THẺ */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, marginBottom: 2 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                      {renderPriorityBadge(item.priority)}
                      <span style={{
                        fontSize: 13,
                        fontWeight: isUnread ? 700 : 600,
                        color: isCritical ? '#dc2626' : (isUnread ? '#0f172a' : '#334155'),
                        lineHeight: 1.3
                      }}>
                        {item.title}
                      </span>
                    </div>

                    {isUnread && (
                      <span style={{
                        width: 7,
                        height: 7,
                        borderRadius: '50%',
                        backgroundColor: isCritical ? '#ef4444' : '#2563eb',
                        flexShrink: 0
                      }} />
                    )}
                  </div>

                  <p style={{
                    fontSize: 12,
                    color: '#64748b',
                    margin: '3px 0 6px 0',
                    lineHeight: 1.4,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {item.content}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11, color: '#94a3b8' }}>
                    <span>{item.sender_name}</span>
                    <span>{formatRelativeTime(item.created_at)}</span>
                  </div>

                  {/* NÚT THAO TÁC NHANH TRÊN THẺ (NẾU CÓ ĐIỀU HƯỚNG) */}
                  {item.action_menu_key && (
                    <div style={{ marginTop: 6, display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        type="link"
                        size="small"
                        icon={<ArrowRightOutlined />}
                        style={{ padding: 0, height: 'auto', fontSize: 11, color: '#2563eb' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleActionClick(item);
                        }}
                      >
                        {item.action_label || 'Xem phân hệ'}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* FOOTER POPOVER */}
      <div style={{
        padding: '8px 14px',
        borderTop: '1px solid #f1f5f9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: 11,
        color: '#64748b',
        background: '#fafafa'
      }}>
        <span>Hệ thống thông báo toàn diện LMS</span>
        <span>{filteredNotifications.length} thông báo</span>
      </div>
    </div>
  );

  return (
    <>
      {/* NÚT CHUÔNG THÔNG BÁO VỚI BADGE TRÊN THANH HEADER */}
      <Popover
        content={popoverContent}
        trigger="click"
        placement="bottomRight"
        open={popoverOpen}
        onOpenChange={setPopoverOpen}
        overlayInnerStyle={{ padding: 12, borderRadius: 12, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15), 0 8px 10px -6px rgba(0,0,0,0.1)' }}
        arrow={{ pointAtCenter: true }}
      >
        <Badge
          count={stats.unread}
          overflowCount={99}
          offset={[-3, 4]}
          style={{
            backgroundColor: stats.critical_alerts > 0 ? '#ef4444' : '#1677ff',
            boxShadow: '0 0 0 1px #fff'
          }}
        >
          <Button
            type="text"
            shape="circle"
            icon={<BellOutlined style={{ fontSize: 18, color: '#334155' }} />}
            style={{ width: 40, height: 40 }}
          />
        </Badge>
      </Popover>

      {/* 1. MODAL CHI TIẾT THÔNG BÁO NHỎ GỌN & TRANG NHÃ */}
      <Modal
        title={null}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={500}
        centered
        styles={{ body: { padding: '20px 24px' } }}
      >
        {selectedNotif && (
          <div>
            {/* Header chi tiết */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              {renderCategoryIcon(selectedNotif.category, selectedNotif.priority)}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                  {renderPriorityBadge(selectedNotif.priority)}
                  <Tag color="blue" style={{ fontSize: 11, margin: 0 }}>
                    {selectedNotif.category === 'ACADEMIC_ALERT' ? 'Cảnh Báo Học Vụ'
                      : selectedNotif.category === 'EXAM_DEADLINE' ? 'Khảo Thí & Deadline'
                      : selectedNotif.category === 'TEACHING' ? 'Giảng Dạy'
                      : 'Hệ Thống Nhà Trường'}
                  </Tag>
                </div>
                <div style={{ fontSize: 11, color: '#94a3b8' }}>
                  {new Date(selectedNotif.created_at).toLocaleString('vi-VN')} ({formatRelativeTime(selectedNotif.created_at)})
                </div>
              </div>
            </div>

            {/* Tiêu đề */}
            <h3 style={{
              fontSize: 16,
              fontWeight: 700,
              color: selectedNotif.priority === 'CRITICAL' ? '#dc2626' : '#0f172a',
              margin: '0 0 12px 0',
              lineHeight: 1.4
            }}>
              {selectedNotif.title}
            </h3>

            {/* Khung trích dẫn cơ quan / người phát hành */}
            <div style={{
              padding: '8px 12px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 6,
              fontSize: 12,
              marginBottom: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <span style={{ color: '#64748b' }}>Đơn vị gửi: </span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>{selectedNotif.sender_name}</span>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>Phạm vi: </span>
                <span style={{ fontWeight: 600, color: '#2563eb' }}>
                  {selectedNotif.target_role === 'ALL' ? 'Toàn trường' : selectedNotif.target_role === 'student' ? 'Sinh viên' : 'Giảng viên'}
                </span>
              </div>
            </div>

            {/* Nội dung thông báo đầy đủ */}
            <div style={{
              padding: '12px 14px',
              background: '#ffffff',
              borderRadius: 8,
              border: '1px solid #f1f5f9',
              fontSize: 13,
              color: '#334155',
              lineHeight: 1.6,
              whiteSpace: 'pre-wrap',
              maxHeight: 280,
              overflowY: 'auto',
              marginBottom: 20
            }}>
              {selectedNotif.content}
            </div>

            {/* Chân trang Modal */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: 14 }}>
              {(currentUser?.role === 'admin' || selectedNotif.sender_name?.includes(currentUser?.full_name)) ? (
                <Popconfirm
                  title="Xóa thông báo này?"
                  description="Thông báo sẽ bị xóa vĩnh viễn khỏi hệ thống."
                  onConfirm={() => handleDeleteNotification(selectedNotif.id)}
                  okText="Xóa"
                  cancelText="Hủy"
                  okButtonProps={{ danger: true, size: 'small' }}
                  cancelButtonProps={{ size: 'small' }}
                >
                  <Button danger type="text" size="small" icon={<DeleteOutlined />}>
                    Xóa
                  </Button>
                </Popconfirm>
              ) : <div />}

              <Space>
                {!selectedNotif.is_read && (
                  <Button
                    size="small"
                    icon={<CheckOutlined />}
                    style={{ color: '#16a34a', borderColor: '#86efac' }}
                    onClick={() => {
                      handleMarkAsRead(selectedNotif);
                      message.success('Đã đánh dấu thông báo là đã đọc');
                    }}
                  >
                    Đánh dấu đã đọc
                  </Button>
                )}
                <Button size="small" onClick={() => {
                  handleMarkAsRead(selectedNotif);
                  setDetailModalVisible(false);
                }}>
                  Đóng
                </Button>
                {selectedNotif.action_menu_key && (
                  <Button
                    type="primary"
                    size="small"
                    icon={<ArrowRightOutlined />}
                    onClick={() => {
                      handleMarkAsRead(selectedNotif);
                      handleActionClick(selectedNotif);
                    }}
                    style={{ backgroundColor: '#1677ff' }}
                  >
                    {selectedNotif.action_label || 'Đến trang liên quan'}
                  </Button>
                )}
              </Space>
            </div>
          </div>
        )}
      </Modal>

      {/* 2. MODAL PHÁT THÔNG BÁO MỚI (DÀNH CHO ADMIN & GIẢNG VIÊN) */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <SendOutlined style={{ color: '#1677ff' }} />
            <span>Phát Thông Báo / Cảnh Báo Hệ Thống</span>
          </div>
        }
        open={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        footer={null}
        width={560}
        centered
        styles={{ body: { padding: '16px 24px' } }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateSubmit}
          initialValues={{
            category: 'ACADEMIC_ALERT',
            priority: 'INFO',
            target_role: 'ALL',
            target_faculty: 'ALL'
          }}
        >
          <Form.Item
            name="title"
            label="Tiêu đề thông báo / Cảnh báo"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề thông báo' }]}
            style={{ marginBottom: 12 }}
          >
            <Input placeholder="Ví dụ: Cảnh báo học vụ vắng học quá 20% (TT 08/2021)..." maxLength={150} showCount />
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 4 }}>
            <Form.Item
              name="category"
              label="Phân loại danh mục"
              rules={[{ required: true }]}
              style={{ marginBottom: 12 }}
            >
              <Select options={[
                { value: 'ACADEMIC_ALERT', label: '⚠️ Cảnh báo học vụ (TT 08/2021)' },
                { value: 'EXAM_DEADLINE', label: '⏳ Lịch thi & Hạn chót nộp bài' },
                { value: 'TEACHING', label: '📚 Giảng dạy & Đào tạo' },
                { value: 'SYSTEM', label: '📢 Thông báo hệ thống & Trường' }
              ]} />
            </Form.Item>

            <Form.Item
              name="priority"
              label="Mức độ ưu tiên"
              rules={[{ required: true }]}
              style={{ marginBottom: 12 }}
            >
              <Select options={[
                { value: 'INFO', label: '🔵 Thông tin bình thường' },
                { value: 'WARNING', label: '🟠 Cảnh báo chú ý' },
                { value: 'CRITICAL', label: '🔴 Khẩn cấp (Nguy cơ cấm thi / Hết hạn)' },
                { value: 'SUCCESS', label: '🟢 Thông báo thành công' }
              ]} />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 4 }}>
            <Form.Item
              name="target_role"
              label="Đối tượng nhận tin"
              rules={[{ required: true }]}
              style={{ marginBottom: 12 }}
            >
              <Select options={[
                { value: 'ALL', label: 'Toàn trường (Sinh viên & Giảng viên)' },
                { value: 'student', label: 'Chỉ Sinh Viên' },
                { value: 'teacher', label: 'Chỉ Giảng Viên' },
                { value: 'admin', label: 'Chỉ Quản trị viên' }
              ]} />
            </Form.Item>

            <Form.Item
              name="target_faculty"
              label="Phạm vi Đơn vị / Khoa"
              style={{ marginBottom: 12 }}
            >
              <Select options={[
                { value: 'ALL', label: 'Tất cả các Khoa' },
                { value: 'CNTT', label: 'Khoa Công Nghệ Thông Tin' },
                { value: 'NN', label: 'Khoa Ngoại Ngữ' },
                { value: 'DDT', label: 'Khoa Điện - Điện Tử' },
                { value: 'DL', label: 'Khoa Du Lịch & Khách Sạn' }
              ]} />
            </Form.Item>
          </div>

          <Form.Item
            name="action_menu_key"
            label="Liên kết điều hướng nhanh (Tùy chọn)"
            style={{ marginBottom: 12 }}
          >
            <Select
              allowClear
              placeholder="Chọn phân hệ sinh viên/giảng viên sẽ chuyển đến khi click"
              options={NAVIGATION_OPTIONS}
            />
          </Form.Item>

          <Form.Item
            name="content"
            label="Nội dung chi tiết thông báo"
            rules={[{ required: true, message: 'Vui lòng nhập nội dung chi tiết' }]}
            style={{ marginBottom: 16 }}
          >
            <TextArea
              rows={4}
              placeholder="Nhập nội dung đầy đủ, hướng dẫn xử lý hoặc căn cứ theo quy định của Nhà trường..."
              showCount
              maxLength={1500}
            />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button onClick={() => setCreateModalVisible(false)}>
              Hủy
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SendOutlined />}
              loading={createLoading}
              style={{ backgroundColor: '#1677ff' }}
            >
              Phát thông báo ngay
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
}

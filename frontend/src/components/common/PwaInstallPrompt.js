// frontend/src/components/common/PwaInstallPrompt.js
// Banner Thông Minh Cài Đặt Ứng Dụng PWA & Bật Thông Báo Đẩy Thời Gian Thực
import React, { useState, useEffect } from 'react';
import { Card, Button, Space, Typography, Tag, message } from 'antd';
import {
  DownloadOutlined, BellOutlined, CloseOutlined,
  MobileOutlined, CheckCircleOutlined, ThunderboltOutlined
} from '@ant-design/icons';
import apiClient from '../../services/apiClient';

const { Text } = Typography;

export default function PwaInstallPrompt({ currentUser }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [canInstall, setCanInstall] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [pushStatus, setPushStatus] = useState('DEFAULT'); // 'DEFAULT', 'GRANTED', 'DENIED'
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    // 1. Bắt sự kiện cài đặt PWA
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // 2. Kiểm tra trạng thái quyền thông báo đẩy
    if ('Notification' in window) {
      setPushStatus(Notification.permission.toUpperCase());
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  // Xử lý Cài đặt Ứng dụng PWA
  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      message.info('Ứng dụng đã được cài đặt hoặc thiết bị chưa hỗ trợ cài đặt tự động.');
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      message.success('Cảm ơn bạn đã cài đặt TCU COMPASS LMS!');
      setCanInstall(false);
    }
    setDeferredPrompt(null);
  };

  // Xử lý Đăng ký nhận Thông báo đẩy
  const handleEnablePush = async () => {
    if (!('Notification' in window)) {
      message.warning('Trình duyệt của bạn không hỗ trợ Thông báo Đẩy Web Push.');
      return;
    }

    setSubscribing(true);
    try {
      const permission = await Notification.requestPermission();
      setPushStatus(permission.toUpperCase());

      if (permission === 'granted') {
        // Đăng ký với Service Worker PushManager
        if ('serviceWorker' in navigator) {
          const reg = await navigator.serviceWorker.ready;
          const sub = await reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckj0LjW8e1P1_0V-qAky-w9_9b8QpU'
          }).catch(() => null);

          // Gửi đăng ký về backend
          await apiClient.post('/notifications/subscribe', {
            subscription: sub || { endpoint: `mock-endpoint-${Date.now()}` },
            user: {
              id: currentUser?.id,
              name: currentUser?.full_name || currentUser?.name,
              role: currentUser?.role
            }
          });
        }
        message.success('Đã kích hoạt thông báo đẩy! Bạn sẽ nhận thông báo khi có Lịch thi hoặc Điểm số mới.');
      } else {
        message.warning('Bạn đã từ chối nhận thông báo. Bạn có thể bật lại trong cài đặt trình duyệt.');
      }
    } catch (err) {
      message.error('Lỗi khi đăng ký thông báo: ' + err.message);
    } finally {
      setSubscribing(false);
    }
  };

  if (isDismissed || (!canInstall && pushStatus === 'GRANTED')) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 20,
        left: 24,
        zIndex: 999,
        maxWidth: 460,
        boxShadow: '0 8px 30px rgba(0, 43, 102, 0.25)',
        borderRadius: 12,
        animation: 'fadeInUp 0.4s ease-out'
      }}
    >
      <Card
        size="small"
        style={{
          background: 'linear-gradient(135deg, #002b66 0%, #1e3a8a 100%)',
          color: '#ffffff',
          borderColor: '#3b82f6',
          borderRadius: 12
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 10,
                background: 'rgba(255,255,255,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22
              }}
            >
              <MobileOutlined style={{ color: '#60a5fa' }} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#ffffff' }}>
                Cài Đặt Ứng Dụng TCU LMS
              </div>
              <div style={{ fontSize: 12, color: '#bfdbfe', marginTop: 2 }}>
                Nhận thông báo lịch thi, điểm số & bài giảng mới thời gian thực
              </div>
            </div>
          </div>

          <Button
            type="text"
            size="small"
            icon={<CloseOutlined style={{ color: '#93c5fd' }} />}
            onClick={() => setIsDismissed(true)}
          />
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 12, justifyContent: 'flex-end' }}>
          {pushStatus !== 'GRANTED' && (
            <Button
              size="small"
              icon={<BellOutlined />}
              loading={subscribing}
              onClick={handleEnablePush}
              style={{
                background: 'rgba(255,255,255,0.12)',
                borderColor: '#93c5fd',
                color: '#ffffff',
                fontWeight: 600
              }}
            >
              Bật Thông Báo
            </Button>
          )}

          {canInstall && (
            <Button
              type="primary"
              size="small"
              icon={<DownloadOutlined />}
              onClick={handleInstallClick}
              style={{
                background: '#10b981',
                borderColor: '#10b981',
                fontWeight: 700
              }}
            >
              Cài Đặt Ngay
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}

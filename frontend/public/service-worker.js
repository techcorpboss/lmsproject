// frontend/public/service-worker.js
// TCU COMPASS LMS Progressive Web App Service Worker
// Quản lý Bộ đệm Ngoại tuyến (Offline Caching) & Thông báo Đẩy (Web Push Notifications)
const CACHE_NAME = 'tcu-lms-cache-v3';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png'
];

// 1. Cài đặt Service Worker và lưu đệm App Shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[SW] Cache precache warning:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// 2. Kích hoạt và dọn dẹp các phiên bản cache cũ
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Xử lý yêu cầu tài nguyên mạng (Network-first với Cache Fallback)
self.addEventListener('fetch', (event) => {
  // Chỉ cache các yêu cầu GET không phải API
  if (event.request.method !== 'GET' || event.request.url.includes('/api/')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Cập nhật bộ đệm với dữ liệu mới
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Fallback về Cache nếu mất mạng
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          if (event.request.headers.get('accept')?.includes('text/html')) {
            return caches.match('/index.html');
          }
        });
      })
  );
});

// 4. Lắng nghe Thông báo Đẩy từ Máy chủ (Web Push Event)
self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = { notification: { title: 'TCU LMS', body: event.data ? event.data.text() : 'Thông báo mới' } };
  }

  const notification = data.notification || {};
  const title = notification.title || 'TCU COMPASS LMS - Thông Báo';
  const options = {
    body: notification.body || 'Bạn có thông báo mới về lịch thi hoặc điểm số.',
    icon: notification.icon || '/logo192.png',
    badge: notification.badge || '/favicon.ico',
    vibrate: [100, 50, 100],
    data: notification.data || { url: '/' },
    actions: notification.actions || [
      { action: 'open_url', title: 'Xem chi tiết' },
      { action: 'close', title: 'Bỏ qua' }
    ]
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// 5. Bắt sự kiện người dùng nhấp vào thông báo
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Nếu có tab đang mở -> Focus vào tab đó
      for (let client of windowClients) {
        if ('focus' in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      // Nếu chưa có tab nào mở -> Mở cửa sổ mới
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});

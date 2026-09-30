// frontend/src/serviceWorkerRegistration.js
// Quản lý đăng ký Service Worker cho TCU LMS PWA
export function register(config) {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

      navigator.serviceWorker
        .register(swUrl)
        .then((registration) => {
          console.log('[PWA] Service Worker đăng ký thành công:', registration.scope);

          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker == null) return;

            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  console.log('[PWA] Có phiên bản mới của hệ thống LMS.');
                  if (config && config.onUpdate) config.onUpdate(registration);
                } else {
                  console.log('[PWA] Nội dung đã được lưu đệm để chạy ngoại tuyến.');
                  if (config && config.onSuccess) config.onSuccess(registration);
                }
              }
            };
          };
        })
        .catch((error) => {
          console.warn('[PWA] Lỗi đăng ký Service Worker:', error);
        });
    });
  }
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}

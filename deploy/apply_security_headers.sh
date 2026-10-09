#!/usr/bin/env bash
# ==============================================================================
# Script tự động cập nhật Nginx Security Headers trên Ubuntu Server
# ==============================================================================

echo "==> 1. Kiểm tra cấu hình Nginx..."
cp /www/wwwroot/lms.techcorp.info.vn/deploy/nginx_lms.techcorp.info.vn.conf /etc/nginx/sites-available/lms.techcorp.info.vn

echo "==> 2. Test cú pháp Nginx..."
nginx -t

if [ $? -eq 0 ]; then
    echo "==> 3. Cú pháp Nginx hợp lệ! Tiến hành nạp lại cấu hình (Reload Zero-Downtime)..."
    systemctl reload nginx
    echo "==> Cập nhật Nginx Security Headers thành công!"
else
    echo "==> LỖI CÚ PHÁP NGINX! Không thể reload."
    exit 1
fi

#!/bin/bash
# ==============================================================================
# Script Triển Khai Tự Động LMS & Khảo Thí Trực Tuyến: lms.techcorp.info.vn
# Chạy trên máy chủ Ubuntu 20.04/22.04/24.04
# ==============================================================================

set -e

DOMAIN="lms.techcorp.info.vn"
PROJECT_DIR="/www/wwwroot/$DOMAIN"
DB_NAME="lms_db"
DB_USER="root"
DB_PASS="root123@"

echo "=========================================================="
echo "🚀 BẮT ĐẦU TRIỂN KHAI HỆ THỐNG: $DOMAIN"
echo "=========================================================="

# 1. Tạo thư mục dự án nếu chưa có
echo "📁 1. Kiểm tra thư mục dự án..."
mkdir -p $PROJECT_DIR

# 2. Khởi tạo Database và nạp dữ liệu mẫu
echo "🗄️ 2. Khởi tạo Cơ sở dữ liệu $DB_NAME..."
mysql -u$DB_USER -p$DB_PASS -e "CREATE DATABASE IF NOT EXISTS $DB_NAME DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

if [ -f "$PROJECT_DIR/database/lms_schema_and_seed.sql" ]; then
    echo "📥 Đang nạp schema và dữ liệu mẫu vào $DB_NAME..."
    mysql -u$DB_USER -p$DB_PASS $DB_NAME < "$PROJECT_DIR/database/lms_schema_and_seed.sql"
    echo "✅ Đã nạp dữ liệu cơ sở dữ liệu thành công!"
fi

# 3. Cài đặt dependencies và khởi động Backend
echo "⚙️ 3. Thiết lập Backend NodeJS..."
cd "$PROJECT_DIR/backend"
if [ ! -f ".env" ]; then
    cp .env.production .env
fi
npm install --production

# Khởi động PM2
echo "⚡ Khởi động dịch vụ Backend bằng PM2..."
pm2 delete lms-backend || true
pm2 start "$PROJECT_DIR/deploy/ecosystem.config.js"
pm2 save

# 4. Build Frontend React
echo "🎨 4. Cài đặt và Đóng gói Frontend..."
cd "$PROJECT_DIR/frontend"
npm install --legacy-peer-deps
npm run build

# 5. Cấu hình Nginx
echo "🌐 5. Cấu hình Nginx cho tên miền $DOMAIN..."
cp "$PROJECT_DIR/deploy/nginx_lms.techcorp.info.vn.conf" "/etc/nginx/sites-available/$DOMAIN"
ln -sf "/etc/nginx/sites-available/$DOMAIN" "/etc/nginx/sites-enabled/$DOMAIN"

nginx -t
systemctl reload nginx

echo "=========================================================="
echo "🎉 TRIỂN KHAI HOÀN TẤT THÀNH CÔNG!"
echo "🌐 Truy cập hệ thống tại: http://$DOMAIN"
echo "🔒 Để bật SSL/HTTPS tự động, chạy lệnh: certbot --nginx -d $DOMAIN"
echo "=========================================================="

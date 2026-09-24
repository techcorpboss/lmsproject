#!/bin/bash
# ==============================================================================
# Script Triển Khai Tự Động LMS & Khảo Thí Trực Tuyến: lms.techcorp.info.vn
# Chạy trên máy chủ Ubuntu 20.04/22.04/24.04
# Cách dùng: ./deploy/deploy_ubuntu.sh [mat_khau_mysql_root]
# ==============================================================================

set -e

DOMAIN="lms.techcorp.info.vn"
PROJECT_DIR="/www/wwwroot/$DOMAIN"
DB_NAME="lms_db"
DB_USER="root"

echo "=========================================================="
echo "🚀 BẮT ĐẦU TRIỂN KHAI HỆ THỐNG: $DOMAIN"
echo "=========================================================="

# 1. Xác định mật khẩu MySQL
DB_PASS="${1:-}"
if [ -z "$DB_PASS" ]; then
    # Thử kiểm tra xem root123@ có đăng nhập được không
    if mysql -u$DB_USER -proot123@ -e "SELECT 1;" >/dev/null 2>&1; then
        DB_PASS="root123@"
    elif mysql -u$DB_USER -pThong7690@ -e "SELECT 1;" >/dev/null 2>&1; then
        DB_PASS="Thong7690@"
    elif mysql -u$DB_USER -e "SELECT 1;" >/dev/null 2>&1; then
        DB_PASS=""
    else
        echo "⚠️ Không thể đăng nhập bằng mật khẩu mặc định."
        read -s -p "👉 Vui lòng nhập mật khẩu MySQL root của server bạn: " DB_PASS
        echo ""
    fi
fi

# 2. Khởi tạo Database và nạp dữ liệu mẫu
echo "🗄️ 2. Khởi tạo Cơ sở dữ liệu $DB_NAME..."
MYSQL_CMD="mysql -u$DB_USER"
if [ -n "$DB_PASS" ]; then
    MYSQL_CMD="mysql -u$DB_USER -p$DB_PASS"
fi

$MYSQL_CMD -e "CREATE DATABASE IF NOT EXISTS $DB_NAME DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

if [ -f "$PROJECT_DIR/database/lms_schema_and_seed.sql" ]; then
    echo "📥 Đang nạp schema và dữ liệu mẫu vào $DB_NAME..."
    $MYSQL_CMD $DB_NAME < "$PROJECT_DIR/database/lms_schema_and_seed.sql"
    echo "✅ Đã nạp dữ liệu cơ sở dữ liệu thành công!"
fi

# 3. Cài đặt dependencies và khởi động Backend
echo "⚙️ 3. Thiết lập Backend NodeJS..."
cd "$PROJECT_DIR/backend"
if [ ! -f ".env" ]; then
    cp .env.production .env
fi

# Cập nhật mật khẩu DB thực tế vào file .env
sed -i "s/DB_PASSWORD=.*/DB_PASSWORD=$DB_PASS/g" .env

npm install --production

# Khởi động PM2
echo "⚡ Khởi động dịch vụ Backend bằng PM2 (Port 5009)..."
pm2 delete lms-backend 2>/dev/null || true
pm2 start "$PROJECT_DIR/deploy/ecosystem.config.js"
pm2 save

# 4. Build Frontend React
echo "🎨 4. Kiểm tra Frontend..."
cd "$PROJECT_DIR/frontend"
if [ ! -d "build" ]; then
    echo "Đang build Frontend React..."
    npm install --legacy-peer-deps
    npm run build
fi

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

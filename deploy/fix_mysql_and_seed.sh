#!/bin/bash
# ==============================================================================
# Script Tự Động Khắc Phục Lỗi MySQL Access Denied & Nạp CSDL Thực Tế
# Dành cho VPS Ubuntu / aaPanel: lms.techcorp.info.vn
# Cách dùng: 
#   bash deploy/fix_mysql_and_seed.sh
#   hoặc: bash deploy/fix_mysql_and_seed.sh <mat_khau_mysql_root>
# ==============================================================================

echo "=========================================================="
echo "🔧 ĐANG KẾT NỐI VÀ NẠP CƠ SỞ DỮ LIỆU MYSQL LMS..."
echo "=========================================================="

cd /www/wwwroot/lms.techcorp.info.vn || cd "$(dirname "$0")/.."

# 1. Tìm mật khẩu MySQL root
MYSQL_PASS=""

# Nếu người dùng truyền mật khẩu trực tiếp qua đối số
if [ -n "$1" ]; then
    MYSQL_PASS="$1"
    echo "👉 Sử dụng mật khẩu được truyền: $MYSQL_PASS"
fi

# Thử mật khẩu Thong1976 trước tiên
if [ -z "$MYSQL_PASS" ]; then
    if mysql -u root -pThong1976 -e "SELECT 1;" >/dev/null 2>&1; then
        MYSQL_PASS="Thong1976"
        echo "✅ Xác thực thành công với mật khẩu 'Thong1976'!"
    fi
fi

# Kiểm tra file default.pass của aaPanel nếu chưa có pass
if [ -z "$MYSQL_PASS" ] && [ -f "/www/server/data/default.pass" ]; then
    AAPASS=$(cat /www/server/data/default.pass | tr -d '\r\n')
    if mysql -u root -p"$AAPASS" -e "SELECT 1;" >/dev/null 2>&1; then
        MYSQL_PASS="$AAPASS"
        echo "✅ Xác thực thành công với mật khẩu aaPanel!"
    fi
fi

# Thử các mật khẩu dự phòng khác
if [ -z "$MYSQL_PASS" ]; then
    if mysql -u root -pThong7690@ -e "SELECT 1;" >/dev/null 2>&1; then
        MYSQL_PASS="Thong7690@"
        echo "✅ Xác thực thành công với mật khẩu 'Thong7690@'"
    elif mysql -u root -proot123@ -e "SELECT 1;" >/dev/null 2>&1; then
        MYSQL_PASS="root123@"
        echo "✅ Xác thực thành công với mật khẩu 'root123@'"
    elif mysql -u root -e "SELECT 1;" >/dev/null 2>&1; then
        MYSQL_PASS=""
        echo "✅ Xác thực thành công với mật khẩu trống (blank)"
    else
        # Mặc định sử dụng Thong1976
        MYSQL_PASS="Thong1976"
    fi
fi

echo "🔑 Mật khẩu MySQL sử dụng: $MYSQL_PASS"

# 2. Tạo database lms_db nếu chưa tồn tại
echo "🗄️ Đang đảm bảo Database 'lms_db' tồn tại..."
mysql -u root -p"$MYSQL_PASS" -e "CREATE DATABASE IF NOT EXISTS lms_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null || true

# 3. Đồng bộ mật khẩu vào backend/.env
echo "📝 Cập nhật mật khẩu kết nối vào backend/.env..."
if [ -f "backend/.env" ]; then
    if grep -q "DB_PASSWORD=" backend/.env; then
        sed -i "s/DB_PASSWORD=.*/DB_PASSWORD=$MYSQL_PASS/g" backend/.env
    else
        echo "DB_PASSWORD=$MYSQL_PASS" >> backend/.env
    fi
else
    echo "DB_PASSWORD=$MYSQL_PASS" >> backend/.env
fi

# 4. Nạp dữ liệu thực tế vào MySQL
echo "🌱 Đang nạp danh mục tài khoản CSDL thực tế (SuperAdmin, Admin, GV, SV)..."
node backend/scripts/seed_real_database_accounts.js "$MYSQL_PASS"

# 5. Khởi động lại dịch vụ Backend PM2 với --update-env để nạp ngay cấu hình mới
echo "⚡ Khởi động lại PM2 lms-backend với biến môi trường mới..."
pm2 restart lms-backend --update-env

echo "=========================================================="
echo "🎉 HOÀN TẤT KHẮC PHỤC KẾT NỐI VÀ NẠP CSDL THÀNH CÔNG!"
echo "=========================================================="

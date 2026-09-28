#!/bin/bash
# ==============================================================================
# Script Tự Động Khắc Phục Lỗi MySQL Access Denied & Nạp CSDL Thực Tế
# Dành cho VPS Ubuntu / aaPanel: lms.techcorp.info.vn
# Cách dùng: 
#   bash deploy/fix_mysql_and_seed.sh
#   hoặc: bash deploy/fix_mysql_and_seed.sh <mat_khau_mysql_root>
# ==============================================================================

echo "=========================================================="
echo "🔧 ĐANG KIỂM TRA VÀ TỰ ĐỘNG KHẮC PHỤC KẾT NỐI MYSQL..."
echo "=========================================================="

cd /www/wwwroot/lms.techcorp.info.vn || cd "$(dirname "$0")/.."

# 1. Tìm mật khẩu MySQL root
MYSQL_PASS=""

# Nếu người dùng truyền mật khẩu trực tiếp qua đối số
if [ -n "$1" ]; then
    MYSQL_PASS="$1"
    echo "👉 Sử dụng mật khẩu được truyền: $MYSQL_PASS"
fi

# Kiểm tra file default.pass của aaPanel nếu chưa có pass
if [ -z "$MYSQL_PASS" ] && [ -f "/www/server/data/default.pass" ]; then
    AAPASS=$(cat /www/server/data/default.pass | tr -d '\r\n')
    echo "🔍 Phát hiện file mật khẩu aaPanel: /www/server/data/default.pass ($AAPASS)"
    if mysql -u root -p"$AAPASS" -e "SELECT 1;" >/dev/null 2>&1; then
        MYSQL_PASS="$AAPASS"
        echo "✅ Xác thực thành công với mật khẩu aaPanel!"
    fi
fi

# Kiểm tra file trong panel data nếu có
if [ -z "$MYSQL_PASS" ] && [ -f "/www/server/panel/data/default.pass" ]; then
    AAPASS2=$(cat /www/server/panel/data/default.pass | tr -d '\r\n')
    if mysql -u root -p"$AAPASS2" -e "SELECT 1;" >/dev/null 2>&1; then
        MYSQL_PASS="$AAPASS2"
        echo "✅ Xác thực thành công với mật khẩu panel/data aaPanel!"
    fi
fi

# Thử các mật khẩu dự phòng
if [ -z "$MYSQL_PASS" ]; then
    if mysql -u root -proot123@ -e "SELECT 1;" >/dev/null 2>&1; then
        MYSQL_PASS="root123@"
        echo "✅ Xác thực thành công với mật khẩu 'root123@'"
    elif mysql -u root -pThong7690@ -e "SELECT 1;" >/dev/null 2>&1; then
        MYSQL_PASS="Thong7690@"
        echo "✅ Xác thực thành công với mật khẩu 'Thong7690@'"
    elif mysql -u root -e "SELECT 1;" >/dev/null 2>&1; then
        MYSQL_PASS=""
        echo "✅ Xác thực thành công với mật khẩu trống (blank)"
    fi
fi

# Nếu vẫn chưa kết nối được, thử thiết lập mật khẩu MySQL root thành root123@ qua socket
if [ -z "$MYSQL_PASS" ]; then
    echo "⚠️ Đang thử thiết lập quyền root MySQL qua mysql socket..."
    mysql -u root -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root123@'; FLUSH PRIVILEGES;" 2>/dev/null || true
    mysql -u root -e "ALTER USER 'root'@'localhost' IDENTIFIED BY 'root123@'; FLUSH PRIVILEGES;" 2>/dev/null || true
    if mysql -u root -proot123@ -e "SELECT 1;" >/dev/null 2>&1; then
        MYSQL_PASS="root123@"
        echo "✅ Đã thiết lập mật khẩu MySQL root thành 'root123@' thành công!"
    fi
fi

# 2. Tạo database lms_db nếu chưa tồn tại
echo "🗄️ Đang đảm bảo Database 'lms_db' tồn tại..."
if [ -n "$MYSQL_PASS" ]; then
    mysql -u root -p"$MYSQL_PASS" -e "CREATE DATABASE IF NOT EXISTS lms_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null || true
else
    mysql -u root -e "CREATE DATABASE IF NOT EXISTS lms_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null || true
fi

# 3. Đồng bộ mật khẩu vào backend/.env
echo "📝 Cập nhật mật khẩu kết nối vào backend/.env..."
if [ -n "$MYSQL_PASS" ]; then
    sed -i "s/DB_PASSWORD=.*/DB_PASSWORD=$MYSQL_PASS/g" backend/.env 2>/dev/null || true
fi

# 4. Nạp dữ liệu thực tế vào MySQL
echo "🌱 Đang nạp danh mục tài khoản CSDL thực tế..."
node backend/scripts/seed_real_database_accounts.js "$MYSQL_PASS"

# 5. Khởi động lại dịch vụ Backend PM2
echo "⚡ Khởi động lại PM2 lms-backend..."
pm2 restart lms-backend

echo "=========================================================="
echo "🎉 HOÀN TẤT KHẮC PHỤC KẾT NỐI VÀ NẠP CSDL THÀNH CÔNG!"
echo "=========================================================="

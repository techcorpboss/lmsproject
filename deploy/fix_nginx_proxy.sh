#!/bin/bash
# ==============================================================================
# Script tự động kiểm tra và khắc phục lỗi 404 Nginx /api/ trên VPS
# Domain: lms.techcorp.info.vn | Backend Port: 5009
# ==============================================================================

echo "=========================================================="
echo "🔍 1. KIỂM TRA TRẠNG THÁI BACKEND SERVICE (PORT 5009)..."
echo "=========================================================="

cd /www/wwwroot/lms.techcorp.info.vn || exit 1

# Kiểm tra pm2
pm2 status

# Kiểm tra port 5009
if command -v netstat >/dev/null 2>&1; then
    PORT_CHECK=$(netstat -tulpn | grep 5009)
elif command -v ss >/dev/null 2>&1; then
    PORT_CHECK=$(ss -tulpn | grep 5009)
fi

echo "Port 5009 listener: $PORT_CHECK"

# Thử gọi trực tiếp backend trên localhost:5009
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:5009/api/auth/system-accounts)
echo "Direct backend response status: $HTTP_CODE"

if [ "$HTTP_CODE" != "200" ] && [ "$HTTP_CODE" != "304" ]; then
    echo "⚠️ Backend chưa phản hồi đúng. Đang khởi động lại bằng PM2..."
    pm2 delete lms-backend >/dev/null 2>&1
    pm2 start backend/server.js --name lms-backend --update-env
    sleep 3
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:5009/api/auth/system-accounts)
    echo "Direct backend response after restart: $HTTP_CODE"
fi

echo ""
echo "=========================================================="
echo "🔧 2. KIỂM TRA & CẬP NHẬT CẤU HÌNH REVERSE PROXY NGINX..."
echo "=========================================================="

NGINX_CONF=""
POSSIBLE_CONFS=(
    "/www/server/panel/vhost/nginx/lms.techcorp.info.vn.conf"
    "/www/server/nginx/conf/vhost/lms.techcorp.info.vn.conf"
    "/etc/nginx/sites-available/lms.techcorp.info.vn"
    "/etc/nginx/conf.d/lms.techcorp.info.vn.conf"
)

for f in "${POSSIBLE_CONFS[@]}"; do
    if [ -f "$f" ]; then
        NGINX_CONF="$f"
        echo "✅ Tìm thấy tệp cấu hình Nginx: $NGINX_CONF"
        break
    fi
done

if [ -z "$NGINX_CONF" ]; then
    echo "❌ Không tìm thấy tệp cấu hình Nginx tự động. Vui lòng kiểm tra trên giao diện aaPanel."
    exit 1
fi

# Sao lưu cấu hình trước khi sửa
cp "$NGINX_CONF" "${NGINX_CONF}.bak.$(date +%s)"
echo "💾 Đã tạo file sao lưu: ${NGINX_CONF}.bak"

# Kiểm tra xem cấu hình đã có location /api chưa
if grep -q "location /api" "$NGINX_CONF" || grep -q "location \^~ /api" "$NGINX_CONF"; then
    echo "ℹ️ Cấu hình đã có khai báo location /api. Đang kiểm tra proxy_pass..."
    # Đảm bảo proxy_pass trỏ đúng vào port 5009
    sed -i 's|proxy_pass http://127.0.0.1:[0-9]*/api/|proxy_pass http://127.0.0.1:5009/api/|g' "$NGINX_CONF"
    sed -i 's|proxy_pass http://localhost:[0-9]*/api/|proxy_pass http://127.0.0.1:5009/api/|g' "$NGINX_CONF"
else
    echo "⚠️ Chưa có khai báo reverse proxy /api trong Nginx. Đang tự động bổ sung..."
    
    # Đoạn cấu hình reverse proxy chuẩn
    PROXY_SNIPPET='
    # [TechCorp LMS API & WebSocket Reverse Proxy]
    location /api {
        proxy_pass http://127.0.0.1:5009;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
    }

    location /socket.io {
        proxy_pass http://127.0.0.1:5009;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_read_timeout 86400s;
        proxy_send_timeout 86400s;
    }
'

    # Chèn vào trước block location / hoặc trước dấu } đóng server cuối cùng
    if grep -q "location / {" "$NGINX_CONF"; then
        python3 -c "
with open('$NGINX_CONF', 'r') as f:
    content = f.read()

snippet = '''$PROXY_SNIPPET'''
if 'location /api' not in content:
    idx = content.find('location / {')
    if idx != -1:
        new_content = content[:idx] + snippet + '\n    ' + content[idx:]
        with open('$NGINX_CONF', 'w') as f:
            f.write(new_content)
        print('Đã chèn khối reverse proxy vào trước location /')
    else:
        print('Không tìm thấy vị trí chèn')
"
    fi
fi

echo ""
echo "=========================================================="
echo "🔄 3. TEST CÚ PHÁP & TẢI LẠI NGINX..."
echo "=========================================================="

nginx -t
if [ $? -eq 0 ]; then
    nginx -s reload
    echo "✅ Nginx đã reload thành công!"
else
    echo "❌ Cú pháp Nginx có lỗi, khôi phục lại bản sao lưu..."
    cp "${NGINX_CONF}.bak" "$NGINX_CONF"
    exit 1
fi

echo ""
echo "=========================================================="
echo "🎯 4. KIỂM THỬ KẾT QUẢ REVERSE PROXY..."
echo "=========================================================="
TEST_STATUS=$(curl -k -s -o /dev/null -w "%{http_code}" https://lms.techcorp.info.vn/api/auth/system-accounts)
echo "HTTPS API Status: $TEST_STATUS"

if [ "$TEST_STATUS" = "200" ] || [ "$TEST_STATUS" = "304" ]; then
    echo "🎉 TUYỆT VỜI! Đường dẫn https://lms.techcorp.info.vn/api/ đã hoạt động bình thường (HTTP $TEST_STATUS)."
else
    echo "⚠️ Kiểm tra lại test qua localhost:"
    curl -I -s http://127.0.0.1:5009/api/auth/system-accounts | head -n 5
fi

echo "=========================================================="

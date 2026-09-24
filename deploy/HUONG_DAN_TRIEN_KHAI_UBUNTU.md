# HƯỚNG DẪN TRIỂN KHAI PHÂN HỆ E-LEARNING & KHẢO THÍ TRỰC TUYẾN
## Tên miền chính thức: `lms.techcorp.info.vn`
**Hệ điều hành máy chủ:** Ubuntu 20.04 / 22.04 / 24.04 LTS  
**Port Backend:** 5009  
**Cơ sở dữ liệu:** MySQL 8.0 (`lms_db`)  

---

## 1. YÊU CẦU TRƯỚC KHI CÀI ĐẶT
1. **Trỏ bản ghi DNS tên miền:**
   - Trỏ bản ghi **A** của tên miền:
     ```
     Host: lms.techcorp.info.vn
     Type: A
     Value: [Địa chỉ IP máy chủ Ubuntu của bạn]
     ```
2. **Cài đặt sẵn các gói phần mềm trên Ubuntu (nếu chưa có):**
   ```bash
   sudo apt update && sudo apt install -y nginx mysql-server certbot python3-certbot-nginx
   # Cài đặt Node.js 20 LTS & PM2
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt install -y nodejs
   sudo npm install -g pm2
   ```

---

## 2. PHƯƠNG ÁN 1: TRIỂN KHAI NHANH BẰNG 1 LỆNH (SCRIPT TỰ ĐỘNG)

Sau khi tải hoặc giải nén thư mục dự án lên máy chủ tại `/www/wwwroot/lms.techcorp.info.vn`:

```bash
cd /www/wwwroot/lms.techcorp.info.vn

# Cấp quyền thực thi và chạy script triển khai
chmod +x deploy/deploy_ubuntu.sh
sudo ./deploy/deploy_ubuntu.sh
```

---

## 3. PHƯƠNG ÁN 2: TRIỂN KHAI TỪNG BƯỚC (THỦ CÔNG)

### Bước 1: Khởi tạo Cơ sở dữ liệu độc lập `lms_db`
```bash
# Đăng nhập MySQL và tạo database
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS lms_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Nạp toàn bộ cấu trúc bảng và dữ liệu mẫu có sẵn
mysql -u root -p lms_db < /www/wwwroot/lms.techcorp.info.vn/database/lms_schema_and_seed.sql
```

### Bước 2: Thiết lập Backend NodeJS (Chạy Port 5009)
```bash
cd /www/wwwroot/lms.techcorp.info.vn/backend

# Cấu hình file môi trường
cp .env.production .env

# Cài đặt dependencies
npm install --production

# Khởi động dịch vụ qua PM2
pm2 start /www/wwwroot/lms.techcorp.info.vn/deploy/ecosystem.config.js
pm2 save
pm2 startup
```

### Bước 3: Đóng gói Frontend React
```bash
cd /www/wwwroot/lms.techcorp.info.vn/frontend

# Cài đặt thư viện và build bản production
npm install --legacy-peer-deps
npm run build
```

### Bước 4: Cấu hình Web Server Nginx & Kích hoạt WebSocket
```bash
# Sao chép cấu hình Nginx
sudo cp /www/wwwroot/lms.techcorp.info.vn/deploy/nginx_lms.techcorp.info.vn.conf /etc/nginx/sites-available/lms.techcorp.info.vn

# Tạo liên kết kích hoạt site
sudo ln -sf /etc/nginx/sites-available/lms.techcorp.info.vn /etc/nginx/sites-enabled/lms.techcorp.info.vn

# Kiểm tra cú pháp và tải lại Nginx
sudo nginx -t
sudo systemctl reload nginx
```

### Bước 5: Cấp chứng chỉ bảo mật SSL (HTTPS) miễn phí
```bash
sudo certbot --nginx -d lms.techcorp.info.vn
```
*(Chọn cấu hình tự động Redirect toàn bộ HTTP sang HTTPS)*

---

## 4. TÀI KHOẢN ĐĂNG NHẬP MẶC ĐỊNH
Hệ thống đã nạp sẵn 3 tài khoản mẫu với mật khẩu ban đầu là `root123@` (hoặc `Admin123@`):
1. **Quản trị viên (Admin):** `admin` / `admin@techcorp.info.vn`
2. **Giảng viên (Teacher):** `teacher` / `giangvien@techcorp.info.vn`
3. **Sinh viên (Student):** `student` / `sinhvien@techcorp.info.vn`

*Ngoài ra, hệ thống tự động hỗ trợ **Single Sign-On (SSO)**: Người dùng đăng nhập từ hệ thống đào tạo mẹ `qldt.techcorp.info.vn` khi bấm liên kết sẽ tự động đăng nhập vào LMS mà không cần gõ lại mật khẩu.*

---

## 5. KIỂM TRA & GIÁM SÁT HỆ THỐNG
* **Kiểm tra trạng thái Backend:** `pm2 status`
* **Xem nhật ký hoạt động (Logs):** `pm2 logs lms-backend`
* **Khởi động lại Backend:** `pm2 restart lms-backend`
* **Kiểm tra kết nối Health check:** `curl http://127.0.0.1:5009/`

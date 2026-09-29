param(
    [string]$VpsHost = "root@103.170.122.138",
    [string]$DeployPath = "/www/wwwroot/lms.techcorp.info.vn",
    [switch]$QuickGitPull = $true
)

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "🚀 TRIỂN KHAI CẬP NHẬT LÊN SERVER UBUNTU: $VpsHost" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Kiểm tra ssh
if (-not (Get-Command ssh -ErrorAction SilentlyContinue)) {
    Write-Host "⚠️ Không tìm thấy lệnh ssh. Vui lòng cài đặt OpenSSH Client cho Windows." -ForegroundColor Red
    exit 1
}

if ($QuickGitPull) {
    Write-Host "📥 Đang thực hiện Git Pull và Restart trên VPS qua SSH..." -ForegroundColor Yellow
    $RemoteCommands = @"
echo '==> 1. Đồng bộ mã nguồn mới nhất từ GitHub...'
cd $DeployPath
git pull origin main

echo '==> 2. Cài đặt thư viện Backend nếu có thay đổi...'
cd backend
npm install --production

echo '==> 3. Tái khởi động PM2 Backend...'
pm2 restart lms-backend || pm2 start $DeployPath/deploy/ecosystem.config.js
pm2 save

echo '==> 4. Biên dịch Frontend React...'
cd ../frontend
npm run build

echo '==> Hoàn tất cập nhật hệ thống!'
pm2 status lms-backend
"@
    ssh -o StrictHostKeyChecking=accept-new $VpsHost $RemoteCommands
} else {
    Write-Host "📦 Phương án upload gói build..." -ForegroundColor Yellow
    # Đóng gói và upload nếu cần
}

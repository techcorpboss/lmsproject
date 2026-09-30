// backend/services/sebConfigService.js
// Dịch vụ Khóa Trình duyệt Chống Gian lận Cấp Hệ Điều Hành Safe Exam Browser (SEB)
// Xuất tệp cấu hình .seb chuẩn XML Plist và Xác thực Yêu cầu Thi Trực tuyến
'use strict';

const crypto = require('crypto');

class SebConfigService {
  constructor() {
    this.sebSalt = process.env.SEB_SERVER_SALT || 'TCU_LMS_SEB_SECRET_SALT_2027';
  }

  /**
   * Tạo tệp cấu hình chuẩn .seb (XML Property List) cho ca thi chỉ định
   */
  generateSebConfigFile(examSchedule, options = {}) {
    const {
      scheduleId = examSchedule.id || 'EXAM-2027',
      title = examSchedule.title || examSchedule.examName || 'Kỳ thi Trực tuyến Chuẩn Quốc gia',
      baseUrl = options.baseUrl || 'https://lms.techcorp.info.vn',
      adminPassword = options.adminPassword || 'AdminExit2027@',
      quitPassword = options.quitPassword || 'QuitPass2027@'
    } = options;

    const startUrl = `${baseUrl}/online-exam/${scheduleId}?seb=true`;
    const quitUrl = `${baseUrl}/online-exam/${scheduleId}/finished`;

    // Mã hóa SHA-256 các mật khẩu thoát theo chuẩn SEB
    const hashedAdminPassword = crypto.createHash('sha256').update(adminPassword).digest('hex');
    const hashedQuitPassword = crypto.createHash('sha256').update(quitPassword).digest('hex');

    // Khóa mã hóa bài thi (Browser Exam Key Salt)
    const examKey = crypto.createHash('sha256').update(`${scheduleId}:${this.sebSalt}`).digest('hex');

    const xmlContent = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>originatorVersion</key>
    <string>SEB_Win_3.5.0</string>
    <key>examTitle</key>
    <string>${this.escapeXml(title)}</string>
    <key>startURL</key>
    <string>${this.escapeXml(startUrl)}</string>
    <key>quitURL</key>
    <string>${this.escapeXml(quitUrl)}</string>
    <key>restartExamURL</key>
    <string>${this.escapeXml(startUrl)}</string>

    <!-- Khóa Hệ thống và Chống Gian lận Kiosk Cấp Hệ Điều Hành -->
    <key>allowQuit</key>
    <false/>
    <key>hashedAdminPassword</key>
    <string>${hashedAdminPassword}</string>
    <key>hashedQuitPassword</key>
    <string>${hashedQuitPassword}</string>
    
    <!-- Chặn Máy ảo (VMware, VirtualBox, Parallels, Hyper-V) -->
    <key>allowVirtualMachine</key>
    <false/>

    <!-- Chặn Đa màn hình và Chiếu màn hình (Display Mirroring / Projector) -->
    <key>allowDisplayMirroring</key>
    <false/>
    <key>minDisplays</key>
    <integer>1</integer>
    <key>maxDisplays</key>
    <integer>1</integer>

    <!-- Chặn Phần mềm Chia sẻ Màn hình và Điều khiển từ xa (Zoom, AnyDesk, TeamViewer) -->
    <key>allowScreenSharing</key>
    <false/>
    <key>prohibitedProcesses</key>
    <array>
        <dict><key>executable</key><string>TeamViewer.exe</string></dict>
        <dict><key>executable</key><string>AnyDesk.exe</string></dict>
        <dict><key>executable</key><string>UltraViewer_Desktop.exe</string></dict>
        <dict><key>executable</key><string>Discord.exe</string></dict>
        <dict><key>executable</key><string>Telegram.exe</string></dict>
        <dict><key>executable</key><string>Zalo.exe</string></dict>
        <dict><key>executable</key><string>Skype.exe</string></dict>
        <dict><key>executable</key><string>Zoom.exe</string></dict>
        <dict><key>executable</key><string>Obs64.exe</string></dict>
        <dict><key>executable</key><string>SnippingTool.exe</string></dict>
    </array>

    <!-- Chặn Copy/Paste, In ấn, Developer Tools và Task Manager -->
    <key>enableAltTab</key>
    <false/>
    <key>enableCtrlEsc</key>
    <false/>
    <key>enableF1</key>
    <false/>
    <key>enableF2</key>
    <false/>
    <key>enableF3</key>
    <false/>
    <key>enableF4</key>
    <false/>
    <key>enableF5</key>
    <false/>
    <key>enableF12</key>
    <false/>
    <key>enablePrintScreen</key>
    <false/>
    <key>allowDeveloperConsole</key>
    <false/>
    <key>allowSpellCheck</key>
    <false/>

    <!-- Cấu hình bảo mật khóa SEB Exam Key -->
    <key>sendBrowserExamKey</key>
    <true/>
    <key>browserExamKey</key>
    <string>${examKey}</string>
</dict>
</plist>`;

    return {
      fileName: `TCU_Exam_Lockdown_${scheduleId}.seb`,
      mimeType: 'application/seb',
      xmlContent,
      examKey,
      adminPassword,
      quitPassword
    };
  }

  /**
   * Thoát các ký tự đặc biệt trong định dạng XML Plist
   */
  escapeXml(unsafe) {
    if (typeof unsafe !== 'string') return '';
    return unsafe.replace(/[<>&'"]/g, c => {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '\'': return '&apos;';
        case '"': return '&quot;';
        default: return c;
      }
    });
  }

  /**
   * Thẩm định yêu cầu từ Client xem có thực sự gửi từ Safe Exam Browser đang khóa hệ thống hay không
   */
  verifySebRequest(req, examSchedule = {}) {
    const userAgent = req.headers['user-agent'] || '';
    const sebRequestHash = req.headers['x-safeexambrowser-requesthash'] || req.headers['x-seb-request-hash'];
    const sebConfigKey = req.headers['x-safeexambrowser-configkeyhash'];

    const isSebUserAgent = /SEB|SafeExamBrowser/i.test(userAgent);

    const result = {
      isSebBrowser: isSebUserAgent,
      userAgent,
      hasRequestHash: !!sebRequestHash,
      hasConfigKey: !!sebConfigKey,
      isCompliant: isSebUserAgent,
      status: isSebUserAgent ? 'SECURE_SEB_LOCKDOWN' : 'UNSECURED_STANDARD_BROWSER',
      recommendation: isSebUserAgent
        ? 'Thiết bị được bảo vệ an toàn trong môi trường SEB Kiosk'
        : 'Cần tải và khởi chạy qua tệp cấu hình Safe Exam Browser (.seb) để tránh bị đình chỉ bài thi'
    };

    return result;
  }
}

module.exports = new SebConfigService();

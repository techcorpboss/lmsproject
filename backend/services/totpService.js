// backend/services/totpService.js
// Triển khai Xác thực Đa Yếu Tố 2FA/MFA theo chuẩn Quốc tế RFC 6238 (TOTP)
// Tương thích 100% với Google Authenticator, Microsoft Authenticator, Apple Keychain, Authy
'use strict';

const crypto = require('crypto');
const QRCode = require('qrcode');

// Bảng mã Base32 RFC 3548 / RFC 4648
const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

class TotpService {
  constructor() {
    this.stepSeconds = 30; // Chu kỳ làm mới 30 giây theo RFC 6238
    this.digits = 6;       // 6 chữ số
    this.issuer = 'TCU COMPASS LMS';
  }

  /**
   * Chuyển đổi Buffer sang chuỗi Base32
   */
  base32Encode(buffer) {
    let bits = 0;
    let value = 0;
    let output = '';

    for (let i = 0; i < buffer.length; i++) {
      value = (value << 8) | buffer[i];
      bits += 8;

      while (bits >= 5) {
        output += BASE32_ALPHABET[(value >>> (bits - 5)) & 31];
        bits -= 5;
      }
    }

    if (bits > 0) {
      output += BASE32_ALPHABET[(value << (5 - bits)) & 31];
    }

    return output;
  }

  /**
   * Chuyển đổi chuỗi Base32 thành Buffer
   */
  base32Decode(base32Str) {
    const cleaned = base32Str.toUpperCase().replace(/=+$/, '').replace(/\s+/g, '');
    let bits = 0;
    let value = 0;
    const output = [];

    for (let i = 0; i < cleaned.length; i++) {
      const idx = BASE32_ALPHABET.indexOf(cleaned[i]);
      if (idx === -1) continue; // Bỏ qua ký tự không hợp lệ

      value = (value << 5) | idx;
      bits += 5;

      if (bits >= 8) {
        output.push((value >>> (bits - 8)) & 255);
        bits -= 8;
      }
    }

    return Buffer.from(output);
  }

  /**
   * Tạo khóa bí mật ngẫu nhiên Base32 (20 bytes = 160-bit secret theo khuyến nghị RFC 6238)
   */
  generateSecret() {
    const randomBuffer = crypto.randomBytes(20);
    return this.base32Encode(randomBuffer);
  }

  /**
   * Tính toán mã OTP 6 chữ số tại một time counter nhất định
   */
  computeTokenAtCounter(secretBase32, counter) {
    const key = this.base32Decode(secretBase32);

    // Chuẩn bị bộ đệm thời gian 8-byte big-endian
    const timeBuffer = Buffer.alloc(8);
    let temp = counter;
    for (let i = 7; i >= 0; i--) {
      timeBuffer[i] = temp & 0xff;
      temp = Math.floor(temp / 256);
    }

    // HMAC-SHA1 theo chuẩn RFC 6238
    const hmac = crypto.createHmac('sha1', key);
    hmac.update(timeBuffer);
    const hash = hmac.digest();

    // Dynamic truncation
    const offset = hash[hash.length - 1] & 0x0f;
    const binary =
      ((hash[offset] & 0x7f) << 24) |
      ((hash[offset + 1] & 0xff) << 16) |
      ((hash[offset + 2] & 0xff) << 8) |
      (hash[offset + 3] & 0xff);

    const otp = binary % Math.pow(10, this.digits);
    return String(otp).padStart(this.digits, '0');
  }

  /**
   * Sinh mã OTP hiện tại cho một secret
   */
  generateToken(secretBase32, timestamp = Date.now()) {
    const counter = Math.floor(timestamp / 1000 / this.stepSeconds);
    return this.computeTokenAtCounter(secretBase32, counter);
  }

  /**
   * Xác thực mã OTP người dùng nhập vào
   * Hỗ trợ cửa sổ thời gian ± 1 bước (drift window: 30s trước và 30s sau) để chống trễ mạng
   * @param {string} token - Mã 6 số người dùng nhập
   * @param {string} secretBase32 - Khóa bí mật
   * @returns {boolean}
   */
  verifyToken(token, secretBase32, window = 1) {
    if (!token || !secretBase32) return false;
    const cleanToken = String(token).trim().replace(/\s+/g, '');
    if (cleanToken.length !== this.digits) return false;

    const currentCounter = Math.floor(Date.now() / 1000 / this.stepSeconds);

    for (let step = -window; step <= window; step++) {
      const expectedToken = this.computeTokenAtCounter(secretBase32, currentCounter + step);
      if (crypto.timingSafeEqual(Buffer.from(cleanToken), Buffer.from(expectedToken))) {
        return true;
      }
    }

    return false;
  }

  /**
   * Tạo chuỗi otpauth:// URI chuẩn cho ứng dụng xác thực
   */
  generateOtpAuthUri(username, secretBase32, issuer = this.issuer) {
    const encodedIssuer = encodeURIComponent(issuer);
    const encodedUser = encodeURIComponent(username);
    return `otpauth://totp/${encodedIssuer}:${encodedUser}?secret=${secretBase32}&issuer=${encodedIssuer}&algorithm=SHA1&digits=${this.digits}&period=${this.stepSeconds}`;
  }

  /**
   * Sinh mã QR Code dạng Data URL ảnh PNG hiển thị trên giao diện Web
   */
  async generateQrCodeDataUrl(otpAuthUri) {
    try {
      return await QRCode.toDataURL(otpAuthUri, {
        errorCorrectionLevel: 'M',
        type: 'image/png',
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff'
        },
        width: 256
      });
    } catch (err) {
      console.error('[TotpService] Lỗi sinh mã QR 2FA:', err.message);
      return null;
    }
  }

  /**
   * Sinh 8 mã phục hồi dự phòng (Backup Recovery Codes) dùng một lần
   * Định dạng XXXX-XXXX (ví dụ: A3F8-92B1)
   */
  generateBackupCodes(count = 8) {
    const codes = [];
    for (let i = 0; i < count; i++) {
      const part1 = crypto.randomBytes(2).toString('hex').toUpperCase();
      const part2 = crypto.randomBytes(2).toString('hex').toUpperCase();
      codes.push({
        code: `${part1}-${part2}`,
        used: false,
        created_at: new Date().toISOString(),
        used_at: null
      });
    }
    return codes;
  }

  /**
   * Kiểm tra và tiêu thụ một mã dự phòng
   */
  verifyAndConsumeBackupCode(inputCode, backupCodesList) {
    if (!inputCode || !Array.isArray(backupCodesList)) return { valid: false, updatedCodes: backupCodesList };
    
    const formattedInput = String(inputCode).trim().toUpperCase();
    const index = backupCodesList.findIndex(b => !b.used && b.code === formattedInput);

    if (index !== -1) {
      const updated = [...backupCodesList];
      updated[index] = {
        ...updated[index],
        used: true,
        used_at: new Date().toISOString()
      };
      return { valid: true, updatedCodes: updated };
    }

    return { valid: false, updatedCodes: backupCodesList };
  }
}

module.exports = new TotpService();

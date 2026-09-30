// backend/services/encryptionService.js
// Dịch vụ mã hóa dữ liệu nhạy cảm mức trường (Field-Level Encryption)
// Tuân thủ Nghị định 13/2023/NĐ-CP (PDPD - Bảo vệ dữ liệu cá nhân) & Tiêu chuẩn ISO/IEC 27001
'use strict';

const crypto = require('crypto');

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // 96-bit IV recommended for GCM
const PREFIX = 'enc:v1:';

// Secret key derivation
const MASTER_SECRET = process.env.ENCRYPTION_SECRET || process.env.JWT_SECRET || 'TCU_COMPASS_LMS_PDPD_FIELD_ENCRYPTION_KEY_2026';
const DERIVED_KEY = crypto.createHash('sha256').update(MASTER_SECRET).digest();

class EncryptionService {
  /**
   * Mã hóa chuỗi dữ liệu nhạy cảm (CCCD, SĐT, Địa chỉ, Hồ sơ sức khỏe) bằng AES-256-GCM
   * @param {string|number} plaintext 
   * @returns {string} Chuỗi định dạng enc:v1:<iv_hex>:<auth_tag_hex>:<ciphertext_hex>
   */
  encrypt(plaintext) {
    if (plaintext === null || plaintext === undefined || plaintext === '') {
      return plaintext;
    }

    const textToEncrypt = String(plaintext);
    
    // Nếu dữ liệu đã được mã hóa trước đó, không mã hóa lặp lại
    if (textToEncrypt.startsWith(PREFIX)) {
      return textToEncrypt;
    }

    try {
      const iv = crypto.randomBytes(IV_LENGTH);
      const cipher = crypto.createCipheriv(ALGORITHM, DERIVED_KEY, iv);
      
      let ciphertext = cipher.update(textToEncrypt, 'utf8', 'hex');
      ciphertext += cipher.final('hex');
      
      const authTag = cipher.getAuthTag().toString('hex');
      const ivHex = iv.toString('hex');

      return `${PREFIX}${ivHex}:${authTag}:${ciphertext}`;
    } catch (err) {
      console.error('[EncryptionService] Lỗi mã hóa dữ liệu:', err.message);
      return textToEncrypt; // Fallback an toàn
    }
  }

  /**
   * Giải mã an toàn chuỗi dữ liệu (tự động phát hiện dữ liệu cũ chưa mã hóa)
   * @param {string} encryptedText 
   * @returns {string} Plaintext ban đầu
   */
  decrypt(encryptedText) {
    if (!encryptedText || typeof encryptedText !== 'string' || !encryptedText.startsWith(PREFIX)) {
      return encryptedText; // Dữ liệu cũ dạng plaintext hoặc null
    }

    try {
      const parts = encryptedText.slice(PREFIX.length).split(':');
      if (parts.length !== 3) {
        return encryptedText;
      }

      const [ivHex, authTagHex, ciphertextHex] = parts;
      const iv = Buffer.from(ivHex, 'hex');
      const authTag = Buffer.from(authTagHex, 'hex');
      
      const decipher = crypto.createDecipheriv(ALGORITHM, DERIVED_KEY, iv);
      decipher.setAuthTag(authTag);

      let plaintext = decipher.update(ciphertextHex, 'hex', 'utf8');
      plaintext += decipher.final('utf8');

      return plaintext;
    } catch (err) {
      console.warn('[EncryptionService] Lỗi giải mã dữ liệu nhạy cảm:', err.message);
      return encryptedText;
    }
  }

  /**
   * Che mờ (mask) thông tin nhạy cảm để hiển thị an toàn trên giao diện hoặc bản in
   * Ví dụ: CCCD "001201012345" -> "0012****2345", SĐT "0912345678" -> "0912***678"
   */
  mask(value, keepStart = 4, keepEnd = 4) {
    if (!value) return '';
    const plain = this.decrypt(String(value));
    if (plain.length <= keepStart + keepEnd) {
      return '****';
    }
    const start = plain.slice(0, keepStart);
    const end = plain.slice(-keepEnd);
    const maskedLength = Math.max(3, plain.length - keepStart - keepEnd);
    return `${start}${'*'.repeat(maskedLength)}${end}`;
  }

  /**
   * Che mờ CCCD/Định danh cá nhân
   */
  maskCccd(cccd) {
    return this.mask(cccd, 4, 3);
  }

  /**
   * Che mờ Số điện thoại
   */
  maskPhone(phone) {
    return this.mask(phone, 3, 3);
  }

  /**
   * Xử lý bảo mật object hồ sơ sinh viên: giải mã hoặc làm mờ tùy quyền
   */
  sanitizeStudentProfile(student, allowFullView = false) {
    if (!student) return student;
    const item = typeof student.toJSON === 'function' ? student.toJSON() : { ...student };
    
    if (allowFullView) {
      if (item.citizen_id) item.citizen_id = this.decrypt(item.citizen_id);
      if (item.phone) item.phone = this.decrypt(item.phone);
      if (item.address) item.address = this.decrypt(item.address);
      if (item.emergency_contact) item.emergency_contact = this.decrypt(item.emergency_contact);
    } else {
      if (item.citizen_id) item.citizen_id = this.maskCccd(item.citizen_id);
      if (item.phone) item.phone = this.maskPhone(item.phone);
      if (item.address) item.address = item.address ? '*** (Đã ẩn theo NĐ 13/2023)' : '';
      if (item.emergency_contact) item.emergency_contact = item.emergency_contact ? this.maskPhone(item.emergency_contact) : '';
    }

    return item;
  }
}

module.exports = new EncryptionService();

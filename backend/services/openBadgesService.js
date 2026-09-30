// backend/services/openBadgesService.js
// Dịch vụ Phát hành & Thẩm tra Huy hiệu Số Quốc tế 1EdTech Open Badges v3.0
// Tuân thủ: W3C Verifiable Credentials & 1EdTech Digital Credentials Consortium
'use strict';

const crypto = require('crypto');

class OpenBadgesService {
  constructor() {
    this.issuerInfo = {
      id: 'https://lms.techcorp.info.vn/badges/issuer',
      type: 'Profile',
      name: 'Trường Đại học Công nghệ TechCorp (TechCorp University - TCU)',
      url: 'https://lms.techcorp.info.vn',
      email: 'academics@techcorp.edu.vn',
      description: 'Cơ sở giáo dục đại học đạt chuẩn kiểm định chất lượng MOET & AUN-QA 4.0'
    };

    // Danh mục huy hiệu học thuật chuẩn hóa
    this.badgeClasses = new Map([
      ['TCU-BADGE-EXCELLENCE', {
        id: 'https://lms.techcorp.info.vn/badges/classes/excellence',
        type: 'BadgeClass',
        code: 'TCU-BADGE-EXCELLENCE',
        name: 'Huy Hiệu Sinh Viên Xuất Sắc Toàn Diện (Academic Excellence)',
        description: 'Vinh danh người học đạt thành tích học tập xuất sắc toàn khóa với điểm trung bình tích lũy CPA đạt từ 3.60/4.00 trở lên theo chuẩn Thông tư 08/2021/TT-BGDĐT.',
        image: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=300&h=300&fit=crop',
        badgeColor: '#eab308', // Gold
        category: 'ACADEMIC_ACHIEVEMENT',
        criteria: {
          narrative: 'Người học phải hoàn thành tối thiểu 64 tín chỉ tích lũy và đạt xếp loại Xuất sắc (CPA >= 3.60).'
        },
        tags: ['Academic Excellence', 'CPA 3.6+', 'TCU Honours', 'MOET Standard']
      }],
      ['TCU-BADGE-VALEDICTORIAN', {
        id: 'https://lms.techcorp.info.vn/badges/classes/valedictorian',
        type: 'BadgeClass',
        code: 'TCU-BADGE-VALEDICTORIAN',
        name: 'Huy Hiệu Thủ Khoa Học Phần (Course Valedictorian)',
        description: 'Trao tặng cho người học đạt điểm tổng kết học phần A+ (9.0 - 10.0 trên thang 10, điểm 4.0 hệ 4), đứng đầu lớp học phần.',
        image: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=300&h=300&fit=crop',
        badgeColor: '#3b82f6', // Sapphire Blue
        category: 'COURSE_TOP',
        criteria: {
          narrative: 'Đạt điểm tổng kết học phần >= 9.0 (Thang chữ A+) và không vi phạm quy chế khảo thí.'
        },
        tags: ['Valedictorian', 'Grade A+', 'Top Performer']
      }],
      ['TCU-BADGE-AUN-QA', {
        id: 'https://lms.techcorp.info.vn/badges/classes/aun-qa',
        type: 'BadgeClass',
        code: 'TCU-BADGE-AUN-QA',
        name: 'Chứng Nhận Đạt Chuẩn Đầu Ra AUN-QA 4.0 & ABET',
        description: 'Chứng nhận năng lực đạt 100% các Chuẩn đầu ra học phần (CLO) ánh xạ trực tiếp lên Chuẩn đầu ra chương trình đào tạo (PLO) chuẩn quốc tế.',
        image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&h=300&fit=crop',
        badgeColor: '#10b981', // Emerald Green
        category: 'ACCREDITATION',
        criteria: {
          narrative: 'Hoàn thành toàn bộ ma trận đánh giá năng lực CLO-PLO đạt mức độ Master (M).'
        },
        tags: ['AUN-QA', 'ABET', 'CLO-PLO Alignment', 'Quality Assurance']
      }],
      ['TCU-BADGE-DIGITAL-LEAD', {
        id: 'https://lms.techcorp.info.vn/badges/classes/digital-lead',
        type: 'BadgeClass',
        code: 'TCU-BADGE-DIGITAL-LEAD',
        name: 'Huy Hiệu Tiên Phong Chuyển Đổi Số & Trí Tuệ Nhân Tạo (AI Pioneer)',
        description: 'Vinh danh người học thể hiện xuất sắc kỹ năng ứng dụng Trí tuệ Nhân tạo thế hệ mới và công nghệ số trong học tập nghiên cứu.',
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&h=300&fit=crop',
        badgeColor: '#8b5cf6', // Violet
        category: 'INNOVATION',
        criteria: {
          narrative: 'Tích cực tham gia các học phần E-Learning tương tác số và đạt điểm đánh giá kỹ năng số cao nhất.'
        },
        tags: ['AI Pioneer', 'EdTech', 'Digital Transformation', 'GenAI']
      }]
    ]);

    // Kho lưu trữ các Assertion đã cấp (In-Memory Map)
    this.assertions = new Map();

    // Khởi tạo một số Assertion mẫu ban đầu
    this.seedInitialAssertions();
  }

  seedInitialAssertions() {
    this.issueBadge('TCU-BADGE-EXCELLENCE', {
      studentId: 1,
      studentCode: '261IT001',
      studentName: 'Trần Văn Nam',
      email: 'nam.tv@techcorp.edu.vn'
    }, {
      courseName: 'Chương trình Đào tạo Cử nhân Kỹ thuật Phần mềm K66',
      scoreText: 'CPA 3.87/4.00 (Xếp loại Xuất sắc)',
      decisionNo: 'QĐ-888/QĐ-TCU'
    });

    this.issueBadge('TCU-BADGE-VALEDICTORIAN', {
      studentId: 1,
      studentCode: '261IT001',
      studentName: 'Trần Văn Nam',
      email: 'nam.tv@techcorp.edu.vn'
    }, {
      courseName: 'Nhập môn Lập trình C/C++ (IT101)',
      scoreText: 'Điểm tổng kết: 9.35/10 (Thang chữ A+)',
      decisionNo: 'QĐ-102/QĐ-TCU'
    });
  }

  /**
   * Lấy danh mục tất cả BadgeClass
   */
  getBadgeClasses() {
    return Array.from(this.badgeClasses.values());
  }

  /**
   * Cấp phát Huy hiệu số Open Badges v3.0 có ký số mật mã học thuật
   */
  issueBadge(badgeCode, student, evidenceData = {}) {
    const badgeClass = this.badgeClasses.get(badgeCode);
    if (!badgeClass) {
      throw new Error(`Không tìm thấy loại huy hiệu với mã: ${badgeCode}`);
    }

    const assertionId = `TCU-BADGE-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    const salt = 'TCU_SALT_' + crypto.randomBytes(8).toString('hex');
    const recipientIdentity = (student.email || student.studentCode || 'unknown').toLowerCase();
    const recipientHash = crypto.createHash('sha256').update(recipientIdentity + salt).digest('hex');

    const issuedOn = new Date().toISOString();

    // Tạo chữ ký số mật mã hóa cho Assertion
    const signaturePayload = `${assertionId}:${badgeCode}:${recipientHash}:${issuedOn}`;
    const signature = crypto.createHmac('sha256', 'TCU_OPEN_BADGES_SECRET_2027').update(signaturePayload).digest('hex');

    const assertion = {
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://purl.imsglobal.org/spec/ob/v3p0/context.json'
      ],
      id: `https://lms.techcorp.info.vn/badges/assertion/${assertionId}`,
      type: ['VerifiableCredential', 'OpenBadgeCredential'],
      assertionId,
      badgeCode,
      issuer: this.issuerInfo,
      issuanceDate: issuedOn,
      recipient: {
        type: 'email',
        hashed: true,
        salt,
        identity: `sha256$${recipientHash}`,
        plaintextName: student.studentName || 'Học viên',
        studentCode: student.studentCode || 'SV001',
        studentId: student.studentId
      },
      badge: {
        id: badgeClass.id,
        type: 'BadgeClass',
        name: badgeClass.name,
        description: badgeClass.description,
        image: badgeClass.image,
        badgeColor: badgeClass.badgeColor,
        criteria: badgeClass.criteria,
        tags: badgeClass.tags
      },
      evidence: [
        {
          id: `https://lms.techcorp.info.vn/badges/evidence/${assertionId}`,
          type: 'Evidence',
          narrative: evidenceData.scoreText || 'Hoàn thành xuất sắc chỉ tiêu học phần',
          courseName: evidenceData.courseName || 'Học phần LMS',
          decisionNo: evidenceData.decisionNo || 'QĐ-KH-2027',
          verifiedBy: 'Hội đồng Khoa học & Đảm bảo Chất lượng Đào tạo TCU'
        }
      ],
      proof: {
        type: 'JsonWebSignature2020',
        created: issuedOn,
        proofPurpose: 'assertionMethod',
        verificationMethod: 'https://lms.techcorp.info.vn/badges/keys/public-key.pem',
        jws: `eyJhbGciOiJIUzI1NiJ9.${Buffer.from(signaturePayload).toString('base64url')}.${signature}`
      },
      verificationUrl: `https://lms.techcorp.info.vn/badges/verify/${assertionId}`
    };

    this.assertions.set(assertionId, assertion);
    return assertion;
  }

  /**
   * Truy xuất Assertion theo mã ID
   */
  getAssertion(assertionId) {
    return this.assertions.get(assertionId) || null;
  }

  /**
   * Lấy danh sách huy hiệu của một học viên cụ thể
   */
  getBadgesByStudent(studentId, studentCode) {
    const results = [];
    for (const assertion of this.assertions.values()) {
      if (
        (studentId && assertion.recipient?.studentId === studentId) ||
        (studentCode && assertion.recipient?.studentCode === studentCode)
      ) {
        results.push(assertion);
      }
    }
    return results;
  }

  /**
   * Cổng thẩm tra tính xác thực của huy hiệu số (Public QR Code Verify)
   */
  verifyBadge(assertionId) {
    const assertion = this.assertions.get(assertionId);
    if (!assertion) {
      return {
        isValid: false,
        status: 'REVOKED_OR_NOT_FOUND',
        message: 'Huy hiệu không tồn tại hoặc đã bị thu hồi khỏi hệ thống'
      };
    }

    // Tái thẩm tra chữ ký mật mã
    const [header, payloadB64, signature] = assertion.proof?.jws?.split('.') || [];
    const payload = Buffer.from(payloadB64 || '', 'base64url').toString('utf8');
    const expectedSig = crypto.createHmac('sha256', 'TCU_OPEN_BADGES_SECRET_2027').update(payload).digest('hex');

    const isSigMatch = (signature === expectedSig);

    return {
      isValid: isSigMatch,
      status: isSigMatch ? 'VERIFIED_OFFICIAL' : 'SIGNATURE_INVALID',
      message: isSigMatch
        ? 'Huy hiệu số đạt chuẩn Open Badges v3.0, được bảo chứng mật mã bởi Trường Đại học TechCorp (TCU)'
        : 'Cảnh báo: Chữ ký số học thuật không khớp, huy hiệu có dấu hiệu làm giả mạo',
      assertionId,
      badgeName: assertion.badge?.name,
      recipientName: assertion.recipient?.plaintextName,
      studentCode: assertion.recipient?.studentCode,
      issuedOn: assertion.issuanceDate,
      issuerName: assertion.issuer?.name,
      evidence: assertion.evidence?.[0]?.narrative,
      tags: assertion.badge?.tags
    };
  }
}

module.exports = new OpenBadgesService();

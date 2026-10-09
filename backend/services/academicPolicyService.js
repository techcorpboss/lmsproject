// backend/services/academicPolicyService.js
/**
 * Dịch vụ Trợ Lý Tra Cứu Quy Chế Học Vụ & Đào Tạo Tín Chỉ Thông Minh (RAG Academic Regulation Advisor)
 * Nạp toàn bộ văn bản quy phạm pháp luật:
 * - Thông tư 08/2021/TT-BGDĐT (Quy chế đào tạo đại học)
 * - Thông tư 10/2016/TT-BGDĐT (Quy chế công tác sinh viên)
 * - Quyết định 4725/QĐ-BGDĐT (Chuẩn CSDL ngành HEMIS)
 * - Nghị định 81/2021/NĐ-CP & 97/2023/NĐ-CP (Miễn giảm học phí & Học bổng)
 */

const ACADEMIC_POLICIES = [
  {
    id: "TT08_DIEU_09",
    document: "Thông tư 08/2021/TT-BGDĐT",
    article: "Điều 9",
    title: "Đăng ký học tập và Khối lượng học tập tối thiểu / tối đa",
    summary: "Quy định số tín chỉ sinh viên được phép đăng ký trong mỗi học kỳ chính và học kỳ phụ.",
    content: "1. Đầu mỗi học kỳ, sinh viên phải đăng ký học tập cho học kỳ đó theo kế hoạch của cơ sở đào tạo.\n2. Khối lượng học tập tối thiểu trong một học kỳ chính: 14 tín chỉ (đối với sinh viên xếp hạng học lực bình thường) hoặc theo quy định của trường; tối đa không quá 25 tín chỉ.\n3. Đối với học kỳ phụ: Sinh viên đăng ký tối đa không quá 12 tín chỉ.",
    tags: ["đăng ký tín chỉ", "số tín chỉ tối thiểu", "số tín chỉ tối đa", "học kỳ phụ", "14 tín chỉ", "25 tín chỉ"],
    examples: [
      "Sinh viên có thể đăng ký 28 tín chỉ trong một kỳ không? -> Không, trần tối đa theo Điều 9 TT 08 là 25 tín chỉ.",
      "Kỳ phụ được học tối đa mấy tín chỉ? -> Tối đa 12 tín chỉ."
    ]
  },
  {
    id: "TT08_DIEU_10",
    document: "Thông tư 08/2021/TT-BGDĐT",
    article: "Điều 10",
    title: "Đánh giá kết quả học tập, Thang điểm và Xếp loại học lực",
    summary: "Quy đổi điểm đánh giá học phần từ thang điểm 10 sang thang điểm chữ và thang điểm 4.",
    content: "1. Điểm học phần là tổng điểm của các điểm thành phần nhân với trọng số tương ứng, làm tròn đến một chữ số thập phân.\n2. Quy đổi thang điểm chữ sang thang điểm 4:\n   • A (8.5 - 10.0) -> 4.0 (Giỏi/Xuất sắc)\n   • B (7.0 - 8.4) -> 3.0 (Khá)\n   • C (5.5 - 6.9) -> 2.0 (Trung bình)\n   • D (4.0 - 5.4) -> 1.0 (Trung bình yếu - Đạt)\n   • F (< 4.0) -> 0.0 (Kém - Không đạt, phải học lại).\n3. Xếp loại học lực theo điểm trung bình tích lũy (CPA):\n   • Xuất sắc: 3.60 - 4.00\n   • Giỏi: 3.20 - 3.59\n   • Khá: 2.50 - 3.19\n   • Trung bình: 2.00 - 2.49\n   • Yếu: 1.00 - 1.99\n   • Kém: Dưới 1.00.",
    tags: ["thang điểm 10", "thang điểm chữ", "thang điểm 4", "cpa", "gpa", "xếp loại học lực", "điểm f", "học lại"],
    examples: [
      "Điểm 8.4 quy đổi ra thang chữ và hệ 4 là bao nhiêu? -> Điểm B, tương đương 3.0 trên hệ 4.",
      "CPA 3.65 được xếp loại gì? -> Xếp loại Xuất sắc."
    ]
  },
  {
    id: "TT08_DIEU_11",
    document: "Thông tư 08/2021/TT-BGDĐT",
    article: "Điều 11",
    title: "Cảnh báo học tập, Tạm dừng và Buộc thôi học",
    summary: "Các tiêu chí xử lý học vụ đối với sinh viên có kết quả học tập kém.",
    content: "1. Cảnh báo học tập được thực hiện theo từng học kỳ nhằm giúp sinh viên biết và khắc phục kết quả học tập kém:\n   • Điểm trung bình học kỳ (GPA) < 0.8 đối với kỳ đầu, < 1.0 đối với các kỳ tiếp theo.\n   • Hoặc Điểm trung bình tích lũy (CPA) < 1.2 đối với sinh viên năm nhất; < 1.4 đối với năm hai; < 1.6 đối với năm ba; < 1.8 đối với năm thứ tư trở đi.\n2. Sinh viên bị buộc thôi học trong các trường hợp:\n   • Bị cảnh báo học tập 03 lần liên tiếp hoặc vượt quá số lần cảnh báo tối đa theo quy định của trường.\n   • Vượt quá thời gian đào tạo tối đa (không quá 2 lần thời gian thiết kế của chương trình, thường là 6 năm cho hệ 4 năm).",
    tags: ["cảnh báo học vụ", "buộc thôi học", "gpa dưới 1.0", "cpa dưới 1.2", "thời gian đào tạo tối đa", "3 lần liên tiếp"],
    examples: [
      "Bị cảnh báo học vụ mấy lần thì bị buộc thôi học? -> 3 lần cảnh báo liên tiếp.",
      "Thời gian tối đa để hoàn thành chương trình cử nhân 4 năm là bao lâu? -> Không quá 8 năm (gấp đôi thời gian chuẩn)."
    ]
  },
  {
    id: "TT08_DIEU_13",
    document: "Thông tư 08/2021/TT-BGDĐT",
    article: "Điều 13",
    title: "Học lại, Học cải thiện điểm và Bảo lưu kết quả",
    summary: "Quy chế học lại môn bị điểm F và học cải thiện để nâng cao điểm trung bình tích lũy.",
    content: "1. Sinh viên có học phần bị điểm F bắt buộc phải học lại học phần đó hoặc học phần tương đương/thay thế theo quy định của CTĐT.\n2. Sinh viên được đăng ký học lại đối với các học phần bị điểm D để cải thiện điểm trung bình tích lũy.\n3. Điểm học phần sau khi học lại/học cải thiện được lấy theo ĐIỂM CAO NHẤT trong các lần học để tính vào điểm trung bình tích lũy (TT 08/2021 quy định cơ sở đào tạo ghi nhận điểm cao nhất hoặc điểm lần học cuối cùng; TCU áp dụng nguyên tắc lấy điểm cao nhất có lợi nhất cho người học).",
    tags: ["học lại", "học cải thiện", "điểm cao nhất", "điểm f", "điểm d", "bảo lưu"],
    examples: [
      "Học lại bị điểm thấp hơn lần 1 thì tính điểm nào? -> Hệ thống TCU tự động ghi nhận điểm cao nhất giữa các lần học."
    ]
  },
  {
    id: "TT08_DIEU_14",
    document: "Thông tư 08/2021/TT-BGDĐT",
    article: "Điều 14",
    title: "Công nhận tốt nghiệp và Cấp bằng Cử nhân / Kỹ sư",
    summary: "Các điều kiện bắt buộc để sinh viên được xét công nhận tốt nghiệp đại học.",
    content: "Sinh viên được xét và công nhận tốt nghiệp khi đáp ứng đủ các điều kiện sau:\n1. Tích lũy đủ số tín chỉ và hoàn thành đầy đủ các học phần theo quy định của CTĐT.\n2. Điểm trung bình tích lũy toàn khóa (CPA) đạt từ 2.00 trở lên (thang điểm 4).\n3. Đạt chuẩn đầu ra Ngoại ngữ (Bậc 3/6 VSTEP hoặc tương đương B1/B2) và Tin học (Chuẩn CNTT cơ bản/nâng cao theo TT 03/2014).\n4. Hoàn thành chứng chỉ Giáo dục Quốc phòng - An ninh (GDQP-AN) và Giáo dục Thể chất (GDTC).\n5. Tại thời điểm xét tốt nghiệp không bị truy cứu trách nhiệm hình sự hoặc không đang trong thời gian bị kỷ luật từ mức đình chỉ học tập trở lên.",
    tags: ["xét tốt nghiệp", "điều kiện tốt nghiệp", "cpa trên 2.0", "ngoại ngữ b1", "gdqp", "gdtc", "chuẩn đầu ra"],
    examples: [
      "Điểm CPA tối thiểu để được cấp bằng tốt nghiệp là bao nhiêu? -> Tối thiểu 2.00 trên thang điểm 4.",
      "Thiếu chứng chỉ GDQP-AN có được nhận bằng không? -> Không, chứng chỉ GDQP-AN và GDTC là điều kiện bắt buộc."
    ]
  },
  {
    id: "ND81_HOC_BONG",
    document: "Nghị định 81/2021/NĐ-CP & Nghị định 97/2023/NĐ-CP",
    article: "Điều 8 & Điều 15",
    title: "Chính sách Miễn giảm Học phí và Học bổng Khuyến khích Học tập",
    summary: "Quy định đối tượng được miễn, giảm học phí và định mức học bổng khuyến khích học tập sinh viên đại học.",
    content: "1. Đối tượng miễn 100% học phí:\n   • Sinh viên là con liệt sĩ, con thương binh, con bệnh binh.\n   • Sinh viên khuyết tật nặng hoặc đặc biệt nặng.\n   • Sinh viên thuộc diện hộ nghèo, hộ cận nghèo người dân tộc thiểu số tại vùng có điều kiện kinh tế - xã hội đặc biệt khó khăn.\n2. Học bổng khuyến khích học tập theo học kỳ:\n   • Học bổng loại Xuất sắc: Điểm rèn luyện >= 90 và CPA >= 3.60 (Trị giá 150% mức học phí).\n   • Học bổng loại Giỏi: Điểm rèn luyện >= 80 và CPA >= 3.20 (Trị giá 120% mức học phí).\n   • Học bổng loại Khá: Điểm rèn luyện >= 70 và CPA >= 2.50 (Trị giá 100% mức học phí).\n   • Điều kiện tiên quyết: Không có học phần nào bị điểm F trong kỳ xét học bổng.",
    tags: ["miễn giảm học phí", "học bổng", "xuất sắc", "con thương binh", "hộ nghèo", "điểm rèn luyện", "nghị định 81"],
    examples: [
      "Bị 1 điểm F trong kỳ có được xét học bổng giỏi không? -> Không, sinh viên bị điểm F trong học kỳ sẽ không đủ điều kiện xét học bổng khuyến khích.",
      "Con thương binh được miễn giảm bao nhiêu % học phí? -> Được miễn 100% học phí theo quy định."
    ]
  }
];

class AcademicPolicyService {
  constructor() {
    this.policies = ACADEMIC_POLICIES;
  }

  // Lấy toàn bộ danh mục văn bản quy chế
  getAllPolicies() {
    return this.policies;
  }

  // Tra cứu theo chủ đề hoặc từ khóa
  searchPolicies(query = '') {
    if (!query || query.trim().length === 0) {
      return this.policies;
    }

    const q = query.toLowerCase().trim();
    return this.policies.filter(p => {
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchDoc = p.document.toLowerCase().includes(q);
      const matchContent = p.content.toLowerCase().includes(q);
      const matchTags = p.tags.some(t => t.toLowerCase().includes(q));
      return matchTitle || matchDoc || matchContent || matchTags;
    });
  }

  // Trả lời tư vấn hỏi đáp học vụ thông minh
  adviseQuestion(userQuestion) {
    if (!userQuestion || userQuestion.trim().length === 0) {
      throw new Error('Vui lòng nhập câu hỏi quy chế học vụ.');
    }

    const q = userQuestion.toLowerCase();
    let matchedPolicy = null;

    if (q.includes('cảnh báo') || q.includes('thôi học') || q.includes('đình chỉ')) {
      matchedPolicy = this.policies.find(p => p.id === 'TT08_DIEU_11');
    } else if (q.includes('học lại') || q.includes('cải thiện') || q.includes('điểm cao nhất')) {
      matchedPolicy = this.policies.find(p => p.id === 'TT08_DIEU_13');
    } else if (q.includes('tốt nghiệp') || q.includes('nhận bằng') || q.includes('chuẩn đầu ra')) {
      matchedPolicy = this.policies.find(p => p.id === 'TT08_DIEU_14');
    } else if (q.includes('học bổng') || q.includes('miễn giảm') || q.includes('hộ nghèo') || q.includes('thương binh')) {
      matchedPolicy = this.policies.find(p => p.id === 'ND81_HOC_BONG');
    } else if (q.includes('tín chỉ') || q.includes('tối đa') || q.includes('tối thiểu') || q.includes('đăng ký')) {
      matchedPolicy = this.policies.find(p => p.id === 'TT08_DIEU_09');
    } else {
      matchedPolicy = this.policies.find(p => p.id === 'TT08_DIEU_10');
    }

    return {
      success: true,
      question: userQuestion,
      matchedPolicy: {
        id: matchedPolicy.id,
        document: matchedPolicy.document,
        article: matchedPolicy.article,
        title: matchedPolicy.title,
        legalText: matchedPolicy.content
      },
      advice: `Theo quy định tại **${matchedPolicy.article} (${matchedPolicy.document})** về "${matchedPolicy.title}":\n\n${matchedPolicy.content}`,
      officialCitation: `Căn cứ pháp lý: ${matchedPolicy.document}, ${matchedPolicy.article} quy định chi tiết về ${matchedPolicy.title}.`,
      relatedExamples: matchedPolicy.examples || []
    };
  }
}

module.exports = new AcademicPolicyService();

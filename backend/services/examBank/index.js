// backend/services/examBank/index.js
// Quản trị toàn diện Ngân hàng Đề thi 8 môn học x 15 đề (3 đề gốc + 12 đề hoán vị) = 120 đề thi chuẩn hóa 40 câu
'use strict';

const it101 = require('./it101.bank');
const it201 = require('./it201.bank');
const it301 = require('./it301.bank');
const ba101 = require('./ba101.bank');
const ba102 = require('./ba102.bank');
const eng101 = require('./eng101.bank');
const ee101 = require('./ee101.bank');
const tou101 = require('./tou101.bank');

const COURSE_BANKS = [it101, it201, it301, ba101, ba102, eng101, ee101, tou101];

// Seeded PRNG for deterministic, reproducible shuffling
function createSeededRandom(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return function() {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function seededShuffle(array, rng) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Compute deterministic integer seed from string
function stringToSeed(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) + 1;
}

// Generate the 15 papers for a course
function buildCoursePapers(bank, startPaperId = 1) {
  const course = bank.course;
  const papers = [];
  let paperIdCounter = startPaperId;

  const rootGroups = [
    { num: 1, code: `${course.code}-GOC-01`, name: `Đề Thi Kết Thúc Môn: ${course.name} (Đề Gốc 01)`, questions: bank.root_1, variantCodes: ['101', '102', '103', '104'] },
    { num: 2, code: `${course.code}-GOC-02`, name: `Đề Thi Kết Thúc Môn: ${course.name} (Đề Gốc 02)`, questions: bank.root_2, variantCodes: ['201', '202', '203', '204'] },
    { num: 3, code: `${course.code}-GOC-03`, name: `Đề Thi Kết Thúc Môn: ${course.name} (Đề Gốc 03)`, questions: bank.root_3, variantCodes: ['301', '302', '303', '304'] }
  ];

  for (const rg of rootGroups) {
    // 1. Root Paper (Đề Gốc)
    const rootPaperId = paperIdCounter++;
    const formattedRootQuestions = rg.questions.map((q, qIdx) => ({
      ...q,
      question_index: qIdx + 1,
      sort_order: qIdx + 1,
      mark_allocated: 0.25,
      correct_letter: (q.answers.find(a => a.is_correct) || {}).letter || 'A'
    }));

    const rootPaper = {
      id: rootPaperId,
      paper_code: rg.code,
      name: rg.name,
      course_code: course.code,
      course_name: course.name,
      faculty_name: course.faculty,
      paper_type: 'ROOT',
      root_code: rg.code,
      variant_number: null,
      total_marks: 10.0,
      duration_minutes: 60,
      questions_count: formattedRootQuestions.length,
      status: 'APPROVED',
      proctor_status: 'SEALED',
      created_at: new Date(Date.now() - 3600000 * 24 * 7).toISOString(),
      questions: formattedRootQuestions
    };
    papers.push(rootPaper);

    // 2. Shuffled Variant Papers (Đề Hoán Vị: 4 đề cho mỗi đề gốc)
    for (const vCode of rg.variantCodes) {
      const variantPaperId = paperIdCounter++;
      const vPaperCode = `${course.code}-HV-${vCode}`;
      const rng = createSeededRandom(stringToSeed(vPaperCode));

      // Xáo trộn thứ tự 40 câu hỏi
      const shuffledQPool = seededShuffle(rg.questions, rng);

      // Xáo trộn phương án đáp án A/B/C/D cho từng câu hỏi
      const letters = ['A', 'B', 'C', 'D'];
      const formattedVariantQuestions = shuffledQPool.map((origQ, qIdx) => {
        const shuffledAnswers = seededShuffle(origQ.answers, rng);
        let correctLetter = 'A';

        const finalAnswers = shuffledAnswers.map((ans, aIdx) => {
          const lettr = letters[aIdx];
          if (ans.is_correct) correctLetter = lettr;
          return {
            id: `${origQ.id}_V${vCode}_A${aIdx + 1}`,
            letter: lettr,
            content: ans.content,
            is_correct: ans.is_correct,
            fraction: ans.fraction
          };
        });

        return {
          id: origQ.id,
          course_code: course.code,
          question_index: qIdx + 1,
          sort_order: qIdx + 1,
          content: origQ.content,
          difficulty: origQ.difficulty,
          default_mark: 0.25,
          mark_allocated: 0.25,
          clo: origQ.clo,
          correct_letter: correctLetter,
          answers: finalAnswers
        };
      });

      const variantPaper = {
        id: variantPaperId,
        paper_code: vPaperCode,
        name: `Đề Thi Hoán Vị — ${course.name} (Mã Đề ${vCode})`,
        course_code: course.code,
        course_name: course.name,
        faculty_name: course.faculty,
        paper_type: 'VARIANT',
        root_code: rg.code,
        variant_number: vCode,
        total_marks: 10.0,
        duration_minutes: 60,
        questions_count: formattedVariantQuestions.length,
        status: 'APPROVED',
        proctor_status: 'SEALED',
        created_at: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
        questions: formattedVariantQuestions
      };
      papers.push(variantPaper);
    }
  }

  return { papers, nextPaperId: paperIdCounter };
}

// Build the global inventory of 120 papers across all 8 courses
const ALL_PAPERS = [];
const PAPERS_BY_ID = new Map();
const PAPERS_BY_CODE = new Map();
const ALL_QUESTIONS_MAP = new Map();

let currentId = 1;
for (const bank of COURSE_BANKS) {
  // Store all raw questions
  const questions = bank.getAllQuestions();
  questions.forEach(q => ALL_QUESTIONS_MAP.set(q.id, q));

  // Build the 15 papers
  const result = buildCoursePapers(bank, currentId);
  for (const paper of result.papers) {
    ALL_PAPERS.push(paper);
    PAPERS_BY_ID.set(paper.id, paper);
    PAPERS_BY_CODE.set(paper.paper_code, paper);
  }
  currentId = result.nextPaperId;
}

// Generate the 40-question comparison matrix for a specific course & root paper
function getAnswerMatrix(courseCode, rootCode) {
  const rootPaper = PAPERS_BY_CODE.get(rootCode);
  if (!rootPaper) {
    // Fallback: pick first root paper of the course
    const firstRoot = ALL_PAPERS.find(p => p.course_code === courseCode && p.paper_type === 'ROOT');
    if (!firstRoot) return null;
    return getAnswerMatrix(courseCode, firstRoot.paper_code);
  }

  // Find the variants derived from this root
  const variants = ALL_PAPERS.filter(p => p.course_code === courseCode && p.paper_type === 'VARIANT' && p.root_code === rootPaper.paper_code);
  const variantCodes = variants.map(v => v.variant_number || v.paper_code.slice(-3));

  // Build 40 rows (1 row per question number)
  const matrixRows = [];
  for (let qNum = 1; qNum <= 40; qNum++) {
    const row = {
      question_number: qNum,
      root_key: rootPaper.questions[qNum - 1]?.correct_letter || '-'
    };
    for (const v of variants) {
      const vQ = v.questions[qNum - 1];
      const vCode = v.variant_number || v.paper_code.slice(-3);
      row[`code_${vCode}`] = vQ ? vQ.correct_letter : '-';
    }
    matrixRows.push(row);
  }

  return {
    course_code: courseCode,
    course_name: rootPaper.course_name,
    root_code: rootPaper.paper_code,
    root_name: rootPaper.name,
    variant_count: variants.length,
    variant_codes: variantCodes,
    matrix: matrixRows
  };
}

// Filter papers
function getPapers(filter = {}) {
  let list = [...ALL_PAPERS];

  if (filter.course_code && filter.course_code !== 'ALL') {
    list = list.filter(p => p.course_code === filter.course_code);
  }

  if (filter.paper_type && filter.paper_type !== 'ALL') {
    list = list.filter(p => p.paper_type === filter.paper_type);
  }

  if (filter.search && filter.search.trim()) {
    const s = filter.search.trim().toLowerCase();
    list = list.filter(p =>
      p.paper_code.toLowerCase().includes(s) ||
      p.name.toLowerCase().includes(s) ||
      p.course_code.toLowerCase().includes(s) ||
      p.course_name.toLowerCase().includes(s)
    );
  }

  return list;
}

function getPaperById(idOrCode) {
  if (typeof idOrCode === 'number' || !isNaN(Number(idOrCode))) {
    const p = PAPERS_BY_ID.get(Number(idOrCode));
    if (p) return p;
  }
  return PAPERS_BY_CODE.get(String(idOrCode)) || null;
}

module.exports = {
  COURSE_BANKS,
  ALL_PAPERS,
  PAPERS_BY_ID,
  PAPERS_BY_CODE,
  ALL_QUESTIONS_MAP,
  getPapers,
  getPaperById,
  getAnswerMatrix
};

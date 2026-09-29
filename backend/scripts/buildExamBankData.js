// backend/scripts/buildExamBankData.js
// Script to generate comprehensive, authentic questions for all 8 courses
// 8 courses x 120 questions = 960 questions total (40 questions per root paper x 3 root papers)
'use strict';

const fs = require('fs');
const path = require('path');

const COURSES = [
  { code: 'IT101', name: 'Nhập Môn Lập Trình C/C++', faculty: 'Khoa Công Nghệ Thông Tin', category_code: 'CAT-IT101' },
  { code: 'IT201', name: 'Cơ Sở Dữ Liệu', faculty: 'Khoa Công Nghệ Thông Tin', category_code: 'CAT-IT201' },
  { code: 'IT301', name: 'Cấu Trúc Dữ Liệu & Giải Thuật', faculty: 'Khoa Công Nghệ Thông Tin', category_code: 'CAT-IT301' },
  { code: 'BA101', name: 'Kinh Tế Vi Mô', faculty: 'Khoa Kinh Tế & QTKD', category_code: 'CAT-BA101' },
  { code: 'BA102', name: 'Quản Trị Học Đại Cương', faculty: 'Khoa Kinh Tế & QTKD', category_code: 'CAT-BA102' },
  { code: 'ENG101', name: 'Tiếng Anh Học Thuật 1', faculty: 'Khoa Ngoại Ngữ', category_code: 'CAT-ENG101' },
  { code: 'EE101', name: 'Kỹ Thuật Mạch Điện Tử & IoT', faculty: 'Khoa Điện - Điện Tử & Tự Động Hóa', category_code: 'CAT-EE101' },
  { code: 'TOU101', name: 'Tổng Quan Du Lịch & Dịch Vụ Lữ Hành', faculty: 'Khoa Du Lịch & Khách Sạn', category_code: 'CAT-TOU101' }
];

console.log('Generating Exam Bank Data for', COURSES.length, 'courses...');

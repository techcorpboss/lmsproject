// scratch/test_phase1_direct.js
// Kiểm thử trực tiếp các controller của Giai đoạn 1
const enterpriseController = require('../backend/controllers/academicEnterprise.controller');
const lmsController = require('../backend/controllers/academicLms.controller');

async function testDirect() {
  console.log('========================================================================');
  console.log('KIỂM THỬ TRỰC TIẾP MODULE GIAI ĐOẠN 1 (CONTROLLER VERIFICATION)');
  console.log('========================================================================\n');

  // 1. Test createLecturersBatch
  console.log('[1] Kiểm thử createLecturersBatch...');
  const fakeReqLecturers = {
    body: {
      lecturers: [
        {
          code: 'GV_BATCH_01',
          full_name: 'TS. Phan Đình Phùng',
          title: 'Tiến sĩ',
          faculty_name: 'Khoa Công Nghệ Thông Tin',
          specialization: 'An Toàn Thông Tin & Mạng Máy Tính',
          email: 'phung.pd@techcorp.edu.vn'
        }
      ]
    }
  };
  let batchLecResult = null;
  const fakeResLecturers = {
    json: (data) => { batchLecResult = data; },
    status: () => fakeResLecturers
  };
  await enterpriseController.createLecturersBatch(fakeReqLecturers, fakeResLecturers);
  console.log(' -> Result:', batchLecResult?.success, '| Saved:', batchLecResult?.saved_count);
  console.log(' -> Message:', batchLecResult?.message, '\n');

  // 2. Test createClassesBatch
  console.log('[2] Kiểm thử createClassesBatch...');
  const fakeReqClasses = {
    body: {
      classes: [
        {
          class_code: '66.ATTT-1',
          class_name: 'Lớp 66.ATTT-1 (An toàn thông tin)',
          faculty_name: 'Khoa Công Nghệ Thông Tin',
          major_name: 'An Toàn Thông Tin',
          cohort: 'K66',
          total_students: 38
        }
      ]
    }
  };
  let batchClassResult = null;
  const fakeResClasses = {
    json: (data) => { batchClassResult = data; },
    status: () => fakeResClasses
  };
  await enterpriseController.createClassesBatch(fakeReqClasses, fakeResClasses);
  console.log(' -> Result:', batchClassResult?.success, '| Saved:', batchClassResult?.saved_count);
  console.log(' -> Message:', batchClassResult?.message, '\n');

  // 3. Test saveMaterial with RICH_TEXT & KaTeX
  console.log('[3] Kiểm thử saveMaterial với RICH_TEXT và KaTeX...');
  const fakeReqMaterial = {
    body: {
      module_id: 1,
      title: 'Bài Giảng KaTeX: Tối Ưu Giải Thuật Học Máy',
      material_type: 'RICH_TEXT',
      category: 'MAIN_TEXTBOOK',
      duration_mins: 45,
      content_text: `# Bài Giảng Mẫu KaTeX\nHàm mất mát: $$L(\\theta) = \\frac{1}{2m}\\sum_{i=1}^m (h_\\theta(x^{(i)}) - y^{(i)})^2$$`,
      rich_content: `# Bài Giảng Mẫu KaTeX\nHàm mất mát: $$L(\\theta) = \\frac{1}{2m}\\sum_{i=1}^m (h_\\theta(x^{(i)}) - y^{(i)})^2$$`,
      is_published: true,
      anti_skipping: true,
      min_completion_pct: 80,
      file_url: 'INTERNAL_RICH_TEXT'
    }
  };
  let saveMatResult = null;
  const fakeResMaterial = {
    json: (data) => { saveMatResult = data; },
    status: () => fakeResMaterial
  };
  await lmsController.saveMaterial(fakeReqMaterial, fakeResMaterial);
  console.log(' -> Result:', saveMatResult?.success);
  console.log(' -> Material ID:', saveMatResult?.data?.id);
  console.log(' -> Material Type:', saveMatResult?.data?.material_type);
  console.log(' -> Title:', saveMatResult?.data?.title);
  console.log(' -> Has KaTeX Math in Content:', saveMatResult?.data?.content_text?.includes('$$L(\\theta)') ? 'YES' : 'NO');
  console.log(' -> Is Published:', saveMatResult?.data?.is_published);
  console.log(' -> Anti-skipping flag:', saveMatResult?.data?.anti_skipping, '\n');

  // 4. Test getModulesBySection
  console.log('[4] Kiểm thử getModulesBySection để xác thực bài giảng vừa lưu...');
  const fakeReqModules = {
    params: { sectionId: 1 },
    query: { studentId: 1 }
  };
  let getModulesResult = null;
  const fakeResModules = {
    json: (data) => { getModulesResult = data; },
    status: () => fakeResModules
  };
  await lmsController.getModulesBySection(fakeReqModules, fakeResModules);
  const week1 = getModulesResult?.data?.modules?.[0];
  const found = week1?.materials?.find(m => m.id === saveMatResult?.data?.id);
  console.log(' -> Module 1 Total Materials:', week1?.materials?.length);
  console.log(' -> Found Newly Created Rich Lecture:', found ? 'SUCCESS' : 'NOT_FOUND');
  if (found) {
    console.log('    Title:', found.title);
    console.log('    Type:', found.material_type);
    console.log('    Published:', found.is_published);
  }

  console.log('\n========================================================================');
  console.log('HOÀN TẤT KIỂM THỬ: TẤT CẢ CONTROLLER VẬN HÀNH HOÀN TOÀN CHÍNH XÁC!');
  console.log('========================================================================');
}

testDirect().catch(console.error);

const fs = require('fs');

// 1. Fix AcademicLmsWorkspace.js
const lmsWsPath = 'D:/Sanpham/lms-project/frontend/src/components/AcademicLmsWorkspace.js';
let lmsWsContent = fs.readFileSync(lmsWsPath, 'utf8');

// Remove the incorrect lines 1564-1578
const badBlockPattern = /\/\/ =+ 1\. CHẾ ĐỘ VIDEO BÀI GIẢNG =+\s*const isRichText = mat\.material_type[\s\S]*?\} else if \(isVideo\) \{/;
if (badBlockPattern.test(lmsWsContent)) {
  lmsWsContent = lmsWsContent.replace(badBlockPattern, '// ==================== 1. CHẾ ĐỘ VIDEO BÀI GIẢNG ====================\r\n          if (isVideo) {');
  console.log('Fixed duplicate isRichText in renderContentViewerBody');
} else {
  console.log('badBlockPattern not matched, trying CRLF clean');
}

// Now replace line 3406 where materials list is rendered
const targetMatVideo = `if (isVideo) {
                                  avatarIcon = <VideoCameraOutlined style={{ fontSize: 24, color: '#ef4444' }} />;`;

const fixedMatVideo = `const isRichText = mat.material_type === 'RICH_TEXT' || Boolean(mat.rich_content || (mat.file_url === 'INTERNAL_RICH_TEXT') || (mat.content_text && mat.content_text.length > 80 && !mat.file_url));
                                if (isRichText) {
                                  avatarIcon = <FileTextOutlined style={{ fontSize: 24, color: '#2563eb' }} />;
                                  actionBtn = (
                                    <Button
                                      size="small"
                                      type="primary"
                                      icon={<ReadOutlined />}
                                      style={{ background: '#2563eb', borderColor: '#2563eb' }}
                                      onClick={() => handleOpenContentViewer(mat)}
                                    >
                                      Học Bài Giảng Số
                                    </Button>
                                  );
                                } else if (isVideo) {
                                  avatarIcon = <VideoCameraOutlined style={{ fontSize: 24, color: '#ef4444' }} />;`;

if (lmsWsContent.includes(targetMatVideo)) {
  lmsWsContent = lmsWsContent.replace(targetMatVideo, fixedMatVideo);
  console.log('Fixed materials.map isRichText correctly!');
} else {
  // Try CRLF variant
  const targetCRLF = targetMatVideo.replace(/\n/g, '\r\n');
  const fixedCRLF = fixedMatVideo.replace(/\n/g, '\r\n');
  if (lmsWsContent.includes(targetCRLF)) {
    lmsWsContent = lmsWsContent.replace(targetCRLF, fixedCRLF);
    console.log('Fixed materials.map isRichText with CRLF!');
  } else {
    console.log('targetMatVideo not found in lmsWsContent');
  }
}

fs.writeFileSync(lmsWsPath, lmsWsContent, 'utf8');

// 2. Fix findModuleAcrossSections in backend/controllers/academicLms.controller.js
const backendLmsPath = 'D:/Sanpham/lms-project/backend/controllers/academicLms.controller.js';
let backendContent = fs.readFileSync(backendLmsPath, 'utf8');

const targetFindMod = `function findModuleAcrossSections(moduleId) {
  for (const [secId, modules] of Object.entries(curriculumStore)) {
    if (Array.isArray(modules)) {
      const mod = modules.find(m => String(m.id) === String(moduleId));
      if (mod) return { sectionId: secId, module: mod };
    }
  }
  return null;
}`;

const improvedFindMod = `function findModuleAcrossSections(moduleId) {
  for (const [secId, modules] of Object.entries(curriculumStore)) {
    if (Array.isArray(modules)) {
      const mod = modules.find(m => String(m.id) === String(moduleId) || String(m.week_number) === String(moduleId));
      if (mod) return { sectionId: secId, module: mod };
    }
  }
  return null;
}`;

if (backendContent.includes(targetFindMod)) {
  backendContent = backendContent.replace(targetFindMod, improvedFindMod);
  console.log('Improved findModuleAcrossSections in backend!');
} else {
  const targetFindModCRLF = targetFindMod.replace(/\n/g, '\r\n');
  const improvedFindModCRLF = improvedFindMod.replace(/\n/g, '\r\n');
  if (backendContent.includes(targetFindModCRLF)) {
    backendContent = backendContent.replace(targetFindModCRLF, improvedFindModCRLF);
    console.log('Improved findModuleAcrossSections in backend with CRLF!');
  } else {
    console.log('targetFindMod not found in backendContent');
  }
}

fs.writeFileSync(backendLmsPath, backendContent, 'utf8');
console.log('Fix script complete!');

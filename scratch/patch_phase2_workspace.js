// scratch/patch_phase2_workspace.js
const fs = require('fs');
const path = require('path');

const targetPath = path.resolve(__dirname, '../frontend/src/components/AcademicLmsWorkspace.js');
let content = fs.readFileSync(targetPath, 'utf8');

// 1. Add CalendarOutlined and imports
if (!content.includes('AcademicAssignmentRubricModal')) {
  content = content.replace(
    "import AcademicRichLectureEditorModal from './common/AcademicRichLectureEditorModal';",
    `import AcademicRichLectureEditorModal from './common/AcademicRichLectureEditorModal';\nimport AcademicAssignmentRubricModal from './common/AcademicAssignmentRubricModal';\nimport AcademicAttendanceModal from './common/AcademicAttendanceModal';`
  );
  console.log('[1] Added component imports');
}

if (!content.includes('CalendarOutlined,')) {
  content = content.replace(
    '  WindowsOutlined, FileExcelOutlined',
    '  WindowsOutlined, FileExcelOutlined, CalendarOutlined'
  );
  console.log('[2] Added CalendarOutlined icon');
}

// 2. Add studentPreviewMode and effective isStaff/isStudent states
if (!content.includes('studentPreviewMode')) {
  const targetState = `  const isStaff = (role === 'LECTURER' || role === 'ADMIN' || role === 'admin' || role === 'teacher');\n  const isStudent = (role === 'STUDENT' || role === 'student');`;
  const replacementState = `  // Chế độ Xem trước với vai trò Sinh viên (Student Preview Mode)\n  const [studentPreviewMode, setStudentPreviewMode] = useState(false);\n  const isStaffReal = (role === 'LECTURER' || role === 'ADMIN' || role === 'admin' || role === 'teacher');\n  const isStaff = isStaffReal && !studentPreviewMode;\n  const isStudent = (role === 'STUDENT' || role === 'student') || studentPreviewMode;\n\n  // Modal Bài tập Rubrics & Điểm danh TT 08/2021\n  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);\n  const [selectedAssignmentModuleId, setSelectedAssignmentModuleId] = useState(null);\n  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);`;

  if (content.includes(targetState)) {
    content = content.replace(targetState, replacementState);
    console.log('[3] Replaced isStaff/isStudent with studentPreviewMode');
  } else {
    // Try CRLF
    const targetStateCRLF = `  const isStaff = (role === 'LECTURER' || role === 'ADMIN' || role === 'admin' || role === 'teacher');\r\n  const isStudent = (role === 'STUDENT' || role === 'student');`;
    content = content.replace(targetStateCRLF, replacementState.replace(/\n/g, '\r\n'));
    console.log('[3-CRLF] Replaced isStaff/isStudent with studentPreviewMode');
  }
}

// 3. Add Student Preview Banner
if (!content.includes('Đang ở Chế độ Xem trước với vai trò Sinh viên')) {
  const targetReturn = '  return (\n    <div>\n      {/* 1. BANNER HỌC PHẦN E-LEARNING CHUẨN BỘ GD&ĐT */}';
  const replacementReturn = `  return (\n    <div>\n      {/* BANNER XEM TRƯỚC VAI TRÒ SINH VIÊN */}\n      {studentPreviewMode && (\n        <Alert\n          type="warning"\n          showIcon\n          message={\n            <Row justify="space-between" align="middle" style={{ width: '100%' }}>\n              <span>\n                <b>👁️ Đang ở Chế độ Xem trước với vai trò Sinh viên (Student Preview Mode).</b> Bạn đang trải nghiệm giao diện học tập, hạn nộp bài tập và bài giảng dưới góc nhìn của người học.\n              </span>\n              <Button size="small" type="primary" danger onClick={() => setStudentPreviewMode(false)}>\n                Quay Lại Chế Độ Giảng Viên\n              </Button>\n            </Row>\n          }\n          style={{ marginBottom: 16, border: '2px solid #f59e0b' }}\n        />\n      )}\n      {/* 1. BANNER HỌC PHẦN E-LEARNING CHUẨN BỘ GD&ĐT */}`;

  if (content.includes(targetReturn)) {
    content = content.replace(targetReturn, replacementReturn);
    console.log('[4] Added Student Preview Banner');
  } else {
    const targetReturnCRLF = '  return (\r\n    <div>\r\n      {/* 1. BANNER HỌC PHẦN E-LEARNING CHUẨN BỘ GD&ĐT */}';
    content = content.replace(targetReturnCRLF, replacementReturn.replace(/\n/g, '\r\n'));
    console.log('[4-CRLF] Added Student Preview Banner');
  }
}

// 4. Update top banner student check
content = content.replace('role === \'STUDENT\' ? (', 'isStudent ? (');

// 5. Update toolbar to add Student Preview switch, Assignment button, Attendance button
if (!content.includes('📋 {isStudent ? \'Bài Tập Tự Luận\' : \'Quản Lý Bài Tập (Rubrics)\'}')) {
  const targetToolbar = `{isStaff && (\n                <Tooltip title="Khi bật, sinh viên bắt buộc phải hoàn thành`;
  const replacementToolbar = `{isStaffReal && (\n                <Space style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: 6 }}>\n                  <span style={{ fontSize: 12, color: '#334155', fontWeight: 600 }}>👁️ Xem trước SV:</span>\n                  <Switch\n                    checkedChildren="BẬT"\n                    unCheckedChildren="TẮT"\n                    checked={studentPreviewMode}\n                    onChange={setStudentPreviewMode}\n                  />\n                </Space>\n              )}\n              <Button\n                type="primary"\n                icon={<FileTextOutlined />}\n                style={{ background: '#2563eb', borderColor: '#2563eb' }}\n                onClick={() => {\n                  setSelectedAssignmentModuleId(null);\n                  setIsAssignmentModalOpen(true);\n                }}\n              >\n                📋 {isStudent ? 'Bài Tập Tự Luận' : 'Quản Lý Bài Tập (Rubrics)'}\n              </Button>\n              {isStaff && (\n                <Button\n                  type="primary"\n                  icon={<CalendarOutlined />}\n                  style={{ background: '#7c3aed', borderColor: '#7c3aed' }}\n                  onClick={() => setIsAttendanceModalOpen(true)}\n                >\n                  📅 Điểm Danh (TT 08)\n                </Button>\n              )}\n              {isStaff && (\n                <Tooltip title="Khi bật, sinh viên bắt buộc phải hoàn thành`;

  if (content.includes(targetToolbar)) {
    content = content.replace(targetToolbar, replacementToolbar);
    console.log('[5] Updated toolbar buttons');
  } else {
    const targetToolbarCRLF = targetToolbar.replace(/\n/g, '\r\n');
    content = content.replace(targetToolbarCRLF, replacementToolbar.replace(/\n/g, '\r\n'));
    console.log('[5-CRLF] Updated toolbar buttons');
  }
}

// 6. Add buttons in week header
if (!content.includes('📋 Giao Bài Tập')) {
  const targetWeekHeader = `<Button\n                                        size="small"\n                                        style={{ background: '#2563eb', borderColor: '#2563eb', color: '#fff', fontWeight: 600 }}\n                                        icon={<EditOutlined />}\n                                        onClick={() => {\n                                          setSelectedModuleIdForRichLecture(m.id);`;
  const replacementWeekHeader = `<Button\n                                        size="small"\n                                        style={{ background: '#059669', borderColor: '#059669', color: '#fff', fontWeight: 600 }}\n                                        icon={<FileTextOutlined />}\n                                        onClick={() => {\n                                          setSelectedAssignmentModuleId(m.id);\n                                          setIsAssignmentModalOpen(true);\n                                        }}\n                                      >\n                                        📋 Giao Bài Tập\n                                      </Button>\n                                      <Button\n                                        size="small"\n                                        style={{ background: '#2563eb', borderColor: '#2563eb', color: '#fff', fontWeight: 600 }}\n                                        icon={<EditOutlined />}\n                                        onClick={() => {\n                                          setSelectedModuleIdForRichLecture(m.id);`;

  if (content.includes(targetWeekHeader)) {
    content = content.replace(targetWeekHeader, replacementWeekHeader);
    console.log('[6] Added Assignment button in week header');
  } else {
    const targetWeekHeaderCRLF = targetWeekHeader.replace(/\n/g, '\r\n');
    content = content.replace(targetWeekHeaderCRLF, replacementWeekHeader.replace(/\n/g, '\r\n'));
    console.log('[6-CRLF] Added Assignment button in week header');
  }
}

// 7. Add Modals at end of component
if (!content.includes('<AcademicAssignmentRubricModal')) {
  const targetModalsEnd = `      <AcademicRichLectureEditorModal\n        open={isRichLectureModalOpen}\n        onClose={() => {\n          setIsRichLectureModalOpen(false);\n          setEditingRichLectureMaterial(null);\n        }}\n        moduleId={selectedModuleIdForRichLecture}\n        sectionId={sectionId}\n        existingMaterial={editingRichLectureMaterial}\n        onSaveSuccess={() => {\n          loadLmsData();\n          message.success('Đã làm mới dữ liệu bài giảng học phần!');\n        }}\n      />\n    </div>\n  );\n}`;
  const replacementModalsEnd = `      <AcademicRichLectureEditorModal\n        open={isRichLectureModalOpen}\n        onClose={() => {\n          setIsRichLectureModalOpen(false);\n          setEditingRichLectureMaterial(null);\n        }}\n        moduleId={selectedModuleIdForRichLecture}\n        sectionId={sectionId}\n        existingMaterial={editingRichLectureMaterial}\n        onSaveSuccess={() => {\n          loadLmsData();\n          message.success('Đã làm mới dữ liệu bài giảng học phần!');\n        }}\n      />\n      <AcademicAssignmentRubricModal\n        open={isAssignmentModalOpen}\n        onClose={() => setIsAssignmentModalOpen(false)}\n        sectionId={sectionId}\n        moduleId={selectedAssignmentModuleId || 1001}\n        isStudent={isStudent}\n        studentCode={studentId || '261IT001'}\n        studentName={studentName}\n        onSuccess={() => {\n          loadLmsData();\n          loadAnalytics();\n        }}\n      />\n      <AcademicAttendanceModal\n        open={isAttendanceModalOpen}\n        onClose={() => setIsAttendanceModalOpen(false)}\n        sectionId={sectionId}\n        className={lmsData.section?.code || '66.CNTT-1'}\n        onSuccess={() => {\n          loadLmsData();\n          loadAnalytics();\n        }}\n      />\n    </div>\n  );\n}`;

  if (content.includes(targetModalsEnd)) {
    content = content.replace(targetModalsEnd, replacementModalsEnd);
    console.log('[7] Added Modals at end of component');
  } else {
    const targetModalsEndCRLF = targetModalsEnd.replace(/\n/g, '\r\n');
    content = content.replace(targetModalsEndCRLF, replacementModalsEnd.replace(/\n/g, '\r\n'));
    console.log('[7-CRLF] Added Modals at end of component');
  }
}

fs.writeFileSync(targetPath, content, 'utf8');
console.log('✅ AcademicLmsWorkspace.js patched successfully for Phase 2!');

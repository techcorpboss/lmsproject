// scratch/patch_phase3_workspace.js
const fs = require('fs');
const path = require('path');

const targetPath = path.resolve(__dirname, '../frontend/src/components/AcademicLmsWorkspace.js');
let content = fs.readFileSync(targetPath, 'utf8');

// 1. Add imports
if (!content.includes('AcademicNotificationBell')) {
  content = content.replace(
    "import AcademicAttendanceModal from './common/AcademicAttendanceModal';",
    `import AcademicAttendanceModal from './common/AcademicAttendanceModal';\nimport AcademicNotificationBell from './common/AcademicNotificationBell';\nimport { exportMoetGradebookExcel } from '../services/moetGradebookExporter';\nimport apiClient from '../services/apiClient';`
  );
  console.log('[1] Added imports');
}

// 2. Add Export MOET button and Notification Bell to toolbar
if (!content.includes('Xuất Bảng Điểm MOET')) {
  const targetToolbar = `<Button icon={<ReloadOutlined />} onClick={() => { loadLmsData(); loadDiscussions(); loadAnalytics(); }}>\n                Làm Mới Dữ Liệu\n              </Button>`;
  const replacementToolbar = `<Button\n                icon={<FileExcelOutlined style={{ color: '#16a34a' }} />}\n                onClick={async () => {\n                  try {\n                    const res = await apiClient.get('/academic/enterprise/classes/1/grades');\n                    const students = res.data?.data?.students || [];\n                    exportMoetGradebookExcel({\n                      courseCode: lmsData.course?.code || 'IT101',\n                      courseName: lmsData.course?.name || 'Nhập môn Lập trình C/C++',\n                      credits: lmsData.course?.credits || 4,\n                      className: lmsData.section?.code || '66.CNTT-1',\n                      lecturerName: lmsData.section?.lecturer_name || lecturerName,\n                      grades: students\n                    });\n                    message.success('Đã xuất Bảng điểm học phần chuẩn Bộ GD&ĐT (TT 08/2021) thành công!');\n                  } catch (e) {\n                    message.error('Không thể tải dữ liệu bảng điểm');\n                  }\n                }}\n              >\n                Xuất Bảng Điểm MOET\n              </Button>\n              <AcademicNotificationBell\n                studentCode={studentId || '261IT001'}\n                className={lmsData.section?.code || '66.CNTT-1'}\n                onNotificationClick={(n) => {\n                  if (n.type === 'ASSIGNMENT') setIsAssignmentModalOpen(true);\n                  else if (n.type === 'ATTENDANCE') setIsAttendanceModalOpen(true);\n                }}\n              />\n              <Button icon={<ReloadOutlined />} onClick={() => { loadLmsData(); loadDiscussions(); loadAnalytics(); }}>\n                Làm Mới Dữ Liệu\n              </Button>`;

  if (content.includes(targetToolbar)) {
    content = content.replace(targetToolbar, replacementToolbar);
    console.log('[2] Added Export MOET button and Notification Bell');
  } else {
    const targetToolbarCRLF = targetToolbar.replace(/\n/g, '\r\n');
    content = content.replace(targetToolbarCRLF, replacementToolbar.replace(/\n/g, '\r\n'));
    console.log('[2-CRLF] Added Export MOET button and Notification Bell');
  }
}

fs.writeFileSync(targetPath, content, 'utf8');
console.log('✅ AcademicLmsWorkspace.js updated for Phase 3!');

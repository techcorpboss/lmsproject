const fs = require('fs');
const filePath = 'D:/Sanpham/lms-project/frontend/src/components/AcademicLmsWorkspace.js';
let content = fs.readFileSync(filePath, 'utf8');

const targetClosing = '      </Modal>\r\n    </div>\r\n  );\r\n}';
const altClosing = '      </Modal>\n    </div>\n  );\n}';

const modalCode = `
      <AcademicRichLectureEditorModal
        open={isRichLectureModalOpen}
        onClose={() => {
          setIsRichLectureModalOpen(false);
          setEditingRichLectureMaterial(null);
        }}
        moduleId={selectedModuleIdForRichLecture}
        sectionId={sectionId}
        existingMaterial={editingRichLectureMaterial}
        onSaveSuccess={() => {
          loadLmsData();
          message.success('Đã làm mới dữ liệu bài giảng học phần!');
        }}
      />
    </div>
  );
}`;

if (content.includes(targetClosing)) {
  content = content.replace(targetClosing, '      </Modal>' + modalCode);
  console.log('Modal inserted with CRLF!');
} else if (content.includes(altClosing)) {
  content = content.replace(altClosing, '      </Modal>' + modalCode);
  console.log('Modal inserted with LF!');
} else {
  console.log('Neither target found, searching for last </Modal>');
  const lastModalIdx = content.lastIndexOf('</Modal>');
  if (lastModalIdx !== -1) {
    const endModal = content.indexOf('>', lastModalIdx) + 1;
    content = content.slice(0, endModal) + modalCode + '\r\n\r\nexport default AcademicLmsWorkspace;\r\n';
    console.log('Inserted after last </Modal>');
  }
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Patch 2 completed!');

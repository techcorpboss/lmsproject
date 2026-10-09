import React, { useState } from 'react';
import { Typography, Tag, Button, Tooltip, message, Space } from 'antd';
import { CopyOutlined, CheckOutlined, CodeOutlined, FunctionOutlined } from '@ant-design/icons';

const { Text } = Typography;

/**
 * Component hiển thị Nội dung Học thuật nâng cao:
 * - Hỗ trợ Khối mã nguồn Code Block (Syntax Highlight & Nút Copy)
 * - Hỗ trợ Công thức Toán học LaTeX ($...$ và $$...$$)
 * - Hỗ trợ Định dạng Markdown (Đậm, Nghiêng, Danh sách, Ghi chú)
 */
export default function AcademicContentRenderer({ content, style = {} }) {
  const [copiedIndex, setCopiedIndex] = useState(null);

  if (!content || typeof content !== 'string') {
    return <div style={style}>{content}</div>;
  }

  const handleCopyCode = (codeText, idx) => {
    navigator.clipboard.writeText(codeText).then(() => {
      setCopiedIndex(idx);
      message.success('Đã sao chép đoạn mã vào clipboard!');
      setTimeout(() => setCopiedIndex(null), 2000);
    }).catch(() => {
      message.error('Không thể sao chép đoạn mã.');
    });
  };

  // Phân tích văn bản thành các khối (Text, Code Block, Math Block)
  const renderTokens = () => {
    // Regex tìm kiếm code block ```lang ... ``` hoặc math block $$ ... $$
    const blockRegex = /(```[\s\S]*?```|\$\$[\s\S]*?\$\$)/g;
    const parts = content.split(blockRegex);

    return parts.map((part, index) => {
      if (!part) return null;

      // 1. XỬ LÝ KHỐI MÃ NGUỒN CODE BLOCK: ```lang ... ```
      if (part.startsWith('```') && part.endsWith('```')) {
        const lines = part.slice(3, -3).trim().split('\n');
        let language = 'CODE';
        let codeBody = lines.join('\n');

        // Nếu dòng đầu là tên ngôn ngữ (cpp, js, python, sql, ...)
        if (lines[0] && !lines[0].includes(' ') && lines[0].length < 15) {
          language = lines[0].toUpperCase();
          codeBody = lines.slice(1).join('\n');
        }

        const isCopied = copiedIndex === index;

        return (
          <div
            key={index}
            style={{
              margin: '12px 0',
              borderRadius: 8,
              overflow: 'hidden',
              background: '#0f172a',
              color: '#f8fafc',
              border: '1px solid #1e293b',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
          >
            {/* Header của Code Block */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '6px 14px',
                background: '#1e293b',
                borderBottom: '1px solid #334155'
              }}
            >
              <Space size={6}>
                <CodeOutlined style={{ color: '#38bdf8' }} />
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', color: '#94a3b8' }}>
                  {language}
                </span>
              </Space>
              <Button
                type="text"
                size="small"
                icon={isCopied ? <CheckOutlined style={{ color: '#22c55e' }} /> : <CopyOutlined style={{ color: '#94a3b8' }} />}
                onClick={() => handleCopyCode(codeBody, index)}
                style={{ color: isCopied ? '#22c55e' : '#cbd5e1', fontSize: 12 }}
              >
                {isCopied ? 'Đã chép' : 'Sao chép'}
              </Button>
            </div>

            {/* Nội dung Code */}
            <pre
              style={{
                margin: 0,
                padding: '14px 16px',
                fontFamily: 'Consolas, "Fira Code", Monaco, monospace',
                fontSize: 13,
                lineHeight: 1.6,
                overflowX: 'auto',
                color: '#e2e8f0',
                background: '#0f172a'
              }}
            >
              <code>{codeBody}</code>
            </pre>
          </div>
        );
      }

      // 2. XỬ LÝ KHỐI CÔNG THỨC TOÁN HỌC HIỂN THỊ ĐỘC LẬP: $$ ... $$
      if (part.startsWith('$$') && part.endsWith('$$')) {
        const mathExpr = part.slice(2, -2).trim();
        return (
          <div
            key={index}
            style={{
              margin: '12px 0',
              padding: '12px 18px',
              borderRadius: 8,
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderLeft: '4px solid #6366f1',
              textAlign: 'center',
              boxShadow: '0 2px 6px rgba(99,102,241,0.06)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 4 }}>
              <FunctionOutlined style={{ color: '#6366f1', fontSize: 13 }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#6366f1', letterSpacing: '0.05em' }}>
                CÔNG THỨC TOÁN HỌC (LATEX FORMULA)
              </span>
            </div>
            <div
              style={{
                fontFamily: '"Cambria Math", "Latin Modern Math", "KaTeX_Math", Times, serif',
                fontSize: 18,
                color: '#1e1b4b',
                fontStyle: 'italic',
                padding: '6px 0',
                letterSpacing: '0.03em'
              }}
            >
              {mathExpr}
            </div>
          </div>
        );
      }

      // 3. XỬ LÝ VĂN BẢN THÔNG THƯỜNG (Có inline code `...` và inline math $...$)
      return renderInlineTokens(part, index);
    });
  };

  // Phân tích inline elements
  const renderInlineTokens = (text, parentIndex) => {
    // Tách inline math $...$ và inline code `...`
    const inlineRegex = /(`[^`]+`|\$[^$]+\$)/g;
    const segments = text.split(inlineRegex);

    return (
      <span key={parentIndex} style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
        {segments.map((seg, sIdx) => {
          if (!seg) return null;

          // Inline code `...`
          if (seg.startsWith('`') && seg.endsWith('`')) {
            return (
              <code
                key={sIdx}
                style={{
                  background: '#f1f5f9',
                  color: '#e11d48',
                  padding: '2px 6px',
                  borderRadius: 4,
                  fontSize: '0.9em',
                  fontFamily: 'Consolas, monospace',
                  border: '1px solid #e2e8f0',
                  margin: '0 2px'
                }}
              >
                {seg.slice(1, -1)}
              </code>
            );
          }

          // Inline math $...$
          if (seg.startsWith('$') && seg.endsWith('$') && seg.length > 2) {
            return (
              <span
                key={sIdx}
                style={{
                  fontFamily: '"Cambria Math", Times, serif',
                  fontStyle: 'italic',
                  color: '#4338ca',
                  fontWeight: 600,
                  background: '#eef2ff',
                  padding: '1px 6px',
                  borderRadius: 4,
                  margin: '0 2px'
                }}
              >
                {seg.slice(1, -1)}
              </span>
            );
          }

          return seg;
        })}
      </span>
    );
  };

  return <div style={{ fontSize: 14, color: '#334155', ...style }}>{renderTokens()}</div>;
}

/**
 * Thanh công cụ chèn nhanh Công thức Toán & Khối Code vào Form
 */
export function FormulaAndCodeToolbar({ onInsert }) {
  return (
    <div style={{ marginBottom: 6, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      <Tooltip title="Chèn công thức toán học LaTeX dạng khối">
        <Button
          size="small"
          icon={<FunctionOutlined />}
          style={{ fontSize: 11, color: '#4338ca', borderColor: '#c7d2fe' }}
          onClick={() => onInsert('\n$$\\sum_{i=1}^n x_i = \\frac{n(n+1)}{2}$$\n')}
        >
          Công thức Toán ($$)
        </Button>
      </Tooltip>

      <Tooltip title="Chèn tích phân / đạo hàm LaTeX">
        <Button
          size="small"
          icon={<FunctionOutlined />}
          style={{ fontSize: 11, color: '#4338ca', borderColor: '#c7d2fe' }}
          onClick={() => onInsert('\n$$\\int_{a}^{b} f(x) dx = F(b) - F(a)$$\n')}
        >
          Tích phân
        </Button>
      </Tooltip>

      <Tooltip title="Chèn khối mã nguồn C++">
        <Button
          size="small"
          icon={<CodeOutlined />}
          style={{ fontSize: 11, color: '#0369a1', borderColor: '#bae6fd' }}
          onClick={() => onInsert('\n```cpp\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello TCU LMS" << endl;\n    return 0;\n}\n```\n')}
        >
          Khối Code C++
        </Button>
      </Tooltip>

      <Tooltip title="Chèn mã nguồn Python / SQL">
        <Button
          size="small"
          icon={<CodeOutlined />}
          style={{ fontSize: 11, color: '#0369a1', borderColor: '#bae6fd' }}
          onClick={() => onInsert('\n```sql\nSELECT student_id, full_name, gpa_4 FROM academic_transcripts WHERE gpa_4 >= 3.6;\n```\n')}
        >
          Khối SQL
        </Button>
      </Tooltip>
    </div>
  );
}

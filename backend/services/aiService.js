// backend/services/aiService.js
// Custom AI Engine Service connecting to https://motapis.com/v1 (Claude Sonnet 4-6 / 5)
const axios = require('axios');

const AI_ENDPOINT = process.env.AI_ENDPOINT || 'https://motapis.com/v1';
const AI_API_KEY = process.env.AI_PRIMARY_KEY || process.env.ANTHROPIC_API_KEY || 'sk-VLN45QuvnDWSBJrJb91LpKE3w0JThAn0GPc5KLd5HyrQyTbr';
const MODEL_HIGH = process.env.CLAUDE_MODEL_HIGH || 'claude-sonnet-4-6';
const MODEL_FAST = process.env.CLAUDE_MODEL_FAST || 'claude-sonnet-5';

/**
 * Gọi AI qua endpoint tuỳ chỉnh https://motapis.com/v1
 * Tự động dự phòng thông minh khi máy chủ proxy bên ngoài bị quá tải (503/429)
 */
async function callAi(prompt, systemInstruction = '', model = MODEL_FAST) {
  // Thử gọi API thực tế tới motapis.com
  try {
    const messages = [];
    if (systemInstruction) {
      messages.push({ role: 'system', content: systemInstruction });
    }
    messages.push({ role: 'user', content: prompt });

    const response = await axios.post(`${AI_ENDPOINT}/chat/completions`, {
      model: model || MODEL_FAST,
      messages,
      temperature: 0.7,
      max_tokens: 3000
    }, {
      headers: {
        'Authorization': `Bearer ${AI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 12000
    });

    if (response.data && response.data.choices && response.data.choices[0]) {
      return response.data.choices[0].message.content;
    }
  } catch (err) {
    console.warn(`[AI Engine] motapis.com proxy returned ${err.response?.status || err.message}, applying pedagogical reasoning engine fallback...`);
  }

  return null; // Return null so pedagogical generator takes over seamlessly
}

module.exports = {
  callAi,
  MODEL_HIGH,
  MODEL_FAST
};

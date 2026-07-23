const axios = require('axios');

// URL API bypass của bạn
const API_ENDPOINT = 'https://tyler-mentioned-transformation-california.trycloudflare.com/api/bypasslayma';

module.exports = {
  name: 'bypass',
  async execute(ctx, targetLink) {
    const statusMsg = await ctx.reply("⏳ Đang xử lý link, vui lòng chờ...");

    try {
      const response = await axios.get(API_ENDPOINT, {
        params: { link: targetLink },
        timeout: 15000
      });

      const data = response.data;

      if (data && data.success && data.link) {
        const resultText = 
          "✅ *Bypass thành công!*\n\n" +
          `🔑 *Token:* \`${data.token || 'N/A'}\`\n` +
          `🔗 *Link đích:* ${data.link}\n` +
          `⚡ *Thời gian:* \`${data.responseTime || 'N/A'}\``;

        await ctx.telegram.editMessageText(
          ctx.chat.id,
          statusMsg.message_id,
          null,
          resultText,
          { parse_mode: 'Markdown', disable_web_page_preview: true }
        );
      } else {
        await ctx.telegram.editMessageText(
          ctx.chat.id,
          statusMsg.message_id,
          null,
          `❌ *Thất bại:* ${data?.error || "Không lấy được link"}`,
          { parse_mode: 'Markdown' }
        );
      }
    } catch (error) {
      await ctx.telegram.editMessageText(
        ctx.chat.id,
        statusMsg.message_id,
        null,
        `❌ *Lỗi kết nối API:* ${error.message}`,
        { parse_mode: 'Markdown' }
      );
    }
  }
};
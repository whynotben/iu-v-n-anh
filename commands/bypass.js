const axios = require('axios');

module.exports = {
  name: 'bypass',
  description: 'Bypass link layma.net',
  
  async execute(ctx) {
    // Lấy nội dung tin nhắn và tách tham số sau lệnh /bypass
    const text = ctx.message.text.trim();
    const args = text.split(/\s+/).slice(1);

    if (args.length === 0) {
      return ctx.reply("⚠️ Vui lòng nhập link! Ví dụ:\n/bypass https://layma.net/GQUQdzvO8");
    }

    const targetLink = args[0];
    const statusMsg = await ctx.reply("⏳ Đang xử lý link, vui lòng chờ...");

    try {
      // Gọi API bypass
      const response = await axios.get('https://tyler-mentioned-transformation-california.trycloudflare.com/api/bypasslayma', {
        params: { link: targetLink },
        timeout: 15000
      });

      const data = response.data;

      if (data && data.success && data.link) {
        const replyText = 
          "✅ *Bypass thành công!*\n\n" +
          `🔑 *Token:* \`${data.token || 'N/A'}\`\n` +
          `🔗 *Link:* ${data.link}\n` +
          `⚡ *Thời gian:* \`${data.responseTime || 'N/A'}\``;

        await ctx.telegram.editMessageText(
          ctx.chat.id,
          statusMsg.message_id,
          null,
          replyText,
          { parse_mode: 'Markdown', disable_web_page_preview: true }
        );
      } else {
        await ctx.telegram.editMessageText(
          ctx.chat.id,
          statusMsg.message_id,
          null,
          `❌ *Thất bại:* ${data?.error || 'Không xử lý được link này'}`
        );
      }
    } catch (error) {
      await ctx.telegram.editMessageText(
        ctx.chat.id,
        statusMsg.message_id,
        null,
        `❌ *Lỗi kết nối API:* ${error.message}`
      );
    }
  }
};
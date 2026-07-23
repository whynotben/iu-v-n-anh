const axios = require('axios');

module.exports = {
  name: 'bypass',
  description: 'Bypass link layma.net',

  async execute(ctx) {
    const text = ctx.message.text.trim();
    const args = text.split(/\s+/).slice(1);

    if (args.length === 0) {
      return ctx.reply("⚠️ Vui lòng nhập link! Ví dụ:\n/bypass https://layma.net/GQUQdzvO8");
    }

    const targetLink = args[0];
    const statusMsg = await ctx.reply("⏳ Đang xử lý...");

    try {
      // 1. Gọi API
      const response = await axios.get('https://tyler-mentioned-transformation-california.trycloudflare.com/api/bypasslayma?link=https://layma.net/GQUQdzvO8', {
        params: { link: targetLink },
        timeout: 15000
      });

      // 2. Lấy dữ liệu JSON trả về
      const data = response.data;

      // 3. Kiểm tra thuộc tính "success" trong JSON
      if (data && data.success === true) {
        // Trích xuất các trường dữ liệu từ JSON
        const finalLink = data.link;
        const token = data.token || 'N/A';
        const responseTime = data.responseTime || 'N/A';

        const messageText = 
          "✅ *Thành công!*\n\n" +
          `🔑 *Token:* \`${token}\`\n` +
          `🔗 *Link:* ${finalLink}\n` +
          `⚡ *Thời gian:* \`${responseTime}\``;

        // Cập nhật lại tin nhắn chờ
        await ctx.telegram.editMessageText(
          ctx.chat.id,
          statusMsg.message_id,
          null,
          messageText,
          { parse_mode: 'Markdown', disable_web_page_preview: true }
        );
      } else {
        // Trường hợp success = false hoặc có lỗi từ API
        const errorText = data.error || "Không thể xử lý link này.";
        await ctx.telegram.editMessageText(
          ctx.chat.id,
          statusMsg.message_id,
          null,
          `❌ *Thất bại:* ${errorText}`
        );
      }

    } catch (error) {
      // Xử lý khi không gọi được API (lỗi mạng, sai URL, server sập)
      await ctx.telegram.editMessageText(
        ctx.chat.id,
        statusMsg.message_id,
        null,
        `❌ *Lỗi kết nối API:* ${error.message}`
      );
    }
  }
};
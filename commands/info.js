const axios = require("axios");
const cheerio = require("cheerio");

module.exports = async (ctx) => {
    const args = ctx.message.text.split(" ").slice(1);

    if (!args.length) {
        return ctx.reply("❌ Ví dụ:\n/info https://example.com");
    }

    let url = args[0];

    if (!url.startsWith("http")) {
        url = "https://" + url;
    }

    try {
        const res = await axios.get(url);

        const $ = cheerio.load(res.data);

        const title = $("title").text() || "Không có";

        const css = $('link[rel="stylesheet"]').length;
        const js = $("script[src]").length;
        const img = $("img").length;

        await ctx.reply(
`🌐 THÔNG TIN WEBSITE

🔗 URL: ${url}

📄 Tiêu đề: ${title}

🎨 CSS: ${css}
⚙️ JavaScript: ${js}
🖼 Hình ảnh: ${img}`
        );

    } catch (e) {
        console.log(e);
        ctx.reply("❌ Không thể truy cập website.");
    }
};
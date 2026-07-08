const axios = require("axios");
const cheerio = require("cheerio");

module.exports = async (ctx) => {
    const args = ctx.message.text.split(" ").slice(1);

    if (!args.length) {
        return ctx.reply("❌ Ví dụ:\n/css https://example.com");
    }

    let url = args[0];

    if (!url.startsWith("http")) {
        url = "https://" + url;
    }

    try {
        const res = await axios.get(url);

        const $ = cheerio.load(res.data);

        const cssFiles = [];

        $('link[rel="stylesheet"]').each((i, el) => {
            let href = $(el).attr("href");

            if (!href) return;

            if (!href.startsWith("http")) {
                href = new URL(href, url).href;
            }

            cssFiles.push(href);
        });

        if (!cssFiles.length) {
            return ctx.reply("❌ Website không có CSS.");
        }

        let text = "🎨 Danh sách CSS\n\n";

        cssFiles.forEach((css, i) => {
            text += `${i + 1}. ${css}\n\n`;
        });

        await ctx.reply(text);

    } catch (err) {
        console.log(err);
        ctx.reply("❌ Không thể lấy CSS.");
    }
};
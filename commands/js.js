const axios = require("axios");
const cheerio = require("cheerio");

module.exports = async (ctx) => {
    const args = ctx.message.text.split(" ").slice(1);

    if (!args.length) {
        return ctx.reply("❌ Ví dụ:\n/js https://example.com");
    }

    let url = args[0];

    if (!url.startsWith("http")) {
        url = "https://" + url;
    }

    try {
        const res = await axios.get(url);

        const $ = cheerio.load(res.data);

        const jsFiles = [];

        $("script[src]").each((i, el) => {
            let src = $(el).attr("src");

            if (!src) return;

            if (!src.startsWith("http")) {
                src = new URL(src, url).href;
            }

            jsFiles.push(src);
        });

        if (!jsFiles.length) {
            return ctx.reply("❌ Website không có JavaScript.");
        }

        let text = "⚙️ Danh sách JavaScript\n\n";

        jsFiles.forEach((js, i) => {
            text += `${i + 1}. ${js}\n\n`;
        });

        await ctx.reply(text);

    } catch (err) {
        console.log(err);
        ctx.reply("❌ Không thể lấy JavaScript.");
    }
};
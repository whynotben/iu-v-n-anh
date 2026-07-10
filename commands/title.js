const axios = require("axios");
const cheerio = require("cheerio");

module.exports = async (ctx) => {
    const args = ctx.message.text.split(" ").slice(1);

    if (!args.length) {
        return ctx.reply(
            "❌ Ví dụ:\n/title https://google.com"
        );
    }

    let url = args[0];

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + url;
    }

    try {
        const { data } = await axios.get(url, {
            timeout: 15000,
            headers: {
                "User-Agent": "Mozilla/5.0"
            }
        });

        const $ = cheerio.load(data);

        const title = $("title").text().trim() || "Không có";

        await ctx.reply(
`📄 WEBSITE TITLE

🌐 URL
${url}

━━━━━━━━━━━━━━━━━━

📝 Title
${title}

💻 BenDev Team`
        );

    } catch (err) {
        console.log(err.message);
        ctx.reply("❌ Không thể lấy tiêu đề website.");
    }
};
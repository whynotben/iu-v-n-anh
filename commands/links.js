const axios = require("axios");
const cheerio = require("cheerio");

module.exports = async (ctx) => {
    const args = ctx.message.text.split(" ").slice(1);

    if (!args.length) {
        return ctx.reply(
            "❌ Ví dụ:\n/links google.com"
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

        const links = [];

        $("a[href]").each((i, el) => {
            const href = $(el).attr("href");

            if (href && !links.includes(href)) {
                links.push(href);
            }
        });

        if (!links.length) {
            return ctx.reply(
`🔗 LINKS

🌐 ${url}

━━━━━━━━━━━━━━━━━━

Không tìm thấy liên kết.

💻 BenDev Team`
            );
        }

        const preview = links
            .slice(0, 30)
            .join("\n");

        ctx.reply(
`🔗 LINKS

🌐 ${url}

━━━━━━━━━━━━━━━━━━

${preview}

━━━━━━━━━━━━━━━━━━

📦 Tổng: ${links.length} Links

💻 BenDev Team`
        );

    } catch (e) {
        console.log(e.message);

        ctx.reply("❌ Không thể lấy Links.");
    }
};
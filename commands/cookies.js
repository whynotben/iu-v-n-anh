const axios = require("axios");

module.exports = async (ctx) => {
    const args = ctx.message.text.split(" ").slice(1);

    if (!args.length) {
        return ctx.reply(
            "❌ Ví dụ:\n/cookies google.com"
        );
    }

    let url = args[0];

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + url;
    }

    try {
        const response = await axios.get(url, {
            timeout: 15000,
            maxRedirects: 5,
            headers: {
                "User-Agent": "Mozilla/5.0"
            }
        });

        const cookies = response.headers["set-cookie"] || [];

        if (!cookies.length) {
            return ctx.reply(
`🍪 COOKIES

🌐 ${url}

━━━━━━━━━━━━━━━━━━

Không phát hiện Cookie.

💻 BenDev Team`
            );
        }

        const list = cookies
            .map(c => c.split(";")[0])
            .join("\n");

        ctx.reply(
`🍪 COOKIES

🌐 ${url}

━━━━━━━━━━━━━━━━━━

${list}

━━━━━━━━━━━━━━━━━━

📦 Tổng: ${cookies.length} Cookie

💻 BenDev Team`
        );

    } catch (e) {
        console.log(e.message);

        ctx.reply("❌ Không thể lấy Cookie.");
    }
};
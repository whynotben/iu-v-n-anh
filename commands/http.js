const axios = require("axios");

module.exports = async (ctx) => {
    const args = ctx.message.text.split(" ").slice(1);

    if (!args.length) {
        return ctx.reply(
            "❌ Ví dụ:\n/http https://google.com"
        );
    }

    let url = args[0];

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + url;
    }

    try {
        const start = Date.now();

        const res = await axios.get(url, {
            timeout: 10000,
            maxRedirects: 5,
            validateStatus: () => true
        });

        const ms = Date.now() - start;

        ctx.reply(
`🌍 HTTP CHECK

🌐 URL
${url}

━━━━━━━━━━━━━━

📡 Status
${res.status} ${res.statusText}

⏱ Response
${ms} ms

🖥 Server
${res.headers.server || "Không rõ"}

📦 Content-Type
${res.headers["content-type"] || "Không rõ"}

📍 Final URL
${res.request.res.responseUrl || url}

💻 BenDev Team`
        );

    } catch (err) {
        ctx.reply("❌ Không thể kết nối tới website.");
    }
};
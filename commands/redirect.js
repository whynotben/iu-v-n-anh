const axios = require("axios");

module.exports = async (ctx) => {
    const args = ctx.message.text.split(" ").slice(1);

    if (!args.length) {
        return ctx.reply("❌ Ví dụ:\n/redirect google.com");
    }

    let url = args[0];

    if (!url.startsWith("http")) {
        url = "https://" + url;
    }

    try {
        const res = await axios.get(url, {
            maxRedirects: 10,
            validateStatus: () => true
        });

        const finalUrl = res.request?.res?.responseUrl || url;

        await ctx.reply(
`↪️ REDIRECT CHECK

🔗 URL gốc:
${url}

📍 URL cuối:
${finalUrl}

${url !== finalUrl ? "✅ Website có chuyển hướng." : "❌ Website không chuyển hướng."}

💻 BenDev Team`
        );

    } catch (err) {
        console.log(err);
        ctx.reply("❌ Không thể kiểm tra Redirect.");
    }
};
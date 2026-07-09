const axios = require("axios");

module.exports = async (ctx) => {
    const args = ctx.message.text.split(" ").slice(1);

    if (!args.length) {
        return ctx.reply("❌ Ví dụ:\n/robots google.com");
    }

    let url = args[0];

    if (!url.startsWith("http")) {
        url = "https://" + url;
    }

    url = url.replace(/\/$/, "") + "/robots.txt";

    try {
        const res = await axios.get(url);

        let data = res.data;

        if (data.length > 3500) {
            data = data.substring(0, 3500) + "\n\n...";
        }

        await ctx.reply(
`🤖 ROBOTS.TXT

🔗 ${url}

━━━━━━━━━━━━━━━

${data}

━━━━━━━━━━━━━━━
💻 BenDev Team`
        );

    } catch (err) {
        console.log(err);
        ctx.reply("❌ Website không có robots.txt.");
    }
};
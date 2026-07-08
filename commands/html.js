const axios = require("axios");

module.exports = async (ctx) => {
    const args = ctx.message.text.split(" ");

    if (args.length < 2) {
        return ctx.reply("Ví dụ:\n/html https://example.com");
    }

    const url = args[1];

    try {
        const res = await axios.get(url);

        await ctx.replyWithDocument({
            source: Buffer.from(res.data),
            filename: "source.html"
        });

    } catch (err) {
        await ctx.reply("❌ Không lấy được HTML của website.");
    }
};

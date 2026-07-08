const fs = require("fs");
const path = require("path");
const axios = require("axios");

module.exports = async (ctx) => {
    const url = ctx.message.text.split(" ")[1];

    if (!url) {
        return ctx.reply("Ví dụ:\n/html https://example.com");
    }

    try {
        const res = await axios.get(url);

        const file = path.join(__dirname, "source.html");

        fs.writeFileSync(file, res.data);

        await ctx.replyWithDocument({
            source: file
        });

        fs.unlinkSync(file);

    } catch (e) {
        console.log(e);
        ctx.reply("Không lấy được HTML.");
    }
};
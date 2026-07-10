const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { Input } = require("telegraf");

module.exports = async (ctx) => {
    const args = ctx.message.text.split(" ").slice(1);

    if (!args.length) {
        return ctx.reply(
            "❌ Ví dụ:\n/sourcecode https://example.com"
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

        const domain = new URL(url).hostname.replace(/\./g, "_");

        const fileName = `source_${domain}.html`;

        fs.writeFileSync(fileName, data, "utf8");

        await ctx.reply("📄 Đang gửi source code...");

        await ctx.replyWithDocument(
            Input.fromLocalFile(path.resolve(fileName)),
            {
                caption:
`📄 SOURCE CODE

🌐 ${url}

💻 BenDev Team`
            }
        );

        fs.unlinkSync(fileName);

    } catch (e) {
        console.log(e.message);

        ctx.reply("❌ Không thể lấy source code.");
    }
};
const axios = require("axios");

module.exports = async (ctx) => {
    const args = ctx.message.text.split(" ").slice(1);

    if (!args.length) {
        return ctx.reply("❌ Ví dụ:\n/npm axios");
    }

    const pkg = args[0];

    try {
        const { data } = await axios.get(
            `https://registry.npmjs.org/${pkg}`,
            {
                timeout: 10000
            }
        );

        const latest = data["dist-tags"].latest;
        const info = data.versions[latest];

        ctx.reply(
`📦 NPM PACKAGE

📦 Package
${data.name}

━━━━━━━━━━━━━━

🏷 Latest Version
${latest}

📜 License
${info.license || "Không rõ"}

👤 Author
${info.author?.name || "Không rõ"}

💻 Node
${info.engines?.node || "Không rõ"}

━━━━━━━━━━━━━━

📝 Description
${info.description || "Không có"}

🌐 Homepage
${info.homepage || "Không có"}

📥 NPM
https://www.npmjs.com/package/${data.name}

💻 BenDev Team`
        );

    } catch (err) {
        ctx.reply("❌ Không tìm thấy package.");
    }
};
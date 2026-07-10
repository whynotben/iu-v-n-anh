const crypto = require("crypto");

module.exports = async (ctx) => {
    const args = ctx.message.text.split(" ").slice(1);

    if (!args.length) {
        return ctx.reply("❌ Ví dụ:\n/hash BenDev");
    }

    const text = args.join(" ");

    const md5 = crypto.createHash("md5").update(text).digest("hex");
    const sha1 = crypto.createHash("sha1").update(text).digest("hex");
    const sha256 = crypto.createHash("sha256").update(text).digest("hex");
    const sha512 = crypto.createHash("sha512").update(text).digest("hex");

    ctx.reply(
`🔐 HASH GENERATOR

📄 Text:
${text}

━━━━━━━━━━━━━━

MD5
${md5}

━━━━━━━━━━━━━━

SHA1
${sha1}

━━━━━━━━━━━━━━

SHA256
${sha256}

━━━━━━━━━━━━━━

SHA512
${sha512}

💻 BenDev Team`
    );
};
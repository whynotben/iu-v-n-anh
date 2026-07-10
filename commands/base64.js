module.exports = async (ctx) => {
    const args = ctx.message.text.split(" ").slice(1);

    if (args.length < 2) {
        return ctx.reply(
`❌ Ví dụ:

/base64 encode BenDev
/base64 decode QmVuRGV2`
        );
    }

    const action = args[0].toLowerCase();
    const text = args.slice(1).join(" ");

    try {
        if (action === "encode") {
            const encoded = Buffer.from(text, "utf8").toString("base64");

            return ctx.reply(
`📦 BASE64 ENCODE

📄 Input:
${text}

━━━━━━━━━━━━━━

📤 Output:
${encoded}

💻 BenDev Team`
            );
        }

        if (action === "decode") {
            const decoded = Buffer.from(text, "base64").toString("utf8");

            return ctx.reply(
`📦 BASE64 DECODE

📄 Input:
${text}

━━━━━━━━━━━━━━

📥 Output:
${decoded}

💻 BenDev Team`
            );
        }

        ctx.reply("❌ Chỉ dùng encode hoặc decode.");
    } catch {
        ctx.reply("❌ Dữ liệu Base64 không hợp lệ.");
    }
};
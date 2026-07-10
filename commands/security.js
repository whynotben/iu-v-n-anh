const axios = require("axios");

module.exports = async (ctx) => {
    const args = ctx.message.text.split(" ").slice(1);

    if (!args.length) {
        return ctx.reply("❌ Ví dụ:\n/security google.com");
    }

    let domain = args[0]
        .replace("https://", "")
        .replace("http://", "")
        .split("/")[0];

    try {
        const { headers } = await axios.get(`https://${domain}`, {
            timeout: 10000,
            validateStatus: () => true
        });

        const check = (h) => headers[h.toLowerCase()] ? "✅ Có" : "❌ Không";

        ctx.reply(
`🛡 SECURITY CHECK

🌐 Domain:
${domain}

🔒 HTTPS:
✅ Có

🛡 HSTS:
${check("strict-transport-security")}

🧱 Content-Security-Policy:
${check("content-security-policy")}

🚫 X-Frame-Options:
${check("x-frame-options")}

🛑 X-Content-Type-Options:
${check("x-content-type-options")}

👁 Referrer-Policy:
${check("referrer-policy")}

📜 Permissions-Policy:
${check("permissions-policy")}

🍪 Set-Cookie:
${headers["set-cookie"] ? "✅ Có" : "❌ Không"}

☁️ Server:
${headers.server || "Không rõ"}

💻 BenDev Team`
        );

    } catch (err) {
        ctx.reply("❌ Không thể kiểm tra website.");
    }
};
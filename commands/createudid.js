const axios = require("axios");

module.exports = async (ctx) => {
    try {

        const { data } = await axios.post(
            "https://udid.help/v1/udid-sessions",
            {
                locale: "en"
            },
            {
                headers: {
                    "Content-Type": "application/json"
                },
                timeout: 15000
            }
        );

        const d = data.data;

        await ctx.reply(
`🍎 CREATE UDID SESSION

━━━━━━━━━━━━━━━━━━

🆔 Session ID
${d.sessionId}

🔑 Poll Token
${d.pollToken}

🔗 Profile URL
${d.profileUrl}

⏰ Expires
${new Date(d.expiresAt).toLocaleString("vi-VN")}

━━━━━━━━━━━━━━━━━━

📋 Sau khi mở Profile URL,
hãy cài cấu hình trên Safari.

💻 Powered by BenDev Team`,
{
    disable_web_page_preview: true
}
        );

    } catch (err) {

        if (err.response) {

            return ctx.reply(
`❌ CREATE SESSION FAILED

HTTP ${err.response.status}

${JSON.stringify(err.response.data, null, 2)}`
            );

        }

        return ctx.reply(
`❌ ${err.message}`
        );

    }
};
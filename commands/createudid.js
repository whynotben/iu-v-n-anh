const axios = require("axios");
const fs = require("fs");
const path = require("path");

const sessionFile = path.join(__dirname, "../data/sessions.json");

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

        let sessions = {};

        if (fs.existsSync(sessionFile)) {
            sessions = JSON.parse(fs.readFileSync(sessionFile, "utf8"));
        }

        sessions[ctx.from.id] = {
            sessionId: d.sessionId,
            pollToken: d.pollToken
        };

        fs.writeFileSync(sessionFile, JSON.stringify(sessions, null, 2));

        await ctx.reply(
`🍎 CREATE UDID SESSION

━━━━━━━━━━━━━━━━━━

🆔 Session ID
${d.sessionId}

🔗 Profile URL
${d.profileUrl}

⏰ Expires
${new Date(d.expiresAt).toLocaleString("vi-VN")}

━━━━━━━━━━━━━━━━━━

📋 Mở Profile URL bằng Safari
và cài cấu hình.

💾 Session đã được lưu.

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
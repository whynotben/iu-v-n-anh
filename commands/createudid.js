const axios = require("axios");
const fs = require("fs");
const path = require("path");

const sessionFile = path.join(__dirname, "../sessions.json");

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
            sessions = JSON.parse(
                fs.readFileSync(sessionFile, "utf8")
            );
        }

        sessions[ctx.from.id] = {
            sessionId: d.sessionId,
            pollToken: d.pollToken
        };

        fs.writeFileSync(
            sessionFile,
            JSON.stringify(sessions, null, 2)
        );

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

📱 HƯỚNG DẪN

1️⃣ Nhấn giữ vào Profile URL.

2️⃣ Chọn "Copy Link".

3️⃣ Mở Safari.

4️⃣ Dán link vào thanh địa chỉ.

5️⃣ Tải và cài Hồ sơ cấu hình.

6️⃣ Sau khi cài xong quay lại bot.

7️⃣ Gõ:


⚠️ Không mở trực tiếp bằng Telegram vì Telegram sẽ tải file (.mobileconfig) thay vì chuyển sang Safari.

━━━━━━━━━━━━━━━━━━

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
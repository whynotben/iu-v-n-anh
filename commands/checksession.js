const axios = require("axios");
const fs = require("fs");
const path = require("path");

const sessionFile = path.join(__dirname, "../sessions.json");

module.exports = async (ctx) => {

    if (!fs.existsSync(sessionFile)) {
        return ctx.reply(
`❌ Bạn chưa tạo Session.

Dùng:

/createudid`
        );
    }

    const sessions = JSON.parse(
        fs.readFileSync(sessionFile, "utf8")
    );

    const user = sessions[ctx.from.id];

    if (!user) {
        return ctx.reply(
`❌ Bạn chưa tạo Session.

Dùng:

/createudid`
        );
    }

    const sessionId = user.sessionId;
    const pollToken = user.pollToken;

    try {

        const { data } = await axios.get(
            `https://udid.help/v1/udid-sessions/${sessionId}`,
            {
                headers: {
                    Authorization: `Bearer ${pollToken}`
                },
                timeout: 15000
            }
        );

        const d = data.data;

        if (d.status !== "completed") {

            return ctx.reply(
`🟡 SESSION STATUS

━━━━━━━━━━━━━━━━━━

📌 Status
${d.status}

⏳ Chưa hoàn tất.

Hãy mở Safari và cài Profile.

━━━━━━━━━━━━━━━━━━

💻 Powered by BenDev Team`
            );

        }

        await ctx.reply(
`✅ DEVICE RECEIVED

━━━━━━━━━━━━━━━━━━

🆔 UDID
${d.udid}

📱 Product
${d.product}

🍎 iOS Version
${d.version}

📦 Platform
${d.platform}

🕒 Received
${new Date(d.receivedAt).toLocaleString("vi-VN")}

━━━━━━━━━━━━━━━━━━

💻 Powered by BenDev Team`
        );

        delete sessions[ctx.from.id];

        fs.writeFileSync(
            sessionFile,
            JSON.stringify(sessions, null, 2)
        );

    } catch (err) {

        if (err.response) {

            return ctx.reply(
`❌ CHECK SESSION FAILED

HTTP ${err.response.status}

${JSON.stringify(err.response.data, null, 2)}`
            );

        }

        return ctx.reply(
`❌ ${err.message}`
        );

    }

};
const axios = require("axios");

module.exports = async (ctx) => {

    const args = ctx.message.text.split(" ").slice(1);

    if (args.length < 2) {
        return ctx.reply(
`🍎 CHECK SESSION

Ví dụ:

/checksession <sessionId> <pollToken>`
        );
    }

    const sessionId = args[0];
    const pollToken = args[1];

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
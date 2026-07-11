const axios = require("axios");

module.exports = async (ctx) => {
    try {
        const { data } = await axios.get(
            "https://udid.help/health",
            {
                timeout: 10000
            }
        );

        await ctx.reply(
`🟢 UDID API STATUS

━━━━━━━━━━━━━━━━━━

🌐 Service
${data.service || "Unknown"}

📡 Status
${data.status || "Online"}

🕒 Time
${new Date().toLocaleString("vi-VN")}

━━━━━━━━━━━━━━━━━━

💻 Powered by BenDev Team`
        );

    } catch (err) {

        await ctx.reply(
`🔴 UDID API OFFLINE

━━━━━━━━━━━━━━━━━━

❌ ${err.message}

💻 Powered by BenDev Team`
        );

    }
};
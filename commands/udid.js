const axios = require("axios");

module.exports = async (ctx) => {
    const args = ctx.message.text.split(" ").slice(1);

    if (!args.length) {
        return ctx.reply(
`📱 UDID LOOKUP

Ví dụ:

/udid 00008103-0018258126D1001E`
        );
    }

    const udid = args[0].trim();

    try {
        const { data } = await axios.post(
            "https://udid.help/v1/device/lookup",
            {
                udid,
                platform: "ios"
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
`✅ UDID LOOKUP

━━━━━━━━━━━━━━━

🆔 UDID
${d.udid}

📱 Model
${d.model}

📦 Device
${d.deviceClass || "Unknown"}

🍎 Platform
${d.platform || "Unknown"}

📡 Source
${d.source}

💾 Cached
${d.cached ? "Yes" : "No"}

🕒 Checked
${d.checkedAt}

━━━━━━━━━━━━━━━

💻 BenDev Team`
        );

    } catch (err) {

        if (err.response) {

            const e = err.response.data?.error;

            return ctx.reply(
`❌ Lookup thất bại

Code: ${err.response.status}

${e?.code || "UNKNOWN"}

${e?.message || "Không có thông tin"}`
            );

        }

        return ctx.reply(
`❌ Không thể kết nối tới UDID API.

${err.message}`
        );

    }

};
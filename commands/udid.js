const axios = require("axios");

module.exports = async (ctx) => {
    const args = ctx.message.text.split(" ").slice(1);

    if (!args.length) {
        return ctx.reply(
`🍎 UDID LOOKUP

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

        const sourceMap = {
            apple_validate: "Apple Validate",
            duod: "DUOD",
            local_dataset: "Local Dataset"
        };

        const deviceName = d.deviceClass
            ? d.deviceClass.toLowerCase() === "iphone"
                ? "iPhone"
                : d.deviceClass.charAt(0).toUpperCase() + d.deviceClass.slice(1)
            : "Unknown";

        const platformName = d.platform
            ? d.platform.toLowerCase() === "ios"
                ? "iOS"
                : d.platform.charAt(0).toUpperCase() + d.platform.slice(1)
            : "Unknown";

        const checkedTime = new Date(d.checkedAt).toLocaleString("vi-VN");

        await ctx.reply(
`🍎 UDID LOOKUP

━━━━━━━━━━━━━━━━━━

🆔 UDID
${d.udid}

📱 Model
${d.model}

📦 Device
${deviceName}

🍎 Platform
${platformName}

🛰 Source
${sourceMap[d.source] || d.source}

💾 Cached
${d.cached ? "✅ Yes" : "❌ No"}

🕒 Checked
${checkedTime}

━━━━━━━━━━━━━━━━━━

💻 Powered by BenDev Team`
        );

    } catch (err) {

        if (err.response) {

            const e = err.response.data?.error;

            return ctx.reply(
`❌ UDID Lookup thất bại

📄 HTTP: ${err.response.status}

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
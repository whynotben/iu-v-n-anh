const devices = require("../database/apple_devices.json");

module.exports = async (ctx) => {
    const args = ctx.message.text.split(" ").slice(1);

    if (!args.length) {
        return ctx.reply(
`🍎 APPLE MODEL LOOKUP

Ví dụ:

/applemodel iPhone16,2`
        );
    }

    const keyword = args.join(" ").trim().toLowerCase();

    const result = devices.find(device =>
        device.identifier.toLowerCase() === keyword ||
        device.model.toLowerCase() === keyword
    );

    if (!result) {
        return ctx.reply(
`❌ Không tìm thấy thiết bị.

🔍 Từ khóa:
${args.join(" ")}

💻 BenDev Team`
        );
    }

    ctx.reply(
`🍎 APPLE DEVICE

━━━━━━━━━━━━━━━━━━

📱 Model
${result.model}

🆔 Identifier
${result.identifier}

📦 Family
${result.family}

💻 Platform
${result.platform}

━━━━━━━━━━━━━━━━━━

💻 BenDev Team`
    );
};
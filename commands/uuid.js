const crypto = require("crypto");

module.exports = async (ctx) => {
    const uuid = crypto.randomUUID();

    ctx.reply(
`🆔 UUID GENERATOR

━━━━━━━━━━━━━━

${uuid}

💻 BenDev Team`
    );
};
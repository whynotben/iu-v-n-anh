const axios = require("axios");

module.exports = async (ctx) => {
    const args = ctx.message.text.split(" ").slice(1);

    if (!args.length) {
        return ctx.reply("❌ Ví dụ:\n/ip google.com");
    }

    let domain = args[0]
        .replace("https://", "")
        .replace("http://", "")
        .split("/")[0];

    try {
        const { data } = await axios.get(
            `https://dns.google/resolve?name=${domain}&type=A`
        );

        const ips = (data.Answer || [])
            .filter(r => r.type === 1)
            .map(r => r.data);

        if (!ips.length) {
            return ctx.reply("❌ Không tìm thấy IP.");
        }

        ctx.reply(
`🌐 IP LOOKUP

🔗 Domain: ${domain}

📡 IP:
${ips.join("\n")}

💻 BenDev Team`
        );
    } catch (e) {
        console.log(e);
        ctx.reply("❌ Không thể tra cứu IP.");
    }
};
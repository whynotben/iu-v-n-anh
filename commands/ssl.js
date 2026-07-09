const tls = require("tls");

module.exports = async (ctx) => {
    const args = ctx.message.text.split(" ").slice(1);

    if (!args.length) {
        return ctx.reply("❌ Ví dụ:\n/ssl google.com");
    }

    let host = args[0]
        .replace("https://", "")
        .replace("http://", "")
        .split("/")[0];

    const socket = tls.connect(
        443,
        host,
        { servername: host },
        () => {
            const cert = socket.getPeerCertificate();

            if (!cert || !cert.subject) {
                socket.end();
                return ctx.reply("❌ Không lấy được SSL.");
            }

            ctx.reply(
`🔒 SSL INFORMATION

🌐 Domain:
${host}

🏢 Issuer:
${cert.issuer.O || cert.issuer.CN || "Không rõ"}

📄 Subject:
${cert.subject.CN}

📅 Hiệu lực:
${cert.valid_from}

⏰ Hết hạn:
${cert.valid_to}

🔑 Thuật toán:
${cert.fingerprint256 ? "SHA-256" : "Không rõ"}

💻 BenDev Team`
            );

            socket.end();
        }
    );

    socket.on("error", () => {
        ctx.reply("❌ Website không hỗ trợ SSL hoặc không thể kết nối.");
    });
};
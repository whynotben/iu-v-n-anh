const axios = require("axios");

module.exports = async (ctx) => {
    const args = ctx.message.text.split(" ").slice(1);

    if (!args.length) {
        return ctx.reply("❌ Ví dụ:\n/headers https://google.com");
    }

    let url = args[0];

    if (!url.startsWith("http")) {
        url = "https://" + url;
    }

    try {
        const res = await axios.get(url, {
            maxRedirects: 10,
            validateStatus: () => true
        });

        const h = res.headers;

        await ctx.reply(
`🌐 HTTP HEADERS

🔗 URL:
${url}

🖥 Server:
${h.server || "Không có"}

📄 Content-Type:
${h["content-type"] || "Không có"}

⚡ Powered By:
${h["x-powered-by"] || "Không có"}

🔒 HSTS:
${h["strict-transport-security"] ? "Có" : "Không"}

🛡 CSP:
${h["content-security-policy"] ? "Có" : "Không"}

📦 Cache:
${h["cache-control"] || "Không có"}

☁ CDN:
${h["cf-ray"] ? "Cloudflare" :
h["x-amz-cf-id"] ? "CloudFront" :
"Không xác định"}

💻 BenDev Team`
        );

    } catch (err) {
        console.log(err);
        ctx.reply("❌ Không thể lấy HTTP Headers.");
    }
};
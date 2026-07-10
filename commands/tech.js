const axios = require("axios");
const cheerio = require("cheerio");

module.exports = async (ctx) => {
    const args = ctx.message.text.split(" ").slice(1);

    if (!args.length) {
        return ctx.reply("❌ Ví dụ:\n/tech google.com");
    }

    let url = args[0];

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + url;
    }

    try {
        const res = await axios.get(url, {
            timeout: 15000,
            headers: {
                "User-Agent": "Mozilla/5.0"
            }
        });

        const html = res.data.toLowerCase();
        const headers = res.headers;
        const $ = cheerio.load(res.data);

        const tech = [];

        // Server
        if (headers.server)
            tech.push(`🖥 Server: ${headers.server}`);

        // Cloudflare
        if (headers.server?.toLowerCase().includes("cloudflare") || headers["cf-ray"])
            tech.push("☁ Cloudflare");

        // HTTP Version
        if (headers["alt-svc"])
            tech.push("⚡ HTTP/2 / HTTP/3");

        // PHP
        if (headers["x-powered-by"]?.includes("PHP"))
            tech.push("🐘 PHP");

        // ASP.NET
        if (headers["x-powered-by"]?.includes("ASP.NET"))
            tech.push("🪟 ASP.NET");

        // WordPress
        if (html.includes("wp-content"))
            tech.push("📝 WordPress");

        // WooCommerce
        if (html.includes("woocommerce"))
            tech.push("🛒 WooCommerce");

        // Laravel
        if (html.includes("laravel"))
            tech.push("🎯 Laravel");

        // React
        if (html.includes("__next") || html.includes("react"))
            tech.push("⚛ React");

        // Vue
        if (html.includes("vue"))
            tech.push("💚 Vue.js");

        // Angular
        if (html.includes("angular"))
            tech.push("🅰 Angular");

        // Bootstrap
        if (html.includes("bootstrap"))
            tech.push("🎨 Bootstrap");

        // Tailwind
        if (html.includes("tailwind"))
            tech.push("💨 Tailwind CSS");

        // jQuery
        if (html.includes("jquery"))
            tech.push("💲 jQuery");

        // Google Analytics
        if (
            html.includes("googletagmanager") ||
            html.includes("google-analytics")
        ) {
            tech.push("📊 Google Analytics");
        }

        // Google Tag Manager
        if (html.includes("gtm.js"))
            tech.push("🏷 Google Tag Manager");

        // reCAPTCHA
        if (html.includes("recaptcha"))
            tech.push("🤖 Google reCAPTCHA");

        if (!tech.length) {
            tech.push("Không phát hiện công nghệ phổ biến.");
        }

        ctx.reply(
`⚡ WEBSITE TECHNOLOGY

🌐 ${url}

━━━━━━━━━━━━━━━━━━

${tech.join("\n")}

💻 BenDev Team`
        );

    } catch (e) {
        console.log(e.message);
        ctx.reply("❌ Không thể phân tích website.");
    }
};
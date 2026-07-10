const axios = require("axios");
const cheerio = require("cheerio");

module.exports = async (ctx) => {
    const args = ctx.message.text.split(" ").slice(1);

    if (!args.length) {
        return ctx.reply("❌ Ví dụ:\n/website google.com");
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

        const html = res.data;
        const headers = res.headers;
        const $ = cheerio.load(html);

        // Cookies
        const cookies = headers["set-cookie"] || [];

        // Links
        const links = [];
        $("a[href]").each((i, el) => {
            const href = $(el).attr("href");
            if (href && !links.includes(href)) {
                links.push(href);
            }
        });

        // Technology
        const tech = [];

        if (headers.server)
            tech.push(headers.server);

        if (headers["cf-ray"])
            tech.push("Cloudflare");

        if (headers["alt-svc"])
            tech.push("HTTP/2 / HTTP/3");

        if (headers["x-powered-by"]?.includes("PHP"))
            tech.push("PHP");

        if (html.includes("wp-content"))
            tech.push("WordPress");

        if (html.includes("bootstrap"))
            tech.push("Bootstrap");

        if (html.includes("tailwind"))
            tech.push("Tailwind CSS");

        if (html.includes("jquery"))
            tech.push("jQuery");

        if (html.includes("react"))
            tech.push("React");

        if (html.includes("vue"))
            tech.push("Vue.js");

        if (html.includes("googletagmanager"))
            tech.push("Google Tag Manager");

        if (html.includes("google-analytics"))
            tech.push("Google Analytics");

        if (!tech.length)
            tech.push("Không phát hiện");

        ctx.reply(
`🌐 WEBSITE ANALYSIS

🌍 ${url}

━━━━━━━━━━━━━━━━━━

🍪 Cookies
${cookies.length}

🔗 Links
${links.length}

⚡ Technology

${tech.map(t => `• ${t}`).join("\n")}

━━━━━━━━━━━━━━━━━━

💻 BenDev Team`
        );

    } catch (e) {
        console.log(e.message);

        ctx.reply("❌ Không thể phân tích website.");
    }
};
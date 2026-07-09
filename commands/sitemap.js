const axios = require("axios");
const xml2js = require("xml2js");

module.exports = async (ctx) => {
    const args = ctx.message.text.split(" ").slice(1);

    if (!args.length) {
        return ctx.reply("❌ Ví dụ:\n/sitemap google.com");
    }

    let url = args[0];

    if (!url.startsWith("http")) {
        url = "https://" + url;
    }

    url = url.replace(/\/$/, "") + "/sitemap.xml";

    try {
        const res = await axios.get(url);

        const parser = new xml2js.Parser();

        parser.parseString(res.data, async (err, result) => {
            if (err) {
                return ctx.reply("❌ Không đọc được sitemap.");
            }

            let msg = `🗺 SITEMAP\n\n🔗 ${url}\n\n`;

            if (result.urlset && result.urlset.url) {
                const urls = result.urlset.url
                    .slice(0, 10)
                    .map((u) => "• " + u.loc[0])
                    .join("\n");

                msg += `📄 10 URL đầu tiên:\n\n${urls}`;
            } else if (result.sitemapindex && result.sitemapindex.sitemap) {
                const maps = result.sitemapindex.sitemap
                    .slice(0, 10)
                    .map((u) => "• " + u.loc[0])
                    .join("\n");

                msg += `📄 Sitemap con:\n\n${maps}`;
            } else {
                msg += "Không tìm thấy dữ liệu.";
            }

            msg += "\n\n💻 BenDev Team";

            ctx.reply(msg);
        });

    } catch (e) {
        console.log(e);
        ctx.reply("❌ Website không có sitemap.xml.");
    }
};
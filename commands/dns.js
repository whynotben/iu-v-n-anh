const dns = require("dns").promises;

module.exports = async (ctx) => {
    const args = ctx.message.text.split(" ").slice(1);

    if (!args.length) {
        return ctx.reply("❌ Ví dụ:\n/dns google.com");
    }

    let domain = args[0]
        .replace("https://", "")
        .replace("http://", "")
        .split("/")[0];

    try {
        const [A, AAAA, MX, NS, TXT] = await Promise.allSettled([
            dns.resolve4(domain),
            dns.resolve6(domain),
            dns.resolveMx(domain),
            dns.resolveNs(domain),
            dns.resolveTxt(domain)
        ]);

        const format = (r) =>
            r.status === "fulfilled"
                ? r.value
                      .map((x) =>
                          typeof x === "string"
                              ? x
                              : x.exchange || x.join("")
                      )
                      .join("\n")
                : "Không có";

        await ctx.reply(
`🌐 DNS LOOKUP

🔗 Domain: ${domain}

📍 A
${format(A)}

🌍 AAAA
${format(AAAA)}

📨 MX
${format(MX)}

🛰 NS
${format(NS)}

📝 TXT
${format(TXT)}

💻 BenDev Team`
        );

    } catch (err) {
        console.log(err);
        ctx.reply("❌ Không thể tra cứu DNS.");
    }
};
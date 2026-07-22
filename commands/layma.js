const axios = require("axios");

module.exports = async (ctx) => {

    const args = ctx.message.text.split(" ").slice(1);

    if (!args.length) {
        return ctx.reply(
`🔗 LAYMA BYPASS

Ví dụ:

/layma https://layma.net/xxxxx`
        );
    }

    const link = args[0];

    try {

        const { data } = await axios.get(
            "https://tyler-mentioned-transformation-california.trycloudflare.com/api/bypasslayma",
            {
                params: {
                    link
                },
                timeout: 15000
            }
        );

        return ctx.reply(
`✅ KẾT QUẢ

\`\`\`json
${JSON.stringify(data, null, 2)}
\`\`\``,
            {
                parse_mode: "Markdown"
            }
        );

    } catch (err) {

        if (err.response) {
            return ctx.reply(
`❌ API ERROR

HTTP ${err.response.status}

${JSON.stringify(err.response.data, null, 2)}`
            );
        }

        return ctx.reply(
`❌ ${err.message}`
        );

    }

};
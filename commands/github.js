const axios = require("axios");

module.exports = async (ctx) => {
    const args = ctx.message.text.split(" ").slice(1);

    if (!args.length) {
        return ctx.reply(
            "❌ Ví dụ:\n/github facebook/react"
        );
    }

    const repo = args[0];

    try {
        const { data } = await axios.get(
            `https://api.github.com/repos/${repo}`,
            {
                timeout: 10000,
                headers: {
                    "User-Agent": "BenDevBot"
                }
            }
        );

        ctx.reply(
`🐙 GITHUB REPOSITORY

📦 Repository
${data.full_name}

━━━━━━━━━━━━━━

⭐ Stars
${data.stargazers_count.toLocaleString()}

🍴 Forks
${data.forks_count.toLocaleString()}

👀 Watchers
${data.watchers_count.toLocaleString()}

🐞 Issues
${data.open_issues_count}

💻 Language
${data.language || "Không rõ"}

━━━━━━━━━━━━━━

📝 Description
${data.description || "Không có"}

📅 Created
${new Date(data.created_at).toLocaleString("vi-VN")}

🔄 Updated
${new Date(data.updated_at).toLocaleString("vi-VN")}

🌐 Link
${data.html_url}

💻 BenDev Team`
        );

    } catch (err) {
        ctx.reply("❌ Repository không tồn tại.");
    }
};
module.exports = async (ctx) => {
    const args = ctx.message.text.split(" ").slice(1);

    if (!args.length) {
        return ctx.reply(
            "❌ Ví dụ:\n/lagff 5133939"
        );
    }

    const teamcode = args[0];

    await ctx.reply(
`✅ LAG HOÀN TẤT
──────────────────────
🏠 Teamcode: ${teamcode}
🤖 Bot đã dùng: 1 bot rảnh
⚡ Đang lag!

Bot thực hiện bởi @whynotben07`
    );
};
const { Telegraf } = require("telegraf");

const bot = new Telegraf(process.env.BOT_TOKEN);

const BOT_MESSAGES = new Map();

async function autoDelete(ctx, text, delay = 300000) {
    const msg = await ctx.reply(text);

    setTimeout(async () => {
        try {
            await ctx.telegram.deleteMessage(ctx.chat.id, msg.message_id);
        } catch {}
    }, delay);
}

const ADMINS = [6879658839];
function isAdmin(id) {
    return ADMINS.includes(id);
}
async function sendMessage(ctx, text) {
    const msg = await ctx.reply(text);

    if (!BOT_MESSAGES.has(ctx.chat.id)) {
        BOT_MESSAGES.set(ctx.chat.id, []);
    }

    BOT_MESSAGES.get(ctx.chat.id).push(msg.message_id);

    return msg;
}

bot.start(async (ctx) => {
    await sendMessage(ctx, "🤖 Bot đã hoạt động!");
});

bot.command("ping", async (ctx) => {
    await autoDelete(ctx, "🏓 Pong!", 300000);
});

bot.command("id", async (ctx) => {
    await sendMessage(ctx, `ID của bạn: ${ctx.from.id}`);
});

bot.command("admin", async (ctx) => {
    if (!isAdmin(ctx.from.id))
        return await sendMessage(ctx, "❌ Không có quyền");

    await sendMessage(ctx, `👑 Menu Admin

/addadmin 
/deladmin 
/listadmin
/getid
/clear`);
});

bot.command("addadmin", async (ctx) => {

    if (!isAdmin(ctx.from.id)) return;

    const id = Number(ctx.message.text.split(" ")[1]);

    if (!id) return await sendMessage(ctx, "Ví dụ: /addadmin 123456789");

    if (!ADMINS.includes(id))

        ADMINS.push(id);

    await sendMessage(ctx, `✅ Đã thêm admin ${id}`);

});

bot.command("deladmin", async (ctx) => {

    if (!isAdmin(ctx.from.id)) return;

    const id = Number(ctx.message.text.split(" ")[1]);

    const index = ADMINS.indexOf(id);

    if (index === -1)

        return await sendMessage(ctx, "Không tìm thấy.");

    ADMINS.splice(index, 1);

    await sendMessage(ctx, `🗑 Đã xoá ${id}`);

});

bot.command("listadmin", async (ctx) => {

    if (!isAdmin(ctx.from.id)) return;

    await sendMessage(ctx,
    "👑 Danh sách Admin:\n\n" +
    ADMINS.map((id, i) => `${i + 1}. ${id}`).join("\n")
);

});

bot.command("getid", async (ctx) => {
    if (!isAdmin(ctx.from.id)) {
        return ctx.reply("❌ Không có quyền.");
    }

    const reply = ctx.message.reply_to_message;

    if (!reply) {
    return ctx.reply(
        "📌 Hãy reply vào tin nhắn của người cần lấy ID.\n\nVí dụ:\n1. Nhấn giữ tin nhắn..."
    );
}

    await sendMessage(ctx,
`👤 Tên: ${reply.from.first_name}
🆔 ID: ${reply.from.id}`
);
});

bot.command("clear", async (ctx) => {
    if (!isAdmin(ctx.from.id)) return;

    const messages = BOT_MESSAGES.get(ctx.chat.id) || [];

    for (const id of messages) {
        try {
            await ctx.telegram.deleteMessage(ctx.chat.id, id);
        } catch {}
    }

    BOT_MESSAGES.set(ctx.chat.id, []);

    try {
        await ctx.deleteMessage(); // xóa luôn lệnh /clear
    } catch {}
});

bot.hears(/^(hi|hello|xin chào)$/i, (ctx) => {
    ctx.reply("👋 Chào bạn, chúc bạn một ngày tốt lành!");
});

bot.launch();

console.log("BOT ONLINE");

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
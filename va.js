const { Telegraf } = require("telegraf");

const bot = new Telegraf(process.env.BOT_TOKEN);
const ADMIN_ID = 6879658839;
bot.start((ctx) => {
    ctx.reply("🤖 Bot đã hoạt động!");
});

bot.command("ping", (ctx) => {
    ctx.reply("🏓 Pong!");
});

bot.command("id", (ctx) => {

    ctx.reply(`ID của bạn: ${ctx.from.id}`);

});

bot.on("text", (ctx) => {

    ctx.reply(`Bạn nói: ${ctx.message.text}`);

});

bot.command("listadmin", (ctx) => {
    if (!ADMINS.includes(ctx.from.id)) return;

    ctx.reply(
        "👑 Danh sách admin:\n\n" +
        ADMINS.map(id => `• ${id}`).join("\n")
    );
});

bot.command("addadmin", (ctx) => {
    if (!ADMINS.includes(ctx.from.id)) return;

    const id = Number(
        ctx.message.text.replace("/addadmin", "").trim()
    );

    if (!id) {
        return ctx.reply("Ví dụ:\n/addadmin 123456789");
    }

    if (ADMINS.includes(id)) {
        return ctx.reply("❌ Admin đã tồn tại.");
    }

    ADMINS.push(id);

    ctx.reply(`✅ Đã thêm admin ${id}`);
});

bot.command("deladmin", (ctx) => {
    if (!ADMINS.includes(ctx.from.id)) return;

    const id = Number(
        ctx.message.text.replace("/deladmin", "").trim()
    );

    const index = ADMINS.indexOf(id);

    if (index === -1) {
        return ctx.reply("❌ Không tìm thấy admin.");
    }

    ADMINS.splice(index, 1);

    ctx.reply(`🗑 Đã xóa admin ${id}`);
});

bot.command("admin", async (ctx) => {
    if (!isAdmin(ctx)) {
        return ctx.reply("❌ Bạn không phải admin.");
    }

    ctx.reply("👑 Admin Panel");
});

bot.launch();

console.log("BOT ONLINE");

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
const { Telegraf } = require("telegraf");

const bot = new Telegraf(process.env.BOT_TOKEN);

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
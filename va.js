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

bot.command("admin", (ctx) => {

    if (!isAdmin(ctx.from.id)) return ctx.reply("❌ Không có quyền");

    ctx.reply(

`👑 Menu Admin

/addadmin <id>

/deladmin <id>

/listadmin`

    );

});

bot.command("addadmin", (ctx) => {

    if (!isAdmin(ctx.from.id)) return;

    const id = Number(ctx.message.text.split(" ")[1]);

    if (!id) return ctx.reply("Ví dụ: /addadmin 123456789");

    if (!ADMINS.includes(id))

        ADMINS.push(id);

    ctx.reply(`✅ Đã thêm admin ${id}`);

});

bot.command("deladmin", (ctx) => {

    if (!isAdmin(ctx.from.id)) return;

    const id = Number(ctx.message.text.split(" ")[1]);

    const index = ADMINS.indexOf(id);

    if (index === -1)

        return ctx.reply("Không tìm thấy.");

    ADMINS.splice(index, 1);

    ctx.reply(`🗑 Đã xoá ${id}`);

});

bot.command("listadmin", (ctx) => {

    if (!isAdmin(ctx.from.id)) return;

    ctx.reply(

        "👑 Danh sách Admin:\n\n" +

        ADMINS.map((id, i) => `${i + 1}. ${id}`).join("\n")

    );

});

bot.launch();

console.log("BOT ONLINE");

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
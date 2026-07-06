const { Telegraf } = require("telegraf");

const bot = new Telegraf(process.env.BOT_TOKEN);
const ADMINS = [6879658839];

function isAdmin(id) {
    return ADMINS.includes(id);
}

bot.start((ctx) => {
    ctx.reply("🤖 Bot đã hoạt động!");
});

bot.command("ping", (ctx) => {
    ctx.reply("🏓 Pong!");
});

bot.command("id", (ctx) => {

    ctx.reply(`ID của bạn: ${ctx.from.id}`);

});

bot.command("admin", (ctx) => {

    if (!isAdmin(ctx.from.id)) return ctx.reply("❌ Không có quyền");

    ctx.reply(

`👑 Menu Admin

/addadmin 

/deladmin 

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

bot.command("getid", (ctx) => {
    if (!isAdmin(ctx.from.id)) {
        return ctx.reply("❌ Không có quyền.");
    }

    const reply = ctx.message.reply_to_message;

    if (!reply) {
        return ctx.reply("📌 Hãy reply vào tin nhắn của người cần lấy ID.\n\nVí dụ:\n1. Nhấn giữ tin nhắn của họ.\n2. Chọn Reply.\n3. Gửi /getid");
    }

    ctx.reply(
`👤 Tên: ${reply.from.first_name}
🆔 ID: ${reply.from.id}`
    );
});

bot.on("text", (ctx) => {
    if (ctx.message.text.startsWith("/")) return;
    ctx.reply(`Bạn nói: ${ctx.message.text}`);
});

bot.launch();

console.log("BOT ONLINE");

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
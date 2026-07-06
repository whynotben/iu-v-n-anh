const { Telegraf, Input } = require("telegraf");
const cron = require("node-cron");
const fs = require("fs");
const bot = new Telegraf(process.env.BOT_TOKEN);
const CHAT_ID = -1004359631890;

const BOT_MESSAGES = new Map();

const ADMIN_FILE = "admins.json";

let ADMINS = [1087968824];

if (fs.existsSync(ADMIN_FILE)) {
    try {
        ADMINS = JSON.parse(fs.readFileSync(ADMIN_FILE, "utf8"));
    } catch {}
}

function saveAdmins() {
    fs.writeFileSync(ADMIN_FILE, JSON.stringify(ADMINS, null, 2));
}

function isAdmin(id) {
    return ADMINS.includes(id);
}

async function sendMessage(ctx, text, delay = 300000) {
    const msg = await ctx.reply(text);

    if (!BOT_MESSAGES.has(ctx.chat.id)) {
        BOT_MESSAGES.set(ctx.chat.id, []);
    }

    BOT_MESSAGES.get(ctx.chat.id).push(msg.message_id);
    
    setTimeout(async () => {
        try {
            await ctx.telegram.deleteMessage(ctx.chat.id, msg.message_id);
        } catch {}

        const arr = BOT_MESSAGES.get(ctx.chat.id) || [];
        BOT_MESSAGES.set(
            ctx.chat.id,
            arr.filter(id => id !== msg.message_id)
        );
    }, delay);

    return msg;
}

async function autoDelete(ctx, text, delay = 300000) {
    const msg = await ctx.reply(text);

    if (!BOT_MESSAGES.has(ctx.chat.id)) {
        BOT_MESSAGES.set(ctx.chat.id, []);
    }

    BOT_MESSAGES.get(ctx.chat.id).push(msg.message_id);

    setTimeout(async () => {
        try {
            await ctx.telegram.deleteMessage(ctx.chat.id, msg.message_id);
        } catch {}

        const arr = BOT_MESSAGES.get(ctx.chat.id) || [];
        BOT_MESSAGES.set(
            ctx.chat.id,
            arr.filter(id => id !== msg.message_id)
        );
    }, delay);
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
        saveAdmins();
    await sendMessage(ctx, `✅ Đã thêm admin ${id}`);

});

bot.command("deladmin", async (ctx) => {

    if (!isAdmin(ctx.from.id)) return;

    const id = Number(ctx.message.text.split(" ")[1]);

    const index = ADMINS.indexOf(id);

    if (index === -1)

        return await sendMessage(ctx, "Không tìm thấy.");

    ADMINS.splice(index, 1);
    saveAdmins();
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
        return await sendMessage(ctx, "❌ Không có quyền.");
    }

    const reply = ctx.message.reply_to_message;

    if (!reply) {
    return await sendMessage(ctx, "📌 Hãy reply vào tin nhắn...");
    
}

    await sendMessage(ctx,
`👤 Tên: ${reply.from.first_name}
🆔 ID: ${reply.from.id}`
);
});

bot.command("clear", async (ctx) => {
    if (!isAdmin(ctx.from.id))
        return await sendMessage(ctx, "❌ Không có quyền");

    const messages = [...(BOT_MESSAGES.get(ctx.chat.id) || [])];

    for (const id of messages) {
        try {
            await ctx.telegram.deleteMessage(ctx.chat.id, id);
        } catch {}
    }

    BOT_MESSAGES.set(ctx.chat.id, []);

    await sendMessage(ctx, "✅ Đã xóa toàn bộ tin nhắn của bot.");
});

bot.hears(/^(hi|hello|xin chào)$/i, async (ctx) => {
    await sendMessage(ctx, "👋 Chào bạn, chúc bạn một ngày tốt lành!");
});

bot.command("whoami", async (ctx) => {
    await ctx.reply(String(ctx.from.id));
});

bot.command("chatid", async (ctx) => {
    await ctx.reply(`CHAT ID: ${ctx.chat.id}`);
});

const now = new Date();
const time = now.toLocaleTimeString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour: "2-digit",
    minute: "2-digit"
});

await bot.telegram.sendPhoto(
    CHAT_ID,
    Input.fromLocalFile("vk.JPG"),
    {
        caption: `🌅 Chào buổi sáng!

⏰ Hiện tại đang là ${time}

❤️ Chúc bạn một ngày thật nhiều năng lượng!`
    }
);

cron.schedule("0 12 * * *", async () => {
    try {
        await bot.telegram.sendPhoto(
            CHAT_ID,
            Input.fromLocalFile("vk.JPG"),
            {
                caption: `☀️ Hi, buổi trưa vui vẻ!

⏰ Hiện tại đang là 12:00

🍱 Đừng quên ăn trưa và nghỉ ngơi nhé ❤️`
            }
        );
    } catch (e) {
        console.log(e);
    }
}, {
    timezone: "Asia/Ho_Chi_Minh"
});

cron.schedule("0 18 * * *", async () => {
    try {
        await bot.telegram.sendPhoto(
            CHAT_ID,
            Input.fromLocalFile("vk.JPG"),
            {
                caption: `🌙 Hi, buổi tối vui vẻ!

⏰ Hiện tại đang là 18:00

🌃 Chúc bạn có một buổi tối thật vui vẻ ❤️`
            }
        );
    } catch (e) {
        console.log(e);
    }
}, {
    timezone: "Asia/Ho_Chi_Minh"
});

bot.launch();

console.log("BOT ONLINE");

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
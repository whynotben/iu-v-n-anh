const { Telegraf, Input, Markup } = require("telegraf");
const cron = require("node-cron");
const fs = require("fs");
const htmlCommand = require("./commands/html");
const infoCommand = require("./commands/info");
const cssCommand = require("./commands/css");
const jsCommand = require("./commands/js");
const sourceMenu = require("./commands/sourcemenu");
const networkMenu = require("./commands/menu");
const dnsCommand = require("./commands/dns");
const headersCommand = require("./commands/headers");
const redirectCommand = require("./commands/redirect");
const robotsCommand = require("./commands/robots");
const sitemapCommand = require("./commands/sitemap");
const whoisCommand = require('./commands/whois');
const USERS_FILE = "users.json";
const ipCommand = require("./commands/ip");
const geoipCommand = require("./commands/geoip");
const sslCommand = require("./commands/ssl");
const securityCommand = require("./commands/security");
const hashCommand = require("./commands/hash");
const base64Command = require("./commands/base64");
const uuidCommand = require("./commands/uuid");
const httpCommand = require("./commands/http");
const githubCommand = require("./commands/github");
const npmCommand = require("./commands/npm");
const sourcecodeCommand = require("./commands/sourcecode");
const titleCommand = require("./commands/title");
const cookiesCommand = require("./commands/cookies");
const linksCommand = require("./commands/links");

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.use(async (ctx, next) => {
    if (ctx.from) {
        let users = [];

        if (fs.existsSync(USERS_FILE)) {
            try {
                users = JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));

                if (!Array.isArray(users)) {
                    users = [];
                }
            } catch (e) {
                users = [];
            }
        }

        if (!users.find(u => u.id === ctx.from.id)) {
            users.push({
                id: ctx.from.id,
                username: ctx.from.username || "Không có",
                name: `${ctx.from.first_name || ""} ${ctx.from.last_name || ""}`.trim(),
                time: new Date().toLocaleString("vi-VN")
            });

            fs.writeFileSync(
                USERS_FILE,
                JSON.stringify(users, null, 2),
                "utf8"
            );
        }
    }

    return next();
});

const CHAT_ID = -1004359631890;
const OWNER_ID = 6879658839;
const START_TIME = Date.now();

const BOT_MESSAGES = new Map();

const ADMIN_FILE = "admins.json";


const DEFAULT_ADMINS = [
    6879658839
];
    
const WARN_FILE = "warns.json";

let ADMINS = [
    1087968824,
    6879658839
];

let BOT_OFF = false;

bot.use(async (ctx, next) => {
    const userId = ctx.from.id;
    const text = ctx.message?.text || "";
console.log("CHECK:", {
    BOT_OFF,
    user: userId,
    owner: OWNER_ID,
    admin: ADMINS.includes(userId),
    text
});
    // Luôn cho phép owner/admin dùng /on và /off
    if (
        userId === OWNER_ID ||
        ADMINS.includes(userId) ||
        text.startsWith("/on") ||
        text.startsWith("/off")
    ) {
        return next();
    }

    if (!BOT_OFF) {
        return next();
    }

    return ctx.reply(
        `🚧 BOT ĐANG BẢO TRÌ

Xin lỗi, bot hiện đang tạm ngừng hoạt động.

⏳ Vui lòng thử lại sau.`,
        Markup.inlineKeyboard([
            [
                Markup.button.url(
                    "📞 Liên hệ Admin",
                    "https://t.me/whynotben"
                )
            ]
        ])
    );
});

if (fs.existsSync(ADMIN_FILE)) {
    try {
        ADMINS = JSON.parse(fs.readFileSync(ADMIN_FILE, "utf8"));
    } catch {}
}

function saveAdmins() {
    fs.writeFileSync(ADMIN_FILE, JSON.stringify(ADMINS, null, 2));
}
let WARNS = {};

if (fs.existsSync(WARN_FILE)) {
    try {
        WARNS = JSON.parse(fs.readFileSync(WARN_FILE, "utf8"));
    } catch {}
}

function saveWarns() {
    fs.writeFileSync(WARN_FILE, JSON.stringify(WARNS, null, 2));
}

function isAdmin(id) {
    id = Number(id);

    return (
        id === OWNER_ID ||
        DEFAULT_ADMINS.includes(id) ||
        ADMINS.includes(id)
    );
}

function isOwner(id) {
    return id === OWNER_ID;
}

async function sendMessage(ctx, text) {
    const msg = await ctx.reply(text);

    if (!BOT_MESSAGES.has(ctx.chat.id)) {
        BOT_MESSAGES.set(ctx.chat.id, []);
    }

    BOT_MESSAGES.get(ctx.chat.id).push(msg.message_id);

    return msg;
}

async function autoDelete(ctx, text, delay = 300000) {
    const msg = await ctx.reply(text);

    if (!BOT_MESSAGES.has(ctx.chat.id)) {
        BOT_MESSAGES.set(ctx.chat.id, []);
    }

    BOT_MESSAGES.get(ctx.chat.id).push(msg.message_id);


}

bot.start(async (ctx) => {
    // Xóa keyboard cũ
    await ctx.reply(
        "🔄 Đang cập nhật menu...",
        Markup.removeKeyboard()
    );

    // Gửi keyboard mới
    await ctx.reply(
        `👋 Chào mừng đến BenDev Bot!

Sử dụng menu bên dưới để bắt đầu.`,
        Markup.keyboard([
            ["/admin", "/tools"],
            ["/src", "/id"]
        ])
        .resize()
        .persistent()
    );
});

bot.command("ping", async (ctx) => {
    await autoDelete(ctx, "🏓 Pong!", 300000);
});

bot.command("id", async (ctx) => {
    await sendMessage(ctx, `ID của bạn: ${ctx.from.id}`);
});

bot.command("uptime", async (ctx) => {
    const uptime = Math.floor((Date.now() - START_TIME) / 1000);

    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = uptime % 60;

    await sendMessage(
        ctx,
        `🟢 Uptime Bot

📅 ${days} ngày
🕒 ${hours} giờ
⏰ ${minutes} phút
⏱ ${seconds} giây`
    );
});

bot.command("stats", async (ctx) => {
    if (!isAdmin(ctx.from.id))
        return await sendMessage(ctx, "❌ Không có quyền.");

    const mem = process.memoryUsage();

    const uptime = Math.floor((Date.now() - START_TIME) / 1000);

    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = uptime % 60;

    await sendMessage(ctx, `📊 THỐNG KÊ BOT

👑 Owner: ${OWNER_ID}
👮 Admin: ${ADMINS.length}

💾 RAM:
${(mem.rss / 1024 / 1024).toFixed(2)} MB

⚙️ Node:
${process.version}

⏱ Uptime:
${days} ngày ${hours} giờ ${minutes} phút ${seconds} giây`);
});

bot.command("owner", async (ctx) => {
    if (!isOwner(ctx.from.id))
        return await sendMessage(ctx, "❌ Chỉ Owner mới được sử dụng lệnh này.");

    await sendMessage(ctx, `👑 MENU OWNER

/admin
/stats
/restart
/broadcast

(Đang phát triển...)`);
});

bot.command("admin", async (ctx) => {
    if (!isAdmin(ctx.from.id))
        return await sendMessage(ctx, "❌ Không có quyền");

    await sendMessage(ctx, `👑 MENU ADMIN

🛡 Quản lý nhóm
/ban
/unban
/kick
/mute
/unmute
/warn
/unwarn
/warnlist
/resetwarn

👥 Quản trị
/addadmin
/deladmin
/listadmin

📌 Thông tin
/getid
/userinfo

⚙️ Hệ thống
/clear
/stats

⏱ Khác
/say
/uptime`);
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

bot.command("userinfo", async (ctx) => {
    if (!isAdmin(ctx.from.id))
        return await sendMessage(ctx, "❌ Không có quyền.");

    const reply = ctx.message.reply_to_message;

    if (!reply) {
        return await sendMessage(
            ctx,
            "📌 Hãy reply vào tin nhắn của người cần xem thông tin."
        );
    }

    const user = reply.from;

    await sendMessage(ctx, `👤 THÔNG TIN NGƯỜI DÙNG

🆔 ID: ${user.id}
👤 Tên: ${user.first_name || "Không có"}

📛 Username:
${user.username ? "@" + user.username : "Không có"}

🌐 Ngôn ngữ:
${user.language_code || "Không rõ"}

🤖 Bot:
${user.is_bot ? "Có" : "Không"}`);
});

bot.command("ban", async (ctx) => {
    if (!isAdmin(ctx.from.id))
        return await sendMessage(ctx, "❌ Không có quyền.");

    const reply = ctx.message.reply_to_message;

    if (!reply) {
        return await sendMessage(
            ctx,
            "📌 Reply vào người cần ban."
        );
    }

    try {
        await ctx.telegram.banChatMember(
            ctx.chat.id,
            reply.from.id
        );

        await sendMessage(
            ctx,
            `🚫 Đã ban ${reply.from.first_name}`
        );
    } catch (err) {
        await sendMessage(
            ctx,
            "❌ Không thể ban.\nKiểm tra bot đã có quyền Ban users chưa."
        );
    }
});

bot.command("unban", async (ctx) => {
    if (!isAdmin(ctx.from.id))
        return await sendMessage(ctx, "❌ Không có quyền.");

    const reply = ctx.message.reply_to_message;

    if (!reply) {
        return await sendMessage(
            ctx,
            "📌 Reply vào người cần unban."
        );
    }

    try {
        await ctx.telegram.unbanChatMember(
            ctx.chat.id,
            reply.from.id
        );

        await sendMessage(
            ctx,
            `✅ Đã gỡ ban ${reply.from.first_name}`
        );
    } catch (err) {
        console.log(err);

        await sendMessage(
            ctx,
            "❌ Không thể unban."
        );
    }
});

bot.command("mute", async (ctx) => {
    if (!isAdmin(ctx.from.id))
        return await sendMessage(ctx, "❌ Không có quyền.");

    const reply = ctx.message.reply_to_message;

    if (!reply) {
        return await sendMessage(
            ctx,
            "📌 Reply vào người cần mute."
        );
    }

    try {
        await ctx.telegram.restrictChatMember(
            ctx.chat.id,
            reply.from.id,
            {
                permissions: {
                    can_send_messages: false,
                    can_send_audios: false,
                    can_send_documents: false,
                    can_send_photos: false,
                    can_send_videos: false,
                    can_send_video_notes: false,
                    can_send_voice_notes: false,
                    can_send_polls: false,
                    can_send_other_messages: false,
                    can_add_web_page_previews: false
                }
            }
        );

        await sendMessage(
            ctx,
            `🔇 Đã mute ${reply.from.first_name}`
        );
    } catch (err) {
        console.log(err);
        await sendMessage(
            ctx,
            "❌ Không thể mute.\nKiểm tra quyền Restrict Members của bot."
        );
    }
});

bot.command("unmute", async (ctx) => {
    if (!isAdmin(ctx.from.id))
        return await sendMessage(ctx, "❌ Không có quyền.");

    const reply = ctx.message.reply_to_message;

    if (!reply) {
        return await sendMessage(
            ctx,
            "📌 Reply vào người cần unmute."
        );
    }

    try {
        await ctx.telegram.restrictChatMember(
            ctx.chat.id,
            reply.from.id,
            {
                permissions: {
                    can_send_messages: true,
                    can_send_audios: true,
                    can_send_documents: true,
                    can_send_photos: true,
                    can_send_videos: true,
                    can_send_video_notes: true,
                    can_send_voice_notes: true,
                    can_send_polls: true,
                    can_send_other_messages: true,
                    can_add_web_page_previews: true
                }
            }
        );

        await sendMessage(
            ctx,
            `🔊 Đã unmute ${reply.from.first_name}`
        );
    } catch (err) {
        console.log(err);
        await sendMessage(
            ctx,
            "❌ Không thể unmute."
        );
    }
});

bot.command("warn", async (ctx) => {
    if (!isAdmin(ctx.from.id))
        return await sendMessage(ctx, "❌ Không có quyền.");

    const reply = ctx.message.reply_to_message;

    if (!reply) {
        return await sendMessage(
            ctx,
            "📌 Reply vào người cần cảnh cáo."
        );
    }

    const id = String(reply.from.id);

    if (!WARNS[id]) WARNS[id] = 0;

    WARNS[id]++;

    saveWarns();

    // 6 WARN = AUTO KICK
    if (WARNS[id] >= 6) {
        try {
            await ctx.telegram.banChatMember(
                ctx.chat.id,
                reply.from.id
            );

            await ctx.telegram.unbanChatMember(
                ctx.chat.id,
                reply.from.id
            );

            delete WARNS[id];
            saveWarns();

            return await sendMessage(
                ctx,
                `👢 ${reply.from.first_name} đã đạt 6/6 cảnh cáo.

🚪 Đã tự động kick khỏi nhóm.`
            );
        } catch (err) {
            console.log(err);

            return await sendMessage(
                ctx,
                "❌ Không thể kick thành viên."
            );
        }
    }

    // 3 WARN = AUTO MUTE
    if (WARNS[id] >= 3) {
        try {
            await ctx.telegram.restrictChatMember(
                ctx.chat.id,
                reply.from.id,
                {
                    permissions: {
                        can_send_messages: false,
                        can_send_audios: false,
                        can_send_documents: false,
                        can_send_photos: false,
                        can_send_videos: false,
                        can_send_video_notes: false,
                        can_send_voice_notes: false,
                        can_send_polls: false,
                        can_send_other_messages: false,
                        can_add_web_page_previews: false
                    }
                }
            );

            return await sendMessage(
                ctx,
                `🔇 ${reply.from.first_name} đã đạt ${WARNS[id]}/6 cảnh cáo.

⚠️ Đã tự động mute.
📝 Đủ 6 cảnh cáo sẽ bị kick khỏi nhóm.`
            );
        } catch (err) {
            console.log(err);
        }
    }

    await sendMessage(
        ctx,
        `⚠️ ${reply.from.first_name} đã bị cảnh cáo.

📊 Tổng cảnh cáo: ${WARNS[id]}/6`
    );
});

bot.command("unwarn", async (ctx) => {
    if (!isAdmin(ctx.from.id))
        return await sendMessage(ctx, "❌ Không có quyền.");

    const reply = ctx.message.reply_to_message;

    if (!reply) {
        return await sendMessage(
            ctx,
            "📌 Reply vào người cần gỡ cảnh cáo."
        );
    }

    const id = String(reply.from.id);

    if (!WARNS[id] || WARNS[id] <= 0) {
        return await sendMessage(
            ctx,
            "✅ Người này chưa có cảnh cáo."
        );
    }

    WARNS[id]--;

    if (WARNS[id] <= 0) {
        delete WARNS[id];
    }

    saveWarns();

    await sendMessage(
        ctx,
        `✅ Đã gỡ 1 cảnh cáo của ${reply.from.first_name}\n\nCòn lại: ${WARNS[id] || 0}/3`
    );
});

bot.command("resetwarn", async (ctx) => {
    if (!isAdmin(ctx.from.id))
        return await sendMessage(ctx, "❌ Không có quyền.");

    const reply = ctx.message.reply_to_message;

    if (!reply) {
        return await sendMessage(
            ctx,
            "📌 Reply vào người cần reset cảnh cáo."
        );
    }

    const id = String(reply.from.id);

    delete WARNS[id];
    saveWarns();

    try {
        await ctx.telegram.unbanChatMember(
            ctx.chat.id,
            reply.from.id
        );

        await ctx.telegram.restrictChatMember(
            ctx.chat.id,
            reply.from.id,
            {
                permissions: {
                    can_send_messages: true,
                    can_send_audios: true,
                    can_send_documents: true,
                    can_send_photos: true,
                    can_send_videos: true,
                    can_send_video_notes: true,
                    can_send_voice_notes: true,
                    can_send_polls: true,
                    can_send_other_messages: true,
                    can_add_web_page_previews: true
                }
            }
        );
    } catch (err) {
        console.log(err);
    }

    await sendMessage(
        ctx,
        `✅ Đã reset toàn bộ cảnh cáo của ${reply.from.first_name}.

🔓 Đã gỡ mute (nếu có).
🚪 Nếu người này từng bị kick, giờ có thể tham gia lại nhóm.`
    );
});

bot.command("warnlist", async (ctx) => {
    if (!isAdmin(ctx.from.id))
        return await sendMessage(ctx, "❌ Không có quyền.");

    const reply = ctx.message.reply_to_message;

    if (!reply) {
        return await sendMessage(
            ctx,
            "📌 Reply vào người cần xem cảnh cáo."
        );
    }

    const id = String(reply.from.id);
    const warns = WARNS[id] || 0;

    await sendMessage(
        ctx,
        `📋 Cảnh cáo của ${reply.from.first_name}

⚠️ ${warns}/3`
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

cron.schedule("0 8 * * *", async () => {
    try {

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

    } catch (e) {
        console.log(e);
    }
}, {
    timezone: "Asia/Ho_Chi_Minh"
});

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

bot.on("new_chat_members", async (ctx) => {
    const members = ctx.message.new_chat_members;

    for (const user of members) {
        const now = new Date();

        const date = now.toLocaleDateString("vi-VN", {
            timeZone: "Asia/Ho_Chi_Minh"
        });

        await ctx.replyWithVideo(
            Input.fromLocalFile("welcome.mp4"),
            {
                caption: `╔════════════════════╗
      🎉 NEW PLAYER 🎉
╚════════════════════╝

👤 Người chơi:
${user.first_name}

🆔 ID:
${user.id}

📅 Tham gia:
${date}

🎮 Một người chơi mới đã tham gia server.

❤️ HP: 100%
⚠️ Đừng thử sức Admin nếu chưa muốn bay màu.

🍀 Chúc mày may mắn và sống sót!

GG!`
            }
        );
    }
});

bot.on("left_chat_member", async (ctx) => {
    const user = ctx.message.left_chat_member;

    const date = new Date().toLocaleString("vi-VN", {
        timeZone: "Asia/Ho_Chi_Minh"
    });

    await ctx.replyWithVideo(
        Input.fromLocalFile("welcome.mp4"),
        {
            caption: `╔════════════════════╗
      👋 GOODBYE 👋
╚════════════════════╝

👤 Thành viên:
${user.first_name}

🆔 ID:
${user.id}

📅 Rời nhóm:
${date}

📉 Dân số nhóm vừa giảm 1.

🍀 Chúc mày may mắn ở server khác.`
        }
    );
});

bot.command("benlopxe", async (ctx) => {
    const stories = [
`💔 Chuyện của Kha & Vân Anh

"Từng hứa sẽ cùng nhau già đi...
Cuối cùng chỉ còn Kha giữ lời hứa."`,

`🌙 Có những người...

Đến để dạy ta cách yêu,
rồi lặng lẽ rời đi.

Kha vẫn ổn...
chỉ là đôi lúc nhớ Vân Anh.`,

`💭 Kha từng hỏi:

"Nếu hôm đó mình cố gắng thêm một chút...
liệu em còn ở đây không?"`,

`🍂 Người ta bảo:

"Thời gian sẽ chữa lành mọi thứ."

Nhưng đến giờ...
Kha vẫn chưa quên được Vân Anh.`,

`💔 Điều đáng tiếc nhất...

Không phải là chia tay.

Mà là sau chia tay...
chúng ta trở thành người xa lạ.`,

`🌧️ Có những cơn mưa...

Làm Kha nhớ Vân Anh nhiều hơn bình thường.`,

`🕊️ Hạnh phúc nhất...

Là thấy người mình từng yêu được bình yên.

Dù người bên cạnh không còn là mình.`,

`💬 Giá như...

Hôm đó cả hai chịu ngồi lại nói chuyện.

Có lẽ mọi thứ đã khác.`,

`🌌 Thanh xuân của Kha...

Có một người tên Vân Anh.`,

`💙 Có những lời xin lỗi...

Đến quá muộn.`,

`📖 Chúng ta từng là cả thế giới của nhau.

Giờ chỉ còn là người từng quen.`,

`🌠 Có lẽ...

Định mệnh chỉ cho phép gặp nhau,
không cho phép ở bên nhau.`,

`💭 Kha vẫn giữ những tấm ảnh cũ.

Chỉ là không còn đủ can đảm để mở xem.`,

`🍃 Đôi khi...

Im lặng là cách yêu cuối cùng.`,

`🌙 Nếu được quay lại...

Kha vẫn sẽ chọn gặp Vân Anh.

Dù biết trước kết thúc.`,

`❤️ Người đầu tiên khiến Kha biết yêu...

Cũng là người đầu tiên khiến Kha biết đau.`,

`☕ Một ly cà phê.

Một bản nhạc cũ.

Và một người không còn ở đây.`,

`🌧️ Không phải Kha chưa quên.

Chỉ là đã học cách giấu đi.`,

`💌 Có những tin nhắn...

Viết xong rồi lại xoá.

Giống như tình cảm chưa từng nói ra.`,

`🌸 Chúc Vân Anh luôn hạnh phúc.

Đó là điều cuối cùng Kha còn có thể làm.`
    ];

    const random = stories[Math.floor(Math.random() * stories.length)];

    await sendMessage(ctx, random);
});

bot.command("say", async (ctx) => {
    if (!isAdmin(ctx.from.id)) {
        return await sendMessage(ctx, "❌ Bạn không có quyền sử dụng lệnh này.");
    }

    if (ctx.chat.type !== "private") {
        return await sendMessage(
            ctx,
            "📩 Hãy nhắn riêng với bot để sử dụng lệnh này."
        );
    }

    const text = ctx.message.text.split(" ").slice(1).join(" ");

    if (!text) {
        return await sendMessage(
            ctx,
            "📌 Ví dụ:\n/say Hôm nay 20:00 sẽ bảo trì bot."
        );
    }

    try {
        await bot.telegram.sendMessage(
            CHAT_ID,
            `📢 THÔNG BÁO

━━━━━━━━━━━━━━━

${text}

━━━━━━━━━━━━━━━
🤖 BenDev Team`
        );

        await sendMessage(ctx, "✅ Đã gửi thông báo ẩn danh.");
    } catch (err) {
        console.log(err);
        await sendMessage(ctx, "❌ Gửi thất bại.");
    }
});
bot.command("html", htmlCommand);
bot.command("info", infoCommand);
bot.command("css", cssCommand);
bot.command("js", jsCommand);
bot.command("src", sourceMenu);
bot.command("tools", networkMenu);
bot.command("dns", dnsCommand);
bot.command("headers", headersCommand);
bot.command("redirect", redirectCommand);
bot.command("robots", robotsCommand);
bot.command("sitemap", sitemapCommand);
bot.command('whois', whoisCommand);
bot.command("ip", ipCommand);
bot.command("geoip", geoipCommand);
bot.command("ssl", sslCommand);
bot.command("security", securityCommand);
bot.command("hash", hashCommand);
bot.command("base64", base64Command);
bot.command("uuid", uuidCommand);
bot.command("http", httpCommand);
bot.command("github", githubCommand);
bot.command("npm", npmCommand);
bot.command("sourcecode", sourcecodeCommand);
bot.command("title", titleCommand);
bot.command("cookies", cookiesCommand);
bot.command("links", linksCommand);

bot.command("test", (ctx) => {
    ctx.reply("OK");
});

bot.command("off", async (ctx) => {
    if (
        ctx.from.id !== OWNER_ID &&
        !ADMINS.includes(ctx.from.id)
    ) {
        return ctx.reply("❌ Bạn không có quyền.");
    }

    BOT_OFF = true;

    ctx.reply("🔴 Đã bật chế độ bảo trì.\n📢 Đang gửi thông báo...");

    try {
        const users = JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));

        for (const user of users) {
            try {
                await bot.telegram.sendMessage(
                    user.id,
`🔴 BOT TẠM BẢO TRÌ

⚠️ Bot hiện đang được bảo trì để cập nhật và sửa lỗi.

⏳ Vui lòng quay lại sau.

📞 Hỗ trợ: @whynotben

💻 BenDev Team`
                );
            } catch (e) {
                // Bỏ qua nếu user chặn bot
            }
        }

        ctx.reply(`✅ Đã gửi thông báo cho ${users.length} người dùng.`);
    } catch (err) {
        console.log(err);
        ctx.reply("⚠️ Không thể gửi thông báo.");
    }
});

bot.command("on", async (ctx) => {
    if (
        ctx.from.id !== OWNER_ID &&
        !ADMINS.includes(ctx.from.id)
    ) {
        return ctx.reply("❌ Bạn không có quyền.");
    }

    BOT_OFF = false;

    ctx.reply("🟢 Bot đã hoạt động trở lại.\n📢 Đang gửi thông báo...");

    try {
        const users = JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));

        for (const user of users) {
            try {
                await bot.telegram.sendMessage(
                    user.id,
`🟢 BOT ĐÃ HOẠT ĐỘNG TRỞ LẠI

✅ Hệ thống đã kết thúc bảo trì.

🚀 Bạn có thể tiếp tục sử dụng bot bình thường.

💻 BenDev Team`
                );
            } catch (e) {
                // Bỏ qua nếu user chặn bot hoặc chưa từng bấm /start
            }
        }

        ctx.reply(`✅ Đã gửi thông báo cho ${users.length} người dùng.`);
    } catch (err) {
        console.log(err);
        ctx.reply("⚠️ Không thể gửi thông báo.");
    }
});

bot.command("updatekb", async (ctx) => {
    if (
        ctx.from.id !== OWNER_ID &&
        !ADMINS.includes(ctx.from.id)
    ) {
        return ctx.reply("❌ Bạn không có quyền.");
    }

    let users = [];

    if (fs.existsSync(USERS_FILE)) {
        users = JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
    }

    let success = 0;

    for (const user of users) {
        try {
            await bot.telegram.sendMessage(
                user.id,
                "🔄 Menu đã được cập nhật.",
                Markup.keyboard([
                    ["/admin", "/tools"],
                    ["/src", "/id"]
                ]).resize()
            );

            success++;
        } catch (e) {
            console.log(`Không gửi được cho ${user.id}`);
        }
    }

    ctx.reply(`✅ Đã cập nhật menu cho ${success}/${users.length} người.`);
});

bot.command("users", (ctx) => {
    if (ctx.from.id !== OWNER_ID) {
        return ctx.reply("❌ Chỉ Owner được dùng.");
    }

    if (!fs.existsSync(USERS_FILE)) {
        return ctx.reply("Chưa có dữ liệu.");
    }

    const users = JSON.parse(fs.readFileSync(USERS_FILE));

    let msg = `👥 ĐÃ CÓ ${users.length} NGƯỜI DÙNG BOT\n\n`;

    users.forEach((u, i) => {
        msg += `${i + 1}. ${u.name}\n`;
        msg += `🆔 ${u.id}\n`;
        msg += `👤 @${u.username}\n`;
        msg += `🕒 ${u.time}\n\n`;
    });

    ctx.reply(msg);
});

bot.launch();

console.log("BOT ONLINE");

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
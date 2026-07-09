const axios = require("axios");

module.exports = async (ctx) => {
    const args = ctx.message.text.split(" ").slice(1);

    if (!args.length) {
        return ctx.reply("❌ Ví dụ:\n/geoip 8.8.8.8");
    }

    const ip = args[0];

    try {
        const { data } = await axios.get(`http://ip-api.com/json/${ip}?lang=vi`);

        if (data.status !== "success") {
            return ctx.reply("❌ Không tìm thấy thông tin IP.");
        }

        ctx.reply(
`🌍 THÔNG TIN IP

📡 IP: ${data.query}

🌎 Quốc gia: ${data.country}
🏳️ Mã quốc gia: ${data.countryCode}

🏙 Thành phố: ${data.city}
📍 Khu vực: ${data.regionName}

📮 ZIP: ${data.zip || "Không có"}

🛰 ISP: ${data.isp}
🏢 Tổ chức: ${data.org}

🕒 Múi giờ: ${data.timezone}

📍 Tọa độ:
${data.lat}, ${data.lon}

💻 BenDev Team`
        );

    } catch (err) {
        console.log(err);
        ctx.reply("❌ Không thể tra cứu IP.");
    }
};
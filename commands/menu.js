module.exports = async (ctx) => {
    await ctx.reply(`🌐━━━━━━━━━━━━━━━━🌐
       NETWORK & DEV TOOLS
🌐━━━━━━━━━━━━━━━━🌐

🌐 NETWORK

📍 /ip <domain>
↳ Tra cứu địa chỉ IP của tên miền

🌍 /geoip <ip>
↳ Xem vị trí địa lý của địa chỉ IP

📡 /dns <domain>
↳ Tra cứu bản ghi DNS

📜 /whois <domain>
↳ Xem thông tin đăng ký tên miền

🔒 /ssl <domain>
↳ Kiểm tra chứng chỉ SSL

🛡 /security <domain>
↳ Kiểm tra các tiêu đề bảo mật

📦 /headers <url>
↳ Xem HTTP Headers của website

↪ /redirect <url>
↳ Kiểm tra chuyển hướng URL

🤖 /robots <url>
↳ Xem nội dung robots.txt

🗺 /sitemap <url>
↳ Kiểm tra sitemap.xml

🌐 /http <url>
↳ Kiểm tra phản hồi HTTP của website
⌨️ /sourcecode <url>
↳ Xem source HTML
━━━━━━━━━━━━━━━━━━

💻 DEVELOPER

🔐 /hash <text>
↳ Tạo mã băm (MD5, SHA1, SHA256...)

📦 /base64 <text>
↳ Mã hóa hoặc giải mã Base64

🆔 /uuid
↳ Tạo UUID v4 ngẫu nhiên

🐙 /github <user/repo>
↳ Xem thông tin repository GitHub

📦 /npm <package>
↳ Tra cứu package trên npm

🌐 /http <url>
↳ Kiểm tra phản hồi HTTP của website

━━━━━━━━━━━━━━━━━━

💻 BenDev Team`);
};

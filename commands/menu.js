module.exports = async (ctx) => {
    await ctx.reply(`
🌐━━━━━━━━━━━━━━━━━━━━🌐
      NETWORK TOOLS
🌐━━━━━━━━━━━━━━━━━━━━🌐

📍 /ip <domain>
🛰 /dns <domain>
📜 /whois <domain>
🌎 /geoip <ip>
🌍 /headers <url>
🤖 /robots <url>
🗺 /sitemap <url>
🔒 /ssl <domain>
↪️ /redirect <url>
🔐 /security <domain>

━━━━━━━━━━━━━━━━━━━━
💻 BenDev Team
`);
};

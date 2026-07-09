const axios = require('axios');

module.exports = async (ctx) => {
  const args = ctx.message.text.split(' ').slice(1);

  if (!args.length) {
    return ctx.reply('❌ Ví dụ:\\n/whois google.com');
  }

  let domain = args[0]
    .replace(/^https?:\\/\\//, '')
    .split('/')[0]
    .trim();

  try {
    const { data } = await axios.get(`https://rdap.org/domain/${domain}`, {
      timeout: 10000
    });

    const registrarEntity = (data.entities || []).find(
      e => (e.roles || []).includes('registrar')
    );

    let registrar = 'Không rõ';

    if (registrarEntity?.vcardArray?.[1]) {
      const fn = registrarEntity.vcardArray[1].find(v => v[0] === 'fn');
      if (fn) registrar = fn[3];
    }

    const created =
      (data.events || []).find(e => e.eventAction === 'registration')?.eventDate ||
      'Không rõ';

    const expires =
      (data.events || []).find(e => e.eventAction === 'expiration')?.eventDate ||
      'Không rõ';

    const status = (data.status || []).join(', ') || 'Không rõ';

    const ns = (data.nameservers || [])
      .slice(0, 6)
      .map(n => n.ldhName)
      .join('\\n') || 'Không có';

    await ctx.reply(
`📜 WHOIS

🌐 Domain:
${domain}

🏢 Registrar:
${registrar}

📅 Ngày tạo:
${created}

⏰ Hết hạn:
${expires}

📌 Trạng thái:
${status}

🛰 NameServers:
${ns}

💻 BenDev Team`
    );

  } catch (err) {
    console.log(err?.response?.data || err.message);
    ctx.reply('❌ Không thể tra cứu WHOIS.');
  }
};
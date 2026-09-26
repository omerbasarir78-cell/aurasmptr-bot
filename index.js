const mineflayer = require('mineflayer');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('AuraSmpTR AFK Botu Aktif!'));
app.listen(PORT, () => console.log(`Web sunucusu ${PORT} portunda çalışıyor.`));

const SUNUCU_IP = 'ramp-lexington.tun.ply.gg'; // IP Adresini yaz
const SUNUCU_PORT = 25565;
const BOT_SIFRE = 'AuraBot123456';

function createBot() {
  console.log('Bota bağlanılıyor...');
  const bot = mineflayer.createBot({
    host: SUNUCU_IP,
    port: SUNUCU_PORT,
    username: 'AuraBot_724',
    version: false
  });

  let isLoggedIn = false;

  bot.on('windowOpen', async (window) => {
    try { await bot.closeWindow(window); } catch (e) {}
  });

  bot.on('spawn', () => {
    console.log('Bot sunucuya katıldı. Giriş bekleniyor...');

    // Giriş yapana kadar hareketsiz kalsın
    setTimeout(() => bot.chat(`/register ${aurasmp123456} ${aurasmp123456}`), 2000);
    setTimeout(() => bot.chat(`/login ${aurasmp123456}`), 4000);

    // Giriş yaptıktan 6 saniye sonra Anti-AFK başlat (GrimAC tetiklenmesin)
    setTimeout(() => {
      isLoggedIn = true;
      console.log('Giriş tamamlandı, Anti-AFK aktif.');
    }, 6000);
  });

  // Anti-AFK Döngüsü (Yalnızca giriş yaptıktan sonra çalışır)
  setInterval(() => {
    if (!isLoggedIn) return;

    // Sadece hafif başını çevirsin (Zıplama GrimAC'ye takılabilir)
    const yaw = Math.random() * Math.PI * 2;
    const pitch = (Math.random() - 0.5) * 0.5;
    bot.look(yaw, pitch, true);
  }, 30000);

  bot.on('message', (message) => {
    const msg = message.toString();
    if (msg.includes('/login')) bot.chat(`/login ${aurasmp123456}`);
    if (msg.includes('/register')) bot.chat(`/register ${aurasmp123456} ${aurasmp123456}`);
  });

  bot.on('end', () => {
    isLoggedIn = false;
    console.log('Bağlantı koptu, tekrar deneniyor...');
    setTimeout(createBot, 10000);
  });

  bot.on('error', (err) => console.log('Hata:', err));
}

createBot();

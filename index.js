const mineflayer = require('mineflayer');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('AuraSmpTR AFK Botu Aktif!'));
app.listen(PORT, () => console.log(`Web sunucusu ${PORT} portunda çalışıyor.`));

// SUNUCU BİLGİLERİ
const SUNUCU_IP = 'SUNUCU_IP_ADRESI'; // Buraya sunucu IP'ni yaz
const SUNUCU_PORT = 25565;
const BOT_SIFRE = 'aurasmp123456';    // Tırnak içinde şifreniz

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
    console.log('Bot sunucuya katıldı. Giriş yapılıyor...');

    setTimeout(() => bot.chat(`/register ${BOT_SIFRE} ${BOT_SIFRE}`), 2000);
    setTimeout(() => bot.chat(`/login ${BOT_SIFRE}`), 4000);

    setTimeout(() => {
      isLoggedIn = true;
      console.log('Giriş tamamlandı, Anti-AFK aktif.');
    }, 6000);
  });

  setInterval(() => {
    if (!isLoggedIn) return;
    const yaw = Math.random() * Math.PI * 2;
    const pitch = (Math.random() - 0.5) * 0.5;
    bot.look(yaw, pitch, true);
  }, 30000);

  bot.on('message', (message) => {
    const msg = message.toString();
    // Tırnak işaretleri ve değişken kullanımı düzeltildi:
    if (msg.includes('/login')) bot.chat(`/login ${BOT_SIFRE}`);
    if (msg.includes('/register')) bot.chat(`/register ${BOT_SIFRE} ${BOT_SIFRE}`);
  });

  bot.on('end', () => {
    isLoggedIn = false;
    console.log('Bağlantı koptu, 10 saniye sonra tekrar deneniyor...');
    setTimeout(createBot, 10000);
  });

  bot.on('error', (err) => console.log('Hata:', err));
}

createBot();

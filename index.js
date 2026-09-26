const mineflayer = require('mineflayer');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('AuraSmpTR AFK Botu Aktif!'));
app.listen(PORT, () => console.log(`Web sunucusu ${PORT} portunda çalışıyor.`));

// SUNUCU BİLGİLERİ
const SUNUCU_IP = 'ramp-lexington.tun.ply.gg'; // Kendi sunucu IP'ni buraya yaz
const SUNUCU_PORT = 25565;            // Port farklıysa değiştir
const BOT_SIFRE = 'AuraBot123456';    // Botun AuthMe şifresi

function createBot() {
  console.log('Bota bağlanılıyor...');
  const bot = mineflayer.createBot({
    host: SUNUCU_IP,
    port: SUNUCU_PORT,
    username: 'AuraBot_724',
    version: false
  });

  // Önüne herhangi bir envanter/örs/ekran açılırsa hemen kapatır
  bot.on('windowOpen', async (window) => {
    console.log('Ekran/GUI algılandı, kapatılıyor...');
    try {
      await bot.closeWindow(window);
    } catch (err) {
      // Zaten kapandıysa hata vermesini engelle
    }
  });

  // Oyuna katıldığında giriş denemeleri yapar
  bot.on('spawn', () => {
    console.log('Bot sunucuya katıldı. Giriş komutları gönderiliyor...');

    // Saniyelik aralıklarla komutları gönderir (Önce kayıt, sonra giriş)
    setTimeout(() => bot.chat(`/register ${BOT_SIFRE} ${BOT_SIFRE}`), 1500);
    setTimeout(() => bot.chat(`/login ${BOT_SIFRE}`), 3000);
    setTimeout(() => bot.chat(`/login ${BOT_SIFRE}`), 5000);

    // Anti-AFK (Her 25 saniyede bir zıplar ve bakar)
    setInterval(() => {
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 400);

      const yaw = Math.random() * Math.PI * 2;
      const pitch = (Math.random() - 0.5) * Math.PI;
      bot.look(yaw, pitch, true);
    }, 25000);
  });

  // Sohbetten gelen mesajları dinler
  bot.on('message', (message) => {
    const msg = message.toString();
    // Eğer AuthMe tekrar /login veya /register isterse anında yanıtlar
    if (msg.includes('/login')) {
      bot.chat(`/login ${BOT_SIFRE}`);
    } else if (msg.includes('/register')) {
      bot.chat(`/register ${BOT_SIFRE} ${BOT_SIFRE}`);
    }
  });

  bot.on('end', () => {
    console.log('Bağlantı koptu. 10 saniye sonra tekrar bağlanılıyor...');
    setTimeout(createBot, 10000);
  });

  bot.on('error', (err) => console.log('Hata:', err));
}

createBot();

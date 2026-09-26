const mineflayer = require('mineflayer');
const express = require('express');

// Web sunucusu (Botun 7/24 uyanık kalmasını sağlar)
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('AuraSmpTR AFK Botu Aktif!');
});

app.listen(PORT, () => {
  console.log(`Web sunucusu ${PORT} portunda çalışıyor.`);
});

// Bot Ayarları
const botOptions = {
  host: 'ramp-lexington.tun.ply.gg', // Buraya MC Sunucu IP adresini yaz
  port: 25565,              // Portun farklıysa değiştir
  username: 'aurasmptr',  // Botun oyundaki adı
  version: false            // Sunucu sürümünü otomatik algılar
};

function createBot() {
  console.log('Bota bağlanılıyor...');
  const bot = mineflayer.createBot(botOptions);

  // Oyuna girince çalışacak kısım (Anti-AFK)
  bot.on('spawn', () => {
    console.log('Bot sunucuya başarıyla katıldı!');
    
    // Her 30 saniyede bir zıplayarak ve hafif dönerek Anti-AFK yapar
    setInterval(() => {
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 500);
      
      // Rastgele bakış yönü değiştir
      const yaw = Math.random() * Math.PI * 2;
      const pitch = (Math.random() - 0.5) * Math.PI;
      bot.look(yaw, pitch, true);
    }, 30000);
  });

  // Bot oyundan düşerse veya sunucu kapanırsa otomatik yeniden bağlanır
  bot.on('end', () => {
    console.log('Botun bağlantısı kesildi. 10 saniye sonra tekrar bağlanıyor...');
    setTimeout(createBot, 10000);
  });

  bot.on('error', (err) => {
    console.log('Hata oluştu:', err);
  });
}

createBot();
const TelegramBot = require('node-telegram-bot-api');

const token = '8306953306:AAEBzDdHEHC8ZWjQAz6RGO4jXm4DmJwOJgc';
const bot = new TelegramBot(token, { polling: true });

// Minimaler Test
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  
  console.log('Empfangen: /start von Chat:', chatId);
  
  // Super einfache Nachricht ohne jegliche Formatierung
  bot.sendMessage(chatId, 'Test123')
    .then(() => {
      console.log('Nachricht erfolgreich gesendet!');
    })
    .catch((error) => {
      console.error('Fehler:', error.message);
    });
});

bot.on('polling_error', (error) => {
  console.log('Polling Error:', error.message);
});

console.log('Minimaler Test-Bot gestartet...'); 
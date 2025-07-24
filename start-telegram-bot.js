const { execSync } = require('child_process');
const path = require('path');

console.log('🤖 Starte SNTTRADES Telegram Bot...');

try {
  // Kompiliere TypeScript zu JavaScript
  console.log('📦 Kompiliere TypeScript...');
  execSync('npx tsc telegram-bot/bot.ts --outDir telegram-bot/dist --target es2020 --module commonjs --moduleResolution node --esModuleInterop --allowSyntheticDefaultImports --skipLibCheck', {
    stdio: 'inherit'
  });

  // Starte den Bot
  console.log('🚀 Starte Telegram Bot...');
  execSync('node telegram-bot/dist/bot.js', {
    stdio: 'inherit'
  });

} catch (error) {
  console.error('❌ Fehler beim Starten des Telegram Bots:', error.message);
  process.exit(1);
} 
import TelegramBot from 'node-telegram-bot-api';

const token = '8306953306:AAEBzDdHEHC8ZWjQAz6RGO4jXm4DmJwOJgc';
const bot = new TelegramBot(token, { polling: true });

// Speichere User-Sessions für Tracking
const userSessions = new Map<number, { stage: 'start' | 'selection' | 'payment' | 'completed' }>();

// Startnachricht
const welcomeMessage = ` HERZLICH WILLKOMMEN BEI SNTTRADES,

Diese Entscheidung wird dein *Leben verändern – das verspreche ich dir!
Warum? Ganz einfach: Was du bei uns lernen wirst, ist unbezahlbar:

Ausführlicher Video-Kurs übers Trading und unsere eigene *Trading-Strategie! 👇*

✅ - SCALPING MASTERCLASS (NEFS STRATEGIE)

✅ - ÜBER 40+ VIDEOS. (STÄNDIG NEU ERSCHEINENDES LERNMATERIAL)

✅ - RIESIGE COMMUNITY/GLEICH GESINNTE (≈1000 Nutzer)*

✅ - MEHRERE ZOOM CALLS IM MONAT (MINDSET/LIVETRADING/Q&A)

✅ - GEWINNSPIELE, PREISKRÖNUNGEN ETC.

🏆 Ich zeige dir, wie man erfolgreich tradet, worauf du achten musst, und geben dir wertvolle Tipps und Tricks. 

🎖Außerdem wirst du meine Strategie und meine Angehens weise, die ich Tag täglich am Markt anwende, lernen.
🎓 Über ≈1000 Mitglieder auf dem Discord, mit denen du dich täglich austauschen kannst. 

Das Ziel ist es die größte Trading FAMILIE Deutschlands zu werden.

Mach jetzt den ersten Schritt in eine erfolgreiche Zukunft! Schließ dich uns an und werde Teil der SNT Family. Dein Erfolg wartet nicht auf dich 👇👇👇👇`;
// Zweite Nachricht
const paymentMessage = `Fast geschafft! 😮‍💨
Als neues Mitglied hast du direkt Zugang zu unserer Trading Strategie, Community und der exklusiven Lern-Plattform`;

// Erfolgs-Nachricht nach Kauf
const successMessage = `Vielen Dank für dein Vertrauen! Jetzt geht´s richtig los!!! 🏆`;

// Bot Start Handler
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from?.id;

  if (!userId) return;

  console.log('Empfangen: /start von Chat:', chatId, 'User:', userId);

  // Setze User Session
  userSessions.set(userId, { stage: 'start' });

  // Sende Willkommensnachricht
  bot.sendMessage(chatId, welcomeMessage, { parse_mode: 'Markdown' })
    .then(() => {
      console.log('Willkommensnachricht erfolgreich gesendet!');
      
      // Sende Plan-Auswahl nach kurzer Verzögerung
      setTimeout(() => {
        bot.sendMessage(chatId, 'Wähle dein Abo-Modell:', {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: '📅 Monatlich - 59.99€',
                  callback_data: 'subscription_monthly'
                }
              ],
              [
                {
                  text: '💎 Lifetime - 367€', 
                  callback_data: 'subscription_lifetime'
                }
              ]
            ]
          }
        })
        .then(() => {
          console.log('Abo-Auswahl erfolgreich gesendet!');
          // Update Session
          userSessions.set(userId, { stage: 'selection' });
        })
        .catch((error) => {
          console.error('Fehler bei Abo-Auswahl:', error.message);
        });
      }, 2000);
    })
    .catch((error) => {
      console.error('Fehler bei Willkommensnachricht:', error.message);
    });
});

// Handler für Callback Queries (Button-Klicks)
bot.on('callback_query', async (query) => {
  const chatId = query.message?.chat.id;
  const userId = query.from.id;

  if (!chatId) return;

  try {
    if (query.data === 'subscription_monthly') {
      await bot.answerCallbackQuery(query.id);
      await bot.sendMessage(chatId, `${paymentMessage}

💰 **Monatliches Abo gewählt - 59.99€**
Perfekte Wahl für den flexiblen Einstieg!`, {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: 'PayPal',
                url: 'https://snttrades.de/checkout/monthly'
              }
            ],
            [
              {
                text: 'Kredit-/EC-Karte',
                url: 'https://snttrades.de/checkout/monthly'
              }
            ]
          ]
        },
        parse_mode: 'Markdown'
      });
      userSessions.set(userId, { stage: 'payment' });
      
    } else if (query.data === 'subscription_lifetime') {
      await bot.answerCallbackQuery(query.id);
      await bot.sendMessage(chatId, `${paymentMessage}

🏆 **Lifetime Abo gewählt - 367€**
Die beste Investition in deine Trading-Zukunft!`, {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: 'PayPal',
                url: 'https://snttrades.de/checkout/lifetime'
              }
            ],
            [
              {
                text: 'Kredit-/EC-Karte',
                url: 'https://snttrades.de/checkout/lifetime'
              }
            ]
          ]
        },
        parse_mode: 'Markdown'
      });
      userSessions.set(userId, { stage: 'payment' });
      
    } else if (query.data === 'dashboard') {
      await bot.answerCallbackQuery(query.id);
      await bot.sendMessage(chatId, 'Weiterleitung zum Dashboard...', {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: 'SNTTRADES Dashboard öffnen',
                url: 'https://www.snt-mentorship-platform.de'
              }
            ]
          ]
        }
      });
    } else if (query.data === 'cancel_subscription') {
      await bot.answerCallbackQuery(query.id);
      await bot.sendMessage(chatId, 'Diese Funktion steht aktuell nicht zur Verfügung. Bitte schreibe eine Mail an: info@snttrades.de');
    }
  } catch (error) {
    console.error('Fehler beim Verarbeiten der Callback Query:', error);
  }
});

// Funktion zum Senden der Erfolgs-Nachricht (wird von Webhook aufgerufen)
export async function sendSuccessMessage(userId: number) {
  try {
    const session = userSessions.get(userId);
    if (!session || session.stage === 'completed') {
      return; // Verhindere doppelte Nachrichten
    }

    await bot.sendMessage(userId, successMessage, {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'SNTTRADES Dashboard',
              callback_data: 'dashboard'
            },
            {
              text: 'Abo kündigen',
              callback_data: 'cancel_subscription'
            }
          ]
        ]
      }
    });

    // Update Session
    userSessions.set(userId, { stage: 'completed' });

  } catch (error) {
    console.error('Fehler beim Senden der Erfolgs-Nachricht:', error);
  }
}

// Export für externe Verwendung
export { bot };

// Fehlerbehandlung
bot.on('polling_error', (error) => {
  console.log('Polling Error:', error);
});

console.log('SNTTRADES Telegram Bot ist gestartet!'); 
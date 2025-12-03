import { NextRequest, NextResponse } from 'next/server';
import { sendMessage, getUserSession, setUserSession } from '@/lib/telegram';
import { pricingConfig, isDiscountActive } from '@/config/pricing-config';

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;

// Dynamische Nachrichten basierend auf Rabatt-Status
function getWelcomeMessage() {
  const discountActive = isDiscountActive();
  const pricing = discountActive ? pricingConfig.discount : pricingConfig.standard;
  
  if (discountActive) {
    return `🚨 *50% RABATT AUF ALLE PLÄNE - SPARE BIS ZU ${pricing.lifetime.savingsAmount}* 🚨

*SNT TRADING AUSBILDUNG* 📊

HERZLICH WILLKOMMEN BEI SNTTRADES,

Diese Entscheidung wird dein Leben verändern – das verspreche ich dir!

*Warum?* Ganz einfach: Was du bei uns lernen wirst, ist unbezahlbar:

Ausführlicher Video-Kurs übers Trading und unsere eigene Trading-Strategie! 👇

✅ - SCALPING MASTERCLASS (NEFS STRATEGIE)

✅ - DAYTRADING MASTERCLASS

✅ - ÜBER 40+ VIDEOS. (STÄNDIG NEU ERSCHEINENDES LERNMATERIAL)

✅ - RIESIGE COMMUNITY/GLEICH GESINNTE

✅ - 3-4 ZOOM CALLS IN DER WOCHE (MINDSET/LIVETRADING/Q&A)

✅ - GEWINNSPIELE, PREISKRÖNUNGEN ETC.

🏆 Ich zeige dir, wie man erfolgreich tradet, worauf du achten musst, und geben dir wertvolle Tipps und Tricks. 

🎖Außerdem wirst du meine Strategie und meine Angehens weise, die ich Tag täglich am Markt anwende, lernen.

Mach jetzt den ersten Schritt in eine erfolgreiche Zukunft! Schließ dich uns an und werde Teil der SNT Family. Dein Erfolg wartet nicht auf dich 👇

*DAS ABO IST JEDERZEIT KÜNDBAR. KEINE VERSTECKTEN FRISTEN.*`;
  }
  
  return `*SNT TRADING AUSBILDUNG* 📊

HERZLICH WILLKOMMEN BEI SNTTRADES,

Diese Entscheidung wird dein Leben verändern – das verspreche ich dir!

*Warum?* Ganz einfach: Was du bei uns lernen wirst, ist unbezahlbar:

Ausführlicher Video-Kurs übers Trading und unsere eigene Trading-Strategie! 👇

✅ - SCALPING MASTERCLASS (NEFS STRATEGIE)

✅ - DAYTRADING MASTERCLASS

✅ - ÜBER 40+ VIDEOS. (STÄNDIG NEU ERSCHEINENDES LERNMATERIAL)

✅ - RIESIGE COMMUNITY/GLEICH GESINNTE

✅ - 3-4 ZOOM CALLS IN DER WOCHE (MINDSET/LIVETRADING/Q&A)

✅ - GEWINNSPIELE, PREISKRÖNUNGEN ETC.

🏆 Ich zeige dir, wie man erfolgreich tradet, worauf du achten musst, und geben dir wertvolle Tipps und Tricks. 

🎖Außerdem wirst du meine Strategie und meine Angehens weise, die ich Tag täglich am Markt anwende, lernen.

Mach jetzt den ersten Schritt in eine erfolgreiche Zukunft! Schließ dich uns an und werde Teil der SNT Family. Dein Erfolg wartet nicht auf dich 👇

*DAS ABO IST JEDERZEIT KÜNDBAR. KEINE VERSTECKTEN FRISTEN.*`;
}

function getButtonLabels() {
  const discountActive = isDiscountActive();
  const pricing = discountActive ? pricingConfig.discount : pricingConfig.standard;
  
  const formatPrice = (price: number) => {
    return price % 1 === 0 ? `${price}€` : `${price.toFixed(2).replace('.', ',')}€`;
  };
  
  if (discountActive) {
    return {
      monthly: `Monatlich ${formatPrice(pricing.monthly.price)} (anstatt ${formatPrice(pricing.monthly.originalPrice!)})`,
      lifetime: `Lifetime ${formatPrice(pricing.lifetime.price)} (anstatt ${formatPrice(pricing.lifetime.originalPrice!)})`
    };
  }
  
  return {
    monthly: `Monatlich ${formatPrice(pricing.monthly.price)}`,
    lifetime: `Lifetime ${formatPrice(pricing.lifetime.price)} (Einmalig)`
  };
}

const paymentMessage = `Fast geschafft! 😮‍💨
Als neues Mitglied hast du direkt Zugang zu unserer Trading Strategie, Community und der exklusiven Lern-Plattform`;

const successMessage = `Herzlich willkommen bei SNT-ELITE! 🏆

Deine Zugangsdaten hast du per E-Mail erhalten.

Die Plattform findest du unter: snt-elite-platform.de`;

// Hilfsfunktion für Callback Query Antworten
async function answerCallbackQuery(callbackQueryId: string) {
  await fetch(`${TELEGRAM_API}/answerCallbackQuery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ callback_query_id: callbackQueryId })
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const pricing = isDiscountActive() ? pricingConfig.discount : pricingConfig.standard;
    const buttonLabels = getButtonLabels();
    
    const formatPrice = (price: number) => {
      return price % 1 === 0 ? `${price}€` : `${price.toFixed(2).replace('.', ',')}€`;
    };
    
    // Handle normale Nachrichten
    if (body.message) {
      const { chat, from, text } = body.message;
      const chatId = chat.id;
      const userId = from.id;

      if (text === '/start') {
        console.log('Empfangen: /start von Chat:', chatId, 'User:', userId);
        
        // Setze User Session
        setUserSession(userId, { stage: 'start' });

        // Sende Willkommensnachricht mit Buttons
        await sendMessage(chatId, getWelcomeMessage(), {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [{ text: buttonLabels.monthly, url: `https://www.snttrades.de/checkout/monthly?telegram_user_id=${userId}` }],
              [{ text: buttonLabels.lifetime, url: `https://www.snttrades.de/checkout/lifetime?telegram_user_id=${userId}` }]
            ]
          }
        });

        // Setze User Session
        setUserSession(userId, { stage: 'selection' });
      }
    }

    // Handle Callback Queries (Button-Klicks)
    if (body.callback_query) {
      const { data, from, message } = body.callback_query;
      const chatId = message.chat.id;
      const userId = from.id;

      await answerCallbackQuery(body.callback_query.id);

      if (data === 'subscription_monthly') {
        await sendMessage(chatId, `${paymentMessage}

💰 **Monatliches Abo gewählt - ${formatPrice(pricing.monthly.price)}**
Perfekte Wahl für den flexiblen Einstieg!`, {
          reply_markup: {
            inline_keyboard: [
              [{ text: 'Jetzt kaufen', url: `https://www.snttrades.de/checkout/monthly?telegram_user_id=${userId}` }]
            ]
          },
          parse_mode: 'Markdown'
        });
        setUserSession(userId, { stage: 'payment' });

      } else if (data === 'subscription_lifetime') {
        await sendMessage(chatId, `${paymentMessage}

🏆 **Lifetime Abo gewählt - ${formatPrice(pricing.lifetime.price)}**
Die beste Investition in deine Trading-Zukunft!`, {
          reply_markup: {
            inline_keyboard: [
              [{ text: 'Jetzt kaufen', url: `https://www.snttrades.de/checkout/lifetime?telegram_user_id=${userId}` }]
            ]
          },
          parse_mode: 'Markdown'
        });
        setUserSession(userId, { stage: 'payment' });
      }
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

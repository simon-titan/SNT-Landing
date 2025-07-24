import { NextRequest, NextResponse } from 'next/server';

const TELEGRAM_TOKEN = '8306953306:AAEBzDdHEHC8ZWjQAz6RGO4jXm4DmJwOJgc';
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;

// Speichere User-Sessions (in Production solltest du eine Datenbank verwenden)
const userSessions = new Map<number, { stage: 'start' | 'selection' | 'payment' | 'completed' }>();

// Nachrichten
const welcomeMessage = `### HERZLICH WILLKOMMEN BEI SNTTRADES,

Diese Entscheidung wird dein *Leben verändern* – **das verspreche ich dir!**
**Warum?** Ganz einfach: Was du bei uns lernen wirst, ist *unbezahlbar:*

Ausführlicher *Video-Kurs* übers *Trading* und unsere eigene *Trading-Strategie! 👇*

✅ *- SCALPING MASTERCLASS (NEFS STRATEGIE)*

✅ *- ÜBER 40+ VIDEOS. (STÄNDIG NEU ERSCHEINENDES LERNMATERIAL)*

✅ *- RIESIGE COMMUNITY/GLEICH GESINNTE (≈1000 Nutzer)* 

✅ *- MEHRERE ZOOM CALLS IM MONAT (MINDSET/LIVETRADING/Q&A)*

✅ *- GEWINNSPIELE, PREISKRÖNUNGEN ETC.*

🏆 Ich zeige dir, wie man *erfolgreich tradet, worauf du achten musst, und geben dir wertvolle* **Tipps und Tricks**. 

🎖Außerdem wirst du *meine Strategie* und meine Angehens weise, die ich *Tag täglich am Markt anwende*, lernen.
🎓 Über *≈1000 Mitglieder* auf dem Discord, mit denen du dich täglich austauschen kannst. 

Das Ziel ist es die größte *Trading FAMILIE Deutschlands* zu werden.

*Mach jetzt den ersten Schritt in eine erfolgreiche Zukunft! Schließ dich uns an und werde Teil der SNT Family. Dein Erfolg wartet nicht auf dich* 👇👇👇👇`;

const paymentMessage = `Fast geschafft! 😮‍💨
Als neues Mitglied hast du direkt Zugang zu unserer Trading Strategie, Community und der exklusiven Lern-Plattform`;

const successMessage = `Vielen Dank für dein Vertrauen! Jetzt geht´s richtig los!!! 🏆`;

// Hilfsfunktion zum Senden von Nachrichten
async function sendMessage(chatId: number, text: string, options?: any) {
  const response = await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      ...options
    })
  });
  return response.json();
}

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
    
    // Handle normale Nachrichten
    if (body.message) {
      const { chat, from, text } = body.message;
      const chatId = chat.id;
      const userId = from.id;

      if (text === '/start') {
        console.log('Empfangen: /start von Chat:', chatId, 'User:', userId);
        
        // Setze User Session
        userSessions.set(userId, { stage: 'start' });

        // Sende Willkommensnachricht
        await sendMessage(chatId, welcomeMessage, { parse_mode: 'Markdown' });

        // Sende Plan-Auswahl
        setTimeout(async () => {
          await sendMessage(chatId, 'Wähle dein Abo-Modell:', {
            reply_markup: {
              inline_keyboard: [
                [{ text: '📅 Monatlich - 59.99€', callback_data: 'subscription_monthly' }],
                [{ text: '💎 Lifetime - 367€', callback_data: 'subscription_lifetime' }]
              ]
            }
          });
          userSessions.set(userId, { stage: 'selection' });
        }, 2000);
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

💰 **Monatliches Abo gewählt - 59.99€**
Perfekte Wahl für den flexiblen Einstieg!`, {
          reply_markup: {
            inline_keyboard: [
              [{ text: 'PayPal', url: 'https://snttrades.de/checkout?plan=monthly' }],
              [{ text: 'Kredit-/EC-Karte', url: 'https://snttrades.de/checkout?plan=monthly' }]
            ]
          },
          parse_mode: 'Markdown'
        });
        userSessions.set(userId, { stage: 'payment' });

      } else if (data === 'subscription_lifetime') {
        await sendMessage(chatId, `${paymentMessage}

🏆 **Lifetime Abo gewählt - 367€**
Die beste Investition in deine Trading-Zukunft!`, {
          reply_markup: {
            inline_keyboard: [
              [{ text: 'PayPal', url: 'https://snttrades.de/checkout?plan=lifetime' }],
              [{ text: 'Kredit-/EC-Karte', url: 'https://snttrades.de/checkout?plan=lifetime' }]
            ]
          },
          parse_mode: 'Markdown'
        });
        userSessions.set(userId, { stage: 'payment' });

      } else if (data === 'dashboard') {
        await sendMessage(chatId, 'Weiterleitung zum Dashboard...', {
          reply_markup: {
            inline_keyboard: [
              [{ text: 'SNTTRADES Dashboard öffnen', url: 'https://www.snt-mentorship-platform.de' }]
            ]
          }
        });

      } else if (data === 'cancel_subscription') {
        await sendMessage(chatId, 'Diese Funktion steht aktuell nicht zur Verfügung. Bitte schreibe eine Mail an: info@snttrades.de');
      }
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Funktion zum Senden der Erfolgs-Nachricht (für externe API calls)
export async function sendSuccessMessageWebhook(userId: number) {
  try {
    const session = userSessions.get(userId);
    if (!session || session.stage === 'completed') {
      return;
    }

    await sendMessage(userId, successMessage, {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'SNTTRADES Dashboard', callback_data: 'dashboard' }],
          [{ text: 'Abo kündigen', callback_data: 'cancel_subscription' }]
        ]
      }
    });

    userSessions.set(userId, { stage: 'completed' });
  } catch (error) {
    console.error('Fehler beim Senden der Erfolgs-Nachricht:', error);
  }
} 
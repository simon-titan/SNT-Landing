import { NextRequest, NextResponse } from 'next/server';
import { getUserSession, setUserSession } from '@/lib/telegram';
import { pricingConfig, isDiscountActive } from '@/config/pricing-config';

const TELEGRAM_API_BASE = "https://api.telegram.org/bot";
const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export interface TelegramUser {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

export interface TelegramMessage {
  message_id: number;
  from?: TelegramUser;
  chat: {
    id: number;
    type: string;
    title?: string;
    username?: string;
    first_name?: string;
    last_name?: string;
  };
  date: number;
  text?: string;
  entities?: Array<{
    type: string;
    offset: number;
    length: number;
  }>;
}

export interface TelegramCallbackQuery {
  id: string;
  from: TelegramUser;
  message?: TelegramMessage;
  data?: string;
}

export interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
  callback_query?: TelegramCallbackQuery;
}

export interface InlineKeyboardButton {
  text: string;
  url?: string;
  callback_data?: string;
}

export interface SendMessageOptions {
  chat_id: number | string;
  text: string;
  parse_mode?: "Markdown" | "MarkdownV2" | "HTML";
  reply_markup?: {
    inline_keyboard?: InlineKeyboardButton[][];
  };
  disable_web_page_preview?: boolean;
}

// ==========================================
// CORE API FUNCTIONS
// ==========================================

/**
 * Macht einen API-Call zum Telegram Bot API
 */
async function telegramApiCall<T>(
  method: string,
  params?: object
): Promise<T> {
  if (!TELEGRAM_TOKEN) {
    throw new Error("TELEGRAM_BOT_TOKEN ist nicht konfiguriert");
  }

  const url = `${TELEGRAM_API_BASE}${TELEGRAM_TOKEN}/${method}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: params ? JSON.stringify(params) : undefined,
  });

  const data = await response.json();

  if (!data.ok) {
    console.error(`Telegram API Error (${method}):`, data);
    throw new Error(`Telegram API Error: ${data.description || "Unknown error"}`);
  }

  return data.result as T;
}

/**
 * Sendet eine Nachricht
 */
async function sendMessage(options: SendMessageOptions): Promise<TelegramMessage> {
  return telegramApiCall<TelegramMessage>("sendMessage", options);
}

/**
 * Beantwortet einen Callback Query (für Inline-Buttons)
 */
async function answerCallbackQuery(
  callbackQueryId: string,
  text?: string,
  showAlert = false
): Promise<boolean> {
  return telegramApiCall<boolean>("answerCallbackQuery", {
    callback_query_id: callbackQueryId,
    text,
    show_alert: showAlert,
  });
}

// ==========================================
// MESSAGE TEMPLATES
// ==========================================

/**
 * Hilfsfunktion zur Preisfomatierung
 */
function formatPrice(price: number): string {
  return price % 1 === 0 ? `${price}€` : `${price.toFixed(2).replace('.', ',')}€`;
}

/**
 * Holt Button-Labels basierend auf Rabatt-Status
 */
function getButtonLabels(): { monthly: string; quarterly: string; annual: string } {
  const discountActive = isDiscountActive();
  const pricing = discountActive ? pricingConfig.discount : pricingConfig.standard;

  return {
    monthly: `Monatlich ${formatPrice(pricing.monthly.price)}`,
    quarterly: `Quartal ${formatPrice(pricing.quarterly.price)}`,
    annual: `Jährlich ${formatPrice(pricing.annual.price)}`
  };
}

/**
 * Willkommensnachricht für /start
 */
function getWelcomeMessage(userId: number): SendMessageOptions {
  const buttonLabels = getButtonLabels();

  return {
    chat_id: userId,
    text: getWelcomeMessageText(),
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: buttonLabels.monthly, url: `https://www.snttrades.de/checkout/monthly?telegram_user_id=${userId}` }],
        [{ text: buttonLabels.quarterly, url: `https://www.snttrades.de/checkout/quarterly?telegram_user_id=${userId}` }],
        [{ text: buttonLabels.annual, url: `https://www.snttrades.de/checkout/annual?telegram_user_id=${userId}` }]
      ]
    }
  };
}

/**
 * Willkommensnachricht-Text (getrennt für bessere Übersichtlichkeit)
 */
function getWelcomeMessageText(): string {
  const discountActive = isDiscountActive();

  if (discountActive) {
    return `

SNT MENTORSHIP 📊

HERZLICH WILLKOMMEN BEI SNTTRADES,

Diese Entscheidung wird dein Leben verändern – das verspreche ich dir!

Warum? Ganz einfach: Was du bei uns lernen wirst, ist unbezahlbar:

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

DAS ABO IST JEDERZEIT KÜNDBAR. KEINE VERSTECKTEN FRISTEN.`;
  }

  return `*SNT MENTORSHIP* 📊

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

/**
 * Payment-Nachricht für Abonnement-Auswahl
 */
function getPaymentMessage(
  planType: 'monthly' | 'quarterly' | 'annual',
  userId: number
): SendMessageOptions {
  const discountActive = isDiscountActive();
  const pricing = discountActive ? pricingConfig.discount : pricingConfig.standard;

  const planNames = {
    monthly: 'Monatliches Abo',
    quarterly: 'Quartals-Abo',
    annual: 'Jahres-Abo'
  };

  const planDescriptions = {
    monthly: 'Perfekte Wahl für den flexiblen Einstieg!',
    quarterly: 'Gute Balance zwischen Flexibilität und Ersparnis!',
    annual: 'Die beste Investition in deine Trading-Zukunft - Maximale Ersparnis!'
  };

  const checkoutUrls = {
    monthly: `https://www.snttrades.de/checkout/monthly?telegram_user_id=${userId}`,
    quarterly: `https://www.snttrades.de/checkout/quarterly?telegram_user_id=${userId}`,
    annual: `https://www.snttrades.de/checkout/annual?telegram_user_id=${userId}`
  };

  return {
    chat_id: userId,
    text: `Fast geschafft! 😮‍💨
Als neues Mitglied hast du direkt Zugang zu unserer Trading Strategie, Community und der exklusiven Lern-Plattform

💰 **${planNames[planType]} gewählt - ${formatPrice(pricing[planType].price)}**
${planDescriptions[planType]}`,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Jetzt kaufen', url: checkoutUrls[planType] }]
      ]
    }
  };
}

/**
 * Erfolgsnachricht nach Zahlung
 */
function getSuccessMessage(userId: number): SendMessageOptions {
  return {
    chat_id: userId,
    text: `Herzlich willkommen bei SNT-ELITE! 🏆

Deine Zugangsdaten hast du per E-Mail erhalten.

Die Plattform findest du unter: snt-elite-platform.de`,
    parse_mode: "Markdown"
  };
}

// ==========================================
// WEBHOOK HANDLER
// ==========================================

/**
 * Behandelt eingehende Telegram-Updates
 */
export async function POST(request: NextRequest) {
  try {
    const update: TelegramUpdate = await request.json();

    // Handle normale Nachrichten
    if (update.message) {
      await handleMessage(update.message);
    }

    // Handle Callback Queries (Button-Klicks)
    if (update.callback_query) {
      await handleCallbackQuery(update.callback_query);
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * Behandelt eingehende Nachrichten
 */
async function handleMessage(message: TelegramMessage): Promise<void> {
  const { chat, from, text } = message;
  const chatId = chat.id;
  const userId = from!.id;

  if (text === '/start') {
    console.log('Empfangen: /start von Chat:', chatId, 'User:', userId);

    // Setze User Session
    setUserSession(userId, { stage: 'start' });

    // Sende Willkommensnachricht mit Buttons
    await sendMessage(getWelcomeMessage(userId));

    // Setze User Session
    setUserSession(userId, { stage: 'selection' });
  }
}

/**
 * Behandelt Callback Queries (Inline-Button-Klicks)
 */
async function handleCallbackQuery(callbackQuery: TelegramCallbackQuery): Promise<void> {
  const { data, from, message } = callbackQuery;
  const userId = from.id;

  // Antworte auf die Callback Query
  await answerCallbackQuery(callbackQuery.id);

  // Bestimme den Plan-Typ aus den Callback-Daten
  const planTypeMap: { [key: string]: 'monthly' | 'quarterly' | 'annual' } = {
    'subscription_monthly': 'monthly',
    'subscription_quarterly': 'quarterly',
    'subscription_annual': 'annual'
  };

  const planType = planTypeMap[data!];
  if (planType) {
    // Sende entsprechende Payment-Nachricht
    await sendMessage(getPaymentMessage(planType, userId));

    // Setze User Session
    setUserSession(userId, { stage: 'payment' });
  }
}

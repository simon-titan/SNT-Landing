/**
 * Telegram Paid Group Bot
 * 
 * Separater Bot für die bezahlte Telegram-Gruppe.
 * WICHTIG: Dieser Code ist komplett unabhängig vom bestehenden Bot!
 * 
 * Verwendet: TELEGRAM_PAID_TOKEN und GROUP_ID aus env.local
 */

const TELEGRAM_API_BASE = "https://api.telegram.org/bot";

// Environment Variables
const BOT_TOKEN = process.env.TELEGRAM_PAID_TOKEN;
const GROUP_ID = process.env.GROUP_ID;

// Plan IDs
export const TELEGRAM_PLANS = {
  outseta: "ZmNM7ZW2",
  paypal: "7ma8lrWE",
};

// Types
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
  my_chat_member?: {
    chat: TelegramMessage["chat"];
    from: TelegramUser;
    date: number;
    old_chat_member: { user: TelegramUser; status: string };
    new_chat_member: { user: TelegramUser; status: string };
  };
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
  if (!BOT_TOKEN) {
    throw new Error("TELEGRAM_PAID_TOKEN ist nicht konfiguriert");
  }

  const url = `${TELEGRAM_API_BASE}${BOT_TOKEN}/${method}`;
  
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
export async function sendMessage(options: SendMessageOptions): Promise<TelegramMessage> {
  return telegramApiCall<TelegramMessage>("sendMessage", options);
}

/**
 * Beantwortet einen Callback Query (für Inline-Buttons)
 */
export async function answerCallbackQuery(
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

/**
 * Bearbeitet eine bestehende Nachricht
 */
export async function editMessageText(
  chatId: number | string,
  messageId: number,
  text: string,
  parseMode?: "Markdown" | "MarkdownV2" | "HTML",
  replyMarkup?: { inline_keyboard: InlineKeyboardButton[][] }
): Promise<TelegramMessage | boolean> {
  return telegramApiCall<TelegramMessage | boolean>("editMessageText", {
    chat_id: chatId,
    message_id: messageId,
    text,
    parse_mode: parseMode,
    reply_markup: replyMarkup,
  });
}

// ==========================================
// GROUP MANAGEMENT FUNCTIONS
// ==========================================

/**
 * Holt die Gruppen-ID aus den Environment Variables
 */
export function getGroupId(): string {
  if (!GROUP_ID) {
    throw new Error("GROUP_ID ist nicht konfiguriert");
  }
  return GROUP_ID;
}

/**
 * Erstellt einen Einladungslink für die Gruppe
 */
export async function createInviteLink(
  expireDate?: number,
  memberLimit?: number
): Promise<{ invite_link: string; expire_date?: number; member_limit?: number }> {
  return telegramApiCall("createChatInviteLink", {
    chat_id: getGroupId(),
    expire_date: expireDate,
    member_limit: memberLimit,
  });
}

/**
 * Widerruft einen Einladungslink
 */
export async function revokeInviteLink(inviteLink: string): Promise<void> {
  await telegramApiCall("revokeChatInviteLink", {
    chat_id: getGroupId(),
    invite_link: inviteLink,
  });
}

/**
 * Fügt einen Nutzer zur Gruppe hinzu (Ban aufheben falls vorhanden)
 */
export async function unbanChatMember(userId: number): Promise<boolean> {
  try {
    return await telegramApiCall<boolean>("unbanChatMember", {
      chat_id: getGroupId(),
      user_id: userId,
      only_if_banned: true,
    });
  } catch (error) {
    console.error("Fehler beim Unban:", error);
    return false;
  }
}

/**
 * Entfernt einen Nutzer aus der Gruppe (Kick)
 */
export async function kickChatMember(userId: number, revokeMessages = false): Promise<boolean> {
  try {
    // Erst bannen
    await telegramApiCall<boolean>("banChatMember", {
      chat_id: getGroupId(),
      user_id: userId,
      revoke_messages: revokeMessages,
    });
    
    // Dann unbannen (damit der User später wieder joinen kann wenn er zahlt)
    await telegramApiCall<boolean>("unbanChatMember", {
      chat_id: getGroupId(),
      user_id: userId,
      only_if_banned: true,
    });
    
    return true;
  } catch (error) {
    console.error("Fehler beim Kick:", error);
    return false;
  }
}

/**
 * Bannt einen Nutzer permanent
 */
export async function banChatMember(userId: number, revokeMessages = false): Promise<boolean> {
  try {
    return await telegramApiCall<boolean>("banChatMember", {
      chat_id: getGroupId(),
      user_id: userId,
      revoke_messages: revokeMessages,
    });
  } catch (error) {
    console.error("Fehler beim Ban:", error);
    return false;
  }
}

/**
 * Prüft den Mitgliedschaftsstatus eines Nutzers
 */
export async function getChatMember(
  userId: number
): Promise<{ status: string; user: TelegramUser } | null> {
  try {
    return await telegramApiCall("getChatMember", {
      chat_id: getGroupId(),
      user_id: userId,
    });
  } catch (error) {
    console.error("Fehler beim Abrufen des Mitgliedsstatus:", error);
    return null;
  }
}

/**
 * Prüft ob ein Nutzer in der Gruppe ist
 */
export async function isUserInGroup(userId: number): Promise<boolean> {
  const member = await getChatMember(userId);
  if (!member) return false;
  
  // member, administrator, creator = in Gruppe
  // left, kicked, restricted = nicht in Gruppe
  return ["member", "administrator", "creator"].includes(member.status);
}

/**
 * Holt Informationen über die Gruppe
 */
export async function getChat(): Promise<{
  id: number;
  type: string;
  title?: string;
  username?: string;
}> {
  return telegramApiCall("getChat", {
    chat_id: getGroupId(),
  });
}

// ==========================================
// MESSAGE TEMPLATES
// ==========================================

/**
 * Willkommensnachricht für /start
 */
export function getWelcomeMessage(userId: number): SendMessageOptions {
  const checkoutUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "https://www.snttrades.de"}/telegram-checkout?telegram_user_id=${userId}`;
  
  return {
    chat_id: userId,
    text: `🚀 *Willkommen bei SNT Trades Premium!*

Du möchtest Zugang zu unserer exklusiven Trading-Signale Gruppe?

✅ Tägliche Trading Signale
✅ Entry, Stop-Loss & Take-Profit
✅ Exklusive Marktanalysen
✅ Community mit Gleichgesinnten

Klicke auf den Button unten um dein Abonnement zu starten:`,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "💳 Jetzt Mitglied werden", url: checkoutUrl }],
        [{ text: "❓ Hilfe", callback_data: "help" }],
      ],
    },
  };
}

/**
 * Hilfe-Nachricht
 */
export function getHelpMessage(userId: number): SendMessageOptions {
  return {
    chat_id: userId,
    text: `❓ *Hilfe & FAQ*

*Verfügbare Befehle:*
/start - Hauptmenü & Kauflink
/status - Dein Abo-Status prüfen
/manage - Abo verwalten
/help - Diese Hilfe anzeigen

*Häufige Fragen:*
• Wie funktionieren die Signale?
• Wie kann ich kündigen?
• Was kostet die Mitgliedschaft?

Schreibe einfach deine Frage und ich versuche zu helfen!

*Support:*
📧 support@snttrades.de`,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "🔙 Zurück zum Start", callback_data: "start" }],
      ],
    },
  };
}

/**
 * Status-Nachricht (Abo aktiv)
 */
export function getStatusActiveMessage(
  userId: number,
  expiresAt?: string
): SendMessageOptions {
  const manageUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "https://www.snttrades.de"}/telegram-account`;
  
  return {
    chat_id: userId,
    text: `✅ *Dein Abo-Status: AKTIV*

Du hast vollen Zugang zur Trading-Signale Gruppe!

${expiresAt ? `📅 Nächste Verlängerung: ${expiresAt}` : ""}

Möchtest du dein Abo verwalten?`,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "⚙️ Abo verwalten", url: manageUrl }],
      ],
    },
  };
}

/**
 * Status-Nachricht (kein Abo)
 */
export function getStatusInactiveMessage(userId: number): SendMessageOptions {
  const checkoutUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "https://www.snttrades.de"}/telegram-checkout?telegram_user_id=${userId}`;
  
  return {
    chat_id: userId,
    text: `❌ *Dein Abo-Status: INAKTIV*

Du hast aktuell kein aktives Abonnement.

Möchtest du Mitglied werden und Zugang zu unseren Trading-Signalen erhalten?`,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "💳 Jetzt Mitglied werden", url: checkoutUrl }],
      ],
    },
  };
}

/**
 * Nachricht nach erfolgreicher Zahlung
 */
export function getPaymentSuccessMessage(
  userId: number,
  inviteLink: string
): SendMessageOptions {
  return {
    chat_id: userId,
    text: `🎉 *Zahlung erfolgreich!*

Willkommen bei SNT Trades Premium!

Klicke auf den Button unten um der Gruppe beizutreten:`,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "🚀 Gruppe beitreten", url: inviteLink }],
      ],
    },
  };
}

/**
 * Nachricht bei Abo-Kündigung
 */
export function getCancellationMessage(userId: number): SendMessageOptions {
  const checkoutUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "https://www.snttrades.de"}/telegram-checkout?telegram_user_id=${userId}`;
  
  return {
    chat_id: userId,
    text: `😢 *Dein Abo wurde gekündigt*

Du wurdest aus der Trading-Signale Gruppe entfernt.

Wir würden uns freuen, dich wieder zu sehen! Du kannst jederzeit erneut Mitglied werden:`,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "🔄 Erneut Mitglied werden", url: checkoutUrl }],
      ],
    },
  };
}

/**
 * Verifizierungs-Nachricht
 */
export function getVerificationMessage(
  userId: number,
  verificationCode: string
): SendMessageOptions {
  return {
    chat_id: userId,
    text: `🔐 *Verifizierung erforderlich*

Um deine Telegram-Verknüpfung zu bestätigen, klicke auf den Button unten:

Dein Code: \`${verificationCode}\``,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "✅ Bestätigen", callback_data: `verify_${verificationCode}` }],
      ],
    },
  };
}

/**
 * Guten Morgen Nachricht (für Scheduler)
 */
export function getGoodMorningMessage(): string {
  const greetings = [
    "☀️ Guten Morgen Trader! Bereit für einen profitablen Tag?",
    "🌅 Guten Morgen! Die Märkte warten auf uns.",
    "☕ Guten Morgen! Zeit für Kaffee und Charts.",
    "🚀 Guten Morgen Team! Let's make some gains!",
    "🌞 Guten Morgen! Ein neuer Tag, neue Chancen.",
  ];
  
  return greetings[Math.floor(Math.random() * greetings.length)];
}

// ==========================================
// WEBHOOK MANAGEMENT
// ==========================================

/**
 * Setzt den Webhook für den Paid-Bot
 */
export async function setWebhook(webhookUrl: string): Promise<boolean> {
  return telegramApiCall<boolean>("setWebhook", {
    url: webhookUrl,
    allowed_updates: ["message", "callback_query", "my_chat_member"],
  });
}

/**
 * Löscht den Webhook
 */
export async function deleteWebhook(): Promise<boolean> {
  return telegramApiCall<boolean>("deleteWebhook", {
    drop_pending_updates: false,
  });
}

/**
 * Holt Webhook-Info
 */
export async function getWebhookInfo(): Promise<{
  url: string;
  has_custom_certificate: boolean;
  pending_update_count: number;
  last_error_date?: number;
  last_error_message?: string;
}> {
  return telegramApiCall("getWebhookInfo", {});
}

/**
 * Holt Bot-Info
 */
export async function getMe(): Promise<TelegramUser> {
  return telegramApiCall<TelegramUser>("getMe", {});
}

/**
 * Channel Bot - SNTTeleBot
 * 
 * Automatisierte und planbare Veröffentlichung von Nachrichten
 * in einem Telegram Kanal, steuerbar über den direkten Chat.
 */

import { supabaseAdmin } from "../supabase/client";

// ============================================
// Types
// ============================================

export interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
  callback_query?: CallbackQuery;
}

export interface TelegramMessage {
  message_id: number;
  from?: TelegramUser;
  chat: TelegramChat;
  date: number;
  text?: string;
  photo?: PhotoSize[];
  video?: Video;
  voice?: Voice;
  document?: Document;
  animation?: Animation;
  caption?: string;
}

export interface TelegramUser {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
}

export interface TelegramChat {
  id: number;
  type: "private" | "group" | "supergroup" | "channel";
  title?: string;
  username?: string;
}

export interface PhotoSize {
  file_id: string;
  file_unique_id: string;
  width: number;
  height: number;
  file_size?: number;
}

export interface Video {
  file_id: string;
  file_unique_id: string;
  width: number;
  height: number;
  duration: number;
  file_size?: number;
}

export interface Voice {
  file_id: string;
  file_unique_id: string;
  duration: number;
  file_size?: number;
}

export interface Document {
  file_id: string;
  file_unique_id: string;
  file_name?: string;
  mime_type?: string;
  file_size?: number;
}

export interface Animation {
  file_id: string;
  file_unique_id: string;
  width: number;
  height: number;
  duration: number;
  file_size?: number;
}

export interface CallbackQuery {
  id: string;
  from: TelegramUser;
  message?: TelegramMessage;
  data?: string;
}

export interface BotSession {
  id: string;
  telegram_user_id: number;
  telegram_username?: string;
  telegram_first_name?: string;
  is_authenticated: boolean;
  authenticated_at?: string;
  conversation_state: ConversationState;
  conversation_data: ConversationData;
  created_at: string;
  updated_at: string;
}

export type ConversationState = 
  | "idle"
  | "awaiting_login"
  | "awaiting_media"
  | "awaiting_schedule_time"
  | "awaiting_recurring_config"
  | "awaiting_delay_config"
  | "awaiting_confirmation";

export interface ConversationData {
  pending_media_type?: MediaType;
  pending_file_id?: string;
  pending_caption?: string;
  pending_text?: string;
  schedule_type?: "once" | "recurring";
  scheduled_time?: string;
  scheduled_date?: Date;
  recurring_pattern?: RecurringPattern;
  recurring_days?: number[];
  use_random_delay?: boolean;
  random_delay_minutes?: number;
}

export type MediaType = "photo" | "video" | "voice" | "document" | "animation" | "text";

export interface RecurringPattern {
  type: "daily" | "weekly" | "specific_days";
  time: string; // HH:MM format
  days?: number[]; // 0-6, 0 = Sonntag
}

export interface ScheduledMessage {
  id?: string;
  message_text?: string;
  media_type?: MediaType;
  media_file_id?: string;
  caption?: string;
  target_channel_id: string;
  scheduled_at: string;
  timezone: string;
  is_recurring: boolean;
  recurring_pattern?: string;
  recurring_time?: string;
  recurring_days?: number[];
  next_run_at?: string;
  random_delay_minutes: number;
  is_active: boolean;
  is_sent: boolean;
  bot_type: string;
  created_by?: string;
}

// ============================================
// Configuration
// ============================================

const BOT_TOKEN = process.env.TELEGRAM_AUTOMATISATION_BOT;
const BOT_PASSWORD = process.env.CHANNEL_BOT_PASSWORD;
const TARGET_CHANNEL = process.env.CHANNEL_BOT_TARGET_CHANNEL;
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

// ============================================
// Telegram API Helpers
// ============================================

async function callTelegramApi(method: string, params: Record<string, unknown> = {}): Promise<unknown> {
  const response = await fetch(`${TELEGRAM_API}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  
  const result = await response.json();
  
  if (!result.ok) {
    console.error(`Telegram API Error [${method}]:`, result);
    throw new Error(result.description || "Telegram API Error");
  }
  
  return result.result;
}

export async function sendTextMessage(chatId: number | string, text: string, options: Record<string, unknown> = {}): Promise<unknown> {
  return callTelegramApi("sendMessage", {
    chat_id: chatId,
    text,
    parse_mode: "HTML",
    ...options,
  });
}

export async function sendPhoto(chatId: number | string, fileId: string, caption?: string): Promise<unknown> {
  return callTelegramApi("sendPhoto", {
    chat_id: chatId,
    photo: fileId,
    caption,
    parse_mode: "HTML",
  });
}

export async function sendVideo(chatId: number | string, fileId: string, caption?: string): Promise<unknown> {
  return callTelegramApi("sendVideo", {
    chat_id: chatId,
    video: fileId,
    caption,
    parse_mode: "HTML",
  });
}

export async function sendVoice(chatId: number | string, fileId: string, caption?: string): Promise<unknown> {
  return callTelegramApi("sendVoice", {
    chat_id: chatId,
    voice: fileId,
    caption,
    parse_mode: "HTML",
  });
}

export async function sendDocument(chatId: number | string, fileId: string, caption?: string): Promise<unknown> {
  return callTelegramApi("sendDocument", {
    chat_id: chatId,
    document: fileId,
    caption,
    parse_mode: "HTML",
  });
}

export async function sendAnimation(chatId: number | string, fileId: string, caption?: string): Promise<unknown> {
  return callTelegramApi("sendAnimation", {
    chat_id: chatId,
    animation: fileId,
    caption,
    parse_mode: "HTML",
  });
}

export async function answerCallbackQuery(callbackQueryId: string, text?: string): Promise<unknown> {
  return callTelegramApi("answerCallbackQuery", {
    callback_query_id: callbackQueryId,
    text,
  });
}

// ============================================
// Session Management
// ============================================

async function getOrCreateSession(user: TelegramUser): Promise<BotSession> {
  // Versuche existierende Session zu laden
  const { data: existing } = await supabaseAdmin
    .from("telegram_bot_sessions")
    .select("*")
    .eq("telegram_user_id", user.id)
    .single();

  if (existing) {
    return existing as BotSession;
  }

  // Neue Session erstellen
  const { data: newSession, error } = await supabaseAdmin
    .from("telegram_bot_sessions")
    .insert({
      telegram_user_id: user.id,
      telegram_username: user.username,
      telegram_first_name: user.first_name,
      is_authenticated: false,
      conversation_state: "idle",
      conversation_data: {},
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating session:", error);
    throw error;
  }

  return newSession as BotSession;
}

async function updateSession(
  userId: number, 
  updates: Partial<Pick<BotSession, "is_authenticated" | "authenticated_at" | "conversation_state" | "conversation_data">>
): Promise<void> {
  const { error } = await supabaseAdmin
    .from("telegram_bot_sessions")
    .update(updates)
    .eq("telegram_user_id", userId);

  if (error) {
    console.error("Error updating session:", error);
    throw error;
  }
}

async function resetConversation(userId: number): Promise<void> {
  await updateSession(userId, {
    conversation_state: "idle",
    conversation_data: {},
  });
}

// ============================================
// Command Handlers
// ============================================

async function handleStart(chatId: number, user: TelegramUser, session: BotSession): Promise<void> {
  if (session.is_authenticated) {
    await sendTextMessage(chatId, 
      `👋 Willkommen zurück, ${user.first_name}!\n\n` +
      `Du bist bereits angemeldet.\n` +
      `Nutze /help um alle Befehle zu sehen.`
    );
  } else {
    await sendTextMessage(chatId,
      `👋 Willkommen beim SNT Channel Bot!\n\n` +
      `Dieser Bot ermöglicht dir, Nachrichten in deinem Kanal zu planen und automatisch zu veröffentlichen.\n\n` +
      `🔐 Bitte authentifiziere dich mit:\n` +
      `<code>/login DEIN_PASSWORT</code>`
    );
  }
}

async function handleLogin(chatId: number, user: TelegramUser, args: string): Promise<void> {
  if (!BOT_PASSWORD) {
    await sendTextMessage(chatId, "❌ Bot-Passwort ist nicht konfiguriert. Bitte CHANNEL_BOT_PASSWORD in .env setzen.");
    return;
  }

  if (args === BOT_PASSWORD) {
    await updateSession(user.id, {
      is_authenticated: true,
      authenticated_at: new Date().toISOString(),
      conversation_state: "idle",
    });
    
    await sendTextMessage(chatId,
      `✅ Erfolgreich angemeldet!\n\n` +
      `Du kannst jetzt Nachrichten planen:\n` +
      `• /post - Sofort eine Nachricht senden\n` +
      `• /schedule - Einmalige Nachricht planen\n` +
      `• /recurring - Wiederkehrende Nachricht\n` +
      `• /list - Alle geplanten Nachrichten\n` +
      `• /help - Alle Befehle anzeigen`
    );
  } else {
    await sendTextMessage(chatId, "❌ Falsches Passwort. Bitte versuche es erneut.");
  }
}

async function handleHelp(chatId: number, session: BotSession): Promise<void> {
  if (!session.is_authenticated) {
    await sendTextMessage(chatId, "🔐 Bitte melde dich zuerst an mit /login PASSWORT");
    return;
  }

  await sendTextMessage(chatId,
    `📚 <b>Verfügbare Befehle:</b>\n\n` +
    `<b>Nachrichten senden:</b>\n` +
    `/post - Nachricht sofort an Kanal senden\n` +
    `/schedule - Einmalige Nachricht planen\n` +
    `/recurring - Wiederkehrende Nachricht erstellen\n\n` +
    `<b>Verwaltung:</b>\n` +
    `/list - Alle geplanten Nachrichten anzeigen\n` +
    `/cancel &lt;ID&gt; - Geplante Nachricht löschen\n` +
    `/channel_info - Kanal-Informationen anzeigen\n\n` +
    `<b>Sonstiges:</b>\n` +
    `/help - Diese Hilfe anzeigen\n` +
    `/logout - Abmelden\n\n` +
    `<b>Unterstützte Medien:</b>\n` +
    `📝 Text, 📷 Bilder, 🎥 Videos, 🎤 Sprachnachrichten, 📎 Dokumente, 🎞 GIFs`
  );
}

async function handlePost(chatId: number, user: TelegramUser, session: BotSession): Promise<void> {
  if (!session.is_authenticated) {
    await sendTextMessage(chatId, "🔐 Bitte melde dich zuerst an mit /login PASSWORT");
    return;
  }

  await updateSession(user.id, {
    conversation_state: "awaiting_media",
    conversation_data: { schedule_type: "once", scheduled_time: "now" },
  });

  await sendTextMessage(chatId,
    `📤 <b>Nachricht sofort senden</b>\n\n` +
    `Sende mir jetzt die Nachricht, die du im Kanal veröffentlichen möchtest.\n\n` +
    `Du kannst senden:\n` +
    `• Text\n` +
    `• Bild (mit oder ohne Caption)\n` +
    `• Video (mit oder ohne Caption)\n` +
    `• Sprachnachricht\n` +
    `• Dokument\n` +
    `• GIF\n\n` +
    `<i>Zum Abbrechen: /cancel_action</i>`
  );
}

async function handleSchedule(chatId: number, user: TelegramUser, session: BotSession): Promise<void> {
  if (!session.is_authenticated) {
    await sendTextMessage(chatId, "🔐 Bitte melde dich zuerst an mit /login PASSWORT");
    return;
  }

  await updateSession(user.id, {
    conversation_state: "awaiting_media",
    conversation_data: { schedule_type: "once" },
  });

  await sendTextMessage(chatId,
    `📅 <b>Einmalige Nachricht planen</b>\n\n` +
    `Sende mir zuerst die Nachricht, die du planen möchtest.\n\n` +
    `Du kannst senden:\n` +
    `• Text\n` +
    `• Bild (mit oder ohne Caption)\n` +
    `• Video (mit oder ohne Caption)\n` +
    `• Sprachnachricht\n` +
    `• Dokument\n` +
    `• GIF\n\n` +
    `<i>Zum Abbrechen: /cancel_action</i>`
  );
}

async function handleRecurring(chatId: number, user: TelegramUser, session: BotSession): Promise<void> {
  if (!session.is_authenticated) {
    await sendTextMessage(chatId, "🔐 Bitte melde dich zuerst an mit /login PASSWORT");
    return;
  }

  await updateSession(user.id, {
    conversation_state: "awaiting_media",
    conversation_data: { schedule_type: "recurring" },
  });

  await sendTextMessage(chatId,
    `🔄 <b>Wiederkehrende Nachricht erstellen</b>\n\n` +
    `Sende mir zuerst die Nachricht, die regelmäßig gepostet werden soll.\n\n` +
    `Du kannst senden:\n` +
    `• Text\n` +
    `• Bild (mit oder ohne Caption)\n` +
    `• Video (mit oder ohne Caption)\n` +
    `• Sprachnachricht\n` +
    `• Dokument\n` +
    `• GIF\n\n` +
    `<i>Zum Abbrechen: /cancel_action</i>`
  );
}

async function handleList(chatId: number, session: BotSession): Promise<void> {
  if (!session.is_authenticated) {
    await sendTextMessage(chatId, "🔐 Bitte melde dich zuerst an mit /login PASSWORT");
    return;
  }

  const { data: messages, error } = await supabaseAdmin
    .from("telegram_scheduled_messages")
    .select("*")
    .eq("bot_type", "channel_bot")
    .eq("is_active", true)
    .order("next_run_at", { ascending: true, nullsFirst: false })
    .order("scheduled_at", { ascending: true });

  if (error) {
    await sendTextMessage(chatId, "❌ Fehler beim Laden der Nachrichten.");
    return;
  }

  if (!messages || messages.length === 0) {
    await sendTextMessage(chatId, "📭 Keine geplanten Nachrichten vorhanden.\n\nErstelle eine mit /schedule oder /recurring");
    return;
  }

  const mediaEmojis: Record<string, string> = {
    photo: "📷",
    video: "🎥",
    voice: "🎤",
    document: "📎",
    animation: "🎞",
    text: "📝",
  };

  const dayNames = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];

  let response = `📋 <b>Geplante Nachrichten (${messages.length}):</b>\n\n`;

  for (const msg of messages) {
    const emoji = mediaEmojis[msg.media_type || "text"] || "📝";
    const shortId = msg.id.substring(0, 8);
    
    let preview = "";
    if (msg.message_text) {
      preview = msg.message_text.substring(0, 30) + (msg.message_text.length > 30 ? "..." : "");
    } else if (msg.caption) {
      preview = msg.caption.substring(0, 30) + (msg.caption.length > 30 ? "..." : "");
    } else {
      preview = `${msg.media_type || "Text"} ohne Caption`;
    }

    let scheduleInfo = "";
    if (msg.is_recurring) {
      if (msg.recurring_days && msg.recurring_days.length > 0) {
        const days = msg.recurring_days.map((d: number) => dayNames[d]).join(", ");
        scheduleInfo = `🔄 ${days} um ${msg.recurring_time}`;
      } else {
        scheduleInfo = `🔄 ${msg.recurring_pattern} um ${msg.recurring_time}`;
      }
    } else {
      const date = new Date(msg.scheduled_at);
      scheduleInfo = `📅 ${date.toLocaleDateString("de-DE")} um ${date.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}`;
    }

    response += `${emoji} <code>${shortId}</code>\n`;
    response += `   "${preview}"\n`;
    response += `   ${scheduleInfo}\n`;
    if (msg.random_delay_minutes > 0) {
      response += `   ⏱ +0-${msg.random_delay_minutes} Min Zufall\n`;
    } else {
      response += `   ⏱ Exakte Zeit (keine Verzögerung)\n`;
    }
    response += `\n`;
  }

  response += `\n<i>Zum Löschen: /cancel &lt;ID&gt;</i>`;

  await sendTextMessage(chatId, response);
}

async function handleCancel(chatId: number, session: BotSession, args: string): Promise<void> {
  if (!session.is_authenticated) {
    await sendTextMessage(chatId, "🔐 Bitte melde dich zuerst an mit /login PASSWORT");
    return;
  }

  if (!args) {
    await sendTextMessage(chatId, "❌ Bitte gib die ID an: /cancel <ID>\n\nNutze /list um alle IDs zu sehen.");
    return;
  }

  // Suche nach Nachricht mit passender ID (Prefix-Match)
  const { data: messages } = await supabaseAdmin
    .from("telegram_scheduled_messages")
    .select("id")
    .eq("bot_type", "channel_bot")
    .eq("is_active", true)
    .ilike("id", `${args}%`);

  if (!messages || messages.length === 0) {
    await sendTextMessage(chatId, `❌ Keine Nachricht mit ID "${args}" gefunden.`);
    return;
  }

  if (messages.length > 1) {
    await sendTextMessage(chatId, `❌ Mehrere Nachrichten gefunden. Bitte gib mehr Zeichen der ID an.`);
    return;
  }

  const messageId = messages[0].id;

  const { error } = await supabaseAdmin
    .from("telegram_scheduled_messages")
    .update({ is_active: false })
    .eq("id", messageId);

  if (error) {
    await sendTextMessage(chatId, "❌ Fehler beim Löschen der Nachricht.");
    return;
  }

  await sendTextMessage(chatId, `✅ Nachricht <code>${args}</code> wurde gelöscht.`);
}

async function handleCancelAction(chatId: number, user: TelegramUser): Promise<void> {
  await resetConversation(user.id);
  await sendTextMessage(chatId, "❌ Aktion abgebrochen.\n\nNutze /help für alle Befehle.");
}

async function handleChannelInfo(chatId: number, session: BotSession): Promise<void> {
  if (!session.is_authenticated) {
    await sendTextMessage(chatId, "🔐 Bitte melde dich zuerst an mit /login PASSWORT");
    return;
  }

  if (!TARGET_CHANNEL) {
    await sendTextMessage(chatId, "❌ Kein Ziel-Kanal konfiguriert.\nBitte CHANNEL_BOT_TARGET_CHANNEL in .env setzen.");
    return;
  }

  try {
    const chat = await callTelegramApi("getChat", { chat_id: TARGET_CHANNEL }) as TelegramChat;
    
    await sendTextMessage(chatId,
      `📢 <b>Kanal-Informationen:</b>\n\n` +
      `<b>Titel:</b> ${chat.title || "Unbekannt"}\n` +
      `<b>Username:</b> ${chat.username ? "@" + chat.username : "Kein Username"}\n` +
      `<b>ID:</b> <code>${chat.id}</code>\n` +
      `<b>Typ:</b> ${chat.type}\n\n` +
      `<i>Diese ID kannst du für CHANNEL_BOT_TARGET_CHANNEL verwenden.</i>`
    );
  } catch (error) {
    await sendTextMessage(chatId, 
      `❌ Konnte Kanal-Informationen nicht abrufen.\n\n` +
      `Stelle sicher, dass:\n` +
      `1. Der Bot als Admin im Kanal ist\n` +
      `2. CHANNEL_BOT_TARGET_CHANNEL korrekt gesetzt ist\n\n` +
      `Aktueller Wert: <code>${TARGET_CHANNEL}</code>`
    );
  }
}

async function handleLogout(chatId: number, user: TelegramUser): Promise<void> {
  await updateSession(user.id, {
    is_authenticated: false,
    conversation_state: "idle",
    conversation_data: {},
  });

  await sendTextMessage(chatId, "👋 Du wurdest abgemeldet.\n\nBis bald!");
}

// ============================================
// Media Handler
// ============================================

function extractMediaInfo(message: TelegramMessage): { type: MediaType; fileId: string; caption?: string } | null {
  if (message.photo && message.photo.length > 0) {
    // Nimm das größte Foto
    const largestPhoto = message.photo[message.photo.length - 1];
    return { type: "photo", fileId: largestPhoto.file_id, caption: message.caption };
  }
  
  if (message.video) {
    return { type: "video", fileId: message.video.file_id, caption: message.caption };
  }
  
  if (message.voice) {
    return { type: "voice", fileId: message.voice.file_id, caption: message.caption };
  }
  
  if (message.document) {
    return { type: "document", fileId: message.document.file_id, caption: message.caption };
  }
  
  if (message.animation) {
    return { type: "animation", fileId: message.animation.file_id, caption: message.caption };
  }
  
  if (message.text) {
    return { type: "text", fileId: "", caption: undefined };
  }
  
  return null;
}

async function sendMediaToChannel(mediaType: MediaType, fileId: string, text?: string, caption?: string): Promise<void> {
  if (!TARGET_CHANNEL) {
    throw new Error("Kein Ziel-Kanal konfiguriert");
  }

  switch (mediaType) {
    case "photo":
      await sendPhoto(TARGET_CHANNEL, fileId, caption);
      break;
    case "video":
      await sendVideo(TARGET_CHANNEL, fileId, caption);
      break;
    case "voice":
      await sendVoice(TARGET_CHANNEL, fileId, caption);
      break;
    case "document":
      await sendDocument(TARGET_CHANNEL, fileId, caption);
      break;
    case "animation":
      await sendAnimation(TARGET_CHANNEL, fileId, caption);
      break;
    case "text":
      await sendTextMessage(TARGET_CHANNEL, text || "");
      break;
  }
}

// ============================================
// Conversation Flow Handler
// ============================================

async function handleMediaInput(
  chatId: number, 
  user: TelegramUser, 
  message: TelegramMessage, 
  session: BotSession
): Promise<void> {
  const mediaInfo = extractMediaInfo(message);
  
  if (!mediaInfo) {
    await sendTextMessage(chatId, "❌ Dieses Format wird nicht unterstützt. Bitte sende Text, Bild, Video, Sprachnachricht, Dokument oder GIF.");
    return;
  }

  const data = session.conversation_data;

  // Sofort senden wenn "now"
  if (data.scheduled_time === "now") {
    try {
      await sendMediaToChannel(
        mediaInfo.type, 
        mediaInfo.fileId, 
        message.text, 
        mediaInfo.caption
      );
      
      await resetConversation(user.id);
      await sendTextMessage(chatId, "✅ Nachricht wurde an den Kanal gesendet!");
    } catch (error) {
      await sendTextMessage(chatId, `❌ Fehler beim Senden: ${error instanceof Error ? error.message : "Unbekannter Fehler"}`);
    }
    return;
  }

  // Speichere Media und frage nach Zeit
  await updateSession(user.id, {
    conversation_state: data.schedule_type === "recurring" ? "awaiting_recurring_config" : "awaiting_schedule_time",
    conversation_data: {
      ...data,
      pending_media_type: mediaInfo.type,
      pending_file_id: mediaInfo.fileId,
      pending_caption: mediaInfo.caption,
      pending_text: message.text,
    },
  });

  if (data.schedule_type === "recurring") {
    await sendTextMessage(chatId,
      `✅ Nachricht gespeichert!\n\n` +
      `<b>Wann soll diese Nachricht gepostet werden?</b>\n\n` +
      `Gib das Muster ein:\n` +
      `• <code>täglich 08:00</code> - Jeden Tag um 8 Uhr\n` +
      `• <code>Mo,Mi,Fr 08:00</code> - Bestimmte Tage\n` +
      `• <code>wöchentlich Mo 08:00</code> - Einmal pro Woche\n\n` +
      `<i>Alle Zeiten werden um 0-10 Minuten zufällig verzögert.</i>\n\n` +
      `<i>Zum Abbrechen: /cancel_action</i>`
    );
  } else {
    await sendTextMessage(chatId,
      `✅ Nachricht gespeichert!\n\n` +
      `<b>Wann soll diese Nachricht gepostet werden?</b>\n\n` +
      `Gib Datum und Uhrzeit ein:\n` +
      `• <code>15:30</code> - Heute um 15:30 Uhr\n` +
      `• <code>05.02.2026 15:30</code> - Am 5. Februar um 15:30\n` +
      `• <code>morgen 08:00</code> - Morgen um 8 Uhr\n\n` +
      `<i>Die Zeit wird um 0-10 Minuten zufällig verzögert.</i>\n\n` +
      `<i>Zum Abbrechen: /cancel_action</i>`
    );
  }
}

async function handleScheduleTimeInput(
  chatId: number,
  user: TelegramUser,
  text: string,
  session: BotSession
): Promise<void> {
  const data = session.conversation_data;
  
  // Parse Zeitangabe
  const scheduledTime = parseScheduleTime(text);
  
  if (!scheduledTime) {
    await sendTextMessage(chatId, 
      `❌ Konnte die Zeitangabe nicht verstehen.\n\n` +
      `Bitte nutze eines dieser Formate:\n` +
      `• <code>15:30</code> - Heute um 15:30\n` +
      `• <code>05.02.2026 15:30</code> - Datum und Zeit\n` +
      `• <code>morgen 08:00</code> - Morgen um 8 Uhr`
    );
    return;
  }

  if (scheduledTime <= new Date()) {
    await sendTextMessage(chatId, "❌ Der Zeitpunkt liegt in der Vergangenheit. Bitte wähle eine Zeit in der Zukunft.");
    return;
  }

  // Speichere Zeit und frage nach Verzögerung
  await updateSession(user.id, {
    conversation_state: "awaiting_delay_config",
    conversation_data: {
      ...data,
      scheduled_date: scheduledTime,
    },
  });

  await sendTextMessage(chatId,
    `⏱ <b>Zufällige Verzögerung?</b>\n\n` +
    `Soll die Nachricht mit einer zufälligen Verzögerung gepostet werden?\n` +
    `(Die Nachricht wird dann nicht exakt zur geplanten Zeit, sondern innerhalb eines Zeitfensters gesendet)\n\n` +
    `Antworte mit:\n` +
    `• <code>nein</code> - Exakt zur geplanten Zeit\n` +
    `• <code>ja</code> - Mit 0-10 Min. Verzögerung (Standard)\n` +
    `• <code>5</code> - Mit 0-5 Min. Verzögerung\n` +
    `• <code>15</code> - Mit 0-15 Min. Verzögerung\n\n` +
    `<i>Zum Abbrechen: /cancel_action</i>`
  );
}

async function handleRecurringConfigInput(
  chatId: number,
  user: TelegramUser,
  text: string,
  session: BotSession
): Promise<void> {
  const data = session.conversation_data;
  
  // Parse wiederkehrendes Muster
  const pattern = parseRecurringPattern(text);
  
  if (!pattern) {
    await sendTextMessage(chatId,
      `❌ Konnte das Muster nicht verstehen.\n\n` +
      `Bitte nutze eines dieser Formate:\n` +
      `• <code>täglich 08:00</code>\n` +
      `• <code>Mo,Mi,Fr 08:00</code>\n` +
      `• <code>wöchentlich Mo 08:00</code>`
    );
    return;
  }

  // Speichere Pattern und frage nach Verzögerung
  await updateSession(user.id, {
    conversation_state: "awaiting_delay_config",
    conversation_data: {
      ...data,
      recurring_pattern: pattern,
    },
  });

  await sendTextMessage(chatId,
    `⏱ <b>Zufällige Verzögerung?</b>\n\n` +
    `Soll die Nachricht mit einer zufälligen Verzögerung gepostet werden?\n` +
    `(Die Nachricht wird dann nicht exakt zur geplanten Zeit, sondern innerhalb eines Zeitfensters gesendet)\n\n` +
    `Antworte mit:\n` +
    `• <code>nein</code> - Exakt zur geplanten Zeit\n` +
    `• <code>ja</code> - Mit 0-10 Min. Verzögerung (Standard)\n` +
    `• <code>5</code> - Mit 0-5 Min. Verzögerung\n` +
    `• <code>15</code> - Mit 0-15 Min. Verzögerung\n\n` +
    `<i>Zum Abbrechen: /cancel_action</i>`
  );
}

async function handleDelayConfigInput(
  chatId: number,
  user: TelegramUser,
  text: string,
  session: BotSession
): Promise<void> {
  const data = session.conversation_data;
  const input = text.toLowerCase().trim();
  
  let randomDelayMinutes = 0;
  
  // Parse Eingabe
  if (input === "nein" || input === "no" || input === "n" || input === "0") {
    randomDelayMinutes = 0;
  } else if (input === "ja" || input === "yes" || input === "j") {
    randomDelayMinutes = 10; // Standard
  } else {
    const minutes = parseInt(input);
    if (isNaN(minutes) || minutes < 0 || minutes > 60) {
      await sendTextMessage(chatId,
        `❌ Ungültige Eingabe.\n\n` +
        `Bitte antworte mit:\n` +
        `• <code>nein</code> - Keine Verzögerung\n` +
        `• <code>ja</code> - 10 Min. Verzögerung\n` +
        `• Eine Zahl (1-60) für individuelle Minuten`
      );
      return;
    }
    randomDelayMinutes = minutes;
  }

  // Unterscheide zwischen einmaliger und wiederkehrender Nachricht
  if (data.schedule_type === "recurring" && data.recurring_pattern) {
    // Wiederkehrende Nachricht speichern
    const pattern = data.recurring_pattern;
    const nextRun = calculateNextRecurringRun(pattern);

    const messageData: ScheduledMessage = {
      message_text: data.pending_media_type === "text" ? data.pending_text : undefined,
      media_type: data.pending_media_type !== "text" ? data.pending_media_type : undefined,
      media_file_id: data.pending_file_id || undefined,
      caption: data.pending_caption,
      target_channel_id: TARGET_CHANNEL || "",
      scheduled_at: nextRun.toISOString(),
      timezone: "Europe/Berlin",
      is_recurring: true,
      recurring_pattern: pattern.type,
      recurring_time: pattern.time,
      recurring_days: pattern.days,
      next_run_at: nextRun.toISOString(),
      random_delay_minutes: randomDelayMinutes,
      is_active: true,
      is_sent: false,
      bot_type: "channel_bot",
      created_by: user.id.toString(),
    };

    const { data: saved, error } = await supabaseAdmin
      .from("telegram_scheduled_messages")
      .insert(messageData)
      .select()
      .single();

    if (error) {
      console.error("Error saving message:", error);
      await sendTextMessage(chatId, "❌ Fehler beim Speichern der Nachricht.");
      return;
    }

    await resetConversation(user.id);

    const shortId = saved.id.substring(0, 8);
    const dayNames = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
    
    let scheduleDescription = "";
    if (pattern.type === "daily") {
      scheduleDescription = `Täglich um ${pattern.time}`;
    } else if (pattern.days && pattern.days.length > 0) {
      const days = pattern.days.map(d => dayNames[d]).join(", ");
      scheduleDescription = `${days} um ${pattern.time}`;
    } else {
      scheduleDescription = `${pattern.type} um ${pattern.time}`;
    }

    const delayInfo = randomDelayMinutes > 0 
      ? `⏱ +0-${randomDelayMinutes} Min. Zufallsverzögerung` 
      : `⏱ Keine Verzögerung (exakte Zeit)`;

    await sendTextMessage(chatId,
      `✅ <b>Wiederkehrende Nachricht erstellt!</b>\n\n` +
      `🔄 ${scheduleDescription}\n` +
      `${delayInfo}\n` +
      `🆔 <code>${shortId}</code>\n\n` +
      `<i>Nächste Ausführung: ${nextRun.toLocaleDateString("de-DE")} um ${nextRun.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}</i>\n\n` +
      `<i>Nutze /list um alle geplanten Nachrichten zu sehen.</i>`
    );
  } else {
    // Einmalige Nachricht speichern
    const scheduledTime = data.scheduled_date ? new Date(data.scheduled_date) : new Date();

    const messageData: ScheduledMessage = {
      message_text: data.pending_media_type === "text" ? data.pending_text : undefined,
      media_type: data.pending_media_type !== "text" ? data.pending_media_type : undefined,
      media_file_id: data.pending_file_id || undefined,
      caption: data.pending_caption,
      target_channel_id: TARGET_CHANNEL || "",
      scheduled_at: scheduledTime.toISOString(),
      timezone: "Europe/Berlin",
      is_recurring: false,
      next_run_at: scheduledTime.toISOString(),
      random_delay_minutes: randomDelayMinutes,
      is_active: true,
      is_sent: false,
      bot_type: "channel_bot",
      created_by: user.id.toString(),
    };

    const { data: saved, error } = await supabaseAdmin
      .from("telegram_scheduled_messages")
      .insert(messageData)
      .select()
      .single();

    if (error) {
      console.error("Error saving message:", error);
      await sendTextMessage(chatId, "❌ Fehler beim Speichern der Nachricht.");
      return;
    }

    await resetConversation(user.id);

    const shortId = saved.id.substring(0, 8);
    const formattedDate = scheduledTime.toLocaleDateString("de-DE");
    const formattedTime = scheduledTime.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });

    const delayInfo = randomDelayMinutes > 0 
      ? `⏱ +0-${randomDelayMinutes} Min. Zufallsverzögerung` 
      : `⏱ Keine Verzögerung (exakte Zeit)`;

    await sendTextMessage(chatId,
      `✅ <b>Nachricht geplant!</b>\n\n` +
      `📅 ${formattedDate} um ${formattedTime}\n` +
      `${delayInfo}\n` +
      `🆔 <code>${shortId}</code>\n\n` +
      `<i>Nutze /list um alle geplanten Nachrichten zu sehen.</i>`
    );
  }
}

// ============================================
// Time Parsing Helpers
// ============================================

function parseScheduleTime(input: string): Date | null {
  const now = new Date();
  const text = input.toLowerCase().trim();

  // Format: "morgen HH:MM"
  const tomorrowMatch = text.match(/^morgen\s+(\d{1,2}):(\d{2})$/);
  if (tomorrowMatch) {
    const date = new Date(now);
    date.setDate(date.getDate() + 1);
    date.setHours(parseInt(tomorrowMatch[1]), parseInt(tomorrowMatch[2]), 0, 0);
    return date;
  }

  // Format: "DD.MM.YYYY HH:MM"
  const fullDateMatch = text.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})\s+(\d{1,2}):(\d{2})$/);
  if (fullDateMatch) {
    const date = new Date(
      parseInt(fullDateMatch[3]),
      parseInt(fullDateMatch[2]) - 1,
      parseInt(fullDateMatch[1]),
      parseInt(fullDateMatch[4]),
      parseInt(fullDateMatch[5]),
      0, 0
    );
    return date;
  }

  // Format: "HH:MM" (heute)
  const timeOnlyMatch = text.match(/^(\d{1,2}):(\d{2})$/);
  if (timeOnlyMatch) {
    const date = new Date(now);
    date.setHours(parseInt(timeOnlyMatch[1]), parseInt(timeOnlyMatch[2]), 0, 0);
    
    // Wenn Zeit bereits vorbei, auf morgen setzen
    if (date <= now) {
      date.setDate(date.getDate() + 1);
    }
    return date;
  }

  return null;
}

function parseRecurringPattern(input: string): RecurringPattern | null {
  const text = input.toLowerCase().trim();
  
  const dayMap: Record<string, number> = {
    "so": 0, "sonntag": 0,
    "mo": 1, "montag": 1,
    "di": 2, "dienstag": 2,
    "mi": 3, "mittwoch": 3,
    "do": 4, "donnerstag": 4,
    "fr": 5, "freitag": 5,
    "sa": 6, "samstag": 6,
  };

  // Format: "täglich HH:MM"
  const dailyMatch = text.match(/^täglich\s+(\d{1,2}):(\d{2})$/);
  if (dailyMatch) {
    return {
      type: "daily",
      time: `${dailyMatch[1].padStart(2, "0")}:${dailyMatch[2]}`,
    };
  }

  // Format: "wöchentlich Mo HH:MM"
  const weeklyMatch = text.match(/^wöchentlich\s+(\w+)\s+(\d{1,2}):(\d{2})$/);
  if (weeklyMatch) {
    const day = dayMap[weeklyMatch[1].toLowerCase()];
    if (day !== undefined) {
      return {
        type: "weekly",
        time: `${weeklyMatch[2].padStart(2, "0")}:${weeklyMatch[3]}`,
        days: [day],
      };
    }
  }

  // Format: "Mo,Mi,Fr HH:MM" oder "Mo, Mi, Fr HH:MM"
  const specificDaysMatch = text.match(/^([\w,\s]+)\s+(\d{1,2}):(\d{2})$/);
  if (specificDaysMatch) {
    const dayPart = specificDaysMatch[1];
    const dayStrings = dayPart.split(/[,\s]+/).filter(d => d.length > 0);
    const days: number[] = [];
    
    for (const dayStr of dayStrings) {
      const day = dayMap[dayStr.toLowerCase()];
      if (day !== undefined && !days.includes(day)) {
        days.push(day);
      }
    }
    
    if (days.length > 0) {
      return {
        type: "specific_days",
        time: `${specificDaysMatch[2].padStart(2, "0")}:${specificDaysMatch[3]}`,
        days: days.sort((a, b) => a - b),
      };
    }
  }

  return null;
}

function calculateNextRecurringRun(pattern: RecurringPattern): Date {
  const now = new Date();
  const [hours, minutes] = pattern.time.split(":").map(Number);
  
  const targetTime = new Date(now);
  targetTime.setHours(hours, minutes, 0, 0);

  if (pattern.type === "daily") {
    // Wenn Zeit heute schon vorbei, dann morgen
    if (targetTime <= now) {
      targetTime.setDate(targetTime.getDate() + 1);
    }
    return targetTime;
  }

  if (pattern.days && pattern.days.length > 0) {
    const currentDay = now.getDay();
    
    // Finde den nächsten passenden Tag
    for (let i = 0; i < 7; i++) {
      const checkDay = (currentDay + i) % 7;
      if (pattern.days.includes(checkDay)) {
        const candidate = new Date(now);
        candidate.setDate(now.getDate() + i);
        candidate.setHours(hours, minutes, 0, 0);
        
        if (candidate > now) {
          return candidate;
        }
      }
    }
    
    // Fallback: Nächste Woche, erster passender Tag
    const nextWeek = new Date(now);
    nextWeek.setDate(now.getDate() + 7);
    for (const day of pattern.days) {
      const daysUntil = (day - currentDay + 7) % 7;
      const candidate = new Date(now);
      candidate.setDate(now.getDate() + daysUntil + 7);
      candidate.setHours(hours, minutes, 0, 0);
      return candidate;
    }
  }

  // Fallback: Morgen
  targetTime.setDate(targetTime.getDate() + 1);
  return targetTime;
}

// ============================================
// Main Update Handler
// ============================================

export async function handleUpdate(update: TelegramUpdate): Promise<void> {
  // Nur private Nachrichten verarbeiten
  if (!update.message || update.message.chat.type !== "private") {
    return;
  }

  const message = update.message;
  const user = message.from;
  
  if (!user) {
    return;
  }

  const chatId = message.chat.id;
  
  try {
    // Session laden oder erstellen
    const session = await getOrCreateSession(user);
    
    // Command handling
    if (message.text?.startsWith("/")) {
      const parts = message.text.split(" ");
      const command = parts[0].toLowerCase().replace("@" + (await getBotUsername()), "");
      const args = parts.slice(1).join(" ");

      switch (command) {
        case "/start":
          await handleStart(chatId, user, session);
          return;
          
        case "/login":
          await handleLogin(chatId, user, args);
          return;
          
        case "/help":
          await handleHelp(chatId, session);
          return;
          
        case "/post":
          await handlePost(chatId, user, session);
          return;
          
        case "/schedule":
          await handleSchedule(chatId, user, session);
          return;
          
        case "/recurring":
          await handleRecurring(chatId, user, session);
          return;
          
        case "/list":
          await handleList(chatId, session);
          return;
          
        case "/cancel":
          await handleCancel(chatId, session, args);
          return;
          
        case "/cancel_action":
          await handleCancelAction(chatId, user);
          return;
          
        case "/channel_info":
          await handleChannelInfo(chatId, session);
          return;
          
        case "/logout":
          await handleLogout(chatId, user);
          return;
          
        default:
          if (session.is_authenticated) {
            await sendTextMessage(chatId, "❓ Unbekannter Befehl. Nutze /help für alle Befehle.");
          } else {
            await sendTextMessage(chatId, "🔐 Bitte melde dich zuerst an mit /login PASSWORT");
          }
          return;
      }
    }

    // Konversations-basiertes Handling
    if (!session.is_authenticated) {
      await sendTextMessage(chatId, "🔐 Bitte melde dich zuerst an mit /login PASSWORT");
      return;
    }

    switch (session.conversation_state) {
      case "awaiting_media":
        await handleMediaInput(chatId, user, message, session);
        return;
        
      case "awaiting_schedule_time":
        if (message.text) {
          await handleScheduleTimeInput(chatId, user, message.text, session);
        } else {
          await sendTextMessage(chatId, "❌ Bitte sende eine Zeitangabe als Text.");
        }
        return;
        
      case "awaiting_recurring_config":
        if (message.text) {
          await handleRecurringConfigInput(chatId, user, message.text, session);
        } else {
          await sendTextMessage(chatId, "❌ Bitte sende das Muster als Text.");
        }
        return;

      case "awaiting_delay_config":
        if (message.text) {
          await handleDelayConfigInput(chatId, user, message.text, session);
        } else {
          await sendTextMessage(chatId, "❌ Bitte sende deine Antwort als Text (ja/nein oder eine Zahl).");
        }
        return;
        
      default:
        // Im idle-Zustand ohne Command
        await sendTextMessage(chatId, "💡 Nutze /help um alle verfügbaren Befehle zu sehen.");
        return;
    }
  } catch (error) {
    console.error("Error handling update:", error);
    await sendTextMessage(chatId, "❌ Ein Fehler ist aufgetreten. Bitte versuche es erneut.");
  }
}

// Helper zum Bot-Username holen (cached)
let botUsername: string | null = null;

async function getBotUsername(): Promise<string> {
  if (botUsername) return botUsername;
  
  try {
    const me = await callTelegramApi("getMe") as { username: string };
    botUsername = me.username;
    return botUsername;
  } catch {
    return "";
  }
}

// Export für Setup
export { TARGET_CHANNEL, BOT_TOKEN };

/**
 * Telegram Paid Group Bot - Webhook Handler
 * 
 * WICHTIG: Dies ist ein SEPARATER Bot für die bezahlte Gruppe!
 * Der bestehende Bot unter /api/telegram/webhook bleibt unverändert.
 * 
 * Verwendet: TELEGRAM_PAID_TOKEN und GROUP_ID
 */

import { NextRequest, NextResponse } from "next/server";
import {
  TelegramUpdate,
  sendMessage,
  answerCallbackQuery,
  getWelcomeMessage,
  getHelpMessage,
  getStatusActiveMessage,
  getStatusInactiveMessage,
  getGroupId,
} from "@/lib/telegram/paid-group-bot";
import {
  getMemberByTelegramId,
  createMember,
  markMemberJoinedGroup,
  markMemberLeftGroup,
  confirmVerification,
  logActivity,
} from "@/lib/telegram/group-management";
import { handleFaqQuery } from "@/lib/telegram/faq-handler";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/telegram/paid-group/webhook
 * Empfängt Updates vom Telegram Bot
 */
export async function POST(request: NextRequest) {
  try {
    const update: TelegramUpdate = await request.json();
    
    console.log("[Paid-Bot] Update erhalten:", JSON.stringify(update, null, 2));

    // Chat Member Update (User tritt Gruppe bei/verlässt sie)
    if (update.my_chat_member) {
      await handleChatMemberUpdate(update);
      return NextResponse.json({ ok: true });
    }

    // Callback Query (Inline-Button Klick)
    if (update.callback_query) {
      await handleCallbackQuery(update);
      return NextResponse.json({ ok: true });
    }

    // Normale Nachricht
    if (update.message) {
      await handleMessage(update);
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[Paid-Bot] Webhook Error:", error);
    
    // Telegram erwartet immer 200, sonst werden Retries gesendet
    return NextResponse.json({ ok: false, error: "Internal error" });
  }
}

/**
 * GET /api/telegram/paid-group/webhook
 * Für Webhook-Verifizierung
 */
export async function GET() {
  return NextResponse.json({
    status: "Telegram Paid Group Bot Webhook aktiv",
    bot: "paid-group",
  });
}

// ==========================================
// MESSAGE HANDLER
// ==========================================

async function handleMessage(update: TelegramUpdate) {
  const message = update.message!;
  const chatId = message.chat.id;
  const userId = message.from?.id;
  const text = message.text?.trim() || "";
  
  if (!userId) return;

  // Nur private Nachrichten verarbeiten (nicht Gruppennachrichten)
  if (message.chat.type !== "private") {
    // In Gruppen nur FAQ prüfen
    if (text && !text.startsWith("/")) {
      await handleFaqQuery(chatId, text, userId);
    }
    return;
  }

  // Command extrahieren
  const command = text.startsWith("/") ? text.split(" ")[0].toLowerCase() : null;

  // Nutzer in Datenbank sichern/aktualisieren
  await ensureMemberExists(userId, message.from);

  switch (command) {
    case "/start":
      await handleStartCommand(userId, message.from);
      break;
      
    case "/help":
    case "/hilfe":
      await sendMessage(getHelpMessage(userId));
      break;
      
    case "/status":
      await handleStatusCommand(userId);
      break;
      
    case "/manage":
    case "/verwalten":
      await handleManageCommand(userId);
      break;
      
    default:
      // Keine Command - prüfe ob FAQ Match
      if (text) {
        const faqHandled = await handleFaqQuery(chatId, text, userId);
        
        if (!faqHandled) {
          // Fallback-Antwort
          await sendMessage({
            chat_id: userId,
            text: "Ich habe deine Nachricht erhalten. Nutze /help für verfügbare Befehle oder /start für das Hauptmenü.",
            parse_mode: "Markdown",
          });
        }
      }
  }
}

// ==========================================
// COMMAND HANDLERS
// ==========================================

async function handleStartCommand(
  userId: number,
  from?: { first_name: string; last_name?: string; username?: string }
) {
  await logActivity({
    action_type: "admin_action",
    telegram_user_id: userId,
    details: { command: "/start", from },
  });

  await sendMessage(getWelcomeMessage(userId));
}

async function handleStatusCommand(userId: number) {
  const member = await getMemberByTelegramId(userId);

  if (member && member.subscription_status === "active") {
    const expiresAt = member.subscription_expires_at
      ? new Date(member.subscription_expires_at).toLocaleDateString("de-DE")
      : undefined;
    await sendMessage(getStatusActiveMessage(userId, expiresAt));
  } else {
    await sendMessage(getStatusInactiveMessage(userId));
  }
}

async function handleManageCommand(userId: number) {
  const manageUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "https://www.snttrades.de"}/telegram-account`;
  
  await sendMessage({
    chat_id: userId,
    text: `⚙️ *Abo verwalten*

Klicke auf den Button um dein Abonnement zu verwalten:`,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "⚙️ Zur Verwaltung", url: manageUrl }],
        [{ text: "🔙 Zurück zum Start", callback_data: "start" }],
      ],
    },
  });
}

// ==========================================
// CALLBACK QUERY HANDLER
// ==========================================

async function handleCallbackQuery(update: TelegramUpdate) {
  const query = update.callback_query!;
  const userId = query.from.id;
  const data = query.data || "";

  // Callback immer beantworten
  await answerCallbackQuery(query.id);

  // Verifizierungs-Callback
  if (data.startsWith("verify_")) {
    const code = data.replace("verify_", "");
    const result = await confirmVerification(userId, code);

    if (result.success) {
      await sendMessage({
        chat_id: userId,
        text: "✅ *Verifizierung erfolgreich!*\n\nDein Telegram-Account wurde verknüpft.",
        parse_mode: "Markdown",
      });
    } else {
      await sendMessage({
        chat_id: userId,
        text: `❌ Verifizierung fehlgeschlagen: ${result.error}`,
        parse_mode: "Markdown",
      });
    }
    return;
  }

  // Navigation Callbacks
  switch (data) {
    case "start":
      await sendMessage(getWelcomeMessage(userId));
      break;
      
    case "help":
      await sendMessage(getHelpMessage(userId));
      break;
      
    case "status":
      await handleStatusCommand(userId);
      break;
      
    default:
      console.log(`[Paid-Bot] Unbekannter Callback: ${data}`);
  }
}

// ==========================================
// CHAT MEMBER UPDATE HANDLER
// ==========================================

async function handleChatMemberUpdate(update: TelegramUpdate) {
  const memberUpdate = update.my_chat_member!;
  const chatId = memberUpdate.chat.id;
  const userId = memberUpdate.from.id;
  const newStatus = memberUpdate.new_chat_member.status;
  const oldStatus = memberUpdate.old_chat_member.status;

  // Nur Updates für unsere Gruppe verarbeiten
  try {
    const groupId = getGroupId();
    if (chatId.toString() !== groupId) {
      return;
    }
  } catch {
    // GROUP_ID nicht konfiguriert
    return;
  }

  console.log(`[Paid-Bot] Chat Member Update: User ${userId} von ${oldStatus} zu ${newStatus}`);

  // User tritt Gruppe bei
  if (
    newStatus === "member" &&
    (oldStatus === "left" || oldStatus === "kicked")
  ) {
    await markMemberJoinedGroup(userId);
    
    // Willkommensnachricht in der Gruppe (optional)
    // await sendMessage({
    //   chat_id: chatId,
    //   text: `Willkommen ${memberUpdate.from.first_name}! 🎉`,
    // });
  }

  // User verlässt Gruppe
  if (
    (newStatus === "left" || newStatus === "kicked") &&
    oldStatus === "member"
  ) {
    const reason = newStatus === "kicked" ? "kicked" : "left";
    await markMemberLeftGroup(userId, reason);
  }

  // User wird gebannt
  if (newStatus === "kicked" && oldStatus !== "kicked") {
    await markMemberLeftGroup(userId, "banned");
  }
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

async function ensureMemberExists(
  userId: number,
  from?: { first_name: string; last_name?: string; username?: string }
) {
  const existing = await getMemberByTelegramId(userId);

  if (!existing) {
    await createMember({
      telegram_user_id: userId,
      telegram_first_name: from?.first_name,
      telegram_last_name: from?.last_name,
      telegram_username: from?.username,
      added_by: "system",
    });
  }
}

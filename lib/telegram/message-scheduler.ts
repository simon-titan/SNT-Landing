/**
 * Message Scheduler für Telegram Paid-Gruppe
 * 
 * Verarbeitet geplante und wiederkehrende Nachrichten.
 * Kann über Vercel Cron Jobs aufgerufen werden.
 */

import { supabaseAdmin } from "../supabase/client";
import { sendMessage, getGroupId, getGoodMorningMessage } from "./paid-group-bot";
import { sendMessageViaTdlib, isTdlibConfigured } from "./tdlib-client";
import { logActivity } from "./group-management";

interface ScheduledMessage {
  id: string;
  message_text: string;
  message_type: string;
  sender_type: "bot" | "user_1" | "user_2";
  scheduled_at: string;
  timezone: string;
  is_recurring: boolean;
  recurring_pattern: "daily" | "weekly" | "monthly" | null;
  recurring_time: string | null;
  recurring_days: number[] | null;
  next_run_at: string | null;
  is_active: boolean;
  is_sent: boolean;
}

/**
 * Holt alle fälligen Nachrichten
 */
async function getDueMessages(): Promise<ScheduledMessage[]> {
  const now = new Date().toISOString();

  // Einmalige Nachrichten die fällig sind
  const { data: oneTimeMessages, error: oneTimeError } = await supabaseAdmin
    .from("telegram_scheduled_messages")
    .select("*")
    .eq("is_active", true)
    .eq("is_sent", false)
    .eq("is_recurring", false)
    .lte("scheduled_at", now);

  if (oneTimeError) {
    console.error("Fehler beim Abrufen einmaliger Nachrichten:", oneTimeError);
  }

  // Wiederkehrende Nachrichten die fällig sind
  const { data: recurringMessages, error: recurringError } = await supabaseAdmin
    .from("telegram_scheduled_messages")
    .select("*")
    .eq("is_active", true)
    .eq("is_recurring", true)
    .lte("next_run_at", now);

  if (recurringError) {
    console.error("Fehler beim Abrufen wiederkehrender Nachrichten:", recurringError);
  }

  return [...(oneTimeMessages || []), ...(recurringMessages || [])] as ScheduledMessage[];
}

/**
 * Sendet eine Nachricht über den richtigen Kanal
 */
async function sendScheduledMessage(
  message: ScheduledMessage
): Promise<{ success: boolean; error?: string }> {
  const groupId = getGroupId();
  
  // Text vorbereiten (Good Morning Template ersetzen)
  let text = message.message_text;
  if (message.message_type === "good_morning" && text === "{{GOOD_MORNING}}") {
    text = getGoodMorningMessage();
  }

  // Sender bestimmen
  if (message.sender_type === "bot") {
    // Über Bot API senden
    try {
      await sendMessage({
        chat_id: groupId,
        text,
        parse_mode: "Markdown",
      });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  } else {
    // Über TDLib (User Account) senden
    if (!isTdlibConfigured()) {
      // Fallback zu Bot wenn TDLib nicht konfiguriert
      console.log("TDLib nicht konfiguriert - Fallback zu Bot");
      try {
        await sendMessage({
          chat_id: groupId,
          text,
          parse_mode: "Markdown",
        });
        return { success: true };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    }

    // Über TDLib senden
    return sendMessageViaTdlib(message.sender_type, {
      chatId: groupId,
      text,
      parseMode: "markdown",
    });
  }
}

/**
 * Berechnet das nächste Ausführungsdatum für wiederkehrende Nachrichten
 */
function calculateNextRun(message: ScheduledMessage): Date | null {
  if (!message.is_recurring || !message.recurring_pattern) {
    return null;
  }

  const now = new Date();
  const currentRun = message.next_run_at ? new Date(message.next_run_at) : now;

  switch (message.recurring_pattern) {
    case "daily":
      // Nächster Tag, gleiche Uhrzeit
      const nextDaily = new Date(currentRun);
      nextDaily.setDate(nextDaily.getDate() + 1);
      return nextDaily;

    case "weekly":
      // Nächste Woche, gleicher Tag und Uhrzeit
      const nextWeekly = new Date(currentRun);
      nextWeekly.setDate(nextWeekly.getDate() + 7);
      return nextWeekly;

    case "monthly":
      // Nächster Monat, gleicher Tag und Uhrzeit
      const nextMonthly = new Date(currentRun);
      nextMonthly.setMonth(nextMonthly.getMonth() + 1);
      return nextMonthly;

    default:
      return null;
  }
}

/**
 * Aktualisiert eine Nachricht nach dem Senden
 */
async function updateMessageAfterSend(
  message: ScheduledMessage,
  success: boolean,
  error?: string
): Promise<void> {
  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (success) {
    if (message.is_recurring) {
      // Nächste Ausführung berechnen
      const nextRun = calculateNextRun(message);
      if (nextRun) {
        updates.next_run_at = nextRun.toISOString();
      }
    } else {
      // Einmalige Nachricht als gesendet markieren
      updates.is_sent = true;
      updates.sent_at = new Date().toISOString();
    }
  } else {
    updates.send_error = error;
  }

  await supabaseAdmin
    .from("telegram_scheduled_messages")
    .update(updates)
    .eq("id", message.id);
}

/**
 * Hauptfunktion: Verarbeitet alle fälligen Nachrichten
 * 
 * Sollte regelmäßig aufgerufen werden (z.B. alle 1-5 Minuten via Cron)
 */
export async function processScheduledMessages(): Promise<{
  processed: number;
  sent: number;
  errors: number;
}> {
  const stats = { processed: 0, sent: 0, errors: 0 };

  try {
    const messages = await getDueMessages();
    console.log(`[Scheduler] ${messages.length} fällige Nachrichten gefunden`);

    for (const message of messages) {
      stats.processed++;

      const result = await sendScheduledMessage(message);

      if (result.success) {
        stats.sent++;
        console.log(`[Scheduler] Nachricht ${message.id} gesendet`);
        
        await logActivity({
          action_type: "message_sent",
          message_id: message.id,
          details: {
            message_type: message.message_type,
            sender_type: message.sender_type,
            is_recurring: message.is_recurring,
          },
        });
      } else {
        stats.errors++;
        console.error(`[Scheduler] Fehler bei Nachricht ${message.id}:`, result.error);
        
        await logActivity({
          action_type: "message_failed",
          message_id: message.id,
          error_message: result.error,
          details: {
            message_type: message.message_type,
            sender_type: message.sender_type,
          },
        });
      }

      await updateMessageAfterSend(message, result.success, result.error);
    }
  } catch (error) {
    console.error("[Scheduler] Kritischer Fehler:", error);
  }

  return stats;
}

/**
 * Erstellt eine "Guten Morgen" Nachricht für jeden Tag
 */
export async function createDailyGoodMorning(
  time: string = "08:00",
  senderType: "bot" | "user_1" | "user_2" = "bot"
): Promise<void> {
  // Nächsten 08:00 Uhr berechnen
  const now = new Date();
  const [hours, minutes] = time.split(":").map(Number);
  
  let scheduledAt = new Date();
  scheduledAt.setHours(hours, minutes, 0, 0);
  
  if (scheduledAt <= now) {
    scheduledAt.setDate(scheduledAt.getDate() + 1);
  }

  await supabaseAdmin.from("telegram_scheduled_messages").insert({
    message_text: "{{GOOD_MORNING}}", // Wird durch Template ersetzt
    message_type: "good_morning",
    sender_type: senderType,
    scheduled_at: scheduledAt.toISOString(),
    timezone: "Europe/Berlin",
    is_recurring: true,
    recurring_pattern: "daily",
    recurring_time: time,
    next_run_at: scheduledAt.toISOString(),
    is_active: true,
    is_sent: false,
    created_by: "system",
  });

  console.log(`[Scheduler] Tägliche Guten-Morgen-Nachricht erstellt für ${time}`);
}

/**
 * Hilfsfunktion: Alle aktiven wiederkehrenden Nachrichten auflisten
 */
export async function listRecurringMessages(): Promise<ScheduledMessage[]> {
  const { data, error } = await supabaseAdmin
    .from("telegram_scheduled_messages")
    .select("*")
    .eq("is_active", true)
    .eq("is_recurring", true)
    .order("next_run_at", { ascending: true });

  if (error) {
    console.error("Fehler beim Abrufen wiederkehrender Nachrichten:", error);
    return [];
  }

  return data as ScheduledMessage[];
}

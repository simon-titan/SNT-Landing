/**
 * Channel Scheduler - Verarbeitet geplante Nachrichten für den Channel Bot
 * 
 * Features:
 * - Zufällige Verzögerung (0-N Minuten nach geplanter Zeit)
 * - Unterstützung für alle Medientypen
 * - Wiederkehrende Nachrichten (täglich, wöchentlich, bestimmte Tage)
 * - Korrekte Zeitzonenbehandlung (Europe/Berlin)
 */

import { supabaseAdmin } from "../supabase/client";
import {
  sendTextMessage,
  sendPhoto,
  sendVideo,
  sendVoice,
  sendDocument,
  sendAnimation,
  MediaType,
} from "./channel-bot";

// ============================================
// Timezone Helpers (Europe/Berlin)
// ============================================

const TIMEZONE = "Europe/Berlin";

/**
 * Erstellt ein Date-Objekt für eine bestimmte lokale Zeit in Europe/Berlin
 */
function createDateInTimezone(year: number, month: number, day: number, hours: number, minutes: number): Date {
  const localTimeStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`;
  const tempDate = new Date(localTimeStr);
  const utcDate = new Date(tempDate.toLocaleString("en-US", { timeZone: "UTC" }));
  const berlinDate = new Date(tempDate.toLocaleString("en-US", { timeZone: TIMEZONE }));
  const offsetMs = utcDate.getTime() - berlinDate.getTime();
  return new Date(tempDate.getTime() + offsetMs);
}

/**
 * Holt die aktuelle Zeit in der Berlin-Zeitzone
 */
function getNowInBerlin(): { year: number; month: number; day: number; hours: number; minutes: number; dayOfWeek: number; date: Date } {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("de-DE", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    weekday: "short",
    hour12: false,
  });
  
  const parts = formatter.formatToParts(now);
  const getPart = (type: string) => parts.find(p => p.type === type)?.value || "0";
  
  return {
    year: parseInt(getPart("year")),
    month: parseInt(getPart("month")) - 1,
    day: parseInt(getPart("day")),
    hours: parseInt(getPart("hour")),
    minutes: parseInt(getPart("minute")),
    dayOfWeek: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"].indexOf(getPart("weekday").replace(".", "")),
    date: now,
  };
}

// ============================================
// Types
// ============================================

interface ScheduledMessage {
  id: string;
  message_text?: string;
  media_type?: MediaType;
  media_file_id?: string;
  caption?: string;
  target_channel_id: string;
  scheduled_at: string;
  timezone: string;
  is_recurring: boolean;
  recurring_pattern?: "daily" | "weekly" | "specific_days";
  recurring_time?: string;
  recurring_days?: number[];
  next_run_at?: string;
  random_delay_minutes: number;
  is_active: boolean;
  is_sent: boolean;
  bot_type: string;
  created_by?: string;
}

interface ProcessingResult {
  processed: number;
  sent: number;
  errors: number;
  skipped: number;
  details: Array<{
    id: string;
    status: "sent" | "error" | "skipped";
    message?: string;
  }>;
}

// ============================================
// Random Delay Logic
// ============================================

/**
 * Prüft ob eine Nachricht jetzt gesendet werden soll
 * basierend auf geplanter Zeit + Zufallsverzögerung
 */
function shouldSendNow(message: ScheduledMessage): boolean {
  const now = new Date();
  const scheduledTime = new Date(message.next_run_at || message.scheduled_at);
  
  // Noch nicht fällig
  if (scheduledTime > now) {
    return false;
  }
  
  // Berechne maximale Verzögerungszeit
  const maxDelayMs = (message.random_delay_minutes || 0) * 60 * 1000;
  const windowEnd = new Date(scheduledTime.getTime() + maxDelayMs);
  
  // Wenn Fenster abgelaufen, sofort senden
  if (now >= windowEnd) {
    return true;
  }
  
  // Zufällige Entscheidung innerhalb des Fensters
  // Je näher am Fenster-Ende, desto höher die Wahrscheinlichkeit
  const elapsed = now.getTime() - scheduledTime.getTime();
  const remaining = windowEnd.getTime() - now.getTime();
  const probability = elapsed / (elapsed + remaining);
  
  return Math.random() < probability;
}

/**
 * Berechnet eine zufällige Verzögerung in Millisekunden
 */
function getRandomDelay(maxMinutes: number): number {
  return Math.floor(Math.random() * maxMinutes * 60 * 1000);
}

// ============================================
// Message Sending
// ============================================

async function sendScheduledMessage(message: ScheduledMessage): Promise<{ success: boolean; error?: string }> {
  const channelId = message.target_channel_id;
  
  if (!channelId) {
    return { success: false, error: "Kein Ziel-Kanal konfiguriert" };
  }

  try {
    // Bestimme Medientyp und sende entsprechend
    const mediaType = message.media_type;
    
    if (mediaType && mediaType !== "text" && message.media_file_id) {
      // Medien-Nachricht
      switch (mediaType) {
        case "photo":
          await sendPhoto(channelId, message.media_file_id, message.caption);
          break;
        case "video":
          await sendVideo(channelId, message.media_file_id, message.caption);
          break;
        case "voice":
          await sendVoice(channelId, message.media_file_id, message.caption);
          break;
        case "document":
          await sendDocument(channelId, message.media_file_id, message.caption);
          break;
        case "animation":
          await sendAnimation(channelId, message.media_file_id, message.caption);
          break;
        default:
          return { success: false, error: `Unbekannter Medientyp: ${mediaType}` };
      }
    } else if (message.message_text) {
      // Text-Nachricht
      await sendTextMessage(channelId, message.message_text);
    } else {
      return { success: false, error: "Weder Text noch Medien vorhanden" };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unbekannter Fehler",
    };
  }
}

// ============================================
// Next Run Calculation
// ============================================

function calculateNextRun(message: ScheduledMessage): Date | null {
  if (!message.is_recurring) {
    return null;
  }

  const berlin = getNowInBerlin();
  const [hours, minutes] = (message.recurring_time || "08:00").split(":").map(Number);

  switch (message.recurring_pattern) {
    case "daily": {
      // Nächster Tag, gleiche Uhrzeit (in Berlin-Zeitzone)
      return createDateInTimezone(berlin.year, berlin.month, berlin.day + 1, hours, minutes);
    }

    case "weekly": {
      // Nächste Woche, gleicher Tag (in Berlin-Zeitzone)
      return createDateInTimezone(berlin.year, berlin.month, berlin.day + 7, hours, minutes);
    }

    case "specific_days": {
      // Nächster passender Wochentag
      if (!message.recurring_days || message.recurring_days.length === 0) {
        return null;
      }

      const currentDay = berlin.dayOfWeek;
      const sortedDays = [...message.recurring_days].sort((a, b) => a - b);
      
      // Finde den nächsten Tag nach dem aktuellen
      for (const day of sortedDays) {
        if (day > currentDay) {
          const daysUntil = day - currentDay;
          return createDateInTimezone(berlin.year, berlin.month, berlin.day + daysUntil, hours, minutes);
        }
      }
      
      // Wrap around zur nächsten Woche
      const firstDay = sortedDays[0];
      const daysUntilNext = (7 - currentDay) + firstDay;
      return createDateInTimezone(berlin.year, berlin.month, berlin.day + daysUntilNext, hours, minutes);
    }

    default:
      return null;
  }
}

// ============================================
// Database Operations
// ============================================

async function getDueMessages(): Promise<ScheduledMessage[]> {
  const now = new Date();
  
  // Hole Nachrichten die maximal 15 Minuten in der Vergangenheit liegen
  // (um das Zufallsfenster zu berücksichtigen)
  const windowStart = new Date(now.getTime() - 15 * 60 * 1000);

  // Einmalige Nachrichten
  const { data: oneTime, error: oneTimeError } = await supabaseAdmin
    .from("telegram_scheduled_messages")
    .select("*")
    .eq("bot_type", "channel_bot")
    .eq("is_active", true)
    .eq("is_sent", false)
    .eq("is_recurring", false)
    .gte("scheduled_at", windowStart.toISOString())
    .lte("scheduled_at", now.toISOString());

  if (oneTimeError) {
    console.error("[Channel Scheduler] Fehler bei einmaligen Nachrichten:", oneTimeError);
  }

  // Wiederkehrende Nachrichten
  const { data: recurring, error: recurringError } = await supabaseAdmin
    .from("telegram_scheduled_messages")
    .select("*")
    .eq("bot_type", "channel_bot")
    .eq("is_active", true)
    .eq("is_recurring", true)
    .gte("next_run_at", windowStart.toISOString())
    .lte("next_run_at", now.toISOString());

  if (recurringError) {
    console.error("[Channel Scheduler] Fehler bei wiederkehrenden Nachrichten:", recurringError);
  }

  return [...(oneTime || []), ...(recurring || [])] as ScheduledMessage[];
}

async function markMessageSent(message: ScheduledMessage, success: boolean, error?: string): Promise<void> {
  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (success) {
    if (message.is_recurring) {
      // Nächste Ausführung berechnen
      const nextRun = calculateNextRun(message);
      if (nextRun) {
        updates.next_run_at = nextRun.toISOString();
      } else {
        // Keine weiteren Ausführungen möglich
        updates.is_active = false;
      }
      updates.last_sent_at = new Date().toISOString();
    } else {
      // Einmalige Nachricht als gesendet markieren
      updates.is_sent = true;
      updates.sent_at = new Date().toISOString();
    }
  } else {
    updates.send_error = error;
    updates.last_error_at = new Date().toISOString();
  }

  await supabaseAdmin
    .from("telegram_scheduled_messages")
    .update(updates)
    .eq("id", message.id);
}

async function logSchedulerActivity(
  messageId: string,
  action: "sent" | "error" | "skipped",
  details?: Record<string, unknown>
): Promise<void> {
  try {
    await supabaseAdmin.from("telegram_activity_log").insert({
      action_type: `channel_scheduler_${action}`,
      message_id: messageId,
      details,
      created_at: new Date().toISOString(),
    });
  } catch (error) {
    // Log-Fehler nicht kritisch behandeln
    console.error("[Channel Scheduler] Logging-Fehler:", error);
  }
}

// ============================================
// Main Processing Function
// ============================================

/**
 * Hauptfunktion: Verarbeitet alle fälligen Channel-Nachrichten
 * 
 * Sollte regelmäßig via Cron aufgerufen werden (empfohlen: alle 1-2 Minuten)
 */
export async function processChannelMessages(): Promise<ProcessingResult> {
  const result: ProcessingResult = {
    processed: 0,
    sent: 0,
    errors: 0,
    skipped: 0,
    details: [],
  };

  try {
    const messages = await getDueMessages();
    console.log(`[Channel Scheduler] ${messages.length} potentielle Nachrichten gefunden`);

    for (const message of messages) {
      result.processed++;

      // Prüfe ob Nachricht jetzt gesendet werden soll (Zufallslogik)
      if (!shouldSendNow(message)) {
        result.skipped++;
        result.details.push({
          id: message.id,
          status: "skipped",
          message: "Innerhalb des Zufallsfensters - wird später gesendet",
        });
        continue;
      }

      // Nachricht senden
      const sendResult = await sendScheduledMessage(message);

      if (sendResult.success) {
        result.sent++;
        console.log(`[Channel Scheduler] Nachricht ${message.id.substring(0, 8)} gesendet`);
        
        result.details.push({
          id: message.id,
          status: "sent",
        });

        await logSchedulerActivity(message.id, "sent", {
          media_type: message.media_type || "text",
          is_recurring: message.is_recurring,
          target_channel: message.target_channel_id,
        });
      } else {
        result.errors++;
        console.error(`[Channel Scheduler] Fehler bei ${message.id.substring(0, 8)}:`, sendResult.error);
        
        result.details.push({
          id: message.id,
          status: "error",
          message: sendResult.error,
        });

        await logSchedulerActivity(message.id, "error", {
          error: sendResult.error,
          media_type: message.media_type || "text",
        });
      }

      // Nachricht in DB aktualisieren
      await markMessageSent(message, sendResult.success, sendResult.error);
    }
  } catch (error) {
    console.error("[Channel Scheduler] Kritischer Fehler:", error);
  }

  console.log(`[Channel Scheduler] Ergebnis: ${result.sent} gesendet, ${result.skipped} übersprungen, ${result.errors} Fehler`);
  return result;
}

/**
 * Hilfsfunktion: Statistiken abrufen
 */
export async function getSchedulerStats(): Promise<{
  activeOneTime: number;
  activeRecurring: number;
  sentToday: number;
  errorsToday: number;
}> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [oneTime, recurring, sentToday, errorsToday] = await Promise.all([
    supabaseAdmin
      .from("telegram_scheduled_messages")
      .select("id", { count: "exact" })
      .eq("bot_type", "channel_bot")
      .eq("is_active", true)
      .eq("is_recurring", false)
      .eq("is_sent", false),

    supabaseAdmin
      .from("telegram_scheduled_messages")
      .select("id", { count: "exact" })
      .eq("bot_type", "channel_bot")
      .eq("is_active", true)
      .eq("is_recurring", true),

    supabaseAdmin
      .from("telegram_scheduled_messages")
      .select("id", { count: "exact" })
      .eq("bot_type", "channel_bot")
      .gte("sent_at", today.toISOString()),

    supabaseAdmin
      .from("telegram_scheduled_messages")
      .select("id", { count: "exact" })
      .eq("bot_type", "channel_bot")
      .gte("last_error_at", today.toISOString()),
  ]);

  return {
    activeOneTime: oneTime.count || 0,
    activeRecurring: recurring.count || 0,
    sentToday: sentToday.count || 0,
    errorsToday: errorsToday.count || 0,
  };
}

/**
 * Hilfsfunktion: Manuell eine Nachricht sofort senden (für Tests)
 */
export async function sendMessageNow(messageId: string): Promise<{ success: boolean; error?: string }> {
  const { data: message, error } = await supabaseAdmin
    .from("telegram_scheduled_messages")
    .select("*")
    .eq("id", messageId)
    .single();

  if (error || !message) {
    return { success: false, error: "Nachricht nicht gefunden" };
  }

  const result = await sendScheduledMessage(message as ScheduledMessage);
  
  if (result.success) {
    await markMessageSent(message as ScheduledMessage, true);
  }

  return result;
}

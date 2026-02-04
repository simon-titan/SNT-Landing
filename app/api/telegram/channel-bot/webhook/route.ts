/**
 * Webhook Handler für den Channel Bot (SNTTeleBot)
 * 
 * Empfängt Updates von Telegram und leitet sie an den Bot weiter.
 */

import { NextRequest, NextResponse } from "next/server";
import { handleUpdate, TelegramUpdate } from "@/lib/telegram/channel-bot";

export const runtime = "nodejs";

// Verhindere Caching
export const dynamic = "force-dynamic";

/**
 * POST /api/telegram/channel-bot/webhook
 * Telegram sendet Updates an diese Route
 */
export async function POST(request: NextRequest) {
  try {
    // Verify Token (optional, aber empfohlen)
    const secretToken = request.headers.get("X-Telegram-Bot-Api-Secret-Token");
    const expectedToken = process.env.CHANNEL_BOT_WEBHOOK_SECRET;
    
    if (expectedToken && secretToken !== expectedToken) {
      console.warn("[Channel Bot Webhook] Invalid secret token");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse Update
    const update: TelegramUpdate = await request.json();
    
    // Log für Debugging (kann später entfernt werden)
    console.log("[Channel Bot Webhook] Received update:", {
      update_id: update.update_id,
      type: update.message ? "message" : update.callback_query ? "callback_query" : "unknown",
      chat_type: update.message?.chat?.type,
      from: update.message?.from?.username || update.message?.from?.id,
    });

    // Verarbeite Update
    await handleUpdate(update);

    // Telegram erwartet 200 OK
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[Channel Bot Webhook] Error:", error);
    
    // Trotzdem 200 zurückgeben, damit Telegram nicht retry
    // (Fehler werden geloggt)
    return NextResponse.json({ ok: true });
  }
}

/**
 * GET /api/telegram/channel-bot/webhook
 * Health Check Endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    bot: "SNTTeleBot (Channel Bot)",
    timestamp: new Date().toISOString(),
  });
}

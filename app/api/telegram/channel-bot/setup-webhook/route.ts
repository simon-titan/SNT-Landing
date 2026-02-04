/**
 * Webhook Setup für den Channel Bot (SNTTeleBot)
 * 
 * Registriert den Webhook bei Telegram.
 * Aufruf: GET /api/telegram/channel-bot/setup-webhook
 */

import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const BOT_TOKEN = process.env.TELEGRAM_AUTOMATISATION_BOT;
const WEBHOOK_SECRET = process.env.CHANNEL_BOT_WEBHOOK_SECRET;

/**
 * GET /api/telegram/channel-bot/setup-webhook
 * Registriert den Webhook bei Telegram
 */
export async function GET(request: NextRequest) {
  if (!BOT_TOKEN) {
    return NextResponse.json(
      { error: "TELEGRAM_AUTOMATISATION_BOT nicht konfiguriert" },
      { status: 500 }
    );
  }

  // Webhook URL ermitteln
  const host = request.headers.get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";
  const webhookUrl = `${protocol}://${host}/api/telegram/channel-bot/webhook`;

  try {
    // Alten Webhook entfernen
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/deleteWebhook`);

    // Neuen Webhook setzen
    const params: Record<string, string> = {
      url: webhookUrl,
      allowed_updates: JSON.stringify(["message", "callback_query"]),
    };

    // Secret Token hinzufügen wenn konfiguriert
    if (WEBHOOK_SECRET) {
      params.secret_token = WEBHOOK_SECRET;
    }

    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      }
    );

    const result = await response.json();

    if (!result.ok) {
      return NextResponse.json(
        {
          success: false,
          error: result.description,
          webhook_url: webhookUrl,
        },
        { status: 500 }
      );
    }

    // Webhook Info abrufen
    const infoResponse = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo`
    );
    const webhookInfo = await infoResponse.json();

    return NextResponse.json({
      success: true,
      message: "Webhook erfolgreich eingerichtet",
      webhook_url: webhookUrl,
      webhook_info: webhookInfo.result,
    });
  } catch (error) {
    console.error("[Channel Bot Setup] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unbekannter Fehler",
        webhook_url: webhookUrl,
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/telegram/channel-bot/setup-webhook
 * Entfernt den Webhook
 */
export async function DELETE() {
  if (!BOT_TOKEN) {
    return NextResponse.json(
      { error: "TELEGRAM_AUTOMATISATION_BOT nicht konfiguriert" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/deleteWebhook`
    );
    const result = await response.json();

    return NextResponse.json({
      success: result.ok,
      message: result.ok ? "Webhook entfernt" : result.description,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unbekannter Fehler",
      },
      { status: 500 }
    );
  }
}

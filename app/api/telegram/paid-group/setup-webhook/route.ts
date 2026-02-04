/**
 * Setup Webhook für den Paid Group Bot
 * 
 * Rufe diese Route auf um den Webhook zu konfigurieren:
 * POST /api/telegram/paid-group/setup-webhook
 * 
 * Query Parameter:
 * - action: "set" (default) oder "delete" oder "info"
 */

import { NextRequest, NextResponse } from "next/server";
import {
  setWebhook,
  deleteWebhook,
  getWebhookInfo,
  getMe,
} from "@/lib/telegram/paid-group-bot";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action") || "set";

    // Bot-Info holen
    const botInfo = await getMe();
    console.log(`[Paid-Bot Setup] Bot: @${botInfo.username}`);

    if (action === "delete") {
      // Webhook löschen
      await deleteWebhook();
      return NextResponse.json({
        success: true,
        action: "delete",
        message: "Webhook gelöscht",
        bot: botInfo,
      });
    }

    if (action === "info") {
      // Webhook-Info abrufen
      const info = await getWebhookInfo();
      return NextResponse.json({
        success: true,
        action: "info",
        webhook: info,
        bot: botInfo,
      });
    }

    // Webhook setzen
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.snttrades.de";
    const webhookUrl = `${baseUrl}/api/telegram/paid-group/webhook`;

    await setWebhook(webhookUrl);

    // Info nach dem Setzen holen
    const info = await getWebhookInfo();

    return NextResponse.json({
      success: true,
      action: "set",
      message: `Webhook gesetzt auf ${webhookUrl}`,
      webhook: info,
      bot: botInfo,
    });
  } catch (error) {
    console.error("[Paid-Bot Setup] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // GET leitet zu POST mit action=info weiter
  try {
    const botInfo = await getMe();
    const webhookInfo = await getWebhookInfo();

    return NextResponse.json({
      success: true,
      bot: {
        id: botInfo.id,
        username: botInfo.username,
        first_name: botInfo.first_name,
      },
      webhook: webhookInfo,
      setup_url: `POST ${request.url}?action=set`,
      delete_url: `POST ${request.url}?action=delete`,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        hint: "Ist TELEGRAM_PAID_TOKEN korrekt konfiguriert?",
      },
      { status: 500 }
    );
  }
}

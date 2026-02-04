/**
 * Aktivierungs-API für die Telegram Paid-Gruppe
 * 
 * Wird von der Thank-You Seite aufgerufen um:
 * 1. Den Nutzer in der Datenbank zu aktivieren
 * 2. Einen Einladungslink zu generieren
 * 3. Den Link zurückzugeben oder per Telegram zu senden
 */

import { NextRequest, NextResponse } from "next/server";
import {
  activateSubscription,
  getMemberByTelegramId,
} from "@/lib/telegram/group-management";
import { TELEGRAM_PLANS } from "@/lib/telegram/paid-group-bot";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { telegram_user_id, provider, subscription_id, email, outseta_uid } = body;

    console.log("[Activate] Request:", { telegram_user_id, provider, subscription_id });

    if (!telegram_user_id) {
      return NextResponse.json(
        { success: false, error: "telegram_user_id ist erforderlich" },
        { status: 400 }
      );
    }

    const telegramUserId = parseInt(telegram_user_id);
    if (isNaN(telegramUserId)) {
      return NextResponse.json(
        { success: false, error: "telegram_user_id muss eine Zahl sein" },
        { status: 400 }
      );
    }

    // Prüfen ob Nutzer bereits aktiviert ist
    const existingMember = await getMemberByTelegramId(telegramUserId);
    if (existingMember?.subscription_status === "active" && existingMember?.is_in_group) {
      console.log("[Activate] Nutzer bereits aktiv:", telegramUserId);
      return NextResponse.json({
        success: true,
        message: "Nutzer ist bereits aktiv",
        already_active: true,
      });
    }

    // Plan basierend auf Provider bestimmen
    const plan = provider === "paypal" ? TELEGRAM_PLANS.paypal : TELEGRAM_PLANS.outseta;

    // Subscription aktivieren und Invite-Link generieren
    const result = await activateSubscription(telegramUserId, plan, {
      email,
      account_uid: outseta_uid,
    });

    if (result.success) {
      console.log("[Activate] Erfolgreich aktiviert:", {
        telegramUserId,
        inviteLink: result.inviteLink,
      });

      return NextResponse.json({
        success: true,
        message: "Subscription aktiviert",
        invite_link: result.inviteLink,
      });
    } else {
      console.error("[Activate] Fehler:", result.error);
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("[Activate] Exception:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unbekannter Fehler",
      },
      { status: 500 }
    );
  }
}

/**
 * GET - Prüft den Status eines Nutzers
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const telegramUserId = searchParams.get("telegram_user_id");

    if (!telegramUserId) {
      return NextResponse.json(
        { success: false, error: "telegram_user_id ist erforderlich" },
        { status: 400 }
      );
    }

    const member = await getMemberByTelegramId(parseInt(telegramUserId));

    if (!member) {
      return NextResponse.json({
        success: true,
        status: "not_found",
        is_active: false,
        is_in_group: false,
      });
    }

    return NextResponse.json({
      success: true,
      status: member.subscription_status,
      is_active: member.subscription_status === "active",
      is_in_group: member.is_in_group,
      subscription_plan: member.subscription_plan,
    });
  } catch (error) {
    console.error("[Activate GET] Exception:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unbekannter Fehler",
      },
      { status: 500 }
    );
  }
}

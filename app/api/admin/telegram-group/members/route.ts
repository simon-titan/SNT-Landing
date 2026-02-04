/**
 * Admin API für Telegram-Gruppe Mitglieder-Verwaltung
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAdminCredentials } from "@/lib/affiliates/admin-auth";
import {
  getAllMembers,
  getMemberByTelegramId,
  createMember,
  updateMember,
  activateSubscription,
  cancelSubscription,
  getGroupStats,
} from "@/lib/telegram/group-management";
import { TELEGRAM_PLANS } from "@/lib/telegram/paid-group-bot";

export const runtime = "nodejs";

/**
 * GET /api/admin/telegram-group/members
 * Holt alle Mitglieder mit optionalen Filtern
 */
export async function GET(request: NextRequest) {
  // Auth prüfen
  const authError = requireAdminCredentials(request);
  if (authError) {
    return authError;
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || undefined;
    const inGroup = searchParams.get("in_group");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");
    const includeStats = searchParams.get("stats") === "true";

    const filters: {
      status?: string;
      is_in_group?: boolean;
      limit: number;
      offset: number;
    } = { limit, offset };

    if (status) filters.status = status;
    if (inGroup !== null) filters.is_in_group = inGroup === "true";

    const { members, total } = await getAllMembers(filters);

    // Stats hinzufügen wenn gewünscht
    let stats = null;
    if (includeStats) {
      stats = await getGroupStats();
    }

    return NextResponse.json({
      success: true,
      members,
      total,
      limit,
      offset,
      stats,
    });
  } catch (error) {
    console.error("[Admin Members GET] Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/telegram-group/members
 * Erstellt ein neues Mitglied oder aktiviert ein bestehendes
 */
export async function POST(request: NextRequest) {
  const authError = requireAdminCredentials(request);
  if (authError) {
    return authError;
  }

  try {
    const body = await request.json();
    const {
      telegram_user_id,
      telegram_username,
      email,
      activate = false,
    } = body;

    if (!telegram_user_id) {
      return NextResponse.json(
        { error: "telegram_user_id ist erforderlich" },
        { status: 400 }
      );
    }

    const telegramUserId = parseInt(telegram_user_id);
    if (isNaN(telegramUserId)) {
      return NextResponse.json(
        { error: "telegram_user_id muss eine Zahl sein" },
        { status: 400 }
      );
    }

    // Prüfen ob Mitglied bereits existiert
    let member = await getMemberByTelegramId(telegramUserId);

    if (member) {
      // Mitglied existiert - aktualisieren wenn gewünscht
      if (activate && member.subscription_status !== "active") {
        const result = await activateSubscription(
          telegramUserId,
          TELEGRAM_PLANS.outseta,
          { email }
        );
        return NextResponse.json({
          success: true,
          action: "activated",
          member: await getMemberByTelegramId(telegramUserId),
          invite_link: result.inviteLink,
        });
      }
      
      return NextResponse.json({
        success: true,
        action: "exists",
        member,
      });
    }

    // Neues Mitglied erstellen
    member = await createMember({
      telegram_user_id: telegramUserId,
      telegram_username,
      outseta_email: email,
      added_by: "admin",
    });

    // Optional aktivieren
    if (activate) {
      const result = await activateSubscription(
        telegramUserId,
        TELEGRAM_PLANS.outseta,
        { email }
      );
      return NextResponse.json({
        success: true,
        action: "created_and_activated",
        member: await getMemberByTelegramId(telegramUserId),
        invite_link: result.inviteLink,
      });
    }

    return NextResponse.json({
      success: true,
      action: "created",
      member,
    });
  } catch (error) {
    console.error("[Admin Members POST] Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/telegram-group/members
 * Aktualisiert ein Mitglied
 */
export async function PUT(request: NextRequest) {
  const authError = requireAdminCredentials(request);
  if (authError) {
    return authError;
  }

  try {
    const body = await request.json();
    const { telegram_user_id, action, ...updates } = body;

    if (!telegram_user_id) {
      return NextResponse.json(
        { error: "telegram_user_id ist erforderlich" },
        { status: 400 }
      );
    }

    const telegramUserId = parseInt(telegram_user_id);

    // Spezielle Aktionen
    if (action === "activate") {
      const result = await activateSubscription(
        telegramUserId,
        TELEGRAM_PLANS.outseta
      );
      return NextResponse.json({
        success: result.success,
        invite_link: result.inviteLink,
        error: result.error,
      });
    }

    if (action === "cancel") {
      const reason = (body.reason as "cancelled" | "expired" | "manual" | "banned") || "manual";
      const result = await cancelSubscription(telegramUserId, reason);
      return NextResponse.json({
        success: result.success,
        error: result.error,
      });
    }

    // Normale Updates
    const member = await updateMember(telegramUserId, updates);

    return NextResponse.json({
      success: true,
      member,
    });
  } catch (error) {
    console.error("[Admin Members PUT] Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/telegram-group/members
 * Entfernt ein Mitglied (setzt Status auf cancelled)
 */
export async function DELETE(request: NextRequest) {
  const authError = requireAdminCredentials(request);
  if (authError) {
    return authError;
  }

  try {
    const { searchParams } = new URL(request.url);
    const telegramUserId = searchParams.get("telegram_user_id");
    const ban = searchParams.get("ban") === "true";

    if (!telegramUserId) {
      return NextResponse.json(
        { error: "telegram_user_id ist erforderlich" },
        { status: 400 }
      );
    }

    const result = await cancelSubscription(
      parseInt(telegramUserId),
      ban ? "banned" : "manual"
    );

    return NextResponse.json({
      success: result.success,
      error: result.error,
    });
  } catch (error) {
    console.error("[Admin Members DELETE] Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

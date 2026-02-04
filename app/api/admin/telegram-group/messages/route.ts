/**
 * Admin API für Telegram-Gruppe Nachrichten-Verwaltung
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAdminCredentials } from "@/lib/affiliates/admin-auth";
import { supabaseAdmin } from "@/lib/supabase/client";

export const runtime = "nodejs";

interface ScheduledMessage {
  id?: string;
  message_text: string;
  message_type: "good_morning" | "good_evening" | "signal" | "announcement" | "custom";
  sender_type: "bot" | "user_1" | "user_2";
  scheduled_at: string;
  timezone?: string;
  is_recurring: boolean;
  recurring_pattern?: "daily" | "weekly" | "monthly" | null;
  recurring_time?: string;
  recurring_days?: number[];
  is_active: boolean;
}

/**
 * GET /api/admin/telegram-group/messages
 * Holt alle geplanten Nachrichten
 */
export async function GET(request: NextRequest) {
  const authError = requireAdminCredentials(request);
  if (authError) {
    return authError;
  }

  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get("include_inactive") === "true";
    const includeSent = searchParams.get("include_sent") === "true";

    let query = supabaseAdmin
      .from("telegram_scheduled_messages")
      .select("*")
      .order("scheduled_at", { ascending: true });

    if (!includeInactive) {
      query = query.eq("is_active", true);
    }

    if (!includeSent) {
      query = query.eq("is_sent", false);
    }

    const { data: messages, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      messages,
      total: messages?.length || 0,
    });
  } catch (error) {
    console.error("[Admin Messages GET] Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/telegram-group/messages
 * Erstellt eine neue geplante Nachricht
 */
export async function POST(request: NextRequest) {
  const authError = requireAdminCredentials(request);
  if (authError) {
    return authError;
  }

  try {
    const body: ScheduledMessage = await request.json();

    if (!body.message_text) {
      return NextResponse.json(
        { error: "message_text ist erforderlich" },
        { status: 400 }
      );
    }

    if (!body.scheduled_at) {
      return NextResponse.json(
        { error: "scheduled_at ist erforderlich" },
        { status: 400 }
      );
    }

    // Nachricht erstellen
    const messageData = {
      message_text: body.message_text,
      message_type: body.message_type || "custom",
      sender_type: body.sender_type || "bot",
      scheduled_at: body.scheduled_at,
      timezone: body.timezone || "Europe/Berlin",
      is_recurring: body.is_recurring || false,
      recurring_pattern: body.recurring_pattern || null,
      recurring_time: body.recurring_time || null,
      recurring_days: body.recurring_days || null,
      next_run_at: body.is_recurring ? body.scheduled_at : null,
      is_active: body.is_active !== false,
      is_sent: false,
      created_by: "admin",
    };

    const { data: message, error } = await supabaseAdmin
      .from("telegram_scheduled_messages")
      .insert(messageData)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message,
    });
  } catch (error) {
    console.error("[Admin Messages POST] Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/telegram-group/messages
 * Aktualisiert eine geplante Nachricht
 */
export async function PUT(request: NextRequest) {
  const authError = requireAdminCredentials(request);
  if (authError) {
    return authError;
  }

  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: "id ist erforderlich" },
        { status: 400 }
      );
    }

    const { data: message, error } = await supabaseAdmin
      .from("telegram_scheduled_messages")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message,
    });
  } catch (error) {
    console.error("[Admin Messages PUT] Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/telegram-group/messages
 * Löscht eine geplante Nachricht
 */
export async function DELETE(request: NextRequest) {
  const authError = requireAdminCredentials(request);
  if (authError) {
    return authError;
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "id ist erforderlich" },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("telegram_scheduled_messages")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("[Admin Messages DELETE] Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

/**
 * Cron Job für Telegram Message Scheduler
 * 
 * Konfiguriere in vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/telegram-scheduler",
 *     "schedule": "0/5 * * * *"   // Alle 5 Minuten
 *   }]
 * }
 * 
 * Oder rufe manuell auf für Tests.
 */

import { NextRequest, NextResponse } from "next/server";
import { processScheduledMessages } from "@/lib/telegram/message-scheduler";

export const runtime = "nodejs";
export const maxDuration = 60; // Max 60 Sekunden für Cron Jobs

/**
 * GET /api/cron/telegram-scheduler
 * Wird von Vercel Cron aufgerufen
 */
export async function GET(request: NextRequest) {
  try {
    // Vercel Cron Authorization prüfen (optional aber empfohlen)
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      // Auch ohne Secret erlauben für manuelle Tests
      if (process.env.NODE_ENV === "production") {
        console.log("[Cron] Unauthorized request, aber in Production erlaubt");
      }
    }

    console.log("[Cron] Telegram Scheduler gestartet");
    
    const result = await processScheduledMessages();
    
    console.log("[Cron] Telegram Scheduler abgeschlossen:", result);

    return NextResponse.json({
      success: true,
      ...result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[Cron] Fehler:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/cron/telegram-scheduler
 * Für manuelle Tests mit Body
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    
    // Admin Auth prüfen für manuelle Aufrufe
    const adminUsername = request.headers.get("x-admin-username");
    const adminPassword = request.headers.get("x-admin-password");
    
    const expectedUsername = process.env.NEXT_PUBLIC_AFFILIATE_ADMIN_USERNAME || "admin";
    const expectedPassword = process.env.NEXT_PUBLIC_AFFILIATE_ADMIN_PASSWORD || "sntsecure";
    
    if (adminUsername !== expectedUsername || adminPassword !== expectedPassword) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("[Cron] Manueller Scheduler-Aufruf:", body);
    
    const result = await processScheduledMessages();

    return NextResponse.json({
      success: true,
      ...result,
      timestamp: new Date().toISOString(),
      manual: true,
    });
  } catch (error) {
    console.error("[Cron] Fehler:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

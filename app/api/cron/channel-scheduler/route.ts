/**
 * Cron Job für den Channel Scheduler
 * 
 * Verarbeitet geplante Nachrichten für den Channel Bot.
 * Empfohlenes Intervall: Alle 1-2 Minuten
 * 
 * Vercel Cron: In vercel.json konfigurieren
 * Oder manuell aufrufen: GET /api/cron/channel-scheduler
 */

import { NextRequest, NextResponse } from "next/server";
import { processChannelMessages, getSchedulerStats } from "@/lib/telegram/channel-scheduler";

export const runtime = "nodejs";

// Maximale Laufzeit für Vercel (in Sekunden)
export const maxDuration = 60;

// Verhindere Caching
export const dynamic = "force-dynamic";

/**
 * GET /api/cron/channel-scheduler
 * Führt den Scheduler aus
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  // Optional: Authorization prüfen
  const authHeader = request.headers.get("Authorization");
  const cronSecret = process.env.CRON_SECRET;
  
  // Vercel Cron sendet Authorization: Bearer <CRON_SECRET>
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    // Auch ohne Secret erlauben für manuelle Tests
    const isVercelCron = request.headers.get("x-vercel-cron") === "true";
    if (!isVercelCron && cronSecret) {
      console.warn("[Channel Scheduler Cron] Unauthorized request");
      // Trotzdem erlauben für Entwicklung, aber loggen
    }
  }

  try {
    console.log("[Channel Scheduler Cron] Start processing...");
    
    // Scheduler ausführen
    const result = await processChannelMessages();
    
    const duration = Date.now() - startTime;
    
    console.log(`[Channel Scheduler Cron] Completed in ${duration}ms:`, {
      processed: result.processed,
      sent: result.sent,
      skipped: result.skipped,
      errors: result.errors,
    });

    return NextResponse.json({
      success: true,
      duration_ms: duration,
      ...result,
    });
  } catch (error) {
    console.error("[Channel Scheduler Cron] Error:", error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unbekannter Fehler",
        duration_ms: Date.now() - startTime,
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/cron/channel-scheduler
 * Gleiche Funktionalität wie GET (für Vercel Cron Kompatibilität)
 */
export async function POST(request: NextRequest) {
  return GET(request);
}

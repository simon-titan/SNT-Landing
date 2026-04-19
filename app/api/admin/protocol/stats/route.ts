import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/client";

function authenticateAdmin(request: NextRequest) {
  const adminUsername = request.headers.get("x-admin-username");
  const adminPassword = request.headers.get("x-admin-password");
  const expectedUsername = process.env.NEXT_PUBLIC_AFFILIATE_ADMIN_USERNAME ?? "admin";
  const expectedPassword = process.env.NEXT_PUBLIC_AFFILIATE_ADMIN_PASSWORD ?? "sntsecure";
  return adminUsername === expectedUsername && adminPassword === expectedPassword;
}

function getPeriodStart(period: string): string | null {
  const now = new Date();
  if (period === "today") {
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return start.toISOString();
  }
  if (period === "week") {
    const start = new Date(now);
    start.setDate(now.getDate() - 7);
    return start.toISOString();
  }
  if (period === "month") {
    const start = new Date(now);
    start.setDate(now.getDate() - 30);
    return start.toISOString();
  }
  return null;
}

export async function GET(request: NextRequest) {
  try {
    if (!authenticateAdmin(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") ?? "all";
    const since = getPeriodStart(period);

    // Funnel-Events zählen
    const eventTypes = [
      "page_view",
      "form_open",
      "step_1_complete",
      "step_2_complete",
      "step_3_complete",
      "form_submit",
      "calendly_redirect",
      "calendly_booked",
    ] as const;

    const eventCounts: Record<string, number> = {};

    for (const eventType of eventTypes) {
      let query = supabaseAdmin
        .from("protocol_funnel_events")
        .select("id", { count: "exact", head: true })
        .eq("event_type", eventType);

      if (since) {
        query = query.gte("created_at", since);
      }

      const { count } = await query;
      eventCounts[eventType] = count ?? 0;
    }

    // Lead-Zahlen
    let leadsQuery = supabaseAdmin
      .from("protocol_leads")
      .select("id, status", { count: "exact" });

    if (since) {
      leadsQuery = leadsQuery.gte("created_at", since);
    }

    const { data: leads, count: totalLeads } = await leadsQuery;

    const statusCounts = {
      submitted: 0,
      booked: 0,
      completed: 0,
      no_show: 0,
    };

    (leads ?? []).forEach((l) => {
      const s = l.status as keyof typeof statusCounts;
      if (s in statusCounts) statusCounts[s]++;
    });

    const pageViews = eventCounts["page_view"] ?? 0;
    const formOpens = eventCounts["form_open"] ?? 0;
    const submissions = totalLeads ?? 0;
    const bookings = statusCounts.booked + statusCounts.completed;

    return NextResponse.json({
      period,
      funnel: {
        page_views: pageViews,
        form_opens: formOpens,
        step_1_complete: eventCounts["step_1_complete"] ?? 0,
        step_2_complete: eventCounts["step_2_complete"] ?? 0,
        step_3_complete: eventCounts["step_3_complete"] ?? 0,
        form_submits: eventCounts["form_submit"] ?? 0,
        calendly_redirects: eventCounts["calendly_redirect"] ?? 0,
        calendly_booked: eventCounts["calendly_booked"] ?? 0,
      },
      leads: {
        total: submissions,
        submitted: statusCounts.submitted,
        booked: statusCounts.booked,
        completed: statusCounts.completed,
        no_show: statusCounts.no_show,
      },
      conversion: {
        view_to_form: pageViews > 0 ? ((formOpens / pageViews) * 100).toFixed(1) : "0.0",
        form_to_submit: formOpens > 0 ? ((submissions / formOpens) * 100).toFixed(1) : "0.0",
        submit_to_book: submissions > 0 ? ((bookings / submissions) * 100).toFixed(1) : "0.0",
        view_to_book: pageViews > 0 ? ((bookings / pageViews) * 100).toFixed(1) : "0.0",
      },
    });
  } catch (error) {
    console.error("Unerwarteter Fehler beim Abrufen der Protocol-Stats:", error);
    return NextResponse.json({ error: "Interner Server-Fehler" }, { status: 500 });
  }
}

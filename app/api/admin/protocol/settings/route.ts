import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/client";

function authenticateAdmin(request: NextRequest) {
  const adminUsername = request.headers.get("x-admin-username");
  const adminPassword = request.headers.get("x-admin-password");
  const expectedUsername = process.env.NEXT_PUBLIC_AFFILIATE_ADMIN_USERNAME ?? "admin";
  const expectedPassword = process.env.NEXT_PUBLIC_AFFILIATE_ADMIN_PASSWORD ?? "sntsecure";
  return adminUsername === expectedUsername && adminPassword === expectedPassword;
}

export async function GET(request: NextRequest) {
  try {
    if (!authenticateAdmin(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin
      .from("protocol_settings")
      .select("*")
      .eq("id", 1)
      .single();

    if (error) {
      return NextResponse.json(
        { id: 1, vimeo_video_id: "1184569668", calendly_url: "https://calendly.com/websitetitan110/30min" }
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Interner Server-Fehler" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!authenticateAdmin(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { vimeo_video_id, calendly_url } = body;

    if (vimeo_video_id && !/^\d+$/.test(vimeo_video_id)) {
      return NextResponse.json({ error: "Vimeo Video ID muss numerisch sein." }, { status: 400 });
    }

    const updateData: Record<string, string> = { updated_at: new Date().toISOString() };
    if (vimeo_video_id) updateData.vimeo_video_id = vimeo_video_id;
    if (calendly_url) updateData.calendly_url = calendly_url;

    const { data, error } = await supabaseAdmin
      .from("protocol_settings")
      .upsert({ id: 1, ...updateData })
      .select()
      .single();

    if (error) {
      console.error("Fehler beim Aktualisieren der Protocol-Settings:", error);
      return NextResponse.json({ error: "Fehler beim Speichern der Einstellungen." }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Interner Server-Fehler" }, { status: 500 });
  }
}

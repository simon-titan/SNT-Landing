import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/client";

// Admin-Authentifizierung (gleiche Logik wie im Affiliate Admin)
function authenticateAdmin(request: NextRequest) {
  const adminUsername = request.headers.get("x-admin-username");
  const adminPassword = request.headers.get("x-admin-password");
  
  const expectedUsername = process.env.NEXT_PUBLIC_AFFILIATE_ADMIN_USERNAME ?? "admin";
  const expectedPassword = process.env.NEXT_PUBLIC_AFFILIATE_ADMIN_PASSWORD ?? "sntsecure";
  
  return adminUsername === expectedUsername && adminPassword === expectedPassword;
}

// GET - Alle Landing Page Versionen abrufen
export async function GET(request: NextRequest) {
  try {
    if (!authenticateAdmin(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: versions, error } = await supabaseAdmin
      .from("landing_page_versions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fehler beim Abrufen der Landing Page Versionen:", error);
      return NextResponse.json(
        { error: "Fehler beim Abrufen der Versionen" },
        { status: 500 }
      );
    }

    return NextResponse.json({ versions });
  } catch (error) {
    console.error("Unerwarteter Fehler:", error);
    return NextResponse.json(
      { error: "Interner Server-Fehler" },
      { status: 500 }
    );
  }
}

// POST - Neue Landing Page Version erstellen
export async function POST(request: NextRequest) {
  try {
    if (!authenticateAdmin(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, slug, title, vimeo_video_id, course_type, is_active = true } = body;

    // Validierung
    if (!name || !slug || !title || !vimeo_video_id || !course_type) {
      return NextResponse.json(
        { error: "Alle Felder sind erforderlich: name, slug, title, vimeo_video_id, course_type" },
        { status: 400 }
      );
    }

    // Slug-Validierung (nur alphanumerisch und Bindestriche)
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json(
        { error: "Slug darf nur Kleinbuchstaben, Zahlen und Bindestriche enthalten" },
        { status: 400 }
      );
    }

    // Course-Type Validierung
    if (!['paid', 'free'].includes(course_type)) {
      return NextResponse.json(
        { error: "course_type muss 'paid' oder 'free' sein" },
        { status: 400 }
      );
    }

    // Vimeo ID Validierung (sollte numerisch sein)
    if (!/^\d+$/.test(vimeo_video_id)) {
      return NextResponse.json(
        { error: "Vimeo Video ID muss numerisch sein" },
        { status: 400 }
      );
    }

    const { data: version, error } = await supabaseAdmin
      .from("landing_page_versions")
      .insert({
        name: name.trim(),
        slug: slug.trim().toLowerCase(),
        title: title.trim(),
        vimeo_video_id: vimeo_video_id.trim(),
        course_type,
        is_active
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") { // Unique constraint violation
        return NextResponse.json(
          { error: "Eine Version mit diesem Slug existiert bereits" },
          { status: 409 }
        );
      }
      
      console.error("Fehler beim Erstellen der Landing Page Version:", error);
      return NextResponse.json(
        { error: "Fehler beim Erstellen der Version" },
        { status: 500 }
      );
    }

    return NextResponse.json({ version }, { status: 201 });
  } catch (error) {
    console.error("Unerwarteter Fehler:", error);
    return NextResponse.json(
      { error: "Interner Server-Fehler" },
      { status: 500 }
    );
  }
}
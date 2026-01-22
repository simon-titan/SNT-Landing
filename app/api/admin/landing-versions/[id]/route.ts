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

// GET - Einzelne Landing Page Version abrufen
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!authenticateAdmin(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const { data: version, error } = await supabaseAdmin
      .from("landing_page_versions")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") { // Not found
        return NextResponse.json(
          { error: "Version nicht gefunden" },
          { status: 404 }
        );
      }
      
      console.error("Fehler beim Abrufen der Landing Page Version:", error);
      return NextResponse.json(
        { error: "Fehler beim Abrufen der Version" },
        { status: 500 }
      );
    }

    return NextResponse.json({ version });
  } catch (error) {
    console.error("Unerwarteter Fehler:", error);
    return NextResponse.json(
      { error: "Interner Server-Fehler" },
      { status: 500 }
    );
  }
}

// PUT - Landing Page Version aktualisieren
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!authenticateAdmin(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, slug, title, vimeo_video_id, course_type, is_active } = body;

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
      .update({
        name: name.trim(),
        slug: slug.trim().toLowerCase(),
        title: title.trim(),
        vimeo_video_id: vimeo_video_id.trim(),
        course_type,
        is_active: is_active ?? true
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (error.code === "23505") { // Unique constraint violation
        return NextResponse.json(
          { error: "Eine Version mit diesem Slug existiert bereits" },
          { status: 409 }
        );
      }
      
      if (error.code === "PGRST116") { // Not found
        return NextResponse.json(
          { error: "Version nicht gefunden" },
          { status: 404 }
        );
      }
      
      console.error("Fehler beim Aktualisieren der Landing Page Version:", error);
      return NextResponse.json(
        { error: "Fehler beim Aktualisieren der Version" },
        { status: 500 }
      );
    }

    return NextResponse.json({ version });
  } catch (error) {
    console.error("Unerwarteter Fehler:", error);
    return NextResponse.json(
      { error: "Interner Server-Fehler" },
      { status: 500 }
    );
  }
}

// DELETE - Landing Page Version löschen
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!authenticateAdmin(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const { error } = await supabaseAdmin
      .from("landing_page_versions")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Fehler beim Löschen der Landing Page Version:", error);
      return NextResponse.json(
        { error: "Fehler beim Löschen der Version" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Version erfolgreich gelöscht" });
  } catch (error) {
    console.error("Unerwarteter Fehler:", error);
    return NextResponse.json(
      { error: "Interner Server-Fehler" },
      { status: 500 }
    );
  }
}
/**
 * Admin API für Telegram-Gruppe FAQ-Verwaltung
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/affiliates/admin-auth";
import {
  getAllFaqs,
  getFaqById,
  createFaq,
  updateFaq,
  deleteFaq,
  getFaqCategories,
} from "@/lib/telegram/faq-handler";

export const runtime = "nodejs";

/**
 * GET /api/admin/telegram-group/faq
 * Holt alle FAQ-Einträge
 */
export async function GET(request: NextRequest) {
  const authResult = verifyAdminAuth(request.headers);
  if (!authResult.success) {
    return NextResponse.json({ error: authResult.error }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const includeInactive = searchParams.get("include_inactive") === "true";
    const categoriesOnly = searchParams.get("categories") === "true";

    // Einzelne FAQ abrufen
    if (id) {
      const faq = await getFaqById(id);
      if (!faq) {
        return NextResponse.json(
          { error: "FAQ nicht gefunden" },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, faq });
    }

    // Nur Kategorien abrufen
    if (categoriesOnly) {
      const categories = await getFaqCategories();
      return NextResponse.json({ success: true, categories });
    }

    // Alle FAQs abrufen
    const faqs = await getAllFaqs(includeInactive);

    return NextResponse.json({
      success: true,
      faqs,
      total: faqs.length,
    });
  } catch (error) {
    console.error("[Admin FAQ GET] Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/telegram-group/faq
 * Erstellt einen neuen FAQ-Eintrag
 */
export async function POST(request: NextRequest) {
  const authResult = verifyAdminAuth(request.headers);
  if (!authResult.success) {
    return NextResponse.json({ error: authResult.error }, { status: 401 });
  }

  try {
    const body = await request.json();

    if (!body.trigger_keywords || !Array.isArray(body.trigger_keywords)) {
      return NextResponse.json(
        { error: "trigger_keywords (Array) ist erforderlich" },
        { status: 400 }
      );
    }

    if (!body.question) {
      return NextResponse.json(
        { error: "question ist erforderlich" },
        { status: 400 }
      );
    }

    if (!body.answer) {
      return NextResponse.json(
        { error: "answer ist erforderlich" },
        { status: 400 }
      );
    }

    const faq = await createFaq({
      trigger_keywords: body.trigger_keywords,
      trigger_exact_match: body.trigger_exact_match || false,
      question: body.question,
      answer: body.answer,
      category: body.category || "general",
      priority: body.priority || 0,
      is_active: body.is_active !== false,
    });

    if (!faq) {
      return NextResponse.json(
        { error: "FAQ konnte nicht erstellt werden" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      faq,
    });
  } catch (error) {
    console.error("[Admin FAQ POST] Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/telegram-group/faq
 * Aktualisiert einen FAQ-Eintrag
 */
export async function PUT(request: NextRequest) {
  const authResult = verifyAdminAuth(request.headers);
  if (!authResult.success) {
    return NextResponse.json({ error: authResult.error }, { status: 401 });
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

    const faq = await updateFaq(id, updates);

    if (!faq) {
      return NextResponse.json(
        { error: "FAQ konnte nicht aktualisiert werden" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      faq,
    });
  } catch (error) {
    console.error("[Admin FAQ PUT] Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/telegram-group/faq
 * Löscht einen FAQ-Eintrag
 */
export async function DELETE(request: NextRequest) {
  const authResult = verifyAdminAuth(request.headers);
  if (!authResult.success) {
    return NextResponse.json({ error: authResult.error }, { status: 401 });
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

    const success = await deleteFaq(id);

    if (!success) {
      return NextResponse.json(
        { error: "FAQ konnte nicht gelöscht werden" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("[Admin FAQ DELETE] Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

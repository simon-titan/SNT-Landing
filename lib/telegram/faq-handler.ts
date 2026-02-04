/**
 * FAQ Handler für Telegram Paid Group Bot
 * 
 * Verarbeitet eingehende Nachrichten und sucht nach passenden FAQ-Antworten.
 */

import { supabaseAdmin } from "../supabase/client";
import { sendMessage } from "./paid-group-bot";

export interface FaqEntry {
  id: string;
  trigger_keywords: string[];
  trigger_exact_match: boolean;
  question: string;
  answer: string;
  category: string;
  priority: number;
  is_active: boolean;
  usage_count: number;
  last_used_at: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Sucht nach passenden FAQ-Einträgen für eine Nachricht
 */
export async function findMatchingFaq(messageText: string): Promise<FaqEntry | null> {
  // Nachricht normalisieren
  const normalizedText = messageText.toLowerCase().trim();

  // Alle aktiven FAQ-Einträge holen
  const { data: faqs, error } = await supabaseAdmin
    .from("telegram_faq_entries")
    .select("*")
    .eq("is_active", true)
    .order("priority", { ascending: false });

  if (error || !faqs || faqs.length === 0) {
    return null;
  }

  // Nach Keyword-Match suchen
  let bestMatch: FaqEntry | null = null;
  let bestScore = 0;

  for (const faq of faqs as FaqEntry[]) {
    const score = calculateMatchScore(normalizedText, faq.trigger_keywords, faq.trigger_exact_match);
    
    if (score > bestScore) {
      bestScore = score;
      bestMatch = faq;
    }
  }

  // Mindest-Score für Match (anpassbar)
  if (bestScore < 0.5) {
    return null;
  }

  return bestMatch;
}

/**
 * Berechnet den Match-Score zwischen Nachricht und Keywords
 */
function calculateMatchScore(
  text: string,
  keywords: string[],
  exactMatch: boolean
): number {
  if (exactMatch) {
    // Exakte Übereinstimmung mit einem Keyword
    for (const keyword of keywords) {
      if (text === keyword.toLowerCase()) {
        return 1.0;
      }
    }
    return 0;
  }

  // Fuzzy Matching - wie viele Keywords kommen vor?
  let matchedKeywords = 0;
  
  for (const keyword of keywords) {
    const normalizedKeyword = keyword.toLowerCase();
    
    // Prüfe ob Keyword im Text vorkommt
    if (text.includes(normalizedKeyword)) {
      matchedKeywords++;
    }
  }

  if (matchedKeywords === 0) return 0;

  // Score basiert auf Anteil der gematchten Keywords
  return matchedKeywords / keywords.length;
}

/**
 * Verarbeitet eine Nachricht und antwortet mit FAQ wenn passend
 * @returns true wenn FAQ gefunden und gesendet wurde
 */
export async function handleFaqQuery(
  chatId: number,
  messageText: string,
  userId?: number
): Promise<boolean> {
  const faq = await findMatchingFaq(messageText);

  if (!faq) {
    return false;
  }

  // FAQ-Antwort senden
  await sendMessage({
    chat_id: chatId,
    text: faq.answer,
    parse_mode: "Markdown",
    disable_web_page_preview: true,
  });

  // Nutzungsstatistik aktualisieren
  await updateFaqUsage(faq.id);

  // Activity loggen
  if (userId) {
    try {
      await supabaseAdmin.from("telegram_activity_log").insert({
        action_type: "faq_triggered",
        telegram_user_id: userId,
        details: {
          faq_id: faq.id,
          question: faq.question,
          message: messageText.substring(0, 100),
        },
      });
    } catch (error) {
      console.error("Fehler beim Loggen der FAQ-Nutzung:", error);
    }
  }

  return true;
}

/**
 * Aktualisiert die Nutzungsstatistik eines FAQ-Eintrags
 */
async function updateFaqUsage(faqId: string): Promise<void> {
  try {
    await supabaseAdmin.rpc("increment_faq_usage", { faq_id: faqId });
  } catch {
    // Fallback wenn RPC nicht existiert
    const { data } = await supabaseAdmin
      .from("telegram_faq_entries")
      .select("usage_count")
      .eq("id", faqId)
      .single();

    if (data) {
      await supabaseAdmin
        .from("telegram_faq_entries")
        .update({
          usage_count: (data.usage_count || 0) + 1,
          last_used_at: new Date().toISOString(),
        })
        .eq("id", faqId);
    }
  }
}

// ==========================================
// FAQ CRUD OPERATIONS (für Admin Panel)
// ==========================================

/**
 * Holt alle FAQ-Einträge
 */
export async function getAllFaqs(includeInactive = false): Promise<FaqEntry[]> {
  let query = supabaseAdmin
    .from("telegram_faq_entries")
    .select("*")
    .order("priority", { ascending: false });

  if (!includeInactive) {
    query = query.eq("is_active", true);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Fehler beim Abrufen der FAQs:", error);
    return [];
  }

  return data as FaqEntry[];
}

/**
 * Holt einen FAQ-Eintrag
 */
export async function getFaqById(id: string): Promise<FaqEntry | null> {
  const { data, error } = await supabaseAdmin
    .from("telegram_faq_entries")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Fehler beim Abrufen der FAQ:", error);
    return null;
  }

  return data as FaqEntry;
}

/**
 * Erstellt einen neuen FAQ-Eintrag
 */
export async function createFaq(
  data: Omit<FaqEntry, "id" | "usage_count" | "last_used_at" | "created_at" | "updated_at">
): Promise<FaqEntry | null> {
  const { data: faq, error } = await supabaseAdmin
    .from("telegram_faq_entries")
    .insert(data)
    .select()
    .single();

  if (error) {
    console.error("Fehler beim Erstellen der FAQ:", error);
    return null;
  }

  return faq as FaqEntry;
}

/**
 * Aktualisiert einen FAQ-Eintrag
 */
export async function updateFaq(
  id: string,
  updates: Partial<FaqEntry>
): Promise<FaqEntry | null> {
  const { data, error } = await supabaseAdmin
    .from("telegram_faq_entries")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Fehler beim Aktualisieren der FAQ:", error);
    return null;
  }

  return data as FaqEntry;
}

/**
 * Löscht einen FAQ-Eintrag
 */
export async function deleteFaq(id: string): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from("telegram_faq_entries")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Fehler beim Löschen der FAQ:", error);
    return false;
  }

  return true;
}

/**
 * Holt FAQ-Kategorien mit Anzahl
 */
export async function getFaqCategories(): Promise<{ category: string; count: number }[]> {
  const { data, error } = await supabaseAdmin
    .from("telegram_faq_entries")
    .select("category")
    .eq("is_active", true);

  if (error || !data) {
    return [];
  }

  // Kategorien zählen
  const counts: Record<string, number> = {};
  for (const item of data) {
    counts[item.category] = (counts[item.category] || 0) + 1;
  }

  return Object.entries(counts).map(([category, count]) => ({ category, count }));
}

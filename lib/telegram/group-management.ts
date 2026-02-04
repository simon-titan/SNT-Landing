/**
 * Telegram Group Management
 * 
 * Verwaltet Mitglieder der bezahlten Telegram-Gruppe.
 * Verbindet Supabase-Datenbank mit Telegram Bot API.
 */

import { supabaseAdmin } from "../supabase/client";
import {
  sendMessage,
  createInviteLink,
  kickChatMember,
  isUserInGroup,
  getPaymentSuccessMessage,
  getCancellationMessage,
  getVerificationMessage,
  TELEGRAM_PLANS,
} from "./paid-group-bot";

// Types
export interface TelegramMember {
  id: string;
  telegram_user_id: number;
  telegram_username: string | null;
  telegram_first_name: string | null;
  telegram_last_name: string | null;
  telegram_phone: string | null;
  outseta_account_uid: string | null;
  outseta_person_uid: string | null;
  outseta_email: string | null;
  subscription_plan: string | null;
  subscription_status: "pending" | "active" | "cancelled" | "expired";
  subscription_started_at: string | null;
  subscription_expires_at: string | null;
  is_in_group: boolean;
  joined_group_at: string | null;
  removed_from_group_at: string | null;
  removal_reason: string | null;
  is_verified: boolean;
  verification_code: string | null;
  verification_sent_at: string | null;
  verified_at: string | null;
  notes: string | null;
  added_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateMemberData {
  telegram_user_id: number;
  telegram_username?: string;
  telegram_first_name?: string;
  telegram_last_name?: string;
  outseta_account_uid?: string;
  outseta_person_uid?: string;
  outseta_email?: string;
  subscription_plan?: string;
  added_by?: "system" | "admin" | "webhook";
}

export interface ActivityLogEntry {
  action_type: string;
  telegram_user_id?: number;
  member_id?: string;
  message_id?: string;
  details?: Record<string, unknown>;
  error_message?: string;
}

// ==========================================
// MEMBER CRUD OPERATIONS
// ==========================================

/**
 * Holt einen Mitglieder-Eintrag anhand der Telegram User ID
 */
export async function getMemberByTelegramId(
  telegramUserId: number
): Promise<TelegramMember | null> {
  const { data, error } = await supabaseAdmin
    .from("telegram_group_members")
    .select("*")
    .eq("telegram_user_id", telegramUserId)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Fehler beim Abrufen des Mitglieds:", error);
    throw error;
  }

  return data as TelegramMember | null;
}

/**
 * Holt einen Mitglieder-Eintrag anhand der Outseta Account UID
 */
export async function getMemberByOutsetaUid(
  outsetaAccountUid: string
): Promise<TelegramMember | null> {
  const { data, error } = await supabaseAdmin
    .from("telegram_group_members")
    .select("*")
    .eq("outseta_account_uid", outsetaAccountUid)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Fehler beim Abrufen des Mitglieds:", error);
    throw error;
  }

  return data as TelegramMember | null;
}

/**
 * Holt einen Mitglieder-Eintrag anhand der E-Mail
 */
export async function getMemberByEmail(
  email: string
): Promise<TelegramMember | null> {
  const { data, error } = await supabaseAdmin
    .from("telegram_group_members")
    .select("*")
    .eq("outseta_email", email.toLowerCase())
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Fehler beim Abrufen des Mitglieds:", error);
    throw error;
  }

  return data as TelegramMember | null;
}

/**
 * Erstellt einen neuen Mitglieder-Eintrag
 */
export async function createMember(
  data: CreateMemberData
): Promise<TelegramMember> {
  const { data: member, error } = await supabaseAdmin
    .from("telegram_group_members")
    .insert({
      ...data,
      outseta_email: data.outseta_email?.toLowerCase(),
      subscription_status: "pending",
      is_in_group: false,
      is_verified: false,
    })
    .select()
    .single();

  if (error) {
    console.error("Fehler beim Erstellen des Mitglieds:", error);
    throw error;
  }

  await logActivity({
    action_type: "member_joined",
    telegram_user_id: data.telegram_user_id,
    member_id: member.id,
    details: { added_by: data.added_by },
  });

  return member as TelegramMember;
}

/**
 * Aktualisiert einen Mitglieder-Eintrag
 */
export async function updateMember(
  telegramUserId: number,
  updates: Partial<TelegramMember>
): Promise<TelegramMember> {
  const { data, error } = await supabaseAdmin
    .from("telegram_group_members")
    .update(updates)
    .eq("telegram_user_id", telegramUserId)
    .select()
    .single();

  if (error) {
    console.error("Fehler beim Aktualisieren des Mitglieds:", error);
    throw error;
  }

  return data as TelegramMember;
}

/**
 * Holt alle Mitglieder mit optionalen Filtern
 */
export async function getAllMembers(filters?: {
  status?: string;
  is_in_group?: boolean;
  limit?: number;
  offset?: number;
}): Promise<{ members: TelegramMember[]; total: number }> {
  let query = supabaseAdmin
    .from("telegram_group_members")
    .select("*", { count: "exact" });

  if (filters?.status) {
    query = query.eq("subscription_status", filters.status);
  }

  if (filters?.is_in_group !== undefined) {
    query = query.eq("is_in_group", filters.is_in_group);
  }

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1);
  }

  query = query.order("created_at", { ascending: false });

  const { data, error, count } = await query;

  if (error) {
    console.error("Fehler beim Abrufen der Mitglieder:", error);
    throw error;
  }

  return {
    members: data as TelegramMember[],
    total: count || 0,
  };
}

// ==========================================
// SUBSCRIPTION MANAGEMENT
// ==========================================

/**
 * Aktiviert ein Abonnement für einen Nutzer
 */
export async function activateSubscription(
  telegramUserId: number,
  plan: string,
  outsetaData?: {
    account_uid?: string;
    person_uid?: string;
    email?: string;
  }
): Promise<{ success: boolean; inviteLink?: string; error?: string }> {
  try {
    // Mitglied holen oder erstellen
    let member = await getMemberByTelegramId(telegramUserId);

    if (!member) {
      // Neues Mitglied erstellen
      member = await createMember({
        telegram_user_id: telegramUserId,
        subscription_plan: plan,
        added_by: "webhook",
        ...outsetaData,
      });
    }

    // Einladungslink erstellen (gültig für 1 Person, 24 Stunden)
    const expireDate = Math.floor(Date.now() / 1000) + 24 * 60 * 60;
    const invite = await createInviteLink(expireDate, 1);

    // Mitglied aktualisieren
    await updateMember(telegramUserId, {
      subscription_status: "active",
      subscription_plan: plan,
      subscription_started_at: new Date().toISOString(),
      outseta_account_uid: outsetaData?.account_uid || member.outseta_account_uid,
      outseta_person_uid: outsetaData?.person_uid || member.outseta_person_uid,
      outseta_email: outsetaData?.email?.toLowerCase() || member.outseta_email,
    });

    // Erfolgsnachricht senden
    await sendMessage(getPaymentSuccessMessage(telegramUserId, invite.invite_link));

    await logActivity({
      action_type: "subscription_created",
      telegram_user_id: telegramUserId,
      member_id: member.id,
      details: { plan, invite_link: invite.invite_link },
    });

    return { success: true, inviteLink: invite.invite_link };
  } catch (error) {
    console.error("Fehler beim Aktivieren des Abonnements:", error);
    
    await logActivity({
      action_type: "error",
      telegram_user_id: telegramUserId,
      error_message: error instanceof Error ? error.message : "Unknown error",
      details: { action: "activateSubscription", plan },
    });

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Kündigt ein Abonnement und entfernt den Nutzer aus der Gruppe
 */
export async function cancelSubscription(
  telegramUserId: number,
  reason: "cancelled" | "expired" | "manual" | "banned" = "cancelled"
): Promise<{ success: boolean; error?: string }> {
  try {
    const member = await getMemberByTelegramId(telegramUserId);

    if (!member) {
      return { success: false, error: "Mitglied nicht gefunden" };
    }

    // Aus Gruppe entfernen wenn drin
    if (member.is_in_group) {
      await kickChatMember(telegramUserId);
    }

    // Mitglied aktualisieren
    await updateMember(telegramUserId, {
      subscription_status: "cancelled",
      is_in_group: false,
      removed_from_group_at: new Date().toISOString(),
      removal_reason: reason,
    });

    // Kündigungsnachricht senden
    try {
      await sendMessage(getCancellationMessage(telegramUserId));
    } catch {
      // User hat möglicherweise den Bot blockiert
      console.log("Konnte Kündigungsnachricht nicht senden (Bot blockiert?)");
    }

    await logActivity({
      action_type: "subscription_cancelled",
      telegram_user_id: telegramUserId,
      member_id: member.id,
      details: { reason },
    });

    return { success: true };
  } catch (error) {
    console.error("Fehler beim Kündigen des Abonnements:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Markiert einen Nutzer als der Gruppe beigetreten
 */
export async function markMemberJoinedGroup(
  telegramUserId: number
): Promise<void> {
  await updateMember(telegramUserId, {
    is_in_group: true,
    joined_group_at: new Date().toISOString(),
    removed_from_group_at: null,
    removal_reason: null,
  });

  await logActivity({
    action_type: "member_joined",
    telegram_user_id: telegramUserId,
  });
}

/**
 * Markiert einen Nutzer als die Gruppe verlassen
 */
export async function markMemberLeftGroup(
  telegramUserId: number,
  reason: "left" | "kicked" | "banned" = "left"
): Promise<void> {
  await updateMember(telegramUserId, {
    is_in_group: false,
    removed_from_group_at: new Date().toISOString(),
    removal_reason: reason,
  });

  const actionType = reason === "banned" ? "member_banned" : reason === "kicked" ? "member_kicked" : "member_left";

  await logActivity({
    action_type: actionType,
    telegram_user_id: telegramUserId,
    details: { reason },
  });
}

// ==========================================
// VERIFICATION
// ==========================================

/**
 * Generiert einen Verifizierungscode
 */
function generateVerificationCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

/**
 * Startet den Verifizierungsprozess
 */
export async function startVerification(
  telegramUserId: number
): Promise<{ success: boolean; code?: string; error?: string }> {
  try {
    const code = generateVerificationCode();

    // In Datenbank speichern
    let member = await getMemberByTelegramId(telegramUserId);

    if (!member) {
      member = await createMember({
        telegram_user_id: telegramUserId,
        added_by: "system",
      });
    }

    await updateMember(telegramUserId, {
      verification_code: code,
      verification_sent_at: new Date().toISOString(),
      is_verified: false,
    });

    // Verifizierungsnachricht senden
    await sendMessage(getVerificationMessage(telegramUserId, code));

    await logActivity({
      action_type: "verification_sent",
      telegram_user_id: telegramUserId,
      member_id: member.id,
    });

    return { success: true, code };
  } catch (error) {
    console.error("Fehler bei Verifizierung:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Bestätigt die Verifizierung
 */
export async function confirmVerification(
  telegramUserId: number,
  code: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const member = await getMemberByTelegramId(telegramUserId);

    if (!member) {
      return { success: false, error: "Mitglied nicht gefunden" };
    }

    if (member.verification_code !== code) {
      return { success: false, error: "Ungültiger Code" };
    }

    await updateMember(telegramUserId, {
      is_verified: true,
      verified_at: new Date().toISOString(),
      verification_code: null,
    });

    await logActivity({
      action_type: "verification_completed",
      telegram_user_id: telegramUserId,
      member_id: member.id,
    });

    return { success: true };
  } catch (error) {
    console.error("Fehler bei Verifizierung:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// ==========================================
// SYNC FUNCTIONS
// ==========================================

/**
 * Synchronisiert alle Mitglieder mit der Telegram-Gruppe
 * (Prüft ob Mitglieder die als "in_group" markiert sind auch wirklich drin sind)
 */
export async function syncAllMembers(): Promise<{
  synced: number;
  removed: number;
  errors: number;
}> {
  const stats = { synced: 0, removed: 0, errors: 0 };

  const { members } = await getAllMembers({ is_in_group: true });

  for (const member of members) {
    try {
      const inGroup = await isUserInGroup(member.telegram_user_id);

      if (!inGroup && member.is_in_group) {
        // War als "in_group" markiert, ist aber nicht mehr drin
        await updateMember(member.telegram_user_id, {
          is_in_group: false,
          removed_from_group_at: new Date().toISOString(),
          removal_reason: "left",
        });
        stats.removed++;
      }

      stats.synced++;
    } catch (error) {
      console.error(`Fehler beim Sync von ${member.telegram_user_id}:`, error);
      stats.errors++;
    }
  }

  await logActivity({
    action_type: "admin_action",
    details: { action: "syncAllMembers", stats },
  });

  return stats;
}

/**
 * Entfernt alle Mitglieder mit abgelaufenen Abos
 */
export async function removeExpiredMembers(): Promise<{
  removed: number;
  errors: number;
}> {
  const stats = { removed: 0, errors: 0 };

  const { data: expiredMembers, error } = await supabaseAdmin
    .from("telegram_group_members")
    .select("*")
    .eq("is_in_group", true)
    .lt("subscription_expires_at", new Date().toISOString());

  if (error) {
    console.error("Fehler beim Abrufen abgelaufener Mitglieder:", error);
    return stats;
  }

  for (const member of expiredMembers || []) {
    const result = await cancelSubscription(member.telegram_user_id, "expired");
    if (result.success) {
      stats.removed++;
    } else {
      stats.errors++;
    }
  }

  await logActivity({
    action_type: "admin_action",
    details: { action: "removeExpiredMembers", stats },
  });

  return stats;
}

// ==========================================
// ACTIVITY LOG
// ==========================================

/**
 * Protokolliert eine Aktivität
 */
export async function logActivity(entry: ActivityLogEntry): Promise<void> {
  try {
    await supabaseAdmin.from("telegram_activity_log").insert(entry);
  } catch (error) {
    console.error("Fehler beim Protokollieren:", error);
  }
}

/**
 * Holt die letzten Aktivitäten
 */
export async function getRecentActivity(
  limit = 50
): Promise<ActivityLogEntry[]> {
  const { data, error } = await supabaseAdmin
    .from("telegram_activity_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Fehler beim Abrufen der Aktivitäten:", error);
    return [];
  }

  return data as ActivityLogEntry[];
}

// ==========================================
// STATISTICS
// ==========================================

/**
 * Holt Statistiken zur Gruppe
 */
export async function getGroupStats(): Promise<{
  total_members: number;
  active_members: number;
  pending_members: number;
  cancelled_members: number;
  members_in_group: number;
  new_today: number;
  new_this_week: number;
}> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const [total, active, pending, cancelled, inGroup, newToday, newWeek] =
    await Promise.all([
      supabaseAdmin
        .from("telegram_group_members")
        .select("*", { count: "exact", head: true }),
      supabaseAdmin
        .from("telegram_group_members")
        .select("*", { count: "exact", head: true })
        .eq("subscription_status", "active"),
      supabaseAdmin
        .from("telegram_group_members")
        .select("*", { count: "exact", head: true })
        .eq("subscription_status", "pending"),
      supabaseAdmin
        .from("telegram_group_members")
        .select("*", { count: "exact", head: true })
        .eq("subscription_status", "cancelled"),
      supabaseAdmin
        .from("telegram_group_members")
        .select("*", { count: "exact", head: true })
        .eq("is_in_group", true),
      supabaseAdmin
        .from("telegram_group_members")
        .select("*", { count: "exact", head: true })
        .gte("created_at", today.toISOString()),
      supabaseAdmin
        .from("telegram_group_members")
        .select("*", { count: "exact", head: true })
        .gte("created_at", weekAgo.toISOString()),
    ]);

  return {
    total_members: total.count || 0,
    active_members: active.count || 0,
    pending_members: pending.count || 0,
    cancelled_members: cancelled.count || 0,
    members_in_group: inGroup.count || 0,
    new_today: newToday.count || 0,
    new_this_week: newWeek.count || 0,
  };
}

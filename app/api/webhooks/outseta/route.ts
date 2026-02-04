/**
 * Outseta Webhook Handler
 * 
 * Verarbeitet Subscription-Events von Outseta:
 * - Account Subscription Started: Neues Abo gestartet
 * - Account Subscription Renewal Extended: Abo verlängert
 * - Account Subscription Cancellation Requested: Kündigung angefordert
 * - Account Subscription Payment Declined: Zahlung fehlgeschlagen
 * - Account Created: Account erstellt
 * - Account Stage Updated: Account Stage geändert
 * 
 * Webhook in Outseta konfigurieren unter:
 * Settings > Notifications > ⚙️
 * 
 * Signatur-Verifizierung nach:
 * https://go.outseta.com/support/kb/articles/Rm85R5Q4/secure-and-verify-webhooks-with-a-sha256-signature
 */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import {
  getMemberByEmail,
  getMemberByOutsetaUid,
  activateSubscription,
  cancelSubscription,
  updateMember,
  logActivity,
} from "@/lib/telegram/group-management";
import { TELEGRAM_PLANS } from "@/lib/telegram/paid-group-bot";

export const runtime = "nodejs";

// Outseta Webhook Signature Key (32-byte hex-encoded)
const WEBHOOK_SECRET = process.env.OUTSETA_WEBHOOK_SECRET;

// Telegram Gruppe Plan UIDs
const TELEGRAM_GROUP_PLANS = [
  TELEGRAM_PLANS.outseta, // ZmNM7ZW2
  TELEGRAM_PLANS.paypal,  // 7ma8lrWE (wird zu Outseta Plan gemappt)
];

// Outseta Event Namen (wie in Outseta konfiguriert)
const OUTSETA_EVENTS = {
  SUBSCRIPTION_STARTED: "Account Subscription Started",
  SUBSCRIPTION_RENEWED: "Account Subscription Renewal Extended",
  SUBSCRIPTION_CANCELLED: "Account Subscription Cancellation Requested",
  SUBSCRIPTION_PAYMENT_DECLINED: "Account Subscription Payment Declined",
  ACCOUNT_CREATED: "Account Created",
  ACCOUNT_STAGE_UPDATED: "Account Stage Updated",
} as const;

// Outseta Webhook Payload Struktur
interface OutsetaWebhookPayload {
  // Event Name
  Event?: string;
  event?: string;
  
  // Die Daten können direkt im Root oder unter "Data" sein
  Data?: OutsetaEventData;
  data?: OutsetaEventData;
  
  // Oder direkt im Root (je nach Event-Typ)
  Uid?: string;
  Account?: OutsetaAccount;
  Person?: OutsetaPerson;
  Subscription?: OutsetaSubscription;
  CurrentSubscription?: OutsetaSubscription;
}

interface OutsetaAccount {
  Uid: string;
  Name?: string;
  PrimaryContact?: OutsetaPerson;
  CurrentSubscription?: OutsetaSubscription;
  Subscriptions?: OutsetaSubscription[];
}

interface OutsetaPerson {
  Uid: string;
  Email: string;
  FirstName?: string;
  LastName?: string;
}

interface OutsetaSubscription {
  Uid: string;
  Plan?: {
    Uid: string;
    Name?: string;
  };
  StartDate?: string;
  EndDate?: string;
  ExpirationDate?: string;
  CancelDate?: string;
  CancellationReason?: string;
}

interface OutsetaEventData {
  Uid?: string;
  Account?: OutsetaAccount;
  Person?: OutsetaPerson;
  Subscription?: OutsetaSubscription;
  Plan?: { Uid: string; Name?: string };
  StartDate?: string;
  EndDate?: string;
  ExpirationDate?: string;
  CancelDate?: string;
}

/**
 * Verifiziert die Webhook-Signatur nach Outseta-Dokumentation
 * 
 * Outseta verwendet:
 * - Header: x-hub-signature-256
 * - Format: sha256=<hex-encoded-hmac>
 * - Key: 32-byte hex-encoded string (muss von hex dekodiert werden)
 * 
 * @see https://go.outseta.com/support/kb/articles/Rm85R5Q4/secure-and-verify-webhooks-with-a-sha256-signature
 */
function verifyOutsetaSignature(
  bodyAsString: string,
  signatureHeader: string | null
): boolean {
  if (!WEBHOOK_SECRET) {
    console.warn("[Outseta Webhook] Kein OUTSETA_WEBHOOK_SECRET konfiguriert - Signatur wird nicht geprüft");
    return true;
  }

  if (!signatureHeader) {
    console.warn("[Outseta Webhook] Keine x-hub-signature-256 Header vorhanden");
    return false;
  }

  try {
    // Key von hex dekodieren
    const key = Buffer.from(WEBHOOK_SECRET, "hex");
    
    // Payload als UTF-8 Buffer
    const payloadToSign = Buffer.from(bodyAsString, "utf-8");
    
    // HMAC berechnen
    const calculatedSignature = crypto
      .createHmac("sha256", key)
      .update(payloadToSign)
      .digest("hex");

    // Erwartetes Format: "sha256=<hex>"
    const expectedSignature = "sha256=" + calculatedSignature;

    // Timing-safe Vergleich
    if (signatureHeader.length !== expectedSignature.length) {
      console.warn("[Outseta Webhook] Signatur-Länge stimmt nicht überein");
      return false;
    }

    const isValid = crypto.timingSafeEqual(
      Buffer.from(signatureHeader),
      Buffer.from(expectedSignature)
    );

    if (!isValid) {
      console.warn("[Outseta Webhook] Signatur ungültig");
      console.log("[Outseta Webhook] Erwartet:", expectedSignature);
      console.log("[Outseta Webhook] Erhalten:", signatureHeader);
    }

    return isValid;
  } catch (error) {
    console.error("[Outseta Webhook] Fehler bei Signatur-Verifizierung:", error);
    return false;
  }
}

/**
 * Prüft ob der Plan zur Telegram-Gruppe gehört
 */
function isTelegramGroupPlan(planUid: string | undefined): boolean {
  if (!planUid) return false;
  return TELEGRAM_GROUP_PLANS.includes(planUid);
}

/**
 * Extrahiert Daten aus dem Outseta Webhook Payload
 * Outseta kann Daten in verschiedenen Strukturen senden
 */
function extractPayloadData(payload: OutsetaWebhookPayload): {
  event: string;
  email: string | undefined;
  accountUid: string | undefined;
  personUid: string | undefined;
  planUid: string | undefined;
  subscription: OutsetaSubscription | undefined;
} {
  // Event Name (kann "Event" oder "event" sein)
  const event = payload.Event || payload.event || "unknown";
  
  // Daten können unter "Data", "data" oder direkt im Root sein
  const data = payload.Data || payload.data || payload;
  
  // Account finden
  const account = data.Account || payload.Account;
  
  // Person finden
  const person = data.Person || payload.Person || account?.PrimaryContact;
  
  // Subscription finden
  const subscription = data.Subscription || 
                       payload.Subscription || 
                       account?.CurrentSubscription ||
                       account?.Subscriptions?.[0];
  
  // Plan aus Subscription oder direkt
  const planUid = subscription?.Plan?.Uid || data.Plan?.Uid;
  
  return {
    event,
    email: person?.Email,
    accountUid: account?.Uid || data.Uid,
    personUid: person?.Uid,
    planUid,
    subscription,
  };
}

/**
 * POST /api/webhooks/outseta
 */
export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    
    // Signatur aus dem korrekten Header holen (x-hub-signature-256)
    const signature = request.headers.get("x-hub-signature-256");

    console.log("[Outseta Webhook] Request erhalten");
    console.log("[Outseta Webhook] Signatur-Header vorhanden:", !!signature);

    // Signatur verifizieren
    if (!verifyOutsetaSignature(rawBody, signature)) {
      console.error("[Outseta Webhook] Ungültige Signatur");
      return NextResponse.json(
        { success: false, error: "Invalid signature" },
        { status: 401 }
      );
    }

    console.log("[Outseta Webhook] Signatur verifiziert ✓");

    const payload: OutsetaWebhookPayload = JSON.parse(rawBody);
    
    // Vollständiges Payload für Debugging
    console.log("[Outseta Webhook] Vollständiges Payload:", JSON.stringify(payload, null, 2));

    // Daten extrahieren
    const { event, email, accountUid, personUid, planUid, subscription } = extractPayloadData(payload);

    console.log("[Outseta Webhook] Event:", event);
    console.log("[Outseta Webhook] Email:", email);
    console.log("[Outseta Webhook] Plan UID:", planUid);

    // Plan prüfen - nur Telegram-Gruppe Events verarbeiten
    if (planUid && !isTelegramGroupPlan(planUid)) {
      console.log("[Outseta Webhook] Kein Telegram-Gruppe Plan, ignorieren:", planUid);
      return NextResponse.json({
        success: true,
        message: "Event für anderen Plan, ignoriert",
        plan: planUid,
      });
    }

    // Bei manchen Events haben wir keine E-Mail (z.B. Account Stage Updated)
    // Das ist OK, wir loggen es trotzdem
    if (!email && event !== OUTSETA_EVENTS.ACCOUNT_STAGE_UPDATED) {
      console.warn("[Outseta Webhook] Keine E-Mail im Payload für Event:", event);
    }

    // Mitglied finden (falls E-Mail vorhanden)
    let member = null;
    if (accountUid) {
      member = await getMemberByOutsetaUid(accountUid);
    }
    if (!member && email) {
      member = await getMemberByEmail(email);
    }

    // Activity loggen
    await logActivity({
      action_type: "webhook_received",
      telegram_user_id: member?.telegram_user_id,
      details: {
        event,
        plan_uid: planUid,
        email,
        account_uid: accountUid,
      },
    });

    // Events verarbeiten
    switch (event) {
      case OUTSETA_EVENTS.SUBSCRIPTION_STARTED:
      case OUTSETA_EVENTS.SUBSCRIPTION_RENEWED:
        if (email) {
          await handleSubscriptionActive(member, {
            email,
            accountUid,
            personUid,
            planUid: planUid || TELEGRAM_PLANS.outseta,
            startDate: subscription?.StartDate,
            endDate: subscription?.EndDate || subscription?.ExpirationDate,
          });
        }
        break;

      case OUTSETA_EVENTS.SUBSCRIPTION_CANCELLED:
        if (email) {
          await handleSubscriptionCancelled(member, email);
        }
        break;

      case OUTSETA_EVENTS.SUBSCRIPTION_PAYMENT_DECLINED:
        if (email) {
          await handlePaymentDeclined(member, email);
        }
        break;

      case OUTSETA_EVENTS.ACCOUNT_CREATED:
        console.log("[Outseta Webhook] Account erstellt:", email);
        // Hier könnten wir einen neuen Member-Eintrag erstellen
        break;

      case OUTSETA_EVENTS.ACCOUNT_STAGE_UPDATED:
        console.log("[Outseta Webhook] Account Stage aktualisiert:", accountUid);
        // Hier könnten wir den Account-Status aktualisieren
        break;

      default:
        console.log("[Outseta Webhook] Unbekanntes Event:", event);
    }

    return NextResponse.json({ success: true, event });
  } catch (error) {
    console.error("[Outseta Webhook] Fehler:", error);
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
 * Verarbeitet aktive Subscriptions (Started, Renewed)
 */
async function handleSubscriptionActive(
  member: Awaited<ReturnType<typeof getMemberByEmail>>,
  data: {
    email: string;
    accountUid?: string;
    personUid?: string;
    planUid: string;
    startDate?: string;
    endDate?: string;
  }
) {
  console.log("[Outseta Webhook] Subscription aktivieren:", data);

  if (member?.telegram_user_id) {
    // Mitglied hat Telegram verknüpft - aktivieren
    const result = await activateSubscription(member.telegram_user_id, data.planUid, {
      account_uid: data.accountUid,
      person_uid: data.personUid,
      email: data.email,
    });

    if (result.success) {
      // Expiration Date setzen wenn vorhanden
      if (data.endDate) {
        await updateMember(member.telegram_user_id, {
          subscription_expires_at: data.endDate,
        });
      }
    }

    console.log("[Outseta Webhook] Aktivierung Ergebnis:", result);
  } else if (member) {
    // Mitglied existiert aber ohne Telegram - nur Status aktualisieren
    await updateMember(member.telegram_user_id, {
      subscription_status: "active",
      subscription_plan: data.planUid,
      subscription_started_at: data.startDate,
      subscription_expires_at: data.endDate,
      outseta_account_uid: data.accountUid,
      outseta_person_uid: data.personUid,
      outseta_email: data.email.toLowerCase(),
    });
    console.log("[Outseta Webhook] Mitglied aktualisiert (ohne Telegram)");
  } else {
    // Kein Mitglied gefunden - später verknüpfen
    console.log("[Outseta Webhook] Kein Mitglied gefunden für:", data.email);
    // TODO: Hier könnte man einen "pending" Eintrag erstellen
    // damit der User später sein Telegram verknüpfen kann
  }
}

/**
 * Verarbeitet gekündigte Subscriptions
 */
async function handleSubscriptionCancelled(
  member: Awaited<ReturnType<typeof getMemberByEmail>>,
  email: string
) {
  console.log("[Outseta Webhook] Subscription Kündigung angefordert für:", email);

  if (member?.telegram_user_id) {
    const result = await cancelSubscription(member.telegram_user_id, "cancelled");
    console.log("[Outseta Webhook] Kündigung Ergebnis:", result);
  } else {
    console.log("[Outseta Webhook] Kein Telegram-Mitglied gefunden für Kündigung:", email);
  }
}

/**
 * Verarbeitet fehlgeschlagene Zahlungen
 */
async function handlePaymentDeclined(
  member: Awaited<ReturnType<typeof getMemberByEmail>>,
  email: string
) {
  console.log("[Outseta Webhook] Zahlung fehlgeschlagen für:", email);

  if (member?.telegram_user_id) {
    // Optional: User warnen oder nach mehreren Fehlversuchen entfernen
    // Für jetzt nur loggen und Status aktualisieren
    await logActivity({
      action_type: "webhook_received",
      telegram_user_id: member.telegram_user_id,
      details: {
        event: "payment_declined",
        email,
      },
    });
    
    // Optional: User per Telegram benachrichtigen
    // await sendMessage({
    //   chat_id: member.telegram_user_id,
    //   text: "⚠️ Deine Zahlung konnte nicht verarbeitet werden. Bitte überprüfe deine Zahlungsmethode.",
    // });
    
    console.log("[Outseta Webhook] Payment Declined für Mitglied:", member.telegram_user_id);
  } else {
    console.log("[Outseta Webhook] Kein Telegram-Mitglied gefunden für Payment Declined:", email);
  }
}

/**
 * GET - Webhook-Status prüfen
 */
export async function GET() {
  return NextResponse.json({
    status: "Outseta Webhook aktiv",
    telegram_plans: TELEGRAM_GROUP_PLANS,
    webhook_secret_configured: !!WEBHOOK_SECRET,
    signature_header: "x-hub-signature-256",
    events_supported: [
      OUTSETA_EVENTS.SUBSCRIPTION_STARTED,
      OUTSETA_EVENTS.SUBSCRIPTION_RENEWED,
      OUTSETA_EVENTS.SUBSCRIPTION_CANCELLED,
      OUTSETA_EVENTS.SUBSCRIPTION_PAYMENT_DECLINED,
      OUTSETA_EVENTS.ACCOUNT_CREATED,
      OUTSETA_EVENTS.ACCOUNT_STAGE_UPDATED,
    ],
  });
}

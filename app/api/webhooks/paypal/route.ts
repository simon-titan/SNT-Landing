import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// PayPal-Webhook-Ereignisse
type PayPalWebhookEvent = {
  id: string;
  event_type: string;
  resource_type: string;
  summary: string;
  resource: any;
  create_time: string;
};

// Outseta Account-Erstellung
type OutsetaAccountRequest = {
  Account: {
    Name: string;
    BillingAddress?: {
      AddressLine1?: string;
      AddressLine2?: string;
      City?: string;
      State?: string;
      PostalCode?: string;
      Country?: string;
    };
  };
  Person: {
    Email: string;
    FirstName: string;
    LastName: string;
    Language?: string;
  };
  PasswordRequired: boolean;
  SendWelcomeEmail: boolean;
  SubscriptionPlan?: {
    Uid: string;
  };
};

// Plan-Mapping basierend auf PayPal-Produkten
const PLAN_MAPPING: Record<string, string> = {
  // PayPal Lifetime Button (NULRVQG5GN8PE)
  'NULRVQG5GN8PE': process.env.OUTSETA_LIFETIME_PLAN_UID || 'rmkzJaWg',
  // PayPal Abo Plan ID
  'P-59C23375XF491315BNCBCDVQ': process.env.OUTSETA_MONTHLY_PLAN_UID || 'Nmd4Oxm0',
};

// Debug-Funktion für ausführliches Logging
function debugLog(message: string, data?: any) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [PayPal Webhook Debug] ${message}`);
  if (data) {
    console.log(`[${timestamp}] [PayPal Webhook Debug] Data:`, JSON.stringify(data, null, 2));
  }
}

// PayPal Webhook-Signatur verifizieren
async function verifyPayPalWebhook(
  body: string,
  headers: Record<string, string | undefined>
): Promise<boolean> {
  try {
    debugLog('Starte Webhook-Verifizierung');
    
    const authAlgo = headers['paypal-auth-algo'];
    const transmission_id = headers['paypal-transmission-id'];
    const cert_url = headers['paypal-cert-url'];
    const transmission_sig = headers['paypal-transmission-sig'];
    const transmission_time = headers['paypal-transmission-time'];
    
    debugLog('Webhook Headers für Verifizierung', {
      authAlgo,
      transmission_id,
      cert_url: cert_url ? 'vorhanden' : 'fehlt',
      transmission_sig: transmission_sig ? 'vorhanden' : 'fehlt',
      transmission_time
    });
    
    // In Development-Modus alle Requests akzeptieren
    if (process.env.NODE_ENV !== 'production') {
      if (!authAlgo || !transmission_id || !cert_url || !transmission_sig || !transmission_time) {
        debugLog('Test-Request ohne vollständige PayPal-Headers - in Development erlaubt');
        return true;
      } else {
        debugLog('PayPal-Request mit Headers in Development-Modus - Signatur-Verifizierung übersprungen');
        return true;
      }
    }
    
    // Produktionsumgebung: Vollständige Verifizierung
    if (!authAlgo || !transmission_id || !cert_url || !transmission_sig || !transmission_time) {
      debugLog('FEHLER: Fehlende Header für Verifizierung');
      return false;
    }

    // PayPal Webhook-Verifizierung über PayPal API
    debugLog('Führe PayPal API-Verifizierung durch');
    
    const verificationData = {
      auth_algo: authAlgo,
      cert_url: cert_url,
      transmission_id: transmission_id,
      transmission_sig: transmission_sig,
      transmission_time: transmission_time,
      webhook_id: process.env.PAYPAL_WEBHOOK_ID,
      webhook_event: JSON.parse(body)
    };

    debugLog('Webhook-ID für Verifizierung', { webhook_id: process.env.PAYPAL_WEBHOOK_ID });

    const response = await fetch('https://api-m.paypal.com/v1/notifications/verify-webhook-signature', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await getPayPalAccessToken()}`,
      },
      body: JSON.stringify(verificationData)
    });

    const result = await response.json();
    debugLog('PayPal Verifizierung Antwort', { 
      status: response.status,
      verification_status: result.verification_status,
      result 
    });
    
    return result.verification_status === 'SUCCESS';
    
  } catch (error) {
    debugLog('FEHLER bei Signatur-Verifizierung', { error: error.message });
    return false;
  }
}

// PayPal Access Token holen
async function getPayPalAccessToken(): Promise<string> {
  debugLog('Hole PayPal Access Token');
  
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const isProduction = process.env.NODE_ENV === 'production';
  
  debugLog('PayPal Umgebung', { 
    isProduction, 
    hasClientId: !!clientId, 
    hasClientSecret: !!clientSecret 
  });
  
  if (!clientId || !clientSecret) {
    throw new Error('PayPal Credentials fehlen');
  }

  const base64Credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const baseURL = isProduction ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';

  debugLog('PayPal Token Request', { baseURL });

  const response = await fetch(`${baseURL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${base64Credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials'
  });

  const data = await response.json();
  debugLog('PayPal Token Antwort', { 
    status: response.status, 
    hasToken: !!data.access_token 
  });
  
  return data.access_token;
}

// Plan in Outseta validieren
async function validateOutsetaPlan(planUid: string, outsetaDomain: string, outsetaApiKey: string, outsetaSecretKey: string): Promise<boolean> {
  try {
    debugLog('Validiere Plan-UID in Outseta', { planUid });
    
    const planResponse = await fetch(`https://${outsetaDomain}/api/v1/billing/plans/${planUid}`, {
      method: 'GET',
      headers: {
        'Authorization': `Outseta ${outsetaApiKey}:${outsetaSecretKey}`,
        'Content-Type': 'application/json',
      }
    });

    debugLog('Plan-Validierung Response', { 
      status: planResponse.status,
      statusText: planResponse.statusText 
    });

    if (planResponse.ok) {
      const planData = await planResponse.json();
      debugLog('Plan erfolgreich gefunden', { 
        planName: planData.Name,
        planUid: planData.Uid,
        isActive: planData.IsActive 
      });
      return planData.IsActive;
    } else {
      debugLog('Plan nicht gefunden oder inaktiv', { 
        status: planResponse.status,
        planUid 
      });
      return false;
    }
  } catch (error) {
    debugLog('FEHLER bei Plan-Validierung', { error: error.message, planUid });
    return false;
  }
}

// Outseta Account erstellen
async function createOutsetaAccount(accountData: OutsetaAccountRequest): Promise<any> {
  debugLog('Starte Outseta Account-Erstellung');
  
  const outsetaDomain = process.env.OUTSETA_DOMAIN || 'seitennull---fzco.outseta.com';
  const outsetaApiKey = process.env.OUTSETA_API_KEY || '9e7e21fb-147a-4e7e-b137-6a1459c78b77' ;
  const outsetaSecretKey = process.env.OUTSETA_SECRET_KEY || '7c37ebc69ff5b7e012c470ea7b20e819';

  debugLog('Outseta Konfiguration', {
    domain: outsetaDomain,
    hasApiKey: !!outsetaApiKey,
    hasSecretKey: !!outsetaSecretKey,
    isProduction: process.env.NODE_ENV === 'production'
  });

  // Development-Modus: Outseta-Call simulieren
  if ((!outsetaApiKey || !outsetaSecretKey) && process.env.NODE_ENV === 'development') {
    debugLog('DEVELOPMENT MODE - Account-Erstellung simuliert', accountData);
    return {
      Uid: 'DEV-ACCOUNT-' + Date.now(),
      Email: accountData.Person.Email,
      FirstName: accountData.Person.FirstName,
      LastName: accountData.Person.LastName,
      Message: 'Development Mode - Account simuliert'
    };
  }

  if (!outsetaApiKey || !outsetaSecretKey) {
    throw new Error('Outseta API Credentials fehlen');
  }

  // Plan-UID validieren falls vorhanden
  if (accountData.SubscriptionPlan?.Uid) {
    const isPlanValid = await validateOutsetaPlan(
      accountData.SubscriptionPlan.Uid, 
      outsetaDomain, 
      outsetaApiKey, 
      outsetaSecretKey
    );
    
    if (!isPlanValid) {
      debugLog('WARNUNG: Plan-UID ist ungültig oder inaktiv - Account wird ohne Subscription erstellt', { 
        planUid: accountData.SubscriptionPlan.Uid 
      });
      // Plan entfernen, damit Account ohne Subscription erstellt wird
      delete accountData.SubscriptionPlan;
    } else {
      debugLog('Plan-UID erfolgreich validiert', { planUid: accountData.SubscriptionPlan.Uid });
    }
  }

  debugLog('Outseta Account-Daten', accountData);

  // NEUER ANSATZ: Verwende /crm/registrations für komplette Account-Registrierung mit Subscription
  const accountName = accountData.Account?.Name || `${accountData.Person.FirstName} ${accountData.Person.LastName}`;
  
  const registrationData: any = {
    Name: accountName,
    PersonAccount: [
      {
        IsPrimary: true,
        Person: {
          Email: accountData.Person.Email,
          FirstName: accountData.Person.FirstName,
          LastName: accountData.Person.LastName,
          Language: accountData.Person.Language || 'de'
        }
      }
    ]
  };

  // Subscription hinzufügen falls Plan-UID vorhanden
  if (accountData.SubscriptionPlan?.Uid) {
    registrationData.Subscriptions = [
      {
        BillingRenewalTerm: 1,
        Plan: {
          Uid: accountData.SubscriptionPlan.Uid
        }
      }
    ];
    debugLog('Registrierung MIT Subscription', { planUid: accountData.SubscriptionPlan.Uid });
  } else {
    debugLog('Registrierung OHNE Subscription (keine Plan-UID)');
  }

  debugLog('Komplette Registrierungs-Daten', registrationData);

  const registrationResponse = await fetch(`https://${outsetaDomain}/api/v1/crm/registrations`, {
    method: 'POST',
    headers: {
      'Authorization': `Outseta ${outsetaApiKey}:${outsetaSecretKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(registrationData)
  });

  debugLog('Outseta Registration API Response', { 
    status: registrationResponse.status, 
    statusText: registrationResponse.statusText 
  });

  if (!registrationResponse.ok) {
    const errorText = await registrationResponse.text();
    debugLog('FEHLER bei Outseta Registration', { 
      status: registrationResponse.status, 
      errorText 
    });
    throw new Error(`Outseta Registration API Fehler: ${registrationResponse.status} - ${errorText}`);
  }

  const registrationResult = await registrationResponse.json();
  debugLog('Outseta Registration erfolgreich abgeschlossen', registrationResult);

  // Ergebnisse aus Registration extrahieren
  const personResult = registrationResult.PersonAccount?.[0]?.Person || null;
  const accountResult = registrationResult;
  const subscriptionResult = registrationResult.Subscriptions?.[0] || registrationResult.CurrentSubscription || null;

  // Kombiniertes Ergebnis zurückgeben
  const combinedResult = {
    person: personResult,
    account: accountResult,
    subscription: subscriptionResult,
    personUid: personResult?.Uid || null,
    accountUid: accountResult?.Uid || null,
    subscriptionUid: subscriptionResult?.Uid || null
  };

  debugLog('Outseta Person + Account + Subscription erfolgreich erstellt', {
    personUid: combinedResult.personUid,
    accountUid: combinedResult.accountUid, 
    subscriptionUid: combinedResult.subscriptionUid,
    hasSubscription: !!subscriptionResult,
    planValidated: !!accountData.SubscriptionPlan?.Uid
  });
  return combinedResult;
}

// PayPal Kundendaten aus verschiedenen Event-Typen extrahieren
function extractCustomerData(event: PayPalWebhookEvent): {
  email: string;
  firstName: string;
  lastName: string;
  planUid?: string;
} | null {
  try {
    debugLog('Extrahiere Kundendaten aus Event', { 
      event_type: event.event_type,
      resource_type: event.resource_type 
    });
    
    let customerData: any = null;
    let planUid: string | undefined;

    switch (event.event_type) {
      case 'PAYMENT.CAPTURE.COMPLETED':
      case 'PAYMENT.SALE.COMPLETED':
        debugLog('Verarbeite PAYMENT.CAPTURE.COMPLETED oder PAYMENT.SALE.COMPLETED');
        // Einmalige Zahlung (Lifetime)
        customerData = event.resource?.payer || event.resource?.payee;
        // Plan basierend auf der Zahlungs-ID bestimmen
        if (event.resource?.invoice_id?.includes('NULRVQG5GN8PE')) {
          planUid = PLAN_MAPPING['NULRVQG5GN8PE'];
          debugLog('Lifetime Plan erkannt', { planUid });
        }
        // Plan basierend auf custom field bestimmen
        if (event.resource?.custom === 'SNTTRADES_MONTHLY_PLAN') {
          planUid = PLAN_MAPPING['P-59C23375XF491315BNCBCDVQ'];
          debugLog('Monthly Plan aus custom field erkannt', { planUid });
        }
        break;
        
      case 'BILLING.SUBSCRIPTION.ACTIVATED':
      case 'BILLING.SUBSCRIPTION.CREATED':
        debugLog('Verarbeite Abonnement Event');
        // Abonnement - Kundendaten können in verschiedenen Feldern stehen
        customerData = event.resource?.subscriber || event.resource?.payer;
        
        // Wenn keine Subscriber-Daten vorhanden, versuche billing_agreement_id zu nutzen
        if (!customerData && event.resource?.billing_agreement_id) {
          debugLog('Keine direkten Kundendaten in Subscription - Event wird übersprungen');
          return null; // Subscription-Events ohne Kundendaten ignorieren
        }
        
        planUid = PLAN_MAPPING[event.resource?.plan_id] || PLAN_MAPPING['P-59C23375XF491315BNCBCDVQ'];
        debugLog('Abo Plan erkannt', { 
          plan_id: event.resource?.plan_id, 
          planUid,
          hasCustomerData: !!customerData
        });
        break;
        
      case 'CHECKOUT.ORDER.APPROVED':
      case 'CHECKOUT.ORDER.COMPLETED':
        debugLog('Verarbeite Checkout Order Event');
        // Checkout Order
        customerData = event.resource?.payer;
        break;
        
      default:
        debugLog(`Unbekannter Event-Typ: ${event.event_type}`);
        return null;
    }

    debugLog('Extrahierte Raw Customer Data', customerData);

    if (!customerData) {
      debugLog('FEHLER: Keine Kundendaten gefunden in Event', event);
      return null;
    }

    // Email extrahieren
    const email = customerData.email_address || customerData.email || customerData?.payer_info?.email;
    
    // Namen extrahieren
    const name = customerData.name || customerData?.payer_info || {};
    const firstName = name.given_name || name.first_name || 'PayPal';
    const lastName = name.surname || name.last_name || 'Kunde';

    if (!email) {
      debugLog('FEHLER: Keine E-Mail-Adresse gefunden', customerData);
      return null;
    }

    const extractedData = {
      email,
      firstName,
      lastName,
      planUid
    };

    debugLog('Erfolgreich extrahierte Kundendaten', extractedData);
    return extractedData;
    
  } catch (error) {
    debugLog('FEHLER beim Extrahieren der Kundendaten', { error: error.message });
    return null;
  }
}

export async function POST(request: NextRequest) {
  const timestamp = new Date().toISOString();
  console.log(`\n\n=== [${timestamp}] PAYPAL WEBHOOK EMPFANGEN ===`);
  debugLog('Webhook-Request gestartet');
  
  try {
    // Body und Headers lesen
    const body = await request.text();
    const headers: Record<string, string | undefined> = {};
    
    // Headers sammeln
    request.headers.forEach((value, key) => {
      headers[key.toLowerCase()] = value;
    });

    debugLog('Request Details', {
      bodyLength: body.length,
      userAgent: headers['user-agent'],
      contentType: headers['content-type'],
      paypalHeaders: Object.keys(headers).filter(key => key.startsWith('paypal-'))
    });

    // Webhook-Signatur verifizieren
    debugLog('Starte Webhook-Verifizierung');
    const isValid = await verifyPayPalWebhook(body, headers);
    if (!isValid) {
      debugLog('FEHLER: Ungültige Webhook-Signatur');
      return NextResponse.json({ error: 'Ungültige Webhook-Signatur' }, { status: 401 });
    }

    debugLog('Webhook-Signatur erfolgreich verifiziert');

    // Event parsen
    const event: PayPalWebhookEvent = JSON.parse(body);
    debugLog('Event geparst', {
      event_type: event.event_type,
      event_id: event.id,
      resource_type: event.resource_type,
      summary: event.summary
    });

    // Vollständige Event-Details loggen
    console.log(`[${timestamp}] [PayPal Webhook] VOLLSTÄNDIGE EVENT-DETAILS:`);
    console.log(JSON.stringify(event, null, 2));

    // Kundendaten extrahieren
    debugLog('Starte Kundendatenextraktion');
    const customerData = extractCustomerData(event);
    if (!customerData) {
      debugLog('Keine relevanten Kundendaten gefunden - Event wird ignoriert');
      return NextResponse.json({ message: 'Event verarbeitet (keine Aktion erforderlich)' });
    }

    debugLog('Kundendaten erfolgreich extrahiert', customerData);

    // Outseta Account-Daten vorbereiten
    const outsetaAccountData: OutsetaAccountRequest = {
      Account: {
        Name: `${customerData.firstName} ${customerData.lastName}`,
      },
      Person: {
        Email: customerData.email,
        FirstName: customerData.firstName,
        LastName: customerData.lastName,
        Language: 'de'
      },
      PasswordRequired: true, // Nutzer muss Passwort festlegen
      SendWelcomeEmail: true,  // Outseta sendet Bestätigungs-E-Mail
    };

    // Plan hinzufügen falls vorhanden
    if (customerData.planUid) {
      outsetaAccountData.SubscriptionPlan = {
        Uid: customerData.planUid
      };
      debugLog('Plan zu Account-Daten hinzugefügt', { planUid: customerData.planUid });
    }

    // Outseta Account erstellen
    debugLog('Starte Outseta Account-Erstellung');
    const outsetaResult = await createOutsetaAccount(outsetaAccountData);

    const successData = {
      event_type: event.event_type,
      event_id: event.id,
      customer_email: customerData.email,
      outseta_person_id: outsetaResult?.personUid || outsetaResult?.Uid,
      outseta_account_id: outsetaResult?.accountUid,
      outseta_subscription_id: outsetaResult?.subscriptionUid,
      plan_uid: customerData.planUid
    };

    debugLog('Webhook erfolgreich verarbeitet', successData);
    console.log(`\n=== [${timestamp}] WEBHOOK ERFOLGREICH VERARBEITET ===`);
    console.log(JSON.stringify(successData, null, 2));
    console.log(`=== ENDE WEBHOOK VERARBEITUNG ===\n`);

    return NextResponse.json({
      success: true,
      message: 'PayPal Webhook erfolgreich verarbeitet',
      event_type: event.event_type,
      customer_email: customerData.email,
      outseta_person_created: !!(outsetaResult?.personUid || outsetaResult?.Uid),
      outseta_account_created: !!outsetaResult?.accountUid,
      outseta_subscription_created: !!outsetaResult?.subscriptionUid
    });

  } catch (error) {
    debugLog('KRITISCHER FEHLER beim Verarbeiten des Webhooks', { 
      error: error.message,
      stack: error.stack 
    });
    
    console.log(`\n=== [${timestamp}] WEBHOOK FEHLER ===`);
    console.error('FEHLER:', error);
    console.log(`=== ENDE WEBHOOK FEHLER ===\n`);
    
    return NextResponse.json({
      error: 'Fehler beim Verarbeiten des Webhooks',
      details: error instanceof Error ? error.message : 'Unbekannter Fehler'
    }, { status: 500 });
  }
} 
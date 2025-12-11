# PayPal Mobile Footer & Pricing Selection Modal - Dokumentation

## Übersicht

Diese Dokumentation beschreibt die Implementierung eines mobilen Pricing-Footers und eines Pricing-Selection-Modals mit PayPal-Integration. Die Komponenten unterstützen sowohl monatliche Abonnements (Subscriptions) als auch einmalige Zahlungen (Lifetime) und sind vollständig kompatibel mit der bestehenden Outseta-Account-Erstellung über PayPal Webhooks.

## Architektur

### Komponenten

1. **`MobilePricingFooter`** (`components/ui/mobile-pricing-footer.tsx`)
   - Fixed Footer nur auf Mobile-Geräten sichtbar
   - Zeigt monatlichen Preis und "3 Optionen" Button
   - Direkter PayPal Express Button für monatliches Abonnement
   - Öffnet Pricing Selection Modal bei Klick auf "3 Optionen" oder "Join"

2. **`PricingSelectionModal`** (`components/ui/pricing-selection-modal.tsx`)
   - Bottom Sheet Modal für Plan-Auswahl
   - Unterstützt Free, Monthly und Lifetime Pläne
   - Integrierte PayPal-Buttons für Monthly und Lifetime
   - Embedded Outseta Checkout für alternative Zahlungsmethoden
   - Zwei Views: Selection und Checkout

### PayPal SDK Integration

#### Problem: SDK-Konflikte

PayPal SDKs registrieren globale Event Listener, die nicht entfernt werden können. Wenn zwischen verschiedenen SDK-Typen gewechselt wird (Subscription vs. Order), entstehen Konflikte:

- **Subscription SDK** (`intent=subscription&vault=true`): Für monatliche Abonnements
- **Order SDK** (`intent=order`): Für einmalige Zahlungen (Lifetime)

#### Lösung: Dynamisches SDK-Laden

1. **Beim Öffnen des Modals**: SDK wird basierend auf ausgewähltem Plan geladen
2. **Beim Wechsel zwischen Plänen**: SDK wird dynamisch geladen, wenn das falsche SDK aktiv ist
3. **Beim Schließen des Modals**: Subscription SDK wird wiederhergestellt für Mobile Footer

## Implementierungsdetails

### Mobile Footer (`mobile-pricing-footer.tsx`)

#### PayPal SDK Laden

```typescript
const loadPayPalSDK = () => {
  // Prüft ob Subscription SDK bereits geladen ist (vom Modal)
  const existingScript = document.getElementById("paypal-sdk-mobile") || 
                         document.getElementById("paypal-sdk-mobile-footer");
  
  if (existingScript && (window as any).paypal?.Buttons) {
    setPaypalLoaded(true);
    return;
  }

  // Lädt Subscription SDK falls nicht vorhanden
  const script = document.createElement("script");
  script.id = "paypal-sdk-mobile-footer";
  script.src = "https://www.paypal.com/sdk/js?client-id=...&vault=true&intent=subscription&currency=EUR";
  // ...
};
```

#### PayPal Button Rendering

```typescript
const buttonConfig = {
  createSubscription: function (data: any, actions: any) {
    return actions.subscription.create({
      plan_id: pricing.monthly.paypal.planId,
      custom_id: `TG_USER_${telegramUserId}|SNTTRADES_MONTHLY_PLAN`,
      // ...
    });
  },
  onApprove: function (data: any) {
    // Redirect zu Thank-You-Seite mit subscription_id
    window.location.href = `/thank-you-3?subscription_id=${data.subscriptionID}`;
  }
};
```

#### Custom PayPal Button Overlay

Da PayPal Buttons in iframes gerendert werden (Cross-Origin-Restriktionen), wird ein Overlay-Ansatz verwendet:

1. PayPal Button wird in verstecktem Container gerendert (`opacity: 0`, `pointerEvents: auto`)
2. Custom Overlay Button liegt darüber (`pointerEvents: none` wenn bereit)
3. Klick auf Custom Button triggert den PayPal Flow

### Pricing Selection Modal (`pricing-selection-modal.tsx`)

#### SDK-Laden basierend auf Plan

```typescript
const renderPayPalButton = () => {
  if (selectedOption === "monthly") {
    // Prüft ob Subscription SDK geladen ist
    const subscriptionScript = document.getElementById("paypal-sdk-mobile");
    
    // Wenn Order SDK geladen ist, lädt Subscription SDK
    if (orderScript && !subscriptionScript) {
      loadPayPalSDK("subscription");
      return;
    }
    
    // Rendert Button mit createSubscription
  } else if (selectedOption === "lifetime") {
    // Prüft ob Order SDK geladen ist
    const orderScript = document.getElementById("paypal-sdk-order");
    
    // Wenn Subscription SDK geladen ist, lädt Order SDK
    if (subscriptionScript && !orderScript) {
      loadPayPalSDK("order");
      return;
    }
    
    // Rendert Button mit createOrder
  }
};
```

#### SDK-Wiederherstellung beim Schließen

```typescript
const restoreSubscriptionSDK = () => {
  const subscriptionScript = document.getElementById("paypal-sdk-mobile");
  const orderScript = document.getElementById("paypal-sdk-order");
  
  // Wenn Order SDK geladen ist, entferne es und lade Subscription SDK
  if (orderScript && !subscriptionScript) {
    orderScript.remove();
    delete (window as any).paypal;
    // Warte 500ms, dann lade Subscription SDK
    setTimeout(() => {
      loadPayPalSDK("subscription");
      // Trigger Event für Mobile Footer
      window.dispatchEvent(new Event('paypal-sdk-loaded'));
    }, 500);
  }
};
```

#### Event-System für Mobile Footer

```typescript
// Im Modal nach SDK-Laden
script.onload = () => {
  window.dispatchEvent(new Event('paypal-sdk-loaded'));
};

// Im Mobile Footer
useEffect(() => {
  const handleSDKLoaded = () => {
    setPaypalLoaded(false);
    setPaypalButtonRendered(false);
    setTimeout(() => {
      if ((window as any).paypal) {
        setPaypalLoaded(true);
      }
    }, 500);
  };
  
  window.addEventListener('paypal-sdk-loaded', handleSDKLoaded);
  return () => window.removeEventListener('paypal-sdk-loaded', handleSDKLoaded);
}, []);
```

## Kompatibilität mit Outseta

### ✅ Vollständig kompatibel

Die PayPal-Integration ist vollständig kompatibel mit der bestehenden Outseta-Account-Erstellung. Die Modal-Komponente verwendet die gleichen PayPal-APIs und Custom IDs wie die bestehenden Checkout-Seiten (`/checkout/monthly` und `/checkout/lifetime`).

#### Unterschiede zwischen Checkout-Seiten und Modal

| Feature | Checkout-Seiten | Modal-Komponente | Kompatibel? |
|---------|----------------|------------------|-------------|
| **Monthly PayPal** | `Buttons` API mit `createSubscription` | `Buttons` API mit `createSubscription` | ✅ Ja |
| **Lifetime PayPal** | `HostedButtons` API | `Buttons` API mit `createOrder` | ✅ Ja* |
| **Custom IDs** | `TG_USER_${id}\|SNTTRADES_MONTHLY_PLAN` | `TG_USER_${id}\|SNTTRADES_MONTHLY_PLAN` | ✅ Ja |
| **Plan IDs** | Aus `pricing-config.ts` | Aus `pricing-config.ts` | ✅ Ja |
| **Redirect URLs** | `/thank-you-3?subscription_id=...` | `/thank-you-3?subscription_id=...` | ✅ Ja |

\* *Beide Ansätze werden von PayPal Webhooks korrekt verarbeitet und erstellen Outseta-Accounts*

#### Warum beide Lifetime-Ansätze funktionieren

1. **HostedButtons** (Checkout-Seiten): PayPal-hosted Button mit vorkonfiguriertem Plan
2. **Buttons API mit createOrder** (Modal): Dynamisch erstellter Order mit gleichen Daten

Beide generieren die gleichen PayPal Events:
- `PAYMENT.CAPTURE.COMPLETED` für einmalige Zahlungen
- `CHECKOUT.ORDER.COMPLETED` für abgeschlossene Bestellungen

Die Webhooks extrahieren die Daten identisch und erstellen Outseta-Accounts mit den gleichen Informationen.

### PayPal Webhook Verarbeitung

Die PayPal Webhooks (`app/api/webhooks/paypal/route.ts`) verarbeiten beide Zahlungstypen identisch:

#### 1. Gleiche PayPal Plan-IDs

Beide Komponenten verwenden die gleichen Plan-IDs aus `config/pricing-config.ts`:

```typescript
// Monthly Plan
plan_id: pricing.monthly.paypal.planId  // z.B. "P-86799084EE8763009NE273NY"

// Lifetime Plan
amount: { value: pricing.lifetime.price.toString(), currency_code: "EUR" }
```

#### 2. Gleiche Custom IDs

Die Custom IDs folgen dem gleichen Format:

```typescript
// Monthly
custom_id: `TG_USER_${telegramUserId}|SNTTRADES_MONTHLY_PLAN`

// Lifetime
custom_id: `TG_USER_${telegramUserId}|SNTTRADES_LIFETIME_PLAN`
```

#### 3. PayPal Webhook Integration

Die PayPal Webhooks (`app/api/webhooks/paypal/route.ts`) verarbeiten beide Zahlungstypen:

- **Monthly**: `BILLING.SUBSCRIPTION.ACTIVATED` / `BILLING.SUBSCRIPTION.CREATED`
- **Lifetime**: `PAYMENT.CAPTURE.COMPLETED` / `CHECKOUT.ORDER.COMPLETED`

Die Webhooks extrahieren automatisch:
- Email-Adresse
- Vor- und Nachname
- Plan-UID (aus Custom ID oder Event-Daten)

Und erstellen Outseta-Accounts mit:
- Korrektem Subscription Plan (falls vorhanden)
- Passwort-Erstellung erforderlich
- Willkommens-E-Mail

#### 4. Redirect-URLs

Beide Komponenten verwenden die gleichen Redirect-URLs:

```typescript
// Monthly
/thank-you-3?subscription_id=${subscriptionID}&telegram_user_id=${telegramUserId}

// Lifetime
/thank-you-3?source=paypal_lifetime&order_id=${orderID}&telegram_user_id=${telegramUserId}
```

#### 5. Unterschiede zwischen Checkout-Seiten und Modal

**Wichtig**: Die Modal-Komponente verwendet für Lifetime `Buttons` API mit `createOrder`, während die Checkout-Seiten `HostedButtons` verwenden. Beide Ansätze sind vollständig kompatibel:

| Feature | Checkout-Seiten | Modal-Komponente | Kompatibel? |
|---------|----------------|------------------|-------------|
| **Monthly PayPal** | `Buttons` API mit `createSubscription` | `Buttons` API mit `createSubscription` | ✅ Ja |
| **Lifetime PayPal** | `HostedButtons` API | `Buttons` API mit `createOrder` | ✅ Ja* |
| **Custom IDs** | `TG_USER_${id}\|SNTTRADES_MONTHLY_PLAN` | `TG_USER_${id}\|SNTTRADES_MONTHLY_PLAN` | ✅ Ja |
| **Plan IDs** | Aus `pricing-config.ts` | Aus `pricing-config.ts` | ✅ Ja |

\* *Beide Lifetime-Ansätze generieren die gleichen PayPal Events (`PAYMENT.CAPTURE.COMPLETED`, `CHECKOUT.ORDER.COMPLETED`) und werden von den Webhooks identisch verarbeitet.*

#### 6. Webhook-Verarbeitung

Die PayPal Webhooks (`app/api/webhooks/paypal/route.ts`) verarbeiten beide Zahlungstypen identisch:

- **Monthly**: `BILLING.SUBSCRIPTION.ACTIVATED` / `BILLING.SUBSCRIPTION.CREATED`
- **Lifetime**: `PAYMENT.CAPTURE.COMPLETED` / `CHECKOUT.ORDER.COMPLETED`

Die Webhooks extrahieren automatisch:
- Email-Adresse aus `payer.email_address` oder `subscriber.email_address`
- Vor- und Nachname aus `payer.name` oder `subscriber.name`
- Plan-UID aus Custom ID oder Event-Daten

Und erstellen Outseta-Accounts mit:
- Korrektem Subscription Plan (falls vorhanden)
- Passwort-Erstellung erforderlich
- Willkommens-E-Mail

## Verwendung in anderen Projekten

### Schritt 1: Komponenten kopieren

Kopieren Sie folgende Dateien:
- `components/ui/mobile-pricing-footer.tsx`
- `components/ui/pricing-selection-modal.tsx`
- `config/pricing-config.ts` (oder passen Sie an)

### Schritt 2: Abhängigkeiten installieren

```bash
npm install @chakra-ui/react @phosphor-icons/react
```

### Schritt 3: PayPal SDK konfigurieren

1. **PayPal Client ID**: Ersetzen Sie `ASzGd21OHNK5yaZUKtlBrKw4F2oN04ZcUxyUmzAy_VeOjMWYCV7vEy1D0p_biwg5VcBVh_NvfOTEZnmF` mit Ihrer eigenen Client ID

2. **Plan IDs**: Konfigurieren Sie Ihre PayPal Plan IDs in `pricing-config.ts`:
   ```typescript
   monthly: {
     paypal: {
       planId: "IHR_MONTHLY_PLAN_ID"
     }
   }
   ```

### Schritt 4: Outseta Integration (optional)

Falls Sie Outseta verwenden:

1. **Outseta Embed**: Die Modal-Komponente enthält bereits Outseta Embed:
   ```tsx
   <div
     data-o-auth="1"
     data-widget-mode="register"
     data-plan-uid={planPricing.outseta.planUid}
     data-plan-payment-term={planPricing.outseta.paymentTerm}
     // ...
   />
   ```

2. **Outseta Script**: Stellen Sie sicher, dass das Outseta Script geladen ist:
   ```html
   <script src="https://cdn.outseta.com/outseta.min.js"></script>
   ```

3. **Webhook Setup**: Konfigurieren Sie PayPal Webhooks wie in `PAYPAL_WEBHOOK_SETUP.md` beschrieben

### Schritt 5: Styling anpassen

Die Komponenten verwenden Chakra UI 3.0. Passen Sie die Farben an:

```typescript
const SNT_BLUE = "#068CEF";  // Ihre Brand-Farbe
const MODAL_BG = "rgba(40, 40, 40, 0.98)";  // Modal Hintergrund
```

### Schritt 6: Mobile Footer einbinden

In Ihrer Landing Page:

```tsx
import { MobilePricingFooter } from "@/components/ui/mobile-pricing-footer";

export default function LandingPage() {
  return (
    <>
      {/* Ihre Seite */}
      <MobilePricingFooter />
    </>
  );
}
```

## Wichtige Hinweise

### SDK-Konflikte vermeiden

1. **Nie beide SDKs gleichzeitig laden**: Laden Sie immer nur das benötigte SDK
2. **SDK-Wechsel**: Wenn zwischen Monthly/Lifetime gewechselt wird, warten Sie auf SDK-Bereitschaft
3. **Modal schließen**: Stellen Sie sicher, dass Subscription SDK wiederhergestellt wird

### Best Practices

1. **Container-IDs eindeutig**: Verwenden Sie eindeutige Container-IDs für jeden Button
2. **Error Handling**: Implementieren Sie Fehlerbehandlung für SDK-Laden und Button-Rendering
3. **Loading States**: Zeigen Sie Loading-States während SDK-Laden
4. **Event Cleanup**: Entfernen Sie Event Listener beim Unmount

### Bekannte Probleme & Lösungen

#### Problem: "Request listener already exists"
**Ursache**: PayPal SDK wird mehrfach geladen  
**Lösung**: Prüfen Sie vor dem Laden, ob SDK bereits existiert

#### Problem: Button funktioniert nicht nach Modal-Schließen
**Ursache**: Falsches SDK geladen (Order statt Subscription)  
**Lösung**: `restoreSubscriptionSDK()` aufrufen beim Modal-Schließen

#### Problem: Cross-Origin Fehler beim Button-Klick
**Ursache**: PayPal Buttons werden in iframes gerendert  
**Lösung**: Overlay-Ansatz verwenden (siehe Custom PayPal Button)

## Testing

### Manuelle Tests

1. **Mobile Footer**:
   - [ ] Footer wird nur auf Mobile angezeigt
   - [ ] PayPal Button funktioniert
   - [ ] "3 Optionen" öffnet Modal
   - [ ] "Join" öffnet Modal

2. **Modal - Monthly**:
   - [ ] Monthly Plan kann ausgewählt werden
   - [ ] PayPal Button wird gerendert
   - [ ] PayPal Flow funktioniert
   - [ ] Outseta Embed wird angezeigt

3. **Modal - Lifetime**:
   - [ ] Lifetime Plan kann ausgewählt werden
   - [ ] PayPal Button wird gerendert
   - [ ] PayPal Flow funktioniert
   - [ ] Outseta Embed wird angezeigt

4. **SDK-Wechsel**:
   - [ ] Wechsel von Monthly zu Lifetime funktioniert
   - [ ] Wechsel von Lifetime zu Monthly funktioniert
   - [ ] Modal-Schließen stellt Subscription SDK wieder her
   - [ ] Mobile Footer funktioniert nach Modal-Schließen

### Automatisierte Tests (empfohlen)

```typescript
// Beispiel: SDK-Laden testen
describe('PayPal SDK Loading', () => {
  it('should load Subscription SDK for Monthly', async () => {
    // Test implementation
  });
  
  it('should load Order SDK for Lifetime', async () => {
    // Test implementation
  });
});
```

## Support & Troubleshooting

### Debug-Logging

Die Komponenten enthalten umfangreiches Console-Logging:

```typescript
console.log("Subscription SDK geladen für Monthly");
console.log("PayPal Monthly Button erfolgreich gerendert");
console.warn("Order SDK geladen, kann Monthly Button nicht rendern");
```

### Häufige Fehler

1. **"Must pass createSubscription with intent=subscription"**
   - Lösung: Stellen Sie sicher, dass Subscription SDK geladen ist für Monthly

2. **"Must pass vault=true to sdk to use createSubscription"**
   - Lösung: Laden Sie SDK mit `vault=true&intent=subscription`

3. **Button wird nicht gerendert**
   - Lösung: Prüfen Sie Container-ID und SDK-Bereitschaft

## Changelog

### Version 1.0.0
- Initiale Implementierung
- Mobile Footer mit PayPal Express Button
- Pricing Selection Modal mit zwei Views
- SDK-Wechsel-Logik
- Outseta Integration
- Event-System für SDK-Wiederherstellung

## Lizenz

Diese Komponenten sind Teil des SNTTRADES Projekts.


# PayPal Webhook Integration Setup

## Übersicht

Diese Anleitung erklärt, wie Sie die PayPal-Webhook-Integration mit automatischer Outseta-Account-Erstellung einrichten.

## 1. Umgebungsvariablen konfigurieren

Erstellen Sie eine `.env.local` Datei in Ihrem Projektverzeichnis:

```env
# Next.js
NODE_ENV=development

# PayPal Configuration
PAYPAL_CLIENT_ID=your_paypal_client_id_here
PAYPAL_CLIENT_SECRET=your_paypal_client_secret_here
PAYPAL_WEBHOOK_ID=your_paypal_webhook_id_here

# Outseta Configuration
OUTSETA_DOMAIN=seitennull---fzco.outseta.com
OUTSETA_API_KEY=your_outseta_api_key_here
OUTSETA_SECRET_KEY=your_outseta_secret_key_here

# Outseta Plan UIDs (bereits aus auth-config.ts bekannt)
OUTSETA_MONTHLY_PLAN_UID=B9lDEz98
OUTSETA_LIFETIME_PLAN_UID=Rm8R8894
```

## 2. PayPal Developer Dashboard Konfiguration

### Schritt 1: Webhook erstellen
1. Gehen Sie zu [PayPal Developer Dashboard](https://developer.paypal.com/developer/applications)
2. Wählen Sie Ihre App aus
3. Scrollen Sie zu "Webhooks" und klicken Sie "Add Webhook"
4. Webhook URL eingeben:
   - **Development**: `https://your-ngrok-url.ngrok.io/api/webhooks/paypal`
   - **Production**: `https://www.snttrades.de/api/webhooks/paypal`

### Schritt 2: Event-Typen auswählen
Wählen Sie folgende Events aus:
- `PAYMENT.CAPTURE.COMPLETED` - Einmalige Zahlungen (Lifetime)
- `BILLING.SUBSCRIPTION.ACTIVATED` - Neue Abonnements
- `BILLING.SUBSCRIPTION.CREATED` - Abonnement erstellt
- `CHECKOUT.ORDER.APPROVED` - Bestellung genehmigt
- `CHECKOUT.ORDER.COMPLETED` - Bestellung abgeschlossen

### Schritt 3: Webhook ID notieren
Nach dem Erstellen erhalten Sie eine Webhook-ID. Tragen Sie diese in `PAYPAL_WEBHOOK_ID` ein.

## 3. Outseta API Konfiguration

### API-Schlüssel erhalten
1. Gehen Sie zu Ihrem Outseta Dashboard
2. Navigieren Sie zu Settings > Integrations > API
3. Erstellen Sie neue API Keys oder verwenden Sie bestehende
4. Tragen Sie `API Key` und `Secret Key` in die Umgebungsvariablen ein

### Pläne verknüpfen
Die Plan-UIDs sind bereits aus Ihrer `auth-config.ts` bekannt:
- **Lifetime Plan**: `Rm8R8894`
- **Monthly Plan**: `B9lDEz98`

## 4. Webhook-URL für Development (ngrok)

Für lokale Entwicklung verwenden Sie ngrok:

```bash
# ngrok installieren (falls noch nicht vorhanden)
npm install -g ngrok

# Lokalen Server auf Port 3000 exposen
ngrok http 3000
```

Verwenden Sie die ngrok-URL für die Webhook-Konfiguration in PayPal.

## 5. Funktionsweise

### Automatischer Ablauf
1. **Kunde zahlt über PayPal** → PayPal sendet Webhook
2. **Webhook wird empfangen** → `/api/webhooks/paypal`
3. **Signatur verifiziert** → PayPal-Authentizität bestätigt
4. **Kundendaten extrahiert** → E-Mail, Name aus PayPal-Event
5. **Plan zugeordnet** → Basierend auf PayPal-Produkt/Plan
6. **Outseta-Account erstellt** → Mit `PasswordRequired: true`
7. **Bestätigungs-E-Mail** → Outseta sendet E-Mail mit Passwort-Setup

### Unterstützte PayPal-Produkte
- **Lifetime Button** (`NULRVQG5GN8PE`) → Lifetime Plan
- **Monthly Subscription** (`P-59C23375XF491315BNCBCDVQ`) → Monthly Plan

## 6. Testing

### Lokales Testen
1. Starten Sie den Development Server: `npm run dev`
2. Starten Sie ngrok: `ngrok http 3000`
3. Aktualisieren Sie die PayPal Webhook-URL mit der ngrok-URL
4. Führen Sie eine Test-Zahlung durch

### Webhook-Logs überprüfen
Die Webhook-Verarbeitung wird in der Console geloggt:
```
[PayPal Webhook] Webhook erhalten
[PayPal Webhook] Event erhalten: PAYMENT.CAPTURE.COMPLETED
[PayPal Webhook] Kundendaten extrahiert: { email, firstName, lastName }
[Outseta] Account wird erstellt
[Outseta] Account erfolgreich erstellt
```

## 7. Production Deployment

1. Setzen Sie `NODE_ENV=production`
2. Verwenden Sie die Production-Domain für Webhooks
3. Tragen Sie die echten PayPal Production-Credentials ein
4. Testen Sie den gesamten Flow mit echten Zahlungen

## 8. Troubleshooting

### Häufige Probleme
- **401 Ungültige Signatur**: Prüfen Sie PayPal Credentials und Webhook-ID
- **500 Outseta API Fehler**: Prüfen Sie Outseta API-Schlüssel
- **Keine Kundendaten**: Event-Typ wird möglicherweise nicht unterstützt

### Debug-Logs
Alle wichtigen Schritte werden geloggt. Prüfen Sie die Console-Ausgabe für Details.

## 9. Sicherheit

- Webhook-Signaturen werden verifiziert
- API-Schlüssel werden sicher über Umgebungsvariablen verwaltet
- In Development wird Signatur-Verifizierung übersprungen

## 10. Nächste Schritte

Nach erfolgreicher Einrichtung erhalten Kunden:
1. PayPal-Zahlungsbestätigung
2. Outseta-Willkommens-E-Mail mit Passwort-Setup-Link
3. Zugang zur geschützten App-Bereiche

Die Integration ist vollständig automatisiert und erfordert keine manuelle Intervention. 
# SNTTRADES Telegram Bot

## 🤖 Überblick

Dieser Telegram Bot automatisiert den Willkommensprozess für neue SNTTRADES Kunden und leitet sie durch den Kaufprozess.

## 📦 Zwei Versionen verfügbar:

### 1. **Lokaler Bot** (`telegram-bot/bot.ts`)
- ✅ Polling-basiert (läuft kontinuierlich)
- ✅ Für lokale Entwicklung
- ❌ Funktioniert NICHT auf Vercel

### 2. **Vercel Bot** (`app/api/telegram/webhook/route.ts`)
- ✅ Webhook-basiert (serverless)
- ✅ Für Vercel Production
- ✅ Keine kontinuierlichen Prozesse nötig

## 🚀 Bot Starten

### Lokal (Development):
```bash
npm run bot:dev
```

### Vercel (Production):
1. Deploy zu Vercel
2. Webhook setup (siehe unten)

## 📋 Bot Funktionen

### 1. Willkommensnachricht
- Wird gesendet, wenn ein User `/start` im Bot eingibt
- Enthält die komplette Produktbeschreibung von SNTTRADES
- Automatische Weiterleitung zur Zahlungsseite

### 2. Zahlungsbuttons
- **PayPal** → snttrades.de/checkout
- **Kredit-/EC-Karte** → snttrades.de/checkout

### 3. Erfolgs-Nachricht
- Wird automatisch gesendet, wenn die thank-you-2 Seite besucht wird
- Enthält Dashboard-Links und Abo-Kündigungsoptionen

## 🔧 Setup

### 1. Dependencies installieren:
```bash
npm install
```

### 2. Bot Token
Der Bot Token ist bereits im Code integriert:
`8306953306:AAEBzDdHEHC8ZWjQAz6RGO4jXm4DmJwOJgc`

### 3. Lokaler Bot starten:
```bash
npm run bot:dev
```

## 🌐 Vercel Setup (Production)

### 1. Zu Vercel deployen:
```bash
# Mit Vercel CLI
vercel --prod

# Oder über GitHub Integration
# Push zu main branch → automatisches Deployment
```

### 2. Webhook bei Telegram registrieren:
```bash
# setup-webhook.js bearbeiten:
# Ersetze 'deine-vercel-url.vercel.app' mit deiner echten URL

node setup-webhook.js
```

### 3. URL Beispiel:
```
https://snttrades.vercel.app/api/telegram/webhook
```

### 4. Webhook testen:
- Bot in Telegram finden
- `/start` eingeben
- Bot sollte antworten

## 🌐 Integration mit Website

### API Endpoint
- `/api/telegram/success` - Triggert die Erfolgs-Nachricht
- Wird von der thank-you-2 Seite automatisch aufgerufen

### URL Parameter
Um den Bot mit einem Kauf zu verknüpfen, füge den Parameter `telegram_user_id` zur Checkout-URL hinzu:
```
https://snttrades.de/checkout?telegram_user_id=123456789
```

## 📱 Bot Verwendung

### Für Kunden:
1. Bot im Telegram suchen: `@IhrBotName`
2. `/start` eingeben
3. Willkommensnachricht lesen
4. Auf Zahlungsbutton klicken
5. Auf Website bezahlen
6. Automatisch Erfolgs-Nachricht erhalten

### Bot Commands:
- `/start` - Startet den Willkommensprozess

## 🔒 Sicherheit

- User Sessions werden im Speicher verwaltet
- Doppelte Nachrichten werden verhindert
- Fehlerbehandlung für alle API-Calls

## 📊 Monitoring

Der Bot loggt alle wichtigen Ereignisse:
- Neue User
- Gesendete Nachrichten
- API-Fehler
- Zahlungsbestätigungen

## 🛠 Troubleshooting

### Bot antwortet nicht:
1. Prüfe ob der Bot läuft: `npm run bot:dev`
2. Prüfe Bot Token
3. Prüfe Netzwerkverbindung

### Telegram User ID nicht gefunden:
1. Prüfe URL Parameter: `?telegram_user_id=123456789`
2. Prüfe localStorage/sessionStorage im Browser
3. Prüfe thank-you-2 Seite Logs

### Erfolgs-Nachricht wird nicht gesendet:
1. Prüfe ob thank-you-2 Seite korrekt lädt
2. Prüfe Browser Console für Fehler
3. Prüfe API Endpoint `/api/telegram/success` 
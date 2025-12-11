# SNTTRADES Landingpage - Wissensbibliothek

**Erstellt:** 2024  
**Zweck:** Vollständige Dokumentation aller Seiten, Styling-Konzepte und Funktionalitäten für Redesign-Projekt

---

## 📋 Inhaltsverzeichnis

1. [Brand & Design System](#brand--design-system)
2. [Seitenübersicht](#seitenübersicht)
3. [Styling-Konzepte](#styling-konzepte)
4. [Komponenten-Architektur](#komponenten-architektur)
5. [Funktionalitäten](#funktionalitäten)
6. [Technologie-Stack](#technologie-stack)

---

## 🎨 Brand & Design System

### Primärfarbe
- **SNT_BLUE:** `#068CEF`
- Verwendet als Hauptakzentfarbe in allen Seiten
- Hover-Variante: `#0572c2`

### Sekundärfarben
- **Grün (Waitlist):** `rgba(16,185,129,0.18)` - `#10B981` / `#22C55E`
- **Gelb (Highlights):** `rgba(251, 191, 36, 1)` / `rgb(253, 227, 76)`
- **Schwarz:** `#000000` / `rgba(0,0,0,0.98)`
- **Weiß:** `#FFFFFF` / `rgba(255,255,255,0.95)`

### Design-Prinzipien
- **Glasmorphismus:** `backdropFilter: blur(16px-20px)` mit halbtransparenten Hintergründen
- **Gradient-Overlays:** Radial- und Linear-Gradienten für Tiefe
- **Glow-Effekte:** Box-Shadows mit Brand-Farben für Akzente
- **Border-Styles:** 1-3px Borders mit rgba-Farben für subtile Abgrenzungen

---

## 📄 Seitenübersicht

### 1. Landing Page (`app/(website)/page.jsx`)

**Zweck:** Hauptlandingpage mit Trust- und Sales-Elementen

**Struktur:**
- Hero Section mit Video (`LandingHeroWithVideo`)
- Results Marquee (Community-Statistiken)
- Pricing Section (`SntPremiumPricing`)
- Review Marquee (Testimonials)
- Founder Section (Emre's Story)
- Course Overview Section
- "So funktioniert's" - 3 Phasen
- "Alles inklusive" - Feature Grid

**Styling:**
- Schwarzer Hintergrund mit blauen Glow-Effekten
- Glow-Trenner zwischen Sections (2px Gradient-Linien)
- Blaue Akzente (`#3b82f6` / `rgba(59, 130, 246, ...)`)
- Glasmorphismus-Cards mit Hover-Effekten

**Key Components:**
- `LandingHeroWithVideo`
- `ResultsMarquee`
- `SntPremiumPricing`
- `ReviewMarquee`
- `FounderSection`
- `CourseOverviewSection`

---

### 2. Waitlist Page (`app/(website)/waitlist/page.tsx`)

**Zweck:** Eintragung für Warteliste wenn Bootcamp geschlossen

**Struktur:**
- Hero Section (`SntHeroWaitlist`)
- Grüner Glow-Trenner
- Feature Cards (2x: Warteliste + E-Mail Benachrichtigung)
- Outseta Email-List Widget
- Trust-Badges (Shield, Lightning, Envelope)

**Styling:**
- Schwarzer Hintergrund (`#050709`)
- Grüne Akzente (`rgba(16,185,129,...)`)
- Grüne Glow-Effekte
- Glasmorphismus-Cards mit grünen Borders

**Funktionalitäten:**
- Outseta Widget Integration (`data-o-email-list="1"`)
- Dynamisches Laden des Outseta Scripts
- Redirect nach Success zu `/thank-you`

**Key Components:**
- `SntHeroWaitlist`
- Outseta Email-List Widget

---

### 3. Telegram Page (`app/(website)/telegram/page.jsx`)

**Zweck:** Externe Seite für TikTok (direkte Verlinkung blockiert)

**Struktur:**
- Minimal: Nur `TelegramHeroWithVideo` Component

**Funktionalität:**
- Einfache Landingpage mit Telegram-Link
- Für Social Media Traffic optimiert

**Key Components:**
- `TelegramHeroWithVideo`

---

### 4. Support Page (`app/(website)/support/page.tsx`)

**Zweck:** FAQ, Support-Tickets, Kontaktmöglichkeiten

**Struktur:**
- Hero Section mit Lifebuoy Icon
- Hilfe-Kategorien Grid (5 Kategorien)
- FAQ Section (5 Fragen)
- Support-Ticket System (Outseta Embed)
- Alternative Kontaktmöglichkeiten (E-Mail, Community)

**Styling:**
- Schwarzer Hintergrund mit blauen Gradients
- Blaue Akzente (`#068CEF`)
- Glasmorphismus-Cards
- Hover-Effekte auf Kategorien

**Funktionalitäten:**
- Outseta Support Widget (`Support` Component)
- Scroll-to-Ticket Funktion
- Kategorien mit Click-Handlers

**Key Components:**
- `Support` (Outseta Embed)
- Custom FAQ Accordion

**Kategorien:**
1. Ausbildung & Kurse
2. Technischer Support
3. Community & Networking
4. Zahlung & Abrechnung
5. Sicherheit & Datenschutz

---

### 5. Register Page (`app/(website)/register/page.jsx`)

**Zweck:** Landingpage für Free-Kurs

**Struktur:**
- Hero Section (`SntHero`)
- Vimeo Player Section (BrandedVimeoPlayer)
- Community Stats Element
- Problem/Solution Section
- Skills Section
- FREE BONUS Banner
- Registration Modal

**Styling:**
- Weißer Hintergrund mit Gradient-Overlays
- Blau-Rot Gradient (`rgba(6, 140, 239, 0.2)` → `rgba(255, 0, 0, 0.2)`)
- Blaue und rote Akzente
- Glasmorphismus-Cards

**Funktionalitäten:**
- E-Mail-Erfassung via Input-Listener
- Outseta Widget Integration
- Redirect-Interception zu `/thank-you-3`
- Registration Modal mit Plan UID
- Telegram User ID Tracking

**Key Components:**
- `SntHero`
- `BrandedVimeoPlayer`
- `RegistrationModal`

**E-Mail-Erfassung:**
- Event-Listener auf Document-Level
- Speicherung in `localStorage` als `sntRegistrationEmail`
- Extraktion aus Outseta Widget Events

---

### 6. Checkout Pages (`app/(website)/checkout/`)

#### 6.1 Checkout Landing (`page.tsx` / `page.jsx`)

**Zweck:** Plan-Auswahl Landingpage

**Struktur:**
- SNTTRADES Header
- `SntPremiumPricing` Component

**Styling:**
- Weißer Hintergrund
- Minimalistisches Design

---

#### 6.2 Monthly Checkout (`monthly/page.tsx`)

**Zweck:** Monatlicher Abo-Checkout

**Struktur:**
- Header mit SNTTRADES Branding
- Mobile: Preisbox über Checkout
- Desktop: 2-Spalten Layout
  - Links: Checkout-Widget
  - Rechts: Preisbox + Feature-Liste

**Styling:**
- Schwarzer Header
- Weißer Hintergrund
- Blaue Akzente (`#068CEF`)
- Preisbox mit blauem Border

**Funktionalitäten:**
- PayPal Subscription Integration
- Outseta Auth Widget (`data-o-auth="1"`)
- Telegram User ID Tracking
- Success Handler mit Redirect zu `/thank-you-3`
- Dynamische Preis-Formatierung

**Zahlungsmethoden:**
- PayPal (Subscription)
- Kreditkarte (via Outseta)
- Debitkarte (via Outseta)
- Google Pay (via Outseta)
- Apple Pay (via Outseta)

**Features-Liste:**
- Kompletter Videokurs
- Live Mentoring calls
- Exklusive Community
- Tradingsoftwares und Tools
- Jederzeit kündbar

---

#### 6.3 Lifetime Checkout (`lifetime/page.tsx`)

**Zweck:** Einmalzahlung Lifetime-Checkout

**Struktur:**
- Identisch zu Monthly, aber:
  - Lifetime-spezifische Texte
  - PayPal Hosted Buttons (nicht Subscription)
  - "Lebenslange Updates" Feature

**Funktionalitäten:**
- PayPal Hosted Buttons Integration
- Outseta Auth Widget
- Telegram User ID Tracking
- Success Handler

**Unterschiede zu Monthly:**
- PayPal Hosted Buttons statt Subscription
- "Lebenslanger Zugang" statt "Jederzeit kündbar"
- Zusätzliches Feature: "Lebenslange Updates"

---

### 7. Legal Pages (`app/(website)/legal/`)

**Struktur:** Alle Legal-Seiten folgen demselben Pattern

**Seiten:**
- `terms-and-conditions/page.tsx` - AGB
- `privacy-policy/page.tsx` - Datenschutzerklärung
- `cookie-policy/` - Cookie-Richtlinie
- `disclaimer/` - Haftungsausschluss
- `eula/` - End User License Agreement
- `impressum/` - Impressum
- `rueckgabe/` - Rückgaberecht

**Styling:**
- `Section` Component mit Standard-Padding
- `Prose` Component für Markdown-Rendering
- Einheitliches Layout

**Pattern:**
```tsx
<Section>
  <Prose mx="auto" size="lg" mt="28">
    <Markdown>{content}</Markdown>
  </Prose>
</Section>
```

---

## 🎨 Styling-Konzepte

### Layout-Komponenten

#### Section Component
```tsx
<Section 
  header={boolean}  // Top-Padding für Navbar
  size="sm" | "md" | "lg"  // Padding-Größe
  bg={string}
  // ... weitere BoxProps
/>
```

**Padding-System:**
- `sm`: base: 6, md: 8
- `md`: base: 12, md: 16
- `lg`: base: 16, md: 24

**Header-Padding:**
- `sm`: base: 112px, md: 120px
- `md`: base: 136px, md: 152px
- `lg`: base: 152px, md: 184px

---

### Glasmorphismus Pattern

**Standard-Card:**
```tsx
<Box
  bg="rgba(10, 14, 10, 0.8)"  // Halbtransparenter Hintergrund
  backdropFilter="blur(20px)"  // Blur-Effekt
  borderRadius="xl"
  border="2px solid rgba(59, 130, 246, 0.3)"  // Subtiler Border
  boxShadow="0 20px 60px 0 rgba(59, 130, 246, 0.2)"  // Glow-Effekt
  _hover={{
    borderColor: "rgba(59, 130, 246, 0.5)",
    boxShadow: "0 25px 80px 0 rgba(59, 130, 246, 0.3)"
  }}
/>
```

---

### Glow-Trenner Pattern

**Standard-Glow-Trenner:**
```tsx
<Box 
  w="100%" 
  h="2px" 
  background="linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.6), transparent)" 
  boxShadow="0 0 20px rgba(59, 130, 246, 0.4)"
/>
```

**Grüner Variante (Waitlist):**
```tsx
<Box
  h={{ base: 10, md: 12 }}
  position="relative"
  overflow="hidden"
>
  <Box
    position="absolute"
    // ... radial-gradient mit grünen Farben
    filter="blur(14px)"
  />
  <Box h="1px" w="100%" bg="linear-gradient(90deg, transparent, rgba(16,185,129,0.6), transparent)" />
</Box>
```

---

### Gradient-Overlays

**Radial-Gradient Pattern:**
```tsx
_before={{
  content: '""',
  position: "absolute",
  inset: 0,
  backgroundImage: "radial-gradient(at 50% 0%, rgba(59, 130, 246, 0.15) 0px, transparent 50%)",
  pointerEvents: "none"
}}
```

**Linear-Gradient Pattern:**
```tsx
background="linear-gradient(135deg, rgba(0, 0, 0, 0.98), rgba(5, 10, 20, 0.95))"
```

---

### Highlight-Text Pattern

**Gradient-Highlight:**
```tsx
<Box
  as="span"
  background="linear-gradient(90deg, rgba(59, 130, 246, 0.3), transparent 95%)"
  color="#3b82f6"
  px={3}
  py={1}
  borderRadius="md"
  fontWeight="bold"
  display="inline-block"
  border="1px solid rgba(59, 130, 246, 0.4)"
  boxShadow="0 0 20px rgba(59, 130, 246, 0.3)"
  textShadow="0 0 15px rgba(59, 130, 246, 0.6)"
>
  Text
</Box>
```

---

### Icon-Container Pattern

**Standard Icon-Box:**
```tsx
<Box
  p={3}
  borderRadius="full"
  bg="rgba(6, 140, 239, 0.15)"
  border="1px solid rgba(6, 140, 239, 0.3)"
  boxShadow="0 4px 12px rgba(6, 140, 239, 0.2)"
>
  <Icon as={IconComponent} boxSize={8} color={SNT_BLUE} />
</Box>
```

---

## 🧩 Komponenten-Architektur

### Hero Components

#### `LandingHeroWithVideo`
- Schwarzer Hintergrund
- Video-Integration
- CTA-Button zu Pricing
- Blaue Akzente

#### `SntHero`
- Weißer Hintergrund mit Gradient
- Gelbe Highlights
- CTA zu Registration Modal
- Für Free-Kurs optimiert

#### `SntHeroWaitlist`
- Schwarzer Hintergrund
- Grüne Akzente
- Wartelisten-Fokus

#### `TelegramHeroWithVideo`
- Minimalistisch
- Telegram-Link Integration

---

### UI Components

#### `SntPremiumPricing`
**Funktionalität:**
- Toggle zwischen Monthly/Lifetime
- Modal bei Wechsel von Lifetime zu Monthly
- Preis-Formatierung
- Router-Navigation zu Checkout
- Discount-System Integration

**Features:**
- Animierte Plan-Cards
- "SNTTRADES-EMPFEHLUNG" Badge bei Lifetime
- Feature-Liste
- Info-Box mit Wechsel-Text

---

#### `ReviewMarquee`
- Infinite Scroll Animation
- Review-Cards mit Hover-Details
- Dialog für vollständige Reviews
- Pause bei Hover

---

#### `ResultsMarquee`
- Community-Statistiken
- Animierte Zahlen
- Trust-Elemente

---

#### `FounderSection`
- Emre's Story
- Checklist mit Qualifikationen
- "3 Jahre später" Highlight-Box
- Icons für Achievements

---

#### `CourseOverviewSection`
- Kurs-Module Übersicht
- Strukturierte Darstellung

---

#### `BrandedVimeoPlayer`
- Vimeo Video Integration
- Branded Frame
- Community Stats unter Video

---

#### `RegistrationModal`
- Outseta Widget Integration
- Plan UID Konfiguration
- Modal-Overlay

---

### Layout Components

#### `Section`
- Standard-Section Wrapper
- Responsive Padding
- Header-Option für Navbar-Offset

#### `Navbar`
- Fixed Position
- Schwarzer Hintergrund
- Platform Login Link
- Mobile Drawer

---

## ⚙️ Funktionalitäten

### Outseta Integration

**Widget-Typen:**
1. **Email-List Widget** (`data-o-email-list="1"`)
   - Verwendet in: Waitlist Page
   - Fields: Email, FirstName, LastName

2. **Auth Widget** (`data-o-auth="1"`)
   - Verwendet in: Checkout Pages
   - Modes: `register`, `embed`
   - Plan UID Konfiguration

3. **Support Widget**
   - Verwendet in: Support Page
   - Ticket-System

**Script-Loading:**
```tsx
useEffect(() => {
  const script = document.createElement("script");
  script.src = "https://cdn.outseta.com/assets/build/js/widget.js";
  script.async = true;
  script.onload = () => {
    if (window.Outseta) {
      window.Outseta.init();
    }
  };
  document.head.appendChild(script);
}, []);
```

---

### PayPal Integration

**Monthly (Subscription):**
```tsx
window.paypal.Buttons({
  createSubscription: function(data, actions) {
    return actions.subscription.create({
      plan_id: pricing.paypal.planId,
      custom_id: customId
    });
  },
  onApprove: function(data) {
    // Redirect zu /thank-you-3
  }
}).render('#container');
```

**Lifetime (Hosted Buttons):**
```tsx
window.paypal.HostedButtons({
  hostedButtonId: pricing.paypal.hostedButtonId,
  onApprove: function(data) {
    // Redirect zu /thank-you-3
  }
}).render('#container');
```

---

### E-Mail-Erfassung System

**Strategie:**
1. Input-Event-Listener auf Document-Level
2. Speicherung in `localStorage` als `sntRegistrationEmail`
3. Extraktion aus Outseta Events
4. Redirect mit Email als Query-Parameter

**Implementation:**
```tsx
const captureEmailOnInput = () => {
  const handleEmailInput = (e) => {
    const target = e.target;
    if (target && (target.type === 'email' || target.name === 'Person.Email')) {
      const email = target.value?.trim();
      if (email && email.includes('@')) {
        localStorage.setItem('sntRegistrationEmail', email);
      }
    }
  };
  document.addEventListener('input', handleEmailInput, true);
  return () => document.removeEventListener('input', handleEmailInput, true);
};
```

---

### Redirect-Interception

**Zweck:** Verhindern von Outseta Default-Redirects

**Methoden:**
1. History API Override (`pushState`, `replaceState`)
2. URL-Polling
3. Event-Listener für Outseta Success Events

**Implementation:**
```tsx
const originalPushState = history.pushState;
history.pushState = function (...args) {
  const url = args[2];
  if (url && url.includes('/thank-you') && !url.includes('/thank-you-3')) {
    const email = localStorage.getItem('sntRegistrationEmail');
    args[2] = email ? `/thank-you-3?email=${encodeURIComponent(email)}` : '/thank-you-3';
  }
  return originalPushState.apply(history, args);
};
```

---

### Telegram User ID Tracking

**Zweck:** Tracking von Telegram-Traffic

**Implementation:**
```tsx
const urlParams = new URLSearchParams(window.location.search);
const telegramUserId = urlParams.get('telegram_user_id');
if (telegramUserId) {
  localStorage.setItem('telegram_user_id', telegramUserId);
  sessionStorage.setItem('telegram_user_id', telegramUserId);
}
```

**Verwendung:**
- Wird zu Redirect-URLs hinzugefügt
- In PayPal Custom IDs verwendet

---

### Pricing System

**Konfiguration:** `@/config/pricing-config`

**Features:**
- Discount-System (`isDiscountActive()`)
- Standard & Discount Preise
- PayPal Plan IDs
- Outseta Plan UIDs

**Formatierung:**
```tsx
const formatPrice = (price: number) => {
  return price % 1 === 0 ? `${price}€` : `${price.toFixed(2).replace('.', ',')}€`;
};
```

---

## 🛠️ Technologie-Stack

### Framework & Libraries
- **Next.js** (App Router)
- **React** (Client Components)
- **TypeScript** / **JavaScript** (gemischt)
- **Chakra UI 3.0** (Component Library)
- **Phosphor Icons** (Icon Library)

### Third-Party Services
- **Outseta** (Auth, Payments, Support)
- **PayPal** (Payment Processing)
- **Vimeo** (Video Hosting)

### Styling
- **Emotion** (CSS-in-JS)
- **Chakra UI Theme System**
- **Custom CSS** (für Overrides)

### Utilities
- **react-markdown** (Legal Pages)
- **vanilla-cookieconsent** (Cookie Banner)

---

## 📊 Responsive Breakpoints

**Chakra UI Standard:**
- `base`: Mobile (< 768px)
- `md`: Tablet (≥ 768px)
- `lg`: Desktop (≥ 1024px)
- `xl`: Large Desktop (≥ 1280px)

**Verwendung:**
```tsx
fontSize={{ base: "sm", md: "lg" }}
display={{ base: "none", md: "block" }}
py={{ base: 4, md: 8 }}
```

---

## 🎯 User Flows

### Free-Kurs Flow
1. Landing Page → Register Page
2. Register Page → Registration Modal
3. Outseta Widget → `/thank-you-3`

### Premium Flow
1. Landing Page → Pricing Section
2. Pricing Toggle → Checkout Page
3. Checkout → PayPal / Outseta
4. Success → `/thank-you-3`

### Waitlist Flow
1. Waitlist Page → Email-List Widget
2. Success → `/thank-you`

---

## 🔍 Wichtige Patterns

### Animation Patterns
- **Keyframes** für Card-Transitions
- **Hover-Effekte** mit Transform & Box-Shadow
- **Marquee** für Infinite Scroll

### State Management
- **useState** für lokalen State
- **localStorage** für Persistenz
- **URL Params** für Tracking

### Error Handling
- **Try-Catch** für API-Calls
- **Fallback-Values** für fehlende Daten
- **Console-Logging** für Debugging

---

## 📝 Notizen für Redesign

### Aktuelle Probleme
1. **Gemischte Dateitypen:** `.jsx` und `.tsx` parallel
2. **Inkonsistente Farben:** Verschiedene Blau-Töne (`#068CEF`, `#3b82f6`)
3. **Komplexe Redirect-Logik:** Viele Interception-Layer
4. **Duplizierter Code:** Ähnliche Patterns in mehreren Dateien

### Verbesserungspotenzial
1. **Einheitliches Design System:** Konsistente Farben & Spacing
2. **Vereinfachte User Flows:** Klarere Navigation
3. **Code-Konsolidierung:** Wiederverwendbare Komponenten
4. **Type Safety:** Vollständige TypeScript-Migration

---

**Ende der Dokumentation**


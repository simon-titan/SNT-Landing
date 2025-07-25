import { Section } from "@/components/layout/section";
import { Prose } from "@/components/ui/prose";
import { generateMetadata } from "@/utils/metadata";
import Markdown from "react-markdown";

export const metadata = generateMetadata({
  title: "Datenschutzerklärung",
  description:
    "Erfahren Sie, wie SEITENNULL - FZCO Ihre persönlichen Daten erhebt, verwendet und schützt",
});

export default function PrivacyPolicy() {
  return (
    <Section>
      <Prose mx="auto" size="lg" mt="">
        <Markdown>
          {`
# Datenschutzerklärung - SEITENNULL - FZCO

**Gültigkeitsdatum:** ${new Date().toLocaleDateString('de-DE')}

## 1. Allgemeine Informationen

SEITENNULL - FZCO respektiert die Privatsphäre der Nutzer und verpflichtet sich, die persönlichen Daten der Teilnehmer zu schützen. Diese Datenschutzerklärung beschreibt, wie wir die von dir bereitgestellten personenbezogenen Daten erheben, verwenden, speichern und schützen.

## 2. Erhebung und Verwendung personenbezogener Daten

Wir erheben folgende personenbezogene Daten:
- Name
- E-Mail-Adresse

Diese Daten werden verwendet:
- Zur Kommunikation mit den Nutzern
- Zur Durchführung von Marketingmaßnahmen, einschließlich Newslettern und Werbeaktionen

**Rechtsgrundlage für die Datenverarbeitung ist:**
- Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)
- Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an Marketing)

## 3. Weitergabe personenbezogener Daten

Wir geben **keine personenbezogenen Daten an Dritte weiter**. Alle Daten bleiben innerhalb der unsere Plattform snttrades.de oder snt-elitetrades-platform.de-Plattform und werden ausschließlich für unsere eigenen Zwecke verwendet.

## 4. Speicherdauer

Es besteht **keine feste Löschfrist**. Die Daten werden so lange gespeichert, wie sie für die genannten Zwecke erforderlich sind. Du kannst jederzeit eine Löschung oder Änderung beantragen.

## 5. Rechte der Nutzer

Du hast das Recht auf:
- Auskunft
- Berichtigung
- Löschung deiner personenbezogenen Daten

**Kontakt:** seitennulltrades@gmail.com

## 6. Datensicherheit

Wir schützen deine Daten mit angemessenen technischen und organisatorischen Maßnahmen vor unbefugtem Zugriff, Verlust oder Missbrauch.

## 7. Verwendung von Cookies

Die Plattform unsere Plattform snttrades.de oder snt-elitetrades-platform.de kann Cookies oder Tracking-Technologien einsetzen. Bitte informiere dich direkt über die Datenschutzerklärung von unsere Plattform snttrades.de oder snt-elitetrades-platform.de: [https://whop.com/privacy](https://whop.com/privacy)

## 8. Datenübermittlung außerhalb der EU

Bitte beachte, dass **SEITENNULL - FZCO in den Vereinigten Arabischen Emiraten ansässig ist**. Eine Datenverarbeitung außerhalb der EU erfolgt nur im gesetzlich zulässigen Rahmen.

## 9. Änderungen dieser Erklärung

Wir behalten uns vor, diese Datenschutzerklärung jederzeit zu aktualisieren. Bitte prüfe regelmäßig diese Seite auf Änderungen.

---

**Zuletzt aktualisiert:** ${new Date().toLocaleDateString('de-DE')}
          `}
        </Markdown>
      </Prose>
    </Section>
  );
}

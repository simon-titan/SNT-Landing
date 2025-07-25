import { Section } from "@/components/layout/section";
import { Prose } from "@/components/ui/prose";
import { generateMetadata } from "@/utils/metadata";
import Markdown from "react-markdown";

export const metadata = generateMetadata({
  title: "Allgemeine Geschäftsbedingungen (AGB)",
  description:
    "Allgemeine Geschäftsbedingungen für die Nutzung des Mentorship-Programms von SEITENNULL - FZCO",
});

export default function TermsAndConditions() {
  return (
    <Section>
      <Prose mx="auto" size="lg" mt="28">
        <Markdown>
          {`
# Allgemeine Geschäftsbedingungen (AGB) - SEITENNULL - FZCO

**Gültigkeitsdatum:** ${new Date().toLocaleDateString('de-DE')}

Willkommen bei SEITENNULL - FZCO. Diese Allgemeinen Geschäftsbedingungen ("AGB") regeln die Nutzung unseres Mentorship-Programms. **Durch den Kauf eines Zugangs zu unserem Mentorship-Programm erklärst du dich mit diesen Bedingungen einverstanden.**

## 1. Zahlungen und Rückerstattungen

- Wir bieten sowohl **monatliche als auch einmalige Zahlungen** für unser Mentorship-Programm an.
- **Alle Zahlungen sind endgültig und nicht erstattungsfähig. Eine Rückerstattung ist nicht möglich.**
- Das Mentorship-Abonnement verlängert sich automatisch monatlich, es sei denn, der Teilnehmer kündigt rechtzeitig vor dem nächsten Abrechnungszeitraum.

## 2. Verpflichtungen und Verhalten der Teilnehmer

- Die Teilnehmer verpflichten sich, sich **respektvoll gegenüber anderen Mitgliedern** und dem Mentorship-Programm zu verhalten.
- Wir behalten uns das Recht vor, Teilnehmer, die sich unangemessen verhalten, **ohne Vorankündigung aus dem Programm zu entfernen**.
- Bei Verstoß gegen diese Regeln kann der Zugang **ohne Erstattung dauerhaft gesperrt werden**.

## 3. Haftungsausschluss

- **SEITENNULL - FZCO ist nicht verantwortlich für etwaige Verluste oder Fehlinvestitionen**, die durch die Teilnahme am Mentorship-Programm entstehen.
- Das Programm basiert auf den Erfahrungen des Mentors, und alle Inhalte sind als Anleitung zu verstehen. **Jeder Teilnehmer handelt auf eigenes Risiko.**

## 4. Laufzeit des Programms

- Es gibt **keine feste Laufzeit** für das Mentorship-Programm. Das Abonnement wird monatlich erneuert, es sei denn, der Teilnehmer kündigt das Abonnement vor Ablauf des aktuellen Monats.

## 5. Rechte an Materialien

- Alle Materialien, einschließlich Videos, PDFs und Kursinhalte, sind **ausschließlich für den persönlichen Gebrauch** des Teilnehmers bestimmt.
- **Es ist untersagt, diese Materialien zu speichern, weiterzugeben oder zu verbreiten.**
- Jeder Verstoß führt zur **sofortigen Sperrung des Zugangs ohne Rückerstattungsanspruch** und kann rechtliche Konsequenzen nach sich ziehen.

## 6. Kündigungsbedingungen

- Teilnehmer müssen ihr Abonnement **rechtzeitig vor dem Ende des Abrechnungsmonats kündigen**, um eine automatische Verlängerung und erneute Abrechnung zu vermeiden.
- Eine Kündigung muss **mindestens 24 Stunden vor dem nächsten Abrechnungsdatum** erfolgen.

## 7. Recht auf Verweigerung der Teilnahme

- SEITENNULL - FZCO behält sich das Recht vor, Teilnehmern **den Zugang zum Programm zu verweigern**, wenn diese sich respektlos oder unangemessen verhalten.

## 8. Gerichtsstand

- **Gerichtsstand für alle Streitigkeiten aus dem Vertragsverhältnis ist Dubai, Vereinigte Arabische Emirate**, sofern gesetzlich zulässig.

## Datenschutz und weitere rechtliche Hinweise

Weitere Details zum Datenschutz und zur Verarbeitung personenbezogener Daten findest du in unserer [Datenschutzerklärung](/legal/privacy-policy). Bitte lies diese aufmerksam durch.

## Kontakt

Bei Fragen zu diesen AGB kontaktiere uns unter: **seitennulltrades@gmail.com**

---

**Zuletzt aktualisiert:** ${new Date().toLocaleDateString('de-DE')}
          `}
        </Markdown>
      </Prose>
    </Section>
  );
}

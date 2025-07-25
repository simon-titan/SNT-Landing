import { Section } from "@/components/layout/section";
import { Prose } from "@/components/ui/prose";
import { generateMetadata } from "@/utils/metadata";
import Markdown from "react-markdown";

export const metadata = generateMetadata({
  title: "Rückgabe- und Rückerstattungsrichtlinie",
  description:
    "Informationen zu unseren Rückgabe- und Rückerstattungsbedingungen für digitale Produkte",
});

export default function Rueckgabe() {
  return (
    <Section>
      <Prose mx="auto" size="lg" mt="28">
        <Markdown>
          {`
# Rückgabebedingungen - SEITENNULL - FZCO

**Gültigkeitsdatum:** ${new Date().toLocaleDateString('de-DE')}

## 1. Rückerstattungen und Widerruf

Da es sich bei unseren Dienstleistungen um digitale Inhalte handelt, die nach dem Kauf sofort zur Verfügung gestellt werden, **verzichten Kunden mit dem Kauf ausdrücklich auf das gesetzliche 14-tägige Widerrufsrecht** gemäß § 356 Abs. 5 BGB für digitale Produkte.

Sobald der Kunde Zugang zu den Inhalten (wie z. B. Kursmaterialien, Coaching-Sessions, Discord-Community oder Videos) erhalten hat, **ist eine Rückerstattung ausgeschlossen**. Es ist dem Kunden nicht gestattet, das Mentorship-Programm nach dem ersten Zugriff zurückzugeben.

**Technische Probleme auf Nutzerseite** (z. B. fehlerhafte E-Mail-Adresse, Probleme beim Login oder Discord-Zugriff) **gelten nicht als Grund für eine Rückerstattung**.

## 2. Kündigung

Teilnehmer können ihr monatliches Abonnement jederzeit über die unsere Plattform snttrades.de oder snt-elitetrades-platform.de-Plattform kündigen. Die Kündigung muss spätestens vor Ende des laufenden Monats erfolgen, um eine erneute Abbuchung für den Folgemonat zu vermeiden.

### Anleitung zur Kündigung über unsere Plattform snttrades.de oder snt-elitetrades-platform.de:

1. Logge dich in dein unsere Plattform snttrades.de oder snt-elitetrades-platform.de-Konto ein.
2. Gehe zu deinem Dashboard und klicke auf den Abschnitt "Abonnements".
3. Wähle das SEITENNULL-Mentorship-Abonnement aus.
4. Klicke auf "Abonnement kündigen" und folge den Anweisungen zur Bestätigung.

## 3. Verstöße gegen Nutzungsbedingungen

Bei Verstößen gegen unsere Lizenzbedingungen, insbesondere bei der **Weitergabe von Inhalten oder Zugangsdaten**, wird der Zugang zum Mentorship-Programm **sofort und dauerhaft gesperrt**. Es besteht in diesem Fall **keinerlei Anspruch auf Rückerstattung oder Entschädigung**.

## 4. Sonderfälle und technische Probleme

Bei Problemen mit unserer Plattform oder dem Zugriff auf Inhalte, die nicht vom Nutzer selbst verursacht wurden, stehen wir für technischen Support zur Verfügung. Eine Rückerstattung aus diesen Gründen ist jedoch ausgeschlossen.

## Kontakt

Für Fragen zu den Rückgabebedingungen kontaktieren Sie uns:

**SEITENNULL – FZCO**  
E-Mail: seitennulltrades@gmail.com

---

**Zuletzt aktualisiert:** ${new Date().toLocaleDateString('de-DE')}
          `}
        </Markdown>
      </Prose>
    </Section>
  );
} 
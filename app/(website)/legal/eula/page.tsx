import { Section } from "@/components/layout/section";
import { Prose } from "@/components/ui/prose";
import { generateMetadata } from "@/utils/metadata";
import Markdown from "react-markdown";

export const metadata = generateMetadata({
  title: "EULA - Endbenutzer-Lizenzvertrag",
  description:
    "Endbenutzer-Lizenzvertrag für die Nutzung der digitalen Inhalte von SEITENNULL - FZCO",
});

export default function EULA() {
  return (
    <Section>
      <Prose mx="auto" size="lg" mt="28">
        <Markdown>
          {`
# Endbenutzer-Lizenzvertrag (EULA) - SEITENNULL - FZCO

**Gültigkeitsdatum:** ${new Date().toLocaleDateString('de-DE')}

## 1. Allgemeine Bestimmungen

Dieser Endbenutzer-Lizenzvertrag (EULA) ist ein rechtsverbindlicher Vertrag zwischen dir (dem "Nutzer") und SEITENNULL - FZCO ("wir", "uns" oder "unser"), der die Nutzung aller digitalen Inhalte, einschließlich Videos, PDFs, Kursmaterialien und anderer Ressourcen, regelt.

**Durch den Kauf und die Nutzung unseres Mentorship-Programms erklärst du dich mit diesen Bedingungen einverstanden.**

## 2. Lizenzgewährung und -dauer

- Wir gewähren dem Nutzer eine **nicht übertragbare, nicht exklusive Lizenz** zur Nutzung der Inhalte des Mentorship-Programms.
- Die Lizenz ist gültig, solange das Abonnement aktiv ist. Im Falle eines Lifetime-Zugangs bleibt die Lizenz dauerhaft bestehen, solange das Programm angeboten wird. **Es besteht kein Anspruch auf unbegrenzte Lebensdauer des Zugangs.**
- Die Lizenz erlischt automatisch bei Kündigung des Abonnements oder bei einem Verstoß gegen diese EULA.

## 3. Urheberrecht und geistiges Eigentum

- Alle Inhalte, einschließlich Videos, PDFs und Kursmaterialien, sind **urheberrechtlich geschützt und Eigentum von SEITENNULL - FZCO**.
- Die **Weitergabe, Vervielfältigung, der Verkauf oder das Teilen der Inhalte ist strengstens untersagt**.
- Verstöße führen zur **sofortigen Sperrung des Zugangs** zum Mentorship-Programm ohne Rückerstattung und können rechtliche Konsequenzen haben.

## 4. Nutzungseinschränkungen

Der Nutzer darf **NICHT**:
- Inhalte herunterladen, speichern, teilen oder öffentlich verbreiten, es sei denn, dies wurde ausdrücklich von SEITENNULL - FZCO schriftlich genehmigt.
- Inhalte ändern, zurückentwickeln, dekompilieren oder versuchen, den Quellcode zu extrahieren.
- Die Lizenz auf Dritte übertragen.

## 5. Haftungsausschluss

- **SEITENNULL - FZCO übernimmt keine Haftung für finanzielle Verluste**, die durch die Anwendung der vermittelten Strategien entstehen.
- Alle Inhalte basieren auf persönlichen Erfahrungen und dienen **ausschließlich zu Bildungszwecken**.
- **Die Nutzung erfolgt auf eigenes Risiko des Nutzers.**

## 6. Gerichtsstand

Dieser Vertrag unterliegt **den Gesetzen der Vereinigten Arabischen Emirate (VAE)**. Alle Streitigkeiten, die sich aus diesem Vertrag ergeben, werden vor den zuständigen Gerichten der VAE verhandelt.

## 7. Änderungen der EULA

Wir behalten uns das Recht vor, diese EULA jederzeit zu ändern. Änderungen werden durch die Veröffentlichung auf unserer Website bekannt gegeben. Die fortgesetzte Nutzung des Mentorship-Programms nach Änderungen gilt als Zustimmung zu den aktualisierten Bedingungen.

## 8. Kontakt

Bei Fragen zur EULA kontaktiere uns unter: **seitennulltrades@gmail.com**

---

**Zuletzt aktualisiert:** ${new Date().toLocaleDateString('de-DE')}
          `}
        </Markdown>
      </Prose>
    </Section>
  );
} 
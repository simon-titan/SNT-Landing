import { Section } from "@/components/layout/section";
import { Prose } from "@/components/ui/prose";
import { generateMetadata } from "@/utils/metadata";
import Markdown from "react-markdown";
export const metadata = generateMetadata({
    title: "Haftungsausschluss (Disclaimer)",
    description: "Haftungsausschluss für die Nutzung der Inhalte und Leistungen von SEITENNULL – FZCO.",
});
const disclaimerMarkdown = `
# Haftungsausschluss (Disclaimer) – SEITENNULL – FZCO

## Haftungsausschluss für SEITENNULL – FZCO
Die auf dieser Website angebotenen Inhalte und Leistungen der SEITENNULL – FZCO, mit Sitz in Dubai (Vereinigte Arabische Emirate), dienen ausschließlich Schulungs- und Ausbildungszwecken im Bereich Trading. Es handelt sich hierbei nicht um Finanz-, Anlage-, Steuer- oder Rechtsberatung gemäß den geltenden Vorschriften in Deutschland, Österreich, der Schweiz oder anderen Ländern.

## Keine Anlageberatung
SEITENNULL – FZCO ist kein lizenzierter Finanzdienstleister oder Anlageberater. Es erfolgt keine persönliche oder individualisierte Empfehlung zum Kauf oder Verkauf von Finanzinstrumenten. Alle Inhalte dienen ausschließlich der Wissensvermittlung. Teilnehmer sind allein verantwortlich für ihre Handelsentscheidungen.

## Risikoaufklärung
Der Handel mit Finanzinstrumenten wie Aktien, Futures, Indizes oder Devisen ist mit erheblichen finanziellen Risiken verbunden und kann zum vollständigen Verlust des eingesetzten Kapitals führen. Auch das Handeln mit sogenannten „funded accounts“ (prop firms) birgt Risiken. Nur Personen, die sich dieser Risiken bewusst sind und diese auch finanziell tragen können, sollten sich an solchen Aktivitäten beteiligen.

Frühere Handelsergebnisse, gezeigte Strategien oder Performancedaten stellen keine Garantie für zukünftige Ergebnisse dar.

SEITENNULL – FZCO verwendet teilweise simulierte oder von Drittanbietern finanzierte Konten (z. B. durch Prop Firms), deren Ergebnisse nicht mit tatsächlichen Livekonten gleichzusetzen sind.

## Kein Widerrufsrecht
Mit dem Kauf eines Produktes oder einer Dienstleistung (z. B. Kurs, Zugang zur Discord-Community, Mentorship, Videoplattform oder Live-Call) stimmt der Kunde ausdrücklich zu, dass die Leistung sofort erbracht wird. Damit erlischt gemäß § 356 Abs. 5 BGB (bzw. vergleichbaren Bestimmungen in Österreich und der Schweiz) das Widerrufsrecht, da es sich um digitale Inhalte mit sofortigem Zugriff handelt.

Eine Rückgabe, Stornierung oder Erstattung – auch teilweise – ist ausgeschlossen. Dies gilt insbesondere bei:
- Vergessener Kündigung von Abos
- „Nicht gefallen“-Begründungen
- Technischen Problemen auf Kundenseite

## Eigenverantwortung der Teilnehmer
Die Teilnahme am Mentorship, an Kursen oder Live-Calls erfolgt auf eigene Verantwortung. Es werden keinerlei Versprechungen, Garantien oder Zusicherungen in Bezug auf Gewinne, finanzielle Erfolge oder persönliche Weiterentwicklungen gemacht.

Gezeigte Trades und Setups stellen keine Aufforderung zum Nachmachen oder zur Ausführung dar, sondern dienen ausschließlich der Veranschaulichung. Jeder Teilnehmer entscheidet eigenverantwortlich, ob und wie er auf gezeigte Inhalte reagiert.

## Unerlaubte Weitergabe und Konsequenzen
Alle Inhalte sind urheberrechtlich geschützt. Die Weitergabe, Vervielfältigung, Veröffentlichung oder Verbreitung – egal ob vollständig oder teilweise – ist strengstens untersagt.

➤ Sobald festgestellt wird, dass ein Nutzer Inhalte (z. B. Videos, PDFs, Strategien, Zugangsdaten) an Dritte weitergibt oder öffentlich macht, wird der Zugang unverzüglich und dauerhaft gesperrt.
➤ Zudem verliert der Nutzer dauerhaft sämtliche Rechte auf Zugang, ohne Anspruch auf Erstattung oder Entschädigung.
➤ SEITENNULL – FZCO behält sich rechtliche Schritte ausdrücklich vor.

## Geltungsbereich
Die angebotenen Leistungen richten sich primär an Nutzer im deutschsprachigen Raum (Deutschland, Österreich, Schweiz), jedoch erfolgt die Dienstleistungserbringung durch SEITENNULL – FZCO mit Sitz in den Vereinigten Arabischen Emiraten. Es gilt ausschließlich das Recht der VAE, sofern nicht gesetzlich anders vorgeschrieben.

## Haftungsbeschränkung
SEITENNULL – FZCO übernimmt keine Haftung für finanzielle Verluste, Schäden, entgangene Gewinne oder sonstige Nachteile, die durch die Nutzung der Inhalte oder durch selbst getätigte Trades der Nutzer entstehen.

Auch wird keine Haftung übernommen für:
- Fehlerhafte oder missverstandene Inhalte
- Handlungen von Dritten (z. B. Discord-Mitglieder)
- Ausfälle oder Störungen der Plattformen
- Falsche Nutzung der Inhalte durch den Kunden

## Inhalte und Urheberrecht
Alle Inhalte (Texte, Videos, Strategien, Dokumente, Calls etc.) sind urheberrechtlich geschützt. Eine Weitergabe, Vervielfältigung, Veröffentlichung oder Verbreitung ist strengstens untersagt und wird rechtlich verfolgt. Der Zugriff auf Inhalte ist ausschließlich für zahlende Mitglieder erlaubt.

## Hinweis zur Nutzung der Plattformen
Der Zugriff auf die Inhalte erfolgt über externe Plattformen wie Discord und die Login-Website von SEITENNULL. Für etwaige Ausfälle oder technische Probleme auf diesen Plattformen übernimmt SEITENNULL – FZCO keine Haftung.

Mit dem Kauf und der Nutzung unserer Leistungen erklärst du dich mit diesem Disclaimer und allen zugehörigen Bedingungen einverstanden.

---

**Zuletzt aktualisiert:** ${new Date().toLocaleDateString('de-DE')}
`;
export default function DisclaimerPage() {
    return (<Section>
      <Prose mx="auto" size="lg" mt="28">
        <Markdown>{disclaimerMarkdown}</Markdown>
      </Prose>
    </Section>);
}

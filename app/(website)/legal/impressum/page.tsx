import { Section } from "@/components/layout/section";
import { Prose } from "@/components/ui/prose";
import { generateMetadata } from "@/utils/metadata";
import Markdown from "react-markdown";

export const metadata = generateMetadata({
  title: "Impressum",
  description:
    "Rechtliche Informationen und Angaben gemäß § 5 TMG über SNT-TRADES™",
});

export default function Impressum() {
  return (
    <Section>
      <Prose mx="auto" size="lg" mt="28">
        <Markdown>
          {`
# Impressum

Angaben gemäß § 5 TMG sowie Art. 3 Abs. 1 ECG (AT) und Art. 14 UWG (CH)

## Diensteanbieter

**SEITENNULL – FZCO**  
Free Zone Company mit Sitz in Dubai, Vereinigte Arabische Emirate

**Vertretungsberechtigte Personen:**  
Emre Kopal  
Ali Duhoky

## Kontaktdaten

**E-Mail:** seitennulltrades@gmail.com

**Websites:**  
https://snttrades.de  
https://snt-elitetrades-platform.de

## Umsatzsteuer-Identifikationsnummer

Nicht vorhanden (Unternehmen mit Sitz außerhalb der EU)

## Verbraucherstreitbeilegung

Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.

## Haftungsausschluss

### ⚠ Haftung für Inhalte

Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich.

Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich.

### ⚠ Haftung für Links

Unsere Angebote können Links zu externen Websites Dritter enthalten. Auf deren Inhalte haben wir keinen Einfluss. Deshalb übernehmen wir für diese fremden Inhalte auch keine Gewähr. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.

### 📌 Urheberrecht

Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung oder jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedarf der schriftlichen Zustimmung von SEITENNULL – FZCO. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.

## Datenschutz

Die Nutzung unserer Website ist in der Regel ohne Angabe personenbezogener Daten möglich. Soweit auf unseren Seiten personenbezogene Daten erhoben werden, erfolgt dies stets auf freiwilliger Basis. Weitere Informationen finden Sie in unserer [Datenschutzerklärung](/legal/privacy-policy).

## Trading-Hinweis

**RISIKOHINWEIS:** Trading mit Finanzinstrumenten ist mit hohen Risiken verbunden und kann zum Verlust des eingesetzten Kapitals führen. Vergangene Performances sind keine Garantie für zukünftige Ergebnisse. Investieren Sie nur Kapital, dessen Verlust Sie sich leisten können.

SEITENNULL – FZCO bietet Bildungsdienstleistungen im Bereich Trading an und ist kein lizenzierter Finanzdienstleister. Unsere Inhalte stellen keine Anlageberatung dar.

## 🌍 Rechtswahl

Es gilt ausschließlich das Recht der Vereinigten Arabischen Emirate (VAE), sofern dem keine zwingenden verbraucherrechtlichen Vorschriften im Wohnsitzstaat des Nutzers entgegenstehen.

## Streitbeilegung

Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: [https://ec.europa.eu/consumers/odr/](https://ec.europa.eu/consumers/odr/)

---

**Zuletzt aktualisiert:** ${new Date().toLocaleDateString('de-DE')}
          `}
        </Markdown>
      </Prose>
    </Section>
  );
} 
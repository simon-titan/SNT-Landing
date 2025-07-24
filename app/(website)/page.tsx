import {
  Heading,
  Stack,
  VStack,
  Text,
  Card,
  Icon,
  SimpleGrid,
  Box,
} from "@chakra-ui/react";

import { Button } from "@/components/ui/button";
import { Section } from "@/components/layout/section";
import { generateMetadata } from "@/utils/metadata";
import { Link } from "@/components/ui/link";
import {
  ArrowSquareOut,
  UserCircle,
  CreditCard,
  Palette,
  EnvelopeSimple,
  Lifebuoy,
  Cube,
  ArrowRight,
  WarningCircle,
} from "@phosphor-icons/react/dist/ssr";
import { BrandedVimeoPlayer } from "@/components/ui/BrandedVimeoPlayer";
import { ReviewMarquee } from "@/components/ui/ReviewMarquee";
import { FounderSection } from "@/components/ui/FounderSection";
import { CourseOverviewSection } from "@/components/ui/CourseOverviewSection";
import { StudentWinsSection } from "@/components/ui/StudentWinsSection";

export const metadata = generateMetadata({
  title: "Home",
  description:
    "Deserunt veniam voluptate aliqua consectetur laboris voluptate est labore qui commodo.",
});

export default async function Page() {
  return (
    <>
      <Section
        header
        size="lg"
        bg="bg.subtle"
        borderBottom="1px solid"
        borderColor="border"
        w="100vw"
        mx="unset"
        background="linear-gradient(135deg, #000 60%,rgb(20, 85, 138) 100%)"

      >
        <VStack gap="10">
          <Stack gap="4" textAlign="center" mx="auto">
            <Heading
              as="h1"
              textStyle={{ base: "2xl", md: "5xl" }}
              mx="auto"
              color="white"
              lineHeight="tighter"
            >
              Dein Weg zum{' '}
              <Box as="span"                 background="linear-gradient(90deg,rgb(102, 194, 255) 70%, rgba(102, 194, 255, 0.3) 100%)"
 color="gray.900" px={2} py={1} borderRadius="md" fontWeight="bold" display="inline-block">
                Pro-Trader
              </Box>
              .
            </Heading>
            <Text color="grey" textStyle="lg" mx="auto">
            Wir haben über <b>6+ Jahre Erfahrung</b>, um dir in einem klar aufgebauten, selbstbestimmten Kurs genau das zu zeigen, was im Trading wirklich zählt.
            <br />
           <b>Kein Rätselraten mehr – nur echte Resultate.</b>
            </Text>
          </Stack>
          <Stack align="center" direction={{ base: "column", md: "row" }} gap="3">
            <Button size="xl" colorScheme="blue">
              Jetzt kostenlos starten
            </Button>
          </Stack>
         <Stack direction="row" align="center" justify="center" mt={1}>
           <WarningCircle size={16} color="#A0AEC0" />
           <Text fontSize="xs" color="gray.400" textAlign="center">
             Handel beinhaltet Risiken, <Link href="#" color="gray.400" textDecoration="underline">lies unseren Disclaimer</Link>
           </Text>
         </Stack>
         {/* Responsive Wrapper für den Player */}
         <Box w={{ base: '100%', md: '700px' }} maxW="100vw" aspectRatio={16/9} minH={{ base: '220px', md: '360px' }} mx="auto" borderRadius="lg" overflow="hidden" boxShadow="lg">
           <BrandedVimeoPlayer videoId="1097900514" />
         </Box>
        </VStack>
      </Section>
      <ReviewMarquee />
      <FounderSection
        image="/static/founder1.jpg"
        name="Emre Kopal"
        subtitle="Lerne den Gründer kennen"
        description={`Hi, ich bin Emre Kopal 👋\n\nMeine Reise begann nach dem Abitur – ursprünglich wollte ich eine eigene Brand aufbauen. Doch als ich das enorme Potenzial im Trading erkannt habe, habe ich alles andere losgelassen und mich zu 100 % dem Trading gewidmet.\n\nDie ersten Jahre waren intensiv. Ich habe nicht nur die Märkte studiert, sondern auch mich selbst – mentale Stärke, Disziplin und Unternehmertum wurden zu Schlüsselkomponenten auf meinem Weg.\n\n---\n\nWenn du das Ganze ernst meinst und bereit bist, in dich selbst zu investieren – dann bist du hier genau richtig.\n\nHier findest du kein Bla-Bla, sondern echte Ergebnisse, echte Strategien und ein echtes Netzwerk.\n\n**Starte jetzt – dein Trading-Weg beginnt hier.**`}
        checklist={[
          '3 Jahre später...',
          'Vollzeit Daytrader, Scalper & Investor',
          'Mehrfach funded bei verschiedenen Propfirms mit mehreren tausenden $ von Auszahlungen',
          'Über 10.000 Follower auf Social Media',
          'Aufbau einer großen geschlossenen Community mit echten Gleichgesinnten',
          'Gemeinsam mit Ali über 1.000 Menschen im Trading ausgebildet',
          'Unsere Mission: anderen zeigen, wie sie strukturiert und professionell ihre eigene Trading-Reise starten können',
        ]}
        highlights={[]}
      />
      <FounderSection
        image="/static/founder2.jpg"
        name="Zweiter Founder"
        subtitle="Hi, I'm Alex Example 👋"
        description="Ich habe mit Craig gemeinsam die Trading-Community aufgebaut und bringe 10 Jahre Erfahrung aus der Finanzwelt mit. Mein Fokus liegt auf nachhaltigen Strategien und Community-Building."
        checklist={[
          '10 Jahre Erfahrung im Trading und Coaching.',
          'Mitgründer der Community mit Fokus auf nachhaltigen Erfolg.',
          'Über 1.000+ betreute Trader weltweit.',
          'Spezialist für Risikomanagement und Mindset.'
        ]}
        highlights={["as seen in: ", "Handelsblatt", "Finanzen.net"]}
        reverse
      />
      <CourseOverviewSection />
      <div id="winnings">
        <StudentWinsSection />
      </div>
      {/* Premium Produkte Section (aktualisiert) */}
      <Section size="lg" bg="bg" mt={{ base: 12, md: 24 }}>
        <Box width="100%" display="flex" justifyContent="center">
          <Box
            display="flex"
            flexDirection={{ base: "column", md: "row" }}
            width={{ base: "100%", md: "1200px" }}
            gap="0"
            alignItems="stretch"
            justifyContent="center"
          >
            {/* Linkes großes Element */}
            <Box
              flex={{ base: "unset", md: 2 }}
              bg="gray.900"
              color="white"
              borderRadius="2xl"
              p={{ base: 6, md: 12 }}
              minW={{ md: "650px" }}
              maxW={{ md: "750px" }}
              boxShadow="lg"
              textAlign="left"
              alignItems="flex-start"
              display="flex"
              flexDirection="column"
              mt={{ md: 0 }}
              mb={{ md: 0 }}
              zIndex={1}
            >
              {/* Bild */}
              <Box w="100%" h="180px" bg="gray.700" borderRadius="lg" mb={4} overflow="hidden" display="flex" alignItems="center" justifyContent="center">
                <img src="/assets/PB-1.png" alt="SNTTRADES Trading Ausbildung" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '0.5rem' }} />
              </Box>
              <Text fontWeight="bold" color="gray.400" fontSize="sm" mb={2}>SNTTRADES</Text>
              <Heading as="h2" size="lg" mb={2}>SNTTRADES Trading Ausbildung</Heading>
              <Text mb={4}>Lerne alles, was ich in über 6 Jahren Trading- und Investment-Erfahrung gesammelt habe – in einem strukturierten, selbstbestimmten Ausbildungsprozess von Anfänger bis Profi.</Text>
              <Text as="s" color="red.300" fontWeight="bold" fontSize="lg">1.397,00 €</Text>
              <Text fontSize="xs" color="gray.400" mb={4}>*Vorübergehendes Sonderangebot</Text>
              <ul style={{ listStyle: "disc", paddingLeft: 20, margin: 0, textAlign: "left", marginBottom: 24 }}>
                <li style={{ marginBottom: 8 }}><b>Erziele 200–1000 €+ Trading-Gewinne</b></li>
                <li style={{ marginBottom: 8 }}><b>Ortsunabhängiges Trading & Arbeiten</b></li>
                <li style={{ marginBottom: 8 }}><b>Max. 90 Minuten Aufwand pro Tag</b></li>
                <li style={{ marginBottom: 8 }}>Mehrere Einkommensströme aufbauen</li>
                <li style={{ marginBottom: 8 }}>Live-Mentorings & 25+ Stunden Videotraining</li>
              </ul>
              <Link href="/Produkte/SNTTRADES-AUSBILDUNG" style={{ width: '100%' }}>
                <Button size="lg" colorScheme="blue" w="100%" style={{ textAlign: "center" }}>Mehr zur Ausbildung</Button>
              </Link>
            </Box>

            {/* Rechtes kleineres Element */}
            <Box
              flex={{ base: "unset", md: 1 }}
              bg="white"
              color="gray.900"
              borderTopRightRadius="xl"
              borderBottomRightRadius="xl"
              p={{ base: 6, md: 12 }}
              minW={{ md: "500px" }}
              maxW={{ md: "600px" }}
              maxH={{ md: "650px" }}
              borderLeft="1px solid"
              borderColor="gray.200"
              boxShadow="lg"
              textAlign="left"
              alignItems="flex-start"
              display="flex"
              flexDirection="column"
              alignSelf="center"
            >
              {/* Bild */}
              <Box w="100%" h="180px" bg="gray.100" borderRadius="lg" mb={4} overflow="hidden" display="flex" alignItems="center" justifyContent="center">
                <img src="/assets/V4.png" alt="SNTTRADES Ressourcen Bibliothek" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '0.5rem' }} />
              </Box>
              <Text fontWeight="bold" color="gray.400" fontSize="sm" mb={2}>SNTTRADES</Text>
              <Heading as="h2" size="lg" mb={2}>SNTTRADES Ressourcen Bibliothek</Heading>
              <Text mb={4}>Sichere dir einen Einblick in unsere Trading-Ausbildung und Zugang zu leistungsstarken Tools & Software, einer kostenlosen Grundausbildung und weiteren exklusiven Inhalten.</Text>
              <ul style={{ listStyle: "disc", paddingLeft: 20, margin: 0, textAlign: "left", marginBottom: 24 }}>
                <li style={{ marginBottom: 8 }}><b>Automatische Gewinn-/Verlust-Berechnung</b></li>
                <li style={{ marginBottom: 8 }}>Live-Dashboards & Performance-Tracker</li>
                <li style={{ marginBottom: 8 }}>Trading- & Verhaltens-Analyse-Tools</li>
                <li style={{ marginBottom: 8 }}>Alle EliteTrades-Indikatoren & Custom-Tools</li>
              </ul>
              <Link href="/Produkte/SNT-Ressourcen-Bibliothek" style={{ width: '100%' }}>
                <Button size="lg" colorScheme="blue" w="100%" style={{ textAlign: "center" }}>🔥 Ressourcen Bibliothek sichern</Button>
              </Link>
            </Box>
          </Box>
        </Box>
      </Section>
      
    </>
  );
}

const features = [
  {
    icon: <UserCircle />,
    title: "Authentication",
    description: "Securly login in users and protect pages and elements",
  },
  {
    icon: <CreditCard />,
    title: "Payments",
    description:
      "Setup one-time, subscription or usage billing for individual or teams",
  },
  {
    icon: <Palette />,
    title: "Theming",
    description:
      "Customizable theme to quickly change the look and feel of your app",
  },
  {
    icon: <EnvelopeSimple />,
    title: "Email Marketing",
    description:
      "Automated emails, broadcasts and drip campaigns to nurture users and drive sales",
  },
  {
    icon: <Lifebuoy />,
    title: "Support Desk",
    description:
      "Build-in support ticket system to make customers smile and keep them engaged",
  },
  {
    icon: <Cube />,
    title: "Design System",
    description: "Component library by Chakra UI to build anything you want",
  },
];

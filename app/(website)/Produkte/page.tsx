import { Heading, Text, Box } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/layout/section";
import Link from "next/link";

export default function ProduktePage() {
  return (
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
            {/* Bild-Platzhalter */}
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
            {/* Bild-Platzhalter */}
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
  );
}

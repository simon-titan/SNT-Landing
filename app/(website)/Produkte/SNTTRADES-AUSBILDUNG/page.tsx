import { Box, Heading, Text, VStack, Button, Center } from "@chakra-ui/react";
import { FaRocket, FaCheckCircle } from "react-icons/fa";
import { generateMetadata } from "@/utils/metadata";

export const metadata = generateMetadata({
  title: "SNTTRADES Ausbildung",
  description: "Lerne den Kryptomarkt mit unserem bewährten Blueprint zu traden.",
});

export default function HeroSection() {
  return (
    <>
      <Box
        minH="100vh"
        w="full"
        background="linear-gradient(135deg, #000 60%,rgb(20, 85, 138) 100%)"
        display="flex"
        alignItems="center"
        justifyContent="center"
        px={{ base: 4, md: 0 }}
      >
        <VStack gap={{ base: 10, md: 16 }} w="full">
          <VStack gap={6} textAlign="center" maxW="6xl" mx="auto">
            <Heading
              as="h1"
              fontWeight="bold"
              fontSize={{ base: "2xl", md: "4xl" }}
              color="white"
              lineHeight="1.2"
            >
              Lerne, wie du erfolgreich im FUTURES-Markt tradest<br></br>{' '}
              <Box
                as="span"
                px={2}
                borderRadius="md"
                color="black"
                background="linear-gradient(90deg,rgb(102, 194, 255) 70%, rgba(102, 194, 255, 0.3) 100%)"
                style={{ WebkitBackgroundClip: 'padding-box', WebkitBoxDecorationBreak: 'clone' }}
              >
                mit unserer bewährten Trading Strategie.
              </Box>
            </Heading>
            <Text color="white" fontSize={{ base: "md", md: "lg" }} >
            Nach 6 Jahren voller Insights, Fehler und Fortschritte zeigen wir dir jetzt genau, was wirklich funktioniert. 
            </Text>
          </VStack>
          <Center>
            <Box
              w={{ base: "320px", md: "520px" }}
              minH={{ base: "180px", md: "260px" }}
              display="flex"
              alignItems="center"
              justifyContent="center"
              boxShadow="lg"
              borderRadius="lg"
              overflow="hidden"
              bg="transparent"
              p={0}
            >
              <img
                src="/assets/PB-1.png"
                alt="Produktbild"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </Box>
          </Center>
          <VStack gap={3}>
            <Button
              size="lg"
              colorScheme="blue"
              fontWeight="bold"
              px={8}
              py={0}
              fontSize="xl"
              boxShadow="md"
            >
              <FaRocket style={{ marginRight: 8 }} />
              JETZT STARTEN
            </Button>
            <Text color="whiteAlpha.700" fontSize="sm">
            Trading birgt Risiken – bitte Disclaimer lesen.
            </Text>
          </VStack>
        </VStack>
      </Box>

      {/* Level-Up Blueprint Section */}
      <Box w="full" bg="white" py={{ base: 10, md: 20 }}>
        <VStack gap={8} maxW="6xl" mx="auto" align="stretch">
          <Text textAlign="center" fontWeight="bold" color="red.400" fontSize="sm" mb={-2}>
          So funktionierts 
          </Text>
          <Heading textAlign="center" fontSize={{ base: "2xl", md: "4xl" }} fontWeight="bold">
          Bring dein Trading aufs{' '}
            <Box as="span" px={2} borderRadius="md" color="black" background="linear-gradient(90deg,rgb(102, 194, 255) 70%, rgba(102, 194, 255, 0.3) 100%)" style={{ WebkitBackgroundClip: 'padding-box', WebkitBoxDecorationBreak: 'clone' }}>
            nächste Level.
            </Box>
          </Heading>
          <VStack gap={8}>
            {/* Phase 1 */}
            <Box
              borderRadius="3xl"
              p="5px"
              bg="linear-gradient(90deg, #000, #2196f3)"
            >
              <Box
                display="flex"
                flexDir={{ base: "column", md: "row" }}
                alignItems="center"
                justifyContent="space-between"
                bg="white"
                borderRadius="3xl"
                p={6}
                boxShadow="sm"
                w="full"
                maxW="6xl"
              >
                <Box flex="1" textAlign={{ base: "center", md: "left" }}>
                  <Text color="blue.500" fontWeight="bold" fontSize="lg">PHASE 1</Text>
                  <Text fontWeight="bold" fontSize={{ base: "lg", md: "2xl" }} mt={2} mb={2}>
                  Umfassendes Video-Training auf Abruf
                  </Text>
                  <Text color="gray.600" fontSize="md" mb={4}>
                  Als Teilnehmer startest du mit unseren grundlegenden Prinzipien und entwickelst dich Schritt für Schritt bis hin zu fortgeschrittenen Strategien. Du erhältst Zugang zu allen wichtigen Tools, Videos und entdeckst unsere bewährte Formel – alles in deinem eigenen Tempo.
                  </Text>
                  <Box display="flex" gap={4} flexWrap="wrap" justifyContent={{ base: "center", md: "flex-start" }}>
                    <Box display="flex" alignItems="center" gap={1}><FaCheckCircle color="#2196f3" />Fokus auf’s Wesentliche</Box>
                    <Box display="flex" alignItems="center" gap={1}><FaCheckCircle color="#2196f3" />Strategien wirklich verstehen</Box>
                    <Box display="flex" alignItems="center" gap={1}><FaCheckCircle color="#2196f3" />Lernen wann und wo du willst</Box>
                  </Box>
                </Box>
                <Box flexShrink={0} ml={{ md: 8 }} mt={{ base: 6, md: 0 }}>
                  <img src="/assets/phase1.png" alt="Phase 1" style={{ width: 180, borderRadius: 12, boxShadow: '0 4px 16px rgba(0,0,0,0.10)' }} />
                </Box>
              </Box>
            </Box>
            {/* Phase 2 */}
            <Box
              borderRadius="3xl"
              p="5px"
              bg="linear-gradient(90deg, #000, #2196f3)"
            >
              <Box
                display="flex"
                flexDir={{ base: "column", md: "row" }}
                alignItems="center"
                justifyContent="space-between"
                bg="white"
                borderRadius="3xl"
                p={6}
                boxShadow="sm"
                w="full"
                maxW="6xl"
              >
                <Box flex="1" textAlign={{ base: "center", md: "left" }}>
                  <Text color="blue.500" fontWeight="bold" fontSize="lg">PHASE 2</Text>
                  <Text fontWeight="bold" fontSize={{ base: "lg", md: "2xl" }} mt={2} mb={2}>
                  Live-Mentoring & Umsetzung
                  </Text>
                  <Text color="gray.600" fontSize="md" mb={4}>
                  Lerne direkt von uns als erfahrene Tradern, erhalte persönliche Anleitung und setze dein Wissen gezielt in die Praxis um.
                  </Text>
                  <Box display="flex" gap={4} flexWrap="wrap" justifyContent={{ base: "center", md: "flex-start" }}>
                    <Box display="flex" alignItems="center" gap={1}><FaCheckCircle color="#2196f3" />Lernen & direkt anwenden</Box>
                    <Box display="flex" alignItems="center" gap={1}><FaCheckCircle color="#2196f3" />Mehr Sicherheit im Trading</Box>
                    <Box display="flex" alignItems="center" gap={1}><FaCheckCircle color="#2196f3" />Praxisnah</Box>
                  </Box>
                </Box>
                <Box flexShrink={0} ml={{ md: 8 }} mt={{ base: 6, md: 0 }}>
                  <img src="/assets/phase2.png" alt="Phase 2" style={{ width: 180, borderRadius: 12, boxShadow: '0 4px 16px rgba(0,0,0,0.10)' }} />
                </Box>
              </Box>
            </Box>
            {/* Phase 3 */}
            <Box
              borderRadius="3xl"
              p="5px"
              bg="linear-gradient(90deg, #00e676, #2196f3)"
            >
              <Box
                display="flex"
                flexDir={{ base: "column", md: "row" }}
                alignItems="center"
                justifyContent="space-between"
                bg="white"
                borderRadius="3xl"
                p={6}
                boxShadow="sm"
                w="full"
                maxW="6xl"
              >
                <Box flex="1" textAlign={{ base: "center", md: "left" }}>
                  <Text color="green.500" fontWeight="bold" fontSize="lg">Phase 3</Text>
                  <Text fontWeight="bold" fontSize={{ base: "lg", md: "2xl" }} mt={2} mb={2}>
                  Trading meistern & echte Ergebnisse erzielen
                  </Text>
                  <Text color="gray.600" fontSize="md" mb={4}>
                  Jetzt verstehst du unsere Strategie in ihrer Tiefe und kannst sie selbstbewusst umsetzen – für mehr Freiheit und finanzielle Klarheit.
                  </Text>
                  <Box display="flex" gap={4} flexWrap="wrap" justifyContent={{ base: "center", md: "flex-start" }}>
                    <Box display="flex" alignItems="center" gap={1}><FaCheckCircle color="#00e676" />Konstanz & Kontrolle</Box>
                    <Box display="flex" alignItems="center" gap={1}><FaCheckCircle color="#00e676" />Mehr Freiheit durch Ergebnisse</Box>
                    <Box display="flex" alignItems="center" gap={1}><FaCheckCircle color="#00e676" />Klarer Weg zu deinem Ziel</Box>
                  </Box>
                </Box>
                <Box flexShrink={0} ml={{ md: 8 }} mt={{ base: 6, md: 0 }}>
                  <img src="/assets/phase3.png" alt="Phase 3" style={{ width: 180, borderRadius: 12, boxShadow: '0 4px 16px rgba(0,0,0,0.10)' }} />
                </Box>
              </Box>
            </Box>
          </VStack>
        </VStack>
      </Box>

      {/* SNT Vorteile Section - jetzt unter dem Blueprint */}
      <Box
        minH="60vh"
        w="full"
        background="linear-gradient(135deg, #000 60%,rgb(20, 85, 138) 100%)"
        display="flex"
        alignItems="center"
        justifyContent="center"
        px={{ base: 4, md: 0 }}
        py={{ base: 16, md: 24 }}
      >
        <VStack gap={{ base: 10, md: 16 }} w="full" maxW="6xl">
          <Heading
            as="h2"
            fontWeight="bold"
            fontSize={{ base: "2xl", md: "4xl" }}
            color="white"
            textAlign="center"
            lineHeight="1.2"
          >
            Wenn du der SNTTRADES Trading-Ausbildung beitrittst, erhältst du <Box as="span" color="#66c2ff">sofort und uneingeschränkt</Box> Zugriff auf:
          </Heading>
          <Box
            display="grid"
            gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }}
            gap={8}
            w="full"
          >
            {/* 1. SNT Kern Essenz */}
            <Box
              bg="rgba(0,0,0,0.85)"
              borderRadius="2xl"
              boxShadow="lg"
              p={6}
              color="white"
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={5}
              border="1px solid #2196f3"
            >
              <Box flexShrink={0} mb={4}>
                <img src="/assets/VORTEILE/V1.png" alt="SNT Kern Essenz" style={{ width: 160, borderRadius: 16, boxShadow: '0 4px 16px rgba(0,0,0,0.10)' }} />
              </Box>
              <Heading as="h3" fontSize="xl" mb={2} color="#66c2ff">
                1. SNT Kern Essenz
              </Heading>
              <Text>
                Strukturiertes Schritt-für-Schritt-Training. Du lernst alles – von den Grundlagen bis hin zu fortgeschrittenen Trading-Strategien – in einem nahezu sofort umsetzbaren System. Unser Videokurs, Quizze und PDF´s sorgen dafür, dass du bestens vorbereitet in deine Trading-Reise startest.
              </Text>
            </Box>
            {/* 2. LIVE Mentoring mit uns! */}
            <Box
              bg="rgba(0,0,0,0.85)"
              borderRadius="2xl"
              boxShadow="lg"
              p={6}
              color="white"
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={5}
              border="1px solid #2196f3"
            >
              <Box flexShrink={0} mb={4}>
                <img src="/assets/VORTEILE/V2.png" alt="LIVE Mentoring" style={{ width: 160, borderRadius: 16, boxShadow: '0 4px 16px rgba(0,0,0,0.10)' }} />
              </Box>
              <Heading as="h3" fontSize="xl" mb={2} color="#66c2ff">
                2. LIVE Mentoring mit uns!
              </Heading>
              <Text>
                Das Herzstück unserer Ausbildung: mehrmals im Monat erhältst du Zugang zu exklusiven Live-Sessions in kleinen Gruppen – direkt mit erfolgreichen Tradern, die genau dort waren, wo du jetzt stehst. Du bekommst individuelle Unterstützung, gezielte Antworten auf deine Fragen und praxisnahe Einblicke aus erster Hand.
              </Text>
              <Text fontSize="sm" color="#00e676" fontStyle="italic">
                *Alle Sessions werden aufgezeichnet, damit du jederzeit darauf zugreifen kannst*
              </Text>
            </Box>
            {/* 3. Unsere interaktive Community */}
            <Box
              bg="rgba(0,0,0,0.85)"
              borderRadius="2xl"
              boxShadow="lg"
              p={6}
              color="white"
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={5}
              border="1px solid #2196f3"
            >
              <Box flexShrink={0} mb={4}>
                <img src="/assets/VORTEILE/V3.png" alt="Community" style={{ width: 160, borderRadius: 16, boxShadow: '0 4px 16px rgba(0,0,0,0.10)' }} />
              </Box>
              <Heading as="h3" fontSize="xl" mb={2} color="#66c2ff">
                3. Unsere interaktive Community – dein Raum für echten Austausch
              </Heading>
              <Text>
                <b>Direkter Austausch mit Mentoren & Teilnehmern.</b> Lerne, teile Erfahrungen und wachse gemeinsam in einer starken Community, die dich wirklich weiterbringt.
              </Text>
            </Box>
            {/* 4. EIGENE TRADINGTOOLS & SOFTWARES */}
            <Box
              bg="rgba(0,0,0,0.85)"
              borderRadius="2xl"
              boxShadow="lg"
              p={6}
              color="white"
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={5}
              border="1px solid #2196f3"
            >
              <Box flexShrink={0} mb={4}>
                <img src="/assets/VORTEILE/V4.png" alt="Tradingtools & Softwares" style={{ width: 160, borderRadius: 16, boxShadow: '0 4px 16px rgba(0,0,0,0.10)' }} />
              </Box>
              <Heading as="h3" fontSize="xl" mb={2} color="#66c2ff">
                4. EIGENE TRADINGTOOLS & SOFTWARES
              </Heading>
              <Text fontWeight="bold" mb={1}>
                Als Bonus: Exklusive Profi-Trading-Tools, Tracker & individuelle Indikatoren
              </Text>
              <Text>
                Du erhältst nicht nur Wissen, sondern auch die exakt auf unsere Strategien abgestimmten Werkzeuge – damit du den Markt mit einem klaren Vorteil meistern kannst.
              </Text>
              <Text fontWeight="bold" color="#00e676">
                Maximiere deinen Trading-Vorteil!
              </Text>
            </Box>
          </Box>
        </VStack>
      </Box>

      {/* CTA Section */}
      <Box
        w="full"
        display="flex"
        justifyContent="center"
        alignItems="center"
        py={{ base: 10, md: 16 }}
        px={2}
      >
        <Box
          w="full"
          maxW="3xl"
          borderRadius="2xl"
          p={{ base: 6, md: 12 }}
          background="linear-gradient(120deg, #000 70%, #14558a 100%)"
          boxShadow="2xl"
          textAlign="center"
          position="relative"
        >
          <Text fontWeight="bold" color="orange.300" fontSize="lg" mb={2}>
            Spar dir teure Umwege
          </Text>
          <Heading as="h2" color="white" fontSize={{ base: "2xl", md: "3xl" }} fontWeight="extrabold" mb={4}>
            Lass Profis dein Wachstum beschleunigen <span role="img" aria-label="runter">👇</span>
          </Heading>
          <Button
            size="lg"
            colorScheme="blue"
            fontWeight="bold"
            fontSize="xl"
            px={10}
            py={6}
            mt={4}
            boxShadow="lg"
          >
            ZUGANG ZUR SNTTRADES AUSBILDUNG
          </Button>
        </Box>
      </Box>

      {/* FAQ Section */}
      <Box w="full" bg="#fafbfc" py={{ base: 12, md: 20 }} px={2}>
        <VStack maxW="3xl" mx="auto" gap={8} align="stretch">
          <Heading as="h2" fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" textAlign="center" mb={2}>
            Häufige Fragen – direkt beantwortet!
          </Heading>
          <Text color="gray.600" fontSize="lg" textAlign="center" mb={4}>
            Hier findest du die wichtigsten Antworten rund um die SNTTRADES Ausbildung.
          </Text>
          <Box>
            {/* FAQ Accordion */}
            <VStack gap={4} align="stretch">
              {/* Frage 1 */}
              <Box bg="white" borderRadius="xl" boxShadow="sm" p={0}>
                <details style={{ padding: 0 }}>
                  <summary style={{ fontWeight: 600, fontSize: '1.15rem', padding: '1.25rem', cursor: 'pointer', outline: 'none' }}>
                    Ist das auch für Anfänger geeignet?
                  </summary>
                  <Box px={6} pb={5} pt={1} color="gray.700" fontSize="md">
                    Ja – absolut. Die <b>SNTTRADES MASTERCLASS</b> ist so aufgebaut, dass auch Einsteiger ohne Vorkenntnisse strukturiert und verständlich an das Thema Trading herangeführt werden.<br/><br/>
                    Du startest mit den Grundlagen und wirst Schritt für Schritt bis hin zu fortgeschrittenen Strategien begleitet – inklusive praktischer Umsetzung, Live-Support und klarer Anleitung.
                  </Box>
                </details>
              </Box>
              {/* Frage 2 */}
              <Box bg="white" borderRadius="xl" boxShadow="sm" p={0}>
                <details style={{ padding: 0 }}>
                  <summary style={{ fontWeight: 600, fontSize: '1.15rem', padding: '1.25rem', cursor: 'pointer', outline: 'none' }}>
                    Brauche ich einen teuren Computer zum Traden?
                  </summary>
                  <Box px={6} pb={5} pt={1} color="gray.700" fontSize="md">
                    Nein. Für den Einstieg ins Trading reicht ein ganz normaler Laptop oder Computer mit stabiler Internetverbindung völlig aus. Du brauchst <b>keine teure Hardware oder spezielle Ausstattung</b> – wichtig ist nur, dass dein Gerät zuverlässig läuft und du konzentriert arbeiten kannst. Viele unserer Teilnehmer traden erfolgreich mit ganz gewöhnlicher Technik.
                  </Box>
                </details>
              </Box>
              {/* Frage 3 */}
              <Box bg="white" borderRadius="xl" boxShadow="sm" p={0}>
                <details style={{ padding: 0 }}>
                  <summary style={{ fontWeight: 600, fontSize: '1.15rem', padding: '1.25rem', cursor: 'pointer', outline: 'none' }}>
                    Brauche ich Startkapital, um zu beginnen?
                  </summary>
                  <Box px={6} pb={5} pt={1} color="gray.700" fontSize="md">
                    <b>Nein.</b> Am Anfang geht es nicht darum, sofort mit echtem Geld zu traden – sondern darum, das Handwerk <b>richtig zu lernen</b>, die Märkte zu verstehen und deine Strategie sic<strong>her zu beherrschen</strong>.<br/><br/>
                    Du lernst zuerst in einer risikofreien Umgebung (z. B. im Demokonto) und baust dir Schritt für Schritt die nötige Erfahrung auf, bevor echtes Kapital überhaupt Thema wird.
                  </Box>
                </details>
              </Box>
              {/* Frage 4 */}
              <Box bg="white" borderRadius="xl" boxShadow="sm" p={0}>
                <details style={{ padding: 0 }}>
                  <summary style={{ fontWeight: 600, fontSize: '1.15rem', padding: '1.25rem', cursor: 'pointer', outline: 'none' }}>
                    Warum SNTTRADES?
                  </summary>
                  <Box px={6} pb={5} pt={1} color="gray.700" fontSize="md">
                    Weil du bei uns n<strong>icht nur einen Kurs</strong>, sondern eine echte<strong> Community</strong> bekommst.<br/><br/>
                    Wir sind wie eine Familie – jeder unterstützt jeden, ganz egal auf welchem Level du gerade bist. Du bist umgeben von <b>Gleichgesinnten</b>, die dieselbe Vision teilen: besser werden, gemeinsam wachsen und langfristig erfolgreich traden. Bei SNTTRADES stehst du <b>niemals allein da</b> – wir gehen den Weg gemeinsam, Schritt für Schritt.
                  </Box>
                </details>
              </Box>
            </VStack>
          </Box>
          <Box pt={6} textAlign="center">
            <Button size="lg" colorScheme="blue" fontWeight="bold" fontSize="xl" px={10} py={6} boxShadow="lg">
              JETZT STARTEN 🚀
            </Button>
          </Box>
        </VStack>
      </Box>
    </>
  );
}

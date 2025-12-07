import { Heading, Stack, VStack, Text, Box, Accordion, } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/layout/section";
import { generateMetadata } from "@/utils/metadata";
import { Link } from "@/components/ui/link";
import { WarningCircle, CheckCircle, CaretDown, } from "@phosphor-icons/react/dist/ssr";
import { FaCheckCircle } from "react-icons/fa";
export const metadata = generateMetadata({
    title: "SNTTRADES Ausbildung",
    description: "LERNE ERFOLGREICH IM FUTURES-MARKT ZU TRADEN.",
});
export default function HeroSection() {
    return (<>
      <Section header size="lg" bg="bg.subtle" borderBottom="1px solid" borderColor="border" w="100vw" mx="unset" pb={{ base: "30px", md: "40px" }} background="radial-gradient(at 0% 100%,rgba(13, 112, 182, 0.4) 0px, transparent 50%),
        radial-gradient(at 100% 100%,rgba(148, 39, 238, 0.5) 0px, transparent 50%)">
        <VStack gap="4" maxW="900px" mx="auto">
          <Stack gap="2" textAlign="center" mx="auto">
            {/* SNTTRADES Trading Academy Badge */}
            <Box display="flex" alignItems="center" justifyContent="center" gap="2" mx="auto" mb="1">
              <CheckCircle size={20} color="#1E88E5" weight="fill"/>
              <Heading as="h1" fontSize={{ base: "md", md: "2xl" }} fontWeight="700" lineHeight="0.9" bg="linear-gradient(0deg,rgb(0, 0, 0) 0%,rgb(126, 126, 126) 100%)" bgClip="text" filter="drop-shadow(0 0 10px rgba(156, 163, 175, 0.3))">
                    SNTTRADES™
                </Heading>
            </Box>
            <Heading as="h1" textStyle={{ base: "4xl", md: "5xl" }} mx="auto" color="black" lineHeight="tighter" fontWeight="bold" maxW="800px">
              LERNE ERFOLGREICH IM{' '}
              <Box as="span" background="linear-gradient(90deg,rgb(246, 236, 92), transparent 95%)" color="black" px={2} py={1} borderRadius="md" fontWeight="bold" display="inline-block">
                FUTURES-MARKT
              </Box>{' '}
              ZU TRADEN.
            </Heading>
            
            {/* PB-1 Produktbild */}
            <Box w={{ base: "280px", md: "400px" }} mx="auto" mt="4" mb="4">
              <img src="/assets/PB-1.png" alt="SNTTRADES Trading Ausbildung" style={{
            width: '100%',
            height: 'auto',
            display: 'block'
        }}/>
            </Box>
            
            <Text color="black" textStyle="sm" mx="auto" maxW="700px">
              Nach <Text as="span" color="#1E88E5" fontWeight="bold">6+ Jahren voller Insights, Fehler und Fortschritte</Text> zeigen wir dir jetzt genau, was im Trading wirklich funktioniert. Mit unserer <Text as="span" color="#1E88E5" fontWeight="bold">bewährten Trading Strategie</Text> und strukturiertem Mentoring.<br />
            </Text>
          </Stack>
          <Stack align="center" direction={{ base: "column", md: "row" }} gap="3">
            <Link href="/checkout" style={{ width: '100%', maxWidth: 'fit-content' }}>
              <Button size="xl" fontWeight="bold" colorScheme="blue" bg="#1E88E5" _hover={{ bg: "#1565C0" }} borderRadius="md" px="8">
               ⚡ JETZT AUSBILDUNG STARTEN
              </Button>
            </Link>
          </Stack>
         <Stack direction="row" align="center" justify="center" mt={0}>
           <WarningCircle size={16} color="#A0AEC0"/>
           <Text fontSize="xs" color="gray.400" textAlign="center">
             Trading beinhaltet  Risiken. <Link href="/legal/disclaimer" color="gray.400" textDecoration="underline">Lies unseren Disclaimer!</Link>
           </Text>
         </Stack>
        </VStack>
      </Section>

      {/* Level-Up Blueprint Section */}
      <Box w="full" bg="white" py={{ base: 10, md: 20 }} px={{ base: 4, md: 8 }}>
        <VStack gap={8} maxW="6xl" mx="auto" align="stretch">
          <Text textAlign="center" fontWeight="bold" color="#EAB308" fontSize="sm" mb={-2}>
          So funktionierts 
          </Text>
          <Heading textAlign="center" fontSize={{ base: "2xl", md: "4xl" }} fontWeight="bold">
          Bring dein Trading aufs{' '}
            <Box as="span" background="linear-gradient(90deg,rgb(246, 236, 92), transparent 105%)" color="black" px={2} py={1} borderRadius="md" fontWeight="bold" display="inline-block">
            nächste Level.
            </Box>
          </Heading>
          <VStack gap={8}>
            {/* Phase 1 */}
            <Box borderRadius="lg" p="7px" bg="linear-gradient(90deg, #000, #2196f3)">
              <Box display="flex" flexDir={{ base: "column", md: "row" }} alignItems="center" justifyContent="space-between" bg="white" borderRadius="sm" p={6} boxShadow="sm" w="full" maxW="6xl">
                <Box flex="1" textAlign="left">
                  <Text color="blue.500" fontWeight="bold" fontSize="lg">PHASE 1</Text>
                  <Text fontWeight="bold" fontSize={{ base: "lg", md: "2xl" }} mt={2} mb={2}>
                  Umfassendes Video-Training auf Abruf
                  </Text>
                  <Text color="gray.600" fontSize="sm" mb={4}>
                  Als Teilnehmer startest du mit unseren grundlegenden Prinzipien und entwickelst dich Schritt für Schritt bis hin zu fortgeschrittenen Strategien. Du erhältst Zugang zu allen wichtigen Tools, Videos und entdeckst unsere bewährte Formel – alles in deinem eigenen Tempo.
                  </Text>
                  <Box display="flex" gap={2} flexWrap="wrap" justifyContent="flex-start">
                    <Box display="flex" alignItems="center" gap={1} fontSize="sm" minW="45%"><FaCheckCircle color="#2196f3" size={14}/>Fokus auf's Wesentliche</Box>
                    <Box display="flex" alignItems="center" gap={1} fontSize="sm" minW="45%"><FaCheckCircle color="#2196f3" size={14}/>Strategien wirklich verstehen</Box>
                    <Box display="flex" alignItems="center" gap={1} fontSize="sm" minW="45%"><FaCheckCircle color="#2196f3" size={14}/>Lernen wann und wo du willst</Box>
                  </Box>
                </Box>
                <Box flexShrink={0} ml={{ md: 8 }} mt={{ base: 6, md: 0 }}>
                  <img src="/productpage-paid/Phase1.png" alt="Phase 1" style={{ width: 240, height: 'auto', display: 'block' }}/>
                </Box>
              </Box>
            </Box>
            {/* Phase 2 */}
            <Box borderRadius="lg" p="7px" bg="linear-gradient(90deg, #000, #2196f3)">
              <Box display="flex" flexDir={{ base: "column", md: "row" }} alignItems="center" justifyContent="space-between" bg="white" borderRadius="sm" p={6} boxShadow="sm" w="full" maxW="6xl">
                <Box flex="1" textAlign="left">
                  <Text color="blue.500" fontWeight="bold" fontSize="lg">PHASE 2</Text>
                  <Text fontWeight="bold" fontSize={{ base: "lg", md: "2xl" }} mt={2} mb={2}>
                  Live-Mentoring & Umsetzung
                  </Text>
                  <Text color="gray.600" fontSize="sm" mb={4}>
                  Lerne direkt von uns als erfahrene Tradern, erhalte persönliche Anleitung und setze dein Wissen gezielt in die Praxis um.
                  </Text>
                  <Box display="flex" gap={2} flexWrap="wrap" justifyContent="flex-start">
                    <Box display="flex" alignItems="center" gap={1} fontSize="sm" minW="45%"><FaCheckCircle color="#2196f3" size={14}/>Lernen & direkt anwenden</Box>
                    <Box display="flex" alignItems="center" gap={1} fontSize="sm" minW="45%"><FaCheckCircle color="#2196f3" size={14}/>Mehr Sicherheit im Trading</Box>
                    <Box display="flex" alignItems="center" gap={1} fontSize="sm" minW="45%"><FaCheckCircle color="#2196f3" size={14}/>Praxisnah</Box>
                  </Box>
                </Box>
                <Box flexShrink={0} ml={{ md: 8 }} mt={{ base: 6, md: 0 }}>
                  <img src="/productpage-paid/Phase2.png" alt="Phase 2" style={{ width: 240, height: 'auto', display: 'block' }}/>
                </Box>
              </Box>
            </Box>
            {/* Phase 3 */}
            <Box borderRadius="lg" p="7px" bg="linear-gradient(90deg, #00e676, #2196f3)">
              <Box display="flex" flexDir={{ base: "column", md: "row" }} alignItems="center" justifyContent="space-between" bg="white" borderRadius="sm" p={6} boxShadow="sm" w="full" maxW="6xl">
                <Box flex="1" textAlign="left">
                  <Text color="green.500" fontWeight="bold" fontSize="lg">Phase 3</Text>
                  <Text fontWeight="bold" fontSize={{ base: "lg", md: "2xl" }} mt={2} mb={2}>
                  Trading meistern & echte Ergebnisse erzielen
                  </Text>
                  <Text color="gray.600" fontSize="sm" mb={4}>
                  Jetzt verstehst du unsere Strategie in ihrer Tiefe und kannst sie selbstbewusst umsetzen – für mehr Freiheit und finanzielle Klarheit.
                  </Text>
                  <Box display="flex" gap={2} flexWrap="wrap" justifyContent="flex-start">
                    <Box display="flex" alignItems="center" gap={1} fontSize="sm" minW="45%"><FaCheckCircle color="#00e676" size={14}/>Konstanz & Kontrolle</Box>
                    <Box display="flex" alignItems="center" gap={1} fontSize="sm" minW="45%"><FaCheckCircle color="#00e676" size={14}/>Mehr Freiheit durch Ergebnisse</Box>
                    <Box display="flex" alignItems="center" gap={1} fontSize="sm" minW="45%"><FaCheckCircle color="#00e676" size={14}/>Klarer Weg zu deinem Ziel</Box>
                  </Box>
                </Box>
                <Box flexShrink={0} ml={{ md: 8 }} mt={{ base: 6, md: 0 }}>
                  <img src="/productpage-paid/Phase3.png" alt="Phase 3" style={{ width: 240, height: 'auto', display: 'block' }}/>
                </Box>
              </Box>
            </Box>
          </VStack>
        </VStack>
      </Box>

      {/* SNT Vorteile Section - jetzt unter dem Blueprint */}
      <Box minH="60vh" w="full" background="linear-gradient(135deg, rgb(7, 23, 36) 60%,rgb(23, 89, 143) 100%)" display="flex" alignItems="center" justifyContent="center" px={{ base: 4, md: 0 }} py={{ base: 16, md: 24 }}>
        <VStack gap={{ base: 10, md: 16 }} w="full" maxW="6xl">
          <Heading as="h2" fontWeight="bold" fontSize={{ base: "2xl", md: "4xl" }} color="white" textAlign="center" lineHeight="1.2">
            Wenn du der SNTTRADES Trading-Ausbildung beitrittst, erhältst du <Box as="span" color="#66c2ff">sofort und uneingeschränkt</Box> Zugriff auf:
          </Heading>
          <Box display="grid" gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={8} w="full">
            {/* 1. SNT Kern Essenz */}
            <Box bg="rgba(255,255,255,0.1)" backdropFilter="blur(10px)" borderRadius="2xl" boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.37)" border="1px solid rgba(255, 255, 255, 0.18)" p={6} color="white" display="flex" flexDirection="column" alignItems="flex-start" gap={5}>
              <Box flexShrink={0} mb={4} borderRadius="20px" background="white">
                <Box borderRadius="16px" overflow="hidden" background="radial-gradient(at 0% 100%,rgba(13, 112, 182, 0.4) 0px, transparent 50%),radial-gradient(at 100% 100%,rgba(148, 39, 238, 0.5) 0px, transparent 50%)" p="2">
                  <img src="/assets/VORTEILE/V1.png" alt="SNT Kern Essenz" style={{ width: '100%', borderRadius: 12, display: 'block' }}/>
                </Box>
              </Box>
              <Heading as="h3" fontSize="xl" mb={2} color="#66c2ff">
                1. SNT Kern Essenz
              </Heading>
              <Text fontSize="sm">
                Strukturiertes Schritt-für-Schritt-Training. Du lernst alles – von den Grundlagen bis hin zu fortgeschrittenen Trading-Strategien – in einem nahezu sofort umsetzbaren System. Unser Videokurs, Quizze und PDF´s sorgen dafür, dass du bestens vorbereitet in deine Trading-Reise startest.
              </Text>
            </Box>
            {/* 2. LIVE Mentoring mit uns! */}
            <Box bg="rgba(255,255,255,0.1)" backdropFilter="blur(10px)" borderRadius="2xl" boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.37)" border="1px solid rgba(255, 255, 255, 0.18)" p={6} color="white" display="flex" flexDirection="column" alignItems="flex-start" gap={5}>
              <Box flexShrink={0} mb={4} borderRadius="20px" background="white">
                <Box borderRadius="16px" overflow="hidden" background="radial-gradient(at 0% 100%,rgba(13, 112, 182, 0.4) 0px, transparent 50%),radial-gradient(at 100% 100%,rgba(148, 39, 238, 0.5) 0px, transparent 50%)" p="2">
                  <img src="/assets/VORTEILE/V2.png" alt="LIVE Mentoring" style={{ width: '100%', borderRadius: 12, display: 'block' }}/>
                </Box>
              </Box>
              <Heading as="h3" fontSize="xl" mb={2} color="#66c2ff">
                2. LIVE Mentoring mit uns!
              </Heading>
              <Text fontSize="sm">
                Das Herzstück unserer Ausbildung: mehrmals im Monat erhältst du Zugang zu exklusiven Live-Sessions in kleinen Gruppen – direkt mit erfolgreichen Tradern, die genau dort waren, wo du jetzt stehst. Du bekommst individuelle Unterstützung, gezielte Antworten auf deine Fragen und praxisnahe Einblicke aus erster Hand.
              </Text>
              <Text fontSize="sm" color="#00e676" fontStyle="italic">
                *Alle Sessions werden aufgezeichnet, damit du jederzeit darauf zugreifen kannst*
              </Text>
            </Box>
            {/* 3. Unsere interaktive Community */}
            <Box bg="rgba(255,255,255,0.1)" backdropFilter="blur(10px)" borderRadius="2xl" boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.37)" border="1px solid rgba(255, 255, 255, 0.18)" p={6} color="white" display="flex" flexDirection="column" alignItems="flex-start" gap={5}>
              <Box flexShrink={0} mb={4} borderRadius="20px" background="white">
                <Box borderRadius="16px" overflow="hidden" background="radial-gradient(at 0% 100%,rgba(13, 112, 182, 0.4) 0px, transparent 50%),radial-gradient(at 100% 100%,rgba(148, 39, 238, 0.5) 0px, transparent 50%)" p="2">
                  <img src="/assets/VORTEILE/V3.png" alt="Community" style={{ width: '100%', borderRadius: 12, display: 'block' }}/>
                </Box>
              </Box>
              <Heading as="h3" fontSize="xl" mb={2} color="#66c2ff">
                3. Unsere interaktive Community – dein Raum für echten Austausch
              </Heading>
              <Text fontSize="sm">
                <b>Direkter Austausch mit Mentoren & Teilnehmern.</b> Lerne, teile Erfahrungen und wachse gemeinsam in einer starken Community, die dich wirklich weiterbringt.
              </Text>
            </Box>
            {/* 4. EIGENE TRADINGTOOLS & SOFTWARES */}
            <Box bg="rgba(255,255,255,0.1)" backdropFilter="blur(10px)" borderRadius="2xl" boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.37)" border="1px solid rgba(255, 255, 255, 0.18)" p={6} color="white" display="flex" flexDirection="column" alignItems="flex-start" gap={5}>
              <Box flexShrink={0} mb={4} borderRadius="20px" background="white" border="1px solid #2196f3">
                <Box borderRadius="16px" overflow="hidden" background="radial-gradient(at 0% 100%,rgba(13, 112, 182, 0.4) 0px, transparent 50%),radial-gradient(at 100% 100%,rgba(148, 39, 238, 0.5) 0px, transparent 50%)" p="2">
                  <img src="/assets/VORTEILE/V4.png" alt="Tradingtools & Softwares" style={{ width: '100%', borderRadius: 12, display: 'block' }}/>
                </Box>
              </Box>
              <Heading as="h3" fontSize="xl" mb={2} color="#66c2ff">
                4. EIGENE TRADINGTOOLS & SOFTWARES
              </Heading>
              <Text fontSize="sm" fontWeight="bold" mb={1}>
                Als Bonus: Exklusive Profi-Trading-Tools, Tracker & individuelle Indikatoren
              </Text>
              <Text fontSize="sm">
                Du erhältst nicht nur Wissen, sondern auch die exakt auf unsere Strategien abgestimmten Werkzeuge – damit du den Markt mit einem klaren Vorteil meistern kannst.
              </Text>
              <Text fontSize="sm" fontWeight="semibold" color="#00e676">
                *Maximiere deinen Trading-Vorteil!
              </Text>
            </Box>
          </Box>
        </VStack>
      </Box>

      {/* CTA Section */}
      <Box w="full" display="flex" justifyContent="center" alignItems="center" py={{ base: 10, md: 16 }} px={2}>
        <Box w="full" maxW="3xl" borderRadius="2xl" p={{ base: 6, md: 12 }} background="linear-gradient(120deg, #000 70%, #14558a 100%)" boxShadow="2xl" textAlign="center" position="relative">
          <Text fontSize="xs" color="orange.300" mb={2}>
            Spar dir teure Umwege
          </Text>
          <Heading as="h2" color="white" fontSize={{ base: "2xl", md: "3xl" }} fontWeight="semibold" mb={4}>
            Lass Profis dein Wachstum beschleunigen <span role="img" aria-label="runter">👇</span>
          </Heading>
                      <Link href="/checkout">
              <Button size="lg" colorScheme="blue" fontSize="sm" boxShadow="lg">
                ⚡️ ZUGANG ZUR AUSBILDUNG
              </Button>
            </Link>
        </Box>
      </Box>

      {/* FAQ Section */}
      <Box w="full" background="linear-gradient(135deg, rgb(7, 23, 36) 0%, rgb(23, 89, 143) 100%)" py={{ base: 12, md: 20 }} px={2}>
        <VStack maxW="3xl" mx="auto" gap={8} align="stretch">
          <Text textAlign="center" fontWeight="bold" color="#EAB308" fontSize="sm" mb={2}>
            FAQ 
          </Text>
          <Heading as="h2" fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" textAlign="center" mb={2} color="white">
            Häufige Fragen –{' '}
            <Box as="span" background="linear-gradient(90deg,rgb(246, 236, 92), transparent 105%)" color="black" px={2} py={1} borderRadius="md" fontWeight="bold" display="inline-block">
              direkt beantwortet!
            </Box>
          </Heading>
          <Text color="gray.300" fontSize="lg" textAlign="center" mb={4}>
            Hier findest du die wichtigsten Antworten rund um die SNTTRADES Ausbildung.
          </Text>
          <Box>
            {/* FAQ Accordion */}
            <Accordion.Root variant="plain" multiple>
              {/* Frage 1 */}
              <Accordion.Item value="faq-1" bg="rgba(255,255,255,0.1)" backdropFilter="blur(10px)" borderRadius="xl" boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.37)" border="1px solid rgba(255, 255, 255, 0.18)" mb={4}>
                <Accordion.ItemTrigger color="white" fontSize="md" p={5} _hover={{ bg: "rgba(255,255,255,0.05)" }} display="flex" justifyContent="space-between" alignItems="center" textAlign="left">
                  Ist das auch für Anfänger geeignet?
                  <Accordion.ItemIndicator>
                    <CaretDown />
                  </Accordion.ItemIndicator>
                </Accordion.ItemTrigger>
                <Accordion.ItemContent>
                  <Accordion.ItemBody px={5} pb={5} color="gray.300" fontSize="sm">
                    Ja – absolut. Die <Text as="span" fontWeight="bold">SNTTRADES MASTERCLASS</Text> ist so aufgebaut, dass auch Einsteiger ohne Vorkenntnisse strukturiert und verständlich an das Thema Trading herangeführt werden.<br /><br />
                    Du startest mit den Grundlagen und wirst Schritt für Schritt bis hin zu fortgeschrittenen Strategien begleitet – inklusive praktischer Umsetzung, Live-Support und klarer Anleitung.
                  </Accordion.ItemBody>
                </Accordion.ItemContent>
              </Accordion.Item>

              {/* Frage 2 */}
              <Accordion.Item value="faq-2" bg="rgba(255,255,255,0.1)" backdropFilter="blur(10px)" borderRadius="xl" boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.37)" border="1px solid rgba(255, 255, 255, 0.18)" mb={4}>
                <Accordion.ItemTrigger color="white" fontSize="md" p={5} _hover={{ bg: "rgba(255,255,255,0.05)" }} display="flex" justifyContent="space-between" alignItems="center" textAlign="left">
                  Brauche ich einen teuren Computer zum Traden?
                  <Accordion.ItemIndicator>
                    <CaretDown />
                  </Accordion.ItemIndicator>
                </Accordion.ItemTrigger>
                <Accordion.ItemContent>
                  <Accordion.ItemBody px={5} pb={5} color="gray.300" fontSize="sm">
                    Nein. Für den Einstieg ins Trading reicht ein ganz normaler Laptop oder Computer mit stabiler Internetverbindung völlig aus. Du brauchst <Text as="span" fontWeight="bold">keine teure Hardware oder spezielle Ausstattung</Text> – wichtig ist nur, dass dein Gerät zuverlässig läuft und du konzentriert arbeiten kannst. Viele unserer Teilnehmer traden erfolgreich mit ganz gewöhnlicher Technik.
                  </Accordion.ItemBody>
                </Accordion.ItemContent>
              </Accordion.Item>

              {/* Frage 3 */}
              <Accordion.Item value="faq-3" bg="rgba(255,255,255,0.1)" backdropFilter="blur(10px)" borderRadius="xl" boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.37)" border="1px solid rgba(255, 255, 255, 0.18)" mb={4}>
                <Accordion.ItemTrigger color="white" fontSize="md" p={5} _hover={{ bg: "rgba(255,255,255,0.05)" }} display="flex" justifyContent="space-between" alignItems="center" textAlign="left">
                  Brauche ich Startkapital, um zu beginnen?
                  <Accordion.ItemIndicator>
                    <CaretDown />
                  </Accordion.ItemIndicator>
                </Accordion.ItemTrigger>
                <Accordion.ItemContent>
                  <Accordion.ItemBody px={5} pb={5} color="gray.300" fontSize="sm">
                    <Text as="span" fontWeight="bold">Nein.</Text> Am Anfang geht es nicht darum, sofort mit echtem Geld zu traden – sondern darum, das Handwerk <Text as="span" fontWeight="bold">richtig zu lernen</Text>, die Märkte zu verstehen und deine Strategie si<Text as="span" fontWeight="bold">cher zu beherrschen</Text>.<br /><br />
                    Du lernst zuerst in einer risikofreien Umgebung (z. B. im Demokonto) und baust dir Schritt für Schritt die nötige Erfahrung auf, bevor echtes Kapital überhaupt Thema wird.
                  </Accordion.ItemBody>
                </Accordion.ItemContent>
              </Accordion.Item>

              {/* Frage 4 */}
              <Accordion.Item value="faq-4" bg="rgba(255,255,255,0.1)" backdropFilter="blur(10px)" borderRadius="xl" boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.37)" border="1px solid rgba(255, 255, 255, 0.18)" mb={4}>
                <Accordion.ItemTrigger color="white" fontSize="md" p={5} _hover={{ bg: "rgba(255,255,255,0.05)" }} display="flex" justifyContent="space-between" alignItems="center" textAlign="left">
                  Warum SNTTRADES?
                  <Accordion.ItemIndicator>
                    <CaretDown />
                  </Accordion.ItemIndicator>
                </Accordion.ItemTrigger>
                <Accordion.ItemContent>
                  <Accordion.ItemBody px={5} pb={5} color="gray.300" fontSize="sm">
                    Weil du bei uns n<Text as="span" fontWeight="bold">icht nur einen Kurs</Text>, sondern eine echte<Text as="span" fontWeight="bold"> Community</Text> bekommst.<br /><br />
                    Wir sind wie eine Familie – jeder unterstützt jeden, ganz egal auf welchem Level du gerade bist. Du bist umgeben von <Text as="span" fontWeight="bold">Gleichgesinnten</Text>, die dieselbe Vision teilen: besser werden, gemeinsam wachsen und langfristig erfolgreich traden. Bei SNTTRADES stehst du <Text as="span" fontWeight="bold">niemals allein da</Text> – wir gehen den Weg gemeinsam, Schritt für Schritt.
                  </Accordion.ItemBody>
                </Accordion.ItemContent>
              </Accordion.Item>
            </Accordion.Root>
          </Box>
          <Box pt={6} textAlign="center">
            <Link href="/checkout">
              <Button size="lg" colorScheme="blue" bg="#1E88E5" _hover={{ bg: "#1565C0" }} fontSize="sm" fontWeight="semibold" px={8} py={4} boxShadow="lg" borderRadius="md">
                ⚡ JETZT STARTEN
              </Button>
            </Link>
          </Box>
        </VStack>
      </Box>
    </>);
}

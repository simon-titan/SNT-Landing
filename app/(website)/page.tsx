import {
  Heading,
  Stack,
  VStack,
  HStack,
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
  CheckCircle,
} from "@phosphor-icons/react/dist/ssr";
import { BrandedVimeoPlayer } from "@/components/ui/BrandedVimeoPlayer";
import { ReviewMarquee } from "@/components/ui/ReviewMarquee";
import { ResultsMarquee } from "@/components/ui/ResultsMarquee";
import { FounderSection } from "@/components/ui/FounderSection";
import { CourseOverviewSection } from "@/components/ui/CourseOverviewSection";

import { Project30PricingSection } from "@/components/ui/project30-pricing-section";

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
        bg="black"
        borderBottom="1px solid"
        borderColor="rgba(34, 197, 94, 0.25)"
        w="100vw"
        mx="unset"
        pb={{ base: "60px", md: "80px" }}
        background="radial-gradient(at 0% 100%, rgba(34, 197, 94, 0.28) 0px, transparent 55%),
        radial-gradient(at 100% 0%, rgba(16, 185, 129, 0.22) 0px, transparent 55%),
        linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(10,12,10,1) 100%)"

      >
 <style>{`
         html { scroll-behavior: smooth; }
         .css-1q38vmp {
            padding-top: 75px !important;
          }
        `}</style>

        <VStack gap="4" maxW="900px" mx="auto">
          <Stack gap="2" textAlign="center" mx="auto">
            {/* INEVITRADE Trading Academy Badge */}
            
            <Heading
              as="h1"
              textStyle={{ base: "4xl", md: "5xl" }}
              mx="auto"
              color="white"
              lineHeight="tighter"
              fontWeight="bold"
              maxW="800px"
            >
              DEIN WEG ZUM{' '}
              <Box as="span" 
                background="linear-gradient(90deg, rgba(34,197,94,0.28), transparent 95%)" 
                color="white" 
                px={2} 
                py={1} 
                borderRadius="md" 
                fontWeight="bold" 
                display="inline-block"
                border="1px solid rgba(34, 197, 94, 0.35)"
                boxShadow="0 0 0 1px rgba(34, 197, 94, 0.25) inset, 0 0 24px rgba(34, 197, 94, 0.25)"
                backdropFilter="blur(6px)"
              >
                PRO TRADER.
              </Box>
            </Heading>
            <Text color="gray.300" textStyle="sm" mx="auto" maxW="700px">
              Wir haben über <Text as="span" color="#22c55e" fontWeight="bold">6+ Jahre Erfahrung</Text>, um dir in einem klar aufgebauten, selbstbestimmten Kurs genau das zu zeigen, was im Trading wirklich zählt.<br />
              
            </Text>
          </Stack>
                    <Stack align="center" direction={{ base: "column", md: "row" }} gap="3">
            <Link href="#project30-pricing">
              <Button size="xl" fontWeight="bold" colorScheme="green" bg="#22c55e" _hover={{ bg: "#16a34a" }} borderRadius="md" px="8" boxShadow="0 0 24px rgba(34,197,94,0.35)" border="1px solid rgba(34,197,94,0.45)">
               ⚡ JETZT STARTEN
              </Button>
            </Link>
          </Stack>
          <Stack direction="row" align="center" cursor="pointer" justify="center" mt={0}>
            <WarningCircle size={16} color="#A0AEC0" />
            <Text fontSize="xs" color="gray.400" cursor="pointer" textAlign="center" zIndex={1000}>
              Trading beinhaltet Risiken. <Link href="/legal/disclaimer" color="gray.400" cursor="pointer" textDecoration="underline">Lies unseren Disclaimer!</Link>
            </Text>
          </Stack>
        </VStack>
      </Section>
      
      {/* Video Player Section mit Überlappung */}
      <Section 
        size="lg" 
        bg="transparent"
        mt={{ base: "-170px", md: "-220px" }}
        pt="0"
        position="relative"
        zIndex={2}
      >
        <VStack gap="6" maxW="none" mx="auto" position="relative">
          {/* Video + Community Container */}
          <Box 
            w={{ base: '100%', md: '800px', lg: '1200px', xl: '1400px' }} 
            maxW="100%" 
            mx="auto" 
            bg="linear-gradient(135deg, rgba(34, 197, 94, 0.35), rgba(16, 185, 129, 0.35))"
            borderRadius="xl" 
            p="7px"
            position="relative"
            zIndex={3}
            boxShadow="0 0 40px rgba(34,197,94,0.2)"
          >
            <VStack gap="2">
              {/* Video Player */}
              <Box 
                w="100%" 
                aspectRatio={16/9} 
                position="relative"
                overflow="hidden"
                bg="white"
                borderRadius="lg"
              >
                <BrandedVimeoPlayer videoId="1104311683" />
              </Box>
              
              {/* Community Stats */}
              <Box 
                p="2" 
                w="100%" 
                bg="rgba(10, 14, 10, 0.6)"
                backdropFilter="blur(12px)"
                borderRadius="lg"
                border="1px solid rgba(34, 197, 94, 0.25)"
                boxShadow="0 8px 32px 0 rgba(34, 197, 94, 0.20)"
              >
                <Stack direction="row" align="center" gap="2" justify="center">
                  <Stack direction="row" gap="-2">
                    <Box 
                       w="6" 
                       h="6" 
                       borderRadius="full" 
                       border="2px solid rgba(34, 197, 94, 0.45)" 
                       overflow="hidden"
                       bg="gray.200"
                       boxShadow="0 4px 8px rgba(0,0,0,0.1)"
                     >
                       <img 
                         src="/assets/community-stats/user_6819319_6ec853ff-5777-4398-8fcc-06e2621cbcf8.avif" 
                         alt="Community member"
                         style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                       />
                     </Box>
                     <Box 
                       w="6" 
                       h="6" 
                       borderRadius="full" 
                       border="2px solid rgba(34, 197, 94, 0.45)" 
                       overflow="hidden"
                       bg="gray.200"
                       boxShadow="0 4px 8px rgba(0,0,0,0.1)"
                     >
                       <img 
                         src="/assets/community-stats/4208db19763848b131989eadba9899aa.avif" 
                         alt="Community member"
                         style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                       />
                     </Box>
                     <Box 
                       w="6" 
                       h="6" 
                       borderRadius="full" 
                       border=" 2px solid rgba(34, 197, 94, 0.45)" 
                       overflow="hidden"
                       bg="gray.200"
                       boxShadow="0 4px 8px rgba(0,0,0,0.1)"
                     >
                       <img 
                         src="/assets/community-stats/393d1b15978eed96285cf196b2f51eda.avif" 
                         alt="Community member"
                         style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                       />
                     </Box>
                  </Stack>
                  <Text fontSize="xs" color="gray.200" fontWeight="medium" textShadow="0 1px 2px rgba(0,0,0,0.3)">
                   ...Bereits über <Text as="span" fontWeight="bold">1000+ Trader</Text> auf ihrem Weg begleitet und ausgebildet.
                  </Text>
                </Stack>
              </Box>
            </VStack>
          </Box>
          
        </VStack>
      </Section>
      
      <ResultsMarquee />
      
      {/* Glow Trenner */}
      <Box
        w="100%"
        h="2px"
        background="linear-gradient(90deg, transparent, rgba(34, 197, 94, 0.6), transparent)"
        boxShadow="0 0 20px rgba(34, 197, 94, 0.4)"
      />
      
      {/* Project 30 Pricing Section - Direkt unter Community Stats */}
      <Box id="project30-pricing">
      <Project30PricingSection />
      </Box>
      
      {/* Glow Trenner */}
      <Box
        w="100%"
        h="2px"
        background="linear-gradient(90deg, transparent, rgba(34, 197, 94, 0.6), transparent)"
        boxShadow="0 0 20px rgba(34, 197, 94, 0.4)"
      />
      
      <ReviewMarquee />
      
      {/* Glow Trenner */}
      <Box
        w="100%"
        h="2px"
        background="linear-gradient(90deg, transparent, rgba(34, 197, 94, 0.6), transparent)"
        boxShadow="0 0 20px rgba(34, 197, 94, 0.4)"
      />
      
      <FounderSection
        image="/personal/emre.jpg"
        name="Hi, Ich bin Emre 👋"
        subtitle="MEET THE FOUNDER"
        description={
          <Box fontSize="md" color="white">
            <Text mb={4} lineHeight="1.6">
              Meine Reise begann nach dem <Text as="span" fontWeight="semibold" color="#22c55e">Abitur</Text> – ursprünglich wollte ich eine eigene <Text as="span" fontWeight="semibold" color="#22c55e">Brand aufbauen</Text>. Doch als ich das enorme <Text as="span" fontWeight="semibold" color="#22c55e">Potenzial im Trading</Text> erkannt habe, habe ich alles andere losgelassen und mich zu <Text as="span" fontWeight="semibold" color="#22c55e">100 % dem Trading</Text> gewidmet.
            </Text>
            
            <Text mb={6} lineHeight="1.6">
              Die ersten Jahre waren intensiv. Ich habe nicht nur die <Text as="span" fontWeight="semibold" color="#22c55e">Märkte studiert</Text>, sondern auch mich selbst – <Text as="span" fontWeight="semibold" color="#22c55e">mentale Stärke, Disziplin und Unternehmertum</Text> wurden zu Schlüsselkomponenten auf meinem Weg.
            </Text>
            
            {/* Cooler "3 Jahre später" Bereich */}
            <Box
              position="relative"
              my={8}
              p={6}
              bg="rgba(34, 197, 94, 0.1)"
              borderRadius="xl"
              border="2px solid rgba(34, 197, 94, 0.3)"
              boxShadow="0 8px 32px rgba(34, 197, 94, 0.2), inset 0 1px 0 rgba(34, 197, 94, 0.1)"
              _before={{
                content: '""',
                position: "absolute",
                top: "-1px",
                left: "20px",
                right: "20px",
                height: "2px",
                background: "linear-gradient(90deg, transparent, #22c55e, transparent)",
                borderRadius: "full"
              }}
            >
              <Text 
                fontSize="xl" 
                fontWeight="bold" 
                mb={4} 
                color="#22c55e"
                textAlign="center"
                textShadow="0 0 15px rgba(34, 197, 94, 0.6)"
                position="relative"
                _before={{
                  content: '"⚡"',
                  position: "absolute",
                  left: "-30px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: "1.5rem"
                }}
                _after={{
                  content: '"⚡"',
                  position: "absolute",
                  right: "-30px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: "1.5rem"
                }}
              >
              3 Jahre später...
            </Text>
            
              <VStack align="start" gap={3}>
                <Text color="white" fontSize="md">
                  🚀 Vollzeit <Text as="span" fontWeight="bold" color="#22c55e">Daytrader, Scalper & Investor</Text>
                </Text>
                <Text color="white" fontSize="md">
                  💰 <Text as="span" fontWeight="bold" color="#22c55e">Mehrfach funded</Text> bei verschiedenen Propfirms mit <Text as="span" fontWeight="bold" color="#22c55e">mehreren tausenden $ von Auszahlungen</Text>
                </Text>
                <Text color="white" fontSize="md">
                  📱 Über <Text as="span" fontWeight="bold" color="#22c55e">10.000 Follower</Text> auf Social Media
                </Text>
                <Text color="white" fontSize="md">
                  👥 Aufbau einer <Text as="span" fontWeight="bold" color="#22c55e">großen geschlossenen Community</Text> mit echten Gleichgesinnten
                </Text>
                <Text color="white" fontSize="md">
                  🎯 Gemeinsam mit Ali über <Text as="span" fontWeight="bold" color="#22c55e">1.000 Menschen im Trading ausgebildet</Text>
                </Text>
                <Text color="white" fontSize="md" fontStyle="italic">
                  ✨ Unsere Mission: anderen zeigen, wie sie strukturiert und professionell ihre eigene Trading-Reise starten können
                </Text>
            </VStack>
            </Box>
            
            <Text mb={4} lineHeight="1.6">
              Wenn du das Ganze ernst meinst und bereit bist, <Text as="span" fontWeight="semibold" color="#22c55e">in dich selbst zu investieren</Text> – dann bist du hier genau richtig.
            </Text>
            
            <Text mb={4} lineHeight="1.6">
              Hier findest du kein Bla-Bla, sondern <Text as="span" fontWeight="semibold" color="#22c55e">echte Ergebnisse, echte Strategien und ein echtes Netzwerk</Text>.
            </Text>
            
            <Text fontWeight="bold" fontSize="lg" color="#22c55e" textShadow="0 0 10px rgba(34, 197, 94, 0.4)">
              Starte jetzt – dein Trading-Weg beginnt hier.
            </Text>
          </Box>
        }
        checklist={[
          'Spezialist für Scalping und Daytrading Strategien',
          'Experte in Marktpsychologie und Risikomanagement', 
          'Gründer einer professionellen Trading-Community',
          'Mentor für über 1.000 erfolgreiche Trader',
          'Content Creator mit großer Social Media Reichweite',
          'Fokus auf nachhaltige und profitable Trading-Systeme'
        ]}
        highlights={["as seen in"]}
      />
      <CourseOverviewSection />
      
      {/* Glow Trenner */}
      <Box
        w="100%"
        h="2px"
        background="linear-gradient(90deg, transparent, rgba(34, 197, 94, 0.6), transparent)"
        boxShadow="0 0 20px rgba(34, 197, 94, 0.4)"
      />
      
      {/* Trading Ausbildung Vorteile Section */}
      <Section 
        size="lg" 
        bg="linear-gradient(135deg, rgba(0, 0, 0, 0.98), rgba(10, 14, 10, 0.95))"
        position="relative"
        py={{ base: 16, md: 24 }}
        _before={{
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "radial-gradient(at 50% 20%, rgba(34, 197, 94, 0.12) 0px, transparent 50%), radial-gradient(at 20% 80%, rgba(16, 185, 129, 0.08) 0px, transparent 50%)",
          pointerEvents: "none"
        }}
      >
        <VStack gap={12} maxW="6xl" mx="auto" position="relative" zIndex={1}>
          <VStack gap={4} textAlign="center">
            <Text 
              color="#22c55e" 
              fontWeight="bold" 
              fontSize="sm" 
              textTransform="uppercase"
              letterSpacing="wider"
              textShadow="0 0 10px rgba(34, 197, 94, 0.5)"
            >
              So funktioniert's
            </Text>
            <Heading 
              fontSize={{ base: "2xl", md: "4xl" }} 
              fontWeight="bold" 
              color="white"
              textShadow="0 2px 4px rgba(0,0,0,0.3)"
            >
              Bring dein Trading aufs{' '}
              <Box as="span" 
                background="linear-gradient(90deg, rgba(34, 197, 94, 0.3), transparent 95%)" 
                color="#22c55e" 
                px={3} 
                py={1} 
                borderRadius="md" 
                fontWeight="bold" 
                display="inline-block"
                border="1px solid rgba(34, 197, 94, 0.4)"
                boxShadow="0 0 20px rgba(34, 197, 94, 0.3)"
                textShadow="0 0 15px rgba(34, 197, 94, 0.6)"
              >
                nächste Level.
              </Box>
            </Heading>
          </VStack>
          
          <VStack gap={8} w="full">
            {/* Phase 1 */}
            <Box
              w="full"
              bg="rgba(10, 14, 10, 0.8)"
              backdropFilter="blur(20px)"
              borderRadius="2xl"
              border="2px solid rgba(34, 197, 94, 0.3)"
              boxShadow="0 20px 60px 0 rgba(34, 197, 94, 0.2)"
              overflow="hidden"
              position="relative"
              _hover={{
                borderColor: "rgba(34, 197, 94, 0.5)",
                boxShadow: "0 25px 80px 0 rgba(34, 197, 94, 0.3)"
              }}
              transition="all 0.3s ease"
            >
              <Stack
                direction={{ base: "column", md: "row" }}
                align="center"
                p={8}
                gap={8}
              >
                <Box flex="1">
                  <Text color="#22c55e" fontWeight="bold" fontSize="lg" mb={3}>
                    PHASE 1
                  </Text>
                  <Text fontWeight="bold" fontSize={{ base: "lg", md: "2xl" }} color="white" mb={4}>
                    Umfassendes Video-Training auf Abruf
                  </Text>
                  <Text color="gray.200" fontSize="md" mb={6} lineHeight="1.6">
                    Als Teilnehmer startest du mit unseren grundlegenden Prinzipien und entwickelst dich Schritt für Schritt bis hin zu fortgeschrittenen Strategien.
                  </Text>
                  <VStack align="start" gap={2}>
                    <HStack gap={2}>
                      <Box w={2} h={2} borderRadius="full" bg="#22c55e" />
                      <Text fontSize="sm" color="white">Fokus auf's Wesentliche</Text>
                    </HStack>
                    <HStack gap={2}>
                      <Box w={2} h={2} borderRadius="full" bg="#22c55e" />
                      <Text fontSize="sm" color="white">Strategien wirklich verstehen</Text>
                    </HStack>
                    <HStack gap={2}>
                      <Box w={2} h={2} borderRadius="full" bg="#22c55e" />
                      <Text fontSize="sm" color="white">Lernen wann und wo du willst</Text>
                    </HStack>
                  </VStack>
                </Box>
                <Box flexShrink={0} display={{ base: "none", md: "block" }}>
                  <Box
                    w="120px"
                    h="120px"
                    bg="rgba(34, 197, 94, 0.1)"
                    borderRadius="xl"
                    border="1px solid rgba(34, 197, 94, 0.3)"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text fontSize="3xl">📚</Text>
                  </Box>
                </Box>
              </Stack>
            </Box>
            
            {/* Phase 2 */}
            <Box
              w="full"
              bg="rgba(10, 14, 10, 0.8)"
              backdropFilter="blur(20px)"
              borderRadius="2xl"
              border="2px solid rgba(34, 197, 94, 0.3)"
              boxShadow="0 20px 60px 0 rgba(34, 197, 94, 0.2)"
              overflow="hidden"
              position="relative"
              _hover={{
                borderColor: "rgba(34, 197, 94, 0.5)",
                boxShadow: "0 25px 80px 0 rgba(34, 197, 94, 0.3)"
              }}
              transition="all 0.3s ease"
            >
              <Stack
                direction={{ base: "column", md: "row-reverse" }}
                align="center"
                p={8}
                gap={8}
              >
                <Box flex="1">
                  <Text color="#22c55e" fontWeight="bold" fontSize="lg" mb={3}>
                    PHASE 2
                  </Text>
                  <Text fontWeight="bold" fontSize={{ base: "lg", md: "2xl" }} color="white" mb={4}>
                    Live-Mentoring & Umsetzung
                  </Text>
                  <Text color="gray.200" fontSize="md" mb={6} lineHeight="1.6">
                    Lerne direkt von uns als erfahrene Tradern, erhalte persönliche Anleitung und setze dein Wissen gezielt in die Praxis um.
                  </Text>
                  <VStack align="start" gap={2}>
                    <HStack gap={2}>
                      <Box w={2} h={2} borderRadius="full" bg="#22c55e" />
                      <Text fontSize="sm" color="white">Lernen & direkt anwenden</Text>
                    </HStack>
                    <HStack gap={2}>
                      <Box w={2} h={2} borderRadius="full" bg="#22c55e" />
                      <Text fontSize="sm" color="white">Mehr Sicherheit im Trading</Text>
                    </HStack>
                    <HStack gap={2}>
                      <Box w={2} h={2} borderRadius="full" bg="#22c55e" />
                      <Text fontSize="sm" color="white">Praxisnah</Text>
                    </HStack>
                  </VStack>
                </Box>
                <Box flexShrink={0} display={{ base: "none", md: "block" }}>
                  <Box
                    w="120px"
                    h="120px"
                    bg="rgba(34, 197, 94, 0.1)"
                    borderRadius="xl"
                    border="1px solid rgba(34, 197, 94, 0.3)"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text fontSize="3xl">🎯</Text>
                  </Box>
                </Box>
              </Stack>
            </Box>
            
            {/* Phase 3 */}
            <Box
              w="full"
              bg="rgba(10, 14, 10, 0.8)"
              backdropFilter="blur(20px)"
              borderRadius="2xl"
              border="2px solid rgba(34, 197, 94, 0.4)"
              boxShadow="0 20px 60px 0 rgba(34, 197, 94, 0.25)"
              overflow="hidden"
              position="relative"
              _hover={{
                borderColor: "rgba(34, 197, 94, 0.6)",
                boxShadow: "0 25px 80px 0 rgba(34, 197, 94, 0.4)"
              }}
              transition="all 0.3s ease"
            >
              <Stack
                direction={{ base: "column", md: "row" }}
                align="center"
                p={8}
                gap={8}
              >
                <Box flex="1">
                  <Text color="#22c55e" fontWeight="bold" fontSize="lg" mb={3}>
                    PHASE 3
                  </Text>
                  <Text fontWeight="bold" fontSize={{ base: "lg", md: "2xl" }} color="white" mb={4}>
                    Trading meistern & echte Ergebnisse erzielen
                  </Text>
                  <Text color="gray.200" fontSize="md" mb={6} lineHeight="1.6">
                    Jetzt verstehst du unsere Strategie in ihrer Tiefe und kannst sie selbstbewusst umsetzen – für mehr Freiheit und finanzielle Klarheit.
                  </Text>
                  <VStack align="start" gap={2}>
                    <HStack gap={2}>
                      <Box w={2} h={2} borderRadius="full" bg="#22c55e" />
                      <Text fontSize="sm" color="white">Konstanz & Kontrolle</Text>
                    </HStack>
                    <HStack gap={2}>
                      <Box w={2} h={2} borderRadius="full" bg="#22c55e" />
                      <Text fontSize="sm" color="white">Mehr Freiheit durch Ergebnisse</Text>
                    </HStack>
                    <HStack gap={2}>
                      <Box w={2} h={2} borderRadius="full" bg="#22c55e" />
                      <Text fontSize="sm" color="white">Klarer Weg zu deinem Ziel</Text>
                    </HStack>
                  </VStack>
                </Box>
                <Box flexShrink={0} display={{ base: "none", md: "block" }}>
                  <Box
                    w="120px"
                    h="120px"
                    bg="rgba(34, 197, 94, 0.15)"
                    borderRadius="xl"
                    border="1px solid rgba(34, 197, 94, 0.4)"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    boxShadow="0 8px 24px rgba(34, 197, 94, 0.2)"
                  >
                    <Text fontSize="3xl">🚀</Text>
                  </Box>
                </Box>
              </Stack>
            </Box>
          </VStack>
        </VStack>
      </Section>
      
      {/* Was alles beinhaltet ist Section */}
      <Section 
        size="lg" 
        bg="linear-gradient(135deg, rgba(10, 14, 10, 0.98), rgba(0, 0, 0, 0.95))"
        position="relative"
        py={{ base: 16, md: 20 }}
        _before={{
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "radial-gradient(at 80% 20%, rgba(34, 197, 94, 0.1) 0px, transparent 50%), radial-gradient(at 20% 80%, rgba(16, 185, 129, 0.08) 0px, transparent 50%)",
          pointerEvents: "none"
        }}
      >
        <VStack gap={12} maxW="6xl" mx="auto" position="relative" zIndex={1}>
          <VStack gap={4} textAlign="center">
            <Text 
              color="#22c55e" 
              fontWeight="bold" 
              fontSize="sm" 
              textTransform="uppercase"
              letterSpacing="wider"
              textShadow="0 0 10px rgba(34, 197, 94, 0.5)"
            >
              Alles inklusive
            </Text>
            <Heading 
              fontSize={{ base: "2xl", md: "4xl" }} 
              fontWeight="bold" 
              color="white"
              textShadow="0 2px 4px rgba(0,0,0,0.3)"
              textAlign="center"
            >
              Das ist alles in der{' '}
              <Box as="span" 
                background="linear-gradient(90deg, rgba(34, 197, 94, 0.3), transparent 95%)" 
                color="#22c55e" 
                px={3} 
                py={1} 
                borderRadius="md" 
                fontWeight="bold" 
                display="inline-block"
                border="1px solid rgba(34, 197, 94, 0.4)"
                boxShadow="0 0 20px rgba(34, 197, 94, 0.3)"
                textShadow="0 0 15px rgba(34, 197, 94, 0.6)"
              >
                Ausbildung
              </Box>{' '}
              enthalten
            </Heading>
          </VStack>
          
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6} w="full">
            {/* Community */}
            <Box
              bg="rgba(10, 14, 10, 0.7)"
              backdropFilter="blur(16px)"
              borderRadius="xl"
              border="1px solid rgba(34, 197, 94, 0.3)"
              boxShadow="0 8px 32px 0 rgba(34, 197, 94, 0.15)"
              p={6}
              textAlign="center"
              _hover={{
                transform: "translateY(-4px)",
                boxShadow: "0 12px 40px 0 rgba(34, 197, 94, 0.25)",
                borderColor: "rgba(34, 197, 94, 0.4)"
              }}
              transition="all 0.3s ease"
            >
              <Box
                w="60px"
                h="60px"
                bg="rgba(34, 197, 94, 0.15)"
                borderRadius="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
                mx="auto"
                mb={4}
                border="1px solid rgba(34, 197, 94, 0.3)"
              >
                <Text fontSize="2xl">👥</Text>
              </Box>
              <Text 
                fontWeight="bold" 
                fontSize="lg" 
                color="#22c55e" 
                mb={2}
                textShadow="0 0 8px rgba(34, 197, 94, 0.4)"
              >
                Community
              </Text>
              <Text fontSize="sm" color="gray.200" lineHeight="1.5">
                Direkter Austausch mit Mentoren & Teilnehmern in einer starken Gemeinschaft
              </Text>
            </Box>
            
            {/* Trading Tools */}
            <Box
              bg="rgba(10, 14, 10, 0.7)"
              backdropFilter="blur(16px)"
              borderRadius="xl"
              border="1px solid rgba(34, 197, 94, 0.3)"
              boxShadow="0 8px 32px 0 rgba(34, 197, 94, 0.15)"
              p={6}
              textAlign="center"
              _hover={{
                transform: "translateY(-4px)",
                boxShadow: "0 12px 40px 0 rgba(34, 197, 94, 0.25)",
                borderColor: "rgba(34, 197, 94, 0.4)"
              }}
              transition="all 0.3s ease"
            >
              <Box
                w="60px"
                h="60px"
                bg="rgba(34, 197, 94, 0.15)"
                borderRadius="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
                mx="auto"
                mb={4}
                border="1px solid rgba(34, 197, 94, 0.3)"
              >
                <Text fontSize="2xl">🛠️</Text>
              </Box>
              <Text 
                fontWeight="bold" 
                fontSize="lg" 
                color="#22c55e" 
                mb={2}
                textShadow="0 0 8px rgba(34, 197, 94, 0.4)"
              >
                Trading Tools
              </Text>
              <Text fontSize="sm" color="gray.200" lineHeight="1.5">
                Exklusive Profi-Tools, Tracker & individuelle Indikatoren für deinen Vorteil
              </Text>
            </Box>
            
            {/* Lernplattform */}
            <Box
              bg="rgba(10, 14, 10, 0.7)"
              backdropFilter="blur(16px)"
              borderRadius="xl"
              border="1px solid rgba(34, 197, 94, 0.3)"
              boxShadow="0 8px 32px 0 rgba(34, 197, 94, 0.15)"
              p={6}
              textAlign="center"
              _hover={{
                transform: "translateY(-4px)",
                boxShadow: "0 12px 40px 0 rgba(34, 197, 94, 0.25)",
                borderColor: "rgba(34, 197, 94, 0.4)"
              }}
              transition="all 0.3s ease"
            >
              <Box
                w="60px"
                h="60px"
                bg="rgba(34, 197, 94, 0.15)"
                borderRadius="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
                mx="auto"
                mb={4}
                border="1px solid rgba(34, 197, 94, 0.3)"
              >
                <Text fontSize="2xl">🎓</Text>
              </Box>
              <Text 
                fontWeight="bold" 
                fontSize="lg" 
                color="#22c55e" 
                mb={2}
                textShadow="0 0 8px rgba(34, 197, 94, 0.4)"
              >
                Lernplattform
              </Text>
              <Text fontSize="sm" color="gray.200" lineHeight="1.5">
                Strukturiertes Video-Training von Grundlagen bis zu Profi-Strategien
              </Text>
            </Box>
            
            {/* Live Mentoring */}
            <Box
              bg="rgba(10, 14, 10, 0.7)"
              backdropFilter="blur(16px)"
              borderRadius="xl"
              border="1px solid rgba(34, 197, 94, 0.3)"
              boxShadow="0 8px 32px 0 rgba(34, 197, 94, 0.15)"
              p={6}
              textAlign="center"
              _hover={{
                transform: "translateY(-4px)",
                boxShadow: "0 12px 40px 0 rgba(34, 197, 94, 0.25)",
                borderColor: "rgba(34, 197, 94, 0.4)"
              }}
              transition="all 0.3s ease"
            >
              <Box
                w="60px"
                h="60px"
                bg="rgba(34, 197, 94, 0.15)"
                borderRadius="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
                mx="auto"
                mb={4}
                border="1px solid rgba(34, 197, 94, 0.3)"
              >
                <Text fontSize="2xl">🎥</Text>
              </Box>
              <Text 
                fontWeight="bold" 
                fontSize="lg" 
                color="#22c55e" 
                mb={2}
                textShadow="0 0 8px rgba(34, 197, 94, 0.4)"
              >
                Live-Mentoring
              </Text>
              <Text fontSize="sm" color="gray.200" lineHeight="1.5">
                Exklusive Live-Sessions mit erfolgreichen Tradern für persönliche Betreuung
              </Text>
            </Box>
          </SimpleGrid>
        </VStack>
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

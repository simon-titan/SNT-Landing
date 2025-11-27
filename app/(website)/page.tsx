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
  HandWaving,
  Lightning,
  RocketLaunch,
  Money,
  DeviceMobile,
  UsersThree,
  Target,
  Sparkle,
} from "@phosphor-icons/react/dist/ssr";
import { ReviewMarquee } from "@/components/ui/ReviewMarquee";
import { ResultsMarquee } from "@/components/ui/ResultsMarquee";
import { FounderSection } from "@/components/ui/FounderSection";
import { CourseOverviewSection } from "@/components/ui/CourseOverviewSection";
import { SntPremiumPricing } from "@/components/ui/snt-premium-pricing";
import { LandingHeroWithVideo } from "@/components/hero/landing-hero-with-video";
// Removed BrandedVimeoPlayer usage from this page; available in landing-hero-with-video
// import { BrandedVimeoPlayer } from "@/components/ui/BrandedVimeoPlayer";
 

export const metadata = generateMetadata({
  title: "Home",
  description:
    "Deserunt veniam voluptate aliqua consectetur laboris voluptate est labore qui commodo.",
});

export default async function Page() {
  return (
    <>
      <LandingHeroWithVideo />
      
      <ResultsMarquee />
      
      {/* Glow Trenner */}
      
      <Box
        w="100%"
        h="2px"
        background="linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.6), transparent)"
        boxShadow="0 0 20px rgba(59, 130, 246, 0.4)"
      />
      
      {/* Project 30 Pricing Section - Direkt unter Community Stats */}
      <Box id="project30-pricing">
      <SntPremiumPricing />
      </Box>
      
      {/* Glow Trenner */}
      <Box
        w="100%"
        h="2px"
        background="linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.6), transparent)"
        boxShadow="0 0 20px rgba(59, 130, 246, 0.4)"
      />
      
      <ReviewMarquee />
      
      {/* Glow Trenner */}
      <Box
        w="100%"
        h="2px"
        background="linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.6), transparent)"
        boxShadow="0 0 20px rgba(59, 130, 246, 0.4)"
      />
      
      <FounderSection
        image="/personal/emre-2.jpg"
        name={<>Hi, Ich bin Emre <HandWaving size={32} style={{ display: 'inline-block', verticalAlign: 'middle' }} /></>}
        subtitle="MEET THE FOUNDER"
        description={
          <Box fontSize="md" color="white">
            <Text mb={4} lineHeight="1.6">
              Meine Reise begann nach dem <Text as="span" fontWeight="semibold" color="#3b82f6">Abitur</Text> – ursprünglich wollte ich eine eigene <Text as="span" fontWeight="semibold" color="#3b82f6">Brand aufbauen</Text>. Doch als ich das enorme <Text as="span" fontWeight="semibold" color="#3b82f6">Potenzial im Trading</Text> erkannt habe, habe ich alles andere losgelassen und mich zu <Text as="span" fontWeight="semibold" color="#3b82f6">100 % dem Trading</Text> gewidmet.
            </Text>
            
            <Text mb={6} lineHeight="1.6">
              Die ersten Jahre waren intensiv. Ich habe nicht nur die <Text as="span" fontWeight="semibold" color="#3b82f6">Märkte studiert</Text>, sondern auch mich selbst – <Text as="span" fontWeight="semibold" color="#3b82f6">mentale Stärke, Disziplin und Unternehmertum</Text> wurden zu Schlüsselkomponenten auf meinem Weg.
            </Text>
            
            {/* Cooler "3 Jahre später" Bereich */}
            <Box
              position="relative"
              my={8}
              p={6}
              bg="rgba(59, 130, 246, 0.1)"
              borderRadius="xl"
              border="2px solid rgba(59, 130, 246, 0.3)"
              boxShadow="0 8px 32px rgba(59, 130, 246, 0.2), inset 0 1px 0 rgba(59, 130, 246, 0.1)"
              _before={{
                content: '""',
                position: "absolute",
                top: "-1px",
                left: "20px",
                right: "20px",
                height: "2px",
                background: "linear-gradient(90deg, transparent, #3b82f6, transparent)",
                borderRadius: "full"
              }}
            >
              <HStack justify="center" mb={4}>
                <Lightning size={32} color="#3b82f6" />
                <Text 
                  fontSize="xl" 
                  fontWeight="bold" 
                  color="#3b82f6"
                  textAlign="center"
                  textShadow="0 0 15px rgba(59, 130, 246, 0.6)"
                  mx={4}
                >
                3 Jahre später...
                </Text>
                <Lightning size={32} color="#3b82f6" />
              </HStack>
            
              <VStack align="start" gap={3}>
                <HStack align="center" gap={3}>
                  <RocketLaunch size={24} color="#3b82f6" />
                  <Text color="white" fontSize="md">
                    Vollzeit <Text as="span" fontWeight="bold" color="#3b82f6">Daytrader, Scalper & Investor</Text>
                  </Text>
                </HStack>
                <HStack align="center" gap={3}>
                  <Money size={24} color="#3b82f6" />
                  <Text color="white" fontSize="md">
                    <Text as="span" fontWeight="bold" color="#3b82f6">Mehrfach funded</Text> bei verschiedenen Propfirms mit <Text as="span" fontWeight="bold" color="#3b82f6">mehreren tausenden $ von Auszahlungen</Text>
                  </Text>
                </HStack>
                <HStack align="center" gap={3}>
                  <DeviceMobile size={24} color="#3b82f6" />
                  <Text color="white" fontSize="md">
                    Über <Text as="span" fontWeight="bold" color="#3b82f6">10.000 Follower</Text> auf Social Media
                  </Text>
                </HStack>
                <HStack align="center" gap={3}>
                  <UsersThree size={24} color="#3b82f6" />
                  <Text color="white" fontSize="md">
                    Aufbau einer <Text as="span" fontWeight="bold" color="#3b82f6">großen geschlossenen Community</Text> mit echten Gleichgesinnten
                  </Text>
                </HStack>
                <HStack align="center" gap={3}>
                  <Target size={24} color="#3b82f6" />
                  <Text color="white" fontSize="md">
                    Gemeinsam mit Ali über <Text as="span" fontWeight="bold" color="#3b82f6">1.000 Menschen im Trading ausgebildet</Text>
                  </Text>
                </HStack>
                <HStack align="center" gap={3}>
                  <Sparkle size={24} color="#3b82f6" />
                  <Text color="white" fontSize="md" fontStyle="italic">
                    Unsere Mission: anderen zeigen, wie sie strukturiert und professionell ihre eigene Trading-Reise starten können
                  </Text>
                </HStack>
            </VStack>
            </Box>
            
            <Text mb={4} lineHeight="1.6">
              Wenn du das Ganze ernst meinst und bereit bist, <Text as="span" fontWeight="semibold" color="#3b82f6">in dich selbst zu investieren</Text> – dann bist du hier genau richtig.
            </Text>
            
            <Text mb={4} lineHeight="1.6">
              Hier findest du kein Bla-Bla, sondern <Text as="span" fontWeight="semibold" color="#3b82f6">echte Ergebnisse, echte Strategien und ein echtes Netzwerk</Text>.
            </Text>
            
            <Text fontWeight="bold" fontSize="lg" color="#3b82f6" textShadow="0 0 10px rgba(59, 130, 246, 0.4)">
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
        background="linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.6), transparent)"
        boxShadow="0 0 20px rgba(59, 130, 246, 0.4)"
      />
      
      {/* Trading Ausbildung Vorteile Section */}
      <Section 
        size="lg" 
        py={{ base: 16, md: 24 }}
      >
        <VStack gap={12} maxW="6xl" mx="auto" position="relative" zIndex={1}>
          <VStack gap={4} textAlign="center">
            <Text 
              color="#3b82f6" 
              fontWeight="bold" 
              fontSize="sm" 
              textTransform="uppercase"
              letterSpacing="wider"
              textShadow="0 0 10px rgba(59, 130, 246, 0.5)"
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
                background="linear-gradient(90deg, rgba(59, 130, 246, 0.3), transparent 95%)" 
                color="#3b82f6" 
                px={3} 
                py={1} 
                borderRadius="md" 
                fontWeight="bold" 
                display="inline-block"
                border="1px solid rgba(59, 130, 246, 0.4)"
                boxShadow="0 0 20px rgba(59, 130, 246, 0.3)"
                textShadow="0 0 15px rgba(59, 130, 246, 0.6)"
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
              border="2px solid rgba(59, 130, 246, 0.3)"
              boxShadow="0 20px 60px 0 rgba(59, 130, 246, 0.2)"
              overflow="hidden"
              position="relative"
              _hover={{
                borderColor: "rgba(59, 130, 246, 0.5)",
                boxShadow: "0 25px 80px 0 rgba(59, 130, 246, 0.3)"
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
                  <Text color="#3b82f6" fontWeight="bold" fontSize="lg" mb={3}>
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
                      <Box w={2} h={2} borderRadius="full" bg="#3b82f6" />
                      <Text fontSize="sm" color="white">Fokus auf's Wesentliche</Text>
                    </HStack>
                    <HStack gap={2}>
                      <Box w={2} h={2} borderRadius="full" bg="#3b82f6" />
                      <Text fontSize="sm" color="white">Strategien wirklich verstehen</Text>
                    </HStack>
                    <HStack gap={2}>
                      <Box w={2} h={2} borderRadius="full" bg="#3b82f6" />
                      <Text fontSize="sm" color="white">Lernen wann und wo du willst</Text>
                    </HStack>
                  </VStack>
                </Box>
                <Box flexShrink={0} display={{ base: "none", md: "block" }}>
                  <Box
                    w="120px"
                    h="120px"
                    bg="rgba(59, 130, 246, 0.1)"
                    borderRadius="xl"
                    border="1px solid rgba(59, 130, 246, 0.3)"
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
              border="2px solid rgba(59, 130, 246, 0.3)"
              boxShadow="0 20px 60px 0 rgba(59, 130, 246, 0.2)"
              overflow="hidden"
              position="relative"
              _hover={{
                borderColor: "rgba(59, 130, 246, 0.5)",
                boxShadow: "0 25px 80px 0 rgba(59, 130, 246, 0.3)"
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
                  <Text color="#3b82f6" fontWeight="bold" fontSize="lg" mb={3}>
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
                      <Box w={2} h={2} borderRadius="full" bg="#3b82f6" />
                      <Text fontSize="sm" color="white">Lernen & direkt anwenden</Text>
                    </HStack>
                    <HStack gap={2}>
                      <Box w={2} h={2} borderRadius="full" bg="#3b82f6" />
                      <Text fontSize="sm" color="white">Mehr Sicherheit im Trading</Text>
                    </HStack>
                    <HStack gap={2}>
                      <Box w={2} h={2} borderRadius="full" bg="#3b82f6" />
                      <Text fontSize="sm" color="white">Praxisnah</Text>
                    </HStack>
                  </VStack>
                </Box>
                <Box flexShrink={0} display={{ base: "none", md: "block" }}>
                  <Box
                    w="120px"
                    h="120px"
                    bg="rgba(59, 130, 246, 0.1)"
                    borderRadius="xl"
                    border="1px solid rgba(59, 130, 246, 0.3)"
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
              border="2px solid rgba(59, 130, 246, 0.4)"
              boxShadow="0 20px 60px 0 rgba(59, 130, 246, 0.25)"
              overflow="hidden"
              position="relative"
              _hover={{
                borderColor: "rgba(59, 130, 246, 0.6)",
                boxShadow: "0 25px 80px 0 rgba(59, 130, 246, 0.4)"
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
                  <Text color="#3b82f6" fontWeight="bold" fontSize="lg" mb={3}>
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
                      <Box w={2} h={2} borderRadius="full" bg="#3b82f6" />
                      <Text fontSize="sm" color="white">Konstanz & Kontrolle</Text>
                    </HStack>
                    <HStack gap={2}>
                      <Box w={2} h={2} borderRadius="full" bg="#3b82f6" />
                      <Text fontSize="sm" color="white">Mehr Freiheit durch Ergebnisse</Text>
                    </HStack>
                    <HStack gap={2}>
                      <Box w={2} h={2} borderRadius="full" bg="#3b82f6" />
                      <Text fontSize="sm" color="white">Klarer Weg zu deinem Ziel</Text>
                    </HStack>
                  </VStack>
                </Box>
                <Box flexShrink={0} display={{ base: "none", md: "block" }}>
                  <Box
                    w="120px"
                    h="120px"
                    bg="rgba(59, 130, 246, 0.15)"
                    borderRadius="xl"
                    border="1px solid rgba(59, 130, 246, 0.4)"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    boxShadow="0 8px 24px rgba(59, 130, 246, 0.2)"
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
        py={{ base: 16, md: 20 }}
      >
        <VStack gap={12} maxW="6xl" mx="auto" position="relative" zIndex={1}>
          <VStack gap={4} textAlign="center">
            <Text 
              color="#3b82f6" 
              fontWeight="bold" 
              fontSize="sm" 
              textTransform="uppercase"
              letterSpacing="wider"
              textShadow="0 0 10px rgba(59, 130, 246, 0.5)"
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
                background="linear-gradient(90deg, rgba(59, 130, 246, 0.3), transparent 95%)" 
                color="#3b82f6" 
                px={3} 
                py={1} 
                borderRadius="md" 
                fontWeight="bold" 
                display="inline-block"
                border="1px solid rgba(59, 130, 246, 0.4)"
                boxShadow="0 0 20px rgba(59, 130, 246, 0.3)"
                textShadow="0 0 15px rgba(59, 130, 246, 0.6)"
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
              border="1px solid rgba(59, 130, 246, 0.3)"
              boxShadow="0 8px 32px 0 rgba(59, 130, 246, 0.15)"
              p={6}
              textAlign="center"
              _hover={{
                transform: "translateY(-4px)",
                boxShadow: "0 12px 40px 0 rgba(59, 130, 246, 0.25)",
                borderColor: "rgba(59, 130, 246, 0.4)"
              }}
              transition="all 0.3s ease"
            >
              <Box
                w="60px"
                h="60px"
                bg="rgba(59, 130, 246, 0.15)"
                borderRadius="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
                mx="auto"
                mb={4}
                border="1px solid rgba(59, 130, 246, 0.3)"
              >
                <Text fontSize="2xl">👥</Text>
              </Box>
              <Text 
                fontWeight="bold" 
                fontSize="lg" 
                color="#3b82f6" 
                mb={2}
                textShadow="0 0 8px rgba(59, 130, 246, 0.4)"
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
              border="1px solid rgba(59, 130, 246, 0.3)"
              boxShadow="0 8px 32px 0 rgba(59, 130, 246, 0.15)"
              p={6}
              textAlign="center"
              _hover={{
                transform: "translateY(-4px)",
                boxShadow: "0 12px 40px 0 rgba(59, 130, 246, 0.25)",
                borderColor: "rgba(59, 130, 246, 0.4)"
              }}
              transition="all 0.3s ease"
            >
              <Box
                w="60px"
                h="60px"
                bg="rgba(59, 130, 246, 0.15)"
                borderRadius="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
                mx="auto"
                mb={4}
                border="1px solid rgba(59, 130, 246, 0.3)"
              >
                <Text fontSize="2xl">🛠️</Text>
              </Box>
              <Text 
                fontWeight="bold" 
                fontSize="lg" 
                color="#3b82f6" 
                mb={2}
                textShadow="0 0 8px rgba(59, 130, 246, 0.4)"
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
              border="1px solid rgba(59, 130, 246, 0.3)"
              boxShadow="0 8px 32px 0 rgba(59, 130, 246, 0.15)"
              p={6}
              textAlign="center"
              _hover={{
                transform: "translateY(-4px)",
                boxShadow: "0 12px 40px 0 rgba(59, 130, 246, 0.25)",
                borderColor: "rgba(59, 130, 246, 0.4)"
              }}
              transition="all 0.3s ease"
            >
              <Box
                w="60px"
                h="60px"
                bg="rgba(59, 130, 246, 0.15)"
                borderRadius="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
                mx="auto"
                mb={4}
                border="1px solid rgba(59, 130, 246, 0.3)"
              >
                <Text fontSize="2xl">🎓</Text>
              </Box>
              <Text 
                fontWeight="bold" 
                fontSize="lg" 
                color="#3b82f6" 
                mb={2}
                textShadow="0 0 8px rgba(59, 130, 246, 0.4)"
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
              border="1px solid rgba(59, 130, 246, 0.3)"
              boxShadow="0 8px 32px 0 rgba(59, 130, 246, 0.15)"
              p={6}
              textAlign="center"
              _hover={{
                transform: "translateY(-4px)",
                boxShadow: "0 12px 40px 0 rgba(59, 130, 246, 0.25)",
                borderColor: "rgba(59, 130, 246, 0.4)"
              }}
              transition="all 0.3s ease"
            >
              <Box
                w="60px"
                h="60px"
                bg="rgba(59, 130, 246, 0.15)"
                borderRadius="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
                mx="auto"
                mb={4}
                border="1px solid rgba(59, 130, 246, 0.3)"
              >
                <Text fontSize="2xl">🎥</Text>
              </Box>
              <Text 
                fontWeight="bold" 
                fontSize="lg" 
                color="#3b82f6" 
                mb={2}
                textShadow="0 0 8px rgba(59, 130, 246, 0.4)"
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

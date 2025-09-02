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
  CheckCircle,
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
            <Link href="/Produkte/SNTTRADES-AUSBILDUNG">
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
      
      <ReviewMarquee />
      
      <FounderSection
        image="/personal/emre.jpg"
        name="Hi, Ich bin Emre Kopal 👋"
        subtitle="MEET THE FOUNDER"
        description={
          <Box fontSize="md" color="gray.700">
            <Text mb={4}>
              Meine Reise begann nach dem <Text as="span" fontWeight="semibold">Abitur</Text> – ursprünglich wollte ich eine eigene <Text as="span" fontWeight="semibold">Brand aufbauen</Text>. Doch als ich das enorme <Text as="span" fontWeight="semibold">Potenzial im Trading</Text> erkannt habe, habe ich alles andere losgelassen und mich zu <Text as="span" fontWeight="semibold">100 % dem Trading</Text> gewidmet.
            </Text>
            
            <Text mb={4}>
              Die ersten Jahre waren intensiv. Ich habe nicht nur die <Text as="span" fontWeight="semibold">Märkte studiert</Text>, sondern auch mich selbst – <Text as="span" fontWeight="semibold">mentale Stärke, Disziplin und Unternehmertum</Text> wurden zu Schlüsselkomponenten auf meinem Weg.
            </Text>
            
            <Text fontSize="lg" fontWeight="semibold" mb={3} mt={6}>
              3 Jahre später...
            </Text>
            
            <VStack align="start" gap={2} mb={6}>
              <Text>• Vollzeit <Text as="span" fontWeight="semibold">Daytrader, Scalper & Investor</Text></Text>
              <Text>• <Text as="span" fontWeight="semibold">Mehrfach funded</Text> bei verschiedenen Propfirms mit <Text as="span" fontWeight="semibold">mehreren tausenden $ von Auszahlungen</Text></Text>
              <Text>• Über <Text as="span" fontWeight="semibold">10.000 Follower</Text> auf Social Media</Text>
              <Text>• Aufbau einer <Text as="span" fontWeight="semibold">großen geschlossenen Community</Text> mit echten Gleichgesinnten</Text>
              <Text>• Gemeinsam mit Ali über <Text as="span" fontWeight="semibold">1.000 Menschen im Trading ausgebildet</Text></Text>
              <Text>• Unsere Mission: anderen zeigen, wie sie strukturiert und professionell ihre eigene Trading-Reise starten können</Text>
            </VStack>
            
            <Text mb={4}>
              Wenn du das Ganze ernst meinst und bereit bist, <Text as="span" fontWeight="semibold">in dich selbst zu investieren</Text> – dann bist du hier genau richtig.
            </Text>
            
            <Text mb={4}>
              Hier findest du kein Bla-Bla, sondern <Text as="span" fontWeight="semibold">echte Ergebnisse, echte Strategien und ein echtes Netzwerk</Text>.
            </Text>
            
            <Text fontWeight="semibold">
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
      <FounderSection
        image="/personal/ali.jpg"
        name="Hi, ich bin Ali Duhoky 👋"
        subtitle="MEET THE CO-FOUNDER"
        description={
          <Box fontSize="md" color="gray.700">
            <Text mb={4}>
              Meine Reise begann mit einem einzigen Ziel: <Text as="span" fontWeight="semibold">unabhängig werden</Text> – <Text as="span" fontWeight="semibold">finanziell, zeitlich und emotional</Text>.
            </Text>
            
            <Text mb={4}>
              <Text as="span" fontWeight="semibold">Trading</Text> war für mich von Anfang an mehr als nur <Text as="span" fontWeight="semibold">Charts und Zahlen</Text>. Es war der Weg, mich selbst herauszufordern, <Text as="span" fontWeight="semibold">Verantwortung zu übernehmen</Text> und anderen zu beweisen, dass es möglich ist, aus eigener Kraft Großes zu erreichen.
            </Text>
            
            <Text mb={4}>
              Ich habe nicht nur den Markt studiert, sondern auch mich selbst. <Text as="span" fontWeight="semibold">Disziplin, Geduld, mentale Stärke</Text> – all das wurde zur Grundlage meines Erfolgs.
            </Text>
            
            <Text mb={4}>
              Heute gebe ich das weiter, was ich selbst gelernt habe.
            </Text>
            
            <Text mb={4}>
              Wenn du kein Interesse an Oberflächlichkeit hast. Wenn du Trading nicht als „schnell reich"-Versuch, sondern als <Text as="span" fontWeight="semibold">echtes Handwerk</Text> sehen willst. Wenn du bereit bist, Verantwortung für dein Leben zu übernehmen – dann bist du hier genau richtig.
            </Text>
            
            <Text fontWeight="semibold">
              Dein Weg beginnt nicht morgen. Dein Weg beginnt jetzt.
            </Text>
          </Box>
        }
        checklist={[
          'Vollzeit Daytrader mit Fokus auf strukturierte Volumenanalyse',
          'Gründer eines professionellen Mentoring-Programms für Anfänger und Fortgeschrittene',
          'Wir helfen unseren Schülern, ihr eigenes profitables Setup zu finden',
          'Wöchentliche Live-Marktanalysen & Live-Trading-Sessions',
          'Entwicklung von Trading-Strategien mit Tiefgang, inklusive psychologischer Werkzeuge',
          'Aufbau einer starken Community, die sich gegenseitig pusht und gemeinsam wächst',
          'Gemeinsam mit Emre über 1.000 Menschen im Trading ausgebildet'
        ]}
        highlights={["as seen in"]}
        reverse
      />
      <CourseOverviewSection />
      <div id="winnings">
        <StudentWinsSection />
      </div>
      {/* Premium Produkte Section (aktualisiert) */}
      <Section size="lg" bg="bg" mt={{ base: 12, md: 12 }}>
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
              overflow="visible"
              position="relative"
            >
              {/* Badge */}
              <Box
                position="absolute"
                top={4}
                right={4}
                px={4}
                py={2}
                fontSize="sm"
                fontWeight="bold"
                borderRadius="xl"
                color="#22c55e"
                bg="rgba(34, 197, 94, 0.35)"
                border="2px solid #22c55e"
                boxShadow="0 4px 24px 0 rgba(34,197,94,0.25), 0 1.5px 8px 0 rgba(0,0,0,0.10)"
                backdropFilter="blur(12px)"
                letterSpacing="wider"
                zIndex={10}
                style={{
                  textShadow: '0 2px 8px rgba(34,197,94,0.5)',
                  WebkitBackdropFilter: 'blur(12px)'
                }}
              >
                EXKLUSIVES ANGEBOT
              </Box>
              {/* Bild */}
              <Box 
                w="100%" 
                h="200px" 
                borderRadius="lg" 
                mb={4}
                mt="-3"
                overflow="hidden" 
                display="flex" 
                alignItems="center" 
                justifyContent="center"
              >
                <img 
                  src="/assets/PB-1.png" 
                  alt="SNTTRADES Trading Ausbildung" 
                  style={{ 
                    width: '120%', 
                    height: '120%', 
                    objectFit: 'contain', 
                    borderRadius: '0.5rem' 
                  }} 
                />
              </Box>
              <Text fontWeight="bold" color="gray.400" fontSize="sm" mb={2}>SNTTRADES</Text>
              <Heading as="h2" size="2xl" mb={2}>SNTTRADES AUSBILDUNG</Heading>
              <Text mb={4}>Lerne alles, was ich in über 6 Jahren Trading- und Investment-Erfahrung gesammelt habe – in einem strukturierten, selbstbestimmten Ausbildungsprozess von Anfänger bis Profi.</Text>
              <Stack direction="row" align="baseline" gap="1" mb={2}>
                <Text as="s" color="red.400" fontWeight="bold" fontSize="lg">567€</Text>
                <Text 
                  color="green.400" 
                  fontWeight="bold" 
                  fontSize="4xl"
                  textShadow="0 0 8px rgba(72, 187, 120, 0.6)"
                >
                  367€
                </Text>
              </Stack>
              <Text fontSize="xs" color="gray.400" mb={4}>*Vorübergehendes Sonderangebot</Text>
              <ul style={{ listStyle: "disc", paddingLeft: 20, margin: 0, textAlign: "left", marginBottom: 24 }}>
                <li style={{ marginBottom: 8 }}>Umfassendes Video-Training auf Abruf</li>
                <li style={{ marginBottom: 8 }}>Live-Mentoring & Umsetzung</li>
                <li style={{ marginBottom: 8 }}>Trading meistern & echte Ergebnisse erzielen</li>
                <li style={{ marginBottom: 8 }}>interaktive Community unter Gleichgesinnten</li>
                <li style={{ marginBottom: 8 }}>Trading-Tools & Software</li>
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
              position="relative"
            >
              {/* Badge */}
              <Box
                position="absolute"
                top={4}
                right={4}
                px={4}
                py={2}
                fontSize="sm"
                fontWeight="bold"
                borderRadius="xl"
                color="blue"
                bg="rgba(59, 130, 246, 0.35)"
                border="2px solid #3b82f6"
                boxShadow="0 4px 24px 0 rgba(59,130,246,0.25), 0 1.5px 8px 0 rgba(0,0,0,0.10)"
                backdropFilter="blur(12px)"
                letterSpacing="wider"
                zIndex={10}
                style={{
                  textShadow: '0 2px 8px rgba(59,130,246,0.5)',
                  WebkitBackdropFilter: 'blur(12px)'
                }}
              >
                KOSTENLOS
              </Box>
              {/* Bild */}
              <Box w="100%" h="180px" bg="gray.100" borderRadius="lg" mb={4} overflow="hidden" display="flex" alignItems="center" justifyContent="center">
                <img src="/assets/V4.png" alt="SNTTRADES Ressourcen Bibliothek" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '0.5rem' }} />
              </Box>
              <Text fontWeight="bold" color="gray.400" fontSize="sm" mb={2}>SNTTRADES</Text>
              <Heading as="h2" size="lg" mb={2}>SNTTRADES Ressourcen Bibliothek</Heading>
              <Text mb={4}>Sichere dir einen Einblick in unsere Trading-Ausbildung und Zugang zu leistungsstarken Tools & Software, einer kostenlosen Grundausbildung und weiteren exklusiven Inhalten.</Text>
              <ul style={{ listStyle: "disc", paddingLeft: 20, margin: 0, textAlign: "left", marginBottom: 24 }}>
                <li style={{ marginBottom: 8 }}>Kostenloser Trading-Kurs</li>
                <li style={{ marginBottom: 8 }}>Tools & Trading-Software</li>
                <li style={{ marginBottom: 8 }}>und vieles mehr...</li>
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

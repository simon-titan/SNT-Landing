import { Heading, Stack, VStack, HStack, Text, SimpleGrid, Box, Image } from "@chakra-ui/react";
import { Section } from "@/components/layout/section";
import { generateMetadata } from "@/utils/metadata";
import { UserCircle, CreditCard, Palette, EnvelopeSimple, Lifebuoy, Cube, CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { ReviewMarquee } from "@/components/ui/ReviewMarquee";
import { ResultsMarquee } from "@/components/ui/ResultsMarquee";
import { FounderSection } from "@/components/ui/FounderSection";
import { CourseOverviewSection } from "@/components/ui/CourseOverviewSection";
import { SntPremiumPricing } from "@/components/ui/snt-premium-pricing";
import { MobilePricingFooter } from "@/components/ui/mobile-pricing-footer";
import { ProductPageSection } from "@/components/ui/product-page-section";
export const metadata = generateMetadata({
    title: "SNTTRADES - DEIN WEG ZUM PROFITABLEN TRADER",
    description: "Über 6+ Jahre Markterfahrung gebündelt in einem klar strukturierten Kurs – für deinen Weg zum selbstbestimmten Trader.",
});
export default async function Page() {
    return (<>
      {/* Product Page Section - Neue Hero-Section */}
      <ProductPageSection />
      
      {/* Mobile Pricing Footer */}
      <MobilePricingFooter />
      
      
      {/* Glow Trenner */}
      <Box w="100%" h="2px" background="linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.6), transparent)" boxShadow="0 0 20px rgba(59, 130, 246, 0.4)"/>
      
      {/* Project 30 Pricing Section - Direkt unter Community Stats */}
    
      
      {/* Glow Trenner */}
      <Box w="100%" h="2px" background="linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.6), transparent)" boxShadow="0 0 20px rgba(59, 130, 246, 0.4)"/>
      
      <ReviewMarquee />
      
      {/* Glow Trenner */}
      <Box w="100%" h="2px" background="linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.6), transparent)" boxShadow="0 0 20px rgba(59, 130, 246, 0.4)"/>
      
      <FounderSection image="/personal/emre-2.jpg" name={<Box
        as="span"
        background="linear-gradient(90deg, rgba(59, 130, 246,0.28), transparent 95%)"
        color="white"
        px={2}
        py={1}
        borderRadius="md"
        fontWeight="bold"
        display="inline-block"
        border="1px solid rgba(59, 130, 246, 0.35)"
        boxShadow="0 0 0 1px rgba(59, 130, 246, 0.25) inset, 0 0 24px rgba(59, 130, 246, 0.25)"
        backdropFilter="blur(6px)"
      >
        Hi, Ich bin Emre
      </Box>} subtitle="MEET THE FOUNDER" description={<Box fontSize="md" color="white">
            <Text mb={4} lineHeight="1.6">
              Meine Reise begann nach dem Abitur – ursprünglich wollte ich eine eigene Brand aufbauen. Doch als ich das enorme Potenzial im Trading erkannt habe, habe ich alles andere losgelassen und mich zu 100 % dem Trading gewidmet.
            </Text>
            
            <Text mb={6} lineHeight="1.6">
              Die ersten Jahre waren intensiv. Ich habe nicht nur die Märkte studiert, sondern auch mich selbst – mentale Stärke, Disziplin und Unternehmertum wurden zu Schlüsselkomponenten auf meinem Weg.
            </Text>
            
            {/* "3 Jahre später" Bereich - Dezenter */}
            <Box my={6} p={5} bg="rgba(255, 255, 255, 0.03)" borderRadius="lg" border="1px solid rgba(255, 255, 255, 0.1)">
              <Text fontSize="md" fontWeight="medium" color="white" mb={4} textAlign="center">
                <Box
                  as="span"
                  background="linear-gradient(90deg, rgba(59, 130, 246,0.28), transparent 95%)"
                  color="white"
                  px={2}
                  py={1}
                  borderRadius="md"
                  fontWeight="bold"
                  display="inline-block"
                  border="1px solid rgba(59, 130, 246, 0.35)"
                  boxShadow="0 0 0 1px rgba(59, 130, 246, 0.25) inset, 0 0 24px rgba(59, 130, 246, 0.25)"
                  backdropFilter="blur(6px)"
                >
                  3 Jahre später...
                </Box>
              </Text>
            
              <VStack align="start" gap={2.5}>
                <HStack align="center" gap={3}>
                  <Box 
                    flexShrink={0} 
                    width="20px" 
                    height="20px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <CheckCircle 
                      size={20} 
                      color="white" 
                      weight="fill" 
                      style={{ 
                        minWidth: "20px", 
                        minHeight: "20px",
                        width: "20px",
                        height: "20px"
                      }} 
                    />
                  </Box>
                  <Text color="gray.300" fontSize="sm">
                    Vollzeit Daytrader, Scalper & Investor
                  </Text>
                </HStack>
                <HStack align="center" gap={3}>
                  <Box 
                    flexShrink={0} 
                    width="20px" 
                    height="20px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <CheckCircle 
                      size={20} 
                      color="white" 
                      weight="fill" 
                      style={{ 
                        minWidth: "20px", 
                        minHeight: "20px",
                        width: "20px",
                        height: "20px"
                      }} 
                    />
                  </Box>
                  <Text color="gray.300" fontSize="sm">
                    Mehrfach funded bei verschiedenen Propfirms mit mehreren tausenden $ von Auszahlungen
                  </Text>
                </HStack>
                <HStack align="center" gap={3}>
                  <Box 
                    flexShrink={0} 
                    width="20px" 
                    height="20px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <CheckCircle 
                      size={20} 
                      color="white" 
                      weight="fill" 
                      style={{ 
                        minWidth: "20px", 
                        minHeight: "20px",
                        width: "20px",
                        height: "20px"
                      }} 
                    />
                  </Box>
                  <Text color="gray.300" fontSize="sm">
                    Über 10.000 Follower auf Social Media
                  </Text>
                </HStack>
                <HStack align="center" gap={3}>
                  <Box 
                    flexShrink={0} 
                    width="20px" 
                    height="20px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <CheckCircle 
                      size={20} 
                      color="white" 
                      weight="fill" 
                      style={{ 
                        minWidth: "20px", 
                        minHeight: "20px",
                        width: "20px",
                        height: "20px"
                      }} 
                    />
                  </Box>
                  <Text color="gray.300" fontSize="sm">
                    Aufbau einer großen geschlossenen Community mit echten Gleichgesinnten
                  </Text>
                </HStack>
                <HStack align="center" gap={3}>
                  <Box 
                    flexShrink={0} 
                    width="20px" 
                    height="20px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <CheckCircle 
                      size={20} 
                      color="white" 
                      weight="fill" 
                      style={{ 
                        minWidth: "20px", 
                        minHeight: "20px",
                        width: "20px",
                        height: "20px"
                      }} 
                    />
                  </Box>
                  <Text color="gray.300" fontSize="sm">
                    Gemeinsam mit Ali über 1.000 Menschen im Trading ausgebildet
                  </Text>
                </HStack>
                 <Text color="white" fontSize="sm" fontWeight="bold" textAlign="left">
                   <Box
                     as="span"
                     background="linear-gradient(90deg, rgba(59, 130, 246,0.28), transparent 95%)"
                     color="white"
                     px={2}
                     py={1}
                     borderRadius="md"
                     fontWeight="bold"
                     display="inline-block"
                     border="1px solid rgba(59, 130, 246, 0.35)"
                     boxShadow="0 0 0 1px rgba(59, 130, 246, 0.25) inset, 0 0 24px rgba(59, 130, 246, 0.25)"
                     backdropFilter="blur(6px)"
                   >
                     UNSERE MISSION : anderen zeigen, wie sie strukturiert und professionell ihre eigene Trading-Reise starten können !
                   </Box>
                 </Text>
            </VStack>
            </Box>
            
            <Text mb={4} lineHeight="1.6">
              Wenn du das Ganze ernst meinst und bereit bist, in dich selbst zu investieren – dann bist du hier genau richtig.
            </Text>
            
            <Text mb={4} lineHeight="1.6">
              Hier findest du kein Bla-Bla, sondern echte Ergebnisse, echte Strategien und ein echtes Netzwerk.
            </Text>
            
            <Text fontWeight="bold" fontSize="lg" color="white">
              Starte jetzt – dein Trading-Weg beginnt hier.
            </Text>
          </Box>} checklist={[
            'Spezialist für Scalping und Daytrading Strategien',
            'Experte in Marktpsychologie und Risikomanagement',
            'Gründer einer professionellen Trading-Community',
            'Mentor für über 1.000 erfolgreiche Trader',
            'Content Creator mit großer Social Media Reichweite',
            'Fokus auf nachhaltige und profitable Trading-Systeme'
        ]} highlights={["as seen in"]}/>
      
      {/* Ali Founder Section */}
      <FounderSection image="/personal/ali-2.jpeg" name={<Box
        as="span"
        background="linear-gradient(90deg, rgba(59, 130, 246,0.28), transparent 95%)"
        color="white"
        px={2}
        py={1}
        borderRadius="md"
        fontWeight="bold"
        display="inline-block"
        border="1px solid rgba(59, 130, 246, 0.35)"
        boxShadow="0 0 0 1px rgba(59, 130, 246, 0.25) inset, 0 0 24px rgba(59, 130, 246, 0.25)"
        backdropFilter="blur(6px)"
      >
        Hi, ich bin Ali
      </Box>} subtitle="CO-FOUNDER" description={<Box fontSize="md" color="white">
            <Text mb={4} lineHeight="1.6">
              Meine Reise begann früh. Schon mit 16 war mir klar, dass ich mehr aus meinem Leben rausholen möchte als den klassischen Weg. Also habe ich angefangen zu suchen – und bin dabei oft gescheitert.
            </Text>
            
            <Text mb={4} lineHeight="1.6">
              Ich habe verschiedene Business-Modelle ausprobiert, darunter E-Commerce, Kaltakquise und Webdesign. Nicht, weil ich planlos war, sondern weil ich verstehen wollte, wie Geld wirklich funktioniert.
            </Text>
            
            <Text mb={4} lineHeight="1.6">
              Irgendwann habe ich gemerkt: Trading ist für mich der klarste und direkteste Weg, Geld zu verdienen. Kein Team, keine Abhängigkeiten – nur Entscheidungen, Disziplin und Verantwortung.
            </Text>
            
            <Text mb={4} lineHeight="1.6">
              Heute bin ich profitabel und lebe vom Trading. Doch der größte Gewinn war nicht das Geld, sondern die persönliche Entwicklung: mentale Stärke, Struktur und Konsequenz.
            </Text>
            
            <Text fontWeight="bold" fontSize="lg" color="white">
              Ich kenne das Gefühl, keinen klaren Plan zu haben. Genau deshalb weiß ich, wie wichtig es ist, dranzubleiben – auch dann, wenn noch niemand an dich glaubt.
            </Text>
          </Box>} checklist={[
            'Experte für strukturierte Trading-Systeme',
            'Spezialist in persönlicher Entwicklung & Mindset',
            'Erfahrung in verschiedenen Business-Modellen',
            'Fokus auf Disziplin und mentale Stärke',
            'Mentor für zielstrebige Trader',
            'Verfechter von Eigenverantwortung im Trading'
        ]} highlights={["co-founder"]} reverse={true}/>
        
      <CourseOverviewSection />
      
      {/* Glow Trenner */}
      <Box w="100%" h="2px" background="linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.6), transparent)" boxShadow="0 0 20px rgba(59, 130, 246, 0.4)"/>
      
      {/* Trading Ausbildung Vorteile Section */}
      <Section size="lg" py={{ base: 16, md: 24 }}>
        <VStack gap={12} maxW="6xl" mx="auto" position="relative" zIndex={1}>
          <VStack gap={4} textAlign="center">
            <Text color="#3b82f6" fontWeight="bold" fontSize="sm" textTransform="uppercase" letterSpacing="wider" textShadow="0 0 10px rgba(59, 130, 246, 0.5)">
              So funktioniert's
            </Text>
            <Heading fontSize={{ base: "2xl", md: "4xl" }} fontWeight="bold" color="white" textShadow="0 2px 4px rgba(0,0,0,0.3)">
              Bring dein Trading aufs{' '}
              <Box as="span" background="linear-gradient(90deg, rgba(59, 130, 246, 0.3), transparent 95%)" color="white" px={3} py={1} borderRadius="md" fontWeight="bold" display="inline-block" border="1px solid rgba(59, 130, 246, 0.4)" boxShadow="0 0 20px rgba(59, 130, 246, 0.3)" textShadow="0 0 15px rgba(59, 130, 246, 0.6)">
                nächste Level.
              </Box>
            </Heading>
          </VStack>
          
          <VStack gap={8} w="full">
            {/* Phase 1 */}
            <Box w="full" bg="rgba(10, 14, 10, 0.8)" backdropFilter="blur(20px)" borderRadius="2xl" border="2px solid rgba(59, 130, 246, 0.3)" boxShadow="0 20px 60px 0 rgba(59, 130, 246, 0.2)" overflow="hidden" position="relative" _hover={{
            borderColor: "rgba(59, 130, 246, 0.5)",
            boxShadow: "0 25px 80px 0 rgba(59, 130, 246, 0.3)"
        }} transition="all 0.3s ease">
              <Stack direction={{ base: "column", md: "row" }} align="center" p={8} gap={8}>
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
                      <Box w={2} h={2} borderRadius="full" bg="#3b82f6"/>
                      <Text fontSize="sm" color="white">Fokus auf's Wesentliche</Text>
                    </HStack>
                    <HStack gap={2}>
                      <Box w={2} h={2} borderRadius="full" bg="#3b82f6"/>
                      <Text fontSize="sm" color="white">Strategien wirklich verstehen</Text>
                    </HStack>
                    <HStack gap={2}>
                      <Box w={2} h={2} borderRadius="full" bg="#3b82f6"/>
                      <Text fontSize="sm" color="white">Lernen wann und wo du willst</Text>
                    </HStack>
                  </VStack>
                </Box>
                <Box flexShrink={0} display={{ base: "none", md: "block" }}>
                  <Box w="180px" h="180px" borderRadius="xl" overflow="hidden">
                    <Image
                      src="/assets/VORTEILE/V1.png"
                      alt="Phase 1"
                      w="100%"
                      h="100%"
                      objectFit="cover"
                    />
                  </Box>
                </Box>
              </Stack>
            </Box>
            
            {/* Phase 2 */}
            <Box w="full" bg="rgba(10, 14, 10, 0.8)" backdropFilter="blur(20px)" borderRadius="2xl" border="2px solid rgba(59, 130, 246, 0.3)" boxShadow="0 20px 60px 0 rgba(59, 130, 246, 0.2)" overflow="hidden" position="relative" _hover={{
            borderColor: "rgba(59, 130, 246, 0.5)",
            boxShadow: "0 25px 80px 0 rgba(59, 130, 246, 0.3)"
        }} transition="all 0.3s ease">
              <Stack direction={{ base: "column", md: "row-reverse" }} align="center" p={8} gap={8}>
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
                      <Box w={2} h={2} borderRadius="full" bg="#3b82f6"/>
                      <Text fontSize="sm" color="white">Lernen & direkt anwenden</Text>
                    </HStack>
                    <HStack gap={2}>
                      <Box w={2} h={2} borderRadius="full" bg="#3b82f6"/>
                      <Text fontSize="sm" color="white">Mehr Sicherheit im Trading</Text>
                    </HStack>
                    <HStack gap={2}>
                      <Box w={2} h={2} borderRadius="full" bg="#3b82f6"/>
                      <Text fontSize="sm" color="white">Praxisnah</Text>
                    </HStack>
                  </VStack>
                </Box>
                <Box flexShrink={0} display={{ base: "none", md: "block" }}>
                  <Box w="180px" h="180px" borderRadius="xl" overflow="hidden">
                    <Image
                      src="/assets/VORTEILE/V2.png"
                      alt="Phase 2"
                      w="100%"
                      h="100%"
                      objectFit="cover"
                    />
                  </Box>
                </Box>
              </Stack>
            </Box>
            
            {/* Phase 3 */}
            <Box w="full" bg="rgba(10, 14, 10, 0.8)" backdropFilter="blur(20px)" borderRadius="2xl" border="2px solid rgba(59, 130, 246, 0.4)" boxShadow="0 20px 60px 0 rgba(59, 130, 246, 0.25)" overflow="hidden" position="relative" _hover={{
            borderColor: "rgba(59, 130, 246, 0.6)",
            boxShadow: "0 25px 80px 0 rgba(59, 130, 246, 0.4)"
        }} transition="all 0.3s ease">
              <Stack direction={{ base: "column", md: "row" }} align="center" p={8} gap={8}>
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
                      <Box w={2} h={2} borderRadius="full" bg="#3b82f6"/>
                      <Text fontSize="sm" color="white">Konstanz & Kontrolle</Text>
                    </HStack>
                    <HStack gap={2}>
                      <Box w={2} h={2} borderRadius="full" bg="#3b82f6"/>
                      <Text fontSize="sm" color="white">Mehr Freiheit durch Ergebnisse</Text>
                    </HStack>
                    <HStack gap={2}>
                      <Box w={2} h={2} borderRadius="full" bg="#3b82f6"/>
                      <Text fontSize="sm" color="white">Klarer Weg zu deinem Ziel</Text>
                    </HStack>
                  </VStack>
                </Box>
                <Box flexShrink={0} display={{ base: "none", md: "block" }}>
                  <Box w="180px" h="180px" borderRadius="xl" overflow="hidden">
                    <Image
                      src="/assets/VORTEILE/V3.png"
                      alt="Phase 3"
                      w="100%"
                      h="100%"
                      objectFit="cover"
                    />
                  </Box>
                </Box>
              </Stack>
            </Box>
          </VStack>
        </VStack>
      </Section>
      
      
      


      
    </>);
}


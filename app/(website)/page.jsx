import { VStack, HStack, Text, Box } from "@chakra-ui/react";
import { generateMetadata } from "@/utils/metadata";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { ReviewMarquee } from "@/components/ui/ReviewMarquee";
import { FounderSection } from "@/components/ui/FounderSection";
import { CourseOverviewSection } from "@/components/ui/CourseOverviewSection";
import { MobilePricingFooter } from "@/components/ui/mobile-pricing-footer";
import { ProductPageSection } from "@/components/ui/product-page-section";
import { LandingPageTracker } from "@/components/tracking/LandingPageTracker";
export const metadata = generateMetadata({
    title: "SNTTRADES - DEIN WEG ZUM PROFITABLEN TRADER",
    description: "Über 6+ Jahre Markterfahrung gebündelt in einem klar strukturierten Kurs – für deinen Weg zum selbstbestimmten Trader.",
});
export default async function Page() {
    return (<>
      <LandingPageTracker slug="standard" />
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
      
      {/* Ali Founder Section */}
      <FounderSection 
        image="/personal/ali-2.jpeg" 
        name={
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
            Hi, ich bin Ali
          </Box>
        } 
        subtitle="MEET THE FOUNDER" 
        description={
          <Box fontSize="md" color="white">
            <Text mb={4} lineHeight="1.6">
              Meine Reise begann früh. Schon mit 16 war mir klar, dass ich mehr aus meinem Leben rausholen möchte als den klassischen Weg. Also habe ich angefangen zu suchen – und bin dabei oft gescheitert.
            </Text>

            <Text mb={4} lineHeight="1.6">
              Ich habe verschiedene Business-Modelle ausprobiert, darunter E-Commerce, Kaltakquise und Webdesign. Nicht, weil ich planlos war, sondern weil ich verstehen wollte, wie Geld wirklich funktioniert.
            </Text>

            <Text mb={4} lineHeight="1.6">
              Irgendwann habe ich gemerkt: Trading ist für mich der klarste und direkteste Weg, Geld zu verdienen. Kein Team, keine Abhängigkeiten – nur Entscheidungen, Disziplin und Verantwortung.
            </Text>

            <Text mb={6} lineHeight="1.6">
              Heute bin ich profitabel und lebe vom Trading. Doch der größte Gewinn war nicht das Geld, sondern die persönliche Entwicklung: mentale Stärke, Struktur und Konsequenz.
            </Text>

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
                  Was wir gemeinsam aufgebaut haben
                </Box>
              </Text>
              <VStack align="start" gap={2.5}>
                {[
                  "Vollzeit Daytrader, Scalper & Investor",
                  "Mehrfach funded bei verschiedenen Propfirms mit mehreren tausenden $ Auszahlungen",
                  "Über 10.000 Follower auf Social Media",
                  "Aufbau einer großen geschlossenen Community mit echten Gleichgesinnten",
                  "Über 1.000 Menschen im Trading ausgebildet",
                ].map((item, idx) => (
                  <HStack key={idx} align="center" gap={3}>
                    <CheckCircle
                      size={20}
                      color="white"
                      weight="fill"
                      style={{ minWidth: "20px", minHeight: "20px", flexShrink: 0 }}
                    />
                    <Text color="gray.300" fontSize="sm">{item}</Text>
                  </HStack>
                ))}
                <Text color="white" fontSize="sm" fontWeight="bold" textAlign="left" mt={1}>
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
                    UNSERE MISSION: anderen zeigen, wie sie strukturiert und professionell ihre eigene Trading-Reise starten können!
                  </Box>
                </Text>
              </VStack>
            </Box>

            <Text fontWeight="bold" fontSize="lg" color="white">
              Ich kenne das Gefühl, keinen klaren Plan zu haben. Genau deshalb weiß ich, wie wichtig es ist, dranzubleiben – auch dann, wenn noch niemand an dich glaubt.
            </Text>
          </Box>
        } 
        checklist={[
          'Vollzeit Trader & Gründer von SNT',
          'Spezialist für Scalping und Daytrading Strategien',
          'Experte in persönlicher Entwicklung & Mindset',
          'Mehrfach funded bei verschiedenen Propfirms',
          'Mentor für über 1.000 erfolgreiche Trader',
          'Gründer einer professionellen Trading-Community',
        ]} 
        highlights={["meet the founder"]}
      />
        
      <CourseOverviewSection />
      
    </>);
}


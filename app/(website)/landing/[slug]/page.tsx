import { notFound } from "next/navigation";
import { supabaseAnon } from "@/lib/supabase/client";
import { ConfigurableProductPageSection } from "@/components/ui/configurable-product-page-section";
import { Section } from "@/components/layout/section";
import { generateMetadata as generateMetadataUtil } from "@/utils/metadata";
import { Box } from "@chakra-ui/react";
import { ReviewMarquee } from "@/components/ui/ReviewMarquee";
import { ResultsMarquee } from "@/components/ui/ResultsMarquee";
import { FounderSection } from "@/components/ui/FounderSection";
import { CourseOverviewSection } from "@/components/ui/CourseOverviewSection";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { Text, VStack, HStack, Heading, SimpleGrid, Stack } from "@chakra-ui/react";
import { MobilePricingFooter } from "@/components/ui/mobile-pricing-footer";
import { MobileFreeCourseFooter } from "@/components/ui/mobile-free-course-footer";
import { LandingPageTracker } from "@/components/tracking/LandingPageTracker";

interface LandingPageVersion {
  id: string;
  name: string;
  slug: string;
  title: string;
  vimeo_video_id: string;
  course_type: 'paid' | 'free';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

async function getLandingPageVersion(slug: string): Promise<LandingPageVersion | null> {
  try {
    console.log("🔍 Suche nach Landing Page Version mit Slug:", slug);
    console.log("🔧 Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Gesetzt" : "❌ Fehlt");
    console.log("🔑 Supabase Anon Key:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Gesetzt" : "❌ Fehlt");
    
    // Erste Abfrage: Nur aktive Versionen
    const { data, error } = await supabaseAnon
      .from("landing_page_versions")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    console.log("📊 Supabase Response (aktive):", { data, error });

    if (error) {
      console.error("❌ Supabase Fehler (aktive):", error);
      
      // Fallback 1: Versuche ohne is_active Filter
      console.log("🔄 Fallback: Versuche ohne is_active Filter...");
      const { data: fallbackData, error: fallbackError } = await supabaseAnon
        .from("landing_page_versions")
        .select("*")
        .eq("slug", slug)
        .single();
        
      console.log("📊 Fallback Response:", { fallbackData, fallbackError });
      
      if (fallbackError) {
        console.error("❌ Fallback Fehler:", fallbackError);
        
        // Fallback 2: Alle Versionen abrufen und filtern
        console.log("🔄 Fallback 2: Alle Versionen abrufen...");
        const { data: allData, error: allError } = await supabaseAnon
          .from("landing_page_versions")
          .select("*");
          
        console.log("📊 Alle Versionen Response:", { allData, allError });
        
        if (allError) {
          console.error("❌ Fehler beim Abrufen aller Versionen:", allError);
          return null;
        }
        
        if (allData && allData.length > 0) {
          console.log("📋 Verfügbare Slugs:", allData.map(v => v.slug));
          const foundVersion = allData.find(v => v.slug === slug);
          if (foundVersion) {
            console.log("✅ Version gefunden in allen Daten:", foundVersion);
            return foundVersion as LandingPageVersion;
          }
        }
        
        return null;
      }
      
      if (!fallbackData) {
        console.error("❌ Keine Fallback-Daten gefunden für Slug:", slug);
        return null;
      }
      
      console.log("✅ Fallback erfolgreich:", fallbackData);
      return fallbackData as LandingPageVersion;
    }

    if (!data) {
      console.error("❌ Keine Daten gefunden für Slug:", slug);
      return null;
    }

    console.log("✅ Landing Page Version gefunden:", data);
    return data as LandingPageVersion;
  } catch (error) {
    console.error("💥 Unerwarteter Fehler beim Abrufen der Landing Page Version:", error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const version = await getLandingPageVersion(slug);
  
  if (!version) {
    return generateMetadataUtil({
      title: "Seite nicht gefunden - SNTTRADES",
      description: "Die angeforderte Seite wurde nicht gefunden.",
    });
  }

  return generateMetadataUtil({
    title: `${version.title} - SNTTRADES`,
    description: version.course_type === 'paid' 
      ? "Über 6+ Jahre Markterfahrung gebündelt in einem klar strukturierten Kurs – für deinen Weg zum selbstbestimmten Trader."
      : "Starte deine Trading-Reise kostenlos mit unserem Einsteiger-Kurs und lerne die Grundlagen des profitablen Tradings.",
  });
}

export default async function LandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const version = await getLandingPageVersion(slug);

  if (!version) {
    notFound();
  }

  return (
    <>
       <LandingPageTracker slug={version.slug} />
       {/* CSS um Navbar auf Slug-Seiten auszublenden */}
       <style>{`
         /* Verstecke alle möglichen Navbar/Header Elemente */
         .navbar-container,
         nav,
         header,
         [data-testid="navbar"],
         .chakra-ui-navbar,
         .navbar,
         .header,
         [role="banner"] {
           display: none !important;
         }
         
         /* Verstecke spezifische CSS-Klasse */
         .css-xkj2dx {
           display: none !important;
         }
         
         /* Verstecke graue Balken und Container */
         .chakra-ui-container:first-child,
         .chakra-container:first-child,
         body > div:first-child > div:first-child:not(#configurable-product-page-section),
         body > div > div:first-child:not(#configurable-product-page-section) {
           display: none !important;
         }
         
         /* Entferne alle Top-Abstände */
         body {
           padding-top: 0 !important;
           margin-top: 0 !important;
           background: black !important;
         }
         
         main {
           padding-top: 0 !important;
           margin-top: 0 !important;
         }
         
         #__next {
           padding-top: 0 !important;
           margin-top: 0 !important;
         }
         
         .chakra-container {
           padding-top: 0 !important;
           margin-top: 0 !important;
         }
         
         /* Stelle sicher dass die erste Section ganz oben startet mit Top-Padding */
         #configurable-product-page-section {
           margin-top: 0 !important;
           padding-top: 2rem !important;
           position: relative;
           z-index: 1;
         }
         
         /* Verstecke alle Elemente vor der ersten Section */
         #configurable-product-page-section ~ * {
           position: relative;
           z-index: 10;
         }
         
         /* Stelle sicher dass Mobile Footer sichtbar bleibt und fixiert ist */
         [data-testid="mobile-footer"],
         .mobile-footer,
         .mobile-pricing-footer,
         .mobile-free-course-footer {
           display: block !important;
           position: fixed !important;
           bottom: 0 !important;
           left: 0 !important;
           right: 0 !important;
           z-index: 1000 !important;
           background: rgba(0, 0, 0, 0.95) !important;
           backdrop-filter: blur(20px) !important;
         }
         
         /* Stelle sicher dass der Footer über allem schwebt */
         body {
           padding-bottom: 120px !important;
         }
         
         /* Mobile Footer spezifische Styles */
         @media (max-width: 768px) {
           body {
             padding-bottom: 120px !important;
           }
         }
         
         /* Spezifische Selektoren für Layout-Container */
         .layout-container,
         .page-container,
         .app-container {
           padding-top: 0 !important;
           margin-top: 0 !important;
         }
       `}</style>
       
       {/* Mobile Footer - je nach Course Type - ÜBER allem anderen */}
       {version.course_type === 'paid' ? (
         <MobilePricingFooter />
       ) : (
         <MobileFreeCourseFooter />
       )}
       
       {/* Configurable Product Page Section */}
       <ConfigurableProductPageSection 
         title={version.title}
         vimeoVideoId={version.vimeo_video_id}
         courseType={version.course_type}
       />
      
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

            {/* Errungenschaften */}
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
                    <img
                      src="/assets/VORTEILE/V1.png"
                      alt="Phase 1"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
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
                    <img
                      src="/assets/VORTEILE/V2.png"
                      alt="Phase 2"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
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
                    <img
                      src="/assets/VORTEILE/V3.png"
                      alt="Phase 3"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </Box>
                </Box>
              </Stack>
            </Box>
          </VStack>
        </VStack>
      </Section>
    </>
  );
}
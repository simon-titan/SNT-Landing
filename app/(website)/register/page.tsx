"use client";

import { useState, useEffect } from "react";
import {
  Box,
  VStack,
  Heading,
  Text,
  Center,
  Button,
  Stack,
  HStack,
  SimpleGrid,
} from "@chakra-ui/react";
import { Section } from "@/components/layout/section";
import SntHero from "@/components/hero/snt-hero";
import { CheckCircle, ShieldCheck, Lightning, EnvelopeSimple, BookOpen, Wrench, ChatsCircle } from "@phosphor-icons/react/dist/ssr";
import { useRouter } from "next/navigation";
import { BrandedVimeoPlayer } from "@/components/ui/BrandedVimeoPlayer";
import { ResultsMarquee } from "@/components/ui/ResultsMarquee";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  useEffect(() => {
    // Progress Animation
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Outseta Widget laden
    const script = document.createElement("script");
    script.src = "https://cdn.outseta.com/assets/build/js/widget.js";
    script.async = true;
    script.onload = () => {
      // Widget initialisieren
      if (typeof window !== 'undefined' && (window as any).Outseta) {
        (window as any).Outseta.init();
      }
    };
    document.head.appendChild(script);

    // Success Handler für Registrierung
    const handleOutsetaSuccess = async (event: MessageEvent) => {
      if (event.data && event.data.type === 'outseta_success') {
        handleSuccess();
      }
    };

    window.addEventListener('message', handleOutsetaSuccess);

    // E-Mail-Extraktion für E-Mail-Liste
    const extractEmailOnSubmit = () => {
      const widgetContainer = document.getElementById('outseta-widget-container');
      if (!widgetContainer) return;

      const checkWidget = setInterval(() => {
        const inputs = widgetContainer.querySelectorAll('input');
        const buttons = widgetContainer.querySelectorAll('button, input[type="submit"]');
        
        if (inputs.length > 0 && buttons.length > 0) {
          clearInterval(checkWidget);
          
          buttons.forEach((button) => {
            button.addEventListener('click', () => {
              setTimeout(() => {
                const emailInputs = widgetContainer.querySelectorAll('input[type="email"], input[name*="email"], input[id*="email"]');
                const allInputs = widgetContainer.querySelectorAll('input');
                
                let foundEmail = '';
                
                emailInputs.forEach((input: any) => {
                  if (input.value && input.value.includes('@')) {
                    foundEmail = input.value;
                  }
                });
                
                if (!foundEmail) {
                  allInputs.forEach((input: any) => {
                    if (input.value && input.value.includes('@')) {
                      foundEmail = input.value;
                    }
                  });
                }
                
                if (foundEmail) {
                  localStorage.setItem('pendingEmailSubscription', foundEmail);
                }
              }, 100);
            });
          });
        }
      }, 1000);
      
      setTimeout(() => {
        clearInterval(checkWidget);
      }, 30000);
    };

    setTimeout(extractEmailOnSubmit, 2000);

    return () => {
      document.head.removeChild(script);
      window.removeEventListener('message', handleOutsetaSuccess);
    };
  }, []);

  const handleSuccess = () => {
    setIsLoading(true);
    // Kurze Verzögerung für UX
    setTimeout(() => {
      router.push("/thank-you");
    }, 1500);
  };

  return (
    <>
      <Box
        id="register-page"
        position="relative"
        bg="#050709"
        _before={{
          content: '""',
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(60% 40% at 50% -10%, rgba(16,185,129,0.18), rgba(0,0,0,0) 70%),radial-gradient(40% 30% at 85% 0%, rgba(34,197,94,0.12), rgba(0,0,0,0) 65%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
        _after={{
          content: '""',
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "28px 28px, 28px 28px",
          backgroundPosition: "center",
          opacity: 0.35,
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
      {/* Neuer Hero nach Vorlage (SNT, schwarzer Raum, grüner Glow) */}
      <SntHero />

        {/* Lokales Override: entferne Padding der generierten Klasse */}
        <style jsx>{`
          #register-page :global(.css-qnbf9j) {
            padding: 0 !important;
          }
        `}</style>

        {/* Grüner Glow-Trenner (vollbreit) */}
        <Box w="100%" position="relative" zIndex={1}>
          <Box h={{ base: 10, md: 12 }} position="relative" overflow="hidden">
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              bg="radial-gradient(55% 60% at 50% 0%, rgba(16,185,129,0.35) 0%, rgba(16,185,129,0.16) 35%, rgba(16,185,129,0.06) 60%, rgba(0,0,0,0) 70%)"
              filter="blur(14px)"
            />
            <Box h="1px" w="100%" bg="linear-gradient(90deg, transparent, rgba(16,185,129,0.6), transparent)" />
          </Box>
        </Box>

        {/* Vimeo Player Section */}
        <Section 
          size="lg" 
          bg="transparent"
          pt={{ base: 0, md: 12 }}
          pb={{ base: 8, md: 12 }}
          position="relative"
          zIndex={1}
        >
          <VStack gap={8} maxW="none" mx="auto">
            <Box 
              w={{ base: '100%', md: '800px', lg: '1200px', xl: '1400px' }} 
              maxW="100%" 
              mx="auto" 
              bg="linear-gradient(135deg, rgba(16, 185, 129, 0.35), rgba(34, 197, 94, 0.35))"
              borderRadius="xl" 
              p="7px"
              position="relative"
              boxShadow="0 0 40px rgba(16,185,129,0.2), 0 0 0 1px rgba(16,185,129,0.25)"
            >
              <VStack gap={3}>
                <Box 
                  w="100%" 
                  aspectRatio={16/9} 
                  position="relative"
                  overflow="hidden"
                  bg="black"
                  borderRadius="lg"
                >
                  <BrandedVimeoPlayer videoId="1132919065" />
                </Box>
                
                {/* Community Stats Element */}
                <Box 
                  p={{ base: 3.5, md: 4 }}
                  w="100%"
                  borderRadius="lg"
                  bg="rgba(0, 0, 0, 0.4)"
                  backdropFilter="blur(12px) saturate(180%)"
                  border="1px solid rgba(16, 185, 129, 0.15)"
                >
                  <Stack 
                    direction="row" 
                    align="center" 
                    gap={{ base: 2, md: 3 }} 
                    justify="flex-start"
                    flexWrap="nowrap"
                  >
                    <Stack direction="row" gap={-2} flexShrink={0}>
                      <Box 
                        w={{ base: 5, md: 6 }} 
                        h={{ base: 5, md: 6 }} 
                        borderRadius="full" 
                        border="2px solid rgba(16, 185, 129, 0.45)" 
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
                        w={{ base: 5, md: 6 }} 
                        h={{ base: 5, md: 6 }}
                        borderRadius="full" 
                        border="2px solid rgba(16, 185, 129, 0.45)" 
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
                        w={{ base: 5, md: 6 }} 
                        h={{ base: 5, md: 6 }}
                        borderRadius="full" 
                        border="2px solid rgba(16, 185, 129, 0.45)" 
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
                    <Text 
                      fontSize={{ base: "2xs", md: "xs" }} 
                      color="white" 
                      textShadow="0 1px 2px rgba(0,0,0,0.3)"
                      textAlign="left"
                      lineHeight="tight"
                      flex="1"
                      minW={0}
                    >
                      ...Bereits über <Text as="span" fontWeight="bold">1000+ Trader</Text> auf ihrem Weg begleitet und ausgebildet.
                    </Text>
                  </Stack>
                </Box>
              </VStack>
            </Box>

            {/* Outseta Widget Container */}
            <Box 
              w="100%" 
              maxW="480px" 
              mx="auto"
              bg="rgba(6, 12, 10, 0.55)"
              borderRadius="2xl"
              boxShadow="0 0 0 1px rgba(16,185,129,0.35), 0 0 60px rgba(16,185,129,0.25), 0 40px 120px rgba(16,185,129,0.28)"
              p={{ base: 5, md: 6 }}
              border="1px solid"
              borderColor="rgba(16,185,129,0.45)"
              backdropFilter="saturate(180%) blur(14px)"
            >
              {/* Widget Header */}
              <VStack gap={4} mb={6} textAlign="center">
                <Box 
                  bg="linear-gradient(135deg, #10B981, #22C55E)"
                  borderRadius="full"
                  p={4}
                  color="white"
                >
                  <CheckCircle size={28} weight="fill" />
                </Box>
                
                <VStack gap={2}>
                  <Heading as="h3" fontSize="xl" color="white">
                    Kostenlose Registrierung
                  </Heading>
                  <Text color="gray.300" fontSize="sm">
                    Keine Kreditkarte erforderlich • 100% kostenlos
                  </Text>
                </VStack>
              </VStack>

              {/* Outseta Widget */}
              <Box 
                id="outseta-widget-container"
                minH="360px"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <div data-o-auth="1"
       data-widget-mode="register"
       data-plan-uid="wmjBBxmV"
       data-plan-payment-term="month"
       data-skip-plan-options="true"
       data-mode="embed">
</div>
          
              </Box>

              {/* Zusätzliche Info */}
              <VStack gap={3} mt={6} pt={6} borderTop="1px solid" borderColor="rgba(16,185,129,0.28)">
                <HStack justify="center" color="#34D399" gap={3}>
                  <ShieldCheck size={18} weight="fill" />
                  <Text fontSize="sm" color="gray.200">Deine Daten sind sicher und werden niemals weitergegeben</Text>
                </HStack>
                <HStack justify="center" color="#34D399" gap={3}>
                  <Lightning size={18} weight="fill" />
                  <Text fontSize="sm" color="gray.200">Sofortiger Zugang nach der Registrierung</Text>
                </HStack>
                <HStack justify="center" color="#34D399" gap={3}>
                  <EnvelopeSimple size={18} weight="fill" />
                  <Text fontSize="sm" color="gray.200">Prüfe auch deinen Spam-Ordner für die Bestätigung</Text>
                </HStack>
              </VStack>
            </Box>
          </VStack>
        </Section>

 {/* Results Marquee Banner */}
 <ResultsMarquee />

      {/* Registrierungsformular Section */}
      <Section size="lg" bg="transparent" pt={0} pb={{ base: 6, md: 12 }}>
        <VStack gap={8} maxW="4xl" mx="auto">

          {/* Feature Sektion (3 Cards) */}
          <VStack gap={6} align="stretch" maxW="4xl" mx="auto" mt={{ base: 4, md: 6 }}>
            <SimpleGrid columns={{ base: 1, md: 3 }} gap={{ base: 4, md: 6 }}>
              {/* Card 1 - Kurs */}
              <Box
                bg="rgba(6, 12, 10, 0.55)"
                borderRadius="xl"
                border="1px solid"
                borderColor="rgba(16,185,129,0.35)"
                boxShadow="0 0 0 1px rgba(16,185,129,0.22), 0 20px 60px rgba(16,185,129,0.20)"
                p={{ base: 4, md: 5 }}
                backdropFilter="saturate(160%) blur(10px)"
                transition="all 0.25s ease"
                _hover={{ transform: "translateY(-4px)", boxShadow: "0 0 0 1px rgba(16,185,129,0.35), 0 30px 90px rgba(16,185,129,0.28)" }}
              >
                <HStack gap={3} align="start">
                  <Box bg="rgba(34,197,94,0.18)" color="#34D399" borderRadius="lg" p={3}>
                    <BookOpen size={22} weight="fill" />
                  </Box>
                  <Box>
                    <Text fontSize="md" fontWeight="bold" color="white" mb={1}>Kostenloses Trading-Bootcamp</Text>
                    <Text fontSize="sm" color="gray.300">Von den Grundlagen bis zur Umsetzung – verständlich und praxisnah.</Text>
                  </Box>
                </HStack>
              </Box>

              {/* Card 2 - Tools */}
              <Box
                bg="rgba(6, 12, 10, 0.55)"
                borderRadius="xl"
                border="1px solid"
                borderColor="rgba(16,185,129,0.35)"
                boxShadow="0 0 0 1px rgba(16,185,129,0.22), 0 20px 60px rgba(16,185,129,0.20)"
                p={{ base: 4, md: 5 }}
                backdropFilter="saturate(160%) blur(10px)"
                transition="all 0.25s ease"
                _hover={{ transform: "translateY(-4px)", boxShadow: "0 0 0 1px rgba(16,185,129,0.35), 0 30px 90px rgba(16,185,129,0.28)" }}
              >
                <HStack gap={3} align="start">
                  <Box bg="rgba(34,197,94,0.18)" color="#34D399" borderRadius="lg" p={3}>
                    <Wrench size={22} weight="fill" />
                  </Box>
                  <Box>
                    <Text fontSize="md" fontWeight="bold" color="white" mb={1}>Tools & Software</Text>
                    <Text fontSize="sm" color="gray.300">Praktische Tools, Tracker und Setups – direkt einsetzbar.</Text>
                  </Box>
                </HStack>
              </Box>

              {/* Card 3 - Community */}
              <Box
                bg="rgba(6, 12, 10, 0.55)"
                borderRadius="xl"
                border="1px solid"
                borderColor="rgba(16,185,129,0.35)"
                boxShadow="0 0 0 1px rgba(16,185,129,0.22), 0 20px 60px rgba(16,185,129,0.20)"
                p={{ base: 4, md: 5 }}
                backdropFilter="saturate(160%) blur(10px)"
                transition="all 0.25s ease"
                _hover={{ transform: "translateY(-4px)", boxShadow: "0 0 0 1px rgba(16,185,129,0.35), 0 30px 90px rgba(16,185,129,0.28)" }}
              >
                <HStack gap={3} align="start">
                  <Box bg="rgba(34,197,94,0.18)" color="#34D399" borderRadius="lg" p={3}>
                    <ChatsCircle size={22} weight="fill" />
                  </Box>
                  <Box>
                    <Text fontSize="md" fontWeight="bold" color="white" mb={1}>Free Discord</Text>
                    <Text fontSize="sm" color="gray.300">Tritt unserer aktiven Community bei und lerne mit anderen.</Text>
                  </Box>
                </HStack>
              </Box>
            </SimpleGrid>
          </VStack>

          
        </VStack>
      </Section>

     

      </Box>
    </>
  );
} 
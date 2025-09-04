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
import SntHeroWaitlist from "@/components/hero/snt-hero-waitlist";
import { CheckCircle, ShieldCheck, Lightning, EnvelopeSimple, BookOpen, Wrench, ChatsCircle } from "@phosphor-icons/react/dist/ssr";
import { useRouter } from "next/navigation";

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

    return () => {
      document.head.removeChild(script);
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
      {/* Neuer Hero für Waitlist (dupliziert) */}
      <SntHeroWaitlist />

        {/* Lokales Override: entferne Padding der generierten Klasse */}
        <style>{`
         .css-qnbf9j {
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

      {/* Registrierungsformular Section */}
      <Section size="lg" bg="transparent" pt={0} pb={{ base: 6, md: 12 }}>
        <VStack gap={8} maxW="4xl" mx="auto">

          {/* Feature Sektion (2 Cards für Warteliste) */}
          <VStack gap={6} align="stretch" maxW="4xl" mx="auto" mt={{ base: 4, md: 6 }}>
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={{ base: 4, md: 6 }}>
              {/* Card 1 - Warteliste Mentorship */}
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
                    <Text fontSize="md" fontWeight="bold" color="white" mb={1}>Warteliste für SNT-PREMIUM</Text>
                    <Text fontSize="sm" color="gray.300">Trag dich ein und sichere dir einen Platz in der nächsten Runde. Wir nehmen nur begrenzte Teilnehmer auf.</Text>
                  </Box>
                </HStack>
              </Box>

              {/* Card 2 - E-Mail Benachrichtigung */}
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
                    <EnvelopeSimple size={22} weight="fill" />
                  </Box>
                  <Box>
                    <Text fontSize="md" fontWeight="bold" color="white" mb={1}>Benachrichtigung per E‑Mail</Text>
                    <Text fontSize="sm" color="gray.300">Wir informieren dich, sobald das SNT-PREMIUM wieder startet – inklusive allen nächsten Schritten.</Text>
                  </Box>
                </HStack>
              </Box>
            </SimpleGrid>
          </VStack>

          {/* Hinweis-Text unterhalb der Karten */}
          <Text color="gray.300" fontSize="lg" maxW="600px" textAlign="center" mx="auto">
            Trage dich ein – wir benachrichtigen dich per E‑Mail, sobald es wieder los geht.
          </Text>

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
                  Kostenlose Eintragung
                </Heading>
                <Text color="gray.300" fontSize="sm">
                •  Keine Kreditkarte erforderlich • 100% kostenlos • Sofortige Nachricht
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
             <div data-o-email-list="1" 
    data-mode="embed" 
    data-email-list-uid="E9LwOvQw"
    data-registration-field-configuration='[
  {
    "defaultValue": "",
    "definition": {
      "SystemName": "Email"
    },
    "hidden": false,
    "required": true
  },
  {
    "definition": {
      "SystemName": "FirstName"
    },
    "hidden": false,
    "required": true
  },
  {
    "definition": {
      "SystemName": "LastName"
    },
    "hidden": false,
    "required": true
  }
]'>
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

      </Box>
    </>
  );
} 
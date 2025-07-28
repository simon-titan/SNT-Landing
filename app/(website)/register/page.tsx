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
} from "@chakra-ui/react";
import { Section } from "@/components/layout/section";
import { CheckCircle, WarningCircle } from "@phosphor-icons/react/dist/ssr";
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
      {/* Hero Section mit Video Background */}
      <Section
        header
        size="lg"
        bg="bg.subtle"
        borderBottom="1px solid"
        borderColor="border"
        w="100vw"
        mx="unset"
        pb={{ base: "0px", md: "80px" }}
        position="relative"
        overflow="hidden"
      >
        {/* Video Background */}
        <Box
          position="absolute"
          top="60%"
          left="50%"
          width="100vw"
          height={{ base: "50vh", md: "100vh" }}
          transform="translate(-50%, -50%)"
          zIndex={0}
          overflow="hidden"
        >
          <video
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            autoPlay
            muted
            loop
            playsInline
          >
            <source src="/assets/0716.mp4" type="video/mp4" />
          </video>
        </Box>

        {/* Content */}
        <VStack gap="4" maxW="900px" mx="auto" position="relative" zIndex={1}>
          <Stack gap="2" textAlign="center" mx="auto">
            {/* SNTTRADES Trading Academy Badge */}
            <Box 
              display="flex" 
              alignItems="center" 
              justifyContent="center" 
              gap="2" 
              mx="auto"
              mb="1"
            >
              <CheckCircle size={20} color="#1E88E5" weight="fill" />
              <Heading
                as="h1"
                fontSize={{ base: "md", md: "2xl" }}
                fontWeight="700"
                lineHeight="0.9"
                color="white"
                textShadow="1px 1px 2px rgba(0,0,0,0.8)"
              >
                SNTTRADES™
              </Heading>
            </Box>
            
            <Heading
              as="h1"
              textStyle={{ base: "2xl", md: "5xl" }}
              mx="auto"
              color="white"
              lineHeight="tighter"
              fontWeight="semibold"
              maxW="800px"
              textShadow="2px 2px 4px rgba(0,0,0,0.8)"
            >
              REGISTRIERUNG FÜR DEN{' '}
              <Box as="span" 
                background="linear-gradient(90deg,rgb(92, 154, 246), transparent 95%)" 
                color="white" 
                px={2} 
                py={1} 
                borderRadius="md" 
                fontWeight="semibold" 
                display="inline-block"
              >
                KOSTENLOSEN KURS
              </Box>
            </Heading>
            
            <Text color="white" textStyle="sm" mx="auto" maxW="700px" textShadow="1px 1px 2px rgba(0,0,0,0.8)">
              Sichere dir jetzt deinen kostenlosen Zugang zum  SNT-FREE-KURS 🚀
            </Text>
          </Stack>
          
          {/* Progress Bar */}
          <Box w="100%" maxW="400px" mt={4}>
            <Box 
              w="100%" 
              h="8px" 
              bg="rgba(255,255,255,0.2)" 
              borderRadius="full"
              overflow="hidden"
            >
              <Box 
                h="100%" 
                bg="linear-gradient(90deg, #1E88E5, #60A5FA)"
                borderRadius="full"
                transition="width 0.3s ease"
                width={`${progress}%`}
              />
            </Box>
            <Text 
              color="white" 
              fontSize="sm" 
              textAlign="center" 
              mt={2}
              textShadow="1px 1px 2px rgba(0,0,0,0.8)"
            >
              {progress}% bereit
            </Text>
          </Box>
        </VStack>
      </Section>

      {/* Registrierungsformular Section */}
      <Section size="lg" bg="white" py={{ base: 8, md: 16 }}>
        <VStack gap={8} maxW="4xl" mx="auto">
          {/* Überschrift */}
          <VStack gap={4} textAlign="center">
            <Heading 
              as="h2" 
              textStyle={{ base: "3xl", md: "4xl" }} 
              color="gray.900"
              lineHeight="tight"
            >
              Letzter Schritt zum{' '}
              <Box as="span" 
                background="linear-gradient(90deg,rgb(246, 236, 92), transparent 95%)" 
                color="black" 
                px={2} 
                py={1} 
                borderRadius="md" 
                fontWeight="bold" 
                display="inline-block"
              >
                KOSTENLOSEN SNT-FREE-KURS
              </Box>
            </Heading>
            
            <Text color="gray.600" fontSize="lg" maxW="600px">
              Fülle das Formular aus und erhalte sofortigen Zugang zu unserem kostenlosen Trading-Kurs.
            </Text>
          </VStack>

          {/* Outseta Widget Container */}
          <Box 
            w="100%" 
            maxW="500px" 
            mx="auto"
            bg="white"
            borderRadius="2xl"
            boxShadow="xl"
            p={{ base: 6, md: 8 }}
            border="1px solid"
            borderColor="gray.200"
          >
            {/* Widget Header */}
            <VStack gap={4} mb={6} textAlign="center">
              <Box 
                bg="linear-gradient(135deg, #1E88E5, #60A5FA)"
                borderRadius="full"
                p={4}
                color="white"
              >
                <CheckCircle size={32} weight="fill" />
              </Box>
              
              <VStack gap={2}>
                <Heading as="h3" fontSize="xl" color="gray.800">
                  Kostenlose Registrierung
                </Heading>
                <Text color="gray.600" fontSize="sm">
                  Keine Kreditkarte erforderlich • 100% kostenlos
                </Text>
              </VStack>
            </VStack>

            {/* Outseta Widget */}
            <Box 
              id="outseta-widget-container"
              minH="400px"
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
            <VStack gap={3} mt={6} pt={6} borderTop="1px solid" borderColor="gray.200">
              <Text fontSize="sm" color="gray.500" textAlign="center">
                🔒 Deine Daten sind sicher und werden niemals weitergegeben
              </Text>
              <Text fontSize="sm" color="gray.500" textAlign="center">
                ⚡ Sofortiger Zugang nach der Registrierung
              </Text>
              <Text fontSize="sm" color="gray.500" textAlign="center">
                📧 Prüfe auch deinen Spam-Ordner für die Bestätigung
              </Text>
            </VStack>
          </Box>

          
        </VStack>
      </Section>

     
    </>
  );
} 
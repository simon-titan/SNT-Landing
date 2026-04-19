"use client";

import { Box, VStack, HStack, Heading, Text, Button } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { ArrowRight, Lock, Warning } from "@phosphor-icons/react/dist/ssr";
import { useRouter } from "next/navigation";
import { trackProtocolEvent } from "./ProtocolTracker";

const SNT_PURPLE = "#8B5CF6";

const glowPulse = keyframes({
  "0%, 100%": { boxShadow: "0 0 30px rgba(139, 92, 246,0.3), 0 0 60px rgba(139, 92, 246,0.1)" },
  "50%": { boxShadow: "0 0 50px rgba(139, 92, 246,0.6), 0 0 100px rgba(139, 92, 246,0.2)" },
});

const requirements = [
  "Du bist bereit, Zeit und Ressourcen ernsthaft zu investieren",
  "Du übernimmst Verantwortung für deine Ergebnisse",
  "Du bist nicht auf der Suche nach einem schnellen Trick",
  "Du bist offen für Feedback und bereit, dich zu verändern",
  "Du möchtest professionell traden, nicht als Hobby",
];

export function ProtocolFinalCta() {
  const router = useRouter();

  const handleApply = () => {
    trackProtocolEvent("form_open", { source: "final_cta" });
    router.push("/elite/apply");
  };

  return (
    <Box
      as="section"
      w="full"
      py={{ base: 20, md: 32 }}
      px={{ base: 4, md: 8 }}
      position="relative"
      overflow="hidden"
      background="radial-gradient(at 50% 0%, rgba(139, 92, 246,0.1) 0px, transparent 55%),
        radial-gradient(at 50% 100%, rgba(139, 92, 246,0.06) 0px, transparent 55%),
        linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(6,10,20,1) 50%, rgba(0,0,0,1) 100%)"
    >
      {/* Grid overlay */}
      <Box
        position="absolute"
        inset="0"
        backgroundImage="linear-gradient(rgba(139, 92, 246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246,0.04) 1px, transparent 1px)"
        backgroundSize="50px 50px"
        pointerEvents="none"
      />

      <Box maxW="900px" mx="auto" position="relative">
        <VStack gap={8} textAlign="center">
          {/* Warning badge */}
          <HStack
            gap={2}
            px={4}
            py={2}
            borderRadius="full"
            bg="rgba(239,68,68,0.10)"
            border="1px solid rgba(239,68,68,0.35)"
            boxShadow="0 0 24px rgba(239,68,68,0.18)"
          >
            <Warning size={14} color="rgba(239,68,68,0.95)" weight="fill" />
            <Text fontSize="xs" color="white" fontWeight="bold" letterSpacing="wider" textTransform="uppercase" textShadow="0 0 12px rgba(239,68,68,0.5)">
              Limitierte Plätze
            </Text>
          </HStack>

          <Heading
            as="h2"
            fontSize={{ base: "3xl", md: "5xl" }}
            fontWeight="900"
            color="white"
            lineHeight="1.1"
            textTransform="uppercase"
          >
            Nur Wenige werden{" "}
            <Box
              as="span"
              background="linear-gradient(90deg, rgba(139, 92, 246,0.3), rgba(124, 58, 237,0.2) 95%)"
              color="white"
              px={2}
              py={1}
              borderRadius="md"
              border="1px solid rgba(139, 92, 246,0.35)"
              boxShadow="0 0 32px rgba(139, 92, 246,0.3)"
              backdropFilter="blur(6px)"
              display="inline-block"
            >
              ausgewählt
            </Box>
          </Heading>

          <Text
            fontSize={{ base: "md", md: "lg" }}
            color="gray.400"
            maxW="600px"
            lineHeight="1.7"
          >
            Das SNT ELITE ist kein offenes Angebot. Wir arbeiten nur mit Kandidaten,
            die wirklich bereit sind, und die wir persönlich für das Programm geeignet
            sehen. Deine Bewerbung ist der erste Schritt.
          </Text>

          {/* Requirements */}
          <Box
            w="full"
            maxW="500px"
            p={6}
            borderRadius="xl"
            bg="rgba(10,14,20,0.7)"
            backdropFilter="blur(16px)"
            border="1px solid rgba(139, 92, 246,0.15)"
          >
            <Text fontSize="sm" fontWeight="bold" color="white" mb={4} textTransform="uppercase" letterSpacing="wider">
              Das erwarten wir von dir:
            </Text>
            <VStack align="start" gap={2.5}>
              {requirements.map((req, idx) => (
                <HStack key={idx} gap={3} align="start">
                  <Box
                    w="6px"
                    h="6px"
                    borderRadius="full"
                    bg={SNT_PURPLE}
                    mt="7px"
                    flexShrink={0}
                    boxShadow={`0 0 6px rgba(139, 92, 246,0.6)`}
                  />
                  <Text fontSize="sm" color="gray.400" lineHeight="1.6">
                    {req}
                  </Text>
                </HStack>
              ))}
            </VStack>
          </Box>

          {/* CTA Button */}
          <Box position="relative" display="inline-block">
            <Button
              h={{ base: "60px", md: "68px" }}
              px={{ base: 10, md: 14 }}
              bg={SNT_PURPLE}
              color="white"
              fontSize={{ base: "md", md: "lg" }}
              fontWeight="900"
              borderRadius="xl"
              animation={`${glowPulse} 3s ease-in-out infinite`}
              _hover={{
                bg: "#7C3AED",
                transform: "translateY(-3px)",
              }}
              transition="all 0.25s"
              onClick={handleApply}
              letterSpacing="wider"
              textTransform="uppercase"
            >
              <HStack gap={3}>
                <Text>JETZT BEWERBEN</Text>
                <ArrowRight size={20} weight="bold" />
              </HStack>
            </Button>
          </Box>

          <HStack gap={2} justify="center">
            <Lock size={12} color="gray" />
            <Text fontSize="xs" color="gray.600">
              Kostenlos & unverbindlich · Deine Daten sind 100% sicher
            </Text>
          </HStack>
        </VStack>
      </Box>
    </Box>
  );
}

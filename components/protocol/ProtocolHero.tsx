"use client";

import { Box, VStack, HStack, Heading, Text, Button } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { ProtocolVideoPlayer } from "@/components/protocol/ProtocolVideoPlayer";
import { ApprovedIcon } from "@/components/ui/approved-icon";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { useRouter } from "next/navigation";
import { trackProtocolEvent } from "./ProtocolTracker";

const SNT_PURPLE = "#8B5CF6";

const fadeIn = keyframes({
  from: { opacity: 0, transform: "translateY(-8px) scale(0.97)", filter: "blur(2px)" },
  to: { opacity: 1, transform: "translateY(0) scale(1)", filter: "blur(0)" },
});

const pulseGlow = keyframes({
  "0%, 100%": { boxShadow: "0 0 20px rgba(139, 92, 246, 0.3), 0 0 60px rgba(139, 92, 246, 0.1)" },
  "50%": { boxShadow: "0 0 30px rgba(139, 92, 246, 0.6), 0 0 80px rgba(139, 92, 246, 0.2)" },
});

const dotPulse = keyframes({
  "0%, 100%": { opacity: 1, transform: "scale(1)" },
  "50%": { opacity: 0.4, transform: "scale(0.8)" },
});

const shimmer = keyframes({
  "0%": { backgroundPosition: "-200% 0" },
  "100%": { backgroundPosition: "200% 0" },
});

interface ProtocolHeroProps {
  vimeoId?: string;
}

export function ProtocolHero({ vimeoId = "1177003953" }: ProtocolHeroProps) {
  const router = useRouter();

  const handleApply = () => {
    trackProtocolEvent("form_open", { source: "hero_cta" });
    router.push("/apex/apply");
  };

  return (
    <Box
      w="100vw"
      bg="black"
      pt={{ base: 8, md: 14 }}
      pb={{ base: 12, md: 20 }}
      px={{ base: 4, md: 8 }}
      position="relative"
      overflow="hidden"
      background="radial-gradient(ellipse 80% 50% at 50% 0%, rgba(139, 92, 246,0.18) 0px, transparent 60%),
        radial-gradient(at 0% 0%, rgba(139, 92, 246,0.10) 0px, transparent 50%),
        radial-gradient(at 100% 100%, rgba(124, 58, 237, 0.08) 0px, transparent 50%),
        linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(6,10,20,1) 100%)"
    >
      {/* Subtle grid overlay */}
      <Box
        position="absolute"
        inset="0"
        backgroundImage="linear-gradient(rgba(139, 92, 246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246,0.04) 1px, transparent 1px)"
        backgroundSize="60px 60px"
        maskImage="radial-gradient(ellipse 70% 60% at 50% 30%, black 0%, transparent 80%)"
        css={{
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 30%, black 0%, transparent 80%)",
        }}
        pointerEvents="none"
      />

      {/* Vignette top glow */}
      <Box
        position="absolute"
        top="0"
        left="50%"
        transform="translateX(-50%)"
        w={{ base: "120%", md: "70%" }}
        h={{ base: "180px", md: "240px" }}
        background="radial-gradient(ellipse at center top, rgba(139, 92, 246,0.25) 0%, transparent 70%)"
        pointerEvents="none"
        filter="blur(20px)"
      />

      <VStack gap={{ base: 7, md: 10 }} maxW="1400px" mx="auto" position="relative">

        {/* Headline Block */}
        <VStack gap={{ base: 4, md: 5 }} w="full" textAlign="center">
          <HStack
            mx={1.5}
            justifyContent="center"
            animation={`${fadeIn} 1600ms ease-out both`}
          >
            <ApprovedIcon boxSize={{ base: 5, md: 6 }} />
            <Heading
              as="h2"
              color="white"
              textAlign="center"
              fontWeight="600"
              fontSize={{ base: "sm", md: "md" }}
              lineHeight="1"
              letterSpacing="widest"
            >
              SNT-TRADES
            </Heading>
          </HStack>

          {/* Limited Slots Badge — red accent like the Final CTA */}
          <Box
            display="inline-flex"
            alignItems="center"
            gap={2.5}
            px={{ base: 4, md: 5 }}
            py={{ base: 2, md: 2.5 }}
            borderRadius="full"
            bg="rgba(239, 68, 68, 0.10)"
            border="1px solid rgba(239, 68, 68, 0.45)"
            backdropFilter="blur(8px)"
            boxShadow="0 0 28px rgba(239, 68, 68, 0.30), inset 0 0 14px rgba(239, 68, 68, 0.12)"
            animation={`${fadeIn} 1800ms ease-out both`}
          >
            <Box
              w="7px"
              h="7px"
              borderRadius="full"
              bg="rgba(239, 68, 68, 1)"
              boxShadow="0 0 10px rgba(239, 68, 68, 0.95), 0 0 18px rgba(239, 68, 68, 0.7)"
              animation={`${dotPulse} 1.4s ease-in-out infinite`}
            />
            <Text
              fontSize={{ base: "xs", md: "sm" }}
              color="white"
              fontWeight="bold"
              letterSpacing="wider"
              textTransform="uppercase"
              textShadow="0 0 12px rgba(239, 68, 68, 0.6)"
            >
              Limitierte Plätze
            </Text>
          </Box>

          <Heading
            as="h1"
            fontSize={{ base: "4xl", sm: "5xl", md: "6xl", lg: "7xl" }}
            fontWeight="900"
            color="white"
            lineHeight={{ base: "1.05", md: "1" }}
            textAlign="center"
            textTransform="uppercase"
            letterSpacing={{ base: "-0.01em", md: "-0.015em" }}
            animation={`${fadeIn} 2000ms ease-out both`}
            maxW="1000px"
          >
            <Box
              as="span"
              display="block"
              color="white"
              textShadow="0 2px 24px rgba(0,0,0,0.5)"
            >
              Deine Chance für
            </Box>
            <Box
              as="span"
              display="inline-block"
              mt={{ base: 2, md: 3 }}
              backgroundImage="linear-gradient(90deg, #ffffff 0%, #8B5CF6 45%, #C4B5FD 55%, #ffffff 100%)"
              backgroundSize="200% auto"
              backgroundClip="text"
              css={{ WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
              fontWeight="900"
              animation={`${shimmer} 6s linear infinite`}
              filter="drop-shadow(0 0 24px rgba(139, 92, 246,0.5))"
            >
              SNT APEX
            </Box>
          </Heading>
        </VStack>

        {/* Video + Side Content */}
        <VStack
          w="full"
          display={{ base: "flex", md: "none" }}
          gap={5}
          animation={`${fadeIn} 2200ms ease-out both`}
        >
          <Box
            w="100%"
            aspectRatio={16 / 9}
            position="relative"
            overflow="hidden"
            bg="black"
            borderRadius="2xl"
            border="1px solid rgba(139, 92, 246,0.3)"
            boxShadow="0 8px 48px rgba(139, 92, 246,0.18)"
            animation={`${pulseGlow} 4s ease-in-out infinite`}
          >
            <ProtocolVideoPlayer videoId={vimeoId} autoplay muted />
          </Box>

          {/* Bullet points — left aligned on mobile */}
          <VStack align="start" gap={2.5} w="full" textAlign="left">
            {[
              { icon: "01", text: "Persönliches 1:1-Coaching direkt mit Ali" },
              { icon: "02", text: "Bewährtes Trading-System mit nachweisbaren Ergebnissen" },
              { icon: "03", text: "Zugang zur exklusivsten Trading-Community" },
              { icon: "04", text: "Strikte Auswahl, nur ernsthafte Kandidaten" },
            ].map(({ icon, text }) => (
              <HStack key={icon} gap={3} align="start" w="full">
                <Box
                  minW="28px"
                  h="28px"
                  borderRadius="md"
                  bg="rgba(139, 92, 246,0.15)"
                  border="1px solid rgba(139, 92, 246,0.3)"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexShrink={0}
                >
                  <Text fontSize="2xs" color={SNT_PURPLE} fontWeight="bold" fontFamily="mono">
                    {icon}
                  </Text>
                </Box>
                <Text color="gray.300" fontSize="sm" lineHeight="1.5" pt="3px" textAlign="left">
                  {text}
                </Text>
              </HStack>
            ))}
          </VStack>

          <Button
            w="full"
            h="60px"
            bg={SNT_PURPLE}
            color="white"
            fontSize="md"
            fontWeight="bold"
            borderRadius="xl"
            letterSpacing="wider"
            textTransform="uppercase"
            boxShadow="0 8px 32px rgba(139, 92, 246,0.35), inset 0 1px 0 rgba(255,255,255,0.2)"
            _hover={{
              bg: "#7C3AED",
              transform: "translateY(-2px)",
              boxShadow: "0 12px 40px rgba(139, 92, 246,0.5), inset 0 1px 0 rgba(255,255,255,0.25)",
            }}
            _active={{ transform: "translateY(0)" }}
            transition="all 0.2s ease"
            onClick={handleApply}
          >
            <HStack gap={2}>
              <Text>Jetzt bewerben</Text>
              <ArrowRight size={18} weight="bold" />
            </HStack>
          </Button>
          <Text fontSize="2xs" color="gray.500" textAlign="center" w="full" letterSpacing="wide">
            Kostenlos & unverbindlich · Vertraulich behandelt
          </Text>
        </VStack>

        {/* Desktop: Side by side */}
        <HStack
          gap={10}
          w="full"
          display={{ base: "none", md: "flex" }}
          align="center"
          animation={`${fadeIn} 2200ms ease-out both`}
        >
          <Box
            flex="0 0 58%"
            aspectRatio={16 / 9}
            position="relative"
            overflow="hidden"
            bg="black"
            borderRadius="2xl"
            border="1px solid rgba(139, 92, 246,0.3)"
            boxShadow="0 8px 48px rgba(139, 92, 246,0.18)"
            animation={`${pulseGlow} 4s ease-in-out infinite`}
          >
            <ProtocolVideoPlayer videoId={vimeoId} autoplay muted />
          </Box>

          <VStack flex={1} align="start" gap={6}>
            <VStack align="start" gap={3} w="full">
              {[
                { icon: "01", text: "Persönliches 1:1-Coaching direkt mit Ali" },
                { icon: "02", text: "Bewährtes Trading-System mit nachweisbaren Ergebnissen" },
                { icon: "03", text: "Zugang zur exklusivsten Trading-Community" },
                { icon: "04", text: "Strikte Auswahl, nur ernsthafte Kandidaten" },
              ].map(({ icon, text }) => (
                <HStack key={icon} gap={3} align="start">
                  <Box
                    minW="32px"
                    h="32px"
                    borderRadius="md"
                    bg="rgba(139, 92, 246,0.15)"
                    border="1px solid rgba(139, 92, 246,0.3)"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexShrink={0}
                  >
                    <Text fontSize="xs" color={SNT_PURPLE} fontWeight="bold" fontFamily="mono">
                      {icon}
                    </Text>
                  </Box>
                  <Text color="gray.300" fontSize="sm" lineHeight="1.6" pt={1}>
                    {text}
                  </Text>
                </HStack>
              ))}
            </VStack>

            <Button
              w="full"
              h="60px"
              bg={SNT_PURPLE}
              color="white"
              fontSize="md"
              fontWeight="bold"
              borderRadius="xl"
              letterSpacing="wider"
              textTransform="uppercase"
              boxShadow="0 8px 32px rgba(139, 92, 246,0.35), inset 0 1px 0 rgba(255,255,255,0.2)"
              _hover={{
                bg: "#7C3AED",
                transform: "translateY(-2px)",
                boxShadow: "0 12px 40px rgba(139, 92, 246,0.5), inset 0 1px 0 rgba(255,255,255,0.25)",
              }}
              _active={{ transform: "translateY(0)" }}
              transition="all 0.25s ease"
              onClick={handleApply}
            >
              <HStack gap={2}>
                <Text>Jetzt bewerben</Text>
                <ArrowRight size={18} weight="bold" />
              </HStack>
            </Button>

            <Text fontSize="xs" color="gray.500" textAlign="center" w="full" letterSpacing="wide">
              Kostenlos & unverbindlich · Deine Daten werden vertraulich behandelt
            </Text>
          </VStack>
        </HStack>
      </VStack>
    </Box>
  );
}

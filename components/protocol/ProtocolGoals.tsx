"use client";

import { useEffect, useRef, useState } from "react";
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  SimpleGrid,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import {
  ArrowRight,
  CheckCircle,
  XCircle,
  Crosshair,
  Brain,
  Handshake,
  UsersThree,
} from "@phosphor-icons/react/dist/ssr";

const SNT_PURPLE = "#8B5CF6";
const SNT_PURPLE_DARK = "#7C3AED";
const SNT_PURPLE_LIGHT = "#C4B5FD";
const RED = "239, 68, 68";

const transformations = [
  {
    before: "Zufällige, inkonsistente Ergebnisse",
    after: "Ein System, das du täglich reproduzierst",
  },
  {
    before: "Emotionale Entscheidungen im Trade",
    after: "Klarer Kopf, mechanische Disziplin",
  },
  {
    before: "Alleine auf einem langen Weg",
    after: "Direkter Zugang zu Ali & Gleichgesinnten",
  },
  {
    before: "Kein klarer Entwicklungsplan",
    after: "Persönliche Roadmap für die nächsten 90 Tage",
  },
  {
    before: "YouTube-Wissen ohne roten Faden",
    after: "Ein erprobtes System mit echter Pedigree",
  },
  {
    before: "Plateau ohne Ausweg",
    after: "Wöchentliches Feedback & Accountability",
  },
];

const outcomes = [
  {
    icon: Crosshair,
    title: "Klares Trading-System",
    description:
      "Du bekommst ein System, das auf deinen Typ, deine Zeitzone und deine Risikotoleranz zugeschnitten ist. Kein Copy-Paste. Dein System.",
  },
  {
    icon: Brain,
    title: "Mentale Stärke & Struktur",
    description:
      "Du lernst, wie du deinen Kopf managst. Emotionen kontrollieren, nicht eliminieren. Das ist der Unterschied zwischen Hobbytrader und Profi.",
  },
  {
    icon: Handshake,
    title: "Persönliche Accountability",
    description:
      "Ali checkt deinen Fortschritt. Keine Ausreden, keine Ablenkung. Du wirst für deine Ergebnisse verantwortlich gemacht und das ändert alles.",
  },
  {
    icon: UsersThree,
    title: "Exklusives Netzwerk",
    description:
      "Du triffst Trader, die auf deinem Level oder darüber sind. Ein Umfeld, das dich zieht, nicht bremst. Das ist kein Discord-Server. Das ist eine Community.",
  },
];

const float = keyframes({
  "0%, 100%": { transform: "translateY(0)" },
  "50%": { transform: "translateY(-3px)" },
});

interface OutcomeCardProps {
  Icon: React.ComponentType<any>;
  title: string;
  description: string;
}

function OutcomeCard({ Icon, title, description }: OutcomeCardProps) {
  return (
    <Box
      role="group"
      position="relative"
      p={{ base: 6, md: 7 }}
      borderRadius="2xl"
      bg="rgba(10,14,20,0.82)"
      backdropFilter="blur(16px)"
      border="1px solid rgba(139, 92, 246,0.18)"
      overflow="hidden"
      transition="all 0.35s cubic-bezier(0.22, 1, 0.36, 1)"
      h="full"
      _hover={{
        borderColor: "rgba(139, 92, 246,0.5)",
        transform: "translateY(-4px)",
        boxShadow: `0 18px 50px rgba(139, 92, 246, 0.18), 0 0 0 1px rgba(139, 92, 246, 0.2)`,
      }}
    >
      {/* Top accent line */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        h="2px"
        background={`linear-gradient(90deg, transparent, ${SNT_PURPLE}, ${SNT_PURPLE_LIGHT}, transparent)`}
        opacity={0.5}
        transition="opacity 0.35s ease"
        _groupHover={{ opacity: 1 }}
      />
      {/* Corner glow */}
      <Box
        position="absolute"
        top={0}
        right={0}
        w="170px"
        h="170px"
        background={`radial-gradient(circle at top right, rgba(139, 92, 246, 0.18) 0%, transparent 65%)`}
        pointerEvents="none"
        opacity={0.7}
        transition="opacity 0.35s ease"
        _groupHover={{ opacity: 1 }}
      />

      <VStack align="start" gap={4} position="relative">
        <Box
          position="relative"
          p="14px"
          borderRadius="xl"
          background={`linear-gradient(135deg, rgba(139, 92, 246,0.22) 0%, rgba(139, 92, 246,0.06) 100%)`}
          border="1px solid rgba(139, 92, 246,0.4)"
          boxShadow="0 4px 20px rgba(139, 92, 246,0.2), inset 0 1px 0 rgba(255,255,255,0.06)"
          transition="all 0.35s ease"
          _groupHover={{
            transform: "translateY(-2px)",
            boxShadow: "0 8px 28px rgba(139, 92, 246,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
            animation: `${float} 2.4s ease-in-out infinite`,
          }}
        >
          <Icon size={28} color={SNT_PURPLE_LIGHT} weight="fill" />
        </Box>

        <Text
          fontSize={{ base: "lg", md: "xl" }}
          fontWeight="800"
          color="white"
          lineHeight="tight"
          letterSpacing="-0.01em"
        >
          {title}
        </Text>

        <Text fontSize="sm" color="gray.400" lineHeight="1.7">
          {description}
        </Text>
      </VStack>
    </Box>
  );
}

function OutcomesSlider() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => {
      const cards = el.querySelectorAll<HTMLElement>("[data-card]");
      if (!cards.length) return;
      const elCenter = el.scrollLeft + el.clientWidth / 2;
      let nearestIdx = 0;
      let nearestDist = Infinity;
      cards.forEach((card, i) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const dist = Math.abs(cardCenter - elCenter);
        if (dist < nearestDist) {
          nearestDist = dist;
          nearestIdx = i;
        }
      });
      setActiveIndex(nearestIdx);
    };
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToIndex = (i: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const cards = el.querySelectorAll<HTMLElement>("[data-card]");
    const card = cards[i];
    if (!card) return;
    const target = card.offsetLeft - (el.clientWidth - card.offsetWidth) / 2;
    el.scrollTo({ left: target, behavior: "smooth" });
  };

  return (
    <Box position="relative">
      <Box
        ref={scrollerRef}
        overflowX="auto"
        overflowY="visible"
        mx={-4}
        px={4}
        pb={2}
        css={{
          scrollSnapType: "x mandatory",
          scrollPaddingLeft: "16px",
          scrollPaddingRight: "16px",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        <HStack gap={4} align="stretch" w="max-content">
          {outcomes.map(({ icon: Icon, title, description }, idx) => (
            <Box
              key={idx}
              data-card
              flexShrink={0}
              w="84vw"
              maxW="340px"
              css={{ scrollSnapAlign: "center" }}
            >
              <OutcomeCard
                Icon={Icon}
                title={title}
                description={description}
              />
            </Box>
          ))}
          <Box flexShrink={0} w="8vw" />
        </HStack>
      </Box>
      <HStack justify="center" gap={1.5} mt={5}>
        {outcomes.map((_, i) => {
          const active = i === activeIndex;
          return (
            <Box
              key={i}
              as="button"
              onClick={() => scrollToIndex(i)}
              aria-label={`Karte ${i + 1} anzeigen`}
              h="6px"
              w={active ? "22px" : "6px"}
              borderRadius="full"
              bg={
                active
                  ? `linear-gradient(90deg, ${SNT_PURPLE}, ${SNT_PURPLE_LIGHT})`
                  : "rgba(255,255,255,0.18)"
              }
              boxShadow={
                active ? `0 0 12px rgba(139, 92, 246, 0.55)` : "none"
              }
              transition="all 0.3s ease"
              cursor="pointer"
              _hover={{ bg: active ? undefined : "rgba(255,255,255,0.35)" }}
            />
          );
        })}
      </HStack>
    </Box>
  );
}

export function ProtocolGoals() {
  return (
    <Box
      as="section"
      w="full"
      py={{ base: 16, md: 24 }}
      px={{ base: 4, md: 8 }}
      position="relative"
      background={`radial-gradient(at 30% 50%, rgba(139, 92, 246,0.06) 0px, transparent 60%),
        linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(6,10,20,1) 100%)`}
    >
      <Box maxW="1200px" mx="auto">
        <VStack gap={5} mb={{ base: 12, md: 16 }} textAlign="center">
          <Text
            color={SNT_PURPLE}
            fontSize={{ base: "xs", md: "sm" }}
            fontWeight="bold"
            textTransform="uppercase"
            letterSpacing="widest"
            textShadow="0 0 12px rgba(139, 92, 246,0.5)"
          >
            Was SNT APEX dir gibt
          </Text>

          {/* Multi-line headline so highlights don't overlap */}
          <Heading
            as="h2"
            fontSize={{ base: "3xl", md: "5xl" }}
            fontWeight="900"
            color="white"
            lineHeight={{ base: "1.15", md: "1.05" }}
            textAlign="center"
            letterSpacing={{ base: "-0.01em", md: "-0.015em" }}
            maxW="900px"
          >
            <Box as="span" display="block">
              Vom
            </Box>
            <Box
              as="span"
              display="inline-block"
              mt={{ base: 2, md: 3 }}
              px={{ base: 3, md: 4 }}
              py={{ base: 1, md: 2 }}
              borderRadius="lg"
              background={`linear-gradient(90deg, rgba(${RED},0.18), rgba(${RED},0.04) 95%)`}
              color={`rgba(${RED}, 0.95)`}
              border={`1px solid rgba(${RED},0.4)`}
              boxShadow={`0 0 24px rgba(${RED},0.18)`}
              backdropFilter="blur(6px)"
            >
              frustrierten Trader
            </Box>
            <Box as="span" display="block" mt={{ base: 2, md: 3 }}>
              zum
            </Box>
            <Box
              as="span"
              display="inline-block"
              mt={{ base: 2, md: 3 }}
              px={{ base: 3, md: 4 }}
              py={{ base: 1, md: 2 }}
              borderRadius="lg"
              background={`linear-gradient(90deg, rgba(139, 92, 246,0.25), rgba(139, 92, 246,0.05) 95%)`}
              color="white"
              border="1px solid rgba(139, 92, 246,0.45)"
              boxShadow="0 0 28px rgba(139, 92, 246,0.28), inset 0 0 12px rgba(139, 92, 246,0.1)"
              backdropFilter="blur(8px)"
            >
              strukturierten Profi
            </Box>
          </Heading>
        </VStack>

        {/* Before/After Transformations — more visual presence */}
        <Box mb={{ base: 14, md: 20 }}>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={{ base: 3, md: 4 }}>
            {transformations.map(({ before, after }, idx) => (
              <Box
                key={idx}
                role="group"
                position="relative"
                p={{ base: 4, md: 5 }}
                borderRadius="xl"
                bg="rgba(10,14,20,0.7)"
                border="1px solid rgba(255,255,255,0.05)"
                backdropFilter="blur(12px)"
                overflow="hidden"
                transition="all 0.3s cubic-bezier(0.22, 1, 0.36, 1)"
                _hover={{
                  borderColor: "rgba(139, 92, 246,0.4)",
                  bg: "rgba(15,18,28,0.85)",
                  transform: "translateY(-3px)",
                  boxShadow: "0 14px 40px rgba(139, 92, 246,0.15)",
                }}
              >
                {/* Subtle red→purple gradient strip on hover */}
                <Box
                  position="absolute"
                  top={0}
                  left={0}
                  right={0}
                  h="2px"
                  background={`linear-gradient(90deg, rgba(${RED}, 0.6), ${SNT_PURPLE})`}
                  opacity={0}
                  transition="opacity 0.3s ease"
                  _groupHover={{ opacity: 1 }}
                />
                <HStack gap={3} align="stretch">
                  <VStack flex={1} align="start" gap={1.5} minW={0}>
                    <HStack gap={1.5}>
                      <XCircle size={14} color={`rgba(${RED}, 0.85)`} weight="fill" />
                      <Text
                        fontSize="2xs"
                        color={`rgba(${RED}, 0.85)`}
                        fontWeight="bold"
                        textTransform="uppercase"
                        letterSpacing="wider"
                      >
                        Vorher
                      </Text>
                    </HStack>
                    <Text fontSize="sm" color="gray.500" lineHeight="1.45" textAlign="left">
                      {before}
                    </Text>
                  </VStack>

                  <Box
                    alignSelf="center"
                    flexShrink={0}
                    w="34px"
                    h="34px"
                    borderRadius="full"
                    bg="rgba(139, 92, 246,0.12)"
                    border="1px solid rgba(139, 92, 246,0.3)"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    transition="all 0.3s ease"
                    _groupHover={{
                      bg: "rgba(139, 92, 246,0.25)",
                      borderColor: "rgba(139, 92, 246,0.6)",
                      boxShadow: "0 0 18px rgba(139, 92, 246,0.4)",
                      transform: "translateX(2px)",
                    }}
                  >
                    <ArrowRight size={16} color={SNT_PURPLE_LIGHT} weight="bold" />
                  </Box>

                  <VStack flex={1} align="start" gap={1.5} minW={0}>
                    <HStack gap={1.5}>
                      <CheckCircle size={14} color={SNT_PURPLE_LIGHT} weight="fill" />
                      <Text
                        fontSize="2xs"
                        color={SNT_PURPLE_LIGHT}
                        fontWeight="bold"
                        textTransform="uppercase"
                        letterSpacing="wider"
                      >
                        Nachher
                      </Text>
                    </HStack>
                    <Text fontSize="sm" color="gray.100" fontWeight="medium" lineHeight="1.45" textAlign="left">
                      {after}
                    </Text>
                  </VStack>
                </HStack>
              </Box>
            ))}
          </SimpleGrid>
        </Box>

        {/* Outcomes — Mobile slider, Desktop grid */}
        <Box display={{ base: "block", md: "none" }}>
          <OutcomesSlider />
        </Box>
        <SimpleGrid
          display={{ base: "none", md: "grid" }}
          columns={{ md: 2 }}
          gap={6}
        >
          {outcomes.map(({ icon: Icon, title, description }, idx) => (
            <OutcomeCard
              key={idx}
              Icon={Icon}
              title={title}
              description={description}
            />
          ))}
        </SimpleGrid>
      </Box>
    </Box>
  );
}

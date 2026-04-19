"use client";

import { useEffect, useRef, useState } from "react";
import { Box, VStack, Heading, Text, SimpleGrid, HStack } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import {
  TrendDown,
  Brain,
  Warning,
  Clock,
  Users,
  ChartLine,
} from "@phosphor-icons/react/dist/ssr";

const SNT_PURPLE = "#8B5CF6";
const SNT_PURPLE_DARK = "#7C3AED";
const ACCENT = "239, 68, 68"; // soft red for problem framing

const problems = [
  {
    icon: TrendDown,
    title: "Du bist inkonsistent",
    description:
      "Mal ein guter Monat, dann wieder alles verloren. Du weißt, dass du es kannst, aber du kannst es nicht reproduzieren. Jeden Monat dieselbe Achterbahn.",
    highlight:
      "Das kostet dich nicht nur Geld. Es kostet dich deinen Glauben an dich selbst.",
  },
  {
    icon: Brain,
    title: "Emotionen zerstören deinen Trade",
    description:
      "FOMO lässt dich zu spät einsteigen. Angst lässt dich zu früh aussteigen. Ärger bringt dich dazu, Revenge Trades einzugehen. Dein Kopf sabotiert, was deine Analyse richtig sieht.",
    highlight: "Trading ist 20% Strategie und 80% Psychologie.",
  },
  {
    icon: Warning,
    title: "Kein System, das wirklich funktioniert",
    description:
      "Du hast YouTube-Videos geschaut, Kurse gemacht, Indikatoren ausprobiert. Aber nichts hält sich durch die Marktphasen. Kein Setup, das du wirklich blind vertraust.",
    highlight: "Ein Trading-System ist kein Trick. Es ist eine Denkweise.",
  },
  {
    icon: Clock,
    title: "Du verlierst Jahre, nicht Tage",
    description:
      "Jeder Monat ohne Klarheit ist ein Monat, in dem andere voranschreiten. Du weißt, wo du hin willst, aber der Weg dorthin bleibt unklar. Die Zeit läuft.",
    highlight:
      "Ohne klaren Plan wirst du in 2 Jahren noch am gleichen Punkt stehen.",
  },
  {
    icon: Users,
    title: "Du bist alleine auf dem Weg",
    description:
      "In deinem Umfeld versteht niemand, warum dir das wichtig ist. Kein Mentor, dem du wirklich vertraust. Keine Community, die dich wirklich pusht. Du kämpfst alleine.",
    highlight:
      "Wachstum passiert nicht im Stillen. Es braucht das richtige Umfeld.",
  },
  {
    icon: ChartLine,
    title: "Du stagnierst trotz harter Arbeit",
    description:
      "Du investierst Zeit, Energie und Kapital. Aber die Ergebnisse stagnieren. Du weißt, dass du mehr drauf hast, doch irgendetwas blockiert dich. Du bist auf einem Plateau gefangen.",
    highlight: "Mehr Fleiß ohne das richtige System = mehr Frustration.",
  },
];

const float = keyframes({
  "0%, 100%": { transform: "translateY(0)" },
  "50%": { transform: "translateY(-2px)" },
});

interface ProblemCardProps {
  Icon: React.ComponentType<any>;
  title: string;
  description: string;
  highlight: string;
  num: string;
}

function ProblemCard({ Icon, title, description, highlight, num }: ProblemCardProps) {
  return (
    <Box
      position="relative"
      role="group"
      p={{ base: 6, md: 7 }}
      borderRadius="2xl"
      bg="rgba(10, 14, 22, 0.78)"
      backdropFilter="blur(16px)"
      border="1px solid rgba(255,255,255,0.06)"
      overflow="hidden"
      transition="all 0.35s cubic-bezier(0.22, 1, 0.36, 1)"
      cursor="default"
      h="full"
      _hover={{
        borderColor: `rgba(${ACCENT}, 0.45)`,
        bg: "rgba(15, 18, 28, 0.92)",
        transform: "translateY(-4px)",
        boxShadow: `0 18px 50px rgba(${ACCENT}, 0.18), 0 0 0 1px rgba(${ACCENT}, 0.15)`,
      }}
    >
      {/* Top gradient line accent */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        h="2px"
        background={`linear-gradient(90deg, transparent, rgba(${ACCENT}, 0.6), ${SNT_PURPLE}, transparent)`}
        opacity={0.5}
        transition="opacity 0.35s ease"
        _groupHover={{ opacity: 1 }}
      />

      {/* Big background number, much more prominent */}
      <Text
        position="absolute"
        top={{ base: -2, md: -3 }}
        right={{ base: 3, md: 4 }}
        fontSize={{ base: "7xl", md: "8xl" }}
        fontWeight="900"
        fontFamily="mono"
        lineHeight="1"
        color="transparent"
        background={`linear-gradient(180deg, rgba(${ACCENT}, 0.55) 0%, rgba(${ACCENT}, 0.18) 70%, transparent 100%)`}
        backgroundClip="text"
        css={{
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          WebkitTextStroke: `1px rgba(${ACCENT}, 0.35)`,
        }}
        textShadow={`0 0 24px rgba(${ACCENT}, 0.25)`}
        pointerEvents="none"
        userSelect="none"
        transition="all 0.35s ease"
        _groupHover={{
          background: `linear-gradient(180deg, rgba(${ACCENT}, 0.85) 0%, ${SNT_PURPLE} 100%)`,
          WebkitBackgroundClip: "text",
          WebkitTextStroke: `1px rgba(139, 92, 246, 0.5)`,
        }}
      >
        {num}
      </Text>

      {/* Corner glow */}
      <Box
        position="absolute"
        top={0}
        right={0}
        w="180px"
        h="180px"
        background={`radial-gradient(circle at top right, rgba(${ACCENT}, 0.18) 0%, transparent 65%)`}
        pointerEvents="none"
        opacity={0.8}
        transition="opacity 0.35s ease"
        _groupHover={{ opacity: 1 }}
      />

      <VStack align="start" gap={4} position="relative">
        <Box
          position="relative"
          p="14px"
          borderRadius="xl"
          background={`linear-gradient(135deg, rgba(${ACCENT}, 0.18) 0%, rgba(${ACCENT}, 0.05) 100%)`}
          border={`1px solid rgba(${ACCENT}, 0.3)`}
          boxShadow={`0 4px 20px rgba(${ACCENT}, 0.15), inset 0 1px 0 rgba(255,255,255,0.06)`}
          transition="all 0.35s ease"
          _groupHover={{
            transform: "translateY(-2px)",
            boxShadow: `0 8px 28px rgba(${ACCENT}, 0.3), inset 0 1px 0 rgba(255,255,255,0.1)`,
            animation: `${float} 2.4s ease-in-out infinite`,
          }}
        >
          <Icon size={26} color={`rgba(${ACCENT}, 0.95)`} weight="fill" />
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

        <Text
          fontSize={{ base: "sm", md: "sm" }}
          color="gray.400"
          lineHeight="1.7"
        >
          {description}
        </Text>

        <Box
          position="relative"
          pl={4}
          py={2}
          mt={1}
          borderLeft={`3px solid rgba(${ACCENT}, 0.6)`}
          bg={`linear-gradient(90deg, rgba(${ACCENT}, 0.06) 0%, transparent 100%)`}
          borderRadius="0 6px 6px 0"
          w="full"
          transition="border-color 0.35s ease"
          _groupHover={{ borderLeftColor: SNT_PURPLE }}
        >
          <Text
            fontSize={{ base: "xs", md: "sm" }}
            color="rgba(255, 200, 200, 0.92)"
            fontWeight="semibold"
            lineHeight="1.55"
            fontStyle="italic"
          >
            „{highlight}"
          </Text>
        </Box>
      </VStack>
    </Box>
  );
}

function ProblemsSlider() {
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
          {problems.map(({ icon: Icon, title, description, highlight }, idx) => (
            <Box
              key={idx}
              data-card
              flexShrink={0}
              w="84vw"
              maxW="340px"
              css={{ scrollSnapAlign: "center" }}
            >
              <ProblemCard
                Icon={Icon}
                title={title}
                description={description}
                highlight={highlight}
                num={String(idx + 1).padStart(2, "0")}
              />
            </Box>
          ))}
          {/* trailing spacer so the last card can center */}
          <Box flexShrink={0} w="8vw" />
        </HStack>
      </Box>

      {/* Pagination dots */}
      <HStack justify="center" gap={1.5} mt={5}>
        {problems.map((_, i) => {
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
                  ? `linear-gradient(90deg, rgba(${ACCENT}, 0.9), ${SNT_PURPLE})`
                  : "rgba(255,255,255,0.18)"
              }
              boxShadow={
                active
                  ? `0 0 12px rgba(${ACCENT}, 0.5)`
                  : "none"
              }
              transition="all 0.3s ease"
              cursor="pointer"
              _hover={{ bg: active ? undefined : "rgba(255,255,255,0.35)" }}
            />
          );
        })}
      </HStack>

      {/* Swipe hint (only shown initially) */}
      <Text
        textAlign="center"
        fontSize="2xs"
        color="gray.600"
        mt={2}
        letterSpacing="wider"
        textTransform="uppercase"
        opacity={activeIndex === 0 ? 1 : 0}
        transition="opacity 0.3s ease"
      >
        ← Wischen für mehr →
      </Text>
    </Box>
  );
}

export function ProtocolProblems() {
  return (
    <Box
      as="section"
      w="full"
      py={{ base: 16, md: 24 }}
      px={{ base: 4, md: 8 }}
      bg="black"
      position="relative"
      overflow="hidden"
      background={`radial-gradient(at 50% 0%, rgba(${ACCENT}, 0.05) 0px, transparent 60%),
        radial-gradient(at 100% 100%, rgba(139, 92, 246, 0.04) 0px, transparent 60%),
        linear-gradient(180deg, rgba(6,10,20,1) 0%, rgba(0,0,0,1) 100%)`}
    >
      <Box maxW="1200px" mx="auto" position="relative">
        <VStack gap={5} mb={{ base: 12, md: 16 }} textAlign="center">
          <Text
            color={`rgba(${ACCENT}, 0.95)`}
            fontSize={{ base: "xs", md: "sm" }}
            fontWeight="bold"
            textTransform="uppercase"
            letterSpacing="widest"
            textShadow={`0 0 12px rgba(${ACCENT}, 0.5)`}
          >
            Erkennst du dich wieder?
          </Text>
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
              Die Probleme, die
            </Box>
            <Box
              as="span"
              display="inline-block"
              mt={{ base: 2, md: 3 }}
              px={{ base: 3, md: 4 }}
              py={{ base: 1, md: 2 }}
              borderRadius="lg"
              background={`linear-gradient(90deg, rgba(${ACCENT}, 0.18), rgba(${ACCENT}, 0.05) 95%)`}
              color="white"
              border={`1px solid rgba(${ACCENT}, 0.35)`}
              boxShadow={`0 0 28px rgba(${ACCENT}, 0.18), inset 0 0 12px rgba(${ACCENT}, 0.08)`}
              backdropFilter="blur(8px)"
            >
              99% der Trader
            </Box>
            <Box as="span" display="block" mt={{ base: 2, md: 3 }}>
              stoppen
            </Box>
          </Heading>
        </VStack>

        {/* Mobile: horizontal snap slider */}
        <Box display={{ base: "block", md: "none" }}>
          <ProblemsSlider />
        </Box>

        {/* Desktop: grid */}
        <SimpleGrid
          display={{ base: "none", md: "grid" }}
          columns={{ md: 2, lg: 3 }}
          gap={6}
        >
          {problems.map(({ icon: Icon, title, description, highlight }, idx) => (
            <ProblemCard
              key={idx}
              Icon={Icon}
              title={title}
              description={description}
              highlight={highlight}
              num={String(idx + 1).padStart(2, "0")}
            />
          ))}
        </SimpleGrid>
      </Box>
    </Box>
  );
}

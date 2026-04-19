"use client";

import { useEffect, useRef, useState } from "react";
import { Box, VStack, HStack, Heading, Text, SimpleGrid } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";

const SNT_PURPLE = "#8B5CF6";

const glowPulse = keyframes({
  "0%, 100%": { textShadow: `0 0 20px rgba(139, 92, 246,0.4)` },
  "50%": { textShadow: `0 0 40px rgba(139, 92, 246,0.8), 0 0 80px rgba(139, 92, 246,0.3)` },
});

const stats = [
  { value: 1000, suffix: "+", label: "Trader ausgebildet", sublabel: "Seit Gründung von SNT" },
  { value: 10, suffix: "K+", label: "Follower auf Social Media", sublabel: "Täglich wachsende Community" },
  { value: 6, suffix: "+", label: "Jahre Markterfahrung", sublabel: "Live-Trading seit 2018" },
  { value: 100, suffix: "%", label: "Persönliche Betreuung", sublabel: "Direkt von Ali" },
];

function useCountUp(target: number, duration: number, triggered: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!triggered) return;
    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, triggered]);
  return count;
}

function StatCard({
  value,
  suffix,
  label,
  sublabel,
  delay,
  triggered,
}: {
  value: number;
  suffix: string;
  label: string;
  sublabel: string;
  delay: number;
  triggered: boolean;
}) {
  const count = useCountUp(value, 2000, triggered);
  return (
    <Box
      p={{ base: 6, md: 8 }}
      borderRadius="2xl"
      bg="rgba(6,10,20,0.8)"
      backdropFilter="blur(20px)"
      border="1px solid rgba(139, 92, 246,0.2)"
      textAlign="center"
      position="relative"
      overflow="hidden"
      transition="all 0.3s"
      _hover={{
        borderColor: "rgba(139, 92, 246,0.5)",
        transform: "translateY(-4px)",
        boxShadow: "0 20px 60px rgba(139, 92, 246,0.15)",
      }}
    >
      <Box
        position="absolute"
        inset="0"
        background="radial-gradient(circle at 50% 50%, rgba(139, 92, 246,0.04) 0%, transparent 70%)"
        pointerEvents="none"
      />
      <VStack gap={2} position="relative">
        <Text
          fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
          fontWeight="900"
          color="white"
          lineHeight="1"
          fontFamily="mono"
          animation={`${glowPulse} 3s ease-in-out infinite`}
          style={{ animationDelay: `${delay}ms` }}
        >
          {count}
          <Box as="span" color={SNT_PURPLE}>{suffix}</Box>
        </Text>
        <Text fontSize="md" fontWeight="bold" color="white" lineHeight="tight">
          {label}
        </Text>
        <Text fontSize="sm" color="gray.500" lineHeight="1.4">
          {sublabel}
        </Text>
      </VStack>
    </Box>
  );
}

export function ProtocolStats() {
  const [triggered, setTriggered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTriggered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Box
      as="section"
      ref={ref}
      w="full"
      py={{ base: 16, md: 24 }}
      px={{ base: 4, md: 8 }}
      position="relative"
      overflow="hidden"
      background="radial-gradient(at 50% 50%, rgba(139, 92, 246,0.07) 0px, transparent 60%),
        linear-gradient(180deg, rgba(6,10,20,1) 0%, rgba(0,0,0,1) 100%)"
    >
      <Box maxW="1200px" mx="auto">
        <VStack gap={4} mb={14} textAlign="center">
          <Text
            color={SNT_PURPLE}
            fontSize="sm"
            fontWeight="bold"
            textTransform="uppercase"
            letterSpacing="widest"
            textShadow="0 0 12px rgba(139, 92, 246,0.5)"
          >
            Zahlen die für sich sprechen
          </Text>
          <Heading
            as="h2"
            fontSize={{ base: "2xl", md: "4xl" }}
            fontWeight="900"
            color="white"
            textAlign="center"
            lineHeight="tight"
            maxW="600px"
          >
            Was SNT in Zahlen bedeutet
          </Heading>
          <Text color="gray.500" maxW="450px" fontSize="md" lineHeight="1.7">
            Kein Versprechen. Nur Fakten, die durch jahrelange Arbeit entstanden sind.
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 2, md: 4 }} gap={4}>
          {stats.map(({ value, suffix, label, sublabel }, idx) => (
            <StatCard
              key={idx}
              value={value}
              suffix={suffix}
              label={label}
              sublabel={sublabel}
              delay={idx * 200}
              triggered={triggered}
            />
          ))}
        </SimpleGrid>

        {/* Glow divider */}
        <Box
          mt={16}
          h="1px"
          background="linear-gradient(90deg, transparent, rgba(139, 92, 246,0.5), transparent)"
          boxShadow="0 0 20px rgba(139, 92, 246,0.3)"
        />
      </Box>
    </Box>
  );
}

"use client";

import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Stack,
  Button,
  Icon,
} from "@chakra-ui/react";
import { useState } from "react";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { Link } from "@/components/ui/link";
import { authConfig } from "@/config/auth-config";

interface PricingToggleProps {
  value: "monthly" | "lifetime";
  onChange: (value: "monthly" | "lifetime") => void;
}

const PricingToggle = ({ value, onChange }: PricingToggleProps) => {
  return (
    <HStack
      gap={0}
      bg="rgba(10, 14, 10, 0.8)"
      borderRadius="xl"
      p="4px"
      border="1px solid rgba(34, 197, 94, 0.25)"
      backdropFilter="blur(12px)"
      boxShadow="0 8px 32px 0 rgba(34, 197, 94, 0.15)"
    >
      <Button
        variant={value === "monthly" ? "solid" : "ghost"}
        bg={value === "monthly" ? "#22c55e" : "transparent"}
        color={value === "monthly" ? "white" : "gray.300"}
        _hover={{
          bg: value === "monthly" ? "#16a34a" : "rgba(255, 255, 255, 0.1)",
        }}
        onClick={() => onChange("monthly")}
        borderRadius="lg"
        px={6}
        py={2}
        fontSize="sm"
        fontWeight="medium"
      >
        Monatlich
      </Button>
      <Button
        variant={value === "lifetime" ? "solid" : "ghost"}
        bg={value === "lifetime" ? "#22c55e" : "transparent"}
        color={value === "lifetime" ? "white" : "gray.300"}
        _hover={{
          bg: value === "lifetime" ? "#16a34a" : "rgba(255, 255, 255, 0.1)",
        }}
        onClick={() => onChange("lifetime")}
        borderRadius="lg"
        px={6}
        py={2}
        fontSize="sm"
        fontWeight="medium"
      >
        Lifetime (200€ sparen!)
      </Button>
    </HStack>
  );
};

export const Project30PricingSection = () => {
  const [pricingMode, setPricingMode] = useState<"monthly" | "lifetime">("lifetime");

  const features = [
    { title: "Umfassendes Video-Training auf Abruf", icon: CheckCircle },
    { title: "Live-Mentoring mit erfahrenen Tradern", icon: CheckCircle },
    { title: "Exklusive Trading-Tools & Software", icon: CheckCircle },
    { title: "Interaktive Community mit Gleichgesinnten", icon: CheckCircle },
    { title: "Persönliche Betreuung & Feedback", icon: CheckCircle },
    { title: "Strukturierte NEFS Trading-Strategie", icon: CheckCircle },
    { title: "Wöchentliche Live-Marktanalysen", icon: CheckCircle },
    { title: "24/7 Community-Support", icon: CheckCircle },
    { title: "Aufgezeichnete Sessions zum Nachschauen", icon: CheckCircle },
    { title: "Lebenslanger Zugang (bei Lifetime)", icon: CheckCircle },
  ];

  const currentPrice = pricingMode === "monthly" ? "44.90€" : "247€";
  const originalPrice = pricingMode === "lifetime" ? "567€" : null;
  const currentPeriod = pricingMode === "monthly" ? "/Monat" : "";
  const savingsText = pricingMode === "lifetime" ? "230€ gespart!" : null;
  const currentPlanUid = pricingMode === "monthly" 
    ? authConfig.plans.monatlich.uid 
    : authConfig.plans.lifetime.uid;

  return (
    <Box
      w="100%"
      minH="100vh"
      background="radial-gradient(at 0% 100%, rgba(34, 197, 94, 0.28) 0px, transparent 55%),
        radial-gradient(at 100% 0%, rgba(16, 185, 129, 0.22) 0px, transparent 55%),
        linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(10,12,10,1) 100%)"
      py={{ base: 16, md: 24 }}
      px={{ base: 4, md: 8 }}
      position="relative"
    >
      <VStack gap={12} maxW="800px" mx="auto">
        {/* Header */}
        <VStack gap={6} textAlign="center">
          <VStack gap={4} textAlign="center">
            <Box
              bg="rgba(34, 197, 94, 0.1)"
              px={6}
              py={2}
              borderRadius="full"
              border="1px solid rgba(34, 197, 94, 0.3)"
              backdropFilter="blur(10px)"
            >
              <Text
                color="#22c55e"
                fontSize="sm"
                fontWeight="bold"
                textTransform="uppercase"
                letterSpacing="wider"
                textShadow="0 0 10px rgba(34, 197, 94, 0.5)"
              >
                WANN WENN NICHT JETZT?
              </Text>
            </Box>
            <Heading
              as="h2"
              fontSize={{ base: "3xl", md: "5xl" }}
              fontWeight="bold"
              color="white"
              lineHeight="tight"
              textShadow="0 2px 4px rgba(0,0,0,0.3)"
            >
              Werde Teil des{" "}
              <Box
                as="span"
                background="linear-gradient(90deg, rgba(34,197,94,0.3), transparent 95%)"
                color="#22c55e"
                px={3}
                py={1}
                borderRadius="md"
                fontWeight="bold"
                display="inline-block"
                border="1px solid rgba(34, 197, 94, 0.4)"
                boxShadow="0 0 20px rgba(34, 197, 94, 0.3)"
                textShadow="0 0 15px rgba(34, 197, 94, 0.6)"
              >
                SNT-PREMIUM
              </Box>
            </Heading>
          </VStack>

          {/* Toggle */}
          <PricingToggle value={pricingMode} onChange={setPricingMode} />
        </VStack>

        {/* Pricing Card */}
        <Box
          w="100%"
          maxW="500px"
          mx="auto"
          position="relative"
        >
          {/* Project 30 Badge */}
          <Box
            position="absolute"
            top="-12px"
            left="50%"
            transform="translateX(-50%)"
            zIndex={10}
          >
            <Box
              bg="#22c55e"
              color="white"
              px={8}
              py={2}
              borderRadius="full"
              fontSize="xs"
              fontWeight="bold"
              boxShadow="0 4px 24px rgba(34, 197, 94, 0.4)"
              textShadow="0 0 8px rgba(255, 255, 255, 0.3)"
              whiteSpace="nowrap"
              minW="fit-content"
            >
              {pricingMode === "lifetime" ? "🔥 SONDERANGEBOT" : "SNT-PREMIUM"}
            </Box>
          </Box>

          {/* Main Card */}
          <Box
            bg="rgba(10, 14, 10, 0.9)"
            backdropFilter="blur(20px)"
            borderRadius="2xl"
            p={8}
            pt={12}
            border="2px solid"
            borderColor="rgba(34, 197, 94, 0.3)"
            boxShadow="0 25px 50px -12px rgba(34, 197, 94, 0.25), 
                       0 0 0 1px rgba(34, 197, 94, 0.1) inset"
            position="relative"
            overflow="hidden"
          >
            {/* Background glow effect */}
            <Box
              position="absolute"
              top="0"
              left="0"
              right="0"
              bottom="0"
              background="radial-gradient(circle at 50% 0%, rgba(34, 197, 94, 0.1) 0%, transparent 70%)"
              pointerEvents="none"
            />

            <VStack gap={6} position="relative" zIndex={1}>
              {/* Plan Title */}
              <VStack gap={2} textAlign="center">
                <Heading as="h3" fontSize="2xl" color="white" fontWeight="bold">
                  SNTTRADES PREMIUM
                </Heading>
                <Text color="rgba(34, 197, 94, 0.8)" fontSize="sm" fontWeight="medium">
                  {pricingMode === "lifetime" 
                    ? "⏰ Limitiertes Angebot - Spare 200€ beim Lifetime-Zugang!" 
                    : "Flexibler monatlicher Zugang zur kompletten Trading-Ausbildung"
                  }
                </Text>
              </VStack>

              {/* Price */}
              <VStack gap={2} textAlign="center">
                {originalPrice && (
                  <HStack gap={2} align="center" justify="center">
                    <Text
                      fontSize="xl"
                      fontWeight="bold"
                      color="red.400"
                      textDecoration="line-through"
                    >
                      {originalPrice}
                    </Text>
                    <Box
                      bg="red.500"
                      color="white"
                      px={3}
                      py={1}
                      borderRadius="md"
                      fontSize="xs"
                      fontWeight="bold"
                    >
                      {savingsText}
                    </Box>
                  </HStack>
                )}
                <HStack gap={1} align="baseline" justify="center">
                  <Text
                    fontSize="5xl"
                    fontWeight="bold"
                    color="#22c55e"
                    textShadow="0 0 20px rgba(34, 197, 94, 0.5)"
                  >
                    {currentPrice}
                  </Text>
                  <Text color="gray.300" fontSize="lg">
                    {currentPeriod}
                  </Text>
                </HStack>
                {pricingMode === "lifetime" && (
                  <Text color="rgba(34, 197, 94, 0.8)" fontSize="sm" fontWeight="medium">
                    ✨ Einmalig zahlen, für immer lernen
                  </Text>
                )}
              </VStack>

              {/* Features */}
              <VStack gap={4} w="100%" align="stretch">
                {features.map((feature, index) => (
                  <HStack key={index} gap={3} align="center">
                    <Icon
                      as={feature.icon}
                      color="#22c55e"
                      boxSize={5}
                      flexShrink={0}
                    />
                    <Text color="gray.200" fontSize="sm" fontWeight="medium">
                      {feature.title}
                    </Text>
                  </HStack>
                ))}
              </VStack>

              {/* CTA Button */}
              <Box w="100%" pt={4}>
                <Link href={pricingMode === "monthly" ? "/checkout/monthly" : "/checkout/lifetime"} style={{ width: "100%" }}>
                  <Button
                    size="xl"
                    w="100%"
                    bg="#22c55e"
                    color="white"
                    fontWeight="bold"
                    fontSize="lg"
                    py={6}
                    borderRadius="xl"
                    _hover={{
                      bg: "#16a34a",
                      transform: "translateY(-2px)",
                      boxShadow: "0 20px 40px rgba(34, 197, 94, 0.4)",
                    }}
                    transition="all 0.3s ease"
                    boxShadow="0 10px 30px rgba(34, 197, 94, 0.3)"
                    textShadow="0 0 8px rgba(255, 255, 255, 0.3)"
                  >
                    ⚡ JETZT STARTEN
                  </Button>
                </Link>
              </Box>
            </VStack>
          </Box>
        </Box>

        {/* Bottom Features */}
        <HStack
          gap={8}
          justify="center"
          flexWrap="wrap"
          color="gray.300"
          fontSize="sm"
        >
          <HStack gap={2}>
            <Icon as={CheckCircle} color="#22c55e" boxSize={4} />
            <Text>Sichere Zahlungen</Text>
          </HStack>
          <HStack gap={2}>
            <Icon as={CheckCircle} color="#22c55e" boxSize={4} />
            <Text>Jederzeit kündbar</Text>
          </HStack>
        </HStack>
      </VStack>
    </Box>
  );
};

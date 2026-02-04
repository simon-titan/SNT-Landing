"use client";

import { useState, useEffect } from "react";
import { Box, HStack, Text } from "@chakra-ui/react";
import { Clock } from "@phosphor-icons/react/dist/ssr";

const SNT_BLUE = "#068CEF";

export function LifetimeCountdownBanner() {
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);

  // Countdown Timer für Lifetime Deadline
  useEffect(() => {
    const calculateDaysRemaining = () => {
      const deadline = new Date("2026-02-09T23:59:59");
      const now = new Date();
      const diffTime = deadline.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDaysRemaining(Math.max(0, diffDays));
    };

    calculateDaysRemaining();
    const interval = setInterval(calculateDaysRemaining, 1000 * 60 * 60); // Update every hour

    return () => clearInterval(interval);
  }, []);

  if (daysRemaining === null || daysRemaining <= 0) {
    return null;
  }

  return (
    <Box
      bg="rgba(6, 140, 239, 0.15)"
      borderBottom="1px solid rgba(6, 140, 239, 0.3)"
      borderTop="1px solid rgba(6, 140, 239, 0.3)"
      px={4}
      py={1.5}
      w="full"
      maxW="100vw"
    >
      <HStack gap={2} align="center" justify="center" maxW="100%">
        <Clock size={14} weight="fill" color={SNT_BLUE} />
        <Text color="white" fontSize="xs" fontWeight="semibold" textAlign="center" whiteSpace="nowrap">
          Letzte Chance auf Lifetime! Noch {daysRemaining} {daysRemaining === 1 ? "Tag" : "Tage"}
        </Text>
      </HStack>
    </Box>
  );
}

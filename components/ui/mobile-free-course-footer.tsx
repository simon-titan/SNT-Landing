"use client";

import { useState } from "react";
import { Box, HStack, VStack, Button, Text } from "@chakra-ui/react";
import { Lock } from "@phosphor-icons/react/dist/ssr";
import { RegistrationModal } from "./registration-modal";

const SNT_BLUE = "#068CEF";

export function MobileFreeCourseFooter() {
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);

  const handleJoin = () => {
    setIsRegistrationModalOpen(true);
  };

  return (
    <>
      {/* Mobile Footer - nur auf Mobile sichtbar */}
      <Box
        position="fixed"
        bottom="0"
        left="0"
        right="0"
        zIndex={999999}
        bg="rgba(0, 0, 0, 0.95)"
        backdropFilter="blur(20px)"
        borderTop="1px solid rgba(59, 130, 246, 0.3)"
        boxShadow="0 -8px 32px rgba(0, 0, 0, 0.4)"
        display={{ base: "block", md: "none" }}
        p={4}
      >
        <VStack gap={3} w="full" maxW="400px" mx="auto">
          {/* Titel */}
          <VStack gap={1} textAlign="center">
            <Text fontSize="sm" fontWeight="bold" color="white">
              Kostenloser Trading-Kurs
            </Text>
            <Text fontSize="xs" color="gray.300">
              Starte deine Trading-Reise jetzt!
            </Text>
          </VStack>

          {/* CTA Button */}
          <Button
            w="full"
            h="48px"
            bg={SNT_BLUE}
            color="white"
            fontSize="md"
            fontWeight="bold"
            borderRadius="lg"
            _hover={{ bg: "#0572c2" }}
            onClick={handleJoin}
            boxShadow="0 4px 20px rgba(6, 140, 239, 0.4)"
          >
            <HStack gap={2} align="center" justify="center">
              <Lock size={16} weight="fill" />
              <Text fontSize="md" whiteSpace="nowrap">
                KOSTENLOS ANMELDEN
              </Text>
            </HStack>
          </Button>

          {/* Zusätzliche Info */}
          <Text fontSize="2xs" color="gray.400" textAlign="center">
            100% kostenlos • Keine Kreditkarte erforderlich
          </Text>
        </VStack>
      </Box>

      {/* Registration Modal */}
      <RegistrationModal
        isOpen={isRegistrationModalOpen}
        onClose={() => setIsRegistrationModalOpen(false)}
        planUid="wmjBBxmV"
      />

      {/* Spacer für Mobile Footer */}
      <Box h="120px" display={{ base: "block", md: "none" }} />
    </>
  );
}
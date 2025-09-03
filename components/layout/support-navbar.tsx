"use client";

import { Box, HStack, Heading } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";

export const SupportNavbar = () => {
  return (
    <Box px="0" py="0" m="0" w="100vw" position="fixed" top="0" left="0" zIndex="docked">
      <Box
        as="header"
        w="100vw"
        background="#000000"
        px="0"
        py="1"
        boxShadow="0 14px 40px -14px rgba(73,231,156,0.55)"
        borderBottom="1px solid rgba(73,231,156,0.25)"
      >
        <Box w={{ base: "100%", md: "80%" }} mx="auto" px="4" py="2">
          <HStack justify="space-between" w="full">
            <Heading
              as="h1"
              fontSize={{ base: "md", md: "lg" }}
              fontWeight="800"
              fontFamily="var(--font-horizon), Inter, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
              lineHeight="0.9"
              color="#49E79C"
              textShadow="0 0 10px rgba(73,231,156,0.75), 0 0 22px rgba(73,231,156,0.35)"
            >
              SNTTRADES
            </Heading>

            <HStack gap="2">
              <a href="https://snt-mentorship-platform.de" target="_blank" rel="noopener noreferrer">
                <Button
                  size="xs"
                  height="28px"
                  fontSize="xs"
                  bg="rgba(73,231,156,0.08)"
                  color="#49E79C"
                  border="1px solid rgba(73,231,156,0.45)"
                  backdropFilter="blur(10px) saturate(160%)"
                  boxShadow="0 0 20px rgba(73,231,156,0.35), inset 0 0 12px rgba(73,231,156,0.15)"
                  _hover={{ bg: "rgba(73,231,156,0.16)", boxShadow: "0 0 26px rgba(73,231,156,0.5), inset 0 0 14px rgba(73,231,156,0.2)" }}
                  _active={{ bg: "rgba(73,231,156,0.22)", boxShadow: "0 0 18px rgba(73,231,156,0.45), inset 0 0 10px rgba(73,231,156,0.22)" }}
                >
                  PLATFORM LOGIN
                </Button>
              </a>
            </HStack>
          </HStack>
        </Box>
      </Box>
    </Box>
  );
};

export default SupportNavbar;



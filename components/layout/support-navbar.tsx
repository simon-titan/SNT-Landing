"use client";

import { Box, HStack, Heading } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";

const SNT_BLUE = "#068CEF";

export const SupportNavbar = () => {
  const handleRegisterClick = () => {
    // Dispatch custom event to open modal
    window.dispatchEvent(new CustomEvent("openRegistrationModal"));
  };

  return (
    <Box px="0" py="0" m="0" w="100vw" position="fixed" top="0" left="0" zIndex="docked">
      <Box
        as="header"
        w="100vw"
        background="black"
        px="0"
        py="1"
        borderBottom={`1px solid ${SNT_BLUE}`}
      >
        <Box w={{ base: "100%", md: "80%" }} mx="auto" px="4" py="2">
          <HStack justify="space-between" w="full">
            <Heading
              as="h1"
              fontSize={{ base: "md", md: "lg" }}
              fontWeight="800"
              fontFamily="var(--font-horizon), Inter, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
              lineHeight="0.9"
              color="white"
              textShadow="none"
            >
              SNTTRADES
            </Heading>

            <HStack gap="2">
              <Button
                size="xs"
                height="28px"
                fontSize="xs"
                bg={SNT_BLUE}
                color="white"
                border="1px solid transparent"
                onClick={handleRegisterClick}
                _hover={{ 
                  bg: "#0572c2", 
                }}
                _active={{ 
                  bg: "#0465b8", 
                }}
                transition="all 0.3s ease"
              >
                JETZT STARTEN
              </Button>
            </HStack>
          </HStack>
        </Box>
      </Box>
    </Box>
  );
};

export default SupportNavbar;



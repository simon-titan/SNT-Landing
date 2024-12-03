"use client";

import { Container, VStack, Center } from "@chakra-ui/react";

export default function Support() {
  return (
    <Center h="dvh" w="dvw">
      <Container py={{ base: "16", md: "24" }}>
        <VStack gap="6" textAlign="center" maxW="lg" mx="auto">
          <VStack gap="4">
            <div key="support">
              <div data-o-support="1" data-mode="embed"></div>
            </div>
          </VStack>
        </VStack>
      </Container>
    </Center>
  );
}

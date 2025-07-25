"use client";

import { Button, Flex, Box } from "@chakra-ui/react";

export default function ChoosePlatformPage() {
  return (
    <Box
      minH="100vh"
      w="100vw"
      display="flex"
      alignItems="center"
      justifyContent="center"
      background="linear-gradient(274deg,rgba(17, 92, 0, 1) 0%, rgba(0, 0, 0, 1) 50%, rgba(31, 48, 102, 1) 100%);"
    >
      <Flex
        direction={{ base: "column", md: "row" }}
        w="full"
        maxW="1200px"
        justify="space-between"
        align="center"
        px={{ base: 4, md: 16 }}
        py={12}
        gap={{ base: 8, md: 0 }}
      >
        <a
          href="https://www.snt-mentorship-platform.de"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none" }}
        >
          <Button
            size="lg"
            colorScheme="blue"
            fontWeight="bold"
            fontSize="2xl"
            px={10}
            py={8}
            borderRadius="xl"
            boxShadow="lg"
          >
            SNT-MENTORSHIP
          </Button>
        </a>
        <a
          href="https://www.snt-elitetrades-platform.de"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none" }}
        >
          <Button
            size="lg"
            background="green.500"
            fontWeight="bold"
            fontSize="2xl"
            px={10}
            py={8}
            borderRadius="xl"
            boxShadow="lg"
          >
            SNT-ELITETRADES
          </Button>
        </a>
      </Flex>
    </Box>
  );
} 
"use client";

import { Navbar } from "@/components/layout/navbar";
import { Container, Box, Heading } from "@chakra-ui/react";
import { generateMetadata } from "@/utils/metadata";

export default function App() {
  return (
    <Container py={{ base: "16", md: "24" }}>
      <Box pt="28">
        <Heading>App Page</Heading>
      </Box>
    </Container>
  );
}

export const metadata = generateMetadata({
  title: "Dashboard",
  description: "Access your personal dashboard and manage your account",
  noIndex: true,
});

"use client";

import { Navbar } from "@/components/layout/navbar";
import { Container, Box, Heading } from "@chakra-ui/react";

export default function App() {
  return (
    <Container py={{ base: "16", md: "24" }}>
      <Box pt="28">
        <Navbar />
        <Heading>App Page</Heading>
      </Box>
    </Container>
  );
}

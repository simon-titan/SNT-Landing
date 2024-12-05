import { Box, Container } from "@chakra-ui/react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box pt="28">
      <Navbar />
      <Container py={{ base: "16", md: "24" }}>{children}</Container>
      <Footer />
    </Box>
  );
}

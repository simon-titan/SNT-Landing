import { Button } from "@/components/ui/button";
import { Section } from "@/components/layout/section";
import { generateMetadata } from "@/utils/metadata";
import { Heading, VStack, Box, Container } from "@chakra-ui/react";
import { Login } from "@/components/auth/embed";

export const metadata = generateMetadata({
  title: "Login Embed Demo",
  description: "See how the login embed works in both popup and embedded modes",
});

export default function LoginEmbedPage() {
  return (
    <>
      <Section
        header
        bg="bg.muted"
        borderBottomColor="border"
        borderBottomWidth="1px"
      >
        <VStack gap={{ base: "6", md: "8" }} textAlign="center">
          <VStack gap={{ base: "5", md: "6" }}>
            <VStack gap={{ base: "3", md: "4" }}>
              <Heading as="h1" textStyle={{ base: "4xl", md: "5xl" }}>
                Login Embed
              </Heading>
            </VStack>
          </VStack>
        </VStack>
      </Section>
      <Section>
        <VStack gap={8}>
          <Heading size="3xl">Popup</Heading>
          <Login popup>
            <Button size="lg">Open Login Popup</Button>
          </Login>
          <Heading size="3xl">On page</Heading>
          <Box w="full" p={6} borderWidth="1px" borderRadius="lg" bg="bg.muted">
            <Login />
          </Box>
        </VStack>
      </Section>
    </>
  );
}

"use client";

import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  Center,
} from "@chakra-ui/react";
import { siteConfig } from "@/config/site";
import { ArrowLeft } from "@phosphor-icons/react";
import { Link } from "@/components/ui/link";
import Fireworks from "react-canvas-confetti/dist/presets/fireworks";
import { generateMetadata } from "@/utils/metadata";

export const metadata = generateMetadata({
  title: "Thank You",
  description:
    "Thank you for signing up. Please check your email to complete registration",
  noIndex: true,
});

export default function ThankYouPage() {
  return (
    <div>
      <Center h="dvh" w="dvw">
        <Fireworks
          autorun={{ speed: 3, duration: 1000 }}
          style={{
            position: "fixed",
            pointerEvents: "none",
            width: "100%",
            height: "100%",
            top: 0,
            left: 0,
          }}
        />
        <Container py={{ base: "16", md: "24" }}>
          <VStack gap="6" textAlign="center" maxW="lg" mx="auto">
            <VStack gap="4">
              <Heading
                as="h1"
                textStyle={{ base: "3xl", md: "4xl" }}
                lineHeight="tight"
              >
                Great, now check your inbox!
              </Heading>
              <Text
                color="fg.muted"
                textStyle={{ base: "md", md: "lg" }}
                maxW="md"
              >
                We just sent you an email to complete the sign-up process & set
                your password. Please check your spam folder if you haven't
                received it within a few minutes.
              </Text>
            </VStack>
            <VStack gap="4" maxW="sm">
              <Text color="fg.muted">
                Need some help? Shoot us a note at{" "}
                <Link
                  variant="underline"
                  href={`mailto:${siteConfig.support.email}`}
                  support
                >
                  {siteConfig.support.email}
                </Link>
                . We're here to help!
              </Text>

              {/*   <Button
              as="a"
              href="https://help.outseta.com"
              target="_blank"
              rel="noopener noreferrer"
              size="lg"
              variant="subtle"
            >
              Visit our help center
            </Button> */}
            </VStack>

            <Box pt="4">
              <Link href="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft />
                  Back to home
                </Button>
              </Link>
            </Box>
          </VStack>
        </Container>
      </Center>
    </div>
  );
}

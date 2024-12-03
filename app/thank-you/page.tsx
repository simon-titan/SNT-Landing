"use client";

import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  Center,
  Link,
} from "@chakra-ui/react";
import { siteConfig } from "@/config/site";
import { ArrowLeft } from "@phosphor-icons/react";

export default function ThankYouPage() {
  return (
    <Center h="dvh" w="dvw">
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
            <Button as={Link} href="/" variant="outline" size="sm">
              <ArrowLeft />
              Back to home
            </Button>
          </Box>
        </VStack>
      </Container>
    </Center>
  );
}

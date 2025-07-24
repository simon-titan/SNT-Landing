import {
  Badge,
  For,
  Heading,
  SimpleGrid,
  Text,
  VStack,
  Tabs,
  Center,
} from "@chakra-ui/react";
import { Section } from "@/components/layout/section";

import { generateMetadata } from "@/utils/metadata";

export const metadata = generateMetadata({
  title: "Pricing",
  description: "Explore our pricing plans tailored to your needs.",
});

export default function PricingPage() {
  return (
    <>
      <Section header>
        <VStack gap="12">
          <VStack gap={{ base: "6", md: "8" }} textAlign="center">
            <VStack gap={{ base: "5", md: "6" }}>
              <VStack gap={{ base: "3", md: "4" }}>
                <Heading as="h1" textStyle={{ base: "4xl", md: "5xl" }}>
                  Pricing
                </Heading>
              </VStack>
              <VStack gap="1">
                <Text
                  color="fg.muted"
                  textStyle={{ base: "lg", md: "xl" }}
                  maxW="lg"
                >
                  Transparent pricing with no hidden fees.
                </Text>
                <Text
                  color="fg.muted"
                  textStyle={{ base: "lg", md: "xl" }}
                  maxW="lg"
                >
                  Cancel anytime.
                </Text>
              </VStack>
            </VStack>
          </VStack>
          
        </VStack>
      </Section>
    </>
  );
}

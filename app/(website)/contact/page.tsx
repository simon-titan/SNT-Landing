import { Box, Card, Heading, Text, VStack } from "@chakra-ui/react";
import { Section } from "@/components/layout/section";
import { Image } from "@/components/ui/image";
import { generateMetadata } from "@/utils/metadata";

export const metadata = generateMetadata({
  title: "Contact Us",
  description: "Get in touch with our team for support, feedback, or inquiries",
});

export default function ContactPage() {
  return (
    <>
      <style>{`
        .o--SupportRequestForm--supportRequestForm > .o--SectionGroup--sectionGroup {
          display: none !important;
        }

        .o--SupportRequestForm--supportRequestForm form > div:nth-child(2) {
          display: none !important;
        }

        .o--Widget--widget .o--Button--btn {
          width: 100% !important;
        }
      `}</style>
      <Section
        header
        bg="bg.muted"
        borderBottomColor="border"
        borderBottomWidth="1px"
        pb={28}
      >
        <VStack gap={{ base: "6", md: "8" }} textAlign="center">
          <VStack gap={{ base: "5", md: "6" }}>
            <VStack gap={{ base: "3", md: "4" }}>
              <Heading as="h1" textStyle={{ base: "4xl", md: "5xl" }}>
                Contact us
              </Heading>
            </VStack>
            <Text
              color="fg.muted"
              textStyle={{ base: "lg", md: "xl" }}
              maxW="lg"
            >
              Send us a message if you have question, feedback or an idea. We
              typically reply in 24 hours.
            </Text>
            <Image
              src="https://picsum.photos/seed/1733476138565/500/500"
              alt="Contact"
              width="2xl"
              height="50"
            />
          </VStack>
        </VStack>
      </Section>
      <Section>
        <Card.Root mt={{ base: "-40", md: "-44" }}>
          <Box data-o-support="1" data-mode="embed"></Box>
        </Card.Root>
      </Section>
    </>
  );
}

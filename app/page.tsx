import {
  Box,
  Button,
  Container,
  Heading,
  Stack,
  VStack,
  Text,
} from "@chakra-ui/react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ImagePlaceholder } from "@/components/layout/image-placeholder";
import { LuChevronRight } from "react-icons/lu";

export default async function Page() {
  return (
    <Box pt="28">
      <Navbar />
      <Container py={{ base: "16", md: "24" }}>
        <VStack gap="10" textAlign="center">
          <Stack gap="4">
            <Heading
              as="h1"
              textStyle={{ base: "4xl", md: "6xl" }}
              maxW={{ md: "2xl" }}
              mx="auto"
              lineHeight="tighter"
            >
              Consequat ut laboris non sunt sint
            </Heading>
            <Text
              color="fg.muted"
              textStyle={{ base: "lg", md: "xl" }}
              maxW={{ md: "2xl" }}
              mx="auto"
            >
              Deserunt veniam voluptate aliqua consectetur laboris voluptate est
              labore qui commodo. Esse cillum ea voluptate aliqua magna ipsum
              qui voluptate. Culpa officia ullamco eu.
            </Text>
          </Stack>

          <Stack
            align="center"
            direction={{ base: "column", md: "row" }}
            gap="3"
          >
            <Button
              size="xl"
              key="email"
              data-o-email-list="1"
              data-mode="popup"
              data-email-list-uid="OW4k4p9g"
            >
              Join wait list <LuChevronRight />
            </Button>
            <Button
              variant="ghost"
              key="leadcapture"
              size="xl"
              data-o-lead-capture="1"
              data-mode="popup"
              data-form-uid="BWzy5a9E"
            >
              Talk to sales <LuChevronRight />
            </Button>
          </Stack>

          <Box maxW="4xl" mx="auto" w="full" mt="10">
            <ImagePlaceholder height="sm" roundedTop="l3" />
          </Box>
        </VStack>
      </Container>
      <Footer />
    </Box>
  );
}

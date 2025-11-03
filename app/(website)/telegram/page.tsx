import { Heading, Stack, VStack, HStack, Text, Box } from "@chakra-ui/react";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import { WarningCircle } from "@phosphor-icons/react/dist/ssr";

function LandingHeroNoVideo() {
  return (
    <>
      <Section
        header
        size="lg"
        bg="black"
        borderBottom="1px solid"
        borderColor="rgba(34, 197, 94, 0.25)"
        w="100vw"
        mx="unset"
        pb={{ base: "60px", md: "80px" }}
        background="radial-gradient(at 0% 100%, rgba(34, 197, 94, 0.28) 0px, transparent 55%),
        radial-gradient(at 100% 0%, rgba(16, 185, 129, 0.22) 0px, transparent 55%),
        linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(10,12,10,1) 100%)"
      >
        <style>{`
         html { scroll-behavior: smooth; }
         .css-1q38vmp {
            padding-top: 75px !important;
          }
        `}</style>

        <VStack gap="4" maxW="900px" mx="auto">
          <Stack gap="2" textAlign="center" mx="auto">
            <Heading
              as="h1"
              textStyle={{ base: "4xl", md: "5xl" }}
              mx="auto"
              color="white"
              lineHeight="tighter"
              fontWeight="bold"
              maxW="800px"
            >
              {" "}
              <Box as="span"
                background="linear-gradient(90deg, rgba(34,197,94,0.28), transparent 95%)"
                color="white"
                px={2}
                py={1}
                borderRadius="md"
                fontWeight="bold"
                display="inline-block"
                border="1px solid rgba(34, 197, 94, 0.35)"
                boxShadow="0 0 0 1px rgba(34, 197, 94, 0.25) inset, 0 0 24px rgba(34, 197, 94, 0.25)"
                backdropFilter="blur(6px)"
              >
                TELEGRAM
              </Box>
            </Heading>
            <Text color="gray.300" textStyle="sm" mx="auto" maxW="700px">
              Wir haben über <Text as="span" color="#22c55e" fontWeight="bold">6+ Jahre Erfahrung</Text>, um dir in einem klar aufgebauten, selbstbestimmten Kurs genau das zu zeigen, was im Trading wirklich zählt.<br />
            </Text>
          </Stack>
          <Stack align="center" direction={{ base: "column", md: "row" }} gap="3">
            <Link href="https://telegram.me/seitennulltrades">
              <Button size="xl" fontWeight="bold" colorScheme="green" bg="#22c55e" _hover={{ bg: "#16a34a" }} borderRadius="md" px="8" boxShadow="0 0 24px rgba(34,197,94,0.35)" border="1px solid rgba(34,197,94,0.45)">
               ⚡ JETZT BEITRETEN
              </Button>
            </Link>
          </Stack>
          <Stack direction="row" align="center" cursor="pointer" justify="center" mt={0}>
            <WarningCircle size={16} color="#A0AEC0" />
            <Text fontSize="xs" color="gray.400" cursor="pointer" textAlign="center" zIndex={1000}>
              Trading beinhaltet Risiken. <Link href="/legal/disclaimer" color="gray.400" cursor="pointer" textDecoration="underline">Lies unseren Disclaimer!</Link>
            </Text>
          </Stack>
        </VStack>
      </Section>
    </>
  );
}

export default function TelegramPage() {
  return (
    <>
      <LandingHeroNoVideo />
    </>
  );
}

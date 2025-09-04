import { Heading, Stack, VStack, Text, Box } from "@chakra-ui/react";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import { WarningCircle } from "@phosphor-icons/react/dist/ssr";
import { BrandedVimeoPlayer } from "@/components/ui/BrandedVimeoPlayer";

export function LandingHeroWithVideo() {
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
              DEIN WEG ZUM{" "}
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
                PRO TRADER.
              </Box>
            </Heading>
            <Text color="gray.300" textStyle="sm" mx="auto" maxW="700px">
              Wir haben über <Text as="span" color="#22c55e" fontWeight="bold">6+ Jahre Erfahrung</Text>, um dir in einem klar aufgebauten, selbstbestimmten Kurs genau das zu zeigen, was im Trading wirklich zählt.<br />
            </Text>
          </Stack>
          <Stack align="center" direction={{ base: "column", md: "row" }} gap="3">
            <Link href="#project30-pricing">
              <Button size="xl" fontWeight="bold" colorScheme="green" bg="#22c55e" _hover={{ bg: "#16a34a" }} borderRadius="md" px="8" boxShadow="0 0 24px rgba(34,197,94,0.35)" border="1px solid rgba(34,197,94,0.45)">
               ⚡ JETZT STARTEN
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

      <Section 
        size="lg" 
        bg="transparent"
        mt={{ base: "-170px", md: "-220px" }}
        pt="0"
        position="relative"
        zIndex={2}
      >
        <VStack gap="6" maxW="none" mx="auto" position="relative">
          <Box 
            w={{ base: '100%', md: '800px', lg: '1200px', xl: '1400px' }} 
            maxW="100%" 
            mx="auto" 
            bg="linear-gradient(135deg, rgba(34, 197, 94, 0.35), rgba(16, 185, 129, 0.35))"
            borderRadius="xl" 
            p="7px"
            position="relative"
            zIndex={3}
            boxShadow="0 0 40px rgba(34,197,94,0.2)"
          >
            <VStack gap="2">
              <Box 
                w="100%" 
                aspectRatio={16/9} 
                position="relative"
                overflow="hidden"
                bg="white"
                borderRadius="lg"
              >
                <BrandedVimeoPlayer videoId="1104311683" />
              </Box>
              <Box 
                p="2" 
                w="100%" 
                bg="rgba(10, 14, 10, 0.6)"
                backdropFilter="blur(12px)"
                borderRadius="lg"
                border="1px solid rgba(34, 197, 94, 0.25)"
                boxShadow="0 8px 32px 0 rgba(34, 197, 94, 0.20)"
              >
                <Stack direction="row" align="center" gap="2" justify="center">
                  <Stack direction="row" gap="-2">
                    <Box 
                       w="6" 
                       h="6" 
                       borderRadius="full" 
                       border="2px solid rgba(34, 197, 94, 0.45)" 
                       overflow="hidden"
                       bg="gray.200"
                       boxShadow="0 4px 8px rgba(0,0,0,0.1)"
                     >
                       <img 
                         src="/assets/community-stats/user_6819319_6ec853ff-5777-4398-8fcc-06e2621cbcf8.avif" 
                         alt="Community member"
                         style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                       />
                     </Box>
                     <Box 
                       w="6" 
                       h="6" 
                       borderRadius="full" 
                       border="2px solid rgba(34, 197, 94, 0.45)" 
                       overflow="hidden"
                       bg="gray.200"
                       boxShadow="0 4px 8px rgba(0,0,0,0.1)"
                     >
                       <img 
                         src="/assets/community-stats/4208db19763848b131989eadba9899aa.avif" 
                         alt="Community member"
                         style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                       />
                     </Box>
                     <Box 
                       w="6" 
                       h="6" 
                       borderRadius="full" 
                       border=" 2px solid rgba(34, 197, 94, 0.45)" 
                       overflow="hidden"
                       bg="gray.200"
                       boxShadow="0 4px 8px rgba(0,0,0,0.1)"
                     >
                       <img 
                         src="/assets/community-stats/393d1b15978eed96285cf196b2f51eda.avif" 
                         alt="Community member"
                         style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                       />
                     </Box>
                  </Stack>
                  <Text fontSize="xs" color="gray.200" fontWeight="medium" textShadow="0 1px 2px rgba(0,0,0,0.3)">
                   ...Bereits über <Text as="span" fontWeight="bold">1000+ Trader</Text> auf ihrem Weg begleitet und ausgebildet.
                  </Text>
                </Stack>
              </Box>
            </VStack>
          </Box>
        </VStack>
      </Section>
    </>
  );
}



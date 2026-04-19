"use client";

import { Box, VStack, HStack, Text, Button, Image, Stack, Link } from "@chakra-ui/react";
import { CheckCircle, ArrowRight, Seal } from "@phosphor-icons/react/dist/ssr";
import { SiInstagram, SiTiktok } from "react-icons/si";
import { useRouter } from "next/navigation";
import { trackProtocolEvent } from "./ProtocolTracker";

const SNT_PURPLE = "#8B5CF6";

const credentials = [
  "Vollzeit Daytrader, Scalper & Investor seit 2018",
  "Mehrfach funded bei verschiedenen Propfirms, nachweisliche Auszahlungen",
  "Über 10.000 Follower auf Social Media",
  "Über 1.000 Trader persönlich ausgebildet",
  "Gründer einer der aktivsten Trading-Communities im DACH-Raum",
  "Experte in Tradingpsychologie & Hochleistungs-Mindset",
];

export function ProtocolFounder() {
  const router = useRouter();

  const handleApply = () => {
    trackProtocolEvent("form_open", { source: "founder_cta" });
    router.push("/elite/apply");
  };

  return (
    <Box
      as="section"
      w="full"
      py={{ base: 16, md: 24 }}
      px={{ base: 4, md: 8 }}
      bg="black"
      position="relative"
      overflow="hidden"
    >
      <Box
        position="absolute"
        inset="0"
        background="radial-gradient(at 70% 50%, rgba(139, 92, 246,0.06) 0px, transparent 55%)"
        pointerEvents="none"
      />

      <Box maxW="1200px" mx="auto" position="relative">
        <Stack
          direction={{ base: "column", lg: "row" }}
          gap={{ base: 10, lg: 14 }}
          align={{ base: "center", lg: "start" }}
        >
          {/* Foto */}
          <VStack flexShrink={0} gap={4}>
            <Box
              w={{ base: "260px", md: "340px", lg: "400px" }}
              h={{ base: "360px", md: "460px", lg: "540px" }}
              position="relative"
              borderRadius="2xl"
              overflow="hidden"
              border="1px solid rgba(139, 92, 246,0.2)"
              boxShadow="0 0 60px rgba(139, 92, 246,0.1), 0 20px 80px rgba(0,0,0,0.6)"
            >
              <Image
                src="/personal/ali-2.jpeg"
                alt="Ali, Gründer von SNT"
                w="full"
                h="full"
                objectFit="cover"
              />
              {/* Glow overlay */}
              <Box
                position="absolute"
                bottom={0}
                left={0}
                right={0}
                h="50%"
                background="linear-gradient(to top, rgba(0,0,10,0.9), transparent)"
              />
            </Box>

            {/* Social Links */}
            <HStack gap={3} justify="center">
              {[
                { href: "https://instagram.com/sntrades_", icon: SiInstagram, label: "Instagram" },
                { href: "https://tiktok.com/@sntrades_", icon: SiTiktok, label: "TikTok" },
              ].map(({ href, icon: Icon, label }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  _hover={{ textDecoration: "none" }}
                >
                  <Box
                    w="44px"
                    h="44px"
                    borderRadius="full"
                    bg="rgba(255,255,255,0.05)"
                    border="1px solid rgba(255,255,255,0.1)"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    _hover={{ bg: "rgba(139, 92, 246,0.15)", borderColor: "rgba(139, 92, 246,0.4)" }}
                    transition="all 0.2s"
                  >
                    <Icon size={20} color="white" />
                  </Box>
                </Link>
              ))}
            </HStack>
          </VStack>

          {/* Content */}
          <VStack align={{ base: "center", lg: "start" }} gap={6} flex={1}>
            <Text
              color="gray.500"
              fontSize="sm"
              fontWeight="bold"
              textTransform="uppercase"
              letterSpacing="widest"
            >
              Meet the Founder
            </Text>

            <Box
              background="linear-gradient(90deg, rgba(139, 92, 246,0.22), transparent 95%)"
              color="white"
              px={4}
              py={2}
              borderRadius="lg"
              fontWeight="900"
              fontSize={{ base: "3xl", md: "4xl" }}
              border="1px solid rgba(139, 92, 246,0.3)"
              boxShadow="0 0 0 1px rgba(139, 92, 246,0.2) inset, 0 0 32px rgba(139, 92, 246,0.2)"
              backdropFilter="blur(6px)"
              lineHeight="tight"
            >
              Hi, ich bin Ali
            </Box>

            <VStack align={{ base: "center", lg: "start" }} gap={4} fontSize="md" color="gray.300" lineHeight="1.7">
              <Text>
                Meine Reise begann früh, mit 16 wusste ich, dass ich mehr wollte als den
                klassischen Weg. Ich habe verschiedene Business-Modelle ausprobiert, bin
                gescheitert, wieder aufgestanden, und irgendwann zum Trading gefunden.
              </Text>
              <Text>
                Trading ist für mich der klarste Weg, Geld und Zeit zu verdienen, ohne
                Abhängigkeiten, ohne Team, nur Entscheidungen und Disziplin. Heute bin ich
                profitabel, lebe vom Trading und habe über 1.000 Menschen auf diesem Weg
                begleitet.
              </Text>
              <Text fontWeight="bold" color="white">
                Das SNT ELITE ist das intensivste, was ich je angeboten habe.{" "}
                <Box as="span" color={SNT_PURPLE}>
                  Ich nehme nicht jeden.
                </Box>{" "}
                Aber wenn du bereit bist, ändert sich alles.
              </Text>
            </VStack>

            {/* Credentials */}
            <VStack align="start" gap={2.5} w="full">
              <Text fontSize="sm" fontWeight="bold" color="white" textTransform="uppercase" letterSpacing="wider">
                Meine Pedigree:
              </Text>
              {credentials.map((item, idx) => (
                <HStack key={idx} gap={3} align="start">
                  <CheckCircle
                    size={18}
                    color={SNT_PURPLE}
                    weight="fill"
                    style={{ minWidth: "18px", marginTop: "2px" }}
                  />
                  <Text color="gray.400" fontSize="sm" lineHeight="1.6">
                    {item}
                  </Text>
                </HStack>
              ))}
            </VStack>

            <Button
              mt={2}
              h="52px"
              px={8}
              bg={SNT_PURPLE}
              color="white"
              fontSize="md"
              fontWeight="bold"
              borderRadius="xl"
              _hover={{ bg: "#7C3AED", transform: "translateY(-2px)", boxShadow: "0 8px 32px rgba(139, 92, 246,0.4)" }}
              transition="all 0.25s"
              onClick={handleApply}
            >
              <HStack gap={2}>
                <Text>BEWERBUNG STARTEN</Text>
                <ArrowRight size={16} weight="bold" />
              </HStack>
            </Button>
          </VStack>
        </Stack>
      </Box>
    </Box>
  );
}

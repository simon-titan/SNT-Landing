"use client";

import { Heading, Stack, VStack, HStack, Text, Box, Flex } from "@chakra-ui/react";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import { WarningCircle } from "@phosphor-icons/react/dist/ssr";
import { BsArrowUp } from "react-icons/bs";

function LandingHeroNoVideo() {
    return (
        <>
            <Section
                size="lg"
                bg="black"
                borderBottom="1px solid"
                borderColor="rgba(34, 197, 94, 0.25)"
                w="100vw"
                mx="unset"
                pt={{ base: "20px", md: "80px" }}
                pb={{ base: "60px", md: "80px" }}
                background="radial-gradient(at 0% 100%, rgba(34, 197, 94, 0.28) 0px, transparent 55%),
        radial-gradient(at 100% 0%, rgba(16, 185, 129, 0.22) 0px, transparent 55%),
        linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(10,12,10,1) 100%)"
            >
                <style>{`
         html { scroll-behavior: smooth; }
         @keyframes pulse {
           0%, 100% {
             opacity: 1;
             transform: scale(1);
           }
           50% {
             opacity: 0.85;
             transform: scale(1.03);
           }
         }
         @keyframes pulseArrow {
           0%, 100% {
             opacity: 1;
             transform: translateY(0) scale(1);
           }
           50% {
             opacity: 0.9;
             transform: translateY(-10px) scale(1.15);
           }
         }
         .pulsing-box {
           animation: pulse 2s ease-in-out infinite;
         }
         .pulsing-arrow {
           animation: pulseArrow 2s ease-in-out infinite;
         }
        `}</style>

                <VStack gap="4" maxW="900px" mx="auto">
                    {/* Info Box - Nur auf Mobile */}
                    <Flex
                        display={{ base: "flex", md: "none" }}
                        w="full"
                        maxW="600px"
                        mx="auto"
                        mb={4}
                        mt={{ base: "-60px", md: 0 }}
                        align="flex-start"
                        gap={3}
                    >
                        <Box
                            flex="1"
                            className="pulsing-box"
                            bg="rgba(34, 197, 94, 0.1)"
                            border="1px solid rgba(34, 197, 94, 0.3)"
                            borderRadius="md"
                            p={4}
                            position="relative"
                        >
                            <Text
                                fontSize="md"
                                fontWeight="bold"
                                color="#22c55e"
                                mb={2}
                            >
                                WICHTIG
                            </Text>
                            <Text fontSize="sm" color="gray.200" lineHeight="1.6">
                                <Text as="span" fontWeight="bold" color="#22c55e">1.</Text> Klicke die 3 Punkte in der oberen rechten Ecke<br />
                                <Text as="span" fontWeight="bold" color="#22c55e">2.</Text> Klicke auf "Im Browser öffnen"<br />
                                <Text as="span" fontWeight="bold" color="#22c55e">3.</Text> Klicke auf "JETZT BEITRETEN"<br />
                                <Text as="span" fontWeight="bold" color="#22c55e">4.</Text> Du bist Mitglied in unserem KOSTENLOSEN TELEGRAM Kanal
                            </Text>
                        </Box>
                        <Box
                            className="pulsing-arrow"
                            color="#22c55e"
                            filter="drop-shadow(0 0 12px rgba(34, 197, 94, 1))"
                            flexShrink={0}
                            mt={2}
                            fontSize="48px"
                        >
                            <BsArrowUp />
                        </Box>
                    </Flex>
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
                        <Button
                            size="xl"
                            fontWeight="bold"
                            colorScheme="green"
                            bg="#22c55e"
                            _hover={{ bg: "#16a34a" }}
                            borderRadius="md"
                            px="8"
                            boxShadow="0 0 24px rgba(34,197,94,0.35)"
                            border="1px solid rgba(34,197,94,0.45)"
                            onClick={() => {
                                window.open("https://t.me/seitennulltrades", "_blank");
                            }}
                        >
                            ⚡ JETZT BEITRETEN
                        </Button>
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

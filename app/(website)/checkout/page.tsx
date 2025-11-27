"use client";

import { useState, useEffect } from "react";
import {
    Heading,
    Text,
    VStack,
    Box,
    HStack,
} from "@chakra-ui/react";
import { CheckCircle, Fire, Sparkle } from "@phosphor-icons/react/dist/ssr";
import { SntPremiumPricing } from "@/components/ui/snt-premium-pricing";

const SNT_BLUE = "#068CEF";
const SNT_YELLOW = "rgba(251, 191, 36, 1)";

export default function CheckoutLandingPage() {
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
            const endTime = new Date(today.getTime() + 48 * 60 * 60 * 1000); // 48 Stunden ab heute 0:00
            const diff = Math.max(0, Math.floor((endTime.getTime() - now.getTime()) / 1000));
            return diff;
        };

        setTimeLeft(calculateTimeLeft());

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / (60 * 60));
        const mins = Math.floor((seconds % (60 * 60)) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <>
            {/* Black Friday Banner */}
            <Box
                w="100vw"
                bg="black"
                color="white"
                fontSize={{ base: "xs", md: "sm" }}
                px="4"
                py="3"
                textAlign="center"
                fontWeight="bold"
                position="relative"
                overflow="hidden"
            >
                <HStack
                    justify="center"
                    align="center"
                    gap={2}
                    position="relative"
                    zIndex={1}
                >
                    <Fire size={18} weight="fill" color={SNT_YELLOW} />
                    <Text>
                        BLACK FRIDAY SPECIAL - <Text as="span" color={SNT_YELLOW} fontWeight="extrabold">50% RABATT</Text> - Bis zu 230€ sparen beim Lifetime-Plan!
                    </Text>
                    <Sparkle size={18} weight="fill" color={SNT_YELLOW} />
                </HStack>
            </Box>

            {/* SNTTRADES Header */}
            <Box
                w="100vw"
                bg="white"
                py={{ base: 4, md: 6 }}
                borderBottom="1px solid"
                borderColor="gray.200"
                display="flex"
                flexDirection="column"
                alignItems="center"
                gap={3}
            >
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    gap="2"
                    mx="auto"
                >
                    <CheckCircle size={20} color={SNT_BLUE} weight="fill" />
                    <Heading
                        as="h1"
                        fontSize={{ base: "md", md: "2xl" }}
                        fontWeight="700"
                        lineHeight="0.9"
                        color="gray.900"
                    >
                        SNTTRADES™
                    </Heading>
                </Box>
                {/* Timer */}
                <Box
                    bg="red.50"
                    border="2px solid"
                    borderColor="red.500"
                    borderRadius="lg"
                    px={4}
                    py={2}
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    gap={2}
                    mx="auto"
                >
                    <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="bold" color="red.600">
                        DAS ANGEBOT GILT NOCH FÜR
                    </Text>
                    <Text fontSize={{ base: "sm", md: "md" }} fontWeight="extrabold" color="red.700">
                        {formatTime(timeLeft)}
                    </Text>
                </Box>
            </Box>

            {/* Plan Selection Section */}
            <SntPremiumPricing />
        </>
    );
}

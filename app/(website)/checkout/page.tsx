"use client";

import { useState } from "react";
import {
    Button,
    Heading,
    Text,
    VStack,
    Box,
    Stack,
    Flex,
    Center,
} from "@chakra-ui/react";
import { Section } from "@/components/layout/section";
import { CheckCircle, Crown, Lightning } from "@phosphor-icons/react/dist/ssr";
import { useRouter } from "next/navigation";

export default function CheckoutLandingPage() {
    const router = useRouter();

    const handlePlanSelection = (plan: 'lifetime' | 'monthly') => {
        router.push(`/checkout/${plan}`);
    };

    return (
        <>
            {/* Video Background Hero Section */}
            <Section
                header
                size="lg"
                bg="bg.subtle"
                borderBottom="1px solid"
                borderColor="border"
                w="100vw"
                mx="unset"
                pb={{ base: "0px", md: "80px" }}
                position="relative"
                overflow="hidden"
            >
                {/* Video Background */}
                <Box
                    position="absolute"
                    top="50%"
                    left="50%"
                    width="100vw"
                    height={{ base: "50vh", md: "100vh" }}
                    transform="translate(-50%, -50%)"
                    zIndex={0}
                    overflow="hidden"
                >
                    <video
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                        }}
                        autoPlay
                        muted
                        loop
                        playsInline
                    >
                        <source src="/assets/0716.mp4" type="video/mp4" />
                    </video>
                </Box>

                {/* Content */}
                <VStack gap="0" maxW="900px" mx="auto" position="relative" zIndex={1} mt={{ base: "-16", md: "-24" }}>
                    <Stack gap="2" textAlign="center" mx="auto">
                        {/* SNTTRADES Trading Academy Badge */}
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            gap="2"
                            mx="auto"
                            mb="1"
                        >
                            <CheckCircle size={20} color="#1E88E5" weight="fill" />
                            <Heading
                                as="h1"
                                fontSize={{ base: "md", md: "2xl" }}
                                fontWeight="700"
                                lineHeight="0.9"
                                color="white"
                                textShadow="1px 1px 2px rgba(0,0,0,0.8)"
                            >
                                SNTTRADES™
                            </Heading>
                        </Box>

                        <Heading
                            as="h1"
                            textStyle={{ base: "2xl", md: "5xl" }}
                            mx="auto"
                            color="white"
                            lineHeight="tighter"
                            fontWeight="semibold"
                            maxW="800px"
                            textShadow="2px 2px 4px rgba(0,0,0,0.8)"
                        >
                            WÄHLE DEINEN{' '}
                            <Box as="span"
                                background="linear-gradient(90deg,rgb(92, 154, 246), transparent 95%)"
                                color="white"
                                px={2}
                                py={1}
                                borderRadius="md"
                                fontWeight="semibold"
                                display="inline-block"
                            >
                                TRADING-PLAN
                            </Box>
                        </Heading>

                        <Text color="white" textStyle="sm" mx="auto" maxW="700px" textShadow="1px 1px 2px rgba(0,0,0,0.8)">
                            Starte deine Trading-Reise mit unserem bewährten Mentorship-Programm
                        </Text>
                    </Stack>
                </VStack>
            </Section>

            {/* Plan Selection Section */}
                <Box py={{ base: 4, md: 16 }} px={{ base: 4, md: 8}} display="flex" flexDirection="column" justifyContent="center" alignItems="center"  >
                    <VStack gap="6" >
                        {/* Header */}
                        <VStack gap="1" textAlign="center">
                            <Heading
                                as="h2"
                                textStyle={{ base: "3xl", md: "4xl" }}
                                color="gray.900"
                                lineHeight="tight"
                            >
                                Wähle dein{' '}
                                <Box as="span"
                                    background="linear-gradient(90deg,rgb(246, 236, 92), transparent 95%)"
                                    color="black"
                                    px={2}
                                    py={1}
                                    borderRadius="md"
                                    fontWeight="bold"
                                    display="inline-block"
                                >
                                    Mentorship-Paket
                                </Box>
                            </Heading>
                            <Text color="gray.600" fontSize="sm" maxW="600px">
                                Beide Pläne beinhalten die komplette SNTTRADES Ausbildung, Live-Calls und Community-Zugang
                            </Text>
                        </VStack>

                        {/* Plan Cards */}
                        <Flex
                            direction={{ base: "column", lg: "row" }}
                            wrap="nowrap"
                            gap={6}
                            justify="center"
                            align="center"
                            w="100%"
                            maxW="1200px"
                            mx="2"
                        >
                            {/* Lifetime Plan - Hervorgehoben */}
                            <Box
                                flex="1"
                                maxW="400px"
                                bg="white"
                                borderRadius="2xl"
                                boxShadow="2xl"
                                overflow="visible"
                                border="3px solid"
                                borderColor="green.400"
                                position="relative"
                                _hover={{
                                    transform: { lg: "scale(1.08) translateY(-4px)" },
                                    boxShadow: "3xl"
                                }}
                                transition="all 0.3s ease"
                            >
                                {/* SNTTRADES-Empfehlung Badge */}
                                <Box
                                    position="absolute"
                                    top="-16px"
                                    right="-16px"
                                    bg="linear-gradient(135deg, #10B981, #34D399)"
                                    color="white"
                                    px={4}
                                    py={2}
                                    borderRadius="full"
                                    fontSize="xs"
                                    fontWeight="bold"
                                    zIndex={50}
                                    boxShadow="0 8px 25px rgba(16, 185, 129, 0.4)"
                                    border="2px solid white"
                                    _hover={{
                                        transform: "scale(1.05)",
                                        boxShadow: "0 12px 35px rgba(16, 185, 129, 0.6)"
                                    }}
                                    transition="all 0.3s ease"
                                >
                                    <Box display="flex" alignItems="center" gap="1">
                                        <CheckCircle size={16} weight="fill" />
                                        <Text fontSize="xs" fontWeight="semibold" letterSpacing="0.5px">SNTTRADES-EMPFEHLUNG</Text>
                                    </Box>
                                </Box>

                                {/* Header */}
                                <Box
                                    bg="linear-gradient(135deg, #10B981, #34D399)"
                                    p={6}
                                    color="white"
                                    textAlign="center"
                                    pt={8}
                                >
                                    <Box display="flex" alignItems="center" justifyContent="center" gap="2" mb="2">
                                        <Crown size={28} weight="fill" />
                                        <Text fontSize="2xl" fontWeight="bold">LIFETIME</Text>
                                    </Box>
                                    <Text fontSize="sm" opacity="0.9">
                                        Einmalzahlung - Lebenslanger Zugang
                                    </Text>
                                </Box>

                                {/* Price */}
                                <Box p={6} textAlign="center" borderBottom="1px solid" borderColor="gray.100">
                                    <Box position="relative">
                                        <Text
                                            fontSize="3xl"
                                            fontWeight="bold"
                                            color="red.500"
                                            textDecoration="line-through"
                                            opacity="0.7"
                                        >
                                            567€
                                        </Text>
                                        <Text fontSize="6xl" fontWeight="bold" color="gray.900" lineHeight="1" mt="-2">
                                            367€
                                        </Text>
                                    </Box>
                                    <Text color="gray.600" fontSize="lg">
                                        einmalig
                                    </Text>
                                    <Box
                                        bg="green.500"
                                        color="white"
                                        px={3}
                                        py={1}
                                        borderRadius="full"
                                        fontSize="xs"
                                        fontWeight="bold"
                                        mt={2}
                                        display="inline-block"
                                    >
                                        200€ GESPART
                                    </Box>
                                </Box>

                                {/* Features */}
                                <Box p={6}>
                                    <VStack align="start" gap={3}>
                                        <Box display="flex" alignItems="center" gap="3">
                                            <CheckCircle size={20} color="#10B981" weight="fill" />
                                            <Text fontSize="sm" fontWeight="semibold">Kompletter Videokurs</Text>
                                        </Box>
                                        <Box display="flex" alignItems="center" gap="3">
                                            <CheckCircle size={20} color="#10B981" weight="fill" />
                                            <Text fontSize="sm" fontWeight="semibold">Live Mentoring Calls</Text>
                                        </Box>
                                        <Box display="flex" alignItems="center" gap="3">
                                            <CheckCircle size={20} color="#10B981" weight="fill" />
                                            <Text fontSize="sm" fontWeight="semibold">Exklusive Community</Text>
                                        </Box>
                                        <Box display="flex" alignItems="center" gap="3">
                                            <CheckCircle size={20} color="#10B981" weight="fill" />
                                            <Text fontSize="sm" fontWeight="semibold">Trading Tools & Software</Text>
                                        </Box>
                                        <Box display="flex" alignItems="center" gap="3">
                                            <CheckCircle size={20} color="#10B981" weight="fill" />
                                            <Text fontSize="sm" fontWeight="semibold" color="green.600">
                                                + Lebenslange Updates
                                            </Text>
                                        </Box>
                                    </VStack>
                                </Box>

                                {/* CTA */}
                                <Box p={6} pt={2}>
                                    <Button
                                        size="xl"
                                        w="full"
                                        bg="linear-gradient(135deg, #10B981, #34D399)"
                                        color="white"
                                        fontWeight="bold"
                                        _hover={{
                                            bg: "linear-gradient(135deg, #059669, #10B981)"
                                        }}
                                        onClick={() => handlePlanSelection('lifetime')}
                                    >
                                        LIFETIME SICHERN 🚀
                                    </Button>
                                </Box>
                            </Box>

                             {/* Info Box */}
                             <Box
                                flex="1"
                                maxW="400px"
                                bg="blue.50"
                                borderRadius="lg"
                                p="6"
                                border="1px solid"
                                borderColor="blue.100"
                                textAlign="center"
                                mt={{ base: 6, lg: 0 }}
                                maxH="200px"
                            >
                                <Text fontWeight="bold" color="blue.800" mb="3">
                                    🎯 WARUM LIFETIME WÄHLEN?
                                </Text>
                                <Text color="blue.700" fontSize="sm">
                                    Mit dem Lifetime-Plan sparst du nicht nur 200€, sondern erhältst auch lebenslangen Zugang zu allen zukünftigen Updates,
                                    neuen Strategien und erweiterten Inhalten - ohne zusätzliche Kosten!
                                </Text>
                            </Box>

                            {/* Monthly Plan */}
                            <Box
                                flex="1"
                                maxW="400px"
                                bg="white"
                                borderRadius="2xl"
                                boxShadow="xl"
                                overflow="hidden"
                                border="2px solid"
                                borderColor="gray.200"
                                position="relative"
                                maxH="500px"
                                _hover={{
                                    transform: "translateY(-4px)",
                                    boxShadow: "2xl",
                                    borderColor: "blue.300"
                                }}
                                transition="all 0.3s ease"
                            >
                                {/* Header */}
                                <Box
                                    bg="linear-gradient(135deg,rgb(70, 107, 229),rgb(61, 58, 237))"
                                    p={6}
                                    color="white"
                                    textAlign="center"
                                >
                                    <Box display="flex" alignItems="center" justifyContent="center" gap="2" mb="2">
                                        <Lightning size={24} weight="fill" />
                                        <Text fontSize="xl" fontWeight="bold">MONATLICH</Text>
                                    </Box>
                                    <Text fontSize="sm" opacity="0.9">
                                        monatlich
                                    </Text>
                                </Box>

                                {/* Price */}
                                <Box p={6} textAlign="center" borderBottom="1px solid" borderColor="gray.100">
                                    <Text fontSize="5xl" fontWeight="bold" color="gray.900" lineHeight="1">
                                        59,99€
                                    </Text>
                                    <Text color="gray.600" fontSize="lg">
                                        pro Monat
                                    </Text>
                                    <Text color="gray.500" fontSize="sm" mt="1">
                                        Jederzeit kündbar
                                    </Text>
                                </Box>

                                {/* Features */}
                                <Box p={6}>
                                    <VStack align="start" gap={3}>
                                        <Box display="flex" alignItems="center" gap="3">
                                            <CheckCircle size={20} color="#10B981" weight="fill" />
                                            <Text fontSize="sm">Kompletter Videokurs</Text>
                                        </Box>
                                        <Box display="flex" alignItems="center" gap="3">
                                            <CheckCircle size={20} color="#10B981" weight="fill" />
                                            <Text fontSize="sm">Live Mentoring Calls</Text>
                                        </Box>
                                        <Box display="flex" alignItems="center" gap="3">
                                            <CheckCircle size={20} color="#10B981" weight="fill" />
                                            <Text fontSize="sm">Exklusive Community</Text>
                                        </Box>
                                        <Box display="flex" alignItems="center" gap="3">
                                            <CheckCircle size={20} color="#10B981" weight="fill" />
                                            <Text fontSize="sm">Trading Tools & Software</Text>
                                        </Box>
                                    </VStack>
                                </Box>

                                {/* CTA */}
                                <Box p={6} pt={2}>
                                    <Button
                                        size="lg"
                                        w="full"
                                        colorScheme="purple"
                                        onClick={() => handlePlanSelection('monthly')}
                                    >
                                        MONATLICH WÄHLEN
                                    </Button>
                                </Box>
                            </Box>
                        </Flex>
                    </VStack>
                </Box>
        </>
    );
} 
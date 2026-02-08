"use client";

import { useState } from "react";
import {
    Button,
    Heading,
    Text,
    VStack,
    Box,
    Flex,
    HStack,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { useRouter } from "next/navigation";
import { pricingConfig, isDiscountActive } from "@/config/pricing-config";

const SNT_BLUE = "#068CEF";

type PricingPlan = "monthly" | "quarterly" | "annual";

interface PricingToggleProps {
    value: PricingPlan;
    onChange: (value: PricingPlan) => void;
}

const PricingToggle = ({ value, onChange }: PricingToggleProps) => {
    return (
        <HStack
            gap={0}
            bg="rgba(255, 255, 255, 0.95)"
            borderRadius="xl"
            p="4px"
            border="1px solid rgba(6, 140, 239, 0.25)"
            backdropFilter="blur(12px)"
            boxShadow="0 8px 32px 0 rgba(6, 140, 239, 0.15)"
        >
            <Button
                variant={value === "monthly" ? "solid" : "ghost"}
                bg={value === "monthly" ? SNT_BLUE : "transparent"}
                color={value === "monthly" ? "white" : "gray.700"}
                _hover={{
                    bg: value === "monthly" ? "#0572c2" : "rgba(6, 140, 239, 0.1)",
                }}
                onClick={() => onChange("monthly")}
                borderRadius="lg"
                px={{ base: 3, md: 6 }}
                py={2}
                fontSize="sm"
                fontWeight="medium"
            >
                Monatlich
            </Button>
            <Button
                variant={value === "quarterly" ? "solid" : "ghost"}
                bg={value === "quarterly" ? SNT_BLUE : "transparent"}
                color={value === "quarterly" ? "white" : "gray.700"}
                _hover={{
                    bg: value === "quarterly" ? "#0572c2" : "rgba(6, 140, 239, 0.1)",
                }}
                onClick={() => onChange("quarterly")}
                borderRadius="lg"
                px={{ base: 3, md: 6 }}
                py={2}
                fontSize="sm"
                fontWeight="medium"
            >
                Quartal
            </Button>
            <Box position="relative">
                <Button
                    variant={value === "annual" ? "solid" : "ghost"}
                    bg={value === "annual" ? SNT_BLUE : "transparent"}
                    color={value === "annual" ? "white" : "gray.700"}
                    _hover={{
                        bg: value === "annual" ? "#0572c2" : "rgba(6, 140, 239, 0.1)",
                    }}
                    onClick={() => onChange("annual")}
                    borderRadius="lg"
                    px={{ base: 3, md: 6 }}
                    py={2}
                    fontSize="sm"
                    fontWeight="medium"
                >
                    Jährlich
                </Button>
                {/* SNT-EMPFEHLUNG Badge */}
                <Box
                    position="absolute"
                    top={{ base: "-8px", md: "-10px" }}
                    right={{ base: "-4px", md: "-6px" }}
                    bg="red.500"
                    color="white"
                    px={{ base: 1.5, md: 2 }}
                    py={0.5}
                    borderRadius="full"
                    fontSize={{ base: "2xs", md: "xs" }}
                    fontWeight="bold"
                    whiteSpace="nowrap"
                    boxShadow="0 2px 8px rgba(239, 68, 68, 0.4)"
                    border="2px solid white"
                    zIndex={10}
                >
                    EMPFEHLUNG
                </Box>
            </Box>
        </HStack>
    );
};

export function SntPremiumPricing() {
    const router = useRouter();
    const [pricingMode, setPricingMode] = useState<PricingPlan>("annual");

    const discountActive = isDiscountActive();
    const pricing = discountActive ? pricingConfig.discount : pricingConfig.standard;
    
    const getCurrentPlan = () => {
        switch (pricingMode) {
            case "monthly":
                return pricing.monthly;
            case "quarterly":
                return pricing.quarterly;
            case "annual":
                return pricing.annual;
            default:
                return pricing.annual;
        }
    };
    
    const currentPlan = getCurrentPlan();

    const handlePlanSelection = (plan: PricingPlan) => {
        router.push(`/checkout/${plan}`);
    };

    const handleModeChange = (newMode: PricingPlan) => {
        setPricingMode(newMode);
    };

    // Preis formatieren
    const formatPrice = (price: number) => {
        return price % 1 === 0 ? `${price}€` : `${price.toFixed(2).replace('.', ',')}€`;
    };

    return (
        <>
            <Box 
                py={{ base: 4, md: 16 }} 
                px={{ base: 4, md: 8}} 
                display="flex" 
                flexDirection="column" 
                justifyContent="center" 
                alignItems="center"
                bg="linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(240, 249, 255, 0.5) 100%)"
            >
                <VStack gap="8" maxW="1200px" w="100%">
                    {/* Header */}
                    <VStack gap="4" textAlign="center">
                        <Heading
                            as="h2"
                            textStyle={{ base: "3xl", md: "4xl" }}
                            color="gray.900"
                            lineHeight="tight"
                        >
                            Wähle dein{' '}
                            <Box as="span"
                                background={`linear-gradient(90deg, ${SNT_BLUE} 0%, rgba(36, 104, 251, 0.22) 85%, rgba(251, 191, 36, 0) 100%)`}
                                color="black"
                                px={2}
                                py={1}
                                borderRadius="md"
                                fontWeight="bold"
                                display="inline-block"
                            >
                                PREMIUM-Paket
                            </Box>
                        </Heading>
                        <Text color="gray.600" fontSize="sm" maxW="600px">
                            Beide Pläne beinhalten die komplette SNTTRADES Ausbildung, Live-Calls und Community-Zugang
                        </Text>

                        {/* Pricing Toggle */}
                        <PricingToggle value={pricingMode} onChange={handleModeChange} />
                    </VStack>

                    {/* Plan Cards */}
                    <Flex
                        direction={{ base: "column", lg: "row" }}
                        wrap="nowrap"
                        gap={6}
                        justify="center"
                        align="stretch"
                        w="100%"
                    >
                        {/* Main Plan Card */}
                        <Box
                            flex="1"
                            maxW="400px"
                            bg="white"
                            borderRadius="2xl"
                            boxShadow="2xl"
                            overflow="visible"
                            border="3px solid"
                            borderColor="black"
                            position="relative"
                            key={pricingMode}
                            animation={`${keyframes({
                                "0%": { opacity: 0.8, transform: "scale(0.98)" },
                                "50%": { transform: "scale(1.02)" },
                                "100%": { opacity: 1, transform: "scale(1)" }
                            })} 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)`}
                            _hover={{
                                transform: { lg: "scale(1.05) translateY(-4px)" },
                                boxShadow: "3xl"
                            }}
                            transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
                        >
                            {/* SNTTRADES-Empfehlung Badge - Nur bei Jährlich */}
                            {pricingMode === "annual" && (
                                <Box
                                    position="absolute"
                                    top="-16px"
                                    right="-16px"
                                    bg="red.500"
                                    color="white"
                                    px={4}
                                    py={2}
                                    borderRadius="full"
                                    fontSize="xs"
                                    fontWeight="bold"
                                    zIndex={50}
                                    boxShadow="0 8px 25px rgba(239, 68, 68, 0.4)"
                                    border="2px solid white"
                                    _hover={{
                                        transform: "scale(1.05)",
                                    }}
                                    transition="all 0.3s ease"
                                >
                                    <Box display="flex" alignItems="center" gap="1">
                                        <CheckCircle size={16} weight="fill" />
                                        <Text fontSize="xs" fontWeight="semibold" letterSpacing="0.5px">SNTTRADES-EMPFEHLUNG</Text>
                                    </Box>
                                </Box>
                            )}

                            {/* Header */}
                            <Box
                                bg="black"
                                p={6}
                                color="white"
                                textAlign="center"
                                pt={8}
                                borderTopRadius="2xl"
                                borderBottom="3px solid"
                                borderBottomColor={SNT_BLUE}
                                overflow="hidden"
                                transition="all 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
                            >
                                <VStack gap={2} textAlign="center">
                                    <Heading 
                                        as="h3" 
                                        fontSize="2xl" 
                                        fontWeight="bold"
                                        key={pricingMode}
                                        color="white"
                                        animation={`${keyframes({
                                            "0%": { opacity: 0, transform: "translateY(-10px) scale(0.95)" },
                                            "100%": { opacity: 1, transform: "translateY(0) scale(1)" }
                                        })} 0.4s ease-out`}
                                    >
                                        SNTTRADES{' '}
                                        <Box as="span"
                                            position="relative"
                                            color="white"
                                            fontWeight="bold"
                                            display="inline-block"
                                            _after={{
                                                content: '""',
                                                position: "absolute",
                                                bottom: "2px",
                                                left: 0,
                                                right: 0,
                                                height: "3px",
                                                bg: SNT_BLUE,
                                                borderRadius: "2px"
                                            }}
                                        >
                                            PREMIUM
                                        </Box>
                                    </Heading>
                                    <Text 
                                        fontSize="sm" 
                                        fontWeight="medium" 
                                        opacity={0.8}
                                        key={`${pricingMode}-desc`}
                                        animation={`${keyframes({
                                            "0%": { opacity: 0, transform: "translateY(-5px)" },
                                            "100%": { opacity: 0.8, transform: "translateY(0)" }
                                        })} 0.4s ease-out 0.1s both`}
                                    >
                                        {pricingMode === "annual" 
                                            ? "Jährlicher Zugang zur kompletten Trading-Ausbildung - Beste Ersparnis" 
                                            : pricingMode === "quarterly"
                                            ? "Quartalsweise Abrechnung - Flexibel und günstig"
                                            : "Flexibler monatlicher Zugang zur kompletten Trading-Ausbildung"}
                                    </Text>
                                </VStack>
                            </Box>

                            {/* Price */}
                            <Box p={6} textAlign="center" borderBottom="1px solid" borderColor="gray.100">
                                <VStack gap={2} textAlign="center">
                                    <HStack gap={1} align="baseline" justify="center">
                                        <Text 
                                            fontSize="5xl" 
                                            fontWeight="bold" 
                                            color="gray.900" 
                                            lineHeight="1"
                                            key={`price-${pricingMode}`}
                                            animation={`${keyframes({
                                                "0%": { opacity: 0, transform: "scale(0.9) translateY(10px)" },
                                                "100%": { opacity: 1, transform: "scale(1) translateY(0)" }
                                            })} 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both`}
                                        >
                                            {formatPrice(currentPlan.price)}
                                        </Text>
                                        <Text 
                                            color="gray.600" 
                                            fontSize="lg"
                                            key="period"
                                            animation={`${keyframes({
                                                "0%": { opacity: 0 },
                                                "100%": { opacity: 1 }
                                            })} 0.4s ease-out 0.3s both`}
                                        >
                                            {pricingMode === "monthly" ? "/Monat" : pricingMode === "quarterly" ? "/Quartal" : "/Jahr"}
                                        </Text>
                                    </HStack>
                                    {pricingMode === "annual" && (
                                        <Text 
                                            color={SNT_BLUE} 
                                            fontSize="sm" 
                                            fontWeight="medium"
                                            key="annual-text"
                                            animation={`${keyframes({
                                                "0%": { opacity: 0, transform: "translateY(5px)" },
                                                "100%": { opacity: 1, transform: "translateY(0)" }
                                            })} 0.4s ease-out 0.4s both`}
                                        >
                                            ✨ Beste Ersparnis - Maximaler Wert
                                        </Text>
                                    )}
                                </VStack>
                            </Box>

                            {/* CTA */}
                            <Box p={6} pt={4} pb={6}>
                                <Button
                                    size="xl"
                                    w="full"
                                    bg={SNT_BLUE}
                                    color="white"
                                    fontWeight="bold"
                                    _hover={{
                                        bg: "#0572c2"
                                    }}
                                    onClick={() => handlePlanSelection(pricingMode)}
                                    key={`cta-${pricingMode}`}
                                    animation={`${keyframes({
                                        "0%": { opacity: 0, transform: "translateY(10px) scale(0.95)" },
                                        "100%": { opacity: 1, transform: "translateY(0) scale(1)" }
                                    })} 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s both`}
                                >
                                    {pricingMode === "annual" ? "JÄHRLICH SICHERN 🚀" : pricingMode === "quarterly" ? "QUARTAL WÄHLEN" : "MONATLICH WÄHLEN"}
                                </Button>
                            </Box>

                            {/* Features */}
                            <Box p={6}>
                                <VStack align="start" gap={3}>
                                    {[
                                        "Umfassendes Video-Training auf Abruf",
                                        "Live-Mentoring mit erfahrenen Tradern",
                                        "Exklusive Trading-Tools & Software",
                                        "Interaktive Community mit Gleichgesinnten",
                                        "Persönliche Betreuung & Feedback",
                                        "Strukturierte NEFS Trading-Strategie",
                                        "Wöchentliche Live-Marktanalysen",
                                        "24/7 Community-Support",
                                        "Aufgezeichnete Sessions zum Nachschauen",
                                        pricingMode === "annual" ? "Jährlicher Zugang - Beste Ersparnis" : pricingMode === "quarterly" ? "Quartalsweiser Zugang - Flexibel" : "Flexibler monatlicher Zugang"
                                    ].map((feature, index) => (
                                        <Box 
                                            key={`feature-${index}`}
                                            display="flex" 
                                            alignItems="center" 
                                            gap="3"
                                            animation={`${keyframes({
                                                "0%": { opacity: 0, transform: "translateX(-10px)" },
                                                "100%": { opacity: 1, transform: "translateX(0)" }
                                            })} 0.4s ease-out ${index * 0.05}s both`}
                                        >
                                            <CheckCircle size={20} color={SNT_BLUE} weight="fill" />
                                            <Text 
                                            fontSize="sm" 
                                            fontWeight="medium" 
                                            color={feature.includes("Jährlicher") || feature.includes("Beste Ersparnis") ? SNT_BLUE : "gray.800"}
                                            >
                                                {feature}
                                            </Text>
                                        </Box>
                                    ))}
                                </VStack>
                            </Box>
                        </Box>

                        {/* Info Box */}
                        <Box
                            flex="1"
                            maxW="400px"
                            bg="#f0f9ff"
                            borderRadius="lg"
                            p="6"
                            border="1px solid"
                            borderColor="#bfdbfe"
                            textAlign="center"
                            mt={{ base: 6, lg: 0 }}
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                        >
                            <Text fontWeight="bold" color={SNT_BLUE} mb="3">
                                {pricingMode === "annual" ? "🎯 WARUM JÄHRLICH WÄHLEN?" : pricingMode === "quarterly" ? "💡 QUARTAL - GUTE BALANCE" : "💡 FLEXIBILITÄT"}
                            </Text>
                            <Text color="gray.700" fontSize="sm">
                                {pricingMode === "annual" 
                                    ? "Mit dem Jahres-Plan sparst du am meisten und erhältst vollen Zugang zu allen Inhalten, Updates und neuen Strategien für ein ganzes Jahr!"
                                    : pricingMode === "quarterly"
                                    ? "Mit dem Quartals-Plan hast du eine gute Balance zwischen Ersparnis und Flexibilität. Alle 3 Monate kannst du entscheiden, ob du weitermachen möchtest."
                                    : "Mit dem monatlichen Plan hast du maximale Flexibilität. Du kannst jederzeit kündigen und zahlst nur für die Monate, in denen du die Ausbildung nutzt."}
                            </Text>
                        </Box>
                    </Flex>
                </VStack>
            </Box>

        </>
    );
}

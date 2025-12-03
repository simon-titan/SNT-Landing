"use client";

import { useState, useRef } from "react";
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
import { CheckCircle, Crown } from "@phosphor-icons/react/dist/ssr";
import { useRouter } from "next/navigation";
import { pricingConfig, isDiscountActive } from "@/config/pricing-config";

const SNT_BLUE = "#068CEF";

interface PricingToggleProps {
    value: "monthly" | "lifetime";
    onChange: (value: "monthly" | "lifetime") => void;
}

interface PricingTogglePropsWithModal extends PricingToggleProps {
    onMonthlyClick?: () => void;
}

const PricingToggle = ({ value, onChange, onMonthlyClick }: PricingTogglePropsWithModal) => {
    const pricing = isDiscountActive() ? pricingConfig.discount : pricingConfig.standard;
    const savingsText = isDiscountActive() 
        ? `Lifetime (${pricing.lifetime.savingsAmount} sparen!)`
        : "Lifetime";

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
                onClick={() => {
                    if (onMonthlyClick) {
                        onMonthlyClick();
                    } else {
                        onChange("monthly");
                    }
                }}
                borderRadius="lg"
                px={6}
                py={2}
                fontSize="sm"
                fontWeight="medium"
            >
                Monatlich
            </Button>
            <Box position="relative">
                <Button
                    variant={value === "lifetime" ? "solid" : "ghost"}
                    bg={value === "lifetime" ? SNT_BLUE : "transparent"}
                    color={value === "lifetime" ? "white" : "gray.700"}
                    _hover={{
                        bg: value === "lifetime" ? "#0572c2" : "rgba(6, 140, 239, 0.1)",
                    }}
                    onClick={() => onChange("lifetime")}
                    borderRadius="lg"
                    px={6}
                    py={2}
                    fontSize="sm"
                    fontWeight="medium"
                >
                    {savingsText}
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
                    SNT-EMPFEHLUNG
                </Box>
            </Box>
        </HStack>
    );
};

export function SntPremiumPricing() {
    const router = useRouter();
    const [pricingMode, setPricingMode] = useState<"monthly" | "lifetime">("lifetime");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const previousModeRef = useRef<"monthly" | "lifetime">("lifetime");

    const discountActive = isDiscountActive();
    const pricing = discountActive ? pricingConfig.discount : pricingConfig.standard;
    const currentPlan = pricingMode === "lifetime" ? pricing.lifetime : pricing.monthly;

    const handlePlanSelection = (plan: 'lifetime' | 'monthly') => {
        router.push(`/checkout/${plan}`);
    };

    const handleModeChange = (newMode: "monthly" | "lifetime") => {
        if (previousModeRef.current === "lifetime" && newMode === "monthly") {
            setIsModalOpen(true);
        } else {
            setPricingMode(newMode);
            previousModeRef.current = newMode;
        }
    };

    const handleMonthlyClick = () => {
        handleModeChange("monthly");
    };

    const handleConfirmMonthly = () => {
        setIsModalOpen(false);
        setPricingMode("monthly");
        previousModeRef.current = "monthly";
    };

    const handleStayLifetime = () => {
        setIsModalOpen(false);
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
                        <PricingToggle value={pricingMode} onChange={handleModeChange} onMonthlyClick={handleMonthlyClick} />
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
                            {/* SNTTRADES-Empfehlung Badge - Nur bei Lifetime */}
                            {pricingMode === "lifetime" && (
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
                                        {pricingMode === "lifetime" 
                                            ? "Lebenslanger Zugang zur kompletten Trading-Ausbildung" 
                                            : "Flexibler monatlicher Zugang zur kompletten Trading-Ausbildung"}
                                    </Text>
                                </VStack>
                            </Box>

                            {/* Price */}
                            <Box p={6} textAlign="center" borderBottom="1px solid" borderColor="gray.100">
                                <VStack gap={2} textAlign="center">
                                    {/* Rabatt-Badge nur wenn Rabatt aktiv */}
                                    {discountActive && currentPlan.originalPrice && (
                                        <HStack 
                                            gap={2} 
                                            align="center" 
                                            justify="center"
                                            key="savings"
                                            animation={`${keyframes({
                                                "0%": { opacity: 0, transform: "scale(0.8) translateY(-10px)" },
                                                "100%": { opacity: 1, transform: "scale(1) translateY(0)" }
                                            })} 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s both`}
                                        >
                                            <Text
                                                fontSize="xl"
                                                fontWeight="bold"
                                                color="red.500"
                                                textDecoration="line-through"
                                            >
                                                {formatPrice(currentPlan.originalPrice)}
                                            </Text>
                                            <Box
                                                bg="red.500"
                                                color="white"
                                                px={3}
                                                py={1}
                                                borderRadius="md"
                                                fontSize="xs"
                                                fontWeight="bold"
                                            >
                                                {currentPlan.savingsAmount} gespart!
                                            </Box>
                                        </HStack>
                                    )}
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
                                        {pricingMode === "monthly" && (
                                            <Text 
                                                color="gray.600" 
                                                fontSize="lg"
                                                key="period"
                                                animation={`${keyframes({
                                                    "0%": { opacity: 0 },
                                                    "100%": { opacity: 1 }
                                                })} 0.4s ease-out 0.3s both`}
                                            >
                                                /Monat
                                            </Text>
                                        )}
                                    </HStack>
                                    {pricingMode === "lifetime" && (
                                        <Text 
                                            color={SNT_BLUE} 
                                            fontSize="sm" 
                                            fontWeight="medium"
                                            key="lifetime-text"
                                            animation={`${keyframes({
                                                "0%": { opacity: 0, transform: "translateY(5px)" },
                                                "100%": { opacity: 1, transform: "translateY(0)" }
                                            })} 0.4s ease-out 0.4s both`}
                                        >
                                            ✨ Einmalig zahlen, für immer lernen
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
                                    {pricingMode === "lifetime" ? "LIFETIME SICHERN 🚀" : "MONATLICH WÄHLEN"}
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
                                        pricingMode === "lifetime" ? "Lebenslanger Zugang (bei Lifetime)" : "Flexibler monatlicher Zugang"
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
                                                color={feature.includes("Lebenslanger") ? SNT_BLUE : "gray.800"}
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
                                {pricingMode === "lifetime" ? "🎯 WARUM LIFETIME WÄHLEN?" : "💡 FLEXIBILITÄT"}
                            </Text>
                            <Text color="gray.700" fontSize="sm">
                                {pricingMode === "lifetime" 
                                    ? "Mit dem Lifetime-Plan erhältst du lebenslangen Zugang zu allen zukünftigen Updates, neuen Strategien und erweiterten Inhalten - ohne zusätzliche Kosten!"
                                    : "Mit dem monatlichen Plan hast du maximale Flexibilität. Du kannst jederzeit kündigen und zahlst nur für die Monate, in denen du die Ausbildung nutzt."}
                            </Text>
                        </Box>
                    </Flex>
                </VStack>
            </Box>

            {/* Modal für Lifetime-Wechsel */}
            {isModalOpen && (
                <Box
                    position="fixed"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    bg="rgba(0, 0, 0, 0.5)"
                    zIndex={9999}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    p={4}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setIsModalOpen(false);
                        }
                    }}
                    animation={`${keyframes({
                        "0%": { opacity: 0 },
                        "100%": { opacity: 1 }
                    })} 0.3s ease-out`}
                    backdropFilter="blur(4px)"
                >
                    <Box
                        bg="white"
                        borderRadius="2xl"
                        boxShadow="2xl"
                        maxW={{ base: "90%", md: "500px" }}
                        w="full"
                        p={{ base: 6, md: 8 }}
                        onClick={(e) => e.stopPropagation()}
                        animation={`${keyframes({
                            "0%": { 
                                opacity: 0, 
                                transform: "translateY(-20px) scale(0.95)" 
                            },
                            "100%": { 
                                opacity: 1, 
                                transform: "translateY(0) scale(1)" 
                            }
                        })} 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)`}
                    >
                        <VStack gap={4} align="stretch">
                            <Heading 
                                fontSize={{ base: "xl", md: "2xl" }}
                                fontWeight="bold"
                                color="gray.900"
                                textAlign="center"
                                animation={`${keyframes({
                                    "0%": { opacity: 0, transform: "translateY(-10px)" },
                                    "100%": { opacity: 1, transform: "translateY(0)" }
                                })} 0.5s ease-out 0.1s both`}
                            >
                                Bist du dir sicher?
                            </Heading>
                            
                            <Box
                                bg={`linear-gradient(135deg, ${SNT_BLUE}15, ${SNT_BLUE}05)`}
                                borderRadius="lg"
                                p={4}
                                border="1px solid"
                                borderColor={`${SNT_BLUE}30`}
                                animation={`${keyframes({
                                    "0%": { opacity: 0, transform: "translateY(-10px) scale(0.95)" },
                                    "100%": { opacity: 1, transform: "translateY(0) scale(1)" }
                                })} 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s both`}
                            >
                                <HStack gap={2} mb={2}>
                                    <Crown size={24} color={SNT_BLUE} weight="fill" />
                                    <Text fontWeight="bold" color="gray.900" fontSize={{ base: "md", md: "lg" }}>
                                        Lifetime lohnt sich bereits nach 5 Monaten!
                                    </Text>
                                </HStack>
                                <Text color="gray.700" fontSize={{ base: "sm", md: "md" }}>
                                    Bei {formatPrice(pricing.monthly.price)}/Monat zahlst du nach 5 Monaten bereits mehr als die einmalige Lifetime-Gebühr von {formatPrice(pricing.lifetime.price)}.
                                </Text>
                            </Box>

                            <VStack gap={3} align="stretch">
                                {[
                                    { text: "Dauerhafter Zugang ", desc: "zu allen neuen Inhalten und Updates" },
                                    { text: "Keine wiederkehrenden Kosten", desc: " - Einmalig zahlen, für immer lernen" },
                                    { text: "Lebenslange Updates", desc: " - Alle zukünftigen Inhalte inklusive" }
                                ].map((item, index) => (
                                    <HStack 
                                        key={index}
                                        gap={3} 
                                        align="start"
                                        animation={`${keyframes({
                                            "0%": { opacity: 0, transform: "translateX(-10px)" },
                                            "100%": { opacity: 1, transform: "translateX(0)" }
                                        })} 0.5s ease-out ${0.3 + index * 0.1}s both`}
                                    >
                                        <CheckCircle size={20} color={SNT_BLUE} weight="fill" />
                                        <Text color="gray.800" fontSize={{ base: "sm", md: "md" }}>
                                            <Text as="span" fontWeight="bold">{item.text}</Text>{item.desc}
                                        </Text>
                                    </HStack>
                                ))}
                            </VStack>

                            <VStack gap={3} mt={6} w="full">
                                <Button
                                    bg={SNT_BLUE}
                                    color="white"
                                    w="full"
                                    size={{ base: "lg", md: "md" }}
                                    onClick={handleStayLifetime}
                                    _hover={{
                                        bg: "#0572c2",
                                        transform: "translateY(-2px)",
                                        boxShadow: "0 6px 20px rgba(6, 140, 239, 0.4)"
                                    }}
                                    fontWeight="bold"
                                    fontSize={{ base: "md", md: "sm" }}
                                    py={{ base: 6, md: 4 }}
                                    borderRadius="lg"
                                    boxShadow="0 4px 12px rgba(6, 140, 239, 0.3)"
                                    transition="all 0.3s ease"
                                    animation={`${keyframes({
                                        "0%": { opacity: 0, transform: "translateY(10px) scale(0.95)" },
                                        "100%": { opacity: 1, transform: "translateY(0) scale(1)" }
                                    })} 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.6s both`}
                                >
                                    Lifetime Sichern 🚀
                                </Button>
                                <Button
                                    variant="outline"
                                    w="full"
                                    size={{ base: "lg", md: "md" }}
                                    onClick={handleConfirmMonthly}
                                    borderColor="gray.300"
                                    borderWidth="2px"
                                    color="gray.700"
                                    _hover={{
                                        bg: "gray.50",
                                        borderColor: "gray.400",
                                        transform: "translateY(-1px)"
                                    }}
                                    fontSize={{ base: "md", md: "sm" }}
                                    py={{ base: 6, md: 4 }}
                                    borderRadius="lg"
                                    fontWeight="medium"
                                    transition="all 0.3s ease"
                                    animation={`${keyframes({
                                        "0%": { opacity: 0, transform: "translateY(10px)" },
                                        "100%": { opacity: 1, transform: "translateY(0)" }
                                    })} 0.5s ease-out 0.7s both`}
                                >
                                    Trotzdem Monatlich
                                </Button>
                            </VStack>
                        </VStack>
                    </Box>
                </Box>
            )}
        </>
    );
}

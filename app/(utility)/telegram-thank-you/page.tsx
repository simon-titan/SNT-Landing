"use client";

import React, { useEffect, useState } from "react";
import { Box, Flex, Heading, Text, VStack, HStack, Spinner } from "@chakra-ui/react";
import { 
    CheckCircle, 
    TelegramLogo, 
    ArrowRight,
    EnvelopeSimple,
    Warning
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

const TELEGRAM_BLUE = "#0088cc";

export default function TelegramThankYouPage() {
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [inviteLink, setInviteLink] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [telegramUserId, setTelegramUserId] = useState<string | null>(null);

    useEffect(() => {
        const processPayment = async () => {
            try {
                // Telegram User ID holen
                const urlParams = new URLSearchParams(window.location.search);
                let tgUserId = urlParams.get('telegram_user_id');
                
                if (!tgUserId) {
                    tgUserId = localStorage.getItem('telegram_user_id') || sessionStorage.getItem('telegram_user_id');
                }

                setTelegramUserId(tgUserId);

                // Provider und Produkt aus URL
                const provider = urlParams.get('provider') || 'unknown';
                const subscriptionId = urlParams.get('subscription_id');

                console.log('Processing Telegram payment:', { tgUserId, provider, subscriptionId });

                if (!tgUserId) {
                    // Kein Telegram User ID - trotzdem Erfolg zeigen aber ohne automatische Verknüpfung
                    setStatus("success");
                    setInviteLink(null);
                    return;
                }

                // API aufrufen um Nutzer zu aktivieren und Invite-Link zu generieren
                const response = await fetch('/api/telegram/paid-group/activate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        telegram_user_id: parseInt(tgUserId),
                        provider,
                        subscription_id: subscriptionId,
                    }),
                });

                const data = await response.json();

                if (data.success && data.invite_link) {
                    setInviteLink(data.invite_link);
                    setStatus("success");
                } else if (data.success) {
                    // Erfolgreich aber ohne Invite-Link (wird später gesendet)
                    setStatus("success");
                } else {
                    console.error('Activation failed:', data.error);
                    // Trotzdem Erfolg zeigen, aber mit Hinweis
                    setStatus("success");
                    setErrorMessage("Die automatische Verknüpfung konnte nicht abgeschlossen werden. Bitte kontaktiere den Support.");
                }
            } catch (error) {
                console.error('Error processing payment:', error);
                // Bei Fehler trotzdem Erfolg zeigen
                setStatus("success");
                setErrorMessage("Die automatische Verknüpfung konnte nicht abgeschlossen werden.");
            }
        };

        // Kurze Verzögerung für bessere UX
        const timer = setTimeout(processPayment, 1500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <Box 
            minH="100vh" 
            bg="gray.50"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            px={4}
            py={8}
        >
            <Box
                maxW="lg"
                w="full"
                bg="white"
                borderRadius="2xl"
                boxShadow="xl"
                p={{ base: 6, md: 10 }}
                textAlign="center"
            >
                {status === "loading" && (
                    <VStack gap={6}>
                        <Spinner size="xl" color={TELEGRAM_BLUE} thickness="4px" />
                        <VStack gap={2}>
                            <Heading size="lg" color="gray.800">
                                Zahlung wird verarbeitet...
                            </Heading>
                            <Text color="gray.600">
                                Bitte warte einen Moment.
                            </Text>
                        </VStack>
                    </VStack>
                )}

                {status === "success" && (
                    <VStack gap={6}>
                        {/* Success Icon */}
                        <Box
                            bg="green.100"
                            borderRadius="full"
                            p={4}
                        >
                            <CheckCircle size={64} color="#22c55e" weight="fill" />
                        </Box>

                        {/* Headline */}
                        <VStack gap={2}>
                            <Heading size="xl" color="gray.900">
                                Willkommen! 🎉
                            </Heading>
                            <Text color="gray.600" fontSize="lg">
                                Deine Zahlung war erfolgreich!
                            </Text>
                        </VStack>

                        {/* Error Message wenn vorhanden */}
                        {errorMessage && (
                            <Box
                                bg="yellow.50"
                                border="1px solid"
                                borderColor="yellow.200"
                                borderRadius="lg"
                                p={4}
                                w="full"
                            >
                                <HStack gap={2}>
                                    <Warning size={20} color="#ca8a04" weight="fill" />
                                    <Text fontSize="sm" color="yellow.800">
                                        {errorMessage}
                                    </Text>
                                </HStack>
                            </Box>
                        )}

                        {/* Invite Link Button */}
                        {inviteLink ? (
                            <Box w="full">
                                <a
                                    href={inviteLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: "12px",
                                        width: "100%",
                                        padding: "16px 24px",
                                        backgroundColor: TELEGRAM_BLUE,
                                        color: "white",
                                        borderRadius: "12px",
                                        fontWeight: "600",
                                        fontSize: "18px",
                                        textDecoration: "none",
                                        transition: "all 0.2s",
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.backgroundColor = "#006699";
                                        e.currentTarget.style.transform = "translateY(-2px)";
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.backgroundColor = TELEGRAM_BLUE;
                                        e.currentTarget.style.transform = "translateY(0)";
                                    }}
                                >
                                    <TelegramLogo size={24} weight="fill" />
                                    Jetzt der Gruppe beitreten
                                    <ArrowRight size={20} weight="bold" />
                                </a>
                                <Text fontSize="sm" color="gray.500" mt={3}>
                                    Der Link ist 24 Stunden gültig.
                                </Text>
                            </Box>
                        ) : (
                            <Box w="full">
                                <Box
                                    bg="blue.50"
                                    border="1px solid"
                                    borderColor="blue.200"
                                    borderRadius="lg"
                                    p={4}
                                >
                                    <VStack gap={2}>
                                        <TelegramLogo size={32} color={TELEGRAM_BLUE} weight="fill" />
                                        <Text color="blue.800" fontWeight="medium">
                                            {telegramUserId 
                                                ? "Der Einladungslink wird dir per Telegram gesendet."
                                                : "Öffne den Telegram-Bot um deinen Einladungslink zu erhalten."
                                            }
                                        </Text>
                                    </VStack>
                                </Box>
                            </Box>
                        )}

                        {/* Nächste Schritte */}
                        <Box 
                            w="full" 
                            bg="gray.50" 
                            borderRadius="xl" 
                            p={5}
                            mt={2}
                        >
                            <Text fontWeight="semibold" color="gray.800" mb={3} textAlign="left">
                                Nächste Schritte:
                            </Text>
                            <VStack align="stretch" gap={3}>
                                <HStack gap={3}>
                                    <Box
                                        bg="white"
                                        borderRadius="full"
                                        w={7}
                                        h={7}
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        fontWeight="bold"
                                        color={TELEGRAM_BLUE}
                                        border="2px solid"
                                        borderColor={TELEGRAM_BLUE}
                                        flexShrink={0}
                                    >
                                        1
                                    </Box>
                                    <Text color="gray.700" textAlign="left">
                                        Klicke auf den Button oben um der Gruppe beizutreten
                                    </Text>
                                </HStack>
                                <HStack gap={3}>
                                    <Box
                                        bg="white"
                                        borderRadius="full"
                                        w={7}
                                        h={7}
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        fontWeight="bold"
                                        color={TELEGRAM_BLUE}
                                        border="2px solid"
                                        borderColor={TELEGRAM_BLUE}
                                        flexShrink={0}
                                    >
                                        2
                                    </Box>
                                    <Text color="gray.700" textAlign="left">
                                        Aktiviere Benachrichtigungen für die Gruppe
                                    </Text>
                                </HStack>
                                <HStack gap={3}>
                                    <Box
                                        bg="white"
                                        borderRadius="full"
                                        w={7}
                                        h={7}
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        fontWeight="bold"
                                        color={TELEGRAM_BLUE}
                                        border="2px solid"
                                        borderColor={TELEGRAM_BLUE}
                                        flexShrink={0}
                                    >
                                        3
                                    </Box>
                                    <Text color="gray.700" textAlign="left">
                                        Check deine E-Mails für Zugangsdaten
                                    </Text>
                                </HStack>
                            </VStack>
                        </Box>

                        {/* Email Info */}
                        <HStack 
                            gap={2} 
                            color="gray.500" 
                            fontSize="sm"
                            justify="center"
                        >
                            <EnvelopeSimple size={18} />
                            <Text>
                                Eine Bestätigungs-E-Mail wurde an dich gesendet.
                            </Text>
                        </HStack>

                        {/* Support Link */}
                        <Text fontSize="sm" color="gray.500">
                            Fragen? Schreibe uns an{" "}
                            <Link 
                                href="mailto:support@snttrades.de"
                                style={{ color: TELEGRAM_BLUE, textDecoration: "underline" }}
                            >
                                support@snttrades.de
                            </Link>
                        </Text>
                    </VStack>
                )}

                {status === "error" && (
                    <VStack gap={6}>
                        <Box
                            bg="red.100"
                            borderRadius="full"
                            p={4}
                        >
                            <Warning size={64} color="#ef4444" weight="fill" />
                        </Box>
                        <VStack gap={2}>
                            <Heading size="lg" color="gray.800">
                                Etwas ist schiefgelaufen
                            </Heading>
                            <Text color="gray.600">
                                {errorMessage || "Bitte kontaktiere unseren Support."}
                            </Text>
                        </VStack>
                        <Link 
                            href="mailto:support@snttrades.de"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "8px",
                                padding: "12px 24px",
                                backgroundColor: TELEGRAM_BLUE,
                                color: "white",
                                borderRadius: "8px",
                                fontWeight: "600",
                                textDecoration: "none",
                            }}
                        >
                            <EnvelopeSimple size={20} />
                            Support kontaktieren
                        </Link>
                    </VStack>
                )}
            </Box>
        </Box>
    );
}

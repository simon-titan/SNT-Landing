"use client";

import React, { useEffect, useState } from "react";
import { Flex, Heading, Box, Text, HStack, VStack } from "@chakra-ui/react";
import { 
    CreditCard, 
    GoogleLogo, 
    AppleLogo, 
    CheckCircle, 
    TelegramLogo,
    ChartLineUp,
    Bell,
    UsersThree,
    ShieldCheck
} from "@phosphor-icons/react/dist/ssr";
import { getPersistedAffiliateCode } from "@/lib/affiliate/affiliate-storage";

const SNT_BLUE = "#068CEF";
const TELEGRAM_BLUE = "#0088cc";

// Telegram Gruppe Pricing - separate von der Hauptseite
const TELEGRAM_PRICING = {
    price: 47,
    label: "PRO MONAT",
    outseta: {
        planUid: "ZmNM7ZW2", // Outseta Plan für Telegram Gruppe
        paymentTerm: "month",
    },
    paypal: {
        planId: "7ma8lrWE", // PayPal Plan für Telegram Gruppe
        containerId: "paypal-button-telegram-group",
    },
};

export default function TelegramCheckoutPage() {
    const [isClient, setIsClient] = useState(false);
    const [telegramUserId, setTelegramUserId] = useState<string | null>(null);

    const buildThankYouUrl = (base: string, tgUserId: string | null) => {
        if (typeof window === "undefined") return base;
        const url = new URL(base, window.location.origin);
        const affiliateCode = getPersistedAffiliateCode();
        if (affiliateCode) {
            url.searchParams.set("aff", affiliateCode);
        }
        if (tgUserId) {
            url.searchParams.set("telegram_user_id", tgUserId);
        }
        return `${url.pathname}${url.search}`;
    };

    const buildCustomId = (tgUserId: string | null) => {
        const affiliateCode = getPersistedAffiliateCode();
        const suffix = affiliateCode ? `|AFF_${affiliateCode}` : "";
        const base = `TELEGRAM_GROUP${suffix}`;
        if (tgUserId) {
            return `TG_USER_${tgUserId}|${base}`;
        }
        return base;
    };

    useEffect(() => {
        setIsClient(true);
    }, []);

    const formatPrice = (price: number) => {
        return price % 1 === 0 ? `${price}€` : `${price.toFixed(2).replace('.', ',')}€`;
    };

    useEffect(() => {
        // Telegram User ID aus URL extrahieren und speichern
        const urlParams = new URLSearchParams(window.location.search);
        const tgUserId = urlParams.get('telegram_user_id');
        if (tgUserId) {
            setTelegramUserId(tgUserId);
            localStorage.setItem('telegram_user_id', tgUserId);
            sessionStorage.setItem('telegram_user_id', tgUserId);
            console.log('Telegram User ID gespeichert:', tgUserId);
        } else {
            // Versuche aus Storage zu laden
            const storedId = localStorage.getItem('telegram_user_id') || sessionStorage.getItem('telegram_user_id');
            if (storedId) {
                setTelegramUserId(storedId);
            }
        }

        // Outseta Success Handler
        const setupOutsetaSuccessHandler = () => {
            window.addEventListener('message', (event) => {
                if (event.data && event.data.type === 'outseta_success') {
                    console.log('✅ Outseta Registrierung erfolgreich:', event.data);
                    
                    const tgId = localStorage.getItem('telegram_user_id') || sessionStorage.getItem('telegram_user_id');
                    const redirectUrl = buildThankYouUrl(
                        `/telegram-thank-you?source=outseta&provider=outseta&product=telegram_group&transaction_id=${encodeURIComponent(event.data.transactionId || 'unknown')}`,
                        tgId
                    );

                    window.location.href = redirectUrl;
                }
            });

            const checkOutsetaSuccess = () => {
                const currentUrl = window.location.href;
                if (currentUrl.includes('success') || currentUrl.includes('completed')) {
                    console.log('✅ Outseta Success URL erkannt');
                    const tgId = localStorage.getItem('telegram_user_id') || sessionStorage.getItem('telegram_user_id');
                    const redirectUrl = buildThankYouUrl(
                        '/telegram-thank-you?source=outseta_url&provider=outseta&product=telegram_group',
                        tgId
                    );
                    window.location.href = redirectUrl;
                }
            };

            const observer = new MutationObserver(() => {
                const outsetaWidget = document.querySelector('[data-o-auth="1"]');
                if (outsetaWidget) {
                    const widgetText = outsetaWidget.textContent || '';
                    if (widgetText.includes('erfolgreich') || 
                        widgetText.includes('success') || 
                        widgetText.includes('Vielen Dank') ||
                        widgetText.includes('Thank you')) {
                        console.log('✅ Outseta Success Text erkannt');
                        setTimeout(() => {
                            const tgId = localStorage.getItem('telegram_user_id') || sessionStorage.getItem('telegram_user_id');
                            const redirectUrl = buildThankYouUrl(
                                '/telegram-thank-you?source=outseta_text&provider=outseta&product=telegram_group',
                                tgId
                            );
                            window.location.href = redirectUrl;
                        }, 2000);
                    }
                }
            });

            const target = document.querySelector('[data-o-auth="1"]');
            if (target) {
                observer.observe(target, {
                    childList: true,
                    subtree: true
                });
            }

            setInterval(checkOutsetaSuccess, 1000);
        };

        // PayPal Button
        const renderPayPalButton = () => {
            const containerId = TELEGRAM_PRICING.paypal.containerId;
            const container = document.getElementById(containerId);
            if (!container) return;
            
            container.innerHTML = '';
            
            if ((window as any).paypal) {
                (window as any).paypal.Buttons({
                    style: {
                        shape: 'rect',
                        color: 'gold',
                        layout: 'vertical',
                        label: 'paypal',
                        height: 48,
                        tagline: false
                    },
                    createSubscription: function(data: any, actions: any) {
                        const tgId = localStorage.getItem('telegram_user_id');
                        
                        return actions.subscription.create({
                            plan_id: TELEGRAM_PRICING.paypal.planId,
                            custom_id: buildCustomId(tgId),
                            application_context: {
                                brand_name: 'SNTTRADES',
                                shipping_preference: 'NO_SHIPPING',
                                payment_method: {
                                    payer_selected: 'PAYPAL',
                                    payee_preferred: 'IMMEDIATE_PAYMENT_REQUIRED'
                                }
                            }
                        });
                    },
                    onApprove: function(data: any) {
                        console.log('PayPal Subscription genehmigt:', data.subscriptionID);
                        
                        const tgId = localStorage.getItem('telegram_user_id') || sessionStorage.getItem('telegram_user_id');
                        const redirectUrl = buildThankYouUrl(
                            '/telegram-thank-you?source=paypal_subscription&provider=paypal&product=telegram_group&subscription_id=' + (data.subscriptionID || 'unknown'),
                            tgId
                        );
                        
                        window.location.href = redirectUrl;
                    },
                    onError: function(err: any) {
                        console.error('PayPal Subscription Fehler:', err);
                        alert('Es gab einen Fehler beim Erstellen des Abonnements. Bitte versuchen Sie es erneut.');
                    }
                }).render(`#${containerId}`);
            }
        };

        // PayPal SDK laden
        if (!(window as any).paypal && !document.getElementById('paypal-sdk-telegram')) {
            const script = document.createElement('script');
            script.id = 'paypal-sdk-telegram';
            script.src = 'https://www.paypal.com/sdk/js?client-id=ASzGd21OHNK5yaZUKtlBrKw4F2oN04ZcUxyUmzAy_VeOjMWYCV7vEy1D0p_biwg5VcBVh_NvfOTEZnmF&vault=true&intent=subscription';
            script.setAttribute('data-sdk-integration-source', 'button-factory');
            script.onload = () => {
                renderPayPalButton();
            };
            document.head.appendChild(script);
        } else {
            setTimeout(renderPayPalButton, 100);
        }

        setTimeout(setupOutsetaSuccessHandler, 1000);
    }, []);

    return (
        <>
            <style jsx global>{`
                .item-header {
                    display: none !important;
                }
            `}</style>
            <Box 
                minH="100vh" 
                bg="white" 
                display="flex" 
                flexDirection="column"
            >
                {/* Header */}
                <Box 
                    as="header" 
                    w="full"
                    py={6} 
                    display="flex" 
                    flexDirection="column"
                    justifyContent="center" 
                    alignItems="center"
                    bg="black"
                    borderBottom="1px solid"
                    borderColor="gray.800"
                    gap={3}
                >
                    <Box position="relative" zIndex={1} textAlign="center">
                        <HStack gap={2} justify="center" mb={2}>
                            <TelegramLogo size={24} color={TELEGRAM_BLUE} weight="fill" />
                            <Heading
                                as="h1"
                                fontSize={{ base: "xl", md: "3xl" }}
                                fontWeight="bold"
                                color="white"
                                textAlign="center"
                            >
                                SNT Trading Signale
                            </Heading>
                        </HStack>
                        <Text 
                            textAlign="center" 
                            color="gray.300" 
                            fontSize="sm" 
                            fontWeight="medium"
                        >
                            Exklusive Telegram Gruppe • Tägliche Signale
                        </Text>
                    </Box>
                </Box>
                
                {/* Mobile: Preisbox ÜBER dem Checkout */}
                <Box 
                    display={{ base: "block", md: "none" }} 
                    maxW="6xl" 
                    mx="auto" 
                    w="full" 
                    px={4} 
                    mt={8}
                    mb={6}
                >
                    <Box
                        position="relative"
                        w="full"
                        maxW="md"
                        mx="auto"
                        bg="white"
                        borderRadius="xl"
                        boxShadow="lg"
                        border="2px solid"
                        borderColor={TELEGRAM_BLUE}
                        p={{ base: 4, md: 6 }}
                    >
                        <Flex
                            align="center"
                            justify="center"
                            w="full"
                            flexDirection="column"
                            gap={1}
                        >
                            <HStack gap={2}>
                                <TelegramLogo size={28} color={TELEGRAM_BLUE} weight="fill" />
                                <Text fontSize={{ base: "3xl", sm: "4xl" }} fontWeight="extrabold" color={TELEGRAM_BLUE} lineHeight="1">
                                    {formatPrice(TELEGRAM_PRICING.price)}
                                </Text>
                            </HStack>
                            <Text fontSize={{ base: "sm", sm: "md" }} fontWeight="bold" color="gray.800" letterSpacing="0.5px" mt={-1}>
                                {TELEGRAM_PRICING.label}
                            </Text>
                            <Text fontSize="xs" color="gray.600">Jederzeit kündbar</Text>
                        </Flex>
                    </Box>
                </Box>

                <Flex direction={{ base: 'column', md: 'row' }} maxW="6xl" mx="auto" w="full" gap={8} mt={{ base: 0, md: 16 }} px={4} pb={16}>
                    {/* Linke Seite: Checkout-Widget */}
                    <section style={{ flex: 1, maxWidth: 520, minWidth: 0 }} className="bg-white rounded-xl shadow-lg p-8 flex flex-col justify-center mx-auto border-2 border-gray-200">
                        
                        {/* Telegram User ID Info */}
                        {telegramUserId && (
                            <Box 
                                bg="green.50" 
                                border="1px solid"
                                borderColor="green.200"
                                borderRadius="lg" 
                                p={3} 
                                mb={4}
                            >
                                <HStack gap={2}>
                                    <CheckCircle size={20} color="#22c55e" weight="fill" />
                                    <Text fontSize="sm" color="green.700">
                                        Dein Telegram-Account wird nach dem Kauf automatisch verknüpft.
                                    </Text>
                                </HStack>
                            </Box>
                        )}

                        {/* PayPal Express */}
                        <div id="paypal-express-section" style={{ marginBottom: "2rem" }}>
                            <div id="telegram-paypal-section" style={{ textAlign: "center" }}>
                                {isClient && (
                                    <div id={TELEGRAM_PRICING.paypal.containerId} style={{ width: "100%", maxWidth: "400px", margin: "0 auto" }}></div>
                                )}
                            </div>

                            {/* Trennlinie */}
                            <div style={{ 
                                margin: "24px 0",
                                textAlign: "center",
                                position: "relative"
                            }}>
                                <div style={{
                                    height: "1px",
                                    background: "linear-gradient(90deg, transparent, #e5e7eb, transparent)",
                                    position: "relative"
                                }}></div>
                                <span style={{
                                    background: "white",
                                    color: "#6b7280",
                                    padding: "0 16px",
                                    fontSize: "14px",
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)"
                                }}>
                                    oder
                                </span>
                            </div>
                        </div>

                        {/* Reguläre Registrierung */}
                        <div id="regular-checkout-section">
                            <Box
                                bg={`linear-gradient(135deg, ${TELEGRAM_BLUE} 0%, #006699 100%)`}
                                borderRadius="12px"
                                p={4}
                                mb={4}
                                color="white"
                                textAlign="center"
                                boxShadow="0 4px 12px rgba(0, 136, 204, 0.3)"
                            >
                                <HStack gap={4} fontSize="16px" fontWeight="medium" flexWrap="wrap" justify="center">
                                    <HStack gap={2}>
                                        <CreditCard size={20} weight="fill" />
                                        <Text>Kreditkarte</Text>
                                    </HStack>
                                    <Text opacity={0.7}>•</Text>
                                    <HStack gap={2}>
                                        <CreditCard size={20} weight="fill" />
                                        <Text>Debitkarte</Text>
                                    </HStack>
                                    <Text opacity={0.7}>•</Text>
                                    <HStack gap={2}>
                                        <GoogleLogo size={20} weight="fill" />
                                        <Text>Google Pay</Text>
                                    </HStack>
                                    <Text opacity={0.7}>•</Text>
                                    <HStack gap={2}>
                                        <AppleLogo size={20} weight="fill" />
                                        <Text>Apple Pay</Text>
                                    </HStack>
                                </HStack>
                            </Box>
                            
                            {/* Outseta Embed für Telegram Gruppe */}
                            {isClient && (
                                <div data-o-auth="1"
                                    data-widget-mode="register"
                                    data-plan-uid={TELEGRAM_PRICING.outseta.planUid}
                                    data-plan-payment-term={TELEGRAM_PRICING.outseta.paymentTerm}
                                    data-skip-plan-options="true"
                                    data-mode="embed"
                                    style={{ background: "white", color: "black", padding: "16px", borderRadius: "8px" }}>
                                </div>
                            )}
                        </div>
                    </section>
                    
                    {/* Rechte Seite: Produktinfos */}
                    <Box w={420} flexShrink={0} display={{ base: "none", md: "flex" }} flexDirection="column" gap={6}>
                        {/* Preisbox Desktop */}
                        <Box
                            position="relative"
                            w="full"
                            maxW="md"
                            mx="auto"
                            bg="white"
                            borderRadius="xl"
                            boxShadow="lg"
                            border="2px solid"
                            borderColor={TELEGRAM_BLUE}
                            p={6}
                        >
                            <Flex
                                align="center"
                                justify="center"
                                w="full"
                                flexDirection="column"
                                gap={1}
                            >
                                <HStack gap={2}>
                                    <TelegramLogo size={32} color={TELEGRAM_BLUE} weight="fill" />
                                    <Text fontSize={{ base: "3xl", sm: "4xl" }} fontWeight="extrabold" color={TELEGRAM_BLUE} lineHeight="1">
                                        {formatPrice(TELEGRAM_PRICING.price)}
                                    </Text>
                                </HStack>
                                <Text fontSize={{ base: "sm", sm: "md" }} fontWeight="bold" color="gray.800" letterSpacing="0.5px" mt={-1}>
                                    {TELEGRAM_PRICING.label}
                                </Text>
                                <Text fontSize="xs" color="gray.600">Jederzeit kündbar</Text>
                            </Flex>
                        </Box>

                        {/* Was du bekommst */}
                        <Box 
                            bg="white"
                            borderRadius="xl" 
                            boxShadow="md" 
                            p={6} 
                            border="1px solid"
                            borderColor="gray.200"
                        >
                            <Text textAlign="left" fontSize="lg" color="gray.900" fontWeight="bold" mb={4} letterSpacing="-0.5px">
                                Was du bekommst:
                            </Text>
                            <VStack align="stretch" gap={3}>
                                <HStack gap={3}>
                                    <Box flexShrink={0}>
                                        <ChartLineUp size={24} color={TELEGRAM_BLUE} weight="fill" />
                                    </Box>
                                    <Box>
                                        <Text fontWeight="semibold" color="gray.900">Tägliche Trading Signale</Text>
                                        <Text fontSize="sm" color="gray.600">Entry, Stop-Loss & Take-Profit</Text>
                                    </Box>
                                </HStack>
                                <HStack gap={3}>
                                    <Box flexShrink={0}>
                                        <Bell size={24} color={TELEGRAM_BLUE} weight="fill" />
                                    </Box>
                                    <Box>
                                        <Text fontWeight="semibold" color="gray.900">Echtzeit-Benachrichtigungen</Text>
                                        <Text fontSize="sm" color="gray.600">Direkt auf dein Handy</Text>
                                    </Box>
                                </HStack>
                                <HStack gap={3}>
                                    <Box flexShrink={0}>
                                        <UsersThree size={24} color={TELEGRAM_BLUE} weight="fill" />
                                    </Box>
                                    <Box>
                                        <Text fontWeight="semibold" color="gray.900">Exklusive Community</Text>
                                        <Text fontSize="sm" color="gray.600">Austausch mit anderen Tradern</Text>
                                    </Box>
                                </HStack>
                                <HStack gap={3}>
                                    <Box flexShrink={0}>
                                        <ShieldCheck size={24} color={TELEGRAM_BLUE} weight="fill" />
                                    </Box>
                                    <Box>
                                        <Text fontWeight="semibold" color="gray.900">Jederzeit kündbar</Text>
                                        <Text fontSize="sm" color="gray.600">Keine Vertragsbindung</Text>
                                    </Box>
                                </HStack>
                            </VStack>
                        </Box>

                        {/* Trust-Elemente */}
                        <Box 
                            bg="gray.50"
                            borderRadius="xl" 
                            p={4}
                            border="1px solid"
                            borderColor="gray.200"
                        >
                            <HStack gap={2} justify="center">
                                <CheckCircle size={20} color="#22c55e" weight="fill" />
                                <Text fontSize="sm" color="gray.700" fontWeight="medium">
                                    Sichere Zahlung • SSL-verschlüsselt
                                </Text>
                            </HStack>
                        </Box>
                    </Box>
                </Flex>

                {/* Mobile: Vorteile unter dem Checkout */}
                <Box 
                    display={{ base: "block", md: "none" }} 
                    px={4} 
                    pb={8}
                >
                    <Box 
                        bg="white"
                        borderRadius="xl" 
                        boxShadow="md" 
                        p={5} 
                        border="1px solid"
                        borderColor="gray.200"
                    >
                        <Text fontSize="md" color="gray.900" fontWeight="bold" mb={3}>
                            Was du bekommst:
                        </Text>
                        <VStack align="stretch" gap={2}>
                            <HStack gap={2}>
                                <ChartLineUp size={20} color={TELEGRAM_BLUE} weight="fill" />
                                <Text fontSize="sm" color="gray.800">Tägliche Trading Signale</Text>
                            </HStack>
                            <HStack gap={2}>
                                <Bell size={20} color={TELEGRAM_BLUE} weight="fill" />
                                <Text fontSize="sm" color="gray.800">Echtzeit-Benachrichtigungen</Text>
                            </HStack>
                            <HStack gap={2}>
                                <UsersThree size={20} color={TELEGRAM_BLUE} weight="fill" />
                                <Text fontSize="sm" color="gray.800">Exklusive Community</Text>
                            </HStack>
                            <HStack gap={2}>
                                <ShieldCheck size={20} color={TELEGRAM_BLUE} weight="fill" />
                                <Text fontSize="sm" color="gray.800">Jederzeit kündbar</Text>
                            </HStack>
                        </VStack>
                    </Box>
                </Box>
            </Box>
        </>
    );
}

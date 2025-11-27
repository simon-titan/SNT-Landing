"use client";

import React, { useEffect, useState } from "react";
import { Flex, Heading, Box, Text, HStack } from "@chakra-ui/react";
import { CreditCard, GoogleLogo, AppleLogo } from "@phosphor-icons/react/dist/ssr";
import { keyframes } from "@emotion/react";
import "../../../../styles/paypal.css";

const SNT_BLUE = "#068CEF";
const SNT_YELLOW = "rgba(251, 191, 36, 1)";

declare global {
    interface Window {
        paypal?: any;
    }
}

export default function LifetimeCheckoutPage() {
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

    useEffect(() => {
        // Outseta Success Handler
        const setupOutsetaSuccessHandler = () => {
            // Event Listener für Outseta Registrierung
            window.addEventListener('message', (event) => {
                if (event.data && event.data.type === 'outseta_success') {
                    console.log('✅ Outseta Registrierung erfolgreich:', event.data);
                    // Weiterleitung zur Thank You Seite
                    window.location.href = '/thank-you-2?source=outseta&transaction_id=' + (event.data.transactionId || 'unknown');
                }
            });

            // Zusätzlich: Überwache URL-Änderungen die auf Success hindeuten
            const checkOutsetaSuccess = () => {
                const currentUrl = window.location.href;
                if (currentUrl.includes('success') || currentUrl.includes('completed')) {
                    console.log('✅ Outseta Success URL erkannt');
                    window.location.href = '/thank-you-2?source=outseta_url';
                }
            };

            // Überwache DOM-Änderungen für Success-Anzeigen
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
                            window.location.href = '/thank-you-2?source=outseta_text';
                        }, 2000); // 2 Sekunden Delay für User-Feedback
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

            // Periodische URL-Überprüfung
            setInterval(checkOutsetaSuccess, 1000);
        };

        // PayPal Lifetime Success Handler
        const setupPayPalLifetimeHandler = () => {
            // Funktion um Form Event Listener hinzuzufügen
            const attachFormListener = () => {
                const lifetimeForm = document.querySelector('form[action*="paypal.com/ncp/payment"]');
                if (lifetimeForm && !lifetimeForm.getAttribute('data-listener-attached')) {
                    lifetimeForm.setAttribute('data-listener-attached', 'true');
                    lifetimeForm.addEventListener('submit', () => {
                        console.log('📝 PayPal Lifetime Zahlung initiiert');
                        // Speichere Zeitstempel für Return-Handler
                        localStorage.setItem('paypal_lifetime_initiated', Date.now().toString());
                    });
                    console.log('🔗 PayPal Lifetime Form Listener angehängt');
                }
            };

            // Versuche sofort und dann periodisch den Listener anzuhängen
            attachFormListener();
            const formInterval = setInterval(() => {
                attachFormListener();
                // Stoppe nach 30 Sekunden
                setTimeout(() => clearInterval(formInterval), 30000);
            }, 1000);

            // Überwache Returns von PayPal (falls User zurückkommt)
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('payment_id') || urlParams.get('PayerID') || urlParams.get('token')) {
                const initiatedTime = localStorage.getItem('paypal_lifetime_initiated');
                if (initiatedTime && (Date.now() - parseInt(initiatedTime)) < 300000) { // 5 Minuten
                    console.log('✅ PayPal Lifetime Return erkannt');
                    localStorage.removeItem('paypal_lifetime_initiated');
                    window.location.href = '/thank-you-2?source=paypal_lifetime&payment_id=' + (urlParams.get('payment_id') || 'unknown');
                }
            }

            // Alternative: Überwache Click auf PayPal Button als Fallback
            document.addEventListener('click', (event) => {
                const target = event.target as HTMLElement;
                if (target && (target.classList.contains('pp-NULRVQG5GN8PE') || 
                              target.closest('form[action*="paypal.com/ncp/payment"]'))) {
                    console.log('📝 PayPal Lifetime Button geklickt');
                    localStorage.setItem('paypal_lifetime_initiated', Date.now().toString());
                }
            });
        };

        // Setup aller Success Handler
        setTimeout(setupOutsetaSuccessHandler, 1000);
        setTimeout(setupPayPalLifetimeHandler, 1000);

    }, []); // Empty dependency array ensures this runs once on mount
    
    useEffect(() => {
        const renderPayPalButton = () => {
            if (typeof window !== 'undefined' && window.paypal) {
                window.paypal
                    .HostedButtons({
                        hostedButtonId: '68525GEP8BKRS',
                    })
                    .render('#paypal-container-68525GEP8BKRS');
            }
        };

        if (typeof window !== 'undefined' && !window.paypal) {
            const script = document.createElement('script');
            script.src = 'https://www.paypal.com/sdk/js?client-id=BAA-0m5pkSxHufms7Bz99yWR1lzshrXB63L2g-cvYFfUsI1-ul1VcqCAsVudEICk3cLUAXx2VAsCFuuTHY&components=hosted-buttons&disable-funding=venmo&currency=EUR';
            script.async = true;
            script.onload = () => {
                renderPayPalButton();
            };
            document.body.appendChild(script);
        } else {
            renderPayPalButton();
        }
    }, []);

    return (
        <>
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
                    <Heading
                        as="h1"
                        fontSize={{ base: "xl", md: "3xl" }}
                        fontWeight="bold"
                        color="white"
                        textAlign="center"
                    >
                        SNTTRADES™ 
                    </Heading>
                    <Text 
                        textAlign="center" 
                        color="gray.300" 
                        fontSize="sm" 
                        fontWeight="medium"
                        mt={2}
                    >
                        🔥 Lifetime-Angebot • 230€ gespart • Lebenslanger Zugang
                    </Text>
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
                >
                    <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="bold" color="red.600">
                        DAS ANGEBOT GILT NOCH FÜR
                    </Text>
                    <Text fontSize={{ base: "sm", md: "md" }} fontWeight="extrabold" color="red.700">
                        {formatTime(timeLeft)}
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
                {/* Preisbox - Mobile */}
                <Box
                    position="relative"
                    w="full"
                    maxW="md"
                    mx="auto"
                    bg="white"
                    borderRadius="xl"
                    boxShadow="lg"
                    border="2px solid"
                    borderColor={SNT_YELLOW}
                    p={{ base: 4, md: 6 }}
                >
                    <Flex
                        align="center"
                        justify="center"
                        w="full"
                        flexDirection="column"
                        gap={1}
                    >
                        {/* Spar-Badge */}
                        <HStack gap={2} align="center" justify="center" flexWrap="wrap" mb={1}>
                            <Text
                                fontSize={{ base: "sm", sm: "md" }}
                                fontWeight="bold"
                                color="red.500"
                                textDecoration="line-through"
                            >
                                567€
                            </Text>
                            <Box
                                bg="red.500"
                                color="white"
                                px={2}
                                py={0.5}
                                borderRadius="md"
                                fontSize="2xs"
                                fontWeight="bold"
                                whiteSpace="nowrap"
                            >
                                230€ gespart!
                            </Box>
                        </HStack>
                        <Text fontSize={{ base: "3xl", sm: "4xl" }} fontWeight="extrabold" color={SNT_BLUE} lineHeight="1">247€</Text>
                        <Text fontSize={{ base: "sm", sm: "md" }} fontWeight="bold" color="gray.800" letterSpacing="0.5px" mt={-1}>EINMALIG</Text>
                        <Text fontSize="xs" color="gray.600">Lebenslanger Zugang</Text>
                    </Flex>
                </Box>
            </Box>

            <Flex direction={{ base: 'column', md: 'row' }} maxW="6xl" mx="auto" w="full" gap={8} mt={{ base: 0, md: 32 }} px={4}>
                {/* Linke Seite: Checkout-Widget */}
                <section style={{ flex: 1, maxWidth: 520, minWidth: 0 }} className="bg-white rounded-xl shadow-lg p-8 flex flex-col justify-center mx-auto border-2 border-gray-200">
                    
                    {/* PayPal Express Registrierung */}
                    <div id="paypal-express-section" style={{ marginBottom: "2rem" }}>
                        {/* Neuer PayPal Hosted Button */}
                        <div id="lifetime-paypal-section" style={{ textAlign: "center" }}>
                            {/* PayPal Hosted Button Container */}
                            <Box
                                id="paypal-container-68525GEP8BKRS"
                                mt={4}
                            ></Box>
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

                    {/* Reguläre Registrierung mit Zahlungsmethoden */}
                    <div id="regular-checkout-section">
                        <Box
                            bg={`linear-gradient(135deg, ${SNT_BLUE} 0%, #0572c2 100%)`}
                            borderRadius="12px"
                            p={4}
                            mb={4}
                            color="white"
                            textAlign="center"
                            boxShadow="0 4px 12px rgba(6, 140, 239, 0.3)"
                        >
                            <HStack gap={4} fontSize="16px" fontWeight="medium" flexWrap="wrap" justify="center">
                                <HStack gap={2}>
                                    <CreditCard size={20} weight="fill" />
                                    <Text>Kreditkarte</Text>
                                </HStack>
                                <Text opacity={0.7}>•</Text>
                                <HStack gap={2}>
                                    <CreditCard size={20} weight="fill" />
                                    <Text>Debitkarte   </Text>
                                    
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
                        
                        {/* Lifetime Outseta Embed */}
                        <div data-o-auth="1"
                            data-widget-mode="register"
                            data-plan-uid="496LXdmX"
                            data-plan-payment-term="oneTime"
                            data-skip-plan-options="true"
                            data-mode="embed"
                            style={{ background: "white", color: "black", padding: "16px", borderRadius: "8px" }}>
                        </div>
                    </div>
                </section>
                
                {/* Rechte Seite: Produktinfos, Vorteile, etc. - nur auf Desktop */}
                <Box w={420} flexShrink={0} display={{ base: "none", md: "flex" }} flexDirection="column" gap={6}>
                    {/* Preisbox - AN ERSTER STELLE */}
                    <Box
                        position="relative"
                        w="full"
                        maxW="md"
                        mx="auto"
                        bg="white"
                        borderRadius="xl"
                        boxShadow="lg"
                        border="2px solid"
                        borderColor={SNT_YELLOW}
                        p={6}
                    >
                        <Flex
                            align="center"
                            justify="center"
                            w="full"
                            flexDirection="column"
                            gap={1}
                        >
                            {/* Spar-Badge */}
                            <HStack gap={2} align="center" justify="center" flexWrap="wrap" mb={1}>
                                <Text
                                    fontSize={{ base: "sm", sm: "md" }}
                                    fontWeight="bold"
                                    color="red.500"
                                    textDecoration="line-through"
                                >
                                    567€
                                </Text>
                                <Box
                                    bg="red.500"
                                    color="white"
                                    px={2}
                                    py={0.5}
                                    borderRadius="md"
                                    fontSize="2xs"
                                    fontWeight="bold"
                                    whiteSpace="nowrap"
                                >
                                    230€ gespart!
                                </Box>
                            </HStack>
                            <Text fontSize={{ base: "3xl", sm: "4xl" }} fontWeight="extrabold" color={SNT_BLUE} lineHeight="1">
                                247€</Text>
                            <Text fontSize={{ base: "sm", sm: "md" }} fontWeight="bold" color="gray.800" letterSpacing="0.5px" mt={-1}>EINMALIG</Text>
                            <Text fontSize="xs" color="gray.600">Lebenslanger Zugang</Text>
                        </Flex>
                    </Box>
                    
                    {/* What you get - Desktop Version */}
                    <Box bg="white"
                         borderRadius="xl" 
                         boxShadow="md" 
                         p={6} 
                         border="1px solid"
                         borderColor="gray.200"
                         display="flex" 
                         flexDirection="column" 
                         gap={2}>
                        <Text textAlign="left" fontSize="lg" color="gray.900" fontWeight="bold" mb={2} letterSpacing="-0.5px">
                            Was du bekommst:
                        </Text>
                        <Box as="ul" display="flex" flexDirection="column" gap={2} mb={2} pl={0}>
                            <Flex as="li" align="center" gap={2}>
                                <Box as="span" display="flex" alignItems="center" justifyContent="center">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="10" cy="10" r="10" fill={SNT_BLUE}/>
                                        <path d="M6 10.5L9 13.5L14 8.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </Box>
                                <Text color="gray.800" as="span">
                                    <Text as="span" fontWeight="semibold" color="gray.900">Kompletter Videokurs</Text> rund um unsere Strategie
                                </Text>
                            </Flex>
                            <Flex as="li" align="center" gap={2}>
                                <Box as="span" display="flex" alignItems="center" justifyContent="center">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="10" cy="10" r="10" fill={SNT_BLUE}/>
                                        <path d="M6 10.5L9 13.5L14 8.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </Box>
                                <Text color="gray.800" as="span">
                                    <Text as="span" fontWeight="semibold" color="gray.900">Live Mentoring calls</Text> wo wir live traden
                                </Text>
                            </Flex>
                            <Flex as="li" align="center" gap={2}>
                                <Box as="span" display="flex" alignItems="center" justifyContent="center">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="10" cy="10" r="10" fill={SNT_BLUE}/>
                                        <path d="M6 10.5L9 13.5L14 8.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </Box>
                                <Text color="gray.800" as="span">Zugang zur <Text as="span" fontWeight="semibold" color="gray.900">exklusiven Community</Text></Text>
                            </Flex>
                            <Flex as="li" align="center" gap={2}>
                                <Box as="span" display="flex" alignItems="center" justifyContent="center">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="10" cy="10" r="10" fill={SNT_BLUE}/>
                                        <path d="M6 10.5L9 13.5L14 8.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </Box>
                                <Text color="gray.800" as="span">Zugang zu unseren <Text as="span" fontWeight="semibold" color="gray.900">Tradingsoftwares und Tools</Text></Text>
                            </Flex>
                            <Flex as="li" align="center" gap={2}>
                                <Box as="span" display="flex" alignItems="center" justifyContent="center">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="10" cy="10" r="10" fill={SNT_YELLOW}/>
                                        <path d="M6 10.5L9 13.5L14 8.5" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </Box>
                                <Text color="gray.800" as="span">
                                    <Text as="span" fontWeight="semibold" color={SNT_YELLOW}>+ Lebenslange Updates</Text> - Alle zukünftigen Inhalte inklusive
                                </Text>
                            </Flex>
                        </Box>
                    </Box>

                </Box>
            </Flex>
            </Box>
        </>
    );
}

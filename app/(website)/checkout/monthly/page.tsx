"use client";

import React, { useEffect } from "react";
import { Flex, Heading, Box, Text } from "@chakra-ui/react";

export default function MonthlyCheckoutPage() {
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

        // PayPal Button Rendering Funktion
        const renderPayPalButton = () => {
            const container = document.getElementById('paypal-button-container-P-59C23375XF491315BNCBCDVQ');
            if (!container) return;
            
            // Container leeren um doppelte Buttons zu vermeiden
            container.innerHTML = '';
            
            if ((window as any).paypal) {
                (window as any).paypal.Buttons({
                    style: {
                        shape: 'rect',
                        color: 'gold',
                        layout: 'vertical',
                        label: 'pay',
                        height: 48,
                        tagline: false
                    },
                    createSubscription: function(data, actions) {
                        return actions.subscription.create({
                            plan_id: 'P-59C23375XF491315BNCBCDVQ',
                            custom_id: 'SNTTRADES_MONTHLY_PLAN',
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
                    onApprove: function(data, actions) {
                        console.log('PayPal Subscription genehmigt:', data.subscriptionID);
                        alert(`Abonnement erfolgreich erstellt! ID: ${data.subscriptionID}`);
                        // Weiterleitung zur Thank-You Seite
                        window.location.href = '/thank-you-2?subscription_id=' + data.subscriptionID;
                    },
                    onError: function(err) {
                        console.error('PayPal Subscription Fehler:', err);
                        alert('Es gab einen Fehler beim Erstellen des Abonnements. Bitte versuchen Sie es erneut.');
                    }
                }).render('#paypal-button-container-P-59C23375XF491315BNCBCDVQ');
            }
        };

        // PayPal SDK dynamisch laden falls nicht vorhanden
        if (!(window as any).paypal && !document.getElementById('paypal-sdk-abo')) {
            const script = document.createElement('script');
            script.id = 'paypal-sdk-abo';
            script.src = 'https://www.paypal.com/sdk/js?client-id=ASzGd21OHNK5yaZUKtlBrKw4F2oN04ZcUxyUmzAy_VeOjMWYCV7vEy1D0p_biwg5VcBVh_NvfOTEZnmF&vault=true&intent=subscription';
            script.setAttribute('data-sdk-integration-source', 'button-factory');
            script.onload = () => {
                renderPayPalButton();
            };
            document.head.appendChild(script);
        } else {
            // Falls SDK bereits geladen, Button direkt rendern
            setTimeout(renderPayPalButton, 100);
        }

        // Setup aller Success Handler
        setTimeout(setupOutsetaSuccessHandler, 1000);
    }, []);

    return (
        <Box minH="100vh" bg="#f7f7f7" display="flex" flexDirection="column" pb="32">
            {/* Header */}
            <Box as="header" w="full"
                py={4} display="flex" justifyContent="center" alignItems="center"
                style={{ background: 'linear-gradient(90deg, #000000 0%,rgb(11, 29, 68) 100%)' }}>
                <Heading
                    as="h1"
                    fontSize={{ base: "xl", md: "2xl" }}
                    fontWeight="700"
                    lineHeight="0.9"
                    bg="linear-gradient(0deg,rgb(255, 255, 255) 0%,rgb(126, 126, 126) 100%)"
                    bgClip="text"
                    filter="drop-shadow(0 0 10px rgba(156, 163, 175, 0.3))"
                >
                    SNTTRADES™ - MONTHLY
                </Heading>
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
                    bg="linear-gradient(90deg, #4F46E5 0%, #7C3AED 100%)"
                    p="4px"
                    borderRadius="xl"
                    boxShadow="lg"
                >
                    <Flex
                        bg="#181c2b"
                        borderRadius="xl"
                        px="24px"
                        py="16px"
                        align="center"
                        justify="center"
                        w="full"
                        position="relative"
                        flexDirection="column"
                    >
                        <Text fontSize="4xl" fontWeight="extrabold" color="#9333ea" mb={2}>59,99€</Text>
                        <Text fontSize="lg" fontWeight="bold" color="white" letterSpacing="0.5px" mb={1}>PRO MONAT</Text>
                        <Text fontSize="sm" color="gray.300">Jederzeit kündbar</Text>
                        
                        {/* Flexibilität Label */}
                        <Box position="absolute" top="-12px" left="50%" transform="translateX(-50%)" bg="#9333ea" color="white" fontWeight={700} fontSize="xs" borderRadius={6} px={4} py={2} boxShadow="0 4px 12px #0002" zIndex={10}>
                            FLEXIBEL KÜNDBAR
                        </Box>
                    </Flex>
                </Box>
            </Box>

            <Flex direction={{ base: 'column', md: 'row' }} maxW="6xl" mx="auto" w="full" gap={8} mt={{ base: 0, md: 32 }} px={4}>
                {/* Linke Seite: Checkout-Widget */}
                <section style={{ flex: 1, maxWidth: 520, minWidth: 0 }} className="bg-white rounded-xl shadow-lg p-8 flex flex-col justify-center mx-auto">
                    
                    {/* PayPal Express Registrierung */}
                    <div id="paypal-express-section" style={{ marginBottom: "2rem" }}>
                        {/* PayPal Abo Button (Monatlich) */}
                        <div id="monthly-paypal-section" style={{ textAlign: "center" }}>
                            <div style={{
                                background: "linear-gradient(135deg, #0070ba 0%, #005ea6 100%)",
                                borderRadius: "12px",
                                padding: "16px",
                                marginBottom: "16px",
                                color: "white",
                                fontWeight: "semibold",
                                fontSize: "16px",
                                textAlign: "center",
                                boxShadow: "0 4px 12px rgba(0, 112, 186, 0.3)"
                            }}>
                                🚀 PAYPAL-EXPRESS-REGISTRIERUNG
                            </div>
                            <div id="paypal-button-container-P-59C23375XF491315BNCBCDVQ" style={{ width: "100%", maxWidth: "400px", margin: "0 auto" }}></div>
                            <section style={{ fontSize: "12px", color: "#666", marginTop: "8px", textAlign: "center" }}>
                              
                              Express-Checkout • Sicher & Schnell
                            </section>
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
                        <div style={{
                            background: "linear-gradient(135deg, #1f2937 0%, #374151 100%)",
                            borderRadius: "12px",
                            padding: "16px",
                            marginBottom: "16px",
                            color: "white",
                            textAlign: "center",
                            boxShadow: "0 4px 12px rgba(31, 41, 55, 0.3)"
                        }}>
                            <div style={{ fontWeight: "bold", fontSize: "16px", marginBottom: "8px" }}>
                                💳 REGISTRIERUNG MIT KARTE
                            </div>
                            <div style={{ fontSize: "14px", opacity: 0.9 }}>
                                Kreditkarte • Debitkarte • Google Pay • Apple Pay
                            </div>
                        </div>
                        
                        {/* Monthly Outseta Embed */}
                        <div data-o-auth="1"
                            data-widget-mode="register"
                            data-plan-uid="7ma651QE"
                            data-plan-payment-term="month"
                            data-skip-plan-options="true"
                            data-mode="embed">
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
                        bg="linear-gradient(90deg, #4F46E5 0%, #7C3AED 100%)"
                        p="4px"
                        borderRadius="xl"
                        boxShadow="lg"
                    >
                        <Flex
                            bg="#181c2b"
                            borderRadius="xl"
                            px="24px"
                            py="16px"
                            align="center"
                            justify="center"
                            w="full"
                            position="relative"
                            flexDirection="column"
                        >
                            <Text fontSize="4xl" fontWeight="extrabold" color="#9333ea" mb={2}>59,99€</Text>
                            <Text fontSize="lg" fontWeight="bold" color="white" letterSpacing="0.5px" mb={1}>PRO MONAT</Text>
                            <Text fontSize="sm" color="gray.300">Jederzeit kündbar</Text>
                            
                            {/* Flexibilität Label */}
                            <Box position="absolute" top="-12px" left="50%" transform="translateX(-50%)" bg="#9333ea" color="white" fontWeight={700} fontSize="xs" borderRadius={6} px={4} py={2} boxShadow="0 4px 12px #0002" zIndex={10}>
                                FLEXIBEL KÜNDBAR
                            </Box>
                        </Flex>
                    </Box>

                    
                    {/* What you get - Desktop Version nach oben verschoben */}
                    <Box bg="linear-gradient(180deg, #000000 0%,rgb(11, 29, 68) 100%)"
                         borderRadius="xl" boxShadow="md" p={6} display="flex" flexDirection="column" gap={2}>
                        <Text textAlign="left" fontSize="lg" color="white" fontWeight="bold" mb={2} letterSpacing="-0.5px">
                            Was du bekommst:
                        </Text>
                        <Box as="ul" display="flex" flexDirection="column" gap={2} mb={2} pl={0}>
                            <Flex as="li" align="center" gap={2}>
                                <Box as="span" display="flex" alignItems="center" justifyContent="center">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="10" cy="10" r="10" fill="#9333ea"/>
                                        <path d="M6 10.5L9 13.5L14 8.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </Box>
                                <Text color="lightgrey" as="span">
                                    <Text as="span" fontWeight="semibold" color="lightgrey">Kompletter Videokurs</Text> rund um unsere Strategie
                                </Text>
                            </Flex>
                            <Flex as="li" align="center" gap={2}>
                                <Box as="span" display="flex" alignItems="center" justifyContent="center">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="10" cy="10" r="10" fill="#9333ea"/>
                                        <path d="M6 10.5L9 13.5L14 8.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </Box>
                                <Text color="lightgrey" as="span">
                                    <Text as="span" fontWeight="semibold" color="lightgrey">Live Mentoring calls</Text> wo wir live traden
                                </Text>
                            </Flex>
                            <Flex as="li" align="center" gap={2}>
                                <Box as="span" display="flex" alignItems="center" justifyContent="center">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="10" cy="10" r="10" fill="#9333ea"/>
                                        <path d="M6 10.5L9 13.5L14 8.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </Box>
                                <Text color="lightgrey" as="span">Zugang zur <Text as="span" fontWeight="semibold" color="lightgrey">exklusiven Community</Text></Text>
                            </Flex>
                            <Flex as="li" align="center" gap={2}>
                                <Box as="span" display="flex" alignItems="center" justifyContent="center">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="10" cy="10" r="10" fill="#9333ea"/>
                                        <path d="M6 10.5L9 13.5L14 8.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </Box>
                                <Text color="lightgrey" as="span">Zugang zu unseren <Text as="span" fontWeight="semibold" color="lightgrey">Tradingsoftwares und Tools</Text></Text>
                            </Flex>
                            <Flex as="li" align="center" gap={2}>
                                <Box as="span" display="flex" alignItems="center" justifyContent="center">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="10" cy="10" r="10" fill="#9333ea"/>
                                        <path d="M6 10.5L9 13.5L14 8.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </Box>
                                <Text color="lightgrey" as="span">
                                    <Text as="span" fontWeight="semibold" color="lightgrey">Jederzeit kündbar</Text> - Keine Vertragsbindung
                                </Text>
                            </Flex>
                        </Box>
                    </Box>
                </Box>
            </Flex>
        </Box>
    );
} 
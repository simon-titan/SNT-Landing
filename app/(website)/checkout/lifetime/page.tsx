"use client";

import React, { useEffect } from "react";
import { Flex, Heading, Box, Text } from "@chakra-ui/react";
import "../../../../styles/paypal.css";

declare global {
    interface Window {
        paypal?: any;
    }
}

export default function LifetimeCheckoutPage() {
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

        // Force Outseta Light Mode und Green Theme
        const forceOutsetaLightMode = () => {
            const outsetaWidget = document.querySelector('[data-o-auth="1"]');
            if (outsetaWidget) {
                // Setze data-theme Attribute für Light Mode und Green Primary
                outsetaWidget.setAttribute('data-theme', 'light');
                outsetaWidget.setAttribute('data-color-mode', 'light');
                outsetaWidget.setAttribute('data-primary-color', '#22c55e');
                outsetaWidget.setAttribute('data-color-palette', 'green');
                
                // Finde alle Input-Felder und style sie spezifisch
                const inputs = outsetaWidget.querySelectorAll('input, select, textarea');
                inputs.forEach(input => {
                    const inputElement = input as HTMLElement;
                    inputElement.style.background = 'white';
                    inputElement.style.color = 'black';
                    inputElement.style.border = '1px solid #d1d5db';
                    inputElement.style.borderRadius = '6px';
                    inputElement.style.padding = '8px 12px';
                    inputElement.style.fontSize = '14px';
                    inputElement.style.transform = 'none';
                    inputElement.style.scale = '1';
                    inputElement.style.boxShadow = 'none';
                    inputElement.style.outline = 'none';
                    
                    // Focus Event Listener für grüne Borders
                    inputElement.addEventListener('focus', () => {
                        inputElement.style.borderColor = '#22c55e';
                        inputElement.style.boxShadow = '0 0 0 2px rgba(34, 197, 94, 0.2)';
                        inputElement.style.transform = 'none';
                        inputElement.style.scale = '1';
                    });
                    
                    inputElement.addEventListener('blur', () => {
                        inputElement.style.borderColor = '#d1d5db';
                        inputElement.style.boxShadow = 'none';
                    });
                });

                // Style Primary Buttons (Submit, Register, etc.)
                const buttons = outsetaWidget.querySelectorAll('button');
                buttons.forEach(button => {
                    const buttonText = button.textContent?.toLowerCase() || '';
                    if (!button.classList.contains('close') && 
                        !buttonText.includes('×') && 
                        !buttonText.includes('cancel') &&
                        !buttonText.includes('back')) {
                        (button as HTMLElement).style.background = '#22c55e';
                        (button as HTMLElement).style.color = 'white';
                        (button as HTMLElement).style.border = 'none';
                        (button as HTMLElement).style.borderRadius = '8px';
                        (button as HTMLElement).style.fontWeight = 'bold';
                        // Hover-Effekt
                        button.addEventListener('mouseenter', () => {
                            (button as HTMLElement).style.background = '#16a34a';
                        });
                        button.addEventListener('mouseleave', () => {
                            (button as HTMLElement).style.background = '#22c55e';
                        });
                    }
                });

                // Style Links und Akzente
                const links = outsetaWidget.querySelectorAll('a');
                links.forEach(link => {
                    (link as HTMLElement).style.color = '#22c55e';
                });

                // Style Checkboxes und Radio Buttons
                const checkboxes = outsetaWidget.querySelectorAll('input[type="checkbox"], input[type="radio"]');
                checkboxes.forEach(checkbox => {
                    (checkbox as HTMLElement).style.accentColor = '#22c55e';
                });

                // Fix für spezifische Payment Method Klasse
                const paymentMethodDiv = document.querySelector('.o--Register--paymentMethod');
                if (paymentMethodDiv) {
                    const paymentElement = paymentMethodDiv as HTMLElement;
                    paymentElement.style.transform = 'none';
                    paymentElement.style.scale = '1';
                    paymentElement.style.width = '100%';
                    paymentElement.style.maxWidth = 'none';
                    paymentElement.style.fontSize = '14px';
                    
                    // Alle Child-Elemente auch fixen
                    const childElements = paymentMethodDiv.querySelectorAll('*');
                    childElements.forEach(child => {
                        const childElement = child as HTMLElement;
                        childElement.style.transform = 'none';
                        childElement.style.scale = '1';
                        childElement.style.fontSize = '14px';
                    });
                }
            }
        };

        // Überwache DOM für Outseta Widget
        const observer = new MutationObserver(() => {
            forceOutsetaLightMode();
        });

        const targetNode = document.body;
        observer.observe(targetNode, {
            childList: true,
            subtree: true
        });

        // Initial check
        setTimeout(forceOutsetaLightMode, 2000);

        // PayPal Hosted Button Script dynamisch einfügen
        const scriptId = "paypal-sdk-hosted-buttons";
        if (!document.getElementById(scriptId)) {
            const script = document.createElement("script");
            script.src = "https://www.paypal.com/sdk/js?client-id=BAA-0m5pkSxHufms7Bz99yWR1lzshrXB63L2g-cvYFfUsI1-ul1VcqCAsVudEICk3cLUAXx2VAsCFuuTHY&components=hosted-buttons&disable-funding=venmo&currency=EUR";
            script.crossOrigin = "anonymous";
            script.async = true;
            script.id = scriptId;
            script.onload = () => {
                if (window.paypal && window.paypal.HostedButtons) {
                    window.paypal.HostedButtons({
                        hostedButtonId: "BDZ3WHCYCPK9C"
                    }).render("#paypal-container-BDZ3WHCYCPK9C");
                }
            };
            document.body.appendChild(script);
        } else {
            // Falls Script schon geladen, direkt rendern
            if (window.paypal && window.paypal.HostedButtons) {
                window.paypal.HostedButtons({
                    hostedButtonId: "BDZ3WHCYCPK9C"
                }).render("#paypal-container-BDZ3WHCYCPK9C");
            }
        
        }
    }, []);

    return (
        <>
            <style>{`
                /* Force Light Mode für Outseta Widget */
                [data-o-auth="1"] {
                    color-scheme: light !important;
                }
                [data-o-auth="1"] * {
                    color-scheme: light !important;
                }
                /* Outseta spezifische Light Mode Styles */
                .outseta-auth-widget {
                    background: white !important;
                    color: black !important;
                }
                .outseta-auth-widget input {
                    background: white !important;
                    color: black !important;
                    border: 1px solid #e5e7eb !important;
                }
                .outseta-auth-widget button {
                    background: #22c55e !important;
                    color: white !important;
                }
                .outseta-auth-widget .form-control {
                    background: white !important;
                    color: black !important;
                }
                /* Zusätzliche Outseta Selektoren */
                .o-auth-container {
                    background: white !important;
                    color: black !important;
                }
                .o-auth-container input, 
                .o-auth-container select, 
                .o-auth-container textarea {
                    background: white !important;
                    color: black !important;
                    border: 1px solid #d1d5db !important;
                }
                /* Spezifische Outseta Button Styles */
                [data-o-auth="1"] button[type="submit"],
                [data-o-auth="1"] .btn-primary,
                [data-o-auth="1"] .primary-button {
                    background: #22c55e !important;
                    border-color: #22c55e !important;
                    color: white !important;
                }
                [data-o-auth="1"] button[type="submit"]:hover,
                [data-o-auth="1"] .btn-primary:hover,
                [data-o-auth="1"] .primary-button:hover {
                    background: #16a34a !important;
                    border-color: #16a34a !important;
                }
                /* Outseta Links */
                [data-o-auth="1"] a {
                    color: #22c55e !important;
                }
                /* Outseta Focus States */
                [data-o-auth="1"] input:focus,
                [data-o-auth="1"] select:focus,
                [data-o-auth="1"] textarea:focus {
                    border-color: #22c55e !important;
                    box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.2) !important;
                    transform: none !important;
                    scale: 1 !important;
                }
                /* Fix für Zahlungsmethoden Input-Felder */
                [data-o-auth="1"] .payment-method-input,
                [data-o-auth="1"] input[type="text"],
                [data-o-auth="1"] input[type="email"],
                [data-o-auth="1"] input[type="password"],
                [data-o-auth="1"] input[name*="card"],
                [data-o-auth="1"] input[name*="payment"] {
                    background: white !important;
                    color: black !important;
                    border: 1px solid #d1d5db !important;
                    border-radius: 6px !important;
                    padding: 8px 12px !important;
                    font-size: 14px !important;
                    transform: none !important;
                    scale: 1 !important;
                    box-shadow: none !important;
                }
                [data-o-auth="1"] .payment-method-input:focus,
                [data-o-auth="1"] input[type="text"]:focus,
                [data-o-auth="1"] input[type="email"]:focus,
                [data-o-auth="1"] input[type="password"]:focus,
                [data-o-auth="1"] input[name*="card"]:focus,
                [data-o-auth="1"] input[name*="payment"]:focus {
                    border-color: #22c55e !important;
                    box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.2) !important;
                    transform: none !important;
                    scale: 1 !important;
                }
                /* Override für alle möglichen blauen Borders */
                [data-o-auth="1"] *:focus {
                    outline: none !important;
                    border-color: #22c55e !important;
                    box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.2) !important;
                }
                /* Entferne blaue Standard-Browser-Outlines */
                [data-o-auth="1"] input,
                [data-o-auth="1"] select,
                [data-o-auth="1"] textarea,
                [data-o-auth="1"] button {
                    outline: none !important;
                }
                /* Fix für spezifische Outseta Payment Method Klasse */
                .o--Register--paymentMethod {
                    transform: none !important;
                    scale: 1 !important;
                    width: 100% !important;
                    max-width: none !important;
                    font-size: 14px !important;
                    padding: 0 !important;
                    margin: 0 !important;
                }
                .o--Register--paymentMethod * {
                    transform: none !important;
                    scale: 1 !important;
                    font-size: 14px !important;
                }
                .o--Register--paymentMethod input {
                    background: white !important;
                    color: black !important;
                    border: 1px solid #d1d5db !important;
                    border-radius: 6px !important;
                    padding: 8px 12px !important;
                    font-size: 14px !important;
                    width: 100% !important;
                    max-width: 100% !important;
                    transform: none !important;
                    scale: 1 !important;
                    box-shadow: none !important;
                }
                .o--Register--paymentMethod input:focus {
                    border-color: #22c55e !important;
                    box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.2) !important;
                    transform: none !important;
                    scale: 1 !important;
                }
            `}</style>
            <Box 
                minH="100vh" 
                bg="white" 
                display="flex" 
                flexDirection="column" 
                pb="32"
                className="light"
                data-theme="light"
            >
            {/* Header */}
            <Box 
                as="header" 
                w="full"
                py={6} 
                display="flex" 
                justifyContent="center" 
                alignItems="center"
                bg="linear-gradient(135deg, rgba(10, 14, 10, 0.95), rgba(0, 0, 0, 0.98))"
                borderBottom="1px solid rgba(34, 197, 94, 0.25)"
                boxShadow="0 4px 20px rgba(34, 197, 94, 0.1)"
                position="relative"
                _before={{
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "radial-gradient(at 50% 0%, rgba(34, 197, 94, 0.1) 0px, transparent 50%)",
                    pointerEvents: "none"
                }}
            >
                <Box position="relative" zIndex={1}>
                    <Heading
                        as="h1"
                        fontSize={{ base: "xl", md: "3xl" }}
                        fontWeight="bold"
                        color="#22c55e"
                        textShadow="0 0 20px rgba(34, 197, 94, 0.6)"
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
                        🔥 Lifetime-Angebot • 200€ gespart • Lebenslanger Zugang
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
                    bg="linear-gradient(90deg, #10B981 0%, #34D399 100%)"
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
                        <Text fontSize="4xl" fontWeight="extrabold" color="#22c55e" mb={2}>247€</Text>
                        <Text fontSize="lg" fontWeight="bold" color="white" letterSpacing="0.5px" mb={1}>EINMALIG</Text>
                        <Text fontSize="sm" color="gray.300">Lebenslanger Zugang</Text>
                        
                        {/* Lifetime Label */}
                        <Box position="absolute" top="-12px" left="50%" transform="translateX(-50%)" bg="#22c55e" color="white" fontWeight={700} fontSize="xs" borderRadius={6} px={4} py={2} boxShadow="0 4px 12px rgba(34, 197, 94, 0.3)" zIndex={10}>
                            🔥 SONDERANGEBOT
                        </Box>
                    </Flex>
                </Box>
            </Box>

            <Flex direction={{ base: 'column', md: 'row' }} maxW="6xl" mx="auto" w="full" gap={8} mt={{ base: 0, md: 32 }} px={4}>
                {/* Linke Seite: Checkout-Widget */}
                <section style={{ flex: 1, maxWidth: 520, minWidth: 0 }} className="bg-white rounded-xl shadow-lg p-8 flex flex-col justify-center mx-auto">
                    
                    {/* PayPal Express Registrierung */}
                    <div id="paypal-express-section" style={{ marginBottom: "2rem" }}>
                        {/* Neuer PayPal Hosted Button */}
                        <div id="lifetime-paypal-section" style={{ textAlign: "center" }}>
                            <div style={{
                                background: "linear-gradient(135deg, #0070ba 0%, #005ea6 100%)",
                                borderRadius: "12px",
                                padding: "16px",
                                marginBottom: "16px",
                                color: "white",
                                fontWeight: "bold",
                                fontSize: "16px",
                                textAlign: "center",
                                boxShadow: "0 4px 12px rgba(0, 112, 186, 0.3)"
                            }}>
                                🚀 PAYPAL-EXPRESS-REGISTRIERUNG
                            </div>
                            {/* PayPal Hosted Button Container */}
                            <div id="paypal-container-BDZ3WHCYCPK9C"></div>
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
                        
                        {/* Lifetime Outseta Embed */}
                        <div data-o-auth="1"
                            data-widget-mode="register"
                            data-plan-uid="496LXdmX"
                            data-plan-payment-term="oneTime"
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
                        bg="linear-gradient(90deg, #10B981 0%, #34D399 100%)"
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
                            <Text fontSize="4xl" fontWeight="extrabold" color="#10B981" mb={2}>367€</Text>
                            <Text fontSize="lg" fontWeight="bold" color="white" letterSpacing="0.5px" mb={1}>EINMALIG</Text>
                            <Text fontSize="sm" color="gray.300">Lebenslanger Zugang</Text>
                            
                            {/* Lifetime Label */}
                            <Box position="absolute" top="-12px" left="50%" transform="translateX(-50%)" bg="#10B981" color="white" fontWeight={700} fontSize="xs" borderRadius={6} px={4} py={2} boxShadow="0 4px 12px #0002" zIndex={10}>
                                LIFETIME ANGEBOT
                            </Box>
                        </Flex>
                    </Box>
                    
                    {/* What you get - Desktop Version */}
                    <Box bg="linear-gradient(180deg, #000000 0%,rgb(11, 29, 68) 100%)"
                         borderRadius="xl" boxShadow="md" p={6} display="flex" flexDirection="column" gap={2}>
                        <Text textAlign="left" fontSize="lg" color="white" fontWeight="bold" mb={2} letterSpacing="-0.5px">
                            Was du bekommst:
                        </Text>
                        <Box as="ul" display="flex" flexDirection="column" gap={2} mb={2} pl={0}>
                            <Flex as="li" align="center" gap={2}>
                                <Box as="span" display="flex" alignItems="center" justifyContent="center">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="10" cy="10" r="10" fill="#22c55e"/>
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
                                        <circle cx="10" cy="10" r="10" fill="#22c55e"/>
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
                                        <circle cx="10" cy="10" r="10" fill="#22c55e"/>
                                        <path d="M6 10.5L9 13.5L14 8.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </Box>
                                <Text color="lightgrey" as="span">Zugang zur <Text as="span" fontWeight="semibold" color="lightgrey">exklusiven Community</Text></Text>
                            </Flex>
                            <Flex as="li" align="center" gap={2}>
                                <Box as="span" display="flex" alignItems="center" justifyContent="center">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="10" cy="10" r="10" fill="#22c55e"/>
                                        <path d="M6 10.5L9 13.5L14 8.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </Box>
                                <Text color="lightgrey" as="span">Zugang zu unseren <Text as="span" fontWeight="semibold" color="lightgrey">Tradingsoftwares und Tools</Text></Text>
                            </Flex>
                            <Flex as="li" align="center" gap={2}>
                                <Box as="span" display="flex" alignItems="center" justifyContent="center">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="10" cy="10" r="10" fill="#22c55e"/>
                                        <path d="M6 10.5L9 13.5L14 8.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </Box>
                                <Text color="lightgrey" as="span">
                                    <Text as="span" fontWeight="semibold" color="green.300">+ Lebenslange Updates</Text> - Alle zukünftigen Inhalte inklusive
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
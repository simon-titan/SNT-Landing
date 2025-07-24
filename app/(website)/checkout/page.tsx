"use client";
import React, { useEffect } from "react";
import { Flex, Heading, Box, Text, Stack } from "@chakra-ui/react";

export default function CheckoutPage() {
    useEffect(() => {
        // Einfache kontinuierliche Überwachung des Plans
        const monitorPlanSelection = () => {
            const checkPlan = () => {
                const lifetimeButton = document.getElementById('lifetime-paypal-section');
                const monthlyButton = document.getElementById('monthly-paypal-section');
                
                if (!lifetimeButton || !monthlyButton) return;

                // Suche nach dem Outseta Widget
                const outsetaWidget = document.querySelector('[data-o-auth="1"]');
                if (!outsetaWidget) return;
                
                // 1. Prüfe ob der User im Registrierungs-Zustand ist (Plan bereits ausgewählt)
                const isInRegisterState = outsetaWidget.querySelector('.state-Register');
                
                const cardPaymentHeader = document.getElementById('card-payment-header');

                if (!isInRegisterState) {
                    // Kein Plan ausgewählt - verstecke PayPal-Bereiche und Karten-Header
                    lifetimeButton.style.display = 'none';
                    monthlyButton.style.display = 'none';
                    const separator = document.getElementById('payment-separator');
                    if (separator) separator.style.display = 'none';
                    if (cardPaymentHeader) cardPaymentHeader.style.display = 'none';
                    console.log('⚪ Kein Plan ausgewählt - zeige nur Outseta Embed für Planauswahl');
                    return;
                }
                
                // 2. Plan ist ausgewählt - prüfe welcher Plan aktiv ist
                const lifetimeElement = outsetaWidget.querySelector('.plan--496LXdmX');
                const monthlyElement = outsetaWidget.querySelector('.plan--7ma651QE');
                
                // Debug-Logging
                console.log('🔍 Plan-Detection:', {
                    isInRegisterState: !!isInRegisterState,
                    lifetimeElement: !!lifetimeElement,
                    monthlyElement: !!monthlyElement,
                    registerStateClass: isInRegisterState?.className
                });

                const separator = document.getElementById('payment-separator');

                if (lifetimeElement) {
                    // Lifetime Plan ausgewählt
                    lifetimeButton.style.display = 'block';
                    monthlyButton.style.display = 'none';
                    if (separator) separator.style.display = 'block';
                    if (cardPaymentHeader) cardPaymentHeader.style.display = 'block';
                    console.log('✅ Lifetime Plan ausgewählt - zeige Lifetime Button');
                } else if (monthlyElement) {
                    // Monatlicher Plan ausgewählt
                    lifetimeButton.style.display = 'none';
                    monthlyButton.style.display = 'block';
                    if (separator) separator.style.display = 'block';
                    if (cardPaymentHeader) cardPaymentHeader.style.display = 'block';
                    console.log('✅ Monatlicher Plan ausgewählt - zeige Monthly Button');
                } else {
                    // Kein spezifischer Plan erkannt - verstecke alle Bereiche
                    lifetimeButton.style.display = 'none';
                    monthlyButton.style.display = 'none';
                    if (separator) separator.style.display = 'none';
                    if (cardPaymentHeader) cardPaymentHeader.style.display = 'none';
                    console.log('⚠️ Plan im Register-Zustand aber keine spezifische Plan-ID erkannt');
                }
            };

            // Kontinuierliche Überprüfung alle 300ms für bessere Responsivität
            const intervalId = setInterval(checkPlan, 300);
            
            // Mehrere schnelle Initial checks
            setTimeout(checkPlan, 50);
            setTimeout(checkPlan, 200);
            setTimeout(checkPlan, 500);
            setTimeout(checkPlan, 1000);
            
            // Cleanup nach 30 Sekunden (optional)
            setTimeout(() => {
                clearInterval(intervalId);
                console.log('Plan monitoring gestoppt nach 30 Sekunden');
                // Restart monitoring für kontinuierliche Überwachung
                setTimeout(monitorPlanSelection, 1000);
            }, 30000);
        };

        // Plan-Monitoring starten
        monitorPlanSelection();

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

        // PayPal SDK dynamisch laden falls nicht vorhanden
        if (!(window as any).paypal && !document.getElementById('paypal-sdk-abo')) {
            const script = document.createElement('script');
            script.id = 'paypal-sdk-abo';
            script.src = 'https://www.paypal.com/sdk/js?client-id=ASzGd21OHNK5yaZUKtlBrKw4F2oN04ZcUxyUmzAy_VeOjMWYCV7vEy1D0p_biwg5VcBVh_NvfOTEZnmF&vault=true&intent=subscription';
            script.setAttribute('data-sdk-integration-source', 'button-factory');
            script.onload = () => {
                // PayPal Abo Button rendern
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
            document.head.appendChild(script);
        } else if ((window as any).paypal) {
            // Falls SDK bereits geladen, Button direkt rendern
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
                    SNTTRADES™
                </Heading>
            </Box>
            <Flex direction={{ base: 'column', lg: 'row' }} maxW="6xl" mx="auto" w="full" gap={8} mt={32} px={4}>
                {/* Linke Seite: Checkout-Widget */}
                <section style={{ flex: 1, maxWidth: 520, minWidth: 0 }} className="bg-white rounded-xl shadow-lg p-8 flex flex-col justify-center mx-auto">
                    
                    {/* PayPal Express Registrierung */}
                    <div id="paypal-express-section" style={{ marginBottom: "2rem" }}>
                        {/* PayPal Lifetime Button */}
                        <div id="lifetime-paypal-section" style={{ textAlign: "center", display: "none" }}>
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
                            <form
                              action="https://www.paypal.com/ncp/payment/NULRVQG5GN8PE"
                              method="post"
                              target="_blank"
                              style={{
                                display: "inline-grid",
                                justifyItems: "center",
                                alignContent: "start",
                                gap: "0.5rem",
                                width: "100%"
                              }}
                            >
                              {/* Hidden field für bessere Webhook-Identifizierung */}
                              <input type="hidden" name="custom" value="SNTTRADES_LIFETIME_PLAN" />
                              <input type="hidden" name="item_name" value="SNTTRADES Mentorship - Lifetime Access" />
                              <input type="hidden" name="item_number" value="NULRVQG5GN8PE" />
                              
                              <input
                                className="pp-NULRVQG5GN8PE"
                                type="submit"
                                value="Jetzt mit PayPal registrieren"
                                style={{
                                  textAlign: "center",
                                  border: "none",
                                  borderRadius: "6px",
                                  width: "100%",
                                  maxWidth: "400px",
                                  padding: "16px 24px",
                                  height: "56px",
                                  fontWeight: "bold",
                                  backgroundColor: "#FFD140",
                                  color: "#000000",
                                  fontFamily: '"Helvetica Neue",Arial,sans-serif',
                                  fontSize: "16px",
                                  lineHeight: "1.25rem",
                                  cursor: "pointer",
                                  transition: "all 0.3s ease",
                                  boxShadow: "0 4px 12px rgba(255, 209, 64, 0.3)"
                                }}
                              />
                              <section style={{ fontSize: "12px", color: "#666", marginTop: "8px", textAlign: "center" }}>
                                <img
                                  src="https://www.paypalobjects.com/paypal-ui/logos/svg/paypal-wordmark-color.svg"
                                  alt="paypal"
                                  style={{ height: "14px", verticalAlign: "middle", marginRight: "4px" }}
                                />
                                Express-Checkout • Sicher & Schnell
                              </section>
                            </form>
                        </div>

                        {/* PayPal Abo Button (Monatlich) */}
                        <div id="monthly-paypal-section" style={{ textAlign: "center", display: "none" }}>
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
                            <div id="paypal-button-container-P-59C23375XF491315BNCBCDVQ" style={{ width: "100%", maxWidth: "400px", margin: "0 auto" }}></div>
                            <section style={{ fontSize: "12px", color: "#666", marginTop: "8px", textAlign: "center" }}>
                              <img
                                src="https://www.paypalobjects.com/paypal-ui/logos/svg/paypal-wordmark-color.svg"
                                alt="paypal"
                                style={{ height: "14px", verticalAlign: "middle", marginRight: "4px" }}
                              />
                              Express-Checkout • Sicher & Schnell
                            </section>
                        </div>

                        {/* Trennlinie */}
                        <div id="payment-separator" style={{ 
                            display: "none",
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
                        <div id="card-payment-header" style={{
                            background: "linear-gradient(135deg, #1f2937 0%, #374151 100%)",
                            borderRadius: "12px",
                            padding: "16px",
                            marginBottom: "16px",
                            color: "white",
                            textAlign: "center",
                            boxShadow: "0 4px 12px rgba(31, 41, 55, 0.3)",
                            display: "none"
                        }}>
                            <div style={{ fontWeight: "bold", fontSize: "16px", marginBottom: "8px" }}>
                                💳 REGISTRIERUNG MIT KARTE
                            </div>
                            <div style={{ fontSize: "14px", opacity: 0.9 }}>
                                Kreditkarte • Debitkarte • Google Pay • Apple Pay
                            </div>
                        </div>
                        
                        {/* Outseta Embed (echter Checkout) - IMMER SICHTBAR */}
                        <div data-o-auth="1"
                            data-widget-mode="register"
                            data-plan-family-uid="A935qMm0"
                            data-plan-payment-term="oneTime"
                            data-skip-plan-options="true"
                            data-mode="embed">
                        </div>
                    </div>
                </section>
                {/* Rechte Seite: Produktinfos, Vorteile, Trustpilot, Social Proof, Testimonials */}
                <Box w={420} flexShrink={0} display="flex" flexDirection="column" gap={6}>
                    {/* Produktbox nach Screenshot */}
                    <Box
                    bg="linear-gradient(90deg, #000000 0%,rgb(11, 29, 68) 100%)"
                        borderRadius="12px"
                        boxShadow="0 8px 32px 0 rgba(0,0,0,0.25)"
                        p="32px 24px"
                        color="white"
                        mb="16px"
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        position="relative"
                    >
                        {/* Produktbild oben, leicht überstehend */}
                        <Box position="absolute" top="-48px" left="50%" transform="translateX(-50%)" zIndex={2}>
                            <img src="/assets/PB-1.png" alt="Produktbox" style={{ height: 120, borderRadius: 12,  background: 'none' }} />
                        </Box>
                        <Box h="42px" /> {/* Platzhalter für Abstand nach oben, damit Bild nicht überlappt */}
                        {/* STERNE */}
                        <Flex w="full" align="center" justify="center" gap={1} mb={2}>
                            {/* 4 volle Sterne */}
                            <svg width="16" height="16" viewBox="0 0 20 20" fill="#3b82f6" xmlns="http://www.w3.org/2000/svg"><path d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z"/></svg>
                            <svg width="16" height="16" viewBox="0 0 20 20" fill="#3b82f6" xmlns="http://www.w3.org/2000/svg"><path d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z"/></svg>
                            <svg width="16" height="16" viewBox="0 0 20 20" fill="#3b82f6" xmlns="http://www.w3.org/2000/svg"><path d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z"/></svg>
                            <svg width="16" height="16" viewBox="0 0 20 20" fill="#3b82f6" xmlns="http://www.w3.org/2000/svg"><path d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z"/></svg>
                            {/* halber Stern */}
                            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="half-blue"><stop offset="50%" stopColor="#3b82f6"/><stop offset="50%" stopColor="#e5e7eb"/></linearGradient></defs><path d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z" fill="url(#half-blue)"/></svg>
                            <Text color="#3b82f6" fontWeight="bold" fontSize="md" ml={2}>4.8</Text>
                        </Flex>
                        <Heading
                            as="h2"
                            fontSize={{ base: "2xl", md: "3xl" }}
                            fontWeight="bold"
                            textAlign="center"
                            mb={2}
                            bg="linear-gradient(0deg,rgb(255,255,255) 0%,rgb(126,126,126) 100%)"
                            bgClip="text"
                            style={{ WebkitTextFillColor: 'transparent', textShadow: '0 2px 8px #0006' }}
                        >
                            SNTTRADES<br/>MENTORSHIP
                        </Heading>
                        {/* Preisbox */}
                        <Flex w="full" flexDir="column" align="center" mt={4}>
                            <Box
                                position="relative"
                                w="full"
                                maxW="md"
                                mb={2}
                                bg="linear-gradient(90deg,rgb(255, 0, 0) 0%, rgb(90,26,26) 10%, #222 50%, rgb(16,82,51) 90%,rgba(52, 165, 0, 0.69) 100%)"
                                p="4px"
                                borderRadius="2px"
                            >
                                <Flex
                                    bg="#181c2b"
                                    borderRadius="2px"
                                    minH="24px"
                                    px="16px"
                                    py="4px"
                                    align="center"
                                    justify="space-between"
                                    w="full"
                                    position="relative"
                                >
                                    {/* Linke Seite: Sonstiger Preis */}
                                    <Box display="flex" flexDirection="column" alignItems="flex-start" justifyContent="center" minW="100px">
                                        <Text fontSize="xs" fontWeight="bold" color="white" mb={0.5} letterSpacing="0.5px">SONSTIGER<br/>PREIS:</Text>
                                        <Text fontSize="lg" fontWeight="extrabold" color="#ff4d4f" textDecoration="line-through" mt={0.5}>567€</Text>
                                    </Box>
                                    {/* Mittig: Pfeil */}
                                    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" flex={1}>
                                        <Text fontSize="md" fontWeight="extrabold" color="white">→</Text>
                                    </Box>
                                    {/* Rechte Seite: Heutiger Preis */}
                                    <Box display="flex" flexDirection="column" alignItems="flex-end" justifyContent="center" minW="100px">
                                        <Text fontSize="xs" fontWeight="bold" color="white" mb={0.5} letterSpacing="0.5px">HEUTIGER PREIS:</Text>
                                        <Text fontSize="lg" fontWeight="extrabold" color="#4ade80" mt={0.5}>367€</Text>
                                    </Box>
                                {/* Gelbes Label */}
                                    <Box position="absolute" top="-12px" left="50%" transform="translateX(-50%)" bg="#ffe066" color="#222" fontWeight={700} fontSize="10px" borderRadius={6} px={3} py={1} boxShadow="0 2px 8px #0002" zIndex={10}>
                                        DAS ANGEBOT ENDET HEUTE!
                                    </Box>
                                </Flex>
                            </Box>
                        </Flex>
                    </Box>
                    {/* What you get */}
                    <Box                     bg="linear-gradient(180deg, #000000 0%,rgb(11, 29, 68) 100%)"
                         borderRadius="xl" boxShadow="md" p={6} display="flex" flexDirection="column" gap={2}>
                        <Text textAlign="left" fontSize="lg" color="white" fontWeight="bold" mb={2} letterSpacing="-0.5px">
                            Was du bekommst:
                        </Text>
                        <Box as="ul" display="flex" flexDirection="column" gap={2} mb={2} pl={0}>
                            <Flex as="li" align="center" gap={2}>
                                <Box as="span" display="flex" alignItems="center" justifyContent="center">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="10" cy="10" r="10" fill="#06b6d4"/>
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
                                        <circle cx="10" cy="10" r="10" fill="#06b6d4"/>
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
                                        <circle cx="10" cy="10" r="10" fill="#06b6d4"/>
                                        <path d="M6 10.5L9 13.5L14 8.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </Box>
                                <Text color="lightgrey" as="span">Zugang zur <Text as="span" fontWeight="semibold" color="lightgrey">exklusiven Community</Text></Text>
                            </Flex>
                            <Flex as="li" align="center" gap={2}>
                                <Box as="span" display="flex" alignItems="center" justifyContent="center">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="10" cy="10" r="10" fill="#06b6d4"/>
                                        <path d="M6 10.5L9 13.5L14 8.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </Box>
                                <Text color="lightgrey" as="span">Zugang zu unseren <Text as="span" fontWeight="semibold" color="lightgrey">Tradingsoftwares und Tools</Text></Text>
                            </Flex>
                        </Box>
                    </Box>
                    {/* Success Results */}
                    <Box display="flex" flexDirection="column" gap={4} mt={2}>
                        <Box bg="linear-gradient(180deg, #000000 0%,rgb(11, 29, 68) 100%)" borderRadius="lg" p={4} boxShadow="md" display="flex" flexDirection="column" gap={2}>
                            <Text fontWeight="bold" color="white" fontSize="sm" mb={2}>
                                <Text as="span" color="#3b82f6">500$</Text> Profit am frühen morgen
                            </Text>
                            <Box w="full" borderRadius={8} overflow="hidden">
                                <img 
                                    src="/RESULTS/500$ Profit am frühen morgen.png" 
                                    alt="500$ Profit am frühen Morgen" 
                                    style={{ width: '100%', height: 'auto', display: 'block' }}
                                />
                            </Box>
                        </Box>
                        <Box bg="linear-gradient(180deg, #000000 0%,rgb(11, 29, 68) 100%)" borderRadius="lg" p={4} boxShadow="md" display="flex" flexDirection="column" gap={2}>
                            <Text fontWeight="bold" color="white" fontSize="sm" mb={2}>
                                <Text as="span" color="#3b82f6">Dominik</Text> macht in einem Monat <Text as="span" color="#3b82f6">3,471.26$</Text> Profit
                            </Text>
                            <Box w="full" borderRadius={8} overflow="hidden">
                                <img 
                                    src="/RESULTS/Dominik macht in einem Monat 3,471.26$ Profit.png" 
                                    alt="Dominik macht 3,471.26$ Profit in einem Monat" 
                                    style={{ width: '100%', height: 'auto', display: 'block' }}
                                />
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Flex>
        </Box>
    );
} 
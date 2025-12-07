"use client";
import React, { useEffect, useState } from "react";
import { Flex, Heading, Box, Text, HStack } from "@chakra-ui/react";
import { CreditCard, GoogleLogo, AppleLogo, CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { pricingConfig, isDiscountActive } from "@/config/pricing-config";
const SNT_BLUE = "#068CEF";
export default function MonthlyCheckoutPage() {
    const [isClient, setIsClient] = useState(false);
    const discountActive = isDiscountActive();
    const pricing = discountActive ? pricingConfig.discount.monthly : pricingConfig.standard.monthly;
    useEffect(() => {
        setIsClient(true);
    }, []);
    // Preis formatieren
    const formatPrice = (price) => {
        return price % 1 === 0 ? `${price}€` : `${price.toFixed(2).replace('.', ',')}€`;
    };
    useEffect(() => {
        // Telegram User ID speichern
        const urlParams = new URLSearchParams(window.location.search);
        const telegramUserId = urlParams.get('telegram_user_id');
        if (telegramUserId) {
            localStorage.setItem('telegram_user_id', telegramUserId);
            sessionStorage.setItem('telegram_user_id', telegramUserId);
            console.log('Telegram User ID gespeichert:', telegramUserId);
        }
        // Outseta Success Handler
        const setupOutsetaSuccessHandler = () => {
            window.addEventListener('message', (event) => {
                if (event.data && event.data.type === 'outseta_success') {
                    console.log('✅ Outseta Registrierung erfolgreich:', event.data);
                    const telegramUserId = localStorage.getItem('telegram_user_id') || sessionStorage.getItem('telegram_user_id');
                    let redirectUrl = '/thank-you-3?source=outseta&transaction_id=' + (event.data.transactionId || 'unknown');
                    if (telegramUserId) {
                        redirectUrl += `&telegram_user_id=${telegramUserId}`;
                    }
                    window.location.href = redirectUrl;
                }
            });
            const checkOutsetaSuccess = () => {
                const currentUrl = window.location.href;
                if (currentUrl.includes('success') || currentUrl.includes('completed')) {
                    console.log('✅ Outseta Success URL erkannt');
                    const telegramUserId = localStorage.getItem('telegram_user_id') || sessionStorage.getItem('telegram_user_id');
                    let redirectUrl = '/thank-you-3?source=outseta_url';
                    if (telegramUserId) {
                        redirectUrl += `&telegram_user_id=${telegramUserId}`;
                    }
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
                            const telegramUserId = localStorage.getItem('telegram_user_id') || sessionStorage.getItem('telegram_user_id');
                            let redirectUrl = '/thank-you-3?source=outseta_text';
                            if (telegramUserId) {
                                redirectUrl += `&telegram_user_id=${telegramUserId}`;
                            }
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
        // PayPal Button Rendering Funktion
        const renderPayPalButton = () => {
            const containerId = pricing.paypal.containerId;
            const container = document.getElementById(containerId);
            if (!container)
                return;
            container.innerHTML = '';
            if (window.paypal) {
                window.paypal.Buttons({
                    style: {
                        shape: 'rect',
                        color: 'gold',
                        layout: 'vertical',
                        label: 'paypal',
                        height: 48,
                        tagline: false
                    },
                    createSubscription: function (data, actions) {
                        const telegramUserId = localStorage.getItem('telegram_user_id');
                        const customId = telegramUserId ? `TG_USER_${telegramUserId}|SNTTRADES_MONTHLY_PLAN` : 'SNTTRADES_MONTHLY_PLAN';
                        return actions.subscription.create({
                            plan_id: pricing.paypal.planId,
                            custom_id: customId,
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
                    onApprove: function (data) {
                        console.log('PayPal Subscription genehmigt:', data.subscriptionID);
                        const telegramUserId = localStorage.getItem('telegram_user_id') || sessionStorage.getItem('telegram_user_id');
                        let redirectUrl = '/thank-you-3?subscription_id=' + data.subscriptionID;
                        if (telegramUserId) {
                            redirectUrl += `&telegram_user_id=${telegramUserId}`;
                            console.log('Redirecting with Telegram ID:', telegramUserId);
                        }
                        window.location.href = redirectUrl;
                    },
                    onError: function (err) {
                        console.error('PayPal Subscription Fehler:', err);
                        alert('Es gab einen Fehler beim Erstellen des Abonnements. Bitte versuchen Sie es erneut.');
                    }
                }).render(`#${containerId}`);
            }
        };
        // PayPal SDK dynamisch laden falls nicht vorhanden
        if (!window.paypal && !document.getElementById('paypal-sdk-abo')) {
            const script = document.createElement('script');
            script.id = 'paypal-sdk-abo';
            script.src = 'https://www.paypal.com/sdk/js?client-id=ASzGd21OHNK5yaZUKtlBrKw4F2oN04ZcUxyUmzAy_VeOjMWYCV7vEy1D0p_biwg5VcBVh_NvfOTEZnmF&vault=true&intent=subscription';
            script.setAttribute('data-sdk-integration-source', 'button-factory');
            script.onload = () => {
                renderPayPalButton();
            };
            document.head.appendChild(script);
        }
        else {
            setTimeout(renderPayPalButton, 100);
        }
        setTimeout(setupOutsetaSuccessHandler, 1000);
    }, [pricing]);
    return (<>
            <style jsx global>{`
                .item-header {
                    display: none !important;
                }
            `}</style>
            <Box minH="100vh" bg="white" display="flex" flexDirection="column">
            {/* Header */}
            <Box as="header" w="full" py={6} display="flex" flexDirection="column" justifyContent="center" alignItems="center" bg="black" borderBottom="1px solid" borderColor="gray.800" gap={3}>
                <Box position="relative" zIndex={1} textAlign="center">
                    <HStack gap={2} justify="center" mb={2}>
                        <CheckCircle size={20} color={SNT_BLUE} weight="fill"/>
                        <Heading as="h1" fontSize={{ base: "xl", md: "3xl" }} fontWeight="bold" color="white" textAlign="center">
                            SNTTRADES™ 
                        </Heading>
                    </HStack>
                    <Text textAlign="center" color="gray.300" fontSize="sm" fontWeight="medium">
                        Monatlicher Zugang • Jederzeit kündbar
                    </Text>
                </Box>
            </Box>
            
            {/* Mobile: Preisbox ÜBER dem Checkout */}
            <Box display={{ base: "block", md: "none" }} maxW="6xl" mx="auto" w="full" px={4} mt={8} mb={6}>
                {/* Preisbox - Mobile */}
                <Box position="relative" w="full" maxW="md" mx="auto" bg="white" borderRadius="xl" boxShadow="lg" border="2px solid" borderColor={SNT_BLUE} p={{ base: 4, md: 6 }}>
                    <Flex align="center" justify="center" w="full" flexDirection="column" gap={1}>
                        <Text fontSize={{ base: "3xl", sm: "4xl" }} fontWeight="extrabold" color={SNT_BLUE} lineHeight="1">{formatPrice(pricing.price)}</Text>
                        <Text fontSize={{ base: "sm", sm: "md" }} fontWeight="bold" color="gray.800" letterSpacing="0.5px" mt={-1}>{pricing.label}</Text>
                        <Text fontSize="xs" color="gray.600">Jederzeit kündbar</Text>
                    </Flex>
                </Box>
            </Box>

            <Flex direction={{ base: 'column', md: 'row' }} maxW="6xl" mx="auto" w="full" gap={8} mt={{ base: 0, md: 32 }} px={4}>
                {/* Linke Seite: Checkout-Widget */}
                <section style={{ flex: 1, maxWidth: 520, minWidth: 0 }} className="bg-white rounded-xl shadow-lg p-8 flex flex-col justify-center mx-auto border-2 border-gray-200">
                    
                    {/* PayPal Express Registrierung */}
                    <div id="paypal-express-section" style={{ marginBottom: "2rem" }}>
                        {/* PayPal Abo Button (Monatlich) */}
                        <div id="monthly-paypal-section" style={{ textAlign: "center" }}>
                            {isClient && (<div id={pricing.paypal.containerId} style={{ width: "100%", maxWidth: "400px", margin: "0 auto" }}></div>)}
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
                        <Box bg={`linear-gradient(135deg, ${SNT_BLUE} 0%, #0572c2 100%)`} borderRadius="12px" p={4} mb={4} color="white" textAlign="center" boxShadow="0 4px 12px rgba(6, 140, 239, 0.3)">
                            <HStack gap={4} fontSize="16px" fontWeight="medium" flexWrap="wrap" justify="center">
                                <HStack gap={2}>
                                    <CreditCard size={20} weight="fill"/>
                                    <Text>Kreditkarte</Text>
                                </HStack>
                                <Text opacity={0.7}>•</Text>
                                <HStack gap={2}>
                                    <CreditCard size={20} weight="fill"/>
                                    <Text>Debitkarte</Text>
                                </HStack>
                                <Text opacity={0.7}>•</Text>
                                <HStack gap={2}>
                                    <GoogleLogo size={20} weight="fill"/>
                                    <Text>Google Pay</Text>
                                </HStack>
                                <Text opacity={0.7}>•</Text>
                                <HStack gap={2}>
                                    <AppleLogo size={20} weight="fill"/>
                                    <Text>Apple Pay</Text>
                                </HStack>
                            </HStack>
                        </Box>
                        
                        {/* Monthly Outseta Embed - dynamisch basierend auf Rabatt */}
                        {isClient && (<div data-o-auth="1" data-widget-mode="register" data-plan-uid={pricing.outseta.planUid} data-plan-payment-term={pricing.outseta.paymentTerm} data-skip-plan-options="true" data-mode="embed" style={{ background: "white", color: "black", padding: "16px", borderRadius: "8px" }}>
                            </div>)}
                    </div>
                </section>
                
                {/* Rechte Seite: Produktinfos, Vorteile, etc. - nur auf Desktop */}
                <Box w={420} flexShrink={0} display={{ base: "none", md: "flex" }} flexDirection="column" gap={6}>
                    {/* Preisbox - AN ERSTER STELLE */}
                    <Box position="relative" w="full" maxW="md" mx="auto" bg="white" borderRadius="xl" boxShadow="lg" border="2px solid" borderColor={SNT_BLUE} p={6}>
                        <Flex align="center" justify="center" w="full" flexDirection="column" gap={1}>
                            <Text fontSize={{ base: "3xl", sm: "4xl" }} fontWeight="extrabold" color={SNT_BLUE} lineHeight="1">{formatPrice(pricing.price)}</Text>
                            <Text fontSize={{ base: "sm", sm: "md" }} fontWeight="bold" color="gray.800" letterSpacing="0.5px" mt={-1}>{pricing.label}</Text>
                            <Text fontSize="xs" color="gray.600">Jederzeit kündbar</Text>
                        </Flex>
                    </Box>

                    
                    {/* What you get - Desktop Version */}
                    <Box bg="white" borderRadius="xl" boxShadow="md" p={6} border="1px solid" borderColor="gray.200" display="flex" flexDirection="column" gap={2}>
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
                                        <circle cx="10" cy="10" r="10" fill={SNT_BLUE}/>
                                        <path d="M6 10.5L9 13.5L14 8.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </Box>
                                <Text color="gray.800" as="span">
                                    <Text as="span" fontWeight="semibold" color="gray.900">Jederzeit kündbar</Text> - Keine Vertragsbindung
                                </Text>
                            </Flex>
                        </Box>
                    </Box>
                </Box>
            </Flex>
            </Box>
        </>);
}

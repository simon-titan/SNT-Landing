"use client";

import { useState, useEffect } from "react";
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  IconButton,
  RadioGroup,
} from "@chakra-ui/react";
import { X, ArrowLeft, CheckCircle, CreditCard, GoogleLogo, AppleLogo, Lock } from "@phosphor-icons/react/dist/ssr";
import { useRouter } from "next/navigation";
import { pricingConfig, isDiscountActive } from "@/config/pricing-config";
import { outsetaConfig } from "@/config/outseta-config";

const SNT_BLUE = "#068CEF";
const OUTSETA_DOMAIN = outsetaConfig.domain;
const MODAL_BG = "rgba(40, 40, 40, 0.98)";

interface PricingSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlan?: "monthly" | "quarterly" | "annual" | null;
  skipToCheckout?: boolean; // Direkt zum Checkout springen
}

type View = "selection" | "checkout";

export function PricingSelectionModal({
  isOpen,
  onClose,
  initialPlan = null,
  skipToCheckout = false,
}: PricingSelectionModalProps) {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [currentView, setCurrentView] = useState<View>("selection");
  const [isClient, setIsClient] = useState(false);
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const [paypalButtonRendered, setPaypalButtonRendered] = useState(false);
  const discountActive = isDiscountActive();
  const pricing = discountActive ? pricingConfig.discount : pricingConfig.standard;

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isOpen && isClient) {
      // Set initial selection based on initialPlan
      if (initialPlan === "monthly") {
        setSelectedOption("monthly");
      } else if (initialPlan === "quarterly") {
        setSelectedOption("quarterly");
      } else if (initialPlan === "annual") {
        setSelectedOption("annual");
      } else {
        // Default to annual if no initial plan (beste Empfehlung)
        setSelectedOption("annual");
      }

      // Wenn skipToCheckout true ist, direkt zum Checkout springen
      if (skipToCheckout && initialPlan) {
        setCurrentView("checkout");
      } else {
        // Reset to selection view when modal opens
        setCurrentView("selection");
      }

      // Don't auto-load SDK here - let renderPayPalButton handle it based on selectedOption
      // This ensures the correct SDK is loaded for the selected plan
    }
  }, [isOpen, isClient, initialPlan, skipToCheckout]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Setup Outseta success handler when checkout view is shown
  useEffect(() => {
    if (currentView === "checkout" && isClient) {
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

      setTimeout(setupOutsetaSuccessHandler, 1000);
    }
  }, [currentView, isClient]);

  const loadPayPalSDK = (type: "subscription" | "order" = "subscription") => {
    if (type === "subscription") {
      // Check if subscription SDK is already loaded
      const existingSubscriptionScript = document.getElementById("paypal-sdk-mobile");
      if (existingSubscriptionScript) {
        if ((window as any).paypal?.Buttons) {
          setPaypalLoaded(true);
          setTimeout(renderPayPalButton, 100);
        }
        return;
      }

      // Load subscription SDK (needed for monthly)
      const script = document.createElement("script");
      script.id = "paypal-sdk-mobile";
      script.src =
        "https://www.paypal.com/sdk/js?client-id=ASzGd21OHNK5yaZUKtlBrKw4F2oN04ZcUxyUmzAy_VeOjMWYCV7vEy1D0p_biwg5VcBVh_NvfOTEZnmF&vault=true&intent=subscription&currency=EUR";
      script.setAttribute("data-sdk-integration-source", "button-factory");
      script.async = true;
      script.onload = () => {
        console.log("PricingSelectionModal: Subscription SDK geladen");
        setPaypalLoaded(true);
        renderPayPalButton();
        // Notify other components that SDK is loaded
        window.dispatchEvent(new CustomEvent('paypal-sdk-loaded', { detail: { type: 'subscription' } }));
      };
      document.head.appendChild(script);
    } else {
      // Check if order SDK is already loaded
      const existingOrderScript = document.getElementById("paypal-sdk-order");
      if (existingOrderScript) {
        if ((window as any).paypal?.Buttons) {
          setPaypalLoaded(true);
          setTimeout(renderPayPalButton, 100);
        }
        return;
      }

      // Load order SDK (needed for lifetime) - with vault=true to support both orders and subscriptions
      const script = document.createElement("script");
      script.id = "paypal-sdk-order";
      script.src =
        "https://www.paypal.com/sdk/js?client-id=ASzGd21OHNK5yaZUKtlBrKw4F2oN04ZcUxyUmzAy_VeOjMWYCV7vEy1D0p_biwg5VcBVh_NvfOTEZnmF&vault=true&currency=EUR";
      script.setAttribute("data-sdk-integration-source", "button-factory");
      script.async = true;
      script.onload = () => {
        console.log("PricingSelectionModal: Order SDK geladen mit vault=true");
        setPaypalLoaded(true);
        renderPayPalButton();
        // Notify other components that SDK is loaded
        window.dispatchEvent(new CustomEvent('paypal-sdk-loaded', { detail: { type: 'order' } }));
      };
      document.head.appendChild(script);
    }
  };

  const renderPayPalButton = () => {
    if (!(window as any).paypal || !selectedOption) {
      console.log("PayPal SDK nicht verfügbar oder keine Option ausgewählt");
      return;
    }

    // Nur hidden container verwenden (Checkout verwendet nur Outseta)
    const containerId = "paypal-express-container-hidden";
    const container = document.getElementById(containerId);
    if (!container) {
      console.log("Container nicht gefunden, versuche es später erneut");
      setTimeout(renderPayPalButton, 200);
      return;
    }

    container.innerHTML = "";

    const buttonConfig = {
      style: {
        shape: "rect" as const,
        color: "gold" as const,
        layout: "vertical" as const,
        label: "paypal" as const,
        height: 48,
        tagline: false,
      },
      onApprove: function (data: any) {
        // Alle Pläne sind jetzt Subscriptions (monthly, quarterly, annual)
        console.log("PayPal Subscription genehmigt:", data.subscriptionID);
        const telegramUserId =
          localStorage.getItem("telegram_user_id") ||
          sessionStorage.getItem("telegram_user_id");
        let redirectUrl = `/thank-you-3?subscription_id=${data.subscriptionID}&product=${selectedOption}`;

        if (telegramUserId) {
          redirectUrl += `&telegram_user_id=${telegramUserId}`;
        }

        window.location.href = redirectUrl;
      },
      onError: function (err: any) {
        console.error("PayPal Fehler:", err);
        alert(
          "Es gab einen Fehler beim Erstellen der Zahlung. Bitte versuchen Sie es erneut."
        );
      },
    };

    // Alle Pläne sind jetzt Subscriptions (monthly, quarterly, annual)
    const subscriptionScript = document.getElementById("paypal-sdk-mobile");
    
    // Clear button containers
    try {
      const paypalContainers = document.querySelectorAll('[id*="paypal-express"]');
      paypalContainers.forEach(container => {
        try {
          (container as HTMLElement).innerHTML = '';
        } catch (e) {
          // Ignore errors
        }
      });
    } catch (e) {
      // Ignore errors
    }

    const renderSubscriptionButton = () => {
      const subscriptionScript = document.getElementById("paypal-sdk-mobile");
      
      if (!(window as any).paypal?.Buttons) {
        console.log("PayPal Buttons API nicht verfügbar");
        if (!subscriptionScript) {
          loadPayPalSDK("subscription");
        } else {
          const checkSDK = (attempt = 0) => {
            if ((window as any).paypal?.Buttons) {
              renderSubscriptionButton();
            } else if (attempt < 30) {
              setTimeout(() => checkSDK(attempt + 1), 200);
            } else {
              console.error("PayPal Buttons API nicht verfügbar nach 30 Versuchen");
            }
          };
          setTimeout(() => checkSDK(), 200);
        }
        return;
      }

      // Bestimme den richtigen Plan basierend auf selectedOption
      let planId = pricing.monthly.paypal.planId;
      let planName = "MONTHLY";
      
      if (selectedOption === "quarterly") {
        planId = pricing.quarterly.paypal.planId;
        planName = "QUARTERLY";
      } else if (selectedOption === "annual") {
        planId = pricing.annual.paypal.planId;
        planName = "ANNUAL";
      }

      const subscriptionConfig = {
        ...buttonConfig,
        createSubscription: function (data: any, actions: any) {
          const telegramUserId = localStorage.getItem("telegram_user_id");
          const customId = telegramUserId
            ? `TG_USER_${telegramUserId}|SNTTRADES_${planName}_PLAN`
            : `SNTTRADES_${planName}_PLAN`;

          return actions.subscription.create({
            plan_id: planId,
            custom_id: customId,
            application_context: {
              brand_name: "SNTTRADES",
              shipping_preference: "NO_SHIPPING",
              payment_method: {
                payer_selected: "PAYPAL",
                payee_preferred: "IMMEDIATE_PAYMENT_REQUIRED",
              },
            },
          });
        },
      };

      const containerId = "#paypal-express-container-hidden";
      
      (window as any).paypal
        .Buttons(subscriptionConfig)
        .render(containerId)
        .then(() => {
          console.log(`PayPal ${planName} Button erfolgreich gerendert`);
          setPaypalButtonRendered(true);
        })
        .catch((error: any) => {
          console.error(`PayPal ${planName} Button Render Fehler:`, error);
        });
    };

    // Render button - use existing SDK if available
    if (subscriptionScript && (window as any).paypal?.Buttons) {
      setTimeout(() => {
        renderSubscriptionButton();
      }, 100);
    } else if (!subscriptionScript) {
      loadPayPalSDK("subscription");
    } else {
      setTimeout(() => {
        renderSubscriptionButton();
      }, 200);
    }
  };

  useEffect(() => {
    if (selectedOption && isOpen) {
      setPaypalButtonRendered(false);
      // Wait longer to ensure SDK cleanup/loading is complete
      // renderPayPalButton will handle loading the correct SDK
      setTimeout(() => {
        renderPayPalButton();
      }, 500);
    }
  }, [selectedOption, isOpen]);

  // PayPal Button Rendering für Checkout entfernt - nur Outseta Embed wird verwendet

  const formatPrice = (price: number) => {
    return price % 1 === 0 ? `${price}€` : `${price.toFixed(2).replace(".", ",")}€`;
  };

  const restoreSubscriptionSDK = () => {
    // When modal closes, restore Subscription SDK for mobile footer
    const subscriptionScript = document.getElementById("paypal-sdk-mobile");
    const orderScript = document.getElementById("paypal-sdk-order");
    
    // If Subscription SDK is already loaded, we're good
    if (subscriptionScript) {
      console.log("Modal geschlossen: Subscription SDK bereits geladen für Mobile Footer");
      // Clear button containers to force re-render
      try {
        const paypalContainers = document.querySelectorAll('[id*="paypal-hidden-container"]');
        paypalContainers.forEach(container => {
          try {
            (container as HTMLElement).innerHTML = '';
          } catch (e) {
            // Ignore errors
          }
        });
      } catch (e) {
        // Ignore errors
      }
      return;
    }
    
    // If Order SDK is loaded but not Subscription SDK, we need to remove Order SDK first
    // Then load Subscription SDK to avoid conflicts
    if (orderScript && !subscriptionScript) {
      console.log("Modal geschlossen: Order SDK geladen, entferne es und lade Subscription SDK...");
      
      // Remove Order SDK
      orderScript.remove();
      
      // Clear PayPal from window
      if ((window as any).paypal) {
        try {
          delete (window as any).paypal;
        } catch (e) {
          // Ignore errors
        }
      }
      
      // Clear PayPal-related global variables
      try {
        delete (window as any).__paypal_storage__;
        delete (window as any).__paypal_checkout__;
        delete (window as any).__paypal_common__;
        delete (window as any).__paypal_buttons__;
      } catch (e) {
        // Ignore errors
      }
      
      // Clear button containers
      try {
        const paypalContainers = document.querySelectorAll('[id*="paypal"]');
        paypalContainers.forEach(container => {
          try {
            (container as HTMLElement).innerHTML = '';
          } catch (e) {
            // Ignore errors
          }
        });
      } catch (e) {
        // Ignore errors
      }
      
      // Wait before loading Subscription SDK to ensure clean state
      setTimeout(() => {
        console.log("Modal geschlossen: Lade Subscription SDK für Mobile Footer...");
        const script = document.createElement("script");
        script.id = "paypal-sdk-mobile";
        script.src =
          "https://www.paypal.com/sdk/js?client-id=ASzGd21OHNK5yaZUKtlBrKw4F2oN04ZcUxyUmzAy_VeOjMWYCV7vEy1D0p_biwg5VcBVh_NvfOTEZnmF&vault=true&intent=subscription&currency=EUR";
        script.setAttribute("data-sdk-integration-source", "button-factory");
        script.async = true;
        script.onload = () => {
          console.log("Subscription SDK für Mobile Footer geladen");
          // Trigger re-render of mobile footer buttons
          window.dispatchEvent(new Event('paypal-sdk-loaded'));
        };
        document.head.appendChild(script);
      }, 500);
      return;
    }
    
    // If no SDK is loaded, load Subscription SDK
    if (!subscriptionScript && !orderScript) {
      console.log("Modal geschlossen: Lade Subscription SDK für Mobile Footer...");
      const script = document.createElement("script");
      script.id = "paypal-sdk-mobile";
      script.src =
        "https://www.paypal.com/sdk/js?client-id=ASzGd21OHNK5yaZUKtlBrKw4F2oN04ZcUxyUmzAy_VeOjMWYCV7vEy1D0p_biwg5VcBVh_NvfOTEZnmF&vault=true&intent=subscription&currency=EUR";
      script.setAttribute("data-sdk-integration-source", "button-factory");
      script.async = true;
      script.onload = () => {
        console.log("Subscription SDK für Mobile Footer geladen");
        // Trigger re-render of mobile footer buttons
        window.dispatchEvent(new Event('paypal-sdk-loaded'));
      };
      document.head.appendChild(script);
    }
  };

  const handleClose = () => {
    restoreSubscriptionSDK();
    onClose();
  };

  const handleJoin = () => {
    if (selectedOption === "monthly" || selectedOption === "quarterly" || selectedOption === "annual") {
      setCurrentView("checkout");
    }
  };

  const getCurrentPlanPricing = () => {
    if (selectedOption === "monthly") {
      return pricing.monthly;
    } else if (selectedOption === "quarterly") {
      return pricing.quarterly;
    } else if (selectedOption === "annual") {
      return pricing.annual;
    }
    return null;
  };

  if (!isOpen) return null;

  return (
    <>
      <style jsx global>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .modal-container {
          animation: slideUp 0.3s ease-out;
          overflow: hidden;
        }
        .modal-content {
          animation: fadeIn 0.3s ease-out;
        }
        .item-header {
          display: none !important;
        }
      `}</style>
      <Box
        position="fixed"
        inset={0}
        zIndex={9999}
        bg="rgba(0, 0, 0, 0.7)"
        backdropFilter="blur(4px)"
        display="flex"
        alignItems="flex-end"
        justifyContent="center"
        onClick={(e) => {
          if (e.target === e.currentTarget && currentView === "selection") {
            handleClose();
          }
        }}
      >
        <Box
          bg={MODAL_BG}
          backdropFilter="blur(20px)"
          borderRadius={{ base: "2xl", md: "2xl" }}
          borderTopRadius={{ base: "2xl", md: "2xl" }}
          borderBottomRadius={{ base: "0", md: "2xl" }}
          w="full"
          maxW={{ base: "full", md: "50%" }}
          maxH="90vh"
          overflowY="auto"
          overflowX="hidden"
          display="flex"
          flexDirection="column"
          boxShadow="0 -10px 40px rgba(6, 140, 239, 0.3)"
          borderTop="2px solid rgba(6, 140, 239, 0.3)"
          borderBottom={{ base: "none", md: "2px solid rgba(6, 140, 239, 0.3)" }}
          borderLeft={{ base: "none", md: "2px solid rgba(6, 140, 239, 0.3)" }}
          borderRight={{ base: "none", md: "2px solid rgba(6, 140, 239, 0.3)" }}
          onClick={(e) => e.stopPropagation()}
          position="relative"
          className="modal-container"
        >
        {/* Drag Handle */}
        <Box
          w="40px"
          h="4px"
          bg="rgba(255, 255, 255, 0.3)"
          borderRadius="full"
          mx="auto"
          mt={3}
          mb={4}
        />

        {/* Header */}
        <HStack justify="space-between" align="center" px={6} mb={6}>
          {currentView === "checkout" ? (
            <IconButton
              aria-label="Zurück"
              onClick={() => {
                setCurrentView("selection");
                // Re-render PayPal button with correct SDK when going back to selection
                setTimeout(() => {
                  renderPayPalButton();
                }, 200);
              }}
              variant="ghost"
              color="white"
              size="sm"
              _hover={{ bg: "rgba(255, 255, 255, 0.1)" }}
            >
              <ArrowLeft size={20} weight="bold" />
            </IconButton>
          ) : (
            <Box w="32px" /> // Spacer for alignment
          )}
          <Heading fontSize="xl" color="white" fontWeight="bold" flex={1} textAlign="center">
          {currentView === "checkout" ? "" : "WÄHLE DEINEN PLAN"}
          </Heading>
          <IconButton
            aria-label="Schließen"
            onClick={handleClose}
            variant="ghost"
            color="white"
            size="sm"
            _hover={{ bg: "rgba(255, 255, 255, 0.1)" }}
          >
            <X size={20} weight="bold" />
          </IconButton>
        </HStack>

        {/* Content – auf Desktop scrollt das Modal (Checkout), das Embed hat feste Höhe und kann intern scrollen */}
        <Box className="modal-content">
          {currentView === "selection" ? (
            <VStack gap={4} px={6} pb={6} align="stretch">
              <RadioGroup.Root
                value={selectedOption}
                onValueChange={(e) => setSelectedOption(e.value)}
              >
                <VStack gap={3} align="stretch">
                  {/* Monthly Option */}
                  <Box
                    as="label"
                    cursor="pointer"
                    p={4}
                    borderRadius="lg"
                    border="1px solid"
                    borderColor={
                      selectedOption === "monthly"
                        ? SNT_BLUE
                        : "rgba(255, 255, 255, 0.1)"
                    }
                    bg={
                      selectedOption === "monthly"
                        ? "rgba(6, 140, 239, 0.1)"
                        : "rgba(255, 255, 255, 0.02)"
                    }
                    transition="all 0.2s"
                    _hover={{
                      borderColor: "rgba(6, 140, 239, 0.5)",
                      bg: "rgba(6, 140, 239, 0.05)",
                    }}
                  >
                    <HStack gap={3}>
                      <RadioGroup.Item value="monthly">
                        <RadioGroup.ItemHiddenInput />
                        <RadioGroup.ItemIndicator />
                      </RadioGroup.Item>
                      <VStack align="start" gap={0} flex={1}>
                        <Text color="white" fontWeight="medium">
                          SNT-PREMIUM  / {formatPrice(pricing.monthly.price)}
                        </Text>
                        <Text color="gray.400" fontSize="sm">
                          Monatliches Abo
                        </Text>
                      </VStack>
                    </HStack>
                  </Box>

                  {/* Quarterly Option */}
                  <Box
                    as="label"
                    cursor="pointer"
                    p={4}
                    borderRadius="lg"
                    border="1px solid"
                    borderColor={
                      selectedOption === "quarterly"
                        ? SNT_BLUE
                        : "rgba(255, 255, 255, 0.1)"
                    }
                    bg={
                      selectedOption === "quarterly"
                        ? "rgba(6, 140, 239, 0.1)"
                        : "rgba(255, 255, 255, 0.02)"
                    }
                    transition="all 0.2s"
                    _hover={{
                      borderColor: "rgba(6, 140, 239, 0.5)",
                      bg: "rgba(6, 140, 239, 0.05)",
                    }}
                  >
                    <HStack gap={3}>
                      <RadioGroup.Item value="quarterly">
                        <RadioGroup.ItemHiddenInput />
                        <RadioGroup.ItemIndicator />
                      </RadioGroup.Item>
                      <VStack align="start" gap={0} flex={1}>
                        <Text color="white" fontWeight="medium">
                          SNT-PREMIUM  / {formatPrice(pricing.quarterly.price)}
                        </Text>
                        <Text color="gray.400" fontSize="md">
                          3-Monatiges Abo - <Text as="span" color="white">Spare ca. <b style={{ textDecoration: "underline" }}>80€</b></Text> 
                          </Text>
                      </VStack>
                    </HStack>
                  </Box>

                  {/* Annual Option - Empfehlung */}
                  <Box
                    as="label"
                    cursor="pointer"
                    p={4}
                    borderRadius="lg"
                    border="2px solid"
                    borderColor={
                      selectedOption === "annual"
                        ? SNT_BLUE
                        : "rgba(255, 255, 255, 0.1)"
                    }
                    bg={
                      selectedOption === "annual"
                        ? "rgba(6, 140, 239, 0.15)"
                        : "rgba(255, 255, 255, 0.02)"
                    }
                    transition="all 0.2s"
                    _hover={{
                      borderColor: SNT_BLUE,
                      bg: "rgba(6, 140, 239, 0.1)",
                    }}
                    position="relative"
                  >
                    <Box
                      position="absolute"
                      top={-2}
                      right={-2}
                      bg="red.500"
                      color="white"
                      px={2}
                      py={0.5}
                      borderRadius="full"
                      fontSize="2xs"
                      fontWeight="bold"
                    >
                      EMPFEHLUNG
                    </Box>
                    <HStack gap={3}>
                      <RadioGroup.Item value="annual">
                        <RadioGroup.ItemHiddenInput />
                        <RadioGroup.ItemIndicator />
                      </RadioGroup.Item>
                      <VStack align="start" gap={0} flex={1}>
                        <Text color="white" fontWeight="bold">
                          SNT-PREMIUM  / {formatPrice(pricing.annual.price)}
                        </Text>
                        <Text color="gray.400" fontSize="md">
                          Jährliches Abo - <Text as="span" color="white">Spare ca. <b style={{ textDecoration: "underline" }}>200€</b></Text> 
                          </Text>
                      </VStack>
                    </HStack>
                  </Box>
                </VStack>
              </RadioGroup.Root>

              {/* PayPal Express Button */}
              {selectedOption && (
                <VStack gap={3} mt={4}>
                  {/* PayPal Button mit Overlay */}
                  <Box
                    position="relative"
                    w="full"
                    h="48px"
                    borderRadius="lg"
                    overflow="hidden"
                  >
                    {/* PayPal Button Container - sichtbar aber mit opacity 0 */}
                    <Box
                      id="paypal-express-container-hidden"
                      position="absolute"
                      top="0"
                      left="0"
                      width="100%"
                      height="100%"
                      opacity="0"
                      pointerEvents="auto"
                      zIndex={1}
                    />
                    
                    {/* Custom Overlay Button */}
                    <Box
                      position="absolute"
                      top="0"
                      left="0"
                      right="0"
                      bottom="0"
                      zIndex={2}
                      bg="white"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      borderRadius="lg"
                      cursor={paypalButtonRendered ? "pointer" : "not-allowed"}
                      pointerEvents={paypalButtonRendered ? "none" : "auto"}
                      opacity={!paypalLoaded ? 0.6 : 1}
                      transition="all 0.3s ease"
                      _hover={
                        paypalButtonRendered
                          ? {
                              bg: "#f5f5f5",
                            }
                          : {}
                      }
                      onClick={() => {
                        if (!paypalButtonRendered) {
                          alert("PayPal wird noch geladen. Bitte warten Sie einen Moment.");
                        }
                      }}
                    >
                      {!paypalLoaded || !paypalButtonRendered ? (
                        <Text fontSize="sm" color="gray.500">
                          Lädt...
                        </Text>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="25"
                          viewBox="0 0 154.728 190.5"
                        >
                          <g transform="translate(898.192 276.071)">
                            <path
                              clipPath="none"
                              d="M-837.663-237.968a5.49 5.49 0 0 0-5.423 4.633l-9.013 57.15-8.281 52.514-.005.044.01-.044 8.281-52.514c.421-2.669 2.719-4.633 5.42-4.633h26.404c26.573 0 49.127-19.387 53.246-45.658.314-1.996.482-3.973.52-5.924v-.003h-.003c-6.753-3.543-14.683-5.565-23.372-5.565z"
                              fill="#001c64"
                            />
                            <path
                              clipPath="none"
                              d="M-766.506-232.402c-.037 1.951-.207 3.93-.52 5.926-4.119 26.271-26.673 45.658-53.246 45.658h-26.404c-2.701 0-4.999 1.964-5.42 4.633l-8.281 52.514-5.197 32.947a4.46 4.46 0 0 0 4.405 5.153h28.66a5.49 5.49 0 0 0 5.423-4.633l7.55-47.881c.423-2.669 2.722-4.636 5.423-4.636h16.876c26.573 0 49.124-19.386 53.243-45.655 2.924-18.649-6.46-35.614-22.511-44.026z"
                              fill="#0070e0"
                            />
                            <path
                              clipPath="none"
                              d="M-870.225-276.071a5.49 5.49 0 0 0-5.423 4.636l-22.489 142.608a4.46 4.46 0 0 0 4.405 5.156h33.351l8.281-52.514 9.013-57.15a5.49 5.49 0 0 1 5.423-4.633h47.782c8.691 0 16.621 2.025 23.375 5.563.46-23.917-19.275-43.666-46.412-43.666z"
                              fill="#003087"
                            />
                          </g>
                        </svg>
                      )}
                    </Box>
                  </Box>

                  {/* Trennlinie */}
                  <HStack w="full" gap={2}>
                    <Box flex={1} h="1px" bg="rgba(255, 255, 255, 0.1)" />
                    <Text color="gray.400" fontSize="sm">
                      oder
                    </Text>
                    <Box flex={1} h="1px" bg="rgba(255, 255, 255, 0.1)" />
                  </HStack>

                  {/* Join Button */}
                  <Button
                    w="full"
                    bg={SNT_BLUE}
                    color="white"
                    size="lg"
                    fontWeight="bold"
                    borderRadius="lg"
                    py={6}
                    _hover={{ bg: "#0572c2" }}
                    onClick={handleJoin}
                    disabled={!selectedOption}
                  >
                    <HStack gap={1.5} align="center" justify="center">
                      <Lock size={16} weight="fill" />
                      <Text fontSize={{ base: "xs", md: "md" }} whiteSpace="nowrap">JETZT SICHER ZUR KASSE</Text>
                    </HStack>
                  </Button>
                </VStack>
              )}

              {/* Payment Icons - unter beiden Buttons */}
              <HStack gap={3} align="center" justify="center" w="full">
                <Box display="flex" alignItems="center" justifyContent="center">
                  <HStack gap={3} align="center" justify="center">
                    <Box w={{ base: "32px", md: "40px" }} h={{ base: "24px", md: "30px" }} display="flex" alignItems="center" justifyContent="center">
                      <svg viewBox="0 -11 70 70" fill="none" xmlns="http://www.w3.org/2000/svg" width="40" height="30" style={{ width: '100%', height: '100%' }}>
                        <rect x="0.5" y="0.5" width="69" height="47" rx="5.5" fill="white" stroke="#D9D9D9"></rect>
                        <path fillRule="evenodd" clipRule="evenodd" d="M19.1601 16.6863C18.5726 17.3901 17.6325 17.9452 16.6924 17.8659C16.5749 16.9143 17.0352 15.9032 17.5737 15.2787C18.1613 14.5551 19.1895 14.0397 20.0219 14C20.1198 14.9913 19.7379 15.9627 19.1601 16.6863ZM20.012 18.0542C19.1838 18.006 18.4281 18.3064 17.8177 18.549C17.4249 18.7051 17.0923 18.8373 16.8392 18.8373C16.5552 18.8373 16.2089 18.6981 15.82 18.5417L15.82 18.5417L15.82 18.5417L15.82 18.5417C15.3104 18.3368 14.7278 18.1025 14.1169 18.1137C12.7166 18.1335 11.4142 18.9365 10.6993 20.2152C9.23044 22.7726 10.3174 26.5593 11.7373 28.6409C12.4326 29.6718 13.265 30.8018 14.3617 30.7622C14.8442 30.7438 15.1913 30.5947 15.5505 30.4404C15.9641 30.2628 16.3937 30.0782 17.0645 30.0782C17.712 30.0782 18.1228 30.2579 18.5172 30.4305C18.8921 30.5945 19.2522 30.752 19.7868 30.7424C20.9227 30.7225 21.6376 29.7115 22.3328 28.6806C23.0831 27.5741 23.4129 26.4943 23.4629 26.3304L23.4688 26.3114C23.4676 26.3102 23.4583 26.3059 23.4419 26.2984C23.1911 26.1821 21.274 25.2937 21.2557 22.9114C21.2372 20.9118 22.7762 19.8987 23.0185 19.7392C23.0332 19.7295 23.0432 19.723 23.0477 19.7196C22.0684 18.2525 20.5408 18.0939 20.012 18.0542ZM27.8755 30.6333V15.1796H33.6041C36.5615 15.1796 38.6277 17.2414 38.6277 20.2548C38.6277 23.2683 36.5223 25.3499 33.5258 25.3499H30.2453V30.6333H27.8755ZM30.2451 17.2018H32.9772C35.0336 17.2018 36.2087 18.312 36.2087 20.2648C36.2087 22.2175 35.0336 23.3377 32.9674 23.3377H30.2451V17.2018ZM46.452 28.7797C45.8253 29.989 44.4445 30.7523 42.9561 30.7523C40.7527 30.7523 39.2153 29.424 39.2153 27.4217C39.2153 25.4391 40.7038 24.2992 43.4555 24.1307L46.4128 23.9522V23.0998C46.4128 21.8409 45.6 21.1569 44.1508 21.1569C42.9561 21.1569 42.0845 21.7814 41.9083 22.733H39.7735C39.842 20.7307 41.7026 19.2735 44.2193 19.2735C46.9318 19.2735 48.6945 20.7108 48.6945 22.9412V30.6333H46.501V28.7797H46.452ZM43.5924 28.9185C42.3292 28.9185 41.5262 28.3039 41.5262 27.3622C41.5262 26.3908 42.2998 25.8257 43.7785 25.7365L46.4127 25.568V26.4403C46.4127 27.8876 45.1984 28.9185 43.5924 28.9185ZM55.9702 31.238C55.0204 33.9442 53.9334 34.8363 51.6224 34.8363C51.4461 34.8363 50.8585 34.8165 50.7214 34.7768V32.9232C50.8683 32.943 51.2307 32.9628 51.4167 32.9628C52.4645 32.9628 53.0521 32.5167 53.4144 31.357L53.6298 30.673L49.6149 19.4222H52.0924L54.8833 28.5517H54.9322L57.7231 19.4222H60.1321L55.9702 31.238Z" fill="#000000"></path>
                      </svg>
                    </Box>
                <Box w={{ base: "32px", md: "40px" }} h={{ base: "24px", md: "30px" }} display="flex" alignItems="center" justifyContent="center">
                  <svg viewBox="0 -9 58 58" fill="none" xmlns="http://www.w3.org/2000/svg" width="40" height="30" style={{ width: '100%', height: '100%' }}>
                        <rect x="0.5" y="0.5" width="57" height="39" rx="3.5" fill="white" stroke="#F3F3F3"></rect>
                        <path d="M34.3102 28.9765H23.9591V10.5122H34.3102V28.9765Z" fill="#FF5F00"></path>
                        <path d="M24.6223 19.7429C24.6223 15.9973 26.3891 12.6608 29.1406 10.5107C27.1285 8.93843 24.5892 7.99998 21.8294 7.99998C15.2961 7.99998 10 13.2574 10 19.7429C10 26.2283 15.2961 31.4857 21.8294 31.4857C24.5892 31.4857 27.1285 30.5473 29.1406 28.975C26.3891 26.8249 24.6223 23.4884 24.6223 19.7429" fill="#EB001B"></path>
                        <path d="M48.2706 19.7429C48.2706 26.2283 42.9745 31.4857 36.4412 31.4857C33.6814 31.4857 31.1421 30.5473 29.1293 28.975C31.8815 26.8249 33.6483 23.4884 33.6483 19.7429C33.6483 15.9973 31.8815 12.6608 29.1293 10.5107C31.1421 8.93843 33.6814 7.99998 36.4412 7.99998C42.9745 7.99998 48.2706 13.2574 48.2706 19.7429" fill="#F79E1B"></path>
                      </svg>
                    </Box>
                <Box w={{ base: "32px", md: "40px" }} h={{ base: "24px", md: "30px" }} display="flex" alignItems="center" justifyContent="center">
                  <svg viewBox="0 -11 70 70" fill="none" xmlns="http://www.w3.org/2000/svg" width="40" height="30" style={{ width: '100%', height: '100%' }}>
                    <rect x="0.5" y="0.5" width="69" height="47" rx="5.5" fill="white" stroke="#D9D9D9"></rect>
                    <path fillRule="evenodd" clipRule="evenodd" d="M33.0603 31.5161V25.4741H36.1786C37.4564 25.4741 38.535 25.046 39.4142 24.2015L39.6252 23.9875C41.2313 22.2391 41.1258 19.5155 39.4142 17.898C38.5584 17.0416 37.3861 16.5778 36.1786 16.6016H31.1729V31.5161H33.0603ZM33.0605 23.6425V18.4332H36.2262C36.9063 18.4332 37.5512 18.6948 38.0319 19.1706C39.052 20.1696 39.0754 21.8347 38.0905 22.8694C37.6098 23.3809 36.9297 23.6663 36.2262 23.6425H33.0605ZM48.4293 22.1083C47.6204 21.359 46.5185 20.9784 45.1234 20.9784C43.3298 20.9784 41.9816 21.6444 41.0906 22.9646L42.7553 24.0231C43.3649 23.1192 44.1973 22.6673 45.2524 22.6673C45.9206 22.6673 46.5653 22.9171 47.0694 23.369C47.5618 23.7972 47.8432 24.4156 47.8432 25.0698V25.5098C47.1163 25.1055 46.2019 24.8914 45.0765 24.8914C43.7635 24.8914 42.7084 25.2006 41.923 25.831C41.1375 26.4613 40.739 27.2939 40.739 28.3524C40.7155 29.3158 41.1258 30.2316 41.8527 30.85C42.5912 31.5161 43.5291 31.8491 44.631 31.8491C45.9323 31.8491 46.9639 31.2663 47.7494 30.1007H47.8314V31.5161H49.6368V25.2244C49.6368 23.9042 49.2382 22.8576 48.4293 22.1083ZM43.3066 29.6369C42.9197 29.3514 42.6852 28.8876 42.6852 28.3881C42.6852 27.8291 42.9432 27.3652 43.4473 26.9965C43.9632 26.6278 44.6081 26.4375 45.3702 26.4375C46.4255 26.4256 47.2462 26.6635 47.8325 27.1392C47.8325 27.948 47.5159 28.6497 46.8945 29.2444C46.3317 29.8153 45.5696 30.1364 44.7723 30.1364C44.2446 30.1483 43.7287 29.9699 43.3066 29.6369ZM53.693 35.9999L60.0001 21.3114H57.9485L55.0295 28.6378H54.9943L52.0049 21.3114H49.9534L54.0916 30.8619L51.747 35.9999H53.693Z" fill="#3C4043"></path>
                    <path d="M26.544 24.1659C26.544 23.5831 26.4971 23.0003 26.4034 22.4294H18.4434V25.7239H23.0037C22.8161 26.7825 22.2065 27.734 21.3155 28.3286V30.4695H24.0353C25.6296 28.9828 26.544 26.7825 26.544 24.1659Z" fill="#4285F4"></path>
                    <path d="M18.4442 32.539C20.7185 32.539 22.6411 31.7778 24.0361 30.4695L21.3164 28.3287C20.5544 28.852 19.5814 29.1493 18.4442 29.1493C16.2403 29.1493 14.3763 27.6388 13.7081 25.6169H10.9062V27.8291C12.3365 30.7193 15.2555 32.539 18.4442 32.539Z" fill="#34A853"></path>
                    <path d="M13.708 25.6169C13.3563 24.5584 13.3563 23.4048 13.708 22.3343V20.134H10.9058C9.69808 22.5484 9.69808 25.4029 10.9058 27.8172L13.708 25.6169Z" fill="#FBBC04"></path>
                    <path d="M18.4442 18.8019C19.6517 18.7781 20.8123 19.242 21.6798 20.0864L24.0948 17.6363C22.559 16.1853 20.5427 15.3885 18.4442 15.4123C15.2555 15.4123 12.3365 17.2439 10.9062 20.134L13.7081 22.3462C14.3763 20.3124 16.2403 18.8019 18.4442 18.8019Z" fill="#EA4335"></path>
                  </svg>
                </Box>
                <Box w={{ base: "32px", md: "40px" }} h={{ base: "24px", md: "30px" }} display="flex" alignItems="center" justifyContent="center">
                  <svg viewBox="0 -9 58 58" fill="none" xmlns="http://www.w3.org/2000/svg" width="40" height="30" style={{ width: '100%', height: '100%' }}>
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                    <g id="SVGRepo_iconCarrier">
                      <rect x="0.5" y="0.5" width="57" height="39" rx="3.5" fill="white" stroke="#F3F3F3"></rect>
                      <path d="M25.7516 27.4332H21.8901L24.3054 13.4325H28.1667L25.7516 27.4332Z" fill="#15195A"></path>
                      <path d="M39.7499 13.7748C38.9882 13.4915 37.7802 13.1787 36.2865 13.1787C32.4731 13.1787 29.7878 15.0851 29.7713 17.8106C29.7396 19.8215 31.6939 20.9384 33.1556 21.6089C34.6495 22.2941 35.1574 22.7413 35.1574 23.352C35.1422 24.29 33.9502 24.7223 32.8384 24.7223C31.2967 24.7223 30.4707 24.4994 29.2153 23.9776L28.7069 23.7539L28.1665 26.8967C29.0722 27.2835 30.7408 27.6268 32.4731 27.6419C36.5249 27.6419 39.1627 25.765 39.1939 22.8605C39.2093 21.2667 38.1774 20.0454 35.9526 19.0475C34.602 18.4069 33.7749 17.9749 33.7749 17.3195C33.7908 16.7236 34.4745 16.1133 35.9991 16.1133C37.2544 16.0834 38.1768 16.3663 38.8755 16.6494L39.2247 16.7981L39.7499 13.7748V13.7748V13.7748Z" fill="#15195A"></path>
                      <path fillRule="evenodd" clipRule="evenodd" d="M46.6618 13.4325H49.6486L52.7639 27.433H49.1885C49.1885 27.433 48.8386 25.8244 48.7278 25.3328H43.7699C43.6266 25.705 42.9595 27.433 42.9595 27.433H38.9078L44.6435 14.5941C45.0409 13.6855 45.7407 13.4325 46.6618 13.4325ZM46.4238 18.556C46.4238 18.556 45.2001 21.6689 44.8821 22.4732H48.0918C47.933 21.7733 47.2017 18.4219 47.2017 18.4219L46.9319 17.2156C46.8182 17.5262 46.6539 17.9533 46.543 18.2414C46.4679 18.4366 46.4173 18.568 46.4238 18.556Z" fill="#15195A"></path>
                      <path fillRule="evenodd" clipRule="evenodd" d="M5.1589 13.4325H11.3716C12.2138 13.462 12.8971 13.7152 13.1194 14.6094L14.4696 21.0422C14.4697 21.0426 14.4699 21.043 14.47 21.0434L14.8832 22.9796L18.6649 13.4325H22.7481L16.6785 27.4184H12.5951L9.15337 15.253C7.96587 14.6021 6.6106 14.0786 5.09534 13.7154L5.1589 13.4325Z" fill="#15195A"></path>
                    </g>
                  </svg>
                </Box>
                  </HStack>
                </Box>
              </HStack>
            </VStack>
          ) : (
            // Checkout View – Modal-Inhalt scrollt (Desktop), Embed hat feste Höhe und kann intern scrollen
            <VStack gap={4} px={6} pb={6} align="stretch" flex="1" minW={0}>
              {(() => {
                const planPricing = getCurrentPlanPricing();
                if (!planPricing) return null;

                return (
                  <>
                    {isClient && (
                      <Box
                        bg="white"
                        borderRadius="xl"
                        p={4}
                        border="1px solid"
                        borderColor="gray.200"
                        w="full"
                        minW={0}
                        flex="1"
                        minH={{ base: "580px", md: "720px" }}
                        display="flex"
                        flexDirection="column"
                        overflow="hidden"
                      >
                        <iframe
                          title="Outseta Checkout"
                          src={`https://${OUTSETA_DOMAIN}/auth?widgetMode=register&planUid=${planPricing.outseta.planUid}&planPaymentTerm=${planPricing.outseta.paymentTerm}&skipPlanOptions=true`}
                          style={{
                            width: "100%",
                            flex: 1,
                            minHeight: "520px",
                            border: "none",
                            borderRadius: "8px",
                          }}
                        />
                      </Box>
                    )}
                  </>
                );
              })()}
            </VStack>
          )}
        </Box>
        </Box>
      </Box>

      {/* Registration Modal */}
    </>
  );
}

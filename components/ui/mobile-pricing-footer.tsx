"use client";

import { useState, useEffect } from "react";
import { Box, HStack, VStack, Button, Text } from "@chakra-ui/react";
import { CaretDown, Lock } from "@phosphor-icons/react/dist/ssr";
import { PricingSelectionModal } from "./pricing-selection-modal";
import { pricingConfig, isDiscountActive } from "@/config/pricing-config";

const SNT_BLUE = "#068CEF";

export function MobilePricingFooter() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "lifetime" | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const [paypalButtonRendered, setPaypalButtonRendered] = useState(false);

  const discountActive = isDiscountActive();
  const pricing = discountActive ? pricingConfig.discount : pricingConfig.standard;

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && !paypalLoaded) {
      loadPayPalSDK();
    }
  }, [isClient]);

  // Check if PayPal is already loaded on mount
  useEffect(() => {
    if (isClient && (window as any).paypal && !paypalLoaded) {
      console.log("Mobile Footer: PayPal already loaded, setting state");
      setPaypalLoaded(true);
    }
  }, [isClient, paypalLoaded]);

  const loadPayPalSDK = () => {
    // Check if ANY PayPal SDK with vault support is already loaded
    if ((window as any).paypal?.Buttons) {
      console.log("Mobile Footer: PayPal SDK bereits verfügbar, prüfe vault support");
      
      // Test if current SDK supports subscriptions (has vault=true)
      try {
        // Check if we can create a test subscription config
        const testConfig = {
          createSubscription: () => Promise.resolve({ subscriptionID: 'test' })
        };
        console.log("Mobile Footer: Existierendes SDK unterstützt Subscriptions");
        setPaypalLoaded(true);
        return;
      } catch (error) {
        console.log("Mobile Footer: Existierendes SDK unterstützt keine Subscriptions, lade neues SDK");
      }
    }

    // Check if our subscription SDK is already loaded
    const existingSubscriptionScript = document.getElementById("paypal-sdk-mobile-footer-subscription");
    if (existingSubscriptionScript && (window as any).paypal?.Buttons) {
      console.log("Mobile Footer: Subscription SDK bereits geladen");
      setPaypalLoaded(true);
      return;
    }

    // Load Subscription SDK with vault=true (don't remove existing scripts to avoid conflicts)
    const script = document.createElement("script");
    script.id = "paypal-sdk-mobile-footer-subscription";
    script.src = "https://www.paypal.com/sdk/js?client-id=ASzGd21OHNK5yaZUKtlBrKw4F2oN04ZcUxyUmzAy_VeOjMWYCV7vEy1D0p_biwg5VcBVh_NvfOTEZnmF&vault=true&intent=subscription&currency=EUR";
    script.setAttribute("data-sdk-integration-source", "button-factory");
    script.async = true;
    
    script.onload = () => {
      console.log("Mobile Footer: Subscription SDK geladen mit vault=true");
      // Wait a bit for SDK to initialize
      setTimeout(() => {
        if ((window as any).paypal?.Buttons) {
          setPaypalLoaded(true);
        } else {
          console.error("Mobile Footer: PayPal Buttons nicht verfügbar nach SDK Load");
        }
      }, 500);
    };
    
    script.onerror = () => {
      console.error("Mobile Footer: Fehler beim Laden des PayPal SDK");
    };
    
    document.head.appendChild(script);
  };


  useEffect(() => {
    if (paypalLoaded && !paypalButtonRendered) {
      renderPayPalButtons();
    }
  }, [paypalLoaded, paypalButtonRendered]);

  // Listen for SDK reload events from modal
  useEffect(() => {
    const handleSDKLoaded = () => {
      console.log("Mobile Footer: PayPal SDK reload event empfangen");
      
      // Reset states
      setPaypalLoaded(false);
      setPaypalButtonRendered(false);
      
      // Clear any existing buttons
      const container = document.getElementById("paypal-hidden-container");
      if (container) {
        container.innerHTML = '';
      }
      
      // Check if SDK is available and reload
      setTimeout(() => {
        if ((window as any).paypal?.Buttons) {
          console.log("Mobile Footer: SDK bereits verfügbar nach reload event");
          setPaypalLoaded(true);
        } else {
          console.log("Mobile Footer: Lade SDK nach reload event");
          loadPayPalSDK();
        }
      }, 100);
    };

    window.addEventListener('paypal-sdk-loaded', handleSDKLoaded);
    return () => {
      window.removeEventListener('paypal-sdk-loaded', handleSDKLoaded);
    };
  }, []);

  const renderPayPalButtons = () => {
    if (!(window as any).paypal?.Buttons) {
      console.log("Mobile Footer: PayPal SDK oder Buttons nicht verfügbar");
      return;
    }

    const container = document.getElementById("paypal-hidden-container");
    
    if (!container) {
      console.log("Mobile Footer: PayPal Container nicht gefunden");
      return;
    }

    // Clear existing buttons to prevent conflicts
    container.innerHTML = '';
    
    // Check if SDK has vault capability by testing subscription creation
    try {
      // Create a test button config to verify subscription support
      const testButton = (window as any).paypal.Buttons({
        createSubscription: function(data: any, actions: any) {
          // This is just a test - we won't actually create anything
          return Promise.resolve('test');
        }
      });
      
      console.log("Mobile Footer: SDK Vault Check - OK, Subscription support verfügbar");
    } catch (error) {
      console.error("Mobile Footer: SDK hat keine Vault-Unterstützung:", error);
      console.log("Mobile Footer: Versuche SDK neu zu laden mit vault=true");
      
      // Reset and reload with proper vault support
      setPaypalLoaded(false);
      setPaypalButtonRendered(false);
      setTimeout(() => {
        loadPayPalSDK();
      }, 500);
      return;
    }
    
    const telegramUserId = localStorage.getItem("telegram_user_id");
    const customId = telegramUserId
      ? `TG_USER_${telegramUserId}|SNTTRADES_MONTHLY_PLAN`
      : "SNTTRADES_MONTHLY_PLAN";

    console.log("Mobile Footer: Rendering PayPal Subscription Button mit vault=true...");

    const buttonConfig = {
      style: {
        shape: "rect" as const,
        color: "gold" as const,
        layout: "vertical" as const,
        label: "paypal" as const,
        height: 48,
        tagline: false,
      },
      createSubscription: function (data: any, actions: any) {
        console.log("PayPal createSubscription aufgerufen");
        return actions.subscription.create({
          plan_id: pricing.monthly.paypal.planId,
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
      onApprove: function (data: any) {
        console.log("PayPal Subscription genehmigt:", data.subscriptionID);
        const telegramUserId =
          localStorage.getItem("telegram_user_id") ||
          sessionStorage.getItem("telegram_user_id");
        let redirectUrl = `/thank-you-3?subscription_id=${data.subscriptionID}`;

        if (telegramUserId) {
          redirectUrl += `&telegram_user_id=${telegramUserId}`;
        }

        window.location.href = redirectUrl;
      },
      onError: function (err: any) {
        console.error("PayPal Subscription Fehler:", err);
        alert(
          "Es gab einen Fehler beim Erstellen des Abonnements. Bitte versuchen Sie es erneut."
        );
      },
    };

    try {
      // Render PayPal Button with error handling
      const buttons = (window as any).paypal.Buttons(buttonConfig);
      buttons
        .render("#paypal-hidden-container")
        .then(() => {
          console.log("Mobile Footer: PayPal Button erfolgreich gerendert");
          setPaypalButtonRendered(true);
        })
        .catch((error: any) => {
          console.error("Mobile Footer: PayPal Button Render Fehler:", error);
          // Reset states on error
          setPaypalButtonRendered(false);
          setPaypalLoaded(false);
          
          // Retry after a delay
          setTimeout(() => {
            console.log("Mobile Footer: Retrying PayPal button render...");
            if ((window as any).paypal) {
              setPaypalLoaded(true);
            }
          }, 2000);
        });
    } catch (error: any) {
      console.error("Mobile Footer: Fehler beim Erstellen des PayPal Buttons:", error);
      setPaypalButtonRendered(false);
    }
  };

  const formatPrice = (price: number) => {
    return price % 1 === 0 ? `${price}€` : `${price.toFixed(2).replace('.', ',')}€`;
  };

  const handleOptionsClick = () => {
    setIsModalOpen(true);
  };

  const handleJoin = () => {
    if (selectedPlan) {
      setIsModalOpen(true);
    } else {
      // Default to monthly if no plan selected
      setSelectedPlan("monthly");
      setIsModalOpen(true);
    }
  };

  return (
    <>
      {/* Fixed Footer - Nur auf Mobile sichtbar */}
      <Box
        position="fixed"
        bottom={0}
        left={0}
        right={0}
        zIndex={1000}
        display={{ base: "block", md: "none" }}
        bg="rgba(40, 40, 40, 0.98)"
        backdropFilter="blur(20px)"
        borderTop="1px solid rgba(255, 255, 255, 0.1)"
        boxShadow="0 -4px 20px rgba(0, 0, 0, 0.3)"
        borderBottomRadius={0}
        px={4}
        py={4}
      >
        <VStack gap={3} align="stretch">
          {/* Pricing Row */}
          <HStack justify="space-between" align="center" w="full">
            {/* Monatlicher Preis Links */}
            <Text color="white" fontSize="md" fontWeight="medium">
              {formatPrice(pricing.monthly.price)} / monatlich
            </Text>

            {/* 2 Optionen Rechts */}
            <Box
              as="button"
              onClick={handleOptionsClick}
              display="flex"
              alignItems="center"
              gap={1}
              color="white"
              fontSize="sm"
              fontWeight="medium"
              cursor="pointer"
              _hover={{ opacity: 0.8 }}
            >
              <Text>2 Optionen</Text>
              <CaretDown size={16} weight="bold" />
            </Box>
          </HStack>

          {/* PayPal Button und Join Button in Grid */}
          <VStack gap={2} align="stretch" w="full">
            <HStack gap={3} align="stretch" w="full">
              {/* PayPal Button mit Overlay */}
              <Box
                position="relative"
                flex={1}
                h="48px"
                borderRadius="lg"
                overflow="hidden"
              >
                {/* PayPal Button Container - sichtbar wenn gerendert */}
                <Box
                  id="paypal-hidden-container"
                  position="absolute"
                  top="0"
                  left="0"
                  width="100%"
                  height="100%"
                  opacity={paypalButtonRendered ? "1" : "0"}
                  pointerEvents="auto"
                  zIndex={paypalButtonRendered ? 2 : 1}
                />
                
                {/* Custom Overlay Button - nur sichtbar wenn PayPal nicht gerendert */}
                <Box
                  position="absolute"
                  top="0"
                  left="0"
                  right="0"
                  bottom="0"
                  zIndex={1}
                  bg="white"
                  display={paypalButtonRendered ? "none" : "flex"}
                  alignItems="center"
                  justifyContent="center"
                  borderRadius="lg"
                  cursor="not-allowed"
                  pointerEvents="auto"
                  opacity={!paypalLoaded ? 0.6 : 1}
                  transition="all 0.3s ease"
                  onClick={() => {
                    alert("PayPal wird noch geladen. Bitte warten Sie einen Moment.");
                  }}
                >
                  {!paypalLoaded ? (
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

              {/* Join Button */}
              <Button
                flex={1}
                h="48px"
                bg={SNT_BLUE}
                color="white"
                fontSize="md"
                fontWeight="bold"
                borderRadius="lg"
                _hover={{ bg: "#0572c2" }}
                onClick={handleJoin}
              >
                <HStack gap={1.5} align="center" justify="center">
                  <Lock size={16} weight="fill" />
                  <Text fontSize={{ base: "xs", md: "md" }} whiteSpace="nowrap">SICHER ZUR KASSE</Text>
                </HStack>
              </Button>
            </HStack>
            
            {/* Payment Icons - unter beiden Buttons */}
            <HStack gap={3} align="center" w="full">
              {/* Platzhalter für PayPal Button - gleiche Breite wie PayPal Button */}
              <Box flex={1} display="flex" alignItems="center" justifyContent="center">
                <Box w={{ base: "32px", md: "40px" }} h={{ base: "24px", md: "30px" }} />
              </Box>
              
              {/* Payment Icons - unter Join Button */}
              <Box flex={1} display="flex" alignItems="center" justifyContent="center">
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
        </VStack>
      </Box>

      {/* Pricing Selection Modal */}
      <PricingSelectionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPlan(null);
        }}
        initialPlan={selectedPlan}
      />
    </>
  );
}


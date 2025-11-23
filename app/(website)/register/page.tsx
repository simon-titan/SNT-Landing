"use client";

import { useState, useEffect } from "react";
import {
  Box,
  VStack,
  Heading,
  Text,
  Center,
  Button,
  Stack,
  HStack,
  SimpleGrid,
  Container,
  Icon,
} from "@chakra-ui/react";
import { Section } from "@/components/layout/section";
import SntHero from "@/components/hero/snt-hero";
import {
  CheckCircle,
  ShieldCheck,
  Lightning,
  EnvelopeSimple,
  BookOpen,
  Wrench,
  ChatsCircle,
  Timer,
} from "@phosphor-icons/react/dist/ssr";
import { FiTrendingDown, FiAlertTriangle, FiBarChart2, FiThumbsUp, FiShield, FiArrowDown, FiVideo, FiFileText, FiMessageSquare, FiTool, FiCheckCircle } from 'react-icons/fi';
import { useRouter } from "next/navigation";
import { BrandedVimeoPlayer } from "@/components/ui/BrandedVimeoPlayer";
import { ResultsMarquee } from "@/components/ui/ResultsMarquee";
import { ReviewMarquee } from "@/components/ui/ReviewMarquee";
import Link from "next/link";

const SNT_BLUE = "#068CEF";
const SNT_YELLOW = "rgba(251, 191, 36, 1)";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ minutes: 10, seconds: 0 });
  const router = useRouter();
  
  // EINFACHE E-Mail-Erfassung: Nur bei tatsächlicher Eingabe im Input-Feld
  const captureEmailOnInput = () => {
    // Einfacher Event-Listener für E-Mail-Inputs
    const handleEmailInput = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target && (target.type === 'email' || target.name === 'Person.Email' || target.name?.includes('Email'))) {
        const email = target.value?.trim();
        if (email && email.includes('@') && email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
          // Speichere E-Mail in unabhängiger Variable
          localStorage.setItem('sntRegistrationEmail', email);
          console.log('✅ E-Mail gespeichert:', email);
        }
      }
    };
    
    // Event-Listener auf Document-Level (funktioniert auch für dynamisch geladene Modals)
    document.addEventListener('input', handleEmailInput, true);
    document.addEventListener('change', handleEmailInput, true);
    
    console.log('✅ E-Mail-Erfassung aktiviert');
    
    // Cleanup-Funktion zurückgeben
    return () => {
      document.removeEventListener('input', handleEmailInput, true);
      document.removeEventListener('change', handleEmailInput, true);
    };
  };

  useEffect(() => {
    // Progress Animation
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const getExpiryTimestamp = () => {
      let expiry = localStorage.getItem("countdownExpiry");
      if (!expiry) {
        expiry = (Date.now() + 10 * 60 * 1000).toString();
        localStorage.setItem("countdownExpiry", expiry);
      }
      return parseInt(expiry, 10);
    };

    const expiryTimestamp = getExpiryTimestamp();

    const interval = setInterval(() => {
      const now = Date.now();
      const distance = expiryTimestamp - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft({ minutes: 0, seconds: 0 });
        localStorage.removeItem("countdownExpiry");
      } else {
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft({ minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // EINFACHE E-Mail-Erfassung: Nur bei tatsächlicher Eingabe
    const cleanup = captureEmailOnInput();
    
    return cleanup;
    
    // Outseta Widget laden
    const script = document.createElement("script");
    script.src = "https://cdn.outseta.com/assets/build/js/widget.js";
    script.async = true;
    script.onload = () => {
      // Widget initialisieren mit expliziter Redirect-URL
      if (typeof window !== 'undefined' && (window as any).Outseta) {
        const thankYouUrl = `${window.location.origin}/thank-you-3`;
        (window as any).Outseta.init({
          auth: {
            postRegistrationUrl: thankYouUrl
          }
        });
        console.log('✅ Outseta Widget initialisiert');
      }
    };
    document.head.appendChild(script);

    // EINFACHE E-Mail-Extraktion: Nur aus Input-Feld
    const getEmailFromInput = (): string | null => {
      const emailInput = document.querySelector('input[name="Person.Email"], input[type="email"]') as HTMLInputElement;
      if (emailInput && emailInput.value) {
        const email = emailInput.value.trim();
        if (email.includes('@') && email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
          return email;
        }
      }
      return null;
    };
    
    // Alte Funktion entfernt - nicht mehr benötigt
    const extractEmailFromWidget = (): string | null => {
      // Strategie 1: Suche im gesamten Document (nicht nur in widgetContainer, da Modal außerhalb sein kann)
      const emailSelectors = [
        'input[type="email"]',
        'input[name*="email" i]', // case-insensitive
        'input[name*="Email"]',
        'input[name="Person.Email"]', // Spezifisch für Outseta
        'input[id*="email" i]',
        'input[autocomplete="email"]'
      ];
      
      for (const selector of emailSelectors) {
        const inputs = document.querySelectorAll(selector);
        for (const input of Array.from(inputs)) {
          const value = (input as HTMLInputElement).value?.trim();
          if (value && value.includes('@') && value.length > 5 && value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            console.log('E-Mail gefunden via Selector:', selector, value);
            return value;
          }
        }
      }

      // Strategie 2: Suche in Outseta Modal (falls vorhanden)
      const outsetaModal = document.querySelector('[data-outseta-modal], .outseta-modal, [class*="outseta"], [id*="outseta"]');
      if (outsetaModal) {
        const modalInputs = outsetaModal.querySelectorAll('input[type="email"], input[name*="email" i], input[name*="Email"]');
        for (const input of Array.from(modalInputs)) {
          const value = (input as HTMLInputElement).value?.trim();
          if (value && value.includes('@') && value.length > 5 && value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            console.log('E-Mail gefunden in Outseta Modal:', value);
            return value;
          }
        }
      }

      // Strategie 3: Suche in widgetContainer (falls vorhanden)
      const widgetContainer = document.getElementById('outseta-widget-container');
      if (widgetContainer) {
        const containerInputs = widgetContainer.querySelectorAll('input[type="email"], input[name*="email" i], input[name*="Email"]');
        for (const input of Array.from(containerInputs)) {
          const value = (input as HTMLInputElement).value?.trim();
          if (value && value.includes('@') && value.length > 5 && value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            console.log('E-Mail gefunden in Widget Container:', value);
            return value;
          }
        }
      }

      // Strategie 4: Aus Outseta Event-Daten extrahieren (falls verfügbar)
      if ((window as any).Outseta?.lastSubmittedEmail) {
        console.log('E-Mail gefunden in Outseta.lastSubmittedEmail:', (window as any).Outseta.lastSubmittedEmail);
        return (window as any).Outseta.lastSubmittedEmail;
      }

      return null;
    };

    // MutationObserver für Widget-Änderungen
    let emailObserver: MutationObserver | null = null;
    const setupEmailObserver = () => {
      const widgetContainer = document.getElementById('outseta-widget-container');
      if (!widgetContainer) return;

      // MutationObserver nicht mehr benötigt - E-Mail wird über Input-Events erfasst

      emailObserver.observe(widgetContainer, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['value']
      });
    };

    // Success Handler für Registrierung - ABFANGEN VOR OUTSETA REDIRECT
    const handleOutsetaSuccess = async (event: MessageEvent) => {
      if (event.data && event.data.type === 'outseta_success') {
        console.log('🎉 Outseta Success Event erhalten:', event.data);
        
        // KRITISCH: E-Mail SOFORT extrahieren und speichern, bevor irgendetwas anderes passiert
        let email: string | null = null;
        
        // Strategie 1: E-Mail aus Event-Daten extrahieren (höchste Priorität)
        email = event.data.email || event.data.user?.email || event.data.person?.email || event.data.Email || event.data.Person?.Email;
        if (email) {
          console.log('✅ E-Mail aus Event-Daten:', email);
        }
        
        // EINFACH: Verwende die E-Mail aus unserer unabhängigen Variable (wird beim Eingeben gespeichert)
        const storedEmail = localStorage.getItem('sntRegistrationEmail');
        const finalEmail = email || storedEmail || getEmailFromInput();
        
        console.log('📧 E-Mail für Weiterleitung:', finalEmail);

        // Weiterleitung - VERHINDERE OUTSETA REDIRECT
        event.stopPropagation();
        event.preventDefault();
        handleSuccess(finalEmail || undefined);
      }
    };

    // Event Listener mit capture für frühes Abfangen
    window.addEventListener('message', handleOutsetaSuccess, true);
    
    // ROBUSTER Redirect-Interceptor: Abfangen von Outseta Redirects
    let lastUrl = window.location.href;
    let checkUrlChangeInterval: NodeJS.Timeout | null = null;
    
    // Interceptiere window.location Änderungen
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    const interceptNavigation = (url: string) => {
      if (url && url.includes('/thank-you') && !url.includes('/thank-you-3')) {
        console.log('🛡️ Redirect zu /thank-you erkannt - korrigiere zu /thank-you-3');
        
        // EINFACH: Verwende die E-Mail aus unserer unabhängigen Variable
        const email = localStorage.getItem('sntRegistrationEmail');
        
        const newUrl = email 
          ? `/thank-you-3?email=${encodeURIComponent(email)}`
          : '/thank-you-3';
        console.log('🔄 Korrigierter Redirect:', newUrl);
        return newUrl;
      }
      return url;
    };
    
    history.pushState = function(...args) {
      const url = args[2] as string;
      if (url) {
        const correctedUrl = interceptNavigation(url);
        if (correctedUrl !== url) {
          args[2] = correctedUrl;
        }
      }
      return originalPushState.apply(history, args);
    };
    
    history.replaceState = function(...args) {
      const url = args[2] as string;
      if (url) {
        const correctedUrl = interceptNavigation(url);
        if (correctedUrl !== url) {
          args[2] = correctedUrl;
        }
      }
      return originalReplaceState.apply(history, args);
    };
    
    // Zusätzlich: Polling für window.location Änderungen (Fallback)
    checkUrlChangeInterval = setInterval(() => {
      const currentUrl = window.location.href;
      if (currentUrl !== lastUrl && currentUrl.includes('/thank-you') && !currentUrl.includes('/thank-you-3')) {
        console.log('🛡️ URL-Änderung zu /thank-you erkannt - korrigiere zu /thank-you-3');
        
        // EINFACH: Verwende die E-Mail aus unserer unabhängigen Variable
        const email = localStorage.getItem('sntRegistrationEmail');
        
        const newUrl = email 
          ? `/thank-you-3?email=${encodeURIComponent(email)}`
          : '/thank-you-3';
        console.log('🔄 Korrigierter Redirect (URL-Change):', newUrl);
        window.location.replace(newUrl);
        if (checkUrlChangeInterval) {
          clearInterval(checkUrlChangeInterval);
        }
      }
      lastUrl = currentUrl;
    }, 50); // Häufiger prüfen für schnelleres Abfangen

    // E-Mail wird bereits über captureEmailOnInput() erfasst - keine weitere Initialisierung nötig

    return () => {
      if (script.parentNode) {
        document.head.removeChild(script);
      }
      window.removeEventListener('message', handleOutsetaSuccess, true);
      if (emailObserver) {
        emailObserver.disconnect();
      }
      if (checkUrlChangeInterval) {
        clearInterval(checkUrlChangeInterval);
      }
      // Stelle originale History-Methoden wieder her
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, []);

  const handleSuccess = (email?: string) => {
    setIsLoading(true);
    
    // EINFACH: Verwende die E-Mail aus unserer unabhängigen Variable
    const finalEmail = email || localStorage.getItem('sntRegistrationEmail');
    
    // Kurze Verzögerung für UX
    setTimeout(() => {
      const url = finalEmail 
        ? `/thank-you-3?email=${encodeURIComponent(finalEmail)}`
        : '/thank-you-3';
      console.log('🚀 Weiterleitung zu:', url, 'mit E-Mail:', finalEmail || 'keine');
      router.push(url);
    }, 1500);
  };

  return (
    <>
      <Box
        id="register-page"
        position="relative"
        bg="white"
        _before={{
          content: '""',
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(60% 40% at 50% -10%, rgba(16,185,129,0.18), rgba(0,0,0,0) 70%),radial-gradient(40% 30% at 85% 0%, rgba(34,197,94,0.12), rgba(0,0,0,0) 65%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
        _after={{
          content: '""',
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "28px 28px, 28px 28px",
          backgroundPosition: "center",
          opacity: 0.35,
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
      {/* Neuer Hero nach Vorlage (SNT, schwarzer Raum, grüner Glow) */}
      <SntHero timeLeft={timeLeft} />

        {/* Lokales Override: entferne Padding der generierten Klasse */}
        <style jsx>{`
          .css-qnbf9j {
            padding: 0 !important;
          }
        `}</style>

        {/* Vimeo Player Section - Replaced Section with Box/Container to remove padding */}
        <Box as="section" w="full" bg="white" py={{ base: 8, md: 12 }} position="relative" zIndex={1}>
           <Container maxW={{ base: "full", md: "3xl" }}>
                <VStack gap={8} maxW="none" mx="auto">
                    <Box
                      mt={{ base: "-16", md: "-24" }}
                      w={{ base: '100%', md: '800px', lg: '1200px', xl: '1400px' }} 
                      maxW="100%" 
                      mx="auto" 
                      mb={{ base: 4, md: 6 }}
                      bg={`linear-gradient(135deg, ${SNT_BLUE}, rgba(6, 140, 239, 0.8))`}
                      borderRadius="xl" 
                      p="7px"
                      position="relative"
                      boxShadow={`0 0 40px rgba(6, 140, 239, 0.4), 0 0 0 1px rgba(6, 140, 239, 0.5)`}
                    >
                      <VStack gap={3}>
                        <Box 
                          w="100%" 
                          aspectRatio={16/9} 
                          position="relative"
                          overflow="hidden"
                          bg="black"
                          borderRadius="lg"
                        >
                          <BrandedVimeoPlayer videoId="1139395784" />
                        </Box>
                        
                        {/* Community Stats Element */}
                        <Box 
                          p={{ base: 3.5, md: 4 }}
                          w="100%"
                          borderRadius="lg"
                          bg="rgba(0, 0, 0, 0.4)"
                          backdropFilter="blur(12px) saturate(180%)"
                          border={`1px solid rgba(6, 140, 239, 0.3)`}
                        >
                          <Stack 
                            direction="row" 
                            align="center" 
                            gap={{ base: 2, md: 3 }} 
                            justify="flex-start"
                            flexWrap="nowrap"
                          >
                            <Stack direction="row" gap={-2} flexShrink={0}>
                              <Box 
                                w={{ base: 5, md: 6 }} 
                                h={{ base: 5, md: 6 }} 
                                borderRadius="full" 
                                border={`2px solid ${SNT_BLUE}`} 
                                overflow="hidden"
                                bg="gray.200"
                                boxShadow="0 4px 8px rgba(0,0,0,0.1)"
                              >
                                <img 
                                  src="/assets/community-stats/user_6819319_6ec853ff-5777-4398-8fcc-06e2621cbcf8.avif" 
                                  alt="Community member"
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                              </Box>
                              <Box 
                                w={{ base: 5, md: 6 }} 
                                h={{ base: 5, md: 6 }}
                                borderRadius="full" 
                                border={`2px solid ${SNT_BLUE}`} 
                                overflow="hidden"
                                bg="gray.200"
                                boxShadow="0 4px 8px rgba(0,0,0,0.1)"
                              >
                                <img 
                                  src="/assets/community-stats/4208db19763848b131989eadba9899aa.avif" 
                                  alt="Community member"
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                              </Box>
                              <Box 
                                w={{ base: 5, md: 6 }} 
                                h={{ base: 5, md: 6 }}
                                borderRadius="full" 
                                border={`2px solid ${SNT_BLUE}`} 
                                overflow="hidden"
                                bg="gray.200"
                                boxShadow="0 4px 8px rgba(0,0,0,0.1)"
                              >
                                <img 
                                  src="/assets/community-stats/393d1b15978eed96285cf196b2f51eda.avif" 
                                  alt="Community member"
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                              </Box>
                            </Stack>
                            <Text 
                              fontSize={{ base: "2xs", md: "xs" }} 
                              color="white" 
                              textShadow="0 1px 2px rgba(0,0,0,0.3)"
                              textAlign="left"
                              lineHeight="tight"
                              flex="1"
                              minW={0}
                            >
                              ...Bereits über <Text as="span" fontWeight="bold">1000+ Trader</Text> auf ihrem Weg begleitet und ausgebildet.
                            </Text>
                          </Stack>
                        </Box>
                      </VStack>
                    </Box>
                </VStack>
            </Container>
         </Box>

        {/* Problem/Solution Section */}
        <Box as="section" w="full" py={{ base: 12, md: 16 }} px={4} bg="linear-gradient(360deg,rgba(6, 140, 239, 0.2) 0%, rgba(255, 255, 255, 1) 50%, rgba(255, 0, 0, 0.2) 100%)">
          <Container maxW="6xl">
            <VStack gap={{ base: 12, md: 16 }}>
              {/* Problems */}
              <VStack gap={4} w="full">
                <Heading as="h2" size="xl" color="black" textAlign="center">
                  Kommst du an deine
                  <Box
                    as="span"
                    color="black"
                    px="1.5"
                    mx="2"
                    borderRadius="xs"
                    bg="linear-gradient(90deg, rgba(239, 68, 68, 0.6), rgba(239, 68, 68, 0.22) 85%, rgba(239, 68, 68, 0) 100%)"
                  >
                   Grenzen?
                  </Box>
                </Heading>
                <Text color="gray.600" textAlign="center" maxW="2xl">
                  Die meisten Trader scheitern an denselben mentalen und strategischen Hürden. Hier sind die häufigsten Fallstricke:
                </Text>
              </VStack>
              <SimpleGrid columns={{ base: 1, md: 3 }} gap={{ base: 6, md: 8 }}>
                {[
                  { icon: FiAlertTriangle, title: "Emotionale Trades", text: "Angst und Gier führen zu unüberlegten Entscheidungen und Verlusten." },
                  { icon: FiTrendingDown, title: "Fehlende Strategie", text: "Ohne klaren Plan ist Trading reines Glücksspiel mit schlechten Quoten." },
                  { icon: FiBarChart2, title: "Falsches Risk-Management", text: "Ein einziger schlechter Trade kann wochenlange Gewinne ausradieren." },
                ].map((item, i) => (
                  <Box 
                    key={i} 
                    p={6} 
                    bg="rgba(255, 255, 255, 0.6)" 
                    borderRadius="xl" 
                    border="1px" 
                    borderColor="rgba(239, 68, 68, 0.4)"
                    backdropFilter="blur(12px) saturate(180%)"
                    boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
                  >
                    <HStack align="start" gap={4}>
                      <Box color="red.500" mt={1}><item.icon size={22} /></Box>
                      <VStack align="start" gap={1}>
                        <Text fontWeight="bold" color="black">{item.title}</Text>
                        <Text fontSize="sm" color="gray.700">{item.text}</Text>
                      </VStack>
                    </HStack>
                  </Box>
                ))}
              </SimpleGrid>

               {/* Arrow Down */}
               <Box color="gray.400" className="animation-bounce">
                 <FiArrowDown size={40} />
               </Box>
 
               {/* Solutions */}
               <VStack gap={4} w="full">
                <Heading as="h2" size="xl" color="black" textAlign="center">
                  <Box
                    as="span"
                    color="black"
                    px="1.5"
                    borderRadius="xs"
                    bg={`linear-gradient(90deg, ${SNT_BLUE} 0%, rgba(6, 140, 239, 0.22) 85%, rgba(6, 140, 239, 0) 100%)`}
                  >
                   Was wäre, wenn...
                  </Box>
                </Heading>
                <Text color="gray.600" textAlign="center" maxW="2xl">
                  ...du ein System hättest, das diese Probleme für dich löst und dir einen klaren Weg zum profitablen Trading aufzeigt?
                </Text>
              </VStack>
              <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={{ base: 5, md: 6 }}>
                {[
                  { icon: FiVideo, title: "Video-Lektionen", text: "Umfassende Lektionen, die dir jeden Schritt von A-Z beibringen." },
                  { icon: FiFileText, title: "Lernmaterialien", text: "Praxisnahe PDFs, Checklisten und Guides zum direkten Anwenden." },
                  { icon: FiMessageSquare, title: "Discord Community", text: "Tausche dich täglich mit Gleichgesinnten und den SNT-Coaches aus." },
                  { icon: FiTool, title: "Tools & Setups", text: "Erhalte Zugriff auf die gleichen Tools und Chart-Setups, die wir nutzen." },
                ].map((item, i) => (
                  <Box 
                    key={i} 
                    p={6} 
                    bg="rgba(255, 255, 255, 0.6)" 
                    borderRadius="xl" 
                    border="1px" 
                    borderColor="rgba(6, 140, 239, 0.4)"
                    backdropFilter="blur(12px) saturate(180%)"
                    boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
                  >
                     <HStack align="start" gap={4}>
                      <Box color={SNT_BLUE} mt={1}><item.icon size={22} /></Box>
                      <VStack align="start" gap={1}>
                        <Text fontWeight="bold" color="black">{item.title}</Text>
                        <Text fontSize="sm" color="gray.700">{item.text}</Text>
                      </VStack>
                    </HStack>
                  </Box>
                ))}
              </SimpleGrid>

                 {/* CTA Box */}
                 <Box 
                    mt={12} 
                    p={{ base: 8, md: 10 }} 
                    bg="rgba(255, 255, 255, 0.6)"
                    borderRadius="2xl" 
                    border="1px" 
                    borderColor="rgba(6, 140, 239, 0.4)" 
                    w="full" 
                    maxW="4xl" 
                    backdropFilter="blur(12px) saturate(180%)"
                    boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
                >
                     <VStack gap={5}>
                         <VStack gap={2}>
                            <Heading as="h3" size="lg" color="black" textAlign="center" fontWeight="medium">
                                Diese Transformation ist möglich – mit dem
                            </Heading>
                            <Heading as="h2" size="2xl" textTransform="uppercase" color="black" textAlign="center">
                                <Box as="span" color="black" px="2.5" py="1" borderRadius="md" bg={`linear-gradient(90deg, ${SNT_YELLOW} 0%, rgba(251, 191, 36,0.22) 85%, rgba(251, 191, 36,0) 100%)`}>
                                    SNT-Bootcamp
                                </Box>
                            </Heading>
                         </VStack>
                         <Text color="gray.700" textAlign="center">Starte jetzt und erlebe den Unterschied.</Text>
 
                         <Box
                             mt={4}
                             bg="gray.100"
                             borderRadius="full"
                             border="1px solid"
                             borderColor="gray.200"
                             px={{ base: 4, md: 5 }}
                             py={{ base: 2, md: 2.5 }}
                         >
                             <HStack gap={3}>
                                <Icon as={Timer} color={SNT_BLUE} boxSize={{ base: 5, md: 6 }} />
                                <Text fontSize={{ base: "xs", md: "sm" }} color="black" fontWeight="medium">
                                   Dein Platz ist reserviert für:{" "}
                                   <Text as="span" color={SNT_BLUE} fontWeight="bold">
                                      {String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
                                   </Text>
                                </Text>
                             </HStack>
                         </Box>

                         <Stack direction={{ base: "column", md: "row" }} gap={{ base: 2, md: 6 }} justify="center" mt={4} w={{ base: "full", md: "auto" }} align={{ base: "flex-start", md: "center" }}>
                             <HStack>
                                 <FiCheckCircle color={SNT_BLUE} />
                                 <Text fontSize="sm" color="gray.700">Keine Einrichtungsgebühr</Text>
                             </HStack>
                             <HStack>
                                 <FiCheckCircle color={SNT_BLUE} />
                                 <Text fontSize="sm" color="gray.700">Sofortiger Zugang</Text>
                             </HStack>
                             <HStack>
                                 <FiCheckCircle color={SNT_BLUE} />
                                 <Text fontSize="sm" color="gray.700">100% kostenlos</Text>
                             </HStack>
                         </Stack>
 
                         <Link
                              href={`https://seitennull---fzco.outseta.com/auth?widgetMode=register&planUid=wmjBBxmV&planPaymentTerm=month&skipPlanOptions=true&postRegistrationUrl=${encodeURIComponent(typeof window !== 'undefined' ? `${window.location.origin}/thank-you-3` : '/thank-you-3')}`}
                              data-outseta-modal-class="snt-outseta-modal"
                              onClick={(e) => {
                                console.log('Registrierungs-Link geklickt');
                              }}
                         >
                             <Button
                                 size="lg"
                                 mt={4}
                                 bg={SNT_BLUE}
                                 color="white"
                                 border="1px solid transparent"
                                 _hover={{ 
                                     bg: "#0572c2", 
                                 }}
                                 _active={{ 
                                     bg: "#0465b8", 
                                 }}
                                 transition="all 0.3s ease"
                             >
                                 Jetzt kostenlos registrieren
                             </Button>
                         </Link>
                     </VStack>
                 </Box>
            </VStack>
          </Container>
        </Box>

  {/* Results Marquee Banner */}
  <ResultsMarquee />
  <ReviewMarquee />

      </Box>
    </>
  );
} 
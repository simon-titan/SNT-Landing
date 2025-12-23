"use client";
import { Box, Button, VStack, Flex } from "@chakra-ui/react";
import { EnvelopeOpen, ArrowSquareOut } from "@phosphor-icons/react/dist/ssr";
import { Link } from "@/components/ui/link";
import Confetti from "@/components/ui/confetti";
import { EmptyState } from "@/components/ui/empty-state";
import { getCurrentPricing } from "@/config/pricing-config";
import {
  extractAffiliateCodeFromQuery,
  getPersistedAffiliateCode,
} from "@/lib/affiliate/affiliate-storage";
import { useEffect } from "react";

const SNT_BLUE = "#068CEF";

export default function ThankYouPage() {
  useEffect(() => {
    // E-Mail-Liste Registrierung verarbeiten
    const processEmailListSubscription = async () => {
      // Mehrere Quellen für E-Mail prüfen
      const urlParams = new URLSearchParams(window.location.search);
      const emailFromUrl = urlParams.get('email') || urlParams.get('Email') || urlParams.get('userEmail');
      const pendingEmail = localStorage.getItem('sntRegistrationEmail');
      
      // Versuche E-Mail aus Outseta-Session zu extrahieren
      let emailFromOutseta: string | null = null;
      try {
        if (typeof window !== 'undefined' && (window as any).Outseta) {
          const outseta = (window as any).Outseta;
          // Versuche verschiedene Wege
          if (outseta.user?.email) emailFromOutseta = outseta.user.email;
          else if (outseta.user?.Email) emailFromOutseta = outseta.user.Email;
          else if (outseta.lastSubmittedEmail) emailFromOutseta = outseta.lastSubmittedEmail;
          else if (outseta.auth) {
            try {
              const user = outseta.auth.getUser();
              emailFromOutseta = user?.email || user?.Email || null;
            } catch (e) {
              // Ignore
            }
          }
        }
      } catch (e) {
        console.warn('Fehler beim Extrahieren der E-Mail aus Outseta:', e);
      }
      
      // Versuche auch aus Cookies (falls Outseta E-Mail dort speichert)
      let emailFromCookies: string | null = null;
      try {
        const cookies = document.cookie.split(';');
        for (const cookie of cookies) {
          const [name, value] = cookie.trim().split('=');
          if (name && value && value.includes('@') && value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            emailFromCookies = decodeURIComponent(value);
            break;
          }
        }
      } catch (e) {
        // Ignore
      }
      
      // Versuche E-Mail aus Outseta localStorage (widget.auth.lastUser)
      let emailFromOutsetaStorage: string | null = null;
      try {
        const lastUserKey = 'widget.auth.lastUser';
        const lastUserData = localStorage.getItem(lastUserKey);
        if (lastUserData) {
          try {
            const userData = JSON.parse(lastUserData);
            emailFromOutsetaStorage = userData?.email || userData?.Email || userData?.Person?.Email;
          } catch (e) {
            // Nicht JSON, versuche als String zu parsen
            if (lastUserData.includes('@')) {
              const emailMatch = lastUserData.match(/([^\s@]+@[^\s@]+\.[^\s@]+)/);
              if (emailMatch) {
                emailFromOutsetaStorage = emailMatch[1];
              }
            }
          }
        }
      } catch (e) {
        console.warn('Fehler beim Extrahieren aus Outseta Storage:', e);
      }
      
      // E-Mail aus verschiedenen Quellen priorisieren
      const email = emailFromUrl || pendingEmail || emailFromOutseta || emailFromOutsetaStorage || emailFromCookies;
      
      console.log('E-Mail-Quellen geprüft:', {
        emailFromUrl,
        pendingEmail,
        emailFromOutseta,
        emailFromCookies,
        finalEmail: email
      });
      
      if (!email) {
        console.warn('Keine E-Mail-Adresse gefunden für E-Mail-Liste');
        console.log('URL:', window.location.href);
        console.log('localStorage keys:', Object.keys(localStorage));
        return;
      }

      // Validierung der E-Mail
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        console.error('Ungültige E-Mail-Adresse:', email);
        return;
      }

      // Mehrere Versuche mit Retry-Logik
      const maxRetries = 3;
      let retryCount = 0;

      const attemptSubscription = async (): Promise<boolean> => {
        try {
          const response = await fetch('/api/email-list/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email,
              emailListUid: 'L9Pw1jQJ',
              sendWelcomeEmail: false
            })
          });

          if (response.ok) {
            const data = await response.json();
            localStorage.removeItem('sntRegistrationEmail');
            return true;
          } else {
            const errorData = await response.json().catch(() => ({}));
            console.error('Fehler beim Hinzufügen zur E-Mail-Liste:', response.status, errorData);
            
            // Retry bei Server-Fehlern (nicht bei 400/404)
            if (response.status >= 500 && retryCount < maxRetries) {
              retryCount++;
              await new Promise(resolve => setTimeout(resolve, 2000 * retryCount));
              return attemptSubscription();
            }
            
            return false;
          }
        } catch (error) {
          console.error('Fehler bei E-Mail-Liste Registrierung:', error);
          
          // Retry bei Netzwerk-Fehlern
          if (retryCount < maxRetries) {
            retryCount++;
            await new Promise(resolve => setTimeout(resolve, 2000 * retryCount));
            return attemptSubscription();
          }
          
          return false;
        }
      };

      // Ersten Versuch nach 2 Sekunden starten (Account sollte erstellt sein)
      const timer = setTimeout(() => {
        attemptSubscription();
      }, 2000);
      
      return () => clearTimeout(timer);
    };
    
    processEmailListSubscription();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const urlParams = new URLSearchParams(window.location.search);
    const affiliateCodeFromQuery = extractAffiliateCodeFromQuery(urlParams);
    const affiliateCode = affiliateCodeFromQuery || getPersistedAffiliateCode();
    if (!affiliateCode) return;

    const sessionKey = `snt_affiliate_sale_${affiliateCode}`;
    if (sessionStorage.getItem(sessionKey)) return;

    const source = urlParams.get("source") || "";
    const explicitProvider = urlParams.get("provider") || "";
    const explicitProduct = urlParams.get("product") || "";

    const provider =
      explicitProvider ||
      (source.toLowerCase().includes("paypal") ? "paypal" : "outseta");
    const product =
      explicitProduct === "lifetime"
        ? "lifetime"
        : explicitProduct === "monthly"
        ? "monthly"
        : source.toLowerCase().includes("lifetime")
        ? "lifetime"
        : "monthly";

    const pricing = getCurrentPricing();
    const amount =
      product === "lifetime" ? pricing.lifetime.price : pricing.monthly.price;

    const metadata = {
      source,
      transactionId:
        urlParams.get("transaction_id") ||
        urlParams.get("subscription_id") ||
        urlParams.get("order_id") ||
        null,
    };

    const saleDate = urlParams.get("sale_date") ?? undefined;

    (async () => {
      try {
        const response = await fetch("/api/affiliates/track", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            affiliateCode,
            provider,
            product,
            amount,
            currency: "EUR",
            metadata,
            saleDate,
          }),
        });

        if (response.ok) {
          sessionStorage.setItem(sessionKey, new Date().toISOString());
        } else {
          console.error(
            "Affiliate tracking failed",
            response.status,
            await response.text()
          );
        }
      } catch (error) {
        console.error("Affiliate tracking error", error);
      }
    })();
  }, []);

  return (
    <>
      <Confetti type="fireworks" colors={[SNT_BLUE, "#42a5f5", "#add8e6"]} />
      <Flex
        align="center"
        justify="center"
        h="100vh"
        w="100vw"
      >
        <VStack p="4">
          <EmptyState
            icon={<EnvelopeOpen />}
            title="Du hast es fast geschafft!"
            description="Wir haben dir eine E-Mail geschickt, du musst nur noch dein Passwort setzen, prüfe bitte auch deinen Spam-Ordner."
          >
            <a href="https://www.snt-mentorship-platform.de" target="_blank" rel="noopener noreferrer">
              <Button
                  mt={6}
                  bg={SNT_BLUE}
                  color="white"
                  _hover={{ bg: "#0572c2" }}
              >
                  ZUM BOOTCAMP
              </Button>
            </a>
          </EmptyState>
        </VStack>
      </Flex>
    </>
  );
}

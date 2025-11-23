"use client";
import { Box, Button, VStack, Flex } from "@chakra-ui/react";
import { EnvelopeOpen, ArrowSquareOut } from "@phosphor-icons/react/dist/ssr";
import { Link } from "@/components/ui/link";
import Confetti from "@/components/ui/confetti";
import { EmptyState } from "@/components/ui/empty-state";
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
            
            // Erfolgs-Notification
            const notification = document.createElement('div');
            notification.innerHTML = '✅ Du wurdest zur E-Mail-Liste hinzugefügt!';
            notification.style.cssText = `
              position: fixed; 
              top: 20px; 
              right: 20px; 
              background: #10B981; 
              color: white; 
              padding: 12px 20px; 
              border-radius: 8px; 
              z-index: 9999;
              font-weight: bold;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            `;
            document.body.appendChild(notification);
            
            setTimeout(() => {
              if (document.body.contains(notification)) {
                document.body.removeChild(notification);
              }
            }, 5000);
            
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

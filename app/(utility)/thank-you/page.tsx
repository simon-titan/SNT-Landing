"use client";
import { Box, Button, VStack, AbsoluteCenter } from "@chakra-ui/react";
import { EnvelopeOpen, ArrowSquareOut } from "@phosphor-icons/react/dist/ssr";
import { Link } from "@/components/ui/link";
import Confetti from "@/components/ui/confetti";
import { EmptyState } from "@/components/ui/empty-state";
import { useEffect } from "react";

export default function ThankYouPage() {
  useEffect(() => {
    // E-Mail-Liste Registrierung verarbeiten
    const processEmailListSubscription = async () => {
      const pendingEmail = localStorage.getItem('pendingEmailSubscription');
      const urlParams = new URLSearchParams(window.location.search);
      const emailFromUrl = urlParams.get('email');
      
      const email = pendingEmail || emailFromUrl;
      
      if (email) {
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
            localStorage.removeItem('pendingEmailSubscription');
            
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
            `;
            document.body.appendChild(notification);
            
            setTimeout(() => {
              if (document.body.contains(notification)) {
                document.body.removeChild(notification);
              }
            }, 5000);
          }
        } catch (error) {
          // Stille Fehlerbehandlung
        }
      }
    };
    
    // Verarbeitung nach 2 Sekunden (Account sollte erstellt sein)
    const timer = setTimeout(processEmailListSubscription, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Confetti type="fireworks" />
      <Box p="relative" h="100vh" w="100vw">
        <AbsoluteCenter>
          <VStack>
            <EmptyState
              icon={<EnvelopeOpen />}
              title="Du hast es fast geschafft!"
              description="Wir haben dir eine E-Mail geschickt, du musst nur noch dein Passwort setzen, prüfe bitte auch deinen Spam-Ordner."
            >
           
            </EmptyState>
          </VStack>
        </AbsoluteCenter>
      </Box>
    </>
  );
}

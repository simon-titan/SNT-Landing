"use client";
import { Box, VStack, AbsoluteCenter } from "@chakra-ui/react";
import { EnvelopeOpen } from "@phosphor-icons/react/dist/ssr";
import Confetti from "@/components/ui/confetti";
import { EmptyState } from "@/components/ui/empty-state";
import { useEffect } from "react";
export default function ThankYouPage() {
    useEffect(() => {
        // Redirect zu thank-you-3 falls auf thank-you gelandet
        const urlParams = new URLSearchParams(window.location.search);
        const emailFromUrl = urlParams.get('email') || urlParams.get('Email');
        const pendingEmail = localStorage.getItem('pendingEmailSubscription');
        const email = emailFromUrl || pendingEmail;
        // Redirect zu thank-you-3 mit E-Mail
        const redirectUrl = email
            ? `/thank-you-3?email=${encodeURIComponent(email)}`
            : '/thank-you-3';
        console.log('Redirect von /thank-you zu /thank-you-3');
        window.location.replace(redirectUrl);
        return;
        // E-Mail-Liste Registrierung verarbeiten
        const processEmailListSubscription = async () => {
            // Mehrere Quellen für E-Mail prüfen
            const urlParams = new URLSearchParams(window.location.search);
            const emailFromUrl = urlParams.get('email');
            const pendingEmail = localStorage.getItem('sntRegistrationEmail');
            // Versuche E-Mail aus Outseta-Session zu extrahieren
            let emailFromOutseta = null;
            try {
                if (typeof window !== 'undefined' && window.Outseta) {
                    const outseta = window.Outseta;
                    // Versuche verschiedene Wege
                    if (outseta.user?.email)
                        emailFromOutseta = outseta.user.email;
                    else if (outseta.user?.Email)
                        emailFromOutseta = outseta.user.Email;
                    else if (outseta.lastSubmittedEmail)
                        emailFromOutseta = outseta.lastSubmittedEmail;
                    else if (outseta.auth) {
                        try {
                            const user = outseta.auth.getUser();
                            emailFromOutseta = user?.email || user?.Email || null;
                        }
                        catch (e) {
                            // Ignore
                        }
                    }
                }
            }
            catch (e) {
                console.warn('Fehler beim Extrahieren der E-Mail aus Outseta:', e);
            }
            // E-Mail aus verschiedenen Quellen priorisieren
            const email = emailFromUrl || pendingEmail || emailFromOutseta;
            if (!email) {
                console.warn('Keine E-Mail-Adresse gefunden für E-Mail-Liste');
                console.log('Geprüfte Quellen:', { emailFromUrl, pendingEmail, emailFromOutseta });
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
            const attemptSubscription = async () => {
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
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            `;
                        document.body.appendChild(notification);
                        setTimeout(() => {
                            if (document.body.contains(notification)) {
                                document.body.removeChild(notification);
                            }
                        }, 5000);
                        return true;
                    }
                    else {
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
                }
                catch (error) {
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
    return (<>
      <Confetti type="fireworks"/>
      <Box p="relative" h="100vh" w="100vw">
        <AbsoluteCenter>
          <VStack>
            <EmptyState icon={<EnvelopeOpen />} title="Du hast es fast geschafft!" description="Wir haben dir eine E-Mail geschickt, du musst nur noch dein Passwort setzen, prüfe bitte auch deinen Spam-Ordner.">
           
            </EmptyState>
          </VStack>
        </AbsoluteCenter>
      </Box>
    </>);
}

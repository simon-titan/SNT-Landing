"use client";
import { Box, Button, VStack, AbsoluteCenter } from "@chakra-ui/react";
import { EnvelopeOpen, ArrowSquareOut } from "@phosphor-icons/react/dist/ssr";
import { Link } from "@/components/ui/link";
import Confetti from "@/components/ui/confetti";
import { EmptyState } from "@/components/ui/empty-state";
import { useEffect } from "react";

export default function ThankYouPage() {
  
  useEffect(() => {
    const triggerTelegramBot = async () => {
      try {
        // Versuche Telegram User ID aus URL Parametern zu holen
        const urlParams = new URLSearchParams(window.location.search);
        const telegramUserId = urlParams.get('telegram_user_id') || 
                               localStorage.getItem('telegram_user_id') ||
                               sessionStorage.getItem('telegram_user_id');

        if (telegramUserId) {
          const response = await fetch('/api/telegram/success', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              telegramUserId: parseInt(telegramUserId),
              timestamp: new Date().toISOString()
            }),
          });

          if (response.ok) {
            console.log('Telegram Bot erfolgreich benachrichtigt');
          } else {
            console.error('Fehler beim Benachrichtigen des Telegram Bots');
          }
        }
      } catch (error) {
        console.error('Fehler beim Triggern des Telegram Bots:', error);
      }
    };

    // Trigger Bot nach kurzem Delay
    const timer = setTimeout(triggerTelegramBot, 2000);
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
              description="Wir haben dir eine E-Mail geschickt, um deine Anmeldung für das SNT-Mentorship abzuschließen und dein Passwort zu setzen. Solltest du keine E-Mail erhalten haben, prüfe bitte auch deinen Spam-Ordner."
            >
           
            </EmptyState>
          </VStack>
        </AbsoluteCenter>
      </Box>
    </>
  );
}

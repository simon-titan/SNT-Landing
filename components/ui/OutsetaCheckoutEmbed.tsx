"use client";

import { useEffect, useState } from "react";
import { Box, Text } from "@chakra-ui/react";

interface OutsetaCheckoutEmbedProps {
  planUid: string;
  planPaymentTerm: "month" | "quarter" | "annual" | "oneTime";
  productSlug: string; // Für Thank-You-Redirect
  containerId?: string; // Optional für benutzerdefinierte Container-ID
}

export function OutsetaCheckoutEmbed({
  planUid,
  planPaymentTerm,
  productSlug,
  containerId = "outseta-checkout-container"
}: OutsetaCheckoutEmbedProps) {
  const [isClient, setIsClient] = useState(false);
  const [isOutsetaReady, setIsOutsetaReady] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const checkOutseta = () => {
      if (typeof window === "undefined") return;

      const outseta = (window as any).Outseta;
      if (outseta) {
        setIsOutsetaReady(true);
        console.log(`✅ Outseta ist bereit für ${productSlug} Checkout Embed`);
      } else {
        // Warte nochmal
        setTimeout(checkOutseta, 100);
      }
    };

    checkOutseta();
  }, [isClient, productSlug]);

  // Fallback: Programmatisches Laden mit Outseta.auth.open()
  useEffect(() => {
    if (!isClient || !isOutsetaReady) return;

    const container = document.getElementById(containerId);
    if (!container) return;

    // Prüfen ob das Data-Attribute bereits von Outseta verarbeitet wurde
    const existingAuth = container.querySelector('[data-o-auth="1"]');
    if (existingAuth) return; // Data-Attribute funktionieren bereits

    // Fallback: Programmatisch laden
    console.log(`🔄 Fallback: Lade ${productSlug} Checkout programmatisch`);
    const outseta = (window as any).Outseta;
    if (outseta && outseta.auth && outseta.auth.open) {
      try {
        outseta.auth.open({
          mode: 'embed',
          selector: `#${containerId}`,
          widgetMode: 'register',
          planUid: planUid,
          planPaymentTerm: planPaymentTerm,
          skipPlanOptions: true
        });
      } catch (error) {
        console.error('❌ Fehler beim Laden des Outseta Embeds:', error);
      }
    }
  }, [isClient, isOutsetaReady, containerId, planUid, planPaymentTerm, productSlug]);

  if (!isClient) {
    return null;
  }

  if (!isOutsetaReady) {
    return (
      <Box
        id={containerId}
        bg="white"
        borderRadius="xl"
        p={6}
        border="1px solid"
        borderColor="gray.200"
        w="full"
        minW={0}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minH="200px"
      >
        <Text color="gray.600" fontSize="sm">Lade Checkout...</Text>
      </Box>
    );
  }

  // Data-Attribute Ansatz (primär)
  return (
    <Box
      id={containerId}
      bg="white"
      borderRadius="xl"
      p={4}
      border="1px solid"
      borderColor="gray.200"
      w="full"
      minW={0}
      display="flex"
      flexDirection="column"
      overflow="hidden"
    >
      <div
        data-o-auth="1"
        data-mode="embed"
        data-widget-mode="register"
        data-plan-uid={planUid}
        data-plan-payment-term={planPaymentTerm}
        data-skip-plan-options="true"
        style={{
          width: "100%",
          minHeight: "400px", // Fallback für Ladezustand
          flex: 1,
          display: "flex",
          flexDirection: "column"
        }}
      />
    </Box>
  );
}
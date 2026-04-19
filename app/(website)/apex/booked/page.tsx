"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Box, VStack, HStack, Heading, Text, Button } from "@chakra-ui/react";
import NextLink from "next/link";
import { keyframes } from "@emotion/react";
import { CheckCircle, Calendar, ArrowRight, Envelope, Clock } from "@phosphor-icons/react/dist/ssr";
import { ApprovedIcon } from "@/components/ui/approved-icon";

const SNT_PURPLE = "#8B5CF6";

const fadeIn = keyframes({
  from: { opacity: 0, transform: "translateY(20px)" },
  to: { opacity: 1, transform: "translateY(0)" },
});

const scalePop = keyframes({
  "0%": { transform: "scale(0.5)", opacity: 0 },
  "70%": { transform: "scale(1.1)" },
  "100%": { transform: "scale(1)", opacity: 1 },
});

const glowPulse = keyframes({
  "0%, 100%": { boxShadow: "0 0 20px rgba(34,197,94,0.3), 0 0 60px rgba(34,197,94,0.1)" },
  "50%": { boxShadow: "0 0 40px rgba(34,197,94,0.6), 0 0 80px rgba(34,197,94,0.2)" },
});

function formatDateTime(isoString: string): string {
  try {
    return new Date(isoString).toLocaleString("de-DE", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return isoString;
  }
}

const nextSteps = [
  {
    icon: Envelope,
    title: "Check deine E-Mails",
    description: "Du bekommst eine Bestätigungsmail mit deinem Termin und allen Details.",
  },
  {
    icon: Calendar,
    title: "Termin vorbereiten",
    description: "Bereite deine wichtigsten Fragen vor. Je konkreter du bist, desto mehr nimmst du mit.",
  },
  {
    icon: CheckCircle,
    title: "Erscheine pünktlich",
    description: "Das Gespräch startet pünktlich. Sei 2 Minuten früher bereit.",
  },
];

export default function ProtocolBookedPage() {
  const searchParams = useSearchParams();
  const trackedRef = useRef(false);
  const [inviteeName, setInviteeName] = useState<string | null>(null);
  const [scheduledAt, setScheduledAt] = useState<string | null>(null);

  useEffect(() => {
    if (trackedRef.current) return;
    trackedRef.current = true;

    // Calendly URL-Parameter auslesen (verfügbar wenn "Pass event details" aktiviert)
    const leadId = searchParams.get("utm_content");
    const inviteeFullName =
      searchParams.get("invitee_full_name") ||
      [searchParams.get("invitee_first_name"), searchParams.get("invitee_last_name")]
        .filter(Boolean)
        .join(" ") ||
      null;
    const inviteeEmail = searchParams.get("invitee_email");
    const eventStartTime = searchParams.get("event_start_time");
    const inviteeUuid = searchParams.get("invitee_uuid");
    const eventTypeName = searchParams.get("event_type_name");

    // UI sofort personalisieren
    if (inviteeFullName) setInviteeName(inviteeFullName);
    if (eventStartTime) setScheduledAt(eventStartTime);

    // Lead in der Datenbank mit Buchungsdaten anreichern
    if (leadId) {
      fetch("/api/protocol/update-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lead_id: leadId,
          invitee_full_name: inviteeFullName,
          invitee_email: inviteeEmail,
          event_start_time: eventStartTime,
          invitee_uuid: inviteeUuid,
          event_type_name: eventTypeName,
        }),
        keepalive: true,
      }).catch(() => {});
    }

    // Funnel-Event für Tracking (mit Session-ID aus sessionStorage als Fallback)
    const sessionId = leadId || sessionStorage.getItem("snt_protocol_session") || "unknown";
    fetch("/api/protocol/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: sessionId,
        event_type: "calendly_booked",
        metadata: {
          source: "redirect_params",
          has_lead_id: Boolean(leadId),
          has_invitee_data: Boolean(inviteeEmail),
        },
      }),
      keepalive: true,
    }).catch(() => {});
  }, [searchParams]);

  return (
    <Box
      minH="100vh"
      bg="black"
      display="flex"
      alignItems="center"
      justifyContent="center"
      py={{ base: 12, md: 20 }}
      px={{ base: 4, md: 8 }}
      position="relative"
      overflow="hidden"
      background="radial-gradient(at 50% 30%, rgba(34,197,94,0.07) 0px, transparent 55%),
        radial-gradient(at 50% 0%, rgba(139, 92, 246,0.05) 0px, transparent 50%),
        linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(4,10,8,1) 100%)"
    >
      {/* Background grid */}
      <Box
        position="absolute"
        inset="0"
        backgroundImage="linear-gradient(rgba(34,197,94,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.025) 1px, transparent 1px)"
        backgroundSize="60px 60px"
        pointerEvents="none"
      />

      <Box maxW="600px" mx="auto" w="full" position="relative">
        <VStack gap={10} textAlign="center">

          {/* Success Icon */}
          <Box
            w={{ base: "80px", md: "96px" }}
            h={{ base: "80px", md: "96px" }}
            borderRadius="full"
            bg="rgba(34,197,94,0.12)"
            border="2px solid rgba(34,197,94,0.4)"
            display="flex"
            alignItems="center"
            justifyContent="center"
            animation={`${scalePop} 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) both, ${glowPulse} 3s ease-in-out 0.6s infinite`}
          >
            <CheckCircle size={44} color="rgba(34,197,94,0.9)" weight="fill" />
          </Box>

          {/* Headline */}
          <VStack gap={3} animation={`${fadeIn} 0.8s ease-out 0.3s both`}>
            <HStack justify="center" gap={2}>
              <ApprovedIcon boxSize={4} />
              <Text fontSize="xs" color="gray.500" fontWeight="semibold" letterSpacing="widest" textTransform="uppercase">
                SNT APEX™
              </Text>
            </HStack>
            <Heading
              as="h1"
              fontSize={{ base: "2xl", md: "3xl" }}
              fontWeight="900"
              color="white"
              lineHeight="1.2"
            >
              {inviteeName
                ? `Alles klar, ${inviteeName.split(" ")[0]}!`
                : "Termin erfolgreich gebucht!"}
            </Heading>
            <Text fontSize={{ base: "md", md: "lg" }} color="gray.400" maxW="450px" lineHeight="1.7">
              Deine Bewerbung ist bei uns angekommen. Ali wird sich deine Antworten persönlich
              durchlesen und sich auf das Gespräch vorbereiten.
            </Text>
          </VStack>

          {/* Termin-Info (falls Calendly-Daten vorhanden) */}
          {scheduledAt && (
            <Box
              w="full"
              p={5}
              borderRadius="xl"
              bg="rgba(34,197,94,0.06)"
              border="1px solid rgba(34,197,94,0.25)"
              backdropFilter="blur(16px)"
              animation={`${fadeIn} 0.8s ease-out 0.45s both`}
            >
              <HStack gap={3} justify="center">
                <Clock size={18} color="rgba(34,197,94,0.8)" weight="fill" />
                <Text fontSize="sm" fontWeight="semibold" color="rgba(34,197,94,0.9)">
                  {formatDateTime(scheduledAt)}
                </Text>
              </HStack>
            </Box>
          )}

          {/* Info Box */}
          <Box
            w="full"
            p={6}
            borderRadius="2xl"
            bg="rgba(139, 92, 246,0.04)"
            border="1px solid rgba(139, 92, 246,0.15)"
            backdropFilter="blur(16px)"
            animation={`${fadeIn} 0.8s ease-out 0.5s both`}
          >
            <Text fontSize="sm" fontWeight="bold" color={SNT_PURPLE} mb={2} textTransform="uppercase" letterSpacing="wider">
              Wichtig zu wissen
            </Text>
            <Text fontSize="sm" color="gray.400" lineHeight="1.7">
              Das ist kein gewöhnliches Verkaufsgespräch. Es ist ein ehrliches Kennenlernen.
              Wenn wir sehen, dass du wirklich bereit bist, sprechen wir über die nächsten Schritte.
              Sei du selbst, das ist was zählt.
            </Text>
          </Box>

          {/* Next Steps */}
          <VStack gap={4} w="full" animation={`${fadeIn} 0.8s ease-out 0.7s both`}>
            <Text fontSize="sm" fontWeight="bold" color="gray.500" textTransform="uppercase" letterSpacing="wider">
              Deine nächsten Schritte
            </Text>
            {nextSteps.map(({ icon: Icon, title, description }, idx) => (
              <HStack
                key={idx}
                gap={4}
                p={4}
                borderRadius="xl"
                bg="rgba(10,14,20,0.7)"
                border="1px solid rgba(139, 92, 246,0.12)"
                backdropFilter="blur(12px)"
                w="full"
                align="start"
                textAlign="left"
              >
                <Box
                  p="10px"
                  borderRadius="lg"
                  bg="rgba(139, 92, 246,0.1)"
                  border="1px solid rgba(139, 92, 246,0.2)"
                  flexShrink={0}
                >
                  <Icon size={18} color={SNT_PURPLE} weight="fill" />
                </Box>
                <VStack align="start" gap={0.5}>
                  <Text fontSize="sm" fontWeight="bold" color="white">
                    {title}
                  </Text>
                  <Text fontSize="sm" color="gray.500" lineHeight="1.6">
                    {description}
                  </Text>
                </VStack>
              </HStack>
            ))}
          </VStack>

          {/* Back to Page */}
          <Box animation={`${fadeIn} 0.8s ease-out 0.9s both`}>
            <NextLink href="/apex" passHref legacyBehavior>
              <Button
                variant="ghost"
                color="gray.500"
                _hover={{ color: "white", bg: "rgba(255,255,255,0.05)" }}
                borderRadius="xl"
                h="44px"
                px={6}
                fontSize="sm"
              >
                <HStack gap={2}>
                  <Text>Zurück zur Übersicht</Text>
                  <ArrowRight size={14} />
                </HStack>
              </Button>
            </NextLink>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
}

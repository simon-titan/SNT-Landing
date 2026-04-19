"use client";

import { useState, useCallback } from "react";
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Textarea,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { ArrowRight, ArrowLeft, CalendarCheck, Lock, Warning, ShieldCheck } from "@phosphor-icons/react/dist/ssr";
import { trackProtocolEvent, getProtocolSession } from "@/components/protocol/ProtocolTracker";
import { ApprovedIcon } from "@/components/ui/approved-icon";

const SNT_PURPLE = "#8B5CF6";
const SNT_PURPLE_DARK = "#7C3AED";

const fadeIn = keyframes({
  from: { opacity: 0, transform: "translateX(20px)" },
  to: { opacity: 1, transform: "translateX(0)" },
});

const ctaGlow = keyframes({
  "0%, 100%": { boxShadow: "0 8px 28px rgba(139, 92, 246, 0.35), inset 0 1px 0 rgba(255,255,255,0.15)" },
  "50%": { boxShadow: "0 12px 40px rgba(139, 92, 246, 0.55), inset 0 1px 0 rgba(255,255,255,0.2)" },
});

const errorBannerIn = keyframes({
  from: { opacity: 0, transform: "translateY(-8px)" },
  to: { opacity: 1, transform: "translateY(0)" },
});

// ─── Step Definitions ───────────────────────────────────────────────────────

type FormData = {
  trading_duration: string;
  current_level: string;
  holding_back: string;
  snt_duration: string;
  snt_source: string;
  investment_willingness: string;
  why_candidate: string;
};

const INITIAL: FormData = {
  trading_duration: "",
  current_level: "",
  holding_back: "",
  snt_duration: "",
  snt_source: "",
  investment_willingness: "",
  why_candidate: "",
};

// ─── Option Components ──────────────────────────────────────────────────────

function RadioOption({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <Box
      as="button"
      onClick={onClick}
      w="full"
      p={{ base: 4, md: 5 }}
      borderRadius="xl"
      border={selected ? "2px solid" : "1px solid rgba(139, 92, 246,0.2)"}
      borderColor={selected ? SNT_PURPLE : "rgba(139, 92, 246,0.2)"}
      bg={selected ? "rgba(139, 92, 246,0.12)" : "rgba(10,14,20,0.6)"}
      backdropFilter="blur(12px)"
      textAlign="left"
      transition="all 0.2s"
      _hover={{
        borderColor: SNT_PURPLE,
        bg: "rgba(139, 92, 246,0.08)",
      }}
      cursor="pointer"
    >
      <HStack gap={3}>
        <Box
          w={5}
          h={5}
          borderRadius="full"
          border={selected ? `2px solid ${SNT_PURPLE}` : "2px solid rgba(139, 92, 246,0.4)"}
          bg={selected ? SNT_PURPLE : "transparent"}
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexShrink={0}
          transition="all 0.2s"
        >
          {selected && <Box w={2} h={2} borderRadius="full" bg="white" />}
        </Box>
        <Text color="white" fontSize="sm" fontWeight={selected ? "semibold" : "normal"} lineHeight="1.4">
          {label}
        </Text>
      </HStack>
    </Box>
  );
}

// ─── Step 1 ─────────────────────────────────────────────────────────────────

function Step1({
  data,
  onChange,
}: {
  data: FormData;
  onChange: (field: keyof FormData, value: string) => void;
}) {
  return (
    <VStack gap={8} w="full" align="stretch" animation={`${fadeIn} 0.4s ease-out both`}>
      <VStack align="start" gap={1}>
        <Text fontSize="sm" color={SNT_PURPLE} fontWeight="bold" textTransform="uppercase" letterSpacing="wider">
          Schritt 1 von 3
        </Text>
        <Heading as="h2" fontSize={{ base: "xl", md: "2xl" }} color="white" fontWeight="800">
          Dein Trading-Hintergrund
        </Heading>
        <Text fontSize="sm" color="gray.500">
          Kurze Einschätzung, damit wir verstehen, wo du gerade stehst.
        </Text>
      </VStack>

      <VStack align="start" gap={3}>
        <Text fontSize="sm" fontWeight="semibold" color="gray.300">
          Wie lange tradest du bereits?
        </Text>
        {[
          "Weniger als 6 Monate",
          "6 bis 12 Monate",
          "1 bis 2 Jahre",
          "Mehr als 2 Jahre",
        ].map((opt) => (
          <RadioOption
            key={opt}
            label={opt}
            selected={data.trading_duration === opt}
            onClick={() => onChange("trading_duration", opt)}
          />
        ))}
      </VStack>

      <VStack align="start" gap={3}>
        <Text fontSize="sm" fontWeight="semibold" color="gray.300">
          Wie würdest du deinen aktuellen Stand beschreiben?
        </Text>
        {[
          "Anfänger, ich lerne noch die Grundlagen",
          "Fortgeschritten, ich habe ein System, aber bin inkonsistent",
          "Profitabel aber inkonsistent, gute Monate, schlechte Monate",
          "Konstant profitabel, ich suche das nächste Level",
        ].map((opt) => (
          <RadioOption
            key={opt}
            label={opt}
            selected={data.current_level === opt}
            onClick={() => onChange("current_level", opt)}
          />
        ))}
      </VStack>
    </VStack>
  );
}

// ─── Step 2 ─────────────────────────────────────────────────────────────────

function Step2({
  data,
  onChange,
}: {
  data: FormData;
  onChange: (field: keyof FormData, value: string) => void;
}) {
  return (
    <VStack gap={8} w="full" align="stretch" animation={`${fadeIn} 0.4s ease-out both`}>
      <VStack align="start" gap={1}>
        <Text fontSize="sm" color={SNT_PURPLE} fontWeight="bold" textTransform="uppercase" letterSpacing="wider">
          Schritt 2 von 3
        </Text>
        <Heading as="h2" fontSize={{ base: "xl", md: "2xl" }} color="white" fontWeight="800">
          Dein Problem
        </Heading>
        <Text fontSize="sm" color="gray.500">
          Sei ehrlich, das hilft uns, dich richtig einzuschätzen.
        </Text>
      </VStack>

      <VStack align="start" gap={3}>
        <Text fontSize="sm" fontWeight="semibold" color="gray.300">
          Was hält dich konkret zurück?{" "}
          <Box as="span" color="gray.600" fontWeight="normal">
            (mind. 30 Zeichen)
          </Box>
        </Text>
        <Textarea
          value={data.holding_back}
          onChange={(e) => onChange("holding_back", e.target.value)}
          placeholder="Beschreibe konkret: Was läuft nicht, was blockiert dich, was hast du schon versucht..."
          rows={5}
          resize="none"
          bg="rgba(10,14,20,0.7)"
          border="1px solid rgba(139, 92, 246,0.2)"
          borderRadius="xl"
          color="white"
          fontSize="sm"
          lineHeight="1.7"
          _placeholder={{ color: "gray.600" }}
          _focus={{
            borderColor: SNT_PURPLE,
            boxShadow: `0 0 0 1px ${SNT_PURPLE}`,
            outline: "none",
          }}
          transition="all 0.2s"
          p={4}
        />
        <Text fontSize="xs" color={data.holding_back.length >= 30 ? "green.400" : "gray.600"}>
          {data.holding_back.length}/30 Zeichen {data.holding_back.length >= 30 ? "✓" : ""}
        </Text>
      </VStack>

      <VStack align="start" gap={3}>
        <Text fontSize="sm" fontWeight="semibold" color="gray.300">
          Wie lange bist du bei SNT / wie bist du auf uns gestoßen?
        </Text>
        {[
          "Ich bin neu, gerade erst gefunden",
          "Weniger als 3 Monate",
          "3 bis 12 Monate",
          "Mehr als 1 Jahr dabei",
        ].map((opt) => (
          <RadioOption
            key={opt}
            label={opt}
            selected={data.snt_duration === opt}
            onClick={() => onChange("snt_duration", opt)}
          />
        ))}
      </VStack>

      <VStack align="start" gap={2}>
        <Text fontSize="sm" fontWeight="semibold" color="gray.300">
          Wie bist du auf SNT gestoßen?{" "}
          <Box as="span" color="gray.600" fontWeight="normal">
            (optional)
          </Box>
        </Text>
        <input
          type="text"
          value={data.snt_source}
          onChange={(e) => onChange("snt_source", e.target.value)}
          placeholder="z.B. Instagram, TikTok, Freunde, YouTube..."
          style={{
            backgroundColor: "rgba(10,14,20,0.7)",
            border: "1px solid rgba(139, 92, 246,0.2)",
            borderRadius: "12px",
            color: "white",
            fontSize: "14px",
            padding: "16px",
            width: "100%",
            outline: "none",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = SNT_PURPLE;
            e.target.style.boxShadow = `0 0 0 1px ${SNT_PURPLE}`;
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "rgba(139, 92, 246,0.2)";
            e.target.style.boxShadow = "none";
          }}
        />
      </VStack>
    </VStack>
  );
}

// ─── Step 3 ─────────────────────────────────────────────────────────────────

function Step3({
  data,
  onChange,
}: {
  data: FormData;
  onChange: (field: keyof FormData, value: string) => void;
}) {
  return (
    <VStack gap={8} w="full" align="stretch" animation={`${fadeIn} 0.4s ease-out both`}>
      <VStack align="start" gap={1}>
        <Text fontSize="sm" color={SNT_PURPLE} fontWeight="bold" textTransform="uppercase" letterSpacing="wider">
          Schritt 3 von 3
        </Text>
        <Heading as="h2" fontSize={{ base: "xl", md: "2xl" }} color="white" fontWeight="800">
          Dein Commitment
        </Heading>
        <Text fontSize="sm" color="gray.500">
          Jetzt wird es ernst. Dieser Schritt entscheidet, ob du für das SNT ELITE in Frage kommst.
        </Text>
      </VStack>

      <VStack align="start" gap={3}>
        <Text fontSize="sm" fontWeight="semibold" color="gray.300">
          Was wärst du bereit zu investieren, wenn der Wert stimmt?
        </Text>
        {[
          "Unter 500€",
          "500€ bis 1.500€",
          "1.500€ bis 3.000€",
          "3.000€ oder mehr",
        ].map((opt) => (
          <RadioOption
            key={opt}
            label={opt}
            selected={data.investment_willingness === opt}
            onClick={() => onChange("investment_willingness", opt)}
          />
        ))}
      </VStack>

      <VStack align="start" gap={3}>
        <Text fontSize="sm" fontWeight="semibold" color="gray.300">
          Warum bist du der richtige Kandidat für das SNT ELITE?{" "}
          <Box as="span" color="gray.600" fontWeight="normal">
            (mind. 50 Zeichen)
          </Box>
        </Text>
        <Textarea
          value={data.why_candidate}
          onChange={(e) => onChange("why_candidate", e.target.value)}
          placeholder="Überzeuge uns: Was macht dich zum richtigen Kandidaten? Was unterscheidet dich von anderen?"
          rows={6}
          resize="none"
          bg="rgba(10,14,20,0.7)"
          border="1px solid rgba(139, 92, 246,0.2)"
          borderRadius="xl"
          color="white"
          fontSize="sm"
          lineHeight="1.7"
          _placeholder={{ color: "gray.600" }}
          _focus={{
            borderColor: SNT_PURPLE,
            boxShadow: `0 0 0 1px ${SNT_PURPLE}`,
            outline: "none",
          }}
          transition="all 0.2s"
          p={4}
        />
        <Text fontSize="xs" color={data.why_candidate.length >= 50 ? "green.400" : "gray.600"}>
          {data.why_candidate.length}/50 Zeichen {data.why_candidate.length >= 50 ? "✓" : ""}
        </Text>
      </VStack>
    </VStack>
  );
}

// ─── Validation ──────────────────────────────────────────────────────────────

function validateStep(step: number, data: FormData): string | null {
  if (step === 1) {
    if (!data.trading_duration) return "Bitte gib an, wie lange du bereits tradest.";
    if (!data.current_level) return "Bitte beschreibe deinen aktuellen Stand.";
  }
  if (step === 2) {
    if (!data.holding_back || data.holding_back.length < 30)
      return "Bitte beschreibe dein Problem (mind. 30 Zeichen).";
    if (!data.snt_duration) return "Bitte gib an, wie lange du schon bei SNT bist.";
  }
  if (step === 3) {
    if (!data.investment_willingness) return "Bitte gib deine Investitionsbereitschaft an.";
    if (!data.why_candidate || data.why_candidate.length < 50)
      return "Bitte erkläre ausführlicher, warum du der richtige Kandidat bist (mind. 50 Zeichen).";
  }
  return null;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ProtocolApplyPage() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormData>(INITIAL);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onChange = useCallback((field: keyof FormData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  }, []);

  const handleNext = async () => {
    const validationError = validateStep(step, data);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);

    const eventMap: Record<number, string> = {
      1: "step_1_complete",
      2: "step_2_complete",
      3: "step_3_complete",
    };
    await trackProtocolEvent(eventMap[step], { step });

    if (step < 3) {
      setStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      await handleSubmit();
    }
  };

  const handleBack = () => {
    setError(null);
    setStep((s) => Math.max(1, s - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      await trackProtocolEvent("form_submit", { step: 3 });

      const sessionId = getProtocolSession();
      const res = await fetch("/api/protocol/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          session_id: sessionId,
          referrer: typeof document !== "undefined" ? document.referrer : "",
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error ?? "Ein Fehler ist aufgetreten. Bitte versuche es erneut.");
        setIsSubmitting(false);
        return;
      }

      await trackProtocolEvent("calendly_redirect", { lead_id: json.leadId });
      window.location.href = json.calendlyUrl;
    } catch {
      setError("Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es erneut.");
      setIsSubmitting(false);
    }
  };

  const progressPercent = (step / 3) * 100;

  const stepLabels = ["Dein Trading", "Dein Problem", "Dein Commitment"];

  return (
    <Box
      minH="100vh"
      bg="black"
      pt={{
        base: error ? "calc(86px + env(safe-area-inset-top))" : 6,
        md: error ? 24 : 14,
      }}
      pb={{ base: "calc(140px + env(safe-area-inset-bottom))", md: 16 }}
      px={{ base: 3, md: 8 }}
      position="relative"
      overflow="hidden"
      background="radial-gradient(at 50% 0%, rgba(139, 92, 246,0.08) 0px, transparent 50%),
        linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(6,10,20,1) 100%)"
      transition="padding 0.25s ease"
    >
      {/* Background grid */}
      <Box
        position="absolute"
        inset="0"
        backgroundImage="linear-gradient(rgba(139, 92, 246,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246,0.025) 1px, transparent 1px)"
        backgroundSize="60px 60px"
        pointerEvents="none"
      />

      {/* Sticky top error banner — always visible while there's an error */}
      {error && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          zIndex={60}
          pt="calc(env(safe-area-inset-top) + 8px)"
          pb={3}
          px={3}
          bg="rgba(20, 4, 6, 0.96)"
          backdropFilter="blur(20px) saturate(180%)"
          borderBottom="1px solid rgba(239, 68, 68, 0.45)"
          boxShadow="0 12px 36px rgba(0, 0, 0, 0.55), 0 1px 0 rgba(239, 68, 68, 0.18) inset"
          animation={`${errorBannerIn} 220ms ease-out both`}
        >
          <HStack
            maxW="640px"
            mx="auto"
            gap={3}
            align="start"
            px={1}
          >
            <Box
              flexShrink={0}
              w="32px"
              h="32px"
              borderRadius="full"
              bg="rgba(239, 68, 68, 0.18)"
              border="1px solid rgba(239, 68, 68, 0.5)"
              display="flex"
              alignItems="center"
              justifyContent="center"
              boxShadow="0 0 16px rgba(239, 68, 68, 0.35)"
            >
              <Warning size={16} color="rgba(255, 180, 180, 1)" weight="fill" />
            </Box>
            <VStack align="start" gap={0} flex={1} minW={0}>
              <Text
                fontSize="2xs"
                color="rgba(255, 150, 150, 0.85)"
                fontWeight="bold"
                letterSpacing="wider"
                textTransform="uppercase"
              >
                Hinweis
              </Text>
              <Text fontSize="sm" color="white" fontWeight="medium" lineHeight="1.4">
                {error}
              </Text>
            </VStack>
            <Box
              as="button"
              onClick={() => setError(null)}
              flexShrink={0}
              w="32px"
              h="32px"
              borderRadius="lg"
              display="flex"
              alignItems="center"
              justifyContent="center"
              color="gray.400"
              _hover={{ bg: "rgba(255,255,255,0.06)", color: "white" }}
              transition="all 0.15s ease"
              cursor="pointer"
              aria-label="Hinweis schließen"
            >
              <Text fontSize="lg" lineHeight="1" fontWeight="300">×</Text>
            </Box>
          </HStack>
        </Box>
      )}

      <Box maxW="640px" mx="auto" position="relative">
        <VStack gap={{ base: 6, md: 8 }} align="stretch">

          {/* Header */}
          <VStack gap={4} textAlign="center">
            <Box
              display="inline-flex"
              alignItems="center"
              gap={2}
              px={3.5}
              py={1.5}
              borderRadius="full"
              bg="rgba(139, 92, 246, 0.10)"
              border="1px solid rgba(139, 92, 246, 0.30)"
              backdropFilter="blur(8px)"
              alignSelf="center"
            >
              <ApprovedIcon boxSize={4} />
              <Text fontSize="xs" color="white" fontWeight="bold" letterSpacing="widest" textTransform="uppercase">
                SNTTRADES™
              </Text>
            </Box>
            <Heading
              as="h1"
              fontSize={{ base: "2xl", md: "3xl" }}
              color="white"
              fontWeight="900"
              textAlign="center"
              lineHeight="1.15"
              letterSpacing="-0.01em"
            >
              Bewerbe dich für einen Platz
            </Heading>
          </VStack>

          {/* Progress Bar */}
          <Box>
            {/* Mobile: only active step label, Desktop: all labels */}
            <HStack
              display={{ base: "flex", md: "none" }}
              justify="space-between"
              mb={2}
              align="center"
            >
              <Text fontSize="xs" color={SNT_PURPLE} fontWeight="bold" letterSpacing="wider" textTransform="uppercase">
                {stepLabels[step - 1]}
              </Text>
              <Text fontSize="xs" color="gray.500" fontWeight="semibold">
                Schritt {step} von 3
              </Text>
            </HStack>
            <HStack
              display={{ base: "none", md: "flex" }}
              justify="space-between"
              mb={2}
            >
              {stepLabels.map((label, idx) => (
                <Text
                  key={idx}
                  fontSize="xs"
                  color={idx + 1 <= step ? SNT_PURPLE : "gray.700"}
                  fontWeight={idx + 1 === step ? "bold" : "normal"}
                  transition="all 0.3s"
                >
                  {label}
                </Text>
              ))}
            </HStack>
            {/* Bar */}
            <Box
              w="full"
              h="6px"
              borderRadius="full"
              bg="rgba(255,255,255,0.05)"
              overflow="hidden"
            >
              <Box
                h="full"
                borderRadius="full"
                bg={`linear-gradient(90deg, ${SNT_PURPLE}, ${SNT_PURPLE_DARK})`}
                w={`${progressPercent}%`}
                transition="width 0.5s cubic-bezier(0.22, 1, 0.36, 1)"
                boxShadow="0 0 12px rgba(139, 92, 246,0.7)"
              />
            </Box>
          </Box>

          {/* Form Card */}
          <Box
            p={{ base: 5, md: 8 }}
            borderRadius={{ base: "xl", md: "2xl" }}
            bg="rgba(8,12,22,0.85)"
            backdropFilter="blur(20px)"
            border="1px solid rgba(139, 92, 246,0.15)"
            boxShadow="0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(139, 92, 246,0.05) inset"
          >
            {step === 1 && <Step1 data={data} onChange={onChange} />}
            {step === 2 && <Step2 data={data} onChange={onChange} />}
            {step === 3 && <Step3 data={data} onChange={onChange} />}

            {/* Desktop navigation (mobile uses sticky bottom bar) */}
            <HStack
              display={{ base: "none", md: "flex" }}
              mt={8}
              justify="space-between"
              gap={3}
            >
              {step > 1 ? (
                <Button
                  variant="ghost"
                  color="gray.400"
                  _hover={{ color: "white", bg: "rgba(255,255,255,0.05)" }}
                  borderRadius="xl"
                  h="52px"
                  px={5}
                  onClick={handleBack}
                  disabled={isSubmitting}
                >
                  <HStack gap={2}>
                    <ArrowLeft size={16} />
                    <Text>Zurück</Text>
                  </HStack>
                </Button>
              ) : (
                <Box />
              )}

              <Button
                h={step === 3 ? "60px" : "52px"}
                px={step === 3 ? 10 : 8}
                bg={SNT_PURPLE}
                color="white"
                fontSize={step === 3 ? "md" : "sm"}
                fontWeight="bold"
                borderRadius="xl"
                animation={step === 3 ? `${ctaGlow} 2.4s ease-in-out infinite` : undefined}
                _hover={{ bg: SNT_PURPLE_DARK, transform: "translateY(-1px)", boxShadow: "0 12px 32px rgba(139, 92, 246,0.5)" }}
                transition="all 0.25s"
                onClick={handleNext}
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                <HStack gap={2.5}>
                  {step === 3 ? (
                    <>
                      <CalendarCheck size={20} weight="fill" />
                      <Text>Termin vereinbaren</Text>
                    </>
                  ) : (
                    <>
                      <Text>Weiter</Text>
                      <ArrowRight size={16} weight="bold" />
                    </>
                  )}
                </HStack>
              </Button>
            </HStack>
          </Box>

          {/* Footer Note — clean two-line layout, mobile-friendly */}
          <VStack gap={2} px={2} pb={{ base: 0, md: 4 }} display={{ base: "none", md: "flex" }}>
            <HStack gap={2} justify="center">
              <Lock size={12} color="gray" />
              <Text fontSize="xs" color="gray.500" textAlign="center" fontWeight="medium">
                Deine Angaben werden vertraulich behandelt
              </Text>
            </HStack>
            <Text fontSize="xs" color="gray.600" textAlign="center" lineHeight="1.5" maxW="420px">
              Nach dem Absenden wirst du direkt zu unserem Buchungskalender weitergeleitet.
            </Text>
          </VStack>
        </VStack>
      </Box>

      {/* Mobile sticky bottom navigation */}
      <Box
        display={{ base: "block", md: "none" }}
        position="fixed"
        left={0}
        right={0}
        bottom={0}
        zIndex={50}
        pt={3}
        pb="calc(12px + env(safe-area-inset-bottom))"
        px={3}
        bg="rgba(4, 6, 14, 0.98)"
        backdropFilter="blur(20px) saturate(180%)"
        borderTop="1px solid rgba(139, 92, 246, 0.25)"
        boxShadow="0 -12px 40px rgba(0, 0, 0, 0.6), 0 -1px 0 rgba(139, 92, 246, 0.1) inset"
      >
        <VStack gap={2} align="stretch" maxW="640px" mx="auto">
          <Button
            h="60px"
            w="full"
            bg={SNT_PURPLE}
            color="white"
            fontSize="md"
            fontWeight="bold"
            borderRadius="xl"
            animation={step === 3 ? `${ctaGlow} 2.4s ease-in-out infinite` : undefined}
            boxShadow={
              step === 3
                ? undefined
                : "0 8px 24px rgba(139, 92, 246, 0.4), inset 0 1px 0 rgba(255,255,255,0.15)"
            }
            _hover={{ bg: SNT_PURPLE_DARK }}
            _active={{ transform: "translateY(1px)" }}
            transition="all 0.2s"
            onClick={handleNext}
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            <HStack gap={2.5}>
              {step === 3 ? (
                <>
                  <CalendarCheck size={20} weight="fill" />
                  <Text>Termin vereinbaren</Text>
                </>
              ) : (
                <>
                  <Text>Weiter</Text>
                  <ArrowRight size={18} weight="bold" />
                </>
              )}
            </HStack>
          </Button>

          <HStack justify="space-between" align="center" px={1}>
            {step > 1 ? (
              <Button
                variant="ghost"
                size="sm"
                color="gray.400"
                _hover={{ color: "white", bg: "rgba(255,255,255,0.05)" }}
                borderRadius="lg"
                h="36px"
                px={3}
                onClick={handleBack}
                disabled={isSubmitting}
              >
                <HStack gap={1.5}>
                  <ArrowLeft size={14} />
                  <Text fontSize="sm">Zurück</Text>
                </HStack>
              </Button>
            ) : (
              <HStack gap={1.5} pl={2} opacity={0.7}>
                <ShieldCheck size={12} color="gray" />
                <Text fontSize="2xs" color="gray.500">
                  Vertraulich behandelt
                </Text>
              </HStack>
            )}
            <Text fontSize="2xs" color="gray.600" pr={2}>
              {step} / 3
            </Text>
          </HStack>
        </VStack>
      </Box>
    </Box>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  Input,
  Spinner,
} from "@chakra-ui/react";
import {
  TelegramLogo,
  CheckCircle,
  XCircle,
  Link as LinkIcon,
  Warning,
  ArrowRight,
  User,
  EnvelopeSimple,
  Bug,
} from "@phosphor-icons/react/dist/ssr";

const TELEGRAM_BLUE = "#0088cc";

// Types
interface UserData {
  email: string;
  firstName: string;
  lastName: string;
  accountUid: string;
}

interface MemberData {
  status: string;
  is_active: boolean;
  is_in_group: boolean;
  subscription_plan: string | null;
  telegram_username: string | null;
}

export default function TelegramAccountPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserData | null>(null);
  const [member, setMember] = useState<MemberData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [testMode, setTestMode] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  
  // Linking state
  const [telegramUsername, setTelegramUsername] = useState("");
  const [telegramUserId, setTelegramUserId] = useState("");
  const [linkingStatus, setLinkingStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [linkingError, setLinkingError] = useState<string | null>(null);

  useEffect(() => {
    // Test-Modus direkt aus URL prüfen (nicht über State)
    const urlParams = new URLSearchParams(window.location.search);
    const isTestMode = urlParams.get("test") === "1";
    setTestMode(isTestMode);
    
    // Telegram User ID aus URL oder localStorage
    const tgId = urlParams.get("telegram_user_id") || localStorage.getItem("telegram_user_id");
    if (tgId) {
      setTelegramUserId(tgId);
    }

    // Outseta User laden
    const loadUser = async () => {
      try {
        // Im Test-Modus: Kein Outseta nötig
        if (isTestMode) {
          console.log("Test-Modus aktiv - überspringe Outseta");
          setUser({
            email: "test@example.com",
            firstName: "Test",
            lastName: "User",
            accountUid: "TEST-123",
          });
          setLoading(false);
          return;
        }

        // Warte auf Outseta (max 3 Sekunden)
        const maxWait = 3000;
        const startTime = Date.now();
        
        while (!(window as any).Outseta?.getUser && Date.now() - startTime < maxWait) {
          await new Promise((r) => setTimeout(r, 100));
        }

        const outseta = (window as any).Outseta;
        
        // Wenn Outseta nicht verfügbar ist
        if (!outseta?.getUser) {
          console.log("Outseta nicht verfügbar");
          setError("Outseta konnte nicht geladen werden. Bitte Seite neu laden.");
          setLoading(false);
          return;
        }

        try {
          const outsetaUser = await outseta.getUser();
          if (!outsetaUser?.Email) {
            setError("Bitte melde dich an um fortzufahren.");
            setLoading(false);
            return;
          }

          setUser({
            email: outsetaUser.Email,
            firstName: outsetaUser.FirstName || "",
            lastName: outsetaUser.LastName || "",
            accountUid: outsetaUser.Account?.Uid || "",
          });
        } catch (userError) {
          console.log("User nicht eingeloggt:", userError);
          setError("Bitte melde dich an um fortzufahren.");
          setLoading(false);
          return;
        }

        // Telegram Status laden
        const storedTelegramUserId = localStorage.getItem("telegram_user_id");
        if (storedTelegramUserId) {
          setTelegramUserId(storedTelegramUserId);
          try {
            const response = await fetch(
              `/api/telegram/paid-group/activate?telegram_user_id=${storedTelegramUserId}`
            );
            const data = await response.json();
            if (data.success) {
              setMember(data);
            }
          } catch {
            console.log("Kein Telegram-Status gefunden");
          }
        }
      } catch (err) {
        console.error("Fehler beim Laden:", err);
        setError("Fehler beim Laden der Daten.");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []); // Keine Dependencies mehr - läuft nur einmal

  // Test-Funktion: Aktiviere Subscription ohne Zahlung
  const handleTestActivation = async () => {
    if (!telegramUserId) {
      setTestResult("❌ Keine Telegram User ID angegeben");
      return;
    }

    setTestResult("⏳ Aktiviere...");

    try {
      const response = await fetch("/api/telegram/paid-group/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          telegram_user_id: parseInt(telegramUserId),
          provider: "test",
        }),
      });

      const data = await response.json();

      if (data.success) {
        setTestResult(`✅ Aktiviert! Invite-Link: ${data.invite_link || "wird per Telegram gesendet"}`);
        // Status neu laden
        setMember({
          status: "active",
          is_active: true,
          is_in_group: false,
          subscription_plan: "ZmNM7ZW2",
          telegram_username: null,
        });
      } else {
        setTestResult(`❌ Fehler: ${data.error}`);
      }
    } catch (err) {
      setTestResult(`❌ Exception: ${err}`);
    }
  };

  const handleLinkTelegram = async () => {
    if (!telegramUsername.trim()) {
      setLinkingError("Bitte gib deinen Telegram-Benutzernamen ein.");
      return;
    }

    setLinkingStatus("loading");
    setLinkingError(null);

    try {
      // TODO: API aufrufen um Verifizierung zu starten
      // Für jetzt nur Simulation
      await new Promise((r) => setTimeout(r, 1500));
      
      setLinkingStatus("success");
    } catch (err) {
      setLinkingStatus("error");
      setLinkingError("Fehler bei der Verknüpfung. Bitte versuche es erneut.");
    }
  };

  if (loading) {
    return (
      <Flex minH="100vh" justify="center" align="center" bg="gray.50">
        <VStack gap={4}>
          <Spinner size="xl" color={TELEGRAM_BLUE} />
          <Text color="gray.600">Lade Daten...</Text>
        </VStack>
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex minH="100vh" justify="center" align="center" bg="gray.50" px={4}>
        <Box
          maxW="md"
          w="full"
          bg="white"
          p={8}
          borderRadius="xl"
          boxShadow="lg"
          textAlign="center"
        >
          <Warning size={64} color="#f59e0b" weight="fill" />
          <Heading size="lg" mt={4} mb={2}>
            Anmeldung erforderlich
          </Heading>
          <Text color="gray.600" mb={6}>
            {error}
          </Text>
          <VStack gap={3}>
            <a
              href="#"
              data-o-auth="1"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 24px",
                backgroundColor: TELEGRAM_BLUE,
                color: "white",
                borderRadius: "8px",
                fontWeight: "600",
                textDecoration: "none",
                width: "100%",
                justifyContent: "center",
              }}
            >
              Anmelden
              <ArrowRight size={18} />
            </a>
            <Text fontSize="sm" color="gray.500">
              oder
            </Text>
            <a
              href="/telegram-checkout"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 24px",
                backgroundColor: "white",
                color: TELEGRAM_BLUE,
                borderRadius: "8px",
                fontWeight: "600",
                textDecoration: "none",
                border: `1px solid ${TELEGRAM_BLUE}`,
                width: "100%",
                justifyContent: "center",
              }}
            >
              Neues Konto erstellen
              <ArrowRight size={18} />
            </a>
          </VStack>
          
          {/* Test-Link */}
          <Text fontSize="xs" color="gray.400" mt={6}>
            <a href="?test=1" style={{ textDecoration: "underline" }}>
              Test-Modus öffnen
            </a>
          </Text>
        </Box>
      </Flex>
    );
  }

  return (
    <Box minH="100vh" bg="gray.50" py={8} px={4}>
      <Box maxW="lg" mx="auto">
        {/* Header */}
        <VStack gap={4} mb={8} textAlign="center">
          <TelegramLogo size={56} color={TELEGRAM_BLUE} weight="fill" />
          <Heading size="xl">Telegram Account</Heading>
          <Text color="gray.600">
            Verwalte deine Telegram-Gruppen-Mitgliedschaft
          </Text>
        </VStack>

        {/* User Info */}
        <Box bg="white" p={6} borderRadius="xl" boxShadow="sm" mb={6}>
          <HStack gap={4} mb={4}>
            <Box
              bg="gray.100"
              borderRadius="full"
              p={3}
            >
              <User size={24} color="gray" />
            </Box>
            <Box>
              <Text fontWeight="semibold">
                {user?.firstName} {user?.lastName}
              </Text>
              <HStack gap={1} color="gray.500" fontSize="sm">
                <EnvelopeSimple size={14} />
                <Text>{user?.email}</Text>
              </HStack>
            </Box>
          </HStack>
        </Box>

        {/* Subscription Status */}
        <Box bg="white" p={6} borderRadius="xl" boxShadow="sm" mb={6}>
          <Heading size="md" mb={4}>
            Abo-Status
          </Heading>
          
          {member?.is_active ? (
            <Box
              bg="green.50"
              border="1px solid"
              borderColor="green.200"
              borderRadius="lg"
              p={4}
            >
              <HStack gap={3}>
                <CheckCircle size={24} color="#22c55e" weight="fill" />
                <Box>
                  <Text fontWeight="semibold" color="green.800">
                    Aktives Abonnement
                  </Text>
                  <Text fontSize="sm" color="green.700">
                    Du hast Zugang zur Trading-Signale Gruppe.
                  </Text>
                </Box>
              </HStack>
            </Box>
          ) : (
            <Box
              bg="gray.50"
              border="1px solid"
              borderColor="gray.200"
              borderRadius="lg"
              p={4}
            >
              <HStack gap={3}>
                <XCircle size={24} color="#6b7280" weight="fill" />
                <Box>
                  <Text fontWeight="semibold" color="gray.700">
                    Kein aktives Abonnement
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    Werde Mitglied um Zugang zu erhalten.
                  </Text>
                </Box>
              </HStack>
              <a
                href="/telegram-checkout"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  marginTop: "16px",
                  padding: "10px 20px",
                  backgroundColor: TELEGRAM_BLUE,
                  color: "white",
                  borderRadius: "8px",
                  fontWeight: "600",
                  textDecoration: "none",
                }}
              >
                Jetzt Mitglied werden
                <ArrowRight size={16} />
              </a>
            </Box>
          )}
        </Box>

        {/* Telegram Linking */}
        <Box bg="white" p={6} borderRadius="xl" boxShadow="sm" mb={6}>
          <Heading size="md" mb={4}>
            Telegram verknüpfen
          </Heading>

          {member?.is_in_group ? (
            <Box
              bg="blue.50"
              border="1px solid"
              borderColor="blue.200"
              borderRadius="lg"
              p={4}
            >
              <HStack gap={3}>
                <LinkIcon size={24} color={TELEGRAM_BLUE} weight="fill" />
                <Box>
                  <Text fontWeight="semibold" color="blue.800">
                    Telegram verknüpft
                  </Text>
                  {member.telegram_username && (
                    <Text fontSize="sm" color="blue.700">
                      @{member.telegram_username}
                    </Text>
                  )}
                </Box>
              </HStack>
            </Box>
          ) : linkingStatus === "success" ? (
            <Box
              bg="green.50"
              border="1px solid"
              borderColor="green.200"
              borderRadius="lg"
              p={4}
            >
              <HStack gap={3}>
                <CheckCircle size={24} color="#22c55e" weight="fill" />
                <Box>
                  <Text fontWeight="semibold" color="green.800">
                    Verifizierung gesendet!
                  </Text>
                  <Text fontSize="sm" color="green.700">
                    Öffne Telegram und bestätige die Nachricht vom Bot.
                  </Text>
                </Box>
              </HStack>
            </Box>
          ) : (
            <VStack align="stretch" gap={4}>
              <Text fontSize="sm" color="gray.600">
                Gib deinen Telegram-Benutzernamen ein um deinen Account zu verknüpfen.
              </Text>
              <HStack gap={2}>
                <Input
                  placeholder="@username"
                  value={telegramUsername}
                  onChange={(e) => setTelegramUsername(e.target.value)}
                  disabled={linkingStatus === "loading"}
                />
                <button
                  onClick={handleLinkTelegram}
                  disabled={linkingStatus === "loading"}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: TELEGRAM_BLUE,
                    color: "white",
                    borderRadius: "8px",
                    border: "none",
                    fontWeight: "600",
                    cursor: linkingStatus === "loading" ? "not-allowed" : "pointer",
                    opacity: linkingStatus === "loading" ? 0.7 : 1,
                    whiteSpace: "nowrap",
                  }}
                >
                  {linkingStatus === "loading" ? "..." : "Verknüpfen"}
                </button>
              </HStack>
              {linkingError && (
                <Text color="red.500" fontSize="sm">
                  {linkingError}
                </Text>
              )}
            </VStack>
          )}
        </Box>

        {/* Manage Subscription */}
        {member?.is_active && (
          <Box bg="white" p={6} borderRadius="xl" boxShadow="sm">
            <Heading size="md" mb={4}>
              Abo verwalten
            </Heading>
            <Text fontSize="sm" color="gray.600" mb={4}>
              Hier kannst du dein Abonnement verwalten, Zahlungsmethode ändern oder kündigen.
            </Text>
            <a
              href="#"
              data-o-account="1"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 20px",
                backgroundColor: "white",
                color: "gray",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                fontWeight: "500",
                textDecoration: "none",
              }}
            >
              Abo-Einstellungen öffnen
              <ArrowRight size={16} />
            </a>
          </Box>
        )}

        {/* Support */}
        <Box mt={8} textAlign="center">
          <Text fontSize="sm" color="gray.500">
            Fragen? Schreibe uns an{" "}
            <a
              href="mailto:support@snttrades.de"
              style={{ color: TELEGRAM_BLUE, textDecoration: "underline" }}
            >
              support@snttrades.de
            </a>
          </Text>
        </Box>

        {/* Test-Modus Panel (nur wenn ?test=1 in URL) */}
        {testMode && (
          <Box 
            mt={8} 
            bg="yellow.50" 
            border="2px dashed" 
            borderColor="yellow.400" 
            borderRadius="xl" 
            p={6}
          >
            <HStack gap={2} mb={4}>
              <Bug size={24} color="#ca8a04" weight="fill" />
              <Heading size="md" color="yellow.800">
                Test-Modus
              </Heading>
            </HStack>
            
            <VStack align="stretch" gap={4}>
              <Box>
                <Text fontSize="sm" color="yellow.800" mb={2}>
                  Telegram User ID (vom Bot /start Command):
                </Text>
                <Input
                  placeholder="z.B. 123456789"
                  value={telegramUserId}
                  onChange={(e) => setTelegramUserId(e.target.value)}
                  bg="white"
                />
              </Box>

              <button
                onClick={handleTestActivation}
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#ca8a04",
                  color: "white",
                  borderRadius: "8px",
                  border: "none",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                🧪 Test-Aktivierung (ohne Zahlung)
              </button>

              {testResult && (
                <Box 
                  bg="white" 
                  p={3} 
                  borderRadius="lg"
                  fontFamily="mono"
                  fontSize="sm"
                  whiteSpace="pre-wrap"
                  wordBreak="break-all"
                >
                  {testResult}
                </Box>
              )}

              <Text fontSize="xs" color="yellow.700">
                Dieser Bereich ist nur sichtbar wenn ?test=1 in der URL ist.
                <br />
                Die Test-Aktivierung fügt den User zur Datenbank hinzu und sendet einen Einladungslink.
              </Text>
            </VStack>
          </Box>
        )}
      </Box>
    </Box>
  );
}

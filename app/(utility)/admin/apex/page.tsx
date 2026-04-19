"use client";

import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Input,
  Stack,
  Text,
  VStack,
  HStack,
  Badge,
  Table,
  Spinner,
  IconButton,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { NativeSelectField, NativeSelectRoot } from "@chakra-ui/react";
import NextLink from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowSquareOut,
  CalendarCheck,
  ChartBar,
  Copy,
  Eye,
  Funnel,
  Lock,
  Pulse,
  Users,
} from "@phosphor-icons/react";

// ─── Types ───────────────────────────────────────────────────────────────────

type ProtocolLead = {
  id: string;
  lead_id: string;
  status: "submitted" | "booked" | "completed" | "no_show";
  trading_duration: string;
  current_level: string;
  holding_back: string;
  snt_duration: string;
  snt_source: string | null;
  investment_willingness: string;
  why_candidate: string;
  invitee_name: string | null;
  invitee_email: string | null;
  invitee_phone: string | null;
  scheduled_at: string | null;
  cancelled_at: string | null;
  created_at: string;
  booked_at: string | null;
};

type ProtocolStats = {
  period: string;
  funnel: {
    page_views: number;
    form_opens: number;
    step_1_complete: number;
    step_2_complete: number;
    step_3_complete: number;
    form_submits: number;
    calendly_redirects: number;
    calendly_booked: number;
  };
  leads: {
    total: number;
    submitted: number;
    booked: number;
    completed: number;
    no_show: number;
  };
  conversion: {
    view_to_form: string;
    form_to_submit: string;
    submit_to_book: string;
    view_to_book: string;
  };
};

type ProtocolSettings = {
  vimeo_video_id: string;
  calendly_url: string;
};

const ADMIN_USERNAME =
  process.env.NEXT_PUBLIC_AFFILIATE_ADMIN_USERNAME ?? "admin";
const ADMIN_PASSWORD =
  process.env.NEXT_PUBLIC_AFFILIATE_ADMIN_PASSWORD ?? "sntsecure";

const PURPLE = "#8B5CF6";
const PURPLE_DARK = "#7C3AED";
const PURPLE_LIGHT = "#C4B5FD";

const STATUS_COLORS: Record<string, string> = {
  submitted: "blue",
  booked: "green",
  completed: "purple",
  no_show: "red",
};

const STATUS_LABELS: Record<string, string> = {
  submitted: "Eingereicht",
  booked: "Gebucht",
  completed: "Abgeschlossen",
  no_show: "No-Show",
};

const numberPulse = keyframes({
  "0%, 100%": { textShadow: `0 0 24px rgba(139, 92, 246, 0.45)` },
  "50%": { textShadow: `0 0 40px rgba(139, 92, 246, 0.8), 0 0 80px rgba(139, 92, 246, 0.25)` },
});

// ─── Page Component ──────────────────────────────────────────────────────────

export default function ApexAdminPage() {
  const [adminCredentials, setAdminCredentials] = useState<{
    username: string;
    password: string;
  } | null>(null);
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Protocol / Apex states
  const [leads, setLeads] = useState<ProtocolLead[]>([]);
  const [stats, setStats] = useState<ProtocolStats | null>(null);
  const [settings, setSettings] = useState<ProtocolSettings>({
    vimeo_video_id: "",
    calendly_url: "",
  });
  const [statsPeriod, setStatsPeriod] = useState<
    "today" | "week" | "month" | "all"
  >("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLead, setSelectedLead] = useState<ProtocolLead | null>(null);
  const [vimeoInput, setVimeoInput] = useState("");
  const [calendlyInput, setCalendlyInput] = useState("");
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [copyFlash, setCopyFlash] = useState(false);

  const isAuthenticated = Boolean(adminCredentials);

  const headers = useMemo(
    () =>
      adminCredentials
        ? {
            "x-admin-username": adminCredentials.username,
            "x-admin-password": adminCredentials.password,
            "Content-Type": "application/json",
          }
        : null,
    [adminCredentials]
  );

  const baseUrl = useMemo(() => {
    if (typeof window === "undefined")
      return "https://www.snt-mentorship-platform.de";
    return window.location.origin;
  }, []);

  const notify = (msg: string | null) => setStatusMessage(msg);

  useEffect(() => {
    const cached = sessionStorage.getItem("snt_affiliate_admin_credentials");
    if (cached) {
      try {
        setAdminCredentials(JSON.parse(cached));
      } catch {
        // ignore
      }
    }
  }, []);

  const persistAdminCredentials = (value: {
    username: string;
    password: string;
  }) => {
    sessionStorage.setItem(
      "snt_affiliate_admin_credentials",
      JSON.stringify(value)
    );
    setAdminCredentials(value);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      credentials.username.trim() === ADMIN_USERNAME &&
      credentials.password.trim() === ADMIN_PASSWORD
    ) {
      persistAdminCredentials(credentials);
      notify(null);
    } else {
      notify("Falscher Benutzername oder Passwort.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("snt_affiliate_admin_credentials");
    setAdminCredentials(null);
    setLeads([]);
    setStats(null);
  };

  const fetchData = useCallback(
    async (period = statsPeriod) => {
      if (!headers) return;
      setIsLoading(true);
      try {
        const [leadsRes, statsRes, settingsRes] = await Promise.all([
          fetch(`/api/admin/protocol/leads?status=${statusFilter}&limit=100`, {
            headers,
          }),
          fetch(`/api/admin/protocol/stats?period=${period}`, { headers }),
          fetch("/api/admin/protocol/settings", { headers }),
        ]);
        if (leadsRes.ok) {
          const data = await leadsRes.json();
          setLeads(data.leads ?? []);
        }
        if (statsRes.ok) {
          const data = await statsRes.json();
          setStats(data);
        }
        if (settingsRes.ok) {
          const data = await settingsRes.json();
          setSettings(data);
          setVimeoInput(data.vimeo_video_id ?? "");
          setCalendlyInput(data.calendly_url ?? "");
        }
      } catch (err) {
        console.error("Fehler beim Laden der APEX-Daten:", err);
        notify("Fehler beim Laden der Daten.");
      } finally {
        setIsLoading(false);
      }
    },
    [headers, statusFilter, statsPeriod]
  );

  useEffect(() => {
    if (isAuthenticated) fetchData(statsPeriod);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, statusFilter]);

  const handleSaveSettings = async () => {
    if (!headers) return;
    setIsSavingSettings(true);
    try {
      const res = await fetch("/api/admin/protocol/settings", {
        method: "PUT",
        headers,
        body: JSON.stringify({
          vimeo_video_id: vimeoInput,
          calendly_url: calendlyInput,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
        notify("Einstellungen gespeichert.");
      } else {
        const data = await res.json().catch(() => ({}));
        notify(data.error ?? "Fehler beim Speichern.");
      }
    } catch {
      notify("Fehler beim Speichern.");
    } finally {
      setIsSavingSettings(false);
    }
  };

  const filteredLeads = leads.filter(
    (l) => statusFilter === "all" || l.status === statusFilter
  );

  const calendlyRedirectUrl = `${baseUrl}/apex/booked`;

  const handleCopyCalendly = () => {
    navigator.clipboard.writeText(calendlyRedirectUrl).then(() => {
      setCopyFlash(true);
      setTimeout(() => setCopyFlash(false), 1500);
    });
  };

  const periodLabel = useMemo(() => {
    switch (statsPeriod) {
      case "today":
        return "Heute";
      case "week":
        return "Letzte 7 Tage";
      case "month":
        return "Letzte 30 Tage";
      default:
        return "Gesamt";
    }
  }, [statsPeriod]);

  // ─── Login Screen ──────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <Box
        minH="100vh"
        bg="black"
        display="flex"
        alignItems="center"
        justifyContent="center"
        p="4"
        background={`radial-gradient(at 50% 30%, rgba(139, 92, 246, 0.12) 0%, transparent 60%),
          linear-gradient(180deg, #000 0%, #060812 100%)`}
      >
        <Box
          maxW="420px"
          w="full"
          bg="rgba(10, 12, 22, 0.85)"
          backdropFilter="blur(20px)"
          p="8"
          borderRadius="2xl"
          border="1px solid rgba(139, 92, 246, 0.2)"
          boxShadow="0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(139, 92, 246, 0.06) inset"
        >
          <VStack gap="6" align="stretch">
            <VStack gap="2" textAlign="center">
              <Box
                w="48px"
                h="48px"
                mx="auto"
                borderRadius="xl"
                bg={`linear-gradient(135deg, ${PURPLE} 0%, ${PURPLE_DARK} 100%)`}
                display="flex"
                alignItems="center"
                justifyContent="center"
                boxShadow={`0 8px 24px rgba(139, 92, 246, 0.4)`}
              >
                <Lock size={22} color="white" weight="fill" />
              </Box>
              <Heading size="lg" color="white" mt="2">
                SNT APEX Admin
              </Heading>
              <Text fontSize="sm" color="gray.400">
                Bitte einloggen, um fortzufahren.
              </Text>
            </VStack>
            <form onSubmit={handleLogin}>
              <VStack gap="3" align="stretch">
                <Input
                  placeholder="Benutzername"
                  value={credentials.username}
                  onChange={(e) =>
                    setCredentials({ ...credentials, username: e.target.value })
                  }
                  bg="rgba(255,255,255,0.04)"
                  borderColor="rgba(139, 92, 246, 0.3)"
                  color="white"
                  _placeholder={{ color: "gray.500" }}
                  _focus={{
                    borderColor: PURPLE,
                    boxShadow: `0 0 0 1px ${PURPLE}`,
                  }}
                />
                <Input
                  type="password"
                  placeholder="Passwort"
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials({ ...credentials, password: e.target.value })
                  }
                  bg="rgba(255,255,255,0.04)"
                  borderColor="rgba(139, 92, 246, 0.3)"
                  color="white"
                  _placeholder={{ color: "gray.500" }}
                  _focus={{
                    borderColor: PURPLE,
                    boxShadow: `0 0 0 1px ${PURPLE}`,
                  }}
                />
                {statusMessage && (
                  <Text fontSize="xs" color="red.400" textAlign="center">
                    {statusMessage}
                  </Text>
                )}
                <Button
                  type="submit"
                  bg={PURPLE}
                  color="white"
                  _hover={{ bg: PURPLE_DARK }}
                  h="44px"
                  fontWeight="bold"
                >
                  Einloggen
                </Button>
              </VStack>
            </form>
            <NextLink href="/admin" style={{ alignSelf: "center" }}>
              <Text
                fontSize="xs"
                color="gray.500"
                _hover={{ color: PURPLE_LIGHT }}
              >
                ← Zurück zur Admin-Startseite
              </Text>
            </NextLink>
          </VStack>
        </Box>
      </Box>
    );
  }

  // ─── Dashboard ─────────────────────────────────────────────────────────────
  const totalBookedCalls = stats
    ? stats.leads.booked + stats.leads.completed
    : 0;
  const totalPageviews = stats?.funnel.page_views ?? 0;

  return (
    <Box
      minH="100vh"
      bg="black"
      color="white"
      px={{ base: "4", md: "8" }}
      pt={{ base: "5", md: "8" }}
      pb="12"
      background={`radial-gradient(at 20% 0%, rgba(139, 92, 246, 0.08) 0px, transparent 50%),
        radial-gradient(at 80% 0%, rgba(124, 58, 237, 0.06) 0px, transparent 50%),
        linear-gradient(180deg, #000 0%, #060812 100%)`}
    >
      <Box maxW="1400px" mx="auto">
        <VStack gap="6" align="stretch">
          {/* Top bar */}
          <HStack justify="space-between" flexWrap="wrap" gap="3">
            <HStack gap="3">
              <NextLink href="/admin">
                <IconButton
                  aria-label="Zurück"
                  variant="ghost"
                  size="sm"
                  color="gray.400"
                  _hover={{ color: "white", bg: "rgba(255,255,255,0.05)" }}
                >
                  <ArrowLeft size={20} />
                </IconButton>
              </NextLink>
              <VStack align="start" gap="0">
                <HStack gap="2">
                  <ChartBar size={22} color={PURPLE} weight="fill" />
                  <Heading size="md" color="white">
                    SNT APEX, Funnel
                  </Heading>
                  <Badge
                    bg="rgba(139, 92, 246, 0.18)"
                    color={PURPLE_LIGHT}
                    fontSize="2xs"
                    px="2"
                    py="0.5"
                    border={`1px solid rgba(139, 92, 246, 0.4)`}
                    textTransform="uppercase"
                    letterSpacing="wider"
                  >
                    Live
                  </Badge>
                </HStack>
                <Text fontSize="xs" color="gray.500">
                  {periodLabel} · Pageviews, Bewerbungen, Calls
                </Text>
              </VStack>
            </HStack>
            <HStack gap="2">
              <NextLink href="/apex" target="_blank">
                <Button
                  size="sm"
                  variant="outline"
                  borderColor="rgba(139, 92, 246, 0.4)"
                  color={PURPLE_LIGHT}
                  _hover={{
                    bg: "rgba(139, 92, 246, 0.1)",
                    borderColor: PURPLE,
                  }}
                >
                  <HStack gap="1.5">
                    <ArrowSquareOut size={14} />
                    <Text>Funnel öffnen</Text>
                  </HStack>
                </Button>
              </NextLink>
              <Button
                size="sm"
                variant="ghost"
                color="gray.400"
                _hover={{ color: "white", bg: "rgba(255,255,255,0.05)" }}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </HStack>
          </HStack>

          {/* Status banner */}
          {statusMessage && (
            <Box
              p="3"
              borderRadius="lg"
              bg="rgba(139, 92, 246, 0.08)"
              borderWidth="1px"
              borderColor="rgba(139, 92, 246, 0.3)"
            >
              <Text fontSize="sm" color={PURPLE_LIGHT}>
                {statusMessage}
              </Text>
            </Box>
          )}

          {/* Period filter */}
          <HStack
            justify="space-between"
            flexWrap="wrap"
            gap="3"
            bg="rgba(10, 12, 22, 0.6)"
            p="3"
            borderRadius="xl"
            border="1px solid rgba(255,255,255,0.05)"
            backdropFilter="blur(12px)"
          >
            <HStack gap="2" pl="2">
              <Pulse size={16} color={PURPLE_LIGHT} weight="fill" />
              <Text color="gray.300" fontSize="sm" fontWeight="semibold">
                Zeitraum
              </Text>
            </HStack>
            <HStack gap="2">
              <NativeSelectRoot size="sm" minW="160px">
                <NativeSelectField
                  value={statsPeriod}
                  onChange={(e) => {
                    const p = e.target.value as
                      | "today"
                      | "week"
                      | "month"
                      | "all";
                    setStatsPeriod(p);
                    fetchData(p);
                  }}
                  bg="rgba(255,255,255,0.04)"
                  color="white"
                  borderColor="rgba(139, 92, 246, 0.3)"
                  borderRadius="md"
                >
                  <option value="today" style={{ background: "#0a0c16" }}>
                    Heute
                  </option>
                  <option value="week" style={{ background: "#0a0c16" }}>
                    Letzte 7 Tage
                  </option>
                  <option value="month" style={{ background: "#0a0c16" }}>
                    Letzte 30 Tage
                  </option>
                  <option value="all" style={{ background: "#0a0c16" }}>
                    Gesamt
                  </option>
                </NativeSelectField>
              </NativeSelectRoot>
              <Button
                size="sm"
                variant="outline"
                borderColor="rgba(139, 92, 246, 0.4)"
                color={PURPLE_LIGHT}
                _hover={{
                  bg: "rgba(139, 92, 246, 0.1)",
                  borderColor: PURPLE,
                }}
                onClick={() => fetchData(statsPeriod)}
                loading={isLoading}
              >
                Aktualisieren
              </Button>
            </HStack>
          </HStack>

          {/* ─── HERO METRICS — pageviews & booked calls ─────────────── */}
          <Grid
            templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
            gap={{ base: "4", md: "5" }}
          >
            <HeroMetric
              icon={<Eye size={28} color={PURPLE_LIGHT} weight="fill" />}
              label="Pageviews"
              sublabel={`Besucher der /apex Seite`}
              value={totalPageviews}
              accentColor={PURPLE_LIGHT}
              animated
            />
            <HeroMetric
              icon={<CalendarCheck size={28} color="#34D399" weight="fill" />}
              label="Calls gebucht"
              sublabel={
                stats
                  ? `${stats.leads.booked} aktiv · ${stats.leads.completed} abgeschlossen`
                  : ""
              }
              value={totalBookedCalls}
              accentColor="#34D399"
              animated
              gradient="linear-gradient(135deg, rgba(52, 211, 153, 0.18) 0%, rgba(16, 185, 129, 0.05) 100%)"
              borderAccent="rgba(52, 211, 153, 0.4)"
            />
          </Grid>

          {/* Conversion summary card */}
          {stats && (
            <Box
              bg="rgba(10, 12, 22, 0.7)"
              backdropFilter="blur(16px)"
              borderWidth="1px"
              borderColor="rgba(139, 92, 246, 0.18)"
              borderRadius="xl"
              p={{ base: "4", md: "6" }}
              position="relative"
              overflow="hidden"
            >
              <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                h="2px"
                background={`linear-gradient(90deg, transparent, ${PURPLE}, transparent)`}
              />
              <HStack justify="space-between" align="center" mb="2" flexWrap="wrap" gap="2">
                <Text fontSize="sm" color="gray.400" fontWeight="semibold" textTransform="uppercase" letterSpacing="wider">
                  Conversion Rate
                </Text>
                <Text fontSize="xs" color="gray.500">
                  Pageview → Gebuchter Call
                </Text>
              </HStack>
              <HStack align="baseline" gap="3" mb="3">
                <Text
                  fontSize={{ base: "5xl", md: "6xl" }}
                  fontWeight="900"
                  color="white"
                  fontFamily="mono"
                  lineHeight="1"
                  background={`linear-gradient(180deg, #fff 0%, ${PURPLE_LIGHT} 100%)`}
                  backgroundClip="text"
                  css={{
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {stats.conversion.view_to_book}
                  <Box as="span" fontSize={{ base: "2xl", md: "3xl" }} color={PURPLE_LIGHT} ml="1">
                    %
                  </Box>
                </Text>
                <Text fontSize="sm" color="gray.500">
                  {totalBookedCalls} von {totalPageviews} Visitors
                </Text>
              </HStack>
              <Box h="8px" bg="rgba(255,255,255,0.05)" borderRadius="full" overflow="hidden">
                <Box
                  h="full"
                  borderRadius="full"
                  background={`linear-gradient(90deg, ${PURPLE}, ${PURPLE_LIGHT})`}
                  w={`${Math.min(parseFloat(stats.conversion.view_to_book), 100)}%`}
                  boxShadow={`0 0 16px rgba(139, 92, 246, 0.7)`}
                  transition="width 0.6s cubic-bezier(0.22, 1, 0.36, 1)"
                />
              </Box>
            </Box>
          )}

          {/* ─── Funnel breakdown ─────────────────────────────────────── */}
          {stats && (
            <Box
              bg="rgba(10, 12, 22, 0.7)"
              backdropFilter="blur(16px)"
              borderWidth="1px"
              borderColor="rgba(255,255,255,0.05)"
              borderRadius="xl"
              p={{ base: "4", md: "6" }}
            >
              <HStack mb="5" gap="2">
                <Funnel size={18} color={PURPLE_LIGHT} weight="fill" />
                <Text fontWeight="bold" color="white" fontSize="sm" textTransform="uppercase" letterSpacing="wider">
                  Funnel-Aufschlüsselung
                </Text>
              </HStack>
              <VStack gap="4" align="stretch">
                <FunnelBar
                  label="Pageview → Form geöffnet"
                  from={stats.funnel.page_views}
                  to={stats.funnel.form_opens}
                  percent={stats.conversion.view_to_form}
                  color={PURPLE_LIGHT}
                />
                <FunnelBar
                  label="Form geöffnet → Bewerbung abgesendet"
                  from={stats.funnel.form_opens}
                  to={stats.leads.total}
                  percent={stats.conversion.form_to_submit}
                  color="#FBBF24"
                />
                <FunnelBar
                  label="Bewerbung → Call gebucht"
                  from={stats.leads.total}
                  to={totalBookedCalls}
                  percent={stats.conversion.submit_to_book}
                  color="#34D399"
                />
              </VStack>

              {/* Mini step counts */}
              <Grid
                templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }}
                gap="2"
                mt="6"
              >
                {[
                  { label: "Step 1 ✓", value: stats.funnel.step_1_complete },
                  { label: "Step 2 ✓", value: stats.funnel.step_2_complete },
                  { label: "Step 3 ✓", value: stats.funnel.step_3_complete },
                  { label: "→ Calendly", value: stats.funnel.calendly_redirects },
                ].map(({ label, value }) => (
                  <Box
                    key={label}
                    bg="rgba(255,255,255,0.03)"
                    borderWidth="1px"
                    borderColor="rgba(255,255,255,0.06)"
                    borderRadius="md"
                    p="3"
                  >
                    <Text fontSize="2xs" color="gray.500" textTransform="uppercase" letterSpacing="wider">
                      {label}
                    </Text>
                    <Text fontWeight="bold" fontSize="lg" color="white">
                      {value.toLocaleString("de-DE")}
                    </Text>
                  </Box>
                ))}
              </Grid>
            </Box>
          )}

          {/* ─── Bewerbungen / Leads ──────────────────────────────────── */}
          <Box
            bg="rgba(10, 12, 22, 0.7)"
            backdropFilter="blur(16px)"
            borderWidth="1px"
            borderColor="rgba(255,255,255,0.05)"
            borderRadius="xl"
            p={{ base: "4", md: "6" }}
          >
            <HStack justify="space-between" mb="4" flexWrap="wrap" gap="2">
              <HStack gap="2">
                <Users size={18} color={PURPLE_LIGHT} weight="fill" />
                <Text fontWeight="bold" fontSize="sm" color="white" textTransform="uppercase" letterSpacing="wider">
                  Bewerbungen
                </Text>
                <Badge
                  bg="rgba(139, 92, 246, 0.15)"
                  color={PURPLE_LIGHT}
                  fontSize="2xs"
                  px="2"
                  py="0.5"
                  border={`1px solid rgba(139, 92, 246, 0.3)`}
                >
                  {filteredLeads.length}
                </Badge>
              </HStack>
              <NativeSelectRoot maxW="200px" size="sm">
                <NativeSelectField
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  bg="rgba(255,255,255,0.04)"
                  color="white"
                  borderColor="rgba(139, 92, 246, 0.3)"
                  borderRadius="md"
                >
                  <option value="all" style={{ background: "#0a0c16" }}>Alle Status</option>
                  <option value="submitted" style={{ background: "#0a0c16" }}>Eingereicht</option>
                  <option value="booked" style={{ background: "#0a0c16" }}>Gebucht</option>
                  <option value="completed" style={{ background: "#0a0c16" }}>Abgeschlossen</option>
                  <option value="no_show" style={{ background: "#0a0c16" }}>No-Show</option>
                </NativeSelectField>
              </NativeSelectRoot>
            </HStack>

            {isLoading ? (
              <Flex justify="center" py="10">
                <Spinner size="lg" color={PURPLE} />
              </Flex>
            ) : (
              <Box
                borderWidth="1px"
                borderColor="rgba(255,255,255,0.06)"
                borderRadius="lg"
                overflow="auto"
              >
                <Table.Root size="sm">
                  <Table.Header>
                    <Table.Row bg="rgba(255,255,255,0.03)">
                      <Table.ColumnHeader color="gray.400" fontWeight="semibold" textTransform="uppercase" letterSpacing="wider" fontSize="2xs">
                        Datum
                      </Table.ColumnHeader>
                      <Table.ColumnHeader color="gray.400" fontWeight="semibold" textTransform="uppercase" letterSpacing="wider" fontSize="2xs">
                        Status
                      </Table.ColumnHeader>
                      <Table.ColumnHeader color="gray.400" fontWeight="semibold" textTransform="uppercase" letterSpacing="wider" fontSize="2xs">
                        Dauer
                      </Table.ColumnHeader>
                      <Table.ColumnHeader color="gray.400" fontWeight="semibold" textTransform="uppercase" letterSpacing="wider" fontSize="2xs">
                        Level
                      </Table.ColumnHeader>
                      <Table.ColumnHeader color="gray.400" fontWeight="semibold" textTransform="uppercase" letterSpacing="wider" fontSize="2xs">
                        Investition
                      </Table.ColumnHeader>
                      <Table.ColumnHeader color="gray.400" fontWeight="semibold" textTransform="uppercase" letterSpacing="wider" fontSize="2xs">
                        Termin
                      </Table.ColumnHeader>
                      <Table.ColumnHeader color="gray.400" fontWeight="semibold" textTransform="uppercase" letterSpacing="wider" fontSize="2xs">
                        Aktion
                      </Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {filteredLeads.length === 0 ? (
                      <Table.Row>
                        <Table.Cell colSpan={7}>
                          <VStack gap="2" py="8">
                            <Users size={28} color="#444" />
                            <Text textAlign="center" color="gray.500" fontSize="sm">
                              Noch keine Bewerbungen in diesem Filter.
                            </Text>
                          </VStack>
                        </Table.Cell>
                      </Table.Row>
                    ) : (
                      filteredLeads.map((lead) => (
                        <Table.Row
                          key={lead.id}
                          _hover={{ bg: "rgba(139, 92, 246, 0.04)" }}
                          transition="background 0.15s ease"
                        >
                          <Table.Cell fontSize="xs" color="gray.300">
                            {new Date(lead.created_at).toLocaleDateString("de-DE")}
                          </Table.Cell>
                          <Table.Cell>
                            <Badge
                              colorPalette={STATUS_COLORS[lead.status] ?? "gray"}
                              fontSize="2xs"
                            >
                              {STATUS_LABELS[lead.status] ?? lead.status}
                            </Badge>
                          </Table.Cell>
                          <Table.Cell fontSize="xs" color="gray.400">
                            {lead.trading_duration}
                          </Table.Cell>
                          <Table.Cell
                            fontSize="xs"
                            color="gray.400"
                            maxW="180px"
                            overflow="hidden"
                            textOverflow="ellipsis"
                            whiteSpace="nowrap"
                          >
                            {lead.current_level}
                          </Table.Cell>
                          <Table.Cell fontSize="xs" color="gray.400">
                            {lead.investment_willingness}
                          </Table.Cell>
                          <Table.Cell
                            fontSize="xs"
                            color={lead.scheduled_at ? "#34D399" : "gray.500"}
                            fontWeight={lead.scheduled_at ? "semibold" : "normal"}
                          >
                            {lead.scheduled_at
                              ? new Date(lead.scheduled_at).toLocaleString("de-DE", {
                                  dateStyle: "short",
                                  timeStyle: "short",
                                })
                              : lead.invitee_name ?? "-"}
                          </Table.Cell>
                          <Table.Cell>
                            <Button
                              size="xs"
                              variant="outline"
                              borderColor="rgba(139, 92, 246, 0.3)"
                              color={PURPLE_LIGHT}
                              _hover={{
                                bg: "rgba(139, 92, 246, 0.1)",
                                borderColor: PURPLE,
                              }}
                              onClick={() => setSelectedLead(lead)}
                            >
                              <Eye size={14} />
                            </Button>
                          </Table.Cell>
                        </Table.Row>
                      ))
                    )}
                  </Table.Body>
                </Table.Root>
              </Box>
            )}
          </Box>

          {/* ─── Calendly Setup + Settings (collapsed visually) ─────── */}
          <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap="4">
            {/* Setup hint */}
            <Box
              p="5"
              borderRadius="xl"
              bg="rgba(139, 92, 246, 0.05)"
              borderWidth="1px"
              borderColor="rgba(139, 92, 246, 0.18)"
              backdropFilter="blur(12px)"
            >
              <HStack mb="3" gap="2">
                <CalendarCheck size={18} color={PURPLE_LIGHT} weight="fill" />
                <Text fontWeight="bold" color="white" fontSize="sm" textTransform="uppercase" letterSpacing="wider">
                  Calendly Setup
                </Text>
              </HStack>
              <Text fontSize="xs" color="gray.400" mb="3" lineHeight="1.6">
                In Calendly im Event-Type unter <em>Confirmation page → Redirect to an external site</em> die folgende
                URL eintragen und {"\""}Pass event details to your redirected page{"\""} aktivieren:
              </Text>
              <Box
                as="button"
                w="full"
                onClick={handleCopyCalendly}
                p="3"
                borderRadius="md"
                bg="rgba(0,0,0,0.4)"
                border={`1px solid ${copyFlash ? "rgba(52, 211, 153, 0.6)" : "rgba(139, 92, 246, 0.3)"}`}
                fontFamily="mono"
                fontSize="xs"
                color={copyFlash ? "#34D399" : PURPLE_LIGHT}
                cursor="pointer"
                transition="all 0.2s ease"
                _hover={{
                  bg: "rgba(0,0,0,0.6)",
                  borderColor: PURPLE,
                }}
                textAlign="left"
              >
                <HStack justify="space-between" gap="2">
                  <Text overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
                    {calendlyRedirectUrl}
                  </Text>
                  <Box flexShrink={0}>
                    {copyFlash ? (
                      <Text fontSize="2xs" color="#34D399" fontWeight="bold">
                        ✓ KOPIERT
                      </Text>
                    ) : (
                      <Copy size={14} />
                    )}
                  </Box>
                </HStack>
              </Box>
            </Box>

            {/* Settings */}
            <Box
              p="5"
              borderRadius="xl"
              bg="rgba(10, 12, 22, 0.7)"
              borderWidth="1px"
              borderColor="rgba(255,255,255,0.05)"
              backdropFilter="blur(12px)"
            >
              <HStack mb="3" gap="2">
                <ChartBar size={18} color={PURPLE_LIGHT} weight="fill" />
                <Text fontWeight="bold" color="white" fontSize="sm" textTransform="uppercase" letterSpacing="wider">
                  Video & Calendly
                </Text>
              </HStack>
              <VStack gap="3" align="stretch">
                <Stack gap="1">
                  <Text fontSize="xs" color="gray.400" fontWeight="medium">
                    Vimeo Video ID
                  </Text>
                  <Input
                    placeholder="z.B. 1177003953"
                    value={vimeoInput}
                    onChange={(e) => setVimeoInput(e.target.value)}
                    bg="rgba(255,255,255,0.04)"
                    color="white"
                    borderColor="rgba(139, 92, 246, 0.25)"
                    _placeholder={{ color: "gray.600" }}
                    _focus={{
                      borderColor: PURPLE,
                      boxShadow: `0 0 0 1px ${PURPLE}`,
                    }}
                    size="sm"
                  />
                </Stack>
                <Stack gap="1">
                  <Text fontSize="xs" color="gray.400" fontWeight="medium">
                    Calendly URL
                  </Text>
                  <Input
                    placeholder="https://calendly.com/..."
                    value={calendlyInput}
                    onChange={(e) => setCalendlyInput(e.target.value)}
                    bg="rgba(255,255,255,0.04)"
                    color="white"
                    borderColor="rgba(139, 92, 246, 0.25)"
                    _placeholder={{ color: "gray.600" }}
                    _focus={{
                      borderColor: PURPLE,
                      boxShadow: `0 0 0 1px ${PURPLE}`,
                    }}
                    size="sm"
                  />
                </Stack>
                <Button
                  bg={PURPLE}
                  color="white"
                  _hover={{ bg: PURPLE_DARK }}
                  size="sm"
                  onClick={handleSaveSettings}
                  loading={isSavingSettings}
                  fontWeight="bold"
                >
                  Einstellungen speichern
                </Button>
              </VStack>
            </Box>
          </Grid>

          {/* Footer */}
          <HStack justify="center" pt="4" pb="2">
            <Text fontSize="2xs" color="gray.600" textTransform="uppercase" letterSpacing="wider">
              SNT APEX Admin · {settings.calendly_url ? "Calendly verbunden" : "Kein Calendly konfiguriert"}
            </Text>
          </HStack>
        </VStack>
      </Box>

      {/* ─── Lead Detail Modal ────────────────────────────────────────── */}
      {selectedLead && (
        <Box
          position="fixed"
          inset="0"
          bg="rgba(0, 0, 0, 0.8)"
          backdropFilter="blur(8px)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          zIndex="1000"
          onClick={() => setSelectedLead(null)}
          p="4"
        >
          <Box
            bg="rgba(10, 12, 22, 0.98)"
            color="white"
            p="6"
            borderRadius="2xl"
            border="1px solid rgba(139, 92, 246, 0.3)"
            boxShadow={`0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(139, 92, 246, 0.1) inset`}
            maxW="640px"
            w="full"
            maxH="90vh"
            overflowY="auto"
            onClick={(e) => e.stopPropagation()}
          >
            <VStack gap="4" align="stretch">
              <Flex justify="space-between" align="center">
                <Heading size="md" color="white">
                  Bewerbung Detail
                </Heading>
                <HStack gap="2">
                  <Badge
                    colorPalette={STATUS_COLORS[selectedLead.status] ?? "gray"}
                  >
                    {STATUS_LABELS[selectedLead.status] ?? selectedLead.status}
                  </Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    color="gray.400"
                    _hover={{ color: "white", bg: "rgba(255,255,255,0.05)" }}
                    onClick={() => setSelectedLead(null)}
                  >
                    ✕
                  </Button>
                </HStack>
              </Flex>

              {selectedLead.invitee_name && (
                <Box
                  p="3"
                  borderRadius="lg"
                  bg="rgba(52, 211, 153, 0.08)"
                  borderWidth="1px"
                  borderColor="rgba(52, 211, 153, 0.3)"
                >
                  <Text fontWeight="semibold" color="#34D399" mb="2" fontSize="sm">
                    Gebuchter Termin
                  </Text>
                  <Grid templateColumns="repeat(2, 1fr)" gap="2" fontSize="sm" color="gray.200">
                    <Text>
                      <Box as="span" color="gray.500">Name:</Box> {selectedLead.invitee_name}
                    </Text>
                    <Text>
                      <Box as="span" color="gray.500">E-Mail:</Box> {selectedLead.invitee_email}
                    </Text>
                    {selectedLead.invitee_phone && (
                      <Text>
                        <Box as="span" color="gray.500">Telefon:</Box> {selectedLead.invitee_phone}
                      </Text>
                    )}
                    {selectedLead.scheduled_at && (
                      <Text>
                        <Box as="span" color="gray.500">Termin:</Box>{" "}
                        {new Date(selectedLead.scheduled_at).toLocaleString("de-DE")}
                      </Text>
                    )}
                  </Grid>
                </Box>
              )}

              <Grid templateColumns="repeat(2, 1fr)" gap="3">
                <DetailItem label="Trading-Erfahrung" value={selectedLead.trading_duration} />
                <DetailItem label="Aktuelles Level" value={selectedLead.current_level} />
                <DetailItem label="SNT-Zugehörigkeit" value={selectedLead.snt_duration} />
                <DetailItem label="Investitionsbereitschaft" value={selectedLead.investment_willingness} />
                {selectedLead.snt_source && (
                  <DetailItem label="Quelle" value={selectedLead.snt_source} />
                )}
              </Grid>

              <Box>
                <Text fontSize="2xs" color="gray.500" mb="1.5" textTransform="uppercase" letterSpacing="wider" fontWeight="semibold">
                  Was hält ihn zurück?
                </Text>
                <Box
                  p="3"
                  bg="rgba(255,255,255,0.03)"
                  borderRadius="md"
                  borderWidth="1px"
                  borderColor="rgba(255,255,255,0.06)"
                  fontSize="sm"
                  color="gray.200"
                  lineHeight="1.6"
                  whiteSpace="pre-wrap"
                >
                  {selectedLead.holding_back}
                </Box>
              </Box>
              <Box>
                <Text fontSize="2xs" color="gray.500" mb="1.5" textTransform="uppercase" letterSpacing="wider" fontWeight="semibold">
                  Warum der richtige Kandidat?
                </Text>
                <Box
                  p="3"
                  bg="rgba(255,255,255,0.03)"
                  borderRadius="md"
                  borderWidth="1px"
                  borderColor="rgba(255,255,255,0.06)"
                  fontSize="sm"
                  color="gray.200"
                  lineHeight="1.6"
                  whiteSpace="pre-wrap"
                >
                  {selectedLead.why_candidate}
                </Box>
              </Box>

              <HStack justify="space-between" pt="2">
                <Text fontSize="xs" color="gray.500">
                  Eingereicht: {new Date(selectedLead.created_at).toLocaleString("de-DE")}
                </Text>
                <Button
                  variant="outline"
                  size="sm"
                  borderColor="rgba(139, 92, 246, 0.3)"
                  color={PURPLE_LIGHT}
                  _hover={{ bg: "rgba(139, 92, 246, 0.1)", borderColor: PURPLE }}
                  onClick={() => setSelectedLead(null)}
                >
                  Schließen
                </Button>
              </HStack>
            </VStack>
          </Box>
        </Box>
      )}
    </Box>
  );
}

// ─── Sub Components ──────────────────────────────────────────────────────────

function HeroMetric({
  icon,
  label,
  sublabel,
  value,
  accentColor,
  gradient,
  borderAccent,
  animated = false,
}: {
  icon: React.ReactNode;
  label: string;
  sublabel?: string;
  value: number;
  accentColor: string;
  gradient?: string;
  borderAccent?: string;
  animated?: boolean;
}) {
  return (
    <Box
      position="relative"
      p={{ base: "5", md: "7" }}
      borderRadius="2xl"
      bg="rgba(10, 12, 22, 0.85)"
      backdropFilter="blur(20px)"
      borderWidth="1px"
      borderColor={borderAccent ?? "rgba(139, 92, 246, 0.25)"}
      boxShadow={`0 18px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(139, 92, 246, 0.05) inset`}
      overflow="hidden"
      transition="all 0.3s ease"
      _hover={{
        transform: "translateY(-3px)",
        boxShadow: `0 24px 70px rgba(0,0,0,0.5), 0 0 30px rgba(139, 92, 246, 0.15)`,
      }}
    >
      {/* Top accent line */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        h="2px"
        background={`linear-gradient(90deg, transparent, ${accentColor}, transparent)`}
        opacity={0.7}
      />
      {/* Corner glow */}
      <Box
        position="absolute"
        top={0}
        right={0}
        w="200px"
        h="200px"
        background={
          gradient ??
          `radial-gradient(circle at top right, rgba(139, 92, 246, 0.18) 0%, transparent 65%)`
        }
        pointerEvents="none"
        opacity={0.8}
      />
      <VStack align="start" gap="3" position="relative">
        <HStack gap="3" w="full">
          <Box
            p="3"
            borderRadius="xl"
            bg={`linear-gradient(135deg, rgba(139, 92, 246, 0.18) 0%, rgba(139, 92, 246, 0.04) 100%)`}
            border={`1px solid rgba(139, 92, 246, 0.3)`}
            boxShadow={`0 4px 16px rgba(139, 92, 246, 0.15)`}
          >
            {icon}
          </Box>
          <VStack align="start" gap="0" flex={1}>
            <Text
              fontSize="xs"
              color="gray.400"
              textTransform="uppercase"
              letterSpacing="wider"
              fontWeight="semibold"
            >
              {label}
            </Text>
            {sublabel && (
              <Text fontSize="2xs" color="gray.500">
                {sublabel}
              </Text>
            )}
          </VStack>
        </HStack>

        <Text
          fontSize={{ base: "5xl", md: "6xl" }}
          fontWeight="900"
          color="white"
          lineHeight="1"
          fontFamily="mono"
          letterSpacing="-0.02em"
          animation={animated ? `${numberPulse} 3.6s ease-in-out infinite` : undefined}
        >
          {value.toLocaleString("de-DE")}
        </Text>
      </VStack>
    </Box>
  );
}

function FunnelBar({
  label,
  from,
  to,
  percent,
  color,
}: {
  label: string;
  from: number;
  to: number;
  percent: string;
  color: string;
}) {
  const pct = Math.min(parseFloat(percent), 100);
  return (
    <Box>
      <Flex justify="space-between" mb="1.5" align="baseline" gap="2" flexWrap="wrap">
        <Text fontSize="xs" color="gray.300" fontWeight="medium">
          {label}
        </Text>
        <HStack gap="2">
          <Text fontSize="xs" color="gray.500">
            {to.toLocaleString("de-DE")} / {from.toLocaleString("de-DE")}
          </Text>
          <Text fontSize="xs" fontWeight="bold" color={color} minW="48px" textAlign="right">
            {percent}%
          </Text>
        </HStack>
      </Flex>
      <Box h="8px" bg="rgba(255,255,255,0.04)" borderRadius="full" overflow="hidden">
        <Box
          h="full"
          borderRadius="full"
          background={`linear-gradient(90deg, ${color}, ${color}AA)`}
          w={`${pct}%`}
          boxShadow={`0 0 12px ${color}55`}
          transition="width 0.5s cubic-bezier(0.22, 1, 0.36, 1)"
        />
      </Box>
    </Box>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Text
        fontSize="2xs"
        color="gray.500"
        mb="1"
        textTransform="uppercase"
        letterSpacing="wider"
        fontWeight="semibold"
      >
        {label}
      </Text>
      <Text fontSize="sm" color="gray.200">
        {value}
      </Text>
    </Box>
  );
}

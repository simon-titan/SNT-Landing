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

  // Restore credentials
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

  // ─── Login Screen ──────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <Box minH="100vh" bg="gray.50" display="flex" alignItems="center" justifyContent="center" p="4">
        <Box maxW="400px" w="full" bg="white" p="8" borderRadius="xl" boxShadow="lg">
          <VStack gap="5" align="stretch">
            <VStack gap="2" textAlign="center">
              <Heading size="lg" color="gray.800">SNT APEX Admin</Heading>
              <Text fontSize="sm" color="gray.500">Bitte einloggen, um fortzufahren.</Text>
            </VStack>
            <form onSubmit={handleLogin}>
              <VStack gap="3" align="stretch">
                <Input
                  placeholder="Benutzername"
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  bg="white"
                  color="gray.800"
                />
                <Input
                  type="password"
                  placeholder="Passwort"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  bg="white"
                  color="gray.800"
                />
                {statusMessage && (
                  <Text fontSize="xs" color="red.500" textAlign="center">
                    {statusMessage}
                  </Text>
                )}
                <Button type="submit" colorPalette="blue">Einloggen</Button>
              </VStack>
            </form>
            <NextLink href="/admin" style={{ alignSelf: "center" }}>
              <Text fontSize="xs" color="gray.500" _hover={{ color: "blue.500" }}>
                ← Zurück zur Admin-Startseite
              </Text>
            </NextLink>
          </VStack>
        </Box>
      </Box>
    );
  }

  // ─── Dashboard ─────────────────────────────────────────────────────────────
  return (
    <Box minH="100vh" bg="gray.50" p={{ base: "4", md: "8" }}>
      <Box maxW="1400px" mx="auto">
        <VStack gap="6" align="stretch">
          {/* Top bar */}
          <HStack justify="space-between" flexWrap="wrap" gap="3">
            <HStack gap="3">
              <NextLink href="/admin">
                <IconButton aria-label="Zurück" variant="ghost" size="sm">
                  <ArrowLeft size={20} />
                </IconButton>
              </NextLink>
              <VStack align="start" gap="0">
                <HStack gap="2">
                  <ChartBar size={22} color="#8B5CF6" weight="fill" />
                  <Heading size="md" color="gray.800">SNT APEX, Bewerbungs-Funnel</Heading>
                </HStack>
                <Text fontSize="xs" color="gray.500">Live-Tracking, Bewerbungen, Settings</Text>
              </VStack>
            </HStack>
            <HStack gap="2">
              <NextLink href="/apex" target="_blank">
                <Button size="sm" variant="outline">
                  <HStack gap="1.5">
                    <ArrowSquareOut size={14} />
                    <Text>Funnel öffnen</Text>
                  </HStack>
                </Button>
              </NextLink>
              <Button size="sm" variant="ghost" onClick={handleLogout}>
                Logout
              </Button>
            </HStack>
          </HStack>

          {/* Status banner */}
          {statusMessage && (
            <Box
              p="3"
              borderRadius="md"
              bg="blue.50"
              borderWidth="1px"
              borderColor="blue.200"
            >
              <Text fontSize="sm" color="blue.800">
                {statusMessage}
              </Text>
            </Box>
          )}

          {/* Calendly setup */}
          <Box p="4" borderRadius="md" bg="purple.50" borderWidth="1px" borderColor="purple.200">
            <Text fontWeight="semibold" color="purple.800" mb="2" fontSize="sm">
              Calendly Setup, Einmalig erforderlich
            </Text>
            <VStack align="start" gap="2" fontSize="xs" color="purple.700">
              <HStack flexWrap="wrap" gap="2">
                <Text><strong>Redirect-URL:</strong></Text>
                <Box
                  as="button"
                  fontFamily="mono"
                  bg="purple.100"
                  px="2"
                  py="1"
                  borderRadius="sm"
                  cursor="pointer"
                  display="inline-flex"
                  alignItems="center"
                  gap="1.5"
                  onClick={() =>
                    navigator.clipboard
                      .writeText(calendlyRedirectUrl)
                      .then(() => notify("URL kopiert!"))
                  }
                  _hover={{ bg: "purple.200" }}
                >
                  {calendlyRedirectUrl}
                  <Copy size={12} />
                </Box>
              </HStack>
              <Text>
                In Calendly im Event-Type unter <em>Confirmation page → Redirect to an external site</em> eintragen
                und {"\""}Pass event details to your redirected page{"\""} aktivieren.
              </Text>
            </VStack>
          </Box>

          {/* Period controls */}
          <HStack justify="space-between" flexWrap="wrap" gap="3">
            <HStack gap="2">
              <Funnel size={18} color="#8B5CF6" weight="fill" />
              <Text color="gray.700" fontWeight="semibold" fontSize="sm">Funnel-Metriken</Text>
            </HStack>
            <HStack gap="2">
              <NativeSelectRoot size="sm">
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
                >
                  <option value="today">Heute</option>
                  <option value="week">7 Tage</option>
                  <option value="month">30 Tage</option>
                  <option value="all">Gesamt</option>
                </NativeSelectField>
              </NativeSelectRoot>
              <Button
                size="sm"
                variant="outline"
                onClick={() => fetchData(statsPeriod)}
                loading={isLoading}
              >
                Aktualisieren
              </Button>
            </HStack>
          </HStack>

          {/* Top metric cards */}
          {stats && (
            <Grid templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }} gap="3">
              <MetricCard label="Pageviews" value={stats.funnel.page_views} accent="gray" />
              <MetricCard label="Form-Starts" value={stats.funnel.form_opens} accent="blue" />
              <MetricCard label="Bewerbungen" value={stats.leads.total} accent="yellow" />
              <MetricCard
                label="Calls gebucht"
                value={stats.leads.booked + stats.leads.completed}
                accent="green"
              />
            </Grid>
          )}

          {/* Conversion analysis */}
          {stats && (
            <Box bg="white" borderWidth="1px" borderRadius="md" p="5">
              <Text fontWeight="semibold" mb="4" color="gray.800" fontSize="sm">
                Funnel-Analyse, Wo brechen Bewerber ab?
              </Text>
              {[
                {
                  label: "Pageview → Form geöffnet",
                  value: stats.conversion.view_to_form,
                  from: stats.funnel.page_views,
                  to: stats.funnel.form_opens,
                  color: "blue.400",
                },
                {
                  label: "Form geöffnet → Bewerbung abgesendet",
                  value: stats.conversion.form_to_submit,
                  from: stats.funnel.form_opens,
                  to: stats.leads.total,
                  color: "yellow.400",
                },
                {
                  label: "Bewerbung → Call gebucht",
                  value: stats.conversion.submit_to_book,
                  from: stats.leads.total,
                  to: stats.leads.booked + stats.leads.completed,
                  color: "green.400",
                },
                {
                  label: "Gesamt: View → Gebucht",
                  value: stats.conversion.view_to_book,
                  from: stats.funnel.page_views,
                  to: stats.leads.booked + stats.leads.completed,
                  color: "purple.400",
                },
              ].map(({ label, value, from, to, color }) => (
                <Box key={label} mb="3">
                  <Flex justify="space-between" mb="1">
                    <Text fontSize="xs" color="gray.700">{label}</Text>
                    <Text fontSize="xs" fontWeight="bold" color="gray.800">
                      {to} / {from} ({value}%)
                    </Text>
                  </Flex>
                  <Box h="6px" bg="gray.200" borderRadius="full" overflow="hidden">
                    <Box
                      h="full"
                      borderRadius="full"
                      bg={color}
                      w={`${Math.min(parseFloat(value), 100)}%`}
                      transition="width 0.4s ease"
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          )}

          {/* Step completion */}
          {stats && (
            <Grid templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }} gap="3">
              {[
                { label: "Step 1 ✓", value: stats.funnel.step_1_complete },
                { label: "Step 2 ✓", value: stats.funnel.step_2_complete },
                { label: "Step 3 ✓", value: stats.funnel.step_3_complete },
                { label: "→ Calendly", value: stats.funnel.calendly_redirects },
              ].map(({ label, value }) => (
                <Box
                  key={label}
                  bg="white"
                  borderWidth="1px"
                  borderRadius="md"
                  p="3"
                >
                  <Text fontSize="xs" color="gray.500">{label}</Text>
                  <Text fontWeight="bold" fontSize="lg" color="gray.800">{value}</Text>
                </Box>
              ))}
            </Grid>
          )}

          {/* Leads */}
          <Box bg="white" borderWidth="1px" borderRadius="md" p="5">
            <HStack justify="space-between" mb="4" flexWrap="wrap" gap="2">
              <HStack gap="2">
                <Users size={18} color="#8B5CF6" weight="fill" />
                <Text fontWeight="semibold" fontSize="sm" color="gray.800">
                  Bewerbungen ({filteredLeads.length})
                </Text>
              </HStack>
              <NativeSelectRoot maxW="180px" size="sm">
                <NativeSelectField
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Alle</option>
                  <option value="submitted">Eingereicht</option>
                  <option value="booked">Gebucht</option>
                  <option value="completed">Abgeschlossen</option>
                  <option value="no_show">No-Show</option>
                </NativeSelectField>
              </NativeSelectRoot>
            </HStack>

            {isLoading ? (
              <Flex justify="center" py="6">
                <Spinner size="lg" color="purple.500" />
              </Flex>
            ) : (
              <Box borderWidth="1px" borderRadius="md" overflow="hidden">
                <Table.Root size="sm">
                  <Table.Header>
                    <Table.Row bg="gray.50">
                      <Table.ColumnHeader>Datum</Table.ColumnHeader>
                      <Table.ColumnHeader>Status</Table.ColumnHeader>
                      <Table.ColumnHeader>Dauer</Table.ColumnHeader>
                      <Table.ColumnHeader>Level</Table.ColumnHeader>
                      <Table.ColumnHeader>Investition</Table.ColumnHeader>
                      <Table.ColumnHeader>Termin</Table.ColumnHeader>
                      <Table.ColumnHeader>Aktion</Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {filteredLeads.length === 0 ? (
                      <Table.Row>
                        <Table.Cell colSpan={7}>
                          <Text textAlign="center" py="6" color="gray.500" fontSize="sm">
                            Keine Bewerbungen gefunden.
                          </Text>
                        </Table.Cell>
                      </Table.Row>
                    ) : (
                      filteredLeads.map((lead) => (
                        <Table.Row key={lead.id}>
                          <Table.Cell fontSize="xs" color="gray.600">
                            {new Date(lead.created_at).toLocaleDateString("de-DE")}
                          </Table.Cell>
                          <Table.Cell>
                            <Badge
                              colorPalette={STATUS_COLORS[lead.status] ?? "gray"}
                              fontSize="xs"
                            >
                              {STATUS_LABELS[lead.status] ?? lead.status}
                            </Badge>
                          </Table.Cell>
                          <Table.Cell fontSize="xs" color="gray.600">
                            {lead.trading_duration}
                          </Table.Cell>
                          <Table.Cell
                            fontSize="xs"
                            color="gray.600"
                            maxW="180px"
                            overflow="hidden"
                            textOverflow="ellipsis"
                            whiteSpace="nowrap"
                          >
                            {lead.current_level}
                          </Table.Cell>
                          <Table.Cell fontSize="xs" color="gray.600">
                            {lead.investment_willingness}
                          </Table.Cell>
                          <Table.Cell
                            fontSize="xs"
                            color={lead.scheduled_at ? "green.600" : "gray.400"}
                          >
                            {lead.scheduled_at
                              ? new Date(lead.scheduled_at).toLocaleString(
                                  "de-DE",
                                  { dateStyle: "short", timeStyle: "short" }
                                )
                              : lead.invitee_name ?? "-"}
                          </Table.Cell>
                          <Table.Cell>
                            <Button
                              size="xs"
                              variant="outline"
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

          {/* Settings */}
          <Box bg="white" borderWidth="1px" borderRadius="md" p="5">
            <HStack gap="2" mb="3">
              <CalendarCheck size={18} color="#8B5CF6" weight="fill" />
              <Text fontWeight="semibold" color="gray.800" fontSize="sm">
                Video & Calendly Einstellungen
              </Text>
            </HStack>
            <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap="4" mb="4">
              <Stack gap="1">
                <Text fontSize="sm" color="gray.600" fontWeight="medium">
                  Vimeo Video ID (nur Zahlen)
                </Text>
                <Input
                  placeholder="z.B. 1177003953"
                  value={vimeoInput}
                  onChange={(e) => setVimeoInput(e.target.value)}
                  bg="white"
                  color="gray.800"
                  borderColor="gray.300"
                />
              </Stack>
              <Stack gap="1">
                <Text fontSize="sm" color="gray.600" fontWeight="medium">
                  Calendly URL
                </Text>
                <Input
                  placeholder="https://calendly.com/..."
                  value={calendlyInput}
                  onChange={(e) => setCalendlyInput(e.target.value)}
                  bg="white"
                  color="gray.800"
                  borderColor="gray.300"
                />
              </Stack>
            </Grid>
            <Button
              colorPalette="purple"
              size="sm"
              onClick={handleSaveSettings}
              loading={isSavingSettings}
            >
              Einstellungen speichern
            </Button>
          </Box>

          {/* Footer */}
          <HStack justify="center" pt="4" pb="2">
            <Text fontSize="xs" color="gray.400">
              SNT APEX Admin · {settings.calendly_url ? "Calendly verbunden" : "Kein Calendly konfiguriert"}
            </Text>
          </HStack>
        </VStack>
      </Box>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <Box
          position="fixed"
          inset="0"
          bg="blackAlpha.700"
          display="flex"
          alignItems="center"
          justifyContent="center"
          zIndex="1000"
          onClick={() => setSelectedLead(null)}
          p="4"
        >
          <Box
            bg="white"
            p="6"
            borderRadius="xl"
            maxW="640px"
            w="full"
            maxH="90vh"
            overflowY="auto"
            onClick={(e) => e.stopPropagation()}
          >
            <VStack gap="4" align="stretch">
              <Flex justify="space-between" align="center">
                <Heading size="md" color="gray.800">
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
                    onClick={() => setSelectedLead(null)}
                  >
                    ✕
                  </Button>
                </HStack>
              </Flex>

              {selectedLead.invitee_name && (
                <Box
                  p="3"
                  borderRadius="md"
                  bg="green.50"
                  borderWidth="1px"
                  borderColor="green.200"
                >
                  <Text fontWeight="semibold" color="green.800" mb="2" fontSize="sm">
                    Gebuchter Termin
                  </Text>
                  <Grid templateColumns="repeat(2, 1fr)" gap="2" fontSize="sm" color="green.700">
                    <Text><strong>Name:</strong> {selectedLead.invitee_name}</Text>
                    <Text><strong>E-Mail:</strong> {selectedLead.invitee_email}</Text>
                    {selectedLead.invitee_phone && (
                      <Text><strong>Telefon:</strong> {selectedLead.invitee_phone}</Text>
                    )}
                    {selectedLead.scheduled_at && (
                      <Text>
                        <strong>Termin:</strong>{" "}
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
                <DetailItem
                  label="Investitionsbereitschaft"
                  value={selectedLead.investment_willingness}
                />
                {selectedLead.snt_source && (
                  <DetailItem label="Quelle" value={selectedLead.snt_source} />
                )}
              </Grid>

              <Box>
                <Text fontSize="xs" color="gray.500" mb="1">Was hält ihn zurück?</Text>
                <Box
                  p="3"
                  bg="gray.50"
                  borderRadius="md"
                  borderWidth="1px"
                  fontSize="sm"
                  color="gray.800"
                  lineHeight="1.6"
                  whiteSpace="pre-wrap"
                >
                  {selectedLead.holding_back}
                </Box>
              </Box>
              <Box>
                <Text fontSize="xs" color="gray.500" mb="1">Warum der richtige Kandidat?</Text>
                <Box
                  p="3"
                  bg="gray.50"
                  borderRadius="md"
                  borderWidth="1px"
                  fontSize="sm"
                  color="gray.800"
                  lineHeight="1.6"
                  whiteSpace="pre-wrap"
                >
                  {selectedLead.why_candidate}
                </Box>
              </Box>

              <HStack justify="space-between">
                <Text fontSize="xs" color="gray.400">
                  Eingereicht: {new Date(selectedLead.created_at).toLocaleString("de-DE")}
                </Text>
                <Button variant="outline" size="sm" onClick={() => setSelectedLead(null)}>
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

function MetricCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: "gray" | "blue" | "yellow" | "green";
}) {
  const accentMap: Record<string, string> = {
    gray: "gray.700",
    blue: "blue.500",
    yellow: "yellow.500",
    green: "green.500",
  };
  return (
    <Box bg="white" borderWidth="1px" p="4" borderRadius="md" shadow="sm">
      <Text fontSize="xs" color="gray.500" mb="1">{label}</Text>
      <Text fontSize="2xl" fontWeight="bold" color={accentMap[accent]}>
        {value.toLocaleString("de-DE")}
      </Text>
    </Box>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Text fontSize="xs" color="gray.500" mb="1">{label}</Text>
      <Text fontSize="sm" color="gray.800">{value}</Text>
    </Box>
  );
}

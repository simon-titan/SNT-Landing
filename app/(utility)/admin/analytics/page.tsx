"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Box, Flex, Grid, Heading, Text, VStack, HStack, Stack,
  Table, Badge, Input, Spinner, Button,
} from "@chakra-ui/react";
import { NativeSelectField, NativeSelectRoot } from "@chakra-ui/react";
import { Collapsible } from "@chakra-ui/react";
import { CaretDown, CaretUp, ArrowLeft } from "@phosphor-icons/react";

const SNT_BLUE = "#068CEF";
const COLORS = ["#068CEF", "#34d399", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

type AnalyticsData = {
  kpis: {
    totalViews: number;
    totalSessions: number;
    totalConversions: number;
    totalRevenueCents: number;
    totalCheckoutStarts: number;
    abandonRate: number;
  };
  salesByDate: Record<string, { count: number; revenue: number; products: Record<string, number> }>;
  viewsByDate: Record<string, Record<string, { views: number; sessions: number }>>;
  variants: Array<{
    name: string;
    views: number;
    sessions: number;
    ctaClicks: number;
    checkoutStarts: number;
    conversions: number;
    revenueCents: number;
    conversionRate: number;
    abandonRate: number;
  }>;
  timeline: Array<{
    date: string;
    variants: Record<string, { views: number; sales: number; checkoutStarts: number }>;
  }>;
  salesDetail: Array<{
    id: string;
    date: string;
    pageVariant: string;
    product: string;
    provider: string;
    amountCents: number;
    currency: string;
  }>;
};

const fmt = (cents: number) => `${(cents / 100).toFixed(2).replace(".", ",")}€`;
const fmtDate = (d: string) => {
  const date = new Date(d);
  return date.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" });
};
const fmtDateFull = (d: string) => {
  const date = new Date(d);
  return date.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
};

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState(30);
  const [credentials, setCredentials] = useState<{ username: string; password: string } | null>(null);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [expandedSaleDate, setExpandedSaleDate] = useState<string | null>(null);

  useEffect(() => {
    const cached = sessionStorage.getItem("snt_affiliate_admin_credentials");
    if (cached) {
      try { setCredentials(JSON.parse(cached)); } catch { /* */ }
    }
  }, []);

  const headers = credentials
    ? { "x-admin-username": credentials.username, "x-admin-password": credentials.password }
    : null;

  const fetchData = async (d = days) => {
    if (!credentials) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/analytics?days=${d}`, { headers: headers ?? undefined });
      if (!res.ok) {
        console.error("Analytics fetch failed:", res.status);
        return;
      }
      setData(await res.json());
    } catch (err) {
      console.error("Analytics fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (credentials) fetchData();
  }, [credentials]);

  const handleLogin = () => {
    const creds = { username: loginForm.username.trim(), password: loginForm.password.trim() };
    sessionStorage.setItem("snt_affiliate_admin_credentials", JSON.stringify(creds));
    setCredentials(creds);
  };

  const sortedSalesDates = useMemo(() => {
    if (!data) return [];
    return Object.entries(data.salesByDate).sort(([a], [b]) => b.localeCompare(a));
  }, [data]);

  const sortedViewsDates = useMemo(() => {
    if (!data) return [];
    return Object.entries(data.viewsByDate).sort(([a], [b]) => b.localeCompare(a));
  }, [data]);

  const allVariantNames = useMemo(() => {
    if (!data) return [];
    return [...new Set(data.timeline.flatMap((t) => Object.keys(t.variants)))];
  }, [data]);

  if (!credentials) {
    return (
      <Box p="8" maxW="400px" mx="auto" mt="20">
        <VStack gap="4" align="stretch">
          <Heading size="lg" textAlign="center">Analytics Login</Heading>
          <Input
            placeholder="Benutzername"
            value={loginForm.username}
            onChange={(e) => setLoginForm((p) => ({ ...p, username: e.target.value }))}
          />
          <Input
            type="password"
            placeholder="Passwort"
            value={loginForm.password}
            onChange={(e) => setLoginForm((p) => ({ ...p, password: e.target.value }))}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
          <Button colorScheme="blue" onClick={handleLogin}>Anmelden</Button>
        </VStack>
      </Box>
    );
  }

  return (
    <Box p="8" maxW="1400px" mx="auto">
      <VStack gap="6" align="stretch">
        {/* Header */}
        <Flex justify="space-between" align="center" flexWrap="wrap" gap="3">
          <HStack gap="3">
            <a href="/admin">
              <Button variant="ghost" size="sm"><ArrowLeft size={18} /></Button>
            </a>
            <Heading size="lg">Analytics Dashboard</Heading>
          </HStack>
          <HStack gap="2">
            <NativeSelectRoot maxW="140px">
              <NativeSelectField
                value={days}
                onChange={(e) => {
                  const d = parseInt(e.target.value, 10);
                  setDays(d);
                  fetchData(d);
                }}
              >
                <option value={7}>7 Tage</option>
                <option value={14}>14 Tage</option>
                <option value={30}>30 Tage</option>
                <option value={90}>90 Tage</option>
                <option value={365}>1 Jahr</option>
              </NativeSelectField>
            </NativeSelectRoot>
            <Button size="sm" variant="outline" onClick={() => fetchData()} loading={loading}>
              Aktualisieren
            </Button>
          </HStack>
        </Flex>

        {loading && !data && (
          <Flex justify="center" py="16"><Spinner size="xl" color="blue.500" /></Flex>
        )}

        {data && (
          <>
            {/* Sektion 1: KPI Karten */}
            <Grid templateColumns={{ base: "1fr 1fr", md: "repeat(4, 1fr)" }} gap="4">
              {[
                { label: "Page Views", value: data.kpis.totalViews.toLocaleString("de-DE") },
                { label: "Unique Sessions", value: data.kpis.totalSessions.toLocaleString("de-DE") },
                { label: "Conversions", value: data.kpis.totalConversions.toString() },
                { label: "Revenue", value: fmt(data.kpis.totalRevenueCents) },
              ].map((kpi) => (
                <Box key={kpi.label} bg="gray.900" p="5" borderRadius="lg">
                  <Text fontSize="sm" color="gray.400">{kpi.label}</Text>
                  <Text fontSize="2xl" fontWeight="bold">{kpi.value}</Text>
                </Box>
              ))}
            </Grid>

            {/* Checkout-Abbrecher KPIs */}
            <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap="4">
              <Box bg="gray.900" p="5" borderRadius="lg">
                <Text fontSize="sm" color="gray.400">Checkout Starts</Text>
                <Text fontSize="2xl" fontWeight="bold">{data.kpis.totalCheckoutStarts}</Text>
              </Box>
              <Box bg="gray.900" p="5" borderRadius="lg">
                <Text fontSize="sm" color="gray.400">Abbrecher</Text>
                <Text fontSize="2xl" fontWeight="bold" color={data.kpis.abandonRate > 80 ? "red.400" : "yellow.400"}>
                  {Math.max(0, data.kpis.totalCheckoutStarts - data.kpis.totalConversions)}
                </Text>
              </Box>
              <Box bg="gray.900" p="5" borderRadius="lg">
                <Text fontSize="sm" color="gray.400">Abbrecher-Rate</Text>
                <Text fontSize="2xl" fontWeight="bold" color={data.kpis.abandonRate > 80 ? "red.400" : "yellow.400"}>
                  {data.kpis.abandonRate.toFixed(1)}%
                </Text>
              </Box>
            </Grid>

            {/* Sektion 2: Sales nach Datum */}
            <Box borderWidth="1px" borderRadius="lg" p="6">
              <Text fontWeight="semibold" mb="4" fontSize="lg">Sales nach Datum</Text>
              {sortedSalesDates.length === 0 ? (
                <Text color="gray.500">Keine Sales im gewählten Zeitraum</Text>
              ) : (
                <Stack gap="0">
                  {sortedSalesDates.map(([date, info]) => (
                    <Box key={date}>
                      <Flex
                        justify="space-between"
                        align="center"
                        p="3"
                        cursor="pointer"
                        _hover={{ bg: "gray.800" }}
                        borderRadius="md"
                        onClick={() => setExpandedSaleDate(expandedSaleDate === date ? null : date)}
                      >
                        <HStack gap="4">
                          <Text fontWeight="medium" minW="100px">{fmtDateFull(date)}</Text>
                          <Badge colorPalette="blue">{info.count} Sale{info.count !== 1 ? "s" : ""}</Badge>
                          {Object.entries(info.products).map(([p, c]) => (
                            <Badge key={p} colorPalette="gray" size="sm">{p}: {c}</Badge>
                          ))}
                        </HStack>
                        <HStack gap="3">
                          <Text fontWeight="bold">{fmt(info.revenue)}</Text>
                          {expandedSaleDate === date ? <CaretUp size={16} /> : <CaretDown size={16} />}
                        </HStack>
                      </Flex>

                      <Collapsible.Root open={expandedSaleDate === date}>
                        <Collapsible.Content>
                          <Box pl="6" pb="3">
                            <Table.Root size="sm">
                              <Table.Header>
                                <Table.Row>
                                  <Table.ColumnHeader>Zeit</Table.ColumnHeader>
                                  <Table.ColumnHeader>Variante</Table.ColumnHeader>
                                  <Table.ColumnHeader>Produkt</Table.ColumnHeader>
                                  <Table.ColumnHeader>Provider</Table.ColumnHeader>
                                  <Table.ColumnHeader>Betrag</Table.ColumnHeader>
                                </Table.Row>
                              </Table.Header>
                              <Table.Body>
                                {data.salesDetail
                                  .filter((s) => s.date.startsWith(date))
                                  .map((s) => (
                                    <Table.Row key={s.id}>
                                      <Table.Cell>{new Date(s.date).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}</Table.Cell>
                                      <Table.Cell><Badge>{s.pageVariant}</Badge></Table.Cell>
                                      <Table.Cell>{s.product}</Table.Cell>
                                      <Table.Cell>{s.provider}</Table.Cell>
                                      <Table.Cell fontWeight="bold">{fmt(s.amountCents)}</Table.Cell>
                                    </Table.Row>
                                  ))}
                              </Table.Body>
                            </Table.Root>
                          </Box>
                        </Collapsible.Content>
                      </Collapsible.Root>
                    </Box>
                  ))}
                </Stack>
              )}
            </Box>

            {/* Sektion 3: PageViews pro Tag */}
            <Box borderWidth="1px" borderRadius="lg" p="6">
              <Text fontWeight="semibold" mb="4" fontSize="lg">PageViews pro Tag</Text>
              {sortedViewsDates.length === 0 ? (
                <Text color="gray.500">Keine Daten im gewählten Zeitraum</Text>
              ) : (
                <Box overflowX="auto">
                  <Table.Root size="sm">
                    <Table.Header>
                      <Table.Row>
                        <Table.ColumnHeader>Datum</Table.ColumnHeader>
                        <Table.ColumnHeader>Total Views</Table.ColumnHeader>
                        <Table.ColumnHeader>Sessions</Table.ColumnHeader>
                        {allVariantNames.map((v) => (
                          <Table.ColumnHeader key={v}>{v}</Table.ColumnHeader>
                        ))}
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {sortedViewsDates.slice(0, 30).map(([date, variants]) => {
                        const totalViews = Object.values(variants).reduce((s, v) => s + v.views, 0);
                        const totalSessions = Object.values(variants).reduce((s, v) => s + v.sessions, 0);
                        return (
                          <Table.Row key={date}>
                            <Table.Cell fontWeight="medium">{fmtDateFull(date)}</Table.Cell>
                            <Table.Cell fontWeight="bold">{totalViews}</Table.Cell>
                            <Table.Cell>{totalSessions}</Table.Cell>
                            {allVariantNames.map((v) => (
                              <Table.Cell key={v}>{variants[v]?.views ?? 0}</Table.Cell>
                            ))}
                          </Table.Row>
                        );
                      })}
                    </Table.Body>
                  </Table.Root>
                </Box>
              )}
            </Box>

            {/* Sektion 4: Checkout-Abbrecher pro Variante */}
            <Box borderWidth="1px" borderRadius="lg" p="6">
              <Text fontWeight="semibold" mb="4" fontSize="lg">Checkout-Abbrecher pro Variante</Text>
              <Box overflowX="auto">
                <Table.Root size="sm">
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeader>Variante</Table.ColumnHeader>
                      <Table.ColumnHeader>Checkout Starts</Table.ColumnHeader>
                      <Table.ColumnHeader>Conversions</Table.ColumnHeader>
                      <Table.ColumnHeader>Abbrecher</Table.ColumnHeader>
                      <Table.ColumnHeader>Abbrecher-Rate</Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {data.variants
                      .filter((v) => v.checkoutStarts > 0)
                      .sort((a, b) => b.abandonRate - a.abandonRate)
                      .map((v) => (
                        <Table.Row key={v.name}>
                          <Table.Cell>
                            <Badge>{v.name}</Badge>
                          </Table.Cell>
                          <Table.Cell>{v.checkoutStarts}</Table.Cell>
                          <Table.Cell>{v.conversions}</Table.Cell>
                          <Table.Cell>{Math.max(0, v.checkoutStarts - v.conversions)}</Table.Cell>
                          <Table.Cell>
                            <Text
                              fontWeight="bold"
                              color={v.abandonRate > 80 ? "red.400" : v.abandonRate > 50 ? "yellow.400" : "green.400"}
                            >
                              {v.abandonRate.toFixed(1)}%
                            </Text>
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    {data.variants.filter((v) => v.checkoutStarts > 0).length === 0 && (
                      <Table.Row>
                        <Table.Cell colSpan={5}>
                          <Text color="gray.500" textAlign="center" py="3">
                            Noch keine Checkout-Daten vorhanden
                          </Text>
                        </Table.Cell>
                      </Table.Row>
                    )}
                  </Table.Body>
                </Table.Root>
              </Box>
            </Box>

            {/* Sektion 5: A/B Varianten Vergleich */}
            <Box borderWidth="1px" borderRadius="lg" p="6">
              <Text fontWeight="semibold" mb="4" fontSize="lg">A/B Varianten Vergleich</Text>
              <Box overflowX="auto">
                <Table.Root size="sm">
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeader>Variante</Table.ColumnHeader>
                      <Table.ColumnHeader>Views</Table.ColumnHeader>
                      <Table.ColumnHeader>Sessions</Table.ColumnHeader>
                      <Table.ColumnHeader>CTA Clicks</Table.ColumnHeader>
                      <Table.ColumnHeader>Checkouts</Table.ColumnHeader>
                      <Table.ColumnHeader>Käufe</Table.ColumnHeader>
                      <Table.ColumnHeader>Conv. Rate</Table.ColumnHeader>
                      <Table.ColumnHeader>Abbrecher</Table.ColumnHeader>
                      <Table.ColumnHeader>Revenue</Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {data.variants.map((v, i) => (
                      <Table.Row
                        key={v.name}
                        borderLeft={i === 0 ? "3px solid" : undefined}
                        borderColor={i === 0 ? "green.400" : undefined}
                      >
                        <Table.Cell>
                          <HStack gap="2">
                            <Badge colorPalette={i === 0 ? "green" : "gray"}>{v.name}</Badge>
                            {i === 0 && <Badge colorPalette="green" size="sm">Beste</Badge>}
                          </HStack>
                        </Table.Cell>
                        <Table.Cell>{v.views}</Table.Cell>
                        <Table.Cell>{v.sessions}</Table.Cell>
                        <Table.Cell>{v.ctaClicks}</Table.Cell>
                        <Table.Cell>{v.checkoutStarts}</Table.Cell>
                        <Table.Cell fontWeight="bold">{v.conversions}</Table.Cell>
                        <Table.Cell>
                          <Text fontWeight="bold" color={v.conversionRate > 0 ? "green.400" : "gray.400"}>
                            {v.conversionRate.toFixed(2)}%
                          </Text>
                        </Table.Cell>
                        <Table.Cell>
                          <Text color={v.abandonRate > 80 ? "red.400" : "gray.400"}>
                            {v.abandonRate.toFixed(1)}%
                          </Text>
                        </Table.Cell>
                        <Table.Cell fontWeight="bold">{fmt(v.revenueCents)}</Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              </Box>
            </Box>

            {/* Sektion 6: Timeline Chart */}
            <Box borderWidth="1px" borderRadius="lg" p="6">
              <Text fontWeight="semibold" mb="4" fontSize="lg">Timeline (letzte 14 Tage)</Text>
              <HStack gap="4" mb="3" flexWrap="wrap">
                {allVariantNames.map((v, i) => (
                  <HStack key={v} gap="1">
                    <Box w="12px" h="3px" bg={COLORS[i % COLORS.length]} borderRadius="full" />
                    <Text fontSize="xs" color="gray.400">{v}</Text>
                  </HStack>
                ))}
              </HStack>
              <TimelineChart timeline={data.timeline} variantNames={allVariantNames} />
            </Box>
          </>
        )}
      </VStack>
    </Box>
  );
}

function TimelineChart({
  timeline,
  variantNames,
}: {
  timeline: AnalyticsData["timeline"];
  variantNames: string[];
}) {
  const W = 800;
  const H = 250;
  const PAD = { top: 20, right: 20, bottom: 40, left: 50 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  const maxViews = Math.max(
    1,
    ...timeline.flatMap((t) => Object.values(t.variants).map((v) => v.views))
  );

  const xStep = timeline.length > 1 ? chartW / (timeline.length - 1) : chartW;

  const getPath = (variantName: string) => {
    const points = timeline.map((t, i) => {
      const x = PAD.left + i * xStep;
      const views = t.variants[variantName]?.views || 0;
      const y = PAD.top + chartH - (views / maxViews) * chartH;
      return `${x},${y}`;
    });
    return `M${points.join("L")}`;
  };

  return (
    <Box overflowX="auto">
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: W }}>
        {/* Y-axis grid */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
          const y = PAD.top + chartH - pct * chartH;
          return (
            <g key={pct}>
              <line x1={PAD.left} y1={y} x2={W - PAD.right} y2={y} stroke="#333" strokeWidth="0.5" />
              <text x={PAD.left - 8} y={y + 4} textAnchor="end" fill="#888" fontSize="10">
                {Math.round(maxViews * pct)}
              </text>
            </g>
          );
        })}

        {/* X-axis labels */}
        {timeline.map((t, i) => {
          const x = PAD.left + i * xStep;
          return (
            <text key={t.date} x={x} y={H - 8} textAnchor="middle" fill="#888" fontSize="9">
              {fmtDate(t.date)}
            </text>
          );
        })}

        {/* Lines */}
        {variantNames.map((name, i) => (
          <path
            key={name}
            d={getPath(name)}
            fill="none"
            stroke={COLORS[i % COLORS.length]}
            strokeWidth="2"
            strokeLinejoin="round"
          />
        ))}

        {/* Dots */}
        {variantNames.map((name, ci) =>
          timeline.map((t, i) => {
            const views = t.variants[name]?.views || 0;
            if (views === 0) return null;
            const x = PAD.left + i * xStep;
            const y = PAD.top + chartH - (views / maxViews) * chartH;
            return (
              <circle
                key={`${name}-${i}`}
                cx={x}
                cy={y}
                r="3"
                fill={COLORS[ci % COLORS.length]}
              />
            );
          })
        )}
      </svg>
    </Box>
  );
}

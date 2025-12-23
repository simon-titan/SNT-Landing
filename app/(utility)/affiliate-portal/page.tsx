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
} from "@chakra-ui/react";
import { createClient, type Session } from "@supabase/supabase-js";
import { useEffect, useMemo, useState } from "react";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY;

const supabaseClient =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

const TEST_EMAIL = process.env.NEXT_PUBLIC_AFFILIATE_TEST_EMAIL;
const TEST_PASSWORD = process.env.NEXT_PUBLIC_AFFILIATE_TEST_PASSWORD;
type AffiliateStats = {
  affiliate: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  codes: Array<{ id: string; code: string; label: string | null; is_active: boolean }>;
  metrics: {
    saleCount: number;
    revenue: number;
    monthlySales: number;
    monthlyRevenue: number;
    lifetimeSales: number;
    lifetimeRevenue: number;
  };
  recentSales: Array<{
    id: string;
    amount: number;
    currency: string | null;
    product: string;
    provider: string;
    saleAt: string;
    affiliateCode: string | null;
  }>;
};

export default function AffiliatePortalPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [session, setSession] = useState<Session | null>(null);
  const [stats, setStats] = useState<AffiliateStats | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const notify = (message: string | null) => setStatusMessage(message);
  const baseUrl = useMemo(() => {
    if (typeof window === "undefined") return "https://www.snt-mentorship-platform.de";
    return window.location.origin;
  }, []);

  const linkVariants = [
    { label: "Startseite", path: "/" },
    { label: "Checkout monatlich", path: "/checkout/monthly" },
    { label: "Checkout lifetime", path: "/checkout/lifetime" },
  ];

  const buildAffiliateLink = (code: string, path: string) => {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `${baseUrl}${normalizedPath}?aff=${code}`;
  };

  const handleCopyLink = async (link: string) => {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      notify("Link kopiert");
    } catch (error) {
      console.error("Clipboard error", error);
      notify("Clipboard nicht verfügbar");
    }
  };

  useEffect(() => {
    if (!supabaseClient) return;
    supabaseClient.auth
      .getSession()
      .then(({ data }) => setSession(data.session))
      .catch(() => {});

    const { data } = supabaseClient.auth.onAuthStateChange((_, newSession) => {
      setSession(newSession);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session?.access_token) {
      setStats(null);
      return;
    }

    const loadStats = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/affiliates/me", {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          notify(payload?.error ?? "Stats konnten nicht geladen werden");
          return;
        }

        const data = (await response.json()) as AffiliateStats;
        setStats(data);
        notify(null);
      } catch (error) {
        console.error(error);
        notify("Stats konnten nicht geladen werden");
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, [session]);

  const handleLogin = async (overrideEmail?: string, overridePassword?: string) => {
    const emailToUse = overrideEmail ?? email;
    const passwordToUse = overridePassword ?? password;
    if (!emailToUse || !passwordToUse) {
      notify("Bitte Zugangsdaten ausfüllen");
      return;
    }
    if (!supabaseClient) {
      notify("Supabase nicht konfiguriert");
      return;
    }
    setIsLoading(true);
    const { error } = await supabaseClient.auth.signInWithPassword({
      email: emailToUse,
      password: passwordToUse,
    });
    if (error) {
      notify(error.message);
    }
    setIsLoading(false);
  };

  const handleQuickLogin = async () => {
    if (!TEST_EMAIL || !TEST_PASSWORD) {
      notify("Test-Zugang nicht konfiguriert.");
      return;
    }
    setEmail(TEST_EMAIL);
    setPassword(TEST_PASSWORD);
    await handleLogin(TEST_EMAIL, TEST_PASSWORD);
  };

  const handleLogout = async () => {
    if (!supabaseClient) return;
    await supabaseClient.auth.signOut();
    setStats(null);
    setEmail("");
    setPassword("");
    notify("Abgemeldet");
  };

  if (!supabaseClient) {
    return (
      <Box p="8">
        <Text color="red.500">
          Supabase-Konfiguration fehlt (NEXT_PUBLIC_SUPABASE_URL + ANON_KEY).
        </Text>
      </Box>
    );
  }

  return (
    <Box p="8" maxW="900px" mx="auto">
      <VStack gap="6" align="stretch">
        <Heading size="lg">Affiliate Portal</Heading>
        {statusMessage && (
          <Box bg="gray.800" color="white" p="3" borderRadius="md">
            <Text>{statusMessage}</Text>
          </Box>
        )}

        {!session ? (
          <Stack gap="3">
            <Stack gap="1">
              <Text fontSize="sm" color="gray.500">
                E-Mail
              </Text>
              <Input value={email} onChange={(event) => setEmail(event.target.value)} />
            </Stack>
            <Stack gap="1">
              <Text fontSize="sm" color="gray.500">
                Passwort
              </Text>
              <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
            </Stack>
            <Stack direction="row" gap="2">
              <Button colorScheme="blue" onClick={() => handleLogin()} loading={isLoading}>
                Login
              </Button>
              <Button variant="outline" onClick={handleQuickLogin} disabled={!TEST_EMAIL || !TEST_PASSWORD}>
                Schnellzugang
              </Button>
            </Stack>
          </Stack>
        ) : (
          <>
            <Flex justify="space-between" align="center">
              <Text>
                Eingeloggt als <b>{stats?.affiliate.email ?? session.user.email}</b>
              </Text>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </Flex>
            <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap="4">
              <Box borderWidth="1px" borderRadius="md" p="3">
                <Text fontSize="sm" color="gray.500">
                  Sales insgesamt
                </Text>
                <Text fontSize="2xl" fontWeight="bold">
                  {stats?.metrics.saleCount ?? 0}
                </Text>
              </Box>
              <Box borderWidth="1px" borderRadius="md" p="3">
                <Text fontSize="sm" color="gray.500">
                  Umsatz
                </Text>
                <Text fontSize="2xl" fontWeight="bold">
                  {(stats?.metrics.revenue ?? 0).toFixed(2)}€
                </Text>
              </Box>
              <Box borderWidth="1px" borderRadius="md" p="3">
                <Text fontSize="sm" color="gray.500">
                  Lifetime
                </Text>
                <Text fontSize="2xl" fontWeight="bold">
                  {(stats?.metrics.lifetimeRevenue ?? 0).toFixed(2)}€
                </Text>
              </Box>
            </Grid>
            <Stack gap="3">
              <Text fontWeight="semibold">Codes</Text>
              <Stack gap="0">
                {stats?.codes.map((code) => (
                  <Stack
                    key={code.id}
                    gap="2"
                    p="3"
                    borderRadius="md"
                    borderWidth="1px"
                    borderColor="gray.200"
                    bg="white"
                    boxShadow="sm"
                  >
                    <Text fontSize="sm" fontWeight="bold">
                      {code.code}
                    </Text>
                    {linkVariants.map((variant) => {
                      const affiliateLink = buildAffiliateLink(code.code, variant.path);
                      return (
                        <Flex
                          key={`${code.id}-${variant.path}`}
                          align="center"
                          justify="space-between"
                          gap="3"
                          flexWrap="wrap"
                        >
                          <Text fontSize="xs" color="gray.600" flex="1" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
                            {variant.label}: {affiliateLink}
                          </Text>
                          <Button size="xs" variant="ghost" onClick={() => handleCopyLink(affiliateLink)}>
                            Kopieren
                          </Button>
                        </Flex>
                      );
                    })}
                  </Stack>
                ))}
              </Stack>
            </Stack>
            <Box borderWidth="1px" borderRadius="md" p="4">
              <Text fontWeight="semibold" mb="3">
                Letzte Sales
              </Text>
              <Stack gap="2">
                {stats?.recentSales.map((sale) => (
                  <Flex key={sale.id} justify="space-between">
                    <Text fontSize="sm">{new Date(sale.saleAt).toLocaleString("de-DE")}</Text>
                    <Text fontSize="sm">{sale.affiliateCode ?? "—"}</Text>
                    <Text fontSize="sm">{sale.amount.toFixed(2)}€</Text>
                    <Text fontSize="sm">{sale.product}</Text>
                  </Flex>
                ))}
              </Stack>
            </Box>
          </>
        )}
      </VStack>
    </Box>
  );
}


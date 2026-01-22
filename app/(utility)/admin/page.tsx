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
  IconButton,
} from "@chakra-ui/react";
import { Collapsible } from "@chakra-ui/react";
import { NativeSelectField, NativeSelectRoot } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { Trash, Eye, PencilSimple, CaretDown, CaretUp } from "@phosphor-icons/react";

type OverviewResponse = {
  affiliates: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    createdAt: string;
    paidAmount: number;
    metrics: {
      saleCount: number;
      revenue: number;
      monthlySales: number;
      monthlyRevenue: number;
      lifetimeSales: number;
      lifetimeRevenue: number;
    };
    codes: Array<{
      id: string;
      code: string;
      label: string | null;
      isActive: boolean;
      saleCount: number;
      revenue: number;
    }>;
  }>;
  totals: {
    saleCount: number;
    revenue: number;
    monthlySales: number;
    monthlyRevenue: number;
    lifetimeSales: number;
    lifetimeRevenue: number;
  };
  latestSales: Array<{
    id: string;
    amount: number;
    currency: string | null;
    product: string;
    provider: string;
    saleAt: string;
    affiliateCode: string | null;
  }>;
};

type LandingPageVersion = {
  id: string;
  name: string;
  slug: string;
  title: string;
  vimeo_video_id: string;
  course_type: 'paid' | 'free';
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

const ADMIN_USERNAME = process.env.NEXT_PUBLIC_AFFILIATE_ADMIN_USERNAME ?? "admin";
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_AFFILIATE_ADMIN_PASSWORD ?? "sntsecure";

export default function AffiliateAdminPage() {
  const [overview, setOverview] = useState<OverviewResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [formState, setFormState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    code: "",
    label: "",
  });
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [adminCredentials, setAdminCredentials] = useState<
    | {
        username: string;
        password: string;
      }
    | null
  >(null);
  const [paidAmounts, setPaidAmounts] = useState<Record<string, string>>({});

  // Landing Page Versions State
  const [landingVersions, setLandingVersions] = useState<LandingPageVersion[]>([]);
  const [isLoadingVersions, setIsLoadingVersions] = useState(false);
  const [versionFormState, setVersionFormState] = useState({
    name: "",
    slug: "",
    title: "",
    vimeo_video_id: "",
    course_type: "paid" as 'paid' | 'free',
    is_active: true,
  });
  const [editingVersion, setEditingVersion] = useState<string | null>(null);

  // Collapse States
  const [isAffiliateCollapsed, setIsAffiliateCollapsed] = useState(false);
  const [isLandingPageCollapsed, setIsLandingPageCollapsed] = useState(false);

  const baseUrl = useMemo(() => {
    if (typeof window === "undefined") return "https://www.snt-mentorship-platform.de";
    return window.location.origin;
  }, []);

  const linkVariants = [
    { label: "Startseite", path: "/" },
    { label: "Checkout (monatlich)", path: "/checkout/monthly" },
    { label: "Checkout (lifetime)", path: "/checkout/lifetime" },
  ];

  const buildAffiliateLink = (code: string, path: string) => {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `${baseUrl}${normalizedPath}?aff=${code}`;
  };

  const isAuthenticated = Boolean(adminCredentials);
  const hasConfiguredCredentials = Boolean(ADMIN_USERNAME && ADMIN_PASSWORD);

  const headers = adminCredentials
    ? {
        "x-admin-username": adminCredentials.username,
        "x-admin-password": adminCredentials.password,
        "Content-Type": "application/json",
      }
    : null;

  const notify = (message: string | null) => setStatusMessage(message);

  const persistAdminCredentials = (value: { username: string; password: string }) => {
    sessionStorage.setItem("snt_affiliate_admin_credentials", JSON.stringify(value));
    setAdminCredentials(value);
  };

  const fetchOverview = async () => {
    if (!adminCredentials) {
      notify("Du musst dich zuerst anmelden");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch("/api/affiliates/admin/overview", {
        headers: headers ?? undefined,
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        notify(payload?.error ?? "Überblick konnte nicht geladen werden");
        return;
      }
      const data = (await response.json()) as OverviewResponse;
      setOverview(data);
      setPaidAmounts(
        Object.fromEntries(
          data.affiliates.map((entry) => [entry.id, entry.paidAmount.toFixed(2)])
        )
      );
      notify(null);
    } catch (error) {
      console.error(error);
      notify("Überblick konnte nicht geladen werden");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const cached = sessionStorage.getItem("snt_affiliate_admin_credentials");
    if (cached) {
      try {
        setAdminCredentials(JSON.parse(cached));
      } catch {
        setAdminCredentials(null);
      }
    }
  }, []);

  useEffect(() => {
    if (adminCredentials) {
      fetchOverview();
      fetchLandingVersions();
    }
  }, [adminCredentials]);

  const handleCreateAffiliate = async () => {
    if (!adminCredentials) {
      notify("Bitte melde dich zuerst an");
      return;
    }

    if (!formState.email || !formState.firstName || !formState.lastName || !formState.password) {
      notify("Bitte alle Pflichtfelder ausfüllen");
      return;
    }

    setIsSubmitting(true);
    try {
    const response = await fetch("/api/affiliates/admin/create", {
        method: "POST",
      headers: headers ?? undefined,
        body: JSON.stringify({
          firstName: formState.firstName,
          lastName: formState.lastName,
          email: formState.email,
          password: formState.password,
          initialCode: formState.code || undefined,
          initialLabel: formState.label || undefined,
        }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        notify(payload?.error ?? "Affiliate konnte nicht erstellt werden");
        return;
      }
      notify("Affiliate erfolgreich erstellt");
      setFormState({ firstName: "", lastName: "", email: "", password: "", code: "", label: "" });
      fetchOverview();
    } catch (error) {
      console.error(error);
      notify("Affiliate-Erstellung fehlgeschlagen");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateCode = async (affiliateId: string) => {
    if (!adminCredentials) {
      notify("Bitte melde dich zuerst an");
      return;
    }
    try {
      const response = await fetch("/api/affiliates/admin/code", {
        method: "POST",
        headers: headers ?? undefined,
        body: JSON.stringify({ affiliateId }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        notify(payload?.error ?? "Link konnte nicht erstellt werden");
        return;
      }
      notify("Link erstellt");
      fetchOverview();
    } catch (error) {
      console.error(error);
      notify("Link-Erstellung fehlgeschlagen");
    }
  };

  const handleSavePayout = async (affiliateId: string) => {
    if (!adminCredentials) {
      notify("Bitte melde dich zuerst an");
      return;
    }

    const value = parseFloat(paidAmounts[affiliateId] ?? "0");
    if (Number.isNaN(value)) {
      notify("Ungültiger Betrag");
      return;
    }

    try {
      const response = await fetch("/api/affiliates/admin/payout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-username": adminCredentials.username,
          "x-admin-password": adminCredentials.password,
        },
        body: JSON.stringify({
          affiliateId,
          paidAmount: value,
        }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        notify(payload?.error ?? "Auszahlung konnte nicht gespeichert werden");
        return;
      }

      notify("Auszahlung gespeichert");
      setPaidAmounts((prev) => ({ ...prev, [affiliateId]: value.toFixed(2) }));
      fetchOverview();
    } catch (error) {
      console.error(error);
      notify("Auszahlung konnte nicht gespeichert werden");
    }
  };

  const handleCopyLink = async (url: string) => {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      notify("Link kopiert");
    } catch (error) {
      console.error(error);
      notify("Clipboard nicht verfügbar");
    }
  };

  const handleCredentialLogin = () => {
    if (!hasConfiguredCredentials) {
      notify("Admin-Zugangsdaten sind nicht konfiguriert.");
      return;
    }

    if (
      credentials.username.trim() === ADMIN_USERNAME &&
      credentials.password.trim() === ADMIN_PASSWORD
    ) {
      persistAdminCredentials({
        username: credentials.username.trim(),
        password: credentials.password.trim(),
      });
      notify("Admin-Login erfolgreich");
    } else {
      notify("Ungültige Login-Daten");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("snt_affiliate_admin_credentials");
    setAdminCredentials(null);
    notify("Admin ausgeloggt");
  };

  // Landing Page Versions Functions
  const fetchLandingVersions = async () => {
    if (!adminCredentials) {
      notify("Du musst dich zuerst anmelden");
      return;
    }
    setIsLoadingVersions(true);
    try {
      const response = await fetch("/api/admin/landing-versions", {
        headers: headers ?? undefined,
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        notify(payload?.error ?? "Versionen konnten nicht geladen werden");
        return;
      }
      const data = await response.json();
      setLandingVersions(data.versions || []);
      notify(null);
    } catch (error) {
      console.error(error);
      notify("Versionen konnten nicht geladen werden");
    } finally {
      setIsLoadingVersions(false);
    }
  };

  const handleCreateOrUpdateVersion = async () => {
    if (!adminCredentials) {
      notify("Bitte melde dich zuerst an");
      return;
    }

    if (!versionFormState.name || !versionFormState.slug || !versionFormState.title || !versionFormState.vimeo_video_id) {
      notify("Bitte alle Pflichtfelder ausfüllen");
      return;
    }

    // Slug-Validierung
    if (!/^[a-z0-9-]+$/.test(versionFormState.slug)) {
      notify("Slug darf nur Kleinbuchstaben, Zahlen und Bindestriche enthalten");
      return;
    }

    // Vimeo ID Validierung
    if (!/^\d+$/.test(versionFormState.vimeo_video_id)) {
      notify("Vimeo Video ID muss numerisch sein");
      return;
    }

    setIsSubmitting(true);
    try {
      const url = editingVersion 
        ? `/api/admin/landing-versions/${editingVersion}`
        : "/api/admin/landing-versions";
      const method = editingVersion ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: headers ?? undefined,
        body: JSON.stringify(versionFormState),
      });
      
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        notify(payload?.error ?? "Version konnte nicht gespeichert werden");
        return;
      }
      
      notify(editingVersion ? "Version erfolgreich aktualisiert" : "Version erfolgreich erstellt");
      setVersionFormState({
        name: "",
        slug: "",
        title: "",
        vimeo_video_id: "",
        course_type: "paid",
        is_active: true,
      });
      setEditingVersion(null);
      fetchLandingVersions();
    } catch (error) {
      console.error(error);
      notify("Version-Speicherung fehlgeschlagen");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditVersion = (version: LandingPageVersion) => {
    setVersionFormState({
      name: version.name,
      slug: version.slug,
      title: version.title,
      vimeo_video_id: version.vimeo_video_id,
      course_type: version.course_type,
      is_active: version.is_active,
    });
    setEditingVersion(version.id);
  };

  const handleDeleteVersion = async (versionId: string) => {
    if (!adminCredentials) {
      notify("Bitte melde dich zuerst an");
      return;
    }

    if (!confirm("Bist du sicher, dass du diese Version löschen möchtest?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/landing-versions/${versionId}`, {
        method: "DELETE",
        headers: headers ?? undefined,
      });
      
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        notify(payload?.error ?? "Version konnte nicht gelöscht werden");
        return;
      }
      
      notify("Version erfolgreich gelöscht");
      fetchLandingVersions();
    } catch (error) {
      console.error(error);
      notify("Version-Löschung fehlgeschlagen");
    }
  };

  const handleCancelEdit = () => {
    setVersionFormState({
      name: "",
      slug: "",
      title: "",
      vimeo_video_id: "",
      course_type: "paid",
      is_active: true,
    });
    setEditingVersion(null);
  };

  return (
    <Box p="8" maxW="1200px" mx="auto">
      <VStack gap="8" align="stretch">
        <Heading size="lg">Affiliate Admin</Heading>
        {statusMessage && (
          <Box bg="gray.800" color="white" p="4" borderRadius="md">
            <Text>{statusMessage}</Text>
          </Box>
        )}

        <Box borderWidth="1px" borderRadius="md" p="6">
          <Text fontWeight="semibold" mb="4">
            Admin Login
          </Text>
          {isAuthenticated ? (
            <Flex justify="space-between" align="center">
              <Text>Angemeldet</Text>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </Flex>
          ) : (
            <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap="4">
              <Stack gap="1">
                <Text fontSize="sm" color="gray.500">
                  Benutzername
                </Text>
                <Input
                  value={credentials.username}
                  onChange={(event) => setCredentials((prev) => ({ ...prev, username: event.target.value }))}
                />
              </Stack>
              <Stack gap="1">
                <Text fontSize="sm" color="gray.500">
                  Passwort
                </Text>
                <Input
                  type="password"
                  value={credentials.password}
                  onChange={(event) => setCredentials((prev) => ({ ...prev, password: event.target.value }))}
                />
              </Stack>
              <Button alignSelf="end" colorScheme="blue" onClick={handleCredentialLogin}>
                Anmelden
              </Button>
            </Grid>
          )}
        </Box>

        <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap="4">
          {overview
            ? [
                {
                  label: "Umsatz",
                  value: `${overview.totals.revenue.toFixed(2)}€`,
                },
                {
                  label: "Sales",
                  value: `${overview.totals.saleCount}`,
                },
                {
                  label: "Lifetime-Einnahmen",
                  value: `${overview.totals.lifetimeRevenue.toFixed(2)}€`,
                },
              ].map((card) => (
                <Box key={card.label} bg="gray.900" p="4" borderRadius="md">
                  <Text fontSize="sm" color="gray.400">
                    {card.label}
                  </Text>
                  <Text fontSize="2xl" fontWeight="bold">
                    {card.value}
                  </Text>
                </Box>
              ))
            : null}
        </Grid>

        {isAuthenticated && (
          <Box borderWidth="1px" borderRadius="md" p="6">
            <HStack justify="space-between" align="center" mb="4">
              <Text fontWeight="semibold">
                Affiliate erstellen
              </Text>
              <IconButton
                aria-label="Toggle Affiliate Section"
                variant="ghost"
                size="sm"
                onClick={() => setIsAffiliateCollapsed(!isAffiliateCollapsed)}
              >
                {isAffiliateCollapsed ? <CaretDown size={20} /> : <CaretUp size={20} />}
              </IconButton>
            </HStack>
            
            <Collapsible.Root open={!isAffiliateCollapsed}>
              <Collapsible.Content>
            <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap="4">
              <Stack gap="1">
                <Text fontSize="sm" color="gray.500">
                  Vorname
                </Text>
                <Input
                  value={formState.firstName}
                  onChange={(event) => setFormState((prev) => ({ ...prev, firstName: event.target.value }))}
                />
              </Stack>
              <Stack gap="1">
                <Text fontSize="sm" color="gray.500">
                  Nachname
                </Text>
                <Input
                  value={formState.lastName}
                  onChange={(event) => setFormState((prev) => ({ ...prev, lastName: event.target.value }))}
                />
              </Stack>
              <Stack gap="1">
                <Text fontSize="sm" color="gray.500">
                  E-Mail
                </Text>
                <Input
                  type="email"
                  value={formState.email}
                  onChange={(event) => setFormState((prev) => ({ ...prev, email: event.target.value }))}
                />
              </Stack>
              <Stack gap="1">
                <Text fontSize="sm" color="gray.500">
                  Passwort
                </Text>
                <Input
                  type="password"
                  value={formState.password}
                  onChange={(event) => setFormState((prev) => ({ ...prev, password: event.target.value }))}
                />
              </Stack>
              <Stack gap="1">
                <Text fontSize="sm" color="gray.500">
                  Initialer Code
                </Text>
                <Input
                  value={formState.code}
                  onChange={(event) => setFormState((prev) => ({ ...prev, code: event.target.value }))}
                />
              </Stack>
              <Stack gap="1">
                <Text fontSize="sm" color="gray.500">
                  Label
                </Text>
                <Input
                  value={formState.label}
                  onChange={(event) => setFormState((prev) => ({ ...prev, label: event.target.value }))}
                />
              </Stack>
            </Grid>
            <Button mt="4" colorScheme="blue" onClick={handleCreateAffiliate} disabled={!isAuthenticated} loading={isSubmitting}>
              Affiliate erstellen
            </Button>
              </Collapsible.Content>
            </Collapsible.Root>
          </Box>
        )}

        <Box borderWidth="1px" borderRadius="md" p="6">
          <Text fontWeight="semibold" mb="4">
            Affiliates
          </Text>
          <Stack gap="4">
            {(overview?.affiliates ?? []).map((affiliate) => (
              <Box key={affiliate.id} borderWidth="1px" borderRadius="md" p="4">
                <Flex justify="space-between" align="center">
                  <Box>
                    <Text fontWeight="bold">
                      {affiliate.firstName} {affiliate.lastName}
                    </Text>
                    <Text fontSize="sm" color="gray.400">
                      {affiliate.email}
                    </Text>
                  </Box>
                  <Button size="sm" onClick={() => handleCreateCode(affiliate.id)}>
                    + Code
                  </Button>
                </Flex>
                <Text fontSize="sm" color="gray.500" mt="2">
                  Sales: {affiliate.metrics.saleCount} • Umsatz: {affiliate.metrics.revenue.toFixed(2)}€
                </Text>
                <Flex align="center" gap="2" mt="2" wrap="wrap">
                  <Text fontSize="sm" color="gray.600">
                    Ausgezahlt (€)
                  </Text>
                  <Input
                    size="sm"
                    type="number"
                    min="0"
                    value={paidAmounts[affiliate.id] ?? affiliate.paidAmount.toFixed(2)}
                    onChange={(event) =>
                      setPaidAmounts((prev) => ({
                        ...prev,
                        [affiliate.id]: event.target.value,
                      }))
                    }
                    width="150px"
                  />
                  <Button size="xs" colorScheme="blue" onClick={() => handleSavePayout(affiliate.id)}>
                    Speichern
                  </Button>
                </Flex>
                <Stack gap="3" mt="3">
                  <Text fontSize="sm" color="gray.500">
                    Tracking-Links
                  </Text>
                  {affiliate.codes.map((code) => (
                  <Stack
                    key={code.id}
                    gap="2"
                    p="3"
                    borderWidth="1px"
                    borderColor="gray.200"
                    borderRadius="md"
                    bg="white"
                    boxShadow="sm"
                  >
                      <Text fontSize="xs" fontWeight="bold" color="gray.600">
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
                            <Text fontSize="xs" color="gray.700" flex="1" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
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
              </Box>
            ))}
          </Stack>
        </Box>

        <Box borderWidth="1px" borderRadius="md" p="6">
          <Text fontWeight="semibold" mb="4">
            Letzte Sales
          </Text>
          <Stack gap="3">
            {(overview?.latestSales ?? []).map((sale) => (
              <Flex key={sale.id} justify="space-between">
                <Text>{new Date(sale.saleAt).toLocaleString("de-DE")}</Text>
                <Text>{sale.affiliateCode ?? "—"}</Text>
                <Text>
                  {sale.amount.toFixed(2)}
                  {sale.currency ?? "€"}
                </Text>
                <Text>{sale.product}</Text>
                <Text>{sale.provider}</Text>
              </Flex>
            ))}
          </Stack>
        </Box>

        {/* Landing Page Versionen Section */}
        {isAuthenticated && (
          <Box borderWidth="1px" borderRadius="md" p="6">
            <HStack justify="space-between" align="center" mb="4">
              <Text fontWeight="semibold">
                Landing Page Versionen
              </Text>
              <IconButton
                aria-label="Toggle Landing Page Section"
                variant="ghost"
                size="sm"
                onClick={() => setIsLandingPageCollapsed(!isLandingPageCollapsed)}
              >
                {isLandingPageCollapsed ? <CaretDown size={20} /> : <CaretUp size={20} />}
              </IconButton>
            </HStack>
            
            <Collapsible.Root open={!isLandingPageCollapsed}>
              <Collapsible.Content>
            
            {/* Version erstellen/bearbeiten Form */}
            <Box borderWidth="1px" borderRadius="md" p="4" mb="6" bg="gray.50">
              <Text fontWeight="medium" mb="4" color="gray.800">
                {editingVersion ? "Version bearbeiten" : "Neue Version erstellen"}
              </Text>
              <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap="4" mb="4">
                <Stack gap="1">
                  <Text fontSize="sm" color="gray.600" fontWeight="medium">
                    Name *
                  </Text>
                  <Input
                    placeholder="z.B. Standard Landing Page"
                    value={versionFormState.name}
                    onChange={(e) => setVersionFormState(prev => ({ ...prev, name: e.target.value }))}
                    bg="white"
                    color="gray.800"
                    borderColor="gray.300"
                    _placeholder={{ color: "gray.500" }}
                    _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px blue.500" }}
                  />
                </Stack>
                <Stack gap="1">
                  <Text fontSize="sm" color="gray.600" fontWeight="medium">
                    Slug * (nur a-z, 0-9, -)
                  </Text>
                  <Input
                    placeholder="z.B. standard oder free-course"
                    value={versionFormState.slug}
                    onChange={(e) => setVersionFormState(prev => ({ ...prev, slug: e.target.value.toLowerCase() }))}
                    bg="white"
                    color="gray.800"
                    borderColor="gray.300"
                    _placeholder={{ color: "gray.500" }}
                    _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px blue.500" }}
                  />
                </Stack>
                <Stack gap="1">
                  <Text fontSize="sm" color="gray.600" fontWeight="medium">
                    Titel *
                  </Text>
                  <Input
                    placeholder="z.B. LERNE WIE DU PROFITABEL TRADEST"
                    value={versionFormState.title}
                    onChange={(e) => setVersionFormState(prev => ({ ...prev, title: e.target.value }))}
                    bg="white"
                    color="gray.800"
                    borderColor="gray.300"
                    _placeholder={{ color: "gray.500" }}
                    _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px blue.500" }}
                  />
                </Stack>
                <Stack gap="1">
                  <Text fontSize="sm" color="gray.600" fontWeight="medium">
                    Vimeo Video ID * (nur Zahlen)
                  </Text>
                  <Input
                    placeholder="z.B. 1104311683"
                    value={versionFormState.vimeo_video_id}
                    onChange={(e) => setVersionFormState(prev => ({ ...prev, vimeo_video_id: e.target.value }))}
                    bg="white"
                    color="gray.800"
                    borderColor="gray.300"
                    _placeholder={{ color: "gray.500" }}
                    _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px blue.500" }}
                  />
                </Stack>
                <Stack gap="1">
                  <Text fontSize="sm" color="gray.600" fontWeight="medium">
                    Kurs-Typ *
                  </Text>
                  <NativeSelectRoot>
                    <NativeSelectField
                      value={versionFormState.course_type}
                      onChange={(e) => setVersionFormState(prev => ({ ...prev, course_type: e.target.value as 'paid' | 'free' }))}
                      bg="white"
                      color="gray.800"
                      borderColor="gray.300"
                      _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px blue.500" }}
                    >
                      <option value="paid" style={{ backgroundColor: 'white', color: '#2D3748' }}>Paid (zeigt Pricing)</option>
                      <option value="free" style={{ backgroundColor: 'white', color: '#2D3748' }}>Free (zeigt Registration Modal)</option>
                    </NativeSelectField>
                  </NativeSelectRoot>
                </Stack>
                <Stack gap="1">
                  <Text fontSize="sm" color="gray.600" fontWeight="medium">
                    Status
                  </Text>
                  <NativeSelectRoot>
                    <NativeSelectField
                      value={versionFormState.is_active ? "true" : "false"}
                      onChange={(e) => setVersionFormState(prev => ({ ...prev, is_active: e.target.value === "true" }))}
                      bg="white"
                      color="gray.800"
                      borderColor="gray.300"
                      _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px blue.500" }}
                    >
                      <option value="true">Aktiv</option>
                      <option value="false">Inaktiv</option>
                    </NativeSelectField>
                  </NativeSelectRoot>
                </Stack>
              </Grid>
              <HStack gap="2">
                <Button 
                  colorScheme="blue" 
                  onClick={handleCreateOrUpdateVersion} 
                  loading={isSubmitting}
                >
                  {editingVersion ? "Version aktualisieren" : "Version erstellen"}
                </Button>
                {editingVersion && (
                  <Button variant="outline" onClick={handleCancelEdit}>
                    Abbrechen
                  </Button>
                )}
              </HStack>
            </Box>

            {/* Versionen Liste */}
            <Stack gap="4">
              <Text fontWeight="medium" color="gray.800">Existierende Versionen</Text>
              {isLoadingVersions ? (
                <Text>Lade Versionen...</Text>
              ) : landingVersions.length === 0 ? (
                <Text color="gray.600">Keine Versionen vorhanden</Text>
              ) : (
                landingVersions.map((version) => (
                  <Box key={version.id} borderWidth="1px" borderRadius="md" p="4">
                    <Flex justify="space-between" align="start" mb="2">
                      <Box flex="1">
                        <HStack gap="2" mb="1">
                          <Text fontWeight="bold" color="gray.800">{version.name}</Text>
                          <Box
                            px="2"
                            py="1"
                            borderRadius="md"
                            fontSize="xs"
                            fontWeight="medium"
                            bg={version.is_active ? "green.100" : "gray.100"}
                            color={version.is_active ? "green.800" : "gray.600"}
                          >
                            {version.is_active ? "Aktiv" : "Inaktiv"}
                          </Box>
                          <Box
                            px="2"
                            py="1"
                            borderRadius="md"
                            fontSize="xs"
                            fontWeight="medium"
                            bg={version.course_type === "paid" ? "blue.100" : "purple.100"}
                            color={version.course_type === "paid" ? "blue.800" : "purple.800"}
                          >
                            {version.course_type === "paid" ? "Paid" : "Free"}
                          </Box>
                        </HStack>
                        <Text fontSize="sm" color="gray.700" mb="1">
                          Slug: /{version.slug}
                        </Text>
                        <Text fontSize="sm" color="gray.700" mb="1">
                          Titel: {version.title}
                        </Text>
                        <Text fontSize="sm" color="gray.700">
                          Vimeo ID: {version.vimeo_video_id}
                        </Text>
                      </Box>
                      <HStack gap="1">
                        <IconButton
                          aria-label="Vorschau"
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(`${baseUrl}/landing/${version.slug}`, '_blank')}
                        >
                          <Eye size={16} />
                        </IconButton>
                        <IconButton
                          aria-label="Bearbeiten"
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditVersion(version)}
                        >
                          <PencilSimple size={16} />
                        </IconButton>
                        <IconButton
                          aria-label="Löschen"
                          size="sm"
                          variant="outline"
                          colorScheme="red"
                          onClick={() => handleDeleteVersion(version.id)}
                        >
                          <Trash size={16} />
                        </IconButton>
                      </HStack>
                    </Flex>
                    <Text fontSize="xs" color="gray.600">
                      Erstellt: {new Date(version.created_at).toLocaleString("de-DE")}
                    </Text>
                    {version.updated_at !== version.created_at && (
                      <Text fontSize="xs" color="gray.600">
                        Aktualisiert: {new Date(version.updated_at).toLocaleString("de-DE")}
                      </Text>
                    )}
                  </Box>
                ))
              )}
            </Stack>
              </Collapsible.Content>
            </Collapsible.Root>
          </Box>
        )}
      </VStack>
    </Box>
  );
}



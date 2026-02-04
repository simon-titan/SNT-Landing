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
  Badge,
  Table,
  Spinner,
} from "@chakra-ui/react";
import { Collapsible } from "@chakra-ui/react";
import { NativeSelectField, NativeSelectRoot } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { Trash, Eye, PencilSimple, CaretDown, CaretUp, TelegramLogo, Users, Check, X, Plus, MagnifyingGlass } from "@phosphor-icons/react";

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

// Telegram Types
type TelegramMember = {
  id: string;
  telegram_user_id: number;
  telegram_username: string | null;
  telegram_first_name: string | null;
  outseta_email: string | null;
  subscription_status: string;
  is_in_group: boolean;
  created_at: string;
};

type TelegramStats = {
  total_members: number;
  active_members: number;
  pending_members: number;
  cancelled_members: number;
  members_in_group: number;
  new_today: number;
  new_this_week: number;
};

type TelegramFaq = {
  id: string;
  trigger_keywords: string[];
  question: string;
  answer: string;
  category: string;
  is_active: boolean;
  usage_count: number;
  created_at: string;
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
  const [isTelegramCollapsed, setIsTelegramCollapsed] = useState(false);

  // Telegram States
  const [telegramMembers, setTelegramMembers] = useState<TelegramMember[]>([]);
  const [telegramStats, setTelegramStats] = useState<TelegramStats | null>(null);
  const [isLoadingTelegram, setIsLoadingTelegram] = useState(false);
  const [telegramSearch, setTelegramSearch] = useState("");
  const [telegramFilter, setTelegramFilter] = useState("all");
  const [testTelegramUserId, setTestTelegramUserId] = useState("");
  const [testActivationResult, setTestActivationResult] = useState<string | null>(null);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newMemberData, setNewMemberData] = useState({ telegram_user_id: "", email: "" });

  // FAQ States
  const [telegramFaqs, setTelegramFaqs] = useState<TelegramFaq[]>([]);
  const [isLoadingFaqs, setIsLoadingFaqs] = useState(false);
  const [showAddFaqModal, setShowAddFaqModal] = useState(false);
  const [editingFaq, setEditingFaq] = useState<TelegramFaq | null>(null);
  const [faqFormState, setFaqFormState] = useState({
    question: "",
    answer: "",
    keywords: "",
    category: "general",
    is_active: true,
  });
  const [telegramActiveTab, setTelegramActiveTab] = useState<"members" | "faq">("members");

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
      fetchTelegramData();
      fetchTelegramFaqs();
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

  // Telegram Functions
  const fetchTelegramData = async () => {
    if (!adminCredentials) return;
    setIsLoadingTelegram(true);
    try {
      const response = await fetch("/api/admin/telegram-group/members?stats=true&limit=100", {
        headers: headers ?? undefined,
      });
      if (response.ok) {
        const data = await response.json();
        setTelegramMembers(data.members || []);
        setTelegramStats(data.stats || null);
      }
    } catch (error) {
      console.error("Telegram-Daten konnten nicht geladen werden:", error);
    } finally {
      setIsLoadingTelegram(false);
    }
  };

  const handleTelegramMemberAction = async (telegramUserId: number, action: "activate" | "cancel") => {
    if (!adminCredentials) return;
    try {
      const response = await fetch("/api/admin/telegram-group/members", {
        method: "PUT",
        headers: headers ?? undefined,
        body: JSON.stringify({ telegram_user_id: telegramUserId, action }),
      });
      if (response.ok) {
        notify(`Mitglied ${action === "activate" ? "aktiviert" : "entfernt"}`);
        fetchTelegramData();
      } else {
        const data = await response.json();
        notify(data.error || "Aktion fehlgeschlagen");
      }
    } catch (error) {
      notify("Aktion fehlgeschlagen");
    }
  };

  const handleAddTelegramMember = async () => {
    if (!adminCredentials) return;
    if (!newMemberData.telegram_user_id) {
      notify("Telegram User ID ist erforderlich");
      return;
    }
    try {
      const response = await fetch("/api/admin/telegram-group/members", {
        method: "POST",
        headers: headers ?? undefined,
        body: JSON.stringify({
          telegram_user_id: newMemberData.telegram_user_id,
          email: newMemberData.email || undefined,
          activate: true,
        }),
      });
      if (response.ok) {
        notify("Mitglied hinzugefügt und aktiviert");
        setShowAddMemberModal(false);
        setNewMemberData({ telegram_user_id: "", email: "" });
        fetchTelegramData();
      } else {
        const data = await response.json();
        notify(data.error || "Hinzufügen fehlgeschlagen");
      }
    } catch (error) {
      notify("Hinzufügen fehlgeschlagen");
    }
  };

  const handleTestActivation = async () => {
    if (!testTelegramUserId) {
      setTestActivationResult("Bitte Telegram User ID eingeben");
      return;
    }
    setTestActivationResult("Aktiviere...");
    try {
      const response = await fetch("/api/telegram/paid-group/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          telegram_user_id: parseInt(testTelegramUserId),
          provider: "test",
        }),
      });
      const data = await response.json();
      if (data.success) {
        setTestActivationResult(`Aktiviert! Invite-Link: ${data.invite_link || "wird per Telegram gesendet"}`);
        fetchTelegramData();
      } else {
        setTestActivationResult(`Fehler: ${data.error}`);
      }
    } catch (error) {
      setTestActivationResult(`Fehler: ${error}`);
    }
  };

  const filteredTelegramMembers = telegramMembers.filter((m) => {
    const matchesSearch =
      !telegramSearch ||
      m.telegram_username?.toLowerCase().includes(telegramSearch.toLowerCase()) ||
      m.outseta_email?.toLowerCase().includes(telegramSearch.toLowerCase()) ||
      m.telegram_user_id.toString().includes(telegramSearch);

    const matchesFilter =
      telegramFilter === "all" ||
      (telegramFilter === "active" && m.subscription_status === "active") ||
      (telegramFilter === "pending" && m.subscription_status === "pending") ||
      (telegramFilter === "cancelled" && m.subscription_status === "cancelled") ||
      (telegramFilter === "in_group" && m.is_in_group);

    return matchesSearch && matchesFilter;
  });

  // FAQ Functions
  const fetchTelegramFaqs = async () => {
    if (!adminCredentials) return;
    setIsLoadingFaqs(true);
    try {
      const response = await fetch("/api/admin/telegram-group/faq?include_inactive=true", {
        headers: headers ?? undefined,
      });
      if (response.ok) {
        const data = await response.json();
        setTelegramFaqs(data.faqs || []);
      }
    } catch (error) {
      console.error("FAQ-Daten konnten nicht geladen werden:", error);
    } finally {
      setIsLoadingFaqs(false);
    }
  };

  const handleSaveFaq = async () => {
    if (!adminCredentials) return;
    if (!faqFormState.question || !faqFormState.answer || !faqFormState.keywords) {
      notify("Bitte alle Felder ausfüllen");
      return;
    }

    const keywords = faqFormState.keywords.split(",").map((k) => k.trim().toLowerCase()).filter(Boolean);
    if (keywords.length === 0) {
      notify("Mindestens ein Keyword erforderlich");
      return;
    }

    try {
      const url = editingFaq ? "/api/admin/telegram-group/faq" : "/api/admin/telegram-group/faq";
      const method = editingFaq ? "PUT" : "POST";
      const body = editingFaq
        ? {
            id: editingFaq.id,
            question: faqFormState.question,
            answer: faqFormState.answer,
            trigger_keywords: keywords,
            category: faqFormState.category,
            is_active: faqFormState.is_active,
          }
        : {
            question: faqFormState.question,
            answer: faqFormState.answer,
            trigger_keywords: keywords,
            category: faqFormState.category,
            is_active: faqFormState.is_active,
          };

      const response = await fetch(url, {
        method,
        headers: headers ?? undefined,
        body: JSON.stringify(body),
      });

      if (response.ok) {
        notify(editingFaq ? "FAQ aktualisiert" : "FAQ erstellt");
        setShowAddFaqModal(false);
        setEditingFaq(null);
        setFaqFormState({ question: "", answer: "", keywords: "", category: "general", is_active: true });
        fetchTelegramFaqs();
      } else {
        const data = await response.json();
        notify(data.error || "Fehler beim Speichern");
      }
    } catch (error) {
      notify("Fehler beim Speichern");
    }
  };

  const handleEditFaq = (faq: TelegramFaq) => {
    setEditingFaq(faq);
    setFaqFormState({
      question: faq.question,
      answer: faq.answer,
      keywords: faq.trigger_keywords.join(", "),
      category: faq.category,
      is_active: faq.is_active,
    });
    setShowAddFaqModal(true);
  };

  const handleDeleteFaq = async (faqId: string) => {
    if (!adminCredentials) return;
    if (!confirm("FAQ wirklich löschen?")) return;

    try {
      const response = await fetch(`/api/admin/telegram-group/faq?id=${faqId}`, {
        method: "DELETE",
        headers: headers ?? undefined,
      });
      if (response.ok) {
        notify("FAQ gelöscht");
        fetchTelegramFaqs();
      } else {
        notify("Fehler beim Löschen");
      }
    } catch (error) {
      notify("Fehler beim Löschen");
    }
  };

  const handleToggleFaqActive = async (faq: TelegramFaq) => {
    if (!adminCredentials) return;
    try {
      const response = await fetch("/api/admin/telegram-group/faq", {
        method: "PUT",
        headers: headers ?? undefined,
        body: JSON.stringify({ id: faq.id, is_active: !faq.is_active }),
      });
      if (response.ok) {
        notify(faq.is_active ? "FAQ deaktiviert" : "FAQ aktiviert");
        fetchTelegramFaqs();
      }
    } catch (error) {
      notify("Fehler beim Aktualisieren");
    }
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

        {/* Telegram Gruppe Section */}
        {isAuthenticated && (
          <Box borderWidth="1px" borderRadius="md" p="6">
            <HStack justify="space-between" align="center" mb="4">
              <HStack gap="2">
                <TelegramLogo size={24} color="#0088cc" weight="fill" />
                <Text fontWeight="semibold">Telegram Gruppe</Text>
              </HStack>
              <IconButton
                aria-label="Toggle Telegram Section"
                variant="ghost"
                size="sm"
                onClick={() => setIsTelegramCollapsed(!isTelegramCollapsed)}
              >
                {isTelegramCollapsed ? <CaretDown size={20} /> : <CaretUp size={20} />}
              </IconButton>
            </HStack>

            <Collapsible.Root open={!isTelegramCollapsed}>
              <Collapsible.Content>
                {/* Stats */}
                {telegramStats && (
                  <Grid templateColumns={{ base: "1fr 1fr", md: "repeat(4, 1fr)" }} gap="4" mb="6">
                    <Box bg="gray.900" p="4" borderRadius="md">
                      <Text fontSize="sm" color="gray.400">Gesamt</Text>
                      <Text fontSize="2xl" fontWeight="bold">{telegramStats.total_members}</Text>
                    </Box>
                    <Box bg="gray.900" p="4" borderRadius="md">
                      <Text fontSize="sm" color="gray.400">Aktiv</Text>
                      <Text fontSize="2xl" fontWeight="bold" color="green.400">{telegramStats.active_members}</Text>
                    </Box>
                    <Box bg="gray.900" p="4" borderRadius="md">
                      <Text fontSize="sm" color="gray.400">In Gruppe</Text>
                      <Text fontSize="2xl" fontWeight="bold" color="blue.400">{telegramStats.members_in_group}</Text>
                    </Box>
                    <Box bg="gray.900" p="4" borderRadius="md">
                      <Text fontSize="sm" color="gray.400">FAQs aktiv</Text>
                      <Text fontSize="2xl" fontWeight="bold">{telegramFaqs.filter(f => f.is_active).length}</Text>
                    </Box>
                  </Grid>
                )}

                {/* Test Activation */}
                <Box borderWidth="1px" borderRadius="md" p="4" mb="6" bg="yellow.50">
                  <Text fontWeight="medium" mb="3" color="gray.800">Test-Aktivierung (ohne Zahlung)</Text>
                  <HStack gap="2">
                    <Input
                      placeholder="Telegram User ID (z.B. 123456789)"
                      value={testTelegramUserId}
                      onChange={(e) => setTestTelegramUserId(e.target.value)}
                      bg="white"
                      color="gray.800"
                      maxW="300px"
                    />
                    <Button colorScheme="yellow" onClick={handleTestActivation}>
                      Test-Aktivierung
                    </Button>
                  </HStack>
                  {testActivationResult && (
                    <Text fontSize="sm" mt="2" color="gray.700" fontFamily="mono">
                      {testActivationResult}
                    </Text>
                  )}
                </Box>

                {/* Tabs for Members / FAQ */}
                <HStack gap="0" mb="4" borderBottom="1px solid" borderColor="gray.200">
                  <Button
                    variant="ghost"
                    borderRadius="0"
                    borderBottom={telegramActiveTab === "members" ? "2px solid" : "none"}
                    borderColor="blue.500"
                    color={telegramActiveTab === "members" ? "blue.500" : "gray.500"}
                    onClick={() => setTelegramActiveTab("members")}
                  >
                    <Users size={18} /> Mitglieder
                  </Button>
                  <Button
                    variant="ghost"
                    borderRadius="0"
                    borderBottom={telegramActiveTab === "faq" ? "2px solid" : "none"}
                    borderColor="blue.500"
                    color={telegramActiveTab === "faq" ? "blue.500" : "gray.500"}
                    onClick={() => setTelegramActiveTab("faq")}
                  >
                    FAQ-Antworten
                  </Button>
                </HStack>

                {/* Members Tab Content */}
                {telegramActiveTab === "members" && (
                  <>
                    {/* Controls */}
                    <HStack justify="space-between" mb="4" flexWrap="wrap" gap="2">
                      <HStack gap="2">
                        <Input
                          placeholder="Suchen..."
                          value={telegramSearch}
                          onChange={(e) => setTelegramSearch(e.target.value)}
                          maxW="200px"
                        />
                        <NativeSelectRoot maxW="150px">
                          <NativeSelectField
                            value={telegramFilter}
                            onChange={(e) => setTelegramFilter(e.target.value)}
                          >
                            <option value="all">Alle</option>
                            <option value="active">Aktiv</option>
                            <option value="pending">Ausstehend</option>
                            <option value="cancelled">Gekündigt</option>
                            <option value="in_group">In Gruppe</option>
                          </NativeSelectField>
                        </NativeSelectRoot>
                      </HStack>
                      <Button size="sm" colorScheme="blue" onClick={() => setShowAddMemberModal(true)}>
                        <Plus size={16} /> Mitglied hinzufügen
                      </Button>
                    </HStack>

                    {/* Members Table */}
                    {isLoadingTelegram ? (
                      <Flex justify="center" py="8">
                        <Spinner size="lg" color="blue.500" />
                      </Flex>
                    ) : (
                      <Box borderWidth="1px" borderRadius="md" overflow="hidden">
                        <Table.Root size="sm">
                          <Table.Header>
                            <Table.Row>
                              <Table.ColumnHeader>Telegram ID</Table.ColumnHeader>
                              <Table.ColumnHeader>Username</Table.ColumnHeader>
                              <Table.ColumnHeader>E-Mail</Table.ColumnHeader>
                              <Table.ColumnHeader>Status</Table.ColumnHeader>
                              <Table.ColumnHeader>In Gruppe</Table.ColumnHeader>
                              <Table.ColumnHeader>Aktionen</Table.ColumnHeader>
                            </Table.Row>
                          </Table.Header>
                          <Table.Body>
                            {filteredTelegramMembers.length === 0 ? (
                              <Table.Row>
                                <Table.Cell colSpan={6}>
                                  <Text textAlign="center" py="4" color="gray.500">
                                    Keine Mitglieder gefunden
                                  </Text>
                                </Table.Cell>
                              </Table.Row>
                            ) : (
                              filteredTelegramMembers.map((member) => (
                                <Table.Row key={member.id}>
                                  <Table.Cell fontFamily="mono" fontSize="sm">
                                    {member.telegram_user_id}
                                  </Table.Cell>
                                  <Table.Cell>
                                    {member.telegram_username ? `@${member.telegram_username}` : "-"}
                                  </Table.Cell>
                                  <Table.Cell>{member.outseta_email || "-"}</Table.Cell>
                                  <Table.Cell>
                                    <Badge
                                      colorPalette={
                                        member.subscription_status === "active"
                                          ? "green"
                                          : member.subscription_status === "pending"
                                          ? "yellow"
                                          : "red"
                                      }
                                    >
                                      {member.subscription_status}
                                    </Badge>
                                  </Table.Cell>
                                  <Table.Cell>
                                    {member.is_in_group ? (
                                      <Check size={18} color="green" />
                                    ) : (
                                      <X size={18} color="red" />
                                    )}
                                  </Table.Cell>
                                  <Table.Cell>
                                    <HStack gap="1">
                                      {member.subscription_status !== "active" && (
                                        <Button
                                          size="xs"
                                          colorScheme="green"
                                          onClick={() => handleTelegramMemberAction(member.telegram_user_id, "activate")}
                                        >
                                          Aktivieren
                                        </Button>
                                      )}
                                      {member.subscription_status === "active" && (
                                        <Button
                                          size="xs"
                                          colorScheme="red"
                                          onClick={() => handleTelegramMemberAction(member.telegram_user_id, "cancel")}
                                        >
                                          Entfernen
                                        </Button>
                                      )}
                                    </HStack>
                                  </Table.Cell>
                                </Table.Row>
                              ))
                            )}
                          </Table.Body>
                        </Table.Root>
                      </Box>
                    )}

                    {/* Refresh Button */}
                    <HStack justify="flex-end" mt="4">
                      <Button size="sm" variant="outline" onClick={fetchTelegramData} loading={isLoadingTelegram}>
                        Aktualisieren
                      </Button>
                    </HStack>
                  </>
                )}

                {/* FAQ Tab Content */}
                {telegramActiveTab === "faq" && (
                  <>
                    <HStack justify="space-between" mb="4">
                      <Text fontSize="sm" color="gray.500">
                        {telegramFaqs.length} FAQ-Einträge ({telegramFaqs.filter(f => f.is_active).length} aktiv)
                      </Text>
                      <Button size="sm" colorScheme="blue" onClick={() => {
                        setEditingFaq(null);
                        setFaqFormState({ question: "", answer: "", keywords: "", category: "general", is_active: true });
                        setShowAddFaqModal(true);
                      }}>
                        <Plus size={16} /> Neue FAQ
                      </Button>
                    </HStack>

                    {isLoadingFaqs ? (
                      <Flex justify="center" py="8">
                        <Spinner size="lg" color="blue.500" />
                      </Flex>
                    ) : telegramFaqs.length === 0 ? (
                      <Box textAlign="center" py="8" color="gray.500">
                        <Text>Keine FAQ-Einträge vorhanden</Text>
                        <Text fontSize="sm">Erstelle einen neuen Eintrag um automatische Antworten einzurichten.</Text>
                      </Box>
                    ) : (
                      <VStack gap="3" align="stretch">
                        {telegramFaqs.map((faq) => (
                          <Box
                            key={faq.id}
                            borderWidth="1px"
                            borderRadius="md"
                            p="4"
                            opacity={faq.is_active ? 1 : 0.6}
                          >
                            <HStack justify="space-between" mb="2">
                              <HStack gap="2">
                                <Badge colorPalette={faq.is_active ? "green" : "gray"}>
                                  {faq.is_active ? "Aktiv" : "Inaktiv"}
                                </Badge>
                                <Badge>{faq.category}</Badge>
                                <Text fontSize="xs" color="gray.500">
                                  {faq.usage_count}x verwendet
                                </Text>
                              </HStack>
                              <HStack gap="1">
                                <Button size="xs" variant="outline" onClick={() => handleToggleFaqActive(faq)}>
                                  {faq.is_active ? "Deaktivieren" : "Aktivieren"}
                                </Button>
                                <Button size="xs" variant="outline" onClick={() => handleEditFaq(faq)}>
                                  <PencilSimple size={14} />
                                </Button>
                                <Button size="xs" variant="outline" colorScheme="red" onClick={() => handleDeleteFaq(faq.id)}>
                                  <Trash size={14} />
                                </Button>
                              </HStack>
                            </HStack>
                            <Text fontWeight="medium" mb="1">{faq.question}</Text>
                            <Text fontSize="sm" color="gray.600" mb="2">{faq.answer}</Text>
                            <HStack gap="1" flexWrap="wrap">
                              {faq.trigger_keywords.map((kw, i) => (
                                <Badge key={i} size="sm" colorPalette="blue">{kw}</Badge>
                              ))}
                            </HStack>
                          </Box>
                        ))}
                      </VStack>
                    )}

                    {/* Refresh Button */}
                    <HStack justify="flex-end" mt="4">
                      <Button size="sm" variant="outline" onClick={fetchTelegramFaqs} loading={isLoadingFaqs}>
                        Aktualisieren
                      </Button>
                    </HStack>
                  </>
                )}
              </Collapsible.Content>
            </Collapsible.Root>
          </Box>
        )}

        {/* Add Member Modal */}
        {showAddMemberModal && (
          <Box
            position="fixed"
            top="0"
            left="0"
            right="0"
            bottom="0"
            bg="blackAlpha.500"
            display="flex"
            alignItems="center"
            justifyContent="center"
            zIndex="1000"
            onClick={() => setShowAddMemberModal(false)}
          >
            <Box
              bg="white"
              p="6"
              borderRadius="xl"
              maxW="400px"
              w="full"
              mx="4"
              onClick={(e) => e.stopPropagation()}
            >
              <VStack gap="4" align="stretch">
                <Heading size="md" color="gray.800">Telegram Mitglied hinzufügen</Heading>
                <Stack gap="1">
                  <Text fontSize="sm" color="gray.600">Telegram User ID *</Text>
                  <Input
                    placeholder="z.B. 123456789"
                    value={newMemberData.telegram_user_id}
                    onChange={(e) => setNewMemberData({ ...newMemberData, telegram_user_id: e.target.value })}
                    color="gray.800"
                  />
                </Stack>
                <Stack gap="1">
                  <Text fontSize="sm" color="gray.600">E-Mail (optional)</Text>
                  <Input
                    placeholder="email@example.com"
                    value={newMemberData.email}
                    onChange={(e) => setNewMemberData({ ...newMemberData, email: e.target.value })}
                    color="gray.800"
                  />
                </Stack>
                <HStack justify="flex-end" gap="2">
                  <Button variant="outline" onClick={() => setShowAddMemberModal(false)}>
                    Abbrechen
                  </Button>
                  <Button colorScheme="blue" onClick={handleAddTelegramMember}>
                    Hinzufügen & Aktivieren
                  </Button>
                </HStack>
              </VStack>
            </Box>
          </Box>
        )}

        {/* Add/Edit FAQ Modal */}
        {showAddFaqModal && (
          <Box
            position="fixed"
            top="0"
            left="0"
            right="0"
            bottom="0"
            bg="blackAlpha.500"
            display="flex"
            alignItems="center"
            justifyContent="center"
            zIndex="1000"
            onClick={() => setShowAddFaqModal(false)}
          >
            <Box
              bg="white"
              p="6"
              borderRadius="xl"
              maxW="500px"
              w="full"
              mx="4"
              maxH="90vh"
              overflowY="auto"
              onClick={(e) => e.stopPropagation()}
            >
              <VStack gap="4" align="stretch">
                <Heading size="md" color="gray.800">
                  {editingFaq ? "FAQ bearbeiten" : "Neue FAQ erstellen"}
                </Heading>
                
                <Stack gap="1">
                  <Text fontSize="sm" color="gray.600" fontWeight="medium">Frage *</Text>
                  <Input
                    placeholder="z.B. Wie funktionieren die Signale?"
                    value={faqFormState.question}
                    onChange={(e) => setFaqFormState({ ...faqFormState, question: e.target.value })}
                    color="gray.800"
                  />
                </Stack>

                <Stack gap="1">
                  <Text fontSize="sm" color="gray.600" fontWeight="medium">Antwort *</Text>
                  <textarea
                    placeholder="Die Antwort, die der Bot senden soll..."
                    value={faqFormState.answer}
                    onChange={(e) => setFaqFormState({ ...faqFormState, answer: e.target.value })}
                    style={{
                      width: "100%",
                      minHeight: "100px",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      border: "1px solid #e2e8f0",
                      fontSize: "14px",
                      color: "#1a202c",
                    }}
                  />
                </Stack>

                <Stack gap="1">
                  <Text fontSize="sm" color="gray.600" fontWeight="medium">Keywords * (kommagetrennt)</Text>
                  <Input
                    placeholder="z.B. signale, signal, funktionieren, wie"
                    value={faqFormState.keywords}
                    onChange={(e) => setFaqFormState({ ...faqFormState, keywords: e.target.value })}
                    color="gray.800"
                  />
                  <Text fontSize="xs" color="gray.500">
                    Diese Wörter triggern die automatische Antwort wenn sie in einer Nachricht vorkommen.
                  </Text>
                </Stack>

                <Stack gap="1">
                  <Text fontSize="sm" color="gray.600" fontWeight="medium">Kategorie</Text>
                  <NativeSelectRoot>
                    <NativeSelectField
                      value={faqFormState.category}
                      onChange={(e) => setFaqFormState({ ...faqFormState, category: e.target.value })}
                      bg="white"
                      color="gray.800"
                    >
                      <option value="general">Allgemein</option>
                      <option value="signals">Signale</option>
                      <option value="payment">Zahlung</option>
                      <option value="subscription">Abonnement</option>
                      <option value="support">Support</option>
                    </NativeSelectField>
                  </NativeSelectRoot>
                </Stack>

                <HStack>
                  <input
                    type="checkbox"
                    id="faq-active"
                    checked={faqFormState.is_active}
                    onChange={(e) => setFaqFormState({ ...faqFormState, is_active: e.target.checked })}
                  />
                  <label htmlFor="faq-active" style={{ fontSize: "14px", color: "#4a5568" }}>
                    Aktiv (Bot antwortet auf diese FAQ)
                  </label>
                </HStack>

                <HStack justify="flex-end" gap="2" mt="2">
                  <Button variant="outline" onClick={() => {
                    setShowAddFaqModal(false);
                    setEditingFaq(null);
                  }}>
                    Abbrechen
                  </Button>
                  <Button colorScheme="blue" onClick={handleSaveFaq}>
                    {editingFaq ? "Speichern" : "Erstellen"}
                  </Button>
                </HStack>
              </VStack>
            </Box>
          </Box>
        )}
      </VStack>
    </Box>
  );
}



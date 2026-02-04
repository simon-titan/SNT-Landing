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
  Textarea,
  Spinner,
  Table,
  Badge,
} from "@chakra-ui/react";
import {
  Users,
  ChatCircle,
  Question,
  ChartBar,
  Plus,
  Trash,
  PencilSimple,
  Check,
  X,
  TelegramLogo,
  ArrowRight,
  MagnifyingGlass,
} from "@phosphor-icons/react/dist/ssr";

const TELEGRAM_BLUE = "#0088cc";

// Types
interface Member {
  id: string;
  telegram_user_id: number;
  telegram_username: string | null;
  telegram_first_name: string | null;
  outseta_email: string | null;
  subscription_status: string;
  is_in_group: boolean;
  created_at: string;
}

interface Stats {
  total_members: number;
  active_members: number;
  pending_members: number;
  cancelled_members: number;
  members_in_group: number;
  new_today: number;
  new_this_week: number;
}

interface ScheduledMessage {
  id: string;
  message_text: string;
  message_type: string;
  sender_type: string;
  scheduled_at: string;
  is_recurring: boolean;
  recurring_pattern: string | null;
  is_active: boolean;
  is_sent: boolean;
}

interface FaqEntry {
  id: string;
  trigger_keywords: string[];
  question: string;
  answer: string;
  category: string;
  is_active: boolean;
  usage_count: number;
}

// Admin Credentials (aus localStorage)
function getAdminCredentials() {
  if (typeof window === "undefined") return null;
  const username = localStorage.getItem("admin_username");
  const password = localStorage.getItem("admin_password");
  if (username && password) {
    return { username, password };
  }
  return null;
}

function setAdminCredentials(username: string, password: string) {
  localStorage.setItem("admin_username", username);
  localStorage.setItem("admin_password", password);
}

// API Helper
async function apiCall(
  endpoint: string,
  method = "GET",
  body?: any
): Promise<any> {
  const creds = getAdminCredentials();
  if (!creds) throw new Error("Nicht authentifiziert");

  const response = await fetch(endpoint, {
    method,
    headers: {
      "Content-Type": "application/json",
      "x-admin-username": creds.username,
      "x-admin-password": creds.password,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "API Fehler");
  }
  return data;
}

// Login Component
function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      setAdminCredentials(username, password);
      await apiCall("/api/admin/telegram-group/members?stats=true&limit=1");
      onLogin();
    } catch (err) {
      setError("Ungültige Zugangsdaten");
      localStorage.removeItem("admin_username");
      localStorage.removeItem("admin_password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="400px" mx="auto" mt={20} p={8} bg="white" borderRadius="xl" boxShadow="lg">
      <VStack gap={4}>
        <TelegramLogo size={48} color={TELEGRAM_BLUE} weight="fill" />
        <Heading size="lg">Admin Login</Heading>
        <Text color="gray.600">Telegram Gruppe Verwaltung</Text>

        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <VStack gap={4}>
            <Input
              placeholder="Benutzername"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Passwort"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && (
              <Text color="red.500" fontSize="sm">
                {error}
              </Text>
            )}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: TELEGRAM_BLUE,
                color: "white",
                borderRadius: "8px",
                border: "none",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Prüfe..." : "Anmelden"}
            </button>
          </VStack>
        </form>
      </VStack>
    </Box>
  );
}

// Stats Card Component
function StatsCard({
  title,
  value,
  icon,
  color = TELEGRAM_BLUE,
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color?: string;
}) {
  return (
    <Box
      bg="white"
      p={5}
      borderRadius="xl"
      boxShadow="sm"
      border="1px solid"
      borderColor="gray.200"
    >
      <HStack justify="space-between">
        <VStack align="start" gap={1}>
          <Text color="gray.500" fontSize="sm" fontWeight="medium">
            {title}
          </Text>
          <Text fontSize="2xl" fontWeight="bold" color={color}>
            {value}
          </Text>
        </VStack>
        <Box color={color} opacity={0.8}>
          {icon}
        </Box>
      </HStack>
    </Box>
  );
}

// Members Tab
function MembersTab() {
  const [members, setMembers] = useState<Member[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");

  // Add Member Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMember, setNewMember] = useState({ telegram_user_id: "", email: "" });

  const loadData = async () => {
    try {
      const data = await apiCall("/api/admin/telegram-group/members?stats=true&limit=100");
      setMembers(data.members);
      setStats(data.stats);
    } catch (err) {
      console.error("Fehler beim Laden:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddMember = async () => {
    try {
      await apiCall("/api/admin/telegram-group/members", "POST", {
        telegram_user_id: newMember.telegram_user_id,
        email: newMember.email,
        activate: true,
      });
      setShowAddModal(false);
      setNewMember({ telegram_user_id: "", email: "" });
      loadData();
    } catch (err) {
      alert("Fehler: " + (err as Error).message);
    }
  };

  const handleAction = async (telegramUserId: number, action: "activate" | "cancel") => {
    try {
      await apiCall("/api/admin/telegram-group/members", "PUT", {
        telegram_user_id: telegramUserId,
        action,
      });
      loadData();
    } catch (err) {
      alert("Fehler: " + (err as Error).message);
    }
  };

  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      !search ||
      m.telegram_username?.toLowerCase().includes(search.toLowerCase()) ||
      m.outseta_email?.toLowerCase().includes(search.toLowerCase()) ||
      m.telegram_user_id.toString().includes(search);

    const matchesFilter =
      filter === "all" ||
      (filter === "active" && m.subscription_status === "active") ||
      (filter === "pending" && m.subscription_status === "pending") ||
      (filter === "cancelled" && m.subscription_status === "cancelled") ||
      (filter === "in_group" && m.is_in_group);

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <Flex justify="center" py={10}>
        <Spinner size="lg" color={TELEGRAM_BLUE} />
      </Flex>
    );
  }

  return (
    <VStack align="stretch" gap={6}>
      {/* Stats */}
      {stats && (
        <Box
          display="grid"
          gridTemplateColumns={{ base: "1fr 1fr", md: "repeat(4, 1fr)" }}
          gap={4}
        >
          <StatsCard
            title="Gesamt"
            value={stats.total_members}
            icon={<Users size={32} />}
          />
          <StatsCard
            title="Aktiv"
            value={stats.active_members}
            icon={<Check size={32} />}
            color="green"
          />
          <StatsCard
            title="In Gruppe"
            value={stats.members_in_group}
            icon={<TelegramLogo size={32} weight="fill" />}
          />
          <StatsCard
            title="Neu diese Woche"
            value={stats.new_this_week}
            icon={<ChartBar size={32} />}
          />
        </Box>
      )}

      {/* Controls */}
      <HStack justify="space-between" flexWrap="wrap" gap={4}>
        <HStack gap={2}>
          <Box position="relative">
            <Input
              placeholder="Suchen..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              pl={10}
              w="250px"
            />
            <Box position="absolute" left={3} top="50%" transform="translateY(-50%)">
              <MagnifyingGlass size={18} color="gray" />
            </Box>
          </Box>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
            }}
          >
            <option value="all">Alle</option>
            <option value="active">Aktiv</option>
            <option value="pending">Ausstehend</option>
            <option value="cancelled">Gekündigt</option>
            <option value="in_group">In Gruppe</option>
          </select>
        </HStack>

        <button
          onClick={() => setShowAddModal(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            backgroundColor: TELEGRAM_BLUE,
            color: "white",
            borderRadius: "8px",
            border: "none",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          <Plus size={18} /> Mitglied hinzufügen
        </button>
      </HStack>

      {/* Members Table */}
      <Box bg="white" borderRadius="xl" boxShadow="sm" overflow="hidden">
        <Table.Root size="sm">
          <Table.Header>
            <Table.Row bg="gray.50">
              <Table.ColumnHeader>Telegram ID</Table.ColumnHeader>
              <Table.ColumnHeader>Username</Table.ColumnHeader>
              <Table.ColumnHeader>E-Mail</Table.ColumnHeader>
              <Table.ColumnHeader>Status</Table.ColumnHeader>
              <Table.ColumnHeader>In Gruppe</Table.ColumnHeader>
              <Table.ColumnHeader>Aktionen</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filteredMembers.map((member) => (
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
                  <HStack gap={2}>
                    {member.subscription_status !== "active" && (
                      <button
                        onClick={() => handleAction(member.telegram_user_id, "activate")}
                        style={{
                          padding: "4px 8px",
                          fontSize: "12px",
                          backgroundColor: "#22c55e",
                          color: "white",
                          borderRadius: "4px",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        Aktivieren
                      </button>
                    )}
                    {member.subscription_status === "active" && (
                      <button
                        onClick={() => handleAction(member.telegram_user_id, "cancel")}
                        style={{
                          padding: "4px 8px",
                          fontSize: "12px",
                          backgroundColor: "#ef4444",
                          color: "white",
                          borderRadius: "4px",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        Entfernen
                      </button>
                    )}
                  </HStack>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>

      {/* Add Member Modal */}
      {showAddModal && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="blackAlpha.500"
          display="flex"
          alignItems="center"
          justifyContent="center"
          zIndex={1000}
          onClick={() => setShowAddModal(false)}
        >
          <Box
            bg="white"
            p={6}
            borderRadius="xl"
            maxW="400px"
            w="full"
            mx={4}
            onClick={(e) => e.stopPropagation()}
          >
            <VStack gap={4} align="stretch">
              <Heading size="md">Mitglied hinzufügen</Heading>
              <Input
                placeholder="Telegram User ID"
                value={newMember.telegram_user_id}
                onChange={(e) =>
                  setNewMember({ ...newMember, telegram_user_id: e.target.value })
                }
              />
              <Input
                placeholder="E-Mail (optional)"
                value={newMember.email}
                onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
              />
              <HStack justify="flex-end" gap={2}>
                <button
                  onClick={() => setShowAddModal(false)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    background: "white",
                    cursor: "pointer",
                  }}
                >
                  Abbrechen
                </button>
                <button
                  onClick={handleAddMember}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "8px",
                    backgroundColor: TELEGRAM_BLUE,
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Hinzufügen & Aktivieren
                </button>
              </HStack>
            </VStack>
          </Box>
        </Box>
      )}
    </VStack>
  );
}

// Messages Tab (Simplified)
function MessagesTab() {
  const [messages, setMessages] = useState<ScheduledMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiCall("/api/admin/telegram-group/messages?include_sent=true")
      .then((data) => setMessages(data.messages))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Flex justify="center" py={10}>
        <Spinner size="lg" color={TELEGRAM_BLUE} />
      </Flex>
    );
  }

  return (
    <VStack align="stretch" gap={4}>
      <HStack justify="space-between">
        <Heading size="md">Geplante Nachrichten</Heading>
        <Text color="gray.500" fontSize="sm">
          {messages.length} Nachrichten
        </Text>
      </HStack>

      {messages.length === 0 ? (
        <Box bg="gray.50" p={8} borderRadius="xl" textAlign="center">
          <ChatCircle size={48} color="gray" />
          <Text mt={4} color="gray.500">
            Keine geplanten Nachrichten
          </Text>
        </Box>
      ) : (
        <VStack align="stretch" gap={3}>
          {messages.map((msg) => (
            <Box
              key={msg.id}
              bg="white"
              p={4}
              borderRadius="lg"
              border="1px solid"
              borderColor="gray.200"
            >
              <HStack justify="space-between" mb={2}>
                <HStack gap={2}>
                  <Badge colorPalette={msg.is_sent ? "green" : "blue"}>
                    {msg.is_sent ? "Gesendet" : "Geplant"}
                  </Badge>
                  <Badge>{msg.message_type}</Badge>
                  {msg.is_recurring && <Badge colorPalette="purple">Wiederkehrend</Badge>}
                </HStack>
                <Text fontSize="sm" color="gray.500">
                  {new Date(msg.scheduled_at).toLocaleString("de-DE")}
                </Text>
              </HStack>
              <Text fontSize="sm" lineClamp={2}>
                {msg.message_text}
              </Text>
            </Box>
          ))}
        </VStack>
      )}
    </VStack>
  );
}

// FAQ Tab (Simplified)
function FaqTab() {
  const [faqs, setFaqs] = useState<FaqEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiCall("/api/admin/telegram-group/faq?include_inactive=true")
      .then((data) => setFaqs(data.faqs))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Flex justify="center" py={10}>
        <Spinner size="lg" color={TELEGRAM_BLUE} />
      </Flex>
    );
  }

  return (
    <VStack align="stretch" gap={4}>
      <HStack justify="space-between">
        <Heading size="md">FAQ Einträge</Heading>
        <Text color="gray.500" fontSize="sm">
          {faqs.length} Einträge
        </Text>
      </HStack>

      {faqs.length === 0 ? (
        <Box bg="gray.50" p={8} borderRadius="xl" textAlign="center">
          <Question size={48} color="gray" />
          <Text mt={4} color="gray.500">
            Keine FAQ-Einträge
          </Text>
        </Box>
      ) : (
        <VStack align="stretch" gap={3}>
          {faqs.map((faq) => (
            <Box
              key={faq.id}
              bg="white"
              p={4}
              borderRadius="lg"
              border="1px solid"
              borderColor="gray.200"
              opacity={faq.is_active ? 1 : 0.6}
            >
              <HStack justify="space-between" mb={2}>
                <HStack gap={2}>
                  <Badge colorPalette={faq.is_active ? "green" : "gray"}>
                    {faq.is_active ? "Aktiv" : "Inaktiv"}
                  </Badge>
                  <Badge>{faq.category}</Badge>
                </HStack>
                <Text fontSize="sm" color="gray.500">
                  {faq.usage_count}x verwendet
                </Text>
              </HStack>
              <Text fontWeight="medium" mb={1}>
                {faq.question}
              </Text>
              <Text fontSize="sm" color="gray.600" lineClamp={2}>
                {faq.answer}
              </Text>
              <HStack mt={2} gap={1} flexWrap="wrap">
                {faq.trigger_keywords.slice(0, 5).map((kw, i) => (
                  <Badge key={i} size="sm" colorPalette="blue">
                    {kw}
                  </Badge>
                ))}
                {faq.trigger_keywords.length > 5 && (
                  <Badge size="sm">+{faq.trigger_keywords.length - 5}</Badge>
                )}
              </HStack>
            </Box>
          ))}
        </VStack>
      )}
    </VStack>
  );
}

// Main Component
export default function TelegramAdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<"members" | "messages" | "faq">("members");
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Check if already authenticated
    const creds = getAdminCredentials();
    if (creds) {
      apiCall("/api/admin/telegram-group/members?limit=1")
        .then(() => setIsAuthenticated(true))
        .catch(() => {
          localStorage.removeItem("admin_username");
          localStorage.removeItem("admin_password");
        })
        .finally(() => setChecking(false));
    } else {
      setChecking(false);
    }
  }, []);

  if (checking) {
    return (
      <Flex minH="100vh" justify="center" align="center" bg="gray.50">
        <Spinner size="xl" color={TELEGRAM_BLUE} />
      </Flex>
    );
  }

  if (!isAuthenticated) {
    return (
      <Box minH="100vh" bg="gray.50">
        <LoginForm onLogin={() => setIsAuthenticated(true)} />
      </Box>
    );
  }

  const tabs = [
    { id: "members", label: "Mitglieder", icon: <Users size={20} /> },
    { id: "messages", label: "Nachrichten", icon: <ChatCircle size={20} /> },
    { id: "faq", label: "FAQ", icon: <Question size={20} /> },
  ] as const;

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Header */}
      <Box bg="white" borderBottom="1px solid" borderColor="gray.200" py={4} px={6}>
        <Flex justify="space-between" align="center" maxW="1200px" mx="auto">
          <HStack gap={3}>
            <TelegramLogo size={32} color={TELEGRAM_BLUE} weight="fill" />
            <Heading size="lg">Telegram Admin</Heading>
          </HStack>
          <button
            onClick={() => {
              localStorage.removeItem("admin_username");
              localStorage.removeItem("admin_password");
              setIsAuthenticated(false);
            }}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              background: "white",
              cursor: "pointer",
            }}
          >
            Abmelden
          </button>
        </Flex>
      </Box>

      {/* Tabs */}
      <Box bg="white" borderBottom="1px solid" borderColor="gray.200">
        <HStack gap={0} maxW="1200px" mx="auto" px={6}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "16px 24px",
                borderBottom: activeTab === tab.id ? `3px solid ${TELEGRAM_BLUE}` : "3px solid transparent",
                color: activeTab === tab.id ? TELEGRAM_BLUE : "#6b7280",
                fontWeight: activeTab === tab.id ? "600" : "400",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </HStack>
      </Box>

      {/* Content */}
      <Box maxW="1200px" mx="auto" p={6}>
        {activeTab === "members" && <MembersTab />}
        {activeTab === "messages" && <MessagesTab />}
        {activeTab === "faq" && <FaqTab />}
      </Box>
    </Box>
  );
}

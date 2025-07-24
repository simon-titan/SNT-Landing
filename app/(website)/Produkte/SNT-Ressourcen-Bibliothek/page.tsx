"use client";

import { useState, useRef } from "react";
import {
  Button,
  Heading,
  Text,
  VStack,
  Box,
  SimpleGrid,
  Image,
  Center,
  Dialog,
  Input,
  Progress,
} from "@chakra-ui/react";
import { Section } from "@/components/layout/section";

const OUTSETA_FORM_URL = "https://seitennull---fzco.outseta.com/email/lists/nmDve29y/subscribe";

export default function RessourcenBibliothekPage() {
  const [open, setOpen] = useState(false);
  const initialRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ Email: "", FirstName: "", LastName: "", Phone: "" });
  const [errors, setErrors] = useState({ Email: "", FirstName: "", LastName: "" });

  const validate = () => {
    let valid = true;
    let newErrors = { Email: "", FirstName: "", LastName: "" };
    if (!form.Email) {
      newErrors.Email = "E-Mail ist erforderlich";
      valid = false;
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.Email)) {
      newErrors.Email = "Bitte eine gültige E-Mail eingeben";
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      const data = new FormData();
      data.append("Email", form.Email);
      data.append("FirstName", form.FirstName);
      data.append("LastName", form.LastName);
      data.append("Phone", form.Phone);
      // Honeypot field
      data.append("o_4hdIGkTKEx6mp7JByZr38wDq_PA0zZxcQ", "");
      const res = await fetch(OUTSETA_FORM_URL, {
        method: "POST",
        body: data,
      });
      if (res.ok) {
        window.location.href = "/Produkte/SNT-Ressourcen-Bibliothek/thank-you-2";
      } else {
        alert("Fehler beim Absenden.");
      }
    } catch (err) {
      alert("Fehler beim Absenden.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Section header>
        <VStack gap={{ base: 8, md: 12 }}>
          <VStack gap={3} textAlign="center">
            <Heading as="h1" textStyle={{ base: "4xl", md: "5xl" }}>
              SNTTRADES Free Kurs & Resourcen Bibliothek
            </Heading>
            <Text color="fg.muted" fontSize={{ base: "lg", md: "xl" }}>
              Dein kompletter Trading-Startplatz – kompakt, klar, sofort nutzbar 🚀
            </Text>
          </VStack>

          <VStack gap={6} align="stretch">
            <Box bg="white" borderRadius="xl" boxShadow="md" p={{ base: 5, md: 8 }} maxW="xl" mx="auto">
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={6} alignItems="center">
                <Box>
                  <Heading as="h2" size="lg" mb={2}>
                    📚 1. Kostenloser Trading-Kurs – Von den Grundlagen bis zur Umsetzung
                  </Heading>
                  <Text fontWeight="bold" mb={2}>
                    Unsere Ressourcen-Bibliothek enthält eine <b>komplett kostenlsoe Trading-Ausbildung</b>, mit der du strukturiert und praxisnah lernen kannst – perfekt für Einsteiger
                  </Text>
                  <Text mb={1}>Was dich erwartet:</Text>
                  <VStack align="start" gap={1} fontSize="md">
                    <Text>• Schritt-für-Schritt-Erklärungen zu Marktstruktur, Ein- und Ausstiegen</Text>
                    <Text>• Kein Fachchinesisch – verständlich, direkt, anwendbar</Text>
                    <Text>• Lerne in deinem eigenen Tempo – jederzeit abrufbar</Text>
                  </VStack>
                </Box>
                <Center>
                  <Image src="https://placehold.co/120x120?text=Kurs" alt="Kurs Icon" boxSize="120px" borderRadius="full" />
                </Center>
              </SimpleGrid>
            </Box>

            <Box bg="white" borderRadius="xl" boxShadow="md" p={{ base: 5, md: 8 }} maxW="xl" mx="auto">
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={6} alignItems="center">
                <Box>
                  <Heading as="h2" size="lg" mb={2}>
                    🛠️ 2. Zugang zu unseren Tools & Trading-Software
                  </Heading>
                  <Text fontWeight="bold" mb={2}>
                    Lerne die Tools kennen, mit denen wir täglich arbeiten – dieselben, die wir in unserer Hauptausbildung verwenden und in der Community empfehlen.
                  </Text>
                  <Text mb={1}>Inklusive:</Text>
                  <VStack align="start" gap={1} fontSize="md">
                    <Text>• Übersicht & Erklärung zu den wichtigsten Trading-Tools</Text>
                    <Text>• Zugang zu exklusiven Trackern & Setups (z. B. Trade-Journal, Setup-Vorlagen)</Text>
                    <Text>• Vorstellung unserer Indikatoren & wie du sie direkt nutzen kannst</Text>
                    <Text>• Empfehlungen zu Plattformen, Brokern & Trading-Technik</Text>
                  </VStack>
                </Box>
                <Center>
                  <Image src="https://placehold.co/120x120?text=Tools" alt="Tools Icon" boxSize="120px" borderRadius="full" />
                </Center>
              </SimpleGrid>
            </Box>

            <Box bg="white" borderRadius="xl" boxShadow="md" p={{ base: 5, md: 8 }} maxW="xl" mx="auto">
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={6} alignItems="center">
                <Box>
                  <Heading as="h2" size="lg" mb={2}>
                    📱 3. Einblick in unsere Social-Media-Strategie & Community
                  </Heading>
                  <Text fontWeight="bold" mb={2}>
                    Wir zeigen dir transparent, wie wir auf Social Media auftreten, unsere Community aufgebaut haben und täglich Trader begleiten.
                  </Text>
                  <Text mb={1}>Darin enthalten:</Text>
                  <VStack align="start" gap={1} fontSize="md">
                    <Text>• Überblick über unsere Kanäle: Instagram, Telegram, Discord & Co.</Text>
                    <Text>• Wie du Teil unserer Community wirst</Text>
                  </VStack>
                </Box>
                <Center>
                  <Image src="https://placehold.co/120x120?text=Community" alt="Community Icon" boxSize="120px" borderRadius="full" />
                </Center>
              </SimpleGrid>
            </Box>
          </VStack>

          {/* Button und Dialog jetzt ganz unten */}
          <Center>
            <Dialog.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
              <Dialog.Trigger asChild>
                <Button colorScheme="blue" size="lg">
                  Jetzt Ressourcen-Bibliothek kostenlos sichern
                </Button>
              </Dialog.Trigger>
              <Dialog.Backdrop />
              <Dialog.Positioner>
                <Dialog.Content borderRadius="2xl" p={{ base: 2, md: 4 }} maxW="lg" position="relative">
                  {/* Schließen-Button oben rechts */}
                  <Box position="absolute" top={3} right={3} zIndex={1}>
                    <Dialog.CloseTrigger asChild>
                      <Button size="sm">Schließen</Button>
                    </Dialog.CloseTrigger>
                  </Box>
                  <Dialog.Header textAlign="center" fontSize="2xl" fontWeight="bold" pb={0}>
                    <Dialog.Title>Letzter Schritt...</Dialog.Title>
                  </Dialog.Header>
                  {/* Progressbar jetzt unter der Überschrift */}
                  <Progress.Root value={80} max={100} size="md" mb={4}>
                    <Progress.Track bg="gray.200" borderRadius="full">
                      <Progress.Range bg="blue.400" borderRadius="full" />
                    </Progress.Track>
                  </Progress.Root>
                  <Dialog.Body>
                    <VStack gap={2} mb={4}>
                      <Text fontSize="md" color="gray.500" textAlign="center">
                        *Wir werden deine Daten niemals weitergeben, vermieten oder verkaufen...*
                      </Text>
                    </VStack>
                    <form onSubmit={handleSubmit}>
                      <VStack gap={4}>
                        <div style={{ width: '100%' }}>
                          <label style={{ fontWeight: 600, display: 'block', marginBottom: 4 }}>Name</label>
                          <Input
                            ref={initialRef}
                            name="FirstName"
                            placeholder="Dein Name..."
                            value={form.FirstName}
                            onChange={handleChange}
                          />
                          {errors.FirstName && (
                            <Text color="red.500" fontSize="sm" mt={1}>{errors.FirstName}</Text>
                          )}
                        </div>
                        <div style={{ width: '100%' }}>
                          <label style={{ fontWeight: 600, display: 'block', marginBottom: 4 }}>E-Mail *</label>
                          <Input
                            name="Email"
                            type="email"
                            placeholder="Deine E-Mail..."
                            value={form.Email}
                            onChange={handleChange}
                          />
                          {errors.Email && (
                            <Text color="red.500" fontSize="sm" mt={1}>{errors.Email}</Text>
                          )}
                        </div>
                        <div style={{ width: '100%' }}>
                          <label style={{ fontWeight: 600, display: 'block', marginBottom: 4 }}>Telefon</label>
                          <Input
                            name="Phone"
                            placeholder="Deine Telefonnummer..."
                            value={form.Phone}
                            onChange={handleChange}
                          />
                        </div>
                        <Button
                          colorScheme="blue"
                          size="lg"
                          width="100%"
                          type="submit"
                        >
                          Zugang zur Ressourcen-Bibliothek sichern 📈
                        </Button>
                      </VStack>
                    </form>
                    <Text fontSize="xs" color="gray.400" mt={4} textAlign="center">
                      Mit dem Absenden erklärst du dich einverstanden, regelmäßig Updates und Informationen per SMS oder E-Mail zu erhalten.
                    </Text>
                  </Dialog.Body>
                </Dialog.Content>
              </Dialog.Positioner>
            </Dialog.Root>
          </Center>
        </VStack>
      </Section>
    </>
  );
}

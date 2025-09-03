"use client";

import {
  Box,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Icon,
  Container,
} from "@chakra-ui/react";
import { Section } from "@/components/layout/section";
import { Support } from "@/components/auth/embed";
import {
  Question,
  Ticket,
  EnvelopeSimple,
  ChatCircle,
  BookOpen,
  VideoCamera,
  Users,
  CreditCard,
  Shield,
  Lifebuoy,
} from "@phosphor-icons/react/dist/ssr";
import "@/styles/contact-page-styles.css";
import { useRef } from "react";

// Lokale CSS-Regel um o--submit-help-request zu verstecken
const hideSubmitButton = `
  .o--submit-help-request {
    display: none !important;
  }
`;

// FAQ-Daten
const faqData = [
  {
    question: "Wie funktioniert das SNTTRADES Mentorship?",
    answer: "Das Mentorship funktioniert durch unsere Strategie Videos, die Community zum Austausch der Erfahrungen sowie den Live-Sessions zur Problembesprechung und Weiterentwicklung."
  },
  {
    question: "Welche Voraussetzungen brauche ich?",
    answer: "Grundlegende Computerkenntnisse und ein Interesse am Trading sind ausreichend. Vorkenntnisse im Trading sind nicht erforderlich - wir beginnen bei den Grundlagen."
  },

  {
    question: "Ich habe keine Zugangsdaten erhalten?",
    answer: "Bei Beginn der Registrierung erhalten Sie eine E-Mail, in der Sie Ihr Passwort festlegen müssen. Falls Sie diese E-Mail nicht erhalten haben, öffnen Sie bitte ein Support-Ticket."
  },
  {
    question: "Wie kann ich mit anderen Teilnehmern in Kontakt treten?",
    answer: "Alle Teilnehmer haben Zugang zu unserer exklusiven Community, wo Sie sich mit anderen Tradern austauschen, Fragen stellen und von den Erfahrungen anderer profitieren können."
  },
  {
    question: "Welche Trading-Plattformen werden unterstützt?",
    answer: "Wir unterstützen alle gängigen Trading-Plattformen wie MetaTrader, TradingView, cTrader und andere. Unsere Strategien sind plattformunabhängig."
  }
];

// Hilfe-Kategorien
const helpCategories = [
  {
    title: "Ausbildung & Kurse",
    description: "Fragen zu unseren Trading-Kursen und Ausbildungsprogrammen",
    icon: BookOpen,
    color: "blue",
    link: "#ausbildung"
  },
  {
    title: "Technischer Support",
    description: "Hilfe bei technischen Problemen und Plattform-Fragen",
    icon: VideoCamera,
    color: "green",
    link: "#technisch"
  },
  {
    title: "Community & Networking",
    description: "Fragen zur Community und zum Austausch mit anderen",
    icon: Users,
    color: "purple",
    link: "#community"
  },
  {
    title: "Zahlung & Abrechnung",
    description: "Fragen zu Zahlungen, Rechnungen und Abonnements",
    icon: CreditCard,
    color: "orange",
    link: "#zahlung"
  },
  {
    title: "Sicherheit & Datenschutz",
    description: "Informationen zu Sicherheit und Datenschutz",
    icon: Shield,
    color: "red",
    link: "#sicherheit"
  }
];

// Ticket-Kategorien
const ticketCategories = [
  "Technisches Problem",
  "Kursinhalt",
  "Community-Zugang",
  "Zahlungsproblem",
  "Allgemeine Frage",
  "Feedback",
  "Sonstiges"
];

export default function SupportPage() {
  const ticketSectionRef = useRef<HTMLDivElement>(null);

  const scrollToTicket = () => {
    ticketSectionRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  return (
    <>
      <style jsx>{hideSubmitButton}</style>
                   <Section
        header
        bg="linear-gradient(135deg, rgba(0, 0, 0, 0.98), rgba(10, 14, 10, 0.95))"
        borderBottomColor="rgba(34, 197, 94, 0.25)"
        borderBottomWidth="1px"
        position="relative"
        _before={{
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "radial-gradient(at 50% 0%, rgba(34, 197, 94, 0.15) 0px, transparent 50%), radial-gradient(at 0% 100%, rgba(16, 185, 129, 0.1) 0px, transparent 50%)",
          pointerEvents: "none"
        }}
      >
        <VStack gap={{ base: "6", md: "8" }} textAlign="center" position="relative" zIndex={1}>
          <VStack gap={{ base: "5", md: "6" }}>
            <VStack gap={{ base: "3", md: "4" }}>
              <Box display="flex" alignItems="center" justifyContent="center" gap="3">
                <Box
                  p={3}
                  borderRadius="full"
                  bg="rgba(34, 197, 94, 0.15)"
                  border="1px solid rgba(34, 197, 94, 0.3)"
                  boxShadow="0 4px 12px rgba(34, 197, 94, 0.2)"
                >
                  <Icon as={Lifebuoy} boxSize={8} color="#22c55e" />
                </Box>
                <Heading 
                  as="h1" 
                  textStyle={{ base: "4xl", md: "5xl" }}
                  color="white"
                  textShadow="0 2px 4px rgba(0,0,0,0.3)"
                >
                  Hilfe & Support
                </Heading>
              </Box>
            </VStack>
            <Text
              color="gray.200"
              textStyle={{ base: "lg", md: "xl" }}
              maxW="2xl"
              lineHeight="1.6"
            >
              Finden Sie schnell Antworten auf Ihre Fragen oder erstellen Sie ein Support-Ticket für spezifische Probleme. Wir sind hier, um Ihnen zu helfen!
            </Text>
          </VStack>
        </VStack>
      </Section>

            {/* Hilfe-Kategorien */}
      <Section
        bg="linear-gradient(135deg, rgba(10, 14, 10, 0.98), rgba(0, 0, 0, 0.95))"
        position="relative"
        _before={{
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "radial-gradient(at 30% 70%, rgba(34, 197, 94, 0.1) 0px, transparent 50%), radial-gradient(at 70% 30%, rgba(16, 185, 129, 0.08) 0px, transparent 50%)",
          pointerEvents: "none"
        }}
      >
        <Container maxW="7xl" position="relative" zIndex={1}>
          <VStack gap="8">
            <Heading 
              as="h2" 
              textStyle="2xl" 
              textAlign="center"
              color="white"
              textShadow="0 2px 4px rgba(0,0,0,0.3)"
            >
              Wie können wir Ihnen helfen?
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap="6" w="full">
              {helpCategories.map((category, index) => (
                <Box 
                  key={index} 
                  p="6" 
                  bg="rgba(10, 14, 10, 0.7)"
                  backdropFilter="blur(16px)"
                  border="1px solid rgba(34, 197, 94, 0.25)" 
                  borderRadius="xl"
                  cursor="pointer" 
                  _hover={{ 
                    transform: "translateY(-4px)", 
                    boxShadow: "0 12px 40px 0 rgba(34, 197, 94, 0.25)",
                    borderColor: "rgba(34, 197, 94, 0.4)"
                  }} 
                  transition="all 0.3s ease"
                  onClick={scrollToTicket}
                >
                  <VStack gap="4" textAlign="center">
                    <Box
                      p="3"
                      borderRadius="full"
                      bg="rgba(34, 197, 94, 0.15)"
                      border="1px solid rgba(34, 197, 94, 0.3)"
                      boxShadow="0 4px 12px rgba(34, 197, 94, 0.2)"
                    >
                      <Icon as={category.icon} boxSize={6} color="#22c55e" />
                    </Box>
                    <VStack gap="2">
                      <Heading as="h3" textStyle="lg" color="white">
                        {category.title}
                      </Heading>
                      <Text color="gray.200" fontSize="sm" lineHeight="1.5">
                        {category.description}
                      </Text>
                    </VStack>
                  </VStack>
                </Box>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Section>

            {/* FAQ-Bereich */}
      <Section 
        bg="linear-gradient(135deg, rgba(0, 0, 0, 0.95), rgba(10, 14, 10, 0.98))"
        position="relative"
        _before={{
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "radial-gradient(at 20% 80%, rgba(34, 197, 94, 0.08) 0px, transparent 50%), radial-gradient(at 80% 20%, rgba(16, 185, 129, 0.06) 0px, transparent 50%)",
          pointerEvents: "none"
        }}
      >
        <Container maxW="4xl" position="relative" zIndex={1}>
          <VStack gap="8">
            <VStack gap="4" textAlign="center">
              <Box
                p={3}
                borderRadius="full"
                bg="rgba(34, 197, 94, 0.15)"
                border="1px solid rgba(34, 197, 94, 0.3)"
                boxShadow="0 4px 12px rgba(34, 197, 94, 0.2)"
              >
                <Icon as={Question} boxSize={8} color="#22c55e" />
              </Box>
              <Heading 
                as="h2" 
                textStyle="2xl"
                color="white"
                textShadow="0 2px 4px rgba(0,0,0,0.3)"
              >
                Häufig gestellte Fragen
              </Heading>
              <Text color="gray.200" maxW="2xl" lineHeight="1.6">
                Finden Sie schnell Antworten auf die häufigsten Fragen unserer Teilnehmer
              </Text>
            </VStack>
            
            <VStack gap="4" w="full">
              {faqData.map((faq, index) => (
                <Box 
                  key={index} 
                  w="full" 
                  bg="rgba(10, 14, 10, 0.7)"
                  backdropFilter="blur(16px)"
                  border="1px solid rgba(34, 197, 94, 0.25)" 
                  borderRadius="xl" 
                  p="6"
                  _hover={{
                    borderColor: "rgba(34, 197, 94, 0.4)",
                    boxShadow: "0 8px 32px 0 rgba(34, 197, 94, 0.15)"
                  }}
                  transition="all 0.3s ease"
                >
                  <VStack gap="3" align="stretch">
                    <Heading as="h3" textStyle="lg" color="#22c55e">
                      {faq.question}
                    </Heading>
                    <Text color="gray.200" fontSize="md" lineHeight="1.6">
                      {faq.answer}
                    </Text>
                    {faq.question === "Ich habe keine Zugangsdaten erhalten?" && (
                      <Box textAlign="center" pt="2">
                        <Box
                          as="button"
                          px="4"
                          py="2"
                          bg="#22c55e"
                          color="white"
                          borderRadius="md"
                          fontSize="sm"
                          fontWeight="medium"
                          cursor="pointer"
                          _hover={{ bg: "#16a34a" }}
                          transition="background-color 0.2s"
                          onClick={scrollToTicket}
                          boxShadow="0 4px 12px rgba(34, 197, 94, 0.3)"
                        >
                          Ticket öffnen
                        </Box>
                      </Box>
                    )}
                  </VStack>
                </Box>
              ))}
            </VStack>
          </VStack>
        </Container>
      </Section>

      {/* Ticket-System */}
      <Section
        bg="linear-gradient(135deg, rgba(10, 14, 10, 0.95), rgba(0, 0, 0, 0.98))"
        position="relative"
        _before={{
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "radial-gradient(at 50% 50%, rgba(34, 197, 94, 0.1) 0px, transparent 60%)",
          pointerEvents: "none"
        }}
      >
        <Container maxW="4xl" position="relative" zIndex={1}>
          <VStack gap="8" ref={ticketSectionRef}>
            <VStack gap="4" textAlign="center">
              <Box
                p={3}
                borderRadius="full"
                bg="rgba(34, 197, 94, 0.15)"
                border="1px solid rgba(34, 197, 94, 0.3)"
                boxShadow="0 4px 12px rgba(34, 197, 94, 0.2)"
              >
                <Icon as={Ticket} boxSize={8} color="#22c55e" />
              </Box>
              <Heading 
                as="h2" 
                textStyle="2xl"
                color="white"
                textShadow="0 2px 4px rgba(0,0,0,0.3)"
              >
                Support-Ticket erstellen
              </Heading>
              <Text color="gray.200" maxW="2xl" lineHeight="1.6">
                Können Sie Ihre Frage nicht in den FAQs finden? Erstellen Sie ein Support-Ticket und wir antworten Ihnen innerhalb von 48 Stunden.
              </Text>
            </VStack>

            <Box 
              bg="rgba(10, 14, 10, 0.8)"
              backdropFilter="blur(20px)"
              border="1px solid rgba(34, 197, 94, 0.3)" 
              borderRadius="xl" 
              p="8" 
              w="full"
              boxShadow="0 20px 60px 0 rgba(34, 197, 94, 0.2)"
            >
              <Support />
            </Box>
          </VStack>
        </Container>
      </Section>

            {/* Alternative Kontaktmöglichkeiten */}
      <Section 
        bg="linear-gradient(135deg, rgba(0, 0, 0, 0.98), rgba(10, 14, 10, 0.95))"
        position="relative"
        _before={{
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "radial-gradient(at 80% 20%, rgba(34, 197, 94, 0.08) 0px, transparent 50%), radial-gradient(at 20% 80%, rgba(16, 185, 129, 0.06) 0px, transparent 50%)",
          pointerEvents: "none"
        }}
      >
        <Container maxW="6xl" position="relative" zIndex={1}>
          <VStack gap="8">
            <VStack gap="4" textAlign="center">
              <Heading 
                as="h2" 
                textStyle="2xl"
                color="white"
                textShadow="0 2px 4px rgba(0,0,0,0.3)"
              >
                Weitere Kontaktmöglichkeiten
              </Heading>
              <Text color="gray.200" maxW="2xl" lineHeight="1.6">
                Verschiedene Wege, um mit uns in Kontakt zu treten
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 2 }} gap="6" w="full">
              <Box 
                bg="rgba(10, 14, 10, 0.7)"
                backdropFilter="blur(16px)"
                border="1px solid rgba(34, 197, 94, 0.25)" 
                borderRadius="xl" 
                p="6" 
                textAlign="center"
                _hover={{
                  transform: "translateY(-4px)",
                  boxShadow: "0 12px 40px 0 rgba(34, 197, 94, 0.25)",
                  borderColor: "rgba(34, 197, 94, 0.4)"
                }}
                transition="all 0.3s ease"
              >
                <VStack gap="4">
                  <Box
                    p={3}
                    borderRadius="full"
                    bg="rgba(34, 197, 94, 0.15)"
                    border="1px solid rgba(34, 197, 94, 0.3)"
                    boxShadow="0 4px 12px rgba(34, 197, 94, 0.2)"
                  >
                    <Icon as={EnvelopeSimple} boxSize={8} color="#22c55e" />
                  </Box>
                  <VStack gap="2">
                    <Heading as="h3" textStyle="lg" color="white">E-Mail Support</Heading>
                    <Text color="#22c55e" fontSize="sm" fontWeight="medium">
                      seitennulltrades@gmail.com
                    </Text>
                    <Text color="gray.300" fontSize="sm">
                      Antwort innerhalb von 48 Stunden
                    </Text>
                  </VStack>
                </VStack>
              </Box>

              <Box 
                bg="rgba(10, 14, 10, 0.7)"
                backdropFilter="blur(16px)"
                border="1px solid rgba(34, 197, 94, 0.25)" 
                borderRadius="xl" 
                p="6" 
                textAlign="center"
                _hover={{
                  transform: "translateY(-4px)",
                  boxShadow: "0 12px 40px 0 rgba(34, 197, 94, 0.25)",
                  borderColor: "rgba(34, 197, 94, 0.4)"
                }}
                transition="all 0.3s ease"
              >
                <VStack gap="4">
                  <Box
                    p={3}
                    borderRadius="full"
                    bg="rgba(34, 197, 94, 0.15)"
                    border="1px solid rgba(34, 197, 94, 0.3)"
                    boxShadow="0 4px 12px rgba(34, 197, 94, 0.2)"
                  >
                    <Icon as={Users} boxSize={8} color="#22c55e" />
                  </Box>
                  <VStack gap="2">
                    <Heading as="h3" textStyle="lg" color="white">Community</Heading>
                    <Text color="gray.200" fontSize="sm">
                      Tauschen Sie sich mit anderen aus
                    </Text>
                    <Text color="gray.300" fontSize="sm">
                      Direkter Zugang für alle Mitglieder
                    </Text>
                  </VStack>
                </VStack>
              </Box>
            </SimpleGrid>
          </VStack>
        </Container>
      </Section>

     
    </>
  );
}



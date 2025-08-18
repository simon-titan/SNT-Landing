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
         bg="bg.muted"
         borderBottomColor="border"
         borderBottomWidth="1px"
       >
        <VStack gap={{ base: "6", md: "8" }} textAlign="center">
          <VStack gap={{ base: "5", md: "6" }}>
            <VStack gap={{ base: "3", md: "4" }}>
              <Box display="flex" alignItems="center" justifyContent="center" gap="3">
                <Icon as={Lifebuoy} boxSize={8} color="blue.500" />
                <Heading as="h1" textStyle={{ base: "4xl", md: "5xl" }}>
                  Hilfe & Support
                </Heading>
              </Box>
            </VStack>
            <Text
              color="fg.muted"
              textStyle={{ base: "lg", md: "xl" }}
              maxW="2xl"
            >
              Finden Sie schnell Antworten auf Ihre Fragen oder erstellen Sie ein Support-Ticket für spezifische Probleme. Wir sind hier, um Ihnen zu helfen!
            </Text>
          </VStack>
        </VStack>
      </Section>

      {/* Hilfe-Kategorien */}
      <Section>
        <Container maxW="7xl">
          <VStack gap="8">
            <Heading as="h2" textStyle="2xl" textAlign="center">
              Wie können wir Ihnen helfen?
            </Heading>
                         <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap="6" w="full">
               {helpCategories.map((category, index) => (
                 <Box 
                   key={index} 
                   p="6" 
                   border="1px solid" 
                   borderColor="gray.200" 
                   borderRadius="lg"
                   cursor="pointer" 
                   _hover={{ transform: "translateY(-2px)", shadow: "lg" }} 
                   transition="all 0.2s"
                   bg="white"
                   onClick={scrollToTicket}
                 >
                  <VStack gap="4" textAlign="center">
                    <Box
                      p="3"
                      borderRadius="full"
                      bg={`${category.color}.100`}
                      color={`${category.color}.600`}
                    >
                      <Icon as={category.icon} boxSize={6} />
                    </Box>
                    <VStack gap="2">
                      <Heading as="h3" textStyle="lg">
                        {category.title}
                      </Heading>
                      <Text color="fg.muted" fontSize="sm">
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
      <Section bg="bg.subtle">
        <Container maxW="4xl">
          <VStack gap="8">
            <VStack gap="4" textAlign="center">
              <Icon as={Question} boxSize={8} color="blue.500" />
              <Heading as="h2" textStyle="2xl">
                Häufig gestellte Fragen
              </Heading>
              <Text color="fg.muted" maxW="2xl">
                Finden Sie schnell Antworten auf die häufigsten Fragen unserer Teilnehmer
              </Text>
            </VStack>
            
                         <VStack gap="4" w="full">
               {faqData.map((faq, index) => (
                 <Box 
                   key={index} 
                   w="full" 
                   border="1px solid" 
                   borderColor="gray.200" 
                   borderRadius="lg" 
                   p="6"
                   bg="white"
                 >
                   <VStack gap="3" align="stretch">
                     <Heading as="h3" textStyle="lg" color="gray.800">
                       {faq.question}
                     </Heading>
                     <Text color="gray.600" fontSize="md">
                       {faq.answer}
                     </Text>
                     {faq.question === "Ich habe keine Zugangsdaten erhalten?" && (
                       <Box textAlign="center" pt="2">
                         <Box
                           as="button"
                           px="4"
                           py="2"
                           bg="blue.500"
                           color="white"
                           borderRadius="md"
                           fontSize="sm"
                           fontWeight="medium"
                           cursor="pointer"
                           _hover={{ bg: "blue.600" }}
                           transition="background-color 0.2s"
                           onClick={scrollToTicket}
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
      <Section>
        <Container maxW="4xl">
          <VStack gap="8" ref={ticketSectionRef}>
            <VStack gap="4" textAlign="center">
              <Icon as={Ticket} boxSize={8} color="green.500" />
              <Heading as="h2" textStyle="2xl">
                Support-Ticket erstellen
              </Heading>
              <Text color="fg.muted" maxW="2xl">
                Können Sie Ihre Frage nicht in den FAQs finden? Erstellen Sie ein Support-Ticket und wir antworten Ihnen innerhalb von 48 Stunden.
              </Text>
            </VStack>

            <Box 
              border="1px solid" 
              borderColor="gray.200" 
              borderRadius="lg" 
              p="8" 
              w="full"
              bg="white"
            >
              <Support />
            </Box>
          </VStack>
        </Container>
      </Section>

      {/* Alternative Kontaktmöglichkeiten */}
      <Section bg="bg.subtle">
        <Container maxW="6xl">
          <VStack gap="8">
            <VStack gap="4" textAlign="center">
              <Heading as="h2" textStyle="2xl">
                Weitere Kontaktmöglichkeiten
              </Heading>
              <Text color="fg.muted" maxW="2xl">
                Verschiedene Wege, um mit uns in Kontakt zu treten
              </Text>
            </VStack>

                         <SimpleGrid columns={{ base: 1, md: 2 }} gap="6" w="full">
               <Box 
                 border="1px solid" 
                 borderColor="gray.200" 
                 borderRadius="lg" 
                 p="6" 
                 textAlign="center"
                 bg="white"
               >
                 <VStack gap="4">
                   <Icon as={EnvelopeSimple} boxSize={8} color="blue.500" />
                   <VStack gap="2">
                     <Heading as="h3" textStyle="lg">E-Mail Support</Heading>
                     <Text color="fg.muted" fontSize="sm">
                     seitennulltrades@gmail.com
                     </Text>
                     <Text color="fg.muted" fontSize="sm">
                       Antwort innerhalb von 48 Stunden
                     </Text>
                   </VStack>
                 </VStack>
               </Box>

               <Box 
                 border="1px solid" 
                 borderColor="gray.200" 
                 borderRadius="lg" 
                 p="6" 
                 textAlign="center"
                 bg="white"
               >
                 <VStack gap="4">
                   <Icon as={Users} boxSize={8} color="purple.500" />
                   <VStack gap="2">
                     <Heading as="h3" textStyle="lg">Community</Heading>
                     <Text color="fg.muted" fontSize="sm">
                       Tauschen Sie sich mit anderen aus
                     </Text>
                     <Text color="fg.muted" fontSize="sm">
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



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
  Stack,
} from "@chakra-ui/react";
import { Section } from "@/components/layout/section";
import { CheckCircle, WarningCircle } from "@phosphor-icons/react/dist/ssr";

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
      data.append("o_4hdIGkTKEx6mp7JByZr38wDq_PA0zZxcQ", "");
      const res = await fetch(OUTSETA_FORM_URL, {
        method: "POST",
        body: data,
      });
      if (res.ok) {
        window.location.href = "/thank-you";
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
      {/* Video Background Hero Section - im Stil der anderen Pages */}
      <Section
        header
        size="lg"
        bg="bg.subtle"
        borderBottom="1px solid"
        borderColor="border"
        w="100vw"
        mx="unset"
        pb={{ base: "0px", md: "80px" }}
        position="relative"
        overflow="hidden"
      >
        {/* Video Background */}
        <Box
          position="absolute"
          top="60%"
          left="50%"
          width="100vw"
          height={{ base: "50vh", md: "100vh" }}
          transform="translate(-50%, -50%)"
          zIndex={0}
          overflow="hidden"
        >
          <video
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            autoPlay
            muted
            loop
            playsInline
          >
            <source src="/assets/0716.mp4" type="video/mp4" />
          </video>
        </Box>

        {/* Content - wie bei anderen Pages */}
        <VStack gap="4" maxW="900px" mx="auto" position="relative" zIndex={1}>
          <Stack gap="2" textAlign="center" mx="auto">
            {/* SNTTRADES Trading Academy Badge - wie bei anderen Pages */}
            <Box 
              display="flex" 
              alignItems="center" 
              justifyContent="center" 
              gap="2" 
              mx="auto"
              mb="1"
            >
              <CheckCircle size={20} color="#1E88E5" weight="fill" />
                             <Heading
                 as="h1"
                 fontSize={{ base: "md", md: "2xl" }}
                 fontWeight="700"
                 lineHeight="0.9"
                 color="white"
                 textShadow="1px 1px 2px rgba(0,0,0,0.8)"
               >
                 SNTTRADES™
               </Heading>
            </Box>
            
            <Heading
              as="h1"
              textStyle={{ base: "2xl", md: "5xl" }}
              mx="auto"
              color="white"
              lineHeight="tighter"
              fontWeight="semibold"
              maxW="800px"
              textShadow="2px 2px 4px rgba(0,0,0,0.8)"
            >
              DEIN KOMPLETTER{' '}
              <Box as="span" 
                background="linear-gradient(90deg,rgb(92, 154, 246), transparent 95%)" 
                color="white" 
                px={2} 
                py={1} 
                borderRadius="md" 
                fontWeight="semibold" 
                display="inline-block"
              >
                TRADING-STARTPLATZ
              </Box>
            </Heading>
            
            <Text color="white" textStyle="sm" mx="auto" maxW="700px" textShadow="1px 1px 2px rgba(0,0,0,0.8)">
              Dein kompletter Trading-Startplatz – kompakt, klar, sofort nutzbar 🚀
            </Text>
          </Stack>
          
          <Stack align="center" direction={{ base: "column", md: "row" }} gap="3">
            <Button 
              size="xl" 
              fontWeight="bold" 
              colorScheme="blue" 
              bg="#1E88E5" 
              _hover={{ bg: "#1565C0" }} 
              borderRadius="md" 
              px="8"
              onClick={() => setOpen(true)}
            >
              ⚡ JETZT KOSTENLOS SICHERN
            </Button>
          </Stack>
          
                     <VStack gap="1" align="center" justify="center" mt={0}>
             <Text fontSize="xs" color="white" textAlign="center" textShadow="1px 1px 2px rgba(0,0,0,0.8)">
               100% kostenlos
             </Text>
             <Text fontSize="xs" color="white" textAlign="center" textShadow="1px 1px 2px rgba(0,0,0,0.8)">
               Keine versteckten Kosten
             </Text>
             <Text fontSize="xs" color="white" textAlign="center" textShadow="1px 1px 2px rgba(0,0,0,0.8)">
               Sofortiger Zugang
             </Text>
           </VStack>
        </VStack>
      </Section>

             {/* Transition Section mit Überschrift */}
       <Section size="md" bg="white" py={{ base: 4, md: 8 }}>
         <VStack gap="0" textAlign="center" maxW="4xl" mx="auto">
           <Heading 
             as="h2" 
             textStyle={{ base: "3xl", md: "4xl" }} 
             color="gray.900"
             lineHeight="tight"
             mb="1"
           >
             Was dich in der{' '}
             <Box as="span" 
               background="linear-gradient(90deg,rgb(246, 236, 92), transparent 95%)" 
               color="black" 
               px={2} 
               py={1} 
               borderRadius="md" 
               fontWeight="bold" 
               display="inline-block"
             >
               Ressourcen-Bibliothek
             </Box>{' '}
             erwartet
           </Heading>
           
           {/* Pfeil nach unten */}
           <Box 
             fontSize="xl" 
             color="#1E88E5"
             mt="0"
             animation="bounce 2s infinite"
           >
             ⬇️
           </Box>
         </VStack>

       {/* Content Boxes für die drei Ressourcen */}
         <VStack gap={8} align="stretch" maxW="4xl" mx="auto" mt={{ base: "8", md: "16" }}>
            <VStack gap={8} align="stretch">
              {/* Card 1 - Trading Kurs (Blau) */}
              <Box 
                bg="white" 
                borderRadius="2xl" 
                boxShadow="lg" 
                overflow="hidden"
                border="1px solid"
                borderColor="blue.100"
                _hover={{ 
                  transform: "translateY(-4px)",
                  boxShadow: "2xl",
                  borderColor: "blue.200"
                }}
                transition="all 0.3s ease"
              >
                {/* Header mit Gradient */}
                <Box 
                  bg="linear-gradient(135deg, #1E88E5, #60A5FA)"
                  p={{ base: 4, md: 6 }}
                  color="white"
                >
                  <Box display="flex" alignItems="center" gap="3">
                    <Box 
                      bg="rgba(255, 255, 255, 0.2)" 
                      borderRadius="lg" 
                      p="3"
                      backdropFilter="blur(10px)"
                    >
                      <Text fontSize="2xl">📚</Text>
                    </Box>
                    <Box>
                      <Text fontSize="lg" fontWeight="bold" mb="1">
                        Kostenloser Trading-Kurs
                      </Text>
                      <Text fontSize="sm" opacity="0.9">
                        Von den Grundlagen bis zur Umsetzung
                      </Text>
                    </Box>
                  </Box>
                </Box>
                
                {/* Content */}
                <Box p={{ base: 4, md: 6 }}>
                  <Text fontWeight="semibold" mb={4} color="gray.700" fontSize="md">
                    Unsere Ressourcen-Bibliothek enthält eine{' '}
                    <Text as="span" color="blue.600" fontWeight="bold">
                      komplett kostenlose Trading-Ausbildung
                    </Text>
                    , mit der du strukturiert und praxisnah lernen kannst – perfekt für Einsteiger.
                  </Text>
                  
                  <Box bg="blue.50" borderRadius="lg" p="4" border="1px solid" borderColor="blue.100">
                    <Text fontWeight="bold" color="blue.800" mb="3" fontSize="sm">
                      WAS DICH ERWARTET:
                    </Text>
                    <VStack align="start" gap={2} fontSize="sm" color="blue.700">
                      <Box display="flex" alignItems="center" gap="2">
                        <Box w="2" h="2" bg="blue.500" borderRadius="full" />
                        <Text>Schritt-für-Schritt-Erklärungen zu Marktstruktur, Ein- und Ausstiegen</Text>
                      </Box>
                      <Box display="flex" alignItems="center" gap="2">
                        <Box w="2" h="2" bg="blue.500" borderRadius="full" />
                        <Text>Kein Fachchinesisch – verständlich, direkt, anwendbar</Text>
                      </Box>
                      <Box display="flex" alignItems="center" gap="2">
                        <Box w="2" h="2" bg="blue.500" borderRadius="full" />
                        <Text>Lerne in deinem eigenen Tempo – jederzeit abrufbar</Text>
                      </Box>
                    </VStack>
                  </Box>
                </Box>
              </Box>

              {/* Card 2 - Tools & Software (Orange) */}
              <Box 
                bg="white" 
                borderRadius="2xl" 
                boxShadow="lg" 
                overflow="hidden"
                border="1px solid"
                borderColor="orange.100"
                _hover={{ 
                  transform: "translateY(-4px)",
                  boxShadow: "2xl",
                  borderColor: "orange.200"
                }}
                transition="all 0.3s ease"
              >
                {/* Header mit Gradient */}
                <Box 
                  bg="linear-gradient(135deg, #FF6B35, #FF8E53)"
                  p={{ base: 4, md: 6 }}
                  color="white"
                >
                  <Box display="flex" alignItems="center" gap="3">
                    <Box 
                      bg="rgba(255, 255, 255, 0.2)" 
                      borderRadius="lg" 
                      p="3"
                      backdropFilter="blur(10px)"
                    >
                      <Text fontSize="2xl">🛠️</Text>
                    </Box>
                    <Box>
                      <Text fontSize="lg" fontWeight="bold" mb="1">
                        Tools & Trading-Software
                      </Text>
                      <Text fontSize="sm" opacity="0.9">
                        Professionelle Trading-Tools
                      </Text>
                    </Box>
                  </Box>
                </Box>
                
                {/* Content */}
                <Box p={{ base: 4, md: 6 }}>
                  <Text fontWeight="semibold" mb={4} color="gray.700" fontSize="md">
                    Lerne die Tools kennen, mit denen wir täglich arbeiten – dieselben, die wir in unserer Hauptausbildung verwenden und in der Community empfehlen.
                  </Text>
                  
                  <Box bg="orange.50" borderRadius="lg" p="4" border="1px solid" borderColor="orange.100">
                    <Text fontWeight="bold" color="orange.800" mb="3" fontSize="sm">
                      INKLUSIVE:
                    </Text>
                    <VStack align="start" gap={2} fontSize="sm" color="orange.700">
                      <Box display="flex" alignItems="center" gap="2">
                        <Box w="2" h="2" bg="orange.500" borderRadius="full" />
                        <Text>Übersicht & Erklärung zu den wichtigsten Trading-Tools</Text>
                      </Box>
                      <Box display="flex" alignItems="center" gap="2">
                        <Box w="2" h="2" bg="orange.500" borderRadius="full" />
                        <Text>Zugang zu exklusiven Trackern & Setups (Trade-Journal, Setup-Vorlagen)</Text>
                      </Box>
                      <Box display="flex" alignItems="center" gap="2">
                        <Box w="2" h="2" bg="orange.500" borderRadius="full" />
                        <Text>Vorstellung unserer Indikatoren & wie du sie direkt nutzen kannst</Text>
                      </Box>
                      <Box display="flex" alignItems="center" gap="2">
                        <Box w="2" h="2" bg="orange.500" borderRadius="full" />
                        <Text>Empfehlungen zu Plattformen, Brokern & Trading-Technik</Text>
                      </Box>
                    </VStack>
                  </Box>
                </Box>
              </Box>

              {/* Card 3 - Community (Grün) */}
              <Box 
                bg="white" 
                borderRadius="2xl" 
                boxShadow="lg" 
                overflow="hidden"
                border="1px solid"
                borderColor="green.100"
                _hover={{ 
                  transform: "translateY(-4px)",
                  boxShadow: "2xl",
                  borderColor: "green.200"
                }}
                transition="all 0.3s ease"
              >
                {/* Header mit Gradient */}
                <Box 
                  bg="linear-gradient(135deg, #10B981, #34D399)"
                  p={{ base: 4, md: 6 }}
                  color="white"
                >
                  <Box display="flex" alignItems="center" gap="3">
                    <Box 
                      bg="rgba(255, 255, 255, 0.2)" 
                      borderRadius="lg" 
                      p="3"
                      backdropFilter="blur(10px)"
                    >
                      <Text fontSize="2xl">📱</Text>
                    </Box>
                    <Box>
                      <Text fontSize="lg" fontWeight="bold" mb="1">
                        Social-Media & Community
                      </Text>
                      <Text fontSize="sm" opacity="0.9">
                        Werde Teil unserer Trading-Community
                      </Text>
                    </Box>
                  </Box>
                </Box>
                
                {/* Content */}
                <Box p={{ base: 4, md: 6 }}>
                  <Text fontWeight="semibold" mb={4} color="gray.700" fontSize="md">
                    Wir zeigen dir transparent, wie wir auf Social Media auftreten, unsere Community aufgebaut haben und täglich Trader begleiten.
                  </Text>
                  
                  <Box bg="green.50" borderRadius="lg" p="4" border="1px solid" borderColor="green.100">
                    <Text fontWeight="bold" color="green.800" mb="3" fontSize="sm">
                      DARIN ENTHALTEN:
                    </Text>
                    <VStack align="start" gap={2} fontSize="sm" color="green.700">
                      <Box display="flex" alignItems="center" gap="2">
                        <Box w="2" h="2" bg="green.500" borderRadius="full" />
                        <Text>Überblick über unsere Kanäle: Instagram, Telegram, Discord & Co.</Text>
                      </Box>
                      <Box display="flex" alignItems="center" gap="2">
                        <Box w="2" h="2" bg="green.500" borderRadius="full" />
                        <Text>Wie du Teil unserer Community wirst</Text>
                      </Box>
                      
                    </VStack>
                  </Box>
                </Box>
              </Box>
            </VStack>

          {/* Call-to-Action Button */}
          <Center mt={8}>
            <Button 
              size="xl" 
              fontWeight="bold" 
              colorScheme="blue" 
              bg="#1E88E5" 
              _hover={{ bg: "#1565C0" }} 
              borderRadius="lg" 
              px="12"
              py="8"
              fontSize="lg"
              onClick={() => setOpen(true)}
            >
              🚀 Jetzt kostenlosen Zugang sichern
            </Button>
          </Center>
        </VStack>
      </Section>

      {/* Dialog ohne extra Button */}
      <Dialog.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
        <Dialog.Trigger asChild>
          <Box display="none" />
        </Dialog.Trigger>
        <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content 
              borderRadius={{ base: "lg", md: "2xl" }} 
              p={{ base: 4, md: 6 }} 
              maxW={{ base: "90vw", md: "md" }}
              mx="auto"
              position="relative"
              minH={{ base: "auto", md: "auto" }}
            >
              {/* Schließen-Button oben rechts */}
              <Box position="absolute" top={{ base: 2, md: 3 }} right={{ base: 2, md: 3 }} zIndex={1}>
                <Dialog.CloseTrigger asChild>
                  <Button size={{ base: "xs", md: "sm" }} variant="ghost">
                    ✕
                  </Button>
                </Dialog.CloseTrigger>
              </Box>
              
              <Dialog.Header textAlign="center" pb={2}>
                <Dialog.Title fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold">
                  Letzter Schritt...
                </Dialog.Title>
              </Dialog.Header>
              
              {/* Animierte Progressbar */}
              <Box mb={{ base: 4, md: 6 }}>
                <Box position="relative" overflow="hidden" borderRadius="full" bg="gray.200" h="2">
                  {/* Animierter Progress Range */}
                  <Box
                    position="absolute"
                    left="0"
                    top="0"
                    h="100%"
                    w="80%"
                    bg="linear-gradient(90deg, #1E88E5, #60A5FA, #3B82F6)"
                    borderRadius="full"
                    boxShadow="0 0 8px rgba(30, 136, 229, 0.5)"
                    animation="pulse 2s ease-in-out infinite"
                    transition="all 0.3s ease"
                    _hover={{
                      boxShadow: "0 0 12px rgba(30, 136, 229, 0.7)",
                      transform: "scaleY(1.2)",
                    }}
                  />
                </Box>
                
                {/* Prozent-Anzeige mit Animation */}
                <Box 
                  display="flex" 
                  justifyContent="space-between" 
                  alignItems="center" 
                  mt="3"
                >
                  <Text fontSize="xs" color="gray.400">0%</Text>
                  
                  {/* Pulsierende Dots */}
                  <Box display="flex" gap="1" alignItems="center">
                    <Box 
                      w="1.5" 
                      h="1.5" 
                      bg="blue.400" 
                      borderRadius="full"
                      animation="pulse 1.2s ease-in-out infinite"
                    />
                    <Box 
                      w="1.5" 
                      h="1.5" 
                      bg="blue.500" 
                      borderRadius="full"
                      animation="pulse 1.2s ease-in-out infinite"
                      style={{ animationDelay: "0.2s" }}
                    />
                    <Box 
                      w="1.5" 
                      h="1.5" 
                      bg="blue.600" 
                      borderRadius="full"
                      animation="pulse 1.2s ease-in-out infinite"
                      style={{ animationDelay: "0.4s" }}
                    />
                  </Box>
                  
                  <Text fontSize="xs" color="blue.600" fontWeight="bold">100%</Text>
                </Box>
              </Box>
              
              <Dialog.Body px={0}>
                <VStack gap={{ base: 2, md: 3 }} mb={{ base: 4, md: 6 }}>
                  <Text fontSize={{ base: "sm", md: "md" }} color="gray.500" textAlign="center">
                    *Wir werden deine Daten niemals weitergeben, vermieten oder verkaufen...*
                  </Text>
                </VStack>
                
                <form onSubmit={handleSubmit}>
                  <VStack gap={{ base: 3, md: 4 }}>
                    <Box w="100%">
                      <Text fontWeight="600" mb={2} fontSize={{ base: "sm", md: "md" }}>
                        Name
                      </Text>
                      <Input
                        ref={initialRef}
                        name="FirstName"
                        placeholder="Dein Name..."
                        value={form.FirstName}
                        onChange={handleChange}
                        size={{ base: "md", md: "lg" }}
                      />
                      {errors.FirstName && (
                        <Text color="red.500" fontSize="sm" mt={1}>{errors.FirstName}</Text>
                      )}
                    </Box>
                    
                    <Box w="100%">
                      <Text fontWeight="600" mb={2} fontSize={{ base: "sm", md: "md" }}>
                        E-Mail *
                      </Text>
                      <Input
                        name="Email"
                        type="email"
                        placeholder="Deine E-Mail..."
                        value={form.Email}
                        onChange={handleChange}
                        size={{ base: "md", md: "lg" }}
                      />
                      {errors.Email && (
                        <Text color="red.500" fontSize="sm" mt={1}>{errors.Email}</Text>
                      )}
                    </Box>
                    
                    <Box w="100%">
                      <Text fontWeight="600" mb={2} fontSize={{ base: "sm", md: "md" }}>
                        Telefon
                      </Text>
                      <Input
                        name="Phone"
                        placeholder="Deine Telefonnummer..."
                        value={form.Phone}
                        onChange={handleChange}
                        size={{ base: "md", md: "lg" }}
                      />
                    </Box>
                    
                    <Button
                      colorScheme="blue"
                      size={{ base: "md", md: "lg" }}
                      width="100%"
                      type="submit"
                      mt={{ base: 2, md: 4 }}
                      loading={isLoading}
                    >
                      {isLoading ? "Wird gesendet..." : "Zugang zur Ressourcen-Bibliothek sichern 📈"}
                    </Button>
                  </VStack>
                </form>
                
                <Text 
                  fontSize={{ base: "xs", md: "sm" }} 
                  color="gray.400" 
                  mt={{ base: 3, md: 4 }} 
                  textAlign="center"
                  lineHeight="shorter"
                >
                  Mit dem Absenden erklärst du dich einverstanden, regelmäßig Updates und Informationen per SMS oder E-Mail zu erhalten.
                </Text>
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Positioner>
        </Dialog.Root>
    </>
  );
}

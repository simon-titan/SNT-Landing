import { Heading, Text, Box, Stack } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/layout/section";
import Link from "next/link";
export default function ProduktePage() {
    return (<Section size="lg" bg="bg" mt={{ base: 12, md: 12 }}>
      <Box width="100%" display="flex" justifyContent="center">
        <Box display="flex" flexDirection={{ base: "column", md: "row" }} width={{ base: "100%", md: "1200px" }} gap="0" alignItems="stretch" justifyContent="center">
          {/* Premium Produkte Section (aktualisiert) */}
          <Box flex={{ base: "unset", md: 2 }} bg="gray.900" color="white" borderRadius="2xl" p={{ base: 6, md: 12 }} minW={{ md: "650px" }} maxW={{ md: "750px" }} boxShadow="lg" textAlign="left" alignItems="flex-start" display="flex" flexDirection="column" mt={{ md: 0 }} mb={{ md: 0 }} zIndex={1} overflow="visible" position="relative">
            {/* Badge */}
            <Box position="absolute" top={4} right={4} px={4} py={2} fontSize="sm" fontWeight="bold" borderRadius="xl" color="#22c55e" bg="rgba(34, 197, 94, 0.35)" border="2px solid #22c55e" boxShadow="0 4px 24px 0 rgba(34,197,94,0.25), 0 1.5px 8px 0 rgba(0,0,0,0.10)" backdropFilter="blur(12px)" letterSpacing="wider" zIndex={10} style={{
            textShadow: '0 2px 8px rgba(34,197,94,0.5)',
            WebkitBackdropFilter: 'blur(12px)'
        }}>
              EXKLUSIVES ANGEBOT
            </Box>
            {/* Bild */}
            <Box w="100%" h="200px" borderRadius="lg" mb={4} mt="-3" overflow="hidden" display="flex" alignItems="center" justifyContent="center">
              <img src="/assets/PB-1.png" alt="SNTTRADES Trading Ausbildung" style={{
            width: '120%',
            height: '120%',
            objectFit: 'contain',
            borderRadius: '0.5rem'
        }}/>
            </Box>
            <Text fontWeight="bold" color="gray.400" fontSize="sm" mb={2}>SNTTRADES</Text>
            <Heading as="h2" size="2xl" mb={2}>SNTTRADES AUSBILDUNG</Heading>
            <Text mb={4}>Lerne alles, was ich in über 6 Jahren Trading- und Investment-Erfahrung gesammelt habe – in einem strukturierten, selbstbestimmten Ausbildungsprozess von Anfänger bis Profi.</Text>
            <Stack direction="row" align="baseline" gap="1" mb={2}>
              <Text as="s" color="red.400" fontWeight="bold" fontSize="lg">567€</Text>
              <Text color="green.400" fontWeight="bold" fontSize="4xl" textShadow="0 0 8px rgba(72, 187, 120, 0.6)">
                247€
              </Text>
            </Stack>
            <Text fontSize="xs" color="gray.400" mb={4}>*Vorübergehendes Sonderangebot</Text>
            <ul style={{ listStyle: "disc", paddingLeft: 20, margin: 0, textAlign: "left", marginBottom: 24 }}>
              <li style={{ marginBottom: 8 }}>Umfassendes Video-Training auf Abruf</li>
              <li style={{ marginBottom: 8 }}>Live-Mentoring & Umsetzung</li>
              <li style={{ marginBottom: 8 }}>Trading meistern & echte Ergebnisse erzielen</li>
              <li style={{ marginBottom: 8 }}>interaktive Community unter Gleichgesinnten</li>
              <li style={{ marginBottom: 8 }}>Trading-Tools & Software</li>
            </ul>
            <Link href="/Produkte/SNTTRADES-AUSBILDUNG" style={{ width: '100%' }}>
              <Button size="lg" colorScheme="blue" w="100%" style={{ textAlign: "center" }}>Mehr zur Ausbildung</Button>
            </Link>
          </Box>

          {/* Rechtes kleineres Element */}
          <Box flex={{ base: "unset", md: 1 }} bg="white" color="gray.900" borderTopRightRadius="xl" borderBottomRightRadius="xl" p={{ base: 6, md: 12 }} minW={{ md: "500px" }} maxW={{ md: "600px" }} maxH={{ md: "650px" }} borderLeft="1px solid" borderColor="gray.200" boxShadow="lg" textAlign="left" alignItems="flex-start" display="flex" flexDirection="column" alignSelf="center" position="relative">
            {/* Badge */}
            <Box position="absolute" top={4} right={4} px={4} py={2} fontSize="sm" fontWeight="bold" borderRadius="xl" color="blue" bg="rgba(59, 130, 246, 0.35)" border="2px solid #3b82f6" boxShadow="0 4px 24px 0 rgba(59,130,246,0.25), 0 1.5px 8px 0 rgba(0,0,0,0.10)" backdropFilter="blur(12px)" letterSpacing="wider" zIndex={10} style={{
            textShadow: '0 2px 8px rgba(59,130,246,0.5)',
            WebkitBackdropFilter: 'blur(12px)'
        }}>
              KOSTENLOS
            </Box>
            {/* Bild */}
            <Box w="100%" h="180px" bg="gray.100" borderRadius="lg" mb={4} overflow="hidden" display="flex" alignItems="center" justifyContent="center">
              <img src="/assets/V4.png" alt="SNTTRADES Ressourcen Bibliothek" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '0.5rem' }}/>
            </Box>
            <Text fontWeight="bold" color="gray.400" fontSize="sm" mb={2}>SNTTRADES</Text>
            <Heading as="h2" size="lg" mb={2}>SNTTRADES Ressourcen Bibliothek</Heading>
            <Text mb={4}>Sichere dir einen Einblick in unsere Trading-Ausbildung und Zugang zu leistungsstarken Tools & Software, einer kostenlosen Grundausbildung und weiteren exklusiven Inhalten.</Text>
            <ul style={{ listStyle: "disc", paddingLeft: 20, margin: 0, textAlign: "left", marginBottom: 24 }}>
              <li style={{ marginBottom: 8 }}>Kostenloser Trading-Kurs</li>
              <li style={{ marginBottom: 8 }}>Tools & Trading-Software</li>
              <li style={{ marginBottom: 8 }}>und vieles mehr...</li>
            </ul>
            <Link href="/Produkte/SNT-Ressourcen-Bibliothek" style={{ width: '100%' }}>
              <Button size="lg" colorScheme="blue" w="100%" style={{ textAlign: "center" }}>🔥 Ressourcen Bibliothek sichern</Button>
            </Link>
          </Box>
        </Box>
      </Box>
    </Section>);
}

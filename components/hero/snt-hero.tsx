"use client";

import { Box, Heading, VStack, Button, Link, HStack, Text } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { ApprovedIcon } from "../ui/approved-icon";

const SNT_BLUE = "#068CEF";
const SNT_YELLOW = "rgba(251, 191, 36, 1)"; // Corresponds to #FBBF24

interface SntHeroProps {
  onRegisterClick?: () => void;
}

export default function SntHero({ onRegisterClick }: SntHeroProps) {
  return (
    <Box
      position="relative"
      w="100%"
      h={{ base: "auto", md: "60vh" }}
      minH={{ base: "auto", md: "60vh" }}
      py={{ base: 6, md: 0 }}
      pb={{ base: 6, md: 0 }}
      background="linear-gradient(80deg,rgba(6, 140, 239, 0.2) 0%, rgba(255, 255, 255, 1) 50%, rgba(255, 217, 0, 0.2) 100%)"
      border="0"
    >

      <VStack
        position={{ base: "relative", md: "absolute" }}
        top={{ base: "auto", md: "50%" }}
        left={{ base: "auto", md: "50%" }}
        transform={{ base: "none", md: "translate(-50%, -50%)" }}
        gap={{ base: 3, md: 5 }}
        w="full"
        maxW="900px"
        px={{ base: 4, md: 6 }}
        py={{ base: 0, md: 0 }}
        zIndex={1}
        mx="auto"
      >
        <HStack
          mx={1.5}
          justifyContent="center"
          animation={`${keyframes({
            from: { opacity: 0, transform: "translateY(-6%) scale(0.96)", filter: "blur(2px)" },
            to: { opacity: 1, transform: "translateY(0) scale(1)", filter: "blur(0)" },
          })} 1600ms ease-out both`}
        >
          <ApprovedIcon boxSize={{ base: 5, md: 6 }} />
          <Heading
            as="h2"
            color="black"
            textAlign="center"
            fontWeight="600"
            fontSize={{ base: "sm", md: "md" }}
            lineHeight="1"
          >
            SNTTRADES™
          </Heading>
        </HStack>

        {/* Header mit Hervorhebung */}
        <Heading
          as="h1"
          textAlign="center"
          color="black"
          fontWeight="medium"
          fontSize={{ base: "xl", sm: "2xl", md: "3xl", lg: "4xl" }}
          lineHeight={{ base: "1.4", md: "1.3" }}
          maxW={{ base: "95%", md: "85%" }}
          textShadow="none"
        >
          Stell dir ein Leben vor, in dem du{" "}
          <Box
            as="span"
            color="black"
            fontWeight="bold"
            px="1.5"
            borderRadius="xs"
            bg={`linear-gradient(90deg, ${SNT_YELLOW} 0%, rgba(251, 191, 36,0.22) 85%, rgba(251, 191, 36,0) 100%)`}
            display="inline-block"
          >
            Zeit & Ort
          </Box>{" "}
          deiner Arbeit{" "}
          <Box
            as="span"
            color="black"
            fontWeight="bold"
            px="1.5"
            borderRadius="xs"
            bg={`linear-gradient(90deg, ${SNT_YELLOW} 0%, rgba(251, 191, 36,0.22) 85%, rgba(251, 191, 36,0) 100%)`}
            display="inline-block"
          >
            selbst bestimmen
          </Box>{" "}
          kannst.
        </Heading>

        {/* Subtitle */}
        <Text
          textAlign="center"
          color="gray.700"
          fontSize={{ base: "sm", md: "lg" }}
          lineHeight={{ base: "1.6", md: "1.7" }}
          maxW={{ base: "95%", md: "80%" }}
          px={{ base: 2, md: 0 }}
        >
          Im{" "}
          <Box
            as="span"
            color={SNT_BLUE}
            fontWeight="bold"
            display="inline-block"
          >
            Free Bootcamp
          </Box>{" "}
          bekommst du einen ehrlichen Einblick, wie du dir mit{" "}
          <Box
            as="span"
            color={SNT_BLUE}
            fontWeight="bold"
            display="inline-block"
          >
            klaren Regeln und Struktur
          </Box>{" "}
          langfristig Trading-Skills aufbauen kannst.
        </Text>

        {onRegisterClick ? (
          <Button
            size={{ base: "md", md: "lg" }}
            mt={{ base: 4, md: 6 }}
            bg={SNT_BLUE}
            color="white"
            border="1px solid transparent"
            onClick={onRegisterClick}
            _hover={{ 
              bg: "#0572c2", 
            }}
            _active={{ 
              bg: "#0465b8", 
            }}
            transition="all 0.3s ease"
          >
            Jetzt kostenlos starten
            <Box as="span" ml={2}>
              <ArrowRight weight="bold" />
            </Box>
          </Button>
        ) : (
        <Link
          href="https://seitennull---fzco.outseta.com/auth?widgetMode=register&planUid=wmjBBxmV&planPaymentTerm=month&skipPlanOptions=true"
          data-outseta-modal-class="snt-outseta-modal"
          _hover={{ textDecoration: 'none' }}
        >
          <Button
            size={{ base: "md", md: "lg" }}
            mt={{ base: 4, md: 6 }}
            bg={SNT_BLUE}
            color="white"
            border="1px solid transparent"
            _hover={{ 
              bg: "#0572c2", 
            }}
            _active={{ 
              bg: "#0465b8", 
            }}
            transition="all 0.3s ease"
          >
            Jetzt kostenlos starten
            <Box as="span" ml={2}>
              <ArrowRight weight="bold" />
            </Box>
          </Button>
        </Link>
        )}
      </VStack>
    </Box>
  );
}



"use client";

import { Box, Heading, VStack, Button, Link, HStack, Text, Icon } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { ArrowRight, Timer } from "@phosphor-icons/react/dist/ssr";
import { ApprovedIcon } from "../ui/approved-icon";

const SNT_BLUE = "#068CEF";
const SNT_YELLOW = "rgba(251, 191, 36, 1)"; // Corresponds to #FBBF24

export default function SntHero({ timeLeft }) {
  return (
    <Box
      position="relative"
      w="100%"
      h={{ base: "50vh", md: "60vh" }}
      background="linear-gradient(80deg,rgba(6, 140, 239, 0.2) 0%, rgba(255, 255, 255, 1) 50%, rgba(255, 217, 0, 0.2) 100%)"
      border="0"
    >

      <VStack
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        gap={{ base: 2, md: 3 }}
        w="full"
        maxW="900px"
        px={{ base: 3, md: 6 }}
        zIndex={1}
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
            fontSize="md"
            lineHeight="1"
          >
            SNTTRADES™
          </Heading>
        </HStack>

        

        {/* Text aus page.tsx (grüner Marker auf dem wichtigen Teil) */}
        <Heading
          as="h1"
          textAlign="center"
          color="black"
          fontWeight="medium"
          fontSize={{ base: "2xl", md: "4xl" }}
          lineHeight="1.3"
          maxW={{ base: "90%", md: "80%" }}
          textShadow="none"
        >
          Lerne in unserem{" "}<br></br>
          <Box
            as="span"
            color="black"
            fontWeight="bold"
            px="1.5"
            borderRadius="xs"
            bg={`linear-gradient(90deg, ${SNT_YELLOW} 0%, rgba(251, 191, 36,0.22) 85%, rgba(251, 191, 36,0) 100%)`}
          >
          Trading-BOOTCAMP
          </Box>{" "}<br></br>
          die Grundlagen{" "}<br></br>
          <Box
            as="span"
            color="black"
            fontWeight="bold"
            px="1.5"
            borderRadius="xs"
            bg={`linear-gradient(90deg, ${SNT_YELLOW} 0%, rgba(251, 191, 36,0.22) 85%, rgba(251, 191, 36,0) 100%)`}
          >
            des profitablen Tradings.
          </Box>
        </Heading>

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
 
         {/* Countdown Timer */}
         <Box
           mt={4}
           bg="gray.100"
           borderRadius="full"
           border="1px solid"
           borderColor="gray.200"
           px={{ base: 4, md: 5 }}
           py={{ base: 2, md: 2.5 }}
         >
           <HStack gap={3}>
              <Icon as={Timer} color={SNT_BLUE} boxSize={{ base: 5, md: 6 }}  />
              <Text fontSize={{ base: "xs", md: "sm" }} color="black" fontWeight="medium">
                 Dein Platz ist reserviert für:{" "}
                 <Text as="span" color={SNT_BLUE} fontWeight="bold">
                    {String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
                 </Text>
              </Text>
           </HStack>
         </Box>
      </VStack>
    </Box>
  );
}



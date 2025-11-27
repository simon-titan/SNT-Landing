"use client";

import { useState, useEffect } from "react";
import { Heading, HStack, Stack, VStack, Text, Box, Flex, SimpleGrid } from "@chakra-ui/react";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import { WarningCircle } from "@phosphor-icons/react/dist/ssr";
import { BrandedVimeoPlayer } from "@/components/ui/BrandedVimeoPlayer";
import { BsArrowUp, BsCheckCircle, BsPlayCircle, BsChatDots, BsGraphUp, BsFillPeopleFill, BsFillBookFill, BsEyeglasses } from "react-icons/bs";
import { authConfig } from "@/config/auth-config";

export function TelegramHeroWithVideo() {
  const [isTikTokBrowser, setIsTikTokBrowser] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userAgent = window.navigator.userAgent.toLowerCase();
      // TikTok in-app browser detection
      const isTikTok = userAgent.includes("tiktok") || userAgent.includes("musical_ly");
      setIsTikTokBrowser(isTikTok);
    }
  }, []);
  return (
    <>
      <Section
        header
        size="lg"
        bg="black"
        borderBottom="1px solid"
        borderColor="rgba(59, 130, 246, 0.25)"
        w="100vw"
        mx="unset"
        pb={{ base: "60px", md: "80px" }}
        pt={{ base: "20px", md: "80px" }}
        background="radial-gradient(at 0% 100%, rgba(59, 130, 246, 0.28) 0px, transparent 55%),
        radial-gradient(at 100% 0%, rgba(37, 99, 235, 0.22) 0px, transparent 55%),
        linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(10,12,10,1) 100%)"
      >
        <style>{`
         html { scroll-behavior: smooth; }
         .css-1q38vmp {
            padding-top: 75px !important;
          }
          @keyframes pulse {
           0%, 100% {
             opacity: 1;
             transform: scale(1);
           }
           50% {
             opacity: 0.85;
             transform: scale(1.03);
           }
         }
         @keyframes pulseArrow {
           0%, 100% {
             opacity: 1;
             transform: translateY(0) scale(1);
           }
           50% {
             opacity: 0.9;
             transform: translateY(-10px) scale(1.15);
           }
         }
         .pulsing-box {
           animation: pulse 2s ease-in-out infinite;
         }
         .pulsing-arrow {
           animation: pulseArrow 2s ease-in-out infinite;
         }
        `}</style>

        <VStack gap="4" maxW="900px" mx="auto">
            {/* Info Box - Nur auf Mobile und im TikTok Browser */}
            {isTikTokBrowser && (
              <Flex
                  display={{ base: "flex", md: "none" }}
                  w="full"
                  maxW="600px"
                  mx="auto"
                  mb={4}
                  mt={{ base: "-60px", md: 0 }}
                  align="flex-start"
                  gap={3}
              >
                <Box
                    flex="1"
                    className="pulsing-box"
                    bg="white"
                    border="1px solid"
                    borderColor="gray.300"
                    borderRadius="md"
                    p={4}
                    position="relative"
                >
                    <Text
                        fontSize="md"
                        fontWeight="bold"
                        color="blue.600"
                        mb={2}
                    >
                        WICHTIG
                    </Text>
                    <Text fontSize="sm" color="gray.700" lineHeight="1.6">
                        <Text as="span" fontWeight="bold" color="blue.600">1.</Text> Klicke die 3 Punkte in der oberen rechten Ecke<br />
                        <Text as="span" fontWeight="bold" color="blue.600">2.</Text> Klicke auf "Im Browser öffnen"<br />
                        <Text as="span" fontWeight="bold" color="blue.600">3.</Text> Klicke auf "JETZT BEITRETEN"<br />
                        <Text as="span" fontWeight="bold" color="blue.600">4.</Text> Du bist Mitglied in unserem KOSTENLOSEN TELEGRAM Kanal
                    </Text>
                </Box>
                <Box
                    className="pulsing-arrow"
                    color="blue.400"
                    filter="drop-shadow(0 0 12px rgba(96, 165, 250, 0.8))"
                    flexShrink={0}
                    mt={2}
                    fontSize="48px"
                >
                    <BsArrowUp />
                </Box>
            </Flex>
            )}
          <Stack gap="2" textAlign="center" mx="auto">
            <Heading
              as="h1"
              textStyle={{ base: "4xl", md: "5xl" }}
              mx="auto"
              line-height="1.8"
              color="white"
              lineHeight="tighter"
              fontWeight="bold"
              maxW="800px"
            >
              LERNE TRADING {" "}
              <Box as="span"
                background="linear-gradient(90deg, rgba(59, 130, 246,0.28), transparent 95%)"
                color="white"
                px={2}
                py={2}
                borderRadius="md"
                fontWeight="bold"
                display="inline-block"
                border="1px solid rgba(59, 130, 246, 0.35)"
                boxShadow="0 0 0 1px rgba(59, 130, 246, 0.25) inset, 0 0 24px rgba(59, 130, 246, 0.25)"
                backdropFilter="blur(6px)"
              >
                SCHNELL.<br></br>KLAR.<br></br> UND OHNE CHAOS.
              </Box>
              {" "}
            </Heading>
            <Text color="gray.300" textStyle="sm" mx="auto" maxW="700px">
              Tägliche Marktanalysen, Lernimpulse und echte Einblicke - kostenlos in meiner Telegram Community.
            </Text>
          </Stack>
          <Stack align="center" direction={{ base: "column", md: "row" }} gap="3" position="relative" zIndex={10}>
            <Link href="https://t.me/seitennulltrades" >
              <Button size="xl" fontWeight="bold" colorScheme="blue" bg="#3b82f6" _hover={{ bg: "#2563eb" }} borderRadius="md" px="8" boxShadow="0 0 24px rgba(59, 130, 246,0.35)" border="1px solid rgba(59, 130, 246,0.45)">
               JETZT KOSTENLOS BEITRETEN
              </Button>
            </Link>
          </Stack>
           
        
        </VStack>
      </Section>

      <Section 
        size="lg" 
        bg="transparent"
        mt={{ base: "-170px", md: "-220px" }}
        pt="0"
        position="relative"
        zIndex={2}
      >
        <VStack gap="6" maxW="none" mx="auto" position="relative">
          <Box 
            w={{ base: '100%', md: '800px', lg: '1200px', xl: '1400px' }} 
            maxW="100%" 
            mx="auto" 
            bg="linear-gradient(135deg, rgba(59, 130, 246, 0.35), rgba(37, 99, 235, 0.35))"
            borderRadius="xl" 
            p="7px"
            position="relative"
            zIndex={3}
            boxShadow="0 0 40px rgba(59, 130, 246,0.2)"
          >
            <VStack gap="2">
              <Box 
                w="100%" 
                aspectRatio={16/9} 
                position="relative"
                overflow="hidden"
                bg="white"
                borderRadius="lg"
              >
                {/* TODO: Replace with Telegram specific video ID */}
                <BrandedVimeoPlayer videoId="1141119931" />
              </Box>
              <Box 
                p="2" 
                w="100%" 
                bg="rgba(10, 14, 10, 0.6)"
                backdropFilter="blur(12px)"
                borderRadius="lg"
                border="1px solid rgba(59, 130, 246, 0.25)"
                boxShadow="0 8px 32px 0 rgba(59, 130, 246, 0.20)"
              >
                <Stack direction="row" align="center" gap="2" justify="center">
                  <Stack direction="row" gap="-2">
                    <Box 
                       w="6" 
                       h="6" 
                       borderRadius="full" 
                       border="2px solid rgba(59, 130, 246, 0.45)" 
                       overflow="hidden"
                       bg="gray.200"
                       boxShadow="0 4px 8px rgba(0,0,0,0.1)"
                     >
                       <img 
                         src="/assets/community-stats/user_6819319_6ec853ff-5777-4398-8fcc-06e2621cbcf8.avif" 
                         alt="Community member"
                         style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                       />
                     </Box>
                     <Box 
                       w="6" 
                       h="6" 
                       borderRadius="full" 
                       border="2px solid rgba(59, 130, 246, 0.45)" 
                       overflow="hidden"
                       bg="gray.200"
                       boxShadow="0 4px 8px rgba(0,0,0,0.1)"
                     >
                       <img 
                         src="/assets/community-stats/4208db19763848b131989eadba9899aa.avif" 
                         alt="Community member"
                         style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                       />
                     </Box>
                     <Box 
                       w="6" 
                       h="6" 
                       borderRadius="full" 
                       border=" 2px solid rgba(59, 130, 246, 0.45)" 
                       overflow="hidden"
                       bg="gray.200"
                       boxShadow="0 4px 8px rgba(0,0,0,0.1)"
                     >
                       <img 
                         src="/assets/community-stats/393d1b15978eed96285cf196b2f51eda.avif" 
                         alt="Community member"
                         style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                       />
                     </Box>
                  </Stack>
                  <Text fontSize="xs" color="gray.200" fontWeight="medium" textShadow="0 1px 2px rgba(0,0,0,0.3)">
                   ...Bereits über <Text as="span" fontWeight="bold">1000+ Trader</Text> auf ihrem Weg begleitet und ausgebildet.
                  </Text>
                </Stack>
              </Box>
            </VStack>
          </Box>
        </VStack>
        {/* Feature Cards */}
        <Box
              w="full"
              maxW="800px"
              mx="auto"
              mt={4}
              bg="white"
              borderRadius="2xl"
              p={6}
              border="1px solid"
              borderColor="gray.300"
              boxShadow="lg"
          >
              <SimpleGrid
                  columns={{ base: 1, md: 2 }}
                  gap={4}
                  w="full"
              >
                  {/* Item 1: Kostenloser Zugang */}
                  <HStack gap={2.5} align="center">
                      <Box
                          color="blue.600"
                          fontSize="20px"
                          w="20px"
                          h="20px"
                          flexShrink={0}
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          filter="drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))"
                      >
                          <BsCheckCircle />
                      </Box>
                      <Text color="gray.700" fontSize="sm" fontWeight="medium" lineHeight="1.5">
                      Einblicke in meine Trading-Strategie
                      </Text>
                  </HStack>

                  {/* Item 1: Kostenloser Zugang */}
                  <HStack gap={2.5} align="center">
                      <Box
                          color="blue.600"
                          fontSize="20px"
                          w="20px"
                          h="20px"
                          flexShrink={0}
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          filter="drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))"
                      >
                          <BsEyeglasses/>
                      </Box>
                      <Text color="gray.700" fontSize="sm" fontWeight="medium" lineHeight="1.5">
                          Psychologische Insights
                      </Text>
                  </HStack>

                 

                  {/* Item 3: Discord-Community */}
                  <HStack gap={2.5} align="center">
                      <Box
                          color="blue.600"
                          fontSize="20px"
                          w="20px"
                          h="20px"
                          flexShrink={0}
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          filter="drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))"
                      >
                          <BsGraphUp />
                      </Box>
                      <Text color="gray.700" fontSize="sm" fontWeight="medium" lineHeight="1.5">
                          Tägliche Marktanalysen
                      </Text>
                  </HStack>

                  {/* Item 4: Trading-Einblicke */}
                  <HStack gap={2.5} align="center">
                      <Box
                          color="blue.600"
                          fontSize="20px"
                          w="20px"
                          h="20px"
                          flexShrink={0}
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          filter="drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))"
                      >
                          <BsFillPeopleFill  />
                      </Box>
                      <Text color="gray.700" fontSize="sm" fontWeight="medium" lineHeight="1.5">
                          Fokusierte Community
                      </Text>
                  </HStack>

                  <HStack gap={2.5} align="center">
                      <Box
                          color="blue.600"
                          fontSize="20px"
                          w="20px"
                          h="20px"
                          flexShrink={0}
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          filter="drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))"
                      >
                          <BsFillBookFill  />
                      </Box>
                      <Text color="gray.700" fontSize="sm" fontWeight="medium" lineHeight="1.5">
                          Direkte, ungefilterte Inhalte, die es sonst nirgends gibt.
                      </Text>
                  </HStack>

                  
              </SimpleGrid>
              
          </Box>
        
        <Box 
          display="flex" 
          justifyContent="center" 
          alignItems="center"
          mt={8}
          mb={8}
          w="full"
        >
          <Link href="https://t.me/seitennulltrades" >
              <Button size="xl" fontWeight="bold" colorScheme="blue" bg="#3b82f6" _hover={{ bg: "#2563eb" }} borderRadius="md" px="8" boxShadow="0 0 24px rgba(59, 130, 246,0.35)" border="1px solid rgba(59, 130, 246,0.45)">
               JETZT KOSTENLOS BEITRETEN
              </Button>
            </Link>
            </Box>

      </Section>
    </>
  );
}

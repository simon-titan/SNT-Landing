"use client";
import React from "react";
import { Box, Text, VStack, HStack, Stack, Image } from "@chakra-ui/react";
const BlueCheckIcon = () => (<Box position="relative">
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <circle cx="10" cy="10" r="9" fill="rgba(59, 130, 246, 0.2)" stroke="rgba(59, 130, 246, 0.4)" strokeWidth="1"/>
      <path d="M6 10.5L8.5 13L14 7.5" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" filter="drop-shadow(0 0 4px rgba(59, 130, 246, 0.6))"/>
    </svg>
  </Box>);
export const FounderSection = ({ image, name, subtitle, description, checklist, highlights = [], reverse = false, }) => {
    return (<Box as="section" py={{ base: 16, md: 32 }} px={{ base: 4, md: 8 }} w="full" display="flex" justifyContent="center" alignItems="center" bg="black" position="relative">
      <Box bg="rgba(10, 14, 10, 0.7)" backdropFilter="blur(20px)" borderRadius="2xl" boxShadow="0 20px 60px 0 rgba(59, 130, 246, 0.2), inset 0 1px 0 rgba(59, 130, 246, 0.1)" border="1px solid rgba(59, 130, 246, 0.25)" w="full" maxW="5xl" px={{ base: 4, md: 10 }} py={{ base: 8, md: 12 }} position="relative" _hover={{
            boxShadow: "0 25px 80px 0 rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(59, 130, 246, 0.2)"
        }} transition="all 0.3s ease">
        <Stack direction={{ base: "column", md: reverse ? "row-reverse" : "row" }} align="center" gap={{ base: 8, md: 16 }} w="full" justify="center">
          {/* Profilbild */}
          <VStack flexShrink={0} gap={4} position="relative">
            <Box w="280px" h="380px" position="relative" borderRadius="2xl" overflow="hidden" background="linear-gradient(135deg, rgba(59, 130, 246, 0.4), rgba(37, 99, 235, 0.3))" p="4px" boxShadow="0 20px 60px 0 rgba(59, 130, 246, 0.4), 0 0 0 1px rgba(59, 130, 246, 0.2) inset" _hover={{
            transform: "translateY(-4px) scale(1.02)",
            boxShadow: "0 30px 80px 0 rgba(59, 130, 246, 0.5), 0 0 0 1px rgba(59, 130, 246, 0.3) inset"
        }} transition="all 0.4s ease">
              <Box w="full" h="full" borderRadius="xl" overflow="hidden" position="relative">
                <Image src={image} alt={name} w="full" h="full" objectFit="cover"/>
              </Box>
            </Box>
          </VStack>

          <VStack align="start" gap={6} maxW="lg" w="full">
            <Box>
              <Text color="blue.500" fontWeight="bold" fontSize="sm" textTransform="uppercase" letterSpacing="wider">
                {subtitle}
              </Text>
            </Box>
            
            <Text as="h2" fontWeight="bold" fontSize={{ base: "2xl", md: "4xl" }} color="white" lineHeight="tight">
              {name}
            </Text>
            
            <Box fontSize="md" color="white" lineHeight="1.7" bg="rgba(59, 130, 246, 0.08)" p={6} borderRadius="xl" border="1px solid rgba(59, 130, 246, 0.2)">
              {description}
            </Box>
            
            <VStack align="start" gap={3} mt={6} w="full">
              <Text fontSize="lg" fontWeight="bold" color="blue.500" mb={2}>
                Expertise & Erfolge:
              </Text>
              {checklist.map((item, idx) => (<HStack key={idx} gap={3} fontSize="md" align="start" w="full">
                  <Box mt={1} flexShrink={0}>
                    <BlueCheckIcon />
                  </Box>
                  <Text color="gray.200" lineHeight="1.6" _hover={{ color: "white" }} transition="color 0.2s ease" fontSize="md">
                    {item}
                  </Text>
                </HStack>))}
            </VStack>
          </VStack>
        </Stack>
      </Box>
    </Box>);
};
export default FounderSection;

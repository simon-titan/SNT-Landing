"use client";
import React from "react";
import { Box, Text, VStack, HStack, Stack, Image } from "@chakra-ui/react";

export interface FounderSectionProps {
  image: string;
  name: string;
  subtitle: string;
  description: React.ReactNode;
  checklist: string[];
  highlights?: string[];
  reverse?: boolean;
}

// Blaues Haken-Icon als SVG
const BlueCheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path d="M5 10.5L9 14.5L15 7.5" stroke="#1E88E5" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const FounderSection: React.FC<FounderSectionProps> = ({
  image,
  name,
  subtitle,
  description,
  checklist,
  highlights = [],
  reverse = false,
}) => {
  return (
    <Box as="section" py={{ base: 16, md: 32 }} px={{ base: 4, md: 8 }} w="full" display="flex" justifyContent="center" alignItems="center">
      <Box 
        bg="white" 
        borderRadius="2xl" 
        boxShadow="xl" 
        border="1px solid"
        borderColor="gray.200"
        w="full" 
        maxW="5xl" 
        px={{ base: 4, md: 10 }} 
        py={{ base: 8, md: 12 }}
      >
        <Stack
          direction={{ base: "column", md: reverse ? "row-reverse" : "row" }}
          align="center"
          gap={{ base: 8, md: 16 }}
          w="full"
          justify="center"
        >
          {/* Profilbild mit Medien-Logos */}
          <VStack flexShrink={0} gap={4}>
            <Box
              w="240px"
              h="320px"
              position="relative"
              borderRadius="2xl"
              overflow="hidden"
              background="linear-gradient(135deg, rgba(13, 112, 182, 0.8), rgba(148, 39, 238, 0.8))"
              p="7px"
              boxShadow="lg"
            >
              <Box
                w="full"
                h="full"
                borderRadius="xl"
                overflow="hidden"
              >
                <Image
                  src={image}
                  alt={name}
                  w="full"
                  h="full"
                  objectFit="cover"
                />
              </Box>
            </Box>
            
            
          </VStack>

          <VStack align="start" gap={4} maxW="lg" w="full">
            <Text color="#EAB308" fontWeight="semibold" fontSize="sm" textTransform="uppercase">
              {subtitle}
            </Text>
            <Text as="h2" fontWeight="bold" fontSize={{ base: "2xl", md: "3xl" }} color="black">
              {name}
            </Text>
            
            <Box fontSize="md" color="gray.700">
              {description}
            </Box>
            
            <VStack align="start" gap={2} mt={4}>
              {checklist.map((item, idx) => (
                <HStack key={idx} gap={3} fontSize="md" align="start">
                  <Box mt={1}>
                    <BlueCheckIcon />
                  </Box>
                  <Text color="gray.700" lineHeight="1.5">{item}</Text>
                </HStack>
              ))}
            </VStack>
          </VStack>
        </Stack>
      </Box>
    </Box>
  );
};

export default FounderSection; 
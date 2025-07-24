"use client";
import React from "react";
import { Box, Text, VStack, HStack, Stack } from "@chakra-ui/react";
import { Avatar } from "@/components/ui/avatar";

export interface FounderSectionProps {
  image: string;
  name: string;
  subtitle: string;
  description: string;
  checklist: string[];
  highlights?: string[];
  reverse?: boolean;
}

// Weißes Haken-Icon als SVG
const WhiteCheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path d="M5 10.5L9 14.5L15 7.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
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
    <Box as="section" py={{ base: 10, md: 20 }} w="full" display="flex" justifyContent="center" alignItems="center">
      <Box bg="#2563eb" borderRadius="2xl" boxShadow="xl" w="full" maxW="5xl" px={{ base: 4, md: 10 }} py={{ base: 8, md: 12 }}>
        <Stack
          direction={{ base: "column", md: reverse ? "row-reverse" : "row" }}
          align="center"
          gap={{ base: 8, md: 16 }}
          w="full"
          justify="center"
        >
          <Box flexShrink={0}>
            <Avatar src={image} name={name} size="2xl" borderRadius="xl" boxShadow="lg" />
          </Box>
          <VStack align="start" gap={4} maxW="lg" w="full">
            <Text color="#93c5fd" fontWeight="bold" fontSize="sm" textTransform="uppercase">
              Meet the Founder
            </Text>
            <Text as="h2" fontWeight="bold" fontSize={{ base: "2xl", md: "3xl" }} color="white">
              {name}
            </Text>
            <Text fontSize="lg" color="#dbeafe">
              {subtitle}
            </Text>
            <Text color="#e0e7ef">{description}</Text>
            <VStack align="start" gap={2} mt={2}>
              {checklist.map((item, idx) => (
                <HStack key={idx} gap={2} fontSize="md">
                  <WhiteCheckIcon />
                  <Text as="span" color="#dbeafe">{item}</Text>
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
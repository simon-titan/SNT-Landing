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

// Grünes Haken-Icon als SVG mit Glow Effekt
const GreenCheckIcon = () => (
  <Box position="relative">
    <svg 
      width="20" 
      height="20" 
      viewBox="0 0 20 20" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      <circle cx="10" cy="10" r="9" fill="rgba(34, 197, 94, 0.2)" stroke="rgba(34, 197, 94, 0.4)" strokeWidth="1"/>
      <path 
        d="M6 10.5L8.5 13L14 7.5" 
        stroke="#22c55e" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        filter="drop-shadow(0 0 4px rgba(34, 197, 94, 0.6))"
      />
    </svg>
  </Box>
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
    <Box 
      as="section" 
      py={{ base: 16, md: 32 }} 
      px={{ base: 4, md: 8 }} 
      w="full" 
      display="flex" 
      justifyContent="center" 
      alignItems="center"
      bg="linear-gradient(135deg, rgba(0, 0, 0, 0.95), rgba(10, 14, 10, 0.98))"
      position="relative"
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "radial-gradient(at 30% 40%, rgba(34, 197, 94, 0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(16, 185, 129, 0.1) 0px, transparent 50%)",
        pointerEvents: "none"
      }}
    >
      <Box 
        bg="rgba(10, 14, 10, 0.7)" 
        backdropFilter="blur(20px)"
        borderRadius="2xl" 
        boxShadow="0 20px 60px 0 rgba(34, 197, 94, 0.2), inset 0 1px 0 rgba(34, 197, 94, 0.1)" 
        border="1px solid rgba(34, 197, 94, 0.25)"
        w="full" 
        maxW="5xl" 
        px={{ base: 4, md: 10 }} 
        py={{ base: 8, md: 12 }}
        position="relative"
        _hover={{
          boxShadow: "0 25px 80px 0 rgba(34, 197, 94, 0.3), inset 0 1px 0 rgba(34, 197, 94, 0.2)"
        }}
        transition="all 0.3s ease"
      >
        <Stack
          direction={{ base: "column", md: reverse ? "row-reverse" : "row" }}
          align="center"
          gap={{ base: 8, md: 16 }}
          w="full"
          justify="center"
        >
          {/* Profilbild mit Glow Effekt */}
          <VStack flexShrink={0} gap={4} position="relative">
            <Box
              w="280px"
              h="380px"
              position="relative"
              borderRadius="2xl"
              overflow="hidden"
              background="linear-gradient(135deg, rgba(34, 197, 94, 0.4), rgba(16, 185, 129, 0.3))"
              p="4px"
              boxShadow="0 20px 60px 0 rgba(34, 197, 94, 0.4), 0 0 0 1px rgba(34, 197, 94, 0.2) inset"
              _hover={{
                transform: "translateY(-4px) scale(1.02)",
                boxShadow: "0 30px 80px 0 rgba(34, 197, 94, 0.5), 0 0 0 1px rgba(34, 197, 94, 0.3) inset"
              }}
              transition="all 0.4s ease"
            >
              <Box
                w="full"
                h="full"
                borderRadius="xl"
                overflow="hidden"
                position="relative"
                _before={{
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: "linear-gradient(45deg, rgba(34, 197, 94, 0.1), transparent 50%)",
                  zIndex: 1,
                  pointerEvents: "none"
                }}
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
            
            {/* Glow Effekt unter dem Bild */}
            <Box
              position="absolute"
              bottom="-20px"
              left="50%"
              transform="translateX(-50%)"
              w="200px"
              h="40px"
              bg="rgba(34, 197, 94, 0.3)"
              filter="blur(20px)"
              borderRadius="full"
              zIndex={-1}
            />
          </VStack>

          <VStack align="start" gap={6} maxW="lg" w="full">
            <Box>
              <Text 
                color="#22c55e" 
                fontWeight="bold" 
                fontSize="sm" 
                textTransform="uppercase" 
                letterSpacing="wider"
                textShadow="0 0 10px rgba(34, 197, 94, 0.5)"
              >
                {subtitle}
              </Text>
            </Box>
            
            <Text 
              as="h2" 
              fontWeight="bold" 
              fontSize={{ base: "2xl", md: "4xl" }} 
              color="white"
              lineHeight="tight"
              textShadow="0 2px 4px rgba(0,0,0,0.3)"
            >
              {name}
            </Text>
            
            <Box 
              fontSize="md" 
              color="white" 
              lineHeight="1.7"
              bg="rgba(34, 197, 94, 0.08)"
              p={6}
              borderRadius="xl"
              border="1px solid rgba(34, 197, 94, 0.2)"
              backdropFilter="blur(10px)"
              boxShadow="0 4px 16px rgba(34, 197, 94, 0.1)"
            >
              {description}
            </Box>
            
            <VStack align="start" gap={3} mt={6} w="full">
              <Text 
                fontSize="lg" 
                fontWeight="bold" 
                color="#22c55e" 
                mb={2}
                textShadow="0 0 10px rgba(34, 197, 94, 0.3)"
              >
                Expertise & Erfolge:
              </Text>
              {checklist.map((item, idx) => (
                <HStack key={idx} gap={3} fontSize="md" align="start" w="full">
                  <Box mt={1} flexShrink={0}>
                    <GreenCheckIcon />
                  </Box>
                  <Text 
                    color="gray.100" 
                    lineHeight="1.6"
                    _hover={{ color: "white" }}
                    transition="color 0.2s ease"
                    fontSize="md"
                  >
                    {item}
                  </Text>
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
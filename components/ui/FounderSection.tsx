"use client";
import React from "react";
import { Box, Text, VStack, HStack, Stack, Image, Link } from "@chakra-ui/react";
import { SiInstagram, SiTiktok } from "react-icons/si";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { projectConfig } from "@/config";

export interface FounderSectionProps {
  image: string;
  name: React.ReactNode;
  subtitle: string;
  description: React.ReactNode;
  checklist: string[];
  highlights?: string[];
  reverse?: boolean;
}

const SimpleCheckIcon = () => (
  <Box
    w="20px"
    h="20px"
    borderRadius="full"
    bg="rgba(255, 255, 255, 0.1)"
    border="1px solid rgba(255, 255, 255, 0.2)"
    display="flex"
    alignItems="center"
    justifyContent="center"
    flexShrink={0}
  >
    <Box
      w="8px"
      h="8px"
      borderRadius="full"
      bg="white"
    />
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
  const socialLinks = [
    { 
      href: projectConfig.links.instagram, 
      icon: SiInstagram,
      label: "Instagram"
    },
    { 
      href: projectConfig.links.tiktok, 
      icon: SiTiktok,
      label: "TikTok"
    },
  ];

  return (
    <Box 
      as="section" 
      py={{ base: 12, md: 20 }} 
      px={{ base: 4, md: 8 }} 
      w="full" 
      bg="black"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Box 
        w="full" 
        maxW="7xl" 
        mx="auto"
      >
        <Stack
          direction={{ base: "column", lg: reverse ? "row-reverse" : "row" }}
          align={{ base: "center", lg: "start" }}
          justify="center"
          gap={{ base: 8, lg: 12 }}
          w="full"
        >
          {/* Profilbild - Größer */}
          <VStack flexShrink={0} gap={4} w={{ base: "full", lg: "auto" }}>
            <Box
              w={{ base: "280px", md: "360px", lg: "420px" }}
              h={{ base: "380px", md: "480px", lg: "560px" }}
              position="relative"
              borderRadius="xl"
              overflow="hidden"
              bg="rgba(255, 255, 255, 0.05)"
              border="1px solid rgba(255, 255, 255, 0.1)"
            >
              <Image
                src={image}
                alt={typeof name === 'string' ? name : 'Founder'}
                w="full"
                h="full"
                objectFit="cover"
              />
            </Box>
          </VStack>

          {/* Content */}
          <VStack align={{ base: "center", lg: "start" }} gap={6} flex={1} maxW={{ base: "full", lg: "600px" }}>
            {/* Subtitle */}
            <Text 
              color="gray.400" 
              fontWeight="medium" 
              fontSize="sm" 
              textTransform="uppercase" 
              letterSpacing="wider"
              textAlign={{ base: "center", lg: "left" }}
            >
              {subtitle}
            </Text>
            
            {/* Name */}
            <Text 
              as="h2" 
              fontWeight="bold" 
              fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }} 
              color="white"
              lineHeight="tight"
              textAlign={{ base: "center", lg: "left" }}
            >
              {name}
            </Text>
            
            {/* Description - Cleaner */}
            <Box 
              fontSize="md" 
              color="gray.300" 
              lineHeight="1.7"
              textAlign={{ base: "center", lg: "left" }}
            >
              {description}
            </Box>
            
            {/* Checklist - Simplified */}
            {checklist.length > 0 && (
              <VStack align={{ base: "start", lg: "start" }} gap={2.5} w="full" mt={2}>
                <Text 
                  fontSize="md" 
                  fontWeight="bold" 
                  color="white" 
                  mb={2}
                  textAlign={{ base: "left", lg: "left" }}
                >
                  Expertise & Erfolge:
                </Text>
                {checklist.map((item, idx) => (
                  <HStack key={idx} gap={3} align="start" w="full" justify={{ base: "flex-start", lg: "flex-start" }}>
                    <Box flexShrink={0} pt={1}>
                      <CheckCircle size={18} color="white" weight="fill" />
                    </Box>
                    <Text 
                      color="gray.300" 
                      lineHeight="1.6"
                      fontSize="sm"
                      textAlign={{ base: "left", lg: "left" }}
                    >
                      {item}
                    </Text>
                  </HStack>
                ))}
              </VStack>
            )}

            {/* Social Media Links */}
            <HStack gap={4} mt={4} justify={{ base: "center", lg: "flex-start" }}>
              {socialLinks.map(({ href, icon: Icon, label }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  _hover={{ opacity: 0.7 }}
                  transition="opacity 0.2s ease"
                >
                  <Box
                    w="44px"
                    h="44px"
                    borderRadius="full"
                    bg="rgba(255, 255, 255, 0.1)"
                    border="1px solid rgba(255, 255, 255, 0.2)"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    _hover={{
                      bg: "rgba(255, 255, 255, 0.15)",
                      borderColor: "rgba(255, 255, 255, 0.3)",
                    }}
                    transition="all 0.2s ease"
                  >
                    <Icon size={22} color="white" />
                  </Box>
                </Link>
              ))}
            </HStack>
          </VStack>
        </Stack>
      </Box>
    </Box>
  );
};

export default FounderSection;

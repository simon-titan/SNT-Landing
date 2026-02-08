"use client";

import { useState, useEffect } from "react";
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Input,
  Button,
  IconButton,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { X } from "@phosphor-icons/react";


const SNT_BLUE = "#068CEF";
const SNT_YELLOW = "rgba(251, 191, 36, 1)";

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  planUid?: string;
}


export function RegistrationModal({ isOpen, onClose, planUid = "wmjBBxmV" }: RegistrationModalProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "Vorname ist erforderlich";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Nachname ist erforderlich";
    }

    if (!formData.email.trim()) {
      newErrors.email = "E-Mail ist erforderlich";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Ungültige E-Mail-Adresse";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Registrierung direkt über unsere API durchführen (kein Popup)
      const response = await fetch("/api/register/free", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Registrierung fehlgeschlagen");
      }

      // E-Mail in localStorage speichern für Thank-You-Seite
      localStorage.setItem('sntRegistrationEmail', formData.email);
      
      // Erfolgreich registriert - weiterleiten zur Thank-You-Seite
      const thankYouUrl = `/thank-you-3?email=${encodeURIComponent(formData.email)}`;
      window.location.href = thankYouUrl;
    } catch (error: any) {
      console.error("Fehler bei der Registrierung:", error);
      setErrors({
        submit: error.message || "Ein Fehler ist aufgetreten. Bitte versuche es erneut.",
      });
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Box
      position="fixed"
      inset={0}
      zIndex={9999}
      bg="rgba(0, 0, 0, 0.6)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={{ base: 4, md: 0 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <Box
        bg="white"
        borderRadius="xl"
        w="full"
        maxW={{ base: "full", md: "500px", lg: "600px" }}
        maxH="90vh"
        overflow="hidden"
        boxShadow="0 20px 60px rgba(0, 0, 0, 0.3)"
        position="relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress Bar */}
        <Box
          bg={SNT_BLUE}
          position="relative"
          px={6}
          py={5}
          boxShadow="0 4px 20px rgba(6, 140, 239, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)"
          overflow="hidden"
        >
          {/* Subtle background animation */}
          <Box
            position="absolute"
            inset={0}
            bg="linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.05) 50%, transparent 100%)"
            css={{
              animation: `${keyframes({
                "0%": { transform: "translateX(-100%)" },
                "100%": { transform: "translateX(200%)" },
              })} 4s linear infinite`,
            }}
          />
          
          <HStack justify="space-between" align="center" mb={4} position="relative" zIndex={1}>
            <Text 
              fontSize={{ base: "sm", md: "md" }} 
              fontWeight="bold" 
              color="white" 
              letterSpacing="0.5px"
            >
              Letzter Schritt: Registrierung abschließen
            </Text>
            <IconButton
              aria-label="Schließen"
              onClick={onClose}
              variant="ghost"
              color="white"
              size="sm"
              _hover={{ bg: "rgba(255, 255, 255, 0.2)" }}
            >
              <X size={20} weight="bold" />
            </IconButton>
          </HStack>
          
          <Box
            position="relative"
            w="full"
            h="10px"
            bg="rgba(255, 255, 255, 0.15)"
            borderRadius="full"
            overflow="hidden"
            boxShadow="inset 0 2px 4px rgba(0, 0, 0, 0.15)"
            zIndex={1}
          >
            {/* Progress Fill with smooth glow */}
            <Box
              h="100%"
              w="75%"
              bg="white"
              borderRadius="full"
              position="relative"
              boxShadow="0 0 10px rgba(255, 255, 255, 0.6)"
              transition="width 0.3s ease"
            >
              {/* Subtle shine effect */}
              <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                bg="linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%)"
                borderRadius="full"
                css={{
                  animation: `${keyframes({
                    "0%": { transform: "translateX(-100%)" },
                    "100%": { transform: "translateX(200%)" },
                  })} 2.5s ease-in-out infinite`,
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Content */}
        <VStack gap={6} p={{ base: 6, md: 8 }} align="stretch">
          {/* Title */}
          <VStack gap={2} align="start">
            <Heading as="h2" size="xl" color="black" fontWeight="bold" lineHeight="1.2">
              Letzter Schritt für den Zugang zum{" "}
              <Box
                as="span"
                px="2"
                borderRadius="xs"
                bg={`linear-gradient(90deg, ${SNT_YELLOW} 0%, rgba(251, 191, 36,0.22) 85%, rgba(251, 191, 36,0) 100%)`}
                display="inline-block"
              >
                Bootcamp
              </Box>
              ...
            </Heading>
           
          </VStack>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <VStack gap={5} align="stretch">
              {/* First Name */}
              <VStack align="start" gap={1}>
                <HStack gap={1}>
                  <Text fontSize="sm" fontWeight="medium" color="black">
                    Vorname
                  </Text>
                  <Text fontSize="sm" color="red.500">
                    *
                  </Text>
                </HStack>
                <Input
                  type="text"
                  placeholder="Gib deinen Vornamen ein..."
                  value={formData.firstName}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData((prev) => ({ ...prev, firstName: value }));
                    if (errors.firstName) {
                      setErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors.firstName;
                        return newErrors;
                      });
                    }
                  }}
                  borderColor={errors.firstName ? "red.500" : "gray.300"}
                  color="black"
                  _focus={{ borderColor: SNT_BLUE, boxShadow: `0 0 0 1px ${SNT_BLUE}` }}
                  borderRadius="md"
                  size="lg"
                />
                {errors.firstName && (
                  <Text fontSize="xs" color="red.500">
                    {errors.firstName}
                  </Text>
                )}
              </VStack>

              {/* Last Name */}
              <VStack align="start" gap={1}>
                <HStack gap={1}>
                  <Text fontSize="sm" fontWeight="medium" color="black">
                    Nachname
                  </Text>
                  <Text fontSize="sm" color="red.500">
                    *
                  </Text>
                </HStack>
                <Input
                  type="text"
                  placeholder="Gib deinen Nachnamen ein..."
                  value={formData.lastName}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData((prev) => ({ ...prev, lastName: value }));
                    if (errors.lastName) {
                      setErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors.lastName;
                        return newErrors;
                      });
                    }
                  }}
                  borderColor={errors.lastName ? "red.500" : "gray.300"}
                  color="black"
                  _focus={{ borderColor: SNT_BLUE, boxShadow: `0 0 0 1px ${SNT_BLUE}` }}
                  borderRadius="md"
                  size="lg"
                />
                {errors.lastName && (
                  <Text fontSize="xs" color="red.500">
                    {errors.lastName}
                  </Text>
                )}
              </VStack>

              {/* Email */}
              <VStack align="start" gap={1}>
                <HStack gap={1}>
                  <Text fontSize="sm" fontWeight="medium" color="black">
                    Email
                  </Text>
                  <Text fontSize="sm" color="red.500">
                    *
                  </Text>
                </HStack>
                <Input
                  type="email"
                  placeholder="Gib deine E-Mail-Adresse ein..."
                  value={formData.email}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData((prev) => ({ ...prev, email: value }));
                    if (errors.email) {
                      setErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors.email;
                        return newErrors;
                      });
                    }
                  }}
                  borderColor={errors.email ? "red.500" : "gray.300"}
                  color="black"
                  _focus={{ borderColor: SNT_BLUE, boxShadow: `0 0 0 1px ${SNT_BLUE}` }}
                  borderRadius="md"
                  size="lg"
                />
                {errors.email && (
                  <Text fontSize="xs" color="red.500">
                    {errors.email}
                  </Text>
                )}
              </VStack>

              {/* Submit Button */}
              <Button
                type="submit"
                w="full"
                bg={SNT_BLUE}
                color="white"
                size="lg"
                fontWeight="bold"
                borderRadius="md"
                _hover={{ bg: "#0572c2" }}
                _active={{ bg: "#0465b8" }}
                loading={isSubmitting}
                loadingText="Wird übermittelt..."
                mt={2}
              >
                Registrierung abschließen 🚀
              </Button>

              {errors.submit && (
                <Text fontSize="sm" color="red.500" textAlign="center">
                  {errors.submit}
                </Text>
              )}
            </VStack>
          </form>
        </VStack>
      </Box>
    </Box>
  );
}


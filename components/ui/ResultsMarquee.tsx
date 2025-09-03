"use client";
import React, { useState } from "react";
import { Box, Text, VStack, Image } from "@chakra-ui/react";
import { DialogRoot, DialogContent, DialogHeader, DialogTitle, DialogBody } from "@/components/ui/dialog";

const resultsData = [
  {
    image: "500$ Profit am frühen morgen.png",
    title: "500$ Profit am frühen Morgen"
  },
  {
    image: "Ahmad besteht seine TopStep Challenge.png", 
    title: "Ahmad besteht seine TopStep Challenge"
  },
  {
    image: "Alessio lässt sich 500$ auszahlen.png",
    title: "Alessio lässt sich 500$ auszahlen"
  },
  {
    image: "Arben besteht seine Challenge.png",
    title: "Arben besteht seine Challenge"
  },
  {
    image: "Der nächste der seine Challenge bestanden hat.png",
    title: "Der nächste der seine Challenge bestanden hat"
  },
  {
    image: "Dominik macht in einem Monat 3,471.26$ Profit.png",
    title: "Dominik macht in einem Monat 3,471.26$ Profit"
  },
  {
    image: "Member passed seinen Funded account.png",
    title: "Member passed seinen Funded Account"
  },
  {
    image: "Teilnehmer Funded sein account bei TopStep.png",
    title: "Teilnehmer funded sein Account bei TopStep"
  },
  {
    image: "Teilnehmer macht 1500$ mit einem Trade.png",
    title: "Teilnehmer macht 1500$ mit einem Trade"
  },
  {
    image: "Tiago besteht seine Challenge innerhalb 3 Tagen.png",
    title: "Tiago besteht seine Challenge innerhalb 3 Tagen"
  },
  {
    image: "Tobias zahlt sich 727,87$ aus.png",
    title: "Tobias zahlt sich 727,87$ aus"
  }
];

const ResultCard = ({ image, title }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Box
        minW={{ base: "280px", md: "320px" }}
        maxW={{ base: "280px", md: "320px" }}
        minH={{ base: "200px", md: "220px" }}
        maxH={{ base: "200px", md: "220px" }}
        bg="rgba(10, 14, 10, 0.85)"
        backdropFilter="blur(16px)"
        borderRadius="xl"
        boxShadow="0 8px 32px 0 rgba(34, 197, 94, 0.25), inset 0 1px 0 rgba(34, 197, 94, 0.2)"
        border="1px solid rgba(34, 197, 94, 0.3)"
        p={3}
        mx={2}
        flexShrink={0}
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        color="white"
        position="relative"
        cursor="pointer"
        onClick={() => setIsDialogOpen(true)}
        _hover={{
          transform: "translateY(-4px)",
          boxShadow: "0 12px 40px 0 rgba(34, 197, 94, 0.35), inset 0 1px 0 rgba(34, 197, 94, 0.3)"
        }}
        transition="all 0.3s ease"
      >
        {/* Bild Container */}
        <Box 
          flex={1}
          borderRadius="lg"
          overflow="hidden"
          bg="gray.800"
          position="relative"
          mb={3}
        >
          <Image
            src={`/RESULTS/${image}`}
            alt={title}
            w="full"
            h="full"
            objectFit="cover"
            loading="lazy"
          />
          {/* Overlay Gradient */}
          <Box
            position="absolute"
            bottom={0}
            left={0}
            right={0}
            h="50%"
            background="linear-gradient(to top, rgba(10, 14, 10, 0.8), transparent)"
            pointerEvents="none"
          />
        </Box>
        
        {/* Titel */}
        <Box>
          <Text 
            fontSize="sm" 
            fontWeight="bold" 
            color="#22c55e"
            textAlign="center"
            lineHeight="1.3"
            textShadow="0 0 8px rgba(34, 197, 94, 0.4)"
          >
            {title}
          </Text>
        </Box>
      </Box>

      {/* Pop-Up Dialog */}
      <DialogRoot open={isDialogOpen} onOpenChange={(details) => setIsDialogOpen(details.open)}>
        <DialogContent
          bg="rgba(5, 10, 5, 0.98)"
          backdropFilter="blur(24px)"
          border="2px solid rgba(34, 197, 94, 0.4)"
          borderRadius="2xl"
          boxShadow="0 25px 80px 0 rgba(34, 197, 94, 0.4), inset 0 1px 0 rgba(34, 197, 94, 0.2)"
          maxW="4xl"
          w={{ base: "95%", md: "800px" }}
          color="white"
          position="relative"
          overflow="hidden"
          _before={{
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "radial-gradient(at 30% 30%, rgba(34, 197, 94, 0.1) 0px, transparent 70%)",
            pointerEvents: "none"
          }}
        >
          {/* Close Button */}
          <Box
            position="absolute"
            top={3}
            right={3}
            zIndex={1000}
            cursor="pointer"
            onClick={() => setIsDialogOpen(false)}
            w={10}
            h={10}
            bg="rgba(239, 68, 68, 0.15)"
            _hover={{
              bg: "rgba(239, 68, 68, 0.25)",
              transform: "scale(1.1)"
            }}
            borderRadius="full"
            display="flex"
            alignItems="center"
            justifyContent="center"
            border="1px solid rgba(239, 68, 68, 0.3)"
            boxShadow="0 4px 12px rgba(239, 68, 68, 0.2)"
            transition="all 0.2s ease"
          >
            <Text color="red.300" fontSize="lg" fontWeight="bold">✕</Text>
          </Box>

          <DialogHeader position="relative" zIndex={1}>
            <DialogTitle 
              color="#22c55e" 
              fontSize="2xl" 
              fontWeight="bold"
              textShadow="0 0 15px rgba(34, 197, 94, 0.5)"
              mb={4}
              textAlign="center"
            >
              {title}
            </DialogTitle>
          </DialogHeader>
          
          <DialogBody position="relative" zIndex={1} pt={2}>
            <Box
              w="full"
              display="flex"
              justifyContent="center"
              alignItems="center"
              borderRadius="xl"
              overflow="hidden"
              bg="rgba(34, 197, 94, 0.05)"
              border="1px solid rgba(34, 197, 94, 0.15)"
              p={2}
            >
              <Image
                src={`/RESULTS/${image}`}
                alt={title}
                maxW="100%"
                maxH="70vh"
                objectFit="contain"
                borderRadius="lg"
              />
            </Box>
          </DialogBody>
        </DialogContent>
      </DialogRoot>
    </>
  );
};

export const ResultsMarquee = () => {
  // Dupliziere das Array für nahtlosen Loop (nach rechts)
  const marqueeResults = [...resultsData, ...resultsData];
  
  return (
    <Box
      w="100%"
      overflow="hidden"
      position="relative"
      py={{ base: 8, md: 12 }}
      bg="linear-gradient(135deg, rgba(10, 14, 10, 0.95), rgba(0, 0, 0, 0.98))"
    >
      <style>{`
        @keyframes marqueeRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
        .marquee-track-right {
          display: flex;
          width: 200%;
          animation: marqueeRight 45s linear infinite;
        }
        .marquee-paused-right {
          animation-play-state: paused !important;
        }
      `}</style>
      
      <VStack gap={4} align="center" w="full">
        <Text 
          fontWeight="bold" 
          color="#22c55e" 
          fontSize={{ base: "xl", md: "2xl" }} 
          textAlign="center" 
          w="full"
          textShadow="0 0 15px rgba(34, 197, 94, 0.5)"
          mb={2}
        >
          🏆 Erfolge unserer Community
        </Text>
        
        <Box
          w="100%"
          minH={{ base: "180px", md: "200px" }}
          overflow="hidden"
          position="relative"
          onMouseEnter={e => {
            const track = e.currentTarget.querySelector('.marquee-track-right');
            if (track) track.classList.add('marquee-paused-right');
          }}
          onMouseLeave={e => {
            const track = e.currentTarget.querySelector('.marquee-track-right');
            if (track) track.classList.remove('marquee-paused-right');
          }}
        >
          <Box className="marquee-track-right">
            {marqueeResults.map((result, idx) => (
              <ResultCard key={idx} {...result} />
            ))}
          </Box>
        </Box>
      </VStack>
    </Box>
  );
};

export default ResultsMarquee;

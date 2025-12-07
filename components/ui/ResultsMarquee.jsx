"use client";
import React, { useState } from "react";
import { Box, Text, VStack, Image, Heading } from "@chakra-ui/react";
import { DialogRoot, DialogContent, DialogHeader, DialogTitle, DialogBody } from "@/components/ui/dialog";
const SNT_BLUE = "#068CEF";
const SNT_YELLOW = "rgba(251, 191, 36, 1)";
const highlightText = (text) => {
    const regex = /(\d[\d,.]*\$|Profit|besteht|bestanden|Challenge|funded|Funded|TopStep|passed)/gi;
    const parts = text.split(regex);
    return (<>
            {parts.map((part, i) => {
            if (part && part.match(regex)) {
                return (<Box as="span" key={i} px="1" borderRadius="xs" bg={`linear-gradient(90deg, ${SNT_YELLOW} 0%, rgba(251, 191, 36,0.4) 85%, rgba(251, 191, 36,0) 100%)`}>
                            {part}
                        </Box>);
            }
            return part;
        })}
        </>);
};
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
    return (<>
      <Box minW={{ base: "280px", md: "320px" }} maxW={{ base: "280px", md: "320px" }} minH={{ base: "260px", md: "280px" }} maxH={{ base: "260px", md: "280px" }} bg="rgba(255, 255, 255, 0.6)" backdropFilter="blur(12px) saturate(180%)" borderRadius="xl" boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)" border="1px solid" borderColor="rgba(6, 140, 239, 0.4)" p={4} mx={2} flexShrink={0} display="flex" flexDirection="column" color="black" position="relative" cursor="pointer" onClick={() => setIsDialogOpen(true)} _hover={{
            transform: "translateY(-4px)",
            boxShadow: "0 8px 12px rgba(0, 0, 0, 0.15)"
        }} transition="all 0.3s ease">
        {/* Bild Container */}
        <Box h="180px" borderRadius="lg" overflow="hidden" bg="gray.200">
          <Image src={`/RESULTS/${image}`} alt={title} w="full" h="full" objectFit="cover" loading="lazy"/>
        </Box>
        
        {/* Titel */}
        <VStack flex={1} justifyContent="center" pt={3}>
          <Text fontSize="sm" color="black" fontWeight="medium" textAlign="center" lineHeight="1.3">
            {highlightText(title)}
          </Text>
        </VStack>
      </Box>

      {/* Pop-Up Dialog */}
      <DialogRoot open={isDialogOpen} onOpenChange={(details) => setIsDialogOpen(details.open)}>
        <DialogContent bg="rgba(255, 255, 255, 0.9)" backdropFilter="blur(16px)" border="1px solid" borderColor="rgba(6, 140, 239, 0.4)" borderRadius="2xl" boxShadow="0 10px 30px rgba(0, 0, 0, 0.1)" maxW="4xl" w={{ base: "95%", md: "800px" }} color="black" position="relative" overflow="hidden">
          {/* Close Button */}
          <Box position="absolute" top={3} right={3} zIndex={1000} cursor="pointer" onClick={() => setIsDialogOpen(false)} w={8} h={8} bg="rgba(0, 0, 0, 0.05)" _hover={{
            bg: "rgba(0, 0, 0, 0.1)",
        }} borderRadius="full" display="flex" alignItems="center" justifyContent="center" border="1px solid rgba(0, 0, 0, 0.1)" transition="all 0.2s ease">
            <Text color="gray.600" fontSize="sm" fontWeight="bold">✕</Text>
          </Box>

          <DialogHeader position="relative" zIndex={1}>
            <DialogTitle color={SNT_BLUE} fontSize="xl" fontWeight="bold" mb={4} textAlign="center">
              {title}
            </DialogTitle>
          </DialogHeader>
          
          <DialogBody position="relative" zIndex={1} pt={2}>
            <Box w="full" display="flex" justifyContent="center" alignItems="center" borderRadius="xl" overflow="hidden" bg="gray.100" border="1px solid" borderColor="gray.200" p={2}>
              <Image src={`/RESULTS/${image}`} alt={title} maxW="100%" maxH="70vh" objectFit="contain" borderRadius="lg"/>
            </Box>
          </DialogBody>
        </DialogContent>
      </DialogRoot>
    </>);
};
export const ResultsMarquee = () => {
    // Dupliziere das Array für nahtlosen Loop (nach rechts)
    const marqueeResults = [...resultsData, ...resultsData];
    return (<Box w="100%" overflow="hidden" position="relative" py={{ base: 8, md: 12 }} pt="5%" bg="white">
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
        <Heading as="h2" size="xl" color="black" textAlign="center" px={4}>
          Erziele Erfolge wie unsere{" "}
          <Box as="span" color="black" px="1.5" borderRadius="xs" bg={`linear-gradient(90deg, ${SNT_BLUE} 0%, rgba(6, 140, 239, 0.22) 85%, rgba(6, 140, 239, 0) 100%)`}>
            Teilnehmer...
          </Box>
        </Heading>
        
        <Box w="100%" minH={{ base: "180px", md: "200px" }} overflow="hidden" position="relative" onMouseEnter={e => {
            const track = e.currentTarget.querySelector('.marquee-track-right');
            if (track)
                track.classList.add('marquee-paused-right');
        }} onMouseLeave={e => {
            const track = e.currentTarget.querySelector('.marquee-track-right');
            if (track)
                track.classList.remove('marquee-paused-right');
        }}>
          <Box className="marquee-track-right">
            {marqueeResults.map((result, idx) => (<ResultCard key={idx} {...result}/>))}
          </Box>
        </Box>
      </VStack>
    </Box>);
};
export default ResultsMarquee;

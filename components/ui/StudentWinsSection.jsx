"use client";
import React, { useState } from "react";
import { Box, Text, VStack, Button, Image, SimpleGrid } from "@chakra-ui/react";
import { DialogRoot, DialogContent, DialogBody, DialogCloseTrigger } from "@/components/ui/dialog";
import { CustomVerticalVideoPlayer } from "@/components/ui/CustomVerticalVideoPlayer";
// @ts-ignore
const resultsImages = [
    "Der nächste der seine Challenge bestanden hat.png",
    "Arben besteht seine Challenge.png",
    "Teilnehmer Funded sein account bei TopStep.png",
    "Dominik macht in einem Monat 3,471.26$ Profit.png",
    "Tobias zahlt sich 727,87$ aus.png",
    "Ahmad besteht seine TopStep Challenge.png",
    "500$ Profit am frühen morgen.png",
    "Member passed seinen Funded account.png",
    "Tiago besteht seine Challenge innerhalb 3 Tagen.png",
    "Alessio lässt sich 500$ auszahlen.png",
    "Teilnehmer macht 1500$ mit einem Trade.png",
];
export const StudentWinsSection = () => {
    const [selectedImg, setSelectedImg] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const handleImgClick = (img) => {
        setSelectedImg(img);
        setIsOpen(true);
    };
    const handleClose = () => {
        setIsOpen(false);
        setSelectedImg(null);
    };
    // Demo-Videos für die obere Sektion
    const demoVideos = [
        { src: "/RESULTS/6000$ in einer Woche mit unserer NEFS trading Strategie.mp4", title: "6000$ in einer Woche mit unserer NEFS trading Strategie" },
        { src: "/RESULTS/1600$ Profit mit einem Trade mit unserer eigenen NEFS Trading Strategie.mp4", title: "1600$ Profit mit einem Trade mit unserer eigenen NEFS Trading Strategie" },
        { src: "/RESULTS/Alltag & Livetrade mit Emre.mp4", title: "Alltag & Livetrade mit Emre" },
    ];
    // Hilfsfunktion: Bilder in 4er-Gruppen aufteilen
    function chunkArray(arr, size) {
        const res = [];
        for (let i = 0; i < arr.length; i += size) {
            res.push(arr.slice(i, i + size));
        }
        return res;
    }
    const imageBlocks = chunkArray(resultsImages, 4);
    return (<Box as="section" py={{ base: 12, md: 24 }} px={{ base: 6, md: 12 }} w="full" bg="linear-gradient(135deg, rgba(0, 0, 0, 0.95), rgba(10, 14, 10, 0.98))" position="relative" _before={{
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "radial-gradient(at 50% 0%, rgba(34, 197, 94, 0.12) 0px, transparent 50%), radial-gradient(at 0% 100%, rgba(16, 185, 129, 0.08) 0px, transparent 50%)",
            pointerEvents: "none"
        }}>
      <VStack gap={6} align="center" mb={12} w="full" position="relative" zIndex={1}>
        <Text color="#22c55e" fontWeight="bold" fontSize="sm" textTransform="uppercase" letterSpacing="wider" textShadow="0 0 10px rgba(34, 197, 94, 0.5)">
          Erfolge unserer Teilnehmer
        </Text>
        <Text as="h2" fontWeight="bold" fontSize={{ base: "2xl", md: "4xl" }} textAlign="center" color="white" textShadow="0 2px 4px rgba(0,0,0,0.3)" lineHeight="tight">
          Sieh dein zukünftiges Potenzial als Trader
        </Text>
      </VStack>
      <Box w="full" display="flex" justifyContent="center" position="relative" zIndex={1}>
        <Box w="100%" maxW="1200px" maxH="900px" overflowY="auto" pb={6} bg="rgba(10, 14, 10, 0.4)" backdropFilter="blur(12px)" borderRadius="2xl" border="1px solid rgba(34, 197, 94, 0.2)" boxShadow="0 20px 60px 0 rgba(34, 197, 94, 0.15)" p={6}>
          <VStack gap={8} w="full" align="stretch">
            {imageBlocks.map((block, idx) => (<Box key={idx} as="section">
                {/* Mobile Layout: Always video first, then images below */}
                <VStack gap={6} display={{ base: "flex", md: "none" }} align="center">
                  {demoVideos[idx] && (<Box flexShrink={0}>
                      <CustomVerticalVideoPlayer src={demoVideos[idx].src} title={demoVideos[idx].title}/>
                    </Box>)}
                  <SimpleGrid columns={2} gap={4} minW="340px" maxW="580px">
                    {block.map((img, i) => (<Box key={img} bg="white" borderRadius="lg" boxShadow="sm" border="2px solid #e5e7eb" minW="160px" maxW="260px" overflow="hidden" p={0} cursor="pointer" transition="box-shadow 0.2s" _hover={{ boxShadow: "lg" }} onClick={() => handleImgClick(img)}>
                        <Box w="full" h="120px" bg="#f1f5f9" position="relative">
                          <Image src={`/RESULTS/${img}`} alt={img} w="full" h="120px" objectFit="cover"/>
                        </Box>
                        <Text fontWeight="normal" fontSize="md" p={3} textAlign="center">
                          {img.replace(/\.[^/.]+$/, "")}
                        </Text>
                      </Box>))}
                  </SimpleGrid>
                </VStack>

                {/* Desktop Layout: Alternating left/right video position */}
                <Box display={{ base: "none", md: "flex" }} gap={6} alignItems="start" justifyContent="center">
                  {idx % 2 === 0 ? (<>
                      <Box flexShrink={0}>
                        {demoVideos[idx] && (<CustomVerticalVideoPlayer src={demoVideos[idx].src} title={demoVideos[idx].title}/>)}
                      </Box>
                      <SimpleGrid columns={2} gap={4} minW="340px" maxW="580px">
                        {block.map((img, i) => (<Box key={img} bg="white" borderRadius="lg" boxShadow="sm" border="2px solid #e5e7eb" minW="160px" maxW="260px" overflow="hidden" p={0} cursor="pointer" transition="box-shadow 0.2s" _hover={{ boxShadow: "lg" }} onClick={() => handleImgClick(img)}>
                            <Box w="full" h="120px" bg="#f1f5f9" position="relative">
                              <Image src={`/RESULTS/${img}`} alt={img} w="full" h="120px" objectFit="cover"/>
                            </Box>
                            <Text fontWeight="normal" fontSize="md" p={3} textAlign="center">
                              {img.replace(/\.[^/.]+$/, "")}
                            </Text>
                          </Box>))}
                      </SimpleGrid>
                    </>) : (<>
                      <SimpleGrid columns={2} gap={4} minW="340px" maxW="580px">
                        {block.map((img, i) => (<Box key={img} bg="white" borderRadius="lg" boxShadow="sm" border="2px solid #e5e7eb" minW="160px" maxW="260px" overflow="hidden" p={0} cursor="pointer" transition="box-shadow 0.2s" _hover={{ boxShadow: "lg" }} onClick={() => handleImgClick(img)}>
                            <Box w="full" h="120px" bg="#f1f5f9" position="relative">
                              <Image src={`/RESULTS/${img}`} alt={img} w="full" h="120px" objectFit="cover"/>
                            </Box>
                            <Text fontWeight="normal" fontSize="md" p={3} textAlign="center">
                              {img.replace(/\.[^/.]+$/, "")}
                            </Text>
                          </Box>))}
                      </SimpleGrid>
                      <Box flexShrink={0}>
                        {demoVideos[idx] && (<CustomVerticalVideoPlayer src={demoVideos[idx].src} title={demoVideos[idx].title}/>)}
                      </Box>
                    </>)}
                </Box>
              </Box>))}
          </VStack>
        </Box>
      </Box>
      <DialogRoot open={isOpen} onOpenChange={(details) => { if (!details.open)
        handleClose(); }}>
        <DialogContent>
          <DialogCloseTrigger asChild>
            <Button position="absolute" top={4} right={4} zIndex={1000} colorScheme="gray" size="sm" onClick={handleClose}>
              Schließen
            </Button>
          </DialogCloseTrigger>
          <DialogBody style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 0 }}>
            {selectedImg && (<Image src={`/RESULTS/${selectedImg}`} alt={selectedImg} maxH="80vh" maxW="100%" m="auto" onClick={handleClose} cursor="pointer"/>)}
          </DialogBody>
        </DialogContent>
      </DialogRoot>
      
    </Box>);
};
export default StudentWinsSection;

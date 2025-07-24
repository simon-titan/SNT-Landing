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
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const handleImgClick = (img: string) => {
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
  function chunkArray<T>(arr: T[], size: number): T[][] {
    const res: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
      res.push(arr.slice(i, i + size));
    }
    return res;
  }

  const imageBlocks = chunkArray(resultsImages, 4);

  return (
    <Box as="section" py={{ base: 10, md: 20 }} w="full" bg="white">
      <VStack gap={4} align="center" mb={8} w="full">
        <Text color="#fb7185" fontWeight="bold" fontSize="sm" textTransform="uppercase">
        Erfolge unserer Teilnehmer
        </Text>
        <Text as="h2" fontWeight="bold" fontSize={{ base: "2xl", md: "4xl" }} textAlign="center">
          Sieh dein zukünftiges Potenzial als Trader
        </Text>
      </VStack>
      <Box w="full" display="flex" justifyContent="center">
        <Box w="100%" maxW="1100px" maxH="900px" overflowY="auto" pb={6}>
          <VStack gap={8} w="full" align="stretch">
            {imageBlocks.map((block, idx) => (
              <Box key={idx} as="section" display={{ base: "block", md: "flex" }} gap={6} alignItems="start" justifyContent="center">
                {idx % 2 === 0 ? (
                  <>
                    <Box flexShrink={0} mb={{ base: 6, md: 0 }}>
                      {demoVideos[idx] && (
                        <CustomVerticalVideoPlayer src={demoVideos[idx].src} title={demoVideos[idx].title} />
                      )}
                    </Box>
                    <SimpleGrid columns={2} gap={4} minW="340px" maxW="580px">
                      {block.map((img, i) => (
                        <Box
                          key={img}
                          bg="white"
                          borderRadius="lg"
                          boxShadow="sm"
                          border="2px solid #e5e7eb"
                          minW="160px"
                          maxW="260px"
                          overflow="hidden"
                          p={0}
                          cursor="pointer"
                          transition="box-shadow 0.2s"
                          _hover={{ boxShadow: "lg" }}
                          onClick={() => handleImgClick(img)}
                        >
                          <Box w="full" h="120px" bg="#f1f5f9" position="relative">
                            <Image src={`/RESULTS/${img}`} alt={img} w="full" h="120px" objectFit="cover" />
                          </Box>
                          <Text fontWeight="normal" fontSize="md" p={3} textAlign="center">
                            {img.replace(/\.[^/.]+$/, "")}
                          </Text>
                        </Box>
                      ))}
                    </SimpleGrid>
                  </>
                ) : (
                  <>
                    <SimpleGrid columns={2} gap={4} minW="340px" maxW="580px">
                      {block.map((img, i) => (
                        <Box
                          key={img}
                          bg="white"
                          borderRadius="lg"
                          boxShadow="sm"
                          border="2px solid #e5e7eb"
                          minW="160px"
                          maxW="260px"
                          overflow="hidden"
                          p={0}
                          cursor="pointer"
                          transition="box-shadow 0.2s"
                          _hover={{ boxShadow: "lg" }}
                          onClick={() => handleImgClick(img)}
                        >
                          <Box w="full" h="120px" bg="#f1f5f9" position="relative">
                            <Image src={`/RESULTS/${img}`} alt={img} w="full" h="120px" objectFit="cover" />
                          </Box>
                          <Text fontWeight="normal" fontSize="md" p={3} textAlign="center">
                            {img.replace(/\.[^/.]+$/, "")}
                          </Text>
                        </Box>
                      ))}
                    </SimpleGrid>
                    <Box flexShrink={0} mb={{ base: 6, md: 0 }}>
                      {demoVideos[idx] && (
                        <CustomVerticalVideoPlayer src={demoVideos[idx].src} title={demoVideos[idx].title} />
                      )}
                    </Box>
                  </>
                )}
              </Box>
            ))}
          </VStack>
        </Box>
      </Box>
      <DialogRoot open={isOpen} onOpenChange={open => { if (!open) handleClose(); }}>
        <DialogContent>
          <DialogCloseTrigger>
            <Button position="absolute" top={2} right={2} zIndex={10} colorScheme="gray" size="sm">Schließen</Button>
          </DialogCloseTrigger>
          <DialogBody style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 0 }}>
            {selectedImg && (
              <Image src={`/RESULTS/${selectedImg}`} alt={selectedImg} maxH="80vh" maxW="100%" m="auto" />
            )}
          </DialogBody>
        </DialogContent>
      </DialogRoot>
      <Box display="flex" justifyContent="center" mt={6}>
        <Button colorScheme="blue" size="lg" fontWeight="bold">
          Alle Studentenerfolge ansehen
        </Button>
      </Box>
    </Box>
  );
};

export default StudentWinsSection; 
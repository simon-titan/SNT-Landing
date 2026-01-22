"use client";
import { Box } from "@chakra-ui/react";

interface SimpleVimeoPlayerProps {
  videoId: string;
  autoplay?: boolean;
  muted?: boolean;
}

export const SimpleVimeoPlayer: React.FC<SimpleVimeoPlayerProps> = ({ 
  videoId, 
  autoplay = true, 
  muted = true 
}) => {
  return (
    <Box
      width="100%"
      height="100%"
      position="relative"
      overflow="hidden"
      borderRadius="lg"
      bg="black"
    >
      <iframe
        src={`https://player.vimeo.com/video/${videoId}?autoplay=${autoplay ? 1 : 0}&muted=${muted ? 1 : 0}&loop=1&title=0&byline=0&portrait=0&transparent=0&playsinline=1`}
        width="100%"
        height="100%"
        style={{ 
          border: 0, 
          display: "block",
          position: "absolute",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%"
        }}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        title="Vimeo Video"
      />
    </Box>
  );
};
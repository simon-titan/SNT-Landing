"use client";
import { useEffect, useRef, useState } from "react";
import { Button, Box } from "@chakra-ui/react";
import { HiVolumeUp, HiVolumeOff } from "react-icons/hi";
import { MdReplay } from "react-icons/md";
// @ts-ignore
import Player from "@vimeo/player";

interface BrandedVimeoPlayerProps {
  videoId: string;
}

export const BrandedVimeoPlayer: React.FC<BrandedVimeoPlayerProps> = ({ videoId }) => {
  const [playing, setPlaying] = useState(false);
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [muted, setMuted] = useState(true);

  const handleRestart = () => {
    if (!playerRef.current) return;
    playerRef.current.setCurrentTime(0).then(() => playerRef.current.play());
  };

  useEffect(() => {
    if (!containerRef.current) return;
    if (playerRef.current) return;
    const player = new Player(containerRef.current.querySelector("iframe"));
    player.on("play", () => setPlaying(true));
    player.on("pause", () => setPlaying(false));
    player.on("volumechange", (data: any) => setMuted(data.volume === 0));
    playerRef.current = player;
    player.setVolume(0);
    player.play().catch(() => {});
    return () => {
      player.unload();
    };
  }, []);

  const handlePlayPause = () => {
    if (!playerRef.current) return;
    if (playing) {
      playerRef.current.pause();
    } else {
      playerRef.current.play();
    }
  };

  const handleMuteToggle = () => {
    if (!playerRef.current) return;
    if (muted) {
      playerRef.current.setVolume(1);
      setMuted(false);
    } else {
      playerRef.current.setVolume(0);
      setMuted(true);
    }
  };

  return (
    <Box
      width="100%"
      height="100%"
      position="relative"
      p={0}
      m={0}
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <iframe
        src={`https://player.vimeo.com/video/${videoId}?controls=0&background=1&autoplay=1&muted=1&loop=1&title=0&byline=0&portrait=0`}
        width="100%"
        height="100%"
        style={{ border: 0, display: "block" }}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        title="Vimeo Video"
      />
      {/* Restart-Button oben links */}
      <Button
        onClick={handleRestart}
        position="absolute"
        top={3}
        left={3}
        zIndex={3}
        bg="rgba(0,0,0,0.6)"
        color="#fff"
        borderRadius="full"
        size="md"
        px={2}
        py={2}
        _hover={{ bg: "rgba(0,0,0,0.85)" }}
        aria-label="Video neu starten"
      >
        <MdReplay size={24} />
      </Button>
      {/* Lautstärke-Button oben rechts */}
      <Button
        onClick={handleMuteToggle}
        position="absolute"
        top={3}
        right={3}
        zIndex={3}
        bg="rgba(0,0,0,0.6)"
        color="#fff"
        borderRadius="full"
        size="md"
        px={2}
        py={2}
        _hover={{ bg: "rgba(0,0,0,0.85)" }}
        aria-label={muted ? "Ton an" : "Ton aus"}
      >
        {muted ? <HiVolumeOff size={24} /> : <HiVolumeUp size={24} />}
      </Button>
      {isHovered && (
        <Button
          onClick={handlePlayPause}
          position="absolute"
          left="50%"
          top="50%"
          transform="translate(-50%, -50%)"
          size="lg"
          borderRadius="full"
          bg="rgba(0,0,0,0.7)"
          color="#fff"
          fontSize="4xl"
          px={8}
          py={8}
          zIndex={2}
          _hover={{ bg: "rgba(0,0,0,0.85)" }}
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? (
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><rect x="12" y="12" width="8" height="24" rx="3" fill="#fff"/><rect x="28" y="12" width="8" height="24" rx="3" fill="#fff"/></svg>
          ) : (
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><path d="M16 12V36L36 24L16 12Z" fill="#fff"/></svg>
          )}
        </Button>
      )}
    </Box>
  );
}; 
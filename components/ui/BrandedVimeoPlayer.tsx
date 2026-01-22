"use client";
import { useEffect, useRef, useState } from "react";
import { Button, Box, HStack, Text } from "@chakra-ui/react";
import { Slider } from "@/components/ui/slider";
import { HiVolumeUp, HiVolumeOff } from "react-icons/hi";
import { MdReplay, MdPlayArrow, MdPause, MdFullscreen, MdFullscreenExit } from "react-icons/md";
// @ts-ignore
import Player from "@vimeo/player";

interface BrandedVimeoPlayerProps {
  videoId: string;
  autoplay?: boolean;
  muted?: boolean;
}

export const BrandedVimeoPlayer: React.FC<BrandedVimeoPlayerProps> = ({ 
  videoId, 
  autoplay = true, 
  muted: initialMuted = true 
}) => {
  const [playing, setPlaying] = useState(autoplay);
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showControls, setShowControls] = useState(false);
  const [muted, setMuted] = useState(initialMuted);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleUserInteraction = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    // Auto-hide controls after 3 seconds of inactivity
    controlsTimeoutRef.current = setTimeout(() => {
      if (playing) {
        setShowControls(false);
      }
    }, 3000);
  };

  useEffect(() => {
    if (!containerRef.current) return;
    if (playerRef.current) return;
    
    const player = new Player(containerRef.current.querySelector("iframe"));
    playerRef.current = player;

    player.on("play", () => {
      setPlaying(true);
      handleUserInteraction();
    });
    player.on("pause", () => {
      setPlaying(false);
      setShowControls(true); // Always show controls when paused
    });
    player.on("volumechange", (data: any) => {
      setVolume(data.volume);
      setMuted(data.volume === 0);
    });
    player.on("timeupdate", (data: any) => {
      setProgress((data.seconds / data.duration) * 100);
    });
    player.getDuration().then((d: number) => setDuration(d));

    // Initial Setup
    if (initialMuted) {
      player.setVolume(0);
    } else {
      player.setVolume(1);
    }
    
    // Check initial playing state after iframe loads
    setTimeout(() => {
      if (autoplay) {
        player.play().catch(() => {
          // Autoplay might be blocked by browser policy
          setPlaying(false);
          setShowControls(true);
        });
      }
      
      player.getPaused().then((paused: boolean) => {
        if (!paused) {
          // Video is playing
          setPlaying(true);
          setShowControls(false);
        } else {
          // Video is paused
          setPlaying(false);
          setShowControls(true);
        }
      }).catch(() => {
        // If check fails
        if (autoplay) {
          setPlaying(true);
          setShowControls(false);
        }
      });
    }, 1000);

    return () => {
      player.unload();
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, []);

  const handlePlayPause = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!playerRef.current) return;
    try {
      if (playing) {
        await playerRef.current.pause();
        setPlaying(false);
        setShowControls(true);
      } else {
        await playerRef.current.play();
        setPlaying(true);
        handleUserInteraction();
      }
    } catch (error) {
      console.error("Error toggling play/pause:", error);
    }
  };

  const handleMuteToggle = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!playerRef.current) return;
    if (muted) {
      playerRef.current.setVolume(1);
      setMuted(false);
    } else {
      playerRef.current.setVolume(0);
      setMuted(true);
    }
  };

  const handleSeek = (val: number) => {
    if (!playerRef.current) return;
    const time = (val / 100) * duration;
    playerRef.current.setCurrentTime(time);
    setProgress(val);
    handleUserInteraction();
  };

  const handleVolumeChange = (val: number) => {
    if (!playerRef.current) return;
    const vol = val / 100;
    playerRef.current.setVolume(vol);
    // setVolume(vol); // Removed to avoid conflict with event listener
    // setMuted(vol === 0); // Removed to avoid conflict
    handleUserInteraction();
  };

  const handleFullscreen = () => {
    if (!containerRef.current) return;
    
    if (!isFullscreen) {
      // Enter fullscreen
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if ((containerRef.current as any).webkitRequestFullscreen) {
        (containerRef.current as any).webkitRequestFullscreen();
      } else if ((containerRef.current as any).msRequestFullscreen) {
        (containerRef.current as any).msRequestFullscreen();
      }
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).msFullscreenElement
      );
      setIsFullscreen(isCurrentlyFullscreen);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <Box
      width="100%"
      height="100%"
      position="relative"
      ref={containerRef}
      onMouseEnter={handleUserInteraction}
      onMouseMove={handleUserInteraction}
      onMouseLeave={() => playing && setShowControls(false)}
      overflow="hidden"
      borderRadius="lg"
      bg="black"
    >
      <iframe
        src={`https://player.vimeo.com/video/${videoId}?controls=0&background=1&autoplay=${autoplay ? 1 : 0}&muted=${initialMuted ? 1 : 0}&loop=1&title=0&byline=0&portrait=0&transparent=0`}
        width="100%"
        height="100%"
        style={{ 
          border: 0, 
          display: "block",
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "100%",
          height: "120%",
          transform: "translate(-50%, -50%)",
          minWidth: "100%",
          minHeight: "100%",
          pointerEvents: "none" // Disable iframe interaction to allow overlay clicks
        }}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        title="Vimeo Video"
      />

      {/* Transparent Click Layer for Mobile/Toggle */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        zIndex={1}
        onClick={handleUserInteraction}
      />

      {/* Custom Controls Overlay */}
      <Box
        position="absolute"
        bottom="0"
        left="0"
        right="0"
        bg="linear-gradient(to top, rgba(0,0,0,0.9), transparent)"
        p={4}
        opacity={showControls || !playing ? 1 : 0}
        transition="opacity 0.3s"
        zIndex={10}
        onClick={(e) => e.stopPropagation()} // Keep controls active when clicked
        pointerEvents={showControls || !playing ? "auto" : "none"}
      >
        <HStack gap={4} align="center" mb={2}>
          {/* Play/Pause Button */}
          <Button
            onClick={handlePlayPause}
            variant="ghost"
            color="white"
            _hover={{ bg: "whiteAlpha.200" }}
            size="sm"
            p={0}
          >
            {playing ? <MdPause size={24} /> : <MdPlayArrow size={24} />}
          </Button>

          {/* Progress Bar */}
          <Box flex={1} cursor="pointer">
            <Slider 
              aria-label={["video-progress"]}
              value={[progress]} 
              onValueChange={({ value }) => handleSeek(value[0])}
              min={0}
              max={100}
              step={0.1}
            />
          </Box>

          {/* Time Display */}
          <Text color="white" fontSize="xs" minW="80px" textAlign="right" fontFamily="monospace">
            {formatTime(duration * (progress / 100))} / {formatTime(duration)}
          </Text>

          {/* Volume Control */}
          <HStack gap={2} w={{ base: "100px", md: "140px" }}>
            <Button
              onClick={handleMuteToggle}
              variant="ghost"
              color="white"
              _hover={{ bg: "whiteAlpha.200" }}
              size="sm"
              p={0}
              minW="auto"
            >
              {muted ? <HiVolumeOff size={20} /> : <HiVolumeUp size={20} />}
            </Button>
            <Box flex={1}>
              <Slider 
                aria-label={["volume-slider"]} 
                value={[muted ? 0 : volume * 100]} 
                onValueChange={({ value }) => handleVolumeChange(value[0])}
                min={0}
                max={100}
                step={1}
              />
            </Box>
          </HStack>

          {/* Fullscreen Button */}
          <Button
            onClick={handleFullscreen}
            variant="ghost"
            color="white"
            _hover={{ bg: "whiteAlpha.200" }}
            size="sm"
            p={0}
            minW="auto"
          >
            {isFullscreen ? <MdFullscreenExit size={20} /> : <MdFullscreen size={20} />}
          </Button>
        </HStack>
      </Box>

      {/* Centered Play Button (Paused State) */}
      {!playing && (
        <Button
          onClick={handlePlayPause}
          position="absolute"
          left="50%"
          top="50%"
          transform="translate(-50%, -50%)"
          size="lg"
          borderRadius="full"
          bg="rgba(0,0,0,0.6)"
          color="#fff"
          fontSize="4xl"
          p={8}
          zIndex={5}
          _hover={{ bg: "rgba(0,0,0,0.8)", transform: "translate(-50%, -50%) scale(1.1)" }}
          transition="all 0.2s"
        >
          <MdPlayArrow size={48} />
        </Button>
      )}
    </Box>
  );
}; 
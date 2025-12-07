"use client";
import { useEffect, useRef, useState } from "react";
import { Button, Box, HStack, Text } from "@chakra-ui/react";
import { Slider } from "@/components/ui/slider";
import { HiVolumeUp, HiVolumeOff } from "react-icons/hi";
import { MdPlayArrow, MdPause } from "react-icons/md";
// @ts-ignore
import Player from "@vimeo/player";
export const BrandedVimeoPlayer = ({ videoId }) => {
    const [playing, setPlaying] = useState(false);
    const playerRef = useRef(null);
    const containerRef = useRef(null);
    const [showControls, setShowControls] = useState(false);
    const [muted, setMuted] = useState(true);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0);
    const controlsTimeoutRef = useRef(null);
    const formatTime = (seconds) => {
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
        if (!containerRef.current)
            return;
        if (playerRef.current)
            return;
        const player = new Player(containerRef.current.querySelector("iframe"));
        playerRef.current = player;
        player.on("play", () => setPlaying(true));
        player.on("pause", () => {
            setPlaying(false);
            setShowControls(true); // Always show controls when paused
        });
        player.on("volumechange", (data) => {
            setVolume(data.volume);
            setMuted(data.volume === 0);
        });
        player.on("timeupdate", (data) => {
            setProgress((data.seconds / data.duration) * 100);
        });
        player.getDuration().then((d) => setDuration(d));
        // Initial Setup
        player.setVolume(0);
        player.play().catch(() => { });
        return () => {
            player.unload();
            if (controlsTimeoutRef.current)
                clearTimeout(controlsTimeoutRef.current);
        };
    }, []);
    const handlePlayPause = (e) => {
        e?.stopPropagation();
        if (!playerRef.current)
            return;
        if (playing) {
            playerRef.current.pause();
        }
        else {
            playerRef.current.play();
        }
    };
    const handleMuteToggle = (e) => {
        e?.stopPropagation();
        if (!playerRef.current)
            return;
        if (muted) {
            playerRef.current.setVolume(1);
            setMuted(false);
        }
        else {
            playerRef.current.setVolume(0);
            setMuted(true);
        }
    };
    const handleSeek = (val) => {
        if (!playerRef.current)
            return;
        const time = (val / 100) * duration;
        playerRef.current.setCurrentTime(time);
        setProgress(val);
        handleUserInteraction();
    };
    const handleVolumeChange = (val) => {
        if (!playerRef.current)
            return;
        const vol = val / 100;
        playerRef.current.setVolume(vol);
        // setVolume(vol); // Removed to avoid conflict with event listener
        // setMuted(vol === 0); // Removed to avoid conflict
        handleUserInteraction();
    };
    return (<Box width="100%" height="100%" position="relative" ref={containerRef} onMouseEnter={handleUserInteraction} onMouseMove={handleUserInteraction} onMouseLeave={() => playing && setShowControls(false)} overflow="hidden" borderRadius="lg" bg="black">
      <iframe src={`https://player.vimeo.com/video/${videoId}?controls=0&background=1&autoplay=1&muted=1&loop=1&title=0&byline=0&portrait=0&transparent=0`} width="100%" height="100%" style={{
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
        }} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen title="Vimeo Video"/>

      {/* Transparent Click Layer for Mobile/Toggle */}
      <Box position="absolute" top="0" left="0" right="0" bottom="0" zIndex={1} onClick={handleUserInteraction}/>

      {/* Custom Controls Overlay */}
      <Box position="absolute" bottom="0" left="0" right="0" bg="linear-gradient(to top, rgba(0,0,0,0.9), transparent)" p={4} opacity={showControls ? 1 : 0} transition="opacity 0.3s" zIndex={10} onClick={(e) => e.stopPropagation()} // Keep controls active when clicked
    >
        <HStack gap={4} align="center" mb={2}>
          {/* Play/Pause Button */}
          <Button onClick={handlePlayPause} variant="ghost" color="white" _hover={{ bg: "whiteAlpha.200" }} size="sm" p={0}>
            {playing ? <MdPause size={24}/> : <MdPlayArrow size={24}/>}
          </Button>

          {/* Progress Bar */}
          <Box flex={1} cursor="pointer">
            <Slider aria-label={["video-progress"]} value={[progress]} onValueChange={({ value }) => handleSeek(value[0])} min={0} max={100} step={0.1}/>
          </Box>

          {/* Time Display */}
          <Text color="white" fontSize="xs" minW="80px" textAlign="right" fontFamily="monospace">
            {formatTime(duration * (progress / 100))} / {formatTime(duration)}
          </Text>

          {/* Volume Control */}
          <HStack gap={2} w={{ base: "100px", md: "140px" }}>
            <Button onClick={handleMuteToggle} variant="ghost" color="white" _hover={{ bg: "whiteAlpha.200" }} size="sm" p={0} minW="auto">
              {muted ? <HiVolumeOff size={20}/> : <HiVolumeUp size={20}/>}
            </Button>
            <Box flex={1}>
              <Slider aria-label={["volume-slider"]} value={[muted ? 0 : volume * 100]} onValueChange={({ value }) => handleVolumeChange(value[0])} min={0} max={100} step={1}/>
            </Box>
          </HStack>
        </HStack>
      </Box>

      {/* Centered Play Button (Paused State) */}
      {(!playing || !showControls && !playing) && (<Button onClick={handlePlayPause} position="absolute" left="50%" top="50%" transform="translate(-50%, -50%)" size="lg" borderRadius="full" bg="rgba(0,0,0,0.6)" color="#fff" fontSize="4xl" p={8} zIndex={5} _hover={{ bg: "rgba(0,0,0,0.8)", transform: "translate(-50%, -50%) scale(1.1)" }} transition="all 0.2s">
          <MdPlayArrow size={48}/>
        </Button>)}
    </Box>);
};

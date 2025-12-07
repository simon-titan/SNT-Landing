"use client";
import React, { useRef, useState } from "react";
import { Box, Button } from "@chakra-ui/react";
import { HiVolumeUp, HiVolumeOff } from "react-icons/hi";
import { MdReplay, MdFullscreen } from "react-icons/md";
import { Slider } from "@/components/ui/slider";
export const CustomVerticalVideoPlayer = ({ src, poster, title }) => {
    const videoRef = useRef(null);
    const [playing, setPlaying] = useState(false);
    const [muted, setMuted] = useState(true);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const handlePlayPause = () => {
        if (!videoRef.current)
            return;
        if (playing) {
            videoRef.current.pause();
        }
        else {
            videoRef.current.play();
        }
        setPlaying(!playing);
    };
    const handleMuteToggle = () => {
        if (!videoRef.current)
            return;
        videoRef.current.muted = !muted;
        setMuted(!muted);
    };
    const handleTimeUpdate = () => {
        if (!videoRef.current)
            return;
        setCurrentTime(videoRef.current.currentTime);
    };
    const handleLoadedMetadata = () => {
        if (!videoRef.current)
            return;
        setDuration(videoRef.current.duration);
    };
    const handleSeek = (val) => {
        console.log('Slider onChange value:', val);
        let seekVal = 0;
        if (Array.isArray(val)) {
            seekVal = val[0] ?? 0;
        }
        else if (typeof val === 'number') {
            seekVal = val;
        }
        else if (val && typeof val.target?.value === 'number') {
            seekVal = val.target.value;
        }
        if (!videoRef.current)
            return;
        videoRef.current.currentTime = seekVal;
        setCurrentTime(seekVal);
    };
    const handleRestart = () => {
        if (!videoRef.current)
            return;
        videoRef.current.currentTime = 0;
        videoRef.current.play();
        setPlaying(true);
    };
    const handleFullscreen = () => {
        if (!videoRef.current)
            return;
        const container = videoRef.current.parentElement;
        if (!document.fullscreenElement) {
            container?.requestFullscreen();
            setIsFullscreen(true);
        }
        else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };
    return (<Box bg="white" borderRadius="lg" boxShadow="md" overflow="hidden" minW="220px" maxW="260px" border="2px solid #e5e7eb" display="flex" flexDirection="column" alignItems="center" p={0}>
      <Box w="full" aspectRatio="9/16" bg="#f1f5f9" position="relative">
        <video ref={videoRef} src={src} poster={poster} style={{ width: "100%", height: "100%", objectFit: isFullscreen ? "contain" : "cover" }} muted={muted} onTimeUpdate={handleTimeUpdate} onLoadedMetadata={handleLoadedMetadata} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} playsInline/>
        {/* Steuerungs-Buttons */}
        <Button onClick={handleRestart} position="absolute" top={3} left={3} zIndex={3} bg="rgba(0,0,0,0.6)" color="#fff" borderRadius="full" size="md" px={2} py={2} _hover={{ bg: "rgba(0,0,0,0.85)" }} aria-label="Video neu starten">
          <MdReplay size={24}/>
        </Button>
        <Button onClick={handleMuteToggle} position="absolute" top={3} right={3} zIndex={3} bg="rgba(0,0,0,0.6)" color="#fff" borderRadius="full" size="md" px={2} py={2} _hover={{ bg: "rgba(0,0,0,0.85)" }} aria-label={muted ? "Ton an" : "Ton aus"}>
          {muted ? <HiVolumeOff size={24}/> : <HiVolumeUp size={24}/>}
        </Button>
        <Button onClick={handleFullscreen} position="absolute" bottom={3} right={3} zIndex={3} bg="rgba(0,0,0,0.6)" color="#fff" borderRadius="full" size="md" px={2} py={2} _hover={{ bg: "rgba(0,0,0,0.85)" }} aria-label="Vollbild">
          <MdFullscreen size={24}/>
        </Button>
        {/* Play/Pause Button mittig */}
        <Button onClick={handlePlayPause} position="absolute" left="50%" top="50%" transform="translate(-50%, -50%)" size="lg" borderRadius="full" bg="rgba(0,0,0,0.7)" color="#fff" fontSize="4xl" px={8} py={8} zIndex={2} _hover={{ bg: "rgba(0,0,0,0.85)" }} aria-label={playing ? "Pause" : "Play"}>
          {playing ? (<svg width="48" height="48" viewBox="0 0 48 48" fill="none"><rect x="12" y="12" width="8" height="24" rx="3" fill="#fff"/><rect x="28" y="12" width="8" height="24" rx="3" fill="#fff"/></svg>) : (<svg width="48" height="48" viewBox="0 0 48 48" fill="none"><path d="M16 12V36L36 24L16 12Z" fill="#fff"/></svg>)}
        </Button>
        {/* Zeitstrahl */}
        <Box position="absolute" bottom={3} left={3} right={12} zIndex={3}>
          <Slider min={0} max={duration} value={[currentTime]} onChange={handleSeek} size="sm" colorScheme="blue"/>
        </Box>
      </Box>
      {title && (<Box fontWeight="medium" fontSize="md" p={3} textAlign="center">
          {title}
        </Box>)}
    </Box>);
};
export default CustomVerticalVideoPlayer;

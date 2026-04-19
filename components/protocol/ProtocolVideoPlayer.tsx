"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Box, HStack, Text, IconButton } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import {
  Play,
  Pause,
  SpeakerHigh,
  SpeakerSlash,
  ArrowsOut,
  ArrowsIn,
  X,
  CaretDown,
} from "@phosphor-icons/react/dist/ssr";
// @ts-ignore - Vimeo Player has no bundled types
import Player from "@vimeo/player";

const SNT_PURPLE = "#8B5CF6";
const SNT_PURPLE_DARK = "#7C3AED";
const SNT_PURPLE_LIGHT = "#C4B5FD";

interface ProtocolVideoPlayerProps {
  videoId: string;
  autoplay?: boolean;
  muted?: boolean;
}

const pulseGlow = keyframes({
  "0%, 100%": { boxShadow: `0 0 0 0 rgba(139, 92, 246, 0.5)` },
  "70%": { boxShadow: `0 0 0 14px rgba(139, 92, 246, 0)` },
});

const fadeIn = keyframes({
  from: { opacity: 0, transform: "translate(-50%, -50%) scale(0.92)" },
  to: { opacity: 1, transform: "translate(-50%, -50%) scale(1)" },
});

const arrowBounce = keyframes({
  "0%, 100%": { transform: "translateY(0)" },
  "50%": { transform: "translateY(8px)" },
});

const endCardIn = keyframes({
  from: { opacity: 0, transform: "scale(0.94)" },
  to: { opacity: 1, transform: "scale(1)" },
});

const formatTime = (seconds: number) => {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const isMobileDevice = () => {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(max-width: 768px)").matches ||
    /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
  );
};

export const ProtocolVideoPlayer: React.FC<ProtocolVideoPlayerProps> = ({
  videoId,
  autoplay = true,
  muted: initialMuted = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const seekRef = useRef<HTMLDivElement>(null);
  const isSeekingRef = useRef(false);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(initialMuted);
  const [volume, setVolume] = useState(initialMuted ? 0 : 1);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [mobileFsOpen, setMobileFsOpen] = useState(false);
  const [mobileFsStart, setMobileFsStart] = useState(0);
  const [mobileFsMuted, setMobileFsMuted] = useState(initialMuted);
  const [hasEnded, setHasEnded] = useState(false);

  const revealControls = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (playing && !isSeekingRef.current) setShowControls(false);
    }, 2800);
  }, [playing]);

  // Vimeo player init + autoplay
  useEffect(() => {
    if (!containerRef.current || playerRef.current) return;
    const iframe = containerRef.current.querySelector("iframe");
    if (!iframe) return;

    const player = new Player(iframe);
    playerRef.current = player;

    player.on("play", () => {
      setPlaying(true);
      setHasEnded(false);
      revealControls();
    });
    player.on("pause", () => {
      setPlaying(false);
      setShowControls(true);
    });
    player.on("ended", () => {
      setPlaying(false);
      setShowControls(false);
      setHasEnded(true);
    });
    player.on("volumechange", (data: any) => {
      setVolume(data.volume);
      setMuted(data.volume === 0);
    });
    player.on("timeupdate", (data: any) => {
      if (!isSeekingRef.current) {
        setCurrentTime(data.seconds);
        if (data.duration > 0) {
          setProgress((data.seconds / data.duration) * 100);
        }
      }
    });
    player.on("loaded", () => {
      player.getDuration().then((d: number) => setDuration(d)).catch(() => {});
    });

    // Trigger autoplay AFTER player ready (this is the key for reliable autoplay)
    player
      .ready()
      .then(async () => {
        try {
          // Vimeo requires muted=true for autoplay (browser policy)
          if (initialMuted) {
            await player.setMuted(true);
            await player.setVolume(0);
          }
          const d = await player.getDuration();
          setDuration(d);
          if (autoplay) {
            await player.play();
            setPlaying(true);
          }
        } catch {
          setPlaying(false);
          setShowControls(true);
        }
      })
      .catch(() => {});

    return () => {
      try {
        player.unload();
      } catch {}
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Listen to native fullscreen changes (Desktop)
  useEffect(() => {
    const onFsChange = () => {
      const inFs = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement
      );
      setIsFullscreen(inFs);
      if (inFs) revealControls();
    };
    document.addEventListener("fullscreenchange", onFsChange);
    document.addEventListener("webkitfullscreenchange", onFsChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFsChange);
      document.removeEventListener("webkitfullscreenchange", onFsChange);
    };
  }, [revealControls]);

  const handlePlayPause = useCallback(
    async (e?: React.MouseEvent) => {
      e?.stopPropagation();
      const p = playerRef.current;
      if (!p) return;
      try {
        if (playing) {
          await p.pause();
        } else {
          await p.play();
        }
      } catch (err) {
        console.error("[ProtocolVideoPlayer] play/pause failed", err);
      }
    },
    [playing],
  );

  const handleMuteToggle = useCallback(
    async (e?: React.MouseEvent) => {
      e?.stopPropagation();
      const p = playerRef.current;
      if (!p) return;
      try {
        if (muted) {
          await p.setMuted(false);
          await p.setVolume(1);
        } else {
          await p.setMuted(true);
          await p.setVolume(0);
        }
      } catch (err) {
        console.error("[ProtocolVideoPlayer] mute toggle failed", err);
      }
    },
    [muted],
  );

  const handleFullscreen = useCallback(
    async (e?: React.MouseEvent) => {
      e?.stopPropagation();
      const p = playerRef.current;
      const container = containerRef.current;
      if (!p || !container) return;

      // Currently in any fullscreen (desktop or mobile modal) → exit
      if (mobileFsOpen) {
        setMobileFsOpen(false);
        return;
      }
      if (
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement
      ) {
        try {
          await (
            document.exitFullscreen ||
            (document as any).webkitExitFullscreen
          )?.call(document);
        } catch {}
        return;
      }

      if (isMobileDevice()) {
        // Mobile: open native Vimeo player in a fullscreen overlay
        try {
          const t = await p.getCurrentTime().catch(() => 0);
          const v = await p.getVolume().catch(() => 0);
          setMobileFsStart(t || 0);
          setMobileFsMuted(v === 0);
          try {
            await p.pause();
          } catch {}
          setMobileFsOpen(true);
        } catch (err) {
          console.error("[ProtocolVideoPlayer] mobile fs failed", err);
        }
      } else {
        // Desktop: fullscreen the whole container so custom controls remain
        try {
          const el: any = container;
          await (el.requestFullscreen || el.webkitRequestFullscreen)?.call(el);
        } catch (err) {
          console.error("[ProtocolVideoPlayer] desktop fs failed", err);
        }
      }
    },
    [mobileFsOpen],
  );

  const closeMobileFs = useCallback(async () => {
    setMobileFsOpen(false);
    // Optionally resume original player
    const p = playerRef.current;
    if (p) {
      try {
        // Sync time back from the native player would require iframe message exchange.
        // Just resume from where we left off, browser may keep state, otherwise user can re-seek.
        await p.play().catch(() => {});
      } catch {}
    }
  }, []);

  const seekFromEvent = useCallback(
    (clientX: number) => {
      const el = seekRef.current;
      const p = playerRef.current;
      if (!el || !p || duration <= 0) return;
      const rect = el.getBoundingClientRect();
      const ratio = Math.max(
        0,
        Math.min(1, (clientX - rect.left) / rect.width),
      );
      const time = ratio * duration;
      setProgress(ratio * 100);
      setCurrentTime(time);
      p.setCurrentTime(time);
    },
    [duration],
  );

  const handleSeekDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    isSeekingRef.current = true;
    (e.target as Element).setPointerCapture(e.pointerId);
    seekFromEvent(e.clientX);
  };
  const handleSeekMove = (e: React.PointerEvent) => {
    if (!isSeekingRef.current) return;
    seekFromEvent(e.clientX);
  };
  const handleSeekUp = (e: React.PointerEvent) => {
    if (!isSeekingRef.current) return;
    isSeekingRef.current = false;
    try {
      (e.target as Element).releasePointerCapture(e.pointerId);
    } catch {}
    revealControls();
  };

  const overlayVisible = showControls || !playing || hovering;

  return (
    <>
      <Box
        ref={containerRef}
        width="100%"
        height="100%"
        position="relative"
        overflow="hidden"
        borderRadius={isFullscreen ? "0" : "2xl"}
        bg="black"
        onMouseEnter={() => {
          setHovering(true);
          revealControls();
        }}
        onMouseMove={revealControls}
        onMouseLeave={() => {
          setHovering(false);
          if (playing) setShowControls(false);
        }}
      >
        <iframe
          src={`https://player.vimeo.com/video/${videoId}?controls=0&autoplay=${autoplay ? 1 : 0}&muted=${initialMuted ? 1 : 0}&playsinline=1&title=0&byline=0&portrait=0&dnt=1&transparent=0`}
          width="100%"
          height="100%"
          style={{
            border: 0,
            display: "block",
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          allowFullScreen
          title="SNT APEX Video"
        />

        {/* Click capture layer (toggle play/pause) */}
        <Box
          position="absolute"
          inset={0}
          zIndex={1}
          onClick={handlePlayPause}
          cursor="pointer"
        />

        {/* Vignette gradient for control readability */}
        <Box
          position="absolute"
          inset={0}
          zIndex={2}
          pointerEvents="none"
          opacity={overlayVisible ? 1 : 0}
          transition="opacity 0.35s ease"
          background="linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.35) 30%, transparent 55%)"
        />

        {/* Center play/pause button when paused — hidden when video has ended */}
        {!playing && !hasEnded && (
          <Box
            position="absolute"
            left="50%"
            top="50%"
            transform="translate(-50%, -50%)"
            zIndex={5}
            pointerEvents="none"
          >
            <Box
              as="button"
              onClick={handlePlayPause}
              pointerEvents="auto"
              display="flex"
              alignItems="center"
              justifyContent="center"
              w={{ base: "56px", md: "68px" }}
              h={{ base: "56px", md: "68px" }}
              borderRadius="full"
              bg={`linear-gradient(135deg, ${SNT_PURPLE} 0%, ${SNT_PURPLE_DARK} 100%)`}
              color="white"
              border="2px solid rgba(255,255,255,0.95)"
              boxShadow={`0 12px 36px rgba(139, 92, 246, 0.5), inset 0 1px 0 rgba(255,255,255,0.3)`}
              animation={`${pulseGlow} 2.4s ease-out infinite`}
              transition="transform 0.2s ease"
              _hover={{ transform: "scale(1.06)" }}
              _active={{ transform: "scale(0.98)" }}
              cursor="pointer"
            >
              <Box pl={{ base: "3px", md: "4px" }}>
                <Play size={26} weight="fill" />
              </Box>
            </Box>
          </Box>
        )}

        {/* End screen — appears when the video has finished */}
        {hasEnded && (
          <Box
            position="absolute"
            inset={0}
            zIndex={7}
            display="flex"
            alignItems="center"
            justifyContent="center"
            background="radial-gradient(circle at center, rgba(10,8,30,0.55) 0%, rgba(0,0,0,0.85) 80%)"
            backdropFilter="blur(6px)"
            animation={`${endCardIn} 420ms ease-out both`}
          >
            <Box
              maxW={{ base: "92%", md: "440px" }}
              w="full"
              mx="auto"
              p={{ base: 6, md: 8 }}
              borderRadius="2xl"
              bg="rgba(12,10,28,0.85)"
              border={`1px solid rgba(139, 92, 246, 0.45)`}
              boxShadow={`0 0 40px rgba(139, 92, 246, 0.4), inset 0 1px 0 rgba(255,255,255,0.06)`}
              position="relative"
              overflow="hidden"
            >
              <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                h="2px"
                background={`linear-gradient(90deg, transparent, ${SNT_PURPLE}, ${SNT_PURPLE_LIGHT}, transparent)`}
              />
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                textAlign="center"
                gap={{ base: 3, md: 4 }}
              >
                <Text
                  fontSize={{ base: "xs", md: "sm" }}
                  color={SNT_PURPLE_LIGHT}
                  fontWeight="bold"
                  letterSpacing="widest"
                  textTransform="uppercase"
                >
                  Bereit für den nächsten Schritt?
                </Text>
                <Text
                  fontSize={{ base: "2xl", md: "3xl" }}
                  fontWeight="900"
                  color="white"
                  lineHeight="1.1"
                  letterSpacing="-0.01em"
                >
                  Worauf wartest du noch?
                </Text>
                <Text
                  fontSize={{ base: "xs", md: "sm" }}
                  color="gray.400"
                  maxW="320px"
                  lineHeight="1.6"
                >
                  Scroll weiter und sichere dir deinen Platz im SNT APEX.
                </Text>

                <Box
                  as="button"
                  onClick={() => {
                    window.scrollBy({
                      top: window.innerHeight * 0.85,
                      behavior: "smooth",
                    });
                  }}
                  mt={{ base: 1, md: 2 }}
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  gap={1}
                  cursor="pointer"
                  aria-label="Weiter scrollen"
                >
                  <Box
                    w={{ base: "54px", md: "62px" }}
                    h={{ base: "54px", md: "62px" }}
                    borderRadius="full"
                    bg={`linear-gradient(135deg, ${SNT_PURPLE} 0%, ${SNT_PURPLE_DARK} 100%)`}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    boxShadow={`0 8px 28px rgba(139, 92, 246, 0.55)`}
                    animation={`${pulseGlow} 1.8s ease-out infinite, ${arrowBounce} 1.6s ease-in-out infinite`}
                    transition="transform 0.2s ease"
                    _hover={{ transform: "scale(1.06)" }}
                  >
                    <CaretDown size={28} color="white" weight="bold" />
                  </Box>
                  <Text
                    fontSize="2xs"
                    color="gray.400"
                    letterSpacing="wider"
                    textTransform="uppercase"
                    mt={1}
                  >
                    Weiter scrollen
                  </Text>
                </Box>
              </Box>
            </Box>
          </Box>
        )}

        {/* Centered "Ton einschalten" CTA, only while playing & still muted */}
        {playing && muted && (
          <Box
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            zIndex={6}
            animation={`${fadeIn} 350ms ease-out both`}
          >
            <Box
              as="button"
              onClick={handleMuteToggle}
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={2}
              px={{ base: 5, md: 6 }}
              py={{ base: 3, md: 3.5 }}
              borderRadius="2xl"
              bg="rgba(0,0,0,0.55)"
              border={`1px solid rgba(139, 92, 246, 0.55)`}
              backdropFilter="blur(10px)"
              boxShadow={`0 0 30px rgba(139, 92, 246, 0.45), inset 0 1px 0 rgba(255,255,255,0.08)`}
              cursor="pointer"
              transition="background 0.2s ease, border-color 0.2s ease, transform 0.2s ease"
              _hover={{
                bg: "rgba(0,0,0,0.75)",
                borderColor: "rgba(139, 92, 246, 0.85)",
                transform: "scale(1.04)",
              }}
              _active={{ transform: "scale(0.98)" }}
            >
              <Box
                w={{ base: "44px", md: "52px" }}
                h={{ base: "44px", md: "52px" }}
                borderRadius="full"
                bg={`linear-gradient(135deg, ${SNT_PURPLE} 0%, ${SNT_PURPLE_DARK} 100%)`}
                display="flex"
                alignItems="center"
                justifyContent="center"
                boxShadow={`0 6px 20px rgba(139, 92, 246, 0.5)`}
              >
                <SpeakerSlash size={22} color="white" weight="fill" />
              </Box>
              <Text
                fontSize={{ base: "xs", md: "sm" }}
                color="white"
                fontWeight="bold"
                letterSpacing="wider"
                textTransform="uppercase"
              >
                Ton einschalten
              </Text>
            </Box>
          </Box>
        )}

        {/* Bottom controls bar */}
        <Box
          position="absolute"
          left={0}
          right={0}
          bottom={0}
          zIndex={10}
          px={{ base: 3, md: 5 }}
          pb={{ base: 3, md: 4 }}
          pt={2}
          opacity={overlayVisible ? 1 : 0}
          pointerEvents={overlayVisible ? "auto" : "none"}
          transition="opacity 0.35s ease"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Seek bar */}
          <Box
            ref={seekRef}
            role="slider"
            aria-label="Video Fortschritt"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
            position="relative"
            h={{ base: "16px", md: "18px" }}
            display="flex"
            alignItems="center"
            cursor="pointer"
            touchAction="none"
            onPointerDown={handleSeekDown}
            onPointerMove={handleSeekMove}
            onPointerUp={handleSeekUp}
            onPointerCancel={handleSeekUp}
            mb={{ base: 1.5, md: 2 }}
            css={{
              "&:hover .progress-fill, &:active .progress-fill": {
                boxShadow: `0 0 14px ${SNT_PURPLE}, 0 0 24px rgba(139,92,246,0.5)`,
              },
              "&:hover .progress-thumb, &:active .progress-thumb": {
                transform: "translate(-50%, -50%) scale(1)",
                opacity: 1,
              },
              "&:hover .progress-track, &:active .progress-track": {
                height: "5px",
              },
            }}
          >
            <Box
              className="progress-track"
              position="absolute"
              left={0}
              right={0}
              h="3px"
              borderRadius="full"
              bg="rgba(255,255,255,0.18)"
              overflow="hidden"
              transition="height 0.18s ease"
            >
              <Box
                className="progress-fill"
                h="100%"
                w={`${progress}%`}
                background={`linear-gradient(90deg, ${SNT_PURPLE_DARK} 0%, ${SNT_PURPLE} 50%, ${SNT_PURPLE_LIGHT} 100%)`}
                borderRadius="full"
                transition="box-shadow 0.2s ease"
              />
            </Box>
            <Box
              className="progress-thumb"
              position="absolute"
              top="50%"
              left={`${progress}%`}
              transform="translate(-50%, -50%) scale(0.5)"
              opacity={isSeekingRef.current ? 1 : 0}
              w="14px"
              h="14px"
              borderRadius="full"
              bg="white"
              boxShadow={`0 0 0 3px ${SNT_PURPLE}, 0 4px 14px rgba(0,0,0,0.4)`}
              transition="transform 0.15s ease, opacity 0.15s ease"
              pointerEvents="none"
            />
          </Box>

          {/* Controls row */}
          <HStack
            justify="space-between"
            align="center"
            gap={{ base: 1, md: 3 }}
          >
            <HStack gap={{ base: 1, md: 2 }} align="center">
              <IconButton
                aria-label={playing ? "Pause" : "Abspielen"}
                onClick={handlePlayPause}
                variant="ghost"
                color="white"
                size="sm"
                minW="36px"
                h="36px"
                borderRadius="full"
                _hover={{
                  bg: "rgba(139,92,246,0.2)",
                  color: SNT_PURPLE_LIGHT,
                }}
              >
                {playing ? (
                  <Pause size={20} weight="fill" />
                ) : (
                  <Play size={20} weight="fill" />
                )}
              </IconButton>

              <HStack
                gap={1}
                align="center"
                role="group"
                css={{
                  "& .vol-slider": {
                    width: "0px",
                    opacity: 0,
                    transition: "width 0.25s ease, opacity 0.2s ease",
                    overflow: "hidden",
                  },
                  "&:hover .vol-slider, &:focus-within .vol-slider": {
                    width: "84px",
                    opacity: 1,
                  },
                }}
              >
                <IconButton
                  aria-label={muted ? "Ton an" : "Ton aus"}
                  onClick={handleMuteToggle}
                  variant="ghost"
                  color="white"
                  size="sm"
                  minW="36px"
                  h="36px"
                  borderRadius="full"
                  _hover={{
                    bg: "rgba(139,92,246,0.2)",
                    color: SNT_PURPLE_LIGHT,
                  }}
                >
                  {muted ? (
                    <SpeakerSlash size={20} weight="fill" />
                  ) : (
                    <SpeakerHigh size={20} weight="fill" />
                  )}
                </IconButton>

                <Box
                  className="vol-slider"
                  display={{ base: "none", md: "block" }}
                >
                  <Box
                    position="relative"
                    h="22px"
                    display="flex"
                    alignItems="center"
                    cursor="pointer"
                    touchAction="none"
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      const target = e.currentTarget;
                      target.setPointerCapture(e.pointerId);
                      const update = (clientX: number) => {
                        const rect = target.getBoundingClientRect();
                        const ratio = Math.max(
                          0,
                          Math.min(1, (clientX - rect.left) / rect.width),
                        );
                        playerRef.current?.setVolume(ratio);
                      };
                      update(e.clientX);
                      const move = (ev: PointerEvent) => update(ev.clientX);
                      const up = () => {
                        window.removeEventListener("pointermove", move);
                        window.removeEventListener("pointerup", up);
                      };
                      window.addEventListener("pointermove", move);
                      window.addEventListener("pointerup", up);
                    }}
                    w="80px"
                  >
                    <Box
                      position="absolute"
                      left={0}
                      right={0}
                      h="3px"
                      borderRadius="full"
                      bg="rgba(255,255,255,0.18)"
                    >
                      <Box
                        h="100%"
                        w={`${(muted ? 0 : volume) * 100}%`}
                        background={`linear-gradient(90deg, ${SNT_PURPLE} 0%, ${SNT_PURPLE_LIGHT} 100%)`}
                        borderRadius="full"
                      />
                    </Box>
                    <Box
                      position="absolute"
                      top="50%"
                      left={`${(muted ? 0 : volume) * 100}%`}
                      transform="translate(-50%, -50%)"
                      w="11px"
                      h="11px"
                      borderRadius="full"
                      bg="white"
                      boxShadow={`0 0 0 2px ${SNT_PURPLE}`}
                      pointerEvents="none"
                    />
                  </Box>
                </Box>
              </HStack>

              <Text
                color="white"
                fontSize="xs"
                fontFamily="mono"
                fontWeight="medium"
                ml={1}
                letterSpacing="wide"
                opacity={0.95}
                whiteSpace="nowrap"
              >
                {formatTime(currentTime)}{" "}
                <Box as="span" color="rgba(255,255,255,0.5)">
                  / {formatTime(duration)}
                </Box>
              </Text>
            </HStack>

            <IconButton
              aria-label={
                isFullscreen || mobileFsOpen ? "Vollbild verlassen" : "Vollbild"
              }
              onClick={handleFullscreen}
              variant="ghost"
              color="white"
              size="sm"
              minW="36px"
              h="36px"
              borderRadius="full"
              _hover={{
                bg: "rgba(139,92,246,0.2)",
                color: SNT_PURPLE_LIGHT,
              }}
            >
              {isFullscreen || mobileFsOpen ? (
                <ArrowsIn size={20} weight="bold" />
              ) : (
                <ArrowsOut size={20} weight="bold" />
              )}
            </IconButton>
          </HStack>
        </Box>
      </Box>

      {/* Mobile fullscreen overlay with native Vimeo controls */}
      {mobileFsOpen && (
        <Box
          position="fixed"
          inset={0}
          zIndex={9999}
          bg="black"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <iframe
            src={`https://player.vimeo.com/video/${videoId}?controls=1&autoplay=1&muted=${
              mobileFsMuted ? 1 : 0
            }&playsinline=1&title=0&byline=0&portrait=0&dnt=1#t=${Math.floor(
              mobileFsStart,
            )}s`}
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            allowFullScreen
            style={{
              width: "100%",
              height: "100%",
              border: 0,
            }}
            title="SNT APEX Video · Vollbild"
          />
          <IconButton
            aria-label="Vollbild schließen"
            onClick={closeMobileFs}
            position="absolute"
            top="env(safe-area-inset-top, 12px)"
            right="env(safe-area-inset-right, 12px)"
            mt={3}
            mr={3}
            size="lg"
            borderRadius="full"
            bg="rgba(0,0,0,0.6)"
            color="white"
            border={`1px solid rgba(139, 92, 246, 0.5)`}
            backdropFilter="blur(10px)"
            zIndex={10000}
            _hover={{ bg: "rgba(0,0,0,0.85)" }}
          >
            <X size={22} weight="bold" />
          </IconButton>
        </Box>
      )}
    </>
  );
};

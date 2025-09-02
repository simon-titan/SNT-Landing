"use client";

import { useEffect, useRef } from "react";
import { Box, Heading, VStack } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";

type Star = {
  x: number;
  y: number;
  radius: number;
  baseAlpha: number;
  speed: number;
  vx: number;
  vy: number;
};

const STAR_COLOR = "rgba(255,255,255,0.9)";
const GREEN = "#49E79C";

export default function SntHeroWaitlist() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const createStars = (count: number): Star[] => {
      const stars: Star[] = [];
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 1.2 + 0.2,
          baseAlpha: Math.random() * 0.8 + 0.2,
          speed: Math.random() * 0.015 + 0.005,
          vx: (Math.random() - 0.5) * 0.12,
          vy: (Math.random() - 0.5) * 0.12,
        });
      }
      return stars;
    };

    const createGreen = (count: number): Star[] => {
      const parts: Star[] = [];
      for (let i = 0; i < count; i++) {
        parts.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 1.8 + 0.4,
          baseAlpha: Math.random() * 0.6 + 0.2,
          speed: Math.random() * 0.02 + 0.008,
          vx: (Math.random() - 0.5) * 0.08,
          vy: (Math.random() - 0.5) * 0.08,
        });
      }
      return parts;
    };

    let starsFar = createStars(Math.min(180, Math.floor((width * height) / 9000)));
    let starsNear = createStars(Math.min(110, Math.floor((width * height) / 15000)));
    let greenFar = createGreen(Math.min(70, Math.floor((width * height) / 16000)));
    let greenNear = createGreen(Math.min(50, Math.floor((width * height) / 22000)));
    let t = 0;
    let introAlpha = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const drawStars = (arr: Star[], layer: "far" | "near") => {
        for (let i = 0; i < arr.length; i++) {
          const s = arr[i];
          const twinkle = layer === "far" ? 0.35 : 0.5;
          const alpha = s.baseAlpha * (0.55 + twinkle * Math.sin(t * s.speed + i));
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.radius * (layer === "far" ? 0.9 : 1.3), 0, Math.PI * 2);
          ctx.fillStyle = STAR_COLOR.replace("0.9", alpha.toFixed(3));
          ctx.fill();

          const driftScale = layer === "far" ? 0.4 : 1;
          s.x += s.vx * driftScale * (0.6 + s.radius);
          s.y += s.vy * driftScale * (0.6 + s.radius);
          if (s.x < -2) s.x = width + 2;
          if (s.x > width + 2) s.x = -2;
          if (s.y < -2) s.y = height + 2;
          if (s.y > height + 2) s.y = -2;
        }
      };

      drawStars(starsFar, "far");
      drawStars(starsNear, "near");

      const drawGreen = (arr: Star[], layer: "far" | "near") => {
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        for (let i = 0; i < arr.length; i++) {
          const p = arr[i];
          const twinkle = layer === "far" ? 0.4 : 0.6;
          const alpha = p.baseAlpha * (0.5 + twinkle * Math.sin(t * p.speed + i));
          const color = `rgba(73,231,156,${(alpha * 0.9).toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * (layer === "far" ? 0.7 : 1), 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();

          const driftScale = layer === "far" ? 0.35 : 0.9;
          p.x += p.vx * driftScale * (0.8 + p.radius * 0.2);
          p.y += p.vy * driftScale * (0.8 + p.radius * 0.2);
          if (p.x < -3) p.x = width + 3;
          if (p.x > width + 3) p.x = -3;
          if (p.y < -3) p.y = height + 3;
          if (p.y > height + 3) p.y = -3;
        }
        ctx.restore();
      };

      drawGreen(greenFar, "far");
      drawGreen(greenNear, "near");

      const vignette = ctx.createRadialGradient(
        width / 2,
        height / 2,
        Math.min(width, height) * 0.4,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.7
      );
      vignette.addColorStop(0, "rgba(0,0,0,0)");
      vignette.addColorStop(1, "rgba(0,0,0,0.65)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);

      if (introAlpha < 1) introAlpha += 0.01;
      t += 1;
      animationRef.current = requestAnimationFrame(draw);
    };

    const handleResize = () => {
      width = (canvas.width = canvas.offsetWidth);
      height = (canvas.height = canvas.offsetHeight);
      starsFar = createStars(Math.min(180, Math.floor((width * height) / 9000)));
      starsNear = createStars(Math.min(110, Math.floor((width * height) / 15000)));
      greenFar = createGreen(Math.min(70, Math.floor((width * height) / 16000)));
      greenNear = createGreen(Math.min(50, Math.floor((width * height) / 22000)));
    };

    draw();
    window.addEventListener("resize", handleResize);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Box position="relative" w="100%" h={{ base: "28vh", md: "40vh" }} background="#000" overflow="hidden">
      <Box as="canvas" ref={canvasRef as any} position="absolute" inset={0} w="100%" h="100%" />

      <VStack
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        gap={{ base: 2, md: 3 }}
        w="full"
        maxW="900px"
        px={{ base: 3, md: 6 }}
        zIndex={1}
      >
        <Heading
          as="h1"
          color={GREEN}
          textAlign="center"
          fontFamily="var(--font-horizon), Inter, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
          fontWeight="1000"
          textShadow="0 0 26px rgba(73,231,156,0.85), 0 0 66px rgba(73,231,156,0.4)"
          fontSize={{ base: "5xl", md: "7xl" }}
          lineHeight="1"
          animation={`${keyframes({
            from: { opacity: 0, transform: "translateY(-6%) scale(0.96)", filter: "blur(2px)" },
            to: { opacity: 1, transform: "translateY(0) scale(1)", filter: "blur(0)" },
          })} 1600ms ease-out both`}
        >
          SNT
        </Heading>

        <Box
          w={{ base: "80px", md: "110px" }}
          h={{ base: "1px", md: "2px" }}
          bg={`linear-gradient(90deg, rgba(73,231,156,0) 0%, rgba(73,231,156,0.95) 50%, rgba(73,231,156,0) 100%)`}
          borderRadius="full"
          boxShadow="0 0 10px rgba(73,231,156,0.7), 0 0 24px rgba(73,231,156,0.35)"
        />

        <Heading
          as="h2"
          textAlign="center"
          color="white"
          fontWeight="semibold"
          fontSize={{ base: "sm", md: "lg" }}
          lineHeight="1.3"
          maxW={{ base: "90%", md: "70%" }}
          textShadow="0 1px 2px rgba(0,0,0,0.55)"
        >
          SICHER DIR JETZT DEINEN <br></br>{' '}
          <Box
            as="span"
            color="white"
            px="1.5"
            borderRadius="xs"
            bg="linear-gradient(90deg, rgba(73,231,156,0.6), rgba(73,231,156,0.22) 85%, rgba(73,231,156,0) 100%)"
          >
            MENTORSHIP PLATZ
          </Box>
          
        </Heading>

        <Box
          w={{ base: "80px", md: "110px" }}
          h={{ base: "1px", md: "2px" }}
          bg={`linear-gradient(90deg, rgba(73,231,156,0) 0%, rgba(73,231,156,0.95) 50%, rgba(73,231,156,0) 100%)`}
          borderRadius="full"
          boxShadow="0 0 10px rgba(73,231,156,0.7), 0 0 24px rgba(73,231,156,0.35)"
        />

      </VStack>
    </Box>
  );
}



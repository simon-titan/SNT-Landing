"use client";
import React, { useEffect, useRef, useState } from "react";
import { Box, Text, VStack, HStack, SimpleGrid, Stack } from "@chakra-ui/react";

const stats = [
  {
    label: "JAHRE ERFAHRUNG ALS VOLLZEIT-TRADER",
    value: "6+",
    numericValue: 6,
    suffix: "+",
  },
  {
    label: "UMGESETZTES KAPITAL",
    value: "€400K+",
    numericValue: 400,
    suffix: "K+",
    prefix: "€",
  },
  {
    label: "FOLLOWS AUF SOCIAL MEDIA",
    value: "10k+",
    numericValue: 10,
    suffix: "k+",
  },
  {
    label: "AUSGEBILDETE MITGLIEDER",
    value: "1000+",
    numericValue: 1000,
    suffix: "+",
  },
];

// Hook für Count-up Animation
const useCountUp = (end: number, duration: number = 2000, startAnimation: boolean = false) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (!startAnimation) return;
    
    let startTime: number;
    
    const animateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        requestAnimationFrame(animateCount);
      }
    };
    
    requestAnimationFrame(animateCount);
  }, [end, duration, startAnimation]);
  
  return count;
};

// Hook für Intersection Observer
const useIntersectionObserver = (threshold: number = 0.1) => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold }
    );
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => observer.disconnect();
  }, [threshold]);
  
  return { ref, isInView };
};

const courses = [
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="16" stroke="#22c55e" strokeWidth="3" fill="rgba(34, 197, 94, 0.1)"/>
        <circle cx="20" cy="20" r="6" fill="#22c55e"/>
      </svg>
    ),
    title: "Trading-Einsteiger ohne Vorkenntnisse",
    desc: "Wir begleiten dich vom absoluten Anfänger bis hin zum profitablen Vollzeit-Trader – Schritt für Schritt, praxisnah und verständlich.",
    link: "Ich bin Anfänger",
    bg: "linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)",
    color: "#0a2540",
    linkColor: "#2563eb",
  },
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <rect x="6" y="6" width="28" height="28" rx="4" stroke="#22c55e" strokeWidth="3" fill="rgba(34, 197, 94, 0.1)"/>
        <rect x="14" y="14" width="12" height="12" rx="2" fill="#22c55e"/>
      </svg>
    ),
    title: "Fortgeschrittene Trader, die den nächsten Schritt machen wollen",
    desc: "Du hast bereits erste Erfahrungen im Trading gesammelt – wir helfen dir dabei, deine Strategie zu verfeinern, konstanter profitabel zu werden und den Schritt zum Vollzeit-Trader zu gehen.",
    link: "Ich bin ein fortgeschrittener Trader",
    bg: "linear-gradient(135deg, #fef2f2 0%, #fde2e2 100%)",
    color: "#0a2540",
    linkColor: "#fb7185",
  },
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <polygon points="20,6 32,32 8,32" stroke="#22c55e" strokeWidth="3" fill="rgba(34, 197, 94, 0.1)"/>
        <polygon points="20,14 26,24 14,24" fill="#22c55e"/>
      </svg>
    ),
    title: "Erfahrene Trader, die unsere Strategien erlernen möchten",
    desc: "Auch erfahrene Trader stoßen irgendwann an Grenzen. Wir geben dir tiefere Einblicke in unsere erprobten Strategien, die dir helfen, effizienter, zielgerichteter und profitabler zu traden. Denn: Wir begleiten Trader von null Erfahrung bis hin zum profitablen Vollzeit-Trader – und geben auch Profis den letzten Schliff.",
    link: "Ich bin ein erfahrener Trader",
    bg: "radial-gradient(circle at 60% 40%, #2563eb 0%, #000 100%)",
    color: "#fff",
    linkColor: "#38bdf8",
  },
];

// Komponente für animierte Statistik
const AnimatedStat = ({ stat, isInView }: { stat: typeof stats[0], isInView: boolean }) => {
  const count = useCountUp(stat.numericValue, 2000, isInView);
  
  return (
    <VStack 
      gap={2} 
      align="center" 
      justify="center"
      bg="rgba(10, 14, 10, 0.6)"
      backdropFilter="blur(16px)"
      borderRadius="xl"
      p={6}
      border="1px solid rgba(34, 197, 94, 0.2)"
      boxShadow="0 8px 32px 0 rgba(34, 197, 94, 0.15)"
      _hover={{
        transform: "translateY(-4px)",
        boxShadow: "0 12px 40px 0 rgba(34, 197, 94, 0.25)",
        borderColor: "rgba(34, 197, 94, 0.3)"
      }}
      transition="all 0.3s ease"
    >
      <Text 
        fontSize={{ base: "3xl", md: "5xl" }} 
        fontWeight="bold" 
        color="#22c55e"
        textShadow="0 0 20px rgba(34, 197, 94, 0.6)"
      >
        {stat.prefix}{count}{stat.suffix}
      </Text>
      <Text 
        fontSize={{ base: "xs", md: "sm" }} 
        color="gray.300" 
        fontWeight="semibold" 
        textAlign="center" 
        textTransform="uppercase" 
        letterSpacing="0.1em"
        lineHeight="1.3"
      >
        {stat.label}
      </Text>
    </VStack>
  );
};

export const CourseOverviewSection = () => {
  const { ref, isInView } = useIntersectionObserver(0.3);
  
  return (
    <Box 
      as="section" 
      py={{ base: 12, md: 20 }} 
      px={{ base: 4, md: 8 }} 
      w="full" 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      justifyContent="center"
      bg="linear-gradient(135deg, rgba(0, 0, 0, 0.98), rgba(10, 14, 10, 0.95))"
      position="relative"
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "radial-gradient(at 20% 80%, rgba(34, 197, 94, 0.1) 0px, transparent 50%), radial-gradient(at 80% 20%, rgba(16, 185, 129, 0.08) 0px, transparent 50%)",
        pointerEvents: "none"
      }}
    >
      <SimpleGrid 
        ref={ref} 
        columns={{ base: 1, md: 4 }} 
        gap={{ base: 6, md: 8 }} 
        mb={16} 
        w="full" 
        maxW="6xl"
        position="relative"
        zIndex={1}
      >
        {stats.map((stat, i) => (
          <AnimatedStat key={i} stat={stat} isInView={isInView} />
        ))}
      </SimpleGrid>
      <Text 
        as="h2" 
        fontSize={{ base: "2xl", md: "4xl" }} 
        fontWeight="bold" 
        textAlign="center" 
        mb={12}
        color="white"
        textShadow="0 2px 4px rgba(0,0,0,0.3)"
        position="relative"
        zIndex={1}
      >
        Unsere Ausbildung eignet sich besonders für …
      </Text>
      <SimpleGrid columns={{ base: 1, md: 3 }} gap={8} w="full" maxW="6xl" position="relative" zIndex={1}>
        {courses.map((course, i) => (
          <Box
            key={i}
            bg="rgba(10, 14, 10, 0.7)"
            backdropFilter="blur(20px)"
            borderRadius="2xl"
            boxShadow="0 20px 60px 0 rgba(34, 197, 94, 0.2)"
            border="1px solid rgba(34, 197, 94, 0.25)"
            p={{ base: 6, md: 8 }}
            color="white"
            display="flex"
            flexDirection="column"
            minH="400px"
            position="relative"
            overflow="hidden"
            _hover={{
              transform: "translateY(-6px)",
              boxShadow: "0 25px 80px 0 rgba(34, 197, 94, 0.3)",
              borderColor: "rgba(34, 197, 94, 0.4)"
            }}
            transition="all 0.4s ease"
            _before={{
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `linear-gradient(135deg, rgba(34, 197, 94, ${0.05 + i * 0.02}) 0%, transparent 70%)`,
              pointerEvents: "none"
            }}
          >
            <Box mb={4} position="relative" zIndex={1}>
              <Box
                p={3}
                borderRadius="xl"
                bg="rgba(34, 197, 94, 0.15)"
                border="1px solid rgba(34, 197, 94, 0.3)"
                display="inline-block"
                boxShadow="0 4px 12px rgba(34, 197, 94, 0.2)"
              >
                {course.icon}
              </Box>
            </Box>
            <Text 
              fontWeight="bold" 
              fontSize={{ base: "xl", md: "2xl" }} 
              mb={4}
              color="white"
              lineHeight="tight"
              position="relative"
              zIndex={1}
            >
              {course.title}
            </Text>
            <Text 
              fontSize="md" 
              mb={6} 
              color="gray.200"
              lineHeight="1.6"
              position="relative"
              zIndex={1}
            >
              {course.desc}
            </Text>
            <Box mt="auto" position="relative" zIndex={1}>
              <a
                href="/checkout/lifetime"
                style={{
                  fontWeight: 600,
                  color: '#22c55e',
                  borderBottom: `2px solid #22c55e`,
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  display: 'inline-block',
                  textShadow: '0 0 10px rgba(34, 197, 94, 0.4)'
                }}
                onMouseOver={e => {
                  e.currentTarget.style.color = '#16a34a';
                  e.currentTarget.style.borderBottomColor = '#16a34a';
                  e.currentTarget.style.textShadow = '0 0 15px rgba(34, 197, 94, 0.6)';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.color = '#22c55e';
                  e.currentTarget.style.borderBottomColor = '#22c55e';
                  e.currentTarget.style.textShadow = '0 0 10px rgba(34, 197, 94, 0.4)';
                }}
              >
                {course.link} <span style={{ fontSize: 18, verticalAlign: 'middle' }}>›</span>
              </a>
            </Box>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default CourseOverviewSection; 
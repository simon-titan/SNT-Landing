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
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><path d="M10 30L30 10M10 10h20v20" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
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
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><path d="M20 8v24M8 20h24" stroke="#fb7185" strokeWidth="3" strokeLinecap="round"/></svg>
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
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><path d="M20 8l8 8-8 8-8-8 8-8zm0 8v8m0 0v8" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><rect x="2" y="2" width="36" height="36" rx="8" fill="url(#a)"/><defs><radialGradient id="a" cx="0.5" cy="0.5" r="0.7"><stop stopColor="#2563eb"/><stop offset="1" stopColor="#000"/></radialGradient></defs></svg>
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
    <VStack gap={0} align="center" justify="center">
      <Text fontSize={{ base: "4xl", md: "6xl" }} fontWeight="bold" color="#2563eb">
        {stat.prefix}{count}{stat.suffix}
      </Text>
      <Text fontSize={{ base: "sm", md: "md" }} color="#0a2540" fontWeight="semibold" textAlign="center" textTransform="uppercase" letterSpacing="0.02em">
        {stat.label}
      </Text>
    </VStack>
  );
};

export const CourseOverviewSection = () => {
  const { ref, isInView } = useIntersectionObserver(0.3);
  
  return (
    <Box as="section" py={{ base: 6, md: 12 }} px={{ base: 4, md: 8 }} w="full" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
      <SimpleGrid ref={ref} columns={{ base: 1, md: 4 }} gap={{ base: 4, md: 6 }} mb={12} w="full" maxW="5xl">
        {stats.map((stat, i) => (
          <AnimatedStat key={i} stat={stat} isInView={isInView} />
        ))}
      </SimpleGrid>
      <Text as="h2" fontSize={{ base: "2xl", md: "4xl" }} fontWeight="bold" textAlign="center" mb={6}>
        Unsere Ausbildung eignet sich besonders für …
      </Text>
      <SimpleGrid columns={{ base: 1, md: 3 }} gap={6} w="full" maxW="6xl">
        {courses.map((course, i) => (
          <Box
            key={i}
            bg={course.bg}
            borderRadius="16px"
            boxShadow="md"
            p={{ base: 6, md: 8 }}
            color={course.color}
            display="flex"
            flexDirection="column"
            minH="340px"
          >
            <Box mb={4}>{course.icon}</Box>
            <Text fontWeight="bold" fontSize={{ base: "xl", md: "2xl" }} mb={2}>
              {course.title}
            </Text>
            <Text fontSize="md" mb={6} color={i === 2 ? "#dbeafe" : course.color}>
              {course.desc}
            </Text>
            <Box mt="auto">
              <a
                href="/Produkte/SNTTRADES-AUSBILDUNG"
                style={{
                  fontWeight: 600,
                  color: course.linkColor,
                  borderBottom: `2px solid ${course.linkColor}`,
                  textDecoration: 'none',
                  transition: 'opacity 0.2s',
                  display: 'inline-block',
                }}
                onMouseOver={e => (e.currentTarget.style.opacity = '0.8')}
                onMouseOut={e => (e.currentTarget.style.opacity = '1')}
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
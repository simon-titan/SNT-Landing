"use client";
import React, { useEffect, useRef, useState } from "react";
import { Box, Text, VStack, SimpleGrid } from "@chakra-ui/react";
import { Student, TrendUp, Trophy } from "@phosphor-icons/react/dist/ssr";

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
    icon: <Student size={40} weight="fill" color="#3b82f6" />,
    title: "Trading-Einsteiger ohne Vorkenntnisse",
    desc: "Wir begleiten dich vom absoluten Anfänger bis hin zum profitablen Vollzeit-Trader – Schritt für Schritt, praxisnah und verständlich.",
    link: "Ich bin Anfänger",
  },
  {
    icon: <TrendUp size={40} weight="fill" color="#3b82f6" />,
    title: "Fortgeschrittene Trader, die den nächsten Schritt machen wollen",
    desc: "Du hast bereits erste Erfahrungen im Trading gesammelt – wir helfen dir dabei, deine Strategie zu verfeinern, konstanter profitabel zu werden und den Schritt zum Vollzeit-Trader zu gehen.",
    link: "Ich bin ein fortgeschrittener Trader",
  },
  {
    icon: <Trophy size={40} weight="fill" color="#3b82f6" />,
    title: "Erfahrene Trader, die unsere Strategien erlernen möchten",
    desc: "Auch erfahrene Trader stoßen irgendwann an Grenzen. Wir geben dir tiefere Einblicke in unsere erprobten Strategien, die dir helfen, effizienter, zielgerichteter und profitabler zu traden. Denn: Wir begleiten Trader von null Erfahrung bis hin zum profitablen Vollzeit-Trader – und geben auch Profis den letzten Schliff.",
    link: "Ich bin ein erfahrener Trader",
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
      bg="white"
      borderRadius="xl"
      p={6}
      border="1px solid"
      borderColor="gray.200"
      boxShadow="0 8px 32px 0 rgba(0, 0, 0, 0.05)"
      _hover={{
        transform: "translateY(-4px)",
        boxShadow: "0 12px 40px 0 rgba(59, 130, 246, 0.15)",
        borderColor: "rgba(59, 130, 246, 0.3)"
      }}
      transition="all 0.3s ease"
    >
      <Text 
        fontSize={{ base: "3xl", md: "5xl" }} 
        fontWeight="bold" 
        color="blue.500"
      >
        {stat.prefix}{count}{stat.suffix}
      </Text>
      <Text 
        fontSize={{ base: "xs", md: "sm" }} 
        color="gray.600" 
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
      bg="gray.50"
      position="relative"
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
        color="gray.900"
        position="relative"
        zIndex={1}
      >
        Unsere Ausbildung eignet sich besonders für …
      </Text>
      <SimpleGrid columns={{ base: 1, md: 3 }} gap={8} w="full" maxW="6xl" position="relative" zIndex={1}>
        {courses.map((course, i) => (
          <Box
            key={i}
            bg="white"
            borderRadius="2xl"
            boxShadow="0 20px 60px 0 rgba(0, 0, 0, 0.08)"
            border="1px solid"
            borderColor="gray.200"
            p={{ base: 6, md: 8 }}
            color="gray.900"
            display="flex"
            flexDirection="column"
            minH="400px"
            position="relative"
            overflow="hidden"
            _hover={{
              transform: "translateY(-6px)",
              boxShadow: "0 25px 80px 0 rgba(59, 130, 246, 0.2)",
              borderColor: "rgba(59, 130, 246, 0.4)"
            }}
            transition="all 0.4s ease"
          >
            <Box mb={4} position="relative" zIndex={1}>
              <Box
                p={3}
                borderRadius="xl"
                bg="rgba(59, 130, 246, 0.15)"
                border="1px solid rgba(59, 130, 246, 0.3)"
                display="inline-flex"
                alignItems="center"
                justifyContent="center"
                boxShadow="0 4px 12px rgba(59, 130, 246, 0.2)"
                w="fit-content"
              >
                {course.icon}
              </Box>
            </Box>
            <Text 
              fontWeight="bold" 
              fontSize={{ base: "xl", md: "2xl" }} 
              mb={4}
              color="gray.900"
              lineHeight="tight"
              position="relative"
              zIndex={1}
            >
              {course.title}
            </Text>
            <Text 
              fontSize="md" 
              mb={6} 
              color="gray.600"
              lineHeight="1.6"
              position="relative"
              zIndex={1}
            >
              {course.desc}
            </Text>
            <Box mt="auto" position="relative" zIndex={1}>
              <a
                href="#product-page-section"
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById('product-page-section');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                style={{
                  fontWeight: 600,
                  color: '#3b82f6',
                  borderBottom: `2px solid #3b82f6`,
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  display: 'inline-block',
                  cursor: 'pointer',
                }}
                onMouseOver={e => {
                  e.currentTarget.style.color = '#2563eb';
                  e.currentTarget.style.borderBottomColor = '#2563eb';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.color = '#3b82f6';
                  e.currentTarget.style.borderBottomColor = '#3b82f6';
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
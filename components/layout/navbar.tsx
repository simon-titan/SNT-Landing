"use client";

import {
  Center,
  CollapsibleContent,
  CollapsibleRoot,
  Container,
  HStack,
  VStack,
  StackProps,
  Box,
  Heading,
  IconButton,
  Icon,
} from "@chakra-ui/react";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";
import { CollapsibleTrigger } from "@/components/ui/collapsible-trigger";
import { UserMenu } from "../ui/user-menu";
import { Link } from "@/components/ui/link";
import { SignedIn, SignedOut } from "../auth/protect-content";
import { Login, SignUp } from "../auth/embed";
import {
  MenuContent,
  MenuItem,
  MenuItemGroup,
  MenuRoot,
  MenuSeparator,
  MenuTrigger,
} from "../ui/menu";
import {
  DrawerRoot,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerBackdrop,
  DrawerTitle,
} from "../ui/drawer";
import { useRouter, usePathname } from "next/navigation";
import { List } from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";

export const MenuLink = (props) => {
  return (
    <Link href={props.href} w="full">
      <Button
        colorPalette="gray"
        variant={{ base: "ghost", md: "plain" }}
        width={{ base: "full", md: "auto" }}
        justifyContent={{ base: "flex-start", md: "center" }}
      >
        {props.children}
      </Button>
    </Link>
  );
};

// TODO: Improve nav links
export const NavbarLinkMenu = (props: StackProps) => {
  return (
    <>
      <MenuLink href="/docs">Docs</MenuLink>
      <MenuRoot>
        <MenuTrigger asChild>
          <Button
            colorPalette="gray"
            width={{ base: "full", md: "auto" }}
            variant={{ base: "ghost", md: "plain" }}
            justifyContent={{ base: "flex-start", md: "center" }}
          >
            Demo
          </Button>
        </MenuTrigger>
        <MenuContent>
          <MenuItemGroup title="Pages">
            <Link href="/pricing">
              <MenuItem value="pricing">Pricing</MenuItem>
            </Link>
            <Link href="/contact">
              <MenuItem value="contact">Contact</MenuItem>
            </Link>
            <Link href="/support">
              <MenuItem value="contact">Contact</MenuItem>
            </Link>
          </MenuItemGroup>
          <MenuSeparator />
          <MenuItemGroup title="Utility">
            <Link href="/thank-you">
              <MenuItem value="thank-you">Thank you</MenuItem>
            </Link>
            <Link href="/not-found">
              <MenuItem value="not-found">Not found</MenuItem>
            </Link>
            <Link href="/javascript">
              <MenuItem value="javascript">Javascript</MenuItem>
            </Link>
            <Link href="/legal/terms-and-conditions">
              <MenuItem value="terms-and-conditions">
                Terms & Conditions
              </MenuItem>
            </Link>
          </MenuItemGroup>
          <MenuSeparator />
          <MenuItemGroup title="Auth">
            <Link href="/app/basic">
              <MenuItem value="basic">Protected Page (Basic plan)</MenuItem>
            </Link>
            <Link href="/app/pro">
              <MenuItem value="pro">Protected Page (Pro plan)</MenuItem>
            </Link>
          </MenuItemGroup>
          <MenuSeparator />
          <MenuItemGroup title="Embeds">
            <Link href="/embed/login">
              <MenuItem value="login">Login</MenuItem>
            </Link>
            <Link href="/embed/sign-up">
              <MenuItem value="login">Sign up</MenuItem>
            </Link>
            <Link href="/embed/lead-capture">
              <MenuItem value="lead-capture">Lead Capture</MenuItem>
            </Link>
            <Link href="/embed/email-list">
              <MenuItem value="email-list">Email List</MenuItem>
            </Link>
          </MenuItemGroup>
        </MenuContent>
      </MenuRoot>
    </>
  );
};

export const NavbarActionMenu = ({ type }: { type: "website" | "app" }) => {
  return (
    <>
      <SignedOut>
        <Login popup>
          <Button size="sm" variant="outline" colorPalette="gray">
            Login
          </Button>
        </Login>
        <SignUp popup>
          <Button size="sm">Sign up</Button>
        </SignUp>
      </SignedOut>
      <SignedIn>
        {type == "app" ? (
          <UserMenu />
        ) : (
          <>
            <Button size="sm">Go to app</Button>
          </>
        )}
      </SignedIn>
    </>
  );
};

// Navigation Links Komponente für Desktop
const DesktopNavigation = () => {
  const router = useRouter();
  const pathname = usePathname();
  
  return (
    <HStack gap="6" as="nav" display={{ base: "none", md: "flex" }}>
      <Button
        variant="ghost"
        colorPalette="gray"
        onClick={() => {
          if (pathname === "/") {
            const el = document.getElementById('winnings');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          } else {
            router.push('/#winnings');
          }
        }}
      >
        Wie es funktioniert
      </Button>
      {/* Produkte Dropdown */}
      <MenuRoot>
        <MenuTrigger asChild>
          <Button variant="ghost" colorPalette="gray">
            Produkte
          </Button>
        </MenuTrigger>
        <MenuContent>
          <MenuItem value="uebersicht">
            <Link href="/Produkte">Übersicht</Link>
          </MenuItem>
          <MenuItem value="ressourcen">
            <Link href="/Produkte/SNT-Ressourcen-Bibliothek">Ressourcen Bibliothek (Kostenlos)</Link>
          </MenuItem>
          <MenuItem value="mentorship">
            <Link href="/Produkte/SNTTRADES-AUSBILDUNG">SNTTRADES Ausbildung</Link>
          </MenuItem>
        </MenuContent>
      </MenuRoot>
      
      {/* Support Link */}
      <Link href="/support">
        <Button variant="ghost" colorPalette="gray">
          Support
        </Button>
      </Link>
      
    </HStack>
  );
};

// Mobile Navigation Drawer
const MobileNavigation = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleNavigate = (action: () => void) => {
    setIsOpen(false);
    setTimeout(action, 100); // Delay für smoother UX
  };

  return (
    <Box display={{ base: "block", md: "none" }}>
      <DrawerRoot open={isOpen} onOpenChange={(e) => setIsOpen(e.open)}>
        <DrawerTrigger asChild>
          <IconButton
            aria-label="Menü öffnen"
            variant="ghost"
            size="sm"
            colorPalette="gray"
          >
            <Icon>
              <List />
            </Icon>
          </IconButton>
        </DrawerTrigger>
        <DrawerBackdrop />
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Navigation</DrawerTitle>
            <DrawerCloseTrigger />
          </DrawerHeader>
          <DrawerBody>
            <VStack gap="4" align="stretch">
              <Button
                variant="ghost"
                w="full"
                justifyContent="flex-start"
                onClick={() => handleNavigate(() => {
                  if (pathname === "/") {
                    const el = document.getElementById('winnings');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    router.push('/#winnings');
                  }
                })}
              >
                Wie es funktioniert
              </Button>
              
              <VStack gap="2" align="stretch">
                <Heading size="sm" color="gray.600" px="3">Produkte</Heading>
                <Button
                  variant="ghost"
                  w="full"
                  justifyContent="flex-start"
                  pl="6"
                  onClick={() => handleNavigate(() => router.push('/Produkte'))}
                >
                  Übersicht
                </Button>
                <Button
                  variant="ghost"
                  w="full"
                  justifyContent="flex-start"
                  pl="6"
                  onClick={() => handleNavigate(() => router.push('/Produkte/SNT-Ressourcen-Bibliothek'))}
                >
                  Ressourcen Bibliothek (Kostenlos)
                </Button>
                <Button
                  variant="ghost"
                  w="full"
                  justifyContent="flex-start"
                  pl="6"
                  onClick={() => handleNavigate(() => router.push('/Produkte/SNTTRADES-AUSBILDUNG'))}
                >
                  Mentorship (Paid-Kurs)
                </Button>
              </VStack>
              
              {/* Support Link für Mobile */}
              <Button
                variant="ghost"
                w="full"
                justifyContent="flex-start"
                onClick={() => handleNavigate(() => router.push('/support'))}
              >
                Support
              </Button>
              
              {/* Mentorship Login für Mobile */}
              <Box pt="4" borderTop="1px solid" borderColor="gray.200">
                <a href="https://snt-mentorship-platform.de" target="_blank" rel="noopener noreferrer">
                  <Button
                    w="full"
                    variant="outline"
                    colorPalette="gray"
                  >
                    MENTORSHIP LOGIN
                  </Button>
                </a>
              </Box>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </DrawerRoot>
    </Box>
  );
};

export const Navbar = ({ type }: { type: "website" | "app" }) => {
  return (
    <Box px="0" py="0" m="0" w="100vw" position="fixed" top="0" left="0" zIndex="docked">
      {/* Blauer Infobalken */}
      <Box
        w="100vw"
        bg="#1296f6"
        color="white"
        fontSize="xs"
        px="4"
        py="2"
        textAlign="center"
      >
        Nicht sicher, wann du starten sollst?{' '}
        <Link
          href="/checkout"
          color="white"
          textDecoration="underline"
          fontWeight="bold"
        >
          DANN FANG JETZT AN &gt;
        </Link>
      </Box>

             {/* Navbar */}
       <Box
         as="header"
         w="100vw"
         background="white"
         px="0"
         py="1"
         boxShadow="0 2px 8px rgba(0,0,0,0.06)"
         borderBottom="1px solid #e2e8f0"
       >
         <Box w={{ base: "100%", md: "80%" }} mx="auto" px="4" py="2">
          <HStack justify="space-between" w="full">
            {/* Logo ganz links */}
            <Link href="/">
              <Heading
                as="h1"
                fontSize={{ base: "lg", md: "2xl" }}
                fontWeight="700"
                lineHeight="0.9"
                bg="linear-gradient(0deg, #000000 0%, #6b7280 100%)"
                bgClip="text"
              >
                SNT-TRADES™
              </Heading>
            </Link>
            
            {/* Rechte Seite mit Navigation und Buttons */}
            <HStack gap="4">
              {/* Desktop Navigation */}
              <DesktopNavigation />
              
              {/* Desktop Buttons */}
              <HStack gap="1" display={{ base: "none", md: "flex" }}>
                <a href="https://snt-mentorship-platform.de" target="_blank" rel="noopener noreferrer">
                  <Button
                    size="sm"
                    variant="outline"
                    colorPalette="gray"
                  >
                    MENTORSHIP LOGIN
                  </Button>
                </a>
                <Link href="/checkout">
                  <Button size="sm"  bg="blue.500" _hover={{ bg: "blue.400" }}>
                    FANG ENDLICH AN
                  </Button>
                </Link>
              </HStack>
              
                             {/* Mobile: Nur FANG ENDLICH AN Button + Hamburger */}
               <HStack gap="2" display={{ base: "flex", md: "none" }}>
                 <Link href="/checkout">
                   <Button size="sm"  bg="#1E88E5" _hover={{ bg: "blue.300" }} fontSize="xx-small">
                     FANG ENDLICH AN
                   </Button>
                 </Link>
                 <MobileNavigation />
               </HStack>
            </HStack>
          </HStack>
        </Box>
      </Box>
    </Box>
  );
};

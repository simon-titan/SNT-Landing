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
import { useRouter, usePathname } from "next/navigation";

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

export const Navbar = ({ type }: { type: "website" | "app" }) => {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <Box px="4" py="2" m="0" w="100vw" position="fixed" top="0" left="0" zIndex="docked" style={{margin:0, padding:0, border:0}}>
      {/* Blauer Infobalken */}
      <Box
        w="100vw"
        bg="#1296f6"
        color="white"
        fontSize="sm"
        px="4"
        py="4"
        textAlign="center"
        style={{ pointerEvents: "auto", margin: 0, boxShadow: "none", border: 0, borderBottom: "none", padding: 0 }}
      >
        Nicht sicher, wann du starten sollst?{' '}
        <Link
          href="#"
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
        py="2"
        boxShadow="0 2px 8px rgba(0,0,0,0.06)"
        borderBottom="1px solid #e2e8f0"
        style={{ margin: 0, borderTop: "none", padding: 0 }}
      >
        <Box w="80%" mx="auto" px="4" py="2">
          <HStack gap={{ base: "3", md: "8" }} justify="space-between" w="full">
            {/* Logo links */}
            <Link href="/">
              <Heading
                as="h1"
                fontSize={{ base: "xl", md: "2xl" }}
                fontWeight="700"
                lineHeight="0.9"
                bg="linear-gradient(0deg, #000000 0%, #6b7280 100%)"
                bgClip="text"
              >
                SNT-TRADES™
              </Heading>
            </Link>
            {/* Navigation + Buttons rechts */}
            <HStack gap={{ base: 2, md: 8 }}>
              <HStack gap="6" as="nav">
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
                      <Link href="/Produkte/SNTTRADES-AUSBILDUNG">Mentorship (Paid-Kurs)</Link>
                    </MenuItem>
                  </MenuContent>
                </MenuRoot>
                <Link href="/Resultate">
                  <Button
                    variant="ghost"
                    colorPalette="gray"
                  >
                    Resultate
                  </Button>
                </Link>
              </HStack>
              {/* Rechts: Buttons */}
              <HStack gap="2">
                <a href="https://snt-mentorship-platform.de" target="_blank" rel="noopener noreferrer">
                  <Button
                    size="sm"
                    variant="outline"
                    colorPalette="gray"
                  >
                    MENTORSHIP LOGIN
                  </Button>
                </a>
                <Button size="sm" colorScheme="blue">
                  FANG ENDLICH AN
                </Button>
              </HStack>
            </HStack>
          </HStack>
        </Box>
      </Box>
    </Box>
  );
};

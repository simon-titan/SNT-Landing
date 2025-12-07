"use client";
import { HStack, VStack, Box, Heading, IconButton, Icon, } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import { UserMenu } from "../ui/user-menu";
import { Link } from "@/components/ui/link";
import { SignedIn, SignedOut } from "../auth/protect-content";
import { Login, SignUp } from "../auth/embed";
import { MenuContent, MenuItem, MenuItemGroup, MenuRoot, MenuSeparator, MenuTrigger, } from "../ui/menu";
import { DrawerRoot, DrawerTrigger, DrawerContent, DrawerHeader, DrawerBody, DrawerCloseTrigger, DrawerBackdrop, DrawerTitle, } from "../ui/drawer";
import { useRouter, usePathname } from "next/navigation";
import { List, Question } from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";
import { CloseButton } from "../ui/close-button";
const SNT_BLUE = "#068CEF";
const SNT_YELLOW = "rgba(251, 191, 36, 1)";
export const MenuLink = (props) => {
    return (<Link href={props.href} w="full">
      <Button colorPalette="gray" variant={{ base: "ghost", md: "plain" }} width={{ base: "full", md: "auto" }} justifyContent={{ base: "flex-start", md: "center" }}>
        {props.children}
      </Button>
    </Link>);
};
// TODO: Improve nav links
export const NavbarLinkMenu = (props) => {
    return (<>
      <MenuLink href="/docs">Docs</MenuLink>
      <MenuRoot>
        <MenuTrigger asChild>
          <Button colorPalette="gray" width={{ base: "full", md: "auto" }} variant={{ base: "ghost", md: "plain" }} justifyContent={{ base: "flex-start", md: "center" }}>
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
    </>);
};
export const NavbarActionMenu = ({ type }) => {
    const pathname = usePathname();
    const isRegisterPage = pathname === "/register";
    const handleSignUpClick = (e) => {
        if (isRegisterPage) {
            e.preventDefault();
            e.stopPropagation();
            // Dispatch custom event to open modal
            window.dispatchEvent(new CustomEvent("openRegistrationModal"));
        }
    };
    return (<>
      <SignedOut>
        <Login popup>
          <Button size="sm" variant="outline" colorPalette="gray">
            Login
          </Button>
        </Login>
        {isRegisterPage ? (<Button size="sm" onClick={handleSignUpClick}>
            Sign up
          </Button>) : (<SignUp popup>
            <Button size="sm">Sign up</Button>
          </SignUp>)}
      </SignedOut>
      <SignedIn>
        {type == "app" ? (<UserMenu />) : (<>
            <Button size="sm">Go to app</Button>
          </>)}
      </SignedIn>
    </>);
};
// Navigation Links Komponente für Desktop
const DesktopNavigation = () => {
    const router = useRouter();
    const pathname = usePathname();
    return (<HStack gap="6" as="nav" display={{ base: "none", md: "flex" }}>
      <Button variant="ghost" colorPalette="gray" onClick={() => {
            if (pathname === "/") {
                const el = document.getElementById('winnings');
                if (el)
                    el.scrollIntoView({ behavior: 'smooth' });
            }
            else {
                router.push('/#winnings');
            }
        }}>
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
      
    </HStack>);
};
// Mobile Navigation Drawer
const MobileNavigation = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const handleNavigate = (action) => {
        setIsOpen(false);
        setTimeout(action, 100); // Delay für smoother UX
    };
    return (<Box display={{ base: "block", md: "none" }}>
      <DrawerRoot open={isOpen} onOpenChange={(e) => setIsOpen(e.open)}>
        <DrawerTrigger asChild>
          <IconButton aria-label="Menü öffnen" variant="outline" size="sm" colorScheme="blue">
            <Icon>
              <List />
            </Icon>
          </IconButton>
        </DrawerTrigger>
        <DrawerBackdrop />
        <DrawerContent bg="white">
          <DrawerHeader>
            <DrawerTitle></DrawerTitle>
            <DrawerCloseTrigger asChild>
            <CloseButton size="xl" colorScheme="red"/>
            </DrawerCloseTrigger>
          </DrawerHeader>
          <DrawerBody>
            <VStack gap="6" align="stretch" py="4">
              {/* Support Link für Mobile */}
              <Button w="full" height="48px" fontSize="lg" variant="ghost" color="black" onClick={() => handleNavigate(() => router.push('/support'))}>
                SUPPORT
              </Button>
              
              {/* Mentorship Login für Mobile */}
              <a href="https://snt-mentorship-platform.de" target="_blank" rel="noopener noreferrer" style={{ width: '100%' }}>
                <Button w="full" height="48px" fontSize="lg" variant="ghost" color="black" onClick={() => setIsOpen(false)}>
                  PLATTFORM LOGIN
                </Button>
              </a>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </DrawerRoot>
    </Box>);
};
export const Navbar = ({ type }) => {
    return (<Box px="0" py="0" m="0" w="100vw" position="fixed" top="0" left="0" zIndex="sticky">
      {/* Navbar */}
      <Box as="header" w="100vw" background="#000000" px="0" py="0" boxShadow="0 14px 40px -14px rgba(255,255,255,0.25)" borderBottom="1px solid rgba(255,255,255,0.15)">
        <Box w="100%" mx="auto" px="4" py="2">
          <Box position="relative" w="full" h="44px" display="flex" alignItems="center">
            {/* Help Icon links - absolut positioniert */}
            <Box position="absolute" left="4" top="50%" transform="translateY(-50%)" display={{ base: "none", md: "block" }}>
              <Link href="/support">
                <IconButton aria-label="Support" variant="ghost" size="md" color={SNT_BLUE} _hover={{
            bg: "rgba(6,140,239,0.1)",
            color: SNT_BLUE
        }}>
                  <Icon>
                    <Question size={20}/>
                  </Icon>
                </IconButton>
              </Link>
            </Box>

            {/* SNTTRADES Logo exakt mittig */}
            <Box position="absolute" left="50%" top="50%" transform="translate(-50%, -50%)">
              <Link href="/" _hover={{ textDecoration: "none" }}>
                <Heading as="h1" fontSize={{ base: "md", md: "lg" }} fontWeight="800" fontFamily="var(--font-horizon), Inter, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" lineHeight="0.9" color={SNT_BLUE} transition="all 0.3s ease" whiteSpace="nowrap">
                  SNTTRADES
                </Heading>
              </Link>
            </Box>
            
            {/* Mentorship Login Button rechts - absolut positioniert */}
            <Box position="absolute" right="4" top="50%" transform="translateY(-50%)" display={{ base: "none", md: "block" }}>
              <a href="https://snt-mentorship-platform.de" target="_blank" rel="noopener noreferrer">
                <Button size="xs" height="28px" fontSize="xs" bg="rgba(6,140,239,0.08)" color={SNT_BLUE} border="1px solid rgba(6,140,239,0.45)" backdropFilter="blur(10px) saturate(160%)" boxShadow="0 0 20px rgba(6,140,239,0.35), inset 0 0 12px rgba(6,140,239,0.15)" _hover={{
            bg: "rgba(6,140,239,0.16)",
            boxShadow: "0 0 26px rgba(6,140,239,0.5), inset 0 0 14px rgba(6,140,239,0.2)"
        }} _active={{
            bg: "rgba(6,140,239,0.22)",
            boxShadow: "0 0 18px rgba(6,140,239,0.45), inset 0 0 10px rgba(6,140,239,0.22)"
        }} whiteSpace="nowrap">
                  PLATTFORM LOGIN
                </Button>
              </a>
            </Box>

            {/* Mobile: Nur Hamburger Menu - absolut positioniert */}
            <Box position="absolute" right="4" top="50%" transform="translateY(-50%)" display={{ base: "block", md: "none" }}>
              <MobileNavigation />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>);
};

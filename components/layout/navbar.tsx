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
} from "@chakra-ui/react";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";
import { CollapsibleTrigger } from "@/components/ui/collapsible-trigger";
import { UserMenu } from "../ui/user-menu";
import { Link } from "@/components/ui/link";
import { SignedIn, SignedOut } from "../auth/protect";
import { Login, SignUp } from "../auth/embed";
import {
  MenuContent,
  MenuItem,
  MenuItemGroup,
  MenuRoot,
  MenuSeparator,
  MenuTrigger,
} from "../ui/menu";

// TODO: Improve nav links
export const NavbarLinks = (props: StackProps) => {
  return (
    <>
      <Link href="/docs">
        <Button colorPalette="gray" variant="plain">
          Docs
        </Button>
      </Link>
      <MenuRoot>
        <MenuTrigger asChild>
          <Button colorPalette="gray" variant="plain">
            Demo
          </Button>
        </MenuTrigger>
        <MenuContent>
          <MenuItemGroup title="Pages">
            <Link href="/pricing">
              <MenuItem value="pricing" cursor="pointer">
                Pricing
              </MenuItem>
            </Link>
            <Link href="/contact">
              <MenuItem value="contact" cursor="pointer">
                Contact
              </MenuItem>
            </Link>
          </MenuItemGroup>
          <MenuSeparator />
          <MenuItemGroup title="Utility">
            <Link href="/thank-you">
              <MenuItem value="thank-you" cursor="pointer">
                Thank you
              </MenuItem>
            </Link>
            <Link href="/not-found">
              <MenuItem value="not-found" cursor="pointer">
                Not found
              </MenuItem>
            </Link>
            <Link href="/javascript">
              <MenuItem value="javascript" cursor="pointer">
                Javascript
              </MenuItem>
            </Link>
            <Link href="/legal/terms-and-conditions">
              <MenuItem value="terms-and-conditions" cursor="pointer">
                Terms & Conditions
              </MenuItem>
            </Link>
          </MenuItemGroup>
          <MenuSeparator />
          <MenuItemGroup title="Auth">
            <Link href="/app/basic">
              <MenuItem value="basic" cursor="pointer">
                Protected Page (Basic plan)
              </MenuItem>
            </Link>
            <Link href="/app/pro">
              <MenuItem value="pro" cursor="pointer">
                Protected Page (Pro plan)
              </MenuItem>
            </Link>
          </MenuItemGroup>
          <MenuSeparator />
          <MenuItemGroup title="Embeds">
            <Link href="/embed/login">
              <MenuItem value="login" cursor="pointer">
                Login
              </MenuItem>
            </Link>

            <Link href="/embed/lead-capture">
              <MenuItem value="lead-capture" cursor="pointer">
                Lead Capture
              </MenuItem>
            </Link>
            <Link href="/embed/email-list">
              <MenuItem value="email-list" cursor="pointer">
                Email List
              </MenuItem>
            </Link>
          </MenuItemGroup>
        </MenuContent>
      </MenuRoot>
      <Link href="/pricing">
        <Button colorPalette="gray" variant="plain">
          About
        </Button>
      </Link>
    </>
  );
};

export const Navbar = ({ type }: { type: "website" | "app" }) => {
  console.log(type);
  return (
    <Center as="header" position="fixed" zIndex="docked" top="6" w="full">
      <Container maxW={{ base: "full", md: "3xl" }}>
        <Box
          w="full"
          px="4"
          py="3"
          boxShadow="xs"
          background="bg.panel"
          borderRadius="l3"
        >
          <CollapsibleRoot>
            <HStack gap={{ base: "3", md: "8" }} justify="space-between">
              <Link href="/">
                <Logo />
              </Link>
              <HStack gap="2" hideBelow="md">
                <SignedOut>
                  <NavbarLinks />
                  <Login popup>
                    <Button
                      size="sm"
                      variant="outline"
                      colorPalette="gray"
                      display={{ base: "none", md: "flex" }}
                    >
                      Login
                    </Button>
                  </Login>
                  <SignUp popup>
                    <Button size="sm" display={{ base: "none", md: "flex" }}>
                      Sign up
                    </Button>
                  </SignUp>
                </SignedOut>
                <SignedIn>
                  {type == "app" ? (
                    <UserMenu />
                  ) : (
                    <>
                      <NavbarLinks hideBelow="md" />
                      <Link href="/app/">
                        <Button size="sm">Go to app</Button>
                      </Link>
                    </>
                  )}
                </SignedIn>
              </HStack>
              <CollapsibleTrigger />
            </HStack>
            <CollapsibleContent hideFrom="md">
              <VStack>
                <SignedOut>
                  <NavbarLinks />
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
                    <>
                      <UserMenu />
                    </>
                  ) : (
                    <>
                      <NavbarLinks />
                      <Link href="/app/">
                        <Button size="sm">Go to app</Button>
                      </Link>
                    </>
                  )}
                </SignedIn>
              </VStack>
            </CollapsibleContent>
          </CollapsibleRoot>
        </Box>
      </Container>
    </Center>
  );
};

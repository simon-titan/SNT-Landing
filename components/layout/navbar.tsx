"use client";

import {
  Center,
  CollapsibleContent,
  CollapsibleRoot,
  Container,
  HStack,
  Spacer,
  VStack,
  Stack,
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

// TODO: Improve nav links
export const NavbarLinks = (props: StackProps) => {
  return (
    <>
      <Link href="/pricing">
        <Button colorPalette="gray" variant="plain">
          Pricing
        </Button>
      </Link>
      <Link href="/contact">
        <Button colorPalette="gray" variant="plain">
          Contact
        </Button>
      </Link>
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
      <Container maxW={{ base: "full", md: "2xl" }}>
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

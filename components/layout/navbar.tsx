"use client";

import {
  Center,
  CollapsibleContent,
  CollapsibleRoot,
  Container,
  HStack,
  Spacer,
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

export const NavbarLinks = (props: StackProps) => {
  return (
    <Stack
      direction={{ base: "column", md: "row" }}
      gap={{ base: "2", md: "0" }}
      {...props}
    >
      {["About", "Pricing"].map((item) => (
        <Link href={`/${item.toLowerCase()}`} key={item}>
          <Button colorPalette="gray" variant="plain">
            {item}
          </Button>
        </Link>
      ))}
    </Stack>
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
              <HStack>
                <Spacer hideFrom="md" />
                <SignedOut>
                  <HStack gap="2">
                    <NavbarLinks hideBelow="md" />

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
                  </HStack>
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
              <NavbarLinks pt="5" pb="2" alignItems="center" />
            </CollapsibleContent>
          </CollapsibleRoot>
        </Box>
      </Container>
    </Center>
  );
};

"use client";

import {
  Card,
  Center,
  CollapsibleContent,
  CollapsibleRoot,
  Container,
  HStack,
  Spacer,
  Stack,
  StackProps,
  Box,
  Text,
} from "@chakra-ui/react";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";
import { CollapsibleTrigger } from "@/components/ui/collapsible-trigger";
import { useAuth } from "../provider/auth-provider";
import { UserMenu } from "../ui/user-menu";
import { FeedbackButton } from "../ui/feedback-button";
import { Link } from "@/components/ui/link";
import Show from "../auth/show";

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

export const Navbar = () => {
  const { user, logout, openLogin, openSignup, openProfile, isLoading } =
    useAuth();
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

                {user ? (
                  <>
                    {/* <FeedbackButton /> */}
                    <UserMenu />
                  </>
                ) : !isLoading ? (
                  <>
                    <NavbarLinks hideBelow="md" />
                    <Button
                      size={{ base: "sm", md: "md" }}
                      variant="outline"
                      colorPalette="gray"
                      onClick={openLogin}
                      display={{ base: "none", md: "flex" }}
                    >
                      Login
                    </Button>
                    <Button
                      size={{ base: "sm", md: "md" }}
                      onClick={openSignup}
                      display={{ base: "none", md: "flex" }}
                    >
                      Sign up
                    </Button>
                  </>
                ) : null}
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

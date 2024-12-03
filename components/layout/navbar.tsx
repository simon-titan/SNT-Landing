"use client";

import {
  Center,
  CollapsibleContent,
  CollapsibleRoot,
  Container,
  HStack,
  Link,
  Spacer,
  Stack,
  StackProps,
} from "@chakra-ui/react";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";
import { CollapsibleTrigger } from "@/components/ui/collapsible-trigger";
import { useAuth } from "../provider/auth-provider";
import { UserMenu } from "../ui/user-menu";
import { FeedbackButton } from "../ui/feedback-button";

export const NavbarLinks = (props: StackProps) => {
  return (
    <Stack
      direction={{ base: "column", md: "row" }}
      gap={{ base: "6", md: "8" }}
      {...props}
    >
      {[].map((item) => (
        <Link
          key={item}
          fontWeight="medium"
          color="fg.muted"
          _hover={{
            _hover: { color: "colorPalette.fg", textDecoration: "none" },
          }}
        >
          {item}
        </Link>
      ))}
    </Stack>
  );
};

export const Navbar = () => {
  const { user, logout, openLogin, openSignup, openProfile, isLoading } =
    useAuth();

  return (
    <Center position="absolute" zIndex="docked" top="6" left="4" right="4">
      <Container
        background="bg.panel"
        borderRadius="l3"
        boxShadow="xs"
        maxW={{ base: "full", md: "2xl" }}
        px="4"
        py="3"
      >
        <CollapsibleRoot>
          <HStack gap={{ base: "3", md: "8" }} justify="space-between">
            <Logo />
            <HStack>
              <Spacer hideFrom="md" />
              <NavbarLinks hideBelow="md" />
              {user ? (
                <>
                  <FeedbackButton />
                  <UserMenu />
                </>
              ) : !isLoading ? (
                <>
                  <Button
                    size={{ base: "sm", md: "md" }}
                    variant="outline"
                    onClick={openLogin}
                  >
                    Login
                  </Button>
                  <Button size={{ base: "sm", md: "md" }} onClick={openSignup}>
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
      </Container>
    </Center>
  );
};

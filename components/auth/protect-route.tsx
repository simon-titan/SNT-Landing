"use client";

import { useAuth } from "../provider/auth-provider";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

import {
  AbsoluteCenter,
  Box,
  Spinner,
  Text,
  VStack,
  Group,
} from "@chakra-ui/react";
import { EmptyState } from "@/components/ui/empty-state";
import { Lock, SignIn } from "@phosphor-icons/react/dist/ssr";
import { OutsetaUser } from "@/types/outseta";
import { Profile, Login, SignUp } from "./embed";

// Add readonly to prevent accidental mutations
interface Plan
  extends Readonly<{
    uid: string;
    label: string;
  }> {}

interface ProtectedRouteProps
  extends Readonly<{
    children: React.ReactNode;
    pro?: boolean;
    basic?: boolean; // Consider removing if unused
    fallback?: React.ReactNode; // Consider removing if unused
  }> {}

function userHasAccessToPlans(
  plans: Plan[],
  user: OutsetaUser | null
): boolean {
  if (!user?.Account) return false;
  const planIdForUser = user.Account.CurrentSubscription?.Plan?.Uid;
  return !!plans.find((plan) => plan.uid === planIdForUser);
}

export default function ProtectedRoute({
  children,
  pro,
}: ProtectedRouteProps): React.ReactElement {
  const { user, isLoading, openLogin, openSignup, openProfile } = useAuth();

  const requiredPlans = pro
    ? [siteConfig.outsetaPlans.plans.pro]
    : [siteConfig.outsetaPlans.plans.basic, siteConfig.outsetaPlans.plans.pro];

  if (isLoading) {
    return (
      <Box p="relative" h="100vh" w="100vw">
        <AbsoluteCenter>
          <VStack>
            <Spinner
              color="primary.600"
              size="xl"
              borderWidth="4px"
              css={{ "--spinner-track-color": "colors.neutral.200" }}
            />
            <Text textStyle="lg" color="fg.subtle">
              Loading...
            </Text>
          </VStack>
        </AbsoluteCenter>
      </Box>
    );
  }

  const allowAccess = userHasAccessToPlans(requiredPlans, user);

  if (!user) {
    return (
      <Box p="relative" h="100vh" w="100vw">
        <AbsoluteCenter>
          <VStack>
            <EmptyState
              icon={<SignIn />}
              title="Login to continue"
              description={`This page is available only to users with a ${pro ? "Pro" : "Basic"} plan. To continue, log in to your existing account or sign up for a ${pro ? "Pro" : "Basic"} plan.`}
            >
              <Group>
                <Login popup>
                  <Button>Login</Button>
                </Login>
                <SignUp popup>
                  <Button variant="outline">Sign up</Button>
                </SignUp>
              </Group>
            </EmptyState>
          </VStack>
        </AbsoluteCenter>
      </Box>
    );
  } else if (allowAccess) {
    return children as React.ReactElement;
  } else {
    return (
      <Box p="relative" h="100vh" w="100vw">
        <AbsoluteCenter>
          <VStack>
            <EmptyState
              icon={<Lock />}
              title="Upgrade to unlock"
              description={`This page is available only to users with a ${requiredPlans[0].label} plan. To continue, please upgrade to a ${requiredPlans[0].label} plan.`}
            >
              <Profile
                data-tab="planChange"
                data-state-props={{ planUid: "LmJZpYmP" }}
              >
                <Button>Change plan</Button>
              </Profile>
            </EmptyState>
          </VStack>
        </AbsoluteCenter>
      </Box>
    );
  }
}

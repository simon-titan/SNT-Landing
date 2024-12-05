"use client";

import { useAuth } from "../provider/auth-provider";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

const PLANS = siteConfig.outsetaPlans.plans;

function hasCorrectPlan(
  plans: Array<(typeof PLANS)[keyof typeof PLANS]>,
  user: any
): boolean {
  if (user) {
    const planIdForUser = user.Account?.CurrentSubscription?.Plan?.Uid;
    return !!plans.find((plan) => plan.uid === planIdForUser);
  }
  return false;
}

interface ProtectedRouteProps {
  pro?: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function ProtectedRoute({
  pro,
  children,
  fallback = <p>Authenticating...</p>,
}: ProtectedRouteProps) {
  const { user, openLogin, openSignup, openProfile, isLoading } = useAuth();

  const plansWithAccess = pro ? [PLANS.pro] : [PLANS.basic, PLANS.pro];
  const allowAccess = hasCorrectPlan(plansWithAccess, user);

  if (isLoading) return fallback;

  if (allowAccess) {
    return <>{children}</>;
  } else if (user) {
    return (
      <>
        <p>
          To access this content you need to upgrade to the{" "}
          <strong>{plansWithAccess[0].label}</strong> plan.
        </p>
        <Button onClick={() => openProfile({ tab: "planChange" })}>
          Upgrade
        </Button>
      </>
    );
  } else {
    return (
      <>
        <p>
          To access this content you need to{" "}
          <Button variant="ghost" onClick={openSignup}>
            signup
          </Button>{" "}
          for the <strong>{plansWithAccess[0].label}</strong> plan.
        </p>
        <p>
          Or{" "}
          <Button variant="ghost" onClick={openLogin}>
            login
          </Button>{" "}
          if you already have an account.
        </p>
      </>
    );
  }
}

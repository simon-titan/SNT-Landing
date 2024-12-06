"use client";

import { useAuth } from "../provider/auth-provider";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

interface ProtectedRouteProps {
  children: React.ReactNode;
  pro?: boolean;
  basic?: boolean;
  fallback?: React.ReactNode;
}

function hasCorrectPlan(plans, user) {
  if (user) {
    const planIdForUser = user.Account?.CurrentSubscription?.Plan?.Uid;
    return !!plans.find((plan) => plan.uid === planIdForUser);
  } else {
    return false;
  }
}

export default function ProtectedRoute({ children, pro }: ProtectedRouteProps) {
  const { user, isLoading, openLogin, openSignup, openProfile } = useAuth();

  const plansWithAccess = pro
    ? [siteConfig.outsetaPlans.plans.pro]
    : [siteConfig.outsetaPlans.plans.basic, siteConfig.outsetaPlans.plans.pro];
  const allowAccess = hasCorrectPlan(plansWithAccess, user);

  if (allowAccess) {
    return children;
  } else if (user) {
    return (
      <div>
        <p>
          To access this content you need to{" "}
          <Button onClick={openSignup}>sign up</Button> for the{" "}
          <strong>{pro ? "Pro" : "Basic"}</strong> plan or{" "}
          <Button onClick={openLogin}>log in</Button> if you already have an
          account.
        </p>
      </div>
    );
  } else {
    return (
      <>
        <p>
          To access this content you need to{" "}
          <Button onClick={openSignup}>signup</Button> for the{" "}
          <strong>{plansWithAccess[0].label}</strong> plan.
        </p>

        <p>
          Or <Button onClick={openLogin}>login</Button> if you already have an
          account.
        </p>
      </>
    );
  }
}

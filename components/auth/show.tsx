import { Box } from "@chakra-ui/react";
import { siteConfig } from "@/config/site";

const billingStages = {
  trialing: 2,
  subscribing: 3,
  canceling: 4,
  expired: 5,
  trialExpired: 6,
  pastDue: 7,
  cancellingTrial: 8,
};

interface AuthenticatedProps {
  children: React.ReactNode;
  trialing?: boolean;
  subscribing?: boolean;
  canceling?: boolean;
  expired?: boolean;
  trialExpired?: boolean;
  pastDue?: boolean;
  cancellingTrial?: boolean;
}

const getActiveStages = (billingProps: Record<string, boolean>) =>
  Object.entries(billingProps)
    .filter(([_, value]) => value)
    .map(([key]) => billingStages[key])
    .filter(Boolean)
    .join(",");

const Authenticated = ({ children, ...billingProps }: AuthenticatedProps) => {
  const activeStages = getActiveStages(billingProps);

  return (
    <Box
      asChild
      data-o-authenticated="1"
      {...(activeStages && { "data-account-stage": activeStages })}
    >
      {children}
    </Box>
  );
};

const Anonymous = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box asChild data-o-anonymous="1">
      {children}
    </Box>
  );
};

interface PlansProps {
  children: React.ReactNode;
  pro?: boolean;
  basic?: boolean;
  trialing?: boolean;
  subscribing?: boolean;
  canceling?: boolean;
  expired?: boolean;
  trialExpired?: boolean;
  pastDue?: boolean;
  cancellingTrial?: boolean;
}

const Plan = ({ children, pro, basic, ...billingProps }: PlansProps) => {
  const activeStages = getActiveStages(billingProps);

  const planUid = pro
    ? siteConfig.outsetaPlans.plans.pro.uid
    : basic
      ? siteConfig.outsetaPlans.plans.basic.uid
      : "";

  if (!planUid) {
    console.warn("Show.Plans component requires either pro or basic prop");
    return null;
  }

  return (
    <Box
      asChild
      data-o-plan-content={planUid}
      {...(activeStages && { "data-account-stage": activeStages })}
    >
      {children}
    </Box>
  );
};

interface AddOnProps {
  children: React.ReactNode;
  uid: string;
}

const AddOn = ({ children, uid }: AddOnProps) => {
  return (
    <Box asChild data-o-plan-content={uid}>
      {children}
    </Box>
  );
};

const Show = () => null;

Show.Authenticated = Authenticated;
Show.Anonymous = Anonymous;
Show.Plan = Plan;
Show.AddOn = AddOn;

export default Show;

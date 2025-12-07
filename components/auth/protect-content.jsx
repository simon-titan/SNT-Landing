"use client";
// TODO: Add similiar logic to protect-route.tsx
import { useAuth } from "../provider/auth-provider";
const billingStages = {
    trialing: 2,
    subscribing: 3,
    canceling: 4,
    expired: 5,
    trialExpired: 6,
    pastDue: 7,
    cancellingTrial: 8,
};
export function SignedIn({ children, accountStage, plan, addOn, isPrimaryContact, }) {
    const { user } = useAuth();
    if (!user?.Account)
        return null;
    // Check account stage
    if (accountStage &&
        billingStages[accountStage] !== user.Account.AccountStage) {
        return null;
    }
    // Check plans (any match)
    if (plan) {
        const planUids = plan.split(",").map((p) => p.trim());
        const currentPlanUid = user.Account.CurrentSubscription?.Plan?.Uid;
        if (!currentPlanUid || !planUids.includes(currentPlanUid)) {
            return null;
        }
    }
    // Check add-ons (any match)
    if (addOn) {
        const addOnUids = addOn.split(",").map((a) => a.trim());
        const hasAddOn = user.Account.CurrentSubscription?.SubscriptionAddOns?.some((subscription) => addOnUids.includes(subscription.AddOn.Uid));
        if (!hasAddOn)
            return null;
    }
    // Check primary contact
    if (isPrimaryContact && user.Email !== user.Account.PrimaryContact?.Email) {
        return null;
    }
    return <>{children}</>;
}
export function SignedOut({ children }) {
    const { user } = useAuth();
    if (user?.Account)
        return null;
    return <>{children}</>;
}
export function Show({ children, condition, fallback }) {
    if (!condition) {
        return fallback ? <>{fallback}</> : null;
    }
    return <>{children}</>;
}

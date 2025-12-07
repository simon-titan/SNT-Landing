import { projectConfig } from "@/config";
export const plans = [
    {
        value: "basic",
        title: "Basic",
        description: "For small teams looking to get started with our platform",
        features: [
            { title: "2 teams", icon: "team" },
            { title: "3 users", icon: "user" },
            { title: "100GB storage", icon: "storage" },
            { title: "Basic support", icon: "help" },
        ],
        priceCurrency: "US",
        priceSymbol: "$",
        monthlyPrice: { unit: "month", price: 12 },
        yearlyPrice: { unit: "year", price: 10 },
        uid: projectConfig.auth.plans.monatlich.uid,
    },
    {
        value: "pro",
        title: "Pro",
        description: "For teams looking to scale their operations",
        features: [
            { title: "5 teams", icon: "team" },
            { title: "10 users", icon: "user" },
            { title: "500GB storage", icon: "storage" },
            { title: "Priority support", icon: "help" },
        ],
        priceCurrency: "US",
        priceSymbol: "$",
        recommended: true,
        monthlyPrice: { unit: "month", price: 25 },
        yearlyPrice: { unit: "year", price: 20 },
        uid: projectConfig.auth.plans.monatlich.uid,
    },
];

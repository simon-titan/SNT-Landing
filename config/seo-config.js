import { generalConfig } from "./general-config";
export const seoConfig = {
    titleTemplate: `%s | ${generalConfig.name}`,
    defaultTitle: `${generalConfig.name} - ${generalConfig.title}`,
    defaultDescription: generalConfig.description,
    ogImage: "/og-image.jpg",
    robotsDisallowPaths: ["/app/*", "/api/*"],
    twitterHandle: "@yourtwitterhandle",
    locale: "en_US",
};

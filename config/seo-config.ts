import { generalConfig } from "./general-config";

export const seoConfig = {
  titleTemplate: `%s | ${generalConfig.name}`,
  defaultTitle: `${generalConfig.name} - ${generalConfig.title}`,
  defaultDescription: generalConfig.description,
  ogImage: "/public/Screenshot 2025-12-12 211953.png",
  robotsDisallowPaths: ["/app/*", "/api/*"],
  twitterHandle: "@yourtwitterhandle",
  locale: "en_US",
};

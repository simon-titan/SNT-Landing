import { projectConfig } from "@/config";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: projectConfig.seo.robotsDisallowPaths,
      },
    ],
    sitemap: `${projectConfig.general.siteUrl}/sitemap.xml`,
  };
}

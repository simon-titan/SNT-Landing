import { siteConfig } from "@/config/site";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: siteConfig.seo.robotsDisallowPaths,
      },
    ],
    sitemap: `${siteConfig.siteUrl}/sitemap.xml`,
  };
}

import { siteConfig } from "@/config/site";

export default async function sitemap() {
  const baseUrl = siteConfig.siteUrl;

  // Add your public routes here
  const routes = [
    "",
    "/about",
    "/contact",
    "/legal/privacy-policy",
    "/legal/terms-and-conditions",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
  }));

  return routes;
}

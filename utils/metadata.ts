import { Metadata } from "next";
import { siteConfig } from "@/config/site";

interface GenerateMetadataProps {
  title?: string;
  description?: string;
  path?: string;
  noIndex?: boolean;
}

export function generateMetadata({
  title,
  description,
  path = "",
  noIndex = false,
}: GenerateMetadataProps): Metadata {
  const fullTitle = title
    ? title + " | " + siteConfig.name
    : siteConfig.seo.defaultTitle;

  const fullDescription = description || siteConfig.seo.defaultDescription;
  const url = `${siteConfig.siteUrl}${path}`;

  return {
    title: fullTitle,
    description: fullDescription,
    robots: noIndex ? "noindex, nofollow" : "index, follow",
    metadataBase: new URL(siteConfig.siteUrl),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description: fullDescription,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.seo.locale,
      type: "website",
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: fullDescription,
      creator: siteConfig.seo.twitterHandle,
      images: [siteConfig.ogImage],
    },
  };
}

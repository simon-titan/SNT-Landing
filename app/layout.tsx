"use client";

import { Inter } from "next/font/google";
import Provider from "@/components/provider/provider";
import Head from "next/head";
import { siteConfig } from "@/config/site";
import { useChatVisibility } from "@/utils/use-chat-visibility";
import "vanilla-cookieconsent/dist/cookieconsent.css";
import "@/styles/cookie-banner-styles.css";
import "@/styles/outseta-styles.css";
import * as CookieConsent from "vanilla-cookieconsent";
import { useEffect } from "react";
import Script from "next/script";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export default function AppLayout({ children }: { children: React.ReactNode }) {
  useChatVisibility();

  useEffect(() => {
    if (siteConfig.cookieBannerOptions) {
      CookieConsent.run(siteConfig.cookieBannerOptions as any);
    } else {
      console.warn("Cookie banner options are not defined in siteConfig.");
    }
  }, []);

  return (
    <html suppressHydrationWarning className="cc--theme light">
      <Head>
        <title>Project Starter</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <noscript>
          <meta httpEquiv="refresh" content="0; url=/javascript" />
        </noscript>
      </Head>
      <body className={inter.className}>
        <Script
          id="outseta-config"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `var o_options = ${JSON.stringify(siteConfig.outsetaOptions)};`,
          }}
        />
        <Script
          id="outseta-script"
          src="https://cdn.outseta.com/outseta.min.js"
          data-options="o_options"
          strategy="beforeInteractive"
          onLoad={() => {
            console.log("Outseta loaded successfully");
          }}
          onError={(e) => {
            console.error("Error loading Outseta:", e);
          }}
        />
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}

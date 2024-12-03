"use client";

import { Inter } from "next/font/google";
import Provider from "@/components/provider/provider";
import Script from "next/script";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});
import Head from "next/head";
import { outsetaOptions } from "@/config/outseta";

console.log("outsetaOptions → ", outsetaOptions);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <Head>
        <title>Project Starter</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <body className={inter.className}>
        <Script
          id="outseta-config"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: outsetaOptions,
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

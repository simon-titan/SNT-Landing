"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/layout/footer";

export default function FooterConditional() {
  const pathname = usePathname();
  if (pathname?.startsWith("/protocol") || pathname?.startsWith("/apex")) return null;
  return <Footer />;
}

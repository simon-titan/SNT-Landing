"use client";
import { Navbar } from "@/components/layout/navbar";
import { usePathname } from "next/navigation";

export default function NavbarConditional() {
  const pathname = usePathname();
  if (pathname.startsWith("/checkout") || pathname.startsWith("/choose-platform")) return null;
  return <Navbar type="website" />;
} 
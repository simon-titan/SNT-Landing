"use client";
import { Navbar } from "@/components/layout/navbar";
import { usePathname } from "next/navigation";
import SupportNavbar from "@/components/layout/support-navbar";
import { Box } from "@chakra-ui/react";

export default function NavbarConditional() {
  const pathname = usePathname();
  if (pathname.startsWith("/checkout") || pathname.startsWith("/choose-platform") || pathname.startsWith("/legal")) return null;
  if (pathname.startsWith("/register") || pathname.startsWith("/waitlist"))
    return (
      <>
        <SupportNavbar />
        <Box h={{ base: "48px", md: "56px" }} bg="#000" />
      </>
    );
  return (
    <>
      <Navbar type="website" />
      <Box h={{ base: "88px", md: "100px" }} bg="white" />
    </>
  );
}
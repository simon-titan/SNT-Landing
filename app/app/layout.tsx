"use client";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Box } from "@chakra-ui/react";
import ProtectedRoute from "@/components/auth/protected-route";

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <Box as="main">{children}</Box>
    </>
  );
}

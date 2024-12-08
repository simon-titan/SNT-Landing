"use client";

import { Navbar } from "@/components/layout/navbar";
import { Box } from "@chakra-ui/react";
import ProtectedRoute from "@/components/auth/protect-route";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <Navbar type="app" />
      <Box as="main">{children}</Box>
    </ProtectedRoute>
  );
}

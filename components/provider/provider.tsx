"use client";

import { ChakraProvider, Box } from "@chakra-ui/react";
import { ThemeProvider } from "next-themes";
import { system } from "@/theme/theme";
import AuthProvider from "@/components/provider/auth-provider";

export default function Provider(props: { children: React.ReactNode }) {
  return (
    <ChakraProvider value={system}>
      <ThemeProvider attribute="class" disableTransitionOnChange>
        <AuthProvider>
          <Box colorPalette="primary">{props.children}</Box>
        </AuthProvider>
      </ThemeProvider>
    </ChakraProvider>
  );
}

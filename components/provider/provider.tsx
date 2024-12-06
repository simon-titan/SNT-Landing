"use client";

import { ChakraProvider, Box } from "@chakra-ui/react";
import { system } from "@/theme/theme";
import AuthProvider from "@/components/provider/auth-provider";
import { ColorModeProvider } from "./color-mode-provider";

export default function Provider(props: { children: React.ReactNode }) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider forcedTheme="light">
        <AuthProvider>
          <Box colorPalette="primary">{props.children}</Box>
        </AuthProvider>
      </ColorModeProvider>
    </ChakraProvider>
  );
}

"use client";

import { ChakraProvider, Box } from "@chakra-ui/react";
import { system } from "@/theme/theme";
import AuthProvider from "@/components/provider/auth-provider";
import { ColorModeProvider } from "./color-mode-provider";
import { siteConfig } from "@/config/site";

export default function Provider(props: { children: React.ReactNode }) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider
        {...(siteConfig.theme.colorMode !== "auto" && {
          forcedTheme: siteConfig.theme.colorMode,
        })}
      >
        <AuthProvider>
          <Box colorPalette="primary">{props.children}</Box>
        </AuthProvider>
      </ColorModeProvider>
    </ChakraProvider>
  );
}

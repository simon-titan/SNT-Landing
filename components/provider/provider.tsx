"use client";

import { ChakraProvider, Box } from "@chakra-ui/react";
import { system } from "@/theme/theme";
import AuthProvider from "@/components/provider/auth-provider";
import { ColorModeProvider } from "./color-mode-provider";
import AffiliateTracker from "@/components/affiliate/affiliate-tracker";
import { projectConfig } from "@/config";
import { Suspense } from "react";

export default function Provider(props: { children: React.ReactNode }) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider
        {...(projectConfig.theme.colorMode !== "auto" && {
          forcedTheme: projectConfig.theme.colorMode,
        })}
      >
        <Suspense fallback={null}>
          <AffiliateTracker />
        </Suspense>
        <AuthProvider>
          <Box colorPalette="primary">{props.children}</Box>
        </AuthProvider>
      </ColorModeProvider>
    </ChakraProvider>
  );
}

"use client";
import { ChakraProvider, Box } from "@chakra-ui/react";
import { system } from "@/theme/theme";
import AuthProvider from "@/components/provider/auth-provider";
import { ColorModeProvider } from "./color-mode-provider";
import { projectConfig } from "@/config";
export default function Provider(props) {
    return (<ChakraProvider value={system}>
      <ColorModeProvider {...(projectConfig.theme.colorMode !== "auto" && {
        forcedTheme: projectConfig.theme.colorMode,
    })}>
        <AuthProvider>
          <Box colorPalette="primary">{props.children}</Box>
        </AuthProvider>
      </ColorModeProvider>
    </ChakraProvider>);
}

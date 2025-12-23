"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ChakraProvider, Box } from "@chakra-ui/react";
import { system } from "@/theme/theme";
import AuthProvider from "@/components/provider/auth-provider";
import { ColorModeProvider } from "./color-mode-provider";
import AffiliateTracker from "@/components/affiliate/affiliate-tracker";
import { projectConfig } from "@/config";
import { Suspense } from "react";
export default function Provider(props) {
    return (_jsx(ChakraProvider, { value: system, children: _jsxs(ColorModeProvider, { ...(projectConfig.theme.colorMode !== "auto" && {
                forcedTheme: projectConfig.theme.colorMode,
            }), children: [_jsx(Suspense, { fallback: null, children: _jsx(AffiliateTracker, {}) }), _jsx(AuthProvider, { children: _jsx(Box, { colorPalette: "primary", children: props.children }) })] }) }));
}

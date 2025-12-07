"use client";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { ColorModeProvider, } from "../provider/color-mode-provider";
export function Provider(props) {
    return (<ChakraProvider value={defaultSystem}>
      <ColorModeProvider {...props}/>
    </ChakraProvider>);
}

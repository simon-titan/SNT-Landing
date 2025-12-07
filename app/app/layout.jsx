"use client";
import { Navbar } from "@/components/layout/navbar";
import { Box } from "@chakra-ui/react";
export default function AppLayout({ children }) {
    return (<>
      <Navbar type="app"/>
      <Box as="main">{children}</Box>
    </>);
}

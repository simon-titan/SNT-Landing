"use client";
import { Box } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { Link } from "@/components/ui/link";
export default function WebsiteLayout({ children, }) {
    return (<>
      <Box as="header" position="fixed" zIndex="docked" top="6" left="6" w="full">
        <Link href="/">
          <Button colorPalette="gray" variant="outline">
            <ArrowLeft />
            Zurück zur Startseite
          </Button>
        </Link>
      </Box>
      <Box as="main">{children}</Box>
    </>);
}

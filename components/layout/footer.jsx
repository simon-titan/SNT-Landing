import { Container, HStack, Icon, Stack, Text, Heading, Flex, Box, } from "@chakra-ui/react";
import { SiInstagram, SiTiktok } from "react-icons/si";
import { projectConfig } from "@/config";
import { Link } from "../ui/link";
const Copyright = (props) => {
    return (<Text fontSize="sm" color="fg.muted" {...props}>
      &copy; {new Date().getFullYear()} {projectConfig.general.name}. All rights
      reserved.
    </Text>);
};
// TODO: Map only which are available
const socialLinks = [
    { href: projectConfig.links.instagram, icon: <SiInstagram /> },
    { href: projectConfig.links.tiktok, icon: <SiTiktok /> },
];
const legalLinks = [
    { href: "/legal/impressum", label: "Impressum" },
    { href: "/legal/terms-and-conditions", label: "AGB" },
    { href: "/legal/privacy-policy", label: "Datenschutz" },
    { href: "/legal/eula", label: "EULA" },
    { href: "/legal/rueckgabe", label: "Rückgabe" },
    { href: "/legal/cookie-policy", label: "Cookie-Richtlinie" },
    { href: "/legal/disclaimer", label: "Disclaimer" },
];
export const Footer = () => (<>
    <Container as="footer" py={{ base: "10", md: "12" }}>
      <Stack gap="6">
        <Stack direction="row" justify="space-between" align="center">
          <Heading as="h1" fontSize={{ base: "xl", md: "2xl" }} fontWeight="800" lineHeight="0.9" fontFamily="'Horizon', system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif" color="white" textShadow="none" letterSpacing="tight">
            SNTTRADES
          </Heading>
          <HStack gap="4">
            {socialLinks.map(({ href, icon }, index) => (<Link key={index} href={href} colorPalette="gray">
                <Icon size="md">{icon}</Icon>
              </Link>))}
          </HStack>
        </Stack>
        
        <Box h="1px" bg="border.subtle"/>
        
        {/* Legal Links Section */}
        <Flex direction={{ base: "column", md: "row" }} justify="space-between" align={{ base: "start", md: "center" }} gap={{ base: 4, md: 0 }}>
          <Copyright />
          <Flex wrap="wrap" gap={{ base: 2, md: 4 }} justify={{ base: "start", md: "end" }} align="center">
            {legalLinks.map(({ href, label }, index) => (<Link key={index} href={href} fontSize="sm" color="fg.muted" _hover={{ color: "fg.default" }}>
                {label}
              </Link>))}
          </Flex>
        </Flex>
      </Stack>
    </Container>
  </>);

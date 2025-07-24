import {
  Container,
  HStack,
  Icon,
  Stack,
  Text,
  Heading,
  type TextProps,
} from "@chakra-ui/react";
import { SiInstagram, SiTiktok } from "react-icons/si";
import { projectConfig } from "@/config";
import { Link } from "../ui/link";

const Copyright = (props: TextProps) => {
  return (
    <Text fontSize="sm" color="fg.muted" {...props}>
      &copy; {new Date().getFullYear()} {projectConfig.general.name}. All rights
      reserved.
    </Text>
  );
};

// TODO: Map only which are available
const socialLinks = [
  { href: projectConfig.links.instagram, icon: <SiInstagram /> },
  { href: projectConfig.links.tiktok, icon: <SiTiktok /> },
];

export const Footer = () => (
  <Container as="footer" py={{ base: "10", md: "12" }}>
    <Stack gap="6">
      <Stack direction="row" justify="space-between" align="center">
        <Heading
          as="h1"
          fontSize={{ base: "xl", md: "2xl" }}
          fontWeight="700"
          lineHeight="0.9"
          bg="linear-gradient(0deg, #000000 0%, #6b7280 100%)"
          bgClip="text"
          filter="drop-shadow(0 0 10px rgba(156, 163, 175, 0.3))"
        >
          SNT-TRADES™ 
        </Heading>
        <HStack gap="4">
          {socialLinks.map(({ href, icon }, index) => (
            <Link key={index} href={href} colorPalette="gray">
              <Icon size="md">{icon}</Icon>
            </Link>
          ))}
        </HStack>
      </Stack>
      <Copyright />
    </Stack>
  </Container>
);
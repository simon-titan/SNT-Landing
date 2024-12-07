import NextLink from "next/link";
import {
  Link as ChakraLink,
  LinkOverlay,
  type LinkProps as ChakraLinkProps,
} from "@chakra-ui/react";
import { type LinkProps as NextLinkProps } from "next/link";
import {
  ArrowSquareOut,
  Headset,
  DownloadSimple,
  EnvelopeSimple,
} from "@phosphor-icons/react/dist/ssr";

export type LinkProps = Omit<ChakraLinkProps, "asChild"> & {
  href: NextLinkProps["href"];
  text?: boolean;
  textExternal?: boolean;
  support?: boolean;
  download?: boolean;
  email?: boolean;
};

export const Link = ({
  href,
  text,
  textExternal,
  support,
  download,
  email,
  ...props
}: LinkProps) => {
  if (text) {
    return (
      <ChakraLink asChild {...props}>
        <NextLink href={href}>{props.children}</NextLink>
      </ChakraLink>
    );
  }

  if (textExternal) {
    return (
      <ChakraLink asChild {...props}>
        <NextLink href={href}>
          {props.children}
          <ArrowSquareOut />
        </NextLink>
      </ChakraLink>
    );
  }

  if (email) {
    return (
      <ChakraLink asChild {...props}>
        <NextLink href={href}>
          {props.children}
          <EnvelopeSimple />
        </NextLink>
      </ChakraLink>
    );
  }

  if (support) {
    return (
      <ChakraLink asChild {...props}>
        <NextLink href={href}>
          {props.children}
          <Headset />
        </NextLink>
      </ChakraLink>
    );
  }

  if (download) {
    return (
      <ChakraLink asChild {...props}>
        <NextLink href={href}>
          {props.children}
          <DownloadSimple />
        </NextLink>
      </ChakraLink>
    );
  }

  return <NextLink href={href}>{props.children}</NextLink>;
};

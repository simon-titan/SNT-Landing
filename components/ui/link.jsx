import NextLink from "next/link";
import { Link as ChakraLink, } from "@chakra-ui/react";
import { ArrowSquareOut, Headset, DownloadSimple, EnvelopeSimple, } from "@phosphor-icons/react/dist/ssr";
export const Link = ({ href, text, textExternal, support, download, email, ...props }) => {
    if (text) {
        return (<ChakraLink asChild {...props}>
        <NextLink href={href}>{props.children}</NextLink>
      </ChakraLink>);
    }
    if (textExternal) {
        return (<ChakraLink asChild {...props}>
        <NextLink href={href}>
          {props.children}
          <ArrowSquareOut />
        </NextLink>
      </ChakraLink>);
    }
    if (email) {
        return (<ChakraLink asChild {...props}>
        <NextLink href={href}>
          {props.children}
          <EnvelopeSimple />
        </NextLink>
      </ChakraLink>);
    }
    if (support) {
        return (<ChakraLink asChild {...props}>
        <NextLink href={href}>
          {props.children}
          <Headset />
        </NextLink>
      </ChakraLink>);
    }
    if (download) {
        return (<ChakraLink asChild {...props}>
        <NextLink href={href}>
          {props.children}
          <DownloadSimple />
        </NextLink>
      </ChakraLink>);
    }
    return (<ChakraLink asChild {...props}>
      <NextLink href={href}>{props.children}</NextLink>
    </ChakraLink>);
};

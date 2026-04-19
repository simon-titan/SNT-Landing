import { Box } from "@chakra-ui/react";
import NavbarConditional from "../../components/layout/NavbarConditional";
import FooterConditional from "../../components/layout/FooterConditional";
export default function WebsiteLayout({ children, }) {
    return (<>
      <NavbarConditional />
      <Box as="main" overflowX="hidden">{children}</Box>
      <FooterConditional />
    </>);
}

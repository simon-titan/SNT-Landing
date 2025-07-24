import { Footer } from "@/components/layout/footer";
import { Box } from "@chakra-ui/react";
import NavbarConditional from "../../components/layout/NavbarConditional";

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavbarConditional />
      <Box as="main" overflowX="hidden">{children}</Box>
      <Footer />
    </>
  );
}

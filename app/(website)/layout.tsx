import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Box } from "@chakra-ui/react";

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar type="website" />
      <Box as="main">{children}</Box>
      <Footer />
    </>
  );
}

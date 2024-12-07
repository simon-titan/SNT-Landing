import { Heading } from "@chakra-ui/react";
import { generateMetadata } from "@/utils/metadata";
import { Section } from "@/components/layout/section";
import ProtectedRoute from "@/components/auth/protected-route";

export const metadata = generateMetadata({
  title: "Dashboard",
  description: "Access your personal dashboard and manage your account",
  noIndex: true,
});

export default function Pro() {
  return (
    <ProtectedRoute pro>
      <Section header>
        <Heading>Pro</Heading>
      </Section>
    </ProtectedRoute>
  );
}

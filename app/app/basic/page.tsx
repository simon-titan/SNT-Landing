import { Heading } from "@chakra-ui/react";
import { generateMetadata } from "@/utils/metadata";
import { Section } from "@/components/layout/section";
import ProtectedRoute from "@/components/auth/protect-route";

export default function Basic() {
  return (
    <ProtectedRoute plansWithAccess="basic">
      <Section header>
        <Heading>Basic</Heading>
      </Section>
    </ProtectedRoute>
  );
}

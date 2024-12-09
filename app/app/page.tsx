import { Heading, Text } from "@chakra-ui/react";
import { generateMetadata } from "@/utils/metadata";
import { Section } from "@/components/layout/section";
import { SignedIn } from "../../components/auth/protect";
import { LogOut } from "@/components/auth/embed";

export const metadata = generateMetadata({
  title: "Dashboard",
  description: "Access your personal dashboard and manage your account",
  noIndex: true,
});

export default function App() {
  return (
    <SignedIn>
      <Section header>
        <Heading>App Page</Heading>
        <SignedIn isPrimaryContact={false}>
          <Text>Primary content</Text>
        </SignedIn>
      </Section>
    </SignedIn>
  );
}

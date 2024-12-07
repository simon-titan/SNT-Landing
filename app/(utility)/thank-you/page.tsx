import { Box, Button, VStack, AbsoluteCenter } from "@chakra-ui/react";
import { EnvelopeOpen, ArrowSquareOut } from "@phosphor-icons/react/dist/ssr";
import { Link } from "@/components/ui/link";
import Confetti from "@/components/ui/confetti";
import { generateMetadata } from "@/utils/metadata";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata = generateMetadata({
  title: "Thank You",
  description:
    "Thank you for signing up. Please check your email to complete registration",
  noIndex: true,
});

export default function ThankYouPage() {
  return (
    <>
      <Confetti />
      <Box p="relative" h="100vh" w="100vw">
        <AbsoluteCenter>
          <VStack>
            <EmptyState
              icon={<EnvelopeOpen />}
              title="Almost there! Check your inbox."
              description="We’ve sent you an email to complete your sign-up and set your
                password. If you don’t see it shortly, please check your spam
                folder."
            >
              <Box pt="4">
                <Link href="https://mail.google.com">
                  <Button size="sm">
                    <ArrowSquareOut weight="duotone" />
                    Open Gmail
                  </Button>
                </Link>
              </Box>
            </EmptyState>
          </VStack>
        </AbsoluteCenter>
      </Box>
    </>
  );
}

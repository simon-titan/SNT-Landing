import { Box, Button, VStack, AbsoluteCenter } from "@chakra-ui/react";
import { EnvelopeOpen, ArrowSquareOut } from "@phosphor-icons/react/dist/ssr";
import { Link } from "@/components/ui/link";
import Confetti from "@/components/ui/confetti";
import { generateMetadata } from "@/utils/metadata";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata = generateMetadata({
  title: "Vielen Dank",
  description:
    "Vielen Dank für deine Anmeldung zur SNT-Mentorship Trading-Plattform. Bitte prüfe deine E-Mails, um deine Registrierung abzuschließen.",
  noIndex: true,
});

export default function ThankYouPage() {
  return (
    <>
      <Confetti type="fireworks" />
      <Box p="relative" h="100vh" w="100vw">
        <AbsoluteCenter>
          <VStack>
            <EmptyState
              icon={<EnvelopeOpen />}
              title="Du hast es fast geschafft!"
              description="Wir haben dir eine E-Mail geschickt, dort findest du deine KOSTENLOSE Ressourcen Bibliothek, prüfe bitte auch deinen Spam-Ordner."
            >
           
            </EmptyState>
          </VStack>
        </AbsoluteCenter>
      </Box>
    </>
  );
}

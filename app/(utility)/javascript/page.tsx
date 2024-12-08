import { Box, VStack, AbsoluteCenter } from "@chakra-ui/react";
import { Code } from "@phosphor-icons/react/dist/ssr";
import { generateMetadata } from "@/utils/metadata";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata = generateMetadata({
  title: "JavaScript Required",
  description: "Please enable JavaScript to access this website",
  noIndex: true,
});

export default function ActivateJavaScriptPage() {
  return (
    <Box p="relative" h="100vh" w="100vw">
      <AbsoluteCenter>
        <VStack>
          <EmptyState
            icon={<Code />}
            title="JavaScript is required"
            description="This website requires JavaScript to function properly. Please enable JavaScript in your browser settings and reload the page."
          ></EmptyState>
        </VStack>
      </AbsoluteCenter>
    </Box>
  );
}

import { Box, VStack, AbsoluteCenter } from "@chakra-ui/react";
import { Code } from "@phosphor-icons/react/dist/ssr";
import { generateMetadata } from "@/utils/metadata";
import { EmptyState } from "@/components/ui/empty-state";
export const metadata = generateMetadata({
    title: "JavaScript erforderlich",
    description: "Bitte aktivieren Sie JavaScript, um auf diese Website zuzugreifen",
    noIndex: true,
});
export default function ActivateJavaScriptPage() {
    return (<Box p="relative" h="100vh" w="100vw">
      <AbsoluteCenter>
        <VStack>
          <EmptyState icon={<Code />} title="JavaScript ist erforderlich" description="Diese Website benötigt JavaScript, um ordnungsgemäß zu funktionieren. Bitte aktivieren Sie JavaScript in Ihren Browser-Einstellungen und laden Sie die Seite neu."></EmptyState>
        </VStack>
      </AbsoluteCenter>
    </Box>);
}

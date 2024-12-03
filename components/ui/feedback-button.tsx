import { MenuContent, MenuRoot, MenuTrigger } from "@/components/ui/menu";
import { Button } from "@/components/ui/button";
import { HStack, Text, VStack } from "@chakra-ui/react";
import { Textarea } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { ChatTeardropText } from "@phosphor-icons/react";

export const FeedbackButton = () => {
  const handleFeedbackSubmission = (feedback) => {
    console.log("Feedback sent");
  };

  return (
    <MenuRoot positioning={{ placement: "bottom" }}>
      <MenuTrigger asChild>
        <Button
          variant="outline"
          size="xs"
          data-o-account-activity="Open Feedback Form"
        >
          Feedback?
          <ChatTeardropText weight="bold" />
        </Button>
      </MenuTrigger>

      <MenuContent colorPalette={"primary"}>
        <VStack p={2}>
          <Field label="Feedback">
            <Textarea
              placeholder="Start typing..."
              variant="outline"
              h="140px"
            />
          </Field>
          <HStack w="full">
            <Button variant="solid" size="xs" w="full">
              Send
            </Button>
          </HStack>
        </VStack>
      </MenuContent>
    </MenuRoot>
  );
};

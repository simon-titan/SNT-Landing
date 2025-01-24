"use client";
import {
  Collapsible,
  Icon,
  IconButton,
  useCollapsibleContext,
} from "@chakra-ui/react";
import { List, X } from "@phosphor-icons/react/dist/ssr";

export const CollapsibleTrigger = () => {
  const context = useCollapsibleContext();
  return (
    <Collapsible.Trigger asChild>
      <IconButton
        aria-label="Open Menu"
        variant="ghost"
        size="sm"
        colorPalette="gray"
        hideFrom="md"
      >
        <Icon size="lg">{context.open ? <X /> : <List />}</Icon>
      </IconButton>
    </Collapsible.Trigger>
  );
};

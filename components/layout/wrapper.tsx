import { Box, type BoxProps } from "@chakra-ui/react";
import type React from "react";
import Markdown from "react-markdown";

export interface ContentProps extends BoxProps {
  children?: React.ReactNode;
}

export const Content = (props: ContentProps) => {
  const { ...rootProps } = props;
  return (
    <Box py={{ base: "16", md: "24" }} {...rootProps}>
      {props.children}
    </Box>
  );
};

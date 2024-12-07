import { EmptyState as ChakraEmptyState, VStack } from "@chakra-ui/react";
import * as React from "react";

export interface EmptyStateProps extends ChakraEmptyState.RootProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  function EmptyState(props, ref) {
    const { title, description, icon, children, ...rest } = props;
    return (
      <ChakraEmptyState.Root
        ref={ref}
        paddingInline={0}
        paddingBlock={0}
        width="full"
        {...rest}
      >
        <ChakraEmptyState.Content>
          {icon && (
            <ChakraEmptyState.Indicator>{icon}</ChakraEmptyState.Indicator>
          )}
          {description ? (
            <VStack textAlign="center">
              <ChakraEmptyState.Title textStyle="2xl" maxWidth="lg">
                {title}
              </ChakraEmptyState.Title>
              <ChakraEmptyState.Description textStyle="md" maxWidth="sm">
                {description}
              </ChakraEmptyState.Description>
            </VStack>
          ) : (
            <ChakraEmptyState.Title>{title}</ChakraEmptyState.Title>
          )}
          {children}
        </ChakraEmptyState.Content>
      </ChakraEmptyState.Root>
    );
  }
);

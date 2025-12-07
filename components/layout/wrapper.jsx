import { Box } from "@chakra-ui/react";
export const Content = (props) => {
    const { ...rootProps } = props;
    return (<Box py={{ base: "16", md: "24" }} {...rootProps}>
      {props.children}
    </Box>);
};

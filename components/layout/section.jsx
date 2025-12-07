import { Box, Container } from "@chakra-ui/react";
export const Section = ({ header, size = "md", ...props }) => {
    const { ...rootProps } = props;
    const paddingY = {
        sm: {
            base: "6",
            md: "8",
        },
        md: {
            base: "12",
            md: "16",
        },
        lg: {
            base: "16",
            md: "24",
        },
    };
    if (header) {
        const topPadding = (size) => {
            const conversion = {
                sm: {
                    base: "112px",
                    md: "120px",
                },
                md: {
                    base: "136px",
                    md: "152px",
                },
                lg: {
                    base: "152px",
                    md: "184px",
                },
            };
            return conversion[size];
        };
        return (<Box as="header" w="full" {...rootProps}>
        <Container maxW={{ base: "full", md: "3xl" }}>
          <Box pt={{ base: topPadding(size).base, md: topPadding(size).md }} pb={{ base: paddingY[size].base, md: paddingY[size].md }}>
            {props.children}
          </Box>
        </Container>
      </Box>);
    }
    return (<Box as="section" w="full" {...rootProps}>
      <Container maxW={{ base: "full", md: "3xl" }}>
        <Box py={{ base: paddingY[size].base, md: paddingY[size].md }}>
          {props.children}
        </Box>
      </Container>
    </Box>);
};

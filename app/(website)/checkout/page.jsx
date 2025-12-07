"use client";
import { Heading, Box, } from "@chakra-ui/react";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { SntPremiumPricing } from "@/components/ui/snt-premium-pricing";
const SNT_BLUE = "#068CEF";
export default function CheckoutLandingPage() {
    return (<>
            {/* SNTTRADES Header */}
            <Box w="100vw" bg="white" py={{ base: 4, md: 6 }} borderBottom="1px solid" borderColor="gray.200" display="flex" flexDirection="column" alignItems="center" gap={3}>
                <Box display="flex" alignItems="center" justifyContent="center" gap="2" mx="auto">
                    <CheckCircle size={20} color={SNT_BLUE} weight="fill"/>
                    <Heading as="h1" fontSize={{ base: "md", md: "2xl" }} fontWeight="700" lineHeight="0.9" color="gray.900">
                        SNTTRADES™
                    </Heading>
                </Box>
            </Box>

            {/* Plan Selection Section */}
            <SntPremiumPricing />
        </>);
}

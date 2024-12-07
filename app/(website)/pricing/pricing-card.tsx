import {
  Badge,
  Button,
  Card,
  Float,
  For,
  HStack,
  List,
  Separator,
  Span,
  Stack,
  type StackProps,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  LuArrowRight,
  LuBuilding,
  LuMessageSquare,
  LuPackage,
  LuUser,
} from "react-icons/lu";
import type { PlanData } from "./data";

const iconMap: Record<string, React.ReactNode> = {
  team: <LuBuilding />,
  user: <LuUser />,
  storage: <LuPackage />,
  help: <LuMessageSquare />,
};

interface PricingCardProps extends StackProps {
  planPaymentTerms: "month" | "annual";
  data: PlanData;
}

export const PricingCard = (props: PricingCardProps) => {
  const { planPaymentTerms, data, ...rest } = props;
  const price =
    planPaymentTerms === "month"
      ? data.monthlyPrice.price
      : data.yearlyPrice.price;
  return (
    <Card.Root
      size="lg"
      borderColor={data.recommended ? "colorPalette.solid" : undefined}
      {...rest}
    >
      {data.recommended && (
        <Float placement="top-center">
          <Badge variant="solid">Most popular</Badge>
        </Float>
      )}
      <Card.Body>
        <Stack gap="5">
          <Card.Title fontWeight="normal">{data.title}</Card.Title>
          <Stack gap="1">
            <Span textStyle="5xl" lineHeight="1" fontWeight="medium">
              {data.priceSymbol}
              {price}
            </Span>
            <Span textStyle="sm" color="fg.muted">
              per month
            </Span>
          </Stack>
          <Card.Description color="fg">{data.description}</Card.Description>
          <Stack gap="2">
            <Button
              size="xl"
              variant={data.recommended ? "solid" : "outline"}
              colorPalette={!data.recommended ? "gray" : undefined}
              bg={!data.recommended ? "bg.panel" : undefined}
              data-o-auth="1"
              data-mode="popup"
              data-widget-mode="register"
              data-plan-uid={data.uid}
              data-plan-payment-term={planPaymentTerms}
            >
              Get Started <LuArrowRight />
            </Button>
            <Text textStyle="xs" color="fg.muted" textAlign="center">
              7-day free trial
            </Text>
          </Stack>
        </Stack>
      </Card.Body>
      <Separator variant="dashed" />
      <Card.Body gap="6" roundedBottom="l3">
        <List.Root variant="plain" align="center" textStyle="sm" gap="3">
          <For each={data.features}>
            {(item) => (
              <List.Item alignItems="center" key={item.title}>
                <List.Indicator asChild color="fg.muted">
                  {iconMap[item.icon as keyof typeof iconMap]}
                </List.Indicator>
                <HStack gap="2">
                  <Text>{item.title}</Text>
                </HStack>
              </List.Item>
            )}
          </For>
        </List.Root>
      </Card.Body>
    </Card.Root>
  );
};

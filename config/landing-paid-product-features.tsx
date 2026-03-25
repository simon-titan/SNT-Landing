import {
  VideoCamera,
  ChartLineUp,
  WhatsappLogo,
  DiscordLogo,
  BookOpen,
} from "@phosphor-icons/react/dist/ssr";

export const LANDING_PAID_PRODUCT_FEATURES = [
  {
    icon: VideoCamera,
    label: "7 Wöchentliche Live Calls",
    detail: "Livetrading, Mindset, Anfängercalls",
  },
  {
    icon: ChartLineUp,
    label: "NEFS Trading Strategie",
    detail: null,
  },
  {
    icon: WhatsappLogo,
    label: "WhatsApp Community",
    detail: null,
  },
  {
    icon: DiscordLogo,
    label: "Discord Community",
    detail: null,
  },
  {
    icon: BookOpen,
    label: "Über 40 Std. Lernmaterial",
    detail: null,
  },
] as const;

export type LandingPaidProductFeature = (typeof LANDING_PAID_PRODUCT_FEATURES)[number];

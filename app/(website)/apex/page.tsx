import { Metadata } from "next";
import { Box } from "@chakra-ui/react";
import { ProtocolTracker } from "@/components/protocol/ProtocolTracker";
import { ProtocolHero } from "@/components/protocol/ProtocolHero";
import { ProtocolProblems } from "@/components/protocol/ProtocolProblems";
import { ProtocolGoals } from "@/components/protocol/ProtocolGoals";
import { ProtocolStats } from "@/components/protocol/ProtocolStats";
import { ProtocolFounder } from "@/components/protocol/ProtocolFounder";
import { ProtocolFinalCta } from "@/components/protocol/ProtocolFinalCta";
import { supabaseAdmin } from "@/lib/supabase/client";

export const metadata: Metadata = {
  title: "SNT APEX | Exklusives 1:1 Coaching",
  description:
    "Bewerbe dich für einen der limitierten Plätze im SNT APEX. Persönliche 1:1-Betreuung, ein bewährtes System und echter Wandel, aber nur für ausgewählte Kandidaten.",
};

async function getProtocolSettings() {
  try {
    const { data } = await supabaseAdmin
      .from("protocol_settings")
      .select("vimeo_video_id")
      .eq("id", 1)
      .single();
    return data?.vimeo_video_id ?? "1177003953";
  } catch {
    return "1177003953";
  }
}

export default async function ProtocolPage() {
  const vimeoId = await getProtocolSettings();

  return (
    <>
      <ProtocolTracker />

      <ProtocolHero vimeoId={vimeoId} />

      {/* Glow Divider */}
      <Box
        w="100%"
        h="1px"
        background="linear-gradient(90deg, transparent, rgba(239, 68, 68, 0.4), transparent)"
        boxShadow="0 0 20px rgba(239, 68, 68, 0.2)"
      />

      <ProtocolProblems />

      {/* Glow Divider */}
      <Box
        w="100%"
        h="1px"
        background="linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.5), transparent)"
        boxShadow="0 0 20px rgba(139, 92, 246, 0.3)"
      />

      <ProtocolGoals />

      {/* Glow Divider */}
      <Box
        w="100%"
        h="1px"
        background="linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.5), transparent)"
        boxShadow="0 0 20px rgba(139, 92, 246, 0.3)"
      />

      <ProtocolStats />

      {/* Glow Divider */}
      <Box
        w="100%"
        h="1px"
        background="linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.5), transparent)"
        boxShadow="0 0 20px rgba(139, 92, 246, 0.3)"
      />

      <ProtocolFounder />

      {/* Glow Divider */}
      <Box
        w="100%"
        h="1px"
        background="linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.6), transparent)"
        boxShadow="0 0 20px rgba(139, 92, 246, 0.4)"
      />

      <ProtocolFinalCta />
    </>
  );
}

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/client";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("protocol_settings")
      .select("vimeo_video_id, calendly_url")
      .eq("id", 1)
      .single();

    if (error) {
      return NextResponse.json(
        { vimeo_video_id: "1177003953", calendly_url: "https://calendly.com/websitetitan110/30min" }
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { vimeo_video_id: "1177003953", calendly_url: "https://calendly.com/websitetitan110/30min" }
    );
  }
}

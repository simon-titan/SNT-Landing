import { NextResponse } from "next/server";
import { supabaseAnon } from "@/lib/supabase/client";

export async function GET() {
  try {
    console.log("🧪 Testing database connection...");
    
    // Test 1: Einfache Verbindung
    const { data: testData, error: testError } = await supabaseAnon
      .from("landing_page_versions")
      .select("count", { count: "exact" });
    
    console.log("📊 Count Test:", { testData, testError });
    
    // Test 2: Alle Versionen abrufen
    const { data: allVersions, error: allError } = await supabaseAnon
      .from("landing_page_versions")
      .select("*");
    
    console.log("📋 All Versions:", { allVersions, allError });
    
    return NextResponse.json({
      success: true,
      environment: {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Missing",
        supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Set" : "❌ Missing",
        nodeEnv: process.env.NODE_ENV,
      },
      tests: {
        count: { data: testData, error: testError },
        allVersions: { 
          data: allVersions, 
          error: allError,
          count: allVersions?.length || 0,
          slugs: allVersions?.map(v => v.slug) || []
        }
      }
    });
  } catch (error) {
    console.error("💥 Database test failed:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      environment: {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Missing",
        supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Set" : "❌ Missing",
        nodeEnv: process.env.NODE_ENV,
      }
    }, { status: 500 });
  }
}
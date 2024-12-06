import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../provider/auth-provider";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { handleAccessToken } = useAuth();

  useEffect(() => {
    const accessToken = searchParams.get("access_token");
    const callbackUrl = searchParams.get("callbackUrl") || "/app";

    console.log(" Auth callback triggered", {
      hasToken: !!accessToken,
      callbackUrl,
    });

    if (accessToken) {
      handleAccessToken(accessToken);
      console.log("↪️ Redirecting to:", callbackUrl);
      router.replace(callbackUrl);
    } else {
      console.log("⚠️ No access token found, redirecting to home");
      router.replace("/");
    }
  }, [searchParams, router, handleAccessToken]);

  return null;
}

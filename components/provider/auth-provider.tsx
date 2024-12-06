"use client";

import { useEffect, useState, createContext, useContext, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { jwtVerify, importX509 } from "jose";
import { siteConfig } from "@/config/site";

type OutsetaUser = {
  Account?: {
    CurrentSubscription?: {
      Plan?: {
        Uid: string;
        Name: string;
        Price: number;
      };
    };
  };
  Email: string;
  FullName: string;
  ProfileImageS3Url?: string;
};

interface AuthContextType {
  user: OutsetaUser | null;
  isLoading: boolean;
  logout: () => void;
  openLogin: (options?: any) => void;
  openSignup: (options?: any) => void;
  openProfile: (options?: any) => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function useAuth() {
  return useContext(AuthContext);
}

function getOutseta() {
  if (typeof window === "undefined") return null;
  if (window.Outseta) return window.Outseta;
  console.error("Outseta is not loaded yet");
  return null;
}

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [status, setStatus] = useState("init");
  const [user, setUser] = useState<OutsetaUser | null>(null);
  const outsetaRef = useRef<any>(null);

  useEffect(() => {
    const initializeAuth = () => {
      console.log("[Auth] Initializing authentication...");
      try {
        if (!outsetaRef.current) {
          outsetaRef.current = getOutseta();
          if (!outsetaRef.current) {
            console.log("[Auth] Outseta not loaded yet");
            return;
          }
        }

        handleOutsetaUserEvents(updateUser);

        const accessToken = searchParams.get("access_token");
        if (accessToken) {
          console.log("[Auth] Access token found in URL, verifying...");
          verifyAndSetToken(accessToken)
            .then(() => {
              // Clear the access_token from URL
              const params = new URLSearchParams(searchParams);
              params.delete("access_token");
              const newUrl =
                pathname + (params.toString() ? `?${params.toString()}` : "");
              router.replace(newUrl);
            })
            .catch((error) => {
              console.error("[Auth] Token verification failed:", error);
              setStatus("error");
            });
          return;
        }

        if (outsetaRef.current.getAccessToken()) {
          console.log("[Auth] Existing token found, updating user...");
          updateUser();
        } else {
          console.log("[Auth] No token found, ready for authentication");
          setStatus("ready");
        }
      } catch (error) {
        console.error("[Auth] Error initializing Outseta:", error);
        setStatus("error");
      }
    };

    initializeAuth();
    return () => handleOutsetaUserEvents(() => {});
  }, [searchParams, pathname, router]);

  const verifyAndSetToken = (token: string) => {
    console.log("[Auth] Verifying token...");
    const certificate = siteConfig.outsetaOptions.auth.publicKey;

    return importX509(certificate, "RS256")
      .then((publicKey) => jwtVerify(token, publicKey))
      .then(() => {
        outsetaRef.current.setAccessToken(token);
        console.log("[Auth] Token verified successfully");
        return updateUser();
      })
      .catch((error) => {
        console.error("[Auth] Token verification failed:", error);
        logout();
        throw error;
      });
  };

  const updateUser = () => {
    console.log("[Auth] Updating user information...");
    return outsetaRef.current
      .getUser()
      .then((outsetaUser: OutsetaUser) => {
        setUser(outsetaUser);
        setStatus("ready");
        console.log("[Auth] User updated successfully", outsetaUser);
        if (pathname !== "/app") {
          router.push("/app");
        }
      })
      .catch((error: Error) => {
        console.error("[Auth] Error updating user:", error);
        setStatus("error");
      });
  };

  const handleOutsetaUserEvents = (onEvent: () => void) => {
    const outseta = outsetaRef.current;
    outseta.on("subscription.update", onEvent);
    outseta.on("profile.update", onEvent);
    outseta.on("account.update", onEvent);
  };

  const logout = () => {
    outsetaRef.current.setAccessToken("");
    setUser(null);
  };

  const openLogin = (options?: any) => {
    outsetaRef.current.auth.open({
      widgetMode: "login|register",
      authenticationCallbackUrl: window.location.href,
      ...options,
    });
  };

  const openSignup = (options?: any) => {
    outsetaRef.current.auth.open({
      widgetMode: "register",
      authenticationCallbackUrl: window.location.href,
      ...options,
    });
  };

  const openProfile = (options?: any) => {
    outsetaRef.current.profile.open({ tab: "profile", ...options });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: status !== "ready",
        logout,
        openLogin,
        openSignup,
        openProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

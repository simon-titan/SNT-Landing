"use client";

import { useEffect, useState, createContext, useContext, useRef } from "react";
import { useSearchParams } from "next/navigation";

type OutsetaUser = {
  Account?: {
    CurrentSubscription?: {
      Plan?: {
        Uid: string;
      };
    };
  };
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

declare global {
  interface Window {
    Outseta?: any;
  }
}

function getOutseta() {
  if (typeof window === "undefined") {
    return null; // Return null during server-side rendering
  }

  if (window.Outseta) {
    return window.Outseta;
  } else {
    console.error("Outseta is not loaded yet");
    return null;
  }
}

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("init");
  const [user, setUser] = useState<OutsetaUser | null>(null);

  const outsetaRef = useRef<any>(null);

  useEffect(() => {
    try {
      outsetaRef.current = getOutseta();
      if (!outsetaRef.current) {
        // If Outseta isn't available yet, you might want to retry
        const timer = setTimeout(() => {
          outsetaRef.current = getOutseta();
        }, 1000);
        return () => clearTimeout(timer);
      }

      handleOutsetaUserEvents(updateUser);

      const accessToken = searchParams.get("access_token");

      if (accessToken) {
        outsetaRef.current.setAccessToken(accessToken);
        // Note: Next.js searchParams is read-only, you'll need to handle cleanup differently
        // Consider using router.replace() to clean up the URL
      }

      if (outsetaRef.current.getAccessToken()) {
        updateUser();
      } else {
        setStatus("ready");
      }

      return () => {
        handleOutsetaUserEvents(() => {});
      };
    } catch (error) {
      console.error("Error initializing Outseta:", error);
      setStatus("error");
    }
  }, [searchParams]);

  const updateUser = async () => {
    // Fetch the current user data from outseta
    const outsetaUser = await outsetaRef.current.getUser();
    // Update user state
    setUser(outsetaUser);
    // Make sure status = ready
    setStatus("ready");
  };

  const handleOutsetaUserEvents = (onEvent) => {
    // Subscribe to user related events
    // with onEvent function
    const outseta = outsetaRef.current;
    outseta.on("subscription.update", onEvent);
    outseta.on("profile.update", onEvent);
    outseta.on("account.update", onEvent);
  };

  const logout = () => {
    // Unset access token
    outsetaRef.current.setAccessToken("");
    // and remove user state
    setUser(null);
  };

  const openLogin = (options) => {
    outsetaRef.current.auth.open({
      widgetMode: "login|register",
      authenticationCallbackUrl: window.location.href,
      ...options,
    });
  };

  const openSignup = (options) => {
    outsetaRef.current.auth.open({
      widgetMode: "register",
      authenticationCallbackUrl: window.location.href,
      ...options,
    });
  };

  const openProfile = (options) => {
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

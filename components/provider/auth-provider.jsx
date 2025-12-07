"use client";
import { useEffect, useState, createContext, useContext, useRef, Suspense, } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { jwtVerify, importX509 } from "jose";
import { projectConfig } from "@/config";
const AuthContext = createContext({});
export function useAuth() {
    return useContext(AuthContext);
}
function getOutseta() {
    if (typeof window === "undefined")
        return null;
    return window.Outseta;
}
export default function AuthProvider({ children, }) {
    return (<Suspense>
      <AuthProviderContent>{children}</AuthProviderContent>
    </Suspense>);
}
function AuthProviderContent({ children }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const [status, setStatus] = useState("init");
    const [user, setUser] = useState(null);
    const outsetaRef = useRef(null);
    const initializingRef = useRef(false);
    const updateUser = async () => {
        try {
            const outsetaUser = await outsetaRef.current.getUser();
            setUser(outsetaUser);
            setStatus("ready");
            return outsetaUser;
        }
        catch (error) {
            console.error("[Auth] Error updating user:", error);
            setStatus("error");
            throw error;
        }
    };
    const verifyAndSetToken = async (token) => {
        const certificate = projectConfig.outsetaOptions.auth.publicKey;
        try {
            const publicKey = await importX509(certificate, "RS256");
            await jwtVerify(token, publicKey);
            outsetaRef.current.setAccessToken(token);
            return await updateUser();
        }
        catch (error) {
            console.error("[Auth] Token verification failed:", error);
            logout();
            throw error;
        }
    };
    useEffect(() => {
        if (initializingRef.current)
            return;
        initializingRef.current = true;
        const outseta = getOutseta();
        if (!outseta)
            return;
        outsetaRef.current = outseta;
        const accessToken = searchParams.get("access_token");
        if (accessToken) {
            verifyAndSetToken(accessToken).then(() => {
                const params = new URLSearchParams(searchParams);
                params.delete("access_token");
                const newUrl = pathname + (params.toString() ? `?${params.toString()}` : "");
                router.replace(newUrl);
            });
        }
        else if (outseta.getAccessToken()) {
            updateUser();
        }
        else {
            setStatus("ready");
        }
        // Event handlers
        const handleUserUpdate = () => {
            if (outsetaRef.current?.getAccessToken()) {
                updateUser();
            }
        };
        outseta.on("subscription.update", handleUserUpdate);
        outseta.on("profile.update", handleUserUpdate);
        outseta.on("account.update", handleUserUpdate);
    }, [searchParams, pathname]);
    const logout = () => {
        outsetaRef.current?.setAccessToken("");
        setUser(null);
        setStatus("ready");
    };
    const openLogin = (options) => {
        outsetaRef.current?.auth.open({
            widgetMode: "login|register",
            authenticationCallbackUrl: window.location.href,
            ...options,
        });
    };
    const openSignup = (options) => {
        outsetaRef.current?.auth.open({
            widgetMode: "register",
            authenticationCallbackUrl: window.location.href,
            ...options,
        });
    };
    const openProfile = (options) => {
        outsetaRef.current?.profile.open({ tab: "profile", ...options });
    };
    return (<AuthContext.Provider value={{
            user,
            isLoading: status !== "ready",
            logout,
            openLogin,
            openSignup,
            openProfile,
        }}>
      {children}
    </AuthContext.Provider>);
}

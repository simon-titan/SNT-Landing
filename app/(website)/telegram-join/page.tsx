"use client";

import { useEffect } from "react";

/**
 * Öffnet beim Aufruf automatisch eine externe Seite im Standardbrowser (so weit wie erlaubt).
 * Du kannst die Ziel-URL über ?url=... angeben, z. B.:
 *   https://deineseite.de/telegram-join?url=https://t.me/seitennulltrades
 */
export default function OpenExternal() {
    useEffect(() => {
        // 1️⃣ Ziel-URL aus Query-Parameter lesen
        const params = new URLSearchParams(window.location.search);
        const targetUrl = params.get("url") || "https://t.me/seitennulltrades";

        const ua = navigator.userAgent || "";
        const isAndroid = /android/i.test(ua);
        const isIOS = /iphone|ipad|ipod/i.test(ua);
        const isTikTok = /tiktok|musical_ly/i.test(ua) || window.location.href.includes("tiktok");

        // 2️⃣ TikTok Browser: Aggressive Methoden (PRIORITÄT - muss zuerst geprüft werden!)
        if (isTikTok) {
            // Android + TikTok: Versuche Intent zuerst (öffnet externen Browser)
            if (isAndroid) {
                try {
                    const withoutProto = targetUrl.replace(/^https?:\/\//i, "");
                    const intentUrl = `intent://${withoutProto}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(targetUrl)};end`;
                    window.location.href = intentUrl;
                } catch (e) {
                    // Fallback: Versuche andere Browser
                    const browsers = ["org.mozilla.firefox", "com.microsoft.emmx", "com.opera.browser"];
                    for (const browserPackage of browsers) {
                        try {
                            const withoutProto = targetUrl.replace(/^https?:\/\//i, "");
                            const intentUrl = `intent://${withoutProto}#Intent;scheme=https;package=${browserPackage};S.browser_fallback_url=${encodeURIComponent(targetUrl)};end`;
                            window.location.href = intentUrl;
                            break;
                        } catch (err) {
                            continue;
                        }
                    }
                }
            }

            // Versuche window.open (kann manchmal den externen Browser öffnen)
            try {
                window.open(targetUrl, "_blank", "noopener,noreferrer");
            } catch (e) {
                // Kein Fallback - bleibt auf der Seite
            }
        }
        // 3️⃣ Android: Aggressive Intent-Methoden für verschiedene Browser
        else if (isAndroid) {
            // Versuche verschiedene Browser-Packages (Chrome zuerst, da am häufigsten)
            const browsers = [
                "com.android.chrome", // Chrome (meist installiert)
                "org.mozilla.firefox", // Firefox
                "com.microsoft.emmx", // Edge
                "com.opera.browser", // Opera
            ];

            // Versuche Intent mit Chrome zuerst (sofort)
            try {
                const withoutProto = targetUrl.replace(/^https?:\/\//i, "");
                const intentUrl = `intent://${withoutProto}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(targetUrl)};end`;
                window.location.href = intentUrl;
            } catch (e) {
                // Falls Chrome-Intent fehlschlägt, versuche andere Browser
                for (const browserPackage of browsers.slice(1)) {
                    try {
                        const withoutProto = targetUrl.replace(/^https?:\/\//i, "");
                        const intentUrl = `intent://${withoutProto}#Intent;scheme=https;package=${browserPackage};S.browser_fallback_url=${encodeURIComponent(targetUrl)};end`;
                        window.location.href = intentUrl;
                        break;
                    } catch (err) {
                        continue;
                    }
                }

                // Zusätzlicher Versuch: Intent ohne Package (öffnet Standardbrowser)
                try {
                    const withoutProto = targetUrl.replace(/^https?:\/\//i, "");
                    const intentUrl = `intent://${withoutProto}#Intent;scheme=https;S.browser_fallback_url=${encodeURIComponent(targetUrl)};end`;
                    window.location.href = intentUrl;
                } catch (err) {}
            }
        }
        // 4️⃣ iOS: Versuch über window.open
        else if (isIOS) {
            try {
                window.open(targetUrl, "_blank", "noopener,noreferrer");
            } catch (e) {
                // Kein Fallback - bleibt auf der Seite
            }
        }
        // 5️⃣ Standard: Versuch über neues Tab/Fenster
        else {
            try {
                window.open(targetUrl, "_blank", "noopener,noreferrer");
            } catch (e) {
                // Kein Fallback - bleibt auf der Seite
            }
        }
    }, []);

    return null; // Seite bleibt leer – kein Text nötig
}

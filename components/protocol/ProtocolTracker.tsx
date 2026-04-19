"use client";

import { useEffect } from "react";

let protocolSessionId: string | null = null;

function getProtocolSessionId(): string {
  if (protocolSessionId) return protocolSessionId;
  if (typeof window === "undefined") return "ssr";
  const stored = sessionStorage.getItem("snt_protocol_session");
  if (stored) {
    protocolSessionId = stored;
    return stored;
  }
  const newId = `prot_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  sessionStorage.setItem("snt_protocol_session", newId);
  protocolSessionId = newId;
  return newId;
}

export async function trackProtocolEvent(
  event_type: string,
  metadata?: Record<string, unknown>
) {
  if (typeof window === "undefined") return;
  try {
    await fetch("/api/protocol/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: getProtocolSessionId(),
        event_type,
        metadata: metadata ?? {},
      }),
      keepalive: true,
    });
  } catch {
    // Tracking-Fehler sind nicht kritisch
  }
}

export function getProtocolSession() {
  return getProtocolSessionId();
}

export function ProtocolTracker() {
  useEffect(() => {
    trackProtocolEvent("page_view", { path: "/apex" });
  }, []);
  return null;
}

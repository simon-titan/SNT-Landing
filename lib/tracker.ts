type TrackEvent = {
  type: string;
  metadata?: Record<string, unknown>;
  timestamp: number;
};

const FLUSH_INTERVAL = 15_000;
const MAX_QUEUE_SIZE = 10;
const SESSION_VARIANT_KEY = "page_variant";
const LEGACY_SLUG_KEY = "snt_landing_slug";

function getPageVariant(): string {
  if (typeof window === "undefined") return "default";

  const params = new URLSearchParams(window.location.search);
  const fromUrl = params.get("v");
  if (fromUrl) {
    sessionStorage.setItem(SESSION_VARIANT_KEY, fromUrl);
    document.cookie = `page_variant=${fromUrl}; path=/; max-age=86400; SameSite=Lax`;
    return fromUrl;
  }

  const fromSession = sessionStorage.getItem(SESSION_VARIANT_KEY);
  if (fromSession) return fromSession;

  const fromLegacy = localStorage.getItem(LEGACY_SLUG_KEY);
  if (fromLegacy) {
    sessionStorage.setItem(SESSION_VARIANT_KEY, fromLegacy);
    document.cookie = `page_variant=${fromLegacy}; path=/; max-age=86400; SameSite=Lax`;
    return fromLegacy;
  }

  return "default";
}

export const tracker = {
  queue: [] as TrackEvent[],
  _interval: null as ReturnType<typeof setInterval> | null,
  _initialized: false,

  init() {
    if (typeof window === "undefined" || this._initialized) return;
    this._initialized = true;

    const variant = getPageVariant();
    sessionStorage.setItem(SESSION_VARIANT_KEY, variant);
    document.cookie = `page_variant=${variant}; path=/; max-age=86400; SameSite=Lax`;

    this._interval = setInterval(() => this.flush(), FLUSH_INTERVAL);
    window.addEventListener("beforeunload", () => this.flush());
  },

  setVariant(variant: string) {
    sessionStorage.setItem(SESSION_VARIANT_KEY, variant);
    document.cookie = `page_variant=${variant}; path=/; max-age=86400; SameSite=Lax`;
  },

  trackEvent(type: string, metadata?: Record<string, unknown>) {
    this.queue.push({ type, metadata, timestamp: Date.now() });
    if (this.queue.length >= MAX_QUEUE_SIZE) this.flush();
  },

  flush() {
    if (!this.queue.length) return;
    const events = [...this.queue];
    this.queue = [];

    const variant = sessionStorage.getItem(SESSION_VARIANT_KEY) || "default";

    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ events, pageVariant: variant }),
      keepalive: true,
    }).catch(() => {});
  },
};

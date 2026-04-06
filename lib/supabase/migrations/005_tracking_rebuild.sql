-- Tracking Rebuild: Neue Tabellen fuer das ueberarbeitete Analytics-System
-- Ersetzt schrittweise landing_page_views + landing_page_sales

-- 1. Granulare Events (page_view, cta_click, checkout_start, etc.)
CREATE TABLE IF NOT EXISTS page_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  page_variant TEXT NOT NULL,
  event_type TEXT NOT NULL,
  referrer TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Voraggregierte Tagesstatistiken
CREATE TABLE IF NOT EXISTS page_stats_daily (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  page_variant TEXT NOT NULL,
  views INTEGER DEFAULT 0,
  unique_sessions INTEGER DEFAULT 0,
  cta_clicks INTEGER DEFAULT 0,
  checkout_starts INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  revenue_cents INTEGER DEFAULT 0,
  CONSTRAINT page_stats_daily_unique UNIQUE (date, page_variant)
);

-- 3. Sales Events
CREATE TABLE IF NOT EXISTS sales_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT,
  page_variant TEXT,
  outseta_account_id TEXT,
  plan_name TEXT,
  product TEXT,
  amount_cents INTEGER,
  currency TEXT DEFAULT 'EUR',
  provider TEXT,
  transaction_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Performance-Indizes
CREATE INDEX IF NOT EXISTS idx_page_events_variant_time ON page_events (page_variant, created_at);
CREATE INDEX IF NOT EXISTS idx_page_events_session ON page_events (session_id);
CREATE INDEX IF NOT EXISTS idx_page_events_type ON page_events (event_type);
CREATE INDEX IF NOT EXISTS idx_page_events_created ON page_events (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_page_stats_daily_date ON page_stats_daily (date DESC);
CREATE INDEX IF NOT EXISTS idx_page_stats_daily_variant ON page_stats_daily (page_variant);

CREATE INDEX IF NOT EXISTS idx_sales_events_variant_time ON sales_events (page_variant, created_at);
CREATE INDEX IF NOT EXISTS idx_sales_events_created ON sales_events (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sales_events_outseta ON sales_events (outseta_account_id);
CREATE INDEX IF NOT EXISTS idx_sales_events_product ON sales_events (product);

-- Row Level Security
ALTER TABLE page_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_stats_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read page_events" ON page_events FOR SELECT USING (true);
CREATE POLICY "Anyone can read page_stats_daily" ON page_stats_daily FOR SELECT USING (true);
CREATE POLICY "Anyone can read sales_events" ON sales_events FOR SELECT USING (true);

CREATE POLICY "Service role can manage page_events" ON page_events FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role can manage page_stats_daily" ON page_stats_daily FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role can manage sales_events" ON sales_events FOR ALL USING (auth.role() = 'service_role');

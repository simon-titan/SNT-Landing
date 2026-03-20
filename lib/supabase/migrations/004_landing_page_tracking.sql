-- Tracking Tabellen fuer Landing Page Versionen
-- Speichert Seitenaufrufe und Sales pro Landing Page Version

CREATE TABLE IF NOT EXISTS landing_page_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  landing_page_version_id UUID NOT NULL REFERENCES landing_page_versions(id) ON DELETE CASCADE,
  session_id TEXT,
  referrer TEXT,
  user_agent TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS landing_page_sales (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  landing_page_version_id UUID NOT NULL REFERENCES landing_page_versions(id) ON DELETE CASCADE,
  product TEXT NOT NULL CHECK (product IN ('monthly', 'quarterly', 'annual', 'lifetime')),
  provider TEXT NOT NULL CHECK (provider IN ('outseta', 'paypal')),
  amount NUMERIC(10, 2) NOT NULL,
  currency TEXT DEFAULT 'EUR',
  transaction_id TEXT,
  sale_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance-Indizes
CREATE INDEX IF NOT EXISTS idx_landing_page_views_version_id ON landing_page_views(landing_page_version_id);
CREATE INDEX IF NOT EXISTS idx_landing_page_views_viewed_at ON landing_page_views(viewed_at DESC);
CREATE INDEX IF NOT EXISTS idx_landing_page_views_session_id ON landing_page_views(session_id);

CREATE INDEX IF NOT EXISTS idx_landing_page_sales_version_id ON landing_page_sales(landing_page_version_id);
CREATE INDEX IF NOT EXISTS idx_landing_page_sales_sale_at ON landing_page_sales(sale_at DESC);
CREATE INDEX IF NOT EXISTS idx_landing_page_sales_product ON landing_page_sales(product);
CREATE INDEX IF NOT EXISTS idx_landing_page_sales_provider ON landing_page_sales(provider);
CREATE INDEX IF NOT EXISTS idx_landing_page_sales_transaction_id ON landing_page_sales(transaction_id);

-- Row Level Security
ALTER TABLE landing_page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE landing_page_sales ENABLE ROW LEVEL SECURITY;

-- Select fuer alle (z.B. oeffentliche Auswertungen)
CREATE POLICY "Anyone can read landing page views" ON landing_page_views
  FOR SELECT USING (true);

CREATE POLICY "Anyone can read landing page sales" ON landing_page_sales
  FOR SELECT USING (true);

-- Schreiben nur fuer service_role
CREATE POLICY "Service role can manage landing page views" ON landing_page_views
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage landing page sales" ON landing_page_sales
  FOR ALL USING (auth.role() = 'service_role');

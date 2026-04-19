-- SNT PROTOCOL Funnel Tabellen
-- Leads, Funnel-Events und Settings für den exklusiven Bewerbungs-Funnel

-- 1. Haupt-Lead-Tabelle
CREATE TABLE IF NOT EXISTS protocol_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
  status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'booked', 'completed', 'no_show')),

  -- Schritt 1: Trading-Hintergrund
  trading_duration TEXT NOT NULL,
  current_level TEXT NOT NULL,

  -- Schritt 2: Problem
  holding_back TEXT NOT NULL,
  snt_duration TEXT NOT NULL,
  snt_source TEXT,

  -- Schritt 3: Commitment
  investment_willingness TEXT NOT NULL,
  why_candidate TEXT NOT NULL,

  -- Calendly-Daten (werden via Webhook befüllt)
  calendly_event_uri TEXT,
  calendly_invitee_uri TEXT,
  invitee_name TEXT,
  invitee_email TEXT,
  invitee_phone TEXT,
  scheduled_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,

  -- Tracking
  session_id TEXT,
  page_variant TEXT DEFAULT 'protocol',
  referrer TEXT,
  user_agent TEXT,
  booked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Funnel-Events für Step-by-Step-Tracking und Abbruch-Analyse
CREATE TABLE IF NOT EXISTS protocol_funnel_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'page_view',
    'form_open',
    'step_1_complete',
    'step_2_complete',
    'step_3_complete',
    'form_submit',
    'calendly_redirect',
    'calendly_booked'
  )),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Settings-Tabelle (Single-Row Config)
CREATE TABLE IF NOT EXISTS protocol_settings (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  vimeo_video_id TEXT NOT NULL DEFAULT '1177003953',
  calendly_url TEXT NOT NULL DEFAULT 'https://calendly.com/websitetitan110/30min',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Initial-Row einfügen (falls nicht vorhanden)
INSERT INTO protocol_settings (id, vimeo_video_id, calendly_url)
VALUES (1, '1177003953', 'https://calendly.com/websitetitan110/30min')
ON CONFLICT (id) DO NOTHING;

-- Performance-Indizes
CREATE INDEX IF NOT EXISTS idx_protocol_leads_lead_id ON protocol_leads (lead_id);
CREATE INDEX IF NOT EXISTS idx_protocol_leads_status ON protocol_leads (status);
CREATE INDEX IF NOT EXISTS idx_protocol_leads_created_at ON protocol_leads (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_protocol_leads_session_id ON protocol_leads (session_id);
CREATE INDEX IF NOT EXISTS idx_protocol_leads_invitee_email ON protocol_leads (invitee_email);

CREATE INDEX IF NOT EXISTS idx_protocol_funnel_events_session ON protocol_funnel_events (session_id);
CREATE INDEX IF NOT EXISTS idx_protocol_funnel_events_type ON protocol_funnel_events (event_type);
CREATE INDEX IF NOT EXISTS idx_protocol_funnel_events_created ON protocol_funnel_events (created_at DESC);

-- Row Level Security
ALTER TABLE protocol_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE protocol_funnel_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE protocol_settings ENABLE ROW LEVEL SECURITY;

-- Lesezugriff für alle (Settings + Events read-public für Tracking)
CREATE POLICY "Anyone can read protocol_settings" ON protocol_settings
  FOR SELECT USING (true);

CREATE POLICY "Anyone can read protocol_funnel_events" ON protocol_funnel_events
  FOR SELECT USING (true);

-- Schreiben nur für service_role
CREATE POLICY "Service role can manage protocol_leads" ON protocol_leads
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage protocol_funnel_events" ON protocol_funnel_events
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage protocol_settings" ON protocol_settings
  FOR ALL USING (auth.role() = 'service_role');

-- Landing Page Versions Tabelle
-- Diese Tabelle speichert verschiedene Versionen der Landing Page mit konfigurierbaren Videos, Titeln und Kurs-Typen

CREATE TABLE IF NOT EXISTS landing_page_versions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  vimeo_video_id TEXT NOT NULL,
  course_type TEXT NOT NULL CHECK (course_type IN ('paid', 'free')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index für bessere Performance bei Slug-Lookups
CREATE INDEX IF NOT EXISTS idx_landing_page_versions_slug ON landing_page_versions(slug);
CREATE INDEX IF NOT EXISTS idx_landing_page_versions_active ON landing_page_versions(is_active);

-- Trigger für automatisches Updated_at Update
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_landing_page_versions_updated_at 
    BEFORE UPDATE ON landing_page_versions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Standard-Version einfügen (entspricht der aktuellen Hauptseite)
INSERT INTO landing_page_versions (name, slug, title, vimeo_video_id, course_type, is_active)
VALUES (
  'Standard Landing Page',
  'standard',
  'LERNE WIE DU PROFITABEL TRADEST',
  '1104311683',
  'paid',
  true
) ON CONFLICT (slug) DO NOTHING;

-- Beispiel Free-Course Version
INSERT INTO landing_page_versions (name, slug, title, vimeo_video_id, course_type, is_active)
VALUES (
  'Free Course Landing',
  'free-course',
  'STARTE DEINE TRADING-REISE KOSTENLOS',
  '1139395784',
  'free',
  true
) ON CONFLICT (slug) DO NOTHING;

-- RLS (Row Level Security) aktivieren für Sicherheit
ALTER TABLE landing_page_versions ENABLE ROW LEVEL SECURITY;

-- Policy: Alle können lesen (für öffentliche Landing Pages)
CREATE POLICY "Anyone can read landing page versions" ON landing_page_versions
  FOR SELECT USING (is_active = true);

-- Policy: Nur Service Role kann schreiben (für Admin-Funktionen)
CREATE POLICY "Service role can manage landing page versions" ON landing_page_versions
  FOR ALL USING (auth.role() = 'service_role');
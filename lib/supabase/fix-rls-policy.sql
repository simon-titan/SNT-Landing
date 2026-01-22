-- RLS Policies für landing_page_versions reparieren
-- Diese Datei in Supabase SQL Editor ausführen

-- Alte Policies löschen
DROP POLICY IF EXISTS "Anyone can read landing page versions" ON landing_page_versions;
DROP POLICY IF EXISTS "Service role can manage landing page versions" ON landing_page_versions;

-- Neue, einfachere Policies erstellen
-- Policy: Alle können aktive Versionen lesen
CREATE POLICY "Public can read active landing page versions" ON landing_page_versions
  FOR SELECT USING (is_active = true);

-- Policy: Anon kann alle Versionen lesen (für Admin und Public)
CREATE POLICY "Allow anon read access" ON landing_page_versions
  FOR SELECT USING (true);

-- Policy: Service Role kann alles verwalten
CREATE POLICY "Service role full access" ON landing_page_versions
  FOR ALL USING (auth.role() = 'service_role');

-- Alternativ: RLS komplett deaktivieren (nur für Testing)
-- ALTER TABLE landing_page_versions DISABLE ROW LEVEL SECURITY;
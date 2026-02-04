-- Telegram Paid Group Tabellen
-- Diese Tabellen verwalten die Mitglieder, geplanten Nachrichten und FAQ für die bezahlte Telegram-Gruppe

-- ==========================================
-- 1. TELEGRAM GROUP MEMBERS
-- ==========================================
-- Verknüpft Telegram-User mit Outseta-Accounts und verwaltet Mitgliedschaftsstatus

CREATE TABLE IF NOT EXISTS telegram_group_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Telegram Daten
  telegram_user_id BIGINT UNIQUE NOT NULL,
  telegram_username TEXT,
  telegram_first_name TEXT,
  telegram_last_name TEXT,
  telegram_phone TEXT,
  
  -- Outseta Verknüpfung
  outseta_account_uid TEXT,
  outseta_person_uid TEXT,
  outseta_email TEXT,
  
  -- Subscription Details
  subscription_plan TEXT, -- 'ZmNM7ZW2' (Outseta) oder '7ma8lrWE' (PayPal)
  subscription_status TEXT DEFAULT 'pending' CHECK (subscription_status IN ('pending', 'active', 'cancelled', 'expired')),
  subscription_started_at TIMESTAMPTZ,
  subscription_expires_at TIMESTAMPTZ,
  
  -- Gruppen-Status
  is_in_group BOOLEAN DEFAULT FALSE,
  joined_group_at TIMESTAMPTZ,
  removed_from_group_at TIMESTAMPTZ,
  removal_reason TEXT, -- 'cancelled', 'expired', 'manual', 'banned'
  
  -- Verifizierung
  is_verified BOOLEAN DEFAULT FALSE,
  verification_code TEXT,
  verification_sent_at TIMESTAMPTZ,
  verified_at TIMESTAMPTZ,
  
  -- Metadata
  notes TEXT,
  added_by TEXT, -- 'system', 'admin', 'webhook'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indizes für Performance
CREATE INDEX IF NOT EXISTS idx_telegram_members_user_id ON telegram_group_members(telegram_user_id);
CREATE INDEX IF NOT EXISTS idx_telegram_members_outseta ON telegram_group_members(outseta_account_uid);
CREATE INDEX IF NOT EXISTS idx_telegram_members_email ON telegram_group_members(outseta_email);
CREATE INDEX IF NOT EXISTS idx_telegram_members_status ON telegram_group_members(subscription_status);
CREATE INDEX IF NOT EXISTS idx_telegram_members_in_group ON telegram_group_members(is_in_group);

-- ==========================================
-- 2. SCHEDULED MESSAGES
-- ==========================================
-- Geplante und wiederkehrende Nachrichten für die Gruppe

CREATE TABLE IF NOT EXISTS telegram_scheduled_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Nachrichteninhalt
  message_text TEXT NOT NULL,
  message_type TEXT DEFAULT 'custom' CHECK (message_type IN ('good_morning', 'good_evening', 'signal', 'announcement', 'custom')),
  
  -- Sender
  sender_type TEXT DEFAULT 'bot' CHECK (sender_type IN ('bot', 'user_1', 'user_2')),
  
  -- Zeitplanung
  scheduled_at TIMESTAMPTZ NOT NULL,
  timezone TEXT DEFAULT 'Europe/Berlin',
  
  -- Wiederholung
  is_recurring BOOLEAN DEFAULT FALSE,
  recurring_pattern TEXT CHECK (recurring_pattern IN ('daily', 'weekly', 'monthly', NULL)),
  recurring_time TIME, -- Uhrzeit für wiederkehrende Nachrichten (z.B. 08:00)
  recurring_days INTEGER[], -- Wochentage für wöchentliche Wiederholung (0=Sonntag, 1=Montag, etc.)
  next_run_at TIMESTAMPTZ, -- Nächste Ausführung für wiederkehrende Nachrichten
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  is_sent BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMPTZ,
  send_error TEXT,
  
  -- Metadata
  created_by TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indizes für Scheduler
CREATE INDEX IF NOT EXISTS idx_scheduled_messages_next_run ON telegram_scheduled_messages(next_run_at) WHERE is_active = TRUE AND is_sent = FALSE;
CREATE INDEX IF NOT EXISTS idx_scheduled_messages_scheduled ON telegram_scheduled_messages(scheduled_at) WHERE is_active = TRUE AND is_sent = FALSE;
CREATE INDEX IF NOT EXISTS idx_scheduled_messages_recurring ON telegram_scheduled_messages(is_recurring, is_active);

-- ==========================================
-- 3. FAQ ENTRIES
-- ==========================================
-- Vordefinierte FAQ-Antworten für den Bot

CREATE TABLE IF NOT EXISTS telegram_faq_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Trigger
  trigger_keywords TEXT[] NOT NULL, -- Array von Keywords die diese FAQ triggern
  trigger_exact_match BOOLEAN DEFAULT FALSE, -- Ob exakte Übereinstimmung erforderlich ist
  
  -- Inhalt
  question TEXT NOT NULL, -- Die Frage (zur Anzeige)
  answer TEXT NOT NULL, -- Die Antwort
  
  -- Kategorisierung
  category TEXT DEFAULT 'general' CHECK (category IN ('general', 'signals', 'subscription', 'technical', 'other')),
  priority INTEGER DEFAULT 0, -- Höhere Priorität wird bevorzugt bei mehreren Matches
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  usage_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMPTZ,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index für Keyword-Suche
CREATE INDEX IF NOT EXISTS idx_faq_keywords ON telegram_faq_entries USING GIN (trigger_keywords);
CREATE INDEX IF NOT EXISTS idx_faq_active ON telegram_faq_entries(is_active, priority DESC);

-- ==========================================
-- 4. ACTIVITY LOG
-- ==========================================
-- Protokolliert alle wichtigen Aktionen

CREATE TABLE IF NOT EXISTS telegram_activity_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Aktion
  action_type TEXT NOT NULL CHECK (action_type IN (
    'member_joined', 'member_left', 'member_kicked', 'member_banned',
    'subscription_created', 'subscription_cancelled', 'subscription_renewed',
    'message_sent', 'message_scheduled', 'message_failed',
    'faq_triggered', 'verification_sent', 'verification_completed',
    'admin_action', 'webhook_received', 'error'
  )),
  
  -- Bezug
  telegram_user_id BIGINT,
  member_id UUID REFERENCES telegram_group_members(id),
  message_id UUID REFERENCES telegram_scheduled_messages(id),
  
  -- Details
  details JSONB,
  error_message TEXT,
  
  -- Metadata
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index für Log-Abfragen
CREATE INDEX IF NOT EXISTS idx_activity_log_type ON telegram_activity_log(action_type);
CREATE INDEX IF NOT EXISTS idx_activity_log_user ON telegram_activity_log(telegram_user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_created ON telegram_activity_log(created_at DESC);

-- ==========================================
-- 5. TRIGGERS
-- ==========================================

-- Updated_at Trigger (falls noch nicht existiert)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger für alle Tabellen
CREATE TRIGGER update_telegram_members_updated_at 
    BEFORE UPDATE ON telegram_group_members 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scheduled_messages_updated_at 
    BEFORE UPDATE ON telegram_scheduled_messages 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_faq_entries_updated_at 
    BEFORE UPDATE ON telegram_faq_entries 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- 6. ROW LEVEL SECURITY
-- ==========================================

ALTER TABLE telegram_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE telegram_scheduled_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE telegram_faq_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE telegram_activity_log ENABLE ROW LEVEL SECURITY;

-- Service Role kann alles
CREATE POLICY "Service role can manage telegram_group_members" ON telegram_group_members
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage telegram_scheduled_messages" ON telegram_scheduled_messages
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage telegram_faq_entries" ON telegram_faq_entries
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage telegram_activity_log" ON telegram_activity_log
  FOR ALL USING (auth.role() = 'service_role');

-- ==========================================
-- 7. BEISPIELDATEN FÜR FAQ
-- ==========================================

INSERT INTO telegram_faq_entries (trigger_keywords, question, answer, category, priority) VALUES
(
  ARRAY['signal', 'signale', 'wie funktioniert', 'wie funktionieren'],
  'Wie funktionieren die Trading Signale?',
  '📊 *Trading Signale Erklärung*

Unsere Signale enthalten:
• Entry-Preis (Einstiegspunkt)
• Stop-Loss (Verlustbegrenzung)
• Take-Profit Ziele (TP1, TP2, TP3)
• Risk-Reward Verhältnis

Wir empfehlen max. 1-2% deines Kapitals pro Trade zu riskieren.',
  'signals',
  10
),
(
  ARRAY['abo', 'abonnement', 'kündigen', 'kündigung', 'cancel'],
  'Wie kann ich mein Abonnement kündigen?',
  '📝 *Abonnement verwalten*

Du kannst dein Abo jederzeit verwalten:
1. Gehe zu /manage
2. Klicke auf "Abonnement verwalten"
3. Dort kannst du kündigen oder ändern

Bei Fragen schreib uns an support@snttrades.de',
  'subscription',
  10
),
(
  ARRAY['preis', 'kosten', 'was kostet', 'preise'],
  'Was kostet die Mitgliedschaft?',
  '💰 *Preise*

Aktuelle Preise findest du unter /start oder auf unserer Website.

Bei Fragen zu Zahlungen kontaktiere support@snttrades.de',
  'subscription',
  8
),
(
  ARRAY['hilfe', 'help', 'support', 'kontakt'],
  'Wie erreiche ich den Support?',
  '🆘 *Support*

• Email: support@snttrades.de
• Telegram: Schreibe hier deine Frage
• Website: snttrades.de/support

Wir antworten in der Regel innerhalb von 24 Stunden.',
  'general',
  5
)
ON CONFLICT DO NOTHING;

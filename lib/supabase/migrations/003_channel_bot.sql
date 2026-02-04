-- Migration: Channel Bot für automatisierte Kanal-Posts
-- Erstellt: 2026-02-04

-- ============================================
-- 1. Erweitere telegram_scheduled_messages für Medien-Support
-- ============================================

-- Medien-Typ (photo, video, voice, document, animation)
ALTER TABLE telegram_scheduled_messages 
ADD COLUMN IF NOT EXISTS media_type TEXT;

-- Telegram File ID für Medien
ALTER TABLE telegram_scheduled_messages 
ADD COLUMN IF NOT EXISTS media_file_id TEXT;

-- Caption für Medien (optional)
ALTER TABLE telegram_scheduled_messages 
ADD COLUMN IF NOT EXISTS caption TEXT;

-- Ziel-Kanal ID (für Channel Bot)
ALTER TABLE telegram_scheduled_messages 
ADD COLUMN IF NOT EXISTS target_channel_id TEXT;

-- Zufallsverzögerung in Minuten (Standard: 10)
ALTER TABLE telegram_scheduled_messages 
ADD COLUMN IF NOT EXISTS random_delay_minutes INTEGER DEFAULT 10;

-- Bot-Typ zur Unterscheidung (paid_group_bot, channel_bot)
ALTER TABLE telegram_scheduled_messages 
ADD COLUMN IF NOT EXISTS bot_type TEXT DEFAULT 'paid_group_bot';

-- ============================================
-- 2. Telegram Bot Sessions für Authentifizierung
-- ============================================

CREATE TABLE IF NOT EXISTS telegram_bot_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Telegram User Daten
    telegram_user_id BIGINT NOT NULL UNIQUE,
    telegram_username TEXT,
    telegram_first_name TEXT,
    
    -- Authentifizierung
    is_authenticated BOOLEAN DEFAULT FALSE,
    authenticated_at TIMESTAMP WITH TIME ZONE,
    
    -- Konversations-State für mehrstufige Befehle
    -- Mögliche States: 'idle', 'awaiting_login', 'awaiting_media', 
    --                  'awaiting_schedule_time', 'awaiting_recurring_config'
    conversation_state TEXT DEFAULT 'idle',
    
    -- Temporäre Daten während einer Konversation (z.B. gepuffertes Media)
    conversation_data JSONB DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index für schnelle Lookups
CREATE INDEX IF NOT EXISTS idx_telegram_bot_sessions_user_id 
ON telegram_bot_sessions(telegram_user_id);

-- ============================================
-- 3. Index für Channel Bot Nachrichten
-- ============================================

CREATE INDEX IF NOT EXISTS idx_scheduled_messages_channel_bot 
ON telegram_scheduled_messages(bot_type, is_active, next_run_at) 
WHERE bot_type = 'channel_bot';

-- ============================================
-- 4. Trigger für updated_at
-- ============================================

CREATE OR REPLACE FUNCTION update_telegram_bot_sessions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_telegram_bot_sessions_updated_at ON telegram_bot_sessions;

CREATE TRIGGER trigger_telegram_bot_sessions_updated_at
    BEFORE UPDATE ON telegram_bot_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_telegram_bot_sessions_updated_at();

-- ============================================
-- 5. RLS Policies (Row Level Security)
-- ============================================

-- Aktiviere RLS
ALTER TABLE telegram_bot_sessions ENABLE ROW LEVEL SECURITY;

-- Policy für Service Role (voller Zugriff)
DROP POLICY IF EXISTS telegram_bot_sessions_service_policy ON telegram_bot_sessions;
CREATE POLICY telegram_bot_sessions_service_policy ON telegram_bot_sessions
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- ============================================
-- Kommentar zur Verwendung
-- ============================================

COMMENT ON TABLE telegram_bot_sessions IS 
'Speichert Authentifizierungs- und Konversationsstatus für den Channel Bot';

COMMENT ON COLUMN telegram_scheduled_messages.media_type IS 
'Medientyp: photo, video, voice, document, animation, oder NULL für Text';

COMMENT ON COLUMN telegram_scheduled_messages.media_file_id IS 
'Telegram File ID für Medien - persistent und wiederverwendbar';

COMMENT ON COLUMN telegram_scheduled_messages.random_delay_minutes IS 
'Zufällige Verzögerung nach geplanter Zeit (0-N Minuten)';

COMMENT ON COLUMN telegram_scheduled_messages.bot_type IS 
'Bot-Typ: paid_group_bot (Standard) oder channel_bot';

-- Aktualisiert die Vimeo Video ID für den ELITE Funnel auf das neue Hero-Video
UPDATE protocol_settings
SET vimeo_video_id = '1184569668',
    updated_at = now()
WHERE id = 1;

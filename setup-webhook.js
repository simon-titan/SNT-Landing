const token = '8306953306:AAEBzDdHEHC8ZWjQAz6RGO4jXm4DmJwOJgc';

async function setupWebhook() {
  // WICHTIG: Ersetze diese URL mit deiner tatsächlichen Vercel URL
  const webhookUrl = 'https://www.snttrades.de//api/telegram/webhook';
  
  console.log('🔧 Setup Telegram Webhook...');
  console.log('URL:', webhookUrl);
  
  try {
    // Setze Webhook
    const response = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: webhookUrl,
        drop_pending_updates: true
      })
    });
    
    const result = await response.json();
    
    if (result.ok) {
      console.log('✅ Webhook erfolgreich gesetzt!');
      console.log('📝 Details:', result.description);
    } else {
      console.error('❌ Fehler beim Setzen des Webhooks:', result);
    }
    
    // Prüfe Webhook Info
    const infoResponse = await fetch(`https://api.telegram.org/bot${token}/getWebhookInfo`);
    const infoResult = await infoResponse.json();
    
    console.log('\n📊 Webhook Info:');
    console.log('URL:', infoResult.result.url);
    console.log('Pending Updates:', infoResult.result.pending_update_count);
    console.log('Last Error:', infoResult.result.last_error_message || 'Keine Fehler');
    
  } catch (error) {
    console.error('❌ Setup-Fehler:', error);
  }
}

// Script ausführen
setupWebhook(); 
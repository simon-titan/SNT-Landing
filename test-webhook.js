/**
 * PayPal Webhook Test Script
 * 
 * Dieses Skript simuliert PayPal Webhook-Events für lokale Tests.
 * Führen Sie es aus, während Ihr Development Server läuft.
 * 
 * Usage: node test-webhook.js
 */

const https = require('https');
const http = require('http');

// Test-Nachricht für den Webhook
const testMessage = {
  message: {
    message_id: 123,
    from: {
      id: 123456789,
      is_bot: false,
      first_name: "Test",
      username: "testuser"
    },
    chat: {
      id: 123456789,
      first_name: "Test",
      username: "testuser",
      type: "private"
    },
    date: Math.floor(Date.now() / 1000),
    text: "/start"
  }
};

async function testWebhook() {
  console.log('🧪 Teste Webhook direkt...');
  
  try {
    const response = await fetch('https://www.snttrades.de/api/telegram/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testMessage)
    });
    
    console.log('📊 Response Status:', response.status);
    console.log('📊 Response Headers:', Object.fromEntries(response.headers));
    
    const result = await response.text();
    console.log('📊 Response Body:', result);
    
    if (response.ok) {
      console.log('✅ Webhook funktioniert!');
    } else {
      console.log('❌ Webhook Problem:', response.status, result);
    }
    
  } catch (error) {
    console.error('❌ Fehler beim Testen:', error.message);
  }
}

testWebhook(); 
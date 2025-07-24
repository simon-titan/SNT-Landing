// Test-Script für direkten PayPal Webhook-Test
// Führe aus mit: node test-webhook-direct.js

const testPayPalWebhook = async () => {
  console.log('🧪 Teste PayPal Webhook-Endpoint direkt...\n');

  // Beispiel PayPal Event (PAYMENT.CAPTURE.COMPLETED)
  const testEvent = {
    id: 'WH-TEST-' + Date.now(),
    event_type: 'PAYMENT.CAPTURE.COMPLETED',
    resource_type: 'capture',
    summary: 'Test-Zahlung erfolgreich abgeschlossen',
    resource: {
      id: 'TEST_CAPTURE_ID',
      status: 'COMPLETED',
      amount: {
        currency_code: 'EUR',
        value: '97.00'
      },
      invoice_id: 'NULRVQG5GN8PE-test-lifetime',
      payer: {
        email_address: 'test@example.com',
        name: {
          given_name: 'Max',
          surname: 'Mustermann'
        }
      }
    },
    create_time: new Date().toISOString()
  };

  // Test-Headers (simuliert PayPal Webhook-Headers)
  const testHeaders = {
    'Content-Type': 'application/json',
    'User-Agent': 'PayPal/AUHD-214.0-54894290',
    'paypal-auth-algo': 'SHA256withRSA',
    'paypal-transmission-id': 'test-transmission-' + Date.now(),
    'paypal-cert-url': 'https://api.sandbox.paypal.com/v1/notifications/certs/test',
    'paypal-transmission-sig': 'test-signature-123',
    'paypal-transmission-time': new Date().toISOString()
  };

  try {
    // Bestimme die richtige URL
    const webhookUrl = process.env.WEBHOOK_URL || 'http://localhost:3000/api/webhooks/paypal';
    
    console.log(`📡 Sende Test-Request an: ${webhookUrl}`);
    console.log('📦 Test-Event:', JSON.stringify(testEvent, null, 2));
    console.log('\n⏳ Warte auf Antwort...\n');

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: testHeaders,
      body: JSON.stringify(testEvent)
    });

    console.log(`✅ Response Status: ${response.status} ${response.statusText}`);
    console.log('📄 Response Headers:', Object.fromEntries(response.headers.entries()));
    
    const responseBody = await response.text();
    console.log('📋 Response Body:');
    
    try {
      const jsonResponse = JSON.parse(responseBody);
      console.log(JSON.stringify(jsonResponse, null, 2));
    } catch {
      console.log(responseBody);
    }

  } catch (error) {
    console.error('❌ Fehler beim Testen des Webhooks:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Tipps:');
      console.log('1. Stelle sicher, dass dein Next.js Server läuft (npm run dev)');
      console.log('2. Überprüfe die URL in WEBHOOK_URL environment variable');
      console.log('3. Stelle sicher, dass der Port korrekt ist (normalerweise 3000)');
    }
  }
};

// Führe Test aus
testPayPalWebhook(); 
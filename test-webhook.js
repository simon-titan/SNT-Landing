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

// Test-Script für PayPal Webhook Endpunkt
const testPayload = {
  id: "WH-TEST-12345",
  event_type: "PAYMENT.CAPTURE.COMPLETED",
  resource_type: "capture",
  summary: "Test Webhook",
  resource: {
    id: "TEST123",
    payer: {
      email_address: "test@example.com",
      name: {
        given_name: "Test",
        surname: "Nutzer"
      }
    },
    invoice_id: "NULRVQG5GN8PE"
  },
  create_time: new Date().toISOString()
};

async function testWebhook() {
  try {
    const response = await fetch('http://localhost:3000/api/webhooks/paypal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'paypal-auth-algo': 'SHA256withRSA',
        'paypal-transmission-id': 'test-id',
        'paypal-cert-url': 'https://api.paypal.com/test',
        'paypal-transmission-sig': 'test-sig',
        'paypal-transmission-time': new Date().toISOString()
      },
      body: JSON.stringify(testPayload)
    });

    console.log('Response Status:', response.status);
    console.log('Response:', await response.text());
  } catch (error) {
    console.error('Fehler beim Testen:', error);
  }
}

testWebhook(); 
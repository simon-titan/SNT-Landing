const TELEGRAM_TOKEN = '8306953306:AAEBzDdHEHC8ZWjQAz6RGO4jXm4DmJwOJgc';
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;

// Hilfsfunktion zum Senden von Nachrichten
export async function sendMessage(chatId: number, text: string, options?: any) {
  const response = await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      ...options
    })
  });
  return response.json();
}

// Speichere User-Sessions (in Production solltest du eine Datenbank verwenden)
const userSessions = new Map<number, { stage: 'start' | 'selection' | 'payment' | 'completed' }>();

export function getUserSession(userId: number) {
  return userSessions.get(userId);
}

export function setUserSession(userId: number, session: { stage: 'start' | 'selection' | 'payment' | 'completed' }) {
  userSessions.set(userId, session);
}

// Funktion zum Senden der Erfolgs-Nachricht
export async function sendSuccessMessage(userId: number) {
  const successMessage = `Vielen Dank für dein Vertrauen! Jetzt geht´s richtig los!!! 🏆`;
  
  try {
    const session = getUserSession(userId);
    if (!session || session.stage === 'completed') {
      return;
    }

    await sendMessage(userId, successMessage, {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'SNTTRADES Dashboard', callback_data: 'dashboard' }],
          [{ text: 'Abo kündigen', callback_data: 'cancel_subscription' }]
        ]
      }
    });

    setUserSession(userId, { stage: 'completed' });
  } catch (error) {
    console.error('Fehler beim Senden der Erfolgs-Nachricht:', error);
  }
} 
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
  const successMessage = `Herzlich willkommen bei SNT-ELITE! 🏆

Deine Zugangsdaten hast du per E-Mail erhalten.

Die Plattform findest du unter: snt-elite-platform.de`;
  
  try {
    const session = getUserSession(userId);
    if (!session || session.stage === 'completed') {
      return;
    }

    await sendMessage(userId, successMessage);

    setUserSession(userId, { stage: 'completed' });
  } catch (error) {
    console.error('Fehler beim Senden der Erfolgs-Nachricht:', error);
  }
} 
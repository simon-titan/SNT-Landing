const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
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
  const successMessage = `HERZLICH WILLKOMMEN IN DER SNT FAMILY! 🚀

Du hast es geschafft - Dein Zugang ist freigeschaltet.

📥 WICHTIG:
Du hast soeben eine E-Mail erhalten. In dieser Mail findest du den Link, um dein Passwort für die Plattform festzulegen.

Bitte prüfe auch deinen Spam-Ordner!

Wir sehen uns im Training! 📊`;
  
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
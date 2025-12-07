import { NextResponse } from 'next/server';
import { sendSuccessMessage } from '@/lib/telegram';
export async function POST(request) {
    try {
        const body = await request.json();
        const { userId, telegramUserId } = body;
        if (!telegramUserId) {
            return NextResponse.json({ error: 'Telegram User ID ist erforderlich' }, { status: 400 });
        }
        // Sende Erfolgs-Nachricht über Webhook
        await sendSuccessMessage(telegramUserId);
        return NextResponse.json({
            success: true,
            message: 'Telegram Benachrichtigung erfolgreich gesendet'
        });
    }
    catch (error) {
        console.error('Fehler beim Senden der Telegram Benachrichtigung:', error);
        return NextResponse.json({ error: 'Fehler beim Senden der Telegram Benachrichtigung' }, { status: 500 });
    }
}
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const telegramUserId = searchParams.get('telegram_user_id');
    if (!telegramUserId) {
        return NextResponse.json({ error: 'Telegram User ID ist erforderlich' }, { status: 400 });
    }
    try {
        await sendSuccessMessage(parseInt(telegramUserId));
        return NextResponse.json({
            success: true,
            message: 'Telegram Benachrichtigung erfolgreich gesendet'
        });
    }
    catch (error) {
        console.error('Fehler beim Senden der Telegram Benachrichtigung:', error);
        return NextResponse.json({ error: 'Fehler beim Senden der Telegram Benachrichtigung' }, { status: 500 });
    }
}

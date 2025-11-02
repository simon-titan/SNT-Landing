import { NextRequest, NextResponse } from 'next/server';

const OUTSETA_DOMAIN = 'seitennull---fzco.outseta.com';
const OUTSETA_API_KEY = process.env.OUTSETA_API_KEY;
const OUTSETA_SECRET_KEY = process.env.OUTSETA_SECRET_KEY;

interface SubscribeRequest {
  email: string;
  emailListUid: string;
  sendWelcomeEmail?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body: SubscribeRequest = await request.json();
    const { email, emailListUid, sendWelcomeEmail = false } = body;

    if (!email || !emailListUid) {
      return NextResponse.json(
        { error: 'E-Mail und E-Mail-Liste UID sind erforderlich' },
        { status: 400 }
      );
    }

    if (!OUTSETA_API_KEY || !OUTSETA_SECRET_KEY) {
      console.error('Outseta API Credentials fehlen');
      return NextResponse.json(
        { error: 'Server-Konfigurationsfehler' },
        { status: 500 }
      );
    }

    // Person über E-Mail finden
    const personSearchResponse = await fetch(`https://${OUTSETA_DOMAIN}/api/v1/crm/people?fields=Uid,Email,FirstName,LastName&Email=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Outseta ${OUTSETA_API_KEY}:${OUTSETA_SECRET_KEY}`,
        'Content-Type': 'application/json',
      }
    });

    if (!personSearchResponse.ok) {
      return NextResponse.json(
        { error: 'Person konnte nicht gefunden werden' },
        { status: 404 }
      );
    }

    const personSearchResult = await personSearchResponse.json();
    const person = personSearchResult.items?.[0];
    
    if (!person || !person.Uid) {
      return NextResponse.json(
        { error: 'Keine Person mit dieser E-Mail gefunden' },
        { status: 404 }
      );
    }

    // Person zur E-Mail-Liste hinzufügen
    const subscriptionData = {
      EmailList: {
        Uid: emailListUid
      },
      Person: {
        Uid: person.Uid
      },
      SendWelcomeEmail: sendWelcomeEmail.toString()
    };

    const response = await fetch(`https://${OUTSETA_DOMAIN}/api/v1/email/lists/${emailListUid}/subscriptions`, {
      method: 'POST',
      headers: {
        'Authorization': `Outseta ${OUTSETA_API_KEY}:${OUTSETA_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscriptionData)
    });

    const responseText = await response.text();

    if (!response.ok) {
      return NextResponse.json(
        { 
          error: 'Fehler beim Hinzufügen zur E-Mail-Liste',
          details: responseText
        },
        { status: response.status }
      );
    }

    const result = JSON.parse(responseText);

    return NextResponse.json({
      success: true,
      message: 'Erfolgreich zur E-Mail-Liste hinzugefügt',
      subscription: result
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Interner Server-Fehler' },
      { status: 500 }
    );
  }
}

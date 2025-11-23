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

    // Person über E-Mail finden (mit Retry-Logik für neu erstellte Accounts)
    let person = null;
    let personSearchResult = null;
    
    for (let attempt = 0; attempt < 3; attempt++) {
      if (attempt > 0) {
        // Warte zwischen Versuchen (Account könnte noch erstellt werden)
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }

      const personSearchResponse = await fetch(`https://${OUTSETA_DOMAIN}/api/v1/crm/people?fields=Uid,Email,FirstName,LastName&Email=${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Outseta ${OUTSETA_API_KEY}:${OUTSETA_SECRET_KEY}`,
          'Content-Type': 'application/json',
        }
      });

      if (personSearchResponse.ok) {
        personSearchResult = await personSearchResponse.json();
        person = personSearchResult.items?.[0];
        
        if (person && person.Uid) {
          break; // Person gefunden
        }
      } else if (personSearchResponse.status !== 404) {
        // Bei anderen Fehlern als 404 sofort abbrechen
        const errorText = await personSearchResponse.text().catch(() => '');
        console.error(`Outseta API Fehler beim Suchen der Person: ${personSearchResponse.status}`, errorText);
        return NextResponse.json(
          { error: 'Fehler beim Suchen der Person', details: errorText },
          { status: personSearchResponse.status }
        );
      }
    }
    
    if (!person || !person.Uid) {
      console.warn(`Person mit E-Mail ${email} nicht gefunden nach 3 Versuchen`);
      return NextResponse.json(
        { error: 'Keine Person mit dieser E-Mail gefunden. Bitte warte einen Moment und versuche es erneut.' },
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
      // Prüfe ob Person bereits in der Liste ist (409 Conflict)
      if (response.status === 409 || responseText.includes('already') || responseText.includes('exists')) {
        console.log(`Person ${person.Uid} ist bereits in der E-Mail-Liste ${emailListUid}`);
        return NextResponse.json({
          success: true,
          message: 'Person ist bereits in der E-Mail-Liste',
          alreadySubscribed: true
        });
      }

      console.error(`Fehler beim Hinzufügen zur E-Mail-Liste: ${response.status}`, responseText);
      return NextResponse.json(
        { 
          error: 'Fehler beim Hinzufügen zur E-Mail-Liste',
          details: responseText
        },
        { status: response.status }
      );
    }

    let result;
    try {
      result = JSON.parse(responseText);
    } catch (e) {
      // Falls Response kein JSON ist, aber Status OK ist
      result = { success: true, message: responseText };
    }

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

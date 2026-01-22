import { NextRequest, NextResponse } from "next/server";

const OUTSETA_DOMAIN = process.env.NEXT_PUBLIC_OUTSETA_DOMAIN ?? "snttrades.outseta.com";
const OUTSETA_API_KEY = process.env.NEXT_PUBLIC_OUTSETA_API_KEY;
const OUTSETA_SECRET_KEY = process.env.OUTSETA_SECRET_KEY;

interface RegistrationRequest {
  firstName: string;
  lastName: string;
  email: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: RegistrationRequest = await request.json();
    const { firstName, lastName, email } = body;

    // Validierung
    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: "Alle Felder sind erforderlich" },
        { status: 400 }
      );
    }

    // E-Mail-Validierung
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Ungültige E-Mail-Adresse" },
        { status: 400 }
      );
    }

    if (!OUTSETA_API_KEY || !OUTSETA_SECRET_KEY) {
      console.error("Outseta API Credentials fehlen");
      return NextResponse.json(
        { error: "Server-Konfigurationsfehler" },
        { status: 500 }
      );
    }

    // E-Mail in localStorage speichern (wird vom Client gemacht)
    // Hier erstellen wir den Account direkt über Outseta

    const accountName = `${firstName} ${lastName}`;
    
    const registrationData = {
      Name: accountName,
      PersonAccount: [
        {
          IsPrimary: true,
          Person: {
            Email: email.trim().toLowerCase(),
            FirstName: firstName.trim(),
            LastName: lastName.trim(),
            Language: 'de'
          }
        }
      ],
      // Free Course - Plan UID wmjBBxmV
      Subscriptions: [
        {
          BillingRenewalTerm: 1,
          Plan: {
            Uid: "wmjBBxmV"
          }
        }
      ]
    };

    console.log("Free Course Registrierung:", { email, firstName, lastName });

    const registrationResponse = await fetch(`https://${OUTSETA_DOMAIN}/api/v1/crm/registrations`, {
      method: 'POST',
      headers: {
        'Authorization': `Outseta ${OUTSETA_API_KEY}:${OUTSETA_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registrationData)
    });

    const responseText = await registrationResponse.text();
    console.log("Outseta Response Status:", registrationResponse.status);
    console.log("Outseta Response Text:", responseText);

    if (!registrationResponse.ok) {
      let errorMessage = "Registrierung fehlgeschlagen";
      
      try {
        const errorData = JSON.parse(responseText);
        if (errorData.ErrorMessage) {
          errorMessage = errorData.ErrorMessage;
        }
      } catch (e) {
        // Ignore JSON parse errors
      }

      // Spezielle Behandlung für bereits existierende E-Mail
      if (registrationResponse.status === 400 && responseText.includes("already exists")) {
        errorMessage = "Ein Account mit dieser E-Mail-Adresse existiert bereits.";
      }

      console.error("Outseta Registrierung fehlgeschlagen:", errorMessage);
      return NextResponse.json(
        { error: errorMessage },
        { status: registrationResponse.status }
      );
    }

    let registrationResult;
    try {
      registrationResult = JSON.parse(responseText);
    } catch (e) {
      console.error("Fehler beim Parsen der Outseta Response:", e);
      return NextResponse.json(
        { error: "Unerwartete Server-Antwort" },
        { status: 500 }
      );
    }

    console.log("Free Course Registrierung erfolgreich:", {
      accountUid: registrationResult.Uid,
      email: email
    });

    // E-Mail-Liste Subscription wird auf der Thank-You-Seite gemacht
    return NextResponse.json({ 
      success: true,
      accountUid: registrationResult.Uid,
      message: "Registrierung erfolgreich"
    });

  } catch (error) {
    console.error("Unerwarteter Fehler bei Free Course Registrierung:", error);
    return NextResponse.json(
      { error: "Ein unerwarteter Fehler ist aufgetreten" },
      { status: 500 }
    );
  }
}
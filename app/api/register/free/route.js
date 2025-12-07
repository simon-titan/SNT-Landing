import { NextResponse } from "next/server";
const OUTSETA_DOMAIN = process.env.OUTSETA_DOMAIN || "seitennull---fzco.outseta.com";
const OUTSETA_API_KEY = process.env.OUTSETA_API_KEY;
const OUTSETA_SECRET_KEY = process.env.OUTSETA_SECRET_KEY;
const FREE_PLAN_UID = "wmjBBxmV";
export async function POST(request) {
    try {
        const body = await request.json();
        const { firstName, lastName, email } = body;
        if (!firstName || !lastName || !email) {
            return NextResponse.json({ error: "Vorname, Nachname und E-Mail sind erforderlich" }, { status: 400 });
        }
        if (!OUTSETA_API_KEY || !OUTSETA_SECRET_KEY) {
            console.error("Outseta API Credentials fehlen");
            return NextResponse.json({ error: "Server-Konfigurationsfehler" }, { status: 500 });
        }
        // Erstelle Registrierung direkt über Outseta API
        const registrationData = {
            Name: `${firstName} ${lastName}`,
            PersonAccount: [
                {
                    IsPrimary: true,
                    Person: {
                        Email: email,
                        FirstName: firstName,
                        LastName: lastName,
                        Language: "de",
                    },
                },
            ],
            Subscriptions: [
                {
                    BillingRenewalTerm: 1,
                    Plan: {
                        Uid: FREE_PLAN_UID,
                    },
                },
            ],
        };
        const response = await fetch(`https://${OUTSETA_DOMAIN}/api/v1/crm/registrations`, {
            method: "POST",
            headers: {
                Authorization: `Outseta ${OUTSETA_API_KEY}:${OUTSETA_SECRET_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(registrationData),
        });
        if (!response.ok) {
            const errorData = await response.text();
            console.error("Outseta Registrierungsfehler:", errorData);
            return NextResponse.json({ error: "Registrierung fehlgeschlagen. Bitte versuche es erneut." }, { status: response.status });
        }
        const result = await response.json();
        return NextResponse.json({
            success: true,
            message: "Registrierung erfolgreich",
            data: result,
        });
    }
    catch (error) {
        console.error("Fehler bei der Registrierung:", error);
        return NextResponse.json({ error: "Ein Fehler ist aufgetreten. Bitte versuche es erneut." }, { status: 500 });
    }
}

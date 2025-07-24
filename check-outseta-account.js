// Script um Outseta Account direkt zu überprüfen
const checkOutsetaAccount = async () => {
  console.log('🔍 Überprüfe Outseta Account direkt...\n');

  const outsetaDomain = 'seitennull---fzco.outseta.com';
  const outsetaApiKey = '9e7e21fb-147a-4e7e-b137-6a1459c78b77';
  const outsetaSecretKey = '7c37ebc69ff5b7e012c470ea7b20e819';
  
  const accountUid = 'LmJXAVA9';
  const email = 'aliduhoky42@gmail.com';

  try {
    // 1. Nach Account UID suchen
    console.log(`📋 Suche nach Account UID: ${accountUid}`);
    
    const accountResponse = await fetch(`https://${outsetaDomain}/api/v1/crm/people/${accountUid}`, {
      method: 'GET',
      headers: {
        'Authorization': `Outseta ${outsetaApiKey}:${outsetaSecretKey}`,
        'Content-Type': 'application/json',
      }
    });

    console.log(`📊 Account-Abfrage Status: ${accountResponse.status}`);
    
    if (accountResponse.ok) {
      const accountData = await accountResponse.json();
      console.log('✅ Account gefunden:');
      console.log(JSON.stringify(accountData, null, 2));
    } else {
      const errorText = await accountResponse.text();
      console.log(`❌ Account nicht gefunden: ${errorText}`);
    }

    // 2. Nach E-Mail suchen
    console.log(`\n📧 Suche nach E-Mail: ${email}`);
    
    const emailResponse = await fetch(`https://${outsetaDomain}/api/v1/crm/people?fields=*&Email=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Outseta ${outsetaApiKey}:${outsetaSecretKey}`,
        'Content-Type': 'application/json',
      }
    });

    console.log(`📊 E-Mail-Abfrage Status: ${emailResponse.status}`);
    
    if (emailResponse.ok) {
      const emailData = await emailResponse.json();
      console.log('✅ Accounts mit dieser E-Mail:');
      console.log(JSON.stringify(emailData, null, 2));
    } else {
      const errorText = await emailResponse.text();
      console.log(`❌ Keine Accounts mit E-Mail gefunden: ${errorText}`);
    }

    // 3. Alle Recent People auflisten
    console.log(`\n📋 Letzte 10 erstellte Accounts:`);
    
    const recentResponse = await fetch(`https://${outsetaDomain}/api/v1/crm/people?fields=*&offset=0&limit=10`, {
      method: 'GET',
      headers: {
        'Authorization': `Outseta ${outsetaApiKey}:${outsetaSecretKey}`,
        'Content-Type': 'application/json',
      }
    });

    if (recentResponse.ok) {
      const recentData = await recentResponse.json();
      console.log('📋 Recent Accounts:');
      
      if (recentData.Items && recentData.Items.length > 0) {
        recentData.Items.forEach((person, index) => {
          console.log(`${index + 1}. UID: ${person.Uid}, Email: ${person.Email || 'keine'}, Name: ${person.FullName || 'unbekannt'}, Erstellt: ${person.Created}`);
        });
      } else {
        console.log('❌ Keine Recent Accounts gefunden');
      }
    }

  } catch (error) {
    console.error('❌ Fehler bei Outseta-Abfrage:', error.message);
  }
};

// Script ausführen
checkOutsetaAccount(); 
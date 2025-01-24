export const outsetaConfig = {
  domain: "project-rocket.outseta.com",
  load: "auth,profile,support,chat,emailList,leadCapture,nocode",
  monitorDom: true,
  tokenStorage: "cookie",
  translationLang: "en",
  auth: {
    /** URL to redirect after successful registration */
    postRegistrationUrl:
      process.env.NODE_ENV === "production"
        ? "https://project-rocket.danielwirtz.com/thank-you"
        : "http://localhost:3000/thank-you",
    /** URL to redirect after successful authentication */
    authenticationCallbackUrl:
      process.env.NODE_ENV === "production"
        ? "https://project-rocket.danielwirtz.com/app"
        : "http://localhost:3000/app",
    rememberLastEmail: true,
    /** Public JWT for Outseta (Find under Sign Up > Advanced in Outseta) */
    publicKey: `-----BEGIN CERTIFICATE----- 
MIICzDCCAbSgAwIBAgIQANOnyWX39GOTemR5gtC1pTANBgkqhkiG9w0BAQ0FADAhMR8wHQYDVQQD

DBZlYXN5LXRpbWVyLm91dHNldGEuY29tMCAXDTI0MTIwMjE0NDQzM1oYDzIxMjQxMjAyMTQ0NDMz

WjAhMR8wHQYDVQQDDBZlYXN5LXRpbWVyLm91dHNldGEuY29tMIIBIjANBgkqhkiG9w0BAQEFAAOC

AQ8AMIIBCgKCAQEAj1dcGuHuf6CzO0oPfbISnTdhBTBQYNPsxdsE6wHZXEbSainl6JFsisJCDoS5

Jfq+yPUYJafn4dN9n50whJ2epk3MA/y7sYfa9qkJi0FSLKDOTyiVy0suWJNl9TOY4bBXhB9XiKAW

XRugbV2ppSE2tG38oz6+gLpJYlUI2zPdZxL+OTbCnveDgF/sB833WjMxp4cYJZMI2nDvQIX/2N4K

7svPsiiyQONpNkKtYG/A4to1/kG4+KWcMEYS6b2Z5gY1qLynHUDdRRJotr7AMYaaev1M1Nn4gkv1

T/ksXMQHaRCIFwdEzVsHiQ4M0U1nEoiWtld1pGnw325XtUYiMgJiiwIDAQABMA0GCSqGSIb3DQEB

DQUAA4IBAQBhZvzrRnNu7u01areF1ZCaAeVhxJgHtl3P3c9XuFL1gEtvYYJOQCs0yltXfj7lfJj+

OD7TgCXNfeZ0NEqoJuPXo6m2r3jxvbkDPf3eZ4kPefaopzgDwAVVTUg2t+3DhZs5VdKoMWOVX735

QQpgi5FW0GQ7JfAOdHseUDhTy3YRWfwWTbipKC8Er8N8txwDwVBk7fG6MHGDQlxA+Nn9OdhjdNYN

dUAFZS2Kde57b5SzBeK4yAbBVGg2dnJPhESEVnARhg49pfTgS7c9RgcYt079i2ssClctf76uBnPG

GEtwkQBpw6TGcCdD5QsNQ09z5Cm2KCm/RQjsXImYK/dhWYEc
-----END CERTIFICATE-----`,
  },
};

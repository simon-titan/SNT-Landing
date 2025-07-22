export const outsetaConfig = {
  domain: "seitennull---fzco.outseta.com",
  load: "auth,profile,support,chat,emailList,leadCapture,nocode",
  monitorDom: true,
  tokenStorage: "cookie",
  translationLang: "de",
  auth: {
    /** URL to redirect after successful registration */
    postLoginUrl:
      process.env.NODE_ENV === "production"
        ? "https://www.snttrades.de/app"
        : "http://localhost:3000/app",
    postRegistrationUrl:
      process.env.NODE_ENV === "production"
        ? "https://www.snttrades.de/thank-you"
        : "http://localhost:3000/thank-you",
    /** URL to redirect after successful authentication */
    authenticationCallbackUrl:
      process.env.NODE_ENV === "production"
        ? "https://www.snttrades.de/app"
        : "http://localhost:3000/app",
    rememberLastEmail: true,
    /** Public JWT for Outseta (Find under Sign Up > Advanced in Outseta) */
    publicKey: `-----BEGIN CERTIFICATE----- 
MIIC2jCCAcKgAwIBAgIQAKAcrHmWczpE32x4b9Nl3zANBgkqhkiG9w0BAQ0FADAoMSYwJAYDVQQD
DB1zZWl0ZW5udWxsLS0tZnpjby5vdXRzZXRhLmNvbTAgFw0yNTAzMjcxNjUwMjNaGA8yMTI1MDMy
NzE2NTAyM1owKDEmMCQGA1UEAwwdc2VpdGVubnVsbC0tLWZ6Y28ub3V0c2V0YS5jb20wggEiMA0G
CSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCd//O8U6hhivo/yOEshuLDzkulRSQFcIjODVcvp2+m
RT0khnGHW3kWgQfojyf4zguwTVXrcLaQpKu3fuPaO6PqLl3ep+AQ+ZP5QvYPQcds0iTIV1DNpROX
tuLaCoTpSngaNoRMGmQExEOogLfcFuUhNR8VJdG9NhdAbf6xvBlU2ZHoLk1JCSZRVsO/uGom5HYm
7rGxAjMzykXXrAKP2UjDOzLH3O/mAQjndTD0bBLc71Ct++sjoTm55gmdseNeBbqY4HLNVrO8WyMh
4IS2w54bkvVOHL5MTlU9hn/ditEAJ0JqOrQaZTyqv/VQ33Vmd4YuAdcvHntxKLSW2D4KVrh7AgMB
AAEwDQYJKoZIhvcNAQENBQADggEBAELxV8Yat1RvYNnGz3LaKA0WtE3eKtbqSU90wFgLZAVJH+rW
s379hHaELK0Zl6GQdCcYhHYwYW6+6q6qrB6nj58UpiH6qaE3/LEcWtebOdIzB1xhFcW5n+8Gnz27
xbuGWxUqIQxSrBVHJoXF1go3WAB75fGT77MDROuLE7fRqbLA1d5Qjxj+qxRMiYq+73xClShGCrZW
5jd5vRARZ3/M1nXzVUYZSCCFLf5LZQJeegn9TuV/HABDFTD0UfOG8gjnKvdIV3pU8o9rgZ2X7Ruj
ZqjJ5Ui4qrm82yEonXMX74PefEJXzFm3otRqTzF0YhK4WOp0XaxpVNRVKeph50wtLEU=
-----END CERTIFICATE----- `,
  },
};
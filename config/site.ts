export const siteConfig = {
  /** Basic site information used throughout the application */
  name: "Project Starter",
  description: "A powerful starter template for building web applications",
  siteUrl: "https://your-domain.com",
  ogImage: "/og-image.jpg",

  /** Theme customization settings */
  theme: {
    /** Base neutral colors for UI elements */
    neutralColorPalette: "gray",
    /** Primary brand color used for main actions and highlights */
    primaryColorPalette: "green",
    /** Secondary brand color for complementary elements */
    secondaryColorPalette: "purple",
    headingFont: "Inter",
    bodyFont: "Inter",
    borderRadius: "md",
    colorMode: "light",
  },

  /** Outseta integration configuration */
  outsetaOptions: {
    /** Your Outseta domain */
    domain: "project-rocket.outseta.com",
    /** Modules to load: auth, profile, support, etc */
    load: "auth,profile,support,chat,emailList,leadCapture,nocode",
    monitorDom: true,
    tokenStorage: "cookie",
    translationLang: "en",
    /** Authentication specific settings */
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
  },

  /** Subscription plan configuration */
  outsetaPlans: {
    plans: {
      /** Basic tier configuration */
      basic: {
        uid: "L9nqaeQZ",
        label: "Basic",
      },
      /** Pro tier configuration */
      pro: {
        uid: "LmJZpYmP",
        label: "Pro",
      },
    },
  },

  /** Additional Outseta widget options */
  outsetaExtraOptions: {
    /** Pages where chat widget should be shown */
    showChatOn: "**",
  },

  /** Support contact information */
  support: {
    email: "support@project-rocket.com",
  },

  /** Social media links */
  links: {
    twitter: "https://twitter.com",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },

  cookieBannerOptions: {
    root: "body",
    guiOptions: {
      consentModal: {
        layout: "box",
        position: "bottom left",
        equalWeightButtons: false,
        flipButtons: false,
      },
      preferencesModal: {
        layout: "box",
        position: "right",
        equalWeightButtons: true,
        flipButtons: false,
      },
    },
    categories: {
      necessary: {
        enabled: true,
        readOnly: true,
      },
      functionality: {
        enabled: false,
        readOnly: false,
      },
      analytics: {
        enabled: false,
        readOnly: false,
        autoClear: {
          cookies: [
            {
              name: /^_ga/,
            },
          ],
        },
      },
      marketing: {
        enabled: false,
        readOnly: false,
      },
    },
    language: {
      default: "en",
      translations: {
        en: {
          consentModal: {
            description:
              "We use cookies to improve your experience and understand site traffic. Read our <a href='/legal/cookie-policy'>Cookie Policy</a> or <a data-cc='show-preferencesModal'>manage your preferences</a>.",
            acceptAllBtn: "Accept all",
            acceptNecessaryBtn: "Reject all",
          },
          preferencesModal: {
            title: "Consent Preferences Center",
            acceptAllBtn: "Accept all",
            acceptNecessaryBtn: "Reject all",
            savePreferencesBtn: "Save preferences",
            closeIconLabel: "Close modal",
            serviceCounterLabel: "Service|Services",
            sections: [
              {
                title: "Cookie Usage",
                description:
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
              },
              {
                title:
                  'Strictly Necessary Cookies <span class="pm__badge">Always Enabled</span>',
                description:
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                linkedCategory: "necessary",
              },
              {
                title: "Functionality Cookies",
                description:
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                linkedCategory: "functionality",
              },
              {
                title: "Analytics Cookies",
                description:
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                linkedCategory: "analytics",
              },
              {
                title: "Advertisement Cookies",
                description:
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                linkedCategory: "marketing",
              },
              {
                title: "More information",
                description:
                  'For any query in relation to my policy on cookies and your choices, please <a class="cc__link" href="#yourdomain.com">contact me</a>.',
              },
            ],
          },
        },
      },
    },
  },
  seo: {
    titleTemplate: "%s | Project Rocket",
    defaultTitle: "Project Rocket - Build Web Apps Faster",
    robotsDisallowPaths: ["/app/*", "/api/*"],
    defaultDescription:
      "A powerful starter template for building web applications with Next.js, Chakra UI, and Outseta",
    twitterHandle: "@yourtwitterhandle",
    locale: "en_US",
  },
};

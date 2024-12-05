export const siteConfig = {
  name: "Project Starter",
  theme: {
    neutralColorPalette: "gray",
    primaryColorPalette: "green",
    secondaryColorPalette: "purple",
    headingFont: "Inter",
    bodyFont: "Inter",
    borderRadius: "md",
  },
  outsetaOptions: {
    domain: "easy-timer.outseta.com",
    load: "auth,profile,support,chat,nocode,emailList,leadCapture",
    monitorDom: true,
    tokenStorage: "cookie",
    translationLang: "en",
    auth: {
      postRegistrationUrl: "http://localhost:3000/thank-you",
      rememberLastEmail: true,
    },
  },
  outsetaPlans: {
    plans: {
      basic: {
        uid: "L9nqaeQZ",
        label: "Basic",
      },
      pro: {
        uid: "LmJZpYmP",
        label: "Pro",
      },
    },
  },
  outsetaExtraOptions: {
    showChatOn: "**",
  },
  support: {
    email: "support@project.com",
  },
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
              "We use cookies to enhance your experience, analyze site traffic and deliver personalized content. Read our <a href='/legal/cookie-policy'>Cookie Policy</a>.",
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
};

export const isDevelopment = () => {
  return process.env.NODE_ENV === "development";
};

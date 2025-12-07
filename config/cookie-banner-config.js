export const cookieBannerConfig = {
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
                    description: "Wir verwenden Cookies, um dein Nutzererlebnis zu verbessern. Lies unsere <a href='/legal/cookie-policy'>Cookie-Richtlinie</a> oder <a data-cc='show-preferencesModal'>verwalte deine Einstellungen</a>.",
                    acceptAllBtn: "Alle akzeptieren",
                    acceptNecessaryBtn: "Alle ablehnen",
                },
                preferencesModal: {
                    title: "Cookie-Einstellungen",
                    acceptAllBtn: "Alle akzeptieren",
                    acceptNecessaryBtn: "Alle ablehnen",
                    savePreferencesBtn: "Einstellungen speichern",
                    closeIconLabel: "Modal schließen",
                    serviceCounterLabel: "Service|Services",
                    sections: [
                        {
                            title: "Verwendung von Cookies",
                            description: "Cookies helfen uns, deine Erfahrung auf unserer Website zu verbessern. Durch die Nutzung unserer Dienste erklärst du dich mit unserer Cookie-Richtlinie einverstanden.",
                        },
                        {
                            title: 'Notwendige Cookies <span class="pm__badge">Immer aktiviert</span>',
                            description: "Diese Cookies sind für die Grundfunktionen der Website erforderlich und können nicht deaktiviert werden.",
                            linkedCategory: "necessary",
                        },
                        {
                            title: "Funktionale Cookies",
                            description: "Diese Cookies ermöglichen erweiterte Funktionen wie persönliche Einstellungen und gespeicherte Präferenzen.",
                            linkedCategory: "functionality",
                        },
                        {
                            title: "Analytics-Cookies",
                            description: "Diese Cookies helfen uns, die Nutzung der Website zu analysieren und die Benutzererfahrung zu optimieren.",
                            linkedCategory: "analytics",
                        },
                        {
                            title: "Marketing-Cookies",
                            description: "Diese Cookies werden für personalisierte Werbung verwendet und können Daten mit Drittanbietern teilen.",
                            linkedCategory: "marketing",
                        },
                        {
                            title: "Weitere Informationen",
                            description: 'Bei Fragen zu unserer Cookie-Richtlinie oder deinen Einstellungen <a class="cc__link" href="https://www.snt-elitetrades-platform.de/contact">kontaktiere uns bitte</a>.',
                        },
                    ],
                },
            },
        },
    },
};

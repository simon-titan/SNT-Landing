
export const pricingConfig = {
  /**
   * Rabatt aktivieren/deaktivieren
   * true = 50% Rabatt aktiv (44.90€/247€)
   * false = Standardpreise (97€/467€)
   */
  discountActive: true,

  /** Standardpreise (ohne Rabatt) */
  standard: {
    monthly: {
      price: 97,
      originalPrice: null as number | null, // kein durchgestrichener Preis
      savings: null as string | null,
      savingsAmount: null as string | null,
      label: "PRO MONAT",
      paypal: {
        planId: "P-7LS829244N6815906NEXPFVA",
        containerId: "paypal-button-container-P-7LS829244N6815906NEXPFVA",
      },
      outseta: {
        planUid: "79O7dk9E",
        paymentTerm: "month",
      },
      webhook: {
        outsetaPlanUid: "DQ2LwwWV", // PAYPAL-SNT-PREMIUM
      },
    },
    lifetime: {
      price: 467,
      originalPrice: null as number | null,
      savings: null as string | null,
      savingsAmount: null as string | null,
      label: "EINMALIG",
      paypal: {
        hostedButtonId: "MXYWGLBVSQTXW",
        containerId: "paypal-container-MXYWGLBVSQTXW",
        sdkUrl: "https://www.paypal.com/sdk/js?client-id=BAA-0m5pkSxHufms7Bz99yWR1lzshrXB63L2g-cvYFfUsI1-ul1VcqCAsVudEICk3cLUAXx2VAsCFuuTHY&components=hosted-buttons&disable-funding=venmo&currency=EUR",
      },
      outseta: {
        planUid: "j9bDzomn",
        paymentTerm: "oneTime",
      },
      webhook: {
        outsetaPlanUid: "L9nbBg9Z", // PAYPAL-SNT-PREMIUM-LIFETIME
      },
    },
  },

  /** Rabatt-Preise (50% Rabatt) */
  discount: {
    monthly: {
      price: 44.90,
      originalPrice: 97,
      savings: "50%",
      savingsAmount: "52.10€",
      label: "PRO MONAT",
      paypal: {
        planId: "P-59C23375XF491315BNCBCDVQ",
        containerId: "paypal-button-container-P-59C23375XF491315BNCBCDVQ",
      },
      outseta: {
        planUid: "7ma651QE",
        paymentTerm: "month",
      },
      webhook: {
        outsetaPlanUid: "Nmd4Oxm0",
      },
    },
    lifetime: {
      price: 247,
      originalPrice: 467,
      savings: "50%",
      savingsAmount: "220€",
      label: "EINMALIG",
      paypal: {
        hostedButtonId: "68525GEP8BKRS",
        containerId: "paypal-container-68525GEP8BKRS",
        sdkUrl: "https://www.paypal.com/sdk/js?client-id=BAA-0m5pkSxHufms7Bz99yWR1lzshrXB63L2g-cvYFfUsI1-ul1VcqCAsVudEICk3cLUAXx2VAsCFuuTHY&components=hosted-buttons&disable-funding=venmo&currency=EUR",
      },
      outseta: {
        planUid: "496LXdmX",
        paymentTerm: "oneTime",
      },
      webhook: {
        outsetaPlanUid: "rmkzJaWg",
      },
    },
  },
};

/** Helper um aktuelle Preise zu bekommen */
export function getCurrentPricing() {
  return pricingConfig.discountActive ? pricingConfig.discount : pricingConfig.standard;
}

/** Helper für Monthly-Preise */
export function getMonthlyPricing() {
  return getCurrentPricing().monthly;
}

/** Helper für Lifetime-Preise */
export function getLifetimePricing() {
  return getCurrentPricing().lifetime;
}

/** Prüft ob Rabatt aktiv ist */
export function isDiscountActive() {
  return pricingConfig.discountActive;
}



export const pricingConfig = {
  /**
   * Rabatt aktivieren/deaktivieren
   * true = Aktive Preise (47€/247€) - ohne Sale-Optik
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
    quarterly: {
      price: 127,
      originalPrice: null as number | null,
      savings: null as string | null,
      savingsAmount: null as string | null,
      label: "PRO QUARTAL",
      paypal: {
        planId: "P-01T08443068363936NGEIXPY",
        containerId: "paypal-button-container-P-01T08443068363936NGEIXPY",
      },
      outseta: {
        planUid: "MQv8vRWY",
        paymentTerm: "quarter",
      },
      webhook: {
        outsetaPlanUid: "Dmw8qyQ4", // PayPal -> Outseta Mapping für Quartal
      },
    },
    annual: {
      price: 367,
      originalPrice: null as number | null,
      savings: null as string | null,
      savingsAmount: null as string | null,
      label: "PRO JAHR",
      paypal: {
        planId: "P-8L796165Y0201293WNGEI3II",
        containerId: "paypal-button-container-P-8L796165Y0201293WNGEI3II",
      },
      outseta: {
        planUid: "yWoP7YmD",
        paymentTerm: "annual",
      },
      webhook: {
        outsetaPlanUid: "yW10Vy9B", // PayPal -> Outseta Mapping für Jährlich
      },
    },
    /** @deprecated Lifetime wird nicht mehr in der UI angezeigt, bleibt für bestehende Kunden */
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

  /** Aktive Preise (47€/127€/367€) - ohne Sale-Optik */
  discount: {
    monthly: {
      price: 47,
      originalPrice: null as number | null, // Keine Sale-Optik, aber Logik bleibt erhalten
      savings: null as string | null,
      savingsAmount: null as string | null,
      label: "PRO MONAT",
      paypal: {
        planId: "P-86799084EE8763009NE273NY",
        containerId: "paypal-button-container-P-86799084EE8763009NE273NY",
      },
      outseta: {
        planUid: "7ma651QE",
        paymentTerm: "month",
      },
      webhook: {
        outsetaPlanUid: "Nmd4Oxm0",
      },
    },
    quarterly: {
      price: 127,
      originalPrice: null as number | null,
      savings: null as string | null,
      savingsAmount: null as string | null,
      label: "PRO QUARTAL",
      paypal: {
        planId: "P-01T08443068363936NGEIXPY",
        containerId: "paypal-button-container-P-01T08443068363936NGEIXPY",
      },
      outseta: {
        planUid: "MQv8vRWY",
        paymentTerm: "quarter",
      },
      webhook: {
        outsetaPlanUid: "Dmw8qyQ4", // PayPal -> Outseta Mapping für Quartal
      },
    },
    annual: {
      price: 367,
      originalPrice: null as number | null,
      savings: null as string | null,
      savingsAmount: null as string | null,
      label: "PRO JAHR",
      paypal: {
        planId: "P-8L796165Y0201293WNGEI3II",
        containerId: "paypal-button-container-P-8L796165Y0201293WNGEI3II",
      },
      outseta: {
        planUid: "yWoP7YmD",
        paymentTerm: "annual",
      },
      webhook: {
        outsetaPlanUid: "yW10Vy9B", // PayPal -> Outseta Mapping für Jährlich
      },
    },
    /** @deprecated Lifetime wird nicht mehr in der UI angezeigt, bleibt für bestehende Kunden */
    lifetime: {
      price: 247,
      originalPrice: null as number | null, // Keine Sale-Optik, aber Logik bleibt erhalten
      savings: null as string | null,
      savingsAmount: null as string | null,
      label: "EINMALIG",
      paypal: {
        hostedButtonId: "WJFRTGKPWUZPG",
        containerId: "paypal-container-WJFRTGKPWUZPG",
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

/** Helper für Quarterly-Preise */
export function getQuarterlyPricing() {
  return getCurrentPricing().quarterly;
}

/** Helper für Annual-Preise */
export function getAnnualPricing() {
  return getCurrentPricing().annual;
}

/** Helper für Lifetime-Preise @deprecated */
export function getLifetimePricing() {
  return getCurrentPricing().lifetime;
}

/** Prüft ob Rabatt aktiv ist */
export function isDiscountActive() {
  return pricingConfig.discountActive;
}


// ============================================================================
// Globale Konstanten für Kundenmagnetapp
// ----------------------------------------------------------------------------
// Alle rechtlichen, geschäftlichen und produktbezogenen Angaben werden hier
// zentral gepflegt, um sie auf Impressum, Datenschutz, Footer etc. konsistent
// auszugeben.
//
// Kommentare sind vollständig auf Deutsch gehalten.
// ============================================================================

export const BRAND = {
  // Produktname (SaaS)
  name: 'Kundenmagnetapp',

  // Hauptdomain des Projekts
  domain: 'kundenmagnet-app.de',

  // Handels-/Markenname, unter dem das Unternehmen auftritt
  tradeName: 'WK Creative Studio',

  // Anzeigeform für rechtliche Hinweise (anstelle von "Einzelunternehmer")
  legalForm: 'WK Creative Studio (Inhaber: Klaus Weisgerber)',

  // Verantwortliche Person / Eigentümer
  owner: 'Klaus Weisgerber',

  supportEmail: 'support@kundenmagnet-app.de',

  // Geschäftsanschrift laut Impressum
  address: {
    street: 'Eibenweg 1',
    zip: '97084',
    city: 'Würzburg',
    country: 'Deutschland',
  },

  // Telefonische Erreichbarkeit
  phone: '+49 176 56141624',

  // E-Mail-Adressen (Support + No-Reply)
  email: {
    support: 'support@kundenmagnet-app.de',
    noreply: 'no-reply@kundenmagnet-app.de', // ursprünglicher Key
    noReply: 'no-reply@kundenmagnet-app.de', // für Rückwärtskompatibilität
  },

  // Tarifpläne für Preisseite und Billing-Logik
  plans: {
    starter: {
      name: 'Starter',
      price: 9,
      currency: '€',
      limits: {
        campaigns: 1, // 1 Kampagne erlaubt
      },
    },
    pro: {
      name: 'Pro',
      price: 19,
      currency: '€',
      limits: {
        campaigns: 10, // bis zu 10 Kampagnen
      },
    },
    business: {
      name: 'Business',
      price: 39,
      currency: '€',
      limits: {
        campaigns: -1, // unbegrenzt (-1 steht für "unlimited")
      },
    },
  },
} as const

// Schlüssel für Cookie-Consent-Speicherung (LocalStorage)
export const COOKIE_CONSENT_KEY = 'km_cookie_consent'

// Versionierung für Consent-Mechanismus (z. B. nach Textänderungen erhöhen)
export const COOKIE_CONSENT_VERSION = '1.0.0'

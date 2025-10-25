// lib/i18n/types.ts
/**
 * i18n Type-Definitionen für Kundenmagnetapp
 * Alle Übersetzungen sind typsicher und auto-vervollständigt
 */

export type Locale = 'de' // Aktuell nur Deutsch, später erweiterbar: 'de' | 'en' | 'fr'

/**
 * Struktur der Übersetzungen
 * Organisiert nach Bereichen für bessere Übersichtlichkeit
 */
export interface Translations {
  common: {
    appName: string
    loading: string
    error: string
    success: string
    cancel: string
    save: string
    delete: string
    edit: string
    create: string
    back: string
    next: string
    previous: string
    close: string
    confirm: string
    search: string
    filter: string
    sort: string
    actions: string
    status: string
    date: string
    email: string
    name: string
    description: string
    optional: string
    required: string
    yes: string
    no: string
    or: string
    and: string
  }

  auth: {
    login: string
    logout: string
    register: string
    forgotPassword: string
    resetPassword: string
    emailLabel: string
    passwordLabel: string
    nameLabel: string
    loginButton: string
    registerButton: string
    alreadyHaveAccount: string
    dontHaveAccount: string
    magicLinkSent: string
    checkYourEmail: string
    invalidCredentials: string
    passwordTooShort: string
    emailRequired: string
    passwordRequired: string
  }

  marketing: {
    hero: {
      title: string
      subtitle: string
      ctaPrimary: string
      ctaSecondary: string
    }
    features: {
      title: string
      subtitle: string
    }
    pricing: {
      title: string
      subtitle: string
      priceNote: string
      ctaTrial: string
      perMonth: string
      starter: {
        name: string
        description: string
        price: string
      }
      pro: {
        name: string
        description: string
        price: string
      }
      business: {
        name: string
        description: string
        price: string
      }
    }
    footer: {
      company: string
      product: string
      support: string
      legal: string
      followUs: string
      allRightsReserved: string
    }
  }

  app: {
    nav: {
      dashboard: string
      campaigns: string
      testimonials: string
      widget: string
      qrCodes: string
      settings: string
      billing: string
    }
    campaigns: {
      title: string
      create: string
      noCampaigns: string
      createFirst: string
      active: string
      inactive: string
      draft: string
    }
    testimonials: {
      title: string
      pending: string
      approved: string
      hidden: string
      moderate: string
      approve: string
      hide: string
      anonymize: string
      noTestimonials: string
    }
    widget: {
      title: string
      preview: string
      install: string
      customize: string
      noWidget: string
    }
    qr: {
      title: string
      create: string
      download: string
      print: string
      noQrCodes: string
    }
    settings: {
      title: string
      profile: string
      account: string
      notifications: string
      privacy: string
    }
    billing: {
      title: string
      currentPlan: string
      upgrade: string
      downgrade: string
      cancel: string
      manageSubscription: string
      invoices: string
    }
  }

  legal: {
    imprint: string
    privacy: string
    terms: string
    dpa: string
    cookiePolicy: string
  }

  errors: {
    notFound: string
    unauthorized: string
    forbidden: string
    serverError: string
    networkError: string
    validationError: string
    tryAgain: string
    contactSupport: string
  }

  notifications: {
    campaignCreated: string
    campaignUpdated: string
    campaignDeleted: string
    testimonialApproved: string
    testimonialHidden: string
    testimonialAnonymized: string
    settingsSaved: string
    emailSent: string
    qrCodeCreated: string
  }
}

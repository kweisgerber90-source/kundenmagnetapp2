// lib/constants.ts
export const BRAND = {
  name: 'Kundenmagnetapp',
  domain: 'kundenmagnet-app.de',
  legalForm: 'Einzelunternehmer',
  owner: 'Weisgerber Klaus',
  address: {
    street: 'Eibenweg 1',
    zip: '97084',
    city: 'Würzburg',
    country: 'Deutschland',
  },
  phone: '+49 176 56141624',
  email: {
    support: 'support@kundenmagnet-app.de',
    noreply: 'no-reply@kundenmagnet-app.de',
  },
  plans: {
    starter: { name: 'Starter', price: 9, currency: '€' },
    pro: { name: 'Pro', price: 19, currency: '€' },
    business: { name: 'Business', price: 39, currency: '€' },
  },
} as const

export const COOKIE_CONSENT_KEY = 'km_cookie_consent'
export const COOKIE_CONSENT_VERSION = '1.0.0'

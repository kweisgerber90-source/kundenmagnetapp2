// lib/i18n/index.ts
/**
 * i18n System für Kundenmagnetapp
 * Type-safe Übersetzungsfunktionen mit Deutsch als Basissprache
 */

import { de } from './translations/de'
import type { Locale, Translations } from './types'

// Standard-Sprache für die Anwendung
export const DEFAULT_LOCALE: Locale = 'de'

// Alle verfügbaren Übersetzungen
const translations: Record<Locale, Translations> = {
  de,
}

/**
 * Holt die Übersetzungen für eine bestimmte Sprache
 * @param locale - Die gewünschte Sprache (Standard: 'de')
 * @returns Übersetzungsobjekt
 */
export function getTranslations(locale: Locale = DEFAULT_LOCALE): Translations {
  return translations[locale] || translations[DEFAULT_LOCALE]
}

/**
 * Type-safe Zugriff auf verschachtelte Übersetzungen
 * Beispiel: t('marketing.hero.title')
 */
type DeepKeys<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? `${K}` | `${K}.${DeepKeys<T[K]>}`
          : `${K}`
        : never
    }[keyof T]
  : never

type TranslationKey = DeepKeys<Translations>

/**
 * Übersetzungsfunktion mit Type-Safety
 * @param key - Der Übersetzungsschlüssel (z.B. 'common.loading')
 * @param locale - Die gewünschte Sprache (Standard: 'de')
 * @returns Der übersetzte String
 */
export function t(key: TranslationKey, locale: Locale = DEFAULT_LOCALE): string {
  const translations = getTranslations(locale)
  const keys = key.split('.')

  // Durchlaufe den Übersetzungsbaum
  let value: unknown = translations
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = (value as Record<string, unknown>)[k]
    } else {
      console.warn(`Translation key not found: ${key}`)
      return key // Fallback: Zeige den Key selbst
    }
  }

  return typeof value === 'string' ? value : key
}

/**
 * Hook für React-Komponenten (Optional für später)
 * Aktuell nur Client-Side, kann später mit Context erweitert werden
 */
export function useTranslations(locale: Locale = DEFAULT_LOCALE) {
  const translations = getTranslations(locale)

  return {
    t: (key: TranslationKey) => t(key, locale),
    translations,
    locale,
  }
}

// Re-exports für einfachen Import
export { de }
export type { Locale, TranslationKey, Translations }

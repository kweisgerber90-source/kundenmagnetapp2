// lib/csv/exports/testimonials.ts
/**
 * CSV-Export für Testimonials/Bewertungen
 * DSGVO-konform mit IP-Hash statt Raw-IP
 */

import { CSVBuilder, formatDateDE, formatDateISO } from '../index'
import type { CSVExportOptions, TestimonialCSVRow } from '../types'

/**
 * Deutsche Spaltenüberschriften für Testimonials
 */
const TESTIMONIAL_HEADERS: Record<keyof TestimonialCSVRow, string> = {
  id: 'ID',
  campaign_id: 'Kampagnen-ID',
  campaign_name: 'Kampagne',
  author_name: 'Name',
  author_email: 'E-Mail',
  author_company: 'Unternehmen',
  rating: 'Bewertung',
  title: 'Titel',
  content: 'Inhalt',
  status: 'Status',
  created_at: 'Erstellt am',
  approved_at: 'Freigegeben am',
  ip_hash: 'IP-Hash (DSGVO)',
}

/**
 * Status-Übersetzungen (EN -> DE)
 */
const STATUS_TRANSLATIONS: Record<string, string> = {
  pending: 'Ausstehend',
  approved: 'Genehmigt',
  hidden: 'Verborgen',
  deleted: 'Gelöscht',
}

/**
 * Erstellt CSV-Builder für Testimonials
 * @param options - CSV Export-Optionen
 * @returns Konfigurierter CSVBuilder
 */
export function createTestimonialCSVBuilder(
  options: CSVExportOptions = {},
): CSVBuilder<TestimonialCSVRow> {
  const dateFormatter = options.dateFormat === 'iso' ? formatDateISO : formatDateDE

  return new CSVBuilder<TestimonialCSVRow>(
    {
      headers: TESTIMONIAL_HEADERS,
      formatters: {
        status: (value) => STATUS_TRANSLATIONS[String(value)] || String(value),
        created_at: (value) => dateFormatter(value as string),
        approved_at: (value) => dateFormatter(value as string | null),
        rating: (value) => `${value}/5`,
      },
    },
    {
      filename: options.filename || 'bewertungen_export.csv',
      ...options,
    },
  )
}

/**
 * Exportiert Testimonials als CSV
 * @param testimonials - Array von Testimonials
 * @param options - CSV Export-Optionen
 * @returns CSV-String
 */
export function exportTestimonialsToCSV(
  testimonials: TestimonialCSVRow[],
  options: CSVExportOptions = {},
): string {
  const builder = createTestimonialCSVBuilder(options)
  return builder.build(testimonials)
}

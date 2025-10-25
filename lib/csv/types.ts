// lib/csv/types.ts
/**
 * CSV Export Type-Definitionen für Kundenmagnetapp
 * Type-safe CSV-Builder mit deutscher Lokalisierung
 */

/**
 * CSV Export-Optionen
 */
export interface CSVExportOptions {
  filename?: string
  delimiter?: string
  includeHeaders?: boolean
  dateFormat?: 'iso' | 'de' // ISO 8601 oder deutsches Format
  addBOM?: boolean // UTF-8 BOM für Excel-Kompatibilität
}

/**
 * CSV Builder-Konfiguration
 */
export interface CSVBuilderConfig<T> {
  headers: Record<keyof T, string> // Mapping: Key -> Deutsche Überschrift
  formatters?: Partial<Record<keyof T, (value: unknown) => string>> // Custom Formatter
  excludeFields?: Array<keyof T> // Felder ausschließen
}

/**
 * Testimonial CSV Export Row
 */
export interface TestimonialCSVRow {
  id: string
  campaign_id: string
  campaign_name: string
  author_name: string
  author_email: string
  author_company: string
  rating: number
  title: string
  content: string
  status: string
  created_at: string
  approved_at: string | null
  ip_hash: string
}

/**
 * QR Scan CSV Export Row
 */
export interface QRScanCSVRow {
  id: string
  qr_code_id: string
  qr_code_label: string
  campaign_id: string
  campaign_name: string
  scanned_at: string
  user_agent: string
  referrer: string | null
  country: string | null
  city: string | null
}

/**
 * Audit Log CSV Export Row
 */
export interface AuditLogCSVRow {
  id: string
  user_id: string
  user_email: string
  action: string
  entity_type: string
  entity_id: string
  old_values: string
  new_values: string
  ip_hash: string
  created_at: string
}

// lib/csv/exports/audit-logs.ts
/**
 * CSV-Export für Audit Logs
 * Compliance & Nachverfolgung von Änderungen
 */

import { CSVBuilder, formatDateDE, formatDateISO } from '../index'
import type { AuditLogCSVRow, CSVExportOptions } from '../types'

/**
 * Deutsche Spaltenüberschriften für Audit Logs
 */
const AUDIT_LOG_HEADERS: Record<keyof AuditLogCSVRow, string> = {
  id: 'Log-ID',
  user_id: 'Benutzer-ID',
  user_email: 'Benutzer-E-Mail',
  action: 'Aktion',
  entity_type: 'Entitätstyp',
  entity_id: 'Entitäts-ID',
  old_values: 'Alte Werte',
  new_values: 'Neue Werte',
  ip_hash: 'IP-Hash (DSGVO)',
  created_at: 'Zeitstempel',
}

/**
 * Action-Übersetzungen (EN -> DE)
 */
const ACTION_TRANSLATIONS: Record<string, string> = {
  create: 'Erstellt',
  update: 'Aktualisiert',
  delete: 'Gelöscht',
  approve: 'Freigegeben',
  hide: 'Verborgen',
  anonymize: 'Anonymisiert',
  export: 'Exportiert',
  login: 'Anmeldung',
  logout: 'Abmeldung',
}

/**
 * Entity-Type-Übersetzungen (EN -> DE)
 */
const ENTITY_TYPE_TRANSLATIONS: Record<string, string> = {
  campaign: 'Kampagne',
  testimonial: 'Bewertung',
  qr_code: 'QR-Code',
  user: 'Benutzer',
  settings: 'Einstellungen',
}

/**
 * Erstellt CSV-Builder für Audit Logs
 * @param options - CSV Export-Optionen
 * @returns Konfigurierter CSVBuilder
 */
export function createAuditLogCSVBuilder(
  options: CSVExportOptions = {},
): CSVBuilder<AuditLogCSVRow> {
  const dateFormatter = options.dateFormat === 'iso' ? formatDateISO : formatDateDE

  return new CSVBuilder<AuditLogCSVRow>(
    {
      headers: AUDIT_LOG_HEADERS,
      formatters: {
        action: (value) => ACTION_TRANSLATIONS[String(value)] || String(value),
        entity_type: (value) => ENTITY_TYPE_TRANSLATIONS[String(value)] || String(value),
        created_at: (value) => dateFormatter(value as string),
        old_values: (value) => {
          // JSON-String verkürzen, falls zu lang
          const str = String(value || '')
          return str.length > 200 ? str.substring(0, 197) + '...' : str
        },
        new_values: (value) => {
          // JSON-String verkürzen, falls zu lang
          const str = String(value || '')
          return str.length > 200 ? str.substring(0, 197) + '...' : str
        },
      },
    },
    {
      filename: options.filename || 'audit_logs_export.csv',
      ...options,
    },
  )
}

/**
 * Exportiert Audit Logs als CSV
 * @param logs - Array von Audit Logs
 * @param options - CSV Export-Optionen
 * @returns CSV-String
 */
export function exportAuditLogsToCSV(
  logs: AuditLogCSVRow[],
  options: CSVExportOptions = {},
): string {
  const builder = createAuditLogCSVBuilder(options)
  return builder.build(logs)
}

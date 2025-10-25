// lib/csv/exports/qr-scans.ts
/**
 * CSV-Export für QR-Code-Scans
 * Tracking-Daten für Analyse und Reporting
 */

import { CSVBuilder, formatDateDE, formatDateISO } from '../index'
import type { CSVExportOptions, QRScanCSVRow } from '../types'

/**
 * Deutsche Spaltenüberschriften für QR-Scans
 */
const QR_SCAN_HEADERS: Record<keyof QRScanCSVRow, string> = {
  id: 'Scan-ID',
  qr_code_id: 'QR-Code-ID',
  qr_code_label: 'QR-Code-Bezeichnung',
  campaign_id: 'Kampagnen-ID',
  campaign_name: 'Kampagne',
  scanned_at: 'Gescannt am',
  user_agent: 'User Agent',
  referrer: 'Referrer',
  country: 'Land',
  city: 'Stadt',
}

/**
 * Erstellt CSV-Builder für QR-Scans
 * @param options - CSV Export-Optionen
 * @returns Konfigurierter CSVBuilder
 */
export function createQRScanCSVBuilder(options: CSVExportOptions = {}): CSVBuilder<QRScanCSVRow> {
  const dateFormatter = options.dateFormat === 'iso' ? formatDateISO : formatDateDE

  return new CSVBuilder<QRScanCSVRow>(
    {
      headers: QR_SCAN_HEADERS,
      formatters: {
        scanned_at: (value) => dateFormatter(value as string),
        user_agent: (value) => {
          // Kürze sehr lange User Agents
          const str = String(value || '')
          return str.length > 100 ? str.substring(0, 97) + '...' : str
        },
      },
    },
    {
      filename: options.filename || 'qr_scans_export.csv',
      ...options,
    },
  )
}

/**
 * Exportiert QR-Scans als CSV
 * @param scans - Array von QR-Scans
 * @param options - CSV Export-Optionen
 * @returns CSV-String
 */
export function exportQRScansToCSV(scans: QRScanCSVRow[], options: CSVExportOptions = {}): string {
  const builder = createQRScanCSVBuilder(options)
  return builder.build(scans)
}

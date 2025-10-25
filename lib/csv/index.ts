// lib/csv/index.ts
/**
 * Type-safe CSV-Builder für Kundenmagnetapp
 * DSGVO-konform, Excel-kompatibel, deutsche Formatierung
 */

import type { CSVBuilderConfig, CSVExportOptions } from './types'

/**
 * UTF-8 BOM für Excel-Kompatibilität
 */
const UTF8_BOM = '\uFEFF'

/**
 * CSV-sichere Escape-Funktion
 * Escaped Anführungszeichen und umschließt Felder bei Bedarf
 */
function escapeCSVValue(value: string | number | boolean | null | undefined): string {
  if (value === null || value === undefined) {
    return ''
  }

  const stringValue = String(value)

  // Wenn Kommas, Anführungszeichen oder Zeilenumbrüche enthalten sind
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    // Escape doppelte Anführungszeichen durch Verdopplung
    const escaped = stringValue.replace(/"/g, '""')
    return `"${escaped}"`
  }

  return stringValue
}

/**
 * Formatiert ein Datum im deutschen Format
 * @param date - ISO String oder Date-Objekt
 * @returns Formatiertes Datum (DD.MM.YYYY HH:MM:SS)
 */
export function formatDateDE(date: string | Date | null | undefined): string {
  if (!date) return ''

  try {
    const d = typeof date === 'string' ? new Date(date) : date

    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const year = d.getFullYear()
    const hours = String(d.getHours()).padStart(2, '0')
    const minutes = String(d.getMinutes()).padStart(2, '0')
    const seconds = String(d.getSeconds()).padStart(2, '0')

    return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`
  } catch (error) {
    console.error('Date formatting error:', error)
    return String(date)
  }
}

/**
 * Formatiert ein Datum im ISO-Format
 * @param date - ISO String oder Date-Objekt
 * @returns ISO 8601 String
 */
export function formatDateISO(date: string | Date | null | undefined): string {
  if (!date) return ''

  try {
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toISOString()
  } catch (error) {
    console.error('Date formatting error:', error)
    return String(date)
  }
}

/**
 * Type-safe CSV-Builder
 * Erstellt CSV-Strings aus typisiertem Objekt-Array
 */
export class CSVBuilder<T> {
  private config: CSVBuilderConfig<T>
  private options: Required<CSVExportOptions>

  constructor(config: CSVBuilderConfig<T>, options: CSVExportOptions = {}) {
    this.config = config
    this.options = {
      filename: options.filename || 'export.csv',
      delimiter: options.delimiter || ',',
      includeHeaders: options.includeHeaders !== false,
      dateFormat: options.dateFormat || 'de',
      addBOM: options.addBOM !== false,
    }
  }

  /**
   * Erstellt CSV-String aus Daten-Array
   * @param data - Array von Objekten
   * @returns CSV-String
   */
  build(data: T[]): string {
    const lines: string[] = []

    // UTF-8 BOM für Excel hinzufügen
    if (this.options.addBOM) {
      lines.push(UTF8_BOM)
    }

    // Header-Zeile erstellen
    if (this.options.includeHeaders) {
      const headerLine = this.buildHeaderLine()
      lines.push(headerLine)
    }

    // Daten-Zeilen erstellen
    for (const row of data) {
      const dataLine = this.buildDataLine(row)
      lines.push(dataLine)
    }

    return lines.join('\n')
  }

  /**
   * Erstellt Header-Zeile
   */
  private buildHeaderLine(): string {
    const fields = this.getFields()
    const headers = fields.map((field) => {
      const header = this.config.headers[field] || String(field)
      return escapeCSVValue(header)
    })
    return headers.join(this.options.delimiter)
  }

  /**
   * Erstellt Daten-Zeile
   */
  private buildDataLine(row: T): string {
    const fields = this.getFields()
    const values = fields.map((field) => {
      const value = row[field as keyof T]

      // Custom Formatter verwenden, falls vorhanden
      if (this.config.formatters?.[field]) {
        const formatter = this.config.formatters[field]!
        return escapeCSVValue(formatter(value))
      }

      return escapeCSVValue(value as string | number | boolean | null | undefined)
    })
    return values.join(this.options.delimiter)
  }

  /**
   * Gibt Feld-Liste zurück (ohne ausgeschlossene Felder)
   */
  private getFields(): Array<keyof T> {
    const allFields = Object.keys(this.config.headers) as Array<keyof T>
    if (!this.config.excludeFields) {
      return allFields
    }
    return allFields.filter((field) => !this.config.excludeFields?.includes(field))
  }

  /**
   * Erstellt Response-Header für Download
   */
  getResponseHeaders(): Record<string, string> {
    const filename = this.options.filename
    return {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
    }
  }
}

/**
 * Helper: Erstellt CSV-Response für Next.js API Routes
 * @param csv - CSV-String
 * @param filename - Dateiname
 * @returns Response-Objekt
 */
export function createCSVResponse(csv: string, filename: string): Response {
  const headers = new Headers({
    'Content-Type': 'text/csv; charset=utf-8',
    'Content-Disposition': `attachment; filename="${filename}"`,
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    Pragma: 'no-cache',
    Expires: '0',
  })

  return new Response(csv, {
    status: 200,
    headers,
  })
}

/**
 * Helper: Sanitize Filename
 * Entfernt unsichere Zeichen aus Dateinamen
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9_\-.]/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^_|_$/g, '')
}

/**
 * Helper: Erstellt Dateiname mit Timestamp
 * @param prefix - Dateiname-Prefix
 * @returns Dateiname mit Timestamp
 */
export function createTimestampedFilename(prefix: string): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')

  return `${prefix}_${year}${month}${day}_${hours}${minutes}.csv`
}

// Re-exports
export * from './exports/audit-logs'
export * from './exports/qr-scans'
export * from './exports/testimonials'
export * from './types'
export type { CSVBuilderConfig, CSVExportOptions }

// /lib/auth/admin.ts
/**
 * 🔐 Admin Authorization Guard
 * Überprüft, ob der aktuelle User Admin-Rechte hat
 */

import { env } from '@/lib/env'
import { createClient } from '@/lib/supabase/server'

/**
 * Liste der Admin User IDs aus ENV
 * Format: ADMIN_USER_IDS=uuid1,uuid2,uuid3
 */
function getAdminUserIds(): string[] {
  const adminIds = env.ADMIN_USER_IDS || ''
  return adminIds
    .split(',')
    .map((id) => id.trim())
    .filter((id) => id.length > 0)
}

/**
 * Prüft, ob ein User Admin-Rechte hat
 */
export async function isAdmin(userId?: string): Promise<boolean> {
  if (!userId) return false

  const adminIds = getAdminUserIds()
  return adminIds.includes(userId)
}

/**
 * Holt den aktuellen User und prüft Admin-Status
 * @throws {Error} wenn nicht authentifiziert oder kein Admin
 */
export async function requireAdmin(): Promise<{ userId: string; isAdmin: true }> {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error('Nicht authentifiziert')
  }

  const adminStatus = await isAdmin(user.id)

  if (!adminStatus) {
    throw new Error('Admin-Rechte erforderlich')
  }

  return { userId: user.id, isAdmin: true }
}

/**
 * Optionale Admin-Prüfung (wirft keinen Error)
 */
export async function checkAdmin(): Promise<{ userId: string | null; isAdmin: boolean }> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { userId: null, isAdmin: false }
    }

    const adminStatus = await isAdmin(user.id)
    return { userId: user.id, isAdmin: adminStatus }
  } catch {
    return { userId: null, isAdmin: false }
  }
}

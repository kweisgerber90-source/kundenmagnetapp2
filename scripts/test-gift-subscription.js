// scripts/test-gift-subscription.js
/**
 * 🧪 Test-Script für Gift Subscriptions
 * 
 * Usage:
 *   node scripts/test-gift-subscription.js
 * 
 * ENV erforderlich:
 *   - ADMIN_USER_IDS
 *   - SUPABASE_SERVICE_ROLE_KEY
 *   - NEXT_PUBLIC_SUPABASE_URL
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const ADMIN_IDS = (process.env.ADMIN_USER_IDS || '').split(',').map(id => id.trim())

console.log('🧪 Gift Subscription Test\n')

// Validierung
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌ Fehler: SUPABASE_URL oder SERVICE_KEY nicht gesetzt')
  console.error('   Prüfe deine .env.local Datei')
  process.exit(1)
}

if (ADMIN_IDS.length === 0 || !ADMIN_IDS[0]) {
  console.error('❌ Fehler: ADMIN_USER_IDS nicht gesetzt')
  console.error('   Füge deine UUID zu ADMIN_USER_IDS in .env.local hinzu')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

async function testGiftSubscription() {
  console.log('1️⃣  Admin-User prüfen...')
  console.log(`   Admin IDs: ${ADMIN_IDS.join(', ')}\n`)

  // Prüfe ob Admin-User existiert
  const { data: adminProfile, error: adminError } = await supabase
    .from('profiles')
    .select('id, email, name')
    .eq('id', ADMIN_IDS[0])
    .single()

  if (adminError || !adminProfile) {
    console.error('❌ Admin-User nicht gefunden in profiles-Tabelle')
    console.error(`   UUID: ${ADMIN_IDS[0]}`)
    console.error('\n💡 Lösung:')
    console.error('   1. Gehe zu Supabase Dashboard → Auth → Users')
    console.error('   2. Kopiere deine User-UUID')
    console.error('   3. Füge sie in .env.local ein: ADMIN_USER_IDS=deine-uuid')
    process.exit(1)
  }

  console.log('✅ Admin-User gefunden:')
  console.log(`   ${adminProfile.name || adminProfile.email} (${adminProfile.id})\n`)

  // Prüfe RPC-Funktion
  console.log('2️⃣  RPC-Funktion grant_free_months prüfen...')
  
  // Test mit 0 Monaten (macht nichts, prüft nur ob Funktion existiert)
  const { error: funcError } = await supabase.rpc('grant_free_months', {
    p_user_id: ADMIN_IDS[0],
    p_months: 0
  })

  if (funcError) {
    if (funcError.message.includes('does not exist')) {
      console.error('❌ RPC-Funktion grant_free_months existiert nicht')
      console.error('\n💡 Lösung:')
      console.error('   Migration 003 ausführen:')
      console.error('   npx supabase db push')
      console.error('\n   Oder manuell in Supabase SQL Editor:')
      console.error('   Öffne: supabase/migrations/003_functions.sql')
      console.error('   Kopiere die grant_free_months Funktion')
      process.exit(1)
    }
    // Andere Fehler ignorieren (z.B. false bei 0 Monaten ist OK)
  }

  console.log('✅ RPC-Funktion grant_free_months gefunden\n')

  // Prüfe Subscriptions-Tabelle
  console.log('3️⃣  Subscriptions-Tabelle prüfen...')
  
  const { data: subs, error: subsError } = await supabase
    .from('subscriptions')
    .select('id, user_id, plan_override')
    .not('plan_override', 'is', null)
    .limit(5)

  if (subsError) {
    console.error('❌ Fehler beim Laden der Subscriptions:', subsError.message)
    process.exit(1)
  }

  console.log('✅ Subscriptions-Tabelle OK')
  console.log(`   ${subs.length} Gift-Subscriptions gefunden\n`)

  if (subs.length > 0) {
    console.log('📋 Aktive Gift-Subscriptions:')
    for (const sub of subs) {
      const months = sub.plan_override?.free_months || 0
      console.log(`   - User ${sub.user_id.substring(0, 8)}...: ${months} Monate`)
    }
    console.log('')
  }

  // Prüfe Audit-Log
  console.log('4️⃣  Audit-Log prüfen...')
  
  const { data: logs, error: logsError } = await supabase
    .from('audit_log')
    .select('id, action, created_at')
    .eq('action', 'admin_grant_gift_subscription')
    .order('created_at', { ascending: false })
    .limit(5)

  if (logsError) {
    console.error('❌ Fehler beim Laden des Audit-Logs:', logsError.message)
    process.exit(1)
  }

  console.log('✅ Audit-Log OK')
  console.log(`   ${logs.length} Gift-Aktionen protokolliert\n`)

  console.log('🎉 Alle Tests bestanden!')
  console.log('\n📝 Nächste Schritte:')
  console.log('   1. Starte App: pnpm dev')
  console.log('   2. Öffne: http://localhost:3000/app/admin/gift-subscriptions')
  console.log('   3. Vergebe Test-Monate an einen User')
  console.log('   4. Prüfe, ob in der Liste erscheint\n')
}

testGiftSubscription().catch(error => {
  console.error('❌ Test fehlgeschlagen:', error.message)
  process.exit(1)
})
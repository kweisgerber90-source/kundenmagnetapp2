/**
 * 🧪 Test Script für BillingGuard
 * Kann lokal ausgeführt werden um Limits zu testen
 *
 * Usage:
 * node scripts/test-billing-guard.ts <userId>
 */

import { createClient } from '@supabase/supabase-js'
const userId = process.argv[2]

if (!userId) {
  console.error('Please provide userId')
  process.exit(1)
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

async function test() {
  // Profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('plan_id, subscription_status')
    .eq('id', userId)
    .single()

  console.log('Profile:', profile)

  // Widget usage today
  const today = new Date().toISOString().slice(0, 10)
  const { data: w } = await supabase
    .from('widget_usage')
    .select('*')
    .eq('user_id', userId)
    .eq('date', today)
    .maybeSingle()

  const { data: q } = await supabase
    .from('qr_usage')
    .select('*')
    .eq('user_id', userId)
    .eq('date', today)
    .maybeSingle()

  console.log('Widget usage today:', w)
  console.log('QR usage today:', q)
}

test()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })

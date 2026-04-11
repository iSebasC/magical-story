import { createClient } from '@supabase/supabase-js'

// Nota: Esta clave NUNCA debe estar expuesta en el lado del cliente.
// Solo se debe usar en Route Handlers (APIs) o Server Actions.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'missing_key_please_add_to_env'

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

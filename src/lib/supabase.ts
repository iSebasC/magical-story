import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Cliente browser que guarda sesión en cookies (para SSR)
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)
